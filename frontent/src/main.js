const loginUser = document.getElementById("login-user");
const loginPass = document.getElementById("login-pass");
const signinBtn = document.getElementById("signin-btn");

const signupUser = document.getElementById("signup-user");
const signupPass = document.getElementById("signup-pass");
const signupRepeat = document.getElementById("signup-repeat");
const signupEmail = document.getElementById("signup-email");
const signupBtn = document.getElementById("signup-btn");

//LOGIN
signinBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const username = loginUser.value.trim();
  const password = loginPass.value.trim();

  if (!username || !password) {
    loginUser.style.border = "1px solid red";
    loginPass.style.border = "1px solid red";
    alert("Please enter username and password!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const text = await res.text();
    alert(text);
  } catch (err) {
    console.error(err);
    alert("Login failed!");
  }
});

// SIGNUP
signupBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const username = signupUser.value.trim();
  const password = signupPass.value.trim();
  const repeat = signupRepeat.value.trim();
  const email = signupEmail.value.trim();

  if (!username || !password || !repeat || !email) {
    alert("Please fill all fields!");
    signupUser.style.border = "1px solid red"
    signupPass.style.border = "1px solid red"
    signupRepeat.style.border = "1px solid red"
    signupEmail.style.border = "1px solid red"
    return;
  }

  if (password !== repeat) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    });

    const text = await res.text();
    alert(text);
  } catch (err) {
    console.error(err);
    alert("Signup failed!");
  }
});
