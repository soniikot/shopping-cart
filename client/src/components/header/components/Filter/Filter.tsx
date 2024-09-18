import style from './styles.module.scss';
import { FC } from 'react';

export const Filter: FC = () => {
  return (
    <aside>
      <div className={style.wrapper}>Filter</div>
    </aside>
  );
};
