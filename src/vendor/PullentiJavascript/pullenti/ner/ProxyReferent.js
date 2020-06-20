/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


/**
 * Это заглушка референта при десериализации
 */
class ProxyReferent {
    
    constructor() {
        this.value = null;
        this.identity = null;
        this.referent = null;
        this.owner_slot = null;
        this.owner_referent = null;
    }
    
    toString() {
        return this.value;
    }
    
    static _new2837(_arg1, _arg2) {
        let res = new ProxyReferent();
        res.value = _arg1;
        res.owner_referent = _arg2;
        return res;
    }
}


module.exports = ProxyReferent