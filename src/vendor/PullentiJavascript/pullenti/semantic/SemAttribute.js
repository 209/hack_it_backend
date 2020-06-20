/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const SemAttributeType = require("./SemAttributeType");

/**
 * Семантический атрибут
 */
class SemAttribute {
    
    constructor() {
        this.typ = SemAttributeType.UNDEFINED;
        this.spelling = null;
        this.not = false;
    }
    
    toString() {
        return this.spelling;
    }
    
    static _new2899(_arg1, _arg2, _arg3) {
        let res = new SemAttribute();
        res.not = _arg1;
        res.typ = _arg2;
        res.spelling = _arg3;
        return res;
    }
    
    static _new2938(_arg1, _arg2, _arg3) {
        let res = new SemAttribute();
        res.spelling = _arg1;
        res.typ = _arg2;
        res.not = _arg3;
        return res;
    }
    
    static _new2940(_arg1, _arg2) {
        let res = new SemAttribute();
        res.typ = _arg1;
        res.spelling = _arg2;
        return res;
    }
}


module.exports = SemAttribute