import { useEffect } from 'react';
import style from './category.module.css';
import axios from 'axios';

export const Category = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`${import.meta.env.VITE_API_URL}`, {
          headers: {
            Authorization: `bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []); /*
  return (
    <div className={style.wrapper}>
      {categories.map((category) => (
        <div key={category.id} className={style.card}>
          <img src={category.image} alt={category.title} />
          <h6>{category.title}</h6>
        </div>
      ))}
    </div>
  );*/
};
