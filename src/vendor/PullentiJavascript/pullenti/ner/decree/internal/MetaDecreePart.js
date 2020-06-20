/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const ReferentClass = require("./../../ReferentClass");
const DecreeReferent = require("./../DecreeReferent");

class MetaDecreePart extends ReferentClass {
    
    static initialize() {
        const DecreePartReferent = require("./../DecreePartReferent");
        MetaDecreePart.GLOBAL_META = new MetaDecreePart();
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_NAME, "Наименование", 0, 0);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_OWNER, "Владелец", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_LOCALTYP, "Локальный тип", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_SECTION, "Раздел", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_SUBSECTION, "Подраздел", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_APPENDIX, "Приложение", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_CHAPTER, "Глава", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_PREAMBLE, "Преамбула", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_CLAUSE, "Статья", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_PART, "Часть", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_DOCPART, "Часть документа", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_PARAGRAPH, "Параграф", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_SUBPARAGRAPH, "Подпараграф", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_ITEM, "Пункт", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_SUBITEM, "Подпункт", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_INDENTION, "Абзац", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_SUBINDENTION, "Подабзац", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_SUBPROGRAM, "Подпрограмма", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_ADDAGREE, "Допсоглашение", 0, 1);
        MetaDecreePart.GLOBAL_META.add_feature(DecreePartReferent.ATTR_NOTICE, "Примечание", 0, 1);
    }
    
    get name() {
        return DecreeReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Ссылка на часть НПА";
    }
    
    get_image_id(obj = null) {
        const DecreePartReferent = require("./../DecreePartReferent");
        let dpr = Utils.as(obj, DecreePartReferent);
        if (dpr !== null) {
            if (dpr.owner === null) 
                return MetaDecreePart.PART_LOC_IMAGE_ID;
        }
        return MetaDecreePart.PART_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaDecreePart.PART_IMAGE_ID = "part";
        MetaDecreePart.PART_LOC_IMAGE_ID = "partloc";
        MetaDecreePart.GLOBAL_META = null;
    }
}


MetaDecreePart.static_constructor();

module.exports = MetaDecreePart