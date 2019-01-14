import React from "react";
import ReactDOM from "react-dom";

import data from "./data.json";
import "./styles.css";
import Board from "react-trello";

function App() {
  return (
    <div className="App">
      <h1>用户故事地图</h1>
      <Board data={data} draggable />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
