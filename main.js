//导入框架
const express = require('express')
//引用路由表
const router = require('./route/route')
//创建服务
const app = express()
//处理各种情况

app.use('/assets', express.static('./front/assets'))
app.use(router)

//监听端口
app.listen(80,() => {
    console.log('80启动')
})
