const firebaseConfig = {
    apiKey: "AIzaSyDawvgJ0_iQ8BIAa50MHpRTtqryMXboqa0",
    authDomain: "fir-85641.firebaseapp.com",
    databaseURL: "https://fir-85641.firebaseio.com",
    projectId: "fir-85641",
    storageBucket: "fir-85641.appspot.com",
    messagingSenderId: "1006884646861",
    appId: "1:1006884646861:web:cee747b623352eea49de84",
    measurementId: "G-J1V039WZHV"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  const auth=firebase.auth();
  const db = firebase.firestore();

  //for pdf store and generate;
  // const storage = firebase.storage();
  
  // const storageRef= storage.refFromURL('gs://fir-85641.appspot.com')

  // function pdf(){
  //   storageRef.child('correct.png').getDownloadURL().then(function(url) {
  //     // `url` is the download URL for 'images/stars.jpg'
  //     console.log(url);
  //     // This can be downloaded directly:
  //   }).catch(function(error) {
  //     // Handle any errors
  //   });
  // }

  const logout = document.querySelector('#logout');
  logout.addEventListener('click', (e) => {
    console.log("Logging out")
    e.preventDefault();
    auth.signOut().then(() => {
      uid=null;
      email=null;
      console.log('user signed out');
      window.location.href="index.html";
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage)
    });
  });

  var uid=null;
  var email=null;
  function getuid(){
    var user = firebase.auth().currentUser
    if (user) {
      email = user.email;
      uid = user.uid;
      window.localStorage.setItem("uid",uid);
      console.log("eeeeeeeeeeee",email)
      return uid;
    } else {
      uid=null;
      email=null;
      window.localStorage.setItem("uid",uid);
      return null;
      // No user is signed in.
    }
  }

 firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log("in authstatechanged");
      email = user.email;
      uid = user.uid;
      window.localStorage.setItem("uid",uid);
      console.log("uid",uid);
      document.getElementById("nav-doctorEmail").textContent=email;
      // ...
    } else {
      // User is signed out.
      // ...
      uid=null;
      email=null;
      window.localStorage.setItem("uid",uid);
    }
    // ...
  });


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function checkAccess(){
    //x=getuid();
    body=document.getElementById("home");
    sleep(2000).then(() => { 
      //console.log("heeeeeereeeeee",getuid());
    if(getuid()!=null){
        console.log("here");
        body.style.visibility="visible";
    }
    else{
      console.log("not here");
        body.style.visibility="visible";
        // alert("Unauthorized access");
        //window.location.href="401.html";
    }
});
}


