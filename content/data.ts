// Single source of truth for all site content.
// Values in [brackets] or 0 for numbers are placeholders — replace with real, verifiable data.

export const profile = {
  name: "Mustafa Tuncay",
  role: "Senior Full Stack Engineer",
  tagline: "Senior Full Stack Engineer | Digital Transformation | Enterprise Solutions",
  headline: "Building scalable digital solutions from idea to production.",
  location: "Munich, Germany",
  email: "hello@your-domain.dev", // TODO: personal email (no client/employer contact data)
  linkedin: "https://www.linkedin.com/in/your-handle", // TODO
  github: "https://github.com/your-handle", // TODO
  resume: "/resume.pdf", // TODO: anonymised CV at public/resume.pdf
  siteUrl: "https://your-domain.dev", // TODO
  languages: ["German", "English", "Turkish", "Japanese (A2)"],
  about:
    "Full Stack Engineer with 10+ years of experience building end-to-end solutions for insurance, financial services and digital platforms. I work across the entire value chain — from requirements and architecture through frontend, backend and data, to deployment and operations — with a focus on JavaScript, TypeScript, Node.js and PostgreSQL.",
};

export const phases = [
  { id: "journey", label: "Discover" },
  { id: "skills", label: "Analyze" },
  { id: "architecture", label: "Design" },
  { id: "projects", label: "Build" },
  { id: "transformation", label: "Deploy" },
  { id: "impact", label: "Transform" },
] as const;

export type Milestone = {
  id: string; title: string; period: string; org: string; summary: string; highlights: string[]; future?: boolean;
};

export const journey: Milestone[] = [
  { id: "student", title: "Student", period: "[YYYY – YYYY]", org: "Hof University of Applied Sciences",
    summary: "B.Sc. Media Informatics — where software, design and users met for the first time.",
    highlights: ["Software engineering fundamentals", "Web & media technologies", "First full-stack projects"] },
  { id: "developer", title: "Developer", period: "[YYYY – YYYY]", org: "Cooperative IT provider for tax advisors",
    summary: "Built financial and tax applications and contributed to B2B software solutions.",
    highlights: ["Finance & tax applications", "Quality assurance & documentation", "Automated validation processes"] },
  { id: "fullstack", title: "Full Stack Engineer", period: "[YYYY – YYYY]", org: "Global insurance group · Assistance services",
    summary: "Owned frontend and backend components and the PostgreSQL data model.",
    highlights: ["Frontend & backend components", "PostgreSQL database design", "Interface & architecture optimisation", "Automation for efficiency"] },
  { id: "senior", title: "Senior Analyst", period: "[YYYY] – today", org: "Accenture · Global insurance account",
    summary: "Enterprise delivery in global remote teams — from requirements to production support.",
    highlights: ["Node.js backends & internal/external APIs", "Perl → Python migration of transfer scripts", "Releases, change & incident management", "Business-process digitalisation"] },
  { id: "future", title: "Future Vision", period: "next", org: "Solution Architecture · AI-assisted engineering",
    summary: "Leading transformations end to end — architecture, teams and AI-native delivery.",
    highlights: ["Solution & enterprise architecture", "Agentic AI in delivery", "Technical leadership"], future: true },
];

export type SkillCategory = "Frontend" | "Backend" | "Cloud" | "DevOps" | "Architecture" | "Databases" | "Consulting";

export type Skill = { id: string; name: string; category: SkillCategory; level: 1 | 2 | 3 | 4 | 5; years: string; detail: string; related: string[] };

export const categoryColor: Record<SkillCategory, string> = {
  Frontend: "#00D4FF", Backend: "#38BDF8", Cloud: "#7B61FF", DevOps: "#A78BFA",
  Architecture: "#C084FC", Databases: "#22D3EE", Consulting: "#F472B6",
};

export const skills: Skill[] = [
  { id: "ts", name: "TypeScript", category: "Frontend", level: 5, years: "[8+]", detail: "Primary language across frontend and backend; strict typing for enterprise code bases.", related: ["node", "react", "angular"] },
  { id: "react", name: "React", category: "Frontend", level: 4, years: "[X]", detail: "Component-driven UIs, hooks, state management and performance tuning.", related: ["ts", "node"] },
  { id: "angular", name: "Angular", category: "Frontend", level: 4, years: "[X]", detail: "Enterprise frontends with modules, RxJS and typed forms.", related: ["ts", "rest"] },
  { id: "node", name: "Node.js", category: "Backend", level: 5, years: "[8+]", detail: "Scalable backends with Express.js; internal & external API development for insurance platforms.", related: ["ts", "pg", "rest", "docker"] },
  { id: "rest", name: "REST APIs", category: "Backend", level: 5, years: "[8+]", detail: "API design, versioning, integration of complex system landscapes.", related: ["node", "arch"] },
  { id: "python", name: "Python", category: "Backend", level: 3, years: "[X]", detail: "Automation and data-transfer scripts (SFTP); migrated legacy Perl jobs to Python.", related: ["devops"] },
  { id: "java", name: "Java", category: "Backend", level: 3, years: "[X]", detail: "Backend development; currently deepening Spring Boot and JPA/Hibernate.", related: ["sql"] },
  { id: "dotnet", name: ".NET", category: "Backend", level: 2, years: "working knowledge", detail: "Working knowledge — integration with .NET-based enterprise services.", related: ["azure"] },
  { id: "pg", name: "PostgreSQL", category: "Databases", level: 5, years: "[8+]", detail: "Data modelling, query optimisation and database design for transactional workloads.", related: ["node", "sql"] },
  { id: "sql", name: "SQL", category: "Databases", level: 5, years: "[10+]", detail: "Complex queries, migrations and performance analysis.", related: ["pg", "java"] },
  { id: "docker", name: "Docker", category: "DevOps", level: 4, years: "[X]", detail: "Containerised services and reproducible environments.", related: ["k8s", "node", "devops"] },
  { id: "k8s", name: "Kubernetes", category: "Cloud", level: 3, years: "[X]", detail: "Operating containerised workloads; troubleshooting with k9s.", related: ["docker", "azure"] },
  { id: "azure", name: "Azure", category: "Cloud", level: 2, years: "working knowledge", detail: "Working knowledge of cloud services and deployment targets.", related: ["k8s", "dotnet"] },
  { id: "devops", name: "CI/CD · DevOps", category: "DevOps", level: 4, years: "[X]", detail: "Jenkins pipelines, Git workflows, releases and change management.", related: ["docker", "python"] },
  { id: "arch", name: "Enterprise Architecture", category: "Architecture", level: 3, years: "[X]", detail: "Interface and system architecture optimisation across complex landscapes.", related: ["rest", "req"] },
  { id: "req", name: "Requirements Engineering", category: "Consulting", level: 4, years: "[X]", detail: "Translating business processes into clear, testable requirements.", related: ["arch", "agile"] },
  { id: "agile", name: "Scrum · SAFe · TDD", category: "Consulting", level: 4, years: "[X]", detail: "Agile delivery in cross-functional, global remote teams; Design Thinking.", related: ["req"] },
];

export const architectureLayers = [
  { id: "fe", name: "Frontend", tech: "React · Angular · TypeScript", decision: "Typed component architecture so UI and API contracts evolve together." },
  { id: "api", name: "API Layer", tech: "Node.js · Express · REST", decision: "Versioned REST contracts; one gateway for internal and external consumers." },
  { id: "bl", name: "Business Logic", tech: "Domain services · Validation", decision: "Business rules isolated from transport — testable with TDD and reusable." },
  { id: "db", name: "Database", tech: "PostgreSQL", decision: "Relational integrity for insurance data; JSONB where payloads must stay flexible." },
  { id: "cloud", name: "Cloud", tech: "Docker · Kubernetes · CI/CD", decision: "Immutable containers and automated pipelines for repeatable releases." },
] as const;

export type Project = {
  id: string; code: string; name: string; industry: string; impact: string; stack: string[]; arch: string[]; context: string;
  results: { label: string; value: number; suffix: string }[];
};

// Client names anonymised. value 0 renders as "[X]" until you add real numbers.
export const projects: Project[] = [
  { id: "insurance-platform", code: "PRJ-01", name: "Insurance Platform Modernization", industry: "Global insurance",
    impact: "Modernised backend services and data pipelines for a global insurer.",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "Python", "REST", "Docker"], arch: ["Portal", "API", "Services", "PostgreSQL"],
    context: "Developed and maintained frontend, backend and database components, built internal and external APIs, and rewrote legacy Perl transfer scripts (SFTP) in Python.",
    results: [{ label: "Legacy scripts migrated", value: 0, suffix: "" }, { label: "Manual effort reduced", value: 0, suffix: "%" }, { label: "APIs delivered", value: 0, suffix: "" }] },
  { id: "assistance-services", code: "PRJ-02", name: "Assistance Services Platform", industry: "Insurance · Assistance",
    impact: "End-to-end components and data model for an assistance-services platform.",
    stack: ["Angular", "Node.js", "PostgreSQL", "REST"], arch: ["Web App", "API", "Domain", "PostgreSQL"],
    context: "Built frontend and backend components, designed the PostgreSQL schema, optimised technical interfaces and automated existing functions to increase efficiency.",
    results: [{ label: "Interfaces optimised", value: 0, suffix: "" }, { label: "Processing time saved", value: 0, suffix: "%" }, { label: "Automated functions", value: 0, suffix: "" }] },
  { id: "tax-suite", code: "PRJ-03", name: "Tax & Finance B2B Suite", industry: "Financial services",
    impact: "Financial and tax applications for advisors and businesses.",
    stack: ["TypeScript", "SQL", "Test automation"], arch: ["Client", "Services", "Validation", "SQL"],
    context: "Contributed to B2B financial and tax applications, owned quality assurance and technical documentation, and automated testing and validation processes.",
    results: [{ label: "Validation checks automated", value: 0, suffix: "" }, { label: "Test coverage", value: 0, suffix: "%" }, { label: "Releases supported", value: 0, suffix: "" }] },
];

export const transformation = {
  legacy: ["Manual Perl transfer jobs", "Manual validation & checks", "Point-to-point interfaces", "Tribal deployment knowledge"],
  modern: ["Python pipelines with logging", "Automated test & validation", "Versioned REST APIs", "CI/CD with containers"],
  value: [{ label: "Manual effort", value: "[−X%]" }, { label: "Error rate", value: "[−X%]" }, { label: "Release lead time", value: "[−X%]" }],
};

export const metrics = [
  { label: "Years of Experience", value: 10, suffix: "+" },
  { label: "Solutions Delivered", value: 0, suffix: "+" },
  { label: "Technologies Used", value: skills.length, suffix: "" },
  { label: "Projects Completed", value: 0, suffix: "+" },
  { label: "Enterprise Transformations", value: 0, suffix: "" },
];

export const labProjects = [
  { name: "Daily Briefing Agent", desc: "Power Automate + Copilot agent that summarises mail, tasks and calendar every morning at 07:00.", tag: "AI · Automation" },
  { name: "This Portfolio", desc: "Next.js, Framer Motion and a morphing Three.js particle system that follows the lifecycle.", tag: "Next.js · Three.js" },
  { name: "Agent → OneDrive → Dashboard", desc: "Agent fills structured files in OneDrive; a JS frontend visualises them.", tag: "Experimental" },
];

// ───────────────────────── Role Fit Simulator ─────────────────────────
// Self-assessment, levels 0–5. Adjust honestly.
export type FitItem = { id: string; label: string; level: 0 | 1 | 2 | 3 | 4 | 5; aliases: string[]; note: string };

export const fitProfile: FitItem[] = [
  { id: "node", label: "Node.js", level: 5, aliases: ["node", "node.js", "nodejs", "express", "express.js"], note: "Core stack" },
  { id: "ts", label: "TypeScript", level: 5, aliases: ["typescript"], note: "Primary language" },
  { id: "js", label: "JavaScript", level: 5, aliases: ["javascript", "ecmascript"], note: "Primary language" },
  { id: "react", label: "React", level: 4, aliases: ["react", "react.js", "reactjs", "next.js", "nextjs"], note: "Production UIs" },
  { id: "angular", label: "Angular", level: 4, aliases: ["angular", "rxjs"], note: "Enterprise frontends" },
  { id: "pg", label: "PostgreSQL", level: 5, aliases: ["postgresql", "postgres"], note: "Schema design & tuning" },
  { id: "sql", label: "SQL", level: 5, aliases: ["sql", "rdbms", "relational database"], note: "Daily driver" },
  { id: "rest", label: "REST APIs", level: 5, aliases: ["rest", "restful", "api", "apis", "openapi"], note: "Internal & external APIs" },
  { id: "docker", label: "Docker", level: 4, aliases: ["docker", "container", "containers"], note: "Containerised services" },
  { id: "k8s", label: "Kubernetes", level: 3, aliases: ["kubernetes", "k8s", "k9s", "openshift"], note: "Operate & troubleshoot" },
  { id: "cicd", label: "CI/CD", level: 4, aliases: ["ci/cd", "cicd", "jenkins", "devops", "pipeline", "pipelines"], note: "Jenkins, releases" },
  { id: "git", label: "Git", level: 5, aliases: ["git", "github", "gitlab", "bitbucket"], note: "Daily" },
  { id: "python", label: "Python", level: 3, aliases: ["python"], note: "Automation, Perl→Python" },
  { id: "java", label: "Java", level: 3, aliases: ["java"], note: "Backend experience" },
  { id: "spring", label: "Spring Boot", level: 2, aliases: ["spring", "spring boot", "hibernate", "jpa"], note: "Actively learning" },
  { id: "azure", label: "Azure", level: 2, aliases: ["azure"], note: "Working knowledge" },
  { id: "dotnet", label: ".NET", level: 2, aliases: [".net", "dotnet", "c#"], note: "Working knowledge" },
  { id: "aws", label: "AWS", level: 1, aliases: ["aws", "amazon web services", "lambda"], note: "Transferable cloud concepts" },
  { id: "req", label: "Requirements Eng.", level: 4, aliases: ["requirements", "requirements engineering", "business analysis", "stakeholder", "stakeholders"], note: "Business ↔ tech translation" },
  { id: "agile", label: "Scrum / SAFe", level: 4, aliases: ["scrum", "safe", "agile", "kanban", "tdd", "design thinking"], note: "Cross-functional teams" },
  { id: "arch", label: "Architecture", level: 3, aliases: ["architecture", "solution design", "microservices", "system design", "integration"], note: "Interfaces & integration" },
  { id: "ops", label: "Production support", level: 4, aliases: ["incident", "itil", "production support", "change management", "release management", "on-call"], note: "Releases, incidents, changes" },
  { id: "ai", label: "AI-assisted dev", level: 3, aliases: ["ai", "llm", "copilot", "genai", "agentic", "claude"], note: "Copilot, agents, automation" },
  { id: "insurance", label: "Insurance domain", level: 5, aliases: ["insurance", "insurer", "claims"], note: "Global insurance clients" },
  { id: "finance", label: "Financial services", level: 4, aliases: ["finance", "financial", "banking", "tax", "fintech"], note: "Tax & finance B2B" },
  { id: "remote", label: "Global remote teams", level: 5, aliases: ["remote", "distributed", "international", "global"], note: "Remote & on site" },
  { id: "de", label: "German", level: 5, aliases: ["german", "deutsch"], note: "Fluent" },
  { id: "en", label: "English", level: 5, aliases: ["english", "englisch"], note: "Fluent" },
  { id: "tr", label: "Turkish", level: 5, aliases: ["turkish", "türkisch"], note: "Fluent" },
  { id: "ja", label: "Japanese", level: 2, aliases: ["japanese", "japanisch", "jlpt"], note: "A2 — studying" },
];

export const fitPresets: { label: string; ids: string[] }[] = [
  { label: "Full Stack (Node)", ids: ["node", "ts", "react", "pg", "rest", "docker", "cicd", "agile"] },
  { label: "Enterprise Backend", ids: ["node", "java", "spring", "sql", "rest", "k8s", "arch", "ops"] },
  { label: "Transformation Consultant", ids: ["req", "agile", "arch", "insurance", "remote", "de", "en", "ai"] },
];

// ───────────────────────── README section — "CV as a repository" ─────────────────────────
export const readmeFiles: Record<string, string> = {
  "README.md": `# Mustafa Tuncay
> Full Stack Engineer who translates between business and code.

## TL;DR
- 10+ years building end-to-end software
- Insurance · Financial services · Digital platforms
- Node.js · TypeScript · PostgreSQL at the core

## Quick start
Bring me the problem, not just the ticket.
I ask "why" until the requirement is clear — then I build it properly.

## Runs best in
- Cross-functional teams, remote or on site
- Places where feedback is direct and frequent`,
  "how-i-work.md": `# How I work

## Communication
- Complex topics, explained simply — to engineers and stakeholders
- Decisions written down; calls when they save time
- German · English · Turkish · Japanese (A2)

## Delivery
- Understand the business process before touching the code
- Small, reviewed, tested increments
- Production is part of the job: releases, incidents, changes

## Feedback
- Open and receptive — tell me early, tell me directly`,
  "KNOWN_ISSUES.md": `# Known issues — honest edition

- [ ] #1 Japanese at A2 — studying actively
- [ ] #2 Spring Boot / Hibernate — deepening, not yet daily driver
- [ ] #3 Asks many "why" questions early  (works as intended)
- [x] #4 Legacy Perl transfer scripts — migrated to Python, closed`,
};

export const values = {
  clarity: "over cleverness",
  ownership: "from requirement to production",
  pragmatism: "the simplest architecture that scales",
  curiosity: ["AI-assisted engineering", "Java / Spring Boot", "Japanese"],
  team: "shared success over hero mode",
  openToFeedback: true,
};
