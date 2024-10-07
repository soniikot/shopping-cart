import style from './styles.module.scss';
import { useSelector } from 'react-redux';
import { FC } from 'react';
import { RootState } from '@/app/store';

export interface ProductsTypeProps {
  numberOfProducts: number;
}

export const Products: FC<ProductsTypeProps> = ({ numberOfProducts }) => {
  const products = useSelector((state: RootState) => state.products.products);
  const filteredProducts = useSelector(
    (state: RootState) => state.products.filteredProducts
  );

  const productsToDisplay =
    filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <div className="container">
      <div className={style.wrapper}>
        {productsToDisplay.length > 0 &&
          productsToDisplay.slice(0, numberOfProducts).map((product) => (
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
