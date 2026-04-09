import { useState } from "react";

// ─── Design tokens Kora ───────────────────────────────────────────
const C = {
  bg:    "#FAFAFA",
  white: "#FFFFFF",
  line:  "#EFEFEF",
  text:  "#1A1A1A",
  muted: "#737373",
  light: "#B0B0B0",
  b1:    "#6B1F2A",
  b2:    "#C4622D",
  b3:    "#E8956D",
  arc:   "#6BAED6",   // bleu arctique
  grad:  "linear-gradient(135deg, #6B1F2A 0%, #C4622D 50%, #E8956D 100%)",
};

// ─── Données de la leçon ──────────────────────────────────────────
const LESSON = {
  bloc: "CSS Avancé", numero: 3,
  titre: "Flexbox — Aligner sans souffrir",
  pourquoi: {
    texte: "Avant Flexbox, centrer un élément ou mettre des cartes côte à côte demandait des hacks incompréhensibles. Aujourd'hui c'est la base de tout layout : navbar, grilles de services, sections hero. Chaque page que tu construis pour DB Studio en dépend.",
    exemple: "La navbar du site Le Napoléon ? Logo à gauche, liens à droite. C'est du Flexbox."
  },
  regles: [
    { prop: "display: flex",         effet: "Active Flexbox. Les enfants directs deviennent des flex items." },
    { prop: "justify-content",       effet: "Axe horizontal — flex-start · center · flex-end · space-between" },
    { prop: "align-items",           effet: "Axe vertical — flex-start · center · flex-end · stretch" },
    { prop: "flex-direction",        effet: "Axe principal — row (défaut) ou column" },
    { prop: "gap",                   effet: "Espace entre les enfants. Remplace les marges manuelles." },
  ],
  code: `.navbar {
  display: flex;               /* Active Flexbox         */
  justify-content: space-between; /* Logo ← → liens     */
  align-items: center;         /* Centré verticalement   */
  padding: 1rem 2rem;
}

.cartes {
  display: flex;
  gap: 1.5rem;                 /* Espace entre cartes    */
  flex-wrap: wrap;             /* Retour à la ligne auto */
}`,
  exercices: [
    {
      id: 1, type: "qcm",
      question: "Tu veux 3 cartes côte à côte avec un espace égal entre elles. Quelle valeur de justify-content tu utilises ?",
      options: ["flex-start", "center", "space-between", "align-items"],
      bonne: 2,
      explication: "space-between colle le premier élément au début, le dernier à la fin, et distribue le reste entre eux — parfait pour des cartes."
    },
    {
      id: 2, type: "completion",
      question: "Complète le code pour centrer un élément au milieu exact de son conteneur :",
      template: `.hero {\n  display: flex;\n  justify-content: ___;\n  align-items: ___;\n  height: 100vh;\n}`,
      bonnes: ["center", "center"],
      labels: ["justify-content", "align-items"],
      explication: "center sur les deux axes = centrage parfait. Technique universelle pour hero, modales, overlays."
    },
    {
      id: 3, type: "debug",
      question: "Ce code est censé empiler les éléments en colonne. Trouve l'erreur :",
      codeFaux:    `.section {\n  display: flex;\n  flex-direction: rows;\n  gap: 1rem;\n}`,
      codeCorrige: `.section {\n  display: flex;\n  flex-direction: row;\n  gap: 1rem;\n}`,
      options: ["display: flex est de trop", "rows → row (sans s)", "gap est invalide", "Il manque align-items"],
      bonne: 1,
      explication: "rows n'existe pas. La valeur correcte est row (sans s). Pour une colonne : column."
    }
  ],
  resume: [
    "display: flex s'applique au conteneur, pas aux enfants",
    "justify-content = horizontal · align-items = vertical",
    "gap remplace toutes les marges manuelles entre éléments"
  ]
};

// ─── Composants utilitaires ───────────────────────────────────────
function GradText({ children, style = {} }) {
  return (
    <span style={{
      background: C.grad,
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      backgroundClip: "text", ...style
    }}>{children}</span>
  );
}

function Code({ children }) {
  return (
    <pre style={{
      background: "#FDF6F0",
      border: `1px solid rgba(107,31,42,0.1)`,
      borderLeft: `3px solid ${C.b2}`,
      borderRadius: 8, padding: "1rem 1.2rem",
      fontSize: "0.8rem", lineHeight: 1.75,
      color: C.text, overflowX: "auto", margin: 0,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    }}>{children}</pre>
  );
}

function Tag({ children, color = C.arc }) {
  return (
    <span style={{
      background: color + "18", color,
      border: `1px solid ${color}40`,
      borderRadius: 20, padding: "2px 10px",
      fontSize: "0.72rem", fontWeight: 600,
      letterSpacing: "0.06em", textTransform: "uppercase",
    }}>{children}</span>
  );
}

function Btn({ children, onClick, variant = "primary", disabled }) {
  const styles = {
    primary: { background: C.grad, color: "#fff", border: "none" },
    outline:  { background: "transparent", color: C.b1, border: `1px solid rgba(107,31,42,0.22)` },
    ghost:    { background: "transparent", color: C.muted, border: `1px solid ${C.line}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant],
      borderRadius: 22, padding: "10px 24px",
      fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 500,
      cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1,
      transition: "opacity 0.2s",
    }}>{children}</button>
  );
}

// ─── Exercice QCM ─────────────────────────────────────────────────
function ExQCM({ ex, onNext }) {
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState(false);
  const ok = sel === ex.bonne;

  return (
    <div>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: C.text, marginBottom: "1.2rem" }}>{ex.question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.2rem" }}>
        {ex.options.map((opt, i) => {
          let bg = C.white, border = C.line, col = C.muted;
          if (done) {
            if (i === ex.bonne)         { bg="#F0F8F0"; border="#4caf50"; col="#2e7d32"; }
            else if (i===sel && !ok)    { bg="#FDF0F0"; border="#e57373"; col="#c62828"; }
          } else if (sel === i)         { bg="#FDF6F0"; border=C.b2; col=C.b1; }
          return (
            <button key={i} onClick={() => !done && setSel(i)} style={{
              background:bg, border:`1px solid ${border}`, borderRadius:10,
              color:col, padding:"10px 14px", textAlign:"left",
              cursor: done?"default":"pointer", fontSize:"0.88rem",
              fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s",
            }}>
              <span style={{ marginRight:8, opacity:0.45, fontFamily:"'Fraunces',serif" }}>{["A","B","C","D"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      {!done
        ? <Btn onClick={() => setDone(true)} disabled={sel===null}>Valider →</Btn>
        : <div style={{ background: ok?"#F0F8F0":"#FDF0F0", border:`1px solid ${ok?"#4caf50":"#e57373"}`, borderRadius:10, padding:"1rem", marginTop:8 }}>
            <p style={{ fontWeight:600, color: ok?"#2e7d32":"#c62828", marginBottom:4, fontSize:"0.9rem" }}>{ok?"✓ Correct":"✗ Pas tout à fait"}</p>
            <p style={{ color:C.muted, fontSize:"0.85rem", lineHeight:1.6, margin:0 }}>{ex.explication}</p>
            {ok && <div style={{marginTop:10}}><Btn variant="outline" onClick={onNext}>Exercice suivant →</Btn></div>}
            {!ok && <div style={{marginTop:10}}><Btn variant="ghost" onClick={()=>{setSel(null);setDone(false);}}>Réessayer</Btn></div>}
          </div>
      }
    </div>
  );
}

// ─── Exercice Complétion ──────────────────────────────────────────
function ExCompletion({ ex, onNext }) {
  const [vals, setVals] = useState(["", ""]);
  const [done, setDone] = useState(false);
  const ok = vals[0].trim().toLowerCase()===ex.bonnes[0] && vals[1].trim().toLowerCase()===ex.bonnes[1];
  const preview = ex.template.replace("___", vals[0]||"___").replace("___", vals[1]||"___");

  return (
    <div>
      <p style={{ fontSize:"0.95rem", lineHeight:1.7, color:C.text, marginBottom:"1.2rem" }}>{ex.question}</p>
      <div style={{ display:"flex", gap:12, marginBottom:"1rem", flexWrap:"wrap" }}>
        {ex.labels.map((lbl,i) => (
          <div key={i}>
            <label style={{ fontSize:"0.75rem", color:C.muted, display:"block", marginBottom:4, fontFamily:"monospace" }}>{lbl}</label>
            <input value={vals[i]} disabled={done}
              onChange={e => { const n=[...vals]; n[i]=e.target.value; setVals(n); }}
              placeholder="ta réponse…"
              style={{
                border:`1px solid ${done?(ok?"#4caf50":"#e57373"):C.line}`,
                borderRadius:8, padding:"8px 12px", fontSize:"0.85rem",
                fontFamily:"monospace", background:C.white, color:C.text,
                outline:"none", width:160,
              }}/>
          </div>
        ))}
      </div>
      <Code>{preview}</Code>
      <div style={{marginTop:"1rem"}}>
        {!done
          ? <Btn onClick={()=>setDone(true)} disabled={!vals[0]||!vals[1]}>Valider →</Btn>
          : <div style={{ background:ok?"#F0F8F0":"#FDF0F0", border:`1px solid ${ok?"#4caf50":"#e57373"}`, borderRadius:10, padding:"1rem", marginTop:8 }}>
              <p style={{ fontWeight:600, color:ok?"#2e7d32":"#c62828", marginBottom:4, fontSize:"0.9rem" }}>{ok?"✓ Parfait":"✗ Les deux valeurs sont : center / center"}</p>
              <p style={{ color:C.muted, fontSize:"0.85rem", lineHeight:1.6, margin:0 }}>{ex.explication}</p>
              <div style={{marginTop:10}}>
                {ok ? <Btn variant="outline" onClick={onNext}>Exercice suivant →</Btn>
                     : <Btn variant="ghost" onClick={()=>{setVals(["",""]);setDone(false);}}>Réessayer</Btn>}
              </div>
            </div>
        }
      </div>
    </div>
  );
}

// ─── Exercice Débogage ────────────────────────────────────────────
function ExDebug({ ex, onNext }) {
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState(false);
  const ok = sel === ex.bonne;

  return (
    <div>
      <p style={{ fontSize:"0.95rem", lineHeight:1.7, color:C.text, marginBottom:"1rem" }}>{ex.question}</p>
      <div style={{ marginBottom:"1.2rem" }}>
        <p style={{ fontSize:"0.72rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.light, marginBottom:6, fontFamily:"monospace" }}>CODE AVEC ERREUR</p>
        <Code>{ex.codeFaux}</Code>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:"1rem" }}>
        {ex.options.map((opt,i) => {
          let bg=C.white, border=C.line, col=C.muted;
          if (done) {
            if (i===ex.bonne)       { bg="#F0F8F0"; border="#4caf50"; col="#2e7d32"; }
            else if (i===sel&&!ok)  { bg="#FDF0F0"; border="#e57373"; col="#c62828"; }
          } else if (sel===i)       { bg="#FDF6F0"; border=C.b2; col=C.b1; }
          return (
            <button key={i} onClick={()=>!done&&setSel(i)} style={{
              background:bg, border:`1px solid ${border}`, borderRadius:10,
              color:col, padding:"10px 14px", textAlign:"left",
              cursor:done?"default":"pointer", fontSize:"0.88rem",
              fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s",
            }}>{opt}</button>
          );
        })}
      </div>
      {!done
        ? <Btn onClick={()=>setDone(true)} disabled={sel===null}>Valider →</Btn>
        : <div>
            <div style={{ background:ok?"#F0F8F0":"#FDF0F0", border:`1px solid ${ok?"#4caf50":"#e57373"}`, borderRadius:10, padding:"1rem", marginBottom:"1rem" }}>
              <p style={{ fontWeight:600, color:ok?"#2e7d32":"#c62828", marginBottom:4, fontSize:"0.9rem" }}>{ok?"✓ Bonne détection":"✗ Ce n'est pas ça"}</p>
              <p style={{ color:C.muted, fontSize:"0.85rem", lineHeight:1.6, margin:0 }}>{ex.explication}</p>
            </div>
            <p style={{ fontSize:"0.72rem", letterSpacing:"0.08em", textTransform:"uppercase", color:C.light, marginBottom:6, fontFamily:"monospace" }}>CODE CORRIGÉ</p>
            <Code>{ex.codeCorrige}</Code>
            <div style={{marginTop:12}}><Btn variant="outline" onClick={onNext}>Voir le résumé →</Btn></div>
          </div>
      }
    </div>
  );
}

// ─── App principale ───────────────────────────────────────────────
const ETAPES = ["intro","cours","ex-1","ex-2","ex-3","resume"];

export default function KoraLecon() {
  const [etape, setEtape] = useState("intro");
  const idx = ETAPES.indexOf(etape);
  const pct = Math.round((idx / (ETAPES.length-1)) * 100);
  const next = () => setEtape(ETAPES[idx+1]);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>

      {/* ── Sidebar gauche ── */}
      <aside style={{
        width:220, flexShrink:0, background:C.white,
        borderRight:"1px solid transparent", position:"sticky", top:0, height:"100vh",
        padding:"20px 10px", display:"flex", flexDirection:"column",
        boxShadow:"inset -2px 0 0 0 transparent",
        background: C.white,
      }}>
        {/* Ligne dégradée droite */}
        <div style={{ position:"absolute", top:0, right:0, bottom:0, width:2,
          background:"linear-gradient(180deg,#6B1F2A,#C4622D,#E8956D)", opacity:0.5 }}/>

        {/* Logo */}
        <div style={{ marginBottom:28, padding:"4px 6px" }}>
          <div style={{
            background: C.grad, borderRadius:12, padding:"10px 14px",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <span style={{
              fontFamily:"'Fraunces',serif", fontSize:"1.6rem", fontWeight:600,
              color:"#fff", letterSpacing:2,
            }}>KORA</span>
            <span style={{ fontSize:"1rem", marginLeft:4, opacity:0.8 }}>♡</span>
          </div>
        </div>

        {/* Nav */}
        {[["⌂","Pour toi"],["◫","Journal"],["⊹","Formation",true],["○","Profil"]].map(([ic,lbl,active])=>(
          <div key={lbl} style={{
            display:"flex", alignItems:"center", gap:12, padding:"11px 12px",
            borderRadius:10, cursor:"pointer", marginBottom:2,
            background: active ? "rgba(107,31,42,0.05)" : "transparent",
            color: active ? C.b1 : C.muted, fontSize:"0.9rem",
          }}>
            <span style={{ fontSize:"1.1rem" }}>{ic}</span>
            {active ? <GradText style={{ fontWeight:500 }}>{lbl}</GradText> : lbl}
          </div>
        ))}

        <div style={{ marginTop:"auto", borderTop:`1px solid ${C.line}`, paddingTop:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:10 }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:C.grad,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"0.85rem",fontWeight:500 }}>V</div>
            <div>
              <div style={{ fontSize:"0.82rem", fontWeight:500, color:C.text }}>Val</div>
              <GradText style={{ fontSize:"0.72rem" }}>248 KRT</GradText>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Contenu central ── */}
      <main style={{ flex:1, maxWidth:560, background:C.white, borderRight:`1px solid ${C.line}` }}>

        {/* Topbar */}
        <div style={{
          position:"sticky", top:0, zIndex:10,
          background:"rgba(255,255,255,0.95)", backdropFilter:"blur(12px)",
          borderBottom:`1px solid ${C.line}`, padding:"12px 20px",
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:"1rem", color:C.text }}>{LESSON.bloc}</span>
            <span style={{ color:C.light }}>·</span>
            <span style={{ fontSize:"0.82rem", color:C.muted }}>Leçon {LESSON.numero}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:100, height:4, background:C.line, borderRadius:2 }}>
              <div style={{ width:`${pct}%`, height:"100%", background:C.grad, borderRadius:2, transition:"width 0.4s" }}/>
            </div>
            <span style={{ fontSize:"0.75rem", color:C.muted }}>{pct}%</span>
          </div>
        </div>

        <div style={{ padding:"2rem 1.5rem" }}>

          {/* Titre */}
          <div style={{ marginBottom:"2rem" }}>
            <Tag color={C.arc}>CSS Avancé · Leçon {LESSON.numero}</Tag>
            <h1 style={{
              fontFamily:"'Fraunces',serif", fontSize:"clamp(1.5rem,4vw,2rem)",
              fontWeight:400, letterSpacing:"-0.03em", lineHeight:1.2,
              color:C.text, marginTop:"0.8rem",
            }}>
              {LESSON.titre.split("—")[0]}—<em style={{ fontStyle:"italic" }}>
                <GradText>{LESSON.titre.split("—")[1]}</GradText>
              </em>
            </h1>
          </div>

          {/* ── INTRO ── */}
          {etape==="intro" && (
            <div>
              <div style={{ background:"rgba(107,31,42,0.03)", border:`1px solid rgba(107,31,42,0.1)`, borderRadius:14, padding:"1.4rem", marginBottom:"1.2rem" }}>
                <p style={{ fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.b2, marginBottom:"0.8rem", fontWeight:500 }}>POURQUOI TU AS BESOIN DE ÇA</p>
                <p style={{ fontSize:"0.93rem", lineHeight:1.75, color:C.text, marginBottom:"1rem" }}>{LESSON.pourquoi.texte}</p>
                <div style={{ display:"flex", gap:8, alignItems:"flex-start", padding:"10px 12px", background:"rgba(107,31,42,0.04)", borderRadius:8, border:`1px solid rgba(107,31,42,0.08)` }}>
                  <span style={{ color:C.b3, marginTop:1 }}>◈</span>
                  <p style={{ fontSize:"0.85rem", color:C.b1, lineHeight:1.55, margin:0 }}>{LESSON.pourquoi.exemple}</p>
                </div>
              </div>
              <Btn onClick={next}>Commencer →</Btn>
            </div>
          )}

          {/* ── COURS ── */}
          {etape==="cours" && (
            <div>
              <div style={{ border:`1px solid ${C.line}`, borderRadius:14, overflow:"hidden", marginBottom:"1.2rem" }}>
                <div style={{ borderBottom:`1px solid ${C.line}`, padding:"1rem 1.2rem", background:C.white }}>
                  <p style={{ fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.b2, marginBottom:"0.6rem", fontWeight:500 }}>LES PROPRIÉTÉS</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {LESSON.regles.map((r,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"8px 10px", background:i%2===0?"#FAFAFA":C.white, borderRadius:6 }}>
                        <code style={{ color:C.b1, fontSize:"0.78rem", minWidth:200, flexShrink:0, fontFamily:"'JetBrains Mono',monospace" }}>{r.prop}</code>
                        <span style={{ fontSize:"0.82rem", color:C.muted, lineHeight:1.5 }}>{r.effet}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding:"1rem 1.2rem" }}>
                  <p style={{ fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.b2, marginBottom:"0.7rem", fontWeight:500 }}>EXEMPLE — LIS CHAQUE COMMENTAIRE</p>
                  <Code>{LESSON.code}</Code>
                </div>
              </div>
              <Btn onClick={next}>Je comprends — exercice →</Btn>
            </div>
          )}

          {/* ── EXERCICES ── */}
          {etape==="ex-1" && (
            <div style={{ border:`1px solid ${C.line}`, borderRadius:14, padding:"1.4rem" }}>
              <div style={{ display:"flex", gap:8, marginBottom:"1.2rem" }}>
                <Tag color={C.arc}>Exercice 1 / 3</Tag>
                <Tag color={C.b2}>QCM</Tag>
              </div>
              <ExQCM ex={LESSON.exercices[0]} onNext={next}/>
            </div>
          )}

          {etape==="ex-2" && (
            <div style={{ border:`1px solid ${C.line}`, borderRadius:14, padding:"1.4rem" }}>
              <div style={{ display:"flex", gap:8, marginBottom:"1.2rem" }}>
                <Tag color={C.arc}>Exercice 2 / 3</Tag>
                <Tag color={C.b2}>Compléter</Tag>
              </div>
              <ExCompletion ex={LESSON.exercices[1]} onNext={next}/>
            </div>
          )}

          {etape==="ex-3" && (
            <div style={{ border:`1px solid ${C.line}`, borderRadius:14, padding:"1.4rem" }}>
              <div style={{ display:"flex", gap:8, marginBottom:"1.2rem" }}>
                <Tag color={C.arc}>Exercice 3 / 3</Tag>
                <Tag color={C.b2}>Déboguer</Tag>
              </div>
              <ExDebug ex={LESSON.exercices[2]} onNext={next}/>
            </div>
          )}

          {/* ── RÉSUMÉ ── */}
          {etape==="resume" && (
            <div>
              <div style={{ background:"rgba(107,31,42,0.03)", border:`1px solid rgba(107,31,42,0.12)`, borderRadius:14, padding:"1.6rem", marginBottom:"1.2rem" }}>
                <p style={{ fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.b2, marginBottom:"1rem", fontWeight:500 }}>✦ LEÇON TERMINÉE — CE QUE TU RETIENS</p>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:"1.4rem" }}>
                  {LESSON.resume.map((r,i)=>(
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <span style={{ color:C.b3, marginTop:2, flexShrink:0 }}>◈</span>
                      <p style={{ fontSize:"0.9rem", color:C.text, lineHeight:1.65, margin:0 }}>{r}</p>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:`1px solid rgba(107,31,42,0.1)`, paddingTop:"1rem", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:"0.8rem", color:C.muted }}>Les tokens KRT sont accordés à la fin de l'évaluation du bloc, selon ta note.</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <Btn variant="ghost" onClick={()=>setEtape("intro")}>← Revoir</Btn>
                <Btn>Leçon suivante : Grid →</Btn>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Sidebar droite ── */}
      <aside style={{ width:260, flexShrink:0, padding:"20px 14px", display:"flex", flexDirection:"column", gap:14, position:"sticky", top:0, height:"100vh", overflowY:"auto", background:C.white }}>

        {/* Progression bloc */}
        <div style={{ borderRadius:12, border:`1px solid ${C.line}`, padding:"14px", background:C.white }}>
          <p style={{ fontFamily:"'Fraunces',serif", fontSize:"0.9rem", color:C.text, marginBottom:12 }}>Progression CSS</p>
          {[["Sélecteurs & cascade","done"],["Box model","done"],["Flexbox","active"],["Grid","lock"],["Animations","lock"]].map(([lbl,st])=>(
            <div key={lbl} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <div style={{
                width:18, height:18, borderRadius:"50%", flexShrink:0,
                background: st==="done"?C.grad : st==="active"?"rgba(107,31,42,0.08)":C.line,
                border: st==="active"?`2px solid ${C.b2}`:"none",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {st==="done" && <span style={{ color:"#fff", fontSize:"0.6rem" }}>✓</span>}
                {st==="active" && <div style={{ width:6, height:6, borderRadius:"50%", background:C.b2 }}/>}
              </div>
              <span style={{ fontSize:"0.82rem", color: st==="lock"?C.light:C.text }}>{lbl}</span>
              {st==="lock" && <span style={{ fontSize:"0.7rem", color:C.light, marginLeft:"auto" }}>🔒</span>}
            </div>
          ))}
        </div>

        {/* Évaluation */}
        <div style={{ borderRadius:12, border:`1px solid rgba(107,31,42,0.12)`, padding:"14px", background:"rgba(107,31,42,0.02)" }}>
          <p style={{ fontFamily:"'Fraunces',serif", fontSize:"0.9rem", color:C.text, marginBottom:6 }}>Évaluation CSS</p>
          <p style={{ fontSize:"0.78rem", color:C.muted, lineHeight:1.6, marginBottom:12 }}>Termine toutes les leçons pour débloquer l'évaluation et gagner tes KRT.</p>
          <div style={{ background:C.line, height:4, borderRadius:2, marginBottom:10 }}>
            <div style={{ width:"40%", height:"100%", background:C.grad, borderRadius:2 }}/>
          </div>
          <span style={{ fontSize:"0.75rem", color:C.muted }}>3 / 8 leçons terminées</span>
        </div>

      </aside>
    </div>
  );
}
