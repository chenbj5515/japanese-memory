import React from "react";
import { gql } from "@apollo/client";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { client } from "@/pages/_app";
import { formatDate } from "@/utils";
import Link from "next/link";

export default function Article ({ source, title, date, others }: any) {
  return (
    <div className="w-full mt-6 text-left dark:text-[white] max-w-2xl mx-auto lg:mt-12">
      <div className="post-header">
        <h1 className="text-[36px] font-bold">{title}</h1>
        <div className="description text-left text-[grey] text-[15px]">
          {formatDate(date)}
        </div>
      </div>
      <div className="text-[18px] leading-[3] tracking-wider mb-20">
        <MDXRemote {...source} />
      </div>
      <footer>
        <ul className="p-6 bg-dark text-white">
          {others[0] && (
            <li className="text-center text-xl lg:text-2xl my-6">
              <div className="tracking-wide uppercase opacity-40 text-xs mb-2">
                Previous
              </div>
              <Link
                as={`/articles/${others[0]}`}
                key={others[0]}
                href={`/articles/[slug]`}
              >
                {others[0]}
              </Link>
            </li>
          )}
          {others[1] && (
            <li className="relative text-center text-xl lg:text-2xl my-6">
              <div className="tracking-wide uppercase opacity-40 text-xs mb-2">
                Next
              </div>
              <Link
                as={`/articles/${others[1]}`}
                key={others[1]}
                href={`/articles/[slug]`}
              >
                {others[1]}
              </Link>
            </li>
          )}
        </ul>
      </footer>

      <style jsx>{`
        .post-header h1 {
          margin-bottom: 0;
        }

        .post-header {
          margin-bottom: 2rem;
        }
        .description {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

export const getStaticProps = async ({ params }: { params: any }) => {
  const { data: articleData } = await client.query({
    query: gql`
      query GetArticles {
        articles(order_by: { create_time: desc }) {
          id
          title
          content
          tags
          create_time
          user_id
        }
      }
    `,
    variables: {},
    fetchPolicy: "no-cache",
  });
  let index = 0,
    source,
    others = [];
  for (let i = 0; i < articleData.articles.length; i++) {
    if (articleData.articles[i].id === params.slug) {
      source = articleData.articles[i];
      index = i;
    }
  }
  if (articleData.articles[index - 1]) {
    others.push(articleData.articles[index - 1]);
  }
  if (articleData.articles[index + 1]) {
    others.push(articleData.articles[index + 1]);
  }
  const mdxSource = await serialize(source?.content);

  return {
    props: {
      source: mdxSource,
      title: source?.title,
      date: source?.create_time,
      others,
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
