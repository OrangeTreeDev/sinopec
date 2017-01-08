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
function mockrequest(targetUrl, resCallback, req, res, isSms){

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

    // 发送短信的时候 ，不需要发送身份信息，服务器会返回sessionid
    if ( !isSms && session){
        headers["Cookie"] = session;
        console.log('cookie:' + session);
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
            res.writeHead(200, response.headers);
            res.end( result );
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
    }, req, res, true);
});

/* 油卡查询 */
app.post('/api/querycardinfo', function(req, res){

    mockrequest('http://www.sinopecsales.com/gas/html/netRechargeAction_queryCardInfo.json', null, req, res);
});

/* 获取随机验证码 */
app.get('/api/captcha', function(req, res){

    var targetUrl = 'http://www.sinopecsales.com/gas/YanZhengMaServlet';
    var headers = {
            "Accept":'Accept:image/webp,image',
            "Accept-Encoding":'gzip, deflate, sdch',
            "Accept-Language":'zh-CN,zh;q=0.8',
            "Connection":'keep-alive',
            "Host":'www.sinopecsales.com',
            "Origin":'http://www.sinopecsales.com',
            "Referer":'http://www.sinopecsales.com/gas/html/billQueryAction_goChangeCard.action',
            "User-Agen":'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            "X-Requested-With":'XMLHttpRequest'
    };


    console.log('query:' + Object.keys(req.query)[0]) ;
    if (session){
        headers["Cookie"] = session;
    }

    var opt = {
        host: url.parse(targetUrl).host,
        path: url.parse(targetUrl).path +"?"+Object.keys(req.query)[0] ,
        method:'GET',
        headers: headers
    };

    var httprequest = http.request( opt, function(response){

        response.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

        var rawData = '';
        response.on('data', function(chunk){

            rawData += chunk;
        }).on('end', function(chunk){

            //返回结果
            res.writeHead(200, {
                "Content-Type": response.headers['content-type'],
                "Expires": response.headers['expires'],
                "Cache-Control": 'no-cache',
                "Pragma":'No-cache'
            });
            res.end(new Buffer(rawData, 'binary'));
        //    res.write(rawData, 'binary'); 加载缓慢
        });
    }).on('error', function(err){

        console.log('request error: ' + err);
    });
    httprequest.end();
});


/* 油卡充值 */
app.post('/api/czkcharge', function(req, res){

    mockrequest('http://www.sinopecsales.com/gas/html/netRechargeAction_czkCharge.json', null, req, res);
});

/* 查询充值订单号 */
app.post('api/selectcardorder', function(req, res){

    mockrequest('http://www.sinopecsales.com/gas/html/netRechargeAction_selectCardOrder.json', null, req, res);
});

/* 查询充值金额 */
app.post('api/getcardinfo', function(req, res){

    mockrequest('http://www.sinopecsales.com/gas/html/netRechargeAction_getCardInfo.json', null, req, res);
});

var server = app.listen('3000', function(){

    var host = server.address().address;
    var port = server.address().port;

    console.log('sinopec mock api app is listening at http://%s:%s', host, port);
});