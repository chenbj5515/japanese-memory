import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Dictation } from "@/components";

const UPDATE_TRANSLATION = gql`
  mutation UpdateMemoCard(
    $id: uuid!
    $update_time: timestamptz
    $translation: String
  ) {
    update_memo_card_by_pk(
      pk_columns: { id: $id }
      _set: { update_time: $update_time, translation: $translation }
    ) {
      id
    }
  }
`;

export function Translate(props: any) {
  const { item } = props;
  const [updateTranslation] = useMutation(UPDATE_TRANSLATION);
  const translationTextRef = React.useRef<any>(null);
  function handleBlur(cardID: string) {
    updateTranslation({
      variables: {
        translation: translationTextRef.current?.textContent,
        update_time: new Date(),
        id: cardID,
      },
    });
  }
  return (
    <>
      <div className="card rounded-[20px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-5 w-[675px] width-92-675 mx-auto mt-10 relative">
        <div
          ref={translationTextRef}
          contentEditable
          onBlur={() => handleBlur(item.id)}
          className="whitespace-pre-wrap pr-[42px] outline-none leading-[3]"
        >
          {item.translation}
        </div>
        <Dictation originalText={item.original_text} cardID={item.id} />
      </div>
    </>
  );
}
