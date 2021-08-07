import { query } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

type User = {
    ref: {
        id: string;
    },
    data: {
        stripe_customer_id: string;
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const session = await getSession({ req });

        const user = await fauna.query<User>(
            query.Get(
                query.Match(
                    query.Index('user_by_email'),
                    query.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id;

        if (!customerId) {

        const stripeUser = await stripe.customers.create({
            email: session.user.email,
            // metadata
        });

        await fauna.query(
            query.Update(
                query.Ref(query.Collection('users'), user.ref.id),
                {
                    data: {
                        stripe_customer_id: stripeUser.id,
                    }
                }
            )
        )

        customerId = stripeUser.id;
    }


        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [{ price: 'price_1JKAwJDDrReDFTMYaUmQd5Gy', quantity: 1}],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: 'http://localhost:3000/posts',
            cancel_url: 'http://localhost:3000'
        })

        return res.status(200).json({ sessionId: checkoutSession.id });
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}