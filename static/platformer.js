// # Quintus platformer example
//
// [Run the example](../examples/platformer/index.html)
// WARNING: this game must be run from a non-file:// url
// as it loads a level json file.
//
// This is the example from the website homepage, it consists
// a simple, non-animated platformer with some enemies and a 
// target for the player.
window.addEventListener("load",function() {
// hello
// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` componet.
var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()


// ## Player Sprite
// The very basic player sprite, this is just a normal sprite
// using the player sprite sheet with default controls added to it.
Q.Sprite.extend("Player",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "player",  // Setting a sprite sheet sets sprite width and height
      x: 410,           // You can also set additional properties that can
      y: 90             // be overridden on object creation
    });

    // Add in pre-made components to get up and running quickly
    // The `2d` component adds in default 2d collision detection
    // and kinetics (velocity, gravity)
    // The `platformerControls` makes the player controllable by the
    // default input actions (left, right to move,  up or action to jump)
    // It also checks to make sure the player is on a horizontal surface before
    // letting them jump.
    this.add('2d, platformerControls');

    // Write event handlers to respond hook into behaviors.
    // hit.sprite is called everytime the player collides with a sprite
    this.on("hit.sprite",function(collision) {

      // Check the collision, if it's the Tower, you win!
      if(collision.obj.isA("Tower")) {
        Q.stageScene("endGame",1, { label: "You Won!" }); 
        this.destroy();
      }
    });
  }
  

});


// ## Tower Sprite
// Sprites can be simple, the Tower sprite just sets a custom sprite sheet
Q.Sprite.extend("Tower", {
  init: function(p) {
    this._super(p, { sheet: 'tower' });
  }
});

// ## Enemy Sprite
// Create the Enemy class to add in some baddies
Q.Sprite.extend("Enemy",{
  init: function(p) {
    this._super(p, { sheet: 'enemy', vx: -100 });

    // Enemies use the Bounce AI to change direction 
    // whenver they run into something.
    this.add('2d, aiBounce');

    // Listen for a sprite collision, if it's the player,
    // end the game unless the enemy is hit on top
    this.on("bump.left,bump.right,bump.bottom,bump.top",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.stageScene("endGame",1, { label: "You Died" }); 
        collision.obj.destroy();
      }
    });

  },
  update: function(dt) {
     this.trigger('prestep',dt);
     if(this.step) { this.step(dt); }
     this.trigger('step',dt);
     this.refreshMatrix();
     Q._invoke(this.children,"frame",dt);
  }
  
});

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
     if(this.frame_number() % 30 == 0){
       this.destroy();
     }
  }


})

Q.Sprite.extend("BirdHead", {
  init: function(p){
    this._super(p, { sheet: 'birdhead'});
    this.position = 1800;
    this.frame_number = this.frame_count();
  },
  frame_count: function(){
     var count = 0;
     return function(){
        return count += 1;
     }
  },
  update: function(dt){
    this.p.x +=  this.p.vx;
    var int_position = parseInt(this.p.x / 100) * 100;
    if(this.frame_number() % 50 == 0){
       this.stage.insert(new Q.Weapon({ x: this.p.x, y: this.p.y}))
    }
    if(int_position == this.position + 200 ||
       int_position == this.position - 200 ){
       this.p.vx = -this.p.vx;
    }
  }
});

Q.Sprite.extend("QuestionHead", {
  init: function(p){
    this._super(p, { sheet: 'questionhead'});
  }
}) 


// ## Level1 scene
// Create a new scene called level 1
Q.scene("level1",function(stage) {

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "forest.png", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
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

  // Create the player and add them to the tage
  var player = stage.insert(new Q.Player({x:260,y:20}));
  //var player = stage.insert(new Q.Player({x:1735,y:20}));

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  stage.add("viewport").follow(player);

  // Add in a couple of enemies
  stage.insert(new Q.Enemy({ x: 10, y: 0, vx: 203 }));
  stage.insert(new Q.Enemy({ x: 70, y: 0, vx: 203 }));
  stage.insert(new Q.Enemy({ x: 120, y: 0, vx: 203 }));
  stage.insert(new Q.Enemy({ x: 1290, y: 203, vx: -204 }));
  stage.insert(new Q.Enemy({ x: 1335, y: 203, vx: -204 }));
  stage.insert(new Q.Enemy({ x: 1829, y: 203, vx: 0 }));
  stage.insert(new Q.BirdHead({ x: 1835, y: 203, vx: 2 }));
  stage.insert(new Q.QuestionHead({ x: 1935, y: 203, vx: 2 }));


});

// To display a game over / game won popup box, 
// create a endGame scene that takes in a `label` option
// to control the displayed message.
Q.scene('endGame',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2 - 150, y: Q.height/2, fill: "rgba(0,0,0,0.5)", 
  }));  

  var button = container.insert(new Q.UI.Button({ x: -18, y: 0, fill: "#CCCCCC",
                                                  label: "Confirm" }));
  var clear = container.insert(new Q.UI.Button({ x: -30, y: 50, fill: "#CCCCCC",
                                                  label: "Clear" }))
              .on("click", function(){
  					answer.p.label = "";            	
              });
  var answer = container.insert(new Q.UI.Text({x:200, y: 0, 
                                                 label: 'Enter Answer Quickly!',
                                                 fill: "#FFFFFF" }));                                                                                                                                                      
  var x = -50, y = 100;                  
  for(var key in [1,2,3,4,5,6,7,8,9,0]){  	
	  container.insert(new Q.UI.Button({ x: x, y: y, fill: "#CCCCCC",
	                                                  label: key }))
	  .on("click", function(){
	  		if(!parseInt(answer.p.label)){
	  			answer.p.label = ""
	  		}
	 		answer.p.label = answer.p.label + this.p.label; 
	  });
	  x += 50;                                                                                                
  }                                                         
                                                     
  // When the button is clicked, clear all the stages
  // and restart the game.
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  });
  
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

  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});

Q.scene('getAnswer',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label: "Play Again" }))         
  var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                   label: stage.options.label }));
  var input = container.insert(new Q.UI.Text({x:10, y: -10 - label.p.h, 
                                                   label: stage.options.label }));                                                   
  // When the button is clicked, clear all the stages
  // and restart the game.
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  });

  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});

// ## Asset Loading and Game Launch
// Q.load can be called at any time to load additional assets
// assets that are already loaded will be skipped
// The callback will be triggered when everything is loaded
Q.load("questionhead.png, weapon.png, birdhead.png, forest.png, jumphead1.png, jumphead.png, dummyhead.png, sprites3.png, sprites.json, level.json, tiles.png, background-wall.png", function() {
  // Sprites sheets can be created manually
  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

  // Or from a .json asset that defines sprite locations
  Q.compileSheets("sprites3.png","sprites.json");
  Q.sheet("player","jumphead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("enemy","dummyhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("birdhead","birdhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});
  Q.sheet("weapon","weapon.png", {"sx":0,"sy":0,"tilew":7,"tileh":21,"frames":1});
  Q.sheet("questionhead","questionhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});

  // Finally, call stageScene to run the game
  Q.stageScene("level1");
});

// ## Possible Experimentations:
// 
// The are lots of things to try out here.
// 
// 1. Modify level.json to change the level around and add in some more enemies.
// 2. Add in a second level by creating a level2.json and a level2 scene that gets
//    loaded after level 1 is complete.
// 3. Add in a title screen
// 4. Add in a hud and points for jumping on enemies.
// 5. Add in a `Repeater` behind the TileLayer to create a paralax scrolling effect.

});
