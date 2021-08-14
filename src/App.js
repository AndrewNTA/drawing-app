import React from 'react';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      <Button onClick={console.log('hello')} text={'say hello'}/>
    </div>
  );
}

export default App;
