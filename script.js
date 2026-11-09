/*alert("Mirth JavaScript is working!");
alert(
    window.supabase
    ? "Supabase library loaded!"
    : "Supabase library NOT loaded!"
);*/
// =================================
// MIRTH WEBSITE - SUPABASE CONNECTION
// =================================

const SUPABASE_URL = "https://banuamtxoelzmgagbliy.supabase.co";

const SUPABASE_KEY = "sb_publishable_0cDE0IM0GaIKycirs4RO-g_81dWg4Xj";

const db = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

// =================================
// VISITOR IDENTIFICATION
// =================================

let visitorId = localStorage.getItem("mirthVisitor");

if (!visitorId) {
visitorId = crypto.randomUUID();

localStorage.setItem("mirthVisitor", visitorId);

}

// =================================
// LIKE AND DISLIKE
// =================================

async function loadReactions() {

const { data, error } = await db
    .from("mirth_reactions")
    .select("reaction");

if (error) {
    console.error(error);
    return;
}

const likes = data.filter(
    item => item.reaction === "like"
).length;

const dislikes = data.filter(
    item => item.reaction === "dislike"
).length;

document.getElementById("likes").textContent = likes;

document.getElementById("dislikes").textContent = dislikes;

}

async function react(type) {

const { error } = await db
    .from("mirth_reactions")
    .upsert(
        {
            visitor_id: visitorId,
            reaction: type
        },
        {
            onConflict: "visitor_id"
        }
    );

if (error) {
    alert("Reaction failed. Please try again.");
    console.error(error);
    return;
}

loadReactions();

}

document.getElementById("likeBtn").onclick = function() {
react("like");
};

document.getElementById("dislikeBtn").onclick = function() {
react("dislike");
};

// =================================
// COMMENTS
// =================================

async function loadComments() {

const { data, error } = await db
    .from("mirth_comments")
    .select("*")
    .order("created_at", { ascending: false });

if (error) {
    console.error(error);
    return;
}

const container = document.getElementById("comments");

//container.innerHTML = "";

data.forEach(comment => {

    const box = document.createElement("div");

    box.className = "comment";

    const name = document.createElement("strong");
    name.textContent = comment.name;

    const text = document.createElement("p");
    text.textContent = comment.comment;

    box.appendChild(name);
    box.appendChild(text);

    //container.appendChild(box);

});

}

document.getElementById("commentBtn").onclick = async function() {

const name = document.getElementById("commentName").value.trim();

const comment = document.getElementById("commentText").value.trim();

const message = document.getElementById("commentMessage");

if (!name || !comment) {
    message.textContent = "Please enter your name and comment.";
    return;
}

const { error } = await db
    .from("mirth_comments")
    .insert({
        name: name,
        comment: comment,
        created_at: new Date().toISOString()
    });
if (error) {
    
    console.error("COMMENT ERROR:", error);
    
    message.textContent = "Error: " + error.message;
    
    alert(
        "Comment failed:\n" +
        error.message
    );
    
    return;
}
message.textContent = "Comment posted successfully! ☘️";

document.getElementById("commentName").value = "";

document.getElementById("commentText").value = "";

loadComments();

};

// =================================
// BOOKINGS
// =================================

document.getElementById("bookBtn").onclick = async function() {

const name = document.getElementById("bookingName").value.trim();

const contact = document.getElementById("bookingContact").value.trim();

const message = document.getElementById("bookingMessage");

if (!name) {

    message.textContent = "Please enter your name.";

    return;
}

const { error } = await db
    .from("mirth_bookings")
    .insert({
        name: name,
        contact: contact || null
    });

if (error) {

    console.error(error);

    message.textContent = "Booking failed. Please try again.";

    return;
}

message.textContent = "Booking successful! Welcome to Mirth ☘️";

document.getElementById("bookingName").value = "";

document.getElementById("bookingContact").value = "";

};

// =================================
// INITIALIZE WEBSITE
// =================================

loadReactions();

loadComments();