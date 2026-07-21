import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { PortfolioItem } from "../types";

interface MediaLightboxProps {
  isOpen: boolean;
  items: PortfolioItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function MediaLightbox({
  isOpen,
  items,
  currentIndex,
  onClose,
  onNavigate,
}: MediaLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedSubImageIndex, setSelectedSubImageIndex] = useState<number | null>(null);
  const currentItem = items[currentIndex];

  const handlePrev = () => {
    setIsZoomed(false);
    setSelectedSubImageIndex(null);
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onNavigate(prevIndex);
  };

  const handleNext = () => {
    setIsZoomed(false);
    setSelectedSubImageIndex(null);
    const nextIndex = (currentIndex + 1) % items.length;
    onNavigate(nextIndex);
  };

  const handleSubPrev = () => {
    if (currentItem?.images && selectedSubImageIndex !== null) {
      const prevIdx = (selectedSubImageIndex - 1 + currentItem.images.length) % currentItem.images.length;
      setSelectedSubImageIndex(prevIdx);
    }
  };

  const handleSubNext = () => {
    if (currentItem?.images && selectedSubImageIndex !== null) {
      const nextIdx = (selectedSubImageIndex + 1) % currentItem.images.length;
      setSelectedSubImageIndex(nextIdx);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedSubImageIndex !== null) {
          setSelectedSubImageIndex(null);
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowLeft") {
        if (selectedSubImageIndex !== null) {
          handleSubPrev();
        } else {
          handlePrev();
        }
      }
      if (e.key === "ArrowRight") {
        if (selectedSubImageIndex !== null) {
          handleSubNext();
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, currentIndex, items, selectedSubImageIndex, currentItem?.images]);

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Dark overlay backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-zoom-out"
        />

        {/* Floating Header */}
        <div className="absolute top-0 inset-x-0 h-20 px-6 md:px-12 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-primary-container uppercase tracking-widest">
              Galería Multimedia
            </span>
            <h4 className="font-syne text-sm md:text-lg font-semibold text-white tracking-tight">
              {currentItem.title}
            </h4>
          </div>

          <div className="flex items-center gap-4 pr-12 md:pr-16">
            <span className="font-mono text-xs text-white/50">
              {currentIndex + 1} / {items.length}
            </span>
          </div>
        </div>

        {/* Floating Close Button in Top Right */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 md:top-6 md:right-8 p-2.5 border border-[#ff5f1f]/50 rounded-full bg-black/60 text-[#ff5f1f] hover:-translate-y-0.5 hover:bg-[#ff5f1f]/25 hover:text-white hover:shadow-[0_0_20px_rgba(255,95,31,0.4)] hover:border-[#ff5f1f] transition-all duration-300 z-50 cursor-pointer flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md"
          title="Cerrar vista completa"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 border border-white/5 rounded-full bg-[#180b07]/50 text-white hover:text-primary hover:border-primary hover:scale-110 hover:shadow-[0_0_15px_#ff5f1f] transition-all duration-300 z-20 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 border border-white/5 rounded-full bg-[#180b07]/50 text-white hover:text-primary hover:border-primary hover:scale-110 hover:shadow-[0_0_15px_#ff5f1f] transition-all duration-300 z-20 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Immersive Image Display Container */}
        <div 
          className={`relative w-full z-10 ${
            currentItem.images && currentItem.images.length > 0 
              ? "max-w-5xl max-h-[65vh] overflow-y-auto px-4 py-2 scrollbar-thin" 
              : "max-w-[85vw] max-h-[75vh] flex items-center justify-center select-none"
          }`}
        >
          {currentItem.images && currentItem.images.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {currentItem.images.map((imgUrl, idx) => (
                  <motion.div
                    key={`${currentItem.id}-img-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                    onClick={() => setSelectedSubImageIndex(idx)}
                    className="relative aspect-square sm:aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/40 group/grid shadow-lg cursor-zoom-in"
                  >
                    <img
                      src={imgUrl}
                      alt={currentItem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/grid:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 opacity-0 group-hover/grid:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                      <span className="font-mono text-[9px] text-[#ff5f1f] bg-[#ff5f1f]/15 border border-[#ff5f1f]/30 px-2 py-0.5 rounded">
                        Ampliar Post
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          ) : (
            <motion.img
              key={currentItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.25 : 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              src={currentItem.url}
              alt={currentItem.title}
              referrerPolicy="no-referrer"
              onClick={() => setIsZoomed(!isZoomed)}
              className={`max-w-full max-h-[75vh] object-contain rounded-xl transition-shadow shadow-[0_0_50px_rgba(255,95,31,0.15)] ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              style={
                ["dg-11", "dg-12", "dg-31"].includes(currentItem.id)
                  ? { backgroundColor: "#271813" }
                  : undefined
              }
            />
          )}
        </div>

        {/* Sub-image Zoomed Overlay */}
        <AnimatePresence>
          {selectedSubImageIndex !== null && currentItem.images && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            >
              <button
                onClick={() => setSelectedSubImageIndex(null)}
                className="absolute top-6 right-6 p-2 bg-black/80 border border-white/10 rounded-full text-white/80 hover:text-white cursor-pointer z-50 hover:scale-105 transition-transform"
                title="Cerrar vista ampliada"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Arrows for Zoomed Sub-Images */}
              {currentItem.images.length > 1 && (
                <>
                  <button
                    onClick={handleSubPrev}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 border border-white/10 rounded-full bg-[#180b07]/80 text-white hover:text-primary hover:border-primary hover:scale-110 hover:shadow-[0_0_15px_#ff5f1f] transition-all duration-300 z-50 cursor-pointer"
                    title="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleSubNext}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 border border-white/10 rounded-full bg-[#180b07]/80 text-white hover:text-primary hover:border-primary hover:scale-110 hover:shadow-[0_0_15px_#ff5f1f] transition-all duration-300 z-50 cursor-pointer"
                    title="Siguiente imagen"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              
              <div className="relative max-w-full max-h-[85vh] flex flex-col items-center justify-center">
                <motion.img
                  key={selectedSubImageIndex}
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  transition={{ type: "spring", damping: 25 }}
                  src={currentItem.images[selectedSubImageIndex]}
                  alt="Vista ampliada"
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Details Drawer (Bottom) */}
        {currentItem.description && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 inset-x-4 md:inset-x-auto max-w-xl mx-auto z-10 bg-[#180b07]/90 border border-primary-container/30 rounded-2xl p-4 md:p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md text-center"
          >
            <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
              {currentItem.description}
            </p>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
