import { useState, useEffect } from 'react';

export default function FlipDigit({ value }) {
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);
  useEffect(() => {
    if (value !== prev) {
      setFlipping(true);
      const timeout = setTimeout(() => {
        setFlipping(false);
        setPrev(value);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [value, prev]);
  return (
    <span className={`flip-digit${flipping ? ' flipping' : ''}`} style={{ display: 'inline-block', minWidth: 24, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
      <span className="flip-digit-top">{prev}</span>
      <span className="flip-digit-bottom">{value}</span>
      <style>{`
        .flip-digit { position: relative; perspective: 80px; }
        .flip-digit-top, .flip-digit-bottom { display: block; font-size: 1.18em; font-weight: 900; color: inherit; background: none; border-radius: 4px; line-height: 1.1; }
        .flip-digit-top { z-index: 2; background: none; }
        .flip-digit-bottom { position: absolute; top: 0; left: 0; right: 0; z-index: 1; background: none; transform: rotateX(90deg); opacity: 0; }
        .flip-digit.flipping .flip-digit-top { animation: flipTop 0.3s forwards; }
        .flip-digit.flipping .flip-digit-bottom { animation: flipBottom 0.3s 0.3s forwards; }
        @keyframes flipTop { 0% { transform: rotateX(0); } 100% { transform: rotateX(-90deg); opacity: 0; } }
        @keyframes flipBottom { 0% { transform: rotateX(90deg); opacity: 0; } 100% { transform: rotateX(0); opacity: 1; } }
      `}</style>
    </span>
  );
} 