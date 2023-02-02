// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getDoc, doc, setDoc, getFirestore } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEmms8bFY8oJcMvaFJUCoVl_DBbtWXZzA",
    authDomain: "dueprogetto.firebaseapp.com",
    databaseURL: "https://dueprogetto-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dueprogetto",
    storageBucket: "dueprogetto.appspot.com",
    messagingSenderId: "649746301952",
    appId: "1:649746301952:web:ea0e940276cc848a3b04e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {

    if (user && document.getElementById('Email')) {
        document.getElementById('Login-Button').style.display = 'none'
        document.getElementById('Email').style.cssText = 'width:auto;display:block'
        document.getElementById('Email').innerText = 'Logout'
    }

    if (user && location.pathname == '/profile.html') {

        const docRef = doc(db, "wisdom_student", user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data()
            const {Firstname,Middlename,Lastname,Gender,Email,Age,Address,Dateofbirth} = data
            const required = {Firstname,Middlename,Lastname,Gender,Email,Age,Address,Dateofbirth,Phone:data['Phone-number']}
            const table = document.createElement('table')
            const caption = document.createElement('caption')
            caption.innerHTML = `${Firstname} ${Middlename} ${Lastname}`
            caption.className = 'w3-xlarge w3-padding'
            table.appendChild(caption)
            table.className = 'w3-table-all'
            for (const [key,value] of Object.entries(required)) {
                const tr = document.createElement('tr')
                for (const k of [key,value]) {
                    const td = document.createElement('td')
                    td.innerHTML = k
                    tr.appendChild(td)
                }
                table.appendChild(tr)    
            }
            document.getElementById('profile-widget').appendChild(table)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }
})


// Login form handler start
if (document.querySelector('#id01 form')) {
    document.querySelector('#id01 form').onsubmit = e => {
        e.preventDefault()

        const email = e.target.uname.value
        const password = e.target.psw.value


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                if (user.email == 'admin@wisdom.lk') window.location.href = '/register.html'
                else window.location.href = '/profile.html'
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)
            });
    }
}

// Login form handler end


// Register form handler start 


if (document.getElementById('register-form')) {

    document.getElementById('register-form').onsubmit = async (e) => {
        e.preventDefault()
        const obj = {}
        const formData = new FormData(document.getElementById('register-form'))
        for (let [key, value] of formData.entries()) obj[key] = value;
        try {
            await createUserWithEmailAndPassword(auth, obj['Email'], obj['Password'])
            const docRef = await setDoc(doc(db, "wisdom_student", obj['Email']), obj)
            document.getElementById('register-form').reset()
        } catch (error) {
            alert(error.message)
        }
    }
}

// Register form handler end 

//Logout start

if (document.getElementById('Email')) {
    document.getElementById('Email').onclick = async()=>{
        auth.signOut()
        location.reload()
    }
}



