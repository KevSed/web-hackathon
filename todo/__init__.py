from flask import Flask, render_template, redirect, request, jsonify
from .database import database, Post, Comment, User
from playhouse.shortcuts import model_to_dict

app = Flask(__name__)


@app.before_first_request
def init():
    database.create_tables([User, Post, Comment], safe=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/posts')
def get_posts():
    posts = [model_to_dict(p, backrefs=True) for p in Post.select()]
    return jsonify(status='success', posts=posts)

# @app.route('/comments')
# def get_comments():
#     comments = list(
#         Comment.select(
#             User.username,
#             Comment.content,
#             Comment.date,
#             Post.id
#         )
#         .join(User, Post)
#         .dicts()
#     )
#     return jsonify(status='success', comments=comments)

@app.route('/posts', methods=['POST'])
def add_post():
    user, created = User.get_or_create(username=request.form['user'])
    title = request.form['title']
    content = request.form['content']
    topic = request.form['topic']
    Post.create(user=user, title=title, content=content, topic=topic)
    return jsonify(status='success')

@app.route('/comments', methods=['POST'])
def add_comment():
    user, created = User.get_or_create(username=request.form['user'])
    Comment.create(user=user, content=request.form['content'], post=request.form['post'])
    return jsonify(status='success')

@app.route('/posts/<int:id>', methods=['PUT'])
def toggle_solved(id):
    post = Post.get(id=id)
    post.solved = not post.solved
    post.save()
    return jsonify(status='success')

# 9.30
