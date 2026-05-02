import { useEffect, useRef, useState } from "react";

export function Typewriter({ text, speed = 18, onDone, className }: { text: string; speed?: number; onDone?: () => void; className?: string }) {
  const [out, setOut] = useState("");
  const i = useRef(0);
  useEffect(() => {
    setOut("");
    i.current = 0;
    const id = setInterval(() => {
      i.current++;
      setOut(text.slice(0, i.current));
      if (i.current >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone]);
  return <span className={className}>{out}<span className="blink text-neon-green">▋</span></span>;
}
