import React from 'react';
import { MapPin, Navigation, Focus, X, Milestone, Timer, Compass } from 'lucide-react';
import { Business } from '../types';

interface MiniMapProps {
  businesses: Business[];
  selectedBusinessId: string | null;
  onSelectBusiness: (businessId: string | null) => void;
  city: string;
  directionsBusinessId?: string | null;
  onClearDirections?: () => void;
}

export default function MiniMap({
  businesses,
  selectedBusinessId,
  onSelectBusiness,
  city,
  directionsBusinessId,
  onClearDirections,
}: MiniMapProps) {
  // Center or default focuses
  const activeBusiness = businesses.find((b) => b.id === selectedBusinessId);
  const routeBusiness = businesses.find((b) => b.id === directionsBusinessId);

  // User simulated GPS status coordinates
  const userLat = 33.3;
  const userLng = 25;

  // Real-time calculation if route is activated
  const routeStats = React.useMemo(() => {
    if (!routeBusiness) return null;
    const dy = routeBusiness.lng - userLng;
    const dx = routeBusiness.lat - userLat;
    const distanceUnits = Math.sqrt(dx * dx + dy * dy);
    
    // 1 percent unit equals ~150 meters
    const distanceKm = parseFloat((distanceUnits * 0.15).toFixed(1));
    const durationMinutes = Math.max(3, Math.round(distanceKm * 2.2 + 1));
    
    // Choose simulation route steps based on coordinate zones
    const steps = [
      'Depart current GPS spot towards Boulevard Gate.',
      distanceKm > 3 ? 'Merge left onto Outer Bypass toll corridor.' : 'Proceed straight along Link Avenue.',
      `Turn final right near the ${routeBusiness.area} signpost.`,
      `Arrive safely at ${routeBusiness.name} entrance.`
    ];

    return {
      distance: distanceKm,
      duration: durationMinutes,
      steps
    };
  }, [routeBusiness]);

  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full min-h-[460px] lg:sticky lg:top-20" id="mock-map-canvas-root">
      
      {/* Map head */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-extrabold text-slate-700 tracking-tight flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-blue-600 animate-spin-slow" />
            <span>Radar Navigation Map</span>
          </span>
        </div>
        <span className="text-[9px] font-bold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {city} Area Mesh
        </span>
      </div>

      {/* Simulated Contoured City Space Grid Map */}
      <div className="flex-1 relative bg-slate-100/90 overflow-hidden min-h-[260px] select-none group">
        
        {/* SVG background grid lines to simulate roads/streets */}
        <svg className="absolute inset-0 h-full w-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />
            </pattern>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Simulated curving highway routes */}
          <path d="M -50 80 Q 200 150 400 30" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-250 stroke-[4]" />
          <path d="M 120 -20 Q 80 180 320 420" fill="none" stroke="currentColor" strokeWidth="5" className="text-slate-250 stroke-[5]" fillOpacity="0" />
          <path d="M 0 300 C 150 250 250 350 450 310" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-250 stroke-[4]" />

          {/* Draw active GPS route line if a path is selected */}
          {routeBusiness && (
            <>
              {/* Highlight background path glow */}
              <line
                x1={`${userLat}%`}
                y1={`${userLng}%`}
                x2={`${routeBusiness.lat}%`}
                y2={`${routeBusiness.lng}%`}
                stroke="#3b82f6"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.2"
                className="animate-pulse"
              />
              {/* Core interactive dynamic green path */}
              <line
                x1={`${userLat}%`}
                y1={`${userLng}%`}
                x2={`${routeBusiness.lat}%`}
                y2={`${routeBusiness.lng}%`}
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 4"
                className="animate-[dash_15s_linear_infinite]"
              />
            </>
          )}
        </svg>

        {/* Outer label indicators of streets */}
        <span className="absolute top-4 left-6 text-[8px] font-semibold tracking-wider text-slate-400 uppercase rotate-6">
          Grand Trunk Road
        </span>
        <span className="absolute bottom-8 right-12 text-[8px] font-semibold tracking-wider text-slate-400 uppercase -rotate-12">
          Outer Ring Bypass
        </span>
        <span className="absolute top-1/2 right-6 text-[8px] font-semibold tracking-wider text-slate-400 uppercase rotate-90">
          Link Avenue
        </span>

        {/* Central visual indicator of focused business */}
        {activeBusiness && (
          <div className="absolute inset-0 bg-blue-500/[0.03] pointer-events-none transition-all duration-300 animate-pulse" />
        )}

        {/* Pins mapping */}
        {businesses.map((business) => {
          const isSelected = selectedBusinessId === business.id;
          const isRouteTarget = directionsBusinessId === business.id;
          
          // Use lat/lng directly as percentage placements to draw responsive coordinates safely
          const leftPercent = `${business.lat}%`;
          const topPercent = `${business.lng}%`;

          return (
            <div
              key={business.id}
              style={{ left: leftPercent, top: topPercent }}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10"
            >
              {/* Tooltip trigger wrapper */}
              <div className="relative group/pin">
                <button
                  type="button"
                  onClick={() => onSelectBusiness(isSelected ? null : business.id)}
                  className={`relative flex items-center justify-center rounded-full transition-all duration-300 shadow-md cursor-pointer ${
                    isSelected
                      ? 'h-9 w-9 bg-blue-600 ring-4 ring-blue-100 z-30 scale-110'
                      : isRouteTarget
                      ? 'h-9 w-9 bg-emerald-500 ring-4 ring-emerald-100 z-30 scale-110 animate-bounce'
                      : 'h-7 w-7 bg-white hover:bg-slate-50 border border-slate-200 hover:scale-105 z-20 hover:shadow-lg'
                  }`}
                >
                  <MapPin
                    className={`h-4.5 w-4.5 ${
                      isSelected || isRouteTarget ? 'text-white' : business.verificationStatus === 'premium' ? 'text-amber-500' : 'text-blue-500'
                    }`}
                  />
                  
                  {/* Rating Badge indicator directly inside map pin */}
                  <span className={`absolute -top-1.5 -right-1.5 text-[7px] font-extrabold px-1 rounded-full text-white ${
                    isSelected ? 'bg-blue-700' : isRouteTarget ? 'bg-emerald-600' : business.verificationStatus === 'premium' ? 'bg-amber-500' : 'bg-slate-700'
                  }`}>
                    {business.rating}
                  </span>
                </button>

                {/* Micro tooltip details hovering */}
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900 rounded-lg text-white pointer-events-none transition-all duration-200 shadow-xl border border-slate-800 flex flex-col gap-0.5 whitespace-nowrap min-w-[120px] ${
                  isSelected || isRouteTarget
                    ? 'opacity-100 scale-100 translate-y-0 visible z-50' 
                    : 'opacity-0 scale-95 translate-y-1 invisible group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:translate-y-0 group-hover/pin:visible group-hover/pin:z-40'
                }`}>
                  <span className="text-[10px] font-bold truncate max-w-[140px] block">{business.name}</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[8px] text-slate-300">{business.area}</span>
                    <span className="text-[8px] bg-white/10 px-1 py-0.5 rounded text-amber-400 font-extrabold">★ {business.rating}</span>
                  </div>
                  {/* Little point indicator */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-slate-900 rotate-45 -mt-0.5" />
                </div>
              </div>
            </div>
          );
        })}

        {/* GPS location simulator cursor */}
        <div 
          style={{ left: `${userLat}%`, top: `${userLng}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center animate-pulse z-20 pointer-events-none"
        >
          <Navigation className="h-3.5 w-3.5 text-blue-600 rotate-45 stroke-[2.5]" />
          <span className="absolute -bottom-4 text-[8px] font-extrabold text-blue-600 tracking-wider bg-white px-1.5 py-0.2 rounded-full border border-blue-100 shadow-sm select-none uppercase">You</span>
        </div>
      </div>

      {/* Map Footer showing detailed address context for selected items */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
        {routeBusiness && routeStats ? (
          <div className="bg-white rounded-xl border border-emerald-100 p-3 space-y-2.5 shadow-sm animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                🛣️ Real-Time Route Active
              </span>
              <button
                onClick={onClearDirections}
                className="text-slate-400 hover:text-slate-600 p-1"
                title="Clear Active GPS Path"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-around gap-2 bg-emerald-50/50 p-2 rounded-xl">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Est. Distance</span>
                <span className="text-xs font-black text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                  <Milestone className="h-3 w-3 text-emerald-600" /> {routeStats.distance} KM
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Duration</span>
                <span className="text-xs font-black text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                  <Timer className="h-3 w-3 text-emerald-600" /> {routeStats.duration} Mins
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Turn-by-turn Navigation</span>
              <ol className="list-decimal list-inside text-[10px] text-slate-600 space-y-1 font-medium leading-relaxed pl-1">
                {routeStats.steps.map((step, sIdx) => (
                  <li key={sIdx} className={`${sIdx === 0 ? 'text-emerald-600 font-bold' : ''}`}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : activeBusiness ? (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Selected Business Coordinates</span>
            <div className="flex items-start gap-1.5">
              <Focus className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-700">
                <span className="font-bold">{activeBusiness.name}</span>
                <p className="text-slate-500 mt-0.5 leading-snug">{activeBusiness.address}</p>
                <span className="inline-block mt-1 bg-slate-100 text-[8px] font-extrabold text-slate-600 px-1.5 py-0.5 rounded">
                  Grid Ref: {activeBusiness.lat}°N, {activeBusiness.lng}°E
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 text-center py-2.5 italic font-medium leading-relaxed">
            Toggle map pins or click <span className="font-bold text-emerald-600">&ldquo;Directions&rdquo;</span> to display operational distance grids and route paths.
          </div>
        )}
      </div>
    </div>
  );
}

