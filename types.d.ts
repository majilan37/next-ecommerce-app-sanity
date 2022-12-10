export interface Product {
  image: Array<{
    _key: string;
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  }>;
  Details: string;
  title: string;
  name: string;
  price: number;
  slug: { _type: string; current: string };
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}

export interface BannerType {
  buttonText: string;
  desc: string;
  discount: string;
  image: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  largeText1: string;
  largeText2: string;
  midText: string;
  product: string;
  saleTime: string;
  smallText: string;
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}
