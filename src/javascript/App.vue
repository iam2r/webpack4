<template>
    <div id="app">
        <transition :name="'slide-left'">
            <!-- <keep-alive :include="['branddetail','search','reviewdetail']"> -->
            <!-- <router-view class="router"></router-view> -->
            <div>哈哈哈啊哈哈哈哈</div>
            <!-- </keep-alive> -->
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
    created() {
  
    },
    mounted() {},
    computed: {
       
    },
    methods: {

    },
    updated() {
       
    }
};
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
    transition: all 0.3s ease;
}
.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

.router {
    position: absolute;
    width: 100%;
    transition: all 0.5s ease;
}
.slide-left-enter,
.slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100% 0);
}

.router {
    position: absolute;
    width: 100%;
    transition: all 0.5s ease;
}
.slide-right-enter,
.slide-left-leave-active {
    opacity: 0;
    transform: translate(-100%, 0);
}

.slide-right-leave-active,
.slide-left-enter {
    opacity: 0;
    transform: translate(100% 0);
}
</style>


