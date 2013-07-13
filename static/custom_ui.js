Quintus["CustomUI"] = function(Q) {

    Q.UI.Item = Q.UI.Button.extend("UI.Item", {

       init: function(p) {
          this._super(p);
       }
    });

    Q.UI.Crystal = Q.UI.Item.extend("UI.Crystal",{

       init: function(p){
           this._super(Q._extend(p,{'asset': 'crystal.png'}));
       }

    });

}
