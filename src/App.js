 import { useState } from "react";

import Scanner from "./components/Scanner";
import ChairPage from "./components/ChairPage";
import MonitorPage from "./components/MonitorPage";
import HammerPage from "./components/HammerPage";
import ScissorPage from "./components/ScissorPage";
import SpoonPage from "./components/SpoonPage";
import NotFoundPage from "./components/NotFoundPage";

import "./App.css";

function App() {

  const [page, setPage] = useState("scanner");

  const [result, setResult] = useState({
    image: "",
    confidence: 0,
    object: ""
  });

  const showResult = (data) => {

    setResult(data);

    switch ((data.object || "").toLowerCase()) {

      case "chair":
        setPage("chair");
        break;

      case "monitor":
      case "tv":
      case "tvmonitor":
        setPage("monitor");
        break;

      case "hammer":
        setPage("hammer");
        break;

      case "scissor":
      case "scissors":
        setPage("scissor");
        break;

      case "spoon":
        setPage("spoon");
        break;

      default:
        setPage("notfound");
        break;

    }

  };

  return (

    <div className="App">

      {page === "scanner" && (

        <Scanner
          onResult={showResult}
        />

      )}

      {page === "chair" && (

        <ChairPage
          result={result}
          goHome={() => setPage("scanner")}
        />

      )}

      {page === "monitor" && (

        <MonitorPage
          result={result}
          goHome={() => setPage("scanner")}
        />

      )}

      {page === "hammer" && (

        <HammerPage
          result={result}
          goHome={() => setPage("scanner")}
        />

      )}

      {page === "scissor" && (

        <ScissorPage
          result={result}
          goHome={() => setPage("scanner")}
        />

      )}

      {page === "spoon" && (

        <SpoonPage
          result={result}
          goHome={() => setPage("scanner")}
        />

      )}

      {page === "notfound" && (

        <NotFoundPage
          goHome={() => setPage("scanner")}
        />

      )}

    </div>

  );

}

export default App;
