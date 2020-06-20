/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const InstrumentBlockReferent = require("./../InstrumentBlockReferent");

class MetaInstrument extends ReferentClass {
    
    static initialize() {
        const InstrumentReferent = require("./../InstrumentReferent");
        MetaInstrument.GLOBAL_META = new MetaInstrument();
        MetaInstrument.GLOBAL_META.add_feature(InstrumentReferent.ATTR_TYPE, "Тип", 0, 1);
        MetaInstrument.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_NUMBER, "Номер", 0, 1);
        MetaInstrument.GLOBAL_META.add_feature(InstrumentReferent.ATTR_CASENUMBER, "Номер дела", 0, 1);
        MetaInstrument.GLOBAL_META.add_feature(InstrumentReferent.ATTR_DATE, "Дата", 0, 1);
        MetaInstrument.GLOBAL_META.add_feature(InstrumentReferent.ATTR_SOURCE, "Публикующий орган", 0, 1);
        MetaInstrument.GLOBAL_META.add_feature(InstrumentReferent.ATTR_GEO, "Географический объект", 0, 1);
        MetaInstrument.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_NAME, "Наименование", 0, 0);
        MetaInstrument.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_CHILD, "Внутренний элемент", 0, 0).show_as_parent = true;
        MetaInstrument.GLOBAL_META.add_feature(InstrumentReferent.ATTR_SIGNER, "Подписант", 0, 1);
        MetaInstrument.GLOBAL_META.add_feature(InstrumentReferent.ATTR_PART, "Часть", 0, 1);
        MetaInstrument.GLOBAL_META.add_feature(InstrumentReferent.ATTR_APPENDIX, "Приложение", 0, 0);
        MetaInstrument.GLOBAL_META.add_feature(InstrumentReferent.ATTR_PARTICIPANT, "Участник", 0, 0).show_as_parent = true;
        MetaInstrument.GLOBAL_META.add_feature(InstrumentReferent.ATTR_ARTEFACT, "Артефакт", 0, 0).show_as_parent = true;
    }
    
    get name() {
        const InstrumentReferent = require("./../InstrumentReferent");
        return InstrumentReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Нормативно-правовой акт";
    }
    
    get_image_id(obj = null) {
        return MetaInstrument.DOC_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaInstrument.DOC_IMAGE_ID = "decree";
        MetaInstrument.PART_IMAGE_ID = "part";
        MetaInstrument.GLOBAL_META = null;
    }
}


MetaInstrument.static_constructor();

module.exports = MetaInstrument