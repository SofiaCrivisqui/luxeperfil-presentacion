/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, animate, useMotionValue, useTransform, useInView } from 'motion/react';
import { 
  Instagram, 
  TrendingUp, 
  Briefcase, 
  Image as ImageIcon, 
  Target, 
  ChevronDown,
  BarChart3,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Users,
  Plus,
  Info,
  Smartphone,
  Building2
} from 'lucide-react';

// --- Components ---

const Slide = ({ children, id, className = "" }: { children: React.ReactNode, id: string, className?: string }) => {
  return (
    <section 
      id={id}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center snap-start px-6 md:px-32 py-20 ${className}`}
    >
      {children}
    </section>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  key?: React.Key;
}

const FadeIn = ({ children, delay = 0, direction = "up", className = "" }: FadeInProps) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      scale: 1,
      transition: { 
        duration: 1.2, 
        delay, 
        ease: [0.16, 1, 0.3, 1] // Custom quint ease
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Metric = ({ value, label, sublabel }: { value: string, label: string, sublabel?: string }) => (
  <div className="flex flex-col group">
    <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight text-stone-900 mb-4 transition-transform duration-700 group-hover:translate-x-2">{value}</span>
    <div className="h-px w-8 bg-accent-600/40 mb-4 transition-all duration-700 group-hover:w-16" />
    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-stone-400 font-semibold">{label}</span>
    {sublabel && <span className="text-[8px] md:text-[9px] text-stone-300 mt-2 font-medium italic">{sublabel}</span>}
  </div>
);

const AnimatedCounter = ({ from, to, duration = 6, className = "" }: { from: number, to: number, duration?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString('de-DE'));

  useEffect(() => {
    let controls: any;
    if (isInView) {
      controls = animate(count, [from, to], {
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 2,
        repeatType: "loop"
      });
    } else {
      count.set(from);
    }
    return () => controls?.stop();
  }, [isInView, to, from, duration, count]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
};

const PlusParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.5, 0.8],
            y: [0, -400],
            x: [0, (i % 2 === 0 ? 30 : -30)],
            transition: {
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }
          }}
          style={{ 
            left: `${10 + (i * 7.5)}%`, 
            bottom: "-10%" 
          }}
          className="absolute"
        >
          <Plus className="w-6 h-6 text-accent-500" strokeWidth={3} />
        </motion.div>
      ))}
    </div>
  );
};

const GlossaryTerm = ({ term, definition }: { term: string, definition: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center group cursor-help ml-1">
      <span className="border-b border-dotted border-stone-400 group-hover:border-accent-600 group-hover:text-accent-700 transition-all">{term}</span>
      <Info 
        className="w-3 h-3 ml-1 text-stone-300 group-hover:text-accent-600 transition-colors" 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      />
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-stone-900 text-white text-[10px] leading-relaxed rounded-sm z-[100] shadow-2xl border border-stone-800"
        >
          {definition}
          <div className="absolute top-full left-4 w-2 h-2 bg-stone-900 border-r border-b border-stone-800 rotate-45 -mt-1" />
        </motion.div>
      )}
    </span>
  );
};

const ImageComparer = ({ before, after }: { before: string, after: string }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video md:aspect-[21/9] overflow-hidden group cursor-ew-resize select-none border border-stone-900"
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
   {/* After Image */}
      <img src={after} className="absolute inset-0 w-full h-full object-cover " alt="After" referrerPolicy="no-referrer" />
      
      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full  overflow-hidden" 
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={before} className="absolute inset-0 w-full h-full object-cover" alt="Before" referrerPolicy="no-referrer" />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 w-1 bg-accent-600 z-20 group-hover:w-1.5 transition-all"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-accent-600 text-white flex items-center justify-center shadow-lg">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-3 bg-white/40" />
            <div className="w-0.5 h-3 bg-white" />
            <div className="w-0.5 h-3 bg-white/40" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-6 left-6 text-[10px] uppercase tracking-widest text-white/40 font-bold z-10">Básico / Genérico</div>
      <div className="absolute bottom-6 right-6 text-[10px] uppercase tracking-widest text-accent-500 font-bold z-10 text-right">Premium / Estratégico</div>
    </div>
  );
};
const Card = ({ title, description, icon: Icon }: { title: string, description: string, icon?: any }) => (
  <div className="relative bg-white p-10 border border-stone-100/60 hover:border-stone-200 transition-all duration-700 group overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-0 bg-accent-600/20 group-hover:h-full transition-all duration-700" />
    {Icon && <Icon className="w-5 h-5 mb-8 text-stone-300 group-hover:text-accent-700 transition-colors duration-500" strokeWidth={1} />}
    <h3 className="text-xl font-light mb-4 text-stone-900 tracking-tight">{title}</h3>
    <p className="text-sm text-stone-400 leading-relaxed font-light">{description}</p>
  </div>
);

const Quote = ({ text, subtext, className = "" }: { text: string, subtext?: string, className?: string }) => (
  <div className={`max-w-3xl border-l border-stone-200 pl-12 py-4 ${className}`}>
    <p className="text-3xl md:text-4xl font-extralight italic text-stone-800 leading-[1.15] tracking-tight">
      {text}
    </p>
    {subtext && (
      <div className="flex items-center gap-4 mt-8">
        <div className="w-8 h-px bg-accent-600/30" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">{subtext}</p>
      </div>
    )}
  </div>
);

// --- Main App ---

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const slides = [
    "portada", "estrategia", "ejes", "instagram", "eficiencia", "metricas", 
    "comunidad", "contenido", "ia", "competencia", "comercial", "distribucion",
    "impacto", "pasos"
  ];

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      threshold: 0.5,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = slides.indexOf(entry.target.id);
          if (index !== -1) {
            setActiveSlide(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe all sections
    const sections = containerRef.current?.querySelectorAll('section');
    sections?.forEach((section) => observer.observe(section));

    return () => {
      sections?.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [slides]);

  return (
    <div className="bg-[#fdfdfd] text-[#1a1a1a] font-sans selection:bg-accent-100 selection:text-accent-900">
      
      {/* Progress Indicator (Lateral) */}
      <div className="fixed right-12 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-6 items-end group">
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => {
              const element = document.getElementById(slide);
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-4 group/btn"
            aria-label={`Ir al slide ${i + 1}`}
          >
            <span className={`text-[9px] uppercase tracking-[0.3em] font-bold transition-all duration-500 opacity-0 -translate-x-4 group-hover:opacity-40 group-hover:translate-x-0 ${activeSlide === i ? '!opacity-100 text-accent-700' : 'text-stone-400'}`}>
              {slide}
            </span>
            <div className={`transition-all duration-700 rounded-full border ${
              activeSlide === i 
                ? 'w-3 h-3 bg-accent-600 border-accent-600 scale-125' 
                : 'w-1.5 h-1.5 bg-transparent border-stone-300 group-hover/btn:border-stone-500'
            }`} />
          </button>
        ))}
      </div>

      {/* Top Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent-600 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Main Container */}
      <main 
        ref={containerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar"
      >
        
        {/* SLIDE 1 — PORTADA */}
        <Slide id="portada" className="bg-[#fcfcfc]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-px h-full bg-stone-100/50" />
            <div className="absolute top-0 left-2/4 w-px h-full bg-stone-100/50" />
            <div className="absolute top-0 left-3/4 w-px h-full bg-stone-100/50" />
          </div>

          <div className="max-w-6xl w-full text-center relative z-10">
            <FadeIn delay={0.2} className="mb-16">
              <div className="flex flex-col items-center">
                <div className="mb-10 flex items-center justify-center">
                  <div className="w-20 h-20 p-2 border border-stone-200">
                    <img 
                      src="/public/imagenes/isotipo.png"
                      alt="Luxe Perfil Isotipo" 
                      className="w-full h-full object-contain filter grayscale brightness-50"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-px bg-stone-200" />
                  <span className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-bold">Marketing & Comunicación</span>
                  <div className="w-12 h-px bg-stone-200" />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <h1 className="text-8xl md:text-[11.5rem] font-thin tracking-tighter text-stone-900 mb-10 leading-[0.8]">
                <span className="font-black">LUXE</span> PERFIL<br />
                <span className="text-accent-500/10 font-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 blur-3xl w-full">ARGENTINA</span>
                <span className="text-stone-200 font-thin">ARGENTINA</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.6}>
              <p className="text-lg md:text-xl text-stone-400 max-w-xl mx-auto font-light leading-relaxed tracking-wide">
                <GlossaryTerm term="Posicionamiento" definition="Cómo logramos que el cliente piense en nosotros antes que en nadie cuando necesita una persiana premium." />, comunicación, producción visual, soporte comercial y resultados.
              </p>
            </FadeIn>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1.5 }}
              className="absolute -bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
              <div className="w-px h-16 bg-gradient-to-b from-accent-600/60 to-transparent" />
              <span className="text-[9px] uppercase tracking-[0.4em] text-stone-300 font-bold">Scroll</span>
            </motion.div>
          </div>
        </Slide>

        {/* SLIDE 2 — ROL ESTRATÉGICO */}
        <Slide id="estrategia">
          <div className="max-w-6xl w-full grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-7">
              <FadeIn direction="right">
                <h2 className="text-5xl md:text-7xl font-thin tracking-tight leading-[1.05] mb-12 text-stone-900">
                  <span className="font-black uppercase">Marketing</span> como <span className="text-stone-300 italic">construcción</span> de marca
                </h2>
              </FadeIn>
              <FadeIn direction="right" delay={0.2}>
                <div className="space-y-8 max-w-lg">
                  <p className="text-stone-500 leading-relaxed text-lg font-light">
                    Durante este período, el área de Marketing y Comunicación trabajó sobre un objetivo claro: elevar la forma en que Luxe Perfil se presenta, se comunica y se percibe.
                  </p>
                  <p className="text-stone-400 leading-relaxed font-light">
                    No solo se avanzó en publicaciones y piezas visuales, sino también en un trabajo más profundo de orden, criterio, discurso, estética y acompañamiento al área comercial.
                  </p>
                </div>
              </FadeIn>
            </div>
            <div className="md:col-span-5">
              <FadeIn direction="left" delay={0.4}>
                <Quote 
                  text="No se trató solo de comunicar productos. Se trabajó en construir valor." 
                  subtext="Visión Estratégica"
                  className="bg-stone-50/50 p-12 border-none"
                />
              </FadeIn>
            </div>
          </div>
        </Slide>

        {/* SLIDE 3 — EJES DE TRABAJO */}
        <Slide id="ejes" className="bg-[#fcfcfc]">
          <div className="max-w-6xl w-full">
            <FadeIn className="text-center mb-20">
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-400 font-bold mb-4">
                <span className="font-black text-accent-700">Estrategia</span> Operativa
              </h2>
              <div className="w-12 h-px bg-accent-600/30 mx-auto" />
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100 border border-stone-100">
              <FadeIn delay={0.1}><Card icon={Award} title="Comunicación de marca" description="Elevación del discurso y coherencia estética en todos los puntos de contacto." /></FadeIn>
              <FadeIn delay={0.2}><Card icon={Instagram} title="Instagram y contenido" description="Gestión profesional de comunidad y alcance estratégico de audiencias." /></FadeIn>
              <FadeIn delay={0.3}><Card icon={Target} title="Campañas por producto" description="Foco específico en lanzamientos y soluciones técnicas diferenciales." /></FadeIn>
              <FadeIn delay={0.4}><Card icon={ImageIcon} title="Producción visual con IA" description="Generación de escenas premium con alto nivel de realismo y detalle." /></FadeIn>
              <FadeIn delay={0.5}><Card icon={Briefcase} title="Soporte comercial" description="Herramientas concretas para facilitar el cierre de ventas y asesoramiento." /></FadeIn>
              <FadeIn delay={0.6}><Card icon={TrendingUp} title="Posicionamiento" description="Construcción de autoridad en el mercado de arquitectura y construcción." /></FadeIn>
            </div>
          </div>
        </Slide>

        {/* SLIDE 4 — RESULTADOS INSTAGRAM */}
        <Slide id="instagram">
          <div className="max-w-6xl w-full">
            <FadeIn>
              <div className="flex items-end justify-between mb-20 border-b border-stone-100 pb-8">
                <h2 className="text-5xl font-thin tracking-tight">
                  <span className="font-black uppercase">Resultados</span> <span className="text-stone-300 italic">Instagram</span>
                </h2>
                <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-2">Últimos 60 días</span>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12 md:gap-x-16 mb-16 md:mb-24">
              <FadeIn delay={0.1}><Metric value="280.624" label="Visualizaciones" /></FadeIn>
              <FadeIn delay={0.2}><Metric value="93.891" label="Espectadores" sublabel="Personas alcanzadas" /></FadeIn>
              <FadeIn delay={0.3}><Metric value="1.725" label="Interacciones" sublabel="Deseo real generado" /></FadeIn>
              <FadeIn delay={0.4}><Metric value="1.866" label="Seguidores" sublabel="Meta alcanzada" /></FadeIn>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
              <FadeIn direction="right" delay={0.5}>
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-stone-100 pb-4">
                    <span className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">Visualizaciones desde anuncios</span>
                    <span className="text-2xl font-light text-stone-900">85,6%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-stone-100 pb-4">
                    <span className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">Interacciones desde anuncios</span>
                    <span className="text-2xl font-light text-stone-900">49,7%</span>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction="left" delay={0.6}>
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-stone-100 pb-4">
                    <span className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">Alcance a no seguidores</span>
                    <span className="text-2xl font-light text-stone-900">88,9%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-stone-100 pb-4">
                    <span className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">Interacciones de no seguidores</span>
                    <span className="text-2xl font-light text-stone-900">53,5%</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </Slide>

        <Slide id="eficiencia" className="bg-white">
          <div className="max-w-6xl w-full">
            <FadeIn>
              <div className="flex flex-col mb-20">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent-700 font-bold mb-4">Paridad Competitiva</span>
                <h2 className="text-5xl md:text-7xl font-thin tracking-tight leading-none">
                  Efectividad <span className="font-black">vs</span> Volumen
                </h2>
                <div className="mt-4">
                  <GlossaryTerm term="Paridad Competitiva" definition="Estar a la misma altura de audiencia que nuestro competidor principal, pero con mayor eficiencia." />
                </div>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-px bg-stone-100 border border-stone-100">
              {/* COMPETIDOR */}
              <FadeIn direction="right" className="bg-stone-50/50 p-12 md:p-20 relative group">
                <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Target className="w-12 h-12 text-stone-400" />
                </div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-16">Roller Star (Competidor)</h4>
                
                <div className="space-y-12">
                  <div>
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-6xl md:text-7xl font-extralight text-stone-900 tracking-tighter">1.866</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Seguidores</span>
                  </div>

                  <div className="h-px w-full bg-stone-200" />

                  <div>
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-6xl md:text-7xl font-extralight text-stone-300 tracking-tighter">709</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-4 block">Publicaciones</span>
                    <div className="w-full h-1 bg-stone-200">
                      <motion.div 
                        initial={{ width: 0 }} 
                        whileInView={{ width: '100%' }} 
                        transition={{ duration: 1.5, ease: "easeOut" }} 
                        className="h-full bg-stone-300" 
                      />
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* LUXE PERFIL */}
              <FadeIn direction="left" className="bg-stone-950 p-12 md:p-20 relative overflow-hidden group">
                <PlusParticles />
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-600/10 blur-[100px]" />
                <div className="absolute top-10 right-10">
                  <Zap className="w-12 h-12 text-accent-600/40 animate-pulse" />
                </div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent-600 font-bold mb-16">Luxe Perfil (Estrategia)</h4>
                
                <div className="space-y-12 relative z-10">
                  <div>
                    <div className="flex items-baseline gap-4 mb-2">
                      <AnimatedCounter from={467} to={1866} className="text-6xl md:text-7xl font-black text-white tracking-tighter" />
                      <span className="text-accent-500 font-bold text-sm tracking-widest uppercase">Paridad</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Seguidores</span>
                  </div>

                  <div className="h-px w-full bg-stone-800" />

                  <div>
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-6xl md:text-7xl font-thin text-accent-500 tracking-tighter">133</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-4 block">Publicaciones</span>
                    <div className="w-full h-1 bg-stone-800">
                      <motion.div 
                        initial={{ width: 0 }} 
                        whileInView={{ width: '18.7%' }} 
                        transition={{ duration: 1.5, ease: "easeOut" }} 
                        className="h-full bg-accent-600" 
                      />
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.5} className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12 bg-stone-50 p-12 md:p-16 border border-stone-100">
              <div className="max-w-md">
                <p className="text-xl md:text-2xl font-extralight text-stone-800 leading-tight tracking-tight italic">
                  "Se alcanzó la misma presencia de audiencia con un <span className="text-accent-700 font-normal">81% menos</span> de contenido publicado."
                </p>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-2">Índice de Eficiencia</span>
                <span className="text-5xl md:text-6xl font-black text-stone-900 tracking-tighter">5.3x</span>
                <span className="text-[10px] uppercase tracking-widest text-accent-600 font-bold">Más impacto por post</span>
              </div>
            </FadeIn>
          </div>
        </Slide>

        {/* SLIDE 5 — LECTURA ESTRATÉGICA */}
        <Slide id="metricas" className="bg-stone-950 text-white">
          <div className="max-w-6xl w-full">
            <FadeIn>
              <div className="flex items-center gap-6 mb-20">
                <div className="w-16 h-px bg-accent-600" />
                <h2 className="text-5xl font-thin tracking-tight text-white">
                  <span className="font-black uppercase">Lectura</span> <span className="text-stone-500 italic">Estratégica</span>
                </h2>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-2 gap-24">
              <div className="space-y-16">
                <FadeIn direction="right" delay={0.2}>
                  <div className="flex gap-8 items-start group">
                    <span className="text-stone-700 font-mono text-xs mt-1 group-hover:text-accent-600 transition-colors">01</span>
                    <div>
                      <h4 className="text-xl font-light mb-4 text-stone-200">Fuerte llegada a públicos nuevos</h4>
                      <p className="text-stone-500 text-sm leading-relaxed font-light">El 88,9% del alcance proviene de personas que aún no conocían la marca, validando la estrategia de descubrimiento.</p>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn direction="right" delay={0.3}>
                  <div className="flex gap-8 items-start group">
                    <span className="text-stone-700 font-mono text-xs mt-1 group-hover:text-accent-600 transition-colors">02</span>
                    <div>
                      <h4 className="text-xl font-light mb-4 text-stone-200">Instalación visual</h4>
                      <p className="text-stone-500 text-sm leading-relaxed font-light">Las publicaciones (71,3% visualizaciones) son el formato más fuerte para fijar la nueva estética editorial.</p>
                    </div>
                  </div>
                </FadeIn>
              </div>
              <div className="bg-stone-900/30 p-16 border border-stone-800/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-600/5 blur-[100px]" />
                <FadeIn delay={0.4}>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-stone-600 mb-12 font-bold">Distribución de Interacciones</h4>
                  <div className="space-y-10">
                    <div>
                      <div className="flex justify-between text-xs mb-3 uppercase tracking-widest text-stone-400"><span>Publicaciones</span> <span className="text-stone-200">63,9%</span></div>
                      <div className="w-full h-px bg-stone-800"><motion.div initial={{width: 0}} whileInView={{width: '63.9%'}} transition={{duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1]}} className="h-full bg-accent-600" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-3 uppercase tracking-widest text-stone-400"><span>Reels</span> <span className="text-stone-200">23,5%</span></div>
                      <div className="w-full h-px bg-stone-800"><motion.div initial={{width: 0}} whileInView={{width: '23.5%'}} transition={{duration: 2, delay: 0.6, ease: [0.16, 1, 0.3, 1]}} className="h-full bg-stone-600" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-3 uppercase tracking-widest text-stone-400"><span>Historias</span> <span className="text-stone-200">12,6%</span></div>
                      <div className="w-full h-px bg-stone-800"><motion.div initial={{width: 0}} whileInView={{width: '12.6%'}} transition={{duration: 2, delay: 0.7, ease: [0.16, 1, 0.3, 1]}} className="h-full bg-stone-700" /></div>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={1} className="mt-16">
                  <p className="text-2xl font-extralight text-accent-100/80 leading-tight italic tracking-tight">"No hubo solo alcance. Hubo capacidad de instalación visual y respuesta."</p>
                </FadeIn>
              </div>
            </div>
          </div>
        </Slide>

        {/* SLIDE 6 — EVOLUCIÓN COMUNIDAD */}
        <Slide id="comunidad">
          <div className="max-w-6xl w-full">
            <FadeIn>
              <div className="flex items-center gap-6 mb-20">
                <h2 className="text-5xl font-thin tracking-tight">
                  <span className="font-black uppercase">Evolución</span> de <span className="text-stone-300 italic">Comunidad</span>
                </h2>
                <div className="flex-1 h-px bg-stone-100" />
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-12 gap-20 items-end">
              <div className="md:col-span-8">
                <FadeIn direction="right">
                  <div className="flex items-baseline gap-8 mb-12">
                    <span className="text-[10rem] font-thin tracking-tighter leading-none text-stone-900">1.866</span>
                    <div className="flex flex-col">
                      <span className="text-accent-600 text-3xl font-light">+300%</span>
                      <span className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">Crecimiento Total</span>
                    </div>
                  </div>
                  <p className="text-stone-400 text-lg font-light leading-relaxed max-w-md">
                    Se logró atraer comunidad nueva con una pérdida mínima, señal de que el crecimiento fue genuino y bien sostenido.
                  </p>
                </FadeIn>
              </div>
              <div className="md:col-span-4 space-y-12 border-l border-stone-100 pl-16 py-8">
                <FadeIn delay={0.2}>
                  <div className="group">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-300 block mb-2 font-bold group-hover:text-stone-400 transition-colors">Seguidores Iniciales</span>
                    <span className="text-4xl font-extralight text-stone-300">467</span>
                  </div>
                </FadeIn>
                <FadeIn delay={0.3}>
                  <div className="group">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-300 block mb-2 font-bold group-hover:text-stone-400 transition-colors">Nuevos Seguidores</span>
                    <span className="text-4xl font-extralight text-accent-700/80">1.399</span>
                  </div>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <div className="group">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-300 block mb-2 font-bold group-hover:text-stone-400 transition-colors">Total Actual</span>
                    <span className="text-4xl font-extralight text-stone-900">1.866</span>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </Slide>

        {/* SLIDE 7 — CONTENIDO Y POSICIONAMIENTO */}
        <Slide id="contenido" className="bg-[#fcfcfc]">
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <FadeIn direction="right">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-thin tracking-tight mb-8 lg:mb-12 leading-tight">
                De comunicar producto a <br />
                <span className="font-black uppercase text-accent-800">comunicar valor</span>
              </h2>
              <div className="space-y-6 lg:space-y-8">
                <p className="text-stone-500 font-light leading-relaxed text-base lg:text-lg">
                  Uno de los avances más importantes fue desplazar la comunicación desde una lógica meramente descriptiva hacia una lógica más estratégica, donde el producto comenzó a presentarse como parte de una solución arquitectónica y no solo como una pieza técnica.
                </p>
                <p className="text-stone-400 font-light leading-relaxed text-sm lg:text-base">
                  Dentro de ese proceso, el trabajo en videos con Marcelo tuvo un rol especialmente valioso, ya que permitió convertir el contenido audiovisual en una herramienta concreta de crecimiento, <GlossaryTerm term="visibilidad" definition="Que la marca aparezca frente a los ojos de los arquitectos justo cuando están diseñando." /> y reconocimiento de marca.
                </p>
                <p className="text-stone-400 font-light leading-relaxed text-xs lg:text-sm">
                  A través de una mejor construcción de guiones, una selección más estratégica de temas, una línea conceptual más clara y una intención de campaña más definida, fue posible capitalizar ese contenido no solo en <GlossaryTerm term="alcance" definition="Cantidad total de personas únicas que vieron nuestro mensaje." />, sino también en seguidores, recordación y fortalecimiento de identidad de marca.
                </p>
                <div className="pt-4 border-t border-stone-100">
                  <p className="text-stone-900 font-medium italic text-sm lg:text-base">
                    El video dejó de ser solo formato. Empezó a funcionar como vehículo de posicionamiento.
                  </p>
                </div>
              </div>
            </FadeIn>
            <div className="relative mt-12 lg:mt-0">
              <FadeIn direction="left" delay={0.3}>
                <div className="bg-white p-10 md:p-16 lg:p-20 border border-stone-100 relative z-10">
                  <p className="text-2xl md:text-3xl lg:text-4xl font-extralight tracking-tight text-stone-900 leading-[1.2] mb-8">
                    "Cuando el contenido tiene <span className="text-accent-700 font-normal">guion, concepto y dirección</span>, deja de ser publicación y pasa a ser <span className="italic">posicionamiento</span>."
                  </p>
                  <div className="w-12 h-px bg-accent-600/30" />
                </div>
                <div className="absolute -top-6 -right-6 lg:-top-8 lg:-right-8 w-full h-full border border-stone-100 -z-0" />
              </FadeIn>
            </div>
          </div>
        </Slide>

        {/* SLIDE 8 — IA ESTRATÉGICA */}
        <Slide id="ia" className="bg-stone-950 text-white">
          <div className="max-w-6xl w-full relative">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent-600/5 blur-[120px] rounded-full" />
            <div className="grid lg:grid-cols-2 gap-20 items-start">
              <FadeIn direction="right">
                <div className="mb-12">
                  <h2 className="text-6xl md:text-8xl font-thin tracking-tighter text-white mb-8 leading-none">
                    La diferencia no es <span className="font-black text-accent-600 uppercase">usar IA</span>.
                  </h2>
                  <div className="w-16 h-px bg-accent-600 mb-8" />
                  <p className="text-stone-400 font-light leading-relaxed text-lg">
                    Para una empresa mediana/chica, el valor de la IA no está solo en hacer más rápido una tarea. Está en permitirle operar con un nivel de sofisticación, velocidad y producción que antes requería estructuras más grandes.
                  </p>
                </div>
                <div className="bg-stone-900/30 p-10 border border-stone-800/50">
                  <p className="text-stone-200 font-light italic leading-relaxed">
                    "Por eso, su incorporación representa un avance importante: no solo moderniza procesos, también amplía posibilidades reales de crecimiento."
                  </p>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.2}>
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold mb-10">Bien aplicada, la IA ayuda a:</h4>
                <ul className="grid gap-6 mb-16">
                  {[
                    "Acortar tiempos de desarrollo",
                    "Mejorar la calidad percibida",
                    "Escalar producción sin perder criterio",
                    "Sostener una comunicación más competitiva",
                    "Transformar ideas en activos visuales con mayor rapidez",
                    "Acompañar mejor al área comercial",
                    "Aumentar la capacidad de respuesta del negocio"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-6 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-600/40 group-hover:bg-accent-600 transition-colors" />
                      <p className="text-stone-300 text-sm md:text-base font-light tracking-wide group-hover:text-white transition-colors">{text}</p>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>

            {/* Visual Comparison IA Slider */}
            <FadeIn delay={0.4} className="mt-12 bg-stone-900 border border-stone-800">
              <ImageComparer 
                before="public/imagenes/premium.jpg" 
                after="public/imagenes/basico.jpg" 
              />
              <div className="p-8 text-center bg-stone-900/50">
                <p className="text-stone-500 font-light text-xs tracking-[0.2em] uppercase">Desliza para ver la transformación de calidad</p>
              </div>
            </FadeIn>
          </div>
        </Slide>

        {/* SLIDE 9 — COMPETENCIA */}
        <Slide id="competencia" className="bg-white">
          <div className="max-w-6xl w-full">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                <div>
                  <h2 className="text-6xl md:text-8xl font-extralight tracking-tighter text-stone-900 leading-none mb-6">
                    Análisis <span className="text-stone-200 italic">Comparativo</span>
                  </h2>
                  <p className="text-stone-400 font-light tracking-[0.2em] uppercase text-[10px] font-bold">Referencial de Mercado</p>
                </div>
                <div className="hidden md:block w-32 h-px bg-stone-100" />
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              <FadeIn delay={0.1}>
                <div className="group h-full flex flex-col">
                  <div className="aspect-[3/4] overflow-hidden mb-8 bg-stone-100 relative">
                    <img 
                      src="public/imagenes/roller.png" 
                      alt="Roller Star Argentina" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 border-[20px] border-white/10 group-hover:border-white/0 transition-all duration-700" />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-300 mb-10 font-bold group-hover:text-stone-400 transition-colors">Roller Star Argentina</h4>
                  <div className="space-y-6 border-t border-stone-100 pt-8 mt-auto">
                    {[
                      "Gráfica publicitaria estándar y trillada",
                      "Uso de eslóganes en exceso",
                      "Tipografías sin armonía",
                      "Sin enfoque claro en detalle técnico",
                      "Fotografía desganada",
                    ].map((item, i) => (
                      <p key={i} className="text-[13px] text-stone-400 font-light leading-relaxed flex gap-3">
                        <span className="text-stone-200">—</span> {item}
                      </p>
                    ))}
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <div className="group h-full flex flex-col">
                  <div className="aspect-[3/4] overflow-hidden mb-8 bg-stone-100 relative">
                    <img 
                      src="public/imagenes/compactas.png" 
                      alt="Persianas Compactas" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 border-[20px] border-white/10 group-hover:border-white/0 transition-all duration-700" />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-300 mb-10 font-bold group-hover:text-stone-400 transition-colors">Persianas Compactas</h4>
                  <div className="space-y-6 border-t border-stone-100 pt-8 mt-auto">
                    {[
                      "Renderizado básico tipo CAD",
                      "Muestra producto, no contexto arquitectónico",
                      "Desconexión emocional con el usuario final",
                      "Iluminación plana y falta de realismo"
                    ].map((item, i) => (
                      <p key={i} className="text-[13px] text-stone-400 font-light leading-relaxed flex gap-3">
                        <span className="text-stone-200">—</span> {item}
                      </p>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="bg-stone-950 p-10 relative overflow-hidden shadow-2xl shadow-stone-200 group h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-600/10 blur-[80px]" />
                  <div className="aspect-[3/4] overflow-hidden mb-8 bg-stone-900 border border-stone-800 relative">
                    <img 
                      src="public/imagenes/luxe.jpeg" 
                      alt="Luxe Perfil" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 border-[20px] border-accent-600/10 group-hover:border-accent-600/0 transition-all duration-700" />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent-600 mb-10 font-bold">Luxe Perfil (Diferencial)</h4>
                  <div className="space-y-6 border-t border-stone-800 pt-8 mt-auto">
                    {[
                      "Credibilidad técnica y autoridad visual",
                      "Valoración de guías, lamas y encuentros",
                      "Integración estética superior",
                      "Construcción de deseo arquitectónico",
                      "Titulares con peso conceptual ",
                    ].map((item, i) => (
                      <p key={i} className="text-[13px] text-stone-200 font-light leading-relaxed flex gap-3">
                        <span className="text-accent-600/60">•</span> {item}
                      </p>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.5} className="mt-24">
              <div className="max-w-3xl">
                <p className="text-2xl md:text-3xl font-extralight text-stone-900 leading-tight tracking-tight">
                  "Mostrar no alcanza. <span className="text-stone-300 italic">Hay que mostrar bien.</span> En un rubro donde el detalle constructivo es clave, la comunicación visual es el primer filtro de calidad."
                </p>
              </div>
            </FadeIn>
          </div>
        </Slide>

        {/* SLIDE 10 — SOPORTE COMERCIAL */}
        <Slide id="comercial">
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-24 items-center">
            <div className="order-2 md:order-1">
              <FadeIn direction="right">
                <div className="grid grid-cols-1 gap-px bg-stone-100 border border-stone-100">
                  <div className="bg-white p-10">
                    <span className="text-accent-600 font-mono text-[10px] block mb-4">01</span>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-2">Imágenes Específicas</h4>
                    <p className="text-[11px] text-stone-400 font-light leading-relaxed">Adaptadas a requerimientos y pedidos puntuales del área comercial.</p>
                  </div>
                  <div className="bg-white p-10">
                    <span className="text-accent-600 font-mono text-[10px] block mb-4">02</span>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-2">Contenido</h4>
                    <p className="text-[11px] text-stone-400 font-light leading-relaxed">Material listo para que el distribuidor comparta en sus redes.</p>
                  </div>
                  <div className="bg-white p-10">
                    <span className="text-accent-600 font-mono text-[10px] block mb-4">03</span>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-2">Asesoría</h4>
                    <p className="text-[11px] text-stone-400 font-light leading-relaxed">Acompañamiento constante en la resolución de dudas comerciales.</p>
                  </div>
                </div>
              </FadeIn>
            </div>
            <div className="order-1 md:order-2">
              <FadeIn direction="left">
                <h2 className="text-5xl md:text-7xl font-extralight tracking-tight mb-12 leading-[1.05]">
                  Soporte real al área <span className="text-stone-300 italic">comercial</span>
                </h2>
                <p className="text-stone-500 text-lg font-light leading-relaxed">
                  El marketing no es una isla. Es el motor que entrega las herramientas necesarias para que el equipo de ventas pueda argumentar mejor, mostrar mejor y cerrar mejor.
                </p>
              </FadeIn>
            </div>
          </div>
        </Slide>

        {/* SLIDE 11 — FLUJO DE LEADS */}
        <Slide id="distribucion" className="bg-stone-50">
          <div className="max-w-6xl w-full">
            <FadeIn className="mb-20 text-center">
              <h2 className="text-5xl md:text-7xl font-thin tracking-tighter text-stone-900 leading-none mb-6">
                Estrategia de <span className="text-stone-300 italic">Capitalización</span>
              </h2>
              <p className="text-stone-400 font-light tracking-[0.2em] uppercase text-[10px] font-bold">Embudo de Ventas y Distribución</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center relative">
              {/* Step 1: Input */}
              <FadeIn delay={0.1} className="bg-white p-12 border border-stone-100 shadow-sm relative z-10 flex flex-col items-center text-center">
                <div className="mb-8 p-6 rounded-full bg-accent-50">
                  <Smartphone className="w-10 h-10 text-accent-600" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-4">Captación Directa</h4>
                <p className="text-xs text-stone-400 font-light leading-relaxed mb-6">Inversión en publicidad paga segmentada que deriva consultas directas a WhatsApp.</p>
                <div className="py-2 px-4 bg-stone-50 rounded-full border border-stone-100">
                  <span className="text-[10px] font-bold text-accent-600 tracking-wider">90% Consumidor Final</span>
                </div>
              </FadeIn>

              {/* Step 2: Distribution Logic */}
              <FadeIn delay={0.2} className="flex flex-col gap-8 items-center h-full justify-center">
                <div className="hidden md:flex flex-col items-center gap-4">
                  <div className="w-px h-12 bg-stone-200" />
                  <ArrowRight className="w-6 h-6 text-stone-300" />
                  <div className="w-px h-12 bg-stone-200" />
                </div>
                <div className="bg-stone-900 text-white p-8 rounded-sm w-full text-center">
                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-accent-500 mb-2 block">Motor de Derivación</span>
                  <p className="text-xs font-light tracking-wide italic">"Ubicación Geográfica"</p>
                </div>
                <div className="hidden md:flex flex-col items-center gap-4">
                  <div className="w-px h-12 bg-stone-200" />
                  <ArrowRight className="w-6 h-6 text-stone-300" />
                  <div className="w-px h-12 bg-stone-200" />
                </div>
              </FadeIn>

              {/* Step 3: Destiny */}
              <div className="flex flex-col gap-6 h-full justify-center">
                <FadeIn delay={0.3} className="bg-white p-8 border border-accent-100 border-l-4 border-l-accent-600 shadow-sm flex items-start gap-6 group hover:translate-x-2 transition-transform">
                  <div className="p-4 rounded-full bg-accent-50">
                    <Building2 className="w-6 h-6 text-accent-600 transition-transform group-hover:scale-110" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2">Córdoba Capital</h4>
                    <p className="text-[10px] text-stone-400 font-light leading-relaxed mb-1">Derivación directa a:</p>
                    <span className="text-[10px] font-bold text-accent-700 tracking-tighter">LUXE CONTROL SOLAR</span>
                  </div>
                </FadeIn>

                <FadeIn delay={0.4} className="bg-white p-8 border border-stone-100 border-l-4 border-l-stone-900 shadow-sm flex items-start gap-6 group hover:translate-x-2 transition-transform">
                  <div className="p-4 rounded-full bg-stone-50">
                    <Users className="w-6 h-6 text-stone-900 transition-transform group-hover:scale-110" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-2">Provincia & País</h4>
                    <p className="text-[10px] text-stone-400 font-light leading-relaxed mb-1">Potenciamiento de nuestra red de:</p>
                    <span className="text-[10px] font-bold text-stone-950 tracking-tighter uppercase">Carpinteros Fieles</span>
                  </div>
                </FadeIn>
              </div>
            </div>

            <FadeIn delay={0.6} className="mt-20 pt-12 border-t border-stone-200">
              <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent-600" />
                  <p className="text-[11px] font-bold text-stone-900 uppercase tracking-widest leading-none">Fidelización del Partner</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent-600" />
                  <p className="text-[11px] font-bold text-stone-900 uppercase tracking-widest leading-none">Control de la Venta</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent-600" />
                  <p className="text-[11px] font-bold text-stone-900 uppercase tracking-widest leading-none">Seguimiento Post-Derivación</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </Slide>

        {/* SLIDE 12 — IMPACTO LOGRADO */}
        <Slide id="impacto" className="bg-[#fcfcfc]">
          <div className="max-w-6xl w-full">
            <FadeIn className="mb-24">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-6xl md:text-8xl font-thin tracking-tighter mb-8">
                  <span className="font-black uppercase">Impacto</span> <span className="text-stone-300 italic">Logrado</span>
                </h2>
                <div className="w-24 h-px bg-accent-600/30" />
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-3 gap-16">
              <FadeIn delay={0.1}>
                <div className="text-center group">
                  <div className="mb-10 inline-flex p-6 rounded-full bg-stone-50 group-hover:bg-accent-50 transition-colors duration-500">
                    <ShieldCheck className="w-10 h-10 text-stone-300 group-hover:text-accent-600 transition-colors duration-500" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-900 mb-6">Autoridad</h4>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">Consolidación de Luxe Perfil como referente técnico y estético en el mercado.</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="text-center group">
                  <div className="mb-10 inline-flex p-6 rounded-full bg-stone-50 group-hover:bg-accent-50 transition-colors duration-500">
                    <Zap className="w-10 h-10 text-stone-300 group-hover:text-accent-600 transition-colors duration-500" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-900 mb-6">Diferenciación</h4>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">Uso de tecnología y criterio visual para despegarse de la competencia genérica.</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="text-center group">
                  <div className="mb-10 inline-flex p-6 rounded-full bg-stone-50 group-hover:bg-accent-50 transition-colors duration-500">
                    <Users className="w-10 h-10 text-stone-300 group-hover:text-accent-600 transition-colors duration-500" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-900 mb-6">Comunidad</h4>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">Crecimiento real y sostenido de una audiencia interesada en el valor de marca.</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </Slide>

        {/* SLIDE 12 — HOJA DE RUTA / PRÓXIMOS PASOS */}
        <Slide id="pasos" className="bg-stone-950 text-white">
          <div className="max-w-6xl w-full relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-32 w-px h-24 bg-gradient-to-t from-accent-600/40 to-transparent" />
            
            <FadeIn className="text-center mb-24">
              <h2 className="text-6xl md:text-8xl font-thin tracking-tighter text-white leading-none mb-6">
                <span className="font-black uppercase">Hoja</span> de <span className="text-stone-600 italic">Ruta</span>
              </h2>
              <p className="text-stone-500 text-[10px] uppercase tracking-[0.5em] font-bold">Visión Estratégica 2026 / 2027</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-stone-900 border border-stone-900 overflow-hidden">
              {[
                {
                  title: "Alianza con Expertos",
                  desc: "Lograr que los arquitectos más prestigiosos nos elijan y recomienden.",
                  action: "Buscaremos crear una serie de 'Casos de Éxito' o 'Visitas a Obra' donde el arquitecto que eligió Luxe Perfil explique el porqué técnico y de diseño. Con esto trasladaremos la autoridad de la marca a un par técnico.",
                  phase: "Q1 2026"
                },
                {
                  title: "Presencia en Arquitextos",
                  subtitle: "Estrategia de Autoridad y Prestigio.",
                  desc: "Coordinar publicación estratégica en la revista referente del sector.",
                  action: "Coordinaremos una publicación con la revista Arquitextos. El valor de conseguir esta gestión es posicionar a Luxe Perfil en el 'top of mind' de los profesionales, validando nuestra calidad ante la comunidad técnica más relevante de Argentina.",
                  phase: "Q2 2026"
                },
                {
                  title: "Dominio en Google",
                  desc: "Aparecer siempre entre los primeros resultados cuando alguien busque renovar su hogar.",
                  action: "Buscaremos capitalizar el conocimiento técnico de Marcelo y el equipo en un Blog Estratégico o Centro de Recursos en la web. Con temas como 'Cómo mejorar la eficiencia energética con persianas de aluminio' nos posicionaremos como referentes técnicos.",
                  phase: "Q2 2026"
                },
                {
                  title: "Ventas Inteligentes",
                  desc: "Acompañar paso a paso a quienes consultan para que decidan con seguridad.",
                  action: "Implementaremos una estrategia de acompañamiento digital (Lead Nurturing). Con catálogos automatizados y correos técnicos mantendremos la marca presente hasta el momento del proyecto.",
                  phase: "Q3 2026"
                },
                {
                  title: "Hogar Eficiente",
                  subtitle: "Es la tendencia número uno en arquitectura global.",
                  desc: "Destacar cuánto dinero ahorran nuestros sistemas en calefacción y aire.",
                  action: "Buscaremos comunicar cuánto 'ahorra' un sistema Luxe Perfil en consumo de aire acondicionado o calefacción. Convertiremos el beneficio técnico en un beneficio económico y ambiental cuantificable.",
                  phase: "Q4 2026"
                }
              ].map((step, i) => (
                <FadeIn key={i} delay={0.1 * i} className="bg-stone-950 p-10 group hover:bg-stone-900 transition-colors duration-700 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-accent-600 font-mono text-[10px] block mb-8 opacity-40 group-hover:opacity-100 transition-opacity uppercase tracking-widest">{step.phase}</span>
                    <h4 className="text-lg font-light text-stone-200 mb-4 group-hover:text-white transition-colors">{step.title}</h4>
                    {step.subtitle && (
                      <p className="text-[9px] text-accent-600 font-bold mb-4 uppercase tracking-[0.2em]">{step.subtitle}</p>
                    )}
                    <p className="text-[10px] text-stone-500 font-light leading-relaxed mb-6 group-hover:text-white transition-colors uppercase tracking-wider">{step.desc}</p>
                    <div className="pt-6 border-t border-stone-900 group-hover:border-stone-800 transition-colors">
                      <p className="text-[9px] text-accent-600/80 font-bold mb-3 uppercase tracking-[0.2em] italic">Recomendación:</p>
                      <p className="text-[9px] text-stone-500 leading-relaxed font-light group-hover:text-stone-300 transition-colors uppercase tracking-wide">
                        {i === 2 ? (
                          <>Buscaremos capitalizar el conocimiento técnico de Marcelo y el equipo en un <GlossaryTerm term="Blog Estratégico" definition="Una sección de la web con artículos útiles que resuelven dudas reales de clientes." />. Con temas como 'Cómo mejorar la <GlossaryTerm term="Eficiencia energética" definition="Gastar menos energía para mantener la casa fresca o caliente." />' nos posicionaremos como referentes técnicos.</>
                        ) : i === 3 ? (
                          <>Implementaremos una estrategia de acompañamiento digital (<GlossaryTerm term="Lead Nurturing" definition="Enviar información valiosa por email automáticamente para que el cliente no se olvide de nosotros." />). Con catálogos automatizados mantendremos la marca presente.</>
                        ) : step.action}
                      </p>
                    </div>
                  </div>
                  <div className="mt-12 h-0.5 w-0 bg-accent-600 group-hover:w-full transition-all duration-700" />
                </FadeIn>
              ))}
            </div>

           <FadeIn delay={0.8} className="mt-24 text-center">
              {/* Video Player Integrado (Sin marco, fondo negro) */}
              <div className="w-full max-w-4xl mx-auto aspect-video bg-transparent">
                <video 
                  controls 
                  className="w-full h-full object-cover outline-none"
                  poster=""
                >
                  <source src="public/imagenes/cierre.mp4" type="video/mp4" />
                  Tu navegador no soporta el reproductor de video.
                </video>
              </div>
              
              <div className="mt-20 inline-flex items-center gap-6 px-10 py-5 border border-stone-800">
                <div className="w-2 h-2 rounded-full bg-accent-600 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.5em] text-stone-600 font-bold">Area de marketing — Luxe Perfil Argentina</span>
              </div>
            </FadeIn>
          </div>
        </Slide>

      </main>

      {/* Global Styles for Scroll Snap */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}} />
    </div>
  );
}
