/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const MorphCase = require("./../../morph/MorphCase");
const QuestionType = require("./../utils/QuestionType");

class NextModelItem {
    
    constructor(prep, cas, spel = null, typ = QuestionType.UNDEFINED) {
        this.preposition = null;
        this._case = null;
        this.spelling = null;
        this.question = QuestionType.UNDEFINED;
        this.preposition = prep;
        this._case = cas;
        this.spelling = spel;
        this.question = typ;
        if (spel !== null) 
            return;
        if (!Utils.isNullOrEmpty(prep)) {
            if (cas.is_genitive) 
                spel = (prep.toLowerCase() + " чего");
            else if (cas.is_dative) 
                spel = (prep.toLowerCase() + " чему");
            else if (cas.is_accusative) 
                spel = (prep.toLowerCase() + " что");
            else if (cas.is_instrumental) 
                spel = (prep.toLowerCase() + " чем");
            else if (cas.is_prepositional) 
                spel = (prep.toLowerCase() + " чём");
        }
        else {
            this.preposition = "";
            if (cas.is_nominative) 
                spel = "кто";
            else if (cas.is_genitive) 
                spel = "чего";
            else if (cas.is_dative) 
                spel = "чему";
            else if (cas.is_accusative) 
                spel = "что";
            else if (cas.is_instrumental) 
                spel = "чем";
            else if (cas.is_prepositional) 
                spel = "чём";
        }
        this.spelling = spel;
    }
    
    toString() {
        return this.spelling;
    }
    
    compareTo(other) {
        let i = Utils.compareStrings(this.preposition, other.preposition, false);
        if (i !== 0) 
            return i;
        if (this._cas_rank() < other._cas_rank()) 
            return -1;
        if (this._cas_rank() > other._cas_rank()) 
            return 1;
        return 0;
    }
    
    _cas_rank() {
        if (this._case.is_genitive) 
            return 1;
        if (this._case.is_dative) 
            return 2;
        if (this._case.is_accusative) 
            return 3;
        if (this._case.is_instrumental) 
            return 4;
        if (this._case.is_prepositional) 
            return 5;
        return 0;
    }
    
    check(prep, cas) {
        if ((MorphCase.ooBitand(cas, this._case)).is_undefined) 
            return false;
        if (prep !== null && this.preposition !== null) 
            return prep === this.preposition;
        return Utils.isNullOrEmpty(prep) && Utils.isNullOrEmpty(this.preposition);
    }
}


module.exports = NextModelItem