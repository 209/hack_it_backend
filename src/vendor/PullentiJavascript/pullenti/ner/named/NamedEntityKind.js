/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Разновидности мелких именованных сущностей
 */
class NamedEntityKind {

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
        if(val instanceof NamedEntityKind) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(NamedEntityKind.mapStringToEnum.containsKey(val))
                return NamedEntityKind.mapStringToEnum.get(val);
            return null;
        }
        if(NamedEntityKind.mapIntToEnum.containsKey(val))
            return NamedEntityKind.mapIntToEnum.get(val);
        let it = new NamedEntityKind(val, val.toString());
        NamedEntityKind.mapIntToEnum.put(val, it);
        NamedEntityKind.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return NamedEntityKind.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return NamedEntityKind.m_Values;
    }
    static static_constructor() {
        NamedEntityKind.mapIntToEnum = new Hashtable();
        NamedEntityKind.mapStringToEnum = new Hashtable();
        NamedEntityKind.UNDEFINED = new NamedEntityKind(0, "UNDEFINED");
        NamedEntityKind.mapIntToEnum.put(NamedEntityKind.UNDEFINED.value(), NamedEntityKind.UNDEFINED); 
        NamedEntityKind.mapStringToEnum.put(NamedEntityKind.UNDEFINED.m_str.toUpperCase(), NamedEntityKind.UNDEFINED); 
        NamedEntityKind.PLANET = new NamedEntityKind(1, "PLANET");
        NamedEntityKind.mapIntToEnum.put(NamedEntityKind.PLANET.value(), NamedEntityKind.PLANET); 
        NamedEntityKind.mapStringToEnum.put(NamedEntityKind.PLANET.m_str.toUpperCase(), NamedEntityKind.PLANET); 
        NamedEntityKind.LOCATION = new NamedEntityKind(2, "LOCATION");
        NamedEntityKind.mapIntToEnum.put(NamedEntityKind.LOCATION.value(), NamedEntityKind.LOCATION); 
        NamedEntityKind.mapStringToEnum.put(NamedEntityKind.LOCATION.m_str.toUpperCase(), NamedEntityKind.LOCATION); 
        NamedEntityKind.MONUMENT = new NamedEntityKind(3, "MONUMENT");
        NamedEntityKind.mapIntToEnum.put(NamedEntityKind.MONUMENT.value(), NamedEntityKind.MONUMENT); 
        NamedEntityKind.mapStringToEnum.put(NamedEntityKind.MONUMENT.m_str.toUpperCase(), NamedEntityKind.MONUMENT); 
        NamedEntityKind.BUILDING = new NamedEntityKind(4, "BUILDING");
        NamedEntityKind.mapIntToEnum.put(NamedEntityKind.BUILDING.value(), NamedEntityKind.BUILDING); 
        NamedEntityKind.mapStringToEnum.put(NamedEntityKind.BUILDING.m_str.toUpperCase(), NamedEntityKind.BUILDING); 
        NamedEntityKind.m_Values = Array.from(NamedEntityKind.mapIntToEnum.values);
        NamedEntityKind.m_Keys = Array.from(NamedEntityKind.mapIntToEnum.keys);
    }
}


NamedEntityKind.static_constructor();

module.exports = NamedEntityKind