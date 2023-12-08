

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
                document.querySelector('.waitingtoreceive').classList.add('notwaitinganymore')
            }, 2000);

        });
        setTimeout(function (){
            if (checkcode===0){
                alert("Hibás kód!")
            }
        }, 1000)



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
                <div class="loader"></div> 
                <div class="out-circle"><div class="in-circle"><span class="progress">0%</span></div></div>
                <div class="keszpipa"> <img src="docs/assets/readytick.svg" alt="kesz"> </div>
            </div>
        `;
        document.querySelector(".receivebox").appendChild(el);
        fileShare.progress_node = el.querySelector(".progress");
        fileShare.circle=el.querySelector(".in-circle")

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
                document.querySelector(".loader").classList.add('nonsub')
                socket.emit("fs-start",{
                    uid:senderID
                });
            })
    });



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
            document.querySelector('.keszpipa').classList.add('readytick');
            //ezvanhavege

        }else{
            socket.emit("fs-start",{
                uid:senderID
            });
        }
    });
 })();