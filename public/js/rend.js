console.log('nyomod')
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
/*
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}*/

function eraseCookie(name) {
    document.querySelector('.outloader').style=
        document.cookie = name+'=; Max-Age=-99999999;';

    setTimeout(function () {
        location.replace(location.href);
    },1000);

}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkCookie(cname) {
    let user = getCookie(cname);
    if (user != "") {
        return user
    } else {
        return 0
    }
}
socket=io()
socket.emit('utonazuzenet', client)
socket.on('gyeremacig', function (id){
    console.log("jovok", id)
    document.querySelector('.readyrendel').innerHTML=`
<div><img src="sutik/ready.png"></div>
    
   <div>A rendelésed elkészült!</div>
    `
    document.querySelector('.bevezetoszoveg').innerHTML=`
    A rendelésed elkészült!
    `

})

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
/*
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}*/

function eraseCookie(name) {
        document.cookie = name+'=; Max-Age=-99999999;';

    setTimeout(function () {
        location.replace(location.href);
    },1000);

}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkCookie(cname) {
    let user = getCookie(cname);
    if (user != "") {
        return user
    } else {
        return 0
    }
}

eraseCookie('cart')
eraseCookie('cartamount')