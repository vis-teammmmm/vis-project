<template>
    <el-container class="layout-container-demo" style="height: 900px;">
        <side-bar
            @updateChart="chartUpdated"
            @updateAll="allUpdated"
            @updateSelectedFileUid="selectedFileUidUpdated"
            :darkMode="darkMode"
            :showSideBar="showSideBar"
        />
        <head-bar-and-main-contents
            :optionList="optionList"
            :updatesignal="updatesignal"
            :updateallsignal="updateallsignal"
            @themeChanged="handleThemeChange"
            @updateSideBar="sideBarUpdated"
            :selectedChartIndex="selectedChartIndex"
            :groupName="groupName"
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
            // {
            //     group:'',
            //     title:{
            //         text:'',
            //         left:'center',
            //     },
            //     tooltip:{
            //         trigger:'item'
            //     },
            //     legend:{
            //         left:'right',
            //         orient:'vertical',
            //     },
            //     dataset:{
            //         source:[
            //             [],
            //         ]
            //     },
            //     xAxis:{
            //         type:''
            //     },
            //     yAxis:{
            //     },
            //     series:
            //     {
            //         type:'pie',
            //         encode:{
            //             itemName:'',
            //             value:'',
            //             x:'',
            //             y:'',
            //         }
            //     },
            // }
        ],
        // optionList:[{}],
        // 存放图表数据的数组，由SideBar传入
        updatesignal:true,
        updateallsignal:true,
        darkMode:false,
        selectedChartIndex:-1,
        groupName:'',
        showSideBar:'true'
    }
  },
  methods: {
    sideBarUpdated(flag){
        this.showSideBar = flag
    },
    chartUpdated(chartOptionList,selectedChartIndex){
        this.optionList[selectedChartIndex]=chartOptionList[selectedChartIndex]
        // 更新选定图表的数据
        this.updatesignal=!this.updatesignal
        // 给HeadBarAndMainContents发送选定图表需要更新的信号
        this.selectedChartIndex = selectedChartIndex
        // 更新当前选中的图表Index
    },
    // 更新一张图表
    allUpdated(chartOptionList,selectedChartIndex){
        this.optionList = chartOptionList
        // 更新全部图表的数据
        this.updateallsignal=!this.updateallsignal
        // 给HeadBarAndMainContents发送所有图表需要更新的信号
        this.selectedChartIndex = selectedChartIndex
        // 更新当前选中的图表Index
    },
    handleThemeChange(theme){
        this.darkMode = theme
        // 接受来自HeadBarAndMainContents的黑夜/白天模式
    },
    selectedFileUidUpdated(selectedFileUid){
        this.groupName=selectedFileUid.toString()
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
