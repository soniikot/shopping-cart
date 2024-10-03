import style from './styles.module.scss';
import arrow from '@/assets/arrow-left.svg';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { FC } from 'react';
import { CategoryData } from '@/components/Filter/Filter';

interface CategoryProps {
  numberOfCategories: number;
  type: any;
}
export const Category: FC<CategoryProps> = ({ numberOfCategories, type }) => {
  const { categories } = useSelector((state: RootState) => state.categories);

  return (
    <div className="container">
      <div className={style.wrapper}>
        {categories[type]
          ?.slice(0, numberOfCategories)
          .map((category: CategoryData) => (
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
              <img className={style.arrow} src={arrow} alt="arrow" />
            </div>
          ))}
      </div>
    </div>
  );
};
