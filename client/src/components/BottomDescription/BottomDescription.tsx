import { FC } from 'react';
import { SectionTitle } from '@/shared/components/SectionTitle/SectionTitle';
import style from './styles.module.scss';
import { ProductTabs } from './components/ProductTabs/ProductTabs';
import video from '@/assets/video.png';

export const BottomDescription: FC = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        <div className={style.text}>
          <SectionTitle text="Product Description" />
          <ProductTabs />
        </div>
        <div className={style.video}>
          <img src={video} alt="product video" />
        </div>
      </div>
    </div>
  );
};
