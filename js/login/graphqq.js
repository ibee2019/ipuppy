//alert('qq');
console.log('graphqq');
chrome.runtime.onMessage.addListener(  function(request, sender, sendResponse) {
    if(request.code == 0){
        sendResponse({ok: 1});
        let u = document.getElementById('u');
        let p = document.getElementById('p');
        let s = document.getElementById('login_button');
        u.value = request.data.a;
        p.value = request.data.p;
        s.click();
    }
    // console.log('request',request);
    // console.log('sender',sender);
    // console.log('sendResponse',sendResponse);
    // if(request.a != undefined){
    //     alert(request.a);
    // }

});
