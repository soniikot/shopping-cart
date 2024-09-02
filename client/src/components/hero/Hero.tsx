import style from './hero.module.css';
import { TextButton } from '../../shared/TextButton/TextButton.tsx';

export const Hero = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.title}>
        <h5>T-Shirts/Tops</h5>
        <h1>Summer Value Pack</h1>
        <h5>cool / colorful / comfy</h5>
        <TextButton text="Shop Now" />
      </div>
    </div>
  );
};
