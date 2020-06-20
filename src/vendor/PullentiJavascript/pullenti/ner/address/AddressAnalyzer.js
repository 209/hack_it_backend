/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const GetTextAttr = require("./../core/GetTextAttr");
const AddressDetailType = require("./AddressDetailType");
const Token = require("./../Token");
const AddressBuildingType = require("./AddressBuildingType");
const ReferentToken = require("./../ReferentToken");
const MetaToken = require("./../MetaToken");
const Referent = require("./../Referent");
const GeoOwnerHelper = require("./../geo/internal/GeoOwnerHelper");
const NumberToken = require("./../NumberToken");
const ProcessorService = require("./../ProcessorService");
const AddressHouseType = require("./AddressHouseType");
const StreetItemToken = require("./internal/StreetItemToken");
const StreetDefineHelper = require("./internal/StreetDefineHelper");
const Termin = require("./../core/Termin");
const MiscHelper = require("./../core/MiscHelper");
const GeoReferent = require("./../geo/GeoReferent");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const MetaStreet = require("./internal/MetaStreet");
const StreetReferent = require("./StreetReferent");
const AddressReferent = require("./AddressReferent");
const AnalyzerData = require("./../core/AnalyzerData");
const AddressItemTokenItemType = require("./internal/AddressItemTokenItemType");
const MetaAddress = require("./internal/MetaAddress");
const AddressItemToken = require("./internal/AddressItemToken");
const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");
const Analyzer = require("./../Analyzer");

/**
 * Анализатор адресов
 */
class AddressAnalyzer extends Analyzer {
    
    get name() {
        return AddressAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Адреса";
    }
    
    get description() {
        return "Адреса (улицы, дома ...)";
    }
    
    clone() {
        return new AddressAnalyzer();
    }
    
    get type_system() {
        return [MetaAddress.global_meta, MetaStreet.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaAddress.ADDRESS_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("address.png"));
        res.put(MetaStreet.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("street.png"));
        return res;
    }
    
    get progress_weight() {
        return 10;
    }
    
    create_referent(type) {
        if (type === AddressReferent.OBJ_TYPENAME) 
            return new AddressReferent();
        if (type === StreetReferent.OBJ_TYPENAME) 
            return new StreetReferent();
        return null;
    }
    
    get used_extern_object_types() {
        return [GeoReferent.OBJ_TYPENAME, "PHONE", "URI"];
    }
    
    create_analyzer_data() {
        return new AddressAnalyzer.AddressAnalyzerData();
    }
    
    process(kit) {
        let ad = Utils.as(kit.get_analyzer_data(this), AddressAnalyzer.AddressAnalyzerData);
        let steps = 1;
        let max = steps;
        let delta = 100000;
        let parts = Utils.intDiv(((kit.sofa.text.length + delta) - 1), delta);
        if (parts === 0) 
            parts = 1;
        max *= parts;
        let cur = 0;
        let next_pos = delta;
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (t.begin_char > next_pos) {
                next_pos += delta;
                cur++;
                if (!this.on_progress(cur, max, kit)) 
                    return;
            }
            let li = AddressItemToken.try_parse_list(t, ad.streets.local_ontology, 20);
            if (li === null) 
                continue;
            let addr = new AddressReferent();
            let streets = new Array();
            let i = 0;
            let j = 0;
            let metro = null;
            let det_typ = AddressDetailType.UNDEFINED;
            let det_param = 0;
            let geos = null;
            let err = false;
            let near_city = null;
            for (i = 0; i < li.length; i++) {
                if ((li[i].typ === AddressItemTokenItemType.DETAIL && li[i].detail_type === AddressDetailType.CROSS && ((i + 2) < li.length)) && li[i + 1].typ === AddressItemTokenItemType.STREET && li[i + 2].typ === AddressItemTokenItemType.STREET) {
                    det_typ = AddressDetailType.CROSS;
                    streets.push(li[i + 1]);
                    streets.push(li[i + 2]);
                    li[i + 1].end_token = li[i + 2].end_token;
                    li[i].tag = this;
                    li[i + 1].tag = this;
                    li.splice(i + 2, 1);
                    break;
                }
                else if (li[i].typ === AddressItemTokenItemType.STREET) {
                    if (((li[i].ref_token !== null && !li[i].ref_token_is_gsk)) && streets.length === 0) {
                        if (i > 0 && li[i].is_newline_before) 
                            err = true;
                        else if ((i + 1) === li.length) 
                            err = det_typ === AddressDetailType.UNDEFINED && det_param === 0 && near_city === null;
                        else if (((i + 1) < li.length) && li[i + 1].typ === AddressItemTokenItemType.NUMBER) 
                            err = true;
                        if (err && geos !== null) {
                            for (let ii = i - 1; ii >= 0; ii--) {
                                if (li[ii].typ === AddressItemTokenItemType.ZIP || li[ii].typ === AddressItemTokenItemType.PREFIX) 
                                    err = false;
                            }
                        }
                        if (err) 
                            break;
                    }
                    li[i].tag = this;
                    streets.push(li[i]);
                    if (((i + 1) < li.length) && li[i + 1].typ === AddressItemTokenItemType.STREET) {
                    }
                    else 
                        break;
                }
                else if (li[i].typ === AddressItemTokenItemType.CITY || li[i].typ === AddressItemTokenItemType.REGION) {
                    if (geos === null) 
                        geos = new Array();
                    geos.splice(0, 0, Utils.as(li[i].referent, GeoReferent));
                    if (li[i].detail_type !== AddressDetailType.UNDEFINED && det_typ === AddressDetailType.UNDEFINED) {
                        if (li[i].typ === AddressItemTokenItemType.CITY && li[i].detail_type === AddressDetailType.NEAR && li[i].detail_meters === 0) 
                            near_city = li[i];
                        else 
                            det_typ = li[i].detail_type;
                    }
                    if (li[i].detail_meters > 0 && det_param === 0) 
                        det_param = li[i].detail_meters;
                }
                else if (li[i].typ === AddressItemTokenItemType.DETAIL) {
                    if (li[i].detail_type !== AddressDetailType.UNDEFINED && det_typ === AddressDetailType.UNDEFINED) {
                        if (li[i].detail_type === AddressDetailType.NEAR && ((i + 1) < li.length) && li[i + 1].typ === AddressItemTokenItemType.CITY) {
                            near_city = li[i + 1];
                            li[i].tag = this;
                            i++;
                        }
                        else {
                            det_typ = li[i].detail_type;
                            if (li[i].detail_meters > 0) 
                                det_param = li[i].detail_meters;
                        }
                    }
                    li[i].tag = this;
                }
            }
            if (i >= li.length && metro === null && det_typ === AddressDetailType.UNDEFINED) {
                for (i = 0; i < li.length; i++) {
                    let cit = false;
                    if (li[i].typ === AddressItemTokenItemType.CITY) 
                        cit = true;
                    else if (li[i].typ === AddressItemTokenItemType.REGION) {
                        for (const s of li[i].referent.slots) {
                            if (s.type_name === GeoReferent.ATTR_TYPE) {
                                let ss = Utils.asString(s.value);
                                if (ss.includes("посел") || ss.includes("сельск") || ss.includes("почтовое отделение")) 
                                    cit = true;
                            }
                        }
                    }
                    if (cit) {
                        if (((i + 1) < li.length) && ((((li[i + 1].typ === AddressItemTokenItemType.HOUSE || li[i + 1].typ === AddressItemTokenItemType.BLOCK || li[i + 1].typ === AddressItemTokenItemType.PLOT) || li[i + 1].typ === AddressItemTokenItemType.BUILDING || li[i + 1].typ === AddressItemTokenItemType.CORPUS) || li[i + 1].typ === AddressItemTokenItemType.POSTOFFICEBOX || li[i + 1].typ === AddressItemTokenItemType.CSP))) 
                            break;
                        if (((i + 1) < li.length) && li[i + 1].typ === AddressItemTokenItemType.NUMBER) {
                            if (li[i].end_token.next.is_comma) {
                                if ((li[i].referent instanceof GeoReferent) && !(li[i].referent).is_big_city && (li[i].referent).is_city) {
                                    li[i + 1].typ = AddressItemTokenItemType.HOUSE;
                                    break;
                                }
                            }
                        }
                        if (li[0].typ === AddressItemTokenItemType.ZIP || li[0].typ === AddressItemTokenItemType.PREFIX) 
                            break;
                        continue;
                    }
                    if (li[i].typ === AddressItemTokenItemType.REGION) {
                        if ((li[i].referent instanceof GeoReferent) && (li[i].referent).higher !== null && (li[i].referent).higher.is_city) {
                            if (((i + 1) < li.length) && li[i + 1].typ === AddressItemTokenItemType.HOUSE) 
                                break;
                        }
                    }
                }
                if (i >= li.length) 
                    continue;
            }
            if (err) 
                continue;
            let i0 = i;
            if (i > 0 && li[i - 1].typ === AddressItemTokenItemType.HOUSE && li[i - 1].is_digit) {
                addr.add_slot(AddressReferent.ATTR_HOUSE, li[i - 1].value, false, 0).tag = li[i - 1];
                li[i - 1].tag = this;
            }
            else if ((i > 0 && li[i - 1].typ === AddressItemTokenItemType.KILOMETER && li[i - 1].is_digit) && (i < li.length) && li[i].is_street_road) {
                addr.add_slot(AddressReferent.ATTR_KILOMETER, li[i - 1].value, false, 0).tag = li[i - 1];
                li[i - 1].tag = this;
            }
            else {
                if (i >= li.length) 
                    i = -1;
                for (i = 0; i < li.length; i++) {
                    if (li[i].tag !== null) 
                        continue;
                    if (li[i].typ === AddressItemTokenItemType.HOUSE) {
                        if (addr.house !== null) 
                            break;
                        if (li[i].value !== null) {
                            addr.add_slot(AddressReferent.ATTR_HOUSE, li[i].value, false, 0).tag = li[i];
                            if (li[i].house_type !== AddressHouseType.UNDEFINED) 
                                addr.house_type = li[i].house_type;
                        }
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.KILOMETER && li[i].is_digit && (((i0 < li.length) && li[i0].is_street_road))) {
                        if (addr.kilometer !== null) 
                            break;
                        let s = addr.add_slot(AddressReferent.ATTR_KILOMETER, li[i].value, false, 0);
                        if (s !== null) 
                            s.tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.PLOT) {
                        if (addr.plot !== null) 
                            break;
                        let s = addr.add_slot(AddressReferent.ATTR_PLOT, li[i].value, false, 0);
                        if (s !== null) 
                            s.tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.BOX && li[i].is_digit) {
                        if (addr.box !== null) 
                            break;
                        let s = addr.add_slot(AddressReferent.ATTR_BOX, li[i].value, false, 0);
                        if (s !== null) 
                            s.tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.BLOCK && li[i].is_digit) {
                        if (addr.block !== null) 
                            break;
                        let s = addr.add_slot(AddressReferent.ATTR_BLOCK, li[i].value, false, 0);
                        if (s !== null) 
                            s.tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.CORPUS) {
                        if (addr.corpus !== null) 
                            break;
                        if (li[i].value !== null) {
                            let s = addr.add_slot(AddressReferent.ATTR_CORPUS, li[i].value, false, 0);
                            if (s !== null) 
                                s.tag = li[i];
                        }
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.BUILDING) {
                        if (addr.building !== null) 
                            break;
                        if (li[i].value !== null) {
                            let s = addr.add_slot(AddressReferent.ATTR_BUILDING, li[i].value, false, 0);
                            if (s !== null) 
                                s.tag = li[i];
                            if (li[i].building_type !== AddressBuildingType.UNDEFINED) 
                                addr.building_type = li[i].building_type;
                        }
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.FLOOR && li[i].is_digit) {
                        if (addr.floor !== null) 
                            break;
                        let s = addr.add_slot(AddressReferent.ATTR_FLOOR, li[i].value, false, 0);
                        if (s !== null) 
                            s.tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.POTCH && li[i].is_digit) {
                        if (addr.potch !== null) 
                            break;
                        let s = addr.add_slot(AddressReferent.ATTR_PORCH, li[i].value, false, 0);
                        if (s !== null) 
                            s.tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.FLAT) {
                        if (addr.flat !== null) 
                            break;
                        if (li[i].value !== null) 
                            addr.add_slot(AddressReferent.ATTR_FLAT, li[i].value, false, 0).tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.OFFICE && li[i].is_digit) {
                        if (addr.office !== null) 
                            break;
                        let s = addr.add_slot(AddressReferent.ATTR_OFFICE, li[i].value, false, 0);
                        if (s !== null) 
                            s.tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.CORPUSORFLAT && ((li[i].is_digit || li[i].value === null))) {
                        for (j = i + 1; j < li.length; j++) {
                            if (li[j].is_digit) {
                                if (((li[j].typ === AddressItemTokenItemType.FLAT || li[j].typ === AddressItemTokenItemType.CORPUSORFLAT || li[j].typ === AddressItemTokenItemType.OFFICE) || li[j].typ === AddressItemTokenItemType.FLOOR || li[j].typ === AddressItemTokenItemType.POTCH) || li[j].typ === AddressItemTokenItemType.POSTOFFICEBOX || li[j].typ === AddressItemTokenItemType.BUILDING) 
                                    break;
                            }
                        }
                        if (li[i].value !== null) {
                            if ((j < li.length) && addr.corpus === null) 
                                addr.add_slot(AddressReferent.ATTR_CORPUS, li[i].value, false, 0).tag = li[i];
                            else if (addr.corpus !== null) 
                                addr.add_slot(AddressReferent.ATTR_FLAT, li[i].value, false, 0).tag = li[i];
                            else 
                                addr.add_slot(AddressReferent.ATTR_CORPUSORFLAT, li[i].value, false, 0).tag = li[i];
                        }
                        li[i].tag = this;
                    }
                    else if ((!li[i].is_newline_before && li[i].typ === AddressItemTokenItemType.NUMBER && li[i].is_digit) && li[i - 1].typ === AddressItemTokenItemType.STREET) {
                        let v = 0;
                        let wrapv339 = new RefOutArgWrapper();
                        let inoutres340 = Utils.tryParseInt(li[i].value, wrapv339);
                        v = wrapv339.value;
                        if (!inoutres340) {
                            let wrapv333 = new RefOutArgWrapper();
                            let inoutres334 = Utils.tryParseInt(li[i].value.substring(0, 0 + li[i].value.length - 1), wrapv333);
                            v = wrapv333.value;
                            if (!inoutres334) {
                                if (!li[i].value.includes("/")) 
                                    break;
                            }
                        }
                        if (v > 400) 
                            break;
                        addr.add_slot(AddressReferent.ATTR_HOUSE, li[i].value, false, 0).tag = li[i];
                        li[i].tag = this;
                        if (((i + 1) < li.length) && ((li[i + 1].typ === AddressItemTokenItemType.NUMBER || li[i + 1].typ === AddressItemTokenItemType.FLAT)) && !li[i + 1].is_newline_before) {
                            let wrapv337 = new RefOutArgWrapper();
                            let inoutres338 = Utils.tryParseInt(li[i + 1].value, wrapv337);
                            v = wrapv337.value;
                            if (!inoutres338) 
                                break;
                            if (v > 500) 
                                break;
                            i++;
                            if ((((i + 1) < li.length) && li[i + 1].typ === AddressItemTokenItemType.NUMBER && !li[i + 1].is_newline_before) && (v < 5)) {
                                let wrapv335 = new RefOutArgWrapper();
                                let inoutres336 = Utils.tryParseInt(li[i + 1].value, wrapv335);
                                v = wrapv335.value;
                                if (inoutres336) {
                                    if (v < 500) {
                                        addr.add_slot(AddressReferent.ATTR_CORPUS, li[i].value, false, 0).tag = li[i];
                                        li[i].tag = this;
                                        i++;
                                    }
                                }
                            }
                            addr.add_slot(AddressReferent.ATTR_FLAT, li[i].value, false, 0).tag = li[i];
                            li[i].tag = this;
                        }
                    }
                    else if (li[i].typ === AddressItemTokenItemType.CITY) {
                        if (geos === null) 
                            geos = new Array();
                        if (li[i].is_newline_before) {
                            if (geos.length > 0) {
                                if ((i > 0 && li[i - 1].typ !== AddressItemTokenItemType.CITY && li[i - 1].typ !== AddressItemTokenItemType.REGION) && li[i - 1].typ !== AddressItemTokenItemType.ZIP && li[i - 1].typ !== AddressItemTokenItemType.PREFIX) 
                                    break;
                            }
                            if (((i + 1) < li.length) && li[i + 1].typ === AddressItemTokenItemType.STREET && i > i0) 
                                break;
                        }
                        if (li[i].detail_type === AddressDetailType.NEAR && li[i].detail_meters === 0) {
                            near_city = li[i];
                            li[i].tag = this;
                            continue;
                        }
                        let ii = 0;
                        for (ii = 0; ii < geos.length; ii++) {
                            if (geos[ii].is_city) 
                                break;
                        }
                        if (ii >= geos.length) 
                            geos.push(Utils.as(li[i].referent, GeoReferent));
                        else if (i > 0 && li[i].is_newline_before && i > i0) {
                            let jj = 0;
                            for (jj = 0; jj < i; jj++) {
                                if ((li[jj].typ !== AddressItemTokenItemType.PREFIX && li[jj].typ !== AddressItemTokenItemType.ZIP && li[jj].typ !== AddressItemTokenItemType.REGION) && li[jj].typ !== AddressItemTokenItemType.COUNTRY && li[jj].typ !== AddressItemTokenItemType.CITY) 
                                    break;
                            }
                            if (jj < i) 
                                break;
                        }
                        if (li[i].detail_type !== AddressDetailType.UNDEFINED && det_typ === AddressDetailType.UNDEFINED) {
                            det_typ = li[i].detail_type;
                            if (li[i].detail_meters > 0) 
                                det_param = li[i].detail_meters;
                        }
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.POSTOFFICEBOX) {
                        if (addr.post_office_box !== null) 
                            break;
                        addr.add_slot(AddressReferent.ATTR_POSTOFFICEBOX, li[i].value, false, 0).tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.CSP) {
                        if (addr.csp !== null) 
                            break;
                        addr.add_slot(AddressReferent.ATTR_CSP, li[i].value, false, 0).tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.STREET) {
                        if (streets.length > 1) 
                            break;
                        if (streets.length > 0) {
                            if (li[i].is_newline_before) 
                                break;
                            if (MiscHelper.can_be_start_of_sentence(li[i].begin_token)) 
                                break;
                        }
                        if (li[i].ref_token === null && i > 0 && li[i - 1].typ !== AddressItemTokenItemType.STREET) 
                            break;
                        streets.push(li[i]);
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.DETAIL) {
                        if ((i + 1) === li.length && li[i].detail_type === AddressDetailType.NEAR) 
                            break;
                        if (li[i].detail_type === AddressDetailType.NEAR && ((i + 1) < li.length) && li[i + 1].typ === AddressItemTokenItemType.CITY) {
                            near_city = li[i + 1];
                            li[i].tag = this;
                            i++;
                        }
                        else if (li[i].detail_type !== AddressDetailType.UNDEFINED && det_typ === AddressDetailType.UNDEFINED) {
                            det_typ = li[i].detail_type;
                            if (li[i].detail_meters > 0) 
                                det_param = li[i].detail_meters;
                        }
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.BUSINESSCENTER && li[i].ref_token !== null) {
                        addr.add_ext_referent(li[i].ref_token);
                        addr.add_slot(AddressReferent.ATTR_MISC, li[i].ref_token.referent, false, 0).tag = li[i];
                        li[i].tag = this;
                    }
                    else if (i > i0) 
                        break;
                }
            }
            let typs = new Array();
            for (const s of addr.slots) {
                if (!typs.includes(s.type_name)) 
                    typs.push(s.type_name);
            }
            if (streets.length === 1 && !streets[0].is_doubt && streets[0].ref_token === null) {
            }
            else if (li.length > 2 && li[0].typ === AddressItemTokenItemType.ZIP && ((li[1].typ === AddressItemTokenItemType.COUNTRY || li[1].typ === AddressItemTokenItemType.REGION))) {
            }
            else if ((typs.length + streets.length) < 2) {
                if (typs.length > 0) {
                    if ((((typs[0] !== AddressReferent.ATTR_STREET && typs[0] !== AddressReferent.ATTR_POSTOFFICEBOX && metro === null) && typs[0] !== AddressReferent.ATTR_HOUSE && typs[0] !== AddressReferent.ATTR_CORPUS) && typs[0] !== AddressReferent.ATTR_BUILDING && typs[0] !== AddressReferent.ATTR_PLOT) && typs[0] !== AddressReferent.ATTR_DETAIL && det_typ === AddressDetailType.UNDEFINED) 
                        continue;
                }
                else if (streets.length === 0 && det_typ === AddressDetailType.UNDEFINED) {
                    if (li[i - 1].typ === AddressItemTokenItemType.CITY && i > 2 && li[i - 2].typ === AddressItemTokenItemType.ZIP) {
                    }
                    else 
                        continue;
                }
                else if ((i === li.length && streets.length === 1 && (streets[0].referent instanceof StreetReferent)) && streets[0].referent.find_slot(StreetReferent.ATTR_TYP, "квартал", true) !== null) 
                    continue;
                if (geos === null) {
                    let has_geo = false;
                    for (let tt = li[0].begin_token.previous; tt !== null; tt = tt.previous) {
                        if (tt.morph.class0.is_preposition || tt.is_comma) 
                            continue;
                        let r = tt.get_referent();
                        if (r === null) 
                            break;
                        if (r.type_name === "DATE" || r.type_name === "DATERANGE") 
                            continue;
                        if (r instanceof GeoReferent) {
                            if (!(r).is_state) {
                                if (geos === null) 
                                    geos = new Array();
                                geos.push(Utils.as(r, GeoReferent));
                                has_geo = true;
                            }
                        }
                        break;
                    }
                    if (!has_geo) 
                        continue;
                }
            }
            for (i = 0; i < li.length; i++) {
                if (li[i].typ === AddressItemTokenItemType.PREFIX) 
                    li[i].tag = this;
                else if (li[i].tag === null) {
                    if (li[i].is_newline_before && i > i0) {
                        let stop = false;
                        for (j = i + 1; j < li.length; j++) {
                            if (li[j].typ === AddressItemTokenItemType.STREET) {
                                stop = true;
                                break;
                            }
                        }
                        if (stop) 
                            break;
                    }
                    if (li[i].typ === AddressItemTokenItemType.COUNTRY || li[i].typ === AddressItemTokenItemType.REGION || li[i].typ === AddressItemTokenItemType.CITY) {
                        if (geos === null) 
                            geos = new Array();
                        if (!geos.includes(Utils.as(li[i].referent, GeoReferent))) 
                            geos.push(Utils.as(li[i].referent, GeoReferent));
                        if (li[i].typ !== AddressItemTokenItemType.COUNTRY) {
                            if (li[i].detail_type !== AddressDetailType.UNDEFINED && addr.detail === AddressDetailType.UNDEFINED) {
                                addr.add_slot(AddressReferent.ATTR_DETAIL, li[i].detail_type.toString().toUpperCase(), false, 0).tag = li[i];
                                if (li[i].detail_meters > 0) 
                                    addr.add_slot(AddressReferent.ATTR_DETAILPARAM, (String(li[i].detail_meters) + "м"), false, 0);
                            }
                        }
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.ZIP) {
                        if (addr.zip !== null) 
                            break;
                        addr.add_slot(AddressReferent.ATTR_ZIP, li[i].value, false, 0).tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.POSTOFFICEBOX) {
                        if (addr.post_office_box !== null) 
                            break;
                        addr.add_slot(AddressReferent.ATTR_POSTOFFICEBOX, li[i].value, false, 0).tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.CSP) {
                        if (addr.csp !== null) 
                            break;
                        addr.add_slot(AddressReferent.ATTR_CSP, li[i].value, false, 0).tag = li[i];
                        li[i].tag = this;
                    }
                    else if (li[i].typ === AddressItemTokenItemType.NUMBER && li[i].is_digit && li[i].value.length === 6) {
                        if (((i + 1) < li.length) && li[i + 1].typ === AddressItemTokenItemType.CITY) {
                            if (addr.zip !== null) 
                                break;
                            addr.add_slot(AddressReferent.ATTR_ZIP, li[i].value, false, 0).tag = li[i];
                            li[i].tag = this;
                        }
                    }
                    else 
                        break;
                }
            }
            let t0 = null;
            let t1 = null;
            for (i = 0; i < li.length; i++) {
                if (li[i].tag !== null) {
                    t0 = li[i].begin_token;
                    break;
                }
            }
            for (i = li.length - 1; i >= 0; i--) {
                if (li[i].tag !== null) {
                    t1 = li[i].end_token;
                    break;
                }
            }
            if (t0 === null || t1 === null) 
                continue;
            if (addr.slots.length === 0) {
                let pure_streets = 0;
                let gsks = 0;
                for (const s of streets) {
                    if (s.ref_token !== null && s.ref_token_is_gsk) 
                        gsks++;
                    else if (s.ref_token === null) 
                        pure_streets++;
                }
                if ((pure_streets + gsks) === 0 && streets.length > 0) {
                    if (((det_typ !== AddressDetailType.UNDEFINED || near_city !== null)) && geos !== null) {
                    }
                    else 
                        addr = null;
                }
                else if (streets.length < 2) {
                    if ((streets.length === 1 && geos !== null && geos.length > 0) && ((streets[0].ref_token === null || streets[0].ref_token_is_gsk))) {
                    }
                    else if (det_typ !== AddressDetailType.UNDEFINED && geos !== null && streets.length === 0) {
                    }
                    else 
                        addr = null;
                }
            }
            if (addr !== null && det_typ !== AddressDetailType.UNDEFINED) {
                addr.detail = det_typ;
                if (det_param > 0) 
                    addr.add_slot(AddressReferent.ATTR_DETAILPARAM, (String(det_param) + "м"), false, 0);
            }
            if (geos === null && streets.length > 0 && !streets[0].is_street_road) {
                let cou = 0;
                for (let tt = t0.previous; tt !== null && (cou < 200); tt = tt.previous,cou++) {
                    if (tt.is_newline_after) 
                        cou += 10;
                    let r = tt.get_referent();
                    if ((r instanceof GeoReferent) && !(r).is_state) {
                        geos = new Array();
                        geos.push(Utils.as(r, GeoReferent));
                        break;
                    }
                    if (r instanceof StreetReferent) {
                        let ggg = (r).geos;
                        if (ggg.length > 0) {
                            geos = Array.from(ggg);
                            break;
                        }
                    }
                    if (r instanceof AddressReferent) {
                        let ggg = (r).geos;
                        if (ggg.length > 0) {
                            geos = Array.from(ggg);
                            break;
                        }
                    }
                }
            }
            let terr_ref = null;
            let ter_ref0 = null;
            let rt = null;
            let sr0 = null;
            for (let ii = 0; ii < streets.length; ii++) {
                let s = streets[ii];
                let sr = Utils.as(s.referent, StreetReferent);
                if ((sr === null && s.referent !== null && s.referent.type_name === "ORGANIZATION") && s.ref_token !== null) {
                    if (s.ref_token_is_gsk && addr === null) 
                        addr = new AddressReferent();
                    if (addr !== null) {
                        addr.add_referent(s.referent);
                        addr.add_ext_referent(s.ref_token);
                        ter_ref0 = s.ref_token;
                        if (geos === null || geos.length === 0) 
                            continue;
                        let jj = li.indexOf(s);
                        let geo0 = null;
                        if (jj > 0 && (li[jj - 1].referent instanceof GeoReferent) && ((li[jj - 1] !== near_city || (li[jj - 1].referent).higher !== null))) 
                            geo0 = Utils.as(li[jj - 1].referent, GeoReferent);
                        else if (jj > 1 && (li[jj - 2].referent instanceof GeoReferent)) 
                            geo0 = Utils.as(li[jj - 2].referent, GeoReferent);
                        else if (near_city !== null) 
                            geo0 = Utils.as(near_city.referent, GeoReferent);
                        if (geo0 !== null && ((geo0.is_region || geo0.is_city))) {
                            let geo = new GeoReferent();
                            geo.add_typ_ter(kit.base_language);
                            if (geo0.is_region) 
                                geo.add_typ((kit.base_language.is_ua ? "населений пункт" : "населенный пункт"));
                            geo.add_org_referent(s.referent);
                            if (near_city !== null && geo0 === near_city.referent) 
                                geo.higher = geo0.higher;
                            else 
                                geo.higher = geo0;
                            let sl = addr.find_slot(AddressReferent.ATTR_GEO, geo0, true);
                            if (sl !== null) 
                                Utils.removeItem(addr.slots, sl);
                            if ((((sl = addr.find_slot(AddressReferent.ATTR_STREET, s.referent, true)))) !== null) 
                                Utils.removeItem(addr.slots, sl);
                            Utils.removeItem(geos, geo0);
                            if (near_city !== null && geos.includes(Utils.as(near_city.referent, GeoReferent))) 
                                Utils.removeItem(geos, Utils.as(near_city.referent, GeoReferent));
                            geos.push(geo);
                            streets.splice(ii, 1);
                            let rtt = new ReferentToken(geo, s.ref_token.begin_token, s.ref_token.end_token);
                            rtt.data = kit.get_analyzer_data_by_analyzer_name("GEO");
                            if (near_city !== null && (near_city.referent instanceof GeoReferent)) {
                                geo.add_slot(GeoReferent.ATTR_REF, near_city.referent, false, 0);
                                if (near_city.end_char > rtt.end_char) 
                                    rtt.end_token = near_city.end_token;
                                if (near_city.begin_char < rtt.begin_char) 
                                    rtt.begin_token = near_city.begin_token;
                                if ((near_city.referent).higher === null && geo0 !== near_city.referent) 
                                    (near_city.referent).higher = geo0;
                            }
                            addr.add_ext_referent(rtt);
                            terr_ref = rtt;
                            ii--;
                            continue;
                        }
                        if ((geo0 !== null && geo0.is_territory && jj > 0) && li[jj - 1].referent === geo0) {
                            geo0.add_slot(GeoReferent.ATTR_REF, s.referent, false, 0);
                            geo0.add_ext_referent(s.ref_token);
                            let rtt = new ReferentToken(geo0, li[jj - 1].begin_token, s.ref_token.end_token);
                            rtt.data = kit.get_analyzer_data_by_analyzer_name("GEO");
                            addr.add_ext_referent(rtt);
                            terr_ref = rtt;
                            streets.splice(ii, 1);
                            ii--;
                            continue;
                        }
                        for (const gr of geos) {
                            if (s.referent.find_slot("GEO", gr, true) !== null) {
                                Utils.removeItem(geos, gr);
                                let sl = addr.find_slot(AddressReferent.ATTR_GEO, gr, true);
                                if (sl !== null) 
                                    Utils.removeItem(addr.slots, sl);
                                break;
                            }
                        }
                    }
                    continue;
                }
                if (sr !== null && terr_ref !== null) {
                    sr.add_slot(StreetReferent.ATTR_GEO, terr_ref.referent, false, 0);
                    sr.add_ext_referent(terr_ref);
                    if (geos !== null && geos.includes(Utils.as(terr_ref.referent, GeoReferent))) 
                        Utils.removeItem(geos, Utils.as(terr_ref.referent, GeoReferent));
                }
                if (geos !== null && sr !== null && sr.geos.length === 0) {
                    for (const gr of geos) {
                        if (gr.is_city || ((gr.higher !== null && gr.higher.is_city))) {
                            sr.add_slot(StreetReferent.ATTR_GEO, gr, false, 0);
                            if (li[0].referent === gr) 
                                streets[0].begin_token = li[0].begin_token;
                            for (let jj = ii + 1; jj < streets.length; jj++) {
                                if (streets[jj].referent instanceof StreetReferent) 
                                    streets[jj].referent.add_slot(StreetReferent.ATTR_GEO, gr, false, 0);
                            }
                            Utils.removeItem(geos, gr);
                            break;
                        }
                    }
                }
                if (sr !== null && sr.geos.length === 0) {
                    if (sr0 !== null) {
                        for (const g of sr0.geos) {
                            sr.add_slot(StreetReferent.ATTR_GEO, g, false, 0);
                        }
                    }
                    sr0 = sr;
                }
                if (s.referent !== null && s.referent.find_slot(StreetReferent.ATTR_NAME, "НЕТ", true) !== null) {
                    for (const ss of s.referent.slots) {
                        if (ss.type_name === StreetReferent.ATTR_GEO) 
                            addr.add_referent(Utils.as(ss.value, Referent));
                    }
                }
                else {
                    s.referent = ad.register_referent(s.referent);
                    if (addr !== null) 
                        addr.add_referent(s.referent);
                    t = (rt = new ReferentToken(s.referent, s.begin_token, s.end_token));
                    kit.embed_token(rt);
                    if (s.begin_token === t0) 
                        t0 = rt;
                    if (s.end_token === t1) 
                        t1 = rt;
                }
            }
            if (addr !== null) {
                let ok = false;
                for (const s of addr.slots) {
                    if (s.type_name !== AddressReferent.ATTR_DETAIL) 
                        ok = true;
                }
                if (!ok) 
                    addr = null;
            }
            if (addr === null) {
                if (terr_ref !== null) {
                    terr_ref.referent.add_ext_referent(ter_ref0);
                    terr_ref.referent = ad.register_referent(terr_ref.referent);
                    kit.embed_token(terr_ref);
                    t = terr_ref;
                    continue;
                }
                continue;
            }
            if (geos !== null) {
                if ((geos.length === 1 && geos[0].is_region && streets.length === 1) && streets[0].ref_token !== null) {
                }
                if (streets.length === 1 && streets[0].referent !== null) {
                    for (const s of streets[0].referent.slots) {
                        if (s.type_name === StreetReferent.ATTR_GEO && (s.value instanceof GeoReferent)) {
                            let k = 0;
                            for (let gg = Utils.as(s.value, GeoReferent); gg !== null && (k < 5); gg = Utils.as(gg.parent_referent, GeoReferent),k++) {
                                for (let ii = geos.length - 1; ii >= 0; ii--) {
                                    if (geos[ii] === gg) {
                                        geos.splice(ii, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                while (geos.length >= 2) {
                    if (geos[1].higher === null && GeoOwnerHelper.can_be_higher(geos[0], geos[1])) {
                        geos[1].higher = geos[0];
                        geos.splice(0, 1);
                    }
                    else if (geos[0].higher === null && GeoOwnerHelper.can_be_higher(geos[1], geos[0])) {
                        geos[0].higher = geos[1];
                        geos.splice(1, 1);
                    }
                    else if (geos[1].higher !== null && geos[1].higher.higher === null && GeoOwnerHelper.can_be_higher(geos[0], geos[1].higher)) {
                        geos[1].higher.higher = geos[0];
                        geos.splice(0, 1);
                    }
                    else if (geos[0].higher !== null && geos[0].higher.higher === null && GeoOwnerHelper.can_be_higher(geos[1], geos[0].higher)) {
                        geos[0].higher.higher = geos[1];
                        geos.splice(1, 1);
                    }
                    else 
                        break;
                }
                for (const g of geos) {
                    addr.add_referent(g);
                }
            }
            let ok1 = false;
            for (const s of addr.slots) {
                if (s.type_name !== AddressReferent.ATTR_STREET) {
                    ok1 = true;
                    break;
                }
            }
            if (!ok1) 
                continue;
            if (addr.house !== null && addr.corpus === null && addr.find_slot(AddressReferent.ATTR_STREET, null, true) === null) {
                if (geos !== null && geos.length > 0 && geos[0].find_slot(GeoReferent.ATTR_NAME, "ЗЕЛЕНОГРАД", true) !== null) {
                    addr.corpus = addr.house;
                    addr.house = null;
                }
            }
            rt = new ReferentToken(ad.register_referent(addr), t0, t1);
            kit.embed_token(rt);
            t = rt;
            if ((t.next !== null && ((t.next.is_comma || t.next.is_char(';'))) && (t.next.whitespaces_after_count < 2)) && (t.next.next instanceof NumberToken)) {
                let last = null;
                for (const ll of li) {
                    if (ll.tag !== null) 
                        last = ll;
                }
                let attr_name = null;
                if (last === null) 
                    continue;
                if (last.typ === AddressItemTokenItemType.HOUSE) 
                    attr_name = AddressReferent.ATTR_HOUSE;
                else if (last.typ === AddressItemTokenItemType.CORPUS) 
                    attr_name = AddressReferent.ATTR_CORPUS;
                else if (last.typ === AddressItemTokenItemType.BUILDING) 
                    attr_name = AddressReferent.ATTR_BUILDING;
                else if (last.typ === AddressItemTokenItemType.FLAT) 
                    attr_name = AddressReferent.ATTR_FLAT;
                else if (last.typ === AddressItemTokenItemType.PLOT) 
                    attr_name = AddressReferent.ATTR_PLOT;
                else if (last.typ === AddressItemTokenItemType.BOX) 
                    attr_name = AddressReferent.ATTR_BOX;
                else if (last.typ === AddressItemTokenItemType.POTCH) 
                    attr_name = AddressReferent.ATTR_PORCH;
                else if (last.typ === AddressItemTokenItemType.BLOCK) 
                    attr_name = AddressReferent.ATTR_BLOCK;
                else if (last.typ === AddressItemTokenItemType.OFFICE) 
                    attr_name = AddressReferent.ATTR_OFFICE;
                if (attr_name !== null) {
                    for (t = t.next.next; t !== null; t = t.next) {
                        if (!((t instanceof NumberToken))) 
                            break;
                        let addr1 = Utils.as(addr.clone(), AddressReferent);
                        addr1.occurrence.splice(0, addr1.occurrence.length);
                        addr1.add_slot(attr_name, (t).value.toString(), true, 0);
                        rt = new ReferentToken(ad.register_referent(addr1), t, t);
                        kit.embed_token(rt);
                        t = rt;
                        if ((t.next !== null && ((t.next.is_comma || t.next.is_char(';'))) && (t.next.whitespaces_after_count < 2)) && (t.next.next instanceof NumberToken)) {
                        }
                        else 
                            break;
                    }
                }
            }
        }
        let sli = new Array();
        for (let t = kit.first_token; t !== null; t = (t === null ? null : t.next)) {
            let sr = Utils.as(t.get_referent(), StreetReferent);
            if (sr === null) 
                continue;
            if (t.next === null || !t.next.is_comma_and) 
                continue;
            sli.splice(0, sli.length);
            sli.push(sr);
            for (t = t.next; t !== null; t = t.next) {
                if (t.is_comma_and) 
                    continue;
                if ((((sr = Utils.as(t.get_referent(), StreetReferent)))) !== null) {
                    sli.push(sr);
                    continue;
                }
                let adr = Utils.as(t.get_referent(), AddressReferent);
                if (adr === null) 
                    break;
                if (adr.streets.length === 0) 
                    break;
                for (const ss of adr.streets) {
                    if (ss instanceof StreetReferent) 
                        sli.push(Utils.as(ss, StreetReferent));
                }
            }
            if (sli.length < 2) 
                continue;
            let ok = true;
            let hi = null;
            for (const s of sli) {
                if (s.geos.length === 0) 
                    continue;
                else if (s.geos.length === 1) {
                    if (hi === null || hi === s.geos[0]) 
                        hi = s.geos[0];
                    else {
                        ok = false;
                        break;
                    }
                }
                else {
                    ok = false;
                    break;
                }
            }
            if (ok && hi !== null) {
                for (const s of sli) {
                    if (s.geos.length === 0) 
                        s.add_slot(StreetReferent.ATTR_GEO, hi, false, 0);
                }
            }
        }
        for (const a of ad.referents) {
            if (a instanceof AddressReferent) 
                (a).correct();
        }
    }
    
    process_ontology_item(begin) {
        let li = StreetItemToken.try_parse_list(begin, null, 10);
        if (li === null || (li.length < 2)) 
            return null;
        let rt = StreetDefineHelper.try_parse_street(li, true, false);
        if (rt === null) 
            return null;
        let street = Utils.as(rt.referent, StreetReferent);
        for (let t = rt.end_token.next; t !== null; t = t.next) {
            if (!t.is_char(';')) 
                continue;
            t = t.next;
            if (t === null) 
                break;
            li = StreetItemToken.try_parse_list(begin, null, 10);
            let rt1 = StreetDefineHelper.try_parse_street(li, true, false);
            if (rt1 !== null) {
                t = rt.end_token = rt1.end_token;
                street.merge_slots(rt1.referent, true);
            }
            else {
                let tt = null;
                for (let ttt = t; ttt !== null; ttt = ttt.next) {
                    if (ttt.is_char(';')) 
                        break;
                    else 
                        tt = ttt;
                }
                if (tt !== null) {
                    let str = MiscHelper.get_text_value(t, tt, GetTextAttr.NO);
                    if (str !== null) 
                        street.add_slot(StreetReferent.ATTR_NAME, MiscHelper.convert_first_char_upper_and_other_lower(str), false, 0);
                    t = rt.end_token = tt;
                }
            }
        }
        return new ReferentToken(street, rt.begin_token, rt.end_token);
    }
    
    static initialize() {
        if (AddressAnalyzer.m_initialized) 
            return;
        AddressAnalyzer.m_initialized = true;
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
        try {
            AddressItemToken.initialize();
        } catch (ex) {
            throw new Error(ex.message);
        }
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        ProcessorService.register_analyzer(new AddressAnalyzer());
    }
    
    static static_constructor() {
        AddressAnalyzer.ANALYZER_NAME = "ADDRESS";
        AddressAnalyzer.m_initialized = false;
    }
}


AddressAnalyzer.AddressAnalyzerData = class  extends AnalyzerData {
    
    constructor() {
        const AnalyzerData = require("./../core/AnalyzerData");
        const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");
        super();
        this.m_addresses = new AnalyzerData();
        this.streets = new AnalyzerDataWithOntology();
    }
    
    register_referent(referent) {
        const StreetReferent = require("./StreetReferent");
        if (referent instanceof StreetReferent) {
            (referent).correct();
            return this.streets.register_referent(referent);
        }
        else 
            return this.m_addresses.register_referent(referent);
    }
    
    get referents() {
        if (this.streets.referents.length === 0) 
            return this.m_addresses.referents;
        else if (this.m_addresses.referents.length === 0) 
            return this.streets.referents;
        let res = Array.from(this.streets.referents);
        res.splice(res.length, 0, ...this.m_addresses.referents);
        return res;
    }
}


AddressAnalyzer.static_constructor();

module.exports = AddressAnalyzer