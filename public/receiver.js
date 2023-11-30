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
        if(senderID.length == 0){
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
        console.log('2323')
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
            <div class="progress">0%</div>
        `;
        document.querySelector(".receivebox").appendChild(el);
        fileShare.progress_node = el.querySelector(".progress");
        let thebutton=document.querySelector('#recieve')
        thebutton.disabled=false;



        socket.emit("fs-start",{
            uid:senderID
        });
    });

    socket.on("fs-share",function(buffer){
        fileShare.buffer.push(buffer);
        fileShare.transmitted += buffer.byteLength;
        fileShare.progress_node.innerText = Math.trunc(fileShare.transmitted / fileShare.metadata.total_buffer_size * 100) + "%";
        if(fileShare.transmitted == fileShare.metadata.total_buffer_size){
            download(new Blob(fileShare.buffer), fileShare.metadata.filename);
            fileShare={};
        }else{
            socket.emit("fs-start",{
                uid:senderID
            });
        }
    });
 })();