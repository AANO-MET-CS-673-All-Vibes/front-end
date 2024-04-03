const api = "http://127.0.0.1:5000/";   // TODO

async function request(uri, parameters=null, type="GET", file=false) {
    let path = api+uri;
    let parsedParams = "";

    if(parameters != null) {
        keys = Object.keys(parameters);
        values = Object.values(parameters);
        
        for(let i = 0; i < keys.length; i++) {
            parsedParams += keys[i] + "=" + values[i] + "&";
        }
    }

    if(type == "GET" && parameters != null) {
        path += "?" + parsedParams;
    }

    if(!file) {
        const response = await fetch(path, {
            method: type,
            mode: type == "GET" ? "cors" : "no-cors",
            cache: "no-cache",
            headers: type == "GET" ? {} : { "Content-Type": (file == false) ? "application/x-www-form-urlencoded" : "multipart/form-data" },
            body: type == "GET" ? null : parsedParams   // TODO
        });

        if(type == "GET") {
            const output = await response.json();
            return output;
        }
    } else {
        // FILE UPLOAD
        var data = new FormData();
        data.append("data", parameters.data);
        data.append("id", getCookie("id"));

        const response = await fetch(path, {
            method: "POST",
            //headers: { "Content-Type" : "multipart/form-data"},   // wtf was i thinking here
            body: data
        });
    }
}

function login() {
    window.location.replace(api + "weblogin");
    return false;
}

async function callback() {
    const p = new URLSearchParams(window.location.search);

    const callbackResponse = await request("callback", {code:p.get("code")});

    if(callbackResponse.exists) {
        window.location.href = "/profile.html?id=" + callbackResponse.id + "&token=" + callbackResponse.token;
    } else {
        window.location.href = "/signup.html?code=" + p.get("code");
    }
}