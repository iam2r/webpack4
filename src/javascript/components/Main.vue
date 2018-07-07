<template>
  <div class="main">
  
    <div class="container">
  
      我是主体内容
  
  
  
    </div>
  
  </div>
</template>

<script>
export default {
  name: "mainBox",

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
@import "../../css/common/utils.scss";

.main {
  .container {
    border: topx(1) solid $mC;
    padding: 20px;
    font-size: topx(12);
  }
}
</style>


