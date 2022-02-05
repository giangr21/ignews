import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { getPrismicClient } from '../../services/prismic';

import Posts, { getStaticProps } from '../../pages/posts';

jest.mock('../../services/prismic');

const posts = [
  {
    slug: 'my-new-post',
    title: 'My new post',
    excerpt: 'Post excerpt',
    updatedAt: 'March, 11th',
  },
];

describe('Posts Page', () => {
  it('should render correctly', () => {
    //GIVEN

    //WHEN
    render(<Posts posts={posts} />);

    //THEN
    expect(screen.getByText('My new post')).toBeInTheDocument();
  });

  it('should load initial data', async () => {
    //GIVEN
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [{ type: 'heading', text: 'My new post' }],
              content: [{ type: 'paragraph', text: 'Post excerpt' }],
            },
            last_publication_date: '03-11-2021',
          },
        ],
      }),
    } as any);

    //WHEN
    const response = await getStaticProps({});

    //THEN
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My new post',
              excerpt: 'Post excerpt',
              updatedAt: 'Mar 11, 2021',
            },
          ],
        },
      })
    );
  });
});
