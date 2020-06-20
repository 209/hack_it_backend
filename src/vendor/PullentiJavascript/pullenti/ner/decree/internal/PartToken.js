/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const BracketParseAttr = require("./../../core/BracketParseAttr");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const DecreeTokenItemType = require("./DecreeTokenItemType");
const GetTextAttr = require("./../../core/GetTextAttr");
const InstrumentKind = require("./../../instrument/InstrumentKind");
const ReferentToken = require("./../../ReferentToken");
const NumberingHelper = require("./../../instrument/internal/NumberingHelper");
const DecreePartReferent = require("./../DecreePartReferent");
const MetaToken = require("./../../MetaToken");
const TextToken = require("./../../TextToken");
const NumberToken = require("./../../NumberToken");
const PartTokenItemType = require("./PartTokenItemType");
const NumberSpellingType = require("./../../NumberSpellingType");
const Token = require("./../../Token");
const DecreeAnalyzer = require("./../DecreeAnalyzer");
const NumberHelper = require("./../../core/NumberHelper");
const MiscHelper = require("./../../core/MiscHelper");
const DecreeReferent = require("./../DecreeReferent");
const BracketHelper = require("./../../core/BracketHelper");

/**
 * Примитив, из которых состоит часть декрета (статья, пункт и часть)
 */
class PartToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = PartTokenItemType.UNDEFINED;
        this.alt_typ = PartTokenItemType.UNDEFINED;
        this.values = new Array();
        this.name = null;
        this.ind = 0;
        this.decree = null;
        this.is_doubt = false;
        this.delim_after = false;
        this.has_terminator = false;
        this.anafor_ref = null;
    }
    
    toString() {
        let res = new StringBuilder(this.typ.toString());
        for (const v of this.values) {
            res.append(" ").append(v);
        }
        if (this.delim_after) 
            res.append(", DelimAfter");
        if (this.is_doubt) 
            res.append(", Doubt");
        if (this.has_terminator) 
            res.append(", Terminator");
        if (this.anafor_ref !== null) 
            res.append(", Ref='").append(this.anafor_ref.term).append("'");
        return res.toString();
    }
    
    /**
     * Привязать с указанной позиции один примитив
     * @return 
     */
    static try_attach(t, prev, in_bracket = false, ignore_number = false) {
        const DecreeToken = require("./DecreeToken");
        if (t === null) 
            return null;
        let res = null;
        if (t.morph.class0.is_personal_pronoun && (t.whitespaces_after_count < 2)) {
            res = PartToken.try_attach(t.next, prev, false, false);
            if (res !== null) {
                res.anafor_ref = Utils.as(t, TextToken);
                res.begin_token = t;
                return res;
            }
        }
        let tt = Utils.as(t, TextToken);
        if ((t instanceof NumberToken) && t.next !== null && (t.whitespaces_after_count < 3)) {
            let re = PartToken._create_part_typ0(t.next, prev);
            if (re !== null) {
                let t11 = re.end_token.next;
                let ok1 = false;
                if (t11 !== null && (t11.get_referent() instanceof DecreeReferent)) 
                    ok1 = true;
                else if (prev !== null && t11 !== null && !((t11 instanceof NumberToken))) 
                    ok1 = true;
                if (!ok1) {
                    let res1 = PartToken.try_attach(t11, null, false, false);
                    if (res1 !== null) 
                        ok1 = true;
                }
                if (ok1 || in_bracket) {
                    re.begin_token = t;
                    re.values.push(PartToken.PartValue._new1036(t, t, (t).value.toString()));
                    return re;
                }
            }
        }
        if (((t instanceof NumberToken) && (t).typ === NumberSpellingType.DIGIT && prev === null) && t.previous !== null) {
            let t0 = t.previous;
            let delim = false;
            if (t0.is_char(',') || t0.morph.class0.is_conjunction) {
                delim = true;
                t0 = t0.previous;
            }
            if (t0 === null) 
                return null;
            let dr = Utils.as(t0.get_referent(), DecreePartReferent);
            if (dr === null) {
                if (t0.is_char('(') && t.next !== null) {
                    if (t.next.is_value("ЧАСТЬ", null) || t.next.is_value("Ч", null)) {
                        let te = t.next;
                        if (te.next !== null && te.next.is_char('.')) 
                            te = te.next;
                        res = PartToken._new795(t, te, PartTokenItemType.PART);
                        res.values.push(PartToken.PartValue._new1036(t, t, (t).value.toString()));
                        return res;
                    }
                }
                return null;
            }
            if (dr.clause === null) 
                return null;
            res = PartToken._new1039(t, t, PartTokenItemType.CLAUSE, !delim);
            let pv = PartToken.PartValue._new1036(t, t, (t).value.toString());
            res.values.push(pv);
            for (t = t.next; t !== null; t = t.next) {
                if (t.is_whitespace_before) 
                    break;
                else if (t.is_char_of("._") && (t.next instanceof NumberToken)) {
                    t = t.next;
                    pv.end_token = res.end_token = t;
                    pv.value = (pv.value + "." + (t).value);
                }
                else 
                    break;
            }
            return res;
        }
        if (((t instanceof NumberToken) && (t).typ === NumberSpellingType.DIGIT && prev !== null) && prev.typ === PartTokenItemType.PREFIX && (t.whitespaces_before_count < 3)) {
            let pv = PartToken.PartValue._new1036(t, t, (t).value.toString());
            pv.correct_value();
            let ttt1 = pv.end_token.next;
            let ne = DecreeToken.try_attach(ttt1, null, false);
            let ok = false;
            if (ne !== null && ne.typ === DecreeTokenItemType.TYP) 
                ok = true;
            else if (DecreeAnalyzer._check_other_typ(ttt1, true) !== null) 
                ok = true;
            else if (DecreeAnalyzer._get_decree(ttt1) !== null) 
                ok = true;
            if (ok) {
                res = PartToken._new795(t, pv.end_token, PartTokenItemType.ITEM);
                res.values.push(pv);
                return res;
            }
        }
        if (tt === null) 
            return null;
        if (tt.length_char === 1 && !tt.chars.is_all_lower) {
            if (!MiscHelper.can_be_start_of_sentence(tt)) 
                return null;
        }
        let t1 = tt;
        res = PartToken._create_part_typ0(t1, prev);
        if (res !== null) 
            t1 = res.end_token;
        else if ((t1.is_value("СИЛУ", null) || t1.is_value("СОГЛАСНО", null) || t1.is_value("СООТВЕТСТВИЕ", null)) || t1.is_value("ПОЛОЖЕНИЕ", null)) {
            if (t1.is_value("СИЛУ", null) && t1.previous !== null && t1.previous.morph.class0.is_verb) 
                return null;
            res = PartToken._new795(t1, t1, PartTokenItemType.PREFIX);
            if (t1.next !== null && t1.next.is_value("С", null)) 
                res.end_token = t1.next;
            return res;
        }
        else if (((t1.is_value("УГОЛОВНОЕ", null) || t1.is_value("КРИМІНАЛЬНА", null))) && t1.next !== null && ((t1.next.is_value("ДЕЛО", null) || t1.next.is_value("СПРАВА", null)))) {
            t1 = t1.next;
            if (t1.next !== null && t1.next.is_value("ПО", null)) 
                t1 = t1.next;
            return PartToken._new795(t, t1, PartTokenItemType.PREFIX);
        }
        else if ((((t1.is_value("МОТИВИРОВОЧНЫЙ", null) || t1.is_value("МОТИВУВАЛЬНИЙ", null) || t1.is_value("РЕЗОЛЮТИВНЫЙ", null)) || t1.is_value("РЕЗОЛЮТИВНИЙ", null))) && t1.next !== null && ((t1.next.is_value("ЧАСТЬ", null) || t1.next.is_value("ЧАСТИНА", null)))) {
            let rr = PartToken._new795(t1, t1.next, PartTokenItemType.PART);
            rr.values.push(PartToken.PartValue._new1036(t1, t1, (t1.is_value("МОТИВИРОВОЧНЫЙ", null) || t1.is_value("МОТИВУВАЛЬНИЙ", null) ? "мотивировочная" : "резолютивная")));
            return rr;
        }
        if (res === null) 
            return null;
        if (ignore_number) 
            return res;
        if (res.is_newline_after) {
            if (res.chars.is_all_upper) 
                return null;
        }
        if (t1.next !== null && t1.next.is_char('.')) {
            if (!t1.next.is_newline_after || (t1.length_char < 3)) 
                t1 = t1.next;
        }
        t1 = t1.next;
        if (t1 === null) 
            return null;
        if (res.typ === PartTokenItemType.CLAUSE) {
            if (((t1 instanceof NumberToken) && (t1).value === "3" && !t1.is_whitespace_after) && t1.next !== null && t1.next.length_char === 2) 
                return null;
        }
        if (res.typ === PartTokenItemType.CLAUSE && t1.is_value("СТ", null)) {
            t1 = t1.next;
            if (t1 !== null && t1.is_char('.')) 
                t1 = t1.next;
        }
        else if (res.typ === PartTokenItemType.PART && t1.is_value("Ч", null)) {
            t1 = t1.next;
            if (t1 !== null && t1.is_char('.')) 
                t1 = t1.next;
        }
        else if (res.typ === PartTokenItemType.ITEM && t1.is_value("П", null)) {
            t1 = t1.next;
            if (t1 !== null && t1.is_char('.')) 
                t1 = t1.next;
            res.alt_typ = PartTokenItemType.SUBITEM;
        }
        else if ((res.typ === PartTokenItemType.ITEM && t1.is_char_of("\\/") && t1.next !== null) && t1.next.is_value("П", null)) {
            t1 = t1.next.next;
            if (t1 !== null && t1.is_char('.')) 
                t1 = t1.next;
            res.alt_typ = PartTokenItemType.SUBITEM;
        }
        if (t1 === null) 
            return null;
        if (res.typ === PartTokenItemType.CLAUSE && (t1.get_referent() instanceof DecreeReferent) && t1.next !== null) {
            res.decree = Utils.as(t1.get_referent(), DecreeReferent);
            t1 = t1.next;
        }
        let ttn = MiscHelper.check_number_prefix(t1);
        let first_num_prefix = null;
        if (ttn !== null) {
            first_num_prefix = Utils.as(t1, TextToken);
            t1 = ttn;
        }
        if (t1 === null) 
            return null;
        res.end_token = t1;
        let and = false;
        let ntyp = NumberSpellingType.DIGIT;
        let tt1 = t1;
        while (t1 !== null) {
            if (t1.whitespaces_before_count > 15) 
                break;
            if (t1 !== tt1 && t1.is_newline_before) 
                break;
            if (ttn !== null) {
                ttn = MiscHelper.check_number_prefix(t1);
                if (ttn !== null) 
                    t1 = ttn;
            }
            if (BracketHelper.can_be_start_of_sequence(t1, false, false)) {
                let br = BracketHelper.try_parse(t1, BracketParseAttr.NO, 100);
                if (br === null) 
                    break;
                let ok = true;
                let newp = null;
                for (let ttt = t1.next; ttt !== null; ttt = ttt.next) {
                    if (ttt.end_char > br.end_token.previous.end_char) 
                        break;
                    if (ttt.is_char(',')) 
                        continue;
                    if (ttt instanceof NumberToken) {
                        if ((ttt).value === "0") {
                            ok = false;
                            break;
                        }
                        if (newp === null) 
                            newp = new Array();
                        newp.push(PartToken.PartValue._new1036(ttt, ttt, (ttt).value.toString()));
                        continue;
                    }
                    let to = Utils.as(ttt, TextToken);
                    if (to === null) {
                        ok = false;
                        break;
                    }
                    if ((res.typ !== PartTokenItemType.ITEM && res.typ !== PartTokenItemType.SUBITEM && res.typ !== PartTokenItemType.INDENTION) && res.typ !== PartTokenItemType.SUBINDENTION) {
                        ok = false;
                        break;
                    }
                    if (!to.chars.is_letter || to.length_char !== 1) {
                        ok = false;
                        break;
                    }
                    if (newp === null) 
                        newp = new Array();
                    let pv = PartToken.PartValue._new1036(ttt, ttt, to.term);
                    if (BracketHelper.can_be_start_of_sequence(ttt.previous, false, false)) 
                        pv.begin_token = ttt.previous;
                    if (BracketHelper.can_be_end_of_sequence(ttt.next, false, null, false)) 
                        pv.end_token = ttt.next;
                    newp.push(pv);
                }
                if (newp === null || !ok) 
                    break;
                res.values.splice(res.values.length, 0, ...newp);
                res.end_token = br.end_token;
                t1 = br.end_token.next;
                if (and) 
                    break;
                if (t1 !== null && t1.is_hiphen && BracketHelper.can_be_start_of_sequence(t1.next, false, false)) {
                    let br1 = BracketHelper.try_parse(t1.next, BracketParseAttr.NO, 100);
                    if ((br1 !== null && (t1.next.next instanceof TextToken) && t1.next.next.length_char === 1) && t1.next.next.next === br1.end_token) {
                        res.values.push(PartToken.PartValue._new1036(br1.begin_token, br1.end_token, (t1.next.next).term));
                        res.end_token = br1.end_token;
                        t1 = br1.end_token.next;
                    }
                }
                continue;
            }
            if (((t1 instanceof TextToken) && t1.length_char === 1 && t1.chars.is_letter) && res.values.length === 0) {
                if (t1.chars.is_all_upper && res.typ === PartTokenItemType.SUBPROGRAM) {
                    res.values.push(PartToken.PartValue._new1036(t1, t1, (t1).term));
                    res.end_token = t1;
                    return res;
                }
                let ok = true;
                let lev = 0;
                for (let ttt = t1.previous; ttt !== null; ttt = ttt.previous) {
                    if (ttt.is_newline_after) 
                        break;
                    if (ttt.is_char('(')) {
                        lev--;
                        if (lev < 0) {
                            ok = false;
                            break;
                        }
                    }
                    else if (ttt.is_char(')')) 
                        lev++;
                }
                if (ok && t1.next !== null && t1.next.is_char(')')) {
                    res.values.push(PartToken.PartValue._new1036(t1, t1.next, (t1).term));
                    res.end_token = t1.next;
                    t1 = t1.next.next;
                    continue;
                }
                if (((ok && t1.next !== null && t1.next.is_char('.')) && !t1.next.is_whitespace_after && (t1.next.next instanceof NumberToken)) && t1.next.next.next !== null && t1.next.next.next.is_char(')')) {
                    res.values.push(PartToken.PartValue._new1036(t1, t1.next.next.next, ((t1).term + "." + (t1.next.next).value)));
                    res.end_token = t1.next.next.next;
                    t1 = res.end_token.next;
                    continue;
                }
            }
            let pref_to = null;
            if (res.values.length > 0 && !((t1 instanceof NumberToken)) && first_num_prefix !== null) {
                ttn = MiscHelper.check_number_prefix(t1);
                if (ttn !== null) {
                    pref_to = t1;
                    t1 = ttn;
                }
            }
            if (t1 instanceof NumberToken) {
                let tt0 = (pref_to != null ? pref_to : t1);
                if (res.values.length > 0) {
                    if (res.values[0].int_value === 0 && !Utils.isDigit(res.values[0].value[0])) 
                        break;
                    if ((t1).typ !== ntyp) 
                        break;
                }
                ntyp = (t1).typ;
                let val = PartToken.PartValue._new1036(tt0, t1, (t1).value.toString());
                val.correct_value();
                res.values.push(val);
                res.end_token = val.end_token;
                t1 = res.end_token.next;
                if (and) 
                    break;
                continue;
            }
            let nt = NumberHelper.try_parse_roman(t1);
            if (nt !== null) {
                let pv = PartToken.PartValue._new1036(t1, nt.end_token, nt.value.toString());
                res.values.push(pv);
                pv.correct_value();
                res.end_token = pv.end_token;
                t1 = res.end_token.next;
                continue;
            }
            if ((t1 === tt1 && ((res.typ === PartTokenItemType.APPENDIX || res.typ === PartTokenItemType.ADDAGREE)) && t1.is_value("К", null)) && t1.next !== null && (t1.next.get_referent() instanceof DecreeReferent)) {
                res.values.push(PartToken.PartValue._new1036(t1, t1, ""));
                break;
            }
            if (res.typ === PartTokenItemType.ADDAGREE && first_num_prefix !== null && res.values.length === 0) {
                let ddd = DecreeToken.try_attach(first_num_prefix, null, false);
                if (ddd !== null && ddd.typ === DecreeTokenItemType.NUMBER && ddd.value !== null) {
                    res.values.push(PartToken.PartValue._new1036(t1, ddd.end_token, ddd.value));
                    t1 = res.end_token = ddd.end_token;
                    break;
                }
            }
            if (res.values.length === 0) 
                break;
            if (t1.is_char_of(",.")) {
                if (t1.is_newline_after && t1.is_char('.')) 
                    break;
                t1 = t1.next;
                continue;
            }
            if (t1.is_hiphen && res.values[res.values.length - 1].value.indexOf('.') > 0) {
                t1 = t1.next;
                continue;
            }
            if (t1.is_and || t1.is_or) {
                t1 = t1.next;
                and = true;
                continue;
            }
            if (t1.is_hiphen) {
                if (!((t1.next instanceof NumberToken)) || (t1.next).int_value === null) 
                    break;
                let min = res.values[res.values.length - 1].int_value;
                if (min === 0) 
                    break;
                let max = (t1.next).int_value;
                if (max < min) 
                    break;
                if ((max - min) > 200) 
                    break;
                let val = PartToken.PartValue._new1036(t1.next, t1.next, max.toString());
                val.correct_value();
                res.values.push(val);
                res.end_token = val.end_token;
                t1 = res.end_token.next;
                continue;
            }
            break;
        }
        if (res.values.length === 0 && !res.is_newline_after && BracketHelper.can_be_start_of_sequence(res.end_token, true, false)) {
            let lev = PartToken._get_rank(res.typ);
            if (lev > 0 && (lev < PartToken._get_rank(PartTokenItemType.CLAUSE))) {
                let br = BracketHelper.try_parse(res.end_token, BracketParseAttr.NO, 100);
                if (br !== null) {
                    res.name = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                    res.end_token = br.end_token;
                }
            }
        }
        if (res.values.length === 0 && res.name === null) {
            if (!ignore_number && res.typ !== PartTokenItemType.PREAMBLE && res.typ !== PartTokenItemType.SUBPROGRAM) 
                return null;
            if (res.begin_token !== res.end_token) 
                res.end_token = res.end_token.previous;
        }
        return res;
    }
    
    static _create_part_typ0(t1, prev) {
        let is_short = false;
        let wrapis_short1058 = new RefOutArgWrapper();
        let pt = PartToken.__create_part_typ(t1, prev, wrapis_short1058);
        is_short = wrapis_short1058.value;
        if (pt === null) 
            return null;
        if ((is_short && !pt.end_token.is_whitespace_after && pt.end_token.next !== null) && pt.end_token.next.is_char('.')) {
            if (!pt.end_token.next.is_newline_after) 
                pt.end_token = pt.end_token.next;
        }
        return pt;
    }
    
    static __create_part_typ(t1, prev, is_short) {
        is_short.value = false;
        if (t1 === null) 
            return null;
        if (t1.is_value("ЧАСТЬ", "ЧАСТИНА")) 
            return PartToken._new795(t1, t1, PartTokenItemType.PART);
        if (t1.is_value("Ч", null)) {
            is_short.value = true;
            return PartToken._new795(t1, t1, PartTokenItemType.PART);
        }
        if (t1.is_value("ГЛАВА", null) || t1.is_value("ГЛ", null)) {
            is_short.value = t1.length_char === 2;
            return PartToken._new795(t1, t1, PartTokenItemType.CHAPTER);
        }
        if (t1.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК") || t1.is_value("ПРИЛ", null)) {
            if ((t1.is_newline_before && t1.length_char > 6 && t1.next !== null) && t1.next.is_char(':')) 
                return null;
            is_short.value = t1.length_char < 5;
            return PartToken._new795(t1, t1, PartTokenItemType.APPENDIX);
        }
        if (t1.is_value("ПРИМЕЧАНИЕ", "ПРИМІТКА") || t1.is_value("ПРИМ", null)) {
            is_short.value = t1.length_char < 5;
            return PartToken._new795(t1, t1, PartTokenItemType.NOTICE);
        }
        if (t1.is_value("СТАТЬЯ", "СТАТТЯ") || t1.is_value("СТ", null)) {
            is_short.value = t1.length_char < 3;
            return PartToken._new795(t1, t1, PartTokenItemType.CLAUSE);
        }
        if (t1.is_value("ПУНКТ", null) || t1.is_value("П", null) || t1.is_value("ПП", null)) {
            is_short.value = t1.length_char < 3;
            return PartToken._new1065(t1, t1, PartTokenItemType.ITEM, (t1.is_value("ПП", null) ? PartTokenItemType.SUBITEM : PartTokenItemType.UNDEFINED));
        }
        if (t1.is_value("ПОДПУНКТ", "ПІДПУНКТ")) 
            return PartToken._new795(t1, t1, PartTokenItemType.SUBITEM);
        if (t1.is_value("ПРЕАМБУЛА", null)) 
            return PartToken._new795(t1, t1, PartTokenItemType.PREAMBLE);
        if (t1.is_value("ПОДП", null) || t1.is_value("ПІДП", null)) {
            is_short.value = true;
            return PartToken._new795(t1, t1, PartTokenItemType.SUBITEM);
        }
        if (t1.is_value("РАЗДЕЛ", "РОЗДІЛ") || t1.is_value("РАЗД", null)) {
            is_short.value = t1.length_char < 5;
            return PartToken._new795(t1, t1, PartTokenItemType.SECTION);
        }
        if (((t1.is_value("Р", null) || t1.is_value("P", null))) && t1.next !== null && t1.next.is_char('.')) {
            if (prev !== null) {
                if (prev.typ === PartTokenItemType.ITEM || prev.typ === PartTokenItemType.SUBITEM) {
                    is_short.value = true;
                    return PartToken._new795(t1, t1.next, PartTokenItemType.SECTION);
                }
            }
        }
        if (t1.is_value("ПОДРАЗДЕЛ", "ПІРОЗДІЛ")) 
            return PartToken._new795(t1, t1, PartTokenItemType.SUBSECTION);
        if (t1.is_value("ПАРАГРАФ", null) || t1.is_value("§", null)) 
            return PartToken._new795(t1, t1, PartTokenItemType.PARAGRAPH);
        if (t1.is_value("АБЗАЦ", null) || t1.is_value("АБЗ", null)) {
            is_short.value = t1.length_char < 7;
            return PartToken._new795(t1, t1, PartTokenItemType.INDENTION);
        }
        if (t1.is_value("СТРАНИЦА", "СТОРІНКА") || t1.is_value("СТР", "СТОР")) {
            is_short.value = t1.length_char < 7;
            return PartToken._new795(t1, t1, PartTokenItemType.PAGE);
        }
        if (t1.is_value("ПОДАБЗАЦ", "ПІДАБЗАЦ") || t1.is_value("ПОДАБЗ", "ПІДАБЗ")) 
            return PartToken._new795(t1, t1, PartTokenItemType.SUBINDENTION);
        if (t1.is_value("ПОДПАРАГРАФ", "ПІДПАРАГРАФ")) 
            return PartToken._new795(t1, t1, PartTokenItemType.SUBPARAGRAPH);
        if (t1.is_value("ПОДПРОГРАММА", "ПІДПРОГРАМА")) 
            return PartToken._new795(t1, t1, PartTokenItemType.SUBPROGRAM);
        if (t1.is_value("ДОПСОГЛАШЕНИЕ", null)) 
            return PartToken._new795(t1, t1, PartTokenItemType.ADDAGREE);
        if (((t1.is_value("ДОП", null) || t1.is_value("ДОПОЛНИТЕЛЬНЫЙ", "ДОДАТКОВА"))) && t1.next !== null) {
            let tt = t1.next;
            if (tt.is_char('.') && tt.next !== null) 
                tt = tt.next;
            if (tt.is_value("СОГЛАШЕНИЕ", "УГОДА")) 
                return PartToken._new795(t1, tt, PartTokenItemType.ADDAGREE);
        }
        return null;
    }
    
    /**
     * Привязать примитивы в контейнере с указанной позиции
     * @return Список примитивов
     */
    static try_attach_list(t, in_bracket = false, max_count = 40) {
        let p = PartToken.try_attach(t, null, in_bracket, false);
        if (p === null) 
            return null;
        let res = new Array();
        res.push(p);
        if (p.is_newline_after && p.is_newline_before) {
            if (!p.begin_token.chars.is_all_lower) 
                return res;
        }
        let tt = p.end_token.next;
        while (tt !== null) {
            if (tt.whitespaces_before_count > 15) {
                if (tt.previous !== null && tt.previous.is_comma_and) {
                }
                else 
                    break;
            }
            if (max_count > 0 && res.length >= max_count) 
                break;
            let delim = false;
            if (((tt.is_char_of(",;.") || tt.is_and || tt.is_or)) && tt.next !== null) {
                if (tt.is_char_of(";.")) 
                    res[res.length - 1].has_terminator = true;
                else {
                    res[res.length - 1].delim_after = true;
                    if ((tt.next !== null && tt.next.is_value("А", null) && tt.next.next !== null) && tt.next.next.is_value("ТАКЖЕ", "ТАКОЖ")) 
                        tt = tt.next.next;
                }
                tt = tt.next;
                delim = true;
            }
            if (tt === null) 
                break;
            if (tt.is_newline_before) {
                if (tt.chars.is_letter && !tt.chars.is_all_lower) 
                    break;
            }
            if (tt.is_char('(')) {
                let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                if (br !== null) {
                    let li = PartToken.try_attach_list(tt.next, true, 40);
                    if (li !== null && li.length > 0) {
                        if (li[0].typ === PartTokenItemType.PARAGRAPH || li[0].typ === PartTokenItemType.PART || li[0].typ === PartTokenItemType.ITEM) {
                            if (li[li.length - 1].end_token.next === br.end_token) {
                                if (p.values.length > 1) {
                                    for (let ii = 1; ii < p.values.length; ii++) {
                                        let pp = PartToken._new795(p.values[ii].begin_token, (ii === (p.values.length - 1) ? p.end_token : p.values[ii].end_token), p.typ);
                                        pp.values.push(p.values[ii]);
                                        res.push(pp);
                                    }
                                    if (p.values[1].begin_token.previous !== null && p.values[1].begin_token.previous.end_char >= p.begin_token.begin_char) 
                                        p.end_token = p.values[1].begin_token.previous;
                                    p.values.splice(1, p.values.length - 1);
                                }
                                res.splice(res.length, 0, ...li);
                                li[li.length - 1].end_token = br.end_token;
                                tt = br.end_token.next;
                                continue;
                            }
                        }
                    }
                }
            }
            let p0 = PartToken.try_attach(tt, p, in_bracket, false);
            if (p0 === null && ((tt.is_value("В", null) || tt.is_value("К", null) || tt.is_value("ДО", null)))) 
                p0 = PartToken.try_attach(tt.next, p, in_bracket, false);
            if (p0 === null) {
                if (BracketHelper.is_bracket(tt, false)) {
                    let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        p0 = PartToken.try_attach(br.end_token.next, null, false, false);
                        if (p0 !== null && p0.typ !== PartTokenItemType.PREFIX && p0.values.length > 0) {
                            res[res.length - 1].end_token = br.end_token;
                            res[res.length - 1].name = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                            if (p0.is_newline_before) 
                                break;
                            p = p0;
                            res.push(p);
                            tt = p.end_token.next;
                            continue;
                        }
                        if (BracketHelper.is_bracket(tt, true) && (tt.whitespaces_before_count < 3) && res[res.length - 1].typ === PartTokenItemType.APPENDIX) {
                            res[res.length - 1].end_token = br.end_token;
                            res[res.length - 1].name = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                            tt = br.end_token.next;
                            continue;
                        }
                    }
                }
                if (tt.is_newline_before) {
                    if (res.length === 1 && res[0].is_newline_before) 
                        break;
                    if (tt.previous !== null && tt.previous.is_comma_and) {
                    }
                    else 
                        break;
                }
                if ((tt instanceof NumberToken) && delim) {
                    p0 = null;
                    if (p.typ === PartTokenItemType.CLAUSE || in_bracket) 
                        p0 = PartToken._new795(tt, tt, PartTokenItemType.CLAUSE);
                    else if (res.length > 1 && res[res.length - 2].typ === PartTokenItemType.CLAUSE && res[res.length - 1].typ === PartTokenItemType.PART) 
                        p0 = PartToken._new795(tt, tt, PartTokenItemType.CLAUSE);
                    else if ((res.length > 2 && res[res.length - 3].typ === PartTokenItemType.CLAUSE && res[res.length - 2].typ === PartTokenItemType.PART) && res[res.length - 1].typ === PartTokenItemType.ITEM) 
                        p0 = PartToken._new795(tt, tt, PartTokenItemType.CLAUSE);
                    else if (res.length > 0 && res[res.length - 1].values.length > 0 && res[res.length - 1].values[0].value.includes(".")) 
                        p0 = PartToken._new795(tt, tt, res[res.length - 1].typ);
                    if (p0 === null) 
                        break;
                    let vv = PartToken.PartValue._new1036(tt, tt, (tt).value.toString());
                    p0.values.push(vv);
                    vv.correct_value();
                    p0.end_token = vv.end_token;
                    tt = p0.end_token.next;
                    if (tt !== null && tt.is_hiphen && ((tt.next instanceof NumberToken))) {
                        tt = tt.next;
                        vv = PartToken.PartValue._new1036(tt, tt, (tt).value.toString());
                        vv.correct_value();
                        p0.values.push(vv);
                        p0.end_token = vv.end_token;
                        tt = p0.end_token.next;
                    }
                }
            }
            if (tt.is_char(',') && !tt.is_newline_after) {
                let p1 = PartToken.try_attach(tt.next, p, false, false);
                if (p1 !== null && PartToken._get_rank(p1.typ) > 0 && PartToken._get_rank(p.typ) > 0) {
                    if (PartToken._get_rank(p1.typ) < PartToken._get_rank(p.typ)) 
                        p0 = p1;
                }
            }
            if (p0 === null) 
                break;
            if (p0.is_newline_before && res.length === 1 && res[0].is_newline_before) 
                break;
            if (p0.typ === PartTokenItemType.ITEM && p.typ === PartTokenItemType.ITEM) {
                if (p0.alt_typ === PartTokenItemType.UNDEFINED && p.alt_typ === PartTokenItemType.SUBITEM) {
                    p.typ = PartTokenItemType.SUBITEM;
                    p.alt_typ = PartTokenItemType.UNDEFINED;
                }
                else if (p.alt_typ === PartTokenItemType.UNDEFINED && p0.alt_typ === PartTokenItemType.SUBITEM) {
                    p0.typ = PartTokenItemType.SUBITEM;
                    p0.alt_typ = PartTokenItemType.UNDEFINED;
                }
            }
            p = p0;
            res.push(p);
            tt = p.end_token.next;
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].typ === PartTokenItemType.PART && res[i + 1].typ === PartTokenItemType.PART && res[i].values.length > 1) {
                let v1 = res[i].values[res[i].values.length - 2].int_value;
                let v2 = res[i].values[res[i].values.length - 1].int_value;
                if (v1 === 0 || v2 === 0) 
                    continue;
                if ((v2 - v1) < 10) 
                    continue;
                let pt = PartToken._new795(res[i].end_token, res[i].end_token, PartTokenItemType.CLAUSE);
                pt.values.push(PartToken.PartValue._new1036(res[i].end_token, res[i].end_token, v2.toString()));
                res[i].values.splice(res[i].values.length - 1, 1);
                if (res[i].end_token !== res[i].begin_token) 
                    res[i].end_token = res[i].end_token.previous;
                res.splice(i + 1, 0, pt);
            }
        }
        if ((res.length === 1 && res[0].typ === PartTokenItemType.SUBPROGRAM && res[0].end_token.next !== null) && res[0].end_token.next.is_char('.')) 
            res[0].end_token = res[0].end_token.next;
        for (let i = res.length - 1; i >= 0; i--) {
            p = res[i];
            if (p.is_newline_after && p.is_newline_before && p.typ !== PartTokenItemType.SUBPROGRAM) {
                res.splice(i, res.length - i);
                continue;
            }
            if (((i === 0 && p.is_newline_before && p.has_terminator) && p.end_token.next !== null && p.end_token.next.is_char('.')) && MiscHelper.can_be_start_of_sentence(p.end_token.next.next)) {
                res.splice(i, 1);
                continue;
            }
        }
        return (res.length === 0 ? null : res);
    }
    
    can_be_next_narrow(p) {
        if (this.typ === p.typ) {
            if (this.typ !== PartTokenItemType.SUBITEM) 
                return false;
            if (p.values !== null && p.values.length > 0 && p.values[0].int_value === 0) {
                if (this.values !== null && this.values.length > 0 && this.values[0].int_value > 0) 
                    return true;
            }
            return false;
        }
        if (this.typ === PartTokenItemType.PART || p.typ === PartTokenItemType.PART) 
            return true;
        let i1 = PartToken._get_rank(this.typ);
        let i2 = PartToken._get_rank(p.typ);
        if (i1 >= 0 && i2 >= 0) 
            return i1 < i2;
        return false;
    }
    
    static is_part_before(t0) {
        if (t0 === null) 
            return false;
        let i = 0;
        for (let tt = t0.previous; tt !== null; tt = tt.previous) {
            if (tt.is_newline_after || ((tt instanceof ReferentToken))) 
                break;
            else {
                let st = PartToken.try_attach(tt, null, false, false);
                if (st !== null) {
                    if (st.end_token.next === t0) 
                        return true;
                    break;
                }
                if ((tt instanceof TextToken) && tt.chars.is_letter) {
                    if ((++i) > 2) 
                        break;
                }
            }
        }
        return false;
    }
    
    static _get_rank(t) {
        if (t === PartTokenItemType.DOCPART) 
            return 1;
        if (t === PartTokenItemType.APPENDIX) 
            return 1;
        if (t === PartTokenItemType.SECTION) 
            return 2;
        if (t === PartTokenItemType.SUBPROGRAM) 
            return 2;
        if (t === PartTokenItemType.SUBSECTION) 
            return 3;
        if (t === PartTokenItemType.CHAPTER) 
            return 4;
        if (t === PartTokenItemType.PREAMBLE) 
            return 5;
        if (t === PartTokenItemType.PARAGRAPH) 
            return 5;
        if (t === PartTokenItemType.SUBPARAGRAPH) 
            return 6;
        if (t === PartTokenItemType.PAGE) 
            return 6;
        if (t === PartTokenItemType.CLAUSE) 
            return 7;
        if (t === PartTokenItemType.PART) 
            return 8;
        if (t === PartTokenItemType.NOTICE) 
            return 8;
        if (t === PartTokenItemType.ITEM) 
            return 9;
        if (t === PartTokenItemType.SUBITEM) 
            return 10;
        if (t === PartTokenItemType.INDENTION) 
            return 11;
        if (t === PartTokenItemType.SUBINDENTION) 
            return 12;
        return 0;
    }
    
    static _get_attr_name_by_typ(_typ) {
        if (_typ === PartTokenItemType.CHAPTER) 
            return DecreePartReferent.ATTR_CHAPTER;
        if (_typ === PartTokenItemType.APPENDIX) 
            return DecreePartReferent.ATTR_APPENDIX;
        if (_typ === PartTokenItemType.CLAUSE) 
            return DecreePartReferent.ATTR_CLAUSE;
        if (_typ === PartTokenItemType.INDENTION) 
            return DecreePartReferent.ATTR_INDENTION;
        if (_typ === PartTokenItemType.ITEM) 
            return DecreePartReferent.ATTR_ITEM;
        if (_typ === PartTokenItemType.PARAGRAPH) 
            return DecreePartReferent.ATTR_PARAGRAPH;
        if (_typ === PartTokenItemType.SUBPARAGRAPH) 
            return DecreePartReferent.ATTR_SUBPARAGRAPH;
        if (_typ === PartTokenItemType.PART) 
            return DecreePartReferent.ATTR_PART;
        if (_typ === PartTokenItemType.SECTION) 
            return DecreePartReferent.ATTR_SECTION;
        if (_typ === PartTokenItemType.SUBSECTION) 
            return DecreePartReferent.ATTR_SUBSECTION;
        if (_typ === PartTokenItemType.SUBINDENTION) 
            return DecreePartReferent.ATTR_SUBINDENTION;
        if (_typ === PartTokenItemType.SUBITEM) 
            return DecreePartReferent.ATTR_SUBITEM;
        if (_typ === PartTokenItemType.PREAMBLE) 
            return DecreePartReferent.ATTR_PREAMBLE;
        if (_typ === PartTokenItemType.NOTICE) 
            return DecreePartReferent.ATTR_NOTICE;
        if (_typ === PartTokenItemType.SUBPROGRAM) 
            return DecreePartReferent.ATTR_SUBPROGRAM;
        if (_typ === PartTokenItemType.ADDAGREE) 
            return DecreePartReferent.ATTR_ADDAGREE;
        if (_typ === PartTokenItemType.DOCPART) 
            return DecreePartReferent.ATTR_DOCPART;
        if (_typ === PartTokenItemType.PAGE) 
            return DecreePartReferent.ATTR_PAGE;
        return null;
    }
    
    static _get_instr_kind_by_typ(_typ) {
        if (_typ === PartTokenItemType.CHAPTER) 
            return InstrumentKind.CHAPTER;
        if (_typ === PartTokenItemType.APPENDIX) 
            return InstrumentKind.APPENDIX;
        if (_typ === PartTokenItemType.CLAUSE) 
            return InstrumentKind.CLAUSE;
        if (_typ === PartTokenItemType.INDENTION) 
            return InstrumentKind.INDENTION;
        if (_typ === PartTokenItemType.ITEM) 
            return InstrumentKind.ITEM;
        if (_typ === PartTokenItemType.PARAGRAPH) 
            return InstrumentKind.PARAGRAPH;
        if (_typ === PartTokenItemType.SUBPARAGRAPH) 
            return InstrumentKind.SUBPARAGRAPH;
        if (_typ === PartTokenItemType.PART) 
            return InstrumentKind.CLAUSEPART;
        if (_typ === PartTokenItemType.SECTION) 
            return InstrumentKind.SECTION;
        if (_typ === PartTokenItemType.SUBSECTION) 
            return InstrumentKind.SUBSECTION;
        if (_typ === PartTokenItemType.SUBITEM) 
            return InstrumentKind.SUBITEM;
        if (_typ === PartTokenItemType.PREAMBLE) 
            return InstrumentKind.PREAMBLE;
        if (_typ === PartTokenItemType.NOTICE) 
            return InstrumentKind.NOTICE;
        if (_typ === PartTokenItemType.DOCPART) 
            return InstrumentKind.DOCPART;
        return InstrumentKind.UNDEFINED;
    }
    
    static _get_type_by_attr_name(_name) {
        if (_name === DecreePartReferent.ATTR_CHAPTER) 
            return PartTokenItemType.CHAPTER;
        if (_name === DecreePartReferent.ATTR_APPENDIX) 
            return PartTokenItemType.APPENDIX;
        if (_name === DecreePartReferent.ATTR_CLAUSE) 
            return PartTokenItemType.CLAUSE;
        if (_name === DecreePartReferent.ATTR_INDENTION) 
            return PartTokenItemType.INDENTION;
        if (_name === DecreePartReferent.ATTR_ITEM) 
            return PartTokenItemType.ITEM;
        if (_name === DecreePartReferent.ATTR_PARAGRAPH) 
            return PartTokenItemType.PARAGRAPH;
        if (_name === DecreePartReferent.ATTR_SUBPARAGRAPH) 
            return PartTokenItemType.SUBPARAGRAPH;
        if (_name === DecreePartReferent.ATTR_PART) 
            return PartTokenItemType.PART;
        if (_name === DecreePartReferent.ATTR_SECTION) 
            return PartTokenItemType.SECTION;
        if (_name === DecreePartReferent.ATTR_SUBSECTION) 
            return PartTokenItemType.SUBSECTION;
        if (_name === DecreePartReferent.ATTR_SUBINDENTION) 
            return PartTokenItemType.SUBINDENTION;
        if (_name === DecreePartReferent.ATTR_SUBITEM) 
            return PartTokenItemType.SUBITEM;
        if (_name === DecreePartReferent.ATTR_NOTICE) 
            return PartTokenItemType.NOTICE;
        if (_name === DecreePartReferent.ATTR_PREAMBLE) 
            return PartTokenItemType.PREAMBLE;
        if (_name === DecreePartReferent.ATTR_SUBPROGRAM) 
            return PartTokenItemType.SUBPROGRAM;
        if (_name === DecreePartReferent.ATTR_ADDAGREE) 
            return PartTokenItemType.ADDAGREE;
        if (_name === DecreePartReferent.ATTR_DOCPART) 
            return PartTokenItemType.DOCPART;
        return PartTokenItemType.PREFIX;
    }
    
    static try_create_between(p1, p2) {
        let not_eq_attr = null;
        let val1 = null;
        let val2 = null;
        for (const s1 of p1.slots) {
            if (p2.find_slot(s1.type_name, s1.value, true) !== null) 
                continue;
            else {
                if (not_eq_attr !== null) 
                    return null;
                val2 = p2.get_string_value(s1.type_name);
                if (val2 === null) 
                    return null;
                not_eq_attr = s1.type_name;
                val1 = Utils.asString(s1.value);
            }
        }
        if (val1 === null || val2 === null) 
            return null;
        let diap = NumberingHelper.create_diap(val1, val2);
        if (diap === null || (diap.length < 3)) 
            return null;
        let res = new Array();
        for (let i = 1; i < (diap.length - 1); i++) {
            let dpr = new DecreePartReferent();
            for (const s of p1.slots) {
                let val = s.value;
                if (s.type_name === not_eq_attr) 
                    val = diap[i];
                dpr.add_slot(s.type_name, val, false, 0);
            }
            res.push(dpr);
        }
        return res;
    }
    
    static get_number(str) {
        if (Utils.isNullOrEmpty(str)) 
            return 0;
        let i = 0;
        let wrapi1093 = new RefOutArgWrapper();
        let inoutres1094 = Utils.tryParseInt(str, wrapi1093);
        i = wrapi1093.value;
        if (inoutres1094) 
            return i;
        if (!Utils.isLetter(str[0])) 
            return 0;
        let ch = str[0].toUpperCase();
        if ((ch.charCodeAt(0)) < 0x80) {
            i = ((ch.charCodeAt(0)) - ('A'.charCodeAt(0))) + 1;
            if ((ch === 'Z' && str.length > 2 && str[1] === '.') && Utils.isDigit(str[2])) {
                let n = 0;
                let wrapn1089 = new RefOutArgWrapper();
                let inoutres1090 = Utils.tryParseInt(str.substring(2), wrapn1089);
                n = wrapn1089.value;
                if (inoutres1090) 
                    i += n;
            }
        }
        else if (LanguageHelper.is_cyrillic_char(ch)) {
            i = PartToken.ru_nums.indexOf(ch);
            if (i < 0) 
                return 0;
            i++;
            if ((ch === 'Я' && str.length > 2 && str[1] === '.') && Utils.isDigit(str[2])) {
                let n = 0;
                let wrapn1091 = new RefOutArgWrapper();
                let inoutres1092 = Utils.tryParseInt(str.substring(2), wrapn1091);
                n = wrapn1091.value;
                if (inoutres1092) 
                    i += n;
            }
        }
        if (i < 0) 
            return 0;
        return i;
    }
    
    static _new795(_arg1, _arg2, _arg3) {
        let res = new PartToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new1039(_arg1, _arg2, _arg3, _arg4) {
        let res = new PartToken(_arg1, _arg2);
        res.typ = _arg3;
        res.is_doubt = _arg4;
        return res;
    }
    
    static _new1065(_arg1, _arg2, _arg3, _arg4) {
        let res = new PartToken(_arg1, _arg2);
        res.typ = _arg3;
        res.alt_typ = _arg4;
        return res;
    }
    
    static static_constructor() {
        PartToken.ru_nums = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ";
    }
}


PartToken.PartValue = class  extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.value = null;
    }
    
    get source_value() {
        const MetaToken = require("./../../MetaToken");
        let t0 = this.begin_token;
        let t1 = this.end_token;
        if (t1.is_char('.')) 
            t1 = t1.previous;
        else if (t1.is_char(')') && !t0.is_char('(')) 
            t1 = t1.previous;
        return (new MetaToken(t0, t1)).get_source_text();
    }
    
    get int_value() {
        if (Utils.isNullOrEmpty(this.value)) 
            return 0;
        let num = 0;
        let wrapnum1032 = new RefOutArgWrapper();
        let inoutres1033 = Utils.tryParseInt(this.value, wrapnum1032);
        num = wrapnum1032.value;
        if (inoutres1033) 
            return num;
        return 0;
    }
    
    toString() {
        return this.value;
    }
    
    correct_value() {
        const NumberToken = require("./../../NumberToken");
        const DecreeReferent = require("./../DecreeReferent");
        const TextToken = require("./../../TextToken");
        const BracketHelper = require("./../../core/BracketHelper");
        if ((this.end_token.next instanceof TextToken) && (this.end_token.next).length_char === 1 && this.end_token.next.chars.is_letter) {
            if (!this.end_token.is_whitespace_after) {
                this.value += (this.end_token.next).term;
                this.end_token = this.end_token.next;
            }
            else if ((this.end_token.whitespaces_after_count < 2) && this.end_token.next.next !== null && this.end_token.next.next.is_char(')')) {
                this.value += (this.end_token.next).term;
                this.end_token = this.end_token.next.next;
            }
        }
        if ((BracketHelper.can_be_start_of_sequence(this.end_token.next, false, false) && (this.end_token.next.next instanceof TextToken) && this.end_token.next.next.length_char === 1) && BracketHelper.can_be_end_of_sequence(this.end_token.next.next.next, false, this.end_token.next, false)) {
            this.value = (this.value + "." + (this.end_token.next.next).term);
            this.end_token = this.end_token.next.next.next;
        }
        for (let t = this.end_token.next; t !== null; t = t.next) {
            if (t.is_whitespace_before) {
                if (t.whitespaces_before_count > 1) 
                    break;
                if (((t instanceof TextToken) && t.length_char === 1 && t.next !== null) && t.next.is_char(')')) {
                    this.value = (((this.value != null ? this.value : "")) + "." + (t).term);
                    this.end_token = (t = t.next);
                }
                break;
            }
            if (t.is_char_of("_.") && !t.is_whitespace_after) {
                if (t.next instanceof NumberToken) {
                    this.value = (((this.value != null ? this.value : "")) + "." + (t.next).value);
                    this.end_token = (t = t.next);
                    continue;
                }
                if (((t.next !== null && t.next.is_char('(') && (t.next.next instanceof NumberToken)) && !t.next.is_whitespace_after && t.next.next.next !== null) && t.next.next.next.is_char(')')) {
                    this.value = (((this.value != null ? this.value : "")) + "." + (t.next.next).value);
                    this.end_token = t.next.next.next;
                    continue;
                }
            }
            if ((t.is_hiphen && !t.is_whitespace_after && (t.next instanceof NumberToken)) && (t.next).int_value !== null) {
                let n1 = 0;
                let wrapn11034 = new RefOutArgWrapper();
                let inoutres1035 = Utils.tryParseInt(this.value, wrapn11034);
                n1 = wrapn11034.value;
                if (inoutres1035) {
                    if (n1 >= (t.next).int_value) {
                        this.value = (((this.value != null ? this.value : "")) + "." + (t.next).value);
                        this.end_token = (t = t.next);
                        continue;
                    }
                }
            }
            if ((t.is_char_of("(<") && (t.next instanceof NumberToken) && t.next.next !== null) && t.next.next.is_char_of(")>")) {
                this.value = (((this.value != null ? this.value : "")) + "." + (t.next).value);
                this.end_token = (t = t.next.next);
                if (t.next !== null && t.next.is_char('.') && !t.is_whitespace_after) 
                    t = t.next;
                continue;
            }
            break;
        }
        if (this.end_token.next !== null && this.end_token.next.is_char_of(".") && !this.end_token.is_whitespace_after) {
            if (this.end_token.next.next !== null && (this.end_token.next.next.get_referent() instanceof DecreeReferent) && !this.end_token.next.is_newline_after) 
                this.end_token = this.end_token.next;
        }
        if (this.begin_token === this.end_token && this.end_token.next !== null && this.end_token.next.is_char(')')) {
            let ok = true;
            let lev = 0;
            for (let ttt = this.begin_token.previous; ttt !== null; ttt = ttt.previous) {
                if (ttt.is_newline_after) 
                    break;
                if (ttt.is_char(')')) 
                    lev++;
                else if (ttt.is_char('(')) {
                    lev--;
                    if (lev < 0) {
                        ok = false;
                        break;
                    }
                }
            }
            if (ok) {
                let tt = this.end_token.next.next;
                if (tt !== null) {
                    if ((tt.get_referent() instanceof DecreeReferent) || PartToken.try_attach(tt, null, false, false) !== null) 
                        this.end_token = this.end_token.next;
                }
            }
        }
    }
    
    static _new1036(_arg1, _arg2, _arg3) {
        let res = new PartToken.PartValue(_arg1, _arg2);
        res.value = _arg3;
        return res;
    }
}


PartToken.static_constructor();

module.exports = PartToken