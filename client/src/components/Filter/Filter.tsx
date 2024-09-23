import style from './styles.module.scss';
import filter from '@assets/filter.svg';
import axios from 'axios';
import { useEffect, useState } from 'react';
import linkArrow from '@/assets/link-arrow.svg';
import arrowUp from '@/assets/arrow-up.svg';
import Slider from '@mui/material/Slider';
import { ColorFilter } from './components/ColorFilter';
import { Sizes } from './components/Sizes/Sizes';
import { DRESS_STYLES } from '@/components/Filter/constants';
import { CategoryData } from '@/types/interfaces';
import { FC } from 'react';

export const Filter: FC = () => {
  const [subcategories, setSubcategories] = useState<CategoryData[]>([]);
  const [range, setRange] = useState([0, 900]);

  function handleChanges(event, newValue: number[]) {
    setRange(newValue);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL + '/subcategories'}`,
          {
            headers: {
              Authorization: `bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        response.data.data && setSubcategories(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <aside>
      <div className={style.wrapper}>
        <div className={style.header}>
          <h4>Filter </h4>
          <img src={filter} alt="" />
        </div>

        <div className={style.categories}>
          <ul className={style.subcategory_wrapper}>
            {subcategories.slice(0, 9).map((subcategory) => (
              <li className={style.subcategory}>
                {subcategory.attributes.title}
                <img src={linkArrow} alt="" />
              </li>
            ))}
          </ul>
        </div>

        <div className={style.header}>
          <h4>Price </h4>
          <img src={arrowUp} alt="" />
        </div>
        <div className={style.slider}>
          <div style={{ width: '225px', padding: '5px' }}>
            <Slider
              value={range}
              onChange={handleChanges}
              color="secondary"
              min={0}
              max={900}
            />
            <div className={style.range}>
              <button className={style.button}>{range[0]}</button>
              <button className={style.button}>{range[1]}</button>
            </div>
          </div>
        </div>
        <div className={style.header}>
          <h4>Colors </h4>
          <img src={arrowUp} alt="" />
        </div>
        <ColorFilter />
        <div className={style.header}>
          <h4>Size </h4>
          <img src={arrowUp} alt="" />
        </div>
        <Sizes />
        <div className={style.header}>
          <h4>Dress Style </h4>
          <img src={arrowUp} alt="" />
        </div>

        <div className={style.categories}>
          <ul className={style.subcategory_wrapper}>
            {DRESS_STYLES.map((item) => (
              <li className={style.subcategory}>
                {item}
                <img src={linkArrow} alt="" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};
