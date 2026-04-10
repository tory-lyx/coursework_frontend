import React, { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { useMessage } from "../components/useMessage";

type Product = {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
};

type Props = {
  token: string;
  role?: string;
  cart: Record<number, number>;
  setCart: React.Dispatch<React.SetStateAction<Record<number, number>>>;
};

function ProductsPage({ token, role = "Customer", cart, setCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);

  const [nameFilter, setNameFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { message, show } = useMessage();

  // LOAD PRODUCTS
  useEffect(() => {

    getProducts(token)
      .then((data) => {
        setProducts(data);
        setFiltered(data);
      })
      .catch(() => show("Помилка завантаження"))
  }, [token]);

  // FILTER
  const handleFilter = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    setFiltered(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
          p.price >= min &&
          p.price <= max
      )
    );
    setCurrentPage(1);
  };

  const addToCart = (id: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      updated[id] = (updated[id] || 0) + 1;
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    show("Товар додано у корзину");
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getImageSrc = (p: Product) =>
    `/images/${p.name.toLowerCase().replace(/\s+/g, "_")}.png`;

  //FLOAT
  const formatPrice = (value: number) => 
    value.toLocaleString("uk-UA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div>
      {message && <div className="custom-message show">{message}</div>}

      <h2>Каталог товарів</h2>

      {/* FILTER */}
      <div>
        <input
          placeholder="Пошук за назвою"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <input
          type="number"
          placeholder="Мін. ціна"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Макс. ціна"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={handleFilter}>Фільтрувати</button>
      </div>

      <div id="products">
        {paginated.map((p) => (
          <div key={p.id} className="product-card">
            <img
              src={getImageSrc(p)}
              alt={p.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/images/placeholder.png";
              }}
            />
            <h4>{p.name}</h4>
            <p>{formatPrice(p.price)} ₴</p>
            <p>{p.stockQuantity > 0 ? "В наявності" : "Немає"}</p>

            {cart[p.id] && <small>У кошику: {cart[p.id]}</small>}

            {role === "Customer" && (
              <button
                disabled={p.stockQuantity === 0}
                onClick={() => addToCart(p.id)}
              >
                Додати у корзину
              </button>
            )}
          </div>
        ))}
      </div>

      <div id="pagination" className="pagination">
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;

          return (
            <button 
              key={page}
              onClick={() => setCurrentPage(page)}
              disabled={currentPage === page}
              className={currentPage === page ? "active-page" : ""}
            >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProductsPage;
