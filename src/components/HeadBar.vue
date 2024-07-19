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
    </el-container>

</template>
<script lang="ts" setup>
    import {ref} from 'vue'
    import {toggleDark} from './composables/dark'
    import {Sunny} from '@element-plus/icons-vue'
    import {Moon} from '@element-plus/icons-vue'
    import { DArrowRight } from '@element-plus/icons-vue'
    // 导入需要的图标
    const changeTheme = () => {
        toggleDark()
        darkmode.value = !darkmode.value
    }
    // 亮暗切换事件
    const darkmode = ref(false)
    // 记录亮暗变量，false为亮
</script>
