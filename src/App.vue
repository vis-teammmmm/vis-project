<template>
    <el-container class="layout-container-demo" style="height: 92vh;width: 99vw;">
        <side-bar
            @updateChart="chartUpdated"
            @updateAll="allUpdated"
            :darkMode="darkMode"
            :showSideBar="showSideBar"
            style="width: 15vw;height: 92vh;"
        />
        <head-bar-and-main-contents
            :optionList="optionList"
            :updatesignal="updatesignal"
            :updateallsignal="updateallsignal"
            @themeChanged="handleThemeChange"
            @updateSideBar="sideBarUpdated"
            :selectedChartIndex="selectedChartIndex"
            :groupName="groupName"
            style="width: 84vw;height: 92vh;"
        ></head-bar-and-main-contents>
    </el-container>
</template>

<script>
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
    //使用组件
  },
  data() {
    return {
        optionList:[],
        // 存放图表数据的数组，由SideBar传入
        updatesignal:true,
        // 单表更新信号
        updateallsignal:true,
        // 全部更新信号
        darkMode:false,
        selectedChartIndex:-1,
        // 选中的图表序号
        groupName:'',
        showSideBar:true,
    }
  },
  methods: {
    sideBarUpdated(flag){
        this.showSideBar = flag
    },
    chartUpdated(chartOptionList,selectedChartIndex){
        this.optionList[selectedChartIndex]=chartOptionList[selectedChartIndex]
        // 更新选定图表的数据
        this.selectedChartIndex = selectedChartIndex
        // 更新当前选中的图表Index
        this.updatesignal=!this.updatesignal
        // 给HeadBarAndMainContents发送选定图表需要更新的信号
    },
    // 更新一张图表
    allUpdated(chartOptionList,selectedChartIndex){
        this.optionList = chartOptionList
        // 更新全部图表的数据
        //更新删除信息
        this.selectedChartIndex = selectedChartIndex
        // 更新当前选中的图表Index
        this.updateallsignal=!this.updateallsignal
        // 给HeadBarAndMainContents发送所有图表需要更新的信号
    },
    handleThemeChange(theme){
        this.darkMode = theme
        // 接受来自HeadBarAndMainContents的黑夜/白天模式
    },
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
