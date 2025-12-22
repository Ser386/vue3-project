import type{Ref} from 'vue'
import{debounce} from 'lodash-es'

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
   fontFamily:"Arial, sans-serif",
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
    parentelResizeObserver?:ResizeObserver
}
// body元素
const bodyEl=ref<HTMLElement>(document.body)

