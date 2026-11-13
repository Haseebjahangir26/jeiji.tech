/**
 * Static Topological Particle Canvas Engine
 * Displays 3 architectural configurations without continuous animation loops:
 * 1. Build (STRUCTURE): 3D static undulating sine-wave tensor grid
 * 2. Teach (RIPPLE): Concentric polar rings
 * 3. Connect (CONSTELLATION): 3D topological sphere
 *
 * - Zero ongoing CPU/GPU usage: rendered once on load and on tab switch.
 * - No continuous requestAnimationFrame loops or cursor repulsion drag.
 */

import { particleTabs } from '../data/portfolio.js';

export class MorphingParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.numParticles = 1156; // 34 x 34 grid
    this.gridDim = 34;

    this.currentState = 'build'; // 'build' | 'teach' | 'connect'

    // Camera & Projection
    this.camera = {
      fov: 380,
      z: 500,
      pitch: 0.58,
      yaw: 0.05,
    };

    this.particles = [];
    this.init();
  }

  init() {
    this.setupParticles();
    this.setupTabControls();
    this.setupResizeObserver();
    this.resize();
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this.canvas);
  }

  setupParticles() {
    this.particles = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const goldenAngle = Math.PI * 2 * (1 - 1 / goldenRatio);

    for (let i = 0; i < this.numParticles; i++) {
      // 1. STRUCTURE (Grid)
      const col = i % this.gridDim;
      const row = Math.floor(i / this.gridDim);
      const gridSpacing = 16;
      const gx = (col - (this.gridDim - 1) / 2) * gridSpacing;
      const gz = (row - (this.gridDim - 1) / 2) * gridSpacing;

      // 2. RIPPLE (Concentric polar rings)
      const numRings = 12;
      const ringIdx = i % numRings;
      const innerRadius = 38;
      const ringRadius = innerRadius + ringIdx * 18;
      const ptsInRing = Math.floor(this.numParticles / numRings);
      const ptInRingIdx = Math.floor(i / numRings);
      const theta = (ptInRingIdx / ptsInRing) * Math.PI * 2 + (ringIdx * 0.15);

      // 3. CONSTELLATION (Fibonacci 3D Sphere)
      const sphereRadius = 185;
      const yNorm = 1 - (i / (this.numParticles - 1)) * 2;
      const radAtY = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
      const sphereTheta = goldenAngle * i;
      const sx = Math.cos(sphereTheta) * radAtY * sphereRadius;
      const sy = yNorm * sphereRadius;
      const sz = Math.sin(sphereTheta) * radAtY * sphereRadius;

      this.particles.push({
        idx: i,
        structure: { x: gx, y: 0, z: gz, col, row },
        ripple: {
          ringIdx,
          radius: ringRadius,
          baseTheta: theta,
        },
        constellation: {
          x: sx,
          y: sy,
          z: sz,
        },
        screenX: 0,
        screenY: 0,
        depthScale: 1,
      });
    }
  }

  setupTabControls() {
    const tabs = document.querySelectorAll('.particle-tab');
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetState = tab.dataset.state;
        if (targetState && targetState !== this.currentState) {
          this.switchState(targetState);
        }
      });
    });
  }

  switchState(newState) {
    if (!['build', 'teach', 'connect'].includes(newState)) return;

    this.currentState = newState;

    // Update active UI tab states
    const tabs = document.querySelectorAll('.particle-tab');
    tabs.forEach((tab) => {
      const isActive = tab.dataset.state === newState;
      tab.classList.toggle('particle-tab--active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    // Update Editorial Caption
    this.updateCaption(newState);

    // Compute & render static view
    this.updatePositions();
    this.render();
  }

  updateCaption(stateKey) {
    const data = particleTabs[stateKey];
    if (!data) return;

    const headlineEl = document.getElementById('particle-mode-headline');
    const descEl = document.getElementById('particle-mode-desc');
    const badgeEl = document.getElementById('particle-mode-badge');
    const codeEl = document.getElementById('particle-mode-code');

    if (headlineEl) headlineEl.textContent = data.headline;
    if (descEl) descEl.textContent = data.caption;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (codeEl) codeEl.textContent = `MODE // ${data.code} : ${data.modeName}`;
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

    this.updatePositions();
    this.render();
  }

  updatePositions() {
    const currentState = this.currentState;

    if (currentState === 'build') {
      this.camera.pitch = 0.58;
      this.camera.yaw = 0.08;
    } else if (currentState === 'teach') {
      this.camera.pitch = 0.72;
      this.camera.yaw = 0.22;
    } else if (currentState === 'connect') {
      this.camera.pitch = 0.25;
      this.camera.yaw = 0.45;
    }

    const cosYaw = Math.cos(this.camera.yaw);
    const sinYaw = Math.sin(this.camera.yaw);
    const cosPitch = Math.cos(this.camera.pitch);
    const sinPitch = Math.sin(this.camera.pitch);

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const fov = this.camera.fov;
    const camZ = this.camera.z;

    const len = this.particles.length;

    for (let i = 0; i < len; i++) {
      const p = this.particles[i];
      let tx = 0, ty = 0, tz = 0;

      if (currentState === 'build') {
        const s = p.structure;
        tx = s.x;
        tz = s.z;
        ty = Math.sin(s.x * 0.024) * Math.cos(s.z * 0.024) * 44 +
             Math.sin((s.x + s.z) * 0.016) * 20;
      } else if (currentState === 'teach') {
        const r = p.ripple;
        const wave = Math.sin(-r.ringIdx * 0.6) * 16;
        const currentRadius = r.radius + wave;
        tx = Math.cos(r.baseTheta) * currentRadius;
        tz = Math.sin(r.baseTheta) * currentRadius;
        ty = Math.sin(-r.ringIdx * 0.65) * 28;
      } else if (currentState === 'connect') {
        const c = p.constellation;
        tx = c.x;
        ty = c.y;
        tz = c.z;
      }

      // 3D Rotation Transform
      const x1 = tx * cosYaw - tz * sinYaw;
      const z1 = tx * sinYaw + tz * cosYaw;
      const y2 = ty * cosPitch - z1 * sinPitch;
      const z2 = ty * sinPitch + z1 * cosPitch;

      // Perspective Projection
      const depth = camZ + z2;
      const scale = depth > 10 ? fov / depth : 1;
      p.depthScale = scale;

      p.screenX = centerX + x1 * scale;
      p.screenY = centerY + y2 * scale;
    }
  }

  render() {
    const ctx = this.ctx;
    if (!ctx || !this.width) return;

    ctx.clearRect(0, 0, this.width, this.height);

    // Optional subtle connective lines in constellation mode
    if (this.currentState === 'connect') {
      const step = 8;
      const maxConnectDist = 42;
      const maxDistSq = maxConnectDist * maxConnectDist;
      const sampleCount = Math.floor(this.numParticles / step);

      for (let a = 0; a < sampleCount; a++) {
        const i = a * step;
        const p1 = this.particles[i];
        if (p1.depthScale <= 0.3) continue;

        for (let b = a + 1; b < Math.min(sampleCount, a + 10); b++) {
          const j = b * step;
          const p2 = this.particles[j];
          const dx = p1.screenX - p2.screenX;
          const dy = p1.screenY - p2.screenY;
          const dSq = dx * dx + dy * dy;

          if (dSq < maxDistSq) {
            const dist = Math.sqrt(dSq);
            const lineAlpha = (1 - dist / maxConnectDist) * 0.16 * p1.depthScale;
            ctx.strokeStyle = `rgba(244, 240, 234, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);
            ctx.stroke();
          }
        }
      }
    }

    // Render Particles
    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      const p = this.particles[i];
      if (p.depthScale <= 0) continue;

      const radius = Math.max(0.7, 1.6 * p.depthScale);
      const alpha = Math.min(1, Math.max(0.18, 0.75 * p.depthScale));

      ctx.fillStyle = `rgba(244, 240, 234, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.screenX, p.screenY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  pauseMotion() {
    this.render();
  }

  resumeMotion() {
    this.render();
  }

  destroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
