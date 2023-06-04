import { ComponentProps, FunctionComponent } from "react";

interface AsciiCanvasProps extends ComponentProps<"canvas"> {
  id: string;
}

const AsciiCanvas: FunctionComponent<AsciiCanvasProps> = ({ id, ...props }) => {
  return <canvas id={id} style={{ width: "400px", height: "auto" }} {...props} />;
};

export default AsciiCanvas;
