"use strict";
const cheerio = require('cheerio');
const request = require('sync-request');
const fs = require('fs');
const path = require("path-extra");

const regExp = /\'([^']+?)\'/;

const file = path.join(__dirname,"output.tsv");

const url = "http://vrici.lojban.org/~gleki/index.html";
const reqandwrite = function(arg){
  const res = request('GET', arg).getBody();
  const $ = cheerio.load(res);
  let AR=[];
  $('div').each(function() {
    if ($(this).hasClass('example')){
      let acc='';
      $('p[class=title]',this).each(function(){
        acc+=$(this).text().trim().replace(/[\r\n]/g,'').trim()+"\t";
      });
      $(this).find('tr[class=jbo]').each(function(){
        let arr=[];
        $('td',this).each(function(){
          arr.push($(this).text().trim());
        });
        acc+=arr.join(" ").trim()+";";
      });
      $(this).find('p[class=jbophrase]').each(function(){
        let arr=[];
        $(this).each(function(){
          arr.push($(this).text().trim());
        });
        acc+=arr.join(" ").trim()+";";
      });
      $(this).find('p[class=jbo]',this).each(function(){
        acc+=$(this).text().trim().replace(/[\r\n]/g,'').trim()+";";
      });
      $(this).find('p[class=pronunciation-jbo]',this).each(function(){
        acc+=$(this).text().trim().replace(/[\r\n]/g,'').trim()+";";
      });
      acc+="\t";
      $(this).find('tr[class=gloss]').each(function(){
        let arr=[];
        $('td',this).each(function(){
          arr.push($(this).text().trim());
        });
        acc+=arr.join(" ").trim()+";";
      });
      $('div[class=example-contents] > p',this).each(function(){
        if (!$(this).hasClass('jbophrase')){
          acc+=$(this).text().trim().replace(/[\r\n]/g,'').trim()+";";
        }
      });
      $(this).find('p[class=gloss]',this).each(function(){
        acc+=$(this).text().trim().replace(/[\r\n]/g,'').trim()+";";
      });
      acc+="\t";
      $(this).find('p[class=natlang]',this).each(function(){
        acc+=$(this).text().trim().replace(/[\r\n]/g,'').trim()+";";
      });
      $(this).find('p[class=pronunciation-natlang]',this).each(function(){
        acc+=$(this).text().trim().replace(/[\r\n]/g,'').trim()+";";
      });
      AR.push(acc.replace(/;\t/g,'\t').replace(/;$/g,'').replace(/\{2,\}+/g,' '));
    }
  });
  const str=AR.join('\n');
  fs.writeFileSync(file, str);
}

reqandwrite(url);
