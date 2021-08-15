import { GetStaticProps } from "next"
import { useSession } from "next-auth/client"
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../../services/prismic";
import styles from './post.module.scss';

type Post = {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
}

interface PostPostPreviewProps {
    post: Post
}

export default function PostPreview({ post }: PostPostPreviewProps) {
    const [session] = useSession();

    useEffect(() => {
        if(session?.activeSubscription) {
            router.push(`/posts/${post.slug}`);
        }
    }, [session])

    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={`${styles.postContent} ${styles.previewContent}`} 
                    dangerouslySetInnerHTML={{ __html: post.content }} />
                    <div className={styles.continueReading}>
                        Wanna Continue Reading ?
                        <Link href="/">
                            <a>Subscribe now ☺</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;
    const prismic = getPrismicClient();

    const response = await prismic.getByUID('publication', String(slug), {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    }

    return {
        props: { post },
        revalidate: 60 * 30,
    }
}