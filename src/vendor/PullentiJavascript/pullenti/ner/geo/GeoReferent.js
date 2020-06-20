/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphLang = require("./../../morph/MorphLang");
const LanguageHelper = require("./../../morph/LanguageHelper");
const IntOntologyItem = require("./../core/IntOntologyItem");
const Termin = require("./../core/Termin");
const ReferentClass = require("./../ReferentClass");
const MiscHelper = require("./../core/MiscHelper");
const Referent = require("./../Referent");
const MetaGeo = require("./internal/MetaGeo");

/**
 * Сущность, описывающая территорию как административную единицу. 
 *  Это страны, автономные образования, области, административные районы и пр.
 */
class GeoReferent extends Referent {
    
    constructor() {
        super(GeoReferent.OBJ_TYPENAME);
        this.m_tmp_bits = 0;
        this.m_higher = null;
        this.instance_of = MetaGeo.global_meta;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        return this._to_string(short_variant, lang, true, lev);
    }
    
    _to_string(short_variant, lang, out_cladr, lev) {
        if (this.is_union && !this.is_state) {
            let res = new StringBuilder();
            res.append(this.get_string_value(GeoReferent.ATTR_TYPE));
            for (const s of this.slots) {
                if (s.type_name === GeoReferent.ATTR_REF && (s.value instanceof Referent)) 
                    res.append("; ").append((s.value).to_string(true, lang, 0));
            }
            return res.toString();
        }
        let name = MiscHelper.convert_first_char_upper_and_other_lower(this._get_name(lang !== null && lang.is_en));
        if (!short_variant) {
            if (!this.is_state) {
                if (this.is_city && this.is_region) {
                }
                else {
                    let typ = this.get_string_value(GeoReferent.ATTR_TYPE);
                    if (typ !== null) {
                        if (!this.is_city) {
                            let i = typ.lastIndexOf(' ');
                            if (i > 0) 
                                typ = typ.substring(i + 1);
                        }
                        name = (typ + " " + name);
                    }
                }
            }
        }
        if (!short_variant && out_cladr) {
            let kladr = this.get_slot_value(GeoReferent.ATTR_FIAS);
            if (kladr instanceof Referent) 
                name = (name + " (ФИАС: " + (Utils.notNull((kladr).get_string_value("GUID"), "?")) + ")");
            let bti = this.get_string_value(GeoReferent.ATTR_BTI);
            if (bti !== null) 
                name = (name + " (БТИ " + bti + ")");
        }
        if (!short_variant && this.higher !== null && (lev < 10)) {
            if (((this.higher.is_city && this.is_region)) || ((this.find_slot(GeoReferent.ATTR_TYPE, "город", true) === null && this.find_slot(GeoReferent.ATTR_TYPE, "місто", true) === null && this.is_city))) 
                return (name + "; " + this.higher._to_string(false, lang, false, lev + 1));
        }
        return name;
    }
    
    _get_name(cyr) {
        let name = null;
        for (let i = 0; i < 2; i++) {
            for (const s of this.slots) {
                if (s.type_name === GeoReferent.ATTR_NAME) {
                    let v = s.value.toString();
                    if (Utils.isNullOrEmpty(v)) 
                        continue;
                    if (i === 0) {
                        if (!LanguageHelper.is_cyrillic_char(v[0])) {
                            if (cyr) 
                                continue;
                        }
                        else if (!cyr) 
                            continue;
                    }
                    if (name === null) 
                        name = v;
                    else if (name.length > v.length) {
                        if ((v.length < 4) && (name.length < 20)) {
                        }
                        else if (name[name.length - 1] === 'В') {
                        }
                        else 
                            name = v;
                    }
                    else if ((name.length < 4) && v.length >= 4 && (v.length < 10)) 
                        name = v;
                }
            }
            if (name !== null) 
                break;
        }
        if (name === "МОЛДОВА") 
            name = "МОЛДАВИЯ";
        else if (name === "БЕЛАРУСЬ") 
            name = "БЕЛОРУССИЯ";
        else if (name === "АПСНЫ") 
            name = "АБХАЗИЯ";
        return (name != null ? name : "?");
    }
    
    to_sort_string() {
        let typ = "GEO4";
        if (this.is_state) 
            typ = "GEO1";
        else if (this.is_region) 
            typ = "GEO2";
        else if (this.is_city) 
            typ = "GEO3";
        return typ + this._get_name(false);
    }
    
    get_compare_strings() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === GeoReferent.ATTR_NAME) 
                res.push(s.value.toString());
        }
        if (res.length > 0) 
            return res;
        else 
            return super.get_compare_strings();
    }
    
    add_name(v) {
        if (v !== null) {
            if (v.indexOf('-') > 0) 
                v = Utils.replaceString(v, " - ", "-");
            this.add_slot(GeoReferent.ATTR_NAME, v.toUpperCase(), false, 0);
        }
    }
    
    add_typ(v) {
        if (v !== null) {
            if (v === "ТЕРРИТОРИЯ" && this.is_state) 
                return;
            this.add_slot(GeoReferent.ATTR_TYPE, v.toLowerCase(), false, 0);
        }
    }
    
    add_typ_city(lang) {
        if (lang.is_en) 
            this.add_slot(GeoReferent.ATTR_TYPE, "city", false, 0);
        else if (lang.is_ua) 
            this.add_slot(GeoReferent.ATTR_TYPE, "місто", false, 0);
        else 
            this.add_slot(GeoReferent.ATTR_TYPE, "город", false, 0);
    }
    
    add_typ_reg(lang) {
        if (lang.is_en) 
            this.add_slot(GeoReferent.ATTR_TYPE, "region", false, 0);
        else if (lang.is_ua) 
            this.add_slot(GeoReferent.ATTR_TYPE, "регіон", false, 0);
        else 
            this.add_slot(GeoReferent.ATTR_TYPE, "регион", false, 0);
    }
    
    add_typ_state(lang) {
        if (lang.is_en) 
            this.add_slot(GeoReferent.ATTR_TYPE, "country", false, 0);
        else if (lang.is_ua) 
            this.add_slot(GeoReferent.ATTR_TYPE, "держава", false, 0);
        else 
            this.add_slot(GeoReferent.ATTR_TYPE, "государство", false, 0);
    }
    
    add_typ_union(lang) {
        if (lang.is_en) 
            this.add_slot(GeoReferent.ATTR_TYPE, "union", false, 0);
        else if (lang.is_ua) 
            this.add_slot(GeoReferent.ATTR_TYPE, "союз", false, 0);
        else 
            this.add_slot(GeoReferent.ATTR_TYPE, "союз", false, 0);
    }
    
    add_typ_ter(lang) {
        if (lang.is_en) 
            this.add_slot(GeoReferent.ATTR_TYPE, "territory", false, 0);
        else if (lang.is_ua) 
            this.add_slot(GeoReferent.ATTR_TYPE, "територія", false, 0);
        else 
            this.add_slot(GeoReferent.ATTR_TYPE, "территория", false, 0);
    }
    
    add_slot(attr_name, attr_value, clear_old_value, stat_count = 0) {
        this.m_tmp_bits = 0;
        return super.add_slot(attr_name, attr_value, clear_old_value, stat_count);
    }
    
    upload_slot(slot, new_val) {
        this.m_tmp_bits = 0;
        super.upload_slot(slot, new_val);
    }
    
    _recalc_tmp_bits() {
        this.m_tmp_bits = 1;
        this.m_higher = null;
        let hi = Utils.as(this.get_slot_value(GeoReferent.ATTR_HIGHER), GeoReferent);
        if (hi === this || hi === null) {
        }
        else {
            let li = null;
            let err = false;
            for (let r = Utils.as(hi.get_slot_value(GeoReferent.ATTR_HIGHER), Referent); r !== null; r = Utils.as(r.get_slot_value(GeoReferent.ATTR_HIGHER), Referent)) {
                if (r === hi || r === this) {
                    err = true;
                    break;
                }
                if (li === null) 
                    li = new Array();
                else if (li.includes(r)) {
                    err = true;
                    break;
                }
                li.push(r);
            }
            if (!err) 
                this.m_higher = hi;
        }
        let _is_state = -1;
        let is_reg = -1;
        for (const t of this.slots) {
            if (t.type_name === GeoReferent.ATTR_TYPE) {
                let val = Utils.asString(t.value);
                if (val === "территория" || val === "територія" || val === "territory") {
                    this.m_tmp_bits = 1 | GeoReferent.bit_isterritory;
                    return;
                }
                if (GeoReferent._is_city(val)) {
                    this.m_tmp_bits |= (GeoReferent.bit_iscity);
                    if ((val === "город" || val === "місто" || val === "city") || val === "town") 
                        this.m_tmp_bits |= (GeoReferent.bit_isbigcity);
                    continue;
                }
                if ((val === "государство" || val === "держава" || val === "империя") || val === "імперія" || val === "country") {
                    this.m_tmp_bits |= (GeoReferent.bit_isstate);
                    is_reg = 0;
                    continue;
                }
                if (GeoReferent._is_region(val)) {
                    if (_is_state < 0) 
                        _is_state = 0;
                    if (is_reg < 0) 
                        is_reg = 1;
                }
            }
            else if (t.type_name === GeoReferent.ATTR_ALPHA2) {
                this.m_tmp_bits = 1 | GeoReferent.bit_isstate;
                if (this.find_slot(GeoReferent.ATTR_TYPE, "город", true) !== null || this.find_slot(GeoReferent.ATTR_TYPE, "місто", true) !== null || this.find_slot(GeoReferent.ATTR_TYPE, "city", true) !== null) 
                    this.m_tmp_bits |= (GeoReferent.bit_isbigcity | GeoReferent.bit_iscity);
                return;
            }
        }
        if (_is_state !== 0) {
            if ((_is_state < 0) && (((this.m_tmp_bits) & GeoReferent.bit_iscity)) !== 0) {
            }
            else 
                this.m_tmp_bits |= (GeoReferent.bit_isstate);
        }
        if (is_reg !== 0) {
            if ((_is_state < 0) && (((this.m_tmp_bits) & GeoReferent.bit_iscity)) !== 0) {
            }
            else 
                this.m_tmp_bits |= (GeoReferent.bit_isregion);
        }
    }
    
    /**
     * [Get] Тип(ы)
     */
    get typs() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === GeoReferent.ATTR_TYPE) 
                res.push(String(s.value));
        }
        return res;
    }
    
    /**
     * [Get] Это может быть населенным пунктом
     */
    get is_city() {
        if ((((this.m_tmp_bits) & 1)) === 0) 
            this._recalc_tmp_bits();
        return (((this.m_tmp_bits) & GeoReferent.bit_iscity)) !== 0;
    }
    
    /**
     * [Get] Это именно город, а не деревня или поселок
     */
    get is_big_city() {
        if ((((this.m_tmp_bits) & 1)) === 0) 
            this._recalc_tmp_bits();
        return (((this.m_tmp_bits) & GeoReferent.bit_isbigcity)) !== 0;
    }
    
    /**
     * [Get] Это может быть отдельным государством
     */
    get is_state() {
        if ((((this.m_tmp_bits) & 1)) === 0) 
            this._recalc_tmp_bits();
        return (((this.m_tmp_bits) & GeoReferent.bit_isstate)) !== 0;
    }
    
    /**
     * [Get] Это может быть регионом в составе другого образования
     */
    get is_region() {
        if ((((this.m_tmp_bits) & 1)) === 0) 
            this._recalc_tmp_bits();
        return (((this.m_tmp_bits) & GeoReferent.bit_isregion)) !== 0;
    }
    
    /**
     * [Get] Просто территория (например, территория аэропорта Шереметьево)
     */
    get is_territory() {
        if ((((this.m_tmp_bits) & 1)) === 0) 
            this._recalc_tmp_bits();
        return (((this.m_tmp_bits) & GeoReferent.bit_isterritory)) !== 0;
    }
    
    /**
     * [Get] Союз России и Белоруссии
     */
    get is_union() {
        for (const s of this.slots) {
            if (s.type_name === GeoReferent.ATTR_TYPE) {
                let v = Utils.asString(s.value);
                if (v.endsWith("союз")) 
                    return true;
            }
        }
        return false;
    }
    
    static _is_city(v) {
        if (((((((((((v.includes("поселок") || v.includes("селение") || v.includes("село")) || v.includes("деревня") || v.includes("станица")) || v.includes("пункт") || v.includes("станция")) || v.includes("аул") || v.includes("хутор")) || v.includes("местечко") || v.includes("урочище")) || v.includes("усадьба") || v.includes("аал")) || v.includes("выселки") || v.includes("арбан")) || v.includes("місто") || v.includes("селище")) || v.includes("сіло") || v.includes("станиця")) || v.includes("станція") || v.includes("city")) || v.includes("municipality") || v.includes("town")) 
            return true;
        if (v.includes("город") || v.includes("місто")) {
            if (!GeoReferent._is_region(v)) 
                return true;
        }
        return false;
    }
    
    static _is_region(v) {
        if ((((((((((((v.includes("район") || v.includes("штат") || v.includes("область")) || v.includes("волость") || v.includes("провинция")) || v.includes("регион") || v.includes("округ")) || v.includes("край") || v.includes("префектура")) || v.includes("улус") || v.includes("провінція")) || v.includes("регіон") || v.includes("образование")) || v.includes("утворення") || v.includes("автономия")) || v.includes("автономія") || v.includes("district")) || v.includes("county") || v.includes("state")) || v.includes("area") || v.includes("borough")) || v.includes("parish") || v.includes("region")) || v.includes("province") || v.includes("prefecture")) 
            return true;
        if (v.includes("городск") || v.includes("міськ")) {
            if (v.includes("образование") || v.includes("освіта")) 
                return true;
        }
        return false;
    }
    
    /**
     * [Get] 2-х символьный идентификатор страны (ISO 3166)
     */
    get alpha2() {
        return this.get_string_value(GeoReferent.ATTR_ALPHA2);
    }
    /**
     * [Set] 2-х символьный идентификатор страны (ISO 3166)
     */
    set alpha2(value) {
        this.add_slot(GeoReferent.ATTR_ALPHA2, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Вышестоящий объект
     */
    get higher() {
        if ((((this.m_tmp_bits) & 1)) === 0) 
            this._recalc_tmp_bits();
        return this.m_higher;
    }
    /**
     * [Set] Вышестоящий объект
     */
    set higher(value) {
        if (value === this) 
            return value;
        if (value !== null) {
            let d = value;
            let li = new Array();
            for (; d !== null; d = d.higher) {
                if (d === this) 
                    return value;
                else if (d.toString() === this.toString()) 
                    return value;
                if (li.includes(d)) 
                    return value;
                li.push(d);
            }
        }
        this.add_slot(GeoReferent.ATTR_HIGHER, null, true, 0);
        if (value !== null) 
            this.add_slot(GeoReferent.ATTR_HIGHER, value, true, 0);
        return value;
    }
    
    static _check_round_dep(d) {
        if (d === null) 
            return true;
        let d0 = d;
        let li = new Array();
        for (d = d.higher; d !== null; d = d.higher) {
            if (d === d0) 
                return true;
            if (li.includes(d)) 
                return true;
            li.push(d);
        }
        return false;
    }
    
    get top_higher() {
        if (GeoReferent._check_round_dep(this)) 
            return this;
        for (let hi = this; hi !== null; hi = hi.higher) {
            if (hi.higher === null) 
                return hi;
        }
        return this;
    }
    
    get parent_referent() {
        return this.higher;
    }
    
    can_be_equals(obj, typ) {
        let _geo = Utils.as(obj, GeoReferent);
        if (_geo === null) 
            return false;
        if (_geo.alpha2 !== null && _geo.alpha2 === this.alpha2) 
            return true;
        if (this.is_city !== _geo.is_city) 
            return false;
        if (this.is_union !== _geo.is_union) 
            return false;
        if (this.is_union) {
            for (const s of this.slots) {
                if (s.type_name === GeoReferent.ATTR_REF) {
                    if (obj.find_slot(GeoReferent.ATTR_REF, s.value, true) === null) 
                        return false;
                }
            }
            for (const s of obj.slots) {
                if (s.type_name === GeoReferent.ATTR_REF) {
                    if (this.find_slot(GeoReferent.ATTR_REF, s.value, true) === null) 
                        return false;
                }
            }
            return true;
        }
        let ref1 = Utils.as(this.get_slot_value(GeoReferent.ATTR_REF), Referent);
        let ref2 = Utils.as(_geo.get_slot_value(GeoReferent.ATTR_REF), Referent);
        if (ref1 !== null && ref2 !== null) {
            if (ref1 !== ref2) 
                return false;
        }
        let r = this.is_region || this.is_state;
        let r1 = _geo.is_region || _geo.is_state;
        if (r !== r1) {
            if (this.is_territory !== _geo.is_territory) 
                return false;
            return false;
        }
        let eq_names = false;
        for (const s of this.slots) {
            if (s.type_name === GeoReferent.ATTR_NAME) {
                if (_geo.find_slot(s.type_name, s.value, true) !== null) {
                    eq_names = true;
                    break;
                }
            }
        }
        if (!eq_names) 
            return false;
        if (this.is_region && _geo.is_region) {
            let typs1 = this.typs;
            let typs2 = _geo.typs;
            let ok = false;
            for (const t of typs1) {
                if (typs2.includes(t)) 
                    ok = true;
                else 
                    for (const tt of typs2) {
                        if (LanguageHelper.ends_with(tt, t) || LanguageHelper.ends_with(t, tt)) 
                            ok = true;
                    }
            }
            if (!ok) 
                return false;
        }
        if (this.higher !== null && _geo.higher !== null) {
            if (GeoReferent._check_round_dep(this) || GeoReferent._check_round_dep(_geo)) 
                return false;
            if (this.higher.can_be_equals(_geo.higher, typ)) {
            }
            else if (_geo.higher.higher !== null && this.higher.can_be_equals(_geo.higher.higher, typ)) {
            }
            else if (this.higher.higher !== null && this.higher.higher.can_be_equals(_geo.higher, typ)) {
            }
            else 
                return false;
        }
        return true;
    }
    
    merge_slots2(obj, lang) {
        let merge_statistic = true;
        for (const s of obj.slots) {
            if (s.type_name === GeoReferent.ATTR_NAME || s.type_name === GeoReferent.ATTR_TYPE) {
                let nam = String(s.value);
                if (LanguageHelper.is_latin_char(nam[0])) {
                    if (!lang.is_en) 
                        continue;
                }
                else if (lang.is_en) 
                    continue;
                if (LanguageHelper.ends_with(nam, " ССР")) 
                    continue;
            }
            this.add_slot(s.type_name, s.value, false, (merge_statistic ? s.count : 0));
        }
        if (this.find_slot(GeoReferent.ATTR_NAME, null, true) === null && obj.find_slot(GeoReferent.ATTR_NAME, null, true) !== null) {
            for (const s of obj.slots) {
                if (s.type_name === GeoReferent.ATTR_NAME) 
                    this.add_slot(s.type_name, s.value, false, (merge_statistic ? s.count : 0));
            }
        }
        if (this.find_slot(GeoReferent.ATTR_TYPE, null, true) === null && obj.find_slot(GeoReferent.ATTR_TYPE, null, true) !== null) {
            for (const s of obj.slots) {
                if (s.type_name === GeoReferent.ATTR_TYPE) 
                    this.add_slot(s.type_name, s.value, false, (merge_statistic ? s.count : 0));
            }
        }
        if (this.is_territory) {
            if (((this.alpha2 !== null || this.find_slot(GeoReferent.ATTR_TYPE, "государство", true) !== null || this.find_slot(GeoReferent.ATTR_TYPE, "держава", true) !== null) || this.find_slot(GeoReferent.ATTR_TYPE, "империя", true) !== null || this.find_slot(GeoReferent.ATTR_TYPE, "імперія", true) !== null) || this.find_slot(GeoReferent.ATTR_TYPE, "state", true) !== null) {
                let s = this.find_slot(GeoReferent.ATTR_TYPE, "территория", true);
                if (s !== null) 
                    Utils.removeItem(this.slots, s);
            }
        }
        if (this.is_state) {
            for (const s of this.slots) {
                if (s.type_name === GeoReferent.ATTR_TYPE && ((s.value.toString() === "регион" || s.value.toString() === "регіон" || s.value.toString() === "region"))) {
                    Utils.removeItem(this.slots, s);
                    break;
                }
            }
        }
        if (this.is_city) {
            let s = Utils.notNull(this.find_slot(GeoReferent.ATTR_TYPE, "город", true), Utils.notNull(this.find_slot(GeoReferent.ATTR_TYPE, "місто", true), this.find_slot(GeoReferent.ATTR_TYPE, "city", true)));
            if (s !== null) {
                for (const ss of this.slots) {
                    if (ss.type_name === GeoReferent.ATTR_TYPE && ss !== s && GeoReferent._is_city(String(ss.value))) {
                        Utils.removeItem(this.slots, s);
                        break;
                    }
                }
            }
        }
        let has = false;
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].type_name === GeoReferent.ATTR_HIGHER) {
                if (!has) 
                    has = true;
                else {
                    this.slots.splice(i, 1);
                    i--;
                }
            }
        }
        this._merge_ext_referents(obj);
    }
    
    create_ontology_item() {
        let __is_city = this.is_city;
        let oi = new IntOntologyItem(this);
        for (const a of this.slots) {
            if (a.type_name === GeoReferent.ATTR_NAME) {
                let s = a.value.toString();
                let t = new Termin();
                t.init_by_normal_text(s, null);
                if (__is_city) 
                    t.add_std_abridges();
                oi.termins.push(t);
            }
        }
        return oi;
    }
    
    check_abbr(abbr) {
        if (abbr.length !== 2) 
            return false;
        let nameq = false;
        let typeq = false;
        let nameq2 = false;
        let typeq2 = false;
        for (const s of this.slots) {
            if (s.type_name === GeoReferent.ATTR_NAME) {
                let val = Utils.asString(s.value);
                let ch = val[0];
                if (ch === abbr[0]) {
                    nameq = true;
                    let ii = val.indexOf(' ');
                    if (ii > 0) {
                        if (abbr[1] === val[ii + 1]) {
                            if (val.indexOf(' ', ii + 1) < 0) 
                                return true;
                        }
                    }
                }
                if (ch === abbr[1]) 
                    nameq2 = true;
            }
            else if (s.type_name === GeoReferent.ATTR_TYPE) {
                let ty = String(s.value);
                if (ty === "государство" || ty === "держава" || ty === "country") 
                    continue;
                let ch = ty[0].toUpperCase();
                if (ch === abbr[1]) 
                    typeq = true;
                if (ch === abbr[0]) 
                    typeq2 = true;
            }
        }
        if (typeq && nameq) 
            return true;
        if (typeq2 && nameq2) 
            return true;
        return false;
    }
    
    /**
     * Добавляем ссылку на организацию, также добавляем имена
     * @param org 
     */
    add_org_referent(org) {
        if (org === null) 
            return;
        let nam = false;
        this.add_slot(GeoReferent.ATTR_REF, org, false, 0);
        let _geo = null;
        let spec_typ = null;
        let num = org.get_string_value("NUMBER");
        for (const s of org.slots) {
            if (s.type_name === "NAME") {
                if (num === null) 
                    this.add_name(Utils.asString(s.value));
                else 
                    this.add_name((String(s.value) + "-" + num));
                nam = true;
            }
            else if (s.type_name === "TYPE") {
                let v = Utils.asString(s.value);
                if (v === "СЕЛЬСКИЙ СОВЕТ") 
                    this.add_typ("сельский округ");
                else if (v === "ГОРОДСКОЙ СОВЕТ") 
                    this.add_typ("городской округ");
                else if (v === "ПОСЕЛКОВЫЙ СОВЕТ") 
                    this.add_typ("поселковый округ");
                else if (v === "аэропорт") 
                    spec_typ = v.toUpperCase();
            }
            else if (s.type_name === "GEO" && (s.value instanceof GeoReferent)) 
                _geo = Utils.as(s.value, GeoReferent);
        }
        if (!nam) {
            for (const s of org.slots) {
                if (s.type_name === "EPONYM") {
                    if (num === null) 
                        this.add_name((s.value).toUpperCase());
                    else 
                        this.add_name(((s.value).toUpperCase() + "-" + num));
                    nam = true;
                }
            }
        }
        if (!nam && num !== null) {
            for (const s of org.slots) {
                if (s.type_name === "TYPE") {
                    this.add_name(((s.value).toUpperCase() + "-" + num));
                    nam = true;
                }
            }
        }
        if (_geo !== null && !nam) {
            for (const n of _geo.get_string_values(GeoReferent.ATTR_NAME)) {
                this.add_name(n);
                if (spec_typ !== null) {
                    this.add_name((n + " " + spec_typ));
                    this.add_name((spec_typ + " " + n));
                }
                nam = true;
            }
        }
        if (!nam) 
            this.add_name(org.to_string(true, MorphLang.UNKNOWN, 0).toUpperCase());
    }
    
    static static_constructor() {
        GeoReferent.OBJ_TYPENAME = "GEO";
        GeoReferent.ATTR_NAME = "NAME";
        GeoReferent.ATTR_TYPE = "TYPE";
        GeoReferent.ATTR_ALPHA2 = "ALPHA2";
        GeoReferent.ATTR_HIGHER = "HIGHER";
        GeoReferent.ATTR_REF = "REF";
        GeoReferent.ATTR_FIAS = "FIAS";
        GeoReferent.ATTR_BTI = "BTI";
        GeoReferent.bit_iscity = 2;
        GeoReferent.bit_isregion = 4;
        GeoReferent.bit_isstate = 8;
        GeoReferent.bit_isbigcity = 0x10;
        GeoReferent.bit_isterritory = 0x20;
    }
}


GeoReferent.static_constructor();

module.exports = GeoReferent