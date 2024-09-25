import style from './styles.module.scss';
import { FC } from 'react';
import clsx from 'clsx';
import iconDelete from '@/assets/deletecon.svg';
import { PlusMinusButton } from './components/PlusMinusButton/PlusMinusButton';
import { PRODUCT_SAMPLE } from './constants';
export const ProductsInCart: FC = () => {
  return (
    <div className={style.container}>
      <div className={clsx(style.grid_row_header, 'container')}>
        <div className={style.header_text}>PRODUCT DETAILS</div>
        <div className={style.header_text}>PRICE</div>
        <div className={style.header_text}>QUANTITY</div>
        <div className={style.header_text}>SHIPPING</div>
        <div className={style.header_text}>SUBTOTAL</div>
        <div className={style.header_text}>ACTION</div>
      </div>
      {PRODUCT_SAMPLE.map((product) => (
        <div key={product.id} className={clsx(style.grid_row, 'container')}>
          <div className={style.description}>
            <img src={product.img} alt="clothes" />
            <div className={style.description_text}>
              <h5 className={style.product_title}> {product.productName}</h5>
              <p className={style.small_gray}>Color:{product.color} </p>
              <p className={style.small_gray}>Size:{product.size} </p>
            </div>
          </div>
          <div className={style.price}>${product.price}</div>
          <div className={style.quantity}>
            <PlusMinusButton />
          </div>
          <div className={style.shipping}>FREE</div>
          <div className={style.subtotal}>22</div>
          <div className={style.action}>
            <img src={iconDelete} alt="delete" />
          </div>
        </div>
      ))}
    </div>
  );
};
