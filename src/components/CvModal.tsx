import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, FileText } from "lucide-react";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CvModal({ isOpen, onClose }: CvModalProps) {
  const pdfUrl = "/Currículum Vitae - Ismael Zhindón.pdf";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden" id="cv-modal-overlay">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-pointer"
            id="cv-modal-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-5xl h-[90vh] bg-[#0c0604] border border-white/10 flex flex-col rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,95,31,0.15)] z-10"
            id="cv-modal-container"
          >
            {/* Header bar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/40 shrink-0">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-red-500" />
                <h2 className="font-syne text-sm font-bold tracking-wider text-white">
                  Currículum Vitae
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Download PDF button */}
                <a
                  href={pdfUrl}
                  download="Currículum Vitae - Ismael Zhindón.pdf"
                  className="flex items-center gap-1.5 bg-[#ff5f1f]/10 border border-[#ff5f1f]/30 text-[#ff5f1f] font-mono text-[11px] tracking-wider px-3.5 py-1.5 rounded-lg hover:-translate-y-0.5 hover:bg-[#ff5f1f]/25 hover:text-white hover:shadow-[0_0_20px_rgba(255,95,31,0.4)] hover:border-[#ff5f1f] transition-all duration-300 cursor-pointer"
                  id="modal-download-btn"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Descargar PDF</span>
                </a>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1.5 border border-[#ff5f1f]/50 rounded-full bg-black/60 text-[#ff5f1f] hover:-translate-y-0.5 hover:bg-[#ff5f1f]/25 hover:text-white hover:shadow-[0_0_20px_rgba(255,95,31,0.4)] hover:border-[#ff5f1f] transition-all duration-300 cursor-pointer flex items-center justify-center"
                  id="desktop-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main view area for PDF */}
            <div className="flex-grow w-full h-full bg-black/40 relative">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-none"
                title="Curriculum Vitae PDF"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
