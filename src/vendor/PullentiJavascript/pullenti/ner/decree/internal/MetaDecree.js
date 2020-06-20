/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const DecreeKind = require("./../DecreeKind");
const Referent = require("./../../Referent");

class MetaDecree extends ReferentClass {
    
    static initialize() {
        const DecreeReferent = require("./../DecreeReferent");
        MetaDecree.GLOBAL_META = new MetaDecree();
        MetaDecree.GLOBAL_META.add_feature(DecreeReferent.ATTR_TYPE, "Тип", 1, 1);
        MetaDecree.GLOBAL_META.add_feature(DecreeReferent.ATTR_NUMBER, "Номер", 0, 0);
        MetaDecree.GLOBAL_META.add_feature(DecreeReferent.ATTR_CASENUMBER, "Номер дела", 0, 0);
        MetaDecree.GLOBAL_META.add_feature(DecreeReferent.ATTR_DATE, "Дата", 0, 0);
        MetaDecree.GLOBAL_META.add_feature(DecreeReferent.ATTR_SOURCE, "Источник", 0, 1);
        MetaDecree.GLOBAL_META.add_feature(DecreeReferent.ATTR_GEO, "Географический объект", 0, 1);
        MetaDecree.GLOBAL_META.add_feature(DecreeReferent.ATTR_NAME, "Наименование", 0, 0);
        MetaDecree.GLOBAL_META.add_feature(DecreeReferent.ATTR_READING, "Чтение", 0, 1);
        MetaDecree.GLOBAL_META.add_feature(DecreeReferent.ATTR_EDITION, "В редакции", 0, 0);
        MetaDecree.GLOBAL_META.add_feature(Referent.ATTR_GENERAL, "Обобщающий объект", 0, 1);
    }
    
    get name() {
        const DecreeReferent = require("./../DecreeReferent");
        return DecreeReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Декрет";
    }
    
    get_image_id(obj = null) {
        const DecreeReferent = require("./../DecreeReferent");
        if (obj instanceof DecreeReferent) {
            let ki = (obj).kind;
            if (ki === DecreeKind.PUBLISHER) 
                return MetaDecree.PUBLISH_IMAGE_ID;
            if (ki === DecreeKind.STANDARD) 
                return MetaDecree.STANDADR_IMAGE_ID;
        }
        return MetaDecree.DECREE_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaDecree.DECREE_IMAGE_ID = "decree";
        MetaDecree.PUBLISH_IMAGE_ID = "publish";
        MetaDecree.STANDADR_IMAGE_ID = "decreestd";
        MetaDecree.GLOBAL_META = null;
    }
}


MetaDecree.static_constructor();

module.exports = MetaDecree