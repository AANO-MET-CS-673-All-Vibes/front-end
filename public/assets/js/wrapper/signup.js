/*
 * allvibes REST API wrapper
 * in vanilla javascript
 */

/* Functions for the signup page */

/*
 * ageVerify(): verifies that the user is over 18 years old before allowing a signup
 */

function ageVerify() {
    let dob = new Date(document.getElementById("dob").value);
    let now = new Date();

    let age = now.getTime() - dob.getTime();
    age /= 1000;        // milliseconds to seconds
    age /= 86400;       // to days
    age /= 365;         // to years

    if(age < 18) {
        document.getElementById("agewarning").style.display = "block";
        return false;
    } else {
        return true;
    }
}

window.onload = async function() {
    document.getElementById("signup-form").action = api + "websignup";
    document.getElementById("signup-form").onsubmit = ageVerify;

    const p = new URLSearchParams(window.location.search);
    const callbackResponse = await request("callback", {code:p.get("code")});
    document.getElementById("token").value = callbackResponse.token;
    document.getElementById("email").value = callbackResponse.email;
    document.getElementById("emailText").value = callbackResponse.email;
};
