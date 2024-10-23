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
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

  const handlePriceChanges = (newValue: number[] | number) => {
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
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {' '}
            <h4 className={style.header}>Categories </h4>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <h4 className={style.header}>Price </h4>
          </AccordionSummary>
          <AccordionDetails>
            <div className={style.slider}>
              <div style={{ width: '225px', padding: '5px' }}>
                <Slider
                  value={range}
                  onChange={(_event, value) => handlePriceChanges(value)}
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
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <h4 className={style.header}>Colors </h4>
          </AccordionSummary>

          <AccordionDetails>
            <ColorFilter />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <h4 className={style.header}>Size</h4>
          </AccordionSummary>
          <AccordionDetails>
            <Sizes />
          </AccordionDetails>
        </Accordion>
      </div>
    </aside>
  );
};
