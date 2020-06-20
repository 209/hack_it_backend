/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const StringBuilder = require("./../../unisharp/StringBuilder");

const Token = require("./../Token");
const MetaToken = require("./../MetaToken");
const Referent = require("./../Referent");
const NumberSpellingType = require("./../NumberSpellingType");
const TextToken = require("./../TextToken");
const NumberToken = require("./../NumberToken");
const EpNerBankInternalResourceHelper = require("./../bank/internal/EpNerBankInternalResourceHelper");
const ReferentToken = require("./../ReferentToken");
const MetaDenom = require("./internal/MetaDenom");
const ProcessorService = require("./../ProcessorService");
const Analyzer = require("./../Analyzer");
const BracketHelper = require("./../core/BracketHelper");
const DenominationReferent = require("./DenominationReferent");
const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");

/**
 * Анализатор деноминаций и обозначений
 */
class DenominationAnalyzer extends Analyzer {
    
    get name() {
        return DenominationAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Деноминации";
    }
    
    get description() {
        return "Деноминации и обозначения типа СС-300, АН-24, С++";
    }
    
    clone() {
        return new DenominationAnalyzer();
    }
    
    get progress_weight() {
        return 5;
    }
    
    get is_specific() {
        return true;
    }
    
    get type_system() {
        return [MetaDenom.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaDenom.DENOM_IMAGE_ID, EpNerBankInternalResourceHelper.get_bytes("denom.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === DenominationReferent.OBJ_TYPENAME) 
            return new DenominationReferent();
        return null;
    }
    
    create_analyzer_data() {
        return new AnalyzerDataWithOntology();
    }
    
    /**
     * Основная функция выделения объектов
     * @param container 
     * @param lastStage 
     * @return 
     */
    process(kit) {
        let ad = Utils.as(kit.get_analyzer_data(this), AnalyzerDataWithOntology);
        for (let k = 0; k < 2; k++) {
            let detect_new_denoms = false;
            let dt = Utils.now();
            for (let t = kit.first_token; t !== null; t = t.next) {
                if (t.is_whitespace_before) {
                }
                else if (t.previous !== null && ((t.previous.is_char_of(",") || BracketHelper.can_be_start_of_sequence(t.previous, false, false)))) {
                }
                else 
                    continue;
                let rt0 = this.try_attach_spec(t);
                if (rt0 !== null) {
                    rt0.referent = ad.register_referent(rt0.referent);
                    kit.embed_token(rt0);
                    t = rt0;
                    continue;
                }
                if (!t.chars.is_letter) 
                    continue;
                if (!this.can_be_start_of_denom(t)) 
                    continue;
                let ot = null;
                ot = ad.local_ontology.try_attach(t, null, false);
                if (ot !== null && (ot[0].item.referent instanceof DenominationReferent)) {
                    if (this.check_attach(ot[0].begin_token, ot[0].end_token)) {
                        let cl = Utils.as(ot[0].item.referent.clone(), DenominationReferent);
                        cl.occurrence.splice(0, cl.occurrence.length);
                        let rt = new ReferentToken(cl, ot[0].begin_token, ot[0].end_token);
                        kit.embed_token(rt);
                        t = rt;
                        continue;
                    }
                }
                if (k > 0) 
                    continue;
                if (t !== null && t.kit.ontology !== null) {
                    if ((((ot = t.kit.ontology.attach_token(DenominationReferent.OBJ_TYPENAME, t)))) !== null) {
                        if (this.check_attach(ot[0].begin_token, ot[0].end_token)) {
                            let dr = new DenominationReferent();
                            dr.merge_slots(ot[0].item.referent, true);
                            let rt = new ReferentToken(ad.register_referent(dr), ot[0].begin_token, ot[0].end_token);
                            kit.embed_token(rt);
                            t = rt;
                            continue;
                        }
                    }
                }
                rt0 = this.try_attach(t, false);
                if (rt0 !== null) {
                    rt0.referent = ad.register_referent(rt0.referent);
                    kit.embed_token(rt0);
                    detect_new_denoms = true;
                    t = rt0;
                    if (ad.local_ontology.items.length > 1000) 
                        break;
                }
            }
            if (!detect_new_denoms) 
                break;
        }
    }
    
    can_be_start_of_denom(t) {
        if ((t === null || !t.chars.is_letter || t.next === null) || t.is_newline_after) 
            return false;
        if (!((t instanceof TextToken))) 
            return false;
        if (t.length_char > 4) 
            return false;
        t = t.next;
        if (t.chars.is_letter) 
            return false;
        if (t instanceof NumberToken) 
            return true;
        if (t.is_char_of("/\\") || t.is_hiphen) 
            return t.next instanceof NumberToken;
        if (t.is_char_of("+*&^#@!_")) 
            return true;
        return false;
    }
    
    process_referent(begin, end) {
        return this.try_attach(begin, false);
    }
    
    try_attach(t, for_ontology = false) {
        if (t === null) 
            return null;
        let rt0 = this.try_attach_spec(t);
        if (rt0 !== null) 
            return rt0;
        if (t.chars.is_all_lower) {
            if (!t.is_whitespace_after && (t.next instanceof NumberToken)) {
                if (t.previous === null || t.is_whitespace_before || t.previous.is_char_of(",:")) {
                }
                else 
                    return null;
            }
            else 
                return null;
        }
        let tmp = new StringBuilder();
        let t1 = t;
        let hiph = false;
        let ok = true;
        let nums = 0;
        let chars = 0;
        for (let w = t1.next; w !== null; w = w.next) {
            if (w.is_whitespace_before && !for_ontology) 
                break;
            if (w.is_char_of("/\\_") || w.is_hiphen) {
                hiph = true;
                tmp.append('-');
                continue;
            }
            hiph = false;
            let nt = Utils.as(w, NumberToken);
            if (nt !== null) {
                if (nt.typ !== NumberSpellingType.DIGIT) 
                    break;
                t1 = nt;
                tmp.append(nt.get_source_text());
                nums++;
                continue;
            }
            let tt = Utils.as(w, TextToken);
            if (tt === null) 
                break;
            if (tt.length_char > 3) {
                ok = false;
                break;
            }
            if (!Utils.isLetter(tt.term[0])) {
                if (tt.is_char_of(",:") || BracketHelper.can_be_end_of_sequence(tt, false, null, false)) 
                    break;
                if (!tt.is_char_of("+*&^#@!")) {
                    ok = false;
                    break;
                }
                chars++;
            }
            t1 = tt;
            tmp.append(tt.get_source_text());
        }
        if (!for_ontology) {
            if ((tmp.length < 1) || !ok || hiph) 
                return null;
            if (tmp.length > 12) 
                return null;
            let last = tmp.charAt(tmp.length - 1);
            if (last === '!') 
                return null;
            if ((nums + chars) === 0) 
                return null;
            if (!this.check_attach(t, t1)) 
                return null;
        }
        let new_dr = new DenominationReferent();
        new_dr.add_value(t, t1);
        return new ReferentToken(new_dr, t, t1);
    }
    
    /**
     * Некоторые специфические случаи
     * @param t 
     * @return 
     */
    try_attach_spec(t) {
        if (t === null) 
            return null;
        let t0 = t;
        let nt = Utils.as(t, NumberToken);
        if (nt !== null && nt.typ === NumberSpellingType.DIGIT && nt.value === "1") {
            if (t.next !== null && t.next.is_hiphen) 
                t = t.next;
            if ((t.next instanceof TextToken) && !t.next.is_whitespace_before) {
                if (t.next.is_value("C", null) || t.next.is_value("С", null)) {
                    let dr = new DenominationReferent();
                    dr.add_slot(DenominationReferent.ATTR_VALUE, "1С", false, 0);
                    dr.add_slot(DenominationReferent.ATTR_VALUE, "1C", false, 0);
                    return new ReferentToken(dr, t0, t.next);
                }
            }
        }
        if (((nt !== null && nt.typ === NumberSpellingType.DIGIT && (t.next instanceof TextToken)) && !t.is_whitespace_after && !t.next.chars.is_all_lower) && t.next.chars.is_letter) {
            let dr = new DenominationReferent();
            dr.add_slot(DenominationReferent.ATTR_VALUE, (nt.get_source_text() + (t.next).term), false, 0);
            return new ReferentToken(dr, t0, t.next);
        }
        return null;
    }
    
    check_attach(begin, end) {
        for (let t = begin; t !== null && t !== end.next; t = t.next) {
            if (t !== begin) {
                let co = t.whitespaces_before_count;
                if (co > 0) {
                    if (co > 1) 
                        return false;
                    if (t.chars.is_all_lower) 
                        return false;
                    if (t.previous.chars.is_all_lower) 
                        return false;
                }
            }
        }
        if (!end.is_whitespace_after && end.next !== null) {
            if (!end.next.is_char_of(",;") && !BracketHelper.can_be_end_of_sequence(end.next, false, null, false)) 
                return false;
        }
        return true;
    }
    
    static initialize() {
        if (DenominationAnalyzer.m_inites) 
            return;
        DenominationAnalyzer.m_inites = true;
        MetaDenom.initialize();
        ProcessorService.register_analyzer(new DenominationAnalyzer());
    }
    
    static static_constructor() {
        DenominationAnalyzer.ANALYZER_NAME = "DENOMINATION";
        DenominationAnalyzer.m_inites = false;
    }
}


DenominationAnalyzer.static_constructor();

module.exports = DenominationAnalyzer