var AllTabsLogins = {};

var parseUrl = function(href) {//getLocation
    var l = document.createElement("a");
    l.href = href;

    return l;
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { //被动接受


    console.log('request.from.tab', request);
    console.log('sender', sender);
    console.log('sendResponse', sendResponse);
    let url = parseUrl(sender.url);
    let cUrl = url.hostname; //parseUrlArr.pathname != undefined ? parseUrlArr.hostname+parseUrlArr.pathname : parseUrlArr.hostname;
    if(cUrl.indexOf('qq.com') != -1){
        cUrl = 'qq.com';
    }

    AllTabsLogins[cUrl] = request;//.code == 0 ;

    if(request.ac == 'getLoginCurrStep'){
        let currStep = AllTabsLogins[cUrl].currStep != undefined ? AllTabsLogins[cUrl].currStep : 0;
        return sendResponse({'currStep':currStep});
    }

    if(request.ac == 'setLoginCurrStep'){
        AllTabsLogins[cUrl].currStep = request.currStep;
        AllTabsLogins[cUrl].process = request.process;
        console.log('AllTabsLogins', AllTabsLogins);
        return sendResponse({'code':0});

    }



    return sendResponse({'code':-1});


    // normalProcess();
});

var getAllTabsStatus = function(){
    return AllTabsLogins;
}
