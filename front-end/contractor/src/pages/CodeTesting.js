import React, { useState, useTransition } from "react";
import { Spinner } from "react-bootstrap";

const CodeTesting = () => {
  function App() {
    const [isPending, startTransition] = useTransition();
    const [count, setCount] = useState(0);

    function handleClick() {
      startTransition(() => {
        setCount((c) => c + 1);
      });
    }

    return (
      <div>
        {isPending && <Spinner />}
        <button onClick={handleClick}>{count}</button>
      </div>
    );
  }

  return (
    <div>
      <App />
    </div>
  );
};

export default CodeTesting;
