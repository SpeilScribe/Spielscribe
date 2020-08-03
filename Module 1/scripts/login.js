var email="";
var password;
var mobilenumber;
var actualOTP;
const loginForm = document.querySelector('#loginForm');
$("#logout").css('visibility', 'hidden');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  //email = document.getElementById("exampleInputEmail").value;
  console.log(email);
  password = document.getElementById("exampleInputPassword").value;
  console.log(actualOTP);
var isOTPCorrect=validate();
if(isOTPCorrect){
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }).then(() => {
alert("Login in progress! Please wait");
loginForm.reset();
    console.log("after");
    window.location.href="connectDoctors.html";
}).catch((error) => {
  var errorCode = error.code;
  var errorMessage = error.message;
  alert(errorMessage)
});
}
else{
  alert("Invalid OTP");
}
});

document.querySelector('#resetPassword').addEventListener('click' , (e) => {
  e.preventDefault();
  email = document.getElementById("exampleInputEmail").value;
  if(email!=null && email!=""){
    auth.sendPasswordResetEmail(email).then(function() {
      alert("Email has been sent check inbox!");
    }).catch(function(error) {
      alert(error)
    });
  }
  else{
    alert("Enter email id");
  }
});

function getMobileNumber(){
  let detailsDatabase=db.collection('Doctor-Details');
  let query = detailsDatabase.where('Email','==',email).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        alert('Your Email is either incorrect or not registered');
                        document.getElementById("exampleInputEmail").value='';
                        return;
                    }
                    snapshot.forEach(doc => {
                        let s = doc.data();
                        console.log(s.MobileNumber);
                        mobilenumber=s.MobileNumber;
                });
                if (mobilenumber.toString().length==10){
                  console.log("in generation");
                  GenerateandSendOTP();
                }
                else{
                  alert("Try Again");
                }
            })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
                return true;
}


function GenerateandSendOTP(){
  var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                  if (this.readyState == 4 && this.status == 200) {
                    alert(this.responseText);
                  }
                };
        sentOTP = generateOTP();
        actualOTP=sentOTP;
        var str1 =
          "https://www.fast2sms.com/dev/bulk?authorization=zDJqkuvhyi6WagInFw09RXflYNjZx4LEcUmA1Vp8HPMSG7tTOrqEhW6kiMDRjwCYTzaILSOHtmBKVQyP&sender_id=FSTSMS&language=english&route=qt&numbers="+mobilenumber+"&message=24236&variables={AA}&variables_values=" +
          sentOTP;
        xhttp.open("GET", str1, true);
        xhttp.send();
}


 function sendOTP(){
  email = document.getElementById("exampleInputEmail").value;
  if(email=="" || email==null){
    alert("Enter email to send OTP to registered mobile number");
  }
  else{
     getMobileNumber(); //.then(function(err){
}
}


function generateOTP() {
  var digits = "0123456789";
  var otpLength = 5;
  var otp = "";
  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);
    otp = otp + digits[index];
  }
  return otp;
}


function validate() {
  var checkOTP = document.getElementById("inputOTP").value;
  if (checkOTP == actualOTP) {
    return true
  } else {
    return false;
  }
}





// Issues in loginForm.js:

// 1. Warning: Firebase is already defined in the global scope. Please make sure
// Firebase library is only loaded once