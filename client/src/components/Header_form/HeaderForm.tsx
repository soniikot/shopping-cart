import heart from '../../assets/heart.svg';
import user from '../../assets/user.svg';
import shoppingCart from '../../assets/shopping-cart.svg';
import './headerForm.css';

const Header_form = () => {
  return (
    <div className="header__form">
      <button type="button">
        <img src={heart} alt="like" />
      </button>
      <button type="button">
        <img src={user} alt="like" />
      </button>
      <button type="button">
        <img src={shoppingCart} alt="like" />
      </button>
    </div>
  );
};

export default Header_form;
