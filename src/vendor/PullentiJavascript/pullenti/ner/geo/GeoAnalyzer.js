/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");

const NounPhraseParseAttr = require("./../core/NounPhraseParseAttr");
const AddressItemTokenItemType = require("./../address/internal/AddressItemTokenItemType");
const TerminParseAttr = require("./../core/TerminParseAttr");
const GetTextAttr = require("./../core/GetTextAttr");
const StreetItemType = require("./../address/internal/StreetItemType");
const GeoOwnerHelper = require("./internal/GeoOwnerHelper");
const MorphLang = require("./../../morph/MorphLang");
const Termin = require("./../core/Termin");
const NounPhraseHelper = require("./../core/NounPhraseHelper");
const CityItemTokenItemType = require("./internal/CityItemTokenItemType");
const MetaAddress = require("./../address/internal/MetaAddress");
const MetaStreet = require("./../address/internal/MetaStreet");
const ProcessorService = require("./../ProcessorService");
const AddressAnalyzer = require("./../address/AddressAnalyzer");
const IntOntologyItem = require("./../core/IntOntologyItem");
const ReferentEqualType = require("./../ReferentEqualType");
const MetaToken = require("./../MetaToken");
const Referent = require("./../Referent");
const LanguageHelper = require("./../../morph/LanguageHelper");
const Token = require("./../Token");
const MorphGender = require("./../../morph/MorphGender");
const GeoReferent = require("./GeoReferent");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const TextToken = require("./../TextToken");
const MetaGeo = require("./internal/MetaGeo");
const ReferentToken = require("./../ReferentToken");
const MiscHelper = require("./../core/MiscHelper");
const MiscLocationHelper = require("./internal/MiscLocationHelper");
const BracketHelper = require("./../core/BracketHelper");
const AddressItemToken = require("./../address/internal/AddressItemToken");
const StreetItemToken = require("./../address/internal/StreetItemToken");
const TerrItemToken = require("./internal/TerrItemToken");
const CityItemToken = require("./internal/CityItemToken");
const CityAttachHelper = require("./internal/CityAttachHelper");
const AnalyzerData = require("./../core/AnalyzerData");
const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");
const TerrAttachHelper = require("./internal/TerrAttachHelper");
const Analyzer = require("./../Analyzer");

/**
 * Анализатор стран
 */
class GeoAnalyzer extends Analyzer {
    
    get name() {
        return GeoAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Страны, регионы, города";
    }
    
    clone() {
        return new GeoAnalyzer();
    }
    
    get type_system() {
        return [MetaGeo.global_meta];
    }
    
    get used_extern_object_types() {
        return ["PHONE"];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaGeo.COUNTRY_CITY_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("countrycity.png"));
        res.put(MetaGeo.COUNTRY_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("country.png"));
        res.put(MetaGeo.CITY_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("city.png"));
        res.put(MetaGeo.DISTRICT_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("district.png"));
        res.put(MetaGeo.REGION_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("region.png"));
        res.put(MetaGeo.TERR_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("territory.png"));
        res.put(MetaGeo.UNION_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("union.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === GeoReferent.OBJ_TYPENAME) 
            return new GeoReferent();
        return null;
    }
    
    get progress_weight() {
        return 15;
    }
    
    create_analyzer_data() {
        return new GeoAnalyzer.GeoAnalyzerDataWithOntology();
    }
    
    process(kit) {
        let ad = Utils.as(kit.get_analyzer_data(this), AnalyzerDataWithOntology);
        for (let t = kit.first_token; t !== null; t = t.next) {
            t.inner_bool = false;
        }
        let non_registered = new Array();
        for (let step = 0; step < 2; step++) {
            for (let t = kit.first_token; t !== null; t = t.next) {
                if (ad.referents.length >= 2000) 
                    break;
                if (step > 0 && (t instanceof ReferentToken)) {
                    let _geo = Utils.as(t.get_referent(), GeoReferent);
                    if (((_geo !== null && t.next !== null && t.next.is_char('(')) && t.next.next !== null && _geo.can_be_equals(t.next.next.get_referent(), ReferentEqualType.WITHINONETEXT)) && t.next.next.next !== null && t.next.next.next.is_char(')')) {
                        let rt0 = ReferentToken._new743(_geo, t, t.next.next.next, t.morph);
                        kit.embed_token(rt0);
                        t = rt0;
                        continue;
                    }
                    if ((_geo !== null && t.next !== null && t.next.is_hiphen) && t.next.next !== null && _geo.can_be_equals(t.next.next.get_referent(), ReferentEqualType.WITHINONETEXT)) {
                        let rt0 = ReferentToken._new743(_geo, t, t.next.next, t.morph);
                        kit.embed_token(rt0);
                        t = rt0;
                        continue;
                    }
                }
                let ok = false;
                if (step === 0 || t.inner_bool) 
                    ok = true;
                else if ((t instanceof TextToken) && t.chars.is_letter && !t.chars.is_all_lower) 
                    ok = true;
                let cli = null;
                if (ok) 
                    cli = TerrItemToken.try_parse_list(t, ad.local_ontology, 5);
                if (cli === null) 
                    continue;
                t.inner_bool = true;
                let rt = TerrAttachHelper.try_attach_territory(cli, ad, false, null, non_registered);
                if ((rt === null && cli.length === 1 && cli[0].is_adjective) && cli[0].onto_item !== null) {
                    let tt = cli[0].end_token.next;
                    if (tt !== null) {
                        if (tt.is_char(',')) 
                            tt = tt.next;
                        else if (tt.morph.class0.is_conjunction) {
                            tt = tt.next;
                            if (tt !== null && tt.morph.class0.is_conjunction) 
                                tt = tt.next;
                        }
                        let cli1 = TerrItemToken.try_parse_list(tt, ad.local_ontology, 2);
                        if (cli1 !== null && cli1[0].onto_item !== null) {
                            let g0 = Utils.as(cli[0].onto_item.referent, GeoReferent);
                            let g1 = Utils.as(cli1[0].onto_item.referent, GeoReferent);
                            if ((g0 !== null && g1 !== null && g0.is_region) && g1.is_region) {
                                if (g0.is_city === g1.is_city || g0.is_region === g1.is_region || g0.is_state === g1.is_state) 
                                    rt = TerrAttachHelper.try_attach_territory(cli, ad, true, null, null);
                            }
                        }
                        if (rt === null && (cli[0].onto_item.referent).is_state) {
                            if ((rt === null && tt !== null && (tt.get_referent() instanceof GeoReferent)) && tt.whitespaces_before_count === 1) {
                                let geo2 = Utils.as(tt.get_referent(), GeoReferent);
                                if (GeoOwnerHelper.can_be_higher(Utils.as(cli[0].onto_item.referent, GeoReferent), geo2)) {
                                    let cl = cli[0].onto_item.referent.clone();
                                    cl.occurrence.splice(0, cl.occurrence.length);
                                    rt = ReferentToken._new743(cl, cli[0].begin_token, cli[0].end_token, cli[0].morph);
                                }
                            }
                            if (rt === null && step === 0) {
                                let npt = NounPhraseHelper.try_parse(cli[0].begin_token, NounPhraseParseAttr.NO, 0, null);
                                if (npt !== null && npt.end_char >= tt.begin_char) {
                                    let cits = CityItemToken.try_parse_list(tt, ad.local_ontology, 5);
                                    let rt1 = (cits === null ? null : CityAttachHelper.try_attach_city(cits, ad, false));
                                    if (rt1 !== null) {
                                        rt1.referent = ad.register_referent(rt1.referent);
                                        kit.embed_token(rt1);
                                        let cl = cli[0].onto_item.referent.clone();
                                        cl.occurrence.splice(0, cl.occurrence.length);
                                        rt = ReferentToken._new743(cl, cli[0].begin_token, cli[0].end_token, cli[0].morph);
                                    }
                                }
                            }
                        }
                    }
                }
                if (rt === null) {
                    let cits = this.try_parse_city_list_back(t.previous);
                    if (cits !== null) 
                        rt = TerrAttachHelper.try_attach_territory(cli, ad, false, cits, null);
                }
                if (rt === null && cli.length > 1) {
                    let te = cli[cli.length - 1].end_token.next;
                    if (te !== null) {
                        if (te.morph.class0.is_preposition || te.is_char(',')) 
                            te = te.next;
                    }
                    let li = AddressItemToken.try_parse_list(te, null, 2);
                    if (li !== null && li.length > 0) {
                        if (li[0].typ === AddressItemTokenItemType.STREET || li[0].typ === AddressItemTokenItemType.KILOMETER || li[0].typ === AddressItemTokenItemType.HOUSE) {
                            let ad0 = StreetItemToken.try_parse(cli[0].begin_token.previous, null, false, null, false);
                            if (ad0 !== null && ad0.typ === StreetItemType.NOUN) {
                            }
                            else if (!cli[0].is_adjective) 
                                rt = TerrAttachHelper.try_attach_territory(cli, ad, true, null, null);
                            else {
                                let aaa = AddressItemToken.try_parse(cli[0].begin_token, null, false, false, null);
                                if (aaa !== null && aaa.typ === AddressItemTokenItemType.STREET) {
                                }
                                else 
                                    rt = TerrAttachHelper.try_attach_territory(cli, ad, true, null, null);
                            }
                        }
                    }
                }
                if ((rt === null && cli.length > 2 && cli[0].termin_item === null) && cli[1].termin_item === null && cli[2].termin_item !== null) {
                    let cit = CityItemToken.try_parse_back(cli[0].begin_token.previous);
                    if (cit !== null && cit.typ === CityItemTokenItemType.NOUN) {
                        if (((cli.length > 4 && cli[1].termin_item === null && cli[2].termin_item !== null) && cli[3].termin_item === null && cli[4].termin_item !== null) && cli[2].termin_item.canonic_text.endsWith(cli[4].termin_item.canonic_text)) {
                        }
                        else {
                            cli.splice(0, 1);
                            rt = TerrAttachHelper.try_attach_territory(cli, ad, true, null, null);
                        }
                    }
                }
                if (rt !== null) {
                    let _geo = Utils.as(rt.referent, GeoReferent);
                    if (!_geo.is_city && !_geo.is_state && _geo.find_slot(GeoReferent.ATTR_TYPE, "республика", true) === null) 
                        non_registered.push(_geo);
                    else 
                        rt.referent = ad.register_referent(_geo);
                    kit.embed_token(rt);
                    t = rt;
                    if (step === 0) {
                        let tt = t;
                        while (true) {
                            let rr = this.try_attach_territory_before_city(tt, ad);
                            if (rr === null) 
                                break;
                            _geo = Utils.as(rr.referent, GeoReferent);
                            if (!_geo.is_city && !_geo.is_state) 
                                non_registered.push(_geo);
                            else 
                                rr.referent = ad.register_referent(_geo);
                            kit.embed_token(rr);
                            tt = rr;
                        }
                        if (t.next !== null && ((t.next.is_comma || t.next.is_char('(')))) {
                            let rt1 = TerrAttachHelper.try_attach_stateusaterritory(t.next.next);
                            if (rt1 !== null) {
                                rt1.referent = ad.register_referent(rt1.referent);
                                kit.embed_token(rt1);
                                t = rt1;
                            }
                        }
                    }
                    continue;
                }
            }
            if (step === 0) {
                if (!this.on_progress(1, 4, kit)) 
                    return;
            }
            else {
                if (!this.on_progress(2, 4, kit)) 
                    return;
                if (ad.referents.length === 0 && non_registered.length === 0) 
                    break;
            }
        }
        for (let t = kit.first_token; t !== null; t = (t === null ? null : t.next)) {
            let g = Utils.as(t.get_referent(), GeoReferent);
            if (g === null) 
                continue;
            if (!((t.previous instanceof TextToken))) 
                continue;
            let t0 = null;
            if (t.previous.is_value("СОЮЗ", null)) 
                t0 = t.previous;
            else if (t.previous.is_value("ГОСУДАРСТВО", null) && t.previous.previous !== null && t.previous.previous.is_value("СОЮЗНЫЙ", null)) 
                t0 = t.previous.previous;
            if (t0 === null) 
                continue;
            let npt = NounPhraseHelper.try_parse(t0.previous, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.end_token === t.previous) 
                t0 = t0.previous;
            let uni = new GeoReferent();
            let typ = MiscHelper.get_text_value(t0, t.previous, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
            if (typ === null) 
                continue;
            uni.add_typ_union(t0.kit.base_language);
            uni.add_typ(typ.toLowerCase());
            uni.add_slot(GeoReferent.ATTR_REF, g, false, 0);
            let t1 = t;
            let i = 1;
            for (t = t.next; t !== null; t = t.next) {
                if (t.is_comma_and) 
                    continue;
                if ((((g = Utils.as(t.get_referent(), GeoReferent)))) === null) 
                    break;
                if (uni.find_slot(GeoReferent.ATTR_REF, g, true) !== null) 
                    break;
                if (t.is_newline_before) 
                    break;
                t1 = t;
                uni.add_slot(GeoReferent.ATTR_REF, g, false, 0);
                i++;
            }
            if (i < 2) 
                continue;
            uni = Utils.as(ad.register_referent(uni), GeoReferent);
            let rt = new ReferentToken(uni, t0, t1);
            kit.embed_token(rt);
            t = rt;
        }
        let new_cities = false;
        let is_city_before = false;
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (t.is_char_of(".,")) 
                continue;
            let li = null;
            li = CityItemToken.try_parse_list(t, ad.local_ontology, 5);
            let rt = null;
            if (li !== null) {
                if ((((rt = CityAttachHelper.try_attach_city(li, ad, false)))) !== null) {
                    let tt = t.previous;
                    if (tt !== null && tt.is_comma) 
                        tt = tt.previous;
                    if (tt !== null && (tt.get_referent() instanceof GeoReferent)) {
                        if (tt.get_referent().can_be_equals(rt.referent, ReferentEqualType.WITHINONETEXT)) {
                            rt.begin_token = tt;
                            rt.referent = ad.register_referent(rt.referent);
                            kit.embed_token(rt);
                            t = rt;
                            continue;
                        }
                    }
                    if (ad.referents.length > 2000) 
                        break;
                    rt.referent = Utils.as(ad.register_referent(rt.referent), GeoReferent);
                    kit.embed_token(rt);
                    t = rt;
                    is_city_before = true;
                    new_cities = true;
                    tt = t;
                    while (true) {
                        let rr = this.try_attach_territory_before_city(tt, ad);
                        if (rr === null) 
                            break;
                        let _geo = Utils.as(rr.referent, GeoReferent);
                        if (!_geo.is_city && !_geo.is_state) 
                            non_registered.push(_geo);
                        else 
                            rr.referent = ad.register_referent(_geo);
                        kit.embed_token(rr);
                        tt = rr;
                    }
                    rt = this.try_attach_territory_after_city(t, ad);
                    if (rt !== null) {
                        rt.referent = ad.register_referent(rt.referent);
                        kit.embed_token(rt);
                        t = rt;
                    }
                    continue;
                }
            }
            if (!t.inner_bool) {
                is_city_before = false;
                continue;
            }
            if (!is_city_before) 
                continue;
            let tts = TerrItemToken.try_parse_list(t, ad.local_ontology, 5);
            if (tts !== null && tts.length > 1 && ((tts[0].termin_item !== null || tts[1].termin_item !== null))) {
                if ((((rt = TerrAttachHelper.try_attach_territory(tts, ad, true, null, null)))) !== null) {
                    let _geo = Utils.as(rt.referent, GeoReferent);
                    if (!_geo.is_city && !_geo.is_state) 
                        non_registered.push(_geo);
                    else 
                        rt.referent = ad.register_referent(_geo);
                    kit.embed_token(rt);
                    t = rt;
                    continue;
                }
            }
            is_city_before = false;
        }
        if (new_cities && ad.local_ontology.items.length > 0) {
            for (let t = kit.first_token; t !== null; t = t.next) {
                if (!((t instanceof TextToken))) 
                    continue;
                if (t.chars.is_all_lower) 
                    continue;
                let li = ad.local_ontology.try_attach(t, null, false);
                if (li === null) 
                    continue;
                let mc = t.get_morph_class_in_dictionary();
                if (mc.is_proper_surname || mc.is_proper_name || mc.is_proper_secname) 
                    continue;
                if (t.morph.class0.is_adjective) 
                    continue;
                let _geo = Utils.as(li[0].item.referent, GeoReferent);
                if (_geo !== null) {
                    _geo = Utils.as(_geo.clone(), GeoReferent);
                    _geo.occurrence.splice(0, _geo.occurrence.length);
                    let rt = ReferentToken._new743(_geo, li[0].begin_token, li[0].end_token, t.morph);
                    if (rt.begin_token === rt.end_token) 
                        _geo.add_name((t).term);
                    if (rt.begin_token.previous !== null && rt.begin_token.previous.is_value("СЕЛО", null) && _geo.is_city) {
                        rt.begin_token = rt.begin_token.previous;
                        rt.morph = rt.begin_token.morph;
                        _geo.add_slot(GeoReferent.ATTR_TYPE, "село", true, 0);
                    }
                    kit.embed_token(rt);
                    t = li[0].end_token;
                }
            }
        }
        let go_back = false;
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (go_back) {
                go_back = false;
                if (t.previous !== null) 
                    t = t.previous;
            }
            let _geo = Utils.as(t.get_referent(), GeoReferent);
            if (_geo === null) 
                continue;
            let geo1 = null;
            let tt = t.next;
            let bra = false;
            let comma1 = false;
            let comma2 = false;
            let inp = false;
            let adj = false;
            for (; tt !== null; tt = tt.next) {
                if (tt.is_char_of(",")) {
                    comma1 = true;
                    continue;
                }
                if (tt.is_value("IN", null) || tt.is_value("В", null)) {
                    inp = true;
                    continue;
                }
                if (MiscHelper.is_eng_adj_suffix(tt)) {
                    adj = true;
                    tt = tt.next;
                    continue;
                }
                let det = AddressItemToken.try_attach_detail(tt);
                if (det !== null) {
                    tt = det.end_token;
                    comma1 = true;
                    continue;
                }
                if (tt.morph.class0.is_preposition) 
                    continue;
                if (tt.is_char('(') && tt === t.next) {
                    bra = true;
                    continue;
                }
                if ((tt instanceof TextToken) && BracketHelper.is_bracket(tt, true)) 
                    continue;
                geo1 = Utils.as(tt.get_referent(), GeoReferent);
                break;
            }
            if (geo1 === null) 
                continue;
            if (tt.whitespaces_before_count > 15) 
                continue;
            let ttt = tt.next;
            let geo2 = null;
            for (; ttt !== null; ttt = ttt.next) {
                if (ttt.is_comma_and) {
                    comma2 = true;
                    continue;
                }
                let det = AddressItemToken.try_attach_detail(ttt);
                if (det !== null) {
                    ttt = det.end_token;
                    comma2 = true;
                    continue;
                }
                if (ttt.morph.class0.is_preposition) 
                    continue;
                geo2 = Utils.as(ttt.get_referent(), GeoReferent);
                break;
            }
            if (ttt !== null && ttt.whitespaces_before_count > 15) 
                geo2 = null;
            if (geo2 !== null) {
                if ((comma1 && comma2 && GeoOwnerHelper.can_be_higher_token(t, tt)) && GeoOwnerHelper.can_be_higher_token(tt, ttt)) {
                    geo2.higher = geo1;
                    geo1.higher = _geo;
                    let rt = ReferentToken._new743(geo2, t, ttt, ttt.morph);
                    kit.embed_token(rt);
                    t = rt;
                    go_back = true;
                    continue;
                }
                else if (GeoOwnerHelper.can_be_higher_token(ttt, tt)) {
                    if (GeoOwnerHelper.can_be_higher_token(t, ttt)) {
                        geo2.higher = _geo;
                        geo1.higher = geo2;
                        let rt = ReferentToken._new743(geo1, t, ttt, t.morph);
                        kit.embed_token(rt);
                        t = rt;
                        go_back = true;
                        continue;
                    }
                    if (GeoOwnerHelper.can_be_higher_token(ttt, t) && GeoOwnerHelper.can_be_higher_token(t, tt)) {
                        _geo.higher = geo2;
                        geo1.higher = _geo;
                        let rt = ReferentToken._new743(geo1, t, ttt, tt.morph);
                        kit.embed_token(rt);
                        t = rt;
                        go_back = true;
                        continue;
                    }
                    if (GeoOwnerHelper.can_be_higher_token(tt, t)) {
                        _geo.higher = geo1;
                        geo1.higher = geo2;
                        let rt = ReferentToken._new743(_geo, t, ttt, t.morph);
                        kit.embed_token(rt);
                        t = rt;
                        go_back = true;
                        continue;
                    }
                }
                if (comma2) 
                    continue;
            }
            if (GeoOwnerHelper.can_be_higher_token(t, tt) && ((!GeoOwnerHelper.can_be_higher_token(tt, t) || adj))) {
                geo1.higher = _geo;
                let rt = ReferentToken._new743(geo1, t, tt, tt.morph);
                if ((geo1.is_city && !_geo.is_city && t.previous !== null) && t.previous.is_value("СТОЛИЦА", "СТОЛИЦЯ")) {
                    rt.begin_token = t.previous;
                    rt.morph = t.previous.morph;
                }
                kit.embed_token(rt);
                t = rt;
                go_back = true;
                continue;
            }
            if (GeoOwnerHelper.can_be_higher_token(tt, t) && ((!GeoOwnerHelper.can_be_higher_token(t, tt) || inp))) {
                if (_geo.higher === null) 
                    _geo.higher = geo1;
                else if (geo1.higher === null && GeoOwnerHelper.can_be_higher(_geo.higher, geo1) && !GeoOwnerHelper.can_be_higher(geo1, _geo.higher)) {
                    geo1.higher = _geo.higher;
                    _geo.higher = geo1;
                }
                else 
                    _geo.higher = geo1;
                if (bra && tt.next !== null && tt.next.is_char(')')) 
                    tt = tt.next;
                let rt = ReferentToken._new743(_geo, t, tt, t.morph);
                kit.embed_token(rt);
                t = rt;
                go_back = true;
                continue;
            }
            if ((!tt.morph.class0.is_adjective && !t.morph.class0.is_adjective && tt.chars.is_cyrillic_letter) && t.chars.is_cyrillic_letter && !tt.morph._case.is_instrumental) {
                for (let geo0 = _geo; geo0 !== null; geo0 = geo0.higher) {
                    if (GeoOwnerHelper.can_be_higher(geo1, geo0)) {
                        geo0.higher = geo1;
                        let rt = ReferentToken._new743(_geo, t, tt, t.morph);
                        kit.embed_token(rt);
                        t = rt;
                        go_back = true;
                        break;
                    }
                }
            }
        }
        if (non_registered.length === 0) 
            return;
        for (let k = 0; k < non_registered.length; k++) {
            let ch = false;
            for (let i = 0; i < (non_registered.length - 1); i++) {
                if (GeoAnalyzer.geo_comp(non_registered[i], non_registered[i + 1]) > 0) {
                    ch = true;
                    let v = non_registered[i];
                    non_registered[i] = non_registered[i + 1];
                    non_registered[i + 1] = v;
                }
            }
            if (!ch) 
                break;
        }
        for (const g of non_registered) {
            g.tag = null;
        }
        for (const ng of non_registered) {
            for (const s of ng.slots) {
                if (s.value instanceof GeoReferent) {
                    if ((s.value).tag instanceof GeoReferent) 
                        ng.upload_slot(s, Utils.as((s.value).tag, GeoReferent));
                }
            }
            let rg = Utils.as(ad.register_referent(ng), GeoReferent);
            if (rg === ng) 
                continue;
            ng.tag = rg;
            for (const oc of ng.occurrence) {
                oc.occurence_of = rg;
                rg.add_occurence(oc);
            }
        }
        for (let t = kit.first_token; t !== null; t = t.next) {
            let _geo = Utils.as(t.get_referent(), GeoReferent);
            if (_geo === null) 
                continue;
            GeoAnalyzer._replace_terrs(Utils.as(t, ReferentToken));
        }
    }
    
    static _replace_terrs(mt) {
        if (mt === null) 
            return;
        let _geo = Utils.as(mt.referent, GeoReferent);
        if (_geo !== null && (_geo.tag instanceof GeoReferent)) 
            mt.referent = Utils.as(_geo.tag, GeoReferent);
        if (_geo !== null) {
            for (const s of _geo.slots) {
                if (s.value instanceof GeoReferent) {
                    let g = Utils.as(s.value, GeoReferent);
                    if (g.tag instanceof GeoReferent) 
                        _geo.upload_slot(s, g.tag);
                }
            }
        }
        for (let t = mt.begin_token; t !== null; t = t.next) {
            if (t.end_char > mt.end_token.end_char) 
                break;
            else {
                if (t instanceof ReferentToken) 
                    GeoAnalyzer._replace_terrs(Utils.as(t, ReferentToken));
                if (t === mt.end_token) 
                    break;
            }
        }
    }
    
    static geo_comp(x, y) {
        let xcou = 0;
        for (let g = x.higher; g !== null; g = g.higher) {
            xcou++;
        }
        let ycou = 0;
        for (let g = y.higher; g !== null; g = g.higher) {
            ycou++;
        }
        if (xcou < ycou) 
            return -1;
        if (xcou > ycou) 
            return 1;
        return Utils.compareStrings(x.to_string(true, MorphLang.UNKNOWN, 0), y.to_string(true, MorphLang.UNKNOWN, 0), false);
    }
    
    try_parse_city_list_back(t) {
        if (t === null) 
            return null;
        while (t !== null && ((t.morph.class0.is_preposition || t.is_char_of(",.") || t.morph.class0.is_conjunction))) {
            t = t.previous;
        }
        if (t === null) 
            return null;
        let res = null;
        for (let tt = t; tt !== null; tt = tt.previous) {
            if (!((tt instanceof TextToken))) 
                break;
            if (tt.previous !== null && tt.previous.is_hiphen && (tt.previous.previous instanceof TextToken)) {
                if (!tt.is_whitespace_before && !tt.previous.is_whitespace_before) 
                    tt = tt.previous.previous;
            }
            let ci = CityItemToken.try_parse_list(tt, null, 5);
            if (ci === null && tt.previous !== null) 
                ci = CityItemToken.try_parse_list(tt.previous, null, 5);
            if (ci === null) 
                break;
            if (ci[ci.length - 1].end_token === t) 
                res = ci;
        }
        if (res !== null) 
            res.reverse();
        return res;
    }
    
    try_attach_territory_before_city(t, ad) {
        if (t instanceof ReferentToken) 
            t = t.previous;
        for (; t !== null; t = t.previous) {
            if (!t.is_char_of(",.") && !t.morph.class0.is_preposition) 
                break;
        }
        if (t === null) 
            return null;
        let i = 0;
        let res = null;
        for (let tt = t; tt !== null; tt = tt.previous) {
            i++;
            if (tt.is_newline_after && !tt.inner_bool) 
                break;
            if (i > 10) 
                break;
            let tits0 = TerrItemToken.try_parse_list(tt, ad.local_ontology, 5);
            if (tits0 === null) 
                continue;
            if (tits0[tits0.length - 1].end_token !== t) 
                break;
            let tits1 = TerrItemToken.try_parse_list(tt.previous, ad.local_ontology, 5);
            if (tits1 !== null && tits1[tits1.length - 1].end_token === t && tits1.length === tits0.length) 
                tits0 = tits1;
            let rr = TerrAttachHelper.try_attach_territory(tits0, ad, false, null, null);
            if (rr !== null) 
                res = rr;
        }
        return res;
    }
    
    try_attach_territory_after_city(t, ad) {
        if (t === null) 
            return null;
        let city = Utils.as(t.get_referent(), GeoReferent);
        if (city === null) 
            return null;
        if (!city.is_city) 
            return null;
        if (t.next === null || !t.next.is_comma || t.next.whitespaces_after_count > 1) 
            return null;
        let tt = t.next.next;
        if (tt === null || !tt.chars.is_capital_upper || !((tt instanceof TextToken))) 
            return null;
        if (tt.chars.is_latin_letter) {
            let re1 = TerrAttachHelper.try_attach_stateusaterritory(tt);
            if (re1 !== null) 
                return re1;
        }
        let t0 = tt;
        let t1 = tt;
        for (let i = 0; i < 2; i++) {
            let tit0 = TerrItemToken.try_parse(tt, ad.local_ontology, false, false, null);
            if (tit0 === null || tit0.termin_item !== null) {
                if (i === 0) 
                    return null;
            }
            let cit0 = CityItemToken.try_parse(tt, ad.local_ontology, false, null);
            if (cit0 === null || cit0.typ === CityItemTokenItemType.NOUN) {
                if (i === 0) 
                    return null;
            }
            let ait0 = AddressItemToken.try_parse(tt, null, false, false, null);
            if (ait0 !== null) 
                return null;
            if (tit0 === null) {
                if (!tt.chars.is_cyrillic_letter) 
                    return null;
                let cla = tt.get_morph_class_in_dictionary();
                if (!cla.is_noun && !cla.is_adjective) 
                    return null;
                t1 = tt;
            }
            else 
                t1 = (tt = tit0.end_token);
            if (tt.next === null) 
                return null;
            if (tt.next.is_comma) {
                tt = tt.next.next;
                break;
            }
            if (i > 0) 
                return null;
            tt = tt.next;
        }
        let ait = AddressItemToken.try_parse(tt, null, false, false, null);
        if (ait === null) 
            return null;
        if (ait.typ !== AddressItemTokenItemType.STREET || ait.ref_token !== null) 
            return null;
        let reg = new GeoReferent();
        reg.add_typ("муниципальный район");
        reg.add_name(MiscHelper.get_text_value(t0, t1, GetTextAttr.NO));
        return new ReferentToken(reg, t0, t1);
    }
    
    /**
     * Это привязка стран к прилагательным (например, "французский лидер")
     * @param begin 
     * @param end 
     * @return 
     */
    process_referent(begin, end) {
        if (!((begin instanceof TextToken))) 
            return null;
        if (begin.kit.recurse_level > 3) 
            return null;
        begin.kit.recurse_level++;
        let toks = CityItemToken.M_CITY_ADJECTIVES.try_parse_all(begin, TerminParseAttr.FULLWORDSONLY, 0);
        begin.kit.recurse_level--;
        if (toks !== null) {
            for (const tok of toks) {
                let cit = Utils.as(tok.termin.tag, IntOntologyItem);
                if (cit === null) 
                    continue;
                let city = new GeoReferent();
                city.add_name(cit.canonic_text);
                city.add_typ_city(begin.kit.base_language);
                return ReferentToken._new1268(city, tok.begin_token, tok.end_token, tok.morph, begin.kit.get_analyzer_data(this));
            }
            return null;
        }
        let ad = Utils.as(begin.kit.get_analyzer_data(this), AnalyzerDataWithOntology);
        if (!begin.morph.class0.is_adjective) {
            let te = Utils.as(begin, TextToken);
            if ((te.chars.is_all_upper && te.chars.is_cyrillic_letter && te.length_char === 2) && te.get_morph_class_in_dictionary().is_undefined) {
                let abbr = te.term;
                let geo0 = null;
                let cou = 0;
                for (const t of ad.local_ontology.items) {
                    let _geo = Utils.as(t.referent, GeoReferent);
                    if (_geo === null) 
                        continue;
                    if (!_geo.is_region && !_geo.is_state) 
                        continue;
                    if (_geo.check_abbr(abbr)) {
                        cou++;
                        geo0 = _geo;
                    }
                }
                if (cou === 1) 
                    return ReferentToken._new116(geo0, begin, begin, ad);
            }
            let tt0 = TerrItemToken.try_parse(begin, ad.local_ontology, true, false, null);
            if (tt0 !== null && tt0.termin_item !== null && tt0.termin_item.canonic_text === "РАЙОН") {
                let tt1 = TerrItemToken.try_parse(tt0.end_token.next, ad.local_ontology, true, false, null);
                if ((tt1 !== null && tt1.chars.is_capital_upper && tt1.termin_item === null) && tt1.onto_item === null) {
                    let li = new Array();
                    li.push(tt0);
                    li.push(tt1);
                    let res = TerrAttachHelper.try_attach_territory(li, ad, true, null, null);
                    if (res === null) 
                        return null;
                    res.morph = begin.morph;
                    res.data = ad;
                    return res;
                }
            }
            begin.kit.recurse_level++;
            let ctoks = CityItemToken.try_parse_list(begin, null, 3);
            if (ctoks === null && begin.morph.class0.is_preposition) 
                ctoks = CityItemToken.try_parse_list(begin.next, null, 3);
            begin.kit.recurse_level--;
            if (ctoks !== null) {
                if (((ctoks.length === 2 && ctoks[0].typ === CityItemTokenItemType.NOUN && ctoks[1].typ === CityItemTokenItemType.PROPERNAME)) || ((ctoks.length === 1 && ctoks[0].typ === CityItemTokenItemType.CITY))) {
                    if (ctoks.length === 1 && ctoks[0].begin_token.get_morph_class_in_dictionary().is_proper_surname) {
                        begin.kit.recurse_level++;
                        let kk = begin.kit.process_referent("PERSON", ctoks[0].begin_token);
                        begin.kit.recurse_level--;
                        if (kk !== null) 
                            return null;
                    }
                    let res = CityAttachHelper.try_attach_city(ctoks, ad, true);
                    if (res !== null) {
                        res.data = ad;
                        return res;
                    }
                }
            }
            if ((ctoks !== null && ctoks.length === 1 && ctoks[0].typ === CityItemTokenItemType.NOUN) && ctoks[0].value === "ГОРОД") {
                let cou = 0;
                for (let t = begin.previous; t !== null; t = t.previous) {
                    if ((++cou) > 500) 
                        break;
                    if (!((t instanceof ReferentToken))) 
                        continue;
                    let geos = t.get_referents();
                    if (geos === null) 
                        continue;
                    for (const g of geos) {
                        let gg = Utils.as(g, GeoReferent);
                        if (gg !== null) {
                            if (gg.is_city) 
                                return ReferentToken._new1268(gg, begin, ctoks[0].end_token, ctoks[0].morph, ad);
                            if (gg.higher !== null && gg.higher.is_city) 
                                return ReferentToken._new1268(gg.higher, begin, ctoks[0].end_token, ctoks[0].morph, ad);
                        }
                    }
                }
            }
            if (tt0 !== null && tt0.onto_item !== null) {
            }
            else 
                return null;
        }
        begin.kit.recurse_level++;
        let tt = TerrItemToken.try_parse(begin, ad.local_ontology, true, false, null);
        begin.kit.recurse_level--;
        if (tt === null || tt.onto_item === null) {
            let tok = TerrItemToken.m_terr_ontology.try_attach(begin, null, false);
            if ((tok !== null && tok[0].item !== null && (tok[0].item.referent instanceof GeoReferent)) && (tok[0].item.referent).is_state) 
                tt = TerrItemToken._new1174(tok[0].begin_token, tok[0].end_token, tok[0].item);
        }
        if (tt === null) 
            return null;
        if (tt.onto_item !== null) {
            let li = new Array();
            li.push(tt);
            let res = TerrAttachHelper.try_attach_territory(li, ad, true, null, null);
            if (res === null) 
                tt.onto_item = null;
            else {
                if (res.begin_token === res.end_token) {
                    let mc = res.begin_token.get_morph_class_in_dictionary();
                    if (mc.is_adjective) {
                        let _geo = Utils.as(tt.onto_item.referent, GeoReferent);
                        if (_geo.is_city || _geo.is_state) {
                        }
                        else if (_geo.find_slot(GeoReferent.ATTR_TYPE, "федеральный округ", true) !== null) 
                            return null;
                    }
                }
                res.data = ad;
                return res;
            }
        }
        if (!tt.is_adjective) 
            return null;
        if (tt.onto_item === null) {
            let t1 = tt.end_token.next;
            if (t1 === null) 
                return null;
            begin.kit.recurse_level++;
            let ttyp = TerrItemToken.try_parse(t1, ad.local_ontology, true, true, null);
            begin.kit.recurse_level--;
            if (ttyp === null || ttyp.termin_item === null) {
                let cits = CityItemToken.try_parse_list(begin, null, 2);
                if (cits !== null && cits[0].typ === CityItemTokenItemType.CITY) 
                    return CityAttachHelper.try_attach_city(cits, ad, true);
                return null;
            }
            if (t1.get_morph_class_in_dictionary().is_adjective) 
                return null;
            let li = new Array();
            li.push(tt);
            li.push(ttyp);
            let res = TerrAttachHelper.try_attach_territory(li, ad, true, null, null);
            if (res === null) 
                return null;
            res.morph = ttyp.morph;
            res.data = ad;
            return res;
        }
        return null;
    }
    
    process_citizen(begin) {
        if (!((begin instanceof TextToken))) 
            return null;
        let tok = TerrItemToken.m_mans_by_state.try_parse(begin, TerminParseAttr.FULLWORDSONLY);
        if (tok !== null) 
            tok.morph.gender = tok.termin.gender;
        if (tok === null) 
            return null;
        let geo0 = Utils.as(tok.termin.tag, GeoReferent);
        if (geo0 === null) 
            return null;
        let _geo = new GeoReferent();
        _geo.merge_slots2(geo0, begin.kit.base_language);
        let res = new ReferentToken(_geo, tok.begin_token, tok.end_token);
        res.morph = tok.morph;
        let ad = Utils.as(begin.kit.get_analyzer_data(this), AnalyzerDataWithOntology);
        res.data = ad;
        return res;
    }
    
    process_ontology_item(begin) {
        let li = CityItemToken.try_parse_list(begin, null, 4);
        if (li !== null && li.length > 1 && li[0].typ === CityItemTokenItemType.NOUN) {
            let rt = CityAttachHelper.try_attach_city(li, null, true);
            if (rt === null) 
                return null;
            let city = Utils.as(rt.referent, GeoReferent);
            for (let t = rt.end_token.next; t !== null; t = t.next) {
                if (!t.is_char(';')) 
                    continue;
                t = t.next;
                if (t === null) 
                    break;
                li = CityItemToken.try_parse_list(t, null, 4);
                let rt1 = CityAttachHelper.try_attach_city(li, null, false);
                if (rt1 !== null) {
                    t = rt.end_token = rt1.end_token;
                    city.merge_slots2(rt1.referent, begin.kit.base_language);
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
                            city.add_name(str);
                        t = rt.end_token = tt;
                    }
                }
            }
            return rt;
        }
        let typ = null;
        let terr = null;
        let te = null;
        for (let t = begin; t !== null; t = t.next) {
            let t0 = t;
            let t1 = null;
            let tn0 = null;
            let tn1 = null;
            for (let tt = t0; tt !== null; tt = tt.next) {
                if (tt.is_char_of(";")) 
                    break;
                let tit = TerrItemToken.try_parse(tt, null, false, false, null);
                if (tit !== null && tit.termin_item !== null) {
                    if (!tit.is_adjective) {
                        if (typ === null) 
                            typ = tit.termin_item.canonic_text;
                        tt = tit.end_token;
                        t1 = tt;
                        continue;
                    }
                }
                else if (tit !== null && tit.onto_item !== null) {
                }
                if (tn0 === null) 
                    tn0 = tt;
                if (tit !== null) 
                    tt = tit.end_token;
                t1 = (tn1 = tt);
            }
            if (t1 === null) 
                continue;
            if (terr === null) 
                terr = new GeoReferent();
            if (tn0 !== null) 
                terr.add_name(MiscHelper.get_text_value(tn0, tn1, GetTextAttr.NO));
            t = (te = t1);
        }
        if (terr === null || te === null) 
            return null;
        if (typ !== null) 
            terr.add_typ(typ);
        if (!terr.is_city && !terr.is_region && !terr.is_state) 
            terr.add_typ_reg(begin.kit.base_language);
        return new ReferentToken(terr, begin, te);
    }
    
    /**
     * Получить список всех стран из внутреннего словаря
     * @return 
     */
    static get_all_countries() {
        return TerrItemToken.m_all_states;
    }
    
    static initialize() {
        if (GeoAnalyzer.m_initialized) 
            return;
        GeoAnalyzer.m_initialized = true;
        MetaGeo.initialize();
        MetaAddress.initialize();
        MetaStreet.initialize();
        try {
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            MiscLocationHelper.initialize();
            TerrItemToken.initialize();
            CityItemToken.initialize();
            AddressAnalyzer.initialize();
        } catch (ex) {
            throw new Error(ex.message);
        }
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        ProcessorService.register_analyzer(new GeoAnalyzer());
    }
    
    static static_constructor() {
        GeoAnalyzer.ANALYZER_NAME = "GEO";
        GeoAnalyzer.m_initialized = false;
    }
}


GeoAnalyzer.GeoAnalyzerDataWithOntology = class  extends AnalyzerDataWithOntology {
    
    register_referent(referent) {
        const GeoReferent = require("./GeoReferent");
        const MorphGender = require("./../../morph/MorphGender");
        const Referent = require("./../Referent");
        const LanguageHelper = require("./../../morph/LanguageHelper");
        let g = Utils.as(referent, GeoReferent);
        if (g !== null) {
            if (g.is_state) {
            }
            else if (g.is_region || ((g.is_city && !g.is_big_city))) {
                let names = new Array();
                let gen = MorphGender.UNDEFINED;
                let bas_nam = null;
                for (const s of g.slots) {
                    if (s.type_name === GeoReferent.ATTR_NAME) 
                        names.push(Utils.asString(s.value));
                    else if (s.type_name === GeoReferent.ATTR_TYPE) {
                        let typ = Utils.asString(s.value);
                        if (LanguageHelper.ends_with_ex(typ, "район", "край", "округ", "улус")) 
                            gen = MorphGender.of((gen.value()) | (MorphGender.MASCULINE.value()));
                        else if (LanguageHelper.ends_with_ex(typ, "область", "территория", null, null)) 
                            gen = MorphGender.of((gen.value()) | (MorphGender.FEMINIE.value()));
                    }
                }
                for (let i = 0; i < names.length; i++) {
                    let n = names[i];
                    let ii = n.indexOf(' ');
                    if (ii > 0) {
                        if (g.get_slot_value(GeoReferent.ATTR_REF) instanceof Referent) 
                            continue;
                        let nn = (n.substring(ii + 1) + " " + n.substring(0, 0 + ii));
                        if (!names.includes(nn)) {
                            names.push(nn);
                            g.add_slot(GeoReferent.ATTR_NAME, nn, false, 0);
                            continue;
                        }
                        continue;
                    }
                    for (const end of GeoAnalyzer.GeoAnalyzerDataWithOntology.ends) {
                        if (LanguageHelper.ends_with(n, end)) {
                            let nn = n.substring(0, 0 + n.length - 3);
                            for (const end2 of GeoAnalyzer.GeoAnalyzerDataWithOntology.ends) {
                                if (end2 !== end) {
                                    if (!names.includes(nn + end2)) {
                                        names.push(nn + end2);
                                        g.add_slot(GeoReferent.ATTR_NAME, nn + end2, false, 0);
                                    }
                                }
                            }
                            if (gen === MorphGender.MASCULINE) {
                                for (const na of names) {
                                    if (LanguageHelper.ends_with(na, "ИЙ")) 
                                        bas_nam = na;
                                }
                            }
                            else if (gen === MorphGender.FEMINIE) {
                                for (const na of names) {
                                    if (LanguageHelper.ends_with(na, "АЯ")) 
                                        bas_nam = na;
                                }
                            }
                            else if (gen === MorphGender.NEUTER) {
                                for (const na of names) {
                                    if (LanguageHelper.ends_with(na, "ОЕ")) 
                                        bas_nam = na;
                                }
                            }
                            break;
                        }
                    }
                }
                if (bas_nam !== null && names.length > 0 && names[0] !== bas_nam) {
                    let sl = g.find_slot(GeoReferent.ATTR_NAME, bas_nam, true);
                    if (sl !== null) {
                        Utils.removeItem(g.slots, sl);
                        g.slots.splice(0, 0, sl);
                    }
                }
            }
        }
        return super.register_referent(referent);
    }
    
    static static_constructor() {
        GeoAnalyzer.GeoAnalyzerDataWithOntology.ends = ["КИЙ", "КОЕ", "КАЯ"];
    }
}


GeoAnalyzer.GeoAnalyzerDataWithOntology.static_constructor();

GeoAnalyzer.static_constructor();

module.exports = GeoAnalyzer