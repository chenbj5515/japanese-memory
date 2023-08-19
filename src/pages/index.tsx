"use client";
import React from "react";
import { useCookies } from "react-cookie";
import "remixicon/fonts/remixicon.css";
import { InputBox, CardList, Welcome } from "../components";

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

  if (mounted && cookies.user_id === undefined) {
    return <Welcome />;
  }

  return (
    mounted && (
      <main className="flex flex-col dark:bg-bgDark bg-[#e8e8e8] overflow-scroll">
        <header className="w-[100vw] p-[12px] justify-end items-center sticky top-0 flex">
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
