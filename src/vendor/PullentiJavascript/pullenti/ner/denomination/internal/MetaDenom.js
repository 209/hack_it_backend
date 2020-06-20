/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class MetaDenom extends ReferentClass {
    
    static initialize() {
        const DenominationReferent = require("./../DenominationReferent");
        MetaDenom.global_meta = new MetaDenom();
        MetaDenom.global_meta.add_feature(DenominationReferent.ATTR_VALUE, "Значение", 0, 1);
    }
    
    get name() {
        const DenominationReferent = require("./../DenominationReferent");
        return DenominationReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Обозначение";
    }
    
    get_image_id(obj = null) {
        return MetaDenom.DENOM_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaDenom.DENOM_IMAGE_ID = "denom";
        MetaDenom.global_meta = null;
    }
}


MetaDenom.static_constructor();

module.exports = MetaDenom