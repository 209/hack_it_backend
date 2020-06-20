/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const BookLinkRefType = require("./BookLinkRefType");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const MetaBookLinkRef = require("./internal/MetaBookLinkRef");

/**
 * Ссылка на внешний литературный источник (статью, книгу и пр.)
 */
class BookLinkRefReferent extends Referent {
    
    constructor() {
        super(BookLinkRefReferent.OBJ_TYPENAME);
        this.instance_of = MetaBookLinkRef.global_meta;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        if (this.number !== null) 
            res.append("[").append(this.number).append("] ");
        if (this.pages !== null) 
            res.append((lang !== null && lang.is_en ? "pages" : "стр.")).append(" ").append(this.pages).append("; ");
        let _book = this.book;
        if (_book === null) 
            res.append("?");
        else 
            res.append(_book.to_string(short_variant, lang, lev));
        return res.toString();
    }
    
    get parent_referent() {
        return Utils.as(this.get_slot_value(BookLinkRefReferent.ATTR_BOOK), Referent);
    }
    
    /**
     * [Get] Тип ссылки
     */
    get typ() {
        let val = this.get_string_value(BookLinkRefReferent.ATTR_TYPE);
        if (val === null) 
            return BookLinkRefType.UNDEFINED;
        try {
            return BookLinkRefType.of(val);
        } catch (ex398) {
        }
        return BookLinkRefType.UNDEFINED;
    }
    /**
     * [Set] Тип ссылки
     */
    set typ(value) {
        this.add_slot(BookLinkRefReferent.ATTR_TYPE, value.toString(), true, 0);
        return value;
    }
    
    /**
     * [Get] Собственно ссылка вовне на источник - BookLinkReferent или DecreeReferent
     */
    get book() {
        return Utils.as(this.get_slot_value(BookLinkRefReferent.ATTR_BOOK), Referent);
    }
    /**
     * [Set] Собственно ссылка вовне на источник - BookLinkReferent или DecreeReferent
     */
    set book(value) {
        this.add_slot(BookLinkRefReferent.ATTR_BOOK, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Порядковый номер в списке
     */
    get number() {
        return this.get_string_value(BookLinkRefReferent.ATTR_NUMBER);
    }
    /**
     * [Set] Порядковый номер в списке
     */
    set number(value) {
        let num = value;
        if (num !== null && num.indexOf('-') > 0) 
            num = Utils.replaceString(num, " - ", "-");
        this.add_slot(BookLinkRefReferent.ATTR_NUMBER, num, true, 0);
        return value;
    }
    
    /**
     * [Get] Ссылка на страницу или диапазон страниц
     */
    get pages() {
        return this.get_string_value(BookLinkRefReferent.ATTR_PAGES);
    }
    /**
     * [Set] Ссылка на страницу или диапазон страниц
     */
    set pages(value) {
        this.add_slot(BookLinkRefReferent.ATTR_PAGES, value, true, 0);
        return value;
    }
    
    can_be_equals(obj, _typ = ReferentEqualType.WITHINONETEXT) {
        let r = Utils.as(obj, BookLinkRefReferent);
        if (r === null) 
            return false;
        if (this.book !== r.book) 
            return false;
        if (this.number !== r.number) 
            return false;
        if (this.pages !== r.pages) 
            return false;
        if (((this.typ === BookLinkRefType.INLINE)) !== ((r.typ === BookLinkRefType.INLINE))) 
            return false;
        return true;
    }
    
    /**
     * Возвращает разницу номеров r2 - r1, иначе null, если номеров нет
     * @param r1 
     * @param r2 
     * @return 
     */
    static get_number_diff(r1, r2) {
        let num1 = r1.get_string_value(BookLinkRefReferent.ATTR_NUMBER);
        let num2 = r2.get_string_value(BookLinkRefReferent.ATTR_NUMBER);
        if (num1 === null || num2 === null) 
            return null;
        let n1 = 0;
        let n2 = 0;
        let wrapn1399 = new RefOutArgWrapper();
        let inoutres400 = Utils.tryParseInt(num1, wrapn1399);
        let wrapn2401 = new RefOutArgWrapper();
        let inoutres402 = Utils.tryParseInt(num2, wrapn2401);
        n1 = wrapn1399.value;
        n2 = wrapn2401.value;
        if (!inoutres400 || !inoutres402) 
            return null;
        return n2 - n1;
    }
    
    static _new390(_arg1) {
        let res = new BookLinkRefReferent();
        res.book = _arg1;
        return res;
    }
    
    static static_constructor() {
        BookLinkRefReferent.OBJ_TYPENAME = "BOOKLINKREF";
        BookLinkRefReferent.ATTR_BOOK = "BOOK";
        BookLinkRefReferent.ATTR_TYPE = "TYPE";
        BookLinkRefReferent.ATTR_PAGES = "PAGES";
        BookLinkRefReferent.ATTR_NUMBER = "NUMBER";
        BookLinkRefReferent.ATTR_MISC = "MISC";
    }
}


BookLinkRefReferent.static_constructor();

module.exports = BookLinkRefReferent