import React, { useState } from 'react';
import { Star, MessageSquare, Phone, Globe, ShieldCheck, Clock, Check, StarOff, Send, Navigation } from 'lucide-react';
import { Business, Review } from '../types';

interface ListingCardProps {
  key?: string;
  business: Business;
  onEnquireClick: (business: Business) => void;
  onAddReview: (businessId: string, review: Review) => void;
  isSelected: boolean;
  onSelect: () => void;
  onGetDirections?: (business: Business) => void;
  currentUser?: { name: string; phone: string } | null;
}

export default function ListingCard({
  business,
  onEnquireClick,
  onAddReview,
  isSelected,
  onSelect,
  onGetDirections,
  currentUser,
}: ListingCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewName, setReviewName] = useState(currentUser?.name || '');
  const [reviewText, setReviewText] = useState('');

  // Sync reviewer name if user signs in/out
  React.useEffect(() => {
    if (currentUser?.name) {
      setReviewName(currentUser.name);
    } else {
      setReviewName('');
    }
  }, [currentUser]);

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    const reviewObj: Review = {
      id: 'rev_' + Date.now().toString(),
      username: reviewName.trim(),
      rating: newRating,
      text: reviewText.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    onAddReview(business.id, reviewObj);
    setReviewName('');
    setReviewText('');
    setReviewFormOpen(false);
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md cursor-pointer ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-100 hover:border-slate-200'
      }`}
      id={`listing-card-${business.id}`}
    >
      {/* Featured/Category Photo */}
      <div className="w-full md:w-56 h-48 md:h-auto relative overflow-hidden flex-shrink-0 bg-slate-100 select-none">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {business.verificationStatus === 'premium' && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              👑 Premium Partner
            </span>
          )}
          {business.verificationStatus === 'verified' && (
            <span className="bg-emerald-600 text-white font-bold text-[9px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 stroke-[2.5]" /> Verified Listing
            </span>
          )}
        </div>

        {/* Category Label badge bottom Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/40 backdrop-blur-sm px-2.5 py-0.5 rounded text-[9px] text-white font-bold tracking-wider uppercase">
          {business.category}
        </div>
      </div>

      {/* Narrative & Interface parameters */}
      <div className="p-5 flex-1 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-2">
          
          {/* Header Title Grid Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight leading-snug cursor-pointer hover:text-blue-600" onClick={onSelect}>
                {business.name}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-0.5">{business.area}, {business.city}</p>
            </div>
            {/* Rating Metric display */}
            <div className="text-right flex-shrink-0 flex items-center bg-blue-50/50 hover:bg-blue-50 p-2 rounded-2xl border border-blue-100 flex-col gap-0.5 select-none font-sans justify-center min-w-[54px]">
              <span className="text-[14px] font-extrabold text-blue-700 leading-none">{business.rating}</span>
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-2 w-2 ${
                      i < Math.floor(business.rating) ? 'fill-current text-amber-500' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[8px] font-semibold text-slate-400 leading-tight">
                {business.reviewsCount} Ratings
              </span>
            </div>
          </div>

          {/* Business Details Text block */}
          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
            {business.description}
          </p>

          {/* Timing index */}
          <div className="flex items-center gap-1.5 text-[10px]">
            <Clock className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
            <span className={`font-bold ${business.isClosed ? 'text-red-500' : 'text-teal-600'}`}>
              {business.timing}
            </span>
          </div>

          {/* Action tags/Labels list */}
          <div className="flex flex-wrap gap-1.5 pt-1 select-none">
            {business.tags.map((tg, idx) => (
              <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full">
                #{tg}
              </span>
            ))}
          </div>

          {/* Quick facilities list */}
          <div className="flex flex-wrap gap-3 py-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
            {business.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1 text-[9px] text-slate-500 font-bold">
                <div className="h-3.5 w-3.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Check className="h-2 w-2 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
            {business.features.length > 3 && (
              <span className="text-[9px] text-slate-400 font-bold">
                +{business.features.length - 3} further highlights
              </span>
            )}
          </div>
        </div>

        {/* Primary Interactive buttons block */}
        <div className="mt-5 pt-4 border-t border-slate-50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* Show/Hide Phone button logic directly inside */}
            <button
              onClick={() => setShowPhone(!showPhone)}
              className={`inline-flex items-center justify-center gap-1.5 text-white font-bold text-[11px] px-4 py-2.5 rounded-xl cursor-pointer shadow-md transition-all ${
                showPhone 
                  ? 'bg-slate-800 shadow-slate-800/10' 
                  : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/10 animate-pulse'
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{showPhone ? business.phone : 'Show Phone Number'}</span>
            </button>

            {/* Quick click feedback to simulated services web check */}
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"
                title="Visit Website"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="h-4 w-4" />
              </a>
            )}

            {/* Simulated Reviews list dropdown toggle */}
            <button
              onClick={() => setReviewFormOpen(!reviewFormOpen)}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50/50 hover:bg-blue-50 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Write Review ({business.reviews.length})</span>
            </button>

            {/* Simulated Get Directions live route tracker */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
                if (onGetDirections) {
                  onGetDirections(business);
                }
              }}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
              title="Get Route Directions"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Directions</span>
            </button>
          </div>

          <button
            onClick={() => onEnquireClick(business)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-xl text-center shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            Send Inquiry Free
          </button>
        </div>

        {/* Nested review submission container */}
        {reviewFormOpen && (
          <div className="mt-4 p-4 border-t border-slate-100 bg-slate-50/50 rounded-2xl animate-in slide-in-from-top-2 duration-200">
            <h4 className="text-[11px] font-bold text-slate-700 mb-2.5">Add User Rating & Review</h4>
            <form onSubmit={submitReview} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500">Your Rating:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setNewRating(starVal)}
                        className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`h-4.5 w-4.5 ${starVal <= newRating ? 'fill-current' : 'text-slate-300'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-[11px] bg-white text-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Describe your detailed experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-[11px] bg-white text-slate-700 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-2 rounded-xl flex-shrink-0 cursor-pointer flex items-center justify-center w-9"
                  title="Send Review"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Reviews slider/drawer panel inside card if items exist */}
        {business.reviews.length > 0 && isSelected && (
          <div className="mt-4 pt-4 border-t border-slate-100 px-1">
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">User Feedback</span>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {business.reviews.map((rev) => (
                <div key={rev.id} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col gap-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-700">{rev.username}</span>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-amber-500 font-bold text-[9px]">
                      ★ {rev.rating}
                    </div>
                  </div>
                  <p className="text-slate-500 font-medium whitespace-pre-wrap">{rev.text}</p>
                  <span className="text-[8px] text-slate-400 self-end font-semibold">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
