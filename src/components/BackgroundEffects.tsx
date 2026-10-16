import React, { useEffect, useState } from 'react';

export const BackgroundEffects: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Dark Base */}
      <div className="absolute inset-0 bg-[#050816]" />

      {/* Cybernetic Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #00f5ff 1px, transparent 1px),
                            linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Neon Aurora Glow 1 - Electric Cyan */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] rounded-full filter blur-[140px] opacity-25 animate-aurora pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,255,0.4) 0%, rgba(5,8,22,0) 70%)',
        }}
      />

      {/* Neon Aurora Glow 2 - Deep Purple / Magenta */}
      <div 
        className="absolute top-[35%] -right-[15%] w-[60vw] h-[60vw] rounded-full filter blur-[150px] opacity-20 animate-aurora pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(5,8,22,0) 70%)',
          animationDelay: '-5s',
        }}
      />

      {/* Neon Aurora Glow 3 - Emerald Accent */}
      <div 
        className="absolute -bottom-[20%] left-[25%] w-[50vw] h-[50vw] rounded-full filter blur-[130px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(5,8,22,0) 70%)',
        }}
      />

      {/* Dynamic Mouse Tracker Light */}
      <div 
        className="absolute w-[35vw] h-[35vw] rounded-full filter blur-[100px] opacity-10 transition-all duration-700 ease-out pointer-events-none"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #00f5ff 0%, transparent 65%)',
        }}
      />
    </div>
  );
};
