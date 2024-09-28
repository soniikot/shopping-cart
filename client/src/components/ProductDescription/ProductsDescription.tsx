import style from './styles.module.scss';
import message from '@/assets/message.svg';
import stars from '@/assets/3and5stars.png';
import { COLORS } from '@/shared/constants/constants';
import { TextButton } from '@/shared/components/TextButton/TextButton';
import { IconButtonWithText } from '@/shared/components/IconButtonWIthText/IconButtonWithText';
import cart from '@/assets/shopping-cart-white.svg';
import cc from '@assets/cc.svg';
import fit from '@assets/fit.svg';
import shipping from '@assets/shipping.svg';
import returns from '@assets/return.svg';
import { Feature } from './components/Feature/Feature';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { FC } from 'react';
interface ProductDescriptionProps {
  id?: string;
  onAddToCart: () => void;
}

export const ProductsDescription: FC<ProductDescriptionProps> = ({
  id,
  onAddToCart,
}) => {
  const { products } = useSelector((state: RootState) => state.products);

  return (
    <div className={style.details}>
      <h5>Shop &gt; Women &gt; Top </h5>
      <h2 className={style.title}>
        {products.length > 0 && products[id].attributes.title}
      </h2>
      <div className={style.rating}>
        <img src={stars} alt="stars" />
        <h5 className={style.comments}> 3.5 </h5>
        <img src={message} alt="comment" />

        <h5 className={style.comments}>120 comments</h5>
      </div>

      <h5 className={style.size_guide}>
        <span className={style.dark_text}>Select Size</span>
        <a href="#">Size Guide</a>
        <i className="fas fa-arrow-right"></i>
      </h5>

      <div className={style.sizes}>
        <button className={style.size_button}>XS</button>
        <button className={style.size_button}>S</button>
        <button className={style.size_button}>M</button>
        <button className={style.size_button}>L</button>
        <button className={style.size_button}>XL</button>
      </div>
      <div className={style.colors}>
        <h5>Colors Available</h5>
        <div>
          {COLORS.slice(0, 4).map((color) => (
            <button
              key={color.id}
              className={style.color}
              style={{ backgroundColor: color.color }}
            >
              &nbsp;
            </button>
          ))}
        </div>
      </div>

      <div className={style.buttons}>
        <button onClick={onAddToCart}>Test</button>
        <IconButtonWithText
          onClick={onAddToCart}
          text="Add to cart"
          icon={cart}
          buttonColor="purple"
        />
        <TextButton
          text={`$${products.length > 0 && products[id].attributes.price}`}
          buttonColor="white"
        />
      </div>

      <div className={style.features}>
        <Feature icon={cc} text="Secure payment" />
        <Feature icon={fit} text="Size & Fit" />
        <Feature icon={shipping} text="Free shipping" />
        <Feature icon={returns} text="Free returns" />
      </div>
    </div>
  );
};
