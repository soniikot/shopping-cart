import { SectionTitle } from '@/shared/components/SectionTitle/SectionTitle';
import { Products } from '@/components/Products/Products';
import { Filter } from '@/components/Header/components/Filter/Filter';
import style from './styles.module.scss';
import { FC } from 'react';

export const ProductsPage: FC = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        <Filter />
        <Products numberOfProducts={8} />
      </div>
      <SectionTitle text="Clothing for Women Online in India" />
      <SectionTitle text="Buy Women's Clothing at Best Price" />
    </div>
  );
};
