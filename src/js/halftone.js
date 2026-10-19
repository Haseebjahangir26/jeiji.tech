/**
 * Hero Halftone Portrait Canvas — High-Density Grain & Scroll Dispersion Engine
 *
 * - High-density dot matrix (spacing ~3.2px, yielding thousands of sharp grains).
 * - Full photographic facial fidelity for Haseeb Jahangir (/hero-character.jpg).
 * - Scroll Dispersion: As the user scrolls down, the portrait dissolves into floating kinetic grains
 *   that drift and scatter along with the scroll. When scrolling back up, they magnetically reconverge.
 * - Interactive Cursor Repulsion: Moving mouse repels nearby grains and tints them terracotta orange (#D96B43).
 */

export class HalftonePortrait {
  constructor(canvasId, imageSrc = '/hero-character.jpg') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.imageSrc = imageSrc;

    // High Density Grain Configuration
    this.dotSpacing = 3.4;      // ~3.4px spacing -> ~6,000–10,000 fine grains
    this.maxRadius = 1.9;       // Fine grain radius
    this.repelRadius = 80;      // Cursor repel distance
    this.repelForce = 16;       // Repel spring force
    this.springK = 0.08;        // Reconvergence stiffness
    this.friction = 0.80;       // Velocity damping

    this.dots = [];
    this.imageLoaded = false;
    this.img = new Image();

    // Mouse tracking
    this.mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };

    // Scroll tracking
    this.scrollY = window.scrollY || 0;
    this.scrollProgress = 0; // 0 at top, 1+ as scrolled past hero

    this.animationFrameId = null;
    this.time = 0;

    this.init();
  }

  init() {
    this.setupEvents();
    this.loadImage();
  }

  loadImage() {
    this.img.crossOrigin = 'anonymous';
    this.img.src = this.imageSrc;
    this.img.onload = () => {
      this.imageLoaded = true;
      this.resize();
      this.start();
    };
    this.img.onerror = () => {
      console.warn('Halftone: Could not load image, generating procedural portrait grid');
      this.createFallbackDots();
      this.start();
    };
  }

  setupEvents() {
    const heroSection = document.getElementById('hero') || this.canvas;

    const onPointerMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.active = true;
    };

    const onPointerLeave = () => {
      this.mouse.active = false;
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    };

    heroSection.addEventListener('mousemove', onPointerMove, { passive: true });
    heroSection.addEventListener('mouseleave', onPointerLeave, { passive: true });

    heroSection.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length > 0) {
          const rect = this.canvas.getBoundingClientRect();
          this.mouse.x = e.touches[0].clientX - rect.left;
          this.mouse.y = e.touches[0].clientY - rect.top;
          this.mouse.active = true;
        }
      },
      { passive: true }
    );
    heroSection.addEventListener('touchend', onPointerLeave, { passive: true });

    // Track page scroll for grain dissolution & dispersion
    const onScroll = () => {
      this.scrollY = window.scrollY || 0;
      const heroHeight = heroSection.offsetHeight || window.innerHeight;
      this.scrollProgress = Math.max(0, this.scrollY / (heroHeight * 0.7));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Resize Observer
    this.resizeObserver = new ResizeObserver(() => {
      if (this.imageLoaded) {
        this.resize();
      }
    });
    this.resizeObserver.observe(this.canvas);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width === 0 || height === 0) return;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.width = width;
    this.height = height;

    if (this.imageLoaded) {
      this.sampleImage();
    }
  }

  sampleImage() {
    if (!this.img.width || !this.img.height) return;

    const offscreen = document.createElement('canvas');
    const cols = Math.floor(this.width / this.dotSpacing);
    const rows = Math.floor(this.height / this.dotSpacing);

    offscreen.width = cols;
    offscreen.height = rows;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

    // Maintain aspect ratio cover
    const imgAspect = this.img.width / this.img.height;
    const canvasAspect = cols / rows;
    let sW, sH, sX, sY;

    if (imgAspect > canvasAspect) {
      sH = this.img.height;
      sW = sH * canvasAspect;
      sX = (this.img.width - sW) / 2;
      sY = 0;
    } else {
      sW = this.img.width;
      sH = sW / canvasAspect;
      sX = 0;
      sY = (this.img.height - sH) / 2;
    }

    offCtx.drawImage(this.img, sX, sY, sW, sH, 0, 0, cols, rows);

    const imgData = offCtx.getImageData(0, 0, cols, rows).data;
    this.dots = [];

    const xOffset = (this.width - cols * this.dotSpacing) / 2 + this.dotSpacing / 2;
    const yOffset = (this.height - rows * this.dotSpacing) / 2 + this.dotSpacing / 2;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) * 4;
        const red = imgData[idx];
        const green = imgData[idx + 1];
        const blue = imgData[idx + 2];
        const alpha = imgData[idx + 3] / 255;

        // Perceived luminance
        const lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

        // Enhance contrast curve for portrait definition
        const contrastLum = Math.pow(lum, 1.35) * alpha;

        // Density threshold — keep dots with discernible luminance
        if (contrastLum > 0.05) {
          const originX = xOffset + c * this.dotSpacing;
          const originY = yOffset + r * this.dotSpacing;
          const targetRadius = Math.max(0.45, contrastLum * this.maxRadius);

          // Vector pointing outward from center for radial dispersion
          const angleFromCenter = Math.atan2(originY - centerY, originX - centerX);
          const distFromCenter = Math.hypot(originX - centerX, originY - centerY);

          this.dots.push({
            ox: originX,
            oy: originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            radius: targetRadius,
            baseRadius: targetRadius,
            lum: contrastLum,
            orangeRatio: 0,
            // Dispersion characteristics
            driftSpeed: 0.35 + Math.random() * 0.85,   // varied downward scroll velocity
            disperseDirX: Math.cos(angleFromCenter) + (Math.random() - 0.5) * 0.8,
            disperseDirY: Math.sin(angleFromCenter) * 0.5 + Math.random() * 0.6,
            disperseWeight: 0.6 + (distFromCenter / (this.width * 0.5)) * 0.7,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }
  }

  createFallbackDots() {
    this.resize();
    const cols = Math.floor(this.width / this.dotSpacing);
    const rows = Math.floor(this.height / this.dotSpacing);
    this.dots = [];
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = c * this.dotSpacing;
        const oy = r * this.dotSpacing;
        const dist = Math.hypot(ox - centerX, oy - centerY);
        if (dist < this.width * 0.44) {
          const lum = Math.max(0, 1 - dist / (this.width * 0.44));
          this.dots.push({
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
            radius: Math.max(0.5, lum * this.maxRadius),
            baseRadius: Math.max(0.5, lum * this.maxRadius),
            lum,
            orangeRatio: 0,
            driftSpeed: 0.4 + Math.random() * 0.8,
            disperseDirX: (ox - centerX) / (this.width * 0.5),
            disperseDirY: (oy - centerY) / (this.height * 0.5),
            disperseWeight: 1,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }
  }

  start() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    const animate = () => {
      this.time += 0.02;
      this.render();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  render() {
    const ctx = this.ctx;
    if (!ctx || !this.width) return;

    ctx.clearRect(0, 0, this.width, this.height);

    const mx = this.mouse.x;
    const my = this.mouse.y;
    const isMouseActive = this.mouse.active;
    const rRadius = this.repelRadius;
    const rRadiusSq = rRadius * rRadius;
    const scrollP = this.scrollProgress; // 0 when in hero, scales up as scrolled down

    const len = this.dots.length;
    for (let i = 0; i < len; i++) {
      const d = this.dots[i];

      // 1. Scroll-driven Grain Dissolution & Dispersion Target
      // When scrolled, target position drifts downwards and outwards into free floating grains
      let scrollOffsetX = 0;
      let scrollOffsetY = 0;

      if (scrollP > 0.01) {
        // Downward kinetic drift proportional to scroll
        const downwardDrift = this.scrollY * d.driftSpeed * 0.45;
        // Radial outward blast/dissolution
        const outwardDisperse = scrollP * 140 * d.disperseWeight;
        // Subtle micro-turbulence flutter
        const flutterX = Math.sin(this.time * 1.8 + d.phase) * 16 * scrollP;
        const flutterY = Math.cos(this.time * 1.5 + d.phase) * 14 * scrollP;

        scrollOffsetX = d.disperseDirX * outwardDisperse + flutterX;
        scrollOffsetY = downwardDrift + d.disperseDirY * outwardDisperse * 0.5 + flutterY;
      }

      // Effective anchor point including scroll drift
      const targetAnchorX = d.ox + scrollOffsetX;
      const targetAnchorY = d.oy + scrollOffsetY;

      // 2. Interactive Cursor Repulsion
      let targetOrange = 0;
      if (isMouseActive) {
        const dx = d.x - mx;
        const dy = d.y - my;
        const distSq = dx * dx + dy * dy;

        if (distSq < rRadiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / rRadius) * this.repelForce;
          const angle = Math.atan2(dy, dx);

          d.vx += Math.cos(angle) * force * 0.45;
          d.vy += Math.sin(angle) * force * 0.45;

          targetOrange = Math.min(1, (1 - dist / rRadius) * 1.5);
        }
      }

      // Smooth color transition to terracotta orange
      d.orangeRatio += (targetOrange - d.orangeRatio) * 0.18;

      // 3. Spring physics returning to targetAnchor
      const oxDiff = targetAnchorX - d.x;
      const oyDiff = targetAnchorY - d.y;
      d.vx += oxDiff * this.springK;
      d.vy += oyDiff * this.springK;

      // Ambient breathing life
      const ambient = Math.sin(this.time + d.phase) * 0.08;
      d.vx += ambient;

      // Friction damping
      d.vx *= this.friction;
      d.vy *= this.friction;

      d.x += d.vx;
      d.y += d.vy;

      // 4. Alpha attenuation as grains drift far down
      // Grains fade gracefully as they disperse into the lower sections
      const dispersionAlpha = Math.max(0.08, 1 - scrollP * 0.55);
      if (dispersionAlpha <= 0.02) continue;

      // Color interpolation: Warm Alabaster (#F4F0EA) -> Terracotta Orange (#D96B43)
      const t = d.orangeRatio;
      const r = Math.round(244 + (217 - 244) * t);
      const g = Math.round(240 + (107 - 240) * t);
      const b = Math.round(234 + (67 - 234) * t);
      const baseAlpha = Math.min(1, Math.max(0.18, d.lum * (0.85 + 0.15 * t)));
      const finalAlpha = baseAlpha * dispersionAlpha;

      // Fine grain size with slight expansion on orange repel
      const currentRadius = d.baseRadius * (1 + t * 0.35);

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
