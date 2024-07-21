<template>
    <el-container class="layout-container-demo">
        <side-bar
            @updateChart="chartUpdated"
            :darkMode="darkMode"
        />
        <head-bar-and-main-contents
            :optionList="optionList"
            :updatesignal="updatesignal"
            @themeChanged="handleThemeChange"
        ></head-bar-and-main-contents>
        <!-- <main-contents></main-contents> -->
    </el-container>
</template>

<script>

//import { isDark } from './components/composables';
import HeadBarAndMainContents from './components/HeadBarAndMainContents.vue'
// 导入头栏
import SideBar from './components/SideBar.vue'
// 导入侧栏

export default {
  name: 'App',
//  自身id
  components: {
    HeadBarAndMainContents,
    SideBar,
    //MainContents,
    //使用组件
  },
  data() {
    return {
        optionList:[
            {
                title:{
                    text:'',
                    left:'center',
                },
                tooltip:{
                    trigger:'item'
                },
                legend:{
                    left:'right',
                    orient:'vertical',
                },
                dataset:{
                    source:[
                        [],
                    ]
                },
                series:
                {
                    type:'pie',
                    encode:{
                        itemName:'',
                        value:'',
                        x:'',
                        y:'',
                    }
                },
            }
        ],
        updatesignal:true,
        darkMode:false,
    }
  },
  methods: {
    chartUpdated(chartOptionList){
        this.optionList=chartOptionList
        this.updatesignal=!this.updatesignal
    },
    handleThemeChange(theme){
        this.darkMode = theme
    }
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
