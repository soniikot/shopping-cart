import { SectionTitle } from '@/shared/components/SectionTitle/SectionTitle';
import { Products } from '@/components/Products/Products';
import { Filter } from '@/components/Filter/Filter';
import { Table } from '@/components/Filter/components/Table/Table';
import style from './styles.module.scss';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';

export const ProductsPage: FC = () => {
  const { products } = useSelector((state: RootState) => state.products);
  console.log(products);
  return (
    <div className="container">
      <div className={style.product_header}>
        <h4>Clothing</h4>
        <div className={style.left}>
          <h4>
            <span className={style.purple_text}>New</span>
          </h4>
          <h4>Recommended</h4>
        </div>
      </div>
      <div className={style.wrapper}>
        <div className={style.filter}>
          <Filter products={products} />
        </div>
        <div className={style.products_wrapper}>
          <Products numberOfProducts={100} />
        </div>
      </div>
      <div className={style.text}>
        <SectionTitle text="Clothing for men and women Online in India" />
        <h4 className={style.subheader}>
          Explore Clothing Collection Online at Euphoria
        </h4>
        <p>
          Clothing – Are you searching for the best website to buy Clothing for
          men and women online in India? Well, your search for the coolest and
          most stylish men and women clothing ends here. From trendy Casual men
          and women Wear Online shopping to premium quality cotton apparel,
          Euphoria has closet of men and women Collection covered with the
          latest and best designs of Clothing Online.
        </p>
        <p>
          Our collection of clothes for men and women will make you the
          trendsetter with an iconic resemblance of choice in Wear.
        </p>

        <h4 className={style.subheader}>
          One-Stop Destination to Shop Every Clothing : Euphoria
        </h4>
        <p>
          Today, Clothing for men and women is gaining more popularity above
          all. This is because gone are the days when men and women were used to
          carrying uncomfortable fashion. Today, a lady looks prettier when she
          is in Casual men and women's Wear which is a comfortable outfit.
          Concerning this, Euphoria has a big fat range of Stylish men and
          women's Clothing that would make her the winner wherever she goes.
        </p>
        <p>
          Our collection of clothes for men and women will make you the
          trendsetter with an iconic resemblance of choice in men and women
          Wear. It is quite evident to say that there are very few men and women
          Clothing online stores where you can buy Western Wear for men and
          women comprising the premium material and elegant design that you are
          always seeking for. Basically,
        </p>
        <h4 className={style.subheader}>See More</h4>
        <SectionTitle text="Buy men and women's Clothing at Best Price" />
      </div>

      <Table />
    </div>
  );
};
