<template>
    <!-- 侧边栏模块，负责实现图类型的选择 -->
    <el-aside width="200px" style="font-weight: bold">
        <el-scrollbar>
            <el-menu>
                <div index="1">
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
                    <br>
                    <div>
                        <span class="inputtext">选中文件 </span>
                        <el-select
                            v-model="selectedFileUid"
                            placeholder='待选择'
                            style="width: 100px;"
                            @change="updateFileDataset"
                        >
                            <el-option
                                v-for="file in fileList"
                                :key="file.uid"
                                :label="file.name"
                                :value="file.uid"
                                :class="{'myoption': darkMode == true}"
                            />
                        </el-select>
                    </div>
                    <br>
                </div>

                <!-- 上传文件 -->

                <el-sub-menu index="2">
                    <template #title>
                        当前视图
                    </template>
                    <el-menu-item
                        v-for="chartNum of chartNumList"
                        :key="chartNum.id"
                        @click="changeSelectedChartNum(chartNum)"
                        :class="{'selected':selectedChartNum===chartNum}">
                        <!-- 列举所有的视图，点击切换选中的视图 -->
                        <span v-if="chartOptionList[chartNum-1].title.text===''">
                            视图{{ chartNum }}
                        </span>
                        <span v-else>
                            {{ chartOptionList[chartNum-1].title.text }}
                        </span>
                        <!-- 依据当前是否有视图进行逻辑判断，防止报错 -->
                        <span style="width: 100px;">
                        </span>
                        <span>
                            <el-icon
                            @click="deleteChart(chartNum-1)"
                            class="deleteicon el-icon--right">
                                <circle-close></circle-close>
                            </el-icon>
                        </span>
                        <!-- 提供删除视图选项 -->
                    </el-menu-item>
                    <el-menu-item
                        class="mybutton"
                        @click="addChart"
                    >
                        添加视图
                    </el-menu-item>
                    <!-- 提供添加视图选项 -->
                </el-sub-menu>

                <el-sub-menu index="3">
                    <template #title>
                        视图类型
                    </template>
                    <el-menu-item @click="pieChartSelected" :class="{'selected':selectedChartType==='pie'}">
                        饼状图
                    </el-menu-item>
                    <el-menu-item @click="barChartSelected" :class="{'selected':selectedChartType==='bar'}">
                        柱状图
                    </el-menu-item>
                    <el-menu-item @click="lineChartSelected" :class="{'selected':selectedChartType==='line'}">
                        折线图
                    </el-menu-item>
                    <el-menu-item @click="scatterChartSelected" :class="{'selected':selectedChartType==='scatter'}">
                        散点图
                    </el-menu-item>
                    <el-menu-item @click="mapChartSelected" :class="{'selected':selectedChartType==='map'}">
                        地图
                    </el-menu-item>
                    <!-- 列举视图类型，允许选择 -->
                </el-sub-menu>

                <el-sub-menu index="4" v-if="selectedChartNum>0">
                    <template #title>
                        可选绘图参数
                    </template>
                    <!-- 列举一些共用的且可选可不选的绘图参数，参数默认值在组件内给出 -->
                    <br>
                    <div>
                        <span class="inputtext">标题内容 </span>
                        <el-input
                            v-model="chartOptionList[selectedChartNum-1].title.text"
                            style="width: 100px"
                            placeholder="默认为空"
                            clearable
                            @change="updateChartData"
                        />
                        <!-- 每当参数被改变时，更新当前选中的图表数据 -->
                    </div>
                    <br>
                    <div>
                        <span class="inputtext">标题位置 </span>
                        <el-select
                            v-model="chartOptionList[selectedChartNum-1].title.left"
                            placeholder='居中'
                            style="width: 100px;"
                            @change="updateChartData"
                        >
                            <el-option
                                v-for="leftOption in leftOptions"
                                :key="leftOption.value"
                                :label="leftOption.label"
                                :value="leftOption.value"
                                :class="{'myoption': darkMode == true}"
                            />
                            <!-- 根据黑夜模式与否修改option单选框的样式，防止对比度过低 -->
                        </el-select>
                    </div>
                    <br>
                    <div>
                        <span class="inputtext">图例位置 </span>
                        <el-select
                            v-model="chartOptionList[selectedChartNum-1].legend.left"
                            placeholder='居右'
                            style="width: 100px;"
                            @change="updateChartData"
                        >
                            <el-option
                                v-for="leftOption in leftOptions"
                                :key="leftOption.value"
                                :label="leftOption.label"
                                :value="leftOption.value"
                                :class="{'myoption': darkMode == true}"
                            />
                        </el-select>
                    </div>
                    <br>
                    <div>
                        <span class="inputtext">图例排列方式 </span>
                        <el-select
                            v-model="chartOptionList[selectedChartNum-1].legend.orient"
                            placeholder='垂直'
                            style="width: 100px;"
                            @change="updateChartData"
                        >
                            <el-option
                                v-for="listOption in listOptions"
                                :key="listOption.value"
                                :label="listOption.label"
                                :value="listOption.value"
                                :class="{'myoption': darkMode == true}"
                            />
                        </el-select>
                    </div>
                    <br>
                </el-sub-menu>
                <el-sub-menu index="5" v-if="selectedChartNum > 0">
                    <template #title>
                        必选绘图参数
                    </template>

                    <!-- 依据绘图种类不同，提供不同的必选绘图参数 -->
                    <div v-show="selectedChartType==='pie'">
                        <br>
                        <div>
                            <span class="inputtext">分类依据 </span>
                            <el-select
                                v-model="chartOptionList[selectedChartNum-1].series.encode.itemName"
                                placeholder='待选择'
                                style="width: 100px;"
                                @change="updateChartData"
                            >
                                <el-option
                                    v-for="keyword in chartOptionList[selectedChartNum-1].dataset.source[0]"
                                    :key="keyword"
                                    :label="keyword"
                                    :value="keyword"
                                    :class="{'myoption': darkMode == true}"
                                />
                            </el-select>
                        </div>
                        <br>
                        <div>
                            <span class="inputtext">权重数据 </span>
                            <el-select
                                v-model="chartOptionList[selectedChartNum-1].series.encode.value"
                                placeholder='待选择'
                                style="width: 100px;"
                                @change="updateChartData"
                            >
                                <el-option
                                    v-for="keyword in chartOptionList[selectedChartNum-1].dataset.source[0]"
                                    :key="keyword"
                                    :label="keyword"
                                    :value="keyword"
                                    :class="{'myoption':darkMode == true}"
                                />
                            </el-select>
                        </div>
                        <br>
                    </div>

                </el-sub-menu>
            </el-menu>
        </el-scrollbar>
    </el-aside>
</template>


<script>
    import { DocumentAdd, CircleClose } from '@element-plus/icons-vue';
    // 导入所需图标
    export default{
        name:'side-bar',
        components:{
            DocumentAdd,
            CircleClose
        },
        data() {
            return {
                selectedChartNum:0,
                // 当前已选中的图表是第几个，值为index+1
                chartNumList:[],
                //chartNumList内的元素从1开始
                fileList: [],
                fileDataMap: [], // 存储文件和对应数据的数组，里面每个元素有两个子元素，uid和data，分别表示文件id和文件对应的数据
                selectedFileUid:0,
                fileDataset:{
                    source:[
                        [],
                    ]
                    // 存放选中文件的数据，在addChart时被调用
                },
                chartOptionList:[
                    {
                        title:{
                            text:'',
                            left:'center'
                        },
                        // 图表题目
                        tooltip:{
                            trigger:'item'
                        },
                        // 提示框
                        legend:{
                            left:'right',
                            orient:'vertical',
                        },
                        // 图例
                        dataset:{
                            source:[
                                [],
                            ]
                        },
                        // 数据集
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
                        // 种类
                    }
                ],
                leftOptions:[
                    {
                        value:'center',
                        label:'居中'
                    },
                    {
                        value:'left',
                        label:'居左'
                    },
                    {
                        value:'right',
                        label:'居右'
                    }
                ],
                listOptions:[
                    {
                        value:'horizontal',
                        label:'水平'
                    },
                    {
                        value:'vertical',
                        label:'垂直'
                    }
                ]
                // 用于列举可选参数的列表
            }
        },
        methods: {
            changeSelectedChartNum(num){
                this.selectedChartNum = num
            },
            // 更新当前选中的图表序号
            updateFileDataset(){
                const index = this.fileDataMap.findIndex(item => item.uid === this.selectedFileUid)
                if(index != -1){
                    this.fileDataset = this.fileDataMap[index].dataset
                }
                else{
                    this.$message.warning(`未识别到文件！`);
                }
            },
            deleteChart(index){
                this.chartNumList.splice(index,1)
                // 在chartNumList中删除
                console.log('After Deletion, the length of chartNumList is '+this.chartOptionList.length)
                for(let i = index ; i< this.chartNumList.length;i++){
                    this.chartNumList[i]--
                }
                // 修改chartNumList的值保持正常
                if(index==this.selectedChartNum-1){
                    this.selectedChartNum--
                }
                // 如果删除的是最后一张表，且当前选中的也是最后一张表，改选前面一张表
                this.chartOptionList.splice(index,1)
                // 在chartOptionList中删除
                console.log('After Deletion, the length of chartOptionList is '+this.chartOptionList.length)
                this.updateAll()
                // 删除某张图表可能改变图表顺序与布局，因此更新所有图表
            },
            // 删除指定index的图表
            pieChartSelected(){
                if(this.selectedChartNum>0)
                    this.chartOptionList[this.selectedChartNum-1].series.type ='pie'
            },
            barChartSelected(){
                if(this.selectedChartNum>0)
                    this.chartOptionList[this.selectedChartNum-1].series.type ='bar'
            },
            lineChartSelected(){
                if(this.selectedChartNum>0)
                    this.chartOptionList[this.selectedChartNum-1].series.type ='line'
            },
            scatterChartSelected(){
                if(this.selectedChartNum>0)
                    this.chartOptionList[this.selectedChartNum-1].series.type ='scatter'
            },
            mapChartSelected(){
                if(this.selectedChartNum>0)
                    this.chartOptionList[this.selectedChartNum-1].series.type ='map'
            },
            // 改变当前选中的图表的种类
            addChart(){
                if(this.selectedFileUid==0){
                    this.$message.warning(`请先选中文件！`);
                }
                else{
                    if(this.chartNumList.length != this.chartOptionList.length){
                        this.chartOptionList.pop()
                    }
                    this.chartNumList.push(this.chartNumList.length+1)
                    // 在chartNumList中添加
                    let newChartOption = {
                        title: {
                            text: '',
                            left: 'center',
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            left: 'right',
                            orient: 'vertical',
                        },
                        dataset:{
                            source:[
                                []
                            ]
                        },
                        series: {
                            type: 'pie',
                            encode: {
                                itemName: '',
                                value: '',
                                x: '',
                                y: ''
                            }
                        }
                    };
                    newChartOption.dataset=this.fileDataset
                    this.chartOptionList.push(newChartOption)
                    console.log('addChart finished.',this.chartOptionList,this.chartNumList)
                    //在chartOptionList中添加
                }
                this.updateAll()
                // 由于增添图表可能导致图表展示的布局改变，因此更新所有图表
            },
            updateAll(){
                this.$emit('updateAll',this.chartOptionList, this.selectedChartNum-1)
            },
            // 发送事件更新所有图表
            updateChartData(){
                this.$emit('updateChart', this.chartOptionList, this.selectedChartNum-1)
            },
            // 发送事件更新单张图表
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
                    dataset: {source: response.data},
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
        props:{
            darkMode:Boolean
            // 接受当前的页面风格是黑夜还是白天，false为白天
        },
        computed:{
            selectedChartType(){
                return this.selectedChartNum>0? this.chartOptionList[this.selectedChartNum-1].series.type : ''
            }
        }
    }
</script>
<style scoped>
    .selected{
        background-color: #626aef!important;
        color: aliceblue;
    }
    .inputtext{
        font-size: 0.5em
    }
    .mybutton:focus{
        background-color: rgba(0, 0,0, 0)
    }
    .mybutton:active{
        background-color: gray;
    }
    .deleteicon:hover{
        color: red;
    }
    .myoption{
        background-color: gray;
        color: white;
        font-weight: bold;
    }
</style>