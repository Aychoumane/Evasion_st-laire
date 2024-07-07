//Ichou Aymane L3B 21007668 

//python3 -m http.server 8000
//http://localhost:8000/

//Il est possible de se déplacer dans l'espace grâce aux flèches. 

let cnv = document.querySelector('#myCanvas');

let renderer = new THREE.WebGLRenderer({canvas: cnv, antialiasing: true});
renderer.setSize(window.innerWidth, window.innerHeight);
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000 );
camera.position.set(0, -5, 20);

let previousTimeStamp = undefined;
let updateTime = 20, elapsed = updateTime+1;

//Variables globales 
let nb_sphere = 200 ; 
let texture = new THREE.TextureLoader().load("assets/images/etoile.png");
let material = new THREE.MeshBasicMaterial({ map: texture});


//Création de la Lune 
let geometry = new THREE.SphereGeometry(3, 50, 50); // radius; nb segment H // nb segment V 
let lune_texture = new THREE.TextureLoader().load("assets/images/lune_5.jpg");
let lune_material = new THREE.MeshBasicMaterial({ map: lune_texture});
let lune = new THREE.Mesh(geometry, lune_material);
scene.add(lune);
 
//Création de la comète, geometrie/texture/emplacement/orientation
let geometry_comete = new THREE.CylinderGeometry( 0, 0.12, 7 ,26); 
let texture_comete  = new THREE.TextureLoader().load("assets/images/degrade.jpeg"); 
let material_comete = new THREE.MeshBasicMaterial( {map: texture_comete } ); 
let comete = new THREE.Mesh( geometry_comete, material_comete ); 
comete.position.x = 0; 
comete.position.y = 5 ;
comete.position.z = 10 ; 
comete.lookAt(-20,-20,0);
scene.add(comete);
 
//Réglages de la caméra 
camera.lookAt(6, 1, 0);
scene.add(camera);
camera.rotateY(-0.5);
camera.rotateX(-0.38);



//Fonction retournant un flottant entre deux valeurs 
function randomF(minimum, maximum) {
    return Math.random() * (maximum - minimum) + minimum;
}

//Fonction retournant un entier entre deux valeurs
function randomI(minimum, maximum){
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

//Création des étoiles, avec des morphologies différentes 
function create_sphere(){
    let sphere_tab = [] ; 
    for (let i = 0; i < nb_sphere; i++) {
        let rand = randomF(0.2, 0.4) ;
        let temp_geometry = new THREE.SphereGeometry( rand , 50, 50);
        let sphere_temp = new THREE.Mesh(temp_geometry, material);
        sphere_temp.position.x = randomF(-30,15) ; 
        sphere_temp.position.y = randomF(-30,15) ;
        sphere_temp.position.z = randomI(-100,100) ; 

        sphere_tab.push(sphere_temp); 
    }
    return sphere_tab
}

//Permet d'ajouter les étoiles à la scène 
function add_sphere(tab_of_sphere, nb_sphere){
    for (let i = 0; i < nb_sphere; i++) {
       //console.log("Ajout de sphere"); 
       scene.add(tab_of_sphere[i]); 
    }
}

//Fonction de génération de mouvement -> donnes des mouvements aléatoire à chaque étoile
function gen_move(nb_sphere){
    let tab_move = [] ; 
    for(let i = 0 ; i< nb_sphere ; i++){
        let temp =[0,0,0] ;
        temp[0] = randomF(-0.5,0.5) ;
        temp[1] = randomF(-0.5,0.5) ;
        temp[2] = randomF(-0.5,0.5) ;
        //console.log(temp[0],temp[1]) ; 
        tab_move.push(temp);
    }
    return tab_move;
}

//Création de toutes les étoiles 
let etoiles_tab = create_sphere(nb_sphere);
add_sphere(etoiles_tab, nb_sphere); 
let tab_of_move = gen_move(nb_sphere);


function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


//Fonction d'actualisation 
function update(timestamp){
    if(previousTimeStamp != undefined){ 
        elapsed = timestamp-previousTimeStamp;
    }
    if(elapsed > updateTime) {
        previousTimeStamp = timestamp;
        for(let i=0; i< nb_sphere ; i++){ 
            etoiles_tab[i].rotation.x += 0.1;
            etoiles_tab[i].rotation.z += 0.1; 

            etoiles_tab[i].position.x += tab_of_move[i][0] ; 
            etoiles_tab[i].position.y += tab_of_move[i][1] ;
            if(etoiles_tab[i].position.z> -300 && etoiles_tab[i].position.z < 300 ){
                etoiles_tab[i].position.z += tab_of_move[i][2] ; 
            }
            else{
                etoiles_tab[i].position.z = 0 ;
            }
        }
        lune.rotation.y += 0.02 ;  
        comete.position.x += 0.075;
        comete.position.y -= 0.075 ; 
        comete.position.z = randomF(-0.1, 0.1) ;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

//"Fonction" qui permet de déplacer la vue de la caméra avec les flèches 
document.addEventListener('keydown', function(event) {
    if(event.key === 'ArrowRight'){
       camera.rotateY(-0.05);
    }
    if(event.key === 'ArrowLeft'){
        camera.rotateY(0.05);
    }
    if(event.key === 'ArrowUp'){
       camera.rotateX(0.05);
    }
    if(event.key === 'ArrowDown'){
        camera.rotateX(-0.05);
    }

});

window.addEventListener('resize', onWindowResize, false);
requestAnimationFrame(update);


