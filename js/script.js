// Example API Call: https://www.googleapis.com/civicinfo/v2/representatives?address=10009&includeOffices=true&key=AIzaSyAdeeaGy6m0RxJ0Jx0zq8Q6fzVv7GBNZcI

let api_url = "https://www.googleapis.com/civicinfo/v2/representatives";
let zip_code = "";
let include_offices = true;
let api_key = "AIzaSyAdeeaGy6m0RxJ0Jx0zq8Q6fzVv7GBNZcI";

$("button").click(function(){
  zip_code = $("input").val();
  
  let request_url = `${api_url}?address=${zip_code}&includeOffices=${include_offices}&key=${api_key}`;
  fetch(request_url).then(function(response){
    return response.json();
  }).then(function(data){
    displayPresident(data);
  });
});

function displayPresident(data) {
  $(".results").append(`<h1>The President of the United States</hl>`);
  $(".results").append(`<h3>${data.officials[0].name}</h3>`);
  $(".results").append(`<p>Address: ${getAddressString(data.officials[0].address[0])}</p>`);
  $(".results").append(`<p>Party: ${data.officials[0].party}</p>`);
  $(".results").append(`<p>Phone Number: ${data.officials[0].phones[0]}</p>`);
  $(".results").append(
    `<div stye="display:flex;">
      <a href="https://www.twitter.com/${data.officials[0].channels[0].id}">Twitter</a>
      <a href="${data.officials[0].urls[0]}">Official Website</a>
      <a href="${data.officials[0].urls[1]}">Wikipedia</a>
    </div>`
  );
}

function getAddressString(addressDict) {
  return `${addressDict.line1}, ${addressDict.city}, ${addressDict.state}, ${addressDict.zip}`
}