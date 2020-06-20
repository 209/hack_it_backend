/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MorphGender = require("./../../morph/MorphGender");
const GetTextAttr = require("./GetTextAttr");
const MetaToken = require("./../MetaToken");
const MiscHelper = require("./MiscHelper");

/**
 * Представление последовательности, обрамлённой кавычками (скобками)
 */
class BracketSequenceToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.internal = new Array();
    }
    
    /**
     * [Get] Признак обрамления кавычками (если false, то м.б. [...], (...), {...})
     */
    get is_quote_type() {
        return "{([".indexOf(this.open_char) < 0;
    }
    
    /**
     * [Get] Открывающий символ
     */
    get open_char() {
        return this.begin_token.kit.get_text_character(this.begin_token.begin_char);
    }
    
    /**
     * [Get] Закрывающий символ
     */
    get close_char() {
        return this.end_token.kit.get_text_character(this.end_token.begin_char);
    }
    
    toString() {
        return super.toString();
    }
    
    get_normal_case_text(mc = null, single_number = false, gender = MorphGender.UNDEFINED, keep_chars = false) {
        let attr = GetTextAttr.NO;
        if (single_number) 
            attr = GetTextAttr.of((attr.value()) | (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()));
        else 
            attr = GetTextAttr.of((attr.value()) | (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()));
        if (keep_chars) 
            attr = GetTextAttr.of((attr.value()) | (GetTextAttr.KEEPREGISTER.value()));
        return MiscHelper.get_text_value(this.begin_token, this.end_token, attr);
    }
}


module.exports = BracketSequenceToken