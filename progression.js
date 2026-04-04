// ============================================================
// KORA ACADEMY — PROGRESSION.JS
// Gestion de la progression, médaille pixel, navigation
// ============================================================

const KORA_PROG = {

  // Config des modules
  modules: [
    { id: 'codage1', file: 'formation-codage.html',  name: 'C\'est quoi le HTML',       parties: 5 },
    { id: 'codage2', file: 'formation-codage2.html', name: 'La structure d\'une page',   parties: 5 },
    { id: 'codage3', file: 'formation-codage3.html', name: 'Titres, textes, listes',     parties: 5 },
    { id: 'codage4', file: 'formation-codage4.html', name: 'Liens et images',             parties: 4 },
    { id: 'codage5', file: 'formation-codage5.html', name: 'Les formulaires',             parties: 5 },
    { id: 'codage6', file: 'formation-codage6.html', name: 'Les tableaux',                parties: 3 },
    { id: 'codage7', file: 'formation-codage7.html', name: 'HTML sémantique',             parties: 4 },
    { id: 'codage8', file: 'formation-codage8.html', name: 'Évaluation + Certification', parties: 1 },
  ],

  // ── Sauvegarde ──────────────────────────────────────────
  save(moduleId, partiesDone) {
    const data = this.load();
    if (!data[moduleId] || data[moduleId] < partiesDone) {
      data[moduleId] = partiesDone;
    }
    localStorage.setItem('kora_prog', JSON.stringify(data));
  },

  load() {
    try { return JSON.parse(localStorage.getItem('kora_prog')) || {}; }
    catch { return {}; }
  },

  // Marquer un module comme complété
  complete(moduleId) {
    const mod = this.modules.find(m => m.id === moduleId);
    if (mod) this.save(moduleId, mod.parties);
  },

  // Pourcentage global de la formation codage
  globalPct() {
    const data = this.load();
    let total = 0, done = 0;
    this.modules.forEach(m => {
      total += m.parties;
      done += Math.min(data[m.id] || 0, m.parties);
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  },

  // Prochain module non complété
  nextModule() {
    const data = this.load();
    return this.modules.find(m => (data[m.id] || 0) < m.parties) || null;
  },

  // Module en cours (dernier commencé non terminé)
  currentModule() {
    const data = this.load();
    const inProgress = this.modules.filter(m => {
      const done = data[m.id] || 0;
      return done > 0 && done < m.parties;
    });
    return inProgress[inProgress.length - 1] || this.nextModule();
  },

  // ── Médaille Pixel ───────────────────────────────────────
  // Dessin pixel art d'une médaille (24x24 pixels)
  // Se remplit progressivement selon le % de progression
  MEDAL_PIXELS: [
    // Ligne 0-3 : haut du ruban
    [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0],
    // Ligne 4-6 : jonction ruban/médaille
    [0,0,0,0,0,0,1,2,2,3,3,3,3,3,3,2,2,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,2,2,3,3,3,3,3,3,3,3,2,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,3,3,3,3,3,3,3,3,3,3,2,1,0,0,0,0,0],
    // Ligne 7-16 : corps de la médaille (cercle)
    [0,0,0,0,1,2,3,3,4,4,4,4,4,4,4,4,3,3,2,1,0,0,0,0],
    [0,0,0,1,2,3,3,4,4,4,4,4,4,4,4,4,4,3,3,2,1,0,0,0],
    [0,0,1,2,3,3,4,4,4,5,5,5,5,5,5,4,4,4,3,3,2,1,0,0],
    [0,1,2,3,3,4,4,4,5,5,5,5,5,5,5,5,4,4,4,3,3,2,1,0],
    [0,1,2,3,4,4,4,5,5,5,6,6,6,6,5,5,5,4,4,4,3,2,1,0],
    [1,2,3,3,4,4,5,5,5,6,6,6,6,6,6,5,5,5,4,4,3,3,2,1],
    [1,2,3,4,4,4,5,5,6,6,7,7,7,7,6,6,5,5,4,4,4,3,2,1],
    [1,2,3,4,4,5,5,5,6,7,7,7,7,7,7,6,5,5,5,4,4,3,2,1],
    [1,2,3,4,4,5,5,5,6,7,7,7,7,7,7,6,5,5,5,4,4,3,2,1],
    [1,2,3,4,4,4,5,5,6,6,7,7,7,7,6,6,5,5,4,4,4,3,2,1],
    [1,2,3,3,4,4,5,5,5,6,6,6,6,6,6,5,5,5,4,4,3,3,2,1],
    [0,1,2,3,4,4,4,5,5,5,6,6,6,6,5,5,5,4,4,4,3,2,1,0],
    [0,1,2,3,3,4,4,4,5,5,5,5,5,5,5,5,4,4,4,3,3,2,1,0],
    [0,0,1,2,3,3,4,4,4,5,5,5,5,5,5,4,4,4,3,3,2,1,0,0],
    [0,0,0,1,2,3,3,4,4,4,4,4,4,4,4,4,4,3,3,2,1,0,0,0],
    [0,0,0,0,1,2,3,3,4,4,4,4,4,4,4,4,3,3,2,1,0,0,0,0],
    [0,0,0,0,0,1,2,3,3,3,4,4,4,4,3,3,3,2,1,0,0,0,0,0],
  ],

  // Couleurs selon niveau (index dans MEDAL_PIXELS)
  // 0 = transparent, 1-7 = niveaux de la médaille
  getColor(level, pct, filled) {
    if (level === 0) return 'transparent';
    // Couleurs de base (médaille non remplie)
    const baseColors = ['transparent','#C8B8A2','#BFA890','#B09880','#D4943A','#C4622D','#6B1F2A','#4A1520'];
    // Couleurs remplies (dorées)
    const goldColors = ['transparent','#F5E6B0','#F0D898','#E8C860','#FFD700','#FFC200','#E8A000','#C88000'];
    return filled ? goldColors[level] : baseColors[level];
  },

  // Dessine la médaille sur un canvas
  drawMedal(canvas, pct) {
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const pixelSize = size / 24;
    const totalPixels = this.MEDAL_PIXELS.flat().filter(v => v > 0).length;
    const filledCount = Math.round((pct / 100) * totalPixels);

    ctx.clearRect(0, 0, size, size);

    // Ordre de remplissage : du centre vers l'extérieur (niveau 7 → 1)
    let filled = 0;
    // On compte d'abord les pixels par niveau pour le remplissage progressif
    const pixelsByLevel = [];
    for (let level = 7; level >= 1; level--) {
      this.MEDAL_PIXELS.forEach((row, y) => {
        row.forEach((val, x) => {
          if (val === level) pixelsByLevel.push({ x, y, level });
        });
      });
    }

    // Dessine chaque pixel
    this.MEDAL_PIXELS.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val === 0) return;
        // Détermine si ce pixel est "rempli"
        const pixelIdx = pixelsByLevel.findIndex(p => p.x === x && p.y === y);
        const isFilled = pixelIdx !== -1 && pixelIdx < filledCount;
        const color = this.getColor(val, pct, isFilled);
        if (color === 'transparent') return;
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

        // Effet pixel (légère bordure pour le look pixel art)
        if (isFilled && val >= 4) {
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize * 0.5, pixelSize * 0.5);
        }
      });
    });

    // Texte % au centre si > 0
    if (pct > 0) {
      const centerX = size / 2;
      const centerY = size / 2 + 2;
      ctx.fillStyle = pct >= 50 ? '#1A0A00' : '#6B1F2A';
      ctx.font = `bold ${Math.round(pixelSize * 3.5)}px 'DM Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pct + '%', centerX, centerY);
    }
  },

  // ── Injection dans academy.html ────────────────────────
  // Appelle cette fonction sur academy.html pour tout afficher
  initAcademy() {
    const data = this.load();
    const pct = this.globalPct();
    const next = this.currentModule();

    // Canvas médaille
    const canvas = document.getElementById('medalCanvas');
    if (canvas) this.drawMedal(canvas, pct);

    // Texte progression
    const pctEl = document.getElementById('progPct');
    if (pctEl) pctEl.textContent = pct + '%';

    const progLabel = document.getElementById('progLabel');
    if (progLabel) {
      if (pct === 0) progLabel.textContent = 'Commence ta formation';
      else if (pct === 100) progLabel.textContent = 'Formation complétée ! 🏆';
      else progLabel.textContent = 'En cours — continue !';
    }

    // Bouton continuer
    const btnContinue = document.getElementById('btnContinue');
    if (btnContinue && next) {
      btnContinue.textContent = pct === 0 ? 'Commencer la formation →' : 'Continuer — ' + next.name + ' →';
      btnContinue.onclick = () => window.location.href = next.file;
      btnContinue.style.display = 'block';
    }

    // État des modules dans le catalogue
    this.modules.forEach(mod => {
      const done = data[mod.id] || 0;
      const modEl = document.getElementById('mod-' + mod.id);
      if (!modEl) return;
      if (done >= mod.parties) {
        modEl.classList.add('done');
        const statusEl = modEl.querySelector('.forma-status');
        if (statusEl) { statusEl.textContent = '✓ Complété'; statusEl.classList.add('active'); }
        modEl.onclick = () => window.location.href = mod.file;
      } else if (done > 0) {
        modEl.classList.add('in-progress');
        const pctMod = Math.round((done / mod.parties) * 100);
        const statusEl = modEl.querySelector('.forma-status');
        if (statusEl) { statusEl.textContent = pctMod + '% — En cours'; statusEl.classList.add('active'); }
        modEl.onclick = () => window.location.href = mod.file;
      }
    });

    // Mini barres de progression sur chaque module
    this.modules.forEach(mod => {
      const bar = document.getElementById('prog-' + mod.id);
      if (!bar) return;
      const done = data[mod.id] || 0;
      const pctMod = Math.round((done / mod.parties) * 100);
      bar.style.width = pctMod + '%';
    });
  },

  // ── Injection dans les pages de formation ─────────────
  // Appelle cette fonction sur chaque page de formation
  initFormation(moduleId) {
    const data = this.load();
    const mod = this.modules.find(m => m.id === moduleId);
    if (!mod) return;

    const done = data[moduleId] || 0;

    // Mini médaille dans le header de la formation
    const canvas = document.getElementById('miniMedal');
    if (canvas) {
      const pct = this.globalPct();
      this.drawMedal(canvas, pct);
    }

    // Barre de progression globale
    const globalBar = document.getElementById('globalFill');
    if (globalBar) globalBar.style.width = this.globalPct() + '%';

    return done;
  },

  // Sauvegarder la progression d'une partie
  savePartie(moduleId, partieNum) {
    this.save(moduleId, partieNum);
    // Mettre à jour la mini médaille si présente
    const canvas = document.getElementById('miniMedal');
    if (canvas) this.drawMedal(canvas, this.globalPct());
    const globalBar = document.getElementById('globalFill');
    if (globalBar) globalBar.style.width = this.globalPct() + '%';
  },

  // Terminer un module et retourner sur academy
  finishModule(moduleId) {
    this.complete(moduleId);
    // Animation avant redirection
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = '0';
    setTimeout(() => window.location.href = 'academy.html', 400);
  }
};

// Auto-init selon la page
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();
  if (page === 'academy.html' || page === '') {
    KORA_PROG.initAcademy();
  }
});
