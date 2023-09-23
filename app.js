/*
**INDEX
*/
//Gestione Menù Responsive
function responsiveNav(){
    var x = document.getElementById("menu");
    if(x.className==="topnav")
        x.className += " responsive";
    else
        x.className = "topnav";
}


/*
**COLLEGAMENTI
*/
//Gestione collegamenti tra le pagine
function vaiAllaHome(){
    window.location = "index.html";
}

function vaiAlleModalita(){
    window.location = "index.html#gioco";
}

function vaiAlGioco(mode){
    if(mode==0)
        window.location = "classic_game.html";
    else if(mode==1)
        window.location = "hard_game.html";
    else if(mode==2)
        window.location = "time_game.html";
    else if(mode==3)
        window.location = "extreme_game.html";
    else if(mode==4)
        window.location = "four_chance_game.html";
    else if(mode==5)
        window.location = "tutorial.html";
}


/*
**GAME
*/
//VARIABILI
var rptGame = 0;
var musica = false;
var soundtrack = document.getElementById("musica");
document.getElementById("fa-volume-up").style.display = "none";
document.getElementById("fa-volume-mute").style.display = "block";

var mode;
var iMode;

var mastermind;
var mastermindRiga;
var mastermindColonna;
var fineRiga;
var fineMastermind;

var incognita = ["", "", "", ""];
var incognitaBackup = ["", "", "", ""];

var colore1 = "red";
var colore2 = "orange";
var colore3 = "yellow";
var colore4 = "green";
var colore5 = "blue";
var colore6 = "purple";
var colore7 = "white";
var colore8 = "black";
var coloreT = "transparent";

var timer; 
var tempoRimanente;
var nGameOver;

var score;
var bestScore = 0;

var mascotteC;
var mascotteSx;
var mascotteDx;
var nomeGiocatore;


//FUNZIONI
//Controllo Audio
function controlloMusica(){
    if(musica){
        musica = false;
        document.getElementById("fa-volume-up").style.display = "none";
        document.getElementById("fa-volume-mute").style.display = "block";

        soundtrack.pause();
    }else{
        musica = true;
        document.getElementById("fa-volume-up").style.display = "block";
        document.getElementById("fa-volume-mute").style.display = "none";

        soundtrack.play();
    }
}

//Inizializzazione
function init(m){
    document.getElementById("win").style.display = "none";
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("score").style.display = "none";

    //Inizializzazione Tabellone
    mode = m;
    if(mode==0 || mode==1 || mode==2 || mode==5){
        iMode = 8;
        mastermind = [["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""]];

    }else if(mode==3){
        iMode = 6;
        mastermind = [["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""]];

    }else if(mode==4){
        iMode = 4;
        mastermind = [["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""],
                      ["", "", "", ""]];
    }

    //Pulisce il Tabellone
    for(var i=0; i<iMode; i++)
        for(var j=0; j<4; j++)
            document.getElementById("scelta-" + (i+1) + "-" + (j+1)).style.backgroundColor = coloreT;

    for(var i=0; i<iMode; i++)
        for(var j=0; j<4; j++)
            document.getElementById("verifica-" + (i+1) + "-" + (j+1)).style.backgroundColor = coloreT;

    for(var i=0; i<4; i++)
        document.getElementById("incognita-" + (i+1)).style.backgroundColor = "rgba(0,0,0,.7)";

    //Set Variabili di Gioco
    mastermindRiga = iMode-1;
    mastermindColonna = 0;
    fineRiga = false;
    fineMastermind = false;

    //Inizializzazione Punteggio
    score = 0;

    //Inizializzazione Tempo
    if(mode==2){
        clearInterval(timer);
        nGameOver = 0;
        tempoRimanente = 90; //Tempo di gioco a disposizione (secondi)
        timer = setInterval(update, 1000);
        document.getElementById("clock").innerHTML = tempoRimanente;
    }

    //Creazione del Codice Segreto
    for(var i=0; i<4; i++){
        if(mode==3)
            incognita[i] = Math.floor(Math.random()*8)+1;
        else
            incognita[i] = Math.floor(Math.random()*6)+1;

        incognitaBackup[i] = incognita[i];
    }

    //console.log(incognita);   //Togliere il commento per visualizzare il codice segreto nella console
    rptGame++;
}

//Gestione Tempo
function update(){
    tempoRimanente--;
    if(tempoRimanente>=0)
        document.getElementById("clock").innerHTML = tempoRimanente;
    else if(nGameOver==0){
        gameOver();
    }
}

//Tutorial
function tutorial(){
    //Animazione mascotte
    document.getElementById("filtro-bg-t").style.display = "block";
    mascotteC = document.getElementById("mascotte-c");
    mascotteC.style.display = "content";
    mascotteSx = document.getElementById("mascotte-sx");
    mascotteSx.style.display = "none";
    mascotteDx = document.getElementById("mascotte-dx");
    mascotteDx.style.display = "content";

    setTimeout(()=>{document.getElementById("filtro-bg-t").style.display = "none";}, 500);

    setTimeout(tutorial1, 500);
}

function tutorial1(){
    //Benvenuto da parte della mascotte
    nomeGiocatore = prompt("Benvenuto su Mastermind NXT, io sono OctoMind e sarò la tua guida, come ti chiami impavido giocatore?");
    alert("Ciao " + nomeGiocatore + ', appena sarai pronto per iniziare il gioco clicca su "OK"');

    init(5);
    mascotteC.style.display = "none";
    mascotteDx.style.display = "block";

    setTimeout(tutorial2, 500);
}

function tutorial2(){
    //Spiegazione del gioco
    alert("In questo gioco creerò dei codici segreti di 4 colori, per vincere dovrai cercare di indovinare la combinazione segreta seguendo i miei aiuti")
    alert("Gli aiuti sono di 2 tipi...");
    alert("...gli aiuti bianchi che indicheranno che un colore all'interno della combinazione è giusto ma nella posizione sbagliata...");
    alert("...e gli aiuti neri che indicheranno che un colore all'interno della combinazione è giusto anche nella sua posizione");
    alert("Per prima cosa seleziona 4 colori così come pensi sia composto il codice, per farlo basterà cliccare sul bottone del colore che vogliamo scegliere");

    setTimeout(tutorial3, 500);
}

function tutorial3(){
    //Movimento mascotte
    mascotteSx = document.getElementById("mascotte-sx");
    mascotteSx.style.display = "block";
    mascotteDx = document.getElementById("mascotte-dx");
    mascotteDx.style.display = "none";
}

//Aggiungere colori al tabellone di gioco
function aggiungi(colore){
    if(fineMastermind==false){
        mastermind[mastermindRiga][mastermindColonna] = colore;
        if(colore==1)
            document.getElementById("scelta-" + (mastermindRiga+1) + "-" + (mastermindColonna+1)).style.backgroundColor = colore1;
        else if(colore==2)
            document.getElementById("scelta-" + (mastermindRiga+1) + "-" + (mastermindColonna+1)).style.backgroundColor = colore2;
        else if(colore==3)
            document.getElementById("scelta-" + (mastermindRiga+1) + "-" + (mastermindColonna+1)).style.backgroundColor = colore3;
        else if(colore==4)
            document.getElementById("scelta-" + (mastermindRiga+1) + "-" + (mastermindColonna+1)).style.backgroundColor = colore4;
        else if(colore==5)
            document.getElementById("scelta-" + (mastermindRiga+1) + "-" + (mastermindColonna+1)).style.backgroundColor = colore5;
        else if(colore==6)
            document.getElementById("scelta-" + (mastermindRiga+1) + "-" + (mastermindColonna+1)).style.backgroundColor = colore6;
        else if(colore==7)
            document.getElementById("scelta-" + (mastermindRiga+1) + "-" + (mastermindColonna+1)).style.backgroundColor = colore7;
        else if(colore==8)
            document.getElementById("scelta-" + (mastermindRiga+1) + "-" + (mastermindColonna+1)).style.backgroundColor = colore8;

        //Verifiche per vedere se siamo arrivati a fine riga o se siamo arrivati a fine gioco
        if(mastermindColonna<3)
            mastermindColonna++;
        else if(mastermindRiga>0)
            fineRiga = true;
        else{
            fineRiga = true;
            fineMastermind = true;
        }
    }

    if(fineRiga==true){
        verifica();
        fineRiga = false;
    }
}

//Verifico se la combinazione è giusta o è errata e se andranno messi dei punti neri e/o bianchi
function verifica(){
    /*
        verifica
        0: Colore e Spazio Sbagliati
        1: Colore Giusto e Spazio Sbagliato
        2: Colore e Spazio Giusti
    */

    var verifica = [0,0,0,0];
    var vittoria = 0;

    //Suggerimenti Bianchi e Neri
    for(var i=0; i<4; i++){
        if(mode!=1){
            for(var j=0; j<4; j++){
                if(mastermind[mastermindRiga][i]==incognitaBackup[j]){ //Suggerimenti Bianchi
                    incognitaBackup[j] = 0;
                    verifica[i] = 1;

                    j = 4;
                }
            }

            if(mastermind[mastermindRiga][i]==incognita[i]) //Suggerimenti Neri
                var indice = verifica.indexOf(1);
                verifica[indice] = 2;
        }else
            if(mastermind[mastermindRiga][i]==incognita[i]) //Suggerimenti Neri
            verifica[i] = 2;
    }

    //Riordino l'array in modo da non far vedere i suggerimenti nella stessa posizione dei colori originali
    verifica.sort();
    verifica.reverse();

    //Mostro a schermo i suggerimenti
    for(var i=0; i<4; i++){
        if(verifica[i]==2){
            document.getElementById("verifica-" + (mastermindRiga+1) + "-" + (i+1)).style.backgroundColor = "black";
            vittoria++;
        }else if(verifica[i]==1)
            document.getElementById("verifica-" + (mastermindRiga+1) + "-" + (i+1)).style.backgroundColor = "white";
    }

    //Ri-salvo l'incognita dentro il backup
    for(var i=0; i<4; i++)
        incognitaBackup[i] = incognita[i];

    //Passaggio alla prossima riga
    mastermindRiga--;
    mastermindColonna = 0;

    //Condizioni di...
    if(vittoria==4) //...vittoria
        win();
    else if(fineMastermind==true){ //...sconfitta
        gameOver();
    }
}

//Rivela il codice segreto una volta vinto o perso il gioco
function rivelaIncognita(){
    for(var i=1; i<5; i++){
        if(incognita[i-1]==1)
            document.getElementById("incognita-" + i).style.backgroundColor = colore1;
        else if(incognita[i-1]==2)
            document.getElementById("incognita-" + i).style.backgroundColor = colore2;
        else if(incognita[i-1]==3)
            document.getElementById("incognita-" + i).style.backgroundColor = colore3;
        else if(incognita[i-1]==4)
            document.getElementById("incognita-" + i).style.backgroundColor = colore4;
        else if(incognita[i-1]==5)
            document.getElementById("incognita-" + i).style.backgroundColor = colore5;
        else if(incognita[i-1]==6)
            document.getElementById("incognita-" + i).style.backgroundColor = colore6;
        else if(incognita[i-1]==7)
            document.getElementById("incognita-" + i).style.backgroundColor = colore7;
        else if(incognita[i-1]==8)
            document.getElementById("incognita-" + i).style.backgroundColor = colore8;
    }
}

//Vittoria
function win(){
    //Se esiste pulisce il timer
    if(mode==2)
        clearInterval(timer);

    //Assegna lo score
    if(mode!=5){
        if(mode==2){
            score = mastermindRiga*100 + tempoRimanente*10 + 200;
        }else
            score = mastermindRiga*100 + 200;

        //Assegna il best score in caso lo score lo superi
        if(score>bestScore){
            bestScore = score;
            nomeGiocatore = prompt("Inserisci il tuo nickname: ");
            document.getElementById("best-score").innerHTML = "<strong>Best Score: " + bestScore + " by " + nomeGiocatore.substr(0, 10) + "</strong>";
        }
    }

    rivelaIncognita();

    //Mostro a schermo la vittoria
    document.getElementById("win").style.display = "block";
    setTimeout(win2, 2000);
}

function win2(){
    //Mostro a schermo lo score
    document.getElementById("win").style.display = "none";
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("score").style.display = "block";

    setTimeout(win3, 2000);
}

function win3(){
    document.getElementById("score").style.display = "none";

    if(score>bestScore){
        bestScore = score;
        nomeGiocatore = prompt("Hai Vinto! Inserisci il tuo nome: ");
        document.getElementById("best-score").innerHTML = "<strong>Best Score: " + bestScore + " by " + nomeGiocatore.substring(0, 9) + "</strong>";
    }
}

//Sconfitta
function gameOver(){
    //Se esiste pulisce il timer
    if(mode==2){
        clearInterval(timer);
        nGameOver = 1;
    }

    rivelaIncognita();
    
    //Mostro a schermo la sconfitta
    document.getElementById("gameOver").style.display = "block";
    setTimeout(gameOver2, 2000);
}

function gameOver2(){
    document.getElementById("gameOver").style.display = "none";
}