import style from './styles.module.scss';

const Search = () => {
  return (
    <form>
      <input
        className={style.search}
        type="search"
        placeholder="Search"
      ></input>
    </form>
  );
};

export default Search;
