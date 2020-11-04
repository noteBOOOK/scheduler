import {useState} from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    let historyCopy = [...history];
    if (replace) {
      historyCopy.pop();
      historyCopy = [...historyCopy, newMode];
      setHistory(historyCopy);
      setMode(newMode);
    } else {
      historyCopy = [...history, newMode];
      setHistory(historyCopy);
      setMode(newMode);
    }
  }

  function back() {
    const historyCopy = [...history];
    if (history.length >= 2) {
      historyCopy.pop();
      setHistory(historyCopy);
      setMode(historyCopy[historyCopy.length - 1]);
    }
  }
  return { mode, transition, back };
}