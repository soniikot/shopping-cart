import style from './styles.module.scss';
import { COLORS } from '@/shared/constants/constants';
import { FC } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setColor } from '@/features/filter/filterSlice';

export const ColorFilter: FC = () => {
  const dispatch = useAppDispatch();

  const handleColorChange = (color: string) => {
    dispatch(setColor(color));
  };
  return (
    <div className={style.wrapper}>
      {COLORS.map((color) => (
        <div className={style.card}>
          <div
            key={color.id}
            className={style.color}
            style={{ backgroundColor: color.color }}
            onClick={() => handleColorChange(color.title)}
          ></div>
          <span>{color.title}</span>
        </div>
      ))}
    </div>
  );
};
