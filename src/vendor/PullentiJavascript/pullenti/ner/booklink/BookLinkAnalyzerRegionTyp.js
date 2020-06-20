/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

class BookLinkAnalyzerRegionTyp {

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
        if(val instanceof BookLinkAnalyzerRegionTyp) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(BookLinkAnalyzerRegionTyp.mapStringToEnum.containsKey(val))
                return BookLinkAnalyzerRegionTyp.mapStringToEnum.get(val);
            return null;
        }
        if(BookLinkAnalyzerRegionTyp.mapIntToEnum.containsKey(val))
            return BookLinkAnalyzerRegionTyp.mapIntToEnum.get(val);
        let it = new BookLinkAnalyzerRegionTyp(val, val.toString());
        BookLinkAnalyzerRegionTyp.mapIntToEnum.put(val, it);
        BookLinkAnalyzerRegionTyp.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return BookLinkAnalyzerRegionTyp.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return BookLinkAnalyzerRegionTyp.m_Values;
    }
    static static_constructor() {
        BookLinkAnalyzerRegionTyp.mapIntToEnum = new Hashtable();
        BookLinkAnalyzerRegionTyp.mapStringToEnum = new Hashtable();
        BookLinkAnalyzerRegionTyp.UNDEFINED = new BookLinkAnalyzerRegionTyp(0, "UNDEFINED");
        BookLinkAnalyzerRegionTyp.mapIntToEnum.put(BookLinkAnalyzerRegionTyp.UNDEFINED.value(), BookLinkAnalyzerRegionTyp.UNDEFINED); 
        BookLinkAnalyzerRegionTyp.mapStringToEnum.put(BookLinkAnalyzerRegionTyp.UNDEFINED.m_str.toUpperCase(), BookLinkAnalyzerRegionTyp.UNDEFINED); 
        BookLinkAnalyzerRegionTyp.AUTHORS = new BookLinkAnalyzerRegionTyp(1, "AUTHORS");
        BookLinkAnalyzerRegionTyp.mapIntToEnum.put(BookLinkAnalyzerRegionTyp.AUTHORS.value(), BookLinkAnalyzerRegionTyp.AUTHORS); 
        BookLinkAnalyzerRegionTyp.mapStringToEnum.put(BookLinkAnalyzerRegionTyp.AUTHORS.m_str.toUpperCase(), BookLinkAnalyzerRegionTyp.AUTHORS); 
        BookLinkAnalyzerRegionTyp.NAME = new BookLinkAnalyzerRegionTyp(2, "NAME");
        BookLinkAnalyzerRegionTyp.mapIntToEnum.put(BookLinkAnalyzerRegionTyp.NAME.value(), BookLinkAnalyzerRegionTyp.NAME); 
        BookLinkAnalyzerRegionTyp.mapStringToEnum.put(BookLinkAnalyzerRegionTyp.NAME.m_str.toUpperCase(), BookLinkAnalyzerRegionTyp.NAME); 
        BookLinkAnalyzerRegionTyp.FIRST = new BookLinkAnalyzerRegionTyp(3, "FIRST");
        BookLinkAnalyzerRegionTyp.mapIntToEnum.put(BookLinkAnalyzerRegionTyp.FIRST.value(), BookLinkAnalyzerRegionTyp.FIRST); 
        BookLinkAnalyzerRegionTyp.mapStringToEnum.put(BookLinkAnalyzerRegionTyp.FIRST.m_str.toUpperCase(), BookLinkAnalyzerRegionTyp.FIRST); 
        BookLinkAnalyzerRegionTyp.SECOND = new BookLinkAnalyzerRegionTyp(4, "SECOND");
        BookLinkAnalyzerRegionTyp.mapIntToEnum.put(BookLinkAnalyzerRegionTyp.SECOND.value(), BookLinkAnalyzerRegionTyp.SECOND); 
        BookLinkAnalyzerRegionTyp.mapStringToEnum.put(BookLinkAnalyzerRegionTyp.SECOND.m_str.toUpperCase(), BookLinkAnalyzerRegionTyp.SECOND); 
        BookLinkAnalyzerRegionTyp.m_Values = Array.from(BookLinkAnalyzerRegionTyp.mapIntToEnum.values);
        BookLinkAnalyzerRegionTyp.m_Keys = Array.from(BookLinkAnalyzerRegionTyp.mapIntToEnum.keys);
    }
}


BookLinkAnalyzerRegionTyp.static_constructor();

module.exports = BookLinkAnalyzerRegionTyp