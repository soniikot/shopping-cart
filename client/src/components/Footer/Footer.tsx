import style from './styles.module.scss';

export const Footer = () => {
  return (
    <div className={style.background}>
      <div className="container">
        <div className={style.wrapper}>
          <ul>
            <li>
              <span className={style.bold}>Need Help</span>
            </li>
            <li>Contact Us</li>
            <li>Track Order</li>
            <li>Return & Refunds</li>
            <li>FAQ's</li>
            <li>Career</li>
          </ul>

          <ul>
            <li>
              <span className={style.bold}>Company</span>
            </li>
            <li>About Us</li>
            <li>Euphoria Blog</li>
            <li>Euphoriastan</li>
            <li>Collaboration</li>
            <li>Media</li>
          </ul>

          <ul>
            <li>
              <span className={style.bold}>More Info</span>
            </li>
            <li>Terms and Conditions</li>
            <li>Privacy Policy</li>
            <li>Shopping Policy</li>
            <li>Sitemap</li>
          </ul>

          <ul>
            <li>
              <span className={style.bold}>Location</span>
            </li>
            <li>support@euphoria.in</li>
            <li>Eklingpura Chouraha, Ahmedabad Main Road</li>
            <li>NH 8- Near Mahadev Hotel, Udaipur, India- 313002</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
