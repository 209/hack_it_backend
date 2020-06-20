/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Типы изменяющих СЭ значений
 */
class DecreeChangeValueKind {

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
        if(val instanceof DecreeChangeValueKind) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(DecreeChangeValueKind.mapStringToEnum.containsKey(val))
                return DecreeChangeValueKind.mapStringToEnum.get(val);
            return null;
        }
        if(DecreeChangeValueKind.mapIntToEnum.containsKey(val))
            return DecreeChangeValueKind.mapIntToEnum.get(val);
        let it = new DecreeChangeValueKind(val, val.toString());
        DecreeChangeValueKind.mapIntToEnum.put(val, it);
        DecreeChangeValueKind.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return DecreeChangeValueKind.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return DecreeChangeValueKind.m_Values;
    }
    static static_constructor() {
        DecreeChangeValueKind.mapIntToEnum = new Hashtable();
        DecreeChangeValueKind.mapStringToEnum = new Hashtable();
        DecreeChangeValueKind.UNDEFINED = new DecreeChangeValueKind(0, "UNDEFINED");
        DecreeChangeValueKind.mapIntToEnum.put(DecreeChangeValueKind.UNDEFINED.value(), DecreeChangeValueKind.UNDEFINED); 
        DecreeChangeValueKind.mapStringToEnum.put(DecreeChangeValueKind.UNDEFINED.m_str.toUpperCase(), DecreeChangeValueKind.UNDEFINED); 
        DecreeChangeValueKind.TEXT = new DecreeChangeValueKind(1, "TEXT");
        DecreeChangeValueKind.mapIntToEnum.put(DecreeChangeValueKind.TEXT.value(), DecreeChangeValueKind.TEXT); 
        DecreeChangeValueKind.mapStringToEnum.put(DecreeChangeValueKind.TEXT.m_str.toUpperCase(), DecreeChangeValueKind.TEXT); 
        DecreeChangeValueKind.WORDS = new DecreeChangeValueKind(2, "WORDS");
        DecreeChangeValueKind.mapIntToEnum.put(DecreeChangeValueKind.WORDS.value(), DecreeChangeValueKind.WORDS); 
        DecreeChangeValueKind.mapStringToEnum.put(DecreeChangeValueKind.WORDS.m_str.toUpperCase(), DecreeChangeValueKind.WORDS); 
        DecreeChangeValueKind.ROBUSTWORDS = new DecreeChangeValueKind(3, "ROBUSTWORDS");
        DecreeChangeValueKind.mapIntToEnum.put(DecreeChangeValueKind.ROBUSTWORDS.value(), DecreeChangeValueKind.ROBUSTWORDS); 
        DecreeChangeValueKind.mapStringToEnum.put(DecreeChangeValueKind.ROBUSTWORDS.m_str.toUpperCase(), DecreeChangeValueKind.ROBUSTWORDS); 
        DecreeChangeValueKind.NUMBERS = new DecreeChangeValueKind(4, "NUMBERS");
        DecreeChangeValueKind.mapIntToEnum.put(DecreeChangeValueKind.NUMBERS.value(), DecreeChangeValueKind.NUMBERS); 
        DecreeChangeValueKind.mapStringToEnum.put(DecreeChangeValueKind.NUMBERS.m_str.toUpperCase(), DecreeChangeValueKind.NUMBERS); 
        DecreeChangeValueKind.SEQUENCE = new DecreeChangeValueKind(5, "SEQUENCE");
        DecreeChangeValueKind.mapIntToEnum.put(DecreeChangeValueKind.SEQUENCE.value(), DecreeChangeValueKind.SEQUENCE); 
        DecreeChangeValueKind.mapStringToEnum.put(DecreeChangeValueKind.SEQUENCE.m_str.toUpperCase(), DecreeChangeValueKind.SEQUENCE); 
        DecreeChangeValueKind.FOOTNOTE = new DecreeChangeValueKind(6, "FOOTNOTE");
        DecreeChangeValueKind.mapIntToEnum.put(DecreeChangeValueKind.FOOTNOTE.value(), DecreeChangeValueKind.FOOTNOTE); 
        DecreeChangeValueKind.mapStringToEnum.put(DecreeChangeValueKind.FOOTNOTE.m_str.toUpperCase(), DecreeChangeValueKind.FOOTNOTE); 
        DecreeChangeValueKind.BLOCK = new DecreeChangeValueKind(7, "BLOCK");
        DecreeChangeValueKind.mapIntToEnum.put(DecreeChangeValueKind.BLOCK.value(), DecreeChangeValueKind.BLOCK); 
        DecreeChangeValueKind.mapStringToEnum.put(DecreeChangeValueKind.BLOCK.m_str.toUpperCase(), DecreeChangeValueKind.BLOCK); 
        DecreeChangeValueKind.m_Values = Array.from(DecreeChangeValueKind.mapIntToEnum.values);
        DecreeChangeValueKind.m_Keys = Array.from(DecreeChangeValueKind.mapIntToEnum.keys);
    }
}


DecreeChangeValueKind.static_constructor();

module.exports = DecreeChangeValueKind