import { useMemo, FC } from 'react';
import { NavigationBar } from './components/NavigationBar/NavigationBar';
import style from './styles.module.scss';
import { ProductsInCart } from './components/ProductsInCart/ProductsInCart';
import { TextButton } from '@/shared/components/TextButton/TextButton';
import clsx from 'clsx';

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

      <div className={clsx(style.bottom, 'container')}>
        <div className={style.discount_wrapper}>
          <h4>Discount Codes</h4>
          <p className={style.grey}>Enter your coupon code if you have one</p>
          <form className={style.form} action="">
            <input type="text" />
            <input
              type="button"
              className={style.button}
              value="Apply Coupon"
            />
          </form>
          <TextButton text="Continue Shopping" buttonColor="white" />
        </div>
        <div className={style.total}>
          <div className={style.text}>
            <h4 className={style.sub_total}>
              <span>Sub Total:</span>
              <span className={style.price}>$43</span>
            </h4>
            <h4 className={style.sub_total}>
              <span>Shipping</span>
              <span className={style.price}>$123</span>
            </h4>
            <h4 className={style.sub_total}>
              <span>Grand Total:</span>
              <span className={style.price}>$88</span>
            </h4>
          </div>
          <TextButton text="Proceed To Checkout" buttonColor="purple" />
        </div>
      </div>
    </>
  );
};
