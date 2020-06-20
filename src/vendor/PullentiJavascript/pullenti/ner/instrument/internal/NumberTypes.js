/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class NumberTypes {

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
        if(val instanceof NumberTypes) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(NumberTypes.mapStringToEnum.containsKey(val))
                return NumberTypes.mapStringToEnum.get(val);
            return null;
        }
        if(NumberTypes.mapIntToEnum.containsKey(val))
            return NumberTypes.mapIntToEnum.get(val);
        let it = new NumberTypes(val, val.toString());
        NumberTypes.mapIntToEnum.put(val, it);
        NumberTypes.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return NumberTypes.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return NumberTypes.m_Values;
    }
    static static_constructor() {
        NumberTypes.mapIntToEnum = new Hashtable();
        NumberTypes.mapStringToEnum = new Hashtable();
        NumberTypes.UNDEFINED = new NumberTypes(0, "UNDEFINED");
        NumberTypes.mapIntToEnum.put(NumberTypes.UNDEFINED.value(), NumberTypes.UNDEFINED); 
        NumberTypes.mapStringToEnum.put(NumberTypes.UNDEFINED.m_str.toUpperCase(), NumberTypes.UNDEFINED); 
        NumberTypes.DIGIT = new NumberTypes(1, "DIGIT");
        NumberTypes.mapIntToEnum.put(NumberTypes.DIGIT.value(), NumberTypes.DIGIT); 
        NumberTypes.mapStringToEnum.put(NumberTypes.DIGIT.m_str.toUpperCase(), NumberTypes.DIGIT); 
        NumberTypes.TWODIGITS = new NumberTypes(2, "TWODIGITS");
        NumberTypes.mapIntToEnum.put(NumberTypes.TWODIGITS.value(), NumberTypes.TWODIGITS); 
        NumberTypes.mapStringToEnum.put(NumberTypes.TWODIGITS.m_str.toUpperCase(), NumberTypes.TWODIGITS); 
        NumberTypes.THREEDIGITS = new NumberTypes(3, "THREEDIGITS");
        NumberTypes.mapIntToEnum.put(NumberTypes.THREEDIGITS.value(), NumberTypes.THREEDIGITS); 
        NumberTypes.mapStringToEnum.put(NumberTypes.THREEDIGITS.m_str.toUpperCase(), NumberTypes.THREEDIGITS); 
        NumberTypes.FOURDIGITS = new NumberTypes(4, "FOURDIGITS");
        NumberTypes.mapIntToEnum.put(NumberTypes.FOURDIGITS.value(), NumberTypes.FOURDIGITS); 
        NumberTypes.mapStringToEnum.put(NumberTypes.FOURDIGITS.m_str.toUpperCase(), NumberTypes.FOURDIGITS); 
        NumberTypes.ROMAN = new NumberTypes(5, "ROMAN");
        NumberTypes.mapIntToEnum.put(NumberTypes.ROMAN.value(), NumberTypes.ROMAN); 
        NumberTypes.mapStringToEnum.put(NumberTypes.ROMAN.m_str.toUpperCase(), NumberTypes.ROMAN); 
        NumberTypes.LETTER = new NumberTypes(6, "LETTER");
        NumberTypes.mapIntToEnum.put(NumberTypes.LETTER.value(), NumberTypes.LETTER); 
        NumberTypes.mapStringToEnum.put(NumberTypes.LETTER.m_str.toUpperCase(), NumberTypes.LETTER); 
        NumberTypes.COMBO = new NumberTypes(7, "COMBO");
        NumberTypes.mapIntToEnum.put(NumberTypes.COMBO.value(), NumberTypes.COMBO); 
        NumberTypes.mapStringToEnum.put(NumberTypes.COMBO.m_str.toUpperCase(), NumberTypes.COMBO); 
        NumberTypes.m_Values = Array.from(NumberTypes.mapIntToEnum.values);
        NumberTypes.m_Keys = Array.from(NumberTypes.mapIntToEnum.keys);
    }
}


NumberTypes.static_constructor();

module.exports = NumberTypes