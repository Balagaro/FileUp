function dropHandler(ev) {
    const socket = io();
    //console.log("File(s) dropped");
    ev.preventDefault();
    [...ev.dataTransfer.items].forEach((item, i) => {
        const file = item.getAsFile();
        //console.log('jou')

    });

}

(function() {
    let receiverID;
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

//koros retek


//koros retek vege
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
            let buffer = new Uint8Array(reader.result);
            let el =document.createElement("div");
            el.classList.add("item");
            el.innerHTML = `
                <div class="filename">${filename}</div>
                <div class="out-circle"><div class="in-circle"><span class="progress">0%</span></div></div>
            `;

            document.querySelector(".fileok").appendChild(el);
            shareFile({
                filename:file.name,
                total_buffer_size:buffer.length,
                buffer_size:1024,
            },buffer,el.querySelector(".progress"));
        }
        reader.readAsArrayBuffer(file);
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
            let buffer = new Uint8Array(reader.result);
            let el =document.createElement("div");
            el.classList.add("item");
            el.innerHTML = `
                <div class="filename">${filename}</div>
                <div class="out-circle"><div class="in-circle"><span class="progress">0%</span></div></div>
                
            `;

            document.querySelector(".fileok").appendChild(el);
            shareFile({
                filename:dropped.name,
                total_buffer_size:buffer.length,
                buffer_size:1024
            },buffer,el.querySelector(".progress"));
        }
        reader.readAsArrayBuffer(dropped);

    }

/*
    function shareFile(metadata,buffer,progress_node, circle){


        socket.emit("file-meta",{
            uid:receiverID,
            metadata:metadata
        });
        socket.on("fs-share",function(){
            let rad=0;
            let chunk = buffer.slice(0,metadata.buffer_size);
            buffer = buffer.slice(metadata.buffer_size,buffer.length);
            //szazalek=Math.trunc((metadata.total_buffer_size - buffer.length) /metadata.total_buffer_size * 100);
            //rad=szazalek*3.6
            //progress_node.innerText=(szazalek + "%")
            //circle.style.background= `conic-gradient(#000000 ${rad}deg, #ededed 0deg)`
            progress_node.innerText=Math.trunc((metadata.total_buffer_size - buffer.length) /metadata.total_buffer_size * 100 )+ "%";



            if(chunk.length !=0){
                socket.emit("file-raw",{
                    uid:receiverID,
                    buffer:chunk
                });
            }
        });
    }
*/
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



