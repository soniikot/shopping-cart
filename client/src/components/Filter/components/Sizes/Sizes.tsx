import style from './styles.module.scss';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { setSizes } from '@/features/filter/filterSlice';

export const Sizes: FC = () => {
  const dispatch = useDispatch();

  const handleSizeChange = (sizes) => {
    dispatch(setSizes(sizes));
  };

  return (
    <div className={style.wrapper}>
      <button className={style.button} onClick={() => handleSizeChange('XXS')}>
        XXS
      </button>
      <button className={style.button} onClick={() => handleSizeChange('XS')}>
        XS
      </button>
      <button className={style.button} onClick={() => handleSizeChange('S')}>
        S
      </button>
      <button className={style.button} onClick={() => handleSizeChange('M')}>
        M
      </button>
      <button className={style.button} onClick={() => handleSizeChange('L')}>
        L
      </button>
      <button className={style.button} onClick={() => handleSizeChange('XL')}>
        XL
      </button>
      <button className={style.button} onClick={() => handleSizeChange('XXL')}>
        XXL
      </button>
      <button className={style.button} onClick={() => handleSizeChange('3XL')}>
        3XL
      </button>
      <button className={style.button} onClick={() => handleSizeChange('4XL')}>
        4XL
      </button>
    </div>
  );
};
