import style from './styles.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setGender } from '@/features/filter/filterSlice';
import { resetFilter } from '@/features/filter/filterSlice';

export const Menu: FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const handleGenderChange = (gender: string) => {
    navigate('/products/');
    dispatch(setGender(gender));
  };

  const handleShopAllClick = () => {
    dispatch(resetFilter());
  };

  return (
    <ul className={style.header_menu}>
      <li>
        <Link
          to={'/products/'}
          className={style.link}
          onClick={handleShopAllClick}
        >
          Shop All
        </Link>
      </li>
      <li className={style.link} onClick={() => handleGenderChange('men')}>
        Men
      </li>
      <li className={style.link} onClick={() => handleGenderChange('women')}>
        Women
      </li>
    </ul>
  );
};
