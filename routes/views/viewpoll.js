// this file has methods for controlling the front-end show of the viewpoll.pug

function sendSelectedOption() {
  var value = document.getElementById('select').value ;
  var title = document.getElementsByTagName('h2')[0].innerHTML ;
  var otherOption = document.getElementById('otherOption').value ;
  var final = otherOption ;
  var newv = "true" ;
  if(otherOption==="" || otherOption===null) {
    final = value ;
    newv = false+"" ;
  }
  var datav = {} ;
  datav["result"] = final ;
  datav["title"] = title ;
  datav["new"] = newv ;
  console.log(datav) ;
  $.ajax({
    url : 'receiveResults',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(datav),
    success : function() {

    }
  }) ;
}
