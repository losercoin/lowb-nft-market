<template>
  <div id="app" class="container-fluid">
    <app-header class="header" :style="{'position': ps,'transform':tran}"/>
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
  data(){
    return {
      ps:'fixed',
      tran:'translate(-50%,0)'
    }
  },
  watch:{
    $route(){
      // console.log(this.$route.path);
      if(this.$route.path=='/'){
        this.ps='fixed'
        this.tran='translate(-50%,0)'
      }else{
        this.ps='static'
        this.tran=''
      }
    }
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

<style lang="scss">
  #app{
    margin: 0;
    padding: 0;
    .header{
      margin: 0 auto;;
      width: 70%;
      max-width: 1200px;
      top: 0;
      left: 50%;
      z-index: 10;
      background-color: rgba(11, 20, 38,0.8);
      border-radius: 0 0 20px 20px;
    }
  }
</style>