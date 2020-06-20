/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const ReferentClass = require("./../../ReferentClass");
const KeywordType = require("./../KeywordType");

class KeywordMeta extends ReferentClass {
    
    static initialize() {
        const KeywordReferent = require("./../KeywordReferent");
        KeywordMeta.GLOBAL_META = new KeywordMeta();
        KeywordMeta.GLOBAL_META.add_feature(KeywordReferent.ATTR_TYPE, "Тип", 1, 1);
        KeywordMeta.GLOBAL_META.add_feature(KeywordReferent.ATTR_VALUE, "Значение", 1, 0);
        KeywordMeta.GLOBAL_META.add_feature(KeywordReferent.ATTR_NORMAL, "Нормализация", 1, 0);
        KeywordMeta.GLOBAL_META.add_feature(KeywordReferent.ATTR_REF, "Ссылка", 0, 0);
    }
    
    get name() {
        const KeywordReferent = require("./../KeywordReferent");
        return KeywordReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Ключевое слово";
    }
    
    get_image_id(obj = null) {
        const KeywordReferent = require("./../KeywordReferent");
        let m = Utils.as(obj, KeywordReferent);
        if (m !== null) {
            if (m.typ === KeywordType.PREDICATE) 
                return KeywordMeta.IMAGE_PRED;
            if (m.typ === KeywordType.REFERENT) 
                return KeywordMeta.IMAGE_REF;
        }
        return KeywordMeta.IMAGE_OBJ;
    }
    
    static static_constructor() {
        KeywordMeta.IMAGE_OBJ = "kwobject";
        KeywordMeta.IMAGE_PRED = "kwpredicate";
        KeywordMeta.IMAGE_REF = "kwreferent";
        KeywordMeta.GLOBAL_META = null;
    }
}


KeywordMeta.static_constructor();

module.exports = KeywordMeta