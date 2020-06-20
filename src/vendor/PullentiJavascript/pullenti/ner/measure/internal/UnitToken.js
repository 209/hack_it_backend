/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const Token = require("./../../Token");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const MetaToken = require("./../../MetaToken");
const MeasureReferent = require("./../MeasureReferent");
const NumberSpellingType = require("./../../NumberSpellingType");
const NumberToken = require("./../../NumberToken");
const MiscHelper = require("./../../core/MiscHelper");
const UnitsFactors = require("./UnitsFactors");
const Referent = require("./../../Referent");
const MorphGender = require("./../../../morph/MorphGender");
const MeasureKind = require("./../MeasureKind");
const UnitReferent = require("./../UnitReferent");
const Unit = require("./Unit");
const TextToken = require("./../../TextToken");
const UnitsHelper = require("./UnitsHelper");
const MeasureHelper = require("./MeasureHelper");
const NumberHelper = require("./../../core/NumberHelper");

class UnitToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.unit = null;
        this.pow = 1;
        this.is_doubt = false;
        this.keyword = null;
        this.ext_onto = null;
        this.unknown_name = null;
    }
    
    toString() {
        let res = (this.unknown_name != null ? this.unknown_name : (((this.ext_onto === null ? this.unit.toString() : this.ext_onto.toString()))));
        if (this.pow !== 1) 
            res = (res + "<" + this.pow + ">");
        if (this.is_doubt) 
            res += "?";
        if (this.keyword !== null) 
            res = (res + " (<-" + this.keyword.get_normal_case_text(null, false, MorphGender.UNDEFINED, false) + ")");
        return res;
    }
    
    static can_be_equals(ut1, ut2) {
        if (ut1.length !== ut2.length) 
            return false;
        for (let i = 0; i < ut1.length; i++) {
            if (ut1[i].unit !== ut2[i].unit || ut1[i].ext_onto !== ut2[i].ext_onto) 
                return false;
            if (ut1[i].pow !== ut2[i].pow) 
                return false;
        }
        return true;
    }
    
    static calc_kind(units) {
        if (units === null || units.length === 0) 
            return MeasureKind.UNDEFINED;
        let u0 = units[0];
        if (u0.unit === null) 
            return MeasureKind.UNDEFINED;
        if (units.length === 1) {
            if (u0.pow === 1) 
                return u0.unit.kind;
            if (u0.pow === 2) {
                if (u0.unit.kind === MeasureKind.LENGTH) 
                    return MeasureKind.AREA;
            }
            if (u0.pow === 3) {
                if (u0.unit.kind === MeasureKind.LENGTH) 
                    return MeasureKind.VOLUME;
            }
            return MeasureKind.UNDEFINED;
        }
        if (units.length === 2) {
            if (units[1].unit === null) 
                return MeasureKind.UNDEFINED;
            if ((u0.unit.kind === MeasureKind.LENGTH && u0.pow === 1 && units[1].unit.kind === MeasureKind.TIME) && units[1].pow === -1) 
                return MeasureKind.SPEED;
        }
        return MeasureKind.UNDEFINED;
    }
    
    static _create_referent(u) {
        let ur = new UnitReferent();
        ur.add_slot(UnitReferent.ATTR_NAME, u.name_cyr, false, 0);
        ur.add_slot(UnitReferent.ATTR_NAME, u.name_lat, false, 0);
        ur.add_slot(UnitReferent.ATTR_FULLNAME, u.fullname_cyr, false, 0);
        ur.add_slot(UnitReferent.ATTR_FULLNAME, u.fullname_lat, false, 0);
        ur.tag = u;
        ur.m_unit = u;
        return ur;
    }
    
    create_referent_with_register(ad) {
        let ur = this.ext_onto;
        if (this.unit !== null) 
            ur = UnitToken._create_referent(this.unit);
        else if (this.unknown_name !== null) {
            ur = new UnitReferent();
            ur.add_slot(UnitReferent.ATTR_NAME, this.unknown_name, false, 0);
            ur.is_unknown = true;
        }
        if (this.pow !== 1) 
            ur.add_slot(UnitReferent.ATTR_POW, this.pow.toString(), false, 0);
        let owns = new Array();
        owns.push(ur);
        if (this.unit !== null) {
            for (let uu = this.unit.base_unit; uu !== null; uu = uu.base_unit) {
                let ur0 = UnitToken._create_referent(uu);
                owns.push(ur0);
            }
        }
        for (let i = owns.length - 1; i >= 0; i--) {
            if (ad !== null) 
                owns[i] = Utils.as(ad.register_referent(owns[i]), UnitReferent);
            if (i > 0) {
                owns[i - 1].add_slot(UnitReferent.ATTR_BASEUNIT, owns[i], false, 0);
                if ((owns[i - 1].tag).base_multiplier !== 0) 
                    owns[i - 1].add_slot(UnitReferent.ATTR_BASEFACTOR, NumberHelper.double_to_string((owns[i - 1].tag).base_multiplier), false, 0);
            }
        }
        return owns[0];
    }
    
    static try_parse_list(t, add_units, parse_unknown_units = false) {
        let ut = UnitToken.try_parse(t, add_units, null, parse_unknown_units);
        if (ut === null) 
            return null;
        let res = new Array();
        res.push(ut);
        for (let tt = ut.end_token.next; tt !== null; tt = tt.next) {
            ut = UnitToken.try_parse(tt, add_units, res[res.length - 1], true);
            if (ut === null) 
                break;
            if (ut.unit !== null && ut.unit.kind !== MeasureKind.UNDEFINED) {
                if (res[res.length - 1].unit !== null && res[res.length - 1].unit.kind === ut.unit.kind) 
                    break;
            }
            res.push(ut);
            tt = ut.end_token;
            if (res.length > 2) 
                break;
        }
        for (let i = 0; i < res.length; i++) {
            if (res[i].unit !== null && res[i].unit.base_unit !== null && res[i].unit.mult_unit !== null) {
                let ut2 = new UnitToken(res[i].begin_token, res[i].end_token);
                ut2.unit = res[i].unit.mult_unit;
                res.splice(i + 1, 0, ut2);
                res[i].unit = res[i].unit.base_unit;
            }
        }
        if (res.length > 1) {
            for (const r of res) {
                r.is_doubt = false;
            }
        }
        return res;
    }
    
    static try_parse(t, add_units, prev, parse_unknown_units = false) {
        if (t === null) 
            return null;
        let t0 = t;
        let _pow = 1;
        let is_neg = false;
        if ((t.is_char_of("\\/") || t.is_value("НА", null) || t.is_value("OF", null)) || t.is_value("PER", null)) {
            is_neg = true;
            t = t.next;
        }
        else if (t.is_value("В", null) && prev !== null) {
            is_neg = true;
            t = t.next;
        }
        else if (MeasureHelper.is_mult_char(t)) 
            t = t.next;
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return null;
        if (tt.term === "КВ" || tt.term === "КВАДР" || tt.is_value("КВАДРАТНЫЙ", null)) {
            _pow = 2;
            tt = Utils.as(tt.next, TextToken);
            if (tt !== null && tt.is_char('.')) 
                tt = Utils.as(tt.next, TextToken);
            if (tt === null) 
                return null;
        }
        else if (tt.term === "КУБ" || tt.term === "КУБИЧ" || tt.is_value("КУБИЧЕСКИЙ", null)) {
            _pow = 3;
            tt = Utils.as(tt.next, TextToken);
            if (tt !== null && tt.is_char('.')) 
                tt = Utils.as(tt.next, TextToken);
            if (tt === null) 
                return null;
        }
        else if (tt.term === "µ") {
            let res = UnitToken.try_parse(tt.next, add_units, prev, false);
            if (res !== null) {
                for (const u of UnitsHelper.UNITS) {
                    if (u.factor === UnitsFactors.MICRO && Utils.compareStrings("мк" + u.name_cyr, res.unit.name_cyr, true) === 0) {
                        res.unit = u;
                        res.begin_token = tt;
                        res.pow = _pow;
                        if (is_neg) 
                            res.pow = -_pow;
                        return res;
                    }
                }
            }
        }
        let toks = UnitsHelper.TERMINS.try_parse_all(tt, TerminParseAttr.NO, 0);
        if (toks !== null) {
            if ((prev !== null && tt === t0 && toks.length === 1) && t.is_whitespace_before) 
                return null;
            if (toks[0].begin_token === toks[0].end_token && tt.morph.class0.is_preposition && (tt.whitespaces_after_count < 3)) {
                if (NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.PARSEPREPOSITION, 0, null) !== null) 
                    return null;
                if (tt.next instanceof NumberToken) {
                    if ((tt.next).typ !== NumberSpellingType.DIGIT) 
                        return null;
                }
                let nex = UnitToken.try_parse(tt.next, add_units, null, false);
                if (nex !== null) 
                    return null;
            }
            if (toks[0].begin_token === toks[0].end_token && ((toks[0].begin_token.is_value("М", null) || toks[0].begin_token.is_value("M", null))) && toks[0].begin_token.chars.is_all_lower) {
                if (prev !== null && prev.unit !== null && prev.unit.kind === MeasureKind.LENGTH) {
                    let res = UnitToken._new1620(t0, toks[0].end_token, UnitsHelper.UMINUTE);
                    res.pow = _pow;
                    if (is_neg) 
                        res.pow = -_pow;
                    return res;
                }
            }
            let uts = new Array();
            for (const tok of toks) {
                let res = UnitToken._new1620(t0, tok.end_token, Utils.as(tok.termin.tag, Unit));
                res.pow = _pow;
                if (is_neg) 
                    res.pow = -_pow;
                if (res.unit.base_multiplier === 1000000 && (t0 instanceof TextToken) && Utils.isLowerCase((t0).get_source_text()[0])) {
                    for (const u of UnitsHelper.UNITS) {
                        if (u.factor === UnitsFactors.MILLI && Utils.compareStrings(u.name_cyr, res.unit.name_cyr, true) === 0) {
                            res.unit = u;
                            break;
                        }
                    }
                }
                res._correct();
                res._check_doubt();
                uts.push(res);
            }
            let max = 0;
            let best = null;
            for (const ut of uts) {
                if (ut.keyword !== null) {
                    if (ut.keyword.begin_char >= max) {
                        max = ut.keyword.begin_char;
                        best = ut;
                    }
                }
            }
            if (best !== null) 
                return best;
            for (const ut of uts) {
                if (!ut.is_doubt) 
                    return ut;
            }
            return uts[0];
        }
        let t1 = null;
        if (t.is_char_of("º°")) 
            t1 = t;
        else if ((t.is_char('<') && t.next !== null && t.next.next !== null) && t.next.next.is_char('>') && ((t.next.is_value("О", null) || t.next.is_value("O", null) || (((t.next instanceof NumberToken) && (t.next).value === "0"))))) 
            t1 = t.next.next;
        if (t1 !== null) {
            let res = UnitToken._new1620(t0, t1, UnitsHelper.UGRADUS);
            res._check_doubt();
            t = t1.next;
            if (t !== null && t.is_comma) 
                t = t.next;
            if (t !== null && t.is_value("ПО", null)) 
                t = t.next;
            if (t instanceof TextToken) {
                let vv = (t).term;
                if (vv === "C" || vv === "С" || vv.startsWith("ЦЕЛЬС")) {
                    res.unit = UnitsHelper.UGRADUSC;
                    res.is_doubt = false;
                    res.end_token = t;
                }
                if (vv === "F" || vv.startsWith("ФАР")) {
                    res.unit = UnitsHelper.UGRADUSF;
                    res.is_doubt = false;
                    res.end_token = t;
                }
            }
            return res;
        }
        if ((t instanceof TextToken) && ((t.is_value("ОС", null) || t.is_value("OC", null)))) {
            let str = t.get_source_text();
            if (str === "оС" || str === "oC") {
                let res = UnitToken._new1732(t, t, UnitsHelper.UGRADUSC, false);
                return res;
            }
        }
        if (t.is_char('%')) {
            let tt1 = t.next;
            if (tt1 !== null && tt1.is_char('(')) 
                tt1 = tt1.next;
            if ((tt1 instanceof TextToken) && (tt1).term.startsWith("ОБ")) {
                let re = UnitToken._new1620(t, tt1, UnitsHelper.UALCO);
                if (re.end_token.next !== null && re.end_token.next.is_char('.')) 
                    re.end_token = re.end_token.next;
                if (re.end_token.next !== null && re.end_token.next.is_char(')') && t.next.is_char('(')) 
                    re.end_token = re.end_token.next;
                return re;
            }
            return UnitToken._new1620(t, t, UnitsHelper.UPERCENT);
        }
        if (add_units !== null) {
            let tok = add_units.try_parse(t, TerminParseAttr.NO);
            if (tok !== null) {
                let res = UnitToken._new1735(t0, tok.end_token, Utils.as(tok.termin.tag, UnitReferent));
                if (tok.end_token.next !== null && tok.end_token.next.is_char('.')) 
                    tok.end_token = tok.end_token.next;
                res.pow = _pow;
                if (is_neg) 
                    res.pow = -_pow;
                res._correct();
                return res;
            }
        }
        if (!parse_unknown_units) 
            return null;
        if ((t.whitespaces_before_count > 2 || !t.chars.is_letter || t.length_char > 5) || !((t instanceof TextToken))) 
            return null;
        if (MiscHelper.can_be_start_of_sentence(t)) 
            return null;
        t1 = t;
        if (t.next !== null && t.next.is_char('.')) 
            t1 = t;
        let ok = false;
        if (t1.next === null || t1.whitespaces_after_count > 2) 
            ok = true;
        else if (t1.next.is_comma || t1.next.is_char_of("\\/") || t1.next.is_table_control_char) 
            ok = true;
        else if (MeasureHelper.is_mult_char(t1.next)) 
            ok = true;
        if (!ok) 
            return null;
        let mc = t.get_morph_class_in_dictionary();
        if (mc.is_undefined) {
        }
        else if (t.length_char > 7) 
            return null;
        let res1 = UnitToken._new1736(t0, t1, _pow, true);
        res1.unknown_name = (t).get_source_text();
        res1._correct();
        return res1;
    }
    
    _correct() {
        let t = this.end_token.next;
        if (t === null) 
            return;
        let num = 0;
        let neg = this.pow < 0;
        if (t.is_char('³')) 
            num = 3;
        else if (t.is_char('²')) 
            num = 2;
        else if (!t.is_whitespace_before && (t instanceof NumberToken) && (((t).value === "3" || (t).value === "2"))) 
            num = (t).int_value;
        else if ((t.is_char('<') && (t.next instanceof NumberToken) && (t.next).int_value !== null) && t.next.next !== null && t.next.next.is_char('>')) {
            num = (t.next).int_value;
            t = t.next.next;
        }
        else if (((t.is_char('<') && t.next !== null && t.next.is_hiphen) && (t.next.next instanceof NumberToken) && (t.next.next).int_value !== null) && t.next.next.next !== null && t.next.next.next.is_char('>')) {
            num = (t.next.next).int_value;
            neg = true;
            t = t.next.next.next;
        }
        else {
            if (t.is_value("B", null) && t.next !== null) 
                t = t.next;
            if ((t.is_value("КВ", null) || t.is_value("КВАДР", null) || t.is_value("КВАДРАТНЫЙ", null)) || t.is_value("КВАДРАТ", null)) {
                num = 2;
                if (t.next !== null && t.next.is_char('.')) 
                    t = t.next;
            }
            else if (t.is_value("КУБ", null) || t.is_value("КУБИЧ", null) || t.is_value("КУБИЧЕСКИЙ", null)) {
                num = 3;
                if (t.next !== null && t.next.is_char('.')) 
                    t = t.next;
            }
        }
        if (num !== 0) {
            this.pow = num;
            if (neg) 
                this.pow = -num;
            this.end_token = t;
        }
        t = this.end_token.next;
        if ((t !== null && t.is_value("ПО", null) && t.next !== null) && t.next.is_value("U", null)) 
            this.end_token = t.next;
    }
    
    _check_doubt() {
        this.is_doubt = false;
        if (this.pow !== 1) 
            return;
        if (this.begin_token.length_char < 3) {
            this.is_doubt = true;
            if ((this.begin_token.chars.is_capital_upper || this.begin_token.chars.is_all_upper || this.begin_token.chars.is_last_lower) || this.begin_token.chars.is_all_lower) {
            }
            else if (this.unit.psevdo.length > 0) {
            }
            else 
                this.is_doubt = false;
        }
        let cou = 0;
        for (let t = this.begin_token.previous; t !== null && (cou < 30); t = t.previous,cou++) {
            let mr = Utils.as(t.get_referent(), MeasureReferent);
            if (mr !== null) {
                for (const s of mr.slots) {
                    if (s.value instanceof UnitReferent) {
                        let ur = Utils.as(s.value, UnitReferent);
                        for (let u = this.unit; u !== null; u = u.base_unit) {
                            if (ur.find_slot(UnitReferent.ATTR_NAME, u.name_cyr, true) !== null) 
                                this.is_doubt = false;
                            else if (this.unit.psevdo.length > 0) {
                                for (const uu of this.unit.psevdo) {
                                    if (ur.find_slot(UnitReferent.ATTR_NAME, uu.name_cyr, true) !== null) {
                                        this.unit = uu;
                                        this.is_doubt = false;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!((t instanceof TextToken)) || (t.length_char < 3)) 
                continue;
            for (let u = this.unit; u !== null; u = u.base_unit) {
                for (const k of u.keywords) {
                    if (t.is_value(k, null)) {
                        this.keyword = t;
                        this.is_doubt = false;
                        return;
                    }
                }
                for (const uu of u.psevdo) {
                    for (const k of uu.keywords) {
                        if (t.is_value(k, null)) {
                            this.unit = uu;
                            this.keyword = t;
                            this.is_doubt = false;
                            return;
                        }
                    }
                }
            }
        }
    }
    
    static out_units(units) {
        if (units === null || units.length === 0) 
            return null;
        let res = new StringBuilder();
        res.append(units[0].unit.name_cyr);
        if (units[0].pow !== 1) 
            res.append("<").append(units[0].pow).append(">");
        for (let i = 1; i < units.length; i++) {
            let mnem = units[i].unit.name_cyr;
            let _pow = units[i].pow;
            if (_pow < 0) {
                res.append("/").append(mnem);
                if (_pow !== -1) 
                    res.append("<").append((-_pow)).append(">");
            }
            else {
                res.append("*").append(mnem);
                if (_pow > 1) 
                    res.append("<").append(_pow).append(">");
            }
        }
        return res.toString();
    }
    
    static _new1620(_arg1, _arg2, _arg3) {
        let res = new UnitToken(_arg1, _arg2);
        res.unit = _arg3;
        return res;
    }
    
    static _new1732(_arg1, _arg2, _arg3, _arg4) {
        let res = new UnitToken(_arg1, _arg2);
        res.unit = _arg3;
        res.is_doubt = _arg4;
        return res;
    }
    
    static _new1735(_arg1, _arg2, _arg3) {
        let res = new UnitToken(_arg1, _arg2);
        res.ext_onto = _arg3;
        return res;
    }
    
    static _new1736(_arg1, _arg2, _arg3, _arg4) {
        let res = new UnitToken(_arg1, _arg2);
        res.pow = _arg3;
        res.is_doubt = _arg4;
        return res;
    }
}


module.exports = UnitToken