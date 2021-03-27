import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  GraphVisualizer,
  IGraphView,
  Template,
  Toolbar,
  ToolButtonList,
  store
} from "graphlabs.core.template";
import { IGraph,
  IVertex,
  IEdge,
  Vertex,
  Edge,
  Graph
} from "graphlabs.core.graphs";
import {MatrixCell, Matrix} from "graphlabs.core.lib";


class App extends Template{

  data = [
    {
      "type": "graph",
      "value": {
            "vertices": [
                "1",
                "2",
                "3",
                "4"
            ],
        "edges": [
            {
            "source": "1",
            "target": "2",
            "name": "1",
            "isDirected": "true"
          },
          {
            "source": "1",
            "target": "3",
            "name": "6",
            "isDirected": "true"
          },
          {
            "source": "2",
            "target": "3",
            "name": "4",
            "isDirected": "true"
          },
          {
            "source": "4",
            "target": "3",
            "name": "2",
            "isDirected": "true"
          },
          {
            "source": "2",
            "target": "4",
            "name": "3",
            "isDirected": "true"
          },
          {
            "source": "4",
            "target": "2",
            "name": "5",
            "isDirected": "true"
          }
        ]
      },
      "isDirected": "true"
    }
  ]


  // data = [
  //   {
  //     "type": "graph",
  //     "value": {
  //       "vertices": [
  //         "1",
  //         "2",
  //         "3",
  //         "4",
  //         "5",
  //         "6",
  //         "7"
  //       ],
  //       "edges": [
  //         {
  //           "source": "1",
  //           "target": "2",
  //           "name": "1",
  //           "isDirected": "true"
  //         },
  //         {
  //           "source": "2",
  //           "target": "3",
  //           "name": "2",
  //           "isDirected": "true"
  //         },
  //         {
  //           "source": "3",
  //           "target": "4",
  //           "name": "3",
  //           "isDirected": "true"
  //         },
  //         {
  //           "source": "4",
  //           "target": "5",
  //           "name": "4",
  //           "isDirected": "true"
  //         },
  //         {
  //           "source": "4",
  //           "target": "1",
  //           "name": "5",
  //           "isDirected": "true"
  //         },
  //         {
  //           "source": "5",
  //           "target": "2",
  //           "name": "6",
  //           "isDirected": "true"
  //         },
  //         {
  //           "source": "1",
  //           "target": "6",
  //           "name": "7",
  //           "isDirected": "true"
  //         },
  //         {
  //           "source": "6",
  //           "target": "7",
  //           "name": "8",
  //           "isDirected": "true"
  //         },
  //         {
  //           "source": "3",
  //           "target": "7",
  //           "name": "9",
  //           "isDirected": "true"
  //         }
  //       ],
  //       "isDirected": "true"
  //     }
  //   }
  // ]

  matrix: number[][] = [];

  //graph: IGraph< IVertex, IEdge> = this.graphMy(this.data[0].value);
  graph: IGraph< IVertex, IEdge> = this.my_graph();

  graphMy(data:any): IGraph<IVertex, IEdge> {
    const graph: IGraph<IVertex, IEdge> = new Graph() as unknown as IGraph<IVertex, IEdge>;
    if (data) {
      let vertices = data.vertices;
      let edges = data.edges;
      //graph.isDirected = data.isDirected;
      vertices.forEach((v: any) => {
        graph.addVertex(new Vertex(v));
      });
      edges.forEach((e: any) => {
        if (e.name) {
          graph.addEdge(new Edge(graph.getVertex(e.source)[0], graph.getVertex(e.target)[0], e.name[0]));
        } else {
          graph.addEdge(new Edge(graph.getVertex(e.source)[0], graph.getVertex(e.target)[0]));
        }
      });

    }
    return graph;
  }

  my_graph():IGraph<IVertex, IEdge>{
    const data = sessionStorage.getItem('variant');
    let graph: IGraph<IVertex, IEdge> = new Graph() as unknown as IGraph<IVertex, IEdge>;
    let objectData;
    try {
      objectData = JSON.parse(data || 'null');
      console.log('The variant is successfully parsed');
    } catch (err) {
      console.log('Error while JSON parsing');
    }
    console.log(this.graphManager(objectData.data[0].value));
    if (data) {
      graph = this.graphManager(objectData.data[0].value);
      console.log('The graph is successfully built from the variant');
    }
    return graph;
  }

  constructor(props: {}) {
    super(props);
    this.calculate = this.calculate.bind(this);
    this.getArea = this.getArea.bind(this);
    this.handler = this.handler.bind(this);
  }


  task() {
    return () => (
        <div>
          <form>
            <span>
                Введите расстояние между всеми парами вершин в матрицу. <br/> <br/>
            </span>
            <p> Если у Вас возникли проблемы, то начните задание сначала.</p>
            <p><button type={"reset"} className={'reset'}
                       style={{border: '1px double black', background: 'white', margin: '5px'}}
                       onClick={()=>this.forceUpdate()}>Начать заново</button></p>
            <p><b>Введите расстояния: </b></p>
            <p><Matrix
                rows={this.graph.vertices.length}
                columns={this.graph.vertices.length}
                readonly={false}
                handler={this.handler}
                matrixFilling={true}
            /></p>
            <br/>
            <br/>
            <br/>
          </form>
        </div>)
  }

  handler(values: number[][]) {
    this.matrix = values;
  }

  getArea(): React.SFC<{}> {
    return () => <GraphVisualizer
        graph={this.graph}
        adapterType={'readable'}
        weightedEdges={true}
        namedEdges={true}
        isDirected={true}
    />;
  }

  public getTaskToolbar() {
    Toolbar.prototype.getButtonList = () => {
      ToolButtonList.prototype.help = () =>
          `В данном задании необходимо определить минимальное расстояние между всеми парами вершин во взвешенном орграфе. 
          Получивший ответ необходимо записать в матрицу, если через вершину не проходит оптимальный путь, то оставьте ячейку матрицы пустой. 
          Если путь в орграфе невозможно найти, то очистите матрицу.
          Если Вы запутались, то кнопка "Начать сначала" позволит начать выполнение работы заново с тем же графом. 
          Клик по ребру окрасит его в зеленый цвет, а повторный клик вернет его в черный. 
          Клик по вершине окрасит ее в красный цвет, а повторный клик вернет прежний цвет вершины. 
          Все это поможет визуально построить путь. 
          Нажмите на этот текст, чтобы скрыть это окно.`;
      ToolButtonList.prototype.beforeComplete = this.calculate;
      return ToolButtonList;
    }
    return Toolbar;
  }

  public algorithmWFI(graph: IGraph<IVertex, IEdge>){
    let matrixOfWeight = [];
    let weight = [];
    for (let i = 0; i < graph.vertices.length; i++) { //матрица смежности для орграфа
      let r: number[] = [];
        for (let j = 0; j < graph.vertices.length; j++) {
            r.push(10000);
          }
      matrixOfWeight.push(r);
    }

    let zeroMatrix = [];
    for (let h = 0; h < graph.vertices.length; h++ ){
      let row: number[] = [];
      for (let j = 0; j < graph.vertices.length; j++) {
        row.push(0);
      }
      zeroMatrix.push(row);
    }

    for (let i = 0; i < graph.vertices.length; i++) { //заполнение матрицы всеми весами
      //let row: number[] = [];
      for (let j = 0; j < graph.vertices.length; j++) {
        if (graph.vertices[j].isAdjacent(graph, graph.vertices[i])) {
          for (let e = 0; e < graph.edges.length; e++) {
            if (graph.edges[e].vertexOne.name === graph.vertices[j].name
                && graph.edges[e].vertexTwo.name === graph.vertices[i].name) {
                  matrixOfWeight[j][i] = +graph.edges[e].name;

            } else if (graph.edges[e].vertexOne.name === graph.vertices[i].name
                && graph.edges[e].vertexTwo.name === graph.vertices[j].name) {
                  matrixOfWeight[i][j] = +graph.edges[e].name;
            }

          }
        }

      }
    }

    weight = matrixOfWeight;

    for (let k = 0; k < graph.vertices.length; k++) {
      for (let i = 0; i < graph.vertices.length; i++) {
        for (let j = 0; j < graph.vertices.length; j++) {
          if (i === j && weight[i][k] + weight[k][j] < 0) { // проверка на отрицательные циклы
            k = graph.vertices.length - 1;
            i = graph.vertices.length - 1;
            j = graph.vertices.length - 1;
            weight = zeroMatrix;
          }
          else if (matrixOfWeight[i][k] < 10000 && matrixOfWeight[k][j] < 10000
              && (matrixOfWeight[i][k] + matrixOfWeight[k][j] < matrixOfWeight[i][j])) {
             {
              weight[i][j] = matrixOfWeight[i][k] + matrixOfWeight[k][j];
            }
          }
        }
      }
    }

    return weight;
  }

  public calculate() {
    for (let k = 0; k < this.graph.vertices.length; k++) {
        console.log(this.matrix[k]);
     }
    for (let k = 0; k < this.graph.vertices.length; k++) {
      console.log(this.algorithmWFI(this.graph)[k]);
    }
    let answer = this.algorithmWFI(this.graph);
    let numCorrectAnswer: number = 0;
    let defaultAnswer: number = 0;
    let res = 0;
    for (let h = 0; h < this.graph.vertices.length; h++){
      for(let p = 0; p < this.graph.vertices.length; p++){
        if (answer[h][p] === this.matrix[h][p]) {
          numCorrectAnswer += 1;
        }
        if (this.matrix[h][p] === 0 && answer[h][p] === 10000){
          defaultAnswer += 1;
        }
      }
    }

    let maxWrongAns = Math.round((this.graph.vertices.length ** 2 - defaultAnswer - 1)/2) ;
    let wrongAnswers = (this.graph.vertices.length ** 2 - (numCorrectAnswer + defaultAnswer));
    if (numCorrectAnswer + defaultAnswer === this.graph.vertices.length ** 2){
      res = 0;
    }
    else if (numCorrectAnswer > maxWrongAns){
      res = Math.round((40/maxWrongAns) * wrongAnswers);
    }
    else {
      res = 50;
    }
    console.log("Количество правильных = " + numCorrectAnswer);
    console.log("Max количество неправильных = " + maxWrongAns);
    console.log("Количество неправильных = " + wrongAnswers);
    let element = document.querySelector('.reset');
    if (element != null){
      element.setAttribute('disabled','disabled');
    }
    return Promise.resolve({success: res === 0, fee: res});
  }

}

export default App;
