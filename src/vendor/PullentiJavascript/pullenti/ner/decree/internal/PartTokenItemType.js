/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class PartTokenItemType {

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
        if(val instanceof PartTokenItemType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(PartTokenItemType.mapStringToEnum.containsKey(val))
                return PartTokenItemType.mapStringToEnum.get(val);
            return null;
        }
        if(PartTokenItemType.mapIntToEnum.containsKey(val))
            return PartTokenItemType.mapIntToEnum.get(val);
        let it = new PartTokenItemType(val, val.toString());
        PartTokenItemType.mapIntToEnum.put(val, it);
        PartTokenItemType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return PartTokenItemType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return PartTokenItemType.m_Values;
    }
    static static_constructor() {
        PartTokenItemType.mapIntToEnum = new Hashtable();
        PartTokenItemType.mapStringToEnum = new Hashtable();
        PartTokenItemType.UNDEFINED = new PartTokenItemType(0, "UNDEFINED");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.UNDEFINED.value(), PartTokenItemType.UNDEFINED); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.UNDEFINED.m_str.toUpperCase(), PartTokenItemType.UNDEFINED); 
        PartTokenItemType.PREFIX = new PartTokenItemType(1, "PREFIX");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.PREFIX.value(), PartTokenItemType.PREFIX); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.PREFIX.m_str.toUpperCase(), PartTokenItemType.PREFIX); 
        PartTokenItemType.APPENDIX = new PartTokenItemType(2, "APPENDIX");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.APPENDIX.value(), PartTokenItemType.APPENDIX); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.APPENDIX.m_str.toUpperCase(), PartTokenItemType.APPENDIX); 
        PartTokenItemType.DOCPART = new PartTokenItemType(3, "DOCPART");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.DOCPART.value(), PartTokenItemType.DOCPART); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.DOCPART.m_str.toUpperCase(), PartTokenItemType.DOCPART); 
        PartTokenItemType.PART = new PartTokenItemType(4, "PART");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.PART.value(), PartTokenItemType.PART); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.PART.m_str.toUpperCase(), PartTokenItemType.PART); 
        PartTokenItemType.SECTION = new PartTokenItemType(5, "SECTION");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.SECTION.value(), PartTokenItemType.SECTION); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.SECTION.m_str.toUpperCase(), PartTokenItemType.SECTION); 
        PartTokenItemType.SUBSECTION = new PartTokenItemType(6, "SUBSECTION");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.SUBSECTION.value(), PartTokenItemType.SUBSECTION); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.SUBSECTION.m_str.toUpperCase(), PartTokenItemType.SUBSECTION); 
        PartTokenItemType.CHAPTER = new PartTokenItemType(7, "CHAPTER");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.CHAPTER.value(), PartTokenItemType.CHAPTER); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.CHAPTER.m_str.toUpperCase(), PartTokenItemType.CHAPTER); 
        PartTokenItemType.CLAUSE = new PartTokenItemType(8, "CLAUSE");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.CLAUSE.value(), PartTokenItemType.CLAUSE); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.CLAUSE.m_str.toUpperCase(), PartTokenItemType.CLAUSE); 
        PartTokenItemType.PARAGRAPH = new PartTokenItemType(9, "PARAGRAPH");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.PARAGRAPH.value(), PartTokenItemType.PARAGRAPH); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.PARAGRAPH.m_str.toUpperCase(), PartTokenItemType.PARAGRAPH); 
        PartTokenItemType.SUBPARAGRAPH = new PartTokenItemType(10, "SUBPARAGRAPH");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.SUBPARAGRAPH.value(), PartTokenItemType.SUBPARAGRAPH); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.SUBPARAGRAPH.m_str.toUpperCase(), PartTokenItemType.SUBPARAGRAPH); 
        PartTokenItemType.ITEM = new PartTokenItemType(11, "ITEM");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.ITEM.value(), PartTokenItemType.ITEM); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.ITEM.m_str.toUpperCase(), PartTokenItemType.ITEM); 
        PartTokenItemType.SUBITEM = new PartTokenItemType(12, "SUBITEM");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.SUBITEM.value(), PartTokenItemType.SUBITEM); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.SUBITEM.m_str.toUpperCase(), PartTokenItemType.SUBITEM); 
        PartTokenItemType.INDENTION = new PartTokenItemType(13, "INDENTION");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.INDENTION.value(), PartTokenItemType.INDENTION); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.INDENTION.m_str.toUpperCase(), PartTokenItemType.INDENTION); 
        PartTokenItemType.SUBINDENTION = new PartTokenItemType(14, "SUBINDENTION");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.SUBINDENTION.value(), PartTokenItemType.SUBINDENTION); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.SUBINDENTION.m_str.toUpperCase(), PartTokenItemType.SUBINDENTION); 
        PartTokenItemType.PREAMBLE = new PartTokenItemType(15, "PREAMBLE");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.PREAMBLE.value(), PartTokenItemType.PREAMBLE); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.PREAMBLE.m_str.toUpperCase(), PartTokenItemType.PREAMBLE); 
        PartTokenItemType.NOTICE = new PartTokenItemType(16, "NOTICE");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.NOTICE.value(), PartTokenItemType.NOTICE); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.NOTICE.m_str.toUpperCase(), PartTokenItemType.NOTICE); 
        PartTokenItemType.SUBPROGRAM = new PartTokenItemType(17, "SUBPROGRAM");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.SUBPROGRAM.value(), PartTokenItemType.SUBPROGRAM); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.SUBPROGRAM.m_str.toUpperCase(), PartTokenItemType.SUBPROGRAM); 
        PartTokenItemType.PAGE = new PartTokenItemType(18, "PAGE");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.PAGE.value(), PartTokenItemType.PAGE); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.PAGE.m_str.toUpperCase(), PartTokenItemType.PAGE); 
        PartTokenItemType.ADDAGREE = new PartTokenItemType(19, "ADDAGREE");
        PartTokenItemType.mapIntToEnum.put(PartTokenItemType.ADDAGREE.value(), PartTokenItemType.ADDAGREE); 
        PartTokenItemType.mapStringToEnum.put(PartTokenItemType.ADDAGREE.m_str.toUpperCase(), PartTokenItemType.ADDAGREE); 
        PartTokenItemType.m_Values = Array.from(PartTokenItemType.mapIntToEnum.values);
        PartTokenItemType.m_Keys = Array.from(PartTokenItemType.mapIntToEnum.keys);
    }
}


PartTokenItemType.static_constructor();

module.exports = PartTokenItemType