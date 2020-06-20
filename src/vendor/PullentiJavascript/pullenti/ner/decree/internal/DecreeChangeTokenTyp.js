/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class DecreeChangeTokenTyp {

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
        if(val instanceof DecreeChangeTokenTyp) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(DecreeChangeTokenTyp.mapStringToEnum.containsKey(val))
                return DecreeChangeTokenTyp.mapStringToEnum.get(val);
            return null;
        }
        if(DecreeChangeTokenTyp.mapIntToEnum.containsKey(val))
            return DecreeChangeTokenTyp.mapIntToEnum.get(val);
        let it = new DecreeChangeTokenTyp(val, val.toString());
        DecreeChangeTokenTyp.mapIntToEnum.put(val, it);
        DecreeChangeTokenTyp.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return DecreeChangeTokenTyp.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return DecreeChangeTokenTyp.m_Values;
    }
    static static_constructor() {
        DecreeChangeTokenTyp.mapIntToEnum = new Hashtable();
        DecreeChangeTokenTyp.mapStringToEnum = new Hashtable();
        DecreeChangeTokenTyp.UNDEFINED = new DecreeChangeTokenTyp(0, "UNDEFINED");
        DecreeChangeTokenTyp.mapIntToEnum.put(DecreeChangeTokenTyp.UNDEFINED.value(), DecreeChangeTokenTyp.UNDEFINED); 
        DecreeChangeTokenTyp.mapStringToEnum.put(DecreeChangeTokenTyp.UNDEFINED.m_str.toUpperCase(), DecreeChangeTokenTyp.UNDEFINED); 
        DecreeChangeTokenTyp.STARTMULTU = new DecreeChangeTokenTyp(1, "STARTMULTU");
        DecreeChangeTokenTyp.mapIntToEnum.put(DecreeChangeTokenTyp.STARTMULTU.value(), DecreeChangeTokenTyp.STARTMULTU); 
        DecreeChangeTokenTyp.mapStringToEnum.put(DecreeChangeTokenTyp.STARTMULTU.m_str.toUpperCase(), DecreeChangeTokenTyp.STARTMULTU); 
        DecreeChangeTokenTyp.STARTSINGLE = new DecreeChangeTokenTyp(2, "STARTSINGLE");
        DecreeChangeTokenTyp.mapIntToEnum.put(DecreeChangeTokenTyp.STARTSINGLE.value(), DecreeChangeTokenTyp.STARTSINGLE); 
        DecreeChangeTokenTyp.mapStringToEnum.put(DecreeChangeTokenTyp.STARTSINGLE.m_str.toUpperCase(), DecreeChangeTokenTyp.STARTSINGLE); 
        DecreeChangeTokenTyp.SINGLE = new DecreeChangeTokenTyp(3, "SINGLE");
        DecreeChangeTokenTyp.mapIntToEnum.put(DecreeChangeTokenTyp.SINGLE.value(), DecreeChangeTokenTyp.SINGLE); 
        DecreeChangeTokenTyp.mapStringToEnum.put(DecreeChangeTokenTyp.SINGLE.m_str.toUpperCase(), DecreeChangeTokenTyp.SINGLE); 
        DecreeChangeTokenTyp.ACTION = new DecreeChangeTokenTyp(4, "ACTION");
        DecreeChangeTokenTyp.mapIntToEnum.put(DecreeChangeTokenTyp.ACTION.value(), DecreeChangeTokenTyp.ACTION); 
        DecreeChangeTokenTyp.mapStringToEnum.put(DecreeChangeTokenTyp.ACTION.m_str.toUpperCase(), DecreeChangeTokenTyp.ACTION); 
        DecreeChangeTokenTyp.VALUE = new DecreeChangeTokenTyp(5, "VALUE");
        DecreeChangeTokenTyp.mapIntToEnum.put(DecreeChangeTokenTyp.VALUE.value(), DecreeChangeTokenTyp.VALUE); 
        DecreeChangeTokenTyp.mapStringToEnum.put(DecreeChangeTokenTyp.VALUE.m_str.toUpperCase(), DecreeChangeTokenTyp.VALUE); 
        DecreeChangeTokenTyp.AFTERVALUE = new DecreeChangeTokenTyp(6, "AFTERVALUE");
        DecreeChangeTokenTyp.mapIntToEnum.put(DecreeChangeTokenTyp.AFTERVALUE.value(), DecreeChangeTokenTyp.AFTERVALUE); 
        DecreeChangeTokenTyp.mapStringToEnum.put(DecreeChangeTokenTyp.AFTERVALUE.m_str.toUpperCase(), DecreeChangeTokenTyp.AFTERVALUE); 
        DecreeChangeTokenTyp.m_Values = Array.from(DecreeChangeTokenTyp.mapIntToEnum.values);
        DecreeChangeTokenTyp.m_Keys = Array.from(DecreeChangeTokenTyp.mapIntToEnum.keys);
    }
}


DecreeChangeTokenTyp.static_constructor();

module.exports = DecreeChangeTokenTyp