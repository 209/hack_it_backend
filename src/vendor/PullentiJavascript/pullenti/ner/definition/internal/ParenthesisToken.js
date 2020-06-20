/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MorphLang = require("./../../../morph/MorphLang");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const MetaToken = require("./../../MetaToken");
const Termin = require("./../../core/Termin");
const TerminCollection = require("./../../core/TerminCollection");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const TextToken = require("./../../TextToken");
const MorphClass = require("./../../../morph/MorphClass");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const BracketHelper = require("./../../core/BracketHelper");

/**
 * Анализ вводных слов и словосочетаний
 */
class ParenthesisToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.ref = null;
    }
    
    static try_attach(t) {
        if (t === null) 
            return null;
        let tok = ParenthesisToken.m_termins.try_parse(t, TerminParseAttr.NO);
        if (tok !== null) {
            let res = new ParenthesisToken(t, tok.end_token);
            return res;
        }
        if (!((t instanceof TextToken))) 
            return null;
        let mc = t.get_morph_class_in_dictionary();
        let ok = false;
        let t1 = null;
        if (mc.is_adverb) 
            ok = true;
        else if (mc.is_adjective) {
            if (t.morph.contains_attr("сравн.", null) && t.morph.contains_attr("кач.прил.", null)) 
                ok = true;
        }
        if (ok && t.next !== null) {
            if (t.next.is_char(',')) 
                return new ParenthesisToken(t, t);
            t1 = t.next;
            if (MorphClass.ooEq(t1.get_morph_class_in_dictionary(), MorphClass.VERB)) {
                if (t1.morph.contains_attr("н.вр.", null) && t1.morph.contains_attr("нес.в.", null) && t1.morph.contains_attr("дейст.з.", null)) 
                    return new ParenthesisToken(t, t1);
            }
        }
        t1 = null;
        if ((t.is_value("В", null) && t.next !== null && t.next.is_value("СООТВЕТСТВИЕ", null)) && t.next.next !== null && t.next.next.morph.class0.is_preposition) 
            t1 = t.next.next.next;
        else if (t.is_value("СОГЛАСНО", null)) 
            t1 = t.next;
        else if (t.is_value("В", null) && t.next !== null) {
            if (t.next.is_value("СИЛА", null)) 
                t1 = t.next.next;
            else if (t.next.morph.class0.is_adjective || t.next.morph.class0.is_pronoun) {
                let npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null) {
                    if (npt.noun.is_value("ВИД", null) || npt.noun.is_value("СЛУЧАЙ", null) || npt.noun.is_value("СФЕРА", null)) 
                        return new ParenthesisToken(t, npt.end_token);
                }
            }
        }
        if (t1 !== null) {
            if (t1.next !== null) {
                let npt1 = NounPhraseHelper.try_parse(t1, NounPhraseParseAttr.NO, 0, null);
                if (npt1 !== null) {
                    if (npt1.noun.is_value("НОРМА", null) || npt1.noun.is_value("ПОЛОЖЕНИЕ", null) || npt1.noun.is_value("УКАЗАНИЕ", null)) 
                        t1 = npt1.end_token.next;
                }
            }
            let r = t1.get_referent();
            if (r !== null) {
                let res = ParenthesisToken._new1113(t, t1, r);
                if (t1.next !== null && t1.next.is_comma) {
                    let sila = false;
                    for (let ttt = t1.next.next; ttt !== null; ttt = ttt.next) {
                        if (ttt.is_value("СИЛА", null) || ttt.is_value("ДЕЙСТВИЕ", null)) {
                            sila = true;
                            continue;
                        }
                        if (ttt.is_comma) {
                            if (sila) 
                                res.end_token = ttt.previous;
                            break;
                        }
                        if (BracketHelper.can_be_start_of_sequence(ttt, false, false)) 
                            break;
                    }
                }
                return res;
            }
            let npt = NounPhraseHelper.try_parse(t1, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) 
                return new ParenthesisToken(t, npt.end_token);
        }
        let tt = t;
        if (tt.is_value("НЕ", null) && t !== null) 
            tt = tt.next;
        if (tt.morph.class0.is_preposition && tt !== null) {
            tt = tt.next;
            let npt1 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
            if (npt1 !== null) {
                tt = npt1.end_token;
                if (tt.next !== null && tt.next.is_comma) 
                    return new ParenthesisToken(t, tt.next);
                if (npt1.noun.is_value("ОЧЕРЕДЬ", null)) 
                    return new ParenthesisToken(t, tt);
            }
        }
        if (t.is_value("ВЕДЬ", null)) 
            return new ParenthesisToken(t, t);
        return null;
    }
    
    static initialize() {
        if (ParenthesisToken.m_termins !== null) 
            return;
        ParenthesisToken.m_termins = new TerminCollection();
        for (const s of ["ИТАК", "СЛЕДОВАТЕЛЬНО", "ТАКИМ ОБРАЗОМ"]) {
            ParenthesisToken.m_termins.add(new Termin(s, MorphLang.RU, true));
        }
    }
    
    static _new1113(_arg1, _arg2, _arg3) {
        let res = new ParenthesisToken(_arg1, _arg2);
        res.ref = _arg3;
        return res;
    }
    
    static static_constructor() {
        ParenthesisToken.m_termins = null;
    }
}


ParenthesisToken.static_constructor();

module.exports = ParenthesisToken