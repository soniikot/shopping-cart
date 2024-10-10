import { useAppDispatch } from '@/app/hooks';
import { increaseCount, decreaseCount } from '@/features/cart/cartSlice';
import style from './styles.module.scss';
import { FC } from 'react';

interface PlusMinusButtonProps {
  id: number;
  count: number;
}

export const PlusMinusButton: FC<PlusMinusButtonProps> = ({ id, count }) => {
  const dispatch = useAppDispatch();

  const incrementCount = (id: number) => {
    dispatch(increaseCount({ id }));
  };
  const decrementCount = (id: number) => {
    dispatch(decreaseCount({ id }));
  };
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
