/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MetaToken = require("./../../MetaToken");
const TitleItemTokenTypes = require("./TitleItemTokenTypes");
const BlkTyps = require("./../../core/internal/BlkTyps");
const TextToken = require("./../../TextToken");
const TitleItemToken = require("./TitleItemToken");
const MiscHelper = require("./../../core/MiscHelper");
const PersonReferent = require("./../../person/PersonReferent");
const BlockTitleToken = require("./../../core/internal/BlockTitleToken");

class Line extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
    }
    
    get chars_count() {
        let cou = 0;
        for (let t = this.begin_token; t !== null; t = t.next) {
            cou += t.length_char;
            if (t === this.end_token) 
                break;
        }
        return cou;
    }
    
    get is_pure_en() {
        let en = 0;
        let ru = 0;
        for (let t = this.begin_token; t !== null && t.end_char <= this.end_char; t = t.next) {
            if ((t instanceof TextToken) && t.chars.is_letter) {
                if (t.chars.is_cyrillic_letter) 
                    ru++;
                else if (t.chars.is_latin_letter) 
                    en++;
            }
        }
        if (en > 0 && ru === 0) 
            return true;
        return false;
    }
    
    get is_pure_ru() {
        let en = 0;
        let ru = 0;
        for (let t = this.begin_token; t !== null && t.end_char <= this.end_char; t = t.next) {
            if ((t instanceof TextToken) && t.chars.is_letter) {
                if (t.chars.is_cyrillic_letter) 
                    ru++;
                else if (t.chars.is_latin_letter) 
                    en++;
            }
        }
        if (ru > 0 && en === 0) 
            return true;
        return false;
    }
    
    static parse(t0, max_lines, max_chars, max_end_char) {
        let res = new Array();
        let total_chars = 0;
        for (let t = t0; t !== null; t = t.next) {
            if (max_end_char > 0) {
                if (t.begin_char > max_end_char) 
                    break;
            }
            let t1 = null;
            for (t1 = t; t1 !== null && t1.next !== null; t1 = t1.next) {
                if (t1.is_newline_after) {
                    if (t1.next === null || MiscHelper.can_be_start_of_sentence(t1.next)) 
                        break;
                }
                if (t1 === t && t.is_newline_before && (t.get_referent() instanceof PersonReferent)) {
                    if (t1.next === null) 
                        continue;
                    if ((t1.next instanceof TextToken) && t1.next.chars.is_letter && !t1.next.chars.is_all_lower) 
                        break;
                }
            }
            if (t1 === null) 
                t1 = t;
            let tit = TitleItemToken.try_attach(t);
            if (tit !== null) {
                if (tit.typ === TitleItemTokenTypes.KEYWORDS) 
                    break;
            }
            let bl = BlockTitleToken.try_attach(t, false, null);
            if (bl !== null) {
                if (bl.typ !== BlkTyps.UNDEFINED) 
                    break;
            }
            let l_ = new Line(t, t1);
            res.push(l_);
            total_chars += l_.chars_count;
            if (res.length >= max_lines || total_chars >= max_chars) 
                break;
            t = t1;
        }
        return res;
    }
}


module.exports = Line