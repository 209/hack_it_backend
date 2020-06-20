/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

class DelimType {

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
        if(val instanceof DelimType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(DelimType.mapStringToEnum.containsKey(val))
                return DelimType.mapStringToEnum.get(val);
            return null;
        }
        if(DelimType.mapIntToEnum.containsKey(val))
            return DelimType.mapIntToEnum.get(val);
        let it = new DelimType(val, val.toString());
        DelimType.mapIntToEnum.put(val, it);
        DelimType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return DelimType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return DelimType.m_Values;
    }
    static static_constructor() {
        DelimType.mapIntToEnum = new Hashtable();
        DelimType.mapStringToEnum = new Hashtable();
        DelimType.UNDEFINED = new DelimType(0, "UNDEFINED");
        DelimType.mapIntToEnum.put(DelimType.UNDEFINED.value(), DelimType.UNDEFINED); 
        DelimType.mapStringToEnum.put(DelimType.UNDEFINED.m_str.toUpperCase(), DelimType.UNDEFINED); 
        DelimType.AND = new DelimType(1, "AND");
        DelimType.mapIntToEnum.put(DelimType.AND.value(), DelimType.AND); 
        DelimType.mapStringToEnum.put(DelimType.AND.m_str.toUpperCase(), DelimType.AND); 
        DelimType.BUT = new DelimType(2, "BUT");
        DelimType.mapIntToEnum.put(DelimType.BUT.value(), DelimType.BUT); 
        DelimType.mapStringToEnum.put(DelimType.BUT.m_str.toUpperCase(), DelimType.BUT); 
        DelimType.IF = new DelimType(4, "IF");
        DelimType.mapIntToEnum.put(DelimType.IF.value(), DelimType.IF); 
        DelimType.mapStringToEnum.put(DelimType.IF.m_str.toUpperCase(), DelimType.IF); 
        DelimType.THEN = new DelimType(8, "THEN");
        DelimType.mapIntToEnum.put(DelimType.THEN.value(), DelimType.THEN); 
        DelimType.mapStringToEnum.put(DelimType.THEN.m_str.toUpperCase(), DelimType.THEN); 
        DelimType.ELSE = new DelimType(0x10, "ELSE");
        DelimType.mapIntToEnum.put(DelimType.ELSE.value(), DelimType.ELSE); 
        DelimType.mapStringToEnum.put(DelimType.ELSE.m_str.toUpperCase(), DelimType.ELSE); 
        DelimType.BECAUSE = new DelimType(0x20, "BECAUSE");
        DelimType.mapIntToEnum.put(DelimType.BECAUSE.value(), DelimType.BECAUSE); 
        DelimType.mapStringToEnum.put(DelimType.BECAUSE.m_str.toUpperCase(), DelimType.BECAUSE); 
        DelimType.FOR = new DelimType(0x40, "FOR");
        DelimType.mapIntToEnum.put(DelimType.FOR.value(), DelimType.FOR); 
        DelimType.mapStringToEnum.put(DelimType.FOR.m_str.toUpperCase(), DelimType.FOR); 
        DelimType.WHAT = new DelimType(0x80, "WHAT");
        DelimType.mapIntToEnum.put(DelimType.WHAT.value(), DelimType.WHAT); 
        DelimType.mapStringToEnum.put(DelimType.WHAT.m_str.toUpperCase(), DelimType.WHAT); 
        DelimType.m_Values = Array.from(DelimType.mapIntToEnum.values);
        DelimType.m_Keys = Array.from(DelimType.mapIntToEnum.keys);
    }
}


DelimType.static_constructor();

module.exports = DelimType