/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

class NGLinkType {

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
        if(val instanceof NGLinkType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(NGLinkType.mapStringToEnum.containsKey(val))
                return NGLinkType.mapStringToEnum.get(val);
            return null;
        }
        if(NGLinkType.mapIntToEnum.containsKey(val))
            return NGLinkType.mapIntToEnum.get(val);
        let it = new NGLinkType(val, val.toString());
        NGLinkType.mapIntToEnum.put(val, it);
        NGLinkType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return NGLinkType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return NGLinkType.m_Values;
    }
    static static_constructor() {
        NGLinkType.mapIntToEnum = new Hashtable();
        NGLinkType.mapStringToEnum = new Hashtable();
        NGLinkType.UNDEFINED = new NGLinkType(0, "UNDEFINED");
        NGLinkType.mapIntToEnum.put(NGLinkType.UNDEFINED.value(), NGLinkType.UNDEFINED); 
        NGLinkType.mapStringToEnum.put(NGLinkType.UNDEFINED.m_str.toUpperCase(), NGLinkType.UNDEFINED); 
        NGLinkType.LIST = new NGLinkType(1, "LIST");
        NGLinkType.mapIntToEnum.put(NGLinkType.LIST.value(), NGLinkType.LIST); 
        NGLinkType.mapStringToEnum.put(NGLinkType.LIST.m_str.toUpperCase(), NGLinkType.LIST); 
        NGLinkType.GENETIVE = new NGLinkType(2, "GENETIVE");
        NGLinkType.mapIntToEnum.put(NGLinkType.GENETIVE.value(), NGLinkType.GENETIVE); 
        NGLinkType.mapStringToEnum.put(NGLinkType.GENETIVE.m_str.toUpperCase(), NGLinkType.GENETIVE); 
        NGLinkType.NAME = new NGLinkType(3, "NAME");
        NGLinkType.mapIntToEnum.put(NGLinkType.NAME.value(), NGLinkType.NAME); 
        NGLinkType.mapStringToEnum.put(NGLinkType.NAME.m_str.toUpperCase(), NGLinkType.NAME); 
        NGLinkType.AGENT = new NGLinkType(4, "AGENT");
        NGLinkType.mapIntToEnum.put(NGLinkType.AGENT.value(), NGLinkType.AGENT); 
        NGLinkType.mapStringToEnum.put(NGLinkType.AGENT.m_str.toUpperCase(), NGLinkType.AGENT); 
        NGLinkType.PACIENT = new NGLinkType(5, "PACIENT");
        NGLinkType.mapIntToEnum.put(NGLinkType.PACIENT.value(), NGLinkType.PACIENT); 
        NGLinkType.mapStringToEnum.put(NGLinkType.PACIENT.m_str.toUpperCase(), NGLinkType.PACIENT); 
        NGLinkType.ACTANT = new NGLinkType(6, "ACTANT");
        NGLinkType.mapIntToEnum.put(NGLinkType.ACTANT.value(), NGLinkType.ACTANT); 
        NGLinkType.mapStringToEnum.put(NGLinkType.ACTANT.m_str.toUpperCase(), NGLinkType.ACTANT); 
        NGLinkType.PARTICIPLE = new NGLinkType(7, "PARTICIPLE");
        NGLinkType.mapIntToEnum.put(NGLinkType.PARTICIPLE.value(), NGLinkType.PARTICIPLE); 
        NGLinkType.mapStringToEnum.put(NGLinkType.PARTICIPLE.m_str.toUpperCase(), NGLinkType.PARTICIPLE); 
        NGLinkType.ADVERB = new NGLinkType(8, "ADVERB");
        NGLinkType.mapIntToEnum.put(NGLinkType.ADVERB.value(), NGLinkType.ADVERB); 
        NGLinkType.mapStringToEnum.put(NGLinkType.ADVERB.m_str.toUpperCase(), NGLinkType.ADVERB); 
        NGLinkType.BE = new NGLinkType(9, "BE");
        NGLinkType.mapIntToEnum.put(NGLinkType.BE.value(), NGLinkType.BE); 
        NGLinkType.mapStringToEnum.put(NGLinkType.BE.m_str.toUpperCase(), NGLinkType.BE); 
        NGLinkType.m_Values = Array.from(NGLinkType.mapIntToEnum.values);
        NGLinkType.m_Keys = Array.from(NGLinkType.mapIntToEnum.keys);
    }
}


NGLinkType.static_constructor();

module.exports = NGLinkType