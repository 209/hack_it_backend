/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class MeasureMeta extends ReferentClass {
    
    static initialize() {
        const MeasureReferent = require("./../MeasureReferent");
        MeasureMeta.GLOBAL_META = new MeasureMeta();
        MeasureMeta.GLOBAL_META.add_feature(MeasureReferent.ATTR_TEMPLATE, "Шаблон", 1, 1);
        MeasureMeta.GLOBAL_META.add_feature(MeasureReferent.ATTR_VALUE, "Значение", 1, 0);
        MeasureMeta.GLOBAL_META.add_feature(MeasureReferent.ATTR_UNIT, "Единица измерения", 1, 2);
        MeasureMeta.GLOBAL_META.add_feature(MeasureReferent.ATTR_REF, "Ссылка на уточняющее измерение", 0, 0);
        MeasureMeta.GLOBAL_META.add_feature(MeasureReferent.ATTR_NAME, "Наименование", 0, 0);
        MeasureMeta.GLOBAL_META.add_feature(MeasureReferent.ATTR_KIND, "Тип", 0, 1);
    }
    
    get name() {
        const MeasureReferent = require("./../MeasureReferent");
        return MeasureReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Измеряемые величины";
    }
    
    get_image_id(obj = null) {
        return MeasureMeta.IMAGE_ID;
    }
    
    static static_constructor() {
        MeasureMeta.IMAGE_ID = "measure";
        MeasureMeta.GLOBAL_META = null;
    }
}


MeasureMeta.static_constructor();

module.exports = MeasureMeta