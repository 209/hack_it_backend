/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const TerminParseAttr = require("./../../core/TerminParseAttr");
const MorphGender = require("./../../../morph/MorphGender");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const PersonPropertyReferent = require("./../../person/PersonPropertyReferent");
const MorphLang = require("./../../../morph/MorphLang");
const TerminCollection = require("./../../core/TerminCollection");
const NumberSpellingType = require("./../../NumberSpellingType");
const Token = require("./../../Token");
const MetaToken = require("./../../MetaToken");
const TitleItemTokenTypes = require("./TitleItemTokenTypes");
const TextToken = require("./../../TextToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NumberToken = require("./../../NumberToken");
const ReferentToken = require("./../../ReferentToken");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const BracketHelper = require("./../../core/BracketHelper");
const Termin = require("./../../core/Termin");

class TitleItemToken extends MetaToken {
    
    constructor(begin, end, _typ) {
        super(begin, end, null);
        this.typ = TitleItemTokenTypes.UNDEFINED;
        this.value = null;
        this.typ = _typ;
    }
    
    toString() {
        return (this.typ.toString() + ": " + ((this.value != null ? this.value : "")));
    }
    
    static try_attach(t) {
        let tt = Utils.as(t, TextToken);
        if (tt !== null) {
            let t1 = tt;
            if (tt.term === "ТЕМА") {
                let tit = TitleItemToken.try_attach(tt.next);
                if (tit !== null && tit.typ === TitleItemTokenTypes.TYP) {
                    t1 = tit.end_token;
                    if (t1.next !== null && t1.next.is_char(':')) 
                        t1 = t1.next;
                    return TitleItemToken._new2648(t, t1, TitleItemTokenTypes.TYPANDTHEME, tit.value);
                }
                if (tt.next !== null && tt.next.is_char(':')) 
                    t1 = tt.next;
                return new TitleItemToken(tt, t1, TitleItemTokenTypes.THEME);
            }
            if (tt.term === "ПО" || tt.term === "НА") {
                if (tt.next !== null && tt.next.is_value("ТЕМА", null)) {
                    t1 = tt.next;
                    if (t1.next !== null && t1.next.is_char(':')) 
                        t1 = t1.next;
                    return new TitleItemToken(tt, t1, TitleItemTokenTypes.THEME);
                }
            }
            if (tt.term === "ПЕРЕВОД" || tt.term === "ПЕР") {
                let tt2 = tt.next;
                if (tt2 !== null && tt2.is_char('.')) 
                    tt2 = tt2.next;
                if (tt2 instanceof TextToken) {
                    if ((tt2).term === "C" || (tt2).term === "С") {
                        tt2 = tt2.next;
                        if (tt2 instanceof TextToken) 
                            return new TitleItemToken(t, tt2, TitleItemTokenTypes.TRANSLATE);
                    }
                }
            }
            if (tt.term === "СЕКЦИЯ" || tt.term === "SECTION" || tt.term === "СЕКЦІЯ") {
                t1 = tt.next;
                if (t1 !== null && t1.is_char(':')) 
                    t1 = t1.next;
                let br = BracketHelper.try_parse(t1, BracketParseAttr.NO, 100);
                if (br !== null) 
                    t1 = br.end_token;
                else if (t1 !== tt.next) {
                    for (; t1 !== null; t1 = t1.next) {
                        if (t1.is_newline_after) 
                            break;
                    }
                    if (t1 === null) 
                        return null;
                }
                if (t1 !== tt.next) 
                    return new TitleItemToken(tt, t1, TitleItemTokenTypes.DUST);
            }
            t1 = null;
            if (tt.is_value("СПЕЦИАЛЬНОСТЬ", "СПЕЦІАЛЬНІСТЬ")) 
                t1 = tt.next;
            else if (tt.morph.class0.is_preposition && tt.next !== null && tt.next.is_value("СПЕЦИАЛЬНОСТЬ", "СПЕЦІАЛЬНІСТЬ")) 
                t1 = tt.next.next;
            else if (tt.is_char('/') && tt.is_newline_before) 
                t1 = tt.next;
            if (t1 !== null) {
                if (t1.is_char_of(":") || t1.is_hiphen) 
                    t1 = t1.next;
                let spec = TitleItemToken.try_attach_speciality(t1, true);
                if (spec !== null) {
                    spec.begin_token = t;
                    return spec;
                }
            }
        }
        let sss = TitleItemToken.try_attach_speciality(t, false);
        if (sss !== null) 
            return sss;
        if (t instanceof ReferentToken) 
            return null;
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
        if (npt !== null) {
            let s = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
            let tok = TitleItemToken.m_termins.try_parse(npt.end_token, TerminParseAttr.NO);
            if (tok !== null) {
                let ty = TitleItemTokenTypes.of(tok.termin.tag);
                if (ty === TitleItemTokenTypes.TYP) {
                    let tit = TitleItemToken.try_attach(tok.end_token.next);
                    if (tit !== null && tit.typ === TitleItemTokenTypes.THEME) 
                        return TitleItemToken._new2648(npt.begin_token, tit.end_token, TitleItemTokenTypes.TYPANDTHEME, s);
                    if (s === "РАБОТА" || s === "РОБОТА" || s === "ПРОЕКТ") 
                        return null;
                    let t1 = tok.end_token;
                    if (s === "ДИССЕРТАЦИЯ" || s === "ДИСЕРТАЦІЯ") {
                        let err = 0;
                        for (let ttt = t1.next; ttt !== null; ttt = ttt.next) {
                            if (ttt.morph.class0.is_preposition) 
                                continue;
                            if (ttt.is_value("СОИСКАНИЕ", "")) 
                                continue;
                            let npt1 = NounPhraseHelper.try_parse(ttt, NounPhraseParseAttr.NO, 0, null);
                            if (npt1 !== null && npt1.noun.is_value("СТЕПЕНЬ", "СТУПІНЬ")) {
                                t1 = (ttt = npt1.end_token);
                                continue;
                            }
                            let rt = t1.kit.process_referent("PERSON", ttt);
                            if (rt !== null && (rt.referent instanceof PersonPropertyReferent)) {
                                let ppr = Utils.as(rt.referent, PersonPropertyReferent);
                                if (ppr.name === "доктор наук") {
                                    t1 = rt.end_token;
                                    s = "ДОКТОРСКАЯ ДИССЕРТАЦИЯ";
                                    break;
                                }
                                else if (ppr.name === "кандидат наук") {
                                    t1 = rt.end_token;
                                    s = "КАНДИДАТСКАЯ ДИССЕРТАЦИЯ";
                                    break;
                                }
                                else if (ppr.name === "магистр") {
                                    t1 = rt.end_token;
                                    s = "МАГИСТЕРСКАЯ ДИССЕРТАЦИЯ";
                                    break;
                                }
                            }
                            if (ttt.is_value("ДОКТОР", null) || ttt.is_value("КАНДИДАТ", null) || ttt.is_value("МАГИСТР", "МАГІСТР")) {
                                t1 = ttt;
                                npt1 = NounPhraseHelper.try_parse(ttt.next, NounPhraseParseAttr.NO, 0, null);
                                if (npt1 !== null && npt1.end_token.is_value("НАУК", null)) 
                                    t1 = npt1.end_token;
                                s = (ttt.is_value("МАГИСТР", "МАГІСТР") ? "МАГИСТЕРСКАЯ ДИССЕРТАЦИЯ" : (ttt.is_value("ДОКТОР", null) ? "ДОКТОРСКАЯ ДИССЕРТАЦИЯ" : "КАНДИДАТСКАЯ ДИССЕРТАЦИЯ"));
                                break;
                            }
                            if ((++err) > 3) 
                                break;
                        }
                    }
                    if (t1.next !== null && t1.next.is_char('.')) 
                        t1 = t1.next;
                    if (s.endsWith("ОТЧЕТ") && t1.next !== null && t1.next.is_value("О", null)) {
                        let npt1 = NounPhraseHelper.try_parse(t1.next, NounPhraseParseAttr.PARSEPREPOSITION, 0, null);
                        if (npt1 !== null && npt1.morph._case.is_prepositional) 
                            t1 = npt1.end_token;
                    }
                    return TitleItemToken._new2648(npt.begin_token, t1, ty, s);
                }
            }
        }
        let tok1 = TitleItemToken.m_termins.try_parse(t, TerminParseAttr.NO);
        if (tok1 !== null) {
            let t1 = tok1.end_token;
            let re = new TitleItemToken(tok1.begin_token, t1, TitleItemTokenTypes.of(tok1.termin.tag));
            return re;
        }
        if (BracketHelper.can_be_start_of_sequence(t, false, false)) {
            tok1 = TitleItemToken.m_termins.try_parse(t.next, TerminParseAttr.NO);
            if (tok1 !== null && BracketHelper.can_be_end_of_sequence(tok1.end_token.next, false, null, false)) {
                let t1 = tok1.end_token.next;
                return new TitleItemToken(tok1.begin_token, t1, TitleItemTokenTypes.of(tok1.termin.tag));
            }
        }
        return null;
    }
    
    static try_attach_speciality(t, key_word_before) {
        if (t === null) 
            return null;
        let susp = false;
        if (!key_word_before) {
            if (!t.is_newline_before) 
                susp = true;
        }
        let val = null;
        let t0 = t;
        let dig_count = 0;
        for (let i = 0; i < 3; i++) {
            let nt = Utils.as(t, NumberToken);
            if (nt === null) 
                break;
            if (nt.typ !== NumberSpellingType.DIGIT || nt.morph.class0.is_adjective) 
                break;
            if (val === null) 
                val = new StringBuilder();
            if (susp && t.length_char !== 2) 
                return null;
            let digs = nt.get_source_text();
            dig_count += digs.length;
            val.append(digs);
            if (t.next === null) 
                break;
            t = t.next;
            if (t.is_char_of(".,") || t.is_hiphen) {
                if (susp && (i < 2)) {
                    if (!t.is_char('.') || t.is_whitespace_after || t.is_whitespace_before) 
                        return null;
                }
                if (t.next !== null) 
                    t = t.next;
            }
        }
        if (val === null || (dig_count < 5)) 
            return null;
        if (dig_count !== 6) {
            if (!key_word_before) 
                return null;
        }
        else {
            val.insert(4, '.');
            val.insert(2, '.');
        }
        for (let tt = t.next; tt !== null; tt = tt.next) {
            if (tt.is_newline_before) 
                break;
            let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
            if (br !== null) {
                t = (tt = br.end_token);
                continue;
            }
            t = tt;
        }
        return TitleItemToken._new2648(t0, t, TitleItemTokenTypes.SPECIALITY, val.toString());
    }
    
    static initialize() {
        if (TitleItemToken.m_termins !== null) 
            return;
        TitleItemToken.m_termins = new TerminCollection();
        for (const s of ["РАБОТА", "ДИССЕРТАЦИЯ", "ОТЧЕТ", "ОБЗОР", "ДИПЛОМ", "ПРОЕКТ", "СПРАВКА", "АВТОРЕФЕРАТ", "РЕФЕРАТ", "TECHNOLOGY ISSUES", "TECHNOLOGY COURSE", "УЧЕБНИК", "УЧЕБНОЕ ПОСОБИЕ"]) {
            TitleItemToken.m_termins.add(Termin._new119(s, TitleItemTokenTypes.TYP));
        }
        for (const s of ["РОБОТА", "ДИСЕРТАЦІЯ", "ЗВІТ", "ОГЛЯД", "ДИПЛОМ", "ПРОЕКТ", "ДОВІДКА", "АВТОРЕФЕРАТ", "РЕФЕРАТ"]) {
            TitleItemToken.m_termins.add(Termin._new456(s, MorphLang.UA, TitleItemTokenTypes.TYP));
        }
        for (const s of ["ДОПУСТИТЬ К ЗАЩИТА", "РЕКОМЕНДОВАТЬ К ЗАЩИТА", "ДОЛЖНОСТЬ", "ЦЕЛЬ РАБОТЫ", "НА ПРАВАХ РУКОПИСИ", "ПО ИЗДАНИЮ", "ПОЛУЧЕНО"]) {
            TitleItemToken.m_termins.add(Termin._new119(s, TitleItemTokenTypes.DUST));
        }
        for (const s of ["ДОПУСТИТИ ДО ЗАХИСТУ", "РЕКОМЕНДУВАТИ ДО ЗАХИСТ", "ПОСАДА", "МЕТА РОБОТИ", "НА ПРАВАХ РУКОПИСУ", "ПО ВИДАННЮ", "ОТРИМАНО"]) {
            TitleItemToken.m_termins.add(Termin._new456(s, MorphLang.UA, TitleItemTokenTypes.DUST));
        }
        for (const s of ["УТВЕРЖДАТЬ", "СОГЛАСЕН", "СТВЕРДЖУВАТИ", "ЗГОДЕН"]) {
            TitleItemToken.m_termins.add(Termin._new119(s, TitleItemTokenTypes.ADOPT));
        }
        for (const s of ["НАУЧНЫЙ РУКОВОДИТЕЛЬ", "РУКОВОДИТЕЛЬ РАБОТА", "НАУКОВИЙ КЕРІВНИК", "КЕРІВНИК РОБОТА"]) {
            TitleItemToken.m_termins.add(Termin._new119(s, TitleItemTokenTypes.BOSS));
        }
        for (const s of ["НАУЧНЫЙ КОНСУЛЬТАНТ", "КОНСУЛЬТАНТ", "НАУКОВИЙ КОНСУЛЬТАНТ"]) {
            TitleItemToken.m_termins.add(Termin._new119(s, TitleItemTokenTypes.CONSULTANT));
        }
        for (const s of ["РЕДАКТОР", "РЕДАКТОРСКАЯ ГРУППА", "РЕЦЕНЗЕНТ", "РЕДАКТОРСЬКА ГРУПА"]) {
            TitleItemToken.m_termins.add(Termin._new119(s, TitleItemTokenTypes.EDITOR));
        }
        for (const s of ["ОФИЦИАЛЬНЫЙ ОППОНЕНТ", "ОППОНЕНТ", "ОФІЦІЙНИЙ ОПОНЕНТ"]) {
            TitleItemToken.m_termins.add(Termin._new119(s, TitleItemTokenTypes.OPPONENT));
        }
        for (const s of ["ИСПОЛНИТЕЛЬ", "ОТВЕТСТВЕННЫЙ ИСПОЛНИТЕЛЬ", "АВТОР", "ДИПЛОМНИК", "КОЛЛЕКТТИВ ИСПОЛНИТЕЛЕЙ", "ВЫПОЛНИТЬ", "ИСПОЛНИТЬ"]) {
            TitleItemToken.m_termins.add(Termin._new119(s, TitleItemTokenTypes.WORKER));
        }
        for (const s of ["ВИКОНАВЕЦЬ", "ВІДПОВІДАЛЬНИЙ ВИКОНАВЕЦЬ", "АВТОР", "ДИПЛОМНИК", "КОЛЛЕКТТИВ ВИКОНАВЦІВ", "ВИКОНАТИ", "ВИКОНАТИ"]) {
            TitleItemToken.m_termins.add(Termin._new456(s, MorphLang.UA, TitleItemTokenTypes.WORKER));
        }
        for (const s of ["КЛЮЧЕВЫЕ СЛОВА", "KEYWORDS", "КЛЮЧОВІ СЛОВА"]) {
            TitleItemToken.m_termins.add(Termin._new119(s, TitleItemTokenTypes.KEYWORDS));
        }
    }
    
    static _new2648(_arg1, _arg2, _arg3, _arg4) {
        let res = new TitleItemToken(_arg1, _arg2, _arg3);
        res.value = _arg4;
        return res;
    }
    
    static static_constructor() {
        TitleItemToken.m_termins = null;
    }
}


TitleItemToken.static_constructor();

module.exports = TitleItemToken