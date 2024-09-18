import style from './styles.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FC } from 'react';

interface ProductData {
  id: number;
  attributes: {
    title: string;
    disc: string;
    price: number;
    img: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

interface Products {
  numberOfProducts: number;
}

export const Products: FC<Products> = ({ numberOfProducts }) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL + '/products?populate=*'}`,
          {
            headers: {
              Authorization: `bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );

        if (response.data.data) {
          setProducts(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className={style.wrapper}>
        {products.slice(0, numberOfProducts).map((product) => (
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