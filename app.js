/**
 * Created by Weber on 2017/1/6.
 */

var express = require('express');
var http =require('http');
var url = require('url');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var app = express();

app.use('/static', express.static('public'));// 静态文件
app.use( bodyParser());// body 分析

// 首页测试
app.get('/', function(req, res){
    res.send('Hello world!');
});

var session;
function mockrequest(targetUrl, resCallback, req, res){

    var querybody = querystring.stringify(req.body);
    var headers = {
        "Accept":'application/json, text/javascript',
            "Accept-Encoding":'gzip, deflate',
            "Accept-Language":'zh-CN,zh;q=0.8',
            "Connection":'keep-alive',
            "Content-Length":querybody.length,
            "Content-Type":'application/x-www-form-urlencoded; charset=UTF-8',
            "Host":'www.sinopecsales.com',
            "Origin":'http://www.sinopecsales.com',
            "Referer":'http://www.sinopecsales.com/gas/html/billQueryAction_goChangeCard.action',
            "User-Agen":'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            "X-Requested-With":'XMLHttpRequest'
    };

    if ( session){
        headers["Cookie"] = session;
    }

    var opt = {
        host: url.parse(targetUrl).host,
        path: url.parse(targetUrl).path,
        method:'POST',
        headers: headers
    };

    var httprequest = http.request( opt, function(response){

        if (resCallback){
            resCallback(response);
        }

        var result = '';
        response.on('data', function(chunk){

            result += chunk;
        }).on('end', function(chunk){

            //返回结果
            console.log('end:' + result);
            res.send( result );
        });
    }).on('error', function(err){

        console.log('request error: ' + err);
    });

    console.log('send body:'+ querybody);
    httprequest.write(querybody);
    httprequest.end();
}

/* 短信验证码 */
app.post('/api/getsmsyzm', function(req ,res){

    mockrequest('http://www.sinopecsales.com/gas/html/netRechargeAction_getSmsYzm.json', function(response){
        // 存储session
        session = response.headers['set-cookie'];
        console.log('cookie: '+ session);
    }, req, res);
});

/* 油卡查询 */
app.post('/api/querycardinfo', function(req, res){

    mockrequest('http://www.sinopecsales.com/gas/html/netRechargeAction_queryCardInfo.json', null, req, res);
});

///* 获取随机验证码 */
//app.post('/api/captcha', function(req, res){
//
//    mockrequest('http://www.sinopecsales.com/gas/html/netRechargeAction_queryCardInfo.json', null, req, res);
//});


/* 油卡充值 */
app.post('/api/czkcharge', function(req, res){

    mockrequest('http://www.sinopecsales.com/gas/html/netRechargeAction_czkCharge.json', null, req, res);
});

var server = app.listen('3000', function(){

    var host = server.address().address;
    var port = server.address().port;

    console.log('sinopec mock api app is listening at http://%s:%s', host, port);
});