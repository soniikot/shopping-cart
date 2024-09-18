import { FC } from 'react';
import style from './styles.module.scss';
import img1 from '@/assets/product_p.png';
import stars from '@/assets/3and5stars.png';
import button_up from '@/assets/button_up.svg';
import button_down from '@/assets/button_down.svg';
import message from '@/assets/message.svg';

export const ProductPage: FC = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.images}>
        <div className={style.side_images}>
          <img src={img1} alt="Raven Hoodie" className={style.image} />
          <img src={img1} alt="Raven Hoodie" className={style.image} />
          <img src={img1} alt="Raven Hoodie" className={style.image} />
          <div className={style.navigation}>
            <img src={button_up} alt="up" />
            <img src={button_down} alt="down" />
          </div>
        </div>
        <div>
          <img src={img1} alt="Raven Hoodie" className={style.image} />
        </div>
      </div>

      <div className={style.details}>
        <h5>Shop &gt; Women &gt; Top </h5>
        <h2 className={style.title}>Raven Hoodie With Black colored Design</h2>
        <div className={style.rating}>
          <img src={stars} alt="stars" />
          <h5 className={style.comments}> 3.5 </h5>
          <img src={message} alt="comment" />

          <h5 className={style.comments}>120 comments</h5>
        </div>
        <h5 className={style.size_guide}>
          <span className={style.dark_text}>Select Size</span>{' '}
          <a href="#">Size Guide</a>
        </h5>
        <div className={style.sizes}>
          <button>XS</button>
          <button> S</button>
          <button>M</button>
          <button>L</button>
          <button>XL</button>
        </div>
        <div className={style.colors}>
          Colors Available
          <div className="colors">
            <div className="color color-black"></div>
            <div className="color color-yellow"></div>
            <div className="color color-pink"></div>
            <div className="color color-red"></div>
          </div>
        </div>
        <div className="price">$63.00</div>
        <button className="add-to-cart">Add to cart</button>
        <div className="product-details-footer">
          <div className="footer-item">
            <i className="footer-icon fa fa-credit-card"></i>
            <span className="footer-text">Secure payment</span>
          </div>
          <div className="footer-item">
            <i className="footer-icon fa fa-tshirt"></i>
            <span className="footer-text">Size & Fit</span>
          </div>
        </div>
        <div className="product-details-footer">
          <div className="footer-item">
            <i className="footer-icon fa fa-truck"></i>
            <span className="footer-text">Free shipping</span>
          </div>
          <div className="footer-item">
            <i className="footer-icon fa fa-exchange"></i>
            <span className="footer-text">Free Shipping & Returns</span>
          </div>
        </div>
        <div className="product-description">
          <div className="description-title">Product Description</div>
          <div className="description-text">
            100% Bio-washed Cotton - makes the fabric extra soft & silky.
            Flexible ribbed crew neck. Precisely stitched with no pilling & no
            fading. Provide all-time comfort. Anytime, anywhere. Infinite range
            of matte-finish HD prints.
          </div>
        </div>
      </div>
    </div>
  );
};
