/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const DecreeChangeValueKind = require("./../DecreeChangeValueKind");

class MetaDecreeChangeValue extends ReferentClass {
    
    static initialize() {
        const DecreeChangeValueReferent = require("./../DecreeChangeValueReferent");
        MetaDecreeChangeValue.GLOBAL_META = new MetaDecreeChangeValue();
        let fi = MetaDecreeChangeValue.GLOBAL_META.add_feature(DecreeChangeValueReferent.ATTR_KIND, "Тип", 1, 1);
        fi.add_value(DecreeChangeValueKind.TEXT.toString(), "Текст", null, null);
        fi.add_value(DecreeChangeValueKind.WORDS.toString(), "Слова", null, null);
        fi.add_value(DecreeChangeValueKind.ROBUSTWORDS.toString(), "Слова (неточно)", null, null);
        fi.add_value(DecreeChangeValueKind.NUMBERS.toString(), "Цифры", null, null);
        fi.add_value(DecreeChangeValueKind.SEQUENCE.toString(), "Предложение", null, null);
        fi.add_value(DecreeChangeValueKind.FOOTNOTE.toString(), "Сноска", null, null);
        fi.add_value(DecreeChangeValueKind.BLOCK.toString(), "Блок", null, null);
        MetaDecreeChangeValue.KIND_FEATURE = fi;
        MetaDecreeChangeValue.GLOBAL_META.add_feature(DecreeChangeValueReferent.ATTR_VALUE, "Значение", 1, 1);
        MetaDecreeChangeValue.GLOBAL_META.add_feature(DecreeChangeValueReferent.ATTR_NUMBER, "Номер", 0, 1);
        MetaDecreeChangeValue.GLOBAL_META.add_feature(DecreeChangeValueReferent.ATTR_NEWITEM, "Новый структурный элемент", 0, 0);
    }
    
    get name() {
        const DecreeChangeValueReferent = require("./../DecreeChangeValueReferent");
        return DecreeChangeValueReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Значение изменения СЭ НПА";
    }
    
    get_image_id(obj = null) {
        return MetaDecreeChangeValue.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaDecreeChangeValue.KIND_FEATURE = null;
        MetaDecreeChangeValue.IMAGE_ID = "decreechangevalue";
        MetaDecreeChangeValue.GLOBAL_META = null;
    }
}


MetaDecreeChangeValue.static_constructor();

module.exports = MetaDecreeChangeValue