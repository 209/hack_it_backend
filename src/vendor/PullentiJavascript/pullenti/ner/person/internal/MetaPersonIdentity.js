/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class MetaPersonIdentity extends ReferentClass {
    
    static initialize() {
        const PersonIdentityReferent = require("./../PersonIdentityReferent");
        MetaPersonIdentity.global_meta = new MetaPersonIdentity();
        MetaPersonIdentity.global_meta.add_feature(PersonIdentityReferent.ATTR_TYPE, "Тип", 1, 1);
        MetaPersonIdentity.global_meta.add_feature(PersonIdentityReferent.ATTR_NUMBER, "Номер", 1, 1);
        MetaPersonIdentity.global_meta.add_feature(PersonIdentityReferent.ATTR_DATE, "Дата выдачи", 0, 1);
        MetaPersonIdentity.global_meta.add_feature(PersonIdentityReferent.ATTR_ORG, "Кто выдал", 0, 1);
        MetaPersonIdentity.global_meta.add_feature(PersonIdentityReferent.ATTR_ADDRESS, "Адрес регистрации", 0, 1);
    }
    
    get name() {
        const PersonIdentityReferent = require("./../PersonIdentityReferent");
        return PersonIdentityReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Удостоверение личности";
    }
    
    get_image_id(obj = null) {
        return MetaPersonIdentity.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaPersonIdentity.IMAGE_ID = "identity";
        MetaPersonIdentity.global_meta = null;
    }
}


MetaPersonIdentity.static_constructor();

module.exports = MetaPersonIdentity