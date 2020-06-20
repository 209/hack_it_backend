/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class ILTypes {

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
        if(val instanceof ILTypes) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(ILTypes.mapStringToEnum.containsKey(val))
                return ILTypes.mapStringToEnum.get(val);
            return null;
        }
        if(ILTypes.mapIntToEnum.containsKey(val))
            return ILTypes.mapIntToEnum.get(val);
        let it = new ILTypes(val, val.toString());
        ILTypes.mapIntToEnum.put(val, it);
        ILTypes.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return ILTypes.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return ILTypes.m_Values;
    }
    static static_constructor() {
        ILTypes.mapIntToEnum = new Hashtable();
        ILTypes.mapStringToEnum = new Hashtable();
        ILTypes.UNDEFINED = new ILTypes(0, "UNDEFINED");
        ILTypes.mapIntToEnum.put(ILTypes.UNDEFINED.value(), ILTypes.UNDEFINED); 
        ILTypes.mapStringToEnum.put(ILTypes.UNDEFINED.m_str.toUpperCase(), ILTypes.UNDEFINED); 
        ILTypes.APPENDIX = new ILTypes(1, "APPENDIX");
        ILTypes.mapIntToEnum.put(ILTypes.APPENDIX.value(), ILTypes.APPENDIX); 
        ILTypes.mapStringToEnum.put(ILTypes.APPENDIX.m_str.toUpperCase(), ILTypes.APPENDIX); 
        ILTypes.APPROVED = new ILTypes(2, "APPROVED");
        ILTypes.mapIntToEnum.put(ILTypes.APPROVED.value(), ILTypes.APPROVED); 
        ILTypes.mapStringToEnum.put(ILTypes.APPROVED.m_str.toUpperCase(), ILTypes.APPROVED); 
        ILTypes.ORGANIZATION = new ILTypes(3, "ORGANIZATION");
        ILTypes.mapIntToEnum.put(ILTypes.ORGANIZATION.value(), ILTypes.ORGANIZATION); 
        ILTypes.mapStringToEnum.put(ILTypes.ORGANIZATION.m_str.toUpperCase(), ILTypes.ORGANIZATION); 
        ILTypes.REGNUMBER = new ILTypes(4, "REGNUMBER");
        ILTypes.mapIntToEnum.put(ILTypes.REGNUMBER.value(), ILTypes.REGNUMBER); 
        ILTypes.mapStringToEnum.put(ILTypes.REGNUMBER.m_str.toUpperCase(), ILTypes.REGNUMBER); 
        ILTypes.DATE = new ILTypes(5, "DATE");
        ILTypes.mapIntToEnum.put(ILTypes.DATE.value(), ILTypes.DATE); 
        ILTypes.mapStringToEnum.put(ILTypes.DATE.m_str.toUpperCase(), ILTypes.DATE); 
        ILTypes.GEO = new ILTypes(6, "GEO");
        ILTypes.mapIntToEnum.put(ILTypes.GEO.value(), ILTypes.GEO); 
        ILTypes.mapStringToEnum.put(ILTypes.GEO.m_str.toUpperCase(), ILTypes.GEO); 
        ILTypes.PERSON = new ILTypes(7, "PERSON");
        ILTypes.mapIntToEnum.put(ILTypes.PERSON.value(), ILTypes.PERSON); 
        ILTypes.mapStringToEnum.put(ILTypes.PERSON.m_str.toUpperCase(), ILTypes.PERSON); 
        ILTypes.TYP = new ILTypes(8, "TYP");
        ILTypes.mapIntToEnum.put(ILTypes.TYP.value(), ILTypes.TYP); 
        ILTypes.mapStringToEnum.put(ILTypes.TYP.m_str.toUpperCase(), ILTypes.TYP); 
        ILTypes.VERB = new ILTypes(9, "VERB");
        ILTypes.mapIntToEnum.put(ILTypes.VERB.value(), ILTypes.VERB); 
        ILTypes.mapStringToEnum.put(ILTypes.VERB.m_str.toUpperCase(), ILTypes.VERB); 
        ILTypes.DIRECTIVE = new ILTypes(10, "DIRECTIVE");
        ILTypes.mapIntToEnum.put(ILTypes.DIRECTIVE.value(), ILTypes.DIRECTIVE); 
        ILTypes.mapStringToEnum.put(ILTypes.DIRECTIVE.m_str.toUpperCase(), ILTypes.DIRECTIVE); 
        ILTypes.QUESTION = new ILTypes(11, "QUESTION");
        ILTypes.mapIntToEnum.put(ILTypes.QUESTION.value(), ILTypes.QUESTION); 
        ILTypes.mapStringToEnum.put(ILTypes.QUESTION.m_str.toUpperCase(), ILTypes.QUESTION); 
        ILTypes.m_Values = Array.from(ILTypes.mapIntToEnum.values);
        ILTypes.m_Keys = Array.from(ILTypes.mapIntToEnum.keys);
    }
}


ILTypes.static_constructor();

module.exports = ILTypes