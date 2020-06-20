/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const NounPhraseParseAttr = require("./../../ner/core/NounPhraseParseAttr");
const TerminCollection = require("./../../ner/core/TerminCollection");
const MetaToken = require("./../../ner/MetaToken");
const TextToken = require("./../../ner/TextToken");
const DelimType = require("./DelimType");
const TerminParseAttr = require("./../../ner/core/TerminParseAttr");
const Termin = require("./../../ner/core/Termin");
const NounPhraseHelper = require("./../../ner/core/NounPhraseHelper");

class DelimToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = DelimType.UNDEFINED;
        this.doublt = false;
    }
    
    toString() {
        return (String(this.typ) + (this.doublt ? "?" : "") + ": " + super.toString());
    }
    
    static try_parse(t) {
        if (!((t instanceof TextToken))) 
            return null;
        if (t.is_comma_and) {
            let res0 = DelimToken.try_parse(t.next);
            if (res0 !== null) {
                res0.begin_token = t;
                return res0;
            }
            return null;
        }
        let tok = DelimToken.m_onto.try_parse(t, TerminParseAttr.NO);
        if (tok !== null) {
            let res = new DelimToken(t, tok.end_token);
            res.typ = DelimType.of(tok.termin.tag);
            res.doublt = tok.termin.tag2 !== null;
            let res2 = DelimToken.try_parse(res.end_token.next);
            if (res2 !== null) {
                if (res2.typ === res.typ) {
                    res.end_token = res2.end_token;
                    res.doublt = false;
                }
            }
            if (t.morph.class0.is_pronoun) {
                let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSEADVERBS, 0, null);
                if (npt !== null && npt.end_char > res.end_char) 
                    return null;
            }
            return res;
        }
        return null;
    }
    
    static initialize() {
        DelimToken.m_onto = new TerminCollection();
        let t = null;
        t = Termin._new119("НО", DelimType.BUT);
        t.add_variant("А", false);
        t.add_variant("ОДНАКО", false);
        t.add_variant("ХОТЯ", false);
        DelimToken.m_onto.add(t);
        t = Termin._new119("ЕСЛИ", DelimType.IF);
        t.add_variant("В СЛУЧАЕ ЕСЛИ", false);
        DelimToken.m_onto.add(t);
        t = Termin._new121("КОГДА", DelimType.IF, DelimToken.m_onto);
        DelimToken.m_onto.add(t);
        t = Termin._new119("ТО", DelimType.THEN);
        t.add_variant("ТОГДА", false);
        DelimToken.m_onto.add(t);
        t = Termin._new119("ИНАЧЕ", DelimType.ELSE);
        t.add_variant("В ПРОТИВНОМ СЛУЧАЕ", false);
        DelimToken.m_onto.add(t);
        t = Termin._new119("ТАК КАК", DelimType.BECAUSE);
        t.add_variant("ПОТОМУ ЧТО", false);
        t.add_variant("ПО ПРИЧИНЕ ТОГО ЧТО", false);
        t.add_variant("ИЗ ЗА ТОГО ЧТО", false);
        t.add_variant("ИЗЗА ТОГО ЧТО", false);
        t.add_variant("ИЗ-ЗА ТОГО ЧТО", false);
        t.add_variant("ТО ЕСТЬ", false);
        DelimToken.m_onto.add(t);
        t = Termin._new119("ЧТОБЫ", DelimType.FOR);
        t.add_variant("ДЛЯ ТОГО ЧТОБЫ", false);
        DelimToken.m_onto.add(t);
        t = Termin._new119("ЧТО", DelimType.WHAT);
        DelimToken.m_onto.add(t);
    }
    
    static static_constructor() {
        DelimToken.m_onto = null;
    }
}


DelimToken.static_constructor();

module.exports = DelimToken