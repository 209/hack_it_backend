/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const ProgressEventArgs = require("./../../unisharp/ProgressEventArgs");

const MorphWordForm = require("./../MorphWordForm");
const UnicodeInfo = require("./UnicodeInfo");
const MorphClass = require("./../MorphClass");
const MorphEngine = require("./MorphEngine");
const CharsInfo = require("./../CharsInfo");
const TextWrapper = require("./TextWrapper");
const MorphLang = require("./../MorphLang");
const LanguageHelper = require("./../LanguageHelper");
const MorphToken = require("./../MorphToken");

class InnerMorphology {
    
    constructor() {
        this.last_percent = 0;
    }
    
    static set_engines(engine) {
        if (engine !== null) {
            InnerMorphology.m_engine_ru = engine;
            InnerMorphology.m_engine_en = engine;
            InnerMorphology.m_engine_ua = engine;
            InnerMorphology.m_engine_by = engine;
        }
    }
    
    static get_loaded_languages() {
        return MorphLang.ooBitor(MorphLang.ooBitor(InnerMorphology.m_engine_ru.language, MorphLang.ooBitor(InnerMorphology.m_engine_en.language, InnerMorphology.m_engine_ua.language)), MorphLang.ooBitor(InnerMorphology.m_engine_by.language, InnerMorphology.m_engine_kz.language));
    }
    
    static load_languages(langs) {
        if (langs.is_ru && !InnerMorphology.m_engine_ru.language.is_ru) {
            /* this is synchronized block by InnerMorphology.m_lock, but this feature isn't supported in JS */ {
                if (!InnerMorphology.m_engine_ru.language.is_ru) {
                    if (!InnerMorphology.m_engine_ru.initialize(MorphLang.RU)) 
                        throw new Error("Not found resource file m_ru.dat in Morphology");
                }
            }
        }
        if (langs.is_en && !InnerMorphology.m_engine_en.language.is_en) {
            /* this is synchronized block by InnerMorphology.m_lock, but this feature isn't supported in JS */ {
                if (!InnerMorphology.m_engine_en.language.is_en) {
                    if (!InnerMorphology.m_engine_en.initialize(MorphLang.EN)) 
                        throw new Error("Not found resource file m_en.dat in Morphology");
                }
            }
        }
        if (langs.is_ua && !InnerMorphology.m_engine_ua.language.is_ua) {
            /* this is synchronized block by InnerMorphology.m_lock, but this feature isn't supported in JS */ {
                if (!InnerMorphology.m_engine_ua.language.is_ua) 
                    InnerMorphology.m_engine_ua.initialize(MorphLang.UA);
            }
        }
        if (langs.is_by && !InnerMorphology.m_engine_by.language.is_by) {
            /* this is synchronized block by InnerMorphology.m_lock, but this feature isn't supported in JS */ {
                if (!InnerMorphology.m_engine_by.language.is_by) 
                    InnerMorphology.m_engine_by.initialize(MorphLang.BY);
            }
        }
        if (langs.is_kz && !InnerMorphology.m_engine_kz.language.is_kz) {
            /* this is synchronized block by InnerMorphology.m_lock, but this feature isn't supported in JS */ {
                if (!InnerMorphology.m_engine_kz.language.is_kz) 
                    InnerMorphology.m_engine_kz.initialize(MorphLang.KZ);
            }
        }
    }
    
    /**
     * Выгрузить язык(и), если они больше не нужны
     * @param langs 
     */
    static unload_languages(langs) {
        if (langs.is_ru && InnerMorphology.m_engine_ru.language.is_ru) 
            InnerMorphology.m_engine_ru._reset();
        if (langs.is_en && InnerMorphology.m_engine_en.language.is_en) 
            InnerMorphology.m_engine_en._reset();
        if (langs.is_ua && InnerMorphology.m_engine_ua.language.is_ua) 
            InnerMorphology.m_engine_ua._reset();
        if (langs.is_by && InnerMorphology.m_engine_by.language.is_by) 
            InnerMorphology.m_engine_by._reset();
        if (langs.is_kz && InnerMorphology.m_engine_kz.language.is_kz) 
            InnerMorphology.m_engine_kz._reset();
        ;
    }
    
    on_progress(val, max, progress) {
        let p = val;
        if (max > 0xFFFF) 
            p = Utils.intDiv(p, (Utils.intDiv(max, 100)));
        else 
            p = Utils.intDiv(p * 100, max);
        if (p !== this.last_percent && progress !== null) 
            progress.call(null, new ProgressEventArgs(p, null));
        this.last_percent = p;
    }
    
    /**
     * Произвести морфологический анализ текста
     * @param text исходный текст
     * @param lang язык (если null, то попробует определить)
     * @return последовательность результирующих морфем
     */
    run(text, only_tokenizing, dlang, progress, good_text) {
        if (Utils.isNullOrEmpty(text)) 
            return null;
        let twr = new TextWrapper(text, good_text);
        let twrch = twr.chars;
        let res = new Array();
        let uni_lex = new Hashtable();
        let i = 0;
        let j = 0;
        let term0 = null;
        let pure_rus_words = 0;
        let pure_ukr_words = 0;
        let pure_by_words = 0;
        let pure_kz_words = 0;
        let tot_rus_words = 0;
        let tot_ukr_words = 0;
        let tot_by_words = 0;
        let tot_kz_words = 0;
        for (i = 0; i < twr.length; i++) {
            let ty = InnerMorphology.get_char_typ(twrch[i]);
            if (ty === 0) 
                continue;
            if (ty > 2) 
                j = i + 1;
            else 
                for (j = i + 1; j < twr.length; j++) {
                    if (InnerMorphology.get_char_typ(twrch[j]) !== ty) 
                        break;
                }
            let wstr = text.substring(i, i + j - i);
            let term = null;
            if (good_text) 
                term = wstr;
            else {
                let trstr = LanguageHelper.transliteral_correction(wstr, term0, false);
                term = LanguageHelper.correct_word(trstr);
            }
            if (Utils.isNullOrEmpty(term)) {
                i = j - 1;
                continue;
            }
            let lang = InnerMorphology.detect_lang(twr, i, j - 1, term);
            if (MorphLang.ooEq(lang, MorphLang.UA)) 
                pure_ukr_words++;
            else if (MorphLang.ooEq(lang, MorphLang.RU)) 
                pure_rus_words++;
            else if (MorphLang.ooEq(lang, MorphLang.BY)) 
                pure_by_words++;
            else if (MorphLang.ooEq(lang, MorphLang.KZ)) 
                pure_kz_words++;
            if (MorphLang.ooNoteq((MorphLang.ooBitand(lang, MorphLang.RU)), MorphLang.UNKNOWN)) 
                tot_rus_words++;
            if (MorphLang.ooNoteq((MorphLang.ooBitand(lang, MorphLang.UA)), MorphLang.UNKNOWN)) 
                tot_ukr_words++;
            if (MorphLang.ooNoteq((MorphLang.ooBitand(lang, MorphLang.BY)), MorphLang.UNKNOWN)) 
                tot_by_words++;
            if (MorphLang.ooNoteq((MorphLang.ooBitand(lang, MorphLang.KZ)), MorphLang.UNKNOWN)) 
                tot_kz_words++;
            if (ty === 1) 
                term0 = term;
            let lemmas = null;
            if (ty === 1 && !only_tokenizing) {
                let wraplemmas2 = new RefOutArgWrapper();
                let inoutres3 = uni_lex.tryGetValue(term, wraplemmas2);
                lemmas = wraplemmas2.value;
                if (!inoutres3) {
                    lemmas = InnerMorphology.UniLexWrap._new1(lang);
                    uni_lex.put(term, lemmas);
                }
            }
            let tok = new MorphToken();
            tok.term = term;
            tok.begin_char = i;
            if (i === 733860) {
            }
            tok.end_char = j - 1;
            tok.tag = lemmas;
            res.push(tok);
            i = j - 1;
        }
        let def_lang = new MorphLang(dlang);
        if (pure_rus_words > pure_ukr_words && pure_rus_words > pure_by_words && pure_rus_words > pure_kz_words) 
            def_lang = MorphLang.RU;
        else if (tot_rus_words > tot_ukr_words && tot_rus_words > tot_by_words && tot_rus_words > tot_kz_words) 
            def_lang = MorphLang.RU;
        else if (pure_ukr_words > pure_rus_words && pure_ukr_words > pure_by_words && pure_ukr_words > pure_kz_words) 
            def_lang = MorphLang.UA;
        else if (tot_ukr_words > tot_rus_words && tot_ukr_words > tot_by_words && tot_ukr_words > tot_kz_words) 
            def_lang = MorphLang.UA;
        else if (pure_kz_words > pure_rus_words && pure_kz_words > pure_ukr_words && pure_kz_words > pure_by_words) 
            def_lang = MorphLang.KZ;
        else if (tot_kz_words > tot_rus_words && tot_kz_words > tot_ukr_words && tot_kz_words > tot_by_words) 
            def_lang = MorphLang.KZ;
        else if (pure_by_words > pure_rus_words && pure_by_words > pure_ukr_words && pure_by_words > pure_kz_words) 
            def_lang = MorphLang.BY;
        else if (tot_by_words > tot_rus_words && tot_by_words > tot_ukr_words && tot_by_words > tot_kz_words) {
            if (tot_rus_words > 10 && tot_by_words > (tot_rus_words + 20)) 
                def_lang = MorphLang.BY;
            else if (tot_rus_words === 0 || tot_by_words >= (tot_rus_words * 2)) 
                def_lang = MorphLang.BY;
        }
        if (((def_lang.is_undefined || def_lang.is_ua)) && tot_rus_words > 0) {
            if (((tot_ukr_words > tot_rus_words && InnerMorphology.m_engine_ua.language.is_ua)) || ((tot_by_words > tot_rus_words && InnerMorphology.m_engine_by.language.is_by)) || ((tot_kz_words > tot_rus_words && InnerMorphology.m_engine_kz.language.is_kz))) {
                let cou0 = 0;
                tot_rus_words = (tot_by_words = (tot_ukr_words = (tot_kz_words = 0)));
                for (const kp of uni_lex.entries) {
                    let lang = new MorphLang();
                    let wraplang4 = new RefOutArgWrapper(lang);
                    kp.value.word_forms = this.process_one_word(kp.key, wraplang4);
                    lang = wraplang4.value;
                    if (kp.value.word_forms !== null) {
                        for (const wf of kp.value.word_forms) {
                            lang = MorphLang.ooBitor(lang, wf.language);
                        }
                    }
                    kp.value.lang = lang;
                    if (lang.is_ru) 
                        tot_rus_words++;
                    if (lang.is_ua) 
                        tot_ukr_words++;
                    if (lang.is_by) 
                        tot_by_words++;
                    if (lang.is_kz) 
                        tot_kz_words++;
                    if (lang.is_cyrillic) 
                        cou0++;
                    if (cou0 >= 100) 
                        break;
                }
                if (tot_rus_words > ((Utils.intDiv(tot_by_words, 2))) && tot_rus_words > ((Utils.intDiv(tot_ukr_words, 2)))) 
                    def_lang = MorphLang.RU;
                else if (tot_ukr_words > ((Utils.intDiv(tot_rus_words, 2))) && tot_ukr_words > ((Utils.intDiv(tot_by_words, 2)))) 
                    def_lang = MorphLang.UA;
                else if (tot_by_words > ((Utils.intDiv(tot_rus_words, 2))) && tot_by_words > ((Utils.intDiv(tot_ukr_words, 2)))) 
                    def_lang = MorphLang.BY;
            }
            else if (def_lang.is_undefined) 
                def_lang = MorphLang.RU;
        }
        let cou = 0;
        tot_rus_words = (tot_by_words = (tot_ukr_words = (tot_kz_words = 0)));
        for (const kp of uni_lex.entries) {
            let lang = def_lang;
            if (lang.is_undefined) {
                if (tot_rus_words > tot_by_words && tot_rus_words > tot_ukr_words && tot_rus_words > tot_kz_words) 
                    lang = MorphLang.RU;
                else if (tot_ukr_words > tot_rus_words && tot_ukr_words > tot_by_words && tot_ukr_words > tot_kz_words) 
                    lang = MorphLang.UA;
                else if (tot_by_words > tot_rus_words && tot_by_words > tot_ukr_words && tot_by_words > tot_kz_words) 
                    lang = MorphLang.BY;
                else if (tot_kz_words > tot_rus_words && tot_kz_words > tot_ukr_words && tot_kz_words > tot_by_words) 
                    lang = MorphLang.KZ;
            }
            let wraplang5 = new RefOutArgWrapper(lang);
            kp.value.word_forms = this.process_one_word(kp.key, wraplang5);
            lang = wraplang5.value;
            kp.value.lang = lang;
            if (MorphLang.ooNoteq((MorphLang.ooBitand(lang, MorphLang.RU)), MorphLang.UNKNOWN)) 
                tot_rus_words++;
            if (MorphLang.ooNoteq((MorphLang.ooBitand(lang, MorphLang.UA)), MorphLang.UNKNOWN)) 
                tot_ukr_words++;
            if (MorphLang.ooNoteq((MorphLang.ooBitand(lang, MorphLang.BY)), MorphLang.UNKNOWN)) 
                tot_by_words++;
            if (MorphLang.ooNoteq((MorphLang.ooBitand(lang, MorphLang.KZ)), MorphLang.UNKNOWN)) 
                tot_kz_words++;
            if (progress !== null) 
                this.on_progress(cou, uni_lex.length, progress);
            cou++;
        }
        let debug_token = null;
        let empty_list = null;
        for (const r of res) {
            let uni = Utils.as(r.tag, InnerMorphology.UniLexWrap);
            r.tag = null;
            if (uni === null || uni.word_forms === null || uni.word_forms.length === 0) {
                if (empty_list === null) 
                    empty_list = new Array();
                r.word_forms = empty_list;
                if (uni !== null) 
                    r.language = uni.lang;
            }
            else 
                r.word_forms = uni.word_forms;
            if (r.begin_char === 733860) 
                debug_token = r;
        }
        if (!good_text) {
            for (i = 0; i < (res.length - 2); i++) {
                let ui0 = twrch[res[i].begin_char];
                let ui1 = twrch[res[i + 1].begin_char];
                let ui2 = twrch[res[i + 2].begin_char];
                if (ui1.is_quot) {
                    let p = res[i + 1].begin_char;
                    if ((p >= 2 && "БбТт".indexOf(text[p - 1]) >= 0 && ((p + 3) < text.length)) && "ЕеЯяЁё".indexOf(text[p + 1]) >= 0) {
                        let wstr = LanguageHelper.transliteral_correction(LanguageHelper.correct_word((res[i].get_source_text(text) + "Ъ" + res[i + 2].get_source_text(text))), null, false);
                        let li = this.process_one_word0(wstr);
                        if (li !== null && li.length > 0 && li[0].is_in_dictionary) {
                            res[i].end_char = res[i + 2].end_char;
                            res[i].term = wstr;
                            res[i].word_forms = li;
                            res.splice(i + 1, 2);
                        }
                    }
                    else if ((ui1.is_apos && p > 0 && Utils.isLetter(text[p - 1])) && ((p + 1) < text.length) && Utils.isLetter(text[p + 1])) {
                        if (MorphLang.ooEq(def_lang, MorphLang.UA) || MorphLang.ooNoteq((MorphLang.ooBitand(res[i].language, MorphLang.UA)), MorphLang.UNKNOWN) || MorphLang.ooNoteq((MorphLang.ooBitand(res[i + 2].language, MorphLang.UA)), MorphLang.UNKNOWN)) {
                            let wstr = LanguageHelper.transliteral_correction(LanguageHelper.correct_word((res[i].get_source_text(text) + res[i + 2].get_source_text(text))), null, false);
                            let li = this.process_one_word0(wstr);
                            let okk = true;
                            if (okk) {
                                res[i].end_char = res[i + 2].end_char;
                                res[i].term = wstr;
                                if (li === null) 
                                    li = new Array();
                                res[i].word_forms = li;
                                if (li !== null && li.length > 0) 
                                    res[i].language = li[0].language;
                                res.splice(i + 1, 2);
                            }
                        }
                    }
                }
                else if (((ui1.uni_char === '3' || ui1.uni_char === '4')) && res[i + 1].length === 1) {
                    let src = (ui1.uni_char === '3' ? "З" : "Ч");
                    let i0 = i + 1;
                    if ((res[i].end_char + 1) === res[i + 1].begin_char && ui0.is_cyrillic) {
                        i0--;
                        src = res[i0].get_source_text(text) + src;
                    }
                    let i1 = i + 1;
                    if ((res[i + 1].end_char + 1) === res[i + 2].begin_char && ui2.is_cyrillic) {
                        i1++;
                        src += res[i1].get_source_text(text);
                    }
                    if (src.length > 2) {
                        let wstr = LanguageHelper.transliteral_correction(LanguageHelper.correct_word(src), null, false);
                        let li = this.process_one_word0(wstr);
                        if (li !== null && li.length > 0 && li[0].is_in_dictionary) {
                            res[i0].end_char = res[i1].end_char;
                            res[i0].term = wstr;
                            res[i0].word_forms = li;
                            res.splice(i0 + 1, i1 - i0);
                        }
                    }
                }
                else if ((ui1.is_hiphen && ui0.is_letter && ui2.is_letter) && res[i].end_char > res[i].begin_char && res[i + 2].end_char > res[i + 2].begin_char) {
                    let newline = false;
                    let sps = 0;
                    for (j = res[i + 1].end_char + 1; j < res[i + 2].begin_char; j++) {
                        if (text[j] === '\r' || text[j] === '\n') {
                            newline = true;
                            sps++;
                        }
                        else if (!Utils.isWhitespace(text[j])) 
                            break;
                        else 
                            sps++;
                    }
                    let full_word = LanguageHelper.correct_word(res[i].get_source_text(text) + res[i + 2].get_source_text(text));
                    if (!newline) {
                        if (uni_lex.containsKey(full_word) || full_word === "ИЗЗА") 
                            newline = true;
                        else if (text[res[i + 1].begin_char] === (String.fromCharCode(0x00AD))) 
                            newline = true;
                        else if (LanguageHelper.ends_with_ex(res[i].get_source_text(text), "О", "о", null, null) && res[i + 2].word_forms.length > 0 && res[i + 2].word_forms[0].is_in_dictionary) {
                            if (text[res[i + 1].begin_char] === '¬') {
                                let li = this.process_one_word0(full_word);
                                if (li !== null && li.length > 0 && li[0].is_in_dictionary) 
                                    newline = true;
                            }
                        }
                        else if ((res[i].end_char + 2) === res[i + 2].begin_char) {
                            if (!Utils.isUpperCase(text[res[i + 2].begin_char]) && (sps < 2) && full_word.length > 4) {
                                newline = true;
                                if ((i + 3) < res.length) {
                                    let ui3 = twrch[res[i + 3].begin_char];
                                    if (ui3.is_hiphen) 
                                        newline = false;
                                }
                            }
                        }
                        else if (((res[i].end_char + 1) === res[i + 1].begin_char && sps > 0 && (sps < 3)) && full_word.length > 4) 
                            newline = true;
                    }
                    if (newline) {
                        let li = this.process_one_word0(full_word);
                        if (li !== null && li.length > 0 && ((li[0].is_in_dictionary || uni_lex.containsKey(full_word)))) {
                            res[i].end_char = res[i + 2].end_char;
                            res[i].term = full_word;
                            res[i].word_forms = li;
                            res.splice(i + 1, 2);
                        }
                    }
                    else {
                    }
                }
                else if ((ui1.is_letter && ui0.is_letter && res[i].length > 2) && res[i + 1].length > 1) {
                    if (ui0.is_upper !== ui1.is_upper) 
                        continue;
                    if (!ui0.is_cyrillic || !ui1.is_cyrillic) 
                        continue;
                    let newline = false;
                    for (j = res[i].end_char + 1; j < res[i + 1].begin_char; j++) {
                        if (twrch[j].code === 0xD || twrch[j].code === 0xA) {
                            newline = true;
                            break;
                        }
                    }
                    if (!newline) 
                        continue;
                    let full_word = LanguageHelper.correct_word(res[i].get_source_text(text) + res[i + 1].get_source_text(text));
                    if (!uni_lex.containsKey(full_word)) 
                        continue;
                    let li = this.process_one_word0(full_word);
                    if (li !== null && li.length > 0 && li[0].is_in_dictionary) {
                        res[i].end_char = res[i + 1].end_char;
                        res[i].term = full_word;
                        res[i].word_forms = li;
                        res.splice(i + 1, 1);
                    }
                }
            }
        }
        for (i = 0; i < res.length; i++) {
            let mt = res[i];
            mt.char_info = new CharsInfo();
            let ui0 = twrch[mt.begin_char];
            let ui00 = UnicodeInfo.ALL_CHARS[(res[i].term[0]).charCodeAt(0)];
            for (j = mt.begin_char + 1; j <= mt.end_char; j++) {
                if (ui0.is_letter) 
                    break;
                ui0 = twrch[j];
            }
            if (ui0.is_letter) {
                res[i].char_info.is_letter = true;
                if (ui00.is_latin) 
                    res[i].char_info.is_latin_letter = true;
                else if (ui00.is_cyrillic) 
                    res[i].char_info.is_cyrillic_letter = true;
                if (MorphLang.ooEq(res[i].language, MorphLang.UNKNOWN)) {
                    if (LanguageHelper.is_cyrillic(mt.term)) 
                        res[i].language = (def_lang.is_undefined ? MorphLang.RU : def_lang);
                }
                if (good_text) 
                    continue;
                let all_up = true;
                let all_lo = true;
                for (j = mt.begin_char; j <= mt.end_char; j++) {
                    if (twrch[j].is_upper || twrch[j].is_digit) 
                        all_lo = false;
                    else 
                        all_up = false;
                }
                if (all_up) 
                    mt.char_info.is_all_upper = true;
                else if (all_lo) 
                    mt.char_info.is_all_lower = true;
                else if (((ui0.is_upper || twrch[mt.begin_char].is_digit)) && mt.end_char > mt.begin_char) {
                    all_lo = true;
                    for (j = mt.begin_char + 1; j <= mt.end_char; j++) {
                        if (twrch[j].is_upper || twrch[j].is_digit) {
                            all_lo = false;
                            break;
                        }
                    }
                    if (all_lo) 
                        mt.char_info.is_capital_upper = true;
                    else if (twrch[mt.end_char].is_lower && (mt.end_char - mt.begin_char) > 1) {
                        all_up = true;
                        for (j = mt.begin_char; j < mt.end_char; j++) {
                            if (twrch[j].is_lower) {
                                all_up = false;
                                break;
                            }
                        }
                        if (all_up) 
                            mt.char_info.is_last_lower = true;
                    }
                }
            }
            if (mt.char_info.is_last_lower && mt.length > 2 && mt.char_info.is_cyrillic_letter) {
                let pref = text.substring(mt.begin_char, mt.begin_char + mt.end_char - mt.begin_char);
                let ok = false;
                for (const wf of mt.word_forms) {
                    if (wf.normal_case === pref || wf.normal_full === pref) {
                        ok = true;
                        break;
                    }
                }
                if (!ok) {
                    mt.word_forms = Array.from(mt.word_forms);
                    mt.word_forms.splice(0, 0, MorphWordForm._new6(pref, MorphClass.NOUN, 1));
                }
            }
        }
        if (good_text || only_tokenizing) 
            return res;
        for (i = 0; i < res.length; i++) {
            if (res[i].length === 1 && res[i].char_info.is_latin_letter) {
                let ch = res[i].term[0];
                if (ch === 'C' || ch === 'A' || ch === 'P') {
                }
                else 
                    continue;
                let is_rus = false;
                for (let ii = i - 1; ii >= 0; ii--) {
                    if ((res[ii].end_char + 1) !== res[ii + 1].begin_char) 
                        break;
                    else if (res[ii].char_info.is_letter) {
                        is_rus = res[ii].char_info.is_cyrillic_letter;
                        break;
                    }
                }
                if (!is_rus) {
                    for (let ii = i + 1; ii < res.length; ii++) {
                        if ((res[ii - 1].end_char + 1) !== res[ii].begin_char) 
                            break;
                        else if (res[ii].char_info.is_letter) {
                            is_rus = res[ii].char_info.is_cyrillic_letter;
                            break;
                        }
                    }
                }
                if (is_rus) {
                    res[i].term = LanguageHelper.transliteral_correction(res[i].term, null, true);
                    res[i].char_info.is_cyrillic_letter = true;
                    res[i].char_info.is_latin_letter = true;
                }
            }
        }
        for (const r of res) {
            if (r.char_info.is_all_upper || r.char_info.is_capital_upper) {
                if (r.language.is_cyrillic) {
                    let ok = false;
                    for (const wf of r.word_forms) {
                        if (wf.class0.is_proper_surname) {
                            ok = true;
                            break;
                        }
                    }
                    if (!ok) {
                        r.word_forms = Array.from(r.word_forms);
                        InnerMorphology.m_engine_ru.process_surname_variants(r.term, r.word_forms);
                    }
                }
            }
        }
        for (const r of res) {
            for (const mv of r.word_forms) {
                if (mv.normal_case === null) 
                    mv.normal_case = r.term;
            }
        }
        for (i = 0; i < (res.length - 2); i++) {
            if (res[i].char_info.is_latin_letter && res[i].char_info.is_all_upper && res[i].length === 1) {
                if (twrch[res[i + 1].begin_char].is_quot && res[i + 2].char_info.is_latin_letter && res[i + 2].length > 2) {
                    if ((res[i].end_char + 1) === res[i + 1].begin_char && (res[i + 1].end_char + 1) === res[i + 2].begin_char) {
                        let wstr = (res[i].term + res[i + 2].term);
                        let li = this.process_one_word0(wstr);
                        if (li !== null) 
                            res[i].word_forms = li;
                        res[i].end_char = res[i + 2].end_char;
                        res[i].term = wstr;
                        if (res[i + 2].char_info.is_all_lower) {
                            res[i].char_info.is_all_upper = false;
                            res[i].char_info.is_capital_upper = true;
                        }
                        else if (!res[i + 2].char_info.is_all_upper) 
                            res[i].char_info.is_all_upper = false;
                        res.splice(i + 1, 2);
                    }
                }
            }
        }
        for (i = 0; i < (res.length - 1); i++) {
            if (!res[i].char_info.is_letter && !res[i + 1].char_info.is_letter && (res[i].end_char + 1) === res[i + 1].begin_char) {
                if (twrch[res[i].begin_char].is_hiphen && twrch[res[i + 1].begin_char].is_hiphen) {
                    if (i === 0 || !twrch[res[i - 1].begin_char].is_hiphen) {
                    }
                    else 
                        continue;
                    if ((i + 2) === res.length || !twrch[res[i + 2].begin_char].is_hiphen) {
                    }
                    else 
                        continue;
                    res[i].end_char = res[i + 1].end_char;
                    res.splice(i + 1, 1);
                }
            }
        }
        return res;
    }
    
    static get_char_typ(ui) {
        if (ui.is_letter) 
            return 1;
        if (ui.is_digit) 
            return 2;
        if (ui.is_whitespace) 
            return 0;
        if (ui.is_udaren) 
            return 1;
        return ui.code;
    }
    
    /**
     * Определение языка для одного слова
     * @param word слово (в верхнем регистре)
     * @return 
     */
    static detect_lang(wr, begin, end, word) {
        let cyr = 0;
        let lat = 0;
        let undef = 0;
        if (wr !== null) {
            for (let i = begin; i <= end; i++) {
                let ui = wr.chars[i];
                if (ui.is_letter) {
                    if (ui.is_cyrillic) 
                        cyr++;
                    else if (ui.is_latin) 
                        lat++;
                    else 
                        undef++;
                }
            }
        }
        else 
            for (const ch of word) {
                let ui = UnicodeInfo.ALL_CHARS[ch.charCodeAt(0)];
                if (ui.is_letter) {
                    if (ui.is_cyrillic) 
                        cyr++;
                    else if (ui.is_latin) 
                        lat++;
                    else 
                        undef++;
                }
            }
        if (undef > 0) 
            return MorphLang.UNKNOWN;
        if (cyr === 0 && lat === 0) 
            return MorphLang.UNKNOWN;
        if (cyr === 0) 
            return MorphLang.EN;
        if (lat > 0) 
            return MorphLang.UNKNOWN;
        let lang = MorphLang.ooBitor(MorphLang.ooBitor(MorphLang.UA, MorphLang.ooBitor(MorphLang.RU, MorphLang.BY)), MorphLang.KZ);
        for (const ch of word) {
            let ui = UnicodeInfo.ALL_CHARS[ch.charCodeAt(0)];
            if (ui.is_letter) {
                if (ch === 'Ґ' || ch === 'Є' || ch === 'Ї') {
                    lang.is_ru = false;
                    lang.is_by = false;
                }
                else if (ch === 'І') 
                    lang.is_ru = false;
                else if (ch === 'Ё' || ch === 'Э') {
                    lang.is_ua = false;
                    lang.is_kz = false;
                }
                else if (ch === 'Ы') 
                    lang.is_ua = false;
                else if (ch === 'Ў') {
                    lang.is_ru = false;
                    lang.is_ua = false;
                }
                else if (ch === 'Щ') 
                    lang.is_by = false;
                else if (ch === 'Ъ') {
                    lang.is_by = false;
                    lang.is_ua = false;
                    lang.is_kz = false;
                }
                else if ((((ch === 'Ә' || ch === 'Ғ' || ch === 'Қ') || ch === 'Ң' || ch === 'Ө') || ((ch === 'Ұ' && word.length > 1)) || ch === 'Ү') || ch === 'Һ') {
                    lang.is_by = false;
                    lang.is_ua = false;
                    lang.is_ru = false;
                }
                else if ((ch === 'В' || ch === 'Ф' || ch === 'Ц') || ch === 'Ч' || ch === 'Ь') 
                    lang.is_kz = false;
            }
        }
        return lang;
    }
    
    get_all_wordforms(word, lang) {
        if (LanguageHelper.is_cyrillic_char(word[0])) {
            if (lang !== null) {
                if (InnerMorphology.m_engine_ru.language.is_ru && lang.is_ru) 
                    return InnerMorphology.m_engine_ru.get_all_wordforms(word);
                if (InnerMorphology.m_engine_ua.language.is_ua && lang.is_ua) 
                    return InnerMorphology.m_engine_ua.get_all_wordforms(word);
                if (InnerMorphology.m_engine_by.language.is_by && lang.is_by) 
                    return InnerMorphology.m_engine_by.get_all_wordforms(word);
                if (InnerMorphology.m_engine_kz.language.is_kz && lang.is_kz) 
                    return InnerMorphology.m_engine_kz.get_all_wordforms(word);
            }
            return InnerMorphology.m_engine_ru.get_all_wordforms(word);
        }
        else 
            return InnerMorphology.m_engine_en.get_all_wordforms(word);
    }
    
    get_wordform(word, cla, gender, cas, num, lang, add_info) {
        if (LanguageHelper.is_cyrillic_char(word[0])) {
            if (InnerMorphology.m_engine_ru.language.is_ru && lang.is_ru) 
                return InnerMorphology.m_engine_ru.get_wordform(word, cla, gender, cas, num, add_info);
            if (InnerMorphology.m_engine_ua.language.is_ua && lang.is_ua) 
                return InnerMorphology.m_engine_ua.get_wordform(word, cla, gender, cas, num, add_info);
            if (InnerMorphology.m_engine_by.language.is_by && lang.is_by) 
                return InnerMorphology.m_engine_by.get_wordform(word, cla, gender, cas, num, add_info);
            if (InnerMorphology.m_engine_kz.language.is_kz && lang.is_kz) 
                return InnerMorphology.m_engine_kz.get_wordform(word, cla, gender, cas, num, add_info);
            return InnerMorphology.m_engine_ru.get_wordform(word, cla, gender, cas, num, add_info);
        }
        else 
            return InnerMorphology.m_engine_en.get_wordform(word, cla, gender, cas, num, add_info);
    }
    
    correct_word_by_morph(word, lang) {
        let var0 = null;
        if (LanguageHelper.is_cyrillic_char(word[0])) {
            if (lang !== null) {
                if (InnerMorphology.m_engine_ru.language.is_ru && lang.is_ru) 
                    return InnerMorphology.m_engine_ru.correct_word_by_morph(word);
                if (InnerMorphology.m_engine_ua.language.is_ua && lang.is_ua) 
                    return InnerMorphology.m_engine_ua.correct_word_by_morph(word);
                if (InnerMorphology.m_engine_by.language.is_by && lang.is_by) 
                    return InnerMorphology.m_engine_by.correct_word_by_morph(word);
                if (InnerMorphology.m_engine_kz.language.is_kz && lang.is_kz) 
                    return InnerMorphology.m_engine_kz.correct_word_by_morph(word);
            }
            return InnerMorphology.m_engine_ru.correct_word_by_morph(word);
        }
        else 
            return InnerMorphology.m_engine_en.correct_word_by_morph(word);
    }
    
    process_one_word0(wstr) {
        let dl = new MorphLang();
        let wrapdl7 = new RefOutArgWrapper(dl);
        let inoutres8 = this.process_one_word(wstr, wrapdl7);
        dl = wrapdl7.value;
        return inoutres8;
    }
    
    process_one_word(wstr, def_lang) {
        let lang = InnerMorphology.detect_lang(null, 0, 0, wstr);
        if (MorphLang.ooEq(lang, MorphLang.UNKNOWN)) {
            def_lang.value = new MorphLang();
            return null;
        }
        if (MorphLang.ooEq(lang, MorphLang.EN)) 
            return InnerMorphology.m_engine_en.process(wstr);
        if (MorphLang.ooEq(def_lang.value, MorphLang.RU)) {
            if (lang.is_ru) 
                return InnerMorphology.m_engine_ru.process(wstr);
        }
        if (MorphLang.ooEq(lang, MorphLang.RU)) {
            def_lang.value = lang;
            return InnerMorphology.m_engine_ru.process(wstr);
        }
        if (MorphLang.ooEq(def_lang.value, MorphLang.UA)) {
            if (lang.is_ua) 
                return InnerMorphology.m_engine_ua.process(wstr);
        }
        if (MorphLang.ooEq(lang, MorphLang.UA)) {
            def_lang.value = lang;
            return InnerMorphology.m_engine_ua.process(wstr);
        }
        if (MorphLang.ooEq(def_lang.value, MorphLang.BY)) {
            if (lang.is_by) 
                return InnerMorphology.m_engine_by.process(wstr);
        }
        if (MorphLang.ooEq(lang, MorphLang.BY)) {
            def_lang.value = lang;
            return InnerMorphology.m_engine_by.process(wstr);
        }
        if (MorphLang.ooEq(def_lang.value, MorphLang.KZ)) {
            if (lang.is_kz) 
                return InnerMorphology.m_engine_kz.process(wstr);
        }
        if (MorphLang.ooEq(lang, MorphLang.KZ)) {
            def_lang.value = lang;
            return InnerMorphology.m_engine_kz.process(wstr);
        }
        let ru = null;
        if (lang.is_ru) 
            ru = InnerMorphology.m_engine_ru.process(wstr);
        let ua = null;
        if (lang.is_ua) 
            ua = InnerMorphology.m_engine_ua.process(wstr);
        let by = null;
        if (lang.is_by) 
            by = InnerMorphology.m_engine_by.process(wstr);
        let kz = null;
        if (lang.is_kz) 
            kz = InnerMorphology.m_engine_kz.process(wstr);
        let has_ru = false;
        let has_ua = false;
        let has_by = false;
        let has_kz = false;
        if (ru !== null) {
            for (const wf of ru) {
                if (wf.is_in_dictionary) 
                    has_ru = true;
            }
        }
        if (ua !== null) {
            for (const wf of ua) {
                if (wf.is_in_dictionary) 
                    has_ua = true;
            }
        }
        if (by !== null) {
            for (const wf of by) {
                if (wf.is_in_dictionary) 
                    has_by = true;
            }
        }
        if (kz !== null) {
            for (const wf of kz) {
                if (wf.is_in_dictionary) 
                    has_kz = true;
            }
        }
        if ((has_ru && !has_ua && !has_by) && !has_kz) {
            def_lang.value = MorphLang.RU;
            return ru;
        }
        if ((has_ua && !has_ru && !has_by) && !has_kz) {
            def_lang.value = MorphLang.UA;
            return ua;
        }
        if ((has_by && !has_ru && !has_ua) && !has_kz) {
            def_lang.value = MorphLang.BY;
            return by;
        }
        if ((has_kz && !has_ru && !has_ua) && !has_by) {
            def_lang.value = MorphLang.KZ;
            return kz;
        }
        if ((ru === null && ua === null && by === null) && kz === null) 
            return null;
        if ((ru !== null && ua === null && by === null) && kz === null) 
            return ru;
        if ((ua !== null && ru === null && by === null) && kz === null) 
            return ua;
        if ((by !== null && ru === null && ua === null) && kz === null) 
            return by;
        if ((kz !== null && ru === null && ua === null) && by === null) 
            return kz;
        let res = new Array();
        if (ru !== null) {
            lang = MorphLang.ooBitor(lang, MorphLang.RU);
            res.splice(res.length, 0, ...ru);
        }
        if (ua !== null) {
            lang = MorphLang.ooBitor(lang, MorphLang.UA);
            res.splice(res.length, 0, ...ua);
        }
        if (by !== null) {
            lang = MorphLang.ooBitor(lang, MorphLang.BY);
            res.splice(res.length, 0, ...by);
        }
        if (kz !== null) {
            lang = MorphLang.ooBitor(lang, MorphLang.KZ);
            res.splice(res.length, 0, ...kz);
        }
        return res;
    }
    
    static static_constructor() {
        InnerMorphology.m_engine_ru = new MorphEngine();
        InnerMorphology.m_engine_en = new MorphEngine();
        InnerMorphology.m_engine_ua = new MorphEngine();
        InnerMorphology.m_engine_by = new MorphEngine();
        InnerMorphology.m_engine_kz = new MorphEngine();
        InnerMorphology.m_lock = new Object();
    }
}


InnerMorphology.UniLexWrap = class  {
    
    constructor() {
        this.word_forms = null;
        this.lang = null;
    }
    
    static _new1(_arg1) {
        let res = new InnerMorphology.UniLexWrap();
        res.lang = _arg1;
        return res;
    }
}


InnerMorphology.static_constructor();

module.exports = InnerMorphology