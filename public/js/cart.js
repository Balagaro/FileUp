let queried={};
let adline="";
let uploaddiv=document.querySelector('.out_adbles')
let indatabase, incart, cartamount, i, index;
let fullprice=0;
const socket=io()
socket.emit('items-req','joined')
socket.on('storage-query',function(data){
    indatabase=data;
    for (let i=0; i<data.length;i++){
        queried[`${data[i].id}`]=data[i]
        //console.log(data[i])
        /*addline=`
        <div class="adbles_line">
            <div class="adpic"><img  src="./sutik/${data[i].picture}.png" alt="gofri"> </div>
            <div class="description">
                <div class="adtitle">${data[i].megnev}</div>
                <div class="adprice">${data[i].ar}ft</div>
                <button ontouchstart="document.addEventListener('touchstart', function() {}, false)" onclick="addToCart(${data[i].id})" class="buy">Kosárba</button>
            </div>
        </div>
        `*/
        //uploaddiv.insertAdjacentHTML('beforeend', addline);
    }
    if(checkCookie2("cart")===0){
        uploaddiv.innerHTML=`
    <div class="ureskosar">A kosár üres!</div>
    `
    }else {
        incart = (getCookie2('cart'))
        incart = incart.split(',')
        incart = incart.map(function (x) {
            return parseInt(x, 10);
        });


        cartamount = (getCookie2('cartamount'))
        cartamount = cartamount.split(',')
        cartamount = cartamount.map(function (x) {
            return parseInt(x, 10);
        });
        console.log(incart)
        for (i = 0; i < incart.length; i++) {
            //console.log(queried[incart[i]].megnev)
            socket.emit('get-variations', queried[incart[i]].id)
            fullprice+=(queried[incart[i]].ar*cartamount[i])
            addline = `
<div class="out_adcart" id="out_adcart${queried[incart[i]].id}">
<input style="display: none;position: absolute" type="number" name="id" value="${queried[incart[i]].id}">
            <div id="adline${queried[incart[i]].id}" class="adbles_line ">
  
                <div class="adpic"><img  src="./sutik/${queried[incart[i]].picture}.png" alt="gofri"> </div>
                <div class="description">
                <div class="adtitle">${queried[incart[i]].megnev}</div>
                <div class="titleprice">
                    <div class="adprice">${queried[incart[i]].ar}ft</div>
                    
                    <div class="cart_db"><input onchange="changeQuantity(${queried[incart[i]].id})" inputmode="numeric" pattern="[0-9]*" type="text" id="cartdbid${queried[incart[i]].id}" class="cartdbin" maxlength="1" minlength="1" name="cartdb" value="${cartamount[i]}" min="1">db</div>
                    <button onclick="removeItem(${queried[incart[i]].id})" class="deleteimg"><img src="./sutik/trash.svg" alt="torles"> </button>
                </div></div>
                
                <div>
                
</div>
                
            </div>
            
            
            </div>
            `

            document.querySelector(`.out_adbles`).insertAdjacentHTML('beforeend', addline);
}
        document.querySelector('.fullprice').value=`${fullprice}Ft`
        //console.log()
    }});

let element, id;
/*
socket.on("variations-queried", function (result){
    let contents=[];
    let vari={}
    let varid={}
    element=result.result
    console.log(element)
    for (f=0;f<element.length;f++){
        vari[element[f].type]=[]
        varid[element[f].type]=[]
        if (contents.includes(element[f].type)===false){contents.push(element[f].type)}
    }
    for (f=0;f<element.length;f++){
        vari[element[f].type].push(element[f].value)
        varid[element[f].type].push(element[f].variation_id)
    }
    console.log(varid)
    console.log(vari)
    console.log(contents)
    for (f=0;f<contents.length;f++){
        console.log(contents[f])

        let addtoadd="";
        for (a=0;a<(vari[contents[f]]).length;a++){
            addtoadd+=`<div class="feltetsor">
<label for="varin_${(varid[contents[f]])[a]}">${(vari[contents[f]])[a]}</label>
<input type="checkbox" id="varin_${(varid[contents[f]])[a]}" name="${(vari[contents[f]])[a]}" value="Bike">
  
</div>
`
        }
        console.log(vari[contents[f]])

        addline=`
            <div id="vars_${result.id}_${contents[f]}" class="out_varbox">
            <div class="varbox_title">${contents[f]}</div>
            ${addtoadd}
            </div>
        `
        document.querySelector(`#out_adcart${result.id}`).insertAdjacentHTML('beforeend', addline)

    }
})*/
function changeQuantity(id){
    cartamount[incart.indexOf(id)]=(document.querySelector(`#cartdbid${id}`).value)
    fullprice=0;
    for (i = 0; i < incart.length; i++) {
        fullprice+=(queried[incart[i]].ar*cartamount[i])
    }
    document.querySelector('.fullprice').innerHTML=`${fullprice}Ft`
    setCookie2('cartamount', cartamount,1)
}
function removeItem(id){
    //console.log(id)
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
    index=incart.indexOf(id)
    //console.log(incart)
    incart.splice(index,1)
    cartamount.splice(index,1)
    //console.log(index)
    //console.log(incart)

    setCookie2('cartamount', cartamount,1)
    setCookie2('cart', incart, 1)
    document.querySelector(`#out_adcart${id}`).remove()
    setTimeout(function () {
        location.replace(location.href);
    },500);
}

function alertison(aler){
    document.querySelector(".alerttext").innerHTML=`${queried[aler].megnev} bekerült a kosárba`
    document.querySelector('.fromtopalert').classList.add('alerting')
    setTimeout(function () {
        document.querySelector('.fromtopalert').classList.remove('alerting')
    },1500);
}
/*
function addToCart(id) {
    document.querySelector('.cartdb').innerHTML=(document.querySelector('.cartdb').innerHTML*1)+1
    alertison(id)
}*/
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

    for(i=0;i<incart.length;i++) {

        /*
        addline = `
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
    */
    }


}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}
function deleteAll(){
    eraseCookie('cart')
    eraseCookie('cartamount')

    setTimeout(function () {
        document.location.href="/";
    },500);
}

document.querySelector('.cassapay').addEventListener('click', function (){
    console.log("anyad")
})