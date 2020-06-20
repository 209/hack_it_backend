/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Параметры выделения последовательности
 */
class BracketParseAttr {

    constructor(val, str) {
        this.m_val = val;
        this.m_str = str;
    }
    toString() {
        return this.m_str;
    }
    value() {
        return this.m_val;
    }
    static of(val) {
        if(val instanceof BracketParseAttr) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(BracketParseAttr.mapStringToEnum.containsKey(val))
                return BracketParseAttr.mapStringToEnum.get(val);
            return null;
        }
        if(BracketParseAttr.mapIntToEnum.containsKey(val))
            return BracketParseAttr.mapIntToEnum.get(val);
        let it = new BracketParseAttr(val, val.toString());
        BracketParseAttr.mapIntToEnum.put(val, it);
        BracketParseAttr.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return BracketParseAttr.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return BracketParseAttr.m_Values;
    }
    static static_constructor() {
        BracketParseAttr.mapIntToEnum = new Hashtable();
        BracketParseAttr.mapStringToEnum = new Hashtable();
        BracketParseAttr.NO = new BracketParseAttr(0, "NO");
        BracketParseAttr.mapIntToEnum.put(BracketParseAttr.NO.value(), BracketParseAttr.NO); 
        BracketParseAttr.mapStringToEnum.put(BracketParseAttr.NO.m_str.toUpperCase(), BracketParseAttr.NO); 
        BracketParseAttr.CANCONTAINSVERBS = new BracketParseAttr(2, "CANCONTAINSVERBS");
        BracketParseAttr.mapIntToEnum.put(BracketParseAttr.CANCONTAINSVERBS.value(), BracketParseAttr.CANCONTAINSVERBS); 
        BracketParseAttr.mapStringToEnum.put(BracketParseAttr.CANCONTAINSVERBS.m_str.toUpperCase(), BracketParseAttr.CANCONTAINSVERBS); 
        BracketParseAttr.NEARCLOSEBRACKET = new BracketParseAttr(4, "NEARCLOSEBRACKET");
        BracketParseAttr.mapIntToEnum.put(BracketParseAttr.NEARCLOSEBRACKET.value(), BracketParseAttr.NEARCLOSEBRACKET); 
        BracketParseAttr.mapStringToEnum.put(BracketParseAttr.NEARCLOSEBRACKET.m_str.toUpperCase(), BracketParseAttr.NEARCLOSEBRACKET); 
        BracketParseAttr.CANBEMANYLINES = new BracketParseAttr(8, "CANBEMANYLINES");
        BracketParseAttr.mapIntToEnum.put(BracketParseAttr.CANBEMANYLINES.value(), BracketParseAttr.CANBEMANYLINES); 
        BracketParseAttr.mapStringToEnum.put(BracketParseAttr.CANBEMANYLINES.m_str.toUpperCase(), BracketParseAttr.CANBEMANYLINES); 
        BracketParseAttr.m_Values = Array.from(BracketParseAttr.mapIntToEnum.values);
        BracketParseAttr.m_Keys = Array.from(BracketParseAttr.mapIntToEnum.keys);
    }
}


BracketParseAttr.static_constructor();

module.exports = BracketParseAttr