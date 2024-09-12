import style from './styles.module.scss';
import brands from '@/assets/brands.png';

export const Brands = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        <h2 className={style.title}>Top Brands Deal</h2>
        <p>
          Up To <span className={style.yellow}>60%</span>off on brands
        </p>
        <div className={style.brands_container}>
          <img src={brands} alt="brands" />
        </div>
      </div>
    </div>
  );
};
