import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.elements = []
        self.text = []
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def handle_data(self, data):
        self.text.append(data)


class WebsiteTests(unittest.TestCase):
    def test_local_assets_and_fragment_links_resolve(self):
        for path in ROOT.glob("*.html"):
            page = Page(path)
            ids = [attrs["id"] for _, attrs in page.elements if "id" in attrs]
            self.assertEqual(len(ids), len(set(ids)), path.name)
            for tag, attrs in page.elements:
                for key in ("href", "src"):
                    value = attrs.get(key)
                    if not value:
                        continue
                    url = urlsplit(value)
                    if url.scheme or url.netloc:
                        continue
                    with self.subTest(page=path.name, url=value):
                        if url.path:
                            self.assertTrue((ROOT / unquote(url.path)).is_file())
                        elif url.fragment:
                            self.assertIn(url.fragment, ids)

    def test_resume_downloads_are_local_pdf(self):
        page = Page(ROOT / "index.html")
        downloads = [attrs for tag, attrs in page.elements
                     if tag == "a" and "download" in attrs]
        self.assertEqual(len(downloads), 2)
        for attrs in downloads:
            self.assertEqual(attrs["href"], "Resume.pdf")
        self.assertTrue((ROOT / "Resume.pdf").read_bytes().startswith(b"%PDF-"))

    def test_core_content_is_available_without_javascript(self):
        page = Page(ROOT / "index.html")
        self.assertFalse(any(tag == "script" for tag, _ in page.elements))
        self.assertFalse(any(attrs.get("id") == "preloder"
                             for _, attrs in page.elements))
        self.assertEqual(sum(tag == "h1" for tag, _ in page.elements), 1)
        self.assertEqual(sum(tag == "main" for tag, _ in page.elements), 1)
        text = " ".join(page.text)
        for expected in ("Software Engineer II", "Microsoft", "SAP", "1,200",
                         "25% to 0%", "35% to <3%", "RAG", "2025",
                         "2017 \u2013 2021", "BITS Pilani", "honours"):
            self.assertIn(expected, text)
        for stale in ("Date of Birth", "C-35", "supremely qualified",
                      "Pursuing", "Resume.docx"):
            self.assertNotIn(stale, text)

    def test_contact_and_professional_profiles_match_resume(self):
        page = Page(ROOT / "index.html")
        links = {attrs.get("href") for tag, attrs in page.elements if tag == "a"}
        self.assertTrue({
            "mailto:1796nishant@gmail.com",
            "tel:+919971062831",
            "https://www.linkedin.com/in/nishant-nalawade/",
            "https://github.com/nishant-nalawade",
        }.issubset(links))

    def test_legacy_page_routes_to_current_portfolio_without_scripts(self):
        page = Page(ROOT / "home1.html")
        self.assertTrue(any(
            tag == "meta" and attrs.get("http-equiv") == "refresh"
            and attrs.get("content") == "0; url=index.html"
            for tag, attrs in page.elements))
        self.assertTrue(any(tag == "a" and attrs.get("href") == "index.html"
                            for tag, attrs in page.elements))


if __name__ == "__main__":
    unittest.main()
