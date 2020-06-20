/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class MetaStreet extends ReferentClass {
    
    static initialize() {
        const StreetReferent = require("./../StreetReferent");
        MetaStreet.global_meta = new MetaStreet();
        MetaStreet.global_meta.add_feature(StreetReferent.ATTR_TYP, "Тип", 0, 0);
        MetaStreet.global_meta.add_feature(StreetReferent.ATTR_NAME, "Наименование", 1, 0);
        MetaStreet.global_meta.add_feature(StreetReferent.ATTR_NUMBER, "Номер", 0, 1);
        MetaStreet.global_meta.add_feature(StreetReferent.ATTR_SECNUMBER, "Доп.номер", 0, 1);
        MetaStreet.global_meta.add_feature(StreetReferent.ATTR_GEO, "Географический объект", 0, 1);
        MetaStreet.global_meta.add_feature(StreetReferent.ATTR_FIAS, "Объект ФИАС", 0, 1);
        MetaStreet.global_meta.add_feature(StreetReferent.ATTR_BTI, "Объект БТИ", 0, 1);
        MetaStreet.global_meta.add_feature(StreetReferent.ATTR_OKM, "Код ОКМ УМ", 0, 1);
    }
    
    get name() {
        const StreetReferent = require("./../StreetReferent");
        return StreetReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Улица";
    }
    
    get_image_id(obj = null) {
        return MetaStreet.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaStreet.IMAGE_ID = "street";
        MetaStreet.global_meta = null;
    }
}


MetaStreet.static_constructor();

module.exports = MetaStreet