import React from "react";
import { useCookies } from "react-cookie";
import { parse } from "cookie";
import "remixicon/fonts/remixicon.css";
import { InputBox, CardList, WordCardAdder } from "../components";

export default function Home() {
  const [cookies] = useCookies(["user_id"]);
  // const [mounted, setMounted] = React.useState(false);

  // React.useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (mounted && cookies.user_id === undefined) {
  //   return <Welcome />;
  // }

  return (
    (
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

export async function getServerSideProps(context: any) {
  const { req } = context;
  // 假设请求头中的cookie存在，如果不存在，则使用空字符串
  const cookies = parse(req.headers.cookie || "");

  const user_id = cookies.user_id; // 假设登录态的cookie名称为'loginToken'

  // 检查登录态
  if (!user_id) {
    // 如果没有登录态，重定向到登录页面
    return {
      redirect: {
        destination: "/welcome", // 指向登录页面的路径
        permanent: false,
      },
    };
  }

  // 如果有登录态，正常渲染页面
  return {
    props: {}, // 你可以根据需要传递更多的props
  };
}
