/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class InstrumentParticipantMeta extends ReferentClass {
    
    static initialize() {
        const InstrumentParticipant = require("./../InstrumentParticipant");
        InstrumentParticipantMeta.GLOBAL_META = new InstrumentParticipantMeta();
        InstrumentParticipantMeta.GLOBAL_META.add_feature(InstrumentParticipant.ATTR_TYPE, "Тип", 0, 1);
        InstrumentParticipantMeta.GLOBAL_META.add_feature(InstrumentParticipant.ATTR_REF, "Ссылка на объект", 0, 1).show_as_parent = true;
        InstrumentParticipantMeta.GLOBAL_META.add_feature(InstrumentParticipant.ATTR_DELEGATE, "Ссылка на представителя", 0, 1).show_as_parent = true;
        InstrumentParticipantMeta.GLOBAL_META.add_feature(InstrumentParticipant.ATTR_GROUND, "Основание", 0, 1).show_as_parent = true;
    }
    
    get name() {
        const InstrumentParticipant = require("./../InstrumentParticipant");
        return InstrumentParticipant.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Участник";
    }
    
    get_image_id(obj = null) {
        return InstrumentParticipantMeta.IMAGE_ID;
    }
    
    static static_constructor() {
        InstrumentParticipantMeta.IMAGE_ID = "participant";
        InstrumentParticipantMeta.GLOBAL_META = null;
    }
}


InstrumentParticipantMeta.static_constructor();

module.exports = InstrumentParticipantMeta