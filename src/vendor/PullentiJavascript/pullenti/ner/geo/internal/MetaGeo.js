/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const ReferentClass = require("./../../ReferentClass");

class MetaGeo extends ReferentClass {
    
    static initialize() {
        const GeoReferent = require("./../GeoReferent");
        MetaGeo.global_meta = new MetaGeo();
        MetaGeo.global_meta.add_feature(GeoReferent.ATTR_NAME, "Наименование", 1, 0);
        MetaGeo.global_meta.add_feature(GeoReferent.ATTR_TYPE, "Тип", 1, 0);
        MetaGeo.global_meta.add_feature(GeoReferent.ATTR_ALPHA2, "Код страны", 0, 1);
        MetaGeo.global_meta.add_feature(GeoReferent.ATTR_HIGHER, "Вышестоящий объект", 0, 1);
        MetaGeo.global_meta.add_feature(GeoReferent.ATTR_REF, "Ссылка на объект", 0, 1);
        MetaGeo.global_meta.add_feature(GeoReferent.ATTR_FIAS, "Объект ФИАС", 0, 1);
        MetaGeo.global_meta.add_feature(GeoReferent.ATTR_BTI, "Код БТИ", 0, 1);
    }
    
    get name() {
        const GeoReferent = require("./../GeoReferent");
        return GeoReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Территориальное образование";
    }
    
    get_image_id(obj = null) {
        const GeoReferent = require("./../GeoReferent");
        let ter = Utils.as(obj, GeoReferent);
        if (ter !== null) {
            if (ter.is_union) 
                return MetaGeo.UNION_IMAGE_ID;
            if (ter.is_city && ((ter.is_state || ter.is_region))) 
                return MetaGeo.COUNTRY_CITY_IMAGE_ID;
            if (ter.is_state) 
                return MetaGeo.COUNTRY_IMAGE_ID;
            if (ter.is_city) 
                return MetaGeo.CITY_IMAGE_ID;
            if (ter.is_region && ter.higher !== null && ter.higher.is_city) 
                return MetaGeo.DISTRICT_IMAGE_ID;
            if (ter.is_territory) 
                return MetaGeo.TERR_IMAGE_ID;
        }
        return MetaGeo.REGION_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaGeo.COUNTRY_CITY_IMAGE_ID = "countrycity";
        MetaGeo.COUNTRY_IMAGE_ID = "country";
        MetaGeo.CITY_IMAGE_ID = "city";
        MetaGeo.DISTRICT_IMAGE_ID = "district";
        MetaGeo.REGION_IMAGE_ID = "region";
        MetaGeo.TERR_IMAGE_ID = "territory";
        MetaGeo.UNION_IMAGE_ID = "union";
        MetaGeo.global_meta = null;
    }
}


MetaGeo.static_constructor();

module.exports = MetaGeo