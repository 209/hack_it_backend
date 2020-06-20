/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Тип ссылки
 */
class BookLinkRefType {

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
        if(val instanceof BookLinkRefType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(BookLinkRefType.mapStringToEnum.containsKey(val))
                return BookLinkRefType.mapStringToEnum.get(val);
            return null;
        }
        if(BookLinkRefType.mapIntToEnum.containsKey(val))
            return BookLinkRefType.mapIntToEnum.get(val);
        let it = new BookLinkRefType(val, val.toString());
        BookLinkRefType.mapIntToEnum.put(val, it);
        BookLinkRefType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return BookLinkRefType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return BookLinkRefType.m_Values;
    }
    static static_constructor() {
        BookLinkRefType.mapIntToEnum = new Hashtable();
        BookLinkRefType.mapStringToEnum = new Hashtable();
        BookLinkRefType.UNDEFINED = new BookLinkRefType(0, "UNDEFINED");
        BookLinkRefType.mapIntToEnum.put(BookLinkRefType.UNDEFINED.value(), BookLinkRefType.UNDEFINED); 
        BookLinkRefType.mapStringToEnum.put(BookLinkRefType.UNDEFINED.m_str.toUpperCase(), BookLinkRefType.UNDEFINED); 
        BookLinkRefType.INLINE = new BookLinkRefType(1, "INLINE");
        BookLinkRefType.mapIntToEnum.put(BookLinkRefType.INLINE.value(), BookLinkRefType.INLINE); 
        BookLinkRefType.mapStringToEnum.put(BookLinkRefType.INLINE.m_str.toUpperCase(), BookLinkRefType.INLINE); 
        BookLinkRefType.m_Values = Array.from(BookLinkRefType.mapIntToEnum.values);
        BookLinkRefType.m_Keys = Array.from(BookLinkRefType.mapIntToEnum.keys);
    }
}


BookLinkRefType.static_constructor();

module.exports = BookLinkRefType