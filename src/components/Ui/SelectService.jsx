import { useState, useRef, useEffect } from 'react';
import { ListOfServices } from '../../constants/ServiceList';


export default function SelectService({formData,handleChange}) {
  const [errors] = useState({});
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const scrollSpeedRef = useRef(0);
  const [itemPositions, setItemPositions] = useState([]);
  const snapTimeoutRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const snapToNearest = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const items = Array.from(container.querySelectorAll('[data-service-item]'));
    
    let closestItem = null;
    let minDistance = Infinity;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - itemCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      const rect = closestItem.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const scrollOffset = itemCenter - containerCenter;
      
      container.scrollBy({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      if (scrollSpeedRef.current !== 0) {
        container.scrollLeft += scrollSpeedRef.current;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updatePositions = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      const positions = Array.from(container.querySelectorAll('[data-service-item]')).map((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(containerCenter - itemCenter);
        const maxDistance = containerRect.width / 3;
        const opacity = Math.max(0.2, 1 - (distance / maxDistance) * 0.8);
        const scale = Math.max(0.7, 1 - (distance / maxDistance) * 0.3);
        
        return { opacity, scale };
      });

      setItemPositions(positions);
    };

    const container = containerRef.current;
    if (container) {
      updatePositions();
      container.addEventListener('scroll', updatePositions);
      
      return () => container.removeEventListener('scroll', updatePositions);
    }
  }, []);

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    // Handle dragging only
    if (isDraggingRef.current) {
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startXRef.current) * 2; // Multiply for faster scrolling
      container.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const handleMouseDown = (e) => {
    const container = containerRef.current;
    if (!container) return;
    
    isDraggingRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
    container.style.cursor = 'grabbing';
    scrollSpeedRef.current = 0;
  };

  const handleMouseUpOrLeave = () => {
    const container = containerRef.current;
    if (container) {
      container.style.cursor = 'grab';
    }
    
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
      snapTimeoutRef.current = setTimeout(snapToNearest, 150);
    }
  };

  const handleMouseLeave = () => {
    handleMouseUpOrLeave();
  };

  return (
    <div className="flex items-center justify-center p-2">
      <div className="w-full">
        <div className="relative">
          <div 
            ref={containerRef}
            className="overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseLeave}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex gap-6 min-w-max px-40">
              {ListOfServices.map((website, index) => {
                const Icon = website.icon;
                const isSelected = formData.websiteName === website.name;
                const position = itemPositions[index] || { opacity: 1, scale: 1 };
              
                return (
                  <button
                    type="button"
                    key={website.id}
                    data-service-item
                    onClick={() => {
                      handleChange({
                        target: {
                          name: 'websiteName',
                          value: website.name
                        }
                      });
                      
                      // Scroll the selected item to center
                      setTimeout(() => {
                        const container = containerRef.current;
                        if (!container) return;
                        
                        const selectedButton = container.querySelectorAll('[data-service-item]')[index];
                        if (selectedButton) {
                          const containerRect = container.getBoundingClientRect();
                          const buttonRect = selectedButton.getBoundingClientRect();
                          const containerCenter = containerRect.left + containerRect.width / 2;
                          const buttonCenter = buttonRect.left + buttonRect.width / 2;
                          const scrollOffset = buttonCenter - containerCenter;
                          
                          container.scrollBy({
                            left: scrollOffset,
                            behavior: 'smooth'
                          });
                        }
                      }, 10);
                    }}
                    className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl transition-all text-center min-w-[120px] ${
                      isSelected 
                        ? ' border-2 border-blue-500' 
                        : ' border-2 border-text'
                    } ${errors.websiteName ? 'border-red-500' : ''} shadow-lg hover:shadow-xl`}
                    style={{
                      opacity: position.opacity,
                      transform: `scale(${position.scale})`,
                      transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.2s, border-color 0.2s'
                    }}
                  >
                    <div className={`p-3 ${website.color} rounded-lg shadow-md`}>
                      <Icon className="w-6 h-6 text-text" />
                    </div>
                    <span className="text-text font-semibold whitespace-nowrap text-sm">{website.name}</span>
                    {isSelected && (
                      <div className="mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {formData.websiteName && (
          <div className="mt-2 p-2 rounded-xl shadow-md text-center">
            <p className="text-white">
              Selected: <span className="font-bold text-blue-600 text-lg">{formData.websiteName}</span>
            </p>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}