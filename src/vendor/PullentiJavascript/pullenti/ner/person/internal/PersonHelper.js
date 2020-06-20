/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const BracketParseAttr = require("./../../core/BracketParseAttr");
const MailLineTypes = require("./../../mail/internal/MailLineTypes");
const ReferentToken = require("./../../ReferentToken");
const MorphCase = require("./../../../morph/MorphCase");
const GetTextAttr = require("./../../core/GetTextAttr");
const NumberHelper = require("./../../core/NumberHelper");
const MiscHelper = require("./../../core/MiscHelper");
const PersonItemTokenParseAttr = require("./PersonItemTokenParseAttr");
const TextToken = require("./../../TextToken");
const MetaToken = require("./../../MetaToken");
const PersonReferent = require("./../PersonReferent");
const BracketHelper = require("./../../core/BracketHelper");
const PersonPropertyReferent = require("./../PersonPropertyReferent");
const PersonIdentityReferent = require("./../PersonIdentityReferent");
const PersonItemToken = require("./PersonItemToken");
const MorphNumber = require("./../../../morph/MorphNumber");
const MorphGender = require("./../../../morph/MorphGender");
const PersonAttrTerminType = require("./PersonAttrTerminType");
const Referent = require("./../../Referent");
const PersonAttrTokenPersonAttrAttachAttrs = require("./PersonAttrTokenPersonAttrAttachAttrs");
const MailLine = require("./../../mail/internal/MailLine");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const MorphCollection = require("./../../MorphCollection");
const Token = require("./../../Token");
const PersonAnalyzer = require("./../PersonAnalyzer");
const PersonAttrToken = require("./PersonAttrToken");

class PersonHelper {
    
    static create_referent_token(p, begin, end, _morph, attrs, ad, for_attribute, after_be_predicate) {
        const PersonIdentityToken = require("./PersonIdentityToken");
        if (p === null) 
            return null;
        let has_prefix = false;
        if (attrs !== null) {
            for (const a of attrs) {
                if (a.typ === PersonAttrTerminType.BESTREGARDS) 
                    has_prefix = true;
                else {
                    if (a.begin_char < begin.begin_char) {
                        begin = a.begin_token;
                        if ((a.end_token.next !== null && a.end_token.next.is_char(')') && begin.previous !== null) && begin.previous.is_char('(')) 
                            begin = begin.previous;
                    }
                    if (a.typ !== PersonAttrTerminType.PREFIX) {
                        if (a.age !== null) 
                            p.add_slot(PersonReferent.ATTR_AGE, a.age, false, 0);
                        if (a.prop_ref === null) 
                            p.add_slot(PersonReferent.ATTR_ATTR, a.value, false, 0);
                        else 
                            p.add_slot(PersonReferent.ATTR_ATTR, a, false, 0);
                    }
                    else if (a.gender === MorphGender.FEMINIE && !p.is_female) 
                        p.is_female = true;
                    else if (a.gender === MorphGender.MASCULINE && !p.is_male) 
                        p.is_male = true;
                }
            }
        }
        else if ((begin.previous instanceof TextToken) && (begin.whitespaces_before_count < 3)) {
            if ((begin.previous).term === "ИП") {
                let a = new PersonAttrToken(begin.previous, begin.previous);
                a.prop_ref = new PersonPropertyReferent();
                a.prop_ref.name = "индивидуальный предприниматель";
                p.add_slot(PersonReferent.ATTR_ATTR, a, false, 0);
                begin = begin.previous;
            }
        }
        let m0 = new MorphCollection();
        for (const it of _morph.items) {
            let bi = new MorphBaseInfo(it);
            bi.number = MorphNumber.SINGULAR;
            if (bi.gender === MorphGender.UNDEFINED) {
                if (p.is_male && !p.is_female) 
                    bi.gender = MorphGender.MASCULINE;
                if (!p.is_male && p.is_female) 
                    bi.gender = MorphGender.FEMINIE;
            }
            m0.add_item(bi);
        }
        _morph = m0;
        if ((attrs !== null && attrs.length > 0 && !attrs[0].morph._case.is_undefined) && _morph._case.is_undefined) {
            _morph._case = attrs[0].morph._case;
            if (attrs[0].morph.number === MorphNumber.SINGULAR) 
                _morph.number = MorphNumber.SINGULAR;
            if (p.is_male && !p.is_female) 
                _morph.gender = MorphGender.MASCULINE;
            else if (p.is_female) 
                _morph.gender = MorphGender.FEMINIE;
        }
        if (begin.previous !== null) {
            let ttt = begin.previous;
            if (ttt.is_value("ИМЕНИ", "ІМЕНІ")) 
                for_attribute = true;
            else {
                if (ttt.is_char('.') && ttt.previous !== null) 
                    ttt = ttt.previous;
                if (ttt.whitespaces_after_count < 3) {
                    if (ttt.is_value("ИМ", "ІМ")) 
                        for_attribute = true;
                }
            }
        }
        if (for_attribute) 
            return ReferentToken._new2473(p, begin, end, _morph, p.m_person_identity_typ.value());
        if ((begin.previous !== null && begin.previous.is_comma_and && (begin.previous.previous instanceof ReferentToken)) && (begin.previous.previous.get_referent() instanceof PersonReferent)) {
            let rt00 = Utils.as(begin.previous.previous, ReferentToken);
            for (let ttt = rt00; ttt !== null; ) {
                if (ttt.previous === null || !((ttt.previous.previous instanceof ReferentToken))) 
                    break;
                if (!ttt.previous.is_comma_and || !((ttt.previous.previous.get_referent() instanceof PersonReferent))) 
                    break;
                rt00 = Utils.as(ttt.previous.previous, ReferentToken);
                ttt = rt00;
            }
            if (rt00.begin_token.get_referent() instanceof PersonPropertyReferent) {
                let ok = false;
                if ((rt00.begin_token).end_token.next !== null && (rt00.begin_token).end_token.next.is_char(':')) 
                    ok = true;
                else if (rt00.begin_token.morph.number === MorphNumber.PLURAL) 
                    ok = true;
                if (ok) 
                    p.add_slot(PersonReferent.ATTR_ATTR, rt00.begin_token.get_referent(), false, 0);
            }
        }
        if (ad !== null) {
            if (ad.overflow_level > 10) 
                return ReferentToken._new2473(p, begin, end, _morph, p.m_person_identity_typ.value());
            ad.overflow_level++;
        }
        let attrs1 = null;
        let has_position = false;
        let open_br = false;
        for (let t = end.next; t !== null; t = t.next) {
            if (t.is_table_control_char) 
                break;
            if (t.is_newline_before) {
                if (t.newlines_before_count > 2) 
                    break;
                if (attrs1 !== null && attrs1.length > 0) 
                    break;
                let ml = MailLine.parse(t, 0);
                if (ml !== null && ml.typ === MailLineTypes.FROM) 
                    break;
                if (t.chars.is_capital_upper) {
                    let attr1 = PersonAttrToken.try_attach(t, (ad === null ? null : ad.local_ontology), PersonAttrTokenPersonAttrAttachAttrs.NO);
                    let ok1 = false;
                    if (attr1 !== null) {
                        if (has_prefix || attr1.is_newline_after || ((attr1.end_token.next !== null && attr1.end_token.next.is_table_control_char))) 
                            ok1 = true;
                        else 
                            for (let tt2 = t.next; tt2 !== null && tt2.end_char <= attr1.end_char; tt2 = tt2.next) {
                                if (tt2.is_whitespace_before) 
                                    ok1 = true;
                            }
                    }
                    else {
                        let ttt = PersonHelper.correct_tail_attributes(p, t);
                        if (ttt !== null && ttt !== t) {
                            end = (t = ttt);
                            continue;
                        }
                    }
                    if (!ok1) 
                        break;
                }
            }
            if (t.is_hiphen || t.is_char_of("_>|")) 
                continue;
            if (t.is_value("МОДЕЛЬ", null)) 
                break;
            let tt = PersonHelper.correct_tail_attributes(p, t);
            if (tt !== t && tt !== null) {
                end = (t = tt);
                continue;
            }
            let is_be = false;
            if (t.is_char('(') && t === end.next) {
                open_br = true;
                t = t.next;
                if (t === null) 
                    break;
                let pit1 = PersonItemToken.try_attach(t, null, PersonItemTokenParseAttr.NO, null);
                if ((pit1 !== null && t.chars.is_capital_upper && pit1.end_token.next !== null) && (t instanceof TextToken) && pit1.end_token.next.is_char(')')) {
                    if (pit1.lastname !== null) {
                        let inf = MorphBaseInfo._new2465(MorphCase.NOMINATIVE);
                        if (p.is_male) 
                            inf.gender = MorphGender.of((inf.gender.value()) | (MorphGender.MASCULINE.value()));
                        if (p.is_female) 
                            inf.gender = MorphGender.of((inf.gender.value()) | (MorphGender.FEMINIE.value()));
                        let sur = PersonIdentityToken.create_lastname(pit1, inf);
                        if (sur !== null) {
                            p.add_fio_identity(sur, null, null);
                            end = (t = pit1.end_token.next);
                            continue;
                        }
                    }
                }
                if ((t instanceof TextToken) && t.chars.is_latin_letter) {
                    let pits = PersonItemToken.try_attach_list(t, null, PersonItemTokenParseAttr.CANBELATIN, 10);
                    if (((pits !== null && pits.length >= 2 && pits.length <= 3) && pits[0].chars.is_latin_letter && pits[1].chars.is_latin_letter) && pits[pits.length - 1].end_token.next !== null && pits[pits.length - 1].end_token.next.is_char(')')) {
                        let pr2 = new PersonReferent();
                        let cou = 0;
                        for (const pi of pits) {
                            for (const si of p.slots) {
                                if (si.type_name === PersonReferent.ATTR_FIRSTNAME || si.type_name === PersonReferent.ATTR_MIDDLENAME || si.type_name === PersonReferent.ATTR_LASTNAME) {
                                    if (MiscHelper.can_be_equal_cyr_and_latss(si.value.toString(), pi.value)) {
                                        cou++;
                                        pr2.add_slot(si.type_name, pi.value, false, 0);
                                        break;
                                    }
                                }
                            }
                        }
                        if (cou === pits.length) {
                            for (const si of pr2.slots) {
                                p.add_slot(si.type_name, si.value, false, 0);
                            }
                            end = (t = pits[pits.length - 1].end_token.next);
                            continue;
                        }
                    }
                }
            }
            else if (t.is_comma) {
                t = t.next;
                if ((t instanceof TextToken) && (t).is_value("WHO", null)) 
                    continue;
                if ((t instanceof TextToken) && t.chars.is_latin_letter) {
                    let pits = PersonItemToken.try_attach_list(t, null, PersonItemTokenParseAttr.CANBELATIN, 10);
                    if ((pits !== null && pits.length >= 2 && pits.length <= 3) && pits[0].chars.is_latin_letter && pits[1].chars.is_latin_letter) {
                        let pr2 = new PersonReferent();
                        let cou = 0;
                        for (const pi of pits) {
                            for (const si of p.slots) {
                                if (si.type_name === PersonReferent.ATTR_FIRSTNAME || si.type_name === PersonReferent.ATTR_MIDDLENAME || si.type_name === PersonReferent.ATTR_LASTNAME) {
                                    if (MiscHelper.can_be_equal_cyr_and_latss(si.value.toString(), pi.value)) {
                                        cou++;
                                        pr2.add_slot(si.type_name, pi.value, false, 0);
                                        break;
                                    }
                                }
                            }
                        }
                        if (cou === pits.length) {
                            for (const si of pr2.slots) {
                                p.add_slot(si.type_name, si.value, false, 0);
                            }
                            end = (t = pits[pits.length - 1].end_token);
                            continue;
                        }
                    }
                }
            }
            else if ((t instanceof TextToken) && (t).is_verb_be) 
                t = t.next;
            else if (t.is_and && t.is_whitespace_after && !t.is_newline_after) {
                if (t === end.next) 
                    break;
                t = t.next;
            }
            else if (t.is_hiphen && t === end.next) 
                t = t.next;
            else if (t.is_char('.') && t === end.next && has_prefix) 
                t = t.next;
            let ttt2 = PersonHelper.create_nickname(p, t);
            if (ttt2 !== null) {
                t = (end = ttt2);
                continue;
            }
            if (t === null) 
                break;
            let attr = null;
            attr = PersonAttrToken.try_attach(t, (ad === null ? null : ad.local_ontology), PersonAttrTokenPersonAttrAttachAttrs.NO);
            if (attr === null) {
                if ((t !== null && t.get_referent() !== null && t.get_referent().type_name === "GEO") && attrs1 !== null && open_br) 
                    continue;
                if ((t.chars.is_capital_upper && open_br && t.next !== null) && t.next.is_char(')')) {
                    if (p.find_slot(PersonReferent.ATTR_LASTNAME, null, true) === null) {
                        p.add_slot(PersonReferent.ATTR_LASTNAME, t.get_source_text().toUpperCase(), false, 0);
                        t = t.next;
                        end = t;
                    }
                }
                if (t !== null && t.is_value("КОТОРЫЙ", null) && t.morph.number === MorphNumber.SINGULAR) {
                    if (!p.is_female && t.morph.gender === MorphGender.FEMINIE) {
                        p.is_female = true;
                        p.correct_data();
                    }
                    else if (!p.is_male && t.morph.gender === MorphGender.MASCULINE) {
                        p.is_male = true;
                        p.correct_data();
                    }
                }
                break;
            }
            if (attr.morph.number === MorphNumber.PLURAL) 
                break;
            if (attr.typ === PersonAttrTerminType.BESTREGARDS) 
                break;
            if (attr.is_doubt) {
                if (has_prefix) {
                }
                else if (t.is_newline_before && attr.is_newline_after) {
                }
                else if (t.previous !== null && ((t.previous.is_hiphen || t.previous.is_char(':')))) {
                }
                else 
                    break;
            }
            if (!_morph._case.is_undefined && !attr.morph._case.is_undefined) {
                if ((MorphCase.ooBitand(_morph._case, attr.morph._case)).is_undefined && !is_be) 
                    break;
            }
            if (open_br) {
                if (PersonAnalyzer.try_attach_person(t, ad, false, 0, true) !== null) 
                    break;
            }
            if (attrs1 === null) {
                if (t.previous.is_comma && t.previous === end.next) {
                    let ttt = attr.end_token.next;
                    if (ttt !== null) {
                        if (ttt.morph.class0.is_verb) {
                            if (MiscHelper.can_be_start_of_sentence(begin)) {
                            }
                            else 
                                break;
                        }
                    }
                }
                attrs1 = new Array();
            }
            attrs1.push(attr);
            if (attr.typ === PersonAttrTerminType.POSITION || attr.typ === PersonAttrTerminType.KING) {
                if (!is_be) 
                    has_position = true;
            }
            else if (attr.typ !== PersonAttrTerminType.PREFIX) {
                if (attr.typ === PersonAttrTerminType.OTHER && attr.age !== null) {
                }
                else {
                    attrs1 = null;
                    break;
                }
            }
            t = attr.end_token;
        }
        if (attrs1 !== null && has_position && attrs !== null) {
            let te1 = attrs[attrs.length - 1].end_token.next;
            let te2 = attrs1[0].begin_token;
            if (te1.whitespaces_after_count > te2.whitespaces_before_count && (te2.whitespaces_before_count < 2)) {
            }
            else if (attrs1[0].age !== null) {
            }
            else if (((te1.is_hiphen || te1.is_char(':'))) && !attrs1[0].is_newline_before && ((te2.previous.is_comma || te2.previous === end))) {
            }
            else 
                for (const a of attrs) {
                    if (a.typ === PersonAttrTerminType.POSITION) {
                        let te = attrs1[attrs1.length - 1].end_token;
                        if (te.next !== null) {
                            if (!te.next.is_char('.')) {
                                attrs1 = null;
                                break;
                            }
                        }
                    }
                }
        }
        if (attrs1 !== null && !has_prefix) {
            let attr = attrs1[attrs1.length - 1];
            let ok = false;
            if (attr.end_token.next !== null && attr.end_token.next.chars.is_capital_upper) 
                ok = true;
            else {
                let rt = PersonAnalyzer.try_attach_person(attr.begin_token, ad, false, -1, false);
                if (rt !== null && (rt.referent instanceof PersonReferent)) 
                    ok = true;
            }
            if (ok) {
                if (attr.begin_token.whitespaces_before_count > attr.end_token.whitespaces_after_count) 
                    attrs1 = null;
                else if (attr.begin_token.whitespaces_before_count === attr.end_token.whitespaces_after_count) {
                    let rt1 = PersonAnalyzer.try_attach_person(attr.begin_token, ad, false, -1, false);
                    if (rt1 !== null) 
                        attrs1 = null;
                }
            }
        }
        if (attrs1 !== null) {
            for (const a of attrs1) {
                if (a.typ !== PersonAttrTerminType.PREFIX) {
                    if (a.age !== null) 
                        p.add_slot(PersonReferent.ATTR_AGE, a.age, true, 0);
                    else if (a.prop_ref === null) 
                        p.add_slot(PersonReferent.ATTR_ATTR, a.value, false, 0);
                    else 
                        p.add_slot(PersonReferent.ATTR_ATTR, a, false, 0);
                    end = a.end_token;
                    if (a.gender !== MorphGender.UNDEFINED && !p.is_female && !p.is_male) {
                        if (a.gender === MorphGender.MASCULINE && !p.is_male) {
                            p.is_male = true;
                            p.correct_data();
                        }
                        else if (a.gender === MorphGender.FEMINIE && !p.is_female) {
                            p.is_female = true;
                            p.correct_data();
                        }
                    }
                }
            }
            if (open_br) {
                if (end.next !== null && end.next.is_char(')')) 
                    end = end.next;
            }
        }
        let crlf_cou = 0;
        for (let t = end.next; t !== null; t = t.next) {
            if (t.is_table_control_char) 
                break;
            if (t.is_newline_before) {
                let ml = MailLine.parse(t, 0);
                if (ml !== null && ml.typ === MailLineTypes.FROM) 
                    break;
                crlf_cou++;
            }
            if (t.is_char_of(":,(") || t.is_hiphen) 
                continue;
            if (t.is_char('.') && t === end.next) 
                continue;
            let r = t.get_referent();
            if (r !== null) {
                if (r.type_name === "PHONE" || r.type_name === "URI" || r.type_name === "ADDRESS") {
                    let ty = r.get_string_value("SCHEME");
                    if (r.type_name === "URI") {
                        if ((ty !== "mailto" && ty !== "skype" && ty !== "ICQ") && ty !== "http") 
                            break;
                    }
                    p.add_contact(r);
                    end = t;
                    crlf_cou = 0;
                    continue;
                }
            }
            if (r instanceof PersonIdentityReferent) {
                p.add_slot(PersonReferent.ATTR_IDDOC, r, false, 0);
                end = t;
                crlf_cou = 0;
                continue;
            }
            if (r !== null && r.type_name === "ORGANIZATION") {
                if (t.next !== null && t.next.morph.class0.is_verb) 
                    break;
                if (begin.previous !== null && begin.previous.morph.class0.is_verb) 
                    break;
                if (t.whitespaces_after_count === 1) 
                    break;
                let exist = false;
                for (const s of p.slots) {
                    if (s.type_name === PersonReferent.ATTR_ATTR && (s.value instanceof PersonPropertyReferent)) {
                        let pr = Utils.as(s.value, PersonPropertyReferent);
                        if (pr.find_slot(PersonPropertyReferent.ATTR_REF, r, true) !== null) {
                            exist = true;
                            break;
                        }
                    }
                    else if (s.type_name === PersonReferent.ATTR_ATTR && (s.value instanceof PersonAttrToken)) {
                        let pr = Utils.as(s.value, PersonAttrToken);
                        if (pr.referent.find_slot(PersonPropertyReferent.ATTR_REF, r, true) !== null) {
                            exist = true;
                            break;
                        }
                    }
                }
                if (!exist) {
                    let pat = new PersonAttrToken(t, t);
                    pat.prop_ref = PersonPropertyReferent._new2435("сотрудник");
                    pat.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, r, false, 0);
                    p.add_slot(PersonReferent.ATTR_ATTR, pat, false, 0);
                }
                continue;
            }
            if (r !== null) 
                break;
            if (!has_prefix || crlf_cou >= 2) 
                break;
            let rt = t.kit.process_referent("PERSON", t);
            if (rt !== null) 
                break;
        }
        if (ad !== null) 
            ad.overflow_level--;
        if (begin.is_value("НА", null) && begin.next !== null && begin.next.is_value("ИМЯ", null)) {
            let t0 = begin.previous;
            if (t0 !== null && t0.is_comma) 
                t0 = t0.previous;
            if (t0 !== null && (t0.get_referent() instanceof PersonIdentityReferent)) 
                p.add_slot(PersonReferent.ATTR_IDDOC, t0.get_referent(), false, 0);
        }
        return ReferentToken._new2473(p, begin, end, _morph, p.m_person_identity_typ.value());
    }
    
    /**
     * Выделить пол
     * @param pr 
     * @param t 
     * @return 
     */
    static create_sex(pr, t) {
        if (t === null) 
            return null;
        while (t.next !== null) {
            if (t.is_value("ПОЛ", null) || t.is_hiphen || t.is_char(':')) 
                t = t.next;
            else 
                break;
        }
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return null;
        let ok = false;
        if ((tt.term === "МУЖ" || tt.term === "МУЖС" || tt.term === "МУЖСК") || tt.is_value("МУЖСКОЙ", null)) {
            pr.is_male = true;
            ok = true;
        }
        else if ((tt.term === "ЖЕН" || tt.term === "ЖЕНС" || tt.term === "ЖЕНСК") || tt.is_value("ЖЕНСКИЙ", null)) {
            pr.is_female = true;
            ok = true;
        }
        if (!ok) 
            return null;
        while (t.next !== null) {
            if (t.next.is_value("ПОЛ", null) || t.next.is_char('.')) 
                t = t.next;
            else 
                break;
        }
        return t;
    }
    
    /**
     * Выделить кличку
     * @param pr 
     * @param t начальный токен
     * @return если не null, то последний токен клички, а в pr запишет саму кличку
     */
    static create_nickname(pr, t) {
        let has_keyw = false;
        let is_br = false;
        for (; t !== null; t = t.next) {
            if (t.is_hiphen || t.is_comma || t.is_char_of(".:;")) 
                continue;
            if (t.morph.class0.is_preposition) 
                continue;
            if (t.is_char('(')) {
                is_br = true;
                continue;
            }
            if ((t.is_value("ПРОЗВИЩЕ", "ПРІЗВИСЬКО") || t.is_value("КЛИЧКА", null) || t.is_value("ПСЕВДОНИМ", "ПСЕВДОНІМ")) || t.is_value("ПСЕВДО", null) || t.is_value("ПОЗЫВНОЙ", "ПОЗИВНИЙ")) {
                has_keyw = true;
                continue;
            }
            break;
        }
        if (!has_keyw || t === null) 
            return null;
        if (BracketHelper.is_bracket(t, true)) {
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (br !== null) {
                let ni = MiscHelper.get_text_value(br.begin_token.next, br.end_token.previous, GetTextAttr.NO);
                if (ni !== null) {
                    pr.add_slot(PersonReferent.ATTR_NICKNAME, ni, false, 0);
                    t = br.end_token;
                    for (let tt = t.next; tt !== null; tt = tt.next) {
                        if (tt.is_comma_and) 
                            continue;
                        if (!BracketHelper.is_bracket(tt, true)) 
                            break;
                        br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                        if (br === null) 
                            break;
                        ni = MiscHelper.get_text_value(br.begin_token.next, br.end_token.previous, GetTextAttr.NO);
                        if (ni !== null) 
                            pr.add_slot(PersonReferent.ATTR_NICKNAME, ni, false, 0);
                        t = (tt = br.end_token);
                    }
                    if (is_br && t.next !== null && t.next.is_char(')')) 
                        t = t.next;
                    return t;
                }
            }
        }
        else {
            let ret = null;
            for (; t !== null; t = t.next) {
                if (t.is_comma_and) 
                    continue;
                if (ret !== null && t.chars.is_all_lower) 
                    break;
                if (t.whitespaces_before_count > 2) 
                    break;
                let pli = PersonItemToken.try_attach_list(t, null, PersonItemTokenParseAttr.NO, 10);
                if (pli !== null && ((pli.length === 1 || pli.length === 2))) {
                    let ni = MiscHelper.get_text_value(pli[0].begin_token, pli[pli.length - 1].end_token, GetTextAttr.NO);
                    if (ni !== null) {
                        pr.add_slot(PersonReferent.ATTR_NICKNAME, ni, false, 0);
                        t = pli[pli.length - 1].end_token;
                        if (is_br && t.next !== null && t.next.is_char(')')) 
                            t = t.next;
                        ret = t;
                        continue;
                    }
                }
                if ((t instanceof ReferentToken) && !t.chars.is_all_lower && (t).begin_token === (t).end_token) {
                    let val = MiscHelper.get_text_value_of_meta_token(Utils.as(t, ReferentToken), GetTextAttr.NO);
                    pr.add_slot(PersonReferent.ATTR_NICKNAME, val, false, 0);
                    if (is_br && t.next !== null && t.next.is_char(')')) 
                        t = t.next;
                    ret = t;
                    continue;
                }
                break;
            }
            return ret;
        }
        return null;
    }
    
    static is_person_say_or_attr_after(t) {
        if (t === null) 
            return false;
        let tt = PersonHelper.correct_tail_attributes(null, t);
        if (tt !== null && tt !== t) 
            return true;
        if (t.is_comma && t.next !== null) 
            t = t.next;
        if (t.chars.is_latin_letter) {
            if (t.is_value("SAY", null) || t.is_value("ASK", null) || t.is_value("WHO", null)) 
                return true;
        }
        if (t.is_char('.') && (t.next instanceof TextToken) && ((t.next.morph.class0.is_pronoun || t.next.morph.class0.is_personal_pronoun))) {
            if (t.next.morph.gender === MorphGender.FEMINIE || t.next.morph.gender === MorphGender.MASCULINE) 
                return true;
        }
        if (t.is_comma && t.next !== null) 
            t = t.next;
        if (PersonAttrToken.try_attach(t, null, PersonAttrTokenPersonAttrAttachAttrs.NO) !== null) 
            return true;
        return false;
    }
    
    static correct_tail_attributes(p, t0) {
        let res = t0;
        let t = t0;
        if (t !== null && t.is_char(',')) 
            t = t.next;
        let born = false;
        let die = false;
        if (t !== null && ((t.is_value("РОДИТЬСЯ", "НАРОДИТИСЯ") || t.is_value("BORN", null)))) {
            t = t.next;
            born = true;
        }
        else if (t !== null && ((t.is_value("УМЕРЕТЬ", "ПОМЕРТИ") || t.is_value("СКОНЧАТЬСЯ", null) || t.is_value("DIED", null)))) {
            t = t.next;
            die = true;
        }
        else if ((t !== null && t.is_value("ДАТА", null) && t.next !== null) && t.next.is_value("РОЖДЕНИЕ", "НАРОДЖЕННЯ")) {
            t = t.next.next;
            born = true;
        }
        while (t !== null) {
            if (t.morph.class0.is_preposition || t.is_hiphen || t.is_char(':')) 
                t = t.next;
            else 
                break;
        }
        if (t !== null && t.get_referent() !== null) {
            let r = t.get_referent();
            if (r.type_name === "DATE") {
                let t1 = t;
                if (t.next !== null && ((t.next.is_value("Р", null) || t.next.is_value("РОЖДЕНИЕ", "НАРОДЖЕННЯ")))) {
                    born = true;
                    t1 = t.next;
                    if (t1.next !== null && t1.next.is_char('.')) 
                        t1 = t1.next;
                }
                if (born) {
                    if (p !== null) 
                        p.add_slot(PersonReferent.ATTR_BORN, r, false, 0);
                    res = t1;
                    t = t1;
                }
                else if (die) {
                    if (p !== null) 
                        p.add_slot(PersonReferent.ATTR_DIE, r, false, 0);
                    res = t1;
                    t = t1;
                }
            }
        }
        if (die && t !== null) {
            let ag = NumberHelper.try_parse_age(t.next);
            if (ag !== null) {
                if (p !== null) 
                    p.add_slot(PersonReferent.ATTR_AGE, ag.value.toString(), false, 0);
                t = ag.end_token.next;
                res = ag.end_token;
            }
        }
        if (t === null) 
            return res;
        if (t.is_char('(')) {
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (br !== null) {
                let t1 = t.next;
                born = false;
                if (t1.is_value("РОД", null)) {
                    born = true;
                    t1 = t1.next;
                    if (t1 !== null && t1.is_char('.')) 
                        t1 = t1.next;
                }
                if (t1 instanceof ReferentToken) {
                    let r = t1.get_referent();
                    if (r.type_name === "DATERANGE" && t1.next === br.end_token) {
                        let bd = Utils.as(r.get_slot_value("FROM"), Referent);
                        let to = Utils.as(r.get_slot_value("TO"), Referent);
                        if (bd !== null && to !== null) {
                            if (p !== null) {
                                p.add_slot(PersonReferent.ATTR_BORN, bd, false, 0);
                                p.add_slot(PersonReferent.ATTR_DIE, to, false, 0);
                            }
                            t = (res = br.end_token);
                        }
                    }
                    else if (r.type_name === "DATE" && t1.next === br.end_token) {
                        if (p !== null) 
                            p.add_slot(PersonReferent.ATTR_BORN, r, false, 0);
                        t = (res = br.end_token);
                    }
                }
            }
        }
        return res;
    }
}


module.exports = PersonHelper