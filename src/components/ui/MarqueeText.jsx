import React, { useState, useEffect, useRef } from 'react';

const MarqueeText = ({ text, className, style }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const isOverflowing = textRef.current.offsetWidth > containerRef.current.offsetWidth;
        setShouldAnimate(isOverflowing);
      }
    };

    checkOverflow();
    const timeout = setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text]);

  return (
    <div ref={containerRef} className={`marquee-container ${className}`} style={style}>
      <span
        ref={textRef}
        className={shouldAnimate ? 'marquee-content' : ''}
        data-text={text}
        style={{ animationDuration: `${Math.max(12, text.length * 0.6)}s` }}
      >
        {text}
      </span>
    </div>
  );
};

export default MarqueeText;
