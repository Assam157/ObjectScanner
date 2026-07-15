import { useState } from "react";

import Scanner from "./components/Scanner";
import ChairPage from "./components/ChairPage";
import MonitorPage from "./components/MonitorPage";
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

    switch (data.object) {

      case "chair":
        setPage("chair");
        break;

      case "monitor":
      case "tv":
      case "tvmonitor":
        setPage("monitor");
        break;

      default:
        setPage("notfound");

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

      {page === "notfound" && (

        <NotFoundPage
          goHome={() => setPage("scanner")}
        />

      )}

    </div>

  );

}

export default App;