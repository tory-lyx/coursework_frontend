import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "../api/products";
import { changeOrderStatus } from "../api/orders";
import { API_BASE, getHeaders } from "../api/client";

type User = {
  id: number;
  login: string;
  role: string;
  createdAt: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
};

type Order = {
  id: number;
  user: { login: string };
  totalPrice: number;
  status: string;
};

type Props = {
  token: string;
};

function AdminPage({ token }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // NEW STATE
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  // LOADING
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const usersRes = await fetch(`${API_BASE}/admin/users`, { headers: getHeaders(token), });

      const ordersRes = await fetch(`${API_BASE}/admin/orders`, { headers: getHeaders(token), });

      if (!usersRes.ok || !ordersRes.ok) {
        throw new Error("Немає доступу або помилка сервера");
      }

      const usersData = await usersRes.json();
      const ordersData = await ordersRes.json();
      const ProductsData = await getProducts(token);

      setUsers(usersData);
      setOrders(ordersData);
      setProducts(ProductsData);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Помилка завантаження адмінки"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  //confirm 
  const deactivateProduct = async (id: number) => {
    if (!window.confirm("Видалити товар?")) return;

    try {
      await deleteProduct(token, id);
      loadData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleCreateProduct = async () => {
    if (!newName || !newPrice || !newStock) {
      alert("Заповніть всі поля");
      return;
    }

    try {
      await createProduct(token, {
        name: newName,
        price: parseFloat(newPrice),
        stockQuantity: parseInt(newStock),
      });

      // alert 
      alert("Товар успішно створено");

      setNewName("");
      setNewPrice("");
      setNewStock("");

      loadData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const changeStatus = async (id: number) => {
    const newStatus = prompt(
      "Введіть новий статус (Created, Paid, Shipped, Completed, Cancelled): "
    );
    if (!newStatus) return;

    try {
      await changeOrderStatus(token, id, newStatus);
      loadData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h2>Адмін панель</h2>

      {loading && <p>Завантаження...</p>}
      {!loading && users.length === 0 && <p>Немає користувачів</p>}

      {/* USERS */}
      <h3>Користувачі</h3>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Login</th>
            <th>Role</th>
            <th>CreatedAt</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.login}</td>
              <td>{u.role}</td>
              <td>{u.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PRODUCTS */}
      <h3>Товари</h3>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Active</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stockQuantity}</td>
              <td>{String(p.isActive)}</td>
              <td>
                <button onClick={() => deactivateProduct(p.id)}>
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CREATE PRODUCT */}
      <h3>Додати новий товар</h3>

      <input 
        placeholder="Назва" 
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />

      <input 
        type="number" 
        placeholder="Ціна" 
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)} 
      />

      <input 
        type="number" 
        placeholder="Кількість" 
        value={newStock}
        onChange={(e) => setNewStock(e.target.value)} 
      />

      <button onClick={handleCreateProduct}> Додати товар </button>

      {/* ORDERS */}
      <h3>Замовлення</h3>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user.login}</td>
              <td>{o.totalPrice}</td>
              <td>{o.status}</td>
              <td>
                <button onClick={() => changeStatus(o.id)}>
                  Change Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;