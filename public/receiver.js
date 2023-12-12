

(function(){

    let senderID;
    const socket = io();

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
        let joinID = generateID();
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

            setTimeout(function (){

            }, 2000);

        });




    });
    let keszek=0;
    let inprog=[];
    let fileShare = {};

    socket.on("fs-meta",function(metadata){
        document.querySelector('.waitingtoreceive').classList.add('notwaitinganymore')
        inprog.push(metadata.filename)
        console.log(inprog)
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
            <div class="filename">${filename2}</div>
            <div>
                <div class="loader"></div> 
                <div class="out-circle"><div class="in-circle"><span class="progress">0%</span></div></div>
                <div class="keszpipa"> <img src="docs/assets/readytick.svg" alt="kesz"> </div>
            </div>
        `;
        document.querySelector(".receivebox").appendChild(el);
        window[metadata.filename].progress_node = el.querySelector(".progress");
        window[metadata.filename].circle=el.querySelector(".in-circle")
        window[metadata.filename].pipa=el.querySelector(".keszpipa")
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
                    uid:senderID
                });
            })
    });



    let buffer;
    let metadata;
    let rad=0;

    const zip = new JSZip()



    socket.on("fs-share",function(be){

        buffer=be[0];
        metadata=be[1];
        window[metadata.filename].buffer.push(buffer);
        //console.log(fileShare);
        window[metadata.filename].transmitted += buffer.byteLength;
        let szazalek=Math.trunc(window[metadata.filename].transmitted / window[metadata.filename].metadata.total_buffer_size * 100)
        window[metadata.filename].progress_node.innerText = szazalek + "%";
        rad=szazalek*3.6
        window[metadata.filename].circle.style.background= `conic-gradient(#000000 ${rad}deg, #ededed 0deg)`
        if(window[metadata.filename].transmitted === window[metadata.filename].metadata.total_buffer_size){
            //download(new Blob(window[metadata.filename].buffer), window[metadata.filename].metadata.filename);
            zip.file( window[metadata.filename].metadata.filename, new Blob(window[metadata.filename].buffer))
            window[metadata.filename].circle.classList.add('readycircle');
            window[metadata.filename].pipa.classList.add('readytick');
            //window[metadata.filename]={};
            keszek++;
            if (keszek===inprog.length){
                zip.generateAsync({ type: 'blob' }).then(function (content) {
                    FileSaver.saveAs(content, 'download.zip');
                });
            }

        }else{
            socket.emit("fs-start",{
                uid:senderID
            });
        }
    });
 })();