// this file contains methods for handling the poll list . It uses the #polllist div element defined in the html file to create a list of available poll dynamically.
window.onload = getPolls ;
function getPolls() {
  $.ajax({
    url : 'getPolls',
    method: "GET",
    dataType: 'jsonp',
    success: function(data) {
      console.log(data) ;
      var div = document.getElementById('pollList') ;
      let ul = document.createElement("UL") ;
      let string = "" ;
      for(var i = 0 ;  i<data.length; i++) {
        let title = data[i]["title"] ;
        string += '<li class="poll" onclick="listSelect(\''+title.toString()+'\')">'+data[i]["title"]+'</li>';
      }
      ul.innerHTML = string ;
      div.innerHTML+="<ul>"+string+"</ul>" ;
      console.log(div.innerHTML) ;
    }
  }) ;
}

function listSelect (title) {
  var data = {} ;
  data["title"] = title ;
  $.ajax({
    url: 'viewPoll',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function() {
      // show some progress spinner
      window.location = "/viewPoll" ;
    }
  })
}
