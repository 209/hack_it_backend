/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const TransportKind = require("./../TransportKind");

class MetaTransport extends ReferentClass {
    
    static initialize() {
        const TransportReferent = require("./../TransportReferent");
        MetaTransport.global_meta = new MetaTransport();
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_TYPE, "Тип", 0, 0);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_NAME, "Название", 0, 0);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_NUMBER, "Номер", 0, 1);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_NUMBER_REGION, "Регион номера", 0, 1);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_BRAND, "Марка", 0, 0);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_MODEL, "Модель", 0, 0);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_CLASS, "Класс", 0, 1);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_KIND, "Категория", 1, 1);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_GEO, "География", 0, 0);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_ORG, "Организация", 0, 1);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_DATE, "Дата создания", 0, 1);
        MetaTransport.global_meta.add_feature(TransportReferent.ATTR_ROUTEPOINT, "Пункт маршрута", 0, 1);
    }
    
    get name() {
        const TransportReferent = require("./../TransportReferent");
        return TransportReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Транспорт";
    }
    
    get_image_id(obj = null) {
        const TransportReferent = require("./../TransportReferent");
        if (obj instanceof TransportReferent) {
            let ok = (obj).kind;
            if (ok !== TransportKind.UNDEFINED) 
                return ok.toString();
        }
        return MetaTransport.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaTransport.IMAGE_ID = "tansport";
        MetaTransport.global_meta = null;
    }
}


MetaTransport.static_constructor();

module.exports = MetaTransport