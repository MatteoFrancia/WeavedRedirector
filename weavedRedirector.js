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
        /*
         console.log('XXXXXXXXXXXXXXXXXXXXXXXX');
         console.log(jsonData);
         console.log(httpRequest);
         console.log('XXXXXXXXXXXXXXXXXXXXXXXX');
         */
        httpRequest.send(jsonData);
    }
}

function weavedLogin(username, password) {
    httpRequestAsync('GET', 'https://api.weaved.com/v22/api/user/login/' + username + '/' + password, function (data) {
        var jsonResponse = JSON.parse(data);
        /*
         console.log('~~~~~~~~~~~~~~~~~~~ LOGIN ~~~~~~~~~~~~~~~~~~~~');
         console.log(data);
         console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
         console.log(jsonResponse.token);
         console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
         */
        document.getElementById("login").checked = true;
        getDevicesList(jsonResponse.token);
    })
}

function getDevicesList(token) {
    httpRequestAsync('GET', 'https://api.weaved.com/v22/api/device/list/all', function (data) {
        var jsonResponse = JSON.parse(data);
       
         console.log('============ GET DEVICE LIST ======');
         console.log(data);
         console.log('==================================');
         console.log(jsonResponse.devices[0].deviceaddress);
         console.log(jsonResponse.devices[0].devicelastip);
         console.log(jsonResponse.devices[1].deviceaddress);
         console.log(jsonResponse.devices[1].devicelastip);
         console.log('==================================');
 
        document.getElementById("deviceList").checked = true;
        connectToHttpDevice(token, jsonResponse.devices[0].deviceaddress, jsonResponse.devices[0].devicelastip);
    }, token)
}

function connectToHttpDevice(token, deviceaddress, devicelastip) {
    httpRequestAsync('POST', 'https://api.weaved.com/v22/api/device/connect', function (data) {
        var jsonResponse = JSON.parse(data);
        /*
         console.log('___________________________');
         console.log(jsonResponse.connection.proxy.replace('https','http'));
         console.log('___________________________');
         */
        document.getElementById("connect").checked = true;
        window.location = jsonResponse.connection.proxy.replace('https', 'http');
    }, token, deviceaddress, devicelastip)
}   