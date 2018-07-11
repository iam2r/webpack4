<template>
  <div id="app">
    <transition :name="'slide-left'">
      <!-- <keep-alive :include="['branddetail','search','reviewdetail']"> -->
      <router-view class="router"></router-view>

    </transition>
    <div class="game" :class="isLandscape?'landscape':''">
      {{innerWidth+'/'+innerHeight}} {{width}}
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      // transitionName: "slide-left",
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  created() {},
  mounted() {
    var that = this;
    window.onresize = function() {
      that.width = window.innerWidth;
      that.height = window.innerHeight;
    };
  },
  computed: {
    isLandscape() {
      return this.width / this.height >= 1065 / 500;
    },
    innerWidth() {
      return window.innerWidth;
    },
    innerHeight() {
      return window.innerHeight;
    }
  },
  methods: {},
  updated() {}
};
</script>
<style scope lang="scss">
.test {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  span {
    height: 1rem;
    width: 2rem;
    background: red;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.game {
  position: absolute;
  background: red;
  top: 50%;
  left: 50%;
  height: calc(100vw * 600 / 1065);
  width: 100vw;
  transform: translate(-50%, -50%);
  &.landscape {
    height: 100vh;
    width: calc(100vh * 1065 / 600);
  }
}
</style>


