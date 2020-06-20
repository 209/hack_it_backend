/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class TitleItemTokenTypes {

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
        if(val instanceof TitleItemTokenTypes) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(TitleItemTokenTypes.mapStringToEnum.containsKey(val))
                return TitleItemTokenTypes.mapStringToEnum.get(val);
            return null;
        }
        if(TitleItemTokenTypes.mapIntToEnum.containsKey(val))
            return TitleItemTokenTypes.mapIntToEnum.get(val);
        let it = new TitleItemTokenTypes(val, val.toString());
        TitleItemTokenTypes.mapIntToEnum.put(val, it);
        TitleItemTokenTypes.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return TitleItemTokenTypes.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return TitleItemTokenTypes.m_Values;
    }
    static static_constructor() {
        TitleItemTokenTypes.mapIntToEnum = new Hashtable();
        TitleItemTokenTypes.mapStringToEnum = new Hashtable();
        TitleItemTokenTypes.UNDEFINED = new TitleItemTokenTypes(0, "UNDEFINED");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.UNDEFINED.value(), TitleItemTokenTypes.UNDEFINED); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.UNDEFINED.m_str.toUpperCase(), TitleItemTokenTypes.UNDEFINED); 
        TitleItemTokenTypes.TYP = new TitleItemTokenTypes(1, "TYP");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.TYP.value(), TitleItemTokenTypes.TYP); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.TYP.m_str.toUpperCase(), TitleItemTokenTypes.TYP); 
        TitleItemTokenTypes.THEME = new TitleItemTokenTypes(2, "THEME");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.THEME.value(), TitleItemTokenTypes.THEME); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.THEME.m_str.toUpperCase(), TitleItemTokenTypes.THEME); 
        TitleItemTokenTypes.TYPANDTHEME = new TitleItemTokenTypes(3, "TYPANDTHEME");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.TYPANDTHEME.value(), TitleItemTokenTypes.TYPANDTHEME); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.TYPANDTHEME.m_str.toUpperCase(), TitleItemTokenTypes.TYPANDTHEME); 
        TitleItemTokenTypes.BOSS = new TitleItemTokenTypes(4, "BOSS");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.BOSS.value(), TitleItemTokenTypes.BOSS); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.BOSS.m_str.toUpperCase(), TitleItemTokenTypes.BOSS); 
        TitleItemTokenTypes.WORKER = new TitleItemTokenTypes(5, "WORKER");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.WORKER.value(), TitleItemTokenTypes.WORKER); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.WORKER.m_str.toUpperCase(), TitleItemTokenTypes.WORKER); 
        TitleItemTokenTypes.EDITOR = new TitleItemTokenTypes(6, "EDITOR");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.EDITOR.value(), TitleItemTokenTypes.EDITOR); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.EDITOR.m_str.toUpperCase(), TitleItemTokenTypes.EDITOR); 
        TitleItemTokenTypes.CONSULTANT = new TitleItemTokenTypes(7, "CONSULTANT");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.CONSULTANT.value(), TitleItemTokenTypes.CONSULTANT); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.CONSULTANT.m_str.toUpperCase(), TitleItemTokenTypes.CONSULTANT); 
        TitleItemTokenTypes.OPPONENT = new TitleItemTokenTypes(8, "OPPONENT");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.OPPONENT.value(), TitleItemTokenTypes.OPPONENT); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.OPPONENT.m_str.toUpperCase(), TitleItemTokenTypes.OPPONENT); 
        TitleItemTokenTypes.OTHERROLE = new TitleItemTokenTypes(9, "OTHERROLE");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.OTHERROLE.value(), TitleItemTokenTypes.OTHERROLE); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.OTHERROLE.m_str.toUpperCase(), TitleItemTokenTypes.OTHERROLE); 
        TitleItemTokenTypes.TRANSLATE = new TitleItemTokenTypes(10, "TRANSLATE");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.TRANSLATE.value(), TitleItemTokenTypes.TRANSLATE); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.TRANSLATE.m_str.toUpperCase(), TitleItemTokenTypes.TRANSLATE); 
        TitleItemTokenTypes.ADOPT = new TitleItemTokenTypes(11, "ADOPT");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.ADOPT.value(), TitleItemTokenTypes.ADOPT); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.ADOPT.m_str.toUpperCase(), TitleItemTokenTypes.ADOPT); 
        TitleItemTokenTypes.DUST = new TitleItemTokenTypes(12, "DUST");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.DUST.value(), TitleItemTokenTypes.DUST); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.DUST.m_str.toUpperCase(), TitleItemTokenTypes.DUST); 
        TitleItemTokenTypes.SPECIALITY = new TitleItemTokenTypes(13, "SPECIALITY");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.SPECIALITY.value(), TitleItemTokenTypes.SPECIALITY); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.SPECIALITY.m_str.toUpperCase(), TitleItemTokenTypes.SPECIALITY); 
        TitleItemTokenTypes.KEYWORDS = new TitleItemTokenTypes(14, "KEYWORDS");
        TitleItemTokenTypes.mapIntToEnum.put(TitleItemTokenTypes.KEYWORDS.value(), TitleItemTokenTypes.KEYWORDS); 
        TitleItemTokenTypes.mapStringToEnum.put(TitleItemTokenTypes.KEYWORDS.m_str.toUpperCase(), TitleItemTokenTypes.KEYWORDS); 
        TitleItemTokenTypes.m_Values = Array.from(TitleItemTokenTypes.mapIntToEnum.values);
        TitleItemTokenTypes.m_Keys = Array.from(TitleItemTokenTypes.mapIntToEnum.keys);
    }
}


TitleItemTokenTypes.static_constructor();

module.exports = TitleItemTokenTypes