import { useMemo } from 'react';

interface Cart {
  products: string[];
}
function Cart: React.FC <Cart>({ products }) {
  const totalPrice = useMemo(() => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }, [products]);

  return (
    <div>
      {/* Some other content in the cart */}
      {/* Products to display */}
      <p>
        Total Price: <strong>${totalPrice}</strong>
      </p>
      {/* Some button to checkout */}
    </div>
  );
}

export default Cart;
