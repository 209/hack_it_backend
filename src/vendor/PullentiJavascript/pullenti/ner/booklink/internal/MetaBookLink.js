/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MetaTitleInfo = require("./../../titlepage/internal/MetaTitleInfo");

class MetaBookLink extends MetaTitleInfo {
    
    static initialize2() {
        const BookLinkReferent = require("./../BookLinkReferent");
        MetaBookLink.global_meta = new MetaBookLink();
        MetaBookLink.global_meta.add_feature(BookLinkReferent.ATTR_AUTHOR, "Автор", 0, 0);
        MetaBookLink.global_meta.add_feature(BookLinkReferent.ATTR_NAME, "Наименование", 1, 1);
        MetaBookLink.global_meta.add_feature(BookLinkReferent.ATTR_TYPE, "Тип", 0, 1);
        MetaBookLink.global_meta.add_feature(BookLinkReferent.ATTR_YEAR, "Год", 0, 1);
        MetaBookLink.global_meta.add_feature(BookLinkReferent.ATTR_GEO, "География", 0, 1);
        MetaBookLink.global_meta.add_feature(BookLinkReferent.ATTR_LANG, "Язык", 0, 1);
        MetaBookLink.global_meta.add_feature(BookLinkReferent.ATTR_URL, "URL", 0, 0);
        MetaBookLink.global_meta.add_feature(BookLinkReferent.ATTR_MISC, "Разное", 0, 0);
    }
    
    get name() {
        const BookLinkReferent = require("./../BookLinkReferent");
        return BookLinkReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Ссылка на внешний источник";
    }
    
    get_image_id(obj = null) {
        return MetaBookLink.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaBookLink.IMAGE_ID = "booklink";
        MetaBookLink.global_meta = null;
    }
}


MetaBookLink.static_constructor();

module.exports = MetaBookLink