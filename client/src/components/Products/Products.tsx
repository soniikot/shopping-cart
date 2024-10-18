import style from './styles.module.scss';
import { FC } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectProducts } from '@/features/products/productsSlice';
import { EmptyList } from '../EmptyList/EmptyList';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
export interface ProductsTypeProps {
  numberOfProducts: number;
  isProductPage?: boolean;
}

export const Products: FC<ProductsTypeProps> = ({
  numberOfProducts,
  isProductPage,
}) => {
  const filteredProducts = useAppSelector(selectProducts);

  return filteredProducts.length === 0 ? (
    <EmptyList text={'Sorry. Nothing found'} />
  ) : (
    <div className="container">
      <div className={style.wrapper}>
        {filteredProducts.slice(0, numberOfProducts).map((product) => (
          <Link to={`/product/${product.id - 1}`} key={product.id}>
            <div key={product.id} className={style.card}>
              <img
                className={clsx(style.img, {
                  [style.productImg]: isProductPage, // Apply productImg class if isProductPage is true
                })}
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
          </Link>
        ))}
      </div>
    </div>
  );
};
