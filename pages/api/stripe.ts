import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../../types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log(req.body);
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        submit_type: "pay",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [
          { shipping_rate: "shr_1MDFjxH2MDO0OCdZOBavjyJ4" },
          { shipping_rate: "shr_1JkEvtH2MDO0OCdZQhJmPVVY" },
          { shipping_rate: "shr_1MDFloH2MDO0OCdZKKEiNfMp" },
        ],
        line_items: (req.body as (Product & { quantity: number })[]).map(
          (item) => {
            console.log(item.image);
            const img = item.image[0].asset._ref;

            const newImage = img
              .replace(
                "image-",
                "https://cdn.sanity.io/images/skxypqsl/production/"
              )
              .replace("-webp", ".webp");

            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: item.name,
                  images: [newImage],
                },
                unit_amount: item.price * 100,
              },
              adjustable_quantity: {
                enabled: true,
                minimum: 1,
              },
              quantity: item.quantity,
            };
          }
        ),
        mode: "payment",
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      });
      res.status(201).json({ session });
    } catch (err) {
      res.status((err as any).statusCode! || 500).json((err as any)?.message!);
    }
  }
}
