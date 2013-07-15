window.addEventListener("load",function() {

var Q = window.Q = Quintus('myGame')
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        .include("Enemies, Neutral, Items, Popups, CustomUI")
        .setup({ width: 800, height: 800 })
        .controls().touch()

Q.Sprite.extend("Player",{

  init: function(p) {

    this._super(p, {
      sheet: "player",
      x: 720,
      y: 700,
      items: [],
      true_items: {
      	crystal: {
      		'count': 0
      	}      	
      }
    });
    this.add('2d, platformerControls');
  },
  update: function(dt) {
    if(parseInt(this.p.y / 100) * 100 == parseInt(Q.height % 10) * 100 + 500){
        Q.stageScene("endGame",1)
    }
    this.trigger('prestep',dt);
    if(this.step) { this.step(dt); }
    this.trigger('step',dt);
    this.refreshMatrix();
    Q._invoke(this.children,"frame",dt);
  },
  remove_item: function(item_name){
      if(this.p.true_items[item_name].count != 0){
          this.p.true_items[items_name].count -= 1;
          Q.stage(2).lists['UI.Text'][1].p.label = 'x ' + this.p.true_items.crystal.count;
      }
  },
  clear_items: function(item_name){
      this.p.true_items[item_name].count = 0;
      Q.stage(2).lists['UI.Text'][1].p.label = 'x ' + 0;
  },
  add_item: function(item_name){
      this.p.true_items[item_name].count += 1;
      Q.stage(2).lists['UI.Text'][1].p.label = 'x ' + this.p.true_items.crystal.count;
  }


});

Q.scene('startScreen', function(stage){
    stage.insert(new Q.Repeater({ asset: "screen.png", speedX: 0, speedY: 0 }));

    var button = stage.insert(new Q.UI.Button({
        x: 700,
        y: 700,
        label: "Start Game",
        fill: "#CCCCCC"
    }));
    button.on("click", function(){
        Q.stageScene("level1");
    })

});


Q.scene("level1",function(stage) {

  stage.insert(new Q.Repeater({ asset: "forest.png", speedX: 0.5, speedY: 0.5 }));
  stage.collisionLayer(new Q.TileLayer({
                             dataAsset: 'level.json',
                             sheet:     'tiles' }));

  stage.step = function(dt) {
      if(this.paused) { return false; }

      this.trigger("prestep",dt);
      this.updateSprites(this.items,dt);
      this.trigger("step",dt);

      if(this.removeList.length > 0) {
        for(var i=0,len=this.removeList.length;i<len;i++) {
          this.forceRemove(this.removeList[i]);
        }
        this.removeList.length = 0;
      }
      this.trigger('poststep',dt);      
  }


  var player = stage.insert(new Q.Player({x:324,y:153}));

  stage.add("viewport").follow(player);
  
//  stage.insert(new Q.DummyHead({ x: 10, y: 0, vx: 203 }));
//  stage.insert(new Q.DummyHead({ x: 70, y: 0, vx: 203 }));
//  stage.insert(new Q.DummyHead({ x: 120, y: 0, vx: 203 }));
  stage.insert(new Q.DummyHead({ x: 10, y: 0, vx: 103 }));
  stage.insert(new Q.DummyHead({ x: 70, y: 0, vx: 103 }));
  stage.insert(new Q.DummyHead({ x: 120, y: 0, vx: 103 }));
  stage.insert(new Q.DummyHead({ x: 1290, y: 203, vx: -204 }));
  stage.insert(new Q.DummyHead({ x: 1335, y: 203, vx: -204 }));
  stage.insert(new Q.DummyHead({ x: 1829, y: 203, vx: 0, name: 'guard'}));
  stage.insert(new Q.BirdHead({ x: 1835, y: 173, vx: 200,left_position: 100, right_position: 500 }));
  stage.insert(new Q.QuestionHead({ x: 2425, y: 303, dialog: 'getAnswer',
  collisionCallback: function(){

  }}));
  stage.insert(new Q.GuardHead({ x: 2450, y: 227 }));

 // stage.insert(new Q.DummyHead({ x: 2780, y: 200, vx: 40 }));
  stage.insert(new Q.DummyHead({ x: 3140, y: 200, vx: -30 }));
//  stage.insert(new Q.DummyHead({ x: 3090, y: 200, vx: -20 }));
  stage.insert(new Q.DummyHead({ x: 3240, y: 200, vx: -50 }));

  
  stage.insert(new Q.QuestionHead({ x: 3625, y: 203, dialog: 'giveKey', collision_callback: function(player){
    if(player.p.true_items.crystal.count == 3){
        this.destroy();
        Q.stageScene("simplePopup1",1);
        Q.stage().insert(new Q.Door({x:4600,y:70}));
    }
  } }));



 // stage.insert(new Q.BirdHead({ x: 4235, y: 3, vx: 200,left_position: 100, right_position: 500 }));

  stage.insert(new Q.Crystal({ x: 2480, y: 50}));
  stage.insert(new Q.Crystal({ x: 3410, y: 300}));
  stage.insert(new Q.Crystal({ x: 4600, y: 250}));

  Q.stageScene("userPanel",2);
});

Q.load("screen.png, door1.png, crystal.png, questionhead.png, weapon.png, birdhead.png, forest.png, jumphead1.png, jumphead.png, dummyhead.png, level.json, tiles.png", function() {

  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

  Q.compileSheets("sprites3.png","sprites.json");
  Q.sheet("player","jumphead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("enemy","dummyhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("birdhead","birdhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("weapon","weapon.png", {"sx":0,"sy":0,"tilew":7,"tileh":21,"frames":1});
  Q.sheet("questionhead","questionhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("monkeyhead","questionhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("crystal","crystal.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("door","door1.png", {"sx":0,"sy":0,"tilew":30,"tileh":58,"frames":1});
  Q.sheet("screen","screen.png", {"sx":0,"sy":0,"tilew":800,"tileh":800,"frames":1});
  Q.stageScene("startScreen");
});


});
