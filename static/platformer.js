window.addEventListener("load",function() {

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, Enemies, Utils")
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
      this._super(p, {sheet: 'weapon'});
   	  this.add("2d");
   	  var $this = this;
   	  this.on("bump.left,bump.right,bump.bottom,bump.top",function(collision) {
        if(collision.obj.isA("Player")) {
        	console.log(collision.obj.p)
        	collision.obj.p.true_items.crystal.count += 1;
	        $this.destroy();
        }
    });
   }
})



Q.Sprite.extend("QuestionHead", {
  init: function(p){
    this._super(p, { sheet: 'questionhead'});
    this.add('2d');
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
    this.add('2d');
    this.on("bump.left",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.stageScene("simplePopup",1); 
        collision.obj.del("platformerControls");        
      }      
    });
   
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


  //var player = stage.insert(new Q.Player({x:4260,y:20}));
  var player = stage.insert(new Q.Player({x:300,y:100}));
  
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


});


// To display a game over / game won popup box, 
// create a endGame scene that takes in a `label` option
// to control the displayed message.
Q.scene('getAnswer',function(stage) {
// 	  
  	
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
  var timer_label = container.insert(new Q.UI.Text({x:200, y: 50, 
                                                 label: 'Timer',
                                                 fill: "#FFFFFF" }));                                                 
  var expression = container.insert(new Q.UI.Text({x:100, y: 50,                                                  
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
  
  var random_a = Math.floor((Math.random()*100)+1);                                                     
  var random_b = Math.floor((Math.random()*100)+1);
  expression.p.label = random_a.toString() + ' + ' + random_b.toString();
  random_result = random_a + random_b;
    
                                                     
  //Check answer
  button.on("click",function() {  	 
     if(parseInt(answer.p.label) == random_result){     	          	     	
     	Q.stages[0].lists.QuestionHead[0].off("bump.left");
     	delete Q.stages[1];	
     	Q.stages[0].lists.Player[0].add('platformerControls');
     	Q._extend(Q.stages[0].lists.Player[0].p.items, {"name": "banana"});     	
  	 }
  	 else{      	
      	Q.stageScene("endGame",1, { label: "You Died" }); 
        Q.stages[0].lists.Player[0].destroy();
     }
     console.log(Q.stages[0].lists.Player[0].p.items);
  });
  
  var timer = 1000;
  
  function countdown(){
  	if (timer == 0){
  		 Q.stageScene("endGame",1, { label: "You Died" }); 
  	}
  	timer -= 1;
  	return timer.toString();  	
  }
  
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
      timer_label.p.label = countdown();
            
  }

  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
  stage.container = container;  
});

Q.scene('endGame',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label: "Play Again" }))         
  var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
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

Q.scene('giveKey',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label: "Ok" }))         
  var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                   label: 'Give Me 3 crystals and I give you key to doors' }));                                                     
  // When the button is clicked, clear all the stages
  // and restart the game.
  button.on("click",function() {
    container.destroy();    
    Q.stages[0].lists.Player[0].add('platformerControls');
  });

  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});

Q.scene('simplePopup',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));  
  var text;
  var permit = "name" in Q.stages[0].lists.Player[0].p.items && 
      Q.stages[0].lists.Player[0].p.items["name"] == "banana"                                                                                                              
  if(permit){       
  	text = "Banana!!! Come in Please"
  }
  else{
  	text = "Arggh!!! Go Away!"
  }
        
  var label = container.insert(new Q.UI.Text({x:10, y: -60, label: text }));  
  var button = container.insert(new Q.UI.Button({ x: 0, y: -10, fill: "#CCCCCC",
                                                  label: "Ok" }))
  button.on("click", function(){
  	 container.destroy();
  	 Q.stages[0].lists.Player[0].add('platformerControls');
  	 if(permit){
  	 	Q.stages[0].lists.MonkeyHead[0].destroy();
  	 }
  })                                               
  
  container.fit(20);
});

Q.scene('simplePopup',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
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
  Q.sheet("monkeyhead","questionhead.png", {"sx":0,"sy":0,"tilew":30,"tileh":24,"frames":1});

  // Finally, call stageScene to run the game
  Q.stageScene("level1");
});


});
