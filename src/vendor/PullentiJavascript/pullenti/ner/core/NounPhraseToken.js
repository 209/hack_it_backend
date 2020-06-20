/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphLang = require("./../../morph/MorphLang");
const GetTextAttr = require("./GetTextAttr");
const MorphNumber = require("./../../morph/MorphNumber");
const NounPhraseMultivarToken = require("./NounPhraseMultivarToken");
const Morphology = require("./../../morph/Morphology");
const TextToken = require("./../TextToken");
const MetaToken = require("./../MetaToken");
const NounPhraseItemTextVar = require("./internal/NounPhraseItemTextVar");
const ReferentToken = require("./../ReferentToken");
const MorphClass = require("./../../morph/MorphClass");
const MorphGender = require("./../../morph/MorphGender");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const MiscHelper = require("./MiscHelper");

/**
 * Токен для представления именной группы
 */
class NounPhraseToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.noun = null;
        this.adjectives = new Array();
        this.adverbs = null;
        this.internal_noun = null;
        this.anafor = null;
        this.anafora_ref = null;
        this.preposition = null;
        this.multi_nouns = false;
    }
    
    /**
     * Это если MultiNouns = true, то можно как бы расщепить на варианты 
     *  (грузовой и легковой автомобили -> грузовой автомобиль и легковой автомобиль)
     * @return 
     */
    get_multivars() {
        let res = new Array();
        for (let i = 0; i < this.adjectives.length; i++) {
            let v = NounPhraseMultivarToken._new570(this.adjectives[i].begin_token, this.adjectives[i].end_token, this, i, i);
            for (; i < (this.adjectives.length - 1); i++) {
                if (this.adjectives[i + 1].begin_token === this.adjectives[i].end_token.next) {
                    v.end_token = this.adjectives[i + 1].end_token;
                    v.adj_index2 = i + 1;
                }
                else 
                    break;
            }
            if (i === (this.adjectives.length - 1)) 
                v.end_token = this.end_token;
            res.push(v);
        }
        return res;
    }
    
    get_normal_case_text(mc = null, single_number = false, gender = MorphGender.UNDEFINED, keep_chars = false) {
        let res = new StringBuilder();
        if (gender === MorphGender.UNDEFINED) 
            gender = this.morph.gender;
        if (this.adverbs !== null && this.adverbs.length > 0) {
            let i = 0;
            if (this.adjectives.length > 0) {
                for (let j = 0; j < this.adjectives.length; j++) {
                    let s = this.adjectives[j].get_normal_case_text(MorphClass.ooBitor(MorphClass.ADJECTIVE, MorphClass.PRONOUN), single_number, gender, keep_chars);
                    res.append(((s != null ? s : "?"))).append(" ");
                    for (; i < this.adverbs.length; i++) {
                        if (this.adverbs[i].begin_char < this.adjectives[j].begin_char) 
                            res.append(this.adjectives[i].get_normal_case_text(MorphClass.ADVERB, false, MorphGender.UNDEFINED, false)).append(" ");
                        else 
                            break;
                    }
                }
            }
            for (; i < this.adverbs.length; i++) {
                res.append(this.adjectives[i].get_normal_case_text(MorphClass.ADVERB, false, MorphGender.UNDEFINED, false)).append(" ");
            }
        }
        else 
            for (const t of this.adjectives) {
                let s = t.get_normal_case_text(MorphClass.ooBitor(MorphClass.ADJECTIVE, MorphClass.PRONOUN), single_number, gender, keep_chars);
                res.append(((s != null ? s : "?"))).append(" ");
            }
        let r = null;
        if ((this.noun.begin_token instanceof ReferentToken) && this.noun.begin_token === this.noun.end_token) 
            r = this.noun.begin_token.get_normal_case_text(null, single_number, gender, keep_chars);
        else {
            let cas = MorphClass.ooBitor(MorphClass.NOUN, MorphClass.PRONOUN);
            if (mc !== null && !mc.is_undefined) 
                cas = mc;
            r = this.noun.get_normal_case_text(cas, single_number, gender, keep_chars);
        }
        if (r === null || r === "?") 
            r = this.noun.get_normal_case_text(null, single_number, MorphGender.UNDEFINED, false);
        res.append((r != null ? r : this.noun.toString()));
        return res.toString();
    }
    
    get_normal_case_text_without_adjective(adj_index) {
        let res = new StringBuilder();
        for (let i = 0; i < this.adjectives.length; i++) {
            if (i !== adj_index) {
                let s = this.adjectives[i].get_normal_case_text(MorphClass.ooBitor(MorphClass.ADJECTIVE, MorphClass.PRONOUN), false, MorphGender.UNDEFINED, false);
                res.append(((s != null ? s : "?"))).append(" ");
            }
        }
        let r = this.noun.get_normal_case_text(MorphClass.ooBitor(MorphClass.NOUN, MorphClass.PRONOUN), false, MorphGender.UNDEFINED, false);
        if (r === null) 
            r = this.noun.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
        res.append((r != null ? r : this.noun.toString()));
        return res.toString();
    }
    
    /**
     * Сгенерировать текст именной группы в нужном падеже и числе
     * @param cas 
     * @param plural 
     * @return 
     */
    get_morph_variant(cas, plural) {
        let mi = MorphBaseInfo._new571(cas, MorphLang.RU);
        if (plural) 
            mi.number = MorphNumber.PLURAL;
        else 
            mi.number = MorphNumber.SINGULAR;
        let res = null;
        for (const a of this.adjectives) {
            let tt = MiscHelper.get_text_value_of_meta_token(a, GetTextAttr.NO);
            if (a.begin_token !== a.end_token || !((a.begin_token instanceof TextToken))) {
            }
            else {
                let tt2 = Morphology.get_wordform(tt, mi);
                if (tt2 !== null) 
                    tt = tt2;
            }
            if (res === null) 
                res = tt;
            else 
                res = (res + " " + tt);
        }
        if (this.noun !== null) {
            let tt = MiscHelper.get_text_value_of_meta_token(this.noun, GetTextAttr.NO);
            if (this.noun.begin_token !== this.noun.end_token || !((this.noun.begin_token instanceof TextToken))) {
            }
            else {
                let tt2 = Morphology.get_wordform(tt, mi);
                if (tt2 !== null) 
                    tt = tt2;
            }
            if (res === null) 
                res = tt;
            else 
                res = (res + " " + tt);
        }
        return res;
    }
    
    toString() {
        if (this.internal_noun === null) 
            return ((Utils.notNull(this.get_normal_case_text(null, false, MorphGender.UNDEFINED, false), "?")) + " " + this.morph.toString());
        else 
            return ((Utils.notNull(this.get_normal_case_text(null, false, MorphGender.UNDEFINED, false), "?")) + " " + this.morph.toString() + " / " + this.internal_noun.toString());
    }
    
    remove_last_noun_word() {
        if (this.noun !== null) {
            for (const it of this.noun.morph.items) {
                let ii = Utils.as(it, NounPhraseItemTextVar);
                if (ii === null || ii.normal_value === null) 
                    continue;
                let j = ii.normal_value.indexOf('-');
                if (j > 0) 
                    ii.normal_value = ii.normal_value.substring(0, 0 + j);
                if (ii.single_number_value !== null) {
                    if ((((j = ii.single_number_value.indexOf('-')))) > 0) 
                        ii.single_number_value = ii.single_number_value.substring(0, 0 + j);
                }
            }
        }
    }
    
    static _new536(_arg1, _arg2, _arg3) {
        let res = new NounPhraseToken(_arg1, _arg2);
        res.preposition = _arg3;
        return res;
    }
    
    static _new2947(_arg1, _arg2, _arg3) {
        let res = new NounPhraseToken(_arg1, _arg2);
        res.morph = _arg3;
        return res;
    }
}


module.exports = NounPhraseToken