<template>
    <footer>
     <div class="container">
         我是尾部
     </div>
    </footer>
</template>

<script>
export default {
  name: "footerBox",
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
footer {
  background: #0f0903;
  background: -moz-linear-gradient(top, #0f0903 0%, #c6c6c6 100%);
  background: -webkit-linear-gradient(top, #0f0903 0%, #c6c6c6 100%);
  background: linear-gradient(to bottom, #0f0903 0%, #c6c6c6 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0f0903', endColorstr='#c6c6c6',GradientType=0 );
}
</style>


