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
        //console.log(data[i])
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
        document.querySelector(`.${data[i].type}`).insertAdjacentHTML('beforeend', addline);
    }

});


function setCookie2(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}

let incart, cartamount, dbcart, incartdb;
console.log(getCookie('incartdb'))

if(getCookie2('incartdb')>0){
        incartdb=parseInt(getCookie2('incartdb'))

        //console.log(incartdb);
        document.querySelector('.cartdb').innerHTML=incartdb
    }else{
    setCookie2('incartdb', 0,1)
    //document.querySelector('.cartdb').innerHTML=0
}

if (getCookie2('cart')!==""){
    incart=(getCookie2('cart'))
    incart=incart.split(',')
    incart = incart.map(function (x) {
        return parseInt(x, 10);
    });
    //console.log(incart);
    //document.querySelector('.cartdb').innerHTML=incart.length
}
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

     incartdb=parseInt(getCookie2('incartdb'))
    setCookie2('incartdb',incartdb+1)
    if (checkCookie2('cart')===0){
        //console.log(`set cookie to ${id}`)
        setCookie2('cartamount', 1,1)
        setCookie2('cart', id, 1)
    } else{
        incart=(getCookie2('cart'))
        incart=incart.split(',')
        incart = incart.map(function (x) {
            return parseInt(x, 10);
        });

        if(incart.includes(id)){
            //console.log("sokadik")
            incart=(getCookie2('cart'))
            incart=incart.split(',')
            incart = incart.map(function (x) {
                return parseInt(x, 10);
            });
            cartamount=(getCookie2('cartamount'))
            cartamount=cartamount.split(',')
            cartamount = cartamount.map(function (x) {
                return parseInt(x, 10);
            });
            //console.log('2')
            cartamount[incart.indexOf(id)]++;
            //console.log(cartamount[incart.indexOf(id)])
            setCookie2('cartamount', cartamount,1)
            //console.log(incart)
            //console.log(cartamount)
        } else{
            //console.log("elso")
            incart=(getCookie2('cart'))
            incart=incart.split(',')
            incart = incart.map(function (x) {
                return parseInt(x, 10);
            });
            cartamount=(getCookie2('cartamount'))
            cartamount=cartamount.split(',')
            cartamount = cartamount.map(function (x) {
                return parseInt(x, 10);
            });
            //console.log('1.1')
            cartamount.push(1);
            incart.push(id)

            setCookie2('cartamount', cartamount,1)
            setCookie2('cart', incart, 1)
            //console.log(incart)
            //console.log(cartamount)
        }

        //console.log(incart)
        //incart+=`, ${id}`
        //console.log(`set cookie to ${incart}`)

    }


    //console.log(getCookie2('cart'))
    //console.log(getCookie2('cartamount'))

}

/*
const maxVisibleActions = window.Notification?.maxActions;

if (maxVisibleActions) {
    options.body = `Up to ${maxVisibleActions} notification actions can be displayed.`;
} else {
    options.body = 'Notification actions are not supported.';
}ration.showNotification(title, options);*/


