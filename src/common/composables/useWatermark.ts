import type{Ref} from 'vue'
import{debounce, merge} from 'lodash-es'
import { fa, pa } from 'element-plus/es/locales.mjs'

// 水印的默认配置
const DEFAULT_CONFIG={
    // 防御 默认开启，防止水印被删除或隐藏
    defense:true,
    // 水印颜色
    color:"red",
    // 文本透明度
    opacity:0.5,
    // 水印字体大小
   size:16,
    //    水印字体
   family:"Arial, sans-serif",
    //    文本倾斜角度
    angle:-20,
    // 一处水印所占的宽度
    width:300,
    // 一处水印所占高度
    height:200

}
type DefaultConfig=typeof DEFAULT_CONFIG

interface Observer{
    watermarkElMutationObserver?:MutationObserver
    parentElMutationObserver?:MutationObserver
    parentElResizeObserver?:ResizeObserver
}
// body元素
const bodyEl=ref<HTMLElement>(document.body)

export function useWatermark(parentEl:Ref<HTMLElement|null>=bodyEl){
    // 备份文本
    let backupText:string
    // 最终配置
    let mergeConfig:DefaultConfig
    // 水印元素
    let watermarkEl:HTMLElement|null=null
    // 观察器
    const observer:Observer={
        watermarkElMutationObserver:undefined,
        parentElMutationObserver:undefined,
        parentElResizeObserver:undefined
    }
    // 设置水印
    const setWatermark=(text:string,config:Partial<DefaultConfig>={})=>{
        if(!parentEl.value) return console.warn("请在 DOM 挂载完成后再调用 setWatermark 方法设置水印")
        // 备份文本
        backupText=text
        // 合并配置
        mergeConfig={...DEFAULT_CONFIG, ...config}
        // 创建或更新水印元素
        watermarkEl?updateWatermarkEl():createWatermarkEl()
        // 监听水印元素和容器元素的变化
        addElListener(parentEl.value)
    }
    // 创建水印元素
    const createWatermarkEl=()=>{
        const isBody=parentEl.value!.tagName.toLowerCase()===bodyEl.value.tagName.toLowerCase()
        const watermarkElPosition=isBody?"fixed":"absolute"
        const parentElPosition=isBody?"":"relative"
        // 1 创建一个div元素
        watermarkEl=document.createElement("div")
        watermarkEl.style.pointerEvents="none"
        watermarkEl.style.top="0"
        watermarkEl.style.left="0"
        watermarkEl.style.position=watermarkElPosition
        watermarkEl.style.zIndex="99999"
        const{clientWidth,clientHeight}=parentEl.value!
        updateWatermarkEl({width:clientWidth,height:clientHeight})
        // 设置水印容器为相对定位
        parentEl.value!.style.position=parentElPosition
        // 将水印元素添加到水印容器中
        parentEl.value!.appendChild(watermarkEl)

    }
    // 更新水印元素
    const updateWatermarkEl=(
        options:Partial<{
            width:number
            height:number
        }>={}    
    )=>{
        if(!watermarkEl) return
        backupText && (watermarkEl.style.background=`url(${createBase64()}) left top repeat`)
        options.width && (watermarkEl.style.width=`${options.width}px`)
        options.height && (watermarkEl.style.height=`${options.height}px`)

    }
    // 创建水印的base64图片
    const createBase64=()=>{
    const { color, opacity, size, family, angle, width, height } = mergeConfig
    const canvasEl = document.createElement("canvas")
    canvasEl.width = width
    canvasEl.height = height
    const ctx = canvasEl.getContext("2d")
    if (ctx) {
      ctx.fillStyle = color
      ctx.globalAlpha = opacity
      ctx.font = `${size}px ${family}`
      ctx.rotate((Math.PI / 180) * angle)
      ctx.fillText(backupText, 0, height / 2)
    }
    return canvasEl.toDataURL()
    }
    // 清除水印
    const clearWatermark=()=>{
        if(!parentEl.value || !watermarkEl) return
        // 移除监听
        removeListener()
        // 移除水印元素
        try{
            parentEl.value.removeChild(watermarkEl)
        }catch(e){
            console.warn("水印元素不存在")
        }finally{
            watermarkEl=null
        }
    }
    // 刷新水印（防御时使用）
    const updateWatermark=debounce(()=>{
        clearWatermark()
        createWatermarkEl()
        addElListener(parentEl.value!)
    },100)
    // 监听水印元素和容器元素的变化
    const addElListener=(targetNode:HTMLElement)=>{
        // 判断是否开启防御
        if(mergeConfig.defense){
            // 防止重复添加监听
            if(!observer.watermarkElMutationObserver && !observer.parentElMutationObserver){
                // 监听DOM变化
                addMutationListener(targetNode)
            }
        }else{
            // 没有防御时不需要Mutation
            removeListener("mutation")
        }
        // 监听容器元素大小变化
        if(!observer.parentElResizeObserver){
            addResizeListener(targetNode)
        }
    }
    // 移除对水印元素和容器元素的监听
    const removeListener=(kind: "mutation" | "resize" | "all" = "all")=>{
        // 移除mutation监听
        if(kind==="all" || kind==="mutation"){
            observer.watermarkElMutationObserver?.disconnect()
            observer.watermarkElMutationObserver=undefined
            observer.parentElMutationObserver?.disconnect()
            observer.parentElMutationObserver=undefined
        }
        // 移除resize监听
        if(kind==="all" || kind==="resize"){
            observer.parentElResizeObserver?.disconnect()
            observer.parentElResizeObserver=undefined

        }
    }
    // 监听DOM变化
    const addMutationListener=(targetNode:HTMLElement)=>{
        //变化时执行的回调,mutationObserver每次触发时会返回一个变化列表mutationList
        const mutationCallback=debounce((mutationList:MutationRecord[])=>{
            mutationList.forEach(
                debounce((mutation:MutationRecord)=>{
                    switch(mutation.type){
                        // 样式/属性被改
                        case "attributes":
                            mutation.target===watermarkEl && updateWatermark()
                            break
                        // 节点被删除，使用append添加节点
                        case "childList":
                            mutation.removedNodes.forEach((item)=>{
                                item === watermarkEl && targetNode.appendChild(watermarkEl)
                            })
                            break
                    }
                },100)
            )
        },100)
        // 创建观察器实例并传入回调 分别监听水印自身和水印的父容器（防止父节点被清空）
        observer.watermarkElMutationObserver=new MutationObserver(mutationCallback)
        observer.parentElMutationObserver=new MutationObserver(mutationCallback)
        // 以上述配置观察目标节点
        observer.watermarkElMutationObserver.observe(watermarkEl!,{
            attributes:true,
            childList:false,
            subtree:false
        })
        observer.parentElMutationObserver.observe(targetNode,{
            attributes:false,
            childList:true,
            subtree:false

        })
    }
    // 监听容器元素大小变化
    const addResizeListener=(targetNode:HTMLElement)=>{
        //当targetNode元素大小变化时更新整个水印的大小
        const resizeCallback=debounce(()=>{
            const{clientWidth,clientHeight}=targetNode
            updateWatermarkEl({width:clientWidth,height:clientHeight})
        },500)
        // 创建一个观察期实例并传入回调
        observer.parentElResizeObserver=new ResizeObserver(resizeCallback)
        observer.parentElResizeObserver.observe(targetNode)
    }
    // 在组件卸载前移除水印以及各种监听
    onBeforeUnmount(()=>{
        clearWatermark()
    })
    return{setWatermark,clearWatermark}
}
