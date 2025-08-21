import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  glitchInterval?: number;
}

const GlitchText = ({ 
  text, 
  className = '', 
  intensity = 'medium',
  glitchInterval = 2000
}: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState(text);
  
  // Characters to use for glitch effect
  const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
  
  // Determine how many characters to glitch based on intensity
  const getGlitchAmount = () => {
    switch (intensity) {
      case 'low': return Math.max(1, Math.floor(text.length * 0.1));
      case 'high': return Math.max(3, Math.floor(text.length * 0.3));
      case 'medium':
      default: return Math.max(2, Math.floor(text.length * 0.2));
    }
  };
  
  // Create a glitched version of the text
  const createGlitchText = () => {
    const textArray = text.split('');
    const glitchAmount = getGlitchAmount();
    
    // Get random positions to glitch
    const positions = new Set<number>();
    while (positions.size < glitchAmount) {
      positions.add(Math.floor(Math.random() * text.length));
    }
    
    // Replace characters at those positions with glitch characters
    positions.forEach(pos => {
      textArray[pos] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
    });
    
    return textArray.join('');
  };
  
  useEffect(() => {
    // Periodically trigger glitch effect
    const intervalId = setInterval(() => {
      if (!isGlitching) {
        setIsGlitching(true);
        
        // Create multiple glitch frames
        const glitchFrames = 3;
        let frameCount = 0;
        
        const glitchFrameInterval = setInterval(() => {
          setGlitchText(createGlitchText());
          frameCount++;
          
          if (frameCount >= glitchFrames) {
            clearInterval(glitchFrameInterval);
            setGlitchText(text);
            setIsGlitching(false);
          }
        }, 100);
      }
    }, glitchInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [text, glitchInterval, isGlitching]);
  
  return (
    <span 
      className={`glitch-effect relative inline-block ${className}`} 
      data-text={text}
    >
      <span className={`${isGlitching ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 -ml-1 text-red-500 transform translate-x-[1px] translate-y-[-1px] transition-opacity duration-100`}>
        {isGlitching ? glitchText : text}
      </span>
      <span className={`${isGlitching ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 -ml-1 text-blue-500 transform translate-x-[-1px] translate-y-[1px] transition-opacity duration-100`}>
        {isGlitching ? glitchText : text}
      </span>
      <span className="relative z-10">{isGlitching ? glitchText : text}</span>
    </span>
  );
};

export default GlitchText;