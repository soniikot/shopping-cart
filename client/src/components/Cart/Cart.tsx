import { useMemo } from 'react';
import { CartProps } from '@/types/interfaces';

const Cart: React.FC<CartProps> = ({ products }) => {
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
        Total Price: <strong>${totalPrice.toFixed(2)}</strong>
      </p>
      {/* Some button to checkout */}
    </div>
  );
};

export default Cart;
