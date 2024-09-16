import { SaleCard } from '@/shared/components/SaleCard/SaleCard';
import backgroundImage2 from '@/assets/salecard2.jpeg';
import backgroundImage1 from '@/assets/salescard1.jpeg';
import style from './styles.module.scss';

export const ExploreSection = () => {
  return (
    <div className={style.wrapper}>
      <div>
        <SaleCard
          backgroundImage={backgroundImage1}
          title="High Coziness"
          subtitle="Low Price"
          discount="UP TO 50% OFF"
        />{' '}
      </div>
      <div>
        <SaleCard
          backgroundImage={backgroundImage2}
          title="Breezy Summer Style"
          subtitle="Beyond Presents"
          discount="UP TO 50% OFF"
        />{' '}
      </div>
    </div>
  );
};
