
require('dotenv').config(); //imports discord bot token as an object

const {Client} = require('discord.js'); //idk what this does lmaooooo i think it makes a client from discord framework
const client = new Client(); //makes a client object
const json = require('./pharmacies.json'); //loads local pharmacies json file

client.on('ready',() =>{ //uses an event listener to see if bot is online
    console.log(`${client.user.tag} has logged in.`);
});
client.postalCode=new Map();//makes variable to map to each user (1st mapped variable)
client.address=new Map();//makes variable to map to each user (2nd mapped variable)
client.on('message',(message)=>{ //event listener to read messages and react accordingly
    const ID = message.author.id; //makes a constant
    console.log(`[${message.author.tag}]: ${message.content}`); //logs the user and the message
    if(message.content.includes('-vaccine')){  //checks if the message includes the phrase
        client.postalCode.set(ID,message.content.substr(9)); //saves string to 1st mapped variable
        message.author.send(message.content.substr(9)); //sends the message to the user privately
        console.log(message.content.substr(9).substring(0, 3));
        for (let i = 0; i < json["pharmacies"].length; i++) {
          if (message.content.substr(9).substring(0, 3) === json["pharmacies"][i]["postal_code"].substring(0, 3)) {
            message.channel.send("-----------------------------------------------------\nPharmacy: " + json["pharmacies"][i]["pharmacy"] + "\n" +
                                 "Address: " + json["pharmacies"][i]["address"] + "\n" +
                                 "City: " + json["pharmacies"][i]["city"] + "\n" +
                                 "Postal Code: " + json["pharmacies"][i]["postal_code"] + "\n -----------------------------------------------------\n ");
          }
        }
    }
    if(message.content.includes('-address')){ //checks if the message contains the phrase
        message.author.send(client.postalCode.get(ID)); //returns the 1st mapped variable
        client.address.set(ID,message.content.substr(9)); //saves string to 2nd mapped variable
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN); //makes the bot login
