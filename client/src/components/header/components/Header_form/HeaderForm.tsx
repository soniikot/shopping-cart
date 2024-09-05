// how to setup vite  project aliases
// viteConfig???

// @image/sdf
// @pages//
// @components
//

import heart from '../../../../assets/heart.svg';
import user from '../../../../assets/user.svg';
import shoppingCart from '../../../../assets/shopping-cart.svg';
import './headerForm.css';
import { IconButton } from '../../../../shared/IconButton';

//header_from
// PascalCase => folders components
// styles.module.scss
// - images

const HeaderForm = () => {
  return (
    <div className="header__form">
      <IconButton icon={heart} />
      <IconButton icon={user} />
      <IconButton icon={shoppingCart} />
    </div>
  );
};

export default HeaderForm;
