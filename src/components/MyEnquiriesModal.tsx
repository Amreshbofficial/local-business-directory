import { X, Calendar, ClipboardList, Trash2 } from 'lucide-react';
import { Enquiry } from '../types';

interface MyEnquiriesModalProps {
  onClose: () => void;
  enquiries: Enquiry[];
  onDeleteEnquiry: (id: string) => void;
}

export default function MyEnquiriesModal({ onClose, enquiries, onDeleteEnquiry }: MyEnquiriesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" id="my-enquiries-modal-root">
      <div className="bg-white rounded-3xl max-w-lg w-full flex flex-col relative max-h-[85vh] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Your Search Enquiries</h3>
              <p className="text-[11px] text-slate-400 font-medium">Historical records of contacts dispatched to local merchants</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 rounded-full p-1.5 border border-slate-200 transition-all cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {enquiries.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="bg-slate-50 rounded-full h-12 w-12 flex items-center justify-center text-slate-400 mx-auto border border-slate-100">
                <ClipboardList className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xs font-bold text-slate-700">No Enquiries registered yet</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Once you send inquiries to doctors, plumbers, or hotels, their tracking tickets will appear right here for convenient callback access.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq) => {
                const dateText = new Date(enq.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={enq.id}
                    className="border border-slate-150 rounded-2xl p-4 bg-white hover:border-slate-300 transition-all text-xs flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                          Ticket Reference Checked
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-800 mt-1">{enq.businessName}</h4>
                      </div>
                      
                      <button
                        onClick={() => onDeleteEnquiry(enq.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-500 bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl">
                      <div>
                        <span className="font-bold text-slate-400 block uppercase text-[8px]">Inquirer Contact</span>
                        <span className="font-semibold text-slate-700">{enq.name} ({enq.phone})</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 block uppercase text-[8px]">Submitted Email</span>
                        <span className="font-semibold text-slate-700">{enq.email || 'None Provided'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-100/80 p-3 rounded-xl italic">
                      &ldquo;{enq.message}&rdquo;
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 select-none font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{dateText}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
          >
            Close Dialog
          </button>
        </div>

      </div>
    </div>
  );
}
