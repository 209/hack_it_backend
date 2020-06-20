/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const PartTokenItemType = require("./../../decree/internal/PartTokenItemType");
const PartToken = require("./../../decree/internal/PartToken");
const Referent = require("./../../Referent");
const InstrumentKind = require("./../InstrumentKind");
const DecreeReferent = require("./../../decree/DecreeReferent");

/**
 * Поддержка анализа редакций для фрагментов НПА
 */
class EditionHelper {
    
    static analize_editions(root) {
        if (root.number === 6 && root.kind === InstrumentKind.SUBITEM) {
        }
        if (root.sub_number === 67) {
        }
        if (root.children.length > 1 && root.children[0].kind === InstrumentKind.NUMBER && root.children[1].kind === InstrumentKind.CONTENT) {
            if (root.children[1].begin_token.is_value("УТРАТИТЬ", "ВТРАТИТИ") && root.children[1].begin_token.next !== null && root.children[1].begin_token.next.is_value("СИЛА", "ЧИННІСТЬ")) 
                root.is_expired = true;
        }
        if ((!root.is_expired && root.kind === InstrumentKind.INDENTION && root.begin_token.is_value("АБЗАЦ", null)) && root.begin_token.next !== null && root.begin_token.next.is_value("УТРАТИТЬ", "ВТРАТИТИ")) 
            root.is_expired = true;
        if (root.is_expired || ((root.itok !== null && root.itok.is_expired))) {
            root.is_expired = true;
            if (root.referents === null) 
                root.referents = new Array();
            for (let tt = root.begin_token; tt !== null && tt.end_char <= root.end_char; tt = tt.next) {
                let dec = Utils.as(tt.get_referent(), DecreeReferent);
                if (dec !== null) {
                    if (!root.referents.includes(dec)) 
                        root.referents.push(dec);
                }
            }
            return;
        }
        let i0 = 0;
        for (i0 = 0; i0 < root.children.length; i0++) {
            let ch = root.children[i0];
            if (((ch.kind === InstrumentKind.COMMENT || ch.kind === InstrumentKind.KEYWORD || ch.kind === InstrumentKind.NUMBER) || ch.kind === InstrumentKind.NAME || ch.kind === InstrumentKind.CONTENT) || ch.kind === InstrumentKind.INDENTION) {
            }
            else 
                break;
        }
        if (root.number > 0) {
            let edt1 = EditionHelper._get_last_child(root);
            if (edt1 !== null && edt1.kind === InstrumentKind.EDITIONS && edt1.tag === null) {
                if (EditionHelper._can_be_edition_for(root, edt1) > 0) {
                    if (root.referents === null) 
                        root.referents = edt1.referents;
                    else 
                        for (const r of edt1.referents) {
                            if (!root.referents.includes(r)) 
                                root.referents.push(r);
                        }
                    edt1.tag = edt1;
                }
            }
        }
        if (i0 >= root.children.length) {
            for (const ch of root.children) {
                EditionHelper.analize_editions(ch);
            }
            return;
        }
        let ch0 = root.children[i0];
        let ok = false;
        if (EditionHelper._can_be_edition_for(root, ch0) >= 0) {
            ok = true;
            if (i0 > 0 && ((root.children[i0 - 1].kind === InstrumentKind.CONTENT || root.children[i0 - 1].kind === InstrumentKind.INDENTION)) && ((i0 + 1) < root.children.length)) {
                if (EditionHelper._can_be_edition_for(root.children[i0 - 1], ch0) >= 0) 
                    ok = false;
            }
        }
        if (((i0 + 1) < root.children.length) && EditionHelper._can_be_edition_for(root, root.children[root.children.length - 1]) >= 0 && (EditionHelper._can_be_edition_for(root.children[root.children.length - 1], root.children[root.children.length - 1]) < 0)) {
            ok = true;
            ch0 = root.children[root.children.length - 1];
        }
        if (ok && ch0.tag === null) {
            if (root.referents === null) 
                root.referents = ch0.referents;
            else 
                for (const r of ch0.referents) {
                    if (!root.referents.includes(r)) 
                        root.referents.push(r);
                }
            ch0.tag = ch0;
        }
        for (let i = 0; i < root.children.length; i++) {
            let ch = root.children[i];
            let edt = null;
            let edt2 = null;
            if (ch.number > 0 && i > 0) 
                edt = EditionHelper._get_last_child(root.children[i - 1]);
            if (((i + 1) < root.children.length) && root.children[i + 1].kind === InstrumentKind.EDITIONS) 
                edt2 = root.children[i + 1];
            if (edt !== null) {
                if (EditionHelper._can_be_edition_for(ch, edt) < 1) 
                    edt = null;
            }
            if (edt2 !== null) {
                if (EditionHelper._can_be_edition_for(ch, edt2) < 0) 
                    edt2 = null;
            }
            if (edt !== null && edt.tag === null) {
                if (ch.referents === null) 
                    ch.referents = edt.referents;
                else 
                    for (const r of edt.referents) {
                        if (!ch.referents.includes(r)) 
                            ch.referents.push(r);
                    }
                edt.tag = ch;
            }
            if (edt2 !== null && edt2.tag === null) {
                if (ch.referents === null) 
                    ch.referents = edt2.referents;
                else 
                    for (const r of edt2.referents) {
                        if (!ch.referents.includes(r)) 
                            ch.referents.push(r);
                    }
                edt2.tag = ch;
            }
        }
        for (const ch of root.children) {
            EditionHelper.analize_editions(ch);
        }
    }
    
    static _get_last_child(fr) {
        if (fr.children.length === 0) 
            return fr;
        return EditionHelper._get_last_child(fr.children[fr.children.length - 1]);
    }
    
    static _can_be_edition_for(fr, edt) {
        if (edt === null || edt.kind !== InstrumentKind.EDITIONS || edt.referents === null) 
            return -1;
        if (fr.sub_number3 === 67) {
        }
        let t = edt.begin_token;
        if (t.is_char('(') && t.next !== null) 
            t = t.next;
        if (t.is_value("АБЗАЦ", null)) 
            return (fr.kind === InstrumentKind.INDENTION ? 1 : -1);
        let pt = PartToken.try_attach(t, null, false, false);
        if (pt === null) 
            pt = PartToken.try_attach(t, null, false, true);
        if (pt === null) 
            return 0;
        if (pt.typ === PartTokenItemType.CLAUSE) {
            if (fr.kind !== InstrumentKind.CLAUSE) 
                return -1;
        }
        else if (pt.typ === PartTokenItemType.PART) {
            if (fr.kind !== InstrumentKind.CLAUSEPART && fr.kind !== InstrumentKind.DOCPART && fr.kind !== InstrumentKind.ITEM) 
                return -1;
        }
        else if (pt.typ === PartTokenItemType.ITEM) {
            if (fr.kind !== InstrumentKind.CLAUSEPART && fr.kind !== InstrumentKind.ITEM && fr.kind !== InstrumentKind.SUBITEM) 
                return -1;
        }
        else if (pt.typ === PartTokenItemType.SUBITEM) {
            if (fr.kind !== InstrumentKind.SUBITEM) {
                if (fr.kind === InstrumentKind.ITEM && t.is_value("ПП", null)) {
                }
                else 
                    return -1;
            }
        }
        else if (pt.typ === PartTokenItemType.CHAPTER) {
            if (fr.kind !== InstrumentKind.CHAPTER) 
                return -1;
        }
        else if (pt.typ === PartTokenItemType.PARAGRAPH) {
            if (fr.kind !== InstrumentKind.PARAGRAPH) 
                return -1;
        }
        else if (pt.typ === PartTokenItemType.SUBPARAGRAPH) {
            if (fr.kind !== InstrumentKind.SUBPARAGRAPH) 
                return -1;
        }
        if (pt.values.length === 0) 
            return 0;
        if (fr.number === 0) 
            return -1;
        if (fr.number_string === pt.values[0].value) 
            return 1;
        if (pt.values[0].value.endsWith("." + fr.number_string)) 
            return 0;
        if (fr.number === PartToken.get_number(pt.values[0].value)) {
            if (fr.sub_number === 0) 
                return 1;
        }
        return -1;
    }
}


module.exports = EditionHelper