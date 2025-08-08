import React, { useEffect, useRef } from 'react';
import './GameOverlay.css';

function GameOverlay({ visible, onClose, code = '' }) {
  const containerRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!visible) return;

    const container = containerRef.current;
    const canvas = container.querySelector('#c');
    const ctx = canvas.getContext('2d');
    const scoreBox = container.querySelector('#scoreBox');
    const overlay = container.querySelector('#overlay');
    const overlayText = container.querySelector('#overlayText');
    const resumeBtn = container.querySelector('#resumeBtn');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Game state
    let W = canvas.width, H = canvas.height;
    let running = true;
    let paused = false;
    let score = 0;

    const player = {
      x: Math.floor(W * 0.12),
      y: Math.floor(H * 0.5),
      w: 28,
      h: 64,
      vy: 0,
      gravity: 0.45,
      thrust: -0.95,
    };

    let fires = [];
    let spawnTimer = 0;
    let spawnInterval = 1400 + (Math.random()*400);
    let speed = Math.max(3, Math.round(W/320));
    let keyDown = false;
    let lastTs = performance.now();

    const jumpSound = new Audio('https://cdn.jsdelivr.net/gh/terkelg/awesome-audio@main/jump.wav');
    const gameOverSound = new Audio('https://cdn.jsdelivr.net/gh/terkelg/awesome-audio@main/gameover.wav');

    const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

    function reset(){
      W = canvas.width; H = canvas.height;
      player.y = Math.floor(H*0.5);
      player.vy = 0;
      fires = [];
      spawnTimer = 0;
      spawnInterval = 1200 + Math.random()*800;
      speed = Math.max(3, Math.round(W/320));

      // Apply code-based difficulty tweaks
      const c = (code || '').toUpperCase();
      if (c.includes('FIRE') || c.includes('HARD') || c.includes('2025')) {
        speed = Math.round(speed * 1.4);
        spawnInterval = Math.max(700, Math.round(spawnInterval * 0.7));
      } else if (c.includes('LIGHT') || c.includes('EASY')) {
        speed = Math.max(2, Math.round(speed * 0.8));
        spawnInterval = Math.round(spawnInterval * 1.2);
      }
      score = 0;
      running = true;
      paused = false;
      overlay.style.display = 'none';
      scoreBox.textContent = 'Score: 0';
    }

    function drawPlayer(){
      const x = Math.round(player.x), y = Math.round(player.y);
      ctx.fillStyle = '#a06030';
      ctx.fillRect(x, y, player.w, player.h - 14);
      if(!running){
        ctx.fillStyle = '#222';
        ctx.fillRect(x, y - 14, player.w, 14);
        for(let i=0; i<4; i++){
          ctx.globalAlpha = 0.3 + 0.15*i;
          ctx.beginPath();
          ctx.arc(x + player.w/2 + Math.sin(performance.now()/300 + i)*6, y - 22 - i*12, 10 + i*3, 0, Math.PI*2);
          ctx.fillStyle = '#bbb';
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }else{
        ctx.fillStyle = '#ffd56b';
        ctx.fillRect(x, y - 14, player.w, 14);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(x-2,y,2,player.h-14);
    }

    function spawnPair(){
      const thickness = Math.max(42, Math.floor(W * 0.06));
      const gapHeight = Math.max(110, Math.floor(H * 0.24));
      const minGapTop = 60;
      const gapTop = Math.floor(minGapTop + Math.random() * (H - gapHeight - minGapTop - 60));
      const isTop = Math.random() < 0.5;
      const y = isTop ? gapTop - 24 : gapTop + gapHeight;
      const h = 24;
      const idBase = Date.now() + Math.random();
      const fire = { x: W + 20, y, w: thickness, h, emojiSize: 24, pairId: idBase, counted:false };
      fires.push(fire);
    }

    function spawnLogic(delta){
      spawnTimer += delta;
      if(spawnTimer >= spawnInterval){
        spawnTimer = 0;
        spawnInterval = 1100 + Math.random()*800;
        spawnPair();
      }
    }

    function drawFireEmoji(ob){
      ctx.save();
      const size = 24;
      ctx.font = `${size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const t = performance.now() / 250 + ob.x;
      const flickerY = Math.sin(t) * 4;
      ctx.fillText('🔥', ob.x + ob.w/2, ob.y + ob.h/2 + flickerY);
      ctx.restore();
    }

    function update(delta){
      if(!running || paused) return;
      if(keyDown) player.vy += player.thrust * (delta/16);
      player.vy += player.gravity * (delta/16);
      player.y += player.vy * (delta/16);
      player.y = clamp(player.y, 0, H - player.h);

      for(let i = fires.length - 1; i >= 0; i--){
        fires[i].x -= speed * (delta/16);
        if(fires[i].x + fires[i].w < -50){
          fires.splice(i,1);
        }
      }

      fires.forEach(ob => {
        if(ob.x + ob.w < player.x && !ob.counted){
          fires.forEach(o => { if(o.pairId === ob.pairId) o.counted = true; });
          score++;
          scoreBox.textContent = `Score: ${score}`;
        }
      });

      spawnLogic(delta);

      for(const ob of fires){
        if(ob.h > 8 && player.x < ob.x + ob.w && player.x + player.w > ob.x && player.y < ob.y + ob.h && player.y + player.h > ob.y){
          if(running){ gameOverSound.currentTime = 0; gameOverSound.play(); }
          running = false;
        }
      }
    }

    function draw(){
      ctx.clearRect(0,0,W,H);
      const grad = ctx.createLinearGradient(0,0,0,H);
      grad.addColorStop(0,'#071022'); grad.addColorStop(1,'#07132a');
      ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
      for(const ob of fires){ drawFireEmoji(ob); }
      drawPlayer();
      if(!running){
        ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle = '#fff'; ctx.font = '42px monospace'; ctx.textAlign='center';
        ctx.fillText('Game Over', W/2, H/2 - 20);
        ctx.font = '20px monospace'; ctx.fillText(`Score: ${score}`, W/2, H/2 + 16);
        ctx.font = '16px monospace'; ctx.fillText('Click or tap to restart', W/2, H/2 + 54);
      }
    }

    function loop(ts){
      const delta = Math.min(60, ts - lastTs);
      lastTs = ts;
      update(delta);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    const keyDownHandler = (e) => {
      if(e.code === 'Space' || e.code === 'ArrowUp'){
        keyDown = true; e.preventDefault();
        player.vy = player.thrust * 1.5;
        jumpSound.currentTime = 0; jumpSound.play();
      }
      if(e.code === 'KeyP'){ paused = !paused; overlay.style.display = paused ? 'flex' : 'none'; overlayText.textContent = paused ? 'Paused' : ''; }
      if(e.code === 'Enter'){
        e.preventDefault();
        // Reset the game immediately
        reset();
        lastTs = performance.now();
        requestAnimationFrame(loop);
      }
    };
    const keyUpHandler = (e) => {
      if(e.code === 'Space' || e.code === 'ArrowUp'){ keyDown = false; e.preventDefault(); }
    };
    const pointerDown = (ev) => {
      keyDown = true; ev.preventDefault();
      player.vy = player.thrust * 1.5;
      jumpSound.currentTime = 0; jumpSound.play();
    };
    const pointerUp = () => { keyDown = false; };
    const clickRestart = () => { if(!running){ reset(); lastTs = performance.now(); requestAnimationFrame(loop); } };

    window.addEventListener('keydown', keyDownHandler, { passive:false });
    window.addEventListener('keyup', keyUpHandler, { passive:false });
    canvas.addEventListener('pointerdown', pointerDown, { passive:false });
    window.addEventListener('pointerup', pointerUp, { passive:false });
    canvas.addEventListener('click', clickRestart);
    resumeBtn.addEventListener('click', () => { paused = false; overlay.style.display='none'; });

    reset();
    lastTs = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    canvas.focus();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
      window.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('click', clickRestart);
    };
  }, [visible, code]);

  if (!visible) return null;

  return (
    <div className="game-overlay">
      <div className="game-container" ref={containerRef}>
        <canvas id="c" tabIndex="0"></canvas>
        <div id="scoreBox">Score: 0</div>
        <div id="hint">Hold Space / ↑ or touch/hold to rise</div>
        <div id="overlay" className="pausedOverlay" style={{ display: 'none' }}>
          <div className="panel">
            <div id="overlayText">Paused</div>
            <button id="resumeBtn">Resume</button>
          </div>
        </div>
        {code ? <div className="code-badge">Mode: {code.toUpperCase()}</div> : null}
        <button className="exit-btn" onClick={onClose}>Exit Game</button>
      </div>
    </div>
  );
}

export default GameOverlay;


