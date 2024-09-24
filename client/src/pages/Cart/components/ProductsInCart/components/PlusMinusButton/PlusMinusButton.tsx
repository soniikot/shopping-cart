import { useState } from 'react';
import style from './styles.module.scss';

export const PlusMinusButton = () => {
  let [count, setCount] = useState(0);

  function incrementCount() {
    count = count + 1;
    setCount(count);
  }
  function decrementCount() {
    count = count - 1;
    setCount(count);
  }
  return (
    <div className={style.wrapper}>
      <button className={style.button} onClick={decrementCount}>
        -
      </button>
      <div>{count}</div>
      <button className={style.button} onClick={incrementCount}>
        +
      </button>
    </div>
  );
};
