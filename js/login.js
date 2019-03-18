//alert('qq');
console.log('login');
let config = {};
config.setLogin = {};
config.setLogin.cUrl = '';
config.setLogin.currStep = 0;
config.setLogin.processArr = ['login', 'next', 'passwd', 'captcha', 'sumbit', 'confirm'];
config.setLogin.tips ={'login':'确定选择当前为 [帐号输入框] 么？', 'next':'确定选择当前为 [下一步按鈕] 么, 取消跳过？', 'passwd':'确定选择当前为 [密碼输入框] 么？', 'captcha':'需要輸入驗證碼麼，取消跳过？', 'sumbit':'确定选择当前为 [提交] 么？', 'confirm':'完成请点确定，取消请刷新当前页重头开始! '};
config.setLogin.process = {'login':null, 'next':null, 'passwd':null, 'captcha':null, 'sumbit':null};
config.userLogin = {}

function init() {
    $.ajax({
        type: 'GET',
        url: 'https://miniapp-test.ipuppy.vip/site-configs/'+getCurrentUrl(),//'http://homestead.puppy/site-configs',
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

function userLogin() {
    this.intervalCheckPasswd = 0;

    this.exec = function (data, account) {
        console.log('account:', account);
       // let loginData = JSON.parse(data);

        for (x in data)
        {
            if(x == 'login'){
              let ele =   data[x].T == 'I'? $('#'+data[x].V) : (data[x].T == 'N' ? $(data[x].V) : $(data[x].V));
                ele.val(account.a);
                ev = document.createEvent("HTMLEvents");
                ev.initEvent("change", false, true);
                ele.dispatchEvent(ev);
            }
            if(x == 'next' && (data[x].V != '' || data[x].V != undefined) ){
                let ele =   data[x].T == 'I'? $('#'+data[x].V) : (data[x].T == 'N' ? $(data[x].V) : $(data[x].V));
                ele.click();
            }
            if(x == 'passwd' && (data[x].V != '' || data[x].V != undefined) ){
                let ele =   data[x].T == 'I'? $('#'+data[x].V) : (data[x].T == 'N' ? $(data[x].V) : $(data[x].V));
                ele.val(account.p);
            }
            if(x == 'captcha' && (data[x].V != '' || data[x].V != undefined) ){
                let ele =   data[x].T == 'I'? $('#'+data[x].V) : (data[x].T == 'N' ? $(data[x].V) : $(data[x].V));
                ele.val(account.p);
            }

            if(x == 'sumbit' && (data[x].V != '' || data[x].V != undefined) ){
                let ele =   data[x].T == 'I'? $('#'+data[x].V) : (data[x].T == 'N' ? $(data[x].V) : $(data[x].V));
                ele.click();
            }
            //document.write(mycars[x] + "<br />")
        }



    }

    this.checkLoign = function() {


        let data = config.userLogin.loginData;

        let ele =   data['login'].T == 'I'? $('#'+data['login'].V) : (data['login'].T == 'N' ? $(data['login'].V) : $(data['login'].V));

        return ele;
        // ele.val(account.a);



        let loginNames = ['email', 'u','username', 'user_principal_name', 'loginfmt', 'data[Login][email]', 'LoginForm[username]'], u = null;

        for(j = 0,len=loginNames.length; j < len; j++) {
            u = document.getElementsByName(loginNames[j]);
            if(u != null && u.length > 0 ){
                console.log('loginname', loginNames[j]);
                return u[0];
            }else{
                u = null;
            }
        }
        return u;
    }

    this.checkPasswd = function() {
        let loginNames = ['password', 'p','passwd', 'user_principal_name', 'data[Login][password]', 'LoginForm[password]'], p = null;

        for(j = 0,len=loginNames.length; j < len; j++) {
            p = document.getElementsByName(loginNames[j]);
            if(p != null && p.length > 0 ){
                clearInterval(intervalCheckPasswd);
                return p[0];
            }else {
                p = null;
            }
        }
        return p;
    }

    this.checkNext = function() {
        let loginIds = ['idSIButton9', 'J_FormNext'], n = null;

        for(j = 0,len=loginIds.length; j < len; j++) {
            n = document.getElementById(loginIds[j]);
            if(n != null){
                return n;
            }
        }
        return null;
    }

    this.submit = function () {
        let logins = ['login-form'], s = null;
        for(j = 0,len=logins.length; j < len; j++) { //form;
            s = document.getElementsByClassName(logins[j]);
            if(s != null && s.length > 0){
                s[0].submit();
            }else{
                s = null;
            }
        }

        let loginIds = ['login_button', 'tcloud_login_button', 'idSIButton9'];

        for(j = 0,len=loginIds.length; j < len; j++) {
            s = document.getElementById(loginIds[j]);
            if(s != null){
                s.click();
                break;
            } else {
                s = null;
            }
        }

    }

    /*

    function startListener() {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.code == 0) {
                sendResponse({ok: 1});
                let u = document.getElementById('u');
                let p = document.getElementById('p');
                let s = document.getElementById('login_button');
                u.value = request.data.a;
                p.value = request.data.p;
                s.click();
            }

        });
    }
    */

    this.runNext = function(passwd){
        let p = checkPasswd();
        p.value = passwd;
        //触发一下事件
        ev = document.createEvent("HTMLEvents");
        ev.initEvent("change", false, true);
        p.dispatchEvent(ev);
        submit();
    }

    return this;
    alert(222);

}

function getCurrentUrl(){

    let l = document.createElement("a");
    l.href = window.location.href;
    let parseUrlArr = l;
    config.setLogin.cUrl = parseUrlArr.hostname; //parseUrlArr.pathname != undefined ? parseUrlArr.hostname+parseUrlArr.pathname : parseUrlArr.hostname;
    if(config.setLogin.cUrl.indexOf('qq.com') != -1){
        config.setLogin.cUrl = 'qq.com';
    }
    return config.setLogin.cUrl;
}

function setLogin() {

    // this.getCurrentUrl = function() {
    //
    //     let l = document.createElement("a");
    //     l.href = window.location.href;
    //     let parseUrlArr = l;
    //     config.setLogin.cUrl = parseUrlArr.hostname; //parseUrlArr.pathname != undefined ? parseUrlArr.hostname+parseUrlArr.pathname : parseUrlArr.hostname;
    //     if(config.setLogin.cUrl.indexOf('qq.com') != -1){
    //         config.setLogin.cUrl = 'qq.com';
    //     }
    //     return config.setLogin.cUrl;
    // }

    this.setOnClick = function () {

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
                        url: 'https://miniapp-test.ipuppy.vip/site-configs',//'http://homestead.puppy/site-configs',
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
                    console.log('阴止事件');
                    $(e.target).off(); //关闭一些事件
                    e.preventDefault(); //.preventDefault();
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
                    config.setLogin.process[currStep].V =  e.target.className;
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
                        config.setLogin.process[currStep].V =  e.target.className;
                        config.setLogin.process[currStep].T =  'C';
                    }

                }


                config.setLogin.currStep++;

                chrome.runtime.sendMessage({"ac": "setLoginCurrStep", "process": config.setLogin.process, 'currStep': config.setLogin.currStep}, function(response) {
                    if(response.code != undefined && response.code == 0){
                        console.log('同步成功', response);
                    }


                });//end  sendMessage

                //document.write("You pressed OK!")
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

                //document.write("You pressed Cancel!")
            }
            console.log('currStep != \'next\'', currStep != 'next');

            if(currStep != 'next'){//cancel 就是取消{
                console.log('阴止事件');
                $(e.target).off(); //关闭一些事件
                e.preventDefault(); //.preventDefault();
            }


            // e.target, e.srcElement and e.toElement contains the element clicked.
           // alert("User clicked a " + e.target.name + " element.");
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
//var login = new login();

function run () {
   // let userLogin1 =  new userLogin();

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



        if (request.code == 0) {
            sendResponse({ok: 1});
           // userLogin1.loginData = request.data;

            userLogin1.exec(config.userLogin.loginData, request.data);
            return;



            //
            u.value = request.data.a;

            //触发一下事件
            ev = document.createEvent("HTMLEvents");
            ev.initEvent("change", false, true);
            u.dispatchEvent(ev);

            let n = userLogin1.checkNext();
            if(n != null){
                intervalCheckPasswd = setInterval(function()
                {
                    console.log('request.data.p', request.data.p);
                    userLogin1.runNext( request.data.p);
                },1000);
                return n.click();
            }
            let p = userLogin1.checkPasswd();
            p.value = request.data.p;
            sendResponse({ok: 1});
            userLogin1.submit();
        }

    });

    /*
    let u = userLogin1.checkLoign();
    console.log('loginjs.u主', u);
    if(u == null){
        console.log('没有登录页主');
       // return sendResponse({code:-1, msg: "没有登录信息"});
        return chrome.extension.sendMessage(  {code:-1, msg: "没有登录信息"}, function(response) {  console.log(response); }  );
    }
    return chrome.extension.sendMessage(  {code:0, msg: "有登录"}, function(response) {  console.log(response); }  );
*/
}



init();
run();


//setLogin.setGreenLine();

