document.addEventListener('DOMContentLoaded',()=>{
  const gallery = document.querySelector('.gallery-grid');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');

  if(gallery){
    gallery.addEventListener('click', e=>{
      const img = e.target.closest('img');
      if(!img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lb.classList.add('lb-open');
      lb.setAttribute('aria-hidden','false');
    });
  }

  if(lbClose) lbClose.addEventListener('click', ()=>{
    lb.classList.remove('lb-open');
    lb.setAttribute('aria-hidden','true');
    lbImg.src = '';
  });

  document.addEventListener('keyup', e=>{
    if(e.key==='Escape' && lb.classList.contains('lb-open')){
      lb.classList.remove('lb-open');
      lb.setAttribute('aria-hidden','true');
      lbImg.src = '';
    }
  });

  /* Feature thumbnails: clicking updates main hero image */
  const featureImage = document.getElementById('featureImage');
  const thumbs = document.getElementById('featureThumbs');
  if(featureImage && thumbs){
    const buttons = Array.from(thumbs.querySelectorAll('.thumb'));
    buttons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const src = btn.getAttribute('data-src');
        const caption = btn.getAttribute('data-caption') || '';
        featureImage.src = src;
        const capEl = document.querySelector('.feature-caption');
        if(capEl) capEl.textContent = caption;
        buttons.forEach(b=> b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // make the first thumbnail active
    const first = buttons[0];
    if(first) first.classList.add('active');

    // clicking main image opens lightbox
    featureImage.addEventListener('click', ()=>{
      if(lb){ lbImg.src = featureImage.src; lb.classList.add('lb-open'); lb.setAttribute('aria-hidden','false'); }
    });
  }

    // trigger entrance animations
    const heroText = document.querySelector('.hero-text.center');
    const featureFrame = document.querySelector('.feature-frame');
    if(heroText) setTimeout(()=> heroText.classList.add('animate'), 150);
    if(featureFrame) setTimeout(()=> featureFrame.classList.add('animate'), 300);

    const galleryFigures = Array.from(document.querySelectorAll('.gallery-grid figure'));
    galleryFigures.forEach((fig,i)=> setTimeout(()=> fig.classList.add('animate'), 350 + i*40));

    // initialize AOS if available
    if(window.AOS){
      AOS.init({duration:600, once:true, easing:'ease-out-cubic'});
    }

    // check for site version updates (cache-busting)
    (function(){
      fetch('/site-version.txt', {cache:'no-store'})
        .then(r=> r.text())
        .then(ver=>{
          if(!ver) return;
          ver = ver.trim();
          try{
            const current = localStorage.getItem('siteVersion');
            if(current && current !== ver){
              // new version available — force a cache-busting navigation
              const next = window.location.pathname + window.location.search + (window.location.search ? '&' : '?') + '_v=' + encodeURIComponent(ver);
              window.location.replace(next);
            } else {
              localStorage.setItem('siteVersion', ver);
            }
          }catch(e){ /* ignore storage errors */ }
        })
        .catch(()=>{});
    })();

    /* Embed external Canva About page in a modal when About nav is clicked */
    (function(){
      const canvaHost = 'snehas-arts.my.canva.site';
      const links = Array.from(document.querySelectorAll('a[href*="' + canvaHost + '"]'));
      const modal = document.getElementById('canvaModal');
      const frame = document.getElementById('canvaFrame');
      const closeBtn = modal ? modal.querySelector('.canva-close') : null;
      let canvaCheckTimer = null;

      function openCanva(href){
        if(!modal || !frame) return;
        frame.src = href;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';

        // if iframe is blocked by X-Frame-Options/CSP, detect and fallback
        if(canvaCheckTimer) clearTimeout(canvaCheckTimer);
        canvaCheckTimer = setTimeout(()=>{
          let blocked = false;
          try{
            // Accessing iframe document will throw on cross-origin access in many cases,
            // but when the resource is blocked from embedding the document may be empty or inaccessible.
            const doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
            if(!doc || !doc.body || doc.body.childNodes.length === 0) blocked = true;
          }catch(e){
            // If access is denied, assume embedding failed and treat as blocked fallback.
            blocked = true;
          }

          if(blocked){
            // close modal and open in new tab
            try{ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }catch(e){}
            try{ frame.src = ''; }catch(e){}
            document.body.style.overflow = '';
            // notify and open in new tab
            try{ window.open(href, '_blank'); }catch(e){}
            try{ alert('The external About page cannot be embedded; opening in a new tab.'); }catch(e){}
          }
        }, 1200);
      }
      function closeCanva(){
        if(!modal || !frame) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden','true');
        // unload iframe to free resources
        try{ frame.src = ''; }catch(e){}
        document.body.style.overflow = '';
        if(canvaCheckTimer) clearTimeout(canvaCheckTimer);
      }

      links.forEach(a=>{
        a.addEventListener('click', e=>{
          // intercept and open modal instead of navigating
          e.preventDefault();
          const href = a.href;
          openCanva(href);
        });
      });

      if(closeBtn) closeBtn.addEventListener('click', closeCanva);
      document.addEventListener('keyup', e=>{ if(e.key==='Escape' && modal && modal.classList.contains('open')) closeCanva(); });
      // click backdrop to close
      if(modal){
        modal.addEventListener('click', e=>{ if(e.target === modal || e.target.classList.contains('canva-modal__backdrop')) closeCanva(); });
      }
    })();
});
