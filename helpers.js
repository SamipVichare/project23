// helpers.js
module.exports = {
  // Safe access to object properties
  safeAccess: function (obj, prop) {
    // Split the property string by dots to handle nested properties
    const props = prop.split('.');
    
    // Use reduce to navigate through the nested structure safely
    return props.reduce((acc, current) => {
      return acc && acc.hasOwnProperty(current) ? acc[current] : '';
    }, obj);
  },
};
