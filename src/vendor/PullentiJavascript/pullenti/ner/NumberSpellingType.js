/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../unisharp/Hashtable");

/**
 * Возможные типы написаний
 */
class NumberSpellingType {

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
        if(val instanceof NumberSpellingType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(NumberSpellingType.mapStringToEnum.containsKey(val))
                return NumberSpellingType.mapStringToEnum.get(val);
            return null;
        }
        if(NumberSpellingType.mapIntToEnum.containsKey(val))
            return NumberSpellingType.mapIntToEnum.get(val);
        let it = new NumberSpellingType(val, val.toString());
        NumberSpellingType.mapIntToEnum.put(val, it);
        NumberSpellingType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return NumberSpellingType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return NumberSpellingType.m_Values;
    }
    static static_constructor() {
        NumberSpellingType.mapIntToEnum = new Hashtable();
        NumberSpellingType.mapStringToEnum = new Hashtable();
        NumberSpellingType.DIGIT = new NumberSpellingType(0, "DIGIT");
        NumberSpellingType.mapIntToEnum.put(NumberSpellingType.DIGIT.value(), NumberSpellingType.DIGIT); 
        NumberSpellingType.mapStringToEnum.put(NumberSpellingType.DIGIT.m_str.toUpperCase(), NumberSpellingType.DIGIT); 
        NumberSpellingType.ROMAN = new NumberSpellingType(1, "ROMAN");
        NumberSpellingType.mapIntToEnum.put(NumberSpellingType.ROMAN.value(), NumberSpellingType.ROMAN); 
        NumberSpellingType.mapStringToEnum.put(NumberSpellingType.ROMAN.m_str.toUpperCase(), NumberSpellingType.ROMAN); 
        NumberSpellingType.WORDS = new NumberSpellingType(2, "WORDS");
        NumberSpellingType.mapIntToEnum.put(NumberSpellingType.WORDS.value(), NumberSpellingType.WORDS); 
        NumberSpellingType.mapStringToEnum.put(NumberSpellingType.WORDS.m_str.toUpperCase(), NumberSpellingType.WORDS); 
        NumberSpellingType.AGE = new NumberSpellingType(3, "AGE");
        NumberSpellingType.mapIntToEnum.put(NumberSpellingType.AGE.value(), NumberSpellingType.AGE); 
        NumberSpellingType.mapStringToEnum.put(NumberSpellingType.AGE.m_str.toUpperCase(), NumberSpellingType.AGE); 
        NumberSpellingType.m_Values = Array.from(NumberSpellingType.mapIntToEnum.values);
        NumberSpellingType.m_Keys = Array.from(NumberSpellingType.mapIntToEnum.keys);
    }
}


NumberSpellingType.static_constructor();

module.exports = NumberSpellingType