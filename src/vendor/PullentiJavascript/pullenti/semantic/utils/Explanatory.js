/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ControlModelQuestion = require("./ControlModelQuestion");
const MorphClass = require("./../../morph/MorphClass");
const MorphLang = require("./../../morph/MorphLang");
const DerivateDictionary = require("./../internal/DerivateDictionary");
const NextModelHelper = require("./../internal/NextModelHelper");

/**
 * Сервис для получение толковой информации о словах. 
 *  В настоящий момент поддержаны русский и украинский языки.
 */
class Explanatory {
    
    /**
     * Инициализация внутренних словарей. 
     *  Можно не вызывать, но тогда будет автоматически вызвано при первом обращении, 
     *  и соответственно первое обращение отработает на несколько секунд дольше.
     * @param langs по умолчанию, русский с украинским
     */
    static initialize(langs = null) {
        if (langs === null || langs.is_undefined) 
            langs = MorphLang.RU;
        NextModelHelper.initialize();
        ControlModelQuestion.initialize();
        Explanatory.load_languages(langs);
    }
    
    /**
     * [Get] Языки, морфологические словари для которых загружены в память
     */
    static get_loaded_languages() {
        if (Explanatory.m_der_ru.m_all_groups.length > 0) 
            return MorphLang.ooBitor(MorphLang.RU, MorphLang.UA);
        return MorphLang.UNKNOWN;
    }
    
    /**
     * Загрузить язык(и), если они ещё не загружены
     * @param langs 
     */
    static load_languages(langs) {
        if (langs.is_ru || langs.is_ua) {
            if (!Explanatory.m_der_ru.init(MorphLang.RU)) 
                throw new Error("Not found resource file e_ru.dat in Enplanatory");
        }
        if (langs.is_ua) {
        }
    }
    
    /**
     * Выгрузить язык(и), если они больше не нужны
     * @param langs 
     */
    static unload_languages(langs) {
        if (langs.is_ru || langs.is_ua) {
            if (langs.is_ru && langs.is_ua) 
                Explanatory.m_der_ru.unload();
        }
        ;
    }
    
    /**
     * Найти для слова дериативные группы, в которые входит это слово 
     *  (групп может быть несколько, но в большинстве случаев - одна)
     * @param word 
     * @param try_variants 
     * @param lang 
     * @return 
     */
    static find_derivates(word, try_variants = true, lang = null) {
        return Explanatory.m_der_ru.find(word, try_variants, lang);
    }
    
    /**
     * Найти для слова его толковую информацию (среди деривативных групп)
     * @param word нормальная форма слова
     * @param lang возможный язык
     * @return 
     */
    static find_words(word, lang = null) {
        let grs = Explanatory.m_der_ru.find(word, false, lang);
        if (grs === null) 
            return null;
        let res = null;
        for (const g of grs) {
            for (const w of g.words) {
                if (w.spelling === word) {
                    if (res === null) 
                        res = new Array();
                    res.push(w);
                }
            }
        }
        return res;
    }
    
    /**
     * Получить вариант для слова аналог нужного типа. 
     *  Например, для "ГЛАГОЛ" вариант прилагательного: "ГЛАГОЛЬНЫЙ"
     * @param word исходное слово
     * @param cla нужный тип
     * @param lang возможный язык
     * @return вариант или null при ненахождении
     */
    static get_word_class_var(word, cla, lang = null) {
        let grs = Explanatory.m_der_ru.find(word, false, lang);
        if (grs === null) 
            return null;
        for (const g of grs) {
            for (const w of g.words) {
                if (MorphClass.ooEq(w.class0, cla)) 
                    return w.spelling;
            }
        }
        return null;
    }
    
    /**
     * Может ли быть одушевлённым
     * @param word 
     * @param lang язык (по умолчанию, русский)
     * @return 
     */
    static is_animated(word, lang = null) {
        let grs = Explanatory.m_der_ru.find(word, false, lang);
        if (grs === null) 
            return false;
        for (const g of grs) {
            for (const w of g.words) {
                if (w.spelling === word) {
                    if (w.attrs.is_animated) 
                        return true;
                }
            }
        }
        return false;
    }
    
    /**
     * Может ли иметь собственное имя
     * @param word 
     * @param lang язык (по умолчанию, русский)
     * @return 
     */
    static is_named(word, lang = null) {
        let grs = Explanatory.m_der_ru.find(word, false, lang);
        if (grs === null) 
            return false;
        for (const g of grs) {
            for (const w of g.words) {
                if (w.spelling === word) {
                    if (w.attrs.is_named) 
                        return true;
                }
            }
        }
        return false;
    }
    
    /**
     * Не использовать!!!
     * @param dic 
     */
    static set_dictionary(dic) {
        Explanatory.m_der_ru = dic;
    }
    
    static static_constructor() {
        Explanatory.m_der_ru = new DerivateDictionary();
        Explanatory.m_lock = new Object();
    }
}


Explanatory.static_constructor();

module.exports = Explanatory