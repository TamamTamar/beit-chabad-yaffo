window.onerror = function (msg, url, line, col, error) {
    alert("שגיאת תוכנה. פנה לתמיכה טכנית. שגיאה: " + msg);
};

window.PayBtClick = function () {
    document.getElementById('Result').innerHTML = '';
    document.getElementById('PayBtDiv').style.display = 'none';
    document.getElementById('OkDiv').style.display = 'none';
    document.getElementById('WaitPay').style.display = 'block';
    document.getElementById('ErrorDiv').innerHTML = '';
    PostNedarim({
        'Name': 'FinishTransaction2',
        'Value': {
            'Mosad': document.getElementById('MosadId').value,
            'ApiValid': document.getElementById('ApiValid').value,
            'PaymentType': document.getElementById("PaymentType").value,
            'Currency': '1',
            'Zeout': '',
            'FirstName': document.getElementById('ClientName').value,
            'LastName': '',
            'Street': document.getElementById('Street').value,
            'City': document.getElementById('City').value,
            'Phone': '',
            'Mail': '',
            'Amount': document.getElementById('Amount').value,
            'Tashlumim': '1',
            'Groupe': '',
            'Comment': 'בדיקת אייפרם 2',
            'Param1': 'פרמטר 1',
            'Param2': '',
            'ForceUpdateMatching': '1',
            'CallBack': '',
            'CallBackMailError': '',
            'Tokef': document.getElementById('Tokef').value
        }
    });
};

function PostNedarim(Data) {
    var iframeWin = document.getElementById('NedarimFrame').contentWindow;
    iframeWin.postMessage(Data, "*");
}

window.addEventListener("message", function (event) {
    console.log(event.data);
    if (event.data.Name === 'Height') {
        document.getElementById('NedarimFrame').style.height = (parseInt(event.data.Value) + 15) + "px";
        document.getElementById('WaitNedarimFrame').style.display = 'none';
    } else if (event.data.Name === 'TransactionResponse') {
        document.getElementById('Result').innerHTML = `<b>TransactionResponse:<br/>${JSON.stringify(event.data.Value)}</b><br/>see full data in console`;
        console.log(event.data.Value);
        if (event.data.Value.Status === 'Error') {
            document.getElementById('ErrorDiv').innerHTML = event.data.Value.Message;
            document.getElementById('WaitPay').style.display = 'none';
            document.getElementById('PayBtDiv').style.display = 'block';
        } else {
            document.getElementById('WaitPay').style.display = 'none';
            document.getElementById('OkDiv').style.display = 'block';
        }
    }
}, false);
