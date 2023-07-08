import {
  SpeechConfig,
  SpeechSynthesizer,
  AudioConfig,
  SpeakerAudioDestination,
} from "microsoft-cognitiveservices-speech-sdk";

interface IOptions {
    voicerName: string,
}

export const speakText = (text: string, options: IOptions) => {
  const speechConfig = SpeechConfig.fromSubscription(
    process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY!,
    process.env.NEXT_PUBLIC_REGION!
  );
  const {voicerName} = options;

  speechConfig.speechSynthesisVoiceName = voicerName; // 使用Nanami Online (Natural) - Japanese (Japan)语音
  speechConfig.speechSynthesisOutputFormat = 8;
  const complete_cb = function () {
    synthesizer?.close();
    synthesizer = undefined;
  };
  const err_cb = function () {
    synthesizer?.close();
  };

  const player = new SpeakerAudioDestination();
  const audioConfig = AudioConfig.fromSpeakerOutput(player);

  let synthesizer: SpeechSynthesizer | undefined = new SpeechSynthesizer(
    speechConfig,
    audioConfig
  );
  synthesizer.speakTextAsync(text, complete_cb, err_cb);
};
