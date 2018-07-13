<template>
  <div id="app">
    <div class="app-phone">
      <div class="phone-header">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/vue_gram_logo_cp.png" />
        <a class="cancel-cta"
           v-if="step === 2 || step === 3" 
           @click="goToHome">
            Cancel
        </a>
        <a class="next-cta"
           v-if="step === 2"
          @click="step++">
            Next
        </a>
        <a class="next-cta"
           v-if="step === 3"
          @click="sharePost">
            Share
        </a>
      </div>
      <phone-body
        :step="step"
        :posts="posts"
        :filters="filters"
        :image="image"
        :selectedFilter="selectedFilter"
        v-model="caption"
      />
      <div class="phone-footer">
       <div class="home-cta" @click="goToHome">
        <i class="fas fa-home fa-lg"></i>
       </div>
       <div class="upload-cta">
          <input type="file"
            name="file"
            id="file"
            class="inputfile"
            @change="uploadImage"
            :disabled="step !== 1"
          />
          <label for="file">
            <i class="far fa-plus-square fa-lg"></i>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PhoneBody from "./components/PhoneBody";

import posts from "./data/posts";
import filters from "./data/filters";

import EventBus from "./event-bus.js";

export default {
  name: "App",
  data() {
    return {
      step: 1,
      posts,
      filters,
      image: "",
      selectedFilter: "",
      caption: ""
    };
  },
  created() {
    EventBus.$on("filter-selected", evt => {
      this.selectedFilter = evt.filter;
    });
  },
  methods: {
    uploadImage(evt) {
      const files = evt.target.files;
      if (!files.length) return;

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = evt => {
        this.image = evt.target.result;
        this.step = 2;
      };

      // To enable reuploading of same files in Chrome
      document.querySelector("#file").value = "";
    },
    sharePost() {
      const post = {
        username: "fullstack_vue",
        userImage:
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/vue_lg_bg.png",
        postImage: this.image,
        likes: 0,
        caption: this.caption,
        filter: this.filterType
      };
      this.posts.unshift(post);
      this.goToHome();
    },
    goToHome() {
      this.image = "";
      this.selectedFilter = "";
      this.caption = "";
      this.step = 1;
    }
  },
  components: {
    "phone-body": PhoneBody
  }
};
</script>

<style lang="scss" src="./styles/app.scss">
// Styles from stylesheet
</style>
