// Accounts config
ServiceConfiguration.configurations.remove({
  service: "github"
});

ServiceConfiguration.configurations.remove({
  service: "google"
});

// localhost:3000
ServiceConfiguration.configurations.insert({
  service: "github",
  clientId: "83f1c796a14e1f6ea61a",
  secret: "1c59890a41679554964713050e237ee89332731b"
});

ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: "7765215051-2kkaetqbdonvvms97o9uojchok7vfm1s.apps.googleusercontent.com",
  secret: "x0Usr-domXun4i2HGJT8NQ9a"
});

Accounts.onCreateUser(function(options, user){

  var result;
  var profile;
  var accessToken;
  if(user.services.github) {
    accessToken = user.services.github.accessToken;
    result = Meteor.http.get("https://api.github.com/user", {
      headers: {"User-Agent": "Meteor/1.0"},
      params: {
        access_token: accessToken
      }
    });
    profile = _.pick(result.data,
      "login",
      "name",
      "avatar_url",
      "url",
      "company",
      "blog",
      "location",
      "email",
      "bio",
      "html_url"
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
