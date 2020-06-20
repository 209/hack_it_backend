/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class UnitMeta extends ReferentClass {
    
    static initialize() {
        const UnitReferent = require("./../UnitReferent");
        UnitMeta.GLOBAL_META = new UnitMeta();
        UnitMeta.GLOBAL_META.add_feature(UnitReferent.ATTR_NAME, "Краткое наименование", 1, 0);
        UnitMeta.GLOBAL_META.add_feature(UnitReferent.ATTR_FULLNAME, "Полное наименование", 1, 0);
        UnitMeta.GLOBAL_META.add_feature(UnitReferent.ATTR_POW, "Степень", 0, 1);
        UnitMeta.GLOBAL_META.add_feature(UnitReferent.ATTR_BASEFACTOR, "Мультипликатор для базовой единицы", 0, 1);
        UnitMeta.GLOBAL_META.add_feature(UnitReferent.ATTR_BASEUNIT, "Базовая единица", 0, 1);
        UnitMeta.GLOBAL_META.add_feature(UnitReferent.ATTR_UNKNOWN, "Неизвестная метрика", 0, 1);
    }
    
    get name() {
        const UnitReferent = require("./../UnitReferent");
        return UnitReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Единицы измерения";
    }
    
    get_image_id(obj = null) {
        return UnitMeta.IMAGE_ID;
    }
    
    static static_constructor() {
        UnitMeta.IMAGE_ID = "munit";
        UnitMeta.GLOBAL_META = null;
    }
}


UnitMeta.static_constructor();

module.exports = UnitMeta