import img1 from '@/assets/cart_img1.png';
import img2 from '@/assets/cart_img2.png';
import img3 from '@/assets/cart_img3.png';

export interface Product {
  id: number;
  productName: string;
  color: string;
  img: string;
  size: string;
  price: number;
  quantity: number;
  shipping: string | number;
  subtotal: number;
}

export const PRODUCT_SAMPLE: Product[] = [
  {
    id: 1,
    img: img1,
    color: 'blue',
    productName: 'Blue Flower Print Crop Top',
    size: 'M',
    price: 29.0,
    quantity: 1,
    shipping: 'FREE',
    subtotal: 29.0,
  },
  {
    id: 2,
    img: img2,
    color: 'lavender',
    productName: 'Lavender Hoodie',
    size: 'XXL',
    price: 119.0,
    quantity: 2,
    shipping: 'FREE',
    subtotal: 119.0,
  },
  {
    id: 3,
    img: img3,
    color: 'black',
    productName: 'Black Sweatshirt',
    size: 'XXL',
    price: 123.0,
    quantity: 2,
    shipping: 5.0,
    subtotal: 123.0,
  },
];
