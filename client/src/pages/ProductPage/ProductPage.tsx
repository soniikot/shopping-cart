import style from './styles.module.scss';
import img1 from '@/assets/sample1.jpg';
import img2 from '@/assets/sample2.jpg';
import button_up from '@/assets/button_up.svg';
import button_down from '@/assets/button_down.svg';
import { ProductsDescription } from '@/components/ProductDescription/ProductsDescription';
import { BottomDescription } from '@/components/BottomDescription/BottomDescription';
import { SectionTitle } from '@/shared/components/SectionTitle/SectionTitle';
import { Products } from '@/components/Products/Products';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

export const ProductPage = () => {
  const { id: idString } = useParams();
  const id = Number(idString);

  const [selectedImg, setSelectedImg] = useState('img');

  const { products } = useAppSelector((state: RootState) => state.products);

  return (
    <>
      <div className={style.wrapper}>
        <div className={style.images}>
          <div className={style.side_images}>
            {products.length > 0 && (
              <img
                src={
                  import.meta.env.VITE_API_UPLOAD_URL +
                  products[id].attributes.img.data.attributes.url
                }
                alt="Raven Hoodie"
                className={style.image}
                onClick={(_e) =>
                  setSelectedImg(
                    import.meta.env.VITE_API_UPLOAD_URL +
                      products[id].attributes.img.data.attributes.url
                  )
                }
              />
            )}
            <img
              src={img1}
              alt="sample"
              className={style.image}
              onClick={(_e) => setSelectedImg(img1)}
            />
            <img
              src={img2}
              alt="sample"
              className={style.image}
              onClick={(_e) => setSelectedImg(img2)}
            />
          </div>
          <div className={style.photo_wrapper}>
            {products.length > 0 && (
              <img src={selectedImg} className={style.image} />
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
