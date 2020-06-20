/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const MetaToken = require("./../../MetaToken");
const MorphLang = require("./../../../morph/MorphLang");
const TerminCollection = require("./../../core/TerminCollection");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const NumberSpellingType = require("./../../NumberSpellingType");
const TextToken = require("./../../TextToken");
const NumberToken = require("./../../NumberToken");
const ReferentToken = require("./../../ReferentToken");
const Termin = require("./../../core/Termin");

class UriItemToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.value = null;
    }
    
    static attach_uri_content(t0, after_http) {
        let res = UriItemToken._attach_uri_content(t0, ".;:-_=+&%#@/\\?[]()!~", after_http);
        if (res === null) 
            return null;
        if (res.end_token.is_char_of(".;-:") && res.end_char > 3) {
            res.end_token = res.end_token.previous;
            res.value = res.value.substring(0, 0 + res.value.length - 1);
        }
        if (res.value.endsWith("/")) 
            res.value = res.value.substring(0, 0 + res.value.length - 1);
        if (res.value.endsWith("\\")) 
            res.value = res.value.substring(0, 0 + res.value.length - 1);
        if (res.value.indexOf('\\') > 0) 
            res.value = Utils.replaceString(res.value, '\\', '/');
        return res;
    }
    
    static attachisocontent(t0, spec_chars) {
        let t = t0;
        while (true) {
            if (t === null) 
                return null;
            if (t.is_char_of(":/\\") || t.is_hiphen || t.is_value("IEC", null)) {
                t = t.next;
                continue;
            }
            break;
        }
        if (!((t instanceof NumberToken))) 
            return null;
        let t1 = t;
        let delim = String.fromCharCode(0);
        let txt = new StringBuilder();
        for (; t !== null; t = t.next) {
            if (t.is_whitespace_before && t !== t1) 
                break;
            if (t instanceof NumberToken) {
                if (delim !== (String.fromCharCode(0))) 
                    txt.append(delim);
                delim = String.fromCharCode(0);
                t1 = t;
                txt.append(t.get_source_text());
                continue;
            }
            if (!((t instanceof TextToken))) 
                break;
            if (!t.is_char_of(spec_chars)) 
                break;
            delim = t.get_source_text()[0];
        }
        if (txt.length === 0) 
            return null;
        return UriItemToken._new2699(t0, t1, txt.toString());
    }
    
    static _attach_uri_content(t0, _chars, can_be_whitespaces = false) {
        let txt = new StringBuilder();
        let t1 = t0;
        let dom = UriItemToken.attach_domain_name(t0, true, can_be_whitespaces);
        if (dom !== null) {
            if (dom.value.length < 3) 
                return null;
        }
        let open_char = String.fromCharCode(0);
        let t = t0;
        if (dom !== null) 
            t = dom.end_token.next;
        for (; t !== null; t = t.next) {
            if (t !== t0 && t.is_whitespace_before) {
                if (t.is_newline_before || !can_be_whitespaces) 
                    break;
                if (dom === null) 
                    break;
                if (t.previous.is_hiphen) {
                }
                else if (t.previous.is_char_of(",;")) 
                    break;
                else if (t.previous.is_char('.') && t.chars.is_letter && t.length_char === 2) {
                }
                else {
                    let ok = false;
                    let tt1 = t;
                    if (t.is_char_of("\\/")) 
                        tt1 = t.next;
                    let tt0 = tt1;
                    for (; tt1 !== null; tt1 = tt1.next) {
                        if (tt1 !== tt0 && tt1.is_whitespace_before) 
                            break;
                        if (tt1 instanceof NumberToken) 
                            continue;
                        if (!((tt1 instanceof TextToken))) 
                            break;
                        let term1 = (tt1).term;
                        if (((term1 === "HTM" || term1 === "HTML" || term1 === "SHTML") || term1 === "ASP" || term1 === "ASPX") || term1 === "JSP") {
                            ok = true;
                            break;
                        }
                        if (!tt1.chars.is_letter) {
                            if (tt1.is_char_of("\\/")) {
                                ok = true;
                                break;
                            }
                            if (!tt1.is_char_of(_chars)) 
                                break;
                        }
                        else if (!tt1.chars.is_latin_letter) 
                            break;
                    }
                    if (!ok) 
                        break;
                }
            }
            if (t instanceof NumberToken) {
                let nt = Utils.as(t, NumberToken);
                txt.append(nt.get_source_text());
                t1 = t;
                continue;
            }
            let tt = Utils.as(t, TextToken);
            if (tt === null) {
                let rt = Utils.as(t, ReferentToken);
                if (rt !== null && rt.begin_token.is_value("РФ", null)) {
                    if (txt.length > 0 && txt.charAt(txt.length - 1) === '.') {
                        txt.append(rt.begin_token.get_source_text());
                        t1 = t;
                        continue;
                    }
                }
                if (rt !== null && rt.chars.is_latin_letter && rt.begin_token === rt.end_token) {
                    txt.append(rt.begin_token.get_source_text());
                    t1 = t;
                    continue;
                }
                break;
            }
            let src = tt.get_source_text();
            let ch = src[0];
            if (!Utils.isLetter(ch)) {
                if (_chars.indexOf(ch) < 0) 
                    break;
                if (ch === '(' || ch === '[') 
                    open_char = ch;
                else if (ch === ')') {
                    if (open_char !== '(') 
                        break;
                    open_char = String.fromCharCode(0);
                }
                else if (ch === ']') {
                    if (open_char !== '[') 
                        break;
                    open_char = String.fromCharCode(0);
                }
            }
            txt.append(src);
            t1 = t;
        }
        if (txt.length === 0) 
            return dom;
        let i = 0;
        for (i = 0; i < txt.length; i++) {
            if (Utils.isLetterOrDigit(txt.charAt(i))) 
                break;
        }
        if (i >= txt.length) 
            return dom;
        if (txt.charAt(txt.length - 1) === '.' || txt.charAt(txt.length - 1) === '/') {
            txt.length = txt.length - 1;
            t1 = t1.previous;
        }
        if (dom !== null) 
            txt.insert(0, dom.value);
        let tmp = txt.toString();
        if (tmp.startsWith("\\\\")) {
            txt.replace("\\\\", "//");
            tmp = txt.toString();
        }
        if (tmp.startsWith("//")) 
            tmp = tmp.substring(2);
        if (Utils.compareStrings(tmp, "WWW", true) === 0) 
            return null;
        let res = UriItemToken._new2699(t0, t1, txt.toString());
        return res;
    }
    
    static attach_domain_name(t0, _check, can_be_whitspaces) {
        let txt = new StringBuilder();
        let t1 = t0;
        let ip_count = 0;
        let is_ip = true;
        for (let t = t0; t !== null; t = t.next) {
            if (t.is_whitespace_before && t !== t0) {
                let ok = false;
                if (!t.is_newline_before && can_be_whitspaces) {
                    for (let tt1 = t; tt1 !== null; tt1 = tt1.next) {
                        if (tt1.is_char('.') || tt1.is_hiphen) 
                            continue;
                        if (tt1.is_whitespace_before) {
                            if (tt1.is_newline_before) 
                                break;
                            if (tt1.previous !== null && ((tt1.previous.is_char('.') || tt1.previous.is_hiphen))) {
                            }
                            else 
                                break;
                        }
                        if (!((tt1 instanceof TextToken))) 
                            break;
                        if (UriItemToken.m_std_groups.try_parse(tt1, TerminParseAttr.NO) !== null) {
                            ok = true;
                            break;
                        }
                        if (!tt1.chars.is_latin_letter) 
                            break;
                    }
                }
                if (!ok) 
                    break;
            }
            if (t instanceof NumberToken) {
                let nt = Utils.as(t, NumberToken);
                if (nt.int_value === null) 
                    break;
                txt.append(nt.get_source_text());
                t1 = t;
                if (nt.typ === NumberSpellingType.DIGIT && nt.int_value >= 0 && (nt.int_value < 256)) 
                    ip_count++;
                else 
                    is_ip = false;
                continue;
            }
            let tt = Utils.as(t, TextToken);
            if (tt === null) 
                break;
            let src = (tt).term;
            let ch = src[0];
            if (!Utils.isLetter(ch)) {
                if (".-_".indexOf(ch) < 0) 
                    break;
                if (ch !== '.') 
                    is_ip = false;
                if (ch === '-') {
                    if (Utils.compareStrings(txt.toString(), "vk.com", true) === 0) 
                        return UriItemToken._new2699(t0, t1, txt.toString().toLowerCase());
                }
            }
            else 
                is_ip = false;
            txt.append(src.toLowerCase());
            t1 = t;
        }
        if (txt.length === 0) 
            return null;
        if (ip_count !== 4) 
            is_ip = false;
        let i = 0;
        let points = 0;
        for (i = 0; i < txt.length; i++) {
            if (txt.charAt(i) === '.') {
                if (i === 0) 
                    return null;
                if (i >= (txt.length - 1)) {
                    txt.length = txt.length - 1;
                    t1 = t1.previous;
                    break;
                }
                if (txt.charAt(i - 1) === '.' || txt.charAt(i + 1) === '.') 
                    return null;
                points++;
            }
        }
        if (points === 0) 
            return null;
        let _uri = txt.toString();
        if (_check) {
            let ok = is_ip;
            if (!is_ip) {
                if (txt.toString() === "localhost") 
                    ok = true;
            }
            if (!ok && t1.previous !== null && t1.previous.is_char('.')) {
                if (UriItemToken.m_std_groups.try_parse(t1, TerminParseAttr.NO) !== null) 
                    ok = true;
            }
            if (!ok) 
                return null;
        }
        return UriItemToken._new2699(t0, t1, txt.toString().toLowerCase());
    }
    
    static attach_mail_users(t1) {
        if (t1 === null) 
            return null;
        if (t1.is_char('}')) {
            let res0 = UriItemToken.attach_mail_users(t1.previous);
            if (res0 === null) 
                return null;
            t1 = res0[0].begin_token.previous;
            for (; t1 !== null; t1 = t1.previous) {
                if (t1.is_char('{')) {
                    res0[0].begin_token = t1;
                    return res0;
                }
                if (t1.is_char_of(";,")) 
                    continue;
                let res1 = UriItemToken.attach_mail_users(t1);
                if (res1 === null) 
                    return null;
                res0.splice(0, 0, res1[0]);
                t1 = res1[0].begin_token;
            }
            return null;
        }
        let txt = new StringBuilder();
        let t0 = t1;
        for (let t = t1; t !== null; t = t.previous) {
            if (t.is_whitespace_after) 
                break;
            if (t instanceof NumberToken) {
                let nt = Utils.as(t, NumberToken);
                txt.insert(0, nt.get_source_text());
                t0 = t;
                continue;
            }
            let tt = Utils.as(t, TextToken);
            if (tt === null) 
                break;
            let src = tt.get_source_text();
            let ch = src[0];
            if (!Utils.isLetter(ch)) {
                if (".-_".indexOf(ch) < 0) 
                    break;
            }
            txt.insert(0, src);
            t0 = t;
        }
        if (txt.length === 0) 
            return null;
        let res = new Array();
        res.push(UriItemToken._new2699(t0, t1, txt.toString().toLowerCase()));
        return res;
    }
    
    static attach_url(t0) {
        let srv = UriItemToken.attach_domain_name(t0, true, false);
        if (srv === null) 
            return null;
        let txt = new StringBuilder(srv.value);
        let t1 = srv.end_token;
        if (t1.next !== null && t1.next.is_char(':') && (t1.next.next instanceof NumberToken)) {
            t1 = t1.next.next;
            txt.append(":").append((t1).value);
        }
        else if ((srv.value === "vk.com" && t1.next !== null && t1.next.is_hiphen) && t1.next.next !== null) {
            t1 = t1.next.next;
            let dat = UriItemToken._attach_uri_content(t1, ".-_+%", false);
            if (dat !== null) {
                t1 = dat.end_token;
                txt.append("/").append(dat.value);
            }
        }
        for (let t = t1.next; t !== null; t = t.next) {
            if (t.is_whitespace_before) 
                break;
            if (!t.is_char('/')) 
                break;
            if (t.is_whitespace_after) {
                t1 = t;
                break;
            }
            let dat = UriItemToken._attach_uri_content(t.next, ".-_+%", false);
            if (dat === null) {
                t1 = t;
                break;
            }
            t = (t1 = dat.end_token);
            txt.append("/").append(dat.value);
        }
        if ((t1.next !== null && t1.next.is_char('?') && !t1.next.is_whitespace_after) && !t1.is_whitespace_after) {
            let dat = UriItemToken._attach_uri_content(t1.next.next, ".-_+%=&", false);
            if (dat !== null) {
                t1 = dat.end_token;
                txt.append("?").append(dat.value);
            }
        }
        if ((t1.next !== null && t1.next.is_char('#') && !t1.next.is_whitespace_after) && !t1.is_whitespace_after) {
            let dat = UriItemToken._attach_uri_content(t1.next.next, ".-_+%", false);
            if (dat !== null) {
                t1 = dat.end_token;
                txt.append("#").append(dat.value);
            }
        }
        let i = 0;
        for (i = 0; i < txt.length; i++) {
            if (Utils.isLetter(txt.charAt(i))) 
                break;
        }
        if (i >= txt.length) 
            return null;
        return UriItemToken._new2699(t0, t1, txt.toString());
    }
    
    static attachisbn(t0) {
        let txt = new StringBuilder();
        let t1 = t0;
        let digs = 0;
        for (let t = t0; t !== null; t = t.next) {
            if (t.is_table_control_char) 
                break;
            if (t.is_newline_before && t !== t0) {
                if (t.previous !== null && t.previous.is_hiphen) {
                }
                else 
                    break;
            }
            if (t instanceof NumberToken) {
                let nt = Utils.as(t, NumberToken);
                if (nt.typ !== NumberSpellingType.DIGIT || !nt.morph.class0.is_undefined) 
                    break;
                let d = nt.get_source_text();
                txt.append(d);
                digs += d.length;
                t1 = t;
                if (digs > 13) 
                    break;
                continue;
            }
            let tt = Utils.as(t, TextToken);
            if (tt === null) 
                break;
            let s = tt.term;
            if (s !== "-" && s !== "Х" && s !== "X") 
                break;
            if (s === "Х") 
                s = "X";
            txt.append(s);
            t1 = t;
            if (s !== "-") 
                break;
        }
        let i = 0;
        let dig = 0;
        for (i = 0; i < txt.length; i++) {
            if (Utils.isDigit(txt.charAt(i))) 
                dig++;
        }
        if (dig < 7) 
            return null;
        return UriItemToken._new2699(t0, t1, txt.toString());
    }
    
    static attachbbk(t0) {
        let txt = new StringBuilder();
        let t1 = t0;
        let digs = 0;
        for (let t = t0; t !== null; t = t.next) {
            if (t.is_newline_before && t !== t0) 
                break;
            if (t.is_table_control_char) 
                break;
            if (t instanceof NumberToken) {
                let nt = Utils.as(t, NumberToken);
                if (nt.typ !== NumberSpellingType.DIGIT || !nt.morph.class0.is_undefined) 
                    break;
                let d = nt.get_source_text();
                txt.append(d);
                digs += d.length;
                t1 = t;
                continue;
            }
            let tt = Utils.as(t, TextToken);
            if (tt === null) 
                break;
            if (tt.is_char(',')) 
                break;
            if (tt.is_char('(')) {
                if (!((tt.next instanceof NumberToken))) 
                    break;
            }
            let s = tt.get_source_text();
            if (Utils.isLetter(s[0])) {
                if (tt.is_whitespace_before) 
                    break;
            }
            txt.append(s);
            t1 = t;
        }
        if ((txt.length < 3) || (digs < 2)) 
            return null;
        if (txt.charAt(txt.length - 1) === '.') {
            txt.length = txt.length - 1;
            t1 = t1.previous;
        }
        return UriItemToken._new2699(t0, t1, txt.toString());
    }
    
    static attach_skype(t0) {
        if (t0.chars.is_cyrillic_letter) 
            return null;
        let res = UriItemToken._attach_uri_content(t0, "._", false);
        if (res === null) 
            return null;
        if (res.value.length < 5) 
            return null;
        return res;
    }
    
    static attach_icq_content(t0) {
        if (!((t0 instanceof NumberToken))) 
            return null;
        let res = UriItemToken.attachisbn(t0);
        if (res === null) 
            return null;
        if (res.value.includes("-")) 
            res.value = Utils.replaceString(res.value, "-", "");
        for (const ch of res.value) {
            if (!Utils.isDigit(ch)) 
                return null;
        }
        if ((res.value.length < 6) || res.value.length > 10) 
            return null;
        return res;
    }
    
    static initialize() {
        if (UriItemToken.m_std_groups !== null) 
            return;
        UriItemToken.m_std_groups = new TerminCollection();
        let domain_groups = ["com;net;org;inf;biz;name;aero;arpa;edu;int;gov;mil;coop;museum;mobi;travel", "ac;ad;ae;af;ag;ai;al;am;an;ao;aq;ar;as;at;au;aw;az", "ba;bb;bd;be;bf;bg;bh;bi;bj;bm;bn;bo;br;bs;bt;bv;bw;by;bz", "ca;cc;cd;cf;cg;ch;ci;ck;cl;cm;cn;co;cr;cu;cv;cx;cy;cz", "de;dj;dk;dm;do;dz", "ec;ee;eg;eh;er;es;et;eu", "fi;fj;fk;fm;fo;fr", "ga;gd;ge;gf;gg;gh;gi;gl;gm;gn;gp;gq;gr;gs;gt;gu;gw;gy", "hk;hm;hn;hr;ht;hu", "id;ie;il;im;in;io;iq;ir;is;it", "je;jm;jo;jp", "ke;kg;kh;ki;km;kn;kp;kr;kw;ky;kz", "la;lb;lc;li;lk;lr;ls;lt;lu;lv;ly", "ma;mc;md;mg;mh;mk;ml;mm;mn;mo;mp;mq;mr;ms;mt;mu;mv;mw;mx;my;mz", "na;nc;ne;nf;ng;ni;nl;no;np;nr;nu;nz", "om", "pa;pe;pf;pg;ph;pk;pl;pm;pn;pr;ps;pt;pw;py", "qa", "re;ro;ru;rw", "sa;sb;sc;sd;se;sg;sh;si;sj;sk;sl;sm;sn;so;sr;st;su;sv;sy;sz", "tc;td;tf;tg;th;tj;tk;tm;tn;to;tp;tr;tt;tv;tw;tz", "ua;ug;uk;um;us;uy;uz", "va;vc;ve;vg;vi;vn;vu", "wf;ws", "ye;yt;yu", "za;zm;zw"];
        let separator = [';'];
        for (const domain_group of domain_groups) {
            for (const domain of Utils.splitString(domain_group.toUpperCase(), separator, true)) {
                UriItemToken.m_std_groups.add(new Termin(domain, MorphLang.UNKNOWN, true));
            }
        }
    }
    
    static _new2699(_arg1, _arg2, _arg3) {
        let res = new UriItemToken(_arg1, _arg2);
        res.value = _arg3;
        return res;
    }
    
    static static_constructor() {
        UriItemToken.m_std_groups = null;
    }
}


UriItemToken.static_constructor();

module.exports = UriItemToken