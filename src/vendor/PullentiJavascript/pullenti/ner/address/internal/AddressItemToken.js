/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const NumberExType = require("./../../core/NumberExType");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const GetTextAttr = require("./../../core/GetTextAttr");
const MiscHelper = require("./../../core/MiscHelper");
const AddressReferent = require("./../AddressReferent");
const DateReferent = require("./../../date/DateReferent");
const MorphLang = require("./../../../morph/MorphLang");
const Token = require("./../../Token");
const MetaToken = require("./../../MetaToken");
const Termin = require("./../../core/Termin");
const Referent = require("./../../Referent");
const TerminCollection = require("./../../core/TerminCollection");
const NumberHelper = require("./../../core/NumberHelper");
const MiscLocationHelper = require("./../../geo/internal/MiscLocationHelper");
const TerrItemToken = require("./../../geo/internal/TerrItemToken");
const StreetItemType = require("./StreetItemType");
const StreetReferent = require("./../StreetReferent");
const AddressItemTokenItemType = require("./AddressItemTokenItemType");
const StreetKind = require("./../StreetKind");
const NumberSpellingType = require("./../../NumberSpellingType");
const AddressBuildingType = require("./../AddressBuildingType");
const AddressDetailType = require("./../AddressDetailType");
const TextToken = require("./../../TextToken");
const AddressHouseType = require("./../AddressHouseType");
const GeoReferent = require("./../../geo/GeoReferent");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const ReferentToken = require("./../../ReferentToken");
const NumberToken = require("./../../NumberToken");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const BracketHelper = require("./../../core/BracketHelper");

class AddressItemToken extends MetaToken {
    
    constructor(_typ, begin, end) {
        super(begin, end, null);
        this.typ = AddressItemTokenItemType.PREFIX;
        this.value = null;
        this.referent = null;
        this.ref_token = null;
        this.ref_token_is_gsk = false;
        this.is_doubt = false;
        this.detail_type = AddressDetailType.UNDEFINED;
        this.building_type = AddressBuildingType.UNDEFINED;
        this.house_type = AddressHouseType.UNDEFINED;
        this.detail_meters = 0;
        this.typ = _typ;
    }
    
    get is_street_road() {
        if (this.typ !== AddressItemTokenItemType.STREET) 
            return false;
        if (!((this.referent instanceof StreetReferent))) 
            return false;
        return (this.referent).kind === StreetKind.ROAD;
    }
    
    get is_terr_or_rzd() {
        if (this.typ === AddressItemTokenItemType.CITY && (this.referent instanceof GeoReferent)) {
            if ((this.referent).is_territory) 
                return true;
        }
        return false;
    }
    
    get is_digit() {
        if (this.value === "Б/Н") 
            return true;
        if (Utils.isNullOrEmpty(this.value)) 
            return false;
        if (Utils.isDigit(this.value[0])) 
            return true;
        if (this.value.length > 1) {
            if (Utils.isLetter(this.value[0]) && Utils.isDigit(this.value[1])) 
                return true;
        }
        if (this.value.length !== 1 || !Utils.isLetter(this.value[0])) 
            return false;
        if (!this.begin_token.chars.is_all_lower) 
            return false;
        return true;
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(this.typ.toString()).append(" ").append(((this.value != null ? this.value : "")));
        if (this.referent !== null) 
            res.append(" <").append(this.referent.toString()).append(">");
        if (this.detail_type !== AddressDetailType.UNDEFINED) 
            res.append(" [").append(String(this.detail_type)).append(", ").append(this.detail_meters).append("]");
        return res.toString();
    }
    
    static try_parse_list(t, loc_streets, max_count = 20) {
        const StreetDefineHelper = require("./StreetDefineHelper");
        if (t instanceof NumberToken) {
            if ((t).int_value === null) 
                return null;
            let v = (t).int_value;
            if ((v < 100000) || v >= 10000000) {
                if ((t).typ === NumberSpellingType.DIGIT && !t.morph.class0.is_adjective) {
                    if (t.next === null || (t.next instanceof NumberToken)) {
                        if (t.previous === null || !t.previous.morph.class0.is_preposition) 
                            return null;
                    }
                }
            }
        }
        let it = AddressItemToken.try_parse(t, loc_streets, false, false, null);
        if (it === null) 
            return null;
        if (it.typ === AddressItemTokenItemType.NUMBER) 
            return null;
        if (it.typ === AddressItemTokenItemType.KILOMETER && !it.is_number && (it.begin_token.previous instanceof NumberToken)) {
            it.begin_token = it.begin_token.previous;
            it.value = (it.begin_token).value.toString();
            if (it.begin_token.previous !== null && it.begin_token.previous.morph.class0.is_preposition) 
                it.begin_token = it.begin_token.previous;
        }
        let res = new Array();
        res.push(it);
        let pref = it.typ === AddressItemTokenItemType.PREFIX;
        for (t = it.end_token.next; t !== null; t = t.next) {
            if (max_count > 0 && res.length >= max_count) 
                break;
            let last = res[res.length - 1];
            if (res.length > 1) {
                if (last.is_newline_before && res[res.length - 2].typ !== AddressItemTokenItemType.PREFIX) {
                    let i = 0;
                    for (i = 0; i < (res.length - 1); i++) {
                        if (res[i].typ === last.typ) {
                            if (i === (res.length - 2) && ((last.typ === AddressItemTokenItemType.CITY || last.typ === AddressItemTokenItemType.REGION))) {
                                let jj = 0;
                                for (jj = 0; jj < i; jj++) {
                                    if ((res[jj].typ !== AddressItemTokenItemType.PREFIX && res[jj].typ !== AddressItemTokenItemType.ZIP && res[jj].typ !== AddressItemTokenItemType.REGION) && res[jj].typ !== AddressItemTokenItemType.COUNTRY) 
                                        break;
                                }
                                if (jj >= i) 
                                    continue;
                            }
                            break;
                        }
                    }
                    if ((i < (res.length - 1)) || last.typ === AddressItemTokenItemType.ZIP) {
                        Utils.removeItem(res, last);
                        break;
                    }
                }
            }
            if (t.is_table_control_char) 
                break;
            if (t.is_char(',')) 
                continue;
            if (BracketHelper.can_be_end_of_sequence(t, true, null, false) && last.typ === AddressItemTokenItemType.STREET) 
                continue;
            if (t.is_char('.')) {
                if (t.is_newline_after) 
                    break;
                if (t.previous !== null && t.previous.is_char('.')) 
                    break;
                continue;
            }
            if (t.is_hiphen || t.is_char('_')) {
                if (((it.typ === AddressItemTokenItemType.NUMBER || it.typ === AddressItemTokenItemType.STREET)) && (t.next instanceof NumberToken)) 
                    continue;
            }
            if (it.typ === AddressItemTokenItemType.DETAIL && it.detail_type === AddressDetailType.CROSS) {
                let str1 = AddressItemToken.try_parse(t, loc_streets, true, false, null);
                if (str1 !== null && str1.typ === AddressItemTokenItemType.STREET) {
                    if (str1.end_token.next !== null && ((str1.end_token.next.is_and || str1.end_token.next.is_hiphen))) {
                        let str2 = AddressItemToken.try_parse(str1.end_token.next.next, loc_streets, true, false, null);
                        if (str2 === null || str2.typ !== AddressItemTokenItemType.STREET) {
                            str2 = StreetDefineHelper.try_parse_second_street(str1.begin_token, str1.end_token.next.next, loc_streets);
                            if (str2 !== null) 
                                str2.is_doubt = false;
                        }
                        if (str2 !== null && str2.typ === AddressItemTokenItemType.STREET) {
                            res.push(str1);
                            res.push(str2);
                            t = str2.end_token;
                            it = str2;
                            continue;
                        }
                    }
                }
            }
            let pre = pref;
            if (it.typ === AddressItemTokenItemType.KILOMETER || it.typ === AddressItemTokenItemType.HOUSE) {
                if (!t.is_newline_before) 
                    pre = true;
            }
            let it0 = AddressItemToken.try_parse(t, loc_streets, pre, false, it);
            if (it0 === null) {
                let ok2 = true;
                if (it.typ === AddressItemTokenItemType.BUILDING && it.begin_token.is_value("СТ", null)) 
                    ok2 = false;
                else 
                    for (const rr of res) {
                        if (rr.typ === AddressItemTokenItemType.BUILDING && rr.begin_token.is_value("СТ", null)) 
                            ok2 = false;
                    }
                if (it.typ === AddressItemTokenItemType.POSTOFFICEBOX) 
                    break;
                if (ok2) 
                    it0 = AddressItemToken.try_attach_org(t);
                if (it0 !== null) {
                    res.push(it0);
                    it = it0;
                    t = it.end_token;
                    for (let tt1 = t.next; tt1 !== null; tt1 = tt1.next) {
                        if (tt1.is_comma) {
                        }
                        else {
                            if (tt1.is_value("Л", null) && tt1.next !== null && tt1.next.is_char('.')) {
                                let ait = AddressItemToken.try_parse(tt1.next.next, null, false, true, null);
                                if (ait !== null && ait.typ === AddressItemTokenItemType.NUMBER) {
                                    let st2 = new StreetReferent();
                                    st2.add_slot(StreetReferent.ATTR_TYP, "линия", false, 0);
                                    st2.number = ait.value;
                                    res.push((it = AddressItemToken._new83(AddressItemTokenItemType.STREET, tt1, ait.end_token, st2)));
                                    t = it.end_token;
                                }
                            }
                            break;
                        }
                    }
                    continue;
                }
                if (t.morph.class0.is_preposition) {
                    it0 = AddressItemToken.try_parse(t.next, loc_streets, false, false, it);
                    if (it0 !== null && it0.typ === AddressItemTokenItemType.BUILDING && it0.begin_token.is_value("СТ", null)) {
                        it0 = null;
                        break;
                    }
                    if (it0 !== null) {
                        if ((it0.typ === AddressItemTokenItemType.HOUSE || it0.typ === AddressItemTokenItemType.BUILDING || it0.typ === AddressItemTokenItemType.CORPUS) || it0.typ === AddressItemTokenItemType.STREET) {
                            res.push((it = it0));
                            t = it.end_token;
                            continue;
                        }
                    }
                }
                if (it.typ === AddressItemTokenItemType.HOUSE || it.typ === AddressItemTokenItemType.BUILDING || it.typ === AddressItemTokenItemType.NUMBER) {
                    if ((!t.is_whitespace_before && t.length_char === 1 && t.chars.is_letter) && !t.is_whitespace_after && (t.next instanceof NumberToken)) {
                        let ch = AddressItemToken.correct_char_token(t);
                        if (ch === "К" || ch === "С") {
                            it0 = AddressItemToken._new84((ch === "К" ? AddressItemTokenItemType.CORPUS : AddressItemTokenItemType.BUILDING), t, t.next, (t.next).value.toString());
                            it = it0;
                            res.push(it);
                            t = it.end_token;
                            let tt = t.next;
                            if (((tt !== null && !tt.is_whitespace_before && tt.length_char === 1) && tt.chars.is_letter && !tt.is_whitespace_after) && (tt.next instanceof NumberToken)) {
                                ch = AddressItemToken.correct_char_token(tt);
                                if (ch === "К" || ch === "С") {
                                    it = AddressItemToken._new84((ch === "К" ? AddressItemTokenItemType.CORPUS : AddressItemTokenItemType.BUILDING), tt, tt.next, (tt.next).value.toString());
                                    res.push(it);
                                    t = it.end_token;
                                }
                            }
                            continue;
                        }
                    }
                }
                if (t.morph.class0.is_preposition) {
                    if ((((t.is_value("У", null) || t.is_value("ВОЗЛЕ", null) || t.is_value("НАПРОТИВ", null)) || t.is_value("НА", null) || t.is_value("В", null)) || t.is_value("ВО", null) || t.is_value("ПО", null)) || t.is_value("ОКОЛО", null)) 
                        continue;
                }
                if (t.morph.class0.is_noun) {
                    if ((t.is_value("ДВОР", null) || t.is_value("ПОДЪЕЗД", null) || t.is_value("КРЫША", null)) || t.is_value("ПОДВАЛ", null)) 
                        continue;
                }
                if (t.is_value("ТЕРРИТОРИЯ", "ТЕРИТОРІЯ")) 
                    continue;
                if (t.is_char('(') && t.next !== null) {
                    it0 = AddressItemToken.try_parse(t.next, loc_streets, pre, false, null);
                    if (it0 !== null && it0.end_token.next !== null && it0.end_token.next.is_char(')')) {
                        it0.begin_token = t;
                        it0.end_token = it0.end_token.next;
                        it = it0;
                        res.push(it);
                        t = it.end_token;
                        continue;
                    }
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null && (br.length_char < 100)) {
                        if (t.next.is_value("БЫВШИЙ", null) || t.next.is_value("БЫВШ", null)) {
                            it = new AddressItemToken(AddressItemTokenItemType.DETAIL, t, br.end_token);
                            res.push(it);
                        }
                        t = br.end_token;
                        continue;
                    }
                }
                let check_kv = false;
                if (t.is_value("КВ", null) || t.is_value("KB", null)) {
                    if (it.typ === AddressItemTokenItemType.NUMBER && res.length > 1 && res[res.length - 2].typ === AddressItemTokenItemType.STREET) 
                        check_kv = true;
                    else if ((it.typ === AddressItemTokenItemType.HOUSE || it.typ === AddressItemTokenItemType.BUILDING || it.typ === AddressItemTokenItemType.CORPUS) || it.typ === AddressItemTokenItemType.CORPUSORFLAT) {
                        for (let jj = res.length - 2; jj >= 0; jj--) {
                            if (res[jj].typ === AddressItemTokenItemType.STREET || res[jj].typ === AddressItemTokenItemType.CITY) 
                                check_kv = true;
                        }
                    }
                    if (check_kv) {
                        let tt2 = t.next;
                        if (tt2 !== null && tt2.is_char('.')) 
                            tt2 = tt2.next;
                        let it22 = AddressItemToken.try_parse(tt2, loc_streets, false, true, null);
                        if (it22 !== null && it22.typ === AddressItemTokenItemType.NUMBER) {
                            it22.begin_token = t;
                            it22.typ = AddressItemTokenItemType.FLAT;
                            res.push(it22);
                            t = it22.end_token;
                            continue;
                        }
                    }
                }
                if (res[res.length - 1].typ === AddressItemTokenItemType.CITY) {
                    if (((t.is_hiphen || t.is_char('_') || t.is_value("НЕТ", null))) && t.next !== null && t.next.is_comma) {
                        let att = AddressItemToken._try_parse(t.next.next, null, false, true, null);
                        if (att !== null) {
                            if (att.typ === AddressItemTokenItemType.HOUSE || att.typ === AddressItemTokenItemType.BUILDING || att.typ === AddressItemTokenItemType.CORPUS) {
                                it = new AddressItemToken(AddressItemTokenItemType.STREET, t, t);
                                res.push(it);
                                continue;
                            }
                        }
                    }
                }
                if (t.length_char === 2 && (t instanceof TextToken) && t.chars.is_all_upper) {
                    let term = (t).term;
                    if (!Utils.isNullOrEmpty(term) && term[0] === 'Р') 
                        continue;
                }
                break;
            }
            if (t.whitespaces_before_count > 15) {
                if (it0.typ === AddressItemTokenItemType.STREET && last.typ === AddressItemTokenItemType.CITY) {
                }
                else 
                    break;
            }
            if (it0.typ === AddressItemTokenItemType.STREET && t.is_value("КВ", null)) {
                if (it !== null) {
                    if (it.typ === AddressItemTokenItemType.HOUSE || it.typ === AddressItemTokenItemType.BUILDING || it.typ === AddressItemTokenItemType.CORPUS) {
                        let it2 = AddressItemToken.try_parse(t, loc_streets, false, true, null);
                        if (it2 !== null && it2.typ === AddressItemTokenItemType.FLAT) 
                            it0 = it2;
                    }
                }
            }
            if (it0.typ === AddressItemTokenItemType.PREFIX) 
                break;
            if (it0.typ === AddressItemTokenItemType.NUMBER) {
                if (Utils.isNullOrEmpty(it0.value)) 
                    break;
                if (!Utils.isDigit(it0.value[0])) 
                    break;
                let cou = 0;
                for (let i = res.length - 1; i >= 0; i--) {
                    if (res[i].typ === AddressItemTokenItemType.NUMBER) 
                        cou++;
                    else 
                        break;
                }
                if (cou > 5) 
                    break;
                if (it.is_doubt && t.is_newline_before) 
                    break;
            }
            if (it0.typ === AddressItemTokenItemType.CORPUSORFLAT && it !== null && it.typ === AddressItemTokenItemType.FLAT) 
                it0.typ = AddressItemTokenItemType.OFFICE;
            if ((((it0.typ === AddressItemTokenItemType.FLOOR || it0.typ === AddressItemTokenItemType.POTCH || it0.typ === AddressItemTokenItemType.BLOCK) || it0.typ === AddressItemTokenItemType.KILOMETER)) && Utils.isNullOrEmpty(it0.value) && it.typ === AddressItemTokenItemType.NUMBER) {
                it.typ = it0.typ;
                it.end_token = it0.end_token;
            }
            else if (((it.typ === AddressItemTokenItemType.FLOOR || it.typ === AddressItemTokenItemType.POTCH)) && Utils.isNullOrEmpty(it.value) && it0.typ === AddressItemTokenItemType.NUMBER) {
                it.value = it0.value;
                it.end_token = it0.end_token;
            }
            else {
                it = it0;
                res.push(it);
            }
            t = it.end_token;
        }
        if (res.length > 0) {
            it = res[res.length - 1];
            let it0 = (res.length > 1 ? res[res.length - 2] : null);
            if (it.typ === AddressItemTokenItemType.NUMBER && it0 !== null && it0.ref_token !== null) {
                for (const s of it0.ref_token.referent.slots) {
                    if (s.type_name === "TYPE") {
                        let ss = (Utils.asString(s.value));
                        if (ss.includes("гараж") || ((ss[0] === 'Г' && ss[ss.length - 1] === 'К'))) {
                            it.typ = AddressItemTokenItemType.BOX;
                            break;
                        }
                    }
                }
            }
            if (it.typ === AddressItemTokenItemType.NUMBER || it.typ === AddressItemTokenItemType.ZIP) {
                let del = false;
                if (it.begin_token.previous !== null && it.begin_token.previous.morph.class0.is_preposition) 
                    del = true;
                else if (it.morph.class0.is_noun) 
                    del = true;
                if ((!del && it.end_token.whitespaces_after_count === 1 && it.whitespaces_before_count > 0) && it.typ === AddressItemTokenItemType.NUMBER) {
                    let npt = NounPhraseHelper.try_parse(it.end_token.next, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null) 
                        del = true;
                }
                if (del) 
                    res.splice(res.length - 1, 1);
                else if ((it.typ === AddressItemTokenItemType.NUMBER && it0 !== null && it0.typ === AddressItemTokenItemType.STREET) && it0.ref_token === null) {
                    if (it.begin_token.previous.is_char(',') || it.is_newline_after) 
                        it.typ = AddressItemTokenItemType.HOUSE;
                }
            }
        }
        if (res.length === 0) 
            return null;
        for (const r of res) {
            if (r.typ === AddressItemTokenItemType.CITY || r.typ === AddressItemTokenItemType.REGION) {
                let ty = AddressItemToken._find_addr_typ(r.begin_token, r.end_char, 0);
                if (ty !== null) {
                    r.detail_type = ty.detail_type;
                    if (ty.detail_meters > 0) 
                        r.detail_meters = ty.detail_meters;
                }
            }
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].is_terr_or_rzd && res[i + 1].typ === AddressItemTokenItemType.KILOMETER && (((i + 1) >= res.length || !res[i + 1].is_terr_or_rzd))) {
                let str = new StreetReferent();
                str.add_slot(StreetReferent.ATTR_TYP, "километр", true, 0);
                str.add_slot(StreetReferent.ATTR_NAME, res[i].referent.get_string_value(GeoReferent.ATTR_NAME), false, 0);
                str.add_slot(StreetReferent.ATTR_GEO, res[i].referent, false, 0);
                str.number = res[i + 1].value;
                let t11 = res[i + 1].end_token;
                let remove2 = false;
                if ((res[i].value === null && ((i + 2) < res.length) && res[i + 2].typ === AddressItemTokenItemType.NUMBER) && res[i + 2].value !== null) {
                    str.number = res[i + 2].value + "км";
                    t11 = res[i + 2].end_token;
                    remove2 = true;
                }
                let ai = AddressItemToken._new86(AddressItemTokenItemType.STREET, res[i].begin_token, t11, str, false);
                res[i] = ai;
                res.splice(i + 1, 1);
                if (remove2) 
                    res.splice(i + 1, 1);
            }
            else if (res[i + 1].is_terr_or_rzd && res[i].typ === AddressItemTokenItemType.KILOMETER) {
                let str = new StreetReferent();
                str.add_slot(StreetReferent.ATTR_TYP, "километр", true, 0);
                str.add_slot(StreetReferent.ATTR_NAME, res[i + 1].referent.get_string_value(GeoReferent.ATTR_NAME), false, 0);
                str.add_slot(StreetReferent.ATTR_GEO, res[i + 1].referent, false, 0);
                str.number = res[i].value;
                let t11 = res[i + 1].end_token;
                let remove2 = false;
                if ((res[i].value === null && ((i + 2) < res.length) && res[i + 2].typ === AddressItemTokenItemType.NUMBER) && res[i + 2].value !== null) {
                    str.number = res[i + 2].value + "км";
                    t11 = res[i + 2].end_token;
                    remove2 = true;
                }
                let ai = AddressItemToken._new86(AddressItemTokenItemType.STREET, res[i].begin_token, t11, str, false);
                res[i] = ai;
                res.splice(i + 1, 1);
                if (remove2) 
                    res.splice(i + 1, 1);
            }
        }
        for (let i = 0; i < (res.length - 2); i++) {
            if (res[i].typ === AddressItemTokenItemType.STREET && res[i + 1].typ === AddressItemTokenItemType.NUMBER) {
                if ((res[i + 2].typ === AddressItemTokenItemType.BUSINESSCENTER || res[i + 2].typ === AddressItemTokenItemType.BUILDING || res[i + 2].typ === AddressItemTokenItemType.CORPUS) || res[i + 2].typ === AddressItemTokenItemType.OFFICE || res[i + 2].typ === AddressItemTokenItemType.FLAT) 
                    res[i + 1].typ = AddressItemTokenItemType.HOUSE;
            }
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if ((res[i].typ === AddressItemTokenItemType.STREET && res[i + 1].typ === AddressItemTokenItemType.KILOMETER && (res[i].referent instanceof StreetReferent)) && (res[i].referent).number === null) {
                (res[i].referent).number = res[i + 1].value + "км";
                res[i].end_token = res[i + 1].end_token;
                res.splice(i + 1, 1);
            }
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if ((res[i + 1].typ === AddressItemTokenItemType.STREET && res[i].typ === AddressItemTokenItemType.KILOMETER && (res[i + 1].referent instanceof StreetReferent)) && (res[i + 1].referent).number === null) {
                (res[i + 1].referent).number = res[i].value + "км";
                res[i + 1].begin_token = res[i].begin_token;
                res.splice(i, 1);
                break;
            }
        }
        return res;
    }
    
    static _find_addr_typ(t, max_char, lev = 0) {
        if (t === null || t.end_char > max_char) 
            return null;
        if (lev > 5) 
            return null;
        if (t instanceof ReferentToken) {
            let geo = Utils.as(t.get_referent(), GeoReferent);
            if (geo !== null) {
                for (const s of geo.slots) {
                    if (s.type_name === GeoReferent.ATTR_TYPE) {
                        let ty = String(s.value);
                        if (ty.includes("район")) 
                            return null;
                    }
                }
            }
            for (let tt = (t).begin_token; tt !== null; tt = tt.next) {
                if (tt.end_char > max_char) 
                    break;
                let ty = AddressItemToken._find_addr_typ(tt, max_char, lev + 1);
                if (ty !== null) 
                    return ty;
            }
        }
        else {
            let ai = AddressItemToken.try_attach_detail(t);
            if (ai !== null) {
                if (ai.detail_type !== AddressDetailType.UNDEFINED || ai.detail_meters > 0) 
                    return ai;
            }
        }
        return null;
    }
    
    static try_parse(t, loc_streets, prefix_before, ignore_street = false, prev = null) {
        if (t === null) 
            return null;
        if (t.kit.is_recurce_overflow) 
            return null;
        t.kit.recurse_level++;
        let res = AddressItemToken._try_parse(t, loc_streets, prefix_before, ignore_street, prev);
        t.kit.recurse_level--;
        if (((res !== null && !res.is_whitespace_after && res.end_token.next !== null) && res.end_token.next.is_hiphen && !res.end_token.next.is_whitespace_after) && res.value !== null) {
            if (res.typ === AddressItemTokenItemType.HOUSE || res.typ === AddressItemTokenItemType.BUILDING || res.typ === AddressItemTokenItemType.CORPUS) {
                let tt = res.end_token.next.next;
                if (tt instanceof NumberToken) {
                    res.value = (res.value + "-" + (tt).value);
                    res.end_token = tt;
                    if ((!tt.is_whitespace_after && (tt.next instanceof TextToken) && tt.next.length_char === 1) && tt.next.chars.is_all_upper) {
                        tt = tt.next;
                        res.end_token = tt;
                        res.value += (tt).term;
                    }
                    if ((!tt.is_whitespace_after && tt.next !== null && tt.next.is_char_of("\\/")) && (tt.next.next instanceof NumberToken)) {
                        res.end_token = (tt = tt.next.next);
                        res.value = (res.value + "/" + (tt).value);
                    }
                    if ((!tt.is_whitespace_after && tt.next !== null && tt.next.is_hiphen) && (tt.next.next instanceof NumberToken)) {
                        res.end_token = (tt = tt.next.next);
                        res.value = (res.value + "-" + (tt).value);
                        if ((!tt.is_whitespace_after && (tt.next instanceof TextToken) && tt.next.length_char === 1) && tt.next.chars.is_all_upper) {
                            tt = tt.next;
                            res.end_token = tt;
                            res.value += (tt).term;
                        }
                    }
                }
                else if ((tt instanceof TextToken) && tt.length_char === 1 && tt.chars.is_all_upper) {
                    res.value = (res.value + "-" + (tt).term);
                    res.end_token = tt;
                }
            }
        }
        return res;
    }
    
    static _try_parse(t, loc_streets, prefix_before, ignore_street, prev) {
        const StreetItemToken = require("./StreetItemToken");
        const StreetDefineHelper = require("./StreetDefineHelper");
        if (t instanceof ReferentToken) {
            let rt = Utils.as(t, ReferentToken);
            let ty = null;
            let geo = Utils.as(rt.referent, GeoReferent);
            if (geo !== null) {
                if (geo.is_city || geo.is_territory) 
                    ty = AddressItemTokenItemType.CITY;
                else if (geo.is_state) 
                    ty = AddressItemTokenItemType.COUNTRY;
                else 
                    ty = AddressItemTokenItemType.REGION;
                return AddressItemToken._new83(ty, t, t, rt.referent);
            }
        }
        if (!ignore_street && t !== null && prev !== null) {
            if (t.is_value("КВ", null) || t.is_value("КВАРТ", null)) {
                if ((((prev.typ === AddressItemTokenItemType.HOUSE || prev.typ === AddressItemTokenItemType.NUMBER || prev.typ === AddressItemTokenItemType.BUILDING) || prev.typ === AddressItemTokenItemType.FLOOR || prev.typ === AddressItemTokenItemType.POTCH) || prev.typ === AddressItemTokenItemType.CORPUS || prev.typ === AddressItemTokenItemType.CORPUSORFLAT) || prev.typ === AddressItemTokenItemType.DETAIL) 
                    ignore_street = true;
            }
        }
        if (!ignore_street) {
            let sli = StreetItemToken.try_parse_list(t, loc_streets, 10);
            if (sli !== null) {
                let rt = StreetDefineHelper.try_parse_street(sli, prefix_before, false);
                if (rt !== null) {
                    let crlf = false;
                    for (let ttt = rt.begin_token; ttt !== rt.end_token; ttt = ttt.next) {
                        if (ttt.is_newline_after) {
                            crlf = true;
                            break;
                        }
                    }
                    if (crlf) {
                        for (let ttt = rt.begin_token.previous; ttt !== null; ttt = ttt.previous) {
                            if (ttt.morph.class0.is_preposition || ttt.is_comma) 
                                continue;
                            if (ttt.get_referent() instanceof GeoReferent) 
                                crlf = false;
                            break;
                        }
                        if (sli[0].typ === StreetItemType.NOUN && sli[0].termin.canonic_text.includes("ДОРОГА")) 
                            crlf = false;
                    }
                    if (crlf) {
                        let aat = AddressItemToken.try_parse(rt.end_token.next, null, false, true, null);
                        if (aat === null) 
                            return null;
                        if (aat.typ !== AddressItemTokenItemType.HOUSE) 
                            return null;
                    }
                    return rt;
                }
                if (sli.length === 1 && sli[0].typ === StreetItemType.NOUN) {
                    let tt = sli[0].end_token.next;
                    if (tt !== null && ((tt.is_hiphen || tt.is_char('_') || tt.is_value("НЕТ", null)))) {
                        let ttt = tt.next;
                        if (ttt !== null && ttt.is_comma) 
                            ttt = ttt.next;
                        let att = AddressItemToken.try_parse(ttt, null, false, true, null);
                        if (att !== null) {
                            if (att.typ === AddressItemTokenItemType.HOUSE || att.typ === AddressItemTokenItemType.CORPUS || att.typ === AddressItemTokenItemType.BUILDING) 
                                return new AddressItemToken(AddressItemTokenItemType.STREET, t, tt);
                        }
                    }
                }
            }
        }
        if (t instanceof ReferentToken) 
            return null;
        if (t instanceof NumberToken) {
            let n = Utils.as(t, NumberToken);
            if (((n.length_char === 6 || n.length_char === 5)) && n.typ === NumberSpellingType.DIGIT && !n.morph.class0.is_adjective) 
                return AddressItemToken._new84(AddressItemTokenItemType.ZIP, t, t, n.value.toString());
            let ok = false;
            if ((t.previous !== null && t.previous.morph.class0.is_preposition && t.next !== null) && t.next.chars.is_letter && t.next.chars.is_all_lower) 
                ok = true;
            else if (t.morph.class0.is_adjective && !t.morph.class0.is_noun) 
                ok = true;
            let tok0 = AddressItemToken.m_ontology.try_parse(t.next, TerminParseAttr.NO);
            if (tok0 !== null && (tok0.termin.tag instanceof AddressItemTokenItemType)) {
                if (tok0.end_token.next === null || tok0.end_token.next.is_comma || tok0.end_token.is_newline_after) 
                    ok = true;
                let typ0 = AddressItemTokenItemType.of(tok0.termin.tag);
                if (typ0 === AddressItemTokenItemType.FLAT) {
                    if ((t.next instanceof TextToken) && t.next.is_value("КВ", null)) {
                        if (t.next.get_source_text() === "кВ") 
                            return null;
                    }
                    if ((tok0.end_token.next instanceof NumberToken) && (tok0.end_token.whitespaces_after_count < 3)) {
                        if (prev !== null && ((prev.typ === AddressItemTokenItemType.STREET || prev.typ === AddressItemTokenItemType.CITY))) 
                            return AddressItemToken._new84(AddressItemTokenItemType.NUMBER, t, t, n.value.toString());
                    }
                }
                if ((typ0 === AddressItemTokenItemType.KILOMETER || typ0 === AddressItemTokenItemType.FLOOR || typ0 === AddressItemTokenItemType.BLOCK) || typ0 === AddressItemTokenItemType.POTCH || typ0 === AddressItemTokenItemType.FLAT) 
                    return AddressItemToken._new84(typ0, t, tok0.end_token, n.value.toString());
            }
        }
        let prepos = false;
        let tok = null;
        if (t.morph.class0.is_preposition) {
            if ((((tok = AddressItemToken.m_ontology.try_parse(t, TerminParseAttr.NO)))) === null) {
                if (t.begin_char < t.end_char) 
                    return null;
                if (!t.is_char_of("КСкс")) 
                    t = t.next;
                prepos = true;
            }
        }
        if (tok === null) 
            tok = AddressItemToken.m_ontology.try_parse(t, TerminParseAttr.NO);
        let t1 = t;
        let _typ = AddressItemTokenItemType.NUMBER;
        let house_typ = AddressHouseType.UNDEFINED;
        let build_typ = AddressBuildingType.UNDEFINED;
        if (tok !== null) {
            if (t.is_value("УЖЕ", null)) 
                return null;
            if (tok.termin.canonic_text === "ТАМ ЖЕ") {
                let cou = 0;
                for (let tt = t.previous; tt !== null; tt = tt.previous) {
                    if (cou > 1000) 
                        break;
                    let r = tt.get_referent();
                    if (r === null) 
                        continue;
                    if (r instanceof AddressReferent) {
                        let g = Utils.as(r.get_slot_value(AddressReferent.ATTR_GEO), GeoReferent);
                        if (g !== null) 
                            return AddressItemToken._new83(AddressItemTokenItemType.CITY, t, tok.end_token, g);
                        break;
                    }
                    else if (r instanceof GeoReferent) {
                        let g = Utils.as(r, GeoReferent);
                        if (!g.is_state) 
                            return AddressItemToken._new83(AddressItemTokenItemType.CITY, t, tok.end_token, g);
                    }
                }
                return null;
            }
            if (tok.termin.tag instanceof AddressDetailType) 
                return AddressItemToken.try_attach_detail(t);
            t1 = tok.end_token.next;
            if (tok.termin.tag instanceof AddressItemTokenItemType) {
                if (tok.termin.tag2 instanceof AddressHouseType) 
                    house_typ = AddressHouseType.of(tok.termin.tag2);
                if (tok.termin.tag2 instanceof AddressBuildingType) 
                    build_typ = AddressBuildingType.of(tok.termin.tag2);
                _typ = AddressItemTokenItemType.of(tok.termin.tag);
                if (_typ === AddressItemTokenItemType.PREFIX) {
                    for (; t1 !== null; t1 = t1.next) {
                        if (((t1.morph.class0.is_preposition || t1.morph.class0.is_conjunction)) && t1.whitespaces_after_count === 1) 
                            continue;
                        if (t1.is_char(':')) {
                            t1 = t1.next;
                            break;
                        }
                        if (t1.is_char('(')) {
                            let br = BracketHelper.try_parse(t1, BracketParseAttr.NO, 100);
                            if (br !== null && (br.length_char < 50)) {
                                t1 = br.end_token;
                                continue;
                            }
                        }
                        if (t1 instanceof TextToken) {
                            if (t1.chars.is_all_lower || (t1.whitespaces_before_count < 3)) {
                                let npt = NounPhraseHelper.try_parse(t1, NounPhraseParseAttr.NO, 0, null);
                                if (npt !== null) {
                                    t1 = npt.end_token;
                                    continue;
                                }
                            }
                        }
                        if (t1.is_value("УКАЗАННЫЙ", null) || t1.is_value("ЕГРИП", null) || t1.is_value("ФАКТИЧЕСКИЙ", null)) 
                            continue;
                        if (t1.is_comma) {
                            if (t1.next !== null && t1.next.is_value("УКАЗАННЫЙ", null)) 
                                continue;
                        }
                        break;
                    }
                    if (t1 !== null) {
                        let t0 = t;
                        if (((t0.previous !== null && !t0.is_newline_before && t0.previous.is_char(')')) && (t0.previous.previous instanceof TextToken) && t0.previous.previous.previous !== null) && t0.previous.previous.previous.is_char('(')) {
                            t = t0.previous.previous.previous.previous;
                            if (t !== null && t.get_morph_class_in_dictionary().is_adjective && !t.is_newline_after) 
                                t0 = t;
                        }
                        let res = new AddressItemToken(AddressItemTokenItemType.PREFIX, t0, t1.previous);
                        for (let tt = t0.previous; tt !== null; tt = tt.previous) {
                            if (tt.newlines_after_count > 3) 
                                break;
                            if (tt.is_comma_and || tt.is_char_of("().")) 
                                continue;
                            if (!((tt instanceof TextToken))) 
                                break;
                            if (((tt.is_value("ПОЧТОВЫЙ", null) || tt.is_value("ЮРИДИЧЕСКИЙ", null) || tt.is_value("ЮР", null)) || tt.is_value("ФАКТИЧЕСКИЙ", null) || tt.is_value("ФАКТ", null)) || tt.is_value("ПОЧТ", null) || tt.is_value("АДРЕС", null)) 
                                res.begin_token = tt;
                            else 
                                break;
                        }
                        return res;
                    }
                    else 
                        return null;
                }
                else if (_typ === AddressItemTokenItemType.BUSINESSCENTER) {
                    let rt = t.kit.process_referent("ORGANIZATION", t);
                    if (rt !== null) 
                        return AddressItemToken._new94(_typ, t, rt.end_token, rt);
                }
                else if ((_typ === AddressItemTokenItemType.CORPUSORFLAT && !tok.is_whitespace_before && !tok.is_whitespace_after) && tok.begin_token === tok.end_token && tok.begin_token.is_value("К", null)) 
                    _typ = AddressItemTokenItemType.CORPUS;
                if (_typ === AddressItemTokenItemType.DETAIL && t.is_value("У", null)) {
                    if (!MiscLocationHelper.check_geo_object_before(t)) 
                        return null;
                }
                if (_typ === AddressItemTokenItemType.FLAT && t.is_value("КВ", null)) {
                    if (t.get_source_text() === "кВ") 
                        return null;
                }
                if (_typ === AddressItemTokenItemType.KILOMETER || _typ === AddressItemTokenItemType.FLOOR || _typ === AddressItemTokenItemType.POTCH) 
                    return new AddressItemToken(_typ, t, tok.end_token);
                if ((_typ === AddressItemTokenItemType.HOUSE || _typ === AddressItemTokenItemType.BUILDING || _typ === AddressItemTokenItemType.CORPUS) || _typ === AddressItemTokenItemType.PLOT) {
                    if (t1 !== null && ((t1.morph.class0.is_preposition || t1.morph.class0.is_conjunction)) && (t1.whitespaces_after_count < 2)) {
                        let tok2 = AddressItemToken.m_ontology.try_parse(t1.next, TerminParseAttr.NO);
                        if (tok2 !== null && (tok2.termin.tag instanceof AddressItemTokenItemType)) {
                            let typ2 = AddressItemTokenItemType.of(tok2.termin.tag);
                            if (typ2 !== _typ && ((typ2 === AddressItemTokenItemType.PLOT || ((typ2 === AddressItemTokenItemType.HOUSE && _typ === AddressItemTokenItemType.PLOT))))) {
                                _typ = typ2;
                                if (tok.termin.tag2 instanceof AddressHouseType) 
                                    house_typ = AddressHouseType.of(tok.termin.tag2);
                                t1 = tok2.end_token.next;
                                if (t1 === null) 
                                    return AddressItemToken._new95(_typ, t, tok2.end_token, "0", house_typ);
                            }
                        }
                    }
                }
                if (_typ !== AddressItemTokenItemType.NUMBER) {
                    if (t1 === null && t.length_char > 1) 
                        return AddressItemToken._new96(_typ, t, tok.end_token, house_typ, build_typ);
                    if ((t1 instanceof NumberToken) && (t1).value === "0") 
                        return AddressItemToken._new97(_typ, t, t1, "0", house_typ, build_typ);
                }
            }
        }
        if (t1 !== null && t1.is_char('.') && t1.next !== null) {
            if (!t1.is_whitespace_after) 
                t1 = t1.next;
            else if ((t1.next instanceof NumberToken) && (t1.next).typ === NumberSpellingType.DIGIT && (t1.whitespaces_after_count < 2)) 
                t1 = t1.next;
        }
        if ((t1 !== null && !t1.is_whitespace_after && ((t1.is_hiphen || t1.is_char('_')))) && (t1.next instanceof NumberToken)) 
            t1 = t1.next;
        tok = AddressItemToken.m_ontology.try_parse(t1, TerminParseAttr.NO);
        if (tok !== null && (tok.termin.tag instanceof AddressItemTokenItemType) && (AddressItemTokenItemType.of(tok.termin.tag)) === AddressItemTokenItemType.NUMBER) 
            t1 = tok.end_token.next;
        else if (tok !== null && (tok.termin.tag instanceof AddressItemTokenItemType) && (AddressItemTokenItemType.of(tok.termin.tag)) === AddressItemTokenItemType.NONUMBER) {
            let re0 = AddressItemToken._new97(_typ, t, tok.end_token, "0", house_typ, build_typ);
            if (!re0.is_whitespace_after && (re0.end_token.next instanceof NumberToken)) {
                re0.end_token = re0.end_token.next;
                re0.value = (re0.end_token).value.toString();
            }
            return re0;
        }
        else if (t1 !== null) {
            if (_typ === AddressItemTokenItemType.FLAT) {
                let tok2 = AddressItemToken.m_ontology.try_parse(t1, TerminParseAttr.NO);
                if (tok2 !== null && (AddressItemTokenItemType.of(tok2.termin.tag)) === AddressItemTokenItemType.FLAT) 
                    t1 = tok2.end_token.next;
            }
            if (t1.is_value("СТРОИТЕЛЬНЫЙ", null) && t1.next !== null) 
                t1 = t1.next;
            let ttt = MiscHelper.check_number_prefix(t1);
            if (ttt !== null) {
                t1 = ttt;
                if (t1.is_hiphen || t1.is_char('_')) 
                    t1 = t1.next;
            }
        }
        if (t1 === null) 
            return null;
        let num = new StringBuilder();
        let nt = Utils.as(t1, NumberToken);
        let re11 = null;
        if (nt !== null) {
            if (nt.int_value === null || nt.int_value === 0) 
                return null;
            num.append(nt.value);
            if (nt.typ === NumberSpellingType.DIGIT || nt.typ === NumberSpellingType.WORDS) {
                if (((nt.end_token instanceof TextToken) && (nt.end_token).term === "Е" && nt.end_token.previous === nt.begin_token) && !nt.end_token.is_whitespace_before) 
                    num.append("Е");
                let drob = false;
                let hiph = false;
                let lit = false;
                let et = nt.next;
                if (et !== null && ((et.is_char_of("\\/") || et.is_value("ДРОБЬ", null)))) {
                    drob = true;
                    et = et.next;
                    if (et !== null && et.is_char_of("\\/")) 
                        et = et.next;
                    t1 = et;
                }
                else if (et !== null && ((et.is_hiphen || et.is_char('_')))) {
                    hiph = true;
                    et = et.next;
                }
                else if ((et !== null && et.is_char('.') && (et.next instanceof NumberToken)) && !et.is_whitespace_after) 
                    return null;
                if (et instanceof NumberToken) {
                    if (drob) {
                        num.append("/").append((et).value);
                        drob = false;
                        t1 = et;
                        et = et.next;
                        if (et !== null && et.is_char_of("\\/") && (et.next instanceof NumberToken)) {
                            t1 = et.next;
                            num.append("/").append((t1).value);
                            et = t1.next;
                        }
                    }
                    else if ((hiph && !t1.is_whitespace_after && (et instanceof NumberToken)) && !et.is_whitespace_before) {
                        let numm = AddressItemToken.try_parse(et, null, false, true, null);
                        if (numm !== null && numm.typ === AddressItemTokenItemType.NUMBER) {
                            let merge = false;
                            if (_typ === AddressItemTokenItemType.FLAT || _typ === AddressItemTokenItemType.PLOT) 
                                merge = true;
                            else if (_typ === AddressItemTokenItemType.HOUSE || _typ === AddressItemTokenItemType.BUILDING || _typ === AddressItemTokenItemType.CORPUS) {
                                let ttt = numm.end_token.next;
                                if (ttt !== null && ttt.is_comma) 
                                    ttt = ttt.next;
                                let numm2 = AddressItemToken.try_parse(ttt, null, false, true, null);
                                if (numm2 !== null) {
                                    if ((numm2.typ === AddressItemTokenItemType.FLAT || numm2.typ === AddressItemTokenItemType.BUILDING || ((numm2.typ === AddressItemTokenItemType.CORPUSORFLAT && numm2.value !== null))) || numm2.typ === AddressItemTokenItemType.CORPUS) 
                                        merge = true;
                                }
                            }
                            if (merge) {
                                num.append("/").append(numm.value);
                                t1 = numm.end_token;
                                et = t1.next;
                            }
                        }
                    }
                }
                else if (et !== null && ((et.is_hiphen || et.is_char('_') || et.is_value("НЕТ", null))) && drob) 
                    t1 = et;
                let ett = et;
                if ((ett !== null && ett.is_char_of(",.") && (ett.whitespaces_after_count < 2)) && (ett.next instanceof TextToken) && BracketHelper.is_bracket(ett.next, false)) 
                    ett = ett.next;
                if (((BracketHelper.is_bracket(ett, false) && (ett.next instanceof TextToken) && ett.next.length_char === 1) && ett.next.is_letters && BracketHelper.is_bracket(ett.next.next, false)) && !ett.is_whitespace_after && !ett.next.is_whitespace_after) {
                    let ch = AddressItemToken.correct_char_token(ett.next);
                    if (ch === null) 
                        return null;
                    num.append(ch);
                    t1 = ett.next.next;
                }
                else if (BracketHelper.can_be_start_of_sequence(ett, true, false) && (ett.whitespaces_before_count < 2)) {
                    let br = BracketHelper.try_parse(ett, BracketParseAttr.NO, 100);
                    if (br !== null && (br.begin_token.next instanceof TextToken) && br.begin_token.next.next === br.end_token) {
                        let s = AddressItemToken.correct_char_token(br.begin_token.next);
                        if (s !== null) {
                            num.append(s);
                            t1 = br.end_token;
                        }
                    }
                }
                else if ((et instanceof TextToken) && (et).length_char === 1) {
                    let s = AddressItemToken.correct_char_token(et);
                    if (s !== null) {
                        if (((s === "К" || s === "С")) && (et.next instanceof NumberToken) && !et.is_whitespace_after) {
                        }
                        else if ((s === "Б" && et.next !== null && et.next.is_char_of("/\\")) && (et.next.next instanceof TextToken) && et.next.next.is_value("Н", null)) 
                            t1 = (et = et.next.next);
                        else {
                            let ok = false;
                            if (drob || hiph || lit) 
                                ok = true;
                            else if (!et.is_whitespace_before || ((et.whitespaces_before_count === 1 && et.chars.is_all_upper))) {
                                ok = true;
                                if (et.next instanceof NumberToken) {
                                    if (!et.is_whitespace_before && et.is_whitespace_after) {
                                    }
                                    else 
                                        ok = false;
                                }
                            }
                            else if (((et.next === null || et.next.is_comma)) && (et.whitespaces_before_count < 2)) 
                                ok = true;
                            else if (et.is_whitespace_before && et.chars.is_all_lower && et.is_value("В", "У")) {
                            }
                            else {
                                let ait_next = AddressItemToken.try_parse(et.next, null, false, true, null);
                                if (ait_next !== null) {
                                    if ((ait_next.typ === AddressItemTokenItemType.CORPUS || ait_next.typ === AddressItemTokenItemType.FLAT || ait_next.typ === AddressItemTokenItemType.BUILDING) || ait_next.typ === AddressItemTokenItemType.OFFICE) 
                                        ok = true;
                                }
                            }
                            if (ok) {
                                num.append(s);
                                t1 = et;
                                if (et.next !== null && et.next.is_char_of("\\/") && et.next.next !== null) {
                                    if (et.next.next instanceof NumberToken) {
                                        num.append("/").append((et.next.next).value);
                                        t1 = (et = et.next.next);
                                    }
                                    else if (et.next.next.is_hiphen || et.next.next.is_char('_') || et.next.next.is_value("НЕТ", null)) 
                                        t1 = (et = et.next.next);
                                }
                            }
                        }
                    }
                }
                else if ((et instanceof TextToken) && !et.is_whitespace_before) {
                    let val = (et).term;
                    if (val === "КМ" && _typ === AddressItemTokenItemType.HOUSE) {
                        t1 = et;
                        num.append("КМ");
                    }
                    else if (val === "БН") 
                        t1 = et;
                    else if (((val.length === 2 && val[1] === 'Б' && et.next !== null) && et.next.is_char_of("\\/") && et.next.next !== null) && et.next.next.is_value("Н", null)) {
                        num.append(val[0]);
                        t1 = (et = et.next.next);
                    }
                }
            }
        }
        else if ((((re11 = AddressItemToken._try_attachvch(t1, _typ)))) !== null) {
            re11.begin_token = t;
            re11.house_type = house_typ;
            re11.building_type = build_typ;
            return re11;
        }
        else if (((t1 instanceof TextToken) && t1.length_char === 2 && t1.is_letters) && !t1.is_whitespace_before && (t1.previous instanceof NumberToken)) {
            let src = t1.get_source_text();
            if ((src !== null && src.length === 2 && ((src[0] === 'к' || src[0] === 'k'))) && Utils.isUpperCase(src[1])) {
                let ch = AddressItemToken.correct_char(src[1]);
                if (ch !== (String.fromCharCode(0))) 
                    return AddressItemToken._new84(AddressItemTokenItemType.CORPUS, t1, t1, (ch));
            }
        }
        else if ((t1 instanceof TextToken) && t1.length_char === 1 && t1.is_letters) {
            let ch = AddressItemToken.correct_char_token(t1);
            if (ch !== null) {
                if (_typ === AddressItemTokenItemType.NUMBER) 
                    return null;
                if (ch === "К" || ch === "С") {
                    if (!t1.is_whitespace_after && (t1.next instanceof NumberToken)) 
                        return null;
                }
                if (ch === "Д" && _typ === AddressItemTokenItemType.PLOT) {
                    let rrr = AddressItemToken._try_parse(t1, null, false, true, null);
                    if (rrr !== null) {
                        rrr.typ = AddressItemTokenItemType.PLOT;
                        rrr.begin_token = t;
                        return rrr;
                    }
                }
                if (t1.chars.is_all_lower && ((t1.morph.class0.is_preposition || t1.morph.class0.is_conjunction))) {
                    if ((t1.whitespaces_after_count < 2) && t1.next.chars.is_letter) 
                        return null;
                }
                if (t.chars.is_all_upper && t.length_char === 1 && t.next.is_char('.')) 
                    return null;
                num.append(ch);
                if ((t1.next !== null && ((t1.next.is_hiphen || t1.next.is_char('_'))) && !t1.is_whitespace_after) && (t1.next.next instanceof NumberToken) && !t1.next.is_whitespace_after) {
                    num.append((t1.next.next).value);
                    t1 = t1.next.next;
                }
                else if ((t1.next instanceof NumberToken) && !t1.is_whitespace_after && t1.chars.is_all_upper) {
                    num.append((t1.next).value);
                    t1 = t1.next;
                }
                if (num.length === 1 && _typ === AddressItemTokenItemType.OFFICE) 
                    return null;
            }
            if (_typ === AddressItemTokenItemType.BOX && num.length === 0) {
                let rom = NumberHelper.try_parse_roman(t1);
                if (rom !== null) 
                    return AddressItemToken._new84(_typ, t, rom.end_token, rom.value.toString());
            }
        }
        else if (((BracketHelper.is_bracket(t1, false) && (t1.next instanceof TextToken) && t1.next.length_char === 1) && t1.next.is_letters && BracketHelper.is_bracket(t1.next.next, false)) && !t1.is_whitespace_after && !t1.next.is_whitespace_after) {
            let ch = AddressItemToken.correct_char_token(t1.next);
            if (ch === null) 
                return null;
            num.append(ch);
            t1 = t1.next.next;
        }
        else if ((t1 instanceof TextToken) && ((((t1.length_char === 1 && ((t1.is_hiphen || t1.is_char('_'))))) || t1.is_value("НЕТ", null) || t1.is_value("БН", null))) && (((_typ === AddressItemTokenItemType.CORPUS || _typ === AddressItemTokenItemType.CORPUSORFLAT || _typ === AddressItemTokenItemType.BUILDING) || _typ === AddressItemTokenItemType.HOUSE || _typ === AddressItemTokenItemType.FLAT))) {
            while (t1.next !== null && ((t1.next.is_hiphen || t1.next.is_char('_'))) && !t1.is_whitespace_after) {
                t1 = t1.next;
            }
            let val = null;
            if (!t1.is_whitespace_after && (t1.next instanceof NumberToken)) {
                t1 = t1.next;
                val = (t1).value.toString();
            }
            if (t1.is_value("БН", null)) 
                val = "0";
            return AddressItemToken._new84(_typ, t, t1, val);
        }
        else {
            if (((_typ === AddressItemTokenItemType.FLOOR || _typ === AddressItemTokenItemType.KILOMETER || _typ === AddressItemTokenItemType.POTCH)) && (t.previous instanceof NumberToken)) 
                return new AddressItemToken(_typ, t, t1.previous);
            if ((t1 instanceof ReferentToken) && (t1.get_referent() instanceof DateReferent)) {
                let nn = AddressItemToken._try_parse((t1).begin_token, loc_streets, prefix_before, true, null);
                if (nn !== null && nn.end_char === t1.end_char && nn.typ === AddressItemTokenItemType.NUMBER) {
                    nn.begin_token = t;
                    nn.end_token = t1;
                    nn.typ = _typ;
                    return nn;
                }
            }
            if ((t1 instanceof TextToken) && ((_typ === AddressItemTokenItemType.HOUSE || _typ === AddressItemTokenItemType.BUILDING || _typ === AddressItemTokenItemType.CORPUS))) {
                let ter = (t1).term;
                if (ter === "АБ" || ter === "АБВ" || ter === "МГУ") 
                    return AddressItemToken._new97(_typ, t, t1, ter, house_typ, build_typ);
                if (prev !== null && ((prev.typ === AddressItemTokenItemType.STREET || prev.typ === AddressItemTokenItemType.CITY)) && t1.chars.is_all_upper) 
                    return AddressItemToken._new97(_typ, t, t1, ter, house_typ, build_typ);
            }
            if (_typ === AddressItemTokenItemType.BOX) {
                let rom = NumberHelper.try_parse_roman(t1);
                if (rom !== null) 
                    return AddressItemToken._new84(_typ, t, rom.end_token, rom.value.toString());
            }
            if (_typ === AddressItemTokenItemType.PLOT && t1 !== null) {
                if ((t1.is_value("ОКОЛО", null) || t1.is_value("РЯДОМ", null) || t1.is_value("НАПРОТИВ", null)) || t1.is_value("БЛИЗЬКО", null) || t1.is_value("НАВПАКИ", null)) 
                    return AddressItemToken._new84(_typ, t, t1, t1.get_source_text().toLowerCase());
            }
            return null;
        }
        if (_typ === AddressItemTokenItemType.NUMBER && prepos) 
            return null;
        if (t1 === null) {
            t1 = t;
            while (t1.next !== null) {
                t1 = t1.next;
            }
        }
        return AddressItemToken._new106(_typ, t, t1, num.toString(), t.morph, house_typ, build_typ);
    }
    
    static _try_attachvch(t, ty) {
        if (t === null) 
            return null;
        for (let tt = t; tt !== null; tt = tt.next) {
            if ((((tt.is_value("В", null) || tt.is_value("B", null))) && tt.next !== null && tt.next.is_char_of("./\\")) && (tt.next.next instanceof TextToken) && tt.next.next.is_value("Ч", null)) {
                tt = tt.next.next;
                if (tt.next !== null && tt.next.is_char('.')) 
                    tt = tt.next;
                let tt2 = MiscHelper.check_number_prefix(tt.next);
                if (tt2 !== null) 
                    tt = tt2;
                if (tt.next !== null && (tt.next instanceof NumberToken) && (tt.whitespaces_after_count < 2)) 
                    tt = tt.next;
                return AddressItemToken._new84(ty, t, tt, "В/Ч");
            }
            else if (((tt.is_value("ВОЙСКОВОЙ", null) || tt.is_value("ВОИНСКИЙ", null))) && tt.next !== null && tt.next.is_value("ЧАСТЬ", null)) {
                tt = tt.next;
                let tt2 = MiscHelper.check_number_prefix(tt.next);
                if (tt2 !== null) 
                    tt = tt2;
                if (tt.next !== null && (tt.next instanceof NumberToken) && (tt.whitespaces_after_count < 2)) 
                    tt = tt.next;
                return AddressItemToken._new84(ty, t, tt, "В/Ч");
            }
            else if (ty === AddressItemTokenItemType.FLAT) {
                if (tt.whitespaces_before_count > 1) 
                    break;
                if (!((tt instanceof TextToken))) 
                    break;
                if ((tt).term.startsWith("ОБЩ")) {
                    if (tt.next !== null && tt.next.is_char('.')) 
                        tt = tt.next;
                    let re = AddressItemToken._try_attachvch(tt.next, ty);
                    if (re !== null) 
                        return re;
                    return AddressItemToken._new84(ty, t, tt, "ОБЩ");
                }
                if (tt.chars.is_all_upper && tt.length_char > 1) {
                    let re = AddressItemToken._new84(ty, t, tt, (tt).term);
                    if ((tt.whitespaces_after_count < 2) && (tt.next instanceof TextToken) && tt.next.chars.is_all_upper) {
                        tt = tt.next;
                        re.end_token = tt;
                        re.value += (tt).term;
                    }
                    return re;
                }
                break;
            }
            else 
                break;
        }
        return null;
    }
    
    static try_attach_detail(t) {
        if (t === null || ((t instanceof ReferentToken))) 
            return null;
        let tt = t;
        if (t.chars.is_capital_upper && !t.morph.class0.is_preposition) 
            return null;
        let tok = AddressItemToken.m_ontology.try_parse(t, TerminParseAttr.NO);
        if (tok === null && t.morph.class0.is_preposition && t.next !== null) {
            tt = t.next;
            if (tt instanceof NumberToken) {
            }
            else {
                if (tt.chars.is_capital_upper && !tt.morph.class0.is_preposition) 
                    return null;
                tok = AddressItemToken.m_ontology.try_parse(tt, TerminParseAttr.NO);
            }
        }
        let res = null;
        let first_num = false;
        if (tok === null) {
            if (tt instanceof NumberToken) {
                first_num = true;
                let nex = NumberHelper.try_parse_number_with_postfix(tt);
                if (nex !== null && ((nex.ex_typ === NumberExType.METER || nex.ex_typ === NumberExType.KILOMETER))) {
                    res = new AddressItemToken(AddressItemTokenItemType.DETAIL, t, nex.end_token);
                    let tyy = NumberExType.METER;
                    let wraptyy111 = new RefOutArgWrapper(tyy);
                    res.detail_meters = Math.floor(nex.normalize_value(wraptyy111));
                    tyy = wraptyy111.value;
                }
            }
            if (res === null) 
                return null;
        }
        else {
            if (!((tok.termin.tag instanceof AddressDetailType))) 
                return null;
            if (t.is_value("У", null)) {
                if (MiscLocationHelper.check_geo_object_before(t)) {
                }
                else if (MiscLocationHelper.check_geo_object_after(t, false)) {
                }
                else 
                    return null;
            }
            res = AddressItemToken._new112(AddressItemTokenItemType.DETAIL, t, tok.end_token, AddressDetailType.of(tok.termin.tag));
        }
        for (tt = res.end_token.next; tt !== null; tt = tt.next) {
            if (tt instanceof ReferentToken) 
                break;
            if (!tt.morph.class0.is_preposition) {
                if (tt.chars.is_capital_upper || tt.chars.is_all_upper) 
                    break;
            }
            tok = AddressItemToken.m_ontology.try_parse(tt, TerminParseAttr.NO);
            if (tok !== null && (tok.termin.tag instanceof AddressDetailType)) {
                let ty = AddressDetailType.of(tok.termin.tag);
                if (ty !== AddressDetailType.UNDEFINED) {
                    if (ty === AddressDetailType.NEAR && res.detail_type !== AddressDetailType.UNDEFINED && res.detail_type !== ty) {
                    }
                    else 
                        res.detail_type = ty;
                }
                res.end_token = (tt = tok.end_token);
                continue;
            }
            if (tt.is_value("ОРИЕНТИР", null) || tt.is_value("НАПРАВЛЕНИЕ", null) || tt.is_value("ОТ", null)) {
                res.end_token = tt;
                continue;
            }
            if (tt.is_comma || tt.morph.class0.is_preposition) 
                continue;
            if ((tt instanceof NumberToken) && tt.next !== null) {
                let nex = NumberHelper.try_parse_number_with_postfix(tt);
                if (nex !== null && ((nex.ex_typ === NumberExType.METER || nex.ex_typ === NumberExType.KILOMETER))) {
                    res.end_token = (tt = nex.end_token);
                    let tyy = NumberExType.METER;
                    let wraptyy113 = new RefOutArgWrapper(tyy);
                    res.detail_meters = Math.floor(nex.normalize_value(wraptyy113));
                    tyy = wraptyy113.value;
                    continue;
                }
            }
            break;
        }
        if (first_num && res.detail_type === AddressDetailType.UNDEFINED) 
            return null;
        if (res !== null && res.end_token.next !== null && res.end_token.next.morph.class0.is_preposition) {
            if (res.end_token.whitespaces_after_count === 1 && res.end_token.next.whitespaces_after_count === 1) 
                res.end_token = res.end_token.next;
        }
        return res;
    }
    
    static try_attach_org(t) {
        if (!((t instanceof TextToken))) 
            return null;
        if ((t.length_char > 5 && !t.chars.is_all_upper && !t.chars.is_all_lower) && !t.chars.is_capital_upper) {
            let namm = (t).get_source_text();
            if (Utils.isUpperCase(namm[0]) && Utils.isUpperCase(namm[1])) {
                for (let i = 0; i < namm.length; i++) {
                    if (Utils.isLowerCase(namm[i]) && i > 2) {
                        let abbr = namm.substring(0, 0 + i - 1);
                        let te = Termin._new114(abbr, abbr);
                        let li = AddressItemToken.m_org_ontology.try_attach(te);
                        if (li !== null && li.length > 0) {
                            let org00 = t.kit.create_referent("ORGANIZATION");
                            org00.add_slot("TYPE", li[0].canonic_text.toLowerCase(), false, 0);
                            org00.add_slot("TYPE", abbr, false, 0);
                            namm = (t).term.substring(i - 1);
                            let rt00 = new ReferentToken(org00, t, t);
                            rt00.data = t.kit.get_analyzer_data_by_analyzer_name("ORGANIZATION");
                            if (t.next !== null && t.next.is_hiphen) {
                                if (t.next.next instanceof NumberToken) {
                                    org00.add_slot("NUMBER", (t.next.next).value.toString(), false, 0);
                                    rt00.end_token = t.next.next;
                                }
                                else if ((t.next.next instanceof TextToken) && !t.next.is_whitespace_after) {
                                    namm = (namm + "-" + (t.next.next).term);
                                    rt00.end_token = t.next.next;
                                }
                            }
                            org00.add_slot("NAME", namm, false, 0);
                            return AddressItemToken._new115(AddressItemTokenItemType.STREET, t, rt00.end_token, rt00.referent, rt00, true);
                        }
                        break;
                    }
                }
            }
        }
        if (t.is_value("СТ", null)) {
        }
        let rt = null;
        let _typ = null;
        let typ2 = null;
        let nam = null;
        let num = null;
        let t1 = null;
        let ok = false;
        let tok = AddressItemToken.m_org_ontology.try_parse(t, TerminParseAttr.NO);
        let rt1 = t.kit.process_referent("ORGANIZATION", t);
        if (rt1 === null) {
            rt1 = t.kit.process_referent("NAMEDENTITY", t);
            if (rt1 !== null) {
                let tyy = rt1.referent.get_string_value("TYPE");
                if (((tyy === "аэропорт" || tyy === "аэродром" || tyy === "заказник") || tyy === "лес" || tyy === "заповедник") || tyy === "сад") {
                }
                else 
                    rt1 = null;
            }
        }
        else {
            if (rt1.referent.find_slot("TYPE", "ОПС", true) !== null) 
                return null;
            for (let tt = rt1.begin_token.next; tt !== null && (tt.end_char < rt1.end_char); tt = tt.next) {
                if (tt.is_comma) {
                    rt1.end_token = tt.previous;
                    if (tt.next instanceof ReferentToken) {
                        let s = rt1.referent.find_slot(null, tt.next.get_referent(), true);
                        if (s !== null) 
                            Utils.removeItem(rt1.referent.slots, s);
                    }
                }
            }
            for (let tt = rt1.end_token.next; tt !== null; tt = tt.next) {
                if (tt.is_hiphen || tt.is_comma) {
                }
                else if ((tt instanceof TextToken) && (tt).term === "ПМК") {
                    let tt2 = tt.next;
                    if (tt2 !== null && ((tt2.is_hiphen || tt2.is_char_of(":")))) 
                        tt2 = tt2.next;
                    if (tt2 instanceof NumberToken) {
                        rt1.referent.add_slot("NUMBER", (tt2).value.toString(), false, 0);
                        rt1.end_token = tt2;
                        break;
                    }
                }
                else 
                    break;
            }
        }
        let tt1 = t.next;
        if (tt1 !== null && tt1.is_value("ПМК", null)) 
            tt1 = tt1.next;
        if (tok !== null) {
            if (tok.begin_token === tok.end_token && tok.begin_token.is_value("СП", null)) {
                tok = AddressItemToken.m_org_ontology.try_parse(tok.end_token.next, TerminParseAttr.NO);
                if (tok !== null) {
                    tok.begin_token = t;
                    ok = true;
                    tt1 = tok.end_token.next;
                }
                if (rt1 === null) {
                    if ((((rt1 = t.kit.process_referent("ORGANIZATION", t.next)))) !== null) 
                        rt1.begin_token = t;
                }
            }
            else if (tok.begin_token === tok.end_token && tok.begin_token.is_value("ГПК", null)) {
                tt1 = tok.end_token.next;
                if (tt1 === null || tok.is_newline_after || !((tt1 instanceof TextToken))) 
                    return null;
                if (tt1.kit.process_referent("GEO", tt1) !== null) 
                    return null;
                if (tt1.chars.is_all_upper || BracketHelper.can_be_start_of_sequence(tt1, true, false)) {
                }
                else 
                    return null;
            }
            else {
                ok = true;
                tt1 = tok.end_token.next;
            }
            let tok2 = AddressItemToken.m_org_ontology.try_parse(tt1, TerminParseAttr.NO);
            if (tok2 !== null) {
                tt1 = tok2.end_token.next;
                tok2 = AddressItemToken.m_org_ontology.try_parse(tt1, TerminParseAttr.NO);
                if (tok2 !== null) 
                    tt1 = tok2.end_token.next;
            }
            while (tt1 !== null) {
                if (tt1.is_value("ОБЩЕСТВО", null) || tt1.is_value("ТЕРРИТОРИЯ", null) || tt1.is_value("ПМК", null)) 
                    tt1 = tt1.next;
                else 
                    break;
            }
            if ((tt1 instanceof TextToken) && tt1.chars.is_all_lower && ((tt1.length_char === 2 || tt1.length_char === 3))) {
                if (tt1.whitespaces_before_count < 2) {
                    if (AddressItemToken.check_house_after(tt1, false, false)) 
                        return null;
                    tt1 = tt1.next;
                }
            }
        }
        else if (t.length_char > 1 && t.chars.is_cyrillic_letter) {
            let nt2 = t;
            let num2 = null;
            if (t.chars.is_all_upper) {
                if (t.is_value("ФЗ", null) || t.is_value("ФКЗ", null)) 
                    return null;
                ok = true;
            }
            else if (t.chars.is_all_lower && t.get_morph_class_in_dictionary().is_undefined && !t.is_value("ПСЕВДО", null)) 
                ok = true;
            for (let tt2 = t.next; tt2 !== null; tt2 = tt2.next) {
                if (tt2.whitespaces_before_count > 2) 
                    break;
                let ooo = AddressItemToken.m_org_ontology.try_parse(tt2, TerminParseAttr.NO);
                if (ooo !== null) {
                    let oooo = AddressItemToken.try_attach_org(tt2);
                    if (oooo === null) {
                        ok = true;
                        tok = ooo;
                        _typ = tok.termin.canonic_text.toLowerCase();
                        typ2 = tok.termin.acronym;
                        nam = MiscHelper.get_text_value(t, nt2, GetTextAttr.NO);
                        if (num2 instanceof NumberToken) 
                            num = (num2).value.toString();
                        t1 = nt2;
                    }
                    break;
                }
                if (tt2.is_hiphen) 
                    continue;
                if (tt2.is_value("ИМ", null)) {
                    if (tt2.next !== null && tt2.next.is_char('.')) 
                        tt2 = tt2.next;
                    continue;
                }
                if (tt2 instanceof NumberToken) {
                    num2 = tt2;
                    continue;
                }
                let nuuu = NumberHelper.try_parse_age(tt2);
                if (nuuu !== null) {
                    num = (nuuu).value.toString();
                    num2 = nuuu;
                    tt2 = nuuu.end_token;
                    continue;
                }
                if (!((tt2 instanceof TextToken)) || !tt2.chars.is_cyrillic_letter) 
                    break;
                if (tt2.chars.is_all_lower) {
                    let nnn = NounPhraseHelper.try_parse(tt2.previous, NounPhraseParseAttr.NO, 0, null);
                    if (nnn !== null && nnn.end_token === tt2) {
                    }
                    else if (tt2.get_morph_class_in_dictionary().is_noun && tt2.morph._case.is_genitive) {
                    }
                    else 
                        break;
                }
                nt2 = tt2;
            }
        }
        else if (BracketHelper.is_bracket(t, true)) {
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (br !== null) {
                if (AddressItemToken.check_house_after(br.end_token.next, false, false)) {
                    tt1 = t;
                    ok = true;
                }
                else {
                    let txt = Utils.notNull(MiscHelper.get_text_value(br.begin_token, br.end_token, GetTextAttr.NO), "");
                    if ((txt.includes("БИЗНЕС") || txt.includes("БІЗНЕС") || txt.includes("ПЛАЗА")) || txt.includes("PLAZA")) {
                        tt1 = t;
                        ok = true;
                    }
                }
            }
        }
        let bracks = false;
        let is_very_doubt = false;
        if (ok && BracketHelper.is_bracket(tt1, false)) {
            let br = BracketHelper.try_parse(tt1, BracketParseAttr.NO, 100);
            if (br !== null && (br.length_char < 100)) {
                let res1 = AddressItemToken.try_attach_org(tt1.next);
                if (res1 !== null && res1.ref_token !== null) {
                    if (res1.end_token === br.end_token || res1.end_token === br.end_token.previous) {
                        res1.ref_token.begin_token = res1.begin_token = t;
                        res1.ref_token.end_token = res1.end_token = br.end_token;
                        res1.ref_token.referent.add_slot("TYPE", (tok === null ? t.get_source_text().toUpperCase() : tok.termin.canonic_text.toLowerCase()), false, 0);
                        return res1;
                    }
                }
                _typ = (tok === null ? ((t === tt1 ? null : MiscHelper.get_text_value(t, t, GetTextAttr.NO))) : tok.termin.canonic_text.toLowerCase());
                if (tok !== null) 
                    typ2 = tok.termin.acronym;
                let tt = br.end_token.previous;
                if (tt instanceof NumberToken) {
                    num = (tt).value.toString();
                    tt = tt.previous;
                    if (tt !== null && (((tt.is_hiphen || tt.is_char('_') || tt.is_value("N", null)) || tt.is_value("№", null)))) 
                        tt = tt.previous;
                }
                if (tt !== null) 
                    nam = MiscHelper.get_text_value(br.begin_token, tt, GetTextAttr.NO);
                t1 = br.end_token;
                bracks = true;
            }
        }
        if (ok && ((((_typ === null && ((t.chars.is_all_upper && t.length_char === 3)))) || tok !== null))) {
            let tt = tt1;
            if (tt !== null && ((tt.is_hiphen || tt.is_char('_')))) 
                tt = tt.next;
            let adt = AddressItemToken.try_parse(tt, null, false, true, null);
            if (adt !== null && adt.typ === AddressItemTokenItemType.NUMBER) {
                if (tt.previous.is_hiphen || tt.previous.is_char('_') || !((tt instanceof NumberToken))) {
                }
                else 
                    is_very_doubt = true;
                num = adt.value;
                t1 = adt.end_token;
                if (tok !== null) {
                    _typ = tok.termin.canonic_text.toLowerCase();
                    typ2 = tok.termin.acronym;
                }
            }
        }
        if (((tok !== null && _typ === null && (tt1 instanceof TextToken)) && !tt1.chars.is_all_lower && tt1.chars.is_cyrillic_letter) && (tt1.whitespaces_before_count < 3)) {
            _typ = tok.termin.canonic_text.toLowerCase();
            typ2 = tok.termin.acronym;
            nam = MiscHelper.get_text_value(tt1, tt1, GetTextAttr.NO);
            if (typ2 === "СТ" && nam === "СЭВ") 
                return null;
            t1 = tt1;
        }
        else if (((tok !== null && _typ === null && tt1 !== null) && (tt1.get_referent() instanceof GeoReferent) && (tt1.whitespaces_before_count < 3)) && (tt1).begin_token === (tt1).end_token) {
            _typ = tok.termin.canonic_text.toLowerCase();
            typ2 = tok.termin.acronym;
            nam = MiscHelper.get_text_value(tt1, tt1, GetTextAttr.NO);
            t1 = tt1;
        }
        if ((ok && _typ === null && num !== null) && t.length_char > 2 && (t.length_char < 5)) {
            let tt2 = t1.next;
            if (tt2 !== null && tt2.is_char(',')) 
                tt2 = tt2.next;
            if (tt2 !== null && (tt2.whitespaces_after_count < 2)) {
                let adt = AddressItemToken.try_parse(tt2, null, false, true, null);
                if (adt !== null) {
                    if (((adt.typ === AddressItemTokenItemType.BLOCK || adt.typ === AddressItemTokenItemType.BOX || adt.typ === AddressItemTokenItemType.BUILDING) || adt.typ === AddressItemTokenItemType.CORPUS || adt.typ === AddressItemTokenItemType.HOUSE) || adt.typ === AddressItemTokenItemType.PLOT) 
                        _typ = t.get_source_text();
                }
            }
        }
        if (_typ === null && nam !== null) {
            if (nam.includes("БИЗНЕС") || nam.includes("ПЛАЗА") || nam.includes("PLAZA")) 
                _typ = "бизнес центр";
            else if (nam.includes("БІЗНЕС")) 
                _typ = "бізнес центр";
        }
        if (_typ !== null) {
            let org = t.kit.create_referent("ORGANIZATION");
            if (org === null) 
                org = new Referent("ORGANIZATION");
            org.add_slot("TYPE", _typ, false, 0);
            if (typ2 !== null) 
                org.add_slot("TYPE", typ2, false, 0);
            if (nam !== null) {
                if ((!bracks && t1.next !== null && t1.next.chars.is_cyrillic_letter) && t1.whitespaces_after_count === 1) {
                    ok = false;
                    if (tok !== null && t1.next === tok.end_token) {
                    }
                    else if (t1.next.next === null || BracketHelper.can_be_end_of_sequence(t1.next.next, false, null, false)) 
                        ok = true;
                    else if (t1.next.next.is_char(',')) 
                        ok = true;
                    else if ((t1.next.next instanceof NumberToken) && ((t1.next.next.next === null || BracketHelper.can_be_end_of_sequence(t1.next.next.next, false, null, false)))) 
                        ok = true;
                    else if (((t1.next.next.is_hiphen || t1.next.next.is_value("N", null) || t1.next.next.is_value("№", null))) && (t1.next.next.next instanceof NumberToken)) 
                        ok = true;
                    if (ok) {
                        nam = (nam + " " + t1.next.get_source_text().toUpperCase());
                        t1 = t1.next;
                    }
                }
                else if ((((!bracks && t1.next !== null && t1.next.next !== null) && t1.next.is_hiphen && !t1.is_whitespace_after) && !t1.next.is_whitespace_after && (((t1.next.next instanceof TextToken) || (t1.next.next.get_referent() instanceof GeoReferent)))) && t1.next.next.chars.is_cyrillic_letter) {
                    nam = (nam + " " + MiscHelper.get_text_value(t1.next.next, t1.next.next, GetTextAttr.NO));
                    t1 = t1.next.next;
                }
                if ((nam.startsWith("ИМ.") || nam.startsWith("ИМ ") || nam.startsWith("ІМ.")) || nam.startsWith("ІМ ")) {
                    org.add_slot("NAME", nam.substring(3).trim(), false, 0);
                    nam = ((nam.startsWith("ІМ") ? "ІМЕНІ" : "ИМЕНИ") + " " + nam.substring(3).trim());
                }
                if (nam.startsWith("ИМЕНИ ") || nam.startsWith("ІМЕНІ ")) 
                    org.add_slot("NAME", nam.substring(6).trim(), false, 0);
                org.add_slot("NAME", nam, false, 0);
            }
            rt = ReferentToken._new116(org, t, t1, t.kit.get_analyzer_data_by_analyzer_name("ORGANIZATION"));
            let empty_org = false;
            if ((t1.next !== null && t1.next.is_hiphen && t1.next.next !== null) && t1.next.next.is_value("ГОРОДИЩЕ", null)) 
                rt.end_token = t1.next.next;
            if (t1.next !== null && t1.next.is_value("ПРИ", null)) {
                let rtt = t1.kit.process_referent("ORGANIZATION", t1.next.next);
                if (rtt !== null) {
                    empty_org = true;
                    rt.end_token = (t1 = rtt.end_token);
                }
            }
            if (t1.next !== null && t1.next.is_value("АПН", null)) 
                rt.end_token = (t1 = t1.next);
            if (t1.whitespaces_after_count < 2) {
                let rtt1 = t1.kit.process_referent("ORGANIZATION", t1.next);
                if (rtt1 !== null) {
                    empty_org = true;
                    rt.end_token = (t1 = rtt1.end_token);
                }
            }
            if (empty_org && (t1.whitespaces_after_count < 2)) {
                let terr = TerrItemToken.try_parse(t1.next, null, false, false, null);
                if (terr !== null && terr.onto_item !== null) 
                    rt.end_token = (t1 = terr.end_token);
            }
            if (num !== null) 
                org.add_slot("NUMBER", num, false, 0);
            else if (t1.next !== null && ((t1.next.is_hiphen || t1.next.is_value("№", null) || t1.next.is_value("N", null))) && (t1.next.next instanceof NumberToken)) {
                let nai = AddressItemToken.try_parse(t1.next.next, null, false, true, null);
                if (nai !== null && nai.typ === AddressItemTokenItemType.NUMBER) {
                    org.add_slot("NUMBER", nai.value, false, 0);
                    t1 = rt.end_token = nai.end_token;
                }
                else {
                    t1 = rt.end_token = t1.next.next;
                    org.add_slot("NUMBER", (t1).value.toString(), false, 0);
                }
            }
            if (tok !== null && (t1.end_char < tok.end_char)) {
                t1 = rt.end_token = tok.end_token;
                if (t1.next !== null && (t1.whitespaces_after_count < 2) && t1.next.is_value("ТЕРРИТОРИЯ", "ТЕРИТОРІЯ")) 
                    t1 = rt.end_token = t1.next;
            }
        }
        if (rt === null) 
            rt = rt1;
        else if (rt1 !== null && rt1.referent.type_name === "ORGANIZATION") {
            if (is_very_doubt) 
                rt = rt1;
            else {
                rt.referent.merge_slots(rt1.referent, true);
                if (rt1.end_char > rt.end_char) 
                    rt.end_token = rt1.end_token;
            }
        }
        if (rt === null) 
            return null;
        if (t.is_value("АО", null)) 
            return null;
        if (rt.referent.find_slot("TYPE", "администрация", true) !== null || rt.referent.find_slot("TYPE", "адміністрація", true) !== null) {
            let ge = Utils.as(rt.referent.get_slot_value("GEO"), GeoReferent);
            if (ge !== null) 
                return AddressItemToken._new83((ge.is_region ? AddressItemTokenItemType.REGION : AddressItemTokenItemType.CITY), t, rt.end_token, ge);
        }
        let res = AddressItemToken._new115(AddressItemTokenItemType.STREET, t, rt.end_token, rt.referent, rt, _typ !== null);
        return res;
    }
    
    create_geo_org_terr() {
        let geo = new GeoReferent();
        let t1 = this.end_token;
        geo.add_org_referent(this.referent);
        geo.add_ext_referent(this.ref_token);
        if (geo.find_slot(GeoReferent.ATTR_TYPE, null, true) === null) 
            geo.add_typ_ter(this.kit.base_language);
        return new ReferentToken(geo, this.begin_token, this.end_token);
    }
    
    static check_street_after(t) {
        let cou = 0;
        for (; t !== null && (cou < 4); t = t.next,cou++) {
            if (t.is_char_of(",.") || t.is_hiphen || t.morph.class0.is_preposition) {
            }
            else 
                break;
        }
        if (t === null) 
            return false;
        if (t.is_newline_before) 
            return false;
        let ait = AddressItemToken.try_parse(t, null, false, false, null);
        if (ait !== null) {
            if (ait.typ === AddressItemTokenItemType.STREET) 
                return true;
        }
        return false;
    }
    
    static check_house_after(t, leek = false, pure_house = false) {
        if (t === null) 
            return false;
        let cou = 0;
        for (; t !== null && (cou < 4); t = t.next,cou++) {
            if (t.is_char_of(",.") || t.morph.class0.is_preposition) {
            }
            else 
                break;
        }
        if (t === null) 
            return false;
        if (t.is_newline_before) 
            return false;
        let ait = AddressItemToken.try_parse(t, null, false, true, null);
        if (ait !== null) {
            if (pure_house) 
                return ait.typ === AddressItemTokenItemType.HOUSE || ait.typ === AddressItemTokenItemType.PLOT;
            if ((ait.typ === AddressItemTokenItemType.HOUSE || ait.typ === AddressItemTokenItemType.FLOOR || ait.typ === AddressItemTokenItemType.OFFICE) || ait.typ === AddressItemTokenItemType.FLAT || ait.typ === AddressItemTokenItemType.PLOT) {
                if (((t instanceof TextToken) && t.chars.is_all_upper && t.next !== null) && t.next.is_hiphen && (t.next.next instanceof NumberToken)) 
                    return false;
                if ((t instanceof TextToken) && t.next === ait.end_token && t.next.is_hiphen) 
                    return false;
                return true;
            }
            if (leek) {
                if (ait.typ === AddressItemTokenItemType.NUMBER) 
                    return true;
            }
            if (ait.typ === AddressItemTokenItemType.NUMBER) {
                let t1 = t.next;
                while (t1 !== null && t1.is_char_of(".,")) {
                    t1 = t1.next;
                }
                ait = AddressItemToken.try_parse(t1, null, false, true, null);
                if (ait !== null && (((ait.typ === AddressItemTokenItemType.BUILDING || ait.typ === AddressItemTokenItemType.CORPUS || ait.typ === AddressItemTokenItemType.FLAT) || ait.typ === AddressItemTokenItemType.FLOOR || ait.typ === AddressItemTokenItemType.OFFICE))) 
                    return true;
            }
        }
        return false;
    }
    
    static check_km_after(t) {
        let cou = 0;
        for (; t !== null && (cou < 4); t = t.next,cou++) {
            if (t.is_char_of(",.") || t.morph.class0.is_preposition) {
            }
            else 
                break;
        }
        if (t === null) 
            return false;
        let km = AddressItemToken.try_parse(t, null, false, true, null);
        if (km !== null && km.typ === AddressItemTokenItemType.KILOMETER) 
            return true;
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSENUMERICASADJECTIVE, 0, null);
        if (npt !== null) {
            if (npt.end_token.is_value("КИЛОМЕТР", null) || npt.end_token.is_value("МЕТР", null)) 
                return true;
        }
        return false;
    }
    
    static check_km_before(t) {
        let cou = 0;
        for (; t !== null && (cou < 4); t = t.previous,cou++) {
            if (t.is_char_of(",.")) {
            }
            else if (t.is_value("КМ", null) || t.is_value("КИЛОМЕТР", null) || t.is_value("МЕТР", null)) 
                return true;
        }
        return false;
    }
    
    static correct_char(v) {
        if (v === 'A' || v === 'А') 
            return 'А';
        if (v === 'Б' || v === 'Г') 
            return v;
        if (v === 'B' || v === 'В') 
            return 'В';
        if (v === 'C' || v === 'С') 
            return 'С';
        if (v === 'D' || v === 'Д') 
            return 'Д';
        if (v === 'E' || v === 'Е') 
            return 'Е';
        if (v === 'H' || v === 'Н') 
            return 'Н';
        if (v === 'K' || v === 'К') 
            return 'К';
        return String.fromCharCode(0);
    }
    
    static correct_char_token(t) {
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return null;
        let v = tt.term;
        if (v.length !== 1) 
            return null;
        let corr = AddressItemToken.correct_char(v[0]);
        if (corr !== (String.fromCharCode(0))) 
            return (corr);
        if (t.chars.is_cyrillic_letter) 
            return v;
        return null;
    }
    
    static initialize() {
        const StreetItemToken = require("./StreetItemToken");
        if (AddressItemToken.m_ontology !== null) 
            return;
        StreetItemToken.initialize();
        AddressItemToken.m_ontology = new TerminCollection();
        let t = null;
        t = Termin._new119("ДОМ", AddressItemTokenItemType.HOUSE);
        t.add_abridge("Д.");
        t.add_variant("КОТТЕДЖ", false);
        t.add_abridge("КОТ.");
        t.add_variant("ДАЧА", false);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new120("БУДИНОК", AddressItemTokenItemType.HOUSE, MorphLang.UA);
        t.add_abridge("Б.");
        t.add_variant("КОТЕДЖ", false);
        t.add_abridge("БУД.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new121("ВЛАДЕНИЕ", AddressItemTokenItemType.HOUSE, AddressHouseType.ESTATE);
        t.add_abridge("ВЛАД.");
        t.add_abridge("ВЛД.");
        t.add_abridge("ВЛ.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new121("ДОМОВЛАДЕНИЕ", AddressItemTokenItemType.HOUSE, AddressHouseType.HOUSEESTATE);
        t.add_variant("ДОМОВЛАДЕНИЕ", false);
        t.add_abridge("ДВЛД.");
        t.add_abridge("ДМВЛД.");
        t.add_variant("ДОМОВЛ", false);
        t.add_variant("ДОМОВА", false);
        t.add_variant("ДОМОВЛАД", false);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("ПОДЪЕЗД ДОМА", AddressItemTokenItemType.HOUSE);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("ПОДВАЛ ДОМА", AddressItemTokenItemType.HOUSE);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("КРЫША ДОМА", AddressItemTokenItemType.HOUSE);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("ЭТАЖ", AddressItemTokenItemType.FLOOR);
        t.add_abridge("ЭТ.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("ПОДЪЕЗД", AddressItemTokenItemType.POTCH);
        t.add_abridge("ПОД.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("КОРПУС", AddressItemTokenItemType.CORPUS);
        t.add_abridge("КОРП.");
        t.add_abridge("КОР.");
        t.add_abridge("Д.КОРП.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("К", AddressItemTokenItemType.CORPUSORFLAT);
        t.add_abridge("К.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("СТРОЕНИЕ", AddressItemTokenItemType.BUILDING);
        t.add_abridge("СТРОЕН.");
        t.add_abridge("СТР.");
        t.add_abridge("СТ.");
        t.add_abridge("ПОМ.СТР.");
        t.add_abridge("Д.СТР.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new121("СООРУЖЕНИЕ", AddressItemTokenItemType.BUILDING, AddressBuildingType.CONSTRUCTION);
        t.add_abridge("СООР.");
        t.add_abridge("СООРУЖ.");
        t.add_abridge("СООРУЖЕН.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new121("ЛИТЕРА", AddressItemTokenItemType.BUILDING, AddressBuildingType.LITER);
        t.add_abridge("ЛИТ.");
        t.add_variant("ЛИТЕР", false);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("УЧАСТОК", AddressItemTokenItemType.PLOT);
        t.add_abridge("УЧАСТ.");
        t.add_abridge("УЧ.");
        t.add_abridge("УЧ-К");
        t.add_variant("ЗЕМЕЛЬНЫЙ УЧАСТОК", false);
        t.add_abridge("ЗЕМ.УЧ.");
        t.add_abridge("ЗЕМ.УЧ-К");
        t.add_abridge("З/У");
        t.add_abridge("ПОЗ.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("КВАРТИРА", AddressItemTokenItemType.FLAT);
        t.add_abridge("КВАРТ.");
        t.add_abridge("КВАР.");
        t.add_abridge("КВ.");
        t.add_abridge("КВ-РА");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("ОФИС", AddressItemTokenItemType.OFFICE);
        t.add_abridge("ОФ.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new120("ОФІС", AddressItemTokenItemType.OFFICE, MorphLang.UA);
        t.add_abridge("ОФ.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("БИЗНЕС-ЦЕНТР", AddressItemTokenItemType.BUSINESSCENTER);
        t.acronym = "БЦ";
        t.add_variant("БИЗНЕС ЦЕНТР", false);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("БЛОК", AddressItemTokenItemType.BLOCK);
        t.add_variant("РЯД", false);
        t.add_variant("СЕКТОР", false);
        t.add_abridge("СЕК.");
        t.add_variant("МАССИВ", false);
        t.add_variant("ОЧЕРЕДЬ", false);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("БОКС", AddressItemTokenItemType.BOX);
        t.add_variant("ГАРАЖ", false);
        t.add_variant("САРАЙ", false);
        t.add_abridge("ГАР.");
        t.add_variant("МАШИНОМЕСТО", false);
        t.add_variant("ПОМЕЩЕНИЕ", false);
        t.add_abridge("ПОМ.");
        t.add_variant("НЕЖИЛОЕ ПОМЕЩЕНИЕ", false);
        t.add_abridge("Н.П.");
        t.add_abridge("НП");
        t.add_variant("ПОДВАЛ", false);
        t.add_variant("ПОГРЕБ", false);
        t.add_variant("ПОДВАЛЬНОЕ ПОМЕЩЕНИЕ", false);
        t.add_variant("ПОДЪЕЗД", false);
        t.add_abridge("ГАРАЖ-БОКС");
        t.add_variant("ГАРАЖНЫЙ БОКС", false);
        t.add_abridge("ГБ.");
        t.add_abridge("Г.Б.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("КОМНАТА", AddressItemTokenItemType.OFFICE);
        t.add_abridge("КОМ.");
        t.add_abridge("КОМН.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("КАБИНЕТ", AddressItemTokenItemType.OFFICE);
        t.add_abridge("КАБ.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("НОМЕР", AddressItemTokenItemType.NUMBER);
        t.add_abridge("НОМ.");
        t.add_abridge("№");
        t.add_abridge("N");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new143("БЕЗ НОМЕРА", "Б/Н", AddressItemTokenItemType.NONUMBER);
        t.add_abridge("Б.Н.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("АБОНЕНТСКИЙ ЯЩИК", AddressItemTokenItemType.POSTOFFICEBOX);
        t.add_abridge("А.Я.");
        t.add_variant("ПОЧТОВЫЙ ЯЩИК", false);
        t.add_abridge("П.Я.");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new145("ГОРОДСКАЯ СЛУЖЕБНАЯ ПОЧТА", AddressItemTokenItemType.CSP, "ГСП");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("АДРЕС", AddressItemTokenItemType.PREFIX);
        t.add_variant("ЮРИДИЧЕСКИЙ АДРЕС", false);
        t.add_variant("ФАКТИЧЕСКИЙ АДРЕС", false);
        t.add_abridge("ЮР.АДРЕС");
        t.add_abridge("ПОЧТ.АДРЕС");
        t.add_abridge("ФАКТ.АДРЕС");
        t.add_abridge("П.АДРЕС");
        t.add_variant("ЮРИДИЧЕСКИЙ/ФАКТИЧЕСКИЙ АДРЕС", false);
        t.add_variant("ПОЧТОВЫЙ АДРЕС", false);
        t.add_variant("АДРЕС ПРОЖИВАНИЯ", false);
        t.add_variant("МЕСТО НАХОЖДЕНИЯ", false);
        t.add_variant("МЕСТОНАХОЖДЕНИЕ", false);
        t.add_variant("МЕСТОПОЛОЖЕНИЕ", false);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("АДРЕСА", AddressItemTokenItemType.PREFIX);
        t.add_variant("ЮРИДИЧНА АДРЕСА", false);
        t.add_variant("ФАКТИЧНА АДРЕСА", false);
        t.add_variant("ПОШТОВА АДРЕСА", false);
        t.add_variant("АДРЕСА ПРОЖИВАННЯ", false);
        t.add_variant("МІСЦЕ ПЕРЕБУВАННЯ", false);
        t.add_variant("ПРОПИСКА", false);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("КИЛОМЕТР", AddressItemTokenItemType.KILOMETER);
        t.add_abridge("КИЛОМ.");
        t.add_abridge("КМ.");
        AddressItemToken.m_ontology.add(t);
        AddressItemToken.m_ontology.add(Termin._new119("ПЕРЕСЕЧЕНИЕ", AddressDetailType.CROSS));
        AddressItemToken.m_ontology.add(Termin._new119("НА ПЕРЕСЕЧЕНИИ", AddressDetailType.CROSS));
        AddressItemToken.m_ontology.add(Termin._new119("ПЕРЕКРЕСТОК", AddressDetailType.CROSS));
        AddressItemToken.m_ontology.add(Termin._new119("НА ПЕРЕКРЕСТКЕ", AddressDetailType.CROSS));
        AddressItemToken.m_ontology.add(Termin._new119("НА ТЕРРИТОРИИ", AddressDetailType.NEAR));
        AddressItemToken.m_ontology.add(Termin._new119("СЕРЕДИНА", AddressDetailType.NEAR));
        AddressItemToken.m_ontology.add(Termin._new119("ПРИМЫКАТЬ", AddressDetailType.NEAR));
        AddressItemToken.m_ontology.add(Termin._new119("ГРАНИЧИТЬ", AddressDetailType.NEAR));
        t = Termin._new119("ВБЛИЗИ", AddressDetailType.NEAR);
        t.add_variant("У", false);
        t.add_abridge("ВБЛ.");
        t.add_variant("ВОЗЛЕ", false);
        t.add_variant("ОКОЛО", false);
        t.add_variant("НЕДАЛЕКО ОТ", false);
        t.add_variant("РЯДОМ С", false);
        t.add_variant("ГРАНИЦА", false);
        AddressItemToken.m_ontology.add(t);
        t = Termin._new119("РАЙОН", AddressDetailType.NEAR);
        t.add_abridge("Р-Н");
        AddressItemToken.m_ontology.add(t);
        t = Termin._new143("В РАЙОНЕ", "РАЙОН", AddressDetailType.NEAR);
        t.add_abridge("В Р-НЕ");
        AddressItemToken.m_ontology.add(t);
        AddressItemToken.m_ontology.add(Termin._new119("ПРИМЕРНО", AddressDetailType.UNDEFINED));
        AddressItemToken.m_ontology.add(Termin._new119("ПОРЯДКА", AddressDetailType.UNDEFINED));
        AddressItemToken.m_ontology.add(Termin._new119("ПРИБЛИЗИТЕЛЬНО", AddressDetailType.UNDEFINED));
        AddressItemToken.m_ontology.add(Termin._new119("НАПРАВЛЕНИЕ", AddressDetailType.UNDEFINED));
        t = Termin._new119("ОБЩЕЖИТИЕ", AddressDetailType.HOSTEL);
        t.add_abridge("ОБЩ.");
        t.add_abridge("ПОМ.ОБЩ.");
        AddressItemToken.m_ontology.add(t);
        AddressItemToken.m_ontology.add(Termin._new119("СЕВЕРНЕЕ", AddressDetailType.NORTH));
        AddressItemToken.m_ontology.add(Termin._new119("СЕВЕР", AddressDetailType.NORTH));
        AddressItemToken.m_ontology.add(Termin._new119("ЮЖНЕЕ", AddressDetailType.SOUTH));
        AddressItemToken.m_ontology.add(Termin._new119("ЮГ", AddressDetailType.SOUTH));
        AddressItemToken.m_ontology.add(Termin._new119("ЗАПАДНЕЕ", AddressDetailType.WEST));
        AddressItemToken.m_ontology.add(Termin._new119("ЗАПАД", AddressDetailType.WEST));
        AddressItemToken.m_ontology.add(Termin._new119("ВОСТОЧНЕЕ", AddressDetailType.EAST));
        AddressItemToken.m_ontology.add(Termin._new119("ВОСТОК", AddressDetailType.EAST));
        AddressItemToken.m_ontology.add(Termin._new119("СЕВЕРО-ЗАПАДНЕЕ", AddressDetailType.NORTHWEST));
        AddressItemToken.m_ontology.add(Termin._new119("СЕВЕРО-ЗАПАД", AddressDetailType.NORTHWEST));
        AddressItemToken.m_ontology.add(Termin._new119("СЕВЕРО-ВОСТОЧНЕЕ", AddressDetailType.NORTHEAST));
        AddressItemToken.m_ontology.add(Termin._new119("СЕВЕРО-ВОСТОК", AddressDetailType.NORTHEAST));
        AddressItemToken.m_ontology.add(Termin._new119("ЮГО-ЗАПАДНЕЕ", AddressDetailType.SOUTHWEST));
        AddressItemToken.m_ontology.add(Termin._new119("ЮГО-ЗАПАД", AddressDetailType.SOUTHWEST));
        AddressItemToken.m_ontology.add(Termin._new119("ЮГО-ВОСТОЧНЕЕ", AddressDetailType.SOUTHEAST));
        AddressItemToken.m_ontology.add(Termin._new119("ЮГО-ВОСТОК", AddressDetailType.SOUTHEAST));
        t = new Termin("ТАМ ЖЕ");
        t.add_abridge("ТАМЖЕ");
        AddressItemToken.m_ontology.add(t);
        AddressItemToken.m_org_ontology = new TerminCollection();
        t = Termin._new114("САДОВОЕ ТОВАРИЩЕСТВО", "СТ");
        t.add_variant("САДОВОДЧЕСКОЕ ТОВАРИЩЕСТВО", false);
        t.acronym = "СТ";
        t.add_abridge("С/ТОВ");
        t.add_abridge("ПК СТ");
        t.add_abridge("САД.ТОВ.");
        t.add_abridge("САДОВ.ТОВ.");
        t.add_abridge("С/Т");
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("ДАЧНОЕ ТОВАРИЩЕСТВО");
        t.add_abridge("Д/Т");
        t.add_abridge("ДАЧ/Т");
        t.acronym = "ДТ";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("САДОВЫЙ КООПЕРАТИВ");
        t.add_abridge("С/К");
        t.acronym = "СК";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ");
        t.add_variant("ПОТРЕБКООПЕРАТИВ", false);
        t.acronym = "ПК";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("САДОВОДЧЕСКОЕ ДАЧНОЕ ТОВАРИЩЕСТВО");
        t.add_variant("САДОВОЕ ДАЧНОЕ ТОВАРИЩЕСТВО", false);
        t.acronym = "СДТ";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("ДАЧНОЕ НЕКОММЕРЧЕСКОЕ ОБЪЕДИНЕНИЕ");
        t.acronym = "ДНО";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("ДАЧНОЕ НЕКОММЕРЧЕСКОЕ ПАРТНЕРСТВО");
        t.acronym = "ДНП";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("ДАЧНОЕ НЕКОММЕРЧЕСКОЕ ТОВАРИЩЕСТВО");
        t.acronym = "ДНТ";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("ДАЧНЫЙ ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ");
        t.acronym = "ДПК";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("ДАЧНО СТРОИТЕЛЬНЫЙ КООПЕРАТИВ");
        t.add_variant("ДАЧНЫЙ СТРОИТЕЛЬНЫЙ КООПЕРАТИВ", false);
        t.acronym = "ДСК";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("СТРОИТЕЛЬНО ПРОИЗВОДСТВЕННЫЙ КООПЕРАТИВ");
        t.acronym = "СПК";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("САДОВОДЧЕСКОЕ НЕКОММЕРЧЕСКОЕ ТОВАРИЩЕСТВО");
        t.add_variant("САДОВОЕ НЕКОММЕРЧЕСКОЕ ТОВАРИЩЕСТВО", false);
        t.acronym = "СНТ";
        t.acronym_can_be_lower = true;
        t.add_abridge("САДОВОЕ НЕКОМ-Е ТОВАРИЩЕСТВО");
        AddressItemToken.m_org_ontology.add(t);
        t = Termin._new182("САДОВОДЧЕСКОЕ НЕКОММЕРЧЕСКОЕ ОБЪЕДИНЕНИЕ", "СНО", true);
        t.add_variant("САДОВОЕ НЕКОММЕРЧЕСКОЕ ОБЪЕДИНЕНИЕ", false);
        AddressItemToken.m_org_ontology.add(t);
        t = Termin._new182("САДОВОДЧЕСКОЕ НЕКОММЕРЧЕСКОЕ ПАРТНЕРСТВО", "СНП", true);
        t.add_variant("САДОВОЕ НЕКОММЕРЧЕСКОЕ ПАРТНЕРСТВО", false);
        AddressItemToken.m_org_ontology.add(t);
        t = Termin._new182("САДОВОДЧЕСКОЕ НЕКОММЕРЧЕСКОЕ ТОВАРИЩЕСТВО", "СНТ", true);
        t.add_variant("САДОВОЕ НЕКОММЕРЧЕСКОЕ ТОВАРИЩЕСТВО", false);
        AddressItemToken.m_org_ontology.add(t);
        t = Termin._new182("НЕКОММЕРЧЕСКОЕ САДОВОДЧЕСКОЕ ТОВАРИЩЕСТВО", "НСТ", true);
        t.add_variant("НЕКОММЕРЧЕСКОЕ САДОВОЕ ТОВАРИЩЕСТВО", false);
        AddressItemToken.m_org_ontology.add(t);
        t = Termin._new182("ОБЪЕДИНЕННОЕ НЕКОММЕРЧЕСКОЕ САДОВОДЧЕСКОЕ ТОВАРИЩЕСТВО", "ОНСТ", true);
        t.add_variant("ОБЪЕДИНЕННОЕ НЕКОММЕРЧЕСКОЕ САДОВОЕ ТОВАРИЩЕСТВО", false);
        AddressItemToken.m_org_ontology.add(t);
        t = Termin._new182("САДОВОДЧЕСКАЯ ПОТРЕБИТЕЛЬСКАЯ КООПЕРАЦИЯ", "СПК", true);
        t.add_variant("САДОВАЯ ПОТРЕБИТЕЛЬСКАЯ КООПЕРАЦИЯ", false);
        AddressItemToken.m_org_ontology.add(t);
        AddressItemToken.m_org_ontology.add(Termin._new182("ДАЧНО СТРОИТЕЛЬНО ПРОИЗВОДСТВЕННЫЙ КООПЕРАТИВ", "ДСПК", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ЖИЛИЩНЫЙ СТРОИТЕЛЬНО ПРОИЗВОДСТВЕННЫЙ КООПЕРАТИВ", "ЖСПК", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ЖИЛИЩНЫЙ СТРОИТЕЛЬНЫЙ КООПЕРАТИВ", "ЖСК", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ЖИЛИЩНЫЙ СТРОИТЕЛЬНЫЙ КООПЕРАТИВ ИНДИВИДУАЛЬНЫХ ЗАСТРОЙЩИКОВ", "ЖСКИЗ", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ОГОРОДНИЧЕСКОЕ НЕКОММЕРЧЕСКОЕ ОБЪЕДИНЕНИЕ", "ОНО", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ОГОРОДНИЧЕСКОЕ НЕКОММЕРЧЕСКОЕ ПАРТНЕРСТВО", "ОНП", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ОГОРОДНИЧЕСКОЕ НЕКОММЕРЧЕСКОЕ ТОВАРИЩЕСТВО", "ОНТ", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ОГОРОДНИЧЕСКИЙ ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ", "ОПК", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ТОВАРИЩЕСТВО СОБСТВЕННИКОВ НЕДВИЖИМОСТИ", "СТСН", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("САДОВОДЧЕСКОЕ ТОВАРИЩЕСТВО СОБСТВЕННИКОВ НЕДВИЖИМОСТИ", "ТСН", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ТОВАРИЩЕСТВО СОБСТВЕННИКОВ ЖИЛЬЯ", "ТСЖ", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("САДОВЫЕ ЗЕМЕЛЬНЫЕ УЧАСТКИ", "СЗУ", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ТОВАРИЩЕСТВО ИНДИВИДУАЛЬНЫХ ЗАСТРОЙЩИКОВ", "ТИЗ", true));
        t = Termin._new182("КОЛЛЕКТИВ ИНДИВИДУАЛЬНЫХ ЗАСТРОЙЩИКОВ", "КИЗ", true);
        t.add_variant("КИЗК", false);
        AddressItemToken.m_org_ontology.add(t);
        t = Termin._new182("САДОВОЕ НЕКОММЕРЧЕСКОЕ ТОВАРИЩЕСТВО СОБСТВЕННИКОВ НЕДВИЖИМОСТИ", "СНТСН", true);
        t.add_variant("СНТ СН", false);
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("СОВМЕСТНОЕ ПРЕДПРИЯТИЕ");
        t.acronym = "СП";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("НЕКОММЕРЧЕСКОЕ ПАРТНЕРСТВО");
        t.acronym = "НП";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("АВТОМОБИЛЬНЫЙ КООПЕРАТИВ");
        t.add_abridge("А/К");
        t.acronym = "АК";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("ГАРАЖНЫЙ КООПЕРАТИВ");
        t.add_abridge("Г/К");
        t.add_abridge("ГР.КОП.");
        t.add_abridge("ГАР.КОП.");
        t.acronym = "ГК";
        t.acronym_can_be_lower = true;
        AddressItemToken.m_org_ontology.add(t);
        AddressItemToken.m_org_ontology.add(Termin._new182("ГАРАЖНО СТРОИТЕЛЬНЫЙ КООПЕРАТИВ", "ГСК", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ГАРАЖНО ЭКСПЛУАТАЦИОННЫЙ КООПЕРАТИВ", "ГЭК", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ГАРАЖНО ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ", "ГПК", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ПОТРЕБИТЕЛЬСКИЙ ГАРАЖНО СТРОИТЕЛЬНЫЙ КООПЕРАТИВ", "ПГСК", true));
        AddressItemToken.m_org_ontology.add(Termin._new182("ГАРАЖНЫЙ СТРОИТЕЛЬНО ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ", "ГСПК", true));
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("САНАТОРИЙ");
        t.add_abridge("САН.");
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("ДОМ ОТДЫХА");
        t.add_abridge("Д/О");
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("СОВХОЗ");
        t.add_abridge("С-ЗА");
        t.add_abridge("С/ЗА");
        t.add_abridge("С/З");
        t.add_abridge("СХ.");
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("ПИОНЕРСКИЙ ЛАГЕРЬ");
        t.add_abridge("П/Л");
        t.add_abridge("П.Л.");
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("КУРОРТ");
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("КОЛЛЕКТИВ ИНДИВИДУАЛЬНЫХ ВЛАДЕЛЬЦЕВ");
        AddressItemToken.m_org_ontology.add(t);
        t = new Termin("БИЗНЕС ЦЕНТР");
        t.acronym = "БЦ";
        t.add_variant("БІЗНЕС ЦЕНТР", false);
        AddressItemToken.m_org_ontology.add(t);
    }
    
    static _new83(_arg1, _arg2, _arg3, _arg4) {
        let res = new AddressItemToken(_arg1, _arg2, _arg3);
        res.referent = _arg4;
        return res;
    }
    
    static _new84(_arg1, _arg2, _arg3, _arg4) {
        let res = new AddressItemToken(_arg1, _arg2, _arg3);
        res.value = _arg4;
        return res;
    }
    
    static _new86(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new AddressItemToken(_arg1, _arg2, _arg3);
        res.referent = _arg4;
        res.is_doubt = _arg5;
        return res;
    }
    
    static _new94(_arg1, _arg2, _arg3, _arg4) {
        let res = new AddressItemToken(_arg1, _arg2, _arg3);
        res.ref_token = _arg4;
        return res;
    }
    
    static _new95(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new AddressItemToken(_arg1, _arg2, _arg3);
        res.value = _arg4;
        res.house_type = _arg5;
        return res;
    }
    
    static _new96(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new AddressItemToken(_arg1, _arg2, _arg3);
        res.house_type = _arg4;
        res.building_type = _arg5;
        return res;
    }
    
    static _new97(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new AddressItemToken(_arg1, _arg2, _arg3);
        res.value = _arg4;
        res.house_type = _arg5;
        res.building_type = _arg6;
        return res;
    }
    
    static _new106(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new AddressItemToken(_arg1, _arg2, _arg3);
        res.value = _arg4;
        res.morph = _arg5;
        res.house_type = _arg6;
        res.building_type = _arg7;
        return res;
    }
    
    static _new112(_arg1, _arg2, _arg3, _arg4) {
        let res = new AddressItemToken(_arg1, _arg2, _arg3);
        res.detail_type = _arg4;
        return res;
    }
    
    static _new115(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new AddressItemToken(_arg1, _arg2, _arg3);
        res.referent = _arg4;
        res.ref_token = _arg5;
        res.ref_token_is_gsk = _arg6;
        return res;
    }
    
    static static_constructor() {
        AddressItemToken.m_ontology = null;
        AddressItemToken.m_org_ontology = null;
    }
}


AddressItemToken.static_constructor();

module.exports = AddressItemToken