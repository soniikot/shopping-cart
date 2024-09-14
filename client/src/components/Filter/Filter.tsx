import style from './styles.module.scss';
import filter from '@assets/filter.svg';
import axios from 'axios';
import { useEffect, useState } from 'react';
import linkArrow from '@/assets/link-arrow.svg';
import arrowUp from '@/assets/arrow-up.svg';
import Slider from '@mui/material/Slider';

export const Filter = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [range, setRange] = useState([0, 900]);
  function handleChanges(event, newValue) {
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

        setSubcategories(response.data.data);
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
            {subcategories.map((subcategory) => (
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
              valueLabelDisplay="auto"
            />
            <div className={style.range}>
              <button>{range[0]}</button>
              <button>{range[1]}</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
