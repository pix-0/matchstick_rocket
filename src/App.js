import React, { useState } from 'react';
import './App.css';
import Matchstick from './components/Matchstick';
import UploadSection from './components/UploadSection';
import Door from './components/Door';
import Matchbox from './components/Matchbox';
import GamePanel from './components/GamePanel';
import GameOverlay from './components/GameOverlay';

function App() {
  const [isBurnt, setIsBurnt] = useState(null);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasBurntMatchstick, setHasBurntMatchstick] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [showMatchstick, setShowMatchstick] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [gameCode, setGameCode] = useState('');

  // Simple image processing function using contrast analysis
  const processImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Calculate average brightness and contrast
        let totalBrightness = 0;
        let totalPixels = data.length / 4;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;
        }
        
        const averageBrightness = totalBrightness / totalPixels;
        
        // Simple logic: darker images (lower brightness) are more likely to be burnt
        // This is a simplified approach - in reality, you'd use more sophisticated image analysis
        const isBurnt = averageBrightness < 128; // Threshold for "burnt" detection
        
        resolve(isBurnt);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (file) => {
    setUploadedImage(file);
    setIsProcessing(true);
    setIsBurnt(null);
    setIsMoving(false);
    setIsDoorOpen(false);
    setHasBurntMatchstick(false);
    setShowMatchstick(false);
    
    try {
      // Process the image
      const result = await processImage(file);
      
      // Add some randomness to make it more interesting
      const randomFactor = Math.random() > 0.3 ? result : !result;
      
      setIsBurnt(randomFactor);
      setIsProcessing(false);
      
      // Show matchstick after processing
      setTimeout(() => {
        setShowMatchstick(true);
      }, 500);
      
      // Start movement animation after a short delay
      setTimeout(() => {
        setIsMoving(true);
      }, 1500);
      
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback to random result
      const randomBurnt = Math.random() > 0.5;
      setIsBurnt(randomBurnt);
      setIsProcessing(false);
      
      setTimeout(() => {
        setShowMatchstick(true);
      }, 500);
      
      setTimeout(() => {
        setIsMoving(true);
      }, 1500);
    }
  };

  const handleAnimationComplete = () => {
    if (isBurnt) {
      // Burnt matchstick goes to matchbox
      setHasBurntMatchstick(true);
    } else {
      // Unburnt matchstick opens the door
      setIsDoorOpen(true);
      setTimeout(() => setShowGame(true), 400);
    }
  };

  const handleDoorToggle = () => {
    const next = !isDoorOpen;
    setIsDoorOpen(next);
    if (next) {
      setTimeout(() => setShowGame(true), 300);
    }
  };

  const resetApp = () => {
    setIsBurnt(null);
    setIsDoorOpen(false);
    setUploadedImage(null);
    setIsProcessing(false);
    setHasBurntMatchstick(false);
    setIsMoving(false);
    setShowMatchstick(false);
    setShowGame(false);
    setGameCode('');
    // Full refresh to return to a clean starting page state
    window.location.reload();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔥 MatchGuard — Burnt Matchstick Detector</h1>
        <p>Upload an image. We’ll analyze and animate the result with a delightful experience.</p>
        <button className="reset-button" onClick={resetApp}>
          🔄 Reset
        </button>
      </header>

      <div className="main-content">
        <div className="main-card">
          {/* Main row: matchstick | uploaded image | door */}
          <div className="layout-grid">
            <div className="grid-item matchstick-area">
              {showMatchstick && (
                <Matchstick 
                  isBurnt={isBurnt} 
                  isMoving={isMoving}
                  onAnimationComplete={handleAnimationComplete}
                />
              )}
            </div>
            <div className="grid-item upload-area">
              <UploadSection onImageUpload={handleImageUpload} />
            </div>
            <div className="grid-item door-area">
              <Door isOpen={isDoorOpen} onToggle={handleDoorToggle} />
            </div>
          </div>

          {/* Secondary row: matchbox status */}
          <div className="secondary-row">
            <div className="grid-item matchbox-area">
              <Matchbox hasBurntMatchstick={hasBurntMatchstick} />
            </div>
          </div>

          {/* Challenge Mode */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GamePanel
              onOpenDoor={() => { setIsDoorOpen(true); setTimeout(()=>setShowGame(true), 300); }}
              onDetectBurnt={() => { setIsBurnt(true); setShowMatchstick(true); setIsMoving(true); }}
              onDetectUnburnt={() => { setIsBurnt(false); setShowMatchstick(true); setIsMoving(true); setTimeout(()=>{ setIsDoorOpen(true); setShowGame(true); }, 1200); }}
              onCelebrate={() => { setShowGame(true); }}
              onReset={resetApp}
              onCodeSubmit={(code)=> setGameCode(code)}
            />
          </div>
        </div>
      </div>

      {uploadedImage && (
        <div className="status-section">
          <h3>📊 Analysis Status</h3>
          <p>
            {isProcessing 
              ? '🔄 Processing image...' 
              : isBurnt 
                ? '🔥 Matchstick detected as BURNT! Moving to matchbox...' 
                : '✅ Matchstick appears to be UNBURNT. Moving to door...'}
          </p>
        </div>
      )}

      {/* Game overlay */}
      <GameOverlay visible={showGame} onClose={() => setShowGame(false)} code={gameCode} />
    </div>
  );
}

export default App;
