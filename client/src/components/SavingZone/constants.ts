import hawT from '@/assets/hawaian_shirts.jpeg';
import printedT from '@/assets/printed-t.jpeg';
import cargoJ from '@/assets/cargo-joggers.jpeg';
import urbanS from '@/assets/urban-shirts.jpeg';
import OversizedT from '@/assets/oversized-t.jpeg';

interface SavingZoneItem {
  id: number;
  title: string;
  subtitle: string;
  discount: string;
  isLimited: boolean;
  img: string;
  isBlack: boolean;
  isRightAlignment: boolean;
}

export const SAVING_ZONE: SavingZoneItem[] = [
  {
    id: 1,
    title: 'Hawaiian Shirts',
    subtitle: 'Dress up in summer vibe',
    discount: 'UP TO 50% OFF',
    isLimited: false,
    img: hawT,
    isBlack: false,
    isRightAlignment: false,
  },
  {
    id: 2,
    title: 'Printed T-Shirt',
    subtitle: 'New Designs Every Week',
    discount: 'UP TO 40% OFF',
    isLimited: true,
    img: printedT,
    isBlack: false,
    isRightAlignment: true,
  },
  {
    id: 3,
    title: 'Cargo Joggers',
    subtitle: 'Move with Style and Comfort',
    discount: 'UP TO 50% OFF',
    isLimited: false,
    img: cargoJ,
    isBlack: true,
    isRightAlignment: true,
  },
  {
    id: 4,
    title: 'Urban Shirts',
    subtitle: 'Live in Comfort',
    discount: 'FLAT 60% OFF',
    isLimited: false,
    img: urbanS,
    isBlack: true,
    isRightAlignment: true,
  },
  {
    id: 5,
    title: 'Oversized T-Shirts',
    subtitle: 'Street Style Icon',
    discount: 'FLAT 60% OFF',
    isLimited: false,
    img: OversizedT,
    isBlack: true,
    isRightAlignment: true,
  },
];
