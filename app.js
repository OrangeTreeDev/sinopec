/**
 * Created by Weber on 2017/1/6.
 */

/* 模块 */
var express = require('express');
var http =require('http');
var url = require('url');
var querystring = require('querystring');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var utility = require('./utils.js');

/* 中间件 */
var bodyParser = require('body-parser');
var expresssession= require('express-session');

var app = express();

/* 使用中间件 */
app.use( bodyParser());// body 分析
app.use( expresssession({
    secret: utility.genRandomString(128)
}) );

app.use('/static', express.static('public'));// 静态文件

// 首页测试
app.get('/', function(req, res){

    // 检查 session 中的 isVisit 字段
    // 如果存在则增加一次，否则为 session 设置 isVisit 字段，并初始化为 1。
    //if(req.session.isVisit) {
    //    req.session.isVisit++;
    //    console.log('visit count:' + req.session.isVisit );
    //    res.send('<p>第 ' + req.session.isVisit + '次来此页面</p>');
    //} else {
    //    req.session.isVisit = 1;
    //    res.send("欢迎第一次来这里");
    //    console.log(req.session);
    //}

    console.log('first session id :' + req.sessionID);
    res.send('<p>第1页面</p>');

});

// 第二页测试
app.get('/second', function(req, res){

    console.log('second session id :' + req.sessionID);
    res.send('<p>第2页面</p>');
});

/* 发送 post请求 */
function mockrequest(targetUrl, req, res){
    console.log( url.parse(targetUrl).path + '\n' + 'request session id: ' + req.session.sinopecid);
    console.log( url.parse(targetUrl).path + '\n' + 'request body: ' + JSON.stringify(req.body));

    var querybody = querystring.stringify(req.body);
    var headers = {
         "Accept":'application/json, text/javascript, */*; q=0.01',
         "Accept-Encoding":'gzip, deflate',
         "Accept-Language":'zh-CN,zh;q=0.8,en;q=0.6',
         "Cache-Control":'no-cache',
         "Connection":'keep-alive',
         "Content-Type":'application/x-www-form-urlencoded; charset=UTF-8',
         "Host":'m.sinopecsales.com',
         "Origin":'http://m.sinopecsales.com',
         "Pragma":'no-cache',
         "Referer":'http://m.sinopecsales.com/webmobile/html/netRechargeAction_goCzkCharge.action',
         "User-Agent":'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
         "Content-Length":querybody.length,
         "Cookie": req.session.sinopecid
    };

    var opt = {
        host: url.parse(targetUrl).host,
        path: url.parse(targetUrl).path,
        method:'POST',
        headers: headers
    };

    var httprequest = http.request( opt, function(response){

        //response.setEncoding('binary');

        var arrBuf = new Array();
        var bufLenght = 0;
        response.on('data', function(chunk){

            arrBuf.push(chunk);
            bufLenght += chunk.length;
        }).on('end', function(){

            //返回结果
            var result = iconv.decode( Buffer.concat(arrBuf, bufLenght), 'gbk');
            console.log( url.parse(targetUrl).path + '\n' + 'response json: ' + result);
            result = iconv.encode(result, 'utf8');

            for( var key in response.headers){
                res.setHeader( key, response.headers[key]);
            }
            res.setHeader( 'content-type', 'application/json;charset=utf-8');
            res.setHeader( 'content-length', result.length );

            res.write(result);
            res.end();
        });
    }).on('error', function(err){

        console.log( url.parse(targetUrl).path + '\n' + 'request error: ' + err);
    });

    httprequest.write(querybody);
    httprequest.end();
}

/* 发送get 请求 */
function getcontent(targetUrl, callback){

    var headers = {
        "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        "Accept-Encoding":'deflate, sdch',
        "Accept-Language":'zh-CN,zh;q=0.8,en;q=0.6',
        "Cache-Control":'no-cache',
        "Connection":'keep-alive',
        "Host":'m.sinopecsales.com',
        "Pragma":'no-cache',
        "Upgrade-Insecure-Requests":'1',
        "User-Agent":'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
    };

    var opt = {
        host: url.parse(targetUrl).host,
        path: url.parse(targetUrl).path,
        method:'GET',
        headers: headers
    };

    var httprequest = http.request( opt, function(response){

        var result = '';
        response.on('data', function(chunk){

            result += chunk;
        }).on('end', function(chunk){

            callback(response, result);
        });
    }).on('error', function(err){

        console.log( url.parse(targetUrl).path + '\n' + 'request error: ' + err);
        callback(null);
    });
    httprequest.end();
}

/* 返回报错信息 */
function returnError(res, content){

   var result =  JSON.stringify( content );
    res.setHeader( 'Content-Type', 'application/json;charset=utf-8');
    res.write(result);
    res.end();
}

var chargePage_last = '';
function monitor(req, res){
    getcontent('http://m.sinopecsales.com/webmobile/html/netRechargeAction_goCzkCharge.action', function(clientRes, data){

        if (clientRes){

            $ = cheerio.load(data);
            var chargepagehtml = $('#start_charge .content').html();

            if( chargePage_last == ''){
                chargePage_last = chargepagehtml;
            }else {

                if (chargepagehtml != chargePage_last){
                    chargePage_last = chargepagehtml;
                    utility.sendmail('充值页面内容发生变化！');
                }else {
                    console.log('充值页面没有发生变化');
                }
            }

       }else {
            utility.sendmail('页面加载失败！');
       }
        res.write('正在监听...');
        res.end();
    });
}

/* 登陆 */
app.get('/api/login', function(req, res){

    getcontent('http://m.sinopecsales.com/webmobile/html/webhome.jsp', function(clientRes, data){

        if (clientRes){

            var sessionStr = clientRes.headers['set-cookie'][0].split(';')[0];
            var cookieStr = clientRes.headers['set-cookie'][1].split(';')[0];

            req.session.sinopecid = sessionStr + ';' + cookieStr;
            console.log('sinopec sinopecid ' + req.session.sinopecid );

            for( var key in clientRes.headers){
                res.setHeader( key, clientRes.headers[key]);
            }

            res.write(data);
            res.end();
        }else {
            data = { 'code':'300', 'msg': '石化网站加载失败' };
            data = JSON.stringify(data);
            res.setHeader( 'content-type', 'application/json;charset=utf-8');
            res.setHeader( 'content-length', data.length );
            res.write(data);
            res.end();
        }
    });
});

/* 获取图形验证码 */
app.get('/api/captcha', function(req, res){

    var targetUrl = 'http://m.sinopecsales.com/webmobile/YanZhengMaServlet';
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


    if (req.session.sinopecid){
        headers["Cookie"] = req.session.sinopecid;
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

        console.log(targetUrl.path + '\n' + 'request error: ' + err);
    });
    httprequest.end();
});

/* 短信验证码 */
app.post('/api/getsmsyzm', function(req ,res){

    var authenticated = signkeyVerify(req, res);
    if (!authenticated){
        return;
    }
    mockrequest('http://m.sinopecsales.com/webmobile/html/netRechargeAction_getSmsYzm.json', req, res);
});

/* 油卡查询 */
app.post('/api/querycardinfo', function(req, res){

    mockrequest('http://m.sinopecsales.com/webmobile/html/netRechargeAction_queryCardInfo.json', req, res);
});

/* 油卡充值 */
app.post('/api/czkcharge', function(req, res){

    mockrequest('http://m.sinopecsales.com/webmobile/html/netRechargeAction_webCzkCharge.json', req, res);
});

/* 查询充值订单号 */
app.post('/api/selectcardorder', function(req, res){
    mockrequest('http://m.sinopecsales.com/webmobile/html/netRechargeAction_selectCardOrder.json', req, res);
});


var keyPairs = [{
 'appkey': 'sinopec1',
    'signkey':'cb0cf1a21ded09f03bedf0aad51d19a305f9ff48'
}];

/* 签名校验 */
function signkeyVerify(req, res){
    if( utility.isNullOrEmp(req.body['appkey']) || utility.isNullOrEmp(req.body['sign']) ) {

        var result = {'code': '201', 'msg': '没有传递身份信息'};
        returnError( res, result );
        return false;
    }

    var appkey = req.body['appkey'];
    var signkey = '';
    for( var i=0; i < keyPairs.length; i++){

        if (appkey == keyPairs[i].appkey ){
            signkey = keyPairs[i].signkey;
            break;
        }
    }
    if (signkey ==''){
        console.log('身份信息不正确');
        var result = {'code': '202', 'msg': '身份信息不正确'};
        returnError( res, result );
        return false;
    }

    var keys = Object.keys(req.body).sort();
    var combineParams = '';
    keys.forEach( function(value, index, arr){
        if ( value != 'sign' && req.body[value] != '' && req.body[value] != undefined ){
            combineParams +=  (value.toString() + req.body[value].toString());
        }
    });
    combineParams =  signkey + combineParams ;

    var encodestr = utility.genSha1(combineParams);
    if (req.body['sign'] == encodestr){
        console.log('认证通过');
    }else {

        console.log('参数不正确');
        var result = {'code': '203', 'msg': '参数不正确'};
        returnError( res, result );

        return false;
    }

    return true;
}

/* 获取 appkey 和 signkey ，内部接口*/
app.get('/api/getkey', function(req, res){

    var userid = querystring.parse( url.parse(req.url).query )['id'] ;
    var appkey = genAppkey(userid);
    var signkey = genSignKey(userid);

    res.writeln('appkey:' + appkey);
    res.write('signkey:'+ signkey);
    res.end();
});

app.post('/api/verify', function(req, res){

    monitor(req, res);
});

var server = app.listen('3000', function(){

    var host = server.address().address;
    var port = server.address().port;

    console.log('sinopec mock api app is listening at http://%s:%s', host, port);
});