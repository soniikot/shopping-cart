import { Hero } from '@/components/Hero/Hero';
import { SaleCard } from '../../shared/components/SaleCard/SaleCard';
import backgroundImage2 from '@/assets/salecard2.jpeg';
import backgroundImage1 from '@/assets/salescard1.jpeg';
import { SectionTitle } from '../../shared/components/SectionTitle/SectionTitle';
import { NewArrival } from '@/components/NewArrival/NewArrival';
import style from './styles.module.scss';
import { SavingZone } from '@/components/SavingZone/SavingZone';
import { Banner } from '@/components/Banner/Banner';
import { Category } from '@/shared/components/Category/Category';
import { Brands } from '@/components/Brands/Brands';
import { Products } from '@/components/Products/Products';
import { Feedback } from '@/components/Feedback/Feedback';
export const Homepage = () => {
  return (
    <>
      <Hero />
      <div className="container">
        <div className={style.wrapper}>
          <div className={style.card_wrapper}>
            <SaleCard
              backgroundImage={backgroundImage1}
              title="High Coziness"
              subtitle="Low Price"
              discount="UP TO 50% OFF"
            />{' '}
          </div>
          <div className={style.card_wrapper}>
            <SaleCard
              backgroundImage={backgroundImage2}
              title="Breezy Summer Style"
              subtitle="Beyond Presents"
              discount="UP TO 50% OFF"
            />{' '}
          </div>
        </div>

        <SectionTitle text="New Arrival" />
        <NewArrival />
        <SectionTitle text="Big Saving Zone" />
        <SavingZone />
        <Banner />
        <SectionTitle text="Categories for Men" />
        <Category numberOfCategories={8} />
        <SectionTitle text="Categories for Women" />
        <Category numberOfCategories={4} />
        <Brands />
        <SectionTitle text="In The LimeLight " />
        <Products numberOfProducts={4} />
        <SectionTitle text="Feedback" />
        <Feedback />
      </div>
    </>
  );
};
