"use client";

import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  const router = useRouter();
  const { scrollY } = useScroll();

  // PARALLAX VALUES
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

  // CURSOR GLOW EFFECT
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // ANIMATION VARIANTS
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* CURSOR GLOW */}
      <motion.div
        className="pointer-events-none fixed z-50 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25"
        style={{
          left: smoothX,
          top: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, #10b981, transparent 70%)"
        }}
      />

      {/* BACKGROUND ACCENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
      </div>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-10 py-6 backdrop-blur-md border-b border-white/5">
        <div className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">RouteGPT</div>
        <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <Link href="/docs" className="hover:text-emerald-400 transition-colors">Documentation</Link>
          <button onClick={() => router.push("/dashboard")} className="hover:text-emerald-400 transition-colors">App</button>
          <a href="https://github.com" className="hover:text-emerald-400 transition-colors">Open Source</a>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <motion.section 
        style={{ y: heroY, opacity: opacityHero }}
        className="relative z-10 text-center space-y-12 mt-64 max-w-6xl w-full flex flex-col items-center px-6"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black tracking-widest uppercase mb-4 animate-pulse"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Gemini 2.5 Flash Autonomous Intelligence</span>
        </motion.div>
        
        <div className="relative">
          <div className="absolute inset-0 blur-[80px] bg-emerald-500/20 opacity-40 rounded-full"></div>
          <h1 className="relative text-7xl md:text-[11rem] font-black tracking-tighter leading-[0.75] mb-4">
            <span className="bg-gradient-to-b from-white via-white to-zinc-700 bg-clip-text text-transparent">
              RouteGPT
            </span>
          </h1>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-3xl text-zinc-500 max-w-4xl font-medium tracking-tight leading-relaxed"
        >
          The next-generation logistics engine for <span className="text-white">predictive risk detection</span> and <span className="text-white">autonomous rerouting</span>. Seamlessly integrated, globally resilient.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/dashboard")}
            className="relative px-12 py-6 rounded-2xl font-black text-xl text-white overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.3)] group"
          >
            <span className="relative z-10">Open Command Center</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 animate-gradient-x opacity-90 bg-[length:200%_200%]" />
            <span className="absolute inset-0 blur-xl opacity-40 bg-emerald-400 group-hover:opacity-60 transition-opacity" />
            <span className="absolute inset-0 overflow-hidden">
              <span className="absolute -left-1/2 top-0 w-1/2 h-full bg-white/20 skew-x-[-20deg] animate-shine" />
            </span>
          </motion.button>
          
          <Link href="/docs">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-zinc-950 border border-zinc-800 text-white font-black text-xl rounded-2xl transition-all duration-500 backdrop-blur-xl"
            >
              Documentation
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* SECTION 2: PROBLEM/SOLUTION (Glow Card) */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-7xl w-full px-6 py-48"
      >
        <div className="relative group p-1 rounded-[48px] bg-zinc-900 overflow-hidden shadow-2xl transition-all duration-1000">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-emerald-500/30 opacity-20 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl animate-gradient-x"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 items-center bg-zinc-950 p-16 md:p-32 rounded-[47px]">
            <div className="text-3xl md:text-5xl font-black text-zinc-600 leading-[1.1] tracking-tighter">
              Legacy supply chains are <span className="text-zinc-300">fragile</span>. Static data. Unforeseen delays. 
            </div>
            <div className="text-3xl md:text-5xl font-black text-emerald-500 leading-[1.1] tracking-tighter md:text-right">
              RouteGPT is <span className="text-white">autonomous</span>. Real-time intelligence. Infinite resilience.
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 3: FEATURES */}
      <motion.section 
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 gap-8 px-6 pb-48"
      >
        {[
          { icon: "🧠", title: "Contextual AI", desc: "Proprietary risk scoring using localized Gemini 2.5 context windows." },
          { icon: "📡", title: "Active Feeds", desc: "Real-time monitoring of cyclones, geopolitical shifts, and port data." },
          { icon: "⚡", title: "Fast Rerouting", desc: "Instant alternative path generation with zero-latency optimization." },
          { icon: "📊", title: "Live Impact", desc: "Deep metrics on cost-per-mile and risk mitigation across your fleet." }
        ].map((f, i) => (
          <motion.div 
            key={i} 
            variants={fadeUp}
            whileHover={{ y: -12, scale: 1.02 }}
            className="group relative bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-6xl mb-10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">{f.icon}</div>
            <h3 className="text-2xl font-black mb-4 text-white tracking-tight">{f.title}</h3>
            <p className="text-zinc-500 font-medium leading-relaxed text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* PROTOCOL SECTION */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative z-10 max-w-7xl w-full py-48 px-6"
      >
        <div className="text-center mb-32">
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter">The Protocol</h2>
          <p className="text-zinc-500 text-2xl font-medium tracking-tight">Four pillars of autonomous logistics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
          
          {[
            { step: "01", t: "Ingest", d: "Disruption telemetry", i: "📡" },
            { step: "02", t: "Analyze", d: "Contextual Risk Scoring", i: "🧠" },
            { step: "03", t: "Solve", d: "Alternative Pathing", i: "🗺️" },
            { step: "04", t: "Execute", d: "Optimized Delivery", i: "🚀" }
          ].map((s, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeUp}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative z-10 w-20 h-20 bg-zinc-950 rounded-[2rem] border border-zinc-800 flex items-center justify-center text-4xl mb-10 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all duration-500 shadow-2xl">
                {s.i}
              </div>
              <div className="text-emerald-500 font-black text-xs mb-3 uppercase tracking-[0.3em]">{s.step}</div>
              <h4 className="text-2xl font-black mb-2 text-white">{s.t}</h4>
              <p className="text-zinc-500 font-medium text-sm">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* PREVIEW */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="relative z-10 max-w-6xl w-full text-center px-6 py-48"
      >
        <div className="mb-24">
          <h2 className="text-5xl md:text-9xl font-black mb-8 tracking-tighter">Command Center</h2>
          <p className="text-zinc-500 text-2xl font-medium tracking-tight">A live window into your resilient supply chain</p>
        </div>
        
        <motion.div 
          whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
          transition={{ duration: 0.5 }}
          className="relative group p-2 rounded-[3.5rem] bg-zinc-900 shadow-[0_0_120px_rgba(16,185,129,0.15)] perspective-1000"
        >
          <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative w-full h-[650px] overflow-hidden rounded-[3.2rem] bg-black border border-white/10">
            <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black via-black/40 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/40 to-transparent z-20 pointer-events-none"></div>
            <div className="animate-[scrollPreview_30s_ease-in-out_infinite] pointer-events-none">
              <iframe
                src="/dashboard"
                className="w-full h-[1400px] border-none opacity-90 scale-[0.98]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* FINAL CTA */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative z-10 text-center py-64 w-full max-w-6xl flex flex-col items-center px-6"
      >
        <div className="relative mb-20">
          <div className="absolute inset-0 blur-[100px] bg-emerald-500/20 rounded-full"></div>
          <h2 className="relative text-7xl md:text-[12rem] font-black tracking-tighter leading-none text-white">
            Secure the <br /> <span className="bg-emerald-500 px-8 py-2 italic text-black skew-x-[-12deg] inline-block mt-4">Resilience</span>.
          </h2>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/dashboard")}
          className="relative px-20 py-10 rounded-[3rem] font-black text-4xl text-white overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.5)] group"
        >
          <span className="relative z-10 uppercase tracking-tighter">Enter Command Center</span>
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 animate-gradient-x bg-[length:200%_200%]" />
          <span className="absolute inset-0 overflow-hidden">
            <span className="absolute -left-1/2 top-0 w-1/2 h-full bg-white/30 skew-x-[-20deg] animate-shine" />
          </span>
        </motion.button>
        <p className="mt-12 text-zinc-600 font-bold tracking-widest uppercase text-xs">Used by world-class logistics teams.</p>
      </motion.section>
      
      <footer className="relative z-10 w-full max-w-7xl border-t border-white/5 py-32 flex flex-col md:flex-row justify-between items-center gap-12 px-10">
        <div className="text-zinc-500 font-black text-3xl tracking-tighter">RouteGPT</div>
        <div className="flex gap-16 text-zinc-600 text-xs font-black uppercase tracking-[0.4em]">
          <Link href="/docs" className="hover:text-emerald-500 transition-colors">Documentation</Link>
          <Link href="/dashboard" className="hover:text-emerald-500 transition-colors">Platform</Link>
          <a href="#" className="hover:text-emerald-500 transition-colors">Legal</a>
        </div>
        <div className="text-zinc-800 text-[10px] font-bold uppercase tracking-widest">© 2026 Advanced Agentic Coding. All rights reserved.</div>
      </footer>

      <style jsx>{`
        @keyframes scrollPreview {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-500px); }
        }
      `}</style>
    </div>
  );
}
