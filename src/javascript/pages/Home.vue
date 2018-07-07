<template>
    <div class="home">
         <Header></Header>
         <Main></Main>
         <Footer></Footer>
    </div>
</template>

<script>
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
export default {
  name: "home",
  data() {
    return {
      // transitionName: "slide-left"
    };
  },
  components: {
    Header,
    Main,
    Footer
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  updated() {}
};
</script>
<style scope lang="scss">
</style>


