/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");

const MetaToken = require("./../MetaToken");
const ReferentToken = require("./../ReferentToken");
const ProcessorService = require("./../ProcessorService");
const GoodAttributeReferent = require("./GoodAttributeReferent");
const Token = require("./../Token");
const Referent = require("./../Referent");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const AttrMeta = require("./internal/AttrMeta");
const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");
const GoodAttrToken = require("./internal/GoodAttrToken");
const Analyzer = require("./../Analyzer");

/**
 * Анализатор для названий товаров (номенклатур) и их характеристик
 */
class GoodsAttrAnalyzer extends Analyzer {
    
    get name() {
        return GoodsAttrAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Атрибуты товара";
    }
    
    get description() {
        return "Выделяет только атрбуты (из раздела Характеристик)";
    }
    
    get is_specific() {
        return true;
    }
    
    clone() {
        return new GoodsAttrAnalyzer();
    }
    
    get type_system() {
        return [AttrMeta.GLOBAL_META];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(AttrMeta.ATTR_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("bullet_ball_glass_grey.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === GoodAttributeReferent.OBJ_TYPENAME) 
            return new GoodAttributeReferent();
        return null;
    }
    
    get progress_weight() {
        return 100;
    }
    
    create_analyzer_data() {
        return new AnalyzerDataWithOntology();
    }
    
    /**
     * Основная функция выделения атрибутов
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
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (t.begin_char > next_pos) {
                next_pos += delta;
                cur++;
                if (!this.on_progress(cur, parts, kit)) 
                    break;
            }
            let at = GoodAttrToken.try_parse(t, null, true, true);
            if (at === null) 
                continue;
            let attr = at._create_attr();
            if (attr === null) {
                t = at.end_token;
                continue;
            }
            let rt = new ReferentToken(attr, at.begin_token, at.end_token);
            rt.referent = ad.register_referent(attr);
            kit.embed_token(rt);
            t = rt;
        }
    }
    
    static initialize() {
        /* this is synchronized block by GoodsAttrAnalyzer.m_lock, but this feature isn't supported in JS */ {
            if (GoodsAttrAnalyzer.m_initialized) 
                return;
            GoodsAttrAnalyzer.m_initialized = true;
            ProcessorService.register_analyzer(new GoodsAttrAnalyzer());
        }
    }
    
    static static_constructor() {
        GoodsAttrAnalyzer.ANALYZER_NAME = "GOODSATTR";
        GoodsAttrAnalyzer.m_initialized = false;
        GoodsAttrAnalyzer.m_lock = new Object();
    }
}


GoodsAttrAnalyzer.static_constructor();

module.exports = GoodsAttrAnalyzer