import { useEffect, useState } from "react";
import "./App.css";
import { MonAscii } from "./ascii";
// import image from "./assets/anne-hathaway.jpg";
// import image from "./assets/irfan.jpeg";
import image from "./assets/github-irfan.jpeg";

const App = () => {
  const [text, setText] = useState<string[]>([]);
  useEffect(() => {
    const instance = new MonAscii(image);
    const fetch = async () => instance.toText().then(text => text && setText(text));
    fetch();

    instance.toAscii();
  }, []);

  return (
    <div>
      <img src={image} style={{ width: "400px", height: "auto" }}></img>
      <canvas id="canvas" style={{ width: "400px", height: "auto" }}></canvas>
      <p
        style={{
          backgroundColor: "darkblue",
          whiteSpace: "pre",
          fontSize: 8,
          lineHeight: 1,
          letterSpacing: 2.5,
          color: "white",
          fontFamily: "monospace",
        }}
      >
        {text.join("\n")}
      </p>
      <p
        style={{
          backgroundColor: "red",
          whiteSpace: "pre",
          fontSize: 8,
          lineHeight: 1,
          letterSpacing: 2.5,
          color: "white",
          fontFamily: "monospace",
        }}
      >
        {text.join("\n")}
      </p>
    </div>
  );
};

export default App;
