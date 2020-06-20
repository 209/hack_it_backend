/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../../unisharp/StringBuilder");
const Stream = require("./../../../unisharp/Stream");
const MemoryStream = require("./../../../unisharp/MemoryStream");
const XmlDocument = require("./../../../unisharp/XmlDocument");

const MorphCase = require("./../../../morph/MorphCase");
const GetTextAttr = require("./../../core/GetTextAttr");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const MiscHelper = require("./../../core/MiscHelper");
const Analyzer = require("./../../Analyzer");
const PersonItemTokenItemType = require("./PersonItemTokenItemType");
const MorphClass = require("./../../../morph/MorphClass");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const PersonItemTokenParseAttr = require("./PersonItemTokenParseAttr");
const PersonAttrTokenPersonAttrAttachAttrs = require("./PersonAttrTokenPersonAttrAttachAttrs");
const PersonReferent = require("./../PersonReferent");
const MailLineTypes = require("./../../mail/internal/MailLineTypes");
const CharsInfo = require("./../../../morph/CharsInfo");
const Token = require("./../../Token");
const Morphology = require("./../../../morph/Morphology");
const MorphCollection = require("./../../MorphCollection");
const TerminCollection = require("./../../core/TerminCollection");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const BracketHelper = require("./../../core/BracketHelper");
const TerminToken = require("./../../core/TerminToken");
const NumberHelper = require("./../../core/NumberHelper");
const GeoOwnerHelper = require("./../../geo/internal/GeoOwnerHelper");
const MorphLang = require("./../../../morph/MorphLang");
const PersonAttrTerminType = require("./PersonAttrTerminType");
const PersonAttrTermin = require("./PersonAttrTermin");
const MorphGender = require("./../../../morph/MorphGender");
const MorphWordForm = require("./../../../morph/MorphWordForm");
const EpNerPersonInternalResourceHelper = require("./EpNerPersonInternalResourceHelper");
const PersonAttrTerminType2 = require("./PersonAttrTerminType2");
const PersonPropertyReferent = require("./../PersonPropertyReferent");
const ReferentToken = require("./../../ReferentToken");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const GeoReferent = require("./../../geo/GeoReferent");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const TextToken = require("./../../TextToken");
const Termin = require("./../../core/Termin");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const PersonItemToken = require("./PersonItemToken");
const PersonPropertyKind = require("./../PersonPropertyKind");
const NumberToken = require("./../../NumberToken");
const GeoAnalyzer = require("./../../geo/GeoAnalyzer");
const MailLine = require("./../../mail/internal/MailLine");
const MorphSerializeHelper = require("./../../../morph/internal/MorphSerializeHelper");
const Referent = require("./../../Referent");
const MorphNumber = require("./../../../morph/MorphNumber");
const PersonAnalyzer = require("./../PersonAnalyzer");

class PersonAttrToken extends ReferentToken {
    
    static initialize() {
        if (PersonAttrToken.m_termins !== null) 
            return;
        let t = null;
        PersonAttrToken.m_termins = new TerminCollection();
        PersonAttrToken.m_termins.add(PersonAttrTermin._new2388("ТОВАРИЩ", PersonAttrTerminType.PREFIX));
        PersonAttrToken.m_termins.add(PersonAttrTermin._new2389("ТОВАРИШ", MorphLang.UA, PersonAttrTerminType.PREFIX));
        for (const s of ["ГОСПОДИН", "ГРАЖДАНИН", "УРОЖЕНЕЦ", "МИСТЕР", "СЭР", "СЕНЬОР", "МОНСЕНЬОР", "СИНЬОР", "МЕСЬЕ", "МСЬЕ", "ДОН", "МАЭСТРО", "МЭТР"]) {
            t = PersonAttrTermin._new2390(s, PersonAttrTerminType.PREFIX, MorphGender.MASCULINE);
            if (s === "ГРАЖДАНИН") {
                t.add_abridge("ГР.");
                t.add_abridge("ГРАЖД.");
                t.add_abridge("ГР-Н");
            }
            PersonAttrToken.m_termins.add(t);
        }
        for (const s of ["ПАН", "ГРОМАДЯНИН", "УРОДЖЕНЕЦЬ", "МІСТЕР", "СЕР", "СЕНЬЙОР", "МОНСЕНЬЙОР", "МЕСЬЄ", "МЕТР", "МАЕСТРО"]) {
            t = PersonAttrTermin._new2391(s, MorphLang.UA, PersonAttrTerminType.PREFIX, MorphGender.MASCULINE);
            if (s === "ГРОМАДЯНИН") {
                t.add_abridge("ГР.");
                t.add_abridge("ГР-Н");
            }
            PersonAttrToken.m_termins.add(t);
        }
        for (const s of ["ГОСПОЖА", "ПАНИ", "ГРАЖДАНКА", "УРОЖЕНКА", "СЕНЬОРА", "СЕНЬОРИТА", "СИНЬОРА", "СИНЬОРИТА", "МИСС", "МИССИС", "МАДАМ", "МАДЕМУАЗЕЛЬ", "ФРАУ", "ФРОЙЛЯЙН", "ЛЕДИ", "ДОННА"]) {
            t = PersonAttrTermin._new2390(s, PersonAttrTerminType.PREFIX, MorphGender.FEMINIE);
            if (s === "ГРАЖДАНКА") {
                t.add_abridge("ГР.");
                t.add_abridge("ГРАЖД.");
                t.add_abridge("ГР-КА");
            }
            PersonAttrToken.m_termins.add(t);
        }
        for (const s of ["ПАНІ", "ГРОМАДЯНКА", "УРОДЖЕНКА", "СЕНЬЙОРА", "СЕНЬЙОРА", "МІС", "МІСІС", "МАДАМ", "МАДЕМУАЗЕЛЬ", "ФРАУ", "ФРОЙЛЯЙН", "ЛЕДІ"]) {
            t = PersonAttrTermin._new2391(s, MorphLang.UA, PersonAttrTerminType.PREFIX, MorphGender.FEMINIE);
            if (s === "ГРОМАДЯНКА") {
                t.add_abridge("ГР.");
                t.add_abridge("ГР-КА");
            }
            PersonAttrToken.m_termins.add(t);
        }
        t = PersonAttrTermin._new2391("MISTER", MorphLang.EN, PersonAttrTerminType.PREFIX, MorphGender.MASCULINE);
        t.add_abridge("MR");
        t.add_abridge("MR.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2391("MISSIS", MorphLang.EN, PersonAttrTerminType.PREFIX, MorphGender.FEMINIE);
        t.add_abridge("MRS");
        t.add_abridge("MSR.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2391("MISS", MorphLang.EN, PersonAttrTerminType.PREFIX, MorphGender.FEMINIE);
        t.add_abridge("MS");
        t.add_abridge("MS.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2388("БЕЗРАБОТНЫЙ", PersonAttrTerminType.POSITION);
        t.add_variant("НЕ РАБОТАЮЩИЙ", false);
        t.add_variant("НЕ РАБОТАЕТ", false);
        t.add_variant("ВРЕМЕННО НЕ РАБОТАЮЩИЙ", false);
        t.add_variant("ВРЕМЕННО НЕ РАБОТАЕТ", false);
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2389("БЕЗРОБІТНИЙ", MorphLang.UA, PersonAttrTerminType.POSITION);
        t.add_variant("НЕ ПРАЦЮЮЧИЙ", false);
        t.add_variant("НЕ ПРАЦЮЄ", false);
        t.add_variant("ТИМЧАСОВО НЕ ПРАЦЮЮЧИЙ", false);
        t.add_variant("ТИМЧАСОВО НЕ ПРАЦЮЄ", false);
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2399("ЗАМЕСТИТЕЛЬ", "заместитель", PersonAttrTerminType2.IO2, PersonAttrTerminType.POSITION);
        t.add_variant("ЗАМЕСТИТЕЛЬНИЦА", false);
        t.add_abridge("ЗАМ.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2400("ЗАСТУПНИК", MorphLang.UA, "заступник", PersonAttrTerminType2.IO2, PersonAttrTerminType.POSITION);
        t.add_variant("ЗАСТУПНИЦЯ", false);
        t.add_abridge("ЗАМ.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2399("УПОЛНОМОЧЕННЫЙ", "уполномоченный", PersonAttrTerminType2.IO2, PersonAttrTerminType.POSITION);
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2400("УПОВНОВАЖЕНИЙ", MorphLang.UA, "уповноважений", PersonAttrTerminType2.IO2, PersonAttrTerminType.POSITION);
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2399("ЭКС-УПОЛНОМОЧЕННЫЙ", "экс-уполномоченный", PersonAttrTerminType2.IO2, PersonAttrTerminType.POSITION);
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2400("ЕКС-УПОВНОВАЖЕНИЙ", MorphLang.UA, "екс-уповноважений", PersonAttrTerminType2.IO2, PersonAttrTerminType.POSITION);
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2405("ИСПОЛНЯЮЩИЙ ОБЯЗАННОСТИ", PersonAttrTerminType2.IO, PersonAttrTerminType.POSITION);
        t.add_abridge("И.О.");
        t.canonic_text = (t.acronym = "ИО");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2406("ВИКОНУЮЧИЙ ОБОВЯЗКИ", MorphLang.UA, PersonAttrTerminType2.IO, PersonAttrTerminType.POSITION);
        t.add_abridge("В.О.");
        t.canonic_text = (t.acronym = "ВО");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2405("ВРЕМЕННО ИСПОЛНЯЮЩИЙ ОБЯЗАННОСТИ", PersonAttrTerminType2.IO, PersonAttrTerminType.POSITION);
        t.add_abridge("ВР.И.О.");
        t.canonic_text = (t.acronym = "ВРИО");
        PersonAttrToken.m_termin_vrio = t;
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2388("ЗАВЕДУЮЩИЙ", PersonAttrTerminType.POSITION);
        t.add_abridge("ЗАВЕД.");
        t.add_abridge("ЗАВ.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2389("ЗАВІДУВАЧ", MorphLang.UA, PersonAttrTerminType.POSITION);
        t.add_abridge("ЗАВІД.");
        t.add_abridge("ЗАВ.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2388("СОТРУДНИК", PersonAttrTerminType.POSITION);
        t.add_abridge("СОТРУДН.");
        t.add_abridge("СОТР.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2389("СПІВРОБІТНИК", MorphLang.UA, PersonAttrTerminType.POSITION);
        t.add_abridge("СПІВРОБ.");
        t.add_abridge("СПІВ.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2388("АКАДЕМИК", PersonAttrTerminType.POSITION);
        t.add_abridge("АКАД.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2389("АКАДЕМІК", MorphLang.UA, PersonAttrTerminType.POSITION);
        t.add_abridge("АКАД.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2388("ЧЛЕН-КОРРЕСПОНДЕНТ", PersonAttrTerminType.POSITION);
        t.add_abridge("ЧЛ.-КОРР.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2389("ЧЛЕН-КОРЕСПОНДЕНТ", MorphLang.UA, PersonAttrTerminType.POSITION);
        t.add_abridge("ЧЛ.-КОР.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2388("ДОЦЕНТ", PersonAttrTerminType.POSITION);
        t.add_abridge("ДОЦ.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2388("ПРОФЕССОР", PersonAttrTerminType.POSITION);
        t.add_abridge("ПРОФ.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2389("ПРОФЕСОР", MorphLang.UA, PersonAttrTerminType.POSITION);
        t.add_abridge("ПРОФ.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2389("PROFESSOR", MorphLang.EN, PersonAttrTerminType.POSITION);
        t.add_abridge("PROF.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2405("КАНДИДАТ", PersonAttrTerminType2.GRADE, PersonAttrTerminType.POSITION);
        t.add_abridge("КАНД.");
        t.add_abridge("КАН.");
        t.add_abridge("К-Т");
        t.add_abridge("К.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2405("ДОКТОР", PersonAttrTerminType2.GRADE, PersonAttrTerminType.POSITION);
        t.add_abridge("ДОКТ.");
        t.add_abridge("ДОК.");
        t.add_abridge("Д-Р");
        t.add_abridge("Д.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2389("DOCTOR", MorphLang.EN, PersonAttrTerminType.PREFIX);
        t.add_abridge("DR");
        t.add_abridge("DR.");
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2388("ДОКТОРАНТ", PersonAttrTerminType.POSITION);
        PersonAttrToken.m_termins.add(t);
        t = PersonAttrTermin._new2389("ДОКТОРАНТ", MorphLang.UA, PersonAttrTerminType.POSITION);
        PersonAttrToken.m_termins.add(t);
        for (const s of ["КФН", "КТН", "КХН"]) {
            t = PersonAttrTermin._new2425(s, "кандидат наук", PersonAttrTerminType.POSITION, PersonAttrTerminType2.ABBR);
            PersonAttrToken.m_termins.add(t);
        }
        for (const s of ["ГЛАВНЫЙ", "МЛАДШИЙ", "СТАРШИЙ", "ВЕДУЩИЙ", "НАУЧНЫЙ"]) {
            t = PersonAttrTermin._new2405(s, PersonAttrTerminType2.ADJ, PersonAttrTerminType.POSITION);
            t.add_all_abridges(0, 0, 2);
            PersonAttrToken.m_termins.add(t);
        }
        for (const s of ["ГОЛОВНИЙ", "МОЛОДШИЙ", "СТАРШИЙ", "ПРОВІДНИЙ", "НАУКОВИЙ"]) {
            t = PersonAttrTermin._new2427(s, PersonAttrTerminType2.ADJ, PersonAttrTerminType.POSITION, MorphLang.UA);
            t.add_all_abridges(0, 0, 2);
            PersonAttrToken.m_termins.add(t);
        }
        for (const s of ["НЫНЕШНИЙ", "НОВЫЙ", "CURRENT", "NEW"]) {
            t = PersonAttrTermin._new2405(s, PersonAttrTerminType2.IGNOREDADJ, PersonAttrTerminType.POSITION);
            PersonAttrToken.m_termins.add(t);
        }
        for (const s of ["НИНІШНІЙ", "НОВИЙ"]) {
            t = PersonAttrTermin._new2427(s, PersonAttrTerminType2.IGNOREDADJ, PersonAttrTerminType.POSITION, MorphLang.UA);
            PersonAttrToken.m_termins.add(t);
        }
        for (const s of ["ТОГДАШНИЙ", "БЫВШИЙ", "ПРЕДЫДУЩИЙ", "FORMER", "PREVIOUS", "THEN"]) {
            t = PersonAttrTermin._new2405(s, PersonAttrTerminType2.IO, PersonAttrTerminType.POSITION);
            PersonAttrToken.m_termins.add(t);
        }
        for (const s of ["ТОДІШНІЙ", "КОЛИШНІЙ"]) {
            t = PersonAttrTermin._new2427(s, PersonAttrTerminType2.IO, PersonAttrTerminType.POSITION, MorphLang.UA);
            PersonAttrToken.m_termins.add(t);
        }
        let dat = EpNerPersonInternalResourceHelper.get_bytes("attr_ru.dat");
        if (dat === null) 
            throw new Error("Not found resource file attr_ru.dat in Person analyzer");
        PersonAttrToken.load_attrs(PersonAttrToken.m_termins, dat, MorphLang.RU);
        if ((((dat = EpNerPersonInternalResourceHelper.get_bytes("attr_en.dat")))) === null) 
            throw new Error("Not found resource file attr_en.dat in Person analyzer");
        PersonAttrToken.load_attrs(PersonAttrToken.m_termins, dat, MorphLang.EN);
        PersonAttrToken.load_attrs(PersonAttrToken.m_termins, EpNerPersonInternalResourceHelper.get_bytes("attr_ua.dat"), MorphLang.UA);
    }
    
    static deflate(zip) {
        let unzip = new MemoryStream(); 
        try {
            let _data = new MemoryStream(zip);
            _data.position = 0;
            MorphSerializeHelper.deflate_gzip(_data, unzip);
            _data.close();
            return unzip.toByteArray();
        }
        finally {
            unzip.close();
        }
    }
    
    static load_attrs(termins, dat, lang) {
        if (dat === null || dat.length === 0) 
            return;
        let tmp = new MemoryStream(PersonAttrToken.deflate(dat)); 
        try {
            tmp.position = 0;
            let xml = new XmlDocument();
            xml.loadStream(tmp);
            for (const x of xml.document_element.child_nodes) {
                let a = Utils.getXmlAttrByName(x.attributes, "v");
                if (a === null) 
                    continue;
                let val = a.value;
                if (val === null) 
                    continue;
                let attrs = (Utils.getXmlAttrByName(x.attributes, "a") === null ? "" : (Utils.notNull(Utils.getXmlAttrByName(x.attributes, "a").value, "")));
                if (val === "ОТЕЦ") {
                }
                let pat = PersonAttrTermin._new2432(val, PersonAttrTerminType.POSITION, lang);
                for (const ch of attrs) {
                    if (ch === 'p') 
                        pat.can_has_person_after = 1;
                    else if (ch === 'P') 
                        pat.can_has_person_after = 2;
                    else if (ch === 's') 
                        pat.can_be_same_surname = true;
                    else if (ch === 'm') 
                        pat.gender = MorphGender.MASCULINE;
                    else if (ch === 'f') 
                        pat.gender = MorphGender.FEMINIE;
                    else if (ch === 'b') 
                        pat.is_boss = true;
                    else if (ch === 'r') 
                        pat.is_military_rank = true;
                    else if (ch === 'n') 
                        pat.is_nation = true;
                    else if (ch === 'c') 
                        pat.typ = PersonAttrTerminType.KING;
                    else if (ch === 'q') 
                        pat.typ = PersonAttrTerminType.KING;
                    else if (ch === 'k') 
                        pat.is_kin = true;
                    else if (ch === 'a') 
                        pat.typ2 = PersonAttrTerminType2.IO2;
                    else if (ch === '1') 
                        pat.can_be_independant = true;
                    else if (ch === '?') 
                        pat.is_doubt = true;
                }
                if (Utils.getXmlAttrByName(x.attributes, "alt") !== null) {
                    pat.add_variant((val = Utils.getXmlAttrByName(x.attributes, "alt").value), false);
                    if (val.indexOf('.') > 0) 
                        pat.add_abridge(val);
                }
                if (x.child_nodes.length > 0) {
                    for (const xx of x.child_nodes) {
                        if (xx.name === "alt") {
                            pat.add_variant((val = xx.inner_text), false);
                            if (val.indexOf('.') > 0) 
                                pat.add_abridge(val);
                        }
                    }
                }
                termins.add(pat);
            }
        }
        finally {
            tmp.close();
        }
    }
    
    constructor(begin, end) {
        super(null, begin, end, null);
        this.typ = PersonAttrTerminType.PREFIX;
        this.gender = MorphGender.UNDEFINED;
        this.value = null;
        this.king_surname = null;
        this.age = null;
        this.higher_prop_ref = null;
        this.add_outer_org_as_ref = false;
        this.anafor = null;
        this.m_can_be_independent_property = false;
        this.can_be_single_person = false;
        this.can_has_person_after = 0;
        this.can_be_same_surname = false;
        this.is_doubt = false;
    }
    
    get prop_ref() {
        return Utils.as(this.referent, PersonPropertyReferent);
    }
    set prop_ref(_value) {
        this.referent = _value;
        return _value;
    }
    
    get can_be_independent_property() {
        if (this.prop_ref === null) 
            return false;
        if (this.morph.number === MorphNumber.PLURAL) 
            return false;
        if (this.higher_prop_ref !== null && this.higher_prop_ref.can_be_independent_property) 
            return true;
        if (this.can_be_single_person) 
            return true;
        if (this.typ !== PersonAttrTerminType.POSITION) 
            return false;
        if (!this.m_can_be_independent_property) {
            if (this.prop_ref.kind === PersonPropertyKind.BOSS) 
                return true;
            return false;
        }
        if (this.prop_ref.find_slot(PersonPropertyReferent.ATTR_REF, null, true) !== null) {
            if (this.prop_ref.name !== "член") 
                return true;
        }
        return false;
    }
    set can_be_independent_property(_value) {
        this.m_can_be_independent_property = _value;
        return _value;
    }
    
    toString() {
        if (this.referent !== null) 
            return super.toString();
        let res = new StringBuilder();
        res.append(this.typ.toString()).append(": ").append(((this.value != null ? this.value : "")));
        if (this.prop_ref !== null) 
            res.append(" Ref: ").append(this.prop_ref.toString());
        if (this.gender !== MorphGender.UNDEFINED) 
            res.append("; ").append(String(this.gender));
        if (this.can_has_person_after >= 0) 
            res.append("; MayBePersonAfter=").append(this.can_has_person_after);
        if (this.can_be_same_surname) 
            res.append("; CanHasLikeSurname");
        if (this.m_can_be_independent_property) 
            res.append("; CanBeIndependent");
        if (this.is_doubt) 
            res.append("; Doubt");
        if (this.age !== null) 
            res.append("; Age=").append(this.age);
        if (!this.morph._case.is_undefined) 
            res.append("; ").append(this.morph._case.toString());
        return res.toString();
    }
    
    save_to_local_ontology() {
        let ad = this.data;
        if (ad === null || this.prop_ref === null || this.higher_prop_ref === null) {
            super.save_to_local_ontology();
            return;
        }
        let li = new Array();
        for (let pr = this; pr !== null && pr.prop_ref !== null; pr = pr.higher_prop_ref) {
            li.splice(0, 0, pr);
        }
        for (let i = 0; i < li.length; i++) {
            li[i].data = ad;
            li[i].higher_prop_ref = null;
            li[i].save_to_local_ontology();
            if ((i + 1) < li.length) 
                li[i + 1].prop_ref.higher = li[i].prop_ref;
        }
    }
    
    static try_attach(t, loc_onto, attrs = PersonAttrTokenPersonAttrAttachAttrs.NO) {
        if (t === null) 
            return null;
        let olev = null;
        let lev = 0;
        let wrapolev2436 = new RefOutArgWrapper();
        let inoutres2437 = t.kit.misc_data.tryGetValue("pat", wrapolev2436);
        olev = wrapolev2436.value;
        if (!inoutres2437) 
            t.kit.misc_data.put("pat", (lev = 1));
        else {
            lev = olev;
            if (lev > 2) 
                return null;
            lev++;
            t.kit.misc_data.put("pat", lev);
        }
        let res = PersonAttrToken._try_attach(t, loc_onto, attrs);
        lev--;
        if (lev < 0) 
            lev = 0;
        t.kit.misc_data.put("pat", lev);
        if (res === null) {
            if (t.morph.class0.is_noun) {
                let aterr = Utils.as(t.kit.processor.find_analyzer("GEO"), GeoAnalyzer);
                if (aterr !== null) {
                    let rt = aterr.process_citizen(t);
                    if (rt !== null) {
                        res = PersonAttrToken._new2433(rt.begin_token, rt.end_token, rt.morph);
                        res.prop_ref = new PersonPropertyReferent();
                        res.prop_ref.add_slot(PersonPropertyReferent.ATTR_NAME, (t.kit.base_language.is_ua ? "громадянин" : "гражданин"), true, 0);
                        res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, rt.referent, true, 0);
                        res.prop_ref.add_ext_referent(rt);
                        res.typ = PersonAttrTerminType.POSITION;
                        if ((res.end_token.next !== null && res.end_token.next.is_value("ПО", null) && res.end_token.next.next !== null) && res.end_token.next.next.is_value("ПРОИСХОЖДЕНИЕ", null)) 
                            res.end_token = res.end_token.next.next;
                        return res;
                    }
                }
            }
            if (((((t instanceof TextToken)) && (t).term === "АК" && t.next !== null) && t.next.is_char('.') && t.next.next !== null) && !t.next.next.chars.is_all_lower) {
                res = PersonAttrToken._new2434(t, t.next, PersonAttrTerminType.POSITION);
                res.prop_ref = PersonPropertyReferent._new2435("академик");
                return res;
            }
            if ((t instanceof TextToken) && t.next !== null) {
                if (((t.is_value("ВИЦЕ", "ВІЦЕ") || t.is_value("ЭКС", "ЕКС") || t.is_value("ГЕН", null)) || t.is_value("VICE", null) || t.is_value("EX", null)) || t.is_value("DEPUTY", null)) {
                    let tt = t.next;
                    if (tt.is_hiphen || tt.is_char('.')) 
                        tt = tt.next;
                    res = PersonAttrToken._try_attach(tt, loc_onto, attrs);
                    if (res !== null && res.prop_ref !== null) {
                        res.begin_token = t;
                        if (t.is_value("ГЕН", null)) 
                            res.prop_ref.name = ("генеральный " + res.prop_ref.name);
                        else 
                            res.prop_ref.name = ((t).term.toLowerCase() + "-" + res.prop_ref.name);
                        return res;
                    }
                }
            }
            if (t.is_value("ГВАРДИИ", "ГВАРДІЇ")) {
                res = PersonAttrToken._try_attach(t.next, loc_onto, attrs);
                if (res !== null) {
                    if (res.prop_ref !== null && res.prop_ref.kind === PersonPropertyKind.MILITARYRANK) {
                        res.begin_token = t;
                        return res;
                    }
                }
            }
            let tt1 = t;
            if (tt1.morph.class0.is_preposition && tt1.next !== null) 
                tt1 = tt1.next;
            if ((tt1.next !== null && tt1.is_value("НАЦИОНАЛЬНОСТЬ", "НАЦІОНАЛЬНІСТЬ")) || tt1.is_value("ПРОФЕССИЯ", "ПРОФЕСІЯ") || tt1.is_value("СПЕЦИАЛЬНОСТЬ", "СПЕЦІАЛЬНІСТЬ")) {
                tt1 = tt1.next;
                if (tt1 !== null) {
                    if (tt1.is_hiphen || tt1.is_char(':')) 
                        tt1 = tt1.next;
                }
                res = PersonAttrToken._try_attach(tt1, loc_onto, attrs);
                if (res !== null) {
                    res.begin_token = t;
                    return res;
                }
            }
            return null;
        }
        if (res.typ === PersonAttrTerminType.OTHER && res.age !== null && res.value === null) {
            let res1 = PersonAttrToken._try_attach(res.end_token.next, loc_onto, attrs);
            if (res1 !== null) {
                res1.begin_token = res.begin_token;
                res1.age = res.age;
                res = res1;
            }
        }
        if (res.begin_token.is_value("ГЛАВА", null)) {
            if (t.previous instanceof NumberToken) 
                return null;
        }
        else if (res.begin_token.is_value("АДВОКАТ", null)) {
            if (t.previous !== null) {
                if (t.previous.is_value("РЕЕСТР", "РЕЄСТР") || t.previous.is_value("УДОСТОВЕРЕНИЕ", "ПОСВІДЧЕННЯ")) 
                    return null;
            }
        }
        let mc = res.begin_token.get_morph_class_in_dictionary();
        if (mc.is_adjective) {
            let npt = NounPhraseHelper.try_parse(res.begin_token, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.end_char > res.end_char) {
                if (PersonAttrToken.m_termins.try_parse(npt.end_token, TerminParseAttr.NO) === null) 
                    return null;
            }
        }
        if (res.typ === PersonAttrTerminType.PREFIX && (((((res.value === "ГРАЖДАНИН" || res.value === "ГРАЖДАНКА" || res.value === "УРОЖЕНЕЦ") || res.value === "УРОЖЕНКА" || res.value === "ГРОМАДЯНИН") || res.value === "ГРОМАДЯНКА" || res.value === "УРОДЖЕНЕЦЬ") || res.value === "УРОДЖЕНКА")) && res.end_token.next !== null) {
            let tt = res.end_token.next;
            if (((tt !== null && tt.is_char('(') && tt.next !== null) && tt.next.is_value("КА", null) && tt.next.next !== null) && tt.next.next.is_char(')')) {
                res.end_token = tt.next.next;
                tt = res.end_token.next;
            }
            let r = (tt === null ? null : tt.get_referent());
            if (r !== null && r.type_name === PersonAttrToken.obj_name_geo) {
                res.end_token = tt;
                res.prop_ref = new PersonPropertyReferent();
                res.prop_ref.add_slot(PersonPropertyReferent.ATTR_NAME, res.value.toLowerCase(), true, 0);
                res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, r, true, 0);
                res.typ = PersonAttrTerminType.POSITION;
                for (let ttt = tt.next; ttt !== null; ttt = ttt.next) {
                    if (!ttt.is_comma_and || ttt.next === null) 
                        break;
                    ttt = ttt.next;
                    r = ttt.get_referent();
                    if (r === null || r.type_name !== PersonAttrToken.obj_name_geo) 
                        break;
                    res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, r, false, 0);
                    res.end_token = (tt = ttt);
                    if (ttt.previous.is_and) 
                        break;
                }
                if (((res.end_token.next instanceof ReferentToken) && (res.whitespaces_after_count < 3) && res.end_token.next.get_referent() !== null) && res.end_token.next.get_referent().type_name === PersonAttrToken.obj_name_geo) {
                    if (GeoOwnerHelper.can_be_higher(Utils.as(r, GeoReferent), Utils.as(res.end_token.next.get_referent(), GeoReferent))) {
                        res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, res.end_token.next.get_referent(), false, 0);
                        res.end_token = res.end_token.next;
                    }
                }
            }
            else if ((tt !== null && tt.is_and && tt.next !== null) && tt.next.is_value("ЖИТЕЛЬ", null)) {
                let aaa = PersonAttrToken._try_attach(tt.next, loc_onto, attrs);
                if (aaa !== null && aaa.prop_ref !== null) {
                    aaa.begin_token = res.begin_token;
                    aaa.value = res.value;
                    aaa.prop_ref.name = aaa.value.toLowerCase();
                    res = aaa;
                }
            }
            else {
                let tt2 = tt;
                if (tt2.is_comma_and) 
                    tt2 = tt2.next;
                let nex = PersonAttrToken._try_attach(tt2, loc_onto, attrs);
                if (nex !== null && nex.prop_ref !== null) {
                    for (const sss of nex.prop_ref.slots) {
                        if (sss.value instanceof GeoReferent) {
                            if (res.prop_ref === null) 
                                res.prop_ref = new PersonPropertyReferent();
                            res.prop_ref.add_slot(PersonPropertyReferent.ATTR_NAME, res.value.toLowerCase(), false, 0);
                            res.prop_ref.add_slot(sss.type_name, sss.value, false, 0);
                            res.typ = PersonAttrTerminType.POSITION;
                        }
                    }
                }
            }
        }
        if (res.typ === PersonAttrTerminType.KING || res.typ === PersonAttrTerminType.POSITION) {
            if (res.begin_token === res.end_token && res.chars.is_capital_upper && res.whitespaces_after_count === 1) {
                let pit = PersonItemToken.try_attach(t, loc_onto, PersonItemTokenParseAttr.IGNOREATTRS, null);
                if (pit !== null && pit.lastname !== null && pit.lastname.is_lastname_has_std_tail) {
                    let rt1 = t.kit.process_referent("PERSON", t.next);
                    if (rt1 !== null && (rt1.referent instanceof PersonReferent)) {
                    }
                    else if ((((attrs.value()) & (PersonAttrTokenPersonAttrAttachAttrs.INPROCESS.value()))) !== (PersonAttrTokenPersonAttrAttachAttrs.NO.value())) {
                    }
                    else 
                        return null;
                }
            }
        }
        if (res.prop_ref === null) 
            return res;
        if (res.chars.is_latin_letter) {
            let tt = res.end_token.next;
            if (tt !== null && tt.is_hiphen) 
                tt = tt.next;
            if (tt !== null && tt.is_value("ELECT", null)) 
                res.end_token = tt;
        }
        if (!res.begin_token.chars.is_all_lower) {
            let pat = PersonItemToken.try_attach(res.begin_token, loc_onto, PersonItemTokenParseAttr.IGNOREATTRS, null);
            if (pat !== null && pat.lastname !== null) {
                if (pat.lastname.is_in_dictionary || pat.lastname.is_in_ontology) {
                    if (PersonAttrToken.check_kind(res.prop_ref) !== PersonPropertyKind.KING) 
                        return null;
                }
            }
        }
        let s = res.prop_ref.toString();
        if (s === "глава книги") 
            return null;
        if (s === "глава" && res.prop_ref.find_slot(PersonPropertyReferent.ATTR_REF, null, true) === null) 
            return null;
        if (((s === "королева" || s === "король" || s === "князь")) && res.chars.is_capital_upper) {
            let pits = PersonItemToken.try_attach_list(res.end_token.next, loc_onto, PersonItemTokenParseAttr.NO, 10);
            if (pits !== null && pits.length > 0) {
                if (pits[0].typ === PersonItemTokenItemType.INITIAL) 
                    return null;
                if (pits[0].firstname !== null) {
                    if (pits.length === 1) 
                        return null;
                    if (pits.length === 2 && pits[1].middlename !== null) 
                        return null;
                }
            }
            if (!MiscHelper.can_be_start_of_sentence(t)) 
                return null;
        }
        if (s === "друг" || s.startsWith("друг ")) {
            if (t.previous !== null) {
                if (t.previous.is_value("ДРУГ", null)) 
                    return null;
                if (t.previous.morph.class0.is_preposition && t.previous.previous !== null && t.previous.previous.is_value("ДРУГ", null)) 
                    return null;
            }
            if (t.next !== null) {
                if (t.next.is_value("ДРУГ", null)) 
                    return null;
                if (t.next.morph.class0.is_preposition && t.next.next !== null && t.next.next.is_value("ДРУГ", null)) 
                    return null;
            }
        }
        if (res.chars.is_latin_letter && ((res.is_doubt || s === "senior")) && (res.whitespaces_after_count < 2)) {
            if (res.prop_ref !== null && res.prop_ref.slots.length === 1) {
                let tt2 = res.end_token.next;
                if (MiscHelper.is_eng_adj_suffix(tt2)) 
                    tt2 = tt2.next.next;
                let res2 = PersonAttrToken._try_attach(tt2, loc_onto, attrs);
                if ((res2 !== null && res2.chars.is_latin_letter && res2.typ === res.typ) && res2.prop_ref !== null) {
                    res2.prop_ref.name = ((Utils.notNull(res.prop_ref.name, "")) + " " + (Utils.notNull(res2.prop_ref.name, ""))).trim();
                    res2.begin_token = res.begin_token;
                    res = res2;
                }
            }
        }
        if (res.prop_ref.name === "министр") {
            let rt1 = res.kit.process_referent("ORGANIZATION", res.end_token.next);
            if (rt1 !== null && rt1.referent.find_slot("TYPE", "министерство", true) !== null) {
                let t1 = rt1.end_token;
                if (t1.get_referent() instanceof GeoReferent) 
                    t1 = t1.previous;
                if (rt1.begin_char < t1.end_char) {
                    let add_str = MiscHelper.get_text_value(rt1.begin_token, t1, GetTextAttr.NO);
                    if (add_str !== null) {
                        res.prop_ref.name = res.prop_ref.name + (" " + add_str.toLowerCase());
                        res.end_token = t1;
                    }
                }
            }
        }
        for (let p = res.prop_ref; p !== null; p = p.higher) {
            if (p.name !== null && p.name.includes(" - ")) 
                p.name = Utils.replaceString(p.name, " - ", "-");
        }
        if (res.begin_token.morph.class0.is_adjective) {
            let r = res.kit.process_referent("GEO", res.begin_token);
            if (r !== null) {
                res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, r.referent, false, 0);
                res.prop_ref.add_ext_referent(r);
                let i = res.prop_ref.name.indexOf(' ');
                if (i > 0) 
                    res.prop_ref.name = res.prop_ref.name.substring(i).trim();
            }
        }
        let contains_geo = false;
        for (const ss of res.prop_ref.slots) {
            if (ss.value instanceof Referent) {
                if ((ss.value).type_name === PersonAttrToken.obj_name_geo) {
                    contains_geo = true;
                    break;
                }
            }
        }
        if (!contains_geo && (res.end_token.whitespaces_after_count < 2)) {
            if ((res.end_token.next instanceof ReferentToken) && res.end_token.next.get_referent().type_name === PersonAttrToken.obj_name_geo) {
                res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, res.end_token.next.get_referent(), false, 0);
                res.end_token = res.end_token.next;
            }
        }
        if (res.end_token.whitespaces_after_count < 2) {
            let te = res.end_token.next;
            if (te !== null && te.is_value("В", null)) {
                te = te.next;
                if ((te instanceof ReferentToken) && ((te.get_referent().type_name === PersonAttrToken.obj_name_date || te.get_referent().type_name === PersonAttrToken.obj_name_date_range))) 
                    res.end_token = te;
            }
            else if (te !== null && te.is_char('(')) {
                te = te.next;
                if (((te instanceof ReferentToken) && ((te.get_referent().type_name === PersonAttrToken.obj_name_date || te.get_referent().type_name === PersonAttrToken.obj_name_date_range)) && te.next !== null) && te.next.is_char(')')) 
                    res.end_token = te.next;
                else if (te instanceof NumberToken) {
                    let rt1 = te.kit.process_referent("DATE", te);
                    if (rt1 !== null && rt1.end_token.next !== null && rt1.end_token.next.is_char(')')) 
                        res.end_token = rt1.end_token.next;
                }
            }
        }
        if (res.prop_ref !== null && res.prop_ref.name === "отец") {
            let is_king = false;
            let tt = res.end_token.next;
            if ((tt instanceof TextToken) && tt.get_morph_class_in_dictionary().is_proper_name) {
                if (!(MorphCase.ooBitand(res.morph._case, tt.morph._case)).is_undefined) {
                    if (!tt.morph._case.is_genitive) 
                        is_king = true;
                }
            }
            if (is_king) 
                res.prop_ref.name = "священник";
        }
        if (res.prop_ref !== null && res.prop_ref.kind === PersonPropertyKind.KING) {
            let t1 = res.end_token.next;
            if (res.prop_ref.name === "отец") {
                if (t1 === null || !t1.chars.is_capital_upper) 
                    return null;
                if ((MorphCase.ooBitand(res.morph._case, t1.morph._case)).is_undefined) 
                    return null;
                res.prop_ref.name = "священник";
                return res;
            }
            if (t1 !== null && t1.chars.is_capital_upper && t1.morph.class0.is_adjective) {
                if ((((res.king_surname = PersonItemToken.try_attach(t1, loc_onto, PersonItemTokenParseAttr.IGNOREATTRS, null)))) !== null) {
                    res.end_token = t1;
                    if ((t1.next !== null && t1.next.is_and && t1.next.next !== null) && t1.next.next.is_value("ВСЕЯ", null)) {
                        t1 = t1.next.next.next;
                        let _geo = Utils.as(((t1 === null ? null : t1.get_referent())), GeoReferent);
                        if (_geo !== null) {
                            res.end_token = t1;
                            res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, _geo, false, 0);
                        }
                    }
                }
            }
        }
        if (res.can_has_person_after > 0 && res.prop_ref.find_slot(PersonPropertyReferent.ATTR_REF, null, true) === null) {
            let npt = NounPhraseHelper.try_parse(res.begin_token, NounPhraseParseAttr.NO, 0, null);{
                    let tt0 = res.begin_token;
                    let have = false;
                    if ((tt0 instanceof TextToken) && tt0.morph.class0.is_personal_pronoun && ((tt0.is_value("ОН", null) || tt0.is_value("ОНА", null)))) {
                    }
                    else {
                        tt0 = tt0.previous;
                        if ((tt0 instanceof TextToken) && tt0.morph.class0.is_personal_pronoun && ((tt0.is_value("ОН", null) || tt0.is_value("ОНА", null)))) {
                        }
                        else if ((tt0 instanceof TextToken) && tt0.morph.class0.is_pronoun && tt0.is_value("СВОЙ", null)) {
                        }
                        else if ((tt0 instanceof TextToken) && ((tt0.is_value("ИМЕТЬ", null) || (tt0).is_verb_be))) 
                            have = true;
                        else 
                            tt0 = null;
                    }
                    if (tt0 !== null) {
                        let gen = MorphGender.UNDEFINED;
                        let cou = 0;
                        if (!have) {
                            for (const wf of tt0.morph.items) {
                                if (wf.class0.is_personal_pronoun || wf.class0.is_pronoun) {
                                    if ((((gen = wf.gender))) === MorphGender.NEUTER) 
                                        gen = MorphGender.MASCULINE;
                                    break;
                                }
                            }
                        }
                        for (let tt = tt0.previous; tt !== null && (cou < 200); tt = tt.previous,cou++) {
                            let pr = Utils.as(tt.get_referent(), PersonPropertyReferent);
                            if (pr !== null) {
                                if ((((tt.morph.gender.value()) & (gen.value()))) === (MorphGender.UNDEFINED.value())) 
                                    continue;
                                break;
                            }
                            let p = Utils.as(tt.get_referent(), PersonReferent);
                            if (p === null) 
                                continue;
                            if (have && (cou < 10)) {
                            }
                            else if (gen === MorphGender.FEMINIE) {
                                if (p.is_male && !p.is_female) 
                                    continue;
                            }
                            else if (gen === MorphGender.MASCULINE) {
                                if (p.is_female && !p.is_male) 
                                    continue;
                            }
                            else 
                                break;
                            res.begin_token = (have ? tt0.next : tt0);
                            res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, p, false, 0);
                            res.can_be_independent_property = true;
                            if (res.morph.number !== MorphNumber.PLURAL) 
                                res.can_be_single_person = true;
                            npt = NounPhraseHelper.try_parse(tt0, NounPhraseParseAttr.NO, 0, null);
                            if (npt !== null && npt.begin_token !== npt.end_token) 
                                res.morph = npt.morph;
                            break;
                        }
                    }
                    else if (res.whitespaces_after_count === 1) {
                        let pa = Utils.as(res.kit.processor.find_analyzer("PERSON"), PersonAnalyzer);
                        if (pa !== null) {
                            let t1 = res.end_token.next;
                            let pr = PersonAnalyzer.try_attach_person(t1, Utils.as(res.kit.get_analyzer_data(pa), PersonAnalyzer.PersonAnalyzerData), false, 0, true);
                            if (pr !== null && res.can_has_person_after === 1) {
                                if (pr.begin_token === t1) {
                                    if (!pr.morph._case.is_genitive && !pr.morph._case.is_undefined) 
                                        pr = null;
                                    else if (!pr.morph._case.is_undefined && !(MorphCase.ooBitand(res.morph._case, pr.morph._case)).is_undefined) {
                                        if (PersonAnalyzer.try_attach_person(pr.end_token.next, Utils.as(res.kit.get_analyzer_data(pa), PersonAnalyzer.PersonAnalyzerData), false, 0, true) !== null) {
                                        }
                                        else 
                                            pr = null;
                                    }
                                }
                                else if (pr.begin_token.previous === t1) {
                                    pr = null;
                                    res.prop_ref.name = (res.prop_ref.name + " " + t1.get_source_text().toLowerCase());
                                    res.end_token = t1;
                                }
                                else 
                                    pr = null;
                            }
                            else if (pr !== null && res.can_has_person_after === 2) {
                                let pits = PersonItemToken.try_attach_list(t1, null, PersonItemTokenParseAttr.NO, 10);
                                if (((pits !== null && pits.length > 1 && pits[0].firstname !== null) && pits[1].firstname !== null && pr.end_char > pits[0].end_char) && pits[0].morph._case.is_genitive) {
                                    pr = null;
                                    let cou = 100;
                                    for (let tt = t1.previous; tt !== null && cou > 0; tt = tt.previous,cou--) {
                                        let p0 = Utils.as(tt.get_referent(), PersonReferent);
                                        if (p0 === null) 
                                            continue;
                                        for (const v of pits[0].firstname.vars) {
                                            if (p0.find_slot(PersonReferent.ATTR_FIRSTNAME, v.value, true) !== null) {
                                                pr = new ReferentToken(p0, t1, pits[0].end_token);
                                                break;
                                            }
                                        }
                                        if (pr !== null) 
                                            break;
                                    }
                                }
                            }
                            if (pr !== null) {
                                res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, pr, false, 0);
                                res.end_token = pr.end_token;
                                res.can_be_independent_property = true;
                                if (res.morph.number !== MorphNumber.PLURAL) 
                                    res.can_be_single_person = true;
                            }
                        }
                    }
                }
        }
        if (res.prop_ref.higher === null && res.prop_ref.kind === PersonPropertyKind.BOSS && res.prop_ref.find_slot(PersonPropertyReferent.ATTR_REF, null, true) === null) {
            let tok = PersonAttrToken.m_termins.try_parse(res.begin_token, TerminParseAttr.NO);
            if (tok !== null && tok.end_token === res.end_token) {
                let cou = 0;
                let refs = new Array();
                for (let tt = tok.begin_token.previous; tt !== null; tt = tt.previous) {
                    if (tt.whitespaces_after_count > 15) 
                        break;
                    if (tt.is_newline_after) 
                        cou += 10;
                    if ((++cou) > 1000) 
                        break;
                    if (!((tt instanceof ReferentToken))) 
                        continue;
                    let li = tt.get_referents();
                    if (li === null) 
                        continue;
                    let breaks = false;
                    for (const r of li) {
                        if (((r.type_name === "ORGANIZATION" || r.type_name === "GEO")) && r.parent_referent === null) {
                            if (!refs.includes(r)) {
                                if (res.prop_ref.can_has_ref(r)) 
                                    refs.push(r);
                            }
                        }
                        else if (r instanceof PersonPropertyReferent) {
                            if ((r).find_slot(PersonPropertyReferent.ATTR_REF, null, true) !== null) 
                                breaks = true;
                        }
                        else if (r instanceof PersonReferent) 
                            breaks = true;
                    }
                    if (refs.length > 1 || breaks) 
                        break;
                }
                if (refs.length === 1) {
                    res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, refs[0], false, 0);
                    res.add_outer_org_as_ref = true;
                }
            }
        }
        if (res.chars.is_latin_letter && res.prop_ref !== null && res.prop_ref.find_slot(PersonPropertyReferent.ATTR_REF, null, true) === null) {
            if (res.begin_token.previous !== null && res.begin_token.previous.is_value("S", null)) {
                if (MiscHelper.is_eng_adj_suffix(res.begin_token.previous.previous) && (res.begin_token.previous.previous.previous instanceof ReferentToken)) {
                    res.begin_token = res.begin_token.previous.previous.previous;
                    res.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, res.begin_token.get_referent(), false, 0);
                }
            }
        }
        if (res.chars.is_latin_letter && res.prop_ref !== null && (res.whitespaces_after_count < 2)) {
            let rnext = PersonAttrToken.try_attach(res.end_token.next, loc_onto, PersonAttrTokenPersonAttrAttachAttrs.NO);
            if ((rnext !== null && rnext.chars.is_latin_letter && rnext.prop_ref !== null) && rnext.prop_ref.slots.length === 1 && rnext.can_has_person_after > 0) {
                res.end_token = rnext.end_token;
                res.prop_ref.name = (res.prop_ref.name + " " + rnext.prop_ref.name);
            }
        }
        return res;
    }
    
    static _try_attach(t, loc_onto, attrs) {
        if (t === null) 
            return null;
        if (t.morph.class0.is_pronoun && (((t.is_value("ЕГО", "ЙОГО") || t.is_value("ЕЕ", "ЇЇ") || t.is_value("HIS", null)) || t.is_value("HER", null)))) {
            let res1 = PersonAttrToken.try_attach(t.next, loc_onto, attrs);
            if (res1 !== null && res1.prop_ref !== null) {
                let k = 0;
                for (let tt2 = t.previous; tt2 !== null && (k < 10); tt2 = tt2.previous,k++) {
                    let r = tt2.get_referent();
                    if (r === null) 
                        continue;
                    if (r.type_name === PersonAttrToken.obj_name_org || (r instanceof PersonReferent)) {
                        let ok = false;
                        if (t.is_value("ЕЕ", "ЇЇ") || t.is_value("HER", null)) {
                            if (tt2.morph.gender === MorphGender.FEMINIE) 
                                ok = true;
                        }
                        else if ((((tt2.morph.gender.value()) & (((MorphGender.MASCULINE.value()) | (MorphGender.NEUTER.value()))))) !== (MorphGender.UNDEFINED.value())) 
                            ok = true;
                        if (ok) {
                            res1.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, r, false, 0);
                            res1.begin_token = t;
                            return res1;
                        }
                        break;
                    }
                }
            }
            return null;
        }
        let nta = NumberHelper.try_parse_age(t);
        if (nta !== null) {
            if (nta.morph.class0.is_adjective || ((t.previous !== null && t.previous.is_comma)) || ((nta.end_token.next !== null && nta.end_token.next.is_char_of(",.")))) 
                return PersonAttrToken._new2438(t, nta.end_token, PersonAttrTerminType.OTHER, nta.value.toString(), nta.morph);
        }
        if (t.is_newline_before) {
            let li = MailLine.parse(t, 0);
            if (li !== null && li.typ === MailLineTypes.BESTREGARDS) 
                return PersonAttrToken._new2440(li.begin_token, li.end_token, PersonAttrTerminType.BESTREGARDS, MorphCollection._new2439(MorphCase.NOMINATIVE));
        }
        let tt = Utils.as(t, TextToken);
        if (tt === null) {
            let nt = Utils.as(t, NumberToken);
            if (nt !== null) {
                if (((nt.value === "1" || nt.value === "2" || nt.value === "3")) && nt.morph.class0.is_adjective) {
                    let pat0 = PersonAttrToken._try_attach(t.next, loc_onto, attrs);
                    if (pat0 !== null && pat0.prop_ref !== null) {
                        pat0.begin_token = t;
                        for (const s of pat0.prop_ref.slots) {
                            if (s.type_name === PersonPropertyReferent.ATTR_NAME) {
                                if (s.value.toString().includes("глава")) 
                                    return null;
                                pat0.prop_ref.upload_slot(s, ((pat0.morph.gender === MorphGender.FEMINIE || t.morph.gender === MorphGender.FEMINIE ? ((nt.value === "1" ? "первая" : (nt.value === "2" ? "вторая" : "третья"))) : ((nt.value === "1" ? "первый" : (nt.value === "2" ? "второй" : "третий")))) + " " + s.value));
                            }
                        }
                        return pat0;
                    }
                }
            }
            let rr = null;
            if (t !== null) 
                rr = t.get_referent();
            if (rr !== null && (((rr instanceof GeoReferent) || rr.type_name === "ORGANIZATION"))) {
                let ttt = t.next;
                if (MiscHelper.is_eng_adj_suffix(ttt)) 
                    ttt = ttt.next.next;
                if ((ttt instanceof TextToken) && ttt.morph.language.is_en && (ttt.whitespaces_before_count < 2)) {
                    let res0 = PersonAttrToken._try_attach(ttt, loc_onto, attrs);
                    if (res0 !== null && res0.prop_ref !== null) {
                        res0.begin_token = t;
                        res0.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, t.get_referent(), false, 0);
                        return res0;
                    }
                }
            }
            if ((rr instanceof PersonReferent) && MiscHelper.is_eng_adj_suffix(t.next)) {
                let res0 = PersonAttrToken._try_attach(t.next.next.next, loc_onto, attrs);
                if (res0 !== null && res0.prop_ref !== null && res0.chars.is_latin_letter) {
                    res0.begin_token = t;
                    res0.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, t.get_referent(), false, 0);
                    return res0;
                }
            }
            return null;
        }
        if (MiscHelper.is_eng_article(tt)) {
            let res0 = PersonAttrToken._try_attach(t.next, loc_onto, attrs);
            if (res0 !== null) {
                res0.begin_token = t;
                return res0;
            }
        }
        if ((tt.term === "Г" || tt.term === "ГР" || tt.term === "М") || tt.term === "Д") {
            if (tt.next !== null && tt.next.is_hiphen && (tt.next.next instanceof TextToken)) {
                let pref = tt.term;
                let tail = (tt.next.next).term;
                let vars = null;
                if (pref === "Г") 
                    vars = PersonAttrToken.get_std_forms(tail, "ГОСПОДИН", "ГОСПОЖА");
                else if (pref === "ГР") 
                    vars = PersonAttrToken.get_std_forms(tail, "ГРАЖДАНИН", "ГРАЖДАНКА");
                else if (pref === "М") 
                    vars = PersonAttrToken.get_std_forms(tail, "МИСТЕР", null);
                else if (pref === "Д") {
                    if (PersonAttrToken._find_grade_last(tt.next.next.next, tt) !== null) {
                    }
                    else 
                        vars = PersonAttrToken.get_std_forms(tail, "ДОКТОР", null);
                }
                if (vars !== null) {
                    let res = PersonAttrToken._new2434(tt, tt.next.next, PersonAttrTerminType.PREFIX);
                    for (const v of vars) {
                        res.morph.add_item(v);
                        if (res.value === null) {
                            res.value = v.normal_case;
                            res.gender = v.gender;
                        }
                    }
                    return res;
                }
            }
        }
        if (tt.term === "ГР" || tt.term === "ГРАЖД") {
            let t1 = tt;
            if (tt.next !== null && tt.next.is_char('.')) 
                t1 = tt.next;
            if (t1.next instanceof NumberToken) 
                return null;
            return PersonAttrToken._new2442(tt, t1, PersonAttrTerminType.PREFIX, (tt.morph.language.is_ua ? "ГРОМАДЯНИН" : "ГРАЖДАНИН"));
        }
        let npt0 = null;
        for (let step = 0; step < 2; step++) {
            let toks = PersonAttrToken.m_termins.try_parse_all(t, TerminParseAttr.NO, 0);
            if (toks === null && t.is_value("ВРИО", null)) {
                toks = new Array();
                toks.push(TerminToken._new633(t, t, PersonAttrToken.m_termin_vrio));
            }
            else if (toks === null && (t instanceof TextToken) && t.morph.language.is_en) {
                let str = (t).term;
                if (str.endsWith("MAN") || str.endsWith("PERSON") || str.endsWith("MIST")) {
                    toks = new Array();
                    toks.push(TerminToken._new633(t, t, PersonAttrTermin._new2389(str, t.morph.language, PersonAttrTerminType.POSITION)));
                }
                else if (str === "MODEL" && (t.whitespaces_after_count < 2)) {
                    let rt = t.kit.process_referent("PERSON", t.next);
                    if (rt !== null && (rt.referent instanceof PersonReferent)) {
                        toks = new Array();
                        toks.push(TerminToken._new633(t, t, PersonAttrTermin._new2389(str, t.morph.language, PersonAttrTerminType.POSITION)));
                    }
                }
            }
            if ((toks === null && step === 0 && t.chars.is_latin_letter) && (t.whitespaces_after_count < 2)) {
                let npt1 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                if (npt1 !== null && npt1.begin_token !== npt1.end_token) {
                    let pits = PersonItemToken.try_attach_list(t, loc_onto, PersonItemTokenParseAttr.of((PersonItemTokenParseAttr.CANBELATIN.value()) | (PersonItemTokenParseAttr.IGNOREATTRS.value())), 10);
                    if (pits !== null && pits.length > 1 && pits[0].firstname !== null) 
                        npt1 = null;
                    let k = 0;
                    if (npt1 !== null) {
                        for (let tt2 = npt1.begin_token; tt2 !== null && tt2.end_char <= npt1.end_char; tt2 = tt2.next) {
                            let toks1 = PersonAttrToken.m_termins.try_parse_all(tt2, TerminParseAttr.NO, 0);
                            if (toks1 !== null) {
                                step = 1;
                                toks = toks1;
                                npt0 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, toks1[0].end_char, null);
                                if (!(toks[0].termin).is_doubt) {
                                    if (toks[0].morph.number === MorphNumber.PLURAL) {
                                    }
                                    else 
                                        break;
                                }
                            }
                            k++;
                            if (k >= 3 && t.chars.is_all_lower) {
                                if (!MiscHelper.is_eng_article(t.previous)) 
                                    break;
                            }
                        }
                    }
                }
                else if (((npt1 === null || npt1.end_token === t)) && t.chars.is_capital_upper) {
                    let mc = t.get_morph_class_in_dictionary();
                    if ((mc.is_misc || mc.is_preposition || mc.is_conjunction) || mc.is_personal_pronoun || mc.is_pronoun) {
                    }
                    else {
                        let tt1 = null;
                        if ((t.next !== null && t.next.is_hiphen && !t.is_whitespace_after) && !t.next.is_whitespace_after) 
                            tt1 = t.next.next;
                        else if (npt1 === null) 
                            tt1 = t.next;
                        let toks1 = PersonAttrToken.m_termins.try_parse_all(tt1, TerminParseAttr.NO, 0);
                        if (toks1 !== null && (toks1[0].termin).typ === PersonAttrTerminType.POSITION && (tt1.whitespaces_before_count < 2)) {
                            step = 1;
                            toks = toks1;
                        }
                    }
                }
            }
            if (toks !== null) {
                for (const tok of toks) {
                    if (((tok.morph.class0.is_preposition || tok.morph.contains_attr("к.ф.", null))) && tok.end_token === tok.begin_token) 
                        continue;
                    let pat = Utils.as(tok.termin, PersonAttrTermin);
                    if ((tok.end_token instanceof TextToken) && pat.canonic_text.startsWith((tok.end_token).term)) {
                        if (tok.length_char < pat.canonic_text.length) {
                            if (tok.end_token.next !== null && tok.end_token.next.is_char('.')) 
                                tok.end_token = tok.end_token.next;
                        }
                    }
                    if (pat.typ === PersonAttrTerminType.PREFIX) {
                        if (step === 0 || ((pat.canonic_text !== "ГРАЖДАНИН" && pat.canonic_text !== "ГРОМАДЯНИН"))) 
                            return PersonAttrToken._new2448(tok.begin_token, tok.end_token, PersonAttrTerminType.PREFIX, pat.canonic_text, tok.morph, pat.gender);
                    }
                    if (pat.typ === PersonAttrTerminType.BESTREGARDS) {
                        let end = tok.end_token;
                        if (end.next !== null && end.next.is_char_of(",")) 
                            end = end.next;
                        return PersonAttrToken._new2440(tok.begin_token, end, PersonAttrTerminType.BESTREGARDS, MorphCollection._new2439(MorphCase.NOMINATIVE));
                    }
                    if (pat.typ === PersonAttrTerminType.POSITION || pat.typ === PersonAttrTerminType.PREFIX || pat.typ === PersonAttrTerminType.KING) {
                        let res = PersonAttrToken.create_attr_position(tok, loc_onto, attrs);
                        if (res !== null) {
                            if (pat.typ === PersonAttrTerminType.KING) 
                                res.typ = pat.typ;
                            if (pat.gender !== MorphGender.UNDEFINED && res.gender === MorphGender.UNDEFINED) 
                                res.gender = pat.gender;
                            if (pat.can_has_person_after > 0) {
                                if (res.end_token.is_value(pat.canonic_text, null)) 
                                    res.can_has_person_after = pat.can_has_person_after;
                                else 
                                    for (let ii = pat.canonic_text.length - 1; ii > 0; ii--) {
                                        if (!Utils.isLetter(pat.canonic_text[ii])) {
                                            if (res.end_token.is_value(pat.canonic_text.substring(ii + 1), null)) 
                                                res.can_has_person_after = pat.can_has_person_after;
                                            break;
                                        }
                                    }
                            }
                            if (pat.can_be_same_surname) 
                                res.can_be_same_surname = true;
                            if (pat.can_be_independant) 
                                res.can_be_independent_property = true;
                            if (pat.is_doubt) {
                                res.is_doubt = true;
                                if (res.prop_ref !== null && ((res.prop_ref.find_slot(PersonPropertyReferent.ATTR_REF, null, true) !== null))) 
                                    res.is_doubt = false;
                            }
                            if ((t.end_char < res.begin_char) && res.prop_ref !== null) {
                                let tt1 = res.begin_token.previous;
                                if (tt1.is_hiphen) 
                                    res.prop_ref.name = (res.prop_ref.name + " " + MiscHelper.get_text_value(t, tt1.previous, GetTextAttr.NO).toLowerCase());
                                else 
                                    res.prop_ref.name = (MiscHelper.get_text_value(t, tt1, GetTextAttr.NO).toLowerCase() + " " + res.prop_ref.name);
                                res.begin_token = t;
                            }
                        }
                        if (res !== null) {
                            let pit = PersonItemToken.try_attach(t, null, PersonItemTokenParseAttr.IGNOREATTRS, null);
                            if (pit !== null && pit.typ === PersonItemTokenItemType.INITIAL) {
                                let ok = false;
                                pit = PersonItemToken.try_attach(pit.end_token.next, null, PersonItemTokenParseAttr.IGNOREATTRS, null);
                                if (pit !== null && pit.typ === PersonItemTokenItemType.INITIAL) {
                                    pit = PersonItemToken.try_attach(pit.end_token.next, null, PersonItemTokenParseAttr.IGNOREATTRS, null);
                                    if (pit !== null && pit.typ === PersonItemTokenItemType.INITIAL) 
                                        ok = true;
                                }
                                if (!ok) {
                                    if (PersonAttrToken._try_attach(tok.end_token.next, loc_onto, attrs) !== null) 
                                        ok = true;
                                }
                                if (!ok) 
                                    return null;
                            }
                            if (npt0 !== null) {
                                let ttt1 = (npt0.adjectives.length > 0 ? npt0.adjectives[0].begin_token : npt0.begin_token);
                                if (ttt1.begin_char < res.begin_char) 
                                    res.begin_token = ttt1;
                                res.anafor = npt0.anafor;
                                let empty_adj = null;
                                for (let i = 0; i < npt0.adjectives.length; i++) {
                                    let j = 0;
                                    for (j = 0; j < PersonAttrToken.m_empty_adjs.length; j++) {
                                        if (npt0.adjectives[i].is_value(PersonAttrToken.m_empty_adjs[j], null)) 
                                            break;
                                    }
                                    if (j < PersonAttrToken.m_empty_adjs.length) {
                                        empty_adj = PersonAttrToken.m_empty_adjs[j].toLowerCase();
                                        npt0.adjectives.splice(i, 1);
                                        break;
                                    }
                                }
                                let na0 = npt0.get_normal_case_text(null, true, MorphGender.UNDEFINED, false).toLowerCase();
                                let na1 = res.prop_ref.name;
                                for (let i = 1; i < (na0.length - 1); i++) {
                                    if (na1.startsWith(na0.substring(i))) {
                                        res.prop_ref.name = (na0.substring(0, 0 + i).trim() + " " + na1);
                                        break;
                                    }
                                }
                                if (empty_adj !== null) {
                                    let res1 = PersonAttrToken._new2451(res.begin_token, res.end_token, npt0.morph, res);
                                    res1.prop_ref = new PersonPropertyReferent();
                                    res1.prop_ref.name = empty_adj;
                                    res1.prop_ref.higher = res.prop_ref;
                                    res1.can_be_independent_property = res.can_be_independent_property;
                                    res1.typ = res.typ;
                                    if (res.begin_token !== res.end_token) 
                                        res.begin_token = res.begin_token.next;
                                    res = res1;
                                }
                            }
                            if (res !== null) 
                                res.morph.remove_not_in_dictionary_items();
                            return res;
                        }
                    }
                }
            }
            if (step > 0 || t.chars.is_latin_letter) 
                break;
            if (t.morph.class0.is_adjective || t.chars.is_latin_letter) {
            }
            else if (t.next !== null && t.next.is_hiphen) {
            }
            else 
                break;
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt === null || npt.end_token === t || npt.internal_noun !== null) 
                break;
            if (npt.end_token.is_value("ВИЦЕ", "ВІЦЕ")) 
                break;
            t = npt.end_token;
            npt0 = npt;
        }
        if ((t instanceof TextToken) && (((t.is_value("ВИЦЕ", "ВІЦЕ") || t.is_value("ЭКС", "ЕКС") || t.is_value("VICE", null)) || t.is_value("EX", null) || t.is_value("DEPUTY", null))) && t.next !== null) {
            let te = t.next;
            if (te.is_hiphen) 
                te = te.next;
            let ppp = PersonAttrToken._try_attach(te, loc_onto, attrs);
            if (ppp !== null) {
                if (t.begin_char < ppp.begin_char) {
                    ppp.begin_token = t;
                    if (ppp.prop_ref !== null && ppp.prop_ref.name !== null) 
                        ppp.prop_ref.name = ((t).term.toLowerCase() + "-" + ppp.prop_ref.name);
                }
                return ppp;
            }
            if ((te !== null && te.previous.is_hiphen && !te.is_whitespace_after) && !te.is_whitespace_before) {
                if (BracketHelper.is_bracket(te, false)) {
                    let br = BracketHelper.try_parse(te, BracketParseAttr.NO, 100);
                    if (br !== null && (te instanceof TextToken)) {
                        ppp = PersonAttrToken._new2433(t, br.end_token, br.end_token.previous.morph);
                        ppp.prop_ref = new PersonPropertyReferent();
                        ppp.prop_ref.name = ((t).term + "-" + MiscHelper.get_text_value(te.next, br.end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE)).toLowerCase();
                        return ppp;
                    }
                }
            }
        }
        if ((t instanceof TextToken) && t.chars.is_latin_letter) {
            if (t.is_value("STATE", null)) {
                let tt1 = t.next;
                if (MiscHelper.is_eng_adj_suffix(tt1)) 
                    tt1 = tt1.next.next;
                let res1 = PersonAttrToken._try_attach(tt1, loc_onto, attrs);
                if (res1 !== null && res1.prop_ref !== null) {
                    res1.begin_token = t;
                    res1.prop_ref.name = ((t).term.toLowerCase() + " " + res1.prop_ref.name);
                    return res1;
                }
            }
        }
        return null;
    }
    
    static get_std_forms(tail, w1, w2) {
        let res = new Array();
        let li1 = null;
        let li2 = null;
        let wrapli12455 = new RefOutArgWrapper();
        let inoutres2456 = PersonAttrToken.m_std_forms.tryGetValue(w1, wrapli12455);
        li1 = wrapli12455.value;
        if (!inoutres2456) {
            li1 = Morphology.get_all_wordforms(w1, null);
            PersonAttrToken.m_std_forms.put(w1, li1);
        }
        for (const v of li1) {
            if (LanguageHelper.ends_with(v.normal_case, tail)) 
                res.push(v);
        }
        if (w2 !== null) {
            let wrapli22453 = new RefOutArgWrapper();
            let inoutres2454 = PersonAttrToken.m_std_forms.tryGetValue(w2, wrapli22453);
            li2 = wrapli22453.value;
            if (!inoutres2454) {
                li2 = Morphology.get_all_wordforms(w2, null);
                PersonAttrToken.m_std_forms.put(w2, li2);
            }
        }
        if (li2 !== null) {
            for (const v of li2) {
                if (LanguageHelper.ends_with(v.normal_case, tail)) 
                    res.push(v);
            }
        }
        return (res.length > 0 ? res : null);
    }
    
    static create_attr_position(tok, loc_onto, attrs) {
        const PersonIdentityToken = require("./PersonIdentityToken");
        let ty2 = (tok.termin).typ2;
        if (ty2 === PersonAttrTerminType2.ABBR) {
            let pr0 = new PersonPropertyReferent();
            pr0.name = tok.termin.canonic_text;
            return PersonAttrToken._new2457(tok.begin_token, tok.end_token, pr0, PersonAttrTerminType.POSITION);
        }
        if (ty2 === PersonAttrTerminType2.IO || ty2 === PersonAttrTerminType2.IO2) {
            for (let k = 0; ; k++) {
                if (k > 0) {
                    if (ty2 === PersonAttrTerminType2.IO) 
                        return null;
                    if ((((tok.morph.number.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                        return null;
                    break;
                }
                let tt = tok.end_token.next;
                if (tt !== null && tt.morph.class0.is_preposition) 
                    tt = tt.next;
                let res_pat = PersonAttrToken._new2434(tok.begin_token, tok.end_token, PersonAttrTerminType.POSITION);
                res_pat.prop_ref = new PersonPropertyReferent();
                if (tt !== null && (tt.get_referent() instanceof PersonPropertyReferent)) {
                    res_pat.end_token = tt;
                    res_pat.prop_ref.higher = Utils.as(tt.get_referent(), PersonPropertyReferent);
                }
                else {
                    let aa = attrs;
                    if (ty2 === PersonAttrTerminType2.IO2) 
                        aa = PersonAttrTokenPersonAttrAttachAttrs.of((aa.value()) | (PersonAttrTokenPersonAttrAttachAttrs.AFTERZAMESTITEL.value()));
                    let pat = PersonAttrToken.try_attach(tt, loc_onto, aa);
                    if (pat === null) {
                        if (!((tt instanceof TextToken))) 
                            continue;
                        let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                        if (npt === null || npt.end_token === tok.end_token.next) 
                            continue;
                        pat = PersonAttrToken.try_attach(npt.end_token, loc_onto, PersonAttrTokenPersonAttrAttachAttrs.NO);
                        if (pat === null || pat.begin_token !== tt) 
                            continue;
                    }
                    if (pat.typ !== PersonAttrTerminType.POSITION) 
                        continue;
                    res_pat.end_token = pat.end_token;
                    res_pat.prop_ref.higher = pat.prop_ref;
                    res_pat.higher_prop_ref = pat;
                }
                let nam = tok.termin.canonic_text;
                let ts = res_pat.end_token.next;
                let te = null;
                for (; ts !== null; ts = ts.next) {
                    if (ts.morph.class0.is_preposition) {
                        if (ts.is_value("В", null) || ts.is_value("ПО", null)) {
                            if (ts.next instanceof ReferentToken) {
                                let r = ts.next.get_referent();
                                if (r.type_name === PersonAttrToken.obj_name_geo || r.type_name === PersonAttrToken.obj_name_org) {
                                    res_pat.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, r, false, 0);
                                    res_pat.end_token = ts.next;
                                }
                                else 
                                    te = ts.next;
                                ts = ts.next;
                                continue;
                            }
                            let rt11 = ts.kit.process_referent("NAMEDENTITY", ts.next);
                            if (rt11 !== null) {
                                res_pat.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, rt11, false, 0);
                                res_pat.end_token = rt11.end_token;
                                ts = rt11.end_token;
                                continue;
                            }
                        }
                        if (ts.is_value("ПО", null) && ts.next !== null) {
                            let nnn = NounPhraseHelper.try_parse(ts.next, NounPhraseParseAttr.NO, 0, null);
                            if (nnn !== null) 
                                ts = (te = nnn.end_token);
                            else if ((ts.next instanceof TextToken) && ((!ts.next.chars.is_all_lower && !ts.next.chars.is_capital_upper))) 
                                ts = (te = ts.next);
                            else 
                                break;
                            if (ts.next !== null && ts.next.is_and && nnn !== null) {
                                let nnn2 = NounPhraseHelper.try_parse(ts.next.next, NounPhraseParseAttr.NO, 0, null);
                                if (nnn2 !== null && !(MorphCase.ooBitand(nnn2.morph._case, nnn.morph._case)).is_undefined) 
                                    ts = (te = nnn2.end_token);
                            }
                            continue;
                        }
                        break;
                    }
                    if (ts !== res_pat.end_token.next && ts.chars.is_all_lower) {
                        let nnn = NounPhraseHelper.try_parse(ts, NounPhraseParseAttr.NO, 0, null);
                        if (nnn === null) 
                            break;
                        ts = (te = nnn.end_token);
                        continue;
                    }
                    break;
                }
                if (te !== null) {
                    let s = MiscHelper.get_text_value(res_pat.end_token.next, te, GetTextAttr.NO);
                    if (!Utils.isNullOrEmpty(s)) {
                        nam = (nam + " " + s);
                        res_pat.end_token = te;
                    }
                    if ((res_pat.higher_prop_ref !== null && (te.whitespaces_after_count < 4) && te.next.get_referent() !== null) && te.next.get_referent().type_name === PersonAttrToken.obj_name_org) {
                        res_pat.end_token = res_pat.higher_prop_ref.end_token = te.next;
                        res_pat.higher_prop_ref.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, te.next.get_referent(), false, 0);
                    }
                }
                let wrapnam2459 = new RefOutArgWrapper(nam);
                res_pat.begin_token = PersonAttrToken._analize_vise(res_pat.begin_token, wrapnam2459);
                nam = wrapnam2459.value;
                res_pat.prop_ref.name = nam.toLowerCase();
                res_pat.morph = tok.morph;
                return res_pat;
            }
        }
        if (ty2 === PersonAttrTerminType2.ADJ) {
            let pat = PersonAttrToken._try_attach(tok.end_token.next, loc_onto, attrs);
            if (pat === null || pat.typ !== PersonAttrTerminType.POSITION) 
                return null;
            if (tok.begin_char === tok.end_char && !tok.begin_token.morph.class0.is_undefined) 
                return null;
            pat.begin_token = tok.begin_token;
            pat.prop_ref.name = (tok.termin.canonic_text.toLowerCase() + " " + pat.prop_ref.name);
            pat.morph = tok.morph;
            return pat;
        }
        if (ty2 === PersonAttrTerminType2.IGNOREDADJ) {
            let pat = PersonAttrToken._try_attach(tok.end_token.next, loc_onto, attrs);
            if (pat === null || pat.typ !== PersonAttrTerminType.POSITION) 
                return null;
            pat.begin_token = tok.begin_token;
            pat.morph = tok.morph;
            return pat;
        }
        if (ty2 === PersonAttrTerminType2.GRADE) {
            let gr = PersonAttrToken.create_attr_grade(tok);
            if (gr !== null) 
                return gr;
            if (tok.begin_token.is_value("КАНДИДАТ", null)) {
                let tt = tok.end_token.next;
                if (tt !== null && tt.is_value("В", null)) 
                    tt = tt.next;
                else if ((tt !== null && tt.is_value("НА", null) && tt.next !== null) && ((tt.next.is_value("ПОСТ", null) || tt.next.is_value("ДОЛЖНОСТЬ", null)))) 
                    tt = tt.next.next;
                else 
                    tt = null;
                if (tt !== null) {
                    let pat2 = PersonAttrToken._try_attach(tt, loc_onto, PersonAttrTokenPersonAttrAttachAttrs.NO);
                    if (pat2 !== null) {
                        let res0 = PersonAttrToken._new2434(tok.begin_token, pat2.end_token, PersonAttrTerminType.POSITION);
                        res0.prop_ref = PersonPropertyReferent._new2435("кандидат");
                        res0.prop_ref.higher = pat2.prop_ref;
                        res0.higher_prop_ref = pat2;
                        res0.morph = tok.morph;
                        return res0;
                    }
                }
            }
            if (!tok.begin_token.is_value("ДОКТОР", null) && !tok.begin_token.is_value("КАНДИДАТ", null)) 
                return null;
        }
        let name = tok.termin.canonic_text.toLowerCase();
        let t0 = tok.begin_token;
        let t1 = tok.end_token;
        let wrapname2471 = new RefOutArgWrapper(name);
        t0 = PersonAttrToken._analize_vise(t0, wrapname2471);
        name = wrapname2471.value;
        let pr = new PersonPropertyReferent();
        if ((t1.next !== null && t1.next.is_hiphen && !t1.is_whitespace_after) && !t1.next.is_whitespace_after) {
            if (CharsInfo.ooEq(t1.next.next.chars, t1.chars) || PersonAttrToken.m_termins.try_parse(t1.next.next, TerminParseAttr.NO) !== null || ((t1.next.next.chars.is_all_lower && t1.next.next.chars.is_cyrillic_letter))) {
                let npt = NounPhraseHelper.try_parse(t1, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.end_token === t1.next.next) {
                    name = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false).toLowerCase();
                    t1 = npt.end_token;
                }
            }
        }
        let tname0 = t1.next;
        let tname1 = null;
        let category = null;
        let npt0 = null;
        for (let t = t1.next; t !== null; t = t.next) {
            if ((((attrs.value()) & (PersonAttrTokenPersonAttrAttachAttrs.ONLYKEYWORD.value()))) !== (PersonAttrTokenPersonAttrAttachAttrs.NO.value())) 
                break;
            if (MiscHelper.check_number_prefix(t) !== null) 
                break;
            if (t.is_newline_before) {
                let ok = false;
                if (t.get_referent() !== null) {
                    if (t.get_referent().type_name === PersonAttrToken.obj_name_org || (t.get_referent() instanceof GeoReferent)) {
                        if (pr.find_slot(PersonPropertyReferent.ATTR_REF, null, true) === null) 
                            ok = true;
                    }
                }
                if (t.newlines_before_count > 1 && !t.chars.is_all_lower) {
                    if (!ok) 
                        break;
                    if ((t.newlines_after_count < 3) && tok.begin_token.is_newline_before) {
                    }
                    else 
                        break;
                }
                if (tok.is_newline_before) {
                    if (PersonAttrToken.m_termins.try_parse(t, TerminParseAttr.NO) !== null) 
                        break;
                    else 
                        ok = true;
                }
                if (t0.previous !== null && t0.previous.is_char('(')) {
                    let br0 = BracketHelper.try_parse(t0.previous, BracketParseAttr.CANBEMANYLINES, 10);
                    if (br0 !== null && br0.end_char > t.end_char) 
                        ok = true;
                }
                if (!ok) {
                    let npt00 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSEPREPOSITION, 0, null);
                    if (npt00 !== null && npt00.end_token.next !== null && !PersonAttrToken._is_person(t)) {
                        let tt1 = npt00.end_token;
                        let zap = false;
                        let and = false;
                        for (let ttt = tt1.next; ttt !== null; ttt = ttt.next) {
                            if (!ttt.is_comma_and) 
                                break;
                            npt00 = NounPhraseHelper.try_parse(ttt.next, NounPhraseParseAttr.NO, 0, null);
                            if (npt00 === null) 
                                break;
                            tt1 = npt00.end_token;
                            if (ttt.is_char(',')) 
                                zap = true;
                            else {
                                and = true;
                                break;
                            }
                            ttt = npt00.end_token;
                        }
                        if (zap && !and) {
                        }
                        else if (tt1.next === null) {
                        }
                        else {
                            if (PersonAttrToken._is_person(tt1.next)) 
                                ok = true;
                            else if (tt1.next.get_referent() instanceof GeoReferent) {
                                if (PersonAttrToken._is_person(tt1.next.next)) 
                                    ok = true;
                                else {
                                    let ccc = null;
                                    let wrapccc2462 = new RefOutArgWrapper();
                                    let ttt = PersonAttrToken.try_attach_category(tt1.next.next, wrapccc2462);
                                    ccc = wrapccc2462.value;
                                    if (ttt !== null) 
                                        ok = true;
                                }
                            }
                            if (ok) {
                                t = (t1 = (tname1 = tt1));
                                continue;
                            }
                        }
                    }
                    break;
                }
            }
            if (t.is_char('(')) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    t = br.end_token;
                    let ok = true;
                    for (let ttt = br.begin_token; ttt !== br.end_token; ttt = ttt.next) {
                        if (ttt.chars.is_letter) {
                            if (!ttt.chars.is_all_lower) {
                                ok = false;
                                break;
                            }
                        }
                    }
                    if (!ok) 
                        break;
                    continue;
                }
                else 
                    break;
            }
            let pat = null;
            if ((((attrs.value()) & (PersonAttrTokenPersonAttrAttachAttrs.ONLYKEYWORD.value()))) === (PersonAttrTokenPersonAttrAttachAttrs.NO.value())) 
                pat = PersonAttrToken._try_attach(t, loc_onto, PersonAttrTokenPersonAttrAttachAttrs.ONLYKEYWORD);
            if (pat !== null) {
                if (pat.morph.number === MorphNumber.PLURAL && !pat.morph._case.is_nominative) {
                }
                else if (((tok.termin instanceof PersonAttrTermin) && (tok.termin).is_doubt && pat.prop_ref !== null) && pat.prop_ref.slots.length === 1 && tok.chars.is_latin_letter === pat.chars.is_latin_letter) {
                    t1 = (tname1 = (t = pat.end_token));
                    continue;
                }
                else if ((!tok.morph._case.is_genitive && (tok.termin instanceof PersonAttrTermin) && (tok.termin).can_has_person_after === 1) && pat.morph._case.is_genitive) {
                    let rr = null;
                    if (!t.kit.misc_data.containsKey("IgnorePersons")) {
                        t.kit.misc_data.put("IgnorePersons", null);
                        rr = t.kit.process_referent("PERSON", t);
                        if (t.kit.misc_data.containsKey("IgnorePersons")) 
                            t.kit.misc_data.remove("IgnorePersons");
                    }
                    if (rr !== null && rr.morph._case.is_genitive) {
                        pr.add_ext_referent(rr);
                        pr.add_slot(PersonPropertyReferent.ATTR_REF, rr.referent, false, 0);
                        t1 = (t = rr.end_token);
                    }
                    else 
                        t1 = (tname1 = (t = pat.end_token));
                    continue;
                }
                else if (t.is_value("ГР", null) && (pat.end_token.next instanceof TextToken) && !pat.end_token.next.chars.is_all_lower) {
                    let ppp = t.kit.process_referent("PERSON", pat.end_token.next.next);
                    if (ppp !== null) {
                        t1 = (tname1 = (t = pat.end_token));
                        continue;
                    }
                    break;
                }
                else 
                    break;
            }
            let te = t;
            if (te.next !== null && te.is_char_of(",в") && (((attrs.value()) & (PersonAttrTokenPersonAttrAttachAttrs.AFTERZAMESTITEL.value()))) === (PersonAttrTokenPersonAttrAttachAttrs.NO.value())) {
                te = te.next;
                if (te.is_value("ОРГАНИЗАЦИЯ", null) && (te.next instanceof ReferentToken) && te.next.get_referent().type_name === PersonAttrToken.obj_name_org) 
                    te = te.next;
            }
            else if (te.next !== null && te.morph.class0.is_preposition) {
                if ((((attrs.value()) & (PersonAttrTokenPersonAttrAttachAttrs.AFTERZAMESTITEL.value()))) === (PersonAttrTokenPersonAttrAttachAttrs.AFTERZAMESTITEL.value())) 
                    break;
                if (((te.is_value("ИЗ", null) || te.is_value("ПРИ", null) || te.is_value("ПО", null)) || te.is_value("НА", null) || te.is_value("ОТ", null)) || te.is_value("OF", null)) 
                    te = te.next;
            }
            else if ((te.is_hiphen && te.next !== null && !te.is_whitespace_before) && !te.is_whitespace_after && CharsInfo.ooEq(te.previous.chars, te.next.chars)) 
                continue;
            else if (te.is_value("REPRESENT", null) && (te.next instanceof ReferentToken)) 
                te = te.next;
            let r = te.get_referent();
            let r1 = null;
            if ((te.chars.is_latin_letter && te.length_char > 1 && !t0.chars.is_latin_letter) && !te.chars.is_all_lower) {
                if (r === null || r.type_name !== PersonAttrToken.obj_name_org) {
                    let wrapcategory2463 = new RefOutArgWrapper();
                    let tt = PersonAttrToken.try_attach_category(t, wrapcategory2463);
                    category = wrapcategory2463.value;
                    if (tt !== null && name !== null) {
                        t = (t1 = tt);
                        continue;
                    }
                    for (; te !== null; te = te.next) {
                        if (te.chars.is_letter) {
                            if (!te.chars.is_latin_letter) 
                                break;
                            t1 = (tname1 = (t = te));
                        }
                    }
                    continue;
                }
            }
            if (r !== null) {
                if ((r.type_name === PersonAttrToken.obj_name_geo && te.previous !== null && te.previous.is_value("ДЕЛО", "СПРАВІ")) && te.previous.previous !== null && te.previous.previous.is_value("ПО", null)) {
                    t1 = (tname1 = (t = te));
                    continue;
                }
                if ((r.type_name === PersonAttrToken.obj_name_geo || r.type_name === PersonAttrToken.obj_name_addr || r.type_name === PersonAttrToken.obj_name_org) || r.type_name === PersonAttrToken.obj_name_transport) {
                    if (t0.previous !== null && t0.previous.is_value("ОТ", null) && t.is_newline_before) 
                        break;
                    t1 = te;
                    pr.add_slot(PersonPropertyReferent.ATTR_REF, r, false, 0);
                    let posol = ((r.type_name === PersonAttrToken.obj_name_geo || r.type_name === PersonAttrToken.obj_name_org)) && LanguageHelper.ends_with_ex(name, "посол", "представитель", null, null);
                    if (posol) {
                        t = t1;
                        continue;
                    }
                    if ((((r.type_name === PersonAttrToken.obj_name_geo && t1.next !== null && t1.next.morph.class0.is_preposition) && t1.next.next !== null && !t1.next.is_value("О", null)) && !t1.next.is_value("ОБ", null) && (((attrs.value()) & (PersonAttrTokenPersonAttrAttachAttrs.AFTERZAMESTITEL.value()))) === (PersonAttrTokenPersonAttrAttachAttrs.NO.value())) && !(tok.termin).is_boss) {
                        if ((((r1 = t1.next.next.get_referent()))) !== null) {
                            if (r1.type_name === PersonAttrToken.obj_name_org) {
                                pr.add_slot(PersonPropertyReferent.ATTR_REF, r1, false, 0);
                                t = (t1 = t1.next.next);
                            }
                        }
                    }
                    if (r.type_name === PersonAttrToken.obj_name_org) {
                        for (t = te.next; t !== null; t = t.next) {
                            if (!t.is_comma_and || !((t.next instanceof ReferentToken))) 
                                break;
                            r = t.next.get_referent();
                            if (r === null) 
                                break;
                            if (r.type_name !== PersonAttrToken.obj_name_org) 
                                break;
                            pr.add_slot(PersonPropertyReferent.ATTR_REF, r, false, 0);
                            t = t.next;
                            t1 = t;
                            if (t.previous.is_and) {
                                t = t.next;
                                break;
                            }
                        }
                        for (; t !== null; t = t.next) {
                            if (t.is_newline_before) 
                                break;
                            if (t.is_value("В", null) || t.is_value("ОТ", null) || t.is_and) 
                                continue;
                            if (t.morph.language.is_ua) {
                                if (t.is_value("ВІД", null)) 
                                    continue;
                            }
                            if (((t instanceof TextToken) && t.chars.is_letter && !t.chars.is_all_lower) && t.previous.is_value("ОТ", "ВІД")) {
                                tname0 = t.previous;
                                tname1 = (t1 = t);
                                continue;
                            }
                            if ((t instanceof TextToken) && BracketHelper.can_be_start_of_sequence(t, false, false) && t.previous.is_value("ОТ", "ВІД")) {
                                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                                if (br !== null && (br.length_char < 100)) {
                                    tname0 = t.previous;
                                    tname1 = (t1 = (t = br.end_token));
                                    continue;
                                }
                            }
                            r = t.get_referent();
                            if (r === null) 
                                break;
                            if (r.type_name !== PersonAttrToken.obj_name_geo) {
                                if (r.type_name === PersonAttrToken.obj_name_org && t.previous !== null && ((t.previous.is_value("ОТ", null) || t.previous.is_value("ВІД", null)))) {
                                }
                                else 
                                    break;
                            }
                            pr.add_slot(PersonPropertyReferent.ATTR_REF, r, false, 0);
                            t1 = t;
                        }
                    }
                }
                if ((t1.next !== null && (t1.whitespaces_after_count < 2) && t1.next.chars.is_latin_letter) && !t1.next.chars.is_all_lower && MiscHelper.check_number_prefix(t1.next) === null) {
                    for (t = t1.next; t !== null; t = t.next) {
                        if (!((t instanceof TextToken))) 
                            break;
                        if (!t.chars.is_letter) 
                            break;
                        if (!t.chars.is_latin_letter) 
                            break;
                        if (t.kit.base_language.is_en) 
                            break;
                        t1 = (tname1 = t);
                    }
                }
                t = t1;
                if (((tname0 === t && tname1 === null && t.next !== null) && (((attrs.value()) & (PersonAttrTokenPersonAttrAttachAttrs.AFTERZAMESTITEL.value()))) === (PersonAttrTokenPersonAttrAttachAttrs.NO.value()) && name !== "президент") && t.next.is_value("ПО", null)) {
                    tname0 = t.next;
                    continue;
                }
                break;
            }
            if (category === null) {
                let wrapcategory2464 = new RefOutArgWrapper();
                let tt = PersonAttrToken.try_attach_category(t, wrapcategory2464);
                category = wrapcategory2464.value;
                if (tt !== null && name !== null) {
                    t = (t1 = tt);
                    continue;
                }
            }
            if (name === "премьер") 
                break;
            if (t instanceof TextToken) {
                if (t.is_value("ИМЕНИ", "ІМЕНІ")) 
                    break;
            }
            if (!t.chars.is_all_lower) {
                let pit = PersonItemToken.try_attach(t, loc_onto, PersonItemTokenParseAttr.of((PersonItemTokenParseAttr.CANBELATIN.value()) | (PersonItemTokenParseAttr.IGNOREATTRS.value())), null);
                if (pit !== null) {
                    if (pit.referent !== null) 
                        break;
                    if (pit.lastname !== null && ((pit.lastname.is_in_dictionary || pit.lastname.is_in_ontology))) 
                        break;
                    if (pit.firstname !== null && pit.firstname.is_in_dictionary) 
                        break;
                    let pits = PersonItemToken.try_attach_list(t, loc_onto, PersonItemTokenParseAttr.of((PersonItemTokenParseAttr.NO.value()) | (PersonItemTokenParseAttr.IGNOREATTRS.value())), 6);
                    if (pits !== null && pits.length > 0) {
                        if (pits.length === 2) {
                            if (pits[1].lastname !== null && pits[1].lastname.is_in_dictionary) 
                                break;
                            if (pits[1].typ === PersonItemTokenItemType.INITIAL && pits[0].lastname !== null) 
                                break;
                        }
                        if (pits.length === 3) {
                            if (pits[2].lastname !== null) {
                                if (pits[1].middlename !== null) 
                                    break;
                                if (pits[0].firstname !== null && pits[0].firstname.is_in_dictionary) 
                                    break;
                            }
                            if (pits[1].typ === PersonItemTokenItemType.INITIAL && pits[2].typ === PersonItemTokenItemType.INITIAL && pits[0].lastname !== null) 
                                break;
                        }
                        if (pits[0].typ === PersonItemTokenItemType.INITIAL) 
                            break;
                    }
                }
            }
            let test_person = false;
            if (!t.chars.is_all_lower) {
                if (t.kit.misc_data.containsKey("TestAttr")) {
                }
                else {
                    let pits = PersonItemToken.try_attach_list(t, null, PersonItemTokenParseAttr.IGNOREATTRS, 10);
                    if (pits !== null && pits.length > 1) {
                        let nnn = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                        let iii = 1;
                        if (nnn !== null && nnn.adjectives.length > 0) 
                            iii += nnn.adjectives.length;
                        test_person = true;
                        t.kit.misc_data.put("TestAttr", null);
                        let li = PersonIdentityToken.try_attach(pits, 0, MorphBaseInfo._new2465(MorphCase.ALL_CASES), null, false, false);
                        t.kit.misc_data.remove("TestAttr");
                        if (li.length > 0 && li[0].coef > 1) {
                            t.kit.misc_data.put("TestAttr", null);
                            let li1 = PersonIdentityToken.try_attach(pits, iii, MorphBaseInfo._new2465(MorphCase.ALL_CASES), null, false, false);
                            t.kit.misc_data.remove("TestAttr");
                            if (li1.length === 0) 
                                break;
                            if (li1[0].coef <= li[0].coef) 
                                break;
                        }
                        else {
                            t.kit.misc_data.put("TestAttr", null);
                            let li1 = PersonIdentityToken.try_attach(pits, 1, MorphBaseInfo._new2465(MorphCase.ALL_CASES), null, false, false);
                            t.kit.misc_data.remove("TestAttr");
                            if (li1.length > 0 && li1[0].coef >= 1 && li1[0].begin_token === t) 
                                continue;
                        }
                    }
                }
            }
            if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if ((br !== null && t.next.get_referent() !== null && t.next.get_referent().type_name === PersonAttrToken.obj_name_org) && t.next.next === br.end_token) {
                    pr.add_slot(PersonPropertyReferent.ATTR_REF, t.next.get_referent(), false, 0);
                    t1 = br.end_token;
                    break;
                }
                else if (br !== null && (br.length_char < 40)) {
                    t = (t1 = (tname1 = br.end_token));
                    continue;
                }
            }
            if ((t instanceof NumberToken) && t.previous.is_value("ГЛАВА", null)) 
                break;
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if ((npt === null && (t instanceof NumberToken) && (t.whitespaces_after_count < 3)) && (t.whitespaces_before_count < 3)) {
                let npt00 = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
                if (npt00 !== null) {
                    if (npt00.end_token.is_value("ОРДЕН", null) || npt00.end_token.is_value("МЕДАЛЬ", null)) 
                        npt = npt00;
                }
            }
            let test = false;
            if (npt !== null) {
                if (PersonAttrToken._exists_in_doctionary(npt.end_token) && ((npt.morph._case.is_genitive || npt.morph._case.is_instrumental))) 
                    test = true;
                else if (npt.begin_token === npt.end_token && t.length_char > 1 && ((t.chars.is_all_upper || t.chars.is_last_lower))) 
                    test = true;
            }
            else if (t.chars.is_all_upper || t.chars.is_last_lower) 
                test = true;
            if (test) {
                let rto = t.kit.process_referent("ORGANIZATION", t);
                if (rto !== null) {
                    let str = rto.referent.toString().toUpperCase();
                    if (str.startsWith("ГОСУДАРСТВЕННАЯ ГРАЖДАНСКАЯ СЛУЖБА")) 
                        rto = null;
                }
                if (rto !== null && rto.end_char >= t.end_char && rto.begin_char === t.begin_char) {
                    pr.add_slot(PersonPropertyReferent.ATTR_REF, rto.referent, false, 0);
                    pr.add_ext_referent(rto);
                    t = (t1 = rto.end_token);
                    if ((((attrs.value()) & (PersonAttrTokenPersonAttrAttachAttrs.AFTERZAMESTITEL.value()))) !== (PersonAttrTokenPersonAttrAttachAttrs.NO.value())) 
                        break;
                    npt0 = npt;
                    if (t.next !== null && t.next.is_and) {
                        let rto2 = t.kit.process_referent("ORGANIZATION", t.next.next);
                        if (rto2 !== null && rto2.begin_char === t.next.next.begin_char) {
                            pr.add_slot(PersonPropertyReferent.ATTR_REF, rto2.referent, false, 0);
                            pr.add_ext_referent(rto2);
                            t = (t1 = rto2.end_token);
                        }
                    }
                    continue;
                }
                if (npt !== null) {
                    t = (t1 = (tname1 = npt.end_token));
                    npt0 = npt;
                    continue;
                }
            }
            if (t.morph.class0.is_preposition) {
                npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
                if (npt === null && t.next !== null && t.next.morph.class0.is_adverb) 
                    npt = NounPhraseHelper.try_parse(t.next.next, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && PersonAttrToken._exists_in_doctionary(npt.end_token)) {
                    let ok = false;
                    if ((t.is_value("ПО", null) && npt.morph._case.is_dative && !npt.noun.is_value("ИМЯ", "ІМЯ")) && !npt.noun.is_value("ПРОЗВИЩЕ", "ПРІЗВИСЬКО") && !npt.noun.is_value("ПРОЗВАНИЕ", "ПРОЗВАННЯ")) {
                        ok = true;
                        if (npt.noun.is_value("РАБОТА", "РОБОТА") || npt.noun.is_value("ПОДДЕРЖКА", "ПІДТРИМКА") || npt.noun.is_value("СОПРОВОЖДЕНИЕ", "СУПРОВІД")) {
                            let npt2 = NounPhraseHelper.try_parse(npt.end_token.next, NounPhraseParseAttr.PARSEPREPOSITION, 0, null);
                            if (npt2 !== null) 
                                npt = npt2;
                        }
                    }
                    else if (npt.noun.is_value("ОТСТАВКА", null) || npt.noun.is_value("ВІДСТАВКА", null)) 
                        ok = true;
                    else if (name === "кандидат" && t.is_value("В", null)) 
                        ok = true;
                    if (ok) {
                        t = (t1 = (tname1 = npt.end_token));
                        npt0 = npt;
                        continue;
                    }
                }
                if (t.is_value("OF", null)) 
                    continue;
            }
            else if (t.is_and && npt0 !== null) {
                npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && !(MorphClass.ooBitand(npt.morph.class0, npt0.morph.class0)).is_undefined) {
                    if (CharsInfo.ooEq(npt0.chars, npt.chars)) {
                        t = (t1 = (tname1 = npt.end_token));
                        npt0 = null;
                        continue;
                    }
                }
            }
            else if (t.is_comma_and && ((!t.is_newline_after || tok.is_newline_before)) && npt0 !== null) {
                npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && !(MorphClass.ooBitand(npt.morph.class0, npt0.morph.class0)).is_undefined) {
                    if (CharsInfo.ooEq(npt0.chars, npt.chars) && npt.end_token.next !== null && npt.end_token.next.is_and) {
                        let npt1 = NounPhraseHelper.try_parse(npt.end_token.next.next, NounPhraseParseAttr.NO, 0, null);
                        if (npt1 !== null && !(MorphClass.ooBitand(npt1.morph.class0, MorphClass.ooBitand(npt.morph.class0, npt0.morph.class0))).is_undefined) {
                            if (CharsInfo.ooEq(npt0.chars, npt1.chars)) {
                                t = (t1 = (tname1 = npt1.end_token));
                                npt0 = null;
                                continue;
                            }
                        }
                    }
                }
            }
            else if (t.morph.class0.is_adjective && BracketHelper.can_be_start_of_sequence(t.next, true, false)) {
                let br = BracketHelper.try_parse(t.next, BracketParseAttr.NO, 100);
                if (br !== null && (br.length_char < 100)) {
                    t = (t1 = (tname1 = br.end_token));
                    npt0 = null;
                    continue;
                }
            }
            if (t.chars.is_latin_letter && t.previous.chars.is_cyrillic_letter) {
                for (; t !== null; t = t.next) {
                    if (!t.chars.is_latin_letter || t.is_newline_before) 
                        break;
                    else 
                        t1 = (tname1 = t);
                }
                break;
            }
            if (((t.chars.is_all_upper || ((!t.chars.is_all_lower && !t.chars.is_capital_upper)))) && t.length_char > 1 && !t0.chars.is_all_upper) {
                t1 = (tname1 = t);
                continue;
            }
            if (t.chars.is_last_lower && t.length_char > 2 && !t0.chars.is_all_upper) {
                t1 = (tname1 = t);
                continue;
            }
            if (((t.chars.is_letter && (t.next instanceof ReferentToken) && (t.next.get_referent() instanceof PersonReferent)) && !t.morph.class0.is_preposition && !t.morph.class0.is_conjunction) && !t.morph.class0.is_verb) {
                t1 = (tname1 = t);
                break;
            }
            if (t instanceof NumberToken) {
                if ((t).begin_token.is_value("МИЛЛИОНОВ", null) || (t).begin_token.is_value("МІЛЬЙОНІВ", null)) {
                    t1 = (tname1 = t);
                    break;
                }
            }
            if (test_person) {
                if (t.next === null) 
                    break;
                te = t.next;
                if (((te.is_char_of(",в") || te.is_value("ИЗ", null))) && te.next !== null) 
                    te = te.next;
                if ((((r = te.get_referent()))) !== null) {
                    if (r.type_name === PersonAttrToken.obj_name_geo || r.type_name === PersonAttrToken.obj_name_org || r.type_name === PersonAttrToken.obj_name_transport) {
                        t1 = (tname1 = t);
                        continue;
                    }
                }
                break;
            }
            if (t.morph.language.is_en) 
                break;
            if (t.morph.class0.is_noun && t.get_morph_class_in_dictionary().is_undefined && (t.whitespaces_before_count < 2)) {
                t1 = (tname1 = t);
                continue;
            }
            if (t.morph.class0.is_pronoun) 
                continue;
            break;
        }
        if (tname1 !== null) {
            if (pr.find_slot(PersonPropertyReferent.ATTR_REF, null, true) === null && (((((tname1.is_value("КОМПАНИЯ", "КОМПАНІЯ") || tname1.is_value("ФИРМА", "ФІРМА") || tname1.is_value("ПРЕДПРИЯТИЕ", "ПІДПРИЄМСТВО")) || tname1.is_value("ПРЕЗИДИУМ", "ПРЕЗИДІЯ") || tname1.is_value("ЧАСТЬ", "ЧАСТИНА")) || tname1.is_value("ФЕДЕРАЦИЯ", "ФЕДЕРАЦІЯ") || tname1.is_value("ВЕДОМСТВО", "ВІДОМСТВО")) || tname1.is_value("БАНК", null) || tname1.is_value("КОРПОРАЦИЯ", "КОРПОРАЦІЯ")))) {
                if (tname1 === tname0 || ((tname0.is_value("ЭТОТ", "ЦЕЙ") && tname0.next === tname1))) {
                    let _org = null;
                    let cou = 0;
                    for (let tt0 = t0.previous; tt0 !== null; tt0 = tt0.previous) {
                        if (tt0.is_newline_after) 
                            cou += 10;
                        if ((++cou) > 500) 
                            break;
                        let rs0 = tt0.get_referents();
                        if (rs0 === null) 
                            continue;
                        let has_org = false;
                        for (const r0 of rs0) {
                            if (r0.type_name === PersonAttrToken.obj_name_org) {
                                has_org = true;
                                if (tname1.is_value("БАНК", null)) {
                                    if (r0.find_slot("TYPE", "банк", true) === null) 
                                        continue;
                                }
                                if (tname1.is_value("ЧАСТЬ", "ЧАСТИНА")) {
                                    let ok1 = false;
                                    for (const s of r0.slots) {
                                        if (s.type_name === "TYPE") {
                                            if ((String(s.value)).endsWith("часть") || (String(s.value)).endsWith("частина")) 
                                                ok1 = true;
                                        }
                                    }
                                    if (!ok1) 
                                        continue;
                                }
                                _org = r0;
                                break;
                            }
                        }
                        if (_org !== null || has_org) 
                            break;
                    }
                    if (_org !== null) {
                        pr.add_slot(PersonPropertyReferent.ATTR_REF, _org, false, 0);
                        tname1 = null;
                    }
                }
            }
        }
        if (tname1 !== null) {
            let s = MiscHelper.get_text_value(tname0, tname1, GetTextAttr.NO);
            if (s !== null) 
                name = (name + " " + s.toLowerCase());
        }
        if (category !== null) 
            name = (name + " " + category);
        else {
            let wrapcategory2468 = new RefOutArgWrapper();
            let tt = PersonAttrToken.try_attach_category(t1.next, wrapcategory2468);
            category = wrapcategory2468.value;
            if (tt !== null) {
                name = (name + " " + category);
                t1 = tt;
            }
        }
        pr.name = name;
        let res = PersonAttrToken._new2469(t0, t1, PersonAttrTerminType.POSITION, pr, tok.morph);
        res.can_be_independent_property = (tok.termin).can_be_unique_identifier;
        let i = name.indexOf("заместитель ");
        if (i < 0) 
            i = name.indexOf("заступник ");
        if (i >= 0) {
            i += 11;
            let res1 = PersonAttrToken._new2440(t0, t1, PersonAttrTerminType.POSITION, tok.morph);
            res1.prop_ref = new PersonPropertyReferent();
            res1.prop_ref.name = name.substring(0, 0 + i);
            res1.prop_ref.higher = res.prop_ref;
            res1.higher_prop_ref = res;
            res.prop_ref.name = name.substring(i + 1);
            return res1;
        }
        return res;
    }
    
    static _exists_in_doctionary(t) {
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return false;
        for (const wf of tt.morph.items) {
            if ((wf).is_in_dictionary) 
                return true;
        }
        return false;
    }
    
    static _is_person(t) {
        if (t === null) 
            return false;
        if (t instanceof ReferentToken) 
            return t.get_referent() instanceof PersonReferent;
        if (!t.chars.is_letter || t.chars.is_all_lower) 
            return false;
        let rt00 = t.kit.process_referent("PERSON", t);
        return rt00 !== null && (rt00.referent instanceof PersonReferent);
    }
    
    static _analize_vise(t0, name) {
        if (t0 === null) 
            return null;
        if (t0.previous !== null && t0.previous.is_hiphen && (t0.previous.previous instanceof TextToken)) {
            if (t0.previous.previous.is_value("ВИЦЕ", "ВІЦЕ")) {
                t0 = t0.previous.previous;
                name.value = (((t0.kit.base_language.is_ua ? "віце-" : "вице-"))) + name.value;
            }
            if (t0.previous !== null && t0.previous.previous !== null) {
                if (t0.previous.previous.is_value("ЭКС", "ЕКС")) {
                    t0 = t0.previous.previous;
                    name.value = (((t0.kit.base_language.is_ua ? "екс-" : "экс-"))) + name.value;
                }
                else if (CharsInfo.ooEq(t0.previous.previous.chars, t0.chars) && !t0.is_whitespace_before && !t0.previous.is_whitespace_before) {
                    let npt00 = NounPhraseHelper.try_parse(t0.previous.previous, NounPhraseParseAttr.NO, 0, null);
                    if (npt00 !== null) {
                        name.value = npt00.get_normal_case_text(null, false, MorphGender.UNDEFINED, false).toLowerCase();
                        t0 = t0.previous.previous;
                    }
                }
            }
        }
        return t0;
    }
    
    static try_attach_category(t, cat) {
        cat.value = null;
        if (t === null || t.next === null) 
            return null;
        let tt = null;
        let num = -1;
        if (t instanceof NumberToken) {
            if ((t).int_value === null) 
                return null;
            num = (t).int_value;
            tt = t;
        }
        else {
            let npt = NumberHelper.try_parse_roman(t);
            if (npt !== null && npt.int_value !== null) {
                num = npt.int_value;
                tt = npt.end_token;
            }
        }
        if ((num < 0) && ((t.is_value("ВЫСШИЙ", null) || t.is_value("ВЫСШ", null) || t.is_value("ВИЩИЙ", null)))) {
            num = 0;
            tt = t;
            if (tt.next !== null && tt.next.is_char('.')) 
                tt = tt.next;
        }
        if (tt === null || tt.next === null || (num < 0)) 
            return null;
        tt = tt.next;
        if (tt.is_value("КАТЕГОРИЯ", null) || tt.is_value("КАТЕГОРІЯ", null) || tt.is_value("КАТ", null)) {
            if (tt.next !== null && tt.next.is_char('.')) 
                tt = tt.next;
            if (num === 0) 
                cat.value = (tt.kit.base_language.is_ua ? "вищої категорії" : "высшей категории");
            else 
                cat.value = (tt.kit.base_language.is_ua ? (String(num) + " категорії") : (String(num) + " категории"));
            return tt;
        }
        if (tt.is_value("РАЗРЯД", null) || tt.is_value("РОЗРЯД", null)) {
            if (num === 0) 
                cat.value = (tt.kit.base_language.is_ua ? "вищого розряду" : "высшего разряда");
            else 
                cat.value = (tt.kit.base_language.is_ua ? (String(num) + " розряду") : (String(num) + " разряда"));
            return tt;
        }
        if (tt.is_value("КЛАСС", null) || tt.is_value("КЛАС", null)) {
            if (num === 0) 
                cat.value = (tt.kit.base_language.is_ua ? "вищого класу" : "высшего класса");
            else 
                cat.value = (tt.kit.base_language.is_ua ? (String(num) + " класу") : (String(num) + " класса"));
            return tt;
        }
        if (tt.is_value("РАНГ", null)) {
            if (num === 0) 
                return null;
            else 
                cat.value = (String(num) + " ранга");
            return tt;
        }
        if (tt.is_value("СОЗЫВ", null) || tt.is_value("СКЛИКАННЯ", null)) {
            if (num === 0) 
                return null;
            else 
                cat.value = (tt.kit.base_language.is_ua ? (String(num) + " скликання") : (String(num) + " созыва"));
            return tt;
        }
        return null;
    }
    
    static create_attr_grade(tok) {
        let t1 = PersonAttrToken._find_grade_last(tok.end_token.next, tok.begin_token);
        if (t1 === null) 
            return null;
        let pr = new PersonPropertyReferent();
        pr.name = (tok.termin.canonic_text.toLowerCase() + " наук");
        return PersonAttrToken._new2472(tok.begin_token, t1, PersonAttrTerminType.POSITION, pr, tok.morph, false);
    }
    
    static _find_grade_last(t, t0) {
        let i = 0;
        let t1 = null;
        for (; t !== null; t = t.next) {
            if (t.is_value("НАУК", null)) {
                t1 = t;
                i++;
                break;
            }
            if (t.is_value("Н", null)) {
                if (t0.length_char > 1 || CharsInfo.ooNoteq(t0.chars, t.chars)) 
                    return null;
                if ((t.next !== null && t.next.is_hiphen && t.next.next !== null) && t.next.next.is_value("К", null)) {
                    t1 = t.next.next;
                    break;
                }
                if (t.next !== null && t.next.is_char('.')) {
                    t1 = t.next;
                    break;
                }
            }
            if (!t.chars.is_all_lower && t0.chars.is_all_lower) 
                break;
            if ((++i) > 2) 
                break;
            if (t.next !== null && t.next.is_char('.')) 
                t = t.next;
            if (t.next !== null && t.next.is_hiphen) 
                t = t.next;
        }
        if (t1 === null || i === 0) 
            return null;
        return t1;
    }
    
    static check_kind(pr) {
        if (pr === null) 
            return PersonPropertyKind.UNDEFINED;
        let n = pr.get_string_value(PersonPropertyReferent.ATTR_NAME);
        if (n === null) 
            return PersonPropertyKind.UNDEFINED;
        n = n.toUpperCase();
        for (const nn of Utils.splitString(n, ' ' + '-', false)) {
            let li = PersonAttrToken.m_termins.try_attach_str(nn, MorphLang.RU);
            if (li === null || li.length === 0) 
                li = PersonAttrToken.m_termins.try_attach_str(n, MorphLang.UA);
            if (li !== null && li.length > 0) {
                let pat = Utils.as(li[0], PersonAttrTermin);
                if (pat.is_boss) 
                    return PersonPropertyKind.BOSS;
                if (pat.is_kin) 
                    return PersonPropertyKind.KIN;
                if (pat.typ === PersonAttrTerminType.KING) {
                    if (n !== "ДОН") 
                        return PersonPropertyKind.KING;
                }
                if (pat.is_military_rank) {
                    if (nn === "ВИЦЕ") 
                        continue;
                    if (nn === "КАПИТАН" || nn === "CAPTAIN" || nn === "КАПІТАН") {
                        let _org = Utils.as(pr.get_slot_value(PersonPropertyReferent.ATTR_REF), Referent);
                        if (_org !== null && _org.type_name === "ORGANIZATION") 
                            continue;
                    }
                    return PersonPropertyKind.MILITARYRANK;
                }
                if (pat.is_nation) 
                    return PersonPropertyKind.NATIONALITY;
            }
        }
        return PersonPropertyKind.UNDEFINED;
    }
    
    static try_attach_word(t) {
        let tok = PersonAttrToken.m_termins.try_parse(t, TerminParseAttr.NO);
        if ((tok !== null && tok.begin_token === tok.end_token && t.length_char === 1) && t.is_value("Д", null)) {
            if (BracketHelper.is_bracket(t.next, true) && !t.is_whitespace_after) 
                return null;
        }
        if (tok !== null && tok.termin.canonic_text === "ГРАФ") {
            tok.morph = new MorphCollection(t.morph);
            tok.morph.remove_items(MorphGender.MASCULINE, false);
        }
        if (tok !== null) {
            let pat = Utils.as(tok.termin, PersonAttrTermin);
            if (pat.typ2 !== PersonAttrTerminType2.UNDEFINED && pat.typ2 !== PersonAttrTerminType2.GRADE) 
                return null;
        }
        return tok;
    }
    
    static try_attach_position_word(t) {
        let tok = PersonAttrToken.m_termins.try_parse(t, TerminParseAttr.NO);
        if (tok === null) 
            return null;
        let pat = Utils.as(tok.termin, PersonAttrTermin);
        if (pat === null) 
            return null;
        if (pat.typ !== PersonAttrTerminType.POSITION) 
            return null;
        if (pat.typ2 !== PersonAttrTerminType2.IO2 && pat.typ2 !== PersonAttrTerminType2.UNDEFINED) 
            return null;
        return tok;
    }
    
    static _new2433(_arg1, _arg2, _arg3) {
        let res = new PersonAttrToken(_arg1, _arg2);
        res.morph = _arg3;
        return res;
    }
    
    static _new2434(_arg1, _arg2, _arg3) {
        let res = new PersonAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new2438(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new PersonAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.age = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new2440(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.morph = _arg4;
        return res;
    }
    
    static _new2442(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new2448(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new PersonAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.morph = _arg5;
        res.gender = _arg6;
        return res;
    }
    
    static _new2451(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonAttrToken(_arg1, _arg2);
        res.morph = _arg3;
        res.higher_prop_ref = _arg4;
        return res;
    }
    
    static _new2457(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonAttrToken(_arg1, _arg2);
        res.prop_ref = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new2469(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new PersonAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.prop_ref = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new2472(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new PersonAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.prop_ref = _arg4;
        res.morph = _arg5;
        res.can_be_independent_property = _arg6;
        return res;
    }
    
    static static_constructor() {
        PersonAttrToken.m_termins = null;
        PersonAttrToken.m_termin_vrio = null;
        PersonAttrToken.m_empty_adjs = ["УСПЕШНЫЙ", "ИЗВЕСТНЫЙ", "ЗНАМЕНИТЫЙ", "ИЗВЕСТНЕЙШИЙ", "ПОПУЛЯРНЫЙ", "ГЕНИАЛЬНЫЙ", "ТАЛАНТЛИВЫЙ", "МОЛОДОЙ", "УСПІШНИЙ", "ВІДОМИЙ", "ЗНАМЕНИТИЙ", "ВІДОМИЙ", "ПОПУЛЯРНИЙ", "ГЕНІАЛЬНИЙ", "ТАЛАНОВИТИЙ", "МОЛОДИЙ"];
        PersonAttrToken.m_std_forms = new Hashtable();
        PersonAttrToken.obj_name_geo = "GEO";
        PersonAttrToken.obj_name_addr = "ADDRESS";
        PersonAttrToken.obj_name_org = "ORGANIZATION";
        PersonAttrToken.obj_name_transport = "TRANSPORT";
        PersonAttrToken.obj_name_date = "DATE";
        PersonAttrToken.obj_name_date_range = "DATERANGE";
    }
}


PersonAttrToken.static_constructor();

module.exports = PersonAttrToken