/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const PersonPropertyKind = require("./../PersonPropertyKind");
const Referent = require("./../../Referent");

class MetaPersonProperty extends ReferentClass {
    
    static initialize() {
        const PersonPropertyReferent = require("./../PersonPropertyReferent");
        MetaPersonProperty.global_meta = new MetaPersonProperty();
        MetaPersonProperty.global_meta.add_feature(PersonPropertyReferent.ATTR_NAME, "Наименование", 1, 1);
        MetaPersonProperty.global_meta.add_feature(PersonPropertyReferent.ATTR_HIGHER, "Вышестоящее свойство", 0, 0);
        MetaPersonProperty.global_meta.add_feature(PersonPropertyReferent.ATTR_ATTR, "Атрибут", 0, 0);
        MetaPersonProperty.global_meta.add_feature(PersonPropertyReferent.ATTR_REF, "Ссылка на объект", 0, 1);
        MetaPersonProperty.global_meta.add_feature(Referent.ATTR_GENERAL, "Обобщающее свойство", 1, 0);
    }
    
    get name() {
        const PersonPropertyReferent = require("./../PersonPropertyReferent");
        return PersonPropertyReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Свойство персоны";
    }
    
    get_image_id(obj = null) {
        const PersonPropertyReferent = require("./../PersonPropertyReferent");
        let ki = PersonPropertyKind.UNDEFINED;
        if (obj instanceof PersonPropertyReferent) 
            ki = (obj).kind;
        if (ki === PersonPropertyKind.BOSS) 
            return MetaPersonProperty.PERSON_PROP_BOSS_IMAGE_ID;
        if (ki === PersonPropertyKind.KING) 
            return MetaPersonProperty.PERSON_PROP_KING_IMAGE_ID;
        if (ki === PersonPropertyKind.KIN) 
            return MetaPersonProperty.PERSON_PROP_KIN_IMAGE_ID;
        if (ki === PersonPropertyKind.MILITARYRANK) 
            return MetaPersonProperty.PERSON_PROP_MILITARY_ID;
        if (ki === PersonPropertyKind.NATIONALITY) 
            return MetaPersonProperty.PERSON_PROP_NATION_ID;
        return MetaPersonProperty.PERSON_PROP_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaPersonProperty.PERSON_PROP_IMAGE_ID = "personprop";
        MetaPersonProperty.PERSON_PROP_KING_IMAGE_ID = "king";
        MetaPersonProperty.PERSON_PROP_BOSS_IMAGE_ID = "boss";
        MetaPersonProperty.PERSON_PROP_KIN_IMAGE_ID = "kin";
        MetaPersonProperty.PERSON_PROP_MILITARY_ID = "militaryrank";
        MetaPersonProperty.PERSON_PROP_NATION_ID = "nationality";
        MetaPersonProperty.global_meta = null;
    }
}


MetaPersonProperty.static_constructor();

module.exports = MetaPersonProperty