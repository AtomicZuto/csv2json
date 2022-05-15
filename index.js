var csvjson = require('csvjson');
var fs = require('fs');

//This function creates a template for the Json file regarding the CSV file used as imput
function parseTemplate(all_data){ 
  
  var data_parsed = []

  all_data.forEach(data => {
    var template = {
      fullname: "",
      eid: "",
      groups: [],
      addresses: [],
      invisible: "",
      see_all: "",
    }
    
    var addresses = Object.keys(data).filter(key => key.indexOf(' ') >= 0)
    
    template.addresses = addresses.map(function(address) {
      
      var newAddress = address.split(' ')
      return {
        type: newAddress.shift(),        
				tags: newAddress,
				address: data[address]
      }

    })

    template.groups = data.group
    template.fullname = data.fullname
    template.eid = data.eid
    template.invisible = Boolean(data.invisible)
    template.see_all = Boolean(data.see_all)

    const exists = data_parsed.some(item => item.eid === template.eid)
    if(!exists) {
      data_parsed.push(template)
    }
    else {
      var index = data_parsed.findIndex(item => item.eid === template.eid)
      data_parsed[index].groups = data_parsed[index].groups.concat(template.groups)
      data_parsed[index].addresses = data_parsed[index].addresses.concat(template.addresses)       
    }
    
  });

  return data_parsed
}

// Read the CSV and saves in the memory
var csv = fs.readFileSync('input.csv', {encoding : 'utf8'});
// Converts from CSV to JSON
var data = csvjson.toObject(csv, {delimiter : ',', quote: '"' })
// Applies the function template to the JSON file
var cleanData = parseTemplate(data)
// Saves the JSON file
fs.writeFileSync('output.json', JSON.stringify(cleanData));
