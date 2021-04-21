var mysql = require('mysql')
const db = {}
db.connection = mysql.createConnection({
    host: 'x.x.x.x',
    user: 'xxxx',
    password: 'xxxxxxxx',
    database: 'xxxxx'
})

db.connection.connect()


db.getDataByName = function(Method,Class,Package,type,callback){
    if(Method == null){
        return null
    }
    Method = 'apiInfo.method = \'' + Method + '\' and'
    if(Class == null){
        Class = ""
    }else{
        Class = 'apiInfo.class =\'' + Class + '\' and'
    }
    if(Package == null){
        Package = ""
    }else{
        Package = 'apiInfo.package = \'' + Package + '\' and'
    }
    if(type == null){
        type = ""
    }else{
        type = 'apiInfo.type = \'' + type + '\' and'
    }
    this.connection.query(`select package,class,method,type,count,begin,end,context,url from apiCode,apiInfo
                             where
                              ${Method}
                              ${Class}
                              ${Package}
                              ${type}
                              apiInfo.apiId = apiCode.apiId`,
                               function (err, rows, fields) {
        if(err){
            throw err
        }else{
            callback(rows)
        }
    })
}

db.getDataBytag = function (tag,callback) {
    if (tag == null) {
        return null
    }
    tag = 'apiInfo.type = \'' + tag + '\' and'
    this.connection.query(`select package,class,method,type,count,begin,end,context,url from apiCode,apiInfo
                             where
                              ${tag}
                              apiInfo.apiId = apiCode.apiId
                              order by apiCode.codeId`,
        function (err, rows, fields) {
            if (err) {
                throw err
            } else {
                callback(rows)
            }
        })
}

db.getAllData = function(callback){
    this.connection.query(`select package,class,method,type,count,begin,end,context,url from apiCode,apiInfo
                             where
                              apiInfo.apiId = apiCode.apiId
                              order by apiCode.codeId`,
        function (err, rows, fields) {
            if (err) {
                throw err
            } else {
                callback(rows)
            }
        })
}


module.exports = db
