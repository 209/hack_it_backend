/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const TextToken = require("./../../ner/TextToken");
const MetaToken = require("./../../ner/MetaToken");
const GetTextAttr = require("./../../ner/core/GetTextAttr");
const Termin = require("./../../ner/core/Termin");
const TerminCollection = require("./../../ner/core/TerminCollection");
const TerminParseAttr = require("./../../ner/core/TerminParseAttr");
const SemAttributeType = require("./../SemAttributeType");
const MiscHelper = require("./../../ner/core/MiscHelper");

class AdverbToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = SemAttributeType.UNDEFINED;
        this.not = false;
        this.m_spelling = null;
    }
    
    get spelling() {
        if (this.m_spelling !== null) 
            return this.m_spelling;
        return MiscHelper.get_text_value_of_meta_token(this, GetTextAttr.NO);
    }
    set spelling(value) {
        this.m_spelling = value;
        return value;
    }
    
    toString() {
        if (this.typ === SemAttributeType.UNDEFINED) 
            return this.spelling;
        return (String(this.typ) + ": " + (this.not ? "НЕ " : "") + this.spelling);
    }
    
    static try_parse(t) {
        if (t === null) 
            return null;
        if ((t instanceof TextToken) && (t).term === "НЕ") {
            let nn = AdverbToken.try_parse(t.next);
            if (nn !== null) {
                nn.not = true;
                nn.begin_token = t;
                return nn;
            }
        }
        let t0 = t;
        let t1 = null;
        if (t.next !== null && t.morph.class0.is_preposition) 
            t = t.next;
        if (t.is_value("ДРУГ", null) || t.is_value("САМ", null)) {
            t1 = t.next;
            if (t1 !== null && t1.morph.class0.is_preposition) 
                t1 = t1.next;
            if (t1 !== null) {
                if (t1.is_value("ДРУГ", null) && t.is_value("ДРУГ", null)) 
                    return AdverbToken._new2873(t0, t1, SemAttributeType.EACHOTHER);
                if (t1.is_value("СЕБЯ", null) && t.is_value("САМ", null)) 
                    return AdverbToken._new2873(t0, t1, SemAttributeType.HIMELF);
            }
        }
        let tok = AdverbToken.m_termins.try_parse(t, TerminParseAttr.NO);
        if (tok !== null) {
            let res = AdverbToken._new2873(t0, tok.end_token, SemAttributeType.of(tok.termin.tag));
            t = res.end_token.next;
            if (t !== null && t.is_comma) 
                t = t.next;
            if (res.typ === SemAttributeType.LESS || res.typ === SemAttributeType.GREAT) {
                if (t !== null && t.is_value("ЧЕМ", null)) 
                    res.end_token = t;
            }
            return res;
        }
        let mc = t.get_morph_class_in_dictionary();
        if (mc.is_adverb) 
            return new AdverbToken(t, t);
        if (t.is_value("ВСТРЕЧА", null) && t.previous !== null && t.previous.is_value("НА", null)) {
            let ne = AdverbToken.try_parse(t.next);
            if (ne !== null && ne.typ === SemAttributeType.EACHOTHER) 
                return new AdverbToken(t.previous, t);
        }
        return null;
    }
    
    static initialize() {
        if (AdverbToken.m_termins !== null) 
            return;
        AdverbToken.m_termins = new TerminCollection();
        let t = null;
        t = Termin._new119("ЕЩЕ", SemAttributeType.STILL);
        AdverbToken.m_termins.add(t);
        t = Termin._new119("УЖЕ", SemAttributeType.ALREADY);
        AdverbToken.m_termins.add(t);
        t = Termin._new119("ВСЕ", SemAttributeType.ALL);
        AdverbToken.m_termins.add(t);
        t = Termin._new119("ЛЮБОЙ", SemAttributeType.ANY);
        t.add_variant("ЛЮБОЙ", false);
        t.add_variant("КАЖДЫЙ", false);
        t.add_variant("ЧТО УГОДНО", false);
        t.add_variant("ВСЯКИЙ", false);
        AdverbToken.m_termins.add(t);
        t = Termin._new119("НЕКОТОРЫЙ", SemAttributeType.SOME);
        t.add_variant("НЕКИЙ", false);
        AdverbToken.m_termins.add(t);
        t = Termin._new119("ДРУГОЙ", SemAttributeType.OTHER);
        t.add_variant("ИНОЙ", false);
        AdverbToken.m_termins.add(t);
        t = Termin._new119("ВЕСЬ", SemAttributeType.WHOLE);
        t.add_variant("ЦЕЛИКОМ", false);
        t.add_variant("ПОЛНОСТЬЮ", false);
        AdverbToken.m_termins.add(t);
        t = Termin._new119("ОЧЕНЬ", SemAttributeType.VERY);
        AdverbToken.m_termins.add(t);
        t = Termin._new119("МЕНЬШЕ", SemAttributeType.LESS);
        t.add_variant("МЕНЕЕ", false);
        t.add_variant("МЕНЕЕ", false);
        t.add_variant("МЕНЬШЕ", false);
        AdverbToken.m_termins.add(t);
        t = Termin._new119("БОЛЬШЕ", SemAttributeType.GREAT);
        t.add_variant("БОЛЕЕ", false);
        t.add_variant("СВЫШЕ", false);
        AdverbToken.m_termins.add(t);
    }
    
    static _new2873(_arg1, _arg2, _arg3) {
        let res = new AdverbToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static static_constructor() {
        AdverbToken.m_termins = null;
    }
}


AdverbToken.static_constructor();

module.exports = AdverbToken