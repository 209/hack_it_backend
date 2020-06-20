/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const MorphNumber = require("./../../../morph/MorphNumber");
const MorphClass = require("./../../../morph/MorphClass");
const MorphCase = require("./../../../morph/MorphCase");
const MetaToken = require("./../../MetaToken");
const StreetKind = require("./../StreetKind");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const MorphWordForm = require("./../../../morph/MorphWordForm");
const TextToken = require("./../../TextToken");
const GetTextAttr = require("./../../core/GetTextAttr");
const MorphGender = require("./../../../morph/MorphGender");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const Morphology = require("./../../../morph/Morphology");
const MiscHelper = require("./../../core/MiscHelper");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const ReferentToken = require("./../../ReferentToken");
const AddressItemTokenItemType = require("./AddressItemTokenItemType");
const StreetItemType = require("./StreetItemType");
const StreetReferent = require("./../StreetReferent");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const GeoReferent = require("./../../geo/GeoReferent");
const NumberSpellingType = require("./../../NumberSpellingType");
const NumberHelper = require("./../../core/NumberHelper");
const MiscLocationHelper = require("./../../geo/internal/MiscLocationHelper");
const NumberToken = require("./../../NumberToken");
const AddressItemToken = require("./AddressItemToken");
const StreetItemToken = require("./StreetItemToken");

class StreetDefineHelper {
    
    static check_street_after(t) {
        if (t === null) 
            return false;
        while (t !== null && ((t.is_char_of(",;") || t.morph.class0.is_preposition))) {
            t = t.next;
        }
        let li = StreetItemToken.try_parse_list(t, null, 10);
        if (li === null) 
            return false;
        let rt = StreetDefineHelper.try_parse_street(li, false, false);
        if (rt !== null && rt.begin_token === t) 
            return true;
        else 
            return false;
    }
    
    static try_parse_ext_street(sli) {
        let a = StreetDefineHelper.try_parse_street(sli, true, false);
        if (a !== null) 
            return new ReferentToken(a.referent, a.begin_token, a.end_token);
        return null;
    }
    
    static try_parse_street(sli, ext_onto_regim = false, for_metro = false) {
        if (sli === null || sli.length === 0) 
            return null;
        let i = 0;
        let j = 0;
        for (i = 0; i < sli.length; i++) {
            if (i === 0 && sli[i].typ === StreetItemType.FIX && ((sli.length === 1 || sli[1].typ !== StreetItemType.NOUN))) 
                return StreetDefineHelper._try_parse_fix(sli);
            else if (sli[i].typ === StreetItemType.NOUN) {
                if ((i === 0 && sli[i].termin.canonic_text === "УЛИЦА" && ((i + 2) < sli.length)) && sli[i + 1].typ === StreetItemType.NOUN && sli[i + 1].termin.canonic_text === "МИКРОРАЙОН") {
                    sli[i + 1].begin_token = sli[i].begin_token;
                    sli.splice(i, 1);
                }
                if (sli[i].termin.canonic_text === "МЕТРО") {
                    if ((i + 1) < sli.length) {
                        let sli1 = new Array();
                        for (let ii = i + 1; ii < sli.length; ii++) {
                            sli1.push(sli[ii]);
                        }
                        let str1 = StreetDefineHelper.try_parse_street(sli1, ext_onto_regim, true);
                        if (str1 !== null) {
                            str1.begin_token = sli[i].begin_token;
                            str1.is_doubt = sli[i].is_abridge;
                            if (sli[i + 1].is_in_brackets) 
                                str1.is_doubt = false;
                            return str1;
                        }
                    }
                    else if (i === 1 && sli[0].typ === StreetItemType.NAME) {
                        for_metro = true;
                        break;
                    }
                    if (i === 0 && sli.length > 0) {
                        for_metro = true;
                        break;
                    }
                    return null;
                }
                if (i === 0 && (i + 1) >= sli.length && ((sli[i].termin.canonic_text === "ВОЕННЫЙ ГОРОДОК" || sli[i].termin.canonic_text === "ПРОМЗОНА"))) {
                    let stri0 = new StreetReferent();
                    stri0.add_slot(StreetReferent.ATTR_TYP, "микрорайон", false, 0);
                    stri0.add_slot(StreetReferent.ATTR_NAME, sli[i].termin.canonic_text, false, 0);
                    return AddressItemToken._new86(AddressItemTokenItemType.STREET, sli[0].begin_token, sli[0].end_token, stri0, true);
                }
                if (i === 0 && (i + 1) >= sli.length && sli[i].termin.canonic_text === "МИКРОРАЙОН") {
                    let stri0 = new StreetReferent();
                    stri0.add_slot(StreetReferent.ATTR_TYP, sli[i].termin.canonic_text.toLowerCase(), false, 0);
                    return AddressItemToken._new86(AddressItemTokenItemType.STREET, sli[0].begin_token, sli[0].end_token, stri0, true);
                }
                if (sli[i].termin.canonic_text === "ПЛОЩАДЬ" || sli[i].termin.canonic_text === "ПЛОЩА") {
                    let tt = sli[i].end_token.next;
                    if (tt !== null && ((tt.is_hiphen || tt.is_char(':')))) 
                        tt = tt.next;
                    let nex = NumberHelper.try_parse_number_with_postfix(tt);
                    if (nex !== null) 
                        return null;
                }
                break;
            }
        }
        if (i >= sli.length) 
            return StreetDefineHelper.try_detect_non_noun(sli, ext_onto_regim, for_metro);
        let name = null;
        let number = null;
        let age = null;
        let adj = null;
        let noun = sli[i];
        let alt_noun = null;
        let is_micro_raion = (noun.termin.canonic_text === "МИКРОРАЙОН" || noun.termin.canonic_text === "МІКРОРАЙОН" || noun.termin.canonic_text === "КВАРТАЛ") || LanguageHelper.ends_with(noun.termin.canonic_text, "ГОРОДОК");
        let before = 0;
        let after = 0;
        for (j = 0; j < i; j++) {
            if ((sli[j].typ === StreetItemType.NAME || sli[j].typ === StreetItemType.STDNAME || sli[j].typ === StreetItemType.FIX) || sli[j].typ === StreetItemType.STDADJECTIVE || sli[j].typ === StreetItemType.STDPARTOFNAME) 
                before++;
            else if (sli[j].typ === StreetItemType.NUMBER) {
                if (sli[j].is_newline_after) 
                    return null;
                if (sli[j].number.morph.class0.is_adjective) 
                    before++;
                else if (is_micro_raion) 
                    before++;
                else if (sli[i].number_has_prefix) 
                    before++;
            }
            else 
                before++;
        }
        for (j = i + 1; j < sli.length; j++) {
            if ((sli[j].typ === StreetItemType.NAME || sli[j].typ === StreetItemType.STDNAME || sli[j].typ === StreetItemType.FIX) || sli[j].typ === StreetItemType.STDADJECTIVE || sli[j].typ === StreetItemType.STDPARTOFNAME) 
                after++;
            else if (sli[j].typ === StreetItemType.NUMBER) {
                if (sli[j].number !== null && sli[j].number.morph.class0.is_adjective) 
                    after++;
                else if (is_micro_raion) 
                    after++;
                else if (sli[j].number_has_prefix) 
                    after++;
                else if (ext_onto_regim) 
                    after++;
            }
            else if (sli[j].typ === StreetItemType.NOUN) 
                break;
            else 
                after++;
        }
        let rli = new Array();
        let n0 = 0;
        let n1 = 0;
        if (before > after) {
            if (noun.termin.canonic_text === "МЕТРО") 
                return null;
            let tt = sli[0].begin_token;
            if (tt === sli[0].end_token && noun.begin_token === sli[0].end_token.next) {
                if (!tt.morph.class0.is_adjective && !((tt instanceof NumberToken))) {
                    if ((sli[0].is_newline_before || !MiscLocationHelper.check_geo_object_before(sli[0].begin_token) || noun.morph._case.is_genitive) || noun.morph._case.is_instrumental) {
                        let ok = false;
                        if (AddressItemToken.check_house_after(noun.end_token.next, false, true)) 
                            ok = true;
                        else if (noun.end_token.next === null) 
                            ok = true;
                        else if (noun.is_newline_after && MiscLocationHelper.check_geo_object_before(sli[0].begin_token)) 
                            ok = true;
                        if (!ok) {
                            if ((noun.chars.is_latin_letter && noun.chars.is_capital_upper && sli[0].chars.is_latin_letter) && sli[0].chars.is_capital_upper) 
                                ok = true;
                        }
                        if (!ok) 
                            return null;
                    }
                }
            }
            n0 = 0;
            n1 = i - 1;
        }
        else if (i === 1 && sli[0].typ === StreetItemType.NUMBER) {
            if (!sli[0].is_whitespace_after) 
                return null;
            number = (sli[0].number === null ? sli[0].value : sli[0].number.int_value.toString());
            if (sli[0].is_number_km) 
                number += "км";
            n0 = i + 1;
            n1 = sli.length - 1;
            rli.push(sli[0]);
            rli.push(sli[i]);
        }
        else if (after > before) {
            n0 = i + 1;
            n1 = sli.length - 1;
            rli.push(sli[i]);
        }
        else if (after === 0) 
            return null;
        else if ((sli.length > 2 && ((sli[0].typ === StreetItemType.NAME || sli[0].typ === StreetItemType.STDADJECTIVE || sli[0].typ === StreetItemType.STDNAME)) && sli[1].typ === StreetItemType.NOUN) && sli[2].typ === StreetItemType.NUMBER) {
            n0 = 0;
            n1 = 0;
            let num = false;
            let tt2 = sli[2].end_token.next;
            if (sli[2].is_number_km) 
                num = true;
            else if (sli[0].begin_token.previous !== null && sli[0].begin_token.previous.is_value("КИЛОМЕТР", null)) {
                sli[2].is_number_km = true;
                num = true;
            }
            else if (sli[2].begin_token.previous.is_comma) {
            }
            else if (sli[2].begin_token !== sli[2].end_token) 
                num = true;
            else if (AddressItemToken.check_house_after(sli[2].end_token.next, false, true)) 
                num = true;
            else if (sli[2].morph.class0.is_adjective && (sli[2].whitespaces_before_count < 2)) {
                if (sli[2].end_token.next === null || sli[2].end_token.is_comma || sli[2].is_newline_after) 
                    num = true;
            }
            if (num) {
                number = (sli[2].number === null ? sli[2].value : sli[2].number.int_value.toString());
                if (sli[2].is_number_km) 
                    number += "км";
                rli.push(sli[2]);
            }
            else 
                sli.splice(2, sli.length - 2);
        }
        else 
            return null;
        let sec_number = null;
        for (j = n0; j <= n1; j++) {
            if (sli[j].typ === StreetItemType.NUMBER) {
                if (age !== null || ((sli[j].is_newline_before && j > 0))) 
                    break;
                if (number !== null) {
                    if (name !== null && name.typ === StreetItemType.STDNAME) {
                        sec_number = (sli[j].number === null ? sli[j].value : sli[j].number.int_value.toString());
                        if (sli[j].is_number_km) 
                            sec_number += "км";
                        rli.push(sli[j]);
                        continue;
                    }
                    if (((j + 1) < sli.length) && sli[j + 1].typ === StreetItemType.STDNAME) {
                        sec_number = (sli[j].number === null ? sli[j].value : sli[j].number.int_value.toString());
                        if (sli[j].is_number_km) 
                            sec_number += "км";
                        rli.push(sli[j]);
                        continue;
                    }
                    break;
                }
                if (sli[j].number !== null && sli[j].number.typ === NumberSpellingType.DIGIT && !sli[j].number.morph.class0.is_adjective) {
                    if (sli[j].whitespaces_before_count > 2 && j > 0) 
                        break;
                    if (sli[j].number !== null && sli[j].number.int_value > 20) {
                        if (j > n0) {
                            if (((j + 1) < sli.length) && sli[j + 1].typ === StreetItemType.NOUN) {
                            }
                            else 
                                break;
                        }
                    }
                    if (j === n0 && n0 > 0) {
                    }
                    else if (j === n0 && n0 === 0 && sli[j].whitespaces_after_count === 1) {
                    }
                    else if (sli[j].number_has_prefix) {
                    }
                    else if (j === n1 && ((n1 + 1) < sli.length) && sli[n1 + 1].typ === StreetItemType.NOUN) {
                    }
                    else 
                        break;
                }
                number = (sli[j].number === null ? sli[j].value : sli[j].number.int_value.toString());
                if (sli[j].is_number_km) 
                    number += "км";
                rli.push(sli[j]);
            }
            else if (sli[j].typ === StreetItemType.AGE) {
                if (number !== null || age !== null) 
                    break;
                age = sli[j].number.int_value.toString();
                rli.push(sli[j]);
            }
            else if (sli[j].typ === StreetItemType.STDADJECTIVE) {
                if (adj !== null) 
                    return null;
                adj = sli[j];
                rli.push(sli[j]);
            }
            else if (sli[j].typ === StreetItemType.NAME || sli[j].typ === StreetItemType.STDNAME || sli[j].typ === StreetItemType.FIX) {
                if (name !== null) {
                    if (j > 1 && sli[j - 2].typ === StreetItemType.NOUN) 
                        break;
                    else if (i < j) 
                        break;
                    else 
                        return null;
                }
                name = sli[j];
                rli.push(sli[j]);
            }
            else if (sli[j].typ === StreetItemType.STDPARTOFNAME && j === n1) {
                if (name !== null) 
                    break;
                name = sli[j];
                rli.push(sli[j]);
            }
            else if (sli[j].typ === StreetItemType.NOUN) {
                if ((sli[0] === noun && ((noun.termin.canonic_text === "УЛИЦА" || noun.termin.canonic_text === "ВУЛИЦЯ")) && j > 0) && name === null) {
                    alt_noun = noun;
                    noun = sli[j];
                    rli.push(sli[j]);
                }
                else 
                    break;
            }
        }
        if (((n1 < i) && number === null && ((i + 1) < sli.length)) && sli[i + 1].typ === StreetItemType.NUMBER && sli[i + 1].number_has_prefix) {
            number = (sli[i + 1].number === null ? sli[i + 1].value : sli[i + 1].number.int_value.toString());
            rli.push(sli[i + 1]);
        }
        else if ((((i < n0) && ((name !== null || adj !== null)) && (j < sli.length)) && sli[j].typ === StreetItemType.NOUN && ((noun.termin.canonic_text === "УЛИЦА" || noun.termin.canonic_text === "ВУЛИЦЯ"))) && (((sli[j].termin.canonic_text === "ПЛОЩАДЬ" || sli[j].termin.canonic_text === "БУЛЬВАР" || sli[j].termin.canonic_text === "ПЛОЩА") || sli[j].termin.canonic_text === "МАЙДАН" || (j + 1) === sli.length))) {
            alt_noun = noun;
            noun = sli[j];
            rli.push(sli[j]);
        }
        if (name === null) {
            if (number === null && adj === null) 
                return null;
            if (noun.is_abridge) {
                if (is_micro_raion) {
                }
                else if (noun.termin !== null && ((noun.termin.canonic_text === "ПРОЕЗД" || noun.termin.canonic_text === "ПРОЇЗД"))) {
                }
                else if (adj === null || adj.is_abridge) 
                    return null;
            }
            if (adj !== null && adj.is_abridge) 
                return null;
        }
        if (!rli.includes(sli[i])) 
            rli.push(sli[i]);
        let street = new StreetReferent();
        if (!for_metro) {
            street.add_slot(StreetReferent.ATTR_TYP, noun.termin.canonic_text.toLowerCase(), false, 0);
            if (noun.alt_termin !== null) {
                if (noun.alt_termin.canonic_text === "ПРОСПЕКТ" && number !== null) {
                }
                else 
                    street.add_slot(StreetReferent.ATTR_TYP, noun.alt_termin.canonic_text.toLowerCase(), false, 0);
            }
        }
        else 
            street.add_slot(StreetReferent.ATTR_TYP, "метро", false, 0);
        let res = AddressItemToken._new83(AddressItemTokenItemType.STREET, rli[0].begin_token, rli[0].end_token, street);
        for (const r of rli) {
            if (res.begin_char > r.begin_char) 
                res.begin_token = r.begin_token;
            if (res.end_char < r.end_char) 
                res.end_token = r.end_token;
        }
        if (for_metro && rli.includes(noun) && noun.termin.canonic_text === "МЕТРО") 
            Utils.removeItem(rli, noun);
        if (noun.is_abridge && (noun.length_char < 4)) 
            res.is_doubt = true;
        else if (noun.noun_is_doubt_coef > 0) {
            res.is_doubt = true;
            if ((name !== null && name.end_char > noun.end_char && noun.chars.is_all_lower) && !name.chars.is_all_lower && !((name.begin_token instanceof ReferentToken))) {
                let npt2 = NounPhraseHelper.try_parse(name.begin_token, NounPhraseParseAttr.NO, 0, null);
                if (npt2 !== null && npt2.end_char > name.end_char) {
                }
                else if (AddressItemToken.check_house_after(res.end_token.next, false, false)) 
                    res.is_doubt = false;
                else if (name.chars.is_capital_upper && noun.noun_is_doubt_coef === 1) 
                    res.is_doubt = false;
            }
        }
        let name_base = new StringBuilder();
        let name_alt = new StringBuilder();
        let name_alt2 = null;
        let gen = noun.termin.gender;
        let adj_gen = MorphGender.UNDEFINED;
        if (number !== null) {
            street.number = number;
            if (sec_number !== null) 
                street.sec_number = sec_number;
        }
        if (age !== null) {
            if (street.number === null) 
                street.number = age;
            else 
                street.sec_number = age;
        }
        if (name !== null && name.value !== null) {
            if (street.kind === StreetKind.ROAD) {
                for (const r of rli) {
                    if (r.typ === StreetItemType.NAME && r !== name) {
                        name_alt.append(r.value);
                        break;
                    }
                }
            }
            if (name.alt_value !== null && name_alt.length === 0) 
                name_alt.append(name_base.toString()).append(" ").append(name.alt_value);
            name_base.append(" ").append(name.value);
        }
        else if (name !== null) {
            let is_adj = false;
            if (name.end_token instanceof TextToken) {
                for (const wf of name.end_token.morph.items) {
                    if ((wf instanceof MorphWordForm) && (wf).is_in_dictionary) {
                        is_adj = wf.class0.is_adjective | wf.class0.is_proper_geo;
                        adj_gen = wf.gender;
                        break;
                    }
                    else if (wf.class0.is_adjective | wf.class0.is_proper_geo) 
                        is_adj = true;
                }
            }
            if (is_adj) {
                let tmp = new StringBuilder();
                let vars = new Array();
                for (let t = name.begin_token; t !== null; t = t.next) {
                    let tt = Utils.as(t, TextToken);
                    if (tt === null) 
                        break;
                    if (tmp.length > 0) 
                        tmp.append(' ');
                    if (t === name.end_token) {
                        let is_padez = false;
                        if (!noun.is_abridge) {
                            if (!noun.morph._case.is_undefined && !noun.morph._case.is_nominative) 
                                is_padez = true;
                            else if (noun.termin.canonic_text === "ШОССЕ" || noun.termin.canonic_text === "ШОСЕ") 
                                is_padez = true;
                        }
                        if (res.begin_token.previous !== null && res.begin_token.previous.morph.class0.is_preposition) 
                            is_padez = true;
                        if (!is_padez) {
                            tmp.append(tt.term);
                            break;
                        }
                        for (const wf of tt.morph.items) {
                            if (((wf.class0.is_adjective || wf.class0.is_proper_geo)) && (((wf.gender.value()) & (gen.value()))) !== (MorphGender.UNDEFINED.value())) {
                                if (noun.morph._case.is_undefined || !(MorphCase.ooBitand(wf._case, noun.morph._case)).is_undefined) {
                                    let wff = Utils.as(wf, MorphWordForm);
                                    if (wff === null) 
                                        continue;
                                    if (gen === MorphGender.MASCULINE && wff.normal_case.includes("ОЙ")) 
                                        continue;
                                    if (!vars.includes(wff.normal_case)) 
                                        vars.push(wff.normal_case);
                                }
                            }
                        }
                        if (!vars.includes(tt.term) && sli.indexOf(name) > sli.indexOf(noun)) 
                            vars.push(tt.term);
                        if (vars.length === 0) 
                            vars.push(tt.term);
                        break;
                    }
                    if (!tt.is_hiphen) 
                        tmp.append(tt.term);
                }
                if (vars.length === 0) 
                    name_base.append(" ").append(tmp.toString());
                else {
                    let head = name_base.toString();
                    name_base.append(" ").append(tmp.toString()).append(vars[0]);
                    if (vars.length > 1) {
                        name_alt.length = 0;
                        name_alt.append(head).append(" ").append(tmp.toString()).append(vars[1]);
                    }
                    if (vars.length > 2) 
                        name_alt2 = (head + " " + tmp.toString() + vars[2]);
                }
            }
            else {
                let str_nam = null;
                let nits = new Array();
                let has_adj = false;
                let has_proper_name = false;
                for (let t = name.begin_token; t !== null; t = t.next) {
                    if (t.morph.class0.is_adjective || t.morph.class0.is_conjunction) 
                        has_adj = true;
                    if ((t instanceof TextToken) && !t.is_hiphen) {
                        if (name.termin !== null) {
                            nits.push(name.termin.canonic_text);
                            break;
                        }
                        else if (!t.chars.is_letter && nits.length > 0) 
                            nits[nits.length - 1] += (t).term;
                        else {
                            nits.push((t).term);
                            if (t === name.begin_token && t.get_morph_class_in_dictionary().is_proper_name) 
                                has_proper_name = true;
                        }
                    }
                    else if ((t instanceof ReferentToken) && name.termin === null) 
                        nits.push(t.get_source_text().toUpperCase());
                    if (t === name.end_token) 
                        break;
                }
                if (!has_adj && !has_proper_name) 
                    nits.sort();
                str_nam = nits.join(" ");
                if (has_proper_name && nits.length === 2) {
                    name_alt.length = 0;
                    name_alt.append(name_base.toString()).append(" ").append(nits[1]);
                }
                name_base.append(" ").append(str_nam);
            }
        }
        let adj_str = null;
        let adj_can_be_initial = false;
        if (adj !== null) {
            let s = null;
            if (adj_gen === MorphGender.UNDEFINED && name !== null && (((name.morph.number.value()) & (MorphNumber.PLURAL.value()))) === (MorphNumber.UNDEFINED.value())) {
                if (name.morph.gender === MorphGender.FEMINIE || name.morph.gender === MorphGender.MASCULINE || name.morph.gender === MorphGender.NEUTER) 
                    adj_gen = name.morph.gender;
            }
            if (name !== null && (((name.morph.number.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                s = Morphology.get_wordform(adj.termin.canonic_text, MorphBaseInfo._new211(MorphClass.ADJECTIVE, MorphNumber.PLURAL));
            else if (adj_gen !== MorphGender.UNDEFINED) 
                s = Morphology.get_wordform(adj.termin.canonic_text, MorphBaseInfo._new212(MorphClass.ADJECTIVE, adj_gen));
            else if ((((adj.morph.gender.value()) & (gen.value()))) === (MorphGender.UNDEFINED.value())) 
                s = Morphology.get_wordform(adj.termin.canonic_text, MorphBaseInfo._new212(MorphClass.ADJECTIVE, adj.morph.gender));
            else 
                s = Morphology.get_wordform(adj.termin.canonic_text, MorphBaseInfo._new212(MorphClass.ADJECTIVE, gen));
            adj_str = s;
            if (name !== null && (sli.indexOf(adj) < sli.indexOf(name))) {
                if (adj.end_token.is_char('.') && adj.length_char <= 3 && !adj.begin_token.chars.is_all_lower) 
                    adj_can_be_initial = true;
            }
        }
        let s1 = name_base.toString().trim();
        let s2 = name_alt.toString().trim();
        if (s1.length < 3) {
            if (street.number !== null) {
                if (adj_str !== null) {
                    if (adj.is_abridge) 
                        return null;
                    street.add_slot(StreetReferent.ATTR_NAME, adj_str, false, 0);
                }
            }
            else if (adj_str === null) {
                if (s1.length < 1) 
                    return null;
                if (is_micro_raion) {
                    street.add_slot(StreetReferent.ATTR_NAME, s1, false, 0);
                    if (!Utils.isNullOrEmpty(s2)) 
                        street.add_slot(StreetReferent.ATTR_NAME, s2, false, 0);
                }
                else 
                    return null;
            }
            else {
                if (adj.is_abridge) 
                    return null;
                street.add_slot(StreetReferent.ATTR_NAME, adj_str, false, 0);
            }
        }
        else if (adj_can_be_initial) {
            street.add_slot(StreetReferent.ATTR_NAME, s1, false, 0);
            street.add_slot(StreetReferent.ATTR_NAME, MiscHelper.get_text_value(adj.begin_token, name.end_token, GetTextAttr.NO), false, 0);
            street.add_slot(StreetReferent.ATTR_NAME, (adj_str + " " + s1), false, 0);
        }
        else if (adj_str === null) 
            street.add_slot(StreetReferent.ATTR_NAME, s1, false, 0);
        else 
            street.add_slot(StreetReferent.ATTR_NAME, (adj_str + " " + s1), false, 0);
        if (name_alt.length > 0) {
            s1 = name_alt.toString().trim();
            if (adj_str === null) 
                street.add_slot(StreetReferent.ATTR_NAME, s1, false, 0);
            else 
                street.add_slot(StreetReferent.ATTR_NAME, (adj_str + " " + s1), false, 0);
        }
        if (name_alt2 !== null) {
            if (adj_str === null) {
                if (for_metro && noun !== null) 
                    street.add_slot(StreetReferent.ATTR_NAME, (alt_noun.termin.canonic_text + " " + name_alt2.trim()), false, 0);
                else 
                    street.add_slot(StreetReferent.ATTR_NAME, name_alt2.trim(), false, 0);
            }
            else 
                street.add_slot(StreetReferent.ATTR_NAME, (adj_str + " " + name_alt2.trim()), false, 0);
        }
        if (name !== null && name.alt_value2 !== null) 
            street.add_slot(StreetReferent.ATTR_NAME, name.alt_value2, false, 0);
        if ((name !== null && adj === null && name.exist_street !== null) && !for_metro) {
            for (const n of name.exist_street.names) {
                street.add_slot(StreetReferent.ATTR_NAME, n, false, 0);
            }
        }
        if (alt_noun !== null && !for_metro) 
            street.add_slot(StreetReferent.ATTR_TYP, alt_noun.termin.canonic_text.toLowerCase(), false, 0);
        if (noun.termin.canonic_text === "ПЛОЩАДЬ" || noun.termin.canonic_text === "КВАРТАЛ" || noun.termin.canonic_text === "ПЛОЩА") {
            res.is_doubt = true;
            if (name !== null && name.is_in_dictionary) 
                res.is_doubt = false;
            else if (alt_noun !== null || for_metro) 
                res.is_doubt = false;
            else if (res.begin_token.previous === null || MiscLocationHelper.check_geo_object_before(res.begin_token.previous)) {
                if (res.end_token.next === null || AddressItemToken.check_house_after(res.end_token.next, false, true)) 
                    res.is_doubt = false;
            }
        }
        if (LanguageHelper.ends_with(noun.termin.canonic_text, "ГОРОДОК")) {
            for (const s of street.slots) {
                if (s.type_name === StreetReferent.ATTR_TYP) 
                    street.upload_slot(s, "микрорайон");
                else if (s.type_name === StreetReferent.ATTR_NAME) 
                    street.upload_slot(s, (noun.termin.canonic_text + " " + s.value));
            }
            if (street.find_slot(StreetReferent.ATTR_NAME, null, true) === null) 
                street.add_slot(StreetReferent.ATTR_NAME, noun.termin.canonic_text, false, 0);
        }
        let t1 = res.end_token.next;
        if (t1 !== null && t1.is_comma) 
            t1 = t1.next;
        let non = StreetItemToken.try_parse(t1, null, false, null, false);
        if (non !== null && non.typ === StreetItemType.NOUN && street.typs.length > 0) {
            if (AddressItemToken.check_house_after(non.end_token.next, false, true)) {
                street.correct();
                let nams = street.names;
                for (const t of street.typs) {
                    for (const n of nams) {
                        street.add_slot(StreetReferent.ATTR_NAME, (t.toUpperCase() + " " + n), false, 0);
                    }
                }
                street.add_slot(StreetReferent.ATTR_TYP, non.termin.canonic_text.toLowerCase(), false, 0);
                res.end_token = non.end_token;
            }
        }
        if (res.is_doubt) {
            if (noun.is_road) {
                if (street.number !== null && Utils.endsWithString(street.number, "КМ", true)) 
                    res.is_doubt = false;
                else if (AddressItemToken.check_km_after(res.end_token.next)) 
                    res.is_doubt = false;
                else if (AddressItemToken.check_km_before(res.begin_token.previous)) 
                    res.is_doubt = false;
            }
            else if (noun.termin.canonic_text === "ПРОЕЗД" && street.find_slot(StreetReferent.ATTR_NAME, "ПРОЕКТИРУЕМЫЙ", true) !== null) 
                res.is_doubt = false;
            for (let tt0 = res.begin_token.previous; tt0 !== null; tt0 = tt0.previous) {
                if (tt0.is_char_of(",,") || tt0.is_comma_and) 
                    continue;
                let str0 = Utils.as(tt0.get_referent(), StreetReferent);
                if (str0 !== null) 
                    res.is_doubt = false;
                break;
            }
        }
        if (noun.termin.canonic_text === "КВАРТАЛ" && (res.whitespaces_after_count < 2) && number === null) {
            let ait = AddressItemToken.try_parse(res.end_token.next, null, false, true, null);
            if (ait !== null && ait.typ === AddressItemTokenItemType.NUMBER && ait.value !== null) {
                street.add_slot(StreetReferent.ATTR_NUMBER, ait.value, false, 0);
                res.end_token = ait.end_token;
            }
        }
        return res;
    }
    
    static try_detect_non_noun(sli, onto_regim, for_metro) {
        if (sli.length > 1 && sli[sli.length - 1].typ === StreetItemType.NUMBER && !sli[sli.length - 1].number_has_prefix) 
            sli.splice(sli.length - 1, 1);
        let street = null;
        if (sli.length === 1 && sli[0].typ === StreetItemType.NAME && ((onto_regim || for_metro))) {
            let s = MiscHelper.get_text_value(sli[0].begin_token, sli[0].end_token, GetTextAttr.NO);
            if (s === null) 
                return null;
            if (!for_metro && !sli[0].is_in_dictionary && sli[0].exist_street === null) {
                let tt = sli[0].end_token.next;
                if (tt !== null && tt.is_comma) 
                    tt = tt.next;
                let ait1 = AddressItemToken.try_parse(tt, null, true, false, null);
                if (ait1 !== null && ((ait1.typ === AddressItemTokenItemType.NUMBER || ait1.typ === AddressItemTokenItemType.HOUSE))) {
                }
                else 
                    return null;
            }
            street = new StreetReferent();
            street.add_slot(StreetReferent.ATTR_TYP, (for_metro ? "метро" : ((sli[0].kit.base_language.is_ua ? "вулиця" : "улица"))), false, 0);
            street.add_slot(StreetReferent.ATTR_NAME, s, false, 0);
            let res0 = AddressItemToken._new86(AddressItemTokenItemType.STREET, sli[0].begin_token, sli[0].end_token, street, true);
            if (sli[0].is_in_brackets) 
                res0.is_doubt = false;
            return res0;
        }
        let i1 = 0;
        if (sli.length === 1 && ((sli[0].typ === StreetItemType.STDNAME || sli[0].typ === StreetItemType.NAME))) {
            if (!onto_regim) {
                let is_street_before = false;
                let tt = sli[0].begin_token.previous;
                if ((tt !== null && tt.is_comma_and && tt.previous !== null) && (tt.previous.get_referent() instanceof StreetReferent)) 
                    is_street_before = true;
                let cou = 0;
                for (tt = sli[0].end_token.next; tt !== null; tt = tt.next) {
                    if (!tt.is_comma_and || tt.next === null) 
                        break;
                    let sli2 = StreetItemToken.try_parse_list(tt.next, null, 10);
                    if (sli2 === null) 
                        break;
                    let noun = null;
                    let empty = true;
                    for (const si of sli2) {
                        if (si.typ === StreetItemType.NOUN) 
                            noun = si;
                        else if ((si.typ === StreetItemType.NAME || si.typ === StreetItemType.STDNAME || si.typ === StreetItemType.NUMBER) || si.typ === StreetItemType.STDADJECTIVE) 
                            empty = false;
                    }
                    if (empty) 
                        break;
                    if (noun === null) {
                        if (tt.is_and && !is_street_before) 
                            break;
                        if ((++cou) > 4) 
                            break;
                        tt = sli2[sli2.length - 1].end_token;
                        continue;
                    }
                    if (!tt.is_and && !is_street_before) 
                        break;
                    let tmp = new Array();
                    tmp.push(sli[0]);
                    tmp.push(noun);
                    let re = StreetDefineHelper.try_parse_street(tmp, false, for_metro);
                    if (re !== null) {
                        re.end_token = tmp[0].end_token;
                        return re;
                    }
                }
            }
        }
        else if (sli.length === 2 && ((sli[0].typ === StreetItemType.STDADJECTIVE || sli[0].typ === StreetItemType.NUMBER || sli[0].typ === StreetItemType.AGE)) && ((sli[1].typ === StreetItemType.STDNAME || sli[1].typ === StreetItemType.NAME))) 
            i1 = 1;
        else if (sli.length === 2 && ((sli[0].typ === StreetItemType.STDNAME || sli[0].typ === StreetItemType.NAME)) && sli[1].typ === StreetItemType.NUMBER) 
            i1 = 0;
        else 
            return null;
        let val = sli[i1].value;
        let alt_val = sli[i1].alt_value;
        if (val === null) {
            if (sli[i1].exist_street !== null) {
                let names = sli[i1].exist_street.names;
                if (names.length > 0) {
                    val = names[0];
                    if (names.length > 1) 
                        alt_val = names[1];
                }
            }
            else {
                let te = Utils.as(sli[i1].begin_token, TextToken);
                if (te !== null) {
                    for (const wf of te.morph.items) {
                        if (wf.class0.is_adjective && wf.gender === MorphGender.FEMINIE) {
                            val = (wf).normal_case;
                            break;
                        }
                    }
                }
                if (i1 > 0 && sli[0].typ === StreetItemType.AGE) 
                    val = MiscHelper.get_text_value_of_meta_token(sli[i1], GetTextAttr.NO);
            }
        }
        let very_doubt = false;
        if (val === null && sli.length === 1 && sli[0].chars.is_capital_upper) {
            very_doubt = true;
            let t0 = sli[0].begin_token.previous;
            if (t0 !== null && t0.is_char(',')) 
                t0 = t0.previous;
            if ((t0 instanceof ReferentToken) && (t0.get_referent() instanceof GeoReferent)) 
                val = MiscHelper.get_text_value(sli[0].begin_token, sli[0].end_token, GetTextAttr.NO);
        }
        if (val === null) 
            return null;
        let t = sli[sli.length - 1].end_token.next;
        if (t !== null && t.is_char(',')) 
            t = t.next;
        if (t === null || t.is_newline_before) 
            return null;
        let ok = false;
        let doubt = true;
        if (sli[i1].termin !== null && (StreetItemType.of(sli[i1].termin.tag)) === StreetItemType.FIX) {
            ok = true;
            doubt = false;
        }
        else if (((sli[i1].exist_street !== null || sli[0].exist_street !== null)) && sli[0].begin_token !== sli[i1].end_token) {
            ok = true;
            doubt = false;
            if (t.kit.process_referent("PERSON", sli[0].begin_token) !== null) {
                if (AddressItemToken.check_house_after(t, false, false)) {
                }
                else 
                    doubt = true;
            }
        }
        else if (AddressItemToken.check_house_after(t, false, false)) {
            if (t.previous !== null) {
                if (t.previous.is_value("АРЕНДА", "ОРЕНДА") || t.previous.is_value("СДАЧА", "ЗДАЧА") || t.previous.is_value("СЪЕМ", "ЗНІМАННЯ")) 
                    return null;
            }
            let vv = NounPhraseHelper.try_parse(t.previous, NounPhraseParseAttr.NO, 0, null);
            if (vv !== null && vv.end_char >= t.begin_char) 
                return null;
            ok = true;
        }
        else {
            let ait = AddressItemToken.try_parse(t, null, true, false, null);
            if (ait === null) 
                return null;
            if (ait.typ === AddressItemTokenItemType.HOUSE && ait.value !== null) 
                ok = true;
            else if (very_doubt) 
                return null;
            else if (((val === "ТАБЛИЦА" || val === "РИСУНОК" || val === "ДИАГРАММА") || val === "ТАБЛИЦЯ" || val === "МАЛЮНОК") || val === "ДІАГРАМА") 
                return null;
            else if (ait.typ === AddressItemTokenItemType.NUMBER && (ait.begin_token.whitespaces_before_count < 2)) {
                let nt = Utils.as(ait.begin_token, NumberToken);
                if ((nt === null || nt.int_value === null || nt.typ !== NumberSpellingType.DIGIT) || nt.morph.class0.is_adjective) 
                    return null;
                if (ait.end_token.next !== null && !ait.end_token.is_newline_after) {
                    let mc = ait.end_token.next.get_morph_class_in_dictionary();
                    if (mc.is_adjective || mc.is_noun) 
                        return null;
                }
                if (nt.int_value > 100) 
                    return null;
                let nex = NumberHelper.try_parse_number_with_postfix(ait.begin_token);
                if (nex !== null) 
                    return null;
                for (t = sli[0].begin_token.previous; t !== null; t = t.previous) {
                    if (t.is_newline_after) 
                        break;
                    if (t.get_referent() instanceof GeoReferent) {
                        ok = true;
                        break;
                    }
                    if (t.is_char(',')) 
                        continue;
                    if (t.is_char('.')) 
                        break;
                    let ait0 = AddressItemToken.try_parse(t, null, false, true, null);
                    if (ait !== null) {
                        if (ait.typ === AddressItemTokenItemType.PREFIX) {
                            ok = true;
                            break;
                        }
                    }
                    if (t.chars.is_letter) 
                        break;
                }
            }
        }
        if (!ok) 
            return null;
        let ooo = AddressItemToken.try_attach_org(sli[0].begin_token);
        if (ooo === null && sli.length > 1) 
            ooo = AddressItemToken.try_attach_org(sli[1].begin_token);
        if (ooo !== null) 
            return null;
        street = new StreetReferent();
        street.add_slot(StreetReferent.ATTR_TYP, (sli[0].kit.base_language.is_ua ? "вулиця" : "улица"), false, 0);
        if (sli.length > 1) {
            if (sli[0].typ === StreetItemType.NUMBER || sli[0].typ === StreetItemType.AGE) 
                street.number = (sli[0].number === null ? sli[0].value : sli[0].number.int_value.toString());
            else if (sli[1].typ === StreetItemType.NUMBER || sli[1].typ === StreetItemType.AGE) 
                street.number = (sli[1].number === null ? sli[1].value : sli[1].number.int_value.toString());
            else {
                let adjs = MiscLocationHelper.get_std_adj_full(sli[0].begin_token, sli[1].morph.gender, sli[1].morph.number, true);
                if (adjs === null) 
                    adjs = MiscLocationHelper.get_std_adj_full(sli[0].begin_token, MorphGender.FEMINIE, MorphNumber.SINGULAR, false);
                if (adjs !== null) {
                    if (adjs.length > 1) 
                        alt_val = (adjs[1] + " " + val);
                    val = (adjs[0] + " " + val);
                }
            }
        }
        street.add_slot(StreetReferent.ATTR_NAME, val, false, 0);
        if (alt_val !== null) 
            street.add_slot(StreetReferent.ATTR_NAME, alt_val, false, 0);
        return AddressItemToken._new86(AddressItemTokenItemType.STREET, sli[0].begin_token, sli[sli.length - 1].end_token, street, doubt);
    }
    
    static _try_parse_fix(sits) {
        if ((sits.length < 1) || sits[0].termin === null) 
            return null;
        if (sits[0].termin.acronym === "МКАД") {
            let str = new StreetReferent();
            str.add_slot(StreetReferent.ATTR_TYP, "автодорога", false, 0);
            str.add_slot(StreetReferent.ATTR_NAME, "МОСКОВСКАЯ КОЛЬЦЕВАЯ", false, 0);
            let t0 = sits[0].begin_token;
            let t1 = sits[0].end_token;
            if (sits.length > 1 && sits[1].typ === StreetItemType.NUMBER) {
                let num = (sits[1].number === null ? sits[1].value : sits[1].number.int_value.toString());
                if (t0.previous !== null && ((t0.previous.is_value("КИЛОМЕТР", null) || t0.previous.is_value("КМ", null)))) {
                    t0 = t0.previous;
                    str.add_slot(StreetReferent.ATTR_NUMBER, num + "км", false, 0);
                    t1 = sits[1].end_token;
                }
                else if (sits[1].is_number_km) {
                    str.add_slot(StreetReferent.ATTR_NUMBER, num + "км", false, 0);
                    t1 = sits[1].end_token;
                }
            }
            return AddressItemToken._new83(AddressItemTokenItemType.STREET, t0, t1, str);
        }
        if (MiscLocationHelper.check_geo_object_before(sits[0].begin_token) || AddressItemToken.check_house_after(sits[0].end_token.next, false, true)) {
            let str = new StreetReferent();
            str.add_slot(StreetReferent.ATTR_TYP, "улица", false, 0);
            str.add_slot(StreetReferent.ATTR_NAME, sits[0].termin.canonic_text, false, 0);
            return AddressItemToken._new83(AddressItemTokenItemType.STREET, sits[0].begin_token, sits[0].end_token, str);
        }
        return null;
    }
    
    static try_parse_second_street(t1, t2, loc_streets) {
        let sli = StreetItemToken.try_parse_list(t1, loc_streets, 10);
        if (sli === null || (sli.length < 1) || sli[0].typ !== StreetItemType.NOUN) 
            return null;
        let sli2 = StreetItemToken.try_parse_list(t2, loc_streets, 10);
        if (sli2 === null || sli2.length === 0) 
            return null;
        sli2.splice(0, 0, sli[0]);
        let res = StreetDefineHelper.try_parse_street(sli2, true, false);
        if (res === null) 
            return null;
        res.begin_token = sli2[1].begin_token;
        return res;
    }
}


module.exports = StreetDefineHelper