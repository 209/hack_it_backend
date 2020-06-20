/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const MetaToken = require("./../../MetaToken");
const TableCellToken = require("./TableCellToken");
const TableHelperTableTypes = require("./TableHelperTableTypes");
const TableRowToken = require("./TableRowToken");

/**
 * Поддержка работы с таблицами, расположенными в текстах. 
 *  Начало таблицы - символ 1Eh, конец - 1Fh, ячейки оканчиваются 07h, 
 *  комбинация 0D 0A 07 - конец строки. 
 *  Данную структуру формирует функция извлечения текстов (ExtractText), так что это - для 
 *  обратного восстановления таблицы в случае необходимости.
 */
class TableHelper {
    
    /**
     * Получить список строк таблицы
     * @param t начальная позиция
     * @param max_char максимальная позиция (0 - не ограничена)
     * @param must_be_start_of_table при true первый символ должен быть 1Eh
     * @return список строк
     */
    static try_parse_rows(t, max_char, must_be_start_of_table) {
        if (t === null) 
            return null;
        let is_tab = false;
        if (must_be_start_of_table) {
            if (!t.is_char(String.fromCharCode(0x1E))) 
                return null;
            is_tab = true;
        }
        let wrapis_tab532 = new RefOutArgWrapper(is_tab);
        let rw = TableHelper.parse(t, max_char, null, wrapis_tab532);
        is_tab = wrapis_tab532.value;
        if (rw === null) 
            return null;
        let res = new Array();
        res.push(rw);
        for (t = rw.end_token.next; t !== null; t = t.next) {
            let wrapis_tab531 = new RefOutArgWrapper(is_tab);
            let rw0 = TableHelper.parse(t, max_char, rw, wrapis_tab531);
            is_tab = wrapis_tab531.value;
            if (rw0 === null) 
                break;
            res.push((rw = rw0));
            t = rw0.end_token;
            if (rw0.last_row) 
                break;
        }
        let rla = res[res.length - 1];
        if (((rla.last_row && rla.cells.length === 2 && rla.cells[0].col_span === 1) && rla.cells[0].row_span === 1 && rla.cells[1].col_span === 1) && rla.cells[1].row_span === 1) {
            let lines0 = rla.cells[0].lines;
            let lines1 = rla.cells[1].lines;
            if (lines0.length > 2 && lines1.length === lines0.length) {
                for (let ii = 0; ii < lines0.length; ii++) {
                    rw = new TableRowToken((ii === 0 ? lines0[ii].begin_token : lines1[ii].begin_token), (ii === 0 ? lines0[ii].end_token : lines1[ii].end_token));
                    rw.cells.push(lines0[ii]);
                    rw.cells.push(lines1[ii]);
                    rw.eor = rla.eor;
                    if (ii === (lines0.length - 1)) {
                        rw.last_row = rla.last_row;
                        rw.end_token = rla.end_token;
                    }
                    res.push(rw);
                }
                Utils.removeItem(res, rla);
            }
        }
        for (const re of res) {
            if (re.cells.length > 1) 
                return res;
            if (re.cells.length === 1) {
                if (TableHelper._contains_table_char(re.cells[0])) 
                    return res;
            }
        }
        return null;
    }
    
    static _contains_table_char(mt) {
        for (let tt = mt.begin_token; tt !== null && tt.end_char <= mt.end_char; tt = tt.next) {
            if (tt instanceof MetaToken) {
                if (TableHelper._contains_table_char(Utils.as(tt, MetaToken))) 
                    return true;
            }
            else if (((tt.is_table_control_char && tt.previous !== null && !tt.previous.is_table_control_char) && tt.next !== null && !tt.next.is_table_control_char) && tt.previous.begin_char >= mt.begin_char && tt.next.end_char <= mt.end_char) 
                return true;
        }
        return false;
    }
    
    static parse(t, max_char, prev, is_tab) {
        if (t === null || ((t.end_char > max_char && max_char > 0))) 
            return null;
        let txt = t.kit.sofa.text;
        let t0 = t;
        if (t.is_char(String.fromCharCode(0x1E)) && t.next !== null) {
            is_tab.value = true;
            t = t.next;
        }
        let tt = null;
        let cell_info = null;
        for (tt = t; tt !== null && ((tt.end_char <= max_char || max_char === 0)); tt = tt.next) {
            if (tt.is_table_control_char) {
                cell_info = new TableHelper.TableInfo(tt);
                if (cell_info.typ !== TableHelperTableTypes.CELLEND) 
                    cell_info = null;
                break;
            }
            else if (tt.is_newline_after) {
                if (!is_tab.value && prev === null) 
                    break;
                if ((tt.end_char - t.begin_char) > 100) {
                    if ((tt.end_char - t.begin_char) > 10000) 
                        break;
                    if (!is_tab.value) 
                        break;
                }
                if (tt.whitespaces_after_count > 15) {
                    if (!is_tab.value) 
                        break;
                }
            }
        }
        if (cell_info === null) 
            return null;
        let res = new TableRowToken(t0, tt);
        res.cells.push(TableCellToken._new533(t, tt, cell_info.row_span, cell_info.col_span));
        for (tt = tt.next; tt !== null && ((tt.end_char <= max_char || max_char === 0)); tt = tt.next) {
            t0 = tt;
            cell_info = null;
            for (; tt !== null && ((tt.end_char <= max_char || max_char === 0)); tt = tt.next) {
                if (tt.is_table_control_char) {
                    cell_info = new TableHelper.TableInfo(tt);
                    break;
                }
                else if (tt.is_newline_after) {
                    if (!is_tab.value && prev === null) 
                        break;
                    if ((tt.end_char - t0.begin_char) > 400) {
                        if ((tt.end_char - t0.begin_char) > 20000) 
                            break;
                        if (!is_tab.value) 
                            break;
                    }
                    if (tt.whitespaces_after_count > 15) {
                        if (!is_tab.value) 
                            break;
                    }
                }
            }
            if (cell_info === null) 
                break;
            if (cell_info.typ === TableHelperTableTypes.ROWEND) {
                if (tt !== t0) 
                    res.cells.push(TableCellToken._new533(t0, tt, cell_info.row_span, cell_info.col_span));
                res.end_token = tt;
                res.eor = true;
                break;
            }
            if (cell_info.typ !== TableHelperTableTypes.CELLEND) 
                break;
            res.cells.push(TableCellToken._new533(t0, tt, cell_info.row_span, cell_info.col_span));
            res.end_token = tt;
        }
        if ((res.cells.length < 2) && !res.eor) 
            return null;
        if (res.end_token.next !== null && res.end_token.next.is_char(String.fromCharCode(0x1F))) {
            res.last_row = true;
            res.end_token = res.end_token.next;
        }
        return res;
    }
    
    static is_cell_end(t) {
        if (t !== null && t.is_char(String.fromCharCode(7))) 
            return true;
        return false;
    }
    
    static is_row_end(t) {
        if (t === null || !t.is_char(String.fromCharCode(7))) 
            return false;
        let ti = new TableHelper.TableInfo(t);
        return ti.typ === TableHelperTableTypes.ROWEND;
    }
}


TableHelper.TableInfo = class  {
    
    toString() {
        return (String(this.typ) + " (" + this.col_span + "-" + this.row_span + ")");
    }
    
    constructor(t) {
        const TableHelperTableTypes = require("./TableHelperTableTypes");
        this.col_span = 0;
        this.row_span = 0;
        this.typ = TableHelperTableTypes.UNDEFINED;
        this.src = null;
        this.src = t;
        if (t === null) 
            return;
        if (t.is_char(String.fromCharCode(0x1E))) {
            this.typ = TableHelperTableTypes.TABLESTART;
            return;
        }
        if (t.is_char(String.fromCharCode(0x1F))) {
            this.typ = TableHelperTableTypes.TABLEEND;
            return;
        }
        if (!t.is_char(String.fromCharCode(7))) 
            return;
        let txt = t.kit.sofa.text;
        this.typ = TableHelperTableTypes.CELLEND;
        let p = t.begin_char - 1;
        if (p < 0) 
            return;
        if ((txt.charCodeAt(p)) === 0xD || (txt.charCodeAt(p)) === 0xA) {
            this.typ = TableHelperTableTypes.ROWEND;
            return;
        }
        this.col_span = (this.row_span = 1);
        for (; p >= 0; p--) {
            if (!Utils.isWhitespace(txt[p])) 
                break;
            else if (txt[p] === '\t') 
                this.col_span++;
            else if (txt[p] === '\f') 
                this.row_span++;
        }
    }
}


module.exports = TableHelper