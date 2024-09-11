import style from './styles.module.scss';
import { SAVING_ZONE } from '../../constants/savingZone';
import arrow from '../../assets/arrow .svg';
import { LimitedStock } from '../../shared/components/LimitedStock/LimitedStock';
import clsx from 'clsx';

export const SavingZone = () => {
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
                <img className={style.arrow} src={arrow} alt="" />
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
                <img className={style.arrow} src={arrow} alt="" />
                <button className={style.button}>Shop Now</button>
              </div>
            </div>
          ))}
        </div>{' '}
      </div>
    </div>
  );
};
