# Mission Control | Nishant Nalawade

An engineering portfolio with a midnight-blue Mission Control interface, impact
metrics, an interactive Invoice Capture architecture explorer and project case studies.
Static HTML/CSS hosted on GitHub Pages. The content and downloadable
[resume](Resume.pdf) reflect the supplied engineering resume. No JavaScript,
package installation or build step is required to view the site.
The existing `Resume (1).pdf` URL serves the same updated document for compatibility.

- [Main portfolio](index.html): experience, skills, impact, awards and education.
- [Legacy entry point](home1.html): redirects to the current portfolio, with a
  normal link as a fallback.
- [Styles](css/mission-control.css): responsive dark theme with native system fonts.
  No framework, external font or third-party runtime is required. The old
  template assets remain in the repository but are not loaded.
- The architecture explorer uses native radio buttons for before/after views and
  expandable stages. It works without JavaScript. It is a simplified illustration,
  not a production topology, live telemetry or a claim of live system access.
- [Optional animation](js/portfolio.js): sections gently fade and rise into view.
  Native smooth scrolling handles section links. Both effects respect
  `prefers-reduced-motion`; content remains visible without JavaScript or
  animation support. A brief decorative packet animation illustrates the pipeline;
  it stops automatically and is disabled for reduced motion.

## Local checks

From the repository root, run:

```powershell
python -m unittest discover -s tests -v
node --test tests\portfolio.test.js
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000` and check desktop/mobile layouts, keyboard navigation,
before/after selection, expandable pipeline stages and experience details,
the resume download and the legacy entry point. Content remains accessible when
JavaScript or third-party services are unavailable.

Regression tests cover local asset paths, fragment links, resume downloads,
contact/profile links, key resume content and the legacy redirect. Keep
`Resume.pdf` and the main portfolio in sync for future resume updates.
