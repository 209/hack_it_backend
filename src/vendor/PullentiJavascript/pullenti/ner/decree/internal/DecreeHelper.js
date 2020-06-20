/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const GetTextAttr = require("./../../core/GetTextAttr");
const MetaToken = require("./../../MetaToken");
const NumberToken = require("./../../NumberToken");
const PartTokenItemType = require("./PartTokenItemType");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const NumberExType = require("./../../core/NumberExType");
const ReferentToken = require("./../../ReferentToken");
const NumberHelper = require("./../../core/NumberHelper");
const MoneyReferent = require("./../../money/MoneyReferent");
const CanonicDecreeRefUri = require("./CanonicDecreeRefUri");
const MiscHelper = require("./../../core/MiscHelper");
const DecreeKind = require("./../DecreeKind");
const DecreePartReferent = require("./../DecreePartReferent");
const DecreeTokenItemType = require("./DecreeTokenItemType");
const DecreeReferent = require("./../DecreeReferent");
const BracketHelper = require("./../../core/BracketHelper");
const DecreeToken = require("./DecreeToken");

/**
 * Некоторые полезные функции для НПА
 */
class DecreeHelper {
    
    static parse_date_time(str) {
        if (Utils.isNullOrEmpty(str)) 
            return null;
        try {
            let prts = Utils.splitString(str, '.', false);
            let y = 0;
            let wrapy829 = new RefOutArgWrapper();
            let inoutres830 = Utils.tryParseInt(prts[0], wrapy829);
            y = wrapy829.value;
            if (!inoutres830) 
                return null;
            let mon = 0;
            let day = 0;
            if (prts.length > 1) {
                let wrapmon827 = new RefOutArgWrapper();
                let inoutres828 = Utils.tryParseInt(prts[1], wrapmon827);
                mon = wrapmon827.value;
                if (inoutres828) {
                    if (prts.length > 2) {
                        let wrapday826 = new RefOutArgWrapper();
                        Utils.tryParseInt(prts[2], wrapday826);
                        day = wrapday826.value;
                    }
                }
            }
            if (mon <= 0) 
                mon = 1;
            if (day <= 0) 
                day = 1;
            if (day > Utils.daysInMonth(y, mon)) 
                day = Utils.daysInMonth(y, mon);
            return new Date(y, mon - 1, day, 0, 0, 0);
        } catch (ex) {
        }
        return null;
    }
    
    /**
     * Это для оформления ссылок по некоторым стандартам (когда гиперссылкой нужно выделить не всю сущность, 
     *  а лишь некоторую её часть)
     * @param t 
     * @return 
     */
    static try_create_canonic_decree_ref_uri(t) {
        const PartToken = require("./PartToken");
        if (!((t instanceof ReferentToken))) 
            return null;
        let dr = Utils.as(t.get_referent(), DecreeReferent);
        let res = null;
        if (dr !== null) {
            if (dr.kind === DecreeKind.PUBLISHER) 
                return null;
            res = CanonicDecreeRefUri._new831(t.kit.sofa.text, dr, t.begin_char, t.end_char);
            if ((t.previous !== null && t.previous.is_char('(') && t.next !== null) && t.next.is_char(')')) 
                return res;
            if ((t).misc_attrs !== 0) 
                return res;
            let rt = Utils.as(t, ReferentToken);
            if (rt.begin_token.is_char('(') && rt.end_token.is_char(')')) {
                res = CanonicDecreeRefUri._new831(t.kit.sofa.text, dr, rt.begin_token.next.begin_char, rt.end_token.previous.end_char);
                return res;
            }
            let next_decree_items = null;
            if ((t.next !== null && t.next.is_comma_and && (t.next.next instanceof ReferentToken)) && (t.next.next.get_referent() instanceof DecreeReferent)) {
                next_decree_items = DecreeToken.try_attach_list((t.next.next).begin_token, null, 10, false);
                if (next_decree_items !== null && next_decree_items.length > 1) {
                    for (let i = 0; i < (next_decree_items.length - 1); i++) {
                        if (next_decree_items[i].is_newline_after) {
                            next_decree_items.splice(i + 1, next_decree_items.length - i - 1);
                            break;
                        }
                    }
                }
            }
            let was_typ = false;
            let was_num = false;
            for (let tt = (t).begin_token; tt !== null && tt.end_char <= t.end_char; tt = tt.next) {
                if (tt.begin_char === t.begin_char && tt.is_char('(') && tt.next !== null) 
                    res.begin_char = tt.next.begin_char;
                if (tt.is_char('(') && tt.next !== null && tt.next.is_value("ДАЛЕЕ", null)) {
                    if (res.end_char >= tt.begin_char) 
                        res.end_char = tt.previous.end_char;
                    break;
                }
                if (tt.end_char === t.end_char && tt.is_char(')')) {
                    res.end_char = tt.previous.end_char;
                    for (let tt1 = tt.previous; tt1 !== null && tt1.begin_char >= res.begin_char; tt1 = tt1.previous) {
                        if (tt1.is_char('(') && tt1.previous !== null) {
                            if (res.begin_char < tt1.previous.begin_char) 
                                res.end_char = tt1.previous.end_char;
                        }
                    }
                }
                let li = DecreeToken.try_attach_list(tt, null, 10, false);
                if (li !== null && li.length > 0) {
                    for (let ii = 0; ii < (li.length - 1); ii++) {
                        if (li[ii].typ === DecreeTokenItemType.TYP && li[ii + 1].typ === DecreeTokenItemType.TERR) 
                            res.type_with_geo = MiscHelper.get_text_value(li[ii].begin_token, li[ii + 1].end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE);
                    }
                    if ((next_decree_items !== null && next_decree_items.length > 1 && (next_decree_items.length < li.length)) && next_decree_items[0].typ !== DecreeTokenItemType.TYP) {
                        let d = li.length - next_decree_items.length;
                        let j = 0;
                        for (j = 0; j < next_decree_items.length; j++) {
                            if (next_decree_items[j].typ !== li[d + j].typ) 
                                break;
                        }
                        if (j >= next_decree_items.length) {
                            li.splice(0, d);
                            res.begin_char = li[0].begin_char;
                        }
                    }
                    else if ((next_decree_items !== null && next_decree_items.length === 1 && next_decree_items[0].typ === DecreeTokenItemType.NAME) && li.length === 2 && li[1].typ === DecreeTokenItemType.NAME) {
                        res.begin_char = li[1].begin_char;
                        res.end_char = li[1].end_char;
                        break;
                    }
                    else if ((next_decree_items !== null && next_decree_items.length === 1 && next_decree_items[0].typ === DecreeTokenItemType.NUMBER) && li[li.length - 1].typ === DecreeTokenItemType.NUMBER) {
                        res.begin_char = li[li.length - 1].begin_char;
                        res.end_char = li[li.length - 1].end_char;
                    }
                    for (let i = 0; i < li.length; i++) {
                        let l_ = li[i];
                        if (l_.begin_char > t.end_char) {
                            li.splice(i, li.length - i);
                            break;
                        }
                        if (l_.typ === DecreeTokenItemType.NAME) {
                            if (!was_num) {
                                if (dr.kind === DecreeKind.CONTRACT) 
                                    continue;
                                if (((i + 1) < li.length) && ((li[i + 1].typ === DecreeTokenItemType.DATE || li[i + 1].typ === DecreeTokenItemType.NUMBER))) 
                                    continue;
                            }
                            let ee = l_.begin_token.previous.end_char;
                            if (ee > res.begin_char && (ee < res.end_char)) 
                                res.end_char = ee;
                            break;
                        }
                        if (l_.typ === DecreeTokenItemType.NUMBER) 
                            was_num = true;
                        if (i === 0) {
                            if (l_.typ === DecreeTokenItemType.TYP) 
                                was_typ = true;
                            else if (l_.typ === DecreeTokenItemType.OWNER || l_.typ === DecreeTokenItemType.ORG) {
                                if (((i + 1) < li.length) && ((li[1].typ === DecreeTokenItemType.DATE || li[1].typ === DecreeTokenItemType.NUMBER))) 
                                    was_typ = true;
                            }
                            if (was_typ) {
                                let tt0 = l_.begin_token.previous;
                                if (tt0 !== null && tt0.is_char('.')) 
                                    tt0 = tt0.previous;
                                if (tt0 !== null && ((tt0.is_value("УТВЕРЖДЕННЫЙ", null) || tt0.is_value("УТВЕРДИТЬ", null) || tt0.is_value("УТВ", null)))) {
                                    if (l_.begin_char > res.begin_char) {
                                        res.begin_char = l_.begin_char;
                                        if (res.end_char < res.begin_char) 
                                            res.end_char = t.end_char;
                                        res.is_adopted = true;
                                    }
                                }
                            }
                        }
                    }
                    if (li.length > 0) {
                        tt = li[li.length - 1].end_token;
                        if (tt.is_char(')')) 
                            tt = tt.previous;
                        continue;
                    }
                }
                if (was_typ) {
                    let na = DecreeToken.try_attach_name(tt, dr.typ0, true, false);
                    if (na !== null && tt.begin_char > t.begin_char) {
                        let tt1 = na.end_token.next;
                        if (tt1 !== null && tt1.is_char_of(",()")) 
                            tt1 = tt1.next;
                        if (tt1 !== null && (tt1.end_char < t.end_char)) {
                            if (tt1.is_value("УТВЕРЖДЕННЫЙ", null) || tt1.is_value("УТВЕРДИТЬ", null) || tt1.is_value("УТВ", null)) {
                                tt = tt1;
                                continue;
                            }
                        }
                        if (tt.previous !== null && tt.previous.is_char(':') && na.end_char <= res.end_char) {
                            res.begin_char = tt.begin_char;
                            break;
                        }
                        if (tt.previous.end_char > res.begin_char) {
                            res.end_char = tt.previous.end_char;
                            break;
                        }
                    }
                }
            }
            return res;
        }
        let dpr = Utils.as(t.get_referent(), DecreePartReferent);
        if (dpr === null) 
            return null;
        if ((t.previous !== null && t.previous.is_hiphen && (t.previous.previous instanceof ReferentToken)) && (t.previous.previous.get_referent() instanceof DecreePartReferent)) {
            if (DecreePartReferent.create_range_referent(Utils.as(t.previous.previous.get_referent(), DecreePartReferent), dpr) !== null) 
                return null;
        }
        let t1 = t;
        let has_diap = false;
        let diap_ref = null;
        if ((t.next !== null && t.next.is_hiphen && (t.next.next instanceof ReferentToken)) && (t.next.next.get_referent() instanceof DecreePartReferent)) {
            let diap = DecreePartReferent.create_range_referent(Utils.as(dpr, DecreePartReferent), Utils.as(t.next.next.get_referent(), DecreePartReferent));
            if (diap !== null) {
                dpr = diap;
                has_diap = true;
                t1 = t.next.next;
                diap_ref = Utils.as(t1, ReferentToken);
            }
        }
        res = CanonicDecreeRefUri._new833(t.kit.sofa.text, dpr, t.begin_char, t1.end_char, has_diap);
        if ((t.previous !== null && t.previous.is_char('(') && t1.next !== null) && t1.next.is_char(')')) 
            return res;
        for (let tt = (t).begin_token; tt !== null && tt.end_char <= t.end_char; tt = tt.next) {
            if (tt.get_referent() instanceof DecreeReferent) {
                if (tt.begin_char > t.begin_char) {
                    res.end_char = tt.previous.end_char;
                    if (tt.previous.morph.class0.is_preposition && tt.previous.previous !== null) 
                        res.end_char = tt.previous.previous.end_char;
                }
                else if (tt.end_char < t.end_char) 
                    res.begin_char = tt.begin_char;
                break;
            }
        }
        let has_same_before = DecreeHelper._has_same_decree(t, dpr, true);
        let has_same_after = DecreeHelper._has_same_decree(t, dpr, false);
        let ptmin = PartTokenItemType.PREFIX;
        let ptmin2 = PartTokenItemType.PREFIX;
        let max = 0;
        let max2 = 0;
        for (const s of dpr.slots) {
            let pt = PartToken._get_type_by_attr_name(s.type_name);
            if (pt === PartTokenItemType.PREFIX) 
                continue;
            let co = PartToken._get_rank(pt);
            if (co < 1) {
                if (pt === PartTokenItemType.PART && dpr.find_slot(DecreePartReferent.ATTR_CLAUSE, null, true) !== null) 
                    co = PartToken._get_rank(PartTokenItemType.PARAGRAPH);
                else 
                    continue;
            }
            if (co > max) {
                max2 = max;
                ptmin2 = ptmin;
                max = co;
                ptmin = pt;
            }
            else if (co > max2) {
                max2 = co;
                ptmin2 = pt;
            }
        }
        if (ptmin !== PartTokenItemType.PREFIX) {
            for (let tt = (t).begin_token; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
                if (tt.begin_char >= res.begin_char) {
                    let pt = PartToken.try_attach(tt, null, false, false);
                    if (pt !== null && pt.typ === ptmin) {
                        res.begin_char = pt.begin_char;
                        res.end_char = pt.end_char;
                        if (pt.typ === PartTokenItemType.APPENDIX && pt.end_token.is_value("К", null) && pt.begin_token !== pt.end_token) 
                            res.end_char = pt.end_token.previous.end_char;
                        if (pt.end_char === t.end_char) {
                            if ((t.next !== null && t.next.is_comma_and && (t.next.next instanceof ReferentToken)) && (t.next.next.get_referent() instanceof DecreePartReferent)) {
                                let tt1 = (t.next.next).begin_token;
                                let ok = true;
                                if (tt1.chars.is_letter) 
                                    ok = false;
                                if (ok) {
                                    for (const v of pt.values) {
                                        res.begin_char = v.begin_char;
                                        res.end_char = v.end_char;
                                        break;
                                    }
                                }
                            }
                        }
                        if (!has_diap) 
                            return res;
                        break;
                    }
                }
            }
            if (has_diap && diap_ref !== null) {
                for (let tt = diap_ref.begin_token; tt !== null && tt.end_char <= diap_ref.end_char; tt = tt.next) {
                    if (tt.is_char(',')) 
                        break;
                    if (tt !== diap_ref.begin_token && tt.is_whitespace_before) 
                        break;
                    res.end_char = tt.end_char;
                }
                return res;
            }
        }
        if (((has_same_before || has_same_after)) && ptmin !== PartTokenItemType.PREFIX) {
            for (let tt = (t).begin_token; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
                if (tt.begin_char >= res.begin_char) {
                    let pt = (!has_same_before ? PartToken.try_attach(tt, null, false, false) : null);
                    if (pt !== null) {
                        if (pt.typ === ptmin) {
                            for (const v of pt.values) {
                                res.begin_char = v.begin_char;
                                res.end_char = v.end_char;
                                return res;
                            }
                        }
                        tt = pt.end_token;
                        continue;
                    }
                    if ((tt instanceof NumberToken) && tt.begin_char === res.begin_char) {
                        res.end_char = tt.end_char;
                        for (; tt !== null && tt.next !== null; ) {
                            if (!tt.next.is_char('.') || tt.is_whitespace_after || tt.next.is_whitespace_after) 
                                break;
                            if (!((tt.next.next instanceof NumberToken))) 
                                break;
                            tt = tt.next.next;
                            res.end_char = tt.end_char;
                        }
                        if (tt.next !== null && tt.next.is_hiphen) {
                            if (tt.next.next instanceof NumberToken) {
                                tt = tt.next.next;
                                res.end_char = tt.end_char;
                                for (; tt !== null && tt.next !== null; ) {
                                    if (!tt.next.is_char('.') || tt.is_whitespace_after || tt.next.is_whitespace_after) 
                                        break;
                                    if (!((tt.next.next instanceof NumberToken))) 
                                        break;
                                    tt = tt.next.next;
                                    res.end_char = tt.end_char;
                                }
                            }
                            else if (tt.next.next !== null && (tt.next.next.get_referent() instanceof DecreePartReferent) && has_diap) 
                                res.end_char = (tt.next.next).begin_token.end_char;
                        }
                        return res;
                    }
                    if (BracketHelper.can_be_start_of_sequence(tt, true, false) && tt.begin_char === res.begin_char && has_same_before) {
                        let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                        if (br !== null && br.end_token.previous === tt.next) {
                            res.end_char = br.end_char;
                            return res;
                        }
                    }
                }
            }
            return res;
        }
        if (!has_same_before && !has_same_after && ptmin !== PartTokenItemType.PREFIX) {
            for (let tt = (t).begin_token; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
                if (tt.begin_char >= res.begin_char) {
                    let pts = PartToken.try_attach_list(tt, false, 40);
                    if (pts === null || pts.length === 0) 
                        break;
                    for (let i = 0; i < pts.length; i++) {
                        if (pts[i].typ === ptmin) {
                            res.begin_char = pts[i].begin_char;
                            res.end_char = pts[i].end_char;
                            tt = pts[i].end_token;
                            if (tt.next !== null && tt.next.is_hiphen) {
                                if (tt.next.next instanceof NumberToken) 
                                    res.end_char = tt.next.next.end_char;
                                else if (tt.next.next !== null && (tt.next.next.get_referent() instanceof DecreePartReferent) && has_diap) 
                                    res.end_char = (tt.next.next).begin_token.end_char;
                            }
                            return res;
                        }
                    }
                }
            }
        }
        return res;
    }
    
    static _has_same_decree(t, dpr, before) {
        const PartToken = require("./PartToken");
        if ((((before ? t.previous : t.next))) === null) 
            return false;
        t = ((before ? t.previous : t.next));
        if (t.is_comma_and || t.morph.class0.is_conjunction) {
        }
        else 
            return false;
        t = ((before ? t.previous : t.next));
        if (t === null) 
            return false;
        let dpr0 = Utils.as(t.get_referent(), DecreePartReferent);
        if (dpr0 === null) 
            return false;
        if (dpr0.owner !== dpr.owner) 
            return false;
        if (dpr0.owner === null) {
            if (dpr0.local_typ !== dpr.local_typ) 
                return false;
        }
        for (const s of dpr0.slots) {
            if (PartToken._get_type_by_attr_name(s.type_name) !== PartTokenItemType.PREFIX) {
                if (dpr.find_slot(s.type_name, null, true) === null) 
                    return false;
            }
        }
        for (const s of dpr.slots) {
            if (PartToken._get_type_by_attr_name(s.type_name) !== PartTokenItemType.PREFIX) {
                if (dpr0.find_slot(s.type_name, null, true) === null) 
                    return false;
            }
        }
        return true;
    }
    
    static _out_money(m) {
        let res = m.toString();
        res = Utils.replaceString(Utils.replaceString(Utils.replaceString(res, '.', ' '), "RUR", "руб."), "RUB", "руб.");
        return res;
    }
    
    /**
     * Проверка корректности НДС для суммы
     * @param t Указывает на значение, для которой должно далее следовать НДС
     * @param nds 
     * @return 
     */
    static check_nds(t, nds = 18, nds_mustbe_money = false) {
        if (t === null || nds <= 0) 
            return null;
        let m = Utils.as(t.get_referent(), MoneyReferent);
        if (m === null) 
            return null;
        let has_nds = false;
        let has_nds_perc = false;
        let has_all = false;
        let incl = false;
        let tt = null;
        let m1 = null;
        let ndst0 = null;
        let ndst1 = null;
        for (tt = t.next; tt !== null; tt = tt.next) {
            if (tt.is_value("НДС", null)) {
                has_nds = true;
                ndst0 = (ndst1 = tt);
                continue;
            }
            if (tt instanceof ReferentToken) {
                m1 = Utils.as(tt.get_referent(), MoneyReferent);
                break;
            }
            if (tt instanceof NumberToken) {
                let ne = NumberHelper.try_parse_number_with_postfix(tt);
                if (ne !== null && ne.ex_typ === NumberExType.PERCENT) {
                    if (Math.abs(ne.real_value - nds) > 0.0001) {
                        let ok = false;
                        if (has_nds) 
                            ok = true;
                        if (ok) 
                            return MetaToken._new834(tt, ne.end_token, ("Размер НДС должен быть " + nds + "%, а не " + ne.real_value + "%"));
                    }
                    tt = (ndst1 = ne.end_token);
                    has_nds_perc = true;
                    continue;
                }
            }
            if (tt.is_value("ВСЕГО", null)) {
                has_all = true;
                continue;
            }
            if (tt.is_value("ТОМ", null) || tt.is_value("ЧИСЛО", null) || tt.is_value("ВКЛЮЧАЯ", null)) {
                incl = true;
                continue;
            }
            if ((tt.is_value("КРОМЕ", null) || tt.is_value("ТОГО", null) || tt.is_value("РАЗМЕР", null)) || tt.is_value("СУММА", null) || tt.is_value("СТАВКА", null)) 
                continue;
            if (((tt.is_value("Т", null) && tt.next !== null && tt.next.is_char('.')) && tt.next.next !== null && tt.next.next.is_value("Ч", null)) && tt.next.next.next !== null && tt.next.next.next.is_char('.')) {
                incl = true;
                tt = tt.next.next.next;
                continue;
            }
            if (!tt.chars.is_letter || tt.morph.class0.is_preposition) 
                continue;
            break;
        }
        if (!has_nds) 
            return null;
        if (m1 === null) {
            if (nds_mustbe_money) 
                return MetaToken._new834(ndst0, ndst1, "Размер НДС должен быть в денежном выражении");
            return null;
        }
        if (has_all) 
            return null;
        let must_be = m.real_value;
        must_be = must_be * ((nds / (100)));
        if (incl) 
            must_be /= (((1) + ((nds / (100)))));
        let dd = must_be * (100);
        dd -= (Math.floor(dd));
        dd /= (100);
        must_be -= dd;
        if (dd >= 0.005) 
            must_be += 0.01;
        let real = m1.real_value;
        let delta = must_be - real;
        if (delta < 0) 
            delta = -delta;
        if (delta > 0.011) {
            if ((delta < 1) && m1.rest === 0 && m.rest === 0) {
            }
            else {
                let mr = MoneyReferent._new836(m1.currency, must_be);
                return MetaToken._new834(t, tt, ("Размер НДС должен быть " + DecreeHelper._out_money(mr) + ", а не " + DecreeHelper._out_money(m1)));
            }
        }
        if (incl) 
            return null;
        let m2 = null;
        has_all = false;
        for (tt = tt.next; tt !== null; tt = tt.next) {
            if (tt instanceof ReferentToken) {
                m2 = Utils.as(tt.get_referent(), MoneyReferent);
                break;
            }
            if (!tt.chars.is_letter || tt.morph.class0.is_preposition) 
                continue;
            if (tt.is_value("ВСЕГО", null)) {
                has_all = true;
                continue;
            }
            if (tt.is_value("НДС", null) || tt.is_value("ВМЕСТЕ", null)) 
                continue;
            break;
        }
        if (m2 !== null && has_all) {
            must_be = m.real_value + m1.real_value;
            delta = must_be - m2.real_value;
            if (delta < 0) 
                delta = -delta;
            if (delta > 0.01) {
                let mr = MoneyReferent._new836(m1.currency, must_be);
                let err = ("Всего с НДС должно быть " + DecreeHelper._out_money(mr) + ", а не " + DecreeHelper._out_money(m2));
                return MetaToken._new834(t, tt, err);
            }
        }
        return null;
    }
}


module.exports = DecreeHelper