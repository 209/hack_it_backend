/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const AnalyzerData = require("./AnalyzerData");
const IntOntologyCollection = require("./IntOntologyCollection");

/**
 * Данные, полученные в ходе обработки, причём с поддержкой механизма онтологий
 */
class AnalyzerDataWithOntology extends AnalyzerData {
    
    constructor() {
        super();
        this.local_ontology = new IntOntologyCollection();
    }
    
    register_referent(referent) {
        let res = null;
        let li = this.local_ontology.try_attach_by_referent(referent, null, true);
        if (li !== null) {
            for (let i = li.length - 1; i >= 0; i--) {
                if (li[i].can_be_general_for(referent) || referent.can_be_general_for(li[i])) 
                    li.splice(i, 1);
            }
        }
        if (li !== null && li.length > 0) {
            res = li[0];
            if (res !== referent) 
                res.merge_slots(referent, true);
            if (li.length > 1 && this.kit !== null) {
                for (let i = 1; i < li.length; i++) {
                    li[0].merge_slots(li[i], true);
                    for (const ta of li[i].occurrence) {
                        li[0].add_occurence(ta);
                    }
                    this.kit.replace_referent(li[i], li[0]);
                    this.local_ontology.remove(li[i]);
                }
            }
            if (res.m_ext_referents !== null) 
                res = super.register_referent(res);
            this.local_ontology.add_referent(res);
            return res;
        }
        res = super.register_referent(referent);
        if (res === null) 
            return null;
        this.local_ontology.add_referent(res);
        return res;
    }
    
    remove_referent(r) {
        this.local_ontology.remove(r);
        super.remove_referent(r);
    }
}


module.exports = AnalyzerDataWithOntology