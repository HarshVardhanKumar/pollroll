function testUsername() {
  var username = document.getElementById('username').value ;
  if(username.split(' ').length>1) {
    return false ;
  }
  return true ;
}
function testEmail() {
  var email = document.getElementById("email").value ;
  if(email.split('@').length>1) {
    if(email.split('.').length>1) {
      return true ;
    }
    return false ;
  }
  return false ;
}
function testPassword () {
  var password = document.getElementById('password').value ;
  if(password.length()>6) {
    return true ;
  }
  return false ;
}

function testSubmit() {
  if(testUsername() && testEmail() && testPassword()) {
    return true ;
  }
  return false ;
}
