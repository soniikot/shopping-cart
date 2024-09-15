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
  filter: string;
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
