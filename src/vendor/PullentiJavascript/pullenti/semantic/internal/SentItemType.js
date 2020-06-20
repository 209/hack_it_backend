/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

class SentItemType {

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
        if(val instanceof SentItemType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(SentItemType.mapStringToEnum.containsKey(val))
                return SentItemType.mapStringToEnum.get(val);
            return null;
        }
        if(SentItemType.mapIntToEnum.containsKey(val))
            return SentItemType.mapIntToEnum.get(val);
        let it = new SentItemType(val, val.toString());
        SentItemType.mapIntToEnum.put(val, it);
        SentItemType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return SentItemType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return SentItemType.m_Values;
    }
    static static_constructor() {
        SentItemType.mapIntToEnum = new Hashtable();
        SentItemType.mapStringToEnum = new Hashtable();
        SentItemType.UNDEFINED = new SentItemType(0, "UNDEFINED");
        SentItemType.mapIntToEnum.put(SentItemType.UNDEFINED.value(), SentItemType.UNDEFINED); 
        SentItemType.mapStringToEnum.put(SentItemType.UNDEFINED.m_str.toUpperCase(), SentItemType.UNDEFINED); 
        SentItemType.NOUN = new SentItemType(1, "NOUN");
        SentItemType.mapIntToEnum.put(SentItemType.NOUN.value(), SentItemType.NOUN); 
        SentItemType.mapStringToEnum.put(SentItemType.NOUN.m_str.toUpperCase(), SentItemType.NOUN); 
        SentItemType.VERB = new SentItemType(2, "VERB");
        SentItemType.mapIntToEnum.put(SentItemType.VERB.value(), SentItemType.VERB); 
        SentItemType.mapStringToEnum.put(SentItemType.VERB.m_str.toUpperCase(), SentItemType.VERB); 
        SentItemType.CONJ = new SentItemType(3, "CONJ");
        SentItemType.mapIntToEnum.put(SentItemType.CONJ.value(), SentItemType.CONJ); 
        SentItemType.mapStringToEnum.put(SentItemType.CONJ.m_str.toUpperCase(), SentItemType.CONJ); 
        SentItemType.DELIM = new SentItemType(4, "DELIM");
        SentItemType.mapIntToEnum.put(SentItemType.DELIM.value(), SentItemType.DELIM); 
        SentItemType.mapStringToEnum.put(SentItemType.DELIM.m_str.toUpperCase(), SentItemType.DELIM); 
        SentItemType.ADVERB = new SentItemType(5, "ADVERB");
        SentItemType.mapIntToEnum.put(SentItemType.ADVERB.value(), SentItemType.ADVERB); 
        SentItemType.mapStringToEnum.put(SentItemType.ADVERB.m_str.toUpperCase(), SentItemType.ADVERB); 
        SentItemType.DEEPART = new SentItemType(6, "DEEPART");
        SentItemType.mapIntToEnum.put(SentItemType.DEEPART.value(), SentItemType.DEEPART); 
        SentItemType.mapStringToEnum.put(SentItemType.DEEPART.m_str.toUpperCase(), SentItemType.DEEPART); 
        SentItemType.PARTBEFORE = new SentItemType(7, "PARTBEFORE");
        SentItemType.mapIntToEnum.put(SentItemType.PARTBEFORE.value(), SentItemType.PARTBEFORE); 
        SentItemType.mapStringToEnum.put(SentItemType.PARTBEFORE.m_str.toUpperCase(), SentItemType.PARTBEFORE); 
        SentItemType.PARTAFTER = new SentItemType(8, "PARTAFTER");
        SentItemType.mapIntToEnum.put(SentItemType.PARTAFTER.value(), SentItemType.PARTAFTER); 
        SentItemType.mapStringToEnum.put(SentItemType.PARTAFTER.m_str.toUpperCase(), SentItemType.PARTAFTER); 
        SentItemType.SUBSENT = new SentItemType(9, "SUBSENT");
        SentItemType.mapIntToEnum.put(SentItemType.SUBSENT.value(), SentItemType.SUBSENT); 
        SentItemType.mapStringToEnum.put(SentItemType.SUBSENT.m_str.toUpperCase(), SentItemType.SUBSENT); 
        SentItemType.FORMULA = new SentItemType(10, "FORMULA");
        SentItemType.mapIntToEnum.put(SentItemType.FORMULA.value(), SentItemType.FORMULA); 
        SentItemType.mapStringToEnum.put(SentItemType.FORMULA.m_str.toUpperCase(), SentItemType.FORMULA); 
        SentItemType.m_Values = Array.from(SentItemType.mapIntToEnum.values);
        SentItemType.m_Keys = Array.from(SentItemType.mapIntToEnum.keys);
    }
}


SentItemType.static_constructor();

module.exports = SentItemType