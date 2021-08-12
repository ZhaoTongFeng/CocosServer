
import UObject from "../Object";
import { xclass } from "./ReflectSystem/XBase";
import { UVec2, UColor } from "./UMath";

/**
 * 渲染接口
 * Client Only
 * 在创建GameInstance时进行绑定，如果是客户端就在WorldView里面进行绑定
 */
@xclass(UGraphic)
export default class UGraphic extends UObject {
    //开始绘制
    begDrawDebug() { }

    //结束绘制
    endDrawDebug() { }

    //网格
    drawGrid() { }

    //线
    drawLine(beg: UVec2, end: UVec2, strokeColor: UColor = UColor.RED(), lineWidth: number = 2) { }

    //矩形
    drawRect(x: number, y: number, width, height, strokeColor: UColor = UColor.RED(), fillColor: UColor = UColor.BLACK(), lineWidth: number = 5) { }

    //圆
    drawCircle(x: number, y: number, radius, strokeColor: UColor = UColor.RED()) { }

    //椭圆
    drawEllipse() { }

    //弧线/曲线/部分圆/圆形
    drawArc() { }

    //三次方贝塞尔曲线
    drawBezierCurve() { }

    //二次方贝塞尔曲线
    drawQuadraticCurve() { }
}
