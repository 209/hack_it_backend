/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const GeoReferent = require("./../GeoReferent");

class GeoOwnerHelper {
    
    static _get_types_string(g) {
        let tmp = new StringBuilder();
        for (const s of g.slots) {
            if (s.type_name === GeoReferent.ATTR_TYPE) 
                tmp.append(s.value).append(";");
        }
        return tmp.toString();
    }
    
    static can_be_higher_token(rhi, rlo) {
        if (rhi === null || rlo === null) 
            return false;
        if (rhi.morph._case.is_instrumental && !rhi.morph._case.is_genitive) 
            return false;
        let hi = Utils.as(rhi.get_referent(), GeoReferent);
        let lo = Utils.as(rlo.get_referent(), GeoReferent);
        if (hi === null || lo === null) 
            return false;
        let citi_in_reg = false;
        if (hi.is_city && lo.is_region) {
            if (hi.find_slot(GeoReferent.ATTR_TYPE, "город", true) !== null || hi.find_slot(GeoReferent.ATTR_TYPE, "місто", true) !== null || hi.find_slot(GeoReferent.ATTR_TYPE, "city", true) !== null) {
                let s = GeoOwnerHelper._get_types_string(lo);
                if (((s.includes("район") || s.includes("административный округ") || s.includes("муниципальный округ")) || s.includes("адміністративний округ") || s.includes("муніципальний округ")) || lo.find_slot(GeoReferent.ATTR_TYPE, "округ", true) !== null) {
                    if (rhi.next === rlo && rlo.morph._case.is_genitive) 
                        citi_in_reg = true;
                }
            }
        }
        if (hi.is_region && lo.is_city) {
            if (lo.find_slot(GeoReferent.ATTR_TYPE, "город", true) !== null || lo.find_slot(GeoReferent.ATTR_TYPE, "місто", true) !== null || lo.find_slot(GeoReferent.ATTR_TYPE, "city", true) !== null) {
                let s = GeoOwnerHelper._get_types_string(hi);
                if (s === "район;") {
                    if (hi.higher !== null && hi.higher.is_region) 
                        citi_in_reg = true;
                    else if (rhi.end_char <= rlo.begin_char && rhi.next.is_comma && !rlo.morph._case.is_genitive) 
                        citi_in_reg = true;
                    else if (rhi.end_char <= rlo.begin_char && rhi.next.is_comma) 
                        citi_in_reg = true;
                }
            }
            else 
                citi_in_reg = true;
        }
        if (rhi.end_char <= rlo.begin_char) {
            if (!rhi.morph.class0.is_adjective) {
                if (hi.is_state && !rhi.chars.is_latin_letter) 
                    return false;
            }
            if (rhi.is_newline_after || rlo.is_newline_before) {
                if (!citi_in_reg) 
                    return false;
            }
        }
        else {
        }
        if (rlo.previous !== null && rlo.previous.morph.class0.is_preposition) {
            if (rlo.previous.morph.language.is_ua) {
                if ((rlo.previous.is_value("У", null) && !rlo.morph._case.is_dative && !rlo.morph._case.is_prepositional) && !rlo.morph._case.is_undefined) 
                    return false;
                if (rlo.previous.is_value("З", null) && !rlo.morph._case.is_genitive && !rlo.morph._case.is_undefined) 
                    return false;
            }
            else {
                if ((rlo.previous.is_value("В", null) && !rlo.morph._case.is_dative && !rlo.morph._case.is_prepositional) && !rlo.morph._case.is_undefined) 
                    return false;
                if (rlo.previous.is_value("ИЗ", null) && !rlo.morph._case.is_genitive && !rlo.morph._case.is_undefined) 
                    return false;
            }
        }
        if (!GeoOwnerHelper.can_be_higher(hi, lo)) 
            return citi_in_reg;
        return true;
    }
    
    static can_be_higher(hi, lo) {
        if (hi === null || lo === null || hi === lo) 
            return false;
        if (lo.higher !== null) 
            return lo.higher === hi;
        if (lo.is_state) {
            if (lo.is_region && hi.is_state && !hi.is_region) 
                return true;
            return false;
        }
        if (hi.is_territory) 
            return false;
        if (lo.is_territory) 
            return true;
        let hit = GeoOwnerHelper._get_types_string(hi);
        let lot = GeoOwnerHelper._get_types_string(lo);
        if (hi.is_city) {
            if (lo.is_region) {
                if (hit.includes("город;") || hit.includes("місто") || hit.includes("city")) {
                    if ((lot.includes("район") || lot.includes("административный округ") || lot.includes("адміністративний округ")) || lot.includes("муниципальн") || lot.includes("муніципаль")) 
                        return true;
                    if (lo.find_slot(GeoReferent.ATTR_TYPE, "округ", true) !== null && !lot.includes("автономн")) 
                        return true;
                }
            }
            if (lo.is_city) {
                if (!hit.includes("станция") && lot.includes("станция")) 
                    return true;
                if (!hit.includes("станція") && lot.includes("станція")) 
                    return true;
                if (hit.includes("город;") || hit.includes("місто") || hit.includes("city")) {
                    if ((lot.includes("поселок") || lot.includes("селище") || lot.includes("село")) || lot.includes("деревня") || lot.includes("городок")) 
                        return true;
                }
                if (hit.includes("поселение") || hit.includes("поселок")) {
                    if (lot.includes("село;") || lot.includes("деревня") || lot.includes("хутор")) 
                        return true;
                }
                if (hit.includes("поселение") && lot.includes("поселок")) 
                    return true;
                if (hit.includes("село;")) {
                    if (lot.includes("поселение") || lot.includes("поселок")) 
                        return true;
                }
                if (hi.find_slot(GeoReferent.ATTR_NAME, "МОСКВА", true) !== null) {
                    if (lot.includes("город;") || lot.includes("місто") || lot.includes("city")) {
                        if (lo.find_slot(GeoReferent.ATTR_NAME, "ЗЕЛЕНОГРАД", true) !== null || lo.find_slot(GeoReferent.ATTR_NAME, "ТРОИЦК", true) !== null) 
                            return true;
                    }
                }
            }
        }
        else if (lo.is_city) {
            if (!lot.includes("город") && !lot.includes("місто") && !lot.includes("city")) {
                if (hi.is_region) 
                    return true;
            }
            else {
                if (hi.is_state) 
                    return true;
                if ((hit.includes("административный округ") || hit.includes("адміністративний округ") || hit.includes("муниципальн")) || hit.includes("муніципаль")) 
                    return false;
                if (!hit.includes("район")) 
                    return true;
                if (hi.higher !== null && hi.higher.is_region) 
                    return true;
            }
        }
        else if (lo.is_region) {
            for (const s of hi.slots) {
                if (s.type_name === GeoReferent.ATTR_TYPE) {
                    if ((String(s.value)) !== "регион" && (String(s.value)) !== "регіон") {
                        if (lo.find_slot(s.type_name, s.value, true) !== null) 
                            return false;
                    }
                }
            }
            if (hit.includes("почтовое отделение")) 
                return false;
            if (lot.includes("почтовое отделение")) 
                return true;
            if (hi.is_state) 
                return true;
            if (lot.includes("волость")) 
                return true;
            if (lot.includes("county") || lot.includes("borough") || lot.includes("parish")) {
                if (hit.includes("state")) 
                    return true;
            }
            if (lot.includes("район")) {
                if ((hit.includes("область") || hit.includes("регион") || hit.includes("край")) || hit.includes("регіон")) 
                    return true;
                if (hit.includes("округ") && !hit.includes("сельский") && !hit.includes("поселковый")) 
                    return true;
            }
            if (lot.includes("область")) {
                if (hit.includes("край")) 
                    return true;
                if (hit.includes("округ") && !hit.includes("сельский") && !hit.includes("поселковый")) 
                    return true;
            }
            if (lot.includes("округ")) {
                if (lot.includes("сельский") || lot.includes("поселковый")) 
                    return true;
                if (hit.includes("край")) 
                    return true;
                if (lot.includes("округ")) {
                    if (hit.includes("область") || hit.includes("республика")) 
                        return true;
                }
            }
            if (lot.includes("муницип")) {
                if (hit.includes("область") || hit.includes("район") || hit.includes("округ")) 
                    return true;
            }
        }
        return false;
    }
}


module.exports = GeoOwnerHelper