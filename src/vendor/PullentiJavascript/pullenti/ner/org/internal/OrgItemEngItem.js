/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const GetTextAttr = require("./../../core/GetTextAttr");
const OrganizationReferent = require("./../OrganizationReferent");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const MetaToken = require("./../../MetaToken");
const TerminCollection = require("./../../core/TerminCollection");
const Referent = require("./../../Referent");
const OrgProfile = require("./../OrgProfile");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const NumberSpellingType = require("./../../NumberSpellingType");
const TextToken = require("./../../TextToken");
const ReferentToken = require("./../../ReferentToken");
const NumberToken = require("./../../NumberToken");
const Termin = require("./../../core/Termin");
const MiscHelper = require("./../../core/MiscHelper");
const BracketHelper = require("./../../core/BracketHelper");
const GeoReferent = require("./../../geo/GeoReferent");
const OrgItemTypeToken = require("./OrgItemTypeToken");

class OrgItemEngItem extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.full_value = null;
        this.short_value = null;
    }
    
    get is_bank() {
        return this.full_value === "bank";
    }
    
    static try_attach(t, can_be_cyr = false) {
        if (t === null || !((t instanceof TextToken))) 
            return null;
        let tok = (can_be_cyr ? OrgItemEngItem.m_ontology.try_parse(t, TerminParseAttr.NO) : null);
        if (!t.chars.is_latin_letter && tok === null) {
            if (!t.is_and || t.next === null) 
                return null;
            if (t.next.is_value("COMPANY", null) || t.next.is_value("CO", null)) {
                let res = new OrgItemEngItem(t, t.next);
                res.full_value = "company";
                if (res.end_token.next !== null && res.end_token.next.is_char('.')) 
                    res.end_token = res.end_token.next;
                return res;
            }
            return null;
        }
        if (t.chars.is_latin_letter) 
            tok = OrgItemEngItem.m_ontology.try_parse(t, TerminParseAttr.NO);
        if (tok !== null) {
            if (!OrgItemEngItem._check_tok(tok)) 
                return null;
            let res = new OrgItemEngItem(tok.begin_token, tok.end_token);
            res.full_value = tok.termin.canonic_text.toLowerCase();
            res.short_value = tok.termin.acronym;
            return res;
        }
        return null;
    }
    
    static _check_tok(tok) {
        if (tok.termin.acronym === "SA") {
            let tt0 = tok.begin_token.previous;
            if (tt0 !== null && tt0.is_char('.')) 
                tt0 = tt0.previous;
            if (tt0 instanceof TextToken) {
                if ((tt0).term === "U") 
                    return false;
            }
        }
        else if (tok.begin_token.is_value("CO", null) && tok.begin_token === tok.end_token) {
            if (tok.end_token.next !== null && tok.end_token.next.is_hiphen) 
                return false;
        }
        if (!tok.is_whitespace_after) {
            if (tok.end_token.next instanceof NumberToken) 
                return false;
        }
        return true;
    }
    
    static try_attach_org(t, can_be_cyr = false) {
        const OrgItemNameToken = require("./OrgItemNameToken");
        if (t === null) 
            return null;
        let br = false;
        if (t.is_char('(') && t.next !== null) {
            t = t.next;
            br = true;
        }
        if (t instanceof NumberToken) {
            if ((t).typ === NumberSpellingType.WORDS && t.morph.class0.is_adjective && t.chars.is_capital_upper) {
            }
            else 
                return null;
        }
        else {
            if (t.chars.is_all_lower) 
                return null;
            if ((t.length_char < 3) && !t.chars.is_letter) 
                return null;
            if (!t.chars.is_latin_letter) {
                if (!can_be_cyr || !t.chars.is_cyrillic_letter) 
                    return null;
            }
        }
        let t0 = t;
        let t1 = t0;
        let nam_wo = 0;
        let tok = null;
        let _geo = null;
        let add_typ = null;
        for (; t !== null; t = t.next) {
            if (t !== t0 && t.whitespaces_before_count > 1) 
                break;
            if (t.is_char(')')) 
                break;
            if (t.is_char('(') && t.next !== null) {
                if ((t.next.get_referent() instanceof GeoReferent) && t.next.next !== null && t.next.next.is_char(')')) {
                    _geo = Utils.as(t.next.get_referent(), GeoReferent);
                    t = t.next.next;
                    continue;
                }
                let typ = OrgItemTypeToken.try_attach(t.next, true, null);
                if ((typ !== null && typ.end_token.next !== null && typ.end_token.next.is_char(')')) && typ.chars.is_latin_letter) {
                    add_typ = typ;
                    t = typ.end_token.next;
                    continue;
                }
                if (((t.next instanceof TextToken) && t.next.next !== null && t.next.next.is_char(')')) && t.next.chars.is_capital_upper) {
                    t1 = (t = t.next.next);
                    continue;
                }
                break;
            }
            tok = OrgItemEngItem.try_attach(t, can_be_cyr);
            if (tok === null && t.is_char_of(".,") && t.next !== null) {
                tok = OrgItemEngItem.try_attach(t.next, can_be_cyr);
                if (tok === null && t.next.is_char_of(",.")) 
                    tok = OrgItemEngItem.try_attach(t.next.next, can_be_cyr);
            }
            if (tok !== null) {
                if (tok.length_char === 1 && t0.chars.is_cyrillic_letter) 
                    return null;
                break;
            }
            if (t.is_hiphen && !t.is_whitespace_after && !t.is_whitespace_before) 
                continue;
            if (t.is_char_of("&+") || t.is_and) 
                continue;
            if (t.is_char('.')) {
                if (t.previous !== null && t.previous.length_char === 1) 
                    continue;
                else if (MiscHelper.can_be_start_of_sentence(t.next)) 
                    break;
            }
            if (!t.chars.is_latin_letter) {
                if (!can_be_cyr || !t.chars.is_cyrillic_letter) 
                    break;
            }
            if (t.chars.is_all_lower) {
                if (t.morph.class0.is_preposition || t.morph.class0.is_conjunction) 
                    continue;
                if (br) 
                    continue;
                break;
            }
            let mc = t.get_morph_class_in_dictionary();
            if (mc.is_verb) {
                if (t.next !== null && t.next.morph.class0.is_preposition) 
                    break;
            }
            if (t.next !== null && t.next.is_value("OF", null)) 
                break;
            if (t instanceof TextToken) 
                nam_wo++;
            t1 = t;
        }
        if (tok === null) 
            return null;
        if (t0 === tok.begin_token) {
            let br2 = BracketHelper.try_parse(tok.end_token.next, BracketParseAttr.NO, 100);
            if (br2 !== null) {
                let org1 = new OrganizationReferent();
                if (tok.short_value !== null) 
                    org1.add_type_str(tok.short_value);
                org1.add_type_str(tok.full_value);
                let nam1 = MiscHelper.get_text_value(br2.begin_token, br2.end_token, GetTextAttr.NO);
                if (nam1 !== null) {
                    org1.add_name(nam1, true, null);
                    return new ReferentToken(org1, t0, br2.end_token);
                }
            }
            return null;
        }
        let _org = new OrganizationReferent();
        let te = tok.end_token;
        if (tok.is_bank) 
            t1 = tok.end_token;
        if (tok.full_value === "company" && (tok.whitespaces_after_count < 3)) {
            let tok1 = OrgItemEngItem.try_attach(tok.end_token.next, can_be_cyr);
            if (tok1 !== null) {
                t1 = tok.end_token;
                tok = tok1;
                te = tok.end_token;
            }
        }
        if (tok.full_value === "company") {
            if (nam_wo === 0) 
                return null;
        }
        let nam = MiscHelper.get_text_value(t0, t1, GetTextAttr.IGNOREARTICLES);
        if (nam === "STOCK" && tok.full_value === "company") 
            return null;
        let alt_nam = null;
        if (Utils.isNullOrEmpty(nam)) 
            return null;
        if (nam.indexOf('(') > 0) {
            let i1 = nam.indexOf('(');
            let i2 = nam.indexOf(')');
            if (i1 < i2) {
                alt_nam = nam;
                let tai = null;
                if ((i2 + 1) < nam.length) 
                    tai = nam.substring(i2).trim();
                nam = nam.substring(0, 0 + i1).trim();
                if (tai !== null) 
                    nam = (nam + " " + tai);
            }
        }
        if (tok.is_bank) {
            _org.add_type_str((tok.kit.base_language.is_en ? "bank" : "банк"));
            _org.add_profile(OrgProfile.FINANCE);
            if ((t1.next !== null && t1.next.is_value("OF", null) && t1.next.next !== null) && t1.next.next.chars.is_latin_letter) {
                let nam0 = OrgItemNameToken.try_attach(t1.next, null, false, false);
                if (nam0 !== null) 
                    te = nam0.end_token;
                else 
                    te = t1.next.next;
                nam = MiscHelper.get_text_value(t0, te, GetTextAttr.NO);
                if (te.get_referent() instanceof GeoReferent) 
                    _org.add_geo_object(Utils.as(te.get_referent(), GeoReferent));
            }
            else if (t0 === t1) 
                return null;
        }
        else {
            if (tok.short_value !== null) 
                _org.add_type_str(tok.short_value);
            _org.add_type_str(tok.full_value);
        }
        if (Utils.isNullOrEmpty(nam)) 
            return null;
        _org.add_name(nam, true, null);
        if (alt_nam !== null) 
            _org.add_name(alt_nam, true, null);
        let res = new ReferentToken(_org, t0, te);
        t = te;
        while (t.next !== null) {
            if (t.next.is_char_of(",.")) 
                t = t.next;
            else 
                break;
        }
        if (t.whitespaces_after_count < 2) {
            tok = OrgItemEngItem.try_attach(t.next, can_be_cyr);
            if (tok !== null) {
                if (tok.short_value !== null) 
                    _org.add_type_str(tok.short_value);
                _org.add_type_str(tok.full_value);
                res.end_token = tok.end_token;
            }
        }
        if (_geo !== null) 
            _org.add_geo_object(_geo);
        if (add_typ !== null) 
            _org.add_type(add_typ, false);
        if (!br) 
            return res;
        t = res.end_token;
        if (t.next === null || t.next.is_char(')')) 
            res.end_token = t.next;
        else 
            return null;
        return res;
    }
    
    static initialize() {
        if (OrgItemEngItem.m_ontology !== null) 
            return;
        OrgItemEngItem.m_ontology = new TerminCollection();
        let t = null;
        t = new Termin("BANK");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Public Limited Company".toUpperCase(), "PLC");
        t.add_abridge("P.L.C.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Limited Liability Company".toUpperCase(), "LLC");
        t.add_abridge("L.L.C.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Limited Liability Partnership".toUpperCase(), "LLP");
        t.add_abridge("L.L.P.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Limited Liability Limited Partnership".toUpperCase(), "LLLP");
        t.add_abridge("L.L.L.P.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Limited Duration Company".toUpperCase(), "LDC");
        t.add_abridge("L.D.C.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("International Business Company".toUpperCase(), "IBC");
        t.add_abridge("I.B.S.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Joint stock company".toUpperCase(), "JSC");
        t.add_abridge("J.S.C.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Open Joint stock company".toUpperCase(), "OJSC");
        t.add_abridge("O.J.S.C.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Sosiedad Anonima".toUpperCase(), "SA");
        t.add_variant("Sociedad Anonima".toUpperCase(), false);
        t.add_abridge("S.A.");
        t.add_variant("SPA", false);
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Société en commandite".toUpperCase(), "SC");
        t.add_abridge("S.C.");
        t.add_variant("SCS", false);
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Societas Europaea".toUpperCase(), "SE");
        t.add_abridge("S.E.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Società in accomandita".toUpperCase(), "SAS");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Société en commandite par actions".toUpperCase(), "SCA");
        t.add_abridge("S.C.A.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Société en nom collectif".toUpperCase(), "SNC");
        t.add_variant("Società in nome collettivo".toUpperCase(), false);
        t.add_abridge("S.N.C.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("General Partnership".toUpperCase(), "GP");
        t.add_variant("General Partners", false);
        t.add_abridge("G.P.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Limited Partnership".toUpperCase(), "LP");
        t.add_abridge("L.P.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Kommanditaktiengesellschaft".toUpperCase(), "KGAA");
        t.add_variant("KOMMAG", false);
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Societe a Responsidilite Limitee".toUpperCase(), "SRL");
        t.add_abridge("S.A.R.L.");
        t.add_abridge("S.R.L.");
        t.add_variant("SARL", false);
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Società a garanzia limitata".toUpperCase(), "SAGL");
        t.add_abridge("S.A.G.L.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Società limitata".toUpperCase(), "SL");
        t.add_abridge("S.L.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Vennootschap Met Beperkte Aansparkelij kheid".toUpperCase(), "BV");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Vennootschap Met Beperkte Aansparkelij".toUpperCase(), "AVV");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Naamlose Vennootschap".toUpperCase(), "NV");
        t.add_abridge("N.V.");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Gesellschaft mit beschrakter Haftung".toUpperCase(), "GMBH");
        t.add_variant("ГМБХ", false);
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Aktiengesellschaft".toUpperCase(), "AG");
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("International Company".toUpperCase(), "IC");
        t.add_abridge("I.C.");
        OrgItemEngItem.m_ontology.add(t);
        t = new Termin("And Company".toUpperCase());
        t.add_variant("& Company", false);
        t.add_variant("& Co", false);
        t.add_variant("& Company", false);
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Kollektivgesellschaft".toUpperCase(), "KG");
        t.add_abridge("K.G.");
        t.add_variant("OHG", false);
        OrgItemEngItem.m_ontology.add(t);
        t = Termin._new114("Kommanditgesellschaft".toUpperCase(), "KG");
        t.add_variant("KOMMG", false);
        OrgItemEngItem.m_ontology.add(t);
        t = new Termin("LIMITED");
        t.add_abridge("LTD");
        t.add_variant("LTD", false);
        t.add_variant("ЛИМИТЕД", false);
        t.add_variant("ЛТД", false);
        OrgItemEngItem.m_ontology.add(t);
        t = new Termin("PRIVATE LIMITED");
        t.add_variant("PTE LTD", false);
        OrgItemEngItem.m_ontology.add(t);
        t = new Termin("INCORPORATED");
        t.add_abridge("INC");
        t.add_variant("INC", false);
        t.add_variant("ИНКОРПОРЕЙТЕД", false);
        t.add_variant("ИНК", false);
        OrgItemEngItem.m_ontology.add(t);
        t = new Termin("CORPORATION");
        t.add_variant("CO", false);
        t.add_variant("СО", false);
        t.add_variant("КОРПОРЕЙШН", false);
        t.add_variant("КОРПОРЕЙШЕН", false);
        OrgItemEngItem.m_ontology.add(t);
        t = new Termin("COMPANY");
        OrgItemEngItem.m_ontology.add(t);
    }
    
    static static_constructor() {
        OrgItemEngItem.m_ontology = null;
    }
}


OrgItemEngItem.static_constructor();

module.exports = OrgItemEngItem