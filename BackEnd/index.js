const express =require('express');
const app=express();
app.use(express.json());
const port = 3000
const dialogflow = require('dialogflow');
const uuid = require('uuid');
var dfReplyFields;
var nodemailer = require('nodemailer');

app.use(function (req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

async function runSample(msg,projectId = 'sihvoiceprescription-gesqru') {
  const sessionId = uuid.v4();

  const sessionClient = new dialogflow.SessionsClient({keyFilename:"SihVoicePrescription-572e73bcd59d.json"});
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: msg,
        languageCode: 'en-US',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  dfReplyFields=result.parameters.fields;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

app.post('/api',(req,res)=>{
console.log("in api");
res.send("hello api");
});

app.post('/prescription',(req,res)=>{
    runSample(req.body.message);
    sleep(5000).then(() => {
    res.send(JSON.stringify(dfReplyFields));
    }).catch((error) => {
      console.log(error);
    });
});


app.post('/pdf',(request,response)=>{
    console.log("here in server pdf");
    patientDetails=request.body.patientDetails;
    doctorDetails=request.body.doctorDetails;
    console.log(patientDetails);
    console.log(doctorDetails);
    x=generatePdf(patientDetails,doctorDetails);
    console.log("xxxxxxxxxxxxxxxxxxxx",x);
    sleep(5000).then(() => {
      if(x==-1){
        toSend={message:"EMAIL NOT PROVIDED"}
      }
      else{
        toSend={message:"EMAIL SENT"}
        console.log(toSend);
      }
      response.send(JSON.stringify(toSend));
      }).catch((error) => {
        console.log(error);
      });
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`))



function sendEmail(Email){
    var transporter = nodemailer.createTransport({
      host : 'smtp.gmail.com',
      port: 465,
      ignoreTLS: true,
    secure:  true,
        service: 'gmail',
        auth: {
          user: 'sihcodegeeks@gmail.com',
          pass: 'sihcodegeeks19'
        }
      });
      
      var mailOptions = {
        from: 'sihcodegeeks@gmail.com',
        to: Email,
        subject: 'Prescription',
        text: `Below is the attachment of the prescription which is password protected and will open with the password you gave during appointment.
        If in case you are not able to open it contact the doctor.`,
        attachments: [
          { filename :'document.pdf', path :'document.pdf'} 
        ]
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return error.toString();
        } else {
          console.log('Email sent: ' + info.response);
          data='Email sent: ' + info.response
          console.log("DAAAAAAAAATAAAAAA",data.toString());
          return data.toString();
        }
      });
      sleep(4000);
}


function generatePdf(patientDetails,doctorDetails){
  global.PNG = require("png-js");
  global.window = {
    document: {
      createElementNS: () => {
        return {};
      },
    },
  };
  global.navigator = {};
  global.html2pdf = {};
  global.atob = require("atob");
  global.btoa = () => {};
  var request = require("request");

  ("use strict");
  const fs = require("fs");

  let buff = fs.readFileSync("logo.png");
  let Logo = buff.toString("base64");

  let Signature = doctorDetails.SignatureURL;

  var jsPDF = require("jspdf");

  var doc = new jsPDF();
  var imgData = Logo;
  var signData = Signature;

  const pname = patientDetails.FirstName + " " + patientDetails.LastName;
  const age = patientDetails.Age.toString();
  const gen = patientDetails.Gender;
  const date = patientDetails.DateOfVisit;

  const advise = patientDetails.Advice;
  const med = patientDetails.Medicine;
  const diag = patientDetails.Disease;
  const sympt = patientDetails.Symptoms;
  const mobilenum = patientDetails.MobileNumber;
  const dname = doctorDetails.Name;
  const hname = doctorDetails.HospitalName;
  const pid = patientDetails.PrescriptionId;

  doc.line(8, 40, 205, 40, "S");
  doc.line(8, 40, 8, 60, "S");
  doc.line(8, 60, 205, 60, "S");
  doc.line(205, 60, 205, 40, "S");
  doc.setFont("times");
  doc.setFontType("normal");
  doc.setFontSize(13);
  doc.text(12, 47, "Patient's Name : " + pname);

  doc.line(105, 40, 105, 50, "FD");
  doc.text(110, 47, "Prescription Id : " + pid);
  doc.line(8, 50, 205, 50, "FD");
  doc.setFontSize(24);
  doc.text(82, 8, hname+" Hospital");
  doc.setFont("times");
  doc.setFontType("normal");
  doc.setFontSize(12);
  doc.text(8, 20, "Dr. " + dname);
  doc.setFontSize(10);
  doc.text(8, 25, "2/03,"+hname);
  doc.text(8, 30, "Vardaman Nagar");
  doc.text(8, 35, "Nagpur-" + doctorDetails.Postal.toString());
  doc.text(170, 30, "Date:" + date);
  doc.text(170, 35, "PH (91)+" + mobilenum.toString());
  doc.addImage(Logo, "JPEG", 72, 0, 10, 10, 0);
  doc.setFont("times");
  doc.setFontType("normal");
  doc.setFontSize(13);
  doc.text(12, 57, "Age : " + age);
  doc.text(110, 57, "Gender : " + gen);
  doc.line(105, 50, 105, 60, "FD");
  doc.line(8, 60, 205, 60, "S");
  doc.line(8, 62, 205, 62, "S");
  doc.line(8, 62, 8, 290, "S");
  doc.line(8, 290, 205, 290, "S");
  doc.line(205, 290, 205, 62, "S");
  doc.setFontType("bold");
  doc.setFontSize(19);
  doc.text(80, 70, "PRESCRIPTION");
  doc.line(8, 74, 205, 73, "S");
  doc.setFontType("normal");
  doc.setFontSize(13);
  doc.text(12, 80, "Diagnosis-------");
  doc.text(12, 85, diag);
  doc.line(8, 110, 205, 110, "S");
  doc.text(12, 116, "Symptoms-------");
  doc.text(12, 121, sympt);
  doc.line(8, 156, 205, 156, "S");
  doc.text(12, 161, "Medicines-------");
  doc.text(12, 166, med);
  doc.line(8, 201, 205, 201, "S");
  doc.text(12, 206, "Advice-------");
  doc.text(12, 211, advise);
  doc.line(8, 246, 205, 246, "S");

  //Signature
  doc.addImage(Signature, "JPG", 145, 250, 40, 30, "sign");
  doc.line(135, 280, 195, 280, "S");
  doc.text(155, 285, "Signature");
  var data = doc.output();

  fs.writeFileSync("./document.pdf", data, "binary");

  delete global.window;
  delete global.html2pdf;
  delete global.navigator;
  delete global.btoa;

  const {
    PDFNet,
  } = require("C:\\Users\\RV\\OneDrive\\Desktop\\Raghav\\SEM-VI\\SIHbackend\\node_modules\\@pdftron\\pdfnet-node\\lib\\pdfnet.js");
  ((exports) => {
    exports.runEncTest = () => {
      const main = async () => {
        console.log("Beginning Test");
        let ret = 0;
        const inputUrl = "./";
        let doc = null;
        try {
          let islocked = false;
          doc = await PDFNet.PDFDoc.createFromFilePath(
            inputUrl + "document.pdf"
          );
          doc.initSecurityHandler();
          islocked = true;
          const performOperation = true;

          const newHandler = await PDFNet.SecurityHandler.createDefault();

          newHandler.changeUserPasswordUString(patientDetails.Password);
          // Set Permissions
          newHandler.setPermission(
            PDFNet.SecurityHandler.Permission.e_print,
            false
          );
          newHandler.setPermission(
            PDFNet.SecurityHandler.Permission.e_extract_content,
            true
          );
          // Note: document takes the ownership of newHandler.
          doc.setSecurityHandler(newHandler);
          await doc.save(
            "./document.pdf",
            PDFNet.SDFDoc.SaveOptions.e_linearized
          );
        } catch (err) {
          console.log(err);
          console.log(err.stack);
          ret = 1;
        }
        return ret;
      };

      PDFNet.runWithCleanup(main)
        .catch(function (error) {
          console.log("Error: " + JSON.stringify(error));
        })
        .then(function () {
          PDFNet.shutdown();
        });
    };
    exports.runEncTest();
  })(exports);
    
  if(patientDetails.Email!=null && patientDetails.Email!=""){
      collect=sendEmail(patientDetails.Email);
      console.log("aaaaaaaaaaaaaaaa",collect)
      return collect;
  }
  else{
    return -1;
  }
  }