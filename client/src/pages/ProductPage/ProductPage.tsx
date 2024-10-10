import style from './styles.module.scss';
import img1 from '@/assets/product_p.png';
import button_up from '@/assets/button_up.svg';
import button_down from '@/assets/button_down.svg';
import { ProductsDescription } from '@/components/ProductDescription/ProductsDescription';
import { BottomDescription } from '@/components/BottomDescription/BottomDescription';
import { SectionTitle } from '@/shared/components/SectionTitle/SectionTitle';
import { Products } from '@/components/Products/Products';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { useParams } from 'react-router-dom';

export const ProductPage = () => {
  const { id: idString } = useParams();

  const id = Number(idString);

  const { products } = useAppSelector((state: RootState) => state.products);

  return (
    <>
      <div className={style.wrapper}>
        <div className={style.images}>
          <div className={style.side_images}>
            <img src={img1} alt="Raven Hoodie" className={style.image} />
            <img src={img1} alt="Raven Hoodie" className={style.image} />
            <img src={img1} alt="Raven Hoodie" className={style.image} />
            <div className={style.navigation}>
              <img src={button_up} alt="up" />
              <img src={button_down} alt="down" />
            </div>
          </div>
          <div className={style.photo_wrapper}>
            {products.length > 0 && (
              <img
                src={
                  import.meta.env.VITE_API_UPLOAD_URL +
                  products[id].attributes.img.data.attributes.url
                }
                alt="Raven Hoodie"
                className={style.image}
              />
            )}
          </div>
        </div>
        <ProductsDescription id={id} />
      </div>

      <BottomDescription />
      <div className="container">
        <SectionTitle text="Similar Products" />
        <Products numberOfProducts={8} />
      </div>
    </>
  );
};
