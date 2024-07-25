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
                    <!-- el-upload 是来自Element Plus 的组件，在模块中承担读入文件的任务 -->
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
                    <!-- 用select表来选择文件，文件选项由v-for给出 -->
                </div>

                <el-sub-menu index="2">
                    <!-- 视图子目录 -->
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
                         <!-- 这里必须使用v-if，因为v-show不管如何都会执行内部语句，只是不显示，可能导致逻辑错误 -->
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
                    <!-- 视图类型子目录 -->
                    <template #title>
                        视图类型
                    </template>
                    <el-menu-item @click="pieChartSelected" :class="{'selected':selectedChartType ==='pie'}" >
                        饼状图
                    </el-menu-item>
                    <el-menu-item @click="barChartSelected" :class="{'selected':selectedChartType==='bar'}" >
                        柱状图
                    </el-menu-item>
                    <el-menu-item @click="lineChartSelected" :class="{'selected':selectedChartType==='line'}" >
                        折线图
                    </el-menu-item>
                    <el-menu-item @click="scatterChartSelected" :class="{'selected':selectedChartType==='scatter'}" >
                        散点图
                    </el-menu-item>
                    <!-- 列举视图类型，允许选择 -->
                    <!-- 当在不同类型的视图间切换时，点击触发的事件将会将当前的option按照视图类型进行对应的初始化 -->
                    <!-- 因此，在使用时，切换视图类型将会丢失原有数据 -->
                </el-sub-menu>

                <el-sub-menu index="4" v-if="selectedChartNum > 0 && selectedChartType !== ''">
                    <!-- 可选绘图参数子目录，只有选择好图表类型后才会显示 -->
                    <template #title>
                        可选绘图参数
                    </template>
                    <!-- 列举一些共用的且可选可不选的绘图参数，参数默认值在组件内给出 -->
                    <br>
                    <div >
                        <span class="inputtext">标题内容 </span>
                        <el-input
                            v-model="selectedChartOption.title.text"
                            style="width: 100px"
                            placeholder="默认为空"
                            clearable
                            @change="updateChartData"
                        />
                        <!-- 每当参数被改变时，更新当前选中的图表数据，从而触发图表更新 -->
                    </div>
                    <br>
                    <div >
                        <span class="inputtext">标题位置 </span>
                        <el-select
                            v-model="selectedChartOption.title.left"
                            placeholder='居左'
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
                            <!-- class根据黑夜模式与否修改option单选框的样式，防止对比度过低 -->
                        </el-select>
                    </div>
                    <br>
                    <div >
                        <span class="inputtext">图例位置 </span>
                        <el-select
                            v-model="selectedChartOption.legend.left"
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
                        </el-select>
                    </div>
                    <br>
                    <div >
                        <span class="inputtext">图例排列方式 </span>
                        <el-select
                            v-model="selectedChartOption.legend.orient"
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
                    <div v-if="selectedChartType === 'scatter'">
                        <br>
                        <!-- 当所选图表类型为散点图时显示 -->
                        <span class="inputtext" >散点大小 </span>
                        <el-select
                            v-model="selectedChartOption.symbolSize"
                            placeholder='15'
                            style="width: 100px;"
                            @change="updateChartData"
                        >
                            <el-option
                                v-for="symbolSizeOption in symbolSizeOptionList"
                                :key="symbolSizeOption.label"
                                :label="symbolSizeOption.label"
                                :value="symbolSizeOption.value"
                                :class="{'myoption': darkMode == true}"
                            />
                        </el-select>
                    </div>
                    <div v-if="selectedChartOption.xAxis">
                        <br>
                        <!-- 当所选图表类型拥有x轴时显示 -->
                        <span class="inputtext" >x轴类型 </span>
                        <el-select
                            v-model="selectedChartOption.xAxis.type"
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
                    <div v-if="selectedChartOption.yAxis">
                        <br>
                        <!-- 当所选图表类型拥有x轴时显示 -->
                        <span class="inputtext" >y轴类型 </span>
                        <el-select
                            v-model="selectedChartOption.ytype"
                            placeholder='默认'
                            style="width: 100px;"
                            @change="updateChartData"
                        >
                            <el-option
                                v-for="yType in yTypeList"
                                :key="yType.label"
                                :label="yType.label"
                                :value="yType.value"
                                :class="{'myoption': darkMode == true}"
                            />
                        </el-select>
                    </div>
                    <div v-if="selectedChartType !== 'pie'">
                        <br>
                        <!-- 当所选图表类型非饼图时显示 -->
                        <span class="inputtext" >x-y转置 </span>
                        <el-select
                            v-model="selectedChartOption.invert"
                            placeholder='否'
                            style="width: 100px;"
                            @change="updateChartData"
                        >
                            <el-option
                                v-for="invertOption in invertOptionList"
                                :key="invertOption.label"
                                :label="invertOption.label"
                                :value="invertOption.value"
                                :class="{'myoption': darkMode == true}"
                            />
                        </el-select>
                    </div>
                    <div v-if="selectedChartType !== 'pie'">
                        <br>
                        <!-- 当所选图表类型非饼图时显示 -->
                        <span class="inputtext" >排序反转 </span>
                        <el-select
                            v-model="selectedChartOption.xAxis.inverse"
                            placeholder='否'
                            style="width: 100px;"
                            @change="updateChartData"
                        >
                            <el-option
                                v-for="inverseOption in inverseOptionList"
                                :key="inverseOption.label"
                                :label="inverseOption.label"
                                :value="inverseOption.value"
                                :class="{'myoption': darkMode == true}"
                            />
                        </el-select>
                    </div>
                    <br>
                    <div >
                        <span class="inputtext">数值处理方法 </span>
                        <el-select
                            v-model="selectedChartOption.dataMethod"
                            placeholder='默认'
                            style="width: 100px;"
                            @change="updateChartData"
                            @click="tips"
                        >
                            <el-option
                                v-for="datamethod in dataMethodList"
                                :key="datamethod"
                                :label="datamethod.label"
                                :value="datamethod.value"
                                :class="{'myoption': darkMode == true}"
                            />
                        </el-select>
                        <!-- 提供基本的数据处理功能 -->
                    </div>
                    <br>
                </el-sub-menu>
                <el-sub-menu index="5" v-if="selectedChartNum > 0 && selectedChartType !==''">
                    <template #title>
                        必选绘图参数
                    </template>

                    <!-- 依据绘图种类不同，提供不同的必选绘图参数 -->
                    <div v-if="selectedChartType ==='pie'" >
                        <br>
                        <div >
                            <span class="inputtext">分类依据 </span>
                            <el-select
                                v-model="selectedChartOption.series[0].encode.itemName"
                                placeholder='待选择'
                                style="width: 100px;"
                                @change="updateChartData"
                            >
                                <el-option
                                    v-for="keyword in selectedChartOption.dataset.source[0]"
                                    :key="keyword"
                                    :label="keyword"
                                    :value="keyword"
                                    :class="{'myoption': darkMode == true}"
                                />
                            </el-select>
                            <!-- 选择用于分类的数据维度 -->
                        </div>
                        <br>
                        <div >
                            <span class="inputtext">权重数据 </span>
                            <el-select
                                v-model="selectedChartOption.series[0].encode.value"
                                placeholder='待选择'
                                style="width: 100px;"
                                @change="updateChartData"
                            >
                                <el-option
                                    v-for="keyword in selectedChartOption.dataset.source[0]"
                                    :key="keyword"
                                    :label="keyword"
                                    :value="keyword"
                                    :class="{'myoption':darkMode == true}"
                                />
                            </el-select>
                            <!-- 也就是被比较的数值 -->
                        </div>
                        <br>
                    </div>

                    <div v-else>
                        <!-- 柱形图，折线图和散点图的参数较为类似，所以一起处理 -->
                        <div>
                            <span class="inputtext">x轴数据 </span>
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
                            <!-- 选择用于分类的数据维度 -->
                            <el-sub-menu >
                                <template #title>
                                    <span style="margin-left: -2em; font-size: small;">y轴数据(可多选)</span>
                                </template>
                                <!-- 这里提供可多选的y轴数据 -->
                                <el-menu-item
                                    v-for="y in barLikeSeriesChosen[selectedChartIndex]"
                                    :key="y.name"
                                    @click="nameSelected(selectedCategories[selectedChartIndex],y.name)"
                                    :class="{'selected':y.state}"
                                    style="font-size: small;
                                    height: 2em;
                                    margin-left: -4em;">
                                    {{ y.name }}
                                </el-menu-item>
                                <!-- barLikeSeriesChosen是一个数组，其元素可以看作当前图表的source中的数据类型配上指示数据类型是否被选中的布尔state，用于配合这里的按钮实现多选功能 -->
                                 <!-- 至于selectedCategories则是另一个存储当前x轴数据种类选择情况的数组 -->
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
    const dataProcessMethod = require('./dataProcessMethod.js')
    // 导入数据处理函数
    export default{
        components:{
            DocumentAdd,
            CircleClose
        },
        data() {
            return {
                selectedChartNum:0,
                // 反映当前已选中的图表是第几个，值为index+1
                chartNumList:[],
                //chartNumList内的元素从1开始
                fileList: [],
                fileDataMap: [],
                // 存储文件和对应数据的数组，里面每个元素有两个子元素，uid和data，分别表示文件id和文件对应的数据
                selectedFileUid:0,
                //当前选中的文件的uid
                selectedChartTypeList:[],
                // 存储各个视图的种类
                selectedCategories:[],
                //非饼图选择x轴数据类型的辅助数组
                fileDataset:{
                    source:[
                        [],
                    ]
                    // 存放选中文件的数据，在addChart时被调用
                },
                barLikeSeriesChosen:[],
                // 一个数组，其元素可以看作当前图表的source中的数据类型配上指示数据类型是否被选中的布尔state，用于配合按钮实现y轴数据多选功能
                chartOptionList:[],
                // 绘图option的列表
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
                ],
                axisTypeOptionList:[
                    {
                        label:'类别轴',
                        value:'category'
                    },
                    {
                        label:'数值轴(默认)',
                        value:'value'
                    },
                    {
                        label:'数值轴(对数)',
                        value:'log'
                    },
                    {
                        label:'时间轴',
                        value:'time'
                    }
                ],
                dataMethodList:[
                    {
                        label:'默认',
                        value:'Default'
                    },
                    {
                        label:'取平均',
                        value:'Avg'
                    },
                    {
                        label:'求和',
                        value:'Sum'
                    },
                    {
                        label:'计数',
                        value:'Count'
                    },
                    {
                        label:'取方差',
                        value:'Var'
                    },
                    {
                        label:'取标准差',
                        value:'Std'
                    }
                ],
                invertOptionList:[
                    {
                        label:'否',
                        value:false
                    },
                    {
                        label:'是',
                        value:true
                    }
                ],
                inverseOptionList:[
                    {
                        label:'否',
                        value:false
                    },
                    {
                        label:'是',
                        value:'true'
                    }
                ],
                symbolSizeOptionList:[
                    {
                        label:'3',
                        value: 3
                    },
                    {
                        label:'5',
                        value:5
                    },
                    {
                        label:'10',
                        value:10
                    },
                    {
                        label:'15',
                        value:15
                    },
                    {
                        label:'20',
                        value:20
                    }
                ],
                yTypeList:[
                    {
                        label:'默认',
                        value:'default'
                    },
                    {
                        label:'对数',
                        value:'log'
                    }
                ]
                // 用于列举可选参数的静态列表
            }
        },
        methods: {
            tips(){
                if(this.selectedChartType!=='pie'){
                    this.$message.warning(`如果y轴绑定多组数据，建议最后选择数据处理方式哦~`);
                }
                // 关于数值处理方法的小提示
            },
            changeSelectedChartNum(num){
                this.selectedChartNum = num
            },
            // 更新当前选中的图表序号
            updateFileDataset() {
                let retryCount = 0;
                const maxRetries = 5;
                const retryInterval = 1000;
                const findFile = () => {
                    const index = this.fileDataMap.findIndex(item => item.uid === this.selectedFileUid);
                    if (index !== -1) {
                        this.fileDataset = this.fileDataMap[index].dataset;
                        this.$message.success('文件已选中 :)')
                        // 更新文件uid，用于多图联动时的连接
                    } else if (retryCount < maxRetries) {
                        this.$message.warning(`文件还没加载好，一秒后为您重试！`);
                        retryCount++;
                        setTimeout(findFile, retryInterval);
                    } else {
                        this.$message.warning('啊吧啊吧……文件加载失败了 :( 请重启浏览器 QAQ');
                    }
                };
                findFile();
            },
            addPieSerie(option){
                let newPieSerie = {
                    type:'pie',
                    encode:{
                        itemName:'',
                        value:'',
                        x:'',
                        y:'',
                    },
                    name:'',
                    radius:'50%',
                    center:['45%','57%']
                }
                option.series.push(newPieSerie)
                // 用于添加一个空白的饼图serie，在饼图option初始化中使用
            },
            addBarLikeSerie(option,charttype,xvalue,yvalue){
                // 用于添加一个有值的非pie类图的serie
                let newBarLikeSerie = {
                    type: charttype,
                    encode:{
                        itemName:'',
                        value:'',
                        x:xvalue,
                        y:yvalue,
                    },
                    name:yvalue
                }
                option.series.push(newBarLikeSerie)
                // 添加serie
                if(option.series.length === 1){
                    let newY = {
                        name:yvalue,
                        type: 'value',
                        axisLabel: {
                            formatter: function (value) {
                                return value >= 100000 ? value.toExponential(1) : value;
                                // 条件选择科学计数法
                            }
                        }
                    }
                    option.yAxis[0]=newY
                }
                else if(option.series.length === 2){
                    let newY1 = {
                        name:yvalue,
                        position:'right',
                        type: 'value',
                        axisLabel: {
                            formatter: function (value) {
                                return value >= 100000 ? value.toExponential(1) : value;
                            }
                        }
                    }
                    option.yAxis[1]=newY1
                    let newY0 = {
                        name:option.series[0].encode.y,
                        type: 'value',
                        axisLabel: {
                            formatter: function (value) {
                                return value >= 100000 ? value.toExponential(1) : value;
                            }
                        }
                    }
                    option.yAxis[0]=newY0
                }
                else {
                    option.yAxis = [{
                        type:'value',
                        axisLabel: {
                            formatter: function (value) {
                                return value >= 100000 ? value.toExponential(1) : value;
                            }
                        }
                    }]
                }
                // 为双轴柱形图自动设置双轴样式
                // 为过大的轴标度提供科学计数法的显示方法
            },
            deleteBarLikeSerie(option,xvalue,yvalue){
                // 删除非pie类的特定serie
                if(option.series){
                    option.series = option.series.filter(function(item){
                        return !(item.encode.x === xvalue && item.encode.y === yvalue)
                    })
                    // 筛去 encode数据对应的serie
                    // 删除时也需要注意双轴情况的处理
                    if(option.series.length === 2){
                        let newY0 = {
                            name: option.series[0].encode.y,
                            type: 'value',
                            axisLabel: {
                                formatter: function (value) {
                                    return value >= 100000 ? value.toExponential(1) : value;
                                }
                            }
                        }
                        option.yAxis[0]=newY0
                        let newY1 = {
                            name: option.series[1].encode.y,
                            position:'right',
                            type: 'value',
                            axisLabel: {
                                formatter: function (value) {
                                    return value >= 100000 ? value.toExponential(1) : value;
                                }
                            }
                        }
                        option.yAxis[1]=newY1
                    }
                    else if(option.series.length === 1){
                        let newY0 = {
                            name: option.series[0].encode.y,
                            type: 'value',
                            axisLabel: {
                                formatter: function (value) {
                                    return value >= 100000 ? value.toExponential(1) : value;
                                }
                            }
                        }
                        option.yAxis[0]=newY0
                    }
                    else{
                        option.yAxis = [{
                            type:'value',
                            axisLabel: {
                                formatter: function (value) {
                                    return value >= 100000 ? value.toExponential(1) : value;
                                }
                            }
                        }]
                    }
                }
            },
            destroySeries(option){
                option.series=[]
            },
            // 销毁所有的series，初始化时用于清除数据
            deleteChart(index){
            // 删除指定index的图表
                this.selectedChartNum--
                // 如果删除的表在已选中的表前面，应当改选前面一张表，这个操作要放在最前面，防止未定义情况的发生
                this.chartNumList.splice(index,1)
                // 在chartNumList中删除图表
                for(let i = index ; i< this.chartNumList.length;i++){
                    this.chartNumList[i]--
                }
                // 修改chartNumList的值保持正常
                this.chartOptionList.splice(index,1)
                // 在chartOptionList中删除图表
                this.barLikeSeriesChosen.splice(index,1)
                this.selectedCategories.splice(index,1)
                this.selectedChartTypeList.splice(index,1)
                // 在各种辅助数组里删除图表信息
                this.updateAll()
                // 删除某张图表可能改变图表顺序与布局，因此更新所有图表
            },
            barLikeSeriesTurnFalse(index){
                for(let i = 0; i < this.barLikeSeriesChosen[index].length; i++){
                    this.barLikeSeriesChosen[index][i].state = false
                }
            },
            // 把barLikeSeries中所有的state变成false，模拟任何y轴数据都未选中
            updateCategory(xname){
                if(this.selectedChartOption.series){
                    for(let i = 0; i< this.selectedChartOption.series.length;i++){
                        this.selectedChartOption.series[i].encode.x = xname
                    }
                    this.selectedChartOption.xAxis.name = xname
                }
                this.updateChartData()
            },
            // 更新非pie图选中的x轴数据
            nameSelected(xname,yname){
            // 配合多选按钮实现某种serie的增添与删除
                const state=this.barLikeSeriesChosen[this.selectedChartIndex].find(item => item.name === yname).state
                // 找到指定y轴数据对应的状态
                if(state){
                    this.deleteBarLikeSerie(this.selectedChartOption,xname,yname)
                    this.barLikeSeriesChosen[this.selectedChartIndex].find(item => item.name === yname).state = false
                    // 已选中，则删除
                }
                else{
                    this.addBarLikeSerie(this.selectedChartOption,this.selectedChartType,xname,yname)
                    this.barLikeSeriesChosen[this.selectedChartIndex].find(item => item.name === yname).state = true
                    // 未删除，则选中
                }
                this.updateChartData()
            },
            pieChartSelected(){
            // 饼图初始化
                if(this.selectedChartNum>0){
                    if(this.selectedChartType !== 'pie'){
                    // 只有之前非饼图时触发初始化与更新
                        this.destroySeries(this.selectedChartOption)
                        // 清空series
                        this.addPieSerie(this.selectedChartOption)
                        // 添加空serie
                        delete this.selectedChartOption.symbolSize
                        this.selectedChartOption.tooltip.trigger='item'
                        this.selectedChartOption.legend.left='right'
                        delete this.selectedChartOption.legend.bottom
                        this.selectedChartOption.legend.orient='vertical'
                        delete this.selectedChartOption.xAxis
                        delete this.selectedChartOption.yAxis
                        delete this.selectedChartOption.ytype
                        this.selectedChartOption.dataMethod = 'Default'
                        // 添加独有参数，删去不必要参数
                        this.selectedChartTypeList[this.selectedChartIndex] = 'pie'
                        this.barLikeSeriesTurnFalse(this.selectedChartIndex)
                        // 取消非pie图已选中的y轴数据
                        this.selectedCategories[this.selectedChartIndex]=''
                        // 饼图没有x轴
                        this.selectedChartOption.toolbox = {
                            show: true,
                            feature: {
                                dataView: { show: true, readOnly: false },
                                magicType: { show: false},
                                restore: { show: false },
                                saveAsImage: { show: true }
                            },
                            left:'45%'
                        }
                        this.selectedChartOption.invert = false
                        this.updateChartData()
                    }
                }

            },
            barChartSelected(){
            // 柱形图初始化
                if(this.selectedChartNum>0){
                    if(this.selectedChartType !== 'bar'){
                        this.destroySeries(this.selectedChartOption)
                        this.selectedChartOption.tooltip.trigger='axis'
                        this.selectedChartOption.xAxis={
                            type:'category',
                            inverse:false,
                            axisLabel:{
                                formatter: function (value) {
                                    if (typeof value === 'string') {
                                        // 如果值是字符串且能转换为日期，则尝试将值解释为日期
                                        const date = new Date(value);
                                        if (!isNaN(date.getTime())) {
                                            // 确保这是一个有效的日期
                                            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                        }
                                    }
                                    // 对于数字，执行数值格式化
                                    else if (typeof value === 'number') {
                                        return value >= 100000 ? value.toExponential(1) : value;
                                    }
                                    // 兜底返回原始值
                                    return value;
                                }
                            }
                        }
                        delete this.selectedChartOption.symbolSize
                        this.selectedChartOption.ytype = 'default'
                        this.selectedChartOption.yAxis=[{}]
                        this.selectedChartOption.legend.left='center'
                        this.selectedChartOption.legend.orient = 'horizontal'
                        this.selectedChartOption.legend.bottom = 10
                        this.selectedChartOption.dataMethod = 'Default'
                        this.selectedChartTypeList[this.selectedChartIndex]='bar'
                        this.barLikeSeriesTurnFalse(this.selectedChartIndex)
                        this.selectedCategories[this.selectedChartIndex]=''
                        this.selectedChartOption.toolbox = {
                            show: true,
                            feature: {
                                dataView: { show: true, readOnly: false },
                                magicType: { show: false},
                                restore: { show: false },
                                saveAsImage: { show: true }
                            }
                        }
                        this.selectedChartOption.invert = false
                        this.updateChartData()
                    }
                }
            },
            lineChartSelected(){
            // 折线图初始化
                if(this.selectedChartNum>0){
                    if(this.selectedChartType !== 'line'){
                        this.destroySeries(this.selectedChartOption)
                        this.selectedChartOption.tooltip.trigger='axis'
                        this.selectedChartOption.xAxis={
                            type:'category',
                            inverse:false,
                            axisLabel:{
                                formatter: function (value) {
                                    if (typeof value === 'string') {
                                        // 如果值是字符串且能转换为日期，则尝试将值解释为日期
                                        const date = new Date(value);
                                        if (!isNaN(date.getTime())) {
                                            // 确保这是一个有效的日期
                                            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                        }
                                    }
                                    // 对于数字，执行数值格式化
                                    else if (typeof value === 'number') {
                                        return value >= 100000 ? value.toExponential(1) : value;
                                    }
                                    // 兜底返回原始值
                                    return value;
                                }
                            }
                        }
                        delete this.selectedChartOption.symbolSize
                        this.selectedChartOption.yAxis=[{}]
                        this.selectedChartOption.ytype = 'default'
                        this.selectedChartOption.legend.left='center'
                        this.selectedChartOption.legend.bottom = 10
                        this.selectedChartOption.legend.orient = 'horizontal'
                        this.selectedChartOption.dataMethod = 'Default'
                        this.selectedChartTypeList[this.selectedChartIndex]='line'
                        this.barLikeSeriesTurnFalse(this.selectedChartIndex)
                        this.selectedCategories[this.selectedChartIndex]=''
                        this.selectedChartOption.toolbox = {
                            show: true,
                            feature: {
                                dataView: { show: true, readOnly: false },
                                magicType: { show: false},
                                restore: { show: false },
                                saveAsImage: { show: true }
                            }
                        }
                        this.selectedChartOption.invert = false
                        this.updateChartData()
                    }
                }

            },
            scatterChartSelected(){
            // 散点图初始化
                if(this.selectedChartNum>0){
                    if(this.selectedChartType !== 'scatter'){
                        this.destroySeries(this.selectedChartOption)
                        this.selectedChartOption.tooltip.trigger='item'
                        this.selectedChartOption.symbolSize = 10
                        this.selectedChartOption.xAxis={
                            type:'category',
                            inverse:false,
                            axisLabel:{
                                formatter: function (value) {
                                    if (typeof value === 'string') {
                                        // 如果值是字符串且能转换为日期，则尝试将值解释为日期
                                        const date = new Date(value);
                                        if (!isNaN(date.getTime())) {
                                            // 确保这是一个有效的日期
                                            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                        }
                                    }
                                    // 对于数字，执行数值格式化
                                    else if (typeof value === 'number') {
                                        return value >= 100000 ? value.toExponential(1) : value;
                                    }
                                    // 兜底返回原始值
                                    return value;
                                }
                            }
                        }
                        this.selectedChartOption.yAxis=[{}]
                        this.selectedChartOption.ytype = 'default'
                        this.selectedChartOption.legend.left='center'
                        this.selectedChartOption.legend.bottom = 10
                        this.selectedChartOption.legend.orient = 'horizontal'
                        this.selectedChartOption.dataMethod = 'Default'
                        this.selectedChartTypeList[this.selectedChartIndex]='scatter'
                        this.barLikeSeriesTurnFalse(this.selectedChartIndex)
                        this.selectedCategories[this.selectedChartIndex]=''
                        this.selectedChartOption.toolbox = {
                            show: true,
                            feature: {
                                dataView: { show: true, readOnly: false },
                                magicType: { show: false},
                                restore: { show: false },
                                saveAsImage: { show: true }
                            }
                        }
                        this.selectedChartOption.invert = false
                        this.updateChartData()
                    }
                }
            },
            // 改变当前选中的图表的种类
            addChart(){
            //添加一个图表，添加一些公用的基本参数
                if(this.selectedFileUid==0){
                    this.$message.warning(`请先选中文件！`);
                }
                else{
                    if(this.chartNumList.length === 6){
                        this.$message.warning(`页面被塞满啦，删除一些图表吧~`);
                        return
                    }
                    this.chartNumList.push(this.chartNumList.length+1)
                    // 在chartNumList中添加
                    let newChartOption=
                    {
                        invert:false,
                        group:this.selectedFileUid.toString(),
                        dataMethod:'Default',
                        title: {
                            text: '',
                            left: 'left',
                        },
                        tooltip: {
                            trigger:''
                        },
                        legend: {
                            left: 'center',
                            orient: 'vertical',
                        },
                        dataset:{
                            source:[
                                []
                            ]
                        },
                        series: [
                            {
                                type:'',
                                encode: {
                                    itemName: '',
                                    value: '',
                                    x: '',
                                    y: ''
                                },
                                name:''
                            }
                        ],
                    }
                    this.selectedChartNum = this.chartNumList.length
                    // 必须先改变selectedChartNum再改变selectedChartTypeList
                    // 这里设置添加后即选中这张图表
                    this.selectedChartTypeList[this.selectedChartIndex]=''
                    // 设置其种类未知
                    newChartOption.dataset=this.fileDataset
                    // 传入当前文件数据
                    this.chartOptionList.push(newChartOption)
                    //在chartOptionList中添加
                    let newBarLikeSerie = [];
                    for (let i = 0; i < this.fileDataset.source[0].length; i++) {
                        newBarLikeSerie[i] = {
                            name:  this.fileDataset.source[0][i],
                            state: false
                        };
                    }
                    this.barLikeSeriesChosen.push(newBarLikeSerie)
                    // 添加预备的辅助数组
                    this.selectedCategories.push('')
                    // x轴未选中，置空
                    this.updateAll()
                    this.$message.success('根据文件 '+this.fileList.find(item=>item.uid===this.selectedFileUid).name+' 生成视图 :)')
                }
            },
            updateAll(){
                this.$emit('updateAll',this.chartOptionList, this.selectedChartIndex)
            },
            // 发送事件更新所有图表
            updateChartData(){
                if(!this.selectedChartOption.series[0] || (this.selectedChartOption.series[0].encode.y === '' && this.selectedChartOption.series[0].encode.value === '') ){
                    this.selectedChartOption.dataset = this.fileDataset
                    // 不符合数据处理要求，数据取当前文件数据
                }
                else{
                    this.selectedChartOption.dataset=dataProcessMethod.dataProcess(this.selectedChartOption.series, this.fileDataset, this.selectedChartOption.dataMethod)
                    // 进行数据处理
                }
                if(this.selectedChartTypeList[this.selectedChartIndex] !== 'pie'){
                    // 对于非饼图，要依据得到更新的dataset更新它们的辅助数组
                    this.barLikeSeriesChosen[this.selectedChartIndex]=[]
                    for(let i = 0; i < this.selectedChartOption.dataset.source[0].length ; i++){
                        this.barLikeSeriesChosen[this.selectedChartIndex].push({
                            name: this.selectedChartOption.dataset.source[0][i],
                            state: false
                        })
                    }
                    for(let i = 0; i < this.selectedChartOption.series.length ; i++){
                        this.barLikeSeriesChosen[this.selectedChartIndex].find(item => item.name === this.selectedChartOption.series[i].encode.y).state = true
                    }
                    if(this.selectedChartOption.yAxis){
                        if(this.selectedChartOption.series.length == 2){
                            this.selectedChartOption.yAxis[0].name = this.selectedChartOption.series[0].encode.y
                            this.selectedChartOption.yAxis[1].name = this.selectedChartOption.series[1].encode.y
                        }
                        else if(this.selectedChartOption.series.length == 1){
                            this.selectedChartOption.yAxis[0].name = this.selectedChartOption.series[0].encode.y
                        }
                    }
                }
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
            },
            // 选中图表的index
            selectedChartType(){
                return this.selectedChartNum > 0 ? this.selectedChartTypeList[this.selectedChartIndex] : ''
            },
            // 选中图表的类型
            selectedChartOption(){
                return this.selectedChartNum > 0 ? this.chartOptionList[this.selectedChartIndex] : {}
            }
            // 选中图表的option
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