
const socket = io();
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


const vane=checkCookie("admin")

if (vane===0){
    setCookie("admin", nope, 7)

}



let upload=document.querySelector('.uploadbox')
let query=document.querySelector('.querybox')

upload.classList.toggle('activebox')
upload.classList.toggle('hover')
query.classList.toggle('disbox')


document.querySelector('.additem').addEventListener('click', function (){
    upload.classList.toggle('activebox')
    upload.classList.toggle('hover')
    query.classList.toggle('disbox')

});
query.addEventListener('click', function (){
    console.log('qu')
});

socket.emit('admin-join',{
    id:"admin"
})
let queried={};
socket.emit('admin-req',{
    id:"admin"
})
let adline="";
let uploaddiv=document.querySelector('.inupload')
let indatabase;
socket.on('item-query',function(data){
    indatabase=data;
    for (let i=0; i<data.length;i++){
        queried[data[i].id]=data[i]
        addline=`
        <div class="selecttoupload">
            <div class="selpic">
            <div class="adpic"><img  src="./sutik/${data[i].picture}.png" alt="gofri"> </div>
            </div>
            <div class="seltitle">${data[i].megnev}</div>
            <button onclick="selectToQuerry(${data[i].id})" class="selpush">Kiválasztás</button>
        </div>
        `
        uploaddiv.insertAdjacentHTML('beforeend', addline);
    }
});
let addedup=[];
let addtodatabase={}
function selectToQuerry(id){
    if (addedup.includes(id)===true){
        document.querySelector(`.quantity${id}`).value++
    }else {
        socket.emit('to-querry',id)
        addedup.push(id)
        console.log(queried[id])
        /*
        addline = `
    <div class="uploadableline upline${id}">
        <div class="uploadtitles">
            <button onclick="cancelItem(${id})">X</button>
            <div class="uploadid">${id}</div>
            <div class="uploadtitle">${queried[id].megnev}</div>
        </div>
        <div><input type="number" id="upprice" class="upprice${id}" name="upprice" value="600" min="1">ft</div>
        <div><input type="number" id="upquantity" class="quantity${id}" name="upquantity" value="1" min="1">darab</div>
      
    </div>
    `
    document.querySelector(".uploadablebox").insertAdjacentHTML('beforeend', addline);
    */}
}

socket.on('admin-queried',function (data){

    console.log(data.result.length)
    if (data.result.length===0){
        console.log("naha")
        addline = `
    <div class="uploadableline upline${data.id}">
        <div class="uploadtitles">
            <button onclick="cancelItem(${data.id})">X</button>
            <div class="uploadid">${data.id}</div>
            <div class="uploadtitle">${queried[data.id].megnev}</div>
        </div>
        <div><input type="number" id="upprice" class="upprice${data.id}" name="upprice" value="600" min="1">ft</div>
        <div><input type="number" id="upquantity" class="quantity${data.id}" name="upquantity" value="1" min="1">darab</div>
      
    </div>
    `
    } else{
        addline = `
    <div class="uploadableline upline${data.id}">
        <div class="uploadtitles">
            <button onclick="cancelItem(${data.id})">X</button>
            <div class="uploadid">${data.id}</div>
            <div class="uploadtitle">${queried[data.id].megnev}</div>
        </div>
        <div><input type="number" id="upprice" class="upprice${data.id}" name="upprice" value="${data.result.ar}" min="1">ft</div>
        <div><input type="number" id="upquantity" class="quantity${data.id}" name="upquantity" value="1" min="1">darab</div>
      
    </div>
    `}
        document.querySelector(".uploadablebox").insertAdjacentHTML('beforeend', addline);


})

function cancelItem(id){
    document.querySelector(`.upline${id}`).remove()
    addedup.pop(id)
}

document.getElementById('uptodatabase').addEventListener('click', function (){
    socket.emit('into-database', {

    })
})