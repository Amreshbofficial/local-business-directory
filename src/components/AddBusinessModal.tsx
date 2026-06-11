import React, { useState } from 'react';
import { X, Check, Building, FileText, Phone, Settings, Tag, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES, CITIES } from '../data';
import { Business, Review } from '../types';

interface AddBusinessModalProps {
  onClose: () => void;
  onAddBusiness: (business: Business) => void;
  currentCity: string;
}

const FEATURE_TEMPLATES = [
  'Air Conditioned',
  'Accepts Credit Cards',
  'Home Delivery',
  'Valet Parking',
  'Wheelchair Accessible',
  'Free WiFi',
  'Prior Appointment Compulsory',
  'Digital Payments Accepted',
  '24-Hour Emergency Support'
];

const CAT_IMAGES: { [key: string]: string } = {
  restaurants: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
  doctors: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
  plumbers: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600',
  hotels: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600',
  education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600',
  salons: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=600',
  gyms: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
  rentals: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
  packers: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=600',
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600',
  hospitals: 'https://images.unsplash.com/photo-1586773860418-d3b3a978cd65?auto=format&fit=crop&q=80&w=600',
  'pest-control': 'https://images.unsplash.com/photo-1587334206502-7b1922c44173?auto=format&fit=crop&q=80&w=600',
};

export default function AddBusinessModal({ onClose, onAddBusiness, currentCity }: AddBusinessModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [city, setCity] = useState(currentCity || CITIES[0]);
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [timing, setTiming] = useState('Open • Closes 8:00 PM');
  
  // Features and Tags
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Validation
  const [errorMsg, setErrorMsg] = useState('');

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/,$/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  const validateStep1 = () => {
    if (!name.trim()) return 'Business Name is required';
    if (!area.trim()) return 'Area/Locality is required';
    if (!address.trim()) return 'Complete Address is required';
    return '';
  };

  const validateStep2 = () => {
    const phoneRegex = /^[0-9+() -]{10,15}$/;
    if (!phone.trim()) return 'Primary Contact phone is required';
    if (!phoneRegex.test(phone)) return 'Please input a valid phone number';
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) return 'Please input a valid email address';
    return '';
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const finalTags = tags.length > 0 ? tags : [CATEGORIES.find(c => c.id === category)?.name || 'Local Builder'];

    // Select suitable Unsplash cover
    const coverImage = CAT_IMAGES[category] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600';

    const newBusiness: Business = {
      id: 'b_' + Date.now().toString(),
      name: name.trim(),
      category,
      rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
      reviewsCount: 0,
      address: address.trim(),
      area: area.trim(),
      city,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() ? whatsapp.trim() : undefined,
      email: email.trim() ? email.trim() : undefined,
      website: website.trim() ? website.trim() : undefined,
      description: description.trim() || `Excellent local business in ${area}, ${city} offering high-end ${category} solutions.`,
      image: coverImage,
      tags: finalTags,
      features: selectedFeatures.length > 0 ? selectedFeatures : ['Verified Listings', 'Reliable Support'],
      reviews: [],
      lat: Math.floor(Math.random() * 70) + 15,
      lng: Math.floor(Math.random() * 70) + 15,
      verificationStatus: Math.random() > 0.5 ? 'verified' : 'none',
      timing: timing.trim()
    };

    onAddBusiness(newBusiness);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" id="add-business-model-root">
      <div className="bg-white rounded-3xl max-w-xl w-full flex flex-col relative max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <span className="text-[10px] font-bold tracking-widest text-blue-200 uppercase bg-blue-900/30 px-2.5 py-1 rounded-full">
            Step {step} of 3
          </span>
          <h3 className="text-lg font-bold mt-2">Advertise Your Business</h3>
          <p className="text-xs text-blue-100 mt-1">
            Publish your contact details, operational index, timings, and custom amenities catalog.
          </p>
        </div>

        {/* Steps indicator bar */}
        <div className="flex h-1 bg-slate-100">
          <div className={`h-full transition-all duration-300 bg-blue-600 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
        </div>

        {/* Form Body scrollable area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="font-bold">Error:</span> {errorMsg}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-blue-700 border-b border-slate-100 pb-2">
                <Building className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">General Information</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Divine Car Care & Detailing Garage"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area / Locality *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Koramangala 4th Block, West End Rd"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Full Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Shop No. 12, Ground Floor, Signature Mall, Plot 4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-blue-700 border-b border-slate-100 pb-2">
                <Phone className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Contact & Social Channels</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98888 77777"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98888 77777"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email ID (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. business@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Website URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://domain.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Operating Hours / Timings</label>
                <input
                  type="text"
                  placeholder="e.g. Open • Closes 9:30 PM"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Business Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Introduce your specializations, highlights, achievements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-blue-700 border-b border-slate-100 pb-2">
                <Settings className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Features & Rich Markers</span>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-700 mb-2">Amenities & Services Offered</span>
                <div className="grid grid-cols-2 gap-2">
                  {FEATURE_TEMPLATES.map((feat) => {
                    const active = selectedFeatures.includes(feat);
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => toggleFeature(feat)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left text-[11px] font-semibold select-none transition-all cursor-pointer ${
                          active
                            ? 'bg-blue-50 border-blue-400 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`h-4.5 w-4.5 rounded-md flex items-center justify-center border text-white ${active ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                          {active && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Add SEO Tags / Keywords</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter keywords and press Enter or comma"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const clean = tagInput.trim();
                      if (clean && !tags.includes(clean)) {
                        setTags([...tags, clean]);
                        setTagInput('');
                      }
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tg, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                        {tg}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(idx)}
                          className="text-slate-400 hover:text-slate-600 font-bold ml-0.5"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <ImageIcon className="h-4.5 w-4.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-[11px] text-slate-500 leading-normal">
                  <span className="font-bold text-slate-700 block">Auto Image Assignment:</span>
                  DialLocal dynamically pairs matching high-resolution coverage photographs from our vetted Unsplash content cluster matching your chosen category.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="border-t border-slate-100 p-5 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl cursor-pointer"
            >
              Cancel
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer shadow-blue-500/10"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer shadow-green-500/10"
              >
                Submit Advertisement
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
