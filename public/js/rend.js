




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


/*
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}*/

function eraseCookie(name) {
    //document.querySelector('.outloader').style=
        document.cookie = name+'=; Max-Age=-99999999;';



}


eraseCookie('cart')
eraseCookie('cartamount')