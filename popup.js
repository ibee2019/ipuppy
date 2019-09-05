var rUrl = 'https://miniapp.ipuppy.vip/qr-logins';
var id = '';
var intervalQueryLogin;
var queryLoginCnt = 0;
var cUrl = "";
var noLogin = true;
//var logins = ["qq.com", "www.tapd.cn/cloud_logins/login"];
var parseUrl = function(href) {//getLocation
    var l = document.createElement("a");
    l.href = href;

    return l;
};



function getQrPasswd() {
    let mUrl = cUrl;
    if(! $("#conect").is(":checked")){
        mUrl = "";
    }
    let passStr = JSON.stringify({"ac":"NEW", "account":$("#account").val().replace(/(^\s*)|(\s*$)/g, ""), "passwd":$("#passwd").val().replace(/(^\s*)|(\s*$)/g, ""), "url":mUrl});
    console.log('passStr', passStr);
    $('#tab2').html('<div id="qrcode1" align="center"></div><span class="tip">Tips:请打开微信扫码并保存！</span>');
   // passStr.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
    let qrcode = new  QRCode("qrcode1");
    /*
    {
        text: "a",
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff",
        typeNumber:4,
        correctLevel : QRCode.CorrectLevel.H
    }
     */

   // ('#qrcode1').innerHTML = create_qrcode(passStr, 0, 'M', 'Byte', 'UTF-8');

    qrcode.makeCode(passStr);
}

function getQrlogin() {
    $('#tab1').html('<div id="qrcode"></div>');
    //发起请求；
    var res =  $.post(rUrl, {"url":cUrl}, function(res){
        if(res.code == -1){
            return systemError();
        }
        id = res.data.sessid;
        let qrinfo =  JSON.stringify({"ac":"LOGIN", "url":cUrl, "id":res.data.sessid});
        // alert(qrinfo);
        let qrcode = new  QRCode("qrcode", {
            text: "a",
            width: 300,
            height: 300,
            colorDark : "#000000",
            colorLight : "#ffffff",
            typeNumber:4,
            correctLevel : QRCode.CorrectLevel.H
        });
        qrcode.makeCode(qrinfo);
        intervalQueryLogin = setInterval(queryLogin,1000);
    })
}

function getCurrentUrl() {
    if(queryLoginCnt>0){
        return;
    }
    clearInterval(intervalQueryLogin);
    return chrome.tabs.query({active:true,windowType:"normal", currentWindow: true},function(d){
        let url = d[0].url;
        let title = d[0].title;
        let parseUrlArr = parseUrl(url);
        cUrl = parseUrlArr.hostname; //parseUrlArr.pathname != undefined ? parseUrlArr.hostname+parseUrlArr.pathname : parseUrlArr.hostname;
        // if(cUrl.indexOf('qq.com') != -1){
        //     cUrl = 'qq.com';
        // }
        startListener();
    });

}


function queryLogin() {
    queryLoginCnt++;
    $.get(rUrl+'/'+id, function(res){
        console.log(res);
        if(res.code < 0){
            return false;
        }
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            if(tabs[0].url == 'chrome://newtab/'){
                return true;
            }
            chrome.tabs.sendMessage(tabs[0].id, res, function(response) {
                if(response !=undefined && response.ok == 1){
                    clearInterval(intervalQueryLogin);
                }
            });//end  sendMessage
        }); //end quer
    })
    if(queryLoginCnt > 20){
        qrExpired();
        clearInterval(intervalQueryLogin);
    }
}

function noQrLogin() {
   return $('#tab1').html('<img src="img/qqgroup.jpeg" width="180px"><div class="tip">当前网站不是登录页，或此网站还未能支持扫码登录！ 请联系技术支持qq 群 728682953</div>');
}

function systemError() {
    $('#tab1').html('<div class="tip">发生了其它错误！ 请联系技术支持qq 群 728682953</div>');
}

function noLoginInfo() {
    $('#tab1').html('<div class="tip">未能匹配到你的登录信息！ 请联系技术支持qq 群 728682953</div>');
}

function qrExpired() {
    $('#tab1').html('<div class="tip">二维码已过期</div>');
    queryLoginCnt = 0;
}

function startListener() {
    bindClick();
    var bg = chrome.extension.getBackgroundPage();
    let allTabsStatus = bg.getAllTabsStatus();//test()是background中的一个方法
    console.log('allTabsStatus', allTabsStatus);
    console.log(cUrl);
    console.log('allTabsStatus', allTabsStatus[cUrl]);
    console.log('-------------');

    if(allTabsStatus[cUrl]){
        noLogin = false;
        console.log('c nm ');
        return getQrlogin();
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ //主动查询

        if(tabs[0].url == 'chrome://newtab/'){
            return true;
        }
        chrome.tabs.sendMessage(tabs[0].id, {code:1}, function(response) {
            console.log('response Lister', response);
            if(response == undefined || response.code < 0 ){
                return noQrLogin();
            }
            noLogin = false;
          //  alert('来了没有');
            console.log('主noLogin', noLogin);
            getQrlogin();
            //normalProcess();
        });//end  sendMessage
    }); //end quer

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { //被动接受
        console.log('request.from.tab', request);
        if(request.code < 0){
            return noQrLogin();;
        }
        noLogin = false;
       // alert('来了没有');
        console.log('被noLogin', noLogin);
        getQrlogin();
       // normalProcess();
    });

}

function startSetting() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ //设置通知
        if(tabs[0].url == 'chrome://newtab/'){
            return true;
        }
        chrome.tabs.sendMessage(tabs[0].id, {code:2}, function(response) {
            console.log('response Lister', response);
            if(response == undefined || response.code < 0 ){
                $('#tab3').html('启动设置失败');
                return false;
            }
            $('#tab3').html('请开始标记，登录框，密码框 ，提交页，如果有下一步也请标出！');

        });//end  sendMessage
    }); //end quer

}

function bindClick() {
    $("ul.tabs a").click(function() {
        if(queryLoginCnt>20){
            queryLoginCnt = 0;
        }
        if($(this).attr("href") == '#tab1' && queryLoginCnt>0){
            return;
        }
        $(this).parent().parent().find('li').removeClass("selected");
        $(".content div").hide();
        $($(this).attr("href")+' div').show();
        $($(this).attr("href")).show();
        console.log('$($(this).attr("href")+\' div\').show()', $(this).attr("href")+' div');
        $(this).parent().addClass("selected");

        $('#tab2').html('     <table>\n' +
            '            <tr>\n' +
            '                <td>帐号：</td><td><input id="account" type="text"></td>\n' +
            '            </tr>\n' +
            '            <tr>\n' +
            '                <td>密码：</td><td><input id="passwd" type="password"></td>\n' +
            '            </tr>\n' +
            '            <tr>\n' +
            '                <td>关联当前站点：</td><td><input id="conect" type="checkbox"></td>\n' +
            '            </tr>\n' +
            '        </table>\n' +
            '       <center> <input type="button" id="submit" value="生 成"></center>');

        $('#submit').click(
            function () {
                getQrPasswd();
            }
        );
        console.log('noLogin', noLogin);
        if($(this).attr("href") == '#tab1' && ! noLogin ){
            getQrlogin();
        }

        if($(this).attr("href") == '#tab3' ){
            startSetting();
        }
    });

}



Zepto(function($){
    getCurrentUrl();
})
