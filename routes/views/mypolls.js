// this file contains methods for handling the poll list . It uses the #polllist div element defined in the html file to create a list of available poll dynamically.
var baseurl = "pollroll.herokuapp.com/poll" ;
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
        // to calculate the results
        let result = "" ;
        let sharelink = baseurl+'/'+processtitle(title) ;
        for(let property in data[i]) {
          if(property.toString()!=="_id"&& property.toString()!=="Username"&& property.toString()!=="title" && property.toString()!=="options") {
            result+= property.toString()+" : "+data[i][property]+" , " ;
          }
        }
        string += '<li class="mypolls" ><div class = "upperpartofmypolls" onclick="listSelect(\''+title.toString()+'\')"><div class = "mypolls" style="font-size: 1.2em">'+data[i]["title"]+'</div><div class = "resultofmypolls">'+result+'</div><div class = "sharelinkofmypolls">ShareLink : '+sharelink+'</div></div><div class = "deletebutton" onclick="deletePoll(\''+title.toString()+'\')">Delete this poll</div></li><hr>';
      }
      //<li><div><div>Title</div><div>Results</div><div>ShareLink</div></div> <div><button>Delete</button></div></li>
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

function deletePoll(title) {
  var data = {} ;
  while(title.indexOf(' ')!=-1) {
    title = title.replace(' ', '_') ;
  }
  data["title"] = title ;
  $.ajax ({
    url: 'delete/'+title,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function() {
      setTimeout(getPolls, 1000) ;
    }
  })
}

function processtitle (title) {
  while(title.indexOf(' ')!=-1) {
    title = title.replace(' ', '_') ;
  }
  return title ;
}
