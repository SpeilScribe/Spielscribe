let doctorDatabase = db.collection(window.localStorage.getItem("uid"));
console.log(doctorDatabase);
var totalPatients = 0;
fetchTotalPatients();
var genderStats = {};
fetchGenderDetails();
var ageStats = {};
fetchAge();
var diseaseCount = {};
fetchDiseaseCount();
console.log(diseaseCount);

setTimeout(drawCharts, 3000);

function fetchDiseaseCount() {
  console.log("into disease count");
  doctorDatabase.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var disease = doc.data().Disease;
      if (disease!=null && disease!=undefined){
      if (!(disease in diseaseCount)) diseaseCount[disease] = 1;
      else diseaseCount[disease] += 1;
      }
    });
  });
}

function fetchTotalPatients() {
  let query1 = doctorDatabase
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      totalPatients = snapshot.size;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
}

function fetchGenderDetails() {
  genderStats = {};
  let query1 = doctorDatabase
    .where("Gender", "==", "male")
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      genderStats.malePatients = snapshot.size;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  let query2 = doctorDatabase
    .where("Gender", "==", "Female")
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      genderStats.femalePatients = snapshot.size;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  let query3 = doctorDatabase
    .where("Gender", "==", "other")
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      genderStats.otherPatients = snapshot.size;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  return genderStats;
}

function fetchAge() {
  ageStats = {};
  let query1 = doctorDatabase
    .where("Age", "<=", 5)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      ageStats.age5 = snapshot.size;
      console.log("AGE 5-", ageStats.age5);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  let query2 = doctorDatabase
    .where("Age", ">", 5)
    .where("Age", "<=", 15)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      ageStats.age15 = snapshot.size;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  let query3 = doctorDatabase
    .where("Age", ">", 15)
    .where("Age", "<=", 25)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      ageStats.age25 = snapshot.size;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  let query4 = doctorDatabase
    .where("Age", ">", 25)
    .where("Age", "<=", 35)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      ageStats.age35 = snapshot.size;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  let query5 = doctorDatabase
    .where("Age", ">", 35)
    .where("Age", "<=", 45)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      ageStats.age45 = snapshot.size;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  let query6 = doctorDatabase
    .where("Age", ">", 45)
    .where("Age", "<=", 55)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      ageStats.age55 = snapshot.size;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  let query7 = doctorDatabase
    .where("Age", ">", 55)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      ageStats.aboveAge55 = snapshot.size;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  return ageStats;
}

function drawCharts() {
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["male", "female", "other"],
      datasets: [
        {
          data: [
            genderStats.malePatients,
            genderStats.femalePatients,
            genderStats.otherPatients,
          ],
          backgroundColor: [
            "rgba(51, 51, 255, 0.8)",
            "rgba(255, 51, 51, 0.8)",
            "rgba(255, 204, 0, 0.8)",
          ],

          borderColor: [
            "rgba(51, 51, 255,1)",
            "rgba(255, 51, 51, 1)",
            "rgba(255, 204, 0, 0.2)",
          ],
          borderWidth: 1,
        },
      ],
    },
  });
  var ctx1 = document.getElementById("myChart1");
  var myChart1 = new Chart(ctx1, {
    type: "pie",
    data: {
      labels: ["0-5", "6-15", "16-25", "26-35", "36-45", "46-55", ">55"],
      datasets: [
        {
          data: [
            ageStats.age5,
            ageStats.age15,
            ageStats.age25,
            ageStats.age35,
            ageStats.age45,
            ageStats.age55,
          ],
          backgroundColor: [
            "rgba(204, 245, 255, 0.7)",
            "rgba(153, 235, 255, 0.7)",
            "rgba(102, 224, 255, 0.7)",
            "rgba(51, 214, 255, 0.7)",
            "rgba(0, 204, 255, 0.7)",
            "rgba(0, 163, 204, 0.7)",
            "rgba(0, 122, 153, 0.7)",
          ],

          borderColor: [
            "rgba(204, 245, 255,1)",
            "rgba(153, 235, 255, 1)",
            "rgba(102, 224, 255, 1)",
            "rgba(51, 214, 255, 1)",
            "rgba(0, 204, 255, 1)",
            "rgba(0, 163, 204, 1)",
            "rgba(0, 122, 153, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
  });
  var ctx2 = document.getElementById("myChart2");
  var color = [];
  function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  for (var i = 0; i < Object.keys(diseaseCount).length; i++) {
    color[i] = dynamicColors();
  }

  var myChart2 = new Chart(ctx2, {
    type: "pie",
    data: {
      labels: Object.keys(diseaseCount),
      datasets: [
        {
          data: Object.values(diseaseCount),
          backgroundColor: color,

          borderColor: color,
          borderWidth: 1,
        },
      ],
    },
  });
}