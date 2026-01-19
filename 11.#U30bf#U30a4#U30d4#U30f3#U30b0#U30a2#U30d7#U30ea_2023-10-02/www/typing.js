"use strict";

// 私のタイピングゲーム
// 作: 田中太郎

let target = document.getElementById("target");
const cacha = document.getElementById("cacha");
const tan = document.getElementById("tan");
let score = 0;

function start() {
    document.body.addEventListener("keydown", main); 
    tan.play();
}

function main(event) {
    if (target.textContent.charAt(0) == event.key) {
        cacha.play();
        target.textContent = target.textContent.slice(1);
        
        // スコアを増やす
        score += 10;
        document.getElementById("score").textContent = "スコア: " + score;
        
        if (target.textContent.length == 0) {
            end();
        }
    }
}

function end() {
    document.body.removeEventListener("keydown", main);
    tan.play();
    alert("ゲームクリア！スコア: " + score);
}