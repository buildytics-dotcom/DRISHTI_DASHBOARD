import { useState, useEffect, useRef } from "react";

const COLORS = {
  navy: "#0B1929", navyLight: "#112236", navyMid: "#162d47",
  accent: "#00C2FF", accentDim: "#0099CC", accentGlow: "rgba(0,194,255,0.15)",
  gold: "#FFB800", goldDim: "rgba(255,184,0,0.15)",
  green: "#00D68F", greenDim: "rgba(0,214,143,0.12)",
  red: "#FF4D6A", redDim: "rgba(255,77,106,0.12)",
  amber: "#FF9B00", amberDim: "rgba(255,155,0,0.12)",
  purple: "#A78BFA", purpleDim: "rgba(167,139,250,0.12)",
  text: "#E8F4FF", textMid: "#8BA8C4", textDim: "#4A6B8A",
  border: "rgba(0,194,255,0.10)", borderMid: "rgba(0,194,255,0.22)",
};

const signInventory = [
  { cat:"Mandatory", type:"Stop", shape:"Octagon", dim:"600mm / 900mm expressway", bg:"#E24B4A", bgn:"Red", mount:"Shoulder", face:"Single", sheet:"Type IX DG3", rlw:300, rlr:70, rlo:"N/A" },
  { cat:"Mandatory", type:"Give Way", shape:"Inv. triangle", dim:"900mm side", bg:"#f5f5f5", bgn:"White", mount:"Shoulder", face:"Single", sheet:"Type IX DG3", rlw:300, rlr:70, rlo:"70 (red border)" },
  { cat:"Mandatory", type:"No Entry", shape:"Circle", dim:"600mm / 900mm expressway", bg:"#E24B4A", bgn:"Red", mount:"Shoulder", face:"Single", sheet:"Type IX DG3", rlw:300, rlr:70, rlo:"N/A" },
  { cat:"Mandatory", type:"Speed Limit", shape:"Circle", dim:"900mm dia", bg:"#f5f5f5", bgn:"White", mount:"Shoulder", face:"Single", sheet:"Type IX DG3", rlw:300, rlr:70, rlo:"70 (red border)" },
  { cat:"Mandatory", type:"Compulsory Direction", shape:"Circle", dim:"900mm dia", bg:"#185FA5", bgn:"Blue", mount:"Shoulder", face:"Single", sheet:"Type IX DG3", rlw:300, rlr:"—", rlo:"100 (blue bg)" },
  { cat:"Cautionary", type:"General Hazard", shape:"Eq. triangle", dim:"1200mm side", bg:"#f5f5f5", bgn:"White", mount:"Shoulder", face:"Single", sheet:"Type IX DG3", rlw:300, rlr:70, rlo:"70 (red border)" },
  { cat:"Cautionary", type:"Sharp Curve", shape:"Eq. triangle", dim:"1200mm side", bg:"#f5f5f5", bgn:"White", mount:"Shoulder", face:"Single", sheet:"Type IX DG3", rlw:300, rlr:70, rlo:"N/A" },
  { cat:"Cautionary", type:"Road Work Ahead", shape:"Eq. triangle", dim:"1200mm side", bg:"#EF9F27", bgn:"Fluoro yellow", mount:"Shoulder/temp", face:"Single", sheet:"Type XI fluoro", rlw:"—", rlr:"—", rlo:"250 (fluoro yellow)" },
  { cat:"Informatory", type:"Route Marker (NH)", shape:"Rectangle", dim:"900×600mm", bg:"#185FA5", bgn:"Blue", mount:"Shoulder", face:"Single", sheet:"Type IX DG3", rlw:300, rlr:"—", rlo:"100 (blue bg)" },
  { cat:"Informatory", type:"Direction / Place Name", shape:"Rectangle", dim:"up to 2400×1200mm", bg:"#1D9E75", bgn:"Green", mount:"Shoulder/overhead", face:"Single/Double", sheet:"Type XI DG3 HI", rlw:300, rlr:"—", rlo:"60 (green bg)" },
  { cat:"Informatory", type:"Distance to Destination", shape:"Rectangle", dim:"up to 2400×1200mm", bg:"#1D9E75", bgn:"Green", mount:"Shoulder/overhead", face:"Single/Double", sheet:"Type XI DG3 HI", rlw:300, rlr:"—", rlo:"60 (green bg)" },
  { cat:"Informatory", type:"Service Area / Amenity", shape:"Rectangle", dim:"900×600mm", bg:"#185FA5", bgn:"Blue", mount:"Shoulder", face:"Single", sheet:"Type IX DG3", rlw:300, rlr:"—", rlo:"100 (blue bg)" },
  { cat:"Overhead", type:"Lane Control", shape:"Rectangle (gantry)", dim:"Full carriageway width", bg:"#2C2C2A", bgn:"Dark green/black", mount:"Overhead gantry", face:"Double", sheet:"Type XI DG3 HI", rlw:300, rlr:"—", rlo:"60/250" },
  { cat:"Overhead", type:"Direction Sign", shape:"Rectangle (gantry)", dim:"Per lane width", bg:"#1D9E75", bgn:"Green", mount:"Overhead gantry", face:"Double", sheet:"Type XI DG3 HI", rlw:300, rlr:"—", rlo:"60 (green bg)" },
  { cat:"Overhead", type:"Variable Message (VMS)", shape:"Rectangle (gantry)", dim:"Variable", bg:"#2C2C2A", bgn:"Black (LED)", mount:"Overhead gantry", face:"Double", sheet:"N/A (active)", rlw:"—", rlr:"—", rlo:"N/A (active LED)" },
];

const catColor = { Mandatory:"#FF4D6A", Cautionary:"#FF9B00", Informatory:"#00C2FF", Overhead:"#A78BFA" };
const catBg    = { Mandatory:"rgba(255,77,106,0.1)", Cautionary:"rgba(255,155,0,0.1)", Informatory:"rgba(0,194,255,0.1)", Overhead:"rgba(167,139,250,0.1)" };

const phaseData = [
  {
    id:1, label:"Phase 1", title:"Data Acquisition & System Spec",
    progress:100, color:COLORS.green, status:"complete",
    tasks:[
      { done:true, text:"Define project roles & scope", meta:"Universal NHAI NSV module · all corridors" },
      { done:true, text:"Identify NSV platform & sensor stack", meta:"VLP-32C · Trimble Applanix · Ladybug 5+ · Jetson AGX Orin" },
      { done:true, text:"Confirm corridor geometry constraints", meta:"Divided HW · overhead double-sided · shoulder single-sided" },
      { done:true, text:"Validate LiDAR–RL correlation", meta:"Manasreh et al. 2024 · R²=0.824 · confirmed as baseline" },
      { done:true, text:"Build IRC 67-2022 sign inventory", meta:"All types · dimensions · RL thresholds · sheeting grades" },
      { done:true, text:"Confirm baseline data & accuracy target", meta:"Delta LTL-X Mark II · ±5% benchmark" },
      { done:true, text:"Confirm NSV deployment model", meta:"Designing to spec · bolt-on · NHAI integrates" },
      { done:true, text:"IRC 67-2012 vs 2022 delta + standard filter", meta:"Date filter · threshold lookup · no retraining needed" },
      { done:true, text:"Geometry Correction Model (GCM)", meta:"β & α vectors · 3M DG3 decay · CF formula · 4 scenarios · error budget" },
      { done:true, text:"NSV sensor pod specification document", meta:"Physical spec · mounting · power · data I/O · calibration · maintenance" },
    ]
  },
  {
    id:2, label:"Phase 2", title:"Data Pipeline",
    progress:0, color:COLORS.accent, status:"active",
    tasks:[
      { done:false, active:true, text:"Sign detection model (YOLO / RT-DETR)", meta:"Real-time sign face detection from LiDAR + camera · in progress" },
      { done:false, text:"Dynamic angle-correction module", meta:"GCM as real-time pipeline component · per-scan β computation" },
      { done:false, text:"RL estimation model · color + standard stratified", meta:"ExtraTrees · 40 tsfresh features · per color instance" },
      { done:false, text:"Sign asset geo-database schema", meta:"20-field per-sign record · GPS · RL history · compliance status" },
      { done:false, text:"Tunnel mode implementation", meta:"Ambient light detection · segment flag · adjusted calibration" },
    ]
  },
  {
    id:3, label:"Phase 3", title:"Degradation Model",
    progress:0, color:COLORS.gold, status:"queued",
    tasks:[
      { done:false, text:"Time-series model per sign (LSTM / Prophet)", meta:"RL decay trajectory · bi-annual survey cadence" },
      { done:false, text:"80% baseline threshold alert logic", meta:"Per-sign relative · not fixed absolute" },
      { done:false, text:"Color-weighted decay curves · Red priority", meta:"k=2.1 · fastest decay · lowest baseline · first to breach" },
      { done:false, text:"Replacement scheduling output", meta:"Sorted by predicted breach date · contractor zone" },
    ]
  },
  {
    id:4, label:"Phase 4", title:"Reporting & BIM",
    progress:0, color:COLORS.amber, status:"queued",
    tasks:[
      { done:false, text:"IFC tagging · sign assets with RL values", meta:"Per-sign RL + compliance status in IFC schema" },
      { done:false, text:"Per-sign RL timeline dashboard", meta:"Decay curve + threshold overlay + replacement forecast" },
      { done:false, text:"NHAI Data Lake integration", meta:"Feeds alongside existing pavement condition data" },
      { done:false, text:"Automated replacement report generation", meta:"Scheduled · sorted by zone and breach urgency" },
    ]
  },
];

const deliverables = {
  done:[
    { title:"DRISHTI Phase 1 Summary & Action Plan", file:"DRISHTI_Phase1_Summary.docx", desc:"Executive summary · problem statement · system overview · GCM · sign inventory · ML model · action plan", icon:"📄" },
    { title:"NSV Sensor Pod Technical Specification", file:"DRISHTI_NSV_Pod_Spec.docx", desc:"Physical spec · mounting · power budget · data I/O · calibration procedures · maintenance schedule", icon:"📄" },
    { title:"DRISHTI Dashboard — React", file:"DRISHTI_Dashboard.jsx", desc:"Full project dashboard · 6 tabs · phases · sign inventory · GCM · deliverables · Vercel deployable", icon:"⚛️" },
    { title:"GCM Interactive Simulator — React", file:"DRISHTI_GCM.jsx", desc:"4 tabs · simulator · formulas · error budget · data sources · live angular response curve · compliance check", icon:"⚛️" },
  ],
  active:[
    { title:"Sign Detection Model Architecture", file:"", desc:"YOLO / RT-DETR model spec · training data strategy · inference pipeline · in progress", icon:"📄" },
  ],
  pending:[
    { title:"RL Estimation Model Specification", file:"", desc:"ExtraTrees · feature pipeline · color stratification · validation framework", icon:"📄" },
    { title:"Sign Asset Database Schema", file:"", desc:"20-field record · full ERD · indexing strategy · query patterns", icon:"🗄️" },
    { title:"Tunnel Mode Specification", file:"", desc:"Ambient light logic · segment tagging · calibration adjustment procedure", icon:"📄" },
  ]
};

const gcmData = {
  scenarios:[
    { id:"S1", label:"Right shoulder · right lane", beta:"15–25°", error:"±2.8%", color:COLORS.green, status:"Baseline" },
    { id:"S2", label:"Right shoulder · left lane", beta:"45–60°", error:"±4.6%", color:COLORS.amber, status:"Tightest" },
    { id:"S3", label:"Left shoulder / median-side", beta:"20–35°", error:"±3.2%", color:COLORS.accent, status:"Standard" },
    { id:"S4", label:"Overhead gantry · double-sided", beta:"10–60°", error:"±3.5%", color:COLORS.purple, status:"Special" },
  ],
  errorBudget:[
    { label:"GNSS/INS position", value:"±2 cm" },
    { label:"Sign normal (plane fit)", value:"±0.5°" },
    { label:"LiDAR intensity noise", value:"±2%" },
    { label:"3M DG3 model fit", value:"±1.5%" },
    { label:"Combined RSS (S1)", value:"±2.8%", ok:true },
    { label:"Combined RSS (S2)", value:"±4.6%", warn:true },
    { label:"Target (Delta spec)", value:"±5.0% ✓", ok:true },
  ],
  sources:[
    { label:"Lateral offset", value:"Trimble Applanix GPS" },
    { label:"Sign height", value:"VLP-32C plane fit" },
    { label:"Sensor height", value:"Fixed constant (pod install)" },
    { label:"Sign color", value:"Ladybug 5+ color classifier" },
    { label:"Baseline RL", value:"DRISHTI DB (t=0 reading)" },
    { label:"Current raw RL", value:"VLP-32C intensity returns" },
  ],
};

// ── Shared primitives ──────────────────────────────────────────

function AnimatedNumber({ value, suffix="" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const end = parseInt(value);
    if (isNaN(end)) return;
    let start = 0;
    const timer = setInterval(() => {
      start += end / (1200 / 16);
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}{suffix}</span>;
}

function ProgressBar({ value, color, height=5 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(value), 300); }, [value]);
  return (
    <div style={{ height, borderRadius:height/2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
      <div style={{ height:"100%", borderRadius:height/2, width:`${width}%`, background:color,
        transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 8px ${color}60` }} />
    </div>
  );
}

function PulseDot({ color }) {
  return (
    <div style={{ position:"relative", width:10, height:10, flexShrink:0 }}>
      <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:color, opacity:0.3,
        animation:"pulse 2s ease-in-out infinite" }} />
      <div style={{ position:"absolute", inset:2, borderRadius:"50%", background:color }} />
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.3}50%{transform:scale(1.8);opacity:0}}`}</style>
    </div>
  );
}

function StatusDot({ done, active }) {
  if (done) return (
    <div style={{ width:18,height:18,borderRadius:"50%",background:COLORS.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 0 6px ${COLORS.green}80` }}>
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#0B1929" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );
  if (active) return (
    <div style={{ width:18,height:18,borderRadius:"50%",border:`1.5px solid ${COLORS.accent}`,background:`${COLORS.accent}15`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <PulseDot color={COLORS.accent} />
    </div>
  );
  return <div style={{ width:18,height:18,borderRadius:"50%",border:`1.5px solid ${COLORS.textDim}`,flexShrink:0 }} />;
}

function Card({ children, style={}, glow=false }) {
  return (
    <div style={{ background:COLORS.navyLight, border:`0.5px solid ${glow?COLORS.borderMid:COLORS.border}`,
      borderRadius:14, padding:"1.25rem",
      boxShadow:glow?`0 0 28px ${COLORS.accentGlow},inset 0 0 40px rgba(0,194,255,0.02)`:"none", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, color=COLORS.textDim }) {
  return (
    <div style={{ fontSize:10,fontWeight:700,color,letterSpacing:"0.1em",textTransform:"uppercase",
      marginBottom:14,fontFamily:"'DM Mono',monospace",display:"flex",alignItems:"center",gap:8 }}>
      <div style={{ width:16,height:1,background:color,opacity:0.5 }} />{children}
    </div>
  );
}

function MetricCard({ label, value, sub, color=COLORS.accent, suffix="" }) {
  return (
    <Card>
      <div style={{ fontSize:11,color:COLORS.textMid,marginBottom:8,fontFamily:"'DM Mono',monospace",letterSpacing:"0.05em" }}>{label}</div>
      <div style={{ fontSize:28,fontWeight:700,color,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1,marginBottom:6 }}>
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
      <div style={{ fontSize:11,color:COLORS.textDim }}>{sub}</div>
    </Card>
  );
}

function TaskItem({ task }) {
  return (
    <div style={{ display:"flex",gap:10,alignItems:"flex-start",padding:"8px 0",borderBottom:`0.5px solid ${COLORS.border}` }}>
      <StatusDot done={task.done} active={task.active} />
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:13,color:task.done?COLORS.textDim:task.active?COLORS.text:COLORS.textMid,
          textDecoration:task.done?"line-through":"none",lineHeight:1.4,
          fontWeight:task.active?600:400 }}>{task.text}</div>
        <div style={{ fontSize:11,color:COLORS.textDim,marginTop:2 }}>{task.meta}</div>
      </div>
      {task.active && (
        <div style={{ fontSize:10,padding:"2px 8px",borderRadius:20,background:`${COLORS.accent}20`,
          color:COLORS.accent,fontWeight:700,border:`0.5px solid ${COLORS.accent}40`,
          flexShrink:0,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap" }}>In progress</div>
      )}
    </div>
  );
}

function Banner({ color, text, sub }) {
  return (
    <div style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"12px 16px",borderRadius:10,
      background:`${color}12`,border:`0.5px solid ${color}35`,marginBottom:12 }}>
      <PulseDot color={color} />
      <div>
        <div style={{ fontSize:12,color,fontWeight:600 }}>{text}</div>
        {sub && <div style={{ fontSize:11,color,opacity:0.7,marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Tab components ─────────────────────────────────────────────

function SignInventoryTab() {
  const [filter, setFilter] = useState("All");
  const cats = ["All","Mandatory","Cautionary","Informatory","Overhead"];
  const filtered = filter==="All" ? signInventory : signInventory.filter(s=>s.cat===filter);
  return (
    <div>
      <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} style={{
            fontSize:11,padding:"4px 12px",borderRadius:20,cursor:"pointer",fontFamily:"'DM Mono',monospace",
            border:`0.5px solid ${filter===c?(catColor[c]||COLORS.borderMid):COLORS.border}`,
            background:filter===c?(catBg[c]||COLORS.accentGlow):"transparent",
            color:filter===c?(catColor[c]||COLORS.accent):COLORS.textMid,
            fontWeight:filter===c?700:400,transition:"all 0.2s",
          }}>{c}</button>
        ))}
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
          <thead>
            <tr>{["Category","Type","Shape","Dimensions","Background","Mounting","Facing","Sheeting","RL white","RL red","RL other"].map(h=>(
              <th key={h} style={{ padding:"8px 10px",borderBottom:`0.5px solid ${COLORS.borderMid}`,color:COLORS.textDim,fontWeight:600,textAlign:"left",whiteSpace:"nowrap",fontSize:10,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:"'DM Mono',monospace" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((s,i)=>(
              <tr key={i} style={{ borderBottom:`0.5px solid ${COLORS.border}` }}>
                <td style={{ padding:"7px 10px" }}><span style={{ fontSize:10,padding:"2px 7px",borderRadius:10,fontWeight:700,background:catBg[s.cat],color:catColor[s.cat],whiteSpace:"nowrap" }}>{s.cat}</span></td>
                <td style={{ padding:"7px 10px",color:COLORS.text,fontWeight:500,whiteSpace:"nowrap" }}>{s.type}</td>
                <td style={{ padding:"7px 10px",color:COLORS.textMid,whiteSpace:"nowrap" }}>{s.shape}</td>
                <td style={{ padding:"7px 10px",color:COLORS.textMid,whiteSpace:"nowrap" }}>{s.dim}</td>
                <td style={{ padding:"7px 10px" }}><div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:12,height:12,borderRadius:3,background:s.bg,border:"0.5px solid rgba(255,255,255,0.2)",flexShrink:0 }}/><span style={{ color:COLORS.textMid,whiteSpace:"nowrap" }}>{s.bgn}</span></div></td>
                <td style={{ padding:"7px 10px",color:COLORS.textMid,whiteSpace:"nowrap" }}>{s.mount}</td>
                <td style={{ padding:"7px 10px",color:COLORS.textMid,whiteSpace:"nowrap" }}>{s.face}</td>
                <td style={{ padding:"7px 10px",color:COLORS.textMid,fontSize:11,whiteSpace:"nowrap" }}>{s.sheet}</td>
                <td style={{ padding:"7px 10px",color:COLORS.green,fontWeight:700,textAlign:"center" }}>{s.rlw}</td>
                <td style={{ padding:"7px 10px",color:s.rlr!=="—"?COLORS.red:COLORS.textDim,fontWeight:700,textAlign:"center" }}>{s.rlr}</td>
                <td style={{ padding:"7px 10px",color:COLORS.textMid,fontSize:11 }}>{s.rlo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeliverablesTab() {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <Card>
        <SectionTitle color={COLORS.green}>Phase 1 — all issued</SectionTitle>
        {deliverables.done.map((d,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderBottom:`0.5px solid ${COLORS.border}` }}>
            <div style={{ width:32,height:32,borderRadius:8,background:COLORS.greenDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{d.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,color:COLORS.text,fontWeight:600,marginBottom:2 }}>{d.title}</div>
              <div style={{ fontSize:10,color:COLORS.accent,fontFamily:"'DM Mono',monospace",marginBottom:3 }}>{d.file}</div>
              <div style={{ fontSize:11,color:COLORS.textDim }}>{d.desc}</div>
            </div>
            <div style={{ fontSize:10,padding:"3px 8px",borderRadius:20,background:COLORS.greenDim,color:COLORS.green,fontWeight:700,border:`0.5px solid ${COLORS.green}40`,flexShrink:0,fontFamily:"'DM Mono',monospace" }}>Issued</div>
          </div>
        ))}
      </Card>
      <Card glow>
        <SectionTitle color={COLORS.accent}>Phase 2 — in progress</SectionTitle>
        {deliverables.active.map((d,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderBottom:`0.5px solid ${COLORS.border}` }}>
            <div style={{ width:32,height:32,borderRadius:8,background:`${COLORS.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{d.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,color:COLORS.text,fontWeight:600,marginBottom:3 }}>{d.title}</div>
              <div style={{ fontSize:11,color:COLORS.textDim }}>{d.desc}</div>
            </div>
            <div style={{ fontSize:10,padding:"3px 8px",borderRadius:20,background:`${COLORS.accent}20`,color:COLORS.accent,fontWeight:700,border:`0.5px solid ${COLORS.accent}40`,flexShrink:0,fontFamily:"'DM Mono',monospace",display:"flex",alignItems:"center",gap:5 }}>
              <PulseDot color={COLORS.accent} />Active
            </div>
          </div>
        ))}
        <SectionTitle color={COLORS.textDim} style={{ marginTop:12 }}>Phase 2 — pending</SectionTitle>
        {deliverables.pending.map((d,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderBottom:`0.5px solid ${COLORS.border}` }}>
            <div style={{ width:32,height:32,borderRadius:8,background:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{d.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,color:COLORS.textMid,fontWeight:500,marginBottom:3 }}>{d.title}</div>
              <div style={{ fontSize:11,color:COLORS.textDim }}>{d.desc}</div>
            </div>
            <div style={{ fontSize:10,padding:"3px 8px",borderRadius:20,background:"rgba(255,255,255,0.04)",color:COLORS.textDim,fontWeight:700,border:`0.5px solid ${COLORS.border}`,flexShrink:0,fontFamily:"'DM Mono',monospace" }}>Pending</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function GCMTab() {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Card>
          <SectionTitle>Compliance threshold logic</SectionTitle>
          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,background:COLORS.navy,padding:"12px 14px",borderRadius:8,color:COLORS.text,lineHeight:2,border:`0.5px solid ${COLORS.border}` }}>
            <span style={{ color:COLORS.textDim }}>{`// per-sign relative — not a fixed absolute`}</span><br/>
            <span style={{ color:COLORS.accent }}>RL_baseline</span> = first survey (t=0)<br/>
            <span style={{ color:COLORS.accent }}>threshold</span> = RL_baseline × <span style={{ color:COLORS.gold }}>0.80</span><br/><br/>
            <span style={{ color:COLORS.green }}>Pass</span>{"        RL ≥ 80% baseline AND ≥ IRC_min"}<br/>
            <span style={{ color:COLORS.amber }}>Warranty</span>{"    RL < 80% baseline, ≥ IRC_min"}<br/>
            <span style={{ color:COLORS.red }}>Reg. fail</span>{"   RL ≥ 80% baseline, < IRC_min"}<br/>
            <span style={{ color:COLORS.red }}>Critical</span>{"    RL < 80% baseline AND < IRC_min"}
          </div>
        </Card>
        <Card>
          <SectionTitle>Four measurement scenarios</SectionTitle>
          {gcmData.scenarios.map(s=>(
            <div key={s.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`0.5px solid ${COLORS.border}` }}>
              <div style={{ fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:`${s.color}20`,color:s.color,border:`0.5px solid ${s.color}40`,fontFamily:"'DM Mono',monospace",flexShrink:0 }}>{s.id}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12,color:COLORS.text }}>{s.label}</div>
                <div style={{ fontSize:11,color:COLORS.textDim,marginTop:2 }}>β = {s.beta} · RSS error {s.error}</div>
              </div>
              <div style={{ fontSize:10,color:s.color,fontWeight:600 }}>{s.status}</div>
            </div>
          ))}
        </Card>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Card>
          <SectionTitle>GCM formula set</SectionTitle>
          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,background:COLORS.navy,padding:"12px 14px",borderRadius:8,color:COLORS.text,lineHeight:2,border:`0.5px solid ${COLORS.border}` }}>
            <span style={{ color:COLORS.textDim }}>{`// angle computation`}</span><br/>
            {"β = arccos( ("}
            <span style={{ color:COLORS.accent }}>S</span>{"−"}
            <span style={{ color:COLORS.gold }}>P</span>
            {")·"}<span style={{ color:COLORS.green }}>N</span>{" / |"}
            <span style={{ color:COLORS.accent }}>S</span>{"−"}
            <span style={{ color:COLORS.gold }}>P</span>{"| )"}<br/>
            {"α = arccos( ("}
            <span style={{ color:COLORS.purple }}>R</span>{"−"}
            <span style={{ color:COLORS.gold }}>P</span>
            {")·("}<span style={{ color:COLORS.accent }}>S</span>{"−"}
            <span style={{ color:COLORS.gold }}>P</span>{") / ... )"}<br/><br/>
            <span style={{ color:COLORS.textDim }}>{`// 3M DG3 angular model`}</span><br/>
            {"RL(β) = RL₀ · cos"}
            <sup style={{ fontSize:9 }}>k</sup>
            {"(β) · (1 − 0.15·sin²β)"}<br/><br/>
            {"White "}<span style={{ color:COLORS.green }}>1.2</span>
            {" · Yellow "}<span style={{ color:COLORS.gold }}>1.4</span>
            {" · Blue "}<span style={{ color:COLORS.accent }}>1.6</span><br/>
            {"Green "}<span style={{ color:COLORS.amber }}>1.7</span>
            {" · Red "}<span style={{ color:COLORS.red }}>2.1</span>
            {" ← fastest decay"}<br/><br/>
            {"CF = RL(β_std=4°) / RL(β_measured)"}<br/>
            {"RL_final = median(RL_raw[i] · CF[i])"}
          </div>
        </Card>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <Card>
            <SectionTitle>Error budget</SectionTitle>
            {gcmData.errorBudget.map((e,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`0.5px solid ${COLORS.border}`,fontSize:11 }}>
                <span style={{ color:COLORS.textMid }}>{e.label}</span>
                <span style={{ fontWeight:600,color:e.ok?COLORS.green:e.warn?COLORS.amber:COLORS.text }}>{e.value}</span>
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle>NSV data sources</SectionTitle>
            {gcmData.sources.map((s,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`0.5px solid ${COLORS.border}`,fontSize:11,gap:6 }}>
                <span style={{ color:COLORS.textMid,flexShrink:0 }}>{s.label}</span>
                <span style={{ fontWeight:500,color:COLORS.accent,textAlign:"right",fontSize:10 }}>{s.value}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function StandardsTab() {
  const refs = [
    { label:"IRC 67-2022", type:"Primary", color:COLORS.green },
    { label:"IRC 67-2012", type:"Legacy", color:COLORS.amber },
    { label:"IRC 35", type:"Reference", color:COLORS.accent },
    { label:"ASTM E1709", type:"Reference", color:COLORS.accent },
    { label:"ASTM E2832", type:"Reference", color:COLORS.accent },
    { label:"ASTM D4956", type:"Reference", color:COLORS.accent },
    { label:"CIE 54 Ch.9", type:"Reference", color:COLORS.accent },
    { label:"3M DG3 docs", type:"Primary", color:COLORS.green },
    { label:"Manasreh et al. 2024", type:"Research", color:COLORS.purple },
    { label:"Delta LTL-X Mark II spec", type:"Instrument", color:COLORS.textMid },
    { label:"NHAI NSV tender specs", type:"Operational", color:COLORS.textMid },
  ];
  const diffs = [
    { label:"Min sheeting grade", v12:"Type VII", v22:"Type IX" },
    { label:"White RL · expressway", v12:"~250", v22:"~300 cd/lx/m²" },
    { label:"Red RL · expressway", v12:"~50", v22:"~70 cd/lx/m²" },
    { label:"Green RL · expressway", v12:"~45", v22:"~60 cd/lx/m²" },
    { label:"Sign taxonomy", v12:"Same", v22:"Same" },
    { label:"Fluorescent sheeting", v12:"Optional", v22:"Mandated (work zones)" },
  ];
  return (
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
      <Card>
        <SectionTitle>2012 vs 2022 — key differences</SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"auto 1fr 1fr",gap:0,fontSize:12 }}>
          {["Parameter","2012","2022"].map((h,i)=>(
            <div key={i} style={{ padding:"6px 10px",color:i===0?COLORS.textDim:i===1?COLORS.amber:COLORS.green,fontWeight:700,borderBottom:`0.5px solid ${COLORS.borderMid}`,fontSize:10,fontFamily:"'DM Mono',monospace" }}>{h}</div>
          ))}
          {diffs.map((d,i)=>(
            <>
              <div key={`l${i}`} style={{ padding:"6px 10px",color:COLORS.textMid,borderBottom:`0.5px solid ${COLORS.border}`,fontSize:12 }}>{d.label}</div>
              <div key={`v12${i}`} style={{ padding:"6px 10px",color:COLORS.textMid,borderBottom:`0.5px solid ${COLORS.border}` }}>{d.v12}</div>
              <div key={`v22${i}`} style={{ padding:"6px 10px",color:COLORS.text,fontWeight:500,borderBottom:`0.5px solid ${COLORS.border}` }}>{d.v22}</div>
            </>
          ))}
        </div>
        <div style={{ marginTop:12,fontFamily:"'DM Mono',monospace",fontSize:11,background:COLORS.navy,padding:"10px 12px",borderRadius:8,color:COLORS.text,lineHeight:1.9,border:`0.5px solid ${COLORS.border}` }}>
          <span style={{ color:COLORS.textDim }}>{`// post-collection date filter`}</span><br/>
          <span style={{ color:COLORS.accent }}>commission_date</span>{" < 2022 → "}<span style={{ color:COLORS.amber }}>IRC_2012</span><br/>
          <span style={{ color:COLORS.accent }}>commission_date</span>{" ≥ 2022 → "}<span style={{ color:COLORS.green }}>IRC_2022</span><br/>
          <span style={{ color:COLORS.accent }}>commission_date</span>{" = NULL → "}<span style={{ color:COLORS.red }}>manual_review</span>
        </div>
      </Card>
      <Card>
        <SectionTitle>Active references</SectionTitle>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
          {refs.map((r,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:8,background:`${r.color}12`,border:`0.5px solid ${r.color}30` }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:r.color,flexShrink:0 }} />
              <span style={{ fontSize:12,color:COLORS.text,fontWeight:500 }}>{r.label}</span>
              <span style={{ fontSize:10,color:r.color,fontFamily:"'DM Mono',monospace" }}>{r.type}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Main app ───────────────────────────────────────────────────

const TABS = ["Overview","Phases","Deliverables","Sign Inventory","GCM","Standards"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const totalDone = phaseData.reduce((acc,p) => acc + p.tasks.filter(t=>t.done).length, 0);
  const totalTasks = phaseData.reduce((acc,p) => acc + p.tasks.length, 0);

  return (
    <div style={{ minHeight:"100vh",background:COLORS.navy,color:COLORS.text,fontFamily:"'DM Sans',system-ui,sans-serif",paddingBottom:"3rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(0,194,255,0.2);border-radius:3px}
        table{border-spacing:0}
        button{font-family:inherit}
      `}</style>

      {/* ── Header ── */}
      <div style={{ background:COLORS.navyLight,borderBottom:`0.5px solid ${COLORS.border}`,padding:"0 2rem" }}>
        <div style={{ maxWidth:1400,margin:"0 auto",padding:"1.25rem 0",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:16 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${COLORS.accent},${COLORS.accentDim})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 16px ${COLORS.accentGlow}` }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#0B1929" strokeWidth="2"/><path d="M10 6v4l3 2" stroke="#0B1929" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div style={{ fontSize:20,fontWeight:700,color:COLORS.text,fontFamily:"'Space Grotesk',sans-serif",letterSpacing:"-0.02em" }}>DRISHTI</div>
              <div style={{ fontSize:11,color:COLORS.textDim,marginTop:1 }}>Dynamic Retroreflectivity Intelligence System · Universal NHAI NSV Module</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,fontSize:11,padding:"4px 12px",borderRadius:20,background:`${COLORS.accent}15`,color:COLORS.accent,fontWeight:700,border:`0.5px solid ${COLORS.accent}40`,fontFamily:"'DM Mono',monospace" }}>
              <PulseDot color={COLORS.accent} />Phase 2 · Active
            </div>
            <div style={{ fontSize:11,color:COLORS.textDim,fontFamily:"'DM Mono',monospace" }}>April 2026</div>
          </div>
        </div>
        <div style={{ display:"flex",gap:0,maxWidth:1400,margin:"0 auto" }}>
          {TABS.map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{
              fontSize:13,padding:"10px 18px",cursor:"pointer",background:"transparent",border:"none",
              color:activeTab===tab?COLORS.accent:COLORS.textMid,
              fontWeight:activeTab===tab?600:400,
              borderBottom:`2px solid ${activeTab===tab?COLORS.accent:"transparent"}`,
              transition:"all 0.2s",
            }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth:1400,margin:"0 auto",padding:"1.5rem 2rem" }}>

        {activeTab==="Overview" && (
          <div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16 }}>
              <MetricCard label="Overall progress" value={48} suffix="%" sub="Phase 1 complete · Phase 2 active" color={COLORS.accent} />
              <MetricCard label="Tasks completed" value={totalDone} suffix={`/${totalTasks}`} sub="Phase 1 fully closed" color={COLORS.green} />
              <MetricCard label="Phase 1" value={100} suffix="% ✓" sub="All deliverables issued" color={COLORS.green} />
              <MetricCard label="Phase 2" value={0} suffix="% started" sub="Sign detection model active" color={COLORS.accent} />
            </div>

            <Banner color={COLORS.green} text="Phase 1 complete — all 10 tasks done · all 4 deliverables issued" />
            <Banner color={COLORS.accent} text="Phase 2 now active — sign detection model in progress" sub="Proceeding ahead of POC GCM review · changes will be incorporated on feedback" />

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <Card>
                <SectionTitle color={COLORS.green}>Phase 1 — complete</SectionTitle>
                {phaseData[0].tasks.map((t,i)=><TaskItem key={i} task={t}/>)}
                <div style={{ marginTop:12 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:COLORS.textMid,marginBottom:5 }}>
                    <span>Phase 1</span><span style={{ color:COLORS.green,fontWeight:700 }}>100% ✓</span>
                  </div>
                  <ProgressBar value={100} color={COLORS.green} />
                </div>
              </Card>

              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                <Card glow>
                  <SectionTitle color={COLORS.accent}>Phase 2 — active</SectionTitle>
                  {phaseData[1].tasks.map((t,i)=><TaskItem key={i} task={t}/>)}
                  <div style={{ marginTop:12 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:COLORS.textMid,marginBottom:5 }}>
                      <span>Phase 2</span><span style={{ color:COLORS.accent,fontWeight:700 }}>0% — started</span>
                    </div>
                    <ProgressBar value={2} color={COLORS.accent} />
                  </div>
                </Card>

                <Card>
                  <SectionTitle>All phases</SectionTitle>
                  {phaseData.map(p=>(
                    <div key={p.id} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          {p.status==="active" && <PulseDot color={p.color} />}
                          <span style={{ color:COLORS.text,fontWeight:500 }}>{p.label} — {p.title}</span>
                        </div>
                        <span style={{ color:p.color,fontWeight:700,fontFamily:"'DM Mono',monospace",fontSize:11 }}>
                          {p.progress===100?"100% ✓":p.status==="active"?"Active":p.progress+"%"}
                        </span>
                      </div>
                      <ProgressBar value={p.progress || (p.status==="active"?2:0)} color={p.color} height={4} />
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab==="Phases" && (
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {phaseData.map(p=>(
              <Card key={p.id} glow={p.status==="active"} style={{ borderColor:p.status==="complete"?`${p.color}35`:p.status==="active"?`${p.color}40`:COLORS.border }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:10,fontWeight:700,color:p.color,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'DM Mono',monospace",marginBottom:4 }}>{p.label}</div>
                    <div style={{ fontSize:14,fontWeight:600,color:COLORS.text }}>{p.title}</div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:10,padding:"3px 8px",borderRadius:20,background:`${p.color}20`,color:p.color,fontWeight:700,border:`0.5px solid ${p.color}40`,whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace" }}>
                    {p.status==="active" && <PulseDot color={p.color} />}
                    {p.status==="complete"?"Complete ✓":p.status==="active"?"Active":"Queued"}
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:COLORS.textMid,marginBottom:5 }}>
                    <span>{p.tasks.filter(t=>t.done).length}/{p.tasks.length} tasks</span>
                    <span style={{ color:p.color,fontWeight:600 }}>{p.progress===100?"100% ✓":p.status==="active"?"In progress":p.progress+"%"}</span>
                  </div>
                  <ProgressBar value={p.progress || (p.status==="active"?2:0)} color={p.color} height={5} />
                </div>
                {p.tasks.map((t,i)=><TaskItem key={i} task={t}/>)}
              </Card>
            ))}
          </div>
        )}

        {activeTab==="Deliverables" && <DeliverablesTab />}
        {activeTab==="Sign Inventory" && (<Card><SectionTitle>IRC 67-2022 sign inventory — master reference</SectionTitle><SignInventoryTab /></Card>)}
        {activeTab==="GCM" && <GCMTab />}
        {activeTab==="Standards" && <StandardsTab />}
      </div>
    </div>
  );
}
