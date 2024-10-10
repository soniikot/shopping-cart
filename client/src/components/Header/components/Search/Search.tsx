import style from './styles.module.scss';
import search from '@/assets/search.svg';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setSearch } from '../../../../features/Search/SearchSlice';
import { useAppSelector } from '@/app/hooks';
import { ChangeEvent } from 'react';
import { RootState } from '@/app/store';

export const Search: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(
    (state: RootState) => state.search.searchQuery
  );

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/products?search=${searchQuery}`);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(event.target.value));
  };

  return (
    <form className={style.wrapper} onSubmit={handleSubmit}>
      <input
        className={style.search}
        type="search"
        placeholder="Search"
        value={searchQuery}
        onChange={handleChange}
      />
      <button className={style.button} type="submit">
        <img className={style.icon} src={search} alt="search" />
      </button>
    </form>
  );
};
