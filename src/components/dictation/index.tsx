import React from "react";
import diff_match_patch from "diff-match-patch";

interface IProps {
  originalText: string;
  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Dictation(props: IProps) {
  const { originalText, isFocused, setIsFocused } = props;
  const dictationRef = React.useRef<HTMLDivElement>(null);
  const [diffResult, setDiffResult] = React.useState([]);
  const inputContentRef = React.useRef("");
  const dictationCheckInputRef = React.useRef<HTMLInputElement>(null);
  const firstRender = React.useRef(true);

  function handleDictationChange() {
    inputContentRef.current = dictationRef.current?.textContent || "";
  }

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (isFocused) {
      if (dictationRef.current) {
        dictationRef.current.textContent = inputContentRef.current;
      }
    } else {
      // @ts-ignore
      const dmp = new diff_match_patch();
      const diff = dmp.diff_main(
        originalText,
        dictationRef.current?.textContent || ""
      );
      setDiffResult(diff);
      if (diff.length === 1 && diff[0][0] === 0) {
        console.log(dictationCheckInputRef.current)
        if (!dictationCheckInputRef.current?.checked) {
          dictationCheckInputRef.current?.click();
        }
      }
      else {
        if (dictationCheckInputRef.current?.checked) {
          dictationCheckInputRef.current?.click();
        }
      }
      if (dictationRef.current) {
        dictationRef.current.textContent = "";
      }
    }
  }, [isFocused]);

  function handleClick() {
    setIsFocused(true);
    setTimeout(() => {
      dictationRef.current?.focus();
    });
  }

  return (
    <>
      <div className="dictation-check-container dark:shadow-dark-shadow w-[18px] h-[18px] mt-2 relative">
        <input ref={dictationCheckInputRef} type="checkbox" className="hidden" />
        <svg className="overflow-visible" viewBox="0 0 64 64" height="18px" width="18px">
          <path
            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
            pathLength="575.0541381835938"
            className="path"
          ></path>
        </svg>
        <div className="absolute top-[50%] -translate-y-1/2 left-7 whitespace-nowrap text-gray text-[14px]">请在下面默写原文</div>
      </div>
      <div className="relative">
        <div
          ref={dictationRef}
          className={`${
            !isFocused && diffResult.length ? "hidden" : ""
          } dictation-input dark:bg-bgDark dark:shadow-none w-full mt-4 text-[15px]`}
          contentEditable
          placeholder="在这里默写原文"
          onInput={handleDictationChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isFocused ? null : diffResult.length ? (
          <div
            className="dictation-input dark:bg-bgDark dark:shadow-none w-full mt-[16px] text-[15px]"
            onClick={handleClick}
          >
            <div className="w-full left-0 text-[15px] placeholder pointer-events-none">
              {diffResult.map(([result, text], i) => (
                <span
                  key={i}
                  className={`${
                    result === -1
                      ? "text-wrong w-full break-words"
                      : result === 1
                      ? "text-correct w-full break-words"
                      : ""
                  }`}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
