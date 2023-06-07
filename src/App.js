import React from 'react';
import useLogData from './hooks/useLogData';

function App() {
  const logData = useLogData();

  if (!logData) {
    return <div>Loading log data...</div>;
  }

  return (
    <div>
      <h1>Tibia Log Extractor</h1>
      <h2>Log Data:</h2>
      <pre>{JSON.stringify(logData, null, 2)}</pre>
    </div>
  );
}

export default App;