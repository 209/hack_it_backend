/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../unisharp/StringBuilder");

const MorphGender = require("./../morph/MorphGender");
const Token = require("./Token");
const CharsInfo = require("./../morph/CharsInfo");
const GetTextAttr = require("./core/GetTextAttr");

/**
 * Токен - надстройка над диапазоном других токенов
 */
class MetaToken extends Token {
    
    constructor(begin, end, _kit = null) {
        super((_kit !== null ? _kit : ((begin !== null ? begin.kit : null))), (begin === null ? 0 : begin.begin_char), (end === null ? 0 : end.end_char));
        this.m_begin_token = null;
        this.m_end_token = null;
        if (begin === this || end === this) {
        }
        this.m_begin_token = begin;
        this.m_end_token = end;
        if (begin === null || end === null) 
            return;
        this.chars = begin.chars;
        if (begin !== end) {
            for (let t = begin.next; t !== null; t = t.next) {
                if (t.chars.is_letter) {
                    if (this.chars.is_capital_upper && t.chars.is_all_lower) {
                    }
                    else 
                        this.chars = CharsInfo._new2815(((this.chars.value) & (t.chars.value)));
                }
                if (t === end) 
                    break;
            }
        }
    }
    
    _refresh_chars_info() {
        if (this.m_begin_token === null) 
            return;
        this.chars = this.m_begin_token.chars;
        let cou = 0;
        if (this.m_begin_token !== this.m_end_token && this.m_end_token !== null) {
            for (let t = this.m_begin_token.next; t !== null; t = t.next) {
                if ((++cou) > 100) 
                    break;
                if (t.end_char > this.m_end_token.end_char) 
                    break;
                if (t.chars.is_letter) 
                    this.chars = CharsInfo._new2815(((this.chars.value) & (t.chars.value)));
                if (t === this.m_end_token) 
                    break;
            }
        }
    }
    
    /**
     * [Get] Начальный токен диапазона
     */
    get begin_token() {
        return this.m_begin_token;
    }
    /**
     * [Set] Начальный токен диапазона
     */
    set begin_token(value) {
        if (this.m_begin_token !== value) {
            if (this.m_begin_token === this) {
            }
            else {
                this.m_begin_token = value;
                this._refresh_chars_info();
            }
        }
        return value;
    }
    
    /**
     * [Get] Конечный токен диапазона
     */
    get end_token() {
        return this.m_end_token;
    }
    /**
     * [Set] Конечный токен диапазона
     */
    set end_token(value) {
        if (this.m_end_token !== value) {
            if (this.m_end_token === this) {
            }
            else {
                this.m_end_token = value;
                this._refresh_chars_info();
            }
        }
        return value;
    }
    
    get begin_char() {
        let bt = this.begin_token;
        return (bt === null ? 0 : bt.begin_char);
    }
    
    get end_char() {
        let et = this.end_token;
        return (et === null ? 0 : et.end_char);
    }
    
    /**
     * [Get] Количество токенов в диапазоне
     */
    get tokens_count() {
        let count = 1;
        for (let t = this.m_begin_token; t !== this.m_end_token && t !== null; t = t.next) {
            if (count > 1 && t === this.m_begin_token) 
                break;
            count++;
        }
        return count;
    }
    
    get is_whitespace_before() {
        return this.m_begin_token.is_whitespace_before;
    }
    
    get is_whitespace_after() {
        return this.m_end_token.is_whitespace_after;
    }
    
    get is_newline_before() {
        return this.m_begin_token.is_newline_before;
    }
    
    get is_newline_after() {
        return this.m_end_token.is_newline_after;
    }
    
    get whitespaces_before_count() {
        return this.m_begin_token.whitespaces_before_count;
    }
    
    get whitespaces_after_count() {
        return this.m_end_token.whitespaces_after_count;
    }
    
    toString() {
        let res = new StringBuilder();
        for (let t = this.m_begin_token; t !== null; t = t.next) {
            if (res.length > 0 && t.is_whitespace_before) 
                res.append(' ');
            res.append(t.get_source_text());
            if (t === this.m_end_token) 
                break;
        }
        return res.toString();
    }
    
    is_value(term, termua = null) {
        return this.begin_token.is_value(term, termua);
    }
    
    get_referents() {
        let res = null;
        for (let t = this.begin_token; t !== null && t.end_char <= this.end_char; t = t.next) {
            let li = t.get_referents();
            if (li === null) 
                continue;
            if (res === null) 
                res = li;
            else 
                for (const r of li) {
                    if (!res.includes(r)) 
                        res.push(r);
                }
        }
        return res;
    }
    
    static check(li) {
        if (li === null || (li.length < 1)) 
            return false;
        let i = 0;
        for (i = 0; i < (li.length - 1); i++) {
            if (li[i].begin_char > li[i].end_char) 
                return false;
            if (li[i].end_char >= li[i + 1].begin_char) 
                return false;
        }
        if (li[i].begin_char > li[i].end_char) 
            return false;
        return true;
    }
    
    get_normal_case_text(mc = null, single_number = false, gender = MorphGender.UNDEFINED, keep_chars = false) {
        const MiscHelper = require("./core/MiscHelper");
        let attr = GetTextAttr.NO;
        if (single_number) 
            attr = GetTextAttr.of((attr.value()) | (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()));
        else 
            attr = GetTextAttr.of((attr.value()) | (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()));
        if (keep_chars) 
            attr = GetTextAttr.of((attr.value()) | (GetTextAttr.KEEPREGISTER.value()));
        if (this.begin_token === this.end_token) 
            return this.begin_token.get_normal_case_text(mc, single_number, gender, keep_chars);
        else 
            return MiscHelper.get_text_value(this.begin_token, this.end_token, attr);
    }
    
    static _new581(_arg1, _arg2, _arg3) {
        let res = new MetaToken(_arg1, _arg2);
        res.morph = _arg3;
        return res;
    }
    
    static _new834(_arg1, _arg2, _arg3) {
        let res = new MetaToken(_arg1, _arg2);
        res.tag = _arg3;
        return res;
    }
    
    static _new2354(_arg1, _arg2, _arg3, _arg4) {
        let res = new MetaToken(_arg1, _arg2);
        res.tag = _arg3;
        res.morph = _arg4;
        return res;
    }
}


module.exports = MetaToken