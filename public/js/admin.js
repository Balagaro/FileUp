
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


document.querySelector('.additem').addEventListener('click', function (){
    upload.classList.toggle('activebox')
    upload.classList.toggle('hover')
    query.classList.toggle('hover')
    query.classList.toggle('disbox')

});
upload.classList.toggle('hover')
query.classList.toggle('hover')
upload.classList.toggle('disbox')
query.classList.toggle('activebox')
document.querySelector('.queryitem').addEventListener('click', function (){
    upload.classList.toggle('hover')
    query.classList.toggle('hover')
    upload.classList.toggle('disbox')
    query.classList.toggle('activebox')
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
let instorage;
let currdata;
socket.on('storage-query', function (data){
    instorage=data
    for (let i=0;i<data.length;i++){
        currdata=data[i]
        console.log(currdata)
        addline=`
        <li id="${i}_${currdata.id}">
        <div class="storid">${currdata.id}</div>
        <a href="#">${currdata.megnev}</a>
        <div class="storcount">${currdata.darab} db</div>
        <div class="storprice">${currdata.ar} forint</div>
        <button onclick="modStor(${i},${currdata.id})" class="stormod">modify</button>
        
        </li>
        `
        document.querySelector('#in-storage').insertAdjacentHTML('beforeend', addline);
    }
})
let modli;
function modStor(index, id){
    console.log(index)
    console.log(id)
    currdata=instorage[index]
    modli=document.getElementById(`${index}_${id}`)
    console.log(modli.innerHTML)
    addline=`
    <div class="storid">${id}</div>
        <a href="#">${currdata.megnev}</a>
        <div class="storcount"><div class="upquantity_c"><input type="text" pattern="\\d*" id="upquantity" class="freshquantity${id}" name="upquantity" maxlength="3" value="${currdata.darab}" min="1">db</div></div>
        <div class="storprice"><div class="upprice_c"><input type="number" id="upprice" class="freshprice${id}" name="upprice" value="${currdata.ar}" min="1">ft</div></div>
        <button onclick="freshStor(${index},${currdata.id})" class="stormod">modify</button>
    `
    modli.innerHTML=addline
}
function freshStor(index, id){
    console.log(id)
    let freshcount=document.querySelector(`.freshquantity${id}`).value
    let freshprice=document.querySelector(`.freshprice${id}`).value
    console.log(freshprice)
    console.log(freshcount)
    to_push={
        id:id,
        price:freshprice*1,
        count:(freshcount*1)
    }
    console.log(to_push)
    //console.log("megy")
    socket.emit('mod-into-database',to_push)
    setTimeout(function () {
        refresh()
    },500);

}
function refresh(){
    document.querySelector('#in-storage').innerHTML="";
    document.querySelector('.inupload').innerHTML=""
    socket.emit('admin-req',{
        id:"admin"
    })
}
let addedup_exitst=[];
let addedup_exitst_ids={};
let addedup_new=[];
function selectToQuerry(id){
    if (addedup_exitst_ids[id]!==undefined || addedup_new.includes(id)===true ){
        document.querySelector(`.quantity${id}`).value++
    }else {socket.emit('to-querry',id)}
}

socket.on('admin-queried',function (data){
    if (data.result.length===0){
        addedup_new.push(data.id)
        addline = `
    <div class="uploadableline upline${data.id}">
        <div class="uploadtitles">
            <button onclick="cancelItem(${data.id})">X</button>
            <div class="uploadid">id: ${data.id}</div>
            <div class="uploadtitle">${queried[data.id].megnev}</div>
        </div>
        <div class="upprice_c"><input type="number" id="upprice" class="upprice${data.id}" name="upprice" value="500" min="1">ft</div>
        <div class="upquantity_c"><input type="text" pattern="\\d*" id="upquantity" class="quantity${data.id}" name="upquantity" maxlength="3" value="1" min="1">darab</div>
      
    </div>
    `
    } else{
        addedup_exitst.push(data)
        addedup_exitst_ids[data.id]=addedup_exitst.length-1
        //console.log(data)
        addline = `
    <div class="uploadableline upline${data.id}">
        <div class="uploadtitles">
            <button onclick="cancelItem(${data.id})">X</button>
            <div class="uploadid">id: ${data.id}</div>
            <div class="uploadtitle">${queried[data.id].megnev}</div>
        </div>
        <div><input type="number" id="upprice" class="upprice${data.id}" name="upprice" value="${data.result[0].ar}" min="1">ft</div>
        <div><input type="text" pattern="\\d*" id="upquantity" class="quantity${data.id}" name="upquantity" value="1" min="1" maxlength="3">darab</div>
    </div>
    `}
        document.querySelector("#uploadinthis").insertAdjacentHTML('beforeend', addline);
        document.querySelector('.uptodatabase').classList.add('activeinsert')


})

function cancelItem(id){
    document.querySelector(`.upline${id}`).remove()
    if (addedup_exitst.indexOf(id)>=0){
    addedup_exitst.pop(addedup_exitst.indexOf(id))}else {
        addedup_new.pop(addedup_new.indexOf(id))
    }
    if (addedup_exitst_ids[id]!==undefined){addedup_exitst.pop(addedup_exitst_ids[id]);delete addedup_exitst_ids[id]}
    if (addedup_exitst.length===0 && addedup_new.length===0){
        document.querySelector('.uptodatabase').classList.remove('activeinsert')
    }
}

document.querySelector('.uptodatabase').addEventListener('click', function (){
    //console.log("menjen");
    let to_push={};
    let price;
    let count;
    for (let i=0; i<addedup_new.length;i++){
        count=document.querySelector(`.quantity${addedup_new[i]}`).value
        price=document.querySelector(`.upprice${addedup_new[i]}`).value
        //to_push=[addedup_exitst[i].id, price*1,count*1]
        to_push={
            id:addedup_new[i],
            price:price*1,
            count:count*1
        }
        //console.log(to_push)
        socket.emit('into-database',to_push)
    }
    for (let i=0; i<addedup_exitst.length;i++){
        count=document.querySelector(`.quantity${addedup_exitst[i].id}`).value
        price=document.querySelector(`.upprice${addedup_exitst[i].id}`).value
        //to_push=[addedup_new[i], price*1,count*1]
        to_push={
            id:addedup_exitst[i].id,
            price:price*1,
            count:(count*1)+addedup_exitst[i].result[0].darab
        }
        console.log(to_push)
        //console.log("megy")
        socket.emit('mod-into-database',to_push)
    }
    addedup_exitst=[];
    addedup_new=[];
    addedup_exitst_ids={}
    document.querySelector('#uploadinthis').innerHTML='';
    document.querySelector('.uptodatabase').classList.remove('activeinsert')
    //console.log(to_push)
    //socket.emit('into-database',to_push.slice(0, -1))
    alert('Elküldve')
})

function myFunction() {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("storage_bar");
    filter = input.value.toUpperCase();
    ul = document.getElementById("in-storage");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

