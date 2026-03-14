import React, { useEffect, useRef } from 'react';

// Elegant subtle matrix rain — blue-toned, slow, premium
export default function MatrixCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const COL_W = 28;
    let cols, drops;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / COL_W);
      drops = Array.from({ length: cols }, () => -(Math.random() * 60));
    };

    const CHARS = ['0', '1', '·', '○', '∘', '◦', '—', '|', '∙'];

    const step = () => {
      ctx.fillStyle = 'rgba(5, 5, 18, 0.045)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '11px "JetBrains Mono", monospace';

      for (let i = 0; i < drops.length; i++) {
        if (drops[i] < 0) { drops[i] += 0.18; continue; }
        const y = drops[i] * COL_W;
        const x = i * COL_W;
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const r = Math.random();

        // Head is brightest
        if (r > 0.96) {
          ctx.fillStyle = 'rgba(147, 197, 253, 0.20)';
        } else if (r > 0.75) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.10)';
        } else {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
        }
        ctx.fillText(char, x, y);

        drops[i] += 0.14; // very slow and elegant
        if (y > canvas.height && Math.random() > 0.992) {
          drops[i] = -(Math.random() * 40);
        }
      }
      animId = requestAnimationFrame(step);
    };

    init();
    step();
    window.addEventListener('resize', init);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}
