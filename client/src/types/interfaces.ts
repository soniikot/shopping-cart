export interface ProductData {
  id: number;
  attributes: {
    title: string;
    disc: string;
    price: number;
    img: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export interface ProductsType {
  numberOfProducts: number;
}

export interface CategoryType {
  numberOfCategories: number;
  filter: string;
}

export interface CategoryData {
  id: number;
  attributes: {
    title: string;
    img: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export interface SaleCardProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  discount: string;
}

export interface IconButtonProps {
  icon: string;
}

export interface SectionTitleProps {
  text: string;
}

export interface TextButtonProps {
  text: string;
}

export interface Product {
  id: string;
  price: number;
  quantity: number;
}

export interface CartProps {
  products: Product[];
}
export interface SavingZoneItem {
  id: number;
  title: string;
  subtitle: string;
  discount: string;
  isLimited: boolean;
  img: string;
  isBlack: boolean;
  isRightAlignment: boolean;
}

export interface ReviewItem {
  img: string;
  name: string;
  text: string;
  stars: string;
}

export interface SectionTitleProps {
  text: string;
}
