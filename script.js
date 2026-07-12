document.addEventListener('DOMContentLoaded',()=>{
  const gallery = document.querySelector('.gallery-grid');
  const previewGrid = document.getElementById('previewGrid');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');

  const renderArtworkSections = (artworks) => {
    if(!artworks || !Array.isArray(artworks)) return;
    
    if(gallery){
      gallery.innerHTML = artworks.map(item => `
        <figure>
          <img loading="lazy" src="${item.src}" alt="${item.alt}">
          <figcaption><span class="desc">${item.title} — ${item.description}</span></figcaption>
        </figure>
      `).join('');
    }

    if(previewGrid){
      previewGrid.innerHTML = artworks.map(item => `
        <figure class="preview-item">
          <a href="gallery.html"><img loading="lazy" src="${item.src}" alt="${item.alt}"></a>
        </figure>
      `).join('');
    }

    setTimeout(()=>{
      const galleryFigures = Array.from(document.querySelectorAll('.gallery-grid figure'));
      galleryFigures.forEach((fig,i)=> setTimeout(()=> fig.classList.add('animate'), 350 + i*40));
    }, 50);
  };

  // Try to render artworks immediately if available
  if(typeof window.ARTWORKS !== 'undefined'){
    renderArtworkSections(window.ARTWORKS);
  }

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

    // Removed embedded Canva modal logic (no-op) to prevent overlay behavior.
});
