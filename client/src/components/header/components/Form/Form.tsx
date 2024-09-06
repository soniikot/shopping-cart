// how to setup vite  project aliases
// viteConfig???

// @image/sdf
// @pages//
// @components
//
import style from './styles.module.scss';
import heart from '../../../../assets/heart.svg';
import user from '../../../../assets/user.svg';
import shoppingCart from '../../../../assets/shopping-cart.svg';
import { IconButton } from '../../../../shared/components/IconButton/IconButton';

const Form = () => {
  return (
    <div className={style.form}>
      <IconButton icon={heart} />
      <IconButton icon={user} />
      <IconButton icon={shoppingCart} />
    </div>
  );
};

export default Form;
