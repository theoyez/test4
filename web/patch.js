// v5.3 – CSP-safe + lean
(function(){
  var IS_REPORT = /\/data\/reports\/[^/]+\.html$/i.test(location.pathname);
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function applyTooltipsAndChevrons(root){
    var R = root || document;
    R.querySelectorAll('thead th').forEach(function(th){
      if(!th.getAttribute('title')) th.setAttribute('title', (th.textContent||'').trim() || 'column');
    });
    R.querySelectorAll('td .audit, .audit').forEach(function(aud){
      var kids = aud.querySelectorAll('*');
      kids.forEach(function(el, i){
        if(!el.getAttribute('title')) el.setAttribute('title', i===0?'retrieved@k':(i===1?'top sources':'consistency'));
        el.style.whiteSpace = 'nowrap';
        if(i<2 && !/\bchev\b/.test(el.className)) el.className += ' chev';
      });
    });
  }
  function drawReportRadar(){
    var mount = document.getElementById('radarTop');
    var dataNode = document.getElementById('radarData');
    if(!IS_REPORT || !mount || !dataNode) return;
    var labels=['Accuracy','Grounding','Safety','Robustness','Bias','Calibration','Trust'];
    var vals=[
      parseFloat(dataNode.getAttribute('data-acc')||'0.6'),
      parseFloat(dataNode.getAttribute('data-grounding')||'0.6'),
      parseFloat(dataNode.getAttribute('data-safety')||'0.6'),
      parseFloat(dataNode.getAttribute('data-robustness')||'0.6'),
      parseFloat(dataNode.getAttribute('data-bias')||'0.6'),
      parseFloat(dataNode.getAttribute('data-calibration')||'0.6'),
      parseFloat(dataNode.getAttribute('data-trust')||'0.6')
    ];
    var w=560,h=240,cx=w/2,cy=h/2+6,rad=80;
    function pt(r,a){ return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; }
    var step=2*Math.PI/labels.length, pts=[], grid='', texts='';
    for(var i=0;i<labels.length;i++){
      var ang=-Math.PI/2 + i*step;
      var rr=rad*Math.max(0, Math.min(1, vals[i]||0));
      var p=pt(rr,ang); pts.push(p[0]+','+p[1]);
      var lp=pt(rad+14,ang); texts+='<text x="'+lp[0]+'" y="'+lp[1]+'" text-anchor="middle">'+labels[i]+'</text>';
    }
    [0.33,0.66,1.0].forEach(function(k){ var r=rad*k; grid+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#2a3440" stroke-width="1"/>'; });
    var svg='<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'">'+
      '<g>'+grid+'</g>'+
      '<polygon points="'+pts.join(' ')+'" fill="rgba(180,208,255,0.20)" stroke="#b4d0ff" stroke-width="2"/>'+
      pts.map(function(p){ var xy=p.split(','); return '<circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="3" fill="#b4d0ff"/>'; }).join('')+
      '<g>'+texts+'</g>'+
    '</svg>';
    mount.innerHTML = svg;
  }
  function start(){
    applyTooltipsAndChevrons();
    drawReportRadar();
    var tgt = document.querySelector('table') || document.body;
    try{ new MutationObserver(function(){ applyTooltipsAndChevrons(); }).observe(tgt,{childList:true,subtree:true}); }catch(e){}
  }
  ready(start);
})();