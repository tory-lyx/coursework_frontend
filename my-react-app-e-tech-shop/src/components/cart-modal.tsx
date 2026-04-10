import React, { useMemo } from "react";

type Cart = Record<number, number>;

type Product = {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
};

type Props = {
  cart: Cart;
  products: Product[];
  onClose: () => void;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  onCheckout: () => void;
};

const CartModal = ({ cart, products, onClose, setCart, onCheckout }: Props) => {

  const increment = (id: number) => {
    const updated = { ...cart };
    updated[id] = (updated[id] || 0) + 1;
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const decrement = (id: number) => {
    const updated = { ...cart };
    if (updated[id] > 1) updated[id]--;
    else delete updated[id];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    const updated = { ...cart };
    delete updated[id];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  //total memo
  const total = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = products.find((p) => p.id === Number(id));
      return sum + (product ? product.price * qty : 0);
    }, 0);
  }, [cart, products]);

  const getImageSrc = (product: Product) =>
    `/images/${product.name.toLowerCase().replace(/\s+/g, "_")}.png`;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Ваш кошик</h3>

        {Object.keys(cart).length === 0 && <p>Кошик порожній</p>}

        {Object.entries(cart).map(([id, qty]) => {
          const product = products.find((p) => p.id === Number(id));
          if (!product) return null;

          return (
            <div key={id} className="cart-item">
              <img
                src={getImageSrc(product)}
                alt={product.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/placeholder.png";
                }}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <h4>{product.name}</h4>
                <p>{product.price} ₴</p>

                <small>Сума: {product.price * qty} ₴</small>

                <div className="cart-item-controls">
                  <button onClick={() => decrement(product.id)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => increment(product.id)}>+</button>
                  <button onClick={() => removeItem(product.id)}>Видалити</button>
                </div>
              </div>
            </div>
          );
        })}

        <h4>Разом: {total} ₴</h4>

        {/* disable if empty */}
        <button disabled={!Object.keys(cart).length} onClick={onCheckout}>
          Оформити замовлення
        </button>

        <button onClick={onClose}>Закрити</button>
      </div>
    </div>
  );
};

export default CartModal;
