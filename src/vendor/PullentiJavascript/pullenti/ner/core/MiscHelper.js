/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphCase = require("./../../morph/MorphCase");
const LanguageHelper = require("./../../morph/LanguageHelper");
const NounPhraseParseAttr = require("./NounPhraseParseAttr");
const GetTextAttr = require("./GetTextAttr");
const NumberSpellingType = require("./../NumberSpellingType");
const RusLatAccord = require("./internal/RusLatAccord");
const MorphClass = require("./../../morph/MorphClass");
const TextToken = require("./../TextToken");
const MetaToken = require("./../MetaToken");
const NounPhraseHelper = require("./NounPhraseHelper");
const MorphNumber = require("./../../morph/MorphNumber");
const ReferentToken = require("./../ReferentToken");
const MorphGender = require("./../../morph/MorphGender");
const Token = require("./../Token");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const MorphWordForm = require("./../../morph/MorphWordForm");
const Morphology = require("./../../morph/Morphology");
const CanBeEqualsAttrs = require("./CanBeEqualsAttrs");
const CharsInfo = require("./../../morph/CharsInfo");
const NumberToken = require("./../NumberToken");
const ProcessorService = require("./../ProcessorService");
const SourceOfAnalysis = require("./../SourceOfAnalysis");
const AnalysisKit = require("./AnalysisKit");

/**
 * Разные полезные процедурки
 */
class MiscHelper {
    
    /**
     * Сравнение, чтобы не было больше одной ошибки в написании. 
     *  Ошибка - это замена буквы или пропуск буквы.
     * @param value правильное написание
     * @param t проверяемый токен
     * @return 
     */
    static is_not_more_than_one_error(value, t) {
        if (t === null) 
            return false;
        if (t instanceof TextToken) {
            let tt = Utils.as(t, TextToken);
            if (t.is_value(value, null)) 
                return true;
            if (MiscHelper._is_not_more_than_one_error(value, tt.term, true)) 
                return true;
            for (const wf of tt.morph.items) {
                if (wf instanceof MorphWordForm) {
                    if (MiscHelper._is_not_more_than_one_error(value, (wf).normal_case, true)) 
                        return true;
                }
            }
        }
        else if ((t instanceof MetaToken) && (t).begin_token === (t).end_token) 
            return MiscHelper.is_not_more_than_one_error(value, (t).begin_token);
        else if (MiscHelper._is_not_more_than_one_error(value, t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false), true)) 
            return true;
        return false;
    }
    
    static _is_not_more_than_one_error(pattern, test, tmp = false) {
        if (test === null || pattern === null) 
            return false;
        if (test.length === pattern.length) {
            let cou = 0;
            for (let i = 0; i < pattern.length; i++) {
                if (pattern[i] !== test[i]) {
                    if ((++cou) > 1) 
                        return false;
                }
            }
            return true;
        }
        if (test.length === (pattern.length - 1)) {
            let i = 0;
            for (i = 0; i < test.length; i++) {
                if (pattern[i] !== test[i]) 
                    break;
            }
            if (i < 2) 
                return false;
            if (i === test.length) 
                return true;
            for (; i < test.length; i++) {
                if (pattern[i + 1] !== test[i]) 
                    return false;
            }
            return true;
        }
        if (!tmp && (test.length - 1) === pattern.length) {
            let i = 0;
            for (i = 0; i < pattern.length; i++) {
                if (pattern[i] !== test[i]) 
                    break;
            }
            if (i < 2) 
                return false;
            if (i === pattern.length) 
                return true;
            for (; i < pattern.length; i++) {
                if (pattern[i] !== test[i + 1]) 
                    return false;
            }
            return true;
        }
        return false;
    }
    
    /**
     * Проверить написание слова вразбивку по буквам (например:   П Р И К А З)
     * @param word проверяемое слово
     * @param t начальный токен
     * @param use_morph_variants перебирать ли падежи у слова
     * @return токен последней буквы или null
     */
    static try_attach_word_by_letters(word, t, use_morph_variants = false) {
        let t1 = Utils.as(t, TextToken);
        if (t1 === null) 
            return null;
        let i = 0;
        let j = 0;
        for (; t1 !== null; t1 = Utils.as(t1.next, TextToken)) {
            let s = t1.term;
            for (j = 0; (j < s.length) && ((i + j) < word.length); j++) {
                if (word[i + j] !== s[j]) 
                    break;
            }
            if (j < s.length) {
                if (!use_morph_variants) 
                    return null;
                if (i < 7) 
                    return null;
                let tmp = new StringBuilder();
                tmp.append(word.substring(0, 0 + i));
                for (let tt = t1; tt !== null; tt = tt.next) {
                    if (!((tt instanceof TextToken)) || !tt.chars.is_letter || tt.is_newline_before) 
                        break;
                    t1 = Utils.as(tt, TextToken);
                    tmp.append(t1.term);
                }
                let li = Morphology.process(tmp.toString(), t.morph.language, null);
                if (li !== null) {
                    for (const l_ of li) {
                        if (l_.word_forms !== null) {
                            for (const wf of l_.word_forms) {
                                if (wf.normal_case === word || wf.normal_full === word) 
                                    return t1;
                            }
                        }
                    }
                }
                return null;
            }
            i += j;
            if (i === word.length) 
                return t1;
        }
        return null;
    }
    
    /**
     * Сравнение 2-х строк на предмет равенства с учётом морфологии и пунктуации (то есть инвариантно относительно них). 
     *  Функция довольно трудоёмка, не использовать без крайней необходимости. 
     *  ВНИМАНИЕ! Вместо этой функции теперь используйте CanBeEqualsEx.
     * @param s1 первая строка
     * @param s2 вторая строка
     * @param ignore_nonletters игнорировать небуквенные символы
     * @param ignore_case игнорировать регистр символов
     * @param check_morph_equ_after_first_noun после первого существительного слова должны полностью совпадать
     * @return 
     */
    static can_be_equals(s1, s2, ignore_nonletters = true, ignore_case = true, check_morph_equ_after_first_noun = false) {
        let attrs = CanBeEqualsAttrs.NO;
        if (ignore_nonletters) 
            attrs = CanBeEqualsAttrs.of((attrs.value()) | (CanBeEqualsAttrs.IGNORENONLETTERS.value()));
        if (ignore_case) 
            attrs = CanBeEqualsAttrs.of((attrs.value()) | (CanBeEqualsAttrs.IGNOREUPPERCASE.value()));
        if (check_morph_equ_after_first_noun) 
            attrs = CanBeEqualsAttrs.of((attrs.value()) | (CanBeEqualsAttrs.CHECKMORPHEQUAFTERFIRSTNOUN.value()));
        return MiscHelper.can_be_equals_ex(s1, s2, attrs);
    }
    
    /**
     * Сравнение 2-х строк на предмет равенства с учётом морфологии и пунктуации (то есть инвариантно относительно них). 
     *  Функция довольно трудоёмка, не использовать без крайней необходимости.
     * @param s1 первая строка
     * @param s2 вторая строка
     * @param attrs дополнительные атрибуты
     * @return 
     */
    static can_be_equals_ex(s1, s2, attrs) {
        const BracketHelper = require("./BracketHelper");
        if (Utils.isNullOrEmpty(s1) || Utils.isNullOrEmpty(s2)) 
            return false;
        if (s1 === s2) 
            return true;
        let ak1 = new AnalysisKit(new SourceOfAnalysis(s1));
        let ak2 = new AnalysisKit(new SourceOfAnalysis(s2));
        let t1 = ak1.first_token;
        let t2 = ak2.first_token;
        let was_noun = false;
        while (t1 !== null || t2 !== null) {
            if (t1 !== null) {
                if (t1 instanceof TextToken) {
                    if (!t1.chars.is_letter && !t1.is_char('№')) {
                        if (BracketHelper.is_bracket(t1, false) && (((attrs.value()) & (CanBeEqualsAttrs.USEBRACKETS.value()))) !== (CanBeEqualsAttrs.NO.value())) {
                        }
                        else {
                            if (t1.is_hiphen) 
                                was_noun = false;
                            if (((!t1.is_char_of("()") && !t1.is_hiphen)) || (((attrs.value()) & (CanBeEqualsAttrs.IGNORENONLETTERS.value()))) !== (CanBeEqualsAttrs.NO.value())) {
                                t1 = t1.next;
                                continue;
                            }
                        }
                    }
                }
            }
            if (t2 !== null) {
                if (t2 instanceof TextToken) {
                    if (!t2.chars.is_letter && !t2.is_char('№')) {
                        if (BracketHelper.is_bracket(t2, false) && (((attrs.value()) & (CanBeEqualsAttrs.USEBRACKETS.value()))) !== (CanBeEqualsAttrs.NO.value())) {
                        }
                        else {
                            if (t2.is_hiphen) 
                                was_noun = false;
                            if (((!t2.is_char_of("()") && !t2.is_hiphen)) || (((attrs.value()) & (CanBeEqualsAttrs.IGNORENONLETTERS.value()))) !== (CanBeEqualsAttrs.NO.value())) {
                                t2 = t2.next;
                                continue;
                            }
                        }
                    }
                }
            }
            if (t1 instanceof NumberToken) {
                if (!((t2 instanceof NumberToken))) 
                    break;
                if ((t1).value !== (t2).value) 
                    break;
                t1 = t1.next;
                t2 = t2.next;
                continue;
            }
            if (!((t1 instanceof TextToken)) || !((t2 instanceof TextToken))) 
                break;
            if ((((attrs.value()) & (CanBeEqualsAttrs.IGNOREUPPERCASE.value()))) === (CanBeEqualsAttrs.NO.value())) {
                if (t1.previous === null && (((attrs.value()) & (CanBeEqualsAttrs.IGNOREUPPERCASEFIRSTWORD.value()))) !== (CanBeEqualsAttrs.NO.value())) {
                }
                else if (CharsInfo.ooNoteq(t1.chars, t2.chars)) 
                    return false;
            }
            if (!t1.chars.is_letter) {
                let bs1 = BracketHelper.can_be_start_of_sequence(t1, false, false);
                let bs2 = BracketHelper.can_be_start_of_sequence(t2, false, false);
                if (bs1 !== bs2) 
                    return false;
                if (bs1) {
                    t1 = t1.next;
                    t2 = t2.next;
                    continue;
                }
                bs1 = BracketHelper.can_be_end_of_sequence(t1, false, null, false);
                bs2 = BracketHelper.can_be_end_of_sequence(t2, false, null, false);
                if (bs1 !== bs2) 
                    return false;
                if (bs1) {
                    t1 = t1.next;
                    t2 = t2.next;
                    continue;
                }
                if (t1.is_hiphen && t2.is_hiphen) {
                }
                else if ((t1).term !== (t2).term) 
                    return false;
                t1 = t1.next;
                t2 = t2.next;
                continue;
            }
            let ok = false;
            if (was_noun && (((attrs.value()) & (CanBeEqualsAttrs.CHECKMORPHEQUAFTERFIRSTNOUN.value()))) !== (CanBeEqualsAttrs.NO.value())) {
                if ((t1).term === (t2).term) 
                    ok = true;
            }
            else {
                let tt = Utils.as(t1, TextToken);
                for (const it of tt.morph.items) {
                    if (it instanceof MorphWordForm) {
                        let wf = Utils.as(it, MorphWordForm);
                        if (t2.is_value(wf.normal_case, null) || t2.is_value(wf.normal_full, null)) {
                            ok = true;
                            break;
                        }
                    }
                }
                if (tt.get_morph_class_in_dictionary().is_noun) 
                    was_noun = true;
                if (!ok && t1.is_hiphen && t2.is_hiphen) 
                    ok = true;
                if (!ok) {
                    if (t2.is_value(tt.term, null) || t2.is_value(tt.lemma, null)) 
                        ok = true;
                }
            }
            if (ok) {
                t1 = t1.next;
                t2 = t2.next;
                continue;
            }
            break;
        }
        if ((((attrs.value()) & (CanBeEqualsAttrs.FIRSTCANBESHORTER.value()))) !== (CanBeEqualsAttrs.NO.value())) {
            if (t1 === null) 
                return true;
        }
        return t1 === null && t2 === null;
    }
    
    /**
     * Проверка того, может ли здесь начинаться новое предложение
     * @param t токен начала предложения
     * @return 
     */
    static can_be_start_of_sentence(t) {
        if (t === null) 
            return false;
        if (t.previous === null) 
            return true;
        if (!t.is_whitespace_before) {
            if (t.previous !== null && t.previous.is_table_control_char) {
            }
            else 
                return false;
        }
        if (t.chars.is_letter && t.chars.is_all_lower) {
            if (t.previous.chars.is_letter && t.previous.chars.is_all_lower) 
                return false;
            if (((t.previous.is_hiphen || t.previous.is_comma)) && !t.previous.is_whitespace_before && t.previous.previous !== null) {
                if (t.previous.previous.chars.is_letter && t.previous.previous.chars.is_all_lower) 
                    return false;
            }
        }
        if (t.whitespaces_before_count > 25 || t.newlines_before_count > 2) 
            return true;
        if (t.previous.is_comma_and || t.previous.morph.class0.is_conjunction) 
            return false;
        if (MiscHelper.is_eng_article(t.previous)) 
            return false;
        if (t.previous.is_char(':')) 
            return false;
        if (t.previous.is_char(';') && t.is_newline_before) 
            return true;
        if (t.previous.is_hiphen) {
            if (t.previous.is_newline_before) 
                return true;
            let pp = t.previous.previous;
            if (pp !== null && pp.is_char('.')) 
                return true;
        }
        if (t.chars.is_letter && t.chars.is_all_lower) 
            return false;
        if (t.is_newline_before) 
            return true;
        if (t.previous.is_char_of("!?") || t.previous.is_table_control_char) 
            return true;
        if (t.previous.is_char('.') || (((t.previous instanceof ReferentToken) && (t.previous).end_token.is_char('.')))) {
            if (t.whitespaces_before_count > 1) 
                return true;
            if (t.next !== null && t.next.is_char('.')) {
                if ((t.previous.previous instanceof TextToken) && t.previous.previous.chars.is_all_lower) {
                }
                else if (t.previous.previous instanceof ReferentToken) {
                }
                else 
                    return false;
            }
            if ((t.previous.previous instanceof NumberToken) && t.previous.is_whitespace_before) {
                if ((t.previous.previous).typ !== NumberSpellingType.WORDS) 
                    return false;
            }
            return true;
        }
        if (MiscHelper.is_eng_article(t)) 
            return true;
        return false;
    }
    
    /**
     * Переместиться на конец предложения
     * @param t токен, с которого идёт поиск
     * @return последний токен предложения (не обязательно точка!)
     */
    static find_end_of_sentence(t) {
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt.next === null) 
                return tt;
            else if (MiscHelper.can_be_start_of_sentence(tt)) 
                return (tt === t ? t : tt.previous);
        }
        return null;
    }
    
    /**
     * Привязка различных способов написания ключевых слов для номеров (ном., №, рег.номер и пр.)
     * @param t начало префикса
     * @return null, если не префикс, или токен, следующий сразу за префиксом номера
     */
    static check_number_prefix(t) {
        if (!((t instanceof TextToken))) 
            return null;
        let s = (t).term;
        let t1 = null;
        if (t.is_value("ПО", null) && t.next !== null) 
            t = t.next;
        if ((((t.is_value("РЕГИСТРАЦИОННЫЙ", "РЕЄСТРАЦІЙНИЙ") || t.is_value("ГОСУДАРСТВЕННЫЙ", "ДЕРЖАВНИЙ") || t.is_value("ТРАНЗИТНЫЙ", "ТРАНЗИТНИЙ")) || t.is_value("ДЕЛО", null) || t.is_value("СПРАВА", null))) && (t.next instanceof TextToken)) {
            t = t.next;
            s = (t).term;
        }
        else if (s === "РЕГ" || s === "ГОС" || s === "ТРАНЗ") {
            if (t.next !== null && t.next.is_char('.')) 
                t = t.next;
            if (t.next instanceof TextToken) {
                t = t.next;
                s = (t).term;
            }
            else 
                return null;
        }
        if (((s === "НОМЕР" || s === "№" || s === "N") || s === "NO" || s === "NN") || s === "НР") {
            t1 = t.next;
            if (t1 !== null && ((t1.is_char_of("°№") || t1.is_value("О", null)))) 
                t1 = t1.next;
            if (t1 !== null && t1.is_char('.')) 
                t1 = t1.next;
            if (t1 !== null && t1.is_char(':')) 
                t1 = t1.next;
        }
        else if (s === "НОМ") {
            t1 = t.next;
            if (t1 !== null && t1.is_char('.')) 
                t1 = t1.next;
        }
        while (t1 !== null) {
            if (t1.is_value("ЗАПИСЬ", null)) 
                t1 = t1.next;
            else if (t1.is_value("В", null) && t1.next !== null && t1.next.is_value("РЕЕСТР", null)) 
                t1 = t1.next.next;
            else 
                break;
        }
        return t1;
    }
    
    static _corr_xml_text(txt) {
        if (txt === null) 
            return "";
        for (const c of txt) {
            if ((((c.charCodeAt(0)) < 0x20) && c !== '\r' && c !== '\n') && c !== '\t') {
                let tmp = new StringBuilder(txt);
                for (let i = 0; i < tmp.length; i++) {
                    let ch = tmp.charAt(i);
                    if ((((ch.charCodeAt(0)) < 0x20) && ch !== '\r' && ch !== '\n') && ch !== '\t') 
                        tmp.setCharAt(i, ' ');
                }
                return tmp.toString();
            }
        }
        return txt;
    }
    
    /**
     * Преобразовать строку чтобы первая буква стала большой, остальные маленькие
     * @param str 
     * @return 
     */
    static convert_first_char_upper_and_other_lower(str) {
        if (Utils.isNullOrEmpty(str)) 
            return str;
        let fstr_tmp = new StringBuilder();
        fstr_tmp.append(str.toLowerCase());
        let i = 0;
        let up = true;
        fstr_tmp.replace(" .", ".");
        for (i = 0; i < fstr_tmp.length; i++) {
            if (Utils.isLetter(fstr_tmp.charAt(i))) {
                if (up) {
                    if (((i + 1) >= fstr_tmp.length || Utils.isLetter(fstr_tmp.charAt(i + 1)) || ((fstr_tmp.charAt(i + 1) === '.' || fstr_tmp.charAt(i + 1) === '-'))) || i === 0) 
                        fstr_tmp.setCharAt(i, fstr_tmp.charAt(i).toUpperCase());
                }
                up = false;
            }
            else if (!Utils.isDigit(fstr_tmp.charAt(i))) 
                up = true;
        }
        fstr_tmp.replace(" - ", "-");
        return fstr_tmp.toString();
    }
    
    /**
     * Сделать аббревиатуру для строки из нескольких слов
     * @param name 
     * @return 
     */
    static get_abbreviation(name) {
        let abbr = new StringBuilder();
        let i = 0;
        let j = 0;
        for (i = 0; i < name.length; i++) {
            if (Utils.isDigit(name[i])) 
                break;
            else if (Utils.isLetter(name[i])) {
                for (j = i + 1; j < name.length; j++) {
                    if (!Utils.isLetter(name[j])) 
                        break;
                }
                if ((j - i) > 2) {
                    let w = name.substring(i, i + j - i);
                    if (w !== "ПРИ") 
                        abbr.append(name[i]);
                }
                i = j;
            }
        }
        if (abbr.length < 2) 
            return null;
        return abbr.toString().toUpperCase();
    }
    
    /**
     * Получить аббревиатуру (уже не помню, какую именно...)
     * @param name 
     * @return 
     */
    static get_tail_abbreviation(name) {
        let i = 0;
        let j = 0;
        for (i = 0; i < name.length; i++) {
            if (name[i] === ' ') 
                j++;
        }
        if (j < 2) 
            return null;
        let a0 = String.fromCharCode(0);
        let a1 = String.fromCharCode(0);
        j = 0;
        for (i = name.length - 2; i > 0; i--) {
            if (name[i] === ' ') {
                let le = 0;
                for (let jj = i + 1; jj < name.length; jj++) {
                    if (name[jj] === ' ') 
                        break;
                    else 
                        le++;
                }
                if (le < 4) 
                    break;
                if (j === 0) 
                    a1 = name[i + 1];
                else if (j === 1) {
                    a0 = name[i + 1];
                    if (Utils.isLetter(a0) && Utils.isLetter(a1)) 
                        return (name.substring(0, 0 + i) + " " + a0 + a1);
                    break;
                }
                j++;
            }
        }
        return null;
    }
    
    /**
     * Попытка через транслитеральную замену сделать альтернативное написание строки 
     *  Например, А-10 => A-10  (здесь латиница и кириллица)
     * @param str 
     * @return если null, то не получается
     */
    static create_cyr_lat_alternative(str) {
        if (str === null) 
            return null;
        let cyr = 0;
        let cyr_to_lat = 0;
        let lat = 0;
        let lat_to_cyr = 0;
        for (let i = 0; i < str.length; i++) {
            let ch = str[i];
            if (LanguageHelper.is_latin_char(ch)) {
                lat++;
                if (LanguageHelper.get_cyr_for_lat(ch) !== (String.fromCharCode(0))) 
                    lat_to_cyr++;
            }
            else if (LanguageHelper.is_cyrillic_char(ch)) {
                cyr++;
                if (LanguageHelper.get_lat_for_cyr(ch) !== (String.fromCharCode(0))) 
                    cyr_to_lat++;
            }
        }
        if (cyr > 0 && cyr_to_lat === cyr) {
            if (lat > 0) 
                return null;
            let tmp = new StringBuilder(str);
            for (let i = 0; i < tmp.length; i++) {
                if (LanguageHelper.is_cyrillic_char(tmp.charAt(i))) 
                    tmp.setCharAt(i, LanguageHelper.get_lat_for_cyr(tmp.charAt(i)));
            }
            return tmp.toString();
        }
        if (lat > 0 && lat_to_cyr === lat) {
            if (cyr > 0) 
                return null;
            let tmp = new StringBuilder(str);
            for (let i = 0; i < tmp.length; i++) {
                if (LanguageHelper.is_latin_char(tmp.charAt(i))) 
                    tmp.setCharAt(i, LanguageHelper.get_cyr_for_lat(tmp.charAt(i)));
            }
            return tmp.toString();
        }
        return null;
    }
    
    /**
     * Преобразовать слово, написанное по латыни, в варианты на русском языке. 
     *  Например, "Mikhail" -> "Михаил"
     * @param str Строка на латыни
     * @return Варианты на русском языке
     */
    static convert_latin_word_to_russian_variants(str) {
        return MiscHelper._convert_word(str, true);
    }
    
    /**
     * Преобразовать слово, написанное в кириллице, в варианты на латинице.
     * @param str Строка на кириллице
     * @return Варианты на латинице
     */
    static convert_russian_word_to_latin_variants(str) {
        return MiscHelper._convert_word(str, false);
    }
    
    static _convert_word(str, latin_to_rus) {
        if (str === null) 
            return null;
        if (str.length === 0) 
            return null;
        str = str.toUpperCase();
        let res = new Array();
        let vars = new Array();
        let i = 0;
        let j = 0;
        for (i = 0; i < str.length; i++) {
            let v = new Array();
            if (latin_to_rus) 
                j = RusLatAccord.find_accords_lat_to_rus(str, i, v);
            else 
                j = RusLatAccord.find_accords_rus_to_lat(str, i, v);
            if (j < 1) {
                j = 1;
                v.push(str.substring(i, i + 1));
            }
            vars.push(v);
            i += (j - 1);
        }
        if (latin_to_rus && ("AEIJOUY".indexOf(str[str.length - 1]) < 0)) {
            let v = new Array();
            v.push("");
            v.push("Ь");
            vars.push(v);
        }
        let fstr_tmp = new StringBuilder();
        let inds = new Array();
        for (i = 0; i < vars.length; i++) {
            inds.push(0);
        }
        while (true) {
            fstr_tmp.length = 0;
            for (i = 0; i < vars.length; i++) {
                if (vars[i].length > 0) 
                    fstr_tmp.append(vars[i][inds[i]]);
            }
            res.push(fstr_tmp.toString());
            for (i = inds.length - 1; i >= 0; i--) {
                inds[i]++;
                if (inds[i] < vars[i].length) 
                    break;
                inds[i] = 0;
            }
            if (i < 0) 
                break;
        }
        return res;
    }
    
    /**
     * Получение абсолютного нормализованного значения (с учётом гласных, удалением невидимых знаков и т.п.). 
     *  Используется для сравнений различных вариантов написаний. 
     *  Преобразования:  гласные заменяются на *, Щ на Ш, Х на Г, одинаковые соседние буквы сливаются, 
     *  Ъ и Ь выбрасываются. 
     *  Например, ХАБИБУЛЛИН -  Г*Б*Б*Л*Н
     * @param str страка
     * @return если null, то не удалось нормализовать (слишком короткий)
     */
    static get_absolute_normal_value(str, get_always = false) {
        let res = new StringBuilder();
        let k = 0;
        for (let i = 0; i < str.length; i++) {
            if (LanguageHelper.is_cyrillic_vowel(str[i]) || str[i] === 'Й' || LanguageHelper.is_latin_vowel(str[i])) {
                if (res.length > 0 && res.charAt(res.length - 1) === '*') {
                }
                else 
                    res.append('*');
            }
            else if (str[i] !== 'Ь' && str[i] !== 'Ъ') {
                let ch = str[i];
                if (ch === 'Щ') 
                    ch = 'Ш';
                if (ch === 'Х') 
                    ch = 'Г';
                if (ch === ' ') 
                    ch = '-';
                res.append(ch);
                k++;
            }
        }
        if (res.length > 0 && res.charAt(res.length - 1) === '*') 
            res.length = res.length - 1;
        for (let i = res.length - 1; i > 0; i--) {
            if (res.charAt(i) === res.charAt(i - 1) && res.charAt(i) !== '*') 
                res.remove(i, 1);
        }
        for (let i = res.length - 1; i > 0; i--) {
            if (res.charAt(i - 1) === '*' && res.charAt(i) === '-') 
                res.remove(i - 1, 1);
        }
        if (!get_always) {
            if ((res.length < 3) || (k < 2)) 
                return null;
        }
        return res.toString();
    }
    
    /**
     * Проверка, что хотя бы одно из слов внутри заданного диапазона находится в морфологическом словаре
     * @param begin 
     * @param end 
     * @param cla 
     * @return 
     */
    static is_exists_in_dictionary(begin, end, cla) {
        let ret = false;
        for (let t = begin; t !== null; t = t.next) {
            let tt = Utils.as(t, TextToken);
            if (tt !== null) {
                if (tt.is_hiphen) 
                    ret = false;
                for (const wf of tt.morph.items) {
                    if (cla.value === (0) || (((cla.value) & (wf.class0.value))) !== 0) {
                        if ((wf instanceof MorphWordForm) && (wf).is_in_dictionary) {
                            ret = true;
                            break;
                        }
                    }
                }
            }
            if (t === end) 
                break;
        }
        return ret;
    }
    
    /**
     * Проверка, что все в заданном диапазоне в нижнем регистре
     * @param begin 
     * @param end 
     * @param error_if_not_text 
     * @return 
     */
    static is_all_characters_lower(begin, end, error_if_not_text = false) {
        for (let t = begin; t !== null; t = t.next) {
            let tt = Utils.as(t, TextToken);
            if (tt === null) {
                if (error_if_not_text) 
                    return false;
            }
            else if (!tt.chars.is_all_lower) 
                return false;
            if (t === end) 
                break;
        }
        return true;
    }
    
    /**
     * Текстовой токен должен иметь гласную
     * @param t токен
     * @return 
     */
    static has_vowel(t) {
        if (t === null) 
            return false;
        let tmp = t.term.normalize('NFD');
        for (const ch of tmp) {
            if (LanguageHelper.is_cyrillic_vowel(ch) || LanguageHelper.is_latin_vowel(ch)) 
                return true;
        }
        return false;
    }
    
    /**
     * Проверка акронима, что из первых букв слов диапазона может получиться проверяемый акроним. 
     *  Например,  РФ = Российская Федерация, ГосПлан = государственный план
     * @param acr акроним
     * @param begin начало диапазона
     * @param end конец диапазона
     * @return 
     */
    static test_acronym(acr, begin, end) {
        if (!((acr instanceof TextToken))) 
            return false;
        if (begin === null || end === null || begin.end_char >= end.begin_char) 
            return false;
        let str = (acr).term;
        let i = 0;
        for (let t = begin; t !== null && t.previous !== end; t = t.next) {
            let tt = Utils.as(t, TextToken);
            if (tt === null) 
                break;
            if (i >= str.length) 
                return false;
            let s = tt.term;
            if (s[0] !== str[i]) 
                return false;
            i++;
        }
        if (i >= str.length) 
            return true;
        return false;
    }
    
    /**
     * Получить вариант на кириллице и\или латинице
     * @param t 
     * @param max_len 
     * @return 
     */
    static get_cyr_lat_word(t, max_len = 0) {
        let tt = Utils.as(t, TextToken);
        if (tt === null) {
            let rt = Utils.as(t, ReferentToken);
            if ((rt !== null && (rt.length_char < 3) && rt.begin_token === rt.end_token) && (rt.begin_token instanceof TextToken)) 
                tt = Utils.as(rt.begin_token, TextToken);
            else 
                return null;
        }
        if (!tt.chars.is_letter) 
            return null;
        let str = tt.get_source_text();
        if (max_len > 0 && str.length > max_len) 
            return null;
        let cyr = new StringBuilder();
        let lat = new StringBuilder();
        for (const s of str) {
            if (LanguageHelper.is_latin_char(s)) {
                if (lat !== null) 
                    lat.append(s);
                let i = MiscHelper.m_lat.indexOf(s);
                if (i < 0) 
                    cyr = null;
                else if (cyr !== null) 
                    cyr.append(MiscHelper.m_cyr[i]);
            }
            else if (LanguageHelper.is_cyrillic_char(s)) {
                if (cyr !== null) 
                    cyr.append(s);
                let i = MiscHelper.m_cyr.indexOf(s);
                if (i < 0) 
                    lat = null;
                else if (lat !== null) 
                    lat.append(MiscHelper.m_lat[i]);
            }
            else 
                return null;
        }
        if (cyr === null && lat === null) 
            return null;
        let res = new MiscHelper.CyrLatWord();
        if (cyr !== null) 
            res.cyr_word = cyr.toString().toUpperCase();
        if (lat !== null) 
            res.lat_word = lat.toString().toUpperCase();
        return res;
    }
    
    /**
     * Проверка на возможную эквивалентность русского и латинского написания одного и того же слова
     * @param t 
     * @param str 
     * @return 
     */
    static can_be_equal_cyr_and_latts(t, str) {
        if (t === null || Utils.isNullOrEmpty(str)) 
            return false;
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return false;
        if (MiscHelper.can_be_equal_cyr_and_latss(tt.term, str)) 
            return true;
        for (const wf of tt.morph.items) {
            if ((wf instanceof MorphWordForm) && MiscHelper.can_be_equal_cyr_and_latss((wf).normal_case, str)) 
                return true;
        }
        return false;
    }
    
    /**
     * Проверка на возможную эквивалентность русского и латинского написания одного и того же слова. 
     *  Например,  ИКЕЯ ? IKEA
     * @param t1 токен на одном языке
     * @param t2 токен на другом языке
     * @return 
     */
    static can_be_equal_cyr_and_lattt(t1, t2) {
        let tt1 = Utils.as(t1, TextToken);
        let tt2 = Utils.as(t2, TextToken);
        if (tt1 === null || tt2 === null) 
            return false;
        if (MiscHelper.can_be_equal_cyr_and_latts(t2, tt1.term)) 
            return true;
        for (const wf of tt1.morph.items) {
            if ((wf instanceof MorphWordForm) && MiscHelper.can_be_equal_cyr_and_latts(t2, (wf).normal_case)) 
                return true;
        }
        return false;
    }
    
    /**
     * Проверка на возможную эквивалентность русского и латинского написания одного и того же слова. 
     *  Например,  ИКЕЯ ? IKEA
     * @param str1 слово на одном языке
     * @param str2 слово на другом языке
     * @return 
     */
    static can_be_equal_cyr_and_latss(str1, str2) {
        if (Utils.isNullOrEmpty(str1) || Utils.isNullOrEmpty(str2)) 
            return false;
        if (LanguageHelper.is_cyrillic_char(str1[0]) && LanguageHelper.is_latin_char(str2[0])) 
            return RusLatAccord.can_be_equals(str1, str2);
        if (LanguageHelper.is_cyrillic_char(str2[0]) && LanguageHelper.is_latin_char(str1[0])) 
            return RusLatAccord.can_be_equals(str2, str1);
        return false;
    }
    
    /**
     * Получить текст, покрываемый метатокеном
     * @param mt метатокен
     * @param attrs атрибуты преобразования текста
     * @return результат
     */
    static get_text_value_of_meta_token(mt, attrs = GetTextAttr.NO) {
        const NounPhraseMultivarToken = require("./NounPhraseMultivarToken");
        if (mt === null) 
            return null;
        if (mt instanceof NounPhraseMultivarToken) {
            let nt = Utils.as(mt, NounPhraseMultivarToken);
            let res = new StringBuilder();
            if (nt.source.preposition !== null) 
                res.append(MiscHelper._get_text_value_(nt.source.preposition.begin_token, nt.source.preposition.end_token, attrs, null)).append(" ");
            for (let k = nt.adj_index1; k <= nt.adj_index2; k++) {
                res.append(MiscHelper._get_text_value_(nt.source.adjectives[k].begin_token, nt.source.adjectives[k].end_token, attrs, null)).append(" ");
            }
            res.append(MiscHelper._get_text_value_(nt.source.noun.begin_token, nt.source.noun.end_token, attrs, null));
            return res.toString();
        }
        return MiscHelper._get_text_value_(mt.begin_token, mt.end_token, attrs, mt.get_referent());
    }
    
    /**
     * Получить текст, задаваемый диапазоном токенов
     * @param begin начальный токен
     * @param end конечный токен
     * @param attrs атрибуты преобразования текста
     * @return результат
     */
    static get_text_value(begin, end, attrs = GetTextAttr.NO) {
        return MiscHelper._get_text_value_(begin, end, attrs, null);
    }
    
    static _get_text_value_(begin, end, attrs, r) {
        const BracketHelper = require("./BracketHelper");
        if (begin === null || end === null || begin.end_char > end.end_char) 
            return null;
        if ((((attrs.value()) & (GetTextAttr.KEEPQUOTES.value()))) === (GetTextAttr.NO.value())) {
            for (; begin !== null && begin.end_char <= end.end_char; begin = begin.next) {
                if (BracketHelper.is_bracket(begin, true)) {
                }
                else 
                    break;
            }
        }
        let res = new StringBuilder();
        if ((begin instanceof MetaToken) && !((begin instanceof NumberToken))) {
            let str = MiscHelper._get_text_value_((begin).begin_token, (begin).end_token, attrs, begin.get_referent());
            if (str !== null) {
                if (end === begin) 
                    return str;
                if ((end instanceof MetaToken) && !((end instanceof NumberToken)) && begin.next === end) {
                    if ((((attrs.value()) & (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()))) === (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()) || (((attrs.value()) & (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()))) === (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value())) {
                        let attrs1 = attrs;
                        if ((((attrs1.value()) & (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()))) === (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value())) 
                            attrs1 = GetTextAttr.of((attrs1.value()) ^ (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()));
                        if ((((attrs1.value()) & (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()))) === (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value())) 
                            attrs1 = GetTextAttr.of((attrs1.value()) ^ (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()));
                        let str0 = MiscHelper._get_text_value_((begin).begin_token, (begin).end_token, attrs1, begin.get_referent());
                        let str1 = MiscHelper._get_text_value_((end).begin_token, (end).end_token, attrs1, begin.get_referent());
                        let ar0 = ProcessorService.get_empty_processor().process(new SourceOfAnalysis((str0 + " " + str1)), null, null);
                        let npt1 = NounPhraseHelper.try_parse(ar0.first_token, NounPhraseParseAttr.NO, 0, null);
                        if (npt1 !== null && npt1.end_token.next === null) 
                            return MiscHelper._get_text_value_(npt1.begin_token, npt1.end_token, attrs, r);
                    }
                }
                res.append(str);
                begin = begin.next;
                if ((((attrs.value()) & (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()))) === (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value())) 
                    attrs = GetTextAttr.of((attrs.value()) ^ (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()));
                if ((((attrs.value()) & (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()))) === (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value())) 
                    attrs = GetTextAttr.of((attrs.value()) ^ (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()));
            }
        }
        let keep_chars = (((attrs.value()) & (GetTextAttr.KEEPREGISTER.value()))) !== (GetTextAttr.NO.value());
        if (keep_chars) {
        }
        let restore_chars_end_pos = -1;
        if ((((attrs.value()) & (GetTextAttr.RESTOREREGISTER.value()))) !== (GetTextAttr.NO.value())) {
            if (!MiscHelper.has_not_all_upper(begin, end)) 
                restore_chars_end_pos = end.end_char;
            else 
                for (let tt1 = begin; tt1 !== null && (tt1.end_char < end.end_char); tt1 = tt1.next) {
                    if (tt1.is_newline_after && !tt1.is_hiphen) {
                        if (!MiscHelper.has_not_all_upper(begin, tt1)) 
                            restore_chars_end_pos = tt1.end_char;
                        break;
                    }
                }
        }
        if ((((attrs.value()) & (((GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()) | (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()))))) !== (GetTextAttr.NO.value())) {
            let npt = NounPhraseHelper.try_parse(begin, NounPhraseParseAttr.PARSEPRONOUNS, 0, null);
            if (npt !== null && npt.end_char <= end.end_char) {
                let str = npt.get_normal_case_text(null, (((attrs.value()) & (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()))) !== (GetTextAttr.NO.value()), npt.morph.gender, keep_chars);
                if (str !== null) {
                    begin = npt.end_token.next;
                    res.append(str);
                    let te = npt.end_token.next;
                    if (((te !== null && te.next !== null && te.is_comma) && (te.next instanceof TextToken) && te.next.end_char <= end.end_char) && te.next.morph.class0.is_verb && te.next.morph.class0.is_adjective) {
                        for (const it of te.next.morph.items) {
                            if (it.gender === npt.morph.gender || (((it.gender.value()) & (npt.morph.gender.value()))) !== (MorphGender.UNDEFINED.value())) {
                                if (!(MorphCase.ooBitand(it._case, npt.morph._case)).is_undefined) {
                                    if (it.number === npt.morph.number || (((it.number.value()) & (npt.morph.number.value()))) !== (MorphNumber.UNDEFINED.value())) {
                                        let var0 = (te.next).term;
                                        if (it instanceof MorphWordForm) 
                                            var0 = (it).normal_case;
                                        let bi = MorphBaseInfo._new564(MorphClass.ADJECTIVE, npt.morph.gender, npt.morph.number, npt.morph.language);
                                        var0 = Morphology.get_wordform(var0, bi);
                                        if (var0 !== null) {
                                            var0 = MiscHelper.corr_chars(var0, te.next.chars, keep_chars, Utils.as(te.next, TextToken));
                                            res.append(", ").append(var0);
                                            te = te.next.next;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    begin = te;
                }
            }
            if ((((attrs.value()) & (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()))) === (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value())) 
                attrs = GetTextAttr.of((attrs.value()) ^ (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()));
            if ((((attrs.value()) & (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()))) === (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value())) 
                attrs = GetTextAttr.of((attrs.value()) ^ (GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()));
        }
        if (begin === null || begin.end_char > end.end_char) 
            return res.toString();
        for (let t = begin; t !== null && t.end_char <= end.end_char; t = t.next) {
            let last = (res.length > 0 ? res.charAt(res.length - 1) : ' ');
            if (t.is_whitespace_before && res.length > 0) {
                if (t.is_hiphen && t.is_whitespace_after && last !== ' ') {
                    res.append(" - ");
                    continue;
                }
                if ((last !== ' ' && !t.is_hiphen && last !== '-') && !BracketHelper.can_be_start_of_sequence(t.previous, false, false)) 
                    res.append(' ');
            }
            if (t.is_table_control_char) {
                if (res.length > 0 && res.charAt(res.length - 1) === ' ') {
                }
                else 
                    res.append(' ');
                continue;
            }
            if ((((attrs.value()) & (GetTextAttr.IGNOREARTICLES.value()))) !== (GetTextAttr.NO.value())) {
                if (MiscHelper.is_eng_adj_suffix(t)) {
                    t = t.next;
                    continue;
                }
                if (MiscHelper.is_eng_article(t)) {
                    if (t.is_whitespace_after) 
                        continue;
                }
            }
            if ((((attrs.value()) & (GetTextAttr.KEEPQUOTES.value()))) === (GetTextAttr.NO.value())) {
                if (BracketHelper.is_bracket(t, true)) {
                    if (res.length > 0 && res.charAt(res.length - 1) !== ' ') 
                        res.append(' ');
                    continue;
                }
            }
            if ((((attrs.value()) & (GetTextAttr.IGNOREGEOREFERENT.value()))) !== (GetTextAttr.NO.value())) {
                if ((t instanceof ReferentToken) && t.get_referent() !== null) {
                    if (t.get_referent().type_name === "GEO") 
                        continue;
                }
            }
            if (t instanceof NumberToken) {
                if ((((attrs.value()) & (GetTextAttr.NORMALIZENUMBERS.value()))) !== (GetTextAttr.NO.value())) {
                    if (res.length > 0 && Utils.isDigit(res.charAt(res.length - 1))) 
                        res.append(' ');
                    res.append((t).value);
                    continue;
                }
            }
            if (t instanceof MetaToken) {
                let str = MiscHelper._get_text_value_((t).begin_token, (t).end_token, attrs, t.get_referent());
                if (!Utils.isNullOrEmpty(str)) {
                    if (Utils.isDigit(str[0]) && res.length > 0 && Utils.isDigit(res.charAt(res.length - 1))) 
                        res.append(' ');
                    res.append(str);
                }
                else 
                    res.append(t.get_source_text());
                continue;
            }
            if (!((t instanceof TextToken))) {
                res.append(t.get_source_text());
                continue;
            }
            if (t.chars.is_letter) {
                let str = (t.end_char <= restore_chars_end_pos ? MiscHelper.rest_chars(Utils.as(t, TextToken), r) : MiscHelper.corr_chars((t).term, t.chars, keep_chars, Utils.as(t, TextToken)));
                res.append(str);
                continue;
            }
            if (last === ' ' && res.length > 0) {
                if (((t.is_hiphen && !t.is_whitespace_after)) || t.is_char_of(",.;!?") || BracketHelper.can_be_end_of_sequence(t, false, null, false)) 
                    res.length = res.length - 1;
            }
            if (t.is_hiphen) {
                res.append('-');
                if (t.is_whitespace_before && t.is_whitespace_after) 
                    res.append(' ');
            }
            else 
                res.append((t).term);
        }
        for (let i = res.length - 1; i >= 0; i--) {
            if (res.charAt(i) === '*' || Utils.isWhitespace(res.charAt(i))) 
                res.length = res.length - 1;
            else if (res.charAt(i) === '>' && (((attrs.value()) & (GetTextAttr.KEEPQUOTES.value()))) === (GetTextAttr.NO.value())) {
                if (res.charAt(0) === '<') {
                    res.length = res.length - 1;
                    res.remove(0, 1);
                    i--;
                }
                else if (begin.previous !== null && begin.previous.is_char('<')) 
                    res.length = res.length - 1;
                else 
                    break;
            }
            else if (res.charAt(i) === ')' && (((attrs.value()) & (GetTextAttr.KEEPQUOTES.value()))) === (GetTextAttr.NO.value())) {
                if (res.charAt(0) === '(') {
                    res.length = res.length - 1;
                    res.remove(0, 1);
                    i--;
                }
                else if (begin.previous !== null && begin.previous.is_char('(')) 
                    res.length = res.length - 1;
                else 
                    break;
            }
            else 
                break;
        }
        return res.toString();
    }
    
    /**
     * Проверка, что это суффикс прилагательного (street's)
     * @param t 
     * @return 
     */
    static is_eng_adj_suffix(t) {
        const BracketHelper = require("./BracketHelper");
        if (t === null) 
            return false;
        if (!BracketHelper.is_bracket(t, true)) 
            return false;
        if ((t.next instanceof TextToken) && (t.next).term === "S") 
            return true;
        return false;
    }
    
    static is_eng_article(t) {
        if (!((t instanceof TextToken)) || !t.chars.is_latin_letter) 
            return false;
        let str = (t).term;
        return ((str === "THE" || str === "A" || str === "AN") || str === "DER" || str === "DIE") || str === "DAS";
    }
    
    static has_not_all_upper(b, e) {
        for (let t = b; t !== null && t.end_char <= e.end_char; t = t.next) {
            if (t instanceof TextToken) {
                if (t.chars.is_letter && !t.chars.is_all_upper) 
                    return true;
            }
            else if (t instanceof MetaToken) {
                if (MiscHelper.has_not_all_upper((t).begin_token, (t).end_token)) 
                    return true;
            }
        }
        return false;
    }
    
    static corr_chars(str, ci, keep_chars, t) {
        if (!keep_chars) 
            return str;
        if (ci.is_all_lower) 
            return str.toLowerCase();
        if (ci.is_capital_upper) 
            return MiscHelper.convert_first_char_upper_and_other_lower(str);
        if (ci.is_all_upper || t === null) 
            return str;
        let src = t.get_source_text();
        if (src.length === str.length) {
            let tmp = new StringBuilder(str);
            for (let i = 0; i < tmp.length; i++) {
                if (Utils.isLetter(src[i]) && Utils.isLowerCase(src[i])) 
                    tmp.setCharAt(i, tmp.charAt(i).toLowerCase());
            }
            str = tmp.toString();
        }
        return str;
    }
    
    static rest_chars(t, r) {
        const BracketHelper = require("./BracketHelper");
        if (!t.chars.is_all_upper || !t.chars.is_letter) 
            return MiscHelper.corr_chars(t.term, t.chars, true, t);
        if (t.term === "Г" || t.term === "ГГ") {
            if (t.previous instanceof NumberToken) 
                return t.term.toLowerCase();
        }
        else if (t.term === "X") {
            if ((t.previous instanceof NumberToken) || ((t.previous !== null && t.previous.is_hiphen))) 
                return t.term.toLowerCase();
        }
        else if (t.term === "N" || t.term === "№") 
            return t.term;
        let can_cap_up = false;
        if (BracketHelper.can_be_start_of_sequence(t.previous, true, false)) 
            can_cap_up = true;
        else if (t.previous !== null && t.previous.is_char('.') && t.is_whitespace_before) 
            can_cap_up = true;
        let stat = t.kit.statistics.get_word_info(t);
        if (stat === null || ((r !== null && ((r.type_name === "DATE" || r.type_name === "DATERANGE"))))) 
            return (can_cap_up ? MiscHelper.convert_first_char_upper_and_other_lower(t.term) : t.term.toLowerCase());
        if (stat.lower_count > 0) 
            return (can_cap_up ? MiscHelper.convert_first_char_upper_and_other_lower(t.term) : t.term.toLowerCase());
        let mc = t.get_morph_class_in_dictionary();
        if (mc.is_noun) {
            if (((t.is_value("СОЗДАНИЕ", null) || t.is_value("РАЗВИТИЕ", null) || t.is_value("ВНЕСЕНИЕ", null)) || t.is_value("ИЗМЕНЕНИЕ", null) || t.is_value("УТВЕРЖДЕНИЕ", null)) || t.is_value("ПРИНЯТИЕ", null)) 
                return (can_cap_up ? MiscHelper.convert_first_char_upper_and_other_lower(t.term) : t.term.toLowerCase());
        }
        if (((mc.is_verb || mc.is_adverb || mc.is_conjunction) || mc.is_preposition || mc.is_pronoun) || mc.is_personal_pronoun) 
            return (can_cap_up ? MiscHelper.convert_first_char_upper_and_other_lower(t.term) : t.term.toLowerCase());
        if (stat.capital_count > 0) 
            return MiscHelper.convert_first_char_upper_and_other_lower(t.term);
        if (mc.is_proper) 
            return MiscHelper.convert_first_char_upper_and_other_lower(t.term);
        if (mc.is_adjective) 
            return (can_cap_up ? MiscHelper.convert_first_char_upper_and_other_lower(t.term) : t.term.toLowerCase());
        if (MorphClass.ooEq(mc, MorphClass.NOUN)) 
            return (can_cap_up ? MiscHelper.convert_first_char_upper_and_other_lower(t.term) : t.term.toLowerCase());
        return t.term;
    }
    
    /**
     * Преобразовать строку в нужный род, число и падеж (точнее, преобразуется 
     *  первая именная группа), регистр определяется соответствующими символами примера. 
     *  Морфология определяется по первой именной группе примера. 
     *  Фукнция полезна при замене по тексту одной комбинации на другую с учётом 
     *  морфологии и регистра.
     * @param txt преобразуемая строка
     * @param begin_sample начало фрагмента примера
     * @param useMopthSample использовать именную группу примера для морфологии
     * @param use_register_sample регистр определять по фрагменту пример, при false регистр исходной строки
     * @return результат, в худшем случае вернёт исходную строку
     */
    static get_text_morph_var_by_sample(txt, begin_sample, use_morph_sample, use_register_sample) {
        if (Utils.isNullOrEmpty(txt)) 
            return txt;
        let npt = NounPhraseHelper.try_parse(begin_sample, NounPhraseParseAttr.NO, 0, null);
        if (npt !== null && begin_sample.previous !== null) {
            for (let tt = begin_sample.previous; tt !== null; tt = tt.previous) {
                if (tt.whitespaces_after_count > 2) 
                    break;
                let npt0 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                if (npt0 !== null) {
                    if (npt0.end_token === npt.end_token) 
                        npt.morph = npt0.morph;
                    else {
                        if (tt === begin_sample.previous && npt.begin_token === npt.end_token && npt.morph._case.is_genitive) 
                            npt.morph.remove_items(MorphCase.GENITIVE, false);
                        break;
                    }
                }
            }
        }
        let ar = ProcessorService.get_empty_processor().process(new SourceOfAnalysis(txt), null, null);
        if (ar === null || ar.first_token === null) 
            return txt;
        let npt1 = NounPhraseHelper.try_parse(ar.first_token, NounPhraseParseAttr.NO, 0, null);
        let t0 = begin_sample;
        let res = new StringBuilder();
        for (let t = ar.first_token; t !== null; t = t.next,t0 = (t0 === null ? null : t0.next)) {
            if (t.is_whitespace_before && t !== ar.first_token) 
                res.append(' ');
            let word = null;
            if ((t instanceof TextToken) && t.chars.is_letter) {
                word = (t).term;
                if ((npt1 !== null && t.end_char <= npt1.end_char && npt !== null) && use_morph_sample) {
                    let bi = new MorphBaseInfo();
                    bi.number = npt.morph.number;
                    bi._case = npt.morph._case;
                    bi.gender = npt1.morph.gender;
                    let ww = Morphology.get_wordform(word, bi);
                    if (ww !== null) 
                        word = ww;
                }
                let ci = null;
                if (use_register_sample && t0 !== null) 
                    ci = t0.chars;
                else 
                    ci = t.chars;
                if (ci.is_all_lower) 
                    word = word.toLowerCase();
                else if (ci.is_capital_upper) 
                    word = MiscHelper.convert_first_char_upper_and_other_lower(word);
            }
            else 
                word = t.get_source_text();
            res.append(word);
        }
        return res.toString();
    }
    
    /**
     * Преобразовать строку к нужному падежу (и числу). 
     *  Преобразуется только начало строки, содержащей в начале именную группу или персону
     * @param txt исходная строка
     * @param cas падеж
     * @param plural_number множественное число
     * @return результат (в крайнем случае, вернёт исходную строку, если ничего не получилось)
     */
    static get_text_morph_var_by_case(txt, cas, plural_number = false) {
        let ar = ProcessorService.get_empty_processor().process(new SourceOfAnalysis(txt), null, null);
        if (ar === null || ar.first_token === null) 
            return txt;
        let res = new StringBuilder();
        let t0 = ar.first_token;
        let npt = NounPhraseHelper.try_parse(ar.first_token, NounPhraseParseAttr.PARSEVERBS, 0, null);
        if (npt !== null) {
            for (let t = npt.begin_token; t !== null && t.end_char <= npt.end_char; t = t.next) {
                let is_noun = t.begin_char >= npt.noun.begin_char;
                let not_case = false;
                if (npt.internal_noun !== null) {
                    if (t.begin_char >= npt.internal_noun.begin_char && t.end_char <= npt.internal_noun.end_char) 
                        not_case = true;
                }
                for (const a of npt.adjectives) {
                    if (a.begin_token !== a.end_token && a.end_token.get_morph_class_in_dictionary().is_noun) {
                        if (t.begin_char >= a.begin_token.next.begin_char && t.end_char <= a.end_char) 
                            not_case = true;
                    }
                }
                let word = null;
                if (t instanceof NumberToken) 
                    word = t.get_source_text();
                else if (t instanceof TextToken) {
                    for (const it of t.morph.items) {
                        if (not_case) 
                            break;
                        let wf = Utils.as(it, MorphWordForm);
                        if (wf === null) 
                            continue;
                        if (!npt.morph._case.is_undefined) {
                            if ((MorphCase.ooBitand(npt.morph._case, wf._case)).is_undefined) 
                                continue;
                        }
                        if (is_noun) {
                            if ((wf.class0.is_noun || wf.class0.is_personal_pronoun || wf.class0.is_pronoun) || wf.class0.is_proper) {
                                word = wf.normal_case;
                                break;
                            }
                        }
                        else if (wf.class0.is_adjective || wf.class0.is_pronoun || wf.class0.is_personal_pronoun) {
                            word = wf.normal_case;
                            break;
                        }
                    }
                    if (word === null) 
                        word = (not_case ? (t).term : (t).lemma);
                    if (!t.chars.is_letter) {
                    }
                    else if (!not_case) {
                        if ((t.next !== null && t.next.is_hiphen && t.is_value("ГЕНЕРАЛ", null)) || t.is_value("КАПИТАН", null)) {
                        }
                        else {
                            let mbi = MorphBaseInfo._new565(npt.morph.gender, cas, MorphNumber.SINGULAR);
                            if (plural_number) 
                                mbi.number = MorphNumber.PLURAL;
                            let wcas = Morphology.get_wordform(word, mbi);
                            if (wcas !== null) 
                                word = wcas;
                        }
                    }
                }
                if (t.chars.is_all_lower) 
                    word = word.toLowerCase();
                else if (t.chars.is_capital_upper) 
                    word = MiscHelper.convert_first_char_upper_and_other_lower(word);
                if (t !== ar.first_token && t.is_whitespace_before) 
                    res.append(' ');
                res.append(word);
                t0 = t.next;
            }
        }
        if (t0 === ar.first_token) 
            return txt;
        if (t0 !== null) {
            if (t0.is_whitespace_before) 
                res.append(' ');
            res.append(txt.substring(t0.begin_char));
        }
        return res.toString();
    }
    
    /**
     * Корректировка числа и падежа строки
     * @param str исходная строка, изменяется только первая именная группа
     * @param cas 
     * @param num 
     * @param num_val 
     * @return 
     */
    static get_text_morph_var_by_case_and_number_ex(str, cas = null, num = MorphNumber.SINGULAR, num_val = null) {
        const NounPhraseToken = require("./NounPhraseToken");
        if (str === "коп" || str === "руб") 
            return str;
        if (str === "лет") 
            str = "год";
        let ar = ProcessorService.get_empty_processor().process(SourceOfAnalysis._new566(str, false), null, null);
        if (ar === null || ar.first_token === null) 
            return str;
        let npt = NounPhraseHelper.try_parse(ar.first_token, NounPhraseParseAttr.PARSENUMERICASADJECTIVE, 0, null);
        if (npt === null && ((str === "раз" || ar.first_token.get_morph_class_in_dictionary().is_proper_name))) {
            npt = new NounPhraseToken(ar.first_token, ar.first_token);
            npt.noun = new MetaToken(ar.first_token, ar.first_token);
        }
        if (npt === null) 
            return str;
        if (num_val === null && num === MorphNumber.UNDEFINED) 
            num = npt.morph.number;
        if (cas === null || cas.is_undefined) 
            cas = MorphCase.NOMINATIVE;
        if (!Utils.isNullOrEmpty(num_val) && num === MorphNumber.UNDEFINED) {
            if (cas !== null && !cas.is_nominative && !cas.is_genitive) {
                if (num_val === "1") 
                    num = MorphNumber.SINGULAR;
                else 
                    num = MorphNumber.PLURAL;
            }
        }
        let adj_bi = MorphBaseInfo._new567(MorphClass.ooBitor(MorphClass.ADJECTIVE, MorphClass.NOUN), cas, num, npt.morph.gender);
        let noun_bi = MorphBaseInfo._new568(npt.noun.morph.class0, cas, num);
        if (npt.noun.morph.class0.is_noun) 
            noun_bi.class0 = MorphClass.NOUN;
        let year = null;
        let pair = null;
        if (!Utils.isNullOrEmpty(num_val) && num === MorphNumber.UNDEFINED) {
            let ch = num_val[num_val.length - 1];
            let n = 0;
            let wrapn569 = new RefOutArgWrapper();
            Utils.tryParseInt(num_val, wrapn569);
            n = wrapn569.value;
            if (num_val === "1" || ((ch === '1' && n > 20 && ((n % 100)) !== 11))) {
                adj_bi.number = noun_bi.number = MorphNumber.SINGULAR;
                if (str === "год" || str === "раз") 
                    year = str;
                else if (str === "пар" || str === "пара") 
                    pair = "пара";
            }
            else if (((ch === '2' || ch === '3' || ch === '4')) && (((n < 10) || n > 20))) {
                noun_bi.number = MorphNumber.SINGULAR;
                noun_bi._case = MorphCase.GENITIVE;
                adj_bi.number = MorphNumber.PLURAL;
                adj_bi._case = MorphCase.NOMINATIVE;
                if (str === "год") 
                    year = (((n < 10) || n > 20) ? "года" : "лет");
                else if (str === "раз") 
                    year = (((n < 10) || n > 20) ? "раза" : "раз");
                else if (str === "пар" || str === "пара") 
                    pair = "пары";
                else if (str === "стул") 
                    pair = "стула";
            }
            else {
                noun_bi.number = MorphNumber.PLURAL;
                noun_bi._case = MorphCase.GENITIVE;
                adj_bi.number = MorphNumber.PLURAL;
                adj_bi._case = MorphCase.GENITIVE;
                if (str === "год") 
                    year = (ch === '1' && n > 20 ? "год" : "лет");
                else if (str === "раз") 
                    year = "раз";
                else if (str === "пар" || str === "пара") 
                    pair = "пар";
                else if (str === "стул") 
                    year = "стульев";
            }
        }
        let res = new StringBuilder();
        let norm = null;
        let val = null;
        for (const a of npt.adjectives) {
            norm = a.get_normal_case_text(MorphClass.ADJECTIVE, false, MorphGender.UNDEFINED, false);
            val = Morphology.get_wordform(norm, adj_bi);
            if (val === null) 
                val = a.get_source_text();
            else if (a.chars.is_all_lower) 
                val = val.toLowerCase();
            else if (a.chars.is_capital_upper) 
                val = MiscHelper.convert_first_char_upper_and_other_lower(val);
            if (res.length > 0) 
                res.append(' ');
            res.append(val);
        }
        norm = npt.noun.get_normal_case_text(noun_bi.class0, true, MorphGender.UNDEFINED, false);
        if (year !== null) 
            val = year;
        else if (pair !== null) 
            val = pair;
        else if (str === "мин" || str === "мес") 
            val = str;
        else {
            val = Morphology.get_wordform(norm, noun_bi);
            if (val === "РЕБЕНОК" && noun_bi.number === MorphNumber.PLURAL) 
                val = Morphology.get_wordform("ДЕТИ", noun_bi);
            if (val === "ЧЕЛОВЕКОВ") 
                val = "ЧЕЛОВЕК";
            else if (val === "МОРОВ") 
                val = "МОРЕЙ";
            else if (val === "ПАРОВ") 
                val = "ПАР";
            if (val === null) 
                val = npt.noun.get_source_text();
            else if (npt.noun.chars.is_all_lower) 
                val = val.toLowerCase();
            else if (npt.noun.chars.is_capital_upper) 
                val = MiscHelper.convert_first_char_upper_and_other_lower(val);
        }
        if (res.length > 0) 
            res.append(' ');
        res.append(val);
        if (npt.end_token.next !== null) {
            res.append(" ");
            res.append(str.substring(npt.end_token.next.begin_char));
        }
        return res.toString();
    }
    
    static static_constructor() {
        MiscHelper.m_cyr = "АВДЕКМНОРСТХаекорсух";
        MiscHelper.m_lat = "ABDEKMHOPCTXaekopcyx";
    }
}


MiscHelper.CyrLatWord = class  {
    
    constructor() {
        this.cyr_word = null;
        this.lat_word = null;
    }
    
    toString() {
        if (this.cyr_word !== null && this.lat_word !== null) 
            return (this.cyr_word + "\\" + this.lat_word);
        else if (this.cyr_word !== null) 
            return this.cyr_word;
        else 
            return (this.lat_word != null ? this.lat_word : "?");
    }
    
    get length() {
        return (this.cyr_word !== null ? this.cyr_word.length : ((this.lat_word !== null ? this.lat_word.length : 0)));
    }
}


MiscHelper.static_constructor();

module.exports = MiscHelper