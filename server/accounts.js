// Accounts config
ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: process.env.FACEBOOK_APP_ID,
  secret: process.env.FACEBOOK_SECRET
});
/*
https://www.facebook.com/dialog/oauth
?client_id=342567642601187
&redirect_uri=http://localhost:3000/_oauth/facebook?close
&display=popup
&scope=user,public_repo
&state=eyJsb2dpblN0eWxlIjoicG9wdXAiLCJjcmVkZW50aWFsVG9rZW4iOiJNSlZqcEhuY3JRcWk2ak5kVm5XdEtnZ1VEdTJlOWpCMUJkNkNkMTJPRmhHIn0=
*/
// -----------------------------------------

ServiceConfiguration.configurations.remove({
  service: "google"
});

ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: process.env.GOOGLE_CLIENT_ID,
  secret: process.env.GOOGLE_SECRET
});

// -----------------------------------------

ServiceConfiguration.configurations.remove({
  service: "github"
});

ServiceConfiguration.configurations.insert({
  service: "github",
  clientId: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_SECRET
});

Accounts.onCreateUser(function(options, user){

  var result;
  var profile;
  var accessToken;
  if(user.services.facebook) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>  ");
    console.log(user.services.facebook);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>  ");
    accessToken = user.services.facebook.accessToken;
    result = Meteor.http.get("https://graph.facebook.com/" + user.services.facebook.id, {
      headers: {"User-Agent": "Meteor/1.0"},
      params: {
        access_token: accessToken
      }
    });
    profile = _.pick(result.data,
      "id",
      "name",
      "first_name",
      "link",
      "last_name",
      "email",
      "gender",
      "locale"
    );

  } else if(user.services.google) {
    accessToken = user.services.google.accessToken;
    result = Meteor.http.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {"User-Agent": "Meteor/1.0"},
      params: {
        access_token: accessToken
      }
    });
    profile = _.pick(result.data,
      "name",
      "given_name",
      "family_name",
      "profile",
      "picture",
      "email",
      "email_verified",
      "birthdate",
      "gender",
      "locale",
      "hd"
    );
    profile.avatar_url = profile.picture
  } else if(user.services.github) {
    accessToken = user.services.github.accessToken;
    result = Meteor.http.get("https://api.github.com/user", {
      headers: {"User-Agent": "Meteor/1.0"},
      params: {
        access_token: accessToken
      }
    });
    console.log(result.data);
    profile = _.pick(result.data,
      "name",
      "bio",
      "avatar_url",
      "email",
      "email_verified",
      "birthdate",
      "gender",
      "locale",
      "hd"
    );
  } else {
    console.log("Aw crap!");
  };


  if (result.error) {
    throw result.error;
  }

  user.profile = profile;
  console.log(user);
  return user;
});
