/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const InstrumentKind = require("./../InstrumentKind");

class MetaInstrumentBlock extends ReferentClass {
    
    constructor() {
        super();
        this.kind_feature = null;
    }
    
    static initialize() {
        const InstrumentBlockReferent = require("./../InstrumentBlockReferent");
        MetaInstrumentBlock.GLOBAL_META = new MetaInstrumentBlock();
        MetaInstrumentBlock.GLOBAL_META.kind_feature = MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_KIND, "Класс", 0, 1);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.UNDEFINED.toString(), "Неизвестный фрагмент", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.DOCUMENT.toString(), "Документ", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.INTERNALDOCUMENT.toString(), "Внутренний документ", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.APPENDIX.toString(), "Приложение", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.CONTENT.toString(), "Содержимое", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.HEAD.toString(), "Заголовочная часть", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.TAIL.toString(), "Хвостовая часть", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.NAME.toString(), "Название", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.NUMBER.toString(), "Номер", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.CASENUMBER.toString(), "Номер дела", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.CASEINFO.toString(), "Информация дела", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.EDITIONS.toString(), "Редакции", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.APPROVED.toString(), "Одобрен", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.ORGANIZATION.toString(), "Организация", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.DOCPART.toString(), "Часть документа", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.PLACE.toString(), "Место", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.SIGNER.toString(), "Подписант", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.SUBITEM.toString(), "Подпункт", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.INDENTION.toString(), "Абзац", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.CHAPTER.toString(), "Глава", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.PARAGRAPH.toString(), "Параграф", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.SUBPARAGRAPH.toString(), "Подпараграф", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.LISTHEAD.toString(), "Заголовок списка", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.LISTITEM.toString(), "Элемент списка", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.NOTICE.toString(), "Примечание", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.TYP.toString(), "Тип", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.SECTION.toString(), "Раздел", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.SUBSECTION.toString(), "Подраздел", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.CLAUSE.toString(), "Статья", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.CLAUSEPART.toString(), "Часть", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.DATE.toString(), "Дата", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.DIRECTIVE.toString(), "Директива", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.INDEX.toString(), "Оглавление", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.INDEXITEM.toString(), "Элемент оглавления", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.DOCREFERENCE.toString(), "Ссылка на документ", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.INITIATOR.toString(), "Инициатор", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.PREAMBLE.toString(), "Преамбула", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.ITEM.toString(), "Пункт", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.KEYWORD.toString(), "Ключевое слово", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.COMMENT.toString(), "Комментарий", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.QUESTION.toString(), "Вопрос", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.CITATION.toString(), "Цитата", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.CONTACT.toString(), "Контакт", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.TABLE.toString(), "Таблица", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.TABLEROW.toString(), "Строка таблицы", null, null);
        MetaInstrumentBlock.GLOBAL_META.kind_feature.add_value(InstrumentKind.TABLECELL.toString(), "Ячейка таблицы", null, null);
        let fi2 = MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_KIND, "Класс (доп.)", 0, 1);
        for (let i = 0; i < MetaInstrumentBlock.GLOBAL_META.kind_feature.inner_values.length; i++) {
            fi2.add_value(MetaInstrumentBlock.GLOBAL_META.kind_feature.inner_values[i], MetaInstrumentBlock.GLOBAL_META.kind_feature.outer_values[i], null, null);
        }
        MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_CHILD, "Внутренний элемент", 0, 0).show_as_parent = true;
        MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_NAME, "Наименование", 0, 1);
        MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_NUMBER, "Номер", 0, 1);
        MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_MINNUMBER, "Минимальный номер", 0, 1);
        MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_SUBNUMBER, "Подномер", 0, 1);
        MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_SUB2NUMBER, "Подномер второй", 0, 1);
        MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_SUB3NUMBER, "Подномер третий", 0, 1);
        MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_VALUE, "Значение", 0, 1);
        MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_REF, "Ссылка на объект", 0, 1);
        MetaInstrumentBlock.GLOBAL_META.add_feature(InstrumentBlockReferent.ATTR_EXPIRED, "Утратил силу", 0, 1);
    }
    
    get name() {
        const InstrumentBlockReferent = require("./../InstrumentBlockReferent");
        return InstrumentBlockReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Блок документа";
    }
    
    get_image_id(obj = null) {
        return MetaInstrumentBlock.PART_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaInstrumentBlock.DOC_IMAGE_ID = "decree";
        MetaInstrumentBlock.PART_IMAGE_ID = "part";
        MetaInstrumentBlock.GLOBAL_META = null;
    }
}


MetaInstrumentBlock.static_constructor();

module.exports = MetaInstrumentBlock