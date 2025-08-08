import React, { useRef, useState } from 'react';
import './UploadSection.css';

function UploadSection({ onImageUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [contrast, setContrast] = useState(100);
  const imageRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      setIsProcessing(true);
      setProgress(0);
      if (onImageUpload) {
        onImageUpload(file);
      }
      // Simulate processing with progress
      const start = Date.now();
      const durationMs = 2000;
      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(timer);
          setIsProcessing(false);
        }
      }, 80);
    } else {
      alert('Please upload an image file');
    }
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
    setContrast(100);
  };

  const dataUrlToFile = async (dataUrl, fileName) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type || 'image/png' });
  };

  const generateSample = async (variant) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 512, 320);
    if (variant === 'burnt') {
      gradient.addColorStop(0, '#111');
      gradient.addColorStop(1, '#3a1f1f');
    } else {
      gradient.addColorStop(0, '#fafafa');
      gradient.addColorStop(1, '#fff6e0');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // draw a simple match-like shape for aesthetics
    ctx.fillStyle = variant === 'burnt' ? '#2f2f2f' : '#a0522d';
    ctx.fillRect(250, 60, 12, 180);
    ctx.beginPath();
    ctx.arc(256, 58, 10, 0, Math.PI * 2);
    ctx.fillStyle = variant === 'burnt' ? '#2b2b2b' : '#ffb400';
    ctx.fill();

    const dataUrl = canvas.toDataURL('image/png');
    const file = await dataUrlToFile(dataUrl, `sample-${variant}.png`);
    handleFile(file);
  };

  return (
    <div className="upload-section">
      <h3>📷 Upload Image</h3>
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="file-input"
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-label">
          {selectedFile ? (
            <div className="selected-file">
              <div className="image-preview">
                <img 
                  ref={imageRef}
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  className="preview-image"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    filter: `contrast(${contrast}%)`
                  }}
                />
                {isProcessing && (
                  <div className="processing-overlay">
                    <div className="progress">
                      <div className="bar" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p>Analyzing… {progress}%</p>
                  </div>
                )}
              </div>
              <div className="controls">
                <div className="control">
                  <label>Zoom</label>
                  <input type="range" min="0.5" max="2" step="0.1" value={zoom} onChange={(e)=>setZoom(Number(e.target.value))} />
                </div>
                <div className="control">
                  <label>Rotate</label>
                  <input type="range" min="-45" max="45" step="1" value={rotation} onChange={(e)=>setRotation(Number(e.target.value))} />
                </div>
                <div className="control">
                  <label>Contrast</label>
                  <input type="range" min="50" max="150" step="1" value={contrast} onChange={(e)=>setContrast(Number(e.target.value))} />
                </div>
                <button className="reset-view" onClick={resetView}>Reset View</button>
                <div className="actions">
                  <button type="button" className="sample-btn" onClick={()=>generateSample('burnt')}>Use Sample Burnt</button>
                  <button type="button" className="sample-btn" onClick={()=>generateSample('fresh')}>Use Sample Unburnt</button>
                  <button type="button" className="sample-btn outline" onClick={()=>{ setSelectedFile(null); setZoom(1); setRotation(0); setContrast(100); }}>Clear</button>
                </div>
              </div>
              <p className="file-name">{selectedFile.name}</p>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">
                <span className="icon">📁</span>
                <div className="upload-arrow">↑</div>
              </div>
              <p className="upload-text">Drag & drop image here</p>
              <p className="upload-hint">or click to browse</p>
              <div className="actions">
                <button type="button" className="sample-btn" onClick={()=>generateSample('burnt')}>Sample Burnt</button>
                <button type="button" className="sample-btn" onClick={()=>generateSample('fresh')}>Sample Unburnt</button>
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

export default UploadSection;
