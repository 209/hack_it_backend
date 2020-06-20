/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");

const Referent = require("./../Referent");
const Analyzer = require("./../Analyzer");
const Token = require("./../Token");
const GetTextAttr = require("./../core/GetTextAttr");
const MetaToken = require("./../MetaToken");
const GoodAttrType = require("./GoodAttrType");
const ReferentToken = require("./../ReferentToken");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const AttrMeta = require("./internal/AttrMeta");
const GoodMeta = require("./internal/GoodMeta");
const Termin = require("./../core/Termin");
const ProcessorService = require("./../ProcessorService");
const MiscHelper = require("./../core/MiscHelper");
const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");
const GoodAttributeReferent = require("./GoodAttributeReferent");
const GoodAttrToken = require("./internal/GoodAttrToken");
const GoodReferent = require("./GoodReferent");

/**
 * Анализатор для названий товаров (номенклатур) и их характеристик
 */
class GoodsAnalyzer extends Analyzer {
    
    get name() {
        return GoodsAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Товары и атрибуты";
    }
    
    get description() {
        return "Товары и их атрибуты";
    }
    
    get is_specific() {
        return true;
    }
    
    clone() {
        return new GoodsAnalyzer();
    }
    
    get type_system() {
        return [AttrMeta.GLOBAL_META, GoodMeta.GLOBAL_META];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(AttrMeta.ATTR_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("bullet_ball_glass_grey.png"));
        res.put(GoodMeta.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("shoppingcart.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === GoodAttributeReferent.OBJ_TYPENAME) 
            return new GoodAttributeReferent();
        if (type === GoodReferent.OBJ_TYPENAME) 
            return new GoodReferent();
        return null;
    }
    
    get progress_weight() {
        return 100;
    }
    
    create_analyzer_data() {
        return new AnalyzerDataWithOntology();
    }
    
    /**
     * Основная функция выделения дат
     * @param cnt 
     * @param stage 
     * @return 
     */
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        let delta = 100000;
        let parts = Utils.intDiv(((kit.sofa.text.length + delta) - 1), delta);
        if (parts === 0) 
            parts = 1;
        let cur = 0;
        let next_pos = 0;
        let _goods = new Array();
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (!t.is_newline_before) 
                continue;
            if (t.begin_char > next_pos) {
                next_pos += delta;
                cur++;
                if (!this.on_progress(cur, parts, kit)) 
                    break;
            }
            if (!t.chars.is_letter && t.next !== null) 
                t = t.next;
            let rts = GoodAttrToken.try_parse_list(t);
            if (rts === null || rts.length === 0) 
                continue;
            let good = new GoodReferent();
            for (const rt of rts) {
                rt.referent = ad.register_referent(rt.referent);
                if (good.find_slot(GoodReferent.ATTR_ATTR, rt.referent, true) === null) 
                    good.add_slot(GoodReferent.ATTR_ATTR, rt.referent, false, 0);
                kit.embed_token(rt);
            }
            _goods.push(good);
            let rt0 = new ReferentToken(good, rts[0], rts[rts.length - 1]);
            kit.embed_token(rt0);
            t = rt0;
        }
        for (const g of _goods) {
            ad.referents.push(g);
        }
    }
    
    process_ontology_item(begin) {
        if (begin === null) 
            return null;
        let ga = new GoodAttributeReferent();
        if (begin.chars.is_latin_letter) {
            if (begin.is_value("KEYWORD", null)) {
                ga.typ = GoodAttrType.KEYWORD;
                begin = begin.next;
            }
            else if (begin.is_value("CHARACTER", null)) {
                ga.typ = GoodAttrType.CHARACTER;
                begin = begin.next;
            }
            else if (begin.is_value("PROPER", null)) {
                ga.typ = GoodAttrType.PROPER;
                begin = begin.next;
            }
            else if (begin.is_value("MODEL", null)) {
                ga.typ = GoodAttrType.MODEL;
                begin = begin.next;
            }
            if (begin === null) 
                return null;
        }
        let res = new ReferentToken(ga, begin, begin);
        for (let t = begin; t !== null; t = t.next) {
            if (t.is_char(';')) {
                ga.add_slot(GoodAttributeReferent.ATTR_VALUE, MiscHelper.get_text_value(begin, t.previous, GetTextAttr.NO), false, 0);
                begin = t.next;
                continue;
            }
            res.end_token = t;
        }
        if (res.end_char > begin.begin_char) 
            ga.add_slot(GoodAttributeReferent.ATTR_VALUE, MiscHelper.get_text_value(begin, res.end_token, GetTextAttr.NO), false, 0);
        if (ga.typ === GoodAttrType.UNDEFINED) {
            if (!begin.chars.is_all_lower) 
                ga.typ = GoodAttrType.PROPER;
        }
        return res;
    }
    
    static initialize() {
        /* this is synchronized block by GoodsAnalyzer.m_lock, but this feature isn't supported in JS */ {
            if (GoodsAnalyzer.m_initialized) 
                return;
            GoodsAnalyzer.m_initialized = true;
            AttrMeta.initialize();
            GoodMeta.initialize();
            try {
                Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
                GoodAttrToken.initialize();
                Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
            } catch (ex) {
                throw new Error(ex.message);
            }
            ProcessorService.register_analyzer(new GoodsAnalyzer());
        }
    }
    
    static static_constructor() {
        GoodsAnalyzer.ANALYZER_NAME = "GOODS";
        GoodsAnalyzer.m_initialized = false;
        GoodsAnalyzer.m_lock = new Object();
    }
}


GoodsAnalyzer.static_constructor();

module.exports = GoodsAnalyzer