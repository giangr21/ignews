import Stripe from 'stripe';

export const stripe = new Stripe(
    process.env.STRIPE_PRIVATE,
    { 
        apiVersion: '2020-08-27',
        appInfo: {
            name: 'Ignews',
            version: 'v1'
        }
    }
)