import { NavigationBar } from './components/NavigationBar/NavigationBar';
import style from './styles.module.scss';
import { PlusMinusButton } from './components/PlusMinusButton/PlusMinusButton';
import iconDelete from '@/assets/deleteicon.svg';
import { TextButton } from '@/shared/components/TextButton/TextButton';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useDispatch } from 'react-redux';
import { removeItem } from '../../features/cart/cartSlice';
import { FC } from 'react';

export interface CartData {
  id: number;
  title: string;
  price: number;
  img: string;
  color: string;
  size: string;
  quantity: number;
}

export const Cart: FC = () => {
  const cart: CartData[] = useSelector((state: RootState) => state.cart.cart);

  const dispatch = useDispatch();

  const handleDeleteItem = (id: number) => {
    dispatch(removeItem(id));
  };

  const subTotalPrice = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  };

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

      <div className={style.container}>
        <div className={clsx(style.grid_row_header, 'container')}>
          <div className={style.header_text}>PRODUCT DETAILS</div>
          <div className={style.header_text}>PRICE</div>
          <div className={style.header_text}>QUANTITY</div>
          <div className={style.header_text}>SHIPPING</div>
          <div className={style.header_text}>SUBTOTAL</div>
          <div className={style.header_text}>ACTION</div>
        </div>
        {cart.length > 0 &&
          cart.map((product) => (
            <div key={product.id} className={clsx(style.grid_row, 'container')}>
              <div className={style.description}>
                <div className={style.image_container}>
                  <img
                    className={style.image}
                    src={import.meta.env.VITE_API_UPLOAD_URL + product.img}
                    alt="clothes"
                  />
                </div>
                <div className={style.description_text}>
                  <h5 className={style.product_title}>{product.title}</h5>
                  <p className={style.small_gray}>Color:{product.color} </p>
                  <p className={style.small_gray}>Size:{product.size} </p>
                </div>
              </div>
              <div className={style.price}>${product.price}</div>
              <div className={style.quantity}>
                <PlusMinusButton id={product.id} count={product.quantity} />
              </div>
              <div className={style.shipping}>FREE</div>
              <div className={style.subtotal}>
                ${product.quantity * product.price}
              </div>
              <div className={style.action}>
                <button
                  onClick={() => {
                    handleDeleteItem(product.id);
                  }}
                >
                  <img src={iconDelete} alt="delete" />
                </button>
              </div>
            </div>
          ))}
      </div>

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
              <span className={style.price}>${subTotalPrice()}</span>
            </h4>
            <h4 className={style.sub_total}>
              <span>Shipping</span>
              <span className={style.price}>Free</span>
            </h4>
            <h4 className={style.sub_total}>
              <span>Grand Total:</span>
              <span className={style.price}>${subTotalPrice()}</span>
            </h4>
          </div>
          <TextButton text="Proceed To Checkout" buttonColor="purple" />
        </div>
      </div>
    </>
  );
};
