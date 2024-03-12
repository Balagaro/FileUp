let addmodline;
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



const upload=document.querySelector('.uploadbox')
const query=document.querySelector('.querybox')
const addvari=document.querySelector('.variations')
const modvari=document.querySelector('.modvar')


document.querySelector('.additem').addEventListener('click', function (){
    upload.classList.toggle('activebox')
    upload.classList.toggle('hover')
    query.classList.toggle('hover')
    query.classList.toggle('disbox')


});

document.querySelector('.queryitem').addEventListener('click', function (){
    upload.classList.toggle('hover')
    query.classList.toggle('hover')
    addvari.classList.toggle('hover')
    modvari.classList.toggle('hover')
    upload.classList.toggle('disbox')

    query.classList.toggle('activebox')
});
//ezezez
upload.classList.toggle('hover')
query.classList.toggle('hover')
addvari.classList.toggle('hover')
modvari.classList.toggle('hover')

modvari.classList.toggle('disbox')
addvari.classList.toggle('activebox')
//eddig
document.querySelector('.queryvar').addEventListener('click', function (){
    upload.classList.toggle('hover')
    query.classList.toggle('hover')
    addvari.classList.toggle('hover')
    modvari.classList.toggle('hover')

    modvari.classList.toggle('disbox')
    addvari.classList.toggle('activebox')
});

socket.emit('admin-join',{
    id:"admin"
})
let queried={};
socket.emit('items-req',{
    id:"admin"
})
let adline="";
let uploaddiv=document.querySelector('.inupload')
let uploadmoddiv=document.querySelector('.modinupload')
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
        addmodline=`
        <div class="selecttoupload">
            <div class="selpic">
            <div class="adpic"><img  src="./sutik/${data[i].picture}.png" alt="gofri"> </div>
            </div>
            <div class="seltitle">${data[i].megnev}</div>
            <button onclick="selectToMod(${data[i].id})" class="selpush">Kiválasztás</button>
        </div>
        `
        uploaddiv.insertAdjacentHTML('beforeend', addline);
        uploadmoddiv.insertAdjacentHTML('beforeend', addmodline);
    }
});
let instorage,currdata;
let insertvari=[];
let insertvardb=[]
let alreadytyped={}

function selectToMod(id){
    socket.emit('get-variations', id)
}

socket.on('variations-queried', function (data){
        //console.log(currdata)
    if (insertvari.includes(data.id)===false){
        insertvari.push(data.id)
        insertvardb.push(1)
    }else{
        insertvardb[insertvari.indexOf(data.id)]++
    }

        //console.log(data)
        addline = `
    <div class="uploadableline upline${data.id}">
        <div class="uploadtitles">
            <button onclick="cancelItem(${data.id})">X</button>
            <div class="uploadid">id: ${data.id}</div>
            <div class="uploadtitle">${queried[data.id].megnev}</div>
        </div>
        <div class="uptypes">tipus:
            <form class="uptypeform">
              <input list="typenames${data.id}" name="types">
              <datalist id="typenames${data.id}"></datalist>
            </form>
        </div>
        <div class="upvalues">érték:
            <form class="upvalueform">
              <input list="valuenames${data.id}" name="values">
              <datalist id="valuenames${data.id}">
                <option value="Alma">
                <option value="Körte">
              </datalist>
            </form>
        </div>
    </div>
    `
    document.querySelector("#uploadmodinthis").insertAdjacentHTML('beforeend', addline);
    document.querySelector('.upmodtodatabase').classList.add('activeinsert')
    let valuenm=document.querySelector(`#valuenames${data.id}`)
    let typenm=document.querySelector(`#typenames${data.id}`)

    for(i=0;i<data.result.length;i++){
        console.log(data.result[i].type)
        console.log(alreadytyped)
        if (false){
            console.log('votma')
        } else{
           console.log(data.result[i].type)
        console.log(data.result[i])
        insertval=`
        <option value="${data.result[i].type}">
        `
        typenm.insertAdjacentHTML('beforeend', insertval);
        insertval=`
        <option value="${data.result[i].value}">
        `
        valuenm.insertAdjacentHTML('beforeend', insertval);}

    }
})

document.querySelector('.upmodtodatabase').addEventListener('click', function (){
    console.log(insertvari)
    for (i=0;i<insertvari.length;i++){
        console.log(insertvari[i])
        for (k=0;k<insertvardb[i];k++){

            console.log(k)
        }
    }
    console.log(insertvardb)
})
socket.on('storage-query', function (data){
    instorage=data
    for (let i=0;i<data.length;i++){
        currdata=data[i]
        if (currdata.darab>5000){
            currdata.darab="sok"
        }
        //console.log(currdata)
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
    //console.log(index)
    //console.log(id)
    currdata=instorage[index]
    modli=document.getElementById(`${index}_${id}`)
    //console.log(modli.innerHTML)
    addline=`
    <button class="xstor" onclick="cancelStor(${id})">X</button>
    <div class="storid">${id}</div>
        <a href="#">${currdata.megnev}</a>
        <div class="storcount"><div class="upquantity_c"><input type="text" pattern="\\d*" id="upquantity" class="freshquantity${id}" name="upquantity" maxlength="3" value="${currdata.darab}" min="1">db</div></div>
        <div class="storprice"><div class="upprice_c"><input type="number" id="upprice" class="freshprice${id}" name="upprice" value="${currdata.ar}" min="1">ft</div></div>
        <button onclick="freshStor(${index},${currdata.id})" class="stormod">modify</button>
    `
    modli.innerHTML=addline
}

function cancelStor(id){
    document.querySelector(`.freshquantity${id}`).value='-'
    document.querySelector(`.freshprice${id}`).value='-'

}

function freshStor(index, id){
    //console.log(id)
    let freshcount=document.querySelector(`.freshquantity${id}`).value
    let freshprice=document.querySelector(`.freshprice${id}`).value
    if (freshcount==='sok'){
        to_push={
            id:id,
            price:freshprice*1,
            count:9999
        }
    } else{
    if (freshprice==="" && freshcount==="-"){
        to_push={
            id:id,
            price:"delete",
            count:"delete"
        }
    } else{
    to_push={
        id:id,
        price:freshprice*1,
        count:(freshcount*1),
    }}

    }
    socket.emit('mod-into-database',to_push)
    refresh()
}
function refresh(){
    setTimeout(function () {
        document.querySelector('#in-storage').innerHTML="";
        document.querySelector('.inupload').innerHTML=""
        socket.emit('items-req',{
            id:"admin"
        })
    },500);


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
        <div class="upquantity_c">
        <input type="checkbox" id="countcheck${data.id}" name="quantity" value="count">
        <input type="text" pattern="\\d*" id="upquantity" class="quantity${data.id}" name="upquantity" onkeyup="checkTheBox(${data.id})"  maxlength="3" value="-" min="1">darab</div>
      
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
        <div class="countline">
        <input type="checkbox" id="countcheck${data.id}" name="quantity" value="count">
        <input type="text" pattern="\\d*" id="upquantity" class="quantity${data.id}" name="upquantity" onkeyup="checkTheBox(${data.id})" value="-" min="1" maxlength="3">darab</div>
    </div>
    `}
        document.querySelector("#uploadinthis").insertAdjacentHTML('beforeend', addline);
        document.querySelector('.uptodatabase').classList.add('activeinsert')


})
function checkTheBox(id){
    document.querySelector(`#countcheck${id}`).checked=true
}
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
    let price, count, countcheck;
    for (let i=0; i<addedup_new.length;i++){
        count=document.querySelector(`.quantity${addedup_new[i]}`).value
        price=document.querySelector(`.upprice${addedup_new[i]}`).value
        countcheck=document.querySelector(`#countcheck${addedup_new[i]}`).checked
        //to_push=[addedup_exitst[i].id, price*1,count*1]
        if (countcheck){
        to_push={
            id:addedup_new[i],
            price:price*1,
            count:count*1
        }}else{
            to_push={
                id:addedup_new[i],
                price:price*1,
                count:9999
            }
        }
        //console.log(to_push)
        socket.emit('into-database',to_push)
    }
    for (let i=0; i<addedup_exitst.length;i++){
        count=document.querySelector(`.quantity${addedup_exitst[i].id}`).value
        price=document.querySelector(`.upprice${addedup_exitst[i].id}`).value
        countcheck=document.querySelector(`#countcheck${addedup_exitst[i].id}`).checked
        //to_push=[addedup_new[i], price*1,count*1]
        if (countcheck){
        to_push={
            id:addedup_exitst[i].id,
            price:price*1,
            count:(count*1)
        }}else{
            to_push={
                id:addedup_exitst[i].id,
                price:price*1,
                count:9999
            }
        }
        //console.log(to_push)
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
    //alert('Elküldve')
    refresh()
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

