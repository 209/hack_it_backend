/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Типы изменений структурных элементов (СЭ)
 */
class DecreeChangeKind {

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
        if(val instanceof DecreeChangeKind) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(DecreeChangeKind.mapStringToEnum.containsKey(val))
                return DecreeChangeKind.mapStringToEnum.get(val);
            return null;
        }
        if(DecreeChangeKind.mapIntToEnum.containsKey(val))
            return DecreeChangeKind.mapIntToEnum.get(val);
        let it = new DecreeChangeKind(val, val.toString());
        DecreeChangeKind.mapIntToEnum.put(val, it);
        DecreeChangeKind.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return DecreeChangeKind.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return DecreeChangeKind.m_Values;
    }
    static static_constructor() {
        DecreeChangeKind.mapIntToEnum = new Hashtable();
        DecreeChangeKind.mapStringToEnum = new Hashtable();
        DecreeChangeKind.UNDEFINED = new DecreeChangeKind(0, "UNDEFINED");
        DecreeChangeKind.mapIntToEnum.put(DecreeChangeKind.UNDEFINED.value(), DecreeChangeKind.UNDEFINED); 
        DecreeChangeKind.mapStringToEnum.put(DecreeChangeKind.UNDEFINED.m_str.toUpperCase(), DecreeChangeKind.UNDEFINED); 
        DecreeChangeKind.CONTAINER = new DecreeChangeKind(1, "CONTAINER");
        DecreeChangeKind.mapIntToEnum.put(DecreeChangeKind.CONTAINER.value(), DecreeChangeKind.CONTAINER); 
        DecreeChangeKind.mapStringToEnum.put(DecreeChangeKind.CONTAINER.m_str.toUpperCase(), DecreeChangeKind.CONTAINER); 
        DecreeChangeKind.APPEND = new DecreeChangeKind(2, "APPEND");
        DecreeChangeKind.mapIntToEnum.put(DecreeChangeKind.APPEND.value(), DecreeChangeKind.APPEND); 
        DecreeChangeKind.mapStringToEnum.put(DecreeChangeKind.APPEND.m_str.toUpperCase(), DecreeChangeKind.APPEND); 
        DecreeChangeKind.EXPIRE = new DecreeChangeKind(3, "EXPIRE");
        DecreeChangeKind.mapIntToEnum.put(DecreeChangeKind.EXPIRE.value(), DecreeChangeKind.EXPIRE); 
        DecreeChangeKind.mapStringToEnum.put(DecreeChangeKind.EXPIRE.m_str.toUpperCase(), DecreeChangeKind.EXPIRE); 
        DecreeChangeKind.NEW = new DecreeChangeKind(4, "NEW");
        DecreeChangeKind.mapIntToEnum.put(DecreeChangeKind.NEW.value(), DecreeChangeKind.NEW); 
        DecreeChangeKind.mapStringToEnum.put(DecreeChangeKind.NEW.m_str.toUpperCase(), DecreeChangeKind.NEW); 
        DecreeChangeKind.EXCHANGE = new DecreeChangeKind(5, "EXCHANGE");
        DecreeChangeKind.mapIntToEnum.put(DecreeChangeKind.EXCHANGE.value(), DecreeChangeKind.EXCHANGE); 
        DecreeChangeKind.mapStringToEnum.put(DecreeChangeKind.EXCHANGE.m_str.toUpperCase(), DecreeChangeKind.EXCHANGE); 
        DecreeChangeKind.REMOVE = new DecreeChangeKind(6, "REMOVE");
        DecreeChangeKind.mapIntToEnum.put(DecreeChangeKind.REMOVE.value(), DecreeChangeKind.REMOVE); 
        DecreeChangeKind.mapStringToEnum.put(DecreeChangeKind.REMOVE.m_str.toUpperCase(), DecreeChangeKind.REMOVE); 
        DecreeChangeKind.CONSIDER = new DecreeChangeKind(7, "CONSIDER");
        DecreeChangeKind.mapIntToEnum.put(DecreeChangeKind.CONSIDER.value(), DecreeChangeKind.CONSIDER); 
        DecreeChangeKind.mapStringToEnum.put(DecreeChangeKind.CONSIDER.m_str.toUpperCase(), DecreeChangeKind.CONSIDER); 
        DecreeChangeKind.m_Values = Array.from(DecreeChangeKind.mapIntToEnum.values);
        DecreeChangeKind.m_Keys = Array.from(DecreeChangeKind.mapIntToEnum.keys);
    }
}


DecreeChangeKind.static_constructor();

module.exports = DecreeChangeKind