// KORA ACADEMY — Navigation globale
// Inclure dans tous les fichiers de formation

var KORA_NAV = {
  chapitres: [
    {
      id: 'html',
      name: 'Chapitre 1 — HTML',
      icon: '🏗',
      modules: [
        {id:'codage1', name:"C'est quoi le HTML",      file:'formation-codage.html',  parties:5},
        {id:'codage2', name:"La structure d'une page", file:'formation-codage2.html', parties:5},
        {id:'codage3', name:"Titres, textes, listes",  file:'formation-codage3.html', parties:5},
        {id:'codage4', name:"Liens et images",          file:'formation-codage4.html', parties:4},
        {id:'codage5', name:"Les formulaires",          file:'formation-codage5.html', parties:5},
        {id:'codage6', name:"Les tableaux",             file:'formation-codage6.html', parties:3},
        {id:'codage7', name:"HTML semantique",          file:'formation-codage7.html', parties:4},
        {id:'codage8', name:"Evaluation finale",        file:'formation-codage8.html', parties:1},
      ]
    },
    {
      id: 'css',
      name: 'Chapitre 2 — CSS',
      icon: '🎨',
      modules: [
        {id:'css1',  name:"C'est quoi le CSS",          file:'css1.html',  parties:5},
        {id:'css2',  name:"Selecteurs",                 file:'css2.html',  parties:5},
        {id:'css3',  name:"Couleurs et fonds",          file:'css3.html',  parties:4},
        {id:'css4',  name:"Texte et typographie",       file:'css4.html',  parties:5},
        {id:'css5',  name:"Le modele de boite",         file:'css5.html',  parties:5},
        {id:'css6',  name:"Display",                    file:'css6.html',  parties:4},
        {id:'css7',  name:"Position et z-index",        file:'css7.html',  parties:4},
        {id:'css8',  name:"Flexbox",                    file:'css8.html',  parties:5},
        {id:'css9',  name:"CSS Grid",                   file:'css9.html',  parties:5},
        {id:'css10', name:"Responsive",                 file:'css10.html', parties:5},
        {id:'css11', name:"Pseudo-classes",             file:'css11.html', parties:4},
        {id:'css12', name:"Variables CSS",              file:'css12.html', parties:3},
        {id:'css13', name:"Transitions et animations",  file:'css13.html', parties:5},
        {id:'css14', name:"Pratique reelle",            file:'css14.html', parties:4},
        {id:'css15', name:"Evaluation finale",          file:'css15.html', parties:1},
      ]
    }
  ],

  getProg: function() {
    try { return JSON.parse(localStorage.getItem('kora_prog')) || {}; }
    catch(e) { return {}; }
  },

  isModuleDone: function(moduleId) {
    var data = this.getProg();
    var mod = null;
    this.chapitres.forEach(function(ch) {
      ch.modules.forEach(function(m) { if(m.id===moduleId) mod=m; });
    });
    return mod && (data[mod.id]||0) >= mod.parties;
  },

  isModuleLocked: function(moduleId) {
    var data = this.getProg();
    var allMods = [];
    this.chapitres.forEach(function(ch) { ch.modules.forEach(function(m){allMods.push(m);}); });
    var idx = allMods.findIndex(function(m){return m.id===moduleId;});
    if(idx===0) return false;
    var prev = allMods[idx-1];
    return (data[prev.id]||0) < prev.parties;
  },

  // Injecter la sidebar de navigation
  injectSidebar: function(currentModuleId) {
    var data = this.getProg();
    var self = this;

    var html = '<div class="kora-nav-sidebar" id="koraSidebar">'
      + '<div class="kns-header">'
      + '<a href="academy.html" class="kns-logo">Kora Academy</a>'
      + '<button class="kns-close" onclick="document.getElementById(\'koraSidebar\').classList.remove(\'open\')">×</button>'
      + '</div>'
      + '<div class="kns-body">';

    this.chapitres.forEach(function(ch) {
      var chDone = ch.modules.every(function(m){return (data[m.id]||0)>=m.parties;});
      html += '<div class="kns-chapitre">'
        + '<div class="kns-ch-title">' + ch.icon + ' ' + ch.name + (chDone?' ✓':'') + '</div>';

      ch.modules.forEach(function(m, i) {
        var done = (data[m.id]||0) >= m.parties;
        var active = m.id === currentModuleId;
        var locked = self.isModuleLocked(m.id);
        var cls = 'kns-module' + (active?' active':'') + (done?' done':'') + (locked?' locked':'');
        var onclick = locked ? '' : 'onclick="window.location.href=\''+m.file+'\'"';
        html += '<div class="'+cls+'" '+onclick+'>'
          + '<div class="kns-mod-num">' + (done ? '✓' : (i+1)) + '</div>'
          + '<div class="kns-mod-name">' + m.name + '</div>'
          + '</div>';
      });

      html += '</div>';
    });

    html += '</div></div>'
      + '<button class="kns-toggle" onclick="document.getElementById(\'koraSidebar\').classList.toggle(\'open\')">'
      + '<span>☰</span><span style="font-size:10px;display:block;margin-top:2px">Plan</span>'
      + '</button>';

    // Styles
    var styles = '<style>'
      + '.kora-nav-sidebar{position:fixed;top:0;left:-280px;width:280px;height:100vh;background:#fff;border-right:1px solid #EFEFEF;z-index:200;transition:left 0.3s ease;display:flex;flex-direction:column;box-shadow:4px 0 20px rgba(0,0,0,0.08)}'
      + '.kora-nav-sidebar.open{left:0}'
      + '.kns-header{padding:16px 18px;border-bottom:1px solid #EFEFEF;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}'
      + '.kns-logo{font-family:"Fraunces",serif;font-size:16px;font-weight:600;background:linear-gradient(135deg,#6B1F2A,#C4622D,#E8956D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-decoration:none}'
      + '.kns-close{width:28px;height:28px;border-radius:50%;border:1px solid #EFEFEF;background:transparent;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#737373}'
      + '.kns-body{flex:1;overflow-y:auto;padding:12px 0}'
      + '.kns-body::-webkit-scrollbar{width:0}'
      + '.kns-chapitre{margin-bottom:8px}'
      + '.kns-ch-title{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#C4622D;font-weight:500;padding:10px 18px 6px;}'
      + '.kns-module{display:flex;align-items:center;gap:10px;padding:9px 18px;cursor:pointer;transition:background 0.15s;border-left:3px solid transparent}'
      + '.kns-module:hover{background:#F5F5F5}'
      + '.kns-module.active{background:rgba(107,31,42,0.05);border-left-color:#C4622D}'
      + '.kns-module.done{opacity:0.65}'
      + '.kns-module.locked{opacity:0.3;cursor:default}'
      + '.kns-module.locked:hover{background:transparent}'
      + '.kns-mod-num{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:500;flex-shrink:0;background:#F0F0F0;color:#737373}'
      + '.kns-module.active .kns-mod-num{background:linear-gradient(135deg,#6B1F2A,#C4622D);color:white}'
      + '.kns-module.done .kns-mod-num{background:rgba(107,31,42,0.08);color:#6B1F2A}'
      + '.kns-mod-name{font-size:12px;color:#1A1A1A;line-height:1.4}'
      + '.kns-module.active .kns-mod-name{font-weight:500;color:#6B1F2A}'
      + '.kns-toggle{position:fixed;bottom:80px;left:16px;z-index:201;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#6B1F2A,#C4622D);border:none;color:white;font-size:16px;cursor:pointer;box-shadow:0 4px 16px rgba(107,31,42,0.3);display:flex;flex-direction:column;align-items:center;justify-content:center}'
      + '@media(min-width:701px){.kns-toggle{bottom:20px}}'
      + '</style>';

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);
  }
};
