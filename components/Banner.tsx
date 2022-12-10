import Link from "next/link";
import React from "react";
import { BannerType } from "../types";
import { urlFor } from "../lib/client";

function Banner({ banner }: { banner: BannerType }) {
  return (
    <div className="hero-banner-container">
      <div className="">
        <p className="beats-solo">{banner.smallText}</p>
      </div>
      <h3>{banner.midText}</h3>
      <h1>{banner.largeText1}</h1>
      <img
        src={urlFor(banner.image) as unknown as string}
        alt=""
        className="hero-banner-image"
      />
      <div className="">
        <Link href={`/products/${banner.product}`}>
          <button className="" type="button">
            {banner.buttonText}
          </button>
        </Link>
        <div className="desc">
          <h5>Description</h5>
          <p>{banner.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default Banner;
