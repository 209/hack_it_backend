/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Типы улиц
 */
class StreetKind {

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
        if(val instanceof StreetKind) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(StreetKind.mapStringToEnum.containsKey(val))
                return StreetKind.mapStringToEnum.get(val);
            return null;
        }
        if(StreetKind.mapIntToEnum.containsKey(val))
            return StreetKind.mapIntToEnum.get(val);
        let it = new StreetKind(val, val.toString());
        StreetKind.mapIntToEnum.put(val, it);
        StreetKind.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return StreetKind.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return StreetKind.m_Values;
    }
    static static_constructor() {
        StreetKind.mapIntToEnum = new Hashtable();
        StreetKind.mapStringToEnum = new Hashtable();
        StreetKind.UNDEFINED = new StreetKind(0, "UNDEFINED");
        StreetKind.mapIntToEnum.put(StreetKind.UNDEFINED.value(), StreetKind.UNDEFINED); 
        StreetKind.mapStringToEnum.put(StreetKind.UNDEFINED.m_str.toUpperCase(), StreetKind.UNDEFINED); 
        StreetKind.ROAD = new StreetKind(1, "ROAD");
        StreetKind.mapIntToEnum.put(StreetKind.ROAD.value(), StreetKind.ROAD); 
        StreetKind.mapStringToEnum.put(StreetKind.ROAD.m_str.toUpperCase(), StreetKind.ROAD); 
        StreetKind.METRO = new StreetKind(2, "METRO");
        StreetKind.mapIntToEnum.put(StreetKind.METRO.value(), StreetKind.METRO); 
        StreetKind.mapStringToEnum.put(StreetKind.METRO.m_str.toUpperCase(), StreetKind.METRO); 
        StreetKind.m_Values = Array.from(StreetKind.mapIntToEnum.values);
        StreetKind.m_Keys = Array.from(StreetKind.mapIntToEnum.keys);
    }
}


StreetKind.static_constructor();

module.exports = StreetKind