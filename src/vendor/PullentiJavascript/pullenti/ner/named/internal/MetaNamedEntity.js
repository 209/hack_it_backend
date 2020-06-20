/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class MetaNamedEntity extends ReferentClass {
    
    static initialize() {
        const NamedEntityReferent = require("./../NamedEntityReferent");
        MetaNamedEntity.GLOBAL_META = new MetaNamedEntity();
        MetaNamedEntity.GLOBAL_META.add_feature(NamedEntityReferent.ATTR_KIND, "Класс", 1, 1);
        MetaNamedEntity.GLOBAL_META.add_feature(NamedEntityReferent.ATTR_TYPE, "Тип", 0, 0);
        MetaNamedEntity.GLOBAL_META.add_feature(NamedEntityReferent.ATTR_NAME, "Наименование", 0, 0);
        MetaNamedEntity.GLOBAL_META.add_feature(NamedEntityReferent.ATTR_REF, "Ссылка", 0, 1);
    }
    
    get name() {
        const NamedEntityReferent = require("./../NamedEntityReferent");
        return NamedEntityReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Именованная сущность";
    }
    
    get_image_id(obj = null) {
        const NamedEntityReferent = require("./../NamedEntityReferent");
        if (obj instanceof NamedEntityReferent) 
            return (obj).kind.toString();
        return MetaNamedEntity.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaNamedEntity.IMAGE_ID = "monument";
        MetaNamedEntity.GLOBAL_META = null;
    }
}


MetaNamedEntity.static_constructor();

module.exports = MetaNamedEntity