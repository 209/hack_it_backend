/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const ReferentClass = require("./../../ReferentClass");
const Referent = require("./../../Referent");

class MetaPerson extends ReferentClass {
    
    static initialize() {
        const PersonReferent = require("./../PersonReferent");
        MetaPerson.global_meta = new MetaPerson();
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_IDENTITY, "Идентификация", 0, 0);
        let sex = MetaPerson.global_meta.add_feature(PersonReferent.ATTR_SEX, "Пол", 0, 0);
        sex.add_value(MetaPerson.ATTR_SEXMALE, "мужской", null, null);
        sex.add_value(MetaPerson.ATTR_SEXFEMALE, "женский", null, null);
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_LASTNAME, "Фамилия", 0, 0);
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_FIRSTNAME, "Имя", 0, 0);
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_MIDDLENAME, "Отчество", 0, 0);
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_NICKNAME, "Псевдоним", 0, 0);
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_ATTR, "Свойство", 0, 0);
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_AGE, "Возраст", 0, 1);
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_BORN, "Родился", 0, 1);
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_DIE, "Умер", 0, 1);
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_CONTACT, "Контактные данные", 0, 0);
        MetaPerson.global_meta.add_feature(PersonReferent.ATTR_IDDOC, "Удостоверение личности", 0, 0).show_as_parent = true;
        MetaPerson.global_meta.add_feature(Referent.ATTR_GENERAL, "Обобщающая персона", 0, 1);
    }
    
    get name() {
        const PersonReferent = require("./../PersonReferent");
        return PersonReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Персона";
    }
    
    get_image_id(obj = null) {
        const PersonReferent = require("./../PersonReferent");
        let pers = Utils.as(obj, PersonReferent);
        if (pers !== null) {
            if (pers.find_slot("@GENERAL", null, true) !== null) 
                return MetaPerson.GENERAL_IMAGE_ID;
            if (pers.is_male) 
                return MetaPerson.MAN_IMAGE_ID;
            if (pers.is_female) 
                return MetaPerson.WOMEN_IMAGE_ID;
        }
        return MetaPerson.PERSON_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaPerson.ATTR_SEXMALE = "MALE";
        MetaPerson.ATTR_SEXFEMALE = "FEMALE";
        MetaPerson.MAN_IMAGE_ID = "man";
        MetaPerson.WOMEN_IMAGE_ID = "women";
        MetaPerson.PERSON_IMAGE_ID = "person";
        MetaPerson.GENERAL_IMAGE_ID = "general";
        MetaPerson.global_meta = null;
    }
}


MetaPerson.static_constructor();

module.exports = MetaPerson