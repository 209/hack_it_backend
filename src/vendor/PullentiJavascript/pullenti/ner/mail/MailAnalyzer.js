/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

const GetTextAttr = require("./../core/GetTextAttr");
const MetaToken = require("./../MetaToken");
const ReferentToken = require("./../ReferentToken");
const Termin = require("./../core/Termin");
const ProcessorService = require("./../ProcessorService");
const PersonReferent = require("./../person/PersonReferent");
const MailKind = require("./MailKind");
const Referent = require("./../Referent");
const EpNerPersonInternalResourceHelper = require("./../person/internal/EpNerPersonInternalResourceHelper");
const MetaLetter = require("./internal/MetaLetter");
const Analyzer = require("./../Analyzer");
const MailReferent = require("./MailReferent");
const MailLineTypes = require("./internal/MailLineTypes");
const MiscHelper = require("./../core/MiscHelper");
const MailLine = require("./internal/MailLine");

/**
 * Анализатор анализа писем (блоков писем)
 */
class MailAnalyzer extends Analyzer {
    
    get name() {
        return MailAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Блок письма";
    }
    
    get description() {
        return "Блоки писем (e-mail) и их атрибуты";
    }
    
    clone() {
        return new MailAnalyzer();
    }
    
    get type_system() {
        return [MetaLetter.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaLetter.IMAGE_ID, EpNerPersonInternalResourceHelper.get_bytes("mail.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === MailReferent.OBJ_TYPENAME) 
            return new MailReferent();
        return null;
    }
    
    get used_extern_object_types() {
        return ["ORGANIZATION", "GEO", "ADDRESS", "PERSON"];
    }
    
    /**
     * [Get] Этот анализатор является специфическим
     */
    get is_specific() {
        return true;
    }
    
    get progress_weight() {
        return 1;
    }
    
    process(kit) {
        let lines = new Array();
        for (let t = kit.first_token; t !== null; t = t.next) {
            let ml = MailLine.parse(t, 0);
            if (ml === null) 
                continue;
            if (lines.length === 91) {
            }
            lines.push(ml);
            t = ml.end_token;
        }
        if (lines.length === 0) 
            return;
        let i = 0;
        let blocks = new Array();
        let blk = null;
        for (i = 0; i < lines.length; i++) {
            let ml = lines[i];
            if (ml.typ === MailLineTypes.FROM) {
                let is_new = ml.must_be_first_line || i === 0;
                if (((i + 2) < lines.length) && (((lines[i + 1].typ === MailLineTypes.FROM || lines[i + 2].typ === MailLineTypes.FROM || lines[i + 1].typ === MailLineTypes.HELLO) || lines[i + 2].typ === MailLineTypes.HELLO))) 
                    is_new = true;
                if (!is_new) {
                    for (let j = i - 1; j >= 0; j--) {
                        if (lines[j].typ !== MailLineTypes.UNDEFINED) {
                            if (lines[j].typ === MailLineTypes.BESTREGARDS) 
                                is_new = true;
                            break;
                        }
                    }
                }
                if (!is_new) {
                    for (let tt = ml.begin_token; tt !== null && tt.end_char <= ml.end_char; tt = tt.next) {
                        if (tt.get_referent() !== null) {
                            if (tt.get_referent().type_name === "DATE" || tt.get_referent().type_name === "URI") 
                                is_new = true;
                        }
                    }
                }
                if (is_new) {
                    blk = new Array();
                    blocks.push(blk);
                    for (; i < lines.length; i++) {
                        if (lines[i].typ === MailLineTypes.FROM) {
                            if (blk.length > 0 && lines[i].must_be_first_line) 
                                break;
                            blk.push(lines[i]);
                        }
                        else if (((i + 1) < lines.length) && lines[i + 1].typ === MailLineTypes.FROM) {
                            let j = 0;
                            for (j = 0; j < blk.length; j++) {
                                if (blk[j].typ === MailLineTypes.FROM) {
                                    if (blk[j].is_real_from || blk[j].must_be_first_line || blk[j].mail_addr !== null) 
                                        break;
                                }
                            }
                            if (j >= blk.length) {
                                blk.push(lines[i]);
                                continue;
                            }
                            let ok = false;
                            for (j = i + 1; j < lines.length; j++) {
                                if (lines[j].typ !== MailLineTypes.FROM) 
                                    break;
                                if (lines[j].is_real_from || lines[j].must_be_first_line) {
                                    ok = true;
                                    break;
                                }
                                if (lines[j].mail_addr !== null) {
                                    ok = true;
                                    break;
                                }
                            }
                            if (ok) 
                                break;
                            blk.push(lines[i]);
                        }
                        else 
                            break;
                    }
                    i--;
                    continue;
                }
            }
            if (blk === null) 
                blocks.push((blk = new Array()));
            blk.push(lines[i]);
        }
        if (blocks.length === 0) 
            return;
        let ad = kit.get_analyzer_data(this);
        for (let j = 0; j < blocks.length; j++) {
            lines = blocks[j];
            if (lines.length === 0) 
                continue;
            i = 0;
            if (lines[0].typ === MailLineTypes.FROM) {
                let t1 = lines[0].end_token;
                for (; i < lines.length; i++) {
                    if (lines[i].typ === MailLineTypes.FROM) 
                        t1 = lines[i].end_token;
                    else if (((i + 1) < lines.length) && lines[i + 1].typ === MailLineTypes.FROM) {
                    }
                    else 
                        break;
                }
                let _mail = MailReferent._new1599(MailKind.HEAD);
                let mt = new ReferentToken(_mail, lines[0].begin_token, t1);
                _mail.text = MiscHelper.get_text_value_of_meta_token(mt, GetTextAttr.KEEPREGISTER);
                ad.register_referent(_mail);
                _mail.add_occurence_of_ref_tok(mt);
            }
            let i0 = i;
            let t2 = null;
            let err = 0;
            for (i = lines.length - 1; i >= i0; i--) {
                let li = lines[i];
                if (li.typ === MailLineTypes.BESTREGARDS) {
                    t2 = lines[i].begin_token;
                    for (--i; i >= i0; i--) {
                        if (lines[i].typ === MailLineTypes.BESTREGARDS && (lines[i].words < 2)) 
                            t2 = lines[i].begin_token;
                        else if ((i > i0 && (lines[i].words < 3) && lines[i - 1].typ === MailLineTypes.BESTREGARDS) && (lines[i - 1].words < 2)) {
                            i--;
                            t2 = lines[i].begin_token;
                        }
                        else 
                            break;
                    }
                    break;
                }
                if (li.refs.length > 0 && (li.words < 3) && i > i0) {
                    err = 0;
                    t2 = li.begin_token;
                    continue;
                }
                if (li.words > 10) {
                    t2 = null;
                    continue;
                }
                if (li.words > 2) {
                    if ((++err) > 2) 
                        t2 = null;
                }
            }
            if (t2 === null) {
                for (i = lines.length - 1; i >= i0; i--) {
                    let li = lines[i];
                    if (li.typ === MailLineTypes.UNDEFINED) {
                        if (li.refs.length > 0 && (li.refs[0] instanceof PersonReferent)) {
                            if (li.words === 0 && i > i0) {
                                t2 = li.begin_token;
                                break;
                            }
                        }
                    }
                }
            }
            for (let ii = i0; ii < lines.length; ii++) {
                if (lines[ii].typ === MailLineTypes.HELLO) {
                    let _mail = MailReferent._new1599(MailKind.HELLO);
                    let mt = new ReferentToken(_mail, lines[i0].begin_token, lines[ii].end_token);
                    if (mt.length_char > 0) {
                        _mail.text = MiscHelper.get_text_value_of_meta_token(mt, GetTextAttr.KEEPREGISTER);
                        ad.register_referent(_mail);
                        _mail.add_occurence_of_ref_tok(mt);
                        i0 = ii + 1;
                    }
                    break;
                }
                else if (lines[ii].typ !== MailLineTypes.UNDEFINED || lines[ii].words > 0 || lines[ii].refs.length > 0) 
                    break;
            }
            if (i0 < lines.length) {
                if (t2 !== null && t2.previous === null) {
                }
                else {
                    let _mail = MailReferent._new1599(MailKind.BODY);
                    let mt = new ReferentToken(_mail, lines[i0].begin_token, (t2 !== null && t2.previous !== null ? t2.previous : lines[lines.length - 1].end_token));
                    if (mt.length_char > 0) {
                        _mail.text = MiscHelper.get_text_value_of_meta_token(mt, GetTextAttr.KEEPREGISTER);
                        ad.register_referent(_mail);
                        _mail.add_occurence_of_ref_tok(mt);
                    }
                }
                if (t2 !== null) {
                    let _mail = MailReferent._new1599(MailKind.TAIL);
                    let mt = new ReferentToken(_mail, t2, lines[lines.length - 1].end_token);
                    if (mt.length_char > 0) {
                        _mail.text = MiscHelper.get_text_value_of_meta_token(mt, GetTextAttr.KEEPREGISTER);
                        ad.register_referent(_mail);
                        _mail.add_occurence_of_ref_tok(mt);
                    }
                    for (i = i0; i < lines.length; i++) {
                        if (lines[i].begin_char >= t2.begin_char) {
                            for (const r of lines[i].refs) {
                                _mail.add_ref(r, 0);
                            }
                        }
                    }
                }
            }
        }
    }
    
    static initialize() {
        if (MailAnalyzer.m_inited) 
            return;
        MailAnalyzer.m_inited = true;
        try {
            MetaLetter.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            MailLine.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        } catch (ex) {
            throw new Error(ex.message);
        }
        ProcessorService.register_analyzer(new MailAnalyzer());
    }
    
    static static_constructor() {
        MailAnalyzer.ANALYZER_NAME = "MAIL";
        MailAnalyzer.m_inited = false;
    }
}


MailAnalyzer.static_constructor();

module.exports = MailAnalyzer