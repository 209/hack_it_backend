/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class InstrToken1Types {

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
        if(val instanceof InstrToken1Types) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(InstrToken1Types.mapStringToEnum.containsKey(val))
                return InstrToken1Types.mapStringToEnum.get(val);
            return null;
        }
        if(InstrToken1Types.mapIntToEnum.containsKey(val))
            return InstrToken1Types.mapIntToEnum.get(val);
        let it = new InstrToken1Types(val, val.toString());
        InstrToken1Types.mapIntToEnum.put(val, it);
        InstrToken1Types.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return InstrToken1Types.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return InstrToken1Types.m_Values;
    }
    static static_constructor() {
        InstrToken1Types.mapIntToEnum = new Hashtable();
        InstrToken1Types.mapStringToEnum = new Hashtable();
        InstrToken1Types.LINE = new InstrToken1Types(0, "LINE");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.LINE.value(), InstrToken1Types.LINE); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.LINE.m_str.toUpperCase(), InstrToken1Types.LINE); 
        InstrToken1Types.FIRSTLINE = new InstrToken1Types(1, "FIRSTLINE");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.FIRSTLINE.value(), InstrToken1Types.FIRSTLINE); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.FIRSTLINE.m_str.toUpperCase(), InstrToken1Types.FIRSTLINE); 
        InstrToken1Types.SIGNS = new InstrToken1Types(2, "SIGNS");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.SIGNS.value(), InstrToken1Types.SIGNS); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.SIGNS.m_str.toUpperCase(), InstrToken1Types.SIGNS); 
        InstrToken1Types.APPENDIX = new InstrToken1Types(3, "APPENDIX");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.APPENDIX.value(), InstrToken1Types.APPENDIX); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.APPENDIX.m_str.toUpperCase(), InstrToken1Types.APPENDIX); 
        InstrToken1Types.APPROVED = new InstrToken1Types(4, "APPROVED");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.APPROVED.value(), InstrToken1Types.APPROVED); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.APPROVED.m_str.toUpperCase(), InstrToken1Types.APPROVED); 
        InstrToken1Types.BASE = new InstrToken1Types(5, "BASE");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.BASE.value(), InstrToken1Types.BASE); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.BASE.m_str.toUpperCase(), InstrToken1Types.BASE); 
        InstrToken1Types.INDEX = new InstrToken1Types(6, "INDEX");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.INDEX.value(), InstrToken1Types.INDEX); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.INDEX.m_str.toUpperCase(), InstrToken1Types.INDEX); 
        InstrToken1Types.TITLE = new InstrToken1Types(7, "TITLE");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.TITLE.value(), InstrToken1Types.TITLE); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.TITLE.m_str.toUpperCase(), InstrToken1Types.TITLE); 
        InstrToken1Types.DIRECTIVE = new InstrToken1Types(8, "DIRECTIVE");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.DIRECTIVE.value(), InstrToken1Types.DIRECTIVE); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.DIRECTIVE.m_str.toUpperCase(), InstrToken1Types.DIRECTIVE); 
        InstrToken1Types.CHAPTER = new InstrToken1Types(9, "CHAPTER");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.CHAPTER.value(), InstrToken1Types.CHAPTER); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.CHAPTER.m_str.toUpperCase(), InstrToken1Types.CHAPTER); 
        InstrToken1Types.CLAUSE = new InstrToken1Types(10, "CLAUSE");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.CLAUSE.value(), InstrToken1Types.CLAUSE); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.CLAUSE.m_str.toUpperCase(), InstrToken1Types.CLAUSE); 
        InstrToken1Types.DOCPART = new InstrToken1Types(11, "DOCPART");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.DOCPART.value(), InstrToken1Types.DOCPART); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.DOCPART.m_str.toUpperCase(), InstrToken1Types.DOCPART); 
        InstrToken1Types.SECTION = new InstrToken1Types(12, "SECTION");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.SECTION.value(), InstrToken1Types.SECTION); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.SECTION.m_str.toUpperCase(), InstrToken1Types.SECTION); 
        InstrToken1Types.SUBSECTION = new InstrToken1Types(13, "SUBSECTION");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.SUBSECTION.value(), InstrToken1Types.SUBSECTION); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.SUBSECTION.m_str.toUpperCase(), InstrToken1Types.SUBSECTION); 
        InstrToken1Types.PARAGRAPH = new InstrToken1Types(14, "PARAGRAPH");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.PARAGRAPH.value(), InstrToken1Types.PARAGRAPH); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.PARAGRAPH.m_str.toUpperCase(), InstrToken1Types.PARAGRAPH); 
        InstrToken1Types.SUBPARAGRAPH = new InstrToken1Types(15, "SUBPARAGRAPH");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.SUBPARAGRAPH.value(), InstrToken1Types.SUBPARAGRAPH); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.SUBPARAGRAPH.m_str.toUpperCase(), InstrToken1Types.SUBPARAGRAPH); 
        InstrToken1Types.CLAUSEPART = new InstrToken1Types(16, "CLAUSEPART");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.CLAUSEPART.value(), InstrToken1Types.CLAUSEPART); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.CLAUSEPART.m_str.toUpperCase(), InstrToken1Types.CLAUSEPART); 
        InstrToken1Types.EDITIONS = new InstrToken1Types(17, "EDITIONS");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.EDITIONS.value(), InstrToken1Types.EDITIONS); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.EDITIONS.m_str.toUpperCase(), InstrToken1Types.EDITIONS); 
        InstrToken1Types.COMMENT = new InstrToken1Types(18, "COMMENT");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.COMMENT.value(), InstrToken1Types.COMMENT); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.COMMENT.m_str.toUpperCase(), InstrToken1Types.COMMENT); 
        InstrToken1Types.NOTICE = new InstrToken1Types(19, "NOTICE");
        InstrToken1Types.mapIntToEnum.put(InstrToken1Types.NOTICE.value(), InstrToken1Types.NOTICE); 
        InstrToken1Types.mapStringToEnum.put(InstrToken1Types.NOTICE.m_str.toUpperCase(), InstrToken1Types.NOTICE); 
        InstrToken1Types.m_Values = Array.from(InstrToken1Types.mapIntToEnum.values);
        InstrToken1Types.m_Keys = Array.from(InstrToken1Types.mapIntToEnum.keys);
    }
}


InstrToken1Types.static_constructor();

module.exports = InstrToken1Types