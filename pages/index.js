import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import stripe from 'stripe';
import Product from '../components/Product';
import Subscription from '../components/Subscription';

export default function Home(props) {
  const [productQuantity, setProductQuantity] = useState(1);

  async function handlePurchase(quantity, mode, priceId) {
    const stripeClient = await loadStripe(props.publicKey);

    const response = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: quantity,
        mode: mode,
        priceId: priceId,
      }),
    });

    const { session } = await response.json();

    stripeClient.redirectToCheckout({ sessionId: session.id });
  }

  return (
    <div>
      <div>
        <Product
          productQuantity={productQuantity}
          setProductQuantity={setProductQuantity}
          image={props.productPrices[0].image}
        />
        <button
          onClick={() =>
            handlePurchase(
              productQuantity,
              'payment',
              props.productPrices[0].priceId,
            )
          }
        >
          Buy for $ {props.productPrices[0].amount * productQuantity}
        </button>
      </div>
      <div>
        <Subscription image={props.productPrices[1].image} />
        <button
          onClick={() =>
            handlePurchase(1, 'subscription', props.productPrices[1].priceId)
          }
        >
          Buy for $ {props.productPrices[1].amount}
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const stripeServer = stripe(process.env.STRIPE_SECRET_KEY);

  const price = await stripeServer.prices.retrieve(process.env.PRICE);
  const product = await stripeServer.products.retrieve(price.product);

  const price2 = await stripeServer.prices.retrieve(process.env.PRICE2);
  const subscription = await stripeServer.products.retrieve(price2.product);

  return {
    props: {
      publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
      productPrices: [
        {
          priceId: process.env.PRICE,
          amount: price.unit_amount / 100,
          image: product.images[0],
        },
        {
          priceId: process.env.PRICE2,
          amount: price2.unit_amount / 100,
          image: subscription.images[0],
        },
      ],
    },
  };
}
