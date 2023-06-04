import { useEffect, useState } from "react";
import "./App.css";
import { MonAscii } from "./ascii";
// import image from "./assets/anne-hathaway.jpg";
import image from "./assets/github-irfan.jpeg";
import AsciiCanvas from "./component/canvas";
import WebcamInput from "./component/webcam";
import AsciiText from "./component/text";

const App = () => {
  const [text, setText] = useState<string[]>([]);
  useEffect(() => {
    const instance = new MonAscii(image, { font_size: 6 });
    // Ascii Text (Async)
    const fetch = async () => instance.toText().then(text => text && setText(text));
    fetch();
    // Ascii Canvas
    instance.toAscii();
  }, []);

  return (
    <div>
      <h1>
        Mon-Ascii
        <span style={{ fontSize: "14px", paddingLeft: 12 }}>
          by <a href="https://github.com/irfancoder">@irfancoder</a>
        </span>
      </h1>

      <h3>Showcase</h3>
      <p>1. Example with image input & canvas output</p>
      <img src={image} style={{ width: "400px", height: "auto" }}></img>
      <AsciiCanvas id="canvas" />

      <p>2. Example with image input & text output</p>
      <AsciiText data={text} />

      <h3>Demo: View yourself in Ascii!</h3>
      <p>3. Example with video input & canvas output</p>
      <WebcamInput />
    </div>
  );
};

export default App;
