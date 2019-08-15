$(document).ready(function() {


    // var text = texts[k];

  var i = 0;

  var consoleTyper = setInterval(function () {
     var text = "Full Stack Developer";

    if(i != text.length){
      i+=1;
      $("#intro").text(text.substr(0, i));
    } else {
      clearInterval(consoleTyper);
      $(document).ready(function() {


          // var text = texts[k];
          var text = "Full Stack Developer";
        var i = text.length;

        var consoleDeleter = setInterval(function () {


          if(i != 0){
            i--;
            $("#intro").text(text.substr(0, i));
          } else {
             clearInterval(consoleDeleter);
             $(document).ready(function() {


                 // var text = texts[k];

               var i = 0;

               var consoleTyper = setInterval(function () {
                  var text = "Georgia Tech Student";

                 if(i != text.length){
                   i+=1;
                   $("#intro").text(text.substr(0, i));
                 } else {
                   clearInterval(consoleTyper);
                   $(document).ready(function() {


                       // var text = texts[k];
                       var text = "Georgia Tech Student";
                     var i = text.length;

                     var consoleDeleter = setInterval(function () {


                       if(i != 0){
                         i--;
                         $("#intro").text(text.substr(0, i));
                       } else {
                          clearInterval(consoleDeleter);
                          $(document).ready(function() {


                              // var text = texts[k];

                            var i = 0;

                            var consoleTyper = setInterval(function () {
                               var text = "Interested in AI";

                              if(i != text.length){
                                i+=1;
                                $("#intro").text(text.substr(0, i));
                              } else {
                                clearInterval(consoleTyper);
                                $(document).ready(function() {


                                    // var text = texts[k];
                                    var text = "Interested in AI";
                                  var i = text.length;

                                  var consoleDeleter = setInterval(function () {


                                    if(i != 0){
                                      i--;
                                      $("#intro").text(text.substr(0, i));
                                    } else {
                                       clearInterval(consoleDeleter);

                                    }
                                    console.log(i);
                                  }, 150);


                                });
                              }
                              console.log(i);
                            }, 150);


                          });


                       }
                       console.log(i);
                     }, 150);


                   });
                 }
                 console.log(i);
               }, 150);


             });


          }
          console.log(i);
        }, 150);


      });
    }
    console.log(i);
  }, 150);


});
