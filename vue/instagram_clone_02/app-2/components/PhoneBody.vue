<template>
  <div class="phone-body">
    <div v-if="step === 1" class="feed">
      <instagram-post v-for="post in posts"
                      :post="post"
                      :key="posts.indexOf(post)">
      </instagram-post>
    </div>
    <div v-if="step === 2">
      <div class="selected-image"
          :class="selectedFilter"
          :style="{ backgroundImage: 'url(' + image + ')' }"></div>
      <div class="filter-container">
        <filter-type v-for="filter in filters"
                    :filter="filter"
                    :image="image"
                    :key="filters.indexOf(filter)">
        </filter-type>
      </div>
    </div>
  </div>
</template>

<script>
import InstagramPost from "./InstagramPost";
import FilterType from "./FilterType";

export default {
  name: "PhoneBody",
  props: {
    step: Number,
    posts: Array,
    filters: Array,
    image: [String, File],
    selectedFilter: String
  },
  components: {
    "instagram-post": InstagramPost,
    "filter-type": FilterType
  }
};
</script>

<style lang="scss" src="../styles/phone-body.scss">
// Styles from stylesheet
</style>
