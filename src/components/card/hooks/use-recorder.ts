import { useEffect, useRef } from "react";

interface IParams {
  onEnd: (recordedChunks: BlobPart[]) => void;
}

// 录音的自定义Hook
// 输入是一个onEnd函数，参数是录制的BlobPart数组，这个数组代表录音数据，在onEnd函数中可以进行上传等逻辑。
// 输出是mediaRecorderRef，也就是录制的音频的MediaRecorder实例，这个实例可以用来触发开发录音和结束录音。
export function useRecorder({ onEnd }: IParams) {
  const mediaRecorderRef = useRef<MediaRecorder>();

  useEffect(() => {
    let recordedChunks: BlobPart[] = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        let mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener("dataavailable", (event: any) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        });

        mediaRecorder.addEventListener("stop", async () => {
          console.log(
            "stop事件触发，执行回调，当前的recordedChunks为：",
            recordedChunks
          );
          await onEnd(recordedChunks);
          // 清空录音数据
          recordedChunks = [];
        });
      })
      .catch((error) => {
        console.error("无法访问音频设备:", error);
      });
  }, []);

  return {
    mediaRecorderRef,
  };
}
