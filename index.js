var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var name = "";

var newline = "\n";

var output = "";

var alexa;

var flavor = "";

var cone = "";

var toppings = "";

var item = [ ];

var scoops = "";

var APIKey = "4844d21f760b47359945751b9f875877";
//Echo dot dippin dot.. application made by Jennifer Guidotti, Cole Christenson, Cecil Hutchings, Nate Terry, and John Williams. 
var  welcomeMessage = "You can say, build an ice cream cone or say, your name to sign into your user account at any time. .";
// Waffle
var welcomeRepromt  =  ", You can say, build an icecream cone, state your name to sign in to your user account, who wrote this app, or say help. What will it be?";

var applicationOverview = "Echo dot dippin dot.. application made by Jennifer Guidotti, Cole Christenson, Cecil Hutchings, Nate Terry, and John Williams.";

var HelpMessage = "You can say, build an icecream cone,state your name to sign in to your user account, or say help. what would you like to do?";

var moreInformation = "See your  Alexa app for  more  information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "There was an error finding this attraction, " + tryAgainMessage;

var goodbyeMessage = "OK, have a nice day.";// needed to end the requests 

var getMoreInfoRepromtMessage = "....";

var coneBool = 0;



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

var app = express();
var path = require('path');
var http = require("http");
var util = require("util");
var mongoose = require('mongoose');


var request = require("request") //the needed npm library




// var options = {
//   db: { native_parser: true },
//   server: { poolSize: 5 },
//   replset: { rs_name: 'myReplicaSetName' },
//   user: 'terryn',
//   ass: 'Pick6eral4456Ml'
// }
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
//options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1000};//1000//30seconds =30000ms
mongoose.connect('mongodb://terryn:Pick6eral4456Ml@ds155150.mlab.com:55150/icecream', options);





//I'm not sure should I have a keep alive option as suggested in mongoose docs:
// var options = {
//   db: { native_parser: true },
//   server: { poolSize: 5 },
//   replset: { rs_name: 'myReplicaSetName' },
//   user: 'terryn',
//   ass: 'Pick6eral4456Ml'
// }
// options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1000 };
// mongoose.connect('mongodb://terryn:Pick6eral4456Ml@ds155150.mlab.com:55150/icecream', options);


 ///////////////////////////////////////////////////////////////////////
// var iceCream_Schema = mongoose.Schema({
//     brand: String,
//     flavor: String,
//     caloriesPerScoop: 0,

//     cone: String,
//     numOfScoops: 0,
//     toppings: [ String ],

//     created_at: String,
//     updated_at: String,
//});
// This is the schema for the user in the mlab database.
// The unique token will be called by the inherent ID
// I cannot push a new object into the stepsPerDay List
var user_Schema = mongoose.Schema({
    username: String,
    stepsPerDay: [{day: String, totalDaySteps: 0}],
    totalSteps: 0,
    iceCreamConeID: String,

    fitBitToken: String,
    fitBitID: String,

    updated_at: String,
});
var user = mongoose.model('users', user_Schema);

//var iceCream = mongoose.model('iceCreams', iceCream_Schema);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var topFiveIntro = "Here are the top five things to  do in " + location + ".";


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// var option = {
//     url: "https://api.fitbit.com/1/user/-/activities/" + date + ".json",  //date is YYYY-MM-DD
//     headers: {"Authorization": token}
// }

// function callback(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var info = JSON.parse(body);
//         console.log(info)
//   }
// }

// info_ = request(option, callback)


// function getCurrentDate(){
//     var months_json = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06",
//                        "Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"}
//     var date = Date()
//     date = String(date)
//     var month = date.substring(4,7)
//     var day = date.substring(8,10)
//     var year = date.substring(11,15)

//     month = months_json[month]

//     date = year+'-'+month+'-'+day
//     console.log(date)
//     return date
// }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



var newSessionHandlers = {
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {                    // the end of the session that we need to invoke
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {                              //the nice error message that we must have
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    ///////////
    'LaunchRequest': function () {                          // AT THE BEGINNING OF THE REQUEST WE ARE STARTING HERE
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;////////////////////////////////////////////////////////////////////////////////////
        name.length = 0;
        name = "";
        coneBool = 0;
        flavor = "";
        cone = "";
        toppings = "";
        item = [ ];
        scoops = ""
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {//---------------------statehandler
    'signInIntent': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        name = this.event.request.intent.slots.username.value;

        

            output ="Welcome to the Ice Cream ordering application, ";

            if (name)
            output+= name;
            output+=". would you like to build a cone ?.";

            if (name)
            {
            output+=" or look up your current health statistics"//////////////////////////////////////////////////////////////////
            output+=". Say build a cone, or say Stats."
            }
            output +=", what type of Icecream would you like??,";
            
           //output += Object.keys(this.event.request.intent.slots.username.value);
        this.emit(':ask', output, welcomeRepromt);

        // make a slot type for icecream flavor
            //MOVE TO NEXT INTENT AFTER THE ASK 
    },
    
    'IcecreamIntent': function () {
        this.handler.state = states.SEARCHMODE;

      


        output = "What flavor of icecream would you like. "
        //item.empty();//------------------------------------------------------------------------->empty out the flavors
        item.length = 0;

// output += " There is :vanilla, chocolate, strawberry, neapolitan, Coconut, Banana, Chocolate Chip, Blueberry, rocky road and americone dream";


        this.emit(':ask', output);


    },

    'FlavorIntent': function () {

        flavor = this.event.request.intent.slots.flavor.value;


        this.handler.state = states.SEARCHMODE;
        output = "You have choosen ";
        output += flavor;
        output += ", Icecream. how many scoops would you like?.";//What type of cone would you like? , there are waffle cones, sugar cones, and cups
        this.emit(':ask', output);
        
    },

        'ScoopsIntent': function () {
         coneBool = 0;

        scoops = this.event.request.intent.slots.numberof.value;

        this.handler.state = states.SEARCHMODE;
        output = "You have choosen to have ";
        if (scoops!= undefined)
        {
             coneBool = 1;
        output += scoops ;
        output += ", scoops on your cone. ";
        output += "What type of toppings would you like? you can say plain. for no topping, or name the topping";//What type of cone would you like? , there are waffle cones, sugar cones, and cups.
        }


        //output += summation(output);

        // we need to loop back to the menu or to the fit bit here
        this.emit(':ask', output);
    },

    'ToppingsIntent': function () {
        coneBool = 0;
        toppings = this.event.request.intent.slots.topping.value;//;

        if (toppings == "none"||toppings == "no topping"||toppings == "plain")
            {
                 coneBool = 1;
                    //topping = "plain";
                    item.length = 0;
                    item.push(toppings);
                    output = "You have chosen to have plain ice cream with no toppings. What type of cone would you like? , there are waffle cones, sugar cones, and cups.? ";
            }
        else 
        {
            item.push(toppings);
             coneBool = 1;
            this.handler.state = states.SEARCHMODE;
            output = "You have chosen ";

            for (var i = 0; i < item.length; i++) {
                
                 if (i != 0 &&i == item.length - 1)
                {output += ", and ";}
                else
                {output += ", ";}   


                output += item[i];
                
                        }

           // output += toppings ;//output += toppings ;
           if (item.length <2)
            output += ", toppings";
            else 
                {output += ", toppings";}

             output +="on your cone.. if you would like another topping say the topping name..... OR say What type of cone you would like? ";//, there are waffle cones, sugar cones, and cups.?";
       //     another = true;
        }       


        


        this.emit(':ask', output);

    },

    'ConeIntent': function () {
 coneBool = 0;

        cone = this.event.request.intent.slots.cone.value;


        this.handler.state = states.SEARCHMODE;
    

        output = "You have choosen to have a ";

        output += cone;

        if (cone == "waffle"||cone == "sugar")
        {output += ", cone. "
         coneBool = 1;}
        else
         {output += ", of Icecream.";
     coneBool = 1;}
    



if (name != "")
{
if (name != undefined)
  {
       output += name;
  }
       output += "So far your cone is a ";
       if (cone != undefined)
       {
      output += cone;
       if (cone == "waffle"||cone == "sugar")
            {output += ", cone with "}
        else
            {output += ", of Icecream with ";}
        }
        else {
            output += "cup of Ice cream with ";
        }

        if (scoops != undefined){
      output += scoops ;
      output += " scoops of ";
      }

        if(flavor != undefined)
        output += flavor;
      output +="Ice cream, with ";

              if (toppings == "plain"||toppings == undefined)
            {
                output += "no toppings";                  

            }
else {

        for (var i = 0; i < item.length; i++) {
             if (i != 0 &&i == item.length - 1)
            {output += ", and ";}
            else
            {output += ", ";}   
            output += item[i]
            output += ". ";        
                    }
    
   }


                    var signingIN = ""
                    if (name == undefined)
                    {
                        signingIN +=" Please say your name to sign in ...";

                    }
                    else 
                    {
                        signingIN += name;
                        signingIN +=  " , you are too fat to eat this cone. please take a walk....";                          


                    }
}
else 
{
    output+= ". Please sign in to an account to claim this cone.."

}





//var user = mongoose.model('users', user_Schema);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// var alexa1 = this;



//     user.find({username: "John"}, function(err, users) {

//     // output+=name;    
//      output+=users[0]._doc.username;
//     // output+=". ";
//      output+=users[0]._doc.stepsPerDay.totalDaySteps;
//     // output+=". ";
//      output+=users[0]._doc.totalSteps;
//     // output+=". ";
//      //output+=users[0]._doc.fitBitToken;
//     // output+=". ";
//      output+=users[0]._doc.updated_at;
    // output+=". ";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////fitbit
//             output+= ". return to sender. ";

// var token = users[0]._doc.fitBitToken;
// var fitBitID = users[0]._doc.fitBitID;


// var option = {
//     url: "https://api.fitbit.com/1/user/"+fitBitID+"/activities/" + getCurrentDate() + ".json",  //date is YYYY-MM-DD     was 'date'
//     headers: {"Authorization": token}
// }

// console.log("token :" + token);

// console.log("|||");
// console.log(fitBitID);

// var alexa2 = this;
// function callback(error, response, body,alexa2,output) {
 
// var info = {here:'there'}
//   if (!error && response.statusCode == 200) {
//     var info = JSON.parse(body);
//       //  console.log(info);

// output += info;

    

//   }
//   output+=info.here;

//   alexa2.emit(':ask', output);
// }

// info_ = request(option, callback, alexa2, output);


// //output+=Object.keys(info_.callback);
// //output+=info_.callback;
// //console.log(info_.callback);
// //console.log(Object.keys(info_.callback));

//         output+= ". no such home";


// function getCurrentDate(){
//     var months_json = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06",
//                        "Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"}
//     var date = Date();
//     date = String(date);
//     var month = date.substring(4,7);
//     var day = date.substring(8,10);
//     var year = date.substring(11,15);

//     month = months_json[month];

//     date = year+'-'+month+'-'+day;
//     //console.log(date);
//     return date;
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////fitbit??



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // alexa1.emit(':ask', output);
    // }, output, alexa1, request);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// var user_Schema = mongoose.Schema({
//     username: String,
//     stepsPerDay: [{day: String, totalDaySteps: 0}],
//     totalSteps: 0,
//     iceCreamConeID: String,

//     fitBitToken: String,
//     fitBitID: String,

//     updated_at: String,
// });

//name = "john"
// var lowerCaseName = name.toLowerCase();
// alexa1 = this;

// user.find({username: lowerCaseName}, function(err, users) {

//     output+=name;    
//     output+=users[0]._doc.username;
//     output+=". total steps for the day, ";

//     output+=Object.keys(users[0]._doc.stepsPerDay);//[1];

//     output+=". for , ";
//     output+=users[0]._doc.stepsPerDay[0];


//     output+=". icecream id is , ";
//     //output+=users[0]._doc.iceCreamConeID;




//     output+=". total steps, ";
//     output+=users[0]._doc.totalSteps;
//     output+=". ";
//     //output+=users[0]._doc.fitBitToken;
//     output+=". updated at, ";
//     output+=users[0]._doc.updated_at;
//     output+=". ";
//             output+= ". end!!!";

//     alexa1.emit(':ask', output);
//     }, output, alexa1);




////////////////////////////////////////////////////////////////////////////////////////
if (name.length != 0)
    {
    var lowerCaseName = name.toLowerCase();
    alexa1 = this;

    if (lowerCaseName == "john")//name == "John"||name == "john"||name == "JOHN"||name == "jon")
    {
        user.find({username: "John"}, function(err, users) {
            if (users[0] == undefined)
            {
            output+=". unfortunately, "+lowerCaseName+" ,I didn't find you in the database. please check the database and try again";
            alexa1.emit(':ask', output);
            }
            else {
                output+=". ";    
                output+=users[0]._doc.username;
                output+=". your total steps for, ";
                output+=users[0]._doc.stepsPerDay[0]._doc.day;
                output+=". are , ";
                output+=users[0]._doc.stepsPerDay[0]._doc.totalDaySteps;
                output+=". total steps for the day, ";

                //users[0]._doc.iceCreamConeID
              
                //output+=Object.keys(users[0]._doc.stepsPerDay);//[1];
                output+=". ";
                //output+=users[0]._doc.fitBitToken;
                output+=". these steps were updated on, ";
                output+=users[0]._doc.updated_at;
                output+=". ";
                output+=". you have ";
                output+=users[0]._doc.totalSteps;

                output+=". total steps currently";

                output+= ". end!!!";
            }
        alexa1.emit(':ask', output);
        }, output, alexa1);
    }
    else if (lowerCaseName == "cole")
    {
        
        user.find({username: "Cole"}, function(err, users) {
            if (users[0] == undefined)
            {
            output+=". unfortunately, "+lowerCaseName+" ,I didn't find you in the database. please check the database and try again";
            alexa1.emit(':ask', output);
            }
            else {
                output+=". ";    
                output+=users[0]._doc.username;
                output+=". your total steps for, ";
                output+=users[0]._doc.stepsPerDay[0]._doc.day;
                output+=". are , ";
                output+=users[0]._doc.stepsPerDay[0]._doc.totalDaySteps;
                output+=". total steps for the day, ";

                //users[0]._doc.iceCreamConeID
              
                //output+=Object.keys(users[0]._doc.stepsPerDay);//[1];
                output+=". ";
                //output+=users[0]._doc.fitBitToken;
                output+=". these steps were updated on, ";
                output+=users[0]._doc.updated_at;
                output+=". ";
                output+=". you have ";
                output+=users[0]._doc.totalSteps;

                output+=". total steps currently";

                        output+= ". end!!!";
            }
        alexa1.emit(':ask', output);
        }, output, alexa1);
    }
    else if (lowerCaseName == "jennifer")
    {
        user.find({username: "Jennifer"}, function(err, users) {

            if (users[0] == undefined)
            {
            output+=". unfortunately, "+lowerCaseName+" ,I didn't find you in the database. please check the database and try again";
            alexa1.emit(':ask', output);
            }
            else {
                output+=". ";    
                output+=users[0]._doc.username;
                output+=". your total steps for, ";
                output+=users[0]._doc.stepsPerDay[0]._doc.day;
                output+=". are , ";
                output+=users[0]._doc.stepsPerDay[0]._doc.totalDaySteps;
                output+=". total steps for the day, ";

                //users[0]._doc.iceCreamConeID
              
                //output+=Object.keys(users[0]._doc.stepsPerDay);//[1];
                output+=". ";
                //output+=users[0]._doc.fitBitToken;
                output+=". these steps were updated on, ";
                output+=users[0]._doc.updated_at;
                output+=". ";
                output+=". you have ";
                output+=users[0]._doc.totalSteps;

                output+=". total steps currently";

           
            }
         alexa1.emit(':ask', output);
            }, output, alexa1);
    }
    else if (lowerCaseName == "nate")
    {
        user.find({username: "Nate"}, function(err, users) {

            if (users[0] == undefined)
            {
            output+=". unfortunately, "+lowerCaseName+" ,I didn't find you in the database. please check the database and try again";
            alexa1.emit(':ask', output);
            }
            else {
             
                output+=". ";    
                output+=users[0]._doc.username;
                output+=". your total steps for, ";
                output+=users[0]._doc.stepsPerDay[0]._doc.day;
                output+=". are , ";
                output+=users[0]._doc.stepsPerDay[0]._doc.totalDaySteps;
                output+=". total steps for the day, ";

            //users[0]._doc.iceCreamConeID
              
                //output+=Object.keys(users[0]._doc.stepsPerDay);//[1];
                output+=". ";
                //output+=users[0]._doc.fitBitToken;
                output+=". these steps were updated on, ";
                output+=users[0]._doc.updated_at;
                output+=". ";
                output+=". you have ";
                output+=users[0]._doc.totalSteps;

                output+=". total steps currently";

                        output+= ". end!!!";
            }
        alexa1.emit(':ask', output);
        }, output, alexa1);
    }
    else if (lowerCaseName == "cecil")
    {
        user.find({username: "Cecil"}, function(err, users) {

             if (users[0] == undefined)
            {
            output+=". unfortunately, "+lowerCaseName+" ,I didn't find you in the database. please check the database and try again";
            alexa1.emit(':ask', output);
            }
            else {
                output+=". ";    
                output+=users[0]._doc.username;
                output+=". your total steps for, ";
                output+=users[0]._doc.stepsPerDay[0]._doc.day;
                output+=". are , ";
                output+=users[0]._doc.stepsPerDay[0]._doc.totalDaySteps;
                output+=". total steps for the day, ";

                //users[0]._doc.iceCreamConeID
              
                //output+=Object.keys(users[0]._doc.stepsPerDay);//[1];
                output+=". ";
                //output+=users[0]._doc.fitBitToken;
                output+=". these steps were updated on, ";
                output+=users[0]._doc.updated_at;
                output+=". ";
                output+=". you have ";
                output+=users[0]._doc.totalSteps;

                output+=". total steps currently";

                        output+= ". end!!!";
            }
        alexa1.emit(':ask', output);
        }, output, alexa1);
    }
}
 else 
 {
     this.emit(':ask', output);
 }

       // this.emit(':ask', output, signingIN);
        
    },
    'StatsIntent': function () {
        output = "Welcome to Statistics.";

var lowerCaseName = name.toLowerCase();
alexa1 = this;
if (name.length == 0)
{
    output += ". please sign in by saying your name or say build a cone.";
 this.emit(':ask', output, welcomeRepromt);
}
else if (lowerCaseName == "john")//name == "John"||name == "john"||name == "JOHN"||name == "jon")
{
    user.find({username: "John"}, function(err, users) {
        if (users[0] == undefined)
        {
        output+=". unfortunately, "+lowerCaseName+" ,I didn't find you in the database. please check the database and try again";
        alexa1.emit(':ask', output);
        }
        else {
            output+=". ";    
            output+=users[0]._doc.username;
            output+=". your total steps for, ";
            output+=users[0]._doc.stepsPerDay[0]._doc.day;
            output+=". are , ";
            output+=users[0]._doc.stepsPerDay[0]._doc.totalDaySteps;
            output+=". total steps for the day, ";

            //users[0]._doc.iceCreamConeID
          
            //output+=Object.keys(users[0]._doc.stepsPerDay);//[1];
            output+=". ";
            //output+=users[0]._doc.fitBitToken;
            output+=". these steps were updated on, ";
            output+=users[0]._doc.updated_at;
            output+=". ";
            output+=". you have ";
            output+=users[0]._doc.totalSteps;

            output+=". total steps currently";

            output+= ". end!!!";
        }
    alexa1.emit(':ask', output);
    }, output, alexa1);
}
else if (lowerCaseName == "cole")
{
    
    user.find({username: "Cole"}, function(err, users) {
        if (users[0] == undefined)
        {
        output+=". unfortunately, "+lowerCaseName+" ,I didn't find you in the database. please check the database and try again";
        alexa1.emit(':ask', output);
        }
        else {
            output+=". ";    
            output+=users[0]._doc.username;
            output+=". your total steps for, ";
            output+=users[0]._doc.stepsPerDay[0]._doc.day;
            output+=". are , ";
            output+=users[0]._doc.stepsPerDay[0]._doc.totalDaySteps;
            output+=". total steps for the day, ";

            //users[0]._doc.iceCreamConeID
          
            //output+=Object.keys(users[0]._doc.stepsPerDay);//[1];
            output+=". ";
            //output+=users[0]._doc.fitBitToken;
            output+=". these steps were updated on, ";
            output+=users[0]._doc.updated_at;
            output+=". ";
            output+=". you have ";
            output+=users[0]._doc.totalSteps;

            output+=". total steps currently";

                    output+= ". end!!!";
        }
    alexa1.emit(':ask', output);
    }, output, alexa1);
}
else if (lowerCaseName == "jennifer")
{
    user.find({username: "Jennifer"}, function(err, users) {

        if (users[0] == undefined)
        {
        output+=". unfortunately, "+lowerCaseName+" ,I didn't find you in the database. please check the database and try again";
        alexa1.emit(':ask', output);
        }
        else {
            output+=". ";    
            output+=users[0]._doc.username;
            output+=". your total steps for, ";
            output+=users[0]._doc.stepsPerDay[0]._doc.day;
            output+=". are , ";
            output+=users[0]._doc.stepsPerDay[0]._doc.totalDaySteps;
            output+=". total steps for the day, ";

            //users[0]._doc.iceCreamConeID
          
            //output+=Object.keys(users[0]._doc.stepsPerDay);//[1];
            output+=". ";
            //output+=users[0]._doc.fitBitToken;
            output+=". these steps were updated on, ";
            output+=users[0]._doc.updated_at;
            output+=". ";
            output+=". you have ";
            output+=users[0]._doc.totalSteps;

            output+=". total steps currently";

       
        }
     alexa1.emit(':ask', output);
        }, output, alexa1);
}
else if (lowerCaseName == "nate")
{
    user.find({username: "Nate"}, function(err, users) {

        if (users[0] == undefined)
        {
        output+=". unfortunately, "+lowerCaseName+" ,I didn't find you in the database. please check the database and try again";
        alexa1.emit(':ask', output);
        }
        else {
         
            output+=". ";    
            output+=users[0]._doc.username;
            output+=". your total steps for, ";
            output+=users[0]._doc.stepsPerDay[0]._doc.day;
            output+=". are , ";
            output+=users[0]._doc.stepsPerDay[0]._doc.totalDaySteps;
            output+=". total steps for the day, ";

        //users[0]._doc.iceCreamConeID
          
            //output+=Object.keys(users[0]._doc.stepsPerDay);//[1];
            output+=". ";
            //output+=users[0]._doc.fitBitToken;
            output+=". these steps were updated on, ";
            output+=users[0]._doc.updated_at;
            output+=". ";
            output+=". you have ";
            output+=users[0]._doc.totalSteps;

            output+=". total steps currently";

                    output+= ". end!!!";
        }
    alexa1.emit(':ask', output);
    }, output, alexa1);
}
else if (lowerCaseName == "cecil")
{
    user.find({username: "Cecil"}, function(err, users) {

         if (users[0] == undefined)
        {
        output+=". unfortunately, "+lowerCaseName+" ,I didn't find you in the database. please check the database and try again";
        alexa1.emit(':ask', output);
        }
        else {
            output+=". ";    
            output+=users[0]._doc.username;
            output+=". your total steps for, ";
            output+=users[0]._doc.stepsPerDay[0]._doc.day;
            output+=". are , ";
            output+=users[0]._doc.stepsPerDay[0]._doc.totalDaySteps;
            output+=". total steps for the day, ";

            //users[0]._doc.iceCreamConeID
          
            //output+=Object.keys(users[0]._doc.stepsPerDay);//[1];
            output+=". ";
            //output+=users[0]._doc.fitBitToken;
            output+=". these steps were updated on, ";
            output+=users[0]._doc.updated_at;
            output+=". ";
            output+=". you have ";
            output+=users[0]._doc.totalSteps;

            output+=". total steps currently";

                    output+= ". end!!!";
        }
    alexa1.emit(':ask', output);
    }, output, alexa1);
}
 //       this.emit(':ask', output, welcomeRepromt);
    },

    'getOverview': function () {
        output = applicationOverview;
        this.emit(':ask', output, welcomeRepromt);
    },
       'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

   
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        
        

        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
       'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },
    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function summation(output, name) {
  var lowerCaseName = name.toLowerCase();
alexa1 = this;

   return output;
}

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
      };
