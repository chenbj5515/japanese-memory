import LiveIsland from "react-live-island";
import React from "react";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import "remixicon/fonts/remixicon.css";
import { updateHistoryLists } from "@/components/card-list/history-lists-slice";
import { client } from "@/pages/_app";

export function Layout({ children }: any) {
  const [theme, setTheme] = React.useState("light");
  const [cookies] = useCookies(["user_id"]);
  const dispatch = useDispatch();
  const router = useRouter();

  async function handleLastestClick() {
    const { data } = await client.query({
      query: gql`
        query GetMemoCard($user_id: String!) {
          memo_card(
            where: { user_id: { _eq: $user_id }, review_times: { _eq: 0 } }
            order_by: { create_time: desc }
            limit: 20
          ) {
            user_id
            translation
            kana_pronunciation
            original_text
            record_file_path
            create_time
            update_time
            id
            review_times
          }
        }
      `,
      variables: {
        user_id: cookies.user_id,
      },
      fetchPolicy: "no-cache",
    });
    dispatch(
      updateHistoryLists({
        historyLists: data.memo_card,
      })
    );
    router.push("/");
  }

  async function handleRandomClick() {
    const { data } = await client.query({
      query: gql`
        query GetAllMemoCardIDs($user_id: String!) {
          memo_card(
            where: { user_id: { _eq: $user_id } }
          ) {
            id
          }
        }
      `,
      variables: {
        user_id: cookies.user_id,
      },
      fetchPolicy: "no-cache",
    });
    
    const randomIDs = data.memo_card.sort(() => 0.5 - Math.random()).slice(0, 20).map((item: any) => item.id);

    const { data: cardData } = await client.query({
      query: gql`
        query GetMemoCardDetails($ids: [uuid!]!) {
          memo_card(
            where: { id: { _in: $ids } }
          ) {
            user_id
            translation
            kana_pronunciation
            original_text
            record_file_path
            create_time
            update_time
            id
            review_times
          }
        }
      `,
      variables: {
        ids: randomIDs,
      },
      fetchPolicy: "no-cache",
    });

    dispatch(
      updateHistoryLists({
        historyLists: cardData.memo_card,
      })
    );
    router.push("/");
  }

  function handleWordCards() {
    router.push("/word-card-list");
  }

  function handleToggle() {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
    document.body.classList.toggle("dark");
  }

  function handleTranslateCLick() {
    router.push("/translate");
  }

  function handleArticleCLick() {
    router.push("/articles");
  }

  return (
    <main className="flex flex-col dark:bg-bgDark bg-[#fff] overflow-scroll">
      {router.route !== "/welcome" ? (
        <>
          <LiveIsland
            className="flex justify-center items-center uppercase"
            smallClassName="text-xs"
            largeClassName="text-7xl"
            initialAnimation
          >
            {(isSmall) =>
              isSmall ? (
                ""
              ) : (
                <div className="flex space-x-2 p-4">
                  <div
                    className=" w-[72px] h-[72px] text-white text-center p-2 rounded-lg text-[12px] cursor-pointer"
                    onClick={handleLastestClick}
                  >
                    <div>latest</div>
                    <div className="mt-2">20</div>
                  </div>
                  <div
                    className=" w-[72px] h-[72px] text-white text-center p-2 rounded-lg text-[12px] cursor-pointer"
                    onClick={handleRandomClick}
                  >
                    <div>random</div>
                    <div className="mt-2">20</div>
                  </div>
                  <div
                    className=" w-[72px] h-[72px] text-white text-center p-2 rounded-lg text-[12px] cursor-pointer"
                    onClick={handleWordCards}
                  >
                    <div>Word</div>
                    <div className="mt-2">Cards</div>
                  </div>
                  <div
                    className=" w-[72px] h-[72px] text-white text-center p-2 rounded-lg text-[12px] cursor-pointer"
                    onClick={handleTranslateCLick}
                  >
                    <div>translate</div>
                  </div>
                  <div
                    className=" w-[72px] h-[72px] text-white text-center p-2 rounded-lg text-[12px] cursor-pointer"
                    onClick={handleArticleCLick}
                  >
                    <div>articles</div>
                  </div>
                </div>
              )
            }
          </LiveIsland>
          <header className="w-[100vw] p-[12px] justify-end items-center top-0 flex">
            <label className="text-base relative inline-block w-[56px] h-[28px]">
              <input
                onChange={handleToggle}
                checked={theme === "light"}
                className="peer opacity-0 w-0 h-0"
                type="checkbox"
              />
              <span className="transition duration-300 ease-in-out peer-checked:translate-x-5 peer-checked:shadow-full-moon left-2 top-1 rounded-full shadow-crescent absolute h-5 w-5 z-[1]"></span>
              <span className="peer-checked:bg-blue absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-black transition duration-500 rounded-3xl"></span>
            </label>
          </header>
        </>
      ) : null}
      {children}
    </main>
  );
}
