
console.log('xxxxooooo');
chrome.runtime.onMessage.addListener(  function(request, sender, sendResponse) {
    if(request.code == 0){
        sendResponse({ok: 1});
        let u = document.getElementById('username');
        let p = document.getElementById('password_input');
        let s = document.getElementById('tcloud_login_button');
        u.value = request.data.a;
        p.value = request.data.p;
        s.click();
    }

});
