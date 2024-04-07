/*
 * allvibes REST API wrapper
 * in vanilla javascript
 */

/* Functions for profile editing */

async function submitEdit() {
    // TODO: edit name
    // TODO: edit gender

    let editBio = await request("edit/bio", {id:getCookie("id"), bio:document.getElementById("bio").value}, "POST");
    return false;
}

window.onload = async function() {
    let userinfo = await request("userinfo", {id:getCookie("id")});
    
    if(userinfo.image) document.getElementById("pfp").src = userinfo.image;
    else document.getElementById("pfp").src = "/images/blank.png";

    document.getElementById("bio-preview").innerText = userinfo.bio;
    document.getElementById("bio").innerText = userinfo.bio;
    document.getElementById("name").value = userinfo.name;
    document.getElementById("dob").value = userinfo.dob;
    //document.getElementById("email").value = userinfo.email;
    
    if(userinfo.gender == 0) document.getElementById("gender").value = "Male";
    else if(userinfo.gender == 1) document.getElementById("gender").value = "Female";
    else document.getElementById("gender").value = "Other";

    setInterval(function() {
        document.getElementById("bio-preview").innerText = document.getElementById("bio").value;
    }, 250);

    document.getElementById("edit-form").onsubmit = function() { submitEdit(); return false; }
};
