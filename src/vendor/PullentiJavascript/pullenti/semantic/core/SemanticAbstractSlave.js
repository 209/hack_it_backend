/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const MetaToken = require("./../../ner/MetaToken");
const NounPhraseToken = require("./../../ner/core/NounPhraseToken");

class SemanticAbstractSlave extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.preposition = null;
        this.source = null;
    }
    
    static create_from_noun(npt) {
        let res = new SemanticAbstractSlave(npt.begin_token, npt.end_token);
        if (npt.preposition !== null) 
            res.preposition = npt.preposition.normal;
        res.morph = npt.morph;
        res.source = npt;
        return res;
    }
    
    toString() {
        if (this.preposition !== null) 
            return (this.preposition + ": " + this.get_source_text());
        return this.get_source_text();
    }
    
    get has_pronoun() {
        let npt = Utils.as(this.source, NounPhraseToken);
        if (npt === null) 
            return false;
        for (const a of npt.adjectives) {
            if (a.begin_token.morph.class0.is_pronoun) 
                return true;
        }
        return false;
    }
}


module.exports = SemanticAbstractSlave