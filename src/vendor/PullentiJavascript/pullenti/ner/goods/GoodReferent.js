/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const IntOntologyItem = require("./../core/IntOntologyItem");
const Termin = require("./../core/Termin");
const ReferentClass = require("./../ReferentClass");
const GoodMeta = require("./internal/GoodMeta");
const Referent = require("./../Referent");
const GoodAttributeReferent = require("./GoodAttributeReferent");

/**
 * Товар
 */
class GoodReferent extends Referent {
    
    constructor() {
        super(GoodReferent.OBJ_TYPENAME);
        this.instance_of = GoodMeta.GLOBAL_META;
    }
    
    /**
     * [Get] Атрибуты товара
     */
    get attrs() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.value instanceof GoodAttributeReferent) 
                res.push(Utils.as(s.value, GoodAttributeReferent));
        }
        return res;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        for (const a of this.attrs) {
            res.append(a.to_string(true, lang, lev)).append(" ");
        }
        return res.toString().trim();
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        return this === obj;
    }
    
    create_ontology_item() {
        let re = new IntOntologyItem(this);
        for (const s of this.slots) {
            if (s.type_name === GoodReferent.ATTR_ATTR) 
                re.termins.push(new Termin(s.value.toString()));
        }
        return re;
    }
    
    static static_constructor() {
        GoodReferent.OBJ_TYPENAME = "GOOD";
        GoodReferent.ATTR_ATTR = "ATTR";
    }
}


GoodReferent.static_constructor();

module.exports = GoodReferent