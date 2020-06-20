/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const ReferentClass = require("./../../ReferentClass");
const SentimentKind = require("./../SentimentKind");

class MetaSentiment extends ReferentClass {
    
    static initialize() {
        const SentimentReferent = require("./../SentimentReferent");
        MetaSentiment.global_meta = new MetaSentiment();
        let f = MetaSentiment.global_meta.add_feature(SentimentReferent.ATTR_KIND, "Тип", 1, 1);
        MetaSentiment.FTYP = f;
        f.add_value(SentimentKind.UNDEFINED.toString(), "Неизвестно", null, null);
        f.add_value(SentimentKind.POSITIVE.toString(), "Положительно", null, null);
        f.add_value(SentimentKind.NEGATIVE.toString(), "Отрицательно", null, null);
        MetaSentiment.global_meta.add_feature(SentimentReferent.ATTR_SPELLING, "Текст", 0, 0);
        MetaSentiment.global_meta.add_feature(SentimentReferent.ATTR_REF, "Ссылка", 0, 0);
        MetaSentiment.global_meta.add_feature(SentimentReferent.ATTR_COEF, "Коэффициент", 0, 0);
    }
    
    get name() {
        const SentimentReferent = require("./../SentimentReferent");
        return SentimentReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Сентимент";
    }
    
    get_image_id(obj = null) {
        const SentimentReferent = require("./../SentimentReferent");
        let sy = Utils.as(obj, SentimentReferent);
        if (sy !== null) {
            if (sy.kind === SentimentKind.POSITIVE) 
                return MetaSentiment.IMAGE_ID_GOOD;
            if (sy.kind === SentimentKind.NEGATIVE) 
                return MetaSentiment.IMAGE_ID_BAD;
        }
        return MetaSentiment.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaSentiment.FTYP = null;
        MetaSentiment.IMAGE_ID_GOOD = "good";
        MetaSentiment.IMAGE_ID_BAD = "bad";
        MetaSentiment.IMAGE_ID = "unknown";
        MetaSentiment.global_meta = null;
    }
}


MetaSentiment.static_constructor();

module.exports = MetaSentiment