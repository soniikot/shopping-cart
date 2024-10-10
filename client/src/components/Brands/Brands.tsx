import style from './styles.module.scss';
import nike from '@/assets/nike.png';
import handm from '@/assets/handm.png';
import levi from '@/assets/levi.png';
import polo from '@/assets/polo.png';
import puma from '@/assets/puma.png';
import { FC } from 'react';

export const Brands: FC = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        <h2 className={style.title}>Top Brands Deal</h2>
        <p>
          Up To <span className={style.yellow}>60% </span>off on brands
        </p>
        <div className={style.brands_container}>
          <img src={nike} alt="nike" />
          <img src={handm} alt="H&M" />
          <img src={levi} alt="Levi" />
          <img src={polo} alt="Polo" />
          <img src={puma} alt="Puma" />
        </div>
      </div>
    </div>
  );
};
