/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const FundsKind = require("./../FundsKind");

class FundsMeta extends ReferentClass {
    
    constructor() {
        super();
        this.kind_feature = null;
    }
    
    static initialize() {
        const FundsReferent = require("./../FundsReferent");
        FundsMeta.GLOBAL_META = new FundsMeta();
        let f = FundsMeta.GLOBAL_META.add_feature(FundsReferent.ATTR_KIND, "Класс", 0, 1);
        FundsMeta.GLOBAL_META.kind_feature = f;
        f.add_value(FundsKind.STOCK.toString(), "Акция", null, null);
        f.add_value(FundsKind.CAPITAL.toString(), "Уставной капитал", null, null);
        FundsMeta.GLOBAL_META.add_feature(FundsReferent.ATTR_TYPE, "Тип", 0, 1);
        FundsMeta.GLOBAL_META.add_feature(FundsReferent.ATTR_SOURCE, "Эмитент", 0, 1);
        FundsMeta.GLOBAL_META.add_feature(FundsReferent.ATTR_PERCENT, "Процент", 0, 1);
        FundsMeta.GLOBAL_META.add_feature(FundsReferent.ATTR_COUNT, "Количество", 0, 1);
        FundsMeta.GLOBAL_META.add_feature(FundsReferent.ATTR_PRICE, "Номинал", 0, 1);
        FundsMeta.GLOBAL_META.add_feature(FundsReferent.ATTR_SUM, "Денежная сумма", 0, 1);
    }
    
    get name() {
        const FundsReferent = require("./../FundsReferent");
        return FundsReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Ценная бумага";
    }
    
    get_image_id(obj = null) {
        return FundsMeta.IMAGE_ID;
    }
    
    static static_constructor() {
        FundsMeta.IMAGE_ID = "funds";
        FundsMeta.GLOBAL_META = null;
    }
}


FundsMeta.static_constructor();

module.exports = FundsMeta