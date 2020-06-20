/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const OrgProfile = require("./../OrgProfile");
const OrganizationKind = require("./../OrganizationKind");
const ReferentEqualType = require("./../../ReferentEqualType");
const Referent = require("./../../Referent");
const OrganizationReferent = require("./../OrganizationReferent");

class OrgOwnershipHelper {
    
    /**
     * Проверка на отношения "вышестоящий - нижестоящий"
     * @param higher 
     * @param lower 
     * @return 
     */
    static can_be_higher(higher, lower, robust = false) {
        if (higher === null || lower === null || higher === lower) 
            return false;
        if (lower.owner !== null) 
            return false;
        let hk = higher.kind;
        let lk = lower.kind;
        if (higher.can_be_equals(lower, ReferentEqualType.WITHINONETEXT)) 
            return false;
        if (lower.higher === null && lower.find_slot(OrganizationReferent.ATTR_HIGHER, null, true) !== null) 
            return false;
        let htyps = higher.types;
        let ltyps = lower.types;
        if (hk !== OrganizationKind.BANK) {
            for (const v of htyps) {
                if (ltyps.includes(v)) 
                    return false;
            }
        }
        if (hk !== OrganizationKind.DEPARTMENT && lk === OrganizationKind.DEPARTMENT) {
            if (OrgOwnershipHelper._contains(ltyps, "курс", null) || OrgOwnershipHelper._contains(ltyps, "группа", "група")) 
                return hk === OrganizationKind.STUDY || OrgOwnershipHelper._contains(htyps, "институт", "інститут");
            if (OrgOwnershipHelper._contains(ltyps, "епархия", "єпархія") || OrgOwnershipHelper._contains(ltyps, "патриархия", "патріархія")) 
                return hk === OrganizationKind.CHURCH;
            if (hk === OrganizationKind.UNDEFINED) {
                if (OrgOwnershipHelper._contains(htyps, "управление", "управління")) 
                    return false;
            }
            return true;
        }
        if (lower.contains_profile(OrgProfile.UNIT) || OrgOwnershipHelper._contains(ltyps, "department", null)) {
            if (!higher.contains_profile(OrgProfile.UNIT) && lk !== OrganizationKind.DEPARTMENT) 
                return true;
        }
        if (OrgOwnershipHelper._contains(htyps, "правительство", "уряд")) {
            if (lk === OrganizationKind.GOVENMENT) 
                return (((ltyps.includes("агентство") || ltyps.includes("федеральная служба") || ltyps.includes("федеральна служба")) || ltyps.includes("департамент") || ltyps.includes("комиссия")) || ltyps.includes("комитет") || ltyps.includes("комісія")) || ltyps.includes("комітет");
        }
        if (hk === OrganizationKind.GOVENMENT) {
            if (lk === OrganizationKind.GOVENMENT) {
                if (OrgOwnershipHelper._contains(ltyps, "комиссия", "комісія") || OrgOwnershipHelper._contains(ltyps, "инспекция", "інспекція") || OrgOwnershipHelper._contains(ltyps, "комитет", "комітет")) {
                    if ((!OrgOwnershipHelper._contains(htyps, "комиссия", "комісія") && !OrgOwnershipHelper._contains(htyps, "инспекция", "інспекція") && !OrgOwnershipHelper._contains(ltyps, "государственный комитет", null)) && !OrgOwnershipHelper._contains(htyps, "комитет", "комітет") && ((!OrgOwnershipHelper._contains(htyps, "совет", "рада") || higher.toString().includes("Верховн")))) 
                        return true;
                }
                if (higher.find_slot(OrganizationReferent.ATTR_NAME, "ФЕДЕРАЛЬНОЕ СОБРАНИЕ", true) !== null || htyps.includes("конгресс") || htyps.includes("парламент")) {
                    if ((lower.find_slot(OrganizationReferent.ATTR_NAME, "СОВЕТ ФЕДЕРАЦИИ", true) !== null || lower.find_slot(OrganizationReferent.ATTR_NAME, "ГОСУДАРСТВЕННАЯ ДУМА", true) !== null || lower.find_slot(OrganizationReferent.ATTR_NAME, "ВЕРХОВНА РАДА", true) !== null) || OrgOwnershipHelper._contains(ltyps, "палата", null) || OrgOwnershipHelper._contains(ltyps, "совет", null)) 
                        return true;
                }
                if (higher.find_slot(OrganizationReferent.ATTR_NAME, "ФСБ", true) !== null) {
                    if (lower.find_slot(OrganizationReferent.ATTR_NAME, "ФПС", true) !== null) 
                        return true;
                }
                if (OrgOwnershipHelper._contains(htyps, "государственный комитет", null)) {
                    if ((OrgOwnershipHelper._contains(ltyps, "комиссия", "комісія") || OrgOwnershipHelper._contains(ltyps, "инспекция", "інспекція") || OrgOwnershipHelper._contains(ltyps, "комитет", "комітет")) || OrgOwnershipHelper._contains(ltyps, "департамент", null)) 
                        return true;
                }
            }
            else if (lk === OrganizationKind.UNDEFINED) {
                if ((OrgOwnershipHelper._contains(ltyps, "комиссия", "комісія") || OrgOwnershipHelper._contains(ltyps, "инспекция", "інспекція") || OrgOwnershipHelper._contains(ltyps, "комитет", "комітет")) || OrgOwnershipHelper._contains(ltyps, "управление", "управління") || OrgOwnershipHelper._contains(ltyps, "служба", null)) 
                    return true;
            }
            else if (lk === OrganizationKind.BANK) {
            }
        }
        if (OrgOwnershipHelper._contains(htyps, "министерство", "міністерство")) {
            if ((((((OrgOwnershipHelper._contains(ltyps, "институт", "інститут") || OrgOwnershipHelper._contains(ltyps, "университет", "університет") || OrgOwnershipHelper._contains(ltyps, "училище", null)) || OrgOwnershipHelper._contains(ltyps, "школа", null) || OrgOwnershipHelper._contains(ltyps, "лицей", "ліцей")) || OrgOwnershipHelper._contains(ltyps, "НИИ", "НДІ") || OrgOwnershipHelper._contains(ltyps, "Ф", null)) || OrgOwnershipHelper._contains(ltyps, "департамент", null) || OrgOwnershipHelper._contains(ltyps, "управление", "управління")) || OrgOwnershipHelper._contains(ltyps, "комитет", "комітет") || OrgOwnershipHelper._contains(ltyps, "комиссия", "комісія")) || OrgOwnershipHelper._contains(ltyps, "инспекция", "інспекція") || OrgOwnershipHelper._contains(ltyps, "центр", null)) 
                return true;
            if (OrgOwnershipHelper._contains(ltyps, "академия", "академія")) {
            }
            if (OrgOwnershipHelper._contains(ltyps, "служба", null) && !OrgOwnershipHelper._contains(ltyps, "федеральная служба", "федеральна служба")) 
                return true;
            if (lk === OrganizationKind.CULTURE || lk === OrganizationKind.MEDICAL) 
                return true;
        }
        if (OrgOwnershipHelper._contains(htyps, "академия", "академія")) {
            if (OrgOwnershipHelper._contains(ltyps, "институт", "інститут") || OrgOwnershipHelper._contains(ltyps, "научн", "науков") || OrgOwnershipHelper._contains(ltyps, "НИИ", "НДІ")) 
                return true;
        }
        if (OrgOwnershipHelper._contains(htyps, "факультет", null)) {
            if (OrgOwnershipHelper._contains(ltyps, "курс", null) || OrgOwnershipHelper._contains(ltyps, "кафедра", null)) 
                return true;
        }
        if (OrgOwnershipHelper._contains(htyps, "university", null)) {
            if (OrgOwnershipHelper._contains(ltyps, "school", null) || OrgOwnershipHelper._contains(ltyps, "college", null)) 
                return true;
        }
        let hr = OrgOwnershipHelper._military_rank(htyps);
        let lr = OrgOwnershipHelper._military_rank(ltyps);
        if (hr > 0) {
            if (lr > 0) 
                return hr < lr;
            else if (hr === 3 && ((ltyps.includes("войсковая часть") || ltyps.includes("військова частина")))) 
                return true;
        }
        else if (htyps.includes("войсковая часть") || htyps.includes("військова частина")) {
            if (lr >= 6) 
                return true;
        }
        if (lr >= 6) {
            if (higher.contains_profile(OrgProfile.POLICY) || higher.contains_profile(OrgProfile.UNION)) 
                return true;
        }
        if (hk === OrganizationKind.STUDY || OrgOwnershipHelper._contains(htyps, "институт", "інститут") || OrgOwnershipHelper._contains(htyps, "академия", "академія")) {
            if (((OrgOwnershipHelper._contains(ltyps, "магистратура", "магістратура") || OrgOwnershipHelper._contains(ltyps, "аспирантура", "аспірантура") || OrgOwnershipHelper._contains(ltyps, "докторантура", null)) || OrgOwnershipHelper._contains(ltyps, "факультет", null) || OrgOwnershipHelper._contains(ltyps, "кафедра", null)) || OrgOwnershipHelper._contains(ltyps, "курс", null)) 
                return true;
        }
        if (hk !== OrganizationKind.DEPARTMENT) {
            if (((((OrgOwnershipHelper._contains(ltyps, "департамент", null) || OrgOwnershipHelper._contains(ltyps, "центр", null))) && hk !== OrganizationKind.MEDICAL && hk !== OrganizationKind.SCIENCE) && !OrgOwnershipHelper._contains(htyps, "центр", null) && !OrgOwnershipHelper._contains(htyps, "департамент", null)) && !OrgOwnershipHelper._contains(htyps, "управление", "управління")) 
                return true;
            if (OrgOwnershipHelper._contains(htyps, "департамент", null) || robust) {
                if (OrgOwnershipHelper._contains(ltyps, "центр", null)) 
                    return true;
                if (lk === OrganizationKind.STUDY) 
                    return true;
            }
            if (OrgOwnershipHelper._contains(htyps, "служба", null) || OrgOwnershipHelper._contains(htyps, "штаб", null)) {
                if (OrgOwnershipHelper._contains(ltyps, "управление", "управління")) 
                    return true;
            }
            if (hk === OrganizationKind.BANK) {
                if (OrgOwnershipHelper._contains(ltyps, "управление", "управління") || OrgOwnershipHelper._contains(ltyps, "департамент", null)) 
                    return true;
            }
            if (hk === OrganizationKind.PARTY || hk === OrganizationKind.FEDERATION) {
                if (OrgOwnershipHelper._contains(ltyps, "комитет", "комітет")) 
                    return true;
            }
            if ((lk === OrganizationKind.FEDERATION && hk !== OrganizationKind.FEDERATION && hk !== OrganizationKind.GOVENMENT) && hk !== OrganizationKind.PARTY) {
                if (!OrgOwnershipHelper._contains(htyps, "фонд", null) && hk !== OrganizationKind.UNDEFINED) 
                    return true;
            }
        }
        else if (OrgOwnershipHelper._contains(htyps, "управление", "управління") || OrgOwnershipHelper._contains(htyps, "департамент", null)) {
            if (!OrgOwnershipHelper._contains(ltyps, "управление", "управління") && !OrgOwnershipHelper._contains(ltyps, "департамент", null) && lk === OrganizationKind.DEPARTMENT) 
                return true;
            if (OrgOwnershipHelper._contains(htyps, "главное", "головне") && OrgOwnershipHelper._contains(htyps, "управление", "управління")) {
                if (OrgOwnershipHelper._contains(ltyps, "департамент", null)) 
                    return true;
                if (OrgOwnershipHelper._contains(ltyps, "управление", "управління")) {
                    if (!ltyps.includes("главное управление") && !ltyps.includes("головне управління") && !ltyps.includes("пограничное управление")) 
                        return true;
                }
            }
            if (OrgOwnershipHelper._contains(htyps, "управление", "управління") && OrgOwnershipHelper._contains(ltyps, "центр", null)) 
                return true;
            if (OrgOwnershipHelper._contains(htyps, "департамент", null) && OrgOwnershipHelper._contains(ltyps, "управление", "управління")) 
                return true;
        }
        else if ((lk === OrganizationKind.GOVENMENT && OrgOwnershipHelper._contains(ltyps, "служба", null) && higher.higher !== null) && higher.higher.kind === OrganizationKind.GOVENMENT) 
            return true;
        else if (OrgOwnershipHelper._contains(htyps, "отдел", "відділ") && lk === OrganizationKind.DEPARTMENT && ((OrgOwnershipHelper._contains(ltyps, "стол", "стіл") || OrgOwnershipHelper._contains(ltyps, "направление", "напрямок") || OrgOwnershipHelper._contains(ltyps, "отделение", "відділ")))) 
            return true;
        if (hk === OrganizationKind.BANK) {
            if (higher.names.includes("СБЕРЕГАТЕЛЬНЫЙ БАНК")) {
                if (lk === OrganizationKind.BANK && !lower.names.includes("СБЕРЕГАТЕЛЬНЫЙ БАНК")) 
                    return true;
            }
        }
        if (lk === OrganizationKind.MEDICAL) {
            if (htyps.includes("департамент")) 
                return true;
        }
        if (lk === OrganizationKind.DEPARTMENT) {
            if (hk === OrganizationKind.DEPARTMENT && higher.higher !== null && htyps.length === 0) {
                if (OrgOwnershipHelper.can_be_higher(higher.higher, lower, false)) {
                    if (OrgOwnershipHelper._contains(ltyps, "управление", "управління") || OrgOwnershipHelper._contains(ltyps, "отдел", "відділ")) 
                        return true;
                }
            }
            if (OrgOwnershipHelper._contains(ltyps, "офис", "офіс")) {
                if (OrgOwnershipHelper._contains(htyps, "филиал", "філіал") || OrgOwnershipHelper._contains(htyps, "отделение", "відділення")) 
                    return true;
            }
        }
        if (OrgOwnershipHelper._contains(ltyps, "управление", "управління") || OrgOwnershipHelper._contains(ltyps, "отдел", "відділ")) {
            let str = higher.to_string(true, null, 0);
            if (Utils.startsWithString(str, "ГУ", true)) 
                return true;
        }
        return false;
    }
    
    static _military_rank(li) {
        if (OrgOwnershipHelper._contains(li, "фронт", null)) 
            return 1;
        if (OrgOwnershipHelper._contains(li, "группа армий", "група армій")) 
            return 2;
        if (OrgOwnershipHelper._contains(li, "армия", "армія")) 
            return 3;
        if (OrgOwnershipHelper._contains(li, "корпус", null)) 
            return 4;
        if (OrgOwnershipHelper._contains(li, "округ", null)) 
            return 5;
        if (OrgOwnershipHelper._contains(li, "дивизия", "дивізія")) 
            return 6;
        if (OrgOwnershipHelper._contains(li, "бригада", null)) 
            return 7;
        if (OrgOwnershipHelper._contains(li, "полк", null)) 
            return 8;
        if (OrgOwnershipHelper._contains(li, "батальон", "батальйон") || OrgOwnershipHelper._contains(li, "дивизион", "дивізіон")) 
            return 9;
        if (OrgOwnershipHelper._contains(li, "рота", null) || OrgOwnershipHelper._contains(li, "батарея", null) || OrgOwnershipHelper._contains(li, "эскадрон", "ескадрон")) 
            return 10;
        if (OrgOwnershipHelper._contains(li, "взвод", null) || OrgOwnershipHelper._contains(li, "отряд", "загін")) 
            return 11;
        return -1;
    }
    
    static _contains(li, v, v2 = null) {
        for (const l_ of li) {
            if (l_.includes(v)) 
                return true;
        }
        if (v2 !== null) {
            for (const l_ of li) {
                if (l_.includes(v2)) 
                    return true;
            }
        }
        return false;
    }
}


module.exports = OrgOwnershipHelper