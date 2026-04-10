import { useEffect, useState } from "react";
import "./App.css";

import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import ProductsPage from "./pages/products-page";
import OrdersPage from "./pages/orders-page";
import AdminPage from "./pages/admin-page";
import CartModal from "./components/cart-modal";

import { parseJwt } from "./utils/jwt";
import { getProducts } from "./api/products";
import { createOrder } from "./api/orders";

type Page = "login" | "register" | "products" | "admin" | "orders";

type Product = {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
};

function App() {
  const [page, setPage] = useState<Page>("login");
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCart, setShowCart] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  // ВІДНОВЛЕННЯ СЕСІЇ
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedCart = localStorage.getItem("cart");

    if (savedToken) {
      setToken(savedToken);
      const { role } = parseJwt(savedToken);
      setRole(role);
      setPage(role === "Admin" ? "admin" : "products");
    }

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (token) {
      getProducts(token).then(setProducts);
    }
  }, [token]);

  const handleLogin = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);

    const { role } = parseJwt(jwt);
    setRole(role);

    setPage(role === "Admin" ? "admin" : "products");
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    setPage("login");

    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setCart({});
  };  

  const cartCount = Object.values(cart).reduce((a,b) => a + b, 0);

  const checkout = async () => {
    if (!token) return;

    await createOrder(token, cart);
    setCart({});
    localStorage.removeItem("cart");
    setShowCart(false);
  };

  return (
    <div>
      <header className="header">
        <h1>Вітаємо у таємному магазині техніки</h1>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!token && (
            <>
              <button onClick={() => setPage("login")}>Увійти</button>
              <button onClick={() => setPage("register")}>Реєстрація</button>
            </>
          )}

          {token && role === "Customer" && (
            <>
              <button onClick={() => setPage("products")}>Каталог</button>
              <button onClick={() => setPage("orders")}>Історія</button>

              {/* CART BUTTON */}
              <button onClick={() => setShowCart(true)}>
                Кошик ({cartCount})
              </button>

              <button onClick={handleLogout}>Вийти</button>
            </>
          )}

          {token && role === "Admin" && (
            <>
              <button onClick={() => setPage("admin")}>Адмін панель</button>
              <button onClick={() => setPage("products")}>Каталог</button>
              <button onClick={handleLogout}>Вийти</button>
            </>
          )}
        </div>
      </header>

      <main>
        {page === "login" && <LoginPage onLogin={handleLogin} />}
        {page === "register" && <RegisterPage />}

        {page === "products" && token && (
          <ProductsPage 
            token={token} 
            role={role || "Customer"} 
            cart={cart}
            setCart={setCart}
          />
        )}

        {page === "orders" && token && <OrdersPage token={token} />}
        {page === "admin" && token && <AdminPage token={token} />}
      </main>

      {showCart && token && role === "Customer" && (
        <CartModal
          cart={cart}
          products={products} 
          setCart={setCart}
          onClose={() => setShowCart(false)}
          onCheckout={checkout}
        />
      )}
    </div>
  );
}

export default App;