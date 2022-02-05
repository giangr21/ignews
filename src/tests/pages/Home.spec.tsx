import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';

jest.mock('next/router');
jest.mock('next-auth/client', () => ({
  useSession: () => [null, false],
}));
jest.mock('../../services/stripe');

describe('Home Page', () => {
  it('should render correctly', () => {
    //GIVEN
    const product = {
      priceId: 'fake',
      amount: 'R$ 10,00',
    };

    //WHEN
    render(<Home product={product} />);

    //THEN
    expect(screen.getByText('for R$ 10,00 month')).toBeInTheDocument();
  });

  it('should load initial data', async () => {
    //GIVEN
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any);

    //WHEN
    const response = await getStaticProps({});

    //THEN
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00',
          },
        },
      })
    );
  });
});
