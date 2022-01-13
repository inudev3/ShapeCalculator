const MAX = 150
class Point {
    constructor(private readonly X:number, private readonly Y:number) {
    }
    get x():number{
        return this.x
    }

    get y():number{
        return this.y
    }
}

const Line = class{
    constructor(private readonly pointA:Point, private readonly pointB:Point ) {
    }
    get dist():number{
        return Line.calcDist(this.pointA, this.pointB)
    }
    static calcDist(pointA:Point, pointB:Point){
        return Math.sqrt((pointA.x-pointB.x)**2+ (pointA.y-pointB.y)**2)
    }
}


class Shape {
    constructor(private readonly points: Point[]) {

    }

    get allPoints(): Point[] {
        return this.points
    }

    get area(): number {
        throw 'factory needed'
    }
    static createShape(points:Point[]):Tri|Rectangle|Polygon{
        let shape;
        if(points.length===3){shape = new Tri(points)}
        if(points.length===4){shape = new Rectangle(points)}
        if(points.length>=5){shape = new Polygon(points)}
        if (shape===undefined){throw 'not defined'}
        return shape;
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
        const s = (line1+line2+line3)/3
        return Math.sqrt(s*(s-line1)*(s-line2)*(s-line3))
    }
}
class Rectangle extends Shape{
    constructor(points:Point[]) {
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
        for(let i=1; i<points.length; i++){
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
            this.points.push(new Point(xandy[0], xandy[1]))
        })
    }
    getPoints(){
        return this.points;
    }
    static print(points:Point[]){
        for(const point of points){
            for(let i=0; i<150; i++){
                for(let j=0; j<150; j++){
                    if(point.x===j && point.y===i){console.log('*')}
                    else{
                        console.log(' ')
                    }
                }
            }
        }
    }
}
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.setPrompt("> (x,y) 형태로 좌표입력(좌표사이는 -으로 구분할 것):")
rl.prompt()
let input;
rl.on("line", function(line:string) {
    const points = new Input(line).getPoints()
    const shape = Shape.createShape(points)
    Input.print(points)
    console.log(shape.area)
})
rl.on("close", function() {
    process.exit()
})