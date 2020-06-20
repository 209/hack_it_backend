/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const MorphNumber = require("./../../../morph/MorphNumber");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const StreetItemType = require("./../../address/internal/StreetItemType");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const MorphClass = require("./../../../morph/MorphClass");
const GetTextAttr = require("./../../core/GetTextAttr");
const MorphGender = require("./../../../morph/MorphGender");
const MorphCase = require("./../../../morph/MorphCase");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const GeoReferent = require("./../GeoReferent");
const MorphCollection = require("./../../MorphCollection");
const Token = require("./../../Token");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const AddressItemTokenItemType = require("./../../address/internal/AddressItemTokenItemType");
const CityItemTokenItemType = require("./CityItemTokenItemType");
const ReferentToken = require("./../../ReferentToken");
const TextToken = require("./../../TextToken");
const MiscHelper = require("./../../core/MiscHelper");
const BracketHelper = require("./../../core/BracketHelper");
const AddressItemToken = require("./../../address/internal/AddressItemToken");
const Referent = require("./../../Referent");
const MiscLocationHelper = require("./MiscLocationHelper");
const TerrItemToken = require("./TerrItemToken");
const ProperNameHelper = require("./../../core/ProperNameHelper");
const StreetItemToken = require("./../../address/internal/StreetItemToken");
const CityItemToken = require("./CityItemToken");
const CityAttachHelper = require("./CityAttachHelper");

class TerrAttachHelper {
    
    static _try_attach_moscowao(li, ad) {
        if (li[0].termin_item === null || !li[0].termin_item.is_moscow_region) 
            return null;
        if (li[0].is_doubt) {
            let ok = false;
            if (CityAttachHelper.check_city_after(li[0].end_token.next)) 
                ok = true;
            else {
                let ali = AddressItemToken.try_parse_list(li[0].end_token.next, null, 2);
                if (ali !== null && ali.length > 0 && ali[0].typ === AddressItemTokenItemType.STREET) 
                    ok = true;
            }
            if (!ok) 
                return null;
        }
        let reg = new GeoReferent();
        let typ = "АДМИНИСТРАТИВНЫЙ ОКРУГ";
        reg.add_typ(typ);
        let name = li[0].termin_item.canonic_text;
        if (LanguageHelper.ends_with(name, typ)) 
            name = name.substring(0, 0 + name.length - typ.length - 1).trim();
        reg.add_name(name);
        return new ReferentToken(reg, li[0].begin_token, li[0].end_token);
    }
    
    static _try_attach_pure_terr(li, ad) {
        let aid = null;
        let t = li[0].end_token.next;
        if (t === null) 
            return null;
        let tt = t;
        if (BracketHelper.can_be_start_of_sequence(tt, true, false)) 
            tt = tt.next;
        if (li.length > 1) {
            let tmp = Array.from(li);
            tmp.splice(0, 1);
            let rt0 = TerrAttachHelper.try_attach_territory(tmp, ad, false, null, null);
            if (rt0 === null && tmp.length === 2) {
                if (((tmp[0].termin_item === null && tmp[1].termin_item !== null)) || ((tmp[0].termin_item !== null && tmp[1].termin_item === null))) {
                    if (aid === null) 
                        rt0 = TerrAttachHelper.try_attach_territory(tmp, ad, true, null, null);
                }
            }
            if (rt0 !== null) {
                if ((rt0.referent).is_state) 
                    return null;
                rt0.begin_token = li[0].begin_token;
                return rt0;
            }
        }
        if (aid === null) 
            aid = AddressItemToken.try_attach_org(tt);
        if (aid !== null) {
            let rt = aid.create_geo_org_terr();
            if (rt === null) 
                return null;
            rt.begin_token = li[0].begin_token;
            let t1 = rt.end_token;
            if (tt !== t && BracketHelper.can_be_end_of_sequence(t1.next, false, null, false)) 
                rt.end_token = (t1 = t1.next);
            return rt;
        }
        return null;
    }
    
    static try_attach_territory(li, ad, attach_always = false, cits = null, exists = null) {
        if (li === null || li.length === 0) 
            return null;
        let ex_obj = null;
        let new_name = null;
        let adj_list = new Array();
        let noun = null;
        let add_noun = null;
        let rt = TerrAttachHelper._try_attach_moscowao(li, ad);
        if (rt !== null) 
            return rt;
        if (li[0].termin_item !== null && li[0].termin_item.canonic_text === "ТЕРРИТОРИЯ") {
            let res2 = TerrAttachHelper._try_attach_pure_terr(li, ad);
            return res2;
        }
        if (li.length === 2) {
            if (li[0].rzd !== null && li[1].rzd_dir !== null) {
                let rzd = new GeoReferent();
                rzd.add_name(li[1].rzd_dir);
                rzd.add_typ_ter(li[0].kit.base_language);
                rzd.add_slot(GeoReferent.ATTR_REF, li[0].rzd.referent, false, 0);
                rzd.add_ext_referent(li[0].rzd);
                return new ReferentToken(rzd, li[0].begin_token, li[1].end_token);
            }
            if (li[1].rzd !== null && li[0].rzd_dir !== null) {
                let rzd = new GeoReferent();
                rzd.add_name(li[0].rzd_dir);
                rzd.add_typ_ter(li[0].kit.base_language);
                rzd.add_slot(GeoReferent.ATTR_REF, li[1].rzd.referent, false, 0);
                rzd.add_ext_referent(li[1].rzd);
                return new ReferentToken(rzd, li[0].begin_token, li[1].end_token);
            }
        }
        let can_be_city_before = false;
        let adj_terr_before = false;
        if (cits !== null) {
            if (cits[0].typ === CityItemTokenItemType.CITY) 
                can_be_city_before = true;
            else if (cits[0].typ === CityItemTokenItemType.NOUN && cits.length > 1) 
                can_be_city_before = true;
        }
        let k = 0;
        for (k = 0; k < li.length; k++) {
            if (li[k].onto_item !== null) {
                if (ex_obj !== null || new_name !== null) 
                    break;
                if (noun !== null) {
                    if (k === 1) {
                        if (noun.termin_item.canonic_text === "РАЙОН" || noun.termin_item.canonic_text === "ОБЛАСТЬ" || noun.termin_item.canonic_text === "СОЮЗ") {
                            if (li[k].onto_item.referent instanceof GeoReferent) {
                                if ((li[k].onto_item.referent).is_state) 
                                    break;
                            }
                            let ok = false;
                            let tt = li[k].end_token.next;
                            if (tt === null) 
                                ok = true;
                            else if (tt.is_char_of(",.")) 
                                ok = true;
                            if (!ok) 
                                ok = MiscLocationHelper.check_geo_object_before(li[0].begin_token);
                            if (!ok) {
                                let adr = AddressItemToken.try_parse(tt, null, false, false, null);
                                if (adr !== null) {
                                    if (adr.typ === AddressItemTokenItemType.STREET) 
                                        ok = true;
                                }
                            }
                            if (!ok) 
                                break;
                        }
                        if (li[k].onto_item !== null) {
                            if (noun.begin_token.is_value("МО", null) || noun.begin_token.is_value("ЛО", null)) 
                                return null;
                        }
                    }
                }
                ex_obj = li[k];
            }
            else if (li[k].termin_item !== null) {
                if (noun !== null) 
                    break;
                if (li[k].termin_item.is_always_prefix && k > 0) 
                    break;
                if (k > 0 && li[k].is_doubt) {
                    if (li[k].begin_token === li[k].end_token && li[k].begin_token.is_value("ЗАО", null)) 
                        break;
                }
                if (li[k].termin_item.is_adjective || li[k].is_geo_in_dictionary) 
                    adj_list.push(li[k]);
                else {
                    if (ex_obj !== null) {
                        let _geo = Utils.as(ex_obj.onto_item.referent, GeoReferent);
                        if (_geo === null) 
                            break;
                        if (ex_obj.is_adjective && ((li[k].termin_item.canonic_text === "СОЮЗ" || li[k].termin_item.canonic_text === "ФЕДЕРАЦИЯ"))) {
                            let str = ex_obj.onto_item.toString();
                            if (!str.includes(li[k].termin_item.canonic_text)) 
                                return null;
                        }
                        if (li[k].termin_item.canonic_text === "РАЙОН" || li[k].termin_item.canonic_text === "ОКРУГ" || li[k].termin_item.canonic_text === "КРАЙ") {
                            let tmp = new StringBuilder();
                            for (const s of _geo.slots) {
                                if (s.type_name === GeoReferent.ATTR_TYPE) 
                                    tmp.append(s.value).append(";");
                            }
                            if (!tmp.toString().toUpperCase().includes(li[k].termin_item.canonic_text)) {
                                if (k !== 1 || new_name !== null) 
                                    break;
                                new_name = li[0];
                                new_name.is_adjective = true;
                                new_name.onto_item = null;
                                ex_obj = null;
                            }
                        }
                    }
                    noun = li[k];
                    if (k === 0) {
                        let tt = TerrItemToken.try_parse(li[k].begin_token.previous, null, true, false, null);
                        if (tt !== null && tt.morph.class0.is_adjective) 
                            adj_terr_before = true;
                    }
                }
            }
            else {
                if (ex_obj !== null) 
                    break;
                if (new_name !== null) 
                    break;
                new_name = li[k];
            }
        }
        let name = null;
        let alt_name = null;
        let full_name = null;
        let _morph = null;
        if (ex_obj !== null) {
            if (ex_obj.is_adjective && !ex_obj.morph.language.is_en && noun === null) {
                if (attach_always && ex_obj.end_token.next !== null) {
                    let npt = NounPhraseHelper.try_parse(ex_obj.begin_token, NounPhraseParseAttr.NO, 0, null);
                    if (ex_obj.end_token.next.is_comma_and) {
                    }
                    else if (npt === null) {
                    }
                    else {
                        let str = StreetItemToken.try_parse(ex_obj.end_token.next, null, false, null, false);
                        if (str !== null) {
                            if (str.typ === StreetItemType.NOUN && str.end_token === npt.end_token) 
                                return null;
                        }
                    }
                }
                else {
                    let cit = CityItemToken.try_parse(ex_obj.end_token.next, null, false, null);
                    if (cit !== null && ((cit.typ === CityItemTokenItemType.NOUN || cit.typ === CityItemTokenItemType.CITY))) {
                        let npt = NounPhraseHelper.try_parse(ex_obj.begin_token, NounPhraseParseAttr.NO, 0, null);
                        if (npt !== null && npt.end_token === cit.end_token) {
                        }
                        else 
                            return null;
                    }
                    else if (ex_obj.begin_token.is_value("ПОДНЕБЕСНЫЙ", null)) {
                    }
                    else 
                        return null;
                }
            }
            if (noun === null && ex_obj.can_be_city) {
                let cit0 = CityItemToken.try_parse_back(ex_obj.begin_token.previous);
                if (cit0 !== null && cit0.typ !== CityItemTokenItemType.PROPERNAME) 
                    return null;
            }
            if (ex_obj.is_doubt && noun === null) {
                let ok2 = false;
                if (TerrAttachHelper._can_be_geo_after(ex_obj.end_token.next)) 
                    ok2 = true;
                else if (!ex_obj.can_be_surname && !ex_obj.can_be_city) {
                    if ((ex_obj.end_token.next !== null && ex_obj.end_token.next.is_char(')') && ex_obj.begin_token.previous !== null) && ex_obj.begin_token.previous.is_char('(')) 
                        ok2 = true;
                    else if (ex_obj.chars.is_latin_letter && ex_obj.begin_token.previous !== null) {
                        if (ex_obj.begin_token.previous.is_value("IN", null)) 
                            ok2 = true;
                        else if (ex_obj.begin_token.previous.is_value("THE", null) && ex_obj.begin_token.previous.previous !== null && ex_obj.begin_token.previous.previous.is_value("IN", null)) 
                            ok2 = true;
                    }
                }
                if (!ok2) {
                    let cit0 = CityItemToken.try_parse_back(ex_obj.begin_token.previous);
                    if (cit0 !== null && cit0.typ !== CityItemTokenItemType.PROPERNAME) {
                    }
                    else if (MiscLocationHelper.check_geo_object_before(ex_obj.begin_token.previous)) {
                    }
                    else 
                        return null;
                }
            }
            name = ex_obj.onto_item.canonic_text;
            _morph = ex_obj.morph;
        }
        else if (new_name !== null) {
            if (noun === null) 
                return null;
            for (let j = 1; j < k; j++) {
                if (li[j].is_newline_before && !li[0].is_newline_before) {
                    if (BracketHelper.can_be_start_of_sequence(li[j].begin_token, false, false)) {
                    }
                    else 
                        return null;
                }
            }
            _morph = noun.morph;
            if (new_name.is_adjective) {
                if (noun.termin_item.acronym === "АО") {
                    if (noun.begin_token !== noun.end_token) 
                        return null;
                    if (new_name.morph.gender !== MorphGender.FEMINIE) 
                        return null;
                }
                let geo_before = null;
                let tt0 = li[0].begin_token.previous;
                if (tt0 !== null && tt0.is_comma_and) 
                    tt0 = tt0.previous;
                if (!li[0].is_newline_before && tt0 !== null) 
                    geo_before = Utils.as(tt0.get_referent(), GeoReferent);
                if (li.indexOf(noun) < li.indexOf(new_name)) {
                    if (noun.termin_item.is_state) 
                        return null;
                    if (new_name.can_be_surname && geo_before === null) {
                        if ((MorphCase.ooBitand(noun.morph._case, new_name.morph._case)).is_undefined) 
                            return null;
                    }
                    if (MiscHelper.is_exists_in_dictionary(new_name.begin_token, new_name.end_token, MorphClass.ooBitor(MorphClass.ADJECTIVE, MorphClass.ooBitor(MorphClass.PRONOUN, MorphClass.VERB)))) {
                        if (noun.begin_token !== new_name.begin_token) {
                            if (geo_before === null) {
                                if (li.length === 2 && TerrAttachHelper._can_be_geo_after(li[1].end_token.next)) {
                                }
                                else if (li.length === 3 && li[2].termin_item !== null && TerrAttachHelper._can_be_geo_after(li[2].end_token.next)) {
                                }
                                else if (new_name.is_geo_in_dictionary) {
                                }
                                else if (new_name.end_token.is_newline_after) {
                                }
                                else 
                                    return null;
                            }
                        }
                    }
                    let npt = NounPhraseHelper.try_parse(new_name.end_token, NounPhraseParseAttr.PARSEPRONOUNS, 0, null);
                    if (npt !== null && npt.end_token !== new_name.end_token) {
                        if (li.length >= 3 && li[2].termin_item !== null && npt.end_token === li[2].end_token) 
                            add_noun = li[2];
                        else 
                            return null;
                    }
                    let rtp = new_name.kit.process_referent("PERSON", new_name.begin_token);
                    if (rtp !== null) 
                        return null;
                    name = ProperNameHelper.get_name_ex(new_name.begin_token, new_name.end_token, MorphClass.ADJECTIVE, MorphCase.UNDEFINED, noun.termin_item.gender, false, false);
                }
                else {
                    let ok = false;
                    if (((k + 1) < li.length) && li[k].termin_item === null && li[k + 1].termin_item !== null) 
                        ok = true;
                    else if ((k < li.length) && li[k].onto_item !== null) 
                        ok = true;
                    else if (k === li.length && !new_name.is_adj_in_dictionary) 
                        ok = true;
                    else if (MiscLocationHelper.check_geo_object_before(li[0].begin_token) || can_be_city_before) 
                        ok = true;
                    else if (MiscLocationHelper.check_geo_object_after(li[k - 1].end_token, false)) 
                        ok = true;
                    else if (li.length === 3 && k === 2) {
                        let cit = CityItemToken.try_parse(li[2].begin_token, null, false, null);
                        if (cit !== null) {
                            if (cit.typ === CityItemTokenItemType.CITY || cit.typ === CityItemTokenItemType.NOUN) 
                                ok = true;
                        }
                    }
                    else if (li.length === 2) 
                        ok = TerrAttachHelper._can_be_geo_after(li[li.length - 1].end_token.next);
                    if (!ok && !li[0].is_newline_before && !li[0].chars.is_all_lower) {
                        let rt00 = li[0].kit.process_referent("PERSONPROPERTY", li[0].begin_token.previous);
                        if (rt00 !== null) 
                            ok = true;
                    }
                    if (noun.termin_item !== null && noun.termin_item.is_strong && new_name.is_adjective) 
                        ok = true;
                    if (noun.is_doubt && adj_list.length === 0 && geo_before === null) 
                        return null;
                    name = ProperNameHelper.get_name_ex(new_name.begin_token, new_name.end_token, MorphClass.ADJECTIVE, MorphCase.UNDEFINED, noun.termin_item.gender, false, false);
                    if (!ok && !attach_always) {
                        if (MiscHelper.is_exists_in_dictionary(new_name.begin_token, new_name.end_token, MorphClass.ooBitor(MorphClass.ADJECTIVE, MorphClass.ooBitor(MorphClass.PRONOUN, MorphClass.VERB)))) {
                            if (exists !== null) {
                                for (const e of exists) {
                                    if (e.find_slot(GeoReferent.ATTR_NAME, name, true) !== null) {
                                        ok = true;
                                        break;
                                    }
                                }
                            }
                            if (!ok) 
                                return null;
                        }
                    }
                    full_name = (ProperNameHelper.get_name_ex(li[0].begin_token, noun.begin_token.previous, MorphClass.ADJECTIVE, MorphCase.UNDEFINED, noun.termin_item.gender, false, false) + " " + noun.termin_item.canonic_text);
                }
            }
            else {
                if (!attach_always || ((noun.termin_item !== null && noun.termin_item.canonic_text === "ФЕДЕРАЦИЯ"))) {
                    let is_latin = noun.chars.is_latin_letter && new_name.chars.is_latin_letter;
                    if (li.indexOf(noun) > li.indexOf(new_name)) {
                        if (!is_latin) 
                            return null;
                    }
                    if (!new_name.is_district_name && !BracketHelper.can_be_start_of_sequence(new_name.begin_token, false, false)) {
                        if (adj_list.length === 0 && MiscHelper.is_exists_in_dictionary(new_name.begin_token, new_name.end_token, MorphClass.ooBitor(MorphClass.NOUN, MorphClass.PRONOUN))) {
                            if (li.length === 2 && noun.is_city_region && (noun.whitespaces_after_count < 2)) {
                            }
                            else 
                                return null;
                        }
                        if (!is_latin) {
                            if ((noun.termin_item.is_region && !attach_always && ((!adj_terr_before || new_name.is_doubt))) && !noun.is_city_region && !noun.termin_item.is_specific_prefix) {
                                if (!MiscLocationHelper.check_geo_object_before(noun.begin_token)) {
                                    if (!noun.is_doubt && noun.begin_token !== noun.end_token) {
                                    }
                                    else if ((noun.termin_item.is_always_prefix && li.length === 2 && li[0] === noun) && li[1] === new_name) {
                                    }
                                    else 
                                        return null;
                                }
                            }
                            if (noun.is_doubt && adj_list.length === 0) {
                                if (noun.termin_item.acronym === "МО" || noun.termin_item.acronym === "ЛО") {
                                    if (k === (li.length - 1) && li[k].termin_item !== null) {
                                        add_noun = li[k];
                                        k++;
                                    }
                                    else if (li.length === 2 && noun === li[0] && new_name.toString().endsWith("совет")) {
                                    }
                                    else 
                                        return null;
                                }
                                else 
                                    return null;
                            }
                            let pers = new_name.kit.process_referent("PERSON", new_name.begin_token);
                            if (pers !== null) 
                                return null;
                        }
                    }
                }
                name = MiscHelper.get_text_value(new_name.begin_token, new_name.end_token, GetTextAttr.NO);
                if (new_name.begin_token !== new_name.end_token) {
                    for (let ttt = new_name.begin_token.next; ttt !== null && ttt.end_char <= new_name.end_char; ttt = ttt.next) {
                        if (ttt.chars.is_letter) {
                            let ty = TerrItemToken.try_parse(ttt, null, false, false, null);
                            if ((ty !== null && ty.termin_item !== null && noun !== null) && ((ty.termin_item.canonic_text.includes(noun.termin_item.canonic_text) || noun.termin_item.canonic_text.includes(ty.termin_item.canonic_text)))) {
                                name = MiscHelper.get_text_value(new_name.begin_token, ttt.previous, GetTextAttr.NO);
                                break;
                            }
                        }
                    }
                }
                if (adj_list.length > 0) {
                    let npt = NounPhraseHelper.try_parse(adj_list[0].begin_token, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null && npt.end_token === noun.end_token) 
                        alt_name = (npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false) + " " + name);
                }
            }
        }
        else {
            if ((li.length === 1 && noun !== null && noun.end_token.next !== null) && (noun.end_token.next.get_referent() instanceof GeoReferent)) {
                let g = Utils.as(noun.end_token.next.get_referent(), GeoReferent);
                if (noun.termin_item !== null) {
                    let tyy = noun.termin_item.canonic_text.toLowerCase();
                    let ooo = false;
                    if (g.find_slot(GeoReferent.ATTR_TYPE, tyy, true) !== null) 
                        ooo = true;
                    else if (tyy.endsWith("район") && g.find_slot(GeoReferent.ATTR_TYPE, "район", true) !== null) 
                        ooo = true;
                    if (ooo) 
                        return ReferentToken._new743(g, noun.begin_token, noun.end_token.next, noun.begin_token.morph);
                }
            }
            if ((li.length === 1 && noun === li[0] && li[0].termin_item !== null) && TerrItemToken.try_parse(li[0].end_token.next, null, true, false, null) === null && TerrItemToken.try_parse(li[0].begin_token.previous, null, true, false, null) === null) {
                if (li[0].morph.number === MorphNumber.PLURAL) 
                    return null;
                let cou = 0;
                let str = li[0].termin_item.canonic_text.toLowerCase();
                for (let tt = li[0].begin_token.previous; tt !== null; tt = tt.previous) {
                    if (tt.is_newline_after) 
                        cou += 10;
                    else 
                        cou++;
                    if (cou > 500) 
                        break;
                    let g = Utils.as(tt.get_referent(), GeoReferent);
                    if (g === null) 
                        continue;
                    let ok = true;
                    cou = 0;
                    for (tt = li[0].end_token.next; tt !== null; tt = tt.next) {
                        if (tt.is_newline_before) 
                            cou += 10;
                        else 
                            cou++;
                        if (cou > 500) 
                            break;
                        let tee = TerrItemToken.try_parse(tt, null, true, false, null);
                        if (tee === null) 
                            continue;
                        ok = false;
                        break;
                    }
                    if (ok) {
                        for (let ii = 0; g !== null && (ii < 3); g = g.higher,ii++) {
                            if (g.find_slot(GeoReferent.ATTR_TYPE, str, true) !== null) 
                                return ReferentToken._new743(g, li[0].begin_token, li[0].end_token, noun.begin_token.morph);
                        }
                    }
                    break;
                }
            }
            return null;
        }
        let ter = null;
        if (ex_obj !== null && (ex_obj.tag instanceof GeoReferent)) 
            ter = Utils.as(ex_obj.tag, GeoReferent);
        else {
            ter = new GeoReferent();
            if (ex_obj !== null) {
                let _geo = Utils.as(ex_obj.onto_item.referent, GeoReferent);
                if (_geo !== null && !_geo.is_city) 
                    ter.merge_slots2(_geo, li[0].kit.base_language);
                else 
                    ter.add_name(name);
                if (noun === null && ex_obj.can_be_city) 
                    ter.add_typ_city(li[0].kit.base_language);
                else {
                }
            }
            else if (new_name !== null) {
                ter.add_name(name);
                if (alt_name !== null) 
                    ter.add_name(alt_name);
            }
            if (noun !== null) {
                if (noun.termin_item.canonic_text === "АО") 
                    ter.add_typ((li[0].kit.base_language.is_ua ? "АВТОНОМНИЙ ОКРУГ" : "АВТОНОМНЫЙ ОКРУГ"));
                else if (noun.termin_item.canonic_text === "МУНИЦИПАЛЬНОЕ СОБРАНИЕ" || noun.termin_item.canonic_text === "МУНІЦИПАЛЬНЕ ЗБОРИ") 
                    ter.add_typ((li[0].kit.base_language.is_ua ? "МУНІЦИПАЛЬНЕ УТВОРЕННЯ" : "МУНИЦИПАЛЬНОЕ ОБРАЗОВАНИЕ"));
                else if (noun.termin_item.acronym === "МО" && add_noun !== null) 
                    ter.add_typ(add_noun.termin_item.canonic_text);
                else {
                    if (noun.termin_item.canonic_text === "СОЮЗ" && ex_obj !== null && ex_obj.end_char > noun.end_char) 
                        return ReferentToken._new743(ter, ex_obj.begin_token, ex_obj.end_token, ex_obj.morph);
                    ter.add_typ(noun.termin_item.canonic_text);
                    if (noun.termin_item.is_region && ter.is_state) 
                        ter.add_typ_reg(li[0].kit.base_language);
                }
            }
            if (ter.is_state && ter.is_region) {
                for (const a of adj_list) {
                    if (a.termin_item.is_region) {
                        ter.add_typ_reg(li[0].kit.base_language);
                        break;
                    }
                }
            }
            if (ter.is_state) {
                if (full_name !== null) 
                    ter.add_name(full_name);
            }
        }
        let res = new ReferentToken(ter, li[0].begin_token, li[k - 1].end_token);
        if (noun !== null && noun.morph.class0.is_noun) 
            res.morph = noun.morph;
        else {
            res.morph = new MorphCollection();
            for (let ii = 0; ii < k; ii++) {
                for (const v of li[ii].morph.items) {
                    let bi = new MorphBaseInfo(v);
                    if (noun !== null) {
                        if (bi.class0.is_adjective) 
                            bi.class0 = MorphClass.NOUN;
                    }
                    res.morph.add_item(bi);
                }
            }
        }
        if (li[0].termin_item !== null && li[0].termin_item.is_specific_prefix) 
            res.begin_token = li[0].end_token.next;
        if (add_noun !== null && add_noun.end_char > res.end_char) 
            res.end_token = add_noun.end_token;
        if ((res.begin_token.previous instanceof TextToken) && (res.whitespaces_before_count < 2)) {
            let tt = Utils.as(res.begin_token.previous, TextToken);
            if (tt.term === "АР") {
                for (const ty of ter.typs) {
                    if (ty.includes("республика") || ty.includes("республіка")) {
                        res.begin_token = tt;
                        break;
                    }
                }
            }
        }
        return res;
    }
    
    static _can_be_geo_after(tt) {
        while (tt !== null && ((tt.is_comma || BracketHelper.is_bracket(tt, true)))) {
            tt = tt.next;
        }
        if (tt === null) 
            return false;
        if (tt.get_referent() instanceof GeoReferent) 
            return true;
        let tli = TerrItemToken.try_parse_list(tt, null, 2);
        if (tli !== null && tli.length > 1) {
            if (tli[0].termin_item === null && tli[1].termin_item !== null) 
                return true;
            else if (tli[0].termin_item !== null && tli[1].termin_item === null) 
                return true;
        }
        if (CityAttachHelper.check_city_after(tt)) 
            return true;
        if (TerrAttachHelper.try_attach_stateusaterritory(tt) !== null) 
            return true;
        return false;
    }
    
    /**
     * Это привязка сокращений штатов
     * @param t 
     * @return 
     */
    static try_attach_stateusaterritory(t) {
        if (t === null || !t.chars.is_latin_letter) 
            return null;
        let tok = TerrItemToken.m_geo_abbrs.try_parse(t, TerminParseAttr.NO);
        if (tok === null) 
            return null;
        let g = Utils.as(tok.termin.tag, GeoReferent);
        if (g === null) 
            return null;
        if (tok.end_token.next !== null && tok.end_token.next.is_char('.')) 
            tok.end_token = tok.end_token.next;
        let gg = g.clone();
        gg.occurrence.splice(0, gg.occurrence.length);
        return new ReferentToken(gg, tok.begin_token, tok.end_token);
    }
}


module.exports = TerrAttachHelper