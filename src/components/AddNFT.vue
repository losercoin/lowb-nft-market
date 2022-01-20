<template>
  <div class="container css-main">
    <h1>{{ $t("lang.createNewItem") }}</h1>
    <form>
      <p class="gwsEKa"><span class="asterisk">*</span>{{ $t("lang.requiredFields") }}</p>
    </form>
    <div>
      <div class="d-flex flex-column">
        <label>{{ $t("lang.image") }}<span class="asterisk">*</span></label>
        <span>{{ $t("lang.supportedImage") }}</span>
      </div>
      <div class="border-file" @mouseover="imageHover = true" @mouseleave="imageHover = false">
        <div class="border-content">
          <div class="media-content">
            <img class="media-data" v-bind:src="media" />
          </div>
        </div>
        <input id="media" name="media" accept="image/*, video/*" type="file" style="display:none;" @change="loadMedia"/>
        <div class="border-content" v-if="imageHover">
          <label for="media" class="hover-input">
            <b-icon icon="image" font-scale="5"></b-icon>
          </label>
        </div>
        <b-icon class="close-media" icon="x" font-scale="2" @click="closeMedia" v-if="media">aaaa</b-icon>
      </div>
    </div>
  </div>
</template>

<script>

export default {
    data() {
      return {
        imageHover: false,
        media: null,
      }
    },
    methods: {
      loadMedia: function(event) {
        this.media = window.URL.createObjectURL(event.target.files[0]);
        event.target.value = null;
      },
      closeMedia: function() {
        this.media=null;
      }
    }

}
</script>

<style lang="scss" scoped>
.asterisk {
  color: rgb(235, 87, 87);
  margin: 5px;
}
.gwsEKa {
  font-weight: 500;
  font-size: 12px;
  color: rgb(112, 122, 131);
}
.border-file {
  width: 350px;
  height: 257px;
  position: relative;
  margin-top: 8px;
  cursor: pointer;
  border: 3px dashed rgb(204, 204, 204);
  border-radius: 10px;
}
.border-content {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  padding: 5px;
} 
.hover-input {
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.15);
}
.media-content {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.media-data {
  width: 100%;
}
.close-media {
  right: 10px;
  top: 10px;
  position: absolute;
}
label {
  font-size: 16px;
  font-weight: 600;
}
span {
  font-size: 12px;
  font-weight: 500;
  color: rgb(112, 122, 131);
}
</style>