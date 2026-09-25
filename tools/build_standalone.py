#!/usr/bin/env python3
"""Собирает релизные файлы: portfolio-standalone.html и portfolio.zip.

Автономный HTML содержит CSS, JavaScript, шрифт и изображения внутри себя.
Нужен только Python 3 из стандартной поставки: python3 tools/build_standalone.py
"""
import base64
import re
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'assets'
STANDALONE = ROOT / 'portfolio-standalone.html'
MOBILE_COPY = ROOT / 'portfolio-mobile.html'
ARCHIVE = ROOT / 'portfolio.zip'
ARCHIVE_FILES = ['index.html', 'style.css', 'script.js', 'game.js', 'experience.js', 'README.md', 'SOURCES.md']


def read(name):
    return (ROOT / name).read_text(encoding='utf-8')


def mime_type(path):
    head = path.read_bytes()[:12]
    if head.startswith(b'\xff\xd8\xff'):
        return 'image/jpeg'
    if head.startswith(b'\x89PNG'):
        return 'image/png'
    return {'.svg': 'image/svg+xml', '.ttf': 'font/ttf'}[path.suffix]


def data_uri(path):
    return f'data:{mime_type(path)};base64,' + base64.b64encode(path.read_bytes()).decode('ascii')


def inline_script(code):
    if re.search(r'</script', code, re.I):
        raise ValueError('Скрипт содержит </script> и не может быть встроен')
    return f'<script>\n{code}\n</script>'


def build_html():
    html = read('index.html')
    css = read('style.css').replace('url("assets/manrope.ttf")', f'url("{data_uri(ASSETS / "manrope.ttf")}")')
    if 'assets/' in css:
        raise ValueError('В style.css осталась ссылка на assets/')

    images = {name: data_uri(ASSETS / f'{name}.png') for name in ('retail', 'fraudlens')}
    script = read('script.js')
    lookup = '({' + ','.join(f'{name}:"{uri}"' for name, uri in images.items()) + '})[project.image]'
    script = script.replace('`assets/${project.image}.png`', lookup)

    stylesheet = re.compile(r'<link rel="stylesheet" href="style\.css[^"]*">')
    script_tag = re.compile(r'<script src="([^"?]+)(?:\?[^"]*)?" defer></script>')
    sources = script_tag.findall(html)
    if not stylesheet.search(html) or not sources:
        raise ValueError('Не найдены подключения CSS и JavaScript в index.html')
    html = stylesheet.sub(lambda _: f'<style>\n{css}\n</style>', html)
    html = script_tag.sub('', html)
    html = html.replace('href="assets/favicon.svg"', f'href="{data_uri(ASSETS / "favicon.svg")}"')
    for name, uri in images.items():
        html = html.replace(f'src="assets/{name}.png"', f'src="{uri}"')
    if 'assets/' in html:
        raise ValueError('В index.html осталась ссылка на assets/')

    # Встроенные скрипты не поддерживают defer, поэтому они стоят в конце body.
    scripts = '\n'.join(inline_script(script if source == 'script.js' else read(source)) for source in sources)
    return html.replace('</body>', scripts + '</body>', 1)


def main():
    STANDALONE.write_text(build_html(), encoding='utf-8')
    shutil.copyfile(STANDALONE, MOBILE_COPY)
    with zipfile.ZipFile(ARCHIVE, 'w', zipfile.ZIP_DEFLATED) as archive:
        for name in ARCHIVE_FILES + [STANDALONE.name]:
            archive.write(ROOT / name, name)
        for path in sorted(ASSETS.iterdir()):
            if path.is_file() and not path.name.startswith('.'):
                archive.write(path, f'assets/{path.name}')
    print(f'{STANDALONE.name}: {STANDALONE.stat().st_size // 1024} КБ, {ARCHIVE.name}: {ARCHIVE.stat().st_size // 1024} КБ')


if __name__ == '__main__':
    main()
