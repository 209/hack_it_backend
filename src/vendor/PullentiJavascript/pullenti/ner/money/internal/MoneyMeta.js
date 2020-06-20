/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const ReferentClass = require("./../../ReferentClass");

class MoneyMeta extends ReferentClass {
    
    static initialize() {
        const MoneyReferent = require("./../MoneyReferent");
        MoneyMeta.GLOBAL_META = new MoneyMeta();
        MoneyMeta.GLOBAL_META.add_feature(MoneyReferent.ATTR_CURRENCY, "Валюта", 1, 1);
        MoneyMeta.GLOBAL_META.add_feature(MoneyReferent.ATTR_VALUE, "Значение", 1, 1);
        MoneyMeta.GLOBAL_META.add_feature(MoneyReferent.ATTR_REST, "Остаток (100)", 0, 1);
        MoneyMeta.GLOBAL_META.add_feature(MoneyReferent.ATTR_ALTVALUE, "Другое значение", 1, 1);
        MoneyMeta.GLOBAL_META.add_feature(MoneyReferent.ATTR_ALTREST, "Другой остаток (100)", 0, 1);
    }
    
    get name() {
        const MoneyReferent = require("./../MoneyReferent");
        return MoneyReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Денежная сумма";
    }
    
    get_image_id(obj = null) {
        const MoneyReferent = require("./../MoneyReferent");
        let m = Utils.as(obj, MoneyReferent);
        if (m !== null) {
            if (m.alt_value !== null || m.alt_rest !== null) 
                return MoneyMeta.IMAGE2ID;
        }
        return MoneyMeta.IMAGE_ID;
    }
    
    static static_constructor() {
        MoneyMeta.IMAGE_ID = "sum";
        MoneyMeta.IMAGE2ID = "sumerr";
        MoneyMeta.GLOBAL_META = null;
    }
}


MoneyMeta.static_constructor();

module.exports = MoneyMeta