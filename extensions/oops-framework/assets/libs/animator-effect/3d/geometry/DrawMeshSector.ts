/*
 * @Author: dgflash
 * @Date: 2022-02-10 09:50:41
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-08 17:22:27
 */

import { Component, gfx, macro, Material, MeshRenderer, utils, Vec3, _decorator } from 'cc';
const { ccclass, property } = _decorator;

/** 绘制扇形网格 */
@ccclass('DrawSectorMesh')
export class DrawMeshSector extends Component {
    @property({ type: Material })
    public mat: Material | null = null;

    @property({
        tooltip: "外圈半径"
    })
    public radius: number = 5;

    @property({
        tooltip: "内圈半径"
    })
    public innerRadius: number = 1;

    @property({
        tooltip: "扇形角度"
    })
    public angledegree: number = 60;

    start() {
        this.createMesh()
    }

    createMesh() {
        const model = this.addComponent(MeshRenderer)!;
        const segments: number = Math.floor(this.angledegree / 4) + 1;                        // 三角形个数（平滑度）

        var positions: number[] = [];                                                         // 顶点位置数据

        // 组装顶点数据
        var vertices_count: number = segments * 2 + 2;                                        // vertices(顶点)的个数与triangles（索引三角形顶点数）匹配
        var vertices: Array<Vec3> = new Array<Vec3>(vertices_count);
        var angleRad: number = this.angledegree * macro.RAD;                                  // 角度转弧度
        var angleCur: number = angleRad;
        var angledelta: number = angleRad / segments;                                         // 每个三角形的弧度
        for (var i = 0; i < vertices_count; i += 2) {                                         // 扇形每二个三角形之间共用2个顶点，所有生成时每次循环生成二个顶点
            var cosA: number = Math.cos(angleCur);
            var sinA: number = Math.sin(angleCur);

            vertices[i] = new Vec3(this.radius * cosA, 0, this.radius * sinA);                // 已知扇形外圈半径为斜边求x、z值，得到第一个顶点位置（外圈半径顶点）
            vertices[i + 1] = new Vec3(this.innerRadius * cosA, 0, this.innerRadius * sinA);  // 已知扇形内圈半径为斜边求x、z值，得到第二个顶点位置（内圈半径顶点）
            angleCur -= angledelta;

            positions.push(vertices[i].x);
            positions.push(vertices[i].y);
            positions.push(vertices[i].z);
            positions.push(vertices[i + 1].x);
            positions.push(vertices[i + 1].y);
            positions.push(vertices[i + 1].z);
        }


        // 组装三角形数据
        var indice_count: number = segments * 6;                                               // 扇形外圈与扇形内圈会生成一个四边形，即二个三角形，6个顶点索引
        var indices: Array<number> = new Array<number>(indice_count);
        for (var i = 0, vi = 0; i < indice_count; i += 6, vi += 2) {                           // i为三角形顶点索引号，vi为顶点位置索引
            indices[i] = vi;
            indices[i + 1] = vi + 3;
            indices[i + 2] = vi + 1;
            indices[i + 3] = vi + 2;
            indices[i + 4] = vi + 3;
            indices[i + 5] = vi;
        }

        // 组装UV数据
        var uvs: number[] = [];
        for (var i = 0; i < vertices_count; i++) {
            var u = vertices[i].x / this.radius / 2 + 0.5
            var v = vertices[i].z / this.radius / 2 + 0.5
            uvs.push(u, v);
        }

        const primitiveMode = gfx.PrimitiveMode.TRIANGLE_FAN;
        const attributes: any[] = [{
            name: gfx.AttributeName.ATTR_NORMAL,
            format: gfx.Format.RGB32F,
        }];

        var IGeometry = {
            positions: positions,
            indices: indices,
            uvs: uvs,
            primitiveMode: primitiveMode,           // 默认值效果一样，需要研究作用
            attributes: attributes                  // 默认值效果一样，需要研究作用
        }

        const mesh = utils.createMesh(IGeometry);
        model.mesh = mesh;
        model.material = this.mat;
    }
}
