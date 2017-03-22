/**
 * Created by hubery on 2017/3/6.
 */

var crypto = require('crypto');
var nodemailer = require('nodemailer');


/* 随机字符串 */
 function genRandomString( count ){

    var str = '';
    if( count ){

        var staticChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
        for (var i=0; i< count; i++){

            str += staticChars[ Math.floor( Math.random() * count )];
        }
    }

    return str;
}

/* 生成sha1 */
function genSha1( value ){
    var sha1Hash = crypto.createHash('sha1');
    sha1Hash.update(value);
    var sha1value = sha1Hash.digest('hex');
    return sha1value;
}

/* 生成appkey */
function genAppkey(id){

    var value = 'sinopec' + id.toString()
    return  value;
}

/* 生成sign */
function genSignKey( userid ){

    var salt = 'signkey5945';
    var randomStr = genRandomString( 8 );
    var value = salt + randomStr + userid;

    var signkey = genSha1(value);
    return signkey;
}

/* 判断是否为空 */
function isNullOrEmp(value){

    if ( value == null || value== undefined || value.toString().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'') == '' ){
        return true;
    }else {
        return false;
    }
}

function sendmail (content){

    var transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        secureConnection: true,
        port:465,
        auth: {
            user: 'sunlixiangcn@163.com',
            pass: 'nodepwd163',
        }
    });

// setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'sunlixiangcn@163.com', // 发件地址
        to: '1907426753@qq.com', // 收件列表
        subject: '中石化充值页面监控异常', // 标题
        //text和html两者只支持一种
        text: content
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}


exports.genRandomString = genRandomString;
exports.genSha1 = genSha1;
exports.genAppkey = genAppkey;
exports.genSignKey = genSignKey;
exports.isNullOrEmp = isNullOrEmp;
exports.sendmail = sendmail;