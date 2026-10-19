/**
 * Portfolio Data — jeiji.tech
 * Authentic, grounded editorial-technical dataset for Haseeb Jahangir (JJ)
 */

export const siteConfig = {
  name: "Haseeb Jahangir",
  displayName: "JJ",
  handle: "jeiji",
  role: "Computer Science Student & Aspiring AI/ML Engineer",
  institution: "COMSATS University Islamabad",
  location: "Based in Islamabad, Pakistan",
  email: "haseebjahangir.dev@gmail.com",
  github: "https://github.com/haseebjahangir26",
  domain: "jeiji.tech",
  status: "OPEN TO INTERNSHIPS & COLLABORATIONS",
  version: "SYS_REV 2026.4",
};

// Grounded, real metrics — no exaggerated corporate claims
export const stats = [
  {
    value: "5",
    operator: "+",
    label: "REAL PROJECTS BUILT",
    desc: "Self-engineered, practical projects across ML, predictive analytics, and web systems.",
  },
  {
    value: "BSCS",
    operator: "",
    label: "COMSATS ISLAMABAD",
    desc: "Undergraduate Computer Science student, actively studying core CS & AI (Graduating 2028).",
  },
  {
    value: "100",
    operator: "%",
    label: "OPEN SOURCE CODE",
    desc: "All source code, Jupyter notebooks, and experiments are publicly verifiable on GitHub.",
  },
];

export const particleTabs = {
  build: {
    id: "build",
    code: "01",
    tabLabel: "Build",
    modeName: "STRUCTURE",
    headline: "Undulating Tensor Manifold",
    caption:
      "Architecting resilient algorithmic foundations. 3D undulating tensor manifolds mapped through continuous sinusoidal transforms, visualizing the mathematical substrate of deep representation learning.",
    badge: "3D SINE-WAVE GRID // FREQ: 0.038",
  },
  teach: {
    id: "teach",
    code: "02",
    tabLabel: "Teach",
    modeName: "RIPPLE",
    headline: "Concentric Gradient Shockwaves",
    caption:
      "Propagating knowledge and gradient updates. Concentric kinetic shockwaves radiating outward from the central learning nexus, representing backpropagation wavefronts across parameterized space.",
    badge: "POLAR EXPANSION // 12 DISCRETE RINGS",
  },
  connect: {
    id: "connect",
    code: "03",
    tabLabel: "Connect",
    modeName: "CONSTELLATION",
    headline: "Rotating Topological Sphere",
    caption:
      "Synthesizing global networks and real-world intelligence. Multi-node topological sphere with dynamic proximity telemetry and real-time line tessellation across high-dimensional latent space.",
    badge: "FIBONACCI SPHERE // DIST THRESHOLD: 42PX",
  },
};

export const projects = [
  {
    id: "electricity-forecasting",
    code: "ML-01",
    title: "Electricity Consumption Forecasting",
    italicSubtitle: "Abnormal Pattern Detection Engine",
    description:
      "Engineered a time-series predictive modeling system designed to forecast regional grid loads and isolate anomalous power consumption spikes. Utilizes automated feature extraction, rolling lag metrics, and scikit-learn regressors to deliver reliable early warning indicators.",
    technologies: ["Python", "scikit-learn", "Pandas", "NumPy", "Time-Series", "Matplotlib"],
    category: "ml",
    metrics: "Time-Series Anomaly Detection",
    status: "IN DEVELOPMENT",
    featured: true,
    github: "https://github.com/haseebjahangir26",
    linkText: "View Repository",
  },
  {
    id: "customer-churn",
    code: "ML-02",
    title: "Customer Churn Prediction Engine",
    italicSubtitle: "Probabilistic Classification Pipeline",
    description:
      "Constructed a high-fidelity classification pipeline applying Logistic Regression to historical behavioral signals. Incorporates categorical one-hot encodings, robust standard scaling, and precision-recall calibration to safeguard against retention revenue loss.",
    technologies: ["Python", "Logistic Regression", "Data Pipelines", "ROC-AUC Analysis", "Seaborn"],
    category: "ml",
    metrics: "Binary Classification Pipeline",
    status: "COMPLETED",
    featured: true,
    github: "https://github.com/haseebjahangir26",
    linkText: "Inspect Classifier",
  },
  {
    id: "gamevault",
    code: "SYS-01",
    title: "GameVault Discovery Platform",
    italicSubtitle: "Sub-120ms Catalog Engine",
    description:
      "Architected an ultra-responsive, zero-latency catalog exploration platform. Powered by asynchronous REST API streaming, client-side debounce caching, and multi-parameter taxonomy filters for effortless browsing across thousands of game titles.",
    technologies: ["JavaScript", "Async/Await", "REST APIs", "Modern DOM", "Performance CSS"],
    category: "web",
    metrics: "Fast API Querying",
    status: "COMPLETED",
    featured: true,
    github: "https://github.com/haseebjahangir26",
    linkText: "Explore Architecture",
  },
  {
    id: "sales-dashboard",
    code: "DAT-01",
    title: "Business Sales Intelligence Dashboard",
    italicSubtitle: "Multi-Dimensional KPI Telemetry",
    description:
      "Engineered an interactive analytics suite parsing multi-quarter revenue streams, regional sales velocities, and margin distribution. Built with clean Python pipelines for ETL aggregation and high-contrast analytical data representations.",
    technologies: ["Python", "ETL Pipelines", "Data Analytics", "KPI Telemetry", "Power BI"],
    category: "web",
    metrics: "Sales Analytics Suite",
    status: "COMPLETED",
    featured: false,
    github: "https://github.com/Haseebjahangir26/Business-Sales-Intelligence-Dashboard-",
    linkText: "Review Source",
  },
];

export const skillsGrouped = [
  {
    category: "Programming & Foundations",
    index: "01",
    summary: "Strong systems logic and mathematical problem-solving",
    skills: ["Python", "C++", "JavaScript (ES6+)", "SQL", "Object-Oriented Design"],
  },
  {
    category: "Machine Learning & Data",
    index: "02",
    summary: "Predictive pipelines, statistical validation, and feature pipelines",
    skills: ["scikit-learn", "Pandas", "NumPy", "Predictive Modeling", "Time-Series", "Matplotlib / Seaborn"],
  },
  {
    category: "Systems & Web Engineering",
    index: "03",
    summary: "Modular architecture, REST endpoints, and reactive interfaces",
    skills: ["Flask", "RESTful APIs", "MongoDB", "Modern HTML5/CSS3", "Vite Toolchain"],
  },
  {
    category: "Workflow & Developer Toolchain",
    index: "04",
    summary: "Production hygiene, version control, and Unix environments",
    skills: ["Git & GitHub", "Linux Environment", "VS Code", "Power BI", "Data Visualization"],
  },
];

export const education = {
  degree: "Bachelor of Science in Computer Science",
  degreeShort: "BSCS",
  university: "COMSATS University Islamabad",
  location: "Islamabad Campus, Pakistan",
  period: "2024 — 2028 (Expected)",
  status: "Active Full-Time Student",
  focus: "Artificial Intelligence, Machine Learning, and Distributed Software Systems",
  coursework: [
    {
      code: "CSC211",
      name: "Data Structures & Algorithms",
      desc: "Asymptotic complexity analysis, graph traversals, balanced search trees, and dynamic programming paradigms.",
    },
    {
      code: "CSC241",
      name: "Database Systems",
      desc: "Relational algebra, schema normalization (3NF/BCNF), indexing strategies, and transactional ACID guarantees.",
    },
    {
      code: "CSC322",
      name: "Operating Systems",
      desc: "Process concurrency, virtual memory paging, CPU scheduling algorithms, and POSIX multithreading.",
    },
    {
      code: "CSC350",
      name: "Machine Learning & AI",
      desc: "Supervised and unsupervised methodologies, gradient descent dynamics, loss landscape optimization, and model evaluation metrics.",
    },
    {
      code: "CSC225",
      name: "Computer Organization & Assembly",
      desc: "Instruction set architectures (x86/MIPS), pipeline hazard mitigation, register allocation, and memory hierarchies.",
    },
  ],
};

export const terminalCommands = [
  "python train_forecaster.py --dataset=grid_consumption --epochs=60",
  "python -m evaluation.evaluate_churn --roc-auc --confusion-matrix",
  "git commit -m 'feat(halftone): high-density grain dispersion and scroll dissolution'",
  "npm run build && vite preview --port 3000",
  "python -c 'import torch; print(f\"CUDA Enabled: {torch.cuda.is_available()}\")'",
  "jupyter lab --no-browser --port=8888",
  "curl -X GET https://jeiji.tech/api/v1/health | jq .status",
];
