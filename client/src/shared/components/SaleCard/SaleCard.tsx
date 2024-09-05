import style from './styles.module.scss';

interface SaleCardProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  discount: string;
}

export const SaleCard: React.FC<SaleCardProps> = ({
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
      <h6>{subtitle}</h6>
      <h2>{title}</h2>
      <p>{discount}</p>
      <h6>
        <a href="">Explore Items</a>
      </h6>
    </div>
  );
};
