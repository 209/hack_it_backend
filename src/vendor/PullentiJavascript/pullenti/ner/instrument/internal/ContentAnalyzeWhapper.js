/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const InstrToken1StdTitleType = require("./InstrToken1StdTitleType");
const TextToken = require("./../../TextToken");
const Referent = require("./../../Referent");
const NumberToken = require("./../../NumberToken");
const MetaToken = require("./../../MetaToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const DecreeReferent = require("./../../decree/DecreeReferent");
const DecreePartReferent = require("./../../decree/DecreePartReferent");
const InstrToken1Types = require("./InstrToken1Types");
const MiscHelper = require("./../../core/MiscHelper");
const DecreeKind = require("./../../decree/DecreeKind");
const InstrumentKind = require("./../InstrumentKind");
const NumberTypes = require("./NumberTypes");
const ContractHelper = require("./ContractHelper");
const InstrToken1 = require("./InstrToken1");
const EditionHelper = require("./EditionHelper");
const NumberingHelper = require("./NumberingHelper");
const FragToken = require("./FragToken");

class ContentAnalyzeWhapper {
    
    constructor() {
        this.doc_typ = DecreeKind.UNDEFINED;
        this.top_doc = null;
        this.lines = null;
        this.cit_kind = InstrumentKind.UNDEFINED;
    }
    
    analyze(root, _top_doc, is_citat, root_kind) {
        const ListHelper = require("./ListHelper");
        this.top_doc = _top_doc;
        this.cit_kind = root_kind;
        let _lines = new Array();
        let directives = 0;
        let parts = 0;
        if (_top_doc !== null && _top_doc.m_doc !== null) {
            let ty = _top_doc.m_doc.typ;
            if (ty !== null) {
                if ((ty.includes("КОДЕКС") || ty.includes("ЗАКОН") || ty.includes("КОНСТИТУЦИЯ")) || ty.includes("КОНСТИТУЦІЯ")) 
                    this.doc_typ = DecreeKind.KODEX;
                else if (ty.includes("ДОГОВОР") || ty.includes("ДОГОВІР") || ty.includes("КОНТРАКТ")) 
                    this.doc_typ = DecreeKind.CONTRACT;
            }
        }
        for (let t = root.begin_token; t !== null; t = t.next) {
            if (t.begin_char > root.end_token.end_char) 
                break;
            let dpr = Utils.as(t.get_referent(), DecreePartReferent);
            if (dpr !== null && dpr.local_typ !== null && (((dpr.chapter !== null || dpr.clause !== null || dpr.section !== null) || dpr.sub_section !== null))) 
                t = t.kit.debed_token(t);
            if (_lines.length === 120) {
            }
            let lt = InstrToken1.parse(t, false, _top_doc, 0, (_lines.length > 0 ? _lines[_lines.length - 1] : null), is_citat && t === root.begin_token, root.end_token.end_char, false, false);
            if (lt === null) 
                continue;
            if (lt.typ === InstrToken1Types.CLAUSE && lt.numbers.length === 1 && lt.numbers[0] === "13") {
            }
            if (lt.num_typ === NumberTypes.DIGIT && lt.numbers.length === 1 && lt.numbers[0] === "10") {
            }
            if (lt.typ === InstrToken1Types.EDITIONS) {
                if ((!lt.is_newline_after && lt.end_token.next !== null && lt.end_token.next.is_newline_after) && (lt.end_token.next instanceof TextToken) && !lt.end_token.next.chars.is_letter) 
                    lt.end_token = lt.end_token.next;
            }
            if (lt.numbers.length > 0) {
            }
            if (_lines.length === 0 && root_kind !== InstrumentKind.UNDEFINED) {
                if ((root_kind === InstrumentKind.INDENTION || root_kind === InstrumentKind.ITEM || root_kind === InstrumentKind.SUBITEM) || root_kind === InstrumentKind.CLAUSEPART) 
                    lt.typ = InstrToken1Types.LINE;
                else if (root_kind === InstrumentKind.CHAPTER) 
                    lt.typ = InstrToken1Types.CHAPTER;
                else if (root_kind === InstrumentKind.CLAUSE) 
                    lt.typ = InstrToken1Types.CLAUSE;
                else if (root_kind === InstrumentKind.SECTION) 
                    lt.typ = InstrToken1Types.SECTION;
                else if (root_kind === InstrumentKind.SUBSECTION) 
                    lt.typ = InstrToken1Types.SUBSECTION;
                else if (root_kind === InstrumentKind.DOCPART) 
                    lt.typ = InstrToken1Types.DOCPART;
            }
            if (lt.typ === InstrToken1Types.CLAUSE && lt.first_number === 103) {
            }
            if (lt.end_char > root.end_char) 
                lt.end_token = root.end_token;
            if (lt.typ === InstrToken1Types.DIRECTIVE) 
                directives++;
            if ((lt.num_typ === NumberTypes.LETTER && lt.numbers.length === 1 && lt.last_number > 1) && root_kind !== InstrumentKind.SUBITEM && root_kind !== InstrumentKind.ITEM) {
                let ok = false;
                for (let i = _lines.length - 1; i >= 0; i--) {
                    if (_lines[i].num_typ === lt.num_typ) {
                        let j = lt.last_number - _lines[i].last_number;
                        ok = j === 1 || j === 2;
                        break;
                    }
                }
                if (!ok) {
                    lt.num_typ = NumberTypes.UNDEFINED;
                    lt.numbers.splice(0, lt.numbers.length);
                }
            }
            if (lt.typ_container_rank > 0 && !lt.is_num_doubt) 
                parts++;
            _lines.push(lt);
            t = lt.end_token;
        }
        ListHelper.correct_index(_lines);
        ListHelper.correct_app_list(_lines);
        if (directives > 0 && directives > parts) 
            this._analize_content_with_directives(root, _lines, _top_doc.m_doc !== null && _top_doc.m_doc.case_number !== null);
        else 
            this._analize_content_with_containers(root, _lines, 0, _top_doc);
        this._analize_preamble(root);
        root._analize_tables();
        if (this.doc_typ === DecreeKind.CONTRACT) {
        }
        else 
            this._correct_kodex_parts(root);
        this._analize_sections(root);
        this._correct_names(root, null);
        EditionHelper.analize_editions(root);
        if (this.doc_typ === DecreeKind.CONTRACT) 
            ContractHelper.correct_dummy_newlines(root);
        ListHelper.analyze(root);
        if (root_kind === InstrumentKind.CLAUSEPART || root_kind === InstrumentKind.ITEM || root_kind === InstrumentKind.SUBITEM) {
            for (const ch of root.children) {
                if (ch.kind === InstrumentKind.ITEM) {
                    if (root_kind === InstrumentKind.CLAUSEPART) {
                        ch.kind = InstrumentKind.CLAUSEPART;
                        for (const chh of ch.children) {
                            if (chh.kind === InstrumentKind.SUBITEM) 
                                chh.kind = InstrumentKind.ITEM;
                        }
                    }
                    else if (root_kind === InstrumentKind.SUBITEM) 
                        ch.kind = InstrumentKind.SUBITEM;
                }
            }
        }
        this._post_correct(root, _lines);
    }
    
    _post_correct(root, _lines) {
        for (const ch of root.children) {
            this._post_correct(ch, _lines);
        }
        if (root.children.length > 0) {
            if (root.end_char < root.children[root.children.length - 1].end_char) 
                root.end_token = root.children[root.children.length - 1].end_token;
            if (root.begin_char > root.children[0].begin_char) 
                root.begin_token = root.children[0].begin_token;
        }
    }
    
    /**
     * Анализ текстов, явно содержащих главы, разделы, статьи и т.п.
     * @param _lines 
     * @param proc 
     */
    _analize_content_with_containers(root, _lines, top_level, _top_doc) {
        let nums = new Array();
        let k = 0;
        let lev = 100;
        let li0 = null;
        let koef = 0;
        if (((root.kind === InstrumentKind.PARAGRAPH && _lines.length > 10 && _lines[0].typ === InstrToken1Types.LINE) && _lines[0].numbers.length > 0 && !_lines[0].has_verb) && _lines[1].typ === InstrToken1Types.CLAUSE) {
            nums.push(_lines[0]);
            for (let ii = 2; ii < (_lines.length - 1); ii++) {
                let ch = _lines[ii];
                if (ch.typ !== InstrToken1Types.LINE || ch.has_verb || ch.numbers.length !== nums[0].numbers.length) 
                    continue;
                let la = nums[nums.length - 1];
                if (NumberingHelper.calc_delta(la, ch, false) !== 1) 
                    continue;
                if (la.num_typ !== ch.num_typ || la.num_suffix !== ch.num_suffix) 
                    continue;
                if (ch.end_token.is_char('.')) {
                    if (!la.end_token.is_char('.')) 
                        continue;
                }
                let has_clause = false;
                for (let jj = ii + 1; jj < _lines.length; jj++) {
                    if (_lines[jj].typ === InstrToken1Types.CLAUSE) {
                        has_clause = true;
                        break;
                    }
                    else if (_lines[jj].typ !== InstrToken1Types.COMMENT && _lines[jj].typ !== InstrToken1Types.EDITIONS) 
                        break;
                }
                if (has_clause) 
                    nums.push(ch);
            }
            if (nums.length < 2) 
                nums.splice(0, nums.length);
            else {
                koef = 2;
                for (const nn of nums) {
                    nn.typ = InstrToken1Types.SUBPARAGRAPH;
                    lev = nn.typ_container_rank;
                }
            }
        }
        if (nums.length === 0) {
            for (const li of _lines) {
                if (li.typ === InstrToken1Types.COMMENT || li.typ === InstrToken1Types.EDITIONS) 
                    continue;
                if (li0 === null) 
                    li0 = li;
                k++;
                if (li.typ_container_rank > top_level) {
                    if (li.typ_container_rank < lev) {
                        if (nums.length > 2 && li.numbers.length === 0) {
                        }
                        else if (k > 20) {
                        }
                        else {
                            lev = li.typ_container_rank;
                            nums.splice(0, nums.length);
                        }
                    }
                    if (li.typ_container_rank === lev) 
                        nums.push(li);
                }
            }
            for (let i = 0; i < nums.length; i++) {
                let d0 = (i > 0 ? NumberingHelper.calc_delta(nums[i - 1], nums[i], true) : 0);
                let d1 = ((i + 1) < nums.length ? NumberingHelper.calc_delta(nums[i], nums[i + 1], true) : 0);
                let d01 = (i > 0 && ((i + 1) < nums.length) ? NumberingHelper.calc_delta(nums[i - 1], nums[i + 1], true) : 0);
                if (d0 === 1) {
                    if (d1 === 1) 
                        continue;
                    if (d01 === 1 && !nums[i + 1].is_num_doubt && nums[i].is_num_doubt) {
                        nums.splice(i, 1);
                        i--;
                    }
                    continue;
                }
                if (d01 === 1 && nums[i].is_num_doubt) {
                    nums.splice(i, 1);
                    i--;
                    continue;
                }
            }
            for (let i = 1; i < nums.length; i++) {
                let d = NumberingHelper.calc_delta(nums[i - 1], nums[i], true);
                if (d === 1) 
                    koef += 2;
                else if (d === 2) 
                    koef++;
                else if (d <= 0) 
                    koef--;
            }
            if (nums.length > 0) {
                let has_num_before = false;
                for (const li of _lines) {
                    if (li === nums[0]) 
                        break;
                    else if (li.numbers.length > 0) 
                        has_num_before = true;
                }
                if (!has_num_before && ((nums[0].last_number === 1 || ((nums[0] === li0 && nums[0].num_suffix !== null))))) 
                    koef += 2;
                else if (nums[0].typ === InstrToken1Types.CLAUSE && nums[0] === li0) 
                    koef += 2;
            }
        }
        let is_chapters = false;
        if (nums.length === 0) {
            let chaps = 0;
            let nons = 0;
            let clauses = 0;
            for (let i = 0; i < _lines.length; i++) {
                let li = _lines[i];
                if (li.typ === InstrToken1Types.CHAPTER) {
                    nums.push(li);
                    chaps++;
                    lev = li.typ_container_rank;
                }
                else if (li.typ === InstrToken1Types.LINE && li.title_typ !== InstrToken1StdTitleType.UNDEFINED) {
                    nums.push(li);
                    nons++;
                }
                else if (li.typ === InstrToken1Types.CLAUSE) 
                    clauses++;
            }
            if (chaps === 0) 
                nums.splice(0, nums.length);
            else {
                koef += 2;
                is_chapters = true;
            }
        }
        if (koef < 2) {
            if (top_level < InstrToken1._calc_rank(InstrToken1Types.CHAPTER)) {
                if (this._analize_chapter_without_keywords(root, _lines, _top_doc)) 
                    return;
            }
            this._analize_content_without_containers(root, _lines, false, false, false);
            return;
        }
        let n = 0;
        let names = 0;
        let fr = null;
        let blk = new Array();
        for (let i = 0; i <= _lines.length; i++) {
            let li = (i < _lines.length ? _lines[i] : null);
            if (li === null || (((n < nums.length) && li === nums[n]))) {
                if (blk.length > 0) {
                    if (fr === null) {
                        fr = FragToken._new1338(blk[0].begin_token, blk[blk.length - 1].end_token, InstrumentKind.CONTENT);
                        if (blk.length === 1) 
                            fr.itok = blk[0];
                        root.children.push(fr);
                    }
                    fr.end_token = blk[blk.length - 1].end_token;
                    this._analize_content_with_containers(fr, blk, lev, _top_doc);
                    blk.splice(0, blk.length);
                    fr = null;
                }
            }
            if (li === null) 
                break;
            if ((n < nums.length) && li === nums[n]) {
                n++;
                fr = FragToken._new1339(li.begin_token, li.end_token, li, li.is_expired);
                root.children.push(fr);
                if (li.typ === InstrToken1Types.DOCPART) 
                    fr.kind = InstrumentKind.DOCPART;
                else if (li.typ === InstrToken1Types.CLAUSEPART) 
                    fr.kind = InstrumentKind.CLAUSEPART;
                else if (li.typ === InstrToken1Types.SECTION) 
                    fr.kind = InstrumentKind.SECTION;
                else if (li.typ === InstrToken1Types.SUBSECTION) 
                    fr.kind = InstrumentKind.SUBSECTION;
                else if (li.typ === InstrToken1Types.PARAGRAPH) 
                    fr.kind = InstrumentKind.PARAGRAPH;
                else if (li.typ === InstrToken1Types.SUBPARAGRAPH) 
                    fr.kind = InstrumentKind.SUBPARAGRAPH;
                else if (li.typ === InstrToken1Types.CHAPTER) 
                    fr.kind = InstrumentKind.CHAPTER;
                else if (li.typ === InstrToken1Types.CLAUSE) 
                    fr.kind = InstrumentKind.CLAUSE;
                else if (li.typ === InstrToken1Types.NOTICE) 
                    fr.kind = InstrumentKind.NOTICE;
                else if (is_chapters) 
                    fr.kind = InstrumentKind.CHAPTER;
                if (li.begin_token !== li.num_begin_token && li.num_begin_token !== null) 
                    fr.children.push(FragToken._new1340(li.begin_token, li.num_begin_token.previous, InstrumentKind.KEYWORD, true, li));
                NumberingHelper.create_number(fr, li);
                if (li.num_end_token !== li.end_token && li.num_end_token !== null) {
                    if (!li.all_upper && ((((li.has_verb && names === 0 && li.end_token.is_char_of(".:"))) || li.end_token.is_char(':')))) 
                        fr.children.push(FragToken._new1338(li.num_end_token.next, li.end_token, InstrumentKind.CONTENT));
                    else {
                        let fr_name = FragToken._new1340(li.num_end_token.next, li.end_token, InstrumentKind.NAME, true, li);
                        fr.children.push(fr_name);
                        fr.name = FragToken.get_restored_namemt(fr_name, false);
                        i = ContentAnalyzeWhapper.correct_name(fr, fr_name, _lines, i);
                        names++;
                    }
                }
                else if (li.title_typ !== InstrToken1StdTitleType.UNDEFINED) {
                    let fr_name = FragToken._new1340(li.begin_token, li.end_token, InstrumentKind.NAME, true, li);
                    fr.children.push(fr_name);
                    fr.name = FragToken.get_restored_namemt(fr_name, false);
                    i = ContentAnalyzeWhapper.correct_name(fr, fr_name, _lines, i);
                    names++;
                }
                else if ((((i + 1) < _lines.length) && _lines[i + 1].numbers.length === 0 && !_lines[i + 1].has_verb) && !_lines[i + 1].has_many_spec_chars) {
                    if (_lines[i + 1].all_upper || ((_lines[i + 1].begin_token.is_char('['))) || _lines[i].end_token.is_char('.')) {
                        i++;
                        li = _lines[i];
                        fr.end_token = li.end_token;
                        let fr_name = FragToken._new1340(li.begin_token, li.end_token, InstrumentKind.NAME, true, li);
                        fr.children.push(fr_name);
                        fr.name = FragToken.get_restored_namemt(fr_name, false);
                        i = ContentAnalyzeWhapper.correct_name(fr, fr_name, _lines, i);
                        names++;
                    }
                }
                continue;
            }
            if (li.typ === InstrToken1Types.EDITIONS && blk.length === 0 && fr !== null) 
                fr.children.push(FragToken._new1338(li.begin_token, li.end_token, InstrumentKind.EDITIONS));
            else 
                blk.push(li);
        }
    }
    
    static correct_name(fr, fr_name, _lines, i) {
        if ((i + 1) >= _lines.length) 
            return i;
        let li = _lines[i];
        if (li.typ === InstrToken1Types.SUBSECTION) {
        }
        if (fr.name !== null && (fr.name.length < 100)) {
            for (; (i + 1) < _lines.length; i++) {
                if (fr.name.length > 500) 
                    break;
                let lii = _lines[i + 1];
                if (lii.numbers.length > 0 || lii.typ !== InstrToken1Types.LINE) 
                    break;
                if (lii.end_token.is_char(':')) 
                    break;
                if (li.end_token.is_char_of(";")) 
                    break;
                if (li.end_token.is_char('.')) {
                    if (lii.all_upper && li.all_upper) {
                    }
                    else 
                        break;
                }
                if (li.all_upper && !lii.all_upper) 
                    break;
                if ((li.length_char < (Utils.intDiv(lii.length_char, 2))) && lii.has_verb) 
                    break;
                if (li.has_many_spec_chars) 
                    break;
                if (lii.begin_token.whitespaces_before_count > 15) 
                    break;
                if (lii.begin_token.is_value("НЕТ", null) || lii.begin_token.is_value("НЕ", null) || lii.begin_token.is_value("ОТСУТСТВОВАТЬ", null)) 
                    break;
                if (!((lii.begin_token instanceof TextToken))) 
                    break;
                let mc = lii.begin_token.get_morph_class_in_dictionary();
                if (mc.is_undefined) 
                    break;
                let tt = lii.begin_token;
                while (tt instanceof MetaToken) {
                    tt = (tt).begin_token;
                }
                if (tt.chars.is_capital_upper || !tt.chars.is_letter || mc.is_preposition) {
                    if (!li.end_token.is_char(',') && !li.end_token.is_hiphen && !li.end_token.morph.class0.is_conjunction) 
                        break;
                }
                li = lii;
                fr.end_token = fr_name.end_token = li.end_token;
                fr_name.def_val2 = true;
                fr.name = FragToken.get_restored_namemt(fr_name, false);
            }
        }
        return i;
    }
    
    /**
     * Анализ ситуации, когда главы без ключевых слов, только цифра + наименование
     * @param _lines 
     * @param proc 
     * @return 
     */
    _analize_chapter_without_keywords(root, _lines, _top_doc) {
        let nums = NumberingHelper.extract_main_sequence(_lines, true, false);
        let is_contract_struct = false;
        if (nums === null || nums[0].numbers.length !== 1 || nums[0].numbers[0] !== "1") {
            if (this.doc_typ === DecreeKind.CONTRACT) {
                let nums1 = new Array();
                let num0 = "1";
                let ok = true;
                for (let i = 1; i < _lines.length; i++) {
                    let li = _lines[i];
                    let li0 = _lines[i - 1];
                    if ((nums1.length > 0 && nums1[0].title_typ === InstrToken1StdTitleType.SUBJECT && nums1[0].numbers.length === 0) && nums1[0].all_upper) {
                        if (li0.numbers.length <= 1 && ((li0.all_upper || li0.title_typ !== InstrToken1StdTitleType.UNDEFINED))) 
                            nums1.push(li0);
                        continue;
                    }
                    if (li.numbers.length === 2 && li.numbers[0] === num0 && li.numbers[1] === "1") {
                        if (li0.numbers.length === 0 && !li0.begin_token.chars.is_all_lower) {
                        }
                        else if (li0.numbers.length === 1 && li0.numbers[0] === num0) {
                        }
                        else {
                            ok = false;
                            break;
                        }
                        nums1.push(li0);
                        num0 = (nums1.length + 1).toString();
                        continue;
                    }
                    if (li0.title_typ !== InstrToken1StdTitleType.UNDEFINED || ((li0.numbers.length === 1 && li0.numbers[0] === num0))) {
                        nums1.push(li0);
                        num0 = (nums1.length + 1).toString();
                    }
                }
                if (ok && nums1.length > 1) {
                    nums = nums1;
                    is_contract_struct = true;
                }
            }
        }
        if (nums === null) 
            return false;
        if (nums.length > 500) 
            return false;
        let n = 0;
        let err = 0;
        let fr = null;
        let blk = new Array();
        let childs = new Array();
        for (let i = 0; i <= _lines.length; i++) {
            let li = (i < _lines.length ? _lines[i] : null);
            if (li === null || (((n < nums.length) && li === nums[n])) || ((n >= nums.length && li.title_typ !== InstrToken1StdTitleType.UNDEFINED))) {
                if (blk.length > 0) {
                    if (fr === null) {
                        fr = FragToken._new1338(blk[0].begin_token, blk[blk.length - 1].end_token, InstrumentKind.CONTENT);
                        if (blk.length === 1) 
                            fr.itok = blk[0];
                        childs.push(fr);
                    }
                    fr.end_token = blk[blk.length - 1].end_token;
                    this._analize_content_without_containers(fr, blk, false, false, false);
                    blk.splice(0, blk.length);
                    fr = null;
                }
            }
            if (li === null) 
                break;
            if ((n < nums.length) && li === nums[n]) {
                n++;
                if (!li.all_upper && li.has_verb) {
                    if (((li.num_typ === NumberTypes.ROMAN && n >= 2 && childs.length > 0) && childs[childs.length - 1].kind === InstrumentKind.CHAPTER && li.num_typ === nums[n - 2].num_typ) && NumberingHelper.calc_delta(nums[n - 2], li, false) === 1) {
                    }
                    else {
                        blk.push(li);
                        continue;
                    }
                }
                fr = FragToken._new1347(li.begin_token, li.end_token, li);
                childs.push(fr);
                fr.kind = InstrumentKind.CHAPTER;
                NumberingHelper.create_number(fr, li);
                if (li.num_end_token !== li.end_token && li.num_end_token !== null) {
                    if (li.has_many_spec_chars) 
                        fr.children.push(FragToken._new1348(li.num_end_token.next, li.end_token, InstrumentKind.CONTENT, li));
                    else {
                        let fr_name = FragToken._new1340(li.num_end_token.next, li.end_token, InstrumentKind.NAME, true, li);
                        fr.children.push(fr_name);
                        fr.name = FragToken.get_restored_namemt(fr_name, false);
                        i = ContentAnalyzeWhapper.correct_name(fr, fr_name, _lines, i);
                    }
                }
                else if (is_contract_struct) {
                    let fr_name = FragToken._new1340(li.begin_token, li.end_token, InstrumentKind.NAME, true, li);
                    fr.children.push(fr_name);
                    fr.name = FragToken.get_restored_namemt(fr_name, false);
                }
                continue;
            }
            else if (n >= nums.length && li.title_typ !== InstrToken1StdTitleType.UNDEFINED) {
                fr = FragToken._new1347(li.begin_token, li.end_token, li);
                fr.kind = childs[childs.length - 1].kind;
                childs.push(fr);
                let fr_name = FragToken._new1340(li.begin_token, li.end_token, InstrumentKind.NAME, true, li);
                fr.children.push(fr_name);
                fr.name = FragToken.get_restored_namemt(fr_name, false);
                i = ContentAnalyzeWhapper.correct_name(fr, fr_name, _lines, i);
                continue;
            }
            if (blk.length === 0 && li.has_many_spec_chars) 
                err++;
            blk.push(li);
        }
        let coef = -err;
        for (let i = 0; i < childs.length; i++) {
            let chap = childs[i];
            if (i === 0 && chap.number === 0 && chap.length_char > 1000) 
                coef -= 1;
            else {
                let nam = chap.name;
                if (nam === null) 
                    coef--;
                else if (nam.length > 300) 
                    coef -= (Utils.intDiv(nam.length, 300));
                else {
                    coef += 1;
                    let len = chap.length_char - nam.length;
                    if (len > 200) 
                        coef += 1;
                    else if (chap.children.length < 3) 
                        coef--;
                }
            }
            for (const ch of chap.children) {
                if (ch.kind === InstrumentKind.NAME) {
                    if (ch.end_token.is_char_of(":;")) 
                        coef -= 2;
                    break;
                }
                if (ch.number === 0) 
                    continue;
                if (ch.itok === null) 
                    break;
                break;
            }
        }
        if (coef < 3) {
            if (err > 2) 
                return true;
            return false;
        }
        root.children.splice(root.children.length, 0, ...childs);
        if (_top_doc !== null && _top_doc.m_doc !== null && _top_doc.m_doc.typ !== null) {
            let ty = _top_doc.m_doc.typ;
            if (this.doc_typ === DecreeKind.CONTRACT) {
                let ok = true;
                for (const ch of childs) {
                    if (ch.kind === InstrumentKind.CHAPTER) {
                        for (const chh of ch.children) {
                            if (chh.kind === InstrumentKind.CLAUSE) 
                                ok = false;
                        }
                    }
                }
                if (ok) {
                    for (const ch of childs) {
                        if (ch.kind === InstrumentKind.CHAPTER) 
                            ch.kind = InstrumentKind.CLAUSE;
                    }
                }
            }
        }
        return true;
    }
    
    _add_comment_or_edition(fr, li) {
        if (li.typ === InstrToken1Types.COMMENT) 
            fr.children.push(FragToken._new1348(li.begin_token, li.end_token, InstrumentKind.COMMENT, li));
        else if (li.typ === InstrToken1Types.EDITIONS) {
            let edt = FragToken._new1348(li.begin_token, li.end_token, InstrumentKind.EDITIONS, li);
            fr.children.push(edt);
            edt.referents = new Array();
            for (let tt = li.begin_token; tt !== null; tt = tt.next) {
                if (tt.end_char > li.end_token.end_char) 
                    break;
                let dr = Utils.as(tt.get_referent(), DecreeReferent);
                if (dr !== null) {
                    if (!edt.referents.includes(dr)) 
                        edt.referents.push(dr);
                }
            }
        }
    }
    
    _analize_content_without_containers(root, _lines, is_subitem, is_preamble = false, is_kodex = false) {
        if (root.kind === InstrumentKind.CHAPTER) {
        }
        if (root.kind === InstrumentKind.CLAUSE || ((root.kind === InstrumentKind.CHAPTER && this.doc_typ === DecreeKind.CONTRACT))) {
            if (root.number === 8) {
            }
            while (_lines.length > 0) {
                if (_lines[0].typ === InstrToken1Types.COMMENT || _lines[0].typ === InstrToken1Types.EDITIONS) {
                    this._add_comment_or_edition(root, _lines[0]);
                    _lines.splice(0, 1);
                }
                else 
                    break;
            }
            if (_lines.length === 0) 
                return;
            if ((_lines.length > 2 && _lines[0].numbers.length === 0 && _lines[0].end_token.is_char_of(":")) && _lines[1].numbers.length > 0) {
            }
            if (_lines[0].numbers.length === 0 && this.doc_typ !== DecreeKind.CONTRACT) {
                let parts = new Array();
                let tmp = new Array();
                let part = null;
                for (let ii = 0; ii < _lines.length; ii++) {
                    let li = _lines[ii];
                    if ((ii > 0 && li.numbers.length === 0 && li.typ !== InstrToken1Types.EDITIONS) && li.typ !== InstrToken1Types.COMMENT && part !== null) {
                        if (MiscHelper.can_be_start_of_sentence(li.begin_token)) {
                            let end = true;
                            for (let j = ii - 1; j >= 0; j--) {
                                if (_lines[j].typ !== InstrToken1Types.COMMENT && _lines[j].typ !== InstrToken1Types.EDITIONS) {
                                    let tt = _lines[j].end_token;
                                    if (!tt.is_char_of(".")) {
                                        if (tt.newlines_after_count < 2) 
                                            end = false;
                                        else if (tt.is_char_of(":,;")) 
                                            end = false;
                                    }
                                    break;
                                }
                            }
                            if (end) {
                                this._analize_content_without_containers(part, tmp, false, false, is_kodex);
                                tmp.splice(0, tmp.length);
                                part = null;
                            }
                        }
                    }
                    if (part === null) {
                        part = FragToken._new1355(li.begin_token, li.end_token, InstrumentKind.CLAUSEPART, parts.length + 1);
                        parts.push(part);
                    }
                    if (li.end_char > part.end_char) 
                        part.end_token = li.end_token;
                    tmp.push(li);
                }
                if (part !== null && tmp.length > 0) 
                    this._analize_content_without_containers(part, tmp, false, false, is_kodex);
                let ok = true;
                if (root.kind !== InstrumentKind.CLAUSE) {
                    let num = 0;
                    let tot = 0;
                    for (const p of parts) {
                        for (const ch of p.children) {
                            if (ch.number > 0) 
                                num++;
                            tot++;
                        }
                    }
                    if ((Utils.intDiv(tot, 2)) > num) 
                        ok = false;
                }
                if (ok) {
                    for (const p of parts) {
                        NumberingHelper.correct_child_numbers(root, p.children);
                    }
                    if (parts.length > 1) {
                        root.children.splice(root.children.length, 0, ...parts);
                        return;
                    }
                    else if (parts.length === 1) {
                        root.children.splice(root.children.length, 0, ...parts[0].children);
                        return;
                    }
                }
            }
        }
        if (root.number === 11 && root.sub_number === 2) {
        }
        let notices = new Array();
        for (let ii = 0; ii < _lines.length; ii++) {
            if (_lines[ii].typ === InstrToken1Types.NOTICE) {
                let li = _lines[ii];
                if (((li.numbers.length === 1 && li.numbers[0] === "1")) || ((li.numbers.length === 0 && ii === (_lines.length - 1)))) {
                    for (let j = ii; j < _lines.length; j++) {
                        li = _lines[j];
                        let not = FragToken._new1348(li.begin_token, li.end_token, InstrumentKind.NOTICE, li);
                        notices.push(not);
                        if (li.num_begin_token !== null && li.begin_token !== li.num_begin_token) 
                            not.children.push(FragToken._new1357(li.begin_token, li.num_begin_token.previous, InstrumentKind.KEYWORD, true));
                        if (li.numbers.length > 0) 
                            NumberingHelper.create_number(not, li);
                        if (not.children.length > 0) 
                            not.children.push(FragToken._new1348((li.num_end_token != null ? li.num_end_token : li.begin_token), li.end_token, InstrumentKind.CONTENT, li));
                    }
                    _lines.splice(ii, _lines.length - ii);
                }
                break;
            }
        }
        let nums = NumberingHelper.extract_main_sequence(_lines, this.doc_typ !== DecreeKind.CONTRACT || this.top_doc.kind === InstrumentKind.APPENDIX, this.doc_typ !== DecreeKind.CONTRACT);
        if (_lines.length > 5) {
        }
        if (is_kodex && nums !== null) {
            let err_cou = 0;
            for (const nu of nums) {
                if (nu.num_suffix !== null && nu.num_suffix !== ")" && nu.num_suffix !== ".") 
                    err_cou++;
            }
            if (err_cou > 0) {
                if (err_cou > (Utils.intDiv(nums.length, 2))) 
                    nums = null;
            }
        }
        if (nums === null) {
            let last = (root.children.length > 0 ? root.children[root.children.length - 1] : null);
            for (const li of _lines) {
                if (li.typ === InstrToken1Types.COMMENT || li.typ === InstrToken1Types.EDITIONS) {
                    this._add_comment_or_edition(root, li);
                    last = null;
                    continue;
                }
                if (li.typ === InstrToken1Types.INDEX) {
                    let ind = FragToken._new1348(li.begin_token, li.end_token, InstrumentKind.INDEX, li);
                    root.children.push(ind);
                    last = null;
                    let tt = li.begin_token;
                    if (!li.index_no_keyword) {
                        for (; tt !== null && tt.end_char <= li.end_char; tt = tt.next) {
                            if (tt.is_newline_after) {
                                ind.children.push(FragToken._new1360(li.begin_token, tt, InstrumentKind.NAME, true));
                                tt = tt.next;
                                break;
                            }
                        }
                    }
                    let is_tab = false;
                    for (; tt !== null && tt.end_char <= li.end_char; tt = tt.next) {
                        let it1 = InstrToken1.parse(tt, true, null, 0, null, false, 0, false, true);
                        if (it1 === null) 
                            break;
                        if ((!is_tab && it1.end_char === li.end_char && tt.is_table_control_char) && it1.length_char > 100) {
                            let it2 = InstrToken1.parse(tt.next, true, null, 0, null, false, 0, false, true);
                            if (it2 === null) 
                                break;
                            it1 = it2;
                            tt = tt.next;
                        }
                        if (it1.value === "СТР") {
                            tt = it1.end_token;
                            continue;
                        }
                        if (tt.get_referent() instanceof DecreePartReferent) {
                            tt = tt.kit.debed_token(tt);
                            it1 = InstrToken1.parse(tt, true, null, 0, null, false, 0, false, false);
                        }
                        if (it1.typ === InstrToken1Types.APPENDIX && !it1.is_newline_after) {
                            for (let ttt = it1.end_token; ttt !== null; ttt = ttt.next) {
                                if (ttt.is_table_control_char || ttt.is_newline_before) 
                                    break;
                                it1.end_token = ttt;
                            }
                        }
                        let ind_item = FragToken._new1338(tt, it1.end_token, InstrumentKind.INDEXITEM);
                        ind.children.push(ind_item);
                        let nam = null;
                        if (it1.num_end_token !== null && it1.num_end_token !== it1.end_token) {
                            if (it1.begin_token !== it1.num_begin_token) 
                                ind_item.children.push(FragToken._new1357(it1.begin_token, it1.num_begin_token.previous, InstrumentKind.KEYWORD, true));
                            NumberingHelper.create_number(ind_item, it1);
                            ind_item.children.push((nam = FragToken._new1357(it1.num_end_token.next, it1.end_token, InstrumentKind.NAME, true)));
                            let it2 = InstrToken1.parse(it1.end_token.next, true, null, 0, null, false, 0, false, true);
                            if ((it2 !== null && (it1.end_token.next instanceof TextToken) && it2.numbers.length === 0) && it2.title_typ === InstrToken1StdTitleType.UNDEFINED && !it1.end_token.next.is_table_control_char) {
                                let it3 = InstrToken1.parse(it2.end_token.next, true, null, 0, null, false, 0, false, true);
                                if (it3 !== null && it3.numbers.length > 0) {
                                    nam.end_token = it2.end_token;
                                    nam.def_val2 = true;
                                    ind_item.end_token = it1.end_token = it2.end_token;
                                }
                            }
                        }
                        else 
                            ind_item.children.push((nam = FragToken._new1357(it1.begin_token, it1.end_token, InstrumentKind.NAME, true)));
                        ind_item.name = FragToken.get_restored_namemt(nam, true);
                        let val = Utils.asString(nam.value);
                        if (val !== null) {
                            while (val.length > 4) {
                                let ch = val[val.length - 1];
                                if ((ch === '.' || ch === '-' || Utils.isDigit(ch)) || Utils.isWhitespace(ch) || ch === (String.fromCharCode(7))) 
                                    val = val.substring(0, 0 + val.length - 1);
                                else 
                                    break;
                            }
                            nam.value = val;
                        }
                        tt = it1.end_token;
                    }
                    continue;
                }
                if (last !== null && last.kind === InstrumentKind.CONTENT) 
                    last.end_token = li.end_token;
                else 
                    root.children.push((last = FragToken._new1348(li.begin_token, li.end_token, InstrumentKind.CONTENT, li)));
            }
            if (!is_preamble) {
                if ((root.children.length === 1 && root.children[0].kind === InstrumentKind.CONTENT && root.kind === InstrumentKind.CONTENT) && ((root.children[0].itok === null || !root.children[0].itok.has_changes))) {
                    if (root.itok === null) 
                        root.itok = root.children[0].itok;
                    root.children.splice(0, root.children.length);
                }
                else if (root.children.length === 1 && root.children[0].kind === InstrumentKind.COMMENT && root.kind === InstrumentKind.CONTENT) {
                    root.children.splice(0, root.children.length);
                    root.kind = InstrumentKind.COMMENT;
                }
            }
            root.children.splice(root.children.length, 0, ...notices);
            return;
        }
        if (is_subitem) {
        }
        let n = 0;
        let fr = null;
        let blk = new Array();
        let i = 0;
        for (i = 0; i < _lines.length; i++) {
            if (_lines[i] === nums[0]) 
                break;
            else 
                blk.push(_lines[i]);
        }
        if (blk.length > 0) 
            this._analize_content_without_containers(root, blk, false, true, is_kodex);
        for (; i < _lines.length; i++) {
            let li = _lines[i];
            let j = 0;
            blk.splice(0, blk.length);
            n++;
            for (j = i + 1; j < _lines.length; j++) {
                if ((n < nums.length) && _lines[j] === nums[n]) 
                    break;
                else if (n >= nums.length && _lines[j].title_typ !== InstrToken1StdTitleType.UNDEFINED && _lines[j].all_upper) 
                    break;
                else 
                    blk.push(_lines[j]);
            }
            fr = FragToken._new1347(li.begin_token, li.end_token, li);
            root.children.push(fr);
            fr.kind = (is_subitem ? InstrumentKind.SUBITEM : InstrumentKind.ITEM);
            NumberingHelper.create_number(fr, li);
            if (li.num_end_token !== li.end_token && li.num_end_token !== null) 
                fr.children.push(FragToken._new1348(li.num_end_token.next, li.end_token, InstrumentKind.CONTENT, li));
            else if (li.title_typ !== InstrToken1StdTitleType.UNDEFINED && li.all_upper) {
                fr.kind = InstrumentKind.TAIL;
                fr.children.push(FragToken._new1360(li.begin_token, li.end_token, InstrumentKind.NAME, true));
            }
            if (blk.length > 0) {
                fr.end_token = blk[blk.length - 1].end_token;
                this._analize_content_without_containers(fr, blk, true, false, is_kodex);
            }
            i = j - 1;
        }
        NumberingHelper.correct_child_numbers(root, root.children);
        root.children.splice(root.children.length, 0, ...notices);
    }
    
    static _extract_directive_sequence(_lines) {
        let res = new Array();
        for (let i = 0; i < _lines.length; i++) {
            if (_lines[i].typ === InstrToken1Types.DIRECTIVE) {
                let j = 0;
                for (j = i - 1; j >= 0; j--) {
                    let li = _lines[j];
                    if (li.typ === InstrToken1Types.FIRSTLINE) {
                        j--;
                        break;
                    }
                    if (li.begin_token.is_value("РУКОВОДСТВУЯСЬ", null) || li.begin_token.is_value("ИССЛЕДОВАВ", null)) {
                        j--;
                        break;
                    }
                    if (li.begin_token.is_value("НА", null) && li.begin_token.next !== null && li.begin_token.next.is_value("ОСНОВАНИЕ", null)) {
                        j--;
                        break;
                    }
                    if (li.numbers.length > 0) 
                        break;
                    if (li.typ === InstrToken1Types.COMMENT) 
                        continue;
                    if (li.typ === InstrToken1Types.LINE) 
                        continue;
                    break;
                }
                res.push(_lines[j + 1]);
            }
        }
        if (res.length === 0) 
            return null;
        if (res[0] !== _lines[0]) 
            res.splice(0, 0, _lines[0]);
        return res;
    }
    
    /**
     * Анализ текстов, содержащих директивы
     * @param _lines 
     * @param proc 
     */
    _analize_content_with_directives(root, _lines, is_jus) {
        let dir_seq = ContentAnalyzeWhapper._extract_directive_sequence(_lines);
        if (dir_seq === null) {
            this._analize_content_without_containers(root, _lines, false, false, false);
            return;
        }
        if (dir_seq.length > 1) {
        }
        let parts = new Array();
        let n = 0;
        let j = 0;
        for (let i = 0; i < _lines.length; i++) {
            if (_lines[i] === dir_seq[n]) {
                let blk = new Array();
                for (j = i; j < _lines.length; j++) {
                    if (((n + 1) < dir_seq.length) && dir_seq[n + 1] === _lines[j]) 
                        break;
                    else 
                        blk.push(_lines[j]);
                }
                let fr = this._create_directive_part(blk);
                if (fr !== null) 
                    parts.push(fr);
                i = j - 1;
                n++;
            }
        }
        if (parts.length === 0) 
            return;
        if (parts.length === 1 && parts[0].children.length > 0) {
            root.children.splice(root.children.length, 0, ...parts[0].children);
            return;
        }
        if (parts.length > 2 || ((parts.length > 1 && is_jus))) {
            if (parts[0].name === null && parts[parts.length - 1].name !== null) {
                if (parts[1].name === "МОТИВИРОВОЧНАЯ" && !parts[0].is_newline_after) {
                    parts[0].children.splice(parts[0].children.length, 0, ...parts[1].children);
                    parts[0].name = parts[1].name;
                    parts.splice(1, 1);
                    if (parts[0].children.length > 1 && parts[0].children[0].kind === InstrumentKind.CONTENT && parts[0].children[1].kind === InstrumentKind.PREAMBLE) {
                        parts[0].children[1].begin_token = parts[0].children[0].begin_token;
                        parts[0].children.splice(0, 1);
                    }
                }
                else {
                    parts[0].name = "ВВОДНАЯ";
                    parts[0].kind = InstrumentKind.DOCPART;
                    if (parts[0].children.length === 0) 
                        parts[0].children.push(FragToken._new1348(parts[0].begin_token, parts[0].end_token, InstrumentKind.CONTENT, parts[0].itok));
                }
            }
            for (let i = 0; i < (parts.length - 1); i++) {
                if (parts[i].name === "МОТИВИРОВОЧНАЯ" && parts[i + 1].name === null) {
                    parts[i].children.splice(parts[i].children.length, 0, ...parts[i + 1].children);
                    parts.splice(i + 1, 1);
                    i--;
                }
            }
            let has_null = false;
            for (const p of parts) {
                if (p.name === null) 
                    has_null = true;
            }
            if (!has_null) {
                root.children.splice(root.children.length, 0, ...parts);
                return;
            }
        }
        for (const p of parts) {
            if (p.children.length > 0) 
                root.children.splice(root.children.length, 0, ...p.children);
            else 
                root.children.push(p);
        }
    }
    
    _create_directive_part(_lines) {
        let res = FragToken._new1338(_lines[0].begin_token, _lines[_lines.length - 1].end_token, InstrumentKind.DOCPART);
        let head = new Array();
        let i = 0;
        for (i = 0; i < _lines.length; i++) {
            if (_lines[i].typ === InstrToken1Types.DIRECTIVE) 
                break;
            else 
                head.push(_lines[i]);
        }
        if (i >= _lines.length) {
            this._analize_content_without_containers(res, _lines, false, false, false);
            return res;
        }
        if (head.length > 0) {
            let fr_head = FragToken._new1338(head[0].begin_token, head[head.length - 1].end_token, InstrumentKind.CONTENT);
            this._analize_content_without_containers(fr_head, head, false, false, false);
            res.children.push(fr_head);
        }
        if (res.children.length === 1 && res.children[0].kind === InstrumentKind.CONTENT) 
            res.children[0].kind = InstrumentKind.PREAMBLE;
        res.children.push(FragToken._new1372(_lines[i].begin_token, _lines[i].end_token, InstrumentKind.DIRECTIVE, _lines[i].value, _lines[i]));
        let vvv = _lines[i].value;
        if (vvv === "УСТАНОВЛЕНИЕ" || vvv === "ВСТАНОВЛЕННЯ") 
            res.name = "МОТИВИРОВОЧНАЯ";
        else if (((((vvv === "ПОСТАНОВЛЕНИЕ" || vvv === "ОПРЕДЕЛЕНИЕ" || vvv === "ПРИГОВОР") || vvv === "ПРИКАЗ" || vvv === "РЕШЕНИЕ") || vvv === "ПОСТАНОВА" || vvv === "ВИЗНАЧЕННЯ") || vvv === "ВИРОК" || vvv === "НАКАЗ") || vvv === "РІШЕННЯ") 
            res.name = "РЕЗОЛЮТИВНАЯ";
        _lines.splice(0, i + 1);
        if (_lines.length > 0) 
            this._analize_content_without_containers(res, _lines, false, false, false);
        return res;
    }
    
    _analize_sections(root) {
        for (let k = 0; k < 2; k++) {
            let secs = new Array();
            let items = new Array();
            for (const ch of root.children) {
                if (ch.kind === InstrumentKind.CHAPTER || ch.kind === InstrumentKind.CLAUSE) {
                    if (ch.number === 0 || (ch.children.length < 2)) 
                        return;
                    let new_childs = new Array();
                    let i = 0;
                    for (; i < ch.children.length; i++) {
                        if (ch.children[i].kind !== InstrumentKind.NUMBER && ch.children[i].kind !== InstrumentKind.NAME && ch.children[i].kind !== InstrumentKind.KEYWORD) 
                            break;
                        else 
                            new_childs.push(ch.children[i]);
                    }
                    if (i >= ch.children.length) 
                        return;
                    let sect = null;
                    if (ch.children[i].kind !== InstrumentKind.CONTENT) {
                        if (ch.children[i].kind !== InstrumentKind.ITEM) 
                            return;
                    }
                    else {
                        sect = FragToken._new1357(ch.children[i].begin_token, ch.children[i].end_token, InstrumentKind.SECTION, true);
                        sect.name = Utils.asString(sect.value);
                        sect.value = null;
                        sect.children.push(FragToken._new1338(sect.begin_token, sect.end_token, InstrumentKind.NAME));
                        new_childs.push(sect);
                        if ((ch.children[i].whitespaces_before_count < 15) || (ch.children[i].whitespaces_after_count < 15)) 
                            return;
                        i++;
                        if (((i + 1) < ch.children.length) && ch.children[i].kind === InstrumentKind.COMMENT) 
                            i++;
                    }
                    let j = 0;
                    let its = 0;
                    for (j = i; j < ch.children.length; j++) {
                        if (ch.children[j].kind !== InstrumentKind.ITEM) 
                            return;
                        its++;
                        if (sect !== null) {
                            sect.children.push(ch.children[j]);
                            sect.end_token = ch.children[j].end_token;
                        }
                        else 
                            new_childs.push(ch.children[j]);
                        if ((ch.children[j].whitespaces_after_count < 15) || j === (ch.children.length - 1)) 
                            continue;
                        let la = ContentAnalyzeWhapper._get_last_child(ch.children[j]);
                        if (la.whitespaces_after_count < 15) 
                            continue;
                        let next_sect = null;
                        for (let tt = la.end_token; tt !== null && tt.begin_char > la.begin_char; tt = tt.previous) {
                            if (tt.is_newline_before) {
                                if (tt.chars.is_cyrillic_letter && tt.chars.is_all_lower) 
                                    continue;
                                let it = InstrToken1.parse(tt, true, null, 0, null, false, 0, false, false);
                                if (it !== null && it.numbers.length > 0) 
                                    break;
                                if (tt.whitespaces_before_count < 15) 
                                    continue;
                                if ((tt.previous.end_char - la.begin_char) < 20) 
                                    break;
                                next_sect = FragToken._new1357(tt, la.end_token, InstrumentKind.SECTION, true);
                                next_sect.name = Utils.asString(next_sect.value);
                                next_sect.value = null;
                                next_sect.children.push(FragToken._new1338(tt, la.end_token, InstrumentKind.NAME));
                                break;
                            }
                        }
                        if (next_sect === null) 
                            continue;
                        if (sect === null) 
                            return;
                        if (k > 0) {
                            sect.end_token = la.end_token = next_sect.begin_token.previous;
                            if (ch.children[j].end_char > la.end_char) 
                                ch.children[j].end_token = la.end_token;
                        }
                        new_childs.push(next_sect);
                        sect = next_sect;
                    }
                    if (k > 0) 
                        ch.children = new_childs;
                    else {
                        items.push(its);
                        secs.push(new_childs.length);
                    }
                }
            }
            if (k > 0) 
                break;
            if (secs.length < 3) 
                break;
            let allsecs = 0;
            let allits = 0;
            let okchapts = 0;
            for (let i = 0; i < items.length; i++) {
                allits += items[i];
                allsecs += secs[i];
                if (secs[i] > 1) 
                    okchapts++;
            }
            let rr = (allits) / (allsecs);
            if (rr < 1.5) 
                break;
            if (okchapts < (Utils.intDiv(items.length, 2))) 
                break;
        }
    }
    
    static _get_last_child(fr) {
        if (fr.children.length === 0) 
            return fr;
        return ContentAnalyzeWhapper._get_last_child(fr.children[fr.children.length - 1]);
    }
    
    _correct_names(root, parent) {
        let i = 0;
        let fr_nams = null;
        for (i = 0; i < root.children.length; i++) {
            let ch = root.children[i];
            if (ch.kind !== InstrumentKind.CLAUSE && ch.kind !== InstrumentKind.CHAPTER) 
                continue;
            if (ch.name !== null) {
                fr_nams = null;
                break;
            }
            let j = 0;
            let nam_has = false;
            for (j = 0; j < ch.children.length; j++) {
                let chh = ch.children[j];
                if (chh.kind === InstrumentKind.KEYWORD || chh.kind === InstrumentKind.NUMBER || chh.kind === InstrumentKind.EDITIONS) 
                    continue;
                if (chh.kind === InstrumentKind.CONTENT || chh.kind === InstrumentKind.INDENTION || ((chh.kind === InstrumentKind.CLAUSEPART && chh.children.length === 1))) {
                    if (chh.itok === null) 
                        chh.itok = InstrToken1.parse(chh.begin_token, true, null, 0, null, false, 0, false, false);
                    if (chh.itok !== null && !chh.itok.has_verb) 
                        nam_has = true;
                }
                break;
            }
            if (!nam_has) {
                fr_nams = null;
                break;
            }
            if (fr_nams === null) {
                fr_nams = new Array();
                fr_nams.push(ch);
            }
            else {
                if (fr_nams[fr_nams.length - 1].kind !== ch.kind) {
                    fr_nams = null;
                    break;
                }
                fr_nams.push(ch);
            }
        }
        if (fr_nams !== null) {
            for (const ch of fr_nams) {
                let j = 0;
                for (j = 0; j < ch.children.length; j++) {
                    let chh = ch.children[j];
                    if (chh.kind === InstrumentKind.KEYWORD || chh.kind === InstrumentKind.NUMBER || chh.kind === InstrumentKind.EDITIONS) 
                        continue;
                    if (chh.kind === InstrumentKind.CONTENT || chh.kind === InstrumentKind.INDENTION || ((chh.kind === InstrumentKind.CLAUSEPART && chh.children.length === 1))) 
                        break;
                }
                if (j >= ch.children.length) 
                    continue;
                let nam = ch.children[j];
                if (nam.kind === InstrumentKind.INDENTION || ((nam.kind === InstrumentKind.CLAUSEPART && nam.children.length === 1))) {
                    nam.number = 0;
                    let cou = 0;
                    for (let jj = j + 1; jj < ch.children.length; jj++) {
                        if (ch.children[jj].kind === nam.kind) {
                            ch.children[jj].number--;
                            cou++;
                        }
                        else 
                            break;
                    }
                    if (cou === 1) {
                        for (let jj = j + 1; jj < ch.children.length; jj++) {
                            if (ch.children[jj].kind === nam.kind) {
                                let empty = true;
                                for (let k = jj + 1; k < ch.children.length; k++) {
                                    if (ch.children[k].kind !== InstrumentKind.EDITIONS && ch.children[k].kind !== InstrumentKind.COMMENT) {
                                        empty = false;
                                        break;
                                    }
                                }
                                if (empty) {
                                    if (ch.children[jj].kind === InstrumentKind.INDENTION || ch.children.length === 0) {
                                        ch.children[jj].kind = InstrumentKind.CONTENT;
                                        ch.children[jj].number = 0;
                                    }
                                    else {
                                        let ch0 = ch.children[jj];
                                        ch.children.splice(jj, 1);
                                        ch.children.splice(jj, 0, ...ch0.children);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                nam.number = 0;
                nam.kind = InstrumentKind.NAME;
                nam.def_val2 = true;
                nam.children.splice(0, nam.children.length);
                ch.name = Utils.asString(nam.value);
            }
        }
        let tt = root.begin_token;
        if (root.itok !== null && root.itok.num_end_token !== null) 
            tt = root.itok.num_end_token.next;
        if (tt !== null) {
            if (parent !== null && parent.is_expired) {
            }
            else {
                if (!tt.is_value("УТРАТИТЬ", "ВТРАТИТИ")) {
                    let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null) 
                        tt = npt.end_token.next;
                }
                if ((tt !== null && tt.is_value("УТРАТИТЬ", "ВТРАТИТИ") && tt.next !== null) && tt.next.is_value("СИЛА", "ЧИННІСТЬ")) 
                    root.is_expired = true;
            }
        }
        for (const ch of root.children) {
            this._correct_names(ch, root);
        }
    }
    
    _correct_kodex_parts(root) {
        if (root.number === 2 && root.kind === InstrumentKind.CLAUSE) {
        }
        if (root.number === 11 && root.kind === InstrumentKind.ITEM) {
        }
        let i = 0;
        for (i = 0; i < root.children.length; i++) {
            let ki = root.children[i].kind;
            if ((ki !== InstrumentKind.KEYWORD && ki !== InstrumentKind.NAME && ki !== InstrumentKind.NUMBER) && ki !== InstrumentKind.COMMENT && ki !== InstrumentKind.EDITIONS) 
                break;
        }
        if (i >= root.children.length) 
            return;
        let i0 = i;
        if (root.kind === InstrumentKind.CLAUSE && this.doc_typ !== DecreeKind.CONTRACT) {
            for (; i < root.children.length; i++) {
                let ch = root.children[i];
                if (ch.kind === InstrumentKind.ITEM || ch.kind === InstrumentKind.SUBITEM || ((ch.kind === InstrumentKind.CLAUSEPART && ch.number > 0))) {
                    ch.kind = InstrumentKind.CLAUSEPART;
                    for (const chh of ch.children) {
                        if (chh.kind === InstrumentKind.SUBITEM && chh.number > 0) {
                            chh.kind = InstrumentKind.ITEM;
                            for (const chhh of chh.children) {
                                if (chhh.number > 0) 
                                    chhh.kind = InstrumentKind.SUBITEM;
                            }
                        }
                    }
                }
                else if (ch.kind === InstrumentKind.CONTENT) 
                    break;
            }
        }
        if (i === i0 && root.children[i0].kind === InstrumentKind.CONTENT) {
            for (i = i0 + 1; i < root.children.length; i++) {
                if (root.children[i].kind !== InstrumentKind.EDITIONS && root.children[i].kind !== InstrumentKind.COMMENT) 
                    break;
            }
            if ((i < root.children.length) && ((((this.doc_typ === DecreeKind.KODEX || root.kind === InstrumentKind.CLAUSE || root.kind === InstrumentKind.ITEM) || root.kind === InstrumentKind.SUBITEM || root.kind === InstrumentKind.CHAPTER) || root.kind === InstrumentKind.CLAUSEPART))) {
                if (root.children[i].kind === InstrumentKind.LISTITEM || root.children[i].kind === InstrumentKind.ITEM || root.children[i].kind === InstrumentKind.SUBITEM) {
                    let num = 1;
                    root.children[i0].kind = InstrumentKind.INDENTION;
                    root.children[i0].number = num;
                    if (root.children[i].kind === InstrumentKind.LISTITEM) {
                        for (; i < root.children.length; i++) {
                            if (root.children[i].kind === InstrumentKind.LISTITEM) {
                                root.children[i].kind = InstrumentKind.INDENTION;
                                root.children[i].number = ++num;
                            }
                            else if (root.children[i].kind !== InstrumentKind.COMMENT && root.children[i].kind !== InstrumentKind.EDITIONS) 
                                break;
                        }
                    }
                }
            }
        }
        let inds = 0;
        for (i = i0; i < root.children.length; i++) {
            if (root.children[i].kind === InstrumentKind.COMMENT) 
                continue;
            let lii = ContentAnalyzeWhapper._split_content_by_indents(root.children[i], inds + 1);
            if (lii === null) 
                break;
            inds += lii.length;
        }
        if (inds > 1 && ((i >= root.children.length || root.children[i].kind !== InstrumentKind.DIRECTIVE))) {
            if (root.number === 7 && root.kind === InstrumentKind.CLAUSEPART) {
            }
            let num = 1;
            for (i = i0; i < root.children.length; i++) {
                if (root.children[i].kind === InstrumentKind.COMMENT) 
                    continue;
                let lii = ContentAnalyzeWhapper._split_content_by_indents(root.children[i], num);
                if (lii === null) 
                    break;
                if (lii.length === 0) 
                    continue;
                num += lii.length;
                root.children.splice(i, 1);
                root.children.splice(i, 0, ...lii);
                i += (lii.length - 1);
            }
            num = 1;
            for (i = i0 + 1; i < root.children.length; i++) {
                let ch = root.children[i];
                if (ch.kind === InstrumentKind.COMMENT || ch.kind === InstrumentKind.EDITIONS) 
                    continue;
                if (ch.itok === null || ch.itok.numbers.length !== 1) 
                    break;
                if (ch.itok.first_number !== num) 
                    break;
                num++;
            }
            if (num > 1 && i >= root.children.length) {
                for (i = i0 + 1; i < root.children.length; i++) {
                    let ch = root.children[i];
                    if (ch.kind === InstrumentKind.COMMENT || ch.kind === InstrumentKind.EDITIONS) 
                        continue;
                    if (root.kind === InstrumentKind.CLAUSEPART || root.kind === InstrumentKind.CLAUSE) 
                        ch.kind = InstrumentKind.ITEM;
                    else if (root.kind === InstrumentKind.ITEM) 
                        ch.kind = InstrumentKind.SUBITEM;
                    else 
                        break;
                    NumberingHelper.create_number(ch, ch.itok);
                    if (ch.children.length === 1 && (ch.children[0].end_char < ch.end_char)) 
                        ch.fill_by_content_children();
                }
            }
        }
        for (const ch of root.children) {
            this._correct_kodex_parts(ch);
        }
    }
    
    static _split_content_by_indents(fr, num) {
        if (fr.kind !== InstrumentKind.CONTENT && fr.kind !== InstrumentKind.LISTITEM && fr.kind !== InstrumentKind.PREAMBLE) {
            if (fr.kind !== InstrumentKind.EDITIONS) 
                return null;
            if (fr.begin_token.is_value("АБЗАЦ", null)) {
                let t = fr.begin_token.next;
                if (!((t instanceof NumberToken)) || (t).value !== num.toString()) 
                    return null;
                let next = num;
                t = t.next;
                if ((t !== null && t.is_hiphen && (t.next instanceof NumberToken)) && (t.next).int_value !== null) {
                    next = (t.next).int_value;
                    t = t.next.next;
                    if (next <= num) 
                        return null;
                }
                if ((t === null || !t.is_value("УТРАТИТЬ", "ВТРАТИТИ") || t.next === null) || !t.next.is_value("СИЛА", "ЧИННІСТЬ")) 
                    return null;
                let res0 = new Array();
                for (let i = num; i <= next; i++) {
                    res0.push(FragToken._new1377(fr.begin_token, fr.end_token, InstrumentKind.INDENTION, i, true, fr.referents));
                }
                return res0;
            }
            return new Array();
        }
        if (fr.children.length > 0) 
            return null;
        if (fr.itok === null) 
            fr.itok = InstrToken1.parse(fr.begin_token, true, null, 0, null, false, 0, false, false);
        let res = new Array();
        let t0 = fr.begin_token;
        for (let tt = t0; tt !== null && tt.end_char <= fr.end_char; tt = tt.next) {
            if (tt.end_char === fr.end_char) {
            }
            else if (!tt.is_newline_after) 
                continue;
            else if (tt.is_table_control_char) 
                continue;
            else if (!MiscHelper.can_be_start_of_sentence(tt.next) && !tt.is_char_of(":")) 
                continue;
            let re = FragToken._new1355(t0, tt, InstrumentKind.INDENTION, num);
            num++;
            if (t0 === fr.begin_token && tt === fr.end_token) 
                re.itok = fr.itok;
            if (re.itok === null) 
                re.itok = InstrToken1.parse(t0, true, null, 0, null, false, 0, false, false);
            if (res.length > 100) 
                return null;
            res.push(re);
            t0 = tt.next;
        }
        return res;
    }
    
    _analize_preamble(root) {
        let i = 0;
        let cnt_cou = 0;
        let ch = null;
        let ok = false;
        if ((root.children.length > 1 && root.children[0].kind === InstrumentKind.CONTENT && root.children[1].number > 0) && root.children[0].children.length > 0) {
            for (i = 0; i < root.children[0].children.length; i++) {
                let ch2 = root.children[0].children[i];
                if ((ch2.kind !== InstrumentKind.CONTENT && ch2.kind !== InstrumentKind.INDENTION && ch2.kind !== InstrumentKind.COMMENT) && ch2.kind !== InstrumentKind.EDITIONS) 
                    break;
            }
            if (i >= root.children[0].children.length) {
                let chh = root.children[0];
                root.children.splice(0, 1);
                root.children.splice(0, 0, ...chh.children);
            }
        }
        for (i = 0; i < root.children.length; i++) {
            ch = root.children[i];
            if (ch.kind === InstrumentKind.EDITIONS || ch.kind === InstrumentKind.COMMENT || ch.kind === InstrumentKind.INDEX) 
                continue;
            if (ch.kind === InstrumentKind.DIRECTIVE) {
                ok = true;
                break;
            }
            if (ch.itok !== null && ch.itok.has_changes) 
                break;
            if (ch.kind === InstrumentKind.CONTENT && ch.children.length === 1 && ch.children[0].kind === InstrumentKind.INDEX) {
                ch.kind = InstrumentKind.INDEX;
                ch.children = ch.children[0].children;
                continue;
            }
            if (ch.kind === InstrumentKind.CONTENT || ch.kind === InstrumentKind.INDENTION) {
                for (let t = ch.begin_token.next; t !== null && (t.end_char < ch.end_char); t = t.next) {
                    if (t.is_newline_before) {
                        if (t.previous.is_char_of(".:;") && t.previous.previous !== null && ((t.previous.previous.is_value("НИЖЕСЛЕДУЮЩИЙ", null) || t.previous.previous.is_value("ДОГОВОР", null)))) {
                            let itt1 = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
                            if (itt1 !== null && !itt1.has_verb && (itt1.end_char < ch.end_char)) {
                                let clau = FragToken._new1338(t, ch.end_token, InstrumentKind.CHAPTER);
                                if (((i + 1) < root.children.length) && root.children[i + 1].kind === InstrumentKind.CLAUSE) 
                                    clau.kind = InstrumentKind.CLAUSE;
                                let nam = FragToken._new1340(t, itt1.end_token, InstrumentKind.NAME, true, itt1);
                                clau.children.push(nam);
                                clau.name = FragToken.get_restored_namemt(nam, false);
                                clau.children.push(FragToken._new1338(itt1.end_token.next, ch.end_token, InstrumentKind.CONTENT));
                                ch.end_token = t.previous;
                                root.children.splice(i + 1, 0, clau);
                            }
                            break;
                        }
                    }
                }
                let pream = false;
                if (ch.begin_token.is_value("ПРЕАМБУЛА", null)) 
                    pream = true;
                else if (ch.length_char > 1500) 
                    break;
                cnt_cou++;
                if (ch.end_token.is_char(':') || pream || ch.end_token.previous.is_value("НИЖЕСЛЕДУЮЩИЙ", null)) {
                    ok = true;
                    i++;
                    break;
                }
                continue;
            }
            break;
        }
        if (cnt_cou === 0 || cnt_cou > 3 || i >= root.children.length) 
            return;
        if (ch.number > 0) 
            ok = true;
        if (!ok) 
            return;
        if (cnt_cou === 1) {
            for (let j = 0; j < i; j++) {
                if (root.children[j].kind === InstrumentKind.CONTENT || root.children[j].kind === InstrumentKind.INDENTION) {
                    root.children[j].kind = InstrumentKind.PREAMBLE;
                    if (root.children[j].children.length === 1 && root.children[j].children[0].kind === InstrumentKind.INDEX) {
                        root.children[j].kind = InstrumentKind.INDEX;
                        root.children[j].children = root.children[j].children[0].children;
                    }
                }
            }
        }
        else {
            let prm = FragToken._new1338(root.children[0].begin_token, root.children[i - 1].end_token, InstrumentKind.PREAMBLE);
            for (let j = 0; j < i; j++) {
                prm.children.push(root.children[j]);
            }
            root.children.splice(0, i);
            root.children.splice(0, 0, prm);
        }
    }
}


module.exports = ContentAnalyzeWhapper