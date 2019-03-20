//alert('qq');
console.log('login');
let config = {};
config.server = 'https://miniapp.ipuppy.vip';
config.setLogin = {};
config.setLogin.cUrl = '';
config.setLogin.currStep = 0;
config.setLogin.processArr = ['login', 'next', 'passwd', 'captcha', 'submit', 'confirm'];
config.setLogin.tips ={'login':'确定选择当前为【 帐号输入框 】么？', 'next':'确定选择当前为【 下一步按鈕 】么？, 按取消跳过！', 'passwd':'确定选择当前为 【 密碼输入框 】么？', 'captcha':'确定选择当前为 【 验证码输入框 】么？，按取消跳过！', 'submit':'确定选择当前为 【 提交按钮 】么？', 'confirm':'完成请点确定，取消请刷新当前页从头开始! '};
config.setLogin.process = {'login':null, 'next':null, 'passwd':null, 'captcha':null, 'submit':null};
config.userLogin = {}
function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}
function init() {
    $.ajax({
        type: 'GET',
        url: config.server+'/site-configs/'+getCurrentUrl(),//'http://homestead.puppy/site-configs',
        dataType: 'json',
        timeout: 300,
        success: function(data){
            config.userLogin.loginData = data;
            console.log('得到站点的配置11'+getCurrentUrl(), data);
        },
        error: function(xhr, type){
            // alert('Ajax error!')
        }
    })

}
function btnClick(type) {
    let userlogin1 = new userLogin();
    let ele1 = userlogin1.getElement(config.userLogin.loginData, type);
    ele1.click();

    if(ele1.disabled) {
        setTimeout("btnClick('"+type+"')",1000);
    }
}
function userLogin() {
    this.intervalCheckPasswd = 0;
    this.intervalRunCnt = 0;

    this.getElement = function(data, x){
        return data[x].T == 'I'? document.querySelector('#'+data[x].V) : (data[x].T == 'N' ? document.querySelector("[name='" + data[x].V + "']") : document.querySelector(data[x].V));
    }


    this.exec = function (data, account) {
        console.log('account:', account);

         let evtFocus = document.createEvent('HTMLEvents');
         evtFocus.initEvent('focus', true, true);

        let evtChange = document.createEvent('HTMLEvents');
        evtChange.initEvent('change', true, true);

        let evtOnChange = document.createEvent('HTMLEvents');
        evtOnChange.initEvent('onchange', true, true);

        let evtClick = document.createEvent('HTMLEvents');
        evtClick.initEvent('click', true, true);


        for (x in data)
        {
            let ele = this.getElement(data, x)

         if(ele == '' || ele == undefined || ele.length == 0){
                continue;
            }

            switch (x){
                case 'login':
                    ele.value = account.a;
                    ele.dispatchEvent(evtFocus);
                    ele.dispatchEvent(evtChange);
                    ele.dispatchEvent(evtOnChange);
                    break;
                case  'passwd':
                    ele.value = account.p;
                    ele.dispatchEvent(evtFocus);
                    ele.dispatchEvent(evtChange);
                    ele.dispatchEvent(evtOnChange);
                    break;
                case 'next':
                    ele.click();
                    break;
                case 'submit':
                   let that = this;
                    setTimeout("btnClick('submit')",1000)
                    break;
            }

        }

    }

    this.checkLoign = function() {

        let data = config.userLogin.loginData;
        console.log('checklogin data', data);
        if(data == '' || data == undefined || data.length == 0){
            return null;
        }

        let ele =   data['login'].T == 'I'? $('#'+data['login'].V) : (data['login'].T == 'N' ? $(data['login'].V) : $(data['login'].V));

        return ele;
    }


}

function getCurrentUrl(){

    let l = document.createElement("a");
    l.href = window.location.href;
    let parseUrlArr = l;
    config.setLogin.cUrl = parseUrlArr.hostname; //parseUrlArr.pathname != undefined ? parseUrlArr.hostname+parseUrlArr.pathname : parseUrlArr.hostname;
    // if(config.setLogin.cUrl.indexOf('qq.com') != -1){
    //     config.setLogin.cUrl = 'qq.com';
    // }
    return config.setLogin.cUrl;
}

function setLogin() {

    this.setOnClick = function () {
        $('form').attr('onsubmit','return false;');
        $('form').attr('action','');


        $('form').bind('submit', function (e) {
            alert(1);
            e.preventDefault();

        });

        getCurrentUrl();
        chrome.runtime.sendMessage({"ac": "getLoginCurrStep"}, function(response) {
               console.log('setLoginCurrStep', response);
               config.setLogin.currStep = response.currStep;
            });//end  sendMessage


        document.onclick = function (e) {

            //let that = this;
            let currStep = config.setLogin.processArr[config.setLogin.currStep];
            let tip = config.setLogin.tips[currStep];

            var r=confirm(tip)
            if (r==true)
            {
                if(currStep == 'confirm') {//cancel 就是取消
                    $.ajax({
                        type: 'POST',
                        url: config.server+'/site-configs',//'http://homestead.puppy/site-configs',
                        // data to be added to query string:
                        data: { data:  config.setLogin.process, url: config.setLogin.cUrl },
                        // type of data we are expecting in return:
                        dataType: 'json',
                        timeout: 300,
                        success: function(data){
                            console.log('submitLoginStep', data)
                        },
                        error: function(xhr, type){
                            // alert('Ajax error!')
                        }
                    })
                    console.log('阴止事件2');
                    $(e.target).off(); //关闭一些事件
                    e.preventDefault(); //.preventDefault();
                    location.reload();
                    return;

                }

                config.setLogin.process[currStep] = {};
                config.setLogin.process[currStep].V =  "";
                config.setLogin.process[currStep].T =  "";

                if(e.target.id != ""){
                    config.setLogin.process[currStep].V =  e.target.id;
                    config.setLogin.process[currStep].T =  'I';
                }

                if( config.setLogin.process[currStep].V == "" && e.target.name != "" && e.target.name != undefined){
                    config.setLogin.process[currStep].V =  e.target.name;
                    config.setLogin.process[currStep].T =  'N';
                }


                if( (config.setLogin.process[currStep].V == "" || config.setLogin.process[currStep].V == undefined) && (e.target.className != "" || e.target.className != undefined)){
                    let className = e.target.className.replace(/\s/g, ".");
                    config.setLogin.process[currStep].V =  "." + className.replace(".ipuppy_green_line", "");
                    config.setLogin.process[currStep].T =  'C';
                }
                console.log('config.setLogin.process[currStep].V', config.setLogin.process[currStep].V);

                if( config.setLogin.process[currStep].V == "" || config.setLogin.process[currStep].V == undefined){
                    config.setLogin.process[currStep].V = "";

                    let parentElement = $(e.target).parent().first();
                    parentElement = parentElement[0];
                    console.log('$(e.target).parent().first()', parentElement);

                    if(parentElement.id != ""){
                        config.setLogin.process[currStep].V = parentElement.id;
                        config.setLogin.process[currStep].T =  'I';
                    }

                    if( config.setLogin.process[currStep].V == "" && parentElement.name != "" && parentElement.name != undefined){
                        config.setLogin.process[currStep].V =  parentElement.name;
                        config.setLogin.process[currStep].T =  'N';
                    }

                    if( config.setLogin.process[currStep].V == "" && e.target.className != "" && e.target.className != undefined){
                        let className = e.target.className.replace(/\s/g, ".");
                        config.setLogin.process[currStep].V =  "." + className.replace(".ipuppy_green_line", "");
                        config.setLogin.process[currStep].T =  'C';
                    }

                }


                config.setLogin.currStep++;

                chrome.runtime.sendMessage({"ac": "setLoginCurrStep", "process": config.setLogin.process, 'currStep': config.setLogin.currStep}, function(response) {
                    if(response.code != undefined && response.code == 0){
                        console.log('同步成功', response);
                    }

                });//end  sendMessage

            }
            else
            {

                if(currStep == 'next' || currStep == 'captcha'){//cancel 就是取消
                    config.setLogin.currStep++;

                    chrome.runtime.sendMessage({"ac": "setLoginCurrStep", "process": config.setLogin.process, 'currStep': config.setLogin.currStep}, function(response) {
                        if(response.code != undefined && response.code == 0){
                            console.log('同步成功', response);
                        }


                    });
                }
                if(currStep == 'confirm') {//cancel 就是取消
                    console.log('阴止事件2');
                    $(e.target).off(); //关闭一些事件
                    e.preventDefault(); //.preventDefault();
                    location.reload();
                    return;
                }

            }

            console.log('currStep != \'next\'', currStep != 'next');

            if(currStep != 'next'){//cancel 就是取消{
                console.log('阴止事件1');
                $(e.target).off(); //关闭一些事件
                e.preventDefault(); //.preventDefault();
                return false;
            }

        };
    }

    this.setGreenLine = function () {
        let element = null;

        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) { // enter 键
                //要做的事情
            }
        };

        document.onmouseover = function (e) {
            element = e.target;

            $(element).addClass('ipuppy_green_line');
            $(element).attr('tittle', 'please press enter for confirm');
        }

        document.onmouseout = function (e) {
            //console.log('setGreelineRemove', e);
            element = e.target;
            $(element).removeClass('ipuppy_green_line');
            $(element).attr('tittle', '');
        }

    }
}

function run () {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        let userLogin1 =  new userLogin();
        let u = userLogin1.checkLoign();


        if(request.code == 1){ //查询是不是存在登录页
            console.log('loginjs.u被', u);
            if(u == null){
                console.log('没有登录页被');
                return sendResponse({code:-1, msg: "没有登录信息"});
                return chrome.extension.sendMessage(  {code:-1, msg: "没有登录信息"}, function(response) {  console.log(response); }  );
            }
            console.log('loginjs.u被', '有登录');
            sendResponse({code:0, msg: "有登录"});
        }

        if(request.code == 2){ //设置登录和密码框
            let setLogin1 = new setLogin();
            console.log('进入设置页面');
            setLogin1.setGreenLine();
            setLogin1.setOnClick();
            sendResponse({code:0, msg: "有登录"});
        }



        if (request.code == 0) {//
            sendResponse({ok: 1});
            userLogin1.exec(config.userLogin.loginData, request.data);

        }

    });

}



init();
run();



