# Ahmed Tioual — Data Portfolio

A static, single-page portfolio with a Three.js 3D particle scene that morphs into a different "data shape" for each section (globe → pipeline helix → data wave → 3D bar chart → knot).

No build step. Plain HTML, CSS and JavaScript.

## Run it locally

Opening `index.html` directly works, but a local server is closer to real hosting:

```bash
cd ahmed-tioual-portfolio
python -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html              → all page sections (About, Experience, Skills, Education, Contact)
css/style.css           → design (colors are CSS variables at the top)
js/data.js              → PROJECTS — edit project text, metrics, screenshots here
js/scene.js             → 3D background (Three.js)
js/main.js              → animations, project cards, modal, lightbox
assets/img/projects/    → project screenshots
assets/img/profile/     → your photo (profile.jpg)
assets/cv/              → your CV (Ahmed_Tioual_CV.pdf)
```

## What to add yourself

Any missing image shows a dashed placeholder **with the exact file path to use**, so just drop the file in and refresh.

| File to add | Where it shows |
|---|---|
| `assets/img/profile/profile.jpg` | About section (square, ~800×800) |
| `assets/cv/Ahmed_Tioual_CV.pdf` | "Download CV" button |
| `assets/img/projects/repuinsight-dashboard-overview.jpg` | RepuInsight modal |
| `assets/img/projects/repuinsight-dashboard-sentiment.jpg` | RepuInsight modal |
| `assets/img/projects/banking-talend-job.jpg` | Banking modal |
| `assets/img/projects/banking-warehouse-schema.jpg` | Banking modal |
| `assets/img/projects/drought-map.jpg` | Drought card + modal |
| `assets/img/projects/drought-model-results.jpg` | Drought modal |

Already included: 3 football dashboards, football star schema and Talend jobs, banking overview, RepuInsight architecture and constellation schema.

Also search `index.html` for `EDIT` to fill in:
- dates (`YYYY`) for older internships and degrees
- school names for the BTS and Licence Pro
- LinkedIn / GitHub / Upwork URLs and certification links
- languages

To add another screenshot to a project, add a line to its `images` list in `js/data.js`.

## Confidentiality note

The IEE section uses neutral wording ("technical and commercial data", "legacy-to-AWS migration"). Check with your supervisor before adding screenshots or more specific details from the internship.

## Deploy (free)

- **GitHub Pages:** push the folder to a repo → Settings → Pages → deploy from `main` branch, root.
- **Netlify / Vercel:** drag and drop the folder onto the dashboard.
