/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../unisharp/StringBuilder");

const SemFraglinkType = require("./SemFraglinkType");

/**
 * Связь между самантическими фрагментами
 */
class SemFraglink {
    
    constructor() {
        this.typ = SemFraglinkType.UNDEFINED;
        this.source = null;
        this.target = null;
        this.question = null;
    }
    
    toString() {
        let tmp = new StringBuilder();
        if (this.typ !== SemFraglinkType.UNDEFINED) 
            tmp.append(String(this.typ)).append(" ");
        if (this.question !== null) 
            tmp.append(this.question).append("? ");
        if (this.source !== null) 
            tmp.append(this.source.toString()).append(" ");
        if (this.target !== null) 
            tmp.append("-> ").append(this.target.toString());
        return tmp.toString();
    }
    
    static _new2971(_arg1, _arg2, _arg3, _arg4) {
        let res = new SemFraglink();
        res.typ = _arg1;
        res.source = _arg2;
        res.target = _arg3;
        res.question = _arg4;
        return res;
    }
}


module.exports = SemFraglink