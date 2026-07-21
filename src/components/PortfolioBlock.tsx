import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Download, 
  HelpCircle, 
  FileCheck, 
  FileCode,
  X
} from "lucide-react";
import { CATEGORIES, PORTFOLIO_ITEMS } from "../data";
import { PortfolioItem } from "../types";
import { getSavedPortfolioItems, savePortfolioItem, deletePortfolioItem } from "../lib/db";
import CustomVideoPlayer from "./CustomVideoPlayer";
import MediaLightbox from "./MediaLightbox";

// Modern and professional stagger variants for interactive portfolio items and categories
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 15,
    },
  },
};

export default function PortfolioBlock() {
  const [selectedCategory, setSelectedCategory] = useState<"design" | "3d" | "animation" | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);

  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    items: PortfolioItem[];
    currentIndex: number;
  }>({
    isOpen: false,
    items: [],
    currentIndex: 0,
  });

  const [activePdf, setActivePdf] = useState<{ url: string; title: string } | null>(null);

  // Load all items (static + IndexedDB saved items)
  const loadAllItems = async () => {
    try {
      const saved = await getSavedPortfolioItems();
      const mappedSaved: PortfolioItem[] = saved.map((s) => {
        let url = s.url;
        if (s.blob) {
          url = URL.createObjectURL(s.blob);
        }
        return {
          id: s.id,
          title: s.title,
          type: s.type,
          url,
          description: s.description,
          category: s.category,
          isUserCreated: true, // Mark so we can show delete option
          fileName: s.fileName,
          fileSize: s.fileSize,
        } as PortfolioItem;
      });
      // Filter out deleted static items saved in localStorage
      let deletedStaticIds: string[] = [];
      try {
        deletedStaticIds = JSON.parse(localStorage.getItem("deleted_static_portfolio_items") || "[]");
      } catch (e) {
        console.error(e);
      }
      const filteredStatic = PORTFOLIO_ITEMS.filter((item) => !deletedStaticIds.includes(item.id));
      
      // Filter out any 3D model named "Orco"
      const filteredSaved = mappedSaved.filter(
        (item) => !(item.category === "3d" && item.title.toLowerCase().includes("orco"))
      );

      setItems([...filteredStatic, ...filteredSaved]);
    } catch (err) {
      console.error("Failed to load saved items from IndexedDB", err);
      let deletedStaticIds: string[] = [];
      try {
        deletedStaticIds = JSON.parse(localStorage.getItem("deleted_static_portfolio_items") || "[]");
      } catch (e) {
        console.error(e);
      }
      const filteredStatic = PORTFOLIO_ITEMS.filter((item) => !deletedStaticIds.includes(item.id));
      setItems([...filteredStatic]);
    }
  };

  useEffect(() => {
    loadAllItems();
  }, []);

  const currentCategories = CATEGORIES.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.category === cat.id),
  }));

  const currentCategoryData = currentCategories.find((cat) => cat.id === selectedCategory);

  const handleOpenImage = (itemsList: PortfolioItem[], index: number) => {
    setLightboxState({
      isOpen: true,
      items: itemsList,
      currentIndex: index,
    });
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPortfolioItem = (item: PortfolioItem, index: number) => {
    if (item.type === "video") {
      return (
        <motion.div variants={gridItemVariants} key={item.id} className="relative h-full group">
          <CustomVideoPlayer
            url={item.url}
            title={item.title}
            description={item.description}
          />
        </motion.div>
      );
    }

    if (item.type === "pdf") {
      return (
        <motion.div
          variants={gridItemVariants}
          key={item.id}
          className="border border-white/5 bg-black/40 p-6 rounded-xl flex flex-col justify-between hover:border-primary-container/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,95,31,0.1)] group relative"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-105 transition-transform duration-300">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[9px] text-red-400 tracking-wider uppercase block">
                  Documento PDF
                </span>
                <h4 className="font-syne text-sm font-semibold text-white tracking-wide truncate">
                  {item.title}
                </h4>
              </div>
            </div>

            <p className="font-sans text-xs text-on-surface-variant/80 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePdf({ url: item.url, title: item.title })}
                className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-primary hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> VER ONLINE
              </button>

              <button
                onClick={() => downloadFile(item.url, `${item.title}.pdf`)}
                className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-on-surface-variant hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> DESCARGAR
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    // For Image Type
    const isNative = !item.isUserCreated || !item.fileName || 
      ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(item.fileName.toLowerCase().split('.').pop() || "");

    if (!isNative) {
      const ext = item.fileName?.toLowerCase().split('.').pop() || "bin";
      const sizeInMB = item.fileSize ? (item.fileSize / (1024 * 1024)).toFixed(2) : null;
      
      return (
        <motion.div
          variants={gridItemVariants}
          key={item.id}
          className="border border-white/5 bg-black/45 p-6 rounded-xl flex flex-col justify-between hover:border-[#ff5f1f]/35 hover:bg-black/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,95,31,0.15)] group relative aspect-video"
        >
          <div className="space-y-3.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-[#ff5f1f]/20 flex flex-col items-center justify-center text-[#ff5f1f] font-mono text-[9px] uppercase font-bold shrink-0">
                  <FileCode className="w-5 h-5 mb-0.5" />
                  <span>{ext}</span>
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[9px] text-primary tracking-widest uppercase block mb-0.5">
                    Archivo de Proyecto / Recurso
                  </span>
                  <h4 className="font-syne text-sm font-semibold text-white tracking-wide truncate">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>

            <p className="font-sans text-xs text-on-surface-variant/80 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
            <div className="truncate">
              <p className="font-mono text-[10px] text-white/90 truncate max-w-[200px]" title={item.fileName}>
                {item.fileName}
              </p>
              {sizeInMB && (
                <p className="font-mono text-[9px] text-on-surface-variant mt-0.5">
                  Tamaño: {sizeInMB} MB
                </p>
              )}
            </div>

            <button
              onClick={() => downloadFile(item.url, item.fileName || "archivo")}
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider bg-[#1e100b] border border-[#ff5f1f]/40 text-primary hover:bg-primary hover:text-white px-3.5 py-2 rounded-lg transition-all duration-300 cursor-pointer shrink-0 shadow-md"
            >
              <Download className="w-3.5 h-3.5" /> DESCARGAR
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        variants={gridItemVariants}
        key={item.id}
        onClick={() => handleOpenImage(currentCategoryData?.items || [], index)}
        className="group relative aspect-video border border-white/5 overflow-hidden bg-black/20 rounded-xl cursor-pointer hover:border-primary-container/40 transition-all duration-500 hover:shadow-[0_0_20px_#ff5f1f]"
      >
        <img
          src={item.url}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          style={
            ["dg-11", "dg-12", "dg-31"].includes(item.id)
              ? { backgroundColor: "#271813" }
              : undefined
          }
        />
        {/* Interactive prompt overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
          <div className="flex justify-end items-start">
            <div className="p-2 rounded-lg bg-primary-container text-white shadow-[0_0_10px_#ff5f1f]">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="font-mono text-[9px] text-primary tracking-widest uppercase block mb-1">
              Click para Ampliar
            </span>
            <h4 className="font-syne text-sm font-semibold text-white tracking-wide">
              {item.title}
            </h4>
            {item.description && (
              <p className="font-sans text-xs text-on-surface-variant/80 mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* Text bar visible when overlay hidden */}
        <div className="absolute bottom-2 left-2 bg-[#180b07]/90 border border-white/5 text-[11px] font-sans text-on-surface-variant/90 px-2.5 py-1 rounded max-w-[85%] truncate pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
          {item.title}
        </div>
      </motion.div>
    );
  };

  return (
    <section className="min-h-screen py-24 md:py-32 px-4 md:px-12 bg-transparent relative flex flex-col justify-center" id="proyectos">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto w-full"
      >
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-l-4 pl-6 border-primary-container">
          <div>
            <h2 className="font-syne text-4xl md:text-6xl font-semibold text-white mt-1 leading-none">
              Proyectos
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="relative min-h-[550px] w-full">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              /* CATEGORIES MAIN GRID */
              <motion.div
                key="categories-grid"
                variants={gridContainerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {CATEGORIES.map((category) => (
                  <motion.div
                    key={category.id}
                    variants={gridItemVariants}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      if (typeof (window as any).pulseShader === "function") {
                        (window as any).pulseShader();
                      }
                    }}
                    className="group relative aspect-[3/4] border border-white/5 cursor-pointer overflow-hidden bg-black/40 backdrop-blur-2xl transition-all duration-500 rounded-2xl hover:shadow-[0_0_25px_#ff5f1f] hover:border-primary-container/40"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#180b07] via-black/10 to-transparent z-10 opacity-75" />
                    <img
                      src={category.coverImage}
                      alt={category.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                      <h3 className="font-syne text-2xl md:text-3xl font-semibold text-white leading-tight group-hover:translate-x-1.5 transition-transform duration-300">
                        {category.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* DETAILED VIEW */
              <motion.div
                key="project-details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Navigation Bar in Detailed View */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
                  {/* Category switcher tabs */}
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`font-mono text-xs tracking-wider px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,95,31,0.4)] hover:border-[#ff5f1f] ${
                          selectedCategory === cat.id
                            ? "bg-[#ff5f1f]/20 border-[#ff5f1f] text-white shadow-[0_0_15px_rgba(255,95,31,0.35)] -translate-y-0.5"
                            : "border-[#ff5f1f]/50 text-[#ff5f1f] bg-black/20"
                        }`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>

                  {/* Volver button */}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-wider border border-[#ff5f1f]/50 rounded-lg text-[#ff5f1f] hover:-translate-y-0.5 hover:bg-[#ff5f1f]/25 hover:text-white hover:shadow-[0_0_20px_rgba(255,95,31,0.4)] hover:border-[#ff5f1f] transition-all duration-300 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Volver
                  </button>
                </div>

                {/* Subheading info */}
                <div className="max-w-2xl mb-6">
                  <h3 className="font-syne text-2xl md:text-3xl font-semibold text-primary mb-2">
                    {currentCategoryData?.title}
                  </h3>
                </div>

                {selectedCategory === "design" ? (
                  <div className="space-y-12 animate-fade-in">
                    {/* Group 1: Social Media Content */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Social Media Content
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["dg-1", "dg-2", "dg-3", "dg-4", "dg-5"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 2: Portada Película Ficticia */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Portada Película Ficticia
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => item.id === "dg-6")
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 3: Retoque Foto Antigua */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Retoque Foto Antigua
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => item.id === "dg-7")
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 4: Diseño Publicitario */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Diseño Publicitario
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["dg-8", "dg-9"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group: Rediseños */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Rediseños
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["dg-10", "dg-11", "dg-12"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group: Dibujo Digital */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Dibujo Digital
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["dg-13", "dg-14", "dg-15", "dg-16"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 5: Catálogos Editorial */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Diseño Editorial
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["dg-17", "dg-18"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 6: Vectorización */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Vectorización
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["dg-19", "dg-21"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 8: Ilustración Vectorial */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Ilustración Vectorial
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["dg-22", "dg-23"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 9: Carteles */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Carteles
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["dg-24", "dg-25"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 10: Logos */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Logos
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["dg-27", "dg-26", "dg-28", "dg-29", "dg-30", "dg-31"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 11: Infografías */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Infografías
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["dg-32", "dg-33", "dg-34", "dg-35"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>
                  </div>
                ) : selectedCategory === "animation" ? (
                  /* Custom Grid Layout for animation with subtitles/groups */
                  <div className="space-y-16">
                    {/* Group 2: Animación 3D */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Animación 3D
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["ad-36", "ad-6", "ad-7", "ad-8", "ad-11", "ad-9", "ad-5", "ad-10"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 3: Animación 2D */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Animación 2D
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["ad-12", "ad-13", "ad-14", "ad-15"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 4: Motion Graphics */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        Motion Graphics
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["ad-16", "ad-17", "ad-18", "ad-19", "ad-20", "ad-21", "ad-22", "ad-23", "ad-24", "ad-25", "ad-26", "ad-28", "ad-29", "ad-30"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>

                    {/* Group 5: VFX */}
                    <div className="space-y-6">
                      <p className="font-mono text-sm tracking-widest text-[#ff5f1f] font-semibold border-b border-[#ff5f1f]/20 pb-2 text-center">
                        VFX
                      </p>
                      <motion.div 
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {currentCategoryData?.items
                          .filter(item => ["ad-31", "ad-32", "ad-33", "ad-34", "ad-35"].includes(item.id))
                          .map((item) => {
                            const originalIndex = currentCategoryData.items.findIndex(x => x.id === item.id);
                            return renderPortfolioItem(item, originalIndex);
                          })}
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  /* Normal Grid Layout for other categories */
                  <motion.div 
                    variants={gridContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {currentCategoryData?.items.map((item, index) => renderPortfolioItem(item, index))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Lightbox / Gallery view popup */}
      <MediaLightbox
        isOpen={lightboxState.isOpen}
        items={lightboxState.items}
        currentIndex={lightboxState.currentIndex}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
        onNavigate={(index) => setLightboxState((prev) => ({ ...prev, currentIndex: index }))}
      />

      {/* PDF Viewer Inline Overlay */}
      <AnimatePresence>
        {activePdf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePdf(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl h-[80vh] bg-[#180b07] border border-primary-container rounded-2xl flex flex-col overflow-hidden shadow-2xl z-10 p-6"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-red-500 animate-pulse" />
                  <span className="font-syne text-sm font-semibold text-white tracking-wider">
                    {activePdf.title}
                  </span>
                </div>
                <button
                  onClick={() => setActivePdf(null)}
                  className="p-1.5 border border-[#ff5f1f]/50 rounded-full bg-black/60 text-[#ff5f1f] hover:-translate-y-0.5 hover:bg-[#ff5f1f]/25 hover:text-white hover:shadow-[0_0_20px_rgba(255,95,31,0.4)] hover:border-[#ff5f1f] transition-all duration-300 cursor-pointer flex items-center justify-center"
                  title="Cerrar visor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PDF embed */}
              <div className="flex-grow rounded-xl bg-white/5 overflow-hidden border border-white/5">
                <iframe
                  src={activePdf.url}
                  className="w-full h-full bg-white/90"
                  title={activePdf.title}
                />
              </div>

              <div className="mt-4 flex justify-end items-center">
                <button
                  onClick={() => downloadFile(activePdf.url, `${activePdf.title}.pdf`)}
                  className="px-4 py-2 border border-[#ff5f1f]/50 rounded-xl bg-black/60 text-[#ff5f1f] hover:-translate-y-0.5 hover:bg-[#ff5f1f]/25 hover:text-white hover:shadow-[0_0_20px_rgba(255,95,31,0.4)] hover:border-[#ff5f1f] transition-all duration-300 cursor-pointer flex items-center gap-2 font-syne text-xs tracking-wider"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
