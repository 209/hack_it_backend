/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const SemAttribute = require("./../SemAttribute");

class SemAttributeEx {
    
    constructor(mt) {
        this.token = null;
        this.attr = new SemAttribute();
        this.token = mt;
    }
    
    static _new2939(_arg1, _arg2) {
        let res = new SemAttributeEx(_arg1);
        res.attr = _arg2;
        return res;
    }
}


module.exports = SemAttributeEx