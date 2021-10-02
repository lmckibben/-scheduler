import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState(initial);

  const transition = (mode) => {
    return setMode(mode)
  }

  const back = () => {

  }

  return { mode, transition, back };
}