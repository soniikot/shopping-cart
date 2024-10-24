import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Link } from 'react-router-dom';
import { FC } from 'react';

interface LinksWithProps {
  id: number;
}

export const Links: FC<LinksWithProps> = ({ id }) => {
  const { products } = useAppSelector((state: RootState) => state.products);

  const gender = products[id]?.attributes.categories.data[0].attributes.title;
  const subcategory =
    products[id]?.attributes.subcategories.data[0].attributes.title;

  return (
    <h5>
      <Link to="/products">Shop </Link>&gt;
      {products.length > 0 &&
        gender.charAt(0).toUpperCase() + gender.slice(1)}{' '}
      &gt;
      {products.length > 0 &&
        subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
    </h5>
  );
};
