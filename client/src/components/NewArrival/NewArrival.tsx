import style from './styles.module.scss';
import { FC } from 'react';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setCategory } from '@/features/filter/filterSlice';
import { setGender } from '@/features/filter/filterSlice';

export const NewArrival: FC = () => {
  const navigate = useNavigate();
  const { categories } = useAppSelector((state: RootState) => state.categories);
  const dispatch = useAppDispatch();
  const handleCategoryClick = (category: string) => {
    navigate('/products/');
    dispatch(setCategory(category));
    dispatch(setGender('men'));
  };
  return (
    <div className="container">
      <div className={style.wrapper}>
        {categories?.men.slice(0, 4).map((category) => (
          <div
            key={category.id}
            className={style.gridItem}
            onClick={() => handleCategoryClick(category.attributes.title)}
          >
            <Link to="/products/">
              <div className={style.card}>
                <div className={style.img_wrapper}>
                  <img
                    className={style.img}
                    src={
                      import.meta.env.VITE_API_UPLOAD_URL +
                      category.attributes.img.data.attributes.url
                    }
                    alt={category.attributes.title}
                  />
                </div>
                <h5 className={style.title}>{category.attributes.title}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
