import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../../services/api';
import { getStripeJs } from '../../../services/stipe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const [session] = useSession();
    const router = useRouter();

    async function handleSubscribe() {
        if (!session) {
            signIn('github');
            return;
        }

        if (session.activeSubscription) {
            router.push('/posts')
            return;
        }

        try {
            const response = await api.post('/subscripe');
            const { sessionId } = response.data;
            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({ sessionId });
        } catch (e) {
            alert(e);
            console.log(e);
        }

    }

    return ( 
        <button type="button" onClick={() => handleSubscribe()} className={styles.subscribeButton}>
            Subscribe now
        </button>
    )
}