/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const ReferentClass = require("./../../ReferentClass");

class MetaUri extends ReferentClass {
    
    static initialize() {
        const UriReferent = require("./../UriReferent");
        MetaUri.global_meta = new MetaUri();
        MetaUri.global_meta.add_feature(UriReferent.ATTR_VALUE, "Значение", 0, 1);
        MetaUri.global_meta.add_feature(UriReferent.ATTR_SCHEME, "Схема", 0, 1);
        MetaUri.global_meta.add_feature(UriReferent.ATTR_DETAIL, "Детализация", 0, 1);
    }
    
    get name() {
        const UriReferent = require("./../UriReferent");
        return UriReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "URI";
    }
    
    get_image_id(obj = null) {
        const UriReferent = require("./../UriReferent");
        let web = Utils.as(obj, UriReferent);
        if (web !== null && web.scheme === "mailto") 
            return MetaUri.MAIL_IMAGE_ID;
        else 
            return MetaUri.URI_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaUri.MAIL_IMAGE_ID = "mail";
        MetaUri.URI_IMAGE_ID = "uri";
        MetaUri.global_meta = null;
    }
}


MetaUri.static_constructor();

module.exports = MetaUri