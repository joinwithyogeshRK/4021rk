import { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix rain characters - expanded character set
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,./<>?';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y position of each column
    const drops: number[] = [];
    // Array to track the color of each column
    const colors: string[] = [];
    // Array to track the speed of each column
    const speeds: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height);
      // Randomize colors slightly for a more dynamic effect
      const greenIntensity = 150 + Math.floor(Math.random() * 105); // 150-255
      colors[i] = `rgba(0, ${greenIntensity}, ${Math.floor(greenIntensity/3)}, 0.8)`;
      speeds[i] = 0.5 + Math.random() * 1.5; // Random speed between 0.5 and 2
    }

    // Drawing the characters
    const draw = () => {
      // Black semi-transparent background to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Loop through each column
      for (let i = 0; i < drops.length; i++) {
        // Set the color for this column
        ctx.fillStyle = colors[i];
        ctx.font = `${fontSize}px 'VT323', monospace`;

        // Choose a random character from the matrix characters
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        
        // Draw the character at position (i*fontSize, drops[i]*fontSize)
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Increment y position for next draw based on speed
        drops[i] += speeds[i];

        // Random chance to reset the drop position
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          // Occasionally change the color when resetting
          if (Math.random() > 0.8) {
            const greenIntensity = 150 + Math.floor(Math.random() * 105);
            colors[i] = `rgba(0, ${greenIntensity}, ${Math.floor(greenIntensity/3)}, 0.8)`;
          }
          // Occasionally change the speed when resetting
          if (Math.random() > 0.8) {
            speeds[i] = 0.5 + Math.random() * 1.5;
          }
        }
        
        // Highlight the first character in each column for a leading effect
        if (drops[i] > 0 && drops[i] < canvas.height / fontSize) {
          ctx.fillStyle = 'rgba(180, 255, 180, 1)';
          ctx.fillText(
            matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)),
            i * fontSize,
            Math.floor(drops[i]) * fontSize
          );
        }
      }
    };

    // Animation loop
    const interval = setInterval(draw, 33); // ~30fps

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
      style={{ opacity: 0.8 }}
    />
  );
};

export default MatrixRain;