/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const ILTypes = require("./ILTypes");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const MiscHelper = require("./../../core/MiscHelper");
const Referent = require("./../../Referent");
const Termin = require("./../../core/Termin");
const GeoReferent = require("./../../geo/GeoReferent");
const UriReferent = require("./../../uri/UriReferent");
const DecreeToken = require("./../../decree/internal/DecreeToken");
const InstrToken = require("./InstrToken");
const DecreeTokenItemType = require("./../../decree/internal/DecreeTokenItemType");
const DecreeReferent = require("./../../decree/DecreeReferent");
const TerminCollection = require("./../../core/TerminCollection");
const PersonPropertyReferent = require("./../../person/PersonPropertyReferent");
const PhoneReferent = require("./../../phone/PhoneReferent");
const BankDataReferent = require("./../../bank/BankDataReferent");
const InstrumentParticipant = require("./../InstrumentParticipant");
const InstrumentAnalyzer = require("./../InstrumentAnalyzer");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const OrganizationReferent = require("./../../org/OrganizationReferent");
const MorphGender = require("./../../../morph/MorphGender");
const MorphNumber = require("./../../../morph/MorphNumber");
const ParticipantTokenKinds = require("./ParticipantTokenKinds");
const ReferentToken = require("./../../ReferentToken");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const MorphClass = require("./../../../morph/MorphClass");
const MetaToken = require("./../../MetaToken");
const AddressReferent = require("./../../address/AddressReferent");
const PersonIdentityReferent = require("./../../person/PersonIdentityReferent");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const TextToken = require("./../../TextToken");
const BracketHelper = require("./../../core/BracketHelper");
const NumberToken = require("./../../NumberToken");
const PersonReferent = require("./../../person/PersonReferent");

class ParticipantToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = null;
        this.kind = ParticipantTokenKinds.UNDEFINED;
        this.parts = null;
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(String(this.kind)).append(": ").append(((this.typ != null ? this.typ : "?")));
        if (this.parts !== null) {
            for (const p of this.parts) {
                res.append("; ").append(p.to_string(true, null, 0));
            }
        }
        return res.toString();
    }
    
    static try_attach(t, p1 = null, p2 = null, is_contract = false) {
        if (t === null) 
            return null;
        let tt = t;
        let br = false;
        if (p1 === null && p2 === null && is_contract) {
            let r1 = t.get_referent();
            if ((r1 !== null && t.next !== null && t.next.is_comma_and) && (t.next.next instanceof ReferentToken)) {
                let r2 = t.next.next.get_referent();
                if (r1.type_name === r2.type_name) {
                    let ttt = t.next.next.next;
                    let refs = new Array();
                    refs.push(r1);
                    refs.push(r2);
                    for (; ttt !== null; ttt = ttt.next) {
                        if ((ttt.is_comma_and && ttt.next !== null && ttt.next.get_referent() !== null) && ttt.next.get_referent().type_name === r1.type_name) {
                            ttt = ttt.next;
                            if (!refs.includes(ttt.get_referent())) 
                                refs.push(ttt.get_referent());
                            continue;
                        }
                        break;
                    }
                    for (; ttt !== null; ttt = ttt.next) {
                        if (ttt.is_comma || ttt.morph.class0.is_preposition) 
                            continue;
                        if ((ttt.is_value("ИМЕНОВАТЬ", null) || ttt.is_value("ДАЛЬНЕЙШИЙ", null) || ttt.is_value("ДАЛЕЕ", null)) || ttt.is_value("ТЕКСТ", null)) 
                            continue;
                        if (ttt.is_value("ДОГОВАРИВАТЬСЯ", null)) 
                            continue;
                        let npt = NounPhraseHelper.try_parse(ttt, NounPhraseParseAttr.NO, 0, null);
                        if (npt !== null && npt.noun.is_value("СТОРОНА", null) && npt.morph.number !== MorphNumber.SINGULAR) {
                            let re = ParticipantToken._new1567(t, npt.end_token, ParticipantTokenKinds.NAMEDASPARTS);
                            re.parts = refs;
                            return re;
                        }
                        break;
                    }
                }
            }
            if ((r1 instanceof OrganizationReferent) || (r1 instanceof PersonReferent)) {
                let has_br = false;
                let has_named = false;
                if (r1 instanceof PersonReferent) {
                    if (t.previous !== null && t.previous.is_value("ЛИЦО", null)) 
                        return null;
                }
                else if (t.previous !== null && ((t.previous.is_value("ВЫДАВАТЬ", null) || t.previous.is_value("ВЫДАТЬ", null)))) 
                    return null;
                for (let ttt = (t).begin_token; ttt !== null && (ttt.end_char < t.end_char); ttt = ttt.next) {
                    if (ttt.is_char('(')) 
                        has_br = true;
                    else if ((ttt.is_value("ИМЕНОВАТЬ", null) || ttt.is_value("ДАЛЬНЕЙШИЙ", null) || ttt.is_value("ДАЛЕЕ", null)) || ttt.is_value("ТЕКСТ", null)) 
                        has_named = true;
                    else if ((ttt.is_comma || ttt.morph.class0.is_preposition || ttt.is_hiphen) || ttt.is_char(':')) {
                    }
                    else if (ttt instanceof ReferentToken) {
                    }
                    else if (has_br || has_named) {
                        let npt = NounPhraseHelper.try_parse(ttt, NounPhraseParseAttr.REFERENTCANBENOUN, 0, null);
                        if (npt === null) 
                            break;
                        if (has_br) {
                            if (npt.end_token.next === null || !npt.end_token.next.is_char(')')) 
                                break;
                        }
                        if (!has_named) {
                            if (ParticipantToken.m_ontology.try_parse(ttt, TerminParseAttr.NO) === null) 
                                break;
                        }
                        let re = ParticipantToken._new1567(t, t, ParticipantTokenKinds.NAMEDAS);
                        re.typ = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                        re.parts = new Array();
                        re.parts.push(r1);
                        return re;
                    }
                }
                has_br = false;
                has_named = false;
                let end_side = null;
                let brr = null;
                let add_refs = null;
                for (let ttt = t.next; ttt !== null; ttt = ttt.next) {
                    if ((ttt instanceof NumberToken) && (ttt.next instanceof TextToken) && (ttt.next).term === "СТОРОНЫ") {
                        end_side = (ttt = ttt.next);
                        if (ttt.next !== null && ttt.next.is_comma) 
                            ttt = ttt.next;
                        if (ttt.next !== null && ttt.next.is_and) 
                            break;
                    }
                    if (brr !== null && ttt.begin_char > brr.end_char) 
                        brr = null;
                    if (BracketHelper.can_be_start_of_sequence(ttt, false, false)) {
                        brr = BracketHelper.try_parse(ttt, BracketParseAttr.NO, 100);
                        if (brr !== null && (brr.length_char < 7) && ttt.is_char('(')) {
                            ttt = brr.end_token;
                            brr = null;
                            continue;
                        }
                    }
                    else if ((ttt.is_value("ИМЕНОВАТЬ", null) || ttt.is_value("ДАЛЬНЕЙШИЙ", null) || ttt.is_value("ДАЛЕЕ", null)) || ttt.is_value("ТЕКСТ", null)) 
                        has_named = true;
                    else if ((ttt.is_comma || ttt.morph.class0.is_preposition || ttt.is_hiphen) || ttt.is_char(':')) {
                    }
                    else if (brr !== null || has_named) {
                        if (BracketHelper.can_be_start_of_sequence(ttt, true, false)) 
                            ttt = ttt.next;
                        let npt = NounPhraseHelper.try_parse(ttt, NounPhraseParseAttr.REFERENTCANBENOUN, 0, null);
                        let typ22 = null;
                        if (npt !== null) {
                            ttt = npt.end_token;
                            if (npt.end_token.is_value("ДОГОВОР", null)) 
                                continue;
                        }
                        else {
                            let ttok = null;
                            if (ttt instanceof MetaToken) 
                                ttok = ParticipantToken.m_ontology.try_parse((ttt).begin_token, TerminParseAttr.NO);
                            if (ttok !== null) 
                                typ22 = ttok.termin.canonic_text;
                            else if (has_named && ttt.morph.class0.is_adjective) 
                                typ22 = ttt.get_normal_case_text(MorphClass.ADJECTIVE, false, MorphGender.UNDEFINED, false);
                            else if (brr !== null) 
                                continue;
                            else 
                                break;
                        }
                        if (BracketHelper.can_be_end_of_sequence(ttt.next, true, null, false)) 
                            ttt = ttt.next;
                        if (brr !== null) {
                            if (ttt.next === null) {
                                ttt = brr.end_token;
                                continue;
                            }
                            ttt = ttt.next;
                        }
                        if (!has_named && typ22 === null) {
                            if (ParticipantToken.m_ontology.try_parse(npt.begin_token, TerminParseAttr.NO) === null) 
                                break;
                        }
                        let re = ParticipantToken._new1567(t, ttt, ParticipantTokenKinds.NAMEDAS);
                        re.typ = (typ22 != null ? typ22 : npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false));
                        re.parts = new Array();
                        re.parts.push(r1);
                        return re;
                    }
                    else if ((ttt.is_value("ЗАРЕГИСТРИРОВАННЫЙ", null) || ttt.is_value("КАЧЕСТВО", null) || ttt.is_value("ПРОЖИВАЮЩИЙ", null)) || ttt.is_value("ЗАРЕГ", null)) {
                    }
                    else if (ttt.get_referent() === r1) {
                    }
                    else if ((ttt.get_referent() instanceof PersonIdentityReferent) || (ttt.get_referent() instanceof AddressReferent)) {
                        if (add_refs === null) 
                            add_refs = new Array();
                        add_refs.push(ttt.get_referent());
                    }
                    else {
                        let prr = ttt.kit.process_referent("PERSONPROPERTY", ttt);
                        if (prr !== null) {
                            ttt = prr.end_token;
                            continue;
                        }
                        if (ttt.get_referent() instanceof GeoReferent) 
                            continue;
                        let npt = NounPhraseHelper.try_parse(ttt, NounPhraseParseAttr.NO, 0, null);
                        if (npt !== null) {
                            if ((npt.noun.is_value("МЕСТО", null) || npt.noun.is_value("ЖИТЕЛЬСТВО", null) || npt.noun.is_value("ПРЕДПРИНИМАТЕЛЬ", null)) || npt.noun.is_value("ПОЛ", null) || npt.noun.is_value("РОЖДЕНИЕ", null)) {
                                ttt = npt.end_token;
                                continue;
                            }
                        }
                        if (ttt.is_newline_before) 
                            break;
                        if (ttt.length_char < 3) 
                            continue;
                        let mc = ttt.get_morph_class_in_dictionary();
                        if (mc.is_adverb || mc.is_adjective) 
                            continue;
                        if (ttt.chars.is_all_upper) 
                            continue;
                        break;
                    }
                }
                if (end_side !== null || ((add_refs !== null && t.previous !== null && t.previous.is_and))) {
                    let re = ParticipantToken._new1567(t, (end_side != null ? end_side : t), ParticipantTokenKinds.NAMEDAS);
                    re.typ = null;
                    re.parts = new Array();
                    re.parts.push(r1);
                    if (add_refs !== null) 
                        re.parts.splice(re.parts.length, 0, ...add_refs);
                    return re;
                }
            }
            let too = ParticipantToken.m_ontology.try_parse(t, TerminParseAttr.NO);
            if (too !== null) {
                if ((t.previous instanceof TextToken) && t.previous.is_value("ЛИЦО", null)) 
                    too = null;
            }
            if (too !== null && too.termin.tag !== null && too.termin.canonic_text !== "СТОРОНА") {
                let tt1 = too.end_token.next;
                if (tt1 !== null) {
                    if (tt1.is_hiphen || tt1.is_char(':')) 
                        tt1 = tt1.next;
                }
                if (tt1 instanceof ReferentToken) {
                    r1 = tt1.get_referent();
                    if ((r1 instanceof PersonReferent) || (r1 instanceof OrganizationReferent)) {
                        let re = ParticipantToken._new1567(t, tt1, ParticipantTokenKinds.NAMEDAS);
                        re.typ = too.termin.canonic_text;
                        re.parts = new Array();
                        re.parts.push(r1);
                        return re;
                    }
                }
            }
        }
        let add_typ1 = (p1 === null ? null : p1.typ);
        let add_typ2 = (p2 === null ? null : p2.typ);
        if (BracketHelper.can_be_start_of_sequence(tt, false, false) && tt.next !== null) {
            br = true;
            tt = tt.next;
        }
        let term1 = null;
        let term2 = null;
        if (add_typ1 !== null && add_typ1.indexOf(' ') > 0 && !add_typ1.startsWith("СТОРОНА")) 
            term1 = new Termin(add_typ1);
        if (add_typ2 !== null && add_typ2.indexOf(' ') > 0 && !add_typ2.startsWith("СТОРОНА")) 
            term2 = new Termin(add_typ2);
        let named = false;
        let _typ = null;
        let t1 = null;
        let t0 = tt;
        for (; tt !== null; tt = tt.next) {
            if (tt.morph.class0.is_preposition && _typ !== null) 
                continue;
            if (tt.is_char_of("(:)") || tt.is_hiphen) 
                continue;
            if (tt.is_table_control_char) 
                break;
            if (tt.is_newline_before && tt !== t0) {
                if (tt instanceof NumberToken) 
                    break;
                if ((tt instanceof TextToken) && (tt.previous instanceof TextToken)) {
                    if (tt.previous.is_value((tt).term, null)) 
                        break;
                }
            }
            if (BracketHelper.is_bracket(tt, false)) 
                continue;
            let tok = (ParticipantToken.m_ontology !== null ? ParticipantToken.m_ontology.try_parse(tt, TerminParseAttr.NO) : null);
            if (tok !== null && (tt.previous instanceof TextToken)) {
                if (tt.previous.is_value("ЛИЦО", null)) 
                    return null;
            }
            if (tok === null) {
                if (add_typ1 !== null && ((MiscHelper.is_not_more_than_one_error(add_typ1, tt) || ((((tt instanceof MetaToken)) && (tt).begin_token.is_value(add_typ1, null)))))) {
                    if (_typ !== null) {
                        if (!ParticipantToken._is_types_equal(add_typ1, _typ)) 
                            break;
                    }
                    _typ = add_typ1;
                    t1 = tt;
                    continue;
                }
                if (add_typ2 !== null && ((MiscHelper.is_not_more_than_one_error(add_typ2, tt) || ((((tt instanceof MetaToken)) && (tt).begin_token.is_value(add_typ2, null)))))) {
                    if (_typ !== null) {
                        if (!ParticipantToken._is_types_equal(add_typ2, _typ)) 
                            break;
                    }
                    _typ = add_typ2;
                    t1 = tt;
                    continue;
                }
                if (tt.chars.is_letter) {
                    if (term1 !== null) {
                        let tok1 = term1.try_parse(tt, TerminParseAttr.NO, 0);
                        if (tok1 !== null) {
                            if (_typ !== null) {
                                if (!ParticipantToken._is_types_equal(add_typ1, _typ)) 
                                    break;
                            }
                            _typ = add_typ1;
                            t1 = (tt = tok1.end_token);
                            continue;
                        }
                    }
                    if (term2 !== null) {
                        let tok2 = term2.try_parse(tt, TerminParseAttr.NO, 0);
                        if (tok2 !== null) {
                            if (_typ !== null) {
                                if (!ParticipantToken._is_types_equal(add_typ2, _typ)) 
                                    break;
                            }
                            _typ = add_typ2;
                            t1 = (tt = tok2.end_token);
                            continue;
                        }
                    }
                    if (named && tt.get_morph_class_in_dictionary().is_noun) {
                        if (!tt.chars.is_all_lower || BracketHelper.is_bracket(tt.previous, true)) {
                            if (DecreeToken.is_keyword(tt, false) === null) {
                                let val = tt.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false);
                                if (_typ !== null) {
                                    if (!ParticipantToken._is_types_equal(_typ, val)) 
                                        break;
                                }
                                _typ = val;
                                t1 = tt;
                                continue;
                            }
                        }
                    }
                }
                if (named && _typ === null && is_contract) {
                    if ((tt instanceof TextToken) && tt.chars.is_cyrillic_letter && tt.chars.is_capital_upper) {
                        let dc = tt.get_morph_class_in_dictionary();
                        if (dc.is_undefined || dc.is_noun) {
                            let dt = DecreeToken.try_attach(tt, null, false);
                            let ok = true;
                            if (dt !== null) 
                                ok = false;
                            else if (tt.is_value("СТОРОНА", null)) 
                                ok = false;
                            if (ok) {
                                _typ = (tt).get_lemma();
                                t1 = tt;
                                continue;
                            }
                        }
                        if (dc.is_adjective) {
                            let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                            if (npt !== null && npt.adjectives.length > 0 && npt.noun.get_morph_class_in_dictionary().is_noun) {
                                _typ = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                                t1 = npt.end_token;
                                continue;
                            }
                        }
                    }
                }
                if (tt === t) 
                    break;
                if ((tt instanceof NumberToken) || tt.is_char('.')) 
                    break;
                if (tt.length_char < 4) {
                    if (_typ !== null) 
                        continue;
                }
                break;
            }
            if (tok.termin.tag === null) 
                named = true;
            else {
                if (_typ !== null) 
                    break;
                if (tok.termin.canonic_text === "СТОРОНА") {
                    let tt1 = tt.next;
                    if (tt1 !== null && tt1.is_hiphen) 
                        tt1 = tt1.next;
                    if (!((tt1 instanceof NumberToken))) 
                        break;
                    if (tt1.is_newline_before) 
                        break;
                    _typ = (tok.termin.canonic_text + " " + (tt1).value);
                    t1 = tt1;
                }
                else {
                    _typ = tok.termin.canonic_text;
                    t1 = tok.end_token;
                }
                break;
            }
            tt = tok.end_token;
        }
        if (_typ === null) 
            return null;
        if (!named && t1 !== t && !_typ.startsWith("СТОРОНА")) {
            if (!ParticipantToken._is_types_equal(_typ, add_typ1) && !ParticipantToken._is_types_equal(_typ, add_typ2)) 
                return null;
        }
        if (BracketHelper.can_be_end_of_sequence(t1.next, false, null, false)) {
            t1 = t1.next;
            if (!t.is_whitespace_before && BracketHelper.can_be_start_of_sequence(t.previous, false, false)) 
                t = t.previous;
        }
        else if (BracketHelper.can_be_start_of_sequence(t, false, false) && BracketHelper.can_be_end_of_sequence(t1.next, true, t, true)) 
            t1 = t1.next;
        if (br && t1.next !== null && BracketHelper.can_be_end_of_sequence(t1.next, false, null, false)) 
            t1 = t1.next;
        let res = ParticipantToken._new1572(t, t1, (named ? ParticipantTokenKinds.NAMEDAS : ParticipantTokenKinds.PURE), _typ);
        if (t.is_char(':')) 
            res.begin_token = t.next;
        return res;
    }
    
    static _is_types_equal(t1, t2) {
        if (t1 === t2) 
            return true;
        if (t1 === "ЗАЙМОДАВЕЦ" || t1 === "ЗАИМОДАВЕЦ") 
            t1 = "ЗАИМОДАТЕЛЬ";
        if (t2 === "ЗАЙМОДАВЕЦ" || t2 === "ЗАИМОДАВЕЦ") 
            t2 = "ЗАИМОДАТЕЛЬ";
        if (t1 === "ПРОДАВЕЦ") 
            t1 = "ПОСТАВЩИК";
        if (t2 === "ПРОДАВЕЦ") 
            t2 = "ПОСТАВЩИК";
        if (t1 === "ПОКУПАТЕЛЬ") 
            t1 = "ЗАКАЗЧИК";
        if (t2 === "ПОКУПАТЕЛЬ") 
            t2 = "ЗАКАЗЧИК";
        return t1 === t2;
    }
    
    static try_attach_to_exist(t, p1, p2) {
        if (t === null) 
            return null;
        if (t.begin_char >= 7674 && (t.begin_char < 7680)) {
        }
        let pp = ParticipantToken.try_attach(t, p1, p2, false);
        let p = null;
        let rt = null;
        if (pp === null || pp.kind !== ParticipantTokenKinds.PURE) {
            let pers = t.get_referent();
            if ((pers instanceof PersonReferent) || (pers instanceof GeoReferent) || (pers instanceof OrganizationReferent)) {
                if (p1 !== null && p1.contains_ref(pers)) 
                    p = p1;
                else if (p2 !== null && p2.contains_ref(pers)) 
                    p = p2;
                if (p !== null) 
                    rt = new ReferentToken(p, t, t);
            }
        }
        else {
            if (p1 !== null && ParticipantToken._is_types_equal(pp.typ, p1.typ)) 
                p = p1;
            else if (p2 !== null && ParticipantToken._is_types_equal(pp.typ, p2.typ)) 
                p = p2;
            if (p !== null) {
                rt = new ReferentToken(p, pp.begin_token, pp.end_token);
                if (rt.begin_token.previous !== null && rt.begin_token.previous.is_value("ОТ", null)) 
                    rt.begin_token = rt.begin_token.previous;
            }
        }
        if (rt === null) 
            return null;
        if (rt.end_token.next !== null && rt.end_token.next.is_char(':')) {
            let rt1 = ParticipantToken.try_attach_requisites(rt.end_token.next.next, p, (p === p1 ? p2 : p1), false);
            if (rt1 !== null) {
                rt1.begin_token = rt.begin_token;
                return rt1;
            }
            rt.end_token = rt.end_token.next;
        }
        while (rt.end_token.next !== null && (rt.end_token.next.get_referent() instanceof OrganizationReferent)) {
            let org = Utils.as(rt.end_token.next.get_referent(), OrganizationReferent);
            if (rt.referent.find_slot(null, org, true) !== null) {
                rt.end_token = rt.end_token.next;
                continue;
            }
            break;
        }
        return rt;
    }
    
    static try_attach_requisites(t, cur, other, cant_be_empty = false) {
        if (t === null || cur === null) 
            return null;
        if (t.is_table_control_char) 
            return null;
        let err = 0;
        let spec_chars = 0;
        let rt = null;
        let t0 = t;
        let is_in_tab_cell = false;
        let cou = 0;
        for (let tt = t.next; tt !== null && (cou < 300); tt = tt.next,cou++) {
            if (tt.is_table_control_char) {
                is_in_tab_cell = true;
                break;
            }
        }
        for (; t !== null; t = t.next) {
            if (t.begin_char === 8923) {
            }
            if (t.is_table_control_char) {
                if (t !== t0) {
                    if (rt !== null) 
                        rt.end_token = t.previous;
                    else if (!cant_be_empty) 
                        rt = new ReferentToken(cur, t0, t.previous);
                    break;
                }
                else 
                    continue;
            }
            if ((t.is_char_of(":.") || t.is_value("М", null) || t.is_value("M", null)) || t.is_value("П", null)) {
                if (rt !== null) 
                    rt.end_token = t;
                continue;
            }
            let pp = ParticipantToken.try_attach_to_exist(t, cur, other);
            if (pp !== null) {
                if (pp.referent !== cur) 
                    break;
                if (rt === null) 
                    rt = new ReferentToken(cur, t, t);
                rt.end_token = pp.end_token;
                err = 0;
                continue;
            }
            if (t.is_newline_before) {
                let iii = InstrToken.parse(t, 0, null);
                if (iii !== null) {
                    if (iii.typ === ILTypes.APPENDIX) 
                        break;
                }
            }
            if (t.whitespaces_before_count > 25 && !is_in_tab_cell) {
                if (t !== t0) {
                    if (t.previous !== null && t.previous.is_char_of(",;")) {
                    }
                    else if (t.newlines_before_count > 1) 
                        break;
                }
                if ((t.get_referent() instanceof PersonReferent) || (t.get_referent() instanceof OrganizationReferent)) {
                    if (!cur.contains_ref(t.get_referent())) 
                        break;
                }
            }
            if ((t.is_char_of(";:,.") || t.is_hiphen || t.morph.class0.is_preposition) || t.morph.class0.is_conjunction) 
                continue;
            if (t.is_char_of("_/\\")) {
                if ((++spec_chars) > 10 && rt === null) 
                    rt = new ReferentToken(cur, t0, t);
                if (rt !== null) 
                    rt.end_token = t;
                continue;
            }
            if (t.is_newline_before && (t instanceof NumberToken)) 
                break;
            if (t.is_value("ОФИС", null)) {
                if (BracketHelper.can_be_start_of_sequence(t.next, true, false)) {
                    let br = BracketHelper.try_parse(t.next, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        t = br.end_token;
                        continue;
                    }
                }
                if ((t.next instanceof TextToken) && !t.next.chars.is_all_lower) 
                    t = t.next;
                continue;
            }
            let r = t.get_referent();
            if ((((r instanceof PersonReferent) || (r instanceof AddressReferent) || (r instanceof UriReferent)) || (r instanceof OrganizationReferent) || (r instanceof PhoneReferent)) || (r instanceof PersonIdentityReferent) || (r instanceof BankDataReferent)) {
                if (other !== null && other.find_slot(null, r, true) !== null) {
                    if (!((r instanceof UriReferent))) 
                        break;
                }
                if (rt === null) 
                    rt = new ReferentToken(cur, t, t);
                if (cur.find_slot(InstrumentParticipant.ATTR_DELEGATE, r, true) !== null) {
                }
                else 
                    cur.add_slot(InstrumentParticipant.ATTR_REF, r, false, 0);
                rt.end_token = t;
                err = 0;
            }
            else {
                if ((t instanceof TextToken) && t.length_char > 1) 
                    ++err;
                if (is_in_tab_cell && rt !== null) {
                    if (err > 300) 
                        break;
                }
                else if (err > 4) 
                    break;
            }
        }
        return rt;
    }
    
    attach_first(p, min_char, max_char) {
        let t = null;
        let tt0 = this.begin_token;
        let refs = new Array();
        for (t = tt0.previous; t !== null && t.begin_char >= min_char; t = t.previous) {
            if (t.is_newline_after) {
                if (t.newlines_after_count > 1) 
                    break;
                if (t.next instanceof NumberToken) 
                    break;
            }
            let tt = ParticipantToken._try_attach_contract_ground(t, p, false);
            if (tt !== null) 
                continue;
            let r = t.get_referent();
            if (((((r instanceof OrganizationReferent) || (r instanceof PhoneReferent) || (r instanceof PersonReferent)) || (r instanceof PersonPropertyReferent) || (r instanceof AddressReferent)) || (r instanceof UriReferent) || (r instanceof PersonIdentityReferent)) || (r instanceof BankDataReferent)) {
                if (!refs.includes(r)) 
                    refs.splice(0, 0, r);
                tt0 = t;
            }
        }
        if (refs.length > 0) {
            for (const r of refs) {
                if (r !== refs[0] && (refs[0] instanceof OrganizationReferent) && (((r instanceof PersonReferent) || (r instanceof PersonPropertyReferent)))) 
                    p.add_slot(InstrumentParticipant.ATTR_DELEGATE, r, false, 0);
                else 
                    p.add_slot(InstrumentParticipant.ATTR_REF, r, false, 0);
            }
        }
        let rt = new ReferentToken(p, tt0, this.end_token);
        t = this.end_token.next;
        if (BracketHelper.is_bracket(t, false)) 
            t = t.next;
        if (t !== null && t.is_char(',')) 
            t = t.next;
        for (; t !== null && ((max_char === 0 || t.begin_char <= max_char)); t = t.next) {
            if (t.is_value("СТОРОНА", null)) 
                break;
            let r = t.get_referent();
            if (((((r instanceof OrganizationReferent) || (r instanceof PhoneReferent) || (r instanceof PersonReferent)) || (r instanceof PersonPropertyReferent) || (r instanceof AddressReferent)) || (r instanceof UriReferent) || (r instanceof PersonIdentityReferent)) || (r instanceof BankDataReferent)) {
                if ((((r instanceof PersonPropertyReferent) && t.next !== null && t.next.is_comma) && (t.next.next instanceof ReferentToken) && (t.next.next.get_referent() instanceof PersonReferent)) && !t.next.is_newline_after) {
                    let pe = Utils.as(t.next.next.get_referent(), PersonReferent);
                    pe.add_slot(PersonReferent.ATTR_ATTR, r, false, 0);
                    r = pe;
                    t = t.next.next;
                }
                let is_delegate = false;
                if (t.previous.is_value("ЛИЦО", null) || t.previous.is_value("ИМЯ", null)) 
                    is_delegate = true;
                if (t.previous.is_value("КОТОРЫЙ", null) && t.previous.previous !== null && ((t.previous.previous.is_value("ИМЯ", null) || t.previous.previous.is_value("ЛИЦО", null)))) 
                    is_delegate = true;
                p.add_slot(((((r instanceof PersonReferent) || (r instanceof PersonPropertyReferent))) && is_delegate ? InstrumentParticipant.ATTR_DELEGATE : InstrumentParticipant.ATTR_REF), r, false, 0);
                rt.end_token = t;
                continue;
            }
            let tt = ParticipantToken._try_attach_contract_ground(t, p, false);
            if (tt !== null) {
                t = rt.end_token = tt;
                if (rt.begin_char === tt.begin_char) 
                    rt.begin_token = tt;
                continue;
            }
            if (t.is_value("В", null) && t.next !== null && t.next.is_value("ЛИЦО", null)) {
                t = t.next;
                continue;
            }
            if (t.is_value("ОТ", null) && t.next !== null && t.next.is_value("ИМЯ", null)) {
                t = t.next;
                continue;
            }
            if (t.is_value("ПО", null) && t.next !== null && t.next.is_value("ПОРУЧЕНИЕ", null)) {
                t = t.next;
                continue;
            }
            if (t.is_newline_before) 
                break;
            if (MorphClass.ooEq(t.get_morph_class_in_dictionary(), MorphClass.VERB)) {
                if ((!t.is_value("УДОСТОВЕРЯТЬ", null) && !t.is_value("ПРОЖИВАТЬ", null) && !t.is_value("ЗАРЕГИСТРИРОВАТЬ", null)) && !t.is_value("ДЕЙСТВОВАТЬ", null)) 
                    break;
            }
            if (t.is_and && t.previous !== null && t.previous.is_comma) 
                break;
            if (t.is_and && t.next.get_referent() !== null) {
                if (t.next.get_referent() instanceof OrganizationReferent) 
                    break;
                let pe = Utils.as(t.next.get_referent(), PersonReferent);
                if (pe !== null) {
                    let has_ip = false;
                    for (const s of pe.slots) {
                        if (s.type_name === PersonReferent.ATTR_ATTR) {
                            if (s.value.toString().startsWith("индивидуальный предприниматель")) {
                                has_ip = true;
                                break;
                            }
                        }
                    }
                    if (has_ip) 
                        break;
                }
            }
        }
        for (t = rt.begin_token; t !== null && t.end_char <= rt.end_char; t = t.next) {
            let tt = ParticipantToken._try_attach_contract_ground(t, p, true);
            if (tt !== null) {
                if (tt.end_char > rt.end_char) 
                    rt.end_token = tt;
                t = tt;
            }
        }
        return rt;
    }
    
    static _try_attach_contract_ground(t, ip, can_be_passport = false) {
        let ok = false;
        for (; t !== null; t = t.next) {
            if (t.is_char(',') || t.morph.class0.is_preposition) 
                continue;
            if (t.is_char('(')) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    t = br.end_token;
                    continue;
                }
            }
            if (t.is_value("ОСНОВАНИЕ", null) || t.is_value("ДЕЙСТВОВАТЬ", null) || t.is_value("ДЕЙСТВУЮЩИЙ", null)) {
                ok = true;
                if (t.next !== null && t.next.is_char('(')) {
                    let br = BracketHelper.try_parse(t.next, BracketParseAttr.NO, 100);
                    if (br !== null && (br.length_char < 10)) 
                        t = br.end_token;
                }
                continue;
            }
            let dr = Utils.as(t.get_referent(), DecreeReferent);
            if (dr !== null) {
                ip.ground = dr;
                return t;
            }
            let pir = Utils.as(t.get_referent(), PersonIdentityReferent);
            if (pir !== null && can_be_passport) {
                if (pir.typ !== null && !pir.typ.includes("паспорт")) {
                    ip.ground = pir;
                    return t;
                }
            }
            if (t.is_value("УСТАВ", null)) {
                ip.ground = t.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false);
                return t;
            }
            if (t.is_value("ДОВЕРЕННОСТЬ", null)) {
                let dts = DecreeToken.try_attach_list(t.next, null, 10, false);
                if (dts === null) {
                    let has_spec = false;
                    for (let ttt = t.next; ttt !== null && ((ttt.end_char - t.end_char) < 200); ttt = ttt.next) {
                        if (ttt.is_comma) 
                            continue;
                        if (ttt.is_value("УДОСТОВЕРИТЬ", null) || ttt.is_value("УДОСТОВЕРЯТЬ", null)) {
                            has_spec = true;
                            continue;
                        }
                        let dt = DecreeToken.try_attach(ttt, null, false);
                        if (dt !== null) {
                            if (dt.typ === DecreeTokenItemType.DATE || dt.typ === DecreeTokenItemType.NUMBER) {
                                dts = DecreeToken.try_attach_list(ttt, null, 10, false);
                                break;
                            }
                        }
                        let npt = NounPhraseHelper.try_parse(ttt, NounPhraseParseAttr.NO, 0, null);
                        if (npt !== null) {
                            if (npt.end_token.is_value("НОТАРИУС", null)) {
                                ttt = npt.end_token;
                                has_spec = true;
                                continue;
                            }
                        }
                        if (ttt.get_referent() !== null) {
                            if (has_spec) 
                                continue;
                        }
                        break;
                    }
                }
                if (dts !== null && dts.length > 0) {
                    let t0 = t;
                    dr = new DecreeReferent();
                    dr.typ = "ДОВЕРЕННОСТЬ";
                    for (const d of dts) {
                        if (d.typ === DecreeTokenItemType.DATE) {
                            dr.add_date(d);
                            t = d.end_token;
                        }
                        else if (d.typ === DecreeTokenItemType.NUMBER) {
                            dr.add_number(d);
                            t = d.end_token;
                        }
                        else 
                            break;
                    }
                    let ad = t.kit.get_analyzer_data_by_analyzer_name(InstrumentAnalyzer.ANALYZER_NAME);
                    ip.ground = ad.register_referent(dr);
                    let rt = new ReferentToken(Utils.as(ip.ground, Referent), t0, t);
                    t.kit.embed_token(rt);
                    return rt;
                }
                ip.ground = "ДОВЕРЕННОСТЬ";
                return t;
            }
            break;
        }
        return null;
    }
    
    static get_doc_types(name, name2) {
        let res = new Array();
        if (name === null) 
            return res;
        if (name === "АРЕНДОДАТЕЛЬ") {
            res.push("ДОГОВОР АРЕНДЫ");
            res.push("ДОГОВОР СУБАРЕНДЫ");
        }
        else if (name === "АРЕНДАТОР") 
            res.push("ДОГОВОР АРЕНДЫ");
        else if (name === "СУБАРЕНДАТОР") 
            res.push("ДОГОВОР СУБАРЕНДЫ");
        else if (name === "НАЙМОДАТЕЛЬ" || name === "НАНИМАТЕЛЬ") 
            res.push("ДОГОВОР НАЙМА");
        else if (name === "АГЕНТ" || name === "ПРИНЦИПАЛ") 
            res.push("АГЕНТСКИЙ ДОГОВОР");
        else if (name === "ПРОДАВЕЦ" || name === "ПОКУПАТЕЛЬ") 
            res.push("ДОГОВОР КУПЛИ-ПРОДАЖИ");
        else if (name === "ЗАКАЗЧИК" || name === "ИСПОЛНИТЕЛЬ" || LanguageHelper.ends_with(name, "ПОДРЯДЧИК")) 
            res.push("ДОГОВОР УСЛУГ");
        else if (name === "ПОСТАВЩИК") 
            res.push("ДОГОВОР ПОСТАВКИ");
        else if (name === "ЛИЦЕНЗИАР" || name === "ЛИЦЕНЗИАТ") 
            res.push("ЛИЦЕНЗИОННЫЙ ДОГОВОР");
        else if (name === "СТРАХОВЩИК" || name === "СТРАХОВАТЕЛЬ") 
            res.push("ДОГОВОР СТРАХОВАНИЯ");
        if (name2 === null) 
            return res;
        let tmp = ParticipantToken.get_doc_types(name2, null);
        for (let i = res.length - 1; i >= 0; i--) {
            if (!tmp.includes(res[i])) 
                res.splice(i, 1);
        }
        return res;
    }
    
    static initialize() {
        if (ParticipantToken.m_ontology !== null) 
            return;
        ParticipantToken.m_ontology = new TerminCollection();
        let t = null;
        for (const s of ["АРЕНДОДАТЕЛЬ", "АРЕНДАТОР", "СУБАРЕНДАТОР", "НАЙМОДАТЕЛЬ", "НАНИМАТЕЛЬ", "АГЕНТ", "ПРИНЦИПАЛ", "ПРОДАВЕЦ", "ПОКУПАТЕЛЬ", "ЗАКАЗЧИК", "ИСПОЛНИТЕЛЬ", "ПОСТАВЩИК", "ПОДРЯДЧИК", "СУБПОДРЯДЧИК", "СТОРОНА", "ЛИЦЕНЗИАР", "ЛИЦЕНЗИАТ", "СТРАХОВЩИК", "СТРАХОВАТЕЛЬ", "ПРОВАЙДЕР", "АБОНЕНТ", "ЗАСТРОЙЩИК", "УЧАСТНИК ДОЛЕВОГО СТРОИТЕЛЬСТВА", "КЛИЕНТ", "ЗАЕМЩИК", "УПРАВЛЯЮЩИЙ"]) {
            ParticipantToken.m_ontology.add(Termin._new119(s, ParticipantToken.m_ontology));
        }
        t = Termin._new119("ГЕНПОДРЯДЧИК", ParticipantToken.m_ontology);
        t.add_variant("ГЕНЕРАЛЬНЫЙ ПОДРЯДЧИК", false);
        ParticipantToken.m_ontology.add(t);
        t = Termin._new119("ЗАИМОДАТЕЛЬ", ParticipantToken.m_ontology);
        t.add_variant("ЗАЙМОДАТЕЛЬ", false);
        t.add_variant("ЗАЙМОДАВЕЦ", false);
        t.add_variant("ЗАИМОДАВЕЦ", false);
        ParticipantToken.m_ontology.add(t);
        t = new Termin("ИМЕНУЕМЫЙ");
        t.add_variant("ИМЕНОВАТЬСЯ", false);
        t.add_variant("ИМЕНУЕМ", false);
        t.add_variant("ДАЛЬНЕЙШИЙ", false);
        t.add_variant("ДАЛЕЕ", false);
        t.add_variant("ДАЛЕЕ ПО ТЕКСТУ", false);
        ParticipantToken.m_ontology.add(t);
    }
    
    static _new1436(_arg1, _arg2, _arg3) {
        let res = new ParticipantToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new1567(_arg1, _arg2, _arg3) {
        let res = new ParticipantToken(_arg1, _arg2);
        res.kind = _arg3;
        return res;
    }
    
    static _new1572(_arg1, _arg2, _arg3, _arg4) {
        let res = new ParticipantToken(_arg1, _arg2);
        res.kind = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static static_constructor() {
        ParticipantToken.m_ontology = null;
    }
}


ParticipantToken.static_constructor();

module.exports = ParticipantToken