/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MetaToken = require("./../MetaToken");

/**
 * Это привязка элемента отнологии к тексту
 */
class IntOntologyToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.item = null;
        this.termin = null;
    }
    
    static _new563(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new IntOntologyToken(_arg1, _arg2);
        res.item = _arg3;
        res.termin = _arg4;
        res.morph = _arg5;
        return res;
    }
}


module.exports = IntOntologyToken