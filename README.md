# web-hackathon-tutorial

Build a stackoverflow for poor people application using flask / bootstrap / vue
Build a To-Do-List application using flask / bootstrap / vue

To access website clone the repository:
```
$ git clone git@github.com:KevSed/web-hackathon.git
```
then inside the repository setup your pipenv:
```
$ cd web-hackathon
$ pipenv install eventlet gunicorn peewee
$ pipenv shell
```
Then with running
```
$ FLASK_DEBUG=true FLASK_APP=todo flask run --host 0.0.0.0
```
you will start the server in debug mode, so e.g. that changes in your scripts will be refreshed.
For production server deployment use
```
gunicorn --reload -k eventlet -b 0.0.0.0:5000 todo:app
```

Access via
```
http://localhost:5000
```
