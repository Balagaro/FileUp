console.log(dbk)
console.log(idk)
console.log(clientid)
dbk=dbk.split(',');
idk=idk.split(',');
dbk = dbk.map(function (x) {
    return parseInt(x, 10);
});
idk = idk.map(function (x) {
    return parseInt(x, 10);
});
const socket=io()
socket.emit('req-var', [idk, dbk])
let inshtml="";
let intoline,darabszam;
socket.on('requed-var', function(into){
    //console.log(into)
    intoline=into[1]

    console.log(intoline)

    if (into[1].length>0){
        darabszam=into[1][0]["db"]
        for (dbsz=0;dbsz<darabszam;dbsz++){
            console.log(into)
    if (into[0]===0){

       inshtml= `
    <div class="custom_line">
    <input style="position: absolute;display: none" type="text" name="tetel" value="${intoline[0]['tetel_id']}_${dbsz}">
    <div class="adpic"><img src="sutik/${intoline[0].picture}.png" alt="suti"></div>
    <div class="description">
    <div class="adtitle">${intoline[0].megnev}</div>
    
</div>
    `
        if (intoline[0]["type"]!==undefined){
        for (d=0;d<intoline.length;d++){
            inshtml+=`
            <div class="cust_box" id="cust_${intoline[d]["tetel_id"]}_${intoline[d]["type"]}_${dbsz}">
            <div class="cust_title">${intoline[d]["type"]}</div>
            
            </div>
            `
        }}
        inshtml+="</div>"
        document.querySelector('.out_adbles').insertAdjacentHTML('beforeend',inshtml)
    }else{
    for (m=0;m<into[1].length;m++){

        console.log(`#cust_${into[1][m]['tetel_id']}_${into[1][m]['type']}_${dbsz}`)
        inshtml=`
        <div class="cust_inline">
        <label for="${into[1][m]['value']}_${into[1][m]['variation_id']}">${into[1][m]['value']}</label>
        <input name="vari" type="checkbox" id="${into[1][m]['value']}_${into[1][m]['variation_id']}" value='${into[1][m]['variation_id']}_${dbsz}' >
        
         
</div>
       `
        document.querySelector(`#cust_${into[1][m]['tetel_id']}_${into[1][m]['type']}_${dbsz}`).insertAdjacentHTML('beforeend', inshtml)
    }
}}}})


