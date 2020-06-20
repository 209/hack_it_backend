/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../unisharp/Hashtable");

/**
 * Залог (для глаголов)
 */
class MorphVoice {

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
        if(val instanceof MorphVoice) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(MorphVoice.mapStringToEnum.containsKey(val))
                return MorphVoice.mapStringToEnum.get(val);
            return null;
        }
        if(MorphVoice.mapIntToEnum.containsKey(val))
            return MorphVoice.mapIntToEnum.get(val);
        let it = new MorphVoice(val, val.toString());
        MorphVoice.mapIntToEnum.put(val, it);
        MorphVoice.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return MorphVoice.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return MorphVoice.m_Values;
    }
    static static_constructor() {
        MorphVoice.mapIntToEnum = new Hashtable();
        MorphVoice.mapStringToEnum = new Hashtable();
        MorphVoice.UNDEFINED = new MorphVoice(0, "UNDEFINED");
        MorphVoice.mapIntToEnum.put(MorphVoice.UNDEFINED.value(), MorphVoice.UNDEFINED); 
        MorphVoice.mapStringToEnum.put(MorphVoice.UNDEFINED.m_str.toUpperCase(), MorphVoice.UNDEFINED); 
        MorphVoice.ACTIVE = new MorphVoice(1, "ACTIVE");
        MorphVoice.mapIntToEnum.put(MorphVoice.ACTIVE.value(), MorphVoice.ACTIVE); 
        MorphVoice.mapStringToEnum.put(MorphVoice.ACTIVE.m_str.toUpperCase(), MorphVoice.ACTIVE); 
        MorphVoice.PASSIVE = new MorphVoice(2, "PASSIVE");
        MorphVoice.mapIntToEnum.put(MorphVoice.PASSIVE.value(), MorphVoice.PASSIVE); 
        MorphVoice.mapStringToEnum.put(MorphVoice.PASSIVE.m_str.toUpperCase(), MorphVoice.PASSIVE); 
        MorphVoice.MIDDLE = new MorphVoice(4, "MIDDLE");
        MorphVoice.mapIntToEnum.put(MorphVoice.MIDDLE.value(), MorphVoice.MIDDLE); 
        MorphVoice.mapStringToEnum.put(MorphVoice.MIDDLE.m_str.toUpperCase(), MorphVoice.MIDDLE); 
        MorphVoice.m_Values = Array.from(MorphVoice.mapIntToEnum.values);
        MorphVoice.m_Keys = Array.from(MorphVoice.mapIntToEnum.keys);
    }
}


MorphVoice.static_constructor();

module.exports = MorphVoice