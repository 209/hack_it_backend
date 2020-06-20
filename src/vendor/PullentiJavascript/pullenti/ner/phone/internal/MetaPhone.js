/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const Referent = require("./../../Referent");

class MetaPhone extends ReferentClass {
    
    static initialize() {
        const PhoneReferent = require("./../PhoneReferent");
        MetaPhone.global_meta = new MetaPhone();
        MetaPhone.global_meta.add_feature(PhoneReferent.ATTR_NUNBER, "Номер", 1, 1);
        MetaPhone.global_meta.add_feature(PhoneReferent.ATTR_ADDNUMBER, "Добавочный номер", 0, 1);
        MetaPhone.global_meta.add_feature(PhoneReferent.ATTR_COUNTRYCODE, "Код страны", 0, 1);
        MetaPhone.global_meta.add_feature(Referent.ATTR_GENERAL, "Обобщающий номер", 0, 1);
        MetaPhone.global_meta.add_feature(PhoneReferent.ATTR_KIND, "Тип", 0, 1);
    }
    
    get name() {
        const PhoneReferent = require("./../PhoneReferent");
        return PhoneReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Телефонный номер";
    }
    
    get_image_id(obj = null) {
        return MetaPhone.PHONE_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaPhone.PHONE_IMAGE_ID = "phone";
        MetaPhone.global_meta = null;
    }
}


MetaPhone.static_constructor();

module.exports = MetaPhone