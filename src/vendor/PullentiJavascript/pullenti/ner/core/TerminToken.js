/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MetaToken = require("./../MetaToken");

/**
 * Результат привязки термина
 */
class TerminToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.termin = null;
        this.abridge_without_point = false;
    }
    
    static _new630(_arg1, _arg2, _arg3) {
        let res = new TerminToken(_arg1, _arg2);
        res.abridge_without_point = _arg3;
        return res;
    }
    
    static _new633(_arg1, _arg2, _arg3) {
        let res = new TerminToken(_arg1, _arg2);
        res.termin = _arg3;
        return res;
    }
    
    static _new638(_arg1, _arg2, _arg3) {
        let res = new TerminToken(_arg1, _arg2);
        res.morph = _arg3;
        return res;
    }
    
    static _new644(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerminToken(_arg1, _arg2);
        res.morph = _arg3;
        res.termin = _arg4;
        return res;
    }
}


module.exports = TerminToken