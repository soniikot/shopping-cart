import style from './styles.module.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FC, useState, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setGender } from '@/features/filter/filterSlice';
import { resetFilter } from '@/features/filter/filterSlice';

export const Menu: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeGender, setActiveGender] = useState('');

  useEffect(() => {
    return () => {
      setActiveGender('');
    };
  }, []);

  const handleGenderChange = (gender: string) => {
    navigate('/products/');
    dispatch(setGender(gender));
    setActiveGender(gender);
  };

  const handleShopAllClick = () => {
    dispatch(resetFilter());
    setActiveGender('all');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <ul className={style.header_menu}>
      <li
        className={`${style.link} ${isActive('/products/') && activeGender === 'all' ? style.active : ''}`}
      >
        <Link to={'/products/'} onClick={handleShopAllClick}>
          Shop All
        </Link>
      </li>
      <li
        className={`${style.link} ${isActive('/products/') && activeGender === 'men' ? style.active : ''}`}
        onClick={() => handleGenderChange('men')}
      >
        Men
      </li>
      <li
        className={`${style.link} ${isActive('/products/') && activeGender === 'women' ? style.active : ''}`}
        onClick={() => handleGenderChange('women')}
      >
        Women
      </li>
    </ul>
  );
};
