/**
 * Created by hubery on 2017/1/4.
 */


//浏览事件
function viewObj(url,param){
    var allParam=".action";
    if(param != null){
        allParam +="?" + param;
    }

    window.location=url + allParam;
}

//显示添加多密码灰色 jQuery 遮罩层
function showPasswordDiv() {
    var bh = $("body").height();
    var bw = $("body").width();

    bh=document.body.clientHeight;
    bw=document.body.clientWidth;
    $("#recharge_password_fullbg").css({
        height:bh,
        width:bw,
        display:"block"
    });
    var dialog=document.getElementById("recharge_password_dialog");
    dialog.style.display="block";
    dialog.style.zIndex=100000;
    //居中显示
    dialog.style.top=(document.body.clientHeight-dialog.offsetHeight)/2 + "px";
    dialog.style.left=(document.body.clientWidth-dialog.offsetWidth)/2 + "px";


}

//关闭添加多密码灰色 jQuery 遮罩
function closePasswordBg() {
    $("#no1").find(".password-charge").val("");
    if(cell > 1){
        for(var i = 2;i <= cell;i++){
            $("#no"+i).remove();
        }
    }
    cell = 1;
    $("#recharge_password_fullbg,#recharge_password_dialog").hide();
}

function close1(s){
    s.src="res/images/close1.gif";
}
function close2(s){
    s.src="res/images/close2.png";
}

//显示   未登陆充值  灰色 jQuery 遮罩层
function showNoLoginBg(id) {
    var bh = $("body").height();
    var bw = $("body").width();

    bh=document.body.clientHeight;

    if(id == 1){
        bh = bh + 30;
    }

    bw=document.body.clientWidth;
    $("#nologin_charge_fullbg").css({
        height:bh,
        width:bw,
        display:"block"
    });
    var dialog=document.getElementById("nologin_charge_dialog");
    dialog.style.display="block";
    dialog.style.zIndex=100000;
    //居中显示
    dialog.style.top=(document.body.clientHeight-dialog.offsetHeight)/2 + "px";
    dialog.style.left=(document.body.clientWidth-dialog.offsetWidth)/2 + "px";
}

//关闭  未登陆充值  灰色 jQuery 遮罩
function closeNoLoginBg() {
    cleanyzm();
    $("#nologin_charge_fullbg,#nologin_charge_dialog").hide();
    var rechargeWrite = document.getElementById("recharge_write");
    var rechargeSure = document.getElementById("recharge_sure");
    rechargeWrite.style.display = "block";
    rechargeSure.style.display = "none";
}

// 继续充值
function goToCharge(){
    $("#nologin_charge_fullbg,#nologin_charge_dialog").hide();
    var rechargeWrite = document.getElementById("recharge_write");
    var rechargeSure = document.getElementById("recharge_sure");
    rechargeWrite.style.display = "none";
    rechargeSure.style.display = "block";
    parent.resizeFrame();
}

// 登陆
function goLogin(){
    closeNoLoginBg();
    parent.parent.userType("sign");
}

//显示   充值卡背面图大图  灰色 jQuery 遮罩层
function showCzkBigBg() {
    var bh = $("body").height();
    var bw = $("body").width();

    bh=document.body.clientHeight;
    bw=document.body.clientWidth;
    $("#czk_big_fullbg").css({
        height:bh,
        width:bw,
        display:"block"
    });
    var dialog=document.getElementById("czk_big_dialog");
    dialog.style.display="block";
    dialog.style.zIndex=100000;
    //居中显示
    dialog.style.top=(document.body.clientHeight-dialog.offsetHeight)/2 + "px";
    dialog.style.left=(document.body.clientWidth-dialog.offsetWidth)/2 + "px";
}

//关闭 充值卡背面图大图   灰色 jQuery 遮罩
function closeCzkBigBg() {
    $("#czk_big_fullbg,#czk_big_dialog").hide();
}

var clickFlag = false;

// 确认充值
function sureCharge(){
    var rechargeCardNo = $("#rechargeSureCardNo").val();
    var rechargeCardPhone = $("#rechargeCardPhone").val();
    var cyCheckBox = document.getElementById("add_cy_cardno_tixing");
    var cyTiXing = cyCheckBox.checked;

    czkPwdArray = new Array();

    var cardPass = document.getElementsByName("cardPass");
    for(var i=0; i < cardPass.length; i++){

        var nodeId=cardPass[i].id.substring(8);
        var czkPwd = cardPass[i].value;
        var zzbdCardPass = /^[0-9]*$/;
        var czkPwdOk = document.getElementById("recharge_czkPwd_ok"+nodeId);
        if(czkPwd == null || czkPwd == '' || czkPwd == 'null'){
            czkPwdOk.style.color = "red";
            return;
        } else if(!zzbdCardPass.test(czkPwd) || czkPwd.length != 20){
            czkPwdOk.style.color = "red";
            return;
        } else{
            czkPwdOk.style.color = "#999999";
        }

        for(var j=(i+1); j < cardPass.length; j++){
            var tempCzkPwd = cardPass[j].value;
            if(czkPwd == tempCzkPwd){
                alert("充值卡密码不能重复填写!");
                cardPass[j].value = "";
                return;
            }
        }

        var convertPwd = cryptToHex(czkPwd, 158);

        if($.str.czkpwd(czkPwd)){
            czkPwdArray.push(convertPwd);
        }
    }

    var yzmTishi = document.getElementById("charge_yanzhengma_tishi");
    if($("#charge_yanzhengma").val() == null || $("#charge_yanzhengma").val() == ""
        || $("#charge_yanzhengma").val() == 'null'){
        $("#charge_yanzhengma_tishi").html("验证码不能为空");
        yzmTishi.style.color = "red";
        return;
    }

    var czkPwdStr = JSON.stringify(czkPwdArray);

    if(clickFlag){
        return;
    }
    clickFlag = true;

    $.post(
        'html/netRechargeAction_czkCharge.json',
        {'rechargeCardNo':rechargeCardNo,
            'rechargeCzkCardPwd':czkPwdStr,
            'rechargeCardPhone':$("#chargePhone").val(),
            'yzm':$("#charge_yanzhengma").val(),
            'addCyCardNoTiXing':cyTiXing,
            'smsYzm':$("#sms_yzm").val()},
        function(result){
            clickFlag = false;

            var yzmResult = result.yzmresult;
            if(yzmResult == "1"){
                $("#charge_yanzhengma_tishi").html("请重新获取验证码!");
                yzmTishi.style.color = "red";
                return;
            }

            if(yzmResult == "2"){
                $("#charge_yanzhengma_tishi").html("验证码输入有误!");
                yzmTishi.style.color = "red";
                return;
            }

            $("#charge_yanzhengma_tishi").html("请输入计算结果");
            yzmTishi.style.color = "#999999";

            var error = result.error;
            if(error != null && error != ""){
                alert(error);

                var fast = result.fast;
                if(fast != null && fast != ""){
                    parent.showPage('czkcz','czjf');
                }
                return;
            }

            var list = result.list;

            showRechargeTiShi();

            $("#charge_over_tishi").html("");

            for(var i = 0; i < list.length; i++){

                var orderId = list[i][0];

                chargeOverData((i+1), orderId);
            }

        }, 'json'
        )
        .success(function() {})
        .error(function() {
            clickFlag = false;
            alert("充值卡充值失败,请重试!");
        })
        .complete(function() {
        });
}

function chargeOverData(rows, orderId){
    var tishiData = "<div style=\"border-bottom: 1px dashed grey;margin-bottom: 10px;\">" +
        "<table align=\"center\" width=\"100%\">" +
        "<tr align=\"center\" style=\"display: block;\">" +
        "<td width=\"100%\" align=\"center\">" +
        "<div style=\"width: auto; height:30px; margin-top: 30px; text-align: center; vertical-align: middle;\">" +
        "<font id=\"pay_suc_tishi"+rows+"\" style=\"font-size: 14px; color: 4C4C4C; font-weight: bold; text-align: center;\">您的支付金额为" +
        "</font>" +
        "<font id=\"recharge_orderMoney"+rows+"\" style=\"font-size: 14px; color: #0063B4; font-weight: bold; text-align: center;\">" +
        "0.0" +
        "</font>  &nbsp;&nbsp; " +
        "<font style=\"font-size: 14px; color: 4C4C4C; font-weight: bold; text-align: center;\">" +
        "元," +
        "</font>" +
        "<font style=\"font-size: 14px; color: 4C4C4C; font-weight: bold; text-align: center;\">" +
        "订单号为" +
        "</font>" +
        "<font id=\"order_no"+rows+"\" style=\"font-size: 14px; color: #0063B4; font-weight: bold; text-align: center;\">" +
        "</font>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "<table align=\"center\" width=\"100%\">" +
        "<tr align=\"center\" style=\"display: block;\">" +
        "<td width=\"100%\" align=\"center\">" +
        "<div style=\"width: 600px; height:30px; margin-top: 15px; text-align: center;\">" +
        "<img id=\"recharge_tishi_image"+rows+"\" style=\"vertical-align: middle;\" src=\"res/images/load.gif\"/>" +
        "<font id=\"recharge_tishi_text"+rows+"\" style=\"font-size: 14px; color: 4C4C4C; text-align: center;\">" +
        "</font>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    $("#charge_over_tishi").append(tishiData);

    test(orderId, rows, 0);
}

var maxQuery = 5;

function test(orderId, rows, count){
    if(orderId != '' && orderId != null && orderId != 'null'){

        var tishiImage = document.getElementById("recharge_tishi_image"+rows);

        // 充值状态提示界面显示订单号
        $("#order_no"+rows).html(orderId);

        //正在验证充值卡
        tishiImage.src = 'res/images/load.gif';

        $("#recharge_tishi_text"+rows).html("正在验证充值卡，请稍候..");

        $.post(
            'html/netRechargeAction_selectCardOrder.json',
            {'orderId':orderId},
            function(result){
                // 订单支付状态
                var orderStatus = result.ordersuccess;
                //var orderStatus = 0;
                // 订单充值状态
                var gcaStatus = result.success;

                // 验卡错误提示
                var respCode = result.respCode;

                if(orderStatus == null || orderStatus == "null" || orderStatus == "undefined"){
                    if(count == maxQuery){
                        //无此订单
                        tishiImage.src = 'res/images/recharge_failed.png';
                        $("#recharge_tishi_text"+rows).html("查询订单状态失败!");
                        return;
                    }

                    setTimeout("test("+orderId+", "+rows+", "+(count+1)+")", 2 * 1000);
                } else if(orderStatus == 0){
                    if(respCode == null || respCode == "null" || respCode == "undefined" ){

                        if(count == maxQuery){
                            //无此订单
                            tishiImage.src = 'res/images/recharge_failed.png';
                            $("#recharge_tishi_text"+rows).html("查询订单状态失败!");
                            return;
                        }

                        setTimeout("test("+orderId+", "+rows+", "+(count+1)+")", 2 * 1000);
                        return;
                    }

                    // 未支付
                    tishiImage.src = 'res/images/recharge_failed.png';
                    $("#recharge_tishi_text"+rows).html(respCode);
                } else if(orderStatus == 1){
                    var orderMoney = result.orderMoney + "";
                    $("#recharge_orderMoney"+rows).html(orderMoney.parseFen2Yuan());

                    // 支付成功
                    switch(gcaStatus){
                        case 0:{
                            //未充值
                            tishiImage.src = 'res/images/recharge_failed.png';
                            $("#recharge_tishi_text"+rows).html("未充值");
                            break;
                        }
                        case 1:{
                            //正在充值
                            tishiImage.src = 'res/images/load.gif';
                            $("#recharge_tishi_text"+rows).html("充值卡验证通过，系统正在充值，请耐心等待!");
                            break;
                        }
                        case 2:{
                            //充值成功
                            $("#pay_suc_tishi"+rows).html("您的充值金额为");

                            tishiImage.src = 'res/images/recharge_suc.png';

                            var sessionCardNo = '';
                            if(sessionCardNo == null || sessionCardNo == '' || sessionCardNo == 'null'){
                                $("#recharge_tishi_text"+rows).html("充值成功，单用户卡客户请持卡到网点圈存;多用户卡客户请登录办理预分配。");
                            } else {
                                $("#recharge_tishi_text"+rows).html("充值成功，单用户卡客户请持卡到网点圈存;多用户卡客户请办理"+
                                    "<a href=\"javascript:void(0)\" onclick=\"yuFenPei();\" style=\"color: #0063B4; font-size: 14px; text-decoration: none; cursor: pointer;\">预分配。</a>");
                            }

                            // 如果充值成功，并且是给当前session中的加油卡充值
                            if(sessionCardNo != null && sessionCardNo != ""){
                                if($("#cardNo").val() == ''){
                                    $.post('html/netRechargeAction_getCardInfo.json',
                                        {'cardNo':$("#cardNo").val()},
                                        function(result){
                                            var cardInfo = result.cardInfo;

                                            //客户类型
                                            var compType = cardInfo.compType;
                                            // 客户类型，01:单位单用户,02:单位多用户,03:个人单用户,04:个人多用户,07:不记名客户
                                            // 如果是单用户卡客户，则修改我的加油卡备付金余额
                                            if(compType == '01' || compType == "03"){
                                                $("#card_balance_id",window.parent.document).html(cardInfo.preBalance.parseFen2Yuan());
                                            } else{
                                                // 如果是多用户，则修改我的加油卡额度账余额
                                                $("#card_balance_id",window.parent.document).html(cardInfo.balance.parseFen2Yuan());
                                            }

                                        },"json"
                                        )
                                        .success(function() {})
                                        .error(function() {
                                            alert("查询加油卡信息失败!");
                                        })
                                        .complete(function() {
                                        });
                                }
                            }

                            break;
                        }
                        case 3:{
                            //充值失败
                            tishiImage.src = 'res/images/recharge_failed.png';
                            $("#recharge_tishi_text"+rows).html("充值卡验证成功但充值失败,请您查询订单状态；如已支付成功，我们将为您的订单进行异常处理，请您耐心"+
                                "等候；您也可拨打中国石化客服热线<font style=\"color: #0063B4;font-size:14px;\">95105888</font>咨询订单异常处理进度。");
                            var gotoWsyyt = document.getElementById("charge_goto_wsyyt");
                            gotoWsyyt.style.display = "block";
                            break;
                        }
                        case 4:{
                            //无此订单
                            tishiImage.src = 'res/images/recharge_failed.png';
                            $("#recharge_tishi_text"+rows).html("无此订单!");
                            break;
                        }
                        case 5:{
                            // 支付成功， 充值正在进行
                            tishiImage.src = 'res/images/recharge_suc.png';
                            //$("#recharge_tishi_text").html("支付已成功,充值正在进行中,充值完成以后会给您发送短信提醒!");
                            $("#recharge_tishi_text"+rows).html("支付已成功,充值正在进行中，请耐心等待!");
                            break;
                        }
                    }
                } else if(orderStatus == 2){
                    if(respCode == null || respCode == "null" || respCode == "undefined" ){

                        if(count == maxQuery){
                            //无此订单
                            tishiImage.src = 'res/images/recharge_failed.png';
                            $("#recharge_tishi_text"+rows).html("查询订单状态失败!");
                            return;
                        }

                        setTimeout("test("+orderId+", "+rows+", "+(count+1)+")", 2 * 1000);
                        return;
                    }

                    // 支付失败
                    tishiImage.src = 'res/images/recharge_failed.png';
                    $("#recharge_tishi_text"+rows).html("订单支付失败，" + respCode);
                }
            },"json"
            )
            .success(function() {})
            .error(function() {
                tishiImage.src = 'res/images/recharge_failed.png';
                $("#recharge_tishi_text"+rows).html("查询订单状态失败!");
            })
            .complete(function() {
                parent.resizeFrame();
            });
    }else{
        alert("orderId丢失");
    }

    parent.resizeFrame();
}

//点击预分配跳转到预分配页面
function yuFenPei(){

    var cardNo = $("#cardNo").val();
    var chargeYuFenPeiTiShi = document.getElementById("charge_yufenpei_tishi");
    var compTypeTishi = document.getElementById("comptype_tishi");

    // 如果不是是自己绑定的加油卡,则提示不能进行预分配
    if(success == 'no'){
        chargeYuFenPeiTiShi.style.display = "block";
        return;
    }

    // 客户类型，01:单位单用户,02:单位多用户,03:个人单用户,04:个人多用户,07:不记名客户
    // 如果是单用户卡客户，则提示不能进行预分配
    if(compType == '01' || compType == "03" || compType == "07"){
        compTypeTishi.style.display = "block";
        return;
    }

    parent.parent.clickMyOilCardDetail('zzyfp');

}

//客户类型
var compType = '';

//充值的加油卡是否在绑定的加油卡中, yes 为存在, no 为不存在
var success = '';

var czkPwdArray = "";

//信息填写
function rechargeSure(){

    var rechargeWrite = document.getElementById("recharge_write");
    var rechargeSure = document.getElementById("recharge_sure");

    var cardNoHtml = document.getElementById("cardNo");

    var rechargeSureCardNo = document.getElementById("rechargeSureCardNo");
    var rechargeSureCardPhone = document.getElementById("rechargeSureCardPhone");

    var sessionCardNo = '';

    var tiShi = document.getElementById("reSure_cardNo_tishi");
    var rechargeSureCardNoTr = document.getElementById("recharge_sure_cardNoTr");
    var cardNo = $("#cardNo").val();
    var reSureCardNo = $("#reSure_cardNo").val();

    var rechargeSureMobilePhoneTr = document.getElementById("charge_mobile_phone_tr");
    var chargeSurePhoneTishi = document.getElementById("charge_sure_phoneTishi");
    var chargePhone = document.getElementById("chargePhone");
    var chargeSurePhoneTr = document.getElementById("charge_sure_phone_tr");

    // 加油卡号码提示
    var cardNoTishi = document.getElementById("cardno_tishi");

    var zzbd = /^[0-9]*$/;

    if($('#cardNo').val() == '' || $('#cardNo').val() == null || $('#cardNo').val() == 'null'){
        cardNoTishi.style.color = "red";
        $('#cardNo').focus();
        return;
    } else if(!zzbd.test($('#cardNo').val()) || $('#cardNo').val().length != 19){
        cardNoTishi.style.color = "red";
        $('#cardNo').focus();
        return;
    } else {
        cardNoTishi.style.color = "#999999";
    }

    // 如果提示确认加油卡号码行为隐藏状态
    if(rechargeSureCardNoTr.style.display == "none"){
        reSureCardNo = cardNo;
    } else {
        if(cardNo != reSureCardNo){
            tiShi.style.color = "red";
            $("#reSure_cardNo").focus();
            return;
        }
    }
    tiShi.style.color = "#999999";

    var phoneVali = /^0*(13|15|18|14|17)\d{9}$/;
    // 如果提示输入手机号码为显示状态
    if(rechargeSureMobilePhoneTr.style.display == "block"){
        chargeSurePhoneTr.style.display = "block";
        if($("#chargePhone").val() == '' || $('#chargePhone').val() == null || $('#chargePhone').val() == 'null'){
            chargeSurePhoneTishi.style.color = "red";
            chargePhone.focus();
            return;
        } else if (!phoneVali.test($('#chargePhone').val()) || $('#chargePhone').val().length != 11){
            chargeSurePhoneTishi.style.color = "red";
            chargePhone.focus();
            return;
        } else {
            chargeSurePhoneTishi.style.color = "#999999";
        }
    } else if (rechargeSureMobilePhoneTr.style.display == "none"){
        // 在信息确认界面隐藏手机号码
        chargeSurePhoneTr.style.display = "none";
    }

    var chargeSmsYzmTr = document.getElementById("charge_smsyzm_tr");
    if(chargeSmsYzmTr.style.display == "block"){
        if($("#sms_yzm").val() == '' || $('#sms_yzm').val() == null){
            alert("短信验证码不能为空!");
            $("#sms_yzm").focus();
            return;
        }
        //如果是快充，隐藏充值卡密码后面的加减符号图片
        $("#czk_pwd_delete1").hide();
        $("#czk_pwd_add1").hide();
    }

    $.post('html/netRechargeAction_queryCardInfo.json',
        {'cardNo':cardNoHtml.value,
            'smsYzm':$("#sms_yzm").val(),
            'chargePhoneNo':$("#chargePhone").val()},
        function(result){

            // 充值的加油卡是否在绑定的加油卡中, yes 为存在, no 为不存在
            success = result.success;

            // 手机短信验证码
            var smsyzmresult = result.smsyzmresult;

            if(smsyzmresult == 4){
                alert("请重新获取验证码或登录以后再充值!");
                cleanyzm();
                return;
            }

            if(smsyzmresult == 3){
                alert("短信验证码有误，请重试!");
                cleanyzm();
                return;
            }

            var cardInfo = result.cardInfo;
            if(cardInfo == "error"){
                alert("此加油卡不存在!");
                cleanyzm();
                return;
            }

            //主附卡信息
            var priCard = cardInfo.priCard;
            if(priCard == 0){
                cardNoHtml.focus();
                alert("不能给副卡进行充值!");
                cleanyzm();
                return;
            }

            // 卡状态,04-正常使用卡,05-挂失卡,07-失效卡,09-坏卡,10-作废卡,其他响应吗:卡状态异常
            // 卡状态为“04”的卡才能继续交易，其他状态都不允许交易
            var cardStatus = cardInfo.cardStatus;
            if(cardStatus != '' && cardStatus != null && cardStatus != 'null'){
                if(cardStatus == '04'){

                } else if(cardStatus == '05'){
                    alert('该卡已挂失，不能进行充值!');
                    cleanyzm();
                    return;
                } else if(cardStatus == '07'){
                    alert('该卡已失效，不能进行充值!');
                    cleanyzm();
                    return;
                } else if(cardStatus == '09'){
                    alert('该卡已损坏，不能进行充值!');
                    cleanyzm();
                    return;
                } else if(cardStatus == '10'){
                    alert('该卡已作废，不能进行充值!');
                    cleanyzm();
                    return;
                } else {
                    alert('卡状态异常，不能进行充值!');
                    cleanyzm();
                    return;
                }
            }

            //卡有效期  0：有效  1：失效
            var validDate = cardInfo.validDate;
            if(validDate != null && validDate != '' && validDate != 'null'){
                if(validDate == 1){
                    alert("该卡已超过有效期，不能进行充值!");
                    cleanyzm();
                    return;
                }
            }

            //加油卡号码
            var cardNo = cardInfo.cardNo;

            //客户类型
            compType = cardInfo.compType;

            //客户名称
            var compName = cardInfo.compName;
            var nameDecode = new NameDecode();

            if(compName == null || compName == 'null' || compName == ""){
                compName = "";
            } else {
                compName = nameDecode.decode(compName);
            }

            //持卡人姓名
            var cardHolder = cardInfo.cardHolder;
            if(cardHolder == null || cardHolder == 'null' || cardHolder == ""){
                cardHolder = "";
            } else {
                cardHolder = nameDecode.decode(cardHolder);
            }

            //设置加油卡卡号
            $("#recharge_sure_cardNo").html(cardNo);

            // 设置客户名称
            $("#recharge_sure_compname").html(compName);
            //设置持卡人姓名
            $("#recharge_sure_cardHolder").html(cardHolder);
            //预留手机号码
            $("#recharge_sure_cardPhone").html($("#chargePhone").val());

            rechargeSureCardNo.value = cardNo;

            if(sessionCardNo == null || sessionCardNo == '' || sessionCardNo == 'null'){
                showNoLoginBg();
                return;
            }

            rechargeWrite.style.display = "none";
            rechargeSure.style.display = "block";
            parent.resizeFrame();
        },"json"
        )
        .success(function() {})
        .error(function() {
            alert("验证加油卡失败!");
            cleanyzm();
        })
        .complete(function() {
        });

}

function back(){
    jQuery('#yzm').attr('src',"YanZhengMaServlet?"+ Math.random());
    $("#charge_yanzhengma").val("");
    cleanyzm();
    var rechargeWrite = document.getElementById("recharge_write");
    var rechargeSure = document.getElementById("recharge_sure");
    var rechargeTiShi = document.getElementById("recharge_tishi");
    rechargeWrite.style.display = "block";
    rechargeSure.style.display = "none";
    rechargeTiShi.style.display = "none";
    parent.resizeFrame();
}

function showRechargeTiShi(){
    var rechargeWrite = document.getElementById("recharge_write");
    var rechargeSure = document.getElementById("recharge_sure");
    var rechargeTiShi = document.getElementById("recharge_tishi");

    rechargeTiShi.style.display = "block";
    rechargeWrite.style.display = "none";
    rechargeSure.style.display = "none";
    //parent.resizeFrame();
}

function rechargeAgain(obj){
    obj.href = "http://www.sinopecsales.com:80/gas/html/billQueryAction_goChangeCard.action";
}

var cell = 1;

function addPasswordCell(){

    if(cell == 10){
        alert("当前系统最高支持同时输入10张充值卡密码");
    }else{
        /*var flag = 0;
         for(var i = 1;i<= cell;i++){
         if($("#no"+i).find(".password-charge").val() == ""){
         flag = i;
         }
         }
         if(flag != 0){
         alert("请填写第"+flag+"张后再次添加下一行");
         return;
         }*/
        /*for(var i = 1; i <= cell; i++){
         if($("#no"+i).find(".font_error").html() != ""){
         return;
         }
         }
         if(cell > 1){

         }*/
        var content = foreachCell();
        if(content != ""){
            if(content == "error"){
                return;
            }
            alert(content);
            return;
        }
        cell += 1;
        var newCell = $("#no").clone(true);
        newCell.attr("id","no"+cell);
        newCell.css("display","block");
        newCell.find(".cardNo").html(cell);
        $("#psDody").append(newCell);
    }

    //alert(newCell);
}


function changeLength(event,obj){
    if(event.keyCode == 86 && event.ctrlKey){

    }
    //当键位不是清除键或左右键时触发
    if(event.keyCode != 8 && event.keyCode != 46 && event.keyCode != 37 && event.keyCode != 39){
        var passWord = $(obj).val();

        if(event.keyCode == 32){
            passWord = passWord.substring(0,passWord.length-1);
        }else{
            if(passWord.length == 6 || passWord.length == 11 || passWord.length == 16){
                passWord += " ";
            }
        }
        $(obj).val(passWord);
    }
}
function fontLength(obj){
    var tr = $(obj).parent().parent();
    if($(obj).val().length != 21){
        tr.find(".font_error").html("密码长度不足18位");
        $(obj).focus();
        return;
    }
    tr.find(".font_error").html("");

}
function foreachCell(){
    for(var a = 1; a <= cell; a++){
        if($("#no"+a).find(".font_error").html() != ""){
            return "error"
        }
        if($("#no"+a).find(".password-charge").val() == ""){
            return "第"+a+"行密码为空，请输入";

        }

        for(var b = a+1; b <= cell; b++){
            if($("#no"+a).find(".password-charge").val()
                == $("#no"+b).find(".password-charge").val()){
                $("#no"+b).find(".password-charge").val("");
                return "第"+a+"行密码与第"+b+"行密码重复，请重新输入第"+b+"行密码"
            }
        }
    }
    return "";
}

function passConfirm(){
    var result = confirm("您需要再次检查密码吗？");

    if(result == false){
        var content = foreachCell();
        if(content != ""){
            if(content == "error"){
                return;
            }
            alert(content);
            return;
        }

        //开启检查密码
        $("#pwDiv").css("display","none");
        $("#showDiv").css("display","block");

        for(var i = 1; i <= cell; i++){
            var str = "<tr height=\"35px\"><td align=\"right\" width=\"180px;\">第"+i+"张卡：</td>"+
                "<td align=\"left\" style=\"font-size:14px;color:#4E4E4E;font-weight:bold;\" width=\"310px;\">"+
                $("#no"+i).find(".password-charge").val()+"</td></tr>";

            $("#showBody").append(str);
        }

    }
}

var list='';

//显示常用加油卡列表
function showCyCardNo(){

    addOne();

    $("#cardNo").focus();

    // 如果是从快捷充值通道跳转过来
    var cardNoFromMyOilCard = parent.lastCardNo;
    var sureCardNo = parent.lastMoney;

    if(cardNoFromMyOilCard != null & cardNoFromMyOilCard != '' & cardNoFromMyOilCard != 'null'){
        $("#cardNo").val(cardNoFromMyOilCard);
        parent.lastCardNo = '';
        parent.parent.lastCardNo = '';
    }

    if(sureCardNo != null & sureCardNo != '' & sureCardNo != 'null'){
        $("#reSure_cardNo").val(sureCardNo);
        parent.lastMoney = '';
        parent.parent.lastMoney = '';
    }

    var cardNo = $("#cardNo").val();
    var provinceKey = cardNo.substring(6,8);
    var provinceTemp = "未知";
    if(provinceKey == '86'){
        provinceKey = cardNo.substring(8,10);
        for(var i = 0; i < provinceMap_qw.length; i++){
            var a = provinceMap_qw[i];
            // 当输入的加油卡的7、8(区外为9、10)位为省份的对应值时, 显示相应的省份
            if(a[0] == provinceKey){
                provinceTemp = a[1];
                break;
            }
        }
    }else{
        for(var i = 0; i < provinceMap.length; i++){
            var a = provinceMap[i];
            // 当输入的加油卡的7、8(区外为9、10)位为省份的对应值时, 显示相应的省份
            if(a[0] == provinceKey){
                provinceTemp = a[1];
                break;
            }
        }
    }
    $("#card_province").html(provinceTemp);
    $("#sure_cardProvince").html(provinceTemp);

    var rechargeCyCardNo = document.getElementById("recharge_cy_cardno");
    var sessionCardNo = '';

    var rechargeAgainTd = document.getElementById("recharge_again_td");
    var queryCardOrderTd = document.getElementById("query_cardorder_td");
    var rechargeAgainTdBig = document.getElementById("recharge_again_td_big");
    if(sessionCardNo == '' || sessionCardNo == null || sessionCardNo == 'null'){
        $("#recharge_sure_cardNoTr").css("display","block");
        $("#charge_mobile_phone_tr").css("display","block");
        $("#charge_smsyzm_tr").css("display","block");

        rechargeCyCardNo.style.display = "none";

        // 隐藏小的继续充值按钮和查看订单按钮
        rechargeAgainTd.style.display = "none";
        queryCardOrderTd.style.display = "none";
        // 显示大的继续充值按钮
        rechargeAgainTdBig.style.display = "block";

        return;
    }

    // 加载常用加油卡
    $.post(
        'jsp/netRechargeAction_queryCardCyCardNo.json',
        function(result){
            var data = result.data;
            list = data;
            // 如果是登陆但是没有绑定的加油卡
            if(data == null || data == '' || data.length == 0){
                $("#recharge_sure_cardNoTr").css("display","block");
                $("#charge_mobile_phone_tr").css("display","block");
                $("#charge_smsyzm_tr").css("display","block");
                return;
            }

            var content = '';
            for(var i = 0; i < data.length; i++){
                var cyCard = data[i];
                var cardNo = cyCard.cardNo;
                content += "<tr class=\"Tr\" onmousemove=\"colorBg(this,'#f1f1f1')\" onmouseout=\"colorBg(this,'white')\">";
                content += "<td onclick=\"choiceCardNo('"+cardNo+"');\"  width=\"230px;\" height=\"25px;\" style=\"padding-left:5px;border-right: 1px solid #f2f2f2;border-bottom:1px solid #f2f2f2;\">"+cardNo+"</td>";

                // 如果是自己绑定的加油卡
                if(cyCard.cardType == 1){
                    content += "<td width=\"30px;\" height=\"25px;\" style=\"padding-left:5px;border-right: 1px solid #f2f2f2;border-bottom:1px solid #f2f2f2;\">&nbsp; </td>";
                } else {
                    content += "<td onclick=\"deleteCardNo('"+cardNo+"');\" width=\"30px;\" height=\"25px;\" style=\"padding-left:5px;border-right: 1px solid #f2f2f2;border-bottom:1px solid #f2f2f2;\">"+
                        "<img src=\"res/images/onError2.gif \" onmousemove=\"qie1(this);\" onmouseout=\"qie2(this);\"> </td>";
                }

                content += "</tr>";
            }
            $('.show').html(content);

        },'json'
        )
        .success(function() {})
        .error(function() {
            alert("查看常用加油卡列表失败!");
        })
        .complete(function() {
        });
}

function qie1(s){
    s.src="res/images/onError.gif";
}
function qie2(s){
    s.src="res/images/onError2.gif";
}

//删除常用加油卡
function deleteCardNo(cardNo){

    $.post(
        'jsp/netRechargeAction_deleteCyCardNo.json',
        {'cardNo' : cardNo},
        function(result){
            var data = result.success;
            if(data > 0){
                window.location.href = "http://www.sinopecsales.com:80/gas/html/billQueryAction_goChangeCard.action";
            } else {
            }
        },'json'
        )
        .success(function() {})
        .error(function() {
            alert("删除常用加油卡失败!");
        })
        .complete(function() {
        });
}

//点击查看常用加油卡
function btnShowCyCardNo(){
    var sessionCardNo = '';
    var dialog=document.getElementById("recharge_cyCardNo_dialog");
    if(sessionCardNo == '' || sessionCardNo == null || sessionCardNo == 'null'){
        dialog.style.display = "none";
        return;
    }
    if(dialog.style.display != "none"){
        dialog.style.display = "none";
    } else if (dialog.style.display != "block"){
        dialog.style.display = "block";
    }
}

//点击常用加油卡号码中的某一项显示在加油卡编辑框中
function choiceCardNo(cyCardNo){
    var cardNoText = document.getElementById("cardNo");
    var dialog=document.getElementById("recharge_cyCardNo_dialog");
    var rechargeSureCardNoTr = document.getElementById("recharge_sure_cardNoTr");
    cardNoText.value = cyCardNo;
    dialog.style.display="none";

    rechargeSureCardNoTr.style.display = "none";

    $("#reSure_cardNo").val('');

    isInCyCardNo();
}

var provinceMap = new Array((new Array("11", "北京市")), new Array("12", "天津市"), new Array("13", "河北省"),new Array("14", "山西省"),
    new Array("31", "上海市"), new Array("32", "江苏省"), new Array("33", "浙江省"), new Array("34", "安徽省"),
    new Array("35", "福建省"),new Array("36", "江西省"),new Array("37", "山东省"),new Array("41", "河南省"),
    new Array("42", "湖北省"),new Array("43", "湖南省"),new Array("44", "广东省"),new Array("45", "广西省"),
    new Array("46", "海南省"),new Array("50", "重庆市"),new Array("51", "四川省"),new Array("52", "贵州省"),new Array("53", "云南省"),
    new Array("90", "深圳市"));
var provinceMap_qw = new Array(new Array("15", "内蒙古自治区"),new Array("21", "辽宁省"),new Array("22", "吉林省"),
    new Array("23", "黑龙江省"),new Array("61", "陕西省"),new Array("62", "甘肃省"),new Array("63", "青海省"),
    new Array("64", "宁夏自治区"),new Array("65", "新疆自治区"),new Array("54", "西藏自治区"), new Array("91", "北京龙禹"));

//判断输入的加油卡号码是否在常用加油卡列表中
function isInCyCardNo(){
    var rechargeSureCardNoTr = document.getElementById("recharge_sure_cardNoTr");
    var rechargeSureMobilePhoneTr = document.getElementById("charge_mobile_phone_tr");
    var dialog=document.getElementById("recharge_cyCardNo_dialog");
    var addCyCardNoDiv = document.getElementById("add_cy_cardno");

    var cardNoVal = $('#cardNo').val();
    var reSureCardNo = document.getElementById("reSure_cardNo");
    var sessionCardNo = '';

    var cardNoTishi = document.getElementById("cardno_tishi");

    var zzbd = /^[0-9]*$/;
    if($('#cardNo').val() == '' || $('#cardNo').val() == null || $('#cardNo').val() == 'null'){
        cardNoTishi.style.color = "red";
        return;
    } else if(!zzbd.test($('#cardNo').val()) || $('#cardNo').val().length != 19){
        cardNoTishi.style.color = "red";
        return;
    } else {
        cardNoTishi.style.color = "#999999";
    }

    var provinceKey = cardNoVal.substring(6,8);
    var provinceTemp = "未知";
    if(provinceKey == '86'){
        provinceKey = cardNoVal.substring(8,10);
        for(var i = 0; i < provinceMap_qw.length; i++){
            var a = provinceMap_qw[i];
            // 当输入的加油卡的7、8(区外为9、10)位为省份的对应值时, 显示相应的省份
            if(a[0] == provinceKey){
                provinceTemp = a[1];
                break;
            }
        }
    }else{
        for(var i = 0; i < provinceMap.length; i++){
            var a = provinceMap[i];
            // 当输入的加油卡的7、8(区外为9、10)位为省份的对应值时, 显示相应的省份
            if(a[0] == provinceKey){
                provinceTemp = a[1];
                break;
            }
        }
    }
    $("#card_province").html(provinceTemp);
    $("#sure_cardProvince").html(provinceTemp);

    if(sessionCardNo == '' || sessionCardNo == null || sessionCardNo == 'null'){
        rechargeSureCardNoTr.style.display = "block";
        rechargeSureMobilePhoneTr.style.display = "block";
        $("#charge_smsyzm_tr").css("display","block");
        return;
    }

    dialog.style.display = "none";

    // 如果常用加油卡列表为空
    if(list == null || list.length == 0){
        rechargeSureCardNoTr.style.display = "block";
        rechargeSureMobilePhoneTr.style.display = "block";
        $("#charge_smsyzm_tr").css("display", "block");

        addCyCardNoDiv.style.display = "block";
        return;
    }

    for(var i = 0; i < list.length; i++){
        var cardNo = list[i].cardNo;
        var cardType = list[i].cardType;

        //如果加油卡号码为空，则不作处理
        if(cardNoVal == '' || cardNoVal == null){

        } else {
            //如果该加油卡存在常用加油卡列表中,则不作处理

            if(cardNoVal == cardNo){
                rechargeSureCardNoTr.style.display = "none";
                addCyCardNoDiv.style.display = "none";
                // 如果卡的类型为自己绑定的加油卡,则不显示输入手机号码行
                if(cardType == 1){
                    rechargeSureMobilePhoneTr.style.display = "none";
                    $("#charge_smsyzm_tr").css("display", "none");
                } else if (cardType == 2){
                    // 如果卡的类型为手动加入的其他人的加油卡号码，则显示输入手机号码行
                    rechargeSureMobilePhoneTr.style.display = "block";
                    $("#charge_smsyzm_tr").css("display", "block");
                }
                return;
            } else {
                //如果循环到最后还是不存在的话，则显示确认加油卡输入行, 并且显示手机号码输入行
                if((i + 1) == list.length){
                    //reSureCardNo.value = "";
                    rechargeSureCardNoTr.style.display = "block";
                    rechargeSureMobilePhoneTr.style.display = "block";
                    $("#charge_smsyzm_tr").css("display", "block");

                    addCyCardNoDiv.style.display = "block";
                }
            }
        }
    }
}

//确认加油卡  文本框鼠标离开事件
function sureChargeNoOnBlur(){
    isInCyCardNo();
    var reSureCardNo = document.getElementById("reSure_cardNo_tishi");

    if($("#reSure_cardNo").val() != $("#cardNo").val()){
        reSureCardNo.style.color = "red";
        reSureCardNo.style.fontWeight = "bold";
        reSureCardNo.style.letterSpacing = "1px";
    } else {
        reSureCardNo.style.color = "#999999";
        reSureCardNo.style.fontWeight = "normal";
        reSureCardNo.style.letterSpacing = "0";
    }
}

//确认加油卡号 光标后置事件
function sureChargeNoHz(obj){
    var a=obj.createTextRange();
    a.moveStart('character',obj.value.length);
    a.collapse(true);
    a.select();
}

// 充值卡密码 文本框鼠标离开事件
function sureCzkPwdOnBlur(){
    var zzbd = /^[0-9]*$/;
    var czkPwd = document.getElementById("cardPass");
    var czkPwdOk = document.getElementById("recharge_czkPwd_ok");

    if($('#cardPass').val() == null || $('#cardPass').val() == '' || $('#cardPass').val() == 'null'){
        czkPwdOk.style.color = "red";
        return;
    } else if(!zzbd.test($('#cardPass').val()) || $('#cardPass').val().length != 20){
        czkPwdOk.style.color = "red";
        return;
    } else{
        czkPwdOk.style.color = "#999999";
    }
}

// 点击条码卡
function tiaomaKaOn(){
    var guaguaCardMenu = document.getElementById("guagua_card_menu");
    var tiaomaCardMenu = document.getElementById("tiaoma_card_menu");
    guaguaCardMenu.className = "recharge_menu_no";
    tiaomaCardMenu.className = "recharge_menu_h";

    window.location.href = "http://www.sinopecsales.com:80/gas/html/billQueryAction_goTiaoMaCard.action";
}

//查看充值卡充值订单
function queryCardOrder(){
    parent.clickMyOilCardDetail('czkczdd');
}

function controlPosition(control,obj){
    var o = document.getElementById(obj);
    var offsettop = $(o).offset().top + $(o).outerHeight();
    var offsetleft = $(o).offset().left;

    //设置下拉层的位置基于文本控件的坐标
    $("#"+control).css({position: "absolute",'top':offsettop,'left':offsetleft,'z-index':2});

    $("#"+control).css("display","block");
}


//隐藏卡号或日历
function showDiv(control,obj){
    if($("#"+control).css("display") == "none"){
        controlPosition(control,obj);
        $("#"+control).css("display","block");
    }else{
        $("#"+control).css("display","none");
    }
}

//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function forbidBackSpace(e) {
    var ev = e || window.event; //获取event对象
    var obj = ev.target || ev.srcElement; //获取事件源
    var t = obj.type || obj.getAttribute('type'); //获取事件源类型
    //获取作为判断条件的事件类型
    var vReadOnly = obj.readOnly;
    var vDisabled = obj.disabled;
    //处理undefined值情况
    vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
    vDisabled = (vDisabled == undefined) ? true : vDisabled;
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    //并且readOnly属性为true或disabled属性为true的，则退格键失效
    var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";
    //判断
    if (flag2 || flag1) return false;
}
//禁止后退键 作用于Firefox、Opera
document.onkeypress = forbidBackSpace;
//禁止后退键  作用于IE、Chrome
document.onkeydown = forbidBackSpace;

//加油卡输入框onkeyup事件
function chargeCardNoOnKeyUp(){
    var zzbd = /^[0-9]*$/;
    var reSureCardNo = document.getElementById("reSure_cardNo_tishi");
    var cardNoTishi = document.getElementById("cardno_tishi");

    $("#reSure_cardNo").val("");

    if($('#cardNo').val() == '' || $('#cardNo').val() == null || $('#cardNo').val() == 'null'){

        $("#reSure_cardNo").val("");
        reSureCardNo.style.color = "#999999";

        cardNoTishi.style.color = "red";
        $('#cardNo').focus();
        return;
    } else if(!zzbd.test($('#cardNo').val()) || $('#cardNo').val().length != 19){
        cardNoTishi.style.color = "red";
        $('#cardNo').focus();
        return;
    } else {
        cardNoTishi.style.color = "#999999";
    }

}

//手机号码输入框onkeyup事件
function phoneOnKeyUp(){
    var chargeSurePhoneTishi = document.getElementById("charge_sure_phoneTishi");
    var chargePhone = document.getElementById("chargePhone");
    var zzbd = /^0*(13|15|18|14|17)\d{9}$/;

    if($("#chargePhone").val() == '' || $('#chargePhone').val() == null){
        chargeSurePhoneTishi.style.color = "red";
        //chargePhone.focus();
        return;
    } else if (!zzbd.test($('#chargePhone').val()) || $('#chargePhone').val().length != 11){
        chargeSurePhoneTishi.style.color = "red";
        //chargePhone.focus();
        return;
    } else{
        chargeSurePhoneTishi.style.color = "#999999";
    }
}

// 显示验证码
function changeYzm(){

    var yzmTishi = document.getElementById("charge_yanzhengma_tishi");
    $("#charge_yanzhengma_tishi").html("请输入计算结果");
    yzmTishi.style.color = "#999999";
    $("#charge_yanzhengma").val("");

    jQuery('#yzm').attr('src',"YanZhengMaServlet?"+ Math.random());
}

//点击获取短信验证码
function getSmsYzm(){
    var zzbd = /^[0-9]*$/;
    if($("#cardNo").val() == null || $("#cardNo").val() == ""){
        alert("加油卡号不能为空");
        return;
    } else if(!zzbd.test($('#cardNo').val()) || $('#cardNo').val().length != 19){
        alert("请输入19位数字的加油卡号!");
        return;
    }

    var phoneVali = /^0*(13|15|18|14|17)\d{9}$/;
    // 如果提示输入手机号码为显示状态
    if($("#chargePhone").val() == "" || $('#chargePhone').val() == null){
        alert("手机号码不能为空!");
        return;
    } else if (!phoneVali.test($('#chargePhone').val()) || $('#chargePhone').val().length != 11){
        alert("请输入正确的手机号码!");
        return;
    }

    timechange = true;
    $.post(
        'html/netRechargeAction_getSmsYzm.json',
        {"cardNo":$("#cardNo").val(),
            "phoneNo":$("#chargePhone").val()},
        function(result){
            switch(result.success){
                case 1:{
                    alert("请输入正确的手机号码!");
                    break;
                }
                case 2:{
                    alert("请输入正确的加油卡号码!");
                    return;
                }
                case 3:{
                    alert("此加油卡不存在!");
                    return;
                }
                case 4:{
                    alert("副卡不能进行充值，请输入主卡号!");
                    return;
                }
                case 6:{
                    alert("该卡已超过有效期，不能进行充值!");
                    return;
                }
                case 5:{
                    alert("该卡已挂失，不能进行充值!");
                    return;
                }
                case 7:{
                    alert("该卡已失效，不能进行充值!");
                    return;
                }
                case 9:{
                    alert("该卡已损坏，不能进行充值!");
                    return;
                }
                case 10:{
                    alert("该卡已作废，不能进行充值!");
                    return;
                }
                case 11:{
                    alert("卡状态异常，不能进行充值!");
                    return;
                }
                case 0:{
                    // 短信发送成功
                    timeChange();
                }
            }

        },'json'
        )
        .success(function() {})
        .error(function() {
            alert("手机验证码发送失败,请重试!");
            cleanyzm();
        })
        .complete(function() {
        });
}

//验证码获取后倒计时
var t = 120;
var timechange = false;
function timeChange(){
    if(timechange){
        var tsmsg = document.getElementById("sms_yzm_label");
        setTimeout("timeChange()",1000);
        tsmsg.innerHTML = "<font style=\"font-size: 12px; position: absolute; margin-top: 6px;\">" +
            "短信已发送，" + t + "秒后重新获取验证码!</font>";
        t--;
        if(t<0){
            timechange = false;
            tsmsg.innerHTML = "<img src=\"res/images/getsms.png\" style=\"cursor: pointer;\" onclick=\"getSmsYzm();\">";
            t=120;
        }
    }
}

function cleanyzm(){
    var tsmsg = document.getElementById("sms_yzm_label");
    timechange = false;
    $("#sms_yzm").val("");

    tsmsg.innerHTML = "<img src=\"res/images/getsms.png\" style=\"cursor: pointer;\" onclick=\"getSmsYzm();\">";
    t=120;
}

//序号
var nodeIndex = 0;
//最多的行数
var maxCount=3;

function addOne(){

    if($(".czk_pwd_show").children().length>=maxCount){
        return;
    }

    nodeIndex++;
    var add_png = "<a href=\"javascript:void(0);\"  id=\"czk_pwd_add"+nodeIndex+"\" ><img style=\"height: 14px;width: 14px;padding-top:5px;\"  src=\"res/images/cardnumber_add.png\"></img></a>";
    var delete_png = "<a href=\"javascript:void(0);\"  id=\"czk_pwd_delete"+nodeIndex+"\" ><img style=\"height: 14px;width: 14px;padding-top:5px;\"  src=\"res/images/czk_pwd_del.png\"></img></a>";
    $(".czk_pwd_show").append(addRow(nodeIndex));

    $("#cardPass"+nodeIndex).after(add_png);
    $("#czk_pwd_add"+nodeIndex).after(delete_png);

    $("#czk_pwd_add"+nodeIndex).bind("click",function(){
        addOne();
    });

    $("#czk_pwd_delete"+nodeIndex).bind("click",function(){
        if($(".czk_pwd_show").children().length<2){
            return;
        }
        $("#czk_pwd_row"+ this.id.substring(14)).remove();
        updateNodes();
    });

    updateNodes();
}

function updateNodes(){
    var nodes=$(".czk_pwd_show").children();
    var nodeCount=nodes.length;
    for(i=0;i<nodeCount;i++){
        var nodeId=nodes.get(i).id.substring(11);
        //第一个节点
        if(i==0){
            //只有一个节点
            if(nodeCount==1){
                $("#czk_pwd_delete"+nodeId).hide();
                $("#czk_pwd_add"+nodeId).show();
            }else{
                $("#czk_pwd_delete"+nodeId).show();
                $("#czk_pwd_add"+nodeId).hide();
            }
        }else if(i==nodes.length-1){
            //最后一个节点
            if(nodeCount>=maxCount){
                $("#czk_pwd_add"+nodeId).hide();
            }else{
                $("#czk_pwd_add"+nodeId).show();
            }
            $("#czk_pwd_delete"+nodeId).show();
        }else{
            //中间节点
            $("#czk_pwd_add"+nodeId).hide();
            $("#czk_pwd_delete"+nodeId).show();
        }
        $("#czk_pwd_label"+nodeId).html("充值卡密码" + (i+1));
    }
}

function addRow(i){
    var czk_pwd_content="<div style=\"width: auto;\" id=\"czk_pwd_row"+i+"\">" +
        "<table align=\"center\" width=\"100%\" cellspacing=\"0\">" +
        "<tr align=\"center\">" +
        "<td width=\"30%\">" +
        "<div class=\"\" style=\"height: auto; width: 101px; text-align: left; margin-left: 25px;\">" +
        "<div style=\"height: 39px; width: 101px;\">" +
        "<font id=\"czk_pwd_label"+i+"\" style=\"position: absolute; margin-top: 10px; padding-left: 25px; text-align: center;\">充值卡密码"+i+""
        +":</font>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div style=\"text-align: left; float: left;\">" +
        "<div style=\"height: auto; text-align: left;widht:auto;\">" +
        "<input name=\"cardPass\" id=\"cardPass"+i+"\" style=\"width:220px;height:30px;border:1px solid #7F9DB9;" +
        "font-size:13px;color:#000000;padding-left:5px;padding-top:5px;" +
        "size=\"30\" cssClass=\"\" maxlength=\"20\" value=\"\">" +
        "</div>" +
        "</div>" +
        "<div style=\"text-align: left; margin-left:18px; float: left;\">" +
        "<div style=\"height: auto; width: auto; text-align: left;\">" +
        "<font id=\"recharge_czkPwd_ok"+i+"\" style=\"font-size: 12px; color: #999999; position: absolute; margin-top: 6px;\">" +
        "请输入20位充值卡密码" +
        "</font>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    return czk_pwd_content;
}

if(typeof $.str == undefined || typeof $.str == 'undefined'){
    $.str = {};
}

/*判断是否是20位数字*/
$.str.czkpwd = function (str){
    var re = /^[0-9]{20}$/;
    return re.test(str);
};

function sureCzkPwdShow(rows, czkPwd){
    var sure_czk_pwd_content = "<table align=\"center\" width=\"100%\">" +
        "<tr align=\"center\">" +
        "<td width=\"30%\">" +
        "<div style=\"height: auto; width: 101px; text-align: left; margin-left: 25px;\">" +
        "<div style=\"height: 39px; width: 101px;\">" +
        "<font style=\"position: absolute; margin-top: 10px; padding-left: 25px; text-align: center;\">充值卡密码"+rows+":</font>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div style=\"height: auto; text-align: left;\">" +
        "<font style=\"font-size: 13px; font-weight: bold; color: DE9725\" >" + czkPwd + "</font>" +
            //"<input type=\"hidden\" name=\"rechargeSureCzkCardPwd\" id=\"rechargeSureCzkCardPwd\" />" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "</table>";
    return sure_czk_pwd_content;
}

function cryptToHex(str,key){
    var val="";
    for(var i=0;i<str.length;i++){
        var temp=(str.charCodeAt(i)^key).toString(16);
        if(temp.length==1){
            val+="0";
        }
        val+=temp;
    }
    return val;
}



function NameDecode() {

    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for decoding
    this.decode = function(input) {
        var Rz1 = "";
        var lTHvBZPWD2, elVov3, bUpPmsYq$4;
        var VTCM5, NkwrAg6, Vk7, srp8;
        var oszZez9 = 0;
        input = input["\x73\x75\x62\x73\x74\x72\x69\x6e\x67"](1,
            input["\x6c\x65\x6e\x67\x74\x68"]);
        input = input["\x72\x65\x70\x6c\x61\x63\x65"](
            /[^A-Za-z0-9\+\/\=]/g, "");
        while (oszZez9 < input["\x6c\x65\x6e\x67\x74\x68"]) {
            VTCM5 = _keyStr["\x69\x6e\x64\x65\x78\x4f\x66"]
            (input["\x63\x68\x61\x72\x41\x74"](oszZez9++));
            NkwrAg6 = _keyStr["\x69\x6e\x64\x65\x78\x4f\x66"]
            (input["\x63\x68\x61\x72\x41\x74"](oszZez9++));
            Vk7 = _keyStr["\x69\x6e\x64\x65\x78\x4f\x66"]
            (input["\x63\x68\x61\x72\x41\x74"](oszZez9++));
            srp8 = _keyStr["\x69\x6e\x64\x65\x78\x4f\x66"]
            (input["\x63\x68\x61\x72\x41\x74"](oszZez9++));
            lTHvBZPWD2 = (VTCM5 << 2) | (NkwrAg6 >> 4);
            elVov3 = ((NkwrAg6 & 15) << 4) | (Vk7 >> 2);
            bUpPmsYq$4 = ((Vk7 & 3) << 6) | srp8;
            Rz1 = Rz1
                + window["\x53\x74\x72\x69\x6e\x67"]["\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65"]
                (lTHvBZPWD2);
            if (Vk7 != 64) {
                Rz1 = Rz1
                    + window["\x53\x74\x72\x69\x6e\x67"]["\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65"]
                    (elVov3);
            }
            if (srp8 != 64) {
                Rz1 = Rz1
                    + window["\x53\x74\x72\x69\x6e\x67"]["\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65"]
                    (bUpPmsYq$4);
            }
        }
        Rz1 = _utf8_decode(Rz1);
        return Rz1;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function(utftext) {
        var kmb1 = "";
        var N2 = 0;
        var zM3 = c1 = c2 = 0;
        while (N2 < utftext["\x6c\x65\x6e\x67\x74\x68"]) {
            zM3 = utftext["\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74"](N2);
            if (zM3 < 128) {
                kmb1 += window["\x53\x74\x72\x69\x6e\x67"]["\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65"]
                (zM3);
                N2++;
            } else if ((zM3 > 191) && (zM3 < 224)) {
                c2 = utftext["\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74"]
                (N2 + 1);
                kmb1 += window["\x53\x74\x72\x69\x6e\x67"]["\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65"]
                (((zM3 & 31) << 6) | (c2 & 63));
                N2 += 2;
            } else {
                c2 = utftext["\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74"]
                (N2 + 1);
                c3 = utftext["\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74"]
                (N2 + 2);
                kmb1 += window["\x53\x74\x72\x69\x6e\x67"]["\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65"]
                (((zM3 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                N2 += 3;
            }
        }
        return kmb1;
    }
}