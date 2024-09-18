import style from './styles.module.scss';
import { SaleCardProps } from '@/types/interfaces';

export const SaleCard: FC<SaleCardProps> = (props) => {
  const { backgroundImage, title, subtitle, discount } = props;
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
