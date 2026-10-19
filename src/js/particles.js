/**
 * 3-State Morphing Particle Canvas Engine
 * 1. Build (STRUCTURE): 3D undulating sine-wave grid
 * 2. Teach (RIPPLE): Concentric polar rings pulsing outward from hollow center
 * 3. Connect (CONSTELLATION): Rotating 3D sphere with faint connecting lines
 *
 * - Smooth ~900ms cubic morphing transition between states
 * - Cursor repulsion with terracotta orange (#D96B43) flares
 * - Active tab fill cream (#ECE7DF) and caption crossfades
 */

import { particleTabs } from '../data/portfolio.js';

export class MorphingParticleCanvas {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.numParticles = 1156; // 34 x 34 grid
    this.gridDim = 34;

    this.currentState = 'build'; // 'build' | 'teach' | 'connect'
    this.previousState = 'build';

    // Transition timing (~900ms)
    this.isMorphing = false;
    this.morphStartTime = 0;
    this.morphDuration = 900; // ms

    // Interaction
    this.mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };
    this.mouseRepelRadius = 100;
    this.mouseRepelForce = 24;

    // Camera & Projection
    this.camera = {
      fov: 380,
      z: 500,
      pitch: 0.58, // ~33 deg tilt
      yaw: 0,
      targetYaw: 0,
    };

    this.time = 0;
    this.particles = [];
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.setupParticles();
    this.setupEvents();
    this.setupTabControls();
    this.resize();
    this.start();
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
      const yNorm = 1 - (i / (this.numParticles - 1)) * 2; // -1 to 1
      const radAtY = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
      const sphereTheta = goldenAngle * i;
      const sx = Math.cos(sphereTheta) * radAtY * sphereRadius;
      const sy = yNorm * sphereRadius;
      const sz = Math.sin(sphereTheta) * radAtY * sphereRadius;

      this.particles.push({
        idx: i,
        // Base static state targets
        structure: { x: gx, y: 0, z: gz, col, row },
        ripple: {
          ringIdx,
          radius: ringRadius,
          baseTheta: theta,
          x: Math.cos(theta) * ringRadius,
          y: 0,
          z: Math.sin(theta) * ringRadius,
        },
        constellation: {
          x: sx,
          y: sy,
          z: sz,
        },
        // Current rendered 3D coords
        x: gx,
        y: 0,
        z: gz,
        // Interpolation source coordinates when morphing
        fromX: gx,
        fromY: 0,
        fromZ: gz,
        // Projected 2D coords
        screenX: 0,
        screenY: 0,
        depthScale: 1,
        // Screen velocity for cursor repulsion
        vx: 0,
        vy: 0,
        repelRatio: 0,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  setupEvents() {
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

    this.canvas.addEventListener('mousemove', onPointerMove, { passive: true });
    this.canvas.addEventListener('mouseleave', onPointerLeave, { passive: true });
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.touches[0].clientX - rect.left;
        this.mouse.y = e.touches[0].clientY - rect.top;
        this.mouse.active = true;
      }
    }, { passive: true });
    this.canvas.addEventListener('touchend', onPointerLeave, { passive: true });

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this.canvas);
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

    this.previousState = this.currentState;
    this.currentState = newState;

    // Snapshot current particle positions for smooth 900ms interpolation
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.fromX = p.x;
      p.fromY = p.y;
      p.fromZ = p.z;
    }

    this.isMorphing = true;
    this.morphStartTime = performance.now();

    // Update active UI tab states
    const tabs = document.querySelectorAll('.particle-tab');
    tabs.forEach((tab) => {
      const isActive = tab.dataset.state === newState;
      tab.classList.toggle('particle-tab--active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    // Crossfade Editorial Caption
    this.crossfadeCaption(newState);
  }

  crossfadeCaption(stateKey) {
    const data = particleTabs[stateKey];
    if (!data) return;

    const captionWrap = document.getElementById('particle-caption-wrap');
    const headlineEl = document.getElementById('particle-mode-headline');
    const descEl = document.getElementById('particle-mode-desc');
    const badgeEl = document.getElementById('particle-mode-badge');
    const codeEl = document.getElementById('particle-mode-code');

    if (!captionWrap) return;

    // Fade out
    captionWrap.style.opacity = '0';
    captionWrap.style.transform = 'translateY(8px)';
    captionWrap.style.transition = 'opacity 200ms ease, transform 200ms ease';

    setTimeout(() => {
      if (headlineEl) headlineEl.textContent = data.headline;
      if (descEl) descEl.textContent = data.caption;
      if (badgeEl) badgeEl.textContent = data.badge;
      if (codeEl) codeEl.textContent = `MODE // ${data.code} : ${data.modeName}`;

      // Fade in
      captionWrap.style.opacity = '1';
      captionWrap.style.transform = 'translateY(0)';
      captionWrap.style.transition = 'opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1)';
    }, 200);
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
  }

  start() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    const animate = (timestamp) => {
      this.time += 0.022;
      this.update(timestamp);
      this.render();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  update(timestamp) {
    let morphT = 1;
    if (this.isMorphing) {
      const elapsed = timestamp - this.morphStartTime;
      const raw = Math.min(1, elapsed / this.morphDuration);
      morphT = this.easeInOutCubic(raw);
      if (raw >= 1) {
        this.isMorphing = false;
      }
    }

    const t = this.time;
    const currentState = this.currentState;

    // Dynamic rotation per state
    if (currentState === 'build') {
      this.camera.pitch = 0.58;
      this.camera.yaw = Math.sin(t * 0.2) * 0.12;
    } else if (currentState === 'teach') {
      this.camera.pitch = 0.72; // Steeper angle for radial waves
      this.camera.yaw = t * 0.1;
    } else if (currentState === 'connect') {
      this.camera.pitch = Math.sin(t * 0.3) * 0.25;
      this.camera.yaw = t * 0.38; // Continuous rotation of the sphere
    }

    const cosYaw = Math.cos(this.camera.yaw);
    const sinYaw = Math.sin(this.camera.yaw);
    const cosPitch = Math.cos(this.camera.pitch);
    const sinPitch = Math.sin(this.camera.pitch);

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const fov = this.camera.fov;
    const camZ = this.camera.z;

    const mx = this.mouse.x;
    const my = this.mouse.y;
    const mouseActive = this.mouse.active;
    const repelRadius = this.mouseRepelRadius;
    const repelRadiusSq = repelRadius * repelRadius;

    const len = this.particles.length;

    for (let i = 0; i < len; i++) {
      const p = this.particles[i];

      // Calculate instantaneous target 3D coords for current state
      let tx = 0, ty = 0, tz = 0;

      if (currentState === 'build') {
        const s = p.structure;
        tx = s.x;
        tz = s.z;
        // 3D undulating sine-wave
        ty = Math.sin(s.x * 0.024 + t * 1.6) * Math.cos(s.z * 0.024 + t * 1.3) * 44 +
             Math.sin((s.x + s.z) * 0.016 + t * 0.9) * 20;
      } else if (currentState === 'teach') {
        const r = p.ripple;
        // Pulsing concentric polar rings propagating outward
        const wave = Math.sin(t * 3.2 - r.ringIdx * 0.6) * 16;
        const currentRadius = r.radius + wave;
        const currentTheta = r.baseTheta + (r.ringIdx % 2 === 0 ? t * 0.15 : -t * 0.15);
        tx = Math.cos(currentTheta) * currentRadius;
        tz = Math.sin(currentTheta) * currentRadius;
        ty = Math.sin(t * 2.8 - r.ringIdx * 0.65) * 28;
      } else if (currentState === 'connect') {
        const c = p.constellation;
        tx = c.x;
        ty = c.y;
        tz = c.z;
      }

      // Smooth position interpolation during morph
      if (this.isMorphing) {
        p.x = p.fromX + (tx - p.fromX) * morphT;
        p.y = p.fromY + (ty - p.fromY) * morphT;
        p.z = p.fromZ + (tz - p.fromZ) * morphT;
      } else {
        p.x = tx;
        p.y = ty;
        p.z = tz;
      }

      // 3D Rotation Transform (Yaw around Y, Pitch around X)
      // 1. Yaw
      const x1 = p.x * cosYaw - p.z * sinYaw;
      const z1 = p.x * sinYaw + p.z * cosYaw;
      // 2. Pitch
      const y2 = p.y * cosPitch - z1 * sinPitch;
      const z2 = p.y * sinPitch + z1 * cosPitch;

      // Perspective Projection
      const depth = camZ + z2;
      const scale = depth > 10 ? fov / depth : 1;
      p.depthScale = scale;

      const projX = centerX + x1 * scale;
      const projY = centerY + y2 * scale;

      // Screen-space cursor repulsion
      let targetRepel = 0;
      if (mouseActive) {
        const dx = projX + p.vx - mx;
        const dy = projY + p.vy - my;
        const distSq = dx * dx + dy * dy;

        if (distSq < repelRadiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / repelRadius) * this.mouseRepelForce;
          const ang = Math.atan2(dy, dx);

          p.vx += Math.cos(ang) * force * 0.45;
          p.vy += Math.sin(ang) * force * 0.45;

          targetRepel = Math.min(1, (1 - dist / repelRadius) * 1.6);
        }
      }

      // Spring damping back to projected origin
      p.vx *= 0.82;
      p.vy *= 0.82;
      p.repelRatio += (targetRepel - p.repelRatio) * 0.2;

      p.screenX = projX + p.vx;
      p.screenY = projY + p.vy;
    }
  }

  render() {
    const ctx = this.ctx;
    if (!ctx || !this.width) return;

    ctx.clearRect(0, 0, this.width, this.height);

    // If CONSTELLATION mode, draw faint connecting lines between nearby points
    if (this.currentState === 'connect') {
      ctx.lineWidth = 0.75;
      const maxConnectDist = 38;
      const maxDistSq = maxConnectDist * maxConnectDist;
      const len = this.particles.length;

      // Sample a subset for performance and blueprint aesthetic
      const step = 2;
      for (let i = 0; i < len; i += step) {
        const p1 = this.particles[i];
        if (p1.depthScale < 0.75) continue;

        for (let j = i + step; j < Math.min(len, i + 32); j += step) {
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

      // Depth culling
      if (p.depthScale <= 0) continue;

      const baseRadius = Math.max(0.7, 1.6 * p.depthScale);
      const radius = baseRadius * (1 + p.repelRatio * 0.6);

      // Color interpolation: Alabaster/Muted -> Terracotta Orange (#D96B43)
      const t = p.repelRatio;
      const r = Math.round(244 + (217 - 244) * t);
      const g = Math.round(240 + (107 - 240) * t);
      const b = Math.round(234 + (67 - 234) * t);
      const alpha = Math.min(1, Math.max(0.18, 0.75 * p.depthScale * (1 + t * 0.4)));

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.screenX, p.screenY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
