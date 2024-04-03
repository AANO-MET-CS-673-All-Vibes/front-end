/*
 * allvibes REST API wrapper
 * in vanilla javascript
 */

/* Functions for the main page: matching and messaging */

let suggestions, matches;
let currentSuggestion, currentMatch;

/*
 * matchList(): renders the list of matches in the chat area
 */

async function matchList() {
    const container = document.querySelector(".conversation-area");
    container.innerHTML = "";

    if(matches.people.length == 0) {
        container.innerText = "You don't have any matches yet :(";
        return;
    }

    for(let i = 0; i < matches.people.length; i++) {
        let person = await request("userinfo", {id:matches.people[i].id});
        if(person.status != "ok") {
            alert("failed to retrieve match info for user ID " + matches.people[i].id);
            return;
        } else {
            container.appendChild(await matchListItem(matches.people[i].id, person));
        }
    }
}

/* Helper function for matchList() */

async function matchListItem(id, person) {
    const msg = document.createElement("div");
    const profile = document.createElement("img");
    const detail = document.createElement("div");
    const username = document.createElement("div");
    const content = document.createElement("div");
    const message = document.createElement("span");
    const date = document.createElement("span");

    msg.classList.add("msg");
    profile.classList.add("msg-profile");
    detail.classList.add("msg-detail");
    username.classList.add("msg-username");
    content.classList.add("msg-content");
    message.classList.add("msg-message");
    //date.classList.add("msg-date");

    if(person.image == null) {
        profile.src = "/images/blank.png";
    } else {
        profile.src = person.img;
    }

    username.innerText = person.name;

    // retrieve the most recent message in the history
    let history = await request("history", {id:getCookie("id"), context:id, page:0});
    if(history.status != "ok" || history.count == 0) {
        message.innerHTML = "<em>Start a chat with " + person.name + "!</em>";
    } else {
        message.innerText = history.messages[0].text;
        //date.innerText = elapsed(history.messages[0].timestamp);
        date.classList.add("msg-date");
    }

    msg.appendChild(profile);
    msg.appendChild(detail);
    detail.appendChild(username);
    detail.appendChild(content);
    content.appendChild(message);
    content.appendChild(date);

    msg.onclick = function() {
        //openChat(id);
    }

    return msg;
}

/*
 * suggestion(): renders one possible match suggestion
 */

async function suggestion(index) {
    currentSuggestion = index;

    let person = await request("userinfo", {id:suggestions.people[index].id});
    if(person.status != "ok") {
        return;
    }

    document.querySelector(".card__title").innerText = person.name;
    document.querySelector("progress").value = suggestions.people[index].score;

    let similarity;

    if(suggestions.people[index].score == 0) {
        similarity = "<em>You don't have any music in common with this person but you can still shoot your shot!</em>";
    } else {
        similarity = "You both like ";
        if(suggestions.people[index].artists && suggestions.people[index].artists.length != 0) {
            for(let i = 0; i < suggestions.people[index].artists.length; i++) {
                similarity += suggestions.people[index].artists[i].name;
                if(i == suggestions.people[index].artists.length-1) {
                    similarity += ".";
                } else if(i == suggestions.people[index].artists.length-2) {
                    similarity += ", and ";
                } else {
                    similarity += ", ";
                }
            }
        } else {
            for(let i = 0; i < suggestions.people[index].tracks.length; i++) {
                similarity += suggestions.people[index].tracks[i].name;
                if(i == suggestions.people[index].tracks.length-1) {
                    similarity += ".";
                } else if(i == suggestions.people[index].tracks.length-2) {
                    similarity += ", and ";
                } else {
                    similarity += ", ";
                }
            }
        }
    }

    document.querySelector(".card__subtitle").innerHTML = similarity;
}

window.onload = async function() {
    // save the authentication in a cookie
    const p = new URLSearchParams(window.location.search);

    if(p.has("id")) setCookie("id", p.get("id"));
    if(p.has("token")) {
        setCookie("token", p.get("token"))
        window.location.href = "/profile.html";
    }

    // TODO: request info on the current user to show their updated pfp

    // TODO: update the server with the user's last seen time (i.e. make them appear online rn)

    // request the server to update the current user's music taste, if necessary
    await request("update", {id:getCookie("id"), token:getCookie("token")}, "POST");

    // now retrieve a list of suggested matches
    matches = await request("matches", {id:getCookie("id")});
    if(matches.status != "ok") {
        // TODO: better error handling than this
        alert("failed to retrieve match list");
        return;
    }

    await matchList();

    // suggested matches
    suggestions = await request("recs", {id:getCookie("id")});
    if(suggestions.status != "ok") {
        alert("failed to retrieve suggestions list");
        return;
    }

    await suggestion(0);
};