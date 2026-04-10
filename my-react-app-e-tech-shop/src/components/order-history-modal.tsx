type OrderItem = {
  product?: {
    name: string;
  };
  quantity: number;
};

type Order = {
  id: number;
  items: OrderItem[];
  totalPrice: number;
  status: string;
};

type Props = {
  orders: Order[];
  onClose: () => void;
};

const OrderHistoryModal = ({ orders, onClose }: Props) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Історія ваших замовлень</h3>

        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Товари</th>
              <th>Кількість</th>
              <th>Сума</th>
              <th>Статус</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => {
              const productsList = o.items
                .map((i) => `${i.product?.name ?? "Unknown"} x${i.quantity}`)
                .join(", ");

              const totalQty = o.items.reduce((sum, i) => sum + i.quantity, 0);

              return (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{productsList}</td>
                  <td>{totalQty}</td>
                  <td>{o.totalPrice}</td>
                  <td>{o.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button onClick={onClose}>Закрити</button>
      </div>
    </div>
  );
};

export default OrderHistoryModal;