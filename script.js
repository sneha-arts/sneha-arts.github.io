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

  /* Homepage carousel */
  const carousel = document.getElementById('homepageCarousel');
  if(carousel){
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prev = carousel.querySelector('[data-action="prev"]');
    const next = carousel.querySelector('[data-action="next"]');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let current = 0;
    let interval = null;

    // build dots
    slides.forEach((s,i)=>{
      const d = document.createElement('button');
      d.className = 'carousel-dot';
      d.setAttribute('aria-label','Slide '+(i+1));
      d.addEventListener('click', ()=>{ show(i); reset(); });
      dotsContainer.appendChild(d);
    });

    const dots = Array.from(dotsContainer.children);

    function show(idx){
      current = (idx+slides.length)%slides.length;
      const offset = -current * slides[0].getBoundingClientRect().width;
      slides.forEach((s)=> s.style.transform = `translateX(${offset}px)`);
      dots.forEach((d,ii)=> d.classList.toggle('active', ii===current));
    }

    function nextSlide(){ show(current+1); }
    function prevSlide(){ show(current-1); }
    function start(){ interval = setInterval(nextSlide,4000); }
    function stop(){ clearInterval(interval); interval = null; }
    function reset(){ stop(); start(); }

    next.addEventListener('click', ()=>{ nextSlide(); reset(); });
    prev.addEventListener('click', ()=>{ prevSlide(); reset(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    // clicking slide opens lightbox for that image
    slides.forEach(s=> s.addEventListener('click', ()=>{
      const img = s.querySelector('img');
      if(img && lb){ lbImg.src = img.src; lb.classList.add('lb-open'); lb.setAttribute('aria-hidden','false'); }
    }));

    // initialize
    show(0);
    start();
  }
});
