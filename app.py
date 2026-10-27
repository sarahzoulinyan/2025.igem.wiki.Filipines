from os import path
from pathlib import Path

from flask import Flask, abort, render_template
from flask_frozen import Freezer


template_folder = path.abspath('./wiki')

app = Flask(__name__, template_folder=template_folder)
#app.config['FREEZER_BASE_URL'] = environ.get('CI_PAGES_URL')
app.config['FREEZER_DESTINATION'] = 'public'
app.config['FREEZER_RELATIVE_URLS'] = True
app.config['FREEZER_IGNORE_MIMETYPE_WARNINGS'] = True
freezer = Freezer(app)

@app.cli.command()
def freeze():
    freezer.freeze()

@app.cli.command()
def serve():
    freezer.run()

@app.route('/')
def home():
    return render_template('pages/home.html')

@app.route('/<page>')
def pages(page):
    page_path = Path('pages') / f'{page.lower()}.html'
    if not (Path(template_folder) / page_path).is_file():
        abort(404)
    return render_template(str(page_path))

# Main Function, Runs at http://0.0.0.0:8080
if __name__ == "__main__":
    app.run(port=8080)
