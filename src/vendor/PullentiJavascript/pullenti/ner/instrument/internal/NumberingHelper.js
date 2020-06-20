/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const ReferentToken = require("./../../ReferentToken");
const NumberSpellingType = require("./../../NumberSpellingType");
const TextToken = require("./../../TextToken");
const NumberToken = require("./../../NumberToken");
const NumberHelper = require("./../../core/NumberHelper");
const NumberTypes = require("./NumberTypes");
const InstrToken1StdTitleType = require("./InstrToken1StdTitleType");
const InstrumentKind = require("./../InstrumentKind");
const InstrToken1Types = require("./InstrToken1Types");

/**
 * Поддержка анализа нумерации
 */
class NumberingHelper {
    
    /**
     * Разница между двумя номерами
     * @param prev 
     * @param next 
     * @param can_sub_numbers может быть 1. - 1.1 - 2.
     * @return больше 0 - отличаются на это число, 0 не стыкуются
     */
    static calc_delta(prev, next, can_sub_numbers) {
        let n1 = prev.last_number;
        let n2 = next.last_number;
        if (next.last_min_number > 0) 
            n2 = next.last_min_number;
        if (prev.numbers.length === next.numbers.length) {
            if (prev.typ_container_rank > 0 && prev.typ_container_rank === next.typ_container_rank) {
            }
            else if (prev.num_typ === next.num_typ) {
            }
            else 
                return 0;
            if (prev.numbers.length > 1) {
                for (let i = 0; i < (prev.numbers.length - 1); i++) {
                    if (prev.numbers[i] !== next.numbers[i]) 
                        return 0;
                }
            }
            if (n1 >= n2) 
                return 0;
            return n2 - n1;
        }
        if (!can_sub_numbers) 
            return 0;
        if ((prev.numbers.length + 1) === next.numbers.length && next.numbers.length > 0) {
            if (prev.typ_container_rank > 0 && prev.typ_container_rank === next.typ_container_rank) {
            }
            else if (prev.num_typ === NumberTypes.DIGIT && next.num_typ === NumberTypes.TWODIGITS) {
            }
            else if (prev.num_typ === NumberTypes.TWODIGITS && next.num_typ === NumberTypes.THREEDIGITS) {
            }
            else if (prev.num_typ === NumberTypes.THREEDIGITS && next.num_typ === NumberTypes.FOURDIGITS) {
            }
            else if (prev.num_typ === NumberTypes.LETTER && next.num_typ === NumberTypes.TWODIGITS && Utils.isLetter(next.numbers[0][0])) {
            }
            else 
                return 0;
            for (let i = 0; i < prev.numbers.length; i++) {
                if (prev.numbers[i] !== next.numbers[i]) 
                    return 0;
            }
            return n2;
        }
        if ((prev.numbers.length - 1) === next.numbers.length && prev.numbers.length > 1) {
            if (prev.typ_container_rank > 0 && prev.typ_container_rank === next.typ_container_rank) {
            }
            else if (prev.num_typ === NumberTypes.TWODIGITS) {
                if (next.num_typ === NumberTypes.DIGIT) {
                }
                else if (next.num_typ === NumberTypes.LETTER && Utils.isLetter(prev.numbers[0][0])) {
                }
            }
            else if (prev.num_typ === NumberTypes.THREEDIGITS && next.num_typ === NumberTypes.TWODIGITS) {
            }
            else if (prev.num_typ === NumberTypes.FOURDIGITS && next.num_typ === NumberTypes.THREEDIGITS) {
            }
            else 
                return 0;
            for (let i = 0; i < (prev.numbers.length - 2); i++) {
                if (prev.numbers[i] !== next.numbers[i]) 
                    return 0;
            }
            let wrapn11550 = new RefOutArgWrapper();
            let inoutres1551 = Utils.tryParseInt(prev.numbers[prev.numbers.length - 2], wrapn11550);
            n1 = wrapn11550.value;
            if (!inoutres1551) {
                if (prev.numbers.length === 2) 
                    n1 = prev.first_number;
                else 
                    return 0;
            }
            if ((n1 + 1) !== n2) 
                return 0;
            return n2 - n1;
        }
        if ((prev.numbers.length - 2) === next.numbers.length && prev.numbers.length > 2) {
            if (prev.typ_container_rank > 0 && prev.typ_container_rank === next.typ_container_rank) {
            }
            else if (prev.num_typ === NumberTypes.THREEDIGITS && next.num_typ === NumberTypes.DIGIT) {
            }
            else if (prev.num_typ === NumberTypes.FOURDIGITS && next.num_typ === NumberTypes.TWODIGITS) {
            }
            else 
                return 0;
            for (let i = 0; i < (prev.numbers.length - 3); i++) {
                if (prev.numbers[i] !== next.numbers[i]) 
                    return 0;
            }
            let wrapn11552 = new RefOutArgWrapper();
            let inoutres1553 = Utils.tryParseInt(prev.numbers[prev.numbers.length - 3], wrapn11552);
            n1 = wrapn11552.value;
            if (!inoutres1553) 
                return 0;
            if ((n1 + 1) !== n2) 
                return 0;
            return n2 - n1;
        }
        if ((prev.numbers.length - 3) === next.numbers.length && prev.numbers.length > 3) {
            if (prev.typ_container_rank > 0 && prev.typ_container_rank === next.typ_container_rank) {
            }
            else if (prev.num_typ === NumberTypes.FOURDIGITS && next.num_typ === NumberTypes.DIGIT) {
            }
            else 
                return 0;
            for (let i = 0; i < (prev.numbers.length - 4); i++) {
                if (prev.numbers[i] !== next.numbers[i]) 
                    return 0;
            }
            let wrapn11554 = new RefOutArgWrapper();
            let inoutres1555 = Utils.tryParseInt(prev.numbers[prev.numbers.length - 4], wrapn11554);
            n1 = wrapn11554.value;
            if (!inoutres1555) 
                return 0;
            if ((n1 + 1) !== n2) 
                return 0;
            return n2 - n1;
        }
        return 0;
    }
    
    /**
     * Выделить базовую верхоуровневую последовательность номеров (строк, содержащих номера)
     * @param lines исходные строки
     * @param check_spec_texts проверять ли строки на мусор
     * @param can_sub_numbers могут ли быть подномера типа 1. - 1.1 - 2.
     * @return null если не нашли или последовательность строк с номерами
     */
    static extract_main_sequence(lines, check_spec_texts, can_sub_numbers) {
        let res = null;
        let many_spec_char_lines = 0;
        for (let i = 0; i < lines.length; i++) {
            let li = lines[i];
            if (li.all_upper && li.title_typ !== InstrToken1StdTitleType.UNDEFINED) {
                if (res !== null && res.length > 0 && res[res.length - 1].tag === null) 
                    res[res.length - 1].tag = li;
            }
            if (li.numbers.length === 0) 
                continue;
            if (li.last_number === 901) {
            }
            if (li.num_typ === NumberTypes.LETTER) {
            }
            if (li.typ !== InstrToken1Types.LINE) 
                continue;
            if (res === null) {
                res = new Array();
                if (li.numbers.length === 1 && li.numbers[0] === "1" && li.num_typ === NumberTypes.DIGIT) {
                    if ((((i + 1) < lines.length) && lines[i + 1].numbers.length === 1 && lines[i + 1].numbers[0] === "1") && lines[i + 1].num_typ === NumberTypes.DIGIT) {
                        for (let ii = i + 2; ii < lines.length; ii++) {
                            if (lines[ii].num_typ === NumberTypes.ROMAN && lines[ii].numbers.length > 0) {
                                if (lines[ii].numbers[0] === "2") 
                                    li.num_typ = NumberTypes.ROMAN;
                                break;
                            }
                        }
                    }
                }
            }
            else {
                if (res[0].num_suffix !== null) {
                    if (li.num_suffix !== null && li.num_suffix !== res[0].num_suffix) 
                        continue;
                }
                if (res[0].numbers.length !== li.numbers.length) {
                    if (li.begin_token.previous !== null && li.begin_token.previous.is_char(':')) 
                        continue;
                    if (res[0].num_suffix === null || NumberingHelper.calc_delta(res[res.length - 1], li, true) !== 1) 
                        continue;
                    if (!can_sub_numbers) {
                        if (((i + 1) < lines.length) && NumberingHelper.calc_delta(res[res.length - 1], lines[i + 1], false) === 1 && NumberingHelper.calc_delta(li, lines[i + 1], true) === 1) {
                        }
                        else 
                            continue;
                    }
                }
                else {
                    if (res[0].num_typ === NumberTypes.ROMAN && li.num_typ !== NumberTypes.ROMAN) 
                        continue;
                    if (res[0].num_typ !== NumberTypes.ROMAN && li.num_typ === NumberTypes.ROMAN) {
                        if (li.numbers.length === 1 && li.numbers[0] === "1" && res.length === 1) {
                            res.splice(0, res.length);
                            res.push(li);
                            continue;
                        }
                        continue;
                    }
                    if (res[0].num_typ !== NumberTypes.LETTER && li.num_typ === NumberTypes.LETTER) 
                        continue;
                }
            }
            res.push(li);
            if (li.has_many_spec_chars) 
                many_spec_char_lines++;
        }
        if (res === null) 
            return null;
        if (check_spec_texts) {
            if (many_spec_char_lines > (Utils.intDiv(res.length, 2))) 
                return null;
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (NumberingHelper.calc_delta(res[i], res[i + 1], false) === 2) {
                let ii0 = lines.indexOf(res[i]);
                let ii1 = lines.indexOf(res[i + 1], ii0);
                for (let j = ii0 + 1; j < ii1; j++) {
                    if (lines[j].numbers.length > 0) {
                        if (NumberingHelper.calc_delta(res[i], lines[j], true) === 1 && NumberingHelper.calc_delta(lines[j], res[i + 1], true) === 1) {
                            res.splice(i + 1, 0, lines[j]);
                            break;
                        }
                    }
                }
            }
        }
        let ch = true;
        while (ch) {
            ch = false;
            for (let i = 1; i < res.length; i++) {
                let d = NumberingHelper.calc_delta(res[i - 1], res[i], false);
                if (res[i - 1].num_suffix === res[i].num_suffix) {
                    if (d === 1) 
                        continue;
                    if (((d > 1 && (d < 20))) || ((d === 0 && res[i - 1].num_typ === res[i].num_typ && res[i - 1].numbers.length === res[i].numbers.length))) {
                        if (NumberingHelper.calc_delta(res[i], res[i - 1], false) > 0) {
                            if (res[i - 1].tag !== null && i > 2) {
                                res.splice(i, res.length - i);
                                ch = true;
                                i--;
                                continue;
                            }
                        }
                        if ((i + 1) < res.length) {
                            let dd = NumberingHelper.calc_delta(res[i], res[i + 1], false);
                            if (dd === 1) {
                                if (res[i].last_number === 1 && res[i].numbers.length === res[i - 1].numbers.length) {
                                }
                                else 
                                    continue;
                            }
                            else {
                                dd = NumberingHelper.calc_delta(res[i - 1], res[i + 1], false);
                                if (dd === 1) {
                                    res.splice(i, 1);
                                    i--;
                                    ch = true;
                                    continue;
                                }
                            }
                        }
                        else if (d > 3) {
                            res.splice(i, 1);
                            i--;
                            ch = true;
                            continue;
                        }
                        else 
                            continue;
                    }
                }
                let j = 0;
                for (j = i + 1; j < res.length; j++) {
                    let dd = NumberingHelper.calc_delta(res[j - 1], res[j], false);
                    if (dd !== 1 && dd !== 2) 
                        break;
                    if (res[j - 1].num_suffix !== res[j].num_suffix) 
                        break;
                }
                if ((d === 0 && NumberingHelper.calc_delta(res[i - 1], res[i], true) === 1 && res[i - 1].num_suffix !== null) && res[i].num_suffix === res[i - 1].num_suffix) 
                    d = 1;
                if (d !== 1 && j > (i + 1)) {
                    res.splice(i, j - i);
                    i--;
                    ch = true;
                    continue;
                }
                if (d === 1) {
                    if ((i + 1) >= res.length) 
                        continue;
                    let dd = NumberingHelper.calc_delta(res[i], res[i + 1], false);
                    if (dd === 1 && res[i - 1].num_suffix === res[i + 1].num_suffix) {
                        if (res[i].num_suffix !== res[i - 1].num_suffix) {
                            res[i].num_suffix = res[i - 1].num_suffix;
                            res[i].is_num_doubt = false;
                            ch = true;
                        }
                        continue;
                    }
                }
                if ((i + 1) < res.length) {
                    let dd = NumberingHelper.calc_delta(res[i - 1], res[i + 1], false);
                    if (dd === 1 && res[i - 1].num_suffix === res[i + 1].num_suffix) {
                        if (d === 1 && NumberingHelper.calc_delta(res[i], res[i + 1], true) === 1) {
                        }
                        else {
                            res.splice(i, 1);
                            ch = true;
                            continue;
                        }
                    }
                }
                else if (d === 0 || d > 10 || res[i - 1].num_suffix !== res[i].num_suffix) {
                    res.splice(i, 1);
                    ch = true;
                    continue;
                }
            }
        }
        let has_suf = 0;
        for (const r of res) {
            if ((r.num_suffix !== null || r.typ_container_rank > 0 || r.numbers.length > 1) || r.all_upper || r.num_typ === NumberTypes.ROMAN) 
                has_suf++;
        }
        if (has_suf === 0) {
            if (res.length < 5) 
                return null;
        }
        if (res.length >= 2) {
            if (res[0] !== lines[0]) {
                let tot = res[0].begin_token.begin_char - lines[0].begin_token.begin_char;
                tot += (lines[lines.length - 1].end_token.end_char - res[res.length - 1].end_token.end_char);
                let blk = res[res.length - 1].end_token.end_char - res[0].begin_token.begin_char;
                let i = lines.indexOf(res[res.length - 1]);
                if (i > 0) {
                    let lines1 = Array.from(lines);
                    lines1.splice(0, i + 1);
                    let res1 = NumberingHelper.extract_main_sequence(lines1, check_spec_texts, can_sub_numbers);
                    if (res1 !== null && res1.length > 2) 
                        blk += (res1[res1.length - 1].end_char - res1[0].begin_char);
                }
                if ((blk * 3) < tot) {
                    if ((blk * 5) < tot) 
                        return null;
                    for (const r of res) {
                        if (!r.all_upper && !r.has_changes) 
                            return null;
                    }
                }
            }
            if (res[0].last_number === 1 && res[0].numbers.length === 1) {
                let res0 = new Array();
                res0.push(res[0]);
                let i = 0;
                for (i = 1; i < res.length; i++) {
                    let j = 0;
                    for (j = i + 1; j < res.length; j++) {
                        if (res[j].last_number === 1 && res[j].numbers.length === 1) 
                            break;
                    }
                    if ((j - i) < 3) 
                        break;
                    j--;
                    let jj = 0;
                    let errs = 0;
                    for (jj = i + 1; jj < j; jj++) {
                        let d = NumberingHelper.calc_delta(res[jj - 1], res[jj], false);
                        if (d === 1) {
                        }
                        else if (d > 1 && (d < 3)) 
                            errs++;
                        else 
                            break;
                    }
                    if ((jj < j) || errs > 1) 
                        break;
                    if (j < (res.length - 1)) {
                        if (NumberingHelper.calc_delta(res0[res0.length - 1], res[j], false) !== 1) 
                            break;
                        res0.push(res[j]);
                    }
                    i = j;
                }
                if (i >= res.length && res0.length > 1) 
                    return res0;
            }
            if (res.length > 500) 
                return null;
            return res;
        }
        if (res.length === 1 && lines[0] === res[0]) {
            if (has_suf > 0) 
                return res;
            if (lines.length > 1 && lines[1].numbers.length === (lines[0].numbers.length + 1)) {
                for (let i = 0; i < lines[0].numbers.length; i++) {
                    if (lines[1].numbers[i] !== lines[0].numbers[i]) 
                        return null;
                }
                return res;
            }
        }
        return null;
    }
    
    /**
     * Создать результирующий узел, представляющий номер
     * @param owner 
     * @param itok 
     */
    static create_number(owner, itok) {
        const PartToken = require("./../../decree/internal/PartToken");
        const FragToken = require("./FragToken");
        if (itok.num_begin_token === null || itok.num_end_token === null) 
            return;
        let num = FragToken._new1556(itok.num_begin_token, itok.num_end_token, InstrumentKind.NUMBER, true, itok);
        owner.children.push(num);
        if (itok.num_typ === NumberTypes.TWODIGITS) {
            owner.number = itok.first_number;
            owner.sub_number = itok.last_number;
        }
        else if (itok.num_typ === NumberTypes.THREEDIGITS) {
            owner.number = itok.first_number;
            owner.sub_number = itok.middle_number;
            owner.sub_number2 = itok.last_number;
        }
        else if (itok.num_typ === NumberTypes.FOURDIGITS && itok.numbers.length === 4) {
            owner.number = itok.first_number;
            owner.sub_number = PartToken.get_number(itok.numbers[1]);
            owner.sub_number2 = PartToken.get_number(itok.numbers[2]);
            owner.sub_number3 = itok.last_number;
        }
        else 
            owner.number = itok.last_number;
        owner.min_number = itok.last_min_number;
        owner.itok = itok;
    }
    
    /**
     * Распарсить нумерацию
     * @param t 
     * @param res 
     */
    static parse_number(t, res, prev) {
        const InstrToken1 = require("./InstrToken1");
        NumberingHelper._parse_number(t, res, prev);
        if ((res.numbers.length > 0 && res.num_end_token !== null && !res.is_newline_after) && res.num_end_token.next !== null && res.num_end_token.next.is_hiphen) {
            let res1 = new InstrToken1(res.num_end_token.next.next, res.num_end_token.next.next);
            NumberingHelper._parse_number(res1.begin_token, res1, res);
            if (res1.numbers.length === res.numbers.length) {
                let i = 0;
                for (i = 0; i < (res.numbers.length - 1); i++) {
                    if (res.numbers[i] !== res1.numbers[i]) 
                        break;
                }
                if (i >= (res.numbers.length - 1) && (res.last_number < res1.last_number) && res1.num_end_token !== null) {
                    res.min_number = res.numbers[res.numbers.length - 1];
                    res.numbers[res.numbers.length - 1] = res1.numbers[res.numbers.length - 1];
                    res.num_suffix = res1.num_suffix;
                    res.end_token = (res.num_end_token = res1.num_end_token);
                }
            }
        }
        if (res.numbers.length > 0 && res.num_end_token !== null && res.typ === InstrToken1Types.LINE) {
            let tt = res.num_end_token;
            let ok = true;
            if (tt.next !== null && tt.next.is_hiphen) 
                ok = false;
            else if (!tt.is_whitespace_after) {
                if (tt.next !== null && ((tt.next.chars.is_capital_upper || tt.next.chars.is_all_upper || (tt.next instanceof ReferentToken)))) {
                }
                else 
                    ok = false;
            }
            if (!ok) {
                res.numbers.splice(0, res.numbers.length);
                res.num_end_token = (res.num_begin_token = null);
            }
        }
    }
    
    static _parse_number(t, res, prev) {
        const InstrToken1 = require("./InstrToken1");
        if (((t instanceof NumberToken) && (t).int_value !== null && (t).typ === NumberSpellingType.DIGIT) && ((t).int_value < 3000)) {
            if (res.numbers.length >= 4) {
            }
            if (t.morph.class0.is_adjective && res.typ_container_rank === 0) 
                return;
            let nwp = NumberHelper.try_parse_number_with_postfix(t);
            if (nwp !== null) {
                if (nwp.end_token.is_whitespace_before) {
                }
                else 
                    return;
            }
            if ((t.next !== null && (t.whitespaces_after_count < 3) && t.next.chars.is_letter) && t.next.chars.is_all_lower) {
                if (!t.is_whitespace_after && t.next.length_char === 1) {
                }
                else if (res.numbers.length === 0) {
                    res.num_typ = NumberTypes.DIGIT;
                    res.numbers.push((t).value.toString());
                    res.num_begin_token = (res.num_end_token = res.end_token = t);
                    return;
                }
                else 
                    return;
            }
            if (res.num_typ === NumberTypes.UNDEFINED) 
                res.num_typ = NumberTypes.DIGIT;
            else 
                res.num_typ = NumberTypes.COMBO;
            if (res.numbers.length > 0 && t.is_whitespace_before) 
                return;
            if (res.numbers.length === 0) 
                res.num_begin_token = t;
            if ((t.next !== null && t.next.is_hiphen && (t.next.next instanceof NumberToken)) && (t.next.next).int_value !== null && (t.next.next).int_value > (t).int_value) {
                res.min_number = (t).value.toString();
                t = t.next.next;
            }
            else if (((t.next !== null && t.next.is_char_of(")") && t.next.next !== null) && t.next.next.is_hiphen && (t.next.next.next instanceof NumberToken)) && (t.next.next.next).int_value !== null && (t.next.next.next).int_value > (t).int_value) {
                res.min_number = (t).value.toString();
                t = t.next.next.next;
            }
            res.numbers.push((t).value.toString());
            res.end_token = (res.num_end_token = t);
            res.num_suffix = null;
            for (let ttt = t.next; ttt !== null && (res.numbers.length < 4); ttt = ttt.next) {
                let ok1 = false;
                let ok2 = false;
                if ((ttt.is_char_of("._") && !ttt.is_whitespace_after && (ttt.next instanceof NumberToken)) && (((ttt.next).typ === NumberSpellingType.DIGIT || ((((ttt.next).typ === NumberSpellingType.WORDS)) && ttt.next.chars.is_latin_letter && !ttt.is_whitespace_after)))) 
                    ok1 = true;
                else if ((ttt.is_char_of("(<") && (ttt.next instanceof NumberToken) && ttt.next.next !== null) && ttt.next.next.is_char_of(")>")) 
                    ok2 = true;
                if (ok1 || ok2) {
                    ttt = ttt.next;
                    res.numbers.push((ttt).value.toString());
                    res.num_typ = (res.numbers.length === 2 ? NumberTypes.TWODIGITS : ((res.numbers.length === 3 ? NumberTypes.THREEDIGITS : NumberTypes.FOURDIGITS)));
                    if ((ttt.next !== null && ttt.next.is_char_of(")>") && ttt.next.next !== null) && ttt.next.next.is_char('.')) 
                        ttt = ttt.next;
                    else if (ok2) 
                        ttt = ttt.next;
                    t = res.end_token = (res.num_end_token = ttt);
                    continue;
                }
                if (((ttt instanceof TextToken) && ttt.length_char === 1 && ttt.chars.is_letter) && !ttt.is_whitespace_before && res.numbers.length === 1) {
                    res.numbers.push((ttt).term);
                    res.num_typ = NumberTypes.COMBO;
                    t = res.end_token = (res.num_end_token = ttt);
                    continue;
                }
                break;
            }
            if (t.next !== null && t.next.is_char_of(").")) {
                res.num_suffix = t.next.get_source_text();
                t = res.end_token = (res.num_end_token = t.next);
            }
            return;
        }
        if (((t instanceof NumberToken) && (t).typ === NumberSpellingType.WORDS && res.typ_container_rank > 0) && res.numbers.length === 0) {
            res.numbers.push((t).value.toString());
            res.num_typ = NumberTypes.DIGIT;
            res.num_begin_token = t;
            if (t.next !== null && t.next.is_char('.')) {
                t = t.next;
                res.num_suffix = ".";
            }
            res.end_token = (res.num_end_token = t);
            return;
        }
        let nt = NumberHelper.try_parse_roman(t);
        if ((nt !== null && nt.value === "10" && t.next !== null) && t.next.is_char(')')) 
            nt = null;
        if (nt !== null && nt.value === "100") 
            nt = null;
        if (nt !== null && nt.typ === NumberSpellingType.ROMAN) {
            if (res.num_typ === NumberTypes.UNDEFINED) 
                res.num_typ = NumberTypes.ROMAN;
            else 
                res.num_typ = NumberTypes.COMBO;
            if (res.numbers.length > 0 && t.is_whitespace_before) 
                return;
            if (res.numbers.length === 0) 
                res.num_begin_token = t;
            res.numbers.push(nt.value.toString());
            t = res.end_token = (res.num_end_token = nt.end_token);
            if (res.num_typ === NumberTypes.ROMAN && ((res.typ === InstrToken1Types.CHAPTER || res.typ === InstrToken1Types.SECTION || res.typ === InstrToken1Types.LINE))) {
                if ((t.next !== null && t.next.is_char_of("._<") && (t.next.next instanceof NumberToken)) && (t.next.next).typ === NumberSpellingType.DIGIT) {
                    t = t.next.next;
                    res.numbers.push((t).value.toString());
                    res.num_typ = NumberTypes.TWODIGITS;
                    if (t.next !== null && t.next.is_char('>')) 
                        t = t.next;
                    res.end_token = (res.num_end_token = t);
                    if ((t.next !== null && t.next.is_char_of("._<") && (t.next.next instanceof NumberToken)) && (t.next.next).typ === NumberSpellingType.DIGIT) {
                        t = t.next.next;
                        res.numbers.push((t).value.toString());
                        res.num_typ = NumberTypes.THREEDIGITS;
                        if (t.next !== null && t.next.is_char('>')) 
                            t = t.next;
                        res.end_token = (res.num_end_token = t);
                    }
                }
            }
            if (t.next !== null && t.next.is_char_of(").")) {
                res.num_suffix = t.next.get_source_text();
                t = res.end_token = (res.num_end_token = t.next);
            }
            return;
        }
        if (((t instanceof TextToken) && t.length_char === 1 && t.chars.is_letter) && t === res.begin_token) {
            if ((!t.is_whitespace_after && (t.next instanceof NumberToken) && t.next.next !== null) && t.next.next.is_char('.')) {
                res.num_begin_token = t;
                res.num_typ = NumberTypes.DIGIT;
                res.numbers.push((t.next).value.toString());
                res.num_suffix = (t).term + ".";
                t = res.end_token = (res.num_end_token = t.next.next);
                return;
            }
            if (t.next !== null && t.next.is_char_of(".)")) {
                if (((t.next.is_char('.') && (t.next.next instanceof NumberToken) && t.next.next.next !== null) && t.next.next.next.is_char(')') && !t.next.is_whitespace_after) && !t.next.next.is_whitespace_after) {
                    res.num_typ = NumberTypes.TWODIGITS;
                    res.numbers.push((t).term);
                    res.numbers.push((t.next.next).value.toString());
                    res.num_suffix = ")";
                    res.num_begin_token = t;
                    t = res.end_token = (res.num_end_token = t.next.next.next);
                    return;
                }
                if (t.next.is_char('.') && ((t.chars.is_all_upper || (t.next.next instanceof NumberToken)))) {
                }
                else {
                    let tmp1 = new InstrToken1(t, t.next);
                    tmp1.numbers.push((t).term);
                    if (tmp1.last_number > 1 && t.next.is_char_of(".") && ((prev === null || (prev.last_number + 1) !== tmp1.last_number))) {
                    }
                    else {
                        if (res.numbers.length === 0) 
                            res.num_begin_token = t;
                        res.num_typ = NumberTypes.LETTER;
                        res.numbers.push((t).term);
                        res.num_begin_token = t;
                        t = res.end_token = (res.num_end_token = t.next);
                        res.num_suffix = t.get_source_text();
                        return;
                    }
                }
            }
        }
    }
    
    static correct_child_numbers(root, children) {
        let has_num = false;
        if (root.number > 0) {
            for (const ch of root.children) {
                if (ch.kind === InstrumentKind.NUMBER) {
                    has_num = true;
                    break;
                }
                else if (ch.kind !== InstrumentKind.KEYWORD) 
                    break;
            }
        }
        if (!has_num) 
            return false;
        if (root.sub_number === 0) {
            let ok = true;
            for (const ch of children) {
                if (ch.number > 0) {
                    if (ch.number === root.number && ch.sub_number > 0) {
                    }
                    else 
                        ok = false;
                }
            }
            if (ok) {
                for (const ch of children) {
                    if (ch.number > 0) {
                        ch.number = ch.sub_number;
                        ch.sub_number = ch.sub_number2;
                        ch.sub_number2 = ch.sub_number3;
                        ch.sub_number3 = 0;
                    }
                }
            }
            return ok;
        }
        if (root.sub_number > 0 && root.sub_number2 === 0) {
            let ok = true;
            for (const ch of children) {
                if (ch.number > 0) {
                    if (ch.number === root.number && ch.sub_number === root.sub_number && ch.sub_number2 > 0) {
                    }
                    else 
                        ok = false;
                }
            }
            if (ok) {
                for (const ch of children) {
                    if (ch.number > 0) {
                        ch.number = ch.sub_number2;
                        ch.sub_number = ch.sub_number3;
                        ch.sub_number2 = (ch.sub_number3 = 0);
                    }
                }
            }
            return ok;
        }
        if (root.sub_number > 0 && root.sub_number2 > 0 && root.sub_number3 === 0) {
            let ok = true;
            for (const ch of children) {
                if (ch.number > 0) {
                    if ((ch.number === root.number && ch.sub_number === root.sub_number && ch.sub_number2 === root.sub_number2) && ch.sub_number3 > 0) {
                    }
                    else 
                        ok = false;
                }
            }
            if (ok) {
                for (const ch of children) {
                    if (ch.number > 0) {
                        ch.number = ch.sub_number3;
                        ch.sub_number = (ch.sub_number2 = (ch.sub_number3 = 0));
                    }
                }
            }
            return ok;
        }
        return false;
    }
    
    static create_diap(s1, s2) {
        let n1 = 0;
        let n2 = 0;
        let i = 0;
        let pref = null;
        if (s2.startsWith(s1)) {
            i = s1.length;
            if (((i + 1) < s2.length) && s2[i] === '.' && Utils.isDigit(s2[i + 1])) {
                let wrapn21557 = new RefOutArgWrapper();
                let inoutres1558 = Utils.tryParseInt(s2.substring(i + 1), wrapn21557);
                n2 = wrapn21557.value;
                if (inoutres1558) {
                    let res0 = new Array();
                    res0.push(s1);
                    for (i = 1; i <= n2; i++) {
                        res0.push((s1 + "." + i));
                    }
                    return res0;
                }
            }
        }
        if ((((i = s1.lastIndexOf('.')))) > 0) {
            pref = s1.substring(0, 0 + i + 1);
            let wrapn11561 = new RefOutArgWrapper();
            let inoutres1562 = Utils.tryParseInt(s1.substring(i + 1), wrapn11561);
            n1 = wrapn11561.value;
            if (!inoutres1562) 
                return null;
            if (!s2.startsWith(pref)) 
                return null;
            let wrapn21559 = new RefOutArgWrapper();
            let inoutres1560 = Utils.tryParseInt(s2.substring(i + 1), wrapn21559);
            n2 = wrapn21559.value;
            if (!inoutres1560) 
                return null;
        }
        else {
            let wrapn11565 = new RefOutArgWrapper();
            let inoutres1566 = Utils.tryParseInt(s1, wrapn11565);
            n1 = wrapn11565.value;
            if (!inoutres1566) 
                return null;
            let wrapn21563 = new RefOutArgWrapper();
            let inoutres1564 = Utils.tryParseInt(s2, wrapn21563);
            n2 = wrapn21563.value;
            if (!inoutres1564) 
                return null;
        }
        if (n2 <= n1) 
            return null;
        let res = new Array();
        for (i = n1; i <= n2; i++) {
            if (pref === null) 
                res.push(i.toString());
            else 
                res.push(pref + ((i.toString())));
        }
        return res;
    }
}


module.exports = NumberingHelper