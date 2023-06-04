import { FunctionComponent, useRef, useState } from "react";
import { MonAscii } from "../ascii";
import AsciiCanvas from "./canvas";

const WebcamInput: FunctionComponent = () => {
  const preview = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);

  const [enabled, setEnabled] = useState<boolean>(false);

  const enableWebcam = () => {
    navigator?.mediaDevices
      .getUserMedia({ video: true })
      .then(src => {
        if (!preview.current) return;
        stream.current = src;
        preview.current.srcObject = src;
        setEnabled(true);

        new MonAscii("preview", {
          id: "video_ascii",
          type: "video",
          font_size: 4,
          ascii_chars: "Ñ@#W$9876543210?!abc;:+=-,._            ",
        }).toVideo();
      })
      .catch(e => {
        alert(`Video capture not working. Error: ${e}`);
        console.error(e);
      });
  };

  const disableWebcam = () => {
    stream.current?.getTracks().forEach(track => track.stop());
    setEnabled(false);
  };

  return (
    <div>
      <div style={{ paddingBottom: "8px" }}>
        <button onClick={enabled ? disableWebcam : enableWebcam}>
          {!enabled ? "Enable video preview" : "Disable video preview"}
        </button>
      </div>

      <video id="preview" ref={preview} style={{ aspectRatio: "4 / 3" }} autoPlay></video>
      <AsciiCanvas
        id="video_ascii"
        style={{ width: "auto", height: "480px", aspectRatio: "4 / 3" }}
      />
      <small style={{ display: "block", paddingBottom: "8px" }}>
        Disclaimer: This application does not capture / store any content from its usage. Feel free
        to inspect the code in <a href="https://github.com/irfancoder/mon-ascii">GitHub</a>
      </small>
    </div>
  );
};

export default WebcamInput;
