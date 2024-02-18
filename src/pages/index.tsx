"use client";
import React from "react";
import { useCookies } from "react-cookie";
import "remixicon/fonts/remixicon.css";
import {
  InputBox,
  CardList,
  Welcome,
  WordCardAdder,
} from "../components";

export default function Home() {
  const [cookies] = useCookies(["user_id"]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && cookies.user_id === undefined) {
    return <Welcome />;
  }

  return (
    mounted && (
      <>
        <div className="flex-grow relative text-[16px] font-Default">
          <div className="h-[100%] overflow-auto pb-[90px]">
            <CardList type="history" />
            <CardList type="local" />
          </div>
          <div className="fixed z-[12] width-80-680 left-[50%] -translate-x-1/2 bottom-2 h-[60px] w-[100%]">
            <InputBox />
          </div>
        </div>
        <WordCardAdder />
      </>
    )
  );
}
