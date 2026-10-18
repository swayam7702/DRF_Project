import { useState, useCallback, useRef, useEffect } from 'react';

const Dashboard = () => {
  const [widgets, setWidgets] = useState([
    { id: 1, x: 0, y: 0, w: 4, h: 3, title: 'Analytics Chart', content: '📊 Interactive chart showing real-time data' },
    { id: 2, x: 4, y: 0, w: 4, h: 2, title: 'User Stats', content: '👥 1,234 active users • 89% retention' },
    { id: 3, x: 0, y: 2, w: 6, h: 2, title: 'Revenue', content: '💰 $45,678 this month • +12% MoM' },
    { id: 4, x: 0, y: 4, w: 3, h: 2, title: 'Quick Metrics', content: '⚡ CPU: 45% • Memory: 2.3GB' },
    { id: 5, x: 3, y: 4, w: 3, h: 2, title: 'Tasks', content: '✅ 23/30 completed • 1 due today' },
    { id: 6, x: 6, y: 4, w: 3, h: 2, title: 'Alerts', content: '🔔 3 new notifications' }
  ]);
  
  const [draggingWidget, setDraggingWidget] = useState(null);
  const [isResizing, setIsResizing] = useState(null);
  const gridRef = useRef(null);

  // Responsive grid configuration
  const getGridConfig = () => {
    const width = window.innerWidth;
    if (width < 640) return { cols: 6, cellSize: 80, maxX: 5, maxY: 20 };
    if (width < 1024) return { cols: 8, cellSize: 100, maxX: 7, maxY: 15 };
    if (width < 1440) return { cols: 10, cellSize: 110, maxX: 9, maxY: 12 };
    return { cols: 12, cellSize: 120, maxX: 11, maxY: 10 };
  };

  // Drag handlers with responsive grid
  const handleDragStart = (e, widget) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(widget));
    setDraggingWidget(widget);
  };

  const handleDragEnd = (e) => {
    setDraggingWidget(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const widgetData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = gridRef.current.getBoundingClientRect();
      const config = getGridConfig();
      const x = Math.max(0, Math.min(config.maxX, Math.floor((e.clientX - rect.left) / config.cellSize)));
      const y = Math.max(0, Math.min(config.maxY, Math.floor((e.clientY - rect.top) / config.cellSize)));

      const newPosition = findFreePosition(widgets, widgetData.id, x, y, config);
      
      const newWidgets = widgets.map(w => 
        w.id === widgetData.id 
          ? { ...w, x: newPosition.x, y: newPosition.y }
          : w
      );
      
      setWidgets(newWidgets);
    } catch (error) {
      console.log('Drop failed:', error);
    }
  };

  // Responsive collision detection
  const findFreePosition = (widgets, widgetId, targetX, targetY, config) => {
    let x = targetX;
    let y = targetY;
    const maxAttempts = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const collides = widgets.some(w => 
        w.id !== widgetId &&
        x < w.x + w.w && x + Math.min(4, config.cols - x) > w.x &&
        y < w.y + w.h && y + 3 > w.y
      );
      
      if (!collides) {
        return { 
          x: Math.max(0, Math.min(config.maxX - 3, x)), 
          y: Math.max(0, y) 
        };
      }
      
      x++;
      if (x > config.maxX - 3) {
        x = 0;
        y++;
      }
    }
    return { x: 0, y: 0 };
  };

  // Touch-friendly resize for mobile
  const handleResizeStart = (e, widgetId, direction) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing({ id: widgetId, direction, startX: e.clientX || e.touches[0].clientX, startY: e.clientY || e.touches[0].clientY });
    
    const handleMove = (moveEvent) => {
      const clientX = moveEvent.clientX || moveEvent.touches[0].clientX;
      const clientY = moveEvent.clientY || moveEvent.touches[0].clientY;
      const config = getGridConfig();
      
      setWidgets(prev => prev.map(widget => {
        if (widget.id === widgetId) {
          let newW = widget.w;
          let newH = widget.h;
          
          if (direction === 'se' || direction === 'sw') {
            newW = Math.max(2, Math.min(Math.floor((config.cols - widget.x) / 1.5), widget.w + Math.floor((clientX - (e.clientX || e.touches[0].clientX)) / config.cellSize)));
          }
          if (direction === 'se' || direction === 'ne') {
            newH = Math.max(2, Math.min(6, widget.h + Math.floor((clientY - (e.clientY || e.touches[0].clientY)) / config.cellSize)));
          }
          
          return { ...widget, w: newW, h: newH };
        }
        return widget;
      }));
    };

    const handleEnd = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
  };

  const handleClose = (widgetId) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  // Responsive Widget Component
  const Widget = ({ widget }) => {
    const widgetRef = useRef(null);
    const config = getGridConfig();

    return (
      <div
        ref={widgetRef}
        draggable
        onDragStart={(e) => handleDragStart(e, widget)}
        onDragEnd={handleDragEnd}
        className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200/70 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group backdrop-blur-sm"
        style={{
          gridColumn: `span ${Math.min(widget.w, config.cols - widget.x)}`,
          gridRow: `span ${widget.h}`,
          minHeight: `${Math.max(120, config.cellSize * 1.2)}px`
        }}
      >
        {/* Mobile-friendly resize handles */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {/* SE Resize - Primary handle */}
          <div 
            className="absolute bottom-2 right-2 w-6 h-6 md:w-5 md:h-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg cursor-se-resize pointer-events-auto hover:scale-125 active:scale-110 transition-all group-hover:opacity-100 opacity-60 flex items-center justify-center ring-2 ring-white/50"
            onMouseDown={(e) => handleResizeStart(e, widget.id, 'se')}
            onTouchStart={(e) => handleResizeStart(e, widget.id, 'se')}
          >
            <div className="w-2 h-2 bg-white rounded-sm shadow"></div>
          </div>
          
          {/* Drag indicator */}
          <div className="absolute top-3 left-3 w-8 h-8 md:w-7 md:h-7 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing z-40">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 4a1 1 0 000 2v6a1 1 0 001 1h2a1 1 0 001-1V6a1 1 0 000-2H7zM5 9a1 1 0 000 2h8a1 1 0 100-2H5z" />
            </svg>
          </div>
        </div>

        {/* Header - Responsive */}
        <div className="p-4 sm:p-5 md:p-6 pb-3 bg-white/90 backdrop-blur-sm border-b border-gray-100/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-800 leading-tight truncate">{widget.title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{widget.content}</p>
          </div>
          <button
            onClick={() => handleClose(widget.id)}
            className="p-2 sm:p-1.5 md:p-2 rounded-xl bg-red-100/80 text-red-600 hover:bg-red-200 hover:scale-105 active:scale-95 transition-all duration-200 self-start sm:self-auto opacity-0 group-hover:opacity-100 flex-shrink-0 hover:shadow-md"
            title="Close widget"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content - Responsive */}
        <div className="p-4 sm:p-6 pt-3 flex-1 relative min-h-[80px]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 to-purple-50/70 rounded-b-2xl"></div>
          <div className="relative z-10 h-full flex flex-col sm:flex-row items-center justify-center gap-3 p-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-xl sm:text-2xl">📈</span>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-base font-medium text-gray-700">Ready for content</p>
              <p className="text-xs text-gray-500 hidden sm:block">Drag to move, resize corners</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12 pb-6 sm:pb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-800 via-gray-700 to-slate-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-md sm:max-w-2xl mx-auto leading-relaxed">
            Drag widgets anywhere, resize corners, close with ✕. Fully responsive across all devices.
          </p>
        </div>

        {/* Responsive Grid Container */}
        <div className="relative">
          <div
            ref={gridRef}
            className="grid gap-3 sm:gap-4 lg:gap-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-3 sm:p-4 lg:p-8 border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-3xl"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`,
              gridTemplateRows: `repeat(8, minmax(100px, 1fr))`,
              height: 'clamp(400px, 75vh, 800px)'
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.08)';
              e.currentTarget.style.transform = 'scale(1.01)';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {/* Responsive grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5 lg:opacity-10">
              <div className="grid absolute inset-0" style={{
                gridTemplateColumns: `repeat(${getGridConfig().cols}, 1fr)`,
                gridTemplateRows: `repeat(8, 1fr)`
              }}>
                {Array.from({ length: getGridConfig().cols * 8 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-dashed border-gray-300/50 last:border-r-0 [&:nth-child(12n)]:border-r-0" />
                ))}
              </div>
            </div>

            {widgets.map(widget => (
              <Widget key={widget.id} widget={widget} />
            ))}

            {/* Drop zone - Mobile friendly */}
            {draggingWidget && (
              <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-400 rounded-2xl flex flex-col items-center justify-center pointer-events-none z-50 backdrop-blur-sm">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <p className="text-blue-700 font-semibold text-sm sm:text-base text-center px-2">Drop to place</p>
              </div>
            )}
          </div>
        </div>

        {/* Responsive Add button */}
        <div className="flex justify-center mt-6 sm:mt-8 lg:mt-12">
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300 text-sm sm:text-base lg:text-lg transform hover:-translate-y-0.5 min-w-[200px]">
            + Add New Widget
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;