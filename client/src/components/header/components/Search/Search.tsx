import style from './styles.module.scss';
import search from '@/assets/search.svg';
import { FC } from 'react';

export const Search: FC = () => {
  return (
    <form className={style.wrapper}>
      <input className={style.search} type="search" placeholder="Search" />
      <img className={style.icon} src={search} alt="search" />
    </form>
  );
};
