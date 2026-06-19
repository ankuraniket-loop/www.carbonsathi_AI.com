import { useState, useEffect, useRef } from "react";

const COLORS = {
  primary: "#16A34A",
  secondary: "#22C55E",
  accent: "#84CC16",
  bg: "#F0FDF4",
  dark: "#14532D",
};

const MOCK_USER = {
  name: "Arjun Sharma",
  email: "arjun@carbonsathi.ai",
  role: "Individual",
  carbonScore: 82,
  greenPoints: 1240,
  co2Saved: 23.4,
  moneySaved: 1580,
  streak: 14,
  badge: "Green Warrior",
  rank: 3,
};

const LEADERBOARD = [
  { name: "Priya Verma", points: 2100, co2: 41.2, badge: "Carbon Champion", avatar: "PV" },
  { name: "Rahul Singh", points: 1890, co2: 37.8, badge: "Sustainability Hero", avatar: "RS" },
  { name: "Arjun Sharma", points: 1240, co2: 23.4, badge: "Green Warrior", avatar: "AS", isMe: true },
  { name: "Neha Patel", points: 1100, co2: 21.1, badge: "Green Explorer", avatar: "NP" },
  { name: "Kiran Rao", points: 890, co2: 17.6, badge: "Green Explorer", avatar: "KR" },
  { name: "Sanya Mehta", points: 750, co2: 14.3, badge: "Eco Beginner", avatar: "SM" },
];

const WEEKLY_CO2 = [
  { day: "Mon", saved: 1.2 }, { day: "Tue", saved: 0.8 }, { day: "Wed", saved: 2.1 },
  { day: "Thu", saved: 1.5 }, { day: "Fri", saved: 3.2 }, { day: "Sat", saved: 0.6 }, { day: "Sun", saved: 1.8 },
];

const CHALLENGES = [
  { id: 1, title: "Metro Monday", desc: "Take metro instead of car", points: 50, period: "Daily", completed: true, icon: "🚇" },
  { id: 2, title: "Plastic-Free Week", desc: "Avoid all single-use plastic", points: 200, period: "Weekly", completed: false, icon: "♻️" },
  { id: 3, title: "7-Day Waste Segregation", desc: "Segregate waste every day", points: 150, period: "Weekly", completed: false, icon: "🗂️" },
  { id: 4, title: "Office Energy Saver", desc: "Complete energy checklist 5 days", points: 100, period: "Weekly", completed: false, icon: "⚡" },
  { id: 5, title: "Green Commute Month", desc: "Use public transport for 20+ days", points: 500, period: "Monthly", completed: false, icon: "🌱" },
];

const WASTE_LOGS = [
  { date: "2025-06-15", category: "Dry Waste", weight: 1.2, carbonSaved: 0.8, scrapValue: 18 },
  { date: "2025-06-14", category: "E-Waste", weight: 0.5, carbonSaved: 2.1, scrapValue: 45 },
  { date: "2025-06-13", category: "Wet Waste", weight: 2.0, carbonSaved: 0.4, scrapValue: 5 },
];

const AI_TIPS = [
  "You saved 2.3 kg CO₂ this week! Using a reusable water bottle could save an additional 1 kg per month.",
  "Your commute pattern is great. Switching AC temperature from 22°C to 24°C saves ₹120/month.",
  "You're on a 14-day streak! Keep it up — you're in the top 15% of CarbonSathi users in Delhi.",
  "Your waste segregation score improved 23% this month. Try composting wet waste for bonus points.",
];

function ScoreRing({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#dcfce7" strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={COLORS.primary} strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 70 70)" />
        <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="700" fill={COLORS.dark}>{score}</text>
        <text x="70" y="85" textAnchor="middle" fontSize="12" fill="#6b7280">/ 100</text>
      </svg>
      <span style={{ fontSize: 13, color: COLORS.primary, fontWeight: 600 }}>Carbon Score</span>
    </div>
  );
}

function MiniBar({ data }) {
  const max = Math.max(...data.map(d => d.saved));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{
            width: "100%", background: COLORS.primary,
            height: `${(d.saved / max) * 60}px`,
            borderRadius: "3px 3px 0 0", opacity: 0.8 + (d.saved / max) * 0.2,
            minHeight: 4
          }} />
          <span style={{ fontSize: 10, color: "#6b7280" }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function Badge({ text, color = COLORS.primary }) {
  return (
    <span style={{
      background: color + "20", color, fontSize: 11, fontWeight: 600,
      padding: "2px 10px", borderRadius: 20, border: `1px solid ${color}40`
    }}>{text}</span>
  );
}

function StatCard({ label, value, unit, icon, color = COLORS.primary }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
      padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#6b7280" }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 700, color }}>{value}</span>
        <span style={{ fontSize: 12, color: "#6b7280" }}>{unit}</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// PAGES
// ──────────────────────────────────────────────────────────────────────────────

function Landing({ onLogin }) {
  const [count, setCount] = useState({ co2: 0, cups: 0, commutes: 0, scrap: 0 });
  useEffect(() => {
    const targets = { co2: 23000, cups: 8500, commutes: 5000, scrap: 58000 };
    const step = 40;
    const timer = setInterval(() => {
      setCount(prev => ({
        co2: Math.min(prev.co2 + 580, targets.co2),
        cups: Math.min(prev.cups + 215, targets.cups),
        commutes: Math.min(prev.commutes + 125, targets.commutes),
        scrap: Math.min(prev.scrap + 1450, targets.scrap),
      }));
    }, step);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: "🗂️", title: "Kabadiwala AI", desc: "AI-powered waste classification and scrap value estimator" },
    { icon: "🚇", title: "Commute Tracker", desc: "Log green commutes and calculate emissions avoided" },
    { icon: "🧬", title: "Carbon Twin", desc: "Your personalized sustainability identity and rank" },
    { icon: "🏆", title: "Leaderboards", desc: "Compete with colleagues and earn Green Points" },
    { icon: "📄", title: "ESG Reports", desc: "Auto-generate downloadable impact reports" },
    { icon: "⚡", title: "Energy Saver", desc: "Daily office energy checklist with savings calculator" },
  ];

  const plans = [
    { name: "Free", price: "₹0", features: ["3 modules", "Basic dashboard", "Community leaderboard"], cta: "Get Started" },
    { name: "Pro", price: "₹299/mo", features: ["All modules", "AI coach", "PDF reports", "Priority support"], cta: "Start Trial", highlight: true },
    { name: "Startup", price: "₹1,499/mo", features: ["Up to 20 users", "ESG dashboard", "Custom challenges"], cta: "Contact Sales" },
    { name: "Enterprise", price: "Custom", features: ["Unlimited users", "White-label", "API access", "Dedicated CSM"], cta: "Talk to Us" },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fff" }}>
      {/* NAV */}
      <nav style={{
        padding: "0 24px", height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: "1px solid #e5e7eb",
        position: "sticky", top: 0, background: "#fff", zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🌿</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: COLORS.dark }}>CarbonSathi AI</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onLogin} style={{
            background: "transparent", border: "1px solid #e5e7eb", padding: "8px 18px",
            borderRadius: 8, cursor: "pointer", fontSize: 14, color: COLORS.dark
          }}>Log in</button>
          <button onClick={onLogin} style={{
            background: COLORS.primary, color: "#fff", border: "none",
            padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600
          }}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
        padding: "80px 24px", textAlign: "center"
      }}>
        <Badge text="🇮🇳 Made for India" color={COLORS.primary} />
        <h1 style={{ fontSize: 42, fontWeight: 800, color: COLORS.dark, margin: "16px 0 12px", lineHeight: 1.2 }}>
          India's AI-Powered<br />Sustainability Companion
        </h1>
        <p style={{ fontSize: 18, color: "#4b5563", maxWidth: 560, margin: "0 auto 32px" }}>
          Track sustainability habits, reduce carbon emissions, earn rewards, and generate ESG impact reports.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onLogin} style={{
            background: COLORS.primary, color: "#fff", border: "none",
            padding: "14px 32px", borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 700
          }}>Get Started Free →</button>
          <button style={{
            background: "#fff", color: COLORS.dark, border: `1px solid ${COLORS.primary}`,
            padding: "14px 32px", borderRadius: 10, cursor: "pointer", fontSize: 16
          }}>Book a Demo</button>
        </div>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 16 }}>No credit card required · Free forever plan</p>
      </div>

      {/* IMPACT COUNTER */}
      <div style={{ background: COLORS.dark, padding: "48px 24px" }}>
        <h2 style={{ textAlign: "center", color: "#fff", fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 32 }}>
          Live Community Impact
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, maxWidth: 800, margin: "0 auto" }}>
          {[
            { value: count.co2.toLocaleString(), unit: "kg CO₂ Saved", icon: "🌍" },
            { value: count.cups.toLocaleString(), unit: "Plastic Cups Avoided", icon: "☕" },
            { value: count.commutes.toLocaleString(), unit: "Metro Commutes Logged", icon: "🚇" },
            { value: `₹${count.scrap.toLocaleString()}`, unit: "Scrap Value Recovered", icon: "♻️" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.secondary, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#86efac" }}>{s.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: "64px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, color: COLORS.dark, marginBottom: 8 }}>Everything you need to go green</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 40 }}>6 powerful modules for individuals, teams, and enterprises</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              border: "1px solid #e5e7eb", borderRadius: 14, padding: "24px 20px",
              transition: "box-shadow 0.2s"
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ background: COLORS.bg, padding: "64px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, color: COLORS.dark, marginBottom: 8 }}>Simple, transparent pricing</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 40 }}>Start free. Upgrade as you grow.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, maxWidth: 900, margin: "0 auto" }}>
          {plans.map((p, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, padding: 24,
              border: p.highlight ? `2px solid ${COLORS.primary}` : "1px solid #e5e7eb",
              position: "relative"
            }}>
              {p.highlight && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: COLORS.primary, color: "#fff", fontSize: 11, padding: "3px 12px", borderRadius: 20, fontWeight: 600
                }}>Most Popular</div>
              )}
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark }}>{p.name}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.primary, margin: "8px 0" }}>{p.price}</div>
              <ul style={{ margin: "12px 0 20px", paddingLeft: 0, listStyle: "none" }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ fontSize: 13, color: "#4b5563", padding: "4px 0" }}>✓ {f}</li>
                ))}
              </ul>
              <button onClick={onLogin} style={{
                width: "100%", padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
                background: p.highlight ? COLORS.primary : "transparent",
                color: p.highlight ? "#fff" : COLORS.primary,
                border: `1px solid ${COLORS.primary}`
              }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: COLORS.dark, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>🌿 CarbonSathi AI</div>
        <div style={{ fontSize: 13, color: "#86efac" }}>Turning Daily Habits Into Climate Action</div>
        <div style={{ fontSize: 12, color: "#4ade80", marginTop: 16 }}>© 2025 CarbonSathi AI · Built for Bharat 🇮🇳</div>
      </div>
    </div>
  );
}

function Dashboard({ user, setPage }) {
  const tip = AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)];
  const weeklyTotal = WEEKLY_CO2.reduce((a, b) => a + b.saved, 0).toFixed(1);

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #16A34A, #14532D)", padding: "28px 24px", color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Welcome back,</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{user.name} 👋</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <Badge text={`🔥 ${user.streak}-day streak`} color="#fff" />
          <Badge text={`🏅 ${user.badge}`} color="#fff" />
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* Score + quick stats */}
        <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap" }}>
          <div style={{
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14,
            padding: 20, display: "flex", flexDirection: "column", alignItems: "center",
            minWidth: 150, flex: "0 0 auto"
          }}>
            <ScoreRing score={user.carbonScore} />
            <Badge text={user.badge} color={COLORS.primary} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1, minWidth: 0 }}>
            <StatCard label="Green Points" value={user.greenPoints.toLocaleString()} unit="pts" icon="💚" color="#16A34A" />
            <StatCard label="CO₂ Saved" value={user.co2Saved} unit="kg" icon="🌍" color="#0891b2" />
            <StatCard label="Money Saved" value={`₹${user.moneySaved}`} unit="" icon="💰" color="#9333ea" />
            <StatCard label="Rank" value={`#${user.rank}`} unit="global" icon="🏆" color="#d97706" />
          </div>
        </div>

        {/* Weekly Chart */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: COLORS.dark }}>Weekly CO₂ Saved</div>
            <Badge text={`${weeklyTotal} kg total`} color={COLORS.primary} />
          </div>
          <MiniBar data={WEEKLY_CO2} />
          <div style={{ display: "flex", gap: 20, marginTop: 16, borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
            {[
              { label: "Trees equivalent", value: "2.1" },
              { label: "Energy saved", value: "18 kWh" },
              { label: "Car km avoided", value: "121 km" },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.dark }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tip */}
        <div style={{
          background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
          border: "1px solid #bbf7d0", borderRadius: 14, padding: 16, marginTop: 16,
          display: "flex", gap: 12
        }}>
          <span style={{ fontSize: 24 }}>🤖</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, marginBottom: 4 }}>AI Sustainability Coach</div>
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{tip}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.dark, marginBottom: 12 }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "🗂️", label: "Log Waste", page: "kabadiwala" },
              { icon: "🚇", label: "Log Commute", page: "commute" },
              { icon: "⚡", label: "Energy Check", page: "energy" },
              { icon: "☕", label: "Chai Tracker", page: "chai" },
            ].map((a, i) => (
              <button key={i} onClick={() => setPage(a.page)} style={{
                background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
                padding: "14px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                fontSize: 14, fontWeight: 600, color: COLORS.dark
              }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kabadiwala({ user, setUser }) {
  const [mode, setMode] = useState("manual");
  const [form, setForm] = useState({ category: "Dry Waste", weight: "" });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState(WASTE_LOGS);

  const cats = { "Dry Waste": 0.67, "Wet Waste": 0.2, "E-Waste": 4.2, "Hazardous Waste": 2.1 };
  const scrapRates = { "Dry Waste": 15, "Wet Waste": 2, "E-Waste": 90, "Hazardous Waste": 0 };

  const handleAnalyze = () => {
    if (!form.weight) return;
    setAnalyzing(true);
    setTimeout(() => {
      const cs = (parseFloat(form.weight) * cats[form.category]).toFixed(2);
      const sv = Math.round(parseFloat(form.weight) * scrapRates[form.category]);
      setResult({ category: form.category, recyclability: Math.round(65 + Math.random() * 30), carbonSaved: cs, scrapValue: sv });
      setAnalyzing(false);
    }, 1500);
  };

  const handleLog = () => {
    if (!result) return;
    const newLog = { date: new Date().toISOString().split("T")[0], category: result.category, weight: parseFloat(form.weight), carbonSaved: parseFloat(result.carbonSaved), scrapValue: result.scrapValue };
    setLogs([newLog, ...logs]);
    setResult(null); setForm({ category: "Dry Waste", weight: "" });
  };

  const totals = logs.reduce((a, l) => ({ co2: a.co2 + l.carbonSaved, scrap: a.scrap + l.scrapValue, kg: a.kg + l.weight }), { co2: 0, scrap: 0, kg: 0 });

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 28 }}>🗂️</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.dark }}>Kabadiwala AI</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Waste segregation & scrap value tracker</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        <StatCard label="Total Recycled" value={totals.kg.toFixed(1)} unit="kg" icon="♻️" />
        <StatCard label="CO₂ Saved" value={totals.co2.toFixed(1)} unit="kg" icon="🌿" color="#0891b2" />
        <StatCard label="Scrap Value" value={`₹${totals.scrap}`} unit="" icon="💰" color="#9333ea" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: COLORS.dark, marginBottom: 16 }}>Log Waste Entry</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["manual", "photo"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: mode === m ? COLORS.primary : "#f9fafb",
              color: mode === m ? "#fff" : "#374151",
              border: `1px solid ${mode === m ? COLORS.primary : "#e5e7eb"}`
            }}>{m === "manual" ? "✏️ Manual Entry" : "📷 Upload Photo"}</button>
          ))}
        </div>

        {mode === "photo" && (
          <div style={{
            border: "2px dashed #d1d5db", borderRadius: 10, padding: "30px", textAlign: "center",
            background: "#fafafa", marginBottom: 16, cursor: "pointer"
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Tap to upload waste photo for AI classification</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Supports JPG, PNG · Max 5MB</div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Waste Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
              {Object.keys(cats).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Weight (kg)</label>
            <input type="number" placeholder="e.g. 1.5" value={form.weight}
              onChange={e => setForm({ ...form, weight: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, boxSizing: "border-box" }} />
          </div>
        </div>

        <button onClick={handleAnalyze} disabled={analyzing || !form.weight} style={{
          width: "100%", marginTop: 12, padding: "12px", background: COLORS.primary, color: "#fff",
          border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer"
        }}>{analyzing ? "🤖 Analyzing..." : "🔍 Analyze Waste"}</button>

        {result && (
          <div style={{ marginTop: 16, background: "#F0FDF4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 700, color: COLORS.dark, marginBottom: 10 }}>AI Analysis Result</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><div style={{ fontSize: 11, color: "#9ca3af" }}>Category</div><div style={{ fontWeight: 700, color: COLORS.dark }}>{result.category}</div></div>
              <div><div style={{ fontSize: 11, color: "#9ca3af" }}>Recyclability</div><div style={{ fontWeight: 700, color: "#0891b2" }}>{result.recyclability}%</div></div>
              <div><div style={{ fontSize: 11, color: "#9ca3af" }}>CO₂ Saved</div><div style={{ fontWeight: 700, color: COLORS.primary }}>{result.carbonSaved} kg</div></div>
              <div><div style={{ fontSize: 11, color: "#9ca3af" }}>Scrap Value</div><div style={{ fontWeight: 700, color: "#9333ea" }}>₹{result.scrapValue}</div></div>
            </div>
            <button onClick={handleLog} style={{
              width: "100%", marginTop: 12, padding: "10px", background: COLORS.dark, color: "#fff",
              border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer"
            }}>✅ Save to Log</button>
          </div>
        )}
      </div>

      <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.dark, marginBottom: 10 }}>Recent Logs</div>
      {logs.slice(0, 5).map((l, i) => (
        <div key={i} style={{
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px",
          marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.dark }}>{l.category}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{l.date} · {l.weight} kg</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.primary }}>{l.carbonSaved} kg CO₂</div>
            <div style={{ fontSize: 12, color: "#9333ea" }}>₹{l.scrapValue}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Commute() {
  const [mode, setMode] = useState("Metro");
  const [dist, setDist] = useState(10);
  const [logs, setLogs] = useState([
    { date: "2025-06-15", mode: "Metro", dist: 12, saved: 1.81 },
    { date: "2025-06-14", mode: "Cycling", dist: 5, saved: 0.96 },
    { date: "2025-06-13", mode: "Bus", dist: 8, saved: 0.92 },
  ]);

  const emissions = { "Metro": 0.041, "Bus": 0.089, "Walking": 0, "Cycling": 0, "Carpool": 0.096, "Private Car": 0.192 };
  const icons = { "Metro": "🚇", "Bus": "🚌", "Walking": "🚶", "Cycling": "🚴", "Carpool": "🚗", "Private Car": "🚙" };
  const saved = ((0.192 - emissions[mode]) * dist).toFixed(2);

  const handleLog = () => {
    setLogs([{ date: new Date().toISOString().split("T")[0], mode, dist, saved: parseFloat(saved) }, ...logs]);
  };

  const totalSaved = logs.reduce((a, l) => a + l.saved, 0).toFixed(1);

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 28 }}>🚇</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.dark }}>Commute Tracker</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Track green commutes & carbon savings</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <StatCard label="Total CO₂ Saved" value={totalSaved} unit="kg" icon="🌿" />
        <StatCard label="Total Commutes" value={logs.length} unit="trips" icon="🚇" color="#0891b2" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: COLORS.dark, marginBottom: 16 }}>Log Today's Commute</div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 8 }}>Transport Mode</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.keys(emissions).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: "8px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                background: mode === m ? COLORS.primary : "#f9fafb",
                color: mode === m ? "#fff" : "#374151",
                border: `1px solid ${mode === m ? COLORS.primary : "#e5e7eb"}`,
                fontWeight: mode === m ? 700 : 400
              }}>{icons[m]} {m}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Distance: <strong>{dist} km</strong></label>
          <input type="range" min="1" max="60" value={dist} onChange={e => setDist(parseInt(e.target.value))}
            style={{ width: "100%" }} />
        </div>

        {mode !== "Private Car" && (
          <div style={{ background: "#F0FDF4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#374151" }}>
              Taking {mode} instead of a car saves:
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.primary, marginTop: 4 }}>{saved} kg CO₂</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>≈ {(parseFloat(saved) * 1.2).toFixed(1)} km of car emissions avoided</div>
          </div>
        )}

        {mode === "Private Car" && (
          <div style={{ background: "#FEF2F2", border: "1px solid #fecaca", borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#dc2626" }}>⚠️ Consider switching to Metro or Bus to earn Green Points!</div>
          </div>
        )}

        <button onClick={handleLog} style={{
          width: "100%", padding: "12px", background: COLORS.primary, color: "#fff",
          border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer"
        }}>✅ Log Commute</button>
      </div>

      <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.dark, marginBottom: 10 }}>Recent Commutes</div>
      {logs.map((l, i) => (
        <div key={i} style={{
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px",
          marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.dark }}>{icons[l.mode] || "🚌"} {l.mode}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{l.date} · {l.dist} km</div>
          </div>
          <Badge text={`${l.saved} kg CO₂ saved`} color={COLORS.primary} />
        </div>
      ))}
    </div>
  );
}

function Chai() {
  const [logs, setLogs] = useState([
    { date: "2025-06-15", type: "Ceramic Mug", count: 3, pts: 30 },
    { date: "2025-06-14", type: "Kulhad", count: 2, pts: 16 },
  ]);
  const [type, setType] = useState("Ceramic Mug");
  const [count, setCount] = useState(1);

  const options = [
    { type: "Ceramic Mug", pts: 10, icon: "☕", color: "#16A34A" },
    { type: "Kulhad", pts: 8, icon: "🏺", color: "#d97706" },
    { type: "Plastic Cup", pts: -5, icon: "🥤", color: "#dc2626" },
  ];

  const handleLog = () => {
    const opt = options.find(o => o.type === type);
    setLogs([{ date: new Date().toISOString().split("T")[0], type, count, pts: opt.pts * count }, ...logs]);
  };

  const plasticAvoided = logs.filter(l => l.type !== "Plastic Cup").reduce((a, l) => a + l.count, 0);
  const totalPts = logs.reduce((a, l) => a + l.pts, 0);

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 28 }}>☕</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.dark }}>Chai & Chutney Tracker</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Track your sustainable beverage habits</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <StatCard label="Plastic Cups Avoided" value={plasticAvoided} unit="cups" icon="♻️" />
        <StatCard label="Green Points Earned" value={Math.max(0, totalPts)} unit="pts" icon="💚" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: COLORS.dark, marginBottom: 16 }}>Log Today's Beverage</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {options.map(o => (
            <button key={o.type} onClick={() => setType(o.type)} style={{
              flex: 1, padding: "14px 8px", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${type === o.type ? o.color : "#e5e7eb"}`,
              background: type === o.type ? o.color + "10" : "#f9fafb",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4
            }}>
              <span style={{ fontSize: 24 }}>{o.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: o.color }}>{o.pts > 0 ? "+" : ""}{o.pts} pts</span>
              <span style={{ fontSize: 11, color: "#374151" }}>{o.type}</span>
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Number of cups: {count}</label>
          <input type="range" min="1" max="10" value={count} onChange={e => setCount(parseInt(e.target.value))} style={{ width: "100%" }} />
        </div>

        <button onClick={handleLog} style={{
          width: "100%", padding: "12px", background: COLORS.primary, color: "#fff",
          border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer"
        }}>✅ Log Beverages</button>
      </div>

      <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.dark, marginBottom: 10 }}>Recent Logs</div>
      {logs.map((l, i) => (
        <div key={i} style={{
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px",
          marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.dark }}>{l.type} × {l.count}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{l.date}</div>
          </div>
          <Badge text={`${l.pts > 0 ? "+" : ""}${l.pts} pts`} color={l.pts > 0 ? COLORS.primary : "#dc2626"} />
        </div>
      ))}
    </div>
  );
}

function Energy() {
  const items = [
    { id: "ac", label: "AC Off During Lunch (1hr)", kWh: 1.5, co2: 1.2, money: 12 },
    { id: "lights", label: "Lights Off When Leaving", kWh: 0.3, co2: 0.24, money: 2.4 },
    { id: "projector", label: "Projector Off After Meeting", kWh: 0.4, co2: 0.32, money: 3.2 },
    { id: "laptop", label: "Laptop on Power Saver Mode", kWh: 0.2, co2: 0.16, money: 1.6 },
    { id: "ac2", label: "AC at 24°C (not 22°C)", kWh: 0.8, co2: 0.64, money: 6.4 },
  ];
  const [checked, setChecked] = useState({});
  const [saved, setSaved] = useState(false);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const totals = items.filter(i => checked[i.id]).reduce((a, i) => ({
    kWh: a.kWh + i.kWh, co2: a.co2 + i.co2, money: a.money + i.money
  }), { kWh: 0, co2: 0, money: 0 });

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 28 }}>⚡</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.dark }}>Energy Saver</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Daily office energy checklist</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        <StatCard label="Energy Saved" value={totals.kWh.toFixed(1)} unit="kWh" icon="⚡" />
        <StatCard label="CO₂ Saved" value={totals.co2.toFixed(2)} unit="kg" icon="🌿" color="#0891b2" />
        <StatCard label="Money Saved" value={`₹${totals.money.toFixed(0)}`} unit="" icon="💰" color="#9333ea" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: COLORS.dark, marginBottom: 16 }}>Today's Checklist</div>
        {items.map(item => (
          <div key={item.id} onClick={() => toggle(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px",
            borderRadius: 8, cursor: "pointer", marginBottom: 6,
            background: checked[item.id] ? "#F0FDF4" : "#f9fafb",
            border: `1px solid ${checked[item.id] ? "#bbf7d0" : "#e5e7eb"}`
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked[item.id] ? COLORS.primary : "#d1d5db"}`,
              background: checked[item.id] ? COLORS.primary : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 14, flexShrink: 0
            }}>{checked[item.id] ? "✓" : ""}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: checked[item.id] ? 700 : 400, color: COLORS.dark }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Saves {item.kWh} kWh · {item.co2} kg CO₂ · ₹{item.money}/day</div>
            </div>
          </div>
        ))}

        <button onClick={() => setSaved(true)} style={{
          width: "100%", marginTop: 12, padding: "12px", background: COLORS.primary, color: "#fff",
          border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer"
        }}>
          {saved ? "✅ Saved for Today!" : "Save Daily Log"}
        </button>
      </div>
    </div>
  );
}

function CarbonTwin({ user }) {
  const ranks = ["Eco Beginner", "Green Explorer", "Green Warrior", "Sustainability Hero", "Carbon Champion"];
  const rankIdx = ranks.indexOf(user.badge);
  const nextRank = ranks[rankIdx + 1];

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.dark, marginBottom: 20 }}>🧬 Carbon Twin</div>

      {/* Avatar card */}
      <div style={{
        background: "linear-gradient(135deg, #16A34A, #14532D)", borderRadius: 20,
        padding: 28, textAlign: "center", color: "#fff", marginBottom: 20
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
          margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36
        }}>🌿</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</div>
        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 12 }}>{user.badge}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          <div><div style={{ fontSize: 22, fontWeight: 800 }}>{user.carbonScore}</div><div style={{ fontSize: 11, opacity: 0.8 }}>Score</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 800 }}>#{user.rank}</div><div style={{ fontSize: 11, opacity: 0.8 }}>Rank</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 800 }}>{user.co2Saved}kg</div><div style={{ fontSize: 11, opacity: 0.8 }}>CO₂ Saved</div></div>
        </div>
      </div>

      {/* Rank progress */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: COLORS.dark, marginBottom: 12 }}>Rank Progress</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ranks.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: i <= rankIdx ? COLORS.primary : "#e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 12, flexShrink: 0
              }}>{i <= rankIdx ? "✓" : i + 1}</div>
              <div style={{ fontSize: 14, fontWeight: i === rankIdx ? 700 : 400, color: i === rankIdx ? COLORS.primary : "#6b7280" }}>
                {r} {i === rankIdx && "← You are here"}
              </div>
            </div>
          ))}
        </div>
        {nextRank && <div style={{ marginTop: 14, fontSize: 13, color: "#6b7280", background: "#f9fafb", borderRadius: 8, padding: 10 }}>
          🎯 Complete 3 more challenges to reach <strong>{nextRank}</strong>
        </div>}
      </div>

      {/* Achievements */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
        <div style={{ fontWeight: 700, color: COLORS.dark, marginBottom: 12 }}>Achievements</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "🔥", title: "14-Day Streak", desc: "Logged for 14 days straight" },
            { icon: "🚇", title: "Metro Master", desc: "50+ metro commutes" },
            { icon: "♻️", title: "Waste Warrior", desc: "100 kg recycled" },
            { icon: "☕", title: "Chai Champion", desc: "Never used plastic cup" },
          ].map((a, i) => (
            <div key={i} style={{ background: "#F0FDF4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>{a.title}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Challenges() {
  const [completed, setCompleted] = useState({ 1: true });

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.dark, marginBottom: 20 }}>🎯 Green Challenges</div>

      {["Daily", "Weekly", "Monthly"].map(period => (
        <div key={period} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>{period}</div>
          {CHALLENGES.filter(c => c.period === period).map(c => (
            <div key={c.id} style={{
              background: "#fff", border: `1px solid ${completed[c.id] ? "#bbf7d0" : "#e5e7eb"}`,
              borderRadius: 12, padding: 16, marginBottom: 10,
              background: completed[c.id] ? "#F0FDF4" : "#fff"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, flex: 1 }}>
                  <span style={{ fontSize: 26 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.dark }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{c.desc}</div>
                    <Badge text={`+${c.points} Green Points`} color={COLORS.primary} />
                  </div>
                </div>
                <button onClick={() => setCompleted(p => ({ ...p, [c.id]: !p[c.id] }))} style={{
                  padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
                  background: completed[c.id] ? COLORS.primary : "transparent",
                  color: completed[c.id] ? "#fff" : COLORS.primary,
                  border: `1px solid ${COLORS.primary}`, flexShrink: 0
                }}>{completed[c.id] ? "✓ Done" : "Accept"}</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Leaderboard() {
  const [tab, setTab] = useState("points");

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.dark, marginBottom: 20 }}>🏆 Leaderboard</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["points", "co2", "challenges"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
            background: tab === t ? COLORS.primary : "#f9fafb",
            color: tab === t ? "#fff" : "#374151",
            border: `1px solid ${tab === t ? COLORS.primary : "#e5e7eb"}`
          }}>{t === "points" ? "Green Points" : t === "co2" ? "CO₂ Saved" : "Challenges"}</button>
        ))}
      </div>

      {LEADERBOARD.map((u, i) => (
        <div key={i} style={{
          background: u.isMe ? "#F0FDF4" : "#fff",
          border: `1px solid ${u.isMe ? "#16A34A" : "#e5e7eb"}`,
          borderRadius: 12, padding: "14px 16px", marginBottom: 8,
          display: "flex", alignItems: "center", gap: 12
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: i < 3 ? ["#FFD700", "#C0C0C0", "#CD7F32"][i] : "#e5e7eb",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14, color: i < 3 ? "#78350f" : "#6b7280"
          }}>#{i + 1}</div>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", background: COLORS.primary + "20",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, color: COLORS.primary, flexShrink: 0
          }}>{u.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>{u.name} {u.isMe && <Badge text="You" color={COLORS.primary} />}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{u.badge}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700, color: COLORS.primary }}>{tab === "co2" ? `${u.co2} kg` : `${u.points} pts`}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Report() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 28 }}>📄</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.dark }}>ESG Impact Report</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Auto-generate downloadable PDF report</div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: COLORS.dark, marginBottom: 16 }}>Report Preview — June 2025</div>
        {[
          { label: "Total CO₂ Saved", value: "23.4 kg", icon: "🌍" },
          { label: "Waste Recycled", value: "8.7 kg", icon: "♻️" },
          { label: "Energy Saved", value: "42.3 kWh", icon: "⚡" },
          { label: "Green Points Earned", value: "1,240 pts", icon: "💚" },
          { label: "Plastic Cups Avoided", value: "47 cups", icon: "☕" },
          { label: "Trees Equivalent", value: "1.1 trees", icon: "🌳" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 5 ? "1px solid #f3f4f6" : "none" }}>
            <span style={{ fontSize: 14, color: "#374151" }}>{s.icon} {s.label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: COLORS.dark, marginBottom: 10 }}>AI Recommendations</div>
        {[
          "Switch to cycling for distances under 3 km — could save additional 1.8 kg CO₂/month",
          "Compost wet waste to earn bonus Green Points and reduce landfill methane",
          "Enabling laptop power saver mode daily could save ₹48/month",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid #f3f4f6" : "none" }}>
            <span style={{ color: COLORS.primary, fontWeight: 700 }}>→</span>
            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{tip}</span>
          </div>
        ))}
      </div>

      <button onClick={() => { setGenerating(true); setTimeout(() => { setGenerating(false); setGenerated(true); }, 2000); }} style={{
        width: "100%", padding: "14px", background: generated ? "#059669" : COLORS.primary, color: "#fff",
        border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer"
      }}>
        {generating ? "⏳ Generating PDF..." : generated ? "✅ PDF Ready — Download" : "📥 Generate PDF Report"}
      </button>
    </div>
  );
}

function Auth({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "demo@carbonsathi.ai", password: "demo123", role: "Individual" });

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center",
      justifyContent: "center", padding: 20, fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 380, border: "1px solid #e5e7eb" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🌿</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: COLORS.dark }}>CarbonSathi AI</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Turning Daily Habits Into Climate Action</div>
        </div>

        <div style={{ display: "flex", gap: 0, marginBottom: 24, border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "10px", background: tab === t ? COLORS.primary : "#fff",
              color: tab === t ? "#fff" : "#374151", border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 14
            }}>{t === "login" ? "Log In" : "Sign Up"}</button>
          ))}
        </div>

        {tab === "register" && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Full Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Arjun Sharma"
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, boxSizing: "border-box" }} />
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Email</label>
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, boxSizing: "border-box" }} />
        </div>

        {tab === "register" && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Account Type</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
              <option>Individual</option><option>Startup</option><option>Organization Admin</option>
            </select>
          </div>
        )}

        <button onClick={onLogin} style={{
          width: "100%", padding: "13px", background: COLORS.primary, color: "#fff",
          border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 4
        }}>{tab === "login" ? "Log In" : "Create Account"}</button>

        {tab === "login" && (
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 12 }}>
            <span style={{ color: "#9ca3af" }}>Demo: </span>
            <span style={{ color: COLORS.primary }}>demo@carbonsathi.ai / demo123</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ──────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | auth | app
  const [page, setPage] = useState("dashboard");
  const [user] = useState(MOCK_USER);

  if (screen === "landing") return <Landing onLogin={() => setScreen("auth")} />;
  if (screen === "auth") return <Auth onLogin={() => setScreen("app")} />;

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "kabadiwala", icon: "🗂️", label: "Waste" },
    { id: "commute", icon: "🚇", label: "Commute" },
    { id: "challenges", icon: "🎯", label: "Goals" },
    { id: "leaderboard", icon: "🏆", label: "Ranks" },
  ];

  const pages = { dashboard: Dashboard, kabadiwala: Kabadiwala, commute: Commute, chai: Chai, energy: Energy, carbontwin: CarbonTwin, challenges: Challenges, leaderboard: Leaderboard, report: Report };
  const PageComp = pages[page] || Dashboard;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 480, margin: "0 auto", background: COLORS.bg, minHeight: "100vh", position: "relative" }}>
      {/* Top bar */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 16px",
        height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18 }}>🌿</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: COLORS.dark }}>CarbonSathi AI</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setPage("carbontwin")} style={{
            background: COLORS.primary + "15", border: "none", padding: "6px 10px",
            borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, color: COLORS.primary
          }}>🧬 Twin</button>
          <button onClick={() => setPage("report")} style={{
            background: "#f9fafb", border: "1px solid #e5e7eb", padding: "6px 10px",
            borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#374151"
          }}>📄 Report</button>
          <button onClick={() => setPage("chai")} style={{
            background: "#f9fafb", border: "1px solid #e5e7eb", padding: "6px 10px",
            borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#374151"
          }}>☕ Chai</button>
          <button onClick={() => setScreen("landing")} style={{
            background: "#f9fafb", border: "1px solid #e5e7eb", padding: "6px 10px",
            borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#6b7280"
          }}>Exit</button>
        </div>
      </div>

      {/* Page content */}
      <div style={{ paddingBottom: 70 }}>
        <PageComp user={user} setUser={() => {}} setPage={setPage} />
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #e5e7eb",
        display: "flex", height: 60, zIndex: 100
      }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", cursor: "pointer", gap: 2,
            borderTop: page === n.id ? `2px solid ${COLORS.primary}` : "2px solid transparent",
          }}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: page === n.id ? 700 : 400, color: page === n.id ? COLORS.primary : "#9ca3af" }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
