"use client"

import { useState } from "react";
import {
  Download, Terminal, Shield, Globe, Zap,
  Server, Apple, Monitor, ArrowRight, Copy, Check, Sun, Moon,
} from "lucide-react";

function CopyButton({ text, dark }: { text: string; dark: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        position: "absolute", right: 10, top: 10,
        padding: "5px", borderRadius: 6, border: "none",
        background: "transparent", cursor: "pointer",
        color: dark ? "#52525b" : "#9ca3af",
        transition: "color 0.15s",
      }}
      title="Copy"
      onMouseEnter={e => e.currentTarget.style.color = dark ? "#d4d4d8" : "#374151"}
      onMouseLeave={e => e.currentTarget.style.color = dark ? "#52525b" : "#9ca3af"}
    >
      {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
    </button>
  );
}

export default function Home() {
  const [activeOS, setActiveOS] = useState("Linux");
  const [dark, setDark] = useState(true);

  const d = dark;

  const t = {
    bg:          d ? "#080a0f"  : "#f8f8f5",
    bgAlt:       d ? "#0a0c12"  : "#f0efe8",
    bgCard:      d ? "#0d1017"  : "#ffffff",
    bgCode:      d ? "#000000"  : "#f3f2ec",
    border:      d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    borderStrong:d ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.15)",
    text:        d ? "#ffffff"  : "#0f0f0e",
    textMuted:   d ? "#71717a"  : "#6b7280",
    textFaint:   d ? "#3f3f46"  : "#9ca3af",
    navBg:       d ? "rgba(8,10,15,0.9)" : "rgba(248,248,245,0.9)",
    gridLine:    d ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.04)",
    featureBg:   d ? "#080a0f"  : "#ffffff",
    featureGap:  d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)",
    glow:        d ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.05)",
    blue:        "#3b82f6",
    blueLight:   d ? "#93c5fd"  : "#1d4ed8",
    blueBg:      d ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.08)",
    blueBorder:  d ? "rgba(59,130,246,0.3)"  : "rgba(59,130,246,0.25)",
    green:       d ? "#4ade80"  : "#16a34a",
    greenBg:     d ? "rgba(74,222,128,0.1)"  : "rgba(22,163,74,0.08)",
    greenBorder: d ? "rgba(74,222,128,0.2)"  : "rgba(22,163,74,0.2)",
    purple:      d ? "#c084fc"  : "#7c3aed",
    purpleBg:    d ? "rgba(192,132,252,0.1)" : "rgba(124,58,237,0.08)",
    purpleBorder:d ? "rgba(192,132,252,0.2)" : "rgba(124,58,237,0.2)",
    codeText:    d ? "#d4d4d8"  : "#374151",
    badgeBg:     d ? "#18181b"  : "#f3f2ec",
    badgeBorder: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)",
    badgeText:   d ? "#52525b"  : "#6b7280",
    iconBorder:  d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    iconBg:      d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
    toggleBg:    d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    toggleBorder:d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    tabActive:   d ? { bg:"rgba(59,130,246,0.12)", color:"#93c5fd", border:"rgba(59,130,246,0.35)" }
                   : { bg:"rgba(59,130,246,0.08)", color:"#1d4ed8", border:"rgba(59,130,246,0.3)" },
    tabInactive: d ? { bg:"transparent", color:"#52525b", border:"rgba(255,255,255,0.06)" }
                   : { bg:"transparent", color:"#9ca3af", border:"rgba(0,0,0,0.08)" },
    archCardBg:  d ? "rgba(0,0,0,0.4)"  : "rgba(0,0,0,0.03)",
    archCardBorder: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
    footerLink:  d ? "#71717a" : "#6b7280",
    sectionLabel:d ? "#3f3f46" : "#9ca3af",
  };

  const mono = "'JetBrains Mono', 'Fira Code', monospace";

  const downloads = [
    {
      os: "Windows", arch: "x64 / AMD64",
      file: "tunnel-windows-amd64.zip",
      command: "tunnel http 5000",
      icon: <Monitor size={16} />,
      install: `# 1. Extract the ZIP archive\n\n# 2. Move tunnel.exe to a permanent location\n#    e.g. C:\\Tools\\tunnel.exe\n\n# 3. Add the folder to your PATH environment variable\n#    System Properties -> Environment Variables -> PATH\n\n# 4. Open a new terminal and run\ntunnel http 5000`,
    },
    {
      os: "Linux", arch: "x64 / AMD64",
      file: "tunnel-linux-amd64.tar.gz",
      command: "tunnel http 5000",
      icon: <Terminal size={16} />,
      install: `# Extract the archive\ntar -xzf tunnel-linux-amd64.tar.gz\n\n# Make the binary executable\nchmod +x tunnel\n\n# Move it to a directory in PATH\nsudo mv tunnel /usr/local/bin/\n\n# Run from anywhere\ntunnel http 5000`,
    },
    {
      os: "macOS", arch: "Apple Silicon",
      file: "tunnel-macos-arm64.tar.gz",
      command: "tunnel http 5000",
      icon: <Apple size={16} />,
      install: `# Extract the archive\ntar -xzf tunnel-macos-arm64.tar.gz\n\n# Make the binary executable\nchmod +x tunnel\n\n# Move it to a directory in PATH\nsudo mv tunnel /usr/local/bin/\n\n# Run from anywhere\ntunnel http 5000`,
    },
  ];

  const features = [
    { title: "Secure WSS Transport", desc: "Encrypted WebSocket tunnels between client and server — every byte in transit is protected.", icon: <Shield size={18} />, tag: "Security" },
    { title: "Automatic HTTPS", desc: "Caddy + Let's Encrypt handle TLS automatically. Your local server gets a real HTTPS URL instantly.", icon: <Globe size={18} />, tag: "Networking" },
    { title: "Concurrent Goroutines", desc: "Built in Go — handles bursts of concurrent requests without breaking a sweat.", icon: <Zap size={18} />, tag: "Performance" },
    { title: "Cross-Platform CLI", desc: "Pre-built binaries for Windows, Linux, and macOS. Download, add to PATH, run.", icon: <Monitor size={18} />, tag: "Portability" },
    { title: "Docker Ready", desc: "Production-ready containerized server infrastructure with zero-config deployment.", icon: <Server size={18} />, tag: "DevOps" },
    { title: "Heartbeat Monitoring", desc: "Persistent connection health checks with graceful reconnection and shutdown handling.", icon: <Terminal size={18} />, tag: "Reliability" },
  ];

  const archSteps = [
    { label: "Browser", sub: "Public request" },
    { label: "Caddy", sub: "TLS termination" },
    { label: "Tunnel Server", sub: "Go backend" },
    { label: "WSS", sub: "Encrypted pipe" },
    { label: "localhost", sub: "Your app" },
  ];

  const activeDownload = downloads.find((dl) => dl.os === activeOS);

  return (
    <div style={{ fontFamily: mono, background: t.bg, color: t.text, minHeight: "100vh", overflowX: "hidden", transition: "background 0.25s, color 0.25s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        a { text-decoration: none; }
        .blink { animation: _blink 1s step-end infinite; }
        @keyframes _blink { 0%,100%{opacity:1}50%{opacity:0} }
        .nav-link { position: relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#3b82f6; transition: width 0.2s; }
        .nav-link:hover::after { width:100%; }
        details summary { list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        .chevron { transition: transform 0.2s; display: inline-block; }
        details[open] .chevron { transform: rotate(90deg); }
        pre { white-space: pre; font-family: inherit; }
      `}</style>

      {/* Navbar */}
      <header style={{ position:"sticky", top:0, zIndex:50, borderBottom:`1px solid ${t.border}`, background:t.navBg, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", transition:"background 0.25s, border-color 0.25s" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:8, border:`1px solid ${t.blueBorder}`, background:t.blueBg, color:t.blueLight, fontWeight:700, fontSize:12 }}>~/</div>
            <span style={{ fontWeight:600, letterSpacing:"-0.02em", color:t.text }}>tunnel</span>
            <span style={{ fontSize:10, letterSpacing:"0.07em", textTransform:"uppercase", padding:"2px 7px", borderRadius:4, background:t.blueBg, color:t.blueLight, border:`1px solid ${t.blueBorder}`, fontWeight:500, marginLeft:2 }}>v1.0</span>
          </div>

          <nav style={{ display:"flex", gap:28, fontSize:10, color:t.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>
            {["features","downloads","setup","architecture"].map(sec => (
              <a key={sec} href={`#${sec}`} className="nav-link"
                style={{ color:t.textMuted, transition:"color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = t.text}
                onMouseLeave={e => e.currentTarget.style.color = t.textMuted}
              >{sec}</a>
            ))}
          </nav>

          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={() => setDark(!d)}
              style={{ width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:8, border:`1px solid ${t.toggleBorder}`, background:t.toggleBg, color:t.textMuted, cursor:"pointer", transition:"all 0.2s", flexShrink:0 }}
              title={d ? "Switch to light mode" : "Switch to dark mode"}
            >
              {d ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <a href="https://github.com/annuvrat/tunnel/tree/main" target="_blank"
              style={{ display:"flex", alignItems:"center", gap:6, borderRadius:8, border:`1px solid ${t.border}`, background:t.toggleBg, padding:"7px 14px", fontSize:10, color:t.textMuted, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.borderStrong; e.currentTarget.style.color = t.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
            >GitHub</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth:1100, margin:"0 auto", padding:"88px 24px 112px", position:"relative",
        backgroundImage:`linear-gradient(${t.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px)`,
        backgroundSize:"48px 48px",
      }}>
        <div style={{ position:"absolute", left:"50%", top:0, transform:"translateX(-50%)", width:600, height:320, borderRadius:"50%", background:t.glow, filter:"blur(60px)", pointerEvents:"none" }} />

        <div style={{ display:"inline-flex", alignItems:"center", gap:8, borderRadius:999, border:`1px solid ${t.blueBorder}`, background:t.blueBg, padding:"5px 14px", fontSize:10, color:t.blueLight, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:32 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:t.blueLight }} className="blink" />
          Built with Go · WebSockets · HTTPS
        </div>

        <h1 style={{ fontSize:"clamp(46px,8vw,86px)", fontWeight:700, lineHeight:1.04, letterSpacing:"-0.04em", marginBottom:28 }}>
          <span style={{ display:"block", color:t.text }}>Expose</span>
          <span style={{ display:"block", color:t.text }}>localhost</span>
          <span style={{ display:"block", color:t.blueLight }}>securely.</span>
        </h1>

        <p style={{ maxWidth:460, fontSize:13, lineHeight:1.9, color:t.textMuted, marginBottom:36 }}>
          A lightweight reverse tunnel platform built in Go. Share local servers over HTTPS via WSS — self-hosted, fast, and open-source. Like ngrok, but yours.
        </p>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:72 }}>
          <a href="#downloads"
            style={{ display:"flex", alignItems:"center", gap:8, borderRadius:8, background:t.blue, padding:"11px 22px", fontSize:13, fontWeight:600, color:"#fff", transition:"background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#60a5fa"}
            onMouseLeave={e => e.currentTarget.style.background = t.blue}
          ><Download size={15} />Download Binary</a>
          <a href="#setup"
            style={{ display:"flex", alignItems:"center", gap:8, borderRadius:8, border:`1px solid ${t.border}`, background:t.toggleBg, padding:"11px 22px", fontSize:13, fontWeight:500, color:t.textMuted, transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.borderStrong; e.currentTarget.style.color = t.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
          >Setup Guide <ArrowRight size={14} /></a>
        </div>

        {/* Terminal mockup */}
        <div style={{ borderRadius:16, border:`1px solid ${t.border}`, background:t.bgCard, overflow:"hidden", boxShadow:`0 0 48px ${t.glow}` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${t.border}`, padding:"10px 18px" }}>
            <div style={{ display:"flex", gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#ff5f57" }} />
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#febc2e" }} />
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#28c840" }} />
            </div>
            <span style={{ fontSize:10, color:t.textFaint }}>tunnel — bash</span>
            <div style={{ width:48 }} />
          </div>
          <div style={{ padding:"28px", lineHeight:1.9, fontSize:13 }}>
            <p style={{ color:t.textMuted }}>
              <span style={{ color:t.textFaint }}>~/projects/myapp</span>{" "}
              <span style={{ color:t.blueLight }}>$</span>{" "}
              <span style={{ color:t.text }}>tunnel http 5000</span>
              <span className="blink" style={{ color:t.text }}>▋</span>
            </p>
            <p style={{ color:t.textFaint }}>Connecting to tunnel.annuvrat.com...</p>
            <p style={{ color:t.green }}>✔  Tunnel established successfully</p>
            <div style={{ borderTop:`1px solid ${t.border}`, marginTop:14, paddingTop:14 }}>
              <p style={{ color:t.textMuted }}>
                Forwarding{" "}
                <span style={{ color:t.blueLight, fontWeight:600 }}>https://tunnel.annuvrat.com/t/abc123</span>
              </p>
              <p style={{ color:t.textFaint }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ http://localhost:5000</p>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:14 }}>
              {[
                { label:"● connected",   bg:t.greenBg,  color:t.green,  border:t.greenBorder },
                { label:"HTTPS + WSS",   bg:t.blueBg,   color:t.blueLight, border:t.blueBorder },
                { label:"Reverse Tunnel",bg:t.purpleBg, color:t.purple, border:t.purpleBorder },
              ].map(b => (
                <span key={b.label} style={{ fontSize:10, letterSpacing:"0.07em", textTransform:"uppercase", padding:"3px 9px", borderRadius:4, fontWeight:500, background:b.bg, color:b.color, border:`1px solid ${b.border}` }}>{b.label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth:1100, margin:"0 auto", padding:"80px 24px" }}>
        <div style={{ marginBottom:48 }}>
          <p style={{ fontSize:10, color:t.sectionLabel, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>// features</p>
          <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.03em", color:t.text }}>Production-grade tunneling</h2>
          <p style={{ marginTop:10, fontSize:13, color:t.textMuted, maxWidth:380 }}>Everything you need to expose a local server reliably and securely.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:1, background:t.featureGap, borderRadius:16, border:`1px solid ${t.featureGap}`, overflow:"hidden" }}>
          {features.map(f => (
            <div key={f.title} style={{ padding:"28px", background:t.featureBg, transition:"background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = d ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.02)"}
              onMouseLeave={e => e.currentTarget.style.background = t.featureBg}
            >
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
                <div style={{ width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:8, border:`1px solid ${t.iconBorder}`, background:t.iconBg, color:t.blueLight }}>
                  {f.icon}
                </div>
                <span style={{ fontSize:10, letterSpacing:"0.07em", textTransform:"uppercase", padding:"2px 8px", borderRadius:4, fontWeight:500, background:t.badgeBg, color:t.badgeText, border:`1px solid ${t.badgeBorder}` }}>{f.tag}</span>
              </div>
              <h3 style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:8 }}>{f.title}</h3>
              <p style={{ fontSize:11, lineHeight:1.8, color:t.textMuted }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Downloads */}
      <section id="downloads" style={{ borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}`, background:t.bgAlt }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"80px 24px" }}>
          <div style={{ marginBottom:48 }}>
            <p style={{ fontSize:10, color:t.sectionLabel, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>// downloads</p>
            <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.03em", color:t.text }}>Download CLI binary</h2>
            <p style={{ marginTop:10, fontSize:13, color:t.textMuted }}>Available for every major platform.</p>
          </div>

          <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
            {downloads.map(dl => {
              const active = activeOS === dl.os;
              const tab = active ? t.tabActive : t.tabInactive;
              return (
                <button key={dl.os} onClick={() => setActiveOS(dl.os)}
                  style={{ display:"flex", alignItems:"center", gap:8, borderRadius:8, border:`1px solid ${tab.border}`, background:tab.bg, padding:"9px 16px", fontSize:11, fontWeight:500, letterSpacing:"0.05em", color:tab.color, cursor:"pointer", transition:"all 0.15s", fontFamily:mono }}
                >
                  {dl.icon}{dl.os}
                </button>
              );
            })}
          </div>

          {activeDownload && (
            <div style={{ borderRadius:16, border:`1px solid ${t.border}`, background:t.bgCard, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${t.border}`, padding:"18px 28px", flexWrap:"wrap", gap:12 }}>
                <div>
                  <p style={{ fontWeight:600, fontSize:14, color:t.text }}>{activeDownload.os}</p>
                  <p style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{activeDownload.arch}</p>
                </div>
                <a href={`/downloads/${activeDownload.file}`}
                  style={{ display:"flex", alignItems:"center", gap:8, borderRadius:8, background:t.blue, padding:"9px 18px", fontSize:12, fontWeight:600, color:"#fff", transition:"background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#60a5fa"}
                  onMouseLeave={e => e.currentTarget.style.background = t.blue}
                ><Download size={14} />Download {activeDownload.file}</a>
              </div>
              <div style={{ padding:"28px" }}>
                <p style={{ fontSize:10, color:t.sectionLabel, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Quick command</p>
                <div style={{ position:"relative", borderRadius:8, background:t.bgCode, border:`1px solid ${t.border}`, padding:"10px 44px 10px 14px", fontSize:13, color:t.blueLight, marginBottom:24 }}>
                  {activeDownload.command}
                  <CopyButton text={activeDownload.command} dark={d} />
                </div>
                <p style={{ fontSize:10, color:t.sectionLabel, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Installation steps</p>
                <div style={{ position:"relative", borderRadius:8, background:t.bgCode, border:`1px solid ${t.border}`, padding:"18px 44px 18px 18px" }}>
                  <pre style={{ fontSize:11, lineHeight:1.9, color:t.codeText, overflow:"auto" }}>{activeDownload.install}</pre>
                  <CopyButton text={activeDownload.install} dark={d} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Setup */}
      <section id="setup" style={{ maxWidth:1100, margin:"0 auto", padding:"80px 24px" }}>
        <div style={{ marginBottom:48 }}>
          <p style={{ fontSize:10, color:t.sectionLabel, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>// setup</p>
          <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.03em", color:t.text }}>Installation guide</h2>
          <p style={{ marginTop:10, fontSize:13, color:t.textMuted }}>All platforms, step by step.</p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {downloads.map(item => (
            <details key={item.os} open={item.os === "Linux"}
              style={{ borderRadius:14, border:`1px solid ${t.border}`, background:t.bgCard, overflow:"hidden" }}
            >
              <summary style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 24px", cursor:"pointer", userSelect:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:8, border:`1px solid ${t.iconBorder}`, background:t.iconBg, color:t.blueLight }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight:600, fontSize:13, color:t.text }}>{item.os}</p>
                    <p style={{ fontSize:11, color:t.textFaint }}>{item.arch}</p>
                  </div>
                </div>
                <span className="chevron" style={{ fontSize:10, color:t.textFaint }}>▶</span>
              </summary>
              <div style={{ borderTop:`1px solid ${t.border}`, padding:"20px 24px 24px" }}>
                <div style={{ position:"relative", borderRadius:8, background:t.bgCode, border:`1px solid ${t.border}`, padding:"18px 44px 18px 18px" }}>
                  <pre style={{ fontSize:11, lineHeight:1.9, color:t.codeText, overflow:"auto" }}>{item.install}</pre>
                  <CopyButton text={item.install} dark={d} />
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" style={{ borderTop:`1px solid ${t.border}`, background:t.bgAlt }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"80px 24px" }}>
          <div style={{ marginBottom:48 }}>
            <p style={{ fontSize:10, color:t.sectionLabel, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>// architecture</p>
            <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.03em", color:t.text }}>Infrastructure overview</h2>
            <p style={{ marginTop:10, fontSize:13, color:t.textMuted }}>Minimal, production-ready, and fully self-hosted.</p>
          </div>

          <div style={{ borderRadius:16, border:`1px solid ${t.border}`, background:t.bgCard, padding:"36px" }}>
            <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:10, marginBottom:32 }}>
              {archSteps.map((step, i) => (
                <div key={step.label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ textAlign:"center", borderRadius:10, border:`1px solid ${t.border}`, background:t.iconBg, padding:"14px 20px", minWidth:100 }}>
                    <p style={{ fontSize:12, fontWeight:600, color:t.text }}>{step.label}</p>
                    <p style={{ fontSize:10, color:t.textFaint, marginTop:4 }}>{step.sub}</p>
                  </div>
                  {i < archSteps.length - 1 && (
                    <span style={{ color:t.blueBorder, fontSize:16 }}>→</span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12 }}>
              {[
                { title:"TLS Termination", body:"Caddy handles all HTTPS and certificate renewal automatically via Let's Encrypt." },
                { title:"Tunnel Server",   body:"A Go server accepts WSS connections from CLI clients and proxies HTTP traffic bidirectionally." },
                { title:"WSS Pipe",        body:"A persistent encrypted WebSocket carries request/response payloads between server and local app." },
              ].map(item => (
                <div key={item.title} style={{ borderRadius:10, border:`1px solid ${t.archCardBorder}`, background:t.archCardBg, padding:"16px 18px" }}>
                  <p style={{ fontSize:11, fontWeight:600, color:t.blueLight, marginBottom:8 }}>{item.title}</p>
                  <p style={{ fontSize:11, lineHeight:1.8, color:t.textMuted }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${t.border}`, padding:"32px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:12, fontSize:11, color:t.textFaint }}>
          <p>© 2026 Tunnel · Built with Go by{" "}
            <a href="https://github.com/annuvrat" style={{ color:t.footerLink, transition:"color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = t.text}
              onMouseLeave={e => e.currentTarget.style.color = t.footerLink}
            >annuvrat</a>
          </p>
          <div style={{ display:"flex", gap:20 }}>
            {[["Live Server","https://tunnel.annuvrat.com"],["GitHub","https://github.com/annuvrat/tunnel/tree/main"]].map(([label,href]) => (
              <a key={label} href={href} style={{ color:t.footerLink, transition:"color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = t.text}
                onMouseLeave={e => e.currentTarget.style.color = t.footerLink}
              >{label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}