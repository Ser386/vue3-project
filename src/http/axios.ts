// 导入axios定义的类型或接口 
// AxiosInstance 用于描述 axios 实例的类型（即通过 axios.create() 创建的实例的类型)
// AxiosRequestConfig 用于描述 axios 请求的配置项类型（即发起请求时传入的配置对象的类型）
import type { AxiosInstance, AxiosRequestConfig } from "axios"
import {get,merge} from 'lodash-es'
import { getToken } from "@@/utils/cache/cookies"
import axios from "axios"



// 创建请求方法
// 定义了一套通用的请求规则（比如接口地址、请求头、超时时间），
// 所有通过这个方法创建的请求都会默认带上这些配置，不用每次发请求都重复写
function createRequest(instance:AxiosInstance){
    // 返回的是一个函数,是一个带泛型的箭头函数
    // 需要传入一个类型T和符合axios格式的请求配置
    // 最后返回一个Promise,里面的数据类型是T
    return <T>(config:AxiosRequestConfig):Promise<T> =>{
        const token=getToken()
        // 默认配置
         const defaultConfig :AxiosRequestConfig={
            // 接口地址
            baseURL:import.meta.env.VITE_BASE_URL,
            // 请求头
            headers:{
                // 携带token
                "Authorization":token ? `Bearer ${token}`: undefined,
                "Content-Type": "application/json"
            },
            // 请求体
            data:{},
            // 请求超时
            timeout:5000,
            // 跨域请求时是否携带cookies
            withCredentials:false
         }
        //  将默认配置defaultConfig和传入的自定义配置config合并
        const mergeConfig = merge(defaultConfig,config)
        // 返回的是Axios 完整响应对象（包含 data、status 等)
        return instance(mergeConfig)
        
    }
}

// 退出登录并刷新页面
function logout(){

}

// 创建请求实例
function createInstance(){
    // 创建一个axios实例命名为instance
    const instance = axios.create() 
    // 请求拦截器
    instance.interceptors.request.use(
        // 发送之前
        config =>config,
        // 发送失败
        error=>Promise.reject(error)
    )
    // 响应拦截器
    instance.interceptors.response.use(
        // 响应成功的逻辑
        (response)=>{
            // api返回的数据
            const apiData=response.data
            // 二进制数据(比如文件下载)则直接返回
            const responseType = response.config.responseType
            if(responseType === "blob" || responseType === "arraybuffer") return apiData
            const code=apiData.code
            if(code === undefined){
                ElMessage.error("非本系统的接口")
                return Promise.reject(new Error("非本系统的接口"))
            }
            switch(code){
                case 0:
                    // code=0时表示没有错误
                    return apiData
                case 401:
                    // token过期时
                    return logout()
                default:
                    // 其他业务错误,比如不是正确的code
                    ElMessage.error(apiData.message || "Error")
                    return Promise.reject(new Error("Error"))
            }
        },
        // 响应失败的逻辑
        (error)=>{
            // status是http状态码
            const status =get(error,"response.status")
            const message=get(error,"response.data.message")
            switch(status){
                case 400:
                    error.message = "请求错误"
                    break
                  case 401:
                    // Token 过期时
                    error.message = message || "未授权"
                    logout()
                    break
                  case 403:
                    error.message = message || "拒绝访问"
                    break
                  case 404:
                    error.message = "请求地址出错"
                    break
                  case 408:
                    error.message = "请求超时"
                    break
                  case 500:
                    error.message = "服务器内部错误"
                    break
                  case 501:
                    error.message = "服务未实现"
                    break
                  case 502:
                    error.message = "网关错误"
                    break
                  case 503:
                    error.message = "服务不可用"
                    break
                  case 504:
                    error.message = "网关超时"
                    break
                  case 505:
                    error.message = "HTTP 版本不受支持"
                    break                
            }
            ElMessage.error(error.message)
            return Promise.reject(error)
        }
    )
    return instance
}
// 用于请求的实例
const instance = createInstance()
// 用于请求的方法
export const request =createRequest(instance)