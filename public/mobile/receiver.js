let password="";
let senderID;
const socket = io();
let joinID;


function generateID() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 25) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

document.querySelector("#submit").addEventListener("click",function(){
    senderID = document.querySelector("#code").value;
    if(senderID.length === 0){
        return;
    }
    joinID = generateID();
    socket.emit("receiver-join",{
        uid:joinID,
        sender_uid:senderID
    });
    let checkcode=0;

    socket.on("rev-joined",function(e){
        checkcode=1;
        document.querySelector('.tickvagyok').classList.add("tickgreen")
        document.querySelector("#csub1").classList.add("nonsub")
        document.querySelector("#ccode1").classList.add("nonsub")
        document.querySelector("#csub2").classList.remove("nonsub")
        document.querySelector("#ccode2").classList.remove("nonsub")
        document.querySelector('#code').setAttribute("readonly", "")
        setTimeout(function (){
        }, 2000);

    });
});



socket.on("out_passw", function (data){
    if (data==="password"){
        console.log(data)
        document.querySelector(".block_pass").classList.add("sutikvegig")
        document.querySelector(".outpass").classList.add("sutikvegig")}
    if (data===0){
        document.querySelector(".block_pass").classList.add("sutikvegig")
        document.querySelector(".outpass").classList.add("sutikvegig")
        window.alert("rossz")
    } if (data===1){

    }
});

document.querySelector("#submitpass").addEventListener("click",function(){
    let pass1=document.querySelector("#pass1").value
    document.querySelector(".block_pass").classList.remove("sutikvegig")
    document.querySelector(".outpass").classList.remove("sutikvegig")
    console.log("ugyes vagy")
    password=pass1
    socket.emit("password",{
        type:2,
        uid: senderID,
        joinuid:joinID,
        holdon: password,
    });

});

document.querySelector("#passcancel").addEventListener("click",function(){
    document.querySelector(".block_pass").classList.remove("sutikvegig")
    document.querySelector(".outpass").classList.remove("sutikvegig")
    
});

let keszek=0;
let inprog=0;
let fileShare = {};

socket.on("fs-meta",function(metadata){
    document.querySelector('.waitingtoreceive').classList.add('notwaitinganymore')
    console.log(metadata)
    if (metadata.total_buffer_size<500000000){
        inprog++;
    }
    window[metadata.filename]={};
    window[metadata.filename].metadata = metadata;
    window[metadata.filename].transmitted =0;
    window[metadata.filename].buffer = [];
    let el =document.createElement("div");
    el.classList.add("item");
    let filename2=metadata.filename;
    if (metadata.filename.length>30) {
        filename2="";
        let oldname=metadata.filename;
        for (let i=0; i<25; i++){
            filename2+=oldname.charAt(i)
        }
        filename2+="(...)."+((metadata.filename.split('.')).pop());
    }
    el.innerHTML = `
        <div class="filename">  <div>${filename2}</div> <div>${metadata.filesize}</div> </div>
        <div>
            <div class="s_indicator"> <img src="/mobile/docs/assets/stop.svg" alt="stopped"> </div>
            <div class="loader"></div> 
            <div class="out-circle"><div class="in-circle"><span class="progress">0%</span></div></div>
            <div class="keszpipa"> <img src="/mobile/docs/assets/readytick.svg" alt="kesz"> </div></div>
            
        </div>
    `;
    document.querySelector(".receivebox").appendChild(el);
    window[metadata.filename].progress_node = el.querySelector(".progress");
    window[metadata.filename].circle=el.querySelector(".in-circle")
    window[metadata.filename].indicator=el.querySelector('.s_indicator')
    window[metadata.filename].pipa=el.querySelector(".keszpipa")
    window[metadata.filename].filetext=el.querySelector(".filename")
    let thebutton=document.querySelector('#receive')
    thebutton.disabled=false;
    document.querySelector('.out-receivebutt').classList.add('activerecbutt')
    const promise = new Promise((resolve) => {
        thebutton.addEventListener('click', resolve)
    })
    async function waitClick () {
        return await promise
    }

    waitClick()
        .then(() => {
            el.querySelector(".loader").classList.add('nonsub')
            socket.emit("fs-start",{
                uid:senderID,
                pass:password
            });
        })
});



let buffer;
let metadata;
let rad=0;


const zip = new JSZip();


socket.on("fs-share",function(be){
    buffer=be.buffer;
    metadata=be.metadata;
    if (buffer!==null && buffer!==-1 && buffer!==-2){
        window[metadata.filename].circle.classList.remove('notwaitinganymore')
        window[metadata.filename].indicator.classList.remove('indicating')
        window[metadata.filename].circle.removeAttribute('style')
        window[metadata.filename].buffer.push(buffer);
        //console.log(fileShare);
        window[metadata.filename].transmitted += buffer.byteLength;
        let szazalek=Math.trunc(window[metadata.filename].transmitted / window[metadata.filename].metadata.total_buffer_size * 100)
        window[metadata.filename].progress_node.innerText = szazalek + "%";
        rad=szazalek*3.6
        window[metadata.filename].circle.style.background= `conic-gradient(#000000 ${rad}deg, #ededed 0deg)`
        if(window[metadata.filename].transmitted === window[metadata.filename].metadata.total_buffer_size){

            socket.emit("file-ready",{
                name:metadata.filename,
                uid:senderID

            });
            window[metadata.filename].circle.classList.add('readycircle');
            window[metadata.filename].pipa.classList.add('readytick');
            if ((metadata.total_buffer_size<500000000) && (inprog>1)){
                zip.file( window[metadata.filename].metadata.filename, new Blob(window[metadata.filename].buffer))
                keszek++;
                if (keszek===inprog){
                    zip.generateAsync({ type: 'blob' }).then(function (content) {
                        saveAs(content, 'FileUpped.zip');
                    });
                    keszek=0;
                    inprog=0;
                }
            } else{
                download(new Blob(window[metadata.filename].buffer), window[metadata.filename].metadata.filename);
                inprog-=1;
            }



        }else{
            socket.emit("fs-start",{
                uid:senderID,
                pass:password
            });
        }}else{
        if (buffer===-2){
            window[metadata.filename].indicator.classList.add('indicating')
            window[metadata.filename].circle.classList.add('notwaitinganymore')
            window[metadata.filename].circle.setAttribute('style', 'opacity:0%;')

            socket.emit("fs-start",{
                uid:senderID,
                pass:password
            });
        }
        if (buffer===-1){
            window[metadata.filename].indicator.classList.add('indicating')
            window[metadata.filename].indicator.setAttribute("style", "opacity:50%")
            window[metadata.filename].circle.classList.add('notwaitinganymore')
            window[metadata.filename].filetext.classList.add('canceledshare')
            window[metadata.filename].circle.setAttribute('style', 'opacity:0%;')

        }
    }
});
