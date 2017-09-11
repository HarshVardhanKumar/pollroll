// this file has methods for controlling the front-end view of the viewpoll.pug

function sendSelectedOption() {
  var value = document.getElementById('select').value ;
  var title = document.getElementsByTagName('h1')[0].innerHTML ;
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
  //console.log(newv) ;

  $.ajax({
    url : '/receiveResults',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(datav),
    success : function() {
      // now remove the poll form and show the results.
      // Also, if user wants to revote to the poll, take him to either the welcome page for unauthorized or to the dashboard page for authorized
      document.getElementById('poll').style.display = "none" ;
      document.getElementById('results').style.display = "block" ;
      document.getElementById('pollresults').style.backgroundColor = "#fff" ;
      //now getting the results of the poll
      $.ajax( {
        url: 'getResults/'+title,
        type: 'GET',
        dataType : 'jsonp',
        success : function(data) {
          // update the results and show them.
          // it receives the whole document.
          var labels1 = [] ;
          var data1 = [] ;
          for(let property in data) {
            if(property.toString()!=="_id" && property.toString()!=="title" && property.toString()!=="Username" && property.toString()!=="options") {
              labels1.push(property) ;
              data1.push(data[property]) ;
            }
          }
          //console.log(labels1);
          //console.log(data1) ;

          var ctx = document.getElementById('resultc').getContext('2d') ;
          var mychart = new Chart(ctx, {
            type: 'polarArea',
            data : {
              labels : labels1,
              datasets: [{
                label: "# of votes",
                data: data1,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(100, 193, 69, 0.2)',
                  'rgba(44, 102, 25, 0.2)',
                  'rgba(122, 23, 70,0.2)'
                ],
                borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(100, 193, 69,1)',
                  'rgba(44, 102, 25,1)',
                  'rgba(122, 23, 70,1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
            }
          })
          mychart.update() ;
        }
      })
    }
  }) ;
}
