import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Swipe({ prev, next }) {
  const navigate = useNavigate();
  const [startX, setStartX] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const handleStart = (e) => {
      setIsTouch(e.type === 'touchstart');
      setStartX(e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
    };

    const handleMove = (e) => {
      if (isTouch) {
        e.preventDefault();
      }
    };

    const handleEnd = (e) => {
      const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const deltaX = endX - startX;
      const threshold = 50;

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && prev) {
          navigate(prev);
        } else if (deltaX < 0 && next) {
          navigate(next);
        }
      }
      setStartX(0);
    };

    document.addEventListener('mousedown', handleStart);
    document.addEventListener('touchstart', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousedown', handleStart);
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [startX, isTouch, navigate, prev, next]);

  return <div>Swipe or click and drag to navigate</div>;
}

export { Swipe };
