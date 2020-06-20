/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const Hashtable = require("./../unisharp/Hashtable");
const RefOutArgWrapper = require("./../unisharp/RefOutArgWrapper");

const SerializerHelper = require("./core/internal/SerializerHelper");
const ProcessorService = require("./ProcessorService");
const Referent = require("./Referent");
const IntOntologyCollection = require("./core/IntOntologyCollection");
const ExtOntologyItem = require("./ExtOntologyItem");
const SourceOfAnalysis = require("./SourceOfAnalysis");

/**
 * Внешняя онтология
 */
class ExtOntology {
    
    /**
     * Добавить элемент
     * @param ext_id произвольный объект
     * @param type_name имя типа сущности
     * @param _definition текстовое определение. Определение может содержать несколько  
     *  отдельных фрагментов, которые разделяются точкой с запятой. 
     *  Например, Министерство Обороны России; Минобороны
     * @return если null, то не получилось...
     */
    add(ext_id, type_name, _definition) {
        if (type_name === null || _definition === null) 
            return null;
        let rs = this._create_referent(type_name, _definition);
        if (rs === null) 
            return null;
        this.m_hash = null;
        let res = ExtOntologyItem._new2800(ext_id, rs[0], type_name);
        if (rs.length > 1) {
            rs.splice(0, 1);
            res.refs = rs;
        }
        this.items.push(res);
        return res;
    }
    
    /**
     * Добавить готовую сущность
     * @param ext_id произвольный объект
     * @param referent готовая сущность (например, сфомированная явно)
     * @return 
     */
    add_referent(ext_id, referent) {
        if (referent === null) 
            return null;
        this.m_hash = null;
        let res = ExtOntologyItem._new2800(ext_id, referent, referent.type_name);
        this.items.push(res);
        return res;
    }
    
    _create_referent(type_name, _definition) {
        let analyzer = null;
        let wrapanalyzer2802 = new RefOutArgWrapper();
        let inoutres2803 = this.m_anal_by_type.tryGetValue(type_name, wrapanalyzer2802);
        analyzer = wrapanalyzer2802.value;
        if (!inoutres2803) 
            return null;
        let sf = new SourceOfAnalysis(_definition);
        let ar = this.m_processor._process(sf, true, true, null, null);
        if (ar === null || ar.first_token === null) 
            return null;
        let r0 = ar.first_token.get_referent();
        let t = null;
        if (r0 !== null) {
            if (r0.type_name !== type_name) 
                r0 = null;
        }
        if (r0 !== null) 
            t = ar.first_token;
        else {
            let rt = analyzer.process_ontology_item(ar.first_token);
            if (rt === null) 
                return null;
            r0 = rt.referent;
            t = rt.end_token;
        }
        for (t = t.next; t !== null; t = t.next) {
            if (t.is_char(';') && t.next !== null) {
                let r1 = t.next.get_referent();
                if (r1 === null) {
                    let rt = analyzer.process_ontology_item(t.next);
                    if (rt === null) 
                        continue;
                    t = rt.end_token;
                    r1 = rt.referent;
                }
                if (r1.type_name === type_name) {
                    r0.merge_slots(r1, true);
                    r1.tag = r0;
                }
            }
        }
        if (r0 === null) 
            return null;
        r0.tag = r0;
        r0 = analyzer.persist_analizer_data.register_referent(r0);
        this.m_processor._create_res(ar.first_token.kit, ar, null, true);
        let res = new Array();
        res.push(r0);
        for (const e of ar.entities) {
            if (e.tag === null) 
                res.push(e);
        }
        return res;
    }
    
    /**
     * Обновить существующий элемент онтологии
     * @param item 
     * @param _definition новое определение
     * @return 
     */
    refresh(item, _definition) {
        if (item === null) 
            return false;
        let new_referent = Utils.as(_definition, Referent);
        if ((typeof _definition === 'string' || _definition instanceof String)) 
            new_referent = this._create_referent(item.type_name, Utils.asString(_definition));
        let analyzer = null;
        let wrapanalyzer2804 = new RefOutArgWrapper();
        let inoutres2805 = this.m_anal_by_type.tryGetValue(item.type_name, wrapanalyzer2804);
        analyzer = wrapanalyzer2804.value;
        if (!inoutres2805) 
            return false;
        if (analyzer.persist_analizer_data === null) 
            return true;
        if (item.referent !== null) 
            analyzer.persist_analizer_data.remove_referent(item.referent);
        let old_referent = item.referent;
        new_referent = analyzer.persist_analizer_data.register_referent(new_referent);
        item.referent = new_referent;
        this.m_hash = null;
        if (old_referent !== null && new_referent !== null) {
            for (const a of this.m_processor.analyzers) {
                if (a.persist_analizer_data !== null) {
                    for (const rr of a.persist_analizer_data.referents) {
                        for (const s of new_referent.slots) {
                            if (s.value === old_referent) 
                                new_referent.upload_slot(s, rr);
                        }
                        for (const s of rr.slots) {
                            if (s.value === old_referent) 
                                rr.upload_slot(s, new_referent);
                        }
                    }
                }
            }
        }
        return true;
    }
    
    constructor(spec_names = null) {
        this.items = new Array();
        this.m_processor = null;
        this.m_specs = null;
        this.m_anal_by_type = null;
        this.m_hash = null;
        this.tag = null;
        this.m_specs = spec_names;
        this._init();
    }
    
    _init() {
        this.m_processor = ProcessorService.create_specific_processor(this.m_specs);
        this.m_anal_by_type = new Hashtable();
        for (const a of this.m_processor.analyzers) {
            a.persist_referents_regim = true;
            if (a.name === "DENOMINATION") 
                a.ignore_this_analyzer = true;
            else 
                for (const t of a.type_system) {
                    if (!this.m_anal_by_type.containsKey(t.name)) 
                        this.m_anal_by_type.put(t.name, a);
                }
        }
    }
    
    /**
     * Сериазизовать весь словарь в поток
     * @param stream 
     */
    serialize(stream) {
        SerializerHelper.serialize_string(stream, this.m_specs);
        SerializerHelper.serialize_int(stream, this.items.length);
        for (const it of this.items) {
            it.serialize(stream);
        }
    }
    
    /**
     * Восстановить словарь из потока
     * @param stream 
     */
    deserialize(stream) {
        this.m_specs = SerializerHelper.deserialize_string(stream);
        this._init();
        let cou = SerializerHelper.deserialize_int(stream);
        for (; cou > 0; cou--) {
            let it = new ExtOntologyItem();
            it.deserialize(stream);
            this.items.push(it);
        }
        this._init_hash();
    }
    
    /**
     * Используется внутренним образом
     * @param type_name 
     * @return 
     */
    _get_analyzer_data(type_name) {
        let a = null;
        let wrapa2806 = new RefOutArgWrapper();
        let inoutres2807 = this.m_anal_by_type.tryGetValue(type_name, wrapa2806);
        a = wrapa2806.value;
        if (!inoutres2807) 
            return null;
        return a.persist_analizer_data;
    }
    
    _init_hash() {
        this.m_hash = new Hashtable();
        for (const it of this.items) {
            if (it.referent !== null) 
                it.referent.ontology_items = null;
        }
        for (const it of this.items) {
            if (it.referent !== null) {
                let ont = null;
                let wrapont2809 = new RefOutArgWrapper();
                let inoutres2810 = this.m_hash.tryGetValue(it.referent.type_name, wrapont2809);
                ont = wrapont2809.value;
                if (!inoutres2810) 
                    this.m_hash.put(it.referent.type_name, (ont = IntOntologyCollection._new2808(true)));
                if (it.referent.ontology_items === null) 
                    it.referent.ontology_items = new Array();
                it.referent.ontology_items.push(it);
                it.referent.int_ontology_item = null;
                ont.add_referent(it.referent);
            }
        }
    }
    
    /**
     * Привязать сущность
     * @param r 
     * @return null или список подходящих элементов
     */
    attach_referent(r) {
        if (this.m_hash === null) 
            this._init_hash();
        let onto = null;
        let wraponto2811 = new RefOutArgWrapper();
        let inoutres2812 = this.m_hash.tryGetValue(r.type_name, wraponto2811);
        onto = wraponto2811.value;
        if (!inoutres2812) 
            return null;
        let li = onto.try_attach_by_referent(r, null, false);
        if (li === null || li.length === 0) 
            return null;
        let res = null;
        for (const rr of li) {
            if (rr.ontology_items !== null) {
                if (res === null) 
                    res = new Array();
                res.splice(res.length, 0, ...rr.ontology_items);
            }
        }
        return res;
    }
    
    /**
     * Используется внутренним образом
     * @param type_name 
     * @param t 
     * @return 
     */
    attach_token(type_name, t) {
        if (this.m_hash === null) 
            this._init_hash();
        let onto = null;
        let wraponto2813 = new RefOutArgWrapper();
        let inoutres2814 = this.m_hash.tryGetValue(type_name, wraponto2813);
        onto = wraponto2813.value;
        if (!inoutres2814) 
            return null;
        return onto.try_attach(t, null, false);
    }
}


module.exports = ExtOntology