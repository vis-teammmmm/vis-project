<template>
    <el-container class="layout-container-demo">
        <side-bar ></side-bar>
        <head-bar></head-bar>
    </el-container>
</template>

<script>

import HeadBar from './components/HeadBar.vue'
// 导入头栏
import SideBar from './components/SideBar.vue'
// 导入侧栏
export default {
  name: 'App',
//  自身id
  components: {
    HeadBar,
    SideBar,
    //使用组件
  },
  data() {
    return {
    }
  },
  methods: {

  },
}
</script>
<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: gray;
        margin-top: 60px;
    }
    @import url("//unpkg.com/element-ui@2.15.6/lib/theme-chalk/index.css");
    /* 引入黑夜模式样式外部声明 */
</style>
