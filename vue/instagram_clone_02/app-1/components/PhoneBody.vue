<template>
  <div class="phone-body">
    <div class="feed">
      <instagram-post v-for="post in posts"
                      :post="post"
                      :key="posts.indexOf(post)">
      </instagram-post>
    </div>
  </div>
</template>

<script>
import InstagramPost from "./InstagramPost";

export default {
  name: "PhoneBody",
  props: {
    posts: Array,
    filters: Array
  },
  components: {
    "instagram-post": InstagramPost
  }
};
</script>

<style lang="scss" src="../styles/phone-body.scss">
// Styles from stylesheet
</style>
