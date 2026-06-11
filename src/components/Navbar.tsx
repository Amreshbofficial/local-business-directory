import React, { useState } from 'react';
import { MapPin, Plus, User, PhoneCall, Search, Menu, X, Star } from 'lucide-react';
import { CITIES } from '../data';

interface NavbarProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onAddBusinessClick: () => void;
  onMyEnquiriesClick: () => void;
  user: { name: string; phone: string } | null;
  onLogout: () => void;
  onSignInClick: () => void;
}

export default function Navbar({
  selectedCity,
  onCityChange,
  onSearchChange,
  searchQuery,
  onAddBusinessClick,
  onMyEnquiriesClick,
  user,
  onLogout,
  onSignInClick,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm" id="jd-main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => { onSearchChange(''); onCityChange(CITIES[0]); }}>
              <div className="aspect-square bg-gradient-to-tr from-blue-600 to-indigo-700 h-9 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10">
                <span className="text-white font-bold text-lg tracking-wider font-mono">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-800 to-orange-600 bg-clip-text text-transparent">
                DialLocal
              </span>
            </div>
            <span className="hidden md:inline-block text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
              India&apos;s Local Search Index
            </span>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-2xl px-6">
            {/* Unified Inline Mini-Selector */}
            <div className="flex items-center w-full bg-slate-50 border border-slate-200/80 rounded-full py-1.5 px-3 shadow-inner hover:border-slate-300 transition-colors focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
              <div className="flex items-center gap-1 text-slate-600 border-r border-slate-200 pr-2 min-w-[120px]">
                <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="bg-transparent border-none text-xs font-semibold focus:outline-none focus:ring-0 text-slate-700 cursor-pointer w-full py-0.5"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1 pl-3">
                <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ask for 'Plumbers', 'Restaurants', 'Dentists'..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent border-none w-full text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-0 py-0.5"
                />
              </div>
            </div>
          </div>

          {/* Auxiliary Actions & Profiles */}
          <div className="hidden md:flex items-center gap-5">
            <button
              onClick={onMyEnquiriesClick}
              className="text-xs font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>My Enquiries</span>
            </button>

            <button
              onClick={onAddBusinessClick}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs px-4 py-2 rounded-full cursor-pointer hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/10 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Business</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-800">{user.name}</span>
                  <button
                    onClick={onLogout}
                    className="text-[10px] text-red-500 font-medium hover:underline cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            ) : (
              <button
                onClick={onSignInClick}
                className="text-xs font-bold text-slate-700 hover:text-blue-600 cursor-pointer border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-full transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile responsive toggler */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
               <div className="flex items-center gap-2">
                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                   <User className="h-4 w-4 text-blue-600" />
                 </div>
               </div>
            ) : (
              <button
                onClick={onSignInClick}
                className="text-xs font-bold text-slate-700 hover:text-blue-600 cursor-pointer"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Location</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <MapPin className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => {
                  onCityChange(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="bg-transparent border-none text-sm font-semibold focus:ring-0 text-slate-700 w-full"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Search Keywords</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <Search className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Plumber, Dentist, Spa, School..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent border-none w-full text-sm focus:ring-0 text-slate-700"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onMyEnquiriesClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              My Enquiries
            </button>
            <button
              onClick={() => {
                onAddBusinessClick();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-blue-600 text-white font-semibold text-sm py-2.5 rounded-lg text-center hover:bg-blue-700 shadow-sm cursor-pointer"
            >
              Add Business Listing
            </button>
            {user && (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                Logout ({user.name})
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
