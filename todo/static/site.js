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


Vue.component('comment-form', {
  delimiters: ['((', '))'],
  props: ['post_id'],
  data: function() {
    return {
      newcontent: '',
      newuser: '',
      pid: this.post_id
    };
  },
  template: `
    <form v-on:submit.prevent="addComment" class="form-inline">
      <div class='row'>
        <div class='col'>
          <input v-model="newuser" class='form-control' type="text" placeholder="Username" style="width: 15rem;"/>
        </div>
        <div class='col'>
          <input v-model="newcontent" class='form-control' type="text" placeholder="content" style="width: 45rem;"/>
        </div>
        <div class='col'>
          <input type='submit' class="btn btn-danger" value='Comment' />
        </div>
      </div>
    </form>
    `,
  // <button class="btn btn-primary" v-on:click="addComment">Add comment</button>
  methods: {
    addComment: function() {
      console.log('trying to comment ' + this.newcontent);
      console.log('trying to comment ' + this.pid);
      $.ajax("/comments", {
        method: "POST",
        data: {
          user: this.newuser,
          content: this.newcontent,
          post: this.pid
        },
        success: () => {
          console.log("Added comment");
          this.newuser = '';
          this.newcontent = '';
          this.pid = '';
        },
        error: (response) => {
          console.log("ERROR ");
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
  <li class='list-group-item' style="background: #2e3847;">
    <header class='container'>
      <div class="row">

        <div class="card" style="width: 80rem;">
          <div class="card-header">
            <div class='row'>
              <div class='col'>
                (( post.title ))
              </div>
              <div class='col'>
                (( post.user.username ))
              </div>
              <div class='col'>
                (( post.date ))
              </div>

              <div class='col'>
                <span class="badge badge-primary badge-pill">(( post.comments.length ))</span>
              </div>

              <div class="col">
                <button v-on:click="showComments = !showComments" class="btn btn-primary btn-lg">View</button>
              </div>

              <div class="col">
                <button v-if="post.solved" v-on:click="toggleSolved(post.id)" class="btn btn-success">Solved</button>
                <button v-else v-on:click="toggleSolved(post.id)" class="btn btn-primary">Not Solved</button>
              </div>
            </div>
          </div>
          <ul v-if="showComments" class='list-group'>
            <div class="card-body">
              <h5 class="card-title"> (( post.topic )): (( post.title ))</h5>
              <p class="card-text">(( post.content ))</p>
            </div>
            <li v-for="comment in post.comments" class='list-group-item'>
              <div class="card">
                <div class="card-header">
                  (( comment.user.username )) wrote on (( comment.date )):
                </div>
                <div class="card-body">
                  <p class="card-text">(( comment.content ))</p>
                </div>
              </div>
            </li>
            <comment-form v-bind:post_id="post.id"></comment-form>
            </ul>
        </div>
      </div>
    </header>
  </li>
    `,
  methods: {

    toggleSolved: function(post_id) {
      $.ajax("/posts/" + post_id, {
        method: "PUT",
        success: () => {
          console.log("Solved post " + post_id);
          app.getPost();
        },
      })
    },
  }
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
      $.getJSON('/posts', {}, this.updatePosts).always(function(data) {
        console.log(data);
      })
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
