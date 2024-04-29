/*
 * allvibes REST API wrapper
 * in vanilla javascript
 */

// root of the API
const api = "/api/";   // localhost:5000/ for development, /api/ for production

/*
 * getCookie(): returns the value associated with a cookie
 * Parameters: name - name of the cookie
 * Returns: contents of the cookie or null if it doesn't exist
 */

function getCookie(name) {
    let cookieName = name + "=";
    let cookies = decodeURIComponent(document.cookie).split(";");
    if(!cookies.length) return null;

    for(var i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while(cookie.charAt(0) == ' ') cookie = cookie.substring(1);

        if(cookie.search(cookieName) == 0) {
            let ret = cookie.substring(cookieName.length, cookie.length);
            while(ret.charAt(0) == ' ') ret = ret.substring(1);
            return ret;
        }
    }

    return null;
}

/*
 * setCookie(): create or updates a cookie
 * Parameters: name - cookie name
 * Parameters: value - value to store in the cookie
 * Returns: nothing
 */

function setCookie(name, value) {
    console.log("setting cookie " + name + "=" + value);
    document.cookie = name + "=" + value + ";Path=/;Domain=" + window.location.hostname;  // two months
    console.log(document.cookie);
}

/*
 * request(): generic API endpoint caller
 * Parameters: uri - endpoint to call
 * Parameters: parameter - JSON object containing all the parameters to be passed
 * Parameters: type - HTTP request verb, "GET" or "POST"
 * Parameters: file - whether this request is uploading a file, only valid when type=="POST"
 * Returns: JSON object containing API response as defined in the backend docs
 */

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

/*
 * login(): redirects to the login/authorize page
 */

function login() {
    window.location.replace(api + "weblogin");
    return false;
}

/*
 * callback(): handler for post-authentication account verification
 */

async function callback() {
    const p = new URLSearchParams(window.location.search);

    const callbackResponse = await request("callback", {code:p.get("code")});

    if(callbackResponse.exists) {
        window.location.href = "/profile.html?id=" + callbackResponse.id + "&token=" + callbackResponse.token;
    } else {
        window.location.href = "/signup.html?code=" + p.get("code");
    }
}

