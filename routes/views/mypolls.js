// this file contains methods for handling the poll list . It uses the #polllist div element defined in the html file to create a list of available poll dynamically.
window.onload = getPolls ;
function getPolls() {
  $.ajax({
    url : 'myPolls',
    method: "GET",
    dataType: 'jsonp',
    success: function(data) {
      console.log(data) ;
      var div = document.getElementById('pollList') ;
      let ul = document.createElement("UL") ;
      let string = "" ;
      for(var i = 0 ;  i<data.length; i++) {
        let title = data[i]["title"] ;
        string += '<li class="mypolls" onclick="listSelect(\''+title.toString()+'\')"><div class = "mypolls">'+data[i]["title"]+'</div><button onclick="delete()">Delete</button><button onclick="share()">Share</button></li><hr>';
      }
      //<li><div>Title</div><div><button>Delete</button><button>Share</button></div></li>
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
