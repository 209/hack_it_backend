/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const MorphGender = require("./../../../morph/MorphGender");
const MorphClass = require("./../../../morph/MorphClass");
const NumberHelper = require("./../../core/NumberHelper");
const NumbersWithUnitTokenDiapTyp = require("./NumbersWithUnitTokenDiapTyp");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const MetaToken = require("./../../MetaToken");
const TerminCollection = require("./../../core/TerminCollection");
const Termin = require("./../../core/Termin");
const MeasureKind = require("./../MeasureKind");
const Morphology = require("./../../../morph/Morphology");
const TextToken = require("./../../TextToken");
const MeasureHelper = require("./MeasureHelper");
const Referent = require("./../../Referent");
const ReferentToken = require("./../../ReferentToken");
const Unit = require("./Unit");
const UnitsHelper = require("./UnitsHelper");
const MeasureReferent = require("./../MeasureReferent");
const NumberToken = require("./../../NumberToken");
const UnitToken = require("./UnitToken");

/**
 * Это для моделирования разных числовых диапазонов + единицы изменерия
 */
class NumbersWithUnitToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.single_val = null;
        this.plus_minus = null;
        this.plus_minus_percent = false;
        this.from_include = false;
        this.from_val = null;
        this.to_include = false;
        this.to_val = null;
        this.about = false;
        this.not = false;
        this.whl = null;
        this.units = new Array();
        this.div_num = null;
        this.is_age = false;
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.single_val !== null) {
            if (this.plus_minus !== null) 
                res.append("[").append(this.single_val).append(" ±").append(this.plus_minus).append((this.plus_minus_percent ? "%" : "")).append("]");
            else 
                res.append(this.single_val);
        }
        else {
            if (this.from_val !== null) 
                res.append((this.from_include ? '[' : ']')).append(this.from_val);
            else 
                res.append("]");
            res.append(" .. ");
            if (this.to_val !== null) 
                res.append(this.to_val).append((this.to_include ? ']' : '['));
            else 
                res.append("[");
        }
        for (const u of this.units) {
            res.append(" ").append(u.toString());
        }
        if (this.div_num !== null) {
            res.append(" / ");
            res.append(this.div_num);
        }
        return res.toString();
    }
    
    create_refenets_tokens_with_register(ad, name, regist = true) {
        if (name === "T =") 
            name = "ТЕМПЕРАТУРА";
        let res = new Array();
        for (const u of this.units) {
            let rt = new ReferentToken(u.create_referent_with_register(ad), u.begin_token, u.end_token);
            res.push(rt);
        }
        let mr = new MeasureReferent();
        let templ = "1";
        if (this.single_val !== null) {
            mr.add_value(this.single_val);
            if (this.plus_minus !== null) {
                templ = ("[1 ±2" + (this.plus_minus_percent ? "%" : "") + "]");
                mr.add_value(this.plus_minus);
            }
            else if (this.about) 
                templ = "~1";
        }
        else {
            if (this.not && ((this.from_val === null || this.to_val === null))) {
                let b = this.from_include;
                this.from_include = this.to_include;
                this.to_include = b;
                let v = this.from_val;
                this.from_val = this.to_val;
                this.to_val = v;
            }
            let num = 1;
            if (this.from_val !== null) {
                mr.add_value(this.from_val);
                templ = (this.from_include ? "[1" : "]1");
                num++;
            }
            else 
                templ = "]";
            if (this.to_val !== null) {
                mr.add_value(this.to_val);
                templ = (templ + " .. " + num + (this.to_include ? ']' : '['));
            }
            else 
                templ += " .. [";
        }
        mr.template = templ;
        for (const rt of res) {
            mr.add_slot(MeasureReferent.ATTR_UNIT, rt.referent, false, 0);
        }
        if (name !== null) 
            mr.add_slot(MeasureReferent.ATTR_NAME, name, false, 0);
        if (this.div_num !== null) {
            let dn = this.div_num.create_refenets_tokens_with_register(ad, null, true);
            res.splice(res.length, 0, ...dn);
            mr.add_slot(MeasureReferent.ATTR_REF, dn[dn.length - 1].referent, false, 0);
        }
        let ki = UnitToken.calc_kind(this.units);
        if (ki !== MeasureKind.UNDEFINED) 
            mr.kind = ki;
        if (regist && ad !== null) 
            mr = Utils.as(ad.register_referent(mr), MeasureReferent);
        res.push(new ReferentToken(mr, this.begin_token, this.end_token));
        return res;
    }
    
    static try_parse_multi(t, add_units, can_omit_number = false, _not = false, can_be_non = false, is_resctriction = false) {
        if (t === null || (t instanceof ReferentToken)) 
            return null;
        let tt0 = t;
        if (tt0.is_char('(')) {
            let whd = NumbersWithUnitToken._try_parsewhl(tt0);
            if (whd !== null) 
                tt0 = whd.end_token;
            let res0 = NumbersWithUnitToken.try_parse_multi(tt0.next, add_units, false, can_omit_number, can_be_non, false);
            if (res0 !== null) {
                res0[0].whl = whd;
                let tt2 = res0[res0.length - 1].end_token.next;
                if (tt2 !== null && tt2.is_char_of(",")) 
                    tt2 = tt2.next;
                if (whd !== null) 
                    return res0;
                if (tt2 !== null && tt2.is_char(')')) {
                    res0[res0.length - 1].end_token = tt2;
                    return res0;
                }
            }
        }
        let mt = NumbersWithUnitToken.try_parse(t, add_units, can_omit_number, _not, can_be_non, is_resctriction);
        if (mt === null) 
            return null;
        let res = new Array();
        let nnn = null;
        if (mt.whitespaces_after_count < 2) {
            if (MeasureHelper.is_mult_char(mt.end_token.next)) 
                nnn = mt.end_token.next.next;
            else if ((mt.end_token instanceof NumberToken) && MeasureHelper.is_mult_char((mt.end_token).end_token)) 
                nnn = mt.end_token.next;
        }
        if (nnn !== null) {
            let mt2 = NumbersWithUnitToken.try_parse(nnn, add_units, _not, false, false, false);
            if (mt2 !== null) {
                let mt3 = null;
                nnn = null;
                if (mt2.whitespaces_after_count < 2) {
                    if (MeasureHelper.is_mult_char(mt2.end_token.next)) 
                        nnn = mt2.end_token.next.next;
                    else if ((mt2.end_token instanceof NumberToken) && MeasureHelper.is_mult_char((mt2.end_token).end_token)) 
                        nnn = mt2.end_token.next;
                }
                if (nnn !== null) 
                    mt3 = NumbersWithUnitToken.try_parse(nnn, add_units, false, false, false, false);
                if (mt3 === null) {
                    let tt2 = mt2.end_token.next;
                    if (tt2 !== null && !tt2.is_whitespace_before) {
                        if (!tt2.is_char_of(",.;")) 
                            return null;
                    }
                }
                if (mt3 !== null && mt3.units.length > 0) {
                    if (mt2.units.length === 0) 
                        mt2.units = mt3.units;
                }
                res.push(mt);
                if (mt2 !== null) {
                    if (mt2.units.length > 0 && mt.units.length === 0) 
                        mt.units = mt2.units;
                    res.push(mt2);
                    if (mt3 !== null) 
                        res.push(mt3);
                }
                return res;
            }
        }
        if ((!mt.is_whitespace_after && MeasureHelper.is_mult_char_end(mt.end_token.next) && (mt.end_token.next.next instanceof NumberToken)) && mt.units.length === 0) {
            let utxt = (mt.end_token.next).term;
            utxt = utxt.substring(0, 0 + utxt.length - 1);
            let terms = UnitsHelper.TERMINS.try_attach_str(utxt, null);
            if (terms !== null && terms.length > 0) {
                mt.units.push(UnitToken._new1620(mt.end_token.next, mt.end_token.next, Utils.as(terms[0].tag, Unit)));
                mt.end_token = mt.end_token.next;
                let res1 = NumbersWithUnitToken.try_parse_multi(mt.end_token.next, add_units, false, false, false, false);
                if (res1 !== null) {
                    res1.splice(0, 0, mt);
                    return res1;
                }
            }
        }
        res.push(mt);
        return res;
    }
    
    /**
     * Попробовать выделить с указанной позиции
     * @param t 
     * @return 
     */
    static try_parse(t, add_units, can_omit_number = false, _not = false, can_be_nan = false, is_resctriction = false) {
        if (t === null) 
            return null;
        let res = NumbersWithUnitToken._try_parse(t, add_units, is_resctriction, can_omit_number, can_be_nan);
        if (res !== null) 
            res.not = _not;
        return res;
    }
    
    static _is_min_or_max(t, res) {
        if (t === null) 
            return null;
        if (t.is_value("МИНИМАЛЬНЫЙ", null) || t.is_value("МИНИМУМ", null) || t.is_value("MINIMUM", null)) {
            res.value = -1;
            return t;
        }
        if (t.is_value("MIN", null) || t.is_value("МИН", null)) {
            res.value = -1;
            if (t.next !== null && t.next.is_char('.')) 
                t = t.next;
            return t;
        }
        if (t.is_value("МАКСИМАЛЬНЫЙ", null) || t.is_value("МАКСИМУМ", null) || t.is_value("MAXIMUM", null)) {
            res.value = 1;
            return t;
        }
        if (t.is_value("MAX", null) || t.is_value("МАКС", null) || t.is_value("МАХ", null)) {
            res.value = 1;
            if (t.next !== null && t.next.is_char('.')) 
                t = t.next;
            return t;
        }
        if (t.is_char('(')) {
            t = NumbersWithUnitToken._is_min_or_max(t.next, res);
            if (t !== null && t.next !== null && t.next.is_char(')')) 
                t = t.next;
            return t;
        }
        return null;
    }
    
    static _try_parse(t, add_units, second, can_omit_number, can_be_nan) {
        if (t === null) 
            return null;
        while (t !== null) {
            if (t.is_comma_and || t.is_value("НО", null)) 
                t = t.next;
            else 
                break;
        }
        let t0 = t;
        let _about = false;
        let has_keyw = false;
        let is_diap_keyw = false;
        let min_max = 0;
        let wrapmin_max1627 = new RefOutArgWrapper(min_max);
        let ttt = NumbersWithUnitToken._is_min_or_max(t, wrapmin_max1627);
        min_max = wrapmin_max1627.value;
        if (ttt !== null) {
            t = ttt.next;
            if (t === null) 
                return null;
        }
        if (t === null) 
            return null;
        if (t.is_char('~') || t.is_value("ОКОЛО", null) || t.is_value("ПРИМЕРНО", null)) {
            t = t.next;
            _about = true;
            has_keyw = true;
            if (t === null) 
                return null;
        }
        if (t.is_value("В", null) && t.next !== null) {
            if (t.next.is_value("ПРЕДЕЛ", null) || t.is_value("ДИАПАЗОН", null)) {
                t = t.next.next;
                if (t === null) 
                    return null;
                is_diap_keyw = true;
            }
        }
        if (t0.is_char('(')) {
            let mt0 = NumbersWithUnitToken._try_parse(t.next, add_units, false, false, false);
            if (mt0 !== null && mt0.end_token.next !== null && mt0.end_token.next.is_char(')')) {
                if (second) {
                    if (mt0.from_val !== null && mt0.to_val !== null && mt0.from_val === (-mt0.to_val)) {
                    }
                    else 
                        return null;
                }
                mt0.begin_token = t0;
                mt0.end_token = mt0.end_token.next;
                let uu = UnitToken.try_parse_list(mt0.end_token.next, add_units, false);
                if (uu !== null && mt0.units.length === 0) {
                    mt0.units = uu;
                    mt0.end_token = uu[uu.length - 1].end_token;
                }
                return mt0;
            }
        }
        let plusminus = false;
        let unit_before = false;
        let _is_age = false;
        let dty = NumbersWithUnitTokenDiapTyp.UNDEFINED;
        let whd = null;
        let uni = null;
        let tok = (NumbersWithUnitToken.m_termins === null ? null : NumbersWithUnitToken.m_termins.try_parse(t, TerminParseAttr.NO));
        if (tok !== null) {
            if (tok.end_token.is_value("СТАРШЕ", null) || tok.end_token.is_value("МЛАДШЕ", null)) 
                _is_age = true;
            t = tok.end_token.next;
            dty = NumbersWithUnitTokenDiapTyp.of(tok.termin.tag);
            has_keyw = true;
            if (!tok.is_whitespace_after) {
                if (t === null) 
                    return null;
                if (t instanceof NumberToken) {
                    if (tok.begin_token === tok.end_token && !tok.chars.is_all_lower) 
                        return null;
                }
                else if (t.is_comma && t.next !== null && t.next.is_value("ЧЕМ", null)) {
                    t = t.next.next;
                    if (t !== null && t.morph.class0.is_preposition) 
                        t = t.next;
                }
                else if (t.is_char_of(":,(") || t.is_table_control_char) {
                }
                else 
                    return null;
            }
            if (t !== null && t.is_char('(')) {
                uni = UnitToken.try_parse_list(t.next, add_units, false);
                if (uni !== null) {
                    t = uni[uni.length - 1].end_token.next;
                    while (t !== null) {
                        if (t.is_char_of("):")) 
                            t = t.next;
                        else 
                            break;
                    }
                    let mt0 = NumbersWithUnitToken._try_parse(t, add_units, false, can_omit_number, false);
                    if (mt0 !== null && mt0.units.length === 0) {
                        mt0.begin_token = t0;
                        mt0.units = uni;
                        return mt0;
                    }
                }
                whd = NumbersWithUnitToken._try_parsewhl(t);
                if (whd !== null) 
                    t = whd.end_token.next;
            }
            else if (t !== null && t.is_value("IP", null)) {
                uni = UnitToken.try_parse_list(t, add_units, false);
                if (uni !== null) 
                    t = uni[uni.length - 1].end_token.next;
            }
            if ((t !== null && t.is_hiphen && t.is_whitespace_before) && t.is_whitespace_after) 
                t = t.next;
        }
        else if (t.is_char('<')) {
            dty = NumbersWithUnitTokenDiapTyp.LS;
            t = t.next;
            has_keyw = true;
            if (t !== null && t.is_char('=')) {
                t = t.next;
                dty = NumbersWithUnitTokenDiapTyp.LE;
            }
        }
        else if (t.is_char('>')) {
            dty = NumbersWithUnitTokenDiapTyp.GT;
            t = t.next;
            has_keyw = true;
            if (t !== null && t.is_char('=')) {
                t = t.next;
                dty = NumbersWithUnitTokenDiapTyp.GE;
            }
        }
        else if (t.is_char('≤')) {
            dty = NumbersWithUnitTokenDiapTyp.LE;
            has_keyw = true;
            t = t.next;
        }
        else if (t.is_char('≥')) {
            dty = NumbersWithUnitTokenDiapTyp.GE;
            has_keyw = true;
            t = t.next;
        }
        else if (t.is_value("IP", null)) {
            uni = UnitToken.try_parse_list(t, add_units, false);
            if (uni !== null) 
                t = uni[uni.length - 1].end_token.next;
        }
        else if (t.is_value("ЗА", null) && (t.next instanceof NumberToken)) {
            dty = NumbersWithUnitTokenDiapTyp.GE;
            t = t.next;
        }
        while (t !== null && ((t.is_char_of(":,") || t.is_value("ЧЕМ", null) || t.is_table_control_char))) {
            t = t.next;
        }
        if (t !== null) {
            if (t.is_char('+') || t.is_value("ПЛЮС", null)) {
                t = t.next;
                if (t !== null && !t.is_whitespace_before) {
                    if (t.is_hiphen) {
                        t = t.next;
                        plusminus = true;
                    }
                    else if ((t.is_char_of("\\/") && t.next !== null && !t.is_newline_after) && t.next.is_hiphen) {
                        t = t.next.next;
                        plusminus = true;
                    }
                }
            }
            else if (second && ((t.is_char_of("\\/÷…~")))) 
                t = t.next;
            else if ((t.is_hiphen && t === t0 && !second) && NumbersWithUnitToken.m_termins.try_parse(t.next, TerminParseAttr.NO) !== null) {
                tok = NumbersWithUnitToken.m_termins.try_parse(t.next, TerminParseAttr.NO);
                t = tok.end_token.next;
                dty = NumbersWithUnitTokenDiapTyp.of(tok.termin.tag);
            }
            else if (t.is_hiphen && t === t0 && ((t.is_whitespace_after || second))) 
                t = t.next;
            else if (t.is_char('±')) {
                t = t.next;
                plusminus = true;
                has_keyw = true;
            }
            else if ((second && t.is_char('.') && t.next !== null) && t.next.is_char('.')) {
                t = t.next.next;
                if (t !== null && t.is_char('.')) 
                    t = t.next;
            }
        }
        let num = NumberHelper.try_parse_real_number(t, true, false);
        if (num === null) {
            uni = UnitToken.try_parse_list(t, add_units, false);
            if (uni !== null) {
                unit_before = true;
                t = uni[uni.length - 1].end_token.next;
                let delim = false;
                while (t !== null) {
                    if (t.is_char_of(":,")) {
                        delim = true;
                        t = t.next;
                    }
                    else if (t.is_hiphen && t.is_whitespace_after) {
                        delim = true;
                        t = t.next;
                    }
                    else 
                        break;
                }
                if (!delim) {
                    if (t === null) {
                        if (has_keyw && can_be_nan) {
                        }
                        else 
                            return null;
                    }
                    else if (!t.is_whitespace_before) 
                        return null;
                    if (t.next !== null && t.is_hiphen && t.is_whitespace_after) {
                        delim = true;
                        t = t.next;
                    }
                }
                num = NumberHelper.try_parse_real_number(t, true, false);
            }
        }
        let res = null;
        let rval = 0;
        if (num === null) {
            let tt = NumbersWithUnitToken.m_spec.try_parse(t, TerminParseAttr.NO);
            if (tt !== null) {
                rval = tt.termin.tag;
                let unam = String(tt.termin.tag2);
                for (const u of UnitsHelper.UNITS) {
                    if (u.fullname_cyr === unam) {
                        uni = new Array();
                        uni.push(UnitToken._new1620(t, t, u));
                        break;
                    }
                }
                if (uni === null) 
                    return null;
                res = NumbersWithUnitToken._new1622(t0, tt.end_token, _about);
                t = tt.end_token.next;
            }
            else {
                if (!can_omit_number && !has_keyw && !can_be_nan) 
                    return null;
                if ((uni !== null && uni.length === 1 && uni[0].begin_token === uni[0].end_token) && uni[0].length_char > 3) {
                    rval = 1;
                    res = NumbersWithUnitToken._new1622(t0, uni[uni.length - 1].end_token, _about);
                    t = res.end_token.next;
                }
                else if (has_keyw && can_be_nan) {
                    rval = Number.NaN;
                    res = NumbersWithUnitToken._new1622(t0, t0, _about);
                    if (t !== null) 
                        res.end_token = t.previous;
                    else 
                        for (t = t0; t !== null; t = t.next) {
                            res.end_token = t;
                        }
                }
                else 
                    return null;
            }
        }
        else {
            if ((t === t0 && t0.is_hiphen && !t.is_whitespace_before) && !t.is_whitespace_after && (num.real_value < 0)) {
                num = NumberHelper.try_parse_real_number(t.next, true, false);
                if (num === null) 
                    return null;
            }
            if (t === t0 && (t instanceof NumberToken) && t.morph.class0.is_adjective) {
                let nn = Utils.as((t).end_token, TextToken);
                if (nn === null) 
                    return null;
                let norm = nn.get_normal_case_text(MorphClass.ADJECTIVE, true, MorphGender.UNDEFINED, false);
                if ((norm.endsWith("Ь") || norm === "ЧЕТЫРЕ" || norm === "ТРИ") || norm === "ДВА") {
                }
                else {
                    let mi = Morphology.get_word_base_info("КОКО" + nn.term, null, false, false);
                    if (mi.class0.is_adjective) 
                        return null;
                }
            }
            t = num.end_token.next;
            res = NumbersWithUnitToken._new1622(t0, num.end_token, _about);
            rval = num.real_value;
        }
        if (uni === null) {
            uni = UnitToken.try_parse_list(t, add_units, false);
            if (uni !== null) {
                if ((plusminus && second && uni.length >= 1) && uni[0].unit === UnitsHelper.UPERCENT) {
                    res.end_token = uni[0].end_token;
                    res.plus_minus_percent = true;
                    let tt1 = uni[0].end_token.next;
                    uni = UnitToken.try_parse_list(tt1, add_units, false);
                    if (uni !== null) {
                        res.units = uni;
                        res.end_token = uni[uni.length - 1].end_token;
                    }
                }
                else {
                    res.units = uni;
                    res.end_token = uni[uni.length - 1].end_token;
                }
                t = res.end_token.next;
            }
        }
        else {
            res.units = uni;
            if (uni.length > 1) {
                let uni1 = UnitToken.try_parse_list(t, add_units, false);
                if (((uni1 !== null && uni1[0].unit === uni[0].unit && (uni1.length < uni.length)) && uni[uni1.length].pow === -1 && uni1[uni1.length - 1].end_token.next !== null) && uni1[uni1.length - 1].end_token.next.is_char_of("/\\")) {
                    let num2 = NumbersWithUnitToken._try_parse(uni1[uni1.length - 1].end_token.next.next, add_units, false, false, false);
                    if (num2 !== null && num2.units !== null && num2.units[0].unit === uni[uni1.length].unit) {
                        res.units = uni1;
                        res.div_num = num2;
                        res.end_token = num2.end_token;
                    }
                }
            }
        }
        res.whl = whd;
        if (dty !== NumbersWithUnitTokenDiapTyp.UNDEFINED) {
            if (dty === NumbersWithUnitTokenDiapTyp.GE || dty === NumbersWithUnitTokenDiapTyp.FROM) {
                res.from_include = true;
                res.from_val = rval;
            }
            else if (dty === NumbersWithUnitTokenDiapTyp.GT) {
                res.from_include = false;
                res.from_val = rval;
            }
            else if (dty === NumbersWithUnitTokenDiapTyp.LE || dty === NumbersWithUnitTokenDiapTyp.TO) {
                res.to_include = true;
                res.to_val = rval;
            }
            else if (dty === NumbersWithUnitTokenDiapTyp.LS) {
                res.to_include = false;
                res.to_val = rval;
            }
        }
        let is_second_max = false;
        if (!second) {
            let iii = 0;
            let wrapiii1626 = new RefOutArgWrapper(iii);
            ttt = NumbersWithUnitToken._is_min_or_max(t, wrapiii1626);
            iii = wrapiii1626.value;
            if (ttt !== null && iii > 0) {
                is_second_max = true;
                t = ttt.next;
            }
        }
        let _next = (second || plusminus || ((t !== null && ((t.is_table_control_char || t.is_newline_before)))) ? null : NumbersWithUnitToken._try_parse(t, add_units, true, false, can_be_nan));
        if (_next !== null && (t.previous instanceof NumberToken)) {
            if (MeasureHelper.is_mult_char((t.previous).end_token)) 
                _next = null;
        }
        if (_next !== null && ((_next.to_val !== null || _next.single_val !== null)) && _next.from_val === null) {
            if ((((_next.begin_token.is_char('+') && _next.single_val !== null && !isNaN(_next.single_val)) && _next.end_token.next !== null && _next.end_token.next.is_char_of("\\/")) && _next.end_token.next.next !== null && _next.end_token.next.next.is_hiphen) && !has_keyw && !isNaN(rval)) {
                let next2 = NumbersWithUnitToken._try_parse(_next.end_token.next.next.next, add_units, true, false, false);
                if (next2 !== null && next2.single_val !== null && !isNaN(next2.single_val)) {
                    res.from_val = rval - next2.single_val;
                    res.from_include = true;
                    res.to_val = rval + _next.single_val;
                    res.to_include = true;
                    if (next2.units !== null && res.units.length === 0) 
                        res.units = next2.units;
                    res.end_token = next2.end_token;
                    return res;
                }
            }
            if (_next.units.length > 0) {
                if (res.units.length === 0) 
                    res.units = _next.units;
                else if (!UnitToken.can_be_equals(res.units, _next.units)) 
                    _next = null;
            }
            else if (res.units.length > 0 && !unit_before && !_next.plus_minus_percent) 
                _next = null;
            if (_next !== null) 
                res.end_token = _next.end_token;
            if (_next !== null && _next.to_val !== null) {
                res.to_val = _next.to_val;
                res.to_include = _next.to_include;
            }
            else if (_next !== null && _next.single_val !== null) {
                if (_next.begin_token.is_char_of("/\\")) {
                    res.div_num = _next;
                    res.single_val = rval;
                    return res;
                }
                else if (_next.plus_minus_percent) {
                    res.single_val = rval;
                    res.plus_minus = _next.single_val;
                    res.plus_minus_percent = true;
                    res.to_include = true;
                }
                else {
                    res.to_val = _next.single_val;
                    res.to_include = true;
                }
            }
            if (_next !== null) {
                if (res.from_val === null) {
                    res.from_val = rval;
                    res.from_include = true;
                }
                return res;
            }
        }
        else if ((_next !== null && _next.from_val !== null && _next.to_val !== null) && _next.to_val === (-_next.from_val)) {
            if (_next.units.length === 1 && _next.units[0].unit === UnitsHelper.UPERCENT && res.units.length > 0) {
                res.single_val = rval;
                res.plus_minus = _next.to_val;
                res.plus_minus_percent = true;
                res.end_token = _next.end_token;
                return res;
            }
            if (_next.units.length === 0) {
                res.single_val = rval;
                res.plus_minus = _next.to_val;
                res.end_token = _next.end_token;
                return res;
            }
            res.from_val = _next.from_val + rval;
            res.from_include = true;
            res.to_val = _next.to_val + rval;
            res.to_include = true;
            res.end_token = _next.end_token;
            if (_next.units.length > 0) 
                res.units = _next.units;
            return res;
        }
        if (dty === NumbersWithUnitTokenDiapTyp.UNDEFINED) {
            if (plusminus && ((!res.plus_minus_percent || !second))) {
                res.from_include = true;
                res.from_val = -rval;
                res.to_include = true;
                res.to_val = rval;
            }
            else {
                res.single_val = rval;
                res.plus_minus_percent = plusminus;
            }
        }
        if (_is_age) 
            res.is_age = true;
        return res;
    }
    
    /**
     * Это распознавание написаний ГхШхВ
     * @param t 
     * @return 
     */
    static _try_parsewhl(t) {
        if (!((t instanceof TextToken))) 
            return null;
        if (t.is_char_of(":-")) {
            let re0 = NumbersWithUnitToken._try_parsewhl(t.next);
            if (re0 !== null) 
                return re0;
        }
        if (t.is_char_of("(")) {
            let re0 = NumbersWithUnitToken._try_parsewhl(t.next);
            if (re0 !== null) {
                if (re0.end_token.next !== null && re0.end_token.next.is_char(')')) {
                    re0.begin_token = t;
                    re0.end_token = re0.end_token.next;
                    return re0;
                }
            }
        }
        let txt = (t).term;
        let nams = null;
        if (txt.length === 5 && ((txt[1] === 'Х' || txt[1] === 'X')) && ((txt[3] === 'Х' || txt[3] === 'X'))) {
            nams = new Array();
            for (let i = 0; i < 3; i++) {
                let ch = txt[i * 2];
                if (ch === 'Г') 
                    nams.push("ГЛУБИНА");
                else if (ch === 'В' || ch === 'H' || ch === 'Н') 
                    nams.push("ВЫСОТА");
                else if (ch === 'Ш' || ch === 'B' || ch === 'W') 
                    nams.push("ШИРИНА");
                else if (ch === 'Д' || ch === 'L') 
                    nams.push("ДЛИНА");
                else if (ch === 'D') 
                    nams.push("ДИАМЕТР");
                else 
                    return null;
            }
            return MetaToken._new834(t, t, nams);
        }
        let t0 = t;
        let t1 = t;
        for (; t !== null; t = t.next) {
            if (!((t instanceof TextToken)) || ((t.whitespaces_before_count > 1 && t !== t0))) 
                break;
            let term = (t).term;
            if (term.endsWith("X") || term.endsWith("Х")) 
                term = term.substring(0, 0 + term.length - 1);
            let nam = null;
            if (((t.is_value("ДЛИНА", null) || t.is_value("ДЛИННА", null) || term === "Д") || term === "ДЛ" || term === "ДЛИН") || term === "L") 
                nam = "ДЛИНА";
            else if (((t.is_value("ШИРИНА", null) || t.is_value("ШИРОТА", null) || term === "Ш") || term === "ШИР" || term === "ШИРИН") || term === "W" || term === "B") 
                nam = "ШИРИНА";
            else if ((t.is_value("ГЛУБИНА", null) || term === "Г" || term === "ГЛ") || term === "ГЛУБ") 
                nam = "ГЛУБИНА";
            else if ((t.is_value("ВЫСОТА", null) || term === "В" || term === "ВЫС") || term === "H" || term === "Н") 
                nam = "ВЫСОТА";
            else if (t.is_value("ДИАМЕТР", null) || term === "D" || term === "ДИАМ") 
                nam = "ДИАМЕТР";
            else 
                break;
            if (nams === null) 
                nams = new Array();
            nams.push(nam);
            t1 = t;
            if (t.next !== null && t.next.is_char('.')) 
                t1 = (t = t.next);
            if (t.next === null) 
                break;
            if (MeasureHelper.is_mult_char(t.next) || t.next.is_comma || t.next.is_char_of("\\/")) 
                t = t.next;
        }
        if (nams === null || (nams.length < 2)) 
            return null;
        return MetaToken._new834(t0, t1, nams);
    }
    
    static initialize() {
        if (NumbersWithUnitToken.m_termins !== null) 
            return;
        NumbersWithUnitToken.m_termins = new TerminCollection();
        let t = Termin._new119("НЕ МЕНЕЕ", NumbersWithUnitTokenDiapTyp.GE);
        t.add_variant("НЕ МЕНЬШЕ", false);
        t.add_variant("НЕ КОРОЧЕ", false);
        t.add_variant("НЕ МЕДЛЕННЕЕ", false);
        t.add_variant("НЕ НИЖЕ", false);
        t.add_variant("НЕ МОЛОЖЕ", false);
        t.add_variant("НЕ ДЕШЕВЛЕ", false);
        t.add_variant("НЕ РЕЖЕ", false);
        t.add_variant("НЕ МЕНЕ", false);
        NumbersWithUnitToken.m_termins.add(t);
        t = Termin._new119("МЕНЕЕ", NumbersWithUnitTokenDiapTyp.LS);
        t.add_variant("МЕНЬШЕ", false);
        t.add_variant("МЕНЕ", false);
        t.add_variant("КОРОЧЕ", false);
        t.add_variant("МЕДЛЕННЕЕ", false);
        t.add_variant("НИЖЕ", false);
        t.add_variant("МЛАДШЕ", false);
        t.add_variant("ДЕШЕВЛЕ", false);
        t.add_variant("РЕЖЕ", false);
        NumbersWithUnitToken.m_termins.add(t);
        t = Termin._new119("НЕ БОЛЕЕ", NumbersWithUnitTokenDiapTyp.LE);
        t.add_variant("НЕ БОЛЬШЕ", false);
        t.add_variant("НЕ БОЛЕ", false);
        t.add_variant("НЕ ДЛИННЕЕ", false);
        t.add_variant("НЕ БЫСТРЕЕ", false);
        t.add_variant("НЕ ВЫШЕ", false);
        t.add_variant("НЕ ПОЗДНЕЕ", false);
        t.add_variant("НЕ ДОЛЬШЕ", false);
        t.add_variant("НЕ СТАРШЕ", false);
        t.add_variant("НЕ ДОРОЖЕ", false);
        t.add_variant("НЕ ЧАЩЕ", false);
        NumbersWithUnitToken.m_termins.add(t);
        t = Termin._new119("БОЛЕЕ", NumbersWithUnitTokenDiapTyp.GT);
        t.add_variant("БОЛЬШЕ", false);
        t.add_variant("ДЛИННЕЕ", false);
        t.add_variant("БЫСТРЕЕ", false);
        t.add_variant("БОЛЕ", false);
        t.add_variant("ЧАЩЕ", false);
        t.add_variant("ГЛУБЖЕ", false);
        t.add_variant("ВЫШЕ", false);
        t.add_variant("СВЫШЕ", false);
        t.add_variant("СТАРШЕ", false);
        t.add_variant("ДОРОЖЕ", false);
        NumbersWithUnitToken.m_termins.add(t);
        t = Termin._new119("ОТ", NumbersWithUnitTokenDiapTyp.FROM);
        t.add_variant("С", false);
        t.add_variant("C", false);
        t.add_variant("НАЧИНАЯ С", false);
        t.add_variant("НАЧИНАЯ ОТ", false);
        NumbersWithUnitToken.m_termins.add(t);
        t = Termin._new119("ДО", NumbersWithUnitTokenDiapTyp.TO);
        t.add_variant("ПО", false);
        t.add_variant("ЗАКАНЧИВАЯ", false);
        NumbersWithUnitToken.m_termins.add(t);
        t = Termin._new119("НЕ ХУЖЕ", NumbersWithUnitTokenDiapTyp.UNDEFINED);
        NumbersWithUnitToken.m_termins.add(t);
        NumbersWithUnitToken.m_spec = new TerminCollection();
        t = Termin._new121("ПОЛЛИТРА", 0.5, "литр");
        t.add_variant("ПОЛУЛИТРА", false);
        NumbersWithUnitToken.m_spec.add(t);
        t = Termin._new121("ПОЛКИЛО", 0.5, "килограмм");
        t.add_variant("ПОЛКИЛОГРАММА", false);
        NumbersWithUnitToken.m_spec.add(t);
        t = Termin._new121("ПОЛМЕТРА", 0.5, "метр");
        t.add_variant("ПОЛУМЕТРА", false);
        NumbersWithUnitToken.m_spec.add(t);
        t = Termin._new121("ПОЛТОННЫ", 0.5, "тонна");
        t.add_variant("ПОЛУТОННЫ", false);
        NumbersWithUnitToken.m_spec.add(t);
        NumbersWithUnitToken.m_spec.add(t);
    }
    
    static _new1613(_arg1, _arg2, _arg3) {
        let res = new NumbersWithUnitToken(_arg1, _arg2);
        res.single_val = _arg3;
        return res;
    }
    
    static _new1622(_arg1, _arg2, _arg3) {
        let res = new NumbersWithUnitToken(_arg1, _arg2);
        res.about = _arg3;
        return res;
    }
    
    static static_constructor() {
        NumbersWithUnitToken.m_termins = null;
        NumbersWithUnitToken.m_spec = null;
    }
}


NumbersWithUnitToken.static_constructor();

module.exports = NumbersWithUnitToken