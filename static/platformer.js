window.addEventListener("load",function() {

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        .include("Enemies, Neutral, Items, Popups, CustomUI")
        .setup({ maximize: true })        
        .controls().touch()

Q.Sprite.extend("Player",{

  init: function(p) {

    this._super(p, {
      sheet: "player",  // Setting a sprite sheet sets sprite width and height
      x: 410,           // You can also set additional properties that can
      y: 90,             // be overridden on object creation
      items: [],
      true_items: {
      	crystal: {
      		'count': 0
      	}      	
      }
    });

    this.add('2d, platformerControls');
    this.on("hit.sprite",function(collision) {

      if(collision.obj.isA("Tower")) {
        Q.stageScene("endGame",1, { label: "You Won!" }); 
        this.destroy();
      }
    });
  }
  
});


Q.Sprite.extend("Title", {
    init: function(p) {
        this._super({
            y: 150,
            x: Q.width/2,
 //           asset: "logo.png"
        });
    }
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


  var player = stage.insert(new Q.Player({x:3860,y:20}));
  //var player = stage.insert(new Q.Player({x:300,y:100}));
  
  stage.add("viewport").follow(player);
  
  stage.insert(new Q.DummyHead({ x: 10, y: 0, vx: 203 }));
  stage.insert(new Q.DummyHead({ x: 70, y: 0, vx: 203 }));
  stage.insert(new Q.DummyHead({ x: 120, y: 0, vx: 203 }));
  stage.insert(new Q.DummyHead({ x: 1290, y: 203, vx: -204 }));
  stage.insert(new Q.DummyHead({ x: 1335, y: 203, vx: -204 }));
  stage.insert(new Q.DummyHead({ x: 1829, y: 203, vx: 0 }));
  stage.insert(new Q.BirdHead({ x: 1835, y: 203, vx: 200,left_position: 100, right_position: 500 }));
  stage.insert(new Q.QuestionHead({ x: 2425, y: 303, dialog: 'getAnswer', 
  collisionCallback: function(){
		
  }}));
  stage.insert(new Q.MonkeyHead({ x: 2450, y: 227 }));
  
  stage.insert(new Q.DummyHead({ x: 2780, y: 200, vx: 40 }));
  stage.insert(new Q.DummyHead({ x: 3140, y: 200, vx: -30 }));
  stage.insert(new Q.DummyHead({ x: 3090, y: 200, vx: -20 }));
  stage.insert(new Q.DummyHead({ x: 3240, y: 200, vx: -50 }));
  stage.insert(new Q.DummyHead({ x: 3280, y: 200, vx: -20 }));
  
  
  stage.insert(new Q.QuestionHead({ x: 3625, y: 203, dialog: 'giveKey' }));
    
  
  
  stage.insert(new Q.BirdHead({ x: 4235, y: 3, vx: 200,left_position: 100, right_position: 500 }));  
  stage.insert(new Q.BirdHead({ x: 4035, y: 3, vx: 140,left_position: 100, right_position: 500 }));
  
  stage.insert(new Q.Crystal({ x: 2480, y: 50}));
  stage.insert(new Q.Crystal({ x: 3410, y: 300}));
  stage.insert(new Q.Crystal({ x: 4600, y: 200}));

    var container = stage.insert(new Q.UI.Container({
      fill: "gray",
      border: 5,
      shadow: 10,
      shadowColor: "rgba(0,0,0,0.5)",
      y: 50,
      x: Q.width/2,
      type: Q.SPRITE_UI
    }));

    stage.insert(new Q.UI.Text({
      label: "Here's a label\nin a container",
      color: "white",
      x: 0,
      y: 0
    }),container);

    container.fit(30,30);
    Q.stageScene("userPanel",2);
});

Q.load("crystal.png, questionhead.png, weapon.png, birdhead.png, forest.png, jumphead1.png, jumphead.png, dummyhead.png, sprites3.png, sprites.json, level.json, tiles.png, background-wall.png", function() {

  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

  Q.compileSheets("sprites3.png","sprites.json");
  Q.sheet("player","jumphead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("enemy","dummyhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("birdhead","birdhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("weapon","weapon.png", {"sx":0,"sy":0,"tilew":7,"tileh":21,"frames":1});
  Q.sheet("questionhead","questionhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("monkeyhead","questionhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("crystal","crystal.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});

  Q.stageScene("level1");
});


});
