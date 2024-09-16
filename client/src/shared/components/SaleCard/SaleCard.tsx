import style from './styles.module.scss';
import { FC } from 'react';

interface SaleCardProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  discount: string;
}

export const SaleCard: FC<SaleCardProps> = ({
  backgroundImage,
  title,
  subtitle,
  discount,
}) => {
  return (
    <div
      className={style.sales_card}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h5 className={style.subtitle}>{subtitle}</h5>
      <h2 className={style.title}>{title}</h2>
      <p>{discount}</p>
      <h5 className={style.link}>
        <a href="">Explore Items</a>
      </h5>
    </div>
  );
};
