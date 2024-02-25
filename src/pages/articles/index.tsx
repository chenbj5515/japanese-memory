import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useCookies } from "react-cookie";
import Router from "next/router";

const GET_ARTICLES = gql`
  query GetArticles($user_id: String!) {
    articles(
      where: { user_id: { _eq: $user_id } }
      order_by: { create_time: desc }
    ) {
      id
      title
      content
      tags
      create_time
      user_id
    }
  }
`;

interface IArticle {
  id: string;
  content: string;
  create_time: string;
  user_id: string;
}

interface IArticls {
  articles: IArticle[];
}

export default function Articles () {
  const [cookies] = useCookies(["user_id"]);

  const { loading, data, refetch } = useQuery<IArticls>(GET_ARTICLES, {
    variables: {
      user_id: cookies.user_id,
    },
    fetchPolicy: "no-cache",
  });

  const posts = data?.articles;

  function handleClickArticle(id: string) {
    Router.push(`/articles/${id}`);
  }

  if (loading) {
    return (
      <div className="pyramid-loader">
        <div className="wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="w-full">
        <section className="p-6 bg-white cursor-pointer dark:bg-black dark:text-[white] rounded shadow max-w-[640px] m-auto">
          <h4 className="text-base font-normal opacity-30 text-left">2023</h4>
          {posts?.map((post: any) => (
            <article
              key={post.id}
              onClick={() => handleClickArticle(post.id)}
              className="relative flex align-middle items-center justify-between mt-[10px]"
            >
              <h2 className="m-0 leading-[1.9] text-[18px] lg:text-[18px] font-normal tracking-[0.5px]">
                {post.title}
              </h2>
              <time className="text-[15px] opacity-30">
                {post.create_time.split("T")[0]}
              </time>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
