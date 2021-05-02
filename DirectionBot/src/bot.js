
require('dotenv').config(); //imports discord bot token as an object

const {Client} = require('discord.js'); //idk what this does lmaooooo i think it makes a client from discord framework
const client = new Client(); //makes a client object
const json = require('./pharmacies.json'); //loads local pharmacies json file
const fetch = require('node-fetch');

client.on('ready',() =>{ //uses an event listener to see if bot is online
    console.log(`${client.user.tag} has logged in.`);
});


async function apiCall(origin,destination){

    let key = "AIzaSyAK79o9MYRfhpsb8aq-VBJvewf06bvyV2s"

    const call = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}`
    // //console.log("made it here");
    // await fetch(call)
    //     .then(response => {return response.json();})
    //     .then(info =>{
    //         console.log(info.geocoded_waypoints);
    //      })
    const response = await fetch(call);
    var apiData = await response.json();
    //console.log("location: "+ destination +" distance: " + apiData.routes[0].legs[0].distance.text);
    //return response.json();
    const arr = [destination, parseFloat(apiData.routes[0].legs[0].distance.text)];
    return arr;
}

function getClosestPharmacy(origin, postalCode, message){
    //console.log("made it")
    //console.log(origin);
    var nearByPharmacies = [];
    var shortestDistance = 100;
    var originAddress = origin.replace(" ","+");
    var closestPharmacy = "";
    //console.log(postalCode);
    //console.log(originAddress);
    for(let i = 0; i < json["pharmacies"].length; i++){
      if (postalCode.toUpperCase() === json["pharmacies"][i]["postal_code"].substring(0, 3)) {
        nearByPharmacies.push(json["pharmacies"][i]["address"]);
      }
    }
    console.log(nearByPharmacies);
    var data = []
    let j = 0;
    nearByPharmacies.forEach(element => {
      var destinationAddress = element.replace(" ","+");
      apiCall(originAddress,destinationAddress).then((a) => {
        j++;
        data.push(a);
        if (j === nearByPharmacies.length) {
          for (let i = 0; i < data.length; i++) {
            var distance = data[i];
            console.log(i);
            if(shortestDistance>distance[1]) {
              console.log("swapped");
              closestPharmacy = distance[0];
              shortestDistance = distance[1];
            }
          }
          closestPharmacy = closestPharmacy.replace("+", " ");
          const returnStr = "The closest pharmacy is "+closestPharmacy+" at a distance of "+shortestDistance + " km";
          message.author.send(returnStr);
        }
      })
    });
}

var nearByPharmacies = [];
client.postalCode=new Map();//makes variable to map to each user (1st mapped variable)
client.address=new Map();//makes variable to map to each user (2nd mapped variable)
client.on('message',(message)=>{ //event listener to read messages and react accordingly
    const ID = message.author.id; //makes a constant
    console.log(`[${message.author.tag}]: ${message.content}`); //logs the user and the message
    if(message.content.includes('-vaccine')){  //checks if the message includes the phrase
        client.postalCode.set(ID,message.content.substr(9)); //saves string to 1st mapped variable
        message.author.send("Input your address with -address if you want to find the closest pharmacy.");
        console.log(message.content.substr(9).substring(0, 3));
        for (let i = 0; i < json["pharmacies"].length; i++) {
          if (message.content.substr(9).substring(0, 3).toUpperCase() === json["pharmacies"][i]["postal_code"].substring(0, 3)) {

            message.channel.send("-----------------------------------------------------\nPharmacy: " + json["pharmacies"][i]["pharmacy"] + "\n" +
                                 "Address: " + json["pharmacies"][i]["address"] + "\n" +
                                 "City: " + json["pharmacies"][i]["city"] + "\n" +
                                 "Postal Code: " + json["pharmacies"][i]["postal_code"] + "\n -----------------------------------------------------\n ");
          }
        }


    }
    if(message.content.includes('-address')){ //checks if the message contains the phrase
        client.address.set(ID,message.content.substr(9)); //saves string to 2nd mapped variable
        //console.log(message.content.substr(9));
        getClosestPharmacy(message.content.substr(9),client.postalCode.get(ID),message);
    }

});

client.login(process.env.DISCORDJS_BOT_TOKEN); //makes the bot login
