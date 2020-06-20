/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class DecreeTokenItemType {

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
        if(val instanceof DecreeTokenItemType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(DecreeTokenItemType.mapStringToEnum.containsKey(val))
                return DecreeTokenItemType.mapStringToEnum.get(val);
            return null;
        }
        if(DecreeTokenItemType.mapIntToEnum.containsKey(val))
            return DecreeTokenItemType.mapIntToEnum.get(val);
        let it = new DecreeTokenItemType(val, val.toString());
        DecreeTokenItemType.mapIntToEnum.put(val, it);
        DecreeTokenItemType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return DecreeTokenItemType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return DecreeTokenItemType.m_Values;
    }
    static static_constructor() {
        DecreeTokenItemType.mapIntToEnum = new Hashtable();
        DecreeTokenItemType.mapStringToEnum = new Hashtable();
        DecreeTokenItemType.TYP = new DecreeTokenItemType(0, "TYP");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.TYP.value(), DecreeTokenItemType.TYP); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.TYP.m_str.toUpperCase(), DecreeTokenItemType.TYP); 
        DecreeTokenItemType.OWNER = new DecreeTokenItemType(1, "OWNER");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.OWNER.value(), DecreeTokenItemType.OWNER); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.OWNER.m_str.toUpperCase(), DecreeTokenItemType.OWNER); 
        DecreeTokenItemType.DATE = new DecreeTokenItemType(2, "DATE");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.DATE.value(), DecreeTokenItemType.DATE); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.DATE.m_str.toUpperCase(), DecreeTokenItemType.DATE); 
        DecreeTokenItemType.EDITION = new DecreeTokenItemType(3, "EDITION");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.EDITION.value(), DecreeTokenItemType.EDITION); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.EDITION.m_str.toUpperCase(), DecreeTokenItemType.EDITION); 
        DecreeTokenItemType.NUMBER = new DecreeTokenItemType(4, "NUMBER");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.NUMBER.value(), DecreeTokenItemType.NUMBER); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.NUMBER.m_str.toUpperCase(), DecreeTokenItemType.NUMBER); 
        DecreeTokenItemType.NAME = new DecreeTokenItemType(5, "NAME");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.NAME.value(), DecreeTokenItemType.NAME); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.NAME.m_str.toUpperCase(), DecreeTokenItemType.NAME); 
        DecreeTokenItemType.STDNAME = new DecreeTokenItemType(6, "STDNAME");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.STDNAME.value(), DecreeTokenItemType.STDNAME); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.STDNAME.m_str.toUpperCase(), DecreeTokenItemType.STDNAME); 
        DecreeTokenItemType.TERR = new DecreeTokenItemType(7, "TERR");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.TERR.value(), DecreeTokenItemType.TERR); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.TERR.m_str.toUpperCase(), DecreeTokenItemType.TERR); 
        DecreeTokenItemType.ORG = new DecreeTokenItemType(8, "ORG");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.ORG.value(), DecreeTokenItemType.ORG); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.ORG.m_str.toUpperCase(), DecreeTokenItemType.ORG); 
        DecreeTokenItemType.UNKNOWN = new DecreeTokenItemType(9, "UNKNOWN");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.UNKNOWN.value(), DecreeTokenItemType.UNKNOWN); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.UNKNOWN.m_str.toUpperCase(), DecreeTokenItemType.UNKNOWN); 
        DecreeTokenItemType.MISC = new DecreeTokenItemType(10, "MISC");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.MISC.value(), DecreeTokenItemType.MISC); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.MISC.m_str.toUpperCase(), DecreeTokenItemType.MISC); 
        DecreeTokenItemType.DECREEREF = new DecreeTokenItemType(11, "DECREEREF");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.DECREEREF.value(), DecreeTokenItemType.DECREEREF); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.DECREEREF.m_str.toUpperCase(), DecreeTokenItemType.DECREEREF); 
        DecreeTokenItemType.DATERANGE = new DecreeTokenItemType(12, "DATERANGE");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.DATERANGE.value(), DecreeTokenItemType.DATERANGE); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.DATERANGE.m_str.toUpperCase(), DecreeTokenItemType.DATERANGE); 
        DecreeTokenItemType.BETWEEN = new DecreeTokenItemType(13, "BETWEEN");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.BETWEEN.value(), DecreeTokenItemType.BETWEEN); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.BETWEEN.m_str.toUpperCase(), DecreeTokenItemType.BETWEEN); 
        DecreeTokenItemType.READING = new DecreeTokenItemType(14, "READING");
        DecreeTokenItemType.mapIntToEnum.put(DecreeTokenItemType.READING.value(), DecreeTokenItemType.READING); 
        DecreeTokenItemType.mapStringToEnum.put(DecreeTokenItemType.READING.m_str.toUpperCase(), DecreeTokenItemType.READING); 
        DecreeTokenItemType.m_Values = Array.from(DecreeTokenItemType.mapIntToEnum.values);
        DecreeTokenItemType.m_Keys = Array.from(DecreeTokenItemType.mapIntToEnum.keys);
    }
}


DecreeTokenItemType.static_constructor();

module.exports = DecreeTokenItemType