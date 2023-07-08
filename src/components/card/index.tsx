import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  SpeechConfig,
  SpeechSynthesizer,
  AudioConfig,
  SpeakerAudioDestination
} from "microsoft-cognitiveservices-speech-sdk";
import { gql, useMutation } from "@apollo/client";
import { useRecorder } from "./hooks/use-recorder";
import { getTimeAgo } from "@/utils";
import { updateState } from "./card-data-slice";

const UPDATE_CARD_RECORD_PATH = gql`
  mutation UpdateMemoCard(
    $id: uuid!
    $update_time: timestamptz
    $record_file_path: String
  ) {
    update_memo_card_by_pk(
      pk_columns: { id: $id }
      _set: { update_time: $update_time, record_file_path: $record_file_path }
    ) {
      id
    }
  }
`;

const INSERT_CARD_MUTATION = gql`
  mutation InsertMemoCard(
    $content: String
    $create_time: timestamptz
    $update_time: timestamptz
    $original_text: String
  ) {
    insert_memo_card(
      objects: {
        content: $content
        create_time: $create_time
        update_time: $update_time
        original_text: $original_text
      }
    ) {
      affected_rows
      returning {
        id
        content
        original_text
        create_time
        update_time
      }
    }
  }
`;

export function CardInHome() {
  const [recorderPressed, setRecorderPressedState] = React.useState(false);
  const [recordPlayBtnPressed, setRecordPlayBtnPressed] = React.useState(false);
  const cardIDRef = React.useRef("");
  const { text, originalText, state } = useSelector(
    (state: any) => state.cardDataSlice
  );
  const dispatch = useDispatch();
  const audioRef = React.useRef<any>();
  const [insertCard] = useMutation(INSERT_CARD_MUTATION);
  const [updateCardRecordPath] = useMutation(UPDATE_CARD_RECORD_PATH);

  React.useEffect(() => {
    if (state === "ended") {
      insertCard({
        variables: {
          content: text,
          create_time: new Date(),
          update_time: new Date(),
          original_text: originalText,
        },
      }).then((res) => {
        cardIDRef.current = res.data.insert_memo_card.returning[0].id;
        dispatch(updateState("inserted"));
      });
    }
  }, [state]);

  const { mediaRecorderRef } = useRecorder({
    async onEnd(recordedChunks) {
      const cardID = cardIDRef.current;
      const audioBlob = new Blob(recordedChunks, { type: "audio/mp3" });
      const formData = new FormData();
      const recordFileName = `${cardID}_${new Date().getTime()}.mp3`;
      formData.append("audio", audioBlob, recordFileName);
      await fetch("/api/delete-record", {
        method: "POST",
        body: JSON.stringify({
          prefix: cardID,
        }),
      });
      console.log("删除完成");
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const audio = document.createElement("audio");
      audio.src = `/uploads/${recordFileName}`;
      audioRef.current = audio;
      updateCardRecordPath({
        variables: {
          id: cardID,
          record_file_path: `/uploads/${recordFileName}`,
          update_time: new Date(),
        },
      });
    },
  });

  const ref = React.useRef<any>(null);
  // React.useEffect(() => {
    

  //   ref.current = synthesizer;
  // }, []);

  function handlePlayBtn() {
    const speechConfig = SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY!,
      process.env.NEXT_PUBLIC_REGION!
    );

    speechConfig.speechSynthesisVoiceName = "ja-JP-NanamiNeural"; // 使用Nanami Online (Natural) - Japanese (Japan)语音

    // const audioConfig = AudioConfig.fromDefaultSpeakerOutput();


    const player = new SpeakerAudioDestination();
    var audioConfig = AudioConfig.fromSpeakerOutput(player);

    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakTextAsync(originalText);
  }

  function handleRecordBtnClick() {
    setRecorderPressedState((prev) => !prev);
    if (recorderPressed) {
      console.log("结束录制，stop方法被调用");
      mediaRecorderRef.current?.stop();
    } else {
      console.log("开始录制，start方法被调用");
      mediaRecorderRef.current?.start();
    }
  }

  function handleRecordPlayBtnClick() {
    setRecordPlayBtnPressed(prev => !prev);
    audioRef.current?.play();
  }

  return (
    <div className="card p-5 width-92-675 mx-auto mt-10 relative">
      <div className="text-[14px] absolute -top-[30px] left-1 text-[gray]">
        刚刚
      </div>
      {/* AI朗读播放按钮 */}
      <div
        className="play-button-bg rounded-[50%] w-12 h-12 absolute top-2 right-2 cursor-pointer"
        onClick={handlePlayBtn}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          height="20"
          width="24"
          className="volume_button absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"
        >
          <path
            clipRule="evenodd"
            d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Zm6.328-.176a1.2 1.2 0 0 1 1.697 0A11.967 11.967 0 0 1 22.8 12a11.966 11.966 0 0 1-3.515 8.485 1.2 1.2 0 0 1-1.697-1.697A9.563 9.563 0 0 0 20.4 12a9.565 9.565 0 0 0-2.812-6.788 1.2 1.2 0 0 1 0-1.697Zm-3.394 3.393a1.2 1.2 0 0 1 1.698 0A7.178 7.178 0 0 1 18 12a7.18 7.18 0 0 1-2.108 5.092 1.2 1.2 0 1 1-1.698-1.698A4.782 4.782 0 0 0 15.6 12a4.78 4.78 0 0 0-1.406-3.394 1.2 1.2 0 0 1 0-1.698Z"
            fillRule="evenodd"
          ></path>
        </svg>
      </div>
      <div className="whitespace-pre-wrap pr-[42px]">{text}</div>
      <div className="flex justify-center mt-3 relative cursor-pointer">
        {cardIDRef.current ? (
          <>
            {/* 录音按钮 */}
            <div className="toggle w-[40px] h-[40px] mr-[30px]">
              <i className="ri-mic-fill z-[10] absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"></i>
              <input
                checked={recorderPressed}
                onChange={handleRecordBtnClick}
                type="checkbox"
                className="double-click absolute z-[11]"
              />
              <span className="button w-[50px] h-[50px] -translate-x-1/2 -translate-y-1/2"></span>
            </div>
            {/* 录音播放按钮 */}
            <div className="toggle w-[40px] h-[40px]">
              <i className="text-[22px] ri-play-circle-fill z-[10] absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"></i>
              <input
                checked={recordPlayBtnPressed}
                onChange={handleRecordPlayBtnClick}
                type="checkbox"
                className="absolute z-[11]"
              />
              <span className="button w-[50px] h-[50px] -translate-x-1/2 -translate-y-1/2"></span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

interface IProps {
  text: string;
  originalText: string;
  recorderPath: string;
  createTime: string;
  cardID: string;
}

export function CardInHistory(props: IProps) {
  const [recorderPressed, setRecorderPressedState] = React.useState(false);
  const [recordPlayBtnPressed, setRecordPlayBtnPressed] = React.useState(false);
  const { text, originalText, recorderPath, createTime, cardID } = props;
  const audioRef = React.useRef<any>();
  const [updateCardRecordPath] = useMutation(UPDATE_CARD_RECORD_PATH);

  const { mediaRecorderRef } = useRecorder({
    async onEnd(recordedChunks) {
      const audioBlob = new Blob(recordedChunks, { type: "audio/acc" });
      const formData = new FormData();
      const recordFileName = `${cardID}.acc`;
      formData.append("audio", audioBlob, recordFileName);
      // await fetch("/api/delete-record", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     prefix: cardID,
      //   }),
      // });
      // console.log("删除完成");
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      // console.log(audioBlob, URL.createObjectURL(audioBlob), "audioBlob=========")
      const audio = document.createElement("audio");
      // audio.src = "https://storage.googleapis.com/hallucinogenic_videos/bcf66aee-6528-4582-8e7e-700ed21d4375.mp3";
      audio.src = `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUKET}/${cardID}.acc`;
      // audio.src = URL.createObjectURL(audioBlob);
      audioRef.current = audio;
      updateCardRecordPath({
        variables: {
          id: cardID,
          record_file_path: audio.src,
          update_time: new Date(),
        },
      });
    },
  });

  React.useEffect(() => {
    const audio = document.createElement("audio");
    audio.src = recorderPath || "";
    audioRef.current = audio;
  }, []);

  function handlePlayBtn() {
    const speechConfig = SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY!,
      "eastasia"
    );

    speechConfig.speechSynthesisVoiceName = "ja-JP-NanamiNeural"; // 使用Nanami Online (Natural) - Japanese (Japan)语音

    const audioConfig = AudioConfig.fromDefaultSpeakerOutput();

    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(originalText);
  }

  function handleRecordBtnClick() {
    setRecorderPressedState((prev) => !prev);
    if (recorderPressed) {
      console.log("结束录制，stop方法被调用");
      mediaRecorderRef.current?.stop();
    } else {
      console.log("开始录制，start方法被调用");
      mediaRecorderRef.current?.start();
    }
  }

  function handleRecordPlayBtnClick() {
    setRecordPlayBtnPressed((prev) => !prev);
    console.log(audioRef.current?.src);
    audioRef.current?.play();
  }

  return (
    <div className="card p-5 width-92-675 mx-auto mt-10 relative">
      <div className="text-[14px] absolute -top-[30px] left-1 text-[gray]">
        {getTimeAgo(createTime)}
      </div>
      {/* AI朗读播放按钮 */}
      <div
        className="play-button-bg rounded-[50%] w-12 h-12 absolute top-2 right-2 cursor-pointer"
        onClick={handlePlayBtn}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          height="20"
          width="24"
          className="volume_button absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"
        >
          <path
            clipRule="evenodd"
            d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Zm6.328-.176a1.2 1.2 0 0 1 1.697 0A11.967 11.967 0 0 1 22.8 12a11.966 11.966 0 0 1-3.515 8.485 1.2 1.2 0 0 1-1.697-1.697A9.563 9.563 0 0 0 20.4 12a9.565 9.565 0 0 0-2.812-6.788 1.2 1.2 0 0 1 0-1.697Zm-3.394 3.393a1.2 1.2 0 0 1 1.698 0A7.178 7.178 0 0 1 18 12a7.18 7.18 0 0 1-2.108 5.092 1.2 1.2 0 1 1-1.698-1.698A4.782 4.782 0 0 0 15.6 12a4.78 4.78 0 0 0-1.406-3.394 1.2 1.2 0 0 1 0-1.698Z"
            fillRule="evenodd"
          ></path>
        </svg>
      </div>
      <div className="whitespace-pre-wrap pr-[42px]">{text}</div>
      <div className="flex justify-center mt-3 relative cursor-pointer">
        {/* 录音按钮 */}
        <div className="toggle w-[40px] h-[40px] mr-[30px]">
          <i className="ri-mic-fill z-[10] absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"></i>
          <input
            checked={recorderPressed}
            onChange={handleRecordBtnClick}
            type="checkbox"
            className="double-click absolute z-[11]"
          />
          <span className="button w-[50px] h-[50px] -translate-x-1/2 -translate-y-1/2"></span>
        </div>
        {/* 录音播放按钮 */}
        <div className="toggle w-[40px] h-[40px]">
          <i className="text-[22px] ri-play-circle-fill z-[10] absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"></i>
          <input
            checked={recordPlayBtnPressed}
            onChange={handleRecordPlayBtnClick}
            type="checkbox"
            className="absolute z-[11]"
          />
          <span className="button w-[50px] h-[50px] -translate-x-1/2 -translate-y-1/2"></span>
        </div>
      </div>
    </div>
  );
}
