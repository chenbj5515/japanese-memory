"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import LiveIsland from "react-live-island";

import "remixicon/fonts/remixicon.css";
import { InputBox, CardList, Welcome, Dictation } from "../components";
import { changeFilterFuc } from "@/components/card-list/history-lists-slice";

interface ICard {
  content: string;
  record_file_path: string;
  create_time: string;
  update_time: string;
  id: string;
  original_text: string;
  review_times: number;
}

interface IMemoCard {
  memo_card: ICard[];
}

function findLatestUnReview(data?: IMemoCard) {
  const resultList = [];
  const prevList = data?.memo_card || [];
  const sorted =  [...prevList].sort(
    (a, b) =>
      new Date(b.create_time).getTime() - new Date(a.create_time).getTime()
  );
  console.log(sorted.slice(0, 30), "data===")
  for (const item of sorted) {
    const { review_times } = item;
    if (review_times === 0) {
      resultList.push(item);
    }
    if (resultList.length === 20) {
      return resultList;
    }
  }
  return resultList;
}

export default function Home() {
  const [theme, setTheme] = React.useState("light");
  const [cookies] = useCookies(["user_id"]);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  function handleToggle() {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
    document.body.classList.toggle("dark");
  }
  const dispatch = useDispatch();

  if (mounted && cookies.user_id === undefined) {
    return <Welcome />;
  }

  return (
    mounted && (
      <main className="flex flex-col dark:bg-bgDark bg-[#e8e8e8] overflow-scroll">
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
                  className="bg-blue-500 text-white text-center p-2 rounded-lg text-sm cursor-pointer"
                  style={{ width: "120px" }}
                >
                  earliest 20
                </div>
                <div
                  className="bg-green-500 text-white text-center p-2 rounded-lg text-sm cursor-pointer"
                  style={{ width: "120px" }}
                  onClick={() => {
                    console.log("23232", changeFilterFuc);
                    dispatch(
                      changeFilterFuc({
                        filterFuc: findLatestUnReview,
                      })
                    );
                  }}
                >
                  latest 20
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
        {/* <Aside /> */}
        <div className="flex-grow relative text-[16px] font-Default">
          <div className="h-[100%] overflow-auto pb-[90px]">
            <CardList type="history" />
            <CardList type="local" />
          </div>
          <div className="fixed z-[12] width-80-680 left-[50%] -translate-x-1/2 bottom-2 h-[60px] w-[100%]">
            <InputBox />
          </div>
        </div>
      </main>
    )
  );
}
