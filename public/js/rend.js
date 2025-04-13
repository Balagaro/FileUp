




function checkCookie(cname) {
    let user = getCookie(cname);
    if (user != "") {
        return user
    } else {
        return 0
    }
}
socket=io()



if (refreshed===false){
socket.emit('utonazuzenet', client)
}else{
    socket.emit('addaszamot', client)
}
socket.on('kaptalszamot', function (id){
    if (id==='Nincs aktív rendelésed.'){
        document.querySelector('.order_number').innerHTML=`${id}`
        document.querySelector('.order_number').classList.add('nincsmajom');
    }
    console.log('fortinajti')
    document.querySelector('.order_number').innerHTML=`${id}`
})

socket.on('gyeremacig', function (id){
    console.log("jovok", id)
    document.querySelector('.readyrendel').innerHTML=`
<div class="readyrendtext">A rendelésed elkészült!</div>
<div><img src="sutik/ready.png"></div>
    
   
    `
document.querySelector('.order_number').classList.add('order_ready_num');

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
eraseCookie('incartdb')