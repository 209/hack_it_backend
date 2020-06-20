/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Типы нормативных актов
 */
class DecreeKind {

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
        if(val instanceof DecreeKind) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(DecreeKind.mapStringToEnum.containsKey(val))
                return DecreeKind.mapStringToEnum.get(val);
            return null;
        }
        if(DecreeKind.mapIntToEnum.containsKey(val))
            return DecreeKind.mapIntToEnum.get(val);
        let it = new DecreeKind(val, val.toString());
        DecreeKind.mapIntToEnum.put(val, it);
        DecreeKind.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return DecreeKind.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return DecreeKind.m_Values;
    }
    static static_constructor() {
        DecreeKind.mapIntToEnum = new Hashtable();
        DecreeKind.mapStringToEnum = new Hashtable();
        DecreeKind.UNDEFINED = new DecreeKind(0, "UNDEFINED");
        DecreeKind.mapIntToEnum.put(DecreeKind.UNDEFINED.value(), DecreeKind.UNDEFINED); 
        DecreeKind.mapStringToEnum.put(DecreeKind.UNDEFINED.m_str.toUpperCase(), DecreeKind.UNDEFINED); 
        DecreeKind.KODEX = new DecreeKind(1, "KODEX");
        DecreeKind.mapIntToEnum.put(DecreeKind.KODEX.value(), DecreeKind.KODEX); 
        DecreeKind.mapStringToEnum.put(DecreeKind.KODEX.m_str.toUpperCase(), DecreeKind.KODEX); 
        DecreeKind.USTAV = new DecreeKind(2, "USTAV");
        DecreeKind.mapIntToEnum.put(DecreeKind.USTAV.value(), DecreeKind.USTAV); 
        DecreeKind.mapStringToEnum.put(DecreeKind.USTAV.m_str.toUpperCase(), DecreeKind.USTAV); 
        DecreeKind.KONVENTION = new DecreeKind(3, "KONVENTION");
        DecreeKind.mapIntToEnum.put(DecreeKind.KONVENTION.value(), DecreeKind.KONVENTION); 
        DecreeKind.mapStringToEnum.put(DecreeKind.KONVENTION.m_str.toUpperCase(), DecreeKind.KONVENTION); 
        DecreeKind.CONTRACT = new DecreeKind(4, "CONTRACT");
        DecreeKind.mapIntToEnum.put(DecreeKind.CONTRACT.value(), DecreeKind.CONTRACT); 
        DecreeKind.mapStringToEnum.put(DecreeKind.CONTRACT.m_str.toUpperCase(), DecreeKind.CONTRACT); 
        DecreeKind.PROJECT = new DecreeKind(5, "PROJECT");
        DecreeKind.mapIntToEnum.put(DecreeKind.PROJECT.value(), DecreeKind.PROJECT); 
        DecreeKind.mapStringToEnum.put(DecreeKind.PROJECT.m_str.toUpperCase(), DecreeKind.PROJECT); 
        DecreeKind.PUBLISHER = new DecreeKind(6, "PUBLISHER");
        DecreeKind.mapIntToEnum.put(DecreeKind.PUBLISHER.value(), DecreeKind.PUBLISHER); 
        DecreeKind.mapStringToEnum.put(DecreeKind.PUBLISHER.m_str.toUpperCase(), DecreeKind.PUBLISHER); 
        DecreeKind.PROGRAM = new DecreeKind(7, "PROGRAM");
        DecreeKind.mapIntToEnum.put(DecreeKind.PROGRAM.value(), DecreeKind.PROGRAM); 
        DecreeKind.mapStringToEnum.put(DecreeKind.PROGRAM.m_str.toUpperCase(), DecreeKind.PROGRAM); 
        DecreeKind.STANDARD = new DecreeKind(8, "STANDARD");
        DecreeKind.mapIntToEnum.put(DecreeKind.STANDARD.value(), DecreeKind.STANDARD); 
        DecreeKind.mapStringToEnum.put(DecreeKind.STANDARD.m_str.toUpperCase(), DecreeKind.STANDARD); 
        DecreeKind.m_Values = Array.from(DecreeKind.mapIntToEnum.values);
        DecreeKind.m_Keys = Array.from(DecreeKind.mapIntToEnum.keys);
    }
}


DecreeKind.static_constructor();

module.exports = DecreeKind