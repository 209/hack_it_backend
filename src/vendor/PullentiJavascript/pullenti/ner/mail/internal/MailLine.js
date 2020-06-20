/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const PersonItemTokenParseAttr = require("./../../person/internal/PersonItemTokenParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const MetaToken = require("./../../MetaToken");
const BracketHelper = require("./../../core/BracketHelper");
const Termin = require("./../../core/Termin");
const TerminCollection = require("./../../core/TerminCollection");
const GeoReferent = require("./../../geo/GeoReferent");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const TextToken = require("./../../TextToken");
const PersonPropertyReferent = require("./../../person/PersonPropertyReferent");
const MailLineTypes = require("./MailLineTypes");
const ReferentToken = require("./../../ReferentToken");
const PersonItemToken = require("./../../person/internal/PersonItemToken");
const AddressReferent = require("./../../address/AddressReferent");
const PersonReferent = require("./../../person/PersonReferent");

class MailLine extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.lev = 0;
        this.typ = MailLineTypes.UNDEFINED;
        this.refs = new Array();
        this.must_be_first_line = false;
    }
    
    get chars_count() {
        let cou = 0;
        for (let t = this.begin_token; t !== null; t = t.next) {
            cou += t.length_char;
            if (t === this.end_token) 
                break;
        }
        return cou;
    }
    
    get words() {
        let cou = 0;
        for (let t = this.begin_token; t !== null && t.end_char <= this.end_char; t = t.next) {
            if ((t instanceof TextToken) && t.chars.is_letter && t.length_char > 2) {
                if (t.tag === null) 
                    cou++;
            }
        }
        return cou;
    }
    
    get is_pure_en() {
        let en = 0;
        let ru = 0;
        for (let t = this.begin_token; t !== null && t.end_char <= this.end_char; t = t.next) {
            if ((t instanceof TextToken) && t.chars.is_letter) {
                if (t.chars.is_cyrillic_letter) 
                    ru++;
                else if (t.chars.is_latin_letter) 
                    en++;
            }
        }
        if (en > 0 && ru === 0) 
            return true;
        return false;
    }
    
    get is_pure_ru() {
        let en = 0;
        let ru = 0;
        for (let t = this.begin_token; t !== null && t.end_char <= this.end_char; t = t.next) {
            if ((t instanceof TextToken) && t.chars.is_letter) {
                if (t.chars.is_cyrillic_letter) 
                    ru++;
                else if (t.chars.is_latin_letter) 
                    en++;
            }
        }
        if (ru > 0 && en === 0) 
            return true;
        return false;
    }
    
    get mail_addr() {
        for (let t = this.begin_token; t !== null && t.end_char <= this.end_char; t = t.next) {
            if (t.get_referent() !== null && t.get_referent().type_name === "URI") {
                if (t.get_referent().get_string_value("SCHEME") === "mailto") 
                    return t.get_referent();
            }
        }
        return null;
    }
    
    get is_real_from() {
        let tt = Utils.as(this.begin_token, TextToken);
        if (tt === null) 
            return false;
        return tt.term === "FROM" || tt.term === "ОТ";
    }
    
    toString() {
        return ((this.must_be_first_line ? "(1) " : "") + this.lev + " " + String(this.typ) + ": " + this.get_source_text());
    }
    
    static parse(t0, _lev) {
        if (t0 === null) 
            return null;
        let res = new MailLine(t0, t0);
        let pr = true;
        for (let t = t0; t !== null; t = t.next) {
            if (t.is_newline_before && t0 !== t) 
                break;
            res.end_token = t;
            if (t.is_table_control_char || t.is_hiphen) 
                continue;
            if (pr) {
                if ((t instanceof TextToken) && t.is_char_of(">|")) 
                    res.lev++;
                else {
                    pr = false;
                    let tok = MailLine.m_from_words.try_parse(t, TerminParseAttr.NO);
                    if (tok !== null && tok.end_token.next !== null && tok.end_token.next.is_char(':')) {
                        res.typ = MailLineTypes.FROM;
                        t = tok.end_token.next;
                        continue;
                    }
                }
            }
            if (t instanceof ReferentToken) {
                let r = t.get_referent();
                if (r !== null) {
                    if ((((r instanceof PersonReferent) || (r instanceof GeoReferent) || (r instanceof AddressReferent)) || r.type_name === "PHONE" || r.type_name === "URI") || (r instanceof PersonPropertyReferent) || r.type_name === "ORGANIZATION") 
                        res.refs.push(r);
                }
            }
        }
        if (res.typ === MailLineTypes.UNDEFINED) {
            let t = t0;
            for (; t !== null && (t.end_char < res.end_char); t = t.next) {
                if (!t.is_hiphen && t.chars.is_letter) 
                    break;
            }
            let ok = 0;
            let nams = 0;
            let oth = 0;
            let last_comma = null;
            for (; t !== null && (t.end_char < res.end_char); t = t.next) {
                if (t.get_referent() instanceof PersonReferent) {
                    nams++;
                    continue;
                }
                if (t instanceof TextToken) {
                    if (!t.chars.is_letter) {
                        last_comma = t;
                        continue;
                    }
                    let tok = MailLine.m_hello_words.try_parse(t, TerminParseAttr.NO);
                    if (tok !== null) {
                        ok++;
                        t = tok.end_token;
                        continue;
                    }
                    if (t.is_value("ВСЕ", null) || t.is_value("ALL", null) || t.is_value("TEAM", null)) {
                        nams++;
                        continue;
                    }
                    let pit = PersonItemToken.try_attach(t, null, PersonItemTokenParseAttr.NO, null);
                    if (pit !== null) {
                        nams++;
                        t = pit.end_token;
                        continue;
                    }
                }
                if ((++oth) > 3) {
                    if (ok > 0 && last_comma !== null) {
                        res.end_token = last_comma;
                        oth = 0;
                    }
                    break;
                }
            }
            if ((oth < 3) && ok > 0) 
                res.typ = MailLineTypes.HELLO;
        }
        if (res.typ === MailLineTypes.UNDEFINED) {
            let ok_words = 0;
            if (t0.is_value("HAVE", null)) {
            }
            for (let t = t0; t !== null && t.end_char <= res.end_char; t = t.next) {
                if (!((t instanceof TextToken))) 
                    continue;
                if (t.is_char('<')) {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        t = br.end_token;
                        continue;
                    }
                }
                if (!t.is_letters || t.is_table_control_char) 
                    continue;
                let tok = MailLine.m_regard_words.try_parse(t, TerminParseAttr.NO);
                if (tok !== null) {
                    ok_words++;
                    for (; t !== null && t.end_char <= tok.end_char; t = t.next) {
                        t.tag = tok.termin;
                    }
                    t = tok.end_token;
                    if ((t.next instanceof TextToken) && t.next.morph._case.is_genitive) {
                        for (t = t.next; t.end_char <= res.end_char; t = t.next) {
                            if (t.morph.class0.is_conjunction) 
                                continue;
                            let npt1 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                            if (npt1 === null) 
                                break;
                            if (!npt1.morph._case.is_genitive) 
                                break;
                            for (; t.end_char < npt1.end_char; t = t.next) {
                                t.tag = t;
                            }
                            t.tag = t;
                        }
                    }
                    continue;
                }
                if ((t.morph.class0.is_preposition || t.morph.class0.is_conjunction || t.morph.class0.is_misc) || t.is_value("C", null)) 
                    continue;
                if ((ok_words > 0 && t.previous !== null && t.previous.is_comma) && t.previous.begin_char > t0.begin_char && !t.chars.is_all_lower) {
                    res.end_token = t.previous;
                    break;
                }
                let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                if (npt === null) {
                    if ((res.end_char - t.end_char) > 10) 
                        ok_words = 0;
                    break;
                }
                tok = MailLine.m_regard_words.try_parse(npt.end_token, TerminParseAttr.NO);
                if (tok !== null && (npt.end_token instanceof TextToken)) {
                    let term = (npt.end_token).term;
                    if (term === "ДЕЛ") 
                        tok = null;
                }
                if (tok === null) {
                    if (npt.noun.is_value("НАДЕЖДА", null)) 
                        t.tag = t;
                    else if (ok_words > 0 && t.is_value("NICE", null) && ((res.end_char - npt.end_char) < 13)) 
                        t.tag = t;
                    else 
                        ok_words = 0;
                    break;
                }
                ok_words++;
                for (; t !== null && t.end_char <= tok.end_char; t = t.next) {
                    t.tag = tok.termin;
                }
                t = tok.end_token;
            }
            if (ok_words > 0) 
                res.typ = MailLineTypes.BESTREGARDS;
        }
        if (res.typ === MailLineTypes.UNDEFINED) {
            let t = t0;
            for (; t !== null && (t.end_char < res.end_char); t = t.next) {
                if (!((t instanceof TextToken))) 
                    break;
                else if (!t.is_hiphen && t.chars.is_letter) 
                    break;
            }
            if (t !== null) {
                if (t !== t0) {
                }
                if (((t.is_value("ПЕРЕСЫЛАЕМОЕ", null) || t.is_value("ПЕРЕАДРЕСОВАННОЕ", null))) && t.next !== null && t.next.is_value("СООБЩЕНИЕ", null)) {
                    res.typ = MailLineTypes.FROM;
                    res.must_be_first_line = true;
                }
                else if ((t.is_value("НАЧАЛО", null) && t.next !== null && ((t.next.is_value("ПЕРЕСЫЛАЕМОЕ", null) || t.next.is_value("ПЕРЕАДРЕСОВАННОЕ", null)))) && t.next.next !== null && t.next.next.is_value("СООБЩЕНИЕ", null)) {
                    res.typ = MailLineTypes.FROM;
                    res.must_be_first_line = true;
                }
                else if (t.is_value("ORIGINAL", null) && t.next !== null && ((t.next.is_value("MESSAGE", null) || t.next.is_value("APPOINTMENT", null)))) {
                    res.typ = MailLineTypes.FROM;
                    res.must_be_first_line = true;
                }
                else if (t.is_value("ПЕРЕСЛАНО", null) && t.next !== null && t.next.is_value("ПОЛЬЗОВАТЕЛЕМ", null)) {
                    res.typ = MailLineTypes.FROM;
                    res.must_be_first_line = true;
                }
                else if (((t.get_referent() !== null && t.get_referent().type_name === "DATE")) || ((t.is_value("IL", null) && t.next !== null && t.next.is_value("GIORNO", null))) || ((t.is_value("ON", null) && (t.next instanceof ReferentToken) && t.next.get_referent().type_name === "DATE"))) {
                    let has_from = false;
                    let has_date = t.get_referent() !== null && t.get_referent().type_name === "DATE";
                    if (t.is_newline_after && (_lev < 5)) {
                        let res1 = MailLine.parse(t.next, _lev + 1);
                        if (res1 !== null && res1.typ === MailLineTypes.HELLO) 
                            res.typ = MailLineTypes.FROM;
                    }
                    let _next = MailLine.parse(res.end_token.next, _lev + 1);
                    if (_next !== null) {
                        if (_next.typ !== MailLineTypes.UNDEFINED) 
                            _next = null;
                    }
                    let tmax = res.end_char;
                    if (_next !== null) 
                        tmax = _next.end_char;
                    let br1 = null;
                    for (; t !== null && t.end_char <= tmax; t = t.next) {
                        if (t.is_value("ОТ", null) || t.is_value("FROM", null)) 
                            has_from = true;
                        else if (t.get_referent() !== null && ((t.get_referent().type_name === "URI" || (t.get_referent() instanceof PersonReferent)))) {
                            if (t.get_referent().type_name === "URI" && has_date) {
                                if (br1 !== null) {
                                    has_from = true;
                                    _next = null;
                                }
                                if (t.previous.is_char('<') && t.next !== null && t.next.is_char('>')) {
                                    t = t.next;
                                    if (t.next !== null && t.next.is_char(':')) 
                                        t = t.next;
                                    if (t.is_newline_after) {
                                        has_from = true;
                                        _next = null;
                                    }
                                }
                            }
                            for (t = t.next; t !== null && t.end_char <= res.end_char; t = t.next) {
                                if (t.is_value("HA", null) && t.next !== null && t.next.is_value("SCRITTO", null)) {
                                    has_from = true;
                                    break;
                                }
                                else if (((t.is_value("НАПИСАТЬ", null) || t.is_value("WROTE", null))) && ((res.end_char - t.end_char) < 10)) {
                                    has_from = true;
                                    break;
                                }
                            }
                            if (has_from) {
                                res.typ = MailLineTypes.FROM;
                                if (_next !== null && t.end_char >= _next.begin_char) 
                                    res.end_token = _next.end_token;
                            }
                            break;
                        }
                        else if (br1 === null && !t.is_char('<') && BracketHelper.can_be_start_of_sequence(t, true, false)) {
                            br1 = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                            if (br1 !== null) 
                                t = br1.end_token;
                        }
                    }
                }
                else {
                    let has_uri = false;
                    for (; t !== null && (t.end_char < res.end_char); t = t.next) {
                        if (t.get_referent() !== null && ((t.get_referent().type_name === "URI" || (t.get_referent() instanceof PersonReferent)))) 
                            has_uri = true;
                        else if (t.is_value("ПИСАТЬ", null) && has_uri) {
                            if (t.next !== null && t.next.is_char('(')) {
                                if (has_uri) 
                                    res.typ = MailLineTypes.FROM;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return res;
    }
    
    static is_keyword(t) {
        if (t === null) 
            return false;
        if (MailLine.m_regard_words.try_parse(t, TerminParseAttr.NO) !== null) 
            return true;
        if (MailLine.m_from_words.try_parse(t, TerminParseAttr.NO) !== null) 
            return true;
        if (MailLine.m_hello_words.try_parse(t, TerminParseAttr.NO) !== null) 
            return true;
        return false;
    }
    
    static initialize() {
        if (MailLine.m_regard_words !== null) 
            return;
        MailLine.m_regard_words = new TerminCollection();
        for (const s of ["УВАЖЕНИЕ", "ПОЧТЕНИЕ", "С УВАЖЕНИЕМ", "ПОЖЕЛАНИE", "ДЕНЬ", "ХОРОШЕГО ДНЯ", "ИСКРЕННЕ ВАШ", "УДАЧА", "СПАСИБО", "ЦЕЛОВАТЬ", "ПОВАГА", "З ПОВАГОЮ", "ПОБАЖАННЯ", "ДЕНЬ", "ЩИРО ВАШ", "ДЯКУЮ", "ЦІЛУВАТИ", "BEST REGARDS", "REGARDS", "BEST WISHES", "KIND REGARDS", "GOOD BYE", "BYE", "THANKS", "THANK YOU", "MANY THANKS", "DAY", "VERY MUCH", "HAVE", "LUCK", "Yours sincerely", "sincerely Yours", "Looking forward", "Ar cieņu"]) {
            MailLine.m_regard_words.add(new Termin(s.toUpperCase()));
        }
        MailLine.m_from_words = new TerminCollection();
        for (const s of ["FROM", "TO", "CC", "SENT", "SUBJECT", "SENDER", "TIME", "ОТ КОГО", "КОМУ", "ДАТА", "ТЕМА", "КОПИЯ", "ОТ", "ОТПРАВЛЕНО", "WHEN", "WHERE"]) {
            MailLine.m_from_words.add(new Termin(s));
        }
        MailLine.m_hello_words = new TerminCollection();
        for (const s of ["HI", "HELLO", "DEAR", "GOOD MORNING", "GOOD DAY", "GOOD EVENING", "GOOD NIGHT", "ЗДРАВСТВУЙ", "ЗДРАВСТВУЙТЕ", "ПРИВЕТСТВУЮ", "ПРИВЕТ", "ПРИВЕТИК", "УВАЖАЕМЫЙ", "ДОРОГОЙ", "ЛЮБЕЗНЫЙ", "ДОБРОЕ УТРО", "ДОБРЫЙ ДЕНЬ", "ДОБРЫЙ ВЕЧЕР", "ДОБРОЙ НОЧИ", "ЗДРАСТУЙ", "ЗДРАСТУЙТЕ", "ВІТАЮ", "ПРИВІТ", "ПРИВІТ", "ШАНОВНИЙ", "ДОРОГИЙ", "ЛЮБИЙ", "ДОБРОГО РАНКУ", "ДОБРИЙ ДЕНЬ", "ДОБРИЙ ВЕЧІР", "ДОБРОЇ НОЧІ"]) {
            MailLine.m_hello_words.add(new Termin(s));
        }
    }
    
    static static_constructor() {
        MailLine.m_regard_words = null;
        MailLine.m_from_words = null;
        MailLine.m_hello_words = null;
    }
}


MailLine.static_constructor();

module.exports = MailLine