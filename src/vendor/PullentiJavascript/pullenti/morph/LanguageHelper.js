/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const Hashtable = require("./../unisharp/Hashtable");
const RefOutArgWrapper = require("./../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../unisharp/StringBuilder");

const MorphMood = require("./MorphMood");
const MorphVoice = require("./MorphVoice");
const MorphAspect = require("./MorphAspect");
const MorphForm = require("./MorphForm");
const MorphFinite = require("./MorphFinite");
const MorphNumber = require("./MorphNumber");
const MorphCase = require("./MorphCase");
const UnicodeInfo = require("./internal/UnicodeInfo");
const MorphTense = require("./MorphTense");
const MorphGender = require("./MorphGender");
const MorphPerson = require("./MorphPerson");

/**
 * Служба подержки языков.  
 *  В качестве универсальных идентификаторов языков выступает 2-х символьный идентификатор ISO 639-1. 
 *  Также содержит некоторые полезные функции.
 */
class LanguageHelper {
    
    /**
     * Определить язык для неструктурированного ткста
     * @param text текст
     * @return код языка или null при ненахождении
     */
    static get_language_for_text(text) {
        if (Utils.isNullOrEmpty(text)) 
            return null;
        let i = 0;
        let j = 0;
        let ru_chars = 0;
        let en_chars = 0;
        for (i = 0; i < text.length; i++) {
            let ch = text[i];
            if (!Utils.isLetter(ch)) 
                continue;
            j = ch.charCodeAt(0);
            if (j >= 0x400 && (j < 0x500)) 
                ru_chars++;
            else if (j < 0x80) 
                en_chars++;
        }
        if (((ru_chars > (en_chars * 2))) && ru_chars > 10) 
            return "ru";
        if (ru_chars > 0 && en_chars === 0) 
            return "ru";
        if (en_chars > 0) 
            return "en";
        return null;
    }
    
    static is_latin_char(ch) {
        let ui = UnicodeInfo.ALL_CHARS[ch.charCodeAt(0)];
        return ui.is_latin;
    }
    
    static is_latin(str) {
        if (str === null) 
            return false;
        for (let i = 0; i < str.length; i++) {
            if (!LanguageHelper.is_latin_char(str[i])) {
                if (!Utils.isWhitespace(str[i]) && str[i] !== '-') 
                    return false;
            }
        }
        return true;
    }
    
    static is_cyrillic_char(ch) {
        let ui = UnicodeInfo.ALL_CHARS[ch.charCodeAt(0)];
        return ui.is_cyrillic;
    }
    
    static is_cyrillic(str) {
        if (str === null) 
            return false;
        for (let i = 0; i < str.length; i++) {
            if (!LanguageHelper.is_cyrillic_char(str[i])) {
                if (!Utils.isWhitespace(str[i]) && str[i] !== '-') 
                    return false;
            }
        }
        return true;
    }
    
    static is_hiphen(ch) {
        let ui = UnicodeInfo.ALL_CHARS[ch.charCodeAt(0)];
        return ui.is_hiphen;
    }
    
    /**
     * Проверка, что это гласная на кириллице
     * @param ch 
     * @return 
     */
    static is_cyrillic_vowel(ch) {
        let ui = UnicodeInfo.ALL_CHARS[ch.charCodeAt(0)];
        return ui.is_cyrillic && ui.is_vowel;
    }
    
    /**
     * Проверка, что это гласная на латинице
     * @param ch 
     * @return 
     */
    static is_latin_vowel(ch) {
        let ui = UnicodeInfo.ALL_CHARS[ch.charCodeAt(0)];
        return ui.is_latin && ui.is_vowel;
    }
    
    /**
     * Получить для латинской буквы её возможный графический эквивалент на кириллице 
     *  (для тексто-графических замен)
     * @param lat 
     * @return 0 - нет эквивалента
     */
    static get_cyr_for_lat(lat) {
        let i = LanguageHelper.m_lat_chars.indexOf(lat);
        if (i >= 0 && (i < LanguageHelper.m_cyr_chars.length)) 
            return LanguageHelper.m_cyr_chars[i];
        i = LanguageHelper.m_greek_chars.indexOf(lat);
        if (i >= 0 && (i < LanguageHelper.m_cyr_greek_chars.length)) 
            return LanguageHelper.m_cyr_greek_chars[i];
        return String.fromCharCode(0);
    }
    
    /**
     * Получить для кириллической буквы её возможный графический эквивалент на латинице 
     *  (для тексто-графических замен)
     * @param lat 
     * @return 0 - нет эквивалента
     */
    static get_lat_for_cyr(cyr) {
        let i = LanguageHelper.m_cyr_chars.indexOf(cyr);
        if ((i < 0) || i >= LanguageHelper.m_lat_chars.length) 
            return String.fromCharCode(0);
        else 
            return LanguageHelper.m_lat_chars[i];
    }
    
    /**
     * Транслитеральная корректировка
     * @param value 
     * @param prev_value 
     * @param always 
     * @return 
     */
    static transliteral_correction(value, prev_value, always = false) {
        let pure_cyr = 0;
        let pure_lat = 0;
        let ques_cyr = 0;
        let ques_lat = 0;
        let udar_cyr = 0;
        let y = false;
        let udaren = false;
        for (let i = 0; i < value.length; i++) {
            let ch = value[i];
            let ui = UnicodeInfo.ALL_CHARS[ch.charCodeAt(0)];
            if (!ui.is_letter) {
                if (ui.is_udaren) {
                    udaren = true;
                    continue;
                }
                if (ui.is_apos && value.length > 2) 
                    return LanguageHelper.transliteral_correction(Utils.replaceString(value, (ch), ""), prev_value, false);
                return value;
            }
            if (ui.is_cyrillic) {
                if (LanguageHelper.m_cyr_chars.indexOf(ch) >= 0) 
                    ques_cyr++;
                else 
                    pure_cyr++;
            }
            else if (ui.is_latin) {
                if (LanguageHelper.m_lat_chars.indexOf(ch) >= 0) 
                    ques_lat++;
                else 
                    pure_lat++;
            }
            else if (LanguageHelper.m_udar_chars.indexOf(ch) >= 0) 
                udar_cyr++;
            else 
                return value;
            if (ch === 'Ь' && ((i + 1) < value.length) && value[i + 1] === 'I') 
                y = true;
        }
        let to_rus = false;
        let to_lat = false;
        if (pure_lat > 0 && pure_cyr > 0) 
            return value;
        if (((pure_lat > 0 || always)) && ques_cyr > 0) 
            to_lat = true;
        else if (((pure_cyr > 0 || always)) && ques_lat > 0) 
            to_rus = true;
        else if (pure_cyr === 0 && pure_lat === 0) {
            if (ques_cyr > 0 && ques_lat > 0) {
                if (!Utils.isNullOrEmpty(prev_value)) {
                    if (LanguageHelper.is_cyrillic_char(prev_value[0])) 
                        to_rus = true;
                    else if (LanguageHelper.is_latin_char(prev_value[0])) 
                        to_lat = true;
                }
                if (!to_lat && !to_rus) {
                    if (ques_cyr > ques_lat) 
                        to_rus = true;
                    else if (ques_cyr < ques_lat) 
                        to_lat = true;
                }
            }
        }
        if (!to_rus && !to_lat) {
            if (!y && !udaren && udar_cyr === 0) 
                return value;
        }
        let tmp = new StringBuilder(value);
        for (let i = 0; i < tmp.length; i++) {
            if (tmp.charAt(i) === 'Ь' && ((i + 1) < tmp.length) && tmp.charAt(i + 1) === 'I') {
                tmp.setCharAt(i, 'Ы');
                tmp.remove(i + 1, 1);
                continue;
            }
            let cod = tmp.charAt(i).charCodeAt(0);
            if (cod >= 0x300 && (cod < 0x370)) {
                tmp.remove(i, 1);
                continue;
            }
            if (to_rus) {
                let ii = LanguageHelper.m_lat_chars.indexOf(tmp.charAt(i));
                if (ii >= 0) 
                    tmp.setCharAt(i, LanguageHelper.m_cyr_chars[ii]);
                else if ((((ii = LanguageHelper.m_udar_chars.indexOf(tmp.charAt(i))))) >= 0) 
                    tmp.setCharAt(i, LanguageHelper.m_udar_cyr_chars[ii]);
            }
            else if (to_lat) {
                let ii = LanguageHelper.m_cyr_chars.indexOf(tmp.charAt(i));
                if (ii >= 0) 
                    tmp.setCharAt(i, LanguageHelper.m_lat_chars[ii]);
            }
            else {
                let ii = LanguageHelper.m_udar_chars.indexOf(tmp.charAt(i));
                if (ii >= 0) 
                    tmp.setCharAt(i, LanguageHelper.m_udar_cyr_chars[ii]);
            }
        }
        return tmp.toString();
    }
    
    static is_quote(ch) {
        let ui = UnicodeInfo.ALL_CHARS[ch.charCodeAt(0)];
        return ui.is_quot;
    }
    
    static is_apos(ch) {
        let ui = UnicodeInfo.ALL_CHARS[ch.charCodeAt(0)];
        return ui.is_apos;
    }
    
    /**
     * Получить возможные падежи существительных после предлогов
     * @param prep предлог
     * @return 
     */
    static get_case_after_preposition(prep) {
        let mc = null;
        let wrapmc44 = new RefOutArgWrapper();
        let inoutres45 = LanguageHelper.m_prep_cases.tryGetValue(prep, wrapmc44);
        mc = wrapmc44.value;
        if (inoutres45) 
            return mc;
        else 
            return MorphCase.UNDEFINED;
    }
    
    static normalize_preposition(prep) {
        let res = null;
        let wrapres46 = new RefOutArgWrapper();
        let inoutres47 = LanguageHelper.m_prep_norms.tryGetValue(prep, wrapres46);
        res = wrapres46.value;
        if (inoutres47) 
            return res;
        else 
            return prep;
    }
    
    /**
     * Замена стандартной функции, которая очень тормозит
     * @param str 
     * @param substr 
     * @return 
     */
    static ends_with(str, substr) {
        if (str === null || substr === null) 
            return false;
        let i = str.length - 1;
        let j = substr.length - 1;
        if (j > i || (j < 0)) 
            return false;
        for (; j >= 0; j--,i--) {
            if (str[i] !== substr[j]) 
                return false;
        }
        return true;
    }
    
    /**
     * Проверка окончания строки на одну из заданных подстрок
     * @param str 
     * @param substr 
     * @param substr2 
     * @param substr3 
     * @param substr4 
     * @return 
     */
    static ends_with_ex(str, substr, substr2, substr3 = null, substr4 = null) {
        if (str === null) 
            return false;
        for (let k = 0; k < 4; k++) {
            if (k === 1) 
                substr = substr2;
            else if (k === 2) 
                substr = substr3;
            else if (k === 3) 
                substr = substr4;
            if (substr === null) 
                continue;
            let i = str.length - 1;
            let j = substr.length - 1;
            if (j > i || (j < 0)) 
                continue;
            for (; j >= 0; j--,i--) {
                if (str[i] !== substr[j]) 
                    break;
            }
            if (j < 0) 
                return true;
        }
        return false;
    }
    
    static to_string_morph_tense(tense) {
        let res = new StringBuilder();
        if ((((tense.value()) & (MorphTense.PAST.value()))) !== (MorphTense.UNDEFINED.value())) 
            res.append("прошедшее|");
        if ((((tense.value()) & (MorphTense.PRESENT.value()))) !== (MorphTense.UNDEFINED.value())) 
            res.append("настоящее|");
        if ((((tense.value()) & (MorphTense.FUTURE.value()))) !== (MorphTense.UNDEFINED.value())) 
            res.append("будущее|");
        if (res.length > 0) 
            res.length = res.length - 1;
        return res.toString();
    }
    
    static to_string_morph_person(person) {
        let res = new StringBuilder();
        if ((((person.value()) & (MorphPerson.FIRST.value()))) !== (MorphPerson.UNDEFINED.value())) 
            res.append("1лицо|");
        if ((((person.value()) & (MorphPerson.SECOND.value()))) !== (MorphPerson.UNDEFINED.value())) 
            res.append("2лицо|");
        if ((((person.value()) & (MorphPerson.THIRD.value()))) !== (MorphPerson.UNDEFINED.value())) 
            res.append("3лицо|");
        if (res.length > 0) 
            res.length = res.length - 1;
        return res.toString();
    }
    
    static to_string_morph_gender(gender) {
        let res = new StringBuilder();
        if ((((gender.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
            res.append("муж.|");
        if ((((gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) 
            res.append("жен.|");
        if ((((gender.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value())) 
            res.append("средн.|");
        if (res.length > 0) 
            res.length = res.length - 1;
        return res.toString();
    }
    
    static to_string_morph_number(number) {
        let res = new StringBuilder();
        if ((((number.value()) & (MorphNumber.SINGULAR.value()))) !== (MorphNumber.UNDEFINED.value())) 
            res.append("единств.|");
        if ((((number.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
            res.append("множеств.|");
        if (res.length > 0) 
            res.length = res.length - 1;
        return res.toString();
    }
    
    static to_string_morph_voice(voice) {
        let res = new StringBuilder();
        if ((((voice.value()) & (MorphVoice.ACTIVE.value()))) !== (MorphVoice.UNDEFINED.value())) 
            res.append("действит.|");
        if ((((voice.value()) & (MorphVoice.PASSIVE.value()))) !== (MorphVoice.UNDEFINED.value())) 
            res.append("страдат.|");
        if ((((voice.value()) & (MorphVoice.MIDDLE.value()))) !== (MorphVoice.UNDEFINED.value())) 
            res.append("средн.|");
        if (res.length > 0) 
            res.length = res.length - 1;
        return res.toString();
    }
    
    static to_string_morph_mood(mood) {
        let res = new StringBuilder();
        if ((((mood.value()) & (MorphMood.INDICATIVE.value()))) !== (MorphMood.UNDEFINED.value())) 
            res.append("изъявит.|");
        if ((((mood.value()) & (MorphMood.IMPERATIVE.value()))) !== (MorphMood.UNDEFINED.value())) 
            res.append("повелит.|");
        if ((((mood.value()) & (MorphMood.SUBJUNCTIVE.value()))) !== (MorphMood.UNDEFINED.value())) 
            res.append("условн.|");
        if (res.length > 0) 
            res.length = res.length - 1;
        return res.toString();
    }
    
    static to_string_morph_aspect(aspect) {
        let res = new StringBuilder();
        if ((((aspect.value()) & (MorphAspect.IMPERFECTIVE.value()))) !== (MorphAspect.UNDEFINED.value())) 
            res.append("несоверш.|");
        if ((((aspect.value()) & (MorphAspect.PERFECTIVE.value()))) !== (MorphAspect.UNDEFINED.value())) 
            res.append("соверш.|");
        if (res.length > 0) 
            res.length = res.length - 1;
        return res.toString();
    }
    
    static to_string_morph_finite(finit) {
        let res = new StringBuilder();
        if ((((finit.value()) & (MorphFinite.FINITE.value()))) !== (MorphFinite.UNDEFINED.value())) 
            res.append("finite|");
        if ((((finit.value()) & (MorphFinite.GERUND.value()))) !== (MorphFinite.UNDEFINED.value())) 
            res.append("gerund|");
        if ((((finit.value()) & (MorphFinite.INFINITIVE.value()))) !== (MorphFinite.UNDEFINED.value())) 
            res.append("инфинитив|");
        if ((((finit.value()) & (MorphFinite.PARTICIPLE.value()))) !== (MorphFinite.UNDEFINED.value())) 
            res.append("participle|");
        if (res.length > 0) 
            res.length = res.length - 1;
        return res.toString();
    }
    
    static to_string_morph_form(form) {
        let res = new StringBuilder();
        if ((((form.value()) & (MorphForm.SHORT.value()))) !== (MorphForm.UNDEFINED.value())) 
            res.append("кратк.|");
        if ((((form.value()) & (MorphForm.SYNONYM.value()))) !== (MorphForm.UNDEFINED.value())) 
            res.append("синонимич.|");
        if (res.length > 0) 
            res.length = res.length - 1;
        return res.toString();
    }
    
    /**
     * Откорректировать слово (перевод в верхний регистр и замена некоторых букв типа Ё->Е)
     * @param w исходное слово
     * @return откорректированное слово
     */
    static correct_word(w) {
        if (w === null) 
            return null;
        w = w.toUpperCase();
        for (const ch of w) {
            if (LanguageHelper.m_rus0.indexOf(ch) >= 0) {
                let tmp = new StringBuilder();
                tmp.append(w);
                for (let i = 0; i < tmp.length; i++) {
                    let j = LanguageHelper.m_rus0.indexOf(tmp.charAt(i));
                    if (j >= 0) 
                        tmp.setCharAt(i, LanguageHelper.m_rus1[j]);
                }
                w = tmp.toString();
                break;
            }
        }
        if (w.indexOf(String.fromCharCode(0x00AD)) >= 0) 
            w = Utils.replaceString(w, String.fromCharCode(0x00AD), '-');
        if (w.startsWith("АГЕНС")) 
            w = "АГЕНТС" + w.substring(5);
        return w;
    }
    
    static static_constructor() {
        LanguageHelper.m_lat_chars = "ABEKMHOPCTYXIaekmopctyxi";
        LanguageHelper.m_cyr_chars = "АВЕКМНОРСТУХІаекморстухі";
        LanguageHelper.m_greek_chars = "ΑΒΓΕΗΙΚΛΜΟΠΡΤΥΦΧ";
        LanguageHelper.m_cyr_greek_chars = "АВГЕНІКЛМОПРТУФХ";
        LanguageHelper.m_udar_chars = "ÀÁÈÉËÒÓàáèéëýÝòóЀѐЍѝỲỳ";
        LanguageHelper.m_udar_cyr_chars = "ААЕЕЕООааеееуУооЕеИиУу";
        LanguageHelper.m_preps = [("БЕЗ;ДО;ИЗ;ИЗЗА;ОТ;У;ДЛЯ;РАДИ;ВОЗЛЕ;ПОЗАДИ;ВПЕРЕДИ;БЛИЗ;ВБЛИЗИ;ВГЛУБЬ;ВВИДУ;ВДОЛЬ;ВЗАМЕН;ВКРУГ;ВМЕСТО;" + "ВНЕ;ВНИЗУ;ВНУТРИ;ВНУТРЬ;ВОКРУГ;ВРОДЕ;ВСЛЕД;ВСЛЕДСТВИЕ;ЗАМЕСТО;ИЗНУТРИ;КАСАТЕЛЬНО;КРОМЕ;" + "МИМО;НАВРОДЕ;НАЗАД;НАКАНУНЕ;НАПОДОБИЕ;НАПРОТИВ;НАСЧЕТ;ОКОЛО;ОТНОСИТЕЛЬНО;") + "ПОВЕРХ;ПОДЛЕ;ПОМИМО;ПОПЕРЕК;ПОРЯДКА;ПОСЕРЕДИНЕ;ПОСРЕДИ;ПОСЛЕ;ПРЕВЫШЕ;ПРЕЖДЕ;ПРОТИВ;СВЕРХ;" + "СВЫШЕ;СНАРУЖИ;СРЕДИ;СУПРОТИВ;ПУТЕМ;ПОСРЕДСТВОМ", "К;БЛАГОДАРЯ;ВОПРЕКИ;НАВСТРЕЧУ;СОГЛАСНО;СООБРАЗНО;ПАРАЛЛЕЛЬНО;ПОДОБНО;СООТВЕТСТВЕННО;СОРАЗМЕРНО", "ПРО;ЧЕРЕЗ;СКВОЗЬ;СПУСТЯ", "НАД;ПЕРЕД;ПРЕД", "ПРИ", "В;НА;О;ВКЛЮЧАЯ", "МЕЖДУ", "ЗА;ПОД", "ПО", "С"];
        LanguageHelper.m_cases = [MorphCase.GENITIVE, MorphCase.DATIVE, MorphCase.ACCUSATIVE, MorphCase.INSTRUMENTAL, MorphCase.PREPOSITIONAL, MorphCase.ooBitor(MorphCase.ACCUSATIVE, MorphCase.PREPOSITIONAL), MorphCase.ooBitor(MorphCase.GENITIVE, MorphCase.INSTRUMENTAL), MorphCase.ooBitor(MorphCase.ACCUSATIVE, MorphCase.INSTRUMENTAL), MorphCase.ooBitor(MorphCase.DATIVE, MorphCase.ooBitor(MorphCase.ACCUSATIVE, MorphCase.PREPOSITIONAL)), MorphCase.ooBitor(MorphCase.GENITIVE, MorphCase.ooBitor(MorphCase.ACCUSATIVE, MorphCase.INSTRUMENTAL))];
        LanguageHelper.m_prep_cases = null;
        LanguageHelper.m_prep_norms_src = ["БЕЗ;БЕЗО", "ВБЛИЗИ;БЛИЗ", "В;ВО", "ВОКРУГ;ВКРУГ", "ВНУТРИ;ВНУТРЬ;ВОВНУТРЬ", "ВПЕРЕДИ;ВПЕРЕД", "ВСЛЕД;ВОСЛЕД", "ВМЕСТО;ЗАМЕСТО", "ИЗ;ИЗО", "К;КО", "МЕЖДУ;МЕЖ;ПРОМЕЖДУ;ПРОМЕЖ", "НАД;НАДО", "О;ОБ;ОБО", "ОТ;ОТО", "ПЕРЕД;ПРЕД;ПРЕДО;ПЕРЕДО", "ПОД;ПОДО", "ПОСЕРЕДИНЕ;ПОСРЕДИ;ПОСЕРЕДЬ", "С;СО", "СРЕДИ;СРЕДЬ;СЕРЕДЬ", "ЧЕРЕЗ;ЧРЕЗ"];
        LanguageHelper.m_prep_norms = null;
        LanguageHelper.m_rus0 = "–ЁѐЀЍѝЎўӢӣ";
        LanguageHelper.m_rus1 = "-ЕЕЕИИУУЙЙ";
        LanguageHelper.m_prep_cases = new Hashtable();
        for (let i = 0; i < LanguageHelper.m_preps.length; i++) {
            for (const v of Utils.splitString(LanguageHelper.m_preps[i], ';', false)) {
                LanguageHelper.m_prep_cases.put(v, LanguageHelper.m_cases[i]);
            }
        }
        LanguageHelper.m_prep_norms = new Hashtable();
        for (const s of LanguageHelper.m_prep_norms_src) {
            let vars = Utils.splitString(s, ';', false);
            for (let i = 1; i < vars.length; i++) {
                LanguageHelper.m_prep_norms.put(vars[i], vars[0]);
            }
        }
    }
}


LanguageHelper.static_constructor();

module.exports = LanguageHelper