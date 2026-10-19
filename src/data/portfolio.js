/**
 * Portfolio Data — jeiji.tech
 * Edit this file to update projects, skills, and other content.
 * All portfolio content is centralized here for easy maintenance.
 */

export const siteConfig = {
  name: "Haseeb Jahangir",
  displayName: "JJ",
  title: "Computer Science Student | Aspiring AI/ML Engineer | Software Developer",
  email: "contact@jeiji.tech", // UPDATE: Replace with your real email
  github: "https://github.com/haseebjahangir26",
  // linkedin: "", // ADD: Your LinkedIn profile URL when available
  location: "Islamabad, Pakistan",
  domain: "jeiji.tech",
};

export const projects = [
  {
    id: "electricity-forecasting",
    title: "Electricity Consumption Forecasting",
    subtitle: "Abnormal Consumption Pattern Detection",
    description:
      "A machine learning project focused on forecasting electricity consumption and identifying unusual usage patterns using data analysis and predictive modeling techniques.",
    technologies: ["Python", "Pandas", "NumPy", "scikit-learn", "Matplotlib"],
    category: "ml",
    status: "in-progress",
    // github: "", // ADD: Repository URL when available
    // demo: "",   // ADD: Demo URL when available
    featured: true,
  },
  {
    id: "customer-churn",
    title: "Customer Churn Prediction",
    subtitle: "Classification Model",
    description:
      "A machine learning model that predicts customer churn using customer data and classification techniques. Built with Logistic Regression on a labeled dataset.",
    technologies: ["Python", "Pandas", "NumPy", "scikit-learn", "Logistic Regression"],
    category: "ml",
    status: "completed",
    // github: "", // ADD: Repository URL when verified
    // demo: "",
    featured: true,
  },
  {
    id: "gamevault",
    title: "GameVault",
    subtitle: "Game Discovery Platform",
    description:
      "A game discovery platform designed to make it easy to explore and browse a large catalog of games with fast search and filtering capabilities.",
    technologies: ["JavaScript", "API Integration"],
    category: "web",
    status: "completed",
    // github: "", // ADD: Repository URL when verified
    // demo: "",
    featured: true,
  },
  {
    id: "sales-dashboard",
    title: "Business Sales Intelligence Dashboard",
    subtitle: "Data Analytics Dashboard",
    description:
      "An interactive business intelligence dashboard for sales analytics, built with Python for data processing and visualization of key business metrics.",
    technologies: ["Python", "Data Visualization", "Analytics"],
    category: "web",
    status: "completed",
    github: "https://github.com/Haseebjahangir26/Business-Sales-Intelligence-Dashboard-",
    featured: false,
  },
];

export const skills = [
  {
    category: "Programming",
    icon: "code",
    items: ["Python", "C++", "JavaScript"],
  },
  {
    category: "Data Science & ML",
    icon: "brain",
    items: ["Pandas", "NumPy", "scikit-learn", "Matplotlib", "Data Analysis"],
  },
  {
    category: "Backend & Web",
    icon: "server",
    items: ["Flask", "MongoDB", "REST APIs", "HTML/CSS"],
  },
  {
    category: "Mobile Development",
    icon: "mobile",
    items: ["Flutter", "Firebase"],
  },
  {
    category: "Analytics",
    icon: "chart",
    items: ["Power BI", "Data Visualization"],
  },
  {
    category: "Tools & Platforms",
    icon: "tools",
    items: ["Git", "GitHub", "VS Code", "Linux"],
  },
];

export const education = {
  degree: "Bachelor of Science in Computer Science (BSCS)",
  university: "COMSATS University Islamabad",
  graduationYear: "2028",
  coursework: [
    "Data Structures & Algorithms",
    "Database Systems",
    "Operating Systems",
    "Computer Organization & Assembly Language",
    "Machine Learning",
  ],
};

export const terminalCommands = [
  'echo "Hello, World! 👋"',
  "python train_model.py --epochs 50",
  "git push origin main",
  "npm run build && npm run deploy",
  'echo "Building the future with code..."',
  "jupyter notebook analysis.ipynb",
  "flask run --host=0.0.0.0",
  "pytest tests/ -v --cov",
];
