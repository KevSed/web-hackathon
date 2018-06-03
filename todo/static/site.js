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
  props: ['post'],
  data: function() {
    return {
      newcontent: '',
      newuser: '',
    };
  },
  template: `
    <form v-on:submit.prevent="addComment" class="form-inline">
      <div class='row'>
        <div class='col'>
          <input v-model="newuser" class='form-control' type="text" placeholder="Username" />
        </div>
        <div class='col'>
          <input v-model="newcontent" class='form-control' type="text" placeholder="content" />
        </div>
        <div class='col'>
          <input type='submit' class="btn btn-primary" value='Comment' />
        </div>
      </div>
    </form>
    `,
    // <button class="btn btn-primary" v-on:click="addComment">Add comment</button>
  methods: {
    addComment: function() {
      console.log('trying to comment ' + this.newcontent);
      console.log('trying to comment ' + this.$props.id);
      $.ajax("/comments", {
        method: "POST",
        data: {
          user: this.newuser,
          content: this.newcontent,
          post: this.$props.id
        },
        success: () => {
          console.log("Added comment");
          this.newuser = '';
          this.newcontent = '';
        },
        error: (response) => {
          console.log(response);
        }
      })
    },
  }
})

Vue.component('post', {
  delimiters: ['((', '))'],
  props: ['post'],
  data: function() {
    return {
      showComments: false
    }
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
        <button v-on:click="showComments = !showComments" class="btn btn-primary">View</button>
      </div>
      <ul v-if="showComments" class='list-group'>

      <div class="card">
        <div class="card-header">
          (( post.username )) wrote on (( post.date )):
        </div>
        <div class="card-body">
          <h5 class="card-title"> (( post.topic )): (( post.title ))</h5>
          <p class="card-text">(( post.content ))</p>
        </div>
      </div>
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
        <comment-form v-bind="post"></comment-form>
      </ul>
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
  },
  methods: {


    getPost: function() {
      $.getJSON('/posts', {}, this.updatePosts)
    },
    updatePosts: function(data) {
      this.posts = data.posts;
      console.log("Got new posts");
    },

    // toggleComments: function(post_id) {
    //   console.log("Show comments ");
    //   $.ajax("/comments" + post_id, {
    //     method: "PUT",
    //     success: () => {
    //       console.log("Toggled Comment " + post_id);
    //       this.getPost();
    //     },
    //   })
    // },

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
          console.log("Error while making Post");
        }
      })
    },


  }
})
app.getPost();
