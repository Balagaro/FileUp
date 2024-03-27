let addmodline;
const socket = io();
socket.emit('admin-join', 'admin')
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

document.querySelector('.modifyvar').addEventListener('click', function (){
    upload.classList.toggle('hover')
    query.classList.toggle('hover')
    addvari.classList.toggle('hover')
    modvari.classList.toggle('hover')
    addvari.classList.toggle('disbox')
    modvari.classList.toggle('activebox')
    //socket.emit('get-all-variations',"admin")

})
socket.emit('get-all-variations',"admin")
document.querySelector('.queryvar').addEventListener('click', function (){
    upload.classList.toggle('hover')
    query.classList.toggle('hover')
    addvari.classList.toggle('hover')
    modvari.classList.toggle('hover')
    modvari.classList.toggle('disbox')
    addvari.classList.toggle('activebox')
});



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
let alreadyvaluled={}

function selectToMod(id){
    socket.emit('get-variations', id)
}

socket.on('variations-queried', function (data){

    if (insertvari.includes(data.id)===false){
        insertvari.push(data.id)
        insertvardb.push(1)
    }else{
        insertvardb[insertvari.indexOf(data.id)]++
    }
    console.log(`typeid${data.id}_${insertvardb[insertvari.indexOf(data.id)]}`)
    console.log(`valueid${data.id}_${insertvardb[insertvari.indexOf(data.id)]}`)

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
              <input list="typenames${data.id}" class="typeid${data.id}_${insertvardb[insertvari.indexOf(data.id)]}" name="types">
              <datalist id="typenames${data.id}"></datalist>
            </form>
        </div>
        <div class="upvalues">érték:
            <form class="upvalueform">
              <input list="valuenames${data.id}" class="valueid${data.id}_${insertvardb[insertvari.indexOf(data.id)]}" name="values">
              <datalist id="valuenames${data.id}">
              </datalist>
            </form>
        </div>
    </div>
    `
    document.querySelector("#uploadmodinthis").insertAdjacentHTML('beforeend', addline);
    document.querySelector('.upmodtodatabase').classList.add('activeinsert')
    let valuenm=document.querySelector(`#valuenames${data.id}`)
    let typenm=document.querySelector(`#typenames${data.id}`)
    //console.log(data.result)
    for(i=0;i<data.result.length;i++){
        //console.log(data.result[i])
        //console.log(alreadytyped)

            if (alreadytyped[data.id]===undefined){

                //console.log(`${data.result[i].value}`)
                //console.log(1)
                alreadytyped[data.id]=[`${data.result[i].type}`]
                alreadyvaluled[data.id]=[`${data.result[i].value}`]
                insertval=`
                <option value="${data.result[i].type}">`
                typenm.insertAdjacentHTML('beforeend', insertval);
                insertval=`
                <option value="${data.result[i].value}">`
                valuenm.insertAdjacentHTML('beforeend', insertval);
                //console.log(alreadyvaluled[data.id].includes(data.result[i].value))
            }else{
                //console.log(alreadyvaluled[data.id].includes(data.result[i].value))
                if (alreadytyped[data.id].includes(data.result[i].type)===false){
                alreadytyped[data.id].push(`${data.result[i].type}`)

                //console.log(data.result[i].type)
                //console.log('asd')
                    insertval=`
                <option value="${data.result[i].type}">`
                    typenm.insertAdjacentHTML('beforeend', insertval);
                    if (alreadyvaluled[data.id].includes(data.result[i].value)===false){
                        alreadyvaluled[data.id].push(`${data.result[i].value}`)
                    insertval=`
                    <option value="${data.result[i].value}">`
                    valuenm.insertAdjacentHTML('beforeend', insertval);
                    }


                }else{
                    if (alreadyvaluled[data.id].includes(data.result[i].value)===false){
                        alreadyvaluled[data.id].push(`${data.result[i].value}`)
                        insertval=`
                    <option value="${data.result[i].value}">`
                        valuenm.insertAdjacentHTML('beforeend', insertval);
                    }


                }
            }
            //console.log(alreadyvaluled)
            //alreadytyped[data.id]=alreadytyped[data.id]+`${data.result[i].type}`

        //console.log(data.result[i])

    }


})
let typeval, valval;
document.querySelector('.upmodtodatabase').addEventListener('click', function (){
    //console.log(insertvari)
    for (i=0;i<insertvari.length;i++){
        //console.log(insertvari[i])
        for (k=1;k<=insertvardb[i];k++){
            typeval=(document.querySelector(`.typeid${insertvari[i]}_${k}`).value)
            valval=(document.querySelector(`.valueid${insertvari[i]}_${k}`).value)
            if (typeval!=="" && valval!==""){
                socket.emit('insert-variations', {id:insertvari[i] ,typeval:typeval, valval:valval})

            }
        }
    }
    document.querySelector("#uploadmodinthis").innerHTML="";
    document.querySelector('.upmodtodatabase').classList.remove('activeinsert')
    //console.log(insertvardb)
    setTimeout(function () {
        location.replace(location.href);
    },500);

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
function myFunctionVar() {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("storage_barvar");
    filter = input.value.toUpperCase();
    ul = document.getElementById("in-vari");
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


let adduzenet;
let varakozok1=[]
let varakozok2=[]
let varakozok3=[]

socket.on('titkosuzenet', function (uzenet){
    if (varakozok3.includes(uzenet['client_id'])){}else{
        varakozok3.push(uzenet['client_id'])

    adduzenet=`
    
    <div class="orderbox" id="${uzenet['client_id']}">
    <div class="ordermontitle"><button onclick="ready('${uzenet['client_id']}')">elkeszult</button>
    
    <div class="sorszambox">${uzenet['sorszam']}</div></div>
    <div class="arbox">${uzenet['ar']}Ft</div>
    <input class="fizetette" type="checkbox">
    
</div>
    `
    document.querySelector('.rendelesek').insertAdjacentHTML('beforeend',adduzenet)

    }})

socket.on('tibike', function (datas){
    let data=datas[0]
    console.log(datas)
    if (varakozok1.indexOf(datas[1])===-1){
        for (a=0;a<data.length;a++){
            adduzenet=`
<div class="orderboxsor_title">${data[a][0]}</div>
            <div class="orderbox_sor" id="${datas[1]}${data[a][0]}${data[a][1]}">
            

</div>
            `
            document.querySelector(`#${datas[1]}`).insertAdjacentHTML('beforeend', adduzenet)

            }
            varakozok1.push(datas[1],223232323)
        }
    console.log(varakozok1)
})

socket.on('minem', function (datas){
    console.log(datas)
        if (varakozok2.includes(datas[1])){}else{
            let data = datas[0]
            console.log(data)

            for (x = 0; x < data.length; x++) {
                adduzenet = `
        <div >${data[x][0][0]['type']} : ${data[x][0][0]['value']}</div>
        `

                //let mukod = `${data[x][0][0]['picture']}_${data[x][1]}`
                //console.log(mukod)
                //console.log(document.getElementById(`mukod`).innerHTML)
                //document.querySelector(`#${data[x][0]['picture']}_${data[x][1]}_${datas[1]}`).insertAdjacentHTML('beforeend', adduzenet)
                console.log(`#${datas[1]}${data[x][0][0]['picture']}${data[x][1]}`)
                document.querySelector(`#${datas[1]}${data[x][0][0]['picture']}${data[x][1]}`).insertAdjacentHTML('beforeend', adduzenet)
            }

            varakozok2.push(datas[1])
        }
})


function ready(id){
    varakozok1 = varakozok1.filter(e => e !== id);
    varakozok2 = varakozok2.filter(e => e !== id);
    varakozok3 = varakozok3.filter(e => e !== id);
    socket.emit('elkeszult-neger',id)
    document.getElementById(`${id}`).remove();
}

socket.emit('adide','alma')


socket.on('all-variations-queried', function (data){
    //console.log(data)
    instorage=data
    for (let i=0;i<data.length;i++){
        currdata=data[i]
        console.log(currdata)
        addline=`
        <li id="${i}_${currdata.variation_id}">
        <div class="storid">${currdata.id}</div>
        <a href="#">${currdata.megnev}</a>
        <div class="storcount">${currdata.value}</div>
        <button onclick="modStor(${i},${currdata.id})" class="varmod">modify</button>
        
        </li>
        `
        document.querySelector('#in-vari').insertAdjacentHTML('beforeend', addline);
    }
})
