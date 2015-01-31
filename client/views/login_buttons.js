Template.loggedin.events({
  'click #logout': function(e, tmpl) {
    Meteor.logout(function(err){
      if (err) {
        // handle error
      } else {
        // nothing
      }
    });
  }
}); 

Template.loggedout.events({
  'click #loginGH': function(e, tmpl) {
    Meteor.loginWithGithub({
      requestPermissions: ["user", "public_repo"]
    }, function(err){
      if (err) {
        console.log(err)
      } else {
        // show an alert
      }
    })
  },
  'click #loginGP': function(e, tmpl) {
    Meteor.loginWithGoogle({
      requestPermissions: ["email", "profile"]
    }, function(err){
      if (err) {
        console.log(err)
      } else {
        // show an alert
      }
    })
  }
});