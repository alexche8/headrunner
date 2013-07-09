Quintus["Items"] = function(Q) {

Q.Sprite.extend("Weapon", {
  init: function(p){
    this._super(p, {sheet: 'weapon'});
    this.add("2d");
    this.on("bump.left,bump.right,bump.bottom,bump.top",function(collision) {
       if(collision.obj.isA("Player")) {
        Q.stageScene("endGame",1, { label: "You Died" });
        collision.obj.destroy();
      }
    });
    this.frame_number = this.frame_count();
  },
  frame_count: function(){
     var count = 0;
     return function(){
        return count += 1;
     }
   },
  update: function(dt) {
     this.trigger('prestep',dt);
     if(this.step) { this.step(dt); }
     this.trigger('step',dt);
     this.refreshMatrix();
     Q._invoke(this.children,"frame",dt);
     if(this.frame_number() % 50 == 0){
       this.destroy();
     }
  }

});

Q.Sprite.extend("Crystal", {
   init: function(p){
      this._super(p, {sheet: 'crystal'});
   	  this.add("2d");
   	  var $this = this;
   	  this.on("bump.left,bump.right,bump.bottom,bump.top",function(collision) {
        if(collision.obj.isA("Player")) {
        	collision.obj.p.true_items.crystal.count += 1;
            var panel = Q.stage(2);
            var dist = 'UI.Crystal' in panel.lists ? panel.lists['UI.Crystal'].length * 10 : 10;
            //var dist = panel.lists.indexOf('UI.Crystal') > -1;
            Q.stage(2).lists['UI.Container'][0].insert(new Q.UI.Crystal({ x: 10, y: -dist }))

	        $this.destroy();
        }
    });
   }
});

}
