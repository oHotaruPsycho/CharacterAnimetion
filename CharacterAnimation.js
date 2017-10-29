//=============================================================================
// CharacterAnimetion.js
//=============================================================================

/*:ja
 * v0.0.1
 * @plugindesc
 * イベントキャラクター拡張プラグイン
 *
 * @author オオホタルサイコ
 *
 * @help ■概要
 * イベントのキャラクターアニメーションを拡張するプラグイン
 * 使い方は以下URL参照
 * 常時ループ：http://ohotarupsycho.hatenablog.com/entry/2016/11/25/231812
 * １度だけ　：http://ohotarupsycho.hatenablog.com/entry/2017/10/29/142249
 *
 * ■プラグインコマンド
 *   OneAnimetion start            # アニメーションを１度だけ行う
 */

// =================================================================
// 歩行アニメーションでアニメーションするメソッドに修正
// =================================================================
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args){
       _Game_Interpreter_pluginCommand.call(this, command, args);
        if(command === 'OneAnimetion'){
            switch(args[0]){
            case 'start':
            var _event = this.character(0);
              _event._pattern = 0;
              _event._direction = 2;
              _event.doOneAnimetion = true;
              _event.isFinished = false;
            break;
        default:
           break;
        }
    }
};
var _initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function() {
    _initMembers.call(this);
    this.doOneAnimetion = false;
    this.isFinished = false;
};

Game_Event.prototype.updatePattern = function() {
    if (!this.hasStepAnime() && this._stopCount > 0) {
        this.resetPattern();
    } else {
        if(this.event().meta.animetion){
            this._pattern = (this._pattern + 1) % 12;
            var anm = Number(this.event().meta.animetion);
            if(this._pattern == 0){
                this._direction += 2;
            }
            if(this._pattern + ((this._direction / 2 - 1) * 12) == anm){
                this._pattern = 0;
                this.resetStopCount();
                this._direction = 2;
            }
        }else if(this.event().meta.oneAnimetion){
          if(this.doOneAnimetion){
            if(this.isFinished){
              if(this.event().meta.finishedIdx){
                var idx = Number(this.event().meta.finishedIdx);
                this._pattern = idx % 12;
                this._direction = Math.floor(idx / 12) + 2;
              }
              this.doOneAnimetion = false;
            }else{
              // OneAnimetionのイベント制御
              this._pattern = (this._pattern + 1) % 12;
              var anm = Number(this.event().meta.oneAnimetion);
              if(this._pattern == 0){
                  this._direction += 2;
              }
              if(this._pattern + ((this._direction / 2 - 1) * 12) == anm){
                this.resetStopCount();
                this.isFinished = true;
                // this._pattern = 0;
                // this._direction = 2;
              }
            }
          }
        }else{
            this._pattern = (this._pattern + 1) % this.maxPattern();
        }

    }
};

Game_Event.prototype.pattern = function() {
    if(this.event().meta.animetion || this.event().meta.oneAnimetion){
        return this._pattern < 12 ? this._pattern : 1;
    }else{
        return this._pattern < 3 ? this._pattern : 1;
    }
};

Game_Event.prototype.setDirection = function(d) {
  if(!(this.event().meta.animetion && this.event().meta.oneAnimetion)){
      if (!this.isDirectionFixed() && d) {
          this._direction = d;
      }
  }
    this.resetStopCount();
};
