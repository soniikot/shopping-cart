import style from './styles.module.scss';
import { TextButton } from '../../shared/components/TextButton/TextButton.tsx';

// todo folder ./Hero !

export const Hero = () => {
  return (
    <div className={style.background}>
      <div className="container">
        <div className={style.wrapper}>
          <div className={style.title}>
            <h5>T-Shirts/Tops</h5>
            <h1>Summer Value Pack</h1>
            <h5>cool / colorful / comfy</h5>
            <TextButton text="Shop Now" />
          </div>
        </div>
      </div>
    </div>
  );
};
