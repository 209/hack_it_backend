/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class ResumeTokenType {

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
        if(val instanceof ResumeTokenType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(ResumeTokenType.mapStringToEnum.containsKey(val))
                return ResumeTokenType.mapStringToEnum.get(val);
            return null;
        }
        if(ResumeTokenType.mapIntToEnum.containsKey(val))
            return ResumeTokenType.mapIntToEnum.get(val);
        let it = new ResumeTokenType(val, val.toString());
        ResumeTokenType.mapIntToEnum.put(val, it);
        ResumeTokenType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return ResumeTokenType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return ResumeTokenType.m_Values;
    }
    static static_constructor() {
        ResumeTokenType.mapIntToEnum = new Hashtable();
        ResumeTokenType.mapStringToEnum = new Hashtable();
        ResumeTokenType.UNDEFINED = new ResumeTokenType(0, "UNDEFINED");
        ResumeTokenType.mapIntToEnum.put(ResumeTokenType.UNDEFINED.value(), ResumeTokenType.UNDEFINED); 
        ResumeTokenType.mapStringToEnum.put(ResumeTokenType.UNDEFINED.m_str.toUpperCase(), ResumeTokenType.UNDEFINED); 
        ResumeTokenType.STUDY = new ResumeTokenType(1, "STUDY");
        ResumeTokenType.mapIntToEnum.put(ResumeTokenType.STUDY.value(), ResumeTokenType.STUDY); 
        ResumeTokenType.mapStringToEnum.put(ResumeTokenType.STUDY.m_str.toUpperCase(), ResumeTokenType.STUDY); 
        ResumeTokenType.JOB = new ResumeTokenType(2, "JOB");
        ResumeTokenType.mapIntToEnum.put(ResumeTokenType.JOB.value(), ResumeTokenType.JOB); 
        ResumeTokenType.mapStringToEnum.put(ResumeTokenType.JOB.m_str.toUpperCase(), ResumeTokenType.JOB); 
        ResumeTokenType.m_Values = Array.from(ResumeTokenType.mapIntToEnum.values);
        ResumeTokenType.m_Keys = Array.from(ResumeTokenType.mapIntToEnum.keys);
    }
}


ResumeTokenType.static_constructor();

module.exports = ResumeTokenType