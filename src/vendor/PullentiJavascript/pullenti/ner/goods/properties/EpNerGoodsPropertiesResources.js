/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const path = require('path');
const Utils = require("./../../../unisharp/Utils");
const Stream = require("./../../../unisharp/Stream");
const FileStream = require("./../../../unisharp/FileStream");

class EpNerGoodsPropertiesResources {
    static getNames() { return this.names; }
    static getStream(name) {
        let fname = this.getResourceInfo(name);
        if(fname == null) throw new Exception('Resource ' + name + ' not found');
        return new FileStream(fname, 'r');
    }
    static getResourceInfo(name) {
        for (let k = 0; k < 2; k++) 
            for (let i = 0; i < this.names.length; i++) 
                if ((k == 0 && Utils.compareStrings(name, this.names[i]) == 0) || (k == 1 && name.endsWith('.' + this.names[i]))) 
                    return path.join(__dirname, this.names[i]);
        return null;
    }
}

EpNerGoodsPropertiesResources.names = ["shoppingcart.png", "bullet_ball_glass_grey.png"]; 

module.exports = EpNerGoodsPropertiesResources