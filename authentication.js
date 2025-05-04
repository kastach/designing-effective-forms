import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-XJo_AhzPGO_Y_J2SdRy8XPTvDPs2_ws",
    authDomain: "tpf4-c4d57.firebaseapp.com",
    projectId: "tpf4-c4d57",
    storageBucket: "tpf4-c4d57.firebasestorage.app",
    messagingSenderId: "52357196256",
    appId: "1:52357196256:web:7a4a818df1897ad478a385"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

const userSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Signed in as:", user.displayName);
  } catch (error) {
    console.error("Sign-in error:", error.code, error.message);
  }
}

const userSignOut = async () => {
  try {
    await signOut(auth);
    alert("You have been signed out!");
  } catch (error) {
    console.error("Sign-out error:", error.code, error.message);
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    alert(`You are authenticated as ${user.displayName}`);
    console.log(user);
  } else {
    console.log("No user signed in.");
  }
});

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);

onAuthStateChanged(auth, (user) => {
    if (user) {
      const displayName = user.displayName || "";
      const email = user.email || "";
      const [firstName, ...rest] = displayName.split(" ");
      const lastName = rest.join(" ");
  
      const firstNameInput = document.querySelector("#firstName");
      const lastNameInput = document.querySelector("#lastName");
      const emailInput = document.querySelector("#exampleInputEmail1");
  
      if (firstNameInput) firstNameInput.value = firstName;
      if (lastNameInput) lastNameInput.value = lastName;
      if (emailInput) emailInput.value = email;
    }
});
 

