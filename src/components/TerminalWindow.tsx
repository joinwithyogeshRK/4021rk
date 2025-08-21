import { useState, useEffect, useRef } from 'react';
import GlitchText from './GlitchText';
import TypingEffect from './TypingEffect';

const TerminalWindow = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([`Initializing Matrix connection...`, `Connection established.`, `Type "help" for available commands.`]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [terminalTheme, setTerminalTheme] = useState<'matrix' | 'cyber' | 'hacker'>('matrix');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();
    
    // Scroll to bottom when history changes
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [history]);

  // Cursor blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorBlink(prev => !prev);
    }, 500);
    
    return () => clearInterval(blinkInterval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      processCommand(input.trim());
      setInput('');
    }
  };

  const processCommand = (command: string) => {
    // Add command to history
    setHistory(prev => [...prev, `${getPromptText()} ${command}`]);
    setIsProcessing(true);
    
    // Simulate processing delay for effect
    setTimeout(() => {
      // Process command
      switch (command.toLowerCase()) {
        case 'help':
          setHistory(prev => [...prev, 
            `Available commands:`, 
            `- help: Display this help message`, 
            `- clear: Clear the terminal`, 
            `- status: Check system status`, 
            `- matrix: Display Matrix information`, 
            `- theme [matrix|cyber|hacker]: Change terminal theme`,
            `- scan: Scan for nearby systems`,
            `- decrypt: Attempt to decrypt current session`,
            `- exit: Exit the terminal`
          ]);
          break;
        case 'clear':
          setHistory([]);
          break;
        case 'status':
          setHistory(prev => [...prev, 
            `System Status: Online`, 
            `Connection: Secure`, 
            `Signal Strength: Optimal`, 
            `Trace Program: Not Detected`,
            `Encryption: AES-256`,
            `Proxy Chains: 7 active nodes`,
            `VPN Tunnel: Established`
          ]);
          break;
        case 'matrix':
          setHistory(prev => [...prev, 
            `The Matrix is a system, Neo. That system is our enemy.`, 
            `When you're inside, you look around, what do you see?`, 
            `Businessmen, teachers, lawyers, carpenters.`, 
            `The very minds of the people we are trying to save.`
          ]);
          break;
        case 'theme matrix':
          setTerminalTheme('matrix');
          setHistory(prev => [...prev, `Terminal theme changed to: matrix`]);
          break;
        case 'theme cyber':
          setTerminalTheme('cyber');
          setHistory(prev => [...prev, `Terminal theme changed to: cyber`]);
          break;
        case 'theme hacker':
          setTerminalTheme('hacker');
          setHistory(prev => [...prev, `Terminal theme changed to: hacker`]);
          break;
        case 'scan':
          setHistory(prev => [...prev, 
            `Scanning network...`,
            `Found 3 systems:`,
            `- Mainframe (192.168.1.1) - Secured`,
            `- Sentinel (192.168.1.2) - Vulnerable`,
            `- Oracle (192.168.1.3) - Unknown`
          ]);
          break;
        case 'decrypt':
          setHistory(prev => [...prev, 
            `Attempting decryption...`,
            `Progress: ██████████ 100%`,
            `Decryption successful`,
            `Access granted to level 2 systems`
          ]);
          break;
        case 'exit':
          setHistory(prev => [...prev, `Exiting terminal...`, `Connection closed.`]);
          break;
        default:
          if (command.toLowerCase().startsWith('theme')) {
            setHistory(prev => [...prev, `Invalid theme. Available themes: matrix, cyber, hacker`]);
          } else {
            setHistory(prev => [...prev, `Command not recognized: ${command}`]);
          }
      }
      setIsProcessing(false);
    }, 500);
  };

  const getPromptText = () => {
    switch (terminalTheme) {
      case 'matrix':
        return 'matrix@terminal:~$';
      case 'cyber':
        return 'cyber@net:/#';
      case 'hacker':
        return 'root@system:~#';
      default:
        return 'matrix@terminal:~$';
    }
  };

  const getThemeClasses = () => {
    switch (terminalTheme) {
      case 'matrix':
        return {
          window: 'bg-black/90 border-green-500',
          header: 'bg-green-900/50',
          text: 'text-green-400',
          input: 'bg-transparent text-green-400 border-green-500 focus:border-green-300'
        };
      case 'cyber':
        return {
          window: 'bg-blue-950/90 border-cyan-500',
          header: 'bg-blue-900/50',
          text: 'text-cyan-400',
          input: 'bg-transparent text-cyan-400 border-cyan-500 focus:border-cyan-300'
        };
      case 'hacker':
        return {
          window: 'bg-zinc-900/90 border-red-500',
          header: 'bg-zinc-800/50',
          text: 'text-red-400',
          input: 'bg-transparent text-red-400 border-red-500 focus:border-red-300'
        };
      default:
        return {
          window: 'bg-black/90 border-green-500',
          header: 'bg-green-900/50',
          text: 'text-green-400',
          input: 'bg-transparent text-green-400 border-green-500 focus:border-green-300'
        };
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const themeClasses = getThemeClasses();

  return (
    <div 
      className={`terminal-window rounded-md border-2 shadow-lg backdrop-blur-sm ${themeClasses.window} transition-all duration-300`} 
      onClick={handleTerminalClick}
    >
      <div className={`terminal-header flex justify-between items-center p-2 ${themeClasses.header} rounded-t-sm`}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className={`text-xs font-mono ${themeClasses.text}`}>
          {terminalTheme === 'matrix' ? 'MATRIX TERMINAL v3.14' : 
           terminalTheme === 'cyber' ? 'CYBERDECK INTERFACE v2.0' : 
           'SHADOW CONSOLE v1.1'}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${themeClasses.text}`}>
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      <div 
        className={`terminal-content h-64 overflow-y-auto p-4 font-mono ${themeClasses.text} text-sm`} 
        ref={terminalContentRef}
        style={{
          backgroundImage: terminalTheme === 'matrix' ? 'radial-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px)' : 
                           terminalTheme === 'cyber' ? 'radial-gradient(rgba(0, 200, 255, 0.1) 1px, transparent 1px)' :
                           'radial-gradient(rgba(255, 0, 0, 0.05) 1px, transparent 1px)',
          backgroundSize: '10px 10px'
        }}
      >
        {history.map((line, index) => (
          <p key={index} className={`mb-1 ${index === history.length - 1 ? 'animate-fadeIn' : ''}`}>
            {line}
          </p>
        ))}
        
        {isProcessing && (
          <div className="flex items-center gap-2 animate-pulse">
            <span>Processing</span>
            <span className="inline-block w-1 h-1 bg-current rounded-full"></span>
            <span className="inline-block w-1 h-1 bg-current rounded-full"></span>
            <span className="inline-block w-1 h-1 bg-current rounded-full"></span>
          </div>
        )}
        
        {!isProcessing && (
          <div className="flex items-center mt-1">
            <span className="mr-2">{getPromptText()}</span>
            <input
              type="text"
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={`terminal-input flex-1 outline-none ${themeClasses.input} border-b border-opacity-50 focus:border-opacity-100 transition-colors`}
              placeholder="Enter command..."
              spellCheck="false"
              autoComplete="off"
            />
            <span className={`ml-1 w-2 h-4 inline-block ${cursorBlink ? 'opacity-100' : 'opacity-0'} ${themeClasses.text} transition-opacity`}>
              █
            </span>
          </div>
        )}
      </div>
      
      <div className={`terminal-footer p-2 text-xs ${themeClasses.header} border-t border-opacity-50 ${themeClasses.text} flex justify-between`}>
        <span>Connection: Secure</span>
        <span>Encryption: Active</span>
        <span>Signal: Strong</span>
      </div>
    </div>
  );
};

export default TerminalWindow;