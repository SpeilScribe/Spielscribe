var isFname=false;
var isGender=false;
var isDisease=false;
var isLname=false;
var isAge=false;
filterobject={};

function searchRecord(){
    if($('#filterResult tr').length!=0) {
    var emptyTable=document.getElementById("filterResult");
    for(var i = $('#filterResult tr').length - 1; i >= 0; i--)
    {
        
        emptyTable.deleteRow(i);
    }
    }
    if($('#filterFirstName').val()!="" && $('#filterFirstName')!=null){
        isFname=true;
        filterobject.FirstName=$('#filterFirstName').val();
    }
    else{
        isFname=false;
    }
    if($('#filterDiagnosis').val()!="" && $('#filterDiagnosis')!=null){
        isDisease=true;
        filterobject.Disease=$('#filterDiagnosis').val();
    }
    else{
        isDisease=false;
    }
    if($('#filterLastName').val()!="" && $('#filterLastName')!=null){
        isLname=true;
        filterobject.LastName=$('#filterLastName').val();
    }
    else{
        isLname=false;
    }
    if($('#filterAge').val()!="" && $('#filterAge')!=null){
        isAge=true;
        filterobject.Age=$('#filterAge').val();
    }
    else{
        isAge=false;
    }
    if($('#filterGender').val()!="ALL"){
        isGender=true;
        filterobject.Gender=$('#filterGender').val();
    }
    else{
        isGender=false;
    }
    console.log(filterobject);
    isPermissionGranted=false;
    if(getuid()!=null){
        var doctoruid= getuid()
        let doctordatabase=db.collection(doctoruid);
        console.log(doctordatabase);
        let query = doctordatabase.get()
            .then(snapshot => {
                isPermissionGranted=true;
                applyfilter(doctordatabase);
                if (snapshot.empty) {
                    alert('NO Prescriptions');
                    return;
                }
            })
            .catch(err => {
                alert(err);
                window.location.href="dashboard.html";
            });
    }
}


$('.table tbody').on('click','.btn',function(){
    var currentRow=$(this).closest('tr');
    basicPatientDetails={
    FirstName:currentRow.find('td:eq(1)').text(),
    LastName:currentRow.find('td:eq(2)').text(),
    Age:currentRow.find('td:eq(3)').text(),
    Gender:currentRow.find('td:eq(4)').text(),
    Email:currentRow.find('td:eq(5)').text(),
    MobileNumber:currentRow.find('td:eq(6)').text(),
    }
    console.log(basicPatientDetails);
    window.sessionStorage.setItem('detailsToReuse',JSON.stringify(basicPatientDetails));
    window.location.href="prescription.html";
})



function applyfilter(doctordatabase){
    if (!isFname && !isAge && !isDisease && !isLname && !isGender) {

        let query = doctordatabase.get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return;
                }
                var i=0;
                snapshot.forEach(doc => {
                    i=i+1;
                    let s = doc.data();
                    $('#filterResult').append(`
                    <tr>
                    <td>${i}</td>
                    <td>${s.FirstName}</td>
                    <td>${s.LastName}</td>
                    <td>${s.Age}</td>
                    <td>${s.Gender}</td>
                    <td>${s.Email}</td>
                    <td>${s.MobileNumber}</td>
                    <td>${s.Symptoms}</td>
                    <td>${s.Disease}</td>
                    <td>${s.Medicine}</td>
                    <td>${s.DateOfVisit}</td>
                    <td><button href="" class="btn new-btn-d br-2" id="update" style="color: black; font-weight: bolder;">UPDATE</button></td>
                    <tr>
                `)
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }
    
    //name
    if(isFname && !isAge && !isDisease && !isLname && !isGender){
    let query = doctordatabase.where('FirstName', '==', filterobject['FirstName']).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('No matching documents.');
                        return;
                    }
                    var i=0;
                snapshot.forEach(doc => {
                    i=i+1;
                    let s = doc.data();
                    $('#filterResult').append(`
                    <tr>
                    <td>${i}</td>
                    <td>${s.FirstName}</td>
                    <td>${s.LastName}</td>
                    <td>${s.Age}</td>
                    <td>${s.Gender}</td>
                    <td>${s.Email}</td>
                    <td>${s.MobileNumber}</td>
                    <td>${s.Symptoms}</td>
                    <td>${s.Disease}</td>
                    <td>${s.Medicine}</td>
                    <td>${s.DateOfVisit}</td>
                    <td><button href="" class="btn new-btn-d br-2" id="update" style="color: black; font-weight: bolder;">UPDATE</button></td>
                    <tr>
                `)
                });
            })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
    }
    
    //disease
    if(!isFname && !isAge && isDisease && !isLname && !isGender){
        console.log("here");
    let query = doctordatabase.where('Disease', '==', filterobject['Disease']).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('No matching documents.');
                        return;
                    }
                    var i=0;
                snapshot.forEach(doc => {
                    i=i+1;
                    let s = doc.data();
                    $('#filterResult').append(`
                    <tr>
                    <td>${i}</td>
                    <td>${s.FirstName}</td>
                    <td>${s.LastName}</td>
                    <td>${s.Age}</td>
                    <td>${s.Gender}</td>
                    <td>${s.Email}</td>
                    <td>${s.MobileNumber}</td>
                    <td>${s.Symptoms}</td>
                    <td>${s.Disease}</td>
                    <td>${s.Medicine}</td>
                    <td>${s.DateOfVisit}</td>
                    <td><button href="" class="btn new-btn-d br-2" id="update" style="color: black; font-weight: bolder;">UPDATE</button></td>
                    <tr>
                `)
                });
            })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
    }
    
    //medicine
    if(!isFname && !isAge && !isDisease && isLname && !isGender){
        console.log("here");
    let query = doctordatabase.where('LastName', '==', filterobject['LastName']).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('No matching documents.');
                        return;
                    }
                    var i=0;
                snapshot.forEach(doc => {
                    i=i+1;
                    let s = doc.data();
                    $('#filterResult').append(`
                    <tr>
                    <td>${i}</td>
                    <td>${s.FirstName}</td>
                    <td>${s.LastName}</td>
                    <td>${s.Age}</td>
                    <td>${s.Gender}</td>
                    <td>${s.Email}</td>
                    <td>${s.MobileNumber}</td>
                    <td>${s.Symptoms}</td>
                    <td>${s.Disease}</td>
                    <td>${s.Medicine}</td>
                    <td>${s.DateOfVisit}</td>
                    <td><button href="" class="btn new-btn-d br-2" id="update" style="color: black; font-weight: bolder;">UPDATE</button></td>
                    <tr>
                `)
                });
            })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
    }
    
    //age
    if(!isFname && isAge && !isDisease && !isLname && !isGender){
        console.log("here in age");
    let query = doctordatabase.where('Age', '<=', parseInt(filterobject['Age'])).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('No matching documents.');
                        return;
                    }
                    var i=0;
                snapshot.forEach(doc => {
                    i=i+1;
                    let s = doc.data();
                    $('#filterResult').append(`
                    <tr>
                    <td>${i}</td>
                    <td>${s.FirstName}</td>
                    <td>${s.LastName}</td>
                    <td>${s.Age}</td>
                    <td>${s.Gender}</td>
                    <td>${s.Email}</td>
                    <td>${s.MobileNumber}</td>
                    <td>${s.Symptoms}</td>
                    <td>${s.Disease}</td>
                    <td>${s.Medicine}</td>
                    <td>${s.DateOfVisit}</td>
                    <td><button href="" class="btn new-btn-d br-2" id="update" style="color: black; font-weight: bolder;">UPDATE</button></td>
                    <tr>
                `)
                });
            })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
    }
    
    //gender
    if(!isFname && !isAge && !isDisease && !isLname && isGender){
        console.log("here in gender");
    let query = doctordatabase.where('Gender', '==', filterobject['Gender']).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('No matching documents.');
                        return;
                    }
                    var i=0;
                snapshot.forEach(doc => {
                    i=i+1;
                    let s = doc.data();
                    $('#filterResult').append(`
                    <tr>
                    <td>${i}</td>
                    <td>${s.FirstName}</td>
                    <td>${s.LastName}</td>
                    <td>${s.Age}</td>
                    <td>${s.Gender}</td>
                    <td>${s.Email}</td>
                    <td>${s.MobileNumber}</td>
                    <td>${s.Symptoms}</td>
                    <td>${s.Disease}</td>
                    <td>${s.Medicine}</td>
                    <td>${s.DateOfVisit}</td>
                    <td><button href="" class="btn new-btn-d br-2" id="update" style="color: black; font-weight: bolder;">UPDATE</button></td>
                    <tr>
                `)
                });
            })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
    }
    
    if(isFname && !isAge && isDisease && !isLname && !isGender){
    let query = doctordatabase.where('FirstName', '==', filterobject['FirstName']).where('Disease', '==', filterobject['Disease']).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('No matching documents.');
                        return;
                    }
                    var i=0;
                snapshot.forEach(doc => {
                    i=i+1;
                    let s = doc.data();
                    $('#filterResult').append(`
                    <tr>
                    <td>${i}</td>
                    <td>${s.FirstName}</td>
                    <td>${s.LastName}</td>
                    <td>${s.Age}</td>
                    <td>${s.Gender}</td>
                    <td>${s.Email}</td>
                    <td>${s.MobileNumber}</td>
                    <td>${s.Symptoms}</td>
                    <td>${s.Disease}</td>
                    <td>${s.Medicine}</td>
                    <td>${s.DateOfVisit}</td>
                    <td><button href="" class="btn new-btn-d br-2" id="update" style="color: black; font-weight: bolder;">UPDATE</button></td>
                    <tr>
                `)
                });
            })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
    }
    
    if(isFname && !isAge && !isDisease && isLname && !isGender){
        let query = doctordatabase.where('FirstName', '==', filterobject['FirstName']).where('LastName', '==', filterobject['LastName']).get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                            console.log('No matching documents.');
                            return;
                        }
                        var i=0;
                        snapshot.forEach(doc => {
                            i=i+1;
                            let s = doc.data();
                            $('#filterResult').append(`
                            <tr>
                            <td>${i}</td>
                            <td>${s.FirstName}</td>
                            <td>${s.LastName}</td>
                            <td>${s.Age}</td>
                            <td>${s.Gender}</td>
                            <td>${s.Email}</td>
                            <td>${s.MobileNumber}</td>
                            <td>${s.Symptoms}</td>
                            <td>${s.Disease}</td>
                            <td>${s.Medicine}</td>
                    <td>${s.DateOfVisit}</td>
                            <td><button href="" class="btn new-btn-d br-2" id="update" style="color: black; font-weight: bolder;">UPDATE</button></td>
                            <tr>
                        `)
                        });
                })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
        }
    
    
        if(isFname && !isAge && !isDisease && !isLname && isGender){
            let query = doctordatabase.where('FirstName', '==', filterobject['FirstName']).where('Gender', '==', filterobject['Gender']).get()
                        .then(snapshot => {
                            if (snapshot.empty) {
                                console.log('No matching documents.');
                                return;
                            }
                            var i=0;
                            snapshot.forEach(doc => {
                                i=i+1;
                                let s = doc.data();
                                $('#filterResult').append(`
                                <tr>
                                <td>${i}</td>
                                <td>${s.FirstName}</td>
                                <td>${s.LastName}</td>
                                <td>${s.Age}</td>
                                <td>${s.Gender}</td>
                                <td>${s.Email}</td>
                                <td>${s.MobileNumber}</td>
                                <td>${s.Symptoms}</td>
                                <td>${s.Disease}</td>
                                <td>${s.Medicine}</td>
                    <td>${s.DateOfVisit}</td>
                                <td><button href="" class="btn new-btn-d br-2" id="update" style="color: black; font-weight: bolder;">UPDATE</button></td>
                                <tr>
                            `)
                            });
                    })
                        .catch(err => {
                            console.log('Error getting documents', err);
                        });
            }
    
    
            if(isFname && isAge && !isDisease && !isLname && !isGender){
                let query = doctordatabase.where('FirstName', '==', filterobject['FirstName']).where('Age', '<=', parseInt(filterobject['Age'])).get()
                            .then(snapshot => {
                                if (snapshot.empty) {
                                    console.log('No matching documents.');
                                    return;
                                }
                                var i=0;
                                snapshot.forEach(doc => {
                                    i=i+1;
                                    let s = doc.data();
                                    $('#filterResult').append(`
                                    <tr>
                                    <td>${i}</td>
                                    <td>${s.FirstName}</td>
                                    <td>${s.LastName}</td>
                                    <td>${s.Age}</td>
                                    <td>${s.Gender}</td>
                                    <td>${s.Email}</td>
                                    <td>${s.MobileNumber}</td>
                                    <td>${s.Symptoms}</td>
                                    <td>${s.Disease}</td>
                                    <td>${s.Medicine}</td>
                                    <td>${s.DateOfVisit}</td>
                                    <td><button href="" class="btn new-btn-d br-2" id="update" style="color: black; font-weight: bolder;">UPDATE</button></td>
                                    <tr>
                                `)
                                });
                        })
                            .catch(err => {
                                console.log('Error getting documents', err);
                            });
                }    
}