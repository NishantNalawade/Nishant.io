# Nishant Nalawade's portfolio

Static HTML/CSS portfolio hosted on GitHub Pages. The content and downloadable
[resume](Resume.pdf) reflect the supplied engineering resume. No JavaScript,
package installation or build step is required to view the site.
The existing `Resume (1).pdf` URL serves the same updated document for compatibility.

- [Main portfolio](index.html): experience, skills, impact, awards and education.
- [Legacy entry point](home1.html): redirects to the current portfolio, with a
  normal link as a fallback.
- [Styles](css/style.css): portfolio rules are scoped to the `portfolio` body.
  The original Josefin Sans typography, purple-to-pink gradient, background
  artwork and Colorlib attribution are retained. The Google font is optional;
  the site falls back to sans-serif if it cannot be loaded.
- [Optional animation](js/portfolio.js): sections gently fade and rise into view.
  Native smooth scrolling handles section links. Both effects respect
  `prefers-reduced-motion`; content remains visible without JavaScript or
  animation support. The resume button uses an inline download icon and PDF badge.

## Local checks

From the repository root, run:

```powershell
python -m unittest discover -s tests -v
node --test tests\portfolio.test.js
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000` and check desktop/mobile layouts, keyboard navigation,
the resume download and the legacy entry point. Content remains accessible when
JavaScript or third-party services are unavailable.

Regression tests cover local asset paths, fragment links, resume downloads,
contact/profile links, key resume content and the legacy redirect. Keep
`Resume.pdf` and the main portfolio in sync for future resume updates.
