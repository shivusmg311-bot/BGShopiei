import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SLIDES = [
  {
    title: "Aura of Modern Audio",
    subtitle: "PREMIUM STUDIO ACOUSTICS",
    highlight: "40% OFF INTRODUCTORY OFFERS",
    description: "Crafted in hand-turned organic American Walnut hardwood panels with premium audio transducers. Zero distortion. Sublime response.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200",
    color: "from-stone-950/90 via-stone-900/80 to-transparent",
    tag: "Aura Tech"
  },
  {
    title: "Organic Linen & Drapes",
    subtitle: "AUTUMN HARVEST COUTURE",
    highlight: "FREE SHIPPING REGIONWIDE",
    description: "Indulge in breathable Belgian flax and pure pre-shrunk combed yarn designed to flow naturally with your body's rhythm.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200",
    color: "from-stone-950/95 via-stone-900/70 to-transparent",
    tag: "Luxe Apparel"
  },
  {
    title: "Eco Botanical Serums",
    subtitle: "RITUAL SKIN ESSENTIALS",
    highlight: "100% ORGANIC & VEGAN",
    description: "Infused with cold-pressed marula extracts and active botanical peptides, carefully bottled in post-consumer recycled apothecary vials.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1200",
    color: "from-stone-950/90 via-stone-900/75 to-transparent",
    tag: "Nurture Beauty"
  }
];

interface HeroBannerProps {
  onSelectCategory: (category: string) => void;
}

export default function HeroBanner({ onSelectCategory }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div className="relative h-[480px] sm:h-[520px] w-full bg-stone-900 overflow-hidden shadow-xl lg:rounded-3xl max-w-7xl mx-auto lg:my-6 border border-stone-200/10">
      
      {/* Background Slides */}
      <div className="absolute inset-0">
        <picture>
          <img
            src={SLIDES[current].image}
            alt={SLIDES[current].title}
            className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-102 filter brightness-[0.70]"
          />
        </picture>
        <div className={`absolute inset-0 bg-gradient-to-r ${SLIDES[current].color}`} />
      </div>

      {/* Slide Info Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-2xl px-6 sm:px-12 md:px-24 text-white space-y-4">
          
          <div className="flex items-center gap-2">
            <span className="bg-yellow-500/10 text-yellow-500 font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-md border border-yellow-500/20 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {SLIDES[current].subtitle}
            </span>
            <span className="hidden sm:inline-flex bg-white/10 backdrop-blur-md text-stone-200 font-mono text-[10px] tracking-wide px-3 py-1 rounded-md">
              <Percent className="h-3 w-3 text-yellow-500 mr-1" />
              {SLIDES[current].highlight}
            </span>
          </div>

          <h2 id={`hero-slide-title-${current}`} className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            {SLIDES[current].title}
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm max-w-lg font-light leading-relaxed">
            {SLIDES[current].description}
          </p>

          <div className="pt-4 flex flex-wrap gap-3.5">
            <button
              onClick={() => onSelectCategory(SLIDES[current].tag)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-full text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 group"
            >
              Shop {SLIDES[current].tag}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onSelectCategory('All Styles')}
              className="border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-medium px-6 py-3 rounded-full text-xs transition-colors"
            >
              Browse Full Catalog
            </button>
          </div>
        </div>
      </div>

      {/* Manual Slide Toggles */}
      <div className="absolute bottom-6 right-6 sm:right-12 flex items-center gap-2 z-10">
        <button
          onClick={handlePrev}
          className="p-3.5 rounded-full border border-white/10 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={handleNext}
          className="p-3.5 rounded-full border border-white/10 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Indicator Bars */}
      <div className="absolute bottom-6 left-6 sm:left-12 flex gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? 'w-8 bg-yellow-500' : 'w-2.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
