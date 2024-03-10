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
                <button onclick="document.addEventListener('touchstart', function() {}, false)" class="buy">Kosárba</button>
            </div>
        </div>
        `
        uploaddiv.insertAdjacentHTML('beforeend', addline);
    }
});