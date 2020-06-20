/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const LanguageHelper = require("./../../morph/LanguageHelper");
const Token = require("./../Token");
const MorphGender = require("./../../morph/MorphGender");
const NounPhraseParseAttr = require("./NounPhraseParseAttr");
const BracketParseAttr = require("./BracketParseAttr");
const MorphClass = require("./../../morph/MorphClass");
const TextToken = require("./../TextToken");
const MetaToken = require("./../MetaToken");
const MiscHelper = require("./MiscHelper");
const BracketSequenceToken = require("./BracketSequenceToken");

/**
 * Поддержка анализа скобок и кавычек
 */
class BracketHelper {
    
    /**
     * Проверка, что с этого терма может начинаться последовательность
     * @param t проверяемый токен
     * @param quotes_only должны быть именно кавычка, а не скобка
     * @return 
     */
    static can_be_start_of_sequence(t, quotes_only = false, ignore_whitespaces = false) {
        let tt = Utils.as(t, TextToken);
        if (tt === null || tt.next === null) 
            return false;
        let ch = tt.term[0];
        if (Utils.isLetterOrDigit(ch)) 
            return false;
        if (quotes_only && (BracketHelper.m_quotes.indexOf(ch) < 0)) 
            return false;
        if (t.next === null) 
            return false;
        if (BracketHelper.m_open_chars.indexOf(ch) < 0) 
            return false;
        if (!ignore_whitespaces) {
            if (t.is_whitespace_after) {
                if (!t.is_whitespace_before) {
                    if (t.previous !== null && t.previous.is_table_control_char) {
                    }
                    else 
                        return false;
                }
                if (t.is_newline_after) 
                    return false;
            }
            else if (!t.is_whitespace_before) {
                if (Utils.isLetterOrDigit(t.kit.get_text_character(t.begin_char - 1))) {
                    if (t.next !== null && ((t.next.chars.is_all_lower || !t.next.chars.is_letter))) {
                        if (ch !== '(') 
                            return false;
                    }
                }
            }
        }
        return true;
    }
    
    /**
     * Проверка, что на этом терме может заканчиваться последовательность
     * @param t закрывающая кавычка
     * @param quotes_only должны быть именно кавычка, а не скобка
     * @param opent это ссылка на токен, который мог быть открывающим
     * @return 
     */
    static can_be_end_of_sequence(t, quotes_only = false, opent = null, ignore_whitespaces = false) {
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return false;
        let ch = tt.term[0];
        if (Utils.isLetterOrDigit(ch)) 
            return false;
        if (t.previous === null) 
            return false;
        if (BracketHelper.m_close_chars.indexOf(ch) < 0) 
            return false;
        if (quotes_only) {
            if (BracketHelper.m_quotes.indexOf(ch) < 0) 
                return false;
        }
        if (!ignore_whitespaces) {
            if (!t.is_whitespace_after) {
                if (t.is_whitespace_before) {
                    if (t.next !== null && t.next.is_table_control_char) {
                    }
                    else 
                        return false;
                }
                if (t.is_newline_before) 
                    return false;
            }
            else if (t.is_whitespace_before) {
                if (Utils.isLetterOrDigit(t.kit.get_text_character(t.end_char + 1))) 
                    return false;
                if (!t.is_whitespace_after) 
                    return false;
            }
        }
        if (opent instanceof TextToken) {
            let ch0 = (opent).term[0];
            let i = BracketHelper.m_open_chars.indexOf(ch0);
            if (i < 0) 
                return BracketHelper.m_close_chars.indexOf(ch) < 0;
            let ii = BracketHelper.m_close_chars.indexOf(ch);
            return ii === i;
        }
        return true;
    }
    
    /**
     * Проверка символа, что он может быть скобкой или кавычкой
     * @param ch 
     * @param quots_only 
     * @return 
     */
    static is_bracket_char(ch, quots_only = false) {
        if (BracketHelper.m_open_chars.indexOf(ch) >= 0 || BracketHelper.m_close_chars.indexOf(ch) >= 0) {
            if (!quots_only) 
                return true;
            return BracketHelper.m_quotes.indexOf(ch) >= 0;
        }
        return false;
    }
    
    /**
     * Проверка токена, что он является скобкой или кавычкой
     * @param t 
     * @param quots_only 
     * @return 
     */
    static is_bracket(t, quots_only = false) {
        if (t === null) 
            return false;
        if (t.is_char_of(BracketHelper.m_open_chars)) {
            if (quots_only) {
                if (t instanceof TextToken) {
                    if (BracketHelper.m_quotes.indexOf((t).term[0]) < 0) 
                        return false;
                }
            }
            return true;
        }
        if (t.is_char_of(BracketHelper.m_close_chars)) {
            if (quots_only) {
                if (t instanceof TextToken) {
                    if (BracketHelper.m_quotes.indexOf((t).term[0]) < 0) 
                        return false;
                }
            }
            return true;
        }
        return false;
    }
    
    /**
     * Попробовать восстановить последовательность, обрамляемой кавычками
     * @param t 
     * @param typ параметры выделения
     * @param max_tokens максимально токенов (вдруг забыли закрывающую ккавычку)
     * @return 
     */
    static try_parse(t, typ = BracketParseAttr.NO, max_tokens = 100) {
        const NounPhraseHelper = require("./NounPhraseHelper");
        let t0 = t;
        let cou = 0;
        if (!BracketHelper.can_be_start_of_sequence(t0, false, false)) 
            return null;
        let br_list = new Array();
        br_list.push(new BracketHelper.Bracket(t0));
        cou = 0;
        let crlf = 0;
        let last = null;
        let lev = 1;
        let is_assim = br_list[0].char0 !== '«' && BracketHelper.m_assymopen_chars.indexOf(br_list[0].char0) >= 0;
        for (t = t0.next; t !== null; t = t.next) {
            if (t.is_table_control_char) 
                break;
            last = t;
            if (t.is_char_of(BracketHelper.m_open_chars) || t.is_char_of(BracketHelper.m_close_chars)) {
                if (t.is_newline_before && (((typ.value()) & (BracketParseAttr.CANBEMANYLINES.value()))) === (BracketParseAttr.NO.value())) {
                    if (t.whitespaces_before_count > 10 || BracketHelper.can_be_start_of_sequence(t, false, false)) {
                        if (t.is_char('(') && !t0.is_char('(')) {
                        }
                        else {
                            last = t.previous;
                            break;
                        }
                    }
                }
                let bb = new BracketHelper.Bracket(t);
                br_list.push(bb);
                if (br_list.length > 20) 
                    break;
                if ((br_list.length === 3 && br_list[1].can_be_open && bb.can_be_close) && BracketHelper.must_be_close_char(bb.char0, br_list[1].char0) && BracketHelper.must_be_close_char(bb.char0, br_list[0].char0)) {
                    let ok = false;
                    for (let tt = t.next; tt !== null; tt = tt.next) {
                        if (tt.is_newline_before) 
                            break;
                        if (tt.is_char(',')) 
                            break;
                        if (tt.is_char('.')) {
                            for (tt = tt.next; tt !== null; tt = tt.next) {
                                if (tt.is_newline_before) 
                                    break;
                                else if (tt.is_char_of(BracketHelper.m_open_chars) || tt.is_char_of(BracketHelper.m_close_chars)) {
                                    let bb2 = new BracketHelper.Bracket(tt);
                                    if (BracketHelper.can_be_end_of_sequence(tt, false, null, false) && BracketHelper.can_be_close_char(bb2.char0, br_list[0].char0)) 
                                        ok = true;
                                    break;
                                }
                            }
                            break;
                        }
                        if (t.is_char_of(BracketHelper.m_open_chars) || t.is_char_of(BracketHelper.m_close_chars)) {
                            ok = true;
                            break;
                        }
                    }
                    if (!ok) 
                        break;
                }
                if (is_assim) {
                    if (bb.can_be_open && !bb.can_be_close && bb.char0 === br_list[0].char0) 
                        lev++;
                    else if (bb.can_be_close && !bb.can_be_open && BracketHelper.m_open_chars.indexOf(br_list[0].char0) === BracketHelper.m_close_chars.indexOf(bb.char0)) {
                        lev--;
                        if (lev === 0) 
                            break;
                    }
                }
            }
            else {
                if ((++cou) > max_tokens) 
                    break;
                if ((((typ.value()) & (BracketParseAttr.CANCONTAINSVERBS.value()))) === (BracketParseAttr.NO.value())) {
                    if (t.morph.language.is_cyrillic) {
                        if (MorphClass.ooEq(t.get_morph_class_in_dictionary(), MorphClass.VERB)) {
                            if (!t.morph.class0.is_adjective && !t.morph.contains_attr("страд.з.", null)) {
                                if (t.chars.is_all_lower) {
                                    let norm = t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                                    if (!LanguageHelper.ends_with(norm, "СЯ")) {
                                        if (br_list.length > 1) 
                                            break;
                                        if (br_list[0].char0 !== '(') 
                                            break;
                                    }
                                }
                            }
                        }
                    }
                    else if (t.morph.language.is_en) {
                        if (MorphClass.ooEq(t.morph.class0, MorphClass.VERB) && t.chars.is_all_lower) 
                            break;
                    }
                    let r = t.get_referent();
                    if (r !== null && r.type_name === "ADDRESS") {
                        if (!t0.is_char('(')) 
                            break;
                    }
                }
            }
            if ((((typ.value()) & (BracketParseAttr.CANBEMANYLINES.value()))) !== (BracketParseAttr.NO.value())) {
                if (t.is_newline_before) {
                    if (t.newlines_before_count > 1) 
                        break;
                    crlf++;
                }
                continue;
            }
            if (t.is_newline_before) {
                if (t.whitespaces_before_count > 15) 
                    break;
                crlf++;
                if (!t.chars.is_all_lower) {
                    if (t.previous !== null && t.previous.is_char('.')) 
                        break;
                }
                if ((t.previous instanceof MetaToken) && BracketHelper.can_be_end_of_sequence((t.previous).end_token, false, null, false)) 
                    break;
            }
            if (crlf > 1) {
                if (br_list.length > 1) 
                    break;
                if (crlf > 10) 
                    break;
            }
            if (t.is_char(';') && t.is_newline_after) 
                break;
        }
        if ((br_list.length === 1 && br_list[0].can_be_open && (last instanceof MetaToken)) && last.is_newline_after) {
            if (BracketHelper.can_be_end_of_sequence((last).end_token, false, null, false)) 
                return new BracketSequenceToken(t0, last);
        }
        if (br_list.length < 1) 
            return null;
        for (let i = 1; i < (br_list.length - 1); i++) {
            if (br_list[i].char0 === '<' && br_list[i + 1].char0 === '>') {
                br_list[i].can_be_open = true;
                br_list[i + 1].can_be_close = true;
            }
        }
        let internals = null;
        while (br_list.length > 3) {
            let i = br_list.length - 1;
            if ((br_list[i].can_be_close && br_list[i - 1].can_be_open && !BracketHelper.can_be_close_char(br_list[i].char0, br_list[0].char0)) && BracketHelper.can_be_close_char(br_list[i].char0, br_list[i - 1].char0)) {
                br_list.splice(br_list.length - 2, 2);
                continue;
            }
            break;
        }
        while (br_list.length >= 4) {
            let changed = false;
            for (let i = 1; i < (br_list.length - 2); i++) {
                if ((br_list[i].can_be_open && !br_list[i].can_be_close && br_list[i + 1].can_be_close) && !br_list[i + 1].can_be_open) {
                    let ok = false;
                    if (BracketHelper.must_be_close_char(br_list[i + 1].char0, br_list[i].char0) || br_list[i].char0 !== br_list[0].char0) {
                        ok = true;
                        if ((i === 1 && ((i + 2) < br_list.length) && br_list[i + 2].char0 === ')') && br_list[i + 1].char0 !== ')' && BracketHelper.can_be_close_char(br_list[i + 1].char0, br_list[i - 1].char0)) 
                            br_list[i + 2] = br_list[i + 1];
                    }
                    else if (i > 1 && ((i + 2) < br_list.length) && BracketHelper.must_be_close_char(br_list[i + 2].char0, br_list[i - 1].char0)) 
                        ok = true;
                    if (ok) {
                        if (internals === null) 
                            internals = new Array();
                        internals.push(new BracketSequenceToken(br_list[i].source, br_list[i + 1].source));
                        br_list.splice(i, 2);
                        changed = true;
                        break;
                    }
                }
            }
            if (!changed) 
                break;
        }
        let res = null;
        if ((br_list.length >= 4 && br_list[1].can_be_open && br_list[2].can_be_close) && br_list[3].can_be_close && !br_list[3].can_be_open) {
            if (BracketHelper.can_be_close_char(br_list[3].char0, br_list[0].char0)) {
                res = new BracketSequenceToken(br_list[0].source, br_list[3].source);
                if (br_list[0].source.next !== br_list[1].source || br_list[2].source.next !== br_list[3].source) 
                    res.internal.push(new BracketSequenceToken(br_list[1].source, br_list[2].source));
                if (internals !== null) 
                    res.internal.splice(res.internal.length, 0, ...internals);
            }
        }
        if ((res === null && br_list.length >= 3 && br_list[2].can_be_close) && !br_list[2].can_be_open) {
            if ((((typ.value()) & (BracketParseAttr.NEARCLOSEBRACKET.value()))) !== (BracketParseAttr.NO.value())) {
                if (BracketHelper.can_be_close_char(br_list[1].char0, br_list[0].char0)) 
                    return new BracketSequenceToken(br_list[0].source, br_list[1].source);
            }
            let ok = true;
            if (BracketHelper.can_be_close_char(br_list[2].char0, br_list[0].char0) && BracketHelper.can_be_close_char(br_list[1].char0, br_list[0].char0) && br_list[1].can_be_close) {
                for (t = br_list[1].source; t !== br_list[2].source && t !== null; t = t.next) {
                    if (t.is_newline_before) {
                        ok = false;
                        break;
                    }
                    if (t.chars.is_letter && t.chars.is_all_lower) {
                        ok = false;
                        break;
                    }
                    let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null) 
                        t = npt.end_token;
                }
                if (ok) {
                    for (t = br_list[0].source.next; t !== br_list[1].source && t !== null; t = t.next) {
                        if (t.is_newline_before) 
                            return new BracketSequenceToken(br_list[0].source, t.previous);
                    }
                }
                let lev1 = 0;
                for (let tt = br_list[0].source.previous; tt !== null; tt = tt.previous) {
                    if (tt.is_newline_after || tt.is_table_control_char) 
                        break;
                    if (!((tt instanceof TextToken))) 
                        continue;
                    if (tt.chars.is_letter || tt.length_char > 1) 
                        continue;
                    let ch = (tt).term[0];
                    if (BracketHelper.can_be_close_char(ch, br_list[0].char0)) 
                        lev1++;
                    else if (BracketHelper.can_be_close_char(br_list[1].char0, ch)) {
                        lev1--;
                        if (lev1 < 0) 
                            return new BracketSequenceToken(br_list[0].source, br_list[1].source);
                    }
                }
            }
            if (ok && BracketHelper.can_be_close_char(br_list[2].char0, br_list[0].char0)) {
                let intern = new BracketSequenceToken(br_list[1].source, br_list[2].source);
                res = new BracketSequenceToken(br_list[0].source, br_list[2].source);
                res.internal.push(intern);
            }
            else if (ok && BracketHelper.can_be_close_char(br_list[2].char0, br_list[1].char0) && br_list[0].can_be_open) {
                if (BracketHelper.can_be_close_char(br_list[2].char0, br_list[0].char0)) {
                    let intern = new BracketSequenceToken(br_list[1].source, br_list[2].source);
                    res = new BracketSequenceToken(br_list[0].source, br_list[2].source);
                    res.internal.push(intern);
                }
                else if (br_list.length === 3) 
                    return null;
            }
        }
        if (res === null && br_list.length > 1 && br_list[1].can_be_close) 
            res = new BracketSequenceToken(br_list[0].source, br_list[1].source);
        if (res === null && br_list.length > 1 && BracketHelper.can_be_close_char(br_list[1].char0, br_list[0].char0)) 
            res = new BracketSequenceToken(br_list[0].source, br_list[1].source);
        if (res === null && br_list.length === 2 && br_list[0].char0 === br_list[1].char0) 
            res = new BracketSequenceToken(br_list[0].source, br_list[1].source);
        if (res !== null && internals !== null) {
            for (const i of internals) {
                if (i.begin_char < res.end_char) 
                    res.internal.push(i);
            }
        }
        if (res === null) {
            cou = 0;
            for (let tt = t0.next; tt !== null; tt = tt.next,cou++) {
                if (tt.is_table_control_char) 
                    break;
                if (MiscHelper.can_be_start_of_sentence(tt)) 
                    break;
                if (max_tokens > 0 && cou > max_tokens) 
                    break;
                let mt = Utils.as(tt, MetaToken);
                if (mt === null) 
                    continue;
                if (mt.end_token instanceof TextToken) {
                    if ((mt.end_token).is_char_of(BracketHelper.m_close_chars)) {
                        let bb = new BracketHelper.Bracket(Utils.as(mt.end_token, TextToken));
                        if (bb.can_be_close && BracketHelper.can_be_close_char(bb.char0, br_list[0].char0)) 
                            return new BracketSequenceToken(t0, tt);
                    }
                }
            }
        }
        return res;
    }
    
    static can_be_close_char(close, open) {
        let i = BracketHelper.m_open_chars.indexOf(open);
        if (i < 0) 
            return false;
        let j = BracketHelper.m_close_chars.indexOf(close);
        return i === j;
    }
    
    static must_be_close_char(close, open) {
        if (BracketHelper.m_assymopen_chars.indexOf(open) < 0) 
            return false;
        let i = BracketHelper.m_open_chars.indexOf(open);
        let j = BracketHelper.m_close_chars.indexOf(close);
        return i === j;
    }
    
    static static_constructor() {
        BracketHelper.m_open_chars = "\"'`’<{([«“„”";
        BracketHelper.m_close_chars = "\"'`’>})]»”“";
        BracketHelper.m_quotes = "\"'`’«“<”„»>";
        BracketHelper.m_assymopen_chars = "<{([«";
    }
}


BracketHelper.Bracket = class  {
    
    constructor(t) {
        const TextToken = require("./../TextToken");
        this.source = null;
        this.char0 = null;
        this.can_be_open = false;
        this.can_be_close = false;
        this.source = t;
        if (t instanceof TextToken) 
            this.char0 = (t).term[0];
        this.can_be_open = BracketHelper.can_be_start_of_sequence(t, false, false);
        this.can_be_close = BracketHelper.can_be_end_of_sequence(t, false, null, false);
    }
    
    toString() {
        let res = new StringBuilder();
        res.append("!").append(this.char0).append(" ");
        if (this.can_be_open) 
            res.append(" Open");
        if (this.can_be_close) 
            res.append(" Close");
        return res.toString();
    }
}


BracketHelper.static_constructor();

module.exports = BracketHelper