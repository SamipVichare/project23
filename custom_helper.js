const Handlebars = require('handlebars');


Handlebars.registerHelper('getid', function(object, propertyName) {
    return object[propertyName];
});

module.exports = Handlebars;