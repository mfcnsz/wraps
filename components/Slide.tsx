
import React, { useEffect, useState } from 'react';
import { WrappedInsight } from '../types';

interface SlideProps {
  insight: WrappedInsight;
  isActive: boolean;
}

const Slide: React.FC<SlideProps> = ({ insight, isActive }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isActive) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isActive]);

  return (
    <div 
      className="wrapped-slide flex-shrink-0 transition-all duration-1000"
      style={{ 
        backgroundColor: insight.bgColor, 
        color: insight.textColor,
        background: `radial-gradient(circle at 50% 50%, ${insight.bgColor} 0%, ${insight.bgColor}EE 100%)`
      }}
    >
      <div className={`max-w-4xl mx-auto px-10 transition-all duration-1000 transform ${animate ? 'translate-y-0 scale-100 opacity-100 rotate-0' : 'translate-y-60 scale-90 opacity-0 rotate-6'}`}>
        
        {/* Massive Emoji */}
        <div className="text-[10rem] md:text-[16rem] leading-none mb-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] filter saturate-150 animate-bounce transition-all duration-700">
          {insight.emoji}
        </div>
        
        {/* Bold Title */}
        <h2 
          className="text-[4rem] md:text-[8rem] font-black uppercase leading-[0.8] mb-10 tracking-tighter italic"
          style={{ 
            color: insight.accentColor,
            textShadow: `15px 15px 0px ${insight.textColor}15`
          }}
        >
          {insight.title}
        </h2>
        
        {/* Content */}
        <p className="text-3xl md:text-5xl font-black leading-[1.1] opacity-95 tracking-tight uppercase max-w-3xl mx-auto">
          {insight.content}
        </p>
      </div>

      {/* Extreme Background Shapes */}
      <div 
        className={`absolute -top-60 -left-60 w-[50rem] h-[50rem] rounded-full opacity-40 blur-[140px] transition-all duration-[3000ms] ease-out ${animate ? 'scale-125 translate-x-10 rotate-45' : 'scale-50 translate-x-0'}`}
        style={{ backgroundColor: insight.accentColor }}
      ></div>
      <div 
        className={`absolute -bottom-60 -right-60 w-[60rem] h-[60rem] rounded-full opacity-30 blur-[180px] transition-all duration-[4000ms] ease-out ${animate ? 'scale-110 -translate-x-20' : 'scale-75'}`}
        style={{ backgroundColor: insight.accentColor }}
      ></div>
      
      {/* Dynamic Grid / Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none overflow-hidden flex flex-wrap gap-10 p-10 rotate-12 scale-150">
          {Array.from({length: 40}).map((_, i) => (
            <span key={i} className="text-9xl font-black">R10</span>
          ))}
      </div>

      {/* Year Stamp */}
      <div className="absolute bottom-8 right-8 font-black text-4xl md:text-6xl opacity-10 uppercase italic tracking-tighter">
        2025 WRAPPED
      </div>
    </div>
  );
};

export default Slide;
