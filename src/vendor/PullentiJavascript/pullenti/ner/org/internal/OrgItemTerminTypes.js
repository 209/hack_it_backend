/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class OrgItemTerminTypes {

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
        if(val instanceof OrgItemTerminTypes) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(OrgItemTerminTypes.mapStringToEnum.containsKey(val))
                return OrgItemTerminTypes.mapStringToEnum.get(val);
            return null;
        }
        if(OrgItemTerminTypes.mapIntToEnum.containsKey(val))
            return OrgItemTerminTypes.mapIntToEnum.get(val);
        let it = new OrgItemTerminTypes(val, val.toString());
        OrgItemTerminTypes.mapIntToEnum.put(val, it);
        OrgItemTerminTypes.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return OrgItemTerminTypes.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return OrgItemTerminTypes.m_Values;
    }
    static static_constructor() {
        OrgItemTerminTypes.mapIntToEnum = new Hashtable();
        OrgItemTerminTypes.mapStringToEnum = new Hashtable();
        OrgItemTerminTypes.UNDEFINED = new OrgItemTerminTypes(0, "UNDEFINED");
        OrgItemTerminTypes.mapIntToEnum.put(OrgItemTerminTypes.UNDEFINED.value(), OrgItemTerminTypes.UNDEFINED); 
        OrgItemTerminTypes.mapStringToEnum.put(OrgItemTerminTypes.UNDEFINED.m_str.toUpperCase(), OrgItemTerminTypes.UNDEFINED); 
        OrgItemTerminTypes.ORG = new OrgItemTerminTypes(1, "ORG");
        OrgItemTerminTypes.mapIntToEnum.put(OrgItemTerminTypes.ORG.value(), OrgItemTerminTypes.ORG); 
        OrgItemTerminTypes.mapStringToEnum.put(OrgItemTerminTypes.ORG.m_str.toUpperCase(), OrgItemTerminTypes.ORG); 
        OrgItemTerminTypes.PREFIX = new OrgItemTerminTypes(2, "PREFIX");
        OrgItemTerminTypes.mapIntToEnum.put(OrgItemTerminTypes.PREFIX.value(), OrgItemTerminTypes.PREFIX); 
        OrgItemTerminTypes.mapStringToEnum.put(OrgItemTerminTypes.PREFIX.m_str.toUpperCase(), OrgItemTerminTypes.PREFIX); 
        OrgItemTerminTypes.DEP = new OrgItemTerminTypes(3, "DEP");
        OrgItemTerminTypes.mapIntToEnum.put(OrgItemTerminTypes.DEP.value(), OrgItemTerminTypes.DEP); 
        OrgItemTerminTypes.mapStringToEnum.put(OrgItemTerminTypes.DEP.m_str.toUpperCase(), OrgItemTerminTypes.DEP); 
        OrgItemTerminTypes.DEPADD = new OrgItemTerminTypes(4, "DEPADD");
        OrgItemTerminTypes.mapIntToEnum.put(OrgItemTerminTypes.DEPADD.value(), OrgItemTerminTypes.DEPADD); 
        OrgItemTerminTypes.mapStringToEnum.put(OrgItemTerminTypes.DEPADD.m_str.toUpperCase(), OrgItemTerminTypes.DEPADD); 
        OrgItemTerminTypes.m_Values = Array.from(OrgItemTerminTypes.mapIntToEnum.values);
        OrgItemTerminTypes.m_Keys = Array.from(OrgItemTerminTypes.mapIntToEnum.keys);
    }
}


OrgItemTerminTypes.static_constructor();

module.exports = OrgItemTerminTypes