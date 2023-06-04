import { ComponentProps, FunctionComponent } from "react";
interface AsciiTextProps extends ComponentProps<"p"> {
  data: string[];
}

const AsciiText: FunctionComponent<AsciiTextProps> = ({ data = [], ...props }) => {
  return (
    <p
      style={{
        backgroundColor: "black",
        whiteSpace: "pre-line",
        fontSize: 6,
        lineHeight: 1,
        letterSpacing: 2,
        color: "white",
        fontFamily: "monospace",
      }}
      {...props}
    >
      {data.join("\n")}
    </p>
  );
};

export default AsciiText;
