import style from './styles.module.scss';
import search from '@/assets/search.svg';
const Search = () => {
  return (
    <form className={style.wrapper}>
      <input
        className={style.search}
        type="search"
        placeholder="Search"
      ></input>{' '}
      <img className={style.icon} src={search} alt="" />
    </form>
  );
};

export default Search;
