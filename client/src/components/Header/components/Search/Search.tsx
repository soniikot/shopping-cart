import style from './styles.module.scss';
import search from '@/assets/search.svg';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearch } from '../../../../features/Search/SearchSlice';
import { useSelector } from 'react-redux';

export const Search: FC = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.search.searchQuery);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/products?search=${searchQuery}`);
  };

  const handleChange = (event) => {
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
