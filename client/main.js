// All Tomorrow's WorkOrders -- client

Meteor.subscribe("directory");
Meteor.subscribe("parties");
Meteor.subscribe("workOrders");

Meteor.startup(function () {
  Meteor.autorun(function () {
    if (! Session.get("selected")) {
      var workorder = WorkOrders.findOne();
      if (workorder) {
        Session.set("selected", workorder._id);
      }
    }
  });
});


