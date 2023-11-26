 (function(){
    let receiverID;
    const socket = io();

    function generateID() {
        return `${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}` ;
    }


    let joinID = generateID();
    document.querySelector("#codeline").value=joinID;
    socket.emit("sender-join",{
        uid:joinID
    });

    socket.on("init", function(uid){
        receiverID = uid;
        document.querySelector(".waitingfor").classList.remove("active");
        document.querySelector(".readyfor").classList.add("active");
        setTimeout(function(){
            document.querySelector(".readyfor").classList.remove("active");
            document.querySelector(".fileok").classList.add("active");

        }, 1000);


    });

    document.querySelector("#drop_zone").addEventListener("change",function(e){
        let file = e.target.files[0];
        if (!file){
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e){
            let buffer = new Uint8Array(reader.result);
            let el =document.createElement("div");
            el.classList.add("item");
            el.innerHTML = `
                <div class="filename">${file.name}</div>
                <div class="progress">0%</div>
                
            `;

            document.querySelector(".fileok").appendChild(el);
            shareFile({
                filename:file.name,
                total_buffer_size:buffer.length,
                buffer_size:1024
            },buffer,el.querySelector(".progress"));
        }
        reader.readAsArrayBuffer(file);
    })

    function shareFile(metadata,buffer,progress_node){
        socket.emit("file-meta",{
            uid:receiverID,
            metadata:metadata
        });
        socket.on("fs-share",function(){
            let chunk = buffer.slice(0,metadata.buffer_size);
            buffer = buffer.slice(metadata.buffer_size,buffer.length);
            progress_node.innerText=Math.trunc((metadata.total_buffer_size - buffer.length) /metadata.total_buffer_size * 100) + "%";
            if(chunk.length !=0){
                socket.emit("file-raw",{
                    uid:receiverID,
                    buffer:chunk
                });
            }
        });
    }

 })();