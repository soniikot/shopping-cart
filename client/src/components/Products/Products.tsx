import style from './styles.module.scss';
import { useSelector } from 'react-redux';
import { FC } from 'react';
import { RootState } from '@/app/store';
import { Link } from 'react-router-dom';

export interface ProductsTypeProps {
  numberOfProducts: number;
}

export const Products: FC<ProductsTypeProps> = ({ numberOfProducts }) => {
  const search = useSelector((state: RootState) => state.search);

  const filteredProducts = useSelector(
    (state: RootState) => state.products.filteredProducts
  );

  /* const filteredProducts =
    search.searchQuery.length !== 0
      ? products.filter((product) => {
          const title = product.attributes.title.toLowerCase();
          const searchQuery = search.searchQuery.toLowerCase();
          return title.includes(searchQuery);
        })
      : products;*/

  return (
    <div className="container">
      <div className={style.wrapper}>
        {filteredProducts.length > 0 &&
          filteredProducts.slice(0, numberOfProducts).map((product) => (
            <div key={product.id} className={style.card}>
              <img
                className={style.img}
                src={
                  import.meta.env.VITE_API_UPLOAD_URL +
                  product.attributes.img.data.attributes.url
                }
                alt={product.attributes.title}
              />

              <div className={style.text_wrapper}>
                <p className={style.title}>{product.attributes.title}</p>
                <p className={style.subtitle}>{product.attributes.disc}</p>
              </div>
              <div className={style.price}>${product.attributes.price}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
