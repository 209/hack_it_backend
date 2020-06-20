/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const MorphCase = require("./../../morph/MorphCase");
const NounPhraseParseAttr = require("./NounPhraseParseAttr");

/**
 * Выделение именных групп (существительсно с согласованными прилагательными (если они есть).
 */
class NounPhraseHelper {
    
    /**
     * Попробовать создать именную группу с указанного токена
     * @param t начальный токен
     * @param typ параметры (можно битовую маску)
     * @param max_char_pos максимальная позиция в тексте, до которой выделять, если 0, то без ограничений
     * @param noun это если нужно выделить только прилагательные для ранее выделенного существительного (из другой группы)
     * @return именная группа или null
     */
    static try_parse(t, typ = NounPhraseParseAttr.NO, max_char_pos = 0, noun = null) {
        const PrepositionHelper = require("./PrepositionHelper");
        const NounPhraseItem = require("./internal/NounPhraseItem");
        const _NounPraseHelperInt = require("./_NounPraseHelperInt");
        let res = _NounPraseHelperInt.try_parse(t, typ, max_char_pos, Utils.as(noun, NounPhraseItem));
        if (res !== null) {
            if ((((typ.value()) & (NounPhraseParseAttr.PARSEPREPOSITION.value()))) !== (NounPhraseParseAttr.NO.value())) {
                if (res.begin_token === res.end_token && t.morph.class0.is_preposition) {
                    let prep = PrepositionHelper.try_parse(t);
                    if (prep !== null) {
                        let res2 = _NounPraseHelperInt.try_parse(t.next, typ, max_char_pos, Utils.as(noun, NounPhraseItem));
                        if (res2 !== null) {
                            if (!(MorphCase.ooBitand(prep.next_case, res2.morph._case)).is_undefined) {
                                res2.morph.remove_items(prep.next_case, false);
                                res2.preposition = prep;
                                res2.begin_token = t;
                                return res2;
                            }
                        }
                    }
                }
            }
            return res;
        }
        if ((((typ.value()) & (NounPhraseParseAttr.PARSEPREPOSITION.value()))) !== (NounPhraseParseAttr.NO.value())) {
            let prep = PrepositionHelper.try_parse(t);
            if (prep !== null && (prep.whitespaces_after_count < 3)) {
                res = _NounPraseHelperInt.try_parse(prep.end_token.next, typ, max_char_pos, Utils.as(noun, NounPhraseItem));
                if (res !== null) {
                    res.preposition = prep;
                    res.begin_token = t;
                    if (!(MorphCase.ooBitand(prep.next_case, res.morph._case)).is_undefined) 
                        res.morph.remove_items(prep.next_case, false);
                    else if (t.morph.class0.is_adverb) 
                        return null;
                    return res;
                }
            }
        }
        return null;
    }
}


module.exports = NounPhraseHelper