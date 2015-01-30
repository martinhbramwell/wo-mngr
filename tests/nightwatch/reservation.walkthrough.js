// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api

module.exports = {
  "App Layout" : function (client) {
    client
    .url("http://localhost:3000")
    .waitForElementVisible("body", 1000)

    .verify.elementPresent("#navbarHeader")
    .verify.elementPresent("#navbarBrandLink")

    .verify.elementPresent("#appBody")
    .verify.elementPresent("#appLayout")

  

    .end();
  }
};
