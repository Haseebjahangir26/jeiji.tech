/**
 * Hero Halftone Portrait Canvas — Still High-Density Grain Portrait
 *
 * - Renders a still, high-density dot matrix portrait of Haseeb Jahangir (/hero-character.jpg).
 * - Zero ongoing CPU/GPU usage: drawn once upon load and cached on the canvas bitmap.
 * - Re-samples cleanly only when the canvas container is resized.
 * - No grain movement, no mouse repulsion physics, and no scroll dispersion.
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

    this.dots = [];
    this.imageLoaded = false;
    this.img = new Image();

    this.init();
  }

  init() {
    this.setupResizeObserver();
    this.loadImage();
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.imageLoaded) {
        this.resize();
      }
    });
    this.resizeObserver.observe(this.canvas);
  }

  loadImage() {
    this.img.crossOrigin = 'anonymous';
    this.img.src = this.imageSrc;
    this.img.onload = () => {
      this.imageLoaded = true;
      this.resize();
    };
    this.img.onerror = () => {
      console.warn('Halftone: Could not load image, generating procedural portrait grid');
      this.createFallbackDots();
      this.renderStatic();
    };
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

          this.dots.push({
            ox: originX,
            oy: originY,
            baseRadius: targetRadius,
            lum: contrastLum,
          });
        }
      }
    }

    this.renderStatic();
  }

  createFallbackDots() {
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
            baseRadius: Math.max(0.5, lum * this.maxRadius),
            lum,
          });
        }
      }
    }
  }

  renderStatic() {
    const ctx = this.ctx;
    if (!ctx || !this.width) return;

    ctx.clearRect(0, 0, this.width, this.height);
    const len = this.dots.length;
    for (let i = 0; i < len; i++) {
      const d = this.dots[i];
      const alpha = Math.min(1, Math.max(0.18, d.lum * 0.85));
      ctx.fillStyle = `rgba(244, 240, 234, ${alpha})`;
      ctx.beginPath();
      ctx.arc(d.ox, d.oy, d.baseRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  pauseMotion() {
    this.renderStatic();
  }

  resumeMotion() {
    this.renderStatic();
  }

  destroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
