import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";
import "./intro.css";

interface IntroAnimationProps { onFinish: () => void; onReveal: () => void }
const asset = (name: string) => `${import.meta.env.BASE_URL}brand/cinematic/${name}.webp`;
const name = "REYHAN IRZA ALVANO";

/** Rey's supplied film, integrated without its mock homepage or global controller. */
export default function IntroAnimation({ onFinish, onReveal }: IntroAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const finishRef = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let finished = false, disposed = false, revealed = false;
    let timer = 0, decodeTimer = 0;
    let timeline: gsap.core.Timeline | undefined;
    const q = (s: string) => root.querySelector<HTMLElement>(s)!;
    const logo = q('.logo'), stage = q('.stage'), full = q('.full');
    const pieces = Array.from(root.querySelectorAll<HTMLImageElement>('.piece'));
    const chars = Array.from(root.querySelectorAll<HTMLElement>('.ch'));
    const nav = document.querySelector<HTMLElement>('.editorial-nav');
    const navLogo = nav?.querySelector<HTMLImageElement>('.portfolio-nav-logo');
    const previousOverflow = document.body.style.overflow;
    const previousNavInert = nav?.inert ?? false;
    const previousLogoVisibility = navLogo?.style.visibility ?? '';
    const reveal = () => { if (!revealed && !disposed) { revealed = true; onReveal(); } };
    const finish = () => {
      if (finished || disposed) return;
      finished = true; window.clearTimeout(timer); window.clearTimeout(decodeTimer);
      timeline?.pause(); reveal();
      if (navLogo) navLogo.style.visibility = previousLogoVisibility;
      document.body.style.overflow = previousOverflow;
      if (nav) nav.inert = previousNavInert;
      window.dispatchEvent(new CustomEvent('portfolio:scroll-lock'));
      onFinish();
      // Focus after React removes the modal and releases main's inert state.
      requestAnimationFrame(() => {
        const main = document.querySelector<HTMLElement>('#main-content');
        if (main && (!document.activeElement || document.activeElement === document.body || root.contains(document.activeElement))) {
          main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true });
        }
      });
    };
    finishRef.current = finish;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) { finish(); return; }
    document.body.style.overflow = 'hidden';
    if (nav) nav.inert = true;
    if (navLogo) navLogo.style.visibility = 'hidden';
    window.dispatchEvent(new CustomEvent('portfolio:scroll-lock'));
    skipRef.current?.focus({ preventScroll: true });
    const context = gsap.context(() => {
      gsap.set(q('.vig'), { opacity: 0 });
      gsap.set(q('.hair'), { scaleX: 0 });
      gsap.set(q('.rule'), { scaleX: 0 });
      gsap.set(chars, { yPercent: 115 });
      gsap.set(q('.sub'), { opacity: 0, y: 10 });
      gsap.set(pieces[0], { xPercent: -46, yPercent: -26 });
      gsap.set(pieces[1], { xPercent: -34, yPercent: 60 });
      gsap.set(pieces[2], { xPercent: 46, yPercent: -40 });
      const t = gsap.timeline({ paused: true, onComplete: finish });
      timeline = t;
      const labels = { stage: 0, fragments: .4, tension: 1.2, assemble: 1.5, impact: 2.1, type: 2.5, handoff: 3.95 };
      Object.entries(labels).forEach(([label, at]) => t.addLabel(label, at));
      t.to(q('.vig'), { opacity: 1, duration: 1.2, ease: 'power1.out' }, 'stage')
        .to(q('.hair'), { scaleX: 1, duration: .9, ease: 'expo.inOut' }, .1);
      [[-10,-6],[-8,12],[10,-8]].forEach(([x,y], i) => {
        t.to(pieces[i], { xPercent: x, yPercent: y, duration: .85, ease: 'power3.out' }, .4+i*.1)
          .to(pieces[i], { opacity: 1, duration: .35, ease: 'none' }, .4+i*.1);
      });
      t.to(q('.hair'), { opacity: 0, duration: .4, ease: 'power1.in' }, 'tension')
        .to(stage, { scale: 1.02, duration: .9, ease: 'power1.in' }, 'tension');
      [1,0,2].forEach((index, i) => t.to(pieces[index], {
        xPercent: 0, yPercent: 0, duration: .5, ease: 'power4.in',
      }, 1.5+i*.05));
      t.set(full, { opacity: 1 }, 'impact').set(pieces, { opacity: 0 }, 'impact')
        .fromTo(stage, { scale: 1.045 }, { scale: 1, duration: .9, ease: 'power3.out', immediateRender: false }, 'impact')
        .to(q('.glow'), { opacity: .9, duration: .08, ease: 'power2.out' }, 'impact')
        .to(q('.glow'), { opacity: .3, duration: 1.3, ease: 'power2.out' }, 2.18)
        .set(q('.sheen'), { opacity: 1 }, 'impact')
        .fromTo(q('.sheen i'), { xPercent: -150 }, { xPercent: 420, duration: .75, ease: 'power2.inOut', immediateRender: false }, 'impact')
        .to(q('.sheen'), { opacity: 0, duration: .12 }, 2.82)
        .to(logo, { yPercent: -7, scale: .9, duration: 1, ease: 'power3.inOut' }, 'type')
        .to(q('.rule'), { scaleX: 1, duration: .8, ease: 'expo.inOut' }, 2.65)
        .to(chars, { yPercent: 0, duration: .75, ease: 'power4.out', stagger: .02 }, 2.76)
        .to(q('.sub'), { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 3.2)
        .to(q('.type'), { opacity: 0, y: -10, duration: .45, ease: 'power2.in' }, 'handoff')
        .to(q('.glow'), { opacity: 0, duration: .6, ease: 'power2.out' }, 'handoff');
      // Read both rectangles together before the tween changes either transform.
      let dock = { x: 0, y: 0, scale: .1 };
      t.call(() => {
        const r = logo.getBoundingClientRect(), n = navLogo?.getBoundingClientRect();
        if (n) dock = {
          x: Number(gsap.getProperty(logo, 'x')) + n.left+n.width/2-r.left-r.width/2,
          y: Number(gsap.getProperty(logo, 'y')) + n.top+n.height/2-r.top-r.height/2,
          scale: Number(gsap.getProperty(logo, 'scale')) * n.width/r.width,
        };
        root.dataset.phase = 'handoff';
      }, [], 'handoff')
        .to(logo, { x: () => dock.x, y: () => dock.y, scale: () => dock.scale, duration: .9, ease: 'power3.inOut' }, 'handoff')
        .to([q('.bg'),q('.vig')], { opacity: 0, duration: .7, ease: 'power2.inOut' }, 4.1)
        .call(reveal, [], 4.4);
    }, root);
    const arm = () => { window.clearTimeout(timer); if (!document.hidden) timer = window.setTimeout(finish, 12000); };
    const visibility = () => { if (document.hidden) { timeline?.pause(); window.clearTimeout(timer); } else { timeline?.play(); arm(); } };
    const preference = () => { if (reduced.matches) finish(); };
    const resize = () => { if ((timeline?.time() ?? 0) >= 3.95) finish(); };
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', preference);
    window.addEventListener('resize', resize);
    arm();
    Promise.race([
      Promise.all(Array.from(root.querySelectorAll('img')).map(img => img.decode())),
      new Promise((_, reject) => { decodeTimer = window.setTimeout(() => reject(new Error('Intro assets unavailable')), 1500); }),
    ]).then(() => {
      window.clearTimeout(decodeTimer);
      if (!disposed && !finished && !document.hidden) timeline?.play(0);
    }).catch(finish);
    return () => {
      disposed = true; window.clearTimeout(timer); window.clearTimeout(decodeTimer);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', preference);
      window.removeEventListener('resize', resize);
      context.revert();
      document.body.style.overflow = previousOverflow;
      if (nav) nav.inert = previousNavInert;
      if (navLogo) navLogo.style.visibility = previousLogoVisibility;
      window.dispatchEvent(new CustomEvent('portfolio:scroll-lock'));
    };
  }, [onFinish, onReveal]);
  return <div id="rv-intro" className="rv-intro" ref={rootRef} role="dialog" aria-modal="true"
    aria-label="Reyhan Irza Alvano — logo intro" data-phase="play" onKeyDown={event => {
      if (event.key === 'Escape') finishRef.current();
      if (event.key === 'Tab') {
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }}>
    <div className="bg" /><div className="vig" /><div className="hair" />
    <div className="logo" aria-hidden="true"><div className="stage">
      <div className="glow" />
      {[1,2,3].map(i => <img key={i} className={`piece p${i}`} data-intro-piece src={asset(`p${i}`)} alt="" fetchPriority="high" draggable={false} onError={() => finishRef.current()} />)}
      <img className="full" data-intro-final src={asset('full')} alt="" fetchPriority="high" draggable={false} onError={() => finishRef.current()} />
      <div className="sheen" style={{ maskImage: `url("${asset('full')}")`, WebkitMaskImage: `url("${asset('full')}")` }}><i /></div>
    </div></div>
    <div className="type" data-intro-identity><div className="rule" />
      <p className="name" data-intro-copy aria-label="Reyhan Irza Alvano"><span className="chars" aria-hidden="true">{Array.from(name).map((c,i) => <span className="ch" key={i}>{c === ' ' ? '\u00a0' : c}</span>)}</span></p>
      <p className="sub" data-intro-copy>Creative Developer</p>
    </div>
    <div className="ctrl"><button ref={skipRef} className="rv-btn rv-intro-skip" type="button" aria-label="Skip introduction" onClick={() => finishRef.current()}>Skip intro</button>
      <button className="rv-btn primary" type="button" onClick={() => finishRef.current()}>Enter</button></div>
  </div>;
}
