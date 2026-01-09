import React, { type DetailedHTMLProps, type InputHTMLAttributes } from "react";

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const createFileInput = () => {
  function Button({ id, className, children, onClick, ...props }: Props) {
    return (
      <>
        <button type="button" id={id} className={className} onClick={(e) => {}}>
          {children}
        </button>
        <input {...props} type="file" style={{ display: "none" }} />
      </>
    );
  }

  return {
    Button,
  };
};
