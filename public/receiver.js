

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





        /*
        document.querySelector(".join-screen").classList.remove("active");
        document.querySelector(".fs-screen").classList.add("active");*/

    });

    socket.on("fogadjadma",function(e){
        document.querySelector('.tickvagyok').classList.add("tickgreen")
        setTimeout(function (){
            document.querySelector('.waitingtorecieve').classList.add('notwaitinganymore')
        }, 1000);
    });

    let fileShare = {};

    socket.on("fs-meta",function(metadata){
        fileShare.metadata = metadata;
        fileShare.transmitted =0;
        fileShare.buffer = [];

        let el =document.createElement("div");
        el.classList.add("item");
        el.innerHTML = `
            
            <div class="filename">${metadata.filename}</div>

            <div>
                <div class="out-circle"><div class="in-circle"><span class="progress">0%</span></div></div>
                <div class="keszpipa"> <img src="docs/assets/readytick.svg" alt="kesz"> </div>
            </div>
        `;
        document.querySelector(".receivebox").appendChild(el);
        fileShare.progress_node = el.querySelector(".progress");
        fileShare.circle=el.querySelector(".in-circle")

        let thebutton=document.querySelector('#recieve')
        thebutton.disabled=false;
        document.querySelector('.out-recievebutt').classList.add('activerecbutt')
        const promise = new Promise((resolve) => {
            thebutton.addEventListener('click', resolve)
        })
        async function waitClick () {
            return await promise
        }
        waitClick()
            .then(() => {
                socket.emit("fs-start",{
                    uid:senderID
                });
            })


    });

    function recieveFile(buffer,progressnode,circle){
        let szazalek=0;

    }


    socket.on("fs-share",function(buffer){

        fileShare.buffer.push(buffer);
        console.log(fileShare);
        fileShare.transmitted += buffer.byteLength;
        let szazalek=Math.trunc(fileShare.transmitted / fileShare.metadata.total_buffer_size * 100)
        fileShare.progress_node.innerText = szazalek + "%";
        rad=szazalek*3.6
        fileShare.circle.style.background= `conic-gradient(#000000 ${rad}deg, #ededed 0deg)`
        if(fileShare.transmitted === fileShare.metadata.total_buffer_size){
            download(new Blob(fileShare.buffer), fileShare.metadata.filename);
            fileShare={};
            document.querySelector(".in-circle").classList.add('readycircle');
            document.querySelector('keszpipa').classList.add('readytick');
            //ezvanhavege

        }else{
            socket.emit("fs-start",{
                uid:senderID
            });
        }
    });
 })();