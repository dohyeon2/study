import { Suspense } from "react";
import "./App.css";
import TestComp from "./TestComp";

function App() {
  return (
    <div className="App">
      <Suspense fallback={<>test...</>}>
        <TestComp />
      </Suspense>
    </div>
  );
}

export default App;
