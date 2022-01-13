const MAX = 50
class Point {
    constructor(private readonly X:number, private readonly Y:number) {
    }
    get x():number{
        return this.X
    }
    get y():number{
        return this.Y
    }
}

class ShapeFactory{
    static createShape(points:Point[]):Line|Tri|Rectangle|Polygon{
        let shape;
        if(points.length===2){shape = new Line(points)}
        if(points.length===3){shape = new Tri(points)}
        if(points.length===4){shape = new Rectangle(points)}
        if(points.length>=5){shape = new Polygon(points)}
        if (shape===undefined){throw 'not defined'}
        return shape;
    }
}

abstract class Shape {
    constructor(private readonly points: Point[]) {
    }
    get allPoints(): Point[] {
        return this.points
    }
    abstract get area(): number
    print(){
        let star='';

        for (let i = 25; i > 0; i--) {
            for (let j = 25; j >0; j--) {
                let draw = false
                for(const point of this.allPoints){
                    if(point.x===j&& point.y===i){
                        draw = true
                        break;
                    }
                }
                star += draw? '*': ' '
            }
            star += '\n'

        }
        console.log(star)
    }
    printCalc(){
        console.log(`넓이:${this.area}`)
    }
}


class Line extends Shape {
    constructor(points: Point[]) {
        super(points)
    }

    get area(): number {
        throw 'no area calculated'
    }

    get dist(): number {
        const [pointA, pointB] = this.allPoints;
        return Line.calcDist(pointA, pointB)
    }

    static calcDist(pointA: Point, pointB: Point) {
        return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2)
    }

  printCalc() {
      console.log(`거리:${this.dist}`)
  }
}


class Tri extends Shape{
    constructor(points:Point[]) {
        if(points.length!==3){throw 'not a triangle'}
        super(points);
    }
    get area():number{
        const [pointA, pointB, pointC] = this.allPoints;
        return Tri.calcArea(pointA, pointB, pointC)
    }
    static calcArea(pointA:Point, pointB:Point, pointC:Point){
        const line1 = Line.calcDist(pointA, pointB)
        const line2 = Line.calcDist(pointB, pointC)
        const line3 =Line.calcDist(pointC, pointA)
        const s = (line1+line2+line3)/2
        return Math.sqrt(s*(s-line1)*(s-line2)*(s-line3))
    }


}
class Rectangle extends Shape{
    constructor(points:Point[], private readonly width:number|null=null, private readonly height:number|null=null) {

        super(points)
        // else throw "Invalid Rectangle"
    }
    get area():number{
        const  [pointA, pointB, pointC, pointD] = this.allPoints
        return Rectangle.calcArea(pointA, pointB, pointC, pointD)
    }
    static calcArea(pointA:Point, pointB:Point, pointC:Point, pointD:Point){
        const line1 = Line.calcDist(pointA, pointB)
        const line2 = Line.calcDist(pointC, pointD)
        return line1*line2
    }

}
class Polygon extends Shape{
    constructor(points:Point[]) {
        if(points.length<5){throw 'invalid polygon'}
        super(points);
    }
    get area():number {
        return Polygon.calcArea(this.allPoints)
    }
    static calcArea(points:Point[]){
        const standard = points[0]
        let area = 0
        for(let i=1; i<points.length-1; i++){
            area+=Tri.calcArea(standard, points[i], points[i+1])
        }
        return area;
    }
}
class Input{
    private readonly points:Point[];
    constructor(private readonly line:string) {
        this.points = [];
        line.split('-').forEach(coors=>{
            const xandy:number[] = coors.substring(1,coors.length-1).split(',').map(str=>parseInt(str.trim()))
            console.log(xandy)
            if(xandy[0]>24 || xandy[1]>24){throw '24 초과 불가';};
            this.points.push(new Point(xandy[0], xandy[1]));
        })
    }
    getPoints(){
        return this.points;
    }

}
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.setPrompt("> (x,y) 형태로 좌표입력(좌표사이는 -으로 구분할 것, 범위는 최대 24):")
rl.prompt()
let input;
rl.on("line", function(line:string) {
        try {
            const points = new Input(line).getPoints();
            console.log(points);
            const shape = ShapeFactory.createShape(points);
            shape.print();
            shape.printCalc();
        }catch(e){
            console.error(`에러입니다. 다시 입력해주세요.(숫자의 최대 범위-24):${e}`)
            rl.prompt()
        }

})
rl.on("close", function() {
    process.exit()
})