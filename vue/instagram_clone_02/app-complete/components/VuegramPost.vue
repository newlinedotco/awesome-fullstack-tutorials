<template>
  <div class="vuegram-post">
    <div class="header level">
      <div class="level-left">
        <figure class="image is-32x32">
          <img :src="post.userImage" />
        </figure>
        <span class="username">{{post.username}}</span>
      </div>
    </div>
    <div class="image-container"
      :class="post.filter"
      :style="{ backgroundImage: 'url(' + post.postImage + ')' }"
      @dblclick="like">
    </div>
    <div class="content">
      <div class="heart">
        <i class="far fa-heart fa-lg"
          :class="{'fas': this.post.hasBeenLiked}"
          @click="like">
        </i>
      </div>
      <p class="likes">{{post.likes}} likes</p>
      <p class="caption"><span>{{post.username}}</span> {{post.caption}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "VuegramPost",
  props: {
    post: Object
  },
  methods: {
    like() {
      this.post.hasBeenLiked ? this.post.likes-- : this.post.likes++;
      this.post.hasBeenLiked = !this.post.hasBeenLiked;
    }
  }
};
</script>

<style lang="scss" src="../styles/vuegram-post.scss">
// Styles from stylesheet
</style>
