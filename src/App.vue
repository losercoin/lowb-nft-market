<template>
  <div id="app" class="container">
    <app-header />
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
    <b-modal v-model="$store.state.modalShow" ref="my-modal" hide-footer hide-header centered>
      <div class="d-grid gap-2">
        <button class="btn btn-outline-success" type="button" @click="choose('en')">English</button>
        <button class="btn btn-outline-success" type="button" @click="choose('zh')">中文</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'

export default {
  components: {
    AppHeader
  },
  methods: {
    choose(language) {
      localStorage.setItem("locale", language)
      this.$store.commit("setModal", false)
      this.$root.$i18n.locale = language
    },
  }
}
</script>