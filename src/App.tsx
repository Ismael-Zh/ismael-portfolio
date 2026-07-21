import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  Mail,
  Linkedin,
  FileText,
  Download,
  Menu,
  X,
  ArrowDown,
  Sparkles,
  Award,
  BookOpen,
  ArrowUpRight
} from "lucide-react";
import { PERSONAL_BIO, CONTACT_INFO } from "./data";
import ShaderBackground from "./components/ShaderBackground";
import PortfolioBlock from "./components/PortfolioBlock";
import CvModal from "./components/CvModal";

// Dynamic fluid motion animation variants for beautiful scroll-driven entry effects
const sectionContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 18,
    },
  },
};

const slideLeftVariants = {
  hidden: { opacity: 0, x: -70 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 16,
    },
  },
};

const slideRightVariants = {
  hidden: { opacity: 0, x: 70 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 16,
    },
  },
};

const popInVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 15,
    },
  },
};

export default function App() {
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "proyectos", "sobre-mi", "cv", "contacto"];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen text-[#f9dcd4] bg-[#1e100b] overflow-x-hidden selection:bg-primary-container selection:text-black">
      {/* Dynamic Animated WebGL Shader Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <ShaderBackground />
      </div>

      {/* FIXED HEADER & NAVIGATION BAR */}
      <header className="fixed top-0 inset-x-0 h-20 bg-black/45 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-6 md:px-16 transition-all duration-300">
        <div 
          onClick={() => scrollToSection("home")}
          className="text-xl md:text-2xl font-syne font-semibold tracking-normal text-[#ff5f1f] hover-text-glow-orange cursor-pointer select-none transition-all duration-300 hover:-translate-y-0.5"
        >
          IZ
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { id: "proyectos", label: "Portafolio" },
            { id: "sobre-mi", label: "Sobre Mí" },
            { id: "cv", label: "CV" },
            { id: "contacto", label: "Contacto" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`font-mono text-sm tracking-wider px-4 py-2 transition-all duration-300 relative group cursor-pointer hover-text-glow-orange ${
                activeSection === item.id 
                  ? "text-primary font-semibold text-glow-orange" 
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              <span className="relative pb-1 inline-block">
                {item.label}
                
                {/* Animated underline */}
                {activeSection === item.id ? (
                  <motion.div 
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_#ff5f1f]"
                  />
                ) : (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff5f1f] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out shadow-[0_0_8px_#ff5f1f]" />
                )}
              </span>
            </button>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 md:hidden text-on-surface hover:text-primary transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* MOBILE FLYOUT NAV DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-30 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-[#180b07] border-l border-primary-container/20 p-8 z-40 md:hidden flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-8 pt-16">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="font-syne text-lg font-semibold text-white">Menú</h4>
                </div>
                <nav className="flex flex-col gap-3">
                  {[
                    { id: "proyectos", label: "Portafolio" },
                    { id: "sobre-mi", label: "Sobre Mí" },
                    { id: "cv", label: "CV / Trayectoria" },
                    { id: "contacto", label: "Contacto" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left font-mono text-sm py-2.5 px-4 rounded-xl border transition-all duration-300 ${
                        activeSection === item.id
                          ? "border-primary-container text-primary bg-primary-container/10 font-semibold"
                          : "border-transparent text-on-surface-variant hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-white/5 pt-6">
                <span className="font-mono text-[9px] text-on-surface-variant block mb-2">
                  ISMAEL ZHINDÓN
                </span>
                <p className="font-mono text-[10px] text-primary">
                  © 2026 Digital Art & Animation
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <main className="relative">

        {/* HERO SECTION / BIENVENIDA */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 select-none"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionContainerVariants}
            className="text-center w-full max-w-5xl space-y-8"
          >
            <motion.h1
              variants={titleVariants}
              className="font-syne text-[38px] min-[380px]:text-[48px] min-[480px]:text-[56px] sm:text-[80px] md:text-[100px] font-semibold tracking-normal leading-[0.95] text-white"
            >
              Ismael Zhindón
            </motion.h1>

            <motion.div
              variants={popInVariants}
              className="inline-block relative px-4 sm:px-8 py-2.5 sm:py-4 bg-[#180b07]/30 backdrop-blur-xl rounded-2xl"
            >
              <p className="font-sans text-[9px] min-[380px]:text-[11px] sm:text-[14px] md:text-[18px] w-auto md:w-[693.5px] max-w-full tracking-[0.15em] min-[380px]:tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.45em] uppercase font-semibold color-sweep-text whitespace-nowrap">
                DISEÑADOR DE ANIMACIÓN Y ARTE DIGITAL
              </p>
            </motion.div>
          </motion.div>

          {/* Mouse/Scroll helper icon at bottom */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8,
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            onClick={() => scrollToSection("proyectos")}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer p-3 border border-white/10 rounded-full hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_#ff5f1f]"
          >
            <ArrowDown className="w-5 h-5 text-primary" />
          </motion.div>
        </section>

        {/* INTERACTIVE PORTFOLIO SECTION */}
        <PortfolioBlock />

        {/* STAGGERED DECORATIVE SEPARATOR */}
        <div className="w-full py-12 flex items-center justify-center relative">
          <div className="w-[85%] h-[1px] opacity-50 bg-gradient-to-r from-transparent via-[#9b4de6] to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-[#9b4de6]/40 bg-[#9b4de6] shadow-[0_0_12px_rgba(155,77,230,0.8)]" />
        </div>

        {/* SOBRE MÍ SECTION */}
        <section
          id="sobre-mi"
          className="min-h-screen py-24 md:py-32 px-4 md:px-12 flex items-center bg-transparent relative"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={sectionContainerVariants}
            className="max-w-7xl mx-auto w-full"
          >
            <div className="border border-white/5 rounded-3xl bg-black/30 backdrop-blur-xl p-8 md:p-16 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              
              {/* Portrait container on Left */}
              <motion.div 
                variants={slideLeftVariants}
                className="md:col-span-5 relative group"
              >
                <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 rounded-tl-xl border-primary-container opacity-60 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 rounded-br-xl border-secondary-container opacity-60 group-hover:scale-105 transition-transform duration-300" />
                
                <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl relative">
                  <img
                    src={PERSONAL_BIO.image}
                    alt="Ismael Zhindón portrait"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-container/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>

              {/* Bio details on Right */}
              <motion.div 
                variants={slideRightVariants}
                className="md:col-span-7 space-y-6"
              >
                <h2 className="font-syne text-4xl md:text-5xl font-semibold text-white tracking-tight">
                  Sobre Mí
                </h2>

                <div className="space-y-4 font-sans text-base md:text-lg text-on-surface-variant leading-relaxed font-light">
                  <p>
                    {PERSONAL_BIO.text}
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* STAGGERED DECORATIVE SEPARATOR */}
        <div className="w-full py-12 flex items-center justify-center relative">
          <div className="w-[85%] h-[1px] opacity-50 bg-gradient-to-r from-transparent via-[#9b4de6] to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-[#9b4de6]/40 bg-[#9b4de6] shadow-[0_0_12px_rgba(155,77,230,0.8)]" />
        </div>

        {/* CV / TRAYECTORIA SECCIÓN */}
        <section
          id="cv"
          className="min-h-screen py-24 md:py-32 px-4 md:px-12 bg-transparent flex items-center relative"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={sectionContainerVariants}
            className="max-w-4xl mx-auto w-full relative z-10"
          >
            <motion.div 
              variants={popInVariants}
              className="border border-white/5 p-8 md:p-16 text-center flex flex-col items-center gap-6 bg-black/45 backdrop-blur-2xl rounded-2xl shadow-3xl hover:border-primary-container/20 transition-all duration-500"
            >
              
              <div className="w-16 h-16 rounded-full border border-primary-container/30 bg-primary-container/5 flex items-center justify-center mb-2 animate-bounce">
                <FileText className="w-8 h-8 text-primary" />
              </div>

              <h2 className="font-syne text-4xl md:text-5xl font-semibold tracking-tight text-white leading-none">
                Trayectoria Profesional
              </h2>

              <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                Explora mi historial académico, experiencia laboral, habilidades técnicas y las herramientas que domino.
              </p>

              <button
                onClick={() => {
                  setIsCvOpen(true);
                  if (typeof (window as any).pulseShader === "function") {
                    (window as any).pulseShader();
                  }
                }}
                className="group relative inline-flex items-center gap-3 bg-primary-container text-white px-8 py-4.5 font-mono text-xs tracking-widest font-semibold transition-all duration-300 rounded-lg hover:-translate-y-0.5 hover:shadow-[0_0_20px_#ff5f1f] cursor-pointer"
              >
                MIRAR / DESCARGAR CV COMPLETO
                <Download className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* STAGGERED DECORATIVE SEPARATOR */}
        <div className="w-full py-12 flex items-center justify-center relative">
          <div className="w-[85%] h-[1px] opacity-50 bg-gradient-to-r from-transparent via-[#9b4de6] to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-[#9b4de6]/40 bg-[#9b4de6] shadow-[0_0_12px_rgba(155,77,230,0.8)]" />
        </div>

        {/* CONTACTO SECTION */}
        <section
          id="contacto"
          className="min-h-screen py-24 md:py-32 px-4 md:px-12 flex flex-col justify-center bg-transparent relative"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={sectionContainerVariants}
            className="max-w-7xl mx-auto w-full"
          >
            <motion.div variants={titleVariants} className="text-center mb-16">
              <h2 className="font-syne text-4xl md:text-6xl font-semibold text-white tracking-tight mt-2">
                Contacto
              </h2>
            </motion.div>

            <motion.div 
              variants={sectionContainerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              
              {/* WhatsApp Card */}
              <motion.a
                variants={titleVariants}
                href={CONTACT_INFO.whatsapp.link}
                target="_blank"
                rel="noreferrer"
                className="bg-black/30 border border-white/5 p-10 flex flex-col items-center text-center group transition-all duration-500 backdrop-blur-xl rounded-2xl hover:border-[#25D366]/30 hover:shadow-[0_0_30px_rgba(37,211,102,0.15)]"
              >
                <div className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center mb-6 bg-[#180b07] group-hover:border-[#25D366] group-hover:bg-[#25D366]/5 transition-all duration-300">
                  <svg 
                    className="w-6 h-6 text-[#25D366] group-hover:scale-110 transition-transform" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.07.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase mb-1">
                  WhatsApp
                </span>
                <span className="font-syne text-lg md:text-xl text-white group-hover:text-[#25D366] transition-colors">
                  {CONTACT_INFO.whatsapp.label}
                </span>
                <span className="text-[10px] text-on-surface-variant/60 font-sans mt-2 flex items-center gap-1">
                  Chatea directo <ArrowUpRight className="w-3 h-3" />
                </span>
              </motion.a>

              {/* Email Card */}
              <motion.a
                variants={titleVariants}
                href={CONTACT_INFO.email.link}
                className="bg-black/30 border border-white/5 p-10 flex flex-col items-center text-center group transition-all duration-500 backdrop-blur-xl rounded-2xl hover:border-[#EA4335]/30 hover:shadow-[0_0_30px_rgba(234,67,53,0.15)]"
              >
                <div className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center mb-6 bg-[#180b07] group-hover:border-[#EA4335] group-hover:bg-[#EA4335]/5 transition-all duration-300">
                  <svg 
                    className="w-6 h-6 text-[#EA4335] group-hover:scale-110 transition-transform" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 5.457v13.086c0 .822-.667 1.457-1.457 1.457H20.74V9.33L12 14.802 3.26 9.33v10.67H1.457C.667 20 0 19.343 0 18.543V5.457c0-.822.667-1.457 1.457-1.457H3.43L12 9.53l8.57-5.53h1.973c.822 0 1.457.667 1.457 1.457z" />
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase mb-1">
                  Correo Electrónico
                </span>
                <span className="font-syne text-lg md:text-xl text-white group-hover:text-[#EA4335] transition-colors truncate max-w-full">
                  {CONTACT_INFO.email.label}
                </span>
                <span className="text-[10px] text-on-surface-variant/60 font-sans mt-2 flex items-center gap-1">
                  Enviar Mensaje <ArrowUpRight className="w-3 h-3" />
                </span>
              </motion.a>

              {/* LinkedIn Card */}
              <motion.a
                variants={titleVariants}
                href={CONTACT_INFO.linkedin.link}
                target="_blank"
                rel="noreferrer"
                className="bg-black/30 border border-white/5 p-10 flex flex-col items-center text-center group transition-all duration-500 backdrop-blur-xl rounded-2xl hover:border-[#0077B5]/30 hover:shadow-[0_0_30px_rgba(0,119,181,0.15)]"
              >
                <div className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center mb-6 bg-[#180b07] group-hover:border-[#0077B5] group-hover:bg-[#0077B5]/5 transition-all duration-300">
                  <svg 
                    className="w-6 h-6 text-[#0077B5] group-hover:scale-110 transition-transform" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase mb-1">
                  LinkedIn
                </span>
                <span className="font-syne text-lg md:text-xl text-white group-hover:text-[#0077B5] transition-colors">
                  {CONTACT_INFO.linkedin.label}
                </span>
                <span className="text-[10px] text-on-surface-variant/60 font-sans mt-2 flex items-center gap-1">
                  Ver Perfil Profesional <ArrowUpRight className="w-3 h-3" />
                </span>
              </motion.a>

            </motion.div>
          </motion.div>

          {/* REAL FOOTER */}
          <footer className="w-full py-12 border-t border-white/5 flex flex-col items-center justify-center gap-4 mt-24">
            <div className="font-mono text-[11px] text-on-surface-variant/70 text-center">
              © 2026 Ismael Zhindón. Todos los derechos reservados.
            </div>
          </footer>
        </section>

      </main>

      {/* DETAILED RESUME/CV POPUP MODAL */}
      <CvModal isOpen={isCvOpen} onClose={() => setIsCvOpen(false)} />
    </div>
  );
}
