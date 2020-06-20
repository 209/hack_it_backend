/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const TextToken = require("./../../TextToken");
const Termin = require("./../../core/Termin");
const MiscHelper = require("./../../core/MiscHelper");
const AddressReferent = require("./../../address/AddressReferent");
const TerminCollection = require("./../../core/TerminCollection");
const GeoReferent = require("./../../geo/GeoReferent");
const MetaToken = require("./../../MetaToken");
const NumberHelper = require("./../../core/NumberHelper");
const Referent = require("./../../Referent");
const NumberToken = require("./../../NumberToken");
const ReferentToken = require("./../../ReferentToken");
const PersonIdentityReferent = require("./../PersonIdentityReferent");
const PersonIdTokenTyps = require("./PersonIdTokenTyps");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const PersonPropertyReferent = require("./../PersonPropertyReferent");
const PersonAttrTokenPersonAttrAttachAttrs = require("./PersonAttrTokenPersonAttrAttachAttrs");
const PersonAttrToken = require("./PersonAttrToken");

class PersonIdToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = PersonIdTokenTyps.KEYWORD;
        this.value = null;
        this.referent = null;
        this.has_prefix = false;
    }
    
    static try_attach(t) {
        if (t === null || !t.chars.is_letter) 
            return null;
        let noun = PersonIdToken.try_parse(t, null);
        if (noun === null) 
            return null;
        let li = new Array();
        for (t = noun.end_token.next; t !== null; t = t.next) {
            if (t.is_table_control_char) 
                break;
            if (t.is_char_of(",:")) 
                continue;
            let idt = PersonIdToken.try_parse(t, (li.length > 0 ? li[li.length - 1] : noun));
            if (idt === null) {
                if (t.is_value("ОТДЕЛ", null) || t.is_value("ОТДЕЛЕНИЕ", null)) 
                    continue;
                break;
            }
            if (idt.typ === PersonIdTokenTyps.KEYWORD) 
                break;
            li.push(idt);
            t = idt.end_token;
        }
        if (li.length === 0) 
            return null;
        let num = null;
        let i = 0;
        if (li[0].typ === PersonIdTokenTyps.NUMBER) {
            if (li.length > 1 && li[1].typ === PersonIdTokenTyps.NUMBER && li[1].has_prefix) {
                num = li[0].value + li[1].value;
                i = 2;
            }
            else {
                num = li[0].value;
                i = 1;
            }
        }
        else if (li[0].typ === PersonIdTokenTyps.SERIA && li.length > 1 && li[1].typ === PersonIdTokenTyps.NUMBER) {
            num = li[0].value + li[1].value;
            i = 2;
        }
        else if (li[0].typ === PersonIdTokenTyps.SERIA && li[0].value.length > 5) {
            num = li[0].value;
            i = 1;
        }
        else 
            return null;
        let pid = new PersonIdentityReferent();
        pid.typ = noun.value.toLowerCase();
        pid.number = num;
        if (noun.referent instanceof GeoReferent) 
            pid.state = noun.referent;
        for (; i < li.length; i++) {
            if (li[i].typ === PersonIdTokenTyps.VIDAN || li[i].typ === PersonIdTokenTyps.CODE) {
            }
            else if (li[i].typ === PersonIdTokenTyps.DATE && li[i].referent !== null) {
                if (pid.find_slot(PersonIdentityReferent.ATTR_DATE, null, true) !== null) 
                    break;
                pid.add_slot(PersonIdentityReferent.ATTR_DATE, li[i].referent, false, 0);
            }
            else if (li[i].typ === PersonIdTokenTyps.ADDRESS && li[i].referent !== null) {
                if (pid.find_slot(PersonIdentityReferent.ATTR_ADDRESS, null, true) !== null) 
                    break;
                pid.add_slot(PersonIdentityReferent.ATTR_ADDRESS, li[i].referent, false, 0);
            }
            else if (li[i].typ === PersonIdTokenTyps.ORG && li[i].referent !== null) {
                if (pid.find_slot(PersonIdentityReferent.ATTR_ORG, null, true) !== null) 
                    break;
                pid.add_slot(PersonIdentityReferent.ATTR_ORG, li[i].referent, false, 0);
            }
            else 
                break;
        }
        return new ReferentToken(pid, noun.begin_token, li[i - 1].end_token);
    }
    
    static try_parse(t, prev) {
        if (t.is_value("СВИДЕТЕЛЬСТВО", null)) {
            let tt1 = t;
            let ip = false;
            let reg = false;
            for (let tt = t.next; tt !== null; tt = tt.next) {
                if (tt.is_comma_and || tt.morph.class0.is_preposition) 
                    continue;
                if (tt.is_value("РЕГИСТРАЦИЯ", null) || tt.is_value("РЕЕСТР", null) || tt.is_value("ЗАРЕГИСТРИРОВАТЬ", null)) {
                    reg = true;
                    tt1 = tt;
                }
                else if (tt.is_value("ИНДИВИДУАЛЬНЫЙ", null) || tt.is_value("ИП", null)) {
                    ip = true;
                    tt1 = tt;
                }
                else if ((tt.is_value("ВНЕСЕНИЕ", null) || tt.is_value("ГОСУДАРСТВЕННЫЙ", null) || tt.is_value("ЕДИНЫЙ", null)) || tt.is_value("ЗАПИСЬ", null) || tt.is_value("ПРЕДПРИНИМАТЕЛЬ", null)) 
                    tt1 = tt;
                else if (tt.get_referent() !== null && tt.get_referent().type_name === "DATERANGE") 
                    tt1 = tt;
                else 
                    break;
            }
            if (reg && ip) 
                return PersonIdToken._new2494(t, tt1, PersonIdTokenTyps.KEYWORD, "СВИДЕТЕЛЬСТВО О ГОСУДАРСТВЕННОЙ РЕГИСТРАЦИИ ФИЗИЧЕСКОГО ЛИЦА В КАЧЕСТВЕ ИНДИВИДУАЛЬНОГО ПРЕДПРИНИМАТЕЛЯ");
        }
        let tok = PersonIdToken.m_ontology.try_parse(t, TerminParseAttr.NO);
        if (tok !== null) {
            let ty = PersonIdTokenTyps.of(tok.termin.tag);
            let res = PersonIdToken._new2494(tok.begin_token, tok.end_token, ty, tok.termin.canonic_text);
            if (prev === null) {
                if (ty !== PersonIdTokenTyps.KEYWORD) 
                    return null;
                for (t = tok.end_token.next; t !== null; t = t.next) {
                    let r = t.get_referent();
                    if (r !== null && (r instanceof GeoReferent)) {
                        res.referent = r;
                        res.end_token = t;
                        continue;
                    }
                    if (t.is_value("ГРАЖДАНИН", null) && t.next !== null && (t.next.get_referent() instanceof GeoReferent)) {
                        res.referent = t.next.get_referent();
                        t = res.end_token = t.next;
                        continue;
                    }
                    if (r !== null) 
                        break;
                    let ait = PersonAttrToken.try_attach(t, null, PersonAttrTokenPersonAttrAttachAttrs.NO);
                    if (ait !== null) {
                        if (ait.referent !== null) {
                            for (const s of ait.referent.slots) {
                                if (s.type_name === PersonPropertyReferent.ATTR_REF && (s.value instanceof GeoReferent)) 
                                    res.referent = Utils.as(s.value, Referent);
                            }
                        }
                        res.end_token = ait.end_token;
                        break;
                    }
                    if (t.is_value("ДАННЫЙ", null)) {
                        res.end_token = t;
                        continue;
                    }
                    break;
                }
                if ((res.referent instanceof GeoReferent) && !(res.referent).is_state) 
                    res.referent = null;
                return res;
            }
            if (ty === PersonIdTokenTyps.NUMBER) {
                let tmp = new StringBuilder();
                let tt = tok.end_token.next;
                if (tt !== null && tt.is_char(':')) 
                    tt = tt.next;
                for (; tt !== null; tt = tt.next) {
                    if (tt.is_newline_before) 
                        break;
                    if (!((tt instanceof NumberToken))) 
                        break;
                    tmp.append(tt.get_source_text());
                    res.end_token = tt;
                }
                if (tmp.length < 1) 
                    return null;
                res.value = tmp.toString();
                res.has_prefix = true;
                return res;
            }
            if (ty === PersonIdTokenTyps.SERIA) {
                let tmp = new StringBuilder();
                let tt = tok.end_token.next;
                if (tt !== null && tt.is_char(':')) 
                    tt = tt.next;
                let next_num = false;
                for (; tt !== null; tt = tt.next) {
                    if (tt.is_newline_before) 
                        break;
                    if (MiscHelper.check_number_prefix(tt) !== null) {
                        next_num = true;
                        break;
                    }
                    if (!((tt instanceof NumberToken))) {
                        if (!((tt instanceof TextToken))) 
                            break;
                        if (!tt.chars.is_all_upper) 
                            break;
                        let nu = NumberHelper.try_parse_roman(tt);
                        if (nu !== null) {
                            tmp.append(nu.get_source_text());
                            tt = nu.end_token;
                        }
                        else if (tt.length_char !== 2) 
                            break;
                        else {
                            tmp.append((tt).term);
                            res.end_token = tt;
                        }
                        if (tt.next !== null && tt.next.is_hiphen) 
                            tt = tt.next;
                        continue;
                    }
                    if (tmp.length >= 4) 
                        break;
                    tmp.append(tt.get_source_text());
                    res.end_token = tt;
                }
                if (tmp.length < 4) {
                    if (tmp.length < 2) 
                        return null;
                    let tt1 = res.end_token.next;
                    if (tt1 !== null && tt1.is_comma) 
                        tt1 = tt1.next;
                    let _next = PersonIdToken.try_parse(tt1, res);
                    if (_next !== null && _next.typ === PersonIdTokenTyps.NUMBER) {
                    }
                    else 
                        return null;
                }
                res.value = tmp.toString();
                res.has_prefix = true;
                return res;
            }
            if (ty === PersonIdTokenTyps.CODE) {
                for (let tt = res.end_token.next; tt !== null; tt = tt.next) {
                    if (tt.is_char_of(":") || tt.is_hiphen) 
                        continue;
                    if (tt instanceof NumberToken) {
                        res.end_token = tt;
                        continue;
                    }
                    break;
                }
            }
            if (ty === PersonIdTokenTyps.ADDRESS) {
                if (t.get_referent() instanceof AddressReferent) {
                    res.referent = t.get_referent();
                    res.end_token = t;
                    return res;
                }
                for (let tt = res.end_token.next; tt !== null; tt = tt.next) {
                    if (tt.is_char_of(":") || tt.is_hiphen || tt.morph.class0.is_preposition) 
                        continue;
                    if (tt.get_referent() instanceof AddressReferent) {
                        res.referent = tt.get_referent();
                        res.end_token = tt;
                    }
                    break;
                }
                if (res.referent === null) 
                    return null;
            }
            return res;
        }
        else if (prev === null) 
            return null;
        let t0 = t;
        let t1 = MiscHelper.check_number_prefix(t0);
        if (t1 !== null) 
            t = t1;
        if (t instanceof NumberToken) {
            let tmp = new StringBuilder();
            let res = PersonIdToken._new2496(t0, t, PersonIdTokenTyps.NUMBER);
            for (let tt = t; tt !== null; tt = tt.next) {
                if (tt.is_newline_before || !((tt instanceof NumberToken))) 
                    break;
                tmp.append(tt.get_source_text());
                res.end_token = tt;
            }
            if (tmp.length < 4) {
                if (tmp.length < 2) 
                    return null;
                if (prev === null || prev.typ !== PersonIdTokenTyps.KEYWORD) 
                    return null;
                let ne = PersonIdToken.try_parse(res.end_token.next, prev);
                if (ne !== null && ne.typ === PersonIdTokenTyps.NUMBER) 
                    res.typ = PersonIdTokenTyps.SERIA;
                else 
                    return null;
            }
            res.value = tmp.toString();
            if (t0 !== t) 
                res.has_prefix = true;
            return res;
        }
        if (t instanceof ReferentToken) {
            let r = t.get_referent();
            if (r !== null) {
                if (r.type_name === "DATE") 
                    return PersonIdToken._new2497(t, t, PersonIdTokenTyps.DATE, r);
                if (r.type_name === "ORGANIZATION") 
                    return PersonIdToken._new2497(t, t, PersonIdTokenTyps.ORG, r);
                if (r.type_name === "ADDRESS") 
                    return PersonIdToken._new2497(t, t, PersonIdTokenTyps.ADDRESS, r);
            }
        }
        if ((prev !== null && prev.typ === PersonIdTokenTyps.KEYWORD && (t instanceof TextToken)) && !t.chars.is_all_lower && t.chars.is_letter) {
            let rr = PersonIdToken.try_parse(t.next, prev);
            if (rr !== null && rr.typ === PersonIdTokenTyps.NUMBER) 
                return PersonIdToken._new2494(t, t, PersonIdTokenTyps.SERIA, (t).term);
        }
        if ((t !== null && t.is_value("ОТ", "ВІД") && (t.next instanceof ReferentToken)) && t.next.get_referent().type_name === "DATE") 
            return PersonIdToken._new2497(t, t.next, PersonIdTokenTyps.DATE, t.next.get_referent());
        return null;
    }
    
    static initialize() {
        if (PersonIdToken.m_ontology !== null) 
            return;
        PersonIdToken.m_ontology = new TerminCollection();
        let t = null;
        t = Termin._new119("ПАСПОРТ", PersonIdTokenTyps.KEYWORD);
        t.add_variant("ПАССПОРТ", false);
        t.add_variant("ПАСПОРТНЫЕ ДАННЫЕ", false);
        t.add_variant("ВНУТРЕННИЙ ПАСПОРТ", false);
        PersonIdToken.m_ontology.add(t);
        t = Termin._new119("ЗАГРАНИЧНЫЙ ПАСПОРТ", PersonIdTokenTyps.KEYWORD);
        t.add_variant("ЗАГРАНПАСПОРТ", false);
        t.add_abridge("ЗАГРАН. ПАСПОРТ");
        PersonIdToken.m_ontology.add(t);
        t = Termin._new119("УДОСТОВЕРЕНИЕ ЛИЧНОСТИ", PersonIdTokenTyps.KEYWORD);
        t.add_variant("УДОСТОВЕРЕНИЕ ЛИЧНОСТИ ОФИЦЕРА", false);
        PersonIdToken.m_ontology.add(t);
        t = Termin._new119("СВИДЕТЕЛЬСТВО О ГОСУДАРСТВЕННОЙ РЕГИСТРАЦИИ ФИЗИЧЕСКОГО ЛИЦА В КАЧЕСТВЕ ИНДИВИДУАЛЬНОГО ПРЕДПРИНИМАТЕЛЯ", PersonIdTokenTyps.KEYWORD);
        t.add_variant("СВИДЕТЕЛЬСТВО О ГОСУДАРСТВЕННОЙ РЕГИСТРАЦИИ ФИЗИЧЕСКОГО ЛИЦА В КАЧЕСТВЕ ИП", false);
        t.add_variant("СВИДЕТЕЛЬСТВО О ГОСРЕГИСТРАЦИИ ФИЗЛИЦА В КАЧЕСТВЕ ИП", false);
        t.add_variant("СВИДЕТЕЛЬСТВО ГОСУДАРСТВЕННОЙ РЕГИСТРАЦИИ", false);
        PersonIdToken.m_ontology.add(t);
        t = Termin._new119("ВОДИТЕЛЬСКОЕ УДОСТОВЕРЕНИЕ", PersonIdTokenTyps.KEYWORD);
        PersonIdToken.m_ontology.add(t);
        t = Termin._new119("ЛИЦЕНЗИЯ", PersonIdTokenTyps.KEYWORD);
        PersonIdToken.m_ontology.add(t);
        t = Termin._new119("СЕРИЯ", PersonIdTokenTyps.SERIA);
        t.add_abridge("СЕР.");
        t.add_variant("СЕРИ", false);
        PersonIdToken.m_ontology.add(t);
        t = Termin._new119("НОМЕР", PersonIdTokenTyps.NUMBER);
        t.add_abridge("НОМ.");
        t.add_abridge("Н-Р");
        t.add_variant("№", false);
        t.add_variant("N", false);
        PersonIdToken.m_ontology.add(t);
        t = Termin._new119("ВЫДАТЬ", PersonIdTokenTyps.VIDAN);
        t.add_variant("ВЫДАВАТЬ", false);
        t.add_variant("ДАТА ВЫДАЧИ", false);
        t.add_variant("ДАТА РЕГИСТРАЦИИ", false);
        PersonIdToken.m_ontology.add(t);
        t = Termin._new119("КОД ПОДРАЗДЕЛЕНИЯ", PersonIdTokenTyps.CODE);
        t.add_abridge("К/П");
        t.add_abridge("К.П.");
        PersonIdToken.m_ontology.add(t);
        t = Termin._new119("РЕГИСТРАЦИЯ", PersonIdTokenTyps.ADDRESS);
        t.add_variant("ЗАРЕГИСТРИРОВАН", false);
        t.add_variant("АДРЕС РЕГИСТРАЦИИ", false);
        t.add_variant("ЗАРЕГИСТРИРОВАННЫЙ", false);
        t.add_abridge("ПРОПИСАН");
        t.add_variant("АДРЕС ПРОПИСКИ", false);
        t.add_variant("АДРЕС ПО ПРОПИСКЕ", false);
        PersonIdToken.m_ontology.add(t);
    }
    
    static _new2494(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonIdToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new2496(_arg1, _arg2, _arg3) {
        let res = new PersonIdToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new2497(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonIdToken(_arg1, _arg2);
        res.typ = _arg3;
        res.referent = _arg4;
        return res;
    }
    
    static static_constructor() {
        PersonIdToken.m_ontology = null;
    }
}


PersonIdToken.static_constructor();

module.exports = PersonIdToken