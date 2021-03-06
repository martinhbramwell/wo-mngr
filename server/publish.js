// All Tomorrow's Parties -- server

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("parties", function () {
  return Parties.find(
    {$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});

Meteor.publish("workOrders", function () {
  return WorkOrders.find(
    {$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});

Meteor.publish("datafiles", function () {
	return Datafiles.find({}, {fields: {name: 1, file: 1}});
});