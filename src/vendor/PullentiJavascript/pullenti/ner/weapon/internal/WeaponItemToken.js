/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const GetTextAttr = require("./../../core/GetTextAttr");
const MorphClass = require("./../../../morph/MorphClass");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const NumberToken = require("./../../NumberToken");
const CharsInfo = require("./../../../morph/CharsInfo");
const MiscHelper = require("./../../core/MiscHelper");
const GeoReferent = require("./../../geo/GeoReferent");
const MetaToken = require("./../../MetaToken");
const TextToken = require("./../../TextToken");
const ReferentToken = require("./../../ReferentToken");
const WeaponItemTokenTyps = require("./WeaponItemTokenTyps");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const MorphGender = require("./../../../morph/MorphGender");
const Termin = require("./../../core/Termin");
const OrganizationReferent = require("./../../org/OrganizationReferent");
const TerminCollection = require("./../../core/TerminCollection");
const TransItemToken = require("./../../transport/internal/TransItemToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const NumberHelper = require("./../../core/NumberHelper");
const NumbersWithUnitToken = require("./../../measure/internal/NumbersWithUnitToken");
const BracketHelper = require("./../../core/BracketHelper");

class WeaponItemToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = WeaponItemTokenTyps.NOUN;
        this.value = null;
        this.alt_value = null;
        this.is_doubt = false;
        this.is_after_conjunction = false;
        this.is_internal = false;
        this.inner_tokens = new Array();
        this.ref = null;
    }
    
    toString() {
        return (this.typ.toString() + ": " + ((this.value != null ? this.value : (((this.ref === null ? "" : this.ref.toString()))))) + " " + ((this.alt_value != null ? this.alt_value : "")) + (this.is_internal ? "[int]" : ""));
    }
    
    static try_parse_list(t, max_count = 10) {
        let tr = WeaponItemToken.try_parse(t, null, false, false);
        if (tr === null) 
            return null;
        if (tr.typ === WeaponItemTokenTyps.CLASS || tr.typ === WeaponItemTokenTyps.DATE) 
            return null;
        let tr0 = tr;
        let res = new Array();
        if (tr.inner_tokens.length > 0) {
            res.splice(res.length, 0, ...tr.inner_tokens);
            if (res[0].begin_char > tr.begin_char) 
                res[0].begin_token = tr.begin_token;
        }
        res.push(tr);
        t = tr.end_token.next;
        if (tr.typ === WeaponItemTokenTyps.NOUN) {
            for (; t !== null; t = t.next) {
                if (t.is_char(':') || t.is_hiphen) {
                }
                else 
                    break;
            }
        }
        let and_conj = false;
        for (; t !== null; t = t.next) {
            if (max_count > 0 && res.length >= max_count) 
                break;
            if (t.is_char(':')) 
                continue;
            if (tr0.typ === WeaponItemTokenTyps.NOUN) {
                if (t.is_hiphen && t.next !== null) 
                    t = t.next;
            }
            tr = WeaponItemToken.try_parse(t, tr0, false, false);
            if (tr === null) {
                if (BracketHelper.can_be_end_of_sequence(t, true, null, false) && t.next !== null) {
                    if (tr0.typ === WeaponItemTokenTyps.MODEL || tr0.typ === WeaponItemTokenTyps.BRAND) {
                        let tt1 = t.next;
                        if (tt1 !== null && tt1.is_comma) 
                            tt1 = tt1.next;
                        tr = WeaponItemToken.try_parse(tt1, tr0, false, false);
                    }
                }
            }
            if (tr === null && (t instanceof ReferentToken)) {
                let rt = Utils.as(t, ReferentToken);
                if (rt.begin_token === rt.end_token && (rt.begin_token instanceof TextToken)) {
                    tr = WeaponItemToken.try_parse(rt.begin_token, tr0, false, false);
                    if (tr !== null && tr.begin_token === tr.end_token) 
                        tr.begin_token = tr.end_token = t;
                }
            }
            if (tr === null && t.is_char('(')) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    let tt = br.end_token.next;
                    if (tt !== null && tt.is_comma) 
                        tt = tt.next;
                    tr = WeaponItemToken.try_parse(tt, tr0, false, false);
                    if (tr !== null && tr.typ === WeaponItemTokenTyps.NUMBER) {
                    }
                    else 
                        tr = null;
                }
            }
            if (tr === null && t.is_hiphen) {
                if (tr0.typ === WeaponItemTokenTyps.BRAND || tr0.typ === WeaponItemTokenTyps.MODEL) 
                    tr = WeaponItemToken.try_parse(t.next, tr0, false, false);
            }
            if (tr === null && t.is_comma) {
                if ((tr0.typ === WeaponItemTokenTyps.NAME || tr0.typ === WeaponItemTokenTyps.BRAND || tr0.typ === WeaponItemTokenTyps.MODEL) || tr0.typ === WeaponItemTokenTyps.CLASS || tr0.typ === WeaponItemTokenTyps.DATE) {
                    tr = WeaponItemToken.try_parse(t.next, tr0, true, false);
                    if (tr !== null) {
                        if (tr.typ === WeaponItemTokenTyps.NUMBER) {
                        }
                        else 
                            tr = null;
                    }
                }
            }
            if (tr === null) 
                break;
            if (t.is_newline_before) {
                if (tr.typ !== WeaponItemTokenTyps.NUMBER) 
                    break;
            }
            if (tr.inner_tokens.length > 0) 
                res.splice(res.length, 0, ...tr.inner_tokens);
            res.push(tr);
            tr0 = tr;
            t = tr.end_token;
            if (and_conj) 
                break;
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].typ === WeaponItemTokenTyps.MODEL && res[i + 1].typ === WeaponItemTokenTyps.MODEL) {
                res[i].end_token = res[i + 1].end_token;
                res[i].value = (res[i].value + (res[i].end_token.next !== null && res[i].end_token.next.is_hiphen ? '-' : ' ') + res[i + 1].value);
                res.splice(i + 1, 1);
                i--;
            }
        }
        return res;
    }
    
    static try_parse(t, prev, after_conj, attach_high = false) {
        let res = WeaponItemToken._try_parse(t, prev, after_conj, attach_high);
        if (res === null) {
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.noun.begin_char > npt.begin_char) {
                res = WeaponItemToken._try_parse(npt.noun.begin_token, prev, after_conj, attach_high);
                if (res !== null) {
                    if (res.typ === WeaponItemTokenTyps.NOUN) {
                        let str = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                        if (str === "РУЧНОЙ ГРАНАТ") 
                            str = "РУЧНАЯ ГРАНАТА";
                        if (((str != null ? str : "")).endsWith(res.value)) {
                            if (res.alt_value === null) 
                                res.alt_value = str;
                            else {
                                str = str.substring(0, 0 + str.length - res.value.length).trim();
                                res.alt_value = (str + " " + res.alt_value);
                            }
                            res.begin_token = t;
                            return res;
                        }
                    }
                }
            }
            return null;
        }
        if (res.typ === WeaponItemTokenTyps.NAME) {
            let br = BracketHelper.try_parse(res.end_token.next, BracketParseAttr.NO, 100);
            if (br !== null && br.is_char('(')) {
                let alt = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                if (MiscHelper.can_be_equal_cyr_and_latss(res.value, alt)) {
                    res.alt_value = alt;
                    res.end_token = br.end_token;
                }
            }
        }
        return res;
    }
    
    static _try_parse(t, prev, after_conj, attach_high = false) {
        if (t === null) 
            return null;
        if (BracketHelper.is_bracket(t, true)) {
            let wit = WeaponItemToken._try_parse(t.next, prev, after_conj, attach_high);
            if (wit !== null) {
                if (wit.end_token.next === null) {
                    wit.begin_token = t;
                    return wit;
                }
                if (BracketHelper.is_bracket(wit.end_token.next, true)) {
                    wit.begin_token = t;
                    wit.end_token = wit.end_token.next;
                    return wit;
                }
            }
        }
        let tok = WeaponItemToken.m_ontology.try_parse(t, TerminParseAttr.NO);
        if (tok !== null) {
            let res = new WeaponItemToken(t, tok.end_token);
            res.typ = WeaponItemTokenTyps.of(tok.termin.tag);
            if (res.typ === WeaponItemTokenTyps.NOUN) {
                res.value = tok.termin.canonic_text;
                if (tok.termin.tag2 !== null) 
                    res.is_doubt = true;
                for (let tt = res.end_token.next; tt !== null; tt = tt.next) {
                    if (tt.whitespaces_before_count > 2) 
                        break;
                    let wit = WeaponItemToken._try_parse(tt, null, false, false);
                    if (wit !== null) {
                        if (wit.typ === WeaponItemTokenTyps.BRAND) {
                            res.inner_tokens.push(wit);
                            res.end_token = (tt = wit.end_token);
                            continue;
                        }
                        break;
                    }
                    if (!((tt instanceof TextToken))) 
                        break;
                    let mc = tt.get_morph_class_in_dictionary();
                    if (MorphClass.ooEq(mc, MorphClass.ADJECTIVE)) {
                        if (res.alt_value === null) 
                            res.alt_value = res.value;
                        if (res.alt_value.endsWith(res.value)) 
                            res.alt_value = res.alt_value.substring(0, 0 + res.alt_value.length - res.value.length);
                        res.alt_value = (res.alt_value + (tt).term + " " + res.value);
                        res.end_token = tt;
                        continue;
                    }
                    break;
                }
                return res;
            }
            if (res.typ === WeaponItemTokenTyps.BRAND || res.typ === WeaponItemTokenTyps.NAME) {
                res.value = tok.termin.canonic_text;
                return res;
            }
            if (res.typ === WeaponItemTokenTyps.MODEL) {
                res.value = tok.termin.canonic_text;
                if (tok.termin.tag2 instanceof Array) {
                    let li = Utils.as(tok.termin.tag2, Array);
                    for (const to of li) {
                        let wit = WeaponItemToken._new2751(t, tok.end_token, WeaponItemTokenTyps.of(to.tag), to.canonic_text, tok.begin_token === tok.end_token);
                        res.inner_tokens.push(wit);
                        if (to.additional_vars !== null && to.additional_vars.length > 0) 
                            wit.alt_value = to.additional_vars[0].canonic_text;
                    }
                }
                res._correct_model();
                return res;
            }
        }
        let nnn = MiscHelper.check_number_prefix(t);
        if (nnn !== null) {
            let tit = TransItemToken._attach_number(nnn, true);
            if (tit !== null) {
                let res = WeaponItemToken._new2752(t, tit.end_token, WeaponItemTokenTyps.NUMBER);
                res.value = tit.value;
                res.alt_value = tit.alt_value;
                return res;
            }
        }
        if (((t instanceof TextToken) && t.chars.is_letter && t.chars.is_all_upper) && (t.length_char < 4)) {
            if ((t.next !== null && ((t.next.is_hiphen || t.next.is_char('.'))) && (t.next.whitespaces_after_count < 2)) && (t.next.next instanceof NumberToken)) {
                let res = WeaponItemToken._new2753(t, t.next, WeaponItemTokenTyps.MODEL, true);
                res.value = (t).term;
                res._correct_model();
                return res;
            }
            if ((t.next instanceof NumberToken) && !t.is_whitespace_after) {
                let res = WeaponItemToken._new2753(t, t, WeaponItemTokenTyps.MODEL, true);
                res.value = (t).term;
                res._correct_model();
                return res;
            }
            if ((t).term === "СП" && (t.whitespaces_after_count < 3) && (t.next instanceof TextToken)) {
                let pp = WeaponItemToken._try_parse(t.next, null, false, false);
                if (pp !== null && ((pp.typ === WeaponItemTokenTyps.MODEL || pp.typ === WeaponItemTokenTyps.BRAND))) {
                    let res = WeaponItemToken._new2752(t, t, WeaponItemTokenTyps.NOUN);
                    res.value = "ПИСТОЛЕТ";
                    res.alt_value = "СЛУЖЕБНЫЙ ПИСТОЛЕТ";
                    return res;
                }
            }
        }
        if (((t instanceof TextToken) && t.chars.is_letter && !t.chars.is_all_lower) && t.length_char > 2) {
            let ok = false;
            if (prev !== null && ((prev.typ === WeaponItemTokenTyps.NOUN || prev.typ === WeaponItemTokenTyps.MODEL || prev.typ === WeaponItemTokenTyps.BRAND))) 
                ok = true;
            else if (prev === null && t.previous !== null && t.previous.is_comma_and) 
                ok = true;
            if (ok) {
                let res = WeaponItemToken._new2753(t, t, WeaponItemTokenTyps.NAME, true);
                res.value = (t).term;
                if ((t.next !== null && t.next.is_hiphen && (t.next.next instanceof TextToken)) && CharsInfo.ooEq(t.next.next.chars, t.chars)) {
                    res.value = (res.value + "-" + (t.next.next).term);
                    res.end_token = t.next.next;
                }
                if (prev !== null && prev.typ === WeaponItemTokenTyps.NOUN) 
                    res.typ = WeaponItemTokenTyps.BRAND;
                if (res.end_token.next !== null && res.end_token.next.is_hiphen && (res.end_token.next.next instanceof NumberToken)) {
                    res.typ = WeaponItemTokenTyps.MODEL;
                    res._correct_model();
                }
                else if (!res.end_token.is_whitespace_after && (res.end_token.next instanceof NumberToken)) {
                    res.typ = WeaponItemTokenTyps.MODEL;
                    res._correct_model();
                }
                return res;
            }
        }
        if (t.is_value("МАРКА", null)) {
            let res = WeaponItemToken._try_parse(t.next, prev, after_conj, false);
            if (res !== null && res.typ === WeaponItemTokenTyps.BRAND) {
                res.begin_token = t;
                return res;
            }
            if (BracketHelper.can_be_start_of_sequence(t.next, true, false)) {
                let br = BracketHelper.try_parse(t.next, BracketParseAttr.NO, 100);
                if (br !== null) 
                    return WeaponItemToken._new2757(t, br.end_token, WeaponItemTokenTyps.BRAND, MiscHelper.get_text_value(br.begin_token, br.end_token, GetTextAttr.NO));
            }
            if (((t instanceof TextToken) && (t.next instanceof TextToken) && t.next.length_char > 1) && !t.next.chars.is_all_lower) 
                return WeaponItemToken._new2757(t, t.next, WeaponItemTokenTyps.BRAND, (t).term);
        }
        if (t.is_value("КАЛИБР", "КАЛІБР")) {
            let tt1 = t.next;
            if (tt1 !== null && ((tt1.is_hiphen || tt1.is_char(':')))) 
                tt1 = tt1.next;
            let num = NumbersWithUnitToken.try_parse(tt1, null, false, false, false, false);
            if (num !== null && num.single_val !== null) 
                return WeaponItemToken._new2757(t, num.end_token, WeaponItemTokenTyps.CALIBER, NumberHelper.double_to_string(num.single_val));
        }
        if (t instanceof NumberToken) {
            let num = NumbersWithUnitToken.try_parse(t, null, false, false, false, false);
            if (num !== null && num.single_val !== null) {
                if (num.units.length === 1 && num.units[0].unit !== null && num.units[0].unit.name_cyr === "мм") 
                    return WeaponItemToken._new2757(t, num.end_token, WeaponItemTokenTyps.CALIBER, NumberHelper.double_to_string(num.single_val));
                if (num.end_token.next !== null && num.end_token.next.is_value("КАЛИБР", "КАЛІБР")) 
                    return WeaponItemToken._new2757(t, num.end_token.next, WeaponItemTokenTyps.CALIBER, NumberHelper.double_to_string(num.single_val));
            }
        }
        if (t.is_value("ПРОИЗВОДСТВО", "ВИРОБНИЦТВО")) {
            let tt1 = t.next;
            if (tt1 !== null && ((tt1.is_hiphen || tt1.is_char(':')))) 
                tt1 = tt1.next;
            if (tt1 instanceof ReferentToken) {
                if ((tt1.get_referent() instanceof OrganizationReferent) || (tt1.get_referent() instanceof GeoReferent)) 
                    return WeaponItemToken._new2762(t, tt1, WeaponItemTokenTyps.DEVELOPER, tt1.get_referent());
            }
        }
        return null;
    }
    
    _correct_model() {
        let tt = this.end_token.next;
        if (tt === null || tt.whitespaces_before_count > 2) 
            return;
        if (tt.is_value(":\\/.", null) || tt.is_hiphen) 
            tt = tt.next;
        if (tt instanceof NumberToken) {
            let tmp = new StringBuilder();
            tmp.append((tt).value);
            let is_lat = LanguageHelper.is_latin_char(this.value[0]);
            this.end_token = tt;
            for (tt = tt.next; tt !== null; tt = tt.next) {
                if ((tt instanceof TextToken) && tt.length_char === 1 && tt.chars.is_letter) {
                    if (!tt.is_whitespace_before || ((tt.previous !== null && tt.previous.is_hiphen))) {
                        let ch = (tt).term[0];
                        this.end_token = tt;
                        let ch2 = String.fromCharCode(0);
                        if (LanguageHelper.is_latin_char(ch) && !is_lat) {
                            ch2 = LanguageHelper.get_cyr_for_lat(ch);
                            if (ch2 !== (String.fromCharCode(0))) 
                                ch = ch2;
                        }
                        else if (LanguageHelper.is_cyrillic_char(ch) && is_lat) {
                            ch2 = LanguageHelper.get_lat_for_cyr(ch);
                            if (ch2 !== (String.fromCharCode(0))) 
                                ch = ch2;
                        }
                        tmp.append(ch);
                        continue;
                    }
                }
                break;
            }
            this.value = (this.value + "-" + tmp.toString());
            this.alt_value = MiscHelper.create_cyr_lat_alternative(this.value);
        }
        if (!this.end_token.is_whitespace_after && this.end_token.next !== null && ((this.end_token.next.is_hiphen || this.end_token.next.is_char_of("\\/")))) {
            if (!this.end_token.next.is_whitespace_after && (this.end_token.next.next instanceof NumberToken)) {
                this.end_token = this.end_token.next.next;
                this.value = (this.value + "-" + (this.end_token).value);
                if (this.alt_value !== null) 
                    this.alt_value = (this.alt_value + "-" + (this.end_token).value);
            }
        }
    }
    
    static initialize() {
        if (WeaponItemToken.m_ontology !== null) 
            return;
        WeaponItemToken.m_ontology = new TerminCollection();
        let t = null;
        let tt = null;
        let li = [ ];
        t = Termin._new119("ПИСТОЛЕТ", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("РЕВОЛЬВЕР", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("ВИНТОВКА", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("РУЖЬЕ", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new121("АВТОМАТ", WeaponItemTokenTyps.NOUN, 1);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new121("КАРАБИН", WeaponItemTokenTyps.NOUN, 1);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new143("ПИСТОЛЕТ-ПУЛЕМЕТ", "ПИСТОЛЕТ-ПУЛЕМЕТ", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("ПУЛЕМЕТ", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("ГРАНАТОМЕТ", WeaponItemTokenTyps.NOUN);
        t.add_variant("СТРЕЛКОВО ГРАНАТОМЕТНЫЙ КОМПЛЕКС", false);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("ОГНЕМЕТ", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("МИНОМЕТ", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new2774("ПЕРЕНОСНОЙ ЗЕНИТНО РАКЕТНЫЙ КОМПЛЕКС", "ПЗРК", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new2774("ПРОТИВОТАНКОВЫЙ РАКЕТНЫЙ КОМПЛЕКС", "ПТРК", WeaponItemTokenTyps.NOUN);
        t.add_variant("ПЕРЕНОСНОЙ ПРОТИВОТАНКОВЫЙ РАКЕТНЫЙ КОМПЛЕКС", false);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("АВИАЦИОННАЯ ПУШКА", WeaponItemTokenTyps.NOUN);
        t.add_variant("АВИАПУШКА", false);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("НАРУЧНИКИ", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("БРОНЕЖИЛЕТ", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("ГРАНАТА", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("ЛИМОНКА", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("НОЖ", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new119("ВЗРЫВАТЕЛЬ", WeaponItemTokenTyps.NOUN);
        WeaponItemToken.m_ontology.add(t);
        for (const s of ["МАКАРОВ", "КАЛАШНИКОВ", "СИМОНОВ", "СТЕЧКИН", "ШМАЙСЕР", "МОСИН", "СЛОСТИН", "НАГАН", "МАКСИМ", "ДРАГУНОВ", "СЕРДЮКОВ", "ЯРЫГИН", "НИКОНОВ", "МАУЗЕР", "БРАУНИНГ", "КОЛЬТ", "ВИНЧЕСТЕР"]) {
            WeaponItemToken.m_ontology.add(Termin._new119(s, WeaponItemTokenTyps.BRAND));
        }
        for (const s of ["УЗИ"]) {
            WeaponItemToken.m_ontology.add(Termin._new119(s, WeaponItemTokenTyps.NAME));
        }
        t = Termin._new2785("ТУЛЬСКИЙ ТОКАРЕВА", "ТТ", "ТТ", WeaponItemTokenTyps.MODEL);
        li = new Array();
        li.push(Termin._new119("ПИСТОЛЕТ", WeaponItemTokenTyps.NOUN));
        li.push(Termin._new119("ТОКАРЕВ", WeaponItemTokenTyps.BRAND));
        t.tag2 = li;
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new2785("ПИСТОЛЕТ МАКАРОВА", "ПМ", "ПМ", WeaponItemTokenTyps.MODEL);
        li = new Array();
        li.push(Termin._new119("ПИСТОЛЕТ", WeaponItemTokenTyps.NOUN));
        li.push(Termin._new119("МАКАРОВ", WeaponItemTokenTyps.BRAND));
        t.tag2 = li;
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new2785("ПИСТОЛЕТ МАКАРОВА МОДЕРНИЗИРОВАННЫЙ", "ПММ", "ПММ", WeaponItemTokenTyps.MODEL);
        li = new Array();
        li.push((tt = Termin._new119("ПИСТОЛЕТ", WeaponItemTokenTyps.NOUN)));
        tt.add_variant("МОДЕРНИЗИРОВАННЫЙ ПИСТОЛЕТ", false);
        li.push(Termin._new119("МАКАРОВ", WeaponItemTokenTyps.BRAND));
        t.tag2 = li;
        WeaponItemToken.m_ontology.add(t);
        t = Termin._new2785("АВТОМАТ КАЛАШНИКОВА", "АК", "АК", WeaponItemTokenTyps.MODEL);
        li = new Array();
        li.push(Termin._new119("АВТОМАТ", WeaponItemTokenTyps.NOUN));
        li.push(Termin._new119("КАЛАШНИКОВ", WeaponItemTokenTyps.BRAND));
        t.tag2 = li;
        WeaponItemToken.m_ontology.add(t);
    }
    
    static _new2751(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new WeaponItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.is_internal = _arg5;
        return res;
    }
    
    static _new2752(_arg1, _arg2, _arg3) {
        let res = new WeaponItemToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new2753(_arg1, _arg2, _arg3, _arg4) {
        let res = new WeaponItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.is_doubt = _arg4;
        return res;
    }
    
    static _new2757(_arg1, _arg2, _arg3, _arg4) {
        let res = new WeaponItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new2762(_arg1, _arg2, _arg3, _arg4) {
        let res = new WeaponItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        return res;
    }
    
    static static_constructor() {
        WeaponItemToken.m_ontology = null;
    }
}


WeaponItemToken.static_constructor();

module.exports = WeaponItemToken