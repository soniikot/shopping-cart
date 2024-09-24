import style from './styles.module.scss';
import { FC } from 'react';
import clsx from 'clsx';
import img1 from '@/assets/cart_img1.png';
import img2 from '@/assets/cart_img2.png';
import img3 from '@/assets/cart_img3.png';
import iconDelete from '@/assets/deleteicon.svg';
import { PlusMinusButton } from './components/PlusMinusButton/PlusMinusButton';

interface Product {
  id: number;
  productName: string;
  color: string;
  img: string;
  size: string;
  price: number;
  quantity: number;
  shipping: string | number;
  subtotal: number;
}

const PRODUCT_SAMPLE: Product[] = [
  {
    id: 1,
    img: img1,
    color: 'blue',
    productName: 'Blue Flower Print Crop Top',
    size: 'M',
    price: 29.0,
    quantity: 1,
    shipping: 'FREE',
    subtotal: 29.0,
  },
  {
    id: 2,
    img: img2,
    color: 'lavender',
    productName: 'Lavender Hoodie',
    size: 'XXL',
    price: 119.0,
    quantity: 2,
    shipping: 'FREE',
    subtotal: 119.0,
  },
  {
    id: 3,
    img: img3,
    color: 'black',
    productName: 'Black Sweatshirt',
    size: 'XXL',
    price: 123.0,
    quantity: 2,
    shipping: 5.0,
    subtotal: 123.0,
  },
];

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
