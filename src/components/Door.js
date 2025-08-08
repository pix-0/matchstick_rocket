import React from 'react';
import './Door.css';

function Door({ isOpen, onToggle }) {
  return (
    <div className="door-container">
      <h3>🚪 Door</h3>
      <div 
        className={`door ${isOpen ? 'open' : 'closed'}`}
        onClick={onToggle}
      >
        <div className="door-frame">
          <div className="door-panel">
            <div className="door-handle"></div>
            <div className="door-content">
              {isOpen ? (
                <div className="open-content">
                  <span className="door-icon">🚪</span>
                  <div className="light-beam"></div>
                </div>
              ) : (
                <div className="closed-content">
                  <span className="door-icon">🚪</span>
                  <div className="lock-indicator">🔒</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="door-status">
        {isOpen ? '✨ Door is unlocked and open' : '🔒 Door is locked and closed'}
      </p>
    </div>
  );
}

export default Door;
