import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { getPrismicClient } from '../../services/prismic';

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

jest.mock('../../services/prismic');
jest.mock('next-auth/client');
jest.mock('next/router');

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post excerpt</p>',
  updatedAt: 'March, 11th',
};

describe('Post Page', () => {
  it('should render correctly', () => {
    //GIVEN
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    //WHEN
    render(<Post post={post} />);

    //THEN
    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Post excerpt')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('should redirect user to full post when user is subscribed', async () => {
    //GIVEN
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-subscription' },
      false,
    ] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    //WHEN
    render(<Post post={post} />);

    //THEN
    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  });

  it('should load intial data', async () => {
    //GIVEN
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'My new post' }],
          content: [{ type: 'paragraph', text: 'Post content' }],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any);

    //WHEN
    const response = await getStaticProps({
      params: { slug: 'my-new-post' },
    } as any);

    //THEN
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: 'Apr 01, 2021',
          },
        },
      })
    );
  });
});
