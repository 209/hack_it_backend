/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const StringBuilder = require("./../../unisharp/StringBuilder");

const Token = require("./../Token");
const MetaToken = require("./../MetaToken");
const Analyzer = require("./../Analyzer");
const Referent = require("./../Referent");
const GetTextAttr = require("./../core/GetTextAttr");
const MorphNumber = require("./../../morph/MorphNumber");
const NamedEntityKind = require("./NamedEntityKind");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const MetaNamedEntity = require("./internal/MetaNamedEntity");
const ReferentToken = require("./../ReferentToken");
const Termin = require("./../core/Termin");
const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");
const ProcessorService = require("./../ProcessorService");
const MiscHelper = require("./../core/MiscHelper");
const NamedItemToken = require("./internal/NamedItemToken");
const NamedEntityReferent = require("./NamedEntityReferent");
const GeoReferent = require("./../geo/GeoReferent");

/**
 * Анализатор мелких именованных сущностей (планеты, памятники, здания, местоположения, планеты и пр.)
 */
class NamedEntityAnalyzer extends Analyzer {
    
    get name() {
        return NamedEntityAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Мелкие именованные сущности";
    }
    
    get description() {
        return "Планеты, памятники, здания, местоположения, планеты и пр.";
    }
    
    clone() {
        return new NamedEntityAnalyzer();
    }
    
    get type_system() {
        return [MetaNamedEntity.GLOBAL_META];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(NamedEntityKind.MONUMENT.toString(), EpNerCoreInternalResourceHelper.get_bytes("monument.png"));
        res.put(NamedEntityKind.PLANET.toString(), EpNerCoreInternalResourceHelper.get_bytes("planet.png"));
        res.put(NamedEntityKind.LOCATION.toString(), EpNerCoreInternalResourceHelper.get_bytes("location.png"));
        res.put(NamedEntityKind.BUILDING.toString(), EpNerCoreInternalResourceHelper.get_bytes("building.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === NamedEntityReferent.OBJ_TYPENAME) 
            return new NamedEntityReferent();
        return null;
    }
    
    get used_extern_object_types() {
        return [GeoReferent.OBJ_TYPENAME, "ORGANIZATION", "PERSON"];
    }
    
    get progress_weight() {
        return 3;
    }
    
    create_analyzer_data() {
        return new AnalyzerDataWithOntology();
    }
    
    process(kit) {
        let ad = Utils.as(kit.get_analyzer_data(this), AnalyzerDataWithOntology);
        for (let t = kit.first_token; t !== null; t = t.next) {
            let li = NamedItemToken.try_parse_list(t, ad.local_ontology);
            if (li === null || li.length === 0) 
                continue;
            let rt = NamedEntityAnalyzer._try_attach(li);
            if (rt !== null) {
                rt.referent = ad.register_referent(rt.referent);
                kit.embed_token(rt);
                t = rt;
                continue;
            }
        }
    }
    
    process_referent(begin, end) {
        let li = NamedItemToken.try_parse_list(begin, null);
        if (li === null || li.length === 0) 
            return null;
        let rt = NamedEntityAnalyzer._try_attach(li);
        if (rt === null) 
            return null;
        rt.data = begin.kit.get_analyzer_data(this);
        return rt;
    }
    
    static can_be_ref(ki, re) {
        if (re === null) 
            return false;
        if (ki === NamedEntityKind.MONUMENT) {
            if (re.type_name === "PERSON" || re.type_name === "PERSONPROPERTY") 
                return true;
        }
        else if (ki === NamedEntityKind.LOCATION) {
            if (re instanceof GeoReferent) {
                let _geo = Utils.as(re, GeoReferent);
                if (_geo.is_region || _geo.is_state) 
                    return true;
            }
        }
        else if (ki === NamedEntityKind.BUILDING) {
            if (re.type_name === "ORGANIZATION") 
                return true;
        }
        return false;
    }
    
    static _try_attach(toks) {
        let typ = null;
        let re = null;
        let nams = null;
        let ki = NamedEntityKind.UNDEFINED;
        let i = 0;
        for (i = 0; i < toks.length; i++) {
            if (toks[i].type_value !== null) {
                if (nams !== null && toks[i].name_value !== null) 
                    break;
                if (typ === null) {
                    typ = toks[i];
                    ki = typ.kind;
                }
                else if (typ.kind !== toks[i].kind) 
                    break;
            }
            if (toks[i].name_value !== null) {
                if (typ !== null && toks[i].kind !== NamedEntityKind.UNDEFINED && toks[i].kind !== typ.kind) 
                    break;
                if (nams === null) 
                    nams = new Array();
                else if (nams[0].is_wellknown !== toks[i].is_wellknown) 
                    break;
                if (ki === NamedEntityKind.UNDEFINED) 
                    ki = toks[i].kind;
                nams.push(toks[i]);
            }
            if (toks[i].type_value === null && toks[i].name_value === null) 
                break;
            if (re === null && NamedEntityAnalyzer.can_be_ref(ki, toks[i].ref)) 
                re = toks[i];
        }
        if ((i < toks.length) && toks[i].ref !== null) {
            if (NamedEntityAnalyzer.can_be_ref(ki, toks[i].ref)) {
                re = toks[i];
                i++;
            }
        }
        let ok = false;
        if (typ !== null) {
            if (nams === null) {
                if (re === null) 
                    ok = false;
                else 
                    ok = true;
            }
            else if ((nams[0].begin_char < typ.end_char) && !nams[0].is_wellknown) {
                if (re !== null) 
                    ok = true;
                else if ((nams[0].chars.is_capital_upper && !MiscHelper.can_be_start_of_sentence(nams[0].begin_token) && typ.morph.number !== MorphNumber.PLURAL) && typ.morph._case.is_nominative) 
                    ok = true;
            }
            else 
                ok = true;
        }
        else if (nams !== null) {
            if (nams.length === 1 && nams[0].chars.is_all_lower) {
            }
            else if (nams[0].is_wellknown) 
                ok = true;
        }
        if (!ok || ki === NamedEntityKind.UNDEFINED) 
            return null;
        let nam = NamedEntityReferent._new1756(ki);
        if (typ !== null) 
            nam.add_slot(NamedEntityReferent.ATTR_TYPE, typ.type_value.toLowerCase(), false, 0);
        if (nams !== null) {
            if (nams.length === 1 && nams[0].is_wellknown && nams[0].type_value !== null) 
                nam.add_slot(NamedEntityReferent.ATTR_TYPE, nams[0].type_value.toLowerCase(), false, 0);
            if (typ !== null && (typ.end_char < nams[0].begin_char)) {
                let str = MiscHelper.get_text_value(nams[0].begin_token, nams[nams.length - 1].end_token, GetTextAttr.NO);
                nam.add_slot(NamedEntityReferent.ATTR_NAME, str, false, 0);
            }
            let tmp = new StringBuilder();
            for (const n of nams) {
                if (tmp.length > 0) 
                    tmp.append(' ');
                tmp.append(n.name_value);
            }
            nam.add_slot(NamedEntityReferent.ATTR_NAME, tmp.toString(), false, 0);
        }
        if (re !== null) 
            nam.add_slot(NamedEntityReferent.ATTR_REF, re.ref, false, 0);
        return new ReferentToken(nam, toks[0].begin_token, toks[i - 1].end_token);
    }
    
    static initialize() {
        if (NamedEntityAnalyzer.m_inited) 
            return;
        NamedEntityAnalyzer.m_inited = true;
        try {
            MetaNamedEntity.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            NamedItemToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        } catch (ex) {
            throw new Error(ex.message);
        }
        ProcessorService.register_analyzer(new NamedEntityAnalyzer());
    }
    
    static static_constructor() {
        NamedEntityAnalyzer.ANALYZER_NAME = "NAMEDENTITY";
        NamedEntityAnalyzer.m_inited = false;
    }
}


NamedEntityAnalyzer.static_constructor();

module.exports = NamedEntityAnalyzer