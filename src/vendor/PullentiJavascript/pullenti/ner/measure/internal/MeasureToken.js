/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const GetTextAttr = require("./../../core/GetTextAttr");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const NumberSpellingType = require("./../../NumberSpellingType");
const NumberHelper = require("./../../core/NumberHelper");
const DateItemToken = require("./../../date/internal/DateItemToken");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const MetaToken = require("./../../MetaToken");
const NumberToken = require("./../../NumberToken");
const MeasureKind = require("./../MeasureKind");
const Referent = require("./../../Referent");
const MiscHelper = require("./../../core/MiscHelper");
const NounPhraseToken = require("./../../core/NounPhraseToken");
const ReferentToken = require("./../../ReferentToken");
const TextToken = require("./../../TextToken");
const UnitReferent = require("./../UnitReferent");
const MeasureReferent = require("./../MeasureReferent");
const UnitToken = require("./UnitToken");
const NumbersWithUnitToken = require("./NumbersWithUnitToken");
const BracketHelper = require("./../../core/BracketHelper");

class MeasureToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.nums = null;
        this.name = null;
        this.internals = new Array();
        this.internal_ex = null;
        this.is_set = false;
        this.reliable = false;
        this.is_empty = false;
    }
    
    toString() {
        return (this.name + ": " + this.nums.toString());
    }
    
    get_norm_values() {
        let li = this.create_refenets_tokens_with_register(null, false);
        if (li === null || (li.length < 1)) 
            return null;
        let mr = Utils.as(li[li.length - 1].referent, MeasureReferent);
        if (mr === null) 
            return null;
        return mr.to_string(true, null, 0);
    }
    
    create_refenets_tokens_with_register(ad, register = true) {
        if (this.internals.length === 0 && !this.reliable) {
            if (this.nums.units.length === 1 && this.nums.units[0].is_doubt) {
                if (this.nums.units[0].unknown_name !== null) {
                }
                else if (this.nums.is_newline_before) {
                }
                else if (this.nums.units[0].begin_token.length_char > 1 && this.nums.units[0].begin_token.get_morph_class_in_dictionary().is_undefined) {
                }
                else if (this.nums.from_val === null || this.nums.to_val === null) 
                    return null;
            }
        }
        let res = new Array();
        if (((this.nums === null || this.nums.plus_minus_percent)) && this.internals.length > 0) {
            let li_ex = null;
            if (this.internal_ex !== null) {
                li_ex = this.internal_ex.create_refenets_tokens_with_register(ad, true);
                if (li_ex !== null) 
                    res.splice(res.length, 0, ...li_ex);
            }
            let mr = new MeasureReferent();
            let templ0 = "1";
            let templ = null;
            if (this.name !== null) 
                mr.add_slot(MeasureReferent.ATTR_NAME, this.name, false, 0);
            let ints = new Array();
            for (let k = 0; k < this.internals.length; k++) {
                let ii = this.internals[k];
                ii.reliable = true;
                let li = ii.create_refenets_tokens_with_register(ad, false);
                if (li === null) 
                    continue;
                res.splice(res.length, 0, ...li);
                let mr0 = Utils.as(res[res.length - 1].referent, MeasureReferent);
                if (li_ex !== null) 
                    mr0.add_slot(MeasureReferent.ATTR_REF, li_ex[li_ex.length - 1], false, 0);
                if (k === 0 && !this.is_empty) {
                    templ0 = mr0.template;
                    mr0.template = "1";
                }
                if (ad !== null) 
                    mr0 = Utils.as(ad.register_referent(mr0), MeasureReferent);
                mr.add_slot(MeasureReferent.ATTR_VALUE, mr0, false, 0);
                ints.push(mr0);
                if (templ === null) 
                    templ = "1";
                else {
                    let nu = mr.get_string_values(MeasureReferent.ATTR_VALUE).length;
                    templ = (templ + (this.is_set ? ", " : " × ") + nu);
                }
            }
            if (this.is_set) 
                templ = "{" + templ + "}";
            if (templ0 !== "1") 
                templ = Utils.replaceString(templ0, "1", templ);
            if (this.nums !== null && this.nums.plus_minus_percent && this.nums.single_val !== null) {
                templ = ("[" + templ + " ±" + (this.internals.length + 1) + "%]");
                mr.add_value(this.nums.single_val);
            }
            mr.template = templ;
            let i = 0;
            let has_length = false;
            let uref = null;
            for (i = 0; i < ints.length; i++) {
                if (ints[i].kind === MeasureKind.LENGTH) {
                    has_length = true;
                    uref = Utils.as(ints[i].get_slot_value(MeasureReferent.ATTR_UNIT), UnitReferent);
                }
                else if (ints[i].units.length > 0) 
                    break;
            }
            if (ints.length > 1 && has_length && uref !== null) {
                for (const ii of ints) {
                    if (ii.find_slot(MeasureReferent.ATTR_UNIT, null, true) === null) {
                        ii.add_slot(MeasureReferent.ATTR_UNIT, uref, false, 0);
                        ii.kind = MeasureKind.LENGTH;
                    }
                }
            }
            if (ints.length === 3) {
                if (ints[0].kind === MeasureKind.LENGTH && ints[1].kind === MeasureKind.LENGTH && ints[2].kind === MeasureKind.LENGTH) 
                    mr.kind = MeasureKind.VOLUME;
                else if (ints[0].units.length === 0 && ints[1].units.length === 0 && ints[2].units.length === 0) {
                    let nam = mr.get_string_value(MeasureReferent.ATTR_NAME);
                    if (nam !== null) {
                        if (nam.includes("РАЗМЕР") || nam.includes("ГАБАРИТ")) 
                            mr.kind = MeasureKind.VOLUME;
                    }
                }
            }
            if (ints.length === 2) {
                if (ints[0].kind === MeasureKind.LENGTH && ints[1].kind === MeasureKind.LENGTH) 
                    mr.kind = MeasureKind.AREA;
            }
            if (!this.is_empty) {
                if (ad !== null) 
                    mr = Utils.as(ad.register_referent(mr), MeasureReferent);
                res.push(new ReferentToken(mr, this.begin_token, this.end_token));
            }
            return res;
        }
        let re2 = this.nums.create_refenets_tokens_with_register(ad, this.name, register);
        for (const ii of this.internals) {
            let li = ii.create_refenets_tokens_with_register(ad, true);
            if (li === null) 
                continue;
            res.splice(res.length, 0, ...li);
            re2[re2.length - 1].referent.add_slot(MeasureReferent.ATTR_REF, res[res.length - 1].referent, false, 0);
        }
        re2[re2.length - 1].begin_token = this.begin_token;
        re2[re2.length - 1].end_token = this.end_token;
        res.splice(res.length, 0, ...re2);
        return res;
    }
    
    static try_parse_minimal(t, add_units, can_omit_number = false) {
        if (t === null || (t instanceof ReferentToken)) 
            return null;
        let mt = NumbersWithUnitToken.try_parse_multi(t, add_units, can_omit_number, false, false, false);
        if (mt === null) 
            return null;
        if (mt[0].units.length === 0) 
            return null;
        if ((mt.length === 1 && mt[0].units.length === 1 && mt[0].units[0].is_doubt) && !mt[0].is_newline_before) 
            return null;
        let res = null;
        if (mt.length === 1) {
            res = MeasureToken._new1606(mt[0].begin_token, mt[mt.length - 1].end_token, mt[0]);
            res._parse_internals(add_units);
            return res;
        }
        res = new MeasureToken(mt[0].begin_token, mt[mt.length - 1].end_token);
        for (const m of mt) {
            res.internals.push(MeasureToken._new1606(m.begin_token, m.end_token, m));
        }
        return res;
    }
    
    _parse_internals(add_units) {
        if (this.end_token.next !== null && ((this.end_token.next.is_char_of("\\/") || this.end_token.next.is_value("ПРИ", null)))) {
            let mt1 = MeasureToken.try_parse(this.end_token.next.next, add_units, true, false, false, false);
            if (mt1 !== null) {
                this.internals.push(mt1);
                this.end_token = mt1.end_token;
            }
            else {
                let mt = NumbersWithUnitToken.try_parse(this.end_token.next.next, add_units, false, false, false, false);
                if (mt !== null && mt.units.length > 0 && !UnitToken.can_be_equals(this.nums.units, mt.units)) {
                    this.internals.push(MeasureToken._new1606(mt.begin_token, mt.end_token, mt));
                    this.end_token = mt.end_token;
                }
            }
        }
    }
    
    /**
     * Выделение вместе с наименованием
     * @param t 
     * @return 
     */
    static try_parse(t, add_units, can_be_set = true, can_units_absent = false, is_resctriction = false, is_subval = false) {
        if (!((t instanceof TextToken))) 
            return null;
        if (t.is_table_control_char) 
            return null;
        let t0 = t;
        let whd = null;
        let minmax = 0;
        let wrapminmax1619 = new RefOutArgWrapper(minmax);
        let tt = NumbersWithUnitToken._is_min_or_max(t0, wrapminmax1619);
        minmax = wrapminmax1619.value;
        if (tt !== null) 
            t = tt.next;
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSEPREPOSITION.value()) | (NounPhraseParseAttr.IGNOREBRACKETS.value())), 0, null);
        if (npt === null) {
            whd = NumbersWithUnitToken._try_parsewhl(t);
            if (whd !== null) 
                npt = new NounPhraseToken(t0, whd.end_token);
            else if (t0.is_value("КПД", null)) 
                npt = new NounPhraseToken(t0, t0);
            else if ((t0 instanceof TextToken) && t0.length_char > 3 && t0.get_morph_class_in_dictionary().is_undefined) 
                npt = new NounPhraseToken(t0, t0);
            else if (t0.is_value("T", null) && t0.chars.is_all_lower) {
                npt = new NounPhraseToken(t0, t0);
                t = t0;
                if (t.next !== null && t.next.is_char('=')) 
                    npt.end_token = t.next;
            }
            else if ((t0 instanceof TextToken) && t0.chars.is_letter && is_subval) {
                if (NumbersWithUnitToken.try_parse(t, add_units, false, false, false, false) !== null) 
                    return null;
                npt = new NounPhraseToken(t0, t0);
                for (t = t0.next; t !== null; t = t.next) {
                    if (t.whitespaces_before_count > 2) 
                        break;
                    else if (!((t instanceof TextToken))) 
                        break;
                    else if (!t.chars.is_letter) {
                        let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                        if (br !== null) 
                            npt.end_token = (t = br.end_token);
                        else 
                            break;
                    }
                    else if (NumbersWithUnitToken.try_parse(t, add_units, false, false, false, false) !== null) 
                        break;
                    else 
                        npt.end_token = t;
                }
            }
            else 
                return null;
        }
        else if (NumberHelper.try_parse_real_number(t, true, false) !== null) 
            return null;
        else {
            let dtok = DateItemToken.try_attach(t, null, false);
            if (dtok !== null) 
                return null;
        }
        let t1 = npt.end_token;
        t = npt.end_token;
        let _name = MetaToken._new581(npt.begin_token, npt.end_token, npt.morph);
        let units = null;
        let units2 = null;
        let _internals = new Array();
        let not = false;
        for (tt = t1.next; tt !== null; tt = tt.next) {
            if (tt.is_newline_before) 
                break;
            if (tt.is_table_control_char) 
                break;
            let wrapminmax1611 = new RefOutArgWrapper(minmax);
            let tt2 = NumbersWithUnitToken._is_min_or_max(tt, wrapminmax1611);
            minmax = wrapminmax1611.value;
            if (tt2 !== null) {
                t1 = (t = (tt = tt2));
                continue;
            }
            if ((tt.is_value("БЫТЬ", null) || tt.is_value("ДОЛЖЕН", null) || tt.is_value("ДОЛЖНЫЙ", null)) || tt.is_value("МОЖЕТ", null) || ((tt.is_value("СОСТАВЛЯТЬ", null) && !tt.get_morph_class_in_dictionary().is_adjective))) {
                t1 = (t = tt);
                if (tt.previous.is_value("НЕ", null)) 
                    not = true;
                continue;
            }
            let www = NumbersWithUnitToken._try_parsewhl(tt);
            if (www !== null) {
                whd = www;
                t1 = (t = (tt = www.end_token));
                continue;
            }
            if (tt.is_value("ПРИ", null)) {
                let mt1 = MeasureToken.try_parse(tt.next, add_units, false, false, true, false);
                if (mt1 !== null) {
                    _internals.push(mt1);
                    t1 = (t = (tt = mt1.end_token));
                    continue;
                }
                let n1 = NumbersWithUnitToken.try_parse(tt.next, add_units, false, false, false, false);
                if (n1 !== null && n1.units.length > 0) {
                    mt1 = MeasureToken._new1606(n1.begin_token, n1.end_token, n1);
                    _internals.push(mt1);
                    t1 = (t = (tt = mt1.end_token));
                    continue;
                }
            }
            if (tt.is_value("ПО", null) && tt.next !== null && tt.next.is_value("U", null)) {
                t1 = (t = (tt = tt.next));
                continue;
            }
            if (_internals.length > 0) {
                if (tt.is_char(':')) 
                    break;
                let mt1 = MeasureToken.try_parse(tt.next, add_units, false, false, true, false);
                if (mt1 !== null && mt1.reliable) {
                    _internals.push(mt1);
                    t1 = (t = (tt = mt1.end_token));
                    continue;
                }
            }
            if ((tt instanceof NumberToken) && (tt).typ === NumberSpellingType.WORDS) {
                let npt3 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.PARSENUMERICASADJECTIVE, 0, null);
                if (npt3 !== null) {
                    t1 = (tt = npt3.end_token);
                    if (_internals.length === 0) 
                        _name.end_token = t1;
                    continue;
                }
            }
            if (((tt.is_hiphen && !tt.is_whitespace_before && !tt.is_whitespace_after) && (tt.next instanceof NumberToken) && (tt.previous instanceof TextToken)) && tt.previous.chars.is_all_upper) {
                t1 = (tt = (t = tt.next));
                if (_internals.length === 0) 
                    _name.end_token = t1;
                continue;
            }
            if (((tt instanceof NumberToken) && !tt.is_whitespace_before && (tt.previous instanceof TextToken)) && tt.previous.chars.is_all_upper) {
                t1 = (t = tt);
                if (_internals.length === 0) 
                    _name.end_token = t1;
                continue;
            }
            if ((((tt instanceof NumberToken) && !tt.is_whitespace_after && tt.next.is_hiphen) && !tt.next.is_whitespace_after && (tt.next.next instanceof TextToken)) && tt.next.next.length_char > 2) {
                t1 = (t = (tt = tt.next.next));
                let npt1 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                if (npt1 !== null && npt1.end_char > tt.end_char) 
                    t1 = (t = (tt = npt1.end_token));
                if (_internals.length === 0) 
                    _name.end_token = t1;
                continue;
            }
            if ((tt instanceof NumberToken) && tt.previous !== null) {
                if (tt.previous.is_value("USB", null)) {
                    t1 = (t = tt);
                    if (_internals.length === 0) 
                        _name.end_token = t1;
                    for (let ttt = tt.next; ttt !== null; ttt = ttt.next) {
                        if (ttt.is_whitespace_before) 
                            break;
                        if (ttt.is_char_of(",:")) 
                            break;
                        t1 = (t = (tt = ttt));
                        if (_internals.length === 0) 
                            _name.end_token = t1;
                    }
                    continue;
                }
            }
            let mt0 = NumbersWithUnitToken.try_parse(tt, add_units, false, false, false, false);
            if (mt0 !== null) {
                let npt1 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value()) | (NounPhraseParseAttr.PARSEPREPOSITION.value())), 0, null);
                if (npt1 !== null && npt1.end_char > mt0.end_char) {
                    t1 = (t = (tt = npt1.end_token));
                    if (_internals.length === 0) 
                        _name.end_token = t1;
                    continue;
                }
                break;
            }
            if (((tt.is_comma || tt.is_char('('))) && tt.next !== null) {
                www = NumbersWithUnitToken._try_parsewhl(tt.next);
                if (www !== null) {
                    whd = www;
                    t1 = (t = (tt = www.end_token));
                    if (tt.next !== null && tt.next.is_comma) 
                        t1 = (tt = tt.next);
                    if (tt.next !== null && tt.next.is_char(')')) {
                        t1 = (tt = tt.next);
                        continue;
                    }
                }
                let uu = UnitToken.try_parse_list(tt.next, add_units, false);
                if (uu !== null) {
                    t1 = (t = uu[uu.length - 1].end_token);
                    units = uu;
                    if (tt.is_char('(') && t1.next !== null && t1.next.is_char(')')) {
                        t1 = (t = (tt = t1.next));
                        continue;
                    }
                    else if (t1.next !== null && t1.next.is_char('(')) {
                        uu = UnitToken.try_parse_list(t1.next.next, add_units, false);
                        if (uu !== null && uu[uu.length - 1].end_token.next !== null && uu[uu.length - 1].end_token.next.is_char(')')) {
                            units2 = uu;
                            t1 = (t = (tt = uu[uu.length - 1].end_token.next));
                            continue;
                        }
                        www = NumbersWithUnitToken._try_parsewhl(t1.next);
                        if (www !== null) {
                            whd = www;
                            t1 = (t = (tt = www.end_token));
                            continue;
                        }
                    }
                    if (uu !== null && uu.length > 0 && !uu[0].is_doubt) 
                        break;
                    if (t1.next !== null) {
                        if (t1.next.is_table_control_char || t1.is_newline_after) 
                            break;
                    }
                    units = null;
                }
            }
            if (BracketHelper.can_be_start_of_sequence(tt, false, false) && !((tt.next instanceof NumberToken))) {
                let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                if (br !== null) {
                    t1 = (t = (tt = br.end_token));
                    continue;
                }
            }
            if (tt.is_value("НЕ", null) && tt.next !== null) {
                let mc = tt.next.get_morph_class_in_dictionary();
                if (mc.is_adverb || mc.is_misc) 
                    break;
                continue;
            }
            if (tt.is_value("ЯМЗ", null)) {
            }
            let npt2 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSEPREPOSITION.value()) | (NounPhraseParseAttr.IGNOREBRACKETS.value()) | (NounPhraseParseAttr.PARSEPRONOUNS.value())), 0, null);
            if (npt2 === null) {
                if (tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction) {
                    let to = NumbersWithUnitToken.m_termins.try_parse(tt, TerminParseAttr.NO);
                    if (to !== null) {
                        if ((to.end_token.next instanceof TextToken) && to.end_token.next.is_letters) {
                        }
                        else 
                            break;
                    }
                    t1 = tt;
                    continue;
                }
                let mc = tt.get_morph_class_in_dictionary();
                if (((tt instanceof TextToken) && tt.chars.is_letter && tt.length_char > 1) && (((tt.chars.is_all_upper || mc.is_adverb || mc.is_undefined) || mc.is_adjective))) {
                    let uu = UnitToken.try_parse_list(tt, add_units, false);
                    if (uu !== null) {
                        if (uu[0].length_char > 1 || uu.length > 1) {
                            units = uu;
                            t1 = (t = uu[uu.length - 1].end_token);
                            break;
                        }
                    }
                    t1 = (t = tt);
                    if (_internals.length === 0) 
                        _name.end_token = tt;
                    continue;
                }
                if (tt.is_comma) 
                    continue;
                if (tt.is_char('.')) {
                    if (!MiscHelper.can_be_start_of_sentence(tt.next)) 
                        continue;
                    let uu = UnitToken.try_parse_list(tt.next, add_units, false);
                    if (uu !== null) {
                        if (uu[0].length_char > 2 || uu.length > 1) {
                            units = uu;
                            t1 = (t = uu[uu.length - 1].end_token);
                            break;
                        }
                    }
                }
                break;
            }
            t1 = (t = (tt = npt2.end_token));
            if (_internals.length > 0) {
            }
            else if (t.is_value("ПРЕДЕЛ", null) || t.is_value("ГРАНИЦА", null) || t.is_value("ДИАПАЗОН", null)) {
            }
            else if (t.chars.is_letter) 
                _name.end_token = t1;
        }
        let t11 = t1;
        for (t1 = t1.next; t1 !== null; t1 = t1.next) {
            if (t1.is_table_control_char) {
            }
            else if (t1.is_char_of(":,_")) {
                if (is_resctriction) 
                    return null;
                let www = NumbersWithUnitToken._try_parsewhl(t1.next);
                if (www !== null) {
                    whd = www;
                    t1 = (t = www.end_token);
                    continue;
                }
                let uu = UnitToken.try_parse_list(t1.next, add_units, false);
                if (uu !== null) {
                    if (uu[0].length_char > 1 || uu.length > 1) {
                        units = uu;
                        t1 = (t = uu[uu.length - 1].end_token);
                        continue;
                    }
                }
                if (t1.is_char(':')) {
                    let li = new Array();
                    for (let ttt = t1.next; ttt !== null; ttt = ttt.next) {
                        if (ttt.is_hiphen || ttt.is_table_control_char) 
                            continue;
                        if ((ttt instanceof TextToken) && !ttt.chars.is_letter) 
                            continue;
                        let mt1 = MeasureToken.try_parse(ttt, add_units, true, true, false, true);
                        if (mt1 === null) 
                            break;
                        li.push(mt1);
                        ttt = mt1.end_token;
                        if (ttt.next !== null && ttt.next.is_char(';')) 
                            ttt = ttt.next;
                        if (ttt.is_char(';')) {
                        }
                        else if (ttt.is_newline_after && mt1.is_newline_before) {
                        }
                        else 
                            break;
                    }
                    if (li.length > 1) {
                        let res0 = MeasureToken._new1612(t0, li[li.length - 1].end_token, li, true);
                        if (_internals !== null && _internals.length > 0) 
                            res0.internal_ex = _internals[0];
                        let nam = MiscHelper.get_text_value_of_meta_token(_name, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                        li[0].begin_token = t0;
                        for (const v of li) {
                            v.name = (nam + " (" + ((v.name != null ? v.name : "")) + ")").trim();
                            if (v.nums !== null && v.nums.units.length === 0 && units !== null) 
                                v.nums.units = units;
                        }
                        return res0;
                    }
                }
            }
            else if (t1.is_hiphen && t1.is_whitespace_after && t1.is_whitespace_before) {
            }
            else if (t1.is_hiphen && t1.next !== null && t1.next.is_char('(')) {
            }
            else 
                break;
        }
        if (t1 === null) 
            return null;
        let mts = NumbersWithUnitToken.try_parse_multi(t1, add_units, false, not, true, is_resctriction);
        if (mts === null) {
            if (units !== null && units.length > 0) {
                if (t1 === null || t1.previous.is_char(':')) {
                    mts = new Array();
                    if (t1 === null) {
                        for (t1 = t11; t1 !== null && t1.next !== null; t1 = t1.next) {
                        }
                    }
                    else 
                        t1 = t1.previous;
                    mts.push(NumbersWithUnitToken._new1613(t0, t1, Number.NaN));
                }
            }
            if (mts === null) 
                return null;
        }
        let mt = mts[0];
        if (mt.begin_token === mt.end_token && !((mt.begin_token instanceof NumberToken))) 
            return null;
        if (!is_subval && _name.begin_token.morph.class0.is_preposition) 
            _name.begin_token = _name.begin_token.next;
        if (mt.whl !== null) 
            whd = mt.whl;
        for (let kk = 0; kk < 10; kk++) {
            if (whd !== null && whd.end_token === _name.end_token) {
                _name.end_token = whd.begin_token.previous;
                continue;
            }
            if (units !== null) {
                if (units[units.length - 1].end_token === _name.end_token) {
                    _name.end_token = units[0].begin_token.previous;
                    continue;
                }
            }
            break;
        }
        if (mts.length > 1 && _internals.length === 0) {
            if (mt.units.length === 0) {
                if (units !== null) {
                    for (const m of mts) {
                        m.units = units;
                    }
                }
            }
            let res1 = MeasureToken._new1614(t0, mts[mts.length - 1].end_token, _name.morph, true);
            res1.name = MiscHelper.get_text_value_of_meta_token(_name, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
            for (let k = 0; k < mts.length; k++) {
                let ttt = MeasureToken._new1606(mts[k].begin_token, mts[k].end_token, mts[k]);
                if (whd !== null) {
                    let nams = Utils.as(whd.tag, Array);
                    if (k < nams.length) 
                        ttt.name = nams[k];
                }
                res1.internals.push(ttt);
            }
            let tt1 = res1.end_token.next;
            if (tt1 !== null && tt1.is_char('±')) {
                let nn = NumbersWithUnitToken._try_parse(tt1, add_units, true, false, false);
                if (nn !== null && nn.plus_minus_percent) {
                    res1.end_token = nn.end_token;
                    res1.nums = nn;
                    if (nn.units.length > 0 && units === null && mt.units.length === 0) {
                        for (const m of mts) {
                            m.units = nn.units;
                        }
                    }
                }
            }
            return res1;
        }
        if (!mt.is_whitespace_before) {
            if (mt.begin_token.previous === null) 
                return null;
            if (mt.begin_token.previous.is_char_of(":),") || mt.begin_token.previous.is_table_control_char || mt.begin_token.previous.is_value("IP", null)) {
            }
            else if (mt.begin_token.is_hiphen && mt.units.length > 0 && !mt.units[0].is_doubt) {
            }
            else 
                return null;
        }
        if (mt.units.length === 0 && units !== null) {
            mt.units = units;
            if (mt.div_num !== null && units.length > 1 && mt.div_num.units.length === 0) {
                for (let i = 1; i < units.length; i++) {
                    if (units[i].pow === -1) {
                        for (let j = i; j < units.length; j++) {
                            mt.div_num.units.push(units[j]);
                            units[j].pow = -units[j].pow;
                        }
                        mt.units.splice(i, units.length - i);
                        break;
                    }
                }
            }
        }
        if ((minmax < 0) && mt.single_val !== null) {
            mt.from_val = mt.single_val;
            mt.from_include = true;
            mt.single_val = null;
        }
        if (minmax > 0 && mt.single_val !== null) {
            mt.to_val = mt.single_val;
            mt.to_include = true;
            mt.single_val = null;
        }
        if (mt.units.length === 0) {
            units = UnitToken.try_parse_list(mt.end_token.next, add_units, true);
            if (units === null) {
                if (can_units_absent) {
                }
                else 
                    return null;
            }
            else 
                mt.units = units;
        }
        let res = MeasureToken._new1616(t0, mt.end_token, _name.morph, _internals);
        if (((!t0.is_whitespace_before && t0.previous !== null && t0 === _name.begin_token) && t0.previous.is_hiphen && !t0.previous.is_whitespace_before) && (t0.previous.previous instanceof TextToken)) 
            _name.begin_token = res.begin_token = _name.begin_token.previous.previous;
        res.name = MiscHelper.get_text_value_of_meta_token(_name, (!is_subval ? GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE : GetTextAttr.NO));
        res.nums = mt;
        for (const u of res.nums.units) {
            if (u.keyword !== null) {
                if (u.keyword.begin_char >= res.begin_char) 
                    res.reliable = true;
            }
        }
        res._parse_internals(add_units);
        if (res.internals.length > 0 || !can_be_set) 
            return res;
        t1 = res.end_token.next;
        if (t1 !== null && t1.is_comma_and) 
            t1 = t1.next;
        let mts1 = NumbersWithUnitToken.try_parse_multi(t1, add_units, false, false, false, false);
        if ((mts1 !== null && mts1.length === 1 && (t1.whitespaces_before_count < 3)) && mts1[0].units.length > 0 && !UnitToken.can_be_equals(mts[0].units, mts1[0].units)) {
            res.is_set = true;
            res.nums = null;
            res.internals.push(MeasureToken._new1606(mt.begin_token, mt.end_token, mt));
            res.internals.push(MeasureToken._new1606(mts1[0].begin_token, mts1[0].end_token, mts1[0]));
            res.end_token = mts1[0].end_token;
        }
        return res;
    }
    
    static _new1606(_arg1, _arg2, _arg3) {
        let res = new MeasureToken(_arg1, _arg2);
        res.nums = _arg3;
        return res;
    }
    
    static _new1612(_arg1, _arg2, _arg3, _arg4) {
        let res = new MeasureToken(_arg1, _arg2);
        res.internals = _arg3;
        res.is_empty = _arg4;
        return res;
    }
    
    static _new1614(_arg1, _arg2, _arg3, _arg4) {
        let res = new MeasureToken(_arg1, _arg2);
        res.morph = _arg3;
        res.reliable = _arg4;
        return res;
    }
    
    static _new1616(_arg1, _arg2, _arg3, _arg4) {
        let res = new MeasureToken(_arg1, _arg2);
        res.morph = _arg3;
        res.internals = _arg4;
        return res;
    }
}


module.exports = MeasureToken