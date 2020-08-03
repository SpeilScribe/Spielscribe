var firstName;
var LastName;
var email;
var zip;
var hospitalName;
var imageDataUrl;
var specialization;
var degree;
var doctoruid;
var details;
$("#logout").css('visibility', 'hidden');
const reader = new FileReader();
const signupForm = document.querySelector('#registerationForm');

function gotoauthentication(){
  var password=document.getElementById("inputPassword").value;
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    doctoruid=cred.user.uid;
  }).then(() => {
    updateData();   
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage)
  });
}

function updateData(){
  db.collection('Doctor-Details').doc(doctoruid).set(details).then(()=>{
    sleep(2000).then(() => { 
    alert("Sign up succesfull");
    var successId = document.getElementById("imgBesideForm");
    successId.src="images/doneSignUp.jpg";
    signupForm.reset();
    window.location.href="dashboard.html";
    });
  }).catch((error)=> {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage)
  });
}



signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    firstName=document.getElementById("inputFirstName").value;
    console.log(firstName);
    LastName=document.getElementById("inputLastName").value;
    email=document.getElementById("inputEmail").value;
    zip=parseInt(document.getElementById("inputZip").value);
    specialization=document.getElementById("inputSpecialization").value;
    degree=document.getElementById("inputDegree").value;
    hospitalName=document.getElementById("inputHospName").value;
    mobilenumber=document.getElementById("inputMobileNumber").value;
    console.log(firstName);
    details={
      FirstName:firstName,
      LastName:LastName,
      Email:email,
      HospitalName:hospitalName,
      PostalCode:zip,
      Specialization:specialization,
      Degree:degree,
      SignatureUrl:imageDataUrl,
      MobileNumber:mobilenumber
    }
    gotoauthentication();
});


function checkFile(){
    const file = document.querySelector('input[type=file]').files[0];
    var filename=file.name;
    if(filename == ''){
      alert("Please select file");
    }
    else{
      var extension =filename.substring(filename.lastIndexOf('.')+1).toLowerCase();
      if(extension=="jpg" || extension=="png" || extension=="bmp"){
       // console.log(file.width);
       console.log(file.size);
       if(file.size>10000 && file.size<30000){
        previewFile(file)
       }
       else{
        document.getElementById("inputSignature").value='';
         alert("File size exceded");
         
       }
      }
      else{
        document.getElementById("inputSignature").value='';
        alert("please insert an image");
      }
    }
  }
  
  
  function previewFile(file) {
    const preview = document.getElementById("signaturePreview")
    reader.addEventListener("load", function () {
      // convert image file to base64 string
      var checkImage=new Image();
      var imgwidth = 0;
      var imgheight = 0;
      var maxwidth = 300;
      var maxheight = 80;
      checkImage.src=reader.result;
      checkImage.onload=function(){
        imgwidth=this.width;
        console.log("onload",imgwidth)
        imgheight=this.height;
       if(imgwidth <=500 && imgheight<=150){
        console.log(imgwidth,"height",imgheight);
        //console.log(this);
        preview.src = reader.result;
          //console.log(reader.result);
     // $('#result').val(reader.result);
     imageDataUrl=reader.result;
      }
      else{
        document.getElementById("inputSignature").value='';
        alert("check dimensions");
      }
      }
    },false);
    if (file) {
      reader.readAsDataURL(file);
    }
  }

//issue:
// due to sleep onstatefunction of auth.js is called and it gives error because nav-bar is missing so we included
//nav-bar email and it is hidden;










