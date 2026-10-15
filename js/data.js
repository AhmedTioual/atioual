/* =========================================================
   PROJECTS — edit this file to change what the site shows.
   - category: "engineering" | "bi" | "ml" (can be several)
   - images: any missing file shows a dashed placeholder with its
     file name, so you know exactly where to drop the screenshot.
   ========================================================= */
window.PROJECTS = [
  {
    id: "repuinsight",
    title: "RepuInsight",
    subtitle: "Multi-tenant e-reputation analytics platform",
    category: ["engineering", "ml"],
    year: "2026",
    team: "Team of 6 · Université de Lorraine",
    cover: "assets/img/projects/repuinsight-architecture.jpg",
    summary:
      "Automated scraping of social and search data, Python ETL with BERT sentiment scoring, a PostgreSQL constellation warehouse and a Django + Next.js dashboard with per-company data isolation.",
    metrics: [
      { v: "5", l: "fact tables" },
      { v: "8", l: "dimensions" },
      { v: "4", l: "KPIs" }
    ],
    details: [
      "Collection: Python scrapers (BeautifulSoup, Playwright) for Google Trends, Instagram and Facebook, scheduled with GitHub Actions; raw CSVs versioned in a private Supabase bucket.",
      "ETL: modular Python pipeline (extract → clean → transform → load) with normalization, text cleaning, term extraction and logging.",
      "NLP: multilingual BERT model (bert-base-multilingual-uncased-sentiment) to score every collected message.",
      "Warehouse: PostgreSQL constellation schema — 5 fact tables (social engagement, sentiment, term frequency, visibility, associated queries) sharing time and entity dimensions; MD5 hashes for text uniqueness; row-level security.",
      "Serving: Django REST API exposing Visibility, Popularity, Sentiment and Engagement KPIs, filtered per logged-in company; Next.js + TypeScript dashboard."
    ],
    stack: ["Python", "BeautifulSoup", "Playwright", "GitHub Actions", "Supabase", "PostgreSQL", "BERT", "Django REST", "Next.js"],
    images: [
      { src: "assets/img/projects/repuinsight-architecture.jpg", caption: "Pipeline architecture: sources → raw layer → warehouse → dashboard" },
      { src: "assets/img/projects/repuinsight-constellation-schema.jpg", caption: "Constellation schema — 5 fact tables, shared dimensions" },
      { src: "assets/img/projects/repuinsight-dashboard-overview.jpg", caption: "Dashboard — overview page" },
      { src: "assets/img/projects/repuinsight-dashboard-sentiment.jpg", caption: "Dashboard — sentiment page" }
    ],
    links: [
      // { label: "GitHub", url: "https://github.com/..." }
    ]
  },
  {
    id: "football",
    title: "European Football Data Warehouse",
    subtitle: "24 seasons · 5 leagues · 42K+ matches",
    category: ["engineering", "bi"],
    year: "2026",
    team: "Team of 2 · M2 Big Data project",
    cover: "assets/img/projects/football-league-overview.jpg",
    summary:
      "Automated collection of season files, a star schema in PostgreSQL loaded by orchestrated Talend jobs, and three interactive Power BI dashboards.",
    metrics: [
      { v: "42K+", l: "matches" },
      { v: "113K", l: "goals" },
      { v: "3", l: "dashboards" }
    ],
    details: [
      "Collection: scraping of season CSVs from football-data.co.uk (2000–2024), consolidated into one source file for a reproducible pipeline.",
      "Modeling: star schema around Fact_Match (scores, goal difference, points, outcome) with Team (role-playing home/away), Competition, Date and Referee dimensions.",
      "ETL (Talend): tConvertType for typing, tUniqRow for unique dimension members, tMap for business rules (3/1/0 points) and foreign-key lookups; a master job runs DIM_JOB then FACT_JOB.",
      "BI (Power BI): League Overview, Team Performance and Match Analysis dashboards with slicers for competition, team, date and referee."
    ],
    stack: ["Python", "Web scraping", "Talend", "PostgreSQL", "Star schema", "Power BI", "DAX"],
    images: [
      { src: "assets/img/projects/football-league-overview.jpg", caption: "League Overview — outcomes, goal distribution, trends" },
      { src: "assets/img/projects/football-team-performance.jpg", caption: "Team Performance — ranking, home vs away, attack vs defense" },
      { src: "assets/img/projects/football-match-analysis.jpg", caption: "Match Analysis — score heatmap, biggest wins, goals by country" },
      { src: "assets/img/projects/football-star-schema.jpg", caption: "Star schema of the warehouse" },
      { src: "assets/img/projects/football-talend-dimensions.jpg", caption: "Talend job loading the dimensions" },
      { src: "assets/img/projects/football-talend-facts.jpg", caption: "Talend job loading Fact_Match with key lookups" }
    ],
    links: []
  },
  {
    id: "banking",
    title: "Banking BI Warehouse",
    subtitle: "Accounts, products & balances over 36 months",
    category: ["engineering", "bi"],
    year: "2026",
    team: "Personal project",
    cover: "assets/img/projects/banking-overview.jpg",
    summary:
      "Realistic synthetic banking data generated in Python, loaded by Talend into a SQL Server warehouse and analyzed in a Power BI report.",
    metrics: [
      { v: "36", l: "months" },
      { v: "5", l: "products" },
      { v: "96", l: "active accounts" }
    ],
    details: [
      "Data generation: Python scripts producing current accounts, savings (Livret A, PEL) and credit products (consumer, mortgage) with monthly movements.",
      "ETL: Talend jobs cleaning, transforming and loading into a SQL Server data warehouse.",
      "BI: Power BI overview with gross balance, average balance per account and active accounts, broken down by category, product type and month; slicers for product, account status, currency and period."
    ],
    stack: ["Python", "Talend", "SQL Server", "Power BI", "DAX"],
    images: [
      { src: "assets/img/projects/banking-overview.jpg", caption: "Overview — gross balance trend, KPIs, breakdown by product" },
      { src: "assets/img/projects/finance_schema.jpg", caption: "Schema of the warehouse" },
    ],
    links: []
  },
  {
    id: "drought",
    title: "Drought Monitoring with Satellite Data",
    subtitle: "Sentinel imagery · Google Earth Engine · XGBoost",
    category: ["ml"],
    year: "2025",
    team: "CRSA · research internship",
    cover: "assets/img/projects/drought-map.jpg",
    summary:
      "Machine-learning model classifying drought conditions from Sentinel satellite data processed in Google Earth Engine, reaching 94% accuracy.",
    metrics: [
      { v: "94%", l: "accuracy" },
      { v: "XGB", l: "model" }
    ],
    details: [
      "Data: Sentinel satellite imagery and derived indices extracted with Google Earth Engine.",
      "Model: XGBoost classifier trained to detect drought conditions — 94% accuracy.",
      "Context: work with remote-sensing scientists studying climate-change impact on agriculture."
    ],
    stack: ["Python", "Google Earth Engine", "Sentinel", "XGBoost", "scikit-learn"],
    images: [
      { src: "assets/img/projects/drought-map.jpg", caption: "Drought map output" },
      { src: "assets/img/projects/drought-model-results.jpg", caption: "Model evaluation" }
    ],
    links: []
  }
];
