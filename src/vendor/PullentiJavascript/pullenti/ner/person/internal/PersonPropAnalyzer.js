/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentToken = require("./../../ReferentToken");
const Analyzer = require("./../../Analyzer");
const Referent = require("./../../Referent");
const PersonAttrTokenPersonAttrAttachAttrs = require("./PersonAttrTokenPersonAttrAttachAttrs");
const PersonAttrToken = require("./PersonAttrToken");

class PersonPropAnalyzer extends Analyzer {
    
    constructor() {
        super();
        this.ignore_this_analyzer = true;
    }
    
    get name() {
        return PersonPropAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Используется внутренним образом";
    }
    
    clone() {
        return new PersonPropAnalyzer();
    }
    
    process_referent(begin, end) {
        let pat = PersonAttrToken.try_attach(begin, null, PersonAttrTokenPersonAttrAttachAttrs.INPROCESS);
        if (pat !== null && pat.prop_ref !== null) 
            return ReferentToken._new2583(pat.prop_ref, pat.begin_token, pat.end_token, pat.morph, pat);
        return null;
    }
    
    static static_constructor() {
        PersonPropAnalyzer.ANALYZER_NAME = "PERSONPROPERTY";
    }
}


PersonPropAnalyzer.static_constructor();

module.exports = PersonPropAnalyzer