import os
from flask import Flask, flash, request, redirect, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename
import logging
logging.basicConfig(filename='image_server.log', encoding='utf-8', level=logging.DEBUG)
logging.getLogger('flask_cors').level = logging.DEBUG

UPLOAD_FOLDER = '/Users/eclagget/Desktop'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp'}

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = os.urandom(24)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        print('Got a request', flush=True)
        # check if the post request has the file part
        # print(request.data)
        if 'file' not in request.files:
            flash('No file part')
            return '''No file part'''
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return '''No filename'''
        if file and allowed_file(file.filename):
            # print('Got a request', flush=True)
            filename = secure_filename(file.filename)
            print(filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return '''Success!'''
        elif file:
            return '''file time not allowed for ''' + file.filename
        else:
            return '''no file?'''

        return '''Success!'''
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

if __name__ == '__main__':
    app.run(port=9019)