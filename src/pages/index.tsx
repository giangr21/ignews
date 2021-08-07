
/* eslint-disable @next/next/no-img-element */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import styles from './home.module.scss';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../../services/stripe';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
    <Head>
      Ignews 
    </Head>
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>Hey, Welcome </span>
        <h1>News about the <span>React</span> world.</h1>
        <p>
          Get access to all the publications <br/> 
          <span>for {product && product.amount} month</span>
        </p>
        <SubscribeButton priceId={product.priceId} />
      </section>

      <img src="/images/avatar.svg" alt="girl-codding" />
    </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JKAwJDDrReDFTMYaUmQd5Gy', { expand: ['product'] });
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD',
    }).format(( price.unit_amount / 100 )),

  }
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24
  }
}