import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import CategoryGrid from './components/CategoryGrid';
import ListingCard from './components/ListingCard';
import MiniMap from './components/MiniMap';
import AddBusinessModal from './components/AddBusinessModal';
import EnquiryModal from './components/EnquiryModal';
import MyEnquiriesModal from './components/MyEnquiriesModal';
import { INITIAL_BUSINESSES, CATEGORIES, CITIES } from './data';
import { Business, Enquiry, Review } from './types';
import { Sparkles, MapPin, Search, Star, MessageSquareCode, ArrowUpRight, CheckCircle2, ChevronRight, RefreshCw, Layers, X } from 'lucide-react';

const LOCAL_STORAGE_BUSINESSES_KEY = 'jd_businesses';
const LOCAL_STORAGE_ENQUIRIES_KEY = 'jd_enquiries';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // User auth state
  const [user, setUser] = useState<{ name: string; phone: string } | null>(() => {
    const saved = localStorage.getItem('jd_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !phoneInput) return;
    const userData = { name: usernameInput, phone: phoneInput };
    setUser(userData);
    localStorage.setItem('jd_user', JSON.stringify(userData));
    setAuthModalOpen(false);
    setBannerMsg(`Welcome back, ${usernameInput}! Successfully signed in.`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jd_user');
    setBannerMsg('Logged out successfully.');
  };


  // Modal open controllers
  const [addBusinessOpen, setAddBusinessOpen] = useState(false);
  const [activeEnquiryBusiness, setActiveEnquiryBusiness] = useState<Business | null>(null);
  const [myEnquiriesOpen, setMyEnquiriesOpen] = useState(false);

  // Business state
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_BUSINESSES_KEY);
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  // Track focused business on lists & maps
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // Active advanced filters & sorting
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [filterMinRating, setFilterMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'best' | 'rating' | 'reviews'>('best');
  
  // Directions GPS active route tracking state
  const [directionsBusinessId, setDirectionsBusinessId] = useState<string | null>(null);

  // Enquiries history state
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Success banners
  const [bannerMsg, setBannerMsg] = useState('');

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_BUSINESSES_KEY, JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(enquiries));
  }, [enquiries]);

  // Clean success message timers
  useEffect(() => {
    if (bannerMsg) {
      const timer = setTimeout(() => setBannerMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [bannerMsg]);

  // Handle adding new business
  const handleAddBusiness = (newBusiness: Business) => {
    setBusinesses((prev) => [newBusiness, ...prev]);
    setBannerMsg(`"${newBusiness.name}" successfully registered! Your local search indexing is active.`);
    // Focus the newly added item
    setSelectedBusinessId(newBusiness.id);
  };

  // Handle new review submission on card
  const handleAddReview = (businessId: string, review: Review) => {
    setBusinesses((prev) =>
      prev.map((bus) => {
        if (bus.id === businessId) {
          const updatedReviews = [review, ...bus.reviews];
          const averageRating = parseFloat(
            (
              (bus.rating * bus.reviewsCount + review.rating) /
              (bus.reviewsCount + 1)
            ).toFixed(1)
          );
          return {
            ...bus,
            reviews: updatedReviews,
            reviewsCount: bus.reviewsCount + 1,
            rating: averageRating,
          };
        }
        return bus;
      })
    );
    setBannerMsg('Thank you! Your feedback score has been logged onto this listing.');
  };

  // Handle lodging new Enquiry
  const handleAddNewEnquiry = (enq: Enquiry) => {
    setEnquiries((prev) => [enq, ...prev]);
    setBannerMsg(`Inquiry successfully submitted to the company's regional officer.`);
  };

  // Delete an Enquiry ticket
  const handleDeleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((item) => item.id !== id));
    setBannerMsg('Inquiry history deleted.');
  };

  // Filter listings based on current filters chosen
  const filteredBusinesses = useMemo(() => {
    let result = businesses.filter((bus) => {
      // 1. City Filter
      const matchesCity = bus.city.toLowerCase() === selectedCity.toLowerCase();
      if (!matchesCity) return false;

      // 2. Category Filter
      if (selectedCategory && bus.category !== selectedCategory) return false;

      // 3. Search text matching values
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = bus.name.toLowerCase().includes(query);
        const matchesCategory = bus.category.toLowerCase().includes(query);
        const matchesArea = bus.area.toLowerCase().includes(query);
        const matchesTags = bus.tags.some((t) => t.toLowerCase().includes(query));
        const matchesFeatures = bus.features.some((f) => f.toLowerCase().includes(query));
        const matchesAddress = bus.address.toLowerCase().includes(query);
        const matchesDesc = bus.description.toLowerCase().includes(query);

        return (
          matchesName ||
          matchesCategory ||
          matchesArea ||
          matchesTags ||
          matchesFeatures ||
          matchesAddress ||
          matchesDesc
        );
      }

      return true;
    });

    // Apply advanced live toggle filters
    if (filterOpenNow) {
      result = result.filter((bus) => !bus.isClosed);
    }
    if (filterVerifiedOnly) {
      result = result.filter(
        (bus) => bus.verificationStatus === 'premium' || bus.verificationStatus === 'verified'
      );
    }
    if (filterMinRating) {
      result = result.filter((bus) => bus.rating >= filterMinRating);
    }

    // Apply Live Sorting parameters
    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      result = [...result].sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [
    businesses,
    selectedCity,
    selectedCategory,
    searchQuery,
    filterOpenNow,
    filterVerifiedOnly,
    filterMinRating,
    sortBy,
  ]);

  // Quick action list for trending searches
  const TRENDING_KEYWORDS = [
    { label: '🔥 Best Biryani', category: 'restaurants', text: 'Biryani' },
    { label: '🦷 Dental Implants', category: 'doctors', text: 'Dental' },
    { label: '🛠️ Leak Fixes', category: 'plumbers', text: 'Leak' },
    { label: '🏠 Shifting Movers', category: 'packers', text: 'Shifting' },
    { label: '🚗 Airport Cabs', category: 'rentals', text: 'Airport' },
    { label: '💅 Keratin Spa', category: 'salons', text: 'Keratin' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800" id="justdial-clone-app">
      
      {/* Prime Navigation */}
      <Navbar
        selectedCity={selectedCity}
        onCityChange={(city) => {
          setSelectedCity(city);
          // Auto clear highlight to avoid out-of-bounds pointers
          setSelectedBusinessId(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddBusinessClick={() => setAddBusinessOpen(true)}
        onMyEnquiriesClick={() => setMyEnquiriesOpen(true)}
        user={user}
        onLogout={handleLogout}
        onSignInClick={() => setAuthModalOpen(true)}
      />

      {/* Floating System-Wide Success Toast */}
      {bannerMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-slate-800 text-white py-3 px-4 rounded-2xl text-[11px] font-extrabold font-sans flex items-center gap-2.5 shadow-2xl animate-in slide-in-from-bottom duration-300 select-none max-w-sm backdrop-blur-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 stroke-[2.5] flex-shrink-0" />
          <span className="flex-1 text-slate-100">{bannerMsg}</span>
          <button onClick={() => setBannerMsg('')} className="p-1 hover:bg-white/10 rounded cursor-pointer text-slate-400 hover:text-slate-100">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Hero Header Presentation */}
      <header className="relative bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 py-16 md:py-20 px-4 md:px-8 overflow-hidden select-none border-b border-white/5">
        
        {/* Soft background glow objects */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-orange-500/20 blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-slate-200 text-xs font-bold tracking-wider shadow-xl">
            <Sparkles className="h-4 w-4 text-orange-400 animate-pulse" />
            <span>Connecting Millions with Premium Services</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            <span className="block mb-2">Find Verified Local Services in </span>
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent underline decoration-orange-500/30 decoration-wavy inline-block pb-2">
              {selectedCity}
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Instantly connect with top-rated plumbers, fine-dine hotels, specialists, packers and movers, salons, or diagnostic clinics nearby.
          </p>

          {/* Quick trending actions index */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-6">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mr-2 hidden sm:block">Trending Now:</span>
            {TRENDING_KEYWORDS.map((key, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedCategory(key.category);
                  setSearchQuery(key.text);
                }}
                className="group bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 hover:-translate-y-1 rounded-full text-[11px] sm:text-xs font-bold text-slate-200 px-4 py-2 cursor-pointer transition-all duration-300 shadow-lg flex items-center gap-1.5 backdrop-blur-sm"
              >
                <span>{key.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Structured Category grid navigator */}
      <CategoryGrid
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setSelectedBusinessId(null); // Clear selected indicators
        }}
      />

      {/* Main Core search & details grid section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-6 relative" id="search-directory-panel">
        
        {/* Left main Listings side */}
        <div className="flex-1 space-y-6">
          
          {/* Active filter summary heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 select-none">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">
                <Layers className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  {selectedCategory 
                    ? `${CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Matching'} Directory Results`
                    : 'All Active Business Listings'
                  }
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Found <span className="text-blue-600">{filteredBusinesses.length} vetted providers</span> in {selectedCity}
                </p>
              </div>
            </div>

            {/* Quick reset status tag filters */}
            {(selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full cursor-pointer transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset parameters</span>
              </button>
            )}
          </div>

          {/* Real-time Account Status Card Hub */}
          {!user ? (
            <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-slate-200/40 border border-slate-200/80 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                  🛡️ Connect with Certified Local Service Providers Securely
                </h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Join DialLocal to secure direct contact validation, post local reviews, and track active inquiry logs. Register with your phone number to start.
                </p>
              </div>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-4 py-2.5 rounded-xl text-center flex-shrink-0 cursor-pointer shadow-md shadow-indigo-600/10 transition-all hover:scale-103 whitespace-nowrap"
              >
                Sign In Securely
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-500/[0.08] to-teal-500/[0.02] border border-emerald-500/20 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 h-16 w-16 bg-emerald-500/5 blur-xl pointer-events-none rounded-full" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200 flex-shrink-0">
                  <span className="font-extrabold text-xs">Vetted</span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">
                    Active Session: <span className="text-emerald-700 font-black">{user.name}</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                    Account verified via ID <span className="font-bold text-slate-700">{user.phone}</span>. Enjoy automated region routing, review rating submissions, and 1-click support lines.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setMyEnquiriesOpen(true)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl cursor-pointer transition-all hover:scale-103"
                >
                  Track Inquiries ({enquiries.filter(e => e.phone === user.phone).length})
                </button>
                <button
                  onClick={handleLogout}
                  className="text-[10px] font-bold text-red-650 hover:bg-red-50 border border-transparent hover:border-red-100 px-3 py-2 rounded-xl cursor-pointer transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Advanced Live Filters & Sorting Dashboard Toolbar */}
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
            {/* Filters Left */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mr-1">Select Filters:</span>
              
              {/* 1. Open Now */}
              <button
                type="button"
                onClick={() => setFilterOpenNow(!filterOpenNow)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all border cursor-pointer flex items-center gap-1 ${
                  filterOpenNow
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-250 hover:bg-slate-100 text-slate-600'
                }`}
              >
                🕒 Open Now
              </button>

              {/* 2. Verified Only */}
              <button
                type="button"
                onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all border cursor-pointer flex items-center gap-1 ${
                  filterVerifiedOnly
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-250 hover:bg-slate-100 text-slate-600'
                }`}
              >
                👑 Premium/Verified
              </button>

              {/* 3. High Ratings 4.5+ */}
              <button
                type="button"
                onClick={() => setFilterMinRating(filterMinRating === 4.5 ? null : 4.5)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all border cursor-pointer flex items-center gap-1 ${
                  filterMinRating === 4.5
                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-250 hover:bg-slate-100 text-slate-600'
                }`}
              >
                ★ Rating 4.5+
              </button>
            </div>

            {/* Sorts Right */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 hover:bg-slate-150 border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-xl py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="best">Default Matching</option>
                <option value="rating">Highest Ratings</option>
                <option value="reviews">Most Reviewed Count</option>
              </select>
            </div>
          </div>

          {/* Core lists displaying matching providers */}
          {filteredBusinesses.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-150 p-12 text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto border border-orange-100">
                <Search className="h-8 w-8 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-800">No listings match your search</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We couldn&apos;t verify any &ldquo;{searchQuery || 'matching items'}&rdquo; operating in <span className="font-bold text-slate-700">{selectedCity}</span> catalogued under this directory level.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  View All listings in {selectedCity}
                </button>
                <button
                  type="button"
                  onClick={() => setAddBusinessOpen(true)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Advertise as Business
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in duration-300">
              {filteredBusinesses.map((business) => (
                <ListingCard
                  key={business.id}
                  business={business}
                  isSelected={selectedBusinessId === business.id}
                  onSelect={() => setSelectedBusinessId(business.id)}
                  onEnquireClick={(b) => setActiveEnquiryBusiness(b)}
                  onAddReview={handleAddReview}
                  onGetDirections={(b) => {
                    setDirectionsBusinessId(b.id);
                    setBannerMsg(`GPS path active! Simulated route drawn for "${b.name}" on the Radar map.`);
                  }}
                  currentUser={user}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Radar map visual section on desktop list */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <MiniMap
            businesses={filteredBusinesses}
            selectedBusinessId={selectedBusinessId}
            onSelectBusiness={setSelectedBusinessId}
            city={selectedCity}
            directionsBusinessId={directionsBusinessId}
            onClearDirections={() => {
              setDirectionsBusinessId(null);
            }}
          />
        </div>
      </main>

      {/* Styled Footer Block Info */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6 mt-16 text-white select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="aspect-square bg-gradient-to-tr from-blue-500 to-indigo-600 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-white text-base">D</div>
              <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">DialLocal</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              India&apos;s leading localized search registry platform. Connecting clients directly with certified commercial entities since 2012.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-300 uppercase tracking-widest mb-3.5 text-[10px]">Cities Indexed</h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              {CITIES.slice(0, 4).map(city => (
                <li key={city} className="hover:text-blue-400 cursor-pointer flex items-center gap-1" onClick={() => setSelectedCity(city)}>
                  <ChevronRight className="h-3 w-3" />
                  <span>{city} Directory</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-300 uppercase tracking-widest mb-3.5 text-[10px]">General Categories</h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              {CATEGORIES.slice(0, 4).map(cat => (
                <li key={cat.id} className="hover:text-blue-400 cursor-pointer flex items-center gap-1" onClick={() => setSelectedCategory(cat.id)}>
                  <ChevronRight className="h-3 w-3" />
                  <span>{cat.name} Locator</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-300 uppercase tracking-widest mb-3.5 text-[10px]">Vetted Integrity</h4>
            <div className="space-y-2.5 text-slate-400 leading-normal font-medium">
              <span className="block text-slate-200 font-bold">Offline Listing Validation</span>
              <p>Each commercial registry requires physical certificate checks or digital utility verifies before obtaining our standard Emerald Seal stamp.</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-center text-[10px] text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} DialLocal Directories Limited. All mock-ups and illustrations generated for simulation demo representations.
        </div>
      </footer>

      {/* --- Overlay Modals Portal simulated elements --- */}

      {/* 1. Advertise Business listing */}
      {addBusinessOpen && (
        <AddBusinessModal
          onClose={() => setAddBusinessOpen(false)}
          onAddBusiness={handleAddBusiness}
          currentCity={selectedCity}
        />
      )}

      {/* 2. Enquiry Modals */}
      {activeEnquiryBusiness && (
        <EnquiryModal
          business={activeEnquiryBusiness}
          onClose={() => setActiveEnquiryBusiness(null)}
          onSubmitEnquiry={handleAddNewEnquiry}
          currentUser={user}
        />
      )}

      {/* 3. My Enquiries Records dashboard */}
      {myEnquiriesOpen && (
        <MyEnquiriesModal
          onClose={() => setMyEnquiriesOpen(false)}
          enquiries={enquiries}
          onDeleteEnquiry={handleDeleteEnquiry}
        />
      )}

      {/* 4. User Sign In Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-white/20 flex flex-col relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100/50 hover:bg-slate-200 p-2 rounded-full cursor-pointer transition-all"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white mb-4 shadow-lg shadow-blue-500/30 ring-4 ring-blue-50">
                <Star className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h3>
              <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">Sign in to track enquiries & review businesses securely</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Mobile Number</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={phoneInput}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '');
                    setPhoneInput(clean.slice(0, 10));
                  }}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/20 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Continue Securely</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
