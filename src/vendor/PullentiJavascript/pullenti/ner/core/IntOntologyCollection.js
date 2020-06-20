/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const Referent = require("./../Referent");
const TerminParseAttr = require("./TerminParseAttr");
const ReferentEqualType = require("./../ReferentEqualType");
const Termin = require("./Termin");
const TerminCollection = require("./TerminCollection");
const IntOntologyToken = require("./IntOntologyToken");

/**
 * Онтологический словарь
 */
class IntOntologyCollection {
    
    constructor() {
        this.is_ext_ontology = false;
        this.m_items = new Array();
        this.m_termins = new TerminCollection();
    }
    
    /**
     * [Get] Список элементов онтологии
     */
    get items() {
        return this.m_items;
    }
    
    /**
     * Добавить элемент (внимание, после добавления нельзя менять термины у элемента)
     * @param di 
     */
    add_item(di) {
        this.m_items.push(di);
        di.owner = this;
        for (let i = 0; i < di.termins.length; i++) {
            if (di.termins[i] instanceof IntOntologyCollection.OntologyTermin) {
                (di.termins[i]).owner = di;
                this.m_termins.add(di.termins[i]);
            }
            else {
                let nt = IntOntologyCollection.OntologyTermin._new561(di, di.termins[i].tag);
                di.termins[i].copy_to(nt);
                this.m_termins.add(nt);
                di.termins[i] = nt;
            }
        }
    }
    
    /**
     * Добавить в онтологию сущность
     * @param referent 
     * @return 
     */
    add_referent(referent) {
        if (referent === null) 
            return false;
        let oi = null;
        if (referent.int_ontology_item !== null && referent.int_ontology_item.owner === this) {
            let oi1 = referent.create_ontology_item();
            if (oi1 === null || oi1.termins.length === referent.int_ontology_item.termins.length) 
                return true;
            for (const t of referent.int_ontology_item.termins) {
                this.m_termins.remove(t);
            }
            let i = this.m_items.indexOf(referent.int_ontology_item);
            if (i >= 0) 
                this.m_items.splice(i, 1);
            oi = oi1;
        }
        else 
            oi = referent.create_ontology_item();
        if (oi === null) 
            return false;
        oi.referent = referent;
        referent.int_ontology_item = oi;
        this.add_item(oi);
        return true;
    }
    
    /**
     * Добавить термин в существующий элемент
     * @param di 
     * @param t 
     */
    add_termin(di, t) {
        let nt = IntOntologyCollection.OntologyTermin._new561(di, t.tag);
        t.copy_to(nt);
        this.m_termins.add(nt);
    }
    
    /**
     * Добавить отдельный термин (после добавления нельзя изменять свойства термина)
     * @param t 
     */
    add(t) {
        this.m_termins.add(t);
    }
    
    find_termin_by_canonic_text(text) {
        return this.m_termins.find_termin_by_canonic_text(text);
    }
    
    /**
     * Привязать с указанной позиции
     * @param t 
     * @param can_be_geo_object при True внутри может быть географический объект (Министерство РФ по делам ...)
     * @return 
     */
    try_attach(t, referent_type_name = null, can_be_geo_object = false) {
        let tts = this.m_termins.try_parse_all(t, (can_be_geo_object ? TerminParseAttr.CANBEGEOOBJECT : TerminParseAttr.NO), 0);
        if (tts === null) 
            return null;
        let res = new Array();
        let dis = new Array();
        for (const tt of tts) {
            let di = null;
            if (tt.termin instanceof IntOntologyCollection.OntologyTermin) 
                di = (tt.termin).owner;
            if (di !== null) {
                if (di.referent !== null && referent_type_name !== null) {
                    if (di.referent.type_name !== referent_type_name) 
                        continue;
                }
                if (dis.includes(di)) 
                    continue;
                dis.push(di);
            }
            res.push(IntOntologyToken._new563(tt.begin_token, tt.end_token, di, tt.termin, tt.morph));
        }
        return (res.length === 0 ? null : res);
    }
    
    /**
     * Найти похожие онтологические объекты
     * @param item 
     * @return 
     */
    try_attach_by_item(item) {
        if (item === null) 
            return null;
        let res = null;
        for (const t of item.termins) {
            let li = this.m_termins.try_attach(t);
            if (li !== null) {
                for (const tt of li) {
                    if (tt instanceof IntOntologyCollection.OntologyTermin) {
                        let oi = (tt).owner;
                        if (res === null) 
                            res = new Array();
                        if (!res.includes(oi)) 
                            res.push(oi);
                    }
                }
            }
        }
        return res;
    }
    
    /**
     * Найти эквивалентные сущности через онтологические объекты
     * @param item 
     * @param referent 
     * @return 
     */
    try_attach_by_referent(referent, item = null, must_be_single = false) {
        if (referent === null) 
            return null;
        if (item === null) 
            item = referent.create_ontology_item();
        if (item === null) 
            return null;
        let li = this.try_attach_by_item(item);
        if (li === null) 
            return null;
        let res = null;
        for (const oi of li) {
            let r = (oi.referent != null ? oi.referent : ((Utils.as(oi.tag, Referent))));
            if (r !== null) {
                if (referent.can_be_equals(r, ReferentEqualType.WITHINONETEXT)) {
                    if (res === null) 
                        res = new Array();
                    if (!res.includes(r)) 
                        res.push(r);
                }
            }
        }
        if (must_be_single) {
            if (res !== null && res.length > 1) {
                for (let i = 0; i < (res.length - 1); i++) {
                    for (let j = i + 1; j < res.length; j++) {
                        if (!res[i].can_be_equals(res[j], ReferentEqualType.FORMERGING)) 
                            return null;
                    }
                }
            }
        }
        return res;
    }
    
    /**
     * Произвести привязку, если элемент найдётся, то установить ссылку на OntologyElement
     * @param referent 
     * @param mergeSlots 
     * @return 
     * Удалить всё, что связано с сущностью
     * @param r 
     */
    remove(r) {
        let i = 0;
        for (i = 0; i < this.m_items.length; i++) {
            if (this.m_items[i].referent === r) {
                let oi = this.m_items[i];
                oi.referent = null;
                r.int_ontology_item = null;
                this.m_items.splice(i, 1);
                for (const t of oi.termins) {
                    this.m_termins.remove(t);
                }
                break;
            }
        }
    }
    
    static _new2808(_arg1) {
        let res = new IntOntologyCollection();
        res.is_ext_ontology = _arg1;
        return res;
    }
}


IntOntologyCollection.OntologyTermin = class  extends Termin {
    
    constructor() {
        super(null, null, false);
        this.owner = null;
    }
    
    static _new561(_arg1, _arg2) {
        let res = new IntOntologyCollection.OntologyTermin();
        res.owner = _arg1;
        res.tag = _arg2;
        return res;
    }
}


module.exports = IntOntologyCollection