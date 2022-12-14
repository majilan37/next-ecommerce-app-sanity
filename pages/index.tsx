import { GetServerSideProps } from "next";
import Head from "next/head";
import { Banner, Footer, FooterBanner, Product } from "../components";
import { client } from "../lib/client";
import { BannerType, Product as ProductType } from "../types";

export const getServerSideProps: GetServerSideProps = async ({}) => {
  const [products, banner] = await Promise.all([
    client.fetch(`*[_type == "product"]`),
    client.fetch(`*[_type == "banner"]`),
  ]);
  return {
    props: {
      data: {
        products,
        banner,
      },
    },
  };
};

interface Props {
  data: {
    products: ProductType[];
    banner: BannerType[];
  };
}

export default function Home({ data }: Props) {
  console.log(data);
  return (
    <div className={""}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Banner banner={data.banner[0]} />

      <div className="products-heading">
        <h2>Best selling Products</h2>
        <p>Speakers of many variations</p>
      </div>
      <div className="products-container">
        {data.products.map((product) => (
          <Product key={product.name} product={product} />
        ))}
      </div>
      <FooterBanner banner={data.banner[0]} />
    </div>
  );
}
