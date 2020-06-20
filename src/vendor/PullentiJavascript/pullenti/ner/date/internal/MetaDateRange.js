/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class MetaDateRange extends ReferentClass {
    
    static initialize() {
        const DateRangeReferent = require("./../DateRangeReferent");
        MetaDateRange.GLOBAL_META = new MetaDateRange();
        MetaDateRange.GLOBAL_META.add_feature(DateRangeReferent.ATTR_FROM, "Начало периода", 0, 1);
        MetaDateRange.GLOBAL_META.add_feature(DateRangeReferent.ATTR_TO, "Конец периода", 0, 1);
    }
    
    get name() {
        const DateRangeReferent = require("./../DateRangeReferent");
        return DateRangeReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Период";
    }
    
    get_image_id(obj = null) {
        return MetaDateRange.DATE_RANGE_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaDateRange.DATE_RANGE_IMAGE_ID = "daterange";
        MetaDateRange.GLOBAL_META = null;
    }
}


MetaDateRange.static_constructor();

module.exports = MetaDateRange