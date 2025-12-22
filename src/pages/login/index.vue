<script lang="ts" setup>

import { Key, Loading, Lock, Picture, User } from "@element-plus/icons-vue"
import { useFocus } from "./composables/useFocus"
import { getCaptchaApi,loginApi } from "./apis"
import type { LoginRequestData } from "./apis/type"
import type { FormRules } from "element-plus"
 
const {isFocus,handleBlur,handleFocus} = useFocus()
// 登录按钮加载状态
const loading=ref(false)
// 验证码图片url
const codeUrl=ref("")
// 创建验证码
function createCode(){
    // 清空已输入的验证码
    loginFormData.code=""
    // 清空验证图片
    codeUrl.value=""
    // 获取验证码图片
    getCaptchaApi().then((res)=>{
        codeUrl.value=res.data
    })
}
// 页面加载的时候调用一次createCode
createCode()

const loginFormData:LoginRequestData=reactive({
    username:'admin',
    password:"12345678",
    code:""
})
const loginFormRules:FormRules={
    username:[
        // trigger:"blur" 失去焦点时触发校验
        {required:true,message:"请输入用户名",trigger:"blur"}
    ],
    password:[
        {required:true,message:"请输入密码",trigger:"blur"}
    ],
    code:[
        {required:true,message:"请输入验证码",trigger:"blur"}
    ]
}
const loginFormRef = useTemplateRef("loginFormRef") 
function handleLogin(){
    // 先校验表单
    loginFormRef.value?.validate((valid:boolean)=>{
        if(!valid){
            ElMessage.error("表单校验不通过")
            return
        }
        loading.value=true; //加载中按钮
        loginApi(loginFormData).then({data})=>{
            
        }
    })
}
</script>
<template>
    <div class="login-container">
        <div class="login-card">
            <div class="title">
                <img src=""></img>
            </div>
            <div class="content">
                <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" @keyup.enter="handleLogin">
                    <el-form-item prop="username">
                        <!-- 按 Tab 键时，焦点会按照 tabindex 的数值从小到大依次聚焦 -->
                        <el-input v-model.trim="loginFormData.username"
                        placeholder="用户名"
                        type="text"
                        tabindex="1"
                        :prefix-icon="User"
                        size="large"/>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model.trim="loginFormData.password"
                        placeholder="密码"
                        type="password"
                        tabindex="2"
                        :prefix-icon="Lock"
                        size="large"
                        show-password
                        @blur="handleBlur"
                        @focus="handleFocus"/>
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-input v-model.trim="loginFormData.code"
                        placeholder="验证码"
                        type="text"
                        tabindex="3"
                        :prefix-icon="Key"
                        maxlength="7"
                        size="large"
                        @blur="handleBlur"
                        @focus="handleFocus">
                            <!-- 验证码右侧图片,使用#append插槽 -->
                             <template #append>
                                <!-- codeUrl:绑定验证码图片的 URL; draggable="false" 禁止图片被拖拽-->
                                <el-image :src="codeUrl" draggable="false" @click="createCode">
                                    <!-- 图片加载中 插槽-->
                                     <template #placeholder>
                                        <el-icon><Picture/></el-icon>
                                     </template>
                                     <!-- 图片加载失败 -->
                                      <template #error>
                                        <el-icon><Loading/></el-icon>
                                      </template>
                                </el-image>
                             </template>
                        </el-input>
                    </el-form-item>
                    <!-- 登录按钮 -->
                     <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">
                        登录
                     </el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>
<style>
</style>