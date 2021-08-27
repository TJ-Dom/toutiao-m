// 1. 引入功能包
import dayjs from 'dayjs'
// 2. 语言中文化  默认英文
// 2.1 引入中文包
import 'dayjs/locale/zh-cn' // 全局使用
// 3. 在main.js全局加载引入使用 =>main.js

// 4.1 引入插件RelativeTime
// var relativeTime = require('dayjs/plugin/relativeTime')
import relativeTime from 'dayjs/plugin/relativeTime'
import Vue from 'vue'
// 2.2 配置为中文版
dayjs.locale('zh-cn') // 全局使用中文化

// 4.2 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 定义一个全局过滤器，全局使用
// 参数1:过滤器名字
// 参数2:过滤器函数
// 使用：{{表达式 ｜ 过滤器名称}}
Vue.filter('relativeTime', (value) => dayjs().to(dayjs(value)))

// dayjs().toNow()
// dayjs().format()
