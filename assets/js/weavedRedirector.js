HTTP_WEAVED_SERVICE = 'http-mqtt';

function weavedLogin(username, password) {
    httpRequestAsync('GET', 'https://api.weaved.com/v22/api/user/login/' + username + '/' + password, function (data) {
        var jsonResponse = JSON.parse(data);
        confirmStep("login");
        getDevicesList(jsonResponse.token);
    })
}

function getDevicesList(token) {
    httpRequestAsync('GET', 'https://api.weaved.com/v22/api/device/list/all', function (data) {
        var jsonResponse = JSON.parse(data);
        for (device in jsonResponse.devices) {
            if (jsonResponse.devices[device].devicealias == HTTP_WEAVED_SERVICE) {
                confirmStep("deviceList");
                connectToHttpDevice(token, jsonResponse.devices[device].deviceaddress, jsonResponse.devices[device].devicelastip);
            }
        }
    }, token)
}

function connectToHttpDevice(token, deviceaddress, devicelastip) {
    httpRequestAsync('POST', 'https://api.weaved.com/v22/api/device/connect', function (data) {
        var jsonResponse = JSON.parse(data);
        confirmStep("connect");
        document.getElementById('login_button').classList.replace('btn-warning', 'btn-success');
        window.location = jsonResponse.connection.proxy.replace('https', 'http');
    }, token, deviceaddress, devicelastip)
}

function httpRequestAsync(type, url, callback, token, deviceaddress, devicelastip) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var data = httpRequest.responseText;
            if (callback) {
                callback(data);
            }
        }
    };

    if (type == 'GET') {
        httpRequest.open('GET', url, true);
        httpRequest.setRequestHeader('apikey', 'WeavedDemoKey$2015');
        if (token) {
            httpRequest.setRequestHeader('token', token);
        }
        httpRequest.send(null);
    }

    if (type == 'POST') {
        jsonData = '{"deviceaddress":"' + deviceaddress + '", "hostip":"' + devicelastip + '","wait":"true"}'
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader('apikey', 'WeavedDemoKey$2015');
        httpRequest.setRequestHeader('token', token);
        httpRequest.setRequestHeader("content-type", "application/json");
        httpRequest.send(jsonData);
    }
}

function confirmStep(step) {
    document.getElementById(step).classList.replace('alert-secondary', 'alert-success');
}