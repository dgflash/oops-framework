import { createTs } from "./JsonToTs";
import { config } from "./main";

const fs = require('fs')
const excel = require('exceljs');

/**
 * Excel转Json数据
 * @param {*} src           读取的excel文件目录
 * @param {*} dst           导出的json文件目录
 * @param {*} name          excel文件名
 * @param {*} isClient      是否为客户端数据
 */
async function convert(src: string, dst: string, name: string, isClient: boolean) {
    let r: any = {};
    let keys: any[] = [];           // 字段名
    let types: any[] = [];          // 通用字段数据类型
    let types_client: any = {};     // 客户端数据类型
    let servers: any[] = [];        // 是否输出服务器字段数据
    let clients: any[] = [];        // 是否输出客户端字段数据
    let primary: string[] = [];     // 多主键配置
    let primary_index: number[] = [];

    const workbook = new excel.Workbook();

    // 读取excel
    await workbook.xlsx.readFile(src);
    const worksheet = workbook.getWorksheet(1);                 // 获取第一个worksheet 
    worksheet.eachRow((row: any, rowNumber: number) => {
        let data: any = {};
        row.eachCell((cell: any, colNumber: number) => {
            const value = cell.value;
            if (rowNumber === 1) {                              // 字段名
                if (value.indexOf("【KEY】") > -1) primary_index.push(colNumber);
            }
            if (rowNumber === 2) {                              // 字段名
                keys.push(value);
                if (primary_index.indexOf(colNumber) > -1) primary.push(value);
            }
            else if (rowNumber === 3) {                         // 通用字段数据类型
                types.push(value);
            }
            else if (isClient == false && rowNumber === 4) {    // 是否输出服务器字段数据
                servers.push(value);
            }
            else if (isClient == true && rowNumber === 5) {     // 客户端数据类型 
                clients.push(value);
            }
            else {
                let index = colNumber - 1;
                let type = types[index];
                let server = servers[index];
                let client = clients[index];
                let isWrite = isClient && client === "client" || isClient == false && server === "server";
                if (isWrite) {
                    let key = keys[index];
                    switch (type) {
                        case "int":
                            data[key] = parseInt(value);
                            types_client[key] = "number";
                            break;
                        case "float":
                            data[key] = parseFloat(value);
                            types_client[key] = "number";
                            break;
                        case "string":
                            data[key] = value;
                            types_client[key] = "string";
                            break;
                        case "any":
                            data[key] = JSON.parse(value);
                            types_client[key] = "any";
                            break;
                    }
                }
            }
        });

        // 生成数据（多主键）
        if (rowNumber > 5) {
            let temp: any = null;
            for (var i = 0; i < primary.length; i++) {
                let k = primary[i];
                let id = data[k];
                delete data[k];           // 主键数据删除

                if (primary.length == 1) {
                    r[id] = data;
                }
                else {
                    if (i == primary.length - 1) {
                        temp[id] = data;
                    }
                    else if (i == 0) {
                        if (r[id] == undefined) {
                            r[id] = {};
                        }
                        temp = r[id];
                    }
                    else {
                        temp[id] = {};
                        temp = temp[id];
                    }
                }
            }
        }
    });

    // 写入流
    if (r["undefined"] == null) {
        await fs.writeFileSync(dst, JSON.stringify(r));

        // 生成客户端脚本
        if (isClient) createTs(name, types_client, r, primary);
        console.log(isClient ? "客户端数据" : "服务器数据", "生成成功", dst);
    }
    else {
        console.log(isClient ? "客户端数据" : "服务器数据", "无数据", dst);
    }
}

export function run() {
    var inputExcelPath = config.PathExcel + `\\`;
    var outJsonPath = config.PathJson + `\\`;
    const files = fs.readdirSync(inputExcelPath);
    files.forEach((f: any) => {
        let name = f.substring(0, f.indexOf("."));
        let ext = f.toString().substring(f.lastIndexOf(".") + 1);
        if (ext == "xlsx") {
            // convert(inputExcelPath + f, inputExcelPath + "server\\" + name + ".json", name, false);        // 服务器数据
            convert(inputExcelPath + f, outJsonPath + name + ".json", name, true);                         // 客户端数据
        }
    });
}