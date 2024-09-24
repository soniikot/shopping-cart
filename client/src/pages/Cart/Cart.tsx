import { useMemo, FC } from 'react';
import { NavigationBar } from './components/NavigationBar/NavigationBar';
import style from './styles.module.scss';
import { ProductsInCart } from './components/ProductsInCart/ProductsInCart';

interface ProductsType {
  price: number;
  quantity: number;
}

export const Cart: FC<{ products: ProductsType[] }> = ({ products }) => {
  const totalPrice = useMemo(() => {
    if (products)
      return products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
  }, [products]);

  return (
    <>
      <div className="container">
        <NavigationBar />
        <div className={style.text}>
          <p className={style.grey}>
            Please fill in the fields below and click place order to complete
            your purchase!
          </p>
          <p className={style.grey}>
            Already registered?
            <a href="" className="purple">
              <span className="purple">Please login here</span>
            </a>
          </p>
        </div>
      </div>

      <ProductsInCart />

      <div className="container">
        Total Price: <strong>${totalPrice}</strong>
        {/* Some button to checkout */}
      </div>
    </>
  );
};
