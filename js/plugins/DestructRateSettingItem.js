//=============================================================================
/*:
 * @plugindesc 消費アイテムに破壊率を設定する(シンプルver) 1.01
 *
 * @author mo-to
 *
 * @help  
 *データベースアイテムの消耗は『する』に設定のうえ、メモ欄に<destructRate:n>と記入
 *nは壊れる確率なので1～99の整数を書くこと
 *
 *例）アイテムのメモ欄に<destructRate:33>と書くと
 *　　戦闘、非戦闘問わず使用の際33％の確率でアイテムが消費する
 */ 
//=============================================================================

(function() {
  
  var _Game_Party_consumeItem = Game_Party.prototype.consumeItem;
  Game_Party.prototype.consumeItem = function(item) {
      if (DataManager.isItem(item) && item.consumable && item.meta.destructRate) {
          var destructRate = Number(item.meta.destructRate);
          var rand = Math.floor( Math.random() * (101 - 1) + 1);
          if (destructRate > rand ) {
              return this.loseItem(item, 1);
          }
          
      } else {
          _Game_Party_consumeItem.call(this, item);
      }
      
  };

})();