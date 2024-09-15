import { SectionTitle } from '@/shared/components/SectionTitle/SectionTitle';
import { Products } from '@/components/Products/Products';
import { Filter } from '@/components/Filter/Filter';

import style from './styles.module.scss';
export const ProductsPage = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        <Filter />
        <Products numberOfProducts={12} filter={'/products?populate=*'} />
      </div>
      <SectionTitle text="Clothing for Women Online in India" />
      <h4>Reexplore Women's Clothing Collection Online at Euphoria</h4>
      <p>
        Women's Clothing – Are you searching for the best website to buy
        Clothing for Women online in India? Well, your search for the coolest
        and most stylish womens clothing ends here. From trendy Casual Womens
        Wear Online shopping to premium quality cotton women's apparel, Euphoria
        has closet of Women Collection covered with the latest and best designs
        of Women's Clothing Online.
      </p>
      <p>
        Our collection of clothes for women will make you the trendsetter with
        an iconic resemblance of choice in Womens Wear.{' '}
      </p>

      <h4>One-Stop Destination to Shop Every Clothing for Women: Euphoria</h4>
      <p>
        Today, Clothing for Women is gaining more popularity above all. This is
        because gone are the days when women were used to carrying uncomfortable
        fashion. Today, a lady looks prettier when she is in Casual Womens Wear
        which is a comfortable outfit. Concerning this, Euphoria has a big fat
        range of Stylish Women's Clothing that would make her the winner
        wherever she goes.{' '}
      </p>
      <p>
        Our collection of clothes for women will make you the trendsetter with
        an iconic resemblance of choice in Womens Wear. It is quite evident to
        say that there are very few Womens Clothing online stores where you can
        buy Western Wear for Women comprising the premium material and elegant
        design that you are always seeking for. Basically,{' '}
      </p>
      <h4>See More</h4>
      <SectionTitle text="Buy Womens Clothing at Best Price" />
    </div>
  );
};
