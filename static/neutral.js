Quintus["Neutral"] = function(Q) {

    Q.Sprite.extend("Neutral", {
        init: function(p){
            this._super(p);
            this.add('2d');
        }
    });

    Q.Neutral.extend("QuestionHead", {
      init: function(p){
        this._super(Q._extend(p, { sheet: 'questionhead'}));
        this.on("bump.left, bump.right, bump.top",function(collision) {
          if(collision.obj.isA("Player")) {
            Q.stageScene(p.dialog,1);
            collision.obj.del("platformerControls");
          }
        });
      }
    })

    Q.Sprite.extend("MonkeyHead", {
      init: function(p){
        this._super(p, { sheet: 'monkeyhead'});
        this.on("bump.left",function(collision) {
          if(collision.obj.isA("Player")) {
            Q.stageScene("simplePopup",1);
            collision.obj.del("platformerControls");
          }
        });
      }
    })

}
