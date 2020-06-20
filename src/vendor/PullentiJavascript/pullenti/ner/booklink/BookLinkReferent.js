/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const UriReferent = require("./../uri/UriReferent");
const MiscHelper = require("./../core/MiscHelper");
const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const MetaBookLink = require("./internal/MetaBookLink");
const ReferentClass = require("./../ReferentClass");

/**
 * Ссылка на внешний литературный источник (статью, книгу и пр.)
 */
class BookLinkReferent extends Referent {
    
    constructor() {
        super(BookLinkReferent.OBJ_TYPENAME);
        this.instance_of = MetaBookLink.global_meta;
    }
    
    to_string(short_variant, _lang = null, lev = 0) {
        let res = new StringBuilder();
        let a = this.get_slot_value(BookLinkReferent.ATTR_AUTHOR);
        if (a !== null) {
            for (const s of this.slots) {
                if (s.type_name === BookLinkReferent.ATTR_AUTHOR) {
                    if (a !== s.value) 
                        res.append(", ");
                    if (s.value instanceof Referent) 
                        res.append((s.value).to_string(true, _lang, lev + 1));
                    else if ((typeof s.value === 'string' || s.value instanceof String)) 
                        res.append(Utils.asString(s.value));
                }
            }
            if (this.authors_and_other) 
                res.append(" и др.");
        }
        let nam = this.name;
        if (nam !== null) {
            if (res.length > 0) 
                res.append(' ');
            if (nam.length > 200) 
                nam = nam.substring(0, 0 + 200) + "...";
            res.append("\"").append(nam).append("\"");
        }
        let uri = Utils.as(this.get_slot_value(BookLinkReferent.ATTR_URL), UriReferent);
        if (uri !== null) 
            res.append(" [").append(uri.toString()).append("]");
        if (this.year > 0) 
            res.append(", ").append(this.year);
        return res.toString();
    }
    
    get name() {
        return this.get_string_value(BookLinkReferent.ATTR_NAME);
    }
    set name(value) {
        this.add_slot(BookLinkReferent.ATTR_NAME, value, true, 0);
        return value;
    }
    
    get lang() {
        return this.get_string_value(BookLinkReferent.ATTR_LANG);
    }
    set lang(value) {
        this.add_slot(BookLinkReferent.ATTR_LANG, value, true, 0);
        return value;
    }
    
    get typ() {
        return this.get_string_value(BookLinkReferent.ATTR_TYPE);
    }
    set typ(value) {
        this.add_slot(BookLinkReferent.ATTR_TYPE, value, true, 0);
        return value;
    }
    
    get url() {
        return Utils.as(this.get_slot_value(BookLinkReferent.ATTR_URL), UriReferent);
    }
    
    get year() {
        let _year = 0;
        let wrapyear396 = new RefOutArgWrapper();
        let inoutres397 = Utils.tryParseInt(Utils.notNull(this.get_string_value(BookLinkReferent.ATTR_YEAR), ""), wrapyear396);
        _year = wrapyear396.value;
        if (inoutres397) 
            return _year;
        else 
            return 0;
    }
    set year(value) {
        this.add_slot(BookLinkReferent.ATTR_YEAR, value.toString(), true, 0);
        return value;
    }
    
    get authors_and_other() {
        return this.find_slot(BookLinkReferent.ATTR_MISC, "и др.", true) !== null;
    }
    set authors_and_other(value) {
        this.add_slot(BookLinkReferent.ATTR_MISC, "и др.", false, 0);
        return value;
    }
    
    can_be_equals(obj, _typ = ReferentEqualType.WITHINONETEXT) {
        let br = Utils.as(obj, BookLinkReferent);
        if (br === null) 
            return false;
        let eq = 0;
        if (this.year > 0 && br.year > 0) {
            if (this.year === br.year) 
                eq++;
            else 
                return false;
        }
        if (this.typ !== null && br.typ !== null) {
            if (this.typ !== br.typ) 
                return false;
        }
        let eq_auth = false;
        if (this.find_slot(BookLinkReferent.ATTR_AUTHOR, null, true) !== null && br.find_slot(BookLinkReferent.ATTR_AUTHOR, null, true) !== null) {
            let ok = false;
            for (const a of this.slots) {
                if (a.type_name === BookLinkReferent.ATTR_AUTHOR) {
                    if (br.find_slot(BookLinkReferent.ATTR_AUTHOR, a.value, true) !== null) {
                        eq++;
                        ok = true;
                        eq_auth = true;
                    }
                }
            }
            if (!ok) 
                return false;
        }
        if (br.name !== this.name) {
            if (this.name === null || br.name === null) 
                return false;
            if (this.name.startsWith(br.name) || br.name.startsWith(this.name)) 
                eq += 1;
            else if (eq_auth && MiscHelper.can_be_equals(this.name, br.name, false, true, false)) 
                eq += 1;
            else 
                return false;
        }
        else 
            eq += 2;
        return eq > 2;
    }
    
    static static_constructor() {
        BookLinkReferent.OBJ_TYPENAME = "BOOKLINK";
        BookLinkReferent.ATTR_AUTHOR = "AUTHOR";
        BookLinkReferent.ATTR_NAME = "NAME";
        BookLinkReferent.ATTR_YEAR = "YEAR";
        BookLinkReferent.ATTR_LANG = "LANG";
        BookLinkReferent.ATTR_GEO = "GEO";
        BookLinkReferent.ATTR_URL = "URL";
        BookLinkReferent.ATTR_MISC = "MISC";
        BookLinkReferent.ATTR_TYPE = "TYPE";
    }
}


BookLinkReferent.static_constructor();

module.exports = BookLinkReferent