import style from './styles.module.scss';
import { REVIEWS } from '@/components/Feedback/constants';
import { FC } from 'react';

export const Feedback: FC = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        {REVIEWS.map((review) => (
          <div className={style.card}>
            <div className={style.header}>
              <img src={review.img} alt="" />
              <img src={review.stars} alt="" />
            </div>
            <div className={style.body}>
              <h4>{review.name}</h4>
              <p className={style.text}>{review.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
