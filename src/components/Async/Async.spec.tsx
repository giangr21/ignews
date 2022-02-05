import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { Async } from '.';

it('should render correctly', async () => {
  render(<Async />);

  screen.logTestingPlaygroundURL();

  expect(screen.getByText('Hello World')).toBeInTheDocument();
  // expect(await screen.findByText('Button', {}, { timeout: 3000 })).toBeInTheDocument();

  // await waitFor(() => {
  //   return expect(screen.getByText('Button')).not.toBeInTheDocument();
  // });

  await waitForElementToBeRemoved(screen.queryByText('Button'));
});
