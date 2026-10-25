# Nishant Nalawade's portfolio

Static HTML/CSS portfolio hosted on GitHub Pages. The content and downloadable
[resume](Resume.pdf) reflect the supplied engineering resume. No JavaScript,
package installation or build step is required to view the site.
The existing `Resume (1).pdf` URL serves the same updated document for compatibility.

- [Main portfolio](index.html): experience, skills, impact, awards and education.
- [Legacy entry point](home1.html): redirects to the current portfolio, with a
  normal link as a fallback.
- [Styles](css/style.css): portfolio rules are scoped to the `portfolio` body.
  Original template styles and Colorlib attribution are retained.

## Local checks

From the repository root, run:

```powershell
python -m unittest discover -s tests -v
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000` and check desktop/mobile layouts, keyboard navigation,
the resume download and the legacy entry point. Content remains accessible when
JavaScript or third-party services are unavailable.

Regression tests cover local asset paths, fragment links, resume downloads,
contact/profile links, key resume content and the legacy redirect. Keep
`Resume.pdf` and the main portfolio in sync for future resume updates.
