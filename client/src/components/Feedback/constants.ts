import review1 from '@/assets/review1.png';
import review2 from '@/assets/review2.png';
import review3 from '@/assets/review3.png';
import threeStars from '@/assets/3and5stars.png';
import fourStars from '@/assets/4stars.png';
import { ReviewItem } from '@/types/interfaces';

export const REVIEWS: ReviewItem[] = [
  {
    img: review1,
    name: 'Floyd Miles',
    text: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
    stars: threeStars,
  },
  {
    img: review2,
    name: 'Ronald Richards',
    text: 'ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
    stars: fourStars,
  },
  {
    img: review3,
    name: 'Savannah Nguyen',
    text: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
    stars: threeStars,
  },
];
