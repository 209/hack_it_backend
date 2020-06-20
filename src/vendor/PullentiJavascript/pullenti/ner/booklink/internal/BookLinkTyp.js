/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class BookLinkTyp {

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
        if(val instanceof BookLinkTyp) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(BookLinkTyp.mapStringToEnum.containsKey(val))
                return BookLinkTyp.mapStringToEnum.get(val);
            return null;
        }
        if(BookLinkTyp.mapIntToEnum.containsKey(val))
            return BookLinkTyp.mapIntToEnum.get(val);
        let it = new BookLinkTyp(val, val.toString());
        BookLinkTyp.mapIntToEnum.put(val, it);
        BookLinkTyp.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return BookLinkTyp.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return BookLinkTyp.m_Values;
    }
    static static_constructor() {
        BookLinkTyp.mapIntToEnum = new Hashtable();
        BookLinkTyp.mapStringToEnum = new Hashtable();
        BookLinkTyp.UNDEFINED = new BookLinkTyp(0, "UNDEFINED");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.UNDEFINED.value(), BookLinkTyp.UNDEFINED); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.UNDEFINED.m_str.toUpperCase(), BookLinkTyp.UNDEFINED); 
        BookLinkTyp.NUMBER = new BookLinkTyp(1, "NUMBER");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.NUMBER.value(), BookLinkTyp.NUMBER); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.NUMBER.m_str.toUpperCase(), BookLinkTyp.NUMBER); 
        BookLinkTyp.PERSON = new BookLinkTyp(2, "PERSON");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.PERSON.value(), BookLinkTyp.PERSON); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.PERSON.m_str.toUpperCase(), BookLinkTyp.PERSON); 
        BookLinkTyp.EDITORS = new BookLinkTyp(3, "EDITORS");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.EDITORS.value(), BookLinkTyp.EDITORS); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.EDITORS.m_str.toUpperCase(), BookLinkTyp.EDITORS); 
        BookLinkTyp.SOSTAVITEL = new BookLinkTyp(4, "SOSTAVITEL");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.SOSTAVITEL.value(), BookLinkTyp.SOSTAVITEL); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.SOSTAVITEL.m_str.toUpperCase(), BookLinkTyp.SOSTAVITEL); 
        BookLinkTyp.NAME = new BookLinkTyp(5, "NAME");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.NAME.value(), BookLinkTyp.NAME); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.NAME.m_str.toUpperCase(), BookLinkTyp.NAME); 
        BookLinkTyp.NAMETAIL = new BookLinkTyp(6, "NAMETAIL");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.NAMETAIL.value(), BookLinkTyp.NAMETAIL); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.NAMETAIL.m_str.toUpperCase(), BookLinkTyp.NAMETAIL); 
        BookLinkTyp.DELIMETER = new BookLinkTyp(7, "DELIMETER");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.DELIMETER.value(), BookLinkTyp.DELIMETER); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.DELIMETER.m_str.toUpperCase(), BookLinkTyp.DELIMETER); 
        BookLinkTyp.TYPE = new BookLinkTyp(8, "TYPE");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.TYPE.value(), BookLinkTyp.TYPE); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.TYPE.m_str.toUpperCase(), BookLinkTyp.TYPE); 
        BookLinkTyp.YEAR = new BookLinkTyp(9, "YEAR");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.YEAR.value(), BookLinkTyp.YEAR); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.YEAR.m_str.toUpperCase(), BookLinkTyp.YEAR); 
        BookLinkTyp.PAGES = new BookLinkTyp(10, "PAGES");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.PAGES.value(), BookLinkTyp.PAGES); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.PAGES.m_str.toUpperCase(), BookLinkTyp.PAGES); 
        BookLinkTyp.PAGERANGE = new BookLinkTyp(11, "PAGERANGE");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.PAGERANGE.value(), BookLinkTyp.PAGERANGE); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.PAGERANGE.m_str.toUpperCase(), BookLinkTyp.PAGERANGE); 
        BookLinkTyp.GEO = new BookLinkTyp(12, "GEO");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.GEO.value(), BookLinkTyp.GEO); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.GEO.m_str.toUpperCase(), BookLinkTyp.GEO); 
        BookLinkTyp.MISC = new BookLinkTyp(13, "MISC");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.MISC.value(), BookLinkTyp.MISC); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.MISC.m_str.toUpperCase(), BookLinkTyp.MISC); 
        BookLinkTyp.ANDOTHERS = new BookLinkTyp(14, "ANDOTHERS");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.ANDOTHERS.value(), BookLinkTyp.ANDOTHERS); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.ANDOTHERS.m_str.toUpperCase(), BookLinkTyp.ANDOTHERS); 
        BookLinkTyp.TRANSLATE = new BookLinkTyp(15, "TRANSLATE");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.TRANSLATE.value(), BookLinkTyp.TRANSLATE); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.TRANSLATE.m_str.toUpperCase(), BookLinkTyp.TRANSLATE); 
        BookLinkTyp.PRESS = new BookLinkTyp(16, "PRESS");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.PRESS.value(), BookLinkTyp.PRESS); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.PRESS.m_str.toUpperCase(), BookLinkTyp.PRESS); 
        BookLinkTyp.N = new BookLinkTyp(17, "N");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.N.value(), BookLinkTyp.N); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.N.m_str.toUpperCase(), BookLinkTyp.N); 
        BookLinkTyp.VOLUME = new BookLinkTyp(18, "VOLUME");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.VOLUME.value(), BookLinkTyp.VOLUME); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.VOLUME.m_str.toUpperCase(), BookLinkTyp.VOLUME); 
        BookLinkTyp.ELECTRONRES = new BookLinkTyp(19, "ELECTRONRES");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.ELECTRONRES.value(), BookLinkTyp.ELECTRONRES); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.ELECTRONRES.m_str.toUpperCase(), BookLinkTyp.ELECTRONRES); 
        BookLinkTyp.URL = new BookLinkTyp(20, "URL");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.URL.value(), BookLinkTyp.URL); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.URL.m_str.toUpperCase(), BookLinkTyp.URL); 
        BookLinkTyp.SEE = new BookLinkTyp(21, "SEE");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.SEE.value(), BookLinkTyp.SEE); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.SEE.m_str.toUpperCase(), BookLinkTyp.SEE); 
        BookLinkTyp.TAMZE = new BookLinkTyp(22, "TAMZE");
        BookLinkTyp.mapIntToEnum.put(BookLinkTyp.TAMZE.value(), BookLinkTyp.TAMZE); 
        BookLinkTyp.mapStringToEnum.put(BookLinkTyp.TAMZE.m_str.toUpperCase(), BookLinkTyp.TAMZE); 
        BookLinkTyp.m_Values = Array.from(BookLinkTyp.mapIntToEnum.values);
        BookLinkTyp.m_Keys = Array.from(BookLinkTyp.mapIntToEnum.keys);
    }
}


BookLinkTyp.static_constructor();

module.exports = BookLinkTyp