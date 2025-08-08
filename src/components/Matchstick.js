import React, { useEffect, useState } from 'react';
import './Matchstick.css';

function Matchstick({ isBurnt, isMoving, destination, onAnimationComplete }) {
  const [hide, setHide] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isBurnt !== null) {
      setAnimate(true);
      
      // Start movement animation after a short delay
      setTimeout(() => {
        if (isBurnt) {
          // Move to matchbox (left side)
          setPosition({ x: -300, y: -100 });
        } else {
          // Move to door (right side)
          setPosition({ x: 300, y: 0 });
        }
      }, 1000);

      // Scale down animation when reaching destination
      setTimeout(() => {
        setScale(0.3);
      }, 2500);

      // Hide matchstick after movement completes
      const hideTimer = setTimeout(() => {
        setHide(true);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 3500);

      return () => clearTimeout(hideTimer);
    }
  }, [isBurnt, onAnimationComplete]);

  if (hide) return null;

  return (
    <div className="matchstick-container">
      <div 
        className={`matchstick ${isBurnt ? 'burnt' : 'lit'} ${animate ? 'animate' : ''} ${isMoving ? 'moving' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: position.x !== 0 ? 'transform 2s ease-in-out' : 'none'
        }}
      >
        {isBurnt ? (
          <div className="burnt-matchstick">
            <div className="stick"></div>
            <div className="burnt-tip"></div>
            <div className="smoke">
              <div className="smoke-particle"></div>
              <div className="smoke-particle"></div>
              <div className="smoke-particle"></div>
            </div>
          </div>
        ) : (
          <div className="lit-matchstick">
            <div className="stick"></div>
            <div className="flame">
              <div className="flame-inner"></div>
              <div className="flame-outer"></div>
            </div>
            <div className="sparkles">
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
            </div>
          </div>
        )}
      </div>
      <p className="matchstick-text">
        {isBurnt === null
          ? '🔥 Waiting for detection…'
          : isBurnt
          ? '🔥 പുകഞ്ഞ കോളി പുറത്ത് (Burnt)'
          : '🔥 കോളി കത്തുന്നു (Lit)'}
      </p>
    </div>
  );
}

export default Matchstick;
