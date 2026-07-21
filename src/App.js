 import Scanner from './components/Scanner';
import ObjectScene from './components/ObjectScene';

function App() {
  const [result, setResult] = useState(null);

  const handleResult = (data) => {
    setResult(data);
  };

  return (
    <div>
      {result ? (
        <div>
          <h2>Detected: {result.object}</h2>
          <p>Confidence: {result.confidence}</p>
          <div style={{ width: '100%', height: '400px' }}>
            <ObjectScene objectType={result.object} />
          </div>
          <button onClick={() => setResult(null)}>Scan Again</button>
        </div>
      ) : (
        <Scanner onResult={handleResult} />
      )}
    </div>
  );
}
