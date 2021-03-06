var currentUser;

//Populate users information
function populateInfo() {
    firebase.auth().onAuthStateChanged((user) => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
            //get the document for current user.
            currentUser.get().then((userDoc) => {
                //get the data fields of the user
                var userName = userDoc.data().name;
                //console.log(userName)
                var userEmail = userDoc.data().email;

                //if the data fields are not empty, then write them in to the form.
                if (userName != null) {
                    document.getElementById("nameInput").value = userName;
                }
                if (userEmail != null) {
                    document.getElementById("emailInput").value = userEmail;
                }
            });
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}
populateInfo();

//Enable textfield
function editUserInfo() {
    console.log("edit is clicked")
    document.getElementById("personalInfoFields").disabled = false;
}

//Update user information
function saveUserInfo() {
    console.log("save is clicked")

    //grab values from the form that the user inserted in each field
    username = document.getElementById('nameInput').value;
    email = document.getElementById('emailInput').value;

    // write the values in database
    console.log(currentUser)
    currentUser.update({
        name: username,
        email: email
    })

    firebase.auth().onAuthStateChanged((user) => {
        // Check if user is signed in:
        if (user) {
            user.updateEmail(email)
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });

    document.getElementById("personalInfoFields").disabled = true;
}


//Confirmation Modal
var modal = document.getElementById("myModal");

var btn = document.getElementById("save");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    modal.style.display = "block";
    saveUserInfo();
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//Logout
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location.assign("/index.html")
    }).catch((error) => {
        // An error happened.
    });
}

//Show profile picture
function profileImg() {
    firebase.auth().onAuthStateChanged((user) => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
            //get the document for current user.
            currentUser.get().then((userDoc) => {
                //get the data fields of the user
                var userPicture = userDoc.data().picture;

                if (userPicture != null) {
                    document.getElementById("profile-img").src = userPicture
                }
            });
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}
profileImg();

//Update profile picture
function setPicture(imgsrc) {
    document.getElementById("profile-img").src = imgsrc

    let profilePic = imgsrc;

    currentUser.update({
        picture: profilePic

    })
}
