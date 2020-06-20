/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const ReferentClass = require("./../../ReferentClass");
const BookLinkRefType = require("./../BookLinkRefType");

class MetaBookLinkRef extends ReferentClass {
    
    static initialize() {
        const BookLinkRefReferent = require("./../BookLinkRefReferent");
        MetaBookLinkRef.global_meta = new MetaBookLinkRef();
        MetaBookLinkRef.global_meta.add_feature(BookLinkRefReferent.ATTR_BOOK, "Источник", 1, 1);
        MetaBookLinkRef.global_meta.add_feature(BookLinkRefReferent.ATTR_TYPE, "Тип", 0, 1);
        MetaBookLinkRef.global_meta.add_feature(BookLinkRefReferent.ATTR_PAGES, "Страницы", 0, 1);
        MetaBookLinkRef.global_meta.add_feature(BookLinkRefReferent.ATTR_NUMBER, "Номер", 0, 1);
        MetaBookLinkRef.global_meta.add_feature(BookLinkRefReferent.ATTR_MISC, "Разное", 0, 0);
    }
    
    get name() {
        const BookLinkRefReferent = require("./../BookLinkRefReferent");
        return BookLinkRefReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Ссылка на внешний источник в тексте";
    }
    
    get_image_id(obj = null) {
        const BookLinkRefReferent = require("./../BookLinkRefReferent");
        let rr = Utils.as(obj, BookLinkRefReferent);
        if (rr !== null) {
            if (rr.typ === BookLinkRefType.INLINE) 
                return MetaBookLinkRef.IMAGE_ID_INLINE;
        }
        return MetaBookLinkRef.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaBookLinkRef.IMAGE_ID = "booklinkref";
        MetaBookLinkRef.IMAGE_ID_INLINE = "booklinkrefinline";
        MetaBookLinkRef.IMAGE_ID_LAST = "booklinkreflast";
        MetaBookLinkRef.global_meta = null;
    }
}


MetaBookLinkRef.static_constructor();

module.exports = MetaBookLinkRef