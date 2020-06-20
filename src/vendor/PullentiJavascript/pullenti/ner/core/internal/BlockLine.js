/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const MorphLang = require("./../../../morph/MorphLang");
const NounPhraseParseAttr = require("./../NounPhraseParseAttr");
const MetaToken = require("./../../MetaToken");
const TerminCollection = require("./../TerminCollection");
const TerminParseAttr = require("./../TerminParseAttr");
const NumberToken = require("./../../NumberToken");
const Termin = require("./../Termin");
const TextToken = require("./../../TextToken");
const BlkTyps = require("./BlkTyps");
const NounPhraseHelper = require("./../NounPhraseHelper");
const NumberHelper = require("./../NumberHelper");

class BlockLine extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.is_all_upper = false;
        this.has_verb = false;
        this.is_exist_name = false;
        this.has_content_item_tail = false;
        this.words = 0;
        this.not_words = 0;
        this.number_end = null;
        this.typ = BlkTyps.UNDEFINED;
    }
    
    static create(t, names) {
        if (t === null) 
            return null;
        let res = new BlockLine(t, t);
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt !== t && tt.is_newline_before) 
                break;
            else 
                res.end_token = tt;
        }
        let nums = 0;
        while (t !== null && t.next !== null && t.end_char <= res.end_char) {
            if (t instanceof NumberToken) {
            }
            else {
                let rom = NumberHelper.try_parse_roman(t);
                if (rom !== null && rom.end_token.next !== null) 
                    t = rom.end_token;
                else 
                    break;
            }
            if (t.next.is_char('.')) {
            }
            else if ((t.next instanceof TextToken) && !t.next.chars.is_all_lower) {
            }
            else 
                break;
            res.number_end = t;
            t = t.next;
            if (t.is_char('.') && t.next !== null) {
                res.number_end = t;
                t = t.next;
            }
            if (t.is_newline_before) 
                return res;
            nums++;
        }
        let tok = BlockLine.m_ontology.try_parse(t, TerminParseAttr.NO);
        if (tok === null) {
            let npt1 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt1 !== null && npt1.end_token !== npt1.begin_token) 
                tok = BlockLine.m_ontology.try_parse(npt1.noun.begin_token, TerminParseAttr.NO);
        }
        if (tok !== null) {
            if (t.previous !== null && t.previous.is_char(':')) 
                tok = null;
        }
        if (tok !== null) {
            let _typ = BlkTyps.of(tok.termin.tag);
            if (_typ === BlkTyps.CONSLUSION) {
                if (t.is_newline_after) {
                }
                else if (t.next !== null && t.next.morph.class0.is_preposition && t.next.next !== null) {
                    let tok2 = BlockLine.m_ontology.try_parse(t.next.next, TerminParseAttr.NO);
                    if (tok2 !== null && (BlkTyps.of(tok2.termin.tag)) === BlkTyps.CHAPTER) {
                    }
                    else 
                        tok = null;
                }
                else 
                    tok = null;
            }
            if (MorphLang.ooNoteq(t.kit.base_language, t.morph.language)) 
                tok = null;
            if (_typ === BlkTyps.INDEX && !t.is_value("ОГЛАВЛЕНИЕ", null)) {
                if (!t.is_newline_after && t.next !== null) {
                    let npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null && npt.is_newline_after && npt.morph._case.is_genitive) 
                        tok = null;
                    else if (npt === null) 
                        tok = null;
                }
            }
            if ((_typ === BlkTyps.INTRO && tok !== null && !tok.is_newline_after) && t.is_value("ВВЕДЕНИЕ", null)) {
                let npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.morph._case.is_genitive) 
                    tok = null;
            }
            if (tok !== null) {
                if (res.number_end === null) {
                    res.number_end = tok.end_token;
                    if (res.number_end.end_char > res.end_char) 
                        res.end_token = res.number_end;
                }
                res.typ = _typ;
                t = tok.end_token;
                if (t.next !== null && t.next.is_char_of(":.")) {
                    t = t.next;
                    res.end_token = t;
                }
                if (t.is_newline_after || t.next === null) 
                    return res;
                t = t.next;
            }
        }
        if (t.is_char('§') && (t.next instanceof NumberToken)) {
            res.typ = BlkTyps.CHAPTER;
            res.number_end = t;
            t = t.next;
        }
        if (names !== null) {
            let tok2 = names.try_parse(t, TerminParseAttr.NO);
            if (tok2 !== null && tok2.end_token.is_newline_after) {
                res.end_token = tok2.end_token;
                res.is_exist_name = true;
                if (res.typ === BlkTyps.UNDEFINED) {
                    let li2 = BlockLine.create((res.number_end === null ? null : res.number_end.next), null);
                    if (li2 !== null && ((li2.typ === BlkTyps.LITERATURE || li2.typ === BlkTyps.INTRO || li2.typ === BlkTyps.CONSLUSION))) 
                        res.typ = li2.typ;
                    else 
                        res.typ = BlkTyps.CHAPTER;
                }
                return res;
            }
        }
        let t1 = res.end_token;
        if ((((t1 instanceof NumberToken) || t1.is_char('.'))) && t1.previous !== null) {
            t1 = t1.previous;
            if (t1.is_char('.')) {
                res.has_content_item_tail = true;
                for (; t1 !== null && t1.begin_char > res.begin_char; t1 = t1.previous) {
                    if (!t1.is_char('.')) 
                        break;
                }
            }
        }
        res.is_all_upper = true;
        for (; t !== null && t.end_char <= t1.end_char; t = t.next) {
            if (!((t instanceof TextToken)) || !t.chars.is_letter) 
                res.not_words++;
            else {
                let mc = t.get_morph_class_in_dictionary();
                if (mc.is_undefined) 
                    res.not_words++;
                else if (t.length_char > 2) 
                    res.words++;
                if (!t.chars.is_all_upper) 
                    res.is_all_upper = false;
                if ((t).is_pure_verb) {
                    if (!(t).term.endsWith("ING")) 
                        res.has_verb = true;
                }
            }
        }
        if (res.typ === BlkTyps.UNDEFINED) {
            let npt = NounPhraseHelper.try_parse((res.number_end === null ? res.begin_token : res.number_end.next), NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                if (npt.noun.is_value("ХАРАКТЕРИСТИКА", null) || npt.noun.is_value("СОДЕРЖАНИЕ", "ЗМІСТ")) {
                    let ok = true;
                    for (let tt = npt.end_token.next; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
                        if (tt.is_char('.')) 
                            continue;
                        let npt2 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                        if (npt2 === null || !npt2.morph._case.is_genitive) {
                            ok = false;
                            break;
                        }
                        tt = npt2.end_token;
                        if (tt.end_char > res.end_char) {
                            res.end_token = tt;
                            if (!tt.is_newline_after) {
                                for (; res.end_token.next !== null; res.end_token = res.end_token.next) {
                                    if (res.end_token.is_newline_after) 
                                        break;
                                }
                            }
                        }
                    }
                    if (ok) {
                        res.typ = BlkTyps.INTRO;
                        res.is_exist_name = true;
                    }
                }
                else if (npt.noun.is_value("ВЫВОД", "ВИСНОВОК") || npt.noun.is_value("РЕЗУЛЬТАТ", "ДОСЛІДЖЕННЯ")) {
                    let ok = true;
                    for (let tt = npt.end_token.next; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
                        if (tt.is_char_of(",.") || tt.is_and) 
                            continue;
                        let npt1 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                        if (npt1 !== null) {
                            if (npt1.noun.is_value("РЕЗУЛЬТАТ", "ДОСЛІДЖЕННЯ") || npt1.noun.is_value("РЕКОМЕНДАЦИЯ", "РЕКОМЕНДАЦІЯ") || npt1.noun.is_value("ИССЛЕДОВАНИЕ", "ДОСЛІДЖЕННЯ")) {
                                tt = npt1.end_token;
                                if (tt.end_char > res.end_char) {
                                    res.end_token = tt;
                                    if (!tt.is_newline_after) {
                                        for (; res.end_token.next !== null; res.end_token = res.end_token.next) {
                                            if (res.end_token.is_newline_after) 
                                                break;
                                        }
                                    }
                                }
                                continue;
                            }
                        }
                        ok = false;
                        break;
                    }
                    if (ok) {
                        res.typ = BlkTyps.CONSLUSION;
                        res.is_exist_name = true;
                    }
                }
                if (res.typ === BlkTyps.UNDEFINED && npt !== null && npt.end_char <= res.end_char) {
                    let ok = false;
                    let publ = 0;
                    if (BlockLine._is_pub(npt)) {
                        ok = true;
                        publ = 1;
                    }
                    else if ((npt.noun.is_value("СПИСОК", null) || npt.noun.is_value("УКАЗАТЕЛЬ", "ПОКАЖЧИК") || npt.noun.is_value("ПОЛОЖЕНИЕ", "ПОЛОЖЕННЯ")) || npt.noun.is_value("ВЫВОД", "ВИСНОВОК") || npt.noun.is_value("РЕЗУЛЬТАТ", "ДОСЛІДЖЕННЯ")) {
                        if (npt.end_char === res.end_char) 
                            return null;
                        ok = true;
                    }
                    if (ok) {
                        if (npt.begin_token === npt.end_token && npt.noun.is_value("СПИСОК", null) && npt.end_char === res.end_char) 
                            ok = false;
                        for (let tt = npt.end_token.next; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
                            if (tt.is_char_of(",.:") || tt.is_and || tt.morph.class0.is_preposition) 
                                continue;
                            if (tt.is_value("ОТРАЖЕНЫ", "ВІДОБРАЖЕНІ")) 
                                continue;
                            npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                            if (npt === null) {
                                ok = false;
                                break;
                            }
                            if (((BlockLine._is_pub(npt) || npt.noun.is_value("РАБОТА", "РОБОТА") || npt.noun.is_value("ИССЛЕДОВАНИЕ", "ДОСЛІДЖЕННЯ")) || npt.noun.is_value("АВТОР", null) || npt.noun.is_value("ТРУД", "ПРАЦЯ")) || npt.noun.is_value("ТЕМА", null) || npt.noun.is_value("ДИССЕРТАЦИЯ", "ДИСЕРТАЦІЯ")) {
                                tt = npt.end_token;
                                if (BlockLine._is_pub(npt)) 
                                    publ++;
                                if (tt.end_char > res.end_char) {
                                    res.end_token = tt;
                                    if (!tt.is_newline_after) {
                                        for (; res.end_token.next !== null; res.end_token = res.end_token.next) {
                                            if (res.end_token.is_newline_after) 
                                                break;
                                        }
                                    }
                                }
                                continue;
                            }
                            ok = false;
                            break;
                        }
                        if (ok) {
                            res.typ = BlkTyps.LITERATURE;
                            res.is_exist_name = true;
                            if (publ === 0 && (res.end_char < ((Utils.intDiv(res.kit.sofa.text.length * 2, 3))))) {
                                if (res.number_end !== null) 
                                    res.typ = BlkTyps.MISC;
                                else 
                                    res.typ = BlkTyps.UNDEFINED;
                            }
                        }
                    }
                }
            }
        }
        return res;
    }
    
    static _is_pub(t) {
        if (t === null) 
            return false;
        if (((t.noun.is_value("ПУБЛИКАЦИЯ", "ПУБЛІКАЦІЯ") || t.noun.is_value("REFERENCE", null) || t.noun.is_value("ЛИТЕРАТУРА", "ЛІТЕРАТУРА")) || t.noun.is_value("ИСТОЧНИК", "ДЖЕРЕЛО") || t.noun.is_value("БИБЛИОГРАФИЯ", "БІБЛІОГРАФІЯ")) || t.noun.is_value("ДОКУМЕНТ", null)) 
            return true;
        for (const a of t.adjectives) {
            if (a.is_value("БИБЛИОГРАФИЧЕСКИЙ", null)) 
                return true;
        }
        return false;
    }
    
    static initialize() {
        if (BlockLine.m_ontology !== null) 
            return;
        BlockLine.m_ontology = new TerminCollection();
        for (const s of ["СОДЕРЖАНИЕ", "СОДЕРЖИМОЕ", "ОГЛАВЛЕНИЕ", "ПЛАН", "PLAN", "ЗМІСТ", "CONTENTS", "INDEX"]) {
            BlockLine.m_ontology.add(Termin._new119(s, BlkTyps.INDEX));
        }
        for (const s of ["ГЛАВА", "CHAPTER", "РАЗДЕЛ", "ПАРАГРАФ", "VOLUME", "SECTION", "РОЗДІЛ"]) {
            BlockLine.m_ontology.add(Termin._new119(s, BlkTyps.CHAPTER));
        }
        for (const s of ["ВВЕДЕНИЕ", "ВСТУПЛЕНИЕ", "ПРЕДИСЛОВИЕ", "INTRODUCTION"]) {
            BlockLine.m_ontology.add(Termin._new119(s, BlkTyps.INTRO));
        }
        for (const s of ["ВСТУП", "ПЕРЕДМОВА"]) {
            BlockLine.m_ontology.add(Termin._new456(s, MorphLang.UA, BlkTyps.INTRO));
        }
        for (const s of ["ВЫВОДЫ", "ВЫВОД", "ЗАКЛЮЧЕНИЕ", "CONCLUSION", "ВИСНОВОК", "ВИСНОВКИ"]) {
            BlockLine.m_ontology.add(Termin._new119(s, BlkTyps.CONSLUSION));
        }
        for (const s of ["ПРИЛОЖЕНИЕ", "APPENDIX", "ДОДАТОК"]) {
            BlockLine.m_ontology.add(Termin._new119(s, BlkTyps.APPENDIX));
        }
        for (const s of ["СПИСОК СОКРАЩЕНИЙ", "СПИСОК УСЛОВНЫХ СОКРАЩЕНИЙ", "СПИСОК ИСПОЛЬЗУЕМЫХ СОКРАЩЕНИЙ", "УСЛОВНЫЕ СОКРАЩЕНИЯ", "ОБЗОР ЛИТЕРАТУРЫ", "АННОТАЦИЯ", "ANNOTATION", "БЛАГОДАРНОСТИ", "SUPPLEMENT", "ABSTRACT", "СПИСОК СКОРОЧЕНЬ", "ПЕРЕЛІК УМОВНИХ СКОРОЧЕНЬ", "СПИСОК ВИКОРИСТОВУВАНИХ СКОРОЧЕНЬ", "УМОВНІ СКОРОЧЕННЯ", "ОГЛЯД ЛІТЕРАТУРИ", "АНОТАЦІЯ", "ПОДЯКИ"]) {
            BlockLine.m_ontology.add(Termin._new119(s, BlkTyps.MISC));
        }
    }
    
    static static_constructor() {
        BlockLine.m_ontology = null;
    }
}


BlockLine.static_constructor();

module.exports = BlockLine