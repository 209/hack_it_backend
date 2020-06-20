/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const DecreeChangeKind = require("./../DecreeChangeKind");

class MetaDecreeChange extends ReferentClass {
    
    static initialize() {
        const DecreeChangeReferent = require("./../DecreeChangeReferent");
        MetaDecreeChange.GLOBAL_META = new MetaDecreeChange();
        MetaDecreeChange.GLOBAL_META.add_feature(DecreeChangeReferent.ATTR_OWNER, "Структурный элемент", 1, 0);
        let fi = MetaDecreeChange.GLOBAL_META.add_feature(DecreeChangeReferent.ATTR_KIND, "Тип", 1, 1);
        fi.add_value(DecreeChangeKind.APPEND.toString(), "Дополнить", null, null);
        fi.add_value(DecreeChangeKind.EXPIRE.toString(), "Утратить силу", null, null);
        fi.add_value(DecreeChangeKind.NEW.toString(), "В редакции", null, null);
        fi.add_value(DecreeChangeKind.EXCHANGE.toString(), "Заменить", null, null);
        fi.add_value(DecreeChangeKind.REMOVE.toString(), "Исключить", null, null);
        fi.add_value(DecreeChangeKind.CONSIDER.toString(), "Считать", null, null);
        fi.add_value(DecreeChangeKind.CONTAINER.toString(), "Внести изменение", null, null);
        MetaDecreeChange.KIND_FEATURE = fi;
        MetaDecreeChange.GLOBAL_META.add_feature(DecreeChangeReferent.ATTR_CHILD, "Дочернее изменение", 0, 0);
        MetaDecreeChange.GLOBAL_META.add_feature(DecreeChangeReferent.ATTR_VALUE, "Значение", 0, 1).show_as_parent = true;
        MetaDecreeChange.GLOBAL_META.add_feature(DecreeChangeReferent.ATTR_PARAM, "Параметр", 0, 1).show_as_parent = true;
        MetaDecreeChange.GLOBAL_META.add_feature(DecreeChangeReferent.ATTR_MISC, "Разное", 0, 0);
    }
    
    get name() {
        const DecreeChangeReferent = require("./../DecreeChangeReferent");
        return DecreeChangeReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Изменение СЭ НПА";
    }
    
    get_image_id(obj = null) {
        return MetaDecreeChange.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaDecreeChange.KIND_FEATURE = null;
        MetaDecreeChange.IMAGE_ID = "decreechange";
        MetaDecreeChange.GLOBAL_META = null;
    }
}


MetaDecreeChange.static_constructor();

module.exports = MetaDecreeChange