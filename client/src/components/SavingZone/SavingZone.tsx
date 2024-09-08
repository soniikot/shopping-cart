import style from './styles.module.scss';
import { SAVING_ZONE } from '../../constants/savingZone';
import arrow from '../../assets/arrow .svg';
import { LimitedStock } from '../../shared/components/LimitedStock/LimitedStock';
import clsx from 'clsx';

export const SavingZone = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        {SAVING_ZONE.map((item) => (
          <div
            key={item.id}
            className={clsx(style.item, {
              [style.item_black]: item.isBlack,
              [style.item_right]: item.isRightAlignment,
              [style.item_regular]: !item.isRightAlignment && !item.isBlack,
            })}
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {item.isLimited && <LimitedStock />}
            <h3 className={style.title}>{item.title}</h3>
            <h6 className={style.subtitle}>{item.subtitle}</h6>
            <p>{item.discount}</p>
            <img className={style.arrow} src={arrow} alt="" />
            <button className={style.button}>Shop Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};
