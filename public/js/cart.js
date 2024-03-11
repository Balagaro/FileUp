let queried={};
let adline="";
let uploaddiv=document.querySelector('.out_adbles')
let indatabase;

const socket=io()
socket.emit('items-req','joined')
socket.on('storage-query',function(data){
    indatabase=data;
    for (let i=0; i<data.length;i++){
        queried[data[i].id]=data[i]
        console.log(data[i])
        addline=`
        <div class="adbles_line">
            <div class="adpic"><img  src="./sutik/${data[i].picture}.png" alt="gofri"> </div>
            <div class="description">
                <div class="adtitle">${data[i].megnev}</div>
                <div class="adprice">${data[i].ar}ft</div>
                <button ontouchstart="document.addEventListener('touchstart', function() {}, false)" onclick="addToCart(${data[i].id})" class="buy">Kosárba</button>
            </div>
        </div>
        `
        //uploaddiv.insertAdjacentHTML('beforeend', addline);
    }
});

function alertison(aler){
    document.querySelector(".alerttext").innerHTML=`${queried[aler].megnev} bekerült a kosárba`
    document.querySelector('.fromtopalert').classList.add('alerting')
    setTimeout(function () {
        document.querySelector('.fromtopalert').classList.remove('alerting')
    },1500);
}
function addToCart(id) {
    document.querySelector('.cartdb').innerHTML=(document.querySelector('.cartdb').innerHTML*1)+1
    alertison(id)


}
function getCookie2(cname) {
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
function setCookie2(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function checkCookie2(cname) {
    let user = getCookie2(cname);
    if (user != "") {
        return user
    } else {
        return 0
    }
}

if(checkCookie2("cart")===0){
    uploaddiv.innerHTML=`
    <div class="ureskosar">A kosár üres!</div>
    `
}else{



}

