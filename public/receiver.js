

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
    let inprog=0;
    let fileShare = {};

    socket.on("fs-meta",function(metadata){
        document.querySelector('.waitingtoreceive').classList.add('notwaitinganymore')

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
            <div class="filename">${filename2}</div>
            <div>
                <div class="s_indicator"> <img src="docs/assets/stop.svg" alt="stopped"> </div>
                <div class="loader"></div> 
                <div class="out-circle"><div class="in-circle"><span class="progress">0%</span></div></div>
                <div class="keszpipa"> <img src="docs/assets/readytick.svg" alt="kesz"> </div></div>
                
            </div>
        `;
        document.querySelector(".receivebox").appendChild(el);
        window[metadata.filename].progress_node = el.querySelector(".progress");
        window[metadata.filename].circle=el.querySelector(".in-circle")
        window[metadata.filename].indicator=el.querySelector('.s_indicator')
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


    const zip = new JSZip();


    socket.on("fs-share",function(be){

        buffer=be[0];
        metadata=be[1];

        if (buffer!==null){
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
                name:window[metadata.filename].filename,
                sender_uid:senderID

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
                uid:senderID
            });
        }}else{
            window[metadata.filename].indicator.classList.add('indicating')
            window[metadata.filename].circle.classList.add('notwaitinganymore')
            window[metadata.filename].circle.setAttribute('style', 'opacity:0%;')

            socket.emit("fs-start",{
                uid:senderID
            });
        }
    });
 })();