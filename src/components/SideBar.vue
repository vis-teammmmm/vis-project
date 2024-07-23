<template>
    <!-- 侧边栏模块，负责实现图类型的选择 -->
    <el-aside width="200px" style="font-weight: bold" v-show="showSideBar">
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
                        :class="{'selected':selectedChartNum===chartNum}"
                        >
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

                <el-sub-menu index="3" v-if="selectedChartNum>0">
                    <template #title>
                        视图类型
                    </template>
                    <el-menu-item @click="pieChartSelected" :class="{'selected':selectedChartTypeList[selectedChartIndex]==='pie'}" >
                        饼状图
                    </el-menu-item>
                    <el-menu-item @click="barChartSelected" :class="{'selected':selectedChartTypeList[selectedChartIndex]==='bar'}" >
                        柱状图
                    </el-menu-item>
                    <el-menu-item @click="lineChartSelected" :class="{'selected':selectedChartTypeList[selectedChartIndex]==='line'}" >
                        折线图
                    </el-menu-item>
                    <el-menu-item @click="scatterChartSelected" :class="{'selected':selectedChartTypeList[selectedChartIndex]==='scatter'}" >
                        散点图
                    </el-menu-item>
                    <!-- 列举视图类型，允许选择 -->
                </el-sub-menu>

                <el-sub-menu index="4" v-if="selectedChartNum>0">
                    <template #title>
                        可选绘图参数
                    </template>
                    <!-- 列举一些共用的且可选可不选的绘图参数，参数默认值在组件内给出 -->
                    <br>
                    <div >
                        <span class="inputtext">标题内容 </span>
                        <el-input
                            v-model="chartOptionList[selectedChartIndex].title.text"
                            style="width: 100px"
                            placeholder="默认为空"
                            clearable
                            @change="updateChartData"
                        />
                        <!-- 每当参数被改变时，更新当前选中的图表数据 -->
                    </div>
                    <br>
                    <div >
                        <span class="inputtext">标题位置 </span>
                        <el-select
                            v-model="chartOptionList[selectedChartIndex].title.left"
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
                    <div >
                        <span class="inputtext">图例位置 </span>
                        <el-select
                            v-model="chartOptionList[selectedChartIndex].legend.left"
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
                    <div >
                        <span class="inputtext">图例排列方式 </span>
                        <el-select
                            v-model="chartOptionList[selectedChartIndex].legend.orient"
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
                    <div v-if="chartOptionList[selectedChartIndex].xAxis">
                        <span class="inputtext" >x轴类型 </span>
                        <el-select
                            v-model="chartOptionList[selectedChartIndex].xAxis.type"
                            placeholder='类别轴'
                            style="width: 100px;"
                            @change="updateChartData"
                        >
                            <el-option
                                v-for="axisTypeOption in axisTypeOptionList"
                                :key="axisTypeOption.label"
                                :label="axisTypeOption.label"
                                :value="axisTypeOption.value"
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
                    <div v-if="selectedChartTypeList[selectedChartIndex]==='pie'" >
                        <br>
                        <div >
                            <span class="inputtext">分类依据 </span>
                            <el-select
                                v-model="chartOptionList[selectedChartIndex].series[0].encode.itemName"
                                placeholder='待选择'
                                style="width: 100px;"
                                @change="updateChartData"
                            >
                                <el-option
                                    v-for="keyword in chartOptionList[selectedChartIndex].dataset.source[0]"
                                    :key="keyword"
                                    :label="keyword"
                                    :value="keyword"
                                    :class="{'myoption': darkMode == true}"
                                />
                            </el-select>
                        </div>
                        <br>
                        <div >
                            <span class="inputtext">权重数据 </span>
                            <el-select
                                v-model="chartOptionList[selectedChartIndex].series[0].encode.value"
                                placeholder='待选择'
                                style="width: 100px;"
                                @change="updateChartData"
                            >
                                <el-option
                                    v-for="keyword in chartOptionList[selectedChartIndex].dataset.source[0]"
                                    :key="keyword"
                                    :label="keyword"
                                    :value="keyword"
                                    :class="{'myoption':darkMode == true}"
                                />
                            </el-select>
                        </div>
                        <br>
                    </div>

                    <div v-else>
                        <div>
                            <span class="inputtext">分类依据 </span>
                            <el-select
                                v-model="selectedCategories[selectedChartIndex]"
                                placeholder='待选择'
                                style="width: 100px;"
                                @change="updateCategory(selectedCategories[selectedChartIndex])"
                            >
                                <el-option
                                    v-for="keyword in chartOptionList[selectedChartIndex].dataset.source[0]"
                                    :key="keyword"
                                    :label="keyword"
                                    :value="keyword"
                                    :class="{'myoption': darkMode == true}"
                                />
                            </el-select>
                            <el-sub-menu>
                                <template #title>
                                    权重数据
                                </template>
                                <el-menu-item
                                    v-for="y in barLikeSeriesChosen[selectedChartIndex]"
                                    :key="y.name"
                                    @click="nameSelected(selectedCategories[selectedChartIndex],y.name)"
                                    :class="{'selected':y.state}"
                                    style="font-size: small;
                                    height: 2em;">
                                    <!-- {{ y.name }} -->
                                    {{ y.name }}
                                </el-menu-item>
                            </el-sub-menu>

                        </div>

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
        //name:'side-bar',
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
                //selectedChartType:'pie',
                selectedChartTypeList:[],
                selectedCategories:[],
                axisTypeOptionList:[
                    {
                        label:'类别轴',
                        value:'category'
                    },
                    {
                        label:'数值轴',
                        value:'value'
                    },
                    {
                        label:'时间轴',
                        value:'time'
                    }
                ],
                fileDataset:{
                    source:[
                        [],
                    ]
                    // 存放选中文件的数据，在addChart时被调用
                },
                barLikeSeriesChosen:[
                    // [
                    //     {
                    //         name:'',
                    //         state:false
                    //     }
                    // ]
                ],
                // chartOptionList:[
                //     {
                //         group:'',
                //         title:{
                //             text:'',
                //             left:'center'
                //         },
                //         // 图表题目
                //         tooltip:{
                //             trigger:'item'
                //         },
                //         // 提示框
                //         legend:{
                //             left:'right',
                //             orient:'vertical',
                //         },
                //         // 图例
                //         dataset:{
                //             source:[
                //                 [],
                //             ]
                //         },
                //         // 数据集
                //         xAxis:{type:'category'},
                //         yAxis:{},
                //         series:[
                //             {
                //                 type:'pie',
                //                 encode:{
                //                     itemName:'',
                //                     value:'',
                //                     x:'',
                //                     y:'',
                //                 }
                //             }
                //         ],
                //         // 种类
                //     }
                // ],
                chartOptionList:[],
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
                    this.$emit('updateSelectedFileUid',this.selectedFileUid)
                    console.log('updateSelectedFileUid',this.selectedFileUid)
                }
                else{
                    this.$message.warning(`未识别到文件！`);
                }
            },
            addPieSerie(option){
                let newPieSerie = {
                    type:'pie',
                    encode:{
                        itemName:'',
                        value:'',
                        x:'',
                        y:'',
                    }
                }
                option.series.push(newPieSerie)
            },
            addBarLikeSerie(option,charttype,xvalue,yvalue){
                let newBarLikeSerie = {
                    type: charttype,
                    encode:{
                        itemName:'',
                        value:'',
                        x:xvalue,
                        y:yvalue,
                    }
                }
                option.series.push(newBarLikeSerie)
            },
            deleteBarLikeSerie(option,xvalue,yvalue){
                if(option.series){
                    option.series = option.series.filter(function(item){
                        return !(item.encode.x === xvalue && item.encode.y === yvalue)
                    })
                }
            },
            destroySeries(option){
                option.series=[]
            },
            deleteChart(index){
                //if(index<=this.selectedChartNum-1){
                    this.selectedChartNum--
                //}
                // 如果删除的表在已选中的表前面，应当改选前面一张表，这个操作要放在最前面，防止未定义情况的发生
                //console.log('Before Deletion, we have chartOptionList:',this.chartOptionList)
                this.chartNumList.splice(index,1)
                // 在chartNumList中删除
                //console.log('After Deletion, the length of chartNumList is '+this.chartNumList.length)
                for(let i = index ; i< this.chartNumList.length;i++){
                    this.chartNumList[i]--
                }
                // 修改chartNumList的值保持正常
                this.chartOptionList.splice(index,1)
                // 在chartOptionList中删除
                this.barLikeSeriesChosen.splice(index,1)
                this.selectedCategories.splice(index,1)
                this.selectedChartTypeList.splice(index,1)
                //console.log('After Deletion, the length of chartOptionList is '+this.chartOptionList.length)
                this.updateAll()
                //console.log('After Deletion, we have chartOptionList:',this.chartOptionList)
                // 删除某张图表可能改变图表顺序与布局，因此更新所有图表
            },
            // 删除指定index的图表
            barLikeSeriesTurnFalse(index){
                for(let i = 0; i < this.barLikeSeriesChosen[index].length; i++){
                    this.barLikeSeriesChosen[index][i].state = false
                }
            },
            updateCategory(xname){
                if(this.chartOptionList[this.selectedChartIndex].series){
                    for(let i = 0; i< this.chartOptionList[this.selectedChartIndex].series.length;i++){
                        this.chartOptionList[this.selectedChartIndex].series[i].encode.x=xname
                    }
                }
                this.updateChartData()
            },
            nameSelected(xname,yname){
                const state=this.barLikeSeriesChosen[this.selectedChartIndex].find(item => item.name === yname).state
                if(state){
                    this.deleteBarLikeSerie(this.chartOptionList[this.selectedChartIndex],xname,yname)
                    this.barLikeSeriesChosen[this.selectedChartIndex].find(item => item.name === yname).state = false
                    //console.log(this.chartOptionList)
                }
                else{
                    this.addBarLikeSerie(this.chartOptionList[this.selectedChartIndex],this.selectedChartTypeList[this.selectedChartIndex],xname,yname)
                    this.barLikeSeriesChosen[this.selectedChartIndex].find(item => item.name === yname).state = true
                    //console.log(this.chartOptionList)
                }
                this.updateChartData()
            },
            pieChartSelected(){
                if(this.selectedChartNum>0){
                    if(this.selectedChartTypeList[this.selectedChartIndex]!=='pie'){
                        this.destroySeries(this.chartOptionList[this.selectedChartIndex])
                        this.addPieSerie(this.chartOptionList[this.selectedChartIndex])
                        this.chartOptionList[this.selectedChartIndex].tooltip.trigger='item'
                        delete this.chartOptionList[this.selectedChartIndex].xAxis
                        delete this.chartOptionList[this.selectedChartIndex].yAxis
                        //this.chartOptionList[this.selectedChartIndex].xAxis={}
                        //this.chartOptionList[this.selectedChartNum-1].yAxis=''
                        this.selectedChartTypeList[this.selectedChartIndex]='pie'
                        this.barLikeSeriesTurnFalse(this.selectedChartIndex)
                        this.selectedCategories[this.selectedChartIndex]=''
                    }
                }
                this.updateChartData()
            },
            barChartSelected(){
                if(this.selectedChartNum>0){
                    if(this.selectedChartTypeList[this.selectedChartIndex]!=='bar'){
                        this.destroySeries(this.chartOptionList[this.selectedChartIndex])
                        this.chartOptionList[this.selectedChartIndex].tooltip.trigger='axis'
                        //this.chartOptionList[this.selectedChartIndex].xAxis.type='category'
                        this.chartOptionList[this.selectedChartIndex].xAxis={
                            type:'category'
                        }
                        this.chartOptionList[this.selectedChartIndex].yAxis={

                        }
                        //this.chartOptionList[this.selectedChartNum-1].yAxis=''
                        this.selectedChartTypeList[this.selectedChartIndex]='bar'
                        this.barLikeSeriesTurnFalse(this.selectedChartIndex)
                        this.selectedCategories[this.selectedChartIndex]=''
                    }
                }
                this.updateChartData()
            },
            lineChartSelected(){
                if(this.selectedChartNum>0){
                    if(this.selectedChartTypeList[this.selectedChartIndex]!=='line'){
                        this.destroySeries(this.chartOptionList[this.selectedChartIndex])
                        this.chartOptionList[this.selectedChartIndex].tooltip.trigger='axis'
                        //this.chartOptionList[this.selectedChartIndex].xAxis.type='category'
                        //this.chartOptionList[this.selectedChartNum-1].yAxis=''
                        this.chartOptionList[this.selectedChartIndex].xAxis={
                            type:'category'
                        }
                        this.chartOptionList[this.selectedChartIndex].yAxis={

                        }
                        this.selectedChartTypeList[this.selectedChartIndex]='line'
                        this.barLikeSeriesTurnFalse(this.selectedChartIndex)
                        this.selectedCategories[this.selectedChartIndex]=''
                    }
                }
                this.updateChartData()
            },
            scatterChartSelected(){
                if(this.selectedChartNum>0){
                    if(this.selectedChartTypeList[this.selectedChartIndex]!=='scatter'){
                        this.destroySeries(this.chartOptionList[this.selectedChartIndex])
                        this.chartOptionList[this.selectedChartIndex].tooltip.trigger='axis'
                        //this.chartOptionList[this.selectedChartIndex].xAxis.type='category'
                        //this.chartOptionList[this.selectedChartNum-1].yAxis=''
                        this.chartOptionList[this.selectedChartIndex].xAxis={
                            type:'category'
                        }
                        this.chartOptionList[this.selectedChartIndex].yAxis={

                        }
                        this.selectedChartTypeList[this.selectedChartIndex]='scatter'
                        this.barLikeSeriesTurnFalse(this.selectedChartIndex)
                        this.selectedCategories[this.selectedChartIndex]=''
                    }
                }
                this.updateChartData()
            },
            // mapChartSelected(){
            //     if(this.selectedChartNum>0)
            //         this.chartOptionList[this.selectedChartNum-1].series.type ='map'
            // },
            // 改变当前选中的图表的种类
            addChart(){
                if(this.selectedFileUid==0){
                    this.$message.warning(`请先选中文件！`);
                }
                else{
                    if(this.chartNumList.length != this.chartOptionList.length){
                        this.chartOptionList.pop()
                        this.barLikeSeriesChosen.pop()
                    }
                    this.chartNumList.push(this.chartNumList.length+1)
                    // 在chartNumList中添加
                    let newChartOption=
                     //= this.selectedChartNum>0?
                    {
                        group:this.selectedFileUid.toString(),
                        title: {
                            text: '',
                            left: 'center',
                        },
                        tooltip: {
                            //trigger: this.chartOptionList[this.selectedChartIndex].tooltip.trigger
                            trigger:''
                        },
                        legend: {
                            left: 'right',
                            orient: 'vertical',
                        },
                        // xAxis:{
                        //     type:''
                        // },
                        // yAxis:{

                        // },
                        dataset:{
                            source:[
                                []
                            ]
                        },
                        series: [
                                {
                                //type: this.selectedChartTypeList[this.selectedChartIndex],
                                type:'',
                                encode: {
                                    itemName: '',
                                    value: '',
                                    x: '',
                                    y: ''
                                }
                            }
                        ]
                    }
                    // :{
                    //     group:toString(this.selectedFileUid),
                    //     title: {
                    //         text: '',
                    //         left: 'center',
                    //     },
                    //     tooltip: {
                    //         trigger: 'item'
                    //     },
                    //     legend: {
                    //         left: 'right',
                    //         orient: 'vertical',
                    //     },
                    //     xAxis:{
                    //         type:''
                    //     },
                    //     yAxis:{

                    //     },
                    //     dataset:{
                    //         source:[
                    //             []
                    //         ]
                    //     },
                    //     series: [
                    //             {
                    //             type: 'pie',
                    //             encode: {
                    //                 itemName: '',
                    //                 value: '',
                    //                 x: '',
                    //                 y: ''
                    //             }
                    //         }
                    //     ]
                    // };
                    this.selectedChartNum = this.chartNumList.length
                    // 必须先改变selectedChartNum再改变selectedChartTypeList
                    //this.selectedChartTypeList[this.selectedChartIndex]=newChartOption.series[0].type
                    this.selectedChartTypeList[this.selectedChartIndex]=''
                    newChartOption.dataset=this.fileDataset
                    this.chartOptionList.push(newChartOption)
                    console.log('addChart finished.',this.chartOptionList,this.chartNumList)

                    //在chartOptionList中添加

                    let newBarLikeSerie = [];
                    for (let i = 0; i < this.fileDataset.source[0].length; i++) {
                        // Ensure an object is initialized at index `i`
                        newBarLikeSerie[i] = {
                            name:  this.fileDataset.source[0][i],  // Directly assign the name
                            state: false                          // Initialize state as false
                        };
                    }
                    this.barLikeSeriesChosen.push(newBarLikeSerie)
                    console.log('barLikeSeriesChosen:',this.barLikeSeriesChosen)
                    this.selectedCategories.push('')
                    this.updateAll()
                     // 由于增添图表可能导致图表展示的布局改变，因此更新所有图表
                }
            },
            updateAll(){
                this.$emit('updateAll',this.chartOptionList, this.selectedChartIndex)
            },
            // 发送事件更新所有图表
            updateChartData(){
                this.$emit('updateChart', this.chartOptionList, this.selectedChartIndex)
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
            darkMode:Boolean,
            showSideBar:Boolean
            // 接受当前的页面风格是黑夜还是白天，false为白天
        },
        computed:{
            selectedChartIndex(){
                return this.selectedChartNum-1
            }
        },
        watch:{
            showSideBar:function(){
                this.updateAll()
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