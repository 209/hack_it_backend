/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const MorphGender = require("./../../morph/MorphGender");
const MorphCase = require("./../../morph/MorphCase");
const MorphClass = require("./../../morph/MorphClass");
const MorphNumber = require("./../../morph/MorphNumber");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const MorphWordForm = require("./../../morph/MorphWordForm");
const MorphCollection = require("./../MorphCollection");
const Token = require("./../Token");
const Morphology = require("./../../morph/Morphology");
const VerbPhraseToken = require("./VerbPhraseToken");
const NounPhraseParseAttr = require("./NounPhraseParseAttr");
const NounPhraseHelper = require("./NounPhraseHelper");
const PrepositionHelper = require("./PrepositionHelper");
const TextToken = require("./../TextToken");
const VerbPhraseItemToken = require("./VerbPhraseItemToken");
const MiscHelper = require("./MiscHelper");
const Explanatory = require("./../../semantic/utils/Explanatory");

/**
 * Работа с глагольными группами (последовательность из глаголов и наречий)
 */
class VerbPhraseHelper {
    
    /**
     * Создать глагольную группу
     * @param t первый токен группы
     * @param can_be_partition выделять ли причастия
     * @param can_be_adj_partition это бывают чистые прилагательные используются в режиме причастий (действия, опасные для жизни)
     * @return группа или null
     */
    static try_parse(t, can_be_partition = false, can_be_adj_partition = false, force_parse = false) {
        if (!((t instanceof TextToken))) 
            return null;
        if (!t.chars.is_letter) 
            return null;
        if (t.chars.is_cyrillic_letter) 
            return VerbPhraseHelper.try_parse_ru(t, can_be_partition, can_be_adj_partition, force_parse);
        return null;
    }
    
    static try_parse_ru(t, can_be_partition, can_be_adj_partition, force_parse) {
        let res = null;
        let t0 = t;
        let not = null;
        let has_verb = false;
        let verb_be_before = false;
        let prep = null;
        for (; t !== null; t = t.next) {
            if (!((t instanceof TextToken))) 
                break;
            let tt = Utils.as(t, TextToken);
            let is_participle = false;
            if (tt.term === "НЕ") {
                not = t;
                continue;
            }
            let ty = 0;
            let norm = null;
            let mc = tt.get_morph_class_in_dictionary();
            if (tt.term === "НЕТ") {
                if (has_verb) 
                    break;
                ty = 1;
            }
            else if (tt.term === "ДОПУСТИМО") 
                ty = 3;
            else if (mc.is_adverb && !mc.is_verb) 
                ty = 2;
            else if (tt.is_pure_verb || tt.is_verb_be) {
                ty = 1;
                if (has_verb) {
                    if (!tt.morph.contains_attr("инф.", null)) {
                        if (verb_be_before) {
                        }
                        else 
                            break;
                    }
                }
            }
            else if (mc.is_verb) {
                if (mc.is_preposition || mc.is_misc || mc.is_pronoun) {
                }
                else if (mc.is_noun) {
                    if (tt.term === "СТАЛИ" || tt.term === "СТЕКЛО" || tt.term === "БЫЛИ") 
                        ty = 1;
                    else if (!tt.chars.is_all_lower && !MiscHelper.can_be_start_of_sentence(tt)) 
                        ty = 1;
                    else if (mc.is_adjective && can_be_partition) 
                        ty = 1;
                    else if (force_parse) 
                        ty = 1;
                }
                else if (mc.is_proper) {
                    if (tt.chars.is_all_lower) 
                        ty = 1;
                }
                else 
                    ty = 1;
                if (mc.is_adjective) 
                    is_participle = true;
                if (!tt.morph._case.is_undefined) 
                    is_participle = true;
                if (!can_be_partition && is_participle) 
                    break;
                if (has_verb) {
                    if (tt.morph.contains_attr("инф.", null)) {
                    }
                    else if (!is_participle) {
                    }
                    else 
                        break;
                }
            }
            else if ((mc.is_adjective && tt.morph.contains_attr("к.ф.", null) && tt.term.endsWith("О")) && NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null) === null) 
                ty = 2;
            else if (mc.is_adjective && ((can_be_partition || can_be_adj_partition))) {
                if (tt.morph.contains_attr("к.ф.", null) && !can_be_adj_partition) 
                    break;
                norm = tt.get_normal_case_text(MorphClass.ADJECTIVE, true, MorphGender.MASCULINE, false);
                if (norm.endsWith("ЙШИЙ")) {
                }
                else {
                    let grs = Explanatory.find_derivates(norm, true, null);
                    if (grs !== null && grs.length > 0) {
                        let hverb = false;
                        let hpart = false;
                        for (const gr of grs) {
                            for (const w of gr.words) {
                                if (w.class0.is_adjective && w.class0.is_verb) {
                                    if (w.spelling === norm) 
                                        hpart = true;
                                }
                                else if (w.class0.is_verb) 
                                    hverb = true;
                            }
                        }
                        if (hpart && hverb) 
                            ty = 3;
                        else if (can_be_adj_partition) 
                            ty = 3;
                        if (ty !== 3 && !Utils.isNullOrEmpty(grs[0].prefix) && norm.startsWith(grs[0].prefix)) {
                            hverb = false;
                            hpart = false;
                            let norm1 = norm.substring(grs[0].prefix.length);
                            grs = Explanatory.find_derivates(norm1, true, null);
                            if (grs !== null && grs.length > 0) {
                                for (const gr of grs) {
                                    for (const w of gr.words) {
                                        if (w.class0.is_adjective && w.class0.is_verb) {
                                            if (w.spelling === norm1) 
                                                hpart = true;
                                        }
                                        else if (w.class0.is_verb) 
                                            hverb = true;
                                    }
                                }
                            }
                            if (hpart && hverb) 
                                ty = 3;
                        }
                    }
                }
            }
            if (ty === 0 && t === t0 && can_be_partition) {
                prep = PrepositionHelper.try_parse(t);
                if (prep !== null) {
                    t = prep.end_token;
                    continue;
                }
            }
            if (ty === 0) 
                break;
            if (res === null) 
                res = new VerbPhraseToken(t0, t);
            res.end_token = t;
            let it = VerbPhraseItemToken._new670(t, t, new MorphCollection(t.morph));
            if (not !== null) {
                it.begin_token = not;
                it.not = true;
                not = null;
            }
            it.is_adverb = ty === 2;
            if (prep !== null && !t.morph._case.is_undefined && res.items.length === 0) {
                if ((MorphCase.ooBitand(prep.next_case, t.morph._case)).is_undefined) 
                    return null;
                it.morph.remove_items(prep.next_case, false);
                res.preposition = prep;
            }
            if (norm === null) {
                norm = t.get_normal_case_text((ty === 3 ? MorphClass.ADJECTIVE : (ty === 2 ? MorphClass.ADVERB : MorphClass.VERB)), true, MorphGender.MASCULINE, false);
                if (ty === 1 && !tt.morph._case.is_undefined) {
                    let mi = MorphWordForm._new671(MorphCase.NOMINATIVE, MorphNumber.SINGULAR, MorphGender.MASCULINE);
                    for (const mit of tt.morph.items) {
                        if (mit instanceof MorphWordForm) {
                            mi.misc = (mit).misc;
                            break;
                        }
                    }
                    let nnn = Morphology.get_wordform("КК" + (t).term, mi);
                    if (nnn !== null) 
                        norm = nnn.substring(2);
                }
            }
            it.normal = norm;
            res.items.push(it);
            if (!has_verb && ((ty === 1 || ty === 3))) {
                res.morph = it.morph;
                has_verb = true;
            }
            if (ty === 1 || ty === 3) {
                if (ty === 1 && tt.is_verb_be) 
                    verb_be_before = true;
                else 
                    verb_be_before = false;
            }
        }
        if (!has_verb) 
            return null;
        for (let i = res.items.length - 1; i > 0; i--) {
            if (res.items[i].is_adverb) {
                res.items.splice(i, 1);
                res.end_token = res.items[i - 1].end_token;
            }
            else 
                break;
        }
        return res;
    }
}


module.exports = VerbPhraseHelper