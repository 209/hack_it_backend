/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const OrgProfile = require("./../OrgProfile");
const Referent = require("./../../Referent");

class MetaOrganization extends ReferentClass {
    
    static initialize() {
        const OrganizationReferent = require("./../OrganizationReferent");
        MetaOrganization.global_meta = new MetaOrganization();
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_NAME, "Название", 0, 0);
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_TYPE, "Тип", 0, 0);
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_EPONYM, "Эпоним (имени)", 0, 0);
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_NUMBER, "Номер", 0, 1);
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_HIGHER, "Вышестоящая организация", 0, 1);
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_OWNER, "Объект-владелец", 0, 1);
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_GEO, "Географический объект", 0, 1);
        MetaOrganization.global_meta.add_feature(Referent.ATTR_GENERAL, "Обобщающая организация", 0, 1);
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_KLADR, "Код КЛАДР", 0, 1);
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_MISC, "Разное", 0, 0);
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_PROFILE, "Профиль", 0, 0);
        MetaOrganization.global_meta.add_feature(OrganizationReferent.ATTR_MARKER, "Маркер", 0, 0);
    }
    
    get name() {
        const OrganizationReferent = require("./../OrganizationReferent");
        return OrganizationReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Организация";
    }
    
    get_image_id(obj = null) {
        const OrganizationReferent = require("./../OrganizationReferent");
        if (obj instanceof OrganizationReferent) {
            let prs = (obj).profiles;
            if (prs !== null && prs.length > 0) {
                let pr = prs[prs.length - 1];
                return pr.toString();
            }
        }
        return MetaOrganization.ORG_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaOrganization.ORG_IMAGE_ID = "org";
        MetaOrganization.global_meta = null;
    }
}


MetaOrganization.static_constructor();

module.exports = MetaOrganization