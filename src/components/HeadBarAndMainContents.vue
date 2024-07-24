<template>
    <el-container :class="showSideBar == true ? 'with-side-bar-whole' : 'without-side-bar-whole'" >
        <el-header style=" font-size: 2em ;display :flex ;justify-content: space-around; align-items:center; " :class="showSideBar == true ? 'with-side-bar-header' : 'without-side-bar-header'">
            <!-- 设置头栏字号，排列与对齐样式等 -->
            <h1>数据可视化分析系统</h1>

            <el-button color="#626aef" @click="changeTheme" class="border-none w-full bg-transparent cursor-pointer" style="background-color: #626aef; width: 8em; height: 3em">
                <!-- 为了不让按钮颜色在被按后保持改变，为它设置了background-color作为解决方案 -->
                <!-- 亮暗模式切换按钮 -->
                <el-icon style="color: aliceblue; font-size: large" v-if="!darkmode" class="el-icon--left">
                    <!-- 设置icon颜色也是为了让它保持颜色 -->
                    <Sunny/>
                </el-icon>
                <el-icon style="color: aliceblue;font-size: large" v-else class="el-icon--left">
                    <Moon/>
                </el-icon>
                <el-icon style="color: aliceblue;font-size: large">
                    <DArrowRight/>
                </el-icon>
                <el-icon style="color: aliceblue;font-size: large" v-if="!darkmode" class="el-icon--right">
                    <Moon/>
                </el-icon>
                <el-icon style="color: aliceblue;font-size: large" v-else class="el-icon--right">
                    <Sunny />
                </el-icon>
                <!-- 亮/暗模式下按钮的内容不同 -->
            </el-button>

            <el-button color="#626aef" @click="changeSideBar" class="border-none w-full bg-transparent cursor-pointer" style="background-color: #626aef; width: 8em; height: 3em">
                <!-- 边栏显示按钮 -->
                 <span style="color: aliceblue; font-weight: bold; font-size: medium;">
                    {{ showSideBar == true ? '隐藏' : '显示' }}侧栏
                 </span>
            </el-button>
        </el-header>
        <el-container :class="showSideBar == true ? 'with-side-bar-main' : 'without-side-bar-main'" style="height: 88vh;">
            <el-main :class="showSideBar == true ? 'with-side-bar-main' : 'without-side-bar-main'" >
                <div :class="showSideBar == true ? 'with-side-bar-main' : 'without-side-bar-main'" ref="elMain">
                    <div :class="'chart-container-'+ chartNum" style="width: 100%;height: 100%;" ref="chartContainer">
                        <div
                            v-show="chartNum>=1"
                            id="chart-0"
                            :class="'chart-item-'+chartNum"
                        ></div>
                        <div
                            v-show="chartNum>=2"
                            id="chart-1"
                            :class="'chart-item-'+chartNum"
                        ></div>
                        <div
                            v-show="chartNum>=3"
                            id="chart-2"
                            :class="'chart-item-'+chartNum"
                        ></div>
                        <div
                            v-show="chartNum>=4"
                            id="chart-3"
                            :class="'chart-item-'+chartNum"
                        ></div>
                        <div
                            v-show="chartNum>=5"
                            id="chart-4"
                            :class="'chart-item-'+chartNum"
                        ></div>
                        <div
                            v-show="chartNum>=6"
                            id="chart-5"
                            :class="'chart-item-'+chartNum"
                        ></div>
                    </div>
                </div>
                <!-- 由于图表数量上限较小，直接使用v-show策略安排图表显示布局，同时避免图表初始化找不到DOM -->
            </el-main>
        </el-container>
    </el-container>

</template>
<script>
     import * as echarts from 'echarts'
    import {toggleDark} from './composables/dark'
    import {Sunny} from '@element-plus/icons-vue'
    import {Moon} from '@element-plus/icons-vue'
    import { DArrowRight } from '@element-plus/icons-vue'
    export default{
        components:{
            Sunny,
            Moon,
            DArrowRight,
        },
        data() {
            return{
                darkmode:false,
                // 亮/暗模式，false为亮
                showSideBar:true,
                // 是否显示侧栏
            }
        },
        methods:{
            changeTheme(){
                toggleDark()
                // 改变亮暗
                this.darkmode = !this.darkmode
                this.updateAll(true)
                // 更新所有图表
                this.$emit('themeChanged',this.darkmode)
                // 传输亮暗模式已经发生改变的信息
            },
            changeSideBar(){
                this.showSideBar = !this.showSideBar
                this.$emit('updateSideBar',this.showSideBar)
                // 改变侧栏显示
            },
            updateChart(index) {
                if(index<0){
                    return
                    // 防止还没有选中图表的时候的错误更新
                }
                if (!Array.isArray(this.myChart)) {
                    this.myChart = [];
                    console.log('Transform myChart to Array')
                }
                // 确保this.myChart是数组，没有则创建它
                if (this.myChart[index]) {
                    this.myChart[index].dispose();
                }
                // 如果该索引的图表实例已存在，则销毁它
                var chartDom = document.getElementById('chart-'+index);
                // 根据index建立存放图表的文档对象
                if(!chartDom) {
                    console.log('DOM element with id '+ index +' not found!');
                    return;
                    // 检验文档对象是否成功获取
                    // 不要删掉这里,提前return可以避免出错时网页直接崩溃
                }
                var myChart;
                if (this.darkmode === false) {
                    myChart = echarts.init(chartDom);
                } else {
                    myChart = echarts.init(chartDom, 'dark',);
                }
                // 更新亮暗模式
                myChart.resize({
                    width: this.chartWidth,
                    height:this.chartHeight
                })
                // 利用computed属性计算图表合适的大小
                var option = this.optionList[index];
                this.myChart[index] = myChart;
                // 将新的图表实例存储在数组中
                if (option) {
                    if(option.series[0]){
                            myChart.group=option.group
                            if(option.series.length === 2 &&(option.series[0].type === 'bar' || option.series[0].type === 'line')){
                                option.series[0].yAxisIndex = 0
                                option.series[1].yAxisIndex = 1
                            }
                            else{
                                delete option.series[0].yAxisIndex
                                if(option.series[1]){
                                    delete option.series[1].yAxisIndex
                                }
                            }
                            // 配置双轴显示
                            myChart.setOption(option);
                            echarts.connect(option.group)
                            // connect实现多图联动
                    }
                }
                // 获取并设置对应的图表选项
            },
            updateAll(){
                let i = 0;
                while(i<this.chartNum){
                    this.updateChart(i)
                    // 遍历更新所有图表
                    i++
                }
                if(this.myChart){
                    while(this.myChart[i]){
                        this.myChart[i].dispose()
                        i++
                    }
                    // 销毁多余的图表
                }
            },
        },

        props:{
            optionList:{
                type:Array,
                default:function(){
                    return []
                }
            },
            // 接受图表参数的列表
            updatesignal:Boolean,
            // 提示更新单个图表
            updateallsignal:Boolean,
            // 提示更新所有图表
            selectedChartIndex:Number,
            // 提示当前选中的图表
        },
        computed:{
            chartNum(){
                return this.optionList.length
            },
            // 图表数，控制样式
            chartWidth(){
                if(this.showSideBar){
                    if(this.chartNum===1){
                        return document.documentElement.clientWidth / 100*84
                    }
                    else if(this.chartNum===2||this.chartNum===4){
                        return document.documentElement.clientWidth / 100*42
                    }
                    else{
                        return document.documentElement.clientWidth / 100*28
                    }
                }
                else{
                    if(this.chartNum===1){
                        return document.documentElement.clientWidth / 100*99
                    }
                    else if(this.chartNum===2||this.chartNum===4){
                        return document.documentElement.clientWidth / 100*49.5
                    }
                    else{
                        return document.documentElement.clientWidth / 100*33
                    }
                }
            },
            chartHeight(){
                if(this.chartNum<=3){
                    return document.documentElement.clientHeight / 100*85
                }
                else{
                    return document.documentElement.clientHeight / 100*42.5
                }
            }
            // 控制图表大小
        },
        watch:{
            updatesignal: function(){
                this.updateChart(this.selectedChartIndex)
                // 更新单个图表
            },
            updateallsignal: function(){
                this.updateAll()
                // 更新所有图表
            },
        },
    }
</script>
<style scoped>
    .chart-item-1{
        width: 100%;
        height:85vh
    }
    .chart-item-2{
        width:100%;
        height:85vh
    }
    .chart-item-3{
        width:100%;
        height:85vh
    }
    .chart-item-4{
        width:100%;
        height:42.5vh
    }
    .chart-item-5{
        width: 100%;
        height: 42.5vh
    }
    .chart-item-6{
        width: 100%;
        height: 42.5vh
    }
    .chart-container-1{
        display: grid;
        /* gap: 10px;
        padding: 10px; */
        grid-template-columns: repeat(1 ,1fr)
    }
    .chart-container-2{
        display: grid;
        /* gap: 10px;
        padding: 10px; */
        grid-template-columns: repeat(2, 1fr)
    }
    .chart-container-3{
        display: grid;
        /* gap: 10px;
        padding: 10px; */
        grid-template-columns: repeat(3, 1fr);
    }
    .chart-container-4{
        display: grid;
        /* gap: 10px;
        padding: 10px; */
        grid-template-columns: repeat(2, 1fr);
    }
    .chart-container-5{
        display: grid;
        /* gap: 10px;
        padding: 10px; */
        grid-template-columns: repeat(3, 1fr);
    }
    .chart-container-6{
        display: grid;
        /* gap: 10px;
        padding: 10px; */
        grid-template-columns: repeat(3, 1fr);
    }

    .with-side-bar-whole{
        width: 84vw;
        height: 92vh;
    }
    .without-side-bar-whole{
        width: 99vw;
        height: 92vh;
    }
    .with-side-bar-header{
        width: 84vw;
        height: 5vh;
    }
    .without-side-bar-header{
        width: 92vw;
        height: 5vh;
    }
    .with-side-bar-main{
        width: 84vw;
        height: 85vh;
    }
    .without-side-bar-main{
        width: 99vw;
        height: 85vh;
    }
</style>
