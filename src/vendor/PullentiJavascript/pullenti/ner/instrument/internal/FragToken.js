/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const TableHelper = require("./../../core/internal/TableHelper");
const OrganizationKind = require("./../../org/OrganizationKind");
const MorphClass = require("./../../../morph/MorphClass");
const DecreeChangeValueKind = require("./../../decree/DecreeChangeValueKind");
const CharsInfo = require("./../../../morph/CharsInfo");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const InstrumentParticipant = require("./../InstrumentParticipant");
const Token = require("./../../Token");
const ParticipantTokenKinds = require("./ParticipantTokenKinds");
const BankDataReferent = require("./../../bank/BankDataReferent");
const PersonIdentityReferent = require("./../../person/PersonIdentityReferent");
const UriReferent = require("./../../uri/UriReferent");
const GeoReferent = require("./../../geo/GeoReferent");
const DecreeChangeValueReferent = require("./../../decree/DecreeChangeValueReferent");
const Morphology = require("./../../../morph/Morphology");
const PartTokenItemType = require("./../../decree/internal/PartTokenItemType");
const TextToken = require("./../../TextToken");
const NumberSpellingType = require("./../../NumberSpellingType");
const MiscHelper = require("./../../core/MiscHelper");
const MailLineTypes = require("./../../mail/internal/MailLineTypes");
const OrgItemTypeToken = require("./../../org/internal/OrgItemTypeToken");
const BlkTyps = require("./../../core/internal/BlkTyps");
const BlockTitleToken = require("./../../core/internal/BlockTitleToken");
const DecreeChangeKind = require("./../../decree/DecreeChangeKind");
const Referent = require("./../../Referent");
const InstrToken1StdTitleType = require("./InstrToken1StdTitleType");
const MailLine = require("./../../mail/internal/MailLine");
const InstrToken1Types = require("./InstrToken1Types");
const InstrumentArtefact = require("./../InstrumentArtefact");
const MoneyReferent = require("./../../money/MoneyReferent");
const OrganizationReferent = require("./../../org/OrganizationReferent");
const InstrumentAnalyzer = require("./../InstrumentAnalyzer");
const ParticipantToken = require("./ParticipantToken");
const GetTextAttr = require("./../../core/GetTextAttr");
const DateReferent = require("./../../date/DateReferent");
const ReferentToken = require("./../../ReferentToken");
const MetaToken = require("./../../MetaToken");
const DecreeKind = require("./../../decree/DecreeKind");
const DecreeChangeReferent = require("./../../decree/DecreeChangeReferent");
const NumberToken = require("./../../NumberToken");
const NumberTypes = require("./NumberTypes");
const InstrumentKind = require("./../InstrumentKind");
const DecreeTokenItemType = require("./../../decree/internal/DecreeTokenItemType");
const PhoneReferent = require("./../../phone/PhoneReferent");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const BracketHelper = require("./../../core/BracketHelper");
const DecreeReferent = require("./../../decree/DecreeReferent");
const MorphGender = require("./../../../morph/MorphGender");
const NumberingHelper = require("./NumberingHelper");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const StreetReferent = require("./../../address/StreetReferent");
const AddressReferent = require("./../../address/AddressReferent");
const DecreePartReferent = require("./../../decree/DecreePartReferent");
const PartToken = require("./../../decree/internal/PartToken");
const DecreeToken = require("./../../decree/internal/DecreeToken");
const InstrToken1 = require("./InstrToken1");
const InstrumentReferent = require("./../InstrumentReferent");
const ILTypes = require("./ILTypes");
const PersonReferent = require("./../../person/PersonReferent");
const InstrumentBlockReferent = require("./../InstrumentBlockReferent");
const DateItemToken = require("./../../date/internal/DateItemToken");
const PersonPropertyReferent = require("./../../person/PersonPropertyReferent");

class FragToken extends MetaToken {
    
    static createtztitle(t0, doc) {
        let tz = null;
        let cou = 0;
        let t = null;
        for (t = t0; t !== null && (cou < 300); t = t.next) {
            if ((t instanceof TextToken) && t.length_char > 1) 
                cou++;
            if (!t.is_newline_before) {
                if (t.previous !== null && t.previous.is_table_control_char) {
                }
                else 
                    continue;
            }
            let dt = DecreeToken.try_attach(t, null, false);
            if (dt !== null && dt.typ === DecreeTokenItemType.TYP) {
                if (dt.value === "ТЕХНИЧЕСКОЕ ЗАДАНИЕ") 
                    tz = dt;
                break;
            }
        }
        if (tz === null) 
            return null;
        let title = FragToken._new1338(t0, tz.end_token, InstrumentKind.HEAD);
        for (t = t0; t !== null; t = t.next) {
            if (!t.is_newline_before) {
                title.end_token = t;
                continue;
            }
            if (FragToken._is_start_of_body(t, false)) 
                break;
            if (t.is_value("СОДЕРЖИМОЕ", null) || t.is_value("СОДЕРЖАНИЕ", null) || t.is_value("ОГЛАВЛЕНИЕ", null)) 
                break;
            let dt = DecreeToken.try_attach(t, null, false);
            if (dt !== null) {
                FragToken._add_title_attr(doc, title, dt);
                title.end_token = (t = dt.end_token);
                if (dt.typ !== DecreeTokenItemType.TYP) 
                    continue;
                let br = BracketHelper.try_parse(t.next, BracketParseAttr.CANBEMANYLINES, 100);
                if (br !== null && BracketHelper.is_bracket(t.next, true)) {
                    let nam = FragToken._new1360(br.begin_token, br.end_token, InstrumentKind.NAME, true);
                    title.children.push(nam);
                    title.end_token = (t = br.end_token);
                    continue;
                }
                if (t.next !== null && t.next.is_value("НА", null)) {
                    let t1 = t.next;
                    for (let tt = t1.next; tt !== null; tt = tt.next) {
                        if (tt.is_newline_before) {
                            if (MiscHelper.can_be_start_of_sentence(tt)) 
                                break;
                            if (tt.is_value("СОДЕРЖИМОЕ", null) || tt.is_value("СОДЕРЖАНИЕ", null) || tt.is_value("ОГЛАВЛЕНИЕ", null)) 
                                break;
                        }
                        let br1 = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                        if (br1 !== null) {
                            t1 = (tt = br1.end_token);
                            continue;
                        }
                        let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.PARSEPREPOSITION, 0, null);
                        if (npt !== null) 
                            tt = npt.end_token;
                        t1 = tt;
                    }
                    let nam = FragToken._new1360(t.next, t1, InstrumentKind.NAME, true);
                    title.children.push(nam);
                    title.end_token = (t = t1);
                    continue;
                }
            }
            let appr1 = FragToken._create_approved(t);
            if (appr1 !== null) {
                t = appr1.end_token;
                title.children.push(appr1);
                title.end_token = appr1.end_token;
                continue;
            }
            appr1 = FragToken._create_misc(t);
            if (appr1 !== null) {
                t = appr1.end_token;
                title.children.push(appr1);
                title.end_token = appr1.end_token;
                continue;
            }
            let eds = FragToken._create_editions(t);
            if (eds !== null) {
                title.children.push(eds);
                title.end_token = (t = eds.end_token);
                continue;
            }
        }
        return title;
    }
    
    constructor(b, e) {
        super(b, e, null);
        this.kind = InstrumentKind.UNDEFINED;
        this.kind2 = InstrumentKind.UNDEFINED;
        this.value = null;
        this.name = null;
        this.number = 0;
        this.min_number = 0;
        this.sub_number = 0;
        this.sub_number2 = 0;
        this.sub_number3 = 0;
        this.referents = null;
        this.is_expired = false;
        this.children = new Array();
        this.m_doc = null;
        this.itok = null;
        for (let t = this.end_token.next; t !== null; t = t.next) {
            if (t.is_char(String.fromCharCode(7)) || t.is_char(String.fromCharCode(0x1F))) 
                this.end_token = t;
            else 
                break;
        }
    }
    
    get number_string() {
        if (this.sub_number === 0) 
            return this.number.toString();
        let tmp = new StringBuilder();
        tmp.append(this.number).append(".").append(this.sub_number);
        if (this.sub_number2 > 0) 
            tmp.append(".").append(this.sub_number2);
        if (this.sub_number3 > 0) 
            tmp.append(".").append(this.sub_number3);
        return tmp.toString();
    }
    
    sort_children() {
        for (let k = 0; k < this.children.length; k++) {
            let ch = false;
            for (let i = 0; i < (this.children.length - 1); i++) {
                if (this.children[i].compare_to(this.children[i + 1]) > 0) {
                    ch = true;
                    let v = this.children[i];
                    this.children[i] = this.children[i + 1];
                    this.children[i + 1] = v;
                }
            }
            if (!ch) 
                break;
        }
    }
    
    find_child(_kind) {
        for (const ch of this.children) {
            if (ch.kind === _kind) 
                return ch;
        }
        return null;
    }
    
    compare_to(other) {
        if (this.begin_char < other.begin_char) 
            return -1;
        if (this.begin_char > other.begin_char) 
            return 1;
        if (this.end_char < other.end_char) 
            return -1;
        if (this.end_char > other.end_char) 
            return 1;
        return 0;
    }
    
    get min_child_number() {
        for (const ch of this.children) {
            if (ch.number > 0) {
                if (ch.number !== 1) {
                    if (ch.itok !== null && ch.itok.num_typ === NumberTypes.LETTER) 
                        return 0;
                }
                return ch.number;
            }
        }
        return 0;
    }
    
    get max_child_number() {
        let max = 0;
        for (const ch of this.children) {
            if (ch.number > max) 
                max = ch.number;
        }
        return max;
    }
    
    get def_val() {
        return false;
    }
    set def_val(_value) {
        let str = this.get_source_text();
        while (str.length > 0) {
            let last = str[str.length - 1];
            let first = str[0];
            if (((last.charCodeAt(0)) === 0x1E || (last.charCodeAt(0)) === 0x1F || (last.charCodeAt(0)) === 7) || Utils.isWhitespace(last)) 
                str = str.substring(0, 0 + str.length - 1);
            else if (((first.charCodeAt(0)) === 0x1E || (first.charCodeAt(0)) === 0x1F || (first.charCodeAt(0)) === 7) || Utils.isWhitespace(first)) 
                str = str.substring(1);
            else 
                break;
        }
        this.value = str;
        return _value;
    }
    
    get def_val2() {
        return false;
    }
    set def_val2(_value) {
        this.value = FragToken.get_restored_namemt(this, false);
        return _value;
    }
    
    static get_restored_namemt(mt, index_item = false) {
        return FragToken.get_restored_name(mt.begin_token, mt.end_token, index_item);
    }
    
    static get_restored_name(b, e, index_item = false) {
        let e0 = e;
        for (; e !== null && e.begin_char > b.end_char; e = e.previous) {
            if (e.is_char_of("*<") || e.is_table_control_char) {
            }
            else if ((e.is_char_of(">") && (e.previous instanceof NumberToken) && e.previous.previous !== null) && e.previous.previous.is_char('<')) 
                e = e.previous;
            else if (e.is_char_of(">") && e.previous.is_char('*')) {
            }
            else if ((e instanceof NumberToken) && ((e === e0 || e.next.is_table_control_char)) && index_item) {
            }
            else if (((e.is_char('.') || e.is_hiphen)) && index_item) {
            }
            else 
                break;
        }
        let b0 = b;
        for (; b !== null && b.end_char <= e.end_char; b = b.next) {
            if (b.is_table_control_char) {
            }
            else {
                b0 = b;
                break;
            }
        }
        let str = MiscHelper.get_text_value(b0, e, GetTextAttr.of((GetTextAttr.RESTOREREGISTER.value()) | (GetTextAttr.KEEPREGISTER.value()) | (GetTextAttr.KEEPQUOTES.value())));
        if (!Utils.isNullOrEmpty(str)) {
            if (Utils.isLowerCase(str[0])) 
                str = (str[0].toUpperCase() + str.substring(1));
        }
        return str;
    }
    
    toString() {
        let tmp = new StringBuilder();
        if (this.kind !== InstrumentKind.UNDEFINED) {
            tmp.append(String(this.kind)).append(":");
            if (this.kind2 !== InstrumentKind.UNDEFINED) 
                tmp.append(" (").append(String(this.kind2)).append("):");
        }
        else if (this.itok !== null) 
            tmp.append(this.itok).append(" ");
        if (this.number > 0) {
            if (this.min_number > 0) 
                tmp.append(" Num=[").append(this.min_number).append("..").append(this.number).append("]");
            else 
                tmp.append(" Num=").append(this.number);
            if (this.sub_number > 0) 
                tmp.append(".").append(this.sub_number);
            if (this.sub_number2 > 0) 
                tmp.append(".").append(this.sub_number2);
            if (this.sub_number3 > 0) 
                tmp.append(".").append(this.sub_number3);
        }
        if (this.is_expired) 
            tmp.append(" Expired");
        if (this.children.length > 0) 
            tmp.append(" ChCount=").append(this.children.length);
        if (this.name !== null) 
            tmp.append(" Nam='").append(this.name).append("'");
        if (this.value !== null) 
            tmp.append(" Val='").append(this.value.toString()).append("'");
        if (tmp.length === 0) 
            tmp.append(this.get_source_text());
        return tmp.toString();
    }
    
    create_referent(ad) {
        return this._create_referent(ad, this);
    }
    
    _create_referent(ad, bas) {
        let res = null;
        if (this.m_doc !== null) 
            res = this.m_doc;
        else {
            res = new InstrumentBlockReferent();
            res.kind = this.kind;
            res.kind2 = this.kind2;
            if (this.number > 0) 
                res.number = this.number;
            if (this.min_number > 0) 
                res.min_number = this.min_number;
            if (this.sub_number > 0) 
                res.sub_number = this.sub_number;
            if (this.sub_number2 > 0) 
                res.sub_number2 = this.sub_number2;
            if (this.sub_number3 > 0) 
                res.sub_number3 = this.sub_number3;
            if (this.is_expired) 
                res.is_expired = true;
            if (this.name !== null && this.kind !== InstrumentKind.HEAD) {
                let s = res.add_slot(InstrumentBlockReferent.ATTR_NAME, this.name.toUpperCase(), false, 0);
                s.tag = this.name;
            }
            if (this.value !== null && this.kind !== InstrumentKind.CONTACT) {
                if ((typeof this.value === 'string' || this.value instanceof String)) 
                    res.add_slot(InstrumentBlockReferent.ATTR_VALUE, this.value, false, 0);
                else if (this.value instanceof Referent) 
                    res.add_slot(InstrumentBlockReferent.ATTR_REF, this.value, false, 0);
                else if (this.value instanceof ReferentToken) {
                    let r = (this.value).referent;
                    (this.value).save_to_local_ontology();
                    res.add_slot(InstrumentBlockReferent.ATTR_REF, (this.value).referent, false, 0);
                    res.add_ext_referent(Utils.as(this.value, ReferentToken));
                    let s = bas.m_doc.find_slot(null, r, true);
                    if (s !== null) 
                        s.value = (this.value).referent;
                }
                else if (this.value instanceof DecreeToken) {
                    let dt = Utils.as(this.value, DecreeToken);
                    if (dt.ref instanceof ReferentToken) {
                        let r = (dt.ref).referent;
                        (dt.ref).save_to_local_ontology();
                        res.add_slot(InstrumentBlockReferent.ATTR_REF, (dt.ref).referent, false, 0);
                        res.add_ext_referent(Utils.as(dt.ref, ReferentToken));
                        let s = bas.m_doc.find_slot(null, r, true);
                        if (s !== null) 
                            s.value = (dt.ref).referent;
                    }
                    else if (dt.value !== null) 
                        res.add_slot(InstrumentBlockReferent.ATTR_VALUE, dt.value, false, 0);
                }
            }
            if (this.referents !== null) {
                for (const r of this.referents) {
                    res.add_slot(InstrumentBlockReferent.ATTR_REF, r, false, 0);
                }
            }
            if (this.children.length === 0) {
                for (let t = this.begin_token; t !== null && (t.begin_char < this.end_char); t = t.next) {
                    if (t.get_referent() instanceof DecreeChangeReferent) 
                        res.add_slot(InstrumentBlockReferent.ATTR_REF, t.get_referent(), false, 0);
                    if (t.end_char > this.end_char) 
                        break;
                }
            }
        }
        if (ad !== null) {
            if (ad.referents.length > 200000) 
                return null;
            ad.referents.push(res);
            res.add_occurence_of_ref_tok(new ReferentToken(res, this.begin_token, this.end_token));
        }
        for (const ch of this.children) {
            let ich = ch._create_referent(ad, bas);
            if (ich !== null) 
                res.add_slot(InstrumentBlockReferent.ATTR_CHILD, ich, false, 0);
        }
        return res;
    }
    
    fill_by_content_children() {
        this.sort_children();
        if (this.children.length === 0) {
            this.children.push(FragToken._new1338(this.begin_token, this.end_token, InstrumentKind.CONTENT));
            return;
        }
        if (this.begin_char < this.children[0].begin_char) 
            this.children.splice(0, 0, FragToken._new1338(this.begin_token, this.children[0].begin_token.previous, InstrumentKind.CONTENT));
        for (let i = 0; i < (this.children.length - 1); i++) {
            if (this.children[i].end_token.next !== this.children[i + 1].begin_token && (this.children[i].end_token.next.end_char < this.children[i + 1].begin_char)) 
                this.children.splice(i + 1, 0, FragToken._new1338(this.children[i].end_token.next, this.children[i + 1].begin_token.previous, InstrumentKind.CONTENT));
        }
        if (this.children[this.children.length - 1].end_char < this.end_char) 
            this.children.push(FragToken._new1338(this.children[this.children.length - 1].end_token.next, this.end_token, InstrumentKind.CONTENT));
    }
    
    static create_document(t, max_char, root_kind = InstrumentKind.UNDEFINED) {
        const InstrToken = require("./InstrToken");
        if (t === null) 
            return null;
        while ((t instanceof TextToken) && t.next !== null) {
            if (t.is_table_control_char || !t.chars.is_letter) 
                t = t.next;
            else 
                break;
        }
        if (t.get_referent() instanceof DecreeReferent) {
            let dec0 = Utils.as(t.get_referent(), DecreeReferent);
            if (dec0.kind === DecreeKind.PUBLISHER) 
                t = t.next;
            else 
                t = t.kit.debed_token(t);
        }
        else if (t.get_referent() instanceof DecreePartReferent) {
            let dp = Utils.as(t.get_referent(), DecreePartReferent);
            if ((dp.clause !== null || dp.item !== null || dp.sub_item !== null) || dp.indention !== null) {
            }
            else 
                t = t.kit.debed_token(t);
        }
        if (t === null) 
            return null;
        let res = FragToken.__create_action_question(t, max_char);
        if (res !== null) 
            return res;
        res = FragToken._new1338(t, t, InstrumentKind.DOCUMENT);
        res.m_doc = new InstrumentReferent();
        let is_app = false;
        let cou = 0;
        for (let ttt = t; ttt !== null && (cou < 5); ttt = ttt.next,cou++) {
            if (ttt.is_newline_before || ttt.previous.is_table_control_char) {
                if (ttt.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК")) {
                    is_app = true;
                    break;
                }
                if (ttt.get_referent() instanceof DecreeReferent) 
                    break;
                let dtt = DecreeToken.try_attach(ttt, null, false);
                if (dtt !== null && ((dtt.typ === DecreeTokenItemType.TYP || dtt.typ === DecreeTokenItemType.NUMBER || dtt.typ === DecreeTokenItemType.TERR))) 
                    break;
                if (ttt instanceof NumberToken) 
                    break;
            }
        }
        let head = (is_app || max_char > 0 ? null : FragToken.create_doc_title(t, res.m_doc));
        let head_kind = DecreeKind.UNDEFINED;
        if (head !== null && (head.tag instanceof DecreeKind)) 
            head_kind = DecreeKind.of(head.tag);
        let head1 = null;
        let app_doc = new InstrumentReferent();
        if (max_char > 0 && !is_app) {
        }
        else 
            head1 = FragToken.create_appendix_title(t, res, app_doc, true, true);
        if (head1 !== null) {
            if (head1.tag instanceof FragToken) {
                res.m_doc = app_doc;
                res.children.push(head1);
                res.children.push(Utils.as(head1.tag, FragToken));
                res.end_token = (head1.tag).end_token;
                return res;
            }
            let ee = false;
            if (head === null) 
                ee = true;
            else if (head1.end_char > head.end_char && ((res.m_doc.typ === "ПРИЛОЖЕНИЕ" || res.m_doc.typ === "ДОДАТОК"))) 
                ee = true;
            else if (head1.children.length > head.children.length) 
                ee = true;
            if (ee) {
                head = head1;
                res.m_doc = app_doc;
            }
        }
        if (head !== null) {
            if (max_char === 0) 
                FragToken._create_justice_participants(head, res.m_doc);
            head.sort_children();
            res.children.push(head);
            res.end_token = head.end_token;
            if (head.begin_char < res.begin_char) 
                res.begin_token = head.begin_token;
            t = res.end_token.next;
        }
        if (t === null) {
            if (head !== null && head.children.length > 2) 
                return res;
            return null;
        }
        let is_contract = false;
        if (res.m_doc.typ !== null) {
            if (res.m_doc.typ.includes("ДОГОВОР") || res.m_doc.typ.includes("ДОГОВІР") || res.m_doc.typ.includes("КОНТРАКТ")) 
                is_contract = true;
        }
        let t0 = t;
        let li = InstrToken.parse_list(t, max_char);
        if (li === null || li.length === 0) 
            return null;
        let i = 0;
        if (is_app) {
            for (i = 0; i < li.length; i++) {
                if (li[i].typ === ILTypes.APPROVED) 
                    li[i].typ = ILTypes.UNDEFINED;
                else if (li[i].typ === ILTypes.APPENDIX && li[i].value !== "ПРИЛОЖЕНИЕ" && li[i].value !== "ДОДАТОК") 
                    li[i].typ = ILTypes.UNDEFINED;
            }
        }
        for (i = 0; i < (li.length - 1); i++) {
            if (li[i].typ === ILTypes.APPENDIX) {
                if (i > 0 && li[i - 1].typ === ILTypes.PERSON) 
                    break;
                let num1 = InstrToken1.parse(li[i].begin_token, true, null, 0, null, false, 0, false, false);
                let max_num = i + 7;
                let i0 = i;
                for (let j = i + 1; (j < li.length) && (j < max_num); j++) {
                    if (li[j].typ === ILTypes.APPENDIX) {
                        if (li[j].value !== li[i].value) {
                            if (li[i].value === "ПРИЛОЖЕНИЕ" || li[i].value === "ДОДАТОК") 
                                li[j].typ = ILTypes.UNDEFINED;
                            else if (li[j].value === "ПРИЛОЖЕНИЕ" || li[j].value === "ДОДАТОК") {
                                li[i].typ = ILTypes.UNDEFINED;
                                break;
                            }
                        }
                        else {
                            let le = li[j].begin_char - li[i0].begin_char;
                            if (le > 400) 
                                break;
                            i = j;
                            let num2 = InstrToken1.parse(li[j].begin_token, true, null, 0, null, false, 0, false, false);
                            let d = NumberingHelper.calc_delta(num1, num2, true);
                            if (d === 1) {
                                li[i0].typ = ILTypes.UNDEFINED;
                                li[j].typ = ILTypes.UNDEFINED;
                                i0 = j;
                            }
                            num1 = num2;
                            max_num = j + 7;
                        }
                    }
                    else if (li[j].typ === ILTypes.APPROVED) 
                        li[j].typ = ILTypes.UNDEFINED;
                }
            }
        }
        let has_app = false;
        for (i = 0; i < li.length; i++) {
            if (li[i].typ === ILTypes.APPENDIX || li[i].typ === ILTypes.APPROVED) {
                if (li[i].typ === ILTypes.APPROVED) {
                    has_app = true;
                    if (i === 0 || !li[i].is_newline_after) 
                        continue;
                }
                if (li[i].ref instanceof DecreeReferent) {
                    let dr_app = Utils.as(li[i].ref, DecreeReferent);
                    if (dr_app.typ !== res.m_doc.typ) 
                        continue;
                    if (dr_app.number !== null && res.m_doc.reg_number !== null) {
                        if (dr_app.number !== res.m_doc.reg_number) 
                            continue;
                    }
                }
                break;
            }
        }
        let i1 = i;
        if (max_char === 0 && i1 === li.length) {
            for (i = 0; i < li.length; i++) {
                if (li[i].typ === ILTypes.PERSON && li[i].is_newline_before && !li[i].has_table_chars) {
                    let j = 0;
                    let dat = false;
                    let num = false;
                    let _geo = false;
                    let pers = 0;
                    for (j = i + 1; j < li.length; j++) {
                        if (li[j].typ === ILTypes.GEO) 
                            _geo = true;
                        else if (li[j].typ === ILTypes.REGNUMBER) 
                            num = true;
                        else if (li[j].typ === ILTypes.DATE) 
                            dat = true;
                        else if (li[j].typ === ILTypes.PERSON && li[j].is_pure_person) {
                            if (((li[j].is_newline_before || ((li[j - 1].typ === ILTypes.PERSON || li[j - 1].typ === ILTypes.DATE)))) && ((li[j].is_newline_after || ((((j + 1) < li.length) && ((li[j + 1].typ === ILTypes.PERSON || li[j + 1].typ === ILTypes.DATE))))))) 
                                pers++;
                            else 
                                break;
                        }
                        else 
                            break;
                    }
                    let k = pers;
                    if (dat) 
                        k++;
                    if (num) 
                        k++;
                    if (_geo) 
                        k++;
                    if ((j < li.length) && ((li[j].typ === ILTypes.APPENDIX || li[j].typ === ILTypes.APPROVED))) 
                        k += 2;
                    else if ((li[i].is_pure_person && li[i].begin_token.previous !== null && li[i].begin_token.previous.is_char('.')) && li[i].is_newline_after) {
                        let itt = InstrToken1.parse(li[i].end_token.next, true, null, 0, null, false, 0, false, false);
                        if (itt !== null && itt.numbers.length > 0 && li[i + 1].typ === ILTypes.UNDEFINED) {
                        }
                        else 
                            k += 2;
                    }
                    if (k >= 2) {
                        i = j;
                        if ((i < li.length) && ((li[i].typ === ILTypes.UNDEFINED || li[i].typ === ILTypes.TYP))) 
                            li[i].typ = ILTypes.APPROVED;
                        if ((i > (i1 + 10) && (i1 < li.length) && li[i1].typ === ILTypes.APPENDIX) && li[i1].whitespaces_before_count > 15) {
                        }
                        else 
                            i1 = i;
                        break;
                    }
                }
            }
        }
        if ((max_char === 0 && (i1 < li.length) && (i1 + 10) > li.length) && !has_app && ((li[li.length - 1].end_char - li[i1].end_char) < 200)) {
            for (let ii = li.length - 1; ii > i; ii--) {
                if (li[ii].typ === ILTypes.PERSON || li[ii].typ === ILTypes.DATE || ((li[ii].typ === ILTypes.REGNUMBER && li[ii].is_newline_before))) {
                    i1 = ii + 1;
                    break;
                }
            }
        }
        let cmax = i1 - 1;
        let tail = null;
        let pers_list = new Array();
        for (i = i1 - 1; i > 0; i--) {
            if (max_char > 0) 
                break;
            let lii = li[i];
            if (lii.has_table_chars) {
                if ((i < (i1 - 1)) && lii.typ !== ILTypes.PERSON) 
                    break;
                if (is_contract) 
                    break;
            }
            if ((lii.typ === ILTypes.PERSON || lii.typ === ILTypes.REGNUMBER || lii.typ === ILTypes.DATE) || lii.typ === ILTypes.GEO) {
                if (pers_list.length > 0) {
                    if (lii.typ !== ILTypes.PERSON && lii.typ !== ILTypes.DATE) 
                        break;
                    if (!lii.is_newline_before && !lii.is_newline_after && !lii.has_table_chars) {
                        if (!lii.is_newline_before && i > 0 && li[i - 1].typ === ILTypes.PERSON) {
                        }
                        else 
                            break;
                    }
                }
                if (lii.typ === ILTypes.PERSON && (lii.ref instanceof ReferentToken)) {
                    if (pers_list.includes((lii.ref).referent)) {
                        if (!lii.is_newline_before) 
                            break;
                    }
                }
                if (!lii.is_newline_before && !lii.begin_token.is_table_control_char && ((lii.typ === ILTypes.GEO || li[i].typ === ILTypes.PERSON))) {
                    if (i > 0 && ((li[i - 1].typ === ILTypes.UNDEFINED && !li[i - 1].end_token.is_table_control_char))) 
                        break;
                    if (lii.end_token.is_char_of(";.")) 
                        break;
                    if (!lii.is_newline_after) {
                        if (lii.end_token.next !== null && !lii.end_token.next.is_table_control_char) 
                            break;
                    }
                }
                if (tail === null) {
                    tail = FragToken._new1338(li[i].begin_token, li[i1 - 1].end_token, InstrumentKind.TAIL);
                    if ((i1 - 1) > i) {
                    }
                }
                tail.begin_token = lii.begin_token;
                cmax = i - 1;
                let fr = new FragToken(li[i].begin_token, li[i].end_token);
                tail.children.splice(0, 0, fr);
                if (li[i].typ === ILTypes.PERSON) {
                    fr.kind = InstrumentKind.SIGNER;
                    if (li[i].ref instanceof ReferentToken) {
                        res.m_doc.add_slot(InstrumentReferent.ATTR_SIGNER, (li[i].ref).referent, false, 0);
                        res.m_doc.add_ext_referent(Utils.as(li[i].ref, ReferentToken));
                        fr.value = li[i].ref;
                        pers_list.push((li[i].ref).referent);
                    }
                }
                else if (li[i].typ === ILTypes.REGNUMBER) {
                    if (li[i].is_newline_before) {
                        if (res.m_doc.reg_number === null || res.m_doc.reg_number === li[i].value) {
                            fr.kind = InstrumentKind.NUMBER;
                            fr.value = li[i].value;
                            res.m_doc.add_slot(InstrumentBlockReferent.ATTR_NUMBER, li[i].value, false, 0);
                        }
                    }
                }
                else if (li[i].typ === ILTypes.DATE) {
                    fr.kind = InstrumentKind.DATE;
                    fr.value = li[i].value;
                    if (li[i].ref !== null) {
                        res.m_doc.add_date(li[i].ref);
                        fr.value = li[i].ref;
                    }
                    else if (li[i].value !== null) 
                        res.m_doc.add_date(li[i].value);
                }
                else if (li[i].typ === ILTypes.GEO) {
                    fr.kind = InstrumentKind.PLACE;
                    fr.value = li[i].ref;
                }
                if (fr.value === null) 
                    fr.value = MiscHelper.get_text_value_of_meta_token(fr, GetTextAttr.NO);
            }
            else {
                let ss = MiscHelper.get_text_value(li[i].begin_token, li[i].end_token, GetTextAttr.KEEPQUOTES);
                if (ss === null || ss.length === 0) 
                    continue;
                if (ss[ss.length - 1] === ':') 
                    ss = ss.substring(0, 0 + ss.length - 1);
                if (li[i].is_podpis_storon && tail !== null) {
                    tail.begin_token = li[i].begin_token;
                    tail.children.splice(0, 0, FragToken._new1392(li[i].begin_token, li[i].end_token, InstrumentKind.NAME, ss));
                    cmax = i - 1;
                    break;
                }
                let jj = 0;
                for (jj = 0; jj < ss.length; jj++) {
                    if (Utils.isLetterOrDigit(ss[jj])) 
                        break;
                }
                if (jj >= ss.length) 
                    continue;
                if ((ss.length < 100) && (((i1 - i) < 3))) 
                    continue;
                break;
            }
        }
        if (cmax < 0) {
            if (i1 > 0) 
                return null;
        }
        else {
            let content = FragToken._new1338(li[0].begin_token, li[cmax].end_token, InstrumentKind.CONTENT);
            res.children.push(content);
            content._analize_content(res, max_char > 0, root_kind);
            if (max_char > 0 && cmax === (li.length - 1) && head === null) 
                res = content;
        }
        if (tail !== null) {
            res.children.push(tail);
            for (; i1 < li.length; i1++) {
                if (li[i1].begin_token === li[i1].end_token && (li[i1].begin_token.get_referent() instanceof DecreeReferent) && (li[i1].begin_token.get_referent()).kind === DecreeKind.PUBLISHER) {
                    let ap = FragToken._new1338(li[i1].begin_token, li[i1].end_token, InstrumentKind.APPROVED);
                    ap.referents = new Array();
                    ap.referents.push(Utils.as(li[i1].begin_token.get_referent(), DecreeReferent));
                    tail.children.push(ap);
                    tail.end_token = li[i1].end_token;
                }
                else 
                    break;
            }
            if (tail.children.length > 0 && (tail.children[tail.children.length - 1].end_char < tail.end_char)) {
                let unkw = FragToken._new1338(tail.children[tail.children.length - 1].end_token.next, tail.end_token, InstrumentKind.UNDEFINED);
                tail.end_token = unkw.begin_token.previous;
                res.children.push(unkw);
            }
        }
        let is_all_apps = is_app;
        let app0 = null;
        for (i = i1; i < li.length; i++) {
            let j = 0;
            let app = new FragToken(li[i].begin_token, li[i].end_token);
            let title = FragToken.create_appendix_title(app.begin_token, app, res.m_doc, is_all_apps, false);
            for (j = i + 1; j < li.length; j++) {
                if (title !== null && li[j].end_char <= title.end_char) 
                    continue;
                if (li[j].typ === ILTypes.APPENDIX) {
                    if (li[j].value === li[i1].value) 
                        break;
                    if (li[j].value !== null && li[i1].value === null) 
                        break;
                    continue;
                }
                else if (li[j].typ === ILTypes.APPROVED) {
                    if ((li[j].begin_char - li[i].end_char) > 200) 
                        break;
                }
            }
            app.end_token = li[j - 1].end_token;
            tail = null;
            if (li[j - 1].typ === ILTypes.PERSON && li[j - 1].is_newline_before && li[j - 1].is_newline_after) {
                tail = FragToken._new1338(li[j - 1].begin_token, li[j - 1].end_token, InstrumentKind.TAIL);
                for (let jj = j - 1; jj > i; jj--) {
                    if (li[jj].typ !== ILTypes.PERSON || !li[jj].is_newline_before || !li[jj].is_newline_after) 
                        break;
                    else {
                        let fr = FragToken._new1338(li[jj].begin_token, li[jj].end_token, InstrumentKind.SIGNER);
                        if (li[jj].ref instanceof ReferentToken) 
                            fr.value = li[jj].ref;
                        tail.children.splice(0, 0, fr);
                        tail.begin_token = fr.begin_token;
                        app.end_token = tail.begin_token.previous;
                    }
                }
            }
            if (li[i].typ === ILTypes.APPENDIX || ((((i + 1) < li.length) && li[i + 1].typ === ILTypes.APPENDIX))) 
                app.kind = InstrumentKind.APPENDIX;
            else if (app.kind !== InstrumentKind.APPENDIX) 
                app.kind = InstrumentKind.INTERNALDOCUMENT;
            if (title === null) {
                let ok = true;
                if (app.length_char < 500) 
                    ok = false;
                else {
                    app._analize_content(app, false, InstrumentKind.UNDEFINED);
                    if (app.children.length < 2) 
                        ok = false;
                }
                if (ok) 
                    res.children.push(app);
                else {
                    app.kind = InstrumentKind.UNDEFINED;
                    res.children[res.children.length - 1].children.push(app);
                    res.children[res.children.length - 1].end_token = app.end_token;
                }
            }
            else {
                if (is_app && app.kind === InstrumentKind.APPENDIX) {
                    if (res.children.length > 0) 
                        res.end_token = res.children[res.children.length - 1].end_token;
                    let res0 = FragToken._new1398(res.begin_token, res.end_token, res.m_doc, InstrumentKind.DOCUMENT);
                    res.m_doc = null;
                    res.kind = InstrumentKind.APPENDIX;
                    res0.children.splice(0, 0, res);
                    res = res0;
                    is_app = false;
                }
                if ((app0 !== null && !is_app && app0.kind === InstrumentKind.INTERNALDOCUMENT) && app.kind === InstrumentKind.APPENDIX) 
                    app0.children.push(app);
                else 
                    res.children.push(app);
                if (i === i1 && !is_app && app.kind === InstrumentKind.INTERNALDOCUMENT) 
                    app0 = app;
                if (title.name !== null) {
                    app.name = title.name;
                    title.name = null;
                }
                app.children.push(title);
                if (app.end_char < title.end_char) 
                    app.end_token = title.end_token;
                if (title.end_token.next !== null) {
                    if (title.end_token.end_char < app.end_token.begin_char) {
                        let acontent = FragToken._new1338(title.end_token.next, app.end_token, InstrumentKind.CONTENT);
                        app.children.push(acontent);
                        acontent._analize_content(app, false, InstrumentKind.UNDEFINED);
                    }
                    else {
                    }
                }
                if (app.children.length === 1 && app.kind !== InstrumentKind.APPENDIX) {
                    app.children.splice(0, app.children.length);
                    app.kind = InstrumentKind.UNDEFINED;
                    app.name = null;
                }
            }
            if (tail !== null) {
                app.children.push(tail);
                app.end_token = tail.end_token;
            }
            i = j - 1;
        }
        if (res.children.length > 0) 
            res.end_token = res.children[res.children.length - 1].end_token;
        let appendixes = new Array();
        for (const ch of res.children) {
            if (ch.kind === InstrumentKind.APPENDIX) 
                appendixes.push(ch);
        }
        for (i = 1; i < appendixes.length; i++) {
            let max_coef = 0;
            let ii = -1;
            for (let j = i - 1; j >= 0; j--) {
                let coef = appendixes[i].calc_owner_coef(appendixes[j]);
                if (coef > max_coef) {
                    max_coef = coef;
                    ii = j;
                }
            }
            if (ii < 0) 
                continue;
            appendixes[ii].children.push(appendixes[i]);
            Utils.removeItem(res.children, appendixes[i]);
        }
        if (max_char > 0) 
            return res;
        if (!is_contract && head_kind !== DecreeKind.STANDARD) {
            for (const ch of res.children) {
                if (ch.kind === InstrumentKind.APPENDIX || ch.kind === InstrumentKind.INTERNALDOCUMENT || ch.kind === InstrumentKind.HEAD) {
                    if (ch.kind === InstrumentKind.APPENDIX && res.m_doc.name !== null) 
                        continue;
                    let hi = (ch.kind === InstrumentKind.HEAD ? ch : ch.find_child(InstrumentKind.HEAD));
                    if (hi !== null) {
                        hi = hi.find_child(InstrumentKind.NAME);
                        if (hi !== null && hi.value !== null && hi.value.toString().length > 20) 
                            res.m_doc.add_slot(InstrumentBlockReferent.ATTR_NAME, hi.value, false, 0);
                    }
                }
            }
        }
        if (res.m_doc.typ === null) {
            for (const ch of res.children) {
                if (ch.kind === InstrumentKind.APPENDIX) {
                    let hi = ch.find_child(InstrumentKind.HEAD);
                    if (hi !== null) 
                        hi = hi.find_child(InstrumentKind.DOCREFERENCE);
                    if (hi !== null) {
                        let t1 = hi.begin_token;
                        if (t1.is_value("К", "ДО") && t1.next !== null) 
                            t1 = t1.next;
                        let dr = Utils.as(t1.get_referent(), DecreeReferent);
                        if (dr !== null && dr.number === res.m_doc.reg_number) 
                            res.m_doc.typ = dr.typ;
                        else {
                            let dt = DecreeToken.try_attach(t1, null, false);
                            if (dt !== null && dt.typ === DecreeTokenItemType.TYP) 
                                res.m_doc.typ = dt.value;
                        }
                    }
                    break;
                }
            }
        }
        res._create_justice_resolution();
        if (res.m_doc.typ === null && ((res.m_doc.reg_number !== null || res.m_doc.case_number !== null))) {
            if ((res.children.length > 1 && res.children[1].kind === InstrumentKind.CONTENT && res.children[1].children.length > 0) && res.children[1].children[res.children[1].children.length - 1].kind === InstrumentKind.DOCPART) {
                let part = res.children[1].children[res.children[1].children.length - 1];
                for (const ch of part.children) {
                    if (ch.kind === InstrumentKind.DIRECTIVE && ch.value !== null) {
                        res.m_doc.typ = Utils.asString(ch.value);
                        break;
                    }
                }
            }
        }
        return res;
    }
    
    static _create_case_info(t) {
        if (t === null) 
            return null;
        if (!t.is_newline_before) 
            return null;
        let rez = false;
        let t1 = null;
        if ((t instanceof ReferentToken) && (t.get_referent() instanceof DecreePartReferent)) {
            let dpr = Utils.as(t.get_referent(), DecreePartReferent);
            if (dpr.part === "резолютивная") 
                t1 = t;
        }
        else if (t.is_value("РЕЗОЛЮТИВНЫЙ", "РЕЗОЛЮТИВНЫЙ") && t.next !== null && t.next.is_value("ЧАСТЬ", "ЧАСТИНА")) 
            t1 = t.next;
        else if (t.is_value("ПОЛНЫЙ", "ПОВНИЙ") && t.next !== null && t.next.is_value("ТЕКСТ", null)) 
            t1 = t.next;
        if (t1 !== null) {
            rez = true;
            let dt = DecreeToken.try_attach(t1.next, null, false);
            if (dt !== null && dt.typ === DecreeTokenItemType.TYP) 
                t1 = dt.end_token;
        }
        if (!rez) {
            if ((t.is_value("ПОСТАНОВЛЕНИЕ", "ПОСТАНОВА") || t.is_value("РЕШЕНИЕ", "РІШЕННЯ") || t.is_value("ОПРЕДЕЛЕНИЕ", "ВИЗНАЧЕННЯ")) || t.is_value("ПРИГОВОР", "ВИРОК")) {
                if (t.is_newline_after && t.chars.is_all_upper) 
                    return null;
                t1 = t;
            }
        }
        if (t1 === null) 
            return null;
        if (t1.next !== null && t1.next.morph.class0.is_preposition) {
            let npt = NounPhraseHelper.try_parse(t1.next.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) 
                t1 = npt.end_token;
        }
        if (t1.next !== null && t1.next.morph.class0.is_verb) {
        }
        else 
            return null;
        let has_date = false;
        for (let tt = t1.next; tt !== null; tt = tt.next) {
            if (MiscHelper.can_be_start_of_sentence(tt)) 
                break;
            else {
                t1 = tt;
                if (t1.get_referent() instanceof DateReferent) 
                    has_date = true;
            }
        }
        if ((!has_date && t1.next !== null && (t1.next.get_referent() instanceof DateReferent)) && t1.next.is_newline_after) 
            t1 = t1.next;
        return FragToken._new1338(t, t1, InstrumentKind.CASEINFO);
    }
    
    static _create_approved(t) {
        const InstrToken = require("./InstrToken");
        if (t === null) 
            return null;
        let res = null;
        if (((t instanceof ReferentToken) && (t).begin_token.is_char('(') && (t).end_token.is_char(')')) && (t).begin_token.next.is_value("ПРОТОКОЛ", null)) {
            res = FragToken._new1338(t, t, InstrumentKind.APPROVED);
            res.referents = new Array();
            res.referents.push(t.get_referent());
            return res;
        }
        let tt = InstrToken._check_approved(t);
        if (tt !== null) 
            res = FragToken._new1338(t, tt, InstrumentKind.APPROVED);
        else if ((t.is_value("ОДОБРИТЬ", "СХВАЛИТИ") || t.is_value("ПРИНЯТЬ", "ПРИЙНЯТИ") || t.is_value("УТВЕРДИТЬ", "ЗАТВЕРДИТИ")) || t.is_value("СОГЛАСОВАТЬ", null)) {
            if (t.morph.contains_attr("инф.", null) && t.morph.contains_attr("сов.в.", null)) {
            }
            else 
                res = FragToken._new1338(t, t, InstrumentKind.APPROVED);
        }
        else if ((t instanceof TextToken) && (((t).term === "ИМЕНЕМ" || (t).term === "ІМЕНЕМ"))) 
            res = FragToken._new1338(t, t, InstrumentKind.APPROVED);
        if (res === null) 
            return null;
        t = res.end_token;
        if (t.next === null) 
            return res;
        if (!t.is_newline_after && t.next.get_normal_case_text(null, false, MorphGender.UNDEFINED, false) === res.begin_token.get_normal_case_text(null, false, MorphGender.UNDEFINED, false)) {
            for (t = t.next; t !== null; t = t.next) {
                if (t.is_newline_before || t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false) !== res.begin_token.get_normal_case_text(null, false, MorphGender.UNDEFINED, false)) 
                    break;
                else 
                    res.end_token = t;
            }
            if (t.next === null) 
                return res;
            let tt0 = t.next;
            for (t = t.next; t !== null; t = t.next) {
                let dtt = DecreeToken.try_attach(t, null, false);
                if (dtt !== null) {
                    if (dtt.typ === DecreeTokenItemType.TYP && t !== tt0 && t.is_newline_before) 
                        break;
                    res.end_token = (t = dtt.end_token);
                    continue;
                }
                if (t.newlines_before_count > 1) 
                    break;
                res.end_token = t;
            }
            return res;
        }
        for (t = t.next; t !== null; t = t.next) {
            if (t.is_and || t.morph.class0.is_preposition) 
                continue;
            if (t.is_value("ВВЕСТИ", null) || t.is_value("ДЕЙСТВИЕ", "ДІЯ")) {
                res.end_token = t;
                continue;
            }
            break;
        }
        while (t !== null) {
            if (t.is_char_of(":.,") || BracketHelper.is_bracket(t, true)) 
                t = t.next;
            else 
                break;
        }
        if (t === null) 
            return res;
        let dts = DecreeToken.try_attach_list(t, null, 10, false);
        if (dts !== null && dts.length > 0) {
            for (let i = 0; i < dts.length; i++) {
                let dt = dts[i];
                if (dt.typ === DecreeTokenItemType.ORG) 
                    res.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.ORGANIZATION, dt));
                else if (dt.typ === DecreeTokenItemType.OWNER) 
                    res.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.INITIATOR, dt));
                else if (dt.typ === DecreeTokenItemType.DATE) 
                    res.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.DATE, dt));
                else if (dt.typ === DecreeTokenItemType.NUMBER && i > 0 && dts[i - 1].typ === DecreeTokenItemType.DATE) 
                    res.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.NUMBER, dt));
                else if (dt.typ === DecreeTokenItemType.TYP && i === 0) {
                    if (((i + 1) < dts.length) && dts[i + 1].typ === DecreeTokenItemType.TERR) {
                        i++;
                        dt = dts[i];
                    }
                }
                else if (dt.typ === DecreeTokenItemType.TERR && res.begin_token.is_value("ИМЕНЕМ", "ІМЕНЕМ")) 
                    res.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.PLACE, dt));
                else 
                    break;
                res.end_token = dt.end_token;
            }
        }
        else if (t.get_referent() instanceof DecreeReferent) {
            res.referents = new Array();
            for (; t !== null; t = t.next) {
                if (t.is_comma_and) 
                    continue;
                if (t.is_char('.')) {
                    res.end_token = t;
                    continue;
                }
                let dr = Utils.as(t.get_referent(), DecreeReferent);
                if (dr === null) 
                    break;
                if (res.referents.length > 0 && t.newlines_before_count > 1) 
                    break;
                res.referents.push(dr);
                res.end_token = t;
            }
        }
        else if ((t.get_referent() instanceof PersonReferent) || (t.get_referent() instanceof PersonPropertyReferent)) {
            res.referents = new Array();
            for (; t !== null; t = t.next) {
                if (t.is_comma_and) 
                    continue;
                if ((t.get_referent() instanceof PersonReferent) || (t.get_referent() instanceof PersonPropertyReferent)) {
                    res.referents.push(t.get_referent());
                    res.end_token = t;
                }
                else 
                    break;
            }
        }
        if (res.children.length === 0) {
            if (((!res.begin_token.is_newline_before && !res.begin_token.previous.is_table_control_char)) || ((!res.end_token.is_newline_after && !res.end_token.next.is_table_control_char))) 
                return null;
        }
        if (res.end_token.next !== null && (res.end_token.next.get_referent() instanceof DateReferent)) {
            let dt = DecreeToken.try_attach(res.end_token.next, null, false);
            if (dt !== null) {
                res.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.DATE, dt));
                res.end_token = dt.end_token;
                dt = DecreeToken.try_attach(res.end_token.next, null, false);
                if (dt !== null && dt.typ === DecreeTokenItemType.NUMBER) {
                    res.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.NUMBER, dt));
                    res.end_token = dt.end_token;
                }
            }
        }
        t = res.end_token.next;
        if (t !== null && t.is_comma) 
            t = t.next;
        if (t !== null && t.is_value("ПРОТОКОЛ", null)) {
            dts = DecreeToken.try_attach_list(t, null, 10, false);
            if (dts !== null && dts.length > 0) 
                res.end_token = dts[dts.length - 1].end_token;
            else if (t.get_referent() instanceof DecreeReferent) 
                res.end_token = t;
        }
        if (!res.is_newline_before && res.begin_token.previous !== null && BracketHelper.can_be_start_of_sequence(res.begin_token.previous, true, false)) 
            res.begin_token = res.begin_token.previous;
        return res;
    }
    
    static _create_misc(t) {
        if (t === null || t.next === null) 
            return null;
        if (t.is_value("ФОРМА", null) && t.next.is_value("ДОКУМЕНТА", null)) {
            let num = DecreeToken.try_attach(t.next.next, null, false);
            if (num !== null && num.typ === DecreeTokenItemType.NUMBER) 
                return FragToken._new1338(t, num.end_token, InstrumentKind.UNDEFINED);
            if ((t.next.next instanceof NumberToken) && t.next.next.is_newline_after) 
                return FragToken._new1338(t, t.next.next, InstrumentKind.UNDEFINED);
        }
        if (t.is_value("С", null) && t.next.is_value("ИЗМЕНЕНИЕ", null) && t.next.next !== null) {
            let tt = t.next.next;
            if (tt.morph.class0.is_preposition && tt.next !== null) 
                tt = tt.next;
            if (tt.get_referent() instanceof DateReferent) {
                if (tt.next !== null && tt.next.is_char('.')) 
                    tt = tt.next;
                return FragToken._new1338(t, tt, InstrumentKind.UNDEFINED);
            }
        }
        while ((t instanceof TextToken) && t.length_char === 1 && t.next !== null) {
            t = t.next;
        }
        if (t.is_value("ЗАКАЗ", null)) {
            let itt = InstrToken1.parse(t, false, null, 0, null, false, 0, false, false);
            if (itt !== null) 
                return FragToken._new1338(t, itt.end_token, InstrumentKind.UNDEFINED);
        }
        return null;
    }
    
    static _create_editions(t) {
        if (t === null || t.next === null) 
            return null;
        let t0 = t;
        let is_in_bracks = false;
        let ok = false;
        if ((t.is_newline_before && t.is_value("С", null) && t.next !== null) && t.next.is_value("ИЗМЕНЕНИЕ", null)) {
            let eee = FragToken._new1338(t, t, InstrumentKind.EDITIONS);
            for (t = t.next.next; t !== null; t = t.next) {
                if (t.is_comma_and || (t.get_referent() instanceof DateReferent)) 
                    eee.end_token = t;
                else if (t.is_value("ДОПОЛНЕНИЕ", null) || t.is_char_of(":;.") || t.is_value("ОТ", null)) 
                    eee.end_token = t;
                else {
                    let dd = DateItemToken.try_attach(t, null, false);
                    if (dd !== null) 
                        eee.end_token = (t = dd.end_token);
                    else 
                        break;
                }
            }
            return eee;
        }
        if (t.is_value("СПИСОК", null)) {
            let npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.noun.is_value("ДОКУМЕНТ", null)) {
                t = npt.end_token.next;
                if (t !== null && t.is_char_of(":.")) 
                    t = t.next;
                if (t === null) 
                    return null;
            }
        }
        if (!t.is_char('(') && !t.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК")) {
            if (t.is_value("В", "У") && t.next !== null && ((t.next.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ") || t.next.is_value("РЕД", null)))) {
            }
            else if (t.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")) {
                let dtt0 = DecreeToken.try_attach(t.next, null, false);
                if (dtt0 !== null) 
                    return FragToken._new1338(t, dtt0.end_token, InstrumentKind.EDITIONS);
            }
            else 
                return null;
        }
        else {
            is_in_bracks = t.is_char('(');
            t = t.next;
        }
        let dt = DecreeToken.try_attach(t, null, false);
        if (dt !== null && ((dt.typ === DecreeTokenItemType.NUMBER || dt.typ === DecreeTokenItemType.DATE))) 
            t = dt.end_token.next;
        else if (t instanceof NumberToken) 
            t = t.next;
        let pt = PartToken.try_attach(t, null, false, true);
        if (pt !== null) 
            t = pt.end_token.next;
        else if (is_in_bracks && (t.get_referent() instanceof DecreePartReferent)) 
            t = t.next;
        if (t === null) 
            return null;
        let is_doubt = false;
        while (((t.morph.class0.is_preposition || t.morph.class0.is_adverb)) && t.next !== null) {
            t = t.next;
        }
        if (t.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")) 
            ok = true;
        else if (t.is_value("РЕД", null)) {
            ok = true;
            if (t.next !== null && t.next.is_char('.')) 
                t = t.next;
        }
        else if ((t.is_value("ИЗМ", null) || t.is_value("ИЗМЕНЕНИЕ", "ЗМІНА") || t.is_value("УЧЕТ", "ОБЛІК")) || t.is_value("ВКЛЮЧИТЬ", "ВКЛЮЧИТИ") || t.is_value("ДОПОЛНИТЬ", "ДОПОВНИТИ")) {
            if (t.is_value("УЧЕТ", "ОБЛІК")) 
                is_doubt = true;
            ok = true;
            for (t = t.next; t !== null; t = t.next) {
                if (t.next === null) 
                    break;
                if (t.is_char_of(",.")) 
                    continue;
                if (t.is_value("ВНЕСЕННЫЙ", "ВНЕСЕНИЙ") || t.is_value("ПОПРАВКА", null)) 
                    continue;
                t = t.previous;
                break;
            }
        }
        else if (t.get_referent() instanceof DecreeReferent) {
            let tt = (t).begin_token;
            if (tt.is_value("В", "У") && tt.next !== null) 
                tt = tt.next;
            if (tt.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")) 
                ok = true;
            else if (tt.is_value("РЕД", null)) 
                ok = true;
            t = t.previous;
        }
        if (!ok || t === null) 
            return null;
        let decrs = new Array();
        for (t = t.next; t !== null; t = t.next) {
            if (is_in_bracks) {
                if (t.is_char('(')) {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null && (br.length_char < 200)) {
                        t = br.end_token;
                        continue;
                    }
                }
                if (t.is_char(')')) 
                    break;
            }
            let dr = Utils.as(t.get_referent(), DecreeReferent);
            if (dr !== null) {
                decrs.push(dr);
                continue;
            }
            if (t.is_comma_and) 
                continue;
            if (t.is_newline_before && !is_in_bracks) {
                t = t.previous;
                break;
            }
        }
        if (t === null) 
            return null;
        ok = false;
        if (is_in_bracks) {
            ok = t.is_char(')');
            if (!t.is_newline_after) {
                if ((t.next instanceof TextToken) && t.next.is_newline_after && !t.next.chars.is_letter) {
                }
                else 
                    is_doubt = true;
            }
        }
        else if (t.is_char('.') || t.is_newline_after) 
            ok = true;
        if (decrs.length > 0) 
            is_doubt = false;
        if (ok && !is_doubt) {
            let eds = FragToken._new1338(t0, t, InstrumentKind.EDITIONS);
            eds.referents = new Array();
            for (const d of decrs) {
                eds.referents.push(d);
            }
            return eds;
        }
        return null;
    }
    
    static _create_owner(t) {
        if (t === null || !t.is_newline_before) 
            return null;
        if (!t.chars.is_cyrillic_letter || t.chars.is_all_lower) 
            return null;
        let t1 = null;
        let t11 = null;
        let ignore_cur_line = false;
        let keyword = false;
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt.is_newline_before) 
                t11 = t1;
            let r = tt.get_referent();
            if ((r instanceof DecreeReferent) && keyword) {
                tt = tt.kit.debed_token(tt);
                r = tt.get_referent();
            }
            let dt = DecreeToken.try_attach(tt, null, false);
            if (dt !== null) {
                if ((dt.typ !== DecreeTokenItemType.OWNER && dt.typ !== DecreeTokenItemType.ORG && dt.typ !== DecreeTokenItemType.UNKNOWN) && dt.typ !== DecreeTokenItemType.TERR && dt.typ !== DecreeTokenItemType.MISC) 
                    break;
                t1 = (tt = dt.end_token);
                continue;
            }
            if (tt !== t && tt.whitespaces_before_count > 15) {
                if (tt.previous !== null && tt.previous.is_hiphen) {
                }
                else 
                    break;
            }
            if (((((r instanceof DateReferent) || (r instanceof AddressReferent) || (r instanceof StreetReferent)) || (r instanceof PhoneReferent) || (r instanceof UriReferent)) || (r instanceof PersonIdentityReferent) || (r instanceof BankDataReferent)) || (r instanceof DecreePartReferent) || (r instanceof DecreeReferent)) {
                ignore_cur_line = true;
                t1 = t11;
                break;
            }
            if (MorphClass.ooEq(tt.morph.class0, MorphClass.VERB)) {
                ignore_cur_line = true;
                t1 = t11;
                break;
            }
            if ((r instanceof GeoReferent) && tt.is_newline_before) 
                break;
            t1 = tt;
            let oo = tt.kit.process_referent("ORGANIZATION", tt);
            if (oo !== null) {
                t1 = (tt = oo.end_token);
                continue;
            }
            let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                if (tt === t) {
                    let typ = OrgItemTypeToken.try_attach(tt, false, null);
                    if (typ !== null) {
                        keyword = true;
                        t1 = (tt = typ.end_token);
                        continue;
                    }
                }
                t1 = (tt = npt.end_token);
            }
        }
        if (t1 === null) 
            return null;
        let fr = FragToken._new1357(t, t1, InstrumentKind.ORGANIZATION, true);
        return fr;
    }
    
    calc_owner_coef(owner) {
        let own_typs = new Array();
        let own_name = null;
        for (const ch of owner.children) {
            if (ch.kind === InstrumentKind.HEAD) {
                for (const chh of ch.children) {
                    if (chh.kind === InstrumentKind.TYP || chh.kind === InstrumentKind.NAME || chh.kind === InstrumentKind.KEYWORD) {
                        let t = DecreeToken.is_keyword(chh.begin_token, false);
                        if (t instanceof TextToken) 
                            own_typs.push((t).get_lemma());
                        if (chh.kind === InstrumentKind.NAME && own_name === null) 
                            own_name = chh;
                    }
                }
            }
        }
        for (const ch of this.children) {
            if (ch.kind === InstrumentKind.HEAD) {
                for (const chh of ch.children) {
                    if (chh.kind === InstrumentKind.DOCREFERENCE) {
                        let t = chh.begin_token;
                        if (t.morph.class0.is_preposition) 
                            t = t.next;
                        let tt = DecreeToken.is_keyword(t, false);
                        if (tt instanceof TextToken) {
                            let ty = (tt).get_lemma();
                            if (own_typs.includes(ty)) 
                                return 1;
                            continue;
                        }
                        let pt = PartToken.try_attach(t, null, false, false);
                        if (pt !== null) {
                            if (pt.typ === PartTokenItemType.APPENDIX) {
                                if (owner.number > 0) {
                                    for (const nn of pt.values) {
                                        if (nn.value === owner.number.toString()) 
                                            return 3;
                                    }
                                }
                            }
                        }
                        if (own_name !== null && ((typeof own_name.value === 'string' || own_name.value instanceof String))) {
                            let val0 = Utils.asString(own_name.value);
                            let val1 = MiscHelper.get_text_value(t, chh.end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                            if (val1 === val0) 
                                return 3;
                            if (MiscHelper.can_be_equals(val0, val1, true, true, false)) 
                                return 3;
                            if (val1 !== null && ((val1.startsWith(val0) || val0.startsWith(val1)))) 
                                return 1;
                        }
                    }
                }
            }
        }
        return 0;
    }
    
    get has_changes() {
        if (this.begin_token.get_referent() instanceof DecreeChangeReferent) 
            return true;
        for (let t = this.begin_token; t !== null && t.end_char <= this.end_char; t = t.next) {
            if (t.get_referent() instanceof DecreeChangeReferent) 
                return true;
        }
        return false;
    }
    
    get multiline_changes_value() {
        for (let t = this.begin_token; t !== null && (t.begin_char < this.end_char); t = t.next) {
            if (t.get_referent() instanceof DecreeChangeReferent) {
                let dcr = Utils.as(t.get_referent(), DecreeChangeReferent);
                for (let tt = (t).begin_token; tt !== null && tt.end_char <= t.end_char; tt = tt.next) {
                    let dval = Utils.as(tt.get_referent(), DecreeChangeValueReferent);
                    if (dval === null || dval.kind !== DecreeChangeValueKind.TEXT) 
                        continue;
                    let val = dval.value;
                    if (val === null || (val.length < 100)) 
                        continue;
                    if ((val.indexOf('\r') < 0) && (val.indexOf('\n') < 0) && !tt.is_newline_before) 
                        continue;
                    let t0 = null;
                    for (t = (tt).begin_token; t !== null && t.end_char <= tt.end_char; t = t.next) {
                        if (BracketHelper.is_bracket(t, true) && ((t.is_whitespace_before || t.previous.is_char(':')))) {
                            t0 = t.next;
                            break;
                        }
                        else if (t.previous !== null && t.previous.is_char(':') && t.is_newline_before) {
                            t0 = t;
                            break;
                        }
                    }
                    let t1 = (tt).end_token;
                    if (BracketHelper.is_bracket(t1, true)) 
                        t1 = t1.previous;
                    if (t0 !== null && ((t0.end_char + 50) < t1.end_char)) 
                        return MetaToken._new834(t0, t1, dcr);
                    return null;
                }
            }
            if (t.end_char > this.end_char) 
                break;
        }
        return null;
    }
    
    _analize_tables() {
        if (this.children.length > 0) {
            let abz_count = 0;
            let cou = 0;
            for (const ch of this.children) {
                if (ch.kind === InstrumentKind.INDENTION) 
                    abz_count++;
                if (ch.kind !== InstrumentKind.KEYWORD && ch.kind !== InstrumentKind.NUMBER && ch.kind !== InstrumentKind.NUMBER) 
                    cou++;
            }
            if (abz_count === cou && cou > 0) {
                let chs = this.children;
                this.children = new Array();
                let bb = this._analize_tables();
                this.children = chs;
                if (bb) {
                    for (let i = 0; i < this.children.length; i++) {
                        if (this.children[i].kind === InstrumentKind.INDENTION) {
                            let ch0 = (i > 0 ? this.children[i - 1] : null);
                            if (ch0 !== null && ch0.kind === InstrumentKind.CONTENT) {
                                ch0.end_token = this.children[i].end_token;
                                this.children.splice(i, 1);
                                i--;
                            }
                            else 
                                this.children[i].kind = InstrumentKind.CONTENT;
                        }
                    }
                }
            }
            let changed = new Array();
            for (const ch of this.children) {
                if (ch._analize_tables()) 
                    changed.push(ch);
            }
            for (let i = changed.length - 1; i >= 0; i--) {
                if (changed[i].kind === InstrumentKind.CONTENT) {
                    let j = this.children.indexOf(changed[i]);
                    if (j < 0) 
                        continue;
                    this.children.splice(j, 1);
                    this.children.splice(j, 0, ...changed[i].children);
                }
            }
            return false;
        }
        if (((this.kind === InstrumentKind.CHAPTER || this.kind === InstrumentKind.CLAUSE || this.kind === InstrumentKind.CONTENT) || this.kind === InstrumentKind.ITEM || this.kind === InstrumentKind.SUBITEM) || this.kind === InstrumentKind.INDENTION) {
        }
        else 
            return false;
        if (this.itok !== null && this.itok.has_changes) 
            return false;
        let _end_char = this.end_char;
        if (this.end_token.next === null) 
            _end_char = this.kit.sofa.text.length - 1;
        let t0 = this.begin_token;
        let tabs = false;
        for (let tt = this.begin_token; tt !== null && tt.end_char <= _end_char; tt = tt.next) {
            if (!tt.is_newline_before) 
                continue;
            if (tt.is_char(String.fromCharCode(0x1E))) {
            }
            let rows = TableHelper.try_parse_rows(tt, _end_char, false);
            if (rows === null || (rows.length < 2)) 
                continue;
            let ok = true;
            for (const r of rows) {
                if (r.cells.length > 15) 
                    ok = false;
            }
            if (!ok) {
                tt = rows[rows.length - 1].end_token;
                continue;
            }
            if (t0.end_char < rows[0].begin_char) 
                this.children.push(FragToken._new1338(t0, rows[0].begin_token.previous, InstrumentKind.CONTENT));
            let tab = FragToken._new1338(rows[0].begin_token, rows[rows.length - 1].end_token, InstrumentKind.TABLE);
            this.children.push(tab);
            for (let i = 0; i < rows.length; i++) {
                let rr = FragToken._new1355(rows[i].begin_token, rows[i].end_token, InstrumentKind.TABLEROW, i + 1);
                tab.children.push(rr);
                tabs = true;
                let no = 0;
                let cols = 0;
                for (const ce of rows[i].cells) {
                    let cell = FragToken._new1355(ce.begin_token, ce.end_token, InstrumentKind.TABLECELL, ++no);
                    if (ce.col_span > 1) 
                        cols += (((cell.sub_number = ce.col_span)));
                    else 
                        cols++;
                    if (ce.row_span > 1) 
                        cell.sub_number2 = ce.row_span;
                    rr.children.push(cell);
                }
                if (tab.number < cols) 
                    tab.number = cols;
                tt = rows[i].end_token;
            }
            if (tab.number > 1) {
                let rnums = new Int32Array(tab.number);
                let rnums_cols = new Int32Array(tab.number);
                for (const r of tab.children) {
                    let no = 0;
                    for (let ii = 0; ii < r.children.length; ii++) {
                        if ((no < rnums.length) && rnums[no] > 0) {
                            rnums[no]--;
                            no += rnums_cols[no];
                            ii--;
                            continue;
                        }
                        r.children[ii].number = no + 1;
                        if (r.children[ii].sub_number2 > 1 && (no < rnums.length)) {
                            rnums[no] = r.children[ii].sub_number2 - 1;
                            rnums_cols[no] = (r.children[ii].sub_number === 0 ? 1 : r.children[ii].sub_number);
                        }
                        no += (r.children[ii].sub_number === 0 ? 1 : r.children[ii].sub_number);
                    }
                }
            }
            t0 = tt.next;
        }
        if ((t0 !== null && (t0.end_char < this.end_char) && tabs) && t0 !== this.end_token) 
            this.children.push(FragToken._new1338(t0, this.end_token, InstrumentKind.CONTENT));
        return tabs;
    }
    
    _analize_content(top_doc, is_citat, root_kind = InstrumentKind.UNDEFINED) {
        const ContentAnalyzeWhapper = require("./ContentAnalyzeWhapper");
        this.kind = InstrumentKind.CONTENT;
        if (this.begin_token.previous !== null && this.begin_token.previous.is_char(String.fromCharCode(0x1E))) 
            this.begin_token = this.begin_token.previous;
        let wr = new ContentAnalyzeWhapper();
        wr.analyze(this, top_doc, is_citat, root_kind);
        for (const ch of top_doc.children) {
            if (ch.kind === InstrumentKind.HEAD) {
                for (const chh of ch.children) {
                    if (chh.kind === InstrumentKind.EDITIONS && chh.referents !== null) {
                        if (top_doc.referents === null) 
                            top_doc.referents = new Array();
                        for (const r of chh.referents) {
                            if (!top_doc.referents.includes(r)) 
                                top_doc.referents.push(r);
                        }
                    }
                }
            }
        }
    }
    
    static create_zapiska_title(t0, doc) {
        let cou = 0;
        for (let t = t0; t !== null && (cou < 30); t = t.next,cou++) {
            let li = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
            if (li === null) 
                break;
            if (li.numbers.length > 0) 
                break;
            let ok = false;
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.end_token === li.end_token) {
                for (const kv of FragToken.m_zapiska_keywords) {
                    if (npt.end_token.is_value(kv, null)) {
                        ok = true;
                        break;
                    }
                }
            }
            if (t.is_value("ОТВЕТ", null)) {
                if (t.is_newline_after) 
                    ok = true;
                else if (t.next !== null && t.next.is_value("НА", null)) 
                    ok = true;
            }
            if (ok) {
                let res = FragToken._new1338(t0, li.end_token, InstrumentKind.HEAD);
                if (li.begin_token !== t0) {
                    let hh = FragToken._new1338(t0, li.begin_token.previous, InstrumentKind.APPROVED);
                    res.children.push(hh);
                }
                res.children.push(FragToken._new1360(li.begin_token, li.end_token, InstrumentKind.KEYWORD, true));
                return res;
            }
            t = li.end_token;
        }
        return null;
    }
    
    static create_contract_title(t0, doc) {
        if (t0 === null) 
            return null;
        let is_contract = false;
        while ((t0 instanceof TextToken) && t0.next !== null) {
            if (t0.is_table_control_char || !t0.chars.is_letter) 
                t0 = t0.next;
            else 
                break;
        }
        let dt0 = DecreeToken.try_attach(t0, null, false);
        if (dt0 !== null && dt0.typ === DecreeTokenItemType.TYP) 
            is_contract = (dt0.value.includes("ДОГОВОР") || dt0.value.includes("ДОГОВІР") || dt0.value.includes("КОНТРАКТ")) || dt0.value.includes("СОГЛАШЕНИЕ") || dt0.value.includes("УГОДА");
        let cou = 0;
        let t = null;
        let par1 = null;
        for (t = t0; t !== null; t = t.next) {
            if (t instanceof ReferentToken) {
                let rtt = Utils.as(t, ReferentToken);
                if (rtt.begin_token === rtt.end_token) {
                    let r = t.get_referent();
                    if (r instanceof PersonPropertyReferent) {
                        let str = r.toString();
                        if (str.includes("директор") || str.includes("начальник")) {
                        }
                        else 
                            t = t.kit.debed_token(t);
                    }
                    else if ((r instanceof PersonReferent) && (rtt.begin_token.get_referent() instanceof PersonPropertyReferent)) {
                        let str = rtt.begin_token.get_referent().toString();
                        if (str.includes("директор") || str.includes("начальник")) {
                        }
                        else {
                            t = t.kit.debed_token(t);
                            t = t.kit.debed_token(t);
                        }
                    }
                }
            }
        }
        let newlines = 0;
        let types = 0;
        for (t = t0; t !== null && (cou < 300); t = t.next,cou++) {
            if (t.is_char('_')) {
                cou--;
                continue;
            }
            if (t.is_newline_before) {
                newlines++;
                if (newlines > 10) 
                    break;
                while (t.is_table_control_char && t.next !== null) {
                    t = t.next;
                }
                let dt = DecreeToken.try_attach(t, null, false);
                if (dt !== null && dt.typ === DecreeTokenItemType.TYP) {
                    if (((((dt.value === "ОПРЕДЕЛЕНИЕ" || dt.value === "ПОСТАНОВЛЕНИЕ" || dt.value === "РЕШЕНИЕ") || dt.value === "ПРИГОВОР" || dt.value === "ВИЗНАЧЕННЯ") || dt.value === "ПОСТАНОВА" || dt.value === "РІШЕННЯ") || dt.value === "ВИРОК" || dt.value.endsWith("ЗАЯВЛЕНИЕ")) || dt.value.endsWith("ЗАЯВА")) 
                        return null;
                    types++;
                }
                if (t.get_referent() instanceof OrganizationReferent) {
                    let ki = (t.get_referent()).kind;
                    if (ki === OrganizationKind.JUSTICE) 
                        return null;
                }
            }
            if (t.is_value("ДАЛЕЕ", null)) {
            }
            if (t.is_newline_after) 
                continue;
            par1 = ParticipantToken.try_attach(t, null, null, is_contract);
            if (par1 !== null && ((par1.kind === ParticipantTokenKinds.NAMEDAS || par1.kind === ParticipantTokenKinds.NAMEDASPARTS))) {
                t = par1.end_token.next;
                break;
            }
            par1 = null;
        }
        if (par1 === null) 
            return null;
        let par2 = null;
        cou = 0;
        for (; t !== null && (cou < 100); t = t.next,cou++) {
            if (par1.kind === ParticipantTokenKinds.NAMEDASPARTS) 
                break;
            if (t.is_char('_')) {
                cou--;
                continue;
            }
            if (t.is_char('(')) {
                let br2 = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br2 !== null) {
                    t = br2.end_token;
                    continue;
                }
            }
            if (t.is_and) {
            }
            par2 = ParticipantToken.try_attach(t, null, null, true);
            if (par2 !== null) {
                if (par2.kind === ParticipantTokenKinds.NAMEDAS && par2.typ !== par1.typ) 
                    break;
                if (par2.kind === ParticipantTokenKinds.PURE && par2.typ !== par1.typ) {
                    if (t.previous.is_and) 
                        break;
                }
                t = par2.end_token;
            }
            par2 = null;
        }
        if (par1 !== null && par2 !== null && ((par1.typ === null || par2.typ === null))) {
            let stat = new Hashtable();
            for (let tt = t; tt !== null; tt = tt.next) {
                let ttt = tt;
                if (tt instanceof MetaToken) 
                    ttt = (tt).begin_token;
                let tok = ParticipantToken.m_ontology.try_parse(ttt, TerminParseAttr.NO);
                if (tok === null || tok.termin.tag === null) 
                    continue;
                let key = tok.termin.canonic_text;
                if (key === par1.typ || key === par2.typ || key === "СТОРОНА") 
                    continue;
                if (!stat.containsKey(key)) 
                    stat.put(key, 1);
                else 
                    stat.put(key, stat.get(key) + 1);
            }
            let max = 0;
            let best_typ = null;
            for (const kp of stat.entries) {
                if (kp.value > max) {
                    max = kp.value;
                    best_typ = kp.key;
                }
            }
            if (best_typ !== null) {
                if (par1.typ === null) 
                    par1.typ = best_typ;
                else if (par2.typ === null) 
                    par2.typ = best_typ;
            }
        }
        let contr_typs = ParticipantToken.get_doc_types(par1.typ, (par2 === null ? null : par2.typ));
        let t1 = par1.begin_token.previous;
        let lastt1 = null;
        for (; t1 !== null && t1.begin_char >= t0.begin_char; t1 = t1.previous) {
            if (t1.is_newline_after) {
                lastt1 = t1;
                if (t1.is_char(',')) 
                    continue;
                if (t1.next === null) 
                    break;
                if (t1.next.chars.is_letter && t1.next.chars.is_all_lower) 
                    continue;
                break;
            }
        }
        if (t1 === null) 
            t1 = lastt1;
        if (t1 === null) 
            return null;
        let p1 = InstrumentParticipant._new1429(par1.typ);
        if (par1.parts !== null) {
            for (const p of par1.parts) {
                p1.add_slot(InstrumentParticipant.ATTR_REF, p, false, 0);
            }
        }
        let p2 = null;
        let all_parts = new Array();
        all_parts.push(p1);
        if (par1.kind === ParticipantTokenKinds.NAMEDASPARTS) {
            p1.typ = "СТОРОНА 1";
            p1.add_slot(InstrumentParticipant.ATTR_REF, par1.parts[0], false, 0);
            for (let ii = 1; ii < par1.parts.length; ii++) {
                let pp = InstrumentParticipant._new1429(("СТОРОНА " + (ii + 1)));
                pp.add_slot(InstrumentParticipant.ATTR_REF, par1.parts[ii], false, 0);
                if (ii === 1) 
                    p2 = pp;
                all_parts.push(pp);
            }
            for (const pp of par1.parts) {
                doc.add_slot(InstrumentReferent.ATTR_SOURCE, pp, false, 0);
            }
        }
        let title = FragToken._new1338(t0, t0, InstrumentKind.HEAD);
        let add = false;
        let nam_beg = null;
        let nam_end = null;
        let dttyp = null;
        let dt00 = null;
        let nam_beg2 = null;
        let nam_end2 = null;
        for (t = t0; t !== null && t.end_char <= t1.end_char; t = t.next) {
            if (t.get_referent() instanceof DecreeReferent) {
                if (t.is_newline_before || ((t.previous !== null && t.previous.is_table_control_char))) 
                    t = t.kit.debed_token(t);
            }
            let new_line_bef = t.is_newline_before;
            if (t.previous !== null && t.previous.is_table_control_char) 
                new_line_bef = true;
            let dt = DecreeToken.try_attach(t, dt00, false);
            if (dt !== null) {
                dt00 = dt;
                if ((dt.typ === DecreeTokenItemType.DATE || dt.typ === DecreeTokenItemType.NUMBER || ((dt.typ === DecreeTokenItemType.TYP && new_line_bef))) || ((dt.typ === DecreeTokenItemType.TERR && new_line_bef))) {
                    if (nam_beg !== null && nam_end === null) 
                        nam_end = t.previous;
                    if (nam_beg2 !== null && nam_end2 === null) 
                        nam_end2 = t.previous;
                    if (((dt.typ === DecreeTokenItemType.TYP && doc.typ !== null && !doc.typ.includes("ДОГОВОР")) && !doc.typ.includes("ДОГОВІР") && !is_contract) && dt.value !== null && ((dt.value.includes("ДОГОВОР") || dt.value.includes("ДОГОВІР")))) {
                        doc.typ = null;
                        doc.number = 0;
                        doc.reg_number = null;
                        is_contract = true;
                        nam_beg = (nam_end = null);
                        title.children.splice(0, title.children.length);
                    }
                    FragToken._add_title_attr(doc, title, dt);
                    title.end_token = (t = dt.end_token);
                    if (dt.typ === DecreeTokenItemType.TYP) 
                        dttyp = dt.value;
                    add = true;
                    continue;
                }
            }
            dt00 = null;
            if (new_line_bef && t !== t0) {
                let edss = FragToken._create_editions(t);
                if (edss !== null) {
                    if (nam_beg !== null && nam_end === null) 
                        nam_end = t.previous;
                    if (nam_beg2 !== null && nam_end2 === null) 
                        nam_end2 = t.previous;
                    title.children.push(edss);
                    title.end_token = edss.end_token;
                    break;
                }
                let it1 = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
                if (it1 !== null && it1.numbers.length > 0 && it1.num_typ === NumberTypes.DIGIT) {
                    title.end_token = t.previous;
                    if (nam_beg !== null && nam_end === null) 
                        nam_end = t.previous;
                    if (nam_beg2 !== null && nam_end2 === null) 
                        nam_end2 = t.previous;
                    break;
                }
                if ((t.is_value("О", "ПРО") || t.is_value("ОБ", null) || t.is_value("НА", null)) || t.is_value("ПО", null)) {
                    if (nam_beg === null) {
                        nam_beg = t;
                        continue;
                    }
                    else if (nam_beg2 === null && nam_end !== null) {
                        nam_beg2 = t;
                        continue;
                    }
                }
                if (add) 
                    title.end_token = t.previous;
                add = false;
                let r = t.get_referent();
                if ((r instanceof GeoReferent) || (r instanceof DateReferent) || (r instanceof DecreeReferent)) {
                    if (nam_beg !== null && nam_end === null) 
                        nam_end = t.previous;
                    if (nam_beg2 !== null && nam_end2 === null) 
                        nam_end2 = t.previous;
                }
            }
            if ((dttyp !== null && nam_beg === null && t.chars.is_cyrillic_letter) && (t instanceof TextToken)) {
                if (t.is_value("МЕЖДУ", "МІЖ")) {
                    let pp = ParticipantToken.try_attach_to_exist(t.next, p1, p2);
                    if (pp !== null && pp.end_token.next !== null && pp.end_token.next.is_and) {
                        let pp2 = ParticipantToken.try_attach_to_exist(pp.end_token.next.next, p1, p2);
                        if (pp2 !== null) {
                            let fr = FragToken._new1338(t, pp2.end_token, InstrumentKind.PLACE);
                            if (fr.referents === null) 
                                fr.referents = new Array();
                            fr.referents.push(pp.referent);
                            fr.referents.push(pp2.referent);
                            title.children.push(fr);
                            t = title.end_token = fr.end_token;
                            if (t.next !== null) {
                                if (t.next.is_value("О", "ПРО") || t.next.is_value("ОБ", null)) {
                                    nam_beg = t.next;
                                    nam_end = null;
                                    nam_beg2 = (nam_end2 = null);
                                }
                            }
                            continue;
                        }
                    }
                }
                nam_beg = t;
            }
            else if (t.is_value("МЕЖДУ", "МІЖ") || t.is_value("ЗАКЛЮЧИТЬ", "УКЛАСТИ")) {
                if (nam_beg !== null && nam_end === null) 
                    nam_end = t.previous;
                if (nam_beg2 !== null && nam_end2 === null) 
                    nam_end2 = t.previous;
            }
            if (((new_line_bef && t.whitespaces_before_count > 15)) || t.is_table_control_char) {
                if (nam_beg !== null && nam_end === null && nam_beg !== t) 
                    nam_end = t.previous;
                if (nam_beg2 !== null && nam_end2 === null && nam_beg2 !== t) 
                    nam_end2 = t.previous;
            }
        }
        if (nam_beg !== null && nam_end === null && t1 !== null) 
            nam_end = t1;
        if (nam_beg2 !== null && nam_end2 === null && t1 !== null) 
            nam_end2 = t1;
        if (nam_end !== null && nam_beg !== null) {
            let val = MiscHelper.get_text_value(nam_beg, nam_end, GetTextAttr.KEEPQUOTES);
            if (val !== null && val.length > 3) {
                let nam = FragToken._new1392(nam_beg, nam_end, InstrumentKind.NAME, val);
                title.children.push(nam);
                title.sort_children();
                if (nam_end.end_char > title.end_char) 
                    title.end_token = nam_end;
                if (dttyp !== null && !val.includes(dttyp)) 
                    val = (dttyp + " " + val);
                if (nam_beg2 !== null && nam_end2 !== null) {
                    let val2 = MiscHelper.get_text_value(nam_beg2, nam_end2, GetTextAttr.KEEPQUOTES);
                    if (val2 !== null && val2.length > 3) {
                        nam = FragToken._new1392(nam_beg2, nam_end2, InstrumentKind.NAME, val2);
                        title.children.push(nam);
                        title.sort_children();
                        if (nam_end2.end_char > title.end_char) 
                            title.end_token = nam_end2;
                        val = (val + " " + val2);
                    }
                }
                doc.name = val;
            }
        }
        if (title.children.length > 0 && title.children[0].begin_char > title.begin_char) 
            title.children.splice(0, 0, FragToken._new1338(title.begin_token, title.children[0].begin_token.previous, InstrumentKind.UNDEFINED));
        if (((doc.typ === "ДОГОВОР" || doc.typ === "ДОГОВІР")) && par1.kind !== ParticipantTokenKinds.NAMEDASPARTS) {
            if (title.children.length > 0 && title.children[0].kind === InstrumentKind.TYP) {
                let addi = null;
                for (const ch of title.children) {
                    if (ch.kind === InstrumentKind.NAME) {
                        if (ch.begin_token.morph.class0.is_preposition) {
                            let npt = NounPhraseHelper.try_parse(ch.begin_token.next, NounPhraseParseAttr.NO, 0, null);
                            if (npt !== null) {
                                addi = npt.noun.get_source_text().toUpperCase();
                                let vvv = Morphology.get_all_wordforms(addi, null);
                                for (const fi of vvv) {
                                    if (fi._case.is_genitive) {
                                        addi = fi.normal_case;
                                        if (addi.endsWith("НЬЯ")) 
                                            addi = addi.substring(0, 0 + addi.length - 2) + "ИЯ";
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            let npt = NounPhraseHelper.try_parse(ch.begin_token, NounPhraseParseAttr.NO, 0, null);
                            if (npt !== null && npt.end_char <= ch.end_char) 
                                addi = npt.noun.get_source_text().toUpperCase();
                        }
                        break;
                    }
                }
                if (addi !== null) {
                    if (addi.startsWith("ОКАЗАН")) 
                        addi = "УСЛУГ";
                    else if (addi.startsWith("НАДАН")) 
                        addi = "ПОСЛУГ";
                    doc.typ = (doc.typ + " " + addi);
                    if (doc.typ === doc.name) 
                        doc.name = null;
                }
                else if (contr_typs.length === 1) {
                    if (doc.typ === null || (doc.typ.length < contr_typs[0].length)) 
                        doc.typ = contr_typs[0];
                }
                else if (contr_typs.length > 0 && doc.typ === null) 
                    doc.typ = contr_typs[0];
            }
        }
        if (doc.typ === "ДОГОВОР УСЛУГ") 
            doc.typ = "ДОГОВОР ОКАЗАНИЯ УСЛУГ";
        if (doc.typ === "ДОГОВІР ПОСЛУГ") 
            doc.typ = "ДОГОВІР НАДАННЯ ПОСЛУГ";
        if (doc.typ === null && contr_typs.length > 0) 
            doc.typ = contr_typs[0];
        let ad = t0.kit.get_analyzer_data_by_analyzer_name(InstrumentAnalyzer.ANALYZER_NAME);
        if (ad === null) 
            return null;
        doc.add_slot(InstrumentReferent.ATTR_PARTICIPANT, p1, false, 0);
        let rt = par1.attach_first(p1, title.end_char + 1, (par2 === null ? 0 : par2.begin_char - 1));
        if (rt === null) 
            return null;
        if (par2 === null) {
            if (p1.slots.length < 2) 
                return null;
            if (!is_contract) 
                return null;
            let tt2 = null;
            for (let ttt = rt.end_token.next; ttt !== null; ttt = ttt.next) {
                if (ttt.is_comma || ttt.is_and) 
                    continue;
                if (ttt.morph.class0.is_preposition) 
                    continue;
                let npt = NounPhraseHelper.try_parse(ttt, NounPhraseParseAttr.PARSENUMERICASADJECTIVE, 0, null);
                if (npt !== null) {
                    if (npt.end_token.is_value("СТОРОНА", null)) {
                        ttt = npt.end_token;
                        continue;
                    }
                }
                tt2 = ttt;
                break;
            }
            if (tt2 !== null && par1 !== null) {
                let stat = new Hashtable();
                let cou1 = 0;
                for (let ttt = tt2; ttt !== null; ttt = ttt.next) {
                    if (ttt.is_value(par1.typ, null)) {
                        cou1++;
                        continue;
                    }
                    let tok = ParticipantToken.m_ontology.try_parse(ttt, TerminParseAttr.NO);
                    if (tok !== null && tok.termin.tag !== null && tok.termin.canonic_text !== "СТОРОНА") {
                        if (!stat.containsKey(tok.termin.canonic_text)) 
                            stat.put(tok.termin.canonic_text, 1);
                        else 
                            stat.put(tok.termin.canonic_text, stat.get(tok.termin.canonic_text) + 1);
                    }
                }
                let typ2 = null;
                if (cou1 > 10) {
                    let min_cou = Math.floor(((cou1) * 0.6));
                    let max_cou = Math.floor(((cou1) * 1.4));
                    for (const kp of stat.entries) {
                        if (kp.value >= min_cou && kp.value <= max_cou) {
                            typ2 = kp.key;
                            break;
                        }
                    }
                }
                if (typ2 !== null) 
                    par2 = ParticipantToken._new1436(tt2, tt2, typ2);
            }
        }
        rt.referent = (p1 = Utils.as(ad.register_referent(p1), InstrumentParticipant));
        t0.kit.embed_token(rt);
        if (par2 !== null) {
            p2 = InstrumentParticipant._new1429(par2.typ);
            if (par2.parts !== null) {
                for (const p of par2.parts) {
                    p2.add_slot(InstrumentParticipant.ATTR_REF, p, false, 0);
                }
            }
            p2 = Utils.as(ad.register_referent(p2), InstrumentParticipant);
            doc.add_slot(InstrumentReferent.ATTR_PARTICIPANT, p2, false, 0);
            rt = par2.attach_first(p2, rt.end_char + 1, 0);
            if (rt === null) 
                return title;
            t0.kit.embed_token(rt);
        }
        else if (all_parts.length > 1) {
            for (const pp of all_parts) {
                let ppp = Utils.as(ad.register_referent(pp), InstrumentParticipant);
                doc.add_slot(InstrumentReferent.ATTR_PARTICIPANT, ppp, false, 0);
                if (pp === all_parts[1]) 
                    p2 = ppp;
            }
        }
        let req_regim = 0;
        for (t = rt.next; t !== null; t = ((t === null ? null : t.next))) {
            if (t.begin_char >= 712 && (t.begin_char < 740)) {
            }
            if (t.is_newline_before) {
                let ii = InstrToken1.parse(t, true, null, 0, null, false, 0, true, false);
                if (ii !== null && ii.title_typ === InstrToken1StdTitleType.REQUISITES) {
                    req_regim = 5;
                    t = ii.end_token;
                    continue;
                }
            }
            if (t.is_value("ПРИЛОЖЕНИЕ", null) && t.is_newline_before) {
            }
            if (req_regim === 5 && t.is_char(String.fromCharCode(0x1E))) {
                let rows = TableHelper.try_parse_rows(t, 0, true);
                if (rows !== null && rows.length > 0 && ((rows[0].cells.length === 2 || rows[0].cells.length === 3))) {
                    let i0 = rows[0].cells.length - 2;
                    let rt0 = ParticipantToken.try_attach_to_exist(rows[0].cells[i0].begin_token, p1, p2);
                    let rt1 = ParticipantToken.try_attach_to_exist(rows[0].cells[i0 + 1].begin_token, p1, p2);
                    if (rt0 !== null && rt1 !== null && rt1.referent !== rt0.referent) {
                        for (let ii = 0; ii < rows.length; ii++) {
                            if (rows[ii].cells.length === rows[0].cells.length) {
                                rt = ParticipantToken.try_attach_requisites(rows[ii].cells[i0].begin_token, Utils.as(rt0.referent, InstrumentParticipant), Utils.as(rt1.referent, InstrumentParticipant), false);
                                if (rt !== null && rt.end_char <= rows[ii].cells[i0].end_char) 
                                    t0.kit.embed_token(rt);
                                rt = ParticipantToken.try_attach_requisites(rows[ii].cells[i0 + 1].begin_token, Utils.as(rt1.referent, InstrumentParticipant), Utils.as(rt0.referent, InstrumentParticipant), false);
                                if (rt !== null && rt.end_char <= rows[ii].cells[i0 + 1].end_char) 
                                    t0.kit.embed_token(rt);
                            }
                        }
                        t = rows[rows.length - 1].end_token;
                        req_regim = 0;
                        continue;
                    }
                }
            }
            rt = ParticipantToken.try_attach_to_exist(t, p1, p2);
            if (rt === null && req_regim > 0) {
                for (let tt = t; tt !== null; tt = tt.next) {
                    if (tt.is_table_control_char) {
                    }
                    else if (tt.is_char_of(".)") || (tt instanceof NumberToken)) {
                    }
                    else {
                        rt = ParticipantToken.try_attach_to_exist(tt, p1, p2);
                        if (rt !== null && !t.is_table_control_char) 
                            rt.begin_token = t;
                        break;
                    }
                }
            }
            if (rt === null) {
                req_regim--;
                continue;
            }
            let ps = new Array();
            ps.push(Utils.as(rt.referent, InstrumentParticipant));
            if (req_regim > 0) {
                let rt1 = ParticipantToken.try_attach_requisites(rt.end_token.next, ps[0], (ps[0] === p1 ? p2 : p1), false);
                if (rt1 !== null) 
                    rt.end_token = rt1.end_token;
            }
            t0.kit.embed_token(rt);
            t = rt;
            if (req_regim <= 0) {
                if (t.is_newline_before) {
                }
                else if (t.previous !== null && t.previous.is_table_control_char) {
                }
                else 
                    continue;
            }
            else {
            }
            if (rt.end_token.next !== null && rt.end_token.next.is_table_control_char && !rt.end_token.next.is_char(String.fromCharCode(0x1E))) {
                for (let tt = rt.end_token.next; tt !== null; tt = tt.next) {
                    if (tt.is_table_control_char) {
                    }
                    else if (tt.is_char_of(".)") || (tt instanceof NumberToken)) {
                    }
                    else {
                        let rt1 = ParticipantToken.try_attach_requisites(tt, (ps[0] === p1 ? p2 : p1), ps[0], true);
                        if (rt1 !== null) {
                            ps.push(Utils.as(rt1.referent, InstrumentParticipant));
                            t0.kit.embed_token(rt1);
                            t = rt1;
                        }
                        break;
                    }
                }
            }
            t = t.next;
            if (t === null) 
                break;
            while (t.is_table_control_char && t.next !== null) {
                t = t.next;
            }
            let cur = 0;
            for (; t !== null; t = t.next) {
                if (t.is_table_control_char && t.is_char(String.fromCharCode(0x1F))) {
                    req_regim = 0;
                    break;
                }
                rt = ParticipantToken.try_attach_requisites(t, ps[cur], (p1 === ps[cur] ? p2 : p1), req_regim <= 0);
                if (rt !== null) {
                    req_regim = 5;
                    t0.kit.embed_token(rt);
                    t = rt;
                }
                else {
                    t = t.previous;
                    break;
                }
                if (ps.length === 2 && t.next.is_table_control_char) {
                    let tt = t.next;
                    for (; tt !== null; tt = tt.next) {
                        if (tt.is_table_control_char && tt.is_char(String.fromCharCode(0x1F))) 
                            break;
                        if (tt.is_table_control_char) {
                            cur = 1 - cur;
                            if (TableHelper.is_cell_end(tt) && TableHelper.is_row_end(tt.next)) 
                                tt = tt.next;
                            t = tt;
                            continue;
                        }
                        break;
                    }
                    continue;
                }
                if (t.is_table_control_char && ps.length === 2) {
                    if (TableHelper.is_cell_end(t) && TableHelper.is_row_end(t.next)) 
                        t = t.next;
                    cur = 1 - cur;
                    continue;
                }
                if (!t.is_newline_after) 
                    continue;
                let it1 = InstrToken1.parse(t.next, true, null, 0, null, false, 0, false, false);
                if (it1 !== null) {
                    if (it1.all_upper || it1.title_typ !== InstrToken1StdTitleType.UNDEFINED || it1.numbers.length > 0) 
                        break;
                }
            }
        }
        return title;
    }
    
    static create_project_title(t0, doc) {
        if (t0 === null) 
            return null;
        let is_project = false;
        let is_entered = false;
        let is_typ = false;
        if (t0.is_table_control_char && t0.next !== null) 
            t0 = t0.next;
        let title = FragToken._new1338(t0, t0, InstrumentKind.HEAD);
        let t = null;
        for (t = t0; t !== null; t = t.next) {
            if (t.is_table_control_char) 
                continue;
            if (t.get_referent() instanceof DecreeReferent) 
                t = t.kit.debed_token(t);
            if ((t instanceof TextToken) && (((t).term === "ПРОЕКТ" || (t).term === "ЗАКОНОПРОЕКТ"))) {
                if ((t.is_value("ПРОЕКТ", null) && t === t0 && (t.next instanceof ReferentToken)) && (t.next.get_referent() instanceof OrganizationReferent)) 
                    return null;
                is_project = true;
                title.children.push(FragToken._new1357(t, t, InstrumentKind.KEYWORD, true));
                doc.add_slot(InstrumentReferent.ATTR_TYPE, "ПРОЕКТ", false, 0);
                continue;
            }
            let tt = FragToken._attach_project_enter(t);
            if (tt !== null) {
                is_entered = true;
                title.children.push(FragToken._new1338(t, tt, InstrumentKind.APPROVED));
                t = tt;
                continue;
            }
            tt = FragToken._attach_project_misc(t);
            if (tt !== null) {
                title.children.push(FragToken._new1338(t, tt, (tt.is_value("ЧТЕНИЕ", "ЧИТАННЯ") ? InstrumentKind.EDITIONS : InstrumentKind.UNDEFINED)));
                t = tt;
                continue;
            }
            if (t.is_newline_before && (t.get_referent() instanceof DecreeReferent) && ((is_project || is_entered))) 
                t = t.kit.debed_token(t);
            let dt = DecreeToken.try_attach(t, null, false);
            if (dt !== null) {
                if ((dt.typ === DecreeTokenItemType.DATE || dt.typ === DecreeTokenItemType.TYP || dt.typ === DecreeTokenItemType.TERR) || dt.typ === DecreeTokenItemType.NUMBER) {
                    if (FragToken._add_title_attr(doc, title, dt)) {
                        if (dt.typ === DecreeTokenItemType.TYP) 
                            is_typ = true;
                        t = dt.end_token;
                        continue;
                    }
                }
            }
            break;
        }
        if (is_project) {
        }
        else if (is_entered && is_typ) {
        }
        else 
            return null;
        title.end_token = t.previous;
        let t00 = t;
        let t11 = null;
        let is_br = BracketHelper.can_be_start_of_sequence(t00, false, false);
        for (t = t00; t !== null; t = t.next) {
            if (t.is_newline_after) {
                if (t.next !== null && t.next.chars.is_all_lower) 
                    continue;
            }
            if (t.whitespaces_after_count > 15) {
                t11 = t;
                break;
            }
            else if (t.is_newline_after && t.next !== null) {
                if (MorphClass.ooEq(t.next.get_morph_class_in_dictionary(), MorphClass.VERB)) {
                    t11 = t;
                    break;
                }
                if (t.next.chars.is_capital_upper && t.next.morph.class0.is_verb) {
                    t11 = t;
                    break;
                }
            }
            if (t.is_whitespace_after && is_br && BracketHelper.can_be_end_of_sequence(t, false, null, false)) {
                t11 = t;
                break;
            }
            if (!t.is_newline_before) 
                continue;
            let it = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
            if (it !== null && it.numbers.length > 0 && it.last_number === 1) {
                t11 = t.previous;
                break;
            }
        }
        if (t11 === null) 
            return null;
        let nam = FragToken._new1357(t00, t11, InstrumentKind.NAME, true);
        doc.add_slot(InstrumentBlockReferent.ATTR_NAME, nam.value, false, 0);
        title.children.push(nam);
        title.end_token = t11;
        let appr1 = FragToken._create_approved(t11.next);
        if (appr1 !== null) {
            title.children.push(appr1);
            title.end_token = appr1.end_token;
        }
        return title;
    }
    
    static _attach_project_misc(t) {
        if (t === null) 
            return null;
        let br = false;
        if (t.is_char('(') && t.next !== null) {
            br = true;
            t = t.next;
        }
        if (t.morph.class0.is_preposition) 
            t = t.next;
        if ((t instanceof NumberToken) && t.next !== null && t.next.is_value("ЧТЕНИЕ", "ЧИТАННЯ")) {
            t = t.next;
            if (br && t.next !== null && t.next.is_char(')')) 
                t = t.next;
            return t;
        }
        return null;
    }
    
    static _attach_project_enter(t) {
        if (t === null) 
            return null;
        if (t.is_value("ВНОСИТЬ", "ВНОСИТИ") || t.is_value("ВНЕСТИ", null)) {
        }
        else 
            return null;
        let cou = 0;
        for (t = t.next; t !== null; t = t.next) {
            if (t.morph.class0.is_preposition || t.morph.class0.is_conjunction) 
                continue;
            if (((t.is_value("ПЕРИОД", "ПЕРІОД") || t.is_value("РАССМОТРЕНИЕ", "РОЗГЛЯД") || t.is_value("ДЕПУТАТ", null)) || t.is_value("ПОЛНОМОЧИЕ", "ПОВНОВАЖЕННЯ") || t.is_value("ПЕРЕДАЧА", null)) || t.is_value("ИСПОЛНЕНИЕ", "ВИКОНАННЯ")) 
                continue;
            let r = t.get_referent();
            if (r instanceof OrganizationReferent) {
                if (cou > 0 && t.is_newline_before) 
                    return t.previous;
                cou++;
                continue;
            }
            if ((r instanceof PersonReferent) || (r instanceof PersonPropertyReferent)) {
                cou++;
                continue;
            }
            if (t.is_newline_before) 
                return t.previous;
        }
        return null;
    }
    
    static _create_justice_participants(title, doc) {
        let typ = doc.typ;
        let ok = ((((typ === "ПОСТАНОВЛЕНИЕ" || typ === "РЕШЕНИЕ" || typ === "ОПРЕДЕЛЕНИЕ") || typ === "ПРИГОВОР" || ((typ != null ? typ : "")).endsWith("ЗАЯВЛЕНИЕ")) || typ === "ПОСТАНОВА" || typ === "РІШЕННЯ") || typ === "ВИЗНАЧЕННЯ" || typ === "ВИРОК") || ((typ != null ? typ : "")).endsWith("ЗАЯВА");
        for (const s of doc.slots) {
            if (s.type_name === InstrumentReferent.ATTR_SOURCE && (s.value instanceof OrganizationReferent)) {
                let ki = (s.value).kind;
                if (ki === OrganizationKind.JUSTICE) 
                    ok = true;
            }
            else if (s.type_name === InstrumentReferent.ATTR_CASENUMBER) 
                ok = true;
        }
        let pist = null;
        let potv = null;
        let pzayav = null;
        let cou = 0;
        let t = null;
        let tmp = new StringBuilder();
        for (t = title.begin_token; t !== null && t.end_char <= title.end_char; t = t.next) {
            if (t.is_newline_before) {
            }
            else if (t.previous !== null && t.previous.is_table_control_char) {
            }
            else 
                continue;
            if (t.next !== null && ((t.next.is_char(':') || t.next.is_table_control_char))) {
                if (t.is_value("ЗАЯВИТЕЛЬ", "ЗАЯВНИК")) {
                    pzayav = FragToken._create_just_participant(t.next, null);
                    if (pzayav !== null) {
                        pzayav.begin_token = t;
                        (pzayav.referent).typ = "ЗАЯВИТЕЛЬ";
                    }
                }
                else if (t.is_value("ИСТЕЦ", "ПОЗИВАЧ")) {
                    pist = FragToken._create_just_participant(t.next, null);
                    if (pist !== null) {
                        pist.begin_token = t;
                        (pist.referent).typ = "ИСТЕЦ";
                    }
                }
                else if (t.is_value("ОТВЕТЧИК", "ВІДПОВІДАЧ") || t.is_value("ДОЛЖНИК", "БОРЖНИК")) {
                    potv = FragToken._create_just_participant(t.next, null);
                    if (potv !== null) {
                        potv.begin_token = t;
                        (potv.referent).typ = "ОТВЕТЧИК";
                    }
                }
            }
        }
        for (t = title.end_token.next; t !== null; t = t.next) {
            if ((++cou) > 1000) 
                break;
            if (t.is_value("ЗАЯВЛЕНИЕ", "ЗАЯВА")) {
            }
            else if (t.is_value("ИСК", "ПОЗОВ") && t.previous !== null && t.previous.morph.class0.is_preposition) {
            }
            else 
                continue;
            if (t.next !== null && t.next.is_char('(')) {
                let br = BracketHelper.try_parse(t.next, BracketParseAttr.NO, 100);
                if (br !== null) 
                    t = br.end_token;
            }
            if (pist !== null) 
                break;
            pist = FragToken._create_just_participant(t.next, (t.next.morph.language.is_ua ? "ПОЗИВАЧ" : "ИСТЕЦ"));
            if (pist === null) 
                break;
            t = pist.end_token.next;
            if (t !== null && t.is_char(',')) 
                t = t.next;
            if (t === null) 
                break;
            if (potv !== null) 
                break;
            if (t.is_value("О", "ПРО") && t.next !== null && t.next.is_value("ПРИВЛЕЧЕНИЕ", "ЗАЛУЧЕННЯ")) {
                if (t.next.morph.language.is_ua) 
                    tmp.append("ПРО ПРИТЯГНЕННЯ");
                else 
                    tmp.append("О ПРИВЛЕЧЕНИИ");
                t = t.next.next;
                potv = FragToken._create_just_participant(t, (t.next.morph.language.is_ua ? "ВІДПОВІДАЧ" : "ОТВЕТЧИК"));
            }
            else if (t.is_value("О", "ПРО") && t.next !== null && t.next.is_value("ПРИЗНАНИЕ", "ВИЗНАННЯ")) {
                if (t.next.morph.language.is_ua) 
                    tmp.append("ПРО ВИЗНАННЯ");
                else 
                    tmp.append("О ПРИЗНАНИИ");
                t = t.next.next;
                potv = FragToken._create_just_participant(t, (t.next.morph.language.is_ua ? "ВІДПОВІДАЧ" : "ОТВЕТЧИК"));
            }
            else if (t.is_value("О", "ПРО") && t.next !== null && t.next.is_value("ВЗЫСКАНИЕ", "СТЯГНЕННЯ")) {
                if (t.next.morph.language.is_ua) 
                    tmp.append("ПРО СТЯГНЕННЯ");
                else 
                    tmp.append("О ВЗЫСКАНИИ");
                t = t.next.next;
                if (t !== null && t.morph.class0.is_preposition) 
                    t = t.next;
                potv = FragToken._create_just_participant(t, (t.next.morph.language.is_ua ? "ВІДПОВІДАЧ" : "ОТВЕТЧИК"));
            }
            else {
                if (t === null || !t.is_value("К", "ПРО")) 
                    break;
                potv = FragToken._create_just_participant(t.next, (t.next.morph.language.is_ua ? "ВІДПОВІДАЧ" : "ОТВЕТЧИК"));
            }
            if (potv !== null) 
                t = potv.end_token.next;
            break;
        }
        if (((pist === null && pzayav === null)) || ((potv === null && tmp.length === 0))) 
            return;
        let ad = title.kit.get_analyzer_data_by_analyzer_name(InstrumentAnalyzer.ANALYZER_NAME);
        if (pzayav !== null) {
            pzayav.referent = ad.register_referent(pzayav.referent);
            pzayav.kit.embed_token(pzayav);
            doc.add_slot(InstrumentReferent.ATTR_PARTICIPANT, pzayav.referent, false, 0);
        }
        if (pist !== null) {
            pist.referent = ad.register_referent(pist.referent);
            pist.kit.embed_token(pist);
            doc.add_slot(InstrumentReferent.ATTR_PARTICIPANT, pist.referent, false, 0);
        }
        if (potv !== null) {
            potv.referent = ad.register_referent(potv.referent);
            potv.kit.embed_token(potv);
            doc.add_slot(InstrumentReferent.ATTR_PARTICIPANT, potv.referent, false, 0);
        }
        if (t !== null && t.is_char(',')) 
            t = t.next;
        if (t === null) 
            return;
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
        if (npt !== null && npt.end_token.is_value("ЛИЦО", "ОСОБА")) {
            t = npt.end_token.next;
            if (t !== null && t.is_char(':')) 
                t = t.next;
            for (; t !== null; t = t.next) {
                if (t.is_char(',')) 
                    continue;
                let tret = FragToken._create_just_participant(t, (t.morph.language.is_ua ? "ТРЕТЯ ОСОБА" : "ТРЕТЬЕ ЛИЦО"));
                if (tret === null) 
                    break;
                tret.referent = ad.register_referent(tret.referent);
                tret.kit.embed_token(tret);
                doc.add_slot(InstrumentReferent.ATTR_PARTICIPANT, tret.referent, false, 0);
                t = tret;
            }
        }
        let tt00 = t;
        while (t !== null) {
            let t0 = t;
            if (!t.is_value("О", "ПРО") && !t.is_value("ОБ", null)) {
                if (tmp.length === 0) {
                    if (t !== tt00) 
                        break;
                    let cou2 = 0;
                    let has_isk = true;
                    for (let tt = t.next; tt !== null && (cou2 < 140); tt = tt.next,cou2++) {
                        if (tt.is_value("ЗАЯВЛЕНИЕ", "ЗАЯВА") || tt.is_value("ИСК", "ПОЗОВ")) {
                            cou2 = 0;
                            has_isk = true;
                        }
                        if ((has_isk && ((tt.is_value("О", "ПРО") || tt.is_value("ОБ", null))) && tt.next.get_morph_class_in_dictionary().is_noun) && tt.next.morph._case.is_prepositional) {
                            tmp.append(MiscHelper.get_text_value(tt, tt.next, GetTextAttr.NO));
                            t0 = tt;
                            t = tt.next.next;
                            break;
                        }
                    }
                    if (tmp.length === 0 || t === null) 
                        break;
                }
            }
            let arefs = new Array();
            let t1 = null;
            for (; t !== null; t = t.next) {
                if (t.is_newline_before && t !== t0) {
                    if (t.whitespaces_before_count > 15) 
                        break;
                }
                if (t.is_value("ПРИ", "ЗА") && t.next !== null && t.next.is_value("УЧАСТИЕ", "УЧАСТЬ")) 
                    break;
                if (t.is_value("БЕЗ", null) && t.next !== null && t.next.is_value("ВЫЗОВ", null)) 
                    break;
                let r = t.get_referent();
                if (r !== null) {
                    if (r instanceof MoneyReferent) {
                        arefs.push(r);
                        if (t.previous !== null && t.previous.is_value("СУММА", "СУМА")) {
                        }
                        else 
                            tmp.append(" СУММЫ");
                        t1 = t;
                        continue;
                    }
                    if ((r instanceof DecreePartReferent) || (r instanceof DecreeReferent)) {
                        arefs.push(r);
                        if (t.previous !== null && t.previous.is_value("ПО", null)) 
                            tmp.length = tmp.length - 3;
                        t1 = t;
                        for (let tt = t.next; tt !== null; tt = tt.next) {
                            if (tt.is_comma_and) 
                                continue;
                            r = tt.get_referent();
                            if ((r instanceof DecreePartReferent) || (r instanceof DecreeReferent)) {
                                arefs.push(r);
                                t1 = (t = tt);
                                continue;
                            }
                            break;
                        }
                        break;
                    }
                    if (r instanceof PersonReferent) 
                        continue;
                    break;
                }
                if (t.is_char_of(",.") || t.is_hiphen) 
                    break;
                if (t instanceof TextToken) {
                    let term = (t).term;
                    if (term === "ИП") 
                        continue;
                }
                if (t.is_and) {
                    if (t.next === null) 
                        break;
                    if (t.next.is_value("О", "ПРО") || t.next.is_value("ОБ", null)) {
                        t = t.next;
                        break;
                    }
                }
                if (t.is_newline_after) {
                    if (t.next === null) {
                    }
                    else if (t.next.chars.is_all_lower) {
                    }
                    else 
                        break;
                }
                if (t.is_whitespace_before && tmp.length > 0) 
                    tmp.append(' ');
                tmp.append(MiscHelper.get_text_value(t, t, GetTextAttr.NO));
                t1 = t;
            }
            if (tmp.length > 10 && t1 !== null) {
                let art = InstrumentArtefact._new1443("предмет");
                let str = tmp.toString();
                str = Utils.replaceString(str, "В РАЗМЕРЕ СУММЫ", "СУММЫ").trim();
                if (str.endsWith("В РАЗМЕРЕ")) 
                    str = str.substring(0, 0 + str.length - 9) + "СУММЫ";
                if (str.endsWith("В СУММЕ")) 
                    str = str.substring(0, 0 + str.length - 7) + "СУММЫ";
                art.value = str;
                for (const a of arefs) {
                    art.add_slot(InstrumentArtefact.ATTR_REF, a, false, 0);
                }
                let rta = new ReferentToken(art, t0, t1);
                rta.referent = ad.register_referent(rta.referent);
                doc.add_slot(InstrumentReferent.ATTR_ARTEFACT, rta.referent, false, 0);
                rta.kit.embed_token(rta);
                tmp.length = 0;
            }
            else 
                break;
        }
        for (t = (potv === null ? t : potv.next); t !== null; t = t.next) {
            let rt = null;
            let check_del = false;
            if (t.is_value("ИСТЕЦ", "ПОЗИВАЧ") && pist !== null) {
                rt = new ReferentToken(pist.referent, t, t);
                check_del = true;
            }
            else if (t.is_value("ЗАЯВИТЕЛЬ", "ЗАЯВНИК") && pzayav !== null) {
                rt = new ReferentToken(pzayav.referent, t, t);
                check_del = true;
            }
            else if (((t.is_value("ОТВЕТЧИК", "ВІДПОВІДАЧ") || t.is_value("ДОЛЖНИК", "БОРЖНИК"))) && potv !== null) {
                rt = new ReferentToken(potv.referent, t, t);
                check_del = true;
            }
            else {
                let r = t.get_referent();
                if (!((r instanceof OrganizationReferent)) && !((r instanceof PersonReferent))) 
                    continue;
                if (pist !== null && pist.referent.find_slot(InstrumentParticipant.ATTR_REF, r, true) !== null) 
                    rt = new ReferentToken(pist.referent, t, t);
                else if (pzayav !== null && pzayav.referent.find_slot(InstrumentParticipant.ATTR_REF, r, true) !== null) 
                    rt = new ReferentToken(pzayav.referent, t, t);
                else if (potv !== null && potv.referent.find_slot(InstrumentParticipant.ATTR_REF, r, true) !== null) 
                    rt = new ReferentToken(potv.referent, t, t);
            }
            if (rt === null) 
                continue;
            if (check_del && t.previous !== null && t.previous.is_value("ОТ", null)) {
                let tt = t.previous;
                if (tt.previous !== null && tt.previous.is_hiphen) 
                    tt = tt.previous;
                if (tt.is_whitespace_before) {
                    let tt1 = t.next;
                    if (tt1 !== null && ((tt1.is_hiphen || tt1.is_char(':')))) 
                        tt1 = tt1.next;
                    if (tt1.get_referent() instanceof PersonReferent) {
                        rt.begin_token = tt;
                        rt.end_token = tt1;
                        rt.referent.add_slot(InstrumentParticipant.ATTR_DELEGATE, Utils.as(tt1.get_referent(), PersonReferent), false, 0);
                    }
                }
            }
            if (rt !== null && rt.end_token.next !== null && rt.end_token.next.is_char('(')) {
                let tt = rt.end_token.next.next;
                if (tt !== null && tt.next !== null && tt.next.is_char(')')) {
                    if (tt.is_value("ИСТЕЦ", "ПОЗИВАЧ") && pist !== null && rt.referent === pist.referent) 
                        rt.end_token = tt.next;
                    else if (tt.is_value("ЗАЯВИТЕЛЬ", "ЗАЯВНИК") && pzayav !== null && rt.referent === pzayav.referent) 
                        rt.end_token = tt.next;
                    else if (((tt.is_value("ОТВЕТЧИК", "ВІДПОВІДАЧ") || tt.is_value("ДОЛЖНИК", "БОРЖНИК"))) && potv !== null && rt.referent === potv.referent) 
                        rt.end_token = tt.next;
                    else if ((tt.get_referent() instanceof PersonReferent) || (tt.get_referent() instanceof OrganizationReferent)) {
                        if (pist !== null && rt.referent === pist.referent) {
                            if (pist.referent.find_slot(null, tt.get_referent(), true) !== null) 
                                rt.end_token = tt.next;
                            else if (potv !== null && potv.referent.find_slot(null, tt.get_referent(), true) === null) {
                                rt.end_token = tt.next;
                                pist.referent.add_slot(InstrumentParticipant.ATTR_REF, tt.get_referent(), false, 0);
                            }
                        }
                        else if (potv !== null && rt.referent === potv.referent) {
                            if (potv.referent.find_slot(null, tt.get_referent(), true) !== null) 
                                rt.end_token = tt.next;
                            else if (pist !== null && pist.referent.find_slot(null, tt.get_referent(), true) === null) {
                                rt.end_token = tt.next;
                                potv.referent.add_slot(InstrumentParticipant.ATTR_REF, tt.get_referent(), false, 0);
                            }
                        }
                    }
                }
            }
            t.kit.embed_token(rt);
            t = rt;
        }
    }
    
    static _create_just_participant(t, typ) {
        if (t === null) 
            return null;
        let r0 = null;
        let t0 = t;
        let t1 = t;
        let ok = false;
        let br = false;
        let refs = new Array();
        for (; t !== null; t = t.next) {
            if (t.is_newline_before && t !== t0) {
                if (t.whitespaces_before_count > 15) 
                    break;
            }
            if (t.is_hiphen || t.is_char_of(":,") || t.is_table_control_char) 
                continue;
            if (!br) {
                if (t.is_value("К", null) || t.is_value("О", "ПРО")) 
                    break;
            }
            if (t.is_char('(')) {
                if (br) 
                    break;
                br = true;
                continue;
            }
            if (t.is_char(')') && br) {
                br = false;
                t1 = t;
                break;
            }
            let r = t.get_referent();
            if ((r instanceof PersonReferent) || (r instanceof OrganizationReferent)) {
                if (r0 === null) {
                    refs.push(r);
                    r0 = r;
                    t1 = t;
                    ok = true;
                    continue;
                }
                break;
            }
            if (r instanceof UriReferent) {
                let ur = Utils.as(r, UriReferent);
                if (ur.scheme === "ИНН" || ur.scheme === "ИИН" || ur.scheme === "ОГРН") 
                    ok = true;
                refs.push(r);
                t1 = t;
                continue;
            }
            if (!br) {
                if ((r instanceof DecreeReferent) || (r instanceof DecreePartReferent)) 
                    break;
            }
            if (r !== null || br) {
                if ((r instanceof PhoneReferent) || (r instanceof AddressReferent)) 
                    refs.push(r);
                t1 = t;
                continue;
            }
            if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
                let brr = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (brr !== null) {
                    ok = true;
                    t1 = (t = brr.end_token);
                    continue;
                }
            }
            if (t.previous.is_comma && !br) 
                break;
            if (t.previous.morph.class0.is_preposition && t.is_value("УЧАСТИЕ", "УЧАСТЬ")) 
                break;
            if ((t.previous instanceof NumberToken) && t.is_value("ЛИЦО", "ОСОБА")) 
                break;
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                if ((npt.noun.is_value("УЧРЕЖДЕНИЕ", "УСТАНОВА") || npt.noun.is_value("ПРЕДПРИЯТИЕ", "ПІДПРИЄМСТВО") || npt.noun.is_value("ОРГАНИЗАЦИЯ", "ОРГАНІЗАЦІЯ")) || npt.noun.is_value("КОМПЛЕКС", null)) {
                    t1 = (t = npt.end_token);
                    ok = true;
                    continue;
                }
            }
            let ty = OrgItemTypeToken.try_attach(t, true, null);
            if (ty !== null) {
                t1 = (t = ty.end_token);
                ok = true;
                continue;
            }
            if ((t instanceof TextToken) && t.chars.is_cyrillic_letter && t.chars.is_all_lower) {
                if (MorphClass.ooEq(t.morph.class0, MorphClass.VERB) || MorphClass.ooEq(t.morph.class0, MorphClass.ADVERB)) 
                    break;
            }
            if (t.is_newline_before && typ === null) 
                break;
            else if (!t.morph.class0.is_preposition && !t.morph.class0.is_conjunction) 
                t1 = t;
            else if (t.is_newline_before) 
                break;
        }
        if (!ok) 
            return null;
        let pat = InstrumentParticipant._new1429(typ);
        for (const r of refs) {
            pat.add_slot(InstrumentParticipant.ATTR_REF, r, false, 0);
        }
        return new ReferentToken(pat, t0, t1);
    }
    
    _create_justice_resolution() {
        let ad = this.kit.get_analyzer_data_by_analyzer_name(InstrumentAnalyzer.ANALYZER_NAME);
        if (ad === null) 
            return;
        let res = this._find_resolution();
        if (res === null) 
            return;
        for (let t = res.begin_token; t !== null && t.end_char <= res.end_char; t = t.next) {
            if (t === res.begin_token) {
            }
            else if (t.previous !== null && t.previous.is_char('.') && t.is_whitespace_before) {
            }
            else if (!t.is_value("ПРИЗНАТЬ", "ВИЗНАТИ")) 
                continue;
            if (t.morph.class0.is_preposition && t.next !== null) 
                t = t.next;
            let arts = new Array();
            let tt = null;
            let te = null;
            if (t.is_value("ВЗЫСКАТЬ", "СТЯГНУТИ")) {
                let gosposh = false;
                let sum = null;
                te = null;
                for (tt = t.next; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
                    if (tt.morph.class0.is_preposition) 
                        continue;
                    if (tt.is_char('.')) 
                        break;
                    if (tt.is_value("ТОМ", "ТОМУ") && tt.next !== null && tt.next.is_value("ЧИСЛО", null)) 
                        break;
                    if (tt.is_value("ГОСПОШЛИНА", "ДЕРЖМИТО")) 
                        gosposh = true;
                    else if (tt.is_value("ФЕДЕРАЛЬНЫЙ", "ФЕДЕРАЛЬНИЙ") && tt.next !== null && tt.next.is_value("БЮДЖЕТ", null)) 
                        gosposh = true;
                    if (tt.get_referent() instanceof MoneyReferent) {
                        te = tt;
                        sum = Utils.as(tt.get_referent(), MoneyReferent);
                    }
                }
                if (sum !== null) {
                    let art = InstrumentArtefact._new1443("РЕЗОЛЮЦИЯ");
                    if (gosposh) 
                        art.value = "ВЗЫСКАТЬ ГОСПОШЛИНУ";
                    else 
                        art.value = "ВЗЫСКАТЬ СУММУ";
                    art.add_slot(InstrumentArtefact.ATTR_REF, sum, false, 0);
                    arts.push(new ReferentToken(art, t, te));
                }
            }
            if ((t.is_value("ЗАЯВЛЕНИЕ", "ЗАЯВА") || t.is_value("ИСК", "ПОЗОВ") || t.is_value("ТРЕБОВАНИЕ", "ВИМОГА")) || t.is_value("ЗАЯВЛЕННЫЙ", "ЗАЯВЛЕНИЙ") || t.is_value("УДОВЛЕТВОРЕНИЕ", "ЗАДОВОЛЕННЯ")) {
                for (tt = t.next; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
                    if (tt.morph.class0.is_preposition) 
                        continue;
                    if (tt.is_char('.')) {
                        if (tt.is_whitespace_after) 
                            break;
                    }
                    if (tt.is_value("УДОВЛЕТВОРИТЬ", "ЗАДОВОЛЬНИТИ")) {
                        let val = "УДОВЛЕТВОРИТЬ";
                        te = tt;
                        if (tt.next !== null && tt.next.is_value("ПОЛНОСТЬЮ", "ПОВНІСТЮ")) {
                            val += " ПОЛНОСТЬЮ";
                            te = tt.next;
                        }
                        else if (tt.previous !== null && tt.previous.is_value("ПОЛНОСТЬЮ", "ПОВНІСТЮ")) 
                            val += " ПОЛНОСТЬЮ";
                        let art = InstrumentArtefact._new1443("РЕЗОЛЮЦИЯ");
                        art.value = val;
                        arts.push(new ReferentToken(art, t, te));
                        break;
                    }
                    if (tt.is_value("ОТКАЗАТЬ", "ВІДМОВИТИ")) {
                        let art = InstrumentArtefact._new1443("РЕЗОЛЮЦИЯ");
                        art.value = "ОТКАЗАТЬ";
                        arts.push(new ReferentToken(art, t, (te = tt)));
                        break;
                    }
                }
            }
            if (t.is_value("ПРИЗНАТЬ", "ВИЗНАТИ")) {
                let zak = -1;
                let otm = -1;
                for (tt = t.next; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
                    if (tt.morph.class0.is_preposition) 
                        continue;
                    if (tt.is_char('.')) 
                        break;
                    if (tt.is_value("НЕЗАКОННЫЙ", "НЕЗАКОННИЙ")) {
                        zak = 0;
                        te = tt;
                    }
                    else if (tt.is_value("ЗАКОННЫЙ", "ЗАКОННИЙ")) {
                        zak = 1;
                        te = tt;
                    }
                    else if (tt.is_value("ОТМЕНИТЬ", "СКАСУВАТИ")) {
                        otm = 1;
                        te = tt;
                    }
                }
                if (zak >= 0) {
                    let val = ("ПРИЗНАТЬ " + (zak > 0 ? "ЗАКОННЫМ" : "НЕЗАКОННЫМ"));
                    if (otm > 0) 
                        val += " И ОТМЕНИТЬ";
                    let art = InstrumentArtefact._new1443("РЕЗОЛЮЦИЯ");
                    art.value = val;
                    arts.push(new ReferentToken(art, t, te));
                }
                else 
                    continue;
            }
            for (const rt of arts) {
                rt.referent = ad.register_referent(rt.referent);
                this.m_doc.add_slot(InstrumentReferent.ATTR_ARTEFACT, rt.referent, false, 0);
                if (res.begin_token === rt.begin_token) 
                    res.begin_token = rt;
                if (res.end_token === rt.end_token) 
                    res.end_token = rt;
                this.kit.embed_token(rt);
                t = rt;
            }
        }
    }
    
    _find_resolution() {
        if (this.kind === InstrumentKind.APPENDIX) 
            return null;
        let dir = false;
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].kind === InstrumentKind.DIRECTIVE && ((i + 1) < this.children.length)) {
                let v = this.children[i].value;
                if (v === null) 
                    continue;
                let s = v.toString();
                if ((((s === "РЕШЕНИЕ" || s === "ОПРЕДЕЛЕНИЕ" || s === "ПОСТАНОВЛЕНИЕ") || s === "ПРИГОВОР" || s === "РІШЕННЯ") || s === "ВИЗНАЧЕННЯ" || s === "ПОСТАНОВА") || s === "ВИРОК") {
                    let ii = i + 1;
                    for (let j = ii + 1; j < this.children.length; j++) {
                        ii = j;
                    }
                    if (ii === (i + 1)) 
                        return this.children[i + 1];
                    else 
                        return FragToken._new1338(this.children[i + 1].begin_token, this.children[ii].end_token, InstrumentKind.CONTENT);
                }
                dir = true;
            }
        }
        if (dir) 
            return null;
        for (const ch of this.children) {
            let re = ch._find_resolution();
            if (re !== null) 
                return re;
        }
        return null;
    }
    
    static __create_action_question(t, max_char) {
        const InstrToken = require("./InstrToken");
        let li = new Array();
        let ok = false;
        for (let tt = t; tt !== null; tt = tt.next) {
            let it = InstrToken.parse(tt, max_char, null);
            if (it === null) 
                break;
            li.push(it);
            if (li.length > 5) 
                return null;
            if (it.typ === ILTypes.QUESTION) {
                ok = true;
                break;
            }
            tt = it.end_token;
        }
        if (!ok) 
            return null;
        let t1 = li[li.length - 1].end_token;
        let li2 = new Array();
        ok = false;
        for (let tt = t1.next; tt !== null; tt = tt.next) {
            if (!tt.is_newline_before) 
                continue;
            let it = InstrToken.parse(tt, max_char, null);
            if (it === null) 
                break;
            li2.push(it);
            tt = it.end_token;
            if (it.typ !== ILTypes.TYP) 
                continue;
            let it1 = InstrToken1.parse(tt, true, null, 0, null, false, max_char, false, false);
            if (it1 !== null && it1.has_verb) {
                tt = it1.end_token;
                continue;
            }
            let tt2 = DecreeToken.is_keyword(it.begin_token, false);
            if (tt2 !== null && tt2 === it.end_token) {
                ok = true;
                break;
            }
        }
        if (!ok) 
            return null;
        let t2 = li2[li2.length - 1].begin_token;
        while (li2.length > 1 && li2[li2.length - 2].typ === ILTypes.ORGANIZATION) {
            t2 = li2[li2.length - 2].begin_token;
            li2.splice(li2.length - 1, 1);
        }
        let res = FragToken.create_document(t2, max_char, InstrumentKind.UNDEFINED);
        if (res === null) 
            return null;
        let ques = FragToken._new1338(t, t2.previous, InstrumentKind.QUESTION);
        res.children.splice(0, 0, ques);
        ques.children.push(FragToken._new1338(li[li.length - 1].begin_token, li[li.length - 1].end_token, InstrumentKind.KEYWORD));
        let content = FragToken._new1338(li[li.length - 1].end_token.next, t2.previous, InstrumentKind.CONTENT);
        ques.children.push(content);
        content._analize_content(res, max_char > 0, InstrumentKind.UNDEFINED);
        if (li.length > 1) {
            let fr = FragToken._new1360(t, li[li.length - 2].end_token, InstrumentKind.NAME, true);
            ques.children.splice(0, 0, fr);
        }
        res.begin_token = t;
        return res;
    }
    
    static create_gost_title(t0, doc) {
        if (t0 === null) 
            return null;
        let ok = false;
        if (t0.is_table_control_char && t0.next !== null) 
            t0 = t0.next;
        let t = null;
        let cou = 0;
        for (t = t0; t !== null && (cou < 300); t = t.next,cou++) {
            let dr = Utils.as(t.get_referent(), DecreeReferent);
            if (dr !== null) {
                if (dr.kind === DecreeKind.STANDARD) {
                    t = t.kit.debed_token(t);
                    if (t.begin_char === t0.begin_char) 
                        t0 = t;
                    ok = true;
                }
                break;
            }
            if (t.is_table_control_char) 
                continue;
            if (t.is_newline_before || ((t.previous !== null && t.previous.is_table_control_char))) {
                if (FragToken._is_start_of_body(t, false)) 
                    break;
                let dt = DecreeToken.try_attach(t, null, false);
                if (dt !== null) {
                    if (dt.typ === DecreeTokenItemType.TYP) {
                        if (dt.typ_kind === DecreeKind.STANDARD) 
                            ok = true;
                        break;
                    }
                }
            }
        }
        if (!ok) 
            return null;
        let title = FragToken._new1338(t0, t0, InstrumentKind.HEAD);
        cou = 0;
        let has_num = false;
        for (t = t0; t !== null && (cou < 100); t = t.next) {
            if (t.is_newline_before && t !== t0) {
                title.end_token = t.previous;
                if (t.is_value("ЧАСТЬ", null)) {
                    t = t.next;
                    let tt1 = MiscHelper.check_number_prefix(t);
                    if (tt1 !== null) 
                        t = tt1;
                    if (t instanceof NumberToken) {
                        let tmp = new StringBuilder();
                        for (; t !== null; t = t.next) {
                            if (t instanceof NumberToken) 
                                tmp.append((t).value);
                            else if (((t.is_hiphen || t.is_char('.'))) && !t.is_whitespace_after && (t.next instanceof NumberToken)) 
                                tmp.append((t).term);
                            else 
                                break;
                            if (t.is_whitespace_after) 
                                break;
                        }
                        doc.add_slot(InstrumentReferent.ATTR_PART, tmp.toString(), true, 0);
                    }
                    continue;
                }
                if (FragToken._is_start_of_body(t, false)) 
                    break;
                cou++;
            }
            if (!has_num) {
                let dr = Utils.as(t.get_referent(), DecreeReferent);
                if (dr !== null && dr.kind === DecreeKind.STANDARD) 
                    t = t.kit.debed_token(t);
            }
            title.end_token = t;
            let dt = DecreeToken.try_attach(t, null, false);
            if (dt === null) 
                continue;
            if (dt.typ === DecreeTokenItemType.TYP) {
                if (dt.typ_kind !== DecreeKind.STANDARD) 
                    continue;
                FragToken._add_title_attr(doc, title, dt);
                t = dt.end_token;
                if (!has_num) {
                    let num = DecreeToken.try_attach(t.next, dt, false);
                    if (num !== null && num.typ === DecreeTokenItemType.NUMBER) {
                        FragToken._add_title_attr(doc, title, num);
                        if (num.num_year > 0) 
                            doc.add_slot(InstrumentReferent.ATTR_DATE, num.num_year, false, 0);
                        t = dt.end_token;
                        has_num = true;
                    }
                }
                continue;
            }
        }
        title.tag = DecreeKind.STANDARD;
        return title;
    }
    
    static create_doc_title(t0, doc) {
        if (t0 === null) 
            return null;
        let title = FragToken.create_contract_title(t0, doc);
        if (title !== null) 
            return title;
        title = FragToken.create_gost_title(t0, doc);
        if (title !== null) 
            return title;
        title = FragToken.create_zapiska_title(t0, doc);
        if (title !== null) 
            return title;
        title = FragToken.createtztitle(t0, doc);
        if (title !== null) 
            return title;
        doc.slots.splice(0, doc.slots.length);
        title = FragToken.create_project_title(t0, doc);
        if (title !== null) 
            return title;
        doc.slots.splice(0, doc.slots.length);
        title = FragToken._create_doc_title_(t0, doc);
        if (title !== null && title.children.length === 1 && title.children[0].kind === InstrumentKind.NAME) {
            let title2 = FragToken._create_doc_title_(title.end_token.next, doc);
            if (title2 !== null && doc.typ !== null) {
                title.children.splice(title.children.length, 0, ...title2.children);
                title.end_token = title2.end_token;
            }
        }
        return title;
    }
    
    static _create_doc_title_(t0, doc) {
        const InstrToken = require("./InstrToken");
        for (; t0 !== null; t0 = t0.next) {
            if (!t0.is_table_control_char) 
                break;
        }
        if (t0 === null) 
            return null;
        let title = FragToken._new1338(t0, t0, InstrumentKind.HEAD);
        let dt0 = null;
        let t = null;
        let t1 = null;
        let _name = null;
        let nt0 = null;
        let empty_lines = 0;
        let end_empty_lines = null;
        let ignore_empty_lines = false;
        let attrs = 0;
        let can_be_orgs = true;
        let unknown_orgs = new Array();
        let is_contract = false;
        let start_of_name = false;
        t = t0;
        if (t0.get_referent() !== null) {
            if (t0.get_referent().type_name === "PERSON") 
                return null;
        }
        let appr0 = null;
        if (t0.is_value("УТВЕРДИТЬ", "ЗАТВЕРДИТИ") || t0.is_value("ПРИНЯТЬ", "ПРИЙНЯТИ") || t0.is_value("УТВЕРЖДАТЬ", null)) {
            appr0 = FragToken._create_approved(t);
            if (appr0 !== null && appr0.referents === null) 
                appr0 = null;
        }
        if (appr0 !== null) {
            t1 = title.end_token = appr0.end_token;
            title.children.push(appr0);
            t = t1.next;
        }
        let edi0 = null;
        if (t0.is_value("РЕДАКЦИЯ", null)) 
            edi0 = FragToken._create_editions(t0);
        if (edi0 !== null) {
            t1 = title.end_token = edi0.end_token;
            title.children.push(edi0);
            t = t1.next;
        }
        if (t !== null && t.is_value("ДЕЛО", "СПРАВА")) {
            let dt = DecreeToken.try_attach(t.next, null, false);
            if (dt !== null && dt.typ === DecreeTokenItemType.NUMBER) {
                dt.begin_token = t;
                title.children.push(FragToken._new1392(t, t, InstrumentKind.KEYWORD, "ДЕЛО"));
                FragToken._add_title_attr(doc, title, dt);
                t = dt.end_token.next;
                if (t !== null && t.is_value("КОПИЯ", "КОПІЯ")) 
                    t = t.next;
                else if ((t.is_char('(') && t.next !== null && t.next.is_value("КОПИЯ", "КОПІЯ")) && t.next.next !== null && t.next.next.is_char(')')) 
                    t = t.next.next;
            }
        }
        for (; t !== null; t = t.next) {
            if (t.is_table_control_char) 
                continue;
            if (t.is_newline_before || ((t.previous !== null && t.previous.is_table_control_char))) {
                if ((t.get_referent() instanceof DecreeReferent) && (t.get_referent()).kind !== DecreeKind.PUBLISHER) 
                    t = t.kit.debed_token(t);
                if (t.is_value("О", "ПРО") || t.is_value("ОБ", null) || t.is_value("ПО", null)) 
                    break;
                if (FragToken._is_start_of_body(t, false)) 
                    break;
                if (t.is_char_of("[") && _name === null) 
                    break;
                let iii = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
                if (iii !== null && iii.typ === InstrToken1Types.COMMENT) {
                    let cmt = FragToken._new1338(iii.begin_token, iii.end_token, InstrumentKind.COMMENT);
                    title.children.push(cmt);
                    t = (t1 = title.end_token = iii.end_token);
                    continue;
                }
                if (iii !== null && iii.end_token.is_char('?')) {
                    let cmt = FragToken._new1338(iii.begin_token, iii.end_token, InstrumentKind.NAME);
                    cmt.value = FragToken.get_restored_namemt(iii, false);
                    title.children.push(cmt);
                    t = (t1 = title.end_token = iii.end_token);
                    break;
                }
                if ((((t.is_value("ЗАЯВИТЕЛЬ", "ЗАЯВНИК") || t.is_value("ИСТЕЦ", "ПОЗИВАЧ") || t.is_value("ОТВЕТЧИК", "ВІДПОВІДАЧ")) || t.is_value("ДОЛЖНИК", "БОРЖНИК") || t.is_value("КОПИЯ", "КОПІЯ"))) && t.next !== null && ((t.next.is_char(':') || t.next.is_table_control_char))) {
                    let ptt = FragToken._create_just_participant(t.next.next, null);
                    if (ptt !== null) {
                        if (t.is_value("КОПИЯ", null)) {
                        }
                        t1 = ptt.end_token;
                        while (t1.next !== null && t1.next.is_table_control_char) {
                            t1 = t1.next;
                        }
                        if (t1.next !== null && t1.next.is_char('(')) {
                            let br = BracketHelper.try_parse(t1.next, BracketParseAttr.NO, 100);
                            if (br !== null) 
                                t1 = br.end_token;
                        }
                        let ft = FragToken._new1338(t, t1, InstrumentKind.INITIATOR);
                        title.children.push(ft);
                        t = title.end_token = t1;
                        continue;
                    }
                }
                if (t.is_value("ЦЕНА", "ЦІНА") && t.next !== null && t.next.is_value("ИСК", "ПОЗОВ")) {
                    let has_money = false;
                    let tt = null;
                    for (tt = t.next; tt !== null; tt = tt.next) {
                        if (tt.get_referent() instanceof MoneyReferent) 
                            has_money = true;
                        if (tt.is_newline_after) 
                            break;
                    }
                    if (tt !== null && has_money) {
                        while (tt.next !== null && tt.next.is_table_control_char) {
                            tt = tt.next;
                        }
                        if (tt.next !== null && tt.next.is_char('(')) {
                            let br = BracketHelper.try_parse(tt.next, BracketParseAttr.NO, 100);
                            if (br !== null) 
                                tt = br.end_token;
                        }
                        title.children.push(FragToken._new1338(t, tt, InstrumentKind.CASEINFO));
                        t = title.end_token = (t1 = tt);
                        continue;
                    }
                }
                if (t.is_value("В", "У")) {
                    let tt = t.next;
                    if (tt !== null && tt.is_table_control_char) 
                        tt = tt.next;
                    if (tt !== null && (tt.get_referent() instanceof OrganizationReferent)) {
                        let r = tt.get_referent();
                        while (tt.next !== null && tt.next.is_table_control_char) {
                            tt = tt.next;
                        }
                        t1 = tt;
                        if (t1.next !== null && t1.next.is_char('(')) {
                            let br = BracketHelper.try_parse(t1.next, BracketParseAttr.NO, 100);
                            if (br !== null) 
                                t1 = br.end_token;
                        }
                        let ooo = FragToken._new1338(t, t1, InstrumentKind.ORGANIZATION);
                        ooo.referents = new Array();
                        ooo.referents.push(r);
                        title.children.push(ooo);
                        t = title.end_token = t1;
                        continue;
                    }
                }
                if (t.length_char === 1 && t.chars.is_letter && t.is_whitespace_after) {
                    let ii = 0;
                    for (ii = 0; ii < InstrToken.m_directives_norm.length; ii++) {
                        let ee = MiscHelper.try_attach_word_by_letters(InstrToken.m_directives_norm[ii], t, false);
                        if (ee !== null && ee.is_newline_after) {
                            let ooo = FragToken._new1392(t, ee, InstrumentKind.KEYWORD, InstrToken.m_directives_norm[ii]);
                            title.children.push(ooo);
                            doc.typ = InstrToken.m_directives_norm[ii];
                            t = title.end_token = ee;
                            break;
                        }
                    }
                    if (ii < InstrToken.m_directives_norm.length) 
                        continue;
                }
            }
            if (t.is_hiphen || t.is_char('_')) {
                let ch = t.get_source_text()[0];
                for (; t !== null; t = t.next) {
                    if (!t.is_char(ch)) 
                        break;
                }
            }
            if (t === null) 
                break;
            let casinf = FragToken._create_case_info(t);
            if (casinf !== null) 
                break;
            let dr0 = Utils.as(t.get_referent(), DecreeReferent);
            if (dr0 !== null) {
                if (dr0.kind === DecreeKind.PUBLISHER) 
                    continue;
            }
            else if (t.get_referent() instanceof DecreePartReferent) {
                let dpr = Utils.as(t.get_referent(), DecreePartReferent);
                if (dpr !== null) {
                    if (((dpr.part === null && dpr.doc_part === null)) || dpr.slots.length !== 2) 
                        break;
                    if ((t.next instanceof TextToken) && (t.next).is_pure_verb) 
                        break;
                    dr0 = dpr.owner;
                }
            }
            if (dr0 !== null) {
                if (doc.typ === null || doc.typ === dr0.typ) {
                    let tt1 = (t).begin_token;
                    let li = DecreeToken.try_attach_list(tt1, null, 10, false);
                    if (li !== null && li.length > 0 && li[li.length - 1].is_newline_after) {
                        for (const dd of li) {
                            FragToken._add_title_attr(doc, title, dd);
                        }
                        let ttt = li[li.length - 1].end_token;
                        if (ttt.end_char < t.end_char) {
                            nt0 = ttt.next;
                            _name = FragToken.get_restored_name(ttt.next, (t).end_token, false);
                        }
                        t1 = t;
                        if (_name !== null && t1.is_newline_after) {
                            t = t.next;
                            break;
                        }
                        if (doc.typ === "КОДЕКС") {
                            let pt = PartToken.try_attach(t.next, null, false, false);
                            if (pt !== null) {
                                if (((pt.typ !== PartTokenItemType.PART && pt.typ !== PartTokenItemType.DOCPART)) || pt.values.length !== 1) 
                                    pt = null;
                            }
                            if (pt !== null && pt.values.length > 0) {
                                doc.add_slot(InstrumentReferent.ATTR_PART, pt.values[0].value, false, 0);
                                title.children.push(FragToken._new1392(pt.begin_token, pt.end_token, InstrumentKind.DOCPART, pt.values[0].value));
                                t = pt.end_token;
                                continue;
                            }
                        }
                        if (doc.name !== null) {
                            t = t.next;
                            break;
                        }
                    }
                }
                else if (dr0.typ === "КОДЕКС") {
                    let pt = PartToken.try_attach(t.next, null, false, false);
                    let nam = dr0.name;
                    if (pt !== null) {
                        if (((pt.typ !== PartTokenItemType.PART && pt.typ !== PartTokenItemType.DOCPART)) || pt.values.length !== 1) 
                            pt = null;
                    }
                    if (pt !== null && pt.values.length > 0) 
                        doc.add_slot(InstrumentReferent.ATTR_PART, pt.values[0].value, false, 0);
                    doc.add_slot(InstrumentBlockReferent.ATTR_NAME, nam, false, 0);
                    doc.typ = dr0.typ;
                    let _geo = dr0.get_slot_value(DecreeReferent.ATTR_GEO);
                    if (_geo !== null) 
                        doc.add_slot(InstrumentReferent.ATTR_GEO, _geo, false, 0);
                    t1 = t;
                    title.children.push(FragToken._new1392(t, t, InstrumentKind.NAME, nam));
                    if (pt !== null && pt.values.length > 0) {
                        title.children.push(FragToken._new1392(pt.begin_token, pt.end_token, InstrumentKind.DOCPART, pt.values[0].value));
                        t1 = pt.end_token;
                    }
                    t = t1;
                    continue;
                }
                t1 = t;
                ignore_empty_lines = true;
                can_be_orgs = false;
                continue;
            }
            if (FragToken._is_start_of_body(t, false)) 
                break;
            if (t.is_value("ПРОЕКТ", null) && t.is_newline_after) 
                continue;
            if (doc.typ === null) {
                let ttt1 = DecreeToken.is_keyword(t, false);
                if (ttt1 !== null && ttt1.is_newline_after) {
                    let typ = MiscHelper.get_text_value(t, ttt1, GetTextAttr.KEEPQUOTES);
                    if (doc.typ === null) 
                        doc.typ = typ;
                    title.children.push(FragToken._new1392(t, ttt1, InstrumentKind.TYP, typ));
                    dt0 = DecreeToken._new843(t, ttt1, DecreeTokenItemType.TYP, typ);
                    can_be_orgs = false;
                    t1 = (t = ttt1);
                    continue;
                }
                if (t.is_newline_before && ttt1 !== null && DecreeToken.try_attach(t, null, false) === null) {
                    start_of_name = true;
                    break;
                }
            }
            let appr = FragToken._create_approved(t);
            if (appr !== null) {
                t = (t1 = appr.end_token);
                title.children.push(appr);
                if (appr.begin_char < title.begin_char) 
                    title.begin_token = appr.begin_token;
                continue;
            }
            let misc = FragToken._create_misc(t);
            if (misc !== null) {
                t = (t1 = misc.end_token);
                title.children.push(misc);
                continue;
            }
            let edss = FragToken._create_editions(t);
            if (edss !== null) 
                break;
            let dt = DecreeToken.try_attach(t, dt0, false);
            if (dt !== null) {
                if (dt.typ === DecreeTokenItemType.TYP || dt.typ === DecreeTokenItemType.OWNER) {
                    if (dt.length_char < 4) 
                        dt = null;
                }
            }
            if (dt === null && dt0 !== null && ((dt0.typ === DecreeTokenItemType.OWNER || dt0.typ === DecreeTokenItemType.ORG))) {
                if ((t instanceof NumberToken) && t.is_newline_after && t.is_newline_before) 
                    dt = DecreeToken._new843(t, t, DecreeTokenItemType.NUMBER, (t).value.toString());
            }
            if (dt !== null && dt.typ === DecreeTokenItemType.UNKNOWN) 
                dt = null;
            if ((dt === null && (t instanceof NumberToken) && t.is_newline_before) && t.is_newline_after) {
                if (dt0 !== null && dt0.typ === DecreeTokenItemType.ORG && (((t).typ === NumberSpellingType.DIGIT))) 
                    dt = DecreeToken._new843(t, t, DecreeTokenItemType.NUMBER, (t).value.toString());
            }
            if (dt !== null && ((dt.typ === DecreeTokenItemType.TYP || dt.typ === DecreeTokenItemType.OWNER || dt.typ === DecreeTokenItemType.ORG))) {
                if (!t.is_newline_before && !t.previous.is_table_control_char) 
                    dt = null;
                else 
                    for (let ttt = dt.end_token.next; ttt !== null; ttt = ttt.next) {
                        if (ttt.is_newline_before || ttt.is_table_control_char) 
                            break;
                        else if ((ttt instanceof TextToken) && (ttt).is_pure_verb) {
                            dt = null;
                            break;
                        }
                    }
            }
            if (dt !== null && dt.typ === DecreeTokenItemType.DATE && dt0 !== null) {
                if (dt.is_newline_before || dt.is_newline_after) {
                }
                else if (dt0.typ === DecreeTokenItemType.NUMBER || dt0.typ === DecreeTokenItemType.TYP) {
                }
                else 
                    dt = null;
            }
            if (dt === null) {
                if (t.get_referent() instanceof DateReferent) 
                    continue;
                if (t.is_value("ДАТА", null)) {
                    let ok = false;
                    for (let tt = t.next; tt !== null; tt = tt.next) {
                        if ((tt.is_value("ПОДПИСАНИЕ", "ПІДПИСАННЯ") || tt.is_value("ВВЕДЕНИЕ", "ВВЕДЕННЯ") || tt.is_value("ПРИНЯТИЕ", "ПРИЙНЯТТЯ")) || tt.is_value("ДЕЙСТВИЕ", "ДІЮ") || tt.morph.class0.is_preposition) 
                            continue;
                        if ((tt instanceof TextToken) && !tt.chars.is_letter) 
                            continue;
                        let da = Utils.as(tt.get_referent(), DateReferent);
                        if (da !== null) {
                            let frdt = FragToken._new1338(t, tt, InstrumentKind.DATE);
                            title.children.push(frdt);
                            t = tt;
                            ok = true;
                            if (doc.date === null) 
                                doc.add_date(da);
                        }
                        break;
                    }
                    if (ok) 
                        continue;
                }
                let r = t.get_referent();
                if ((r === null && t.length_char === 1 && !t.chars.is_letter) && (t.next instanceof ReferentToken) && !t.is_newline_after) {
                    t = t.next;
                    r = t.get_referent();
                }
                if (((r instanceof AddressReferent) || (r instanceof UriReferent) || (r instanceof PhoneReferent)) || (r instanceof PersonIdentityReferent) || (r instanceof BankDataReferent)) {
                    let cnt = FragToken._new1338(t, t, InstrumentKind.CONTACT);
                    cnt.referents = new Array();
                    cnt.referents.push(r);
                    title.children.push(cnt);
                    for (; t !== null; t = t.next) {
                        if (t.next !== null && t.next.is_char_of(",;.")) 
                            t = t.next;
                        if (t.next === null) 
                            break;
                        r = t.next.get_referent();
                        if (((r instanceof AddressReferent) || (r instanceof UriReferent) || (r instanceof PhoneReferent)) || (r instanceof PersonIdentityReferent) || (r instanceof BankDataReferent)) {
                            cnt.referents.push(r);
                            cnt.end_token = t.next;
                        }
                        else if (t.is_newline_after) 
                            break;
                    }
                    continue;
                }
                let pt = (t.is_newline_before ? PartToken.try_attach(t, null, false, false) : null);
                if ((pt !== null && ((pt.typ === PartTokenItemType.PART || pt.typ === PartTokenItemType.DOCPART)) && pt.values.length === 1) && pt.is_newline_after) {
                    let ok = false;
                    if (dt0 !== null && dt0.typ === DecreeTokenItemType.TYP) 
                        ok = true;
                    else {
                        let ddd = DecreeToken.try_attach(pt.end_token.next, null, false);
                        if (ddd !== null && ddd.typ === DecreeTokenItemType.TYP) 
                            ok = true;
                        else if (FragToken._create_approved(pt.end_token.next) !== null) 
                            ok = true;
                    }
                    if (ok) {
                        title.children.push(FragToken._new1392(pt.begin_token, pt.end_token, InstrumentKind.DOCPART, pt.values[0].value));
                        doc.add_slot(InstrumentReferent.ATTR_PART, pt.values[0].value, false, 0);
                        t = pt.end_token;
                        continue;
                    }
                }
                if (appr0 !== null) 
                    break;
                if (can_be_orgs) {
                    if (t.get_referent() instanceof PersonReferent) {
                    }
                    else {
                        let org = FragToken._create_owner(t);
                        if (org !== null) {
                            unknown_orgs.push(org);
                            t1 = (t = org.end_token);
                            continue;
                        }
                    }
                }
                let stok = InstrToken.parse(t, 0, null);
                if (stok !== null && ((stok.no_words || (stok.length_char < 5)))) {
                    if (t0 === t) 
                        t0 = stok.end_token.next;
                    t = stok.end_token;
                    continue;
                }
                if ((t.is_newline_before && doc.typ !== null && (t instanceof TextToken)) && NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null) !== null) 
                    break;
                if (t.is_newline_before && t.is_value("К", "ДО")) 
                    break;
                if (((!ignore_empty_lines && stok !== null && stok.typ === ILTypes.UNDEFINED) && !stok.has_verb && ((dt0 === null || dt0.typ === DecreeTokenItemType.NUMBER))) && (empty_lines < 3)) {
                    if (stok.is_newline_after) 
                        empty_lines++;
                    else if (dt0 !== null) 
                        break;
                    t = (end_empty_lines = stok.end_token);
                    continue;
                }
                break;
            }
            if ((!ignore_empty_lines && dt.typ === DecreeTokenItemType.TERR && end_empty_lines !== null) && dt0 === null) {
                if (dt.is_newline_after) 
                    empty_lines++;
                t = (end_empty_lines = dt.end_token);
                continue;
            }
            if (dt.typ === DecreeTokenItemType.ORG || dt.typ === DecreeTokenItemType.OWNER) {
                if (is_contract) 
                    break;
                for (let ttt = dt.end_token.next; ttt !== null; ttt = ttt.next) {
                    if (ttt.whitespaces_before_count > 15) 
                        break;
                    if (MorphClass.ooEq(ttt.get_morph_class_in_dictionary(), MorphClass.VERB)) {
                        dt = null;
                        break;
                    }
                    let dt1 = DecreeToken.try_attach(ttt, dt0, false);
                    if (dt1 !== null) {
                        if ((dt1.typ === DecreeTokenItemType.NUMBER || dt1.typ === DecreeTokenItemType.TYP || dt1.typ === DecreeTokenItemType.NAME) || dt1.typ === DecreeTokenItemType.DATE || dt1.typ === DecreeTokenItemType.ORG) 
                            break;
                        dt.end_token = dt1.end_token;
                    }
                    else if (CharsInfo.ooNoteq(ttt.chars, dt.begin_token.chars) && ttt.is_newline_before) 
                        break;
                    else 
                        dt.end_token = ttt;
                }
                if (dt === null) 
                    break;
            }
            if (dt.typ === DecreeTokenItemType.TYP) {
                let typ = DecreeToken.get_kind(dt.value);
                if (typ === DecreeKind.PUBLISHER) {
                    for (; t !== null; t = t.next) {
                        if (t.is_newline_after) 
                            break;
                    }
                    if (t === null) 
                        break;
                    continue;
                }
                if (typ === DecreeKind.CONTRACT || dt.value === "ДОВЕРЕННОСТЬ" || dt.value === "ДОВІРЕНІСТЬ") 
                    is_contract = true;
                else if (dt.value === "ПРОТОКОЛ" && !dt.is_newline_after) {
                    let npt1 = NounPhraseHelper.try_parse(dt.end_token.next, NounPhraseParseAttr.NO, 0, null);
                    if (npt1 !== null) {
                        for (t = dt.end_token.next; t !== null; t = t.next) {
                            dt.end_token = t;
                            if (t.is_newline_after) 
                                break;
                        }
                    }
                }
                can_be_orgs = false;
            }
            dt0 = dt;
            if (dt.typ === DecreeTokenItemType.NUMBER && unknown_orgs.length > 0) {
                for (const org of unknown_orgs) {
                    title.children.push(org);
                    doc.add_slot(InstrumentReferent.ATTR_SOURCE, org.value, false, 0);
                }
                unknown_orgs.splice(0, unknown_orgs.length);
            }
            if (!FragToken._add_title_attr(doc, title, dt)) 
                break;
            else 
                attrs++;
            t1 = (t = dt.end_token);
        }
        title.sort_children();
        if (t === null || (((doc.typ === null && doc.reg_number === null && appr0 === null) && !start_of_name))) {
            if (t === t0) {
                let nam = DecreeToken.try_attach_name(t0, null, true, false);
                if (nam !== null) {
                    _name = FragToken.get_restored_name(t0, nam.end_token, false);
                    if (!Utils.isNullOrEmpty(_name)) {
                        t1 = nam.end_token;
                        doc.add_slot(InstrumentBlockReferent.ATTR_NAME, _name.trim(), true, 0);
                        title.children.push(FragToken._new1392(t0, t1, InstrumentKind.NAME, _name.trim()));
                        for (; t1.next !== null; t1 = t1.next) {
                            if (t1.is_table_control_char && !t1.is_char(String.fromCharCode(0x1F))) {
                            }
                            else 
                                break;
                        }
                        title.end_token = t1;
                        for (t = t1.next; t !== null; t = t.next) {
                            if (FragToken._is_start_of_body(t, false)) 
                                break;
                            if (t.is_table_control_char) 
                                continue;
                            let appr1 = FragToken._create_approved(t);
                            if (appr1 !== null) {
                                title.children.push(appr1);
                                t = title.end_token = appr1.end_token;
                                continue;
                            }
                            appr1 = FragToken._create_misc(t);
                            if (appr1 !== null) {
                                title.children.push(appr1);
                                t = title.end_token = appr1.end_token;
                                continue;
                            }
                            let eds = FragToken._create_editions(t);
                            if (eds !== null) {
                                title.children.push(eds);
                                t = title.end_token = eds.end_token;
                                break;
                            }
                            let dt00 = DecreeToken.try_attach(t, null, false);
                            if (dt00 !== null) {
                                if (dt00.typ === DecreeTokenItemType.DATE || dt00.typ === DecreeTokenItemType.TERR) {
                                    FragToken._add_title_attr(doc, title, dt00);
                                    t = title.end_token = dt00.end_token;
                                    continue;
                                }
                            }
                            break;
                        }
                        return title;
                    }
                }
            }
            if (attrs > 0) {
                title.end_token = t1;
                return title;
            }
            return null;
        }
        for (let j = 0; j < unknown_orgs.length; j++) {
            title.children.splice(j, 0, unknown_orgs[j]);
            doc.add_slot(InstrumentReferent.ATTR_SOURCE, unknown_orgs[j].value, false, 0);
        }
        if (end_empty_lines !== null && doc.find_slot(InstrumentReferent.ATTR_SOURCE, null, true) === null) {
            let val = MiscHelper.get_text_value(t0, end_empty_lines, GetTextAttr.NO);
            doc.add_slot(InstrumentReferent.ATTR_SOURCE, val, false, 0);
            title.children.splice(0, 0, FragToken._new1392(t0, end_empty_lines, InstrumentKind.ORGANIZATION, val));
        }
        let is_case = false;
        for (const ch of title.children) {
            if (ch.value === null && ch.kind !== InstrumentKind.APPROVED && ch.kind !== InstrumentKind.EDITIONS) 
                ch.value = MiscHelper.get_text_value(ch.begin_token, ch.end_token, GetTextAttr.NO);
            if (ch.kind === InstrumentKind.CASENUMBER) 
                is_case = true;
        }
        if ((((_name !== null || t.is_newline_before || ((t.previous !== null && t.previous.is_table_control_char))) || ((!t.is_newline_before && title.children.length > 0 && title.children[title.children.length - 1].kind === InstrumentKind.TYP)))) && !is_case) {
            let tt0 = t;
            let first_line = null;
            let po_delu = false;
            if (t.is_value("ПО", null) && t.next !== null && t.next.is_value("ДЕЛО", "СПРАВА")) 
                po_delu = true;
            for (; t !== null; t = t.next) {
                if (FragToken._is_start_of_body(t, false)) 
                    break;
                if ((_name !== null && t === tt0 && t.is_newline_before) && t.whitespaces_before_count > 15) 
                    break;
                if (t.is_table_control_char) 
                    break;
                if (t.is_newline_before) {
                    let pt = PartToken.try_attach(t, null, false, false);
                    if (pt !== null && pt.typ !== PartTokenItemType.PREFIX) 
                        break;
                    let ltt = InstrToken1.parse(t, false, null, 0, null, false, 0, true, false);
                    if (ltt === null) 
                        break;
                    if (t !== tt0 && t.whitespaces_before_count > 15) {
                        if (t.newlines_before_count > 2) 
                            break;
                        if (t.newlines_before_count > 1 && !t.chars.is_all_upper) 
                            break;
                        if (t.is_value("О", "ПРО") || t.is_value("ОБ", null)) {
                        }
                        else if (ltt.all_upper && !ltt.has_changes) {
                        }
                        else 
                            break;
                    }
                    if (ltt.numbers.length > 0) 
                        break;
                    let appr = FragToken._create_approved(t);
                    if (appr !== null) {
                        if (t.previous !== null && t.previous.is_char(',')) {
                        }
                        else 
                            break;
                    }
                    if (FragToken._create_editions(t) !== null || FragToken._create_case_info(t) !== null) 
                        break;
                    if (t.get_referent() instanceof GeoReferent) {
                        if (t.is_newline_after) 
                            break;
                        if (t.next !== null && (t.next.get_referent() instanceof DateReferent)) 
                            break;
                    }
                    if (t.get_referent() instanceof DateReferent) {
                        if (t.is_newline_after) 
                            break;
                        if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) 
                            break;
                    }
                    if (t.get_referent() instanceof DecreePartReferent) 
                        break;
                    if (t.get_referent() instanceof DecreeReferent) {
                        let dr = Utils.as(t.get_referent(), DecreeReferent);
                        if (dr.kind === DecreeKind.PUBLISHER) 
                            break;
                    }
                    if (t.is_char('(')) {
                        if (FragToken._create_editions(t) !== null) 
                            break;
                        let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                        if (br !== null && !br.is_newline_after) {
                        }
                        else 
                            break;
                    }
                    if (ltt.has_verb && !ltt.all_upper) {
                        if (t.is_value("О", "ПРО") && tt0 === t) {
                        }
                        else if (!po_delu) 
                            break;
                    }
                    if (ltt.typ === InstrToken1Types.DIRECTIVE) 
                        break;
                    let str = ltt.toString();
                    if (t.previous !== null && t.previous.is_value("ИЗМЕНЕНИЕ", null)) {
                    }
                    else if (str.includes("В СОСТАВЕ") || str.includes("В СКЛАДІ") || str.includes("У СКЛАДІ")) 
                        break;
                    if (t.is_value("В", null) && t.next !== null && t.next.is_value("ЦЕЛЬ", "МЕТА")) 
                        break;
                    if (first_line === null) 
                        first_line = ltt;
                    else if (first_line.all_upper && !ltt.all_upper && !BracketHelper.can_be_start_of_sequence(t, false, false)) 
                        break;
                    t1 = (t = ltt.end_token);
                    if (t1.is_table_control_char) {
                        t1 = (t = t1.previous);
                        break;
                    }
                }
                else 
                    t1 = t;
            }
            let tt1 = DecreeToken._try_attach_std_change_name(tt0);
            if (tt1 !== null) {
                if (t1 === null || (t1.end_char < tt1.end_char)) 
                    t1 = tt1;
            }
            let val = (t1 !== null && t1 !== tt0 ? FragToken.get_restored_name(tt0, t1, false) : null);
            if (!Utils.isNullOrEmpty(val) && Utils.isLetter(val[0]) && Utils.isLowerCase(val[0])) 
                val = (val[0].toUpperCase()) + val.substring(1);
            if (_name === null && title.children.length > 0 && title.children[title.children.length - 1].kind === InstrumentKind.TYP) {
                let npt = NounPhraseHelper.try_parse(tt0, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null) {
                    if (npt.morph._case.is_genitive) {
                        _name = Utils.asString(title.children[title.children.length - 1].value);
                        if (DecreeToken.try_attach(title.children[title.children.length - 1].begin_token, null, false) === null) {
                            tt0 = title.children[title.children.length - 1].begin_token;
                            title.children.splice(title.children.length - 1, 1);
                        }
                    }
                }
            }
            if (val === null) 
                val = _name;
            else if (_name !== null) 
                val = (_name + " " + val);
            if (val !== null) {
                if (nt0 !== null) 
                    tt0 = nt0;
                val = val.trim();
                if (val.startsWith("[") && val.endsWith("]")) 
                    val = val.substring(1, 1 + val.length - 2).trim();
                doc.add_slot(InstrumentBlockReferent.ATTR_NAME, val.trim(), true, 0);
                title.children.push(FragToken._new1392(tt0, t1, InstrumentKind.NAME, val.trim()));
                if (val.includes("КОДЕКС")) {
                    let npt = NounPhraseHelper.try_parse(tt0, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null && npt.noun.is_value("КОДЕКС", null)) 
                        doc.typ = "КОДЕКС";
                }
            }
        }
        if (t1 === null) 
            return null;
        title.end_token = t1;
        for (t1 = t1.next; t1 !== null; t1 = t1.next) {
            if (t1.is_newline_before && (t1.get_referent() instanceof DecreeReferent) && t1.is_newline_after) {
                let dr = Utils.as(t1.get_referent(), DecreeReferent);
                title.children.push(FragToken._new1338(t1, t1, InstrumentKind.IGNORED));
                continue;
            }
            if (t1.is_newline_before && t1.is_value("ЧАСТЬ", "ЧАСТИНА")) {
                let pt = PartToken.try_attach(t1, null, false, false);
                if (pt !== null && pt.is_newline_after) {
                    let pt2 = PartToken.try_attach(pt.end_token.next, null, false, false);
                    if (pt2 !== null && (((pt2.typ === PartTokenItemType.SECTION || pt2.typ === PartTokenItemType.SUBSECTION || pt2.typ === PartTokenItemType.CHAPTER) || pt2.typ === PartTokenItemType.CLAUSE))) {
                    }
                    else {
                        doc.add_slot(InstrumentReferent.ATTR_PART, pt.values[0].value, false, 0);
                        title.children.push(FragToken._new1392(t1, pt.end_token, InstrumentKind.DOCPART, pt.values[0].value));
                        t1 = title.end_token = pt.end_token;
                        continue;
                    }
                }
            }
            if (t1.is_newline_before) {
                let iii = InstrToken1.parse(t1, true, null, 0, null, false, 0, false, false);
                if (iii !== null && iii.typ === InstrToken1Types.COMMENT) {
                    title.children.push(FragToken._new1338(t1, iii.end_token, InstrumentKind.COMMENT));
                    t1 = iii.end_token;
                    continue;
                }
            }
            let appr1 = FragToken._create_approved(t1);
            if (appr1 !== null) {
                t1 = appr1.end_token;
                title.children.push(appr1);
                title.end_token = appr1.end_token;
                continue;
            }
            appr1 = FragToken._create_misc(t1);
            if (appr1 !== null) {
                t1 = appr1.end_token;
                title.children.push(appr1);
                title.end_token = appr1.end_token;
                continue;
            }
            let cinf = FragToken._create_case_info(t1);
            if (cinf !== null) {
                t1 = cinf.end_token;
                title.children.push(cinf);
                title.end_token = cinf.end_token;
                continue;
            }
            let eds = FragToken._create_editions(t1);
            if (eds !== null) {
                title.children.push(eds);
                title.end_token = (t1 = eds.end_token);
                continue;
            }
            if ((t1.get_referent() instanceof DecreeReferent) && (t1.get_referent()).kind === DecreeKind.PUBLISHER && t1.is_newline_after) {
                let pub = FragToken._new1338(t1, t1, InstrumentKind.APPROVED);
                pub.referents = new Array();
                pub.referents.push(t1.get_referent());
                title.children.push(pub);
                title.end_token = t1;
                continue;
            }
            let tt = t1;
            if (tt.next !== null && tt.is_char(',')) 
                tt = tt.next;
            let dt = DecreeToken.try_attach(tt, null, false);
            if (dt !== null && ((dt.typ === DecreeTokenItemType.DATE || dt.typ === DecreeTokenItemType.TERR || ((dt.typ === DecreeTokenItemType.NUMBER && ((dt.is_delo || MiscHelper.check_number_prefix(tt) !== null))))))) {
                if (dt.typ === DecreeTokenItemType.DATE) {
                    if (doc.date !== null) 
                        break;
                    if (!dt.is_newline_after && !MiscHelper.can_be_start_of_sentence(dt.end_token.next)) {
                        let ttt = dt.end_token.next;
                        if (ttt !== null && (((ttt.get_referent() instanceof GeoReferent) || ttt.is_comma))) {
                        }
                        else 
                            break;
                    }
                }
                if (!dt.is_newline_after) {
                    let lll = InstrToken1.parse(tt, true, null, 0, null, false, 0, false, false);
                    if (lll !== null && lll.has_verb) 
                        break;
                }
                FragToken._add_title_attr(doc, title, dt);
                t1 = title.end_token = dt.end_token;
                continue;
            }
            if (tt.is_char_of("([") && tt.is_newline_before) {
                let br = BracketHelper.try_parse(tt, BracketParseAttr.of((BracketParseAttr.CANBEMANYLINES.value()) | (BracketParseAttr.CANCONTAINSVERBS.value())), 100);
                if (br !== null) {
                    t1 = title.end_token = br.end_token;
                    title.children.push(FragToken._new1338(br.begin_token, br.end_token, (tt.is_char('[') ? InstrumentKind.NAME : InstrumentKind.COMMENT)));
                    continue;
                }
            }
            if (tt.is_table_control_char) {
                title.end_token = tt;
                continue;
            }
            break;
        }
        t1 = title.end_token.next;
        if (t1 !== null && t1.is_newline_before && doc.typ === "КОДЕКС") {
            let pt = PartToken.try_attach(t1, null, false, false);
            if (pt !== null && ((pt.typ === PartTokenItemType.PART || pt.typ === PartTokenItemType.DOCPART)) && pt.values.length > 0) {
                let cou = 0;
                for (t = pt.end_token; t !== null; t = t.next) {
                    if (t.is_newline_before) {
                        if ((++cou) > 4) 
                            break;
                        let eds = FragToken._create_editions(t);
                        if (eds !== null) {
                            title.children.push(eds);
                            title.end_token = (t1 = eds.end_token);
                            title.children.push(FragToken._new1392(pt.begin_token, pt.end_token, InstrumentKind.DOCPART, pt.values[0].value));
                            if (doc.name !== null && doc.name.includes("КОДЕКС")) 
                                doc.add_slot(InstrumentReferent.ATTR_PART, pt.values[0].value, false, 0);
                            break;
                        }
                    }
                }
            }
            else if (t1.get_referent() instanceof DecreePartReferent) {
                let dr0 = Utils.as(t1.get_referent(), DecreePartReferent);
                if (dr0.part !== null || dr0.doc_part !== null) {
                    let cou = 0;
                    for (t = t1.next; t !== null; t = t.next) {
                        if (t.is_newline_before) {
                            if ((++cou) > 4) 
                                break;
                            let eds = FragToken._create_editions(t);
                            if (eds !== null) {
                                title.children.push(eds);
                                title.end_token = (t1 = eds.end_token);
                                break;
                            }
                        }
                    }
                }
            }
        }
        return title;
    }
    
    static create_appendix_title(t0, app, doc, is_app, start) {
        const InstrToken = require("./InstrToken");
        if (t0 === null) 
            return null;
        if (t0 !== t0.kit.first_token) {
            if (t0.get_referent() instanceof DecreePartReferent) {
                if ((t0.get_referent()).appendix !== null) 
                    t0 = t0.kit.debed_token(t0);
            }
        }
        let t = t0;
        let t1 = null;
        let rr = t.get_referent();
        if (rr !== null) {
            if (rr.type_name === "PERSON") 
                return null;
        }
        let title = FragToken._new1338(t0, t, InstrumentKind.HEAD);
        let has_app_keyword = false;
        let appr0 = FragToken._create_approved(t0);
        if (appr0 !== null) {
            title.end_token = appr0.end_token;
            title.children.push(appr0);
            t = appr0.end_token.next;
        }
        for (; t !== null; t = t.next) {
            let fr = InstrToken1.parse(t, true, null, 0, null, false, 0, true, false);
            if (fr === null) 
                break;
            if (fr.typ !== InstrToken1Types.APPENDIX && fr.typ !== InstrToken1Types.APPROVED) {
                if (fr.has_many_spec_chars) {
                    t = fr.end_token;
                    continue;
                }
                if (t.get_referent() instanceof OrganizationReferent) {
                    t = fr.end_token;
                    continue;
                }
                if ((t.get_referent() instanceof DecreePartReferent) && (t.get_referent()).appendix !== null) {
                    t = t.kit.debed_token(t);
                    fr = InstrToken1.parse(t, true, null, 0, null, false, 0, true, false);
                    if (fr.typ !== InstrToken1Types.APPENDIX) 
                        break;
                }
                else 
                    break;
            }
            if (fr.typ === InstrToken1Types.APPENDIX) {
                has_app_keyword = true;
                app.kind = InstrumentKind.APPENDIX;
            }
            let t2 = t;
            if (t.is_value("ОСОБЫЙ", "ОСОБЛИВИЙ") && t.next !== null) 
                t2 = t.next;
            if (t instanceof TextToken) 
                title.children.push(FragToken._new1357(t, t2, InstrumentKind.KEYWORD, true));
            title.end_token = (t = fr.end_token);
            if (fr.typ === InstrToken1Types.APPENDIX && fr.num_begin_token === null) {
                let fr1 = InstrToken1.parse(t.next, true, null, 0, null, false, 0, false, false);
                if (fr1 !== null && fr1.typ === InstrToken1Types.APPROVED) {
                    t = fr1.begin_token;
                    title.children.push(FragToken._new1392(t, t, InstrumentKind.KEYWORD, t.get_source_text().toUpperCase()));
                    title.end_token = (t = fr1.end_token);
                    fr = fr1;
                }
            }
            appr0 = FragToken._create_approved(t);
            if (appr0 !== null) {
                t = title.end_token = appr0.end_token;
                title.children.push(appr0);
                continue;
            }
            if (fr.num_begin_token !== null && fr.num_end_token !== null) {
                let num = FragToken._new1392(fr.num_begin_token, fr.num_end_token, InstrumentKind.NUMBER, MiscHelper.get_text_value(fr.num_begin_token, fr.num_end_token, GetTextAttr.KEEPREGISTER));
                title.children.push(num);
                if (fr.numbers.length > 0) 
                    app.number = PartToken.get_number(fr.numbers[0]);
                if (fr.numbers.length > 1) {
                    app.sub_number = PartToken.get_number(fr.numbers[1]);
                    if (fr.numbers.length > 2) 
                        app.sub_number2 = PartToken.get_number(fr.numbers[2]);
                }
                if (is_app) 
                    doc.add_slot(InstrumentReferent.ATTR_APPENDIX, (num.value != null ? num.value : "1"), false, 0);
            }
            else if (t.get_referent() instanceof DecreeReferent) {
                if ((t.get_referent()).kind === DecreeKind.PUBLISHER) {
                    let ff = FragToken._new1338(t, t, InstrumentKind.APPROVED);
                    ff.referents = new Array();
                    ff.referents.push(t.get_referent());
                    title.children.push(ff);
                }
                else if (fr.typ === InstrToken1Types.APPROVED && title.children.length > 0 && title.children[title.children.length - 1].kind === InstrumentKind.KEYWORD) {
                    let kw = title.children[title.children.length - 1];
                    let appr = FragToken._new1338(kw.begin_token, t, InstrumentKind.APPROVED);
                    title.children.splice(title.children.length - 1, 1);
                    appr.children.push(kw);
                    appr.children.push(FragToken._new1338(t, t, InstrumentKind.DOCREFERENCE));
                    title.children.push(appr);
                }
                else 
                    title.children.push(FragToken._new1338(t, t, InstrumentKind.DOCREFERENCE));
            }
            else if (fr.typ === InstrToken1Types.APPROVED && fr.length_char > 15 && fr.begin_token !== fr.end_token) 
                title.children.push(FragToken._new1338(fr.begin_token.next, t, InstrumentKind.DOCREFERENCE));
            else {
                let dts = DecreeToken.try_attach_list(t.next, null, 10, false);
                if (dts !== null && dts.length > 0 && dts[0].typ === DecreeTokenItemType.TYP) {
                    let dref = FragToken._new1338(dts[0].begin_token, dts[0].end_token, InstrumentKind.DOCREFERENCE);
                    for (let i = 1; i < dts.length; i++) {
                        if (dts[i].typ === DecreeTokenItemType.TYP) 
                            break;
                        else if (dts[i].typ !== DecreeTokenItemType.UNKNOWN) 
                            dref.end_token = dts[i].end_token;
                    }
                    title.children.push(dref);
                    title.end_token = (t = dref.end_token);
                }
            }
            if (fr.typ === InstrToken1Types.APPENDIX) {
                t = t.next;
                if (t !== null) {
                    let dpr = Utils.as(t.get_referent(), DecreePartReferent);
                    if (dpr !== null && dpr.appendix !== null) {
                        t = t.kit.debed_token(t);
                        t = t.previous;
                        continue;
                    }
                    if (t.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК")) {
                        t = t.previous;
                        continue;
                    }
                }
                break;
            }
        }
        if (t === null) 
            return null;
        let has_for_npa = false;
        if (t.is_value("К", "ДО")) {
            has_for_npa = true;
            let to_decr = null;
            let toks = new Array();
            for (let tt = t.next; tt !== null; tt = tt.next) {
                if (tt !== t.next && tt.is_table_control_char) 
                    break;
                if (tt.is_newline_before) {
                    if (tt.newlines_before_count > 1) 
                        break;
                    let it1 = InstrToken1.parse(tt, false, null, 0, null, false, 0, false, false);
                    if (it1 !== null && it1.numbers.length > 0) 
                        break;
                    if (tt.chars.is_all_lower) {
                    }
                    else if (tt.length_char > 2) 
                        break;
                }
                if (tt.get_referent() instanceof DecreeReferent) 
                    to_decr = Utils.as(tt.get_referent(), DecreeReferent);
                let tok = InstrToken.parse(tt, 0, null);
                if (tok === null) 
                    break;
                toks.push(tok);
                if (toks.length > 20) 
                    break;
                if (tt === t.next && tok.typ === ILTypes.UNDEFINED) {
                    let ttt = DecreeToken.is_keyword(tt, false);
                    if (ttt !== null) {
                        tok.end_token = ttt;
                        tok.typ = ILTypes.TYP;
                    }
                }
                tt = tok.end_token;
                let dtt = DecreeToken.try_attach(tt.next, null, false);
                if (dtt !== null && dtt.typ === DecreeTokenItemType.DATE) 
                    tt = tok.end_token = dtt.end_token;
                if (tok.typ === ILTypes.TYP && !tt.is_newline_after) {
                    let nn = DecreeToken.try_attach_name(tt.next, null, false, true);
                    if (nn !== null) {
                        tt = tok.end_token = nn.end_token;
                        break;
                    }
                }
            }
            let max_ind = -1;
            for (let ii = 0; ii < toks.length; ii++) {
                let tok = toks[ii];
                if (tok.typ === ILTypes.TYP && ((tok.value === doc.typ || ii === 0))) 
                    max_ind = ii;
                else if (tok.typ === ILTypes.REGNUMBER && (((tok.value === doc.reg_number || tok.value === "?" || tok.is_newline_before) || tok.is_newline_after || tok.has_table_chars))) 
                    max_ind = ii;
                else if (tok.typ === ILTypes.DATE && doc.date !== null) {
                    if ((tok.ref instanceof DateReferent) && (tok.ref).dt === doc.date) 
                        max_ind = ii;
                    else if (tok.ref instanceof ReferentToken) {
                        let dre = Utils.as((tok.ref).referent, DateReferent);
                        if (dre !== null && dre.dt !== null && doc.date !== null) {
                            if (dre.dt === doc.date) 
                                max_ind = ii;
                        }
                    }
                }
                else if (tok.typ === ILTypes.DATE && tok.begin_token.previous !== null && tok.begin_token.previous.is_value("ОТ", null)) 
                    max_ind = ii;
                else if (tok.typ === ILTypes.UNDEFINED && (tok.begin_token.get_referent() instanceof DecreeReferent)) {
                    max_ind = ii;
                    break;
                }
                else if (ii === 0 && tok.typ === ILTypes.UNDEFINED && (tok.begin_token.get_referent() instanceof DecreePartReferent)) {
                    let part = Utils.as(tok.begin_token.get_referent(), DecreePartReferent);
                    if (part.appendix !== null) {
                        max_ind = ii;
                        break;
                    }
                }
                else if (tok.typ === ILTypes.ORGANIZATION && ii === 1) 
                    max_ind = ii;
                else if (tok.typ === ILTypes.UNDEFINED) {
                    if (tok.begin_token.is_value("ОТ", null) || !tok.is_newline_before) 
                        max_ind = ii;
                    else if (MiscHelper.check_number_prefix(tok.begin_token) !== null) 
                        max_ind = ii;
                }
                else if (tok.typ === ILTypes.GEO || tok.typ === ILTypes.ORGANIZATION) 
                    max_ind = ii;
            }
            if (toks.length > 0 && DecreeToken.is_keyword(toks[toks.length - 1].end_token.next, false) !== null) 
                max_ind = toks.length - 1;
            let te = null;
            if (max_ind >= 0) {
                te = toks[max_ind].end_token;
                if (!te.is_newline_after) {
                    let nn = DecreeToken.try_attach_name(te.next, null, false, true);
                    if (nn !== null) 
                        te = nn.end_token;
                }
            }
            else if (t.next !== null && (t.next.get_referent() instanceof DecreeReferent)) 
                te = t.next;
            if (te !== null) {
                let dr = FragToken._new1338(t, te, InstrumentKind.DOCREFERENCE);
                if (to_decr !== null) {
                    dr.referents = new Array();
                    dr.referents.push(to_decr);
                }
                title.children.push(dr);
                title.end_token = te;
                if ((((t = te.next))) === null) 
                    return title;
            }
        }
        if (title.children.length === 0) {
            if (t !== null && t.is_value("АКТ", null)) {
            }
            else 
                return null;
        }
        for (let kk = 0; kk < 10; kk++) {
            let ta = FragToken._create_approved(t);
            if (ta !== null) {
                title.children.push(ta);
                title.end_token = (t = ta.end_token);
                t = t.next;
                if (t === null) 
                    return title;
                continue;
            }
            ta = FragToken._create_misc(t);
            if (ta !== null) {
                title.children.push(ta);
                title.end_token = (t = ta.end_token);
                t = t.next;
                if (t === null) 
                    return title;
                continue;
            }
            let ee = FragToken._create_editions(t);
            if (ee !== null) {
                title.children.push(ee);
                title.end_token = ee.end_token;
                t = ee.end_token.next;
                if (t === null) 
                    return title;
                continue;
            }
            break;
        }
        let tt0 = t;
        if ((start && has_for_npa && has_app_keyword) && tt0.is_newline_before) {
            let dty = DecreeToken.try_attach(tt0, null, false);
            if (dty !== null && dty.typ === DecreeTokenItemType.TYP) {
                let sub = FragToken.create_document(tt0, 0, InstrumentKind.UNDEFINED);
                if (sub !== null && sub.children.length > 1 && sub.m_doc.find_slot(InstrumentReferent.ATTR_APPENDIX, null, true) === null) {
                    if (sub.children[0].kind === InstrumentKind.HEAD && sub.children[0].children.length > 1 && sub.children[0].children[0].kind === InstrumentKind.TYP) {
                        title.tag = sub;
                        return title;
                    }
                }
            }
        }
        let nt0 = null;
        for (; t !== null; t = t.next) {
            if (t.is_table_control_char) {
                if (t === tt0) {
                    if (t.is_char(String.fromCharCode(0x1E))) {
                        let rows = TableHelper.try_parse_rows(t, 0, true);
                        if (rows !== null && rows.length > 2) 
                            break;
                        break;
                    }
                    tt0 = t.next;
                    continue;
                }
                break;
            }
            if (t.is_newline_before || t.previous.is_table_control_char) {
                if (FragToken._is_start_of_body(t, t === tt0)) 
                    break;
                if (FragToken._create_approved(t) !== null) 
                    break;
                if (FragToken._create_editions(t) !== null) 
                    break;
                if (t !== tt0 && t.whitespaces_before_count > 15) {
                    if (DecreeToken.is_keyword(t.previous, false) === null) {
                        if (!t.previous.is_value("ОБРАЗЕЦ", "ЗРАЗОК")) 
                            break;
                    }
                    if (t.whitespaces_before_count > 25) 
                        break;
                }
                if (t.get_referent() instanceof InstrumentParticipant) 
                    break;
                if (t.get_referent() instanceof OrganizationReferent) {
                    if (t.whitespaces_before_count > 15) 
                        break;
                }
                let dd = DecreeToken.try_attach(t, null, false);
                if (dd !== null && ((dd.typ === DecreeTokenItemType.DATE || dd.typ === DecreeTokenItemType.TERR)) && dd.is_newline_after) {
                    let npt0 = null;
                    if (dd.typ === DecreeTokenItemType.TERR && (t instanceof ReferentToken)) 
                        npt0 = NounPhraseHelper.try_parse((t).begin_token, NounPhraseParseAttr.NO, 0, null);
                    if (npt0 !== null && !npt0.morph._case.is_undefined && !npt0.morph._case.is_nominative) {
                    }
                    else {
                        FragToken._add_title_attr(null, title, dd);
                        t = title.end_token = dd.end_token;
                        continue;
                    }
                }
                let ltt = InstrToken1.parse(t, true, null, 0, null, false, 0, true, false);
                if (ltt === null) 
                    break;
                if (ltt.numbers.length > 0) 
                    break;
                if (ltt.typ === InstrToken1Types.APPROVED) {
                    title.children.push(FragToken._new1338(ltt.begin_token, ltt.begin_token, InstrumentKind.APPROVED));
                    if (ltt.begin_token !== ltt.end_token) 
                        title.children.push(FragToken._new1338(ltt.begin_token.next, ltt.end_token, InstrumentKind.DOCREFERENCE));
                    t = ltt.end_token;
                    if (ltt.begin_token === tt0) {
                        tt0 = t.next;
                        continue;
                    }
                    break;
                }
                if (ltt.has_verb && !ltt.all_upper) {
                    if (t.chars.is_letter && t.chars.is_all_lower) {
                    }
                    else if (t.get_referent() instanceof DecreeChangeReferent) {
                        let dch = Utils.as(t.get_referent(), DecreeChangeReferent);
                        if (dch.kind === DecreeChangeKind.CONTAINER && t.is_value("ИЗМЕНЕНИЕ", null)) {
                        }
                        else 
                            break;
                    }
                    else if (DecreeToken.is_keyword(t, false) !== null) {
                    }
                    else if ((t === tt0 && ltt.end_token.next !== null && ltt.end_token.next.is_char(String.fromCharCode(0x1E))) && !ltt.end_token.is_char(':')) {
                    }
                    else 
                        break;
                }
                if (ltt.typ === InstrToken1Types.DIRECTIVE) 
                    break;
                if (t.chars.is_letter && t !== tt0) {
                    if (!t.chars.is_all_lower && !t.chars.is_all_upper) {
                        if (!((t.get_referent() instanceof OrganizationReferent)) && !((t.get_referent() instanceof GeoReferent))) {
                            if (DecreeToken.is_keyword(t.previous, false) === null) {
                                let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                                if (npt !== null && npt.morph._case.is_genitive) {
                                }
                                else 
                                    break;
                            }
                        }
                    }
                }
                let has_words = false;
                for (let ttt = ltt.begin_token; ttt !== null; ttt = ttt.next) {
                    if (ttt.begin_char > ltt.end_char) 
                        break;
                    if (ttt.chars.is_cyrillic_letter) {
                        has_words = true;
                        break;
                    }
                    let r = ttt.get_referent();
                    if ((r instanceof OrganizationReferent) || (r instanceof GeoReferent) || (r instanceof DecreeChangeReferent)) {
                        has_words = true;
                        break;
                    }
                }
                if (!has_words) 
                    break;
                let eds = FragToken._create_editions(t);
                if (eds !== null) {
                    if (t !== tt0) 
                        break;
                    title.children.push(eds);
                    t1 = (t = title.end_token = eds.end_token);
                    tt0 = t.next;
                    continue;
                }
                t1 = (t = ltt.end_token);
            }
            else 
                t1 = t;
        }
        let val = (t1 !== null && tt0 !== null ? FragToken.get_restored_name(tt0, t1, false) : null);
        if (val !== null) {
            if (nt0 !== null) 
                tt0 = nt0;
            title.children.push(FragToken._new1392(tt0, t1, InstrumentKind.NAME, val.trim()));
            title.end_token = t1;
            title.name = val;
        }
        while (title.end_token.next !== null) {
            let eds = FragToken._create_editions(title.end_token.next);
            if (eds !== null) {
                title.children.push(eds);
                title.end_token = eds.end_token;
                continue;
            }
            let appr = FragToken._create_approved(title.end_token.next);
            if (appr !== null) {
                title.children.push(appr);
                title.end_token = appr.end_token;
                continue;
            }
            break;
        }
        if (is_app) {
            if (doc.find_slot(InstrumentReferent.ATTR_APPENDIX, null, true) === null) 
                doc.add_slot(InstrumentReferent.ATTR_APPENDIX, "", false, 0);
            for (const ch of title.children) {
                if (ch.kind === InstrumentKind.DOCREFERENCE) {
                    for (let tt = ch.begin_token; tt !== null && tt.end_char <= ch.end_char; tt = tt.next) {
                        if (tt.get_referent() instanceof DecreeReferent) {
                            for (const s of tt.get_referent().slots) {
                                if (s.type_name === DecreeReferent.ATTR_TYPE) 
                                    doc.add_slot(InstrumentReferent.ATTR_TYPE, s.value, false, 0);
                                else if (s.type_name === DecreeReferent.ATTR_NUMBER) 
                                    doc.add_slot(InstrumentReferent.ATTR_REGNUMBER, s.value, false, 0);
                                else if (s.type_name === DecreeReferent.ATTR_DATE) 
                                    doc.add_slot(InstrumentReferent.ATTR_DATE, s.value, false, 0);
                                else if (s.type_name === DecreeReferent.ATTR_SOURCE) 
                                    doc.add_slot(InstrumentReferent.ATTR_SOURCE, s.value, false, 0);
                                else if (s.type_name === DecreeReferent.ATTR_GEO) 
                                    doc.add_slot(InstrumentReferent.ATTR_GEO, s.value, false, 0);
                            }
                            break;
                        }
                        let dt = DecreeToken.try_attach(tt, null, false);
                        if (dt !== null) {
                            if (FragToken._add_title_attr(doc, null, dt)) 
                                tt = dt.end_token;
                        }
                    }
                    break;
                }
            }
        }
        if (title.children.length === 0 && title.end_token === title.begin_token) 
            return null;
        for (t1 = title.end_token.next; t1 !== null; t1 = t1.next) {
            let dt = DecreeToken.try_attach(t1, null, false);
            if (dt !== null) {
                if (dt.typ === DecreeTokenItemType.DATE || dt.typ === DecreeTokenItemType.TERR) {
                    FragToken._add_title_attr(null, title, dt);
                    t1 = title.end_token = dt.end_token;
                    continue;
                }
            }
            break;
        }
        while (title.end_token.next !== null) {
            if (title.end_token.next.is_table_control_char && ((!title.end_token.next.is_newline_before || title.end_token.next.is_newline_after || ((title.end_token.next.next !== null && title.end_token.next.next.is_char(String.fromCharCode(0x1F))))))) 
                title.end_token = title.end_token.next;
            else 
                break;
        }
        return title;
    }
    
    static _is_start_of_body(t, is_app_title = false) {
        if (t === null || !t.is_newline_before) 
            return false;
        if (!is_app_title) {
            let bl = BlockTitleToken.try_attach(t, false, null);
            if (bl !== null) {
                if (bl.typ !== BlkTyps.UNDEFINED && bl.typ !== BlkTyps.LITERATURE) 
                    return true;
            }
        }
        let li = MailLine.parse(t, 0);
        if (li !== null) {
            if (li.typ === MailLineTypes.HELLO) 
                return true;
        }
        let it1 = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
        if (it1 !== null) {
            if (it1.typ === InstrToken1Types.INDEX) 
                return true;
        }
        let ok = false;
        if (t.is_value("ВВЕДЕНИЕ", "ВВЕДЕННЯ") || t.is_value("АННОТАЦИЯ", "АНОТАЦІЯ") || t.is_value("ПРЕДИСЛОВИЕ", "ПЕРЕДМОВА")) 
            ok = true;
        else if (t.is_value("ОБЩИЙ", "ЗАГАЛЬНИЙ") && t.next !== null && t.next.is_value("ПОЛОЖЕНИЕ", "ПОЛОЖЕННЯ")) {
            t = t.next;
            ok = true;
        }
        else if ((t.next !== null && t.next.chars.is_all_lower && t.morph.class0.is_preposition) && ((t.next.is_value("СВЯЗЬ", "ЗВЯЗОК") || t.next.is_value("ЦЕЛЬ", "МЕТА") || t.next.is_value("СООТВЕТСТВИЕ", "ВІДПОВІДНІСТЬ")))) 
            return true;
        if (ok) {
            let t1 = t.next;
            if (t1 !== null && t1.is_char(':')) 
                t1 = t1.next;
            if (t1 === null || t1.is_newline_before) 
                return true;
            return false;
        }
        let it = InstrToken1.parse(t, false, null, 0, null, false, 0, false, false);
        if (it !== null) {
            if (it.typ_container_rank > 0 || it.typ === InstrToken1Types.DIRECTIVE) {
                if (t.is_value("ЧАСТЬ", "ЧАСТИНА") && it.numbers.length === 1) {
                    if (FragToken._create_approved(it.end_token.next) !== null) 
                        return false;
                }
                return true;
            }
            if (it.numbers.length > 0) {
                if (it.numbers.length > 1 || it.num_suffix !== null) 
                    return true;
            }
        }
        if ((t.get_referent() instanceof OrganizationReferent) && t.next !== null) {
            if (t.next.is_value("СОСТАВ", "СКЛАД")) 
                return true;
            if (t.next.is_value("В", "У") && t.next.next !== null && t.next.next.is_value("СОСТАВ", "СКЛАД")) 
                return true;
        }
        return false;
    }
    
    static _add_title_attr(doc, title, dt) {
        if (dt.typ === DecreeTokenItemType.TYP) {
            if (doc !== null) {
                if (doc.typ !== null && dt.value !== doc.typ) {
                    if (doc.typ !== "ПРОЕКТ") 
                        return false;
                    if (dt.value.includes("ЗАКОН")) 
                        doc.typ = "ПРОЕКТ ЗАКОНА";
                    else 
                        return false;
                }
                else 
                    doc.typ = dt.value;
                if (dt.full_value !== null && dt.full_value !== dt.value && doc.name === null) 
                    doc.name = dt.full_value;
            }
            if (title !== null) 
                title.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.TYP, (dt.full_value != null ? dt.full_value : dt.value)));
        }
        else if (dt.typ === DecreeTokenItemType.NUMBER) {
            if (dt.is_delo) {
                if (doc !== null) {
                    doc.add_slot(InstrumentReferent.ATTR_CASENUMBER, dt.value, false, 0);
                    if (doc.reg_number === dt.value) 
                        doc.reg_number = null;
                }
                if (title !== null) 
                    title.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.CASENUMBER, dt.value));
            }
            else {
                if (dt.value !== "?" && doc !== null) {
                    if (doc.get_string_value(InstrumentReferent.ATTR_CASENUMBER) === dt.value) {
                    }
                    else 
                        doc.add_slot(InstrumentBlockReferent.ATTR_NUMBER, dt.value, false, 0);
                }
                if (title !== null) 
                    title.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.NUMBER, dt.value));
                if (doc !== null && doc.typ === null && dt.value !== null) {
                    if (LanguageHelper.ends_with(dt.value, "ФКЗ")) 
                        doc.typ = "ФЕДЕРАЛЬНЫЙ КОНСТИТУЦИОННЫЙ ЗАКОН";
                    else if (LanguageHelper.ends_with(dt.value, "ФЗ")) 
                        doc.typ = "ФЕДЕРАЛЬНЫЙ ЗАКОН";
                }
            }
        }
        else if (dt.typ === DecreeTokenItemType.NAME) {
            if (doc !== null) 
                doc.add_slot(InstrumentBlockReferent.ATTR_NAME, dt.value, false, 0);
            if (title !== null) 
                title.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.NAME, dt.value));
        }
        else if (dt.typ === DecreeTokenItemType.DATE) {
            if (doc === null || doc.add_date(dt)) {
                if (title !== null) 
                    title.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.DATE, dt));
            }
        }
        else if (dt.typ === DecreeTokenItemType.TERR) {
            if (title !== null) 
                title.children.push(FragToken._new1392(dt.begin_token, dt.end_token, InstrumentKind.PLACE, dt));
            if (doc !== null && dt.ref !== null) {
                let _geo = doc.get_string_value(InstrumentReferent.ATTR_GEO);
                if (_geo === "Россия") {
                    doc.add_slot(InstrumentReferent.ATTR_GEO, null, true, 0);
                    _geo = null;
                }
                if (_geo === null) 
                    doc.add_slot(InstrumentReferent.ATTR_GEO, dt.ref.referent.toString(), false, 0);
            }
        }
        else if (dt.typ === DecreeTokenItemType.OWNER || dt.typ === DecreeTokenItemType.ORG) {
            if (title !== null) 
                title.children.push(FragToken._new1392(dt.begin_token, dt.end_token, (dt.typ === DecreeTokenItemType.ORG ? InstrumentKind.ORGANIZATION : InstrumentKind.INITIATOR), dt));
            if (doc !== null) {
                if (dt.ref !== null) {
                    doc.add_slot(DecreeReferent.ATTR_SOURCE, dt.ref.referent, false, 0).tag = dt.get_source_text();
                    if (dt.ref.referent instanceof PersonPropertyReferent) 
                        doc.add_ext_referent(dt.ref);
                }
                else 
                    doc.add_slot(DecreeReferent.ATTR_SOURCE, MiscHelper.convert_first_char_upper_and_other_lower(dt.value), false, 0).tag = dt.get_source_text();
            }
        }
        else 
            return false;
        return true;
    }
    
    static _new1338(_arg1, _arg2, _arg3) {
        let res = new FragToken(_arg1, _arg2);
        res.kind = _arg3;
        return res;
    }
    
    static _new1339(_arg1, _arg2, _arg3, _arg4) {
        let res = new FragToken(_arg1, _arg2);
        res.itok = _arg3;
        res.is_expired = _arg4;
        return res;
    }
    
    static _new1340(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new FragToken(_arg1, _arg2);
        res.kind = _arg3;
        res.def_val2 = _arg4;
        res.itok = _arg5;
        return res;
    }
    
    static _new1347(_arg1, _arg2, _arg3) {
        let res = new FragToken(_arg1, _arg2);
        res.itok = _arg3;
        return res;
    }
    
    static _new1348(_arg1, _arg2, _arg3, _arg4) {
        let res = new FragToken(_arg1, _arg2);
        res.kind = _arg3;
        res.itok = _arg4;
        return res;
    }
    
    static _new1355(_arg1, _arg2, _arg3, _arg4) {
        let res = new FragToken(_arg1, _arg2);
        res.kind = _arg3;
        res.number = _arg4;
        return res;
    }
    
    static _new1357(_arg1, _arg2, _arg3, _arg4) {
        let res = new FragToken(_arg1, _arg2);
        res.kind = _arg3;
        res.def_val2 = _arg4;
        return res;
    }
    
    static _new1360(_arg1, _arg2, _arg3, _arg4) {
        let res = new FragToken(_arg1, _arg2);
        res.kind = _arg3;
        res.def_val = _arg4;
        return res;
    }
    
    static _new1372(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new FragToken(_arg1, _arg2);
        res.kind = _arg3;
        res.value = _arg4;
        res.itok = _arg5;
        return res;
    }
    
    static _new1377(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new FragToken(_arg1, _arg2);
        res.kind = _arg3;
        res.number = _arg4;
        res.is_expired = _arg5;
        res.referents = _arg6;
        return res;
    }
    
    static _new1392(_arg1, _arg2, _arg3, _arg4) {
        let res = new FragToken(_arg1, _arg2);
        res.kind = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new1398(_arg1, _arg2, _arg3, _arg4) {
        let res = new FragToken(_arg1, _arg2);
        res.m_doc = _arg3;
        res.kind = _arg4;
        return res;
    }
    
    static _new1556(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new FragToken(_arg1, _arg2);
        res.kind = _arg3;
        res.def_val = _arg4;
        res.itok = _arg5;
        return res;
    }
    
    static static_constructor() {
        FragToken.m_zapiska_keywords = ["ЗАЯВЛЕНИЕ", "ЗАПИСКА", "РАПОРТ", "ДОКЛАД", "ОТЧЕТ"];
    }
}


FragToken.static_constructor();

module.exports = FragToken