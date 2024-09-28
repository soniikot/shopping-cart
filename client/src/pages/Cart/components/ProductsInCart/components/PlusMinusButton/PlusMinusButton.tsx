import { useDispatch } from 'react-redux';
import { increaseCount, decreaseCount } from '@/features/cart/cartSlice';
import style from './styles.module.scss';

export const PlusMinusButton = ({ id, count }) => {
  const dispatch = useDispatch();

  function incrementCount() {
    dispatch(increaseCount({ id }));
  }
  function decrementCount() {
    dispatch(decreaseCount({ id }));
  }
  return (
    <div className={style.wrapper}>
      <button
        className={style.button}
        onClick={() => {
          decrementCount(id);
        }}
      >
        -
      </button>
      <div>{count}</div>
      <button
        className={style.button}
        onClick={() => {
          incrementCount(id);
        }}
      >
        +
      </button>
    </div>
  );
};
