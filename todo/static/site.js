"use strict";

function errorMessage(msg) {
  console.log(msg);
  var div = $('<div>', {
    "class": 'alert alert-danger alert-dismissable'
  });
  div.html('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
  div.append($('<strong>').text(msg));
  return $('#orders-panel').before(div);
}

// var socket = io();

Vue.component('comment-form', {
  delimiters: ['((', '))'],
  template: `
    <input v-model="" class='form-control' type="text" />
    <button class="btn btn-primary" v-on:click="addComment()">Add comment</button>
    `
})

Vue.component('post', {
  delimiters: ['((', '))'],
  props: ['post'],
  data: function() {
    return {showComments: false}
  },
  template: `
  <li class='list-group-item'>
    <div class="row">
      <div class="col">
        (( post.title ))
      </div>
      <div class='col'>
        (( post.username ))
      </div>
      <div class='col'>
        (( post.date ))
      </div>
      <div class='col'>
        (( post.topic ))
      </div>
      <div class="col">
        <button v-on:click="showComments = !showComments" class="btn btn-primary">More</button>
      </div>
      <ul v-if="showComments" class='list-group'>
        <li v-for="comment in post.comments" class='list-group-item'>
          <div class="row">
            <div class='col'>
              (( comment.user ))
            </div>
            <div class='col'>
              (( comment.content ))
            </div>
          </div>
        </li>
        <comment-form></comment-form>
      </ul>
      <div class="col">
        <button v-on:click="" class="btn btn-success">Show</button>
      </div>
    </div class="row">
  </li>
    `
})

var app = new Vue({
  el: "#app",
  delimiters: ['((', '))'],
  data: {
    posts: [],
    newuser: '',
    newtitle: '',
    newcontent: '',
    newtopic: '',
    newpost: '',
  },
  methods: {


    getPost: function() {
      $.getJSON('/posts', {}, this.updatePosts)
    },
    updatePosts: function(data) {
      this.posts = data.posts;
      console.log("Got new posts");
    },

    toggleComments: function(post_id) {
      console.log("Show comments ");
    $.ajax("/posts/" + post_id, {
        method: "PUT",
        success: () => {
            console.log("Toggled Comment " + post_id);
            this.getPost();
            },
        })
    },

    addPost: function() {
      console.log('trying to add ' + this.newcontent);
      $.ajax("/posts", {
        method: "POST",
        data: {
          user: this.newuser,
          title: this.newtitle,
          topic: this.newtopic,
          content: this.newcontent
        },
        success: () => {
          console.log("Added post ");
          this.newuser = '';
          this.newtitle = '';
          this.newcontent = '';
          this.newtopic = '';
          this.getPost();
        },
        error: (response) => {
            console.log("Error");
        }
      })
    },

    addComment: function(p) {
      console.log('trying to comment ' + this.newcontent);
      $.ajax("/posts", {
        method: "POST",
        data: {
          user: this.newuser,
          content: this.newcontent,
          post: this.newpost
        },
        success: () => {
          console.log("Added comment");
          this.newuser = '';
          this.newcontent = '';
          this.newpost = '';
          this.getPost();
        },
        error: (response) => {
            console.log("Error");
        }
      })
    },

  }
})
app.getPost();
