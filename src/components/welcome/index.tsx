import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useCookies } from "react-cookie";
import "remixicon/fonts/remixicon.css";
import { client } from "@/pages/_app";

const GET_USER = gql`
  query GetUser($user_id: String!) {
    user(where: { user_id: { _eq: $user_id } }) {
      user_id
    }
  }
`;

const INSERT_USER = gql`
  mutation InsertUser($user_id: String!, $create_time: timestamptz) {
    insert_user(objects: { user_id: $user_id, create_time: $create_time }) {
      affected_rows
      returning {
        user_id
        create_time
      }
    }
  }
`;

export function Welcome() {
  const [, setCookie] = useCookies(["user_id"]);
  const [value, setValue] = React.useState("");
  const [insertUser] = useMutation(INSERT_USER);

  function handleChange(e: any) {
    setValue(e.target.value);
  }

  async function handleClick() {
    const res = await client.query({
      query: GET_USER,
      variables: {
        user_id: value,
      },
    });
    if (res.data.user.length === 0) {
      await insertUser({
        variables: {
          user_id: value,
          create_time: new Date(),
        },
      });
    }
    setCookie("user_id", value, { path: "/" });
  }

  function handleKeyDown(event: any) {
    if (event.key === "Enter") {
      handleClick();
    }
  }

  return (
    <>
      <div className="flex flex-col items-center welcome-bg h-[100%] p-6">
        <a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="2 2 44 44"
            className="mr-[8px] inline-block aspect-square w-[64px]"
          >
            <radialGradient
              id="kee_svg__a"
              cx="27.462"
              cy="24"
              r="17.843"
              fx="27.367"
              fy="16.356"
              gradientTransform="rotate(1.146 23.98 23.96)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#ffe16e"></stop>
              <stop offset="0.629" stopColor="#ffd426"></stop>
              <stop offset="0.72" stopColor="#fdcd23"></stop>
              <stop offset="0.854" stopColor="#f8b919"></stop>
              <stop offset="1" stopColor="#f09c0c"></stop>
            </radialGradient>
            <path
              fill="url(#kee_svg__a)"
              d="M45.3 24.417c-.193 9.852-8.336 17.683-18.189 17.49-10.473-.205-12.43-4.21-15.317-9.907-1.277-2.52-2.232-5.26-2.173-8.282.193-9.852 8.336-17.683 18.189-17.49s17.683 8.337 17.49 18.189z"
            ></path>
            <radialGradient
              id="kee_svg__b"
              cx="22.555"
              cy="24.848"
              r="4.193"
              gradientTransform="rotate(1.146 23.98 23.96)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#1f1f1f"></stop>
              <stop offset="0.697" stopColor="#0a0a0a"></stop>
              <stop offset="1"></stop>
            </radialGradient>
            <circle
              cx="22.538"
              cy="24.819"
              r="4.193"
              fill="url(#kee_svg__b)"
            ></circle>
            <circle cx="21.305" cy="23.537" r="1.067" fill="#fff"></circle>
            <linearGradient
              id="kee_svg__c"
              x1="9.029"
              x2="9.939"
              y1="30.978"
              y2="36.39"
              gradientTransform="rotate(1.146 23.98 23.96)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.408" stopColor="#ffa561"></stop>
              <stop offset="0.487" stopColor="#b94624"></stop>
              <stop offset="0.531" stopColor="#961605"></stop>
            </linearGradient>
            <path
              fill="url(#kee_svg__c)"
              d="m3.34 33.524 11.63-2.168s-.809 1.48-1.204 4.302c0-.001-5.697 1.045-10.426-2.134z"
            ></path>
            <path
              fill="#310e02"
              d="M3.156 33.393s8.475-2.225 11.835-2.084l-.374.863s-5.573.359-10.744 1.69l-.717-.469z"
            ></path>
            <radialGradient
              id="kee_svg__d"
              cx="7.506"
              cy="27.878"
              r="8.399"
              fx="7.464"
              fy="28.058"
              gradientTransform="matrix(.8686 -.4956 .3171 .5557 -7.925 15.782)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#ff9b52"></stop>
              <stop offset="0.477" stopColor="#e44723"></stop>
              <stop offset="0.776" stopColor="#d41708"></stop>
            </radialGradient>
            <path
              fill="url(#kee_svg__d)"
              d="M9.632 23.19c-1.36.694-5.932 4.505-7.108 9.853-.074.334.242.676.565.564 2.496-.863 8.777-1.7 11.539-1.975.396-.039.513-.575.205-.827-1.107-.907-3.717-4.453-4.543-7.311-.083-.288-.392-.44-.658-.304z"
            ></path>
          </svg>
        </a>
        <div className="text-white font-NewYork text-[30px] mt-[50px]">
          Welcome, type your username
        </div>
        <div className="input-group-welcome relative w-[330px] flex mt-[40px]">
          <input
            onKeyDown={handleKeyDown}
            value={value}
            maxLength={10}
            onChange={handleChange}
            autoComplete="off"
            name="Email"
            id="Email"
            className="input-welcome bg-white"
            type="email"
          />
          <div
            className="text-white cursor-pointer w-[98px] absolute right-0 font-[15px] h-[46px] leading-[46px] rounded-[10px] tracking-[.3px] bg-bgDark pl-[12px] pr-[12px]"
            onClick={handleClick}
          >
            Launch →
          </div>
        </div>
      </div>
    </>
  );
}
