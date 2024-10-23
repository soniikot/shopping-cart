import style from './styles.module.scss';
import img1 from '@/assets/sample1.jpg';
import img2 from '@/assets/sample2.jpg';
import { ProductsDescription } from '@/components/ProductDescription/ProductsDescription';
import { BottomDescription } from '@/components/BottomDescription/BottomDescription';
import { SectionTitle } from '@/shared/components/SectionTitle/SectionTitle';
import { Products } from '@/components/Products/Products';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export const ProductPage = () => {
  const { id: idString } = useParams();
  const id = Number(idString);
  const { products } = useAppSelector((state: RootState) => state.products);

  const [selectedImg, setSelectedImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (products.length > 0) {
      const initialImage =
        import.meta.env.VITE_API_UPLOAD_URL +
        products[id].attributes.img.data.attributes.url;
      setSelectedImg(initialImage);
    }
  }, [products, id]);

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
                className={clsx(style.image, {
                  [style.selected_image]:
                    selectedImg ===
                    import.meta.env.VITE_API_UPLOAD_URL +
                      products[id].attributes.img.data.attributes.url,
                })}
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
              className={clsx(style.image, {
                [style.selected_image]: selectedImg === img1,
              })}
              onClick={(_e) => setSelectedImg(img1)}
            />
            <img
              src={img2}
              alt="sample"
              className={clsx(style.image, {
                [style.selected_image]: selectedImg === img2,
              })}
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
