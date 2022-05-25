// Example API Call: https://www.googleapis.com/civicinfo/v2/representatives?address=10009&includeOffices=true&key=AIzaSyAdeeaGy6m0RxJ0Jx0zq8Q6fzVv7GBNZcI
// API Docs: https://developers.google.com/civic-information/docs/v2/representatives
// Example Project: https://google-civic.glitch.me/

let api_url = "https://www.googleapis.com/civicinfo/v2/representatives";
let zip_code = "";
let include_offices = true;
let api_key = "AIzaSyAdeeaGy6m0RxJ0Jx0zq8Q6fzVv7GBNZcI";

let channelToBaseUrlMap = {
  YouTube: "https://www.youtube.com/",
  Facebook: "https://www.facebook.com/",
  Twitter: "https://www.twitter.com/",
}

$("button").click(function(){
  zip_code = $("input").val();
  
  let request_url = `${api_url}?address=${zip_code}&includeOffices=${include_offices}&key=${api_key}`;
  fetch(request_url).then(function(response){
    return response.json();
  }).then(function(data){
    let sortedDivisions = getSortedDivisions(data);
    sortedDivisions.forEach(function(division){
      listOfficesInDivision(data, division);
    });
  });
});


function getSortedDivisions(data) {
  let unsortedDivisions = data.divisions;
  let sortedDivisions = [];
  
  while (Object.keys(unsortedDivisions).length !== Object.keys(sortedDivisions).length) {
    let minLength = Number.MAX_SAFE_INTEGER;
    let minKey = "";
    
    for (var key in unsortedDivisions){
      let splitDivision = key.split("/");
      let currLength = splitDivision.length;
    
      if (currLength <= minLength && !sortedDivisions.includes(key)) {
        minLength = currLength;
        minKey = key;
      }
    }
    
    sortedDivisions.push(minKey);
    
  }
  
  return sortedDivisions;
}


function listOfficesInDivision(data, division) {
  $(".results").append(`<h1>${data.divisions[division].name}</h1>`);
  
  let divisionIndices = data.divisions[division].officeIndices;
  divisionIndices.forEach(function(index){
    displayOfficeWithOfficial(data, index);
  });
}


function displayOfficeWithOfficial(data, officialIndex) {
  // TODO: OFFICIAL INDEX IS NOT CORRECT HERE -- WE MIGHT BE OFF IF THERE ARE MULTIPLE PEOPLE WITH THE SAME POSITION
  $(".results").append(`<h2>${data.offices[officialIndex].name}</h2>`);
  
  let officialData = data.officials[officialIndex];
  displayOfficial(officialData);
}


function displayOfficial(officialData){
  if (officialData.name == "VACANT") {
    $(".results").append(`<h3>${officialData.name}</h3>`);
    return;
  }
  
  if (officialData.photoUrl) {
    $(".results").append(`<img src="${officialData.photoUrl}" />`);
  }
  if (officialData.name) {
    $(".results").append(`<h3>${officialData.name}</h3>`);
  }
  if (officialData.address) {
    $(".results").append(`<p>Address: ${formatAddressString(officialData.address[0])}</p>`);
  }
  if (officialData.party) {
    $(".results").append(`<p>Party: ${officialData.party}</p>`);
  }
  if (officialData.phones) {
    $(".results").append(`<p>Phone Number: ${officialData.phones[0]}</p>`);
  }
  if (officialData.channels || officialData.urls) {
    $(".results").append(formatWebsites(officialData));
  }
}

function formatAddressString(addressDict) {
  return `${addressDict.line1}, ${addressDict.city}, ${addressDict.state}, ${addressDict.zip}`
}

function formatWebsites(officialData){
  // Setup the parent div
  let output = `<div style="display:flex; justify-content:space-between; max-width:25%;">`;
  
  // Add social media channels
  if (officialData.channels) {
    officialData.channels.forEach(function(channelObject) {
      output = output + `<a href="${channelToBaseUrlMap[channelObject.type]}${channelObject.id}">${channelObject.type}</a>`
    });
  }
  
  // Add official websites
  if (officialData.urls) {
    officialData.urls.forEach(function(url) {
      output = output + `<a href="url">Website</a>`
    });
  }
  
  // Close the div
  output = output + `</div>`;
  
  return output;
}





function listAllOffices(data) {
  data.offices.forEach(function(office) {
    $(".results").append(`<h1>${office.name}</h1>`)
    office.officialIndices.forEach(function(officialIndex){
      displayOfficial(data.officials[officialIndex]);
    })
    
  });
}