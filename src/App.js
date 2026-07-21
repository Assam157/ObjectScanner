 import Scanner from './components/Scanner';
import ObjectScene from './components/ObjectScene';
import { useState } from 'react';
import "./App.css";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // optional, if you want a loading state

  const handleResult = (data) => {
    setResult(data);
    // setLoading(false) etc.
  };

  return (
    <div className="App">
      <div className="container">
        {/* Hero Section */}
        <div className="hero">
          <h1>Object Scanner</h1>
          <p>Upload an image to detect objects with our 3D visualizer</p>
        </div>

        {/* Main Card */}
        <div className="card">
          {result ? (
            <>
              <h2 className="success">Detected: {result.object}</h2>
              <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
              <div style={{ width: '100%', height: '400px', marginTop: '20px' }}>
                <ObjectScene objectType={result.object} />
              </div>
              <button onClick={() => setResult(null)} className="mt20">
                Scan Again
              </button>
            </>
          ) : (
            // The Scanner component will be rendered inside the card
            // You can pass className to it if it accepts one, or wrap it
            <div>
              <Scanner onResult={handleResult} />
            </div>
          )}
        </div>

        {/* Optional footer */}
        <div className="footer">
          <p>Powered by Three.js & React</p>
        </div>
      </div>
    </div>
  );
}

export default App;
