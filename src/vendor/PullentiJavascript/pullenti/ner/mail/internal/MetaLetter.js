/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class MetaLetter extends ReferentClass {
    
    static initialize() {
        const MailReferent = require("./../MailReferent");
        MetaLetter.global_meta = new MetaLetter();
        MetaLetter.global_meta.add_feature(MailReferent.ATTR_KIND, "Тип блока", 1, 1);
        MetaLetter.global_meta.add_feature(MailReferent.ATTR_TEXT, "Текст блока", 1, 1);
        MetaLetter.global_meta.add_feature(MailReferent.ATTR_REF, "Ссылка на объект", 0, 0);
    }
    
    get name() {
        const MailReferent = require("./../MailReferent");
        return MailReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Блок письма";
    }
    
    get_image_id(obj = null) {
        return MetaLetter.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaLetter.IMAGE_ID = "letter";
        MetaLetter.global_meta = null;
    }
}


MetaLetter.static_constructor();

module.exports = MetaLetter