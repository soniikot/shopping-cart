import style from './styles.module.scss';

export const Sizes = () => {
  return (
    <div className={style.wrapper}>
      <button className={style.button}>XXS</button>
      <button className={style.button}>XS</button>
      <button className={style.button}>S</button>
      <button className={style.button}>M</button>
      <button className={style.button}>L</button>
      <button className={style.button}>XL</button>
      <button className={style.button}>XXL</button>
      <button className={style.button}>3XL</button>
      <button className={style.button}>4XL</button>
    </div>
  );
};
