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
                    <el-menu-item
                        v-for="chartNum of chartNumList"
                        :key="chartNum.id"
                        @click="changeSelectedChartNum(chartNum)"
                        :class="{'selected':selectedChartNum===chartNum}">
                        <span v-if="chartOptionList[chartNum-1].title.text===''">
                            视图{{ chartNum }}
                        </span>
                        <span v-else>
                            {{ chartOptionList[chartNum-1].title.text }}
                        </span>
                        <span style="width: 100px;">
                        </span>
                        <span>
                            <el-icon
                            @click="deleteChart(chartNum-1)"
                            class="deleteicon el-icon--right">
                                <circle-close></circle-close>
                            </el-icon>
                        </span>
                    </el-menu-item>
                    <el-menu-item
                        class="mybutton"
                        @click="addChart"
                    >
                        添加视图
                    </el-menu-item>
                </el-sub-menu>
                <!-- 选择视图 -->

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
                </el-sub-menu>
                <!-- 选择视图类型 -->
                <el-sub-menu index="4" v-if="selectedChartNum>0">
                    <template #title>
                        可选绘图参数
                    </template>
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
                                    v-for="keyword in dataSet.source[0]"
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
                                    v-for="keyword in dataSet.source[0]"
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
                chartNumList:[],
                //chartNumList内的元素从1开始
                selectedChartType:'pie',
                dataSet:{
                    source:[
                        ['score', 'amount', 'product'],
                        [89.3, 58212, 'Matcha Latte'],
                        [57.1, 78254, 'Milk Tea'],
                        [74.4, 41032, 'Cheese Cocoa'],
                        [50.1, 12755, 'Cheese Brownie'],
                        [89.7, 20145, 'Matcha Cocoa'],
                        [68.1, 79146, 'Tea'],
                        [19.6, 91852, 'Orange Juice'],
                        [10.6, 101852, 'Lemon Juice'],
                        [32.7, 20112, 'Walnut Brownie']
                    ]
                },
                chartOptionList:[
                    {
                        title:{
                            text:'',
                            left:'center'
                        },
                        tooltip:{
                            trigger:'item'
                        },
                        legend:{
                            left:'right',
                            orient:'vertical',
                        },
                        dataset:{
                            source:[
                                ['score', 'amount', 'product'],
                                [89.3, 58212, 'Matcha Latte'],
                                [57.1, 78254, 'Milk Tea'],
                                [74.4, 41032, 'Cheese Cocoa'],
                                [50.1, 12755, 'Cheese Brownie'],
                                [89.7, 20145, 'Matcha Cocoa'],
                                [68.1, 79146, 'Tea'],
                                [19.6, 91852, 'Orange Juice'],
                                [10.6, 101852, 'Lemon Juice'],
                                [32.7, 20112, 'Walnut Brownie']
                            ]
                        },
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
            }
        },
        methods: {
            changeSelectedChartNum(num){
                this.selectedChartNum = num
            },
            selectChart(idSelected){
                this.selectedChartNum=idSelected
            },
            // 选图表事件
            deleteChart(index){
                this.chartNumList.splice(index,1)
                for(let i = index ; i< this.chartNumList.length;i++){
                    this.chartNumList[i]--
                }
                this.chartOptionList.splice(index,1)
            },

            pieChartSelected(){
                this.selectedChartType='pie'
                //this.$emit('setChartType','pie')
            },
            barChartSelected(){
                this.selectedChartType='bar'
                // this.$emit('setChartType','bar')
            },
            lineChartSelected(){
                this.selectedChartType='line'
                // this.$emit('setChartType','line')
            },
            scatterChartSelected(){
                this.selectedChartType='scatter'
                // this.$emit('setChartType','scatter')
            },
            mapChartSelected(){
                this.selectedChartType='map'
                // this.$emit('setChartType','map')
            },
            // 选图表类型事件
            addChart(){
                let newPieChartOption = {
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
                            itemName: '', // 假设 source 数组的第一个元素是类别名
                            value: '',    // 假设 source 数组的第二个元素是值
                            x: '',
                            y: ''
                        }
                    }
                };
                newPieChartOption.dataset=this.dataSet
                this.chartOptionList.push(newPieChartOption)
                if(this.chartNumList.length > 0){
                    this.chartNumList.push(this.chartNumList[this.chartNumList.length-1]+1)
                }
                else{
                    this.chartNumList = [1]
                }

            },
            updateChartData(){
                this.$emit('updateChart', this.chartOptionList)
            }
        },
        props:{
            darkMode:Boolean
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