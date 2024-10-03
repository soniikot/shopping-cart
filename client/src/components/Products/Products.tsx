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
  const { products } = useSelector((state: RootState) => state.products);
  console.log(search);
  const filteredProducts =
    search.searchQuery.length !== 0
      ? products.filter((product) => {
          const title = product.attributes.title.toLowerCase();
          const searchQuery = search.searchQuery.toLowerCase();
          return title.includes(searchQuery);
        })
      : products;
  console.log(filteredProducts);
  return (
    <div className="container">
      <div className={style.wrapper}>
        {filteredProducts.slice(0, numberOfProducts).map((product) => (
          <Link to={`/product/${product.id - 1}`} key={product.id}>
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
                <div>
                  <p className={style.title}>{product.attributes.title}</p>
                  <p className={style.subtitle}>{product.attributes.disc}</p>
                </div>
                <div className={style.price}>${product.attributes.price}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
