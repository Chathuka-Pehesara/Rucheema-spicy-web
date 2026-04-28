import React, { useState, useEffect } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const mouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    const mouseOver = (e) => {
      const target = e.target;
      
      // Check for links, buttons, or elements with specific cursor data
      const isInteractive = target.closest('a, button, input, textarea, label, .clickable');
      const specialAttr = target.closest('[data-cursor]');
      
      if (isInteractive) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }

      if (specialAttr) {
        setIsSpecial(true);
        setCursorText(specialAttr.getAttribute('data-cursor') || '');
      } else {
        setIsSpecial(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('mouseover', mouseOver);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('mouseover', mouseOver);
    };
  }, []);

  return (
    <>
      <div 
        className={`custom-cursor-dot ${isHovered ? 'hovered' : ''} ${isSpecial ? 'special' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div 
        className={`custom-cursor-ring ${isHovered ? 'hovered' : ''} ${isSpecial ? 'special' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        {isSpecial && cursorText && <span className="cursor-text">{cursorText}</span>}
      </div>
    </>
  );
};

export default CustomCursor;
