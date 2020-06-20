/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const Stream = require("./../../../unisharp/Stream");
const MemoryStream = require("./../../../unisharp/MemoryStream");

const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const MorphSerializeHelper = require("./../../../morph/internal/MorphSerializeHelper");
const MorphLang = require("./../../../morph/MorphLang");
const MorphGender = require("./../../../morph/MorphGender");
const Termin = require("./../../core/Termin");
const MorphNumber = require("./../../../morph/MorphNumber");
const TerminCollection = require("./../../core/TerminCollection");
const MetaToken = require("./../../MetaToken");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const GeoReferent = require("./../GeoReferent");
const StreetReferent = require("./../../address/StreetReferent");
const TextToken = require("./../../TextToken");
const ReferentToken = require("./../../ReferentToken");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const CityItemTokenItemType = require("./CityItemTokenItemType");
const AddressReferent = require("./../../address/AddressReferent");

class MiscLocationHelper {
    
    static check_geo_object_before(t) {
        const CityItemToken = require("./CityItemToken");
        if (t === null) 
            return false;
        for (let tt = t.previous; tt !== null; tt = tt.previous) {
            if ((tt.is_char_of(",.;:") || tt.is_hiphen || tt.is_and) || tt.morph.class0.is_conjunction || tt.morph.class0.is_preposition) 
                continue;
            if (tt.is_value("ТЕРРИТОРИЯ", "ТЕРИТОРІЯ")) 
                continue;
            if ((tt.is_value("ПРОЖИВАТЬ", "ПРОЖИВАТИ") || tt.is_value("РОДИТЬ", "НАРОДИТИ") || tt.is_value("ЗАРЕГИСТРИРОВАТЬ", "ЗАРЕЄСТРУВАТИ")) || tt.is_value("АДРЕС", null)) 
                return true;
            if (tt.is_value("УРОЖЕНЕЦ", "УРОДЖЕНЕЦЬ") || tt.is_value("УРОЖЕНКА", "УРОДЖЕНКА")) 
                return true;
            if (tt.length_char === 2 && (tt instanceof TextToken) && tt.chars.is_all_upper) {
                let term = (tt).term;
                if (!Utils.isNullOrEmpty(term) && term[0] === 'Р') 
                    return true;
            }
            let rt = Utils.as(tt, ReferentToken);
            if (rt === null) 
                break;
            if ((rt.referent instanceof GeoReferent) || (rt.referent instanceof AddressReferent) || (rt.referent instanceof StreetReferent)) 
                return true;
            break;
        }
        if (t.previous !== null && t.previous.previous !== null) {
            let cit2 = CityItemToken.try_parse(t.previous, null, false, null);
            if (cit2 !== null && cit2.typ !== CityItemTokenItemType.NOUN && cit2.end_token.next === t) {
                let cit1 = CityItemToken.try_parse(t.previous.previous, null, false, null);
                if (cit1 !== null && cit1.typ === CityItemTokenItemType.NOUN) 
                    return true;
                if (cit1 === null && t.previous.previous.is_char('.') && t.previous.previous.previous !== null) {
                    let tt = t.previous.previous.previous;
                    cit1 = CityItemToken.try_parse(tt, null, false, null);
                    if (cit1 !== null && cit1.typ === CityItemTokenItemType.NOUN) 
                        return true;
                    if (tt.is_value("С", null) || tt.is_value("Д", null) || tt.is_value("ПОС", null)) 
                        return true;
                }
            }
        }
        return false;
    }
    
    static check_geo_object_after(t, dont_check_city = false) {
        const CityItemToken = require("./CityItemToken");
        if (t === null) 
            return false;
        let cou = 0;
        for (let tt = t.next; tt !== null; tt = tt.next) {
            if (tt.is_char_of(",.;") || tt.is_hiphen || tt.morph.class0.is_conjunction) 
                continue;
            if (tt.morph.class0.is_preposition) {
                if (!dont_check_city && tt.is_value("С", null) && tt.next !== null) {
                    let ttt = tt.next;
                    if (ttt.is_char('.') && (ttt.next.whitespaces_after_count < 3)) 
                        ttt = ttt.next;
                    let cits = CityItemToken.try_parse_list(ttt, null, 3);
                    if (cits !== null && cits.length === 1 && ((cits[0].typ === CityItemTokenItemType.PROPERNAME || cits[0].typ === CityItemTokenItemType.CITY))) {
                        if (tt.chars.is_all_upper && !cits[0].chars.is_all_upper) {
                        }
                        else 
                            return true;
                    }
                }
                continue;
            }
            if (tt.is_value("ТЕРРИТОРИЯ", "ТЕРИТОРІЯ")) 
                continue;
            let rt = Utils.as(tt, ReferentToken);
            if (rt === null) {
                if (!dont_check_city) {
                    let cits = CityItemToken.try_parse_list(tt, null, 3);
                    if ((cits !== null && cits.length === 2 && cits[0].typ === CityItemTokenItemType.NOUN) && ((cits[1].typ === CityItemTokenItemType.PROPERNAME || cits[1].typ === CityItemTokenItemType.CITY))) {
                        if (cits[0].chars.is_all_upper && !cits[1].chars.is_all_upper) {
                        }
                        else 
                            return true;
                    }
                }
                if ((tt instanceof TextToken) && tt.length_char > 2 && cou === 0) {
                    cou++;
                    continue;
                }
                else 
                    break;
            }
            if ((rt.referent instanceof GeoReferent) || (rt.referent instanceof AddressReferent) || (rt.referent instanceof StreetReferent)) 
                return true;
            break;
        }
        return false;
    }
    
    static check_near_before(t) {
        if (t === null || !t.morph.class0.is_preposition) 
            return null;
        if (t.is_value("У", null) || t.is_value("ОКОЛО", null) || t.is_value("ВБЛИЗИ", null)) 
            return t;
        if (t.is_value("ОТ", null) && t.previous !== null) {
            if (t.previous.is_value("НЕДАЛЕКО", null) || t.previous.is_value("ВБЛИЗИ", null) || t.previous.is_value("НЕПОДАЛЕКУ", null)) 
                return t.previous;
        }
        return null;
    }
    
    /**
     * Проверка, что здесь какой-то непонятный регион типа "Европа", "Средняя Азия", "Дикий запад" и т.п.
     * @param t 
     * @return 
     */
    static check_unknown_region(t) {
        const TerrItemToken = require("./TerrItemToken");
        if (!((t instanceof TextToken))) 
            return null;
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
        if (npt === null) 
            return null;
        if (TerrItemToken.m_unknown_regions.try_parse(npt.end_token, TerminParseAttr.FULLWORDSONLY) !== null) 
            return npt.end_token;
        return null;
    }
    
    static get_std_adj_full(t, gen, num, strict) {
        if (!((t instanceof TextToken))) 
            return null;
        return MiscLocationHelper.get_std_adj_full_str((t).term, gen, num, strict);
    }
    
    static get_std_adj_full_str(v, gen, num, strict) {
        let res = new Array();
        if (v.startsWith("Б")) {
            if (num === MorphNumber.PLURAL) {
                res.push("БОЛЬШИЕ");
                return res;
            }
            if (!strict && (((num.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                res.push("БОЛЬШИЕ");
            if ((((gen.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.FEMINIE) 
                    res.push("БОЛЬШАЯ");
            }
            if ((((gen.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.MASCULINE) 
                    res.push("БОЛЬШОЙ");
            }
            if ((((gen.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.NEUTER) 
                    res.push("БОЛЬШОЕ");
            }
            if (res.length > 0) 
                return res;
            return null;
        }
        if (v.startsWith("М")) {
            if (num === MorphNumber.PLURAL) {
                res.push("МАЛЫЕ");
                return res;
            }
            if (!strict && (((num.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                res.push("МАЛЫЕ");
            if ((((gen.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.FEMINIE) 
                    res.push("МАЛАЯ");
            }
            if ((((gen.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.MASCULINE) 
                    res.push("МАЛЫЙ");
            }
            if ((((gen.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.NEUTER) 
                    res.push("МАЛОЕ");
            }
            if (res.length > 0) 
                return res;
            return null;
        }
        if (v.startsWith("В")) {
            if (num === MorphNumber.PLURAL) {
                res.push("ВЕРХНИЕ");
                return res;
            }
            if (!strict && (((num.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                res.push("ВЕРХНИЕ");
            if ((((gen.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.FEMINIE) 
                    res.push("ВЕРХНЯЯ");
            }
            if ((((gen.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.MASCULINE) 
                    res.push("ВЕРХНИЙ");
            }
            if ((((gen.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.NEUTER) 
                    res.push("ВЕРХНЕЕ");
            }
            if (res.length > 0) 
                return res;
            return null;
        }
        if (v === "Н") {
            let r1 = MiscLocationHelper.get_std_adj_full_str("НОВ", gen, num, strict);
            let r2 = MiscLocationHelper.get_std_adj_full_str("НИЖ", gen, num, strict);
            if (r1 === null && r2 === null) 
                return null;
            if (r1 === null) 
                return r2;
            if (r2 === null) 
                return r1;
            r1.splice(1, 0, r2[0]);
            r2.splice(0, 1);
            r1.splice(r1.length, 0, ...r2);
            return r1;
        }
        if (v === "С" || v === "C") {
            let r1 = MiscLocationHelper.get_std_adj_full_str("СТ", gen, num, strict);
            let r2 = MiscLocationHelper.get_std_adj_full_str("СР", gen, num, strict);
            if (r1 === null && r2 === null) 
                return null;
            if (r1 === null) 
                return r2;
            if (r2 === null) 
                return r1;
            r1.splice(1, 0, r2[0]);
            r2.splice(0, 1);
            r1.splice(r1.length, 0, ...r2);
            return r1;
        }
        if (v.startsWith("НОВ")) {
            if (num === MorphNumber.PLURAL) {
                res.push("НОВЫЕ");
                return res;
            }
            if (!strict && (((num.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                res.push("НОВЫЕ");
            if ((((gen.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.FEMINIE) 
                    res.push("НОВАЯ");
            }
            if ((((gen.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.MASCULINE) 
                    res.push("НОВЫЙ");
            }
            if ((((gen.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.NEUTER) 
                    res.push("НОВОЕ");
            }
            if (res.length > 0) 
                return res;
            return null;
        }
        if (v.startsWith("НИЖ")) {
            if (num === MorphNumber.PLURAL) {
                res.push("НИЖНИЕ");
                return res;
            }
            if (!strict && (((num.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                res.push("НИЖНИЕ");
            if ((((gen.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.FEMINIE) 
                    res.push("НИЖНЯЯ");
            }
            if ((((gen.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.MASCULINE) 
                    res.push("НИЖНИЙ");
            }
            if ((((gen.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.NEUTER) 
                    res.push("НИЖНЕЕ");
            }
            if (res.length > 0) 
                return res;
            return null;
        }
        if (v.startsWith("СТ")) {
            if (num === MorphNumber.PLURAL) {
                res.push("СТАРЫЕ");
                return res;
            }
            if (!strict && (((num.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                res.push("СТАРЫЕ");
            if ((((gen.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.FEMINIE) 
                    res.push("СТАРАЯ");
            }
            if ((((gen.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.MASCULINE) 
                    res.push("СТАРЫЙ");
            }
            if ((((gen.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.NEUTER) 
                    res.push("СТАРОЕ");
            }
            if (res.length > 0) 
                return res;
            return null;
        }
        if (v.startsWith("СР")) {
            if (num === MorphNumber.PLURAL) {
                res.push("СРЕДНИЕ");
                return res;
            }
            if (!strict && (((num.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                res.push("СРЕДНИЕ");
            if ((((gen.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.FEMINIE) 
                    res.push("СРЕДНЯЯ");
            }
            if ((((gen.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.MASCULINE) 
                    res.push("СРЕДНИЙ");
            }
            if ((((gen.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value())) {
                if (!strict || gen === MorphGender.NEUTER) 
                    res.push("СРЕДНЕЕ");
            }
            if (res.length > 0) 
                return res;
            return null;
        }
        return null;
    }
    
    /**
     * Прлучить глобальный экземпляр существующего объекта по ALPHA2 или краткой текстовой форме (РФ, РОССИЯ, КИТАЙ ...)
     * @param name 
     * @return 
     */
    static get_geo_referent_by_name(name) {
        const TerrItemToken = require("./TerrItemToken");
        let res = null;
        let wrapres1166 = new RefOutArgWrapper();
        let inoutres1167 = MiscLocationHelper.m_geo_ref_by_name.tryGetValue(name, wrapres1166);
        res = wrapres1166.value;
        if (inoutres1167) 
            return res;
        for (const r of TerrItemToken.m_all_states) {
            if (r.find_slot(null, name, true) !== null) {
                res = Utils.as(r, GeoReferent);
                break;
            }
        }
        MiscLocationHelper.m_geo_ref_by_name.put(name, res);
        return res;
    }
    
    /**
     * Выделение существительных и прилагательных типа "северо-западное", "южное"
     * @param t 
     * @return 
     */
    static try_attach_nord_west(t) {
        if (!((t instanceof TextToken))) 
            return null;
        let tok = MiscLocationHelper.m_nords.try_parse(t, TerminParseAttr.NO);
        if (tok === null) 
            return null;
        let res = MetaToken._new581(t, t, t.morph);
        let t1 = null;
        if ((t.next !== null && t.next.is_hiphen && !t.is_whitespace_after) && !t.is_whitespace_after) 
            t1 = t.next.next;
        else if (t.morph.class0.is_adjective && (t.whitespaces_after_count < 2)) 
            t1 = t.next;
        if (t1 !== null) {
            if ((((tok = MiscLocationHelper.m_nords.try_parse(t1, TerminParseAttr.NO)))) !== null) {
                res.end_token = tok.end_token;
                res.morph = tok.morph;
            }
        }
        return res;
    }
    
    static initialize() {
        if (MiscLocationHelper.m_nords !== null) 
            return;
        MiscLocationHelper.m_nords = new TerminCollection();
        for (const s of ["СЕВЕРНЫЙ", "ЮЖНЫЙ", "ЗАПАДНЫЙ", "ВОСТОЧНЫЙ", "ЦЕНТРАЛЬНЫЙ", "БЛИЖНИЙ", "ДАЛЬНИЙ", "СРЕДНИЙ", "СЕВЕР", "ЮГ", "ЗАПАД", "ВОСТОК", "СЕВЕРО", "ЮГО", "ЗАПАДНО", "ВОСТОЧНО", "СЕВЕРОЗАПАДНЫЙ", "СЕВЕРОВОСТОЧНЫЙ", "ЮГОЗАПАДНЫЙ", "ЮГОВОСТОЧНЫЙ"]) {
            MiscLocationHelper.m_nords.add(new Termin(s, MorphLang.RU, true));
        }
        let table = "\nAF\tAFG\nAX\tALA\nAL\tALB\nDZ\tDZA\nAS\tASM\nAD\tAND\nAO\tAGO\nAI\tAIA\nAQ\tATA\nAG\tATG\nAR\tARG\nAM\tARM\nAW\tABW\nAU\tAUS\nAT\tAUT\nAZ\tAZE\nBS\tBHS\nBH\tBHR\nBD\tBGD\nBB\tBRB\nBY\tBLR\nBE\tBEL\nBZ\tBLZ\nBJ\tBEN\nBM\tBMU\nBT\tBTN\nBO\tBOL\nBA\tBIH\nBW\tBWA\nBV\tBVT\nBR\tBRA\nVG\tVGB\nIO\tIOT\nBN\tBRN\nBG\tBGR\nBF\tBFA\nBI\tBDI\nKH\tKHM\nCM\tCMR\nCA\tCAN\nCV\tCPV\nKY\tCYM\nCF\tCAF\nTD\tTCD\nCL\tCHL\nCN\tCHN\nHK\tHKG\nMO\tMAC\nCX\tCXR\nCC\tCCK\nCO\tCOL\nKM\tCOM\nCG\tCOG\nCD\tCOD\nCK\tCOK\nCR\tCRI\nCI\tCIV\nHR\tHRV\nCU\tCUB\nCY\tCYP\nCZ\tCZE\nDK\tDNK\nDJ\tDJI\nDM\tDMA\nDO\tDOM\nEC\tECU\nEG\tEGY\nSV\tSLV\nGQ\tGNQ\nER\tERI\nEE\tEST\nET\tETH\nFK\tFLK\nFO\tFRO\nFJ\tFJI\nFI\tFIN\nFR\tFRA\nGF\tGUF\nPF\tPYF\nTF\tATF\nGA\tGAB\nGM\tGMB\nGE\tGEO\nDE\tDEU\nGH\tGHA\nGI\tGIB\nGR\tGRC\nGL\tGRL\nGD\tGRD\nGP\tGLP\nGU\tGUM\nGT\tGTM\nGG\tGGY\nGN\tGIN\nGW\tGNB\nGY\tGUY\nHT\tHTI\nHM\tHMD\nVA\tVAT\nHN\tHND\nHU\tHUN\nIS\tISL\nIN\tIND\nID\tIDN\nIR\tIRN\nIQ\tIRQ\nIE\tIRL\nIM\tIMN\nIL\tISR\nIT\tITA\nJM\tJAM\nJP\tJPN\nJE\tJEY\nJO\tJOR\nKZ\tKAZ\nKE\tKEN\nKI\tKIR\nKP\tPRK\nKR\tKOR\nKW\tKWT\nKG\tKGZ\nLA\tLAO\nLV\tLVA\nLB\tLBN\nLS\tLSO\nLR\tLBR\nLY\tLBY\nLI\tLIE\nLT\tLTU\nLU\tLUX\nMK\tMKD\nMG\tMDG\nMW\tMWI\nMY\tMYS\nMV\tMDV\nML\tMLI\nMT\tMLT\nMH\tMHL\nMQ\tMTQ\nMR\tMRT\nMU\tMUS\nYT\tMYT\nMX\tMEX\nFM\tFSM\nMD\tMDA\nMC\tMCO\nMN\tMNG\nME\tMNE\nMS\tMSR\nMA\tMAR\nMZ\tMOZ\nMM\tMMR\nNA\tNAM\nNR\tNRU\nNP\tNPL\nNL\tNLD\nAN\tANT\nNC\tNCL\nNZ\tNZL\nNI\tNIC\nNE\tNER\nNG\tNGA\nNU\tNIU\nNF\tNFK\nMP\tMNP\nNO\tNOR\nOM\tOMN\nPK\tPAK\nPW\tPLW\nPS\tPSE\nPA\tPAN\nPG\tPNG\nPY\tPRY\nPE\tPER\nPH\tPHL\nPN\tPCN\nPL\tPOL\nPT\tPRT\nPR\tPRI\nQA\tQAT\nRE\tREU\nRO\tROU\nRU\tRUS\nRW\tRWA\nBL\tBLM\nSH\tSHN\nKN\tKNA\nLC\tLCA\nMF\tMAF\nPM\tSPM\nVC\tVCT\nWS\tWSM\nSM\tSMR\nST\tSTP\nSA\tSAU\nSN\tSEN\nRS\tSRB\nSC\tSYC\nSL\tSLE\nSG\tSGP\nSK\tSVK\nSI\tSVN\nSB\tSLB\nSO\tSOM\nZA\tZAF\nGS\tSGS\nSS\tSSD\nES\tESP\nLK\tLKA\nSD\tSDN\nSR\tSUR\nSJ\tSJM\nSZ\tSWZ\nSE\tSWE\nCH\tCHE\nSY\tSYR\nTW\tTWN\nTJ\tTJK\nTZ\tTZA\nTH\tTHA\nTL\tTLS\nTG\tTGO\nTK\tTKL\nTO\tTON\nTT\tTTO\nTN\tTUN\nTR\tTUR\nTM\tTKM\nTC\tTCA\nTV\tTUV\nUG\tUGA\nUA\tUKR\nAE\tARE\nGB\tGBR\nUS\tUSA\nUM\tUMI\nUY\tURY\nUZ\tUZB\nVU\tVUT\nVE\tVEN\nVN\tVNM\nVI\tVIR\nWF\tWLF\nEH\tESH\nYE\tYEM\nZM\tZMB\nZW\tZWE ";
        for (const s of Utils.splitString(table, '\n', false)) {
            let ss = s.trim();
            if ((ss.length < 6) || !Utils.isWhitespace(ss[2])) 
                continue;
            let cod2 = ss.substring(0, 0 + 2);
            let cod3 = ss.substring(3).trim();
            if (cod3.length !== 3) 
                continue;
            if (!MiscLocationHelper.m_alpha2_3.containsKey(cod2)) 
                MiscLocationHelper.m_alpha2_3.put(cod2, cod3);
            if (!MiscLocationHelper.m_alpha3_2.containsKey(cod3)) 
                MiscLocationHelper.m_alpha3_2.put(cod3, cod2);
        }
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
    
    static static_constructor() {
        MiscLocationHelper.m_geo_ref_by_name = new Hashtable();
        MiscLocationHelper.m_nords = null;
        MiscLocationHelper.m_alpha2_3 = new Hashtable();
        MiscLocationHelper.m_alpha3_2 = new Hashtable();
    }
}


MiscLocationHelper.static_constructor();

module.exports = MiscLocationHelper