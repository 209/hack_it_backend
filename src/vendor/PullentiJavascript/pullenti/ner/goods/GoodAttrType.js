/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Типы атрибутоа
 */
class GoodAttrType {

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
        if(val instanceof GoodAttrType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(GoodAttrType.mapStringToEnum.containsKey(val))
                return GoodAttrType.mapStringToEnum.get(val);
            return null;
        }
        if(GoodAttrType.mapIntToEnum.containsKey(val))
            return GoodAttrType.mapIntToEnum.get(val);
        let it = new GoodAttrType(val, val.toString());
        GoodAttrType.mapIntToEnum.put(val, it);
        GoodAttrType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return GoodAttrType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return GoodAttrType.m_Values;
    }
    static static_constructor() {
        GoodAttrType.mapIntToEnum = new Hashtable();
        GoodAttrType.mapStringToEnum = new Hashtable();
        GoodAttrType.UNDEFINED = new GoodAttrType(0, "UNDEFINED");
        GoodAttrType.mapIntToEnum.put(GoodAttrType.UNDEFINED.value(), GoodAttrType.UNDEFINED); 
        GoodAttrType.mapStringToEnum.put(GoodAttrType.UNDEFINED.m_str.toUpperCase(), GoodAttrType.UNDEFINED); 
        GoodAttrType.KEYWORD = new GoodAttrType(1, "KEYWORD");
        GoodAttrType.mapIntToEnum.put(GoodAttrType.KEYWORD.value(), GoodAttrType.KEYWORD); 
        GoodAttrType.mapStringToEnum.put(GoodAttrType.KEYWORD.m_str.toUpperCase(), GoodAttrType.KEYWORD); 
        GoodAttrType.CHARACTER = new GoodAttrType(2, "CHARACTER");
        GoodAttrType.mapIntToEnum.put(GoodAttrType.CHARACTER.value(), GoodAttrType.CHARACTER); 
        GoodAttrType.mapStringToEnum.put(GoodAttrType.CHARACTER.m_str.toUpperCase(), GoodAttrType.CHARACTER); 
        GoodAttrType.PROPER = new GoodAttrType(3, "PROPER");
        GoodAttrType.mapIntToEnum.put(GoodAttrType.PROPER.value(), GoodAttrType.PROPER); 
        GoodAttrType.mapStringToEnum.put(GoodAttrType.PROPER.m_str.toUpperCase(), GoodAttrType.PROPER); 
        GoodAttrType.MODEL = new GoodAttrType(4, "MODEL");
        GoodAttrType.mapIntToEnum.put(GoodAttrType.MODEL.value(), GoodAttrType.MODEL); 
        GoodAttrType.mapStringToEnum.put(GoodAttrType.MODEL.m_str.toUpperCase(), GoodAttrType.MODEL); 
        GoodAttrType.NUMERIC = new GoodAttrType(5, "NUMERIC");
        GoodAttrType.mapIntToEnum.put(GoodAttrType.NUMERIC.value(), GoodAttrType.NUMERIC); 
        GoodAttrType.mapStringToEnum.put(GoodAttrType.NUMERIC.m_str.toUpperCase(), GoodAttrType.NUMERIC); 
        GoodAttrType.REFERENT = new GoodAttrType(6, "REFERENT");
        GoodAttrType.mapIntToEnum.put(GoodAttrType.REFERENT.value(), GoodAttrType.REFERENT); 
        GoodAttrType.mapStringToEnum.put(GoodAttrType.REFERENT.m_str.toUpperCase(), GoodAttrType.REFERENT); 
        GoodAttrType.m_Values = Array.from(GoodAttrType.mapIntToEnum.values);
        GoodAttrType.m_Keys = Array.from(GoodAttrType.mapIntToEnum.keys);
    }
}


GoodAttrType.static_constructor();

module.exports = GoodAttrType