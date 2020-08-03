var message = document.querySelector("#message");
var processDF = document.querySelector("#processDF");
var processDigiPres = document.querySelector("#processDigiPres");

var ansFromDF;
var prescriptionjson = {};
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var command = "";
var grammar = "#JSGF V1.0;";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = "en-US";
recognition.interimResults = true;
recognition.continuous = true;
let finalTranscript = "";
//if(window.sessionStorage.hasOwnProperty('detailsToReuse')){
if (window.sessionStorage.getItem("detailsToReuse") != null) {
  console.log("here in local storage");
  basicDetailsPatient = JSON.parse(
    window.sessionStorage.getItem("detailsToReuse")
  );
  console.log(basicDetailsPatient);
  finalTranscript =
    basicDetailsPatient.FirstName +
    " " +
    basicDetailsPatient.LastName +
    " " +
    basicDetailsPatient.Age +
    " year old " +
    basicDetailsPatient.Gender +
    " ";
  document.getElementById("docSpeechTextBox").value = finalTranscript;
  document.getElementById("inputPatientEmail").value =
    basicDetailsPatient.Email;
  document.getElementById("inputMobileNumber").value =
    basicDetailsPatient.MobileNumber;
  document.getElementById("inputPdfPassword").value =
    basicDetailsPatient.Password;
}

recognition.onresult = function (event) {
  // var last = event.results.length - 1;
  // command = event.results[last][0].transcript;
  // document.getElementById("docSpeechTextBox").value= command;
  let interimTranscript = "";
  for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
    let transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript;
    } else {
      interimTranscript += transcript;
    }
  }
  document.getElementById("docSpeechTextBox").value =
    finalTranscript + interimTranscript;
};

recognition.onspeechend = function () {
  document.getElementById("recordingGif").src = "images/recordToForm.gif";
  document.getElementById("docSpeechTextBox").readOnly = false;
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(
      "Please edit details if required and then Please Click on process button"
    )
  );
};

recognition.onerror = function (event) {
  finalTranscript = "";
  document.getElementById("docSpeechTextBox").value =
    "Error occurred in recognition";
};

document
  .querySelector("#btnGiveCommand")
  .addEventListener("click", function () {
    speechSynthesis.speak(
      new SpeechSynthesisUtterance("Your assistant is ready")
    );
    document.getElementById("docSpeechTextBox").readOnly = true;
    if (window.sessionStorage.getItem("detailsToReuse") != null) {
      console.log("here in local storage");
      basicDetailsPatient = JSON.parse(
        window.sessionStorage.getItem("detailsToReuse")
      );
      console.log(basicDetailsPatient);
      finalTranscript =
        basicDetailsPatient.FirstName +
        " " +
        basicDetailsPatient.LastName +
        " " +
        basicDetailsPatient.Age +
        " year old " +
        basicDetailsPatient.Gender +
        " ";
      document.getElementById("docSpeechTextBox").value = finalTranscript;
    } else {
      finalTranscript = "";
    }
    recognition.start();
  });

document
  .querySelector("#btnStopCommand")
  .addEventListener("click", function () {
    recognition.stop();
  });

document
  .querySelector("#btnClearCommand")
  .addEventListener("click", function () {
    document.getElementById("docSpeechTextBox").value = "";
  });

document
  .querySelector("#btnPauseCommand")
  .addEventListener("click", function () {
    document.getElementById("AppenddocSpeechTextBox").value +=
      " " + document.getElementById("docSpeechTextBox").value;
    document.getElementById("docSpeechTextBox").value = "";
  });

document
  .querySelector("#btnfetchCommand")
  .addEventListener("click", function () {
    speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        "fetching of recording in process please wait"
      )
    );
    isPermissionGranted = false;
    if (getuid() != null) {
      var doctoruid = getuid();
      let doctordatabse = db.collection(doctoruid).doc("initial");
      doctordatabse
        .get()
        .then((doc) => {
          if (!doc.exists) {
            alert("No such document!");
          } else {
            isPermissionGranted = true;
            document.getElementById(
              "docSpeechTextBox"
            ).value = doc.data().TextOtherPc;
            document.getElementById("docSpeechTextBox").readOnly = false;
            speechSynthesis.speak(
              new SpeechSynthesisUtterance(
                "Please edit details if required and then Please Click on process button"
              )
            );
          }
        })
        .catch((err) => {
          console.log("Error getting document", err);
        });
    }
  });

processDF.addEventListener("click", (e) => {
  // alert("please wait generating prescription");
  var appenddata = document.getElementById("AppenddocSpeechTextBox").value;
  speechSynthesis.speak(
    new SpeechSynthesisUtterance("Your prescription is being processed")
  );
  let tosendata = {
    message:
      appenddata + " " + document.getElementById("docSpeechTextBox").value,
  };
  console.log(tosendata);

  const dfRequestOption = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tosendata),
  };
  fetch("http://localhost:3000/prescription", dfRequestOption)
    .then((response) => {
      console.log(response.status);
      console.log(response.headers.get("Content-Type"));
      console.log(response);
      return response.json();
    })
    .then((res) => {
      console.log(res);
      ansFromDF = res;
      // alert("pdf generated click on form");
      speechSynthesis.speak(
        new SpeechSynthesisUtterance(
          "Your prescription is ready. Please click on Preview button"
        )
      );
    });
});

processDigiPres.addEventListener("click", (e) => {
  var tempSymptom = ansFromDF.symptoms.listValue.values;
  var tempPrescription = ansFromDF.medicine.listValue.values;
  var formSymptom = "";
    formPrescription = "";
  var tempduration = ansFromDF.duration.listValue.values;
  var temptimedays = ansFromDF.timesDay.listValue.values;

  var agearray = ansFromDF.age.stringValue.split(" ");
  var formFirstName = ansFromDF.firstname.stringValue;
  var formLastName = ansFromDF.lastname.stringValue;
  var formGender = ansFromDF.Gender.stringValue;
  var formAge = agearray[0];
  var formDiagnosis = ansFromDF.disease.stringValue.toUpperCase();
  console.log("FIRTSNAME: " + formFirstName);
  console.log("Lastname: " + formLastName);
  console.log("AGE: " + formAge);
  console.log("GENDER: " + formGender);
  console.log("DIAGNOSIS:" + formDiagnosis);
  document.getElementById("inputFirstName").value = formFirstName;
  document.getElementById("inputLastName").value = formLastName;
  document.getElementById("inputGender").value = formGender;
  document.getElementById("inputAge").value = formAge;
  document.getElementById("inputDiagnosis").value = formDiagnosis;

  tempSymptom.forEach((element) => {
    formSymptom = formSymptom + " " + element.stringValue + " , ";
  });
  document.getElementById("inputSymptoms").value = formSymptom;
  console.log("SYMTOMS" + formSymptom);

  temptimedaysArray = [];
  temptimedays.forEach((element) => {
    temptimedaysArray.push(element.stringValue);
  });
  console.log("DOSAGE TIME ARRAY::  " + temptimedaysArray);
  tempPrescriptionArray = [];
  tempPrescription.forEach((element) => {
    tempPrescriptionArray.push(element.stringValue.toUpperCase());
  });

  console.log("MEDICINE ARRAY::  " + tempPrescriptionArray);
  tempdurationArray = [];
  tempduration.forEach((element) => {
    tempdurationArray.push(element.structValue.fields.amount.numberValue);
  });
  console.log("MEDICINE DURATION ARRAY::  " + tempdurationArray);
  var i;
  for (i = 0; i < tempPrescriptionArray.length; i++) {
    formPrescription =
      formPrescription +
      "Medicine::  " +
      tempPrescriptionArray[i] +
      "     Duration::  " +
      temptimedaysArray[i] +
      "   Course Days ::  " +
      tempdurationArray[i].toString() +
      " days" +
      "\n";
    var now = tempPrescriptionArray[i];
    prescriptionjson[now] = {
      days: tempdurationArray[i],
      times: temptimedaysArray[i],
    };
  }
  // formPrescription=ansFromDF.medicine.stringValue;
  // formSymptom=ansFromDF.symptoms.stringValue;
  // var agearray=ansFromDF.age.stringValue.split(" ");
  // var formFirstName = ansFromDF.firstname.stringValue;
  // var formLastName = ansFromDF.lastname.stringValue;
  // var formGender = ansFromDF.Gender.stringValue;
  // var formAge = agearray[0];
  // var formDiagnosis = ansFromDF.disease.stringValue;
  // document.getElementById("inputFirstName").value = formFirstName;
  // document.getElementById("inputLastName").value = formLastName;
  // document.getElementById("inputGender").value = formGender;
  // document.getElementById("inputAge").value = formAge;
  // document.getElementById("inputDiagnosis").value = formDiagnosis;
  // document.getElementById("inputSymptoms").value = formSymptom;
  document.getElementById("inputPrescription").value = formPrescription;
  if (window.sessionStorage.getItem("detailsToReuse") != null) {
    console.log("here in local storage");
    basicDetailsPatient = JSON.parse(
      window.sessionStorage.getItem("detailsToReuse")
    );
    console.log(basicDetailsPatient);
    document.getElementById("inputPatientEmail").value =
      basicDetailsPatient.Email;
    document.getElementById("inputMobileNumber").value =
      basicDetailsPatient.MobileNumber;
  }
  $("#digiPresFrom :input").prop("readonly", true);
});

function EditDetails() {
  $("#digiPresFrom :input").prop("readonly", false);
  //annyang.start();
  document.getElementById("checkListen").style.visibility = "visible";
}

if (annyang) {
  console.log("here in annyang");
  var commands = {
    "edit medicine *tag": function (variable) {
    //   console.log(variable + "-------times");
    //   timesarray = variable.split("next");
    //   i = 0;
    //   finalprep = "";
    //   for (x in prescriptionjson) {
    //     prescriptionjson[x].times = timesarray[i];
    //     console.log(x);
    //     finalprep +=
    //       x +
    //       " for " +
    //       prescriptionjson[x].days.toString() +
    //       " days and " +
    //       timesarray[i] +
    //       " in a day" +
    //       "\n";
    //     i += 1;
    //   }
    console.log("here in medicine");
      document.getElementById("inputPrescription").value = variable
      .split(" ")
      .join(" ");
      //annyang.start();
    },
    "add medicine *tag": function (variable) {
          document.getElementById("inputPrescription").value +="\n" +variable
          .split(" ")
          .join(" ");
          //annyang.start();
        },
    "edit symptom *tag": function (variable) {
      console.log("here in symptom");
      document.getElementById("inputSymptoms").value = variable
        .split(" ")
        .join(" ");
      //annyang.start();
    },
    "add symptom *tag": function (variable) {
        console.log("here in symptom");
        document.getElementById("inputSymptoms").value +=" ," +variable
          .split(" ")
          .join(" ");
        //annyang.start();
      },
    "edit disease *tag": function (variable) {
      console.log("here in disease");
      document.getElementById("inputDiagnosis").value = variable
        .split(" ")
        .join(" ");
      //annyang.start();
    },
    "add disease *tag": function (variable) {
        console.log("here in disease");
        document.getElementById("inputDiagnosis").value +=" ," +variable
          .split(" ")
          .join(" ");
        //annyang.start();
      },
    "edit email *tag": function (variable) {
      console.log("here in email");
      document.getElementById("inputPatientEmail").value = variable
        .split(" ")
        .join(" ");
      //annyang.start();
    },
    "edit mobile *tag": function (variable) {
      document.getElementById("inputMobileNumber").value = variable;
      //annyang.start();
    },
    "edit advice *tag": function (variable) {
      document.getElementById("inputAdvice").value = variable;
    },
  };
  annyang.addCommands(commands);
  SpeechKITT.annyang({ autoRestart: true, continuous: false });
  annyang.debug();
  // Define a stylesheet for KITT to use
  SpeechKITT.setStylesheet(
    "//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/1.0.0/themes/flat.css"
  );
  //SpeechKITT.setRecognizedSentence()
  // Render KITT's interface
  SpeechKITT.vroom();
  // annyang.addCallback('result', function(userSaid, commandText, phrases) {
  //     console.log(userSaid); // sample output: 'hello'
  //     console.log(commandText); // sample output: 'hello (there)'
  //     console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
  //   });
}
