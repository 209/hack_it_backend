/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class MetaWeapon extends ReferentClass {
    
    static initialize() {
        const WeaponReferent = require("./../WeaponReferent");
        MetaWeapon.global_meta = new MetaWeapon();
        MetaWeapon.global_meta.add_feature(WeaponReferent.ATTR_TYPE, "Тип", 0, 0);
        MetaWeapon.global_meta.add_feature(WeaponReferent.ATTR_NAME, "Название", 0, 0);
        MetaWeapon.global_meta.add_feature(WeaponReferent.ATTR_NUMBER, "Номер", 0, 1);
        MetaWeapon.global_meta.add_feature(WeaponReferent.ATTR_BRAND, "Марка", 0, 0);
        MetaWeapon.global_meta.add_feature(WeaponReferent.ATTR_MODEL, "Модель", 0, 0);
        MetaWeapon.global_meta.add_feature(WeaponReferent.ATTR_DATE, "Дата создания", 0, 1);
        MetaWeapon.global_meta.add_feature(WeaponReferent.ATTR_CALIBER, "Калибр", 0, 1);
        MetaWeapon.global_meta.add_feature(WeaponReferent.ATTR_REF, "Ссылка", 0, 0);
    }
    
    get name() {
        const WeaponReferent = require("./../WeaponReferent");
        return WeaponReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Оружие";
    }
    
    get_image_id(obj = null) {
        return MetaWeapon.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaWeapon.IMAGE_ID = "weapon";
        MetaWeapon.global_meta = null;
    }
}


MetaWeapon.static_constructor();

module.exports = MetaWeapon