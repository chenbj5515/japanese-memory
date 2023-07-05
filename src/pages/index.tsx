"use client";
import { useSelector } from "react-redux";
import "remixicon/fonts/remixicon.css";
import { CardList, CardInHome, InputBox, Aside } from "../components";
// const DynamicComponent = dynamic(() => import("../components/vconsole"), { ssr: false, });



export default function Home() {
  const { state } = useSelector((state: any) => state.cardDataSlice);

  return (
    <main className="flex">
      {/* <Aside /> */}
      <div className="flex-grow relative text-[16px] font-Default">
        <div className="h-[100%] overflow-auto pb-[90px]">
          {state === "hidden" || state === "inserted" ? null : <CardInHome />}
          <CardList />
        </div>
        <div className="z-[12] absolute width-80-680 left-[50%] -translate-x-1/2 bottom-2 h-[60px] w-[100%]">
          <InputBox />
        </div>
      </div>
    </main>
  );
}
