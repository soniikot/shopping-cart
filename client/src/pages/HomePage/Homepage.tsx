import { Hero } from '@/components/Hero/Hero';
import { SectionTitle } from '../../shared/components/SectionTitle/SectionTitle';
import { NewArrival } from '@/components/NewArrival/NewArrival';
import { SavingZone } from '@/components/SavingZone/SavingZone';
import { Banner } from '@/components/Banner/Banner';
import { Category } from '@/shared/components/Category/Category';
import { Brands } from '@/components/Brands/Brands';
import { Products } from '@/components/Products/Products';
import { Feedback } from '@/components/Feedback/Feedback';
import { ExploreSection } from '@/components/ExploreSection/ExploreSection';

export const Homepage = () => {
  return (
    <>
      <Hero />
      <div className="container">
        <ExploreSection />
        <SectionTitle text="New Arrival" />
        <NewArrival />
        <SectionTitle text="Big Saving Zone" />
        <SavingZone />
        <Banner />
        <SectionTitle text="Categories for Men" />
        <Category numberOfCategories={8} filter={'/subcategories?populate=*'} />
        <SectionTitle text="Categories for Women" />
        <Category
          numberOfCategories={4}
          filter={'/categories/1/?populate[0]=subcategories'}
        />
        <Brands />
        <SectionTitle text="In The LimeLight " />
        <Products numberOfProducts={4} />
        <SectionTitle text="Feedback" />
        <Feedback />
      </div>
    </>
  );
};
