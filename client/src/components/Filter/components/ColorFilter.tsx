import style from './styles.module.scss';
import { COLORS } from '@/shared/constants/constants';
import { FC } from 'react';

export const ColorFilter: FC = () => {
  return (
    <div className={style.wrapper}>
      {COLORS.map((color) => (
        <div className={style.card}>
          <div
            key={color.id}
            className={style.color}
            style={{ backgroundColor: color.color }}
          ></div>
          <span>{color.title}</span>
        </div>
      ))}
    </div>
  );
};
