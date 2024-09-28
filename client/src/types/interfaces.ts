export interface ProductData {
  id: number;
  attributes: {
    title: string;
    disc: string;
    price: number;
    color: string;
    quantity: number;

    img: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}
