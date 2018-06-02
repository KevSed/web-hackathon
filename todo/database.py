from peewee import (
    SqliteDatabase,
    Model,
    TextField, BooleanField, DateTimeField, ForeignKeyField,
    FixedCharField, CharField
)
from datetime import datetime


database = SqliteDatabase('data.sqlite')

# Meta Klasse legt fest, wo die Datenbank reingeschrieben werden soll
class MyModel(Model):
    class Meta:
        database = database

class User(MyModel):
    username = CharField(unique=True)
    # password = FixedCharField(max_length=255)

class Post(MyModel):
    title = TextField()
    content = TextField()
    topic = TextField('Python')
    user = ForeignKeyField(User, related_name='post')
    solved = BooleanField(default=False)
    show = BooleanField(default=False)
    date = DateTimeField(default=datetime.utcnow)

class Comment(MyModel):
    content = TextField()
    date = DateTimeField(default=datetime.utcnow)
    post = ForeignKeyField(Post, related_name='comments')
    user = ForeignKeyField(User, related_name='comments')






    #def get_id(self):
    #    return str(self.id)
