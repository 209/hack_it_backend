/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


class AlgoParam {
    
    constructor() {
        this.name = null;
        this.value = 0;
        this.min = 0;
        this.max = 0;
        this.delta = 0;
    }
    
    get count() {
        return (Math.floor((((this.max - this.min)) / this.delta))) + 1;
    }
    
    toString() {
        return (this.name + "=" + this.value + " [" + this.min + " .. " + this.max + "] by " + this.delta);
    }
    
    static _new2886(_arg1, _arg2, _arg3, _arg4) {
        let res = new AlgoParam();
        res.name = _arg1;
        res.min = _arg2;
        res.max = _arg3;
        res.delta = _arg4;
        return res;
    }
}


module.exports = AlgoParam