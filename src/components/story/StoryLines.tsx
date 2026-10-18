import { Fragment } from "react";
import type { TextLines } from "@/data/origin-content";

/** Renders authored text: a string, or an array of lines that break exactly as authored. */
export const Lines: React.FC<{ value: TextLines }> = ({ value }) => {
  const lines = Array.isArray(value) ? value : [value];
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
};
