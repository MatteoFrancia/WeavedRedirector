HTTP_WEAVED_SERVICE = 'http-mqtt';
API_KEY = "ODQ3QTNBOEItRkVERS00MUQxLTlEMUYtNDY1MkM5Mzk4RTlC";

function weavedLogin(username, password) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.remot3.it/apv/v23.5/user/login",
        "method": "POST",
        "headers": {
            "developerkey": "" + API_KEY + "",
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": "{ \"username\" : \"" + username + "\", \"password\" : \"" + password + "\" }"
    };

    $.ajax(settings).done(function (response) {
        confirmStep("login");
        getDevicesList(response.token);
    });
}

function getDevicesList(token) {
    $.ajax({
        contentType: 'application/json',
        dataType: 'json',
        headers: {'apikey': API_KEY, 'token': token},
        success: function (response) {
            for (device in response.devices) {
                if (response.devices[device].devicealias == HTTP_WEAVED_SERVICE) {
                    confirmStep("deviceList");
                    connectToHttpDevice(token, response.devices[device].deviceaddress, response.devices[device].devicelastip);
                }
            }
        },
        error: function (data) {
            console.log("Devices Error: " + JSON.stringify(data));
        },
        processData: false,
        type: 'GET',
        url: 'https://api.remot3.it/apv/v23.5/device/list/all'
    });
}

function connectToHttpDevice(token, deviceaddress, devicelastip) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.remot3.it/apv/v23.5/device/connect",
        "method": "POST",
        "headers": {
            "apikey": API_KEY,
            "token": token,
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": "{ \"deviceaddress\" : \"" + deviceaddress + "\", \"hostip\" : \"" + devicelastip + "\",\"wait\" : \"true\" }"
    };

    $.ajax(settings).done(function (response) {
        document.getElementById('login_button').classList.replace('btn-warning', 'btn-success');
        confirmStep("connect");
        window.location = response.connection.proxy.replace('https', 'http');
    });
}

function confirmStep(step) {
    document.getElementById(step).classList.replace('alert-secondary', 'alert-success');
}