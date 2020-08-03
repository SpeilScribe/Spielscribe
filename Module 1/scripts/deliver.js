var newprescription;
var doctorDataToSend;
function FetchPatientDetails(){
    window.sessionStorage.removeItem('detailsToReuse');
    var dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth();
    var day = dateObj.getDate();
    newprescription={
        FirstName:document.getElementById("inputFirstName").value,
        LastName:document.getElementById("inputLastName").value,
        Gender:document.getElementById("inputGender").value,
        Age:parseInt(document.getElementById("inputAge").value),
        Symptoms:document.getElementById("inputSymptoms").value,
        Disease:document.getElementById("inputDiagnosis").value,
        Medicine:document.getElementById("inputPrescription").value,
        Advice:document.getElementById("inputAdvice").value,
        MobileNumber:parseInt(document.getElementById("inputMobileNumber").value),
        Email:document.getElementById("inputPatientEmail").value,
        DateOfVisit : day+"/"+month+"/"+year,
        Password:""+document.getElementById("inputFirstName").value.slice(0,2)+document.getElementById("inputLastName").value.slice(0,2)
        +document.getElementById("inputMobileNumber").value.slice(0,2)
    };
    console.log(newprescription);
    if(getuid()!=null){
        var docuid=getuid();
        db.collection(docuid).add(newprescription).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            newprescription.PrescriptionId=docRef.id;
            alert("Prescription Loaded Successfully with ID"+docRef.id);
            FetchDoctorDetails();
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            alert(error);
            window.location.href="dashboard.html";
        });
    }
    else{
        alert("You are not an signed in!! Goto Login and try again ");
    }
}

function FetchDoctorDetails(){
    isPermissionGranted=false;
    if(getuid()!=null){
        var doctoruid= getuid()  //'GnN3pRkQonefm7qCLXIbLMLEZfh2';
        let doctorDetails=db.collection('Doctor-Details').doc(doctoruid);
        console.log(doctorDetails);
        doctorDetails.get()
            .then(doc => {
                if (!doc.exists) {
                     console.log('No such document!');
                } else {
                    isPermissionGranted=true;
                    doctorDoc=doc.data();
                    console.log('Document data:',doc.data());
                    if(isPermissionGranted){
                        doctorDataToSend={
                            "Name": doctorDoc.FirstName + doctorDoc.LastName,
                            "HospitalName":doctorDoc.HospitalName,
                            "Email":doctorDoc.Email,
                            "MobileNumber":doctorDoc.MobileNumber,
                            "Postal":doctorDoc.PostalCode,
                            "SignatureURL":doctorDoc.SignatureUrl
                        }
                        PdfRequest();
                    }
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
            }
}

function PdfRequest(){
    console.log("here in pdfReqquets");
    jsonSend={
        "patientDetails":newprescription,
        "doctorDetails":doctorDataToSend
    }
    const pdfOptions={
        method:'POST',
        headers:{ 'Content-Type': 'application/json'},
        body:JSON.stringify(jsonSend)
    };
    fetch('http://localhost:3000/pdf',pdfOptions).then(response => {
    console.log(response.status);
    console.log(response.headers.get("Content-Type"));
    console.log(response);
    return response.json(); 
}).then(res => {
    console.log(res);
    alert(res.message);
});
}