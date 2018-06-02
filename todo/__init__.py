from flask import Flask, render_template, redirect, request, jsonify
from .database import database, Post, Comment, User
# from flask_socketio import SocketIO

app = Flask(__name__)

# socket = SocketIO(app)

@app.before_first_request
def init():
    database.create_tables([User, Post, Comment], safe=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/posts')
def get_todos():
    posts = list(
        Post.select(
            Post.title,
            User.username,
            Post.content,
            Post.date,
            Post.topic,
        )
        .join(User)
        .dicts()
    )
    return jsonify(status='success', posts=posts)

@app.route('/posts', methods=['POST'])
def add_post():
    user, created = User.get_or_create(username=request.form['user'])
    title = request.form['title']
    content = request.form['content']
    topic = request.form['topic']
    Post.create(user=user, title=title, content=content, topic=topic)
    return jsonify(status='success')

@app.route('/posts/<int:id>', methods=['PUT'])
def toggle_comments(id):
    post = Post.get(id=id)
    post.show = not todo.show
    post.save()
    return jsonify(status='success')

@app.route('/posts/<int:id>', methods=['POST'])
def add_comment():
    user, created = User.get_or_create(username=request.form['user'])
    content = request.form['content']
    post = 3
    Comment.create(user=user, content=content, post=post)
    return jsonify(status='success')

# socket.on('update', app.getToDos)
