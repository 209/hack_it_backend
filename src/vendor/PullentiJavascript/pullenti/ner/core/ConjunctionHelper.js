/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const TerminParseAttr = require("./TerminParseAttr");
const NounPhraseParseAttr = require("./NounPhraseParseAttr");
const NounPhraseHelper = require("./NounPhraseHelper");
const TextToken = require("./../TextToken");
const ConjunctionType = require("./ConjunctionType");
const Termin = require("./Termin");
const TerminCollection = require("./TerminCollection");
const ConjunctionToken = require("./ConjunctionToken");

/**
 * Поддержка работы с союзами (запятая тоже считается союзом)
 */
class ConjunctionHelper {
    
    /**
     * Попытаться выделить союз с указанного токена
     * @param t начальный токен
     * @return результат или null
     */
    static try_parse(t) {
        if (!((t instanceof TextToken))) 
            return null;
        if (t.is_comma) {
            let ne = ConjunctionHelper.try_parse(t.next);
            if (ne !== null) {
                ne.begin_token = t;
                ne.is_simple = false;
                return ne;
            }
            return ConjunctionToken._new550(t, t, ConjunctionType.COMMA, true, ",");
        }
        let tok = ConjunctionHelper.m_ontology.try_parse(t, TerminParseAttr.NO);
        if (tok !== null) {
            if (t.is_value("ТО", null)) {
                let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSEADVERBS, 0, null);
                if (npt !== null && npt.end_char > tok.end_token.end_char) 
                    return null;
            }
            if (tok.termin.tag2 !== null) {
                if (!((tok.end_token instanceof TextToken))) 
                    return null;
                if (tok.end_token.get_morph_class_in_dictionary().is_verb) {
                    if (!(tok.end_token).term.endsWith("АЯ")) 
                        return null;
                }
            }
            return ConjunctionToken._new551(t, tok.end_token, tok.termin.canonic_text, ConjunctionType.of(tok.termin.tag));
        }
        if (!t.get_morph_class_in_dictionary().is_conjunction) 
            return null;
        if (t.is_and || t.is_or) {
            let res = ConjunctionToken._new552(t, t, (t).term, true, (t.is_or ? ConjunctionType.OR : ConjunctionType.AND));
            if (((t.next !== null && t.next.is_char('(') && (t.next.next instanceof TextToken)) && t.next.next.is_or && t.next.next.next !== null) && t.next.next.next.is_char(')')) 
                res.end_token = t.next.next.next;
            else if ((t.next !== null && t.next.is_char_of("\\/") && (t.next.next instanceof TextToken)) && t.next.next.is_or) 
                res.end_token = t.next.next;
            return res;
        }
        let term = (t).term;
        if (term === "НИ") 
            return ConjunctionToken._new551(t, t, term, ConjunctionType.NOT);
        if ((term === "А" || term === "НО" || term === "ЗАТО") || term === "ОДНАКО") 
            return ConjunctionToken._new551(t, t, term, ConjunctionType.BUT);
        return null;
    }
    
    static initialize() {
        if (ConjunctionHelper.m_ontology !== null) 
            return;
        ConjunctionHelper.m_ontology = new TerminCollection();
        let te = null;
        te = Termin._new119("ТАКЖЕ", ConjunctionType.AND);
        te.add_variant("А ТАКЖЕ", false);
        te.add_variant("КАК И", false);
        te.add_variant("ТАК И", false);
        te.add_variant("А РАВНО", false);
        te.add_variant("А РАВНО И", false);
        ConjunctionHelper.m_ontology.add(te);
        te = Termin._new119("ЕСЛИ", ConjunctionType.IF);
        ConjunctionHelper.m_ontology.add(te);
        te = Termin._new119("ТО", ConjunctionType.THEN);
        ConjunctionHelper.m_ontology.add(te);
        te = Termin._new119("ИНАЧЕ", ConjunctionType.ELSE);
        ConjunctionHelper.m_ontology.add(te);
        te = Termin._new121("ИНАЧЕ КАК", ConjunctionType.EXCEPT, true);
        te.add_variant("ИНАЧЕ, КАК", false);
        te.add_variant("ЗА ИСКЛЮЧЕНИЕМ", false);
        te.add_variant("ИСКЛЮЧАЯ", false);
        te.add_abridge("КРОМЕ");
        te.add_abridge("КРОМЕ КАК");
        te.add_abridge("КРОМЕ, КАК");
        ConjunctionHelper.m_ontology.add(te);
        te = Termin._new121("ВКЛЮЧАЯ", ConjunctionType.INCLUDE, true);
        te.add_variant("В ТОМ ЧИСЛЕ", false);
        ConjunctionHelper.m_ontology.add(te);
    }
    
    static static_constructor() {
        ConjunctionHelper.m_ontology = null;
    }
}


ConjunctionHelper.static_constructor();

module.exports = ConjunctionHelper