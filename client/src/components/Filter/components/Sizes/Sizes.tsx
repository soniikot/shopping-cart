import style from './styles.module.scss';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { setSizes } from '@/features/filter/filterSlice';
import { useState } from 'react';
import clsx from 'clsx';
export const Sizes: FC = () => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState('');

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    dispatch(setSizes(size));
  };

  return (
    <div className={style.wrapper}>
      <button
        className={clsx(style.button, {
          [style.buttonActive]: selectedSize === 'XXS',
        })}
        onClick={() => handleSizeChange('XXS')}
      >
        XXS
      </button>
      <button
        className={clsx(style.button, {
          [style.buttonActive]: selectedSize === 'XS',
        })}
        onClick={() => handleSizeChange('XS')}
      >
        XS
      </button>
      <button
        className={clsx(style.button, {
          [style.buttonActive]: selectedSize === 'S',
        })}
        onClick={() => handleSizeChange('S')}
      >
        S
      </button>
      <button
        className={clsx(style.button, {
          [style.buttonActive]: selectedSize === 'M',
        })}
        onClick={() => handleSizeChange('M')}
      >
        M
      </button>
      <button
        className={clsx(style.button, {
          [style.buttonActive]: selectedSize === 'L',
        })}
        onClick={() => handleSizeChange('L')}
      >
        L
      </button>
      <button
        className={clsx(style.button, {
          [style.buttonActive]: selectedSize === 'XL',
        })}
        onClick={() => handleSizeChange('XL')}
      >
        XL
      </button>
      <button
        className={clsx(style.button, {
          [style.buttonActive]: selectedSize === 'XXL',
        })}
        onClick={() => handleSizeChange('XXL')}
      >
        XXL
      </button>
      <button
        className={clsx(style.button, {
          [style.buttonActive]: selectedSize === '3XL',
        })}
        onClick={() => handleSizeChange('3XL')}
      >
        3XL
      </button>
      <button
        className={clsx(style.button, {
          [style.buttonActive]: selectedSize === '4XL',
        })}
        onClick={() => handleSizeChange('4XL')}
      >
        4XL
      </button>
    </div>
  );
};
