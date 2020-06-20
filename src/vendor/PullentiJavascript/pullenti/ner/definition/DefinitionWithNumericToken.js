/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const MorphCase = require("./../../morph/MorphCase");
const MorphGender = require("./../../morph/MorphGender");
const GetTextAttr = require("./../core/GetTextAttr");
const Token = require("./../Token");
const MetaToken = require("./../MetaToken");
const NumberToken = require("./../NumberToken");
const NounPhraseParseAttr = require("./../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../core/NounPhraseHelper");
const MiscHelper = require("./../core/MiscHelper");

/**
 * Для поддержки выделений тезисов с числовыми данными
 */
class DefinitionWithNumericToken extends MetaToken {
    
    toString() {
        return (String(this.number) + " " + ((this.noun != null ? this.noun : "?")) + " (" + ((this.nouns_genetive != null ? this.nouns_genetive : "?")) + ")");
    }
    
    constructor(b, e) {
        super(b, e, null);
        this.number = 0;
        this.number_begin_char = 0;
        this.number_end_char = 0;
        this.noun = null;
        this.nouns_genetive = null;
        this.number_substring = null;
        this.text = null;
    }
    
    /**
     * Выделить определение с указанного токена
     * @param t токен
     * @return 
     */
    static try_parse(t) {
        if (!MiscHelper.can_be_start_of_sentence(t)) 
            return null;
        let tt = t;
        let _noun = null;
        let num = null;
        for (; tt !== null; tt = tt.next) {
            if (tt !== t && MiscHelper.can_be_start_of_sentence(tt)) 
                return null;
            if (!((tt instanceof NumberToken))) 
                continue;
            if (tt.whitespaces_after_count > 2 || tt === t) 
                continue;
            if (tt.morph.class0.is_adjective) 
                continue;
            let nn = NounPhraseHelper.try_parse(tt.next, NounPhraseParseAttr.NO, 0, null);
            if (nn === null) 
                continue;
            num = Utils.as(tt, NumberToken);
            _noun = nn;
            break;
        }
        if (num === null || num.int_value === null) 
            return null;
        let res = new DefinitionWithNumericToken(t, _noun.end_token);
        res.number = num.int_value;
        res.number_begin_char = num.begin_char;
        res.number_end_char = num.end_char;
        res.noun = _noun.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
        res.nouns_genetive = Utils.notNull(_noun.get_morph_variant(MorphCase.GENITIVE, true), (res !== null ? res.noun : null));
        res.text = MiscHelper.get_text_value(t, num.previous, GetTextAttr.of((GetTextAttr.KEEPQUOTES.value()) | (GetTextAttr.KEEPREGISTER.value())));
        if (num.is_whitespace_before) 
            res.text += " ";
        res.number_substring = MiscHelper.get_text_value(num, _noun.end_token, GetTextAttr.of((GetTextAttr.KEEPQUOTES.value()) | (GetTextAttr.KEEPREGISTER.value())));
        res.text += res.number_substring;
        for (tt = _noun.end_token; tt !== null; tt = tt.next) {
            if (MiscHelper.can_be_start_of_sentence(tt)) 
                break;
            res.end_token = tt;
        }
        if (res.end_token !== _noun.end_token) {
            if (_noun.is_whitespace_after) 
                res.text += " ";
            res.text += MiscHelper.get_text_value(_noun.end_token.next, res.end_token, GetTextAttr.of((GetTextAttr.KEEPQUOTES.value()) | (GetTextAttr.KEEPREGISTER.value())));
        }
        return res;
    }
}


module.exports = DefinitionWithNumericToken