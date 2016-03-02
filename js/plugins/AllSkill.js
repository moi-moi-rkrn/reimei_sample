//=============================================================================
// AllSill.js
// Version: 0.02
//=============================================================================
/*:
 * @plugindesc I will all the skills to the list.
 * @author karakasr_dool
 *
 * @param ALLSkill ID
 * @desc sill tyipes id
 * @default 1
 * @help 
 * Fill in the skills of the memo field
 * <req_state:id>
 * Display when the state condition of number id.
 *
 * <hide>
 * I do not want to appear in the * non- combat skills list
 */
 // ↓:jpで日本語
/*:ja
 * @plugindesc スキルタイプに関係なくすべてのスキルを表示する.
 * @author 唐傘ドール
 * @param ALLSkill ID
 * @desc スキルIDです。
 * @default 1
 * @help 
 * スキルのメモ欄に記入
 * <req_state:id>
 *　id番のステート状態の時に表示する。
 *
 * <hide>
 * 非戦闘時のスキルリストに表示しない
 */

(function() {
    var parameters = PluginManager.parameters('ALLSkill');
    var allSkillID = parseInt(parameters['ALLSkill ID'] || 1);
	
	Window_SkillList.prototype.includes = function(item) {
		if(!item){ return false; }
		var id = item.meta.req_state;
		if(id){
			id = parseInt(id);
			if($gameParty.inBattle()){
				if(!this._actor.isStateAffected(id)){ return false; }
			}else{
				if(item.meta.hide){ return false; }
			} 
		}
		return item.stypeId === this._stypeId || this._stypeId === allSkillID;
	};
})();

