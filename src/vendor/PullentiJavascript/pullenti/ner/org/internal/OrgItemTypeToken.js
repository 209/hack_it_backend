/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");
const Stream = require("./../../../unisharp/Stream");
const MemoryStream = require("./../../../unisharp/MemoryStream");
const XmlDocument = require("./../../../unisharp/XmlDocument");

const MorphGender = require("./../../../morph/MorphGender");
const GetTextAttr = require("./../../core/GetTextAttr");
const ReferentEqualType = require("./../../ReferentEqualType");
const CharsInfo = require("./../../../morph/CharsInfo");
const MetaToken = require("./../../MetaToken");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const GeoReferent = require("./../../geo/GeoReferent");
const TextToken = require("./../../TextToken");
const Token = require("./../../Token");
const OrganizationKind = require("./../OrganizationKind");
const IntOntologyCollection = require("./../../core/IntOntologyCollection");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const OrganizationReferent = require("./../OrganizationReferent");
const MorphCollection = require("./../../MorphCollection");
const NumberToken = require("./../../NumberToken");
const OrgItemNumberToken = require("./OrgItemNumberToken");
const OrgProfile = require("./../OrgProfile");
const OrgItemTerminTypes = require("./OrgItemTerminTypes");
const MorphLang = require("./../../../morph/MorphLang");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const Termin = require("./../../core/Termin");
const EpNerOrgInternalResourceHelper = require("./EpNerOrgInternalResourceHelper");
const BracketHelper = require("./../../core/BracketHelper");
const TerminCollection = require("./../../core/TerminCollection");
const MorphClass = require("./../../../morph/MorphClass");
const MorphNumber = require("./../../../morph/MorphNumber");
const ReferentToken = require("./../../ReferentToken");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const MorphSerializeHelper = require("./../../../morph/internal/MorphSerializeHelper");
const Morphology = require("./../../../morph/Morphology");
const MiscHelper = require("./../../core/MiscHelper");
const OrgItemTermin = require("./OrgItemTermin");

class OrgItemTypeToken extends MetaToken {
    
    static initialize() {
        if (OrgItemTypeToken.m_global !== null) 
            return;
        OrgItemTypeToken.m_global = new IntOntologyCollection();
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
        let tdat = EpNerOrgInternalResourceHelper.get_bytes("OrgTypes.dat");
        if (tdat === null) 
            throw new Error("Can't file resource file OrgTypes.dat in Organization analyzer");
        tdat = OrgItemTypeToken.deflate(tdat);
        let tmp = new MemoryStream(tdat); 
        try {
            tmp.position = 0;
            let xml = new XmlDocument();
            xml.loadStream(tmp);
            let set = null;
            for (const x of xml.document_element.child_nodes) {
                let its = OrgItemTermin.deserialize_src(x, set);
                if (x.local_name === "set") {
                    set = null;
                    if (its !== null && its.length > 0) 
                        set = its[0];
                }
                else if (its !== null) {
                    for (const ii of its) {
                        OrgItemTypeToken.m_global.add(ii);
                    }
                }
            }
        }
        finally {
            tmp.close();
        }
        let t = null;
        let sovs = ["СОВЕТ БЕЗОПАСНОСТИ", "НАЦИОНАЛЬНЫЙ СОВЕТ", "ГОСУДАРСТВЕННЫЙ СОВЕТ", "ОБЛАСТНОЙ СОВЕТ", "РАЙОННЫЙ СОВЕТ", "ГОРОДСКОЙ СОВЕТ", "СЕЛЬСКИЙ СОВЕТ", "КРАЕВОЙ СОВЕТ", "СЛЕДСТВЕННЫЙ КОМИТЕТ", "СЛЕДСТВЕННОЕ УПРАВЛЕНИЕ", "ГОСУДАРСТВЕННОЕ СОБРАНИЕ", "МУНИЦИПАЛЬНОЕ СОБРАНИЕ", "ГОРОДСКОЕ СОБРАНИЕ", "ЗАКОНОДАТЕЛЬНОЕ СОБРАНИЕ", "НАРОДНОЕ СОБРАНИЕ", "ОБЛАСТНАЯ ДУМА", "ГОРОДСКАЯ ДУМА", "КРАЕВАЯ ДУМА", "КАБИНЕТ МИНИСТРОВ"];
        let sov2 = ["СОВБЕЗ", "НАЦСОВЕТ", "ГОССОВЕТ", "ОБЛСОВЕТ", "РАЙСОВЕТ", "ГОРСОВЕТ", "СЕЛЬСОВЕТ", "КРАЙСОВЕТ", null, null, "ГОССОБРАНИЕ", "МУНСОБРАНИЕ", "ГОРСОБРАНИЕ", "ЗАКСОБРАНИЕ", "НАРСОБРАНИЕ", "ОБЛДУМА", "ГОРДУМА", "КРАЙДУМА", "КАБМИН"];
        for (let i = 0; i < sovs.length; i++) {
            t = OrgItemTermin._new1822(sovs[i], MorphLang.RU, OrgProfile.STATE, 4, OrgItemTerminTypes.ORG, true, true);
            if (sov2[i] !== null) {
                t.add_variant(sov2[i], false);
                if (sov2[i] === "ГОССОВЕТ" || sov2[i] === "НАЦСОВЕТ" || sov2[i] === "ЗАКСОБРАНИЕ") 
                    t.coeff = 5;
            }
            OrgItemTypeToken.m_global.add(t);
        }
        sovs = ["РАДА БЕЗПЕКИ", "НАЦІОНАЛЬНА РАДА", "ДЕРЖАВНА РАДА", "ОБЛАСНА РАДА", "РАЙОННА РАДА", "МІСЬКА РАДА", "СІЛЬСЬКА РАДА", "КРАЙОВИЙ РАДА", "СЛІДЧИЙ КОМІТЕТ", "СЛІДЧЕ УПРАВЛІННЯ", "ДЕРЖАВНІ ЗБОРИ", "МУНІЦИПАЛЬНЕ ЗБОРИ", "МІСЬКЕ ЗБОРИ", "ЗАКОНОДАВЧІ ЗБОРИ", "НАРОДНІ ЗБОРИ", "ОБЛАСНА ДУМА", "МІСЬКА ДУМА", "КРАЙОВА ДУМА", "КАБІНЕТ МІНІСТРІВ"];
        sov2 = ["РАДБЕЗ", null, null, "ОБЛРАДА", "РАЙРАДА", "МІСЬКРАДА", "СІЛЬРАДА", "КРАЙРАДА", null, null, "ДЕРЖЗБОРИ", "МУНЗБОРИ", "ГОРСОБРАНИЕ", "ЗАКЗБОРИ", "НАРСОБРАНИЕ", "ОБЛДУМА", "МІСЬКДУМА", "КРАЙДУМА", "КАБМІН"];
        for (let i = 0; i < sovs.length; i++) {
            t = OrgItemTermin._new1822(sovs[i], MorphLang.UA, OrgProfile.STATE, 4, OrgItemTerminTypes.ORG, true, true);
            if (sov2[i] !== null) 
                t.add_variant(sov2[i], false);
            if (sov2[i] === "ГОССОВЕТ" || sov2[i] === "ЗАКЗБОРИ") 
                t.coeff = 5;
            OrgItemTypeToken.m_global.add(t);
        }
        sovs = ["SECURITY COUNCIL", "NATIONAL COUNCIL", "STATE COUNCIL", "REGIONAL COUNCIL", "DISTRICT COUNCIL", "CITY COUNCIL", "RURAL COUNCIL", "INVESTIGATIVE COMMITTEE", "INVESTIGATION DEPARTMENT", "NATIONAL ASSEMBLY", "MUNICIPAL ASSEMBLY", "URBAN ASSEMBLY", "LEGISLATURE"];
        for (let i = 0; i < sovs.length; i++) {
            t = OrgItemTermin._new1822(sovs[i], MorphLang.EN, OrgProfile.STATE, 4, OrgItemTerminTypes.ORG, true, true);
            OrgItemTypeToken.m_global.add(t);
        }
        t = OrgItemTermin._new1825("ГОСУДАРСТВЕННЫЙ КОМИТЕТ", OrgItemTerminTypes.ORG, OrgProfile.STATE, 2);
        t.add_variant("ГОСКОМИТЕТ", false);
        t.add_variant("ГОСКОМ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1826("ДЕРЖАВНИЙ КОМІТЕТ", MorphLang.UA, OrgItemTerminTypes.ORG, OrgProfile.STATE, 2);
        t.add_variant("ДЕРЖКОМІТЕТ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1827("КРАЕВОЙ КОМИТЕТ ГОСУДАРСТВЕННОЙ СТАТИСТИКИ", OrgItemTerminTypes.DEP, OrgProfile.STATE, 3, true);
        t.add_variant("КРАЙКОМСТАТ", false);
        t.profile = OrgProfile.UNIT;
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1827("ОБЛАСТНОЙ КОМИТЕТ ГОСУДАРСТВЕННОЙ СТАТИСТИКИ", OrgItemTerminTypes.DEP, OrgProfile.STATE, 3, true);
        t.add_variant("ОБЛКОМСТАТ", false);
        t.profile = OrgProfile.UNIT;
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1827("РАЙОННЫЙ КОМИТЕТ ГОСУДАРСТВЕННОЙ СТАТИСТИКИ", OrgItemTerminTypes.DEP, OrgProfile.STATE, 3, true);
        t.add_variant("РАЙКОМСТАТ", false);
        t.profile = OrgProfile.UNIT;
        OrgItemTypeToken.m_global.add(t);
        sovs = ["ЦЕНТРАЛЬНЫЙ КОМИТЕТ", "РАЙОННЫЙ КОМИТЕТ", "ГОРОДСКОЙ КОМИТЕТ", "КРАЕВОЙ КОМИТЕТ", "ОБЛАСТНОЙ КОМИТЕТ", "ПОЛИТИЧЕСКОЕ БЮРО"];
        sov2 = ["ЦК", "РАЙКОМ", "ГОРКОМ", "КРАЙКОМ", "ОБКОМ", "ПОЛИТБЮРО"];
        for (let i = 0; i < sovs.length; i++) {
            t = OrgItemTermin._new1830(sovs[i], 2, OrgItemTerminTypes.DEP, OrgProfile.UNIT);
            if (i === 0) {
                t.acronym = "ЦК";
                t.can_be_normal_dep = true;
            }
            else if (sov2[i] !== null) 
                t.add_variant(sov2[i], false);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["Standing Committee", "Political Bureau", "Central Committee"]) {
            OrgItemTypeToken.m_global.add(OrgItemTermin._new1831(s.toUpperCase(), 3, OrgItemTerminTypes.DEP, OrgProfile.UNIT, true));
        }
        sovs = ["ЦЕНТРАЛЬНИЙ КОМІТЕТ", "РАЙОННИЙ КОМІТЕТ", "МІСЬКИЙ КОМІТЕТ", "КРАЙОВИЙ КОМІТЕТ", "ОБЛАСНИЙ КОМІТЕТ"];
        for (let i = 0; i < sovs.length; i++) {
            t = OrgItemTermin._new1832(sovs[i], MorphLang.UA, 2, OrgItemTerminTypes.DEP, OrgProfile.UNIT);
            if (i === 0) {
                t.acronym = "ЦК";
                t.can_be_normal_dep = true;
            }
            else if (sov2[i] !== null) 
                t.add_variant(sov2[i], false);
            OrgItemTypeToken.m_global.add(t);
        }
        t = OrgItemTermin._new1833("КАЗНАЧЕЙСТВО", 3, OrgItemTerminTypes.ORG, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1834("КАЗНАЧЕЙСТВО", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1833("TREASURY", 3, OrgItemTerminTypes.ORG, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1833("ПОСОЛЬСТВО", 3, OrgItemTerminTypes.ORG, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1833("EMNASSY", 3, OrgItemTerminTypes.ORG, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1838("ГОСУДАРСТВЕННЫЙ ДЕПАРТАМЕНТ", 5, OrgItemTerminTypes.ORG, true, true);
        t.add_variant("ГОСДЕПАРТАМЕНТ", false);
        t.add_variant("ГОСДЕП", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1838("DEPARTMENT OF STATE", 5, OrgItemTerminTypes.ORG, true, true);
        t.add_variant("STATE DEPARTMENT", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1840("ДЕРЖАВНИЙ ДЕПАРТАМЕНТ", MorphLang.UA, 5, OrgItemTerminTypes.ORG, true, true);
        t.add_variant("ДЕРЖДЕПАРТАМЕНТ", false);
        t.add_variant("ДЕРЖДЕП", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1841("ДЕПАРТАМЕНТ", 2, OrgItemTerminTypes.ORG));
        t = OrgItemTermin._new1841("DEPARTMENT", 2, OrgItemTerminTypes.ORG);
        t.add_abridge("DEPT.");
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1843("АГЕНТСТВО", 1, OrgItemTerminTypes.ORG, true);
        t.add_variant("АГЕНСТВО", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1843("ADGENCY", 1, OrgItemTerminTypes.ORG, true));
        t = OrgItemTermin._new1830("АКАДЕМИЯ", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION);
        t.profiles.push(OrgProfile.SCIENCE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1846("АКАДЕМІЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION);
        t.profiles.push(OrgProfile.SCIENCE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1830("ACADEMY", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION);
        t.profiles.push(OrgProfile.SCIENCE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1848("ГЕНЕРАЛЬНЫЙ ШТАБ", 3, OrgItemTerminTypes.DEP, true, true, OrgProfile.ARMY);
        t.add_variant("ГЕНЕРАЛЬНИЙ ШТАБ", false);
        t.add_variant("ГЕНШТАБ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1848("GENERAL STAFF", 3, OrgItemTerminTypes.DEP, true, true, OrgProfile.ARMY);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1850("ФРОНТ", 3, OrgItemTerminTypes.ORG, true, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1851("ВОЕННЫЙ ОКРУГ", 3, OrgItemTerminTypes.ORG, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1852("ВІЙСЬКОВИЙ ОКРУГ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1850("ГРУППА АРМИЙ", 3, OrgItemTerminTypes.ORG, true, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1854("ГРУПА АРМІЙ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1850("АРМИЯ", 3, OrgItemTerminTypes.ORG, true, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1854("АРМІЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1850("ARMY", 3, OrgItemTerminTypes.ORG, true, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1851("ГВАРДИЯ", 3, OrgItemTerminTypes.ORG, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1852("ГВАРДІЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1851("GUARD", 3, OrgItemTerminTypes.ORG, true, OrgProfile.ARMY));
        OrgItemTypeToken.m_military_unit = (t = OrgItemTermin._new1861("ВОЙСКОВАЯ ЧАСТЬ", 3, "ВЧ", OrgItemTerminTypes.ORG, true, OrgProfile.ARMY));
        t.add_abridge("В.Ч.");
        t.add_variant("ВОИНСКАЯ ЧАСТЬ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1862("ВІЙСЬКОВА ЧАСТИНА", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true);
        t.add_abridge("В.Ч.");
        OrgItemTypeToken.m_global.add(t);
        for (const s of ["ДИВИЗИЯ", "ДИВИЗИОН", "ПОЛК", "БАТАЛЬОН", "РОТА", "ВЗВОД", "АВИАДИВИЗИЯ", "АВИАПОЛК", "АРТБРИГАДА", "МОТОМЕХБРИГАДА", "ТАНКОВЫЙ КОРПУС", "ГАРНИЗОН", "ДРУЖИНА"]) {
            t = OrgItemTermin._new1863(s, 3, OrgItemTerminTypes.ORG, true, OrgProfile.ARMY);
            if (s === "ГАРНИЗОН") 
                t.can_be_single_geo = true;
            OrgItemTypeToken.m_global.add(t);
        }
        t = OrgItemTermin._new1863("ПОГРАНИЧНЫЙ ОТРЯД", 3, OrgItemTerminTypes.DEP, true, OrgProfile.ARMY);
        t.add_variant("ПОГРАНОТРЯД", false);
        t.add_abridge("ПОГРАН. ОТРЯД");
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1863("ПОГРАНИЧНЫЙ ПОЛК", 3, OrgItemTerminTypes.DEP, true, OrgProfile.ARMY);
        t.add_variant("ПОГРАНПОЛК", false);
        t.add_abridge("ПОГРАН. ПОЛК");
        OrgItemTypeToken.m_global.add(t);
        for (const s of ["ДИВІЗІЯ", "ДИВІЗІОН", "ПОЛК", "БАТАЛЬЙОН", "РОТА", "ВЗВОД", "АВІАДИВІЗІЯ", "АВІАПОЛК", "ПОГРАНПОЛК", "АРТБРИГАДА", "МОТОМЕХБРИГАДА", "ТАНКОВИЙ КОРПУС", "ГАРНІЗОН", "ДРУЖИНА"]) {
            t = OrgItemTermin._new1866(s, 3, MorphLang.UA, OrgItemTerminTypes.ORG, true, OrgProfile.ARMY);
            if (s === "ГАРНІЗОН") 
                t.can_be_single_geo = true;
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["КОРПУС", "БРИГАДА"]) {
            t = OrgItemTermin._new1863(s, 1, OrgItemTerminTypes.ORG, true, OrgProfile.ARMY);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["КОРПУС", "БРИГАДА"]) {
            t = OrgItemTermin._new1866(s, 1, MorphLang.UA, OrgItemTerminTypes.ORG, true, OrgProfile.ARMY);
            OrgItemTypeToken.m_global.add(t);
        }
        t = OrgItemTermin._new1866("ПРИКОРДОННИЙ ЗАГІН", 3, MorphLang.UA, OrgItemTerminTypes.DEP, true, OrgProfile.ARMY);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1830("ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1846("ДЕРЖАВНИЙ УНІВЕРСИТЕТ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1830("STATE UNIVERSITY", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1830("УНИВЕРСИТЕТ", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1846("УНІВЕРСИТЕТ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1875("UNIVERSITY", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1876("УЧРЕЖДЕНИЕ", 1, OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1877("УСТАНОВА", MorphLang.UA, 1, OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1876("INSTITUTION", 1, OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1841("ГОСУДАРСТВЕННОЕ УЧРЕЖДЕНИЕ", 3, OrgItemTerminTypes.ORG));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1880("ДЕРЖАВНА УСТАНОВА", MorphLang.UA, 3, OrgItemTerminTypes.ORG));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1833("STATE INSTITUTION", 3, OrgItemTerminTypes.ORG, true));
        t = OrgItemTermin._new1830("ИНСТИТУТ", 2, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION);
        t.profiles.push(OrgProfile.SCIENCE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1846("ІНСТИТУТ", MorphLang.UA, 2, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION);
        t.profiles.push(OrgProfile.SCIENCE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1830("INSTITUTE", 2, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION);
        t.profiles.push(OrgProfile.SCIENCE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1885("ОТДЕЛ СУДЕБНЫХ ПРИСТАВОВ", OrgItemTerminTypes.PREFIX, "ОСП", OrgProfile.UNIT, true, true);
        t.profiles.push(OrgProfile.JUSTICE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1885("МЕЖРАЙОННЫЙ ОТДЕЛ СУДЕБНЫХ ПРИСТАВОВ", OrgItemTerminTypes.PREFIX, "МОСП", OrgProfile.UNIT, true, true);
        t.add_variant("МЕЖРАЙОННЫЙ ОСП", false);
        t.profiles.push(OrgProfile.JUSTICE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1885("ОТДЕЛ ВНЕВЕДОМСТВЕННОЙ ОХРАНЫ", OrgItemTerminTypes.PREFIX, "ОВО", OrgProfile.UNIT, true, true);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1888("ЛИЦЕЙ", 2, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1889("ЛІЦЕЙ", MorphLang.UA, 2, OrgProfile.EDUCATION, OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1888("ИНТЕРНАТ", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1889("ІНТЕРНАТ", MorphLang.UA, 3, OrgProfile.EDUCATION, OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1892("HIGH SCHOOL", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1892("SECONDARY SCHOOL", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1892("MIDDLE SCHOOL", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1892("PUBLIC SCHOOL", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1892("JUNIOR SCHOOL", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1892("GRAMMAR SCHOOL", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION, true, true));
        t = OrgItemTermin._new1898("СРЕДНЯЯ ШКОЛА", 3, "СШ", OrgItemTerminTypes.ORG, OrgProfile.EDUCATION, true);
        t.add_variant("СРЕДНЯЯ ОБРАЗОВАТЕЛЬНАЯ ШКОЛА", false);
        t.add_abridge("СОШ");
        t.add_variant("ОБЩЕОБРАЗОВАТЕЛЬНАЯ ШКОЛА", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1899("БИЗНЕС ШКОЛА", 3, OrgItemTerminTypes.ORG, true, true, true, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1899("БІЗНЕС ШКОЛА", 3, OrgItemTerminTypes.ORG, true, true, true, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1889("СЕРЕДНЯ ШКОЛА", MorphLang.UA, 3, OrgProfile.EDUCATION, OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1830("ВЫСШАЯ ШКОЛА", 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1846("ВИЩА ШКОЛА", MorphLang.UA, 3, OrgItemTerminTypes.ORG, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("НАЧАЛЬНАЯ ШКОЛА", 3, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1905("ПОЧАТКОВА ШКОЛА", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("СЕМИНАРИЯ", 3, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1905("СЕМІНАРІЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("ГИМНАЗИЯ", 3, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1905("ГІМНАЗІЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION));
        t = OrgItemTermin._new1863("ДЕТСКИЙ САД", 3, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION);
        t.add_variant("ДЕТСАД", false);
        t.add_abridge("Д.С.");
        t.add_abridge("Д/С");
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1905("ДИТЯЧИЙ САДОК", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION);
        t.add_variant("ДИТСАДОК", false);
        t.add_abridge("Д.С.");
        t.add_abridge("Д/З");
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("ШКОЛА", 1, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1913("SCHOOL", 3, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("УЧИЛИЩЕ", 2, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("КОЛЛЕДЖ", 2, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1913("COLLEGE", 3, OrgItemTerminTypes.ORG, true, OrgProfile.EDUCATION, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1917("ЦЕНТР", OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1830("НАУЧНЫЙ ЦЕНТР", 3, OrgItemTerminTypes.ORG, OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1846("НАУКОВИЙ ЦЕНТР", MorphLang.UA, 3, OrgItemTerminTypes.ORG, OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1920("УЧЕБНО ВОСПИТАТЕЛЬНЫЙ КОМПЛЕКС", 3, OrgItemTerminTypes.ORG, "УВК", true, OrgProfile.EDUCATION, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("БОЛЬНИЦА", 2, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1905("ЛІКАРНЯ", MorphLang.UA, 2, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("МОРГ", 3, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1905("МОРГ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("ХОСПИС", 3, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1905("ХОСПІС", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        t = OrgItemTermin._new1863("ГОРОДСКАЯ БОЛЬНИЦА", 3, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE);
        t.add_abridge("ГОР.БОЛЬНИЦА");
        t.add_variant("ГОРБОЛЬНИЦА", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1905("МІСЬКА ЛІКАРНЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1929("ГОРОДСКАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА", 3, OrgItemTerminTypes.ORG, true, "ГКБ", OrgProfile.MEDICINE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1930("МІСЬКА КЛІНІЧНА ЛІКАРНЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, "МКЛ", OrgProfile.MEDICINE);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1931("КЛАДБИЩЕ", 3, OrgItemTerminTypes.ORG, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1862("КЛАДОВИЩЕ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("ПОЛИКЛИНИКА", 2, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1905("ПОЛІКЛІНІКА", MorphLang.UA, 2, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("ГОСПИТАЛЬ", 2, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1905("ГОСПІТАЛЬ", MorphLang.UA, 2, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1863("КЛИНИКА", 1, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1905("КЛІНІКА", MorphLang.UA, 1, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE));
        t = OrgItemTermin._new1863("МЕДИКО САНИТАРНАЯ ЧАСТЬ", 2, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE);
        t.add_variant("МЕДСАНЧАСТЬ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1905("МЕДИКО САНІТАРНА ЧАСТИНА", MorphLang.UA, 2, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE);
        t.add_variant("МЕДСАНЧАСТИНА", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1941("МЕДИЦИНСКИЙ ЦЕНТР", 2, OrgItemTerminTypes.ORG, true, true, true, OrgProfile.MEDICINE);
        t.add_variant("МЕДЦЕНТР", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1942("МЕДИЧНИЙ ЦЕНТР", MorphLang.UA, 2, OrgItemTerminTypes.ORG, true, true, true, OrgProfile.MEDICINE);
        t.add_variant("МЕДЦЕНТР", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1863("РОДИЛЬНЫЙ ДОМ", 1, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE);
        t.add_variant("РОДДОМ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1905("ПОЛОГОВИЙ БУДИНОК", MorphLang.UA, 1, OrgItemTerminTypes.ORG, true, OrgProfile.MEDICINE);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add((t = OrgItemTermin._new1945("АЭРОПОРТ", 3, OrgItemTerminTypes.ORG, true, true, true, true, OrgProfile.TRANSPORT)));
        OrgItemTypeToken.m_global.add((t = OrgItemTermin._new1946("АЕРОПОРТ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true, true, true)));
        t = OrgItemTermin._new1945("ТОРГОВЫЙ ПОРТ", 3, OrgItemTerminTypes.ORG, true, true, true, true, OrgProfile.TRANSPORT);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1945("МОРСКОЙ ТОРГОВЫЙ ПОРТ", 3, OrgItemTerminTypes.ORG, true, true, true, true, OrgProfile.TRANSPORT);
        OrgItemTypeToken.m_global.add(t);
        for (const s of ["ТЕАТР", "ТЕАТР-СТУДИЯ", "КИНОТЕАТР", "МУЗЕЙ", "ГАЛЕРЕЯ", "КОНЦЕРТНЫЙ ЗАЛ", "ФИЛАРМОНИЯ", "КОНСЕРВАТОРИЯ", "ДОМ КУЛЬТУРЫ", "ДВОРЕЦ КУЛЬТУРЫ", "ДВОРЕЦ ПИОНЕРОВ"]) {
            OrgItemTypeToken.m_global.add(OrgItemTermin._new1843(s, 3, OrgItemTerminTypes.ORG, true));
        }
        for (const s of ["ТЕАТР", "ТЕАТР-СТУДІЯ", "КІНОТЕАТР", "МУЗЕЙ", "ГАЛЕРЕЯ", "КОНЦЕРТНИЙ ЗАЛ", "ФІЛАРМОНІЯ", "КОНСЕРВАТОРІЯ", "БУДИНОК КУЛЬТУРИ", "ПАЛАЦ КУЛЬТУРИ", "ПАЛАЦ ПІОНЕРІВ"]) {
            OrgItemTypeToken.m_global.add(OrgItemTermin._new1950(s, MorphLang.UA, 3, OrgItemTerminTypes.ORG, true));
        }
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1951("БИБЛИОТЕКА", 3, OrgItemTerminTypes.ORG, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1952("БІБЛІОТЕКА", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true));
        for (const s of ["ЦЕРКОВЬ", "ХРАМ", "СОБОР", "МЕЧЕТЬ", "СИНАГОГА", "МОНАСТЫРЬ", "ЛАВРА", "ПАТРИАРХАТ", "МЕДРЕСЕ", "СЕКТА", "РЕЛИГИОЗНАЯ ГРУППА", "РЕЛИГИОЗНОЕ ОБЪЕДИНЕНИЕ", "РЕЛИГИОЗНАЯ ОРГАНИЗАЦИЯ"]) {
            OrgItemTypeToken.m_global.add(OrgItemTermin._new1953(s, 3, OrgItemTerminTypes.ORG, true, true, OrgProfile.RELIGION));
        }
        for (const s of ["ЦЕРКВА", "ХРАМ", "СОБОР", "МЕЧЕТЬ", "СИНАГОГА", "МОНАСТИР", "ЛАВРА", "ПАТРІАРХАТ", "МЕДРЕСЕ", "СЕКТА", "РЕЛІГІЙНА ГРУПА", "РЕЛІГІЙНЕ ОБЄДНАННЯ", " РЕЛІГІЙНА ОРГАНІЗАЦІЯ"]) {
            OrgItemTypeToken.m_global.add(OrgItemTermin._new1954(s, MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true, OrgProfile.RELIGION));
        }
        for (const s of ["ФЕДЕРАЛЬНАЯ СЛУЖБА", "ГОСУДАРСТВЕННАЯ СЛУЖБА", "ФЕДЕРАЛЬНОЕ УПРАВЛЕНИЕ", "ГОСУДАРСТВЕННЫЙ КОМИТЕТ", "ГОСУДАРСТВЕННАЯ ИНСПЕКЦИЯ"]) {
            t = OrgItemTermin._new1955(s, 3, OrgItemTerminTypes.ORG, true);
            OrgItemTypeToken.m_global.add(t);
            t = OrgItemTermin._new1956(s, 3, OrgItemTerminTypes.ORG, s);
            t.terms.splice(1, 0, Termin.Term._new1957(null, true));
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ФЕДЕРАЛЬНА СЛУЖБА", "ДЕРЖАВНА СЛУЖБА", "ФЕДЕРАЛЬНЕ УПРАВЛІННЯ", "ДЕРЖАВНИЙ КОМІТЕТ УКРАЇНИ", "ДЕРЖАВНА ІНСПЕКЦІЯ"]) {
            t = OrgItemTermin._new1958(s, MorphLang.UA, 3, OrgItemTerminTypes.ORG, true);
            OrgItemTypeToken.m_global.add(t);
            t = OrgItemTermin._new1959(s, MorphLang.UA, 3, OrgItemTerminTypes.ORG, s);
            t.terms.splice(1, 0, Termin.Term._new1957(null, true));
            OrgItemTypeToken.m_global.add(t);
        }
        t = OrgItemTermin._new1931("СЛЕДСТВЕННЫЙ ИЗОЛЯТОР", 5, OrgItemTerminTypes.ORG, true);
        t.add_variant("СИЗО", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1862("СЛІДЧИЙ ІЗОЛЯТОР", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true);
        t.add_variant("СІЗО", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1931("КОЛОНИЯ-ПОСЕЛЕНИЕ", 3, OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1862("КОЛОНІЯ-ПОСЕЛЕННЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1965("ТЮРЬМА", 3, OrgItemTerminTypes.ORG, true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1966("ВЯЗНИЦЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1931("КОЛОНИЯ", 2, OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1862("КОЛОНІЯ", MorphLang.UA, 2, OrgItemTerminTypes.ORG, true));
        OrgItemTypeToken.m_global.add((OrgItemTypeToken.m_ispr_kolon = OrgItemTermin._new1969("ИСПРАВИТЕЛЬНАЯ КОЛОНИЯ", 3, OrgItemTerminTypes.ORG, "ИК", true)));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1862("ВИПРАВНА КОЛОНІЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true));
        for (const s of ["ПОЛИЦИЯ", "МИЛИЦИЯ"]) {
            t = OrgItemTermin._new1971(s, OrgItemTerminTypes.ORG, 3, true, false);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ПОЛІЦІЯ", "МІЛІЦІЯ"]) {
            t = OrgItemTermin._new1972(s, MorphLang.UA, OrgItemTerminTypes.ORG, 3, true, false);
            OrgItemTypeToken.m_global.add(t);
        }
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1973("ПАЕВЫЙ ИНВЕСТИЦИОННЫЙ ФОНД", 2, OrgItemTerminTypes.ORG, "ПИФ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1974("РОССИЙСКОЕ ИНФОРМАЦИОННОЕ АГЕНТСТВО", 3, OrgItemTerminTypes.ORG, "РИА", OrgProfile.MEDIA));
        t = OrgItemTermin._new1974("ИНФОРМАЦИОННОЕ АГЕНТСТВО", 3, OrgItemTerminTypes.ORG, "ИА", OrgProfile.MEDIA);
        t.add_variant("ИНФОРМАГЕНТСТВО", false);
        t.add_variant("ИНФОРМАГЕНСТВО", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1976("ОТДЕЛ", 1, OrgItemTerminTypes.DEP, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1977("ВІДДІЛ", MorphLang.UA, 1, OrgItemTerminTypes.DEP, true, true));
        t = OrgItemTermin._new1978("РАЙОННЫЙ ОТДЕЛ", 2, "РО", OrgItemTerminTypes.DEP, true);
        t.add_variant("РАЙОТДЕЛ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1979("РАЙОННИЙ ВІДДІЛ", MorphLang.UA, 2, "РВ", OrgItemTerminTypes.DEP, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1931("ЦЕХ", 3, OrgItemTerminTypes.DEP, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1841("ФАКУЛЬТЕТ", 3, OrgItemTerminTypes.DEP);
        t.add_abridge("ФАК.");
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1841("КАФЕДРА", 3, OrgItemTerminTypes.DEP);
        t.add_abridge("КАФ.");
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1841("ЛАБОРАТОРИЯ", 1, OrgItemTerminTypes.DEP);
        t.add_abridge("ЛАБ.");
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1984("ЛАБОРАТОРІЯ", MorphLang.UA, 1, OrgItemTerminTypes.DEP);
        t.add_abridge("ЛАБ.");
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1851("ПАТРИАРХИЯ", 3, OrgItemTerminTypes.DEP, true, OrgProfile.RELIGION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1851("ПАТРІАРХІЯ", 3, OrgItemTerminTypes.DEP, true, OrgProfile.RELIGION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1851("ЕПАРХИЯ", 3, OrgItemTerminTypes.DEP, true, OrgProfile.RELIGION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1851("ЄПАРХІЯ", 3, OrgItemTerminTypes.DEP, true, OrgProfile.RELIGION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1989("ПРЕДСТАВИТЕЛЬСТВО", OrgItemTerminTypes.DEPADD));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1990("ПРЕДСТАВНИЦТВО", MorphLang.UA, OrgItemTerminTypes.DEPADD));
        t = OrgItemTermin._new1917("ОТДЕЛЕНИЕ", OrgItemTerminTypes.DEPADD, true);
        t.add_abridge("ОТД.");
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1992("ВІДДІЛЕННЯ", MorphLang.UA, OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1917("ИНСПЕКЦИЯ", OrgItemTerminTypes.DEPADD, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1992("ІНСПЕКЦІЯ", MorphLang.UA, OrgItemTerminTypes.DEPADD, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1989("ФИЛИАЛ", OrgItemTerminTypes.DEPADD));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1990("ФІЛІЯ", MorphLang.UA, OrgItemTerminTypes.DEPADD));
        t = OrgItemTermin._new1997("ОФИС", OrgItemTerminTypes.DEPADD, true, true);
        t.add_variant("ОПЕРАЦИОННЫЙ ОФИС", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1998("ОФІС", MorphLang.UA, OrgItemTerminTypes.DEPADD, true, true);
        t.add_variant("ОПЕРАЦІЙНИЙ ОФІС", false);
        OrgItemTypeToken.m_global.add(t);
        for (const s of ["ОТДЕЛ ПОЛИЦИИ", "ОТДЕЛ МИЛИЦИИ", "ОТДЕЛЕНИЕ ПОЛИЦИИ", "ОТДЕЛЕНИЕ МИЛИЦИИ"]) {
            OrgItemTypeToken.m_global.add(OrgItemTermin._new1999(s, OrgItemTerminTypes.DEP, 1.5, true, true));
            if (s.startsWith("ОТДЕЛ ")) {
                t = OrgItemTermin._new1999("ГОРОДСКОЙ " + s, OrgItemTerminTypes.DEP, 3, true, true);
                t.add_variant("ГОР" + s, false);
                OrgItemTypeToken.m_global.add(t);
                t = OrgItemTermin._new2001("РАЙОННЫЙ " + s, "РО", OrgItemTerminTypes.DEP, 3, true, true);
                OrgItemTypeToken.m_global.add(t);
            }
        }
        for (const s of ["ВІДДІЛ ПОЛІЦІЇ", "ВІДДІЛ МІЛІЦІЇ", "ВІДДІЛЕННЯ ПОЛІЦІЇ", "ВІДДІЛЕННЯ МІЛІЦІЇ"]) {
            OrgItemTypeToken.m_global.add(OrgItemTermin._new2002(s, MorphLang.UA, OrgItemTerminTypes.DEP, 1.5, true, true));
        }
        t = OrgItemTermin._new2003("ГЛАВНОЕ УПРАВЛЕНИЕ", "ГУ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2003("ЛИНЕЙНОЕ УПРАВЛЕНИЕ", "ЛУ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2005("ГОЛОВНЕ УПРАВЛІННЯ", MorphLang.UA, "ГУ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2003("ГЛАВНОЕ ТЕРРИТОРИАЛЬНОЕ УПРАВЛЕНИЕ", "ГТУ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2005("ГОЛОВНЕ ТЕРИТОРІАЛЬНЕ УПРАВЛІННЯ", MorphLang.UA, "ГТУ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2003("ОПЕРАЦИОННОЕ УПРАВЛЕНИЕ", "ОПЕРУ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2005("ОПЕРАЦІЙНЕ УПРАВЛІННЯ", MorphLang.UA, "ОПЕРУ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2010("ТЕРРИТОРИАЛЬНОЕ УПРАВЛЕНИЕ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2011("ТЕРИТОРІАЛЬНЕ УПРАВЛІННЯ", MorphLang.UA, OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2003("РЕГИОНАЛЬНОЕ УПРАВЛЕНИЕ", "РУ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2005("РЕГІОНАЛЬНЕ УПРАВЛІННЯ", MorphLang.UA, "РУ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1917("УПРАВЛЕНИЕ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1992("УПРАВЛІННЯ", MorphLang.UA, OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2003("ПОГРАНИЧНОЕ УПРАВЛЕНИЕ", "ПУ", OrgItemTerminTypes.DEPADD, true);
        OrgItemTypeToken.m_global.add(t);
        for (const s of ["ПРЕСС-СЛУЖБА", "ПРЕСС-ЦЕНТР", "КОЛЛ-ЦЕНТР", "БУХГАЛТЕРИЯ", "МАГИСТРАТУРА", "АСПИРАНТУРА", "ДОКТОРАНТУРА", "ОРДИНАТУРА", "СОВЕТ ДИРЕКТОРОВ", "УЧЕНЫЙ СОВЕТ", "КОЛЛЕГИЯ", "ПЛЕНУМ", "АППАРАТ", "НАБЛЮДАТЕЛЬНЫЙ СОВЕТ", "ОБЩЕСТВЕННЫЙ СОВЕТ", "РУКОВОДСТВО", "ДИРЕКЦИЯ", "ПРАВЛЕНИЕ", "ЖЮРИ", "ПРЕЗИДИУМ", "СЕКРЕТАРИАТ", "СИНОД", "PRESS", "PRESS CENTER", "CLIENT CENTER", "CALL CENTER", "ACCOUNTING", "MASTER DEGREE", "POSTGRADUATE", "DOCTORATE", "RESIDENCY", "BOARD OF DIRECTORS", "DIRECTOR BOARD", "ACADEMIC COUNCIL", "BOARD", "PLENARY", "UNIT", "SUPERVISORY BOARD", "PUBLIC COUNCIL", "LEADERSHIP", "MANAGEMENT", "JURY", "BUREAU", "SECRETARIAT"]) {
            OrgItemTypeToken.m_global.add(OrgItemTermin._new2017(s, OrgItemTerminTypes.DEPADD, true, OrgProfile.UNIT));
        }
        for (const s of ["ПРЕС-СЛУЖБА", "ПРЕС-ЦЕНТР", "БУХГАЛТЕРІЯ", "МАГІСТРАТУРА", "АСПІРАНТУРА", "ДОКТОРАНТУРА", "ОРДИНАТУРА", "РАДА ДИРЕКТОРІВ", "ВЧЕНА РАДА", "КОЛЕГІЯ", "ПЛЕНУМ", "АПАРАТ", "НАГЛЯДОВА РАДА", "ГРОМАДСЬКА РАДА", "КЕРІВНИЦТВО", "ДИРЕКЦІЯ", "ПРАВЛІННЯ", "ЖУРІ", "ПРЕЗИДІЯ", "СЕКРЕТАРІАТ"]) {
            OrgItemTypeToken.m_global.add(OrgItemTermin._new2018(s, MorphLang.UA, OrgItemTerminTypes.DEPADD, true, OrgProfile.UNIT));
        }
        t = OrgItemTermin._new2017("ОТДЕЛ ИНФОРМАЦИОННОЙ БЕЗОПАСНОСТИ", OrgItemTerminTypes.DEPADD, true, OrgProfile.UNIT);
        t.add_variant("ОТДЕЛ ИБ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2017("ОТДЕЛ ИНФОРМАЦИОННЫХ ТЕХНОЛОГИЙ", OrgItemTerminTypes.DEPADD, true, OrgProfile.UNIT);
        t.add_variant("ОТДЕЛ ИТ", false);
        t.add_variant("ОТДЕЛ IT", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1917("СЕКТОР", OrgItemTerminTypes.DEP, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2022("КУРС", OrgItemTerminTypes.DEP, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2023("ГРУППА", OrgItemTerminTypes.DEP, true, true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2024("ГРУПА", MorphLang.UA, OrgItemTerminTypes.DEP, true, true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2017("ДНЕВНОЕ ОТДЕЛЕНИЕ", OrgItemTerminTypes.DEP, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2018("ДЕННЕ ВІДДІЛЕННЯ", MorphLang.UA, OrgItemTerminTypes.DEP, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2017("ВЕЧЕРНЕЕ ОТДЕЛЕНИЕ", OrgItemTerminTypes.DEP, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2018("ВЕЧІРНЄ ВІДДІЛЕННЯ", MorphLang.UA, OrgItemTerminTypes.DEP, true, OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2010("ДЕЖУРНАЯ ЧАСТЬ", OrgItemTerminTypes.DEP, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2011("ЧЕРГОВА ЧАСТИНА", MorphLang.UA, OrgItemTerminTypes.DEP, true));
        t = OrgItemTermin._new2031("ПАСПОРТНЫЙ СТОЛ", OrgItemTerminTypes.DEP, true);
        t.add_abridge("П/С");
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2032("ПАСПОРТНИЙ СТІЛ", MorphLang.UA, OrgItemTerminTypes.DEP, true);
        t.add_abridge("П/С");
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2033("ВЫСШЕЕ УЧЕБНОЕ ЗАВЕДЕНИЕ", OrgItemTerminTypes.PREFIX, OrgProfile.EDUCATION, "ВУЗ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2034("ВИЩИЙ НАВЧАЛЬНИЙ ЗАКЛАД", MorphLang.UA, OrgItemTerminTypes.PREFIX, OrgProfile.EDUCATION, "ВНЗ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2033("ВЫСШЕЕ ПРОФЕССИОНАЛЬНОЕ УЧИЛИЩЕ", OrgItemTerminTypes.PREFIX, OrgProfile.EDUCATION, "ВПУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2034("ВИЩЕ ПРОФЕСІЙНЕ УЧИЛИЩЕ", MorphLang.UA, OrgItemTerminTypes.PREFIX, OrgProfile.EDUCATION, "ВПУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2033("НАУЧНО ИССЛЕДОВАТЕЛЬСКИЙ ИНСТИТУТ", OrgItemTerminTypes.PREFIX, OrgProfile.SCIENCE, "НИИ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2034("НАУКОВО ДОСЛІДНИЙ ІНСТИТУТ", MorphLang.UA, OrgItemTerminTypes.PREFIX, OrgProfile.SCIENCE, "НДІ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("НАУЧНО ИССЛЕДОВАТЕЛЬСКИЙ ЦЕНТР", OrgItemTerminTypes.PREFIX, "НИЦ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2040("НАУКОВО ДОСЛІДНИЙ ЦЕНТР", MorphLang.UA, OrgItemTerminTypes.PREFIX, "НДЦ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ЦЕНТРАЛЬНЫЙ НАУЧНО ИССЛЕДОВАТЕЛЬСКИЙ ИНСТИТУТ", OrgItemTerminTypes.PREFIX, "ЦНИИ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ВСЕРОССИЙСКИЙ НАУЧНО ИССЛЕДОВАТЕЛЬСКИЙ ИНСТИТУТ", OrgItemTerminTypes.PREFIX, "ВНИИ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("РОССИЙСКИЙ НАУЧНО ИССЛЕДОВАТЕЛЬСКИЙ ИНСТИТУТ", OrgItemTerminTypes.PREFIX, "РНИИ", OrgProfile.SCIENCE));
        t = OrgItemTermin._new2044("ИННОВАЦИОННЫЙ ЦЕНТР", OrgItemTerminTypes.PREFIX, OrgProfile.SCIENCE);
        t.add_variant("ИННОЦЕНТР", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("НАУЧНО ТЕХНИЧЕСКИЙ ЦЕНТР", OrgItemTerminTypes.PREFIX, "НТЦ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2040("НАУКОВО ТЕХНІЧНИЙ ЦЕНТР", MorphLang.UA, OrgItemTerminTypes.PREFIX, "НТЦ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("НАУЧНО ТЕХНИЧЕСКАЯ ФИРМА", OrgItemTerminTypes.PREFIX, "НТФ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2040("НАУКОВО ВИРОБНИЧА ФІРМА", MorphLang.UA, OrgItemTerminTypes.PREFIX, "НВФ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("НАУЧНО ПРОИЗВОДСТВЕННОЕ ОБЪЕДИНЕНИЕ", OrgItemTerminTypes.PREFIX, "НПО", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2040("НАУКОВО ВИРОБНИЧЕ ОБЄДНАННЯ", MorphLang.UA, OrgItemTerminTypes.PREFIX, "НВО", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2044("НАУЧНО ПРОИЗВОДСТВЕННЫЙ КООПЕРАТИВ", OrgItemTerminTypes.PREFIX, OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2040("НАУКОВО-ВИРОБНИЧИЙ КООПЕРАТИВ", MorphLang.UA, OrgItemTerminTypes.PREFIX, "НВК", OrgProfile.SCIENCE));
        t = OrgItemTermin._new2039("НАУЧНО ПРОИЗВОДСТВЕННАЯ КОРПОРАЦИЯ", OrgItemTerminTypes.PREFIX, "НПК", OrgProfile.SCIENCE);
        t.add_variant("НАУЧНО ПРОИЗВОДСТВЕННАЯ КОМПАНИЯ", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("НАУЧНО ТЕХНИЧЕСКИЙ КОМПЛЕКС", OrgItemTerminTypes.PREFIX, "НТК", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МЕЖОТРАСЛЕВОЙ НАУЧНО ТЕХНИЧЕСКИЙ КОМПЛЕКС", OrgItemTerminTypes.PREFIX, "МНТК", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("НАУЧНО ПРОИЗВОДСТВЕННОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "НПП", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2040("НАУКОВО ВИРОБНИЧЕ ПІДПРИЄМСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, "НВП", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("НАУЧНО ПРОИЗВОДСТВЕННЫЙ ЦЕНТР", OrgItemTerminTypes.PREFIX, "НПЦ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2040("НАУКОВО ВИРОБНИЧЕ ЦЕНТР", MorphLang.UA, OrgItemTerminTypes.PREFIX, "НВЦ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("НАУЧНО ПРОИЗВОДСТВЕННОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "НПУП", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ИНДИВИДУАЛЬНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ИП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ЧАСТНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ЧП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("ПРИВАТНЕ ПІДПРИЄМСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ПП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ЧАСТНОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ЧУП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ЧАСТНОЕ ПРОИЗВОДСТВЕННОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ЧПУП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ЧАСТНОЕ ИНДИВИДУАЛЬНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ЧИП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ЧАСТНОЕ ОХРАННОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ЧОП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ЧАСТНАЯ ОХРАННАЯ ОРГАНИЗАЦИЯ", OrgItemTerminTypes.PREFIX, "ЧОО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ЧАСТНОЕ ТРАНСПОРТНОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ЧТУП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ЧАСТНОЕ ТРАНСПОРТНО ЭКСПЛУАТАЦИОННОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ЧТЭУП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("НАУЧНО ПРОИЗВОДСТВЕННОЕ КОРПОРАЦИЯ", OrgItemTerminTypes.PREFIX, "НПК"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ФГУП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ГОСУДАРСТВЕННОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ГУП"));
        t = OrgItemTermin._new2061("ГОСУДАРСТВЕННОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ГП");
        t.add_variant("ГОСПРЕДПРИЯТИЕ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2063("ДЕРЖАВНЕ ПІДПРИЄМСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ДП");
        t.add_variant("ДЕРЖПІДПРИЄМСТВО", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ НАУЧНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ФГНУ", OrgProfile.SCIENCE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ФГУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ФГКУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ КАЗЕННОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ФГКОУ"));
        t = OrgItemTermin._new2061("ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ФГБУ");
        t.add_variant("ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ НАУКИ", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ВОЕННО ПРОМЫШЛЕННАЯ КОРПОРАЦИЯ", OrgItemTerminTypes.PREFIX, "ВПК"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ФЕДЕРАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ФБУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ФЕДЕРАЛЬНОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "ФУП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ФЕДЕРАЛЬНОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ФКУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("МУНИЦИПАЛЬНОЕ НЕКОММЕРЧЕСКОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "МНУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "МБУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("МУНИЦИПАЛЬНОЕ АВТОНОМНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "МАУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("МУНИЦИПАЛЬНОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "МКУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("МУНИЦИПАЛЬНОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "МУП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("МУНИЦИПАЛЬНОЕ УНИТАРНОЕ ПРОИЗВОДСТВЕННОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "МУПП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("МУНИЦИПАЛЬНОЕ КАЗЕННОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "МКП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("МУНИЦИПАЛЬНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, "МП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("НЕБАНКОВСКАЯ КРЕДИТНАЯ ОРГАНИЗАЦИЯ", OrgItemTerminTypes.PREFIX, "НКО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("РАСЧЕТНАЯ НЕБАНКОВСКАЯ КРЕДИТНАЯ ОРГАНИЗАЦИЯ", OrgItemTerminTypes.PREFIX, "РНКО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ГБУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ГОСУДАРСТВЕННОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ГКУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ГОСУДАРСТВЕННОЕ АВТОНОМНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ГАУ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new1989("МАЛОЕ ИННОВАЦИОННОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("НЕГОСУДАРСТВЕННЫЙ ПЕНСИОННЫЙ ФОНД", OrgItemTerminTypes.PREFIX, "НПФ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("ДЕРЖАВНА АКЦІОНЕРНА КОМПАНІЯ", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ДАК"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("ДЕРЖАВНА КОМПАНІЯ", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ДК"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("КОЛЕКТИВНЕ ПІДПРИЄМСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, "КП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("КОЛЕКТИВНЕ МАЛЕ ПІДПРИЄМСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, "КМП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("ВИРОБНИЧА ФІРМА", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ВФ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("ВИРОБНИЧЕ ОБЄДНАННЯ", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ВО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("ВИРОБНИЧЕ ПІДПРИЄМСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ВП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("ВИРОБНИЧИЙ КООПЕРАТИВ", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ВК"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("СТРАХОВА КОМПАНІЯ", MorphLang.UA, OrgItemTerminTypes.PREFIX, "СК"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2063("ТВОРЧЕ ОБЄДНАННЯ", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ТО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "ГУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "ФГУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ФЕДЕРАЛЬНОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "ФКУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ АВТОНОМНОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "ГАУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "ГБУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ ОБЛАСТНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "ГОБУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "ГКУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ ОБЛАСТНОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "ГОКУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "МУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("НЕГОСУДАРСТВЕННОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "НУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "МБУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "МКУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ ОБЛАСТНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "МОБУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ АВТОНОМНОЕ УЧРЕЖДЕНИЕ ЗДРАВООХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "МАУЗ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2044("ГОСУДАРСТВЕННОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "ФГУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ФЕДЕРАЛЬНОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "ФКУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ АВТОНОМНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "ГАУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "ГБУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ ОБЛАСТНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "ГОБУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "ГКУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ ОБЛАСТНОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "ГОКУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "МУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("НЕГОСУДАРСТВЕННОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "НУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "МБУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "МКУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ ОБЛАСТНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "МОБУК", OrgProfile.ART));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ АВТОНОМНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "МАУК", OrgProfile.ART));
        t = OrgItemTermin._new2061("ЧАСТНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ", OrgItemTerminTypes.PREFIX, "ЧУК");
        t.add_variant("ЧАСТНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ ЛФП", false);
        t.add_variant("ЧУК ЛФП", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ОБРАЗОВАНИЯ", OrgItemTerminTypes.PREFIX, "ГБУО", OrgProfile.EDUCATION));
        t = OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ПРФЕСИОНАЛЬНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ГБПОУ", OrgProfile.EDUCATION);
        t.add_variant("ГБ ПОУ", true);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ОБЩЕОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ГБОУ", OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ДОПОЛНИТЕЛЬНОГО ОБРАЗОВАНИЯ", OrgItemTerminTypes.PREFIX, "ГБУДО", OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "МОУ", OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ КАЗЕННОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "МКОУ", OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("МУНИЦИПАЛЬНОЕ ЛЕЧЕБНО ПРОФИЛАКТИЧЕСКОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "МЛПУ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ФЕДЕРАЛЬНОЕ КАЗЕННОЕ ЛЕЧЕБНО ПРОФИЛАКТИЧЕСКОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ФКЛПУ", OrgProfile.MEDICINE));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ГОУ", OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ГБОУ", OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ", OrgItemTerminTypes.PREFIX, "ФГБОУ", OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ВЫСШЕЕ ПРОФЕССИОНАЛЬНОЕ ОБРАЗОВАНИЕ", OrgItemTerminTypes.PREFIX, "ВПО", OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2039("ДОПОЛНИТЕЛЬНОЕ ПРОФЕССИОНАЛЬНОЕ ОБРАЗОВАНИЕ", OrgItemTerminTypes.PREFIX, "ДПО", OrgProfile.EDUCATION));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2152("ДЕПАРТАМЕНТ ЕДИНОГО ЗАКАЗЧИКА", OrgItemTerminTypes.PREFIX, "ДЕЗ", true, true));
        t = OrgItemTermin._new2153("СОЮЗ АРБИТРАЖНЫХ УПРАВЛЯЮЩИХ", OrgItemTerminTypes.PREFIX, "САУ", true);
        t.add_variant("САМОРЕГУЛИРУЕМАЯ ОРГАНИЗАЦИЯ АРБИТРАЖНЫХ УПРАВЛЯЮЩИХ", false);
        t.add_variant("СОАУ", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("АКЦИОНЕРНОЕ ОБЩЕСТВО", OrgItemTerminTypes.PREFIX, true, "АО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("АКЦІОНЕРНЕ ТОВАРИСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "АТ"));
        OrgItemTypeToken.m_global.add((OrgItemTypeToken.m_sovm_pred = OrgItemTermin._new2154("СОВМЕСТНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, true, "СП")));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("СПІЛЬНЕ ПІДПРИЄМСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "СП"));
        OrgItemTypeToken.m_global.add((OrgItemTypeToken.m_akcion_comp = OrgItemTermin._new2158("АКЦИОНЕРНАЯ КОМПАНИЯ", OrgItemTerminTypes.PREFIX, true)));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("ЗАКРЫТОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО", OrgItemTerminTypes.PREFIX, true, "ЗАО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2160("РОССИЙСКОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО", OrgItemTerminTypes.PREFIX, true, "РАО", "PAO"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("РОССИЙСКОЕ ОТКРЫТОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО", OrgItemTerminTypes.PREFIX, true, "РОАО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("АКЦИОНЕРНОЕ ОБЩЕСТВО ЗАКРЫТОГО ТИПА", OrgItemTerminTypes.PREFIX, true, "АОЗТ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("АКЦІОНЕРНЕ ТОВАРИСТВО ЗАКРИТОГО ТИПУ", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "АТЗТ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("АКЦИОНЕРНОЕ ОБЩЕСТВО ОТКРЫТОГО ТИПА", OrgItemTerminTypes.PREFIX, true, "АООТ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("АКЦІОНЕРНЕ ТОВАРИСТВО ВІДКРИТОГО ТИПУ", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "АТВТ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("ОБЩЕСТВЕННАЯ ОРГАНИЗАЦИЯ", OrgItemTerminTypes.PREFIX, true, "ОО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("ГРОМАДСЬКА ОРГАНІЗАЦІЯ", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ГО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("АВТОНОМНАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ", OrgItemTerminTypes.PREFIX, true, "АНО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("АВТОНОМНА НЕКОМЕРЦІЙНА ОРГАНІЗАЦІЯ", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "АНО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2160("ОТКРЫТОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО", OrgItemTerminTypes.PREFIX, true, "ОАО", "OAO"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2171("ВІДКРИТЕ АКЦІОНЕРНЕ ТОВАРИСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ВАТ", "ВАТ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2160("ЧАСТНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО", OrgItemTerminTypes.PREFIX, true, "ЧАО", "ЧAO"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("ОТКРЫТОЕ СТРАХОВОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО", OrgItemTerminTypes.PREFIX, true, "ОСАО"));
        t = OrgItemTermin._new2160("ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ", OrgItemTerminTypes.PREFIX, true, "ООО", "OOO");
        t.add_variant("ОБЩЕСТВО C ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2171("ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ТОВ", "ТОВ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2171("ТОВАРИСТВО З ПОВНОЮ ВІДПОВІДАЛЬНІСТЮ", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ТПВ", "ТПВ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2171("ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ТЗОВ", "ТЗОВ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2171("ТОВАРИСТВО З ДОДАТКОВОЮ ВІДПОВІДАЛЬНІСТЮ", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ТДВ", "ТДВ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2158("ЧАСТНОЕ АКЦИОНЕРНОЕ ТОВАРИЩЕСТВО", OrgItemTerminTypes.PREFIX, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2171("ПРИВАТНЕ АКЦІОНЕРНЕ ТОВАРИСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ПРАТ", "ПРАТ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2158("ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ТОВАРИЩЕСТВО", OrgItemTerminTypes.PREFIX, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2171("ПУБЛІЧНЕ АКЦІОНЕРНЕ ТОВАРИСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ПАТ", "ПАТ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2158("ЗАКРЫТОЕ АКЦИОНЕРНОЕ ТОВАРИЩЕСТВО", OrgItemTerminTypes.PREFIX, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2171("ЗАКРИТЕ АКЦІОНЕРНЕ ТОВАРИСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ЗАТ", "ЗАТ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2158("ОТКРЫТОЕ АКЦИОНЕРНОЕ ТОВАРИЩЕСТВО", OrgItemTerminTypes.PREFIX, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2171("ВІДКРИТЕ АКЦІОНЕРНЕ ТОВАРИСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ВАТ", "ВАТ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО", OrgItemTerminTypes.PREFIX, true, "ПАО"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("СТРАХОВОЕ ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО", OrgItemTerminTypes.PREFIX, true, "СПАО"));
        t = OrgItemTermin._new2189("БЛАГОТВОРИТЕЛЬНАЯ ОБЩЕСТВЕННАЯ ОРГАНИЗАЦИЯ", OrgItemTerminTypes.PREFIX, "БОО", "БОО");
        t.add_variant("ОБЩЕСТВЕННАЯ БЛАГОТВОРИТЕЛЬНАЯ ОРГАНИЗАЦИЯ", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2189("ТОВАРИЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ", OrgItemTerminTypes.PREFIX, "ТОО", "TOO"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2061("ПРЕДПРИНИМАТЕЛЬ БЕЗ ОБРАЗОВАНИЯ ЮРИДИЧЕСКОГО ЛИЦА", OrgItemTerminTypes.PREFIX, "ПБОЮЛ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("АКЦИОНЕРНЫЙ КОММЕРЧЕСКИЙ БАНК", OrgItemTerminTypes.PREFIX, true, "АКБ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("АКЦІОНЕРНИЙ КОМЕРЦІЙНИЙ БАНК", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "АКБ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("АКЦИОНЕРНЫЙ БАНК", OrgItemTerminTypes.PREFIX, true, "АБ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("АКЦІОНЕРНИЙ БАНК", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "АБ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2158("КОММЕРЧЕСКИЙ БАНК", OrgItemTerminTypes.PREFIX, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2197("КОМЕРЦІЙНИЙ БАНК", MorphLang.UA, OrgItemTerminTypes.PREFIX, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2158("КОНСТРУКТОРСКОЕ БЮРО", OrgItemTerminTypes.PREFIX, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2197("КОНСТРУКТОРСЬКЕ БЮРО", MorphLang.UA, OrgItemTerminTypes.PREFIX, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("ОПЫТНО КОНСТРУКТОРСКОЕ БЮРО", OrgItemTerminTypes.PREFIX, true, "ОКБ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("ДОСЛІДНО КОНСТРУКТОРСЬКЕ БЮРО", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ДКБ"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2153("СПЕЦИАЛЬНОЕ КОНСТРУКТОРСКОЕ БЮРО", OrgItemTerminTypes.PREFIX, "СКБ", true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2203("СПЕЦІАЛЬНЕ КОНСТРУКТОРСЬКЕ БЮРО", MorphLang.UA, OrgItemTerminTypes.PREFIX, "СКБ", true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("АКЦИОНЕРНАЯ СТРАХОВАЯ КОМПАНИЯ", OrgItemTerminTypes.PREFIX, true, "АСК"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("АКЦІОНЕРНА СТРАХОВА КОМПАНІЯ", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "АСК"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2206("АВТОТРАНСПОРТНОЕ ПРЕДПРИЯТИЕ", OrgItemTerminTypes.PREFIX, true, true, "АТП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2207("АВТОТРАНСПОРТНЕ ПІДПРИЄМСТВО", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, true, "АТП"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2154("ТЕЛЕРАДИОКОМПАНИЯ", OrgItemTerminTypes.PREFIX, true, "ТРК"));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2155("ТЕЛЕРАДІОКОМПАНІЯ", MorphLang.UA, OrgItemTerminTypes.PREFIX, true, "ТРК"));
        t = OrgItemTermin._new2153("ОРГАНИЗОВАННАЯ ПРЕСТУПНАЯ ГРУППИРОВКА", OrgItemTerminTypes.PREFIX, "ОПГ", true);
        t.add_variant("ОРГАНИЗОВАННАЯ ПРЕСТУПНАЯ ГРУППА", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2153("ОРГАНИЗОВАННОЕ ПРЕСТУПНОЕ СООБЩЕСТВО", OrgItemTerminTypes.PREFIX, "ОПС", true);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2212("ПОДРОСТКОВО МОЛОДЕЖНЫЙ КЛУБ", OrgItemTerminTypes.PREFIX, "ПМК", true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2212("СКЛАД ВРЕМЕННОГО ХРАНЕНИЯ", OrgItemTerminTypes.PREFIX, "СВХ", true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2212("ЖИЛИЩНО СТРОИТЕЛЬНЫЙ КООПЕРАТИВ", OrgItemTerminTypes.PREFIX, "ЖСК", true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2212("ГАРАЖНО СТРОИТЕЛЬНЫЙ КООПЕРАТИВ", OrgItemTerminTypes.PREFIX, "ГСК", true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2212("ГАРАЖНО ЭКСПЛУАТАЦИОННЫЙ КООПЕРАТИВ", OrgItemTerminTypes.PREFIX, "ГЭК", true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2212("ГАРАЖНО ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ", OrgItemTerminTypes.PREFIX, "ГПК", true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2212("ПОТРЕБИТЕЛЬСКИЙ ГАРАЖНО СТРОИТЕЛЬНЫЙ КООПЕРАТИВ", OrgItemTerminTypes.PREFIX, "ПГСК", true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2212("ГАРАЖНЫЙ СТРОИТЕЛЬНО ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ", OrgItemTerminTypes.PREFIX, "ГСПК", true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2212("ДАЧНО СТРОИТЕЛЬНЫЙ КООПЕРАТИВ", OrgItemTerminTypes.PREFIX, "ДСК", true, true));
        t = OrgItemTermin._new2212("САДОВОЕ НЕКОММЕРЧЕСКОЕ ТОВАРИЩЕСТВО", OrgItemTerminTypes.PREFIX, "СНТ", true, true);
        t.add_abridge("САДОВОЕ НЕКОМ-Е ТОВАРИЩЕСТВО");
        t.add_variant("СНТ ПМК", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2212("ПРЕДПРИЯТИЕ ПОТРЕБИТЕЛЬСКОЙ КООПЕРАЦИИ", OrgItemTerminTypes.PREFIX, "ППК", true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2223("ПІДПРИЄМСТВО СПОЖИВЧОЇ КООПЕРАЦІЇ", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ПСК", true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2224("ФІЗИЧНА ОСОБА ПІДПРИЄМЕЦЬ", MorphLang.UA, OrgItemTerminTypes.PREFIX, "ФОП", true, true));
        t = OrgItemTermin._new2225("ЖЕЛЕЗНАЯ ДОРОГА", OrgItemTerminTypes.ORG, OrgProfile.TRANSPORT, true, 3);
        t.add_variant("ЖЕЛЕЗНОДОРОЖНАЯ МАГИСТРАЛЬ", false);
        t.add_abridge("Ж.Д.");
        t.add_abridge("Ж/Д");
        t.add_abridge("ЖЕЛ.ДОР.");
        OrgItemTypeToken.m_global.add(t);
        for (const s of ["ЗАВОД", "ФАБРИКА", "БАНК", "КОМБИНАТ", "МЯСОКОМБИНАТ", "БАНКОВСКАЯ ГРУППА", "БИРЖА", "ФОНДОВАЯ БИРЖА", "FACTORY", "MANUFACTORY", "BANK"]) {
            OrgItemTypeToken.m_global.add((t = OrgItemTermin._new2226(s, 3.5, OrgItemTerminTypes.ORG, true, true)));
            if (s === "БАНК" || s === "BANK" || s.endsWith("БИРЖА")) {
                t.profile = OrgProfile.FINANCE;
                t.coeff = 2;
                t.can_has_latin_name = true;
                if (OrgItemTypeToken.m_bank === null) 
                    OrgItemTypeToken.m_bank = t;
            }
        }
        for (const s of ["ЗАВОД", "ФАБРИКА", "БАНК", "КОМБІНАТ", "БАНКІВСЬКА ГРУПА", "БІРЖА", "ФОНДОВА БІРЖА"]) {
            OrgItemTypeToken.m_global.add((t = OrgItemTermin._new2227(s, MorphLang.UA, 3.5, OrgItemTerminTypes.ORG, true, true)));
            if (s === "БАНК" || s.endsWith("БІРЖА")) {
                t.coeff = 2;
                t.can_has_latin_name = true;
                if (OrgItemTypeToken.m_bank === null) 
                    OrgItemTypeToken.m_bank = t;
            }
        }
        for (const s of ["ТУРФИРМА", "ТУРАГЕНТСТВО", "ТУРКОМПАНИЯ", "АВИАКОМПАНИЯ", "КИНОСТУДИЯ", "БИЗНЕС-ЦЕНТР", "КООПЕРАТИВ", "РИТЕЙЛЕР", "ОНЛАЙН РИТЕЙЛЕР", "МЕДИАГИГАНТ", "МЕДИАКОМПАНИЯ", "МЕДИАХОЛДИНГ"]) {
            t = OrgItemTermin._new2228(s, 3.5, OrgItemTerminTypes.ORG, true, true, true);
            if (s.startsWith("МЕДИА")) 
                t.profiles.push(OrgProfile.MEDIA);
            if (s.includes("РИТЕЙЛЕР")) 
                t.add_variant(Utils.replaceString(s, "РИТЕЙЛЕР", "РЕТЕЙЛЕР"), false);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ТУРФІРМА", "ТУРАГЕНТСТВО", "ТУРКОМПАНІЯ", "АВІАКОМПАНІЯ", "КІНОСТУДІЯ", "БІЗНЕС-ЦЕНТР", "КООПЕРАТИВ", "РІТЕЙЛЕР", "ОНЛАЙН-РІТЕЙЛЕР", "МЕДІАГІГАНТ", "МЕДІАКОМПАНІЯ", "МЕДІАХОЛДИНГ"]) {
            t = OrgItemTermin._new2229(s, MorphLang.UA, 3.5, OrgItemTerminTypes.ORG, true, true, true);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ТУРОПЕРАТОР"]) {
            t = OrgItemTermin._new2228(s, 0.5, OrgItemTerminTypes.ORG, true, true, true);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ТУРОПЕРАТОР"]) {
            t = OrgItemTermin._new2229(s, MorphLang.UA, 0.5, OrgItemTerminTypes.ORG, true, true, true);
            OrgItemTypeToken.m_global.add(t);
        }
        OrgItemTypeToken.m_sber_bank = (t = OrgItemTermin._new2232("СБЕРЕГАТЕЛЬНЫЙ БАНК", 4, OrgItemTerminTypes.ORG, true, OrgProfile.FINANCE));
        t.add_variant("СБЕРБАНК", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_sec_serv = (t = OrgItemTermin._new2232("СЛУЖБА БЕЗОПАСНОСТИ", 4, OrgItemTerminTypes.ORG, true, OrgProfile.STATE));
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2234("ОЩАДНИЙ БАНК", MorphLang.UA, 4, OrgItemTerminTypes.ORG, true, OrgProfile.FINANCE);
        t.add_variant("ОЩАДБАНК", false);
        OrgItemTypeToken.m_global.add(t);
        for (const s of ["ОРГАНИЗАЦИЯ", "ПРЕДПРИЯТИЕ", "КОМИТЕТ", "КОМИССИЯ", "ПРОИЗВОДИТЕЛЬ", "ГИГАНТ", "ORGANIZATION", "ENTERPRISE", "COMMITTEE", "COMMISSION", "MANUFACTURER"]) {
            OrgItemTypeToken.m_global.add((t = OrgItemTermin._new2235(s, OrgItemTerminTypes.ORG, true, true, true)));
        }
        for (const s of ["ОБЩЕСТВО", "АССАМБЛЕЯ", "СЛУЖБА", "ОБЪЕДИНЕНИЕ", "ФЕДЕРАЦИЯ", "COMPANY", "ASSEMBLY", "SERVICE", "UNION", "FEDERATION"]) {
            OrgItemTypeToken.m_global.add((t = OrgItemTermin._new2235(s, OrgItemTerminTypes.ORG, true, true, true)));
            if (s === "СЛУЖБА") 
                t.can_has_number = true;
        }
        for (const s of ["СООБЩЕСТВО", "ФОНД", "АССОЦИАЦИЯ", "АЛЬЯНС", "ГИЛЬДИЯ", "ОБЩИНА", "ОБЩЕСТВЕННОЕ ОБЪЕДИНЕНИЕ", "ОБЩЕСТВЕННАЯ ОРГАНИЗАЦИЯ", "ОБЩЕСТВЕННОЕ ФОРМИРОВАНИЕ", "СОЮЗ", "КЛУБ", "ГРУППИРОВКА", "ЛИГА", "COMMUNITY", "FOUNDATION", "ASSOCIATION", "ALLIANCE", "GUILD", "UNION", "CLUB", "GROUP", "LEAGUE"]) {
            OrgItemTypeToken.m_global.add((t = OrgItemTermin._new2237(s, 3, OrgItemTerminTypes.ORG, true, true, true, OrgProfile.UNION)));
        }
        for (const s of ["ПАРТИЯ", "ДВИЖЕНИЕ", "PARTY", "MOVEMENT"]) {
            OrgItemTypeToken.m_global.add((t = OrgItemTermin._new2238(s, OrgItemTerminTypes.ORG, true, true, true, OrgProfile.UNION)));
        }
        for (const s of ["НОЧНОЙ КЛУБ", "NIGHTCLUB"]) {
            OrgItemTypeToken.m_global.add((t = OrgItemTermin._new2239(s, OrgItemTerminTypes.ORG, true, true, OrgProfile.MUSIC)));
        }
        for (const s of ["ОРГАНІЗАЦІЯ", "ПІДПРИЄМСТВО", "КОМІТЕТ", "КОМІСІЯ", "ВИРОБНИК", "ГІГАНТ", "СУСПІЛЬСТВО", "СПІЛЬНОТА", "ФОНД", "СЛУЖБА", "АСОЦІАЦІЯ", "АЛЬЯНС", "АСАМБЛЕЯ", "ГІЛЬДІЯ", "ОБЄДНАННЯ", "СОЮЗ", "ПАРТІЯ", "РУХ", "ФЕДЕРАЦІЯ", "КЛУБ", "ГРУПУВАННЯ"]) {
            OrgItemTypeToken.m_global.add((t = OrgItemTermin._new2240(s, MorphLang.UA, OrgItemTerminTypes.ORG, true, true, true)));
        }
        t = OrgItemTermin._new2241("ДЕПУТАТСКАЯ ГРУППА", OrgItemTerminTypes.ORG, 3, true);
        t.add_variant("ГРУППА ДЕПУТАТОВ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2242("ДЕПУТАТСЬКА ГРУПА", MorphLang.UA, OrgItemTerminTypes.ORG, 3, true);
        t.add_variant("ГРУПА ДЕПУТАТІВ", false);
        OrgItemTypeToken.m_global.add(t);
        for (const s of ["ФОНД", "СОЮЗ", "ОБЪЕДИНЕНИЕ", "ОРГАНИЗАЦИЯ", "ФЕДЕРАЦИЯ", "ДВИЖЕНИЕ"]) {
            for (const ss of ["ВСЕМИРНЫЙ", "МЕЖДУНАРОДНЫЙ", "ВСЕРОССИЙСКИЙ", "ОБЩЕСТВЕННЫЙ", "НЕКОММЕРЧЕСКИЙ", "ЕВРОПЕЙСКИЙ", "ВСЕУКРАИНСКИЙ"]) {
                t = OrgItemTermin._new2226((ss + " " + s), 3.5, OrgItemTerminTypes.ORG, true, true);
                if (s === "ОБЪЕДИНЕНИЕ" || s === "ДВИЖЕНИЕ") 
                    t.canonic_text = (ss.substring(0, 0 + ss.length - 2) + "ОЕ " + s);
                else if (s === "ОРГАНИЗАЦИЯ" || s === "ФЕДЕРАЦИЯ") {
                    t.canonic_text = (ss.substring(0, 0 + ss.length - 2) + "АЯ " + s);
                    t.coeff = 3;
                }
                OrgItemTypeToken.m_global.add(t);
            }
        }
        for (const s of ["ФОНД", "СОЮЗ", "ОБЄДНАННЯ", "ОРГАНІЗАЦІЯ", "ФЕДЕРАЦІЯ", "РУХ"]) {
            for (const ss of ["СВІТОВИЙ", "МІЖНАРОДНИЙ", "ВСЕРОСІЙСЬКИЙ", "ГРОМАДСЬКИЙ", "НЕКОМЕРЦІЙНИЙ", "ЄВРОПЕЙСЬКИЙ", "ВСЕУКРАЇНСЬКИЙ"]) {
                t = OrgItemTermin._new2227((ss + " " + s), MorphLang.UA, 3.5, OrgItemTerminTypes.ORG, true, true);
                let bi = Morphology.get_word_base_info(s, MorphLang.UA, false, false);
                if (bi !== null && bi.gender !== MorphGender.MASCULINE) {
                    let adj = Morphology.get_wordform(ss, MorphBaseInfo._new564(MorphClass.ADJECTIVE, bi.gender, MorphNumber.SINGULAR, MorphLang.UA));
                    if (adj !== null) 
                        t.canonic_text = (adj + " " + s);
                }
                if (s === "ОРГАНІЗАЦІЯ" || s === "ФЕДЕРАЦІЯ") 
                    t.coeff = 3;
                OrgItemTypeToken.m_global.add(t);
            }
        }
        t = OrgItemTermin._new2226("ИНВЕСТИЦИОННЫЙ ФОНД", 3, OrgItemTerminTypes.ORG, true, true);
        t.add_variant("ИНВЕСТФОНД", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2227("ІНВЕСТИЦІЙНИЙ ФОНД", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true);
        t.add_variant("ІНВЕСТФОНД", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2226("СОЦИАЛЬНАЯ СЕТЬ", 3, OrgItemTerminTypes.ORG, true, true);
        t.add_variant("СОЦСЕТЬ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2227("СОЦІАЛЬНА МЕРЕЖА", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true);
        t.add_variant("СОЦМЕРЕЖА", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2226("ОФФШОРНАЯ КОМПАНИЯ", 3, OrgItemTerminTypes.ORG, true, true);
        t.add_variant("ОФФШОР", false);
        t.add_variant("ОФШОР", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2227("ОФШОРНА КОМПАНІЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true);
        t.add_variant("ОФШОР", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2252("ТЕРРОРИСТИЧЕСКАЯ ОРГАНИЗАЦИЯ", 3, OrgItemTerminTypes.ORG, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2253("ТЕРОРИСТИЧНА ОРГАНІЗАЦІЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2254("АТОМНАЯ ЭЛЕКТРОСТАНЦИЯ", 3, OrgItemTerminTypes.ORG, "АЭС", true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2255("АТОМНА ЕЛЕКТРОСТАНЦІЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, "АЕС", true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2254("ГИДРОЭЛЕКТРОСТАНЦИЯ", 3, OrgItemTerminTypes.ORG, "ГЭС", true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2255("ГІДРОЕЛЕКТРОСТАНЦІЯ", MorphLang.UA, 3, OrgItemTerminTypes.ORG, "ГЕС", true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2254("ГИДРОРЕЦИРКУЛЯЦИОННАЯ ЭЛЕКТРОСТАНЦИЯ", 3, OrgItemTerminTypes.ORG, "ГРЭС", true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2254("ТЕПЛОВАЯ ЭЛЕКТРОСТАНЦИЯ", 3, OrgItemTerminTypes.ORG, "ТЭС", true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2254("НЕФТЕПЕРЕРАБАТЫВАЮЩИЙ ЗАВОД", 3, OrgItemTerminTypes.ORG, "НПЗ", true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2255("НАФТОПЕРЕРОБНИЙ ЗАВОД", MorphLang.UA, 3, OrgItemTerminTypes.ORG, "НПЗ", true, true, true));
        for (const s of ["ФИРМА", "КОМПАНИЯ", "КОРПОРАЦИЯ", "ГОСКОРПОРАЦИЯ", "КОНЦЕРН", "КОНСОРЦИУМ", "ХОЛДИНГ", "МЕДИАХОЛДИНГ", "ТОРГОВЫЙ ДОМ", "ТОРГОВЫЙ ЦЕНТР", "УЧЕБНЫЙ ЦЕНТР", "ИССЛЕДОВАТЕЛЬСКИЙ ЦЕНТР", "КОСМИЧЕСКИЙ ЦЕНТР", "АУКЦИОННЫЙ ДОМ", "ИЗДАТЕЛЬСТВО", "ИЗДАТЕЛЬСКИЙ ДОМ", "ТОРГОВЫЙ КОМПЛЕКС", "ТОРГОВО РАЗВЛЕКАТЕЛЬНЫЙ КОМПЛЕКС", "АГЕНТСТВО НЕДВИЖИМОСТИ", "ГРУППА КОМПАНИЙ", "МЕДИАГРУППА", "МАГАЗИН", "ТОРГОВЫЙ КОМПЛЕКС", "ГИПЕРМАРКЕТ", "СУПЕРМАРКЕТ", "КАФЕ", "РЕСТОРАН", "БАР", "ТРАКТИР", "ТАВЕРНА", "СТОЛОВАЯ", "АУКЦИОН", "АНАЛИТИЧЕСКИЙ ЦЕНТР", "COMPANY", "CORPORATION"]) {
            t = OrgItemTermin._new2262(s, 3, OrgItemTerminTypes.ORG, true, true, true);
            if (s === "ИЗДАТЕЛЬСТВО") {
                t.add_abridge("ИЗД-ВО");
                t.add_abridge("ИЗ-ВО");
                t.profiles.push(OrgProfile.MEDIA);
                t.profiles.push(OrgProfile.PRESS);
                t.add_variant("ИЗДАТЕЛЬСКИЙ ДОМ", false);
            }
            else if (s.startsWith("ИЗДАТ")) {
                t.profiles.push(OrgProfile.PRESS);
                t.profiles.push(OrgProfile.MEDIA);
            }
            else if (s === "ТОРГОВЫЙ ДОМ") 
                t.acronym = "ТД";
            else if (s === "ТОРГОВЫЙ ЦЕНТР") 
                t.acronym = "ТЦ";
            else if (s === "ТОРГОВЫЙ КОМПЛКС") 
                t.acronym = "ТК";
            else if (s === "ГРУППА КОМПАНИЙ") 
                t.acronym = "ГК";
            else if (s === "СТОЛОВАЯ") 
                t.can_has_number = true;
            if (s.startsWith("МЕДИА")) 
                t.profiles.push(OrgProfile.MEDIA);
            if (s.endsWith(" ЦЕНТР")) 
                t.coeff = 3.5;
            if (s === "КОМПАНИЯ" || s === "ФИРМА") 
                t.coeff = 1;
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ФІРМА", "КОМПАНІЯ", "КОРПОРАЦІЯ", "ДЕРЖКОРПОРАЦІЯ", "КОНЦЕРН", "КОНСОРЦІУМ", "ХОЛДИНГ", "МЕДІАХОЛДИНГ", "ТОРГОВИЙ ДІМ", "ТОРГОВИЙ ЦЕНТР", "НАВЧАЛЬНИЙ ЦЕНТР", "ВИДАВНИЦТВО", "ВИДАВНИЧИЙ ДІМ", "ТОРГОВИЙ КОМПЛЕКС", "ТОРГОВО-РОЗВАЖАЛЬНИЙ КОМПЛЕКС", "АГЕНТСТВО НЕРУХОМОСТІ", "ГРУПА КОМПАНІЙ", "МЕДІАГРУПА", "МАГАЗИН", "ТОРГОВИЙ КОМПЛЕКС", "ГІПЕРМАРКЕТ", "СУПЕРМАРКЕТ", "КАФЕ", "БАР", "АУКЦІОН", "АНАЛІТИЧНИЙ ЦЕНТР"]) {
            t = OrgItemTermin._new2263(s, MorphLang.UA, OrgItemTerminTypes.ORG, true, true, true);
            if (s === "ВИДАВНИЦТВО") {
                t.add_abridge("ВИД-ВО");
                t.add_variant("ВИДАВНИЧИЙ ДІМ", false);
            }
            else if (s === "ТОРГОВИЙ ДІМ") 
                t.acronym = "ТД";
            else if (s === "ТОРГОВИЙ ЦЕНТР") 
                t.acronym = "ТЦ";
            else if (s === "ТОРГОВИЙ КОМПЛЕКС") 
                t.acronym = "ТК";
            else if (s === "ГРУПА КОМПАНІЙ") 
                t.acronym = "ГК";
            else if (s === "КОМПАНІЯ" || s === "ФІРМА") 
                t.coeff = 1;
            if (s.startsWith("МЕДІА")) 
                t.profiles.push(OrgProfile.MEDIA);
            OrgItemTypeToken.m_global.add(t);
        }
        t = OrgItemTermin._new2264("ЭКОЛОГИЧЕСКАЯ ГРУППА", MorphLang.RU, OrgItemTerminTypes.ORG, 3, true);
        t.add_variant("ЭКОГРУППА", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2265("РОК ГРУППА", MorphLang.RU, OrgProfile.MUSIC, OrgItemTerminTypes.ORG, 3, true);
        t.add_variant("РОКГРУППА", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2265("ПАНК ГРУППА", MorphLang.RU, OrgProfile.MUSIC, OrgItemTerminTypes.ORG, 3, true);
        t.add_variant("ПАНКГРУППА", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2265("ОРКЕСТР", MorphLang.RU, OrgProfile.MUSIC, OrgItemTerminTypes.ORG, 3, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2265("ХОР", MorphLang.RU, OrgProfile.MUSIC, OrgItemTerminTypes.ORG, 3, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2265("МУЗЫКАЛЬНЫЙ КОЛЛЕКТИВ", MorphLang.RU, OrgProfile.MUSIC, OrgItemTerminTypes.ORG, 3, true);
        t.add_variant("РОКГРУППА", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2270("ВОКАЛЬНО ИНСТРУМЕНТАЛЬНЫЙ АНСАМБЛЬ", MorphLang.RU, OrgProfile.MUSIC, OrgItemTerminTypes.ORG, 3, true, "ВИА");
        t.add_variant("ИНСТРУМЕНТАЛЬНЫЙ АНСАМБЛЬ", false);
        OrgItemTypeToken.m_global.add(t);
        for (const s of ["НОТАРИАЛЬНАЯ КОНТОРА", "АДВОКАТСКОЕ БЮРО", "СТРАХОВОЕ ОБЩЕСТВО", "ЮРИДИЧЕСКИЙ ДОМ"]) {
            t = OrgItemTermin._new2271(s, OrgItemTerminTypes.ORG, true, true, true, true);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["НОТАРІАЛЬНА КОНТОРА", "АДВОКАТСЬКЕ БЮРО", "СТРАХОВЕ ТОВАРИСТВО"]) {
            t = OrgItemTermin._new2272(s, MorphLang.UA, OrgItemTerminTypes.ORG, true, true, true, true);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ГАЗЕТА", "ЕЖЕНЕДЕЛЬНИК", "ТАБЛОИД", "ЕЖЕНЕДЕЛЬНЫЙ ЖУРНАЛ", "NEWSPAPER", "WEEKLY", "TABLOID", "MAGAZINE"]) {
            t = OrgItemTermin._new2273(s, 3, OrgItemTerminTypes.ORG, true, true, true, OrgProfile.MEDIA);
            t.profiles.push(OrgProfile.PRESS);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ГАЗЕТА", "ТИЖНЕВИК", "ТАБЛОЇД"]) {
            t = OrgItemTermin._new2274(s, MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true, true, OrgProfile.MEDIA);
            t.profiles.push(OrgProfile.PRESS);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["РАДИОСТАНЦИЯ", "РАДИО", "ТЕЛЕКАНАЛ", "ТЕЛЕКОМПАНИЯ", "НОВОСТНОЙ ПОРТАЛ", "ИНТЕРНЕТ ПОРТАЛ", "ИНТЕРНЕТ ИЗДАНИЕ", "ИНТЕРНЕТ РЕСУРС"]) {
            t = OrgItemTermin._new2273(s, 3, OrgItemTerminTypes.ORG, true, true, true, OrgProfile.MEDIA);
            if (s === "РАДИО") {
                t.canonic_text = "РАДИОСТАНЦИЯ";
                t.is_doubt_word = true;
            }
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["РАДІО", "РАДІО", "ТЕЛЕКАНАЛ", "ТЕЛЕКОМПАНІЯ", "НОВИННИЙ ПОРТАЛ", "ІНТЕРНЕТ ПОРТАЛ", "ІНТЕРНЕТ ВИДАННЯ", "ІНТЕРНЕТ РЕСУРС"]) {
            t = OrgItemTermin._new2274(s, MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true, true, OrgProfile.MEDIA);
            if (s === "РАДІО") {
                t.canonic_text = "РАДІОСТАНЦІЯ";
                t.is_doubt_word = true;
            }
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ПАНСИОНАТ", "САНАТОРИЙ", "ДОМ ОТДЫХА", "ОТЕЛЬ", "ГОСТИНИЦА", "SPA-ОТЕЛЬ", "ОЗДОРОВИТЕЛЬНЫЙ ЛАГЕРЬ", "ДЕТСКИЙ ЛАГЕРЬ", "ПИОНЕРСКИЙ ЛАГЕРЬ", "БАЗА ОТДЫХА", "СПОРТ-КЛУБ"]) {
            t = OrgItemTermin._new2262(s, 3, OrgItemTerminTypes.ORG, true, true, true);
            if (s === "САНАТОРИЙ") 
                t.add_abridge("САН.");
            else if (s === "ДОМ ОТДЫХА") {
                t.add_abridge("Д.О.");
                t.add_abridge("ДОМ ОТД.");
                t.add_abridge("Д.ОТД.");
            }
            else if (s === "ПАНСИОНАТ") 
                t.add_abridge("ПАНС.");
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ПАНСІОНАТ", "САНАТОРІЙ", "БУДИНОК ВІДПОЧИНКУ", "ГОТЕЛЬ", "SPA-ГОТЕЛЬ", "ОЗДОРОВЧИЙ ТАБІР", "БАЗА ВІДПОЧИНКУ", "СПОРТ-КЛУБ"]) {
            t = OrgItemTermin._new2278(s, MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true, true);
            if (s === "САНАТОРІЙ") 
                t.add_abridge("САН.");
            OrgItemTypeToken.m_global.add(t);
        }
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2279("ДЕТСКИЙ ОЗДОРОВИТЕЛЬНЫЙ ЛАГЕРЬ", 3, OrgItemTerminTypes.ORG, "ДОЛ", true, true, true));
        OrgItemTypeToken.m_global.add(OrgItemTermin._new2279("ДЕТСКИЙ СПОРТИВНЫЙ ОЗДОРОВИТЕЛЬНЫЙ ЛАГЕРЬ", 3, OrgItemTerminTypes.ORG, "ДСОЛ", true, true, true));
        for (const s of ["КОЛХОЗ", "САДОВО ОГОРОДНОЕ ТОВАРИЩЕСТВО", "КООПЕРАТИВ", "ФЕРМЕРСКОЕ ХОЗЯЙСТВО", "КРЕСТЬЯНСКО ФЕРМЕРСКОЕ ХОЗЯЙСТВО", "АГРОФИРМА", "КОНЕЗАВОД", "ПТИЦЕФЕРМА", "СВИНОФЕРМА", "ФЕРМА", "ЛЕСПРОМХОЗ"]) {
            t = OrgItemTermin._new2281(s, 3, OrgItemTerminTypes.ORG, true, true, true, true);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["КОЛГОСП", "САДОВО ГОРОДНЄ ТОВАРИСТВО", "КООПЕРАТИВ", "ФЕРМЕРСЬКЕ ГОСПОДАРСТВО", "СЕЛЯНСЬКО ФЕРМЕРСЬКЕ ГОСПОДАРСТВО", "АГРОФІРМА", "КОНЕЗАВОД", "ПТАХОФЕРМА", "СВИНОФЕРМА", "ФЕРМА"]) {
            t = OrgItemTermin._new2282(s, MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true, true, true);
            OrgItemTypeToken.m_global.add(t);
        }
        t = OrgItemTermin._new2254("ЖИЛИЩНО КОММУНАЛЬНОЕ ХОЗЯЙСТВО", 3, OrgItemTerminTypes.ORG, "ЖКХ", true, true, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2254("ЖИТЛОВО КОМУНАЛЬНЕ ГОСПОДАРСТВО", 3, OrgItemTerminTypes.ORG, "ЖКГ", true, true, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2285("КОММУНАЛЬНОЕ ПРЕДПРИЯТИЕ", 3, OrgItemTerminTypes.ORG, true, true, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2286("КОМУНАЛЬНЕ ПІДПРИЄМСТВО", MorphLang.UA, 3, OrgItemTerminTypes.ORG, true, true, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2281("АВТОМОБИЛЬНЫЙ ЗАВОД", 3, OrgItemTerminTypes.ORG, true, true, true, true);
        t.add_variant("АВТОЗАВОД", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2281("АВТОМОБИЛЬНЫЙ ЦЕНТР", 3, OrgItemTerminTypes.ORG, true, true, true, true);
        t.add_variant("АВТОЦЕНТР", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2281("СОВХОЗ", 3, OrgItemTerminTypes.ORG, true, true, true, true);
        t.add_abridge("С/Х");
        t.add_abridge("С-З");
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2281("ПЛЕМЕННОЕ ХОЗЯЙСТВО", 3, OrgItemTerminTypes.ORG, true, true, true, true);
        t.add_variant("ПЛЕМХОЗ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2281("ЛЕСНОЕ ХОЗЯЙСТВО", 3, OrgItemTerminTypes.ORG, true, true, true, true);
        t.add_variant("ЛЕСХОЗ", false);
        OrgItemTypeToken.m_global.add(t);
        let sads = ["Садоводческое некоммерческое товарищество", "СНТ", "Дачное некоммерческое товарищество", "ДНТ", "Огородническое некоммерческое товарищество", "ОНТ", "Садоводческое некоммерческое партнерство", "СНП", "Дачное некоммерческое партнерство", "ДНП", "Огородническое некоммерческое партнерство", "ОНП", "Садоводческий потребительский кооператив", "СПК", "Дачный потребительский кооператив", "ДПК", "Огороднический потребительский кооператив", "ОПК"];
        for (let i = 0; i < sads.length; i += 2) {
            t = OrgItemTermin._new2292(sads[i].toUpperCase(), 3, sads[i + 1], OrgItemTerminTypes.ORG, true, true, true);
            t.add_abridge(sads[i + 1]);
            if (t.acronym === "СНТ") 
                t.add_abridge("САДОВ.НЕКОМ.ТОВ.");
            OrgItemTypeToken.m_global.add(t);
        }
        t = OrgItemTermin._new2281("САДОВОДЧЕСКОЕ ТОВАРИЩЕСТВО", 3, OrgItemTerminTypes.ORG, true, true, true, true);
        t.add_abridge("САДОВОДЧ.ТОВ.");
        t.add_abridge("САДОВ.ТОВ.");
        t.add_abridge("САД.ТОВ.");
        t.add_abridge("С.Т.");
        t.add_variant("САДОВОЕ ТОВАРИЩЕСТВО", false);
        t.add_variant("САДОВ. ТОВАРИЩЕСТВО", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2281("САДОВОДЧЕСКИЙ КООПЕРАТИВ", 3, OrgItemTerminTypes.ORG, true, true, true, true);
        t.add_abridge("САДОВОДЧ.КООП.");
        t.add_abridge("САДОВ.КООП.");
        t.add_variant("САДОВЫЙ КООПЕРАТИВ", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2281("ДАЧНОЕ ТОВАРИЩЕСТВО", 3, OrgItemTerminTypes.ORG, true, true, true, true);
        t.add_abridge("ДАЧН.ТОВ.");
        t.add_abridge("ДАЧ.ТОВ.");
        OrgItemTypeToken.m_global.add(t);
        for (const s of ["ФЕСТИВАЛЬ", "ЧЕМПИОНАТ", "ОЛИМПИАДА", "КОНКУРС"]) {
            t = OrgItemTermin._new1843(s, 3, OrgItemTerminTypes.ORG, true);
            OrgItemTypeToken.m_global.add(t);
        }
        for (const s of ["ФЕСТИВАЛЬ", "ЧЕМПІОНАТ", "ОЛІМПІАДА"]) {
            t = OrgItemTermin._new2297(s, MorphLang.UA, 3, OrgItemTerminTypes.ORG, true);
            OrgItemTypeToken.m_global.add(t);
        }
        t = OrgItemTermin._new2298("ПОГРАНИЧНЫЙ ПОСТ", 3, OrgItemTerminTypes.ORG, true, true, OrgProfile.ARMY);
        t.add_variant("ПОГП", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2298("ПОГРАНИЧНАЯ ЗАСТАВА", 3, OrgItemTerminTypes.ORG, true, true, OrgProfile.ARMY);
        t.add_variant("ПОГЗ", false);
        t.add_variant("ПОГРАНЗАСТАВА", false);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1931("ТЕРРИТОРИАЛЬНЫЙ ПУНКТ", 3, OrgItemTerminTypes.DEP, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new1931("МИГРАЦИОННЫЙ ПУНКТ", 3, OrgItemTerminTypes.DEP, true);
        OrgItemTypeToken.m_global.add(t);
        t = OrgItemTermin._new2302("ПРОПУСКНОЙ ПУНКТ", 3, true, OrgItemTerminTypes.DEP, true, true);
        t.add_variant("ПУНКТ ПРОПУСКА", false);
        t.add_variant("КОНТРОЛЬНО ПРОПУСКНОЙ ПУНКТ", false);
        OrgItemTypeToken.m_global.add(t);
        OrgItemTypeToken.m_pref_words = new TerminCollection();
        for (const s of ["КАПИТАЛ", "РУКОВОДСТВО", "СЪЕЗД", "СОБРАНИЕ", "СОВЕТ", "УПРАВЛЕНИЕ", "ДЕПАРТАМЕНТ"]) {
            OrgItemTypeToken.m_pref_words.add(new Termin(s));
        }
        for (const s of ["КАПІТАЛ", "КЕРІВНИЦТВО", "ЗЇЗД", "ЗБОРИ", "РАДА", "УПРАВЛІННЯ"]) {
            OrgItemTypeToken.m_pref_words.add(Termin._new899(s, MorphLang.UA));
        }
        for (const s of ["АКЦИЯ", "ВЛАДЕЛЕЦ", "ВЛАДЕЛИЦА", "СОВЛАДЕЛЕЦ", "СОВЛАДЕЛИЦА", "КОНКУРЕНТ"]) {
            OrgItemTypeToken.m_pref_words.add(Termin._new119(s, s));
        }
        for (const s of ["АКЦІЯ", "ВЛАСНИК", "ВЛАСНИЦЯ", "СПІВВЛАСНИК", "СПІВВЛАСНИЦЯ", "КОНКУРЕНТ"]) {
            OrgItemTypeToken.m_pref_words.add(Termin._new120(s, s, MorphLang.UA));
        }
        for (let k = 0; k < 3; k++) {
            let _name = (k === 0 ? "pattrs_ru.dat" : (k === 1 ? "pattrs_ua.dat" : "pattrs_en.dat"));
            let dat = EpNerOrgInternalResourceHelper.get_bytes(_name);
            if (dat === null) 
                throw new Error(("Can't file resource file " + _name + " in Organization analyzer"));
            let tmp = new MemoryStream(OrgItemTypeToken.deflate(dat)); 
            try {
                tmp.position = 0;
                let xml = new XmlDocument();
                xml.loadStream(tmp);
                for (const x of xml.document_element.child_nodes) {
                    if (k === 0) 
                        OrgItemTypeToken.m_pref_words.add(Termin._new119(x.inner_text, 1));
                    else if (k === 1) 
                        OrgItemTypeToken.m_pref_words.add(Termin._new120(x.inner_text, 1, MorphLang.UA));
                    else if (k === 2) 
                        OrgItemTypeToken.m_pref_words.add(Termin._new120(x.inner_text, 1, MorphLang.EN));
                }
            }
            finally {
                tmp.close();
            }
        }
        OrgItemTypeToken.m_key_words_for_refs = new TerminCollection();
        for (const s of ["КОМПАНИЯ", "ФИРМА", "ПРЕДПРИЯТИЕ", "КОРПОРАЦИЯ", "ВЕДОМСТВО", "УЧРЕЖДЕНИЕ", "КОМПАНІЯ", "ФІРМА", "ПІДПРИЄМСТВО", "КОРПОРАЦІЯ", "ВІДОМСТВО", "УСТАНОВА"]) {
            OrgItemTypeToken.m_key_words_for_refs.add(new Termin(s));
        }
        for (const s of ["ЧАСТЬ", "БАНК", "ЗАВОД", "ФАБРИКА", "АЭРОПОРТ", "БИРЖА", "СЛУЖБА", "МИНИСТЕРСТВО", "КОМИССИЯ", "КОМИТЕТ", "ГРУППА", "ЧАСТИНА", "БАНК", "ЗАВОД", "ФАБРИКА", "АЕРОПОРТ", "БІРЖА", "СЛУЖБА", "МІНІСТЕРСТВО", "КОМІСІЯ", "КОМІТЕТ", "ГРУПА"]) {
            OrgItemTypeToken.m_key_words_for_refs.add(Termin._new119(s, s));
        }
        OrgItemTypeToken.m_markers = new TerminCollection();
        for (const s of ["МОРСКОЙ", "ВОЗДУШНЫЙ;ВОЗДУШНО", "ДЕСАНТНЫЙ;ДЕСАНТНО", "ТАНКОВЫЙ", "АРТИЛЛЕРИЙСКИЙ", "АВИАЦИОННЫЙ", "КОСМИЧЕСКИЙ", "РАКЕТНЫЙ;РАКЕТНО", "БРОНЕТАНКОВЫЙ", "КАВАЛЕРИЙСКИЙ", "СУХОПУТНЫЙ", "ПЕХОТНЫЙ;ПЕХОТНО", "МОТОПЕХОТНЫЙ", "МИНОМЕТНЫЙ", "МОТОСТРЕЛКОВЫЙ", "СТРЕЛКОВЫЙ", "ПРОТИВОРАКЕТНЫЙ", "ПРОТИВОВОЗДУШНЫЙ", "ШТУРМОВОЙ"]) {
            let ss = Utils.splitString(s, ';', false);
            t = new OrgItemTermin(ss[0]);
            if (ss.length > 1) 
                t.add_variant(ss[1], false);
            OrgItemTypeToken.m_markers.add(t);
        }
        OrgItemTypeToken.m_std_adjs = new TerminCollection();
        for (const s of ["РОССИЙСКИЙ", "ВСЕРОССИЙСКИЙ", "МЕЖДУНАРОДНЫЙ", "ВСЕМИРНЫЙ", "ЕВРОПЕЙСКИЙ", "ГОСУДАРСТВЕННЫЙ", "НЕГОСУДАРСТВЕННЫЙ", "ФЕДЕРАЛЬНЫЙ", "РЕГИОНАЛЬНЫЙ", "ОБЛАСТНОЙ", "ГОРОДСКОЙ", "МУНИЦИПАЛЬНЫЙ", "АВТОНОМНЫЙ", "НАЦИОНАЛЬНЫЙ", "МЕЖРАЙОННЫЙ", "РАЙОННЫЙ", "ОТРАСЛЕВОЙ", "МЕЖОТРАСЛЕВОЙ", "НАРОДНЫЙ", "ВЕРХОВНЫЙ", "УКРАИНСКИЙ", "ВСЕУКРАИНСКИЙ", "РУССКИЙ"]) {
            OrgItemTypeToken.m_std_adjs.add(Termin._new456(s, MorphLang.RU, s));
        }
        OrgItemTypeToken.m_std_adjsua = new TerminCollection();
        for (const s of ["РОСІЙСЬКИЙ", "ВСЕРОСІЙСЬКИЙ", "МІЖНАРОДНИЙ", "СВІТОВИЙ", "ЄВРОПЕЙСЬКИЙ", "ДЕРЖАВНИЙ", "НЕДЕРЖАВНИЙ", "ФЕДЕРАЛЬНИЙ", "РЕГІОНАЛЬНИЙ", "ОБЛАСНИЙ", "МІСЬКИЙ", "МУНІЦИПАЛЬНИЙ", "АВТОНОМНИЙ", "НАЦІОНАЛЬНИЙ", "МІЖРАЙОННИЙ", "РАЙОННИЙ", "ГАЛУЗЕВИЙ", "МІЖГАЛУЗЕВИЙ", "НАРОДНИЙ", "ВЕРХОВНИЙ", "УКРАЇНСЬКИЙ", "ВСЕУКРАЇНСЬКИЙ", "РОСІЙСЬКА"]) {
            OrgItemTypeToken.m_std_adjsua.add(Termin._new456(s, MorphLang.UA, s));
        }
        for (const s of ["КОММЕРЧЕСКИЙ", "НЕКОММЕРЧЕСКИЙ", "БЮДЖЕТНЫЙ", "КАЗЕННЫЙ", "БЛАГОТВОРИТЕЛЬНЫЙ", "СОВМЕСТНЫЙ", "ИНОСТРАННЫЙ", "ИССЛЕДОВАТЕЛЬСКИЙ", "ОБРАЗОВАТЕЛЬНЫЙ", "ОБЩЕОБРАЗОВАТЕЛЬНЫЙ", "ВЫСШИЙ", "УЧЕБНЫЙ", "СПЕЦИАЛИЗИРОВАННЫЙ", "ГЛАВНЫЙ", "ЦЕНТРАЛЬНЫЙ", "ТЕХНИЧЕСКИЙ", "ТЕХНОЛОГИЧЕСКИЙ", "ВОЕННЫЙ", "ПРОМЫШЛЕННЫЙ", "ТОРГОВЫЙ", "СИНОДАЛЬНЫЙ", "МЕДИЦИНСКИЙ", "ДИАГНОСТИЧЕСКИЙ", "ДЕТСКИЙ", "АКАДЕМИЧЕСКИЙ", "ПОЛИТЕХНИЧЕСКИЙ", "ИНВЕСТИЦИОННЫЙ", "ТЕРРОРИСТИЧЕСКИЙ", "РАДИКАЛЬНЫЙ", "ИСЛАМИСТСКИЙ", "ЛЕВОРАДИКАЛЬНЫЙ", "ПРАВОРАДИКАЛЬНЫЙ", "ОППОЗИЦИОННЫЙ", "НАЛОГОВЫЙ", "КРИМИНАЛЬНЫЙ", "СПОРТИВНЫЙ", "НЕФТЯНОЙ", "ГАЗОВЫЙ", "ВЕЛИКИЙ"]) {
            OrgItemTypeToken.m_std_adjs.add(new Termin(s, MorphLang.RU));
        }
        for (const s of ["КОМЕРЦІЙНИЙ", "НЕКОМЕРЦІЙНИЙ", "БЮДЖЕТНИЙ", "КАЗЕННИМ", "БЛАГОДІЙНИЙ", "СПІЛЬНИЙ", "ІНОЗЕМНИЙ", "ДОСЛІДНИЦЬКИЙ", "ОСВІТНІЙ", "ЗАГАЛЬНООСВІТНІЙ", "ВИЩИЙ", "НАВЧАЛЬНИЙ", "СПЕЦІАЛІЗОВАНИЙ", "ГОЛОВНИЙ", "ЦЕНТРАЛЬНИЙ", "ТЕХНІЧНИЙ", "ТЕХНОЛОГІЧНИЙ", "ВІЙСЬКОВИЙ", "ПРОМИСЛОВИЙ", "ТОРГОВИЙ", "СИНОДАЛЬНИЙ", "МЕДИЧНИЙ", "ДІАГНОСТИЧНИЙ", "ДИТЯЧИЙ", "АКАДЕМІЧНИЙ", "ПОЛІТЕХНІЧНИЙ", "ІНВЕСТИЦІЙНИЙ", "ТЕРОРИСТИЧНИЙ", "РАДИКАЛЬНИЙ", "ІСЛАМІЗМ", "ЛІВОРАДИКАЛЬНИЙ", "ПРАВОРАДИКАЛЬНИЙ", "ОПОЗИЦІЙНИЙ", "ПОДАТКОВИЙ", "КРИМІНАЛЬНИЙ", " СПОРТИВНИЙ", "НАФТОВИЙ", "ГАЗОВИЙ", "ВЕЛИКИЙ"]) {
            OrgItemTypeToken.m_std_adjsua.add(new Termin(s, MorphLang.UA));
        }
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
    }
    
    static deflate(zip) {
        let unzip = new MemoryStream(); 
        try {
            let data = new MemoryStream(zip);
            data.position = 0;
            MorphSerializeHelper.deflate_gzip(data, unzip);
            data.close();
            return unzip.toByteArray();
        }
        finally {
            unzip.close();
        }
    }
    
    static is_decree_keyword(t, cou = 1) {
        if (t === null) 
            return false;
        for (let i = 0; (i < cou) && t !== null; i++,t = t.previous) {
            if (t.is_newline_after) 
                break;
            if (!t.chars.is_cyrillic_letter) 
                break;
            for (const d of OrgItemTypeToken.m_decree_key_words) {
                if (t.is_value(d, null)) 
                    return true;
            }
        }
        return false;
    }
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = null;
        this.name = null;
        this.alt_name = null;
        this.name_is_name = false;
        this.alt_typ = null;
        this.number = null;
        this.m_profile = null;
        this.root = null;
        this.m_is_dep = -1;
        this.is_not_typ = false;
        this.m_coef = -1;
        this.geo = null;
        this.geo2 = null;
        this.chars_root = new CharsInfo();
        this.can_be_dep_before_organization = false;
        this.is_douter_org = false;
        this.m_is_doubt_root_word = -1;
        this.can_be_organization = false;
    }
    
    /**
     * [Get] Список профилей
     */
    get profiles() {
        if (this.m_profile === null) {
            this.m_profile = new Array();
            if (this.root !== null) 
                this.m_profile.splice(this.m_profile.length, 0, ...this.root.profiles);
        }
        return this.m_profile;
    }
    /**
     * [Set] Список профилей
     */
    set profiles(value) {
        this.m_profile = value;
        return value;
    }
    
    get is_dep() {
        if (this.m_is_dep >= 0) 
            return this.m_is_dep > 0;
        if (this.root === null) 
            return false;
        if (this.root.profiles.includes(OrgProfile.UNIT)) 
            return true;
        return false;
    }
    set is_dep(value) {
        this.m_is_dep = (value ? 1 : 0);
        return value;
    }
    
    get coef() {
        if (this.m_coef >= 0) 
            return this.m_coef;
        if (this.root !== null) 
            return this.root.coeff;
        return 0;
    }
    set coef(value) {
        this.m_coef = value;
        return value;
    }
    
    /**
     * [Get] Количество слов в имени
     */
    get name_words_count() {
        let cou = 1;
        if (this.name === null) 
            return 1;
        for (let i = 0; i < this.name.length; i++) {
            if (this.name[i] === ' ') 
                cou++;
        }
        return cou;
    }
    
    /**
     * [Get] Корень - сомнительное слово (типа: организация или движение)
     */
    get is_doubt_root_word() {
        if (this.m_is_doubt_root_word >= 0) 
            return this.m_is_doubt_root_word === 1;
        if (this.root === null) 
            return false;
        return this.root.is_doubt_word;
    }
    /**
     * [Set] Корень - сомнительное слово (типа: организация или движение)
     */
    set is_doubt_root_word(value) {
        this.m_is_doubt_root_word = (value ? 1 : 0);
        return value;
    }
    
    toString() {
        if (this.name !== null) 
            return this.name;
        else 
            return this.typ;
    }
    
    static try_attach(t, can_be_first_letter_lower = false, ad = null) {
        if (t === null || (((t instanceof ReferentToken) && !t.chars.is_latin_letter))) 
            return null;
        let res = OrgItemTypeToken._try_attach(t, can_be_first_letter_lower);
        if (res !== null) {
        }
        if ((res === null && (t instanceof NumberToken) && (t.whitespaces_after_count < 3)) && t.next !== null && t.next.is_value("СЛУЖБА", null)) {
            res = OrgItemTypeToken._try_attach(t.next, can_be_first_letter_lower);
            if (res === null) 
                return null;
            res.number = (t).value;
            res.begin_token = t;
            return res;
        }
        if (res === null && t.chars.is_latin_letter) {
            if (t.is_value("THE", null)) {
                let res1 = OrgItemTypeToken.try_attach(t.next, can_be_first_letter_lower, null);
                if (res1 !== null) {
                    res1.begin_token = t;
                    return res1;
                }
                return null;
            }
            if ((t.get_referent() instanceof GeoReferent) && (t.next instanceof TextToken) && t.next.chars.is_latin_letter) {
                let res1 = OrgItemTypeToken.try_attach(t.next, can_be_first_letter_lower, null);
                if (res1 !== null) {
                    res1.begin_token = t;
                    res1.geo = Utils.as(t, ReferentToken);
                    res1.name = MiscHelper.get_text_value_of_meta_token(res1, GetTextAttr.NO);
                    return res1;
                }
            }
            if (t.chars.is_capital_upper) {
                let mc = t.get_morph_class_in_dictionary();
                if ((mc.is_conjunction || mc.is_preposition || mc.is_misc) || mc.is_pronoun || mc.is_personal_pronoun) {
                }
                else 
                    for (let ttt = t.next; ttt !== null; ttt = ttt.next) {
                        if (!ttt.chars.is_latin_letter) 
                            break;
                        if (ttt.whitespaces_before_count > 3) 
                            break;
                        if (MiscHelper.is_eng_adj_suffix(ttt.next)) {
                            ttt = ttt.next.next.next;
                            if (ttt === null) 
                                break;
                        }
                        let res1 = OrgItemTypeToken._try_attach(ttt, true);
                        if (res1 !== null) {
                            res1.name = MiscHelper.get_text_value(t, res1.end_token, GetTextAttr.IGNOREARTICLES);
                            if (res1.coef < 5) 
                                res1.coef = 5;
                            res1.begin_token = t;
                            return res1;
                        }
                        if (ttt.chars.is_all_lower && !ttt.is_and) 
                            break;
                        if (ttt.whitespaces_before_count > 1) 
                            break;
                    }
            }
        }
        if ((res !== null && res.name !== null && res.name.startsWith("СОВМЕСТ")) && LanguageHelper.ends_with_ex(res.name, "ПРЕДПРИЯТИЕ", "КОМПАНИЯ", null, null)) {
            res.root = OrgItemTypeToken.m_sovm_pred;
            res.typ = "совместное предприятие";
            for (let tt1 = t.next; tt1 !== null && tt1.end_char <= res.end_token.begin_char; tt1 = tt1.next) {
                let rt = tt1.kit.process_referent("GEO", tt1);
                if (rt !== null) {
                    res.coef = res.coef + 0.5;
                    if (res.geo === null) 
                        res.geo = rt;
                    else if (res.geo.referent.can_be_equals(rt.referent, ReferentEqualType.WITHINONETEXT)) {
                    }
                    else if (res.geo2 === null) 
                        res.geo2 = rt;
                    tt1 = rt.end_token;
                }
            }
        }
        if (((((res !== null && res.begin_token.length_char <= 2 && !res.begin_token.chars.is_all_lower) && res.begin_token.next !== null && res.begin_token.next.is_char('.')) && res.begin_token.next.next !== null && res.begin_token.next.next.length_char <= 2) && !res.begin_token.next.next.chars.is_all_lower && res.begin_token.next.next.next !== null) && res.begin_token.next.next.next.is_char('.') && res.end_token === res.begin_token.next.next.next) 
            return null;
        if (res !== null && res.typ === "управление") {
            if (res.name !== null && res.name.includes("ГОСУДАРСТВЕННОЕ")) 
                return null;
            if (res.begin_token.previous !== null && res.begin_token.previous.is_value("ГОСУДАРСТВЕННЫЙ", null)) 
                return null;
        }
        if (res !== null && res.geo === null && (res.begin_token.previous instanceof TextToken)) {
            let rt = res.kit.process_referent("GEO", res.begin_token.previous);
            if (rt !== null && rt.morph.class0.is_adjective) {
                if (res.begin_token.previous.previous !== null && res.begin_token.previous.previous.is_value("ОРДЕН", null)) {
                }
                else {
                    res.geo = rt;
                    res.begin_token = rt.begin_token;
                }
            }
        }
        if ((res !== null && res.typ === "комитет" && res.geo === null) && res.end_token.next !== null && (res.end_token.next.get_referent() instanceof GeoReferent)) {
            res.geo = Utils.as(res.end_token.next, ReferentToken);
            res.end_token = res.end_token.next;
            res.coef = 2;
            if (res.end_token.next !== null && res.end_token.next.is_value("ПО", null)) 
                res.coef = res.coef + (1);
        }
        if ((res !== null && res.typ === "агентство" && res.chars.is_capital_upper) && res.end_token.next !== null && res.end_token.next.is_value("ПО", null)) 
            res.coef = res.coef + (3);
        if (res !== null && res.geo !== null) {
            let has_adj = false;
            for (let tt1 = res.begin_token; tt1 !== null && tt1.end_char <= res.end_token.begin_char; tt1 = tt1.next) {
                let rt = tt1.kit.process_referent("GEO", tt1);
                if (rt !== null) {
                    if (res.geo !== null && res.geo.referent.can_be_equals(rt.referent, ReferentEqualType.WITHINONETEXT)) 
                        continue;
                    if (res.geo2 !== null && res.geo2.referent.can_be_equals(rt.referent, ReferentEqualType.WITHINONETEXT)) 
                        continue;
                    res.coef = res.coef + 0.5;
                    if (res.geo === null) 
                        res.geo = rt;
                    else if (res.geo2 === null) 
                        res.geo2 = rt;
                    tt1 = rt.end_token;
                }
                else if (tt1.get_morph_class_in_dictionary().is_adjective) 
                    has_adj = true;
            }
            if ((res.typ === "институт" || res.typ === "академия" || res.typ === "інститут") || res.typ === "академія") {
                if (has_adj) {
                    res.coef = res.coef + (2);
                    res.can_be_organization = true;
                }
            }
        }
        if (res !== null && res.geo === null) {
            let tt2 = res.end_token.next;
            if (tt2 !== null && !tt2.is_newline_before && tt2.morph.class0.is_preposition) {
                if (((tt2.next instanceof TextToken) && (tt2.next).term === "ВАШ" && res.root !== null) && res.root.profiles.includes(OrgProfile.JUSTICE)) {
                    res.coef = 5;
                    res.end_token = tt2.next;
                    tt2 = tt2.next.next;
                    res.name = (((res.name != null ? res.name : (res !== null && res.root !== null ? res.root.canonic_text : null)))) + " ПО ВЗЫСКАНИЮ АДМИНИСТРАТИВНЫХ ШТРАФОВ";
                    res.typ = "отдел";
                }
            }
            if (tt2 !== null && !tt2.is_newline_before && tt2.morph.class0.is_preposition) {
                tt2 = tt2.next;
                if (tt2 !== null && !tt2.is_newline_before && (tt2.get_referent() instanceof GeoReferent)) {
                    res.end_token = tt2;
                    res.geo = Utils.as(tt2, ReferentToken);
                    if ((tt2.next !== null && tt2.next.is_and && (tt2.next.next instanceof ReferentToken)) && (tt2.next.next.get_referent() instanceof GeoReferent)) {
                        tt2 = tt2.next.next;
                        res.end_token = tt2;
                        res.geo2 = Utils.as(tt2, ReferentToken);
                    }
                }
            }
            else if (((tt2 !== null && !tt2.is_newline_before && tt2.is_hiphen) && (tt2.next instanceof TextToken) && tt2.next.get_morph_class_in_dictionary().is_noun) && !tt2.next.is_value("БАНК", null)) {
                let npt1 = NounPhraseHelper.try_parse(res.end_token, NounPhraseParseAttr.NO, 0, null);
                if (npt1 !== null && npt1.end_token === tt2.next) {
                    res.alt_typ = npt1.get_normal_case_text(null, true, MorphGender.UNDEFINED, false).toLowerCase();
                    res.end_token = npt1.end_token;
                }
            }
            else if (tt2 !== null && (tt2.whitespaces_before_count < 3)) {
                let npt = NounPhraseHelper.try_parse(tt2, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.morph._case.is_genitive) {
                    let rr = tt2.kit.process_referent("NAMEDENTITY", tt2);
                    if (rr !== null && ((rr.morph._case.is_genitive || rr.morph._case.is_undefined)) && rr.referent.find_slot("KIND", "location", true) !== null) {
                        if (((res.root !== null && res.root.typ === OrgItemTerminTypes.DEP)) || res.typ === "департамент") {
                        }
                        else 
                            res.end_token = rr.end_token;
                    }
                    else if (res.root !== null && res.root.typ === OrgItemTerminTypes.PREFIX && npt.end_token.is_value("ОБРАЗОВАНИЕ", null)) {
                        res.end_token = npt.end_token;
                        res.profiles.push(OrgProfile.EDUCATION);
                    }
                }
            }
        }
        if (res !== null && res.typ !== null && Utils.isDigit(res.typ[0])) {
            let ii = res.typ.indexOf(' ');
            if (ii < (res.typ.length - 1)) {
                res.number = res.typ.substring(0, 0 + ii);
                res.typ = res.typ.substring(ii + 1).trim();
            }
        }
        if (res !== null && res.name !== null && Utils.isDigit(res.name[0])) {
            let ii = res.name.indexOf(' ');
            if (ii < (res.name.length - 1)) {
                res.number = res.name.substring(0, 0 + ii);
                res.name = res.name.substring(ii + 1).trim();
            }
        }
        if (res !== null && res.typ === "фонд") {
            if (t.previous !== null && ((t.previous.is_value("ПРИЗОВОЙ", null) || t.previous.is_value("ЖИЛИЩНЫЙ", null)))) 
                return null;
            if (res.begin_token.is_value("ПРИЗОВОЙ", null) || res.begin_token.is_value("ЖИЛИЩНЫЙ", null)) 
                return null;
        }
        if (res !== null && res.typ === "милли меджлис") 
            res.morph = new MorphCollection(res.end_token.morph);
        if (res !== null && res.length_char === 2 && res.typ === "АО") 
            res.is_doubt_root_word = true;
        if (res !== null && res.typ === "администрация" && t.next !== null) {
            if ((t.next.is_char('(') && t.next.next !== null && ((t.next.next.is_value("ПРАВИТЕЛЬСТВО", null) || t.next.next.is_value("ГУБЕРНАТОР", null)))) && t.next.next.next !== null && t.next.next.next.is_char(')')) {
                res.end_token = t.next.next.next;
                res.alt_typ = "правительство";
                return res;
            }
            if (t.next.get_referent() instanceof GeoReferent) 
                res.alt_typ = "правительство";
        }
        if ((res !== null && res.typ === "ассоциация" && res.end_token.next !== null) && (res.whitespaces_after_count < 2)) {
            let npt = NounPhraseHelper.try_parse(res.end_token.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                let str = MiscHelper.get_text_value_of_meta_token(npt, GetTextAttr.NO);
                res.name = (((res.name != null ? res.name : (res !== null && res.typ !== null ? res.typ.toUpperCase() : null))) + " " + str);
                res.end_token = npt.end_token;
                res.coef = res.coef + (1);
            }
        }
        if ((res !== null && res.typ === "представительство" && res.end_token.next !== null) && (res.whitespaces_after_count < 2)) {
            let npt = NounPhraseHelper.try_parse(res.end_token.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                if (npt.end_token.is_value("ИНТЕРЕС", null)) 
                    return null;
            }
        }
        if (res !== null && res.name !== null) {
            if (res.name.endsWith(" ПОЛОК")) 
                res.name = res.name.substring(0, 0 + res.name.length - 5) + "ПОЛК";
        }
        if (res !== null && ((res.typ === "производитель" || res.typ === "завод"))) {
            let tt1 = res.end_token.next;
            if (res.typ === "завод") {
                if ((tt1 !== null && tt1.is_value("ПО", null) && tt1.next !== null) && tt1.next.is_value("ПРОИЗВОДСТВО", null)) 
                    tt1 = tt1.next.next;
            }
            let npt = NounPhraseHelper.try_parse(tt1, NounPhraseParseAttr.NO, 0, null);
            if ((npt !== null && (res.whitespaces_after_count < 2) && tt1.chars.is_all_lower) && npt.morph._case.is_genitive) {
                let str = MiscHelper.get_text_value_of_meta_token(npt, GetTextAttr.NO);
                res.name = (((res.name != null ? res.name : (res !== null && res.typ !== null ? res.typ.toUpperCase() : null))) + " " + str);
                if (res.geo !== null) 
                    res.coef = res.coef + (1);
                res.end_token = npt.end_token;
            }
            else if (res.typ !== "завод") 
                return null;
        }
        if (res !== null && (res.begin_token.previous instanceof TextToken) && ((res.typ === "милиция" || res.typ === "полиция"))) {
        }
        if ((res !== null && res.begin_token === res.end_token && (res.begin_token instanceof TextToken)) && (res.begin_token).term === "ИП") {
            if (!BracketHelper.can_be_start_of_sequence(res.end_token.next, true, false) && !BracketHelper.can_be_end_of_sequence(res.begin_token.previous, false, null, false)) 
                return null;
        }
        if (res !== null && res.typ === "предприятие") {
            if (res.alt_typ === "головное предприятие" || res.alt_typ === "дочернее предприятие") 
                res.is_not_typ = true;
            else if (t.previous !== null && ((t.previous.is_value("ГОЛОВНОЙ", null) || t.previous.is_value("ДОЧЕРНИЙ", null)))) 
                return null;
        }
        if (res !== null && res.is_douter_org) {
            res.is_not_typ = true;
            if (res.begin_token !== res.end_token) {
                let res1 = OrgItemTypeToken._try_attach(res.begin_token.next, true);
                if (res1 !== null && !res1.is_doubt_root_word) 
                    res.is_not_typ = false;
            }
        }
        if (res !== null && res.typ === "суд") {
            let tt1 = Utils.as(res.end_token, TextToken);
            if (tt1 !== null && ((tt1.term === "СУДА" || tt1.term === "СУДОВ"))) {
                if ((((res.morph.number.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                    return null;
            }
        }
        if (res !== null && res.typ === "кафедра" && (t instanceof TextToken)) {
            if (t.is_value("КАФЕ", null) && ((t.next === null || !t.next.is_char('.')))) 
                return null;
        }
        if (res !== null && res.typ === "компания") {
            if ((t.previous !== null && t.previous.is_hiphen && t.previous.previous !== null) && t.previous.previous.is_value("КАЮТ", null)) 
                return null;
        }
        if (res !== null && t.previous !== null) {
            if (res.morph._case.is_genitive) {
                if (t.previous.is_value("СТАНДАРТ", null)) 
                    return null;
            }
        }
        if (res !== null && res.typ === "радиостанция" && res.name_words_count > 1) 
            return null;
        if ((res !== null && res.typ === "предприятие" && res.alt_typ !== null) && res.begin_token.morph.class0.is_adjective && !res.root.is_pure_prefix) {
            res.typ = res.alt_typ;
            res.alt_typ = null;
            res.coef = 3;
        }
        if (res !== null) {
            let npt = NounPhraseHelper.try_parse(res.end_token.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && ((npt.noun.is_value("ТИП", null) || npt.noun.is_value("РЕЖИМ", null))) && npt.morph._case.is_genitive) {
                res.end_token = npt.end_token;
                let s = (res.typ + " " + MiscHelper.get_text_value_of_meta_token(npt, GetTextAttr.NO)).toLowerCase();
                if (res.typ.includes("колония") || res.typ.includes("тюрьма")) {
                    res.coef = 3;
                    res.alt_typ = s;
                }
                else if (res.name === null || res.name.length === res.typ.length) 
                    res.name = s;
                else 
                    res.alt_typ = s;
            }
        }
        if (res !== null && res.profiles.includes(OrgProfile.EDUCATION) && (res.end_token.next instanceof TextToken)) {
            let tt1 = res.end_token.next;
            if ((tt1).term === "ВПО" || (tt1).term === "СПО") 
                res.end_token = res.end_token.next;
            else {
                let nnt = NounPhraseHelper.try_parse(tt1, NounPhraseParseAttr.NO, 0, null);
                if (nnt !== null && nnt.end_token.is_value("ОБРАЗОВАНИЕ", "ОСВІТА")) 
                    res.end_token = nnt.end_token;
            }
        }
        if (res !== null && res.root !== null && res.root.is_pure_prefix) {
            let tt1 = res.end_token.next;
            if (tt1 !== null && ((tt1.is_value("С", null) || tt1.is_value("C", null)))) {
                let npt = NounPhraseHelper.try_parse(tt1.next, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && ((npt.noun.is_value("ИНВЕСТИЦИЯ", null) || npt.noun.is_value("ОТВЕТСТВЕННОСТЬ", null)))) 
                    res.end_token = npt.end_token;
            }
        }
        if (res !== null && res.root === OrgItemTypeToken.m_military_unit && res.end_token.next !== null) {
            if (res.end_token.next.is_value("ПП", null)) 
                res.end_token = res.end_token.next;
            else if (res.end_token.next.is_value("ПОЛЕВОЙ", null) && res.end_token.next.next !== null && res.end_token.next.next.is_value("ПОЧТА", null)) 
                res.end_token = res.end_token.next.next;
        }
        if (res !== null) {
            if (res.name_words_count > 1 && res.typ === "центр") 
                res.can_be_dep_before_organization = true;
            else if (LanguageHelper.ends_with(res.typ, " центр")) 
                res.can_be_dep_before_organization = true;
            if (t.is_value("ГПК", null)) {
                if (res.geo !== null) 
                    return null;
                let gg = t.kit.process_referent("GEO", t.next);
                if (gg !== null || !((t.next instanceof TextToken)) || t.is_newline_after) 
                    return null;
                if (t.next.chars.is_all_upper || BracketHelper.can_be_start_of_sequence(t.next, true, false)) {
                }
                else 
                    return null;
            }
        }
        if (res !== null || !((t instanceof TextToken))) 
            return res;
        let tt = Utils.as(t, TextToken);
        let term = tt.term;
        if (tt.chars.is_all_upper && (((term === "CRM" || term === "IT" || term === "ECM") || term === "BPM" || term === "HR"))) {
            let tt2 = t.next;
            if (tt2 !== null && tt2.is_hiphen) 
                tt2 = tt2.next;
            res = OrgItemTypeToken._try_attach(tt2, true);
            if (res !== null && res.root !== null && res.root.profiles.includes(OrgProfile.UNIT)) {
                res.name = (((res.name != null ? res.name : (res !== null && res.root !== null ? res.root.canonic_text : null))) + " " + term);
                res.begin_token = t;
                res.coef = 5;
                return res;
            }
        }
        if (term === "ВЧ") {
            let tt1 = t.next;
            if (tt1 !== null && tt1.is_value("ПП", null)) 
                res = OrgItemTypeToken._new2312(t, tt1, 3);
            else if ((tt1 instanceof NumberToken) && (tt1.whitespaces_before_count < 3)) 
                res = new OrgItemTypeToken(t, t);
            else if (MiscHelper.check_number_prefix(tt1) !== null) 
                res = new OrgItemTypeToken(t, t);
            else if (((tt1 instanceof TextToken) && !tt1.is_whitespace_after && tt1.chars.is_letter) && tt1.length_char === 1) 
                res = new OrgItemTypeToken(t, t);
            if (res !== null) {
                res.root = OrgItemTypeToken.m_military_unit;
                res.typ = OrgItemTypeToken.m_military_unit.canonic_text.toLowerCase();
                res.profiles.push(OrgProfile.ARMY);
                return res;
            }
        }
        if (term === "КБ") {
            let cou = 0;
            let ok = false;
            for (let ttt = t.next; ttt !== null && (cou < 30); ttt = ttt.next,cou++) {
                if (ttt.is_value("БАНК", null)) {
                    ok = true;
                    break;
                }
                let r = ttt.get_referent();
                if (r !== null && r.type_name === "URI") {
                    let vv = r.get_string_value("SCHEME");
                    if ((vv === "БИК" || vv === "Р/С" || vv === "К/С") || vv === "ОКАТО") {
                        ok = true;
                        break;
                    }
                }
            }
            if (ok) {
                res = new OrgItemTypeToken(t, t);
                res.typ = "коммерческий банк";
                res.profiles.push(OrgProfile.FINANCE);
                res.coef = 3;
                return res;
            }
        }
        if (term === "ТП" || term === "МП") {
            let num = OrgItemNumberToken.try_attach(t.next, true, null);
            if (num !== null && num.end_token.next !== null) {
                let tt1 = num.end_token.next;
                if (tt1.is_comma && tt1.next !== null) 
                    tt1 = tt1.next;
                let oo = Utils.as(tt1.get_referent(), OrganizationReferent);
                if (oo !== null) {
                    if (oo.toString().toUpperCase().includes("МИГРАЦ")) {
                        res = OrgItemTypeToken._new2313(t, t, (term === "ТП" ? "территориальный пункт" : "миграционный пункт"), 4, true);
                        return res;
                    }
                }
            }
        }
        if (tt.chars.is_all_upper && term === "МГТУ") {
            if (tt.next.is_value("БАНК", null) || (((tt.next.get_referent() instanceof OrganizationReferent) && (tt.next.get_referent()).kind === OrganizationKind.BANK)) || ((tt.previous !== null && tt.previous.is_value("ОПЕРУ", null)))) {
                res = OrgItemTypeToken._new2314(tt, tt, "главное территориальное управление");
                res.alt_typ = "ГТУ";
                res.name = "МОСКОВСКОЕ";
                res.name_is_name = true;
                res.alt_name = "МГТУ";
                res.coef = 3;
                res.root = new OrgItemTermin(res.name);
                res.profiles.push(OrgProfile.UNIT);
                tt.term = "МОСКОВСКИЙ";
                res.geo = tt.kit.process_referent("GEO", tt);
                tt.term = "МГТУ";
                return res;
            }
        }
        if (tt.is_value("СОВЕТ", "РАДА")) {
            if (tt.next !== null && tt.next.is_value("ПРИ", null)) {
                let rt = tt.kit.process_referent("PERSONPROPERTY", tt.next.next);
                if (rt !== null) {
                    res = new OrgItemTypeToken(tt, tt);
                    res.typ = "совет";
                    res.is_dep = true;
                    res.coef = 2;
                    return res;
                }
            }
            if (tt.next !== null && (tt.next.get_referent() instanceof GeoReferent) && !tt.chars.is_all_lower) {
                res = new OrgItemTypeToken(tt, tt);
                res.geo = Utils.as(tt.next, ReferentToken);
                res.typ = "совет";
                res.is_dep = true;
                res.coef = 4;
                res.profiles.push(OrgProfile.STATE);
                return res;
            }
        }
        let say = false;
        if ((((term === "СООБЩАЕТ" || term === "СООБЩЕНИЮ" || term === "ПИШЕТ") || term === "ПЕРЕДАЕТ" || term === "ПОВІДОМЛЯЄ") || term === "ПОВІДОМЛЕННЯМ" || term === "ПИШЕ") || term === "ПЕРЕДАЄ") 
            say = true;
        if (((say || tt.is_value("ОБЛОЖКА", "ОБКЛАДИНКА") || tt.is_value("РЕДАКТОР", null)) || tt.is_value("КОРРЕСПОНДЕНТ", "КОРЕСПОНДЕНТ") || tt.is_value("ЖУРНАЛИСТ", "ЖУРНАЛІСТ")) || term === "ИНТЕРВЬЮ" || term === "ІНТЕРВЮ") {
            if (OrgItemTypeToken.m_pressru === null) 
                OrgItemTypeToken.m_pressru = OrgItemTermin._new2315("ИЗДАНИЕ", MorphLang.RU, OrgProfile.MEDIA, true, 4);
            if (OrgItemTypeToken.m_pressua === null) 
                OrgItemTypeToken.m_pressua = OrgItemTermin._new2315("ВИДАННЯ", MorphLang.UA, OrgProfile.MEDIA, true, 4);
            let pres = (tt.kit.base_language.is_ua ? OrgItemTypeToken.m_pressua : OrgItemTypeToken.m_pressru);
            let t1 = t.next;
            if (t1 === null) 
                return null;
            if (t1.chars.is_latin_letter && !t1.chars.is_all_lower) {
                if (tt.is_value("РЕДАКТОР", null)) 
                    return null;
                return OrgItemTypeToken._new2317(t, t, pres.canonic_text.toLowerCase(), pres, true);
            }
            if (!say) {
                let br = BracketHelper.try_parse(t1, BracketParseAttr.NO, 100);
                if ((br !== null && br.is_quote_type && !t1.next.chars.is_all_lower) && ((br.end_char - br.begin_char) < 40)) 
                    return OrgItemTypeToken._new2317(t, t, pres.canonic_text.toLowerCase(), pres, true);
            }
            let npt = NounPhraseHelper.try_parse(t1, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.end_token.next !== null) {
                t1 = npt.end_token.next;
                let _root = npt.noun.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                let ok = t1.chars.is_latin_letter && !t1.chars.is_all_lower;
                if (!ok && BracketHelper.can_be_start_of_sequence(t1, true, false)) 
                    ok = true;
                if (ok) {
                    if ((_root === "ИЗДАНИЕ" || _root === "ИЗДАТЕЛЬСТВО" || _root === "ЖУРНАЛ") || _root === "ВИДАННЯ" || _root === "ВИДАВНИЦТВО") {
                        res = OrgItemTypeToken._new2314(npt.begin_token, npt.end_token, _root.toLowerCase());
                        res.profiles.push(OrgProfile.MEDIA);
                        res.profiles.push(OrgProfile.PRESS);
                        if (npt.adjectives.length > 0) {
                            for (const a of npt.adjectives) {
                                let rt1 = res.kit.process_referent("GEO", a.begin_token);
                                if (rt1 !== null && rt1.morph.class0.is_adjective) {
                                    if (res.geo === null) 
                                        res.geo = rt1;
                                    else 
                                        res.geo2 = rt1;
                                }
                            }
                            res.alt_typ = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false).toLowerCase();
                        }
                        res.root = OrgItemTermin._new2320(_root, true, 4);
                        return res;
                    }
                }
            }
            let rt = t1.kit.process_referent("GEO", t1);
            if (rt !== null && rt.morph.class0.is_adjective) {
                if (rt.end_token.next !== null && rt.end_token.next.chars.is_latin_letter) {
                    res = OrgItemTypeToken._new2321(t1, rt.end_token, pres.canonic_text.toLowerCase(), pres);
                    res.geo = rt;
                    return res;
                }
            }
            let tt1 = t1;
            if (BracketHelper.can_be_start_of_sequence(tt1, true, false)) 
                tt1 = t1.next;
            if ((((tt1.chars.is_latin_letter && tt1.next !== null && tt1.next.is_char('.')) && tt1.next.next !== null && tt1.next.next.chars.is_latin_letter) && (tt1.next.next.length_char < 4) && tt1.next.next.length_char > 1) && !tt1.next.is_whitespace_after) {
                if (tt1 !== t1 && !BracketHelper.can_be_end_of_sequence(tt1.next.next.next, true, t1, false)) {
                }
                else {
                    res = OrgItemTypeToken._new2321(t1, tt1.next.next, pres.canonic_text.toLowerCase(), pres);
                    res.name = Utils.replaceString(MiscHelper.get_text_value(t1, tt1.next.next, GetTextAttr.NO), " ", "");
                    if (tt1 !== t1) 
                        res.end_token = res.end_token.next;
                    res.coef = 4;
                }
                return res;
            }
        }
        else if ((t.is_value("ЖУРНАЛ", null) || t.is_value("ИЗДАНИЕ", null) || t.is_value("ИЗДАТЕЛЬСТВО", null)) || t.is_value("ВИДАННЯ", null) || t.is_value("ВИДАВНИЦТВО", null)) {
            let ok = false;
            if (ad !== null) {
                let ot_ex_li = ad.local_ontology.try_attach(t.next, null, false);
                if (ot_ex_li === null && t.kit.ontology !== null) 
                    ot_ex_li = t.kit.ontology.attach_token(OrganizationReferent.OBJ_TYPENAME, t.next);
                if ((ot_ex_li !== null && ot_ex_li.length > 0 && ot_ex_li[0].item !== null) && (ot_ex_li[0].item.referent instanceof OrganizationReferent)) {
                    if ((ot_ex_li[0].item.referent).kind === OrganizationKind.PRESS) 
                        ok = true;
                }
            }
            if (t.next !== null && t.next.chars.is_latin_letter && !t.next.chars.is_all_lower) 
                ok = true;
            if (ok) {
                res = OrgItemTypeToken._new2314(t, t, t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false).toLowerCase());
                res.profiles.push(OrgProfile.MEDIA);
                res.profiles.push(OrgProfile.PRESS);
                res.root = OrgItemTermin._new2324(t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false), OrgItemTerminTypes.ORG, 3, true);
                res.morph = t.morph;
                res.chars = t.chars;
                if (t.previous !== null && t.previous.morph.class0.is_adjective) {
                    let rt = t.kit.process_referent("GEO", t.previous);
                    if (rt !== null && rt.end_token === t.previous) {
                        res.begin_token = t.previous;
                        res.geo = rt;
                    }
                }
                return res;
            }
        }
        else if ((term === "МО" && t.chars.is_all_upper && (t.next instanceof ReferentToken)) && (t.next.get_referent() instanceof GeoReferent)) {
            let _geo = Utils.as(t.next.get_referent(), GeoReferent);
            if (_geo !== null && _geo.is_state) {
                res = OrgItemTypeToken._new2325(t, t, "министерство", "МИНИСТЕРСТВО ОБОРОНЫ", 4, OrgItemTypeToken.m_mo);
                res.profiles.push(OrgProfile.STATE);
                res.can_be_organization = true;
                return res;
            }
        }
        else if (term === "ИК" && t.chars.is_all_upper) {
            let et = null;
            if (OrgItemNumberToken.try_attach(t.next, false, null) !== null) 
                et = t;
            else if (t.next !== null && (t.next instanceof NumberToken)) 
                et = t;
            else if ((t.next !== null && t.next.is_hiphen && t.next.next !== null) && (t.next.next instanceof NumberToken)) 
                et = t.next;
            if (et !== null) 
                return OrgItemTypeToken._new2326(t, et, "исправительная колония", "колония", OrgItemTypeToken.m_ispr_kolon, true);
        }
        else if (t.is_value("ПАКЕТ", null) && t.next !== null && t.next.is_value("АКЦИЯ", "АКЦІЯ")) 
            return OrgItemTypeToken._new2327(t, t.next, 4, true, "");
        else {
            let tok = OrgItemTypeToken.m_pref_words.try_parse(t, TerminParseAttr.NO);
            if (tok !== null && tok.tag !== null) {
                if ((tok.whitespaces_after_count < 2) && BracketHelper.can_be_start_of_sequence(tok.end_token.next, true, false)) 
                    return OrgItemTypeToken._new2327(t, tok.end_token, 4, true, "");
            }
        }
        if (res === null && term === "АК" && t.chars.is_all_upper) {
            if (OrgItemTypeToken.try_attach(t.next, can_be_first_letter_lower, ad) !== null) 
                return OrgItemTypeToken._new2329(t, t, OrgItemTypeToken.m_akcion_comp, OrgItemTypeToken.m_akcion_comp.canonic_text.toLowerCase());
        }
        if (term === "В") {
            if ((t.next !== null && t.next.is_char_of("\\/") && t.next.next !== null) && t.next.next.is_value("Ч", null)) {
                if (OrgItemNumberToken.try_attach(t.next.next.next, true, null) !== null) 
                    return OrgItemTypeToken._new2329(t, t.next.next, OrgItemTypeToken.m_military_unit, OrgItemTypeToken.m_military_unit.canonic_text.toLowerCase());
            }
        }
        if (t.morph.class0.is_adjective && t.next !== null && ((t.next.chars.is_all_upper || t.next.chars.is_last_lower))) {
            if (t.chars.is_capital_upper || (((t.previous !== null && t.previous.is_hiphen && t.previous.previous !== null) && t.previous.previous.chars.is_capital_upper))) {
                let res1 = OrgItemTypeToken._try_attach(t.next, true);
                if ((res1 !== null && res1.end_token === t.next && res1.name === null) && res1.root !== null) {
                    res1.begin_token = t;
                    res1.coef = 5;
                    let gen = MorphGender.UNDEFINED;
                    for (let ii = res1.root.canonic_text.length - 1; ii >= 0; ii--) {
                        if (ii === 0 || res1.root.canonic_text[ii - 1] === ' ') {
                            let mm = Morphology.get_word_base_info(res1.root.canonic_text.substring(ii), null, false, false);
                            gen = mm.gender;
                            break;
                        }
                    }
                    let nam = t.get_normal_case_text(MorphClass.ADJECTIVE, true, gen, false);
                    if (((t.previous !== null && t.previous.is_hiphen && (t.previous.previous instanceof TextToken)) && t.previous.previous.chars.is_capital_upper && !t.is_whitespace_before) && !t.previous.is_whitespace_before) {
                        res1.begin_token = t.previous.previous;
                        nam = ((res1.begin_token).term + "-" + nam);
                    }
                    res1.name = nam;
                    return res1;
                }
            }
        }
        if ((t.morph.class0.is_adjective && !term.endsWith("ВО") && !t.chars.is_all_lower) && (t.whitespaces_after_count < 2)) {
            let res1 = OrgItemTypeToken._try_attach(t.next, true);
            if ((res1 !== null && res1.profiles.includes(OrgProfile.TRANSPORT) && res1.name === null) && res1.root !== null) {
                let nam = t.get_normal_case_text(MorphClass.ADJECTIVE, true, (res1.root.canonic_text.endsWith("ДОРОГА") ? MorphGender.FEMINIE : MorphGender.MASCULINE), false);
                if (nam !== null) {
                    if (((t.previous !== null && t.previous.is_hiphen && (t.previous.previous instanceof TextToken)) && t.previous.previous.chars.is_capital_upper && !t.is_whitespace_before) && !t.previous.is_whitespace_before) {
                        t = t.previous.previous;
                        nam = ((t).term + "-" + nam);
                    }
                    res1.begin_token = t;
                    res1.coef = 5;
                    res1.name = (nam + " " + res1.root.canonic_text);
                    res1.can_be_organization = true;
                    return res1;
                }
            }
        }
        return res;
    }
    
    static _try_attach(t, can_be_first_letter_lower) {
        if (t === null) 
            return null;
        let res = null;
        let li = OrgItemTypeToken.m_global.try_attach(t, null, false);
        if (li !== null) {
            if (t.previous !== null && t.previous.is_hiphen && !t.is_whitespace_before) {
                let li1 = OrgItemTypeToken.m_global.try_attach(t.previous.previous, null, false);
                if (li1 !== null && li1[0].end_token === li[0].end_token) 
                    return null;
            }
            res = new OrgItemTypeToken(li[0].begin_token, li[0].end_token);
            res.root = Utils.as(li[0].termin, OrgItemTermin);
            let nn = NounPhraseHelper.try_parse(li[0].begin_token, NounPhraseParseAttr.NO, 0, null);
            if (nn !== null && ((nn.end_token.next === null || !nn.end_token.next.is_char('.')))) 
                res.morph = nn.morph;
            else 
                res.morph = li[0].morph;
            res.chars_root = res.chars;
            if (res.root.is_pure_prefix) {
                res.typ = res.root.acronym;
                if (res.typ === null) 
                    res.typ = res.root.canonic_text.toLowerCase();
            }
            else 
                res.typ = res.root.canonic_text.toLowerCase();
            if (res.begin_token !== res.end_token && !res.root.is_pure_prefix) {
                let npt0 = NounPhraseHelper.try_parse(res.begin_token, NounPhraseParseAttr.NO, 0, null);
                if (npt0 !== null && npt0.end_token === res.end_token && npt0.adjectives.length >= res.name_words_count) {
                    let s = npt0.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                    if (Utils.compareStrings(s, res.typ, true) !== 0) {
                        res.name = s;
                        res.can_be_organization = true;
                    }
                }
            }
            if (res.typ === "сберегательный банк" && res.name === null) {
                res.name = res.typ.toUpperCase();
                res.typ = "банк";
            }
            if (res.is_dep && res.typ.startsWith("отдел ") && res.name === null) {
                res.name = res.typ.toUpperCase();
                res.typ = "отдел";
            }
            if (res.begin_token === res.end_token) {
                if (res.chars.is_capital_upper) {
                    if ((res.length_char < 4) && !res.begin_token.is_value(res.root.canonic_text, null)) {
                        if (!can_be_first_letter_lower) 
                            return null;
                    }
                }
                if (res.chars.is_all_upper) {
                    if (res.begin_token.is_value("САН", null)) 
                        return null;
                }
            }
            if (res.end_token.next !== null && res.end_token.next.is_char('(')) {
                let li22 = OrgItemTypeToken.m_global.try_attach(res.end_token.next.next, null, false);
                if ((li22 !== null && li22.length > 0 && li22[0].termin === li[0].termin) && li22[0].end_token.next !== null && li22[0].end_token.next.is_char(')')) 
                    res.end_token = li22[0].end_token.next;
            }
            return res;
        }
        if ((t instanceof NumberToken) && t.morph.class0.is_adjective) {
        }
        else if (t instanceof TextToken) {
        }
        else 
            return null;
        if (t.is_value("СБ", null)) {
            if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) {
                let _geo = Utils.as(t.next.get_referent(), GeoReferent);
                if (_geo.is_state) {
                    if (_geo.alpha2 !== "RU") 
                        return OrgItemTypeToken._new2331(t, t, "управление", true, OrgItemTypeToken.m_sec_serv, OrgItemTypeToken.m_sec_serv.canonic_text);
                }
                return OrgItemTypeToken._new2331(t, t, "банк", true, OrgItemTypeToken.m_sber_bank, OrgItemTypeToken.m_sber_bank.canonic_text);
            }
        }
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.IGNOREADJBEST, 0, null);
        if (npt === null || npt.internal_noun !== null) {
            if (((!t.chars.is_all_lower && t.next !== null && t.next.is_hiphen) && !t.is_whitespace_after && !t.next.is_whitespace_after) && t.next.next !== null && t.next.next.is_value("БАНК", null)) {
                let s = t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                res = OrgItemTypeToken._new2333(t, t.next.next, s, t.next.next.morph, t.chars, t.next.next.chars);
                res.root = OrgItemTypeToken.m_bank;
                res.typ = "банк";
                return res;
            }
            if ((t instanceof NumberToken) && (t.whitespaces_after_count < 3) && (t.next instanceof TextToken)) {
                let res11 = OrgItemTypeToken._try_attach(t.next, false);
                if (res11 !== null && res11.root !== null && res11.root.can_has_number) {
                    res11.begin_token = t;
                    res11.number = (t).value.toString();
                    res11.coef = res11.coef + (1);
                    return res11;
                }
            }
            return null;
        }
        if (npt.morph.gender === MorphGender.FEMINIE && npt.noun.get_normal_case_text(null, false, MorphGender.UNDEFINED, false) === "БАНКА") 
            return null;
        if (npt.begin_token === npt.end_token) {
            let s = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
            if (LanguageHelper.ends_with_ex(s, "БАНК", "БАНКА", "БАНОК", null)) {
                if (LanguageHelper.ends_with(s, "БАНКА")) 
                    s = s.substring(0, 0 + s.length - 1);
                else if (LanguageHelper.ends_with(s, "БАНОК")) 
                    s = s.substring(0, 0 + s.length - 2) + "К";
                res = OrgItemTypeToken._new2333(npt.begin_token, npt.end_token, s, npt.morph, npt.chars, npt.chars);
                res.root = OrgItemTypeToken.m_bank;
                res.typ = "банк";
                return res;
            }
            return null;
        }
        for (let tt = npt.end_token; tt !== null; tt = tt.previous) {
            if (tt === npt.begin_token) 
                break;
            let lii = OrgItemTypeToken.m_global.try_attach(tt, null, false);
            if (lii !== null) {
                if (tt === npt.end_token && tt.previous !== null && tt.previous.is_hiphen) 
                    continue;
                li = lii;
                if (li[0].end_char < npt.end_char) 
                    npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.IGNOREADJBEST, li[0].end_char, null);
                break;
            }
        }
        if (li === null || npt === null) 
            return null;
        res = new OrgItemTypeToken(npt.begin_token, li[0].end_token);
        for (const a of npt.adjectives) {
            if (a.is_value("ДОЧЕРНИЙ", null) || a.is_value("ДОЧІРНІЙ", null)) {
                res.is_douter_org = true;
                break;
            }
        }
        for (const em of OrgItemTypeToken.M_EMPTY_TYP_WORDS) {
            for (const a of npt.adjectives) {
                if (a.is_value(em, null)) {
                    Utils.removeItem(npt.adjectives, a);
                    break;
                }
            }
        }
        while (npt.adjectives.length > 0) {
            if (npt.adjectives[0].begin_token.get_morph_class_in_dictionary().is_verb) 
                npt.adjectives.splice(0, 1);
            else if (npt.adjectives[0].begin_token instanceof NumberToken) {
                res.number = (npt.adjectives[0].begin_token).value.toString();
                npt.adjectives.splice(0, 1);
            }
            else 
                break;
        }
        if (npt.adjectives.length > 0) {
            res.alt_typ = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
            if (li[0].end_char > npt.end_char) 
                res.alt_typ = (res.alt_typ + " " + MiscHelper.get_text_value(npt.end_token.next, li[0].end_token, GetTextAttr.NO));
        }
        if (res.number === null) {
            while (npt.adjectives.length > 0) {
                if (!npt.adjectives[0].chars.is_all_lower || can_be_first_letter_lower) 
                    break;
                if (npt.kit.process_referent("GEO", npt.adjectives[0].begin_token) !== null) 
                    break;
                if (OrgItemTypeToken.is_std_adjective(npt.adjectives[0], false)) 
                    break;
                let bad = false;
                if (!npt.noun.chars.is_all_lower || !OrgItemTypeToken.is_std_adjective(npt.adjectives[0], false)) 
                    bad = true;
                else 
                    for (let i = 1; i < npt.adjectives.length; i++) {
                        if (npt.kit.process_referent("GEO", npt.adjectives[i].begin_token) !== null) 
                            continue;
                        if (!npt.adjectives[i].chars.is_all_lower) {
                            bad = true;
                            break;
                        }
                    }
                if (!bad) 
                    break;
                npt.adjectives.splice(0, 1);
            }
        }
        for (const a of npt.adjectives) {
            let r = npt.kit.process_referent("GEO", a.begin_token);
            if (r !== null) {
                if (a === npt.adjectives[0]) {
                    let res2 = OrgItemTypeToken._try_attach(a.end_token.next, true);
                    if (res2 !== null && res2.end_char > npt.end_char && res2.geo === null) {
                        res2.begin_token = a.begin_token;
                        res2.geo = r;
                        return res2;
                    }
                }
                if (res.geo === null) 
                    res.geo = r;
                else if (res.geo2 === null) 
                    res.geo2 = r;
            }
        }
        if (res.end_token === npt.end_token) 
            res.name = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
        if (res.name === res.alt_typ) 
            res.alt_typ = null;
        if (res.alt_typ !== null) 
            res.alt_typ = Utils.replaceString(res.alt_typ.toLowerCase(), '-', ' ');
        res.root = Utils.as(li[0].termin, OrgItemTermin);
        if (res.root.is_pure_prefix && (li[0].length_char < 7)) 
            return null;
        res.typ = res.root.canonic_text.toLowerCase();
        if (npt.adjectives.length > 0) {
            for (let i = 0; i < npt.adjectives.length; i++) {
                let s = npt.get_normal_case_text_without_adjective(i);
                let ctli = OrgItemTypeToken.m_global.find_termin_by_canonic_text(s);
                if (ctli !== null && ctli.length > 0 && (ctli[0] instanceof OrgItemTermin)) {
                    res.root = Utils.as(ctli[0], OrgItemTermin);
                    if (res.alt_typ === null) {
                        res.alt_typ = res.root.canonic_text.toLowerCase();
                        if (res.alt_typ === res.typ) 
                            res.alt_typ = null;
                    }
                    break;
                }
            }
            res.coef = res.root.coeff;
            if (res.coef === 0) {
                for (let i = 0; i < npt.adjectives.length; i++) {
                    if (OrgItemTypeToken.is_std_adjective(npt.adjectives[i], true)) {
                        res.coef = res.coef + (1);
                        if (((i + 1) < npt.adjectives.length) && !OrgItemTypeToken.is_std_adjective(npt.adjectives[i + 1], false)) 
                            res.coef = res.coef + (1);
                        if (npt.adjectives[i].is_value("ФЕДЕРАЛЬНЫЙ", "ФЕДЕРАЛЬНИЙ") || npt.adjectives[i].is_value("ГОСУДАРСТВЕННЫЙ", "ДЕРЖАВНИЙ")) {
                            res.is_doubt_root_word = false;
                            if (res.is_dep) 
                                res.is_dep = false;
                        }
                    }
                    else if (OrgItemTypeToken.is_std_adjective(npt.adjectives[i], false)) 
                        res.coef = res.coef + 0.5;
                }
            }
            else 
                for (let i = 0; i < (npt.adjectives.length - 1); i++) {
                    if (OrgItemTypeToken.is_std_adjective(npt.adjectives[i], true)) {
                        if (((i + 1) < npt.adjectives.length) && !OrgItemTypeToken.is_std_adjective(npt.adjectives[i + 1], true)) {
                            res.coef = res.coef + (1);
                            res.is_doubt_root_word = false;
                            res.can_be_organization = true;
                            if (res.is_dep) 
                                res.is_dep = false;
                        }
                    }
                }
        }
        res.morph = npt.morph;
        res.chars = npt.chars;
        if (!res.chars.is_all_upper && !res.chars.is_capital_upper && !res.chars.is_all_lower) {
            res.chars = npt.noun.chars;
            if (res.chars.is_all_lower) 
                res.chars = res.begin_token.chars;
        }
        if (npt.noun !== null) 
            res.chars_root = npt.noun.chars;
        return res;
    }
    
    static is_std_adjective(t, only_federal = false) {
        if (t === null) 
            return false;
        if (t instanceof MetaToken) 
            t = (t).begin_token;
        let tt = (t.morph.language.is_ua ? OrgItemTypeToken.m_std_adjsua.try_parse(t, TerminParseAttr.NO) : OrgItemTypeToken.m_std_adjs.try_parse(t, TerminParseAttr.NO));
        if (tt === null) 
            return false;
        if (only_federal) {
            if (tt.termin.tag === null) 
                return false;
        }
        return true;
    }
    
    /**
     * Проверка, что перед токеном есть специфическое слово типа "Президент" и т.п.
     * @param t 
     * @return 
     */
    static check_org_special_word_before(t) {
        if (t === null) 
            return false;
        if (t.is_comma_and && t.previous !== null) 
            t = t.previous;
        let k = 0;
        let ty = null;
        for (let tt = t; tt !== null; tt = tt.previous) {
            let r = tt.get_referent();
            if (r !== null) {
                if (tt === t && (r instanceof OrganizationReferent)) 
                    return true;
                return false;
            }
            if (!((tt instanceof TextToken))) {
                if (!((tt instanceof NumberToken))) 
                    break;
                k++;
                continue;
            }
            if (tt.is_newline_after) {
                if (!tt.is_char(',')) 
                    return false;
                continue;
            }
            if (tt.is_value("УПРАВЛЕНИЕ", null) || tt.is_value("УПРАВЛІННЯ", null)) {
                ty = OrgItemTypeToken.try_attach(tt.next, true, null);
                if (ty !== null && ty.is_doubt_root_word) 
                    return false;
            }
            if (tt === t && OrgItemTypeToken.m_pref_words.try_parse(tt, TerminParseAttr.NO) !== null) 
                return true;
            if (tt === t && tt.is_char('.')) 
                continue;
            ty = OrgItemTypeToken.try_attach(tt, true, null);
            if (ty !== null && ty.end_token.end_char <= t.end_char && ty.end_token === t) {
                if (!ty.is_doubt_root_word) 
                    return true;
            }
            if (tt.kit.recurse_level === 0) {
                let rt = tt.kit.process_referent("PERSONPROPERTY", tt);
                if (rt !== null && rt.referent !== null && rt.referent.type_name === "PERSONPROPERTY") {
                    if (rt.end_char >= t.end_char) 
                        return true;
                }
            }
            k++;
            if (k > 4) 
                break;
        }
        return false;
    }
    
    static check_person_property(t) {
        if (t === null || !t.chars.is_cyrillic_letter) 
            return false;
        let tok = OrgItemTypeToken.m_pref_words.try_parse(t, TerminParseAttr.NO);
        if (tok === null) 
            return false;
        if (tok.termin.tag === null) 
            return false;
        return true;
    }
    
    static try_attach_reference_to_exist_org(t) {
        if (!((t instanceof TextToken))) 
            return null;
        let tok = OrgItemTypeToken.m_key_words_for_refs.try_parse(t, TerminParseAttr.NO);
        if (tok === null && t.morph.class0.is_pronoun) 
            tok = OrgItemTypeToken.m_key_words_for_refs.try_parse(t.next, TerminParseAttr.NO);
        let abbr = null;
        if (tok === null) {
            if (t.length_char > 1 && ((t.chars.is_capital_upper || t.chars.is_last_lower))) 
                abbr = (t).get_lemma();
            else {
                let ty1 = OrgItemTypeToken._try_attach(t, true);
                if (ty1 !== null) 
                    abbr = ty1.typ;
                else 
                    return null;
            }
        }
        let cou = 0;
        for (let tt = t.previous; tt !== null; tt = tt.previous) {
            if (tt.is_newline_after) 
                cou += 10;
            cou++;
            if (cou > 500) 
                break;
            if (!((tt instanceof ReferentToken))) 
                continue;
            let refs = tt.get_referents();
            if (refs === null) 
                continue;
            for (const r of refs) {
                if (r instanceof OrganizationReferent) {
                    if (abbr !== null) {
                        if (r.find_slot(OrganizationReferent.ATTR_TYPE, abbr, true) === null) 
                            continue;
                        let rt = new ReferentToken(r, t, t);
                        let hi = Utils.as(r.get_slot_value(OrganizationReferent.ATTR_HIGHER), OrganizationReferent);
                        if (hi !== null && t.next !== null) {
                            for (const ty of hi.types) {
                                if (t.next.is_value(ty.toUpperCase(), null)) {
                                    rt.end_token = t.next;
                                    break;
                                }
                            }
                        }
                        return rt;
                    }
                    if (tok.termin.tag !== null) {
                        let ok = false;
                        for (const ty of (r).types) {
                            if (Utils.endsWithString(ty, tok.termin.canonic_text, true)) {
                                ok = true;
                                break;
                            }
                        }
                        if (!ok) 
                            continue;
                    }
                    return new ReferentToken(r, t, tok.end_token);
                }
            }
        }
        return null;
    }
    
    static is_types_antagonisticoo(r1, r2) {
        let k1 = r1.kind;
        let k2 = r2.kind;
        if (k1 !== OrganizationKind.UNDEFINED && k2 !== OrganizationKind.UNDEFINED) {
            if (OrgItemTypeToken.is_types_antagonistickk(k1, k2)) 
                return true;
        }
        let types1 = r1.types;
        let types2 = r2.types;
        for (const t1 of types1) {
            if (types2.includes(t1)) 
                return false;
        }
        for (const t1 of types1) {
            for (const t2 of types2) {
                if (OrgItemTypeToken.is_types_antagonisticss(t1, t2)) 
                    return true;
            }
        }
        return false;
    }
    
    static is_type_accords(r1, t2) {
        if (t2 === null || t2.typ === null) 
            return false;
        if (t2.typ === "министерство" || t2.typ === "міністерство" || t2.typ.endsWith("штаб")) 
            return r1.find_slot(OrganizationReferent.ATTR_TYPE, t2.typ, true) !== null;
        let prs = r1.profiles;
        for (const pr of prs) {
            if (t2.profiles.includes(pr)) 
                return true;
        }
        if (r1.find_slot(OrganizationReferent.ATTR_TYPE, null, true) === null) {
            if (prs.length === 0) 
                return true;
        }
        if (t2.profiles.length === 0) {
            if (prs.includes(OrgProfile.POLICY)) {
                if (t2.typ === "группа" || t2.typ === "организация") 
                    return true;
            }
            if (prs.includes(OrgProfile.MUSIC)) {
                if (t2.typ === "группа") 
                    return true;
            }
        }
        for (const t of r1.types) {
            if (t === t2.typ) 
                return true;
            if (t.endsWith(t2.typ)) 
                return true;
            if (t2.typ === "издание") {
                if (t.endsWith("агентство")) 
                    return true;
            }
        }
        if ((t2.typ === "компания" || t2.typ === "корпорация" || t2.typ === "company") || t2.typ === "corporation") {
            if (prs.length === 0) 
                return true;
            if (prs.includes(OrgProfile.BUSINESS) || prs.includes(OrgProfile.FINANCE) || prs.includes(OrgProfile.INDUSTRY)) 
                return true;
        }
        return false;
    }
    
    static is_types_antagonistictt(t1, t2) {
        let k1 = OrgItemTypeToken._get_kind(t1.typ, (t1.name != null ? t1.name : ""), null);
        let k2 = OrgItemTypeToken._get_kind(t2.typ, (t2.name != null ? t2.name : ""), null);
        if (k1 === OrganizationKind.JUSTICE && t2.typ.startsWith("Ф")) 
            return false;
        if (k2 === OrganizationKind.JUSTICE && t1.typ.startsWith("Ф")) 
            return false;
        if (OrgItemTypeToken.is_types_antagonistickk(k1, k2)) 
            return true;
        if (OrgItemTypeToken.is_types_antagonisticss(t1.typ, t2.typ)) 
            return true;
        if (k1 === OrganizationKind.BANK && k2 === OrganizationKind.BANK) {
            if (t1.name !== null && t2.name !== null && t1 !== t2) 
                return true;
        }
        return false;
    }
    
    static is_types_antagonisticss(typ1, typ2) {
        if (typ1 === typ2) 
            return false;
        let uni = (typ1 + " " + typ2 + " ");
        if ((((uni.includes("служба") || uni.includes("департамент") || uni.includes("отделение")) || uni.includes("отдел") || uni.includes("відділення")) || uni.includes("відділ") || uni.includes("инспекция")) || uni.includes("інспекція")) 
            return true;
        if (uni.includes("министерство") || uni.includes("міністерство")) 
            return true;
        if (uni.includes("правительство") && !uni.includes("администрация")) 
            return true;
        if (uni.includes("уряд") && !uni.includes("адміністрація")) 
            return true;
        if (typ1 === "управление" && ((typ2 === "главное управление" || typ2 === "пограничное управление"))) 
            return true;
        if (typ2 === "управление" && ((typ1 === "главное управление" || typ2 === "пограничное управление"))) 
            return true;
        if (typ1 === "керування" && typ2 === "головне управління") 
            return true;
        if (typ2 === "керування" && typ1 === "головне управління") 
            return true;
        if (typ1 === "university") {
            if (typ2 === "school" || typ2 === "college") 
                return true;
        }
        if (typ2 === "university") {
            if (typ1 === "school" || typ1 === "college") 
                return true;
        }
        return false;
    }
    
    static is_types_antagonistickk(k1, k2) {
        if (k1 === k2) 
            return false;
        if (k1 === OrganizationKind.DEPARTMENT || k2 === OrganizationKind.DEPARTMENT) 
            return false;
        if (k1 === OrganizationKind.GOVENMENT || k2 === OrganizationKind.GOVENMENT) 
            return true;
        if (k1 === OrganizationKind.JUSTICE || k2 === OrganizationKind.JUSTICE) 
            return true;
        if (k1 === OrganizationKind.PARTY || k2 === OrganizationKind.PARTY) {
            if (k2 === OrganizationKind.FEDERATION || k1 === OrganizationKind.FEDERATION) 
                return false;
            return true;
        }
        if (k1 === OrganizationKind.STUDY) 
            k1 = OrganizationKind.SCIENCE;
        if (k2 === OrganizationKind.STUDY) 
            k2 = OrganizationKind.SCIENCE;
        if (k1 === OrganizationKind.PRESS) 
            k1 = OrganizationKind.MEDIA;
        if (k2 === OrganizationKind.PRESS) 
            k2 = OrganizationKind.MEDIA;
        if (k1 === k2) 
            return false;
        if (k1 === OrganizationKind.UNDEFINED || k2 === OrganizationKind.UNDEFINED) 
            return false;
        return true;
    }
    
    static check_kind(obj) {
        let t = new StringBuilder();
        let n = new StringBuilder();
        for (const s of obj.slots) {
            if (s.type_name === OrganizationReferent.ATTR_NAME) 
                n.append(s.value).append(";");
            else if (s.type_name === OrganizationReferent.ATTR_TYPE) 
                t.append(s.value).append(";");
        }
        return OrgItemTypeToken._get_kind(t.toString(), n.toString(), obj);
    }
    
    static _get_kind(t, n, r = null) {
        if (!LanguageHelper.ends_with(t, ";")) 
            t += ";";
        if (((((((((((((t.includes("министерство") || t.includes("правительство") || t.includes("администрация")) || t.includes("префектура") || t.includes("мэрия;")) || t.includes("муниципалитет") || LanguageHelper.ends_with(t, "совет;")) || t.includes("дума;") || t.includes("собрание;")) || t.includes("кабинет") || t.includes("сенат;")) || t.includes("палата") || t.includes("рада;")) || t.includes("парламент;") || t.includes("конгресс")) || t.includes("комиссия") || t.includes("полиция;")) || t.includes("милиция;") || t.includes("хурал")) || t.includes("суглан") || t.includes("меджлис;")) || t.includes("хасе;") || t.includes("ил тумэн")) || t.includes("курултай") || t.includes("бундестаг")) || t.includes("бундесрат")) 
            return OrganizationKind.GOVENMENT;
        if ((((((((((((t.includes("міністерство") || t.includes("уряд") || t.includes("адміністрація")) || t.includes("префектура") || t.includes("мерія;")) || t.includes("муніципалітет") || LanguageHelper.ends_with(t, "рада;")) || t.includes("дума;") || t.includes("збори")) || t.includes("кабінет;") || t.includes("сенат;")) || t.includes("палата") || t.includes("рада;")) || t.includes("парламент;") || t.includes("конгрес")) || t.includes("комісія") || t.includes("поліція;")) || t.includes("міліція;") || t.includes("хурал")) || t.includes("суглан") || t.includes("хасе;")) || t.includes("іл тумен") || t.includes("курултай")) || t.includes("меджліс;")) 
            return OrganizationKind.GOVENMENT;
        if (t.includes("комитет") || t.includes("комітет")) {
            if (r !== null && r.higher !== null && r.higher.kind === OrganizationKind.PARTY) 
                return OrganizationKind.DEPARTMENT;
            return OrganizationKind.GOVENMENT;
        }
        if (t.includes("штаб;")) {
            if (r !== null && r.higher !== null && r.higher.kind === OrganizationKind.MILITARY) 
                return OrganizationKind.MILITARY;
            return OrganizationKind.GOVENMENT;
        }
        let tn = t;
        if (!Utils.isNullOrEmpty(n)) 
            tn += n;
        tn = tn.toLowerCase();
        if (((((t.includes("служба;") || t.includes("инспекция;") || t.includes("управление;")) || t.includes("департамент") || t.includes("комитет;")) || t.includes("комиссия;") || t.includes("інспекція;")) || t.includes("керування;") || t.includes("комітет;")) || t.includes("комісія;")) {
            if (tn.includes("федеральн") || tn.includes("государствен") || tn.includes("державн")) 
                return OrganizationKind.GOVENMENT;
            if (r !== null && r.find_slot(OrganizationReferent.ATTR_GEO, null, true) !== null) {
                if (r.higher === null && r.m_temp_parent_org === null) {
                    if (!t.includes("управление;") && !t.includes("департамент") && !t.includes("керування;")) 
                        return OrganizationKind.GOVENMENT;
                }
            }
        }
        if (((((((((((((((((((((((((((((((((t.includes("подразделение") || t.includes("отдел;") || t.includes("отдел ")) || t.includes("направление") || t.includes("отделение")) || t.includes("кафедра") || t.includes("инспекция")) || t.includes("факультет") || t.includes("лаборатория")) || t.includes("пресс центр") || t.includes("пресс служба")) || t.includes("сектор ") || t === "группа;") || ((t.includes("курс;") && !t.includes("конкурс"))) || t.includes("филиал")) || t.includes("главное управление") || t.includes("пограничное управление")) || t.includes("главное территориальное управление") || t.includes("бухгалтерия")) || t.includes("магистратура") || t.includes("аспирантура")) || t.includes("докторантура") || t.includes("дирекция")) || t.includes("руководство") || t.includes("правление")) || t.includes("пленум;") || t.includes("президиум")) || t.includes("стол;") || t.includes("совет директоров")) || t.includes("ученый совет") || t.includes("коллегия")) || t.includes("аппарат") || t.includes("представительство")) || t.includes("жюри;") || t.includes("підрозділ")) || t.includes("відділ;") || t.includes("відділ ")) || t.includes("напрямок") || t.includes("відділення")) || t.includes("інспекція") || t === "група;") || t.includes("лабораторія") || t.includes("прес центр")) || t.includes("прес служба") || t.includes("філія")) || t.includes("головне управління") || t.includes("головне територіальне управління")) || t.includes("бухгалтерія") || t.includes("магістратура")) || t.includes("аспірантура") || t.includes("докторантура")) || t.includes("дирекція") || t.includes("керівництво")) || t.includes("правління") || t.includes("президія")) || t.includes("стіл") || t.includes("рада директорів")) || t.includes("вчена рада") || t.includes("колегія")) || t.includes("апарат") || t.includes("представництво")) || t.includes("журі;") || t.includes("фракция")) || t.includes("депутатская группа") || t.includes("фракція")) || t.includes("депутатська група")) 
            return OrganizationKind.DEPARTMENT;
        if ((t.includes("научн") || t.includes("исследовательск") || t.includes("науков")) || t.includes("дослідн")) 
            return OrganizationKind.SCIENCE;
        if (t.includes("агенство") || t.includes("агентство")) {
            if (tn.includes("федеральн") || tn.includes("державн")) 
                return OrganizationKind.GOVENMENT;
            if (tn.includes("информацион") || tn.includes("інформаційн")) 
                return OrganizationKind.PRESS;
        }
        if (t.includes("холдинг") || t.includes("группа компаний") || t.includes("група компаній")) 
            return OrganizationKind.HOLDING;
        if (t.includes("академия") || t.includes("академія")) {
            if (tn.includes("наук")) 
                return OrganizationKind.SCIENCE;
            return OrganizationKind.STUDY;
        }
        if ((((((((((t.includes("школа;") || t.includes("университет") || tn.includes("учебный ")) || t.includes("лицей") || t.includes("колледж")) || t.includes("детский сад") || t.includes("училище")) || t.includes("гимназия") || t.includes("семинария")) || t.includes("образовательн") || t.includes("интернат")) || t.includes("університет") || tn.includes("навчальний ")) || t.includes("ліцей") || t.includes("коледж")) || t.includes("дитячий садок") || t.includes("училище")) || t.includes("гімназія") || t.includes("семінарія")) || t.includes("освітн") || t.includes("інтернат")) 
            return OrganizationKind.STUDY;
        if (((t.includes("больница") || t.includes("поликлиника") || t.includes("клиника")) || t.includes("госпиталь") || tn.includes("санитарн")) || tn.includes("медико") || tn.includes("медицин")) 
            return OrganizationKind.MEDICAL;
        if ((((((t.includes("церковь") || t.includes("храм;") || t.includes("собор")) || t.includes("синагога") || t.includes("мечеть")) || t.includes("лавра") || t.includes("монастырь")) || t.includes("церква") || t.includes("монастир")) || t.includes("патриархия") || t.includes("епархия")) || t.includes("патріархія") || t.includes("єпархія")) 
            return OrganizationKind.CHURCH;
        if (t.includes("департамент") || t.includes("управление") || t.includes("керування")) {
            if (r !== null) {
                if (r.find_slot(OrganizationReferent.ATTR_HIGHER, null, true) !== null) 
                    return OrganizationKind.DEPARTMENT;
            }
        }
        if ((t.includes("академия") || t.includes("институт") || t.includes("академія")) || t.includes("інститут")) {
            if (n !== null && (((n.includes("НАУК") || n.includes("НАУЧН") || n.includes("НАУКОВ")) || n.includes("ИССЛЕДОВАТ") || n.includes("ДОСЛІДН")))) 
                return OrganizationKind.SCIENCE;
        }
        if (t.includes("аэропорт") || t.includes("аеропорт")) 
            return OrganizationKind.AIRPORT;
        if (t.includes(" порт")) 
            return OrganizationKind.SEAPORT;
        if (((t.includes("фестиваль") || t.includes("чемпионат") || t.includes("олимпиада")) || t.includes("конкурс") || t.includes("чемпіонат")) || t.includes("олімпіада")) 
            return OrganizationKind.FESTIVAL;
        if (((((((((t.includes("армия") || t.includes("генеральный штаб") || t.includes("войсковая часть")) || t.includes("армія") || t.includes("генеральний штаб")) || t.includes("військова частина") || t.includes("дивизия")) || t.includes("полк") || t.includes("батальон")) || t.includes("рота") || t.includes("взвод")) || t.includes("дивізія") || t.includes("батальйон")) || t.includes("гарнизон") || t.includes("гарнізон")) || t.includes("бригада") || t.includes("корпус")) || t.includes("дивизион") || t.includes("дивізіон")) 
            return OrganizationKind.MILITARY;
        if (((t.includes("партия") || t.includes("движение") || t.includes("группировка")) || t.includes("партія") || t.includes("рух;")) || t.includes("групування")) 
            return OrganizationKind.PARTY;
        if (((((((t.includes("газета") || t.includes("издательство") || t.includes("информационное агентство")) || tn.includes("риа;") || t.includes("журнал")) || t.includes("издание") || t.includes("еженедельник")) || t.includes("таблоид") || t.includes("видавництво")) || t.includes("інформаційне агентство") || t.includes("журнал")) || t.includes("видання") || t.includes("тижневик")) || t.includes("таблоїд") || t.includes("портал")) 
            return OrganizationKind.PRESS;
        if (((t.includes("телеканал") || t.includes("телекомпания") || t.includes("радиостанция")) || t.includes("киностудия") || t.includes("телекомпанія")) || t.includes("радіостанція") || t.includes("кіностудія")) 
            return OrganizationKind.MEDIA;
        if (((t.includes("завод;") || t.includes("фабрика") || t.includes("комбинат")) || t.includes("производитель") || t.includes("комбінат")) || t.includes("виробник")) 
            return OrganizationKind.FACTORY;
        if ((((((t.includes("театр;") || t.includes("концертный зал") || t.includes("музей")) || t.includes("консерватория") || t.includes("филармония")) || t.includes("галерея") || t.includes("театр студия")) || t.includes("дом культуры") || t.includes("концертний зал")) || t.includes("консерваторія") || t.includes("філармонія")) || t.includes("театр студія") || t.includes("будинок культури")) 
            return OrganizationKind.CULTURE;
        if (((((((t.includes("федерация") || t.includes("союз") || t.includes("объединение")) || t.includes("фонд;") || t.includes("ассоциация")) || t.includes("клуб") || t.includes("альянс")) || t.includes("ассамблея") || t.includes("федерація")) || t.includes("обєднання") || t.includes("фонд;")) || t.includes("асоціація") || t.includes("асамблея")) || t.includes("гильдия") || t.includes("гільдія")) 
            return OrganizationKind.FEDERATION;
        if ((((((t.includes("пансионат") || t.includes("санаторий") || t.includes("дом отдыха")) || t.includes("база отдыха") || t.includes("гостиница")) || t.includes("отель") || t.includes("лагерь")) || t.includes("пансіонат") || t.includes("санаторій")) || t.includes("будинок відпочинку") || t.includes("база відпочинку")) || t.includes("готель") || t.includes("табір")) 
            return OrganizationKind.HOTEL;
        if ((((((t.includes("суд;") || t.includes("колония") || t.includes("изолятор")) || t.includes("тюрьма") || t.includes("прокуратура")) || t.includes("судебный") || t.includes("трибунал")) || t.includes("колонія") || t.includes("ізолятор")) || t.includes("вязниця") || t.includes("судовий")) || t.includes("трибунал")) 
            return OrganizationKind.JUSTICE;
        if (tn.includes("банк") || tn.includes("казначейство")) 
            return OrganizationKind.BANK;
        if (tn.includes("торгов") || tn.includes("магазин") || tn.includes("маркет;")) 
            return OrganizationKind.TRADE;
        if (t.includes("УЗ;")) 
            return OrganizationKind.MEDICAL;
        if (t.includes("центр;")) {
            if ((tn.includes("диагностический") || tn.includes("медицинский") || tn.includes("діагностичний")) || tn.includes("медичний")) 
                return OrganizationKind.MEDICAL;
            if ((r instanceof OrganizationReferent) && (r).higher !== null) {
                if ((r).higher.kind === OrganizationKind.DEPARTMENT) 
                    return OrganizationKind.DEPARTMENT;
            }
        }
        if (t.includes("часть;") || t.includes("частина;")) 
            return OrganizationKind.DEPARTMENT;
        if (r !== null) {
            if (r.contains_profile(OrgProfile.POLICY)) 
                return OrganizationKind.PARTY;
            if (r.contains_profile(OrgProfile.MEDIA)) 
                return OrganizationKind.MEDIA;
        }
        return OrganizationKind.UNDEFINED;
    }
    
    static _new2312(_arg1, _arg2, _arg3) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.m_coef = _arg3;
        return res;
    }
    
    static _new2313(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.coef = _arg4;
        res.is_dep = _arg5;
        return res;
    }
    
    static _new2314(_arg1, _arg2, _arg3) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new2317(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.root = _arg4;
        res.is_not_typ = _arg5;
        return res;
    }
    
    static _new2321(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.root = _arg4;
        return res;
    }
    
    static _new2325(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.name = _arg4;
        res.coef = _arg5;
        res.root = _arg6;
        return res;
    }
    
    static _new2326(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.alt_typ = _arg4;
        res.root = _arg5;
        res.can_be_organization = _arg6;
        return res;
    }
    
    static _new2327(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.coef = _arg3;
        res.is_not_typ = _arg4;
        res.typ = _arg5;
        return res;
    }
    
    static _new2329(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.root = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new2331(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.name_is_name = _arg4;
        res.root = _arg5;
        res.name = _arg6;
        return res;
    }
    
    static _new2333(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemTypeToken(_arg1, _arg2);
        res.name = _arg3;
        res.morph = _arg4;
        res.chars = _arg5;
        res.chars_root = _arg6;
        return res;
    }
    
    static static_constructor() {
        OrgItemTypeToken.m_global = null;
        OrgItemTypeToken.m_bank = null;
        OrgItemTypeToken.m_mo = null;
        OrgItemTypeToken.m_ispr_kolon = null;
        OrgItemTypeToken.m_sber_bank = null;
        OrgItemTypeToken.m_sec_serv = null;
        OrgItemTypeToken.m_akcion_comp = null;
        OrgItemTypeToken.m_sovm_pred = null;
        OrgItemTypeToken.m_pref_words = null;
        OrgItemTypeToken.m_key_words_for_refs = null;
        OrgItemTypeToken.m_markers = null;
        OrgItemTypeToken.m_std_adjs = null;
        OrgItemTypeToken.m_std_adjsua = null;
        OrgItemTypeToken.M_EMPTY_TYP_WORDS = ["КРУПНЫЙ", "КРУПНЕЙШИЙ", "ИЗВЕСТНЫЙ", "ИЗВЕСТНЕЙШИЙ", "МАЛОИЗВЕСТНЫЙ", "ЗАРУБЕЖНЫЙ", "ВЛИЯТЕЛЬНЫЙ", "ВЛИЯТЕЛЬНЕЙШИЙ", "ЗНАМЕНИТЫЙ", "НАЙБІЛЬШИЙ", "ВІДОМИЙ", "ВІДОМИЙ", "МАЛОВІДОМИЙ", "ЗАКОРДОННИЙ"];
        OrgItemTypeToken.m_decree_key_words = ["УКАЗ", "УКАЗАНИЕ", "ПОСТАНОВЛЕНИЕ", "РАСПОРЯЖЕНИЕ", "ПРИКАЗ", "ДИРЕКТИВА", "ПИСЬМО", "ЗАКОН", "КОДЕКС", "КОНСТИТУЦИЯ", "РЕШЕНИЕ", "ПОЛОЖЕНИЕ", "РАСПОРЯЖЕНИЕ", "ПОРУЧЕНИЕ", "ДОГОВОР", "СУБДОГОВОР", "АГЕНТСКИЙ ДОГОВОР", "ОПРЕДЕЛЕНИЕ", "СОГЛАШЕНИЕ", "ПРОТОКОЛ", "УСТАВ", "ХАРТИЯ", "РЕГЛАМЕНТ", "КОНВЕНЦИЯ", "ПАКТ", "БИЛЛЬ", "ДЕКЛАРАЦИЯ", "ТЕЛЕФОНОГРАММА", "ТЕЛЕФАКСОГРАММА", "ФАКСОГРАММА", "ПРАВИЛО", "ПРОГРАММА", "ПЕРЕЧЕНЬ", "ПОСОБИЕ", "РЕКОМЕНДАЦИЯ", "НАСТАВЛЕНИЕ", "СТАНДАРТ", "СОГЛАШЕНИЕ", "МЕТОДИКА", "ТРЕБОВАНИЕ", "УКАЗ", "ВКАЗІВКА", "ПОСТАНОВА", "РОЗПОРЯДЖЕННЯ", "НАКАЗ", "ДИРЕКТИВА", "ЛИСТ", "ЗАКОН", "КОДЕКС", "КОНСТИТУЦІЯ", "РІШЕННЯ", "ПОЛОЖЕННЯ", "РОЗПОРЯДЖЕННЯ", "ДОРУЧЕННЯ", "ДОГОВІР", "СУБКОНТРАКТ", "АГЕНТСЬКИЙ ДОГОВІР", "ВИЗНАЧЕННЯ", "УГОДА", "ПРОТОКОЛ", "СТАТУТ", "ХАРТІЯ", "РЕГЛАМЕНТ", "КОНВЕНЦІЯ", "ПАКТ", "БІЛЛЬ", "ДЕКЛАРАЦІЯ", "ТЕЛЕФОНОГРАМА", "ТЕЛЕФАКСОГРАММА", "ФАКСОГРАМА", "ПРАВИЛО", "ПРОГРАМА", "ПЕРЕЛІК", "ДОПОМОГА", "РЕКОМЕНДАЦІЯ", "ПОВЧАННЯ", "СТАНДАРТ", "УГОДА", "МЕТОДИКА", "ВИМОГА"];
        OrgItemTypeToken.m_pressru = null;
        OrgItemTypeToken.m_pressua = null;
        OrgItemTypeToken.m_pressia = null;
        OrgItemTypeToken.m_military_unit = null;
    }
}


OrgItemTypeToken.static_constructor();

module.exports = OrgItemTypeToken