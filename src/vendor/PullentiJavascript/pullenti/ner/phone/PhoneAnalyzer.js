/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const Token = require("./../Token");
const MetaToken = require("./../MetaToken");
const TerminParseAttr = require("./../core/TerminParseAttr");
const ProcessorService = require("./../ProcessorService");
const UriAnalyzer = require("./../uri/UriAnalyzer");
const LanguageHelper = require("./../../morph/LanguageHelper");
const NumberToken = require("./../NumberToken");
const TextToken = require("./../TextToken");
const Termin = require("./../core/Termin");
const PhoneHelper = require("./internal/PhoneHelper");
const PhoneItemTokenPhoneItemType = require("./internal/PhoneItemTokenPhoneItemType");
const ReferentEqualType = require("./../ReferentEqualType");
const EpNerBankInternalResourceHelper = require("./../bank/internal/EpNerBankInternalResourceHelper");
const Referent = require("./../Referent");
const MetaPhone = require("./internal/MetaPhone");
const PhoneReferent = require("./PhoneReferent");
const PhoneKind = require("./PhoneKind");
const ReferentToken = require("./../ReferentToken");
const PhoneItemToken = require("./internal/PhoneItemToken");
const AnalyzerData = require("./../core/AnalyzerData");
const Analyzer = require("./../Analyzer");

/**
 * Анализатор для выделения телефонных номеров
 */
class PhoneAnalyzer extends Analyzer {
    
    get name() {
        return PhoneAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Телефоны";
    }
    
    get description() {
        return "Телефонные номера";
    }
    
    clone() {
        return new PhoneAnalyzer();
    }
    
    get type_system() {
        return [MetaPhone.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaPhone.PHONE_IMAGE_ID, EpNerBankInternalResourceHelper.get_bytes("phone.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === PhoneReferent.OBJ_TYPENAME) 
            return new PhoneReferent();
        return null;
    }
    
    get progress_weight() {
        return 2;
    }
    
    create_analyzer_data() {
        return new PhoneAnalyzer.PhoneAnalizerData();
    }
    
    /**
     * Основная функция выделения телефонов
     * @param cnt 
     * @param stage 
     * @return 
     */
    process(kit) {
        let ad = Utils.as(kit.get_analyzer_data(this), PhoneAnalyzer.PhoneAnalizerData);
        for (let t = kit.first_token; t !== null; t = t.next) {
            let pli = PhoneItemToken.try_attach_all(t);
            if (pli === null || pli.length === 0) 
                continue;
            let prev_phone = null;
            let kkk = 0;
            for (let tt = t.previous; tt !== null; tt = tt.previous) {
                if (tt.get_referent() instanceof PhoneReferent) {
                    prev_phone = Utils.as(tt.get_referent(), PhoneReferent);
                    break;
                }
                else if (tt instanceof ReferentToken) {
                }
                else if (tt.is_char(')')) {
                    let ttt = tt.previous;
                    let cou = 0;
                    for (; ttt !== null; ttt = ttt.previous) {
                        if (ttt.is_char('(')) 
                            break;
                        else if ((++cou) > 100) 
                            break;
                    }
                    if (ttt === null || !ttt.is_char('(')) 
                        break;
                    tt = ttt;
                }
                else if (!tt.is_char_of(",;/\\") && !tt.is_and) {
                    if ((++kkk) > 5) 
                        break;
                    if (tt.is_newline_before || tt.is_newline_after) 
                        break;
                }
            }
            let j = 0;
            let is_phone_before = false;
            let is_pref = false;
            let ki = PhoneKind.UNDEFINED;
            while (j < pli.length) {
                if (pli[j].item_type === PhoneItemTokenPhoneItemType.PREFIX) {
                    if (ki === PhoneKind.UNDEFINED) 
                        ki = pli[j].kind;
                    is_pref = true;
                    is_phone_before = true;
                    j++;
                    if ((j < pli.length) && pli[j].item_type === PhoneItemTokenPhoneItemType.DELIM) 
                        j++;
                }
                else if (((j + 1) < pli.length) && pli[j + 1].item_type === PhoneItemTokenPhoneItemType.PREFIX && j === 0) {
                    if (ki === PhoneKind.UNDEFINED) 
                        ki = pli[0].kind;
                    is_pref = true;
                    pli.splice(0, 1);
                }
                else 
                    break;
            }
            if (prev_phone !== null) 
                is_phone_before = true;
            if (pli.length === 1 && pli[0].item_type === PhoneItemTokenPhoneItemType.NUMBER) {
                let tt = t.previous;
                if ((tt instanceof TextToken) && !tt.chars.is_letter) 
                    tt = tt.previous;
                if (tt instanceof TextToken) {
                    if (UriAnalyzer.m_schemes.try_parse(tt, TerminParseAttr.NO) !== null) 
                        continue;
                }
            }
            let rts = this.try_attach(pli, j, is_phone_before, prev_phone);
            if (rts === null) {
                for (j = 1; j < pli.length; j++) {
                    if (pli[j].item_type === PhoneItemTokenPhoneItemType.PREFIX) {
                        pli.splice(0, j);
                        rts = this.try_attach(pli, 1, true, prev_phone);
                        break;
                    }
                }
            }
            if (rts === null) 
                t = pli[pli.length - 1].end_token;
            else {
                if ((ki === PhoneKind.UNDEFINED && prev_phone !== null && !is_pref) && prev_phone.kind !== PhoneKind.MOBILE && kkk === 0) 
                    ki = prev_phone.kind;
                for (const rt of rts) {
                    let ph = Utils.as(rt.referent, PhoneReferent);
                    if (ki !== PhoneKind.UNDEFINED) 
                        ph.kind = ki;
                    else {
                        if (rt === rts[0] && (rt.whitespaces_before_count < 3)) {
                            let tt1 = rt.begin_token.previous;
                            if (tt1 !== null && tt1.is_table_control_char) 
                                tt1 = tt1.previous;
                            if ((tt1 instanceof TextToken) && ((tt1.is_newline_before || ((tt1.previous !== null && tt1.previous.is_table_control_char))))) {
                                let term = (tt1).term;
                                if (term === "T" || term === "Т") 
                                    rt.begin_token = tt1;
                                else if (term === "Ф" || term === "F") {
                                    ph.kind = (ki = PhoneKind.FAX);
                                    rt.begin_token = tt1;
                                }
                                else if (term === "M" || term === "М") {
                                    ph.kind = (ki = PhoneKind.MOBILE);
                                    rt.begin_token = tt1;
                                }
                            }
                        }
                        ph.correct();
                    }
                    rt.referent = ad.register_referent(rt.referent);
                    kit.embed_token(rt);
                    t = rt;
                }
            }
        }
    }
    
    try_attach(pli, ind, is_phone_before, prev_phone) {
        let rt = this._try_attach_(pli, ind, is_phone_before, prev_phone, 0);
        if (rt === null) 
            return null;
        let res = new Array();
        res.push(rt);
        for (let i = 0; i < 5; i++) {
            let ph0 = Utils.as(rt.referent, PhoneReferent);
            if (ph0.add_number !== null) 
                return res;
            let alt = PhoneItemToken.try_attach_alternate(rt.end_token.next, ph0, pli);
            if (alt === null) 
                break;
            let ph = new PhoneReferent();
            for (const s of rt.referent.slots) {
                ph.add_slot(s.type_name, s.value, false, 0);
            }
            let num = ph.number;
            if (num === null || num.length <= alt.value.length) 
                break;
            ph.number = num.substring(0, 0 + num.length - alt.value.length) + alt.value;
            ph.m_template = ph0.m_template;
            let rt2 = new ReferentToken(ph, alt.begin_token, alt.end_token);
            res.push(rt2);
            rt = rt2;
        }
        let add = PhoneItemToken.try_attach_additional(rt.end_token.next);
        if (add !== null) {
            for (const rr of res) {
                (rr.referent).add_number = add.value;
            }
            res[res.length - 1].end_token = add.end_token;
        }
        return res;
    }
    
    process_referent(begin, end) {
        let pli = PhoneItemToken.try_attach_all(begin);
        if (pli === null || pli.length === 0) 
            return null;
        let i = 0;
        for (; i < pli.length; i++) {
            if (pli[i].item_type !== PhoneItemTokenPhoneItemType.PREFIX) 
                break;
        }
        let rt = this._try_attach_(pli, i, true, null, 0);
        if (rt !== null) {
            rt.begin_token = begin;
            return rt;
        }
        return null;
    }
    
    _try_attach_(pli, ind, is_phone_before, prev_phone, lev = 0) {
        if (ind >= pli.length || lev > 4) 
            return null;
        let country_code = null;
        let city_code = null;
        let j = ind;
        if (prev_phone !== null && prev_phone.m_template !== null && pli[j].item_type === PhoneItemTokenPhoneItemType.NUMBER) {
            let tmp = new StringBuilder();
            for (let jj = j; jj < pli.length; jj++) {
                if (pli[jj].item_type === PhoneItemTokenPhoneItemType.NUMBER) 
                    tmp.append(pli[jj].value.length);
                else if (pli[jj].item_type === PhoneItemTokenPhoneItemType.DELIM) {
                    if (pli[jj].value === " ") 
                        break;
                    tmp.append(pli[jj].value);
                    continue;
                }
                else 
                    break;
                let templ0 = tmp.toString();
                if (templ0 === prev_phone.m_template) {
                    if ((jj + 1) < pli.length) {
                        if (pli[jj + 1].item_type === PhoneItemTokenPhoneItemType.PREFIX && (jj + 2) === pli.length) {
                        }
                        else 
                            pli.splice(jj + 1, pli.length - jj - 1);
                    }
                    break;
                }
            }
        }
        if ((j < pli.length) && pli[j].item_type === PhoneItemTokenPhoneItemType.COUNTRYCODE) {
            country_code = pli[j].value;
            if (country_code !== "8") {
                let cc = PhoneHelper.get_country_prefix(country_code);
                if (cc !== null && (cc.length < country_code.length)) {
                    city_code = country_code.substring(cc.length);
                    country_code = cc;
                }
            }
            j++;
        }
        else if ((j < pli.length) && pli[j].can_be_country_prefix) {
            let k = j + 1;
            if ((k < pli.length) && pli[k].item_type === PhoneItemTokenPhoneItemType.DELIM) 
                k++;
            let rrt = this._try_attach_(pli, k, is_phone_before, null, lev + 1);
            if (rrt !== null) {
                if ((((is_phone_before && pli[j + 1].item_type === PhoneItemTokenPhoneItemType.DELIM && pli[j + 1].begin_token.is_hiphen) && pli[j].item_type === PhoneItemTokenPhoneItemType.NUMBER && pli[j].value.length === 3) && ((j + 2) < pli.length) && pli[j + 2].item_type === PhoneItemTokenPhoneItemType.NUMBER) && pli[j + 2].value.length === 3) {
                }
                else {
                    country_code = pli[j].value;
                    j++;
                }
            }
        }
        if (((j < pli.length) && pli[j].item_type === PhoneItemTokenPhoneItemType.NUMBER && ((pli[j].value[0] === '8' || pli[j].value[0] === '7'))) && country_code === null) {
            if (pli[j].value.length === 1) {
                country_code = pli[j].value;
                j++;
            }
            else if (pli[j].value.length === 4) {
                country_code = pli[j].value.substring(0, 0 + 1);
                if (city_code === null) 
                    city_code = pli[j].value.substring(1);
                else 
                    city_code += pli[j].value.substring(1);
                j++;
            }
            else if (pli[j].value.length === 11 && j === (pli.length - 1) && is_phone_before) {
                let ph0 = new PhoneReferent();
                if (pli[j].value[0] !== '8') 
                    ph0.country_code = pli[j].value.substring(0, 0 + 1);
                ph0.number = pli[j].value.substring(1, 1 + 3) + pli[j].value.substring(4);
                return new ReferentToken(ph0, pli[0].begin_token, pli[j].end_token);
            }
            else if (city_code === null && pli[j].value.length > 3 && ((j + 1) < pli.length)) {
                let sum = 0;
                for (const it of pli) {
                    if (it.item_type === PhoneItemTokenPhoneItemType.NUMBER) 
                        sum += it.value.length;
                }
                if (sum === 11) {
                    city_code = pli[j].value.substring(1);
                    j++;
                }
            }
        }
        if ((j < pli.length) && pli[j].item_type === PhoneItemTokenPhoneItemType.CITYCODE) {
            if (city_code === null) 
                city_code = pli[j].value;
            else 
                city_code += pli[j].value;
            j++;
        }
        if ((j < pli.length) && pli[j].item_type === PhoneItemTokenPhoneItemType.DELIM) 
            j++;
        if ((country_code === "8" && city_code === null && ((j + 3) < pli.length)) && pli[j].item_type === PhoneItemTokenPhoneItemType.NUMBER) {
            if (pli[j].value.length === 3 || pli[j].value.length === 4) {
                city_code = pli[j].value;
                j++;
                if ((j < pli.length) && pli[j].item_type === PhoneItemTokenPhoneItemType.DELIM) 
                    j++;
            }
        }
        let normal_num_len = 0;
        if (country_code === "421") 
            normal_num_len = 9;
        let num = new StringBuilder();
        let templ = new StringBuilder();
        let part_length = new Array();
        let delim = null;
        let ok = false;
        let additional = null;
        let std = false;
        if (country_code !== null && ((j + 4) < pli.length) && j > 0) {
            if (((((pli[j - 1].value === "-" || pli[j - 1].item_type === PhoneItemTokenPhoneItemType.COUNTRYCODE)) && pli[j].item_type === PhoneItemTokenPhoneItemType.NUMBER && pli[j + 1].item_type === PhoneItemTokenPhoneItemType.DELIM) && pli[j + 2].item_type === PhoneItemTokenPhoneItemType.NUMBER && pli[j + 3].item_type === PhoneItemTokenPhoneItemType.DELIM) && pli[j + 4].item_type === PhoneItemTokenPhoneItemType.NUMBER) {
                if ((((pli[j].value.length + pli[j + 2].value.length) === 6 || ((pli[j].value.length === 4 && pli[j + 2].value.length === 5)))) && ((pli[j + 4].value.length === 4 || pli[j + 4].value.length === 1))) {
                    num.append(pli[j].value);
                    num.append(pli[j + 2].value);
                    num.append(pli[j + 4].value);
                    templ.append(pli[j].value.length).append(pli[j + 1].value).append(pli[j + 2].value.length).append(pli[j + 3].value).append(pli[j + 4].value.length);
                    std = true;
                    ok = true;
                    j += 5;
                }
            }
        }
        for (; j < pli.length; j++) {
            if (std) 
                break;
            if (pli[j].item_type === PhoneItemTokenPhoneItemType.DELIM) {
                if (pli[j].is_in_brackets) 
                    continue;
                if (j > 0 && pli[j - 1].is_in_brackets) 
                    continue;
                if (templ.length > 0) 
                    templ.append(pli[j].value);
                if (delim === null) 
                    delim = pli[j].value;
                else if (pli[j].value !== delim) {
                    if ((part_length.length === 2 && ((part_length[0] === 3 || part_length[0] === 4)) && city_code === null) && part_length[1] === 3) {
                        city_code = num.toString().substring(0, 0 + part_length[0]);
                        num.remove(0, part_length[0]);
                        part_length.splice(0, 1);
                        delim = pli[j].value;
                        continue;
                    }
                    if (is_phone_before && ((j + 1) < pli.length) && pli[j + 1].item_type === PhoneItemTokenPhoneItemType.NUMBER) {
                        if (num.length < 6) 
                            continue;
                        if (normal_num_len > 0 && (num.length + pli[j + 1].value.length) === normal_num_len) 
                            continue;
                    }
                    break;
                }
                else 
                    continue;
                ok = false;
            }
            else if (pli[j].item_type === PhoneItemTokenPhoneItemType.NUMBER) {
                if (num.length === 0 && pli[j].begin_token.previous !== null && pli[j].begin_token.previous.is_table_control_char) {
                    let tt = pli[pli.length - 1].end_token.next;
                    if (tt !== null && tt.is_char_of(",.")) 
                        tt = tt.next;
                    if (tt instanceof NumberToken) 
                        return null;
                }
                if ((num.length + pli[j].value.length) > 13) {
                    if (j > 0 && pli[j - 1].item_type === PhoneItemTokenPhoneItemType.DELIM) 
                        j--;
                    ok = true;
                    break;
                }
                num.append(pli[j].value);
                part_length.push(pli[j].value.length);
                templ.append(pli[j].value.length);
                ok = true;
                if (num.length > 10) {
                    j++;
                    if ((j < pli.length) && pli[j].item_type === PhoneItemTokenPhoneItemType.ADDNUMBER) {
                        additional = pli[j].value;
                        j++;
                    }
                    break;
                }
            }
            else if (pli[j].item_type === PhoneItemTokenPhoneItemType.ADDNUMBER) {
                additional = pli[j].value;
                j++;
                break;
            }
            else 
                break;
        }
        if ((j === (pli.length - 1) && pli[j].is_in_brackets && ((pli[j].value.length === 3 || pli[j].value.length === 4))) && additional === null) {
            additional = pli[j].value;
            j++;
        }
        if ((j < pli.length) && pli[j].item_type === PhoneItemTokenPhoneItemType.PREFIX && pli[j].is_in_brackets) {
            is_phone_before = true;
            j++;
        }
        if ((country_code === null && city_code !== null && city_code.length > 3) && (num.length < 8) && city_code[0] !== '8') {
            if ((city_code.length + num.length) === 10) {
            }
            else {
                let cc = PhoneHelper.get_country_prefix(city_code);
                if (cc !== null) {
                    if (cc.length > 1 && (city_code.length - cc.length) > 1) {
                        country_code = cc;
                        city_code = city_code.substring(cc.length);
                    }
                }
            }
        }
        if (country_code === null && city_code !== null && city_code.startsWith("00")) {
            let cc = PhoneHelper.get_country_prefix(city_code.substring(2));
            if (cc !== null) {
                if (city_code.length > (cc.length + 3)) {
                    country_code = cc;
                    city_code = city_code.substring(cc.length + 2);
                }
            }
        }
        if (num.length === 0 && city_code !== null) {
            if (city_code.length === 10) {
                num.append(city_code.substring(3));
                part_length.push(num.length);
                city_code = city_code.substring(0, 0 + 3);
                ok = true;
            }
            else if (((city_code.length === 9 || city_code.length === 11 || city_code.length === 8)) && ((is_phone_before || country_code !== null))) {
                num.append(city_code);
                part_length.push(num.length);
                city_code = null;
                ok = true;
            }
        }
        if (num.length < 4) 
            ok = false;
        if (num.length < 7) {
            if (city_code !== null && (city_code.length + num.length) > 7) {
                if (!is_phone_before && city_code.length === 3) {
                    let ii = 0;
                    for (ii = 0; ii < part_length.length; ii++) {
                        if (part_length[ii] === 3) {
                        }
                        else if (part_length[ii] > 3) 
                            break;
                        else if ((ii < (part_length.length - 1)) || (part_length[ii] < 2)) 
                            break;
                    }
                    if (ii >= part_length.length) {
                        if (country_code === "61") {
                        }
                        else 
                            ok = false;
                    }
                }
            }
            else if (((num.length === 6 || num.length === 5)) && ((part_length.length >= 1 && part_length.length <= 3)) && is_phone_before) {
                if (pli[0].item_type === PhoneItemTokenPhoneItemType.PREFIX && pli[0].kind === PhoneKind.HOME) 
                    ok = false;
            }
            else if (prev_phone !== null && prev_phone.number !== null && ((prev_phone.number.length === num.length || prev_phone.number.length === (num.length + 3) || prev_phone.number.length === (num.length + 4)))) {
            }
            else if (num.length > 4 && prev_phone !== null && templ.toString() === prev_phone.m_template) 
                ok = true;
            else 
                ok = false;
        }
        if (delim === "." && country_code === null && city_code === null) 
            ok = false;
        if ((is_phone_before && country_code === null && city_code === null) && num.length > 10) {
            let cc = PhoneHelper.get_country_prefix(num.toString());
            if (cc !== null) {
                if ((num.length - cc.length) === 9) {
                    country_code = cc;
                    num.remove(0, cc.length);
                    ok = true;
                }
            }
        }
        if (ok) {
            if (std) {
            }
            else if (prev_phone !== null && prev_phone.number !== null && (((prev_phone.number.length === num.length || prev_phone.number.length === (num.length + 3) || prev_phone.number.length === (num.length + 4)) || prev_phone.m_template === templ.toString()))) {
            }
            else if ((part_length.length === 3 && part_length[0] === 3 && part_length[1] === 2) && part_length[2] === 2) {
            }
            else if (part_length.length === 3 && is_phone_before) {
            }
            else if ((part_length.length === 4 && (((part_length[0] + part_length[1]) === 3)) && part_length[2] === 2) && part_length[3] === 2) {
            }
            else if ((part_length.length === 4 && part_length[0] === 3 && part_length[1] === 3) && part_length[2] === 2 && part_length[3] === 2) {
            }
            else if (part_length.length === 5 && (part_length[1] + part_length[2]) === 4 && (part_length[3] + part_length[4]) === 4) {
            }
            else if (part_length.length > 4) 
                ok = false;
            else if (part_length.length > 3 && city_code !== null) 
                ok = false;
            else if ((is_phone_before || city_code !== null || country_code !== null) || additional !== null) 
                ok = true;
            else {
                ok = false;
                if (((num.length === 6 || num.length === 7)) && (part_length.length < 4) && j > 0) {
                    let next_ph = this.get_next_phone(pli[j - 1].end_token.next, lev + 1);
                    if (next_ph !== null) {
                        let d = next_ph.number.length - num.length;
                        if (d === 0 || d === 3 || d === 4) 
                            ok = true;
                    }
                }
            }
        }
        let end = (j > 0 ? pli[j - 1].end_token : null);
        if (end === null) 
            ok = false;
        if ((ok && city_code === null && country_code === null) && prev_phone === null && !is_phone_before) {
            if (!end.is_whitespace_after && end.next !== null) {
                let tt = end.next;
                if (tt.is_char_of(".,)") && tt.next !== null) 
                    tt = tt.next;
                if (!tt.is_whitespace_before) 
                    ok = false;
            }
        }
        if (!ok) 
            return null;
        if (templ.length > 0 && !Utils.isDigit(templ.charAt(templ.length - 1))) 
            templ.length = templ.length - 1;
        if ((country_code === null && city_code !== null && city_code.length > 3) && num.length > 6) {
            let cc = PhoneHelper.get_country_prefix(city_code);
            if (cc !== null && ((cc.length + 1) < city_code.length)) {
                country_code = cc;
                city_code = city_code.substring(cc.length);
            }
        }
        if (pli[0].begin_token.previous !== null) {
            if (pli[0].begin_token.previous.is_value("ГОСТ", null) || pli[0].begin_token.previous.is_value("ТУ", null)) 
                return null;
        }
        let ph = new PhoneReferent();
        if (country_code !== null) 
            ph.country_code = country_code;
        let number = num.toString();
        if ((city_code === null && num.length > 7 && part_length.length > 0) && (part_length[0] < 5)) {
            city_code = number.substring(0, 0 + part_length[0]);
            number = number.substring(part_length[0]);
        }
        if (city_code === null && num.length === 11 && num.charAt(0) === '8') {
            city_code = number.substring(1, 1 + 3);
            number = number.substring(4);
        }
        if (city_code === null && num.length === 10) {
            city_code = number.substring(0, 0 + 3);
            number = number.substring(3);
        }
        if (city_code !== null) 
            number = city_code + number;
        else if (country_code === null && prev_phone !== null) {
            let ok1 = false;
            if (prev_phone.number.length >= (number.length + 2)) 
                ok1 = true;
            else if (templ.length > 0 && prev_phone.m_template !== null && LanguageHelper.ends_with(prev_phone.m_template, templ.toString())) 
                ok1 = true;
            if (ok1 && prev_phone.number.length > number.length) 
                number = prev_phone.number.substring(0, 0 + prev_phone.number.length - number.length) + number;
        }
        if (ph.country_code === null && prev_phone !== null && prev_phone.country_code !== null) {
            if (prev_phone.number.length === number.length) 
                ph.country_code = prev_phone.country_code;
        }
        ok = false;
        for (const d of number) {
            if (d !== '0') {
                ok = true;
                break;
            }
        }
        if (!ok) 
            return null;
        if (country_code !== null) {
            if (number.length < 7) 
                return null;
        }
        else {
            let s = PhoneHelper.get_country_prefix(number);
            if (s !== null) {
                let num2 = number.substring(s.length);
                if (num2.length >= 10 && num2.length <= 11) {
                    number = num2;
                    if (s !== "7") 
                        ph.country_code = s;
                }
            }
            if (number.length === 8 && prev_phone === null) 
                return null;
        }
        if (number.length > 11) {
            if ((number.length < 14) && ((country_code === "1" || country_code === "43"))) {
            }
            else 
                return null;
        }
        ph.number = number;
        if (additional !== null) 
            ph.add_slot(PhoneReferent.ATTR_ADDNUMBER, additional, true, 0);
        if (!is_phone_before && end.next !== null && !end.is_newline_after) {
            if (end.next.is_char_of("+=") || end.next.is_hiphen) 
                return null;
        }
        if (country_code !== null && country_code === "7") {
            if (number.length !== 10) 
                return null;
        }
        ph.m_template = templ.toString();
        if (j === (pli.length - 1) && pli[j].item_type === PhoneItemTokenPhoneItemType.PREFIX && !pli[j].is_newline_before) {
            end = pli[j].end_token;
            if (pli[j].kind !== PhoneKind.UNDEFINED) 
                ph.kind = pli[j].kind;
        }
        let res = new ReferentToken(ph, pli[0].begin_token, end);
        if (pli[0].item_type === PhoneItemTokenPhoneItemType.PREFIX && pli[0].end_token.next.is_table_control_char) 
            res.begin_token = pli[1].begin_token;
        return res;
    }
    
    get_next_phone(t, lev) {
        if (t !== null && t.is_char(',')) 
            t = t.next;
        if (t === null || lev > 3) 
            return null;
        let its = PhoneItemToken.try_attach_all(t);
        if (its === null) 
            return null;
        let rt = this._try_attach_(its, 0, false, null, lev + 1);
        if (rt === null) 
            return null;
        return Utils.as(rt.referent, PhoneReferent);
    }
    
    static initialize() {
        if (PhoneAnalyzer.m_inited) 
            return;
        PhoneAnalyzer.m_inited = true;
        MetaPhone.initialize();
        try {
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            PhoneHelper.initialize();
            PhoneItemToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        } catch (ex) {
            throw new Error(ex.message);
        }
        ProcessorService.register_analyzer(new PhoneAnalyzer());
    }
    
    static static_constructor() {
        PhoneAnalyzer.ANALYZER_NAME = "PHONE";
        PhoneAnalyzer.m_inited = false;
    }
}


PhoneAnalyzer.PhoneAnalizerData = class  extends AnalyzerData {
    
    constructor() {
        super();
        this.m_phones_hash = new Hashtable();
    }
    
    register_referent(referent) {
        const ReferentEqualType = require("./../ReferentEqualType");
        const Referent = require("./../Referent");
        const PhoneReferent = require("./PhoneReferent");
        let _phone = Utils.as(referent, PhoneReferent);
        if (_phone === null) 
            return null;
        let key = _phone.number;
        if (key.length >= 10) 
            key = key.substring(3);
        let ph_li = [ ];
        let wrapph_li2640 = new RefOutArgWrapper();
        let inoutres2641 = this.m_phones_hash.tryGetValue(key, wrapph_li2640);
        ph_li = wrapph_li2640.value;
        if (!inoutres2641) 
            this.m_phones_hash.put(key, (ph_li = new Array()));
        for (const p of ph_li) {
            if (p.can_be_equals(_phone, ReferentEqualType.WITHINONETEXT)) {
                p.merge_slots(_phone, true);
                return p;
            }
        }
        ph_li.push(_phone);
        this.m_referents.push(_phone);
        return _phone;
    }
}


PhoneAnalyzer.static_constructor();

module.exports = PhoneAnalyzer