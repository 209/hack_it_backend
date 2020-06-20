/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const MetaDecreeChangeValue = require("./internal/MetaDecreeChangeValue");
const MetaDecreeChange = require("./internal/MetaDecreeChange");
const ReferentEqualType = require("./../ReferentEqualType");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const MetaDecreePart = require("./internal/MetaDecreePart");
const DateRangeReferent = require("./../date/DateRangeReferent");
const LanguageHelper = require("./../../morph/LanguageHelper");
const GeoReferent = require("./../geo/GeoReferent");
const MetaDecree = require("./internal/MetaDecree");
const DateReferent = require("./../date/DateReferent");
const DecreeChangeTokenTyp = require("./internal/DecreeChangeTokenTyp");
const DecreeChangeKind = require("./DecreeChangeKind");
const BracketHelper = require("./../core/BracketHelper");
const DecreeChangeReferent = require("./DecreeChangeReferent");
const TerminParseAttr = require("./../core/TerminParseAttr");
const Referent = require("./../Referent");
const Token = require("./../Token");
const DecreeChangeValueReferent = require("./DecreeChangeValueReferent");
const Termin = require("./../core/Termin");
const TerminCollection = require("./../core/TerminCollection");
const Analyzer = require("./../Analyzer");
const OrganizationReferent = require("./../org/OrganizationReferent");
const TextToken = require("./../TextToken");
const DecreePartReferent = require("./DecreePartReferent");
const NumberToken = require("./../NumberToken");
const ReferentToken = require("./../ReferentToken");
const MiscHelper = require("./../core/MiscHelper");
const PartTokenItemType = require("./internal/PartTokenItemType");
const MorphGender = require("./../../morph/MorphGender");
const PersonPropertyReferent = require("./../person/PersonPropertyReferent");
const ProcessorService = require("./../ProcessorService");
const DecreeReferent = require("./DecreeReferent");
const BracketParseAttr = require("./../core/BracketParseAttr");
const DecreeTokenItemType = require("./internal/DecreeTokenItemType");
const NounPhraseParseAttr = require("./../core/NounPhraseParseAttr");
const MorphClass = require("./../../morph/MorphClass");
const NounPhraseHelper = require("./../core/NounPhraseHelper");
const DecreeKind = require("./DecreeKind");
const Slot = require("./../Slot");
const GetTextAttr = require("./../core/GetTextAttr");
const PersonReferent = require("./../person/PersonReferent");
const MetaToken = require("./../MetaToken");

class DecreeAnalyzer extends Analyzer {
    
    static try_attach_parts(parts, base_typ, _def_owner) {
        const DecreeToken = require("./internal/DecreeToken");
        const InstrToken = require("./../instrument/internal/InstrToken");
        const PartToken = require("./internal/PartToken");
        const InstrToken1 = require("./../instrument/internal/InstrToken1");
        if (parts === null || parts.length === 0) 
            return null;
        let i = 0;
        let j = 0;
        let tt = parts[parts.length - 1].end_token.next;
        if (_def_owner !== null && tt !== null) {
            if (BracketHelper.is_bracket(tt, false)) {
                let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                if (br !== null && br.end_token.next !== null) 
                    tt = br.end_token.next;
            }
            if (tt.get_referent() instanceof DecreeReferent) 
                _def_owner = null;
            else if (tt.is_value("К", null) && tt.next !== null && (tt.next.get_referent() instanceof DecreeReferent)) 
                _def_owner = null;
        }
        if ((parts.length === 1 && parts[0].is_newline_before && parts[0].begin_token.chars.is_letter) && !parts[0].begin_token.chars.is_all_lower) {
            let t1 = parts[0].end_token.next;
            let br = BracketHelper.try_parse(t1, BracketParseAttr.NO, 100);
            if (br !== null) 
                t1 = br.end_token.next;
            if (t1 !== null && (t1.get_referent() instanceof DecreeReferent) && !parts[0].is_newline_after) {
            }
            else {
                let li = InstrToken1.parse(parts[0].begin_token, true, null, 0, null, false, 0, false, false);
                if (li !== null && li.has_verb) {
                    if ((parts.length === 1 && parts[0].typ === PartTokenItemType.PART && parts[0].toString().includes("резолют")) && parts[0].is_newline_before) 
                        return null;
                }
                else 
                    return null;
            }
        }
        let this_dec = null;
        let is_program = false;
        let is_add_agree = false;
        if (parts[parts.length - 1].typ !== PartTokenItemType.SUBPROGRAM && parts[parts.length - 1].typ !== PartTokenItemType.ADDAGREE) {
            this_dec = DecreeAnalyzer.ThisDecree.try_attach(parts[parts.length - 1], base_typ);
            if (this_dec !== null) {
                if ((_def_owner instanceof DecreeReferent) && (((_def_owner).typ0 === this_dec.typ || parts[0].typ === PartTokenItemType.APPENDIX))) {
                }
                else 
                    _def_owner = null;
            }
            if (this_dec === null && _def_owner === null) 
                this_dec = DecreeAnalyzer.ThisDecree.try_attach_back(parts[0].begin_token, base_typ);
            if (this_dec === null) {
                for (const p of parts) {
                    if (p.typ === PartTokenItemType.PART) {
                        let has_clause = false;
                        for (const pp of parts) {
                            if (pp !== p) {
                                if (PartToken._get_rank(pp.typ) >= PartToken._get_rank(PartTokenItemType.CLAUSE)) 
                                    has_clause = true;
                            }
                        }
                        if (_def_owner instanceof DecreePartReferent) {
                            if ((_def_owner).clause !== null) 
                                has_clause = true;
                        }
                        if (!has_clause) 
                            p.typ = PartTokenItemType.DOCPART;
                        else if ((((p === parts[parts.length - 1] && p.end_token.next !== null && p.values.length === 1) && (p.end_token.next.get_referent() instanceof DecreeReferent) && (p.begin_token instanceof TextToken)) && (p.begin_token).term === "ЧАСТИ" && (p.end_token instanceof NumberToken)) && p.begin_token.next === p.end_token) 
                            p.typ = PartTokenItemType.DOCPART;
                    }
                }
            }
        }
        else if (parts[parts.length - 1].typ === PartTokenItemType.ADDAGREE) 
            is_add_agree = true;
        else {
            if (parts.length > 1) 
                parts.splice(0, parts.length - 1);
            is_program = true;
        }
        let def_owner = Utils.as(_def_owner, DecreeReferent);
        if (_def_owner instanceof DecreePartReferent) 
            def_owner = (_def_owner).owner;
        let res = new Array();
        let has_prefix = false;
        if (parts[0].typ === PartTokenItemType.PREFIX) {
            parts.splice(0, 1);
            has_prefix = true;
            if (parts.length === 0) 
                return null;
        }
        if ((parts.length === 1 && this_dec === null && parts[0].typ !== PartTokenItemType.SUBPROGRAM) && parts[0].typ !== PartTokenItemType.ADDAGREE) {
            if (parts[0].is_doubt) 
                return null;
            if (parts[0].is_newline_before && parts[0].values.length <= 1) {
                let tt1 = parts[0].end_token;
                if (tt1.next === null) 
                    return null;
                tt1 = tt1.next;
                if (BracketHelper.can_be_start_of_sequence(tt1, false, false)) {
                    let br = BracketHelper.try_parse(tt1, BracketParseAttr.NO, 100);
                    if (br !== null && br.end_token.next !== null) 
                        tt1 = br.end_token.next;
                }
                if (tt1.is_char(',')) {
                }
                else if (tt1.get_referent() instanceof DecreeReferent) {
                }
                else if (tt1.is_value("К", null) && tt1.next !== null && (tt1.next.get_referent() instanceof DecreeReferent)) {
                }
                else if (DecreeAnalyzer._check_other_typ(tt1, true) !== null) {
                }
                else if (_def_owner === null) 
                    return null;
                else if (MiscHelper.can_be_start_of_sentence(tt1)) 
                    return null;
                else if (tt1.is_char('.')) 
                    return null;
            }
        }
        let asc = new Array();
        let desc = new Array();
        let typs = new Array();
        let asc_count = 0;
        let desc_count = 0;
        let terminators = 0;
        for (i = 0; i < (parts.length - 1); i++) {
            if (!parts[i].has_terminator) {
                if (parts[i].can_be_next_narrow(parts[i + 1])) 
                    asc_count++;
                if (parts[i + 1].can_be_next_narrow(parts[i])) 
                    desc_count++;
            }
            else if ((asc_count > 0 && parts[i].values.length === 1 && parts[i + 1].values.length === 1) && parts[i].can_be_next_narrow(parts[i + 1])) 
                asc_count++;
            else if ((desc_count > 0 && parts[i].values.length === 1 && parts[i + 1].values.length === 1) && parts[i + 1].can_be_next_narrow(parts[i])) 
                desc_count++;
            else 
                terminators++;
        }
        if (terminators === 0 && ((((desc_count > 0 && asc_count === 0)) || ((desc_count === 0 && asc_count > 0))))) {
            for (i = 0; i < (parts.length - 1); i++) {
                parts[i].has_terminator = false;
            }
        }
        for (i = 0; i < parts.length; i++) {
            if (parts[i].typ === PartTokenItemType.PREFIX) 
                continue;
            asc.splice(0, asc.length);
            asc.push(parts[i]);
            typs.splice(0, typs.length);
            typs.push(parts[i].typ);
            for (j = i + 1; j < parts.length; j++) {
                if (parts[j].values.length === 0 && parts[j].typ !== PartTokenItemType.PREAMBLE) 
                    break;
                else if (!typs.includes(parts[j].typ) && parts[j - 1].can_be_next_narrow(parts[j])) {
                    if (parts[j - 1].delim_after && terminators === 0) {
                        if (desc_count > asc_count) 
                            break;
                        if (((j + 1) < parts.length) && !parts[j].delim_after && !parts[j].has_terminator) 
                            break;
                        if (parts[j - 1].typ === PartTokenItemType.ITEM && parts[j].typ === PartTokenItemType.SUBITEM) {
                            if (parts[j].values.length > 0 && parts[j].values[0].toString().includes(".")) 
                                break;
                        }
                    }
                    asc.push(parts[j]);
                    typs.push(parts[j].typ);
                    if (parts[j].has_terminator) 
                        break;
                }
                else 
                    break;
            }
            desc.splice(0, desc.length);
            desc.push(parts[i]);
            typs.splice(0, typs.length);
            typs.push(parts[i].typ);
            for (j = i + 1; j < parts.length; j++) {
                if (parts[j].values.length === 0 && parts[j].typ !== PartTokenItemType.PREAMBLE) 
                    break;
                else if (((!typs.includes(parts[j].typ) || parts[j].typ === PartTokenItemType.SUBITEM)) && parts[j].can_be_next_narrow(parts[j - 1])) {
                    if (parts[j - 1].delim_after && terminators === 0) {
                        if (desc_count <= asc_count) 
                            break;
                    }
                    desc.push(parts[j]);
                    typs.push(parts[j].typ);
                    if (parts[j].has_terminator) 
                        break;
                }
                else if (((!typs.includes(parts[j].typ) && parts[j - 1].can_be_next_narrow(parts[j]) && (j + 1) === (parts.length - 1)) && parts[j + 1].can_be_next_narrow(parts[j]) && parts[j + 1].can_be_next_narrow(parts[j - 1])) && !parts[j].has_terminator) {
                    desc.splice(desc.length - 1, 0, parts[j]);
                    typs.push(parts[j].typ);
                }
                else 
                    break;
            }
            desc.reverse();
            let li = (asc.length < desc.length ? desc : asc);
            for (j = 0; j < li.length; j++) {
                li[j].ind = 0;
            }
            while (true) {
                let dr = new DecreePartReferent();
                let rt = new ReferentToken(dr, parts[i].begin_token, parts[(i + li.length) - 1].end_token);
                if (parts[i].name !== null) 
                    dr.add_slot(DecreePartReferent.ATTR_NAME, parts[i].name, false, 0);
                res.push(rt);
                let sl_list = new Array();
                for (const p of li) {
                    let nam = PartToken._get_attr_name_by_typ(p.typ);
                    if (nam !== null) {
                        let sl = Slot._new1095(nam, p, 1);
                        sl_list.push(sl);
                        if (p.ind < p.values.length) {
                            sl.value = p.values[p.ind];
                            if (Utils.isNullOrEmpty(p.values[p.ind].value)) 
                                sl.value = "0";
                        }
                        else 
                            sl.value = "0";
                    }
                    if (p.ind > 0) 
                        rt.begin_token = p.values[p.ind].begin_token;
                    if ((p.ind + 1) < p.values.length) 
                        rt.end_token = p.values[p.ind].end_token;
                }
                for (const p of parts) {
                    for (const s of sl_list) {
                        if (s.tag === p) {
                            dr.add_slot(s.type_name, s.value, false, 0);
                            break;
                        }
                    }
                }
                for (j = li.length - 1; j >= 0; j--) {
                    if ((++li[j].ind) >= li[j].values.length) 
                        li[j].ind = 0;
                    else 
                        break;
                }
                if (j < 0) 
                    break;
            }
            i += (li.length - 1);
        }
        if (res.length === 0) 
            return null;
        for (j = res.length - 1; j > 0; j--) {
            let d0 = Utils.as(res[j].referent, DecreePartReferent);
            let d = Utils.as(res[j - 1].referent, DecreePartReferent);
            if (d0.clause !== null && d.clause === null) 
                d.clause = d0.clause;
        }
        tt = parts[i - 1].end_token;
        let owner = def_owner;
        let te = tt.next;
        if ((te !== null && owner === null && te.is_char('(')) && parts[0].typ !== PartTokenItemType.SUBPROGRAM && parts[0].typ !== PartTokenItemType.ADDAGREE) {
            let br = BracketHelper.try_parse(te, BracketParseAttr.NO, 100);
            if (br !== null) {
                if (te.next.morph.class0.is_adverb) {
                }
                else if (te.next.get_referent() instanceof DecreeReferent) {
                    if (owner === null && te.next.next === br.end_token) {
                        owner = Utils.as(te.next.get_referent(), DecreeReferent);
                        te = br.end_token;
                    }
                }
                else {
                    let s = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                    if (s !== null) {
                        let rt = res[res.length - 1];
                        (rt.referent).add_name(s);
                        rt.end_token = br.end_token;
                        te = rt.end_token.next;
                    }
                }
            }
        }
        if (te !== null && te.is_char_of(",;")) 
            te = te.next;
        if (owner === null && (te instanceof ReferentToken)) {
            if ((((owner = Utils.as(te.get_referent(), DecreeReferent)))) !== null) 
                res[res.length - 1].end_token = te;
        }
        if (owner === null) {
            for (j = 0; j < i; j++) {
                if ((((owner = parts[j].decree))) !== null) 
                    break;
            }
        }
        if (te !== null && te.is_value("К", null) && te.next !== null) {
            if (te.next.get_referent() instanceof DecreeReferent) {
                te = te.next;
                res[res.length - 1].end_token = te;
                owner = Utils.as(te.get_referent(), DecreeReferent);
            }
            else if (owner !== null && this_dec !== null && this_dec.end_char > te.end_char) 
                res[res.length - 1].end_token = this_dec.end_token;
        }
        if (owner === null && this_dec !== null) {
            let tt0 = res[0].begin_token;
            if (tt0.previous !== null && tt0.previous.is_char('(')) 
                tt0 = tt0.previous;
            if (tt0.previous !== null) {
                if ((((owner = Utils.as(tt0.previous.get_referent(), DecreeReferent)))) !== null) {
                    if (this_dec.typ === owner.typ0) 
                        this_dec = null;
                    else 
                        owner = null;
                }
            }
        }
        if (owner === null && this_dec !== null && this_dec.real !== null) 
            owner = this_dec.real;
        if (owner !== null && parts[0].typ === PartTokenItemType.SUBPROGRAM && owner.kind !== DecreeKind.PROGRAM) 
            owner = null;
        if (owner !== null && parts[0].typ === PartTokenItemType.ADDAGREE && owner.kind !== DecreeKind.CONTRACT) 
            owner = null;
        let owner_paer = null;
        let loc_typ = null;
        if ((this_dec === null || !this_dec.has_this_ref)) {
            let anafor_ref = null;
            for (const p of parts) {
                if ((((anafor_ref = p.anafor_ref))) !== null) 
                    break;
            }
            let is_change_word_after = false;
            let tt2 = res[res.length - 1].end_token.next;
            if (tt2 !== null) {
                if (((tt2.is_char(':') || tt2.is_value("ДОПОЛНИТЬ", null) || tt2.is_value("СЛОВО", null)) || tt2.is_value("ИСКЛЮЧИТЬ", null) || tt2.is_value("ИЗЛОЖИТЬ", null)) || tt2.is_value("СЧИТАТЬ", null) || tt2.is_value("ПРИЗНАТЬ", null)) 
                    is_change_word_after = true;
            }
            tt2 = parts[0].begin_token.previous;
            if (tt2 !== null) {
                if (((tt2.is_value("ДОПОЛНИТЬ", null) || tt2.is_value("ИСКЛЮЧИТЬ", null) || tt2.is_value("ИЗЛОЖИТЬ", null)) || tt2.is_value("СЧИТАТЬ", null) || tt2.is_value("УСТАНОВЛЕННЫЙ", null)) || tt2.is_value("ОПРЕДЕЛЕННЫЙ", null)) 
                    is_change_word_after = true;
            }
            let cou = 0;
            let ugol_delo = false;
            let brack_level = 0;
            let bt = null;
            let coef_before = 0;
            let is_over_brr = false;
            if (parts[0].begin_token.previous !== null && parts[0].begin_token.previous.is_char('(')) {
                if (parts[parts.length - 1].end_token.next !== null && parts[parts.length - 1].end_token.next.is_char(')')) {
                    if (parts.length === 1 && parts[0].typ === PartTokenItemType.APPENDIX) {
                    }
                    else {
                        is_over_brr = true;
                        if (owner !== null && DecreeAnalyzer._get_decree(parts[0].begin_token.previous.previous) !== null) 
                            owner = null;
                    }
                }
            }
            for (tt = parts[0].begin_token.previous; tt !== null; tt = tt.previous,coef_before++) {
                if (tt.is_newline_after) {
                    coef_before += 2;
                    if (((anafor_ref === null && !is_over_brr && !ugol_delo) && this_dec === null && !is_change_word_after) && !is_program && !is_add_agree) {
                        if (!tt.is_table_control_char) 
                            break;
                    }
                }
                if (this_dec !== null && this_dec.has_this_ref) 
                    break;
                if (tt.is_table_control_char) 
                    break;
                if (tt.morph.class0.is_preposition) {
                    coef_before--;
                    continue;
                }
                if (tt instanceof TextToken) {
                    if (BracketHelper.can_be_end_of_sequence(tt, false, null, false)) {
                        brack_level++;
                        continue;
                    }
                    if (BracketHelper.can_be_start_of_sequence(tt, false, false)) {
                        if (tt.is_char('(') && tt === parts[0].begin_token.previous) {
                        }
                        else {
                            brack_level--;
                            coef_before--;
                        }
                        continue;
                    }
                }
                if (tt.is_newline_before) 
                    brack_level = 0;
                if ((++cou) > 100) {
                    if (((ugol_delo || is_program || is_add_agree) || anafor_ref !== null || this_dec !== null) || is_over_brr) {
                        if (cou > 1000) 
                            break;
                    }
                    else if (is_change_word_after) {
                        if (cou > 250) 
                            break;
                    }
                    else 
                        break;
                }
                if (cou < 4) {
                    if (tt.is_value("УГОЛОВНЫЙ", "КРИМІНАЛЬНИЙ") && tt.next !== null && tt.next.is_value("ДЕЛО", "СПРАВА")) 
                        ugol_delo = true;
                }
                if (tt.is_char_of(".")) {
                    coef_before += 50;
                    if (tt.is_newline_after) 
                        coef_before += 100;
                    continue;
                }
                if (brack_level > 0) 
                    continue;
                let dr = DecreeAnalyzer._get_decree(tt);
                if (dr !== null && dr.kind !== DecreeKind.PUBLISHER) {
                    if (ugol_delo && ((dr.name === "УГОЛОВНЫЙ КОДЕКС" || dr.name === "КРИМІНАЛЬНИЙ КОДЕКС"))) 
                        coef_before = 0;
                    if (dr.kind === DecreeKind.PROGRAM) {
                        if (is_program) {
                            bt = tt;
                            break;
                        }
                        else 
                            continue;
                    }
                    if (dr.kind === DecreeKind.CONTRACT) {
                        if (is_add_agree) {
                            bt = tt;
                            break;
                        }
                        else if (this_dec !== null && ((dr.typ === this_dec.typ || dr.typ0 === this_dec.typ))) {
                            bt = tt;
                            break;
                        }
                        else 
                            continue;
                    }
                    if (this_dec !== null) {
                        let dpr = Utils.as(tt.get_referent(), DecreePartReferent);
                        if (this_dec.typ === dr.typ || this_dec.typ === dr.typ0) {
                        }
                        else if ((this_dec.has_other_ref && dpr !== null && dpr.clause !== null) && this_dec.typ === "СТАТЬЯ") {
                            for (const r of res) {
                                let dpr0 = Utils.as(r.referent, DecreePartReferent);
                                if (dpr0.clause === null) {
                                    dpr0.clause = dpr.clause;
                                    owner = dpr0.owner = dpr.owner;
                                }
                            }
                        }
                        else 
                            continue;
                    }
                    else if (is_change_word_after) {
                        if (owner === null) 
                            coef_before = 0;
                        else if (owner === DecreeAnalyzer._get_decree(tt)) 
                            coef_before = 0;
                    }
                    bt = tt;
                    break;
                }
                if (dr !== null) 
                    continue;
                let dpr2 = Utils.as(tt.get_referent(), DecreePartReferent);
                if (dpr2 !== null) {
                    bt = tt;
                    break;
                }
                let dit = DecreeToken.try_attach(tt, null, false);
                if (dit !== null && dit.typ === DecreeTokenItemType.TYP) {
                    if (this_dec !== null) 
                        continue;
                    if (dit.chars.is_capital_upper || anafor_ref !== null) {
                        bt = tt;
                        break;
                    }
                }
            }
            cou = 0;
            let at = null;
            let coef_after = 0;
            let aloc_typ = null;
            let tt0 = parts[parts.length - 1].end_token.next;
            let has_newline = false;
            for (let ttt = parts[parts.length - 1].begin_token; ttt.end_char < parts[parts.length - 1].end_char; ttt = ttt.next) {
                if (ttt.is_newline_after) 
                    has_newline = true;
            }
            for (tt = tt0; tt !== null; tt = tt.next,coef_after++) {
                if (owner !== null && coef_after > 0) 
                    break;
                if (tt.is_newline_before) 
                    break;
                if (tt.is_table_control_char) 
                    break;
                if (tt.is_value("СМ", null)) 
                    break;
                if (anafor_ref !== null) 
                    break;
                if (this_dec !== null) {
                    if (tt !== tt0) 
                        break;
                    if (this_dec.real !== null) 
                        break;
                }
                if (InstrToken._check_entered(tt) !== null) 
                    break;
                if (tt.morph.class0.is_preposition || tt.is_comma_and) {
                    coef_after--;
                    continue;
                }
                if (MorphClass.ooEq(tt.morph.class0, MorphClass.VERB)) 
                    break;
                if (BracketHelper.can_be_end_of_sequence(tt, false, null, false)) 
                    break;
                let pts = PartToken.try_attach_list(tt, false, 40);
                if (pts !== null) {
                    tt = pts[pts.length - 1].end_token;
                    coef_after--;
                    let ttnn = tt.next;
                    if (ttnn !== null && ttnn.is_char('.')) 
                        ttnn = ttnn.next;
                    let dit = DecreeToken.try_attach(ttnn, null, false);
                    if (dit !== null && dit.typ === DecreeTokenItemType.TYP) {
                        loc_typ = dit.value;
                        break;
                    }
                    continue;
                }
                if (BracketHelper.can_be_start_of_sequence(tt, false, false)) {
                    let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        coef_after--;
                        tt = br.end_token;
                        continue;
                    }
                }
                if ((++cou) > 100) 
                    break;
                if (cou > 1 && has_newline) 
                    break;
                if (tt.is_char_of(".")) {
                    coef_after += 50;
                    if (tt.is_newline_after) 
                        coef_after += 100;
                    continue;
                }
                let dr = Utils.as(tt.get_referent(), DecreeReferent);
                if (dr !== null && dr.kind !== DecreeKind.PUBLISHER) {
                    if (dr.kind === DecreeKind.PROGRAM) {
                        if (is_program) {
                            at = tt;
                            break;
                        }
                        else 
                            continue;
                    }
                    if (dr.kind === DecreeKind.CONTRACT) {
                        if (is_add_agree) {
                            at = tt;
                            break;
                        }
                        else 
                            continue;
                    }
                    at = tt;
                    break;
                }
                if (is_program || is_add_agree) 
                    break;
                if (dr !== null) 
                    continue;
                let tte2 = DecreeAnalyzer._check_other_typ(tt, tt === tt0);
                if (tte2 !== null) {
                    at = tte2;
                    if (tt === tt0 && this_dec !== null && this_dec.real === null) {
                        if (this_dec.typ === ((Utils.asString(at.tag)))) 
                            at = null;
                        else 
                            this_dec = null;
                    }
                    break;
                }
            }
            if (bt !== null && at !== null) {
                if (coef_before < coef_after) 
                    at = null;
                else 
                    bt = null;
            }
            if (owner === null) {
                if (at !== null) {
                    owner = DecreeAnalyzer._get_decree(at);
                    if (at instanceof TextToken) {
                        if ((typeof at.tag === 'string' || at.tag instanceof String)) 
                            loc_typ = Utils.asString(at.tag);
                        else 
                            loc_typ = (at).lemma;
                    }
                }
                else if (bt !== null) {
                    owner = DecreeAnalyzer._get_decree(bt);
                    owner_paer = Utils.as(bt.get_referent(), DecreePartReferent);
                    if (owner_paer !== null && loc_typ === null) 
                        loc_typ = owner_paer.local_typ;
                }
            }
            else if (coef_after === 0 && at !== null) 
                owner = DecreeAnalyzer._get_decree(at);
            else if (coef_before === 0 && bt !== null) {
                owner = DecreeAnalyzer._get_decree(bt);
                owner_paer = Utils.as(bt.get_referent(), DecreePartReferent);
                if (owner_paer !== null && loc_typ === null) 
                    loc_typ = owner_paer.local_typ;
            }
            if (((bt !== null && parts.length === 1 && parts[0].typ === PartTokenItemType.DOCPART) && (bt.get_referent() instanceof DecreePartReferent) && (bt.get_referent()).clause !== null) && res.length === 1 && owner === (bt.get_referent()).owner) {
                for (const s of res[0].referent.slots) {
                    if (s.type_name === DecreePartReferent.ATTR_DOCPART) 
                        s.type_name = DecreePartReferent.ATTR_PART;
                }
                (res[0].referent).add_high_level_info(Utils.as(bt.get_referent(), DecreePartReferent));
            }
        }
        if (owner === null) {
            if (this_dec === null && loc_typ === null) {
                if ((parts.length === 1 && parts[0].values.length === 1 && parts[0].typ === PartTokenItemType.APPENDIX) && parts[0].begin_token.chars.is_capital_upper) {
                }
                else if ((parts[0].begin_token.previous !== null && parts[0].begin_token.previous.is_char('(') && parts[parts.length - 1].end_token.next !== null) && parts[parts.length - 1].end_token.next.is_char(')')) {
                    if (parts[0].typ === PartTokenItemType.PAGE) 
                        return null;
                }
                else 
                    return null;
            }
            for (const r of res) {
                let dr = Utils.as(r.referent, DecreePartReferent);
                if (this_dec !== null) {
                    dr.local_typ = this_dec.typ;
                    if (this_dec.begin_char > r.end_char && r === res[res.length - 1]) 
                        r.end_token = this_dec.end_token;
                }
                else if (loc_typ !== null) {
                    if (loc_typ === "СТАТЬЯ" && dr.clause !== null) {
                    }
                    else if (loc_typ === "ГЛАВА" && dr.chapter !== null) {
                    }
                    else if (loc_typ === "ПАРАГРАФ" && dr.paragraph !== null) {
                    }
                    else if (loc_typ === "ЧАСТЬ" && dr.part !== null) {
                    }
                    else {
                        dr.local_typ = loc_typ;
                        if (r === res[res.length - 1] && !r.is_newline_after) {
                            let ttt1 = r.end_token.next;
                            if (ttt1 !== null && ttt1.is_comma) 
                                ttt1 = ttt1.next;
                            let at = DecreeAnalyzer._check_other_typ(ttt1, true);
                            if (at !== null && ((Utils.asString(at.tag))) === loc_typ) 
                                r.end_token = at;
                        }
                    }
                }
            }
        }
        else 
            for (const r of res) {
                let dr = Utils.as(r.referent, DecreePartReferent);
                dr.owner = owner;
                if (this_dec !== null && this_dec.real === owner) {
                    if (this_dec.begin_char > r.end_char && r === res[res.length - 1]) 
                        r.end_token = this_dec.end_token;
                }
            }
        if (res.length > 0) {
            let rt = res[res.length - 1];
            tt = rt.end_token.next;
            if (owner !== null && tt !== null && tt.get_referent() === owner) {
                rt.end_token = tt;
                tt = tt.next;
            }
            if (tt !== null && ((tt.is_hiphen || tt.is_char(':')))) 
                tt = tt.next;
            let br = BracketHelper.try_parse(tt, (is_program ? BracketParseAttr.CANBEMANYLINES : BracketParseAttr.NO), 100);
            if (br !== null) {
                let ok = true;
                if (br.open_char === '(') {
                    if (parts[0].typ === PartTokenItemType.SUBPROGRAM) 
                        ok = false;
                    else if (PartToken.try_attach(tt.next, null, false, false) !== null) 
                        ok = false;
                    else 
                        for (let ttt = tt.next; ttt !== null && (ttt.end_char < br.end_char); ttt = ttt.next) {
                            if (ttt === tt.next && tt.next.morph.class0.is_adverb) 
                                ok = false;
                            if ((ttt.get_referent() instanceof DecreeReferent) || (ttt.get_referent() instanceof DecreePartReferent)) 
                                ok = false;
                            if (ttt.is_value("РЕДАКЦИЯ", null) && ttt === br.end_token.previous) 
                                ok = false;
                        }
                }
                if (ok) {
                    let s = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                    if (s !== null) {
                        (rt.referent).add_name(s);
                        rt.end_token = br.end_token;
                        if ((rt.end_token.next instanceof ReferentToken) && rt.end_token.next.get_referent() === owner) 
                            rt.end_token = rt.end_token.next;
                    }
                }
            }
            else if ((is_program && parts[0].values.length > 0 && tt !== null) && tt.is_table_control_char && MiscHelper.can_be_start_of_sentence(tt.next)) {
                for (let tt1 = tt.next; tt1 !== null; tt1 = tt1.next) {
                    if (tt1.is_table_control_char) {
                        let s = MiscHelper.get_text_value(tt.next, tt1.previous, GetTextAttr.NO);
                        if (s !== null) {
                            (rt.referent).add_name(s);
                            rt.end_token = tt1;
                        }
                        break;
                    }
                    else if (tt1.is_newline_before) 
                        break;
                }
            }
            if (this_dec !== null) {
                if (this_dec.end_char > res[res.length - 1].end_char) 
                    res[res.length - 1].end_token = this_dec.end_token;
            }
        }
        if (owner_paer !== null) {
            for (let ii = 0; ii < res.length; ii++) {
                (res[ii].referent).add_high_level_info((ii === 0 ? owner_paer : Utils.as(res[ii - 1].referent, DecreePartReferent)));
            }
        }
        if (res.length === 1 && (res[0].referent).name === null) {
            if ((res[0].begin_token.previous !== null && res[0].begin_token.previous.is_char('(') && res[0].end_token.next !== null) && res[0].end_token.next.is_char(')')) {
                if (BracketHelper.can_be_end_of_sequence(res[0].begin_token.previous.previous, false, null, false)) {
                    let beg = null;
                    for (tt = res[0].begin_token.previous.previous.previous; tt !== null; tt = tt.previous) {
                        if (tt.is_newline_after) 
                            break;
                        if (BracketHelper.can_be_start_of_sequence(tt, false, false)) {
                            let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                            if (br !== null && ((br.end_char + 10) < res[0].begin_char)) 
                                break;
                            if (tt.next.chars.is_letter && !tt.next.chars.is_all_lower) 
                                beg = tt;
                        }
                    }
                    if (beg !== null) {
                        (res[0].referent).add_name(MiscHelper.get_text_value(beg, res[0].begin_token.previous.previous, GetTextAttr.NO));
                        res[0].begin_token = beg;
                        res[0].end_token = res[0].end_token.next;
                    }
                }
            }
        }
        if (is_program) {
            for (i = res.length - 1; i >= 0; i--) {
                let pa = Utils.as(res[i].referent, DecreePartReferent);
                if (pa.subprogram === null) 
                    continue;
                if (pa.owner === null || pa.name === null || pa.owner.kind !== DecreeKind.PROGRAM) 
                    res.splice(i, 1);
            }
        }
        if (is_add_agree) {
            for (i = res.length - 1; i >= 0; i--) {
                let pa = Utils.as(res[i].referent, DecreePartReferent);
                if (pa.addagree === null) 
                    continue;
                if (pa.owner === null || pa.owner.kind !== DecreeKind.CONTRACT) 
                    res.splice(i, 1);
            }
        }
        let res1 = new Array();
        for (i = 0; i < res.length; i++) {
            let li = new Array();
            for (j = i; j < res.length; j++) {
                if (res[j].begin_token !== res[i].begin_token) 
                    break;
                else 
                    li.push(Utils.as(res[j].referent, DecreePartReferent));
            }
            let et = null;
            if (j < res.length) 
                et = res[j].begin_token.previous;
            else 
                et = res[res.length - 1].end_token;
            while (et.begin_char > res[i].begin_char) {
                if (et.is_char(',') || et.morph.class0.is_conjunction || et.is_hiphen) 
                    et = et.previous;
                else if (MiscHelper.check_number_prefix(et) !== null) 
                    et = et.previous;
                else 
                    break;
            }
            res1.push(MetaToken._new834(res[i].begin_token, et, li));
            i = j - 1;
        }
        return res1;
    }
    
    static try_attach(dts, base_typ, ad) {
        let res = DecreeAnalyzer._try_attach(dts, base_typ, false, ad);
        return res;
    }
    
    static _try_attach(dts, base_typ, after_decree, ad) {
        const PartToken = require("./internal/PartToken");
        const DecreeToken = require("./internal/DecreeToken");
        if (dts === null || (dts.length < 1)) 
            return null;
        if (dts[0].typ === DecreeTokenItemType.EDITION && dts.length > 1) 
            dts.splice(0, 1);
        if (dts.length === 1) {
            if (dts[0].typ === DecreeTokenItemType.DECREEREF && dts[0].ref !== null) {
                if (base_typ !== null) {
                    let re = dts[0].ref.get_referent();
                    let dre = Utils.as(re, DecreeReferent);
                    if (dre === null && (re instanceof DecreePartReferent)) 
                        dre = (re).owner;
                    if (dre !== null) {
                        if (dre.typ === base_typ.value || dre.typ0 === base_typ.value) 
                            return null;
                    }
                }
                let reli = new Array();
                reli.push(new ReferentToken(dts[0].ref.referent, dts[0].begin_token, dts[0].end_token));
                return reli;
            }
        }
        let dec0 = null;
        let kodeks = false;
        let max_empty = 30;
        for (let t = dts[0].begin_token.previous; t !== null; t = t.previous) {
            if (t.is_comma_and) 
                continue;
            if (t.is_char(')')) {
                let cou = 0;
                for (t = t.previous; t !== null; t = t.previous) {
                    if (t.is_char('(')) 
                        break;
                    else if ((++cou) > 200) 
                        break;
                }
                if (t !== null && t.is_char('(')) 
                    continue;
                break;
            }
            if ((--max_empty) < 0) 
                break;
            if (!t.chars.is_letter) 
                continue;
            dec0 = Utils.as(t.get_referent(), DecreeReferent);
            if (dec0 !== null) {
                if (DecreeToken.get_kind(dec0.typ) === DecreeKind.KODEX) 
                    kodeks = true;
                else if (dec0.kind === DecreeKind.PUBLISHER) 
                    dec0 = null;
            }
            break;
        }
        let dec = new DecreeReferent();
        let i = 0;
        let _morph = null;
        let is_noun_doubt = false;
        let num_tok = null;
        for (i = 0; i < dts.length; i++) {
            if (dts[i].typ === DecreeTokenItemType.TYP) {
                if (dts[i].value === null) 
                    break;
                if (dts[i].is_newline_before) {
                    if (dec.date !== null || dec.number !== null) 
                        break;
                }
                if (dec.typ !== null) {
                    if (((dec.typ === "РЕШЕНИЕ" || dec.typ === "РІШЕННЯ")) && dts[i].value === "ПРОТОКОЛ") {
                    }
                    else if (dec.typ === dts[i].value && dec.typ === "ГОСТ") 
                        continue;
                    else 
                        break;
                }
                let ki = DecreeToken.get_kind(dts[i].value);
                if (ki === DecreeKind.STANDARD) {
                    if (i > 0) {
                        if (dts.length === 2 && dts[0].typ === DecreeTokenItemType.NUMBER && dts[i].value === "ТЕХНИЧЕСКИЕ УСЛОВИЯ") {
                        }
                        else 
                            return null;
                    }
                }
                if (ki === DecreeKind.KODEX) {
                    if (i > 0) 
                        break;
                    if (dts[i].value !== "ОСНОВЫ ЗАКОНОДАТЕЛЬСТВА" && dts[i].value !== "ОСНОВИ ЗАКОНОДАВСТВА") 
                        kodeks = true;
                    else 
                        kodeks = false;
                }
                else 
                    kodeks = false;
                _morph = dts[i].morph;
                dec.typ = dts[i].value;
                if (dts[i].full_value !== null) 
                    dec.add_name_str(dts[i].full_value);
                is_noun_doubt = dts[i].is_doubtful;
                if (is_noun_doubt && i === 0) {
                    if (PartToken.is_part_before(dts[i].begin_token)) 
                        is_noun_doubt = false;
                }
                if (dts[i].ref !== null) {
                    if (dec.find_slot(DecreeReferent.ATTR_GEO, null, true) === null) {
                        dec.add_slot(DecreeReferent.ATTR_GEO, dts[i].ref.referent, false, 0);
                        dec.add_ext_referent(dts[i].ref);
                    }
                }
            }
            else if (dts[i].typ === DecreeTokenItemType.DATE) {
                if (dec.date !== null) 
                    break;
                if (kodeks) {
                    if (i > 0 && dts[i - 1].typ === DecreeTokenItemType.NUMBER) {
                    }
                    else 
                        break;
                }
                if (i === (dts.length - 1)) {
                    if (!dts[i].begin_token.is_value("ОТ", "ВІД")) {
                        let ty = DecreeToken.get_kind(dec.typ);
                        if ((ty === DecreeKind.KONVENTION || ty === DecreeKind.CONTRACT || dec.typ0 === "ПИСЬМО") || dec.typ0 === "ЛИСТ") {
                        }
                        else 
                            break;
                    }
                }
                dec.add_date(dts[i]);
                dec.add_ext_referent(dts[i].ref);
            }
            else if (dts[i].typ === DecreeTokenItemType.DATERANGE) {
                if (dec.kind !== DecreeKind.PROGRAM) 
                    break;
                dec.add_date(dts[i]);
                dec.add_ext_referent(dts[i].ref);
            }
            else if (dts[i].typ === DecreeTokenItemType.EDITION) {
                if (dts[i].is_newline_before && !dts[i].begin_token.chars.is_all_lower && !dts[i].begin_token.is_char('(')) 
                    break;
                if (((i + 2) < dts.length) && dts[i + 1].typ === DecreeTokenItemType.TYP) 
                    break;
            }
            else if (dts[i].typ === DecreeTokenItemType.NUMBER) {
                if (kodeks) {
                    if (((i + 1) < dts.length) && dts[i + 1].typ === DecreeTokenItemType.DATE) {
                    }
                    else 
                        break;
                }
                num_tok = dts[i];
                if (dts[i].is_delo) {
                    if (dec.case_number !== null) 
                        break;
                    dec.add_slot(DecreeReferent.ATTR_CASENUMBER, dts[i].value, true, 0);
                    continue;
                }
                if (dec.number !== null) {
                    if (i > 2 && ((dts[i - 1].typ === DecreeTokenItemType.OWNER || dts[i - 1].typ === DecreeTokenItemType.ORG)) && dts[i - 2].typ === DecreeTokenItemType.NUMBER) {
                    }
                    else 
                        break;
                }
                if (dts[i].is_newline_before) {
                    if (dec.typ === null && dec0 === null) 
                        break;
                }
                if (LanguageHelper.ends_with(dts[i].value, "ФЗ")) 
                    dec.typ = "ФЕДЕРАЛЬНЫЙ ЗАКОН";
                if (LanguageHelper.ends_with(dts[i].value, "ФКЗ")) 
                    dec.typ = "ФЕДЕРАЛЬНЫЙ КОНСТИТУЦИОННЫЙ ЗАКОН";
                if (dts[i].value !== null && Utils.startsWithString(dts[i].value, "ПР", true) && dec.typ === null) 
                    dec.typ = "ПОРУЧЕНИЕ";
                if (dec.typ === null) {
                    if (dec0 === null && !after_decree && base_typ === null) 
                        break;
                }
                dec.add_number(dts[i]);
                if (dts[i].children !== null) {
                    let cou = 0;
                    for (const s of dec.slots) {
                        if (s.type_name === DecreeReferent.ATTR_SOURCE) 
                            cou++;
                    }
                    if (cou === (dts[i].children.length + 1)) {
                        for (const dd of dts[i].children) {
                            dec.add_number(dd);
                        }
                        dts[i].children = null;
                    }
                }
                continue;
            }
            else if (dts[i].typ === DecreeTokenItemType.NAME) {
                if (dec.typ === null && dec.number === null && dec0 === null) 
                    break;
                if (dec.get_string_value(DecreeReferent.ATTR_NAME) !== null) {
                    if (kodeks) 
                        break;
                    if (i > 0 && dts[i - 1].end_token.next === dts[i].begin_token) {
                    }
                    else 
                        break;
                }
                let nam = dts[i].value;
                if (kodeks && !nam.toUpperCase().includes("КОДЕКС")) 
                    nam = "Кодекс " + nam;
                dec.add_name_str(nam);
            }
            else if (dts[i].typ === DecreeTokenItemType.BETWEEN) {
                if (dec.kind !== DecreeKind.CONTRACT) 
                    break;
                for (const chh of dts[i].children) {
                    dec.add_slot(DecreeReferent.ATTR_SOURCE, chh.ref.referent, false, 0).tag = chh.get_source_text();
                    if (chh.ref.referent instanceof PersonPropertyReferent) 
                        dec.add_ext_referent(chh.ref);
                }
            }
            else if (dts[i].typ === DecreeTokenItemType.OWNER) {
                if (kodeks) 
                    break;
                if (dec.name !== null) 
                    break;
                if (((i === 0 || i === (dts.length - 1))) && dts[i].begin_token.chars.is_all_lower) 
                    break;
                if (i === 0 && dts.length > 1 && dts[1].typ === DecreeTokenItemType.TYP) 
                    break;
                if (dec.find_slot(DecreeReferent.ATTR_SOURCE, null, true) !== null) {
                }
                if (dts[i].ref !== null) {
                    let ty = DecreeToken.get_kind(dec.typ);
                    if (ty === DecreeKind.USTAV) {
                        if (!((dts[i].ref.referent instanceof OrganizationReferent))) 
                            break;
                    }
                    dec.add_slot(DecreeReferent.ATTR_SOURCE, dts[i].ref.referent, false, 0).tag = dts[i].get_source_text();
                    if (dts[i].ref.referent instanceof PersonPropertyReferent) 
                        dec.add_ext_referent(dts[i].ref);
                }
                else 
                    dec.add_slot(DecreeReferent.ATTR_SOURCE, MiscHelper.convert_first_char_upper_and_other_lower(dts[i].value), false, 0).tag = dts[i].get_source_text();
            }
            else if (dts[i].typ === DecreeTokenItemType.ORG) {
                if (kodeks) 
                    break;
                if (dec.name !== null) 
                    break;
                if (dec.find_slot(DecreeReferent.ATTR_SOURCE, null, true) !== null) {
                    if (i > 2 && dts[i - 1].typ === DecreeTokenItemType.NUMBER && ((dts[i - 2].typ === DecreeTokenItemType.ORG || dts[i - 2].typ === DecreeTokenItemType.OWNER))) {
                    }
                    else if (dts[i].begin_token.previous !== null && dts[i].begin_token.previous.is_and) {
                    }
                    else if (i > 0 && ((dts[i - 1].typ === DecreeTokenItemType.OWNER || dts[i - 1].typ === DecreeTokenItemType.ORG))) {
                    }
                    else 
                        break;
                }
                let sl = dec.add_slot(DecreeReferent.ATTR_SOURCE, dts[i].ref.referent, false, 0);
                sl.tag = dts[i].get_source_text();
                if (((i + 2) < dts.length) && dts[i + 1].typ === DecreeTokenItemType.UNKNOWN && (dts[i + 1].whitespaces_before_count < 2)) {
                    if (dts[i + 2].typ === DecreeTokenItemType.NUMBER || dts[i + 2].typ === DecreeTokenItemType.DATE) {
                        sl.tag = (new MetaToken(dts[i].begin_token, dts[i + 1].end_token)).get_source_text();
                        i++;
                    }
                }
            }
            else if (dts[i].typ === DecreeTokenItemType.TERR) {
                if (dec.find_slot(DecreeReferent.ATTR_GEO, null, true) !== null) 
                    break;
                if (i > 0 && dts[i - 1].typ === DecreeTokenItemType.NAME) 
                    break;
                if (dts[i].is_newline_before && ((i + 1) < dts.length) && dts[i + 1].typ === DecreeTokenItemType.DATE) 
                    break;
                dec.add_slot(DecreeReferent.ATTR_GEO, dts[i].ref.referent, false, 0);
            }
            else if (dts[i].typ === DecreeTokenItemType.UNKNOWN) {
                if (dec.find_slot(DecreeReferent.ATTR_SOURCE, null, true) !== null) 
                    break;
                if (kodeks) 
                    break;
                if ((dec.kind === DecreeKind.CONTRACT && i === 1 && ((i + 1) < dts.length)) && dts[i + 1].typ === DecreeTokenItemType.NUMBER) {
                    dec.add_name_str(MiscHelper.get_text_value_of_meta_token(dts[i], GetTextAttr.KEEPREGISTER));
                    continue;
                }
                if (i === 0) {
                    if (dec0 === null && !after_decree) 
                        break;
                    let ok1 = false;
                    if (((i + 1) < dts.length) && dts[i + 1].typ === DecreeTokenItemType.NUMBER) 
                        ok1 = true;
                    else if (((i + 2) < dts.length) && dts[i + 1].typ === DecreeTokenItemType.TERR && dts[i + 2].typ === DecreeTokenItemType.NUMBER) 
                        ok1 = true;
                    if (!ok1) 
                        break;
                }
                else if (dts[i - 1].typ === DecreeTokenItemType.OWNER || dts[i - 1].typ === DecreeTokenItemType.ORG) 
                    continue;
                if ((i + 1) >= dts.length) 
                    break;
                if (dts[0].typ === DecreeTokenItemType.TYP && dts[0].is_doubtful) 
                    break;
                if (dts[i + 1].typ === DecreeTokenItemType.NUMBER || dts[i + 1].typ === DecreeTokenItemType.DATE || dts[i + 1].typ === DecreeTokenItemType.NAME) {
                    dec.add_slot(DecreeReferent.ATTR_SOURCE, dts[i].value, false, 0).tag = dts[i].get_source_text();
                    continue;
                }
                if (dts[i + 1].typ === DecreeTokenItemType.TERR) {
                    dec.add_slot(DecreeReferent.ATTR_SOURCE, dts[i].value, false, 0).tag = dts[i].get_source_text();
                    continue;
                }
                if (dts[i + 1].typ === DecreeTokenItemType.OWNER) {
                    let s = MiscHelper.get_text_value(dts[i].begin_token, dts[i + 1].end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                    dts[i].end_token = dts[i + 1].end_token;
                    dec.add_slot(DecreeReferent.ATTR_SOURCE, s, false, 0).tag = dts[i].get_source_text();
                    i++;
                    continue;
                }
                break;
            }
            else if (dts[i].typ === DecreeTokenItemType.MISC) {
                if (i === 0 || kodeks) 
                    break;
                if ((i + 1) >= dts.length) {
                    if (BracketHelper.can_be_start_of_sequence(dts[i].end_token.next, true, false)) 
                        continue;
                    if (i > 0 && dts[i - 1].typ === DecreeTokenItemType.NUMBER) {
                        if (DecreeToken.try_attach_name(dts[i].end_token.next, null, true, false) !== null) 
                            continue;
                    }
                }
                else if (dts[i + 1].typ === DecreeTokenItemType.NAME || dts[i + 1].typ === DecreeTokenItemType.NUMBER || dts[i + 1].typ === DecreeTokenItemType.DATE) 
                    continue;
                break;
            }
            else 
                break;
        }
        if (i === 0) 
            return null;
        if (dec.typ === null || ((dec0 !== null && dts[0].typ !== DecreeTokenItemType.TYP))) {
            if (dec0 !== null) {
                if (dec.number === null && dec.date === null && dec.find_slot(DecreeReferent.ATTR_NAME, null, true) === null) 
                    return null;
                if (dec.typ === null) 
                    dec.typ = dec0.typ;
                if (dec.find_slot(DecreeReferent.ATTR_GEO, null, true) === null) 
                    dec.add_slot(DecreeReferent.ATTR_GEO, dec0.get_string_value(DecreeReferent.ATTR_GEO), false, 0);
                if (dec.find_slot(DecreeReferent.ATTR_DATE, null, true) === null && dec0.date !== null) 
                    dec.add_slot(DecreeReferent.ATTR_DATE, dec0.get_slot_value(DecreeReferent.ATTR_DATE), false, 0);
                let sl = null;
                if (dec.find_slot(DecreeReferent.ATTR_SOURCE, null, true) === null) {
                    if ((((sl = dec0.find_slot(DecreeReferent.ATTR_SOURCE, null, true)))) !== null) 
                        dec.add_slot(DecreeReferent.ATTR_SOURCE, sl.value, false, 0).tag = sl.tag;
                }
            }
            else if (base_typ !== null && after_decree) 
                dec.typ = base_typ.value;
            else 
                return null;
        }
        let et = dts[i - 1].end_token;
        if ((((!after_decree && dts.length === i && i === 3) && dts[0].typ === DecreeTokenItemType.TYP && dts[i - 1].typ === DecreeTokenItemType.NUMBER) && dec.find_slot(DecreeReferent.ATTR_SOURCE, null, true) !== null && et.next !== null) && et.next.is_comma && dec.number !== null) {
            for (let tt = et.next; tt !== null; tt = tt.next) {
                if (!tt.is_char(',')) 
                    break;
                let ddd = DecreeToken.try_attach_list(tt.next, dts[0], 10, false);
                if (ddd === null || (ddd.length < 2) || ddd[0].typ === DecreeTokenItemType.TYP) 
                    break;
                let has_num = false;
                for (const d of ddd) {
                    if (d.typ === DecreeTokenItemType.NUMBER) 
                        has_num = true;
                    else if (d.typ === DecreeTokenItemType.TYP) {
                        has_num = false;
                        break;
                    }
                }
                if (!has_num) 
                    break;
                let rtt = DecreeAnalyzer._try_attach(ddd, dts[0], true, ad);
                if (rtt === null) 
                    break;
                dec.merge_slots(rtt[0].referent, true);
                et = (tt = rtt[0].end_token);
            }
        }
        if (((et.next !== null && et.next.is_char('<') && (et.next.next instanceof ReferentToken)) && et.next.next.next !== null && et.next.next.next.is_char('>')) && et.next.next.get_referent().type_name === "URI") 
            et = et.next.next.next;
        let num = dec.number;
        if ((dec.find_slot(DecreeReferent.ATTR_NAME, null, true) === null && (i < dts.length) && dts[i].typ === DecreeTokenItemType.TYP) && dec.kind === DecreeKind.PROJECT) {
            let dts1 = Array.from(dts);
            dts1.splice(0, i);
            let rt1 = DecreeAnalyzer._try_attach(dts1, null, true, ad);
            if (rt1 !== null) {
                dec.add_name_str(MiscHelper.get_text_value_of_meta_token(rt1[0], GetTextAttr.KEEPREGISTER));
                et = rt1[0].end_token;
            }
        }
        if (dec.find_slot(DecreeReferent.ATTR_NAME, null, true) === null && !kodeks && et.next !== null) {
            let dn = DecreeToken.try_attach_name((et.next.is_char(':') ? et.next.next : et.next), dec.typ, false, false);
            if (dn !== null && et.next.chars.is_all_lower && num !== null) {
                if (ad !== null) {
                    for (const r of ad.referents) {
                        if (r.find_slot(DecreeReferent.ATTR_NUMBER, num, true) !== null) {
                            if (r.can_be_equals(dec, ReferentEqualType.WITHINONETEXT)) {
                                if (r.find_slot(DecreeReferent.ATTR_NAME, dn.value, true) === null) 
                                    dn = null;
                                break;
                            }
                        }
                    }
                }
            }
            if (dts[i - 1].typ === DecreeTokenItemType.TYP && dn !== null && et.is_newline_after) 
                dn = null;
            if (dn !== null) {
                if (dec.kind === DecreeKind.PROGRAM) {
                    for (let tt1 = dn.end_token.previous; tt1 !== null && tt1.begin_char > dn.begin_char; tt1 = (tt1 === null ? null : tt1.previous)) {
                        if (tt1.is_char(')') && tt1.previous !== null) 
                            tt1 = tt1.previous;
                        if (tt1.get_referent() instanceof DateRangeReferent) 
                            dec.add_slot(DecreeReferent.ATTR_DATE, tt1.get_referent(), false, 0);
                        else if ((tt1.get_referent() instanceof DateReferent) && tt1.previous !== null && tt1.previous.is_value("ДО", null)) {
                            let rt11 = tt1.kit.process_referent("DATE", tt1.previous);
                            if (rt11 !== null && (rt11.referent instanceof DateRangeReferent)) {
                                dec.add_slot(DecreeReferent.ATTR_DATE, rt11.referent, false, 0);
                                dec.add_ext_referent(rt11);
                                tt1 = tt1.previous;
                            }
                            else 
                                break;
                        }
                        else if ((tt1.get_referent() instanceof DateReferent) && tt1.previous !== null && ((tt1.previous.is_value("НА", null) || tt1.previous.is_value("В", null)))) {
                            dec.add_slot(DecreeReferent.ATTR_DATE, tt1.get_referent(), false, 0);
                            tt1 = tt1.previous;
                        }
                        else 
                            break;
                        for (tt1 = tt1.previous; tt1 !== null && tt1.begin_char > dn.begin_char; tt1 = (tt1 === null ? null : tt1.previous)) {
                            if (tt1.morph.class0.is_conjunction || tt1.morph.class0.is_preposition) 
                                continue;
                            if (tt1.is_value("ПЕРИОД", "ПЕРІОД") || tt1.is_value("ПЕРСПЕКТИВА", null)) 
                                continue;
                            if (tt1.is_char('(')) 
                                continue;
                            break;
                        }
                        if (tt1 !== null && tt1.end_char > dn.begin_char) {
                            if (dn.full_value === null) 
                                dn.full_value = dn.value;
                            dn.value = MiscHelper.get_text_value(dn.begin_token, tt1, GetTextAttr.KEEPREGISTER);
                        }
                        tt1 = tt1.next;
                    }
                }
                if (dn.full_value !== null) 
                    dec.add_name_str(dn.full_value);
                dec.add_name_str(dn.value);
                et = dn.end_token;
                let br = false;
                for (let tt = et.next; tt !== null; tt = tt.next) {
                    if (tt.is_char('(')) {
                        br = true;
                        continue;
                    }
                    if (tt.is_char(')') && br) {
                        et = tt;
                        continue;
                    }
                    if ((tt.get_referent() instanceof DateRangeReferent) && dec.kind === DecreeKind.PROGRAM) {
                        dec.add_slot(DecreeReferent.ATTR_DATE, tt.get_referent(), false, 0);
                        et = tt;
                        continue;
                    }
                    dn = DecreeToken.try_attach(tt, null, false);
                    if (dn === null) 
                        break;
                    if (dn.typ === DecreeTokenItemType.DATE && dec.date === null) {
                        if (dec.add_date(dn)) {
                            et = (tt = dn.end_token);
                            continue;
                        }
                    }
                    if (dn.typ === DecreeTokenItemType.NUMBER && dec.number === null) {
                        dec.add_number(dn);
                        et = (tt = dn.end_token);
                        continue;
                    }
                    if (dn.typ === DecreeTokenItemType.DATERANGE && dec.kind === DecreeKind.PROGRAM) {
                        if (dec.add_date(dn)) {
                            et = (tt = dn.end_token);
                            continue;
                        }
                    }
                    break;
                }
            }
        }
        if (dec.find_slot(DecreeReferent.ATTR_SOURCE, null, true) === null) {
            let tt0 = dts[0].begin_token.previous;
            if ((tt0 !== null && tt0.is_value("В", "У") && tt0.previous !== null) && (tt0.previous.get_referent() instanceof OrganizationReferent)) 
                dec.add_slot(DecreeReferent.ATTR_SOURCE, tt0.previous.get_referent(), false, 0);
        }
        if (!dec.check_correction(is_noun_doubt)) {
            let ty = dec.typ;
            let sl = null;
            if (dec0 !== null && dec.date !== null && dec.find_slot(DecreeReferent.ATTR_SOURCE, null, true) === null) 
                sl = dec0.find_slot(DecreeReferent.ATTR_SOURCE, null, true);
            if (sl !== null && (((((ty === "ПОСТАНОВЛЕНИЕ" || ty === "ПОСТАНОВА" || ty === "ОПРЕДЕЛЕНИЕ") || ty === "ВИЗНАЧЕННЯ" || ty === "РЕШЕНИЕ") || ty === "РІШЕННЯ" || ty === "ПРИГОВОР") || ty === "ВИРОК"))) 
                dec.add_slot(sl.type_name, sl.value, false, 0).tag = sl.tag;
            else {
                let eq_decs = 0;
                let dr0 = null;
                if (num !== null) {
                    if (ad !== null) {
                        for (const r of ad.referents) {
                            if (r.find_slot(DecreeReferent.ATTR_NUMBER, num, true) !== null) {
                                if (r.can_be_equals(dec, ReferentEqualType.WITHINONETEXT)) {
                                    eq_decs++;
                                    dr0 = Utils.as(r, DecreeReferent);
                                }
                            }
                        }
                    }
                }
                if (eq_decs === 1) 
                    dec.merge_slots(dr0, true);
                else {
                    let ok1 = false;
                    if (num !== null) {
                        for (let tt = dts[0].begin_token.previous; tt !== null; tt = tt.previous) {
                            if (tt.is_char_of(":,") || tt.is_hiphen || BracketHelper.can_be_start_of_sequence(tt, false, false)) {
                            }
                            else {
                                if (tt.is_value("ДАЛЕЕ", "ДАЛІ")) 
                                    ok1 = true;
                                break;
                            }
                        }
                    }
                    if (!ok1) 
                        return null;
                }
            }
        }
        let rt = new ReferentToken(dec, dts[0].begin_token, et);
        if (_morph !== null) 
            rt.morph = _morph;
        if (rt.chars.is_all_lower) {
            if (dec.typ0 === "ДЕКЛАРАЦИЯ" || dec.typ0 === "ДЕКЛАРАЦІЯ") 
                return null;
            if (((dec.typ0 === "КОНСТИТУЦИЯ" || dec.typ0 === "КОНСТИТУЦІЯ")) && rt.begin_token === rt.end_token) {
                let ok1 = false;
                let cou = 10;
                for (let tt = rt.begin_token.previous; tt !== null && cou > 0; tt = tt.previous,cou--) {
                    if (tt.is_newline_after) 
                        break;
                    let pt = PartToken.try_attach(tt, null, false, false);
                    if (pt !== null && pt.typ !== PartTokenItemType.PREFIX && pt.end_token.next === rt.begin_token) {
                        ok1 = true;
                        break;
                    }
                }
                if (!ok1) 
                    return null;
            }
        }
        if (num !== null && ((num.indexOf('/') > 0 || num.indexOf(',') > 0))) {
            let cou = 0;
            for (const s of dec.slots) {
                if (s.type_name === DecreeReferent.ATTR_NUMBER) 
                    cou++;
            }
            if (cou === 1) {
                let owns = 0;
                for (const s of dec.slots) {
                    if (s.type_name === DecreeReferent.ATTR_SOURCE) 
                        owns++;
                }
                if (owns > 1) {
                    let nums = Utils.splitString(num, '/', false);
                    let nums2 = Utils.splitString(num, ',', false);
                    let str_num = null;
                    for (let ii = 0; ii < dts.length; ii++) {
                        if (dts[ii].typ === DecreeTokenItemType.NUMBER) {
                            str_num = dts[ii].get_source_text();
                            break;
                        }
                    }
                    if (nums2.length === owns && owns > 1) {
                        dec.add_slot(DecreeReferent.ATTR_NUMBER, null, true, 0);
                        for (const n of nums2) {
                            dec.add_slot(DecreeReferent.ATTR_NUMBER, n.trim(), false, 0).tag = str_num;
                        }
                    }
                    else if (nums.length === owns && owns > 1) {
                        dec.add_slot(DecreeReferent.ATTR_NUMBER, null, true, 0);
                        for (const n of nums) {
                            dec.add_slot(DecreeReferent.ATTR_NUMBER, n.trim(), false, 0).tag = str_num;
                        }
                    }
                }
            }
        }
        if (BracketHelper.can_be_start_of_sequence(rt.begin_token.previous, false, false) && BracketHelper.can_be_end_of_sequence(rt.end_token.next, false, null, false)) {
            rt.begin_token = rt.begin_token.previous;
            rt.end_token = rt.end_token.next;
            let dts1 = DecreeToken.try_attach_list(rt.end_token.next, null, 10, false);
            if (dts1 !== null && dts1[0].typ === DecreeTokenItemType.DATE && dec.find_slot(DecreeReferent.ATTR_DATE, null, true) === null) {
                dec.add_date(dts1[0]);
                rt.end_token = dts1[0].end_token;
            }
        }
        if (dec.kind === DecreeKind.STANDARD && dec.name === null && BracketHelper.can_be_start_of_sequence(rt.end_token.next, true, false)) {
            let br = BracketHelper.try_parse(rt.end_token.next, BracketParseAttr.NO, 100);
            if (br !== null) {
                dec.add_name_str(MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.KEEPREGISTER));
                rt.end_token = br.end_token;
            }
        }
        if (dec.kind === DecreeKind.PROGRAM && dec.find_slot(DecreeReferent.ATTR_DATE, null, true) === null) {
            if (rt.begin_token.previous !== null && rt.begin_token.previous.is_value("ПАСПОРТ", null)) {
                let cou = 0;
                for (let tt = rt.end_token.next; tt !== null && (cou < 1000); tt = (tt === null ? null : tt.next)) {
                    if (tt.is_value("СРОК", "ТЕРМІН") && tt.next !== null && tt.next.is_value("РЕАЛИЗАЦИЯ", "РЕАЛІЗАЦІЯ")) {
                    }
                    else 
                        continue;
                    tt = tt.next.next;
                    if (tt === null) 
                        break;
                    let dtok = DecreeToken.try_attach(tt, null, false);
                    if (dtok !== null && dtok.typ === DecreeTokenItemType.TYP && ((dtok.value === "ПРОГРАММА" || dtok.value === "ПРОГРАМА"))) 
                        tt = dtok.end_token.next;
                    for (; tt !== null; tt = tt.next) {
                        if (tt.is_hiphen || tt.is_table_control_char || tt.is_value("ПРОГРАММА", "ПРОГРАМА")) {
                        }
                        else if (tt.get_referent() instanceof DateRangeReferent) {
                            dec.add_slot(DecreeReferent.ATTR_DATE, tt.get_referent(), false, 0);
                            break;
                        }
                        else 
                            break;
                    }
                    break;
                }
            }
        }
        if (rt.end_token.next !== null && rt.end_token.next.is_char('(')) {
            let dt = null;
            for (let tt = rt.end_token.next.next; tt !== null; tt = tt.next) {
                let r = tt.get_referent();
                if (r instanceof GeoReferent) 
                    continue;
                if (r instanceof DateReferent) {
                    dt = Utils.as(r, DateReferent);
                    continue;
                }
                if (tt.morph.class0.is_preposition) 
                    continue;
                if (tt.morph.class0.is_verb) 
                    continue;
                if (tt.is_char(')') && dt !== null) {
                    dec.add_slot(DecreeReferent.ATTR_DATE, dt, false, 0);
                    rt.end_token = tt;
                }
                break;
            }
        }
        let rt_li = new Array();
        if (((i + 1) < dts.length) && dts[i].typ === DecreeTokenItemType.EDITION && !dts[i].is_newline_before) {
            dts.splice(0, i + 1);
            let ed = DecreeAnalyzer._try_attach(dts, base_typ, true, ad);
            if (ed !== null && ed.length > 0) {
                rt_li.splice(rt_li.length, 0, ...ed);
                for (const e of ed) {
                    dec.add_slot(DecreeReferent.ATTR_EDITION, e.referent, false, 0);
                }
                rt.end_token = ed[ed.length - 1].end_token;
            }
        }
        else if (((i < (dts.length - 1)) && i > 0 && dts[i - 1].typ === DecreeTokenItemType.EDITION) && !dts[i - 1].is_newline_before) {
            dts.splice(0, i);
            let ed = DecreeAnalyzer._try_attach(dts, base_typ, true, ad);
            if (ed !== null && ed.length > 0) {
                rt_li.splice(rt_li.length, 0, ...ed);
                for (const e of ed) {
                    dec.add_slot(DecreeReferent.ATTR_EDITION, e.referent, false, 0);
                }
                rt.end_token = ed[ed.length - 1].end_token;
            }
        }
        let rt22 = DecreeAnalyzer._try_attach_approved(rt.end_token.next, ad, true);
        if (rt22 !== null) {
            rt.end_token = rt22.end_token;
            let dr00 = Utils.as(rt22.referent, DecreeReferent);
            if (dr00.typ === null) {
                for (const s of dr00.slots) {
                    if (s.type_name === DecreeReferent.ATTR_DATE || s.type_name === DecreeReferent.ATTR_SOURCE) {
                        if (dec.find_slot(s.type_name, null, true) === null) 
                            dec.add_slot(s.type_name, s.value, false, 0);
                    }
                }
                dr00 = null;
            }
            if (dr00 !== null) {
                rt_li.push(rt22);
                dec.add_slot(DecreeReferent.ATTR_EDITION, rt22.referent, false, 0);
            }
        }
        rt_li.push(rt);
        if (num_tok !== null && num_tok.children !== null) {
            let end = rt.end_token;
            rt.end_token = num_tok.children[0].begin_token.previous;
            if (rt.end_token.is_comma_and) 
                rt.end_token = rt.end_token.previous;
            for (let ii = 0; ii < num_tok.children.length; ii++) {
                let dr1 = new DecreeReferent();
                for (const s of rt.referent.slots) {
                    if (s.type_name === DecreeReferent.ATTR_NUMBER) 
                        dr1.add_slot(s.type_name, num_tok.children[ii].value, false, 0).tag = num_tok.children[ii].get_source_text();
                    else {
                        let ss = dr1.add_slot(s.type_name, s.value, false, 0);
                        if (ss !== null) 
                            ss.tag = s.tag;
                    }
                }
                let rt1 = new ReferentToken(dr1, num_tok.children[ii].begin_token, num_tok.children[ii].end_token);
                if (ii === (num_tok.children.length - 1)) 
                    rt1.end_token = end;
                rt_li.push(rt1);
            }
        }
        if ((dts.length === 2 && dts[0].typ === DecreeTokenItemType.TYP && dts[0].typ_kind === DecreeKind.STANDARD) && dts[1].typ === DecreeTokenItemType.NUMBER) {
            for (let ttt = dts[1].end_token.next; ttt !== null; ttt = ttt.next) {
                if (!ttt.is_comma_and) 
                    break;
                let nu = DecreeToken.try_attach(ttt.next, dts[0], false);
                if (nu === null || nu.typ !== DecreeTokenItemType.NUMBER) 
                    break;
                let dr1 = DecreeReferent._new1099(dec.typ);
                dr1.add_number(nu);
                rt_li.push(new ReferentToken(dr1, ttt.next, nu.end_token));
                if (!ttt.is_comma) 
                    break;
                ttt = nu.end_token;
            }
        }
        return rt_li;
    }
    
    get name() {
        return DecreeAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Законы и указы";
    }
    
    get description() {
        return "Законы, указы, постановления, распоряжения и т.п.";
    }
    
    clone() {
        return new DecreeAnalyzer();
    }
    
    get type_system() {
        return [MetaDecree.GLOBAL_META, MetaDecreePart.GLOBAL_META, MetaDecreeChange.GLOBAL_META, MetaDecreeChangeValue.GLOBAL_META];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaDecree.DECREE_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("decree.png"));
        res.put(MetaDecree.STANDADR_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("decreestd.png"));
        res.put(MetaDecreePart.PART_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("part.png"));
        res.put(MetaDecreePart.PART_LOC_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("document_into.png"));
        res.put(MetaDecree.PUBLISH_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("publish.png"));
        res.put(MetaDecreeChange.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("decreechange.png"));
        res.put(MetaDecreeChangeValue.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("decreechangevalue.png"));
        return res;
    }
    
    get used_extern_object_types() {
        return [DateReferent.OBJ_TYPENAME, GeoReferent.OBJ_TYPENAME, OrganizationReferent.OBJ_TYPENAME, PersonReferent.OBJ_TYPENAME];
    }
    
    create_referent(type) {
        if (type === DecreeReferent.OBJ_TYPENAME) 
            return new DecreeReferent();
        if (type === DecreePartReferent.OBJ_TYPENAME) 
            return new DecreePartReferent();
        if (type === DecreeChangeReferent.OBJ_TYPENAME) 
            return new DecreeChangeReferent();
        if (type === DecreeChangeValueReferent.OBJ_TYPENAME) 
            return new DecreeChangeValueReferent();
        return null;
    }
    
    get progress_weight() {
        return 10;
    }
    
    /**
     * Основная функция выделения дат
     * @param cnt 
     * @param stage 
     * @return 
     */
    process(kit) {
        const DecreeChangeToken = require("./internal/DecreeChangeToken");
        const PartToken = require("./internal/PartToken");
        const DecreeToken = require("./internal/DecreeToken");
        let ad = kit.get_analyzer_data(this);
        let base_typ = null;
        let ref0 = null;
        let aliases = new TerminCollection();
        for (let t = kit.first_token; t !== null; t = t.next) {
            let r = t.get_referent();
            if (r === null) 
                continue;
            if (!((r instanceof OrganizationReferent))) 
                continue;
            let rt = Utils.as(t, ReferentToken);
            if (!rt.begin_token.chars.is_all_upper || rt.begin_token.length_char > 4) 
                continue;
            let dtr = DecreeToken.try_attach(rt.begin_token, null, false);
            if (dtr === null || dtr.typ_kind !== DecreeKind.KODEX) 
                continue;
            if (rt.begin_token === rt.end_token) {
            }
            else if (rt.begin_token.next === rt.end_token && (rt.end_token.get_referent() instanceof GeoReferent)) {
            }
            else 
                continue;
            t = kit.debed_token(rt);
        }
        let last_dec_dist = 0;
        for (let t = kit.first_token; t !== null; t = t.next,last_dec_dist++) {
            let dts = DecreeToken.try_attach_list(t, null, 10, last_dec_dist > 1000);
            let tok = aliases.try_parse(t, TerminParseAttr.NO);
            if (tok !== null && tok.begin_token === tok.end_token && tok.chars.is_all_lower) {
                let ok = false;
                for (let tt = t.previous; tt !== null && ((t.end_char - tt.end_char) < 20); tt = tt.previous) {
                    let p = PartToken.try_attach(tt, null, false, false);
                    if (p !== null && p.typ !== PartTokenItemType.PREFIX && p.end_token.next === t) {
                        ok = true;
                        break;
                    }
                }
                if (!ok) 
                    tok = null;
            }
            if (tok !== null) {
                let rt0 = DecreeAnalyzer.try_attach_approved(t, ad);
                if (rt0 !== null) 
                    tok = null;
            }
            if (tok !== null) {
                let dec0 = Utils.as(tok.termin.tag, DecreeReferent);
                let rt0 = new ReferentToken(Utils.as(tok.termin.tag, Referent), tok.begin_token, tok.end_token);
                if (dec0 !== null && (rt0.end_token.next instanceof ReferentToken) && (rt0.end_token.next.get_referent() instanceof GeoReferent)) {
                    let geo0 = Utils.as(dec0.get_slot_value(DecreeReferent.ATTR_GEO), GeoReferent);
                    let geo1 = Utils.as(rt0.end_token.next.get_referent(), GeoReferent);
                    if (geo0 === null) {
                        dec0.add_slot(DecreeReferent.ATTR_GEO, geo1, false, 0);
                        rt0.end_token = rt0.end_token.next;
                    }
                    else if (geo0 === geo1) 
                        rt0.end_token = rt0.end_token.next;
                    else 
                        continue;
                }
                kit.embed_token(rt0);
                t = rt0;
                rt0.misc_attrs = 1;
                last_dec_dist = 0;
                continue;
            }
            if (dts === null || dts.length === 0 || ((dts.length === 1 && dts[0].typ === DecreeTokenItemType.TYP))) {
                let rt0 = DecreeAnalyzer.try_attach_approved(t, ad);
                if (rt0 !== null) {
                    rt0.referent = ad.register_referent(rt0.referent);
                    let mt = DecreeAnalyzer._check_alias_after(rt0.end_token.next);
                    if (mt !== null) {
                        if (aliases !== null) {
                            let term = new Termin();
                            term.init_by(mt.begin_token, mt.end_token.previous, rt0.referent, false);
                            aliases.add(term);
                        }
                        rt0.end_token = mt.end_token;
                    }
                    else if ((((mt = Utils.as(rt0.tag, MetaToken)))) !== null) {
                        if (aliases !== null) {
                            let term = new Termin();
                            term.init_by(mt.begin_token, mt.end_token.previous, rt0.referent, false);
                            aliases.add(term);
                        }
                    }
                    kit.embed_token(rt0);
                    last_dec_dist = 0;
                    t = rt0;
                    continue;
                }
                if (dts === null || dts.length === 0) 
                    continue;
            }
            if (dts[0].is_newline_after && dts[0].is_newline_before) {
                let ignore = false;
                if (t === kit.first_token) 
                    ignore = true;
                else if ((dts[0].typ === DecreeTokenItemType.ORG && dts.length > 1 && dts[1].typ === DecreeTokenItemType.TYP) && dts[1].is_whitespace_after) 
                    ignore = true;
                if (ignore) {
                    t = dts[dts.length - 1].end_token;
                    continue;
                }
            }
            if (base_typ === null) {
                for (const dd of dts) {
                    if (dd.typ === DecreeTokenItemType.TYP) {
                        base_typ = dd;
                        break;
                    }
                }
            }
            if (dts[0].typ === DecreeTokenItemType.TYP && DecreeToken.get_kind(dts[0].value) === DecreeKind.PUBLISHER) {
                let rts = this.try_attach_pulishers(dts);
                if (rts !== null) {
                    for (let i = 0; i < rts.length; i++) {
                        let rtt = rts[i];
                        if (rtt.referent instanceof DecreePartReferent) 
                            (rtt.referent).owner = Utils.as(ad.register_referent((rtt.referent).owner), DecreeReferent);
                        rtt.referent = ad.register_referent(rtt.referent);
                        kit.embed_token(rtt);
                        t = rtt;
                        if ((rtt.referent instanceof DecreeReferent) && ((i + 1) < rts.length) && (rts[i + 1].referent instanceof DecreePartReferent)) 
                            rts[i + 1].begin_token = t;
                        last_dec_dist = 0;
                    }
                    let mt = DecreeAnalyzer._check_alias_after(t.next);
                    if (mt !== null) {
                        for (let tt = dts[0].begin_token.previous; tt !== null; tt = tt.previous) {
                            if (tt.is_comma) 
                                continue;
                            let d = Utils.as(tt.get_referent(), DecreeReferent);
                            if (d !== null) {
                                if (aliases !== null) {
                                    let term = new Termin();
                                    term.init_by(mt.begin_token, mt.end_token.previous, d, false);
                                    aliases.add(term);
                                }
                                t = mt.end_token;
                            }
                            break;
                        }
                    }
                }
                continue;
            }
            let rtli = DecreeAnalyzer.try_attach(dts, base_typ, ad);
            if (rtli === null || ((rtli.length === 1 && (dts.length < 3) && dts[0].value === "РЕГЛАМЕНТ"))) {
                let rt = DecreeAnalyzer.try_attach_approved(t, ad);
                if (rt !== null) {
                    rtli = new Array();
                    rtli.push(rt);
                }
            }
            if (rtli !== null) {
                for (let ii = 0; ii < rtli.length; ii++) {
                    let rt = rtli[ii];
                    last_dec_dist = 0;
                    rt.referent = ad.register_referent(rt.referent);
                    let mt = DecreeAnalyzer._check_alias_after(rt.end_token.next);
                    if (mt !== null) {
                        if (aliases !== null) {
                            let term = new Termin();
                            term.init_by(mt.begin_token, mt.end_token.previous, rt.referent, false);
                            aliases.add(term);
                        }
                        rt.end_token = mt.end_token;
                    }
                    else if ((((mt = Utils.as(rt.tag, MetaToken)))) !== null) {
                        if (aliases !== null) {
                            let term = new Termin();
                            term.init_by(mt.begin_token, mt.end_token.previous, rt.referent, false);
                            aliases.add(term);
                        }
                    }
                    ref0 = rt.referent;
                    kit.embed_token(rt);
                    t = rt;
                    if ((ii + 1) < rtli.length) {
                        if (rt.end_token.next === rtli[ii + 1].begin_token) 
                            rtli[ii + 1].begin_token = rt;
                    }
                }
            }
            else if (dts.length === 1 && dts[0].typ === DecreeTokenItemType.TYP) {
                if (dts[0].chars.is_capital_upper && !dts[0].is_doubtful) {
                    last_dec_dist = 0;
                    if (base_typ !== null && dts[0].ref !== null) {
                        let drr = Utils.as(dts[0].ref.get_referent(), DecreeReferent);
                        if (drr !== null) {
                            if (base_typ.value === drr.typ0 || base_typ.value === drr.typ) 
                                continue;
                        }
                    }
                    let rt0 = DecreeToken._find_back_typ(dts[0].begin_token.previous, dts[0].value);
                    if (rt0 !== null) {
                        let rt = new ReferentToken(rt0.referent, dts[0].begin_token, dts[0].end_token);
                        kit.embed_token(rt);
                        t = rt;
                        rt.tag = rt0.referent;
                    }
                }
            }
        }
        if (ad.referents.length > 0) {
            for (let t = kit.first_token; t !== null; t = t.next) {
                let dr = Utils.as(t.get_referent(), DecreeReferent);
                if (dr === null) 
                    continue;
                let li = null;
                for (let tt = t.next; tt !== null; tt = tt.next) {
                    if (!tt.is_comma_and) 
                        break;
                    if (tt.next === null || !((tt.next.get_referent() instanceof DecreeReferent))) 
                        break;
                    if (li === null) {
                        li = new Array();
                        li.push(dr);
                    }
                    dr = Utils.as(tt.next.get_referent(), DecreeReferent);
                    li.push(dr);
                    dr.tag = null;
                    tt = tt.next;
                    if (dr.date !== null) {
                        let dts = DecreeToken.try_attach_list((tt).begin_token, null, 10, false);
                        if (dts !== null) {
                            for (const dt of dts) {
                                if (dt.typ === DecreeTokenItemType.DATE) 
                                    dr.tag = dr;
                            }
                        }
                    }
                }
                if (li === null) 
                    continue;
                let i = 0;
                for (i = li.length - 1; i > 0; i--) {
                    if (li[i].typ === li[i - 1].typ) {
                        if (li[i].date !== null && li[i].tag !== null && li[i - 1].date === null) 
                            li[i - 1].add_slot(DecreeReferent.ATTR_DATE, li[i].get_slot_value(DecreeReferent.ATTR_DATE), false, 0);
                    }
                }
                for (i = 0; i < (li.length - 1); i++) {
                    if (li[i].typ === li[i + 1].typ) {
                        let sl = li[i].find_slot(DecreeReferent.ATTR_SOURCE, null, true);
                        if (sl !== null && li[i + 1].find_slot(DecreeReferent.ATTR_SOURCE, null, true) === null) 
                            li[i + 1].add_slot(sl.type_name, sl.value, false, 0);
                    }
                }
                for (i = 0; i < li.length; i++) {
                    if (li[i].name !== null) 
                        break;
                }
                if (i === (li.length - 1)) {
                    for (i = li.length - 1; i > 0; i--) {
                        if (li[i - 1].typ === li[i].typ) 
                            li[i - 1].add_name(li[i]);
                    }
                }
            }
        }
        let undefined_decrees = new Array();
        let root_change = null;
        let last_change = null;
        let change_stack = new Array();
        let expire_regime = false;
        let has_start_change = 0;
        for (let t = kit.first_token; t !== null; t = t.next) {
            let dts = null;
            if (t.is_newline_before && (t instanceof NumberToken) && (t).value === "25") {
            }
            let dcht = null;
            if (t.is_newline_before) 
                dcht = DecreeChangeToken.try_attach(t, root_change, false, change_stack, false);
            if (dcht !== null && dcht.is_start) {
                if (dcht.typ === DecreeChangeTokenTyp.STARTMULTU) {
                    expire_regime = false;
                    has_start_change = 3;
                    root_change = null;
                }
                else if (dcht.typ === DecreeChangeTokenTyp.SINGLE) {
                    let dcht1 = DecreeChangeToken.try_attach(dcht.end_token.next, root_change, false, change_stack, false);
                    if (dcht1 !== null && dcht1.is_start) {
                        has_start_change = 2;
                        if (dcht.decree_tok !== null && dcht.decree !== null) {
                            let rt = new ReferentToken(dcht.decree, dcht.decree_tok.begin_token, dcht.decree_tok.end_token);
                            kit.embed_token(rt);
                            t = rt;
                            if (dcht.end_char === t.end_char) 
                                dcht.end_token = t;
                        }
                    }
                }
                else if (dcht.typ === DecreeChangeTokenTyp.STARTSINGLE && dcht.decree !== null && !expire_regime) {
                    expire_regime = false;
                    has_start_change = 2;
                    if (dcht.decree_tok !== null) {
                        let rt = new ReferentToken(dcht.decree, dcht.decree_tok.begin_token, dcht.decree_tok.end_token);
                        kit.embed_token(rt);
                        t = rt;
                        if (dcht.end_char === t.end_char) 
                            dcht.end_token = t;
                    }
                    else 
                        root_change = null;
                }
                if (dcht.typ === DecreeChangeTokenTyp.STARTSINGLE && root_change !== null && dcht.decree === null) 
                    has_start_change = 2;
                else if ((dcht.typ === DecreeChangeTokenTyp.SINGLE && dcht.decree !== null && dcht.end_token.is_char(':')) && dcht.is_newline_after) 
                    has_start_change = 2;
                if (has_start_change <= 0) {
                    dts = PartToken.try_attach_list(t, false, 40);
                    change_stack.splice(0, change_stack.length);
                }
                else {
                    if (dcht.decree !== null) {
                        change_stack.splice(0, change_stack.length);
                        change_stack.push(dcht.decree);
                    }
                    else if (dcht.act_kind === DecreeChangeKind.EXPIRE && dcht.typ === DecreeChangeTokenTyp.STARTMULTU) 
                        expire_regime = true;
                    dts = dcht.parts;
                }
            }
            else {
                dts = PartToken.try_attach_list(t, false, 40);
                if (dcht === null && t.is_newline_before) {
                    expire_regime = false;
                    has_start_change--;
                }
            }
            if (dts !== null) {
            }
            let rts = DecreeAnalyzer.try_attach_parts(dts, base_typ, (has_start_change > 0 && change_stack.length > 0 ? change_stack[0] : null));
            if (rts !== null) {
            }
            let dprs = null;
            let diaps = null;
            let begs = null;
            let ends = null;
            if (rts !== null) {
                for (const kp of rts) {
                    let dpr_list = Utils.as(kp.tag, Array);
                    if (dpr_list === null) 
                        continue;
                    for (let i = 0; i < dpr_list.length; i++) {
                        let dr = dpr_list[i];
                        if (dr.owner === null && dr.clause !== null && dr.local_typ === null) {
                            if (!undefined_decrees.includes(dr)) 
                                undefined_decrees.push(dr);
                        }
                        if (dr.owner !== null && dr.clause !== null) {
                            for (const d of undefined_decrees) {
                                d.owner = dr.owner;
                            }
                            undefined_decrees.splice(0, undefined_decrees.length);
                        }
                        if (dcht !== null && change_stack.length > 0) {
                            while (change_stack.length > 0) {
                                if (dr.is_all_items_less_level(change_stack[0], false)) {
                                    if (change_stack[0] instanceof DecreePartReferent) 
                                        dr.add_high_level_info(Utils.as(change_stack[0], DecreePartReferent));
                                    break;
                                }
                                if (change_stack[0] instanceof DecreePartReferent) 
                                    change_stack.splice(0, 1);
                            }
                        }
                        if (last_change !== null && last_change.owners.length > 0) {
                            let dr0 = Utils.as(last_change.owners[0], DecreePartReferent);
                            if (dr0 !== null && dr.owner === dr0.owner) {
                                let mle = dr.get_min_level();
                                if (mle === 0 || mle <= PartToken._get_rank(PartTokenItemType.CLAUSE)) {
                                }
                                else 
                                    dr.add_high_level_info(dr0);
                            }
                        }
                        dr = Utils.as(ad.register_referent(dr), DecreePartReferent);
                        if (dprs === null) 
                            dprs = new Array();
                        dprs.push(dr);
                        let rt = null;
                        if (i === 0) 
                            rt = new ReferentToken(dr, kp.begin_token, kp.end_token);
                        else 
                            rt = new ReferentToken(dr, t, t);
                        kit.embed_token(rt);
                        t = rt;
                        if (dprs.length === 2 && t.previous !== null && t.previous.is_hiphen) {
                            if (diaps === null) 
                                diaps = new Hashtable();
                            if (!diaps.containsKey(dprs[0])) 
                                diaps.put(dprs[0], dprs[1]);
                        }
                        if (begs === null) 
                            begs = new Hashtable();
                        if (!begs.containsKey(t.begin_char)) 
                            begs.put(t.begin_char, t);
                        else 
                            begs.put(t.begin_char, t);
                        if (ends === null) 
                            ends = new Hashtable();
                        if (!ends.containsKey(t.end_char)) 
                            ends.put(t.end_char, t);
                        else 
                            ends.put(t.end_char, t);
                        if (dcht !== null) {
                            if (dcht.begin_char === t.begin_char) 
                                dcht.begin_token = t;
                            if (dcht.end_char === t.end_char) 
                                dcht.end_token = t;
                            if (t.end_char > dcht.end_char) 
                                dcht.end_token = t;
                        }
                    }
                }
            }
            if (dts !== null && dts.length > 0 && dts[dts.length - 1].end_char > t.end_char) 
                t = dts[dts.length - 1].end_token;
            if (dcht !== null && has_start_change > 0) {
                if (dcht.end_char > t.end_char) 
                    t = dcht.end_token;
                let chrt = null;
                if (dcht.typ === DecreeChangeTokenTyp.STARTMULTU) {
                    root_change = null;
                    change_stack.splice(0, change_stack.length);
                    if (dcht.decree !== null) 
                        change_stack.push(dcht.decree);
                    if (dprs !== null && dprs.length > 0) {
                        if (change_stack.length === 0 && dprs[0].owner !== null) 
                            change_stack.push(dprs[0].owner);
                        change_stack.splice(0, 0, dprs[0]);
                    }
                    if (change_stack.length > 0 || dcht.decree !== null) {
                        root_change = Utils.as(ad.register_referent(DecreeChangeReferent._new1100(DecreeChangeKind.CONTAINER)), DecreeChangeReferent);
                        if (change_stack.length > 0) 
                            root_change.add_slot(DecreeChangeReferent.ATTR_OWNER, change_stack[0], false, 0);
                        else 
                            root_change.add_slot(DecreeChangeReferent.ATTR_OWNER, dcht.decree, false, 0);
                        let rt = new ReferentToken(root_change, dcht.begin_token, dcht.end_token);
                        if (rt.end_token.is_char(':')) 
                            rt.end_token = rt.end_token.previous;
                        kit.embed_token(rt);
                        t = rt;
                        if (t.next !== null && t.next.is_char(':')) 
                            t = t.next;
                    }
                    continue;
                }
                if (dcht.typ === DecreeChangeTokenTyp.SINGLE && dprs !== null && dprs.length === 1) {
                    while (change_stack.length > 0) {
                        if (dprs[0].is_all_items_less_level(change_stack[0], true)) 
                            break;
                        else 
                            change_stack.splice(0, 1);
                    }
                    change_stack.splice(0, 0, dprs[0]);
                    if (dprs[0].owner !== null && change_stack[change_stack.length - 1] !== dprs[0].owner) {
                        change_stack.splice(0, change_stack.length);
                        change_stack.splice(0, 0, dprs[0].owner);
                        change_stack.splice(0, 0, dprs[0]);
                    }
                    continue;
                }
                if (dprs === null && dcht.real_part !== null) {
                    dprs = new Array();
                    dprs.push(dcht.real_part);
                }
                if (dprs !== null && dprs.length > 0) {
                    chrt = DecreeChangeToken.attach_referents(dprs[0], dcht);
                    if (chrt === null && expire_regime) {
                        chrt = new Array();
                        let dcr = DecreeChangeReferent._new1100(DecreeChangeKind.EXPIRE);
                        chrt.push(new ReferentToken(dcr, dcht.begin_token, dcht.end_token));
                    }
                }
                else if (dcht.act_kind === DecreeChangeKind.APPEND) {
                    let ee = false;
                    if (dcht.part_typ !== PartTokenItemType.UNDEFINED) {
                        for (const ss of change_stack) {
                            if (ss instanceof DecreePartReferent) {
                                if ((ss).is_all_items_over_this_level(dcht.part_typ)) {
                                    ee = true;
                                    chrt = DecreeChangeToken.attach_referents(ss, dcht);
                                    break;
                                }
                            }
                            else if (ss instanceof DecreeReferent) {
                                ee = true;
                                chrt = DecreeChangeToken.attach_referents(ss, dcht);
                                break;
                            }
                        }
                    }
                    if (last_change !== null && !ee && last_change.owners.length > 0) 
                        chrt = DecreeChangeToken.attach_referents(last_change.owners[0], dcht);
                }
                if (dprs === null && ((dcht.has_name || dcht.typ === DecreeChangeTokenTyp.VALUE || dcht.change_val !== null)) && change_stack.length > 0) 
                    chrt = DecreeChangeToken.attach_referents(change_stack[0], dcht);
                if ((chrt === null && ((expire_regime || dcht.act_kind === DecreeChangeKind.EXPIRE)) && dcht.decree !== null) && dprs === null) {
                    chrt = new Array();
                    let dcr = DecreeChangeReferent._new1100(DecreeChangeKind.EXPIRE);
                    dcr.add_slot(DecreeChangeReferent.ATTR_OWNER, dcht.decree, false, 0);
                    chrt.push(new ReferentToken(dcr, dcht.begin_token, dcht.end_token));
                    for (let tt = dcht.end_token.next; tt !== null; tt = tt.next) {
                        if (tt.next === null) 
                            break;
                        if (tt.is_char('(')) {
                            let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                            if (br !== null) {
                                tt = br.end_token;
                                chrt[chrt.length - 1].end_token = tt;
                                continue;
                            }
                        }
                        if (!tt.is_comma_and && !tt.is_char(';')) 
                            break;
                        tt = tt.next;
                        if (tt.get_referent() instanceof DecreeReferent) {
                            dcr = DecreeChangeReferent._new1100(DecreeChangeKind.EXPIRE);
                            dcr.add_slot(DecreeChangeReferent.ATTR_OWNER, tt.get_referent(), false, 0);
                            let rt = new ReferentToken(dcr, tt, tt);
                            if (tt.next !== null && tt.next.is_char('(')) {
                                let br = BracketHelper.try_parse(tt.next, BracketParseAttr.NO, 100);
                                if (br !== null) 
                                    rt.end_token = (tt = br.end_token);
                            }
                            chrt.push(rt);
                            continue;
                        }
                        break;
                    }
                }
                if (chrt !== null) {
                    for (const rt of chrt) {
                        rt.referent = ad.register_referent(rt.referent);
                        if (rt.referent instanceof DecreeChangeReferent) {
                            last_change = Utils.as(rt.referent, DecreeChangeReferent);
                            if (dprs !== null) {
                                let ii = 0;
                                for (ii = 0; ii < (dprs.length - 1); ii++) {
                                    last_change.add_slot(DecreeChangeReferent.ATTR_OWNER, dprs[ii], false, 0);
                                }
                                if (diaps !== null) {
                                    for (const kp of diaps.entries) {
                                        let diap = PartToken.try_create_between(kp.key, kp.value);
                                        if (diap !== null) {
                                            for (const d of diap) {
                                                let dd = ad.register_referent(d);
                                                last_change.add_slot(DecreeChangeReferent.ATTR_OWNER, dd, false, 0);
                                            }
                                        }
                                    }
                                }
                                for (; ii < dprs.length; ii++) {
                                    last_change.add_slot(DecreeChangeReferent.ATTR_OWNER, dprs[ii], false, 0);
                                }
                            }
                        }
                        if (begs !== null && begs.containsKey(rt.begin_char)) 
                            rt.begin_token = begs.get(rt.begin_char);
                        if (ends !== null && ends.containsKey(rt.end_char)) 
                            rt.end_token = ends.get(rt.end_char);
                        if (root_change !== null && (rt.referent instanceof DecreeChangeReferent)) 
                            root_change.add_slot(DecreeChangeReferent.ATTR_CHILD, rt.referent, false, 0);
                        kit.embed_token(rt);
                        t = rt;
                        if (begs === null) 
                            begs = new Hashtable();
                        if (!begs.containsKey(t.begin_char)) 
                            begs.put(t.begin_char, t);
                        else 
                            begs.put(t.begin_char, t);
                        if (ends === null) 
                            ends = new Hashtable();
                        if (!ends.containsKey(t.end_char)) 
                            ends.put(t.end_char, t);
                        else 
                            ends.put(t.end_char, t);
                    }
                }
            }
        }
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (t.tag !== null && (t instanceof ReferentToken) && (t.tag instanceof DecreeReferent)) {
                t = kit.debed_token(t);
                if (t === null) 
                    break;
            }
        }
    }
    
    static _check_alias_after(t) {
        if ((t !== null && t.is_char('<') && t.next !== null) && t.next.next !== null && t.next.next.is_char('>')) 
            t = t.next.next.next;
        if (t === null || t.next === null || !t.is_char('(')) 
            return null;
        t = t.next;
        if (t.is_value("ДАЛЕЕ", "ДАЛІ")) {
        }
        else 
            return null;
        t = t.next;
        if (t !== null && !t.chars.is_letter) 
            t = t.next;
        if (t === null) 
            return null;
        let t1 = null;
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt.is_newline_before) 
                break;
            else if (tt.is_char(')')) {
                t1 = tt.previous;
                break;
            }
        }
        if (t1 === null) 
            return null;
        return new MetaToken(t, t1.next);
    }
    
    static try_attach_approved(t, ad) {
        const DecreeToken = require("./internal/DecreeToken");
        if (t === null) 
            return null;
        let br = null;
        if (BracketHelper.can_be_start_of_sequence(t, true, false)) 
            br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
        else if ((t.previous instanceof TextToken) && t.previous.length_char === 1 && BracketHelper.can_be_start_of_sequence(t.previous, true, false)) 
            br = BracketHelper.try_parse(t.previous, BracketParseAttr.NO, 100);
        if (br !== null && br.length_char > 20) {
            let rt0 = DecreeAnalyzer._try_attach_approved(br.end_token.next, ad, false);
            if (rt0 !== null) {
                let dr = Utils.as(rt0.referent, DecreeReferent);
                rt0.begin_token = br.begin_token;
                let nam = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.KEEPREGISTER);
                if (dr.typ === null) {
                    let dt = DecreeToken.try_attach(br.begin_token.next, null, false);
                    if (dt !== null && dt.typ === DecreeTokenItemType.TYP) {
                        dr.typ = dt.value;
                        if (dt.end_token.next !== null && dt.end_token.next.is_value("О", null)) 
                            nam = MiscHelper.get_text_value(dt.end_token.next, br.end_token, GetTextAttr.KEEPREGISTER);
                    }
                }
                if (nam !== null) 
                    dr.add_name_str(nam);
                return rt0;
            }
        }
        if (!t.chars.is_cyrillic_letter || t.chars.is_all_lower) 
            return null;
        let tt = DecreeToken.is_keyword(t, false);
        if (tt === null || tt.next === null) 
            return null;
        let cou = 0;
        let alias = null;
        let aliast0 = null;
        for (tt = tt.next; tt !== null; tt = tt.next) {
            if ((++cou) > 100) 
                break;
            if (tt.is_newline_before) {
                if (tt.is_value("ИСТОЧНИК", null)) 
                    break;
            }
            if ((((tt instanceof NumberToken) && (tt).value === "1")) || tt.is_value("ДРУГОЙ", null)) {
                if (tt.next !== null && tt.next.is_value("СТОРОНА", null)) 
                    return null;
            }
            if (tt.whitespaces_before_count > 15) 
                break;
            if (tt.is_char('(')) {
                let mt = DecreeAnalyzer._check_alias_after(tt);
                if (mt !== null) {
                    aliast0 = tt;
                    alias = mt;
                    tt = mt.end_token;
                    continue;
                }
            }
            if (DecreeToken.is_keyword(tt, false) !== null && tt.chars.is_capital_upper) 
                break;
            let rt0 = DecreeAnalyzer._try_attach_approved(tt, ad, true);
            if (rt0 !== null) {
                let t1 = tt.previous;
                if (aliast0 !== null) 
                    t1 = aliast0.previous;
                let nam = MiscHelper.get_text_value(t, t1, GetTextAttr.of((GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()) | (GetTextAttr.KEEPREGISTER.value())));
                let dt = DecreeToken.try_attach(t, null, false);
                if (dt !== null && dt.typ === DecreeTokenItemType.TYP && (rt0.referent).typ === null) {
                    (rt0.referent).typ = dt.value;
                    if (dt.end_token.next !== null && dt.end_token.next.is_value("О", "ПРО")) 
                        nam = MiscHelper.get_text_value(dt.end_token.next, t1, GetTextAttr.KEEPREGISTER);
                }
                let dec = Utils.as(rt0.referent, DecreeReferent);
                if (nam !== null) 
                    dec.add_name_str(nam);
                rt0.begin_token = t;
                rt0.tag = alias;
                if (dec.find_slot(DecreeReferent.ATTR_SOURCE, null, true) === null) {
                    if (t.previous !== null && t.previous.is_value("В", null) && (t.previous.previous instanceof ReferentToken)) {
                        if (t.previous.previous.get_referent() instanceof OrganizationReferent) 
                            dec.add_slot(DecreeReferent.ATTR_SOURCE, t.previous.previous.get_referent(), false, 0);
                    }
                }
                return rt0;
            }
            if (tt.is_char('.')) 
                break;
            if (tt.is_newline_before && tt.previous !== null && tt.previous.is_char('.')) 
                break;
        }
        return null;
    }
    
    static _try_attach_approved(t, ad, must_be_comma = true) {
        const DecreeToken = require("./internal/DecreeToken");
        if (t === null || t.next === null) 
            return null;
        let t0 = t;
        if (!t.is_char_of("(,")) {
            if (must_be_comma) 
                return null;
        }
        else 
            t = t.next;
        let ok = false;
        for (; t !== null; t = t.next) {
            if (t.is_comma_and || t.morph.class0.is_preposition) 
                continue;
            if ((t.get_referent() instanceof GeoReferent) && (t.get_referent()).is_city) 
                continue;
            if ((((((((t.is_value("УТВ", null) || t.is_value("УТВЕРЖДАТЬ", "СТВЕРДЖУВАТИ") || t.is_value("УТВЕРДИТЬ", "ЗАТВЕРДИТИ")) || t.is_value("УТВЕРЖДЕННЫЙ", "ЗАТВЕРДЖЕНИЙ") || t.is_value("ЗАТВЕРДЖУВАТИ", null)) || t.is_value("СТВЕРДИТИ", null) || t.is_value("ЗАТВЕРДИТИ", null)) || t.is_value("ПРИНЯТЬ", "ПРИЙНЯТИ") || t.is_value("ПРИНЯТЫЙ", "ПРИЙНЯТИЙ")) || t.is_value("ВВОДИТЬ", "ВВОДИТИ") || t.is_value("ВВЕСТИ", null)) || t.is_value("ВВЕДЕННЫЙ", "ВВЕДЕНИЙ") || t.is_value("ПОДПИСАТЬ", "ПІДПИСАТИ")) || t.is_value("ПОДПИСЫВАТЬ", "ПІДПИСУВАТИ") || t.is_value("ЗАКЛЮЧИТЬ", "УКЛАСТИ")) || t.is_value("ЗАКЛЮЧАТЬ", "УКЛАДАТИ")) {
                ok = true;
                if (t.next !== null && t.next.is_char('.')) 
                    t = t.next;
            }
            else if (t.is_value("ДЕЙСТВИЕ", null) || t.is_value("ДІЯ", null)) {
            }
            else 
                break;
        }
        if (!ok) 
            return null;
        if (t === null) 
            return null;
        let kit = t.kit;
        let olev = null;
        let lev = 0;
        let wrapolev1104 = new RefOutArgWrapper();
        let inoutres1105 = kit.misc_data.tryGetValue("dovr", wrapolev1104);
        olev = wrapolev1104.value;
        if (!inoutres1105) 
            kit.misc_data.put("dovr", (lev = 1));
        else {
            lev = olev;
            if (lev > 2) 
                return null;
            lev++;
            kit.misc_data.put("dovr", lev);
        }
        try {
            let dts = DecreeToken.try_attach_list(t, null, 10, false);
            if (dts === null) 
                return null;
            let rt = DecreeAnalyzer.try_attach(dts, null, ad);
            if (rt === null) {
                let has_date = 0;
                let has_num = 0;
                let has_own = 0;
                let has_typ = 0;
                let ii = 0;
                for (ii = 0; ii < dts.length; ii++) {
                    if (dts[ii].typ === DecreeTokenItemType.NUMBER) 
                        has_num++;
                    else if ((dts[ii].typ === DecreeTokenItemType.DATE && dts[ii].ref !== null && (dts[ii].ref.referent instanceof DateReferent)) && (dts[ii].ref.referent).dt !== null) 
                        has_date++;
                    else if (dts[ii].typ === DecreeTokenItemType.OWNER || dts[ii].typ === DecreeTokenItemType.ORG) 
                        has_own++;
                    else if (dts[ii].typ === DecreeTokenItemType.TYP) 
                        has_typ++;
                    else 
                        break;
                }
                if (ii >= dts.length && has_own > 0 && ((has_date === 1 || has_num === 1))) {
                    let dr = new DecreeReferent();
                    for (const dt of dts) {
                        if (dt.typ === DecreeTokenItemType.DATE) 
                            dr.add_date(dt);
                        else if (dt.typ === DecreeTokenItemType.NUMBER) 
                            dr.add_number(dt);
                        else if (dt.typ === DecreeTokenItemType.TYP) 
                            dr.add_slot(DecreeReferent.ATTR_TYPE, dt.value, false, 0);
                        else {
                            let val = dt.value;
                            if (dt.ref !== null && dt.ref.referent !== null) 
                                val = dt.ref.referent;
                            dr.add_slot(DecreeReferent.ATTR_SOURCE, val, false, 0).tag = dt.get_source_text();
                            if (dt.ref !== null && (dt.ref.referent instanceof PersonPropertyReferent)) 
                                dr.add_ext_referent(dt.ref);
                        }
                    }
                    rt = new Array();
                    rt.push(new ReferentToken(dr, dts[0].begin_token, dts[dts.length - 1].end_token));
                }
            }
            if (((rt === null && dts.length === 1 && dts[0].typ === DecreeTokenItemType.DATE) && dts[0].ref !== null && (dts[0].ref.referent instanceof DateReferent)) && (dts[0].ref.referent).dt !== null) {
                let dr = new DecreeReferent();
                dr.add_date(dts[0]);
                rt = new Array();
                rt.push(new ReferentToken(dr, dts[0].begin_token, dts[dts.length - 1].end_token));
            }
            if (rt === null) 
                return null;
            if (t0.is_char('(') && rt[0].end_token.next !== null && rt[0].end_token.next.is_char(')')) 
                rt[0].end_token = rt[0].end_token.next;
            rt[0].begin_token = t0;
            return rt[0];
        } finally {
            lev--;
            if (lev < 0) 
                lev = 0;
            kit.misc_data.put("dovr", lev);
        }
    }
    
    static _get_decree(t) {
        if (!((t instanceof ReferentToken))) 
            return null;
        let r = t.get_referent();
        if (r instanceof DecreeReferent) 
            return Utils.as(r, DecreeReferent);
        if (r instanceof DecreePartReferent) 
            return (r).owner;
        return null;
    }
    
    static _check_other_typ(t, first) {
        const DecreeToken = require("./internal/DecreeToken");
        if (t === null) 
            return null;
        let dit = DecreeToken.try_attach(t, null, false);
        let npt = null;
        if (dit === null) {
            npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.begin_token !== npt.end_token) 
                dit = DecreeToken.try_attach(npt.end_token, null, false);
        }
        if (dit !== null && dit.typ === DecreeTokenItemType.TYP) {
            if (dit.chars.is_capital_upper || first) {
                dit.end_token.tag = dit.value;
                return dit.end_token;
            }
            else 
                return null;
        }
        if (npt !== null) 
            t = npt.end_token;
        if (t.chars.is_capital_upper || first) {
            if (t.previous !== null && t.previous.is_char('.') && !first) 
                return null;
            let tt = DecreeToken.is_keyword(t, false);
            if (tt !== null) 
                return tt;
        }
        return null;
    }
    
    try_attach_pulishers(dts) {
        const PartToken = require("./internal/PartToken");
        const DecreeToken = require("./internal/DecreeToken");
        let i = 0;
        let t1 = null;
        let typ = null;
        let geo = null;
        let org = null;
        let _date = null;
        for (i = 0; i < dts.length; i++) {
            if (dts[i].typ === DecreeTokenItemType.TYP && DecreeToken.get_kind(dts[i].value) === DecreeKind.PUBLISHER) {
                typ = dts[i].value;
                if (dts[i].ref !== null && (dts[i].ref.get_referent() instanceof GeoReferent)) 
                    geo = dts[i].ref;
            }
            else if (dts[i].typ === DecreeTokenItemType.TERR) {
                geo = dts[i].ref;
                t1 = dts[i].end_token;
            }
            else if (dts[i].typ === DecreeTokenItemType.DATE) {
                _date = dts[i];
                t1 = dts[i].end_token;
            }
            else if (dts[i].typ === DecreeTokenItemType.ORG) {
                org = dts[i].ref;
                t1 = dts[i].end_token;
            }
            else 
                break;
        }
        if (typ === null) 
            return null;
        let t = dts[i - 1].end_token.next;
        if (t === null) 
            return null;
        let res = new Array();
        let num = null;
        let t0 = dts[0].begin_token;
        if (BracketHelper.can_be_end_of_sequence(t, false, null, false)) {
            t = t.next;
            if (BracketHelper.can_be_start_of_sequence(t0.previous, false, false)) 
                t0 = t0.previous;
        }
        let pub0 = null;
        let pub_part0 = null;
        for (; t !== null; t = t.next) {
            if (t.is_char_of(",;.") || t.is_and) 
                continue;
            let dt = DecreeToken.try_attach(t, dts[0], false);
            if (dt !== null) {
                if (dt.typ === DecreeTokenItemType.NUMBER) {
                    num = dt;
                    pub0 = null;
                    pub_part0 = null;
                    if (t0 === null) 
                        t0 = t;
                    t1 = (t = dt.end_token);
                    continue;
                }
                if (dt.typ === DecreeTokenItemType.DATE) {
                    if (t0 === null) 
                        t0 = t;
                    _date = dt;
                    pub0 = null;
                    pub_part0 = null;
                    t1 = (t = dt.end_token);
                    continue;
                }
                if (dt.typ !== DecreeTokenItemType.MISC && t.length_char > 2) 
                    break;
            }
            let pt = PartToken.try_attach(t, null, false, false);
            if (pt === null && t.is_char('(')) {
                pt = PartToken.try_attach(t.next, null, false, false);
                if (pt !== null) {
                    if (pt.end_token.next !== null && pt.end_token.next.is_char(')')) 
                        pt.end_token = pt.end_token.next;
                    else 
                        pt = null;
                }
            }
            if (pt !== null) {
                if (pt.typ === PartTokenItemType.PAGE) {
                    t = pt.end_token;
                    continue;
                }
                if (pt.typ !== PartTokenItemType.CLAUSE && pt.typ !== PartTokenItemType.PART && pt.typ !== PartTokenItemType.PAGE) 
                    break;
                if (num === null) 
                    break;
                if (pub_part0 !== null) {
                    if (pt.typ === PartTokenItemType.PART && pub_part0.part === null) {
                    }
                    else if (pt.typ === PartTokenItemType.CLAUSE && pub_part0.clause === null) {
                    }
                    else 
                        pub_part0 = null;
                }
                let pub = pub0;
                let pub_part = pub_part0;
                if (pub === null) {
                    pub = new DecreeReferent();
                    pub.typ = typ;
                    if (geo !== null) 
                        pub.add_slot(DecreeReferent.ATTR_GEO, geo.referent, false, 0);
                    if (org !== null) 
                        pub.add_slot(DecreeReferent.ATTR_SOURCE, org.referent, false, 0).tag = org.get_source_text();
                    if (_date !== null) 
                        pub.add_date(_date);
                    pub.add_number(num);
                    res.push(new ReferentToken(pub, (t0 != null ? t0 : t), pt.begin_token.previous));
                }
                if (pub_part === null) {
                    pub_part = DecreePartReferent._new1106(pub);
                    res.push(new ReferentToken(pub_part, pt.begin_token, pt.end_token));
                }
                pub0 = pub;
                if (pt.values.length === 1) {
                    if (pt.typ === PartTokenItemType.CLAUSE) 
                        pub_part.add_slot(DecreePartReferent.ATTR_CLAUSE, pt.values[0].value, false, 0).tag = pt.values[0].source_value;
                    else if (pt.typ === PartTokenItemType.PART) 
                        pub_part.add_slot(DecreePartReferent.ATTR_PART, pt.values[0].value, false, 0).tag = pt.values[0].source_value;
                }
                else if (pt.values.length > 1) {
                    for (let ii = 0; ii < pt.values.length; ii++) {
                        if (ii > 0) {
                            pub_part = DecreePartReferent._new1106(pub);
                            res.push(new ReferentToken(pub_part, pt.values[ii].begin_token, pt.values[ii].end_token));
                        }
                        else 
                            res[res.length - 1].end_token = pt.values[ii].end_token;
                        if (pt.typ === PartTokenItemType.CLAUSE) 
                            pub_part.add_slot(DecreePartReferent.ATTR_CLAUSE, pt.values[ii].value, false, 0).tag = pt.values[ii].source_value;
                        else if (pt.typ === PartTokenItemType.PART) 
                            pub_part.add_slot(DecreePartReferent.ATTR_PART, pt.values[ii].value, false, 0).tag = pt.values[ii].source_value;
                    }
                }
                if (pub_part.clause === "6878") {
                }
                pub_part0 = pub_part;
                res[res.length - 1].end_token = pt.end_token;
                t0 = null;
                t = pt.end_token;
                continue;
            }
            if (t instanceof NumberToken) {
                let rt = t.kit.process_referent("DATE", t);
                if (rt !== null) {
                    _date = DecreeToken._new840(rt.begin_token, rt.end_token, DecreeTokenItemType.DATE);
                    _date.ref = rt;
                    pub0 = null;
                    pub_part0 = null;
                    if (t0 === null) 
                        t0 = t;
                    t1 = (t = rt.end_token);
                    continue;
                }
                if (t.next !== null && t.next.is_char(';')) {
                    if (pub_part0 !== null && pub_part0.clause !== null && pub0 !== null) {
                        let pub_part = new DecreePartReferent();
                        for (const s of pub_part0.slots) {
                            pub_part.add_slot(s.type_name, s.value, false, 0);
                        }
                        pub_part0 = pub_part;
                        pub_part0.clause = (t).value.toString();
                        res.push(new ReferentToken(pub_part0, t, t));
                        continue;
                    }
                }
            }
            if (((t instanceof TextToken) && t.chars.is_letter && (t.length_char < 3)) && (t.next instanceof NumberToken)) {
                t = t.next;
                continue;
            }
            if ((t.is_char('(') && t.next !== null && t.next.next !== null) && t.next.next.is_char(')')) {
                t = t.next.next;
                continue;
            }
            break;
        }
        if ((res.length === 0 && _date !== null && num !== null) && t1 !== null) {
            let pub = new DecreeReferent();
            pub.typ = typ;
            if (geo !== null) 
                pub.add_slot(DecreeReferent.ATTR_GEO, geo.referent, false, 0);
            if (org !== null) 
                pub.add_slot(DecreeReferent.ATTR_SOURCE, org.referent, false, 0).tag = org.get_source_text();
            if (_date !== null) 
                pub.add_date(_date);
            pub.add_number(num);
            res.push(new ReferentToken(pub, t0, t1));
        }
        return res;
    }
    
    process_referent(begin, end) {
        const DecreeToken = require("./internal/DecreeToken");
        let dp = DecreeToken.try_attach(begin, null, false);
        if (dp !== null && dp.typ === DecreeTokenItemType.TYP) 
            return new ReferentToken(null, dp.begin_token, dp.end_token);
        return null;
    }
    
    static initialize() {
        const DecreeToken = require("./internal/DecreeToken");
        const DecreeChangeToken = require("./internal/DecreeChangeToken");
        if (DecreeAnalyzer.m_inited) 
            return;
        DecreeAnalyzer.m_inited = true;
        MetaDecree.initialize();
        MetaDecreePart.initialize();
        MetaDecreeChange.initialize();
        MetaDecreeChangeValue.initialize();
        try {
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
            DecreeChangeToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            DecreeToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        } catch (ex) {
            throw new Error(ex.message);
        }
        ProcessorService.register_analyzer(new DecreeAnalyzer());
    }
    
    static static_constructor() {
        DecreeAnalyzer.ANALYZER_NAME = "DECREE";
        DecreeAnalyzer.m_inited = false;
    }
}


DecreeAnalyzer.ThisDecree = class  extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = null;
        this.has_this_ref = false;
        this.has_other_ref = false;
        this.real = null;
    }
    
    toString() {
        return (((this.typ != null ? this.typ : "?")) + " (" + (this.has_this_ref ? "This" : ((this.has_other_ref ? "Other" : "?"))) + ")");
    }
    
    static try_attach_back(t, base_typ) {
        const TextToken = require("./../TextToken");
        const DecreeToken = require("./internal/DecreeToken");
        if (t === null) 
            return null;
        let ukaz = null;
        for (let tt = t; tt !== null; tt = tt.previous) {
            if (tt.is_char_of(",") || tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction) 
                continue;
            if ((((((tt.is_value("ОПРЕДЕЛЕННЫЙ", "ПЕВНИЙ") || tt.is_value("ЗАДАННЫЙ", "ЗАДАНИЙ") || tt.is_value("ПРЕДУСМОТРЕННЫЙ", "ПЕРЕДБАЧЕНИЙ")) || tt.is_value("УКАЗАННЫЙ", "ЗАЗНАЧЕНИЙ") || tt.is_value("ПЕРЕЧИСЛЕННЫЙ", "ПЕРЕРАХОВАНИЙ")) || tt.is_value("ОПРЕДЕЛИТЬ", "ВИЗНАЧИТИ") || tt.is_value("ОПРЕДЕЛЯТЬ", null)) || tt.is_value("ЗАДАВАТЬ", "ЗАДАВАТИ") || tt.is_value("ПРЕДУСМАТРИВАТЬ", "ПЕРЕДБАЧАТИ")) || tt.is_value("УКАЗЫВАТЬ", "ВКАЗУВАТИ") || tt.is_value("УКАЗАТЬ", "ВКАЗАТИ")) || tt.is_value("СИЛА", "ЧИННІСТЬ")) {
                ukaz = tt;
                continue;
            }
            if (tt === t) 
                continue;
            let ttt = DecreeToken.is_keyword(tt, false);
            if (tt !== ttt || !((tt instanceof TextToken))) 
                break;
            if (ttt.is_value("УСЛОВИЕ", null)) 
                continue;
            if (ttt.is_value("ПОРЯДОК", null) && ukaz !== null) 
                return null;
            let res = new DecreeAnalyzer.ThisDecree(tt, tt);
            res.typ = (tt).get_lemma();
            t = tt.previous;
            if (t !== null && ((t.morph.class0.is_adjective || t.morph.class0.is_pronoun))) {
                if (t.is_value("НАСТОЯЩИЙ", "СПРАВЖНІЙ") || t.is_value("ТЕКУЩИЙ", "ПОТОЧНИЙ") || t.is_value("ДАННЫЙ", "ДАНИЙ")) {
                    res.has_this_ref = true;
                    res.begin_token = t;
                }
                else if ((t.is_value("ЭТОТ", "ЦЕЙ") || t.is_value("ВЫШЕУКАЗАННЫЙ", "ВИЩЕВКАЗАНИЙ") || t.is_value("УКАЗАННЫЙ", "ЗАЗНАЧЕНИЙ")) || t.is_value("НАЗВАННЫЙ", "НАЗВАНИЙ")) {
                    res.has_other_ref = true;
                    res.begin_token = t;
                }
            }
            if (!res.has_this_ref && tt.is_newline_after) 
                return null;
            if (base_typ !== null && base_typ.value === res.typ) 
                res.has_this_ref = true;
            return res;
        }
        if (ukaz !== null) {
            if (base_typ !== null && base_typ.value !== null && ((base_typ.value.includes("ДОГОВОР") || base_typ.value.includes("ДОГОВІР")))) 
                return DecreeAnalyzer.ThisDecree._new1097(ukaz, ukaz, true, base_typ.value);
        }
        return null;
    }
    
    static try_attach(dtok, base_typ) {
        const NounPhraseParseAttr = require("./../core/NounPhraseParseAttr");
        const NounPhraseHelper = require("./../core/NounPhraseHelper");
        const DecreeReferent = require("./DecreeReferent");
        const MorphGender = require("./../../morph/MorphGender");
        const ReferentToken = require("./../ReferentToken");
        const DecreeTokenItemType = require("./internal/DecreeTokenItemType");
        const TextToken = require("./../TextToken");
        const BracketHelper = require("./../core/BracketHelper");
        const DecreeToken = require("./internal/DecreeToken");
        let t = dtok.end_token.next;
        if (t === null) 
            return null;
        if (t.is_newline_before) {
            if (t.chars.is_cyrillic_letter && t.chars.is_all_lower) {
            }
            else 
                return null;
        }
        let t0 = t;
        if (t.is_char('.') && t.next !== null && !t.is_newline_after) {
            if (dtok.is_newline_before) 
                return null;
            t = t.next;
        }
        if (t.is_value("К", null) && t.next !== null) 
            t = t.next;
        if (t !== null && (t.get_referent() instanceof DecreeReferent)) 
            return null;
        let tt = DecreeToken.is_keyword(t, false);
        let br = false;
        if (tt === null && BracketHelper.can_be_start_of_sequence(t, true, false)) {
            tt = DecreeToken.is_keyword(t.next, false);
            if ((tt instanceof TextToken) && BracketHelper.can_be_end_of_sequence(tt.next, false, null, false)) 
                br = true;
        }
        if (!((tt instanceof TextToken))) {
            if ((tt instanceof ReferentToken) && (tt.get_referent() instanceof DecreeReferent)) 
                return DecreeAnalyzer.ThisDecree._new1098(t, tt, Utils.as(tt.get_referent(), DecreeReferent));
            return null;
        }
        if (tt.chars.is_all_lower) {
            if (DecreeToken.is_keyword(tt, true) !== null) {
                if (tt !== t && t.chars.is_capital_upper) {
                }
                else 
                    return null;
            }
        }
        if (!((t instanceof TextToken))) 
            return null;
        let res = new DecreeAnalyzer.ThisDecree(t0, (br ? tt.next : tt));
        res.typ = (tt).get_lemma();
        if (tt.previous instanceof TextToken) {
            let tt1 = tt.previous;
            let mc = tt1.get_morph_class_in_dictionary();
            if (mc.is_adjective && !mc.is_verb && !tt1.is_value("НАСТОЯЩИЙ", "СПРАВЖНІЙ")) {
                let nnn = NounPhraseHelper.try_parse(tt1, NounPhraseParseAttr.NO, 0, null);
                if (nnn !== null) 
                    res.typ = nnn.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                if (tt1.previous instanceof TextToken) {
                    tt1 = tt1.previous;
                    mc = tt1.get_morph_class_in_dictionary();
                    if (mc.is_adjective && !mc.is_verb && !tt1.is_value("НАСТОЯЩИЙ", "СПРАВЖНІЙ")) {
                        nnn = NounPhraseHelper.try_parse(tt1, NounPhraseParseAttr.NO, 0, null);
                        if (nnn !== null) 
                            res.typ = nnn.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                    }
                }
            }
        }
        if (tt.is_char('.') && (tt.previous instanceof TextToken)) 
            res.typ = (tt.previous).get_lemma();
        if (t.morph.class0.is_adjective || t.morph.class0.is_pronoun) {
            if (t.is_value("НАСТОЯЩИЙ", "СПРАВЖНІЙ") || t.is_value("ТЕКУЩИЙ", "ПОТОЧНИЙ") || t.is_value("ДАННЫЙ", "ДАНИЙ")) 
                res.has_this_ref = true;
            else if ((t.is_value("ЭТОТ", "ЦЕЙ") || t.is_value("ВЫШЕУКАЗАННЫЙ", "ВИЩЕВКАЗАНИЙ") || t.is_value("УКАЗАННЫЙ", "ЗАЗНАЧЕНИЙ")) || t.is_value("НАЗВАННЫЙ", "НАЗВАНИЙ")) 
                res.has_other_ref = true;
        }
        if (!tt.is_newline_after && !res.has_this_ref) {
            let dt = DecreeToken.try_attach(tt.next, null, false);
            if (dt !== null && dt.typ !== DecreeTokenItemType.MISC) 
                return null;
            if (DecreeToken.try_attach_name(tt.next, res.typ, false, false) !== null) 
                return null;
        }
        if (base_typ !== null && base_typ.value === res.typ) 
            res.has_this_ref = true;
        return res;
    }
    
    static _new1097(_arg1, _arg2, _arg3, _arg4) {
        let res = new DecreeAnalyzer.ThisDecree(_arg1, _arg2);
        res.has_this_ref = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new1098(_arg1, _arg2, _arg3) {
        let res = new DecreeAnalyzer.ThisDecree(_arg1, _arg2);
        res.real = _arg3;
        return res;
    }
}


DecreeAnalyzer.static_constructor();

module.exports = DecreeAnalyzer