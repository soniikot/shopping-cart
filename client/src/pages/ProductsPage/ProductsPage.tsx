import { SectionTitle } from '@/shared/components/SectionTitle/SectionTitle';
import { Products } from '@/components/Products/Products';
import { Filter } from '@/components/Filter/Filter';

import style from './styles.module.scss';
export const ProductsPage = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        <Filter />
        <Products numberOfProducts={9} filter={'/products?populate=*'} />
      </div>
      <SectionTitle text="Clothing for Women Online in India" />
      <SectionTitle text="Buy Womens Clothing at Best Price" />
    </div>
  );
};
