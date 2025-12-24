// 后端登录接口请求
import * as Auth from "./type" //导入type文件中定义的接口,不导入具体的函数和变量

import{request} from '@/http/axios'

// 获取登录验证码
export function getCaptchaApi(){
    return request<Auth.CaptchaResponseData>({
        url:"auth/captcha",
        method:"get"
    })

}
export function loginApi(data:Auth.LoginRequestData){
    return request<Auth.LoginResponseData>({
        url:'auth/login',
        method:"post",
        data
    })
}
