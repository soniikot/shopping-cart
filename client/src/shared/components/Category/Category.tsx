import { useEffect, useState } from 'react';
import style from './styles.module.scss';
import axios from 'axios';
import arrow from '@/assets/arrow-left.svg';
import { CategoryData } from '@/types/interfaces';
import { CategoryType } from '@/types/interfaces';

<<<<<<< HEAD
export const Category: React.FC<CategoryType> = ({ numberOfCategories }) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);

=======
export const Category: React.FC<Category> = ({ numberOfCategories }) => {
  const [categories, setCategories] = useState([]);
>>>>>>> develop
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

        response.data.data && setCategories(response.data.data);
        console.log(categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className={style.wrapper}>
<<<<<<< HEAD
        {categories.length > 0 &&
          categories.slice(0, numberOfCategories).map((category) => (
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
=======
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
            <img className={style.arrow} src={arrow} alt="arrow_down" />
          </div>
        ))}
>>>>>>> develop
      </div>
    </div>
  );
};
