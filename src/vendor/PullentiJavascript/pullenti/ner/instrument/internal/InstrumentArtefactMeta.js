/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const InstrumentParticipant = require("./../InstrumentParticipant");

class InstrumentArtefactMeta extends ReferentClass {
    
    static initialize() {
        const InstrumentArtefact = require("./../InstrumentArtefact");
        InstrumentArtefactMeta.GLOBAL_META = new InstrumentArtefactMeta();
        InstrumentArtefactMeta.GLOBAL_META.add_feature(InstrumentArtefact.ATTR_TYPE, "Тип", 0, 1);
        InstrumentArtefactMeta.GLOBAL_META.add_feature(InstrumentArtefact.ATTR_VALUE, "Значение", 0, 1);
        InstrumentArtefactMeta.GLOBAL_META.add_feature(InstrumentArtefact.ATTR_REF, "Ссылка на объект", 0, 1).show_as_parent = true;
    }
    
    get name() {
        return InstrumentParticipant.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Артефакт";
    }
    
    get_image_id(obj = null) {
        return InstrumentArtefactMeta.IMAGE_ID;
    }
    
    static static_constructor() {
        InstrumentArtefactMeta.IMAGE_ID = "artefact";
        InstrumentArtefactMeta.GLOBAL_META = null;
    }
}


InstrumentArtefactMeta.static_constructor();

module.exports = InstrumentArtefactMeta