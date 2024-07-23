<template>
    <el-container>
        <el-header style=" font-size: 2em ;display :flex ;justify-content: space-around; align-items:center;" >
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
        <el-container>
            <el-main>
                <div class="chart-container">
                    <div
                        v-for="chartIndex in chartIndexList"
                        :key="chartIndex"
                        :id="chartIndex"
                        class="chart-item"
                    >
                    </div>
                    <!-- 遍历绘画图表 -->
                </div>
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
                chartIndexList:[],
                // 存放图表Index的数组
                showSideBar:true,
            }
        },
        methods:{
            changeTheme(){
                toggleDark()
                // 改变亮暗
                this.darkmode = !this.darkmode
                this.updateAll()
                // 更新所有图表
                this.$emit('themeChanged',this.darkmode)
                // 传输亮暗模式已经发生改变的信息
            },
            changeSideBar(){
                this.showSideBar = !this.showSideBar
                this.$emit('updateSideBar',this.showSideBar)
            },
            updateChart(index) {
                if(index<0){
                    console.log('No selectedChart yet')
                    return
                    // 防止还没有选中图表的时候的错误更新
                }
                var chartDom = document.getElementById(index);
                // 根据index建立存放图表的文档对象
                if (!chartDom) {
                    console.log('DOM element with id '+ index +' not found!');
                    //console.log(this.chartIndexList[index])
                    return;
                    // 不要删掉这里,提前return可以避免出错时网页直接崩溃
                }


                if (!Array.isArray(this.myChart)) {
                    this.myChart = [];
                    console.log('Transform myChart to Array')
                }
                // 确保this.myChart是数组

                if (this.myChart[index]) {
                    this.myChart[index].dispose();
                    console.log('myChart[' + index + '] disposed')
                }
                // 如果该索引的图表实例已存在，则销毁它

                var myChart;
                if (this.darkmode === false) {
                    myChart = echarts.init(chartDom);
                } else {
                    myChart = echarts.init(chartDom, 'dark');
                }
                // 初始化新的图表实例，并使其与亮暗模式适应
                var option = this.optionList[index];
                this.myChart[index] = myChart;
                // 将新的图表实例存储在数组中
                if (option) {
                    if(option.series[0]){
                        if((option.series[0].encode.x && option.series[0].encode.y) || (option.series[0].encode.itemName && option.series[0].encode.value)){
                            myChart.group=option.group
                            myChart.setOption(option);
                            echarts.connect(option.group)
                            console.log('Connect group:',this.groupName)
                        }
                        else{
                            console.log('图表参数不完整')
                            console.log(option.series[0])
                        }
                    }
                    else{
                        console.log('图表参数不完整，不存在serie')
                    }
                }
                else{
                    console.log('图表参数不完整，不存在option')
                }

                // 获取并设置对应的图表选项
            },
            updateAll(){
                let i = 0;
                if(this.optionList){
                    while(i<this.optionList.length){
                        this.updateChart(i);
                        console.log('updateChart: '+ i)
                        // 遍历更新所有图表
                        ++i;
                    }
                }
                if(this.myChart && this.myChart[i]){
                    this.myChart[i].dispose();
                    this.chartIndexList.pop();
                    console.log('mychart '+i+' disposed')
                    // 如果本次全体更新由删除引起，删除掉最后一个元素
                }
            }
        },

        props:{
            // optionList:{
            //     type:Array,
            //     default:()=>([
            //         {
            //             group:'',
            //             title:{
            //                 text:'',
            //                 left:'',
            //             },
            //             tooltip:{
            //                 trigger:''
            //             },
            //             legend:{
            //                 left:'',
            //                 orient:'',
            //             },
            //             dataset:{
            //                 source:[
            //                     []
            //                 ]
            //             },
            //             xAxis:{
            //                 type:''
            //             },
            //             yAxis:{

            //             },
            //             series:[
            //                 {
            //                     type:'',
            //                     encode:{
            //                         itemName:'',
            //                         value:'',
            //                         x:'',
            //                         y:'',
            //                     }
            //                 }
            //             ]
            //         }
            //     ])
            // },
            optionList:Array,
            // 接受图表参数的列表
            updatesignal:Boolean,
            // 提示更新单个图表
            updateallsignal:Boolean,
            // 提示更新所有图表
            selectedChartIndex:Number,
            // 提示当前选中的图表
            groupName:String
        },
        watch:{
            updatesignal: function(){
                this.updateChart(this.selectedChartIndex)
                // 更新单个图表
            },
            selectedChartIndex: function(){
                if(this.selectedChartIndex >= 0)
                {
                    this.chartIndexList[this.selectedChartIndex]=this.selectedChartIndex
                }
                // 更新chartIndexList数组
            },
            updateallsignal: function(){
                this.updateAll()
                // 更新所有图表
            }
        }
    }
</script>
<style scoped>
     .chart-container {
        display: grid;
        gap: 10px;
        padding: 10px;
    }

    .chart-item {
        width: 100%;
        height: 400px;
    }

    /* Default layout: one chart per row */
    .chart-container {
        grid-template-columns: 1fr;
    }

    /* Two charts per row */
    @media (min-width: 600px) {
        .chart-container {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    /* Three charts per row */
    @media (min-width: 900px) {
        .chart-container {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    /* Four charts per row */
    @media (min-width: 1200px) {
        .chart-container {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
