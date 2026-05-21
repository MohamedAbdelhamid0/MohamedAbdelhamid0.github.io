import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@400;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #050a05;
    --surface: #0a120a;
    --green: #00ff41;
    --green-dim: #00c832;
    --green-ghost: rgba(0,255,65,0.07);
    --text: #c8ffc8;
    --muted: #4a7a4a;
    --red: #ff2244;
    --amber: #ffb300;
  }

  body { background: var(--bg); }

  .portfolio {
    font-family: 'Share Tech Mono', monospace;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
    cursor: crosshair;
  }

  /* Scanlines overlay */
  .portfolio::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.15) 2px,
      rgba(0,0,0,0.15) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  /* Noise grain */
  .portfolio::after {
    content: '';
    position: fixed;
    inset: -50%;
    width: 200%;
    height: 200%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.4;
    z-index: 9998;
    animation: noiseAnim 0.5s steps(2) infinite;
  }

  @keyframes noiseAnim {
    0% { transform: translate(0,0); }
    25% { transform: translate(-2%, -1%); }
    50% { transform: translate(1%, 2%); }
    75% { transform: translate(-1%, 1%); }
    100% { transform: translate(2%, -2%); }
  }

  /* NAV */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 3rem;
    border-bottom: 1px solid rgba(0,255,65,0.15);
    background: rgba(5,10,5,0.85);
    backdrop-filter: blur(8px);
  }

  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1rem;
    color: var(--green);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .nav-logo span { color: var(--muted); }

  .nav-links { display: flex; gap: 2rem; }

  .nav-link {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    transition: color 0.2s;
    cursor: pointer;
    background: none;
    border: none;
  }

  .nav-link:hover { color: var(--green); }

  .status-dot {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    color: var(--muted);
  }

  .dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 6rem 3rem 4rem;
    position: relative;
    overflow: hidden;
  }

  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridMove 20s linear infinite;
  }

  @keyframes gridMove {
    0% { background-position: 0 0; }
    100% { background-position: 60px 60px; }
  }

  .hero-glow {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,255,65,0.08) 0%, transparent 70%);
    top: 50%; left: 40%;
    transform: translate(-50%, -50%);
    animation: glowPulse 4s ease-in-out infinite;
  }

  @keyframes glowPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
  }

  .hero-content { position: relative; z-index: 1; max-width: 900px; }

  .hero-tag {
    font-size: 0.7rem;
    color: var(--green);
    letter-spacing: 0.3em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.2s;
  }

  .hero-tag::before {
    content: '';
    width: 40px; height: 1px;
    background: var(--green);
  }

  .hero-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(3rem, 8vw, 7rem);
    line-height: 0.95;
    color: var(--text);
    margin-bottom: 0.5rem;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.4s;
  }

  .hero-name .accent { color: var(--green); }

  .hero-title {
    font-size: clamp(0.9rem, 2vw, 1.2rem);
    color: var(--muted);
    margin: 1.5rem 0 2.5rem;
    letter-spacing: 0.1em;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.6s;
  }

  .hero-title .highlight { color: var(--green-dim); }

  .hero-desc {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.9;
    max-width: 520px;
    margin-bottom: 3rem;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.8s;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 1s;
  }

  .btn-primary {
    padding: 0.75rem 2rem;
    background: var(--green);
    color: var(--bg);
    border: none;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
    transition: all 0.2s;
  }

  .btn-primary:hover {
    background: #00ff80;
    box-shadow: 0 0 20px rgba(0,255,65,0.5);
    transform: translateY(-2px);
  }

  .btn-secondary {
    padding: 0.75rem 2rem;
    background: transparent;
    color: var(--green);
    border: 1px solid rgba(0,255,65,0.4);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    border-color: var(--green);
    background: var(--green-ghost);
  }

  /* Terminal widget */
  .terminal {
    position: absolute;
    right: 3rem;
    top: 50%;
    transform: translateY(-50%);
    width: 380px;
    background: var(--surface);
    border: 1px solid rgba(0,255,65,0.2);
    font-size: 0.75rem;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 1.2s;
    display: none;
  }

  @media (min-width: 1100px) { .terminal { display: block; } }

  .terminal-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-bottom: 1px solid rgba(0,255,65,0.15);
    background: rgba(0,255,65,0.05);
  }

  .t-dot { width: 8px; height: 8px; border-radius: 50%; }

  .terminal-body { padding: 1rem; line-height: 2; color: var(--muted); }
  .t-green { color: var(--green); }
  .t-red { color: var(--red); }
  .t-amber { color: var(--amber); }
  .t-white { color: var(--text); }

  .cursor-blink {
    display: inline-block;
    width: 8px; height: 14px;
    background: var(--green);
    vertical-align: middle;
    animation: blink 1s steps(1) infinite;
  }

  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* SECTIONS */
  section {
    padding: 6rem 3rem;
    border-top: 1px solid rgba(0,255,65,0.08);
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-label {
    font-size: 0.65rem;
    color: var(--green);
    letter-spacing: 0.4em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0,255,65,0.15);
    max-width: 100px;
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(1.8rem, 4vw, 3rem);
    color: var(--text);
    margin-bottom: 3rem;
    line-height: 1.1;
  }

  /* SKILLS */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
  }

  .skill-card {
    background: var(--surface);
    border: 1px solid rgba(0,255,65,0.12);
    padding: 1.5rem;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }

  .skill-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--green);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.3s;
  }

  .skill-card:hover { border-color: rgba(0,255,65,0.35); background: rgba(10,18,10,0.9); }
  .skill-card:hover::before { transform: scaleY(1); }

  .skill-icon {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .skill-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--text);
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
  }

  .skill-desc {
    font-size: 0.72rem;
    color: var(--muted);
    line-height: 1.8;
  }

  .skill-bar-wrap {
    margin-top: 1rem;
    height: 2px;
    background: rgba(0,255,65,0.1);
    overflow: hidden;
  }

  .skill-bar {
    height: 100%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green);
    transition: width 1s ease;
  }

  /* PROJECTS */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .project-card {
    background: var(--surface);
    border: 1px solid rgba(0,255,65,0.12);
    padding: 2rem;
    transition: all 0.3s;
    position: relative;
  }

  .project-card:hover {
    border-color: rgba(0,255,65,0.35);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,255,65,0.08);
  }

  .project-num {
    font-size: 0.65rem;
    color: var(--muted);
    letter-spacing: 0.2em;
    margin-bottom: 1rem;
  }

  .project-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text);
    margin-bottom: 0.75rem;
  }

  .project-desc {
    font-size: 0.75rem;
    color: var(--muted);
    line-height: 1.9;
    margin-bottom: 1.5rem;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag {
    padding: 0.2rem 0.6rem;
    background: var(--green-ghost);
    border: 1px solid rgba(0,255,65,0.2);
    font-size: 0.65rem;
    color: var(--green-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* ABOUT */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; } }

  .about-text p {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 2;
    margin-bottom: 1rem;
  }

  .about-text p strong { color: var(--green); font-weight: normal; }

  .about-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .stat-box {
    background: var(--surface);
    border: 1px solid rgba(0,255,65,0.12);
    padding: 1.5rem;
    text-align: center;
  }

  .stat-num {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2.5rem;
    color: var(--green);
    line-height: 1;
    margin-bottom: 0.4rem;
  }

  .stat-label {
    font-size: 0.65rem;
    color: var(--muted);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  /* CONTACT */
  .contact-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }

  @media (max-width: 768px) { .contact-inner { grid-template-columns: 1fr; } }

  .contact-blurb {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 2;
    margin-bottom: 2rem;
  }

  .contact-links { display: flex; flex-direction: column; gap: 0.75rem; }

  .contact-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.78rem;
    color: var(--muted);
    text-decoration: none;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(0,255,65,0.1);
    transition: all 0.2s;
  }

  .contact-link:hover { color: var(--green); border-color: rgba(0,255,65,0.3); background: var(--green-ghost); }

  .contact-form { display: flex; flex-direction: column; gap: 1rem; }

  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }

  .form-label { font-size: 0.65rem; color: var(--muted); letter-spacing: 0.2em; text-transform: uppercase; }

  .form-input, .form-textarea {
    background: var(--surface);
    border: 1px solid rgba(0,255,65,0.15);
    padding: 0.75rem 1rem;
    color: var(--text);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    outline: none;
    transition: border-color 0.2s;
    resize: vertical;
  }

  .form-input:focus, .form-textarea:focus { border-color: rgba(0,255,65,0.5); }

  /* FOOTER */
  .footer {
    border-top: 1px solid rgba(0,255,65,0.08);
    padding: 2rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    font-size: 0.7rem;
    color: var(--muted);
  }

  /* Active nav */
  .nav-link.active { color: var(--green); }
`;

const skills = [
  { icon: "🛡️", name: "Penetration Testing", desc: "Web, network, and system vulnerability assessment. Identifying and exploiting security weaknesses ethically.", level: 88 },
  { icon: "🔍", name: "OSINT & Recon", desc: "Open-source intelligence gathering, footprinting, and passive reconnaissance techniques.", level: 85 },
  { icon: "🌐", name: "Web Security", desc: "OWASP Top 10, SQL injection, XSS, CSRF, IDOR, and API vulnerability testing.", level: 90 },
  { icon: "🐍", name: "Python / Scripting", desc: "Automation scripts, custom tools, and security utilities built from scratch.", level: 80 },
  { icon: "🔧", name: "Network Security", desc: "Wireshark, Nmap, Metasploit, Burp Suite, and network protocol analysis.", level: 82 },
];

const projects = [];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSkillsVisible(true); }, { threshold: 0.2 });
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="portfolio">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">M<span>.</span>Ahmed</div>
          <div className="nav-links">
            {["home","about","skills","projects","contact"].map(s => (
              <button key={s} className={`nav-link ${activeSection === s ? "active" : ""}`} onClick={() => scrollTo(s)}>{s}</button>
            ))}
          </div>
          <div className="status-dot"><div className="dot" />ONLINE</div>
        </nav>

        {/* HERO */}
        <div id="home">
          <div className="hero" style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="hero-grid" />
            <div className="hero-glow" />
            <div className="hero-content">
              <div className="hero-tag">// PENETRATION TESTER</div>
              <h1 className="hero-name">
                Mohamed<br /><span className="accent">Ahmed</span>
              </h1>
              <p className="hero-title">
                <span className="highlight">Penetration Tester</span> · CESS Student @ Ain Shams University
              </p>
              <p className="hero-desc">
                Breaking things ethically so others can't break them maliciously. Passionate about finding the cracks in digital armor and building a more secure web.
              </p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => scrollTo("projects")}>View Projects</button>
                <button className="btn-secondary" onClick={() => scrollTo("contact")}>Contact Me</button>
              </div>
            </div>

            {/* Terminal widget */}
            <div className="terminal">
              <div className="terminal-bar">
                <div className="t-dot" style={{ background: "#ff5f56" }} />
                <div className="t-dot" style={{ background: "#ffbd2e" }} />
                <div className="t-dot" style={{ background: "#27c93f" }} />
                <span style={{ marginLeft: "0.5rem", color: "var(--muted)", fontSize: "0.7rem" }}>terminal — bash</span>
              </div>
              <div className="terminal-body">
                <div><span className="t-green">$ </span><span className="t-white">whoami</span></div>
                <div className="t-green">mohamed_ahmed</div>
                <div style={{ marginTop: "0.5rem" }}><span className="t-green">$ </span><span className="t-white">cat role.txt</span></div>
                <div><span className="t-amber">CESS @ Ain Shams University</span></div>
                <div><span className="t-amber">Penetration Tester</span></div>
                <div style={{ marginTop: "0.5rem" }}><span className="t-green">$ </span><span className="t-white">nmap -sV target.com</span></div>
                <div><span className="t-red">Starting Nmap 7.94...</span></div>
                <div>PORT&nbsp;&nbsp;&nbsp;STATE&nbsp;SERVICE</div>
                <div><span className="t-green">80/tcp</span>&nbsp;&nbsp;open&nbsp;&nbsp;http</div>
                <div><span className="t-green">443/tcp</span>&nbsp;open&nbsp;&nbsp;https</div>
                <div style={{ marginTop: "0.5rem" }}><span className="t-green">$ </span><span className="cursor-blink" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <section id="about">
          <div className="section-label">// 01 — ABOUT</div>
          <h2 className="section-title">A bit<br />about me</h2>
          <div className="about-grid">
            <div className="about-text">
              <p>I'm <strong>Mohamed Ahmed Abdelhamid</strong>, a Computer & Systems Engineering student at Ain Shams University with a focus on cybersecurity and offensive security.</p>
              <p>My passion lies in <strong>ethical hacking</strong> — understanding how attackers think, what they target, and how to build robust defenses. I spend my time on CTF platforms, studying exploits, and sharpening my skills across the offensive security stack.</p>
              <p>Outside of class and labs, I'm constantly chasing new CVEs, reading security research, and building tools that automate the boring parts of recon so I can focus on the interesting ones.</p>
            </div>
            <div className="about-stats">
              {[
                { num: "10+", label: "CTFs Completed" },
                { num: "5+", label: "Tools Built" },
                { num: "3+", label: "Years Learning" },
                { num: "∞", label: "Curiosity Level" },
              ].map(s => (
                <div className="stat-box" key={s.label}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" ref={skillsRef}>
          <div className="section-label">// 02 — SKILLS</div>
          <h2 className="section-title">Technical<br />Arsenal</h2>
          <div className="skills-grid">
            {skills.map((s) => (
              <div className="skill-card" key={s.name}>
                <div className="skill-icon">{s.icon}</div>
                <div className="skill-name">{s.name}</div>
                <div className="skill-desc">{s.desc}</div>
                <div className="skill-bar-wrap">
                  <div className="skill-bar" style={{ width: skillsVisible ? `${s.level}%` : "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="section-label">// 03 — PROJECTS</div>
          <h2 className="section-title">Selected<br />Work</h2>
          <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px solid rgba(0,255,65,0.12)", background: "var(--surface)" }}>
            <div style={{ fontSize: "0.65rem", color: "var(--green)", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "1rem" }}>// STATUS: IN PROGRESS</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "var(--text)", marginBottom: "1rem" }}>
              Working on something you can't imagine.
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Stay tuned. <span className="cursor-blink" /></div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="section-label">// 04 — CONTACT</div>
          <h2 className="section-title">Let's<br />Connect</h2>
          <div className="contact-inner">
            <div>
              <p className="contact-blurb">
                Whether you're looking to collaborate on security research, discuss CTF challenges, or just want to talk offensive security — my inbox is open.
              </p>
              <div className="contact-links">
                <a className="contact-link" href="mailto:mohameddabdelhamid@gmail.com">📧 &nbsp;mohameddabdelhamid@gmail.com</a>
                <a className="contact-link" href="https://linkedin.com/in/mohamed-ahmed-abdelhamid" target="_blank" rel="noreferrer">🔗 &nbsp;linkedin.com/in/mohamed-ahmed-abdelhamid</a>
                <a className="contact-link" href="https://github.com/MohamedAbdelhamid0" target="_blank" rel="noreferrer">🐙 &nbsp;github.com/MohamedAbdelhamid0</a>
              </div>
            </div>
            <div className="contact-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" type="text" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" rows={5} placeholder="What's on your mind?" />
              </div>
              <button className="btn-primary" style={{ alignSelf: "flex-start" }}>Send Message</button>
            </div>
          </div>
        </section>

        <footer className="footer">
          <span>© 2026 Mohamed Ahmed Abdelhamid</span>
          <span>CESS · Ain Shams University · Cairo, EG</span>
        </footer>
      </div>
    </>
  );
}