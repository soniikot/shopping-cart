import style from './styles.module.scss';
import socialMedia from '@/assets/social_media.png';
import google from '@/assets/google.png';
import app_store from '@/assets/appstore.png';
import clsx from 'clsx';
import { FC } from 'react';
export const Footer: FC = () => {
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
        <div className={style.social_media}>
          <img className={style.icons} src={socialMedia} alt="social media" />
          <div className={style.app_container}>
            <span className={clsx(style.bold, style.app_title)}>
              Download The App
            </span>
            <div className={style.apps}>
              <img src={google} alt="" />
              <img src={app_store} alt="" />
            </div>
          </div>
        </div>

        <h3 className={style.title}>Popular Categories</h3>
        <p className={style.text}>
          Copyright © 2023 Euphoria Folks Pvt Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
};
