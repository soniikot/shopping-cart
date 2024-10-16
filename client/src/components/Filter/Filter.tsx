import style from './styles.module.scss';
import filter from '@assets/filter.svg';
import { useState } from 'react';
import linkArrow from '@/assets/link-arrow.svg';
import arrowUp from '@/assets/arrow-up.svg';
import Slider from '@mui/material/Slider';
import { ColorFilter } from './components/ColorFilter';
import { Sizes } from './components/Sizes/Sizes';
import { FC } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { resetFilter, setCategory } from '@/features/filter/filterSlice';
import { setPriceRange } from '@/features/filter/filterSlice';
import clsx from 'clsx';
import { CATEGORIES } from './constants';

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

export const Filter: FC = () => {
  const priceRange = useAppSelector((state: RootState) => state.filter.price);

  const [range, setRange] = useState(priceRange);

  const filteredCategory = useAppSelector(
    (state: RootState) => state.filter.category
  );

  const dispatch = useAppDispatch();

  const handleCategoryChange = (category: string) => {
    dispatch(setCategory(category));
  };

  const handleResetFilter = () => {
    dispatch(resetFilter());
  };
  // @ts-ignore
  const handlePriceChanges = (event: Event, newValue: number[] | number) => {
    if (!Array.isArray(newValue)) {
      throw new Error('price range is not a number array');
    }

    setRange(newValue);
    dispatch(setPriceRange(newValue));
  };

  return (
    <aside>
      <div className={style.wrapper}>
        <div className={style.header}>
          <h4>Filter </h4>
          <img src={filter} alt="filter" />
        </div>
        <button className={style.reset} onClick={() => handleResetFilter()}>
          Reset All Filters
        </button>

        <div className={style.categories}>
          <ul className={style.subcategory_wrapper}>
            {CATEGORIES.map((subcategory: string) => (
              <li
                onClick={() => handleCategoryChange(subcategory)}
                className={clsx(style.subcategory, {
                  [style.active]: filteredCategory === subcategory,
                })}
              >
                {subcategory}
                <img src={linkArrow} alt="link" />
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
              onChange={(event, value) => handlePriceChanges(event, value)}
              color="secondary"
              min={0}
              max={200}
            />
            <div className={style.range}>
              <button className={style.button}>{range[0]}</button>
              <button className={style.button}>{range[1]}</button>
            </div>
          </div>
        </div>
        <div className={style.header}>
          <h4>Colors </h4>
          <img src={arrowUp} alt="arrowUp" />
        </div>
        <ColorFilter />
        <div className={style.header}>
          <h4>Size </h4>
          <img src={arrowUp} alt="" />
        </div>
        <Sizes />
      </div>
    </aside>
  );
};
