import { Hero } from '../../components/hero/Hero';
import { SaleCard } from '../../shared/components/SaleCard/SaleCard';
import backgroundImage2 from '../../assets/salecard2.jpeg';
import backgroundImage1 from '../../assets/salescard1.jpeg';
import { SectionTitle } from '../../shared/components/SectionTitle/SectionTitle';
import { NewArrival } from '../../components/NewArrival/NewArrival';
import style from './homepage.module.css';
import { SavingZone } from '../../components/SavingZone/SavingZone';
import { Banner } from '../../components/Banner/Banner';
import { Category } from '../../shared/components/Category/Category';

export const Homepage = () => {
  return (
    <>
      <Hero />
      <div className={style.sale_wrapper}>
        <SaleCard
          backgroundImage={backgroundImage1}
          title="High Coziness"
          subtitle="Low Price"
          discount="UP TO 50% OFF"
        />
        <SaleCard
          backgroundImage={backgroundImage2}
          title="Breezy Summer Style"
          subtitle="Beyond Presents"
          discount="UP TO 50% OFF"
        />
      </div>

      <SectionTitle text="New Arrival" />
      <NewArrival />
      <SectionTitle text="Big Saving Zone" />
      <SavingZone />
      <Banner />
      <SectionTitle text="Categories for Men" />
      <Category />
    </>
  );
};
