import style from './styles.module.scss';
import { FC } from 'react';
import { Link } from 'react-router-dom';
interface SaleCardProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  discount: string;
}

export const SaleCard: FC<SaleCardProps> = (props) => {
  const { backgroundImage, title, subtitle, discount } = props;
  return (
    <div
      className={style.sales_card}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h4 className={style.subtitle}>{subtitle}</h4>
      <h2 className={style.title}>{title}</h2>
      <p>{discount}</p>
      <h4 className={style.link}>
        <Link to="/products">Explore items</Link>
      </h4>
    </div>
  );
};
