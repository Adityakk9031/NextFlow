import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Type,
  ImageIcon,
  Video,
  Brain,
  Crop,
  Film,
  GitBranch,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/workflows");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080808] text-white">
      {/* ── Ambient gradients ── */}
      <div className="landing-gradient-top pointer-events-none fixed inset-0 z-0" />
      <div className="landing-gradient-bottom pointer-events-none fixed inset-0 z-0" />

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-8 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-lg shadow-violet-500/30">
            <Zap size={15} className="text-white" />
          </div>
          <span className="text-base font-semibold tracking-tight">NextFlow</span>
          <span className="ml-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400">
            Beta
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-[#888] sm:flex">
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
          <a href="#nodes" className="transition-colors hover:text-white">Nodes</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm text-[#888] transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:bg-violet-500"
          >
            Get started free
            <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 px-8 pb-20 pt-24 text-center">
        <div className="mx-auto max-w-3xl">
          {/* Pill badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-4 py-1.5 text-xs font-medium text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Visual LLM Pipeline Builder — powered by Gemini AI
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Build AI workflows{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              visually
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[#777]">
            Drag, connect, and run LLM pipelines without writing a single line of
            code. Combine text, images, video, and AI models into powerful workflows.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="group flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:bg-violet-500 hover:shadow-violet-500/35"
            >
              Start building for free
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/sign-in"
              className="rounded-xl border border-white/10 px-8 py-3.5 text-sm font-medium text-[#aaa] transition-all hover:border-white/20 hover:text-white"
            >
              Sign in to dashboard
            </Link>
          </div>

          {/* Micro social proof */}
          <div className="mt-10 flex items-center justify-center gap-6 text-[11px] text-[#555]">
            {["No credit card required", "Free to start", "Runs on Gemini AI"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={11} className="text-violet-500/70" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Canvas preview mockup ── */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0c0c] shadow-2xl shadow-black/60">
            {/* Fake toolbar */}
            <div className="flex items-center gap-3 border-b border-[#1a1a1a] bg-[#0c0c0c] px-5 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex h-6 w-40 items-center rounded-md border border-[#1e1e1e] bg-[#141414] px-2 text-[10px] text-[#555]">
                Product Marketing Kit
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="h-6 w-12 rounded-md border border-[#1e1e1e] bg-[#141414]" />
                <div className="h-6 w-16 rounded-md bg-violet-600/80" />
              </div>
            </div>

            {/* Fake canvas */}
            <div className="canvas-dot-grid relative flex h-72 items-center justify-center overflow-hidden">
              <svg className="canvas-svg absolute inset-0 h-full w-full">
                <path d="M 180 136 C 240 136, 240 136, 300 136" fill="none" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" strokeDasharray="6 4" />
                <path d="M 440 136 C 500 136, 500 136, 560 136" fill="none" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" strokeDasharray="6 4" />
                <path d="M 700 136 C 760 136, 760 136, 820 136" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" strokeDasharray="6 4" />
              </svg>

              {/* Mock nodes — fixed Tailwind classes, no dynamic color prop */}
              <div className="relative flex items-center gap-4">
                <MockNodeViolet label="Text Input" icon="T" />
                <MockNodeIndigo label="Run LLM" icon="✦" glow />
                <MockNodeEmerald label="Crop Image" icon="⊡" />
                <MockNodeIndigo label="Final LLM" icon="✦" />
              </div>
            </div>
          </div>

          {/* Glow under mockup */}
          <div className="canvas-mockup-glow pointer-events-none absolute -bottom-8 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full blur-3xl" />
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 px-8 py-20">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Features</SectionLabel>
          <h2 className="mb-12 text-3xl font-bold tracking-tight">
            Everything you need to build AI pipelines
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative z-10 px-8 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Three steps to your first AI pipeline
          </h2>
          <p className="mb-16 text-[#666]">
            No configuration headaches. Start running workflows in minutes.
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-lg font-bold text-violet-400">
                  {i + 1}
                </div>
                <h3 className="mb-2 font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[#666]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Node types ── */}
      <section id="nodes" className="relative z-10 px-8 py-20">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Node Types</SectionLabel>
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            6 powerful node types
          </h2>
          <p className="mb-12 text-[#666]">
            Mix and match to build any AI pipeline imaginable.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NODE_TYPES.map((n) => (
              <NodeTypeCard key={n.label} icon={n.icon} label={n.label} desc={n.desc} chipClass={n.chipClass} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 px-8 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-500/[0.08] to-transparent px-12 py-16">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 shadow-xl shadow-violet-500/30">
              <Zap size={22} className="text-white" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Ready to build your first workflow?
            </h2>
            <p className="mb-8 text-[#777]">
              Join builders using NextFlow to automate AI tasks visually.
            </p>
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:bg-violet-500"
            >
              Get started for free
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-[#1a1a1a] px-8 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600">
              <Zap size={11} className="text-white" />
            </div>
            <span className="text-sm font-semibold">NextFlow</span>
            <span className="ml-1 text-[11px] text-[#444]">by Galaxy.ai</span>
          </div>
          <p className="text-xs text-[#444]">
            Built with Next.js · Clerk · React Flow · Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-violet-400">
      {children}
    </p>
  );
}

/** Fixed-color mock nodes for the canvas preview — no dynamic styles needed */
function MockNodeViolet({ label, icon, glow }: { label: string; icon: string; glow?: boolean }) {
  return (
    <div className={`mock-node flex flex-col items-start rounded-xl border bg-[#0e0e0e] p-3 shadow-xl ${glow ? "border-violet-400/50 shadow-violet-400/10" : "border-[#1e1e1e]"}`}>
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-violet-400/15 text-sm font-bold text-violet-400">
        {icon}
      </div>
      <span className="text-[10px] font-medium text-[#aaa]">{label}</span>
      <div className="mt-2 h-1.5 w-full rounded-full bg-[#1a1a1a]">
        <div className="h-1.5 w-3/5 rounded-full bg-violet-400/50" />
      </div>
    </div>
  );
}

function MockNodeIndigo({ label, icon, glow }: { label: string; icon: string; glow?: boolean }) {
  return (
    <div className={`mock-node flex flex-col items-start rounded-xl border bg-[#0e0e0e] p-3 shadow-xl ${glow ? "border-indigo-400/50 shadow-indigo-400/10" : "border-[#1e1e1e]"}`}>
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-400/15 text-sm font-bold text-indigo-400">
        {icon}
      </div>
      <span className="text-[10px] font-medium text-[#aaa]">{label}</span>
      <div className="mt-2 h-1.5 w-full rounded-full bg-[#1a1a1a]">
        <div className="h-1.5 w-3/5 rounded-full bg-indigo-400/50" />
      </div>
    </div>
  );
}

function MockNodeEmerald({ label, icon, glow }: { label: string; icon: string; glow?: boolean }) {
  return (
    <div className={`mock-node flex flex-col items-start rounded-xl border bg-[#0e0e0e] p-3 shadow-xl ${glow ? "border-emerald-400/50 shadow-emerald-400/10" : "border-[#1e1e1e]"}`}>
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/15 text-sm font-bold text-emerald-400">
        {icon}
      </div>
      <span className="text-[10px] font-medium text-[#aaa]">{label}</span>
      <div className="mt-2 h-1.5 w-full rounded-full bg-[#1a1a1a]">
        <div className="h-1.5 w-3/5 rounded-full bg-emerald-400/50" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-5 transition-all hover:border-[#2a2a2a] hover:bg-[#111]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
        {icon}
      </div>
      <h3 className="mb-1.5 font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-[#666]">{desc}</p>
    </div>
  );
}

function NodeTypeCard({
  icon,
  label,
  desc,
  chipClass,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  chipClass: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-4 transition-all hover:border-[#252525] hover:bg-[#111]">
      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${chipClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-[#666]">{desc}</p>
      </div>
    </div>
  );
}

/* ── Static data ── */

const FEATURES = [
  { icon: <GitBranch size={16} />, title: "Parallel Execution", desc: "Independent branches run concurrently via topological sort for maximum speed." },
  { icon: <Shield size={16} />, title: "DAG Validation", desc: "Cycle detection prevents invalid connections before they cause issues." },
  { icon: <Clock size={16} />, title: "Run History", desc: "Every workflow run is logged with per-node inputs, outputs, and timing." },
  { icon: <Brain size={16} />, title: "Gemini AI", desc: "Multimodal LLM support — feed text, images, and video to AI models." },
  { icon: <Zap size={16} />, title: "Background Tasks", desc: "Long-running LLM and FFmpeg jobs execute via Next.js after() — never block the UI." },
  { icon: <CheckCircle size={16} />, title: "Type-safe Connections", desc: "Only compatible node handles can connect. No silent type mismatches." },
];

const HOW_IT_WORKS = [
  { title: "Drag nodes onto the canvas", desc: "Choose from 6 node types — text, image, video, LLM, crop, or extract frame." },
  { title: "Connect them together", desc: "Draw edges between handles. The system validates compatibility automatically." },
  { title: "Hit Run and watch it go", desc: "Branches execute in parallel. Results appear inline on each node in real time." },
];

const NODE_TYPES = [
  { icon: <Type size={14} />, label: "Text", desc: "Free-form text input or prompt for downstream LLM nodes.", chipClass: "bg-violet-400/15 text-violet-400" },
  { icon: <ImageIcon size={14} />, label: "Upload Image", desc: "Upload JPG, PNG, WEBP or GIF files to use in the pipeline.", chipClass: "bg-pink-400/15 text-pink-400" },
  { icon: <Video size={14} />, label: "Upload Video", desc: "Upload MP4, MOV, WEBM videos for frame extraction.", chipClass: "bg-amber-400/15 text-amber-400" },
  { icon: <Brain size={14} />, label: "Run LLM", desc: "Execute a Gemini model with system prompt, user message, and images.", chipClass: "bg-indigo-400/15 text-indigo-400" },
  { icon: <Crop size={14} />, label: "Crop Image", desc: "Crop an image to a region using percentage-based coordinates via FFmpeg.", chipClass: "bg-emerald-400/15 text-emerald-400" },
  { icon: <Film size={14} />, label: "Extract Frame", desc: "Pull a single frame from a video at any timestamp using FFmpeg.", chipClass: "bg-orange-400/15 text-orange-400" },
];
