<template>
    <div id="app">
        <transition :name="'slide-left'">
            <!-- <keep-alive :include="['branddetail','search','reviewdetail']"> -->
            <router-view class="router"></router-view>
     
        </transition>
    </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      // transitionName: "slide-left"
    };
  },
  created() {},
  mounted() {},
  computed: {},
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
</style>


