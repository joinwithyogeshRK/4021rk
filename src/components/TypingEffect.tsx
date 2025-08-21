import { useState, useEffect, useRef } from 'react';

interface TypingEffectProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  startDelay?: number;
  cursorStyle?: 'block' | 'underscore' | 'pipe';
  errorProbability?: number;
  loop?: boolean;
  pauseBeforeRestart?: number;
}

const TypingEffect = ({
  text,
  className = '',
  typingSpeed = 50,
  startDelay = 500,
  cursorStyle = 'block',
  errorProbability = 0.05,
  loop = false,
  pauseBeforeRestart = 2000
}: TypingEffectProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cursor character based on style
  const getCursorChar = () => {
    switch (cursorStyle) {
      case 'block': return '█';
      case 'underscore': return '_';
      case 'pipe': return '|';
      default: return '█';
    }
  };

  // Simulate typing errors
  const simulateTypingError = (currentText: string, nextChar: string): string => {
    if (Math.random() < errorProbability) {
      // Get a random character that's close to the intended one on keyboard
      const keyboard = {
        'a': ['s', 'q', 'z'],
        'b': ['v', 'g', 'n'],
        'c': ['x', 'v', 'd'],
        'd': ['s', 'f', 'e'],
        'e': ['w', 'r', 'd'],
        'f': ['d', 'g', 'r'],
        'g': ['f', 'h', 't'],
        'h': ['g', 'j', 'y'],
        'i': ['u', 'o', 'k'],
        'j': ['h', 'k', 'u'],
        'k': ['j', 'l', 'i'],
        'l': ['k', ';', 'o'],
        'm': ['n', ',', 'j'],
        'n': ['b', 'm', 'h'],
        'o': ['i', 'p', 'l'],
        'p': ['o', '[', ';'],
        'q': ['w', 'a', '1'],
        'r': ['e', 't', 'f'],
        's': ['a', 'd', 'w'],
        't': ['r', 'y', 'g'],
        'u': ['y', 'i', 'j'],
        'v': ['c', 'b', 'f'],
        'w': ['q', 'e', 's'],
        'x': ['z', 'c', 's'],
        'y': ['t', 'u', 'h'],
        'z': ['a', 'x', 's'],
      };
      
      const lowerNextChar = nextChar.toLowerCase();
      if (lowerNextChar in keyboard) {
        const possibleErrors = (keyboard as any)[lowerNextChar];
        const errorChar = possibleErrors[Math.floor(Math.random() * possibleErrors.length)];
        
        // Add the error, then schedule a backspace and correction
        const textWithError = currentText + errorChar;
        
        // Schedule backspace after a short delay
        setTimeout(() => {
          setDisplayText(textWithError.slice(0, -1));
          
          // Schedule the correct character after another short delay
          setTimeout(() => {
            setDisplayText(textWithError.slice(0, -1) + nextChar);
            setCurrentIndex(prev => prev + 1);
          }, typingSpeed * 1.5);
        }, typingSpeed * 2);
        
        return textWithError;
      }
    }
    
    // No error, just return the text with the next character
    return currentText + nextChar;
  };

  // Cursor blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorBlink(prev => !prev);
    }, 500);
    
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Initial delay before typing starts
    timeoutRef.current = setTimeout(() => {
      setIsTyping(true);
    }, startDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [startDelay]);

  useEffect(() => {
    if (!isTyping) return;
    
    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setCurrentIndex(0);
        
        // Pause before restarting
        timeoutRef.current = setTimeout(() => {
          setIsTyping(true);
        }, pauseBeforeRestart);
        
        return;
      }
      
      // Delete one character
      timeoutRef.current = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
      }, typingSpeed / 2); // Deleting is faster than typing
    } else if (currentIndex < text.length) {
      // Type the next character, possibly with an error
      timeoutRef.current = setTimeout(() => {
        const nextChar = text[currentIndex];
        const newText = simulateTypingError(displayText, nextChar);
        
        // Only increment index if we're not simulating an error
        if (newText === displayText + nextChar) {
          setDisplayText(newText);
          setCurrentIndex(prev => prev + 1);
        } else {
          setDisplayText(newText);
          // The index will be incremented after the error correction
        }
      }, typingSpeed + Math.random() * 50); // Add some randomness to typing speed
    } else if (loop) {
      // Finished typing, pause before deleting
      timeoutRef.current = setTimeout(() => {
        setIsDeleting(true);
      }, pauseBeforeRestart);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, text, typingSpeed, isTyping, isDeleting, displayText, loop, pauseBeforeRestart]);

  return (
    <div className={`${className} inline-block`}>
      <span>{displayText}</span>
      {(currentIndex < text.length || isDeleting) && (
        <span className={`cursor-effect ${cursorBlink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
          {getCursorChar()}
        </span>
      )}
    </div>
  );
};

export default TypingEffect;