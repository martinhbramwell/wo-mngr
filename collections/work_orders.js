///////////////////////////////////////////////////////////////////////////////
// WorkOrders

/*
  Each work_order is represented by a document in the WorkOrders collection:
    owner: user id
    x, y: Number (screen coordinates in the interval [0, 1])
    title, description: String
    public: Boolean
    invited: Array of user id's that are invited (only if !public)
    rsvps: Array of objects like {user: userId, rsvp: "yes"} (or "no"/"maybe")
*/
WorkOrders = new Meteor.Collection("work_orders");

WorkOrders.allow({
  insert: function (userId, work_order) {
    return false; // no cowboy inserts -- use createWorkOrder method
  },
  update: function (userId, work_order, fields, modifier) {
    if (userId !== work_order.owner)
      return false; // not the owner

    var allowed = ["title", "description", "x", "y"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, work_order) {
    // You can only remove work orders that you created and nobody is going to.
    return work_order.owner === userId && attending(work_order) === 0;
  }
});

attending = function (work_order) {
  return (_.groupBy(work_order.rsvps, 'rsvp').yes || []).length;
};

Meteor.methods({
  // options should include: title, description, x, y, public
  createWorkOrder: function (options) {
    options = options || {};
    if (! (typeof options.title === "string" && options.title.length &&
           typeof options.description === "string" &&
           options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    return WorkOrders.insert({
      owner: this.userId,
      latlng: options.latlng,
      title: options.title,
      description: options.description,
      public: !! options.public,
      invited: [],
      rsvps: []
    });
  },

  inviteXXX: function (workOrderId, userId) {
    var work_order = WorkOrders.findOne(workOrderId);
    if (! work_order || work_order.owner !== this.userId)
      throw new Meteor.Error(404, "No such work_order");
    if (work_order.public)
      throw new Meteor.Error(400,
                             "That work_order is public. No need to invite people.");
    if (userId !== work_order.owner && ! _.contains(work_order.invited, userId)) {
      WorkOrders.update(workOrderId, { $addToSet: { invited: userId } });

      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));
      if (Meteor.isServer && to) {
        // This code only runs on the server. If you didn't want clients
        // to be able to see it, you could move it to a separate file.
        Email.send({
          from: "noreply@example.com",
          to: to,
          replyTo: from || undefined,
          subject: "PARTY: " + work_order.title,
          text:
"Hey, I just invited you to '" + work_order.title + "' on All Tomorrow's WorkOrders." +
"\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
        });
      }
    }
  },

  rsvpXXX: function (workOrderId, rsvp) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to RSVP");
    if (! _.contains(['yes', 'no', 'maybe'], rsvp))
      throw new Meteor.Error(400, "Invalid RSVP");
    var work_order = WorkOrders.findOne(workOrderId);
    if (! work_order)
      throw new Meteor.Error(404, "No such work_order");
    if (! work_order.public && work_order.owner !== this.userId &&
        !_.contains(work_order.invited, this.userId))
      // private, but let's not tell this to the user
      throw new Meteor.Error(403, "No such work_order");

    var rsvpIndex = _.indexOf(_.pluck(work_order.rsvps, 'user'), this.userId);
    if (rsvpIndex !== -1) {
      // update existing rsvp entry

      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        WorkOrders.update(
          {_id: workOrderId, "rsvps.user": this.userId},
          {$set: {"rsvps.$.rsvp": rsvp}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        var modifier = {$set: {}};
        modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
        WorkOrders.update(workOrderId, modifier);
      }

      // Possible improvement: send email to the other people that are
      // coming to the work_order.
    } else {
      // add new rsvp entry
      WorkOrders.update(workOrderId,
                     {$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
    }
  }
});
