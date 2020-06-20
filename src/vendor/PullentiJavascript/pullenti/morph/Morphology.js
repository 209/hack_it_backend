/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");

const MorphCase = require("./MorphCase");
const MorphGender = require("./MorphGender");
const MorphMiscInfo = require("./MorphMiscInfo");
const MorphNumber = require("./MorphNumber");
const MorphClass = require("./MorphClass");
const MorphLang = require("./MorphLang");
const UnicodeInfo = require("./internal/UnicodeInfo");
const MorphWordForm = require("./MorphWordForm");
const InnerMorphology = require("./internal/InnerMorphology");

/**
 * Морфологический анализ текстов
 */
class Morphology {
    
    /**
     * Инициализация внутренних словарей. 
     *  Можно не вызывать, но тогда будет автоматически вызвано при первом обращении к морфологии, 
     *  и соответственно первый разбор отработает на несколько секунд дольше.
     * @param langs по умолчанию, русский и английский
     */
    static initialize(langs = null) {
        UnicodeInfo.initialize();
        if (langs === null || langs.is_undefined) 
            langs = MorphLang.ooBitor(MorphLang.RU, MorphLang.EN);
        InnerMorphology.load_languages(langs);
    }
    
    /**
     * [Get] Языки, морфологические словари для которых загружены в память
     */
    static get_loaded_languages() {
        return InnerMorphology.get_loaded_languages();
    }
    
    /**
     * Загрузить язык(и), если они ещё не загружены
     * @param langs загружаемые языки
     */
    static load_languages(langs) {
        InnerMorphology.load_languages(langs);
    }
    
    /**
     * Выгрузить язык(и), если они больше не нужны
     * @param langs выгружаемые языки
     */
    static unload_languages(langs) {
        InnerMorphology.unload_languages(langs);
    }
    
    /**
     * Произвести чистую токенизацию без формирования морф-вариантов
     * @param text исходный текст
     * @return последовательность результирующих лексем
     */
    static tokenize(text) {
        if (Utils.isNullOrEmpty(text)) 
            return null;
        let res = Morphology.m_inner.run(text, true, MorphLang.UNKNOWN, null, false);
        if (res !== null) {
            for (const r of res) {
                if (r.word_forms === null) 
                    r.word_forms = Morphology.m_empty_word_forms;
                for (const wf of r.word_forms) {
                    if (wf.misc === null) 
                        wf.misc = Morphology.m_empty_misc;
                }
            }
        }
        return res;
    }
    
    /**
     * Произвести морфологический анализ текста
     * @param text исходный текст
     * @param lang базовый язык (если null, то будет определён автоматически)
     * @param progress это для бегунка
     * @return последовательность результирующих лексем
     */
    static process(text, lang = null, progress = null) {
        if (Utils.isNullOrEmpty(text)) 
            return null;
        let res = Morphology.m_inner.run(text, false, lang, progress, false);
        if (res !== null) {
            for (const r of res) {
                if (r.word_forms === null) 
                    r.word_forms = Morphology.m_empty_word_forms;
                for (const wf of r.word_forms) {
                    if (wf.misc === null) 
                        wf.misc = Morphology.m_empty_misc;
                }
            }
        }
        return res;
    }
    
    /**
     * Получить все варианты словоформ для нормальной формы слова
     * @param word 
     * @param lang язык (по умолчанию, русский)
     * @return список словоформ
     */
    static get_all_wordforms(word, lang = null) {
        let res = Morphology.m_inner.get_all_wordforms(word, lang);
        if (res !== null) {
            for (const r of res) {
                if (r.misc === null) 
                    r.misc = Morphology.m_empty_misc;
            }
        }
        return res;
    }
    
    /**
     * Получить вариант написания словоформы
     * @param word слово
     * @param morph_info морфологическая информация
     * @return вариант написания
     */
    static get_wordform(word, morph_info) {
        if (morph_info === null || Utils.isNullOrEmpty(word)) 
            return word;
        let cla = morph_info.class0;
        if (cla.is_undefined) {
            let mi0 = Morphology.get_word_base_info(word, null, false, false);
            if (mi0 !== null) 
                cla = mi0.class0;
        }
        for (const ch of word) {
            if (Utils.isLowerCase(ch)) {
                word = word.toUpperCase();
                break;
            }
        }
        return Utils.notNull(Morphology.m_inner.get_wordform(word, cla, morph_info.gender, morph_info._case, morph_info.number, morph_info.language, Utils.as(morph_info, MorphWordForm)), word);
    }
    
    /**
     * Получить для словоформы род\число\падеж
     * @param word словоформа
     * @param lang возможный язык
     * @param is_case_nominative исходное слово в именительном падеже (иначе считается падеж любым)
     * @param in_dict_only при true не строить гипотезы для несловарных слов
     * @return базовая морфологическая информация
     */
    static get_word_base_info(word, lang = null, is_case_nominative = false, in_dict_only = false) {
        let mt = Morphology.m_inner.run(word, false, lang, null, false);
        let bi = new MorphWordForm();
        let cla = new MorphClass();
        if (mt !== null && mt.length > 0) {
            for (let k = 0; k < 2; k++) {
                let ok = false;
                for (const wf of mt[0].word_forms) {
                    if (k === 0) {
                        if (!wf.is_in_dictionary) 
                            continue;
                    }
                    else if (wf.is_in_dictionary) 
                        continue;
                    if (is_case_nominative) {
                        if (!wf._case.is_nominative && !wf._case.is_undefined) 
                            continue;
                    }
                    cla.value |= wf.class0.value;
                    bi.gender = MorphGender.of((bi.gender.value()) | (wf.gender.value()));
                    bi._case = MorphCase.ooBitor(bi._case, wf._case);
                    bi.number = MorphNumber.of((bi.number.value()) | (wf.number.value()));
                    if (wf.misc !== null && bi.misc === null) 
                        bi.misc = wf.misc;
                    ok = true;
                }
                if (ok || in_dict_only) 
                    break;
            }
        }
        bi.class0 = cla;
        return bi;
    }
    
    /**
     * Попробовать откорретировать одну букву словоформы, чтобы получилось словарное слово
     * @param word искаженное слово
     * @param lang возможный язык
     * @return откорректированное слово или null при невозможности
     */
    static correct_word(word, lang = null) {
        return Morphology.m_inner.correct_word_by_morph(word, lang);
    }
    
    /**
     * Преобразовать наречие в прилагательное (это пока только для русского языка)
     * @param adverb наречие
     * @param bi род число падеж
     * @return прилагательное
     */
    static convert_adverb_to_adjective(adverb, bi) {
        if (adverb === null || (adverb.length < 4)) 
            return null;
        let last = adverb[adverb.length - 1];
        if (last !== 'О' && last !== 'Е') 
            return adverb;
        let var1 = adverb.substring(0, 0 + adverb.length - 1) + "ИЙ";
        let var2 = adverb.substring(0, 0 + adverb.length - 1) + "ЫЙ";
        let bi1 = Morphology.get_word_base_info(var1, null, false, false);
        let bi2 = Morphology.get_word_base_info(var2, null, false, false);
        let var0 = var1;
        if (!bi1.class0.is_adjective && bi2.class0.is_adjective) 
            var0 = var2;
        if (bi === null) 
            return var0;
        return Utils.notNull(Morphology.m_inner.get_wordform(var0, MorphClass.ADJECTIVE, bi.gender, bi._case, bi.number, MorphLang.UNKNOWN, null), var0);
    }
    
    static static_constructor() {
        Morphology.m_inner = new InnerMorphology();
        Morphology.m_empty_word_forms = new Array();
        Morphology.m_empty_misc = new MorphMiscInfo();
        Morphology.LAZY_LOAD = true;
    }
}


Morphology.static_constructor();

module.exports = Morphology