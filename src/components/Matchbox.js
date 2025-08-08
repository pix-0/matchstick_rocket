import React from 'react';
import './Matchbox.css';

function Matchbox({ hasBurntMatchstick }) {
  return (
    <div className="matchbox-container">
      <h3>📦 Matchbox</h3>
      <div className={`matchbox ${hasBurntMatchstick ? 'has-burnt' : ''}`}>
        <div className="matchbox-body">
          <div className="matchbox-front">
            <div className="striker-strip"></div>
            <div className="matchbox-label">MATCHES</div>
          </div>
          <div className="matchbox-side"></div>
          <div className="matchbox-top"></div>
        </div>
        {hasBurntMatchstick && (
          <div className="burnt-matchstick-inside">
            <div className="burnt-stick-inside"></div>
            <div className="smoke-inside">
              <div className="smoke-particle-inside"></div>
              <div className="smoke-particle-inside"></div>
            </div>
          </div>
        )}
      </div>
      <p className="matchbox-status">
        {hasBurntMatchstick ? '🔥 Contains burnt matchstick' : '📦 Empty matchbox'}
      </p>
    </div>
  );
}

export default Matchbox;
