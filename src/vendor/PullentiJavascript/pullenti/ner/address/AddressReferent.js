/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const GeoReferent = require("./../geo/GeoReferent");
const StreetReferent = require("./StreetReferent");
const ReferentEqualType = require("./../ReferentEqualType");
const GeoOwnerHelper = require("./../geo/internal/GeoOwnerHelper");
const AddressDetailType = require("./AddressDetailType");
const ReferentClass = require("./../ReferentClass");
const AddressBuildingType = require("./AddressBuildingType");
const AddressHouseType = require("./AddressHouseType");
const MetaAddress = require("./internal/MetaAddress");
const Referent = require("./../Referent");

/**
 * Сущность, представляющая адрес
 */
class AddressReferent extends Referent {
    
    constructor() {
        super(AddressReferent.OBJ_TYPENAME);
        this.instance_of = MetaAddress.global_meta;
    }
    
    /**
     * [Get] Улица (кстати, их может быть несколько)
     */
    get streets() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === AddressReferent.ATTR_STREET && (s.value instanceof Referent)) 
                res.push(Utils.as(s.value, Referent));
        }
        return res;
    }
    
    /**
     * [Get] Дом
     */
    get house() {
        return this.get_string_value(AddressReferent.ATTR_HOUSE);
    }
    /**
     * [Set] Дом
     */
    set house(value) {
        this.add_slot(AddressReferent.ATTR_HOUSE, value, true, 0);
        return value;
    }
    
    get house_type() {
        let str = this.get_string_value(AddressReferent.ATTR_HOUSETYPE);
        if (Utils.isNullOrEmpty(str)) 
            return AddressHouseType.HOUSE;
        try {
            return AddressHouseType.of(str);
        } catch (ex341) {
            return AddressHouseType.HOUSE;
        }
    }
    set house_type(value) {
        this.add_slot(AddressReferent.ATTR_HOUSETYPE, value.toString().toUpperCase(), true, 0);
        return value;
    }
    
    /**
     * [Get] Строение
     */
    get building() {
        return this.get_string_value(AddressReferent.ATTR_BUILDING);
    }
    /**
     * [Set] Строение
     */
    set building(value) {
        this.add_slot(AddressReferent.ATTR_BUILDING, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Тип строения
     */
    get building_type() {
        let str = this.get_string_value(AddressReferent.ATTR_BUILDINGTYPE);
        if (Utils.isNullOrEmpty(str)) 
            return AddressBuildingType.BUILDING;
        try {
            return AddressBuildingType.of(str);
        } catch (ex342) {
            return AddressBuildingType.BUILDING;
        }
    }
    /**
     * [Set] Тип строения
     */
    set building_type(value) {
        this.add_slot(AddressReferent.ATTR_BUILDINGTYPE, value.toString().toUpperCase(), true, 0);
        return value;
    }
    
    /**
     * [Get] Корпус
     */
    get corpus() {
        return this.get_string_value(AddressReferent.ATTR_CORPUS);
    }
    /**
     * [Set] Корпус
     */
    set corpus(value) {
        this.add_slot(AddressReferent.ATTR_CORPUS, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Корпус или квартира
     */
    get corpus_or_flat() {
        return this.get_string_value(AddressReferent.ATTR_CORPUSORFLAT);
    }
    /**
     * [Set] Корпус или квартира
     */
    set corpus_or_flat(value) {
        this.add_slot(AddressReferent.ATTR_CORPUSORFLAT, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Этаж
     */
    get floor() {
        return this.get_string_value(AddressReferent.ATTR_FLOOR);
    }
    /**
     * [Set] Этаж
     */
    set floor(value) {
        this.add_slot(AddressReferent.ATTR_FLOOR, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Подъезд
     */
    get potch() {
        return this.get_string_value(AddressReferent.ATTR_PORCH);
    }
    /**
     * [Set] Подъезд
     */
    set potch(value) {
        this.add_slot(AddressReferent.ATTR_PORCH, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Квартира
     */
    get flat() {
        return this.get_string_value(AddressReferent.ATTR_FLAT);
    }
    /**
     * [Set] Квартира
     */
    set flat(value) {
        this.add_slot(AddressReferent.ATTR_FLAT, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Номер офиса
     */
    get office() {
        return this.get_string_value(AddressReferent.ATTR_OFFICE);
    }
    /**
     * [Set] Номер офиса
     */
    set office(value) {
        this.add_slot(AddressReferent.ATTR_OFFICE, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Номер участка
     */
    get plot() {
        return this.get_string_value(AddressReferent.ATTR_PLOT);
    }
    /**
     * [Set] Номер участка
     */
    set plot(value) {
        this.add_slot(AddressReferent.ATTR_PLOT, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Блок (ряд)
     */
    get block() {
        return this.get_string_value(AddressReferent.ATTR_BLOCK);
    }
    /**
     * [Set] Блок (ряд)
     */
    set block(value) {
        this.add_slot(AddressReferent.ATTR_BLOCK, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Бокс (гараж)
     */
    get box() {
        return this.get_string_value(AddressReferent.ATTR_BOX);
    }
    /**
     * [Set] Бокс (гараж)
     */
    set box(value) {
        this.add_slot(AddressReferent.ATTR_BOX, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Станция метро
     */
    get metro() {
        return this.get_string_value(AddressReferent.ATTR_METRO);
    }
    /**
     * [Set] Станция метро
     */
    set metro(value) {
        this.add_slot(AddressReferent.ATTR_METRO, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Километр
     */
    get kilometer() {
        return this.get_string_value(AddressReferent.ATTR_KILOMETER);
    }
    /**
     * [Set] Километр
     */
    set kilometer(value) {
        this.add_slot(AddressReferent.ATTR_KILOMETER, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Почтовый индекс
     */
    get zip() {
        return this.get_string_value(AddressReferent.ATTR_ZIP);
    }
    /**
     * [Set] Почтовый индекс
     */
    set zip(value) {
        this.add_slot(AddressReferent.ATTR_ZIP, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Почтовый ящик
     */
    get post_office_box() {
        return this.get_string_value(AddressReferent.ATTR_POSTOFFICEBOX);
    }
    /**
     * [Set] Почтовый ящик
     */
    set post_office_box(value) {
        this.add_slot(AddressReferent.ATTR_POSTOFFICEBOX, value, true, 0);
        return value;
    }
    
    /**
     * [Get] ГСП (абонент городской служебной почты)
     */
    get csp() {
        return this.get_string_value(AddressReferent.ATTR_CSP);
    }
    /**
     * [Set] ГСП (абонент городской служебной почты)
     */
    set csp(value) {
        this.add_slot(AddressReferent.ATTR_CSP, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Ссылки на географические объекты (самого нижнего уровня)
     */
    get geos() {
        let res = new Array();
        for (const a of this.slots) {
            if (a.type_name === AddressReferent.ATTR_GEO && (a.value instanceof GeoReferent)) 
                res.push(Utils.as(a.value, GeoReferent));
            else if (a.type_name === AddressReferent.ATTR_STREET && (a.value instanceof Referent)) {
                for (const s of (a.value).slots) {
                    if (s.value instanceof GeoReferent) 
                        res.push(Utils.as(s.value, GeoReferent));
                }
            }
        }
        for (let i = res.length - 1; i > 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                if (AddressReferent._is_higher(res[i], res[j])) {
                    res.splice(i, 1);
                    break;
                }
                else if (AddressReferent._is_higher(res[j], res[i])) {
                    res.splice(j, 1);
                    i--;
                }
            }
        }
        return res;
    }
    
    static _is_higher(ghi, glo) {
        let i = 0;
        for (; glo !== null && (i < 10); glo = glo.higher,i++) {
            if (glo.can_be_equals(ghi, ReferentEqualType.WITHINONETEXT)) 
                return true;
        }
        return false;
    }
    
    get parent_referent() {
        let sr = Utils.as(this.get_slot_value(AddressReferent.ATTR_STREET), Referent);
        if (sr !== null) 
            return sr;
        let _geos = this.geos;
        for (const g of _geos) {
            if (g.is_city) 
                return g;
        }
        for (const g of _geos) {
            if (g.is_region && !g.is_state) 
                return g;
        }
        if (_geos.length > 0) 
            return _geos[0];
        return null;
    }
    
    add_referent(r) {
        if (r === null) 
            return;
        let geo = Utils.as(r, GeoReferent);
        if (geo !== null) {
            for (const s of this.slots) {
                if (s.type_name === AddressReferent.ATTR_GEO) {
                    let geo0 = Utils.as(s.value, GeoReferent);
                    if (geo0 === null) 
                        continue;
                    if (GeoOwnerHelper.can_be_higher(geo0, geo)) {
                        if (geo.higher === geo0 || geo.is_city) {
                            this.upload_slot(s, geo);
                            return;
                        }
                    }
                    if (GeoOwnerHelper.can_be_higher(geo, geo0)) 
                        return;
                }
            }
            this.add_slot(AddressReferent.ATTR_GEO, r, false, 0);
        }
        else if (((r instanceof StreetReferent)) || r.type_name === "ORGANIZATION") 
            this.add_slot(AddressReferent.ATTR_STREET, r, false, 0);
    }
    
    /**
     * [Get] ополнительная детализация места (пересечение, около ...)
     */
    get detail() {
        let s = this.get_string_value(AddressReferent.ATTR_DETAIL);
        if (s === null) 
            return AddressDetailType.UNDEFINED;
        try {
            let res = AddressDetailType.of(s);
            if (res instanceof AddressDetailType) 
                return AddressDetailType.of(res);
        } catch (ex343) {
        }
        return AddressDetailType.UNDEFINED;
    }
    /**
     * [Set] ополнительная детализация места (пересечение, около ...)
     */
    set detail(value) {
        if (value !== AddressDetailType.UNDEFINED) 
            this.add_slot(AddressReferent.ATTR_DETAIL, value.toString().toUpperCase(), true, 0);
        return value;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        let str = this.get_string_value(AddressReferent.ATTR_DETAIL);
        if (str !== null) 
            str = Utils.asString(MetaAddress.global_meta.detail_feature.convert_inner_value_to_outer_value(str, lang));
        if (str !== null) {
            res.append("[").append(str.toLowerCase());
            if ((((str = this.get_string_value(AddressReferent.ATTR_DETAILPARAM)))) !== null) 
                res.append(", ").append(str);
            res.append(']');
        }
        let strs = this.streets;
        if (strs.length === 0) {
            if (this.metro !== null) {
                if (res.length > 0) 
                    res.append(' ');
                res.append(Utils.notNull(this.metro, ""));
            }
        }
        else {
            if (res.length > 0) 
                res.append(' ');
            for (let i = 0; i < strs.length; i++) {
                if (i > 0) 
                    res.append(", ");
                res.append(strs[i].to_string(true, lang, 0));
            }
        }
        if (this.kilometer !== null) 
            res.append(" ").append(this.kilometer).append("км.");
        if (this.house !== null) {
            let ty = this.house_type;
            if (ty === AddressHouseType.ESTATE) 
                res.append(" влад.");
            else if (ty === AddressHouseType.HOUSEESTATE) 
                res.append(" домовл.");
            else 
                res.append(" д.");
            res.append((this.house === "0" ? "Б/Н" : this.house));
        }
        if (this.corpus !== null) 
            res.append(" корп.").append((this.corpus === "0" ? "Б/Н" : this.corpus));
        if (this.building !== null) {
            let ty = this.building_type;
            if (ty === AddressBuildingType.CONSTRUCTION) 
                res.append(" сооруж.");
            else if (ty === AddressBuildingType.LITER) 
                res.append(" лит.");
            else 
                res.append(" стр.");
            res.append((this.building === "0" ? "Б/Н" : this.building));
        }
        if (this.potch !== null) 
            res.append(" под.").append(this.potch);
        if (this.floor !== null) 
            res.append(" эт.").append(this.floor);
        if (this.flat !== null) 
            res.append(" кв.").append(this.flat);
        if (this.corpus_or_flat !== null) 
            res.append(" корп.(кв.?)").append(this.corpus_or_flat);
        if (this.office !== null) 
            res.append(" оф.").append(this.office);
        if (this.block !== null) 
            res.append(" блок ").append(this.block);
        if (this.plot !== null) 
            res.append(" уч.").append(this.plot);
        if (this.box !== null) 
            res.append(" бокс ").append(this.box);
        if (this.post_office_box !== null) 
            res.append(" а\\я").append(this.post_office_box);
        if (this.csp !== null) 
            res.append(" ГСП-").append(this.csp);
        let kladr = this.get_slot_value(AddressReferent.ATTR_FIAS);
        if (kladr instanceof Referent) {
            res.append(" (ФИАС: ").append((Utils.notNull((kladr).get_string_value("GUID"), "?")));
            for (const s of this.slots) {
                if (s.type_name === AddressReferent.ATTR_FIAS && (s.value instanceof Referent) && s.value !== kladr) 
                    res.append(", ").append((Utils.notNull((s.value).get_string_value("GUID"), "?")));
            }
            res.append(')');
        }
        let bti = this.get_string_value(AddressReferent.ATTR_BTI);
        if (bti !== null) 
            res.append(" (БТИ ").append(bti).append(")");
        for (const g of this.geos) {
            if (res.length > 0 && res.charAt(res.length - 1) === ' ') 
                res.length = res.length - 1;
            if (res.length > 0 && res.charAt(res.length - 1) === ']') {
            }
            else if (res.length > 0) 
                res.append(';');
            res.append(" ").append(g.to_string(true, lang, lev + 1));
        }
        if (this.zip !== null) 
            res.append("; ").append(this.zip);
        return res.toString().trim();
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        let addr = Utils.as(obj, AddressReferent);
        if (addr === null) 
            return false;
        let strs1 = this.streets;
        let strs2 = addr.streets;
        if (strs1.length > 0 || strs2.length > 0) {
            let ok = false;
            for (const s of strs1) {
                for (const ss of strs2) {
                    if (ss.can_be_equals(s, typ)) {
                        ok = true;
                        break;
                    }
                }
            }
            if (!ok) 
                return false;
        }
        if (addr.house !== null || this.house !== null) {
            if (addr.house !== this.house) 
                return false;
        }
        if (addr.building !== null || this.building !== null) {
            if (addr.building !== this.building) 
                return false;
        }
        if (addr.plot !== null || this.plot !== null) {
            if (addr.plot !== this.plot) 
                return false;
        }
        if (addr.box !== null || this.box !== null) {
            if (addr.box !== this.box) 
                return false;
        }
        if (addr.block !== null || this.block !== null) {
            if (addr.block !== this.block) 
                return false;
        }
        if (addr.corpus !== null || this.corpus !== null) {
            if (addr.corpus !== this.corpus) {
                if (addr.corpus !== null && addr.corpus === this.corpus_or_flat) {
                }
                else if (this.corpus !== null && addr.corpus_or_flat === this.corpus) {
                }
                else 
                    return false;
            }
        }
        if (addr.flat !== null || this.flat !== null) {
            if (addr.flat !== this.flat) {
                if (addr.flat !== null && addr.flat === this.corpus_or_flat) {
                }
                else if (this.flat !== null && addr.corpus_or_flat === this.flat) {
                }
                else 
                    return false;
            }
        }
        if (addr.corpus_or_flat !== null || this.corpus_or_flat !== null) {
            if (this.corpus_or_flat !== null && addr.corpus_or_flat !== null) {
                if (this.corpus_or_flat !== addr.corpus_or_flat) 
                    return false;
            }
            else if (this.corpus_or_flat === null) {
                if (this.corpus === null && this.flat === null) 
                    return false;
            }
            else if (addr.corpus_or_flat === null) {
                if (addr.corpus === null && addr.flat === null) 
                    return false;
            }
        }
        if (addr.office !== null || this.office !== null) {
            if (addr.office !== this.office) 
                return false;
        }
        if (addr.potch !== null || this.potch !== null) {
            if (addr.potch !== this.potch) 
                return false;
        }
        if (addr.floor !== null || this.floor !== null) {
            if (addr.floor !== this.floor) 
                return false;
        }
        if (addr.post_office_box !== null || this.post_office_box !== null) {
            if (addr.post_office_box !== this.post_office_box) 
                return false;
        }
        if (addr.csp !== null && this.csp !== null) {
            if (addr.csp !== this.csp) 
                return false;
        }
        let geos1 = this.geos;
        let geos2 = addr.geos;
        if (geos1.length > 0 && geos2.length > 0) {
            let ok = false;
            for (const g1 of geos1) {
                for (const g2 of geos2) {
                    if (g1.can_be_equals(g2, typ)) {
                        ok = true;
                        break;
                    }
                }
            }
            if (!ok) 
                return false;
        }
        return true;
    }
    
    merge_slots(obj, merge_statistic = true) {
        super.merge_slots(obj, merge_statistic);
        if (this.corpus_or_flat !== null) {
            if (this.flat === this.corpus_or_flat) 
                this.corpus_or_flat = null;
            else if (this.corpus === this.corpus_or_flat) 
                this.corpus_or_flat = null;
        }
        this.correct();
    }
    
    correct() {
        let _geos = new Array();
        for (const a of this.slots) {
            if (a.type_name === AddressReferent.ATTR_GEO && (a.value instanceof GeoReferent)) 
                _geos.push(Utils.as(a.value, GeoReferent));
            else if (a.type_name === AddressReferent.ATTR_STREET && (a.value instanceof Referent)) {
                for (const s of (a.value).slots) {
                    if (s.value instanceof GeoReferent) 
                        _geos.push(Utils.as(s.value, GeoReferent));
                }
            }
        }
        for (let i = _geos.length - 1; i > 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                if (AddressReferent._is_higher(_geos[i], _geos[j])) {
                    let s = this.find_slot(AddressReferent.ATTR_GEO, _geos[i], true);
                    if (s !== null) 
                        Utils.removeItem(this.slots, s);
                    _geos.splice(i, 1);
                    break;
                }
                else if (AddressReferent._is_higher(_geos[j], _geos[i])) {
                    let s = this.find_slot(AddressReferent.ATTR_GEO, _geos[j], true);
                    if (s !== null) 
                        Utils.removeItem(this.slots, s);
                    _geos.splice(j, 1);
                    i--;
                }
            }
        }
        if (_geos.length === 2) {
            let reg = null;
            let cit = null;
            for (let ii = 0; ii < _geos.length; ii++) {
                if (_geos[ii].is_territory && _geos[ii].higher !== null) 
                    _geos[ii] = _geos[ii].higher;
            }
            if (_geos[0].is_city && _geos[1].is_region) {
                cit = _geos[0];
                reg = _geos[1];
            }
            else if (_geos[1].is_city && _geos[0].is_region) {
                cit = _geos[1];
                reg = _geos[0];
            }
            if (cit !== null && cit.higher === null && GeoOwnerHelper.can_be_higher(reg, cit)) {
                cit.higher = reg;
                let ss = this.find_slot(AddressReferent.ATTR_GEO, reg, true);
                if (ss !== null) 
                    Utils.removeItem(this.slots, ss);
                _geos = this.geos;
            }
            else {
                let stat = null;
                let geo = null;
                if (_geos[0].is_state && !_geos[1].is_state) {
                    stat = _geos[0];
                    geo = _geos[1];
                }
                else if (_geos[1].is_state && !_geos[0].is_state) {
                    stat = _geos[1];
                    geo = _geos[0];
                }
                if (stat !== null) {
                    geo = geo.top_higher;
                    if (geo.higher === null) {
                        geo.higher = stat;
                        let s = this.find_slot(AddressReferent.ATTR_GEO, stat, true);
                        if (s !== null) 
                            Utils.removeItem(this.slots, s);
                    }
                }
            }
        }
    }
    
    static static_constructor() {
        AddressReferent.OBJ_TYPENAME = "ADDRESS";
        AddressReferent.ATTR_STREET = "STREET";
        AddressReferent.ATTR_HOUSE = "HOUSE";
        AddressReferent.ATTR_HOUSETYPE = "HOUSETYPE";
        AddressReferent.ATTR_CORPUS = "CORPUS";
        AddressReferent.ATTR_BUILDING = "BUILDING";
        AddressReferent.ATTR_BUILDINGTYPE = "BUILDINGTYPE";
        AddressReferent.ATTR_CORPUSORFLAT = "CORPUSORFLAT";
        AddressReferent.ATTR_PORCH = "PORCH";
        AddressReferent.ATTR_FLOOR = "FLOOR";
        AddressReferent.ATTR_OFFICE = "OFFICE";
        AddressReferent.ATTR_FLAT = "FLAT";
        AddressReferent.ATTR_KILOMETER = "KILOMETER";
        AddressReferent.ATTR_PLOT = "PLOT";
        AddressReferent.ATTR_BLOCK = "BLOCK";
        AddressReferent.ATTR_BOX = "BOX";
        AddressReferent.ATTR_GEO = "GEO";
        AddressReferent.ATTR_ZIP = "ZIP";
        AddressReferent.ATTR_POSTOFFICEBOX = "POSTOFFICEBOX";
        AddressReferent.ATTR_CSP = "CSP";
        AddressReferent.ATTR_METRO = "METRO";
        AddressReferent.ATTR_DETAIL = "DETAIL";
        AddressReferent.ATTR_DETAILPARAM = "DETAILPARAM";
        AddressReferent.ATTR_MISC = "MISC";
        AddressReferent.ATTR_FIAS = "FIAS";
        AddressReferent.ATTR_BTI = "BTI";
    }
}


AddressReferent.static_constructor();

module.exports = AddressReferent