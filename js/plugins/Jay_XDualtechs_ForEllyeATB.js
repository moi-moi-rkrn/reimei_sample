//=============================================================================
// Dualtech system - Extension for Ellye's ATB
// Jay_XDualtechs_ForEllyeATB.js
// Version 1.0.1
//=============================================================================

var Imported = Imported || {};
Imported.Jay_XDualtechs_ForEllyeATB = true;

var Jay = Jay || {};
Jay.XDualtechs = Jay.XDualtechs || {};

//=============================================================================
 /*:
 * @plugindesc Adds unique dualtech functionality compatible with
 *  Ellye's ATB system.
 *
 * @author Jason R. Godding
 *
 * @help
 * This extension requires Jay_Dualtechs.js and ellye's_atb.js
 *
 * Add "<DualTurnSkip>" to the note tag of any skill that already
 * has the <Dual> tag to have it be used as the turn of both characters
 * involved when used. Also, when this is in effect, all Dualtech skills
 * with <DualTurnSkip> will be unusable if one of the members of the 
 * dualtech is currently charging a skill.
 * 
 * Version 1.0.1 - Fixed a crash that would happen if units' turns were skipped
 *  (usually due to status effects.)
 *
 * Version 1.0 - First version.
 * 
 * This plugin is free for non-commercial and commercial use, but please credit 
 * Jason R. Godding if you use it. Thank you.
 *
 */

Game_BattlerBase.prototype.isCharging = function () {
	return this.casting_action !== null && typeof this.casting_action.item() !== 'undefined' && 
		typeof this.casting_action.item().name !== 'undefined';
}

Jay.XDualtechs.meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
	if(skill.meta.Dual && skill.meta.DualTurnSkip) {
		if(!this.isCharging()) {
			var dualParams = Jay.Dualtechs.dualSkillData(skill.meta.Dual);
			if($gameActors.actor(dualParams[0]).isCharging() || 
				$gameActors.actor(dualParams[2]).isCharging()) {
				return false;
			}
		}
	}
	return Jay.XDualtechs.meetsSkillConditions.call(this, skill);
}

Jay.XDualtechs.CheckIfSkillHasCastingTime = Game_Battler.prototype.CheckIfSkillHasCastingTime;
Game_Battler.prototype.CheckIfSkillHasCastingTime = function() {
	if (this._actions[0] === undefined || this._actions[0] === null) {
		return false;
	}

	var item = this._actions[0].item();
	if (item === undefined || item === null) {
		return false;
	}

	var doesHaveCastingTime = Jay.XDualtechs.CheckIfSkillHasCastingTime.call(this)
	if (doesHaveCastingTime && item.meta.Dual && item.meta.DualTurnSkip) {
		var castTime = Number(item.meta.cast_time || 0);
        	if (castTime <= 0) {
			return false;
		}
		var dualParams = Jay.Dualtechs.dualSkillData(item.meta.Dual);
		if(this !== $gameActors.actor(dualParams[0])) {
			$gameActors.actor(dualParams[0]).startDummyCast(this._actions[0], castTime);
		}
		if(this !== $gameActors.actor(dualParams[2])) {
			$gameActors.actor(dualParams[2]).startDummyCast(this._actions[0], castTime);
		}
		return true;
	}
	return doesHaveCastingTime;
}

Jay.XDualtechs.startCast = Game_Battler.prototype.startCast;
Game_Battler.prototype.startCast = function(castAction, castTime) {
	this.isDummyCasting = false;
	Jay.XDualtechs.startCast.call(this, castAction, castTime);
}

Game_Battler.prototype.startDummyCast = function(castAction, castTime) {
	this.isDummyCasting = true;
        Jay.XDualtechs.startCast.call(this, castAction, castTime);
};

Jay.XDualtechs.resetCast = Game_Battler.prototype.resetCast;
Game_Battler.prototype.resetCast = function() {
	if(this.isDummyCasting) {
		this.atb = 0;
	}
	this.isDummyCasting = false;
	Jay.XDualtechs.resetCast.call(this);
}

Jay.XDualtechs.currentAction = Game_Battler.prototype.currentAction;
Game_Battler.prototype.currentAction = function() {
	if(!this.isDummyCasting) {
		return Jay.XDualtechs.currentAction.call(this);
	}
	return null;
}
