import style from './styles.module.scss';
import filter from '@assets/filter.svg';
import { useState } from 'react';
import linkArrow from '@/assets/link-arrow.svg';
import arrowUp from '@/assets/arrow-up.svg';
import Slider from '@mui/material/Slider';
import { ColorFilter } from './components/ColorFilter';
import { Sizes } from './components/Sizes/Sizes';
import { DRESS_STYLES } from '@/components/Filter/constants';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { setCategory } from '@/features/filter/filterSlice';
import clsx from 'clsx';

export interface CategoryType {
  numberOfCategories: number;
  filter: string;
}

export interface CategoryData {
  id: number;
  attributes: {
    title: string;
    img: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export const Filter: FC = ({ products }) => {
  const [range, setRange] = useState([0, 900]);

  const filteredCategory = useSelector(
    (state: RootState) => state.filter.category
  );

  const dispatch = useDispatch();

  const handleCategoryChange = (category: string) => {
    dispatch(setCategory(category));
  };
  console.log(filteredCategory);
  function handleChanges(event, newValue: number[]) {
    setRange(newValue);
  }

  const categories = [
    'Printed T-Shirts',
    'Plain T-shirt',
    'Polo T-Shirt,',
    'Hoodie & Sweetshirt',
    'Jeans',
    'Activewear',
    'Boxers',
    'Coats & Parkas',
    'Shirts',
  ];

  return (
    <aside>
      <div className={style.wrapper}>
        <div className={style.header}>
          <h4>Filter </h4>
          <img src={filter} alt="filter" />
        </div>

        <div className={style.categories}>
          <ul className={style.subcategory_wrapper}>
            {categories.map((subcategory) => (
              <li
                onClick={() => handleCategoryChange(subcategory)}
                className={clsx(style.subcategory, {
                  [style.active]: filteredCategory === subcategory,
                })}
              >
                {subcategory}
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
