/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Классы частей НПА
 */
class InstrumentKind {

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
        if(val instanceof InstrumentKind) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(InstrumentKind.mapStringToEnum.containsKey(val))
                return InstrumentKind.mapStringToEnum.get(val);
            return null;
        }
        if(InstrumentKind.mapIntToEnum.containsKey(val))
            return InstrumentKind.mapIntToEnum.get(val);
        let it = new InstrumentKind(val, val.toString());
        InstrumentKind.mapIntToEnum.put(val, it);
        InstrumentKind.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return InstrumentKind.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return InstrumentKind.m_Values;
    }
    static static_constructor() {
        InstrumentKind.mapIntToEnum = new Hashtable();
        InstrumentKind.mapStringToEnum = new Hashtable();
        InstrumentKind.UNDEFINED = new InstrumentKind(0, "UNDEFINED");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.UNDEFINED.value(), InstrumentKind.UNDEFINED); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.UNDEFINED.m_str.toUpperCase(), InstrumentKind.UNDEFINED); 
        InstrumentKind.DOCUMENT = new InstrumentKind(1, "DOCUMENT");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.DOCUMENT.value(), InstrumentKind.DOCUMENT); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.DOCUMENT.m_str.toUpperCase(), InstrumentKind.DOCUMENT); 
        InstrumentKind.INTERNALDOCUMENT = new InstrumentKind(2, "INTERNALDOCUMENT");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.INTERNALDOCUMENT.value(), InstrumentKind.INTERNALDOCUMENT); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.INTERNALDOCUMENT.m_str.toUpperCase(), InstrumentKind.INTERNALDOCUMENT); 
        InstrumentKind.HEAD = new InstrumentKind(3, "HEAD");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.HEAD.value(), InstrumentKind.HEAD); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.HEAD.m_str.toUpperCase(), InstrumentKind.HEAD); 
        InstrumentKind.CONTENT = new InstrumentKind(4, "CONTENT");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.CONTENT.value(), InstrumentKind.CONTENT); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.CONTENT.m_str.toUpperCase(), InstrumentKind.CONTENT); 
        InstrumentKind.TAIL = new InstrumentKind(5, "TAIL");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.TAIL.value(), InstrumentKind.TAIL); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.TAIL.m_str.toUpperCase(), InstrumentKind.TAIL); 
        InstrumentKind.APPENDIX = new InstrumentKind(6, "APPENDIX");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.APPENDIX.value(), InstrumentKind.APPENDIX); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.APPENDIX.m_str.toUpperCase(), InstrumentKind.APPENDIX); 
        InstrumentKind.DOCPART = new InstrumentKind(7, "DOCPART");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.DOCPART.value(), InstrumentKind.DOCPART); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.DOCPART.m_str.toUpperCase(), InstrumentKind.DOCPART); 
        InstrumentKind.SECTION = new InstrumentKind(8, "SECTION");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.SECTION.value(), InstrumentKind.SECTION); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.SECTION.m_str.toUpperCase(), InstrumentKind.SECTION); 
        InstrumentKind.SUBSECTION = new InstrumentKind(9, "SUBSECTION");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.SUBSECTION.value(), InstrumentKind.SUBSECTION); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.SUBSECTION.m_str.toUpperCase(), InstrumentKind.SUBSECTION); 
        InstrumentKind.CHAPTER = new InstrumentKind(10, "CHAPTER");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.CHAPTER.value(), InstrumentKind.CHAPTER); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.CHAPTER.m_str.toUpperCase(), InstrumentKind.CHAPTER); 
        InstrumentKind.PARAGRAPH = new InstrumentKind(11, "PARAGRAPH");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.PARAGRAPH.value(), InstrumentKind.PARAGRAPH); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.PARAGRAPH.m_str.toUpperCase(), InstrumentKind.PARAGRAPH); 
        InstrumentKind.SUBPARAGRAPH = new InstrumentKind(12, "SUBPARAGRAPH");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.SUBPARAGRAPH.value(), InstrumentKind.SUBPARAGRAPH); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.SUBPARAGRAPH.m_str.toUpperCase(), InstrumentKind.SUBPARAGRAPH); 
        InstrumentKind.CLAUSE = new InstrumentKind(13, "CLAUSE");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.CLAUSE.value(), InstrumentKind.CLAUSE); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.CLAUSE.m_str.toUpperCase(), InstrumentKind.CLAUSE); 
        InstrumentKind.CLAUSEPART = new InstrumentKind(14, "CLAUSEPART");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.CLAUSEPART.value(), InstrumentKind.CLAUSEPART); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.CLAUSEPART.m_str.toUpperCase(), InstrumentKind.CLAUSEPART); 
        InstrumentKind.ITEM = new InstrumentKind(15, "ITEM");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.ITEM.value(), InstrumentKind.ITEM); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.ITEM.m_str.toUpperCase(), InstrumentKind.ITEM); 
        InstrumentKind.SUBITEM = new InstrumentKind(16, "SUBITEM");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.SUBITEM.value(), InstrumentKind.SUBITEM); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.SUBITEM.m_str.toUpperCase(), InstrumentKind.SUBITEM); 
        InstrumentKind.INDENTION = new InstrumentKind(17, "INDENTION");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.INDENTION.value(), InstrumentKind.INDENTION); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.INDENTION.m_str.toUpperCase(), InstrumentKind.INDENTION); 
        InstrumentKind.LISTITEM = new InstrumentKind(18, "LISTITEM");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.LISTITEM.value(), InstrumentKind.LISTITEM); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.LISTITEM.m_str.toUpperCase(), InstrumentKind.LISTITEM); 
        InstrumentKind.LISTHEAD = new InstrumentKind(19, "LISTHEAD");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.LISTHEAD.value(), InstrumentKind.LISTHEAD); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.LISTHEAD.m_str.toUpperCase(), InstrumentKind.LISTHEAD); 
        InstrumentKind.PREAMBLE = new InstrumentKind(20, "PREAMBLE");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.PREAMBLE.value(), InstrumentKind.PREAMBLE); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.PREAMBLE.m_str.toUpperCase(), InstrumentKind.PREAMBLE); 
        InstrumentKind.INDEX = new InstrumentKind(21, "INDEX");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.INDEX.value(), InstrumentKind.INDEX); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.INDEX.m_str.toUpperCase(), InstrumentKind.INDEX); 
        InstrumentKind.INDEXITEM = new InstrumentKind(22, "INDEXITEM");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.INDEXITEM.value(), InstrumentKind.INDEXITEM); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.INDEXITEM.m_str.toUpperCase(), InstrumentKind.INDEXITEM); 
        InstrumentKind.NOTICE = new InstrumentKind(23, "NOTICE");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.NOTICE.value(), InstrumentKind.NOTICE); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.NOTICE.m_str.toUpperCase(), InstrumentKind.NOTICE); 
        InstrumentKind.NUMBER = new InstrumentKind(24, "NUMBER");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.NUMBER.value(), InstrumentKind.NUMBER); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.NUMBER.m_str.toUpperCase(), InstrumentKind.NUMBER); 
        InstrumentKind.CASENUMBER = new InstrumentKind(25, "CASENUMBER");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.CASENUMBER.value(), InstrumentKind.CASENUMBER); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.CASENUMBER.m_str.toUpperCase(), InstrumentKind.CASENUMBER); 
        InstrumentKind.CASEINFO = new InstrumentKind(26, "CASEINFO");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.CASEINFO.value(), InstrumentKind.CASEINFO); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.CASEINFO.m_str.toUpperCase(), InstrumentKind.CASEINFO); 
        InstrumentKind.NAME = new InstrumentKind(27, "NAME");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.NAME.value(), InstrumentKind.NAME); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.NAME.m_str.toUpperCase(), InstrumentKind.NAME); 
        InstrumentKind.TYP = new InstrumentKind(28, "TYP");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.TYP.value(), InstrumentKind.TYP); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.TYP.m_str.toUpperCase(), InstrumentKind.TYP); 
        InstrumentKind.SIGNER = new InstrumentKind(29, "SIGNER");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.SIGNER.value(), InstrumentKind.SIGNER); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.SIGNER.m_str.toUpperCase(), InstrumentKind.SIGNER); 
        InstrumentKind.ORGANIZATION = new InstrumentKind(30, "ORGANIZATION");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.ORGANIZATION.value(), InstrumentKind.ORGANIZATION); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.ORGANIZATION.m_str.toUpperCase(), InstrumentKind.ORGANIZATION); 
        InstrumentKind.PLACE = new InstrumentKind(31, "PLACE");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.PLACE.value(), InstrumentKind.PLACE); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.PLACE.m_str.toUpperCase(), InstrumentKind.PLACE); 
        InstrumentKind.DATE = new InstrumentKind(32, "DATE");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.DATE.value(), InstrumentKind.DATE); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.DATE.m_str.toUpperCase(), InstrumentKind.DATE); 
        InstrumentKind.CONTACT = new InstrumentKind(33, "CONTACT");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.CONTACT.value(), InstrumentKind.CONTACT); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.CONTACT.m_str.toUpperCase(), InstrumentKind.CONTACT); 
        InstrumentKind.INITIATOR = new InstrumentKind(34, "INITIATOR");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.INITIATOR.value(), InstrumentKind.INITIATOR); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.INITIATOR.m_str.toUpperCase(), InstrumentKind.INITIATOR); 
        InstrumentKind.DIRECTIVE = new InstrumentKind(35, "DIRECTIVE");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.DIRECTIVE.value(), InstrumentKind.DIRECTIVE); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.DIRECTIVE.m_str.toUpperCase(), InstrumentKind.DIRECTIVE); 
        InstrumentKind.EDITIONS = new InstrumentKind(36, "EDITIONS");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.EDITIONS.value(), InstrumentKind.EDITIONS); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.EDITIONS.m_str.toUpperCase(), InstrumentKind.EDITIONS); 
        InstrumentKind.APPROVED = new InstrumentKind(37, "APPROVED");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.APPROVED.value(), InstrumentKind.APPROVED); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.APPROVED.m_str.toUpperCase(), InstrumentKind.APPROVED); 
        InstrumentKind.DOCREFERENCE = new InstrumentKind(38, "DOCREFERENCE");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.DOCREFERENCE.value(), InstrumentKind.DOCREFERENCE); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.DOCREFERENCE.m_str.toUpperCase(), InstrumentKind.DOCREFERENCE); 
        InstrumentKind.KEYWORD = new InstrumentKind(39, "KEYWORD");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.KEYWORD.value(), InstrumentKind.KEYWORD); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.KEYWORD.m_str.toUpperCase(), InstrumentKind.KEYWORD); 
        InstrumentKind.COMMENT = new InstrumentKind(40, "COMMENT");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.COMMENT.value(), InstrumentKind.COMMENT); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.COMMENT.m_str.toUpperCase(), InstrumentKind.COMMENT); 
        InstrumentKind.CITATION = new InstrumentKind(41, "CITATION");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.CITATION.value(), InstrumentKind.CITATION); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.CITATION.m_str.toUpperCase(), InstrumentKind.CITATION); 
        InstrumentKind.QUESTION = new InstrumentKind(42, "QUESTION");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.QUESTION.value(), InstrumentKind.QUESTION); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.QUESTION.m_str.toUpperCase(), InstrumentKind.QUESTION); 
        InstrumentKind.ANSWER = new InstrumentKind(43, "ANSWER");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.ANSWER.value(), InstrumentKind.ANSWER); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.ANSWER.m_str.toUpperCase(), InstrumentKind.ANSWER); 
        InstrumentKind.TABLE = new InstrumentKind(44, "TABLE");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.TABLE.value(), InstrumentKind.TABLE); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.TABLE.m_str.toUpperCase(), InstrumentKind.TABLE); 
        InstrumentKind.TABLEROW = new InstrumentKind(45, "TABLEROW");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.TABLEROW.value(), InstrumentKind.TABLEROW); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.TABLEROW.m_str.toUpperCase(), InstrumentKind.TABLEROW); 
        InstrumentKind.TABLECELL = new InstrumentKind(46, "TABLECELL");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.TABLECELL.value(), InstrumentKind.TABLECELL); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.TABLECELL.m_str.toUpperCase(), InstrumentKind.TABLECELL); 
        InstrumentKind.IGNORED = new InstrumentKind(47, "IGNORED");
        InstrumentKind.mapIntToEnum.put(InstrumentKind.IGNORED.value(), InstrumentKind.IGNORED); 
        InstrumentKind.mapStringToEnum.put(InstrumentKind.IGNORED.m_str.toUpperCase(), InstrumentKind.IGNORED); 
        InstrumentKind.m_Values = Array.from(InstrumentKind.mapIntToEnum.values);
        InstrumentKind.m_Keys = Array.from(InstrumentKind.mapIntToEnum.keys);
    }
}


InstrumentKind.static_constructor();

module.exports = InstrumentKind