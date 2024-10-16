import style from './styles.module.scss';
import arrow from '@/assets/arrow-left.svg';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setCategory } from '@/features/filter/filterSlice';
import { setGender } from '@/features/filter/filterSlice';
import { CategoriesState } from '@/features/categories/categoriesSlice';

interface CategoryProps {
  numberOfCategories: number;
  type: keyof CategoriesState['categories'];
}

export const Category: FC<CategoryProps> = ({ numberOfCategories, type }) => {
  const navigate = useNavigate();
  const { categories } = useAppSelector((state: RootState) => state.categories);

  const dispatch = useAppDispatch();

  const handleCategoryClick = (category: string) => {
    navigate('/products/');
    dispatch(setCategory(category));
    dispatch(setGender(type));
  };
  return (
    <div className="container">
      <div className={style.wrapper}>
        {categories[type].slice(0, numberOfCategories).map((category) => (
          <div
            key={category.id}
            className={style.card}
            onClick={() => handleCategoryClick(category.attributes.title)}
          >
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
