/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const Referent = require("./../Referent");
const LanguageHelper = require("./../../morph/LanguageHelper");
const ReferentEqualType = require("./../ReferentEqualType");
const ReferentToken = require("./../ReferentToken");
const ReferentClass = require("./../ReferentClass");
const MetaTransport = require("./internal/MetaTransport");
const MiscHelper = require("./../core/MiscHelper");
const TransportKind = require("./TransportKind");
const GeoReferent = require("./../geo/GeoReferent");

/**
 * Транспортное средство
 */
class TransportReferent extends Referent {
    
    constructor() {
        super(TransportReferent.OBJ_TYPENAME);
        this.instance_of = MetaTransport.global_meta;
    }
    
    to_string(short_variant, lang, lev = 0) {
        let res = new StringBuilder();
        let str = null;
        for (const s of this.slots) {
            if (s.type_name === TransportReferent.ATTR_TYPE) {
                let n = String(s.value);
                if (str === null || (n.length < str.length)) 
                    str = n;
            }
        }
        if (str !== null) 
            res.append(str);
        else if (this.kind === TransportKind.AUTO) 
            res.append("автомобиль");
        else if (this.kind === TransportKind.FLY) 
            res.append("самолет");
        else if (this.kind === TransportKind.SHIP) 
            res.append("судно");
        else if (this.kind === TransportKind.SPACE) 
            res.append("космический корабль");
        else 
            res.append(this.kind.toString());
        if ((((str = this.get_string_value(TransportReferent.ATTR_BRAND)))) !== null) 
            res.append(" ").append(MiscHelper.convert_first_char_upper_and_other_lower(str));
        if ((((str = this.get_string_value(TransportReferent.ATTR_MODEL)))) !== null) 
            res.append(" ").append(MiscHelper.convert_first_char_upper_and_other_lower(str));
        if ((((str = this.get_string_value(TransportReferent.ATTR_NAME)))) !== null) {
            res.append(" \"").append(MiscHelper.convert_first_char_upper_and_other_lower(str)).append("\"");
            for (const s of this.slots) {
                if (s.type_name === TransportReferent.ATTR_NAME && str !== (String(s.value))) {
                    if (LanguageHelper.is_cyrillic_char(str[0]) !== LanguageHelper.is_cyrillic_char((String(s.value))[0])) {
                        res.append(" (").append(MiscHelper.convert_first_char_upper_and_other_lower(String(s.value))).append(")");
                        break;
                    }
                }
            }
        }
        if ((((str = this.get_string_value(TransportReferent.ATTR_CLASS)))) !== null) 
            res.append(" класса \"").append(MiscHelper.convert_first_char_upper_and_other_lower(str)).append("\"");
        if ((((str = this.get_string_value(TransportReferent.ATTR_NUMBER)))) !== null) {
            res.append(", номер ").append(str);
            if ((((str = this.get_string_value(TransportReferent.ATTR_NUMBER_REGION)))) !== null) 
                res.append(str);
        }
        if (this.find_slot(TransportReferent.ATTR_ROUTEPOINT, null, true) !== null) {
            res.append(" (");
            let fi = true;
            for (const s of this.slots) {
                if (s.type_name === TransportReferent.ATTR_ROUTEPOINT) {
                    if (fi) 
                        fi = false;
                    else 
                        res.append(" - ");
                    if (s.value instanceof Referent) 
                        res.append((s.value).to_string(true, lang, 0));
                    else 
                        res.append(s.value);
                }
            }
            res.append(")");
        }
        if (!short_variant) {
            if ((((str = this.get_string_value(TransportReferent.ATTR_GEO)))) !== null) 
                res.append("; ").append(str);
            if ((((str = this.get_string_value(TransportReferent.ATTR_ORG)))) !== null) 
                res.append("; ").append(str);
        }
        return res.toString();
    }
    
    /**
     * [Get] Класс сущности (авто, авиа, аква ...)
     */
    get kind() {
        return this._get_kind(this.get_string_value(TransportReferent.ATTR_KIND));
    }
    /**
     * [Set] Класс сущности (авто, авиа, аква ...)
     */
    set kind(value) {
        if (value !== TransportKind.UNDEFINED) 
            this.add_slot(TransportReferent.ATTR_KIND, value.toString(), true, 0);
        return value;
    }
    
    _get_kind(s) {
        if (s === null) 
            return TransportKind.UNDEFINED;
        try {
            let res = TransportKind.of(s);
            if (res instanceof TransportKind) 
                return TransportKind.of(res);
        } catch (ex2698) {
        }
        return TransportKind.UNDEFINED;
    }
    
    add_geo(r) {
        if (r instanceof GeoReferent) 
            this.add_slot(TransportReferent.ATTR_GEO, r, false, 0);
        else if (r instanceof ReferentToken) {
            if ((r).get_referent() instanceof GeoReferent) {
                this.add_slot(TransportReferent.ATTR_GEO, (r).get_referent(), false, 0);
                this.add_ext_referent(Utils.as(r, ReferentToken));
            }
        }
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        let tr = Utils.as(obj, TransportReferent);
        if (tr === null) 
            return false;
        let k1 = this.kind;
        let k2 = tr.kind;
        if (k1 !== k2) {
            if (k1 === TransportKind.SPACE && tr.find_slot(TransportReferent.ATTR_TYPE, "КОРАБЛЬ", true) !== null) {
            }
            else if (k2 === TransportKind.SPACE && this.find_slot(TransportReferent.ATTR_TYPE, "КОРАБЛЬ", true) !== null) 
                k1 = TransportKind.SPACE;
            else 
                return false;
        }
        let sl = this.find_slot(TransportReferent.ATTR_ORG, null, true);
        if (sl !== null && tr.find_slot(TransportReferent.ATTR_ORG, null, true) !== null) {
            if (tr.find_slot(TransportReferent.ATTR_ORG, sl.value, false) === null) 
                return false;
        }
        sl = this.find_slot(TransportReferent.ATTR_GEO, null, true);
        if (sl !== null && tr.find_slot(TransportReferent.ATTR_GEO, null, true) !== null) {
            if (tr.find_slot(TransportReferent.ATTR_GEO, sl.value, true) === null) 
                return false;
        }
        let s1 = this.get_string_value(TransportReferent.ATTR_NUMBER);
        let s2 = tr.get_string_value(TransportReferent.ATTR_NUMBER);
        if (s1 !== null || s2 !== null) {
            if (s1 === null || s2 === null) {
                if (typ === ReferentEqualType.DIFFERENTTEXTS) 
                    return false;
            }
            else {
                if (s1 !== s2) 
                    return false;
                s1 = this.get_string_value(TransportReferent.ATTR_NUMBER_REGION);
                s2 = tr.get_string_value(TransportReferent.ATTR_NUMBER_REGION);
                if (s1 !== null || s2 !== null) {
                    if (s1 === null || s2 === null) {
                        if (typ === ReferentEqualType.DIFFERENTTEXTS) 
                            return false;
                    }
                    else if (s1 !== s2) 
                        return false;
                }
            }
        }
        s1 = this.get_string_value(TransportReferent.ATTR_BRAND);
        s2 = tr.get_string_value(TransportReferent.ATTR_BRAND);
        if (s1 !== null || s2 !== null) {
            if (s1 === null || s2 === null) {
                if (typ === ReferentEqualType.DIFFERENTTEXTS) 
                    return false;
            }
            else if (s1 !== s2) 
                return false;
        }
        s1 = this.get_string_value(TransportReferent.ATTR_MODEL);
        s2 = tr.get_string_value(TransportReferent.ATTR_MODEL);
        if (s1 !== null || s2 !== null) {
            if (s1 === null || s2 === null) {
                if (typ === ReferentEqualType.DIFFERENTTEXTS) 
                    return false;
            }
            else if (s1 !== s2) 
                return false;
        }
        for (const s of this.slots) {
            if (s.type_name === TransportReferent.ATTR_NAME) {
                if (tr.find_slot(TransportReferent.ATTR_NAME, s.value, true) !== null) 
                    return true;
            }
        }
        if (s1 !== null && s2 !== null) 
            return true;
        return false;
    }
    
    merge_slots(obj, merge_statistic = true) {
        super.merge_slots(obj, merge_statistic);
        let kinds = new Array();
        for (const s of this.slots) {
            if (s.type_name === TransportReferent.ATTR_KIND) {
                let ki = this._get_kind(String(s.value));
                if (!kinds.includes(ki)) 
                    kinds.push(ki);
            }
        }
        if (kinds.length > 0) {
            if (kinds.includes(TransportKind.SPACE)) {
                for (let i = this.slots.length - 1; i >= 0; i--) {
                    if (this.slots[i].type_name === TransportReferent.ATTR_KIND && this._get_kind(String(this.slots[i].value)) !== TransportKind.SPACE) 
                        this.slots.splice(i, 1);
                }
            }
        }
    }
    
    check(on_attach, brandisdoubt) {
        let ki = this.kind;
        if (ki === TransportKind.UNDEFINED) 
            return false;
        if (this.find_slot(TransportReferent.ATTR_NUMBER, null, true) !== null) {
            if (this.find_slot(TransportReferent.ATTR_NUMBER_REGION, null, true) === null && (this.slots.length < 3)) 
                return false;
            return true;
        }
        let model = this.get_string_value(TransportReferent.ATTR_MODEL);
        let has_num = false;
        if (model !== null) {
            for (const s of model) {
                if (!Utils.isLetter(s)) {
                    has_num = true;
                    break;
                }
            }
        }
        if (ki === TransportKind.AUTO) {
            if (this.find_slot(TransportReferent.ATTR_BRAND, null, true) !== null) {
                if (on_attach) 
                    return true;
                if (!has_num && this.find_slot(TransportReferent.ATTR_TYPE, null, true) === null) 
                    return false;
                if (brandisdoubt && model === null && !has_num) 
                    return false;
                return true;
            }
            if (model !== null && on_attach) 
                return true;
            return false;
        }
        if (model !== null) {
            if (!has_num && ki === TransportKind.FLY && this.find_slot(TransportReferent.ATTR_BRAND, null, true) === null) 
                return false;
            return true;
        }
        if (this.find_slot(TransportReferent.ATTR_NAME, null, true) !== null) {
            let nam = this.get_string_value(TransportReferent.ATTR_NAME);
            if (ki === TransportKind.FLY && nam.startsWith("Аэрофлот")) 
                return false;
            return true;
        }
        if (ki === TransportKind.TRAIN) {
        }
        return false;
    }
    
    static static_constructor() {
        TransportReferent.OBJ_TYPENAME = "TRANSPORT";
        TransportReferent.ATTR_TYPE = "TYPE";
        TransportReferent.ATTR_BRAND = "BRAND";
        TransportReferent.ATTR_MODEL = "MODEL";
        TransportReferent.ATTR_CLASS = "CLASS";
        TransportReferent.ATTR_NAME = "NAME";
        TransportReferent.ATTR_NUMBER = "NUMBER";
        TransportReferent.ATTR_NUMBER_REGION = "NUMBER_REG";
        TransportReferent.ATTR_KIND = "KIND";
        TransportReferent.ATTR_GEO = "GEO";
        TransportReferent.ATTR_ORG = "ORG";
        TransportReferent.ATTR_DATE = "DATE";
        TransportReferent.ATTR_ROUTEPOINT = "ROUTEPOINT";
    }
}


TransportReferent.static_constructor();

module.exports = TransportReferent