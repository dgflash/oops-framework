import { Component, _decorator } from 'cc';
import { GameComponent } from '../../core/game/GameComponent';
import { VM } from './ViewModel';

const { ccclass, help, executionOrder } = _decorator;

/**
 * 提供VM环境，控制旗下所有VM节点
 * 一般用于 非全局的 VM绑定,VM 环境与 组件紧密相连
 * （Prefab 模式绑定）
 * VMParent 必须必其他组件优先执行
 * v0.1 修复bug ，现在可以支持 Parent 嵌套 （但是注意性能问题，不要频繁嵌套）
 */
@ccclass
@executionOrder(-1)
@help('https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMParent.md')
export default class VMParent extends GameComponent {
    /** 绑定的标签，可以通过这个tag 获取 当前的 vm 实例 */
    protected tag: string = '_temp';

    /** 需要绑定的私有数据 */
    protected data: any = {};

    /**VM 管理 */
    public VM = VM;

    /**
     * [注意]不能直接覆盖此方法，如果需要覆盖。
     * 只能在该方法内部调用父类的实现 
     *   ```ts
     *       onLoad(){
     *           super.onLoad();
     *       }
     *   ``` 
     * 
     */
    onLoad() {
        if (this.data == null) return;
        this.tag = '_temp' + '<' + this.node.uuid.replace('.', '') + '>';
        VM.add(this.data, this.tag);
        // log(VM['_mvs'],this.tag)
        //搜寻所有节点：找到 watch path
        let comps = this.getVMComponents();
        // console.group();
        for (let i = 0; i < comps.length; i++) {
            const comp = comps[i];
            this.replaceVMPath(comp, this.tag)
        }
        // console.groupEnd()

        this.onBind();

        super.onLoad();
    }

    /**在 onLoad 完成 和 start() 之前调用，你可以在这里进行初始化数据等操作 */
    protected onBind() {

    }

    /**在 onDestroy() 后调用,此时仍然可以获取绑定的 data 数据*/
    protected onUnBind() {

    }

    private replaceVMPath(comp: Component, tag: string) {
        // @ts-ignore
        let path: string = comp['watchPath'];
        // @ts-ignore
        if (comp['templateMode'] == true) {
            // @ts-ignore
            let pathArr: string[] = comp['watchPathArr'];
            if (pathArr) {
                for (let i = 0; i < pathArr.length; i++) {
                    const path = pathArr[i];
                    pathArr[i] = path.replace('*', tag);
                }
            }

        }
        else {
            // VMLabel
            // 遇到特殊 path 就优先替换路径
            if (path.split('.')[0] === '*') {
                // @ts-ignore
                comp['watchPath'] = path.replace('*', tag);
            }
        }
    }

    /** 未优化的遍历节点，获取VM 组件 */
    private getVMComponents() {
        let comps = this.node.getComponentsInChildren('VMBase');
        let parents = this.node.getComponentsInChildren('VMParent').filter(v => v.uuid !== this.uuid);  // 过滤掉自己

        //过滤掉不能赋值的parent
        let filters: any[] = [];
        parents.forEach((node: Component) => {
            filters = filters.concat(node.getComponentsInChildren('VMBase'));
        })

        comps = comps.filter((v) => filters.indexOf(v) < 0);
        return comps;
    }

    /**
     * [注意]不能覆盖此方法，如果需要覆盖。
     * 需要在该方法内部调用父类的实现，再定义自己的方法
     * ```ts
     *   onDestroy(){
     *       super.onDestroy();
     *   }
     * ```
     */
    protected onDestroy() {
        this.onUnBind();

        // 解除全部引用
        VM.remove(this.tag);
        this.data = null;

        super.onDestroy();
    }
}
