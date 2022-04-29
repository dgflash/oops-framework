"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const JsonToTs_1 = require("./JsonToTs");
const fs = require('fs');
const Excel = require('exceljs');
/**
 * Excel转Json数据
 * @param {*} src           读取的excel文件目录
 * @param {*} dst           导出的json文件目录
 * @param {*} isClient      是否为客户端数据
 */
async function convert(src, dst, ts, name, isClient) {
    const r = {};
    let keys = [];
    let types = [];
    let servers = [];
    let clients = [];
    let fieldType = {};
    const workbook = new Excel.Workbook();
    // 读取excel
    await workbook.xlsx.readFile(src);
    const worksheet = workbook.getWorksheet(1); // 获取第一个worksheet 
    worksheet.eachRow((row, rowNumber) => {
        let data = {};
        // cell.type单元格类型：6-公式 ;2-数值；3-字符串
        row.eachCell((cell, colNumber) => {
            const value = cell.value;
            if (rowNumber === 2) { // 字段名
                keys.push(value);
            }
            else if (rowNumber === 3) { // 字段类型
                types.push(value);
            }
            else if (isClient == false && rowNumber === 4) {
                servers.push(value);
            }
            else if (isClient == true && rowNumber === 5) {
                clients.push(value);
            }
            else {
                let index = colNumber - 1;
                let type = types[index];
                let server = servers[index];
                let client = clients[index];
                let isWrite = isClient && client === "client" || isClient == false && server === "server";
                if (isWrite) {
                    switch (type) {
                        case "int":
                            data[keys[index]] = parseInt(value);
                            fieldType[keys[index]] = "number";
                            break;
                        case "float":
                            data[keys[index]] = parseFloat(value);
                            fieldType[keys[index]] = "number";
                            break;
                        case "string":
                            data[keys[index]] = value;
                            fieldType[keys[index]] = "string";
                            break;
                        case "any":
                            data[keys[index]] = JSON.parse(value);
                            fieldType[keys[index]] = "any";
                            break;
                    }
                }
            }
        });
        if (rowNumber > 5) {
            let id = data["id"];
            delete data["id"];
            r[id] = data;
        }
    });
    // 写入流
    if (r["undefined"] == null) {
        await fs.writeFileSync(dst, JSON.stringify(r));
        (0, JsonToTs_1.createTs)(name, fieldType, r, ts);
        console.log(isClient ? "客户端数据" : "服务器数据", "生成成功", dst);
    }
    else {
        console.log(isClient ? "客户端数据" : "服务器数据", "无数据", dst);
    }
}
function run(src, dst, ts) {
    var inputExcelPath = src + `\\`;
    var outJsonPath = dst + `\\`;
    const files = fs.readdirSync(inputExcelPath);
    files.forEach((f) => {
        let name = f.substring(0, f.indexOf("."));
        let ext = f.toString().substring(f.lastIndexOf(".") + 1);
        if (ext == "xlsx") {
            // excel2json(inputExcelPath + f, outJsonPath + "server/" + name + ".json", false);        // 服务器数据
            convert(inputExcelPath + f, outJsonPath + name + ".json", ts, name, true); // 客户端数据
        }
    });
}
exports.run = run;
