<template>
    <!-- 侧边栏模块，负责实现图类型的选择 -->
    <el-aside width="200px" style="font-weight: bold">
        <el-scrollbar>
            <el-menu>

                <el-upload
                    v-model:file-list="fileList"
                    :class="upload-demo"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    multiple
                    index="1"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :limit="3"
                    :on-exceed="handleExceed"
                    accept=".csv"
                >
                    <el-button color="#626aef" style="background-color: #626aef;">
                        <!-- 保持颜色 -->
                        <span style="color: aliceblue;">上传文件</span>
                        <el-icon class="el-icon--right" style="color: aliceblue;">
                            <DocumentAdd />
                        </el-icon>
                    </el-button>
                    <template #tip >
                    <div class="el-upload__tip" >
                        仅支持.csv文件
                    </div>
                    </template>
                </el-upload>
                <!-- 上传文件 -->

                <el-sub-menu index="2">
                    <template #title>
                        当前视图
                    </template>
                    <el-menu-item v-for="chartNum of chartNumList" :key="chartNum.id">
                        视图{{ chartNum }}
                    </el-menu-item>
                </el-sub-menu>
                <!-- 选择视图 -->

                <el-sub-menu index="3">
                    <template #title>
                        视图类型
                    </template>
                    <el-menu-item @click="pieChartSelected">
                        饼状图
                    </el-menu-item>
                    <el-menu-item @click="barChartSelected">
                        柱状图
                    </el-menu-item>
                    <el-menu-item @click="lineChartSelected">
                        折线图
                    </el-menu-item>
                    <el-menu-item @click="scatterChartSelected">
                        散点图
                    </el-menu-item>
                    <el-menu-item @click="mapChartSelected">
                        地图
                    </el-menu-item>
                </el-sub-menu>
                <!-- 选择视图类型 -->

            </el-menu>
        </el-scrollbar>
    </el-aside>
</template>

<script>
    import { DocumentAdd } from '@element-plus/icons-vue';
    // 导入所需图标
    export default{
        name:'side-bar',
        components:{
            DocumentAdd,
        },
        data() {
            return {
                selectedChartNum:0,
                chartNumList:[],
                //chaerNumList内的元素从1开始
                selectedChartType:'pie',
            }
        },
        methods: {
            selectChart(idSelected){
                this.selectedChartNum=idSelected
            },
            // 选图表事件
            pieChartSelected(){
                this.selectedChartType='pie'
            },
            barChartSelected(){
                this.selectedChartType='bar'
            },
            lineChartSelected(){
                this.selectedChartType='line'
            },
            scatterChartSelected(){
                this.selectedChartType='scatter'
            },
            mapChartSelected(){
                this.selectedChartType='map'
            }
            // 选图表类型事件
        },
    }
</script>