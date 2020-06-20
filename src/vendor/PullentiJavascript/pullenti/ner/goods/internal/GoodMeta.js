/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class GoodMeta extends ReferentClass {
    
    static initialize() {
        const GoodReferent = require("./../GoodReferent");
        GoodMeta.GLOBAL_META = new GoodMeta();
        GoodMeta.GLOBAL_META.add_feature(GoodReferent.ATTR_ATTR, "Атрибут", 1, 0).show_as_parent = true;
    }
    
    get name() {
        const GoodReferent = require("./../GoodReferent");
        return GoodReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Товар";
    }
    
    get_image_id(obj = null) {
        return GoodMeta.IMAGE_ID;
    }
    
    static static_constructor() {
        GoodMeta.IMAGE_ID = "good";
        GoodMeta.GLOBAL_META = null;
    }
}


GoodMeta.static_constructor();

module.exports = GoodMeta