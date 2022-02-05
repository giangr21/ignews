import { fireEvent, render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import { SubscribeButton } from '.';

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscribeButton component', () => {
  it('should render correctly', () => {
    //GIVEN
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    //WHEN
    render(<SubscribeButton />);

    //THEN
    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
  });

  it('shoudl redirect user to sign in when not authenticated', () => {
    //GIVEN
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    //WHEN
    render(<SubscribeButton />);

    const subscrigbeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscrigbeButton);

    //THEN
    expect(signInMocked).toHaveBeenCalled();
  });

  it('should redirect to posts when user already has a subscription', () => {
    //GIVEN
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: 'Peter Parker', email: 'spider@marvel.com' },
        activeSubscription: 'fake-subscription',
        expires: 'never',
      },
      true,
    ]);

    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    //WHEN
    render(<SubscribeButton />);

    const subscrigbeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscrigbeButton);

    //THEN
    expect(pushMock).toHaveBeenCalled();
  });
});
