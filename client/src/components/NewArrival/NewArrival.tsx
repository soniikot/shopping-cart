import style from './styles.module.scss';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Link } from 'react-router-dom';

export const NewArrival: FC = () => {
  const { categories } = useSelector((state: RootState) => state.categories);

  return (
    <div className="container">
      <div className={style.wrapper}>
        {categories?.men.slice(0, 4).map((category) => (
          <div key={category.id} className={style.gridItem}>
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
