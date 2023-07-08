"use client";
import "remixicon/fonts/remixicon.css";
import { InputBox, Aside } from "../components";
import dynamic from 'next/dynamic';

const CardList = dynamic(() => import('../components/card-list'), {
  ssr: false, // 在服务器端不进行预渲染
});

export default function Home() {

  return (
    <main className="flex">
      {/* <Aside /> */}
      <div className="flex-grow relative text-[16px] font-Default">
        <div className="h-[100%] overflow-auto pb-[90px]">
          <CardList type="history" />
          <CardList type="local" />
        </div>
        <div className="z-[12] absolute width-80-680 left-[50%] -translate-x-1/2 bottom-2 h-[60px] w-[100%]">
          <InputBox />
        </div>
      </div>
    </main>
  );
}
