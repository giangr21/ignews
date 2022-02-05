import { render, screen } from '@testing-library/react';

import { ActiveLink } from '.';

jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/' }),
}));

describe('ActiveLink component', () => {
  it('should render correctly', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should receive active class when href is "/"', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText('Home')).toHaveClass('active');
  });
});
