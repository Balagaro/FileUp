//console.log(dbk)
//console.log(idk)

let paymentsClient;

function onGooglePayLoaded() {
    let currentPaymentDataRequest = {
        transactionInfo: {
            totalPrice: '0.00',
            currencyCode: 'HUF',
            countryCode: 'HU'
        }
    };
    paymentsClient = new google.payments.api.PaymentsClient({
        environment: 'TEST',
        paymentDataCallbacks: {
            onPaymentAuthorized: function(paymentData) {
                console.log("siker");
            },
            onPaymentCancelled: function() {
                console.log('canceled')
                alert("Fizetés visszavonva");
            },
            onError: function(error) {
                alert("Fizetési hiba");
            }
        }
    });

    const isReadyToPayRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
            {
                type: 'CARD',
                parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
                },
                tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                        gateway: 'stripe',
                        stripeVersion: '2025-03-31.basil',
                        publishableKey: 'pk_test_51RD0lcKdDFtfHQ0YFGNwQtddDPijWcsQskrgCuFSE0RkjIzv2stkaO9Xg9jn7EBAKK6FVnkhUbarVaa7gkyO9BE100n5VhfPCi',
                    },
                },
            }
        ],
    };

    paymentsClient.isReadyToPay(isReadyToPayRequest)
        .then(function(response) {
            if (response.result) {
                createAndAddButton();
            } else {
                console.log('Google Pay is not available on this device.');
            }
        })
        .catch(function(error) {
            console.error('Error checking Google Pay readiness:', error);
        });

    function handlePayment() {
        console.log('Google Pay gomb megnyomva');

        const currentPaymentDataRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            merchantInfo: {
                merchantId: 'BCR2DN4T26B2VVCN',
                merchantName: 'Táncsics Teaház',
            },
            allowedPaymentMethods: [
                {
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
                    },
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            gateway: 'stripe',
                            stripeVersion: '2025-03-31.basil',
                            publishableKey: 'pk_test_51RD0lcKdDFtfHQ0YFGNwQtddDPijWcsQskrgCuFSE0RkjIzv2stkaO9Xg9jn7EBAKK6FVnkhUbarVaa7gkyO9BE100n5VhfPCi',
                        },
                    },
                }
            ],
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: '17500',
                currencyCode: 'HUF',
                countryCode: 'HU'
            },
            shippingAddressRequired: false,
            shippingOptionRequired: false,
            callbackIntents: ['PAYMENT_AUTHORIZATION']
        };

        console.log('Payment data request:', currentPaymentDataRequest);

        paymentsClient.loadPaymentData(currentPaymentDataRequest)
            .then(function(paymentData) {
                console.log('Payment data loaded successfully:', paymentData);

                // Fizetési adatok elküldése a szervernek
                fetch('/api/fizetes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(paymentData),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Sikeres fizetés esetén futtassuk a kívánt kódot
                            document.getElementById('paytype').value = 0;
                            document.getElementById('formsub').submit();
                        } else {
                            // Hiba kezelése (pl. hibaüzenet megjelenítése)
                            console.error('Fizetés sikertelen:', data.error);
                            alert('A fizetés sikertelen volt. Kérjük, próbálja újra.');
                        }
                    })
                    .catch(error => {
                        console.error('Hiba a fizetés során:', error);
                        alert('Hiba történt a fizetés során. Kérjük, próbálja újra.');
                    });

            })
            .catch(function(error) {
                console.error('Error during payment:', error);
                alert("Fizetési hiba");
            });
    }

    function createAndAddButton() {
        const paymentButton = paymentsClient.createButton({
            onClick: handlePayment,
            buttonColor: 'default',
            buttonType: 'buy',
            buttonSizeMode: 'standard',
        });

        const buttonContainer = document.getElementById('google-pay-button');
        if (buttonContainer) {
            buttonContainer.appendChild(paymentButton);
        } else {
            console.error('Element with ID "google-pay-button" not found.');
        }
    }
}




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
//console.log(idk)
//console.log(dbk)
socket.emit('req-var', [idk, dbk])
let inshtml="";
let intoline,darabszam;
socket.on('requed-var', function(into){

    intoline=into[1]

    console.log("line", intoline)

    if (into[1].length>0){
        darabszam=into[1][0]["db"]
        console.log("db", darabszam)
        console.log("into", into[0])
        for (dbsz=0;dbsz<darabszam;dbsz++){

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
        if (into[0]===-1){
            inshtml= `
    <div style="display: none; position: absolute" class="custom_line" >
    <input style="position: absolute;display: none" type="text" name="tetel" value="${intoline[0]['tetel_id']}_${dbsz}">
    <div class="adpic"><img src="sutik/${intoline[0].picture}.png" alt="suti"></div>
    <div class="description">
    <div class="adtitle">${intoline[0].megnev}</div>
    
</div>
    `
            if (intoline[0]["type"]!==undefined){
                for (d=0;d<intoline.length;d++){
                    inshtml+=`
            <div style="display: none; position: absolute" class="cust_box" id="cust_${intoline[d]["tetel_id"]}_${intoline[d]["type"]}_${dbsz}">
            <div  class="cust_title">${intoline[d]["type"]}</div>
            
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
    }}
}}}})


document.getElementById('fortgomb').onclick = function(){
    document.getElementById('paytype').value=1
    document.getElementById('formsub').submit();
}

document.getElementById('fizeteskasszanal').onclick = function(){

    document.getElementById('paytype').value=0
    document.getElementById('formsub').submit();
}
