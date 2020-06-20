/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const RefOutArgWrapper = require("./../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../unisharp/StringBuilder");

const MorphClass = require("./../morph/MorphClass");
const MorphGender = require("./../morph/MorphGender");
const LanguageHelper = require("./../morph/LanguageHelper");
const MorphNumber = require("./../morph/MorphNumber");
const MorphBaseInfo = require("./../morph/MorphBaseInfo");
const MorphWordForm = require("./../morph/MorphWordForm");
const Morphology = require("./../morph/Morphology");
const MorphCollection = require("./MorphCollection");
const Token = require("./Token");

/**
 * Входной токен (после морфанализа)
 */
class TextToken extends Token {
    
    constructor(source, _kit, bchar = -1, echar = -1) {
        super(_kit, (bchar >= 0 ? bchar : (source === null ? 0 : source.begin_char)), (echar >= 0 ? echar : (source === null ? 0 : source.end_char)));
        this.term = null;
        this.lemma = null;
        this.term0 = null;
        this.invariant_prefix_length = 0;
        this.max_length = 0;
        if (source === null) 
            return;
        this.chars = source.char_info;
        this.term = source.term;
        this.lemma = Utils.notNull(source.lemma, this.term);
        this.max_length = this.term.length;
        this.morph = new MorphCollection();
        if (source.word_forms !== null) {
            for (const wf of source.word_forms) {
                this.morph.add_item(wf);
                if (wf.normal_case !== null && (this.max_length < wf.normal_case.length)) 
                    this.max_length = wf.normal_case.length;
                if (wf.normal_full !== null && (this.max_length < wf.normal_full.length)) 
                    this.max_length = wf.normal_full.length;
            }
        }
        for (let i = 0; i < this.term.length; i++) {
            let ch = this.term[i];
            let j = 0;
            for (j = 0; j < this.morph.items_count; j++) {
                let wf = Utils.as(this.morph.get_indexer_item(j), MorphWordForm);
                if (wf.normal_case !== null) {
                    if (i >= wf.normal_case.length) 
                        break;
                    if (wf.normal_case[i] !== ch) 
                        break;
                }
                if (wf.normal_full !== null) {
                    if (i >= wf.normal_full.length) 
                        break;
                    if (wf.normal_full[i] !== ch) 
                        break;
                }
            }
            if (j < this.morph.items_count) 
                break;
            this.invariant_prefix_length = (i + 1);
        }
        if (this.morph.language.is_undefined && !source.language.is_undefined) 
            this.morph.language = source.language;
    }
    
    /**
     * Получить лемму (устарело, используйте Lemma)
     * @return 
     */
    get_lemma() {
        return this.lemma;
    }
    
    toString() {
        let res = new StringBuilder(this.term);
        for (const l_ of this.morph.items) {
            res.append(", ").append(l_.toString());
        }
        return res.toString();
    }
    
    /**
     * Попробовать привязать словарь
     * @param dict 
     * @return 
     */
    check_value(dict) {
        if (dict === null) 
            return null;
        let res = null;
        let wrapres2858 = new RefOutArgWrapper();
        let inoutres2859 = dict.tryGetValue(this.term, wrapres2858);
        res = wrapres2858.value;
        if (inoutres2859) 
            return res;
        if (this.morph !== null) {
            for (const it of this.morph.items) {
                let mf = Utils.as(it, MorphWordForm);
                if (mf !== null) {
                    if (mf.normal_case !== null) {
                        let wrapres2854 = new RefOutArgWrapper();
                        let inoutres2855 = dict.tryGetValue(mf.normal_case, wrapres2854);
                        res = wrapres2854.value;
                        if (inoutres2855) 
                            return res;
                    }
                    if (mf.normal_full !== null && mf.normal_case !== mf.normal_full) {
                        let wrapres2856 = new RefOutArgWrapper();
                        let inoutres2857 = dict.tryGetValue(mf.normal_full, wrapres2856);
                        res = wrapres2856.value;
                        if (inoutres2857) 
                            return res;
                    }
                }
            }
        }
        return null;
    }
    
    get_source_text() {
        return super.get_source_text();
    }
    
    is_value(_term, termua = null) {
        if (termua !== null && this.morph.language.is_ua) {
            if (this.is_value(termua, null)) 
                return true;
        }
        if (_term === null) 
            return false;
        if (this.invariant_prefix_length > _term.length) 
            return false;
        if (this.max_length >= this.term.length && (this.max_length < _term.length)) 
            return false;
        if (_term === this.term) 
            return true;
        for (const wf of this.morph.items) {
            if ((wf).normal_case === _term || (wf).normal_full === _term) 
                return true;
        }
        return false;
    }
    
    /**
     * [Get] Это соединительный союз И (на всех языках)
     */
    get is_and() {
        if (!this.morph.class0.is_conjunction) {
            if (this.length_char === 1 && this.is_char('&')) 
                return true;
            return false;
        }
        let val = this.term;
        if (val === "И" || val === "AND" || val === "UND") 
            return true;
        if (this.morph.language.is_ua) {
            if (val === "І" || val === "ТА") 
                return true;
        }
        return false;
    }
    
    /**
     * [Get] Это соединительный союз ИЛИ (на всех языках)
     */
    get is_or() {
        if (!this.morph.class0.is_conjunction) 
            return false;
        let val = this.term;
        if (val === "ИЛИ" || val === "ЛИБО" || val === "OR") 
            return true;
        if (this.morph.language.is_ua) {
            if (val === "АБО") 
                return true;
        }
        return false;
    }
    
    get is_letters() {
        return Utils.isLetter(this.term[0]);
    }
    
    get_morph_class_in_dictionary() {
        let res = new MorphClass();
        for (const wf of this.morph.items) {
            if ((wf instanceof MorphWordForm) && (wf).is_in_dictionary) 
                res = MorphClass.ooBitor(res, wf.class0);
        }
        return res;
    }
    
    get_normal_case_text(mc = null, single_number = false, gender = MorphGender.UNDEFINED, keep_chars = false) {
        const MiscHelper = require("./core/MiscHelper");
        let empty = true;
        if (mc !== null && mc.is_preposition) 
            return LanguageHelper.normalize_preposition(this.term);
        for (const it of this.morph.items) {
            if (mc !== null && !mc.is_undefined) {
                let cc = (it.class0.value) & (mc.value);
                if (cc === 0) 
                    continue;
                if (MorphClass.is_misc_int(cc) && !MorphClass.is_proper_int(cc) && mc.value !== it.class0.value) 
                    continue;
            }
            let wf = Utils.as(it, MorphWordForm);
            let normal_full = false;
            if (gender !== MorphGender.UNDEFINED) {
                if ((((it.gender.value()) & (gender.value()))) === (MorphGender.UNDEFINED.value())) {
                    if ((gender === MorphGender.MASCULINE && ((it.gender !== MorphGender.UNDEFINED || it.number === MorphNumber.PLURAL)) && wf !== null) && wf.normal_full !== null) 
                        normal_full = true;
                    else if (gender === MorphGender.MASCULINE && it.class0.is_personal_pronoun) {
                    }
                    else 
                        continue;
                }
            }
            if (!it._case.is_undefined) 
                empty = false;
            if (wf !== null) {
                let res = null;
                if (single_number && it.number === MorphNumber.PLURAL && wf.normal_full !== null) {
                    let le = wf.normal_case.length;
                    if ((le === (wf.normal_full.length + 2) && le > 4 && wf.normal_case[le - 2] === 'С') && wf.normal_case[le - 1] === 'Я') 
                        res = wf.normal_case;
                    else 
                        res = (normal_full ? wf.normal_full : wf.normal_full);
                }
                else 
                    res = (normal_full ? wf.normal_full : ((wf.normal_case != null ? wf.normal_case : this.term)));
                if (single_number && mc !== null && MorphClass.ooEq(mc, MorphClass.NOUN)) {
                    if (res === "ДЕТИ") 
                        res = "РЕБЕНОК";
                }
                if (keep_chars) {
                    if (this.chars.is_all_lower) 
                        res = res.toLowerCase();
                    else if (this.chars.is_capital_upper) 
                        res = MiscHelper.convert_first_char_upper_and_other_lower(res);
                }
                return res;
            }
        }
        if (!empty) 
            return null;
        let te = null;
        if (single_number && mc !== null) {
            let bi = MorphBaseInfo._new564(new MorphClass(mc), gender, MorphNumber.SINGULAR, this.morph.language);
            let vars = Morphology.get_wordform(this.term, bi);
            if (vars !== null) 
                te = vars;
        }
        if (te === null) 
            te = this.term;
        if (keep_chars) {
            if (this.chars.is_all_lower) 
                return te.toLowerCase();
            else if (this.chars.is_capital_upper) 
                return MiscHelper.convert_first_char_upper_and_other_lower(te);
        }
        return te;
    }
    
    static get_source_text_tokens(begin, end) {
        const MetaToken = require("./MetaToken");
        let res = new Array();
        for (let t = begin; t !== null && t !== end.next && t.end_char <= end.end_char; t = t.next) {
            if (t instanceof TextToken) 
                res.push(Utils.as(t, TextToken));
            else if (t instanceof MetaToken) 
                res.splice(res.length, 0, ...TextToken.get_source_text_tokens((t).begin_token, (t).end_token));
        }
        return res;
    }
    
    /**
     * [Get] Признак того, что это чистый глагол
     */
    get is_pure_verb() {
        let ret = false;
        if ((this.is_value("МОЖНО", null) || this.is_value("МОЖЕТ", null) || this.is_value("ДОЛЖНЫЙ", null)) || this.is_value("НУЖНО", null)) 
            return true;
        for (const it of this.morph.items) {
            if ((it instanceof MorphWordForm) && (it).is_in_dictionary) {
                if (it.class0.is_verb && it._case.is_undefined) 
                    ret = true;
                else if (!it.class0.is_verb) {
                    if (it.class0.is_adjective && it.contains_attr("к.ф.", null)) {
                    }
                    else 
                        return false;
                }
            }
        }
        return ret;
    }
    
    /**
     * [Get] Проверка, что это глагол типа БЫТЬ, ЯВЛЯТЬСЯ и т.п.
     */
    get is_verb_be() {
        if ((this.is_value("БЫТЬ", null) || this.is_value("ЕСТЬ", null) || this.is_value("ЯВЛЯТЬ", null)) || this.is_value("BE", null)) 
            return true;
        if (this.term === "IS" || this.term === "WAS" || this.term === "BECAME") 
            return true;
        if (this.term === "Є") 
            return true;
        return false;
    }
    
    serialize(stream) {
        const SerializerHelper = require("./core/internal/SerializerHelper");
        super.serialize(stream);
        SerializerHelper.serialize_string(stream, this.term);
        SerializerHelper.serialize_string(stream, this.lemma);
        SerializerHelper.serialize_short(stream, this.invariant_prefix_length);
        SerializerHelper.serialize_short(stream, this.max_length);
    }
    
    deserialize(stream, _kit, vers) {
        const SerializerHelper = require("./core/internal/SerializerHelper");
        super.deserialize(stream, _kit, vers);
        this.term = SerializerHelper.deserialize_string(stream);
        this.lemma = SerializerHelper.deserialize_string(stream);
        this.invariant_prefix_length = SerializerHelper.deserialize_short(stream);
        this.max_length = SerializerHelper.deserialize_short(stream);
    }
    
    static _new542(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new TextToken(_arg1, _arg2, _arg3, _arg4);
        res.term0 = _arg5;
        return res;
    }
    
    static _new545(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new TextToken(_arg1, _arg2, _arg3, _arg4);
        res.chars = _arg5;
        res.term0 = _arg6;
        return res;
    }
}


module.exports = TextToken