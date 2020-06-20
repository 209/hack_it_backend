/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const ReferentToken = require("./../../ReferentToken");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const MorphNumber = require("./../../../morph/MorphNumber");
const MorphGender = require("./../../../morph/MorphGender");
const CharsInfo = require("./../../../morph/CharsInfo");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const TerrItemToken = require("./TerrItemToken");
const DateReferent = require("./../../date/DateReferent");
const NumberSpellingType = require("./../../NumberSpellingType");
const Token = require("./../../Token");
const CityItemToken = require("./CityItemToken");
const MorphClass = require("./../../../morph/MorphClass");
const GeoOwnerHelper = require("./GeoOwnerHelper");
const TextToken = require("./../../TextToken");
const NumberToken = require("./../../NumberToken");
const MiscHelper = require("./../../core/MiscHelper");
const BracketHelper = require("./../../core/BracketHelper");
const AddressItemTokenItemType = require("./../../address/internal/AddressItemTokenItemType");
const StreetItemType = require("./../../address/internal/StreetItemType");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const GeoReferent = require("./../GeoReferent");
const CityItemTokenItemType = require("./CityItemTokenItemType");
const MiscLocationHelper = require("./MiscLocationHelper");
const AddressItemToken = require("./../../address/internal/AddressItemToken");
const StreetItemToken = require("./../../address/internal/StreetItemToken");
const ProperNameHelper = require("./../../core/ProperNameHelper");
const Referent = require("./../../Referent");
const StreetDefineHelper = require("./../../address/internal/StreetDefineHelper");

class CityAttachHelper {
    
    static try_attach_city(li, ad, always = false) {
        if (li === null) 
            return null;
        let oi = null;
        if (li.length > 2 && li[0].typ === CityItemTokenItemType.MISC && li[1].typ === CityItemTokenItemType.NOUN) {
            li[1].doubtful = false;
            li.splice(0, 1);
        }
        let res = null;
        if (res === null && li.length > 1) {
            res = CityAttachHelper.try4(li);
            if (res !== null && res.end_char <= li[1].end_char) 
                res = null;
        }
        if (res === null) {
            let wrapoi1123 = new RefOutArgWrapper();
            res = CityAttachHelper.try1(li, wrapoi1123, ad);
            oi = wrapoi1123.value;
        }
        if (res === null) {
            let wrapoi1124 = new RefOutArgWrapper();
            res = CityAttachHelper._try_noun_name(li, wrapoi1124, false);
            oi = wrapoi1124.value;
        }
        if (res === null) {
            let wrapoi1125 = new RefOutArgWrapper();
            res = CityAttachHelper._try_name_exist(li, wrapoi1125, false);
            oi = wrapoi1125.value;
        }
        if (res === null) 
            res = CityAttachHelper.try4(li);
        if (res === null && always) {
            let wrapoi1126 = new RefOutArgWrapper();
            res = CityAttachHelper._try_noun_name(li, wrapoi1126, true);
            oi = wrapoi1126.value;
        }
        if (res === null && always) {
            if (AddressItemToken.try_attach_org(li[0].begin_token) !== null) {
            }
            else {
                let wrapoi1127 = new RefOutArgWrapper();
                res = CityAttachHelper._try_name_exist(li, wrapoi1127, true);
                oi = wrapoi1127.value;
            }
        }
        if (res === null) 
            return null;
        if (res !== null && res.morph !== null) {
        }
        if (res.begin_token.previous !== null) {
            if (res.begin_token.previous.is_value("ТЕРРИТОРИЯ", null)) 
                res.begin_token = res.begin_token.previous;
            if ((BracketHelper.can_be_start_of_sequence(res.begin_token.previous, false, false) && BracketHelper.can_be_end_of_sequence(res.end_token.next, false, null, false) && res.begin_token.previous.previous !== null) && res.begin_token.previous.previous.is_value("ТЕРРИТОРИЯ", null)) {
                res.begin_token = res.begin_token.previous.previous;
                res.end_token = res.end_token.next;
            }
        }
        return res;
    }
    
    static try1(li, oi, ad) {
        oi.value = null;
        if (li === null || (li.length < 1)) 
            return null;
        else if (li[0].typ !== CityItemTokenItemType.CITY) {
            if (li.length !== 2 || li[0].typ !== CityItemTokenItemType.PROPERNAME || li[1].typ !== CityItemTokenItemType.NOUN) 
                return null;
        }
        let i = 1;
        oi.value = li[0].onto_item;
        let ok = !li[0].doubtful;
        if ((ok && li[0].onto_item !== null && li[0].onto_item.misc_attr === null) && ad !== null) {
            if (li[0].onto_item.owner !== ad.local_ontology && !li[0].onto_item.owner.is_ext_ontology) {
                if (li[0].begin_token.previous !== null && li[0].begin_token.previous.is_value("В", null)) {
                }
                else 
                    ok = false;
            }
        }
        if (li.length === 1 && li[0].begin_token.morph.class0.is_adjective) {
            let sits = StreetItemToken.try_parse_list(li[0].begin_token, null, 3);
            if (sits !== null && sits.length === 2 && sits[1].typ === StreetItemType.NOUN) 
                return null;
        }
        let typ = null;
        let alttyp = null;
        let mc = li[0].morph;
        if (i < li.length) {
            if (li[i].typ === CityItemTokenItemType.NOUN) {
                let at = null;
                if (!li[i].chars.is_all_lower && (li[i].whitespaces_after_count < 2)) {
                    let sit = StreetItemToken.try_parse(li[i].end_token.next, null, false, null, false);
                    if (sit !== null && sit.typ === StreetItemType.NOUN) {
                        at = AddressItemToken.try_parse(li[i].begin_token, null, false, false, null);
                        if (at !== null) {
                            let at2 = AddressItemToken.try_parse(li[i].end_token.next, null, false, false, null);
                            if (at2 !== null && at2.typ === AddressItemTokenItemType.STREET) 
                                at = null;
                        }
                    }
                }
                if (at === null) {
                    typ = li[i].value;
                    alttyp = li[i].alt_value;
                    if (li[i].begin_token.is_value("СТ", null) && li[i].begin_token.chars.is_all_upper) 
                        return null;
                    if ((i + 1) === li.length) {
                        ok = true;
                        if (!li[i].morph._case.is_undefined) 
                            mc = li[i].morph;
                        i++;
                    }
                    else if (ok) 
                        i++;
                    else {
                        let tt0 = li[0].begin_token.previous;
                        if ((tt0 instanceof TextToken) && (tt0.whitespaces_after_count < 3)) {
                            if (tt0.is_value("МЭР", "МЕР") || tt0.is_value("ГЛАВА", null) || tt0.is_value("ГРАДОНАЧАЛЬНИК", null)) {
                                ok = true;
                                i++;
                            }
                        }
                    }
                }
            }
        }
        if (!ok && oi.value !== null && (oi.value.canonic_text.length < 4)) 
            return null;
        if (!ok && li[0].begin_token.morph.class0.is_proper_name) 
            return null;
        if (!ok) {
            if (!MiscHelper.is_exists_in_dictionary(li[0].begin_token, li[0].end_token, MorphClass.ooBitor(MorphClass.ADJECTIVE, MorphClass.ooBitor(MorphClass.NOUN, MorphClass.PRONOUN)))) {
                ok = li[0].geo_object_before || li[i - 1].geo_object_after;
                if (ok && li[0].begin_token === li[0].end_token) {
                    let mcc = li[0].begin_token.get_morph_class_in_dictionary();
                    if (mcc.is_proper_name || mcc.is_proper_surname) 
                        ok = false;
                    else if (li[0].geo_object_before && (li[0].whitespaces_after_count < 2)) {
                        let ad1 = AddressItemToken.try_parse(li[0].begin_token, null, false, false, null);
                        if (ad1 !== null && ad1.typ === AddressItemTokenItemType.STREET) {
                            let ad2 = AddressItemToken.try_parse(li[0].end_token.next, null, false, false, null);
                            if (ad2 === null || ad2.typ !== AddressItemTokenItemType.STREET) 
                                ok = false;
                        }
                        else if (AddressItemToken.try_attach_org(li[0].begin_token) !== null) 
                            ok = false;
                    }
                }
            }
            if (ok) {
                if (li[0].kit.process_referent("PERSON", li[0].begin_token) !== null) 
                    ok = false;
            }
        }
        if (!ok) 
            ok = CityAttachHelper.check_year_after(li[0].end_token.next);
        if (!ok && ((!li[0].begin_token.morph.class0.is_adjective || li[0].begin_token !== li[0].end_token))) 
            ok = CityAttachHelper.check_city_after(li[0].end_token.next);
        if (!ok) 
            return null;
        if (i < li.length) 
            li.splice(i, li.length - i);
        let rt = null;
        if (oi.value === null) {
            if (li[0].value !== null && li[0].higher_geo !== null) {
                let cap = new GeoReferent();
                cap.add_name(li[0].value);
                cap.add_typ_city(li[0].kit.base_language);
                cap.higher = li[0].higher_geo;
                if (typ !== null) 
                    cap.add_typ(typ);
                if (alttyp !== null) 
                    cap.add_typ(alttyp);
                rt = new ReferentToken(cap, li[0].begin_token, li[0].end_token);
            }
            else {
                if (li[0].value === null) 
                    return null;
                if (typ === null) {
                    if ((li.length === 1 && li[0].begin_token.previous !== null && li[0].begin_token.previous.is_hiphen) && (li[0].begin_token.previous.previous instanceof ReferentToken) && (li[0].begin_token.previous.previous.get_referent() instanceof GeoReferent)) {
                    }
                    else 
                        return null;
                }
                else {
                    if (!LanguageHelper.ends_with_ex(typ, "ПУНКТ", "ПОСЕЛЕНИЕ", "ПОСЕЛЕННЯ", "ПОСЕЛОК")) {
                        if (!LanguageHelper.ends_with(typ, "CITY")) {
                            if (typ === "СТАНЦИЯ" && ((MiscLocationHelper.check_geo_object_before(li[0].begin_token)))) {
                            }
                            else if (li.length > 1 && li[1].typ === CityItemTokenItemType.NOUN && li[0].typ === CityItemTokenItemType.CITY) {
                            }
                            else if ((li.length === 2 && li[1].typ === CityItemTokenItemType.NOUN && li[0].typ === CityItemTokenItemType.PROPERNAME) && ((li[0].geo_object_before || li[1].geo_object_after))) {
                            }
                            else 
                                return null;
                        }
                    }
                    if (li[0].begin_token.morph.class0.is_adjective) 
                        li[0].value = ProperNameHelper.get_name_ex(li[0].begin_token, li[0].end_token, MorphClass.ADJECTIVE, li[1].morph._case, li[1].morph.gender, false, false);
                }
            }
        }
        else if (oi.value.referent instanceof GeoReferent) {
            let city = Utils.as(oi.value.referent.clone(), GeoReferent);
            city.occurrence.splice(0, city.occurrence.length);
            rt = ReferentToken._new743(city, li[0].begin_token, li[li.length - 1].end_token, mc);
        }
        else if (typ === null) 
            typ = oi.value.typ;
        if (rt === null) {
            let city = new GeoReferent();
            city.add_name((oi.value === null ? li[0].value : oi.value.canonic_text));
            if (typ !== null) 
                city.add_typ(typ);
            else 
                city.add_typ_city(li[0].kit.base_language);
            if (alttyp !== null) 
                city.add_typ(alttyp);
            rt = ReferentToken._new743(city, li[0].begin_token, li[li.length - 1].end_token, mc);
        }
        if ((rt.referent instanceof GeoReferent) && li.length === 1 && (rt.referent).is_city) {
            if (rt.begin_token.previous !== null && rt.begin_token.previous.is_value("Г", null)) 
                rt.begin_token = rt.begin_token.previous;
            else if ((rt.begin_token.previous !== null && rt.begin_token.previous.is_char('.') && rt.begin_token.previous.previous !== null) && rt.begin_token.previous.previous.is_value("Г", null)) 
                rt.begin_token = rt.begin_token.previous.previous;
            else if (rt.end_token.next !== null && (rt.whitespaces_after_count < 2) && rt.end_token.next.is_value("Г", null)) {
                rt.end_token = rt.end_token.next;
                if (rt.end_token.next !== null && rt.end_token.next.is_char('.')) 
                    rt.end_token = rt.end_token.next;
            }
        }
        return rt;
    }
    
    static _try_noun_name(li, oi, always) {
        oi.value = null;
        if (li === null || (li.length < 2) || ((li[0].typ !== CityItemTokenItemType.NOUN && li[0].typ !== CityItemTokenItemType.MISC))) 
            return null;
        let ok = !li[0].doubtful;
        if (ok && li[0].typ === CityItemTokenItemType.MISC) 
            ok = false;
        let typ = (li[0].typ === CityItemTokenItemType.MISC ? null : li[0].value);
        let typ2 = (li[0].typ === CityItemTokenItemType.MISC ? null : li[0].alt_value);
        let prob_adj = null;
        let i1 = 1;
        let org = null;
        if ((typ !== null && li[i1].typ === CityItemTokenItemType.NOUN && ((i1 + 1) < li.length)) && li[0].whitespaces_after_count <= 1 && (((LanguageHelper.ends_with(typ, "ПОСЕЛОК") || LanguageHelper.ends_with(typ, "СЕЛИЩЕ") || typ === "ДЕРЕВНЯ") || typ === "СЕЛО"))) {
            if (li[i1].begin_token === li[i1].end_token) {
                let ooo = AddressItemToken.try_attach_org(li[i1].begin_token);
                if (ooo !== null && ooo.ref_token !== null) 
                    return null;
            }
            typ2 = li[i1].value;
            if (typ2 === "СТАНЦИЯ" && li[i1].begin_token.is_value("СТ", null) && ((i1 + 1) < li.length)) {
                let m = li[i1 + 1].morph;
                if (m.number === MorphNumber.PLURAL) 
                    prob_adj = "СТАРЫЕ";
                else if (m.gender === MorphGender.FEMINIE) 
                    prob_adj = "СТАРАЯ";
                else if (m.gender === MorphGender.MASCULINE) 
                    prob_adj = "СТАРЫЙ";
                else 
                    prob_adj = "СТАРОЕ";
            }
            i1++;
        }
        let name = (li[i1].value != null ? li[i1].value : (((li[i1].onto_item === null ? null : li[i1].onto_item.canonic_text))));
        let alt_name = li[i1].alt_value;
        if (name === null) 
            return null;
        let mc = li[0].morph;
        if (i1 === 1 && li[i1].typ === CityItemTokenItemType.CITY && ((li[0].value === "ГОРОД" || li[0].value === "МІСТО" || li[0].typ === CityItemTokenItemType.MISC))) {
            if (typ === null && ((i1 + 1) < li.length) && li[i1 + 1].typ === CityItemTokenItemType.NOUN) 
                return null;
            oi.value = li[i1].onto_item;
            if (oi.value !== null) 
                name = oi.value.canonic_text;
            if (name.length > 2 || oi.value.misc_attr !== null) {
                if (!li[1].doubtful || ((oi.value !== null && oi.value.misc_attr !== null))) 
                    ok = true;
                else if (!ok && !li[1].is_newline_before) {
                    if (li[0].geo_object_before || li[1].geo_object_after) 
                        ok = true;
                    else if (StreetDefineHelper.check_street_after(li[1].end_token.next)) 
                        ok = true;
                    else if (li[1].end_token.next !== null && (li[1].end_token.next.get_referent() instanceof DateReferent)) 
                        ok = true;
                    else if ((li[1].whitespaces_before_count < 2) && li[1].onto_item !== null) {
                        if (li[1].is_newline_after) 
                            ok = true;
                    }
                }
                if (li[1].doubtful && li[1].end_token.next !== null && CharsInfo.ooEq(li[1].end_token.chars, li[1].end_token.next.chars)) 
                    ok = false;
                if (li[0].begin_token.previous !== null && li[0].begin_token.previous.is_value("В", null)) 
                    ok = true;
            }
            if (!ok) 
                ok = CityAttachHelper.check_year_after(li[1].end_token.next);
            if (!ok) 
                ok = CityAttachHelper.check_city_after(li[1].end_token.next);
        }
        else if ((li[i1].typ === CityItemTokenItemType.PROPERNAME || li[i1].typ === CityItemTokenItemType.CITY)) {
            if (((li[0].value === "АДМИНИСТРАЦИЯ" || li[0].value === "АДМІНІСТРАЦІЯ")) && i1 === 1) 
                return null;
            if (li[i1].is_newline_before) {
                if (li.length !== 2) 
                    return null;
            }
            if (!li[0].doubtful) {
                ok = true;
                if (name.length < 2) 
                    ok = false;
                else if ((name.length < 3) && li[0].morph.number !== MorphNumber.SINGULAR) 
                    ok = false;
                if (li[i1].doubtful && !li[i1].geo_object_after && !li[0].geo_object_before) {
                    if (li[i1].morph._case.is_genitive) {
                        if (li[i1].end_token.next === null || MiscLocationHelper.check_geo_object_after(li[i1].end_token.next, false) || AddressItemToken.check_house_after(li[i1].end_token.next, false, true)) {
                        }
                        else if (li[0].begin_token.previous === null || MiscLocationHelper.check_geo_object_before(li[0].begin_token)) {
                        }
                        else 
                            ok = false;
                    }
                    if (ok) {
                        let rt0 = li[i1].kit.process_referent("PERSONPROPERTY", li[0].begin_token.previous);
                        if (rt0 !== null) {
                            let rt1 = li[i1].kit.process_referent("PERSON", li[i1].begin_token);
                            if (rt1 !== null) 
                                ok = false;
                        }
                    }
                }
                let npt = NounPhraseHelper.try_parse(li[i1].begin_token, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null) {
                    if (npt.end_token.end_char > li[i1].end_char && npt.adjectives.length > 0 && !npt.adjectives[0].end_token.next.is_comma) 
                        ok = false;
                    else if (TerrItemToken.m_unknown_regions.try_parse(npt.end_token, TerminParseAttr.FULLWORDSONLY) !== null) {
                        let ok1 = false;
                        if (li[0].begin_token.previous !== null) {
                            let ttt = li[0].begin_token.previous;
                            if (ttt.is_comma && ttt.previous !== null) 
                                ttt = ttt.previous;
                            let _geo = Utils.as(ttt.get_referent(), GeoReferent);
                            if (_geo !== null && !_geo.is_city) 
                                ok1 = true;
                        }
                        if (npt.end_token.next !== null) {
                            let ttt = npt.end_token.next;
                            if (ttt.is_comma && ttt.next !== null) 
                                ttt = ttt.next;
                            let _geo = Utils.as(ttt.get_referent(), GeoReferent);
                            if (_geo !== null && !_geo.is_city) 
                                ok1 = true;
                        }
                        if (!ok1) 
                            return null;
                    }
                }
                if (li[0].value === "ПОРТ") {
                    if (li[i1].chars.is_all_upper || li[i1].chars.is_latin_letter) 
                        return null;
                }
            }
            else if (li[0].geo_object_before) 
                ok = true;
            else if (li[i1].geo_object_after && !li[i1].is_newline_after) 
                ok = true;
            else 
                ok = CityAttachHelper.check_year_after(li[i1].end_token.next);
            if (!ok) 
                ok = CityAttachHelper.check_street_after(li[i1].end_token.next);
            if (!ok && li[0].begin_token.previous !== null && li[0].begin_token.previous.is_value("В", null)) 
                ok = true;
        }
        else 
            return null;
        if (!ok && !always) {
            if (MiscLocationHelper.check_near_before(li[0].begin_token.previous) === null) 
                return null;
        }
        if (li.length > (i1 + 1)) 
            li.splice(i1 + 1, li.length - i1 - 1);
        let city = new GeoReferent();
        if (oi.value !== null && oi.value.referent !== null) {
            city = Utils.as(oi.value.referent.clone(), GeoReferent);
            city.occurrence.splice(0, city.occurrence.length);
        }
        if (!li[0].morph._case.is_undefined && li[0].morph.gender !== MorphGender.UNDEFINED) {
            if (li[i1].end_token.morph.class0.is_adjective && li[i1].begin_token === li[i1].end_token) {
                let nam = ProperNameHelper.get_name_ex(li[i1].begin_token, li[i1].end_token, MorphClass.ADJECTIVE, li[0].morph._case, li[0].morph.gender, false, false);
                if (nam !== null && nam !== name) 
                    name = nam;
            }
        }
        if (li[0].morph._case.is_nominative) {
            if (alt_name !== null) 
                city.add_name(alt_name);
            alt_name = null;
        }
        city.add_name(name);
        if (prob_adj !== null) 
            city.add_name(prob_adj + " " + name);
        if (alt_name !== null) {
            city.add_name(alt_name);
            if (prob_adj !== null) 
                city.add_name(prob_adj + " " + alt_name);
        }
        if (typ !== null) 
            city.add_typ(typ);
        else if (!city.is_city) 
            city.add_typ_city(li[0].kit.base_language);
        if (typ2 !== null) 
            city.add_typ(typ2.toLowerCase());
        if (li[0].higher_geo !== null && GeoOwnerHelper.can_be_higher(li[0].higher_geo, city)) 
            city.higher = li[0].higher_geo;
        if (li[0].typ === CityItemTokenItemType.MISC) 
            li.splice(0, 1);
        let res = ReferentToken._new743(city, li[0].begin_token, li[li.length - 1].end_token, mc);
        if (res.end_token.next !== null && res.end_token.next.is_hiphen && (res.end_token.next.next instanceof NumberToken)) {
            let num = Utils.as(res.end_token.next.next, NumberToken);
            if ((num.typ === NumberSpellingType.DIGIT && !num.morph.class0.is_adjective && num.int_value !== null) && (num.int_value < 50)) {
                for (const s of city.slots) {
                    if (s.type_name === GeoReferent.ATTR_NAME) 
                        city.upload_slot(s, (String(s.value) + "-" + num.value));
                }
                res.end_token = num;
            }
        }
        if (li[0].begin_token === li[0].end_token && li[0].begin_token.is_value("ГОРОДОК", null)) {
            if (AddressItemToken.check_house_after(res.end_token.next, true, false)) 
                return null;
        }
        return res;
    }
    
    /**
     * Это проверяем некоторые частные случаи
     * @param li 
     * @param oi 
     * @return 
     */
    static _try_name_exist(li, oi, always) {
        oi.value = null;
        if (li === null || li[0].typ !== CityItemTokenItemType.CITY) 
            return null;
        oi.value = li[0].onto_item;
        let tt = Utils.as(li[0].begin_token, TextToken);
        if (tt === null) 
            return null;
        let ok = false;
        let nam = (oi.value === null ? li[0].value : oi.value.canonic_text);
        if (nam === null) 
            return null;
        if (nam === "РИМ") {
            if (tt.term === "РИМ") {
                if ((tt.next instanceof TextToken) && tt.next.get_morph_class_in_dictionary().is_proper_secname) {
                }
                else 
                    ok = true;
            }
            else if (tt.previous !== null && tt.previous.is_value("В", null) && tt.term === "РИМЕ") 
                ok = true;
        }
        else if (oi.value !== null && oi.value.referent !== null && oi.value.owner.is_ext_ontology) 
            ok = true;
        else if (nam.endsWith("ГРАД") || nam.endsWith("СК")) 
            ok = true;
        else if (nam.endsWith("TOWN") || nam.startsWith("SAN")) 
            ok = true;
        else if (li[0].chars.is_latin_letter && li[0].begin_token.previous !== null && ((li[0].begin_token.previous.is_value("IN", null) || li[0].begin_token.previous.is_value("FROM", null)))) 
            ok = true;
        else {
            for (let tt2 = li[0].end_token.next; tt2 !== null; tt2 = tt2.next) {
                if (tt2.is_newline_before) 
                    break;
                if ((tt2.is_char_of(",(") || tt2.morph.class0.is_preposition || tt2.morph.class0.is_conjunction) || tt2.morph.class0.is_misc) 
                    continue;
                if ((tt2.get_referent() instanceof GeoReferent) && tt2.chars.is_cyrillic_letter === li[0].chars.is_cyrillic_letter) 
                    ok = true;
                break;
            }
            if (!ok) {
                for (let tt2 = li[0].begin_token.previous; tt2 !== null; tt2 = tt2.previous) {
                    if (tt2.is_newline_after) 
                        break;
                    if ((tt2.is_char_of(",)") || tt2.morph.class0.is_preposition || tt2.morph.class0.is_conjunction) || tt2.morph.class0.is_misc) 
                        continue;
                    if ((tt2.get_referent() instanceof GeoReferent) && tt2.chars.is_cyrillic_letter === li[0].chars.is_cyrillic_letter) 
                        ok = true;
                    if (ok) {
                        let sits = StreetItemToken.try_parse_list(li[0].begin_token, null, 10);
                        if (sits !== null && sits.length > 1) {
                            let ss = StreetDefineHelper.try_parse_street(sits, false, false);
                            if (ss !== null) {
                                sits.splice(0, 1);
                                if (StreetDefineHelper.try_parse_street(sits, false, false) === null) 
                                    ok = false;
                            }
                        }
                    }
                    if (ok) {
                        if (li.length > 1 && li[1].typ === CityItemTokenItemType.PROPERNAME && (li[1].whitespaces_before_count < 3)) 
                            ok = false;
                        else {
                            let mc = li[0].begin_token.get_morph_class_in_dictionary();
                            if (mc.is_proper_name || mc.is_proper_surname || mc.is_adjective) 
                                ok = false;
                            else {
                                let npt = NounPhraseHelper.try_parse(li[0].begin_token, NounPhraseParseAttr.NO, 0, null);
                                if (npt !== null && npt.end_char > li[0].end_char) 
                                    ok = false;
                            }
                        }
                    }
                    if (AddressItemToken.try_attach_org(li[0].begin_token) !== null) {
                        ok = false;
                        break;
                    }
                    break;
                }
            }
        }
        if (always) {
            if (li[0].whitespaces_before_count > 3 && li[0].doubtful && li[0].begin_token.get_morph_class_in_dictionary().is_proper_surname) {
                let pp = li[0].kit.process_referent("PERSON", li[0].begin_token);
                if (pp !== null) 
                    always = false;
            }
        }
        if (li[0].begin_token.chars.is_latin_letter && li[0].begin_token === li[0].end_token) {
            let tt1 = li[0].end_token.next;
            if (tt1 !== null && tt1.is_char(',')) 
                tt1 = tt1.next;
            if (((tt1 instanceof TextToken) && tt1.chars.is_latin_letter && (tt1.length_char < 3)) && !tt1.chars.is_all_lower) 
                ok = false;
        }
        if (!ok && !always) 
            return null;
        let city = null;
        if (oi.value !== null && (oi.value.referent instanceof GeoReferent) && !oi.value.owner.is_ext_ontology) {
            city = Utils.as(oi.value.referent.clone(), GeoReferent);
            city.occurrence.splice(0, city.occurrence.length);
        }
        else {
            city = new GeoReferent();
            city.add_name(nam);
            if (oi.value !== null && (oi.value.referent instanceof GeoReferent)) 
                city.merge_slots2(Utils.as(oi.value.referent, GeoReferent), li[0].kit.base_language);
            if (!city.is_city) 
                city.add_typ_city(li[0].kit.base_language);
        }
        return ReferentToken._new743(city, li[0].begin_token, li[0].end_token, li[0].morph);
    }
    
    static try4(li) {
        if ((li.length > 0 && li[0].typ === CityItemTokenItemType.NOUN && ((li[0].value !== "ГОРОД" && li[0].value !== "МІСТО" && li[0].value !== "CITY"))) && ((!li[0].doubtful || li[0].geo_object_before))) {
            if (li.length > 1 && li[1].org_ref !== null) {
                let _geo = new GeoReferent();
                _geo.add_typ(li[0].value);
                _geo.add_org_referent(li[1].org_ref.referent);
                _geo.add_ext_referent(li[1].org_ref);
                return new ReferentToken(_geo, li[0].begin_token, li[1].end_token);
            }
            else {
                let aid = AddressItemToken.try_attach_org(li[0].end_token.next);
                if (aid !== null) {
                    let _geo = new GeoReferent();
                    _geo.add_typ(li[0].value);
                    _geo.add_org_referent(aid.referent);
                    _geo.add_ext_referent(aid.ref_token);
                    return new ReferentToken(_geo, li[0].begin_token, aid.end_token);
                }
            }
        }
        return null;
    }
    
    static check_year_after(tt) {
        if (tt !== null && ((tt.is_comma || tt.is_hiphen))) 
            tt = tt.next;
        if (tt !== null && tt.is_newline_after) {
            if ((tt instanceof NumberToken) && (tt).int_value !== null) {
                let year = (tt).int_value;
                if (year > 1990 && (year < 2100)) 
                    return true;
            }
            else if (tt.get_referent() !== null && tt.get_referent().type_name === "DATE") 
                return true;
        }
        return false;
    }
    
    static check_street_after(tt) {
        if (tt !== null && ((tt.is_comma_and || tt.is_hiphen || tt.morph.class0.is_preposition))) 
            tt = tt.next;
        if (tt === null) 
            return false;
        let ait = AddressItemToken.try_parse(tt, null, false, false, null);
        if (ait !== null && ait.typ === AddressItemTokenItemType.STREET) 
            return true;
        return false;
    }
    
    static check_city_after(tt) {
        while (tt !== null && (((tt.is_comma_and || tt.is_hiphen || tt.morph.class0.is_preposition) || tt.is_char('.')))) {
            tt = tt.next;
        }
        if (tt === null) 
            return false;
        let cits = CityItemToken.try_parse_list(tt, null, 5);
        if (cits === null || cits.length === 0) {
            if (tt.length_char === 1 && tt.chars.is_all_lower && ((tt.is_value("Д", null) || tt.is_value("П", null)))) {
                let tt1 = tt.next;
                if (tt1 !== null && tt1.is_char('.')) 
                    tt1 = tt1.next;
                let ci = CityItemToken.try_parse(tt1, null, false, null);
                if (ci !== null && ((ci.typ === CityItemTokenItemType.PROPERNAME || ci.typ === CityItemTokenItemType.CITY))) 
                    return true;
            }
            return false;
        }
        if (CityAttachHelper.try_attach_city(cits, null, false) !== null) 
            return true;
        if (cits[0].typ === CityItemTokenItemType.NOUN) {
            if (tt.previous !== null && tt.previous.is_comma) 
                return true;
        }
        return false;
    }
}


module.exports = CityAttachHelper