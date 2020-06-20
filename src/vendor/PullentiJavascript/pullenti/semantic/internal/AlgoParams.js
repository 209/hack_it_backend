/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

const AlgoParam = require("./AlgoParam");

/**
 * Параметры семантического движка
 */
class AlgoParams {
    
    constructor() {
        this.transitive_coef = 1;
        this.next_model = 1;
        this.ng_link = 1;
        this.list = 2;
        this.verb_plural = 2;
        this.case_accord = 1;
        this.morph_accord = 1;
    }
    
    copy_from(src) {
        this.transitive_coef = src.transitive_coef;
        this.next_model = src.next_model;
        this.ng_link = src.ng_link;
        this.list = src.list;
        this.verb_plural = src.verb_plural;
        this.case_accord = src.case_accord;
        this.morph_accord = src.morph_accord;
    }
    
    copy_from_params() {
        for (const p of AlgoParams.PARAMS) {
            if (p.name === "TransitiveCoef") 
                this.transitive_coef = p.value;
            else if (p.name === "NextModel") 
                this.next_model = p.value;
            else if (p.name === "NgLink") 
                this.ng_link = p.value;
            else if (p.name === "List") 
                this.list = p.value;
            else if (p.name === "VerbPlural") 
                this.verb_plural = p.value;
            else if (p.name === "CaseAccord") 
                this.case_accord = p.value;
            else if (p.name === "MorphAccord") 
                this.morph_accord = p.value;
        }
    }
    
    toString() {
        let tmp = new StringBuilder();
        tmp.append("TransitiveCoef = ").append(this.transitive_coef).append(" \r\n");
        tmp.append("NextModel = ").append(this.next_model).append(" \r\n");
        tmp.append("NgLink = ").append(this.ng_link).append(" \r\n");
        tmp.append("List = ").append(this.list).append(" \r\n");
        tmp.append("VerbPlural = ").append(this.verb_plural).append(" \r\n");
        tmp.append("CaseAccord = ").append(this.case_accord).append(" \r\n");
        tmp.append("MorphAccord = ").append(this.morph_accord).append(" \r\n");
        return tmp.toString();
    }
    
    static static_constructor() {
        AlgoParams.PARAMS = null;
        AlgoParams.PARAMS = new Array();
        AlgoParams.PARAMS.push(AlgoParam._new2886("TransitiveCoef", 1, 4, 1));
        AlgoParams.PARAMS.push(AlgoParam._new2886("NextModel", 1, 4, 1));
        AlgoParams.PARAMS.push(AlgoParam._new2886("NgLink", 1, 3, 1));
        AlgoParams.PARAMS.push(AlgoParam._new2886("List", 1, 4, 1));
        AlgoParams.PARAMS.push(AlgoParam._new2886("VerbPlural", 1, 4, 1));
        AlgoParams.PARAMS.push(AlgoParam._new2886("CaseAccord", 1, 3, 1));
        AlgoParams.PARAMS.push(AlgoParam._new2886("MorphAccord", 1, 3, 1));
    }
}


AlgoParams.static_constructor();

module.exports = AlgoParams