import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Experience', path: '/experience' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-primary/30' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">M</span>
            </div>
            <span className="text-xl font-bold tracking-wider">MATRIX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`matrix-nav-item ${isActive(link.path) ? 'text-secondary' : 'text-primary'}`}
              >
                {link.name}
              </Link>
            ))}
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary shadow-neon-glow"
              onClick={() => window.open('https://github.com', '_blank')}
            >
              Enter The Matrix
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface border-l border-primary w-[300px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-primary">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">M</span>
                      </div>
                      <span className="text-xl font-bold tracking-wider">MATRIX</span>
                    </Link>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5 text-primary" />
                      </Button>
                    </SheetTrigger>
                  </div>
                </div>
                <nav className="flex-1 p-4">
                  <ul className="space-y-4">
                    {navLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={`block py-2 px-4 rounded-md transition-colors ${isActive(link.path) ? 'bg-primary/10 text-secondary' : 'text-primary hover:bg-primary/5'}`}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary shadow-neon-glow"
                      onClick={() => window.open('https://github.com', '_blank')}
                    >
                      Enter The Matrix
                    </Button>
                  </div>
                </nav>
                <div className="p-4 border-t border-primary text-xs text-primary-foreground/70">
                  <p>© 2023 Matrix Digital Experience</p>
                  <p>All rights reserved</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
