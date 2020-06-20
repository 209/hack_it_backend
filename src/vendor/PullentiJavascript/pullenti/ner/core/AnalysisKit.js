/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const SerializerHelper = require("./internal/SerializerHelper");
const SourceOfAnalysis = require("./../SourceOfAnalysis");
const TextAnnotation = require("./../TextAnnotation");
const MorphLang = require("./../../morph/MorphLang");
const MorphWordForm = require("./../../morph/MorphWordForm");
const Referent = require("./../Referent");
const ReferentToken = require("./../ReferentToken");
const GeneralRelationHelper = require("./internal/GeneralRelationHelper");
const Token = require("./../Token");
const Morphology = require("./../../morph/Morphology");
const TextToken = require("./../TextToken");
const MetaToken = require("./../MetaToken");
const NumberToken = require("./../NumberToken");
const NumberHelper = require("./NumberHelper");
const ProcessorService = require("./../ProcessorService");

/**
 * Внутренний аналитический контейнер данных
 */
class AnalysisKit {
    
    constructor(_sofa = null, only_tokenizing = false, lang = null, progress = null) {
        this.start_date = new Date(1, 1 - 1, 1, 0, 0, 0);
        this.corrected_tokens = null;
        this.first_token = null;
        this.m_entities = new Array();
        this.ontology = null;
        this.base_language = new MorphLang();
        this.m_sofa = null;
        this.statistics = null;
        this.m_datas = new Hashtable();
        this.misc_data = new Hashtable();
        this.processor = null;
        this.recurse_level = 0;
        this.m_analyzer_stack = new Array();
        this.onto_regime = false;
        if (_sofa === null) 
            return;
        this.m_sofa = _sofa;
        this.start_date = Utils.now();
        let tokens = Morphology.process(_sofa.text, lang, null);
        let t0 = null;
        if (tokens !== null) {
            for (let ii = 0; ii < tokens.length; ii++) {
                let mt = tokens[ii];
                if (mt.begin_char === 733860) {
                }
                let tt = new TextToken(mt, this);
                if (_sofa.correction_dict !== null) {
                    let corw = null;
                    let wrapcorw543 = new RefOutArgWrapper();
                    let inoutres544 = _sofa.correction_dict.tryGetValue(mt.term, wrapcorw543);
                    corw = wrapcorw543.value;
                    if (inoutres544) {
                        let ccc = Morphology.process(corw, lang, null);
                        if (ccc !== null && ccc.length === 1) {
                            let tt1 = TextToken._new542(ccc[0], this, tt.begin_char, tt.end_char, tt.term);
                            tt1.chars = tt.chars;
                            tt = tt1;
                            if (this.corrected_tokens === null) 
                                this.corrected_tokens = new Hashtable();
                            this.corrected_tokens.put(tt, tt.get_source_text());
                        }
                    }
                }
                if (t0 === null) 
                    this.first_token = tt;
                else 
                    t0.next = tt;
                t0 = tt;
            }
        }
        if (_sofa.clear_dust) 
            this.clear_dust();
        if (_sofa.do_words_merging_by_morph) 
            this.correct_words_by_merging(lang);
        if (_sofa.do_word_correction_by_morph) 
            this.correct_words_by_morph(lang);
        this.merge_letters();
        this.define_base_language();
        if (_sofa.create_number_tokens) {
            for (let t = this.first_token; t !== null; t = t.next) {
                let nt = NumberHelper.try_parse_number(t);
                if (nt === null) 
                    continue;
                this.embed_token(nt);
                t = nt;
            }
        }
        if (only_tokenizing) 
            return;
        for (let t = this.first_token; t !== null; t = t.next) {
            if (t.morph.class0.is_preposition) 
                continue;
            let mc = t.get_morph_class_in_dictionary();
            if (mc.is_undefined && t.chars.is_cyrillic_letter && t.length_char > 4) {
                let tail = _sofa.text.substring(t.end_char - 1, t.end_char - 1 + 2);
                let tte = null;
                let tt = t.previous;
                if (tt !== null && ((tt.is_comma_and || tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction))) 
                    tt = tt.previous;
                if ((tt !== null && !tt.get_morph_class_in_dictionary().is_undefined && (((tt.morph.class0.value) & (t.morph.class0.value))) !== 0) && tt.length_char > 4) {
                    let tail2 = _sofa.text.substring(tt.end_char - 1, tt.end_char - 1 + 2);
                    if (tail2 === tail) 
                        tte = tt;
                }
                if (tte === null) {
                    tt = t.next;
                    if (tt !== null && ((tt.is_comma_and || tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction))) 
                        tt = tt.next;
                    if ((tt !== null && !tt.get_morph_class_in_dictionary().is_undefined && (((tt.morph.class0.value) & (t.morph.class0.value))) !== 0) && tt.length_char > 4) {
                        let tail2 = _sofa.text.substring(tt.end_char - 1, tt.end_char - 1 + 2);
                        if (tail2 === tail) 
                            tte = tt;
                    }
                }
                if (tte !== null) 
                    t.morph.remove_items_ex(tte.morph, tte.get_morph_class_in_dictionary());
            }
            continue;
        }
        this.create_statistics();
    }
    
    init_from(ar) {
        this.m_sofa = ar.sofas[0];
        this.first_token = ar.first_token;
        this.base_language = ar.base_language;
        this.create_statistics();
    }
    
    clear_dust() {
        for (let t = this.first_token; t !== null; t = t.next) {
            let cou = AnalysisKit.calc_abnormal_coef(t);
            let norm = 0;
            if (cou < 1) 
                continue;
            let t1 = t;
            for (let tt = t; tt !== null; tt = tt.next) {
                let co = AnalysisKit.calc_abnormal_coef(tt);
                if (co === 0) 
                    continue;
                if (co < 0) {
                    norm++;
                    if (norm > 1) 
                        break;
                }
                else {
                    norm = 0;
                    cou += co;
                    t1 = tt;
                }
            }
            let len = t1.end_char - t.begin_char;
            if (cou > 20 && len > 500) {
                for (let p = t.begin_char; p < t1.end_char; p++) {
                    if (this.sofa.text[p] === this.sofa.text[p + 1]) 
                        len--;
                }
                if (len > 500) {
                    if (t.previous !== null) 
                        t.previous.next = t1.next;
                    else 
                        this.first_token = t1.next;
                    t = t1;
                }
                else 
                    t = t1;
            }
            else 
                t = t1;
        }
    }
    
    static calc_abnormal_coef(t) {
        if (t instanceof NumberToken) 
            return 0;
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return 0;
        if (!tt.chars.is_letter) 
            return 0;
        if (!tt.chars.is_latin_letter && !tt.chars.is_cyrillic_letter) 
            return 2;
        if (tt.length_char < 4) 
            return 0;
        for (const wf of tt.morph.items) {
            if ((wf).is_in_dictionary) 
                return -1;
        }
        if (tt.length_char > 15) 
            return 2;
        return 1;
    }
    
    correct_words_by_merging(lang) {
        for (let t = this.first_token; t !== null && t.next !== null; t = t.next) {
            if (!t.chars.is_letter || (t.length_char < 2)) 
                continue;
            let mc0 = t.get_morph_class_in_dictionary();
            if (t.morph.contains_attr("прдктв.", null)) 
                continue;
            let t1 = t.next;
            if (t1.is_hiphen && t1.next !== null && !t1.is_newline_after) 
                t1 = t1.next;
            if (t1.length_char === 1) 
                continue;
            if (!t1.chars.is_letter || !t.chars.is_letter || t1.chars.is_latin_letter !== t.chars.is_latin_letter) 
                continue;
            if (t1.chars.is_all_upper && !t.chars.is_all_upper) 
                continue;
            else if (!t1.chars.is_all_lower) 
                continue;
            else if (t.chars.is_all_upper) 
                continue;
            if (t1.morph.contains_attr("прдктв.", null)) 
                continue;
            let mc1 = t1.get_morph_class_in_dictionary();
            if (!mc1.is_undefined && !mc0.is_undefined) 
                continue;
            if (((t).term.length + (t1).term.length) < 6) 
                continue;
            let corw = (t).term + (t1).term;
            let ccc = Morphology.process(corw, lang, null);
            if (ccc === null || ccc.length !== 1) 
                continue;
            if (corw === "ПОСТ" || corw === "ВРЕД") 
                continue;
            let tt = new TextToken(ccc[0], this, t.begin_char, t1.end_char);
            if (tt.get_morph_class_in_dictionary().is_undefined) 
                continue;
            tt.chars = t.chars;
            if (t === this.first_token) 
                this.first_token = tt;
            else 
                t.previous.next = tt;
            if (t1.next !== null) 
                tt.next = t1.next;
            t = tt;
        }
    }
    
    correct_words_by_morph(lang) {
        for (let tt = this.first_token; tt !== null; tt = tt.next) {
            if (!((tt instanceof TextToken))) 
                continue;
            if (tt.morph.contains_attr("прдктв.", null)) 
                continue;
            let dd = tt.get_morph_class_in_dictionary();
            if (!dd.is_undefined || (tt.length_char < 4)) 
                continue;
            if (tt.morph.class0.is_proper_surname && !tt.chars.is_all_lower) 
                continue;
            if (tt.chars.is_all_upper) 
                continue;
            let corw = Morphology.correct_word((tt).term, (tt.morph.language.is_undefined ? lang : tt.morph.language));
            if (corw === null) 
                continue;
            let ccc = Morphology.process(corw, lang, null);
            if (ccc === null || ccc.length !== 1) 
                continue;
            let tt1 = TextToken._new545(ccc[0], this, tt.begin_char, tt.end_char, tt.chars, (tt).term);
            let mc = tt1.get_morph_class_in_dictionary();
            if (mc.is_proper_surname) 
                continue;
            if (tt === this.first_token) 
                this.first_token = tt1;
            else 
                tt.previous.next = tt1;
            tt1.next = tt.next;
            tt = tt1;
            if (this.corrected_tokens === null) 
                this.corrected_tokens = new Hashtable();
            this.corrected_tokens.put(tt, tt.get_source_text());
        }
    }
    
    merge_letters() {
        let before_word = false;
        let tmp = new StringBuilder();
        for (let t = this.first_token; t !== null; t = t.next) {
            let tt = Utils.as(t, TextToken);
            if (!tt.chars.is_letter || tt.length_char !== 1) {
                before_word = false;
                continue;
            }
            let i = t.whitespaces_before_count;
            if (i > 2 || ((i === 2 && before_word))) {
            }
            else {
                before_word = false;
                continue;
            }
            i = 0;
            let t1 = null;
            tmp.length = 0;
            tmp.append(tt.get_source_text());
            for (t1 = t; t1.next !== null; t1 = t1.next) {
                tt = Utils.as(t1.next, TextToken);
                if (tt.length_char !== 1 || tt.whitespaces_before_count !== 1) 
                    break;
                i++;
                tmp.append(tt.get_source_text());
            }
            if (i > 3 || ((i > 1 && before_word))) {
            }
            else {
                before_word = false;
                continue;
            }
            before_word = false;
            let mt = Morphology.process(tmp.toString(), null, null);
            if (mt === null || mt.length !== 1) {
                t = t1;
                continue;
            }
            for (const wf of mt[0].word_forms) {
                if (wf.is_in_dictionary) {
                    before_word = true;
                    break;
                }
            }
            if (!before_word) {
                t = t1;
                continue;
            }
            tt = new TextToken(mt[0], this, t.begin_char, t1.end_char);
            if (t === this.first_token) 
                this.first_token = tt;
            else 
                tt.previous = t.previous;
            tt.next = t1.next;
            t = tt;
        }
    }
    
    /**
     * Встроить токен в основную цепочку токенов
     * @param mt 
     */
    embed_token(mt) {
        if (mt === null) 
            return;
        if (mt.begin_char > mt.end_char) {
            let bg = mt.begin_token;
            mt.begin_token = mt.end_token;
            mt.end_token = bg;
        }
        if (mt.begin_char > mt.end_char) 
            return;
        if (mt.begin_token === this.first_token) 
            this.first_token = mt;
        else {
            let tp = mt.begin_token.previous;
            mt.previous = tp;
        }
        let tn = mt.end_token.next;
        mt.next = tn;
        if (mt instanceof ReferentToken) {
            if ((mt).referent !== null) 
                (mt).referent.add_occurence(TextAnnotation._new546(this.sofa, mt.begin_char, mt.end_char));
        }
    }
    
    /**
     * Убрать метатокен из цепочки, восстановив исходное
     * @param t 
     * @return первый токен удалённого метатокена
     */
    debed_token(t) {
        let r = t.get_referent();
        if (r !== null) {
            for (const o of r.occurrence) {
                if (o.begin_char === t.begin_char && o.end_char === t.end_char) {
                    Utils.removeItem(r.occurrence, o);
                    break;
                }
            }
        }
        let mt = Utils.as(t, MetaToken);
        if (mt === null) 
            return t;
        if (t.next !== null) 
            t.next.previous = mt.end_token;
        if (t.previous !== null) 
            t.previous.next = mt.begin_token;
        if (mt === this.first_token) 
            this.first_token = mt.begin_token;
        if (r !== null && r.occurrence.length === 0) {
            for (const d of this.m_datas.values) {
                if (d.referents.includes(r)) {
                    d.remove_referent(r);
                    break;
                }
            }
        }
        return mt.begin_token;
    }
    
    /**
     * [Get] Список сущностей, выделенных в ходе анализа
     */
    get entities() {
        return this.m_entities;
    }
    
    /**
     * [Get] Ссылка на исходный текст
     */
    get sofa() {
        if (this.m_sofa === null) 
            this.m_sofa = new SourceOfAnalysis("");
        return this.m_sofa;
    }
    
    /**
     * Получить символ из исходного текста
     * @param position позиция
     * @return символ (0, если выход за границу)
     */
    get_text_character(position) {
        if ((position < 0) || position >= this.m_sofa.text.length) 
            return String.fromCharCode(0);
        return this.m_sofa.text[position];
    }
    
    get_analyzer_data_by_analyzer_name(analyzer_name) {
        let a = this.processor.find_analyzer(analyzer_name);
        if (a === null) 
            return null;
        return this.get_analyzer_data(a);
    }
    
    /**
     * Работа с локальными данными анализаторов
     * @param analyzer 
     * @return 
     */
    get_analyzer_data(analyzer) {
        if (analyzer === null || analyzer.name === null) 
            return null;
        let d = null;
        let wrapd547 = new RefOutArgWrapper();
        let inoutres548 = this.m_datas.tryGetValue(analyzer.name, wrapd547);
        d = wrapd547.value;
        if (inoutres548) {
            d.kit = this;
            return d;
        }
        let default_data = analyzer.create_analyzer_data();
        if (default_data === null) 
            return null;
        if (analyzer.persist_referents_regim) {
            if (analyzer.persist_analizer_data === null) 
                analyzer.persist_analizer_data = default_data;
            else 
                default_data = analyzer.persist_analizer_data;
        }
        this.m_datas.put(analyzer.name, default_data);
        default_data.kit = this;
        return default_data;
    }
    
    create_statistics() {
        const StatisticCollection = require("./StatisticCollection");
        this.statistics = new StatisticCollection();
        this.statistics.prepare(this.first_token);
    }
    
    define_base_language() {
        let stat = new Hashtable();
        let total = 0;
        for (let t = this.first_token; t !== null; t = t.next) {
            let tt = Utils.as(t, TextToken);
            if (tt === null) 
                continue;
            if (tt.morph.language.is_undefined) 
                continue;
            if (!stat.containsKey(tt.morph.language.value)) 
                stat.put(tt.morph.language.value, 1);
            else 
                stat.put(tt.morph.language.value, stat.get(tt.morph.language.value) + 1);
            total++;
        }
        let val = 0;
        for (const kp of stat.entries) {
            if (kp.value > (Utils.intDiv(total, 2))) 
                val |= kp.key;
        }
        this.base_language.value = val;
    }
    
    /**
     * Заменить везде где только возможно старую сущность на новую (используется при объединении сущностей)
     * @param old_referent 
     * @param new_referent 
     */
    replace_referent(old_referent, new_referent) {
        for (let t = this.first_token; t !== null; t = t.next) {
            if (t instanceof ReferentToken) 
                (t).replace_referent(old_referent, new_referent);
        }
        for (const d of this.m_datas.values) {
            for (const r of d.referents) {
                for (const s of r.slots) {
                    if (s.value === old_referent) 
                        r.upload_slot(s, new_referent);
                }
            }
            if (d.referents.includes(old_referent)) 
                Utils.removeItem(d.referents, old_referent);
        }
    }
    
    process_referent(analyzer_name, t) {
        if (this.processor === null) 
            return null;
        if (this.m_analyzer_stack.includes(analyzer_name)) 
            return null;
        if (this.is_recurce_overflow) 
            return null;
        let a = this.processor.find_analyzer(analyzer_name);
        if (a === null) 
            return null;
        this.recurse_level++;
        this.m_analyzer_stack.push(analyzer_name);
        let res = a.process_referent(t, null);
        Utils.removeItem(this.m_analyzer_stack, analyzer_name);
        this.recurse_level--;
        return res;
    }
    
    create_referent(type_name) {
        if (this.processor === null) 
            return null;
        else 
            for (const a of this.processor.analyzers) {
                let res = a.create_referent(type_name);
                if (res !== null) 
                    return res;
            }
        return null;
    }
    
    refresh_generals() {
        GeneralRelationHelper.refresh_generals(this.processor, this);
    }
    
    get is_recurce_overflow() {
        return this.recurse_level > 5;
    }
    
    serialize(stream) {
        stream.writeByte(0xAA);
        stream.writeByte(1);
        this.m_sofa.serialize(stream);
        SerializerHelper.serialize_int(stream, this.base_language.value);
        if (this.m_entities.length === 0) {
            for (const d of this.m_datas.entries) {
                this.m_entities.splice(this.m_entities.length, 0, ...d.value.referents);
            }
        }
        SerializerHelper.serialize_int(stream, this.m_entities.length);
        for (let i = 0; i < this.m_entities.length; i++) {
            this.m_entities[i].tag = i + 1;
            SerializerHelper.serialize_string(stream, this.m_entities[i].type_name);
        }
        for (const e of this.m_entities) {
            e.serialize(stream);
        }
        SerializerHelper.serialize_tokens(stream, this.first_token, 0);
    }
    
    deserialize(stream) {
        let vers = 0;
        let b = stream.readByte();
        if (b === (0xAA)) {
            b = stream.readByte();
            vers = b;
        }
        else 
            stream.position = stream.position - (1);
        this.m_sofa = new SourceOfAnalysis(null);
        this.m_sofa.deserialize(stream);
        this.base_language = MorphLang._new75(SerializerHelper.deserialize_int(stream));
        this.m_entities = new Array();
        let cou = SerializerHelper.deserialize_int(stream);
        for (let i = 0; i < cou; i++) {
            let typ = SerializerHelper.deserialize_string(stream);
            let r = ProcessorService.create_referent(typ);
            if (r === null) 
                r = new Referent("UNDEFINED");
            this.m_entities.push(r);
        }
        for (let i = 0; i < cou; i++) {
            this.m_entities[i].deserialize(stream, this.m_entities, this.m_sofa);
        }
        this.first_token = SerializerHelper.deserialize_tokens(stream, this, vers);
        this.create_statistics();
        return true;
    }
    
    static _new2827(_arg1, _arg2) {
        let res = new AnalysisKit();
        res.processor = _arg1;
        res.ontology = _arg2;
        return res;
    }
    
    static _new2828(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new AnalysisKit(_arg1, _arg2, _arg3, _arg4);
        res.ontology = _arg5;
        res.processor = _arg6;
        res.onto_regime = _arg7;
        return res;
    }
}


module.exports = AnalysisKit