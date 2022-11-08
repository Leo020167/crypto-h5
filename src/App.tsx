import { useState } from "react";
import "./App.css";
import { Button } from "antd-mobile";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Button color="primary">Hello</Button>
    </div>
  );
}

export default App;
