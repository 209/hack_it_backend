/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const IntOntologyItem = require("./../core/IntOntologyItem");
const Termin = require("./../core/Termin");
const ReferentClass = require("./../ReferentClass");
const MetaSentiment = require("./internal/MetaSentiment");
const SentimentKind = require("./SentimentKind");
const Referent = require("./../Referent");

/**
 * Фрагмент, соответсвующий сентиментной оценке
 */
class SentimentReferent extends Referent {
    
    constructor() {
        super(SentimentReferent.OBJ_TYPENAME);
        this.instance_of = MetaSentiment.global_meta;
    }
    
    to_string(short_variant, lang, lev = 0) {
        let res = new StringBuilder();
        res.append(MetaSentiment.FTYP.convert_inner_value_to_outer_value(this.get_string_value(SentimentReferent.ATTR_KIND), lang));
        res.append(" ").append((Utils.notNull(this.spelling, "")));
        if (this.coef > 0) 
            res.append(" (coef=").append(this.coef).append(")");
        let r = this.get_slot_value(SentimentReferent.ATTR_REF);
        if (r !== null && !short_variant) 
            res.append(" -> ").append(r);
        return res.toString();
    }
    
    get kind() {
        let s = this.get_string_value(SentimentReferent.ATTR_KIND);
        if (s === null) 
            return SentimentKind.UNDEFINED;
        try {
            let res = SentimentKind.of(s);
            if (res instanceof SentimentKind) 
                return SentimentKind.of(res);
        } catch (ex2644) {
        }
        return SentimentKind.UNDEFINED;
    }
    set kind(value) {
        if (value !== SentimentKind.UNDEFINED) 
            this.add_slot(SentimentReferent.ATTR_KIND, value.toString(), true, 0);
        return value;
    }
    
    get spelling() {
        return this.get_string_value(SentimentReferent.ATTR_SPELLING);
    }
    set spelling(value) {
        this.add_slot(SentimentReferent.ATTR_SPELLING, value, true, 0);
        return value;
    }
    
    get coef() {
        let val = this.get_string_value(SentimentReferent.ATTR_COEF);
        if (val === null) 
            return 0;
        let i = 0;
        let wrapi2645 = new RefOutArgWrapper();
        let inoutres2646 = Utils.tryParseInt(val, wrapi2645);
        i = wrapi2645.value;
        if (!inoutres2646) 
            return 0;
        return i;
    }
    set coef(value) {
        this.add_slot(SentimentReferent.ATTR_COEF, value.toString(), true, 0);
        return value;
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        let sr = Utils.as(obj, SentimentReferent);
        if (sr === null) 
            return false;
        if (sr.kind !== this.kind) 
            return false;
        if (sr.spelling !== this.spelling) 
            return false;
        return true;
    }
    
    can_be_general_for(obj) {
        return false;
    }
    
    create_ontology_item() {
        let oi = new IntOntologyItem(this);
        oi.termins.push(new Termin(this.spelling));
        return oi;
    }
    
    static static_constructor() {
        SentimentReferent.OBJ_TYPENAME = "SENTIMENT";
        SentimentReferent.ATTR_KIND = "KIND";
        SentimentReferent.ATTR_COEF = "COEF";
        SentimentReferent.ATTR_REF = "REF";
        SentimentReferent.ATTR_SPELLING = "SPELLING";
    }
}


SentimentReferent.static_constructor();

module.exports = SentimentReferent