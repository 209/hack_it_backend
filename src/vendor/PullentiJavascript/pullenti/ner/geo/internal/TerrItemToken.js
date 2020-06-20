/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../../unisharp/StringBuilder");
const Stream = require("./../../../unisharp/Stream");
const MemoryStream = require("./../../../unisharp/MemoryStream");
const XmlDocument = require("./../../../unisharp/XmlDocument");

const TerminCollection = require("./../../core/TerminCollection");
const CharsInfo = require("./../../../morph/CharsInfo");
const IntOntologyItem = require("./../../core/IntOntologyItem");
const MorphNumber = require("./../../../morph/MorphNumber");
const MetaToken = require("./../../MetaToken");
const Referent = require("./../../Referent");
const NumberSpellingType = require("./../../NumberSpellingType");
const ReferentToken = require("./../../ReferentToken");
const MorphLang = require("./../../../morph/MorphLang");
const EpNerAddressInternalResourceHelper = require("./../../address/internal/EpNerAddressInternalResourceHelper");
const Token = require("./../../Token");
const IntOntologyCollection = require("./../../core/IntOntologyCollection");
const NumberToken = require("./../../NumberToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const MorphWordForm = require("./../../../morph/MorphWordForm");
const GeoReferent = require("./../GeoReferent");
const CityItemTokenItemType = require("./CityItemTokenItemType");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const TextToken = require("./../../TextToken");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const MorphClass = require("./../../../morph/MorphClass");
const MorphGender = require("./../../../morph/MorphGender");
const BracketHelper = require("./../../core/BracketHelper");
const TerrTermin = require("./TerrTermin");
const MiscHelper = require("./../../core/MiscHelper");
const Termin = require("./../../core/Termin");
const MiscLocationHelper = require("./MiscLocationHelper");

class TerrItemToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.onto_item = null;
        this.onto_item2 = null;
        this.termin_item = null;
        this.is_adjective = false;
        this.is_district_name = false;
        this.adjective_ref = null;
        this.rzd = null;
        this.rzd_dir = null;
        this.can_be_city = false;
        this.can_be_surname = false;
        this.is_adj_in_dictionary = false;
        this.is_geo_in_dictionary = false;
        this.is_doubt = false;
    }
    
    get is_city_region() {
        if (this.termin_item === null) 
            return false;
        return (this.termin_item.canonic_text.includes("ГОРОДС") || this.termin_item.canonic_text.includes("МІСЬК") || this.termin_item.canonic_text.includes("МУНИЦИПАЛ")) || this.termin_item.canonic_text.includes("МУНІЦИПАЛ") || this.termin_item.canonic_text === "ПОЧТОВОЕ ОТДЕЛЕНИЕ";
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.onto_item !== null) 
            res.append(this.onto_item.canonic_text).append(" ");
        else if (this.termin_item !== null) 
            res.append(this.termin_item.canonic_text).append(" ");
        else 
            res.append(super.toString()).append(" ");
        if (this.adjective_ref !== null) 
            res.append(" (Adj: ").append(this.adjective_ref.referent.toString()).append(")");
        return res.toString().trim();
    }
    
    static try_parse_list(t, int_ont, max_count) {
        const CityItemToken = require("./CityItemToken");
        let ci = TerrItemToken.try_parse(t, int_ont, false, false, null);
        if (ci === null) 
            return null;
        let li = new Array();
        li.push(ci);
        t = ci.end_token.next;
        if (t === null) 
            return li;
        if (ci.termin_item !== null && ci.termin_item.canonic_text === "АВТОНОМИЯ") {
            if (t.morph._case.is_genitive) 
                return null;
        }
        for (t = ci.end_token.next; t !== null; ) {
            ci = TerrItemToken.try_parse(t, int_ont, false, false, li[li.length - 1]);
            if (ci === null) {
                if (t.chars.is_capital_upper && li.length === 1 && ((li[0].is_city_region || ((li[0].termin_item !== null && li[0].termin_item.is_specific_prefix))))) {
                    let cit = CityItemToken.try_parse(t, int_ont, false, null);
                    if (cit !== null && cit.typ === CityItemTokenItemType.PROPERNAME) 
                        ci = new TerrItemToken(cit.begin_token, cit.end_token);
                }
                else if ((BracketHelper.can_be_start_of_sequence(t, false, false) && t.next !== null && ((t.next.chars.is_capital_upper || t.next.chars.is_all_upper))) && li.length === 1 && ((li[0].is_city_region || ((li[0].termin_item !== null && li[0].termin_item.is_specific_prefix))))) {
                    let cit = CityItemToken.try_parse(t.next, int_ont, false, null);
                    if (cit !== null && ((cit.typ === CityItemTokenItemType.PROPERNAME || cit.typ === CityItemTokenItemType.CITY)) && BracketHelper.can_be_end_of_sequence(cit.end_token.next, false, null, false)) 
                        ci = new TerrItemToken(t, cit.end_token.next);
                    else {
                        let brr = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                        if (brr !== null) {
                            let ok = false;
                            let rt = t.kit.process_referent("ORGANIZATION", t.next);
                            if (rt !== null && rt.toString().toUpperCase().includes("СОВЕТ")) 
                                ok = true;
                            else if (brr.length_char < 40) 
                                ok = true;
                            if (ok) 
                                ci = new TerrItemToken(t, brr.end_token);
                        }
                    }
                }
                else if (t.is_char('(')) {
                    ci = TerrItemToken.try_parse(t.next, int_ont, false, false, null);
                    if (ci !== null && ci.end_token.next !== null && ci.end_token.next.is_char(')')) {
                        let ci0 = li[li.length - 1];
                        if (ci0.onto_item !== null && ci.onto_item === ci0.onto_item) {
                            ci0.end_token = ci.end_token.next;
                            t = ci0.end_token.next;
                        }
                        else {
                            li.push(ci);
                            ci.end_token = ci.end_token.next;
                            t = ci.end_token.next;
                        }
                        continue;
                    }
                }
                else if ((t.is_comma && li.length === 1 && li[0].termin_item === null) && (t.whitespaces_after_count < 3)) {
                    let li2 = TerrItemToken.try_parse_list(t.next, int_ont, 2);
                    if (li2 !== null && li2.length === 1 && li2[0].termin_item !== null) {
                        let tt2 = li2[0].end_token.next;
                        let ok = false;
                        if (tt2 === null || tt2.whitespaces_before_count > 3) 
                            ok = true;
                        else if (((tt2.length_char === 1 && !tt2.is_letters)) || !((tt2 instanceof TextToken))) 
                            ok = true;
                        if (ok) {
                            li.push(li2[0]);
                            t = li2[0].end_token;
                            break;
                        }
                    }
                }
                if (ci === null && BracketHelper.can_be_start_of_sequence(t, false, false)) {
                    let lii = TerrItemToken.try_parse_list(t.next, int_ont, max_count);
                    if (lii !== null && BracketHelper.can_be_end_of_sequence(lii[lii.length - 1].end_token.next, false, null, false)) {
                        li.splice(li.length, 0, ...lii);
                        return li;
                    }
                }
                if (li[li.length - 1].rzd !== null) 
                    ci = TerrItemToken._try_parse_rzd_dir(t);
                if (ci === null) 
                    break;
            }
            if (ci.is_adjective && li[li.length - 1].rzd !== null) {
                let cii = TerrItemToken._try_parse_rzd_dir(t);
                if (cii !== null) 
                    ci = cii;
            }
            if (t.is_table_control_char) 
                break;
            if (t.is_newline_before) {
                if (li.length > 0 && li[li.length - 1].is_adjective && ci.termin_item !== null) {
                }
                else if (li.length === 1 && li[0].termin_item !== null && ci.termin_item === null) {
                }
                else 
                    break;
            }
            li.push(ci);
            t = ci.end_token.next;
            if (max_count > 0 && li.length >= max_count) 
                break;
        }
        for (const cc of li) {
            if (cc.onto_item !== null && !cc.is_adjective) {
                if (!cc.begin_token.chars.is_cyrillic_letter) 
                    continue;
                let alpha2 = null;
                if (cc.onto_item.referent instanceof GeoReferent) 
                    alpha2 = (cc.onto_item.referent).alpha2;
                if (alpha2 === "TG") {
                    if (cc.begin_token instanceof TextToken) {
                        if (cc.begin_token.get_source_text() !== "Того") 
                            return null;
                        if (li.length === 1 && cc.begin_token.previous !== null && cc.begin_token.previous.is_char('.')) 
                            return null;
                        let npt = NounPhraseHelper.try_parse(cc.begin_token, NounPhraseParseAttr.PARSEPRONOUNS, 0, null);
                        if (npt !== null && npt.end_token !== cc.begin_token) 
                            return null;
                        if (cc.begin_token.next !== null) {
                            if (cc.begin_token.next.morph.class0.is_personal_pronoun || cc.begin_token.next.morph.class0.is_pronoun) 
                                return null;
                        }
                    }
                    if (li.length < 2) 
                        return null;
                }
                if (alpha2 === "PE") {
                    if (cc.begin_token instanceof TextToken) {
                        if ((cc.begin_token).get_source_text() !== "Перу") 
                            return null;
                        if (li.length === 1 && cc.begin_token.previous !== null && cc.begin_token.previous.is_char('.')) 
                            return null;
                    }
                    if (li.length < 2) 
                        return null;
                }
                if (alpha2 === "DM") {
                    if (cc.end_token.next !== null) {
                        if (cc.end_token.next.chars.is_capital_upper || cc.end_token.next.chars.is_all_upper) 
                            return null;
                    }
                    return null;
                }
                if (alpha2 === "JE") {
                    if (cc.begin_token.previous !== null && cc.begin_token.previous.is_hiphen) 
                        return null;
                }
                return li;
            }
            else if (cc.onto_item !== null && cc.is_adjective) {
                let alpha2 = null;
                if (cc.onto_item.referent instanceof GeoReferent) 
                    alpha2 = (cc.onto_item.referent).alpha2;
                if (alpha2 === "SU") {
                    if (cc.end_token.next === null || !cc.end_token.next.is_value("СОЮЗ", null)) 
                        cc.onto_item = null;
                }
            }
        }
        for (let i = 0; i < li.length; i++) {
            if (li[i].onto_item !== null && li[i].onto_item2 !== null) {
                let nou = null;
                if (i > 0 && li[i - 1].termin_item !== null) 
                    nou = li[i - 1].termin_item;
                else if (((i + 1) < li.length) && li[i + 1].termin_item !== null) 
                    nou = li[i + 1].termin_item;
                if (nou === null || li[i].onto_item.referent === null || li[i].onto_item2.referent === null) 
                    continue;
                if (li[i].onto_item.referent.find_slot(GeoReferent.ATTR_TYPE, nou.canonic_text.toLowerCase(), true) === null && li[i].onto_item2.referent.find_slot(GeoReferent.ATTR_TYPE, nou.canonic_text.toLowerCase(), true) !== null) {
                    li[i].onto_item = li[i].onto_item2;
                    li[i].onto_item2 = null;
                }
                else if (li[i].onto_item.referent.find_slot(GeoReferent.ATTR_TYPE, "республика", true) !== null && nou.canonic_text !== "РЕСПУБЛИКА") {
                    li[i].onto_item = li[i].onto_item2;
                    li[i].onto_item2 = null;
                }
            }
        }
        for (const cc of li) {
            if (cc.onto_item !== null || ((cc.termin_item !== null && !cc.is_adjective)) || cc.rzd !== null) 
                return li;
        }
        return null;
    }
    
    static _try_parse_rzd_dir(t) {
        let napr = null;
        let tt0 = null;
        let tt1 = null;
        let val = null;
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt.is_char_of(",.")) 
                continue;
            if (tt.is_newline_before) 
                break;
            if (tt.is_value("НАПРАВЛЕНИЕ", null)) {
                napr = tt;
                continue;
            }
            if (tt.is_value("НАПР", null)) {
                if (tt.next !== null && tt.next.is_char('.')) 
                    tt = tt.next;
                napr = tt;
                continue;
            }
            let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.adjectives.length > 0 && npt.noun.is_value("КОЛЬЦО", null)) {
                tt0 = tt;
                tt1 = npt.end_token;
                val = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                break;
            }
            if ((tt instanceof TextToken) && ((!tt.chars.is_all_lower || napr !== null)) && (((tt.morph.gender.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value())) {
                tt0 = (tt1 = tt);
                continue;
            }
            if ((((tt instanceof TextToken) && ((!tt.chars.is_all_lower || napr !== null)) && tt.next !== null) && tt.next.is_hiphen && (tt.next.next instanceof TextToken)) && (((tt.next.next.morph.gender.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value())) {
                tt0 = tt;
                tt = tt.next.next;
                tt1 = tt;
                continue;
            }
            break;
        }
        if (tt0 !== null) {
            let ci = TerrItemToken._new1172(tt0, tt1, true);
            if (val !== null) 
                ci.rzd_dir = val;
            else {
                ci.rzd_dir = tt1.get_normal_case_text(MorphClass.ADJECTIVE, true, MorphGender.NEUTER, false);
                if (tt0 !== tt1) 
                    ci.rzd_dir = ((tt0).term + " " + ci.rzd_dir);
                ci.rzd_dir += " НАПРАВЛЕНИЕ";
            }
            if (napr !== null && napr.end_char > ci.end_char) 
                ci.end_token = napr;
            return ci;
        }
        return null;
    }
    
    static try_parse(t, int_ont, can_be_low_capital = false, noun_can_be_adjective = false, prev = null) {
        const CityItemToken = require("./CityItemToken");
        if (t === null) 
            return null;
        if (t.kit.is_recurce_overflow) 
            return null;
        t.kit.recurse_level++;
        let res = TerrItemToken._try_parse(t, int_ont, can_be_low_capital, prev);
        t.kit.recurse_level--;
        if (res === null) {
            if (noun_can_be_adjective && t.morph.class0.is_adjective) {
                let tok = TerrItemToken.m_terr_noun_adjectives.try_parse(t, TerminParseAttr.NO);
                if (tok !== null) 
                    return TerrItemToken._new1173(tok.begin_token, tok.end_token, Utils.as(tok.termin.tag, TerrTermin), false);
            }
            if ((t.chars.is_all_upper && t.length_char === 2 && (t instanceof TextToken)) && int_ont !== null) {
                let term = (t).term;
                if (((term === "РБ" || term === "РК" || term === "TC") || term === "ТС" || term === "РТ") || term === "УР" || term === "РД") {
                    for (const it of int_ont.items) {
                        if (it.referent instanceof GeoReferent) {
                            let alph2 = (it.referent).alpha2;
                            if (((alph2 === "BY" && term === "РБ")) || ((alph2 === "KZ" && term === "РК"))) 
                                return TerrItemToken._new1174(t, t, it);
                            if (term === "РТ") {
                                if (it.referent.find_slot(null, "ТАТАРСТАН", true) !== null) 
                                    return TerrItemToken._new1174(t, t, it);
                            }
                            if (term === "РД") {
                                if (it.referent.find_slot(null, "ДАГЕСТАН", true) !== null) 
                                    return TerrItemToken._new1174(t, t, it);
                            }
                        }
                    }
                    let ok = false;
                    if ((t.whitespaces_before_count < 2) && (t.previous instanceof TextToken)) {
                        let term2 = (t.previous).term;
                        if ((t.previous.is_value("КОДЕКС", null) || t.previous.is_value("ЗАКОН", null) || term2 === "КОАП") || term2 === "ПДД" || term2 === "МЮ") 
                            ok = true;
                        else if ((t.previous.chars.is_all_upper && t.previous.length_char > 1 && (t.previous.length_char < 4)) && term2.endsWith("К")) 
                            ok = true;
                        else if (term === "РТ" || term === "УР" || term === "РД") {
                            let tt = t.previous;
                            if (tt !== null && tt.is_comma) 
                                tt = tt.previous;
                            if (tt !== null) {
                                if ((tt.get_referent() instanceof GeoReferent) && (tt.get_referent()).alpha2 === "RU") 
                                    ok = true;
                                else if ((tt instanceof NumberToken) && tt.length_char === 6 && (tt).typ === NumberSpellingType.DIGIT) 
                                    ok = true;
                            }
                        }
                    }
                    else if (((t.whitespaces_before_count < 2) && (t.previous instanceof NumberToken) && t.previous.length_char === 6) && (t.previous).typ === NumberSpellingType.DIGIT) 
                        ok = true;
                    if (ok) {
                        if (term === "РК" && TerrItemToken.m_kazahstan !== null) 
                            return TerrItemToken._new1174(t, t, TerrItemToken.m_kazahstan);
                        if (term === "РТ" && TerrItemToken.m_tatarstan !== null) 
                            return TerrItemToken._new1174(t, t, TerrItemToken.m_tatarstan);
                        if (term === "РД" && TerrItemToken.m_dagestan !== null) 
                            return TerrItemToken._new1174(t, t, TerrItemToken.m_dagestan);
                        if (term === "УР" && TerrItemToken.m_udmurtia !== null) 
                            return TerrItemToken._new1174(t, t, TerrItemToken.m_udmurtia);
                        if (term === "РБ" && TerrItemToken.m_belorussia !== null) 
                            return TerrItemToken._new1174(t, t, TerrItemToken.m_belorussia);
                        if (((term === "ТС" || term === "TC")) && TerrItemToken.m_tamog_sous !== null) 
                            return TerrItemToken._new1174(t, t, TerrItemToken.m_tamog_sous);
                    }
                }
            }
            if (((t instanceof TextToken) && ((t.is_value("Р", null) || t.is_value("P", null))) && t.next !== null) && t.next.is_char('.') && !t.next.is_newline_after) {
                res = TerrItemToken.try_parse(t.next.next, int_ont, false, false, null);
                if (res !== null && res.onto_item !== null) {
                    let str = res.onto_item.toString().toUpperCase();
                    if (str.includes("РЕСПУБЛИКА")) {
                        res.begin_token = t;
                        res.is_doubt = false;
                        return res;
                    }
                }
            }
            if ((t instanceof TextToken) && t.length_char > 2 && !t.chars.is_all_lower) {
                if (((t.morph.class0.is_adjective || t.chars.is_all_upper || (t).term.endsWith("ЖД"))) || ((t.next !== null && t.next.is_hiphen))) {
                    let rt0 = t.kit.process_referent("ORGANIZATION", t);
                    if (rt0 !== null) {
                        if ((Utils.notNull(rt0.referent.get_string_value("TYPE"), "")).endsWith("дорога")) 
                            return TerrItemToken._new1183(t, rt0.end_token, rt0, rt0.morph);
                    }
                }
                let _rzd_dir = TerrItemToken._try_parse_rzd_dir(t);
                if (_rzd_dir !== null) {
                    let tt = _rzd_dir.end_token.next;
                    while (tt !== null) {
                        if (tt.is_char_of(",.")) 
                            tt = tt.next;
                        else 
                            break;
                    }
                    let chhh = TerrItemToken.try_parse(tt, int_ont, false, false, null);
                    if (chhh !== null && chhh.rzd !== null) 
                        return _rzd_dir;
                }
            }
            return TerrItemToken.try_parse_district_name(t, int_ont);
        }
        if (res.is_adjective) {
            let rt0 = t.kit.process_referent("ORGANIZATION", t);
            if (rt0 !== null) {
                if ((Utils.notNull(rt0.referent.get_string_value("TYPE"), "")).endsWith("дорога")) 
                    return TerrItemToken._new1183(t, rt0.end_token, rt0, rt0.morph);
            }
            let _rzd_dir = TerrItemToken._try_parse_rzd_dir(t);
            if (_rzd_dir !== null) {
                let tt = _rzd_dir.end_token.next;
                while (tt !== null) {
                    if (tt.is_char_of(",.")) 
                        tt = tt.next;
                    else 
                        break;
                }
                rt0 = t.kit.process_referent("ORGANIZATION", tt);
                if (rt0 !== null) {
                    if ((Utils.notNull(rt0.referent.get_string_value("TYPE"), "")).endsWith("дорога")) 
                        return _rzd_dir;
                }
            }
        }
        if ((res.begin_token.length_char === 1 && res.begin_token.chars.is_all_upper && res.begin_token.next !== null) && res.begin_token.next.is_char('.')) 
            return null;
        if (res.termin_item !== null && res.termin_item.canonic_text === "ОКРУГ") {
            if (t.previous !== null && ((t.previous.is_value("ГОРОДСКОЙ", null) || t.previous.is_value("МІСЬКИЙ", null)))) 
                return null;
        }
        if (res.onto_item !== null) {
            let cit = CityItemToken.try_parse(res.begin_token, null, can_be_low_capital, null);
            if (cit !== null) {
                if (cit.typ === CityItemTokenItemType.CITY && cit.onto_item !== null && cit.onto_item.misc_attr !== null) {
                    if (cit.end_token.is_value("CITY", null)) 
                        return null;
                    if (cit.end_token === res.end_token) {
                        res.can_be_city = true;
                        if (cit.end_token.next !== null && cit.end_token.next.is_value("CITY", null)) 
                            return null;
                    }
                }
            }
            cit = CityItemToken.try_parse_back(res.begin_token.previous);
            if (cit !== null && cit.typ === CityItemTokenItemType.NOUN && ((res.is_adjective || (cit.whitespaces_after_count < 1)))) 
                res.can_be_city = true;
        }
        if (res.termin_item !== null) {
            res.is_doubt = res.termin_item.is_doubt;
            if (!res.termin_item.is_region) {
                if (res.termin_item.is_moscow_region && res.begin_token === res.end_token) 
                    res.is_doubt = true;
                else if (res.termin_item.acronym === "МО" && res.begin_token === res.end_token && res.length_char === 2) {
                    if (res.begin_token.previous !== null && res.begin_token.previous.is_value("ВЕТЕРАН", null)) 
                        return null;
                    res.is_doubt = true;
                    if (res.begin_token === res.end_token && res.length_char === 2) {
                        if (res.begin_token.previous === null || res.begin_token.previous.is_char_of(",") || res.begin_token.is_newline_before) {
                            if (res.end_token.next === null || res.end_token.next.is_char_of(",") || res.is_newline_after) {
                                res.termin_item = null;
                                res.onto_item = TerrItemToken.m_mos_regru;
                            }
                        }
                    }
                }
                else if (res.termin_item.acronym === "ЛО" && res.begin_token === res.end_token && res.length_char === 2) {
                    res.is_doubt = true;
                    if (res.begin_token.previous === null || res.begin_token.previous.is_comma_and || res.begin_token.is_newline_before) {
                        res.termin_item = null;
                        res.onto_item = TerrItemToken.m_len_regru;
                    }
                }
                else if (!res.morph._case.is_nominative && !res.morph._case.is_accusative) 
                    res.is_doubt = true;
                else if (res.morph.number !== MorphNumber.SINGULAR) {
                    if (res.termin_item.is_moscow_region && res.morph.number !== MorphNumber.PLURAL) {
                    }
                    else 
                        res.is_doubt = true;
                }
            }
            if (((res.termin_item !== null && res.termin_item.canonic_text === "АО")) || ((res.onto_item === TerrItemToken.m_mos_regru && res.length_char === 2))) {
                let tt = res.end_token.next;
                let rt = res.kit.process_referent("ORGANIZATION", res.begin_token);
                if (rt === null) 
                    rt = res.kit.process_referent("ORGANIZATION", res.begin_token.next);
                if (rt !== null) {
                    for (const s of rt.referent.slots) {
                        if (s.type_name === "TYPE") {
                            let ty = String(s.value);
                            if (res.termin_item !== null && ty !== res.termin_item.canonic_text) 
                                return null;
                        }
                    }
                }
            }
        }
        if (res !== null && res.begin_token === res.end_token && res.termin_item === null) {
            if (t instanceof TextToken) {
                let str = (t).term;
                if (str === "ЧАДОВ" || str === "ТОГОВ") 
                    return null;
            }
            if ((((t.next instanceof TextToken) && (t.whitespaces_after_count < 2) && !t.next.chars.is_all_lower) && CharsInfo.ooEq(t.chars, t.next.chars) && !t.chars.is_latin_letter) && ((!t.morph._case.is_genitive && !t.morph._case.is_accusative))) {
                let mc = t.next.get_morph_class_in_dictionary();
                if (mc.is_proper_surname || mc.is_proper_secname) 
                    res.is_doubt = true;
            }
            if ((t.previous instanceof TextToken) && (t.whitespaces_before_count < 2) && !t.previous.chars.is_all_lower) {
                let mc = t.previous.get_morph_class_in_dictionary();
                if (mc.is_proper_surname) 
                    res.is_doubt = true;
            }
            if (t.length_char <= 2 && res.onto_item !== null && !t.is_value("РФ", null)) {
                res.is_doubt = true;
                let tt = t.next;
                if (tt !== null && ((tt.is_char_of(":") || tt.is_hiphen))) 
                    tt = tt.next;
                if (tt !== null && tt.get_referent() !== null && tt.get_referent().type_name === "PHONE") 
                    res.is_doubt = false;
                else if (t.length_char === 2 && t.chars.is_all_upper && t.chars.is_latin_letter) 
                    res.is_doubt = false;
            }
        }
        return res;
    }
    
    static _try_parse(t, int_ont, can_be_low_capital, prev) {
        const CityItemToken = require("./CityItemToken");
        if (!((t instanceof TextToken))) 
            return null;
        let li = null;
        if (int_ont !== null) 
            li = int_ont.try_attach(t, null, false);
        if (li === null && t.kit.ontology !== null) 
            li = t.kit.ontology.attach_token(GeoReferent.OBJ_TYPENAME, t);
        if (li === null || li.length === 0) 
            li = TerrItemToken.m_terr_ontology.try_attach(t, null, false);
        else {
            let li1 = TerrItemToken.m_terr_ontology.try_attach(t, null, false);
            if (li1 !== null && li1.length > 0) {
                if (li1[0].length_char > li[0].length_char) 
                    li = li1;
            }
        }
        let tt = Utils.as(t, TextToken);
        if (li !== null) {
            for (let i = li.length - 1; i >= 0; i--) {
                if (li[i].item !== null) {
                    let g = Utils.as(li[i].item.referent, GeoReferent);
                    if (g === null) 
                        continue;
                    if (g.is_city && !g.is_region && !g.is_state) 
                        li.splice(i, 1);
                    else if (g.is_state && t.length_char === 2 && li[i].length_char === 2) {
                        if (!t.is_whitespace_before && t.previous !== null && t.previous.is_char('.')) 
                            li.splice(i, 1);
                        else if (t.previous !== null && t.previous.is_value("ДОМЕН", null)) 
                            li.splice(i, 1);
                    }
                }
            }
            for (const nt of li) {
                if (nt.item !== null && !((nt.termin.tag instanceof IntOntologyItem))) {
                    if (can_be_low_capital || !MiscHelper.is_all_characters_lower(nt.begin_token, nt.end_token, false) || nt.begin_token !== nt.end_token) {
                        let res0 = TerrItemToken._new1185(nt.begin_token, nt.end_token, nt.item, nt.morph);
                        if (nt.end_token.morph.class0.is_adjective && nt.begin_token === nt.end_token) {
                            if (nt.begin_token.get_morph_class_in_dictionary().is_proper_geo) {
                            }
                            else 
                                res0.is_adjective = true;
                        }
                        if (nt.begin_token === nt.end_token && nt.chars.is_latin_letter) {
                            if ((nt.item.referent).is_state) {
                            }
                            else if (nt.item.referent.find_slot(GeoReferent.ATTR_TYPE, "state", true) !== null) {
                            }
                            else 
                                res0.is_doubt = true;
                        }
                        if ((li.length === 2 && nt === li[0] && li[1].item !== null) && !((li[1].termin.tag instanceof IntOntologyItem))) 
                            res0.onto_item2 = li[1].item;
                        return res0;
                    }
                }
            }
            for (const nt of li) {
                if (nt.item !== null && (nt.termin.tag instanceof IntOntologyItem)) {
                    if (nt.end_token.next === null || !nt.end_token.next.is_hiphen) {
                        let res1 = TerrItemToken._new1186(nt.begin_token, nt.end_token, nt.item, true, nt.morph);
                        if ((li.length === 2 && nt === li[0] && li[1].item !== null) && (li[1].termin.tag instanceof IntOntologyItem)) 
                            res1.onto_item2 = li[1].item;
                        if (t.kit.base_language.is_ua && res1.onto_item.canonic_text === "СУДАН" && t.is_value("СУД", null)) 
                            return null;
                        return res1;
                    }
                }
            }
            for (const nt of li) {
                if (nt.termin !== null && nt.item === null) {
                    if (nt.end_token.next === null || !nt.end_token.next.is_hiphen || !(nt.termin).is_adjective) {
                        let res1 = TerrItemToken._new1187(nt.begin_token, nt.end_token, Utils.as(nt.termin, TerrTermin), (nt.termin).is_adjective, nt.morph);
                        if (!res1.is_adjective) {
                            if (res1.termin_item.canonic_text === "РЕСПУБЛИКА" || res1.termin_item.canonic_text === "ШТАТ") {
                                let npt1 = NounPhraseHelper.try_parse(res1.begin_token.previous, NounPhraseParseAttr.NO, 0, null);
                                if (npt1 !== null && npt1.morph.number === MorphNumber.PLURAL) {
                                    let res2 = TerrItemToken.try_parse(res1.end_token.next, int_ont, false, false, null);
                                    if ((res2 !== null && res2.onto_item !== null && res2.onto_item.referent !== null) && res2.onto_item.referent.find_slot(GeoReferent.ATTR_TYPE, "республика", true) !== null) {
                                    }
                                    else 
                                        return null;
                                }
                            }
                            if (res1.termin_item.canonic_text === "ГОСУДАРСТВО") {
                                if (t.previous !== null && t.previous.is_value("СОЮЗНЫЙ", null)) 
                                    return null;
                            }
                            if (nt.begin_token === nt.end_token && nt.begin_token.is_value("ОПС", null)) {
                                if (!MiscLocationHelper.check_geo_object_before(nt.begin_token)) 
                                    return null;
                            }
                        }
                        return res1;
                    }
                }
            }
        }
        if (tt === null) 
            return null;
        if (!tt.chars.is_capital_upper && !tt.chars.is_all_upper) 
            return null;
        if (((tt.length_char === 2 || tt.length_char === 3)) && tt.chars.is_all_upper) {
            if (TerrItemToken.m_alpha2state.containsKey(tt.term)) {
                let ok = false;
                let tt2 = tt.next;
                if (tt2 !== null && tt2.is_char(':')) 
                    tt2 = tt2.next;
                if (tt2 instanceof ReferentToken) {
                    let r = tt2.get_referent();
                    if (r !== null && r.type_name === "PHONE") 
                        ok = true;
                }
                if (ok) 
                    return TerrItemToken._new1174(tt, tt, TerrItemToken.m_alpha2state.get(tt.term));
            }
        }
        if (tt.length_char < 3) 
            return null;
        if (MiscHelper.is_eng_article(tt)) 
            return null;
        if (tt.length_char < 5) {
            if (tt.next === null || !tt.next.is_hiphen) 
                return null;
        }
        let t0 = tt;
        let prefix = null;
        if (t0.next !== null && t0.next.is_hiphen && (t0.next.next instanceof TextToken)) {
            tt = Utils.as(t0.next.next, TextToken);
            if (!tt.chars.is_all_lower && ((t0.is_whitespace_after || t0.next.is_whitespace_after))) {
                let tit = TerrItemToken._try_parse(tt, int_ont, false, prev);
                if (tit !== null) {
                    if (tit.onto_item !== null) 
                        return null;
                }
            }
            if (tt.length_char > 1) {
                if (tt.chars.is_capital_upper) 
                    prefix = t0.term;
                else if (!tt.is_whitespace_before && !t0.is_whitespace_after) 
                    prefix = t0.term;
                if (((!tt.is_whitespace_after && tt.next !== null && tt.next.is_hiphen) && !tt.next.is_whitespace_after && (tt.next.next instanceof TextToken)) && CharsInfo.ooEq(tt.next.next.chars, t0.chars)) {
                    prefix = (prefix + "-" + tt.term);
                    tt = Utils.as(tt.next.next, TextToken);
                }
            }
            if (prefix === null) 
                tt = t0;
        }
        if (tt.morph.class0.is_adverb) 
            return null;
        let cit = CityItemToken.try_parse(t0, null, false, null);
        if (cit !== null) {
            if (cit.onto_item !== null || cit.typ === CityItemTokenItemType.NOUN || cit.typ === CityItemTokenItemType.CITY) {
                if (!cit.doubtful && !tt.morph.class0.is_adjective) 
                    return null;
            }
        }
        let npt = NounPhraseHelper.try_parse(t0, NounPhraseParseAttr.NO, 0, null);
        if (npt !== null) {
            if (((npt.noun.is_value("ФЕДЕРАЦИЯ", null) || npt.noun.is_value("ФЕДЕРАЦІЯ", null))) && npt.adjectives.length === 1) {
                if (MiscHelper.is_not_more_than_one_error("РОССИЙСКАЯ", npt.adjectives[0]) || MiscHelper.is_not_more_than_one_error("РОСІЙСЬКА", npt.adjectives[0])) 
                    return TerrItemToken._new1185(npt.begin_token, npt.end_token, (t0.kit.base_language.is_ua ? TerrItemToken.m_russiaua : TerrItemToken.m_russiaru), npt.morph);
            }
        }
        if (t0.morph.class0.is_proper_name) {
            if (t0.is_whitespace_after || t0.next.is_whitespace_after) 
                return null;
        }
        if (npt !== null && npt.end_token === tt.next) {
            let adj = false;
            let reg_after = false;
            if (npt.adjectives.length === 1 && !t0.chars.is_all_lower) {
                if (((((tt.next.is_value("РАЙОН", null) || tt.next.is_value("ОБЛАСТЬ", null) || tt.next.is_value("КРАЙ", null)) || tt.next.is_value("ВОЛОСТЬ", null) || tt.next.is_value("УЛУС", null)) || tt.next.is_value("ОКРУГ", null) || tt.next.is_value("АВТОНОМИЯ", "АВТОНОМІЯ")) || tt.next.is_value("РЕСПУБЛИКА", "РЕСПУБЛІКА") || tt.next.is_value("COUNTY", null)) || tt.next.is_value("STATE", null) || tt.next.is_value("REGION", null)) 
                    reg_after = true;
                else {
                    let tok = TerrItemToken.m_terr_ontology.try_attach(tt.next, null, false);
                    if (tok !== null) {
                        if ((((tok[0].termin.canonic_text === "РАЙОН" || tok[0].termin.canonic_text === "ОБЛАСТЬ" || tok[0].termin.canonic_text === "УЛУС") || tok[0].termin.canonic_text === "КРАЙ" || tok[0].termin.canonic_text === "ВОЛОСТЬ") || tok[0].termin.canonic_text === "ОКРУГ" || tok[0].termin.canonic_text === "АВТОНОМИЯ") || tok[0].termin.canonic_text === "АВТОНОМІЯ" || ((tok[0].chars.is_latin_letter && (tok[0].termin instanceof TerrTermin) && (tok[0].termin).is_region))) 
                            reg_after = true;
                    }
                }
            }
            if (reg_after) {
                adj = true;
                for (const wff of tt.morph.items) {
                    let wf = Utils.as(wff, MorphWordForm);
                    if (wf === null) 
                        continue;
                    if (wf.class0.is_verb && wf.is_in_dictionary) {
                        adj = false;
                        break;
                    }
                    else if (wf.is_in_dictionary && !wf.class0.is_adjective) {
                    }
                }
                if (!adj && prefix !== null) 
                    adj = true;
                if (!adj) {
                    let cit1 = CityItemToken.try_parse(tt.next.next, null, false, null);
                    if (cit1 !== null && cit1.typ !== CityItemTokenItemType.PROPERNAME) 
                        adj = true;
                }
                if (!adj) {
                    if (MiscLocationHelper.check_geo_object_before(npt.begin_token)) 
                        adj = true;
                }
                let te = tt.next.next;
                if (te !== null && te.is_char_of(",")) 
                    te = te.next;
                if (!adj && (te instanceof ReferentToken)) {
                    if (te.get_referent() instanceof GeoReferent) 
                        adj = true;
                }
                if (!adj) {
                    te = t0.previous;
                    if (te !== null && te.is_char_of(",")) 
                        te = te.previous;
                    if (te instanceof ReferentToken) {
                        if (te.get_referent() instanceof GeoReferent) 
                            adj = true;
                    }
                }
                if (adj && npt.adjectives[0].begin_token !== npt.adjectives[0].end_token) {
                    if (CharsInfo.ooNoteq(npt.adjectives[0].begin_token.chars, npt.adjectives[0].end_token.chars)) 
                        return null;
                }
            }
            else if ((npt.adjectives.length === 1 && (npt.end_token instanceof TextToken) && npt.end_token.get_morph_class_in_dictionary().is_noun) && prev !== null && prev.termin_item !== null) {
                adj = true;
                tt = Utils.as(npt.end_token, TextToken);
            }
            if (!adj && !t0.chars.is_latin_letter) 
                return null;
        }
        let res = new TerrItemToken(t0, tt);
        res.is_adjective = tt.morph.class0.is_adjective;
        res.morph = tt.morph;
        if (t0 instanceof TextToken) {
            for (const wf of t0.morph.items) {
                let f = Utils.as(wf, MorphWordForm);
                if (!f.is_in_dictionary) 
                    continue;
                if (wf.class0.is_proper_surname && f.is_in_dictionary) 
                    res.can_be_surname = true;
                else if (wf.class0.is_adjective && f.is_in_dictionary) 
                    res.is_adj_in_dictionary = true;
                else if (wf.class0.is_proper_geo) {
                    if (!t0.chars.is_all_lower) 
                        res.is_geo_in_dictionary = true;
                }
            }
        }
        if ((tt.whitespaces_after_count < 2) && (tt.next instanceof TextToken) && tt.next.chars.is_capital_upper) {
            let dir = MiscLocationHelper.try_attach_nord_west(tt.next);
            if (dir !== null) 
                res.end_token = dir.end_token;
        }
        return res;
    }
    
    /**
     * Это пыделение возможного имени для городского района типа Владыкино, Тёплый Стан)
     * @param t 
     * @param int_ont 
     * @param proc 
     * @return 
     */
    static try_parse_district_name(t, int_ont) {
        if (!((t instanceof TextToken)) || !t.chars.is_capital_upper || !t.chars.is_cyrillic_letter) 
            return null;
        if ((t.next !== null && t.next.is_hiphen && (t.next.next instanceof TextToken)) && CharsInfo.ooEq(t.next.next.chars, t.chars)) {
            let tok = TerrItemToken.m_terr_ontology.try_attach(t, null, false);
            if ((tok !== null && tok[0].item !== null && (tok[0].item.referent instanceof GeoReferent)) && (tok[0].item.referent).is_state) 
                return null;
            tok = TerrItemToken.m_terr_ontology.try_attach(t.next.next, null, false);
            if ((tok !== null && tok[0].item !== null && (tok[0].item.referent instanceof GeoReferent)) && (tok[0].item.referent).is_state) 
                return null;
            return new TerrItemToken(t, t.next.next);
        }
        if ((t.next instanceof TextToken) && CharsInfo.ooEq(t.next.chars, t.chars)) {
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.end_token === t.next && npt.adjectives.length === 1) {
                if (!npt.end_token.morph.class0.is_adjective || ((npt.end_token.morph._case.is_nominative && (npt.end_token instanceof TextToken) && LanguageHelper.ends_with((npt.end_token).term, "О")))) {
                    let ty = TerrItemToken._try_parse(t.next, int_ont, false, null);
                    if (ty !== null && ty.termin_item !== null) 
                        return null;
                    return new TerrItemToken(t, t.next);
                }
            }
        }
        let str = (t).term;
        let res = TerrItemToken._new1190(t, t, true);
        if (!LanguageHelper.ends_with(str, "О")) 
            res.is_doubt = true;
        let dir = MiscLocationHelper.try_attach_nord_west(t);
        if (dir !== null) {
            res.end_token = dir.end_token;
            res.is_doubt = false;
            if (res.end_token.whitespaces_after_count < 2) {
                let res2 = TerrItemToken.try_parse_district_name(res.end_token.next, int_ont);
                if (res2 !== null && res2.termin_item === null) 
                    res.end_token = res2.end_token;
            }
        }
        return res;
    }
    
    static initialize() {
        if (TerrItemToken.m_terr_ontology !== null) 
            return;
        TerrItemToken.m_terr_ontology = new IntOntologyCollection();
        TerrItemToken.m_terr_adjs = new TerminCollection();
        TerrItemToken.m_mans_by_state = new TerminCollection();
        TerrItemToken.m_unknown_regions = new TerminCollection();
        TerrItemToken.m_terr_noun_adjectives = new TerminCollection();
        TerrItemToken.m_capitals_by_state = new TerminCollection();
        TerrItemToken.m_geo_abbrs = new TerminCollection();
        let t = new TerrTermin("РЕСПУБЛИКА");
        t.add_abridge("РЕСП.");
        t.add_abridge("РЕСП-КА");
        t.add_abridge("РЕСПУБ.");
        t.add_abridge("РЕСПУБЛ.");
        t.add_abridge("Р-КА");
        t.add_abridge("РЕСП-КА");
        TerrItemToken.m_terr_ontology.add(t);
        TerrItemToken.m_terr_ontology.add(new TerrTermin("РЕСПУБЛІКА", MorphLang.UA));
        t = TerrTermin._new1191("ГОСУДАРСТВО", true);
        t.add_abridge("ГОС-ВО");
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1192("ДЕРЖАВА", MorphLang.UA, true);
        TerrItemToken.m_terr_ontology.add(t);
        t = new TerrTermin("АВТОНОМНАЯ СОВЕТСКАЯ СОЦИАЛИСТИЧЕСКАЯ РЕСПУБЛИКА");
        t.acronym = "АССР";
        TerrItemToken.m_terr_ontology.add(t);
        for (const s of ["СОЮЗ", "СОДРУЖЕСТВО", "ФЕДЕРАЦИЯ", "КОНФЕДЕРАЦИЯ"]) {
            TerrItemToken.m_terr_ontology.add(TerrTermin._new1193(s, true, true));
        }
        for (const s of ["СОЮЗ", "СПІВДРУЖНІСТЬ", "ФЕДЕРАЦІЯ", "КОНФЕДЕРАЦІЯ"]) {
            TerrItemToken.m_terr_ontology.add(TerrTermin._new1194(s, MorphLang.UA, true, true));
        }
        for (const s of ["КОРОЛЕВСТВО", "КНЯЖЕСТВО", "ГЕРЦОГСТВО", "ИМПЕРИЯ", "ЦАРСТВО", "KINGDOM", "DUCHY", "EMPIRE"]) {
            TerrItemToken.m_terr_ontology.add(TerrTermin._new1191(s, true));
        }
        for (const s of ["КОРОЛІВСТВО", "КНЯЗІВСТВО", "ГЕРЦОГСТВО", "ІМПЕРІЯ"]) {
            TerrItemToken.m_terr_ontology.add(TerrTermin._new1192(s, MorphLang.UA, true));
        }
        for (const s of ["НЕЗАВИСИМЫЙ", "ОБЪЕДИНЕННЫЙ", "СОЕДИНЕННЫЙ", "НАРОДНЫЙ", "НАРОДНО", "ФЕДЕРАТИВНЫЙ", "ДЕМОКРАТИЧЕСКИЙ", "СОВЕТСКИЙ", "СОЦИАЛИСТИЧЕСКИЙ", "КООПЕРАТИВНЫЙ", "ИСЛАМСКИЙ", "АРАБСКИЙ", "МНОГОНАЦИОНАЛЬНЫЙ", "СУВЕРЕННЫЙ", "САМОПРОВОЗГЛАШЕННЫЙ", "НЕПРИЗНАННЫЙ"]) {
            TerrItemToken.m_terr_ontology.add(TerrTermin._new1197(s, true, true));
        }
        for (const s of ["НЕЗАЛЕЖНИЙ", "ОБЄДНАНИЙ", "СПОЛУЧЕНИЙ", "НАРОДНИЙ", "ФЕДЕРАЛЬНИЙ", "ДЕМОКРАТИЧНИЙ", "РАДЯНСЬКИЙ", "СОЦІАЛІСТИЧНИЙ", "КООПЕРАТИВНИЙ", "ІСЛАМСЬКИЙ", "АРАБСЬКИЙ", "БАГАТОНАЦІОНАЛЬНИЙ", "СУВЕРЕННИЙ"]) {
            TerrItemToken.m_terr_ontology.add(TerrTermin._new1198(s, MorphLang.UA, true, true));
        }
        t = TerrTermin._new1199("ОБЛАСТЬ", true);
        t.add_abridge("ОБЛ.");
        TerrItemToken.m_terr_noun_adjectives.add(Termin._new119("ОБЛАСТНОЙ", t));
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("REGION", true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1202("ОБЛАСТЬ", MorphLang.UA, true);
        t.add_abridge("ОБЛ.");
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1203(null, true, "АО");
        t.add_variant("АОБЛ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1204(null, MorphLang.UA, true, "АО");
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("РАЙОН", true);
        t.add_abridge("Р-Н");
        t.add_abridge("Р-ОН");
        t.add_abridge("РН.");
        TerrItemToken.m_terr_noun_adjectives.add(Termin._new119("РАЙОННЫЙ", t));
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1202("РАЙОН", MorphLang.UA, true);
        t.add_abridge("Р-Н");
        t.add_abridge("Р-ОН");
        t.add_abridge("РН.");
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("УЛУС", true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("УЕЗД", true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1210("ГУБЕРНАТОРСТВО", true, true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1203("ПОЧТОВОЕ ОТДЕЛЕНИЕ", true, "ОПС");
        t.add_abridge("П.О.");
        t.add_abridge("ПОЧТ.ОТД.");
        t.add_abridge("ПОЧТОВ.ОТД.");
        t.add_abridge("ПОЧТОВОЕ ОТД.");
        t.add_variant("ОТДЕЛЕНИЕ ПОЧТОВОЙ СВЯЗИ", false);
        t.add_variant("ПОЧТАМТ", false);
        t.add_variant("ГЛАВПОЧТАМТ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1210("ШТАТ", true, true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("STATE", true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1214("ШТАТ", MorphLang.UA, true, true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1210("ПРОВИНЦИЯ", true, true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1214("ПРОВІНЦІЯ", MorphLang.UA, true, true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("PROVINCE", true);
        t.add_variant("PROVINCIAL", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("ПРЕФЕКТУРА", true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("PREFECTURE", true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("АВТОНОМИЯ", true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("AUTONOMY", true);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1202("АВТОНОМІЯ", MorphLang.UA, true);
        TerrItemToken.m_terr_ontology.add(t);
        for (const s of ["РЕСПУБЛИКА", "КРАЙ", "ОКРУГ", "ФЕДЕРАЛЬНЫЙ ОКРУГ", "АВТОНОМНЫЙ ОКРУГ", "НАЦИОНАЛЬНЫЙ ОКРУГ", "ВОЛОСТЬ", "ФЕДЕРАЛЬНАЯ ЗЕМЛЯ", "ВОЕВОДСТВО", "МУНИЦИПАЛЬНЫЙ РАЙОН", "МУНИЦИПАЛЬНЫЙ ОКРУГ", "АДМИНИСТРАТИВНЫЙ ОКРУГ", "ГОРОДСКОЙ РАЙОН", "ВНУТРИГОРОДСКОЙ РАЙОН", "ВНУТРИГОРОДСКОЕ МУНИЦИПАЛЬНОЕ ОБРАЗОВАНИЕ", "REPUBLIC", "COUNTY", "BOROUGH", "PARISH", "MUNICIPALITY", "CENSUS AREA", "AUTONOMOUS REGION", "ADMINISTRATIVE REGION", "SPECIAL ADMINISTRATIVE REGION"]) {
            t = TerrTermin._new1223(s, true, s.includes(" "));
            if (s === "КРАЙ") 
                TerrItemToken.m_terr_noun_adjectives.add(Termin._new119("КРАЕВОЙ", t));
            else if (s === "ОКРУГ") 
                TerrItemToken.m_terr_noun_adjectives.add(Termin._new119("ОКРУЖНОЙ", t));
            else if (s === "ФЕДЕРАЛЬНЫЙ ОКРУГ") {
                t.acronym = "ФО";
                t.acronym_can_be_lower = false;
            }
            if (LanguageHelper.ends_with(s, "РАЙОН")) 
                t.add_abridge(Utils.replaceString(s, "РАЙОН", "Р-Н"));
            TerrItemToken.m_terr_ontology.add(t);
        }
        for (const s of ["РЕСПУБЛІКА", "КРАЙ", "ОКРУГ", "ФЕДЕРАЛЬНИЙ ОКРУГ", "АВТОНОМНЫЙ ОКРУГ", "НАЦІОНАЛЬНИЙ ОКРУГ", "ВОЛОСТЬ", "ФЕДЕРАЛЬНА ЗЕМЛЯ", "МУНІЦИПАЛЬНИЙ РАЙОН", "МУНІЦИПАЛЬНИЙ ОКРУГ", "АДМІНІСТРАТИВНИЙ ОКРУГ", "МІСЬКИЙ РАЙОН", "ВНУТРИГОРОДСКОЕ МУНІЦИПАЛЬНЕ УТВОРЕННЯ"]) {
            t = TerrTermin._new1226(s, MorphLang.UA, true, s.includes(" "));
            if (LanguageHelper.ends_with(s, "РАЙОН")) 
                t.add_abridge(Utils.replaceString(s, "РАЙОН", "Р-Н"));
            TerrItemToken.m_terr_ontology.add(t);
        }
        t = TerrTermin._new1199("СЕЛЬСКИЙ ОКРУГ", true);
        t.add_abridge("С.О.");
        t.add_abridge("C.O.");
        t.add_abridge("ПС С.О.");
        t.add_abridge("С/ОКРУГ");
        t.add_abridge("С/О");
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1202("СІЛЬСЬКИЙ ОКРУГ", MorphLang.UA, true);
        t.add_abridge("С.О.");
        t.add_abridge("C.O.");
        t.add_abridge("С/ОКРУГ");
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1229("СЕЛЬСКИЙ СОВЕТ", "СЕЛЬСКИЙ ОКРУГ", true);
        t.add_variant("СЕЛЬСОВЕТ", false);
        t.add_abridge("С.С.");
        t.add_abridge("С/С");
        t.add_variant("СЕЛЬСКАЯ АДМИНИСТРАЦИЯ", false);
        t.add_abridge("С.А.");
        t.add_abridge("С.АДМ.");
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1199("ПОСЕЛКОВЫЙ ОКРУГ", true);
        t.add_abridge("П.О.");
        t.add_abridge("П/О");
        t.add_variant("ПОСЕЛКОВАЯ АДМИНИСТРАЦИЯ", false);
        t.add_abridge("П.А.");
        t.add_abridge("П.АДМ.");
        t.add_abridge("П/А");
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1229("ПОСЕЛКОВЫЙ СОВЕТ", "ПОСЕЛКОВЫЙ ОКРУГ", true);
        t.add_abridge("П.С.");
        TerrItemToken.m_terr_ontology.add(t);
        TerrItemToken.m_terr_ontology.add(TerrTermin._new1232("АВТОНОМНЫЙ", true, true));
        TerrItemToken.m_terr_ontology.add(TerrTermin._new1233("АВТОНОМНИЙ", MorphLang.UA, true, true));
        TerrItemToken.m_terr_ontology.add(TerrTermin._new1234("МУНИЦИПАЛЬНОЕ СОБРАНИЕ", true, true, true));
        TerrItemToken.m_terr_ontology.add(TerrTermin._new1235("МУНІЦИПАЛЬНЕ ЗБОРИ", MorphLang.UA, true, true, true));
        t = TerrTermin._new1236("МУНИЦИПАЛЬНОЕ ОБРАЗОВАНИЕ", "МО");
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1237("МУНИЦИПАЛЬНОЕ ОБРАЗОВАНИЕ МУНИЦИПАЛЬНЫЙ РАЙОН", "МОМР", true);
        t.add_variant("МО МР", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1237("МУНИЦИПАЛЬНОЕ ОБРАЗОВАНИЕ ГОРОДСКОЙ ОКРУГ", "МОГО", true);
        t.add_variant("МО ГО", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = new TerrTermin("ТЕРРИТОРИЯ");
        t.add_abridge("ТЕР.");
        t.add_abridge("ТЕРРИТОР.");
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("ЦЕНТРАЛЬНЫЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("ЦАО");
        t.add_variant("ЦЕНТРАЛЬНЫЙ АО", false);
        t.add_variant("ЦЕНТРАЛЬНЫЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("СЕВЕРНЫЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("САО");
        t.add_variant("СЕВЕРНЫЙ АО", false);
        t.add_variant("СЕВЕРНЫЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("СЕВЕРО-ВОСТОЧНЫЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("СВАО");
        t.add_variant("СЕВЕРО-ВОСТОЧНЫЙ АО", false);
        t.add_variant("СЕВЕРО-ВОСТОЧНЫЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("ВОСТОЧНЫЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("ВАО");
        t.add_variant("ВОСТОЧНЫЙ АО", false);
        t.add_variant("ВОСТОЧНЫЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("ЮГО-ВОСТОЧНЫЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("ЮВАО");
        t.add_variant("ЮГО-ВОСТОЧНЫЙ АО", false);
        t.add_variant("ЮГО-ВОСТОЧНЫЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("ЮЖНЫЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("ЮАО");
        t.add_variant("ЮЖНЫЙ АО", false);
        t.add_variant("ЮЖНЫЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("ЗАПАДНЫЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("ЗАО");
        t.add_variant("ЗАПАДНЫЙ АО", false);
        t.add_variant("ЗАПАДНЫЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("СЕВЕРО-ЗАПАДНЫЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("СЗАО");
        t.add_variant("СЕВЕРО-ЗАПАДНЫЙ АО", false);
        t.add_variant("СЕВЕРО-ЗАПАДНЫЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("ЗЕЛЕНОГРАДСКИЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("ЗЕЛАО");
        t.add_variant("ЗЕЛЕНОГРАДСКИЙ АО", false);
        t.add_variant("ЗЕЛЕНОГРАДСКИЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("ТРОИЦКИЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("ТАО");
        t.add_variant("ТРОИЦКИЙ АО", false);
        t.add_variant("ТРОИЦКИЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("НОВОМОСКОВСКИЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("НАО");
        t.add_variant("НОВОМОСКОВСКИЙ АО", false);
        t.add_variant("НОВОМОСКОВСКИЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        t = TerrTermin._new1239("ТРОИЦКИЙ И НОВОМОСКОВСКИЙ АДМИНИСТРАТИВНЫЙ ОКРУГ", true);
        t.add_abridge("ТИНАО");
        t.add_abridge("НИТАО");
        t.add_variant("ТРОИЦКИЙ И НОВОМОСКОВСКИЙ АО", false);
        t.add_variant("ТРОИЦКИЙ И НОВОМОСКОВСКИЙ ОКРУГ", false);
        TerrItemToken.m_terr_ontology.add(t);
        TerrItemToken.m_alpha2state = new Hashtable();
        let dat = EpNerAddressInternalResourceHelper.get_bytes("t.dat");
        if (dat === null) 
            throw new Error("Not found resource file t.dat in Analyzer.Location");
        dat = MiscLocationHelper.deflate(dat);
        let tmp = new MemoryStream(dat); 
        try {
            tmp.position = 0;
            let xml = new XmlDocument();
            xml.loadStream(tmp);
            for (const x of xml.document_element.child_nodes) {
                let lang = MorphLang.RU;
                let a = Utils.getXmlAttrByName(x.attributes, "l");
                if (a !== null) {
                    if (a.value === "en") 
                        lang = MorphLang.EN;
                    else if (a.value === "ua") 
                        lang = MorphLang.UA;
                }
                if (x.name === "state") 
                    TerrItemToken.load_state(x, lang);
                else if (x.name === "reg") 
                    TerrItemToken.load_region(x, lang);
                else if (x.name === "unknown") {
                    a = Utils.getXmlAttrByName(x.attributes, "name");
                    if (a !== null && a.value !== null) 
                        TerrItemToken.m_unknown_regions.add(Termin._new899(a.value, lang));
                }
            }
        }
        finally {
            tmp.close();
        }
    }
    
    static load_state(xml, lang) {
        let state = new GeoReferent();
        let c = new IntOntologyItem(state);
        let acrs = null;
        for (const x of xml.child_nodes) {
            if (x.name === "n") {
                let te = new Termin();
                te.init_by_normal_text(x.inner_text, null);
                c.termins.push(te);
                state.add_name(x.inner_text);
            }
            else if (x.name === "acr") {
                c.termins.push(Termin._new1252(x.inner_text, lang));
                state.add_name(x.inner_text);
                if (acrs === null) 
                    acrs = new Array();
                acrs.push(x.inner_text);
            }
            else if (x.name === "a") {
                let te = new Termin();
                te.init_by_normal_text(x.inner_text, lang);
                te.tag = c;
                c.termins.push(te);
                TerrItemToken.m_terr_adjs.add(te);
            }
            else if (x.name === "a2") 
                state.alpha2 = x.inner_text;
            else if (x.name === "m") {
                let te = new Termin();
                te.init_by_normal_text(x.inner_text, lang);
                te.tag = state;
                te.gender = MorphGender.MASCULINE;
                TerrItemToken.m_mans_by_state.add(te);
            }
            else if (x.name === "w") {
                let te = new Termin();
                te.init_by_normal_text(x.inner_text, lang);
                te.tag = state;
                te.gender = MorphGender.FEMINIE;
                TerrItemToken.m_mans_by_state.add(te);
            }
            else if (x.name === "cap") {
                let te = new Termin();
                te.init_by_normal_text(x.inner_text, lang);
                te.tag = state;
                TerrItemToken.m_capitals_by_state.add(te);
            }
        }
        c.set_shortest_canonical_text(true);
        if (c.canonic_text === "ГОЛЛАНДИЯ" || c.canonic_text.startsWith("КОРОЛЕВСТВО НИДЕР")) 
            c.canonic_text = "НИДЕРЛАНДЫ";
        else if (c.canonic_text === "ГОЛЛАНДІЯ" || c.canonic_text.startsWith("КОРОЛІВСТВО НІДЕР")) 
            c.canonic_text = "НІДЕРЛАНДИ";
        if (state.alpha2 === "RU") {
            if (lang.is_ua) 
                TerrItemToken.m_russiaua = c;
            else 
                TerrItemToken.m_russiaru = c;
        }
        else if (state.alpha2 === "BY") {
            if (!lang.is_ua) 
                TerrItemToken.m_belorussia = c;
        }
        else if (state.alpha2 === "KZ") {
            if (!lang.is_ua) 
                TerrItemToken.m_kazahstan = c;
        }
        else if (c.canonic_text === "ТАМОЖЕННЫЙ СОЮЗ") {
            if (!lang.is_ua) 
                TerrItemToken.m_tamog_sous = c;
        }
        if (state.find_slot(GeoReferent.ATTR_TYPE, null, true) === null) {
            if (lang.is_ua) 
                state.add_typ_state(lang);
            else {
                state.add_typ_state(MorphLang.RU);
                state.add_typ_state(MorphLang.EN);
            }
        }
        TerrItemToken.m_terr_ontology.add_item(c);
        if (lang.is_ru) 
            TerrItemToken.m_all_states.push(state);
        let a2 = state.alpha2;
        if (a2 !== null) {
            if (!TerrItemToken.m_alpha2state.containsKey(a2)) 
                TerrItemToken.m_alpha2state.put(a2, c);
            let a3 = null;
            let wrapa31253 = new RefOutArgWrapper();
            let inoutres1254 = MiscLocationHelper.m_alpha2_3.tryGetValue(a2, wrapa31253);
            a3 = wrapa31253.value;
            if (inoutres1254) {
                if (!TerrItemToken.m_alpha2state.containsKey(a3)) 
                    TerrItemToken.m_alpha2state.put(a3, c);
            }
        }
        if (acrs !== null) {
            for (const a of acrs) {
                if (!TerrItemToken.m_alpha2state.containsKey(a)) 
                    TerrItemToken.m_alpha2state.put(a, c);
            }
        }
    }
    
    static load_region(xml, lang) {
        let reg = new GeoReferent();
        let r = new IntOntologyItem(reg);
        let aterm = null;
        for (const x of xml.child_nodes) {
            if (x.name === "n") {
                let v = x.inner_text;
                if (v.startsWith("ЦЕНТРАЛ")) {
                }
                let te = new Termin();
                te.init_by_normal_text(v, lang);
                if (lang.is_ru && TerrItemToken.m_mos_regru === null && v === "ПОДМОСКОВЬЕ") {
                    TerrItemToken.m_mos_regru = r;
                    te.add_abridge("МОС.ОБЛ.");
                    te.add_abridge("МОСК.ОБЛ.");
                    te.add_abridge("МОСКОВ.ОБЛ.");
                    te.add_abridge("МОС.ОБЛАСТЬ");
                    te.add_abridge("МОСК.ОБЛАСТЬ");
                    te.add_abridge("МОСКОВ.ОБЛАСТЬ");
                }
                else if (lang.is_ru && TerrItemToken.m_len_regru === null && v === "ЛЕНОБЛАСТЬ") {
                    te.acronym = "ЛО";
                    te.add_abridge("ЛЕН.ОБЛ.");
                    te.add_abridge("ЛЕН.ОБЛАСТЬ");
                    TerrItemToken.m_len_regru = r;
                }
                r.termins.push(te);
                reg.add_name(v);
            }
            else if (x.name === "t") 
                reg.add_typ(x.inner_text);
            else if (x.name === "a") {
                let te = new Termin();
                te.init_by_normal_text(x.inner_text, lang);
                te.tag = r;
                r.termins.push(te);
            }
            else if (x.name === "ab") {
                if (aterm === null) 
                    aterm = Termin._new456(reg.get_string_value(GeoReferent.ATTR_NAME), lang, reg);
                aterm.add_abridge(x.inner_text);
            }
        }
        if (aterm !== null) 
            TerrItemToken.m_geo_abbrs.add(aterm);
        r.set_shortest_canonical_text(true);
        if (r.canonic_text.startsWith("КАРАЧАЕВО")) 
            r.canonic_text = "КАРАЧАЕВО - ЧЕРКЕССИЯ";
        if (r.canonic_text.includes("ТАТАРСТАН")) 
            TerrItemToken.m_tatarstan = r;
        else if (r.canonic_text.includes("УДМУРТ")) 
            TerrItemToken.m_udmurtia = r;
        else if (r.canonic_text.includes("ДАГЕСТАН")) 
            TerrItemToken.m_dagestan = r;
        if (reg.is_state && reg.is_region) 
            reg.add_typ_reg(lang);
        TerrItemToken.m_terr_ontology.add_item(r);
    }
    
    static _new1172(_arg1, _arg2, _arg3) {
        let res = new TerrItemToken(_arg1, _arg2);
        res.is_adjective = _arg3;
        return res;
    }
    
    static _new1173(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerrItemToken(_arg1, _arg2);
        res.termin_item = _arg3;
        res.is_doubt = _arg4;
        return res;
    }
    
    static _new1174(_arg1, _arg2, _arg3) {
        let res = new TerrItemToken(_arg1, _arg2);
        res.onto_item = _arg3;
        return res;
    }
    
    static _new1183(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerrItemToken(_arg1, _arg2);
        res.rzd = _arg3;
        res.morph = _arg4;
        return res;
    }
    
    static _new1185(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerrItemToken(_arg1, _arg2);
        res.onto_item = _arg3;
        res.morph = _arg4;
        return res;
    }
    
    static _new1186(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new TerrItemToken(_arg1, _arg2);
        res.onto_item = _arg3;
        res.is_adjective = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new1187(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new TerrItemToken(_arg1, _arg2);
        res.termin_item = _arg3;
        res.is_adjective = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new1190(_arg1, _arg2, _arg3) {
        let res = new TerrItemToken(_arg1, _arg2);
        res.is_doubt = _arg3;
        return res;
    }
    
    static static_constructor() {
        TerrItemToken.m_terr_ontology = null;
        TerrItemToken.m_geo_abbrs = null;
        TerrItemToken.m_russiaru = null;
        TerrItemToken.m_russiaua = null;
        TerrItemToken.m_mos_regru = null;
        TerrItemToken.m_len_regru = null;
        TerrItemToken.m_belorussia = null;
        TerrItemToken.m_kazahstan = null;
        TerrItemToken.m_tamog_sous = null;
        TerrItemToken.m_tatarstan = null;
        TerrItemToken.m_udmurtia = null;
        TerrItemToken.m_dagestan = null;
        TerrItemToken.m_terr_adjs = null;
        TerrItemToken.m_mans_by_state = null;
        TerrItemToken.m_unknown_regions = null;
        TerrItemToken.m_terr_noun_adjectives = null;
        TerrItemToken.m_capitals_by_state = null;
        TerrItemToken.m_alpha2state = null;
        TerrItemToken.m_all_states = new Array();
    }
}


TerrItemToken.static_constructor();

module.exports = TerrItemToken