import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ 
  start = 0, 
  end, 
  duration = 2000, 
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = '.',
  onComplete = () => {}
}) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const countRef = useRef(start);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  const animate = React.useCallback(() => {
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (easeOutQuart)
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    const easedProgress = easeOutQuart(progress);

    const currentCount = start + (end - start) * easedProgress;
    countRef.current = currentCount;
    setCount(currentCount);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      onComplete();
    }
  }, [duration, end, onComplete, start, suffix, prefix, decimals, separator]);

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setIsAnimating(true);
      startTimeRef.current = Date.now();
      animate();
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, delay]);

  // Format number with separator
  const formatNumber = (num) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join(',');
  };

  return (
    <span className={`animated-counter ${isAnimating ? 'animating' : ''}`}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
