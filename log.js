let signupbtn = document.getElementById(" signupbtn");
let signinbtn = document.getElementById(" signinbtn");
let signinlink = document.getElementById("signin-link");
let signuplink = document.getElementById("signup-link")
let name = document.getElementById("name");
let title = document.getElementById("title");
let signupContainer = document.querySelector(".signup-paragraph");
let signinContainer = document.querySelector(".signin-paragraph");
let signinbtnContainer = document.querySelector(".signin-btn");
let signupbtnContainer = document.querySelector(".disable");

let nameInput = document.getElementById("name-input-field");

signinlink.onclick = function() {

    nameInput.style.display = "none";
    name.classList.add("hide");

    signinContainer.classList.add("hide");
    signupContainer.classList.remove("hide");
    title.innerHTML = "Sign In"
    signinbtnContainer.classList.remove("hide");
    signupbtnContainer.classList.add("hide");

}

signuplink.onclick = function() {

    nameInput.style.display = "block";
    name.classList.remove("hide");

    signupContainer.classList.add("hide");
    signinContainer.classList.remove("hide");

    title.innerHTML = "Sign up";
    signinbtnContainer.classList.add("hide");
    signupbtnContainer.classList.remove("hide");
}