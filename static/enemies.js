Quintus["Enemies"] = function(Q) {

  Q.Sprite.extend("Enemy",{

      init: function(p) {
        this._super(p);
        this.add('2d, aiBounce');
        this.on("bump.left,bump.right,bump.bottom,bump.top",function(collision) {
          if(collision.obj.isA("Player")) {
            Q.stageScene("endGame",1, { label: "You Died" });
            collision.obj.destroy();
          }
        });
      },

      frame_count: function(){
         var count = 0;
         return function(){
            return count += 1;
         }
      },
      update: function(dt) {
        if(parseInt(this.p.y / 100) * 100 == parseInt(Q.height % 10) * 100 + 300){
            this.destroy();
        }
        this.trigger('prestep',dt);
        if(this.step) { this.step(dt); }
        this.trigger('step',dt);
        this.refreshMatrix();
        Q._invoke(this.children,"frame",dt);
      }


  });

  Q.Enemy.extend("DummyHead",{
      init: function(p) {
        this._super(Q._extend(p,{ sheet: 'enemy'}));
      }
  });

  Q.DummyHead.extend("GuardHead",{
      init: function(p) {
        this._super(p);
      }
  });



  Q.Enemy.extend("BirdHead", {
      init: function(p){
        this._super(Q._extend(p, { sheet: 'birdhead', gravity: 0}));
        this.frame_number = this.frame_count();
        this.position = parseInt(p.x / 100) * 100;
      },
      update: function(dt) {
         this.trigger('prestep',dt);
         if(this.step) { this.step(dt); }
         this.trigger('step',dt);
         this.refreshMatrix();
         Q._invoke(this.children,"frame",dt);
         if(this.frame_number() % 50 == 0){

            this.stage.insert(new Q.Weapon({ x: this.p.x, y: this.p.y + 25}))
         }
         var int_position = parseInt(this.p.x / 100) * 100;
         if(int_position == this.position - this.p.left_position ||
            int_position == this.position + this.p.right_position){
            this.p.vx = -this.p.vx;
         }
      }
  });

}
