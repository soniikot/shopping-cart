import style from './styles.module.scss';
import img from '../../assets/banner.jpeg';
import { TextButton } from '../../shared/components/TextButton/TextButton';

export const Banner = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        <div className={style.banner}>
          <div className={style.text}>
            <h2>WE MADE YOUR EVERYDAY FASHION BETTER</h2>
            <p>
              In our journey to improve everyday fashion, euphoria presents
              EVERYDAY wear range - Comfortable & Affordable fashion 24/7
            </p>
            <div className={style.button}>
              <TextButton text="Shop Now" />
            </div>
          </div>
        </div>
        <div className={style.image_wrapper}>
          <img className={style.img} src={img} alt="group of people" />
        </div>
      </div>
    </div>
  );
};
