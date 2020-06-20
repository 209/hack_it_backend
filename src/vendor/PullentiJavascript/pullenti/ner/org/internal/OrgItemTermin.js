/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const MorphLang = require("./../../../morph/MorphLang");
const Termin = require("./../../core/Termin");
const OrgProfile = require("./../OrgProfile");
const OrgItemTerminTypes = require("./OrgItemTerminTypes");

class OrgItemTermin extends Termin {
    
    constructor(s, _lang = null, p1 = OrgProfile.UNDEFINED, p2 = OrgProfile.UNDEFINED) {
        super(s, _lang, false);
        this.m_typ = OrgItemTerminTypes.UNDEFINED;
        this.must_be_partof_name = false;
        this.is_pure_prefix = false;
        this.can_be_normal_dep = false;
        this.can_has_number = false;
        this.can_has_single_name = false;
        this.can_has_latin_name = false;
        this.must_has_capital_name = false;
        this.is_top = false;
        this.can_be_single_geo = false;
        this.is_doubt_word = false;
        this.coeff = 0;
        this.profiles = new Array();
        if (p1 !== OrgProfile.UNDEFINED) 
            this.profiles.push(p1);
        if (p2 !== OrgProfile.UNDEFINED) 
            this.profiles.push(p2);
    }
    
    get typ() {
        if (this.is_pure_prefix) 
            return OrgItemTerminTypes.PREFIX;
        return this.m_typ;
    }
    set typ(value) {
        if (value === OrgItemTerminTypes.PREFIX) {
            this.is_pure_prefix = true;
            this.m_typ = OrgItemTerminTypes.ORG;
        }
        else {
            this.m_typ = value;
            if (this.m_typ === OrgItemTerminTypes.DEP || this.m_typ === OrgItemTerminTypes.DEPADD) {
                if (!this.profiles.includes(OrgProfile.UNIT)) 
                    this.profiles.push(OrgProfile.UNIT);
            }
        }
        return value;
    }
    
    get profile() {
        return OrgProfile.UNDEFINED;
    }
    set profile(value) {
        this.profiles.push(value);
        return value;
    }
    
    copy_from(it) {
        this.profiles.splice(this.profiles.length, 0, ...it.profiles);
        this.is_pure_prefix = it.is_pure_prefix;
        this.can_be_normal_dep = it.can_be_normal_dep;
        this.can_has_number = it.can_has_number;
        this.can_has_single_name = it.can_has_single_name;
        this.can_has_latin_name = it.can_has_latin_name;
        this.must_be_partof_name = it.must_be_partof_name;
        this.must_has_capital_name = it.must_has_capital_name;
        this.is_top = it.is_top;
        this.can_be_normal_dep = it.can_be_normal_dep;
        this.can_be_single_geo = it.can_be_single_geo;
        this.is_doubt_word = it.is_doubt_word;
        this.coeff = it.coeff;
    }
    
    static deserialize_src(xml, set) {
        let res = new Array();
        let is_set = xml.local_name === "set";
        if (is_set) 
            res.push((set = new OrgItemTermin(null)));
        if (xml.attributes === null) 
            return res;
        for (const a of xml.attributes) {
            let nam = a.local_name;
            if (!nam.startsWith("name")) 
                continue;
            let _lang = MorphLang.RU;
            if (nam === "nameUa") 
                _lang = MorphLang.UA;
            else if (nam === "nameEn") 
                _lang = MorphLang.EN;
            let it = null;
            for (const s of Utils.splitString(a.value, ';', false)) {
                if (!Utils.isNullOrEmpty(s)) {
                    if (it === null) {
                        res.push((it = new OrgItemTermin(s, _lang)));
                        if (set !== null) 
                            it.copy_from(set);
                    }
                    else 
                        it.add_variant(s, false);
                }
            }
        }
        for (const a of xml.attributes) {
            let nam = a.local_name;
            if (nam.startsWith("name")) 
                continue;
            if (nam.startsWith("abbr")) {
                let _lang = MorphLang.RU;
                if (nam === "abbrUa") 
                    _lang = MorphLang.UA;
                else if (nam === "abbrEn") 
                    _lang = MorphLang.EN;
                for (const r of res) {
                    if (MorphLang.ooEq(r.lang, _lang)) 
                        r.acronym = a.value;
                }
                continue;
            }
            if (nam === "profile") {
                let li = new Array();
                for (const s of Utils.splitString(a.value, ';', false)) {
                    try {
                        let p = OrgProfile.of(s);
                        if (p !== OrgProfile.UNDEFINED) 
                            li.push(p);
                    } catch (ex) {
                    }
                }
                for (const r of res) {
                    r.profiles = li;
                }
                continue;
            }
            if (nam === "coef") {
                let v = Utils.parseFloat(a.value);
                for (const r of res) {
                    r.coeff = v;
                }
                continue;
            }
            if (nam === "partofname") {
                for (const r of res) {
                    r.must_be_partof_name = a.value === "true";
                }
                continue;
            }
            if (nam === "top") {
                for (const r of res) {
                    r.is_top = a.value === "true";
                }
                continue;
            }
            if (nam === "geo") {
                for (const r of res) {
                    r.can_be_single_geo = a.value === "true";
                }
                continue;
            }
            if (nam === "purepref") {
                for (const r of res) {
                    r.is_pure_prefix = a.value === "true";
                }
                continue;
            }
            if (nam === "number") {
                for (const r of res) {
                    r.can_has_number = a.value === "true";
                }
                continue;
            }
            throw new Error("Unknown Org Type Tag: " + a.name);
        }
        return res;
    }
    
    static _new1822(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1, _arg2, _arg3);
        res.coeff = _arg4;
        res.typ = _arg5;
        res.is_top = _arg6;
        res.can_be_single_geo = _arg7;
        return res;
    }
    
    static _new1825(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.profile = _arg3;
        res.coeff = _arg4;
        return res;
    }
    
    static _new1826(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.profile = _arg4;
        res.coeff = _arg5;
        return res;
    }
    
    static _new1827(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.profile = _arg3;
        res.coeff = _arg4;
        res.can_be_single_geo = _arg5;
        return res;
    }
    
    static _new1830(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.profile = _arg4;
        return res;
    }
    
    static _new1831(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.profile = _arg4;
        res.can_be_normal_dep = _arg5;
        return res;
    }
    
    static _new1832(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        res.profile = _arg5;
        return res;
    }
    
    static _new1833(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_be_single_geo = _arg4;
        return res;
    }
    
    static _new1834(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_be_single_geo = _arg5;
        return res;
    }
    
    static _new1838(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.is_top = _arg4;
        res.can_be_single_geo = _arg5;
        return res;
    }
    
    static _new1840(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.is_top = _arg5;
        res.can_be_single_geo = _arg6;
        return res;
    }
    
    static _new1841(_arg1, _arg2, _arg3) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        return res;
    }
    
    static _new1843(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        return res;
    }
    
    static _new1846(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.profile = _arg5;
        return res;
    }
    
    static _new1848(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_be_single_geo = _arg4;
        res.can_be_normal_dep = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new1850(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_be_single_geo = _arg4;
        res.can_has_number = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new1851(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_be_single_geo = _arg4;
        res.profile = _arg5;
        return res;
    }
    
    static _new1852(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_be_single_geo = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new1854(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_be_single_geo = _arg5;
        res.can_has_number = _arg6;
        res.profile = _arg7;
        return res;
    }
    
    static _new1861(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.acronym = _arg3;
        res.typ = _arg4;
        res.can_has_number = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new1862(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_number = _arg5;
        return res;
    }
    
    static _new1863(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_number = _arg4;
        res.profile = _arg5;
        return res;
    }
    
    static _new1866(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.lang = _arg3;
        res.typ = _arg4;
        res.can_has_number = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new1875(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.profile = _arg4;
        res.can_be_single_geo = _arg5;
        return res;
    }
    
    static _new1876(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.is_doubt_word = _arg4;
        return res;
    }
    
    static _new1877(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.is_doubt_word = _arg5;
        return res;
    }
    
    static _new1880(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new1885(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.acronym = _arg3;
        res.profile = _arg4;
        res.can_be_single_geo = _arg5;
        res.can_has_number = _arg6;
        return res;
    }
    
    static _new1888(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.profile = _arg4;
        res.can_has_number = _arg5;
        return res;
    }
    
    static _new1889(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.profile = _arg4;
        res.typ = _arg5;
        res.can_has_number = _arg6;
        return res;
    }
    
    static _new1892(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.profile = _arg4;
        res.can_has_number = _arg5;
        res.can_has_latin_name = _arg6;
        return res;
    }
    
    static _new1898(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.acronym = _arg3;
        res.typ = _arg4;
        res.profile = _arg5;
        res.can_has_number = _arg6;
        return res;
    }
    
    static _new1899(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_be_normal_dep = _arg4;
        res.can_be_single_geo = _arg5;
        res.can_has_single_name = _arg6;
        res.can_has_latin_name = _arg7;
        res.profile = _arg8;
        return res;
    }
    
    static _new1905(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_number = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new1913(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_number = _arg4;
        res.profile = _arg5;
        res.can_has_latin_name = _arg6;
        return res;
    }
    
    static _new1917(_arg1, _arg2, _arg3) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.is_doubt_word = _arg3;
        return res;
    }
    
    static _new1920(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.acronym = _arg4;
        res.can_has_number = _arg5;
        res.profile = _arg6;
        res.can_has_latin_name = _arg7;
        return res;
    }
    
    static _new1929(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_number = _arg4;
        res.acronym = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new1930(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_number = _arg5;
        res.acronym = _arg6;
        res.profile = _arg7;
        return res;
    }
    
    static _new1931(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_number = _arg4;
        return res;
    }
    
    static _new1941(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_number = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        res.profile = _arg7;
        return res;
    }
    
    static _new1942(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_number = _arg5;
        res.can_has_latin_name = _arg6;
        res.can_has_single_name = _arg7;
        res.profile = _arg8;
        return res;
    }
    
    static _new1945(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.is_top = _arg4;
        res.can_has_single_name = _arg5;
        res.can_has_latin_name = _arg6;
        res.can_be_single_geo = _arg7;
        res.profile = _arg8;
        return res;
    }
    
    static _new1946(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.is_top = _arg5;
        res.can_has_single_name = _arg6;
        res.can_has_latin_name = _arg7;
        res.can_be_single_geo = _arg8;
        return res;
    }
    
    static _new1950(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_latin_name = _arg5;
        return res;
    }
    
    static _new1951(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_number = _arg5;
        return res;
    }
    
    static _new1952(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_number = _arg6;
        return res;
    }
    
    static _new1953(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_single_name = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new1954(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        res.profile = _arg7;
        return res;
    }
    
    static _new1955(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.must_be_partof_name = _arg4;
        return res;
    }
    
    static _new1956(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.canonic_text = _arg4;
        return res;
    }
    
    static _new1958(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.must_be_partof_name = _arg5;
        return res;
    }
    
    static _new1959(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.canonic_text = _arg5;
        return res;
    }
    
    static _new1965(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_number = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        return res;
    }
    
    static _new1966(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_number = _arg5;
        res.can_has_latin_name = _arg6;
        res.can_has_single_name = _arg7;
        return res;
    }
    
    static _new1969(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.acronym = _arg4;
        res.can_has_number = _arg5;
        return res;
    }
    
    static _new1971(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.coeff = _arg3;
        res.can_be_single_geo = _arg4;
        res.can_has_single_name = _arg5;
        return res;
    }
    
    static _new1972(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.typ = _arg3;
        res.coeff = _arg4;
        res.can_be_single_geo = _arg5;
        res.can_has_single_name = _arg6;
        return res;
    }
    
    static _new1973(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.acronym = _arg4;
        return res;
    }
    
    static _new1974(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.acronym = _arg4;
        res.profile = _arg5;
        return res;
    }
    
    static _new1976(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.is_doubt_word = _arg4;
        res.can_has_number = _arg5;
        return res;
    }
    
    static _new1977(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        res.is_doubt_word = _arg5;
        res.can_has_number = _arg6;
        return res;
    }
    
    static _new1978(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.acronym = _arg3;
        res.typ = _arg4;
        res.can_has_number = _arg5;
        return res;
    }
    
    static _new1979(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.acronym = _arg4;
        res.typ = _arg5;
        res.can_has_number = _arg6;
        return res;
    }
    
    static _new1984(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new1989(_arg1, _arg2) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        return res;
    }
    
    static _new1990(_arg1, _arg2, _arg3) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new1992(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.is_doubt_word = _arg4;
        return res;
    }
    
    static _new1997(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.is_doubt_word = _arg3;
        res.can_has_number = _arg4;
        return res;
    }
    
    static _new1998(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.is_doubt_word = _arg4;
        res.can_has_number = _arg5;
        return res;
    }
    
    static _new1999(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.coeff = _arg3;
        res.can_has_number = _arg4;
        res.can_has_single_name = _arg5;
        return res;
    }
    
    static _new2001(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.acronym = _arg2;
        res.typ = _arg3;
        res.coeff = _arg4;
        res.can_has_number = _arg5;
        res.can_has_single_name = _arg6;
        return res;
    }
    
    static _new2002(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.coeff = _arg4;
        res.can_has_number = _arg5;
        res.can_has_single_name = _arg6;
        return res;
    }
    
    static _new2003(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.acronym = _arg2;
        res.typ = _arg3;
        res.can_be_normal_dep = _arg4;
        return res;
    }
    
    static _new2005(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.acronym = _arg3;
        res.typ = _arg4;
        res.can_be_normal_dep = _arg5;
        return res;
    }
    
    static _new2010(_arg1, _arg2, _arg3) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_be_normal_dep = _arg3;
        return res;
    }
    
    static _new2011(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.can_be_normal_dep = _arg4;
        return res;
    }
    
    static _new2017(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_be_normal_dep = _arg3;
        res.profile = _arg4;
        return res;
    }
    
    static _new2018(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.can_be_normal_dep = _arg4;
        res.profile = _arg5;
        return res;
    }
    
    static _new2022(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_number = _arg3;
        res.is_doubt_word = _arg4;
        return res;
    }
    
    static _new2023(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_number = _arg3;
        res.is_doubt_word = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        return res;
    }
    
    static _new2024(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.can_has_number = _arg4;
        res.is_doubt_word = _arg5;
        res.can_has_latin_name = _arg6;
        res.can_has_single_name = _arg7;
        return res;
    }
    
    static _new2031(_arg1, _arg2, _arg3) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_number = _arg3;
        return res;
    }
    
    static _new2032(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.can_has_number = _arg4;
        return res;
    }
    
    static _new2033(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.profile = _arg3;
        res.acronym = _arg4;
        return res;
    }
    
    static _new2034(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.profile = _arg4;
        res.acronym = _arg5;
        return res;
    }
    
    static _new2039(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.acronym = _arg3;
        res.profile = _arg4;
        return res;
    }
    
    static _new2040(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.acronym = _arg4;
        res.profile = _arg5;
        return res;
    }
    
    static _new2044(_arg1, _arg2, _arg3) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.profile = _arg3;
        return res;
    }
    
    static _new2061(_arg1, _arg2, _arg3) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.acronym = _arg3;
        return res;
    }
    
    static _new2063(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.acronym = _arg4;
        return res;
    }
    
    static _new2152(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.acronym = _arg3;
        res.acronym_can_be_lower = _arg4;
        res.can_be_single_geo = _arg5;
        return res;
    }
    
    static _new2153(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.acronym = _arg3;
        res.can_has_latin_name = _arg4;
        return res;
    }
    
    static _new2154(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_latin_name = _arg3;
        res.acronym = _arg4;
        return res;
    }
    
    static _new2155(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.acronym = _arg5;
        return res;
    }
    
    static _new2158(_arg1, _arg2, _arg3) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_latin_name = _arg3;
        return res;
    }
    
    static _new2160(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_latin_name = _arg3;
        res.acronym = _arg4;
        res.acronym_smart = _arg5;
        return res;
    }
    
    static _new2171(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.acronym = _arg5;
        res.acronym_smart = _arg6;
        return res;
    }
    
    static _new2189(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.acronym = _arg3;
        res.acronym_smart = _arg4;
        return res;
    }
    
    static _new2197(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        return res;
    }
    
    static _new2203(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.acronym = _arg4;
        res.can_has_latin_name = _arg5;
        return res;
    }
    
    static _new2206(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_latin_name = _arg3;
        res.can_has_number = _arg4;
        res.acronym = _arg5;
        return res;
    }
    
    static _new2207(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_number = _arg5;
        res.acronym = _arg6;
        return res;
    }
    
    static _new2212(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.acronym = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_number = _arg5;
        return res;
    }
    
    static _new2223(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.acronym = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_number = _arg6;
        return res;
    }
    
    static _new2224(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.acronym = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        return res;
    }
    
    static _new2225(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.profile = _arg3;
        res.can_has_latin_name = _arg4;
        res.coeff = _arg5;
        return res;
    }
    
    static _new2226(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_single_name = _arg4;
        res.can_has_latin_name = _arg5;
        return res;
    }
    
    static _new2227(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_single_name = _arg5;
        res.can_has_latin_name = _arg6;
        return res;
    }
    
    static _new2228(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_single_name = _arg4;
        res.can_has_latin_name = _arg5;
        res.must_has_capital_name = _arg6;
        return res;
    }
    
    static _new2229(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_single_name = _arg5;
        res.can_has_latin_name = _arg6;
        res.must_has_capital_name = _arg7;
        return res;
    }
    
    static _new2232(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_be_normal_dep = _arg4;
        res.profile = _arg5;
        return res;
    }
    
    static _new2234(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_be_normal_dep = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new2235(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_single_name = _arg3;
        res.can_has_latin_name = _arg4;
        res.is_doubt_word = _arg5;
        return res;
    }
    
    static _new2237(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_single_name = _arg4;
        res.can_has_latin_name = _arg5;
        res.is_doubt_word = _arg6;
        res.profile = _arg7;
        return res;
    }
    
    static _new2238(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_single_name = _arg3;
        res.can_has_latin_name = _arg4;
        res.is_doubt_word = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new2239(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_single_name = _arg3;
        res.can_has_latin_name = _arg4;
        res.profile = _arg5;
        return res;
    }
    
    static _new2240(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.can_has_single_name = _arg4;
        res.can_has_latin_name = _arg5;
        res.is_doubt_word = _arg6;
        return res;
    }
    
    static _new2241(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.coeff = _arg3;
        res.can_has_single_name = _arg4;
        return res;
    }
    
    static _new2242(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.coeff = _arg4;
        res.can_has_single_name = _arg5;
        return res;
    }
    
    static _new2252(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_single_name = _arg5;
        return res;
    }
    
    static _new2253(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        return res;
    }
    
    static _new2254(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.acronym = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        res.can_be_single_geo = _arg7;
        return res;
    }
    
    static _new2255(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        res.acronym = _arg5;
        res.can_has_latin_name = _arg6;
        res.can_has_single_name = _arg7;
        res.can_be_single_geo = _arg8;
        return res;
    }
    
    static _new2262(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_single_name = _arg5;
        res.must_has_capital_name = _arg6;
        return res;
    }
    
    static _new2263(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_single_name = _arg5;
        res.must_has_capital_name = _arg6;
        return res;
    }
    
    static _new2264(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.coeff = _arg4;
        res.can_has_latin_name = _arg5;
        return res;
    }
    
    static _new2265(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1, _arg2, _arg3);
        res.typ = _arg4;
        res.coeff = _arg5;
        res.can_has_latin_name = _arg6;
        return res;
    }
    
    static _new2270(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1, _arg2, _arg3);
        res.typ = _arg4;
        res.coeff = _arg5;
        res.can_has_latin_name = _arg6;
        res.acronym = _arg7;
        return res;
    }
    
    static _new2271(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.can_has_latin_name = _arg3;
        res.can_has_single_name = _arg4;
        res.must_has_capital_name = _arg5;
        res.can_has_number = _arg6;
        return res;
    }
    
    static _new2272(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_single_name = _arg5;
        res.must_has_capital_name = _arg6;
        res.can_has_number = _arg7;
        return res;
    }
    
    static _new2273(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_single_name = _arg5;
        res.must_has_capital_name = _arg6;
        res.profile = _arg7;
        return res;
    }
    
    static _new2274(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        res.must_has_capital_name = _arg7;
        res.profile = _arg8;
        return res;
    }
    
    static _new2278(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.lang = _arg2;
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        res.must_has_capital_name = _arg7;
        return res;
    }
    
    static _new2279(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.acronym = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        res.must_has_capital_name = _arg7;
        return res;
    }
    
    static _new2281(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_single_name = _arg5;
        res.must_has_capital_name = _arg6;
        res.can_has_number = _arg7;
        return res;
    }
    
    static _new2282(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        res.must_has_capital_name = _arg7;
        res.can_has_number = _arg8;
        return res;
    }
    
    static _new2285(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_single_name = _arg5;
        res.can_be_single_geo = _arg6;
        return res;
    }
    
    static _new2286(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        res.can_be_single_geo = _arg7;
        return res;
    }
    
    static _new2292(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.acronym = _arg3;
        res.typ = _arg4;
        res.can_has_latin_name = _arg5;
        res.can_has_single_name = _arg6;
        res.can_has_number = _arg7;
        return res;
    }
    
    static _new2297(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2);
        res.coeff = _arg3;
        res.typ = _arg4;
        res.can_has_latin_name = _arg5;
        return res;
    }
    
    static _new2298(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.typ = _arg3;
        res.can_has_latin_name = _arg4;
        res.can_has_number = _arg5;
        res.profile = _arg6;
        return res;
    }
    
    static _new2302(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTermin(_arg1);
        res.coeff = _arg2;
        res.can_be_normal_dep = _arg3;
        res.typ = _arg4;
        res.can_has_number = _arg5;
        res.can_be_single_geo = _arg6;
        return res;
    }
    
    static _new2315(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTermin(_arg1, _arg2, _arg3);
        res.can_has_latin_name = _arg4;
        res.coeff = _arg5;
        return res;
    }
    
    static _new2320(_arg1, _arg2, _arg3) {
        let res = new OrgItemTermin(_arg1);
        res.can_has_latin_name = _arg2;
        res.coeff = _arg3;
        return res;
    }
    
    static _new2324(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTermin(_arg1);
        res.typ = _arg2;
        res.coeff = _arg3;
        res.can_has_latin_name = _arg4;
        return res;
    }
}


module.exports = OrgItemTermin