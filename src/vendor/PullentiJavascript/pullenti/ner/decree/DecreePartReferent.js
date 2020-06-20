/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const MetaDecreePart = require("./internal/MetaDecreePart");
const MiscHelper = require("./../core/MiscHelper");
const ReferentClass = require("./../ReferentClass");
const DecreeReferent = require("./DecreeReferent");

/**
 * Сущность, представляющая ссылку на структурную часть НПА
 */
class DecreePartReferent extends Referent {
    
    constructor() {
        super(DecreePartReferent.OBJ_TYPENAME);
        this.instance_of = MetaDecreePart.GLOBAL_META;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        if (this.sub_indention !== null) 
            res.append(" подабз.").append(this.sub_indention);
        if (this.indention !== null) 
            res.append(" абз.").append(this.indention);
        if (this.notice !== null) 
            res.append(" прим.").append(this.notice);
        if (this.sub_item !== null) 
            res.append(" пп.").append(this.sub_item);
        if (this.item !== null) 
            res.append(" п.").append(this.item);
        if (this.part !== null) 
            res.append(" ч.").append(this.part);
        if (this.preamble !== null) 
            res.append(" преамб.").append((this.preamble === "0" ? "" : this.preamble));
        if (this.page !== null) 
            res.append(" стр.").append(this.page);
        if (this.clause !== null) 
            res.append(" ст.").append(this.clause);
        if (this.sub_paragraph !== null) 
            res.append(" подпар.").append(this.sub_paragraph);
        if (this.paragraph !== null) 
            res.append(" пар.").append(this.paragraph);
        if (this.chapter !== null) 
            res.append(" гл.").append(this.chapter);
        if (this.sub_section !== null) 
            res.append(" подразд.").append(this.sub_section);
        if (this.section !== null) 
            res.append(" разд.").append(this.section);
        if (this.doc_part !== null) 
            res.append(" док.часть ").append(this.doc_part);
        let app = this.appendix;
        if (app === "0") 
            res.append(" приложение");
        else if (app !== null) 
            res.append(" приложение ").append(app);
        if (this.subprogram !== null) 
            res.append(" подпрограмма \"").append((Utils.notNull(this.name, "?"))).append("\"");
        if (this.addagree !== null) {
            if (this.addagree === "0") 
                res.append(" допсоглашение");
            else 
                res.append(" допсоглашение ").append(this.addagree);
        }
        if (((this.owner !== null || res.length > 0)) && !short_variant) {
            if (!short_variant && this.subprogram === null) {
                let s = this._get_short_name();
                if (s !== null) 
                    res.append(" (").append(s).append(")");
            }
            if (this.owner !== null && (lev < 20)) {
                if (res.length > 0) 
                    res.append("; ");
                res.append(this.owner.to_string(short_variant, lang, lev + 1));
            }
            else if (this.local_typ !== null) 
                res.append("; ").append(MiscHelper.convert_first_char_upper_and_other_lower(this.local_typ));
        }
        return res.toString().trim();
    }
    
    /**
     * [Get] Наименование (если несколько, то самое короткое)
     */
    get name() {
        let nam = null;
        for (const s of this.slots) {
            if (s.type_name === DecreePartReferent.ATTR_NAME) {
                let n = s.value.toString();
                if (nam === null || nam.length > n.length) 
                    nam = n;
            }
        }
        return nam;
    }
    
    _get_short_name() {
        let nam = this.name;
        if (nam === null) 
            return null;
        if (nam.length > 100) {
            let i = 100;
            for (; i < nam.length; i++) {
                if (!Utils.isLetter(nam[i])) 
                    break;
            }
            if (i < nam.length) 
                nam = nam.substring(0, 0 + i) + "...";
        }
        return MiscHelper.convert_first_char_upper_and_other_lower(nam);
    }
    
    /**
     * [Get] Локальный тип (при ссылке на текущий документ)
     */
    get local_typ() {
        return this.get_string_value(DecreePartReferent.ATTR_LOCALTYP);
    }
    /**
     * [Set] Локальный тип (при ссылке на текущий документ)
     */
    set local_typ(value) {
        this.add_slot(DecreePartReferent.ATTR_LOCALTYP, value, true, 0);
        return value;
    }
    
    add_slot(attr_name, attr_value, clear_old_value, stat_count = 0) {
        const PartToken = require("./internal/PartToken");
        let __tag = null;
        if (attr_value instanceof PartToken.PartValue) {
            __tag = (attr_value).source_value;
            attr_value = (attr_value).value;
        }
        let s = super.add_slot(attr_name, attr_value, clear_old_value, stat_count);
        if (__tag !== null) 
            s.tag = __tag;
        return s;
    }
    
    get clause() {
        return this.get_string_value(DecreePartReferent.ATTR_CLAUSE);
    }
    set clause(value) {
        this.add_slot(DecreePartReferent.ATTR_CLAUSE, value, true, 0);
        return value;
    }
    
    get part() {
        return this.get_string_value(DecreePartReferent.ATTR_PART);
    }
    set part(value) {
        this.add_slot(DecreePartReferent.ATTR_PART, value, true, 0);
        return value;
    }
    
    get doc_part() {
        return this.get_string_value(DecreePartReferent.ATTR_DOCPART);
    }
    set doc_part(value) {
        this.add_slot(DecreePartReferent.ATTR_DOCPART, value, true, 0);
        return value;
    }
    
    get section() {
        return this.get_string_value(DecreePartReferent.ATTR_SECTION);
    }
    set section(value) {
        this.add_slot(DecreePartReferent.ATTR_SECTION, value, true, 0);
        return value;
    }
    
    get sub_section() {
        return this.get_string_value(DecreePartReferent.ATTR_SUBSECTION);
    }
    set sub_section(value) {
        this.add_slot(DecreePartReferent.ATTR_SUBSECTION, value, true, 0);
        return value;
    }
    
    get appendix() {
        return this.get_string_value(DecreePartReferent.ATTR_APPENDIX);
    }
    set appendix(value) {
        if (value !== null && value.length === 0) 
            value = "0";
        this.add_slot(DecreePartReferent.ATTR_APPENDIX, value, true, 0);
        return value;
    }
    
    get chapter() {
        return this.get_string_value(DecreePartReferent.ATTR_CHAPTER);
    }
    set chapter(value) {
        this.add_slot(DecreePartReferent.ATTR_CHAPTER, value, true, 0);
        return value;
    }
    
    get paragraph() {
        return this.get_string_value(DecreePartReferent.ATTR_PARAGRAPH);
    }
    set paragraph(value) {
        this.add_slot(DecreePartReferent.ATTR_PARAGRAPH, value, true, 0);
        return value;
    }
    
    get sub_paragraph() {
        return this.get_string_value(DecreePartReferent.ATTR_SUBPARAGRAPH);
    }
    set sub_paragraph(value) {
        this.add_slot(DecreePartReferent.ATTR_SUBPARAGRAPH, value, true, 0);
        return value;
    }
    
    get item() {
        return this.get_string_value(DecreePartReferent.ATTR_ITEM);
    }
    set item(value) {
        this.add_slot(DecreePartReferent.ATTR_ITEM, value, true, 0);
        return value;
    }
    
    get sub_item() {
        return this.get_string_value(DecreePartReferent.ATTR_SUBITEM);
    }
    set sub_item(value) {
        this.add_slot(DecreePartReferent.ATTR_SUBITEM, value, true, 0);
        return value;
    }
    
    get indention() {
        return this.get_string_value(DecreePartReferent.ATTR_INDENTION);
    }
    set indention(value) {
        this.add_slot(DecreePartReferent.ATTR_INDENTION, value, true, 0);
        return value;
    }
    
    get sub_indention() {
        return this.get_string_value(DecreePartReferent.ATTR_SUBINDENTION);
    }
    set sub_indention(value) {
        this.add_slot(DecreePartReferent.ATTR_SUBINDENTION, value, true, 0);
        return value;
    }
    
    get preamble() {
        return this.get_string_value(DecreePartReferent.ATTR_PREAMBLE);
    }
    set preamble(value) {
        this.add_slot(DecreePartReferent.ATTR_PREAMBLE, value, true, 0);
        return value;
    }
    
    get notice() {
        return this.get_string_value(DecreePartReferent.ATTR_NOTICE);
    }
    set notice(value) {
        if (value !== null && value.length === 0) 
            value = "0";
        this.add_slot(DecreePartReferent.ATTR_NOTICE, value, true, 0);
        return value;
    }
    
    get page() {
        return this.get_string_value(DecreePartReferent.ATTR_PAGE);
    }
    set page(value) {
        this.add_slot(DecreePartReferent.ATTR_PAGE, value, true, 0);
        return value;
    }
    
    get subprogram() {
        return this.get_string_value(DecreePartReferent.ATTR_SUBPROGRAM);
    }
    set subprogram(value) {
        this.add_slot(DecreePartReferent.ATTR_SUBPROGRAM, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Дополнительное соглашение
     */
    get addagree() {
        return this.get_string_value(DecreePartReferent.ATTR_ADDAGREE);
    }
    /**
     * [Set] Дополнительное соглашение
     */
    set addagree(value) {
        this.add_slot(DecreePartReferent.ATTR_ADDAGREE, value, true, 0);
        return value;
    }
    
    get owner() {
        let res = Utils.as(this.get_slot_value(DecreePartReferent.ATTR_OWNER), DecreeReferent);
        if (res === null) 
            return null;
        return res;
    }
    set owner(value) {
        this.add_slot(DecreePartReferent.ATTR_OWNER, value, true, 0);
        if (value !== null && this.local_typ !== null) 
            this.local_typ = null;
        return value;
    }
    
    get parent_referent() {
        return this.owner;
    }
    
    add_name(_name) {
        if (_name === null || _name.length === 0) 
            return;
        if (_name[_name.length - 1] === '.') 
            _name = _name.substring(0, 0 + _name.length - 1);
        _name = _name.trim().toUpperCase();
        this.add_slot(DecreePartReferent.ATTR_NAME, _name, false, 0);
    }
    
    merge_slots(obj, merge_statistic = true) {
        super.merge_slots(obj, merge_statistic);
        if (this.owner !== null && this.local_typ !== null) 
            this.local_typ = null;
    }
    
    _get_level(typ) {
        if (typ === DecreePartReferent.ATTR_ADDAGREE || typ === DecreePartReferent.ATTR_SUBPROGRAM) 
            return 0;
        if (typ === DecreePartReferent.ATTR_DOCPART) 
            return 1;
        if (typ === DecreePartReferent.ATTR_APPENDIX) 
            return 1;
        if (typ === DecreePartReferent.ATTR_SECTION) 
            return 2;
        if (typ === DecreePartReferent.ATTR_SUBSECTION) 
            return 3;
        if (typ === DecreePartReferent.ATTR_CHAPTER) 
            return 4;
        if (typ === DecreePartReferent.ATTR_PARAGRAPH) 
            return 5;
        if (typ === DecreePartReferent.ATTR_SUBPARAGRAPH) 
            return 6;
        if (typ === DecreePartReferent.ATTR_PAGE) 
            return 6;
        if (typ === DecreePartReferent.ATTR_CLAUSE) 
            return 7;
        if (typ === DecreePartReferent.ATTR_PREAMBLE) 
            return 8;
        if (typ === DecreePartReferent.ATTR_PART) 
            return 8;
        if (typ === DecreePartReferent.ATTR_ITEM) 
            return 9;
        if (typ === DecreePartReferent.ATTR_NOTICE) 
            return 10;
        if (typ === DecreePartReferent.ATTR_SUBITEM) 
            return 11;
        if (typ === DecreePartReferent.ATTR_INDENTION) 
            return 12;
        if (typ === DecreePartReferent.ATTR_SUBINDENTION) 
            return 13;
        return -1;
    }
    
    _has_less_level_attr(typ) {
        let l_ = this._get_level(typ);
        if (l_ < 0) 
            return false;
        for (const s of this.slots) {
            let l1 = this._get_level(s.type_name);
            if (l1 >= 0 && l1 > l_) 
                return true;
        }
        return false;
    }
    
    /**
     * Добавить информацию о вышележащих элементах
     * @param dp 
     */
    add_high_level_info(dp) {
        if (dp.addagree !== null && this.addagree === null) 
            this.addagree = dp.addagree;
        else if (dp.addagree !== this.addagree) 
            return;
        if (dp.appendix !== null && this.appendix === null) 
            this.appendix = dp.appendix;
        else if (this.appendix !== dp.appendix) 
            return;
        if (dp.doc_part !== null && this.doc_part === null) 
            this.doc_part = dp.doc_part;
        else if (this.doc_part !== dp.doc_part) 
            return;
        if (dp.section !== null && this.section === null && this._has_less_level_attr(DecreePartReferent.ATTR_SECTION)) 
            this.section = dp.section;
        else if (this.section !== dp.section) 
            return;
        if (dp.sub_section !== null && this.sub_section === null && this._has_less_level_attr(DecreePartReferent.ATTR_SUBSECTION)) 
            this.sub_section = dp.sub_section;
        else if (this.sub_section !== dp.sub_section) 
            return;
        if (dp.chapter !== null && this.chapter === null && this._has_less_level_attr(DecreePartReferent.ATTR_CHAPTER)) 
            this.chapter = dp.chapter;
        else if (dp.chapter !== this.chapter) 
            return;
        if (dp.paragraph !== null && this.paragraph === null && this._has_less_level_attr(DecreePartReferent.ATTR_PARAGRAPH)) 
            this.paragraph = dp.paragraph;
        else if (this.paragraph !== dp.paragraph) 
            return;
        if (dp.sub_paragraph !== null && this.sub_paragraph === null && this._has_less_level_attr(DecreePartReferent.ATTR_SUBPARAGRAPH)) 
            this.sub_paragraph = dp.sub_paragraph;
        else if (this.sub_paragraph !== dp.sub_paragraph) 
            return;
        if (dp.clause !== null && this.clause === null && this._has_less_level_attr(DecreePartReferent.ATTR_CLAUSE)) 
            this.clause = dp.clause;
        else if (dp.clause !== this.clause) 
            return;
        if (dp.part !== null && this.part === null && this._has_less_level_attr(DecreePartReferent.ATTR_PART)) 
            this.part = dp.part;
        else if (dp.part !== this.part) 
            return;
        if (dp.item !== null && this.item === null && this._has_less_level_attr(DecreePartReferent.ATTR_ITEM)) {
            if (this.sub_item !== null && this.sub_item.indexOf('.') > 0) {
            }
            else 
                this.item = dp.item;
        }
        else if (dp.item !== this.item) 
            return;
        if (dp.sub_item !== null && this.sub_item === null && this._has_less_level_attr(DecreePartReferent.ATTR_SUBITEM)) 
            this.sub_item = dp.sub_item;
        else if (dp.sub_item !== this.sub_item) 
            return;
        if (dp.indention !== null && this.indention === null && this._has_less_level_attr(DecreePartReferent.ATTR_INDENTION)) 
            this.indention = dp.indention;
    }
    
    /**
     * Проверить, что все элементы находятся на более низком уровне, чем у аргумента
     * @param upper_parts 
     * @return 
     */
    is_all_items_less_level(upper_parts, ignore_equals) {
        if (upper_parts instanceof DecreeReferent) 
            return true;
        for (const s of this.slots) {
            let l_ = this._get_level(s.type_name);
            if (l_ < 0) 
                continue;
            if (upper_parts.find_slot(s.type_name, null, true) !== null) {
                if (upper_parts.find_slot(s.type_name, s.value, true) === null) 
                    return false;
                continue;
            }
            for (const ss of upper_parts.slots) {
                let ll = this._get_level(ss.type_name);
                if (ll >= l_) 
                    return false;
            }
        }
        return true;
    }
    
    is_all_items_over_this_level(typ) {
        const PartToken = require("./internal/PartToken");
        let l0 = this._get_level(PartToken._get_attr_name_by_typ(typ));
        if (l0 <= 0) 
            return false;
        for (const s of this.slots) {
            let l_ = this._get_level(s.type_name);
            if (l_ <= 0) 
                continue;
            if (l_ >= l0) 
                return false;
        }
        return true;
    }
    
    get_min_level() {
        let min = 0;
        for (const s of this.slots) {
            let l_ = this._get_level(s.type_name);
            if (l_ <= 0) 
                continue;
            if (min === 0) 
                min = l_;
            else if (min > l_) 
                min = l_;
        }
        return min;
    }
    
    can_be_equals(obj, typ) {
        let b = this._can_be_equals(obj, typ, false);
        return b;
    }
    
    _can_be_equals(obj, typ, ignore_geo) {
        let dr = Utils.as(obj, DecreePartReferent);
        if (dr === null) 
            return false;
        if (this.owner !== null && dr.owner !== null) {
            if (this.owner !== dr.owner) 
                return false;
        }
        else if (typ === ReferentEqualType.DIFFERENTTEXTS) 
            return false;
        else {
            let ty1 = (this.owner === null ? this.local_typ : this.owner.typ);
            let ty2 = (dr.owner === null ? dr.local_typ : dr.owner.typ);
            if (ty1 !== ty2) {
                ty1 = (this.owner === null ? this.local_typ : this.owner.typ0);
                ty2 = (dr.owner === null ? dr.local_typ : dr.owner.typ0);
                if (ty1 !== ty2) 
                    return false;
            }
        }
        if (this.clause !== dr.clause) {
            if (typ === ReferentEqualType.FORMERGING && ((this.clause === null || dr.clause === null))) {
            }
            else 
                return false;
        }
        if (this.part !== dr.part) {
            if (typ === ReferentEqualType.FORMERGING && ((this.part === null || dr.part === null))) {
            }
            else 
                return false;
        }
        if (this.paragraph !== dr.paragraph) {
            if (typ === ReferentEqualType.FORMERGING && ((this.paragraph === null || dr.paragraph === null))) {
            }
            else 
                return false;
        }
        if (this.sub_paragraph !== dr.sub_paragraph) {
            if (typ === ReferentEqualType.FORMERGING && ((this.sub_paragraph === null || dr.sub_paragraph === null))) {
            }
            else 
                return false;
        }
        if (this.item !== dr.item) {
            if (typ === ReferentEqualType.FORMERGING && ((this.item === null || dr.item === null))) {
            }
            else 
                return false;
        }
        if (this.sub_item !== dr.sub_item) {
            if (typ === ReferentEqualType.FORMERGING && ((this.sub_item === null || dr.sub_item === null))) {
            }
            else 
                return false;
        }
        if (this.notice !== dr.notice) {
            if (typ === ReferentEqualType.FORMERGING && ((this.notice === null || dr.notice === null))) {
            }
            else 
                return false;
        }
        if (this.indention !== dr.indention) {
            if (typ === ReferentEqualType.FORMERGING && ((this.indention === null || dr.indention === null))) {
            }
            else 
                return false;
        }
        if (this.sub_indention !== dr.sub_indention) {
            if (typ === ReferentEqualType.FORMERGING && ((this.sub_indention === null || dr.sub_indention === null))) {
            }
            else 
                return false;
        }
        if (this.appendix !== dr.appendix) {
            if (this.appendix !== null && dr.appendix !== null) 
                return false;
            if (this.clause === null && this.paragraph === null && this.item === null) 
                return false;
        }
        if (this.chapter !== dr.chapter) {
            if (this.chapter !== null && dr.chapter !== null) 
                return false;
            if (this.clause === null && this.paragraph === null && this.item === null) 
                return false;
        }
        if (this.section !== dr.section) {
            if (this.section !== null && dr.section !== null) 
                return false;
            if ((this.clause === null && this.paragraph === null && this.item === null) && this.sub_section === null) 
                return false;
        }
        if (this.sub_section !== dr.sub_section) {
            if (this.sub_section !== null && dr.sub_section !== null) 
                return false;
            if (this.clause === null && this.paragraph === null && this.item === null) 
                return false;
        }
        if (this.subprogram !== null || dr.subprogram !== null) {
            if (this.name !== dr.name) 
                return false;
            return true;
        }
        if (this.addagree !== null || dr.addagree !== null) {
            if (this.addagree !== dr.addagree) 
                return false;
        }
        if (this.doc_part !== dr.doc_part) {
            if (typ === ReferentEqualType.FORMERGING && ((this.doc_part === null || dr.doc_part === null))) {
            }
            else 
                return false;
        }
        if (this.page !== dr.page) 
            return false;
        return true;
    }
    
    static create_range_referent(min, max) {
        let res = Utils.as(min.clone(), DecreePartReferent);
        let cou = 0;
        for (const s of res.slots) {
            let ss = max.find_slot(s.type_name, null, true);
            if (ss === null) 
                return null;
            if (ss.value === s.value) 
                continue;
            if (max.find_slot(s.type_name, s.value, true) !== null) 
                continue;
            if ((++cou) > 1) 
                return null;
            res.upload_slot(s, (String(s.value) + "-" + ss.value));
        }
        if (cou !== 1) 
            return null;
        return res;
    }
    
    static _new1106(_arg1) {
        let res = new DecreePartReferent();
        res.owner = _arg1;
        return res;
    }
    
    static static_constructor() {
        DecreePartReferent.OBJ_TYPENAME = "DECREEPART";
        DecreePartReferent.ATTR_NAME = "NAME";
        DecreePartReferent.ATTR_OWNER = "OWNER";
        DecreePartReferent.ATTR_LOCALTYP = "LOCALTYP";
        DecreePartReferent.ATTR_DOCPART = "DOCPART";
        DecreePartReferent.ATTR_APPENDIX = "APPENDIX";
        DecreePartReferent.ATTR_SECTION = "SECTION";
        DecreePartReferent.ATTR_SUBSECTION = "SUBSECTION";
        DecreePartReferent.ATTR_CHAPTER = "CHAPTER";
        DecreePartReferent.ATTR_CLAUSE = "CLAUSE";
        DecreePartReferent.ATTR_PARAGRAPH = "PARAGRAPH";
        DecreePartReferent.ATTR_SUBPARAGRAPH = "SUBPARAGRAPH";
        DecreePartReferent.ATTR_PART = "PART";
        DecreePartReferent.ATTR_ITEM = "ITEM";
        DecreePartReferent.ATTR_SUBITEM = "SUBITEM";
        DecreePartReferent.ATTR_INDENTION = "INDENTION";
        DecreePartReferent.ATTR_SUBINDENTION = "SUBINDENTION";
        DecreePartReferent.ATTR_PREAMBLE = "PREAMPLE";
        DecreePartReferent.ATTR_NOTICE = "NOTICE";
        DecreePartReferent.ATTR_SUBPROGRAM = "SUBPROGRAM";
        DecreePartReferent.ATTR_ADDAGREE = "ADDAGREE";
        DecreePartReferent.ATTR_PAGE = "PAGE";
    }
}


DecreePartReferent.static_constructor();

module.exports = DecreePartReferent