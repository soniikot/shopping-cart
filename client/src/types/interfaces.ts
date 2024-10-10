export interface ProductData {
  id: number;
  attributes: {
    title: string;
    disc: string;
    price: number;
    color: string;
    quantity: number;
    size: string;
    subcategories: {
      data: {
        attributes: {
          title: string;
        };
      };
    };
    img: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}
