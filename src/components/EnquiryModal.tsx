import React, { useState } from 'react';
import { X, Send, PhoneCall, CheckCircle, MessageSquare } from 'lucide-react';
import { Business, Enquiry } from '../types';

interface EnquiryModalProps {
  business: Business;
  onClose: () => void;
  onSubmitEnquiry: (enquiry: Enquiry) => void;
  currentUser?: { name: string; phone: string } | null;
}

export default function EnquiryModal({ business, onClose, onSubmitEnquiry, currentUser }: EnquiryModalProps) {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [message, setMessage] = useState(
    `Hi, I saw your listing for "${business.name}" on DialLocal and would like to get a quote/rate specifications. Please contact me at your earliest.`
  );
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setLoading(true);
    // Simulate real SMS gateway trigger / email forward delay
    setTimeout(() => {
      const newEnquiry: Enquiry = {
        id: 'enq_' + Date.now().toString(),
        businessId: business.id,
        businessName: business.name,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString()
      };

      onSubmitEnquiry(newEnquiry);
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" id="enquiry-modal-root">
      <div className="bg-white rounded-3xl max-w-md w-full flex flex-col relative overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100/80 hover:bg-slate-200 rounded-full p-1 cursor-pointer transition-all z-10"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {!success ? (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Header banner */}
            <div className="p-6 bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-800 text-white select-none">
              <span className="text-[9px] font-bold tracking-widest text-blue-200 uppercase bg-blue-900/40 px-2.5 py-1 rounded-full">
                Verify & Send Free Enquiry
              </span>
              <h3 className="text-base font-bold mt-2.5">Enquire with {business.name}</h3>
              <p className="text-xs text-blue-100 mt-1 line-clamp-1">{business.address}</p>
            </div>

            {/* Form body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      setPhone(clean.slice(0, 10));
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email ID (Optional)</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requirement / Questions</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex items-start gap-2.5">
                <PhoneCall className="h-4.5 w-4.5 text-orange-500 flex-shrink-0 mt-0.5 animate-bounce" />
                <div className="text-[10px] text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-700 block">Instant SMS Notification:</span>
                  Submitting will dispatch your inquiry context to the merchant and transmit listing contact credentials to your mobile index via automated SMS alerts.
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-slate-100 p-5 bg-slate-50/50 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 px-4 py-2 cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <div className="h-3 w-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    <span>Send Enquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
              <CheckCircle className="h-10 w-10 stroke-[2]" />
            </div>

            <h3 className="text-base font-bold text-slate-800">Enquiry Sent Successfully!</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              Inquiry dispatch index logged. An SMS receipt has been dispatched to <span className="font-bold text-slate-700">{phone}</span> to coordinate contact details.
            </p>

            <div className="my-5 w-full bg-slate-50 rounded-2xl border border-slate-100 p-4 text-left">
              <span className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Receipt Summary</span>
              <div className="text-xs space-y-1">
                <div className="flex justify-between text-slate-500"><span className="font-medium">Recipient:</span> <span className="font-bold text-slate-700">{business.name}</span></div>
                <div className="flex justify-between text-slate-500"><span className="font-medium">Phone:</span> <span className="font-semibold text-slate-700">{business.phone}</span></div>
                {business.whatsapp && <div className="flex justify-between text-slate-500"><span className="font-medium">WhatsApp:</span> <span className="font-semibold text-green-600">{business.whatsapp}</span></div>}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
