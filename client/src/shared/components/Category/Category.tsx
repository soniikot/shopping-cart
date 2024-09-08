import { useEffect, useState } from 'react';
import style from './styles.module.scss';
import axios from 'axios';

export const Category = () => {
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
    <div className={style.wrapper}>
      {categories.map((category) => (
        <div key={category.id} className={style.card}>
          <img
            src={category.attributes.image}
            alt={category.attributes.title}
          />
          <h6>{category.attributes.title}</h6>
        </div>
      ))}
    </div>
  );
};
