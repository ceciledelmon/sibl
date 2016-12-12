/////////////
//Variables globales
/////////////
var alldata = {}
var dataRestante = []
var allSvgDrawn = []
var questionId = 1
var dataLoaded = false
var width = window.innerWidth
var height = window.innerHeight
var width2 = width>900 ? 900 : width
var height2 = width>570 ? 570 : height
var radius = Math.min(width, height) / 2
var positions = []
var actualQuestion = -1

//Global transition
var t2 = d3.transition()
  .duration(1000)
  .ease(d3.easeLinear);

/////////////
//Parse csv file
/////////////
d3.csv('data.csv')
    .row(row)
    .get(loaded);

function loaded(data) {
  alldata = data
  dataLoaded = true
  d3.select('div#app').style('display', "none")
}

//formattage data
function row(d) {
    return {
        prenom: d.prenom,
        nom: d.nom,
        jour: +d.jour,
        mois: +d.mois,
        annee: +d.annee,
        telephone: booleanalise(d.telephone),
        tablette: booleanalise(d.tablette),
        tour: booleanalise(d.tour),
        twitter: booleanalise(d.twitter),
        bac: d.bac,
        mention: d.mention,
        codeNaissance: d.codeNaissance
    };
}

function booleanalise(string) {
    return string.toUpperCase() === "OUI" ? true : false
}

//timer video loading
var timer = d3.timeout(function(elapsed) {
  if (dataLoaded) {
    d3.select('div.introgif').style('display', "none")
    d3.select('div#app').style('display', "block")
    displayData();
  }
}, 7999)


function getPercentage(key) {
    var base = 0
    alldata.forEach(function(row) {
      if (row[key] == true || row[key] == false) {
        base += row[key] ? 1 : 0
      }else{
        if (row[key] == 's' || row[key] == "Très bien") {
          base += 1
        }
      }
    })
    return Math.round(base * 100 / (alldata.length - 1))
}

function displayData(data) {

    //variable statistique
    var telephoneOui = getPercentage(alldata["columns"][5])
    var tabletteOui = getPercentage(alldata["columns"][6])
    var tourOui = getPercentage(alldata["columns"][7])
    var twitterOui = getPercentage(alldata["columns"][8])
    var bacSOui = getPercentage(alldata["columns"][9]) //"s"
    var mentionTbOui = getPercentage(alldata["columns"][10]) // "Très bien"

    var app = new Vue({
        el: '#app',
        data: {
            questions: [
              {
                question: "",
                answers: [{
                    label: "Commencer",
                    value: "oui",
                    id: "start"
                }],
                id: 0,
                statNumber:"",
                stats: "",
                statsAnswer: ""
            },
              {
                question: "As-tu un",
                questionSpan: "téléphone fixe",
                answers: [{
                    label: "Oui",
                    value: "oui",
                    id: alldata["columns"][5] + "1"
                }, {
                    label: "Non",
                    value: "non",
                    id: alldata["columns"][5] + "2"
                }],
                id: "n1",
                statNumber: telephoneOui+"%",
                stats: "de la classe a répondu",
                statsAnswer: "oui"
            }, {
                question: "As tu une",
                questionSpan: "tablette",
                answers: [{
                    label: "Oui",
                    value: "oui",
                    id: alldata["columns"][6] + "1"
                }, {
                    label: "Non",
                    value: "non",
                    id: alldata["columns"][6] + "2"
                }],
                id: "n2",
                statNumber:tabletteOui + "%",
                stats: "de la classe a repondu",
                statsAnswer: "oui"
            }, {
                question: "Possèdes-tu un ordi",
                questionSpan:"fixe",
                answers: [{
                    label: "Oui",
                    value: "oui",
                    id: alldata["columns"][7] + "1"
                }, {
                    label: "Non",
                    value: "non",
                    id: alldata["columns"][7] + "2"
                }],
                id: "n3",
                statNumber: tourOui+"%",
                stats: "de la classe a repondu",
                statsAnswer: "oui"
            }, {
                question: "As tu un compte",
                questionSpan: "Twitter",
                answers: [{
                    label: "Oui",
                    value: "oui",
                    id: alldata["columns"][8] + "1"
                }, {
                    label: "Non",
                    value: "non",
                    id: alldata["columns"][8] + "2"
                }],
                id: "n4",
                statNumber:twitterOui + "%",
                stats: "de la classe a repondu",
                statsAnswer: "oui"
            }, {
                question: "Tu as obtenu quel",
                questionSpan: "Bac",
                answers: [{
                    label: "Bac S",
                    value: "s",
                    id: alldata["columns"][9] + "1"
                }, {
                    label: "Bac ES",
                    value: "es",
                    id: alldata["columns"][9] + "2"
                }, {
                    label: "Bac L",
                    value: "l",
                    id: alldata["columns"][9] + "3"
                }, {
                    label: "Bac stiaa/std2a",
                    value: "std2a",
                    id: alldata["columns"][9] + "4"
                }, {
                    label: "Bac stg/stmg/sti2d",
                    value: "stmg",
                    id: alldata["columns"][9] + "5"
                }, {
                    label: "Bac Communication",
                    value: "cvpm",
                    id: alldata["columns"][9] + "6"
                }, ],
                id: "n5",
                statNumber: "100%",
                stats: "de la classe a eu son",
                statsAnswer: "bac"
            }, {
                question: "Avec quelle",
                questionSpan: "mention",
                answers: [{
                    label: "Très bien",
                    value: "Très bien",
                    id: alldata["columns"][10] + "1"
                }, {
                    label: "Bien",
                    value: "Bien",
                    id: alldata["columns"][10] + "2"
                }, {
                    label: "Assez bien",
                    value: "Assez bien",
                    id: alldata["columns"][10] + "3"
                }, {
                    label: "Sans mention",
                    value: "Sans mention",
                    id: alldata["columns"][10] + "4"
                }, ],
                id: "n6",
                statNumber:bacSOui + "%",
                stats: "de la classe a eu",
                statsAnswer: "TB"
            }, {
                question: "Quel est ton département",
                questionSpan: "de naissance",
                answers: [{
                    label: "35000",
                    value: "35000",
                    id: "codeNaissance" + "1"
                }, {
                    label: "Suisse",
                    value: "Suisse",
                    id: "codeNaissance" + "2"
                }, {
                    label: "75010",
                    value: "75010",
                    id: "codeNaissance" + "3"
                }, {
                    label: "95600",
                    value: "95600",
                    id: "codeNaissance" + "4"
                }, {
                    label: "93000",
                    value: "93000",
                    id: "codeNaissance" + "5"
                }, {
                    label: "25300",
                    value: "25300",
                    id: "codeNaissance" + "6"
                }, {
                    label: "93160",
                    value: "93160",
                    id: "codeNaissance" + "7"
                }, {
                    label: "94220",
                    value: "94220",
                    id: "codeNaissance" + "8"
                }, {
                    label: "91000",
                    value: "91000",
                    id: "codeNaissance" + "9"
                }, {
                    label: "93130",
                    value: "93130",
                    id: "codeNaissance" + "10"
                }, ],
                id: "n7",
                statNumber:"",
                stats: "",
                statsAnswer: ""
            }],
            win: false,
            started:false,
            result: "",
            dateNaissance: "",
            lastId: 0
        },
        methods: {
            onWin(prenom, jour, mois, annee, lastId) {
                this.result = prenom
                this.dateNaissance = jour+"."+mois+"."+annee
                this.win = true
                this.lastId = lastId
                svgs.forEach(function(svg, i) {
                    var currentIndex = i
                    var x = width2 / 2 + svg.x - 60
                    var y = height2 / 2 + svg.y - 230
                    d3.selectAll('svg')
                      .select('g.'+svg.id)
                      .transition(t)
                      .attr("transform", "translate(" + x + ',' + y + ") scale(1) rotate(0)")
                      .style('opacity', 1)
                })


            },
            onStarted(){
              this.started=true
            }
        }
    })

    var svgs = [{
        id: 'telephone',
        classes: [{
            true: 'cls-1',
            false: 'cls-14'
        }],
        points: '150.61 261.85 182.22 345.57 323.25 345.57 323.25 106.42 150.61 261.84 150.61 261.85',
        x: -17,
        y: 89
    }, {
        id: 'tablette',
        classes: [{
            true: 'cls-2',
            false: 'cls-14'
        }],
        points: '50.36 177.72 50.36 372.64 159.18 372.64 267.64 131.54 50.36 177.72',
        x: -194,
        y: 61
    }, {
        id: 'tour',
        classes: [{
            true: 'cls-3',
            false: 'cls-14'
        }],
        points: '108.77 129.13 108.77 337.18 316.73 129.13 108.77 129.13',
        x: -254,
        y: -146
    }, {
        id: 'twitter',
        classes: [{
            true: 'cls-4',
            false: 'cls-14'
        }],
        points: '154.64 415.69 327 260.27 327 50 303.75 50 95 258.33 95 258.81 154.43 415.7 154.64 415.69',
        x: -21,
        y: -66
    }, {
        id: 'bac',
        classes: [{
            s: 'cls-5',
            es: 'cls-6',
            l: 'cls-7',
            stmg: 'cls-8',
            std2a: 'cls-9',
            cvpm: 'cls-10'
        }, ],
        points: '215.3 337.9 423.36 129.91 206.43 129.91 106.84 229.47 215.3 337.9',
        x: -142,
        y: -146
    }, {
        id: 'mention',
        classes: [{
            "Très bien": 'cls-11',
            "Bien": 'cls-12',
            "Assez bien": 'cls-13',
            "Sans mention": 'cls-14'
        }, ],
        points: '126.19 344.91 325.06 344.91 234.65 103.82 126.19 344.91',
        x: -161,
        y: 89
    }, {
        id: 'codeNaissance',
        classes: [{
            even: 'cls-15',
            odd: 'cls-16'
        }],
        points: '264.28 155.73 155.46 264.19 155.46 310.36 372.74 264.67 372.74 264.19 264.28 155.73',
        x: -300,
        y: -72
    }]

    var even = 'even'

    //display all svg shapes
    alldata.forEach(function(row, i) {
        var currentRow = row
        var tempTab = []
        var globalSvg = d3.select('div#tangram')
            .append('svg')
            .attr('preserveAspectRatio', '')
            .attr('viewbox', '0 0 '+width2+" "+height2)
            .attr('width', width2)
            .attr('height', height2)
            .attr('index', i)
        svgs.forEach(function(svg, i) {
            var currentIndex = i
            var x = width2 / 2 + svg.x -60
            var y = height2 / 2 + svg.y -230
            if (svg.id == "codeNaissance") {
                classe = even == 'even' ? 'odd' : 'even'
            } else {
                var classe = currentRow[svg.id]
            }
            var drawSvg = globalSvg
                .append('g')
                .attr('class', svg.id)
            var polygon = drawSvg
                .attr("transform", "translate(" + x + ',' + y + ")")
                .append('polygon')
                .attr('class', svg.classes[0][classe])
                .attr('points', svg.points)
            tempTab.push(drawSvg)
        })
        allSvgDrawn.push(tempTab)
    })

//question suivante
updateDiv(questionId);

d3.selectAll('input')
      .on('change', function(e) {
          //verification de la réponse
            if (dataRestante.length == 0) {
                dataRestante = checkAnswer(this.id.substring(0, this.id.length - 1), this.value, alldata)
            } else {
                dataRestante = checkAnswer(this.id.substring(0, this.id.length - 1), this.value, dataRestante)
            }
            if (dataRestante.length == 1) {
                app.onWin(dataRestante[0].prenom, dataRestante[0].jour,dataRestante[0].mois,dataRestante[0].annee, actualQuestion);
                questionId = 69;
            }
            if (this.id == 'start') {

              explosion()
              //animation de mouvement apres la repartition
              var timer3 = d3.timeout(function(elapsed) {
                var step = 0;
                d3.selectAll('svg')
                  .each(function(d, i) {
                    var classe = 'animated'+step
                      d3.select(this)
                        .attr('class', classe);
                      if (step == 10) {
                        step = 0
                      }else{
                        step++
                      }
                  })
              }, 750)

              var parent = d3.select(this.parentNode).style('display', "none")
              var parent = d3.select("div#tangramContent").style('display', "none")

              //lancement de la 1ere question
              var timer2 = d3.timeout(function(elapsed) {
                  questionId++
                  updateDiv(questionId)
                  app.onStarted()
              }, 3000)
            }else{
              //lorsque les questions sont deja engage
              questionId++
              updateDiv(questionId)
            }
        })
}


function changeInputOpacity(selection, opacity){
  var input = selection.select('form').select('div').select('input')
                .each(function(d, i) {
                  var questionId = this.id.substring(0, this.id.length - 1)
                  d3.selectAll('g')
                      .each(function(d, i) {
                        if (d3.select(this).attr('class') == questionId) {
                          d3.select(this).transition(t2).style('opacity', opacity)
                        }
                      })
                })
}


function updateDiv(id) {
    var alldiv = d3.selectAll('div.question')
        .each(function(d, i) {
          //i est l'index de la div question
          //id l'index de la question actuelle
            if (i != id - 1) {
              if (id != 1) {
                changeInputOpacity(d3.select(this), 0.15)
              }
                d3.select(this).style("display", "none").classed("line", false)
            } else {
                changeInputOpacity(d3.select(this), 1)
                actualQuestion++
                if (id != 1) {
                  d3.select(this).style("display", "block").classed("line", true)
                }else{
                  d3.select(this).style("display", "block")
                }
                d3.select(this)
                    .selectAll("input")
                    .each(function(d, i) {
                        if (dataRestante.length != 0) {
                            var currentInput = this
                            var disable = true
                            dataRestante.forEach(function(row) {
                                if (currentInput.value == 'oui' || currentInput.value == 'non') {
                                    var value = booleanalise(currentInput.value)
                                } else {
                                    var value = currentInput.value
                                }
                                var id = currentInput.id.substring(0, currentInput.id.length - 1)
                                if (value === row[id]) {
                                    disable = false
                                }
                            })
                            if (disable) {
                                d3.select(currentInput).attr("disabled", true)
                            }
                        }
                    })

            }
        })
}
var t = d3.transition()
  .duration(750)
  .ease(d3.easePolyOut(t, 4.0));

function explosion() {
  d3.selectAll('g')
      .each(function(d, i) {
        var x = d3.randomUniform(-1,1)()
        var y = d3.randomUniform(-0.25*Math.pow(x, 2)+height2-200,0.25*Math.pow(x, 2)+100)()
        if (x<0) {
          x = -(x*(width2))
        }else{
          x = x*(width2)
        }
        var scaleTemp = d3.randomUniform(0.05,0.1)()
        var rotateTemp = d3.randomUniform(0,360)()
        d3.select(this)
            .transition(t)
            .attr("transform", "translate(" + x + ',' + y + ") scale(" + scaleTemp + ") rotate(" + rotateTemp + ")")
        //positions.push({baseX : x, baseY : y, scale:scaleTemp, rotate:rotateTemp})
      })
      //shake(positions)
      return true
}

// function shake(positions) {
//   var timer = d3.interval(function(elapsed) {
//     console.log('elapsed');
//     d3.selectAll('g')
//         .each(function(d, i) {
//           //console.log(i);
//           if (i%2==0){
//             var goToX = positions[i].baseX+10
//             var goToY = positions[i].baseY+10
//           }else{
//
//             var goToX = positions[i].baseX-10
//             console.log(positions[i].baseX, goToX);
//             var goToY = positions[i].baseY-10
//           }
//           d3.select(this)
//               .transition(t)
//               .attr("transform", "translate(" + goToX + ',' + goToY + ") scale(" + positions[i].scale + ") rotate(" + positions[i].rotate + ")")
//         })
//   }, 100);
// }


function checkAnswer(id, answer, tab) {
    if (answer == 'oui' || answer == 'non') {
        answer = booleanalise(answer)
    }
    var newTab = []
    var toKeep = []
        //turn into d3.set
    tab.map(function(row, i) {
        if (row[id] === answer) {
            newTab.push(row)
            toKeep.push(i)
        }
    })
    d3.selectAll('svg')
        .each(function(d, i) {
          var currentI = i
          //console.log(i);
          toKeep.forEach(function(row, index){

          })

          var toKeepFilter = toKeep.some(function(value) {
            return value == i
          })
          if (id != 'star') {
            if (toKeepFilter) {
              //console.log('removed');
            }else{
              d3.select(this).remove()
            }
          }

        })
    toKeep = []
    return newTab
}
