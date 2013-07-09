Quintus["Utils"] = function(Q) {

    Q.Class.extend("Utils",{
        frame_count: function(){
           var count = 0;
           return function(){
              return count += 1;
           }
        }
    })
}