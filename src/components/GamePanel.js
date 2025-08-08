import React, { useState } from 'react';
import './GamePanel.css';

function GamePanel({ onOpenDoor, onDetectBurnt, onDetectUnburnt, onCelebrate, onReset, onCodeSubmit }) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('Enter a secret code and press Go');

  const normalize = (str) => str.trim().toUpperCase();

  const handleSubmit = (e) => {
    e.preventDefault();
    const c = normalize(code);
    if (!c) return;

    if (onCodeSubmit) onCodeSubmit(c);

    switch (c) {
      case 'FIRE-2025':
      case 'OPEN-DOOR':
        onOpenDoor && onOpenDoor();
        setMessage('Door unlocked! 🚪✨');
        break;
      case 'BURN-IT':
      case 'BURNT':
        onDetectBurnt && onDetectBurnt();
        setMessage('Forcing burnt detection 🔥🧪');
        break;
      case 'LIGHT-IT':
      case 'UNBURNT':
        onDetectUnburnt && onDetectUnburnt();
        setMessage('Forcing unburnt (lit) detection 🔥✨');
        break;
      case 'HACK-STAR':
      case 'CELEBRATE':
        onCelebrate && onCelebrate();
        setMessage('Celebration time! 🎉');
        break;
      case 'RESET':
        onReset && onReset();
        setMessage('Reset done ♻️');
        break;
      default:
        setMessage('Unknown code. Try: FIRE-2025, BURN-IT, LIGHT-IT, HACK-STAR, RESET');
        break;
    }
  };

  return (
    <div className="game-panel">
      <h3>🎮 Challenge Mode</h3>
      <p className="hint">{message}</p>
      <form className="code-form" onSubmit={handleSubmit}>
        <input
          className="code-input"
          placeholder="Enter code (e.g., FIRE-2025)"
          value={code}
          onChange={(e)=>setCode(e.target.value)}
          aria-label="secret code"
        />
        <button className="go-btn" type="submit">Go</button>
      </form>
      <div className="suggestions">
        <button type="button" onClick={()=>setCode('FIRE-2025')}>FIRE-2025</button>
        <button type="button" onClick={()=>setCode('BURN-IT')}>BURN-IT</button>
        <button type="button" onClick={()=>setCode('LIGHT-IT')}>LIGHT-IT</button>
        <button type="button" onClick={()=>setCode('HACK-STAR')}>HACK-STAR</button>
      </div>
    </div>
  );
}

export default GamePanel;


