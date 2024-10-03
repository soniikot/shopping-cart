import style from './styles.module.scss';
import search from '@/assets/search.svg';
import { FC } from 'react';

export const Search: FC = () => {
  //TODO
  /**
   *
   *
   *
   * let navigate = useNavigate();
   **/

  const handleChange = (event) => {
    // router
    //TODO
    /**
          navigate("/products?search=event.target.value");
      **/
    // dispatch(setSearch(event.target.value))
  };

  return (
    <form className={style.wrapper}>
      <input
        className={style.search}
        type="search"
        placeholder="Search"
        onChange={handleChange}
      />
      <img className={style.icon} src={search} alt="search" />
    </form>
  );
};
