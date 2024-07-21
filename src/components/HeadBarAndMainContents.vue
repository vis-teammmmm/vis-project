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
            </el-button>
        </el-header>
        <el-container>
            <el-main>
                <div id="chartindex"
                    :style="{ width: '100%', height: '100%' }"
                ></div>
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
            }
        },
        methods:{
            changeTheme(){
                toggleDark()
                this.darkmode = !this.darkmode
                this.createChart()
                this.$emit('themeChanged',this.darkmode)
            },
            createChart(){
                var chartDom = document.getElementById('chartindex')
                if(this.myChart){
                    this.myChart.dispose()
                }
                var myChart
                if(this.darkmode === false){
                    myChart = echarts.init(chartDom)
                }
                else{
                    myChart = echarts.init(chartDom,'dark')
                }
                this.myChart = myChart
                var option = this.optionList[0]
                option && myChart.setOption(option)
            }
        },
        props:{
            optionList:{
                type:Array,
                default:()=>([
                    {
                        title:{
                            text:'',
                            left:'',
                        },
                        tooltip:{
                            trigger:''
                        },
                        legend:{
                            left:'',
                            orient:'',
                        },
                        dataset:{
                            source:[
                                []
                            ]
                        },
                        series:{
                            type:'',
                            encode:{
                                itemName:'',
                                value:'',
                                x:'',
                                y:'',
                            }
                        }
                    }
                ])
            },
            updatesignal:Boolean,
        },
        watch:{
            updatesignal: function(){
                this.createChart()
                console.log('watched')
                console.log(this.optionList[0])
            },

        }
    }
</script>
