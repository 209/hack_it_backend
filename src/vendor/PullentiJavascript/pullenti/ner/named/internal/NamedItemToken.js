/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const MorphClass = require("./../../../morph/MorphClass");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const MetaToken = require("./../../MetaToken");
const TerminCollection = require("./../../core/TerminCollection");
const MorphGender = require("./../../../morph/MorphGender");
const TextToken = require("./../../TextToken");
const MiscHelper = require("./../../core/MiscHelper");
const Termin = require("./../../core/Termin");
const ReferentToken = require("./../../ReferentToken");
const GetTextAttr = require("./../../core/GetTextAttr");
const NamedEntityKind = require("./../NamedEntityKind");
const GeoReferent = require("./../../geo/GeoReferent");
const MiscLocationHelper = require("./../../geo/internal/MiscLocationHelper");
const BracketHelper = require("./../../core/BracketHelper");
const TerminParseAttr = require("./../../core/TerminParseAttr");

class NamedItemToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.kind = NamedEntityKind.UNDEFINED;
        this.name_value = null;
        this.type_value = null;
        this.ref = null;
        this.is_wellknown = false;
        this.is_in_bracket = false;
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.kind !== NamedEntityKind.UNDEFINED) 
            res.append(" [").append(String(this.kind)).append("]");
        if (this.is_wellknown) 
            res.append(" (!)");
        if (this.is_in_bracket) 
            res.append(" [br]");
        if (this.type_value !== null) 
            res.append(" ").append(this.type_value);
        if (this.name_value !== null) 
            res.append(" \"").append(this.name_value).append("\"");
        if (this.ref !== null) 
            res.append(" -> ").append(this.ref.toString());
        return res.toString();
    }
    
    static try_parse_list(t, loc_onto) {
        let ne = NamedItemToken.try_parse(t, loc_onto);
        if (ne === null) 
            return null;
        let res = new Array();
        res.push(ne);
        for (t = ne.end_token.next; t !== null; t = t.next) {
            if (t.whitespaces_before_count > 2) 
                break;
            ne = NamedItemToken.try_parse(t, loc_onto);
            if (ne === null) 
                break;
            if (t.is_value("НЕТ", null)) 
                break;
            res.push(ne);
            t = ne.end_token;
        }
        return res;
    }
    
    static try_parse(t, loc_onto) {
        if (t === null) 
            return null;
        if (t instanceof ReferentToken) {
            let r = t.get_referent();
            if ((r.type_name === "PERSON" || r.type_name === "PERSONPROPERTY" || (r instanceof GeoReferent)) || r.type_name === "ORGANIZATION") 
                return NamedItemToken._new1749(t, t, r, t.morph);
            return null;
        }
        let typ = NamedItemToken.m_types.try_parse(t, TerminParseAttr.NO);
        let nam = NamedItemToken.m_names.try_parse(t, TerminParseAttr.NO);
        if (typ !== null) {
            if (!((t instanceof TextToken))) 
                return null;
            let res = NamedItemToken._new1750(typ.begin_token, typ.end_token, typ.morph, typ.chars);
            res.kind = NamedEntityKind.of(typ.termin.tag);
            res.type_value = typ.termin.canonic_text;
            if ((nam !== null && nam.end_token === typ.end_token && !t.chars.is_all_lower) && (NamedEntityKind.of(nam.termin.tag)) === res.kind) {
                res.name_value = nam.termin.canonic_text;
                res.is_wellknown = true;
            }
            return res;
        }
        if (nam !== null) {
            if (nam.begin_token.chars.is_all_lower) 
                return null;
            let res = NamedItemToken._new1750(nam.begin_token, nam.end_token, nam.morph, nam.chars);
            res.kind = NamedEntityKind.of(nam.termin.tag);
            res.name_value = nam.termin.canonic_text;
            let ok = true;
            if (!t.is_whitespace_before && t.previous !== null) 
                ok = false;
            else if (!t.is_whitespace_after && t.next !== null) {
                if (t.next.is_char_of(",.;!?") && t.next.is_whitespace_after) {
                }
                else 
                    ok = false;
            }
            if (ok) {
                res.is_wellknown = true;
                res.type_value = Utils.asString(nam.termin.tag2);
            }
            return res;
        }
        let adj = MiscLocationHelper.try_attach_nord_west(t);
        if (adj !== null) {
            if (adj.morph.class0.is_noun) {
                if (adj.end_token.is_value("ВОСТОК", null)) {
                    if (adj.begin_token === adj.end_token) 
                        return null;
                    let re = NamedItemToken._new1752(t, adj.end_token, adj.morph);
                    re.kind = NamedEntityKind.LOCATION;
                    re.name_value = MiscHelper.get_text_value(t, adj.end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                    re.is_wellknown = true;
                    return re;
                }
                return null;
            }
            if (adj.whitespaces_after_count > 2) 
                return null;
            if ((adj.end_token.next instanceof ReferentToken) && (adj.end_token.next.get_referent() instanceof GeoReferent)) {
                let re = NamedItemToken._new1752(t, adj.end_token.next, adj.end_token.next.morph);
                re.kind = NamedEntityKind.LOCATION;
                re.name_value = MiscHelper.get_text_value(t, adj.end_token.next, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                re.is_wellknown = true;
                re.ref = adj.end_token.next.get_referent();
                return re;
            }
            let res = NamedItemToken.try_parse(adj.end_token.next, loc_onto);
            if (res !== null && res.kind === NamedEntityKind.LOCATION) {
                let s = adj.get_normal_case_text(MorphClass.ADJECTIVE, true, res.morph.gender, false);
                if (s !== null) {
                    if (res.name_value === null) 
                        res.name_value = s.toUpperCase();
                    else {
                        res.name_value = (s.toUpperCase() + " " + res.name_value);
                        res.type_value = null;
                    }
                    res.begin_token = t;
                    res.chars = t.chars;
                    res.is_wellknown = true;
                    return res;
                }
            }
        }
        if (t.chars.is_capital_upper && !MiscHelper.can_be_start_of_sentence(t)) {
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.adjectives.length > 0) {
                let test = NamedItemToken.try_parse(npt.noun.begin_token, loc_onto);
                if (test !== null && test.end_token === npt.end_token && test.type_value !== null) {
                    test.begin_token = t;
                    let tmp = new StringBuilder();
                    for (const a of npt.adjectives) {
                        let s = a.get_normal_case_text(MorphClass.ADJECTIVE, true, test.morph.gender, false);
                        if (tmp.length > 0) 
                            tmp.append(' ');
                        tmp.append(s);
                    }
                    test.name_value = tmp.toString();
                    test.chars = t.chars;
                    if (test.kind === NamedEntityKind.LOCATION) 
                        test.is_wellknown = true;
                    return test;
                }
            }
        }
        if ((BracketHelper.is_bracket(t, true) && t.next !== null && t.next.chars.is_letter) && !t.next.chars.is_all_lower) {
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (br !== null) {
                let res = new NamedItemToken(t, br.end_token);
                res.is_in_bracket = true;
                res.name_value = MiscHelper.get_text_value(t, br.end_token, GetTextAttr.NO);
                nam = NamedItemToken.m_names.try_parse(t.next, TerminParseAttr.NO);
                if (nam !== null && nam.end_token === br.end_token.previous) {
                    res.kind = NamedEntityKind.of(nam.termin.tag);
                    res.is_wellknown = true;
                    res.name_value = nam.termin.canonic_text;
                }
                return res;
            }
        }
        if (((t instanceof TextToken) && t.chars.is_letter && !t.chars.is_all_lower) && t.length_char > 2) {
            let res = NamedItemToken._new1752(t, t, t.morph);
            let str = (t).term;
            if (str.endsWith("О") || str.endsWith("И") || str.endsWith("Ы")) 
                res.name_value = str;
            else 
                res.name_value = t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
            res.chars = t.chars;
            if (((!t.is_whitespace_after && t.next !== null && t.next.is_hiphen) && (t.next.next instanceof TextToken) && !t.next.next.is_whitespace_after) && t.chars.is_cyrillic_letter === t.next.next.chars.is_cyrillic_letter) {
                t = res.end_token = t.next.next;
                res.name_value = (res.name_value + "-" + t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
            }
            return res;
        }
        return null;
    }
    
    static initialize() {
        if (NamedItemToken.m_types !== null) 
            return;
        NamedItemToken.m_types = new TerminCollection();
        NamedItemToken.m_names = new TerminCollection();
        let t = null;
        for (const s of ["ПЛАНЕТА", "ЗВЕЗДА", "КОМЕТА", "МЕТЕОРИТ", "СОЗВЕЗДИЕ", "ГАЛАКТИКА"]) {
            t = new Termin();
            t.init_by_normal_text(s, null);
            t.tag = NamedEntityKind.PLANET;
            NamedItemToken.m_types.add(t);
        }
        for (const s of ["СОЛНЦЕ", "МЕРКУРИЙ", "ВЕНЕРА", "ЗЕМЛЯ", "МАРС", "ЮПИТЕР", "САТУРН", "УРАН", "НЕПТУН", "ПЛУТОН", "ЛУНА", "ДЕЙМОС", "ФОБОС", "Ио", "Ганимед", "Каллисто"]) {
            t = new Termin();
            t.init_by_normal_text(s.toUpperCase(), null);
            t.tag = NamedEntityKind.PLANET;
            NamedItemToken.m_names.add(t);
        }
        for (const s of ["РЕКА", "ОЗЕРО", "МОРЕ", "ОКЕАН", "ЗАЛИВ", "ПРОЛИВ", "ПОБЕРЕЖЬЕ", "КОНТИНЕНТ", "ОСТРОВ", "ПОЛУОСТРОВ", "МЫС", "ГОРА", "ГОРНЫЙ ХРЕБЕТ", "ПЕРЕВАЛ", "ЛЕС", "САД", "ЗАПОВЕДНИК", "ЗАКАЗНИК", "ДОЛИНА", "УЩЕЛЬЕ", "РАВНИНА", "БЕРЕГ"]) {
            t = new Termin();
            t.init_by_normal_text(s, null);
            t.tag = NamedEntityKind.LOCATION;
            NamedItemToken.m_types.add(t);
        }
        for (const s of ["ТИХИЙ", "АТЛАНТИЧЕСКИЙ", "ИНДИЙСКИЙ", "СЕВЕРО-ЛЕДОВИТЫЙ"]) {
            t = new Termin();
            t.init_by_normal_text(s, null);
            t.tag = NamedEntityKind.LOCATION;
            t.tag2 = "океан";
            NamedItemToken.m_names.add(t);
        }
        for (const s of ["ЕВРАЗИЯ", "АФРИКА", "АМЕРИКА", "АВСТРАЛИЯ", "АНТАРКТИДА"]) {
            t = new Termin();
            t.init_by_normal_text(s, null);
            t.tag = NamedEntityKind.LOCATION;
            t.tag2 = "континент";
            NamedItemToken.m_names.add(t);
        }
        for (const s of ["ВОЛГА", "НЕВА", "АМУР", "ОБЪ", "АНГАРА", "ЛЕНА", "ИРТЫШ", "ДНЕПР", "ДОН", "ДНЕСТР", "РЕЙН", "АМУДАРЬЯ", "СЫРДАРЬЯ", "ТИГР", "ЕВФРАТ", "ИОРДАН", "МИССИСИПИ", "АМАЗОНКА", "ТЕМЗА", "СЕНА", "НИЛ", "ЯНЦЗЫ", "ХУАНХЭ", "ПАРАНА", "МЕКОНГ", "МАККЕНЗИ", "НИГЕР", "ЕНИСЕЙ", "МУРРЕЙ", "САЛУИН", "ИНД", "РИО-ГРАНДЕ", "БРАХМАПУТРА", "ДАРЛИНГ", "ДУНАЙ", "ЮКОН", "ГАНГ", "МАРРАМБИДЖИ", "ЗАМБЕЗИ", "ТОКАНТИС", "ОРИНОКО", "СИЦЗЯН", "КОЛЫМА", "КАМА", "ОКА", "ЭЛЬЮА", "ВИСЛА", "ДАУГАВА", "ЗАПАДНАЯ ДВИНА", "НЕМАН", "МЕЗЕНЬ", "КУБАНЬ", "ЮЖНЫЙ БУГ"]) {
            t = new Termin();
            t.init_by_normal_text(s, null);
            t.tag = NamedEntityKind.LOCATION;
            t.tag2 = "река";
            NamedItemToken.m_names.add(t);
        }
        for (const s of ["ЕВРОПА", "АЗИЯ", "АРКТИКА", "КАВКАЗ", "ПРИБАЛТИКА", "СИБИРЬ", "ЗАПОЛЯРЬЕ", "ЧУКОТКА", "ПРИБАЛТИКА", "БАЛКАНЫ", "СКАНДИНАВИЯ", "ОКЕАНИЯ", "АЛЯСКА", "УРАЛ", "ПОВОЛЖЬЕ", "ПРИМОРЬЕ", "КУРИЛЫ", "ТИБЕТ", "ГИМАЛАИ", "АЛЬПЫ", "САХАРА", "ГОБИ", "СИНАЙ", "БАЙКОНУР", "ЧЕРНОБЫЛЬ", "САДОВОЕ КОЛЬЦО", "СТАРЫЙ ГОРОД"]) {
            t = new Termin();
            t.init_by_normal_text(s, null);
            t.tag = NamedEntityKind.LOCATION;
            NamedItemToken.m_names.add(t);
        }
        for (const s of ["ПАМЯТНИК", "МОНУМЕНТ", "МЕМОРИАЛ", "БЮСТ", "ОБЕЛИСК"]) {
            t = new Termin();
            t.init_by_normal_text(s, null);
            t.tag = NamedEntityKind.MONUMENT;
            NamedItemToken.m_types.add(t);
        }
        for (const s of ["ДВОРЕЦ", "КРЕМЛЬ", "ЗАМОК", "УСАДЬБА", "ДОМ", "ЗДАНИЕ", "ШТАБ-КВАРТИРА", "ЖЕЛЕЗНОДОРОЖНЫЙ ВОКЗАЛ", "ВОКЗАЛ", "АВТОВОКЗАЛ", "АЭРОПОРТ", "АЭРОДРОМ"]) {
            t = new Termin();
            t.init_by_normal_text(s, null);
            t.tag = NamedEntityKind.BUILDING;
            NamedItemToken.m_types.add(t);
        }
        for (const s of ["КРЕМЛЬ", "КАПИТОЛИЙ", "БЕЛЫЙ ДОМ"]) {
            t = new Termin();
            t.init_by_normal_text(s, null);
            t.tag = NamedEntityKind.BUILDING;
            NamedItemToken.m_names.add(t);
        }
        t = Termin._new119("МЕЖДУНАРОДНАЯ КОСМИЧЕСКАЯ СТАНЦИЯ", NamedEntityKind.BUILDING);
        t.acronym = "МКС";
        NamedItemToken.m_names.add(t);
    }
    
    static _new1749(_arg1, _arg2, _arg3, _arg4) {
        let res = new NamedItemToken(_arg1, _arg2);
        res.ref = _arg3;
        res.morph = _arg4;
        return res;
    }
    
    static _new1750(_arg1, _arg2, _arg3, _arg4) {
        let res = new NamedItemToken(_arg1, _arg2);
        res.morph = _arg3;
        res.chars = _arg4;
        return res;
    }
    
    static _new1752(_arg1, _arg2, _arg3) {
        let res = new NamedItemToken(_arg1, _arg2);
        res.morph = _arg3;
        return res;
    }
    
    static static_constructor() {
        NamedItemToken.m_types = null;
        NamedItemToken.m_names = null;
    }
}


NamedItemToken.static_constructor();

module.exports = NamedItemToken