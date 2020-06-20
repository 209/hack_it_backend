/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");
const Stream = require("./../../../unisharp/Stream");
const MemoryStream = require("./../../../unisharp/MemoryStream");
const XmlDocument = require("./../../../unisharp/XmlDocument");

const MorphWordForm = require("./../../../morph/MorphWordForm");
const MorphCollection = require("./../../MorphCollection");
const MorphGender = require("./../../../morph/MorphGender");
const ReferentEqualType = require("./../../ReferentEqualType");
const NumberExType = require("./../../core/NumberExType");
const MorphNumber = require("./../../../morph/MorphNumber");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const AddressItemTokenItemType = require("./../../address/internal/AddressItemTokenItemType");
const MorphLang = require("./../../../morph/MorphLang");
const EpNerAddressInternalResourceHelper = require("./../../address/internal/EpNerAddressInternalResourceHelper");
const TerminCollection = require("./../../core/TerminCollection");
const Referent = require("./../../Referent");
const IntOntologyItem = require("./../../core/IntOntologyItem");
const IntOntologyCollection = require("./../../core/IntOntologyCollection");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const TerrItemToken = require("./TerrItemToken");
const DateReferent = require("./../../date/DateReferent");
const NumberToken = require("./../../NumberToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const GetTextAttr = require("./../../core/GetTextAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const TextToken = require("./../../TextToken");
const CityItemTokenItemType = require("./CityItemTokenItemType");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const Termin = require("./../../core/Termin");
const MetaToken = require("./../../MetaToken");
const StreetItemType = require("./../../address/internal/StreetItemType");
const CharsInfo = require("./../../../morph/CharsInfo");
const MiscHelper = require("./../../core/MiscHelper");
const GeoReferent = require("./../GeoReferent");
const BracketHelper = require("./../../core/BracketHelper");
const ReferentToken = require("./../../ReferentToken");
const NumberHelper = require("./../../core/NumberHelper");
const AddressItemToken = require("./../../address/internal/AddressItemToken");
const StreetItemToken = require("./../../address/internal/StreetItemToken");

class CityItemToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = CityItemTokenItemType.PROPERNAME;
        this.value = null;
        this.alt_value = null;
        this.onto_item = null;
        this.doubtful = false;
        this.geo_object_before = false;
        this.geo_object_after = false;
        this.higher_geo = null;
        this.org_ref = null;
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(this.typ.toString());
        if (this.value !== null) 
            res.append(" ").append(this.value);
        if (this.onto_item !== null) 
            res.append(" ").append(this.onto_item.toString());
        if (this.doubtful) 
            res.append(" (?)");
        if (this.org_ref !== null) 
            res.append(" (Org: ").append(this.org_ref.referent).append(")");
        if (this.geo_object_before) 
            res.append(" GeoBefore");
        if (this.geo_object_after) 
            res.append(" GeoAfter");
        return res.toString();
    }
    
    merge_with_next(ne) {
        if (this.typ !== CityItemTokenItemType.NOUN || ne.typ !== CityItemTokenItemType.NOUN) 
            return false;
        let ok = false;
        if (this.value === "ГОРОДСКОЕ ПОСЕЛЕНИЕ" && ne.value === "ГОРОД") 
            ok = true;
        if (!ok) 
            return false;
        this.end_token = ne.end_token;
        this.doubtful = false;
        return true;
    }
    
    static try_parse_list(t, loc, max_count) {
        const MiscLocationHelper = require("./MiscLocationHelper");
        let ci = CityItemToken.try_parse(t, loc, false, null);
        if (ci === null) {
            if (t === null) 
                return null;
            if (((t instanceof TextToken) && t.is_value("МУНИЦИПАЛЬНЫЙ", null) && t.next !== null) && t.next.is_value("ОБРАЗОВАНИЕ", null)) {
                let t1 = t.next.next;
                let br = false;
                if (BracketHelper.can_be_start_of_sequence(t1, false, false)) {
                    br = true;
                    t1 = t1.next;
                }
                let lii = CityItemToken.try_parse_list(t1, loc, max_count);
                if (lii !== null && lii[0].typ === CityItemTokenItemType.NOUN) {
                    lii[0].begin_token = t;
                    lii[0].doubtful = false;
                    if (br && BracketHelper.can_be_end_of_sequence(lii[lii.length - 1].end_token.next, false, null, false)) 
                        lii[lii.length - 1].end_token = lii[lii.length - 1].end_token.next;
                    return lii;
                }
            }
            return null;
        }
        if (ci.chars.is_latin_letter && ci.typ === CityItemTokenItemType.NOUN && !t.chars.is_all_lower) 
            return null;
        let li = new Array();
        li.push(ci);
        for (t = ci.end_token.next; t !== null; t = t.next) {
            if (t.is_newline_before) {
                if (li.length === 1 && li[0].typ === CityItemTokenItemType.NOUN) {
                }
                else 
                    break;
            }
            let ci0 = CityItemToken.try_parse(t, loc, false, ci);
            if (ci0 === null) {
                if (t.is_newline_before) 
                    break;
                if (ci.typ === CityItemTokenItemType.NOUN && BracketHelper.can_be_start_of_sequence(t, true, false)) {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if ((br !== null && (br.length_char < 50) && t.next.chars.is_cyrillic_letter) && !t.next.chars.is_all_lower) {
                        ci0 = CityItemToken._new1132(br.begin_token, br.end_token, CityItemTokenItemType.PROPERNAME);
                        let tt = br.end_token.previous;
                        let num = null;
                        if (tt instanceof NumberToken) {
                            num = (tt).value.toString();
                            tt = tt.previous;
                            if (tt !== null && tt.is_hiphen) 
                                tt = tt.previous;
                        }
                        ci0.value = MiscHelper.get_text_value(br.begin_token.next, tt, GetTextAttr.NO);
                        if (tt !== br.begin_token.next) 
                            ci0.alt_value = MiscHelper.get_text_value(br.begin_token.next, tt, GetTextAttr.NO);
                        if (Utils.isNullOrEmpty(ci0.value)) 
                            ci0 = null;
                        else if (num !== null) {
                            ci0.value = (ci0.value + "-" + num);
                            if (ci0.alt_value !== null) 
                                ci0.alt_value = (ci0.alt_value + "-" + num);
                        }
                    }
                }
                if ((ci0 === null && ((ci.typ === CityItemTokenItemType.PROPERNAME || ci.typ === CityItemTokenItemType.CITY)) && t.is_comma) && li[0] === ci) {
                    let npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null) {
                        for (let tt = t.next; tt !== null && tt.end_char <= npt.end_char; tt = tt.next) {
                            let ci00 = CityItemToken.try_parse(tt, loc, false, ci);
                            if (ci00 !== null && ci00.typ === CityItemTokenItemType.NOUN) {
                                let ci01 = CityItemToken.try_parse(ci00.end_token.next, loc, false, ci);
                                if (ci01 === null) {
                                    ci0 = ci00;
                                    ci0.alt_value = MiscHelper.get_text_value(t.next, ci00.end_token, (t.kit.base_language.is_en ? GetTextAttr.IGNOREARTICLES : GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE)).toLowerCase();
                                    break;
                                }
                            }
                            if (!tt.chars.is_all_lower) 
                                break;
                        }
                    }
                }
                if (ci0 === null) 
                    break;
            }
            if ((ci0.typ === CityItemTokenItemType.NOUN && ci0.value !== null && LanguageHelper.ends_with(ci0.value, "УСАДЬБА")) && ci.typ === CityItemTokenItemType.NOUN) {
                ci.doubtful = false;
                t = ci.end_token = ci0.end_token;
                continue;
            }
            if (ci0.typ === CityItemTokenItemType.NOUN && ci.typ === CityItemTokenItemType.MISC && ci.value === "АДМИНИСТРАЦИЯ") 
                ci0.doubtful = false;
            if (ci.merge_with_next(ci0)) {
                t = ci.end_token;
                continue;
            }
            ci = ci0;
            li.push(ci);
            t = ci.end_token;
            if (max_count > 0 && li.length >= max_count) 
                break;
        }
        if (li.length > 1 && li[0].value === "СОВЕТ") 
            return null;
        if (li.length > 2 && li[0].typ === CityItemTokenItemType.NOUN && li[1].typ === CityItemTokenItemType.NOUN) {
            if (li[0].merge_with_next(li[1])) 
                li.splice(1, 1);
        }
        if (li.length > 2 && li[0].is_newline_after) 
            li.splice(1, li.length - 1);
        if (!li[0].geo_object_before) 
            li[0].geo_object_before = MiscLocationHelper.check_geo_object_before(li[0].begin_token);
        if (!li[li.length - 1].geo_object_after) 
            li[li.length - 1].geo_object_after = MiscLocationHelper.check_geo_object_after(li[li.length - 1].end_token, true);
        if ((li.length === 2 && li[0].typ === CityItemTokenItemType.NOUN && li[1].typ === CityItemTokenItemType.NOUN) && ((li[0].geo_object_before || li[1].geo_object_after))) {
            if (li[0].chars.is_capital_upper && li[1].chars.is_all_lower) 
                li[0].typ = CityItemTokenItemType.PROPERNAME;
            else if (li[1].chars.is_capital_upper && li[0].chars.is_all_lower) 
                li[1].typ = CityItemTokenItemType.PROPERNAME;
        }
        return li;
    }
    
    static check_doubtful(tt) {
        if (tt === null) 
            return true;
        if (tt.chars.is_all_lower) 
            return true;
        if (tt.length_char < 3) 
            return true;
        if (((tt.term === "СОЧИ" || tt.is_value("КИЕВ", null) || tt.is_value("ПСКОВ", null)) || tt.is_value("БОСТОН", null) || tt.is_value("РИГА", null)) || tt.is_value("АСТАНА", null) || tt.is_value("АЛМАТЫ", null)) 
            return false;
        if (tt.term.endsWith("ВО")) 
            return false;
        if ((tt.next instanceof TextToken) && (tt.whitespaces_after_count < 2) && !tt.next.chars.is_all_lower) {
            if (CharsInfo.ooEq(tt.chars, tt.next.chars) && !tt.chars.is_latin_letter && ((!tt.morph._case.is_genitive && !tt.morph._case.is_accusative))) {
                let mc = tt.next.get_morph_class_in_dictionary();
                if (mc.is_proper_surname || mc.is_proper_secname) 
                    return true;
            }
        }
        if ((tt.previous instanceof TextToken) && (tt.whitespaces_before_count < 2) && !tt.previous.chars.is_all_lower) {
            let mc = tt.previous.get_morph_class_in_dictionary();
            if (mc.is_proper_surname) 
                return true;
        }
        let ok = false;
        for (const wff of tt.morph.items) {
            let wf = Utils.as(wff, MorphWordForm);
            if (wf.is_in_dictionary) {
                if (!wf.class0.is_proper) 
                    ok = true;
                if (wf.class0.is_proper_surname || wf.class0.is_proper_name || wf.class0.is_proper_secname) {
                    if (wf.normal_case !== "ЛОНДОН" && wf.normal_case !== "ЛОНДОНЕ") 
                        ok = true;
                }
            }
            else if (wf.class0.is_proper_surname) {
                let val = (wf.normal_full != null ? wf.normal_full : wf.normal_case);
                if (LanguageHelper.ends_with_ex(val, "ОВ", "ЕВ", "ИН", null)) {
                    if (val !== "БЕРЛИН") {
                        if (tt.previous !== null && tt.previous.is_value("В", null)) {
                        }
                        else 
                            return true;
                    }
                }
            }
        }
        if (!ok) 
            return false;
        let t0 = tt.previous;
        if (t0 !== null && ((t0.is_char(',') || t0.morph.class0.is_conjunction))) 
            t0 = t0.previous;
        if (t0 !== null && (t0.get_referent() instanceof GeoReferent)) 
            return false;
        let t1 = tt.next;
        if (t1 !== null && ((t1.is_char(',') || t1.morph.class0.is_conjunction))) 
            t1 = t1.next;
        if (CityItemToken.m_recursive === 0) {
            CityItemToken.m_recursive++;
            let cit = CityItemToken._try_parse(t1, null, false, null);
            CityItemToken.m_recursive--;
            if (cit === null) 
                return true;
            if (cit.typ === CityItemTokenItemType.NOUN || cit.typ === CityItemTokenItemType.CITY) 
                return false;
        }
        return true;
    }
    
    static try_parse(t, loc, can_be_low_char = false, prev = null) {
        if (t === null) 
            return null;
        if (t.kit.is_recurce_overflow) 
            return null;
        t.kit.recurse_level++;
        let res = CityItemToken._try_parse_int(t, loc, can_be_low_char, prev);
        t.kit.recurse_level--;
        if (res !== null && res.typ === CityItemTokenItemType.NOUN && (res.whitespaces_after_count < 2)) {
            let nn = NounPhraseHelper.try_parse(res.end_token.next, NounPhraseParseAttr.NO, 0, null);
            if (nn !== null && ((nn.end_token.is_value("ЗНАЧЕНИЕ", "ЗНАЧЕННЯ") || nn.end_token.is_value("ТИП", null) || nn.end_token.is_value("ХОЗЯЙСТВО", "ХАЗЯЙСТВО")))) 
                res.end_token = nn.end_token;
        }
        if ((res !== null && res.typ === CityItemTokenItemType.PROPERNAME && res.value !== null) && res.begin_token === res.end_token && res.value.length > 4) {
            if (res.value.endsWith("ГРАД") || res.value.endsWith("ГОРОД")) {
                res.alt_value = null;
                res.typ = CityItemTokenItemType.CITY;
            }
            else if (((res.value.endsWith("СК") || res.value.endsWith("ИНО") || res.value.endsWith("ПОЛЬ")) || res.value.endsWith("ВЛЬ") || res.value.endsWith("АС")) || res.value.endsWith("ЕС")) {
                let sits = StreetItemToken.try_parse_list(res.end_token.next, null, 3);
                if (sits !== null) {
                    if (sits.length === 1 && sits[0].typ === StreetItemType.NOUN) 
                        return res;
                    if (sits.length === 2 && sits[0].typ === StreetItemType.NUMBER && sits[1].typ === StreetItemType.NOUN) 
                        return res;
                }
                let mc = res.end_token.get_morph_class_in_dictionary();
                if (mc.is_proper_geo || mc.is_undefined) {
                    res.alt_value = null;
                    res.typ = CityItemTokenItemType.CITY;
                }
            }
            else if (res.value.endsWith("АНЬ") || res.value.endsWith("TOWN") || res.value.startsWith("SAN")) 
                res.typ = CityItemTokenItemType.CITY;
            else if (res.end_token instanceof TextToken) {
                let lem = (res.end_token).lemma;
                if ((lem.endsWith("ГРАД") || lem.endsWith("ГОРОД") || lem.endsWith("СК")) || lem.endsWith("АНЬ") || lem.endsWith("ПОЛЬ")) {
                    res.alt_value = res.value;
                    res.value = lem;
                    let ii = res.alt_value.indexOf('-');
                    if (ii >= 0) 
                        res.value = res.alt_value.substring(0, 0 + ii + 1) + lem;
                    if (!lem.endsWith("АНЬ")) 
                        res.alt_value = null;
                }
            }
        }
        return res;
    }
    
    static _try_parse_int(t, loc, can_be_low_char, prev) {
        const MiscLocationHelper = require("./MiscLocationHelper");
        if (t === null) 
            return null;
        let res = CityItemToken._try_parse(t, loc, can_be_low_char, prev);
        if ((prev === null && t.chars.is_cyrillic_letter && t.chars.is_all_upper) && t.length_char === 2) {
            if (t.is_value("ТА", null)) {
                res = CityItemToken._try_parse(t.next, loc, can_be_low_char, prev);
                if (res !== null) {
                    if (res.typ === CityItemTokenItemType.NOUN) {
                        res.begin_token = t;
                        res.doubtful = false;
                    }
                    else 
                        res = null;
                }
            }
        }
        if ((prev !== null && prev.typ === CityItemTokenItemType.NOUN && CityItemToken.m_recursive === 0) && ((prev.value !== "ГОРОД" && prev.value !== "МІСТО"))) {
            if (res === null || ((res.typ !== CityItemTokenItemType.NOUN && res.typ !== CityItemTokenItemType.MISC && res.typ !== CityItemTokenItemType.CITY))) {
                CityItemToken.m_recursive++;
                let det = AddressItemToken.try_attach_org(t);
                CityItemToken.m_recursive--;
                if (det !== null) {
                    let cou = 0;
                    for (let ttt = det.begin_token; ttt !== null && ttt.end_char <= det.end_char; ttt = ttt.next) {
                        if (ttt.chars.is_letter) 
                            cou++;
                    }
                    if (cou < 6) {
                        let re = CityItemToken._new1132(det.begin_token, det.end_token, CityItemTokenItemType.PROPERNAME);
                        if (det.referent.type_name === "ORGANIZATION") 
                            re.org_ref = det.ref_token;
                        else {
                            re.value = MiscHelper.get_text_value_of_meta_token(det, GetTextAttr.NO);
                            re.alt_value = MiscHelper.get_text_value_of_meta_token(det, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                        }
                        return re;
                    }
                }
            }
        }
        if (res !== null && res.typ === CityItemTokenItemType.NOUN && (res.whitespaces_after_count < 3)) {
            let npt = NounPhraseHelper.try_parse(res.end_token.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                if (npt.end_token.is_value("ПОДЧИНЕНИЕ", "ПІДПОРЯДКУВАННЯ")) 
                    res.end_token = npt.end_token;
            }
        }
        if ((res !== null && t.chars.is_all_upper && res.typ === CityItemTokenItemType.PROPERNAME) && CityItemToken.m_recursive === 0) {
            let tt = t.previous;
            if (tt !== null && tt.is_comma) 
                tt = tt.previous;
            let geo_prev = null;
            if (tt !== null && (tt.get_referent() instanceof GeoReferent)) 
                geo_prev = Utils.as(tt.get_referent(), GeoReferent);
            if (geo_prev !== null && ((geo_prev.is_region || geo_prev.is_city))) {
                CityItemToken.m_recursive++;
                let det = AddressItemToken.try_attach_org(t);
                CityItemToken.m_recursive--;
                if (det !== null) 
                    res = null;
            }
        }
        if (res !== null && res.typ === CityItemTokenItemType.PROPERNAME) {
            if ((t.is_value("ДУМА", "РАДА") || t.is_value("ГЛАВА", "ГОЛОВА") || t.is_value("АДМИНИСТРАЦИЯ", "АДМІНІСТРАЦІЯ")) || t.is_value("МЭР", "МЕР") || t.is_value("ПРЕДСЕДАТЕЛЬ", "ГОЛОВА")) 
                return null;
        }
        if (res === null) {
            if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    res = CityItemToken._try_parse(t.next, loc, false, null);
                    if (res !== null && ((res.typ === CityItemTokenItemType.PROPERNAME || res.typ === CityItemTokenItemType.CITY))) {
                        res.begin_token = t;
                        res.typ = CityItemTokenItemType.PROPERNAME;
                        res.end_token = br.end_token;
                        if (res.end_token.next !== br.end_token) {
                            res.value = MiscHelper.get_text_value(t, br.end_token, GetTextAttr.NO);
                            res.alt_value = null;
                        }
                        return res;
                    }
                }
            }
            if (t instanceof TextToken) {
                let txt = (t).term;
                if (txt === "ИМ" || txt === "ИМЕНИ") {
                    let t1 = t.next;
                    if (t1 !== null && t1.is_char('.')) 
                        t1 = t1.next;
                    res = CityItemToken._try_parse(t1, loc, can_be_low_char, null);
                    if (res !== null && ((((res.typ === CityItemTokenItemType.CITY && res.doubtful)) || res.typ === CityItemTokenItemType.PROPERNAME))) {
                        res.begin_token = t;
                        res.morph = new MorphCollection();
                        return res;
                    }
                }
                if (prev !== null && prev.typ === CityItemTokenItemType.NOUN && ((!prev.doubtful || MiscLocationHelper.check_geo_object_before(prev.begin_token)))) {
                    if (t.chars.is_cyrillic_letter && t.length_char === 1 && t.chars.is_all_upper) {
                        if ((t.next !== null && !t.is_whitespace_after && ((t.next.is_hiphen || t.next.is_char('.')))) && (t.next.whitespaces_after_count < 2)) {
                            let res1 = CityItemToken._try_parse(t.next.next, loc, false, null);
                            if (res1 !== null && ((res1.typ === CityItemTokenItemType.PROPERNAME || res1.typ === CityItemTokenItemType.CITY))) {
                                let adjs = MiscLocationHelper.get_std_adj_full_str(txt, res1.morph.gender, res1.morph.number, true);
                                if (adjs === null && prev !== null && prev.typ === CityItemTokenItemType.NOUN) 
                                    adjs = MiscLocationHelper.get_std_adj_full_str(txt, prev.morph.gender, MorphNumber.UNDEFINED, true);
                                if (adjs === null) 
                                    adjs = MiscLocationHelper.get_std_adj_full_str(txt, res1.morph.gender, res1.morph.number, false);
                                if (adjs !== null) {
                                    if (res1.value === null) 
                                        res1.value = res1.get_source_text().toUpperCase();
                                    if (res1.alt_value !== null) 
                                        res1.alt_value = (adjs[0] + " " + res1.alt_value);
                                    else if (adjs.length > 1) 
                                        res1.alt_value = (adjs[1] + " " + res1.value);
                                    res1.value = (adjs[0] + " " + res1.value);
                                    res1.begin_token = t;
                                    res1.typ = CityItemTokenItemType.PROPERNAME;
                                    return res1;
                                }
                            }
                        }
                    }
                }
            }
            let tt = (prev === null ? t.previous : prev.begin_token.previous);
            while (tt !== null && tt.is_char_of(",.")) {
                tt = tt.previous;
            }
            let geo_prev = null;
            if (tt !== null && (tt.get_referent() instanceof GeoReferent)) 
                geo_prev = Utils.as(tt.get_referent(), GeoReferent);
            let tt0 = t;
            let ooo = false;
            if (geo_prev !== null || MiscLocationHelper.check_near_before(t.previous) !== null) 
                ooo = true;
            else if (MiscLocationHelper.check_geo_object_before(t)) 
                ooo = true;
            else if (t.chars.is_letter) {
                tt = t.next;
                if (tt !== null && tt.is_char('.')) 
                    tt = tt.next;
                if ((tt instanceof TextToken) && !tt.chars.is_all_lower) {
                    if (MiscLocationHelper.check_geo_object_after(tt, true)) 
                        ooo = true;
                    else if (AddressItemToken.check_street_after(tt.next)) 
                        ooo = true;
                    else {
                        let cit2 = CityItemToken._try_parse(tt, null, false, null);
                        if (cit2 !== null && cit2.begin_token !== cit2.end_token && ((cit2.typ === CityItemTokenItemType.PROPERNAME || cit2.typ === CityItemTokenItemType.CITY))) {
                            if (AddressItemToken.check_street_after(cit2.end_token.next)) 
                                ooo = true;
                        }
                    }
                }
            }
            if (ooo) {
                tt = t;
                for (let ttt = tt; ttt !== null; ttt = ttt.next) {
                    if (ttt.is_char_of(",.")) {
                        tt = ttt.next;
                        continue;
                    }
                    if (ttt.is_newline_before) 
                        break;
                    let det = AddressItemToken.try_attach_detail(ttt);
                    if (det !== null) {
                        ttt = det.end_token;
                        tt = det.end_token.next;
                        continue;
                    }
                    det = AddressItemToken.try_attach_org(ttt);
                    if (det !== null) {
                        ttt = det.end_token;
                        tt0 = (tt = det.end_token.next);
                        continue;
                    }
                    let ait = AddressItemToken.try_parse(ttt, null, false, true, null);
                    if (ait !== null && ait.typ === AddressItemTokenItemType.PLOT) {
                        ttt = ait.end_token;
                        tt0 = (tt = ait.end_token.next);
                        continue;
                    }
                    break;
                }
                if (tt instanceof TextToken) {
                    if (tt0.is_comma && tt0.next !== null) 
                        tt0 = tt0.next;
                    let txt = (tt).term;
                    if ((((txt === "Д" || txt === "С" || txt === "C") || txt === "П" || txt === "Х")) && ((tt.chars.is_all_lower || ((tt.next !== null && tt.next.is_char('.')))))) {
                        let tt1 = tt;
                        if (tt1.next !== null && tt1.next.is_char('.')) 
                            tt1 = tt1.next;
                        let tt2 = tt1.next;
                        if ((tt2 !== null && tt2.length_char === 1 && tt2.chars.is_cyrillic_letter) && tt2.chars.is_all_upper) {
                            if (tt2.next !== null && ((tt2.next.is_char('.') || tt2.next.is_hiphen)) && !tt2.is_whitespace_after) 
                                tt2 = tt2.next.next;
                        }
                        let ok = false;
                        if (txt === "Д" && (tt2 instanceof NumberToken) && !tt2.is_newline_before) 
                            ok = false;
                        else if (((txt === "С" || txt === "C")) && (tt2 instanceof TextToken) && ((tt2.is_value("О", null) || tt2.is_value("O", null)))) 
                            ok = false;
                        else if (tt2 !== null && tt2.chars.is_capital_upper && (tt2.whitespaces_before_count < 2)) 
                            ok = tt.chars.is_all_lower;
                        else if (tt2 !== null && tt2.chars.is_all_upper && (tt2.whitespaces_before_count < 2)) {
                            ok = true;
                            if (tt.chars.is_all_upper) {
                                let rtt = tt.kit.process_referent("PERSON", tt);
                                if (rtt !== null) {
                                    ok = false;
                                    let ttt2 = rtt.end_token.next;
                                    if (ttt2 !== null && ttt2.is_comma) 
                                        ttt2 = ttt2.next;
                                    if (AddressItemToken.check_house_after(ttt2, false, false) || AddressItemToken.check_street_after(ttt2)) 
                                        ok = true;
                                }
                            }
                            else if (tt1 === tt) 
                                ok = false;
                            if (!ok && tt1.next !== null) {
                                let ttt2 = tt1.next.next;
                                if (ttt2 !== null && ttt2.is_comma) 
                                    ttt2 = ttt2.next;
                                if (AddressItemToken.check_house_after(ttt2, false, false) || AddressItemToken.check_street_after(ttt2)) 
                                    ok = true;
                            }
                        }
                        else if (prev !== null && prev.typ === CityItemTokenItemType.PROPERNAME && (tt.whitespaces_before_count < 2)) {
                            if (MiscLocationHelper.check_geo_object_before(prev.begin_token.previous)) 
                                ok = true;
                            if (txt === "П" && tt.next !== null && ((tt.next.is_hiphen || tt.next.is_char_of("\\/")))) {
                                let sit = StreetItemToken.try_parse(tt, null, false, null, false);
                                if (sit !== null && sit.typ === StreetItemType.NOUN) 
                                    ok = false;
                            }
                        }
                        else if (prev === null) {
                            if (MiscLocationHelper.check_geo_object_before(tt.previous)) 
                                ok = true;
                        }
                        if (tt.previous !== null && tt.previous.is_hiphen && !tt.is_whitespace_before) {
                            if (tt.next !== null && tt.next.is_char('.')) {
                            }
                            else 
                                ok = false;
                        }
                        if (ok) {
                            res = CityItemToken._new1134(tt0, tt1, CityItemTokenItemType.NOUN, true);
                            res.value = (txt === "Д" ? "ДЕРЕВНЯ" : ((txt === "П" ? "ПОСЕЛОК" : ((txt === "Х" ? "ХУТОР" : "СЕЛО")))));
                            if (txt === "П") 
                                res.alt_value = "ПОСЕЛЕНИЕ";
                            else if (txt === "С" || txt === "C") {
                                res.alt_value = "СЕЛЕНИЕ";
                                if (tt0 === tt1) {
                                    let npt = NounPhraseHelper.try_parse(tt1.next, NounPhraseParseAttr.PARSEPRONOUNS, 0, null);
                                    if (npt !== null && npt.morph._case.is_instrumental) 
                                        return null;
                                }
                            }
                            res.doubtful = true;
                            return res;
                        }
                    }
                    if ((txt === "СП" || txt === "РП" || txt === "ГП") || txt === "ДП") {
                        if (tt.next !== null && tt.next.is_char('.')) 
                            tt = tt.next;
                        if (tt.next !== null && tt.next.chars.is_capital_upper) 
                            return CityItemToken._new1135(tt0, tt, CityItemTokenItemType.NOUN, true, (txt === "РП" ? "РАБОЧИЙ ПОСЕЛОК" : ((txt === "ГП" ? "ГОРОДСКОЕ ПОСЕЛЕНИЕ" : ((txt === "ДП" ? "ДАЧНЫЙ ПОСЕЛОК" : "СЕЛЬСКОЕ ПОСЕЛЕНИЕ"))))));
                    }
                    res = CityItemToken._try_parse(tt, loc, can_be_low_char, null);
                    if (res !== null && res.typ === CityItemTokenItemType.NOUN) {
                        res.geo_object_before = true;
                        res.begin_token = tt0;
                        return res;
                    }
                    if (tt.chars.is_all_upper && tt.length_char > 2 && tt.chars.is_cyrillic_letter) 
                        return CityItemToken._new1136(tt, tt, CityItemTokenItemType.PROPERNAME, (tt).term);
                }
            }
            if ((t instanceof NumberToken) && t.next !== null) {
                let net = NumberHelper.try_parse_number_with_postfix(t);
                if (net !== null && net.ex_typ === NumberExType.KILOMETER) 
                    return CityItemToken._new1136(t, net.end_token, CityItemTokenItemType.PROPERNAME, ((String(Math.floor(net.real_value))) + "КМ"));
            }
            let rt = Utils.as(t, ReferentToken);
            if ((rt !== null && (rt.referent instanceof GeoReferent) && rt.begin_token === rt.end_token) && (rt.referent).is_state) {
                if (t.previous === null) 
                    return null;
                if (t.previous.morph.number === MorphNumber.SINGULAR && t.morph._case.is_nominative && !t.morph._case.is_genitive) 
                    return CityItemToken._new1136(t, t, CityItemTokenItemType.PROPERNAME, rt.get_source_text().toUpperCase());
            }
            return null;
        }
        if (res.typ === CityItemTokenItemType.NOUN) {
            if (res.value === "СЕЛО" && (t instanceof TextToken)) {
                if (t.previous === null) {
                }
                else if (t.previous.morph.class0.is_preposition) {
                }
                else 
                    res.doubtful = true;
                res.morph.gender = MorphGender.NEUTER;
            }
            if (res.alt_value === null && res.begin_token.is_value("ПОСЕЛЕНИЕ", null)) {
                res.value = "ПОСЕЛЕНИЕ";
                res.alt_value = "ПОСЕЛОК";
            }
            if (LanguageHelper.ends_with(res.value, "УСАДЬБА") && res.alt_value === null) 
                res.alt_value = "НАСЕЛЕННЫЙ ПУНКТ";
            if (res.value === "СТАНЦИЯ" || res.value === "СТАНЦІЯ") 
                res.doubtful = true;
            if (res.end_token.is_value("СТОЛИЦА", null) || res.end_token.is_value("СТОЛИЦЯ", null)) {
                res.doubtful = true;
                if (res.end_token.next !== null) {
                    let _geo = Utils.as(res.end_token.next.get_referent(), GeoReferent);
                    if (_geo !== null && ((_geo.is_region || _geo.is_state))) {
                        res.higher_geo = _geo;
                        res.end_token = res.end_token.next;
                        res.doubtful = false;
                        res.value = "ГОРОД";
                        for (const it of TerrItemToken.m_capitals_by_state.termins) {
                            let ge = Utils.as(it.tag, GeoReferent);
                            if (ge === null || !ge.can_be_equals(_geo, ReferentEqualType.WITHINONETEXT)) 
                                continue;
                            let tok = TerrItemToken.m_capitals_by_state.try_parse(res.end_token.next, TerminParseAttr.NO);
                            if (tok !== null && tok.termin === it) 
                                break;
                            res.typ = CityItemTokenItemType.CITY;
                            res.value = it.canonic_text;
                            return res;
                        }
                    }
                }
            }
            if ((res.begin_token.length_char === 1 && res.begin_token.chars.is_all_upper && res.begin_token.next !== null) && res.begin_token.next.is_char('.')) {
                let ne = CityItemToken._try_parse_int(res.begin_token.next.next, loc, false, null);
                if (ne !== null && ne.typ === CityItemTokenItemType.CITY) {
                }
                else if (ne !== null && ne.typ === CityItemTokenItemType.PROPERNAME && ((ne.value.endsWith("К") || ne.value.endsWith("О")))) {
                }
                else 
                    return null;
            }
        }
        if (res.typ === CityItemTokenItemType.PROPERNAME || res.typ === CityItemTokenItemType.CITY) {
            let val = (res.value != null ? res.value : (((res.onto_item === null ? null : res.onto_item.canonic_text))));
            let t1 = res.end_token;
            if (((!t1.is_whitespace_after && t1.next !== null && t1.next.is_hiphen) && !t1.next.is_whitespace_after && (t1.next.next instanceof NumberToken)) && (t1.next.next).int_value !== null && ((t1.next.next).int_value < 30)) {
                res.end_token = t1.next.next;
                res.value = (val + "-" + (t1.next.next).value);
                if (res.alt_value !== null) 
                    res.alt_value = (res.alt_value + "-" + (t1.next.next).value);
                res.typ = CityItemTokenItemType.PROPERNAME;
            }
            else if (t1.whitespaces_after_count === 1 && (t1.next instanceof NumberToken) && t1.next.morph.class0.is_adjective) {
                let ok = false;
                if (t1.next.next === null || t1.next.is_newline_after) 
                    ok = true;
                else if (!t1.next.is_whitespace_after && t1.next.next !== null && t1.next.next.is_char_of(",")) 
                    ok = true;
                if (ok) {
                    res.end_token = t1.next;
                    res.value = (val + "-" + (t1.next).value);
                    res.typ = CityItemTokenItemType.PROPERNAME;
                }
            }
        }
        if (res.typ === CityItemTokenItemType.CITY && res.begin_token === res.end_token) {
            if (res.begin_token.get_morph_class_in_dictionary().is_adjective && (res.end_token.next instanceof TextToken)) {
                let ok = false;
                let t1 = null;
                let npt = NounPhraseHelper.try_parse(res.begin_token, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.end_token === res.end_token.next) {
                    t1 = npt.end_token;
                    if (CharsInfo.ooEq(res.end_token.next.chars, res.begin_token.chars)) {
                        ok = true;
                        if (res.begin_token.chars.is_all_upper) {
                            let cii = CityItemToken._try_parse_int(res.end_token.next, loc, false, null);
                            if (cii !== null && cii.typ === CityItemTokenItemType.NOUN) 
                                ok = false;
                        }
                    }
                    else if (res.end_token.next.chars.is_all_lower) {
                        let ttt = res.end_token.next.next;
                        if (ttt === null || ttt.is_char_of(",.")) 
                            ok = true;
                    }
                }
                else if (CharsInfo.ooEq(res.end_token.next.chars, res.begin_token.chars) && res.begin_token.chars.is_capital_upper) {
                    let ttt = res.end_token.next.next;
                    if (ttt === null || ttt.is_char_of(",.")) 
                        ok = true;
                    t1 = res.end_token.next;
                    npt = null;
                }
                if (ok && t1 !== null) {
                    res.typ = CityItemTokenItemType.PROPERNAME;
                    res.onto_item = null;
                    res.end_token = t1;
                    if (npt !== null) {
                        res.value = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                        res.morph = npt.morph;
                    }
                    else 
                        res.value = MiscHelper.get_text_value(res.begin_token, res.end_token, GetTextAttr.NO);
                }
            }
            if ((res.end_token.next !== null && res.end_token.next.is_hiphen && !res.end_token.next.is_whitespace_after) && !res.end_token.next.is_whitespace_before) {
                let res1 = CityItemToken._try_parse(res.end_token.next.next, loc, false, null);
                if ((res1 !== null && res1.typ === CityItemTokenItemType.PROPERNAME && res1.begin_token === res1.end_token) && CharsInfo.ooEq(res1.begin_token.chars, res.begin_token.chars)) {
                    if (res1.onto_item === null && res.onto_item === null) {
                        res.typ = CityItemTokenItemType.PROPERNAME;
                        res.value = ((res.onto_item === null ? res.value : res.onto_item.canonic_text) + "-" + res1.value);
                        if (res.alt_value !== null) 
                            res.alt_value = (res.alt_value + "-" + res1.value);
                        res.onto_item = null;
                        res.end_token = res1.end_token;
                        res.doubtful = false;
                    }
                }
                else if ((res.end_token.next.next instanceof NumberToken) && (res.end_token.next.next).int_value !== null && ((res.end_token.next.next).int_value < 30)) {
                    res.typ = CityItemTokenItemType.PROPERNAME;
                    res.value = ((res.onto_item === null ? res.value : res.onto_item.canonic_text) + "-" + (res.end_token.next.next).value);
                    if (res.alt_value !== null) 
                        res.alt_value = (res.alt_value + "-" + (res.end_token.next.next).value);
                    res.onto_item = null;
                    res.end_token = res.end_token.next.next;
                }
            }
            else if (res.begin_token.get_morph_class_in_dictionary().is_proper_name) {
                if (res.begin_token.is_value("КИЇВ", null) || res.begin_token.is_value("АСТАНА", null) || res.begin_token.is_value("АЛМАТЫ", null)) {
                }
                else if ((res.end_token instanceof TextToken) && (res.end_token).term.endsWith("ВО")) {
                }
                else {
                    res.doubtful = true;
                    let tt = res.begin_token.previous;
                    if (tt !== null && tt.previous !== null) {
                        if (tt.is_char(',') || tt.morph.class0.is_conjunction) {
                            let _geo = Utils.as(tt.previous.get_referent(), GeoReferent);
                            if (_geo !== null && _geo.is_city) 
                                res.doubtful = false;
                        }
                    }
                    if (tt !== null && tt.is_value("В", null) && tt.chars.is_all_lower) {
                        let npt1 = NounPhraseHelper.try_parse(res.begin_token, NounPhraseParseAttr.NO, 0, null);
                        if (npt1 === null || npt1.end_char <= res.end_char) 
                            res.doubtful = false;
                    }
                }
            }
            if ((res.begin_token === res.end_token && res.typ === CityItemTokenItemType.CITY && res.onto_item !== null) && res.onto_item.canonic_text === "САНКТ - ПЕТЕРБУРГ") {
                for (let tt = res.begin_token.previous; tt !== null; tt = tt.previous) {
                    if (tt.is_hiphen || tt.is_char('.')) 
                        continue;
                    if (tt.is_value("С", null) || tt.is_value("C", null) || tt.is_value("САНКТ", null)) 
                        res.begin_token = tt;
                    break;
                }
            }
        }
        if ((res.begin_token === res.end_token && res.typ === CityItemTokenItemType.PROPERNAME && res.whitespaces_after_count === 1) && (res.end_token.next instanceof TextToken) && CharsInfo.ooEq(res.end_token.chars, res.end_token.next.chars)) {
            let ok = false;
            let t1 = res.end_token;
            if (t1.next.next === null || t1.next.is_newline_after) 
                ok = true;
            else if (!t1.next.is_whitespace_after && t1.next.next !== null && t1.next.next.is_char_of(",.")) 
                ok = true;
            if (ok) {
                let pp = CityItemToken._try_parse(t1.next, loc, false, null);
                if (pp !== null && pp.typ === CityItemTokenItemType.NOUN) 
                    ok = false;
                if (ok) {
                    let te = TerrItemToken.try_parse(t1.next, null, false, false, null);
                    if (te !== null && te.termin_item !== null) 
                        ok = false;
                }
            }
            if (ok) {
                res.end_token = t1.next;
                res.value = MiscHelper.get_text_value(res.begin_token, res.end_token, GetTextAttr.NO);
                res.alt_value = null;
                res.typ = CityItemTokenItemType.PROPERNAME;
            }
        }
        return res;
    }
    
    static _try_parse(t, loc, can_be_low_char = false, prev = null) {
        if (!((t instanceof TextToken))) {
            if ((t instanceof ReferentToken) && (t.get_referent() instanceof DateReferent)) {
                let aii = StreetItemToken.try_parse_spec(t, null);
                if (aii !== null) {
                    if (aii.length > 1 && aii[0].typ === StreetItemType.NUMBER && aii[1].typ === StreetItemType.STDNAME) {
                        let res2 = CityItemToken._new1132(t, aii[1].end_token, CityItemTokenItemType.PROPERNAME);
                        res2.value = ((aii[0].number === null ? aii[0].value : aii[0].number.int_value.toString()) + " " + aii[1].value);
                        return res2;
                    }
                }
            }
            return null;
        }
        let li = new Array();
        let li0 = null;
        let is_in_loc_onto = false;
        if (loc !== null) {
            if ((((li0 = loc.try_attach(t, null, false)))) !== null) {
                li.splice(li.length, 0, ...li0);
                is_in_loc_onto = true;
            }
        }
        if (t.kit.ontology !== null && li.length === 0) {
            if ((((li0 = t.kit.ontology.attach_token(GeoReferent.OBJ_TYPENAME, t)))) !== null) {
                li.splice(li.length, 0, ...li0);
                is_in_loc_onto = true;
            }
        }
        if (li.length === 0) {
            li0 = CityItemToken.m_ontology.try_attach(t, null, false);
            if (li0 !== null) 
                li.splice(li.length, 0, ...li0);
        }
        if (li.length > 0) {
            if (t instanceof TextToken) {
                for (let i = li.length - 1; i >= 0; i--) {
                    if (li[i].item !== null) {
                        let g = Utils.as(li[i].item.referent, GeoReferent);
                        if (g !== null) {
                            if (!g.is_city) {
                                li.splice(i, 1);
                                continue;
                            }
                        }
                    }
                }
                let tt = Utils.as(t, TextToken);
                for (const nt of li) {
                    if (nt.item !== null && nt.item.canonic_text === tt.term) {
                        if (can_be_low_char || !MiscHelper.is_all_characters_lower(nt.begin_token, nt.end_token, false)) {
                            let ci = CityItemToken._new1140(nt.begin_token, nt.end_token, CityItemTokenItemType.CITY, nt.item, nt.morph);
                            if (nt.begin_token === nt.end_token && !is_in_loc_onto) 
                                ci.doubtful = CityItemToken.check_doubtful(Utils.as(nt.begin_token, TextToken));
                            let tt1 = nt.end_token.next;
                            if ((((tt1 !== null && tt1.is_hiphen && !tt1.is_whitespace_before) && !tt1.is_whitespace_after && prev !== null) && prev.typ === CityItemTokenItemType.NOUN && (tt1.next instanceof TextToken)) && CharsInfo.ooEq(tt1.previous.chars, tt1.next.chars)) {
                                li = null;
                                break;
                            }
                            return ci;
                        }
                    }
                }
                if (li !== null) {
                    for (const nt of li) {
                        if (nt.item !== null) {
                            if (can_be_low_char || !MiscHelper.is_all_characters_lower(nt.begin_token, nt.end_token, false)) {
                                let ci = CityItemToken._new1140(nt.begin_token, nt.end_token, CityItemTokenItemType.CITY, nt.item, nt.morph);
                                if (nt.begin_token === nt.end_token && (nt.begin_token instanceof TextToken)) {
                                    ci.doubtful = CityItemToken.check_doubtful(Utils.as(nt.begin_token, TextToken));
                                    let str = (nt.begin_token).term;
                                    if (str !== nt.item.canonic_text) {
                                        if (LanguageHelper.ends_with_ex(str, "О", "А", null, null)) 
                                            ci.alt_value = str;
                                    }
                                }
                                return ci;
                            }
                        }
                    }
                }
            }
            if (li !== null) {
                for (const nt of li) {
                    if (nt.item === null) {
                        let ty = (nt.termin.tag === null ? CityItemTokenItemType.NOUN : CityItemTokenItemType.of(nt.termin.tag));
                        let ci = CityItemToken._new1142(nt.begin_token, nt.end_token, ty, nt.morph);
                        ci.value = nt.termin.canonic_text;
                        if (ty === CityItemTokenItemType.MISC && ci.value === "ЖИТЕЛЬ" && t.previous !== null) {
                            if (t.previous.is_value("МЕСТНЫЙ", "МІСЦЕВИЙ")) 
                                return null;
                            if (t.previous.morph.class0.is_pronoun) 
                                return null;
                        }
                        if (ty === CityItemTokenItemType.NOUN && !t.chars.is_all_lower) {
                            if (t.morph.class0.is_proper_surname) 
                                ci.doubtful = true;
                        }
                        if (nt.begin_token.kit.base_language.is_ua) {
                            if (nt.begin_token.is_value("М", null)) {
                                if (!nt.begin_token.chars.is_all_lower) 
                                    return null;
                                ci.doubtful = true;
                            }
                            else if (nt.begin_token.is_value("МІС", null)) {
                                if ((t).term !== "МІС") 
                                    return null;
                                ci.doubtful = true;
                            }
                        }
                        if (nt.begin_token.kit.base_language.is_ru) {
                            if (nt.begin_token.is_value("Г", null)) {
                                if (nt.begin_token.previous !== null && nt.begin_token.previous.morph.class0.is_preposition) {
                                }
                                else {
                                    if (!nt.begin_token.chars.is_all_lower) 
                                        return null;
                                    if ((nt.end_token === nt.begin_token && nt.end_token.next !== null && !nt.end_token.is_whitespace_after) && ((nt.end_token.next.is_char_of("\\/") || nt.end_token.next.is_hiphen))) 
                                        return null;
                                    if (!t.is_whitespace_before && t.previous !== null) {
                                        if (t.previous.is_char_of("\\/") || t.previous.is_hiphen) 
                                            return null;
                                    }
                                }
                                ci.doubtful = true;
                            }
                            else if (nt.begin_token.is_value("ГОР", null)) {
                                if ((t).term !== "ГОР") {
                                    if (t.chars.is_capital_upper) {
                                        ci = null;
                                        break;
                                    }
                                    return null;
                                }
                                ci.doubtful = true;
                            }
                            else if (nt.begin_token.is_value("ПОС", null)) {
                                if ((t).term !== "ПОС") 
                                    return null;
                                ci.doubtful = true;
                            }
                        }
                        let npt1 = NounPhraseHelper.try_parse(t.previous, NounPhraseParseAttr.NO, 0, null);
                        if (npt1 !== null && npt1.adjectives.length > 0) {
                            let s = npt1.adjectives[0].get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                            if ((s === "РОДНОЙ" || s === "ЛЮБИМЫЙ" || s === "РІДНИЙ") || s === "КОХАНИЙ") 
                                return null;
                        }
                        return ci;
                    }
                }
            }
        }
        if (!((t instanceof TextToken))) 
            return null;
        if ((t).term === "СПБ" && !t.chars.is_all_lower && CityItemToken.m_st_peterburg !== null) 
            return CityItemToken._new1143(t, t, CityItemTokenItemType.CITY, CityItemToken.m_st_peterburg, CityItemToken.m_st_peterburg.canonic_text);
        if (t.chars.is_all_lower) 
            return null;
        let stds = CityItemToken.m_std_adjectives.try_attach(t, null, false);
        if (stds !== null) {
            let cit = CityItemToken._try_parse(stds[0].end_token.next, loc, false, null);
            if (cit !== null && ((((cit.typ === CityItemTokenItemType.PROPERNAME && cit.value !== null)) || cit.typ === CityItemTokenItemType.CITY))) {
                let adj = stds[0].termin.canonic_text;
                cit.value = (adj + " " + ((cit.value != null ? cit.value : (cit !== null && cit.onto_item !== null ? cit.onto_item.canonic_text : null))));
                if (cit.alt_value !== null) 
                    cit.alt_value = (adj + " " + cit.alt_value);
                cit.begin_token = t;
                let npt0 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                if (npt0 !== null && npt0.end_token === cit.end_token) {
                    cit.morph = npt0.morph;
                    cit.value = npt0.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                }
                cit.typ = CityItemTokenItemType.PROPERNAME;
                cit.doubtful = false;
                return cit;
            }
        }
        let t1 = t;
        let doubt = false;
        let name = new StringBuilder();
        let altname = null;
        let k = 0;
        let is_prep = false;
        for (let tt = t; tt !== null; tt = tt.next) {
            if (!((tt instanceof TextToken))) 
                break;
            if (!tt.chars.is_letter || ((tt.chars.is_cyrillic_letter !== t.chars.is_cyrillic_letter && !tt.is_value("НА", null)))) 
                break;
            if (tt !== t) {
                let si = StreetItemToken.try_parse(tt, null, false, null, false);
                if (si !== null && si.typ === StreetItemType.NOUN) {
                    if (si.end_token.next === null || si.end_token.next.is_char_of(",.")) {
                    }
                    else 
                        break;
                }
                if (tt.length_char < 2) 
                    break;
                if ((tt.length_char < 3) && !tt.is_value("НА", null)) {
                    if (tt.is_whitespace_before) 
                        break;
                }
            }
            if (name.length > 0) {
                name.append('-');
                if (altname !== null) 
                    altname.append('-');
            }
            if ((tt instanceof TextToken) && ((is_prep || ((k > 0 && !tt.get_morph_class_in_dictionary().is_proper_geo))))) {
                name.append((tt).term);
                if (altname !== null) 
                    altname.append((tt).term);
            }
            else {
                let ss = CityItemToken.get_normal_geo(tt);
                if (ss !== (tt).term) {
                    if (altname === null) 
                        altname = new StringBuilder();
                    altname.append(name.toString());
                    altname.append((tt).term);
                }
                name.append(ss);
            }
            t1 = tt;
            is_prep = tt.morph.class0.is_preposition;
            if (tt.next === null || tt.next.next === null) 
                break;
            if (!tt.next.is_hiphen) 
                break;
            if (tt.is_whitespace_after || tt.next.is_whitespace_after) {
                if (tt.whitespaces_after_count > 1 || tt.next.whitespaces_after_count > 1) 
                    break;
                if (CharsInfo.ooNoteq(tt.next.next.chars, tt.chars)) 
                    break;
                let ttt = tt.next.next.next;
                if (ttt !== null && !ttt.is_newline_after) {
                    if (ttt.chars.is_letter) 
                        break;
                }
            }
            tt = tt.next;
            k++;
        }
        if (k > 0) {
            if (k > 2) 
                return null;
            let reee = CityItemToken._new1144(t, t1, CityItemTokenItemType.PROPERNAME, name.toString(), doubt);
            if (altname !== null) 
                reee.alt_value = altname.toString();
            return reee;
        }
        if (t === null) 
            return null;
        let npt = (t.chars.is_latin_letter ? null : NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null));
        if ((npt !== null && npt.end_token !== t && npt.adjectives.length > 0) && !npt.adjectives[0].end_token.next.is_comma) {
            let cit = CityItemToken._try_parse(t.next, loc, false, null);
            if (cit !== null && cit.typ === CityItemTokenItemType.NOUN && ((LanguageHelper.ends_with_ex(cit.value, "ПУНКТ", "ПОСЕЛЕНИЕ", "ПОСЕЛЕННЯ", "ПОСЕЛОК") || t.next.is_value("ГОРОДОК", null)))) 
                return CityItemToken._new1145(t, t, CityItemTokenItemType.CITY, t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false), npt.morph);
            else {
                if (CharsInfo.ooNoteq(npt.end_token.chars, t.chars)) {
                    if (npt.end_token.chars.is_all_lower && ((npt.end_token.next === null || npt.end_token.next.is_comma))) {
                    }
                    else 
                        return null;
                }
                if (npt.adjectives.length !== 1) 
                    return null;
                let npt1 = NounPhraseHelper.try_parse(npt.end_token, NounPhraseParseAttr.NO, 0, null);
                if (npt1 === null || npt1.adjectives.length === 0) {
                    let si = StreetItemToken.try_parse(npt.end_token, null, false, null, false);
                    if (si === null || si.typ !== StreetItemType.NOUN) {
                        t1 = npt.end_token;
                        doubt = CityItemToken.check_doubtful(Utils.as(t1, TextToken));
                        return CityItemToken._new1146(t, t1, CityItemTokenItemType.PROPERNAME, npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false), doubt, npt.morph);
                    }
                }
            }
        }
        if (t.next !== null && CharsInfo.ooEq(t.next.chars, t.chars) && !t.is_newline_after) {
            let ok = false;
            if (t.next.next === null || CharsInfo.ooNoteq(t.next.next.chars, t.chars)) 
                ok = true;
            else if (t.next.next.get_referent() instanceof GeoReferent) 
                ok = true;
            else if (CityItemToken.m_recursive === 0) {
                CityItemToken.m_recursive++;
                let tis = TerrItemToken.try_parse_list(t.next.next, loc, 2);
                CityItemToken.m_recursive--;
                if (tis !== null && tis.length > 1) {
                    if (tis[0].is_adjective && tis[1].termin_item !== null) 
                        ok = true;
                }
            }
            if (ok && (t.next instanceof TextToken)) {
                doubt = CityItemToken.check_doubtful(Utils.as(t.next, TextToken));
                let stat = t.kit.statistics.get_bigramm_info(t, t.next);
                let ok1 = false;
                if ((stat !== null && stat.pair_count >= 2 && stat.pair_count === stat.second_count) && !stat.second_has_other_first) {
                    if (stat.pair_count > 2) 
                        doubt = false;
                    ok1 = true;
                }
                else if (CityItemToken.m_std_adjectives.try_attach(t, null, false) !== null && (t.next instanceof TextToken)) 
                    ok1 = true;
                else if (((t.next.next === null || t.next.next.is_comma)) && t.morph.class0.is_noun && ((t.next.morph.class0.is_adjective || t.next.morph.class0.is_noun))) 
                    ok1 = true;
                if (ok1) {
                    let tne = CityItemToken._try_parse_int(t.next, loc, false, null);
                    if (tne !== null && tne.typ === CityItemTokenItemType.NOUN) {
                    }
                    else {
                        name.append(" ").append((t.next).term);
                        if (altname !== null) 
                            altname.append(" ").append((t.next).term);
                        t1 = t.next;
                        return CityItemToken._new1147(t, t1, CityItemTokenItemType.PROPERNAME, name.toString(), (altname === null ? null : altname.toString()), doubt, t.next.morph);
                    }
                }
            }
        }
        if (t.length_char < 2) 
            return null;
        t1 = t;
        doubt = CityItemToken.check_doubtful(Utils.as(t, TextToken));
        if (((t.next !== null && prev !== null && prev.typ === CityItemTokenItemType.NOUN) && t.next.chars.is_cyrillic_letter && t.next.chars.is_all_lower) && t.whitespaces_after_count === 1) {
            let tt = t.next;
            let ok = false;
            if (tt.next === null || tt.next.is_char_of(",;")) 
                ok = true;
            if (ok && AddressItemToken.try_parse(tt.next, null, false, false, null) === null) {
                t1 = tt;
                name.append(" ").append(t1.get_source_text().toUpperCase());
            }
        }
        if (MiscHelper.is_eng_article(t)) 
            return null;
        let res = CityItemToken._new1147(t, t1, CityItemTokenItemType.PROPERNAME, name.toString(), (altname === null ? null : altname.toString()), doubt, t.morph);
        if (t1 === t && (t1 instanceof TextToken) && (t1).term0 !== null) 
            res.alt_value = (t1).term0;
        let sog = false;
        let glas = false;
        for (const ch of res.value) {
            if (LanguageHelper.is_cyrillic_vowel(ch) || LanguageHelper.is_latin_vowel(ch)) 
                glas = true;
            else 
                sog = true;
        }
        if (!glas || !sog) 
            return null;
        if (t === t1 && (t instanceof TextToken)) {
            if ((t).term !== res.value) 
                res.alt_value = (t).term;
        }
        return res;
    }
    
    static try_parse_back(t) {
        while (t !== null && ((t.is_char_of("(,") || t.is_and))) {
            t = t.previous;
        }
        if (!((t instanceof TextToken))) 
            return null;
        let cou = 0;
        for (let tt = t; tt !== null; tt = tt.previous) {
            if (!((tt instanceof TextToken))) 
                return null;
            if (!tt.chars.is_letter) 
                continue;
            let res = CityItemToken.try_parse(tt, null, true, null);
            if (res !== null && res.end_token === t) 
                return res;
            if ((++cou) > 2) 
                break;
        }
        return null;
    }
    
    static get_normal_geo(t) {
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return null;
        if (tt.term[tt.term.length - 1] === 'О') 
            return tt.term;
        if (tt.term[tt.term.length - 1] === 'Ы') 
            return tt.term;
        for (const wf of tt.morph.items) {
            if (wf.class0.is_proper_geo && (wf).is_in_dictionary) 
                return (wf).normal_case;
        }
        let geo_eq_term = false;
        for (const wf of tt.morph.items) {
            if (wf.class0.is_proper_geo) {
                let ggg = (wf).normal_case;
                if (ggg === tt.term) 
                    geo_eq_term = true;
                else if (!wf._case.is_nominative) 
                    return ggg;
            }
        }
        if (geo_eq_term) 
            return tt.term;
        if (tt.morph.items_count > 0) 
            return (tt.morph.get_indexer_item(0)).normal_case;
        else 
            return tt.term;
    }
    
    static initialize() {
        const MiscLocationHelper = require("./MiscLocationHelper");
        if (CityItemToken.m_ontology !== null) 
            return;
        CityItemToken.m_ontology = new IntOntologyCollection();
        CityItemToken.M_CITY_ADJECTIVES = new TerminCollection();
        let t = null;
        t = new Termin("ГОРОД");
        t.add_abridge("ГОР.");
        t.add_abridge("Г.");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_variant("ГОРОДОК", false);
        t.add_variant("ШАХТЕРСКИЙ ГОРОДОК", false);
        t.add_variant("ПРИМОРСКИЙ ГОРОДОК", false);
        t.add_variant("МАЛЕНЬКИЙ ГОРОДОК", false);
        t.add_variant("НЕБОЛЬШОЙ ГОРОДОК", false);
        CityItemToken.m_ontology.add(t);
        t = new Termin("CITY");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_variant("TOWN", false);
        t.add_variant("CAPITAL", false);
        CityItemToken.m_ontology.add(t);
        t = new Termin("МІСТО", MorphLang.UA);
        t.add_abridge("МІС.");
        t.add_abridge("М.");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1114("ГОРОД-ГЕРОЙ", "ГОРОД");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1150("МІСТО-ГЕРОЙ", MorphLang.UA, "МІСТО");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1114("ГОРОД-КУРОРТ", "ГОРОД");
        t.add_abridge("Г.К.");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1150("МІСТО-КУРОРТ", MorphLang.UA, "МІСТО");
        t.add_abridge("М.К.");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("СЕЛО");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ДЕРЕВНЯ");
        t.add_abridge("ДЕР.");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("СЕЛЕНИЕ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("СЕЛО", MorphLang.UA);
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ПОРТ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ПОРТ", MorphLang.UA);
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ПОСЕЛОК");
        t.add_abridge("ПОС.");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_variant("ПОСЕЛЕНИЕ", false);
        t.add_variant("ЖИЛОЙ ПОСЕЛОК", false);
        t.add_variant("КОТТЕДЖНЫЙ ПОСЕЛОК", false);
        t.add_variant("ВАХТОВЫЙ ПОСЕЛОК", false);
        t.add_variant("ШАХТЕРСКИЙ ПОСЕЛОК", false);
        t.add_variant("ДАЧНЫЙ ПОСЕЛОК", false);
        t.add_variant("КУРОРТНЫЙ ПОСЕЛОК", false);
        t.add_variant("ПОСЕЛОК СОВХОЗА", false);
        t.add_variant("ПОСЕЛОК КОЛХОЗА", false);
        CityItemToken.m_ontology.add(t);
        t = new Termin("СЕЛИЩЕ", MorphLang.UA);
        t.add_abridge("СЕЛ.");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ПОСЕЛОК ГОРОДСКОГО ТИПА");
        t.acronym = (t.acronym_smart = "ПГТ");
        t.add_abridge("ПГТ.");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("СЕЛИЩЕ МІСЬКОГО ТИПУ", MorphLang.UA);
        t.acronym = (t.acronym_smart = "СМТ");
        t.add_abridge("СМТ.");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("РАБОЧИЙ ПОСЕЛОК");
        t.add_abridge("Р.П.");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_abridge("РАБ.П.");
        t.add_abridge("Р.ПОС.");
        t.add_abridge("РАБ.ПОС.");
        CityItemToken.m_ontology.add(t);
        t = new Termin("РОБОЧЕ СЕЛИЩЕ", MorphLang.UA);
        t.add_abridge("Р.С.");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ДАЧНЫЙ ПОСЕЛОК");
        t.add_abridge("Д.П.");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_abridge("ДАЧ.П.");
        t.add_abridge("Д.ПОС.");
        t.add_abridge("ДАЧ.ПОС.");
        t.add_variant("ЖИЛИЩНО ДАЧНЫЙ ПОСЕЛОК", false);
        t.add_variant("ДАЧНОЕ ПОСЕЛЕНИЕ", false);
        CityItemToken.m_ontology.add(t);
        t = new Termin("ДАЧНЕ СЕЛИЩЕ", MorphLang.UA);
        t.add_abridge("Д.С.");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_abridge("ДАЧ.С.");
        t.add_abridge("Д.СЕЛ.");
        t.add_abridge("ДАЧ.СЕЛ.");
        CityItemToken.m_ontology.add(t);
        t = new Termin("ГОРОДСКОЕ ПОСЕЛЕНИЕ");
        t.add_abridge("Г.П.");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_abridge("Г.ПОС.");
        t.add_abridge("ГОР.П.");
        t.add_abridge("ГОР.ПОС.");
        t.add_variant("ГОРОДСКОЙ ОКРУГ", false);
        t.add_abridge("ГОР. ОКРУГ");
        t.add_abridge("Г.О.");
        t.add_abridge("Г.О.Г.");
        t.add_abridge("ГОРОДСКОЙ ОКРУГ Г.");
        CityItemToken.m_ontology.add(t);
        t = Termin._new143("ПОСЕЛКОВОЕ ПОСЕЛЕНИЕ", "ПОСЕЛОК", CityItemTokenItemType.NOUN);
        CityItemToken.m_ontology.add(t);
        t = new Termin("МІСЬКЕ ПОСЕЛЕННЯ", MorphLang.UA);
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("СЕЛЬСКОЕ ПОСЕЛЕНИЕ");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_abridge("С.ПОС.");
        t.add_abridge("С.П.");
        t.add_variant("СЕЛЬСОВЕТ", false);
        CityItemToken.m_ontology.add(t);
        t = new Termin("СІЛЬСЬКЕ ПОСЕЛЕННЯ", MorphLang.UA);
        t.add_abridge("С.ПОС.");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("СТАНИЦА");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_abridge("СТ-ЦА");
        t.add_abridge("СТАН-ЦА");
        CityItemToken.m_ontology.add(t);
        t = new Termin("СТАНИЦЯ", MorphLang.UA);
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1114("СТОЛИЦА", "ГОРОД");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1150("СТОЛИЦЯ", MorphLang.UA, "МІСТО");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("СТАНЦИЯ");
        t.add_abridge("СТАНЦ.");
        t.add_abridge("СТ.");
        t.add_abridge("СТАН.");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_variant("ПЛАТФОРМА", false);
        t.add_abridge("ПЛАТФ.");
        CityItemToken.m_ontology.add(t);
        t = new Termin("СТАНЦІЯ", MorphLang.UA);
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ЖЕЛЕЗНОДОРОЖНАЯ СТАНЦИЯ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ЗАЛІЗНИЧНА СТАНЦІЯ", MorphLang.UA);
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("НАСЕЛЕННЫЙ ПУНКТ");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_abridge("Н.П.");
        t.add_abridge("Б.Н.П.");
        CityItemToken.m_ontology.add(t);
        t = new Termin("НАСЕЛЕНИЙ ПУНКТ", MorphLang.UA);
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1114("РАЙОННЫЙ ЦЕНТР", "НАСЕЛЕННЫЙ ПУНКТ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1150("РАЙОННИЙ ЦЕНТР", MorphLang.UA, "НАСЕЛЕНИЙ ПУНКТ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1114("ГОРОДСКОЙ ОКРУГ", "НАСЕЛЕННЫЙ ПУНКТ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1150("МІСЬКИЙ ОКРУГ", MorphLang.UA, "НАСЕЛЕНИЙ ПУНКТ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1114("ОБЛАСТНОЙ ЦЕНТР", "НАСЕЛЕННЫЙ ПУНКТ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = Termin._new1150("ОБЛАСНИЙ ЦЕНТР", MorphLang.UA, "НАСЕЛЕНИЙ ПУНКТ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ХУТОР");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("АУЛ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ААЛ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("АРБАН");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("ВЫСЕЛКИ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("МЕСТЕЧКО");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("УРОЧИЩЕ");
        t.tag = CityItemTokenItemType.NOUN;
        CityItemToken.m_ontology.add(t);
        t = new Termin("УСАДЬБА");
        t.tag = CityItemTokenItemType.NOUN;
        t.add_variant("ЦЕНТРАЛЬНАЯ УСАДЬБА", false);
        t.add_abridge("ЦЕНТР.УС.");
        t.add_abridge("ЦЕНТР.УСАДЬБА");
        t.add_abridge("Ц/У");
        t.add_abridge("УС-БА");
        t.add_abridge("ЦЕНТР.УС-БА");
        CityItemToken.m_ontology.add(t);
        for (const s of ["ЖИТЕЛЬ", "МЭР"]) {
            CityItemToken.m_ontology.add(Termin._new119(s, CityItemTokenItemType.MISC));
        }
        for (const s of ["ЖИТЕЛЬ", "МЕР"]) {
            CityItemToken.m_ontology.add(Termin._new456(s, MorphLang.UA, CityItemTokenItemType.MISC));
        }
        t = Termin._new119("АДМИНИСТРАЦИЯ", CityItemTokenItemType.MISC);
        t.add_abridge("АДМ.");
        CityItemToken.m_ontology.add(t);
        CityItemToken.m_std_adjectives = new IntOntologyCollection();
        t = new Termin("ВЕЛИКИЙ");
        t.add_abridge("ВЕЛ.");
        t.add_abridge("ВЕЛИК.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("БОЛЬШОЙ");
        t.add_abridge("БОЛ.");
        t.add_abridge("БОЛЬШ.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("МАЛЫЙ");
        t.add_abridge("МАЛ.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("ВЕРХНИЙ");
        t.add_abridge("ВЕР.");
        t.add_abridge("ВЕРХ.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("НИЖНИЙ");
        t.add_abridge("НИЖ.");
        t.add_abridge("НИЖН.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("СРЕДНИЙ");
        t.add_abridge("СРЕД.");
        t.add_abridge("СРЕДН.");
        t.add_abridge("СР.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("СТАРЫЙ");
        t.add_abridge("СТ.");
        t.add_abridge("СТАР.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("НОВЫЙ");
        t.add_abridge("НОВ.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("ВЕЛИКИЙ", MorphLang.UA);
        t.add_abridge("ВЕЛ.");
        t.add_abridge("ВЕЛИК.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("МАЛИЙ", MorphLang.UA);
        t.add_abridge("МАЛ.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("ВЕРХНІЙ", MorphLang.UA);
        t.add_abridge("ВЕР.");
        t.add_abridge("ВЕРХ.");
        t.add_abridge("ВЕРХН.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("НИЖНІЙ", MorphLang.UA);
        t.add_abridge("НИЖ.");
        t.add_abridge("НИЖН.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("СЕРЕДНІЙ", MorphLang.UA);
        t.add_abridge("СЕР.");
        t.add_abridge("СЕРЕД.");
        t.add_abridge("СЕРЕДН.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("СТАРИЙ", MorphLang.UA);
        t.add_abridge("СТ.");
        t.add_abridge("СТАР.");
        CityItemToken.m_std_adjectives.add(t);
        t = new Termin("НОВИЙ", MorphLang.UA);
        t.add_abridge("НОВ.");
        CityItemToken.m_std_adjectives.add(t);
        CityItemToken.m_std_adjectives.add(new Termin("SAN"));
        CityItemToken.m_std_adjectives.add(new Termin("LOS"));
        let dat = EpNerAddressInternalResourceHelper.get_bytes("c.dat");
        if (dat === null) 
            throw new Error("Not found resource file c.dat in Analyzer.Location");
        let tmp = new MemoryStream(MiscLocationHelper.deflate(dat)); 
        try {
            tmp.position = 0;
            let xml = new XmlDocument();
            xml.loadStream(tmp);
            for (const x of xml.document_element.child_nodes) {
                if (x.name === "bigcity") 
                    CityItemToken.load_big_city(x);
                else if (x.name === "city") 
                    CityItemToken.load_city(x);
            }
        }
        finally {
            tmp.close();
        }
    }
    
    static load_city(xml) {
        let ci = new IntOntologyItem(null);
        let onto = CityItemToken.m_ontology;
        let lang = MorphLang.RU;
        if (Utils.getXmlAttrByName(xml.attributes, "l") !== null && Utils.getXmlAttrByName(xml.attributes, "l").value === "ua") 
            lang = MorphLang.UA;
        for (const x of xml.child_nodes) {
            if (x.name === "n") {
                let v = x.inner_text;
                let t = new Termin();
                t.init_by_normal_text(v, lang);
                ci.termins.push(t);
                t.add_std_abridges();
                if (v.startsWith("SAINT ")) 
                    t.add_abridge("ST. " + v.substring(6));
                else if (v.startsWith("SAITNE ")) 
                    t.add_abridge("STE. " + v.substring(7));
            }
        }
        onto.add_item(ci);
    }
    
    static load_big_city(xml) {
        let ci = new IntOntologyItem(null);
        ci.misc_attr = ci;
        let adj = null;
        let onto = CityItemToken.m_ontology;
        let city_adj = CityItemToken.M_CITY_ADJECTIVES;
        let lang = MorphLang.RU;
        if (Utils.getXmlAttrByName(xml.attributes, "l") !== null) {
            let la = Utils.getXmlAttrByName(xml.attributes, "l").value;
            if (la === "ua") 
                lang = MorphLang.UA;
            else if (la === "en") 
                lang = MorphLang.EN;
        }
        for (const x of xml.child_nodes) {
            if (x.name === "n") {
                let v = x.inner_text;
                if (Utils.isNullOrEmpty(v)) 
                    continue;
                let t = new Termin();
                t.init_by_normal_text(v, lang);
                ci.termins.push(t);
                if (v === "САНКТ-ПЕТЕРБУРГ") {
                    if (CityItemToken.m_st_peterburg === null) 
                        CityItemToken.m_st_peterburg = ci;
                    t.acronym = "СПБ";
                    t.add_abridge("С.ПЕТЕРБУРГ");
                    t.add_abridge("СП-Б");
                    ci.termins.push(new Termin("ПЕТЕРБУРГ", lang));
                }
                else if (v.startsWith("SAINT ")) 
                    t.add_abridge("ST. " + v.substring(6));
                else if (v.startsWith("SAITNE ")) 
                    t.add_abridge("STE. " + v.substring(7));
            }
            else if (x.name === "a") 
                adj = x.inner_text;
        }
        onto.add_item(ci);
        if (!Utils.isNullOrEmpty(adj)) {
            let at = new Termin();
            at.init_by_normal_text(adj, lang);
            at.tag = ci;
            city_adj.add(at);
            let spb = adj === "САНКТ-ПЕТЕРБУРГСКИЙ" || adj === "САНКТ-ПЕТЕРБУРЗЬКИЙ";
            if (spb) 
                city_adj.add(Termin._new456(adj.substring(6), lang, ci));
        }
    }
    
    static _new1132(_arg1, _arg2, _arg3) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new1134(_arg1, _arg2, _arg3, _arg4) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.geo_object_before = _arg4;
        return res;
    }
    
    static _new1135(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.geo_object_before = _arg4;
        res.value = _arg5;
        return res;
    }
    
    static _new1136(_arg1, _arg2, _arg3, _arg4) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new1140(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.onto_item = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new1142(_arg1, _arg2, _arg3, _arg4) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.morph = _arg4;
        return res;
    }
    
    static _new1143(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.onto_item = _arg4;
        res.value = _arg5;
        return res;
    }
    
    static _new1144(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.doubtful = _arg5;
        return res;
    }
    
    static _new1145(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new1146(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.doubtful = _arg5;
        res.morph = _arg6;
        return res;
    }
    
    static _new1147(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new CityItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.alt_value = _arg5;
        res.doubtful = _arg6;
        res.morph = _arg7;
        return res;
    }
    
    static static_constructor() {
        CityItemToken.m_recursive = 0;
        CityItemToken.m_ontology = null;
        CityItemToken.m_st_peterburg = null;
        CityItemToken.M_CITY_ADJECTIVES = null;
        CityItemToken.m_std_adjectives = null;
    }
}


CityItemToken.static_constructor();

module.exports = CityItemToken