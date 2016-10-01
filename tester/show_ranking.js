const fs = require('fs');
let generate_zuhe = require('./generate_zuhe')
let generate_pycode = require('./generate_pycode')
let run_code = require('./run_code')
let guys = require('./const.js').guys
let ranking = require('./ranking')
let _ = require('underscore')
require('shelljs/global');

let log = (msg) => console.log('[!!!!!]  ' + msg)

let execOut = (cmd) => exec(cmd, {async : false, silent : true}).stdout.split('\n').filter(s => s.length > 0)

var simulate = (way1, way2, silent) => {
  R = run_code.do(way1, way2)
  if (R.success) {
    if (!silent)
    log(`simulate success with ${way1} ${way2}`)
  } else {
    if (!silent)
    log(`simulate fail with ${way1} ${way2}`)
  }
  return R
}



var newRanking = (feed) => {
  let stringFromArr = (arr) => arr.join('_')
  let ranking = {}

  if (!feed) {
    generate_zuhe.do().forEach((c) => {
      ranking[stringFromArr(c)] = 1000
    })
  } else {
    feed.forEach(teamArrange => {
        //teamArrange : 'Druid_Paladin_Sorcerer'

    })
  }

  return ranking
}

var biggsetName = () => execOut('ls rankings').sort((a,b) => a < b)[0]
execOut('ls rankings').sort((a,b) => a < b)[0];
var read = () => {
  //var name = biggsetName()
  //log('reading ' + name)
  return JSON.parse(execOut('cat rankings/latest.json'))
}
var write = (rk) => {
  //var name = (parseInt(biggsetName().split('.json')[0]) + 1) + '.json'
  //log(name)
  fs.writeFileSync('rankings/latest.json', JSON.stringify(rk))
}




//process.stdout.write(JSON.stringify(newRanking()))
//fs.writeFileSync('rankings/2.json', JSON.stringify(newRanking()))

function playForXTimes(way1, way2, times) {
  i = times
  count1 = 0, tie=0, count2 = 0;
  while (i) {
    obj = simulate(way1, way2, true)
    if (!obj.success) process.exit()
    if (obj.tie) tie++;
    if (obj.team1won) count1 ++;
    if (obj.team2won) count2 ++;
    i--;
  }
  //console.log(`${count1}:${count2}`)
  return {
    first_win : count1 > count2,
    win_ratio : count1 > count2 ? count1 / times : count2 / times,
  }
}
function generateAll() {
  Object.keys(newRanking()).forEach(comb => {
    log(generate_pycode.do('base', comb))
  })
}

//generateAll()

//t = new Date()
//console.log(playForXTimes('Warrior_Warrior_Assassin', 'Sorcerer_Druid_Druid', 10))

 //generateAll()
//console.log(Date.now() - t)

var latestRanking = read()
var unwritten = 0;

var win = 0, lose = 0;

var rk = [];

Object.keys(latestRanking).forEach(k => {
  rk.push({
    name : k,
    elo : latestRanking[k],
  })
})


rk = rk.sort((a, b) => {
  return a.elo < b.elo ? -1 : 1
})

console.log(rk)

/*
  unwritten ++;
  if (unwritten > 10) {
    //write(latestRanking);
    log('writting.....');
    unwritten = 0;
  }*/