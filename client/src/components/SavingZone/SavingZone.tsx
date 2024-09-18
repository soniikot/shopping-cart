import style from './styles.module.scss';
import { SAVING_ZONE } from './constants';
import { LimitedStock } from '../../shared/components/LimitedStock/LimitedStock';
import clsx from 'clsx';
import { FC } from 'react';

export const SavingZone: FC = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        <div className={style.first_row}>
          {SAVING_ZONE.slice(0, 3).map((item) => (
            <div
              className={clsx(style.item, {
                [style.item_white]: !item.isBlack,
                [style.item_right]: item.isRightAlignment,
              })}
              key={item.id}
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className={style.text}>
                <div className={style.limited}>
                  {item.isLimited && <LimitedStock />}
                </div>
                <h3 className={style.title}>{item.title}</h3>
                <h6 className={style.subtitle}>{item.subtitle}</h6>
                <p>{item.discount}</p>

                <button className={style.button}>Shop Now</button>
              </div>
            </div>
          ))}
        </div>{' '}
        <div className={style.second_row}>
          {SAVING_ZONE.slice(3, 5).map((item) => (
            <div
              className={clsx(style.item, {
                [style.item_white]: !item.isBlack,
                [style.item_right]: item.isRightAlignment,
              })}
              key={item.id}
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className={style.text}>
                <div className={style.limited}>
                  {item.isLimited && <LimitedStock />}
                </div>
                <h3 className={style.title}>{item.title}</h3>
                <h6 className={style.subtitle}>{item.subtitle}</h6>
                <p>{item.discount}</p>

                <svg
                  className={style.arrow}
                  width="23"
                  height="26"
                  viewBox="0 0 23 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5678 1.28613L11.5678 23.8893M22 15.1958L12.7972 24.3985C12.1182 25.0775 11.0173 25.0775 10.3383 24.3985L1.13557 15.1958"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>

                <button className={style.button}>Shop Now</button>
              </div>
            </div>
          ))}
        </div>{' '}
      </div>
    </div>
  );
};
