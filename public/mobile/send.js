let stoppedlist=[];
function megallit(e){
    e.innerHTML="<img src='/docs/assets/start.svg'>";
    e.setAttribute('onclick','elindit(this)')
    e.classList.add('stopped')
    stoppedlist.push(e.getAttribute('butid'))
}
function elindit(e){
    e.innerHTML="<img src='/docs/assets/stop.svg'>";
    e.setAttribute('onclick','megallit(this)')
    e.classList.remove('stopped')
    stoppedlist = stoppedlist.filter(el => el !==(e.getAttribute('butid')));
}

let receiverID;
const socket = io();

document.querySelector('#auth').addEventListener('change', function (e){
    let authtype=document.querySelector('#auth').value;
    if (authtype==="simple"){
        document.querySelector("#codeline").value=s_code;
        socket.emit("sender-join",{
            uid:s_code
        });
    }
    if (authtype==="default") {
        document.querySelector("#codeline").value=l_code;
        socket.emit("sender-join",{
            uid:l_code
        });

    }
    if (authtype==="difficult") {
        document.querySelector("#codeline").value=l_code;
        socket.emit("sender-join",{
            uid:l_code
        });

    }
})

socket.on("init", function(uid){
    receiverID = uid;
    document.querySelector(".waitingfor").classList.remove("active");
    document.querySelector(".readyfor").classList.add("active");

    socket.emit("reveive-joined",{
        uid:receiverID
    });
});

document.querySelector("#drop_zone").addEventListener("change",function(e){
    let file = e.target.files[0];

    //(e.target.files[0])
    if (!file){
        return;
    }
    let reader = new FileReader();
    let filename=file.name;
    if (file.name.length>30) {
        filename="";
        let oldname=file.name;
        for (i=0; i<25; i++){
            filename+=oldname.charAt(i)

        }
        filename+="(...)."+((file.name.split('.')).pop());
    }

    reader.onload = function(e){
        document.querySelector(".readyfor").classList.remove("active");
        document.querySelector(".fileok").classList.add("active");
        let buffer = new Uint8Array(reader.result);
        let el =document.createElement("div");
        el.classList.add("item");
        el.innerHTML = `
            <div class="filename">${filename}</div>
            <div class="outstop">
            <button class="stopbutton" onclick="megallit(this)" butid="${file.name}"> <img src="/docs/assets/stop.svg"  alt=""> </button>
            <div class="loader"></div>  
            <div class="progresscircle">
            <div class="out-circle"><div class="in-circle"><span class="progress">0%</span></div></div>
            </div>
            <div class="keszpipa"> <img src="docs/assets/readytick.svg" alt="kesz"> </div>
            
            </div>
        `;

        document.querySelector(".fileok").appendChild(el);
        shareFile({
                filename:file.name,
                total_buffer_size:buffer.length,
                buffer_size:1024,
            },buffer,
            el.querySelector(".progress"),
            el.querySelector('.in-circle'),
            el.querySelector('.keszpipa'),
            el.querySelector(".loader"),
            el.querySelector('.stopbutton'));
    }
    reader.readAsArrayBuffer(file);
});
socket.on("hotline",function(data){
    window.alert("error")

});

const initApp = () => {
    const droparea = document.querySelector('#drop_zone');
    const active = () => droparea.classList.add("dropping");
    const inactive = () => droparea.classList.remove("dropping");
    const prevents = (e) => e.preventDefault();
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
        droparea.addEventListener(evtName, prevents);
    });
    ['dragenter', 'dragover'].forEach(evtName => {
        droparea.addEventListener(evtName, active);
    });
    ['dragleave', 'drop'].forEach(evtName => {
        droparea.addEventListener(evtName, inactive);
    });
    droparea.addEventListener("drop", handleDrop);
}
document.addEventListener("DOMContentLoaded", initApp);
const handleDrop = (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    let dropped=files[0]
    //console.log(files[0]); // FileList
    if (!dropped){
        return;
    }


    let reader = new FileReader();
    let filename=dropped.name;
    if (dropped.name.length>30) {
        filename="";
        let oldname=dropped.name;
        for (i=0; i<25; i++){
            filename+=oldname.charAt(i)
        }
        filename+="(...)."+((dropped.name.split('.')).pop());
    }

    reader.onload = function(e){
        document.querySelector(".readyfor").classList.remove("active");
        document.querySelector(".fileok").classList.add("active");
        let buffer = new Uint8Array(reader.result);
        let el =document.createElement("div");
        el.classList.add("item");
        el.innerHTML = `
            <div class="filename">${filename}</div>
            <div class="outstop">
            <button class="stopbutton" onclick="megallit(this)" butid="${file.name}"> <img src="/docs/assets/stop.svg"  alt=""> </button>
            <div class="loader"></div>  
            <div class="progresscircle">
            <div class="out-circle"><div class="in-circle"><span class="progress">0%</span></div></div>
            </div>
            <div class="keszpipa"> <img src="docs/assets/readytick.svg" alt="kesz"> </div>
            </div>`;
        document.querySelector(".fileok").appendChild(el);
        shareFile({
                filename:dropped.name,
                total_buffer_size:buffer.length,
                buffer_size:1024
            },buffer,el.querySelector(".progress"),
            el.querySelector('.in-circle'),
            el.querySelector('.keszpipa'),
            el.querySelector(".loader"),
            el.querySelector('.stopbutton'));
    }
    reader.readAsArrayBuffer(dropped);

}

function shareFile(metadata,buffer,progress_node, circle, tick,loader,stopbut){
    let szazalek=0;
    socket.emit("file-meta",{
        uid:receiverID,
        metadata:metadata
    });
    socket.on("fs-share",function(){
        let rad = 0;
        let chunk = buffer.slice(0, metadata.buffer_size);
        if (stoppedlist.indexOf(metadata.filename)===-1) {
            //console.log(stoppedlist.indexOf(metadata.filename))
            //console.log(metadata.filename)
            buffer = buffer.slice(metadata.buffer_size, buffer.length);
            szazalek = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100);
            rad = szazalek * 3.6;
            stopbut.classList.add('activestopbutton')
            progress_node.innerText = (szazalek + "%")
            circle.style.background = `conic-gradient(#000000 ${rad}deg, #ededed 0deg)`
            //progress_node.innerText=Math.trunc((metadata.total_buffer_size - buffer.length) /metadata.total_buffer_size * 100 )+ "%";
            if (szazalek === 100) {
                circle.classList.add('readycircle')
                loader.classList.remove("loader")
                stopbut.classList.remove('activestopbutton')
                tick.classList.add('readytick')
            } else {
                loader.classList.add("readycircle")
            }

            if(chunk.length !==0){
                socket.emit("file-raw",{
                    uid:receiverID,
                    buffer:chunk,
                    metadata:metadata
                });
            }
        } else {

            if(chunk.length !==0){
                socket.emit("file-raw",{
                    uid:receiverID,
                    buffer:null,
                    metadata:metadata
                });
            }}
    })
}



