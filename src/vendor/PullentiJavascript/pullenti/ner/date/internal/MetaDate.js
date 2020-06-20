/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const ReferentClass = require("./../../ReferentClass");
const DatePointerType = require("./../DatePointerType");

class MetaDate extends ReferentClass {
    
    static initialize() {
        const DateReferent = require("./../DateReferent");
        MetaDate.GLOBAL_META = new MetaDate();
        MetaDate.GLOBAL_META.add_feature(DateReferent.ATTR_CENTURY, "Век", 0, 1);
        MetaDate.GLOBAL_META.add_feature(DateReferent.ATTR_YEAR, "Год", 0, 1);
        MetaDate.GLOBAL_META.add_feature(DateReferent.ATTR_MONTH, "Месяц", 0, 1);
        MetaDate.GLOBAL_META.add_feature(DateReferent.ATTR_DAY, "День", 0, 1);
        MetaDate.GLOBAL_META.add_feature(DateReferent.ATTR_HOUR, "Час", 0, 1);
        MetaDate.GLOBAL_META.add_feature(DateReferent.ATTR_MINUTE, "Минут", 0, 1);
        MetaDate.GLOBAL_META.add_feature(DateReferent.ATTR_SECOND, "Секунд", 0, 1);
        MetaDate.GLOBAL_META.add_feature(DateReferent.ATTR_DAYOFWEEK, "День недели", 0, 1);
        MetaDate.POINTER = MetaDate.GLOBAL_META.add_feature(DateReferent.ATTR_POINTER, "Указатель", 0, 1);
        MetaDate.POINTER.add_value(DatePointerType.BEGIN.toString(), "в начале", "на початку", "in the beginning");
        MetaDate.POINTER.add_value(DatePointerType.CENTER.toString(), "в середине", "в середині", "in the middle");
        MetaDate.POINTER.add_value(DatePointerType.END.toString(), "в конце", "в кінці", "in the end");
        MetaDate.POINTER.add_value(DatePointerType.TODAY.toString(), "настоящее время", "теперішній час", "today");
        MetaDate.POINTER.add_value(DatePointerType.WINTER.toString(), "зимой", "взимку", "winter");
        MetaDate.POINTER.add_value(DatePointerType.SPRING.toString(), "весной", "навесні", "spring");
        MetaDate.POINTER.add_value(DatePointerType.SUMMER.toString(), "летом", "влітку", "summer");
        MetaDate.POINTER.add_value(DatePointerType.AUTUMN.toString(), "осенью", "восени", "autumn");
        MetaDate.POINTER.add_value(DatePointerType.ABOUT.toString(), "около", "біля", "about");
        MetaDate.POINTER.add_value(DatePointerType.UNDEFINED.toString(), "Не определена", null, null);
        MetaDate.GLOBAL_META.add_feature(DateReferent.ATTR_HIGHER, "Вышестоящая дата", 0, 1);
    }
    
    get name() {
        const DateReferent = require("./../DateReferent");
        return DateReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Дата";
    }
    
    get_image_id(obj = null) {
        const DateReferent = require("./../DateReferent");
        let dat = Utils.as(obj, DateReferent);
        if (dat !== null && dat.hour >= 0) 
            return MetaDate.DATE_IMAGE_ID;
        else 
            return MetaDate.DATE_FULL_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaDate.POINTER = null;
        MetaDate.DATE_FULL_IMAGE_ID = "datefull";
        MetaDate.DATE_IMAGE_ID = "date";
        MetaDate.GLOBAL_META = null;
    }
}


MetaDate.static_constructor();

module.exports = MetaDate