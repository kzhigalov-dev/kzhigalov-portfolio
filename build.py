"""Build a standalone HTML and ZIP using Python's standard library."""
from pathlib import Path
import base64
import zipfile

root = Path(__file__).resolve().parent
html = (root / 'index.html').read_text()
css = (root / 'style.css').read_text()
js = (root / 'script.js').read_text()
def data_url(path):
    file = root / path
    mime = {'.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.png': 'image/jpeg'}.get(file.suffix, 'application/octet-stream')
    return 'data:' + mime + ';base64,' + base64.b64encode(file.read_bytes()).decode()
css = css.replace('assets/manrope.ttf', data_url('assets/manrope.ttf'))
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
html = html.replace('<script src="assets/css-doodle.min.js" defer></script>', '')
html = html.replace('<script src="script.js" defer></script>', '')
js = js.replace('`assets/${project.image}.png`', '(' + repr({'retail': data_url('assets/retail.png'), 'fraudlens': data_url('assets/fraudlens.png')}) + ')[project.image]')
html = html.replace('</body>', '<script>' + (root / 'assets/css-doodle.min.js').read_text() + '</script><script>' + js + '</script></body>')
for path in ['assets/retail.png', 'assets/fraudlens.png', 'assets/favicon.svg']:
    html = html.replace(path, data_url(path))
(root / 'portfolio-standalone.html').write_text(html)
# Keep the previously shared filename current, without a separate mobile design.
if (root / 'portfolio-mobile.html').exists():
    (root / 'portfolio-mobile.html').write_text(html)
with zipfile.ZipFile(root / 'portfolio.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for name in ['index.html', 'style.css', 'script.js', 'README.md', 'SOURCES.md', 'build.py', 'portfolio-standalone.html']:
        archive.write(root / name, name)
    for asset in sorted((root / 'assets').iterdir()):
        if asset.is_file():
            archive.write(asset, asset.relative_to(root))
    assert archive.testzip() is None
print('Built portfolio-standalone.html and portfolio.zip')
