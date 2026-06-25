import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import './CustomCursor.css';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
      
      if (cursorRef.current) {
        anime({
          targets: cursorRef.current,
          left: e.clientX,
          top: e.clientY,
          duration: 500,
          easing: 'easeOutElastic(1, .8)'
        });
      }
    };

    const handleMouseDown = () => {
      anime({
        targets: cursorRef.current,
        scale: 0.5,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        duration: 150,
        easing: 'easeOutQuad'
      });
      anime({
        targets: cursorDotRef.current,
        scale: 1.5,
        duration: 150,
        easing: 'easeOutQuad'
      });
    };

    const handleMouseUp = () => {
      anime({
        targets: cursorRef.current,
        scale: 1,
        backgroundColor: 'rgba(59, 130, 246, 0)',
        duration: 150,
        easing: 'easeOutQuad'
      });
      anime({
        targets: cursorDotRef.current,
        scale: 1,
        duration: 150,
        easing: 'easeOutQuad'
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Add a hover effect for clickable items
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a')) {
         anime({
           targets: cursorRef.current,
           scale: 1.5,
           borderWidth: '1px',
           duration: 200,
           easing: 'easeOutQuad'
         })
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
       const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a')) {
         anime({
           targets: cursorRef.current,
           scale: 1,
           borderWidth: '2px',
           duration: 200,
           easing: 'easeOutQuad'
         })
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor hidden md:block" ref={cursorRef} />
      <div className="custom-cursor-dot hidden md:block" ref={cursorDotRef} />
    </>
  );
};

export default CustomCursor;
