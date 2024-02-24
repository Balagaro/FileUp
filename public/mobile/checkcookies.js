

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkCookie(cname) {
    let user = getCookie(cname);
    if (user != "") {
        return user
    } else {
        return 0


    }
}



let modalbox = document.getElementById("modalbox");
let blockbox=document.querySelector('.block_cookies')
function showModal(){
    blockbox.classList.add("sutikvegig")
    setTimeout(() => {
        modalbox.style.display = "block"
        modalbox.style.zIndex=50
    }, 500);
}




function checkifcookies(){
    const vane=checkCookie("cookies")
    if (vane===0){
        showModal()
    }
}

function closeModal_accept(){
    modalbox.style.display = "none"
    modalbox.style.zIndex=-1;
    blockbox.classList.remove("sutikvegig")
    setCookie("cookies", "true", 7)
}

function closeModal_decline(){
    alert("Az Ön helyében meggondolnám")
}
