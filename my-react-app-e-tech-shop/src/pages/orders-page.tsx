import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orders";

type Order = {
  id: number;
  createdAt: string;
  totalPrice: number;
  status: string;
  items: { 
    product: { name: string }; 
    quantity: number; 
    price: number;
  }[];
};

type Props = { token: string; };

function OrdersPage({ token }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getMyOrders(token).then(setOrders);
  }, [token]);

  const formatPrice = (value: number) => 
    value.toLocaleString("uk-UA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div>
      <h2>Історія замовлень</h2>

      {orders.length === 0 && <p>Замовлень поки немає</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата</th>
            <th>Товари</th>
            <th>Сума</th>
            <th>Статус</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>
                {o.items.map((i, idx) => (
                  <div key={idx}>
                    {i.product.name} x {i.quantity}
                  </div>
                ))}
              </td>
              <td>{formatPrice(o.totalPrice)} ₴</td>
              <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export default OrdersPage;