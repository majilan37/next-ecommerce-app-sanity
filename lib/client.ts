import sanityClient from "@sanity/client";
import sanityImageUrl from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = sanityClient({
  projectId: "skxypqsl",
  dataset: "production",
  apiVersion: "2022-12-07",
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_CLIENT_API_TOKEN,
});

const builder = sanityImageUrl(client);

export const urlFor = (src: SanityImageSource) => builder.image(src);
