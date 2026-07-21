 import Scanner from './components/Scanner';
import ObjectScene from './components/ObjectScene';
import { useState } from 'react';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleCapture = (imageData) => {
    setIsScanning(true);
    // Send imageData to your backend (Scanner already handles this)
    // The Scanner component will call onResult when done
  };

  const handleResult = (data) => {
    setIsScanning(false);
    setResult(data);
  };

  const reset = () => setResult(null);

  return (
    <div className="App">
      <div className="container">
        {result ? (
          <div className="result-card">
            <h2>🔍 {result.object}</h2>
            <p>{(result.confidence * 100).toFixed(0)}%</p>
            <div className="scene-box">
              <ObjectScene objectType={result.object} />
            </div>
            <button className="btn-round" onClick={reset}>⟳</button>
          </div>
        ) : (
          <Scanner
            onResult={handleResult}
            onCapture={handleCapture}
            isScanning={isScanning}
          />
        )}
      </div>
    </div>
  );
}

export default App;