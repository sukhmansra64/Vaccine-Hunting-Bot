const request = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');
request(`http://api.scraperapi.com/?api_key=b543d97c98caa2539b2f625fdff70ed1&url=https://covid-19.ontario.ca/vaccine-locations`)
 .then(response => {
   const arr = [];
   const html = $("div[class='ontario-small-10 ontario-end ontario-columns ontario-assessment-centre-card__content ontario-assessment-centre__secondary-info ontario-assessment-centre__col-1-padding--left'] > p", response);
   let tempArray = [];
   let count = 0;
   for (let i = 0; i < 11000; i++) {
     if (!(($(html[i]).text().includes("Who can")) || ($(html[i]).text().includes("Appointment")) ||
        ($(html[i]).text().includes("appointment")) || ($(html[i]).text().includes("Vaccine")) ||
        ($(html[i]).text().includes("hours")) || ($(html[i]).text().includes("Monday")) ||
        ($(html[i]).text().includes("Sunday"))
        || ($(html[i]).text().includes("Hours")) || ($(html[i]).text().includes("a.m.")) ||
        ($(html[i]).text().includes("Phone")))) {
          if (count === 0) {
            tempArray = [];
          }
          tempArray.push($(html[i]).text());
          if (count === 3 && $(html[i]).text().length != 7) {
            console.log($(html[i]).text());
          }
          count++;
          if (count === 4) {
            arr.push({
              pharmacy: tempArray[0],
              address: tempArray[1],
              city: tempArray[2],
              postal_code: tempArray[3]
            });
            count = 0;
          }
      }
   }
   const jsonData = {"pharmacies": arr};
   const jsonContent = JSON.stringify(jsonData);

   fs.writeFile("pharmacies.json", jsonContent, 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
      console.log("JSON file has been saved.");
  });
 })
 .catch(error => {
   console.log(error)
 })
