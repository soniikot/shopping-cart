import style from './styles.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ProductData } from '@/types/interfaces';
import { ProductsType } from '@/types/interfaces';

export const Products: React.FC<ProductsType> = ({
  numberOfProducts,
  filter,
}) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL + filter}`,
          {
            headers: {
              Authorization: `bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );

        response.data.data && setProducts(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className={style.wrapper}>
        {products.length > 0 &&
          products.slice(0, numberOfProducts).map((product) => (
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
          ))}
      </div>
    </div>
  );
};
