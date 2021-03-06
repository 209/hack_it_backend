/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class MetaTitleInfo extends ReferentClass {
    
    static initialize() {
        const TitlePageReferent = require("./../TitlePageReferent");
        MetaTitleInfo.global_meta = new MetaTitleInfo();
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_NAME, "Название", 0, 0);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_TYPE, "Тип", 0, 0);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_AUTHOR, "Автор", 0, 0);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_SUPERVISOR, "Руководитель", 0, 0);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_EDITOR, "Редактор", 0, 0);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_CONSULTANT, "Консультант", 0, 0);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_OPPONENT, "Оппонент", 0, 0);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_AFFIRMANT, "Утверждающий", 0, 0);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_TRANSLATOR, "Переводчик", 0, 0);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_ORG, "Организация", 0, 1);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_DEP, "Подразделение", 0, 1);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_STUDENTYEAR, "Номер курса", 0, 1);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_DATE, "Дата", 0, 1);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_CITY, "Город", 0, 1);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_SPECIALITY, "Специальность", 0, 1);
        MetaTitleInfo.global_meta.add_feature(TitlePageReferent.ATTR_ATTR, "Атрибут", 0, 0);
    }
    
    get name() {
        const TitlePageReferent = require("./../TitlePageReferent");
        return TitlePageReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Заголовок";
    }
    
    get_image_id(obj = null) {
        return MetaTitleInfo.TITLE_INFO_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaTitleInfo.TITLE_INFO_IMAGE_ID = "titleinfo";
        MetaTitleInfo.global_meta = null;
    }
}


MetaTitleInfo.static_constructor();

module.exports = MetaTitleInfo