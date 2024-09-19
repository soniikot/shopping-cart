import style from './styles.module.scss';
import { TextButton } from '../../shared/components/TextButton/TextButton.tsx';
import { FC } from 'react';

export const Hero: FC = () => {
  return (
    <div className={style.background}>
      <div className="container">
        <div className={style.wrapper}>
          <div className={style.text}>
            <h3>T-Shirts / Tops</h3>
            <h1 className={style.title}>Summer Value Pack</h1>
            <h3>cool / colorful / comfy</h3>
            <div className={style.button}>
              <TextButton text="Shop Now" buttonColor="white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
