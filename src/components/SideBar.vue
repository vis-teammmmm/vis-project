<template>
    <!-- 侧边栏模块，负责实现图类型的选择 -->
    <el-aside width="200px" style="font-weight: bold">
        <el-scrollbar>
            <el-menu>

                <el-upload
                    v-model:file-list="fileList"
                    :class="upload-demo"
                    action="http://localhost:3000/upload"
                    multiple
                    index="1"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :on-error="handleError"
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
                fileList: [],
                selectedChartNum:0,
                chartNumList:[], //chaerNumList内的元素从1开始
                selectedChartType:'pie',
                fileDataMap: [], // 存储文件和对应数据的数组，里面每个元素有两个子元素，uid和data，分别表示文件id和文件对应的数据
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
            },
            // 选图表类型事件
            handlePreview(file) {
                console.log('preview', file);
            },
            handleRemove(file, fileList) { // 在删除文件的同时，将组件内的数据也删除
                console.log('remove', file, fileList);
                const index = this.fileDataMap.findIndex(item => item.uid === file.uid)
                if(index !== -1){
                    this.fileDataMap.splice(index, 1)
                }
            },
            beforeRemove(file) {
                return this.$confirm(`确定移除 ${file.name}?`);
            },
            handleSuccess(response, file, fileList) { // 上传成功后，将文件和对应数据存储到组件内的数组中
                console.log('success', response, file, fileList);
                this.$message.success(`${file.name} 上传成功`);
                this.fileDataMap.push({
                    uid: file.uid,
                    data: response.data,
                });
                console.log('存储的数据:', this.fileDataMap);
            },
            handleError(err, file, fileList) {
                console.log('error', err, file, fileList);
                this.$message.error(`${file.name} 上传失败`);
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleExceed() {
                this.$message.warning(`最多只能上传 3 个文件.`);
            },
        },
    }
</script>