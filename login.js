// Initialize Firebase
var config = {
    apiKey: "AIzaSyD3YSxmnO-b4Bb_yx_-jH8n-YbLIQoTQfw",
    authDomain: "boxgame-56c23.firebaseapp.com",
    databaseURL: "https://boxgame-56c23.firebaseio.com/",
    projectId: "boxgame-56c23",
  };
  firebase.initializeApp(config);
  var defaultDatabase = firebase.database();
  
  // defaultDatabase.ref('/').set({
  //   test: 'test'
  // });
  var userName = '';
  
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    var token = result.credential.accessToken;
    var user = result.user;
    userName = user.displayName;
    console.log(userName);
    player.name = userName;
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
  });