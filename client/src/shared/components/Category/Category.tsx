import { useEffect, useState } from 'react';
import style from './styles.module.scss';
import axios from 'axios';
import arrow from '@/assets/arrow-left.svg';
interface Category {
  numberOfCategories: number;
}

export const Category: React.FC<Category> = ({ numberOfCategories }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL + '/subcategories?populate=*'}`,
          {
            headers: {
              Authorization: `bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className={style.wrapper}>
        {categories.slice(0, numberOfCategories).map((category) => (
          <div key={category.id} className={style.card}>
            <img
              className={style.img}
              src={
                import.meta.env.VITE_API_UPLOAD_URL +
                category.attributes.img.data.attributes.url
              }
              alt={category.attributes.title}
            />
            <p className={style.title}>{category.attributes.title}</p>
            <a className={style.link} href="">
              Explore Now!
            </a>
            <img className={style.arrow} src={arrow} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};
