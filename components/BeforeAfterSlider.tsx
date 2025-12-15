import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  originalUrl: string;
  enhancedUrl: string;
  className?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ originalUrl, enhancedUrl, className }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const onMouseDown = () => (isDragging.current = true);
  const onMouseUp = () => (isDragging.current = false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  // Global mouse up to catch drag release outside component
  useEffect(() => {
    const handleGlobalMouseUp = () => (isDragging.current = false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none cursor-ew-resize group ${className}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onClick={(e) => handleMove(e.clientX)} // Allow click to jump
    >
      {/* Background (After/Enhanced Image) - Shown fully, covered by foreground */}
      <img 
        src={enhancedUrl} 
        alt="Enhanced" 
        className="absolute top-0 left-0 w-full h-full object-cover" 
        draggable={false}
      />
      
      {/* Foreground (Before/Original Image) - Clipped */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/90 shadow-[2px_0_10px_rgba(0,0,0,0.3)] bg-gray-900/5 backdrop-filter backdrop-grayscale-[0.8] backdrop-brightness-90"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={originalUrl} 
          alt="Original" 
          className="absolute top-0 left-0 max-w-none h-full object-cover"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }} // Keep image aspect ratio by forcing width to match container width
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 -translate-x-1/2 flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md border border-white/60 shadow-lg">
          <span className="material-symbols-outlined text-white text-[16px] drop-shadow-md">compare_arrows</span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-sm border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">Antes</span>
      </div>
      <div className="absolute top-4 right-4 pointer-events-none">
        <span className="px-2.5 py-1 rounded-md bg-primary/90 text-black text-[10px] font-bold uppercase tracking-wider shadow-sm">Depois</span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;