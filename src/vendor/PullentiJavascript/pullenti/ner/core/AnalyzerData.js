/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const ReferentEqualType = require("./../ReferentEqualType");

/**
 * Данные, полученные в ходе обработки анализатором
 */
class AnalyzerData {
    
    constructor() {
        this.kit = null;
        this.m_referents = new Array();
        this.m_reg_ref_level = 0;
        this.overflow_level = 0;
    }
    
    /**
     * [Get] Список выделенных сущностей
     */
    get referents() {
        return this.m_referents;
    }
    /**
     * [Set] Список выделенных сущностей
     */
    set referents(value) {
        this.m_referents.splice(0, this.m_referents.length);
        if (value !== null) 
            this.m_referents.splice(this.m_referents.length, 0, ...value);
        return value;
    }
    
    /**
     * Зарегистрировать новую сущность или привязать к существующей сущности
     * @param referent 
     * @return 
     */
    register_referent(referent) {
        if (referent === null) 
            return null;
        if (referent.m_ext_referents !== null) {
            if (this.m_reg_ref_level > 2) {
            }
            else {
                for (const rt of referent.m_ext_referents) {
                    let old_ref = rt.referent;
                    this.m_reg_ref_level++;
                    rt.save_to_local_ontology();
                    this.m_reg_ref_level--;
                    if (old_ref === rt.referent || rt.referent === null) 
                        continue;
                    for (const s of referent.slots) {
                        if (s.value === old_ref) 
                            referent.upload_slot(s, rt.referent);
                    }
                    if (referent.m_ext_referents !== null) {
                        for (const rtt of referent.m_ext_referents) {
                            for (const s of rtt.referent.slots) {
                                if (s.value === old_ref) 
                                    referent.upload_slot(s, rt.referent);
                            }
                        }
                    }
                }
                referent.m_ext_referents = null;
            }
        }
        let eq = null;
        if (this.m_referents.includes(referent)) 
            return referent;
        for (let i = this.m_referents.length - 1; i >= 0 && ((this.m_referents.length - i) < 1000); i--) {
            let p = this.m_referents[i];
            if (p.can_be_equals(referent, ReferentEqualType.WITHINONETEXT)) {
                if (!p.can_be_general_for(referent) && !referent.can_be_general_for(p)) {
                    if (eq === null) 
                        eq = new Array();
                    eq.push(p);
                }
            }
        }
        if (eq !== null) {
            if (eq.length === 1) {
                eq[0].merge_slots(referent, true);
                return eq[0];
            }
            if (eq.length > 1) {
                for (const e of eq) {
                    if (e.slots.length !== referent.slots.length) 
                        continue;
                    let ok = true;
                    for (const s of referent.slots) {
                        if (e.find_slot(s.type_name, s.value, true) === null) {
                            ok = false;
                            break;
                        }
                    }
                    if (ok) {
                        for (const s of e.slots) {
                            if (referent.find_slot(s.type_name, s.value, true) === null) {
                                ok = false;
                                break;
                            }
                        }
                    }
                    if (ok) 
                        return e;
                }
            }
        }
        this.m_referents.push(referent);
        return referent;
    }
    
    remove_referent(r) {
        if (this.m_referents.includes(r)) 
            Utils.removeItem(this.m_referents, r);
    }
}


module.exports = AnalyzerData