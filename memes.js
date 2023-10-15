console.clear();

var cmi = 0;
var mhistory = '';
var mc=0;

function clog(p,m,c){console.log('%c'+p,'color: white; background: ' + c + '; padding: 2px 6px; border-radius: 3px; margin-right: 5px;',m);}

if (localStorage.getItem("username") === null) {
  console.log('No meme history :(')
  mhistory = 'Meme history';
  localStorage.setItem("history", mhistory);
  console.log('History found, importing...')
  mhistory = localStorage.getItem("history");
} else {
  console.log('History found, importing...')
  mhistory = localStorage.getItem("history");
}

if (localStorage.getItem("memecount") === null) {
  console.log('No meme count :(')
  mc=0;
  console.log('Meme count found, importing...')
  mc = localStorage.getItem("memecount");
} else {
  console.log('Meme count found, importing...')
  mc = localStorage.getItem("memecount");
}



function dtmt(){
  /* Actually downloads meme, idk whats happening i used insomnia
  clog('Working','Fetching meme','darkgoldenrod'); /**/
  const options = {method: 'GET', headers: {'User-Agent': 'insomnia/8.2.0'}};
  fetch('https://meme-api.com/gimme/1', options)
    .then(response => parsememe(response))
    .catch(err => console.error(err));
}

function getMeme(){
  /* Removes old memes and does animation thingy */
  /* More complicated than it needs to be, but it works so I don't touch it */
  document.querySelectorAll('.goaway').forEach(function(e){e.remove();});
  document.querySelectorAll('.current').forEach(function(e){e.classList.remove('current');});
  document.querySelectorAll('#meme > div:first-child').forEach(function(e){e.classList.add('goaway');});
  document.querySelectorAll('#meme > div:nth-child(2)').forEach(function(e){e.classList.add('current');});
  dtmt();
}

/* Gets the URL value */
/* No idea how it works, I used ChatGPT */
function parsememe(response) {
  return response.json()
    .then(data => {
      if (data && data.memes && data.memes.length > 0) {
        const firstMeme = data.memes[0];
        const title = firstMeme.title;
        const url = firstMeme.url;
        const post = firstMeme.postLink;
        final(title,url,post);
      }
    });
}
function final(t,u,p){
  /* Get image id (Image file name) */
  var id1 = u.split('/i.redd.it/')[1];
  var id = id1.split('/')[0];
  /* clog('Found ID','Meme ID:'+id,'DarkMagenta'); */

  /* Check if meme viewed before */
  if (mhistory.includes(id)){
    if (cmi > 10){
      /* 10 duplicate memes in a row */
      document.querySelectorAll('.nmprogbar').forEach(function(e){
        e.style.width=cmi*10+'%';
      })
      /* Checks if TMM message exists or not */
      if (typeof(document.querySelector('tmm')) != 'undefined' && document.querySelector('tmm') != null){
        clog('Ok','Stale memes message already exists, won\'t add new one.','darkgreen');
      } else {
        appendTMM();
      }
    } else {
      /* Less than 10 dupe memes in a row, keep checking */
      cmi++;
      document.querySelectorAll('.nmprogbar').forEach(function(e){
        e.style.width=cmi*10+'%';
        document.querySelectorAll('.nmprog').style.display=block;
      })
      clog('Error','Duplicate meme found - #'+cmi,'darkred');
      dtmt();
      return;
    }
  } else{
    cmi=0;
    clog('Success','Meme is fresh','darkgreen');
    mhistory = mhistory+';'+id;
    localStorage.setItem("mhistory", mhistory);
    document.querySelectorAll('tmm.goaway').forEach(function(e){
      e.remove();
    })
    document.querySelectorAll('tmm').forEach(function(e){
      e.classList.add('goaway');
    })
  }

  /* Add meme to page */
  var nextmeme = document.createElement('div');
  nextmeme.innerHTML='<img pl="'+p+'"alt="'+t+'"src="'+u+'">';
  nextmeme.classList.add('nextmeme');
  document.getElementById('meme').appendChild(nextmeme);
  console.log('');
}

/* If there are too many memes */
function appendTMM(){
  var tmm = document.createElement('tmm');
  tmm.innerHTML='<i class="fa-solid fa-spider-web"></i><span>You\'ve seen all the memes.</span><button onclick="cmi=0;getMeme();">Check again?</button><div class="nmprog"><div class="nmprogbar"></div></div>';
  document.getElementById('meme').appendChild(tmm);
}

/* Opens post on Reddit */
function openOrig() {
  window.open(document.querySelector('.current > img').pl, "_blank");
}

/* Adds +1 to meme counter */
function addMC(){
  mc++;
  localStorage.setItem("memecount", mc);
  document.querySelector('#mc').innerHTML=mc;
}

function mbp(){
  getMeme();
  addMC();
}


/* Preloads first 10 memes */
getMeme();
getMeme();
getMeme();
getMeme();
getMeme();
getMeme();
getMeme();
getMeme();
getMeme();
getMeme();

addMC();