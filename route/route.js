//这里配置路由表
const express = require('express')
const fs = require('fs')
const router = express.Router()
const template = require('art-template')
const db = require('../db/mysql')


function formatData(list,page){
    let maxPage = 1;
    if(list.length % 10 == 0){
        maxPage = parseInt(list.length / 10)
    }else{
        maxPage = parseInt(list.length / 10) + 1;
    }
    if(page > maxPage){
        page = maxPage
    }
    let Info = []
    let tempObject = {}
    let tempurl = []
    let url = []
    let InfoOfpage = []
    let urlOfpage = []
    let index = 0;
    while(index < list.length){
        tempObject = {}
        tempObject.package = list[index].package
        tempObject.class = list[index].class
        tempObject.method = list[index].method
        tempObject.type = list[index].type
        tempObject.count = list[index].count
        tempObject.begin = list[index].begin
        tempObject.end = list[index].end
        tempObject.code1 = list[index].context
        tempObject.code2 = list[index+1].context
        tempObject.code3 = list[index+2].context
        tempObject.code4 = list[index+3].context
        tempObject.code5 = list[index+4].context
        InfoOfpage.push(tempObject)
        tempurl = []
        tempurl.push(list[index].url)
        tempurl.push(list[index+1].url)
        tempurl.push(list[index+2].url)
        tempurl.push(list[index+3].url)
        tempurl.push(list[index+4].url)
        urlOfpage.push(tempurl)
        index = index + 5
    }
    //分页逻辑处理
    let tempImgData = []
    for (let i = 0; i < InfoOfpage.length;i++){
        if((i >= (page-1)*2) && (i <= (page-1)*2 + 1)){
            let tempData = {}
            tempData.begin = InfoOfpage[i].begin
            tempData.type = InfoOfpage[i].type
            tempData.end = InfoOfpage[i].end
            tempImgData.push(tempData)
            Info.push(InfoOfpage[i])
            url.push(urlOfpage[i])
        }
    }
    let pageInfo = {page,maxPage}
    let imgData = { tempImgData }
    return {Info , url, pageInfo, imgData}
}


router.get('/api',(req,res)=>{
    if (req.query.value == null){
        res.redirect('/')
    }
    let page = 1;
    if(req.query.page == null){
        page = 1;
    }else{
        page = parseInt(req.query.page)
    }
    let type = req.query.type
    let api = req.query.value.split('.')
    let Method = null
    let Class = null
    let Package = null
    switch (api.length) {
        case 0:
            break;
        case 1:
            Method = api[0]
            break;
        case 2:
            Method = api[1]
            Class = api[0]
            break;
        case 3:
            Method = api[2]
            Class = api[1]
            Package = api[0]
            break;
        default:
            Package = ""
            for(let i = 0;i < api.length; i++){
                if(i == api.length - 1){
                    Method = api[i]
                }else if (i == api.length - 2) {
                    Class = api[i]
                }else if (i == api.length - 3) {
                    Package = Package + api[i]
                }else{
                    Package = Package + api[i] + '.'
                }
            }
            break;
    }
    db.getDataByName(Method,Class,Package,type,(list) => {
        fs.readFile('./front/index.html', 'utf8', (err, data) => {
            if (err) return console.log(err)
            const html = template.render(data, formatData(list,page))
            res.send(html)
        })
    })
})

router.get('/',(req,res)=>{
    let page = 1;
    if (req.query.page == null) {
        page = 1;
    } else {
        page = parseInt(req.query.page)
    }
    db.getAllData((list)=>{
        fs.readFile('./front/index.html', 'utf8', (err, data) => {
            if (err) return console.log(err)
            const html = template.render(data,formatData(list,page))
            res.send(html)
        })
    })
})

router.get('/tag', (req, res) => {
    if(req.query.tag == null){
        res.redirect('/')
    }
    let page = 1;
    if (req.query.page == null) {
        page = 1;
    } else {
        page = parseInt(req.query.page)
    }
    db.getDataBytag(req.query.tag,(list) => {
        fs.readFile('./front/index.html', 'utf8', (err, data) => {
            if (err) return console.log(err)
            const html = template.render(data, formatData(list,page))
            res.send(html)
        })
    })
})

module.exports = router
