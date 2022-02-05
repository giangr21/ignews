import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';

import { SignInButton } from '.';

jest.mock('next-auth/client');

describe('SignInButton component', () => {
  it('should render when user is not authenticated', () => {
    //GIVEN
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    //WHEN
    render(<SignInButton />);

    //THEN
    expect(screen.getByText('SignIn with GitHub')).toBeInTheDocument();
  });

  it('should render when user is authenticated', () => {
    //GIVEN
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: 'Peter Parker', email: 'spider@marvel.com' },
        expires: 'never',
      },
      false,
    ]);

    //WHEN
    render(<SignInButton />);

    //THEN
    expect(screen.getByText('Peter Parker')).toBeInTheDocument();
  });
});
