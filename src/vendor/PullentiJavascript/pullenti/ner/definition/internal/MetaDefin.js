/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const DefinitionKind = require("./../DefinitionKind");

class MetaDefin extends ReferentClass {
    
    static initialize() {
        const DefinitionReferent = require("./../DefinitionReferent");
        MetaDefin.global_meta = new MetaDefin();
        MetaDefin.global_meta.add_feature(DefinitionReferent.ATTR_TERMIN, "Термин", 1, 0);
        MetaDefin.global_meta.add_feature(DefinitionReferent.ATTR_TERMIN_ADD, "Дополнение термина", 0, 0);
        MetaDefin.global_meta.add_feature(DefinitionReferent.ATTR_VALUE, "Значение", 1, 0);
        MetaDefin.global_meta.add_feature(DefinitionReferent.ATTR_MISC, "Мелочь", 0, 0);
        MetaDefin.global_meta.add_feature(DefinitionReferent.ATTR_DECREE, "Ссылка на НПА", 0, 0);
        let fi = MetaDefin.global_meta.add_feature(DefinitionReferent.ATTR_KIND, "Тип", 1, 1);
        fi.add_value(DefinitionKind.ASSERTATION.toString(), "Утверждение", null, null);
        fi.add_value(DefinitionKind.DEFINITION.toString(), "Определение", null, null);
        fi.add_value(DefinitionKind.NEGATION.toString(), "Отрицание", null, null);
    }
    
    get name() {
        const DefinitionReferent = require("./../DefinitionReferent");
        return DefinitionReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Тезис";
    }
    
    get_image_id(obj = null) {
        const DefinitionReferent = require("./../DefinitionReferent");
        if (obj instanceof DefinitionReferent) {
            let ki = (obj).kind;
            if (ki === DefinitionKind.DEFINITION) 
                return MetaDefin.IMAGE_DEF_ID;
        }
        return MetaDefin.IMAGE_ASS_ID;
    }
    
    static static_constructor() {
        MetaDefin.IMAGE_DEF_ID = "defin";
        MetaDefin.IMAGE_ASS_ID = "assert";
        MetaDefin.global_meta = null;
    }
}


MetaDefin.static_constructor();

module.exports = MetaDefin