
// =================================================================
// 歩行アニメーションでアニメーションするメソッドに修正
// =================================================================
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
        }else{
            this._pattern = (this._pattern + 1) % this.maxPattern();
        }
        
    }
};

Game_Event.prototype.pattern = function() {
    if(this.event().meta.animetion){
        return this._pattern < 12 ? this._pattern : 1;
    }else{
        return this._pattern < 3 ? this._pattern : 1;
    }
};