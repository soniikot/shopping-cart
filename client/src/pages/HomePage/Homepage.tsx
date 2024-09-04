import Header from '../../components/header/Header';
import { Hero } from '../../components/hero/Hero';
import { SaleCard } from '../../shared/SaleCard/SaleCard';
import backgroundImage2 from '../../assets/salecard2.jpeg';
import backgroundImage1 from '../../assets/salescard1.jpeg';
import { SectionTitle } from '../../shared/SectionTitle/SectionTitle';
import style from './homepage.module.css';

export const Homepage = () => {
  return (
    <>
      <Header />
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
          title="Breezy Summer
          Style"
          subtitle="Beyond Presents"
          discount="UP TO 50% OFF"
        />
      </div>

      <SectionTitle text="New Arrival" />
    </>
  );
};
