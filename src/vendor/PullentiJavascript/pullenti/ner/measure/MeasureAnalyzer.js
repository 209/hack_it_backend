/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");

const Referent = require("./../Referent");
const ReferentToken = require("./../ReferentToken");
const TextToken = require("./../TextToken");
const ProcessorService = require("./../ProcessorService");
const UnitReferent = require("./UnitReferent");
const MetaToken = require("./../MetaToken");
const MeasureReferent = require("./MeasureReferent");
const UnitsHelper = require("./internal/UnitsHelper");
const UnitToken = require("./internal/UnitToken");
const NumbersWithUnitToken = require("./internal/NumbersWithUnitToken");
const Token = require("./../Token");
const EpNerBankInternalResourceHelper = require("./../bank/internal/EpNerBankInternalResourceHelper");
const UnitMeta = require("./internal/UnitMeta");
const MeasureMeta = require("./internal/MeasureMeta");
const Analyzer = require("./../Analyzer");
const MeasureToken = require("./internal/MeasureToken");
const Termin = require("./../core/Termin");
const TerminCollection = require("./../core/TerminCollection");

/**
 * Аналозатор для измеряемых величин
 */
class MeasureAnalyzer extends Analyzer {
    
    get name() {
        return MeasureAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Измеряемые величины";
    }
    
    get description() {
        return "Диапазоны и просто значения в некоторых единицах измерения";
    }
    
    clone() {
        return new MeasureAnalyzer();
    }
    
    get is_specific() {
        return true;
    }
    
    get type_system() {
        return [MeasureMeta.GLOBAL_META, UnitMeta.GLOBAL_META];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MeasureMeta.IMAGE_ID, EpNerBankInternalResourceHelper.get_bytes("measure.png"));
        res.put(UnitMeta.IMAGE_ID, EpNerBankInternalResourceHelper.get_bytes("munit.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === MeasureReferent.OBJ_TYPENAME) 
            return new MeasureReferent();
        if (type === UnitReferent.OBJ_TYPENAME) 
            return new UnitReferent();
        return null;
    }
    
    get progress_weight() {
        return 1;
    }
    
    /**
     * Основная функция выделения телефонов
     * @param cnt 
     * @param stage 
     * @return 
     */
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        let addunits = null;
        if (kit.ontology !== null) {
            addunits = new TerminCollection();
            for (const r of kit.ontology.items) {
                let uu = Utils.as(r.referent, UnitReferent);
                if (uu === null) 
                    continue;
                if (uu.m_unit !== null) 
                    continue;
                for (const s of uu.slots) {
                    if (s.type_name === UnitReferent.ATTR_NAME || s.type_name === UnitReferent.ATTR_FULLNAME) 
                        addunits.add(Termin._new119(Utils.asString(s.value), uu));
                }
            }
        }
        for (let t = kit.first_token; t !== null; t = t.next) {
            let mt = MeasureToken.try_parse_minimal(t, addunits, false);
            if (mt === null) 
                mt = MeasureToken.try_parse(t, addunits, true, false, false, false);
            if (mt === null) 
                continue;
            let rts = mt.create_refenets_tokens_with_register(ad, true);
            if (rts === null) 
                continue;
            for (let i = 0; i < rts.length; i++) {
                let rt = rts[i];
                t.kit.embed_token(rt);
                t = rt;
                for (let j = i + 1; j < rts.length; j++) {
                    if (rts[j].begin_token === rt.begin_token) 
                        rts[j].begin_token = t;
                    if (rts[j].end_token === rt.end_token) 
                        rts[j].end_token = t;
                }
            }
        }
        if (kit.ontology !== null) {
            for (const e of ad.referents) {
                let u = Utils.as(e, UnitReferent);
                if (u === null) 
                    continue;
                for (const r of kit.ontology.items) {
                    let uu = Utils.as(r.referent, UnitReferent);
                    if (uu === null) 
                        continue;
                    let ok = false;
                    for (const s of uu.slots) {
                        if (s.type_name === UnitReferent.ATTR_NAME || s.type_name === UnitReferent.ATTR_FULLNAME) {
                            if (u.find_slot(null, s.value, true) !== null) {
                                ok = true;
                                break;
                            }
                        }
                    }
                    if (ok) {
                        u.ontology_items = new Array();
                        u.ontology_items.push(r);
                        break;
                    }
                }
            }
        }
    }
    
    process_referent(begin, end) {
        let mt = MeasureToken.try_parse_minimal(begin, null, true);
        if (mt !== null) {
            let rts = mt.create_refenets_tokens_with_register(null, true);
            if (rts !== null) 
                return rts[rts.length - 1];
        }
        return null;
    }
    
    process_ontology_item(begin) {
        if (!((begin instanceof TextToken))) 
            return null;
        let ut = UnitToken.try_parse(begin, null, null, false);
        if (ut !== null) 
            return new ReferentToken(ut.create_referent_with_register(null), ut.begin_token, ut.end_token);
        let u = new UnitReferent();
        u.add_slot(UnitReferent.ATTR_NAME, begin.get_source_text(), false, 0);
        return new ReferentToken(u, begin, begin);
    }
    
    static initialize() {
        /* this is synchronized block by MeasureAnalyzer.m_lock, but this feature isn't supported in JS */ {
            if (MeasureAnalyzer.m_initialized) 
                return;
            MeasureAnalyzer.m_initialized = true;
            MeasureMeta.initialize();
            UnitMeta.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            UnitsHelper.initialize();
            NumbersWithUnitToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
            ProcessorService.register_analyzer(new MeasureAnalyzer());
        }
    }
    
    static static_constructor() {
        MeasureAnalyzer.ANALYZER_NAME = "MEASURE";
        MeasureAnalyzer.m_initialized = false;
        MeasureAnalyzer.m_lock = new Object();
    }
}


MeasureAnalyzer.static_constructor();

module.exports = MeasureAnalyzer