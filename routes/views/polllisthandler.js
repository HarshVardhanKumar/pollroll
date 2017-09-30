// spinner is a block as well as a class
// this file contains methods for handling the poll list . It uses the #polllist div element defined in the udashboard or dashboard file to create a list of available poll dynamically.
window.onload = getPolls ;
function getPolls() {
  document.getElementById('spinner').style.display = "block" ;
  $.ajax({
    url : 'getPolls',
    method: "GET",
    dataType: 'jsonp',
    success: function(data) {
      document.getElementById('spinner').style.display = "none" ;
      //console.log(data) ;
      var div = document.getElementById('pollList') ;
      let ul = document.createElement("UL") ;
      let string = "" ;
      for(var i = 0 ;  i<data.length; i++) {
        let title = data[i]["title"] ;
        string += '<li class="poll" onclick="listSelect(\''+title.toString()+'\')">'+data[i]["title"]+'</li><hr>';
      }
      ul.innerHTML = string ;
      div.innerHTML+="<ul>"+string+"</ul>" ;
      //console.log(div.innerHTML) ;
    }
  }) ;
}

function listSelect (title) {
  var data = {} ;
  data["title"] = title ;
  document.getElementById("pollList").style.display = "none" ;
  document.getElementById('spinner').style.display = "block" ;
  $.ajax({
    url: 'viewPoll',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function() {
      // show some progress spinner
      document.getElementById('spinner').style.display = "none";
      window.location = "/viewPoll" ;
    }
  })
}
