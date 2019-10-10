//Access to firebase
var config = {
apiKey: "AIzaSyA76LVKWgZ6VBsGonlNDoN_3tKX9SF-pIo",
authDomain: "happy-hour-a23a6.firebaseapp.com",
databaseURL: "https://happy-hour-a23a6.firebaseio.com",
projectId: "happy-hour-a23a6",
storageBucket: "",
messagingSenderId: "256506802274",
appId: "1:256506802274:web:c5cffbc411795dbad5613b",
measurementId: "G-FP7DSH1CGZ"
};
firebase.initializeApp(config);

//Set a variable to save data
var database = firebase.database();

var trainData = database.ref("/train");



//Once users click button, input information will be submitted
$("#submit-button").on("click",function(event){

    //Prevent inputs being automatically submitted
    event.preventDefault();

    //Retrive values from inputs
    var trainNameInput = $("#name-input").val().trim();
    var destinationInput = $("#destination-input").val().trim();
    var firstTrainTimeInput = $("#first-time-input").val().trim();
    var frequncyInput = $("#frequency-input").val().trim();

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");

    //Calculate time difference

    var timeConverter = moment(firstTrainTimeInput, "HH:mm").subtract(1, "days");

    console.log(timeConverter);

    var minuteDiff = moment().diff(timeConverter, "minutes");

    console.log("Minutes difference to first train: " + minuteDiff);

    var timeRemainder = minuteDiff % frequncyInput;

    // Minute until train
    var timeToNextTrain = frequncyInput - timeRemainder;

    console.log("How many minutes left before next train: " + timeToNextTrain);

    //Time of next train
    var nextTrainTimeInput = moment().add(timeToNextTrain, "minutes");

    //Push input values into an array
    var inputObject = {
        trainName: trainNameInput,
        destination: destinationInput,
        firstTrainTime: firstTrainTimeInput,
        frequncy: frequncyInput,
        nextTrainTime: moment(nextTrainTimeInput).format("HH:mm"),
        trainArrvingIn: timeToNextTrain
    }

    console.log(inputObject);

    //Push input array to Firebase
    trainData.push(inputObject);

})

//Show current time
function currnetTimeUpdate() {
    var currentTime = moment().format("HH:mm:ss");
    $("#time-diaply").text(currentTime);
}

//Update next train time and next train arriving at in data
function dataInstantUpdate () {

    $("#train-detail").html("");
    
    //Create Firbase event to update page in real-time when value change
    trainData.on("child_added", function(snapshot){
    
        console.log(snapshot.val());

        //Set variables to save values
        var trainName;
        var destination;
        var firstTrainTime;
        var frequncy;

        var newRow;

        trainName = snapshot.val().trainName;
        destination = snapshot.val().destination;
        firstTrainTime = snapshot.val().firstTrainTime;
        frequncy = snapshot.val().frequncy;
        nextTrainTime = snapshot.val().nextTrainTime;
        trainArrvingIn = snapshot.val().trainArrvingIn;

        console.log(trainName);
        console.log(destination);
        console.log(firstTrainTime);
        console.log(frequncy);
        console.log(nextTrainTime);
        console.log(trainArrvingIn)

        newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(firstTrainTime),
            $("<td>").text(frequncy + " mins"),
            $("<td>").text(nextTrainTime),
            $("<td>").text(trainArrvingIn + " mins"),
        );

        $("#train-detail").append(newRow);

    });

    //Calculate time remain and time to next train again
    var timeConverterInst = moment(firstTrainTime, "HH:mm").subtract(1, "days");

    var minuteDiffInst = moment().diff(timeConverterInst, "minutes");

    var timeRemainderInst = minuteDiffInst % frequncy;

    var timeToNextTrainInst = frequncy - timeRemainderInst;

    database.ref("/train").set({
        nextTrainTime: timeToNextTrainInst,
        trainArrvingIn: timeRemainderInst
    })
}

currnetTimeUpdate();
setInterval(currnetTimeUpdate, 1000);
setInterval(dataInstantUpdate, 1000);